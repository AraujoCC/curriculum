import initSqlJs, { Database } from "sql.js";
import fs from "fs";
import path from "path";

let db: Database | null = null;

const DB_PATH = path.join(__dirname, "../../data/curriculum.db");

export async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      referral_code TEXT UNIQUE,
      credits INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      resume_text TEXT,
      job_description TEXT,
      ats_score INTEGER,
      matched_keywords TEXT,
      missing_keywords TEXT,
      suggestions TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cvs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      cv_data TEXT,
      generated_text TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  saveDatabase();
  console.log("Database initialized");
}

export function saveDatabase() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export function getDatabase() {
  return db;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  referral_code: string | null;
  credits: number;
  created_at: string;
}

export function findUserByEmail(email: string): User | null {
  if (!db) return null;
  const result = db.exec(`SELECT * FROM users WHERE email = ?`, [email]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  const row = result[0].values[0];
  return {
    id: row[0] as number,
    email: row[1] as string,
    password_hash: row[2] as string,
    name: row[3] as string,
    referral_code: row[4] as string | null,
    credits: row[5] as number,
    created_at: row[6] as string,
  };
}

export function createUser(email: string, passwordHash: string, name: string): number {
  if (!db) throw new Error("Database not initialized");
  const referralCode = generateReferralCode();
  db.run(
    `INSERT INTO users (email, password_hash, name, referral_code) VALUES (?, ?, ?, ?)`,
    [email, passwordHash, name, referralCode]
  );
  saveDatabase();
  const result = db.exec(`SELECT last_insert_rowid()`);
  return result[0].values[0][0] as number;
}

export interface Analysis {
  id: number;
  user_id: number;
  resume_text: string | null;
  job_description: string | null;
  ats_score: number;
  matched_keywords: string;
  missing_keywords: string;
  suggestions: string;
  created_at: string;
}

export function createAnalysis(
  userId: number,
  resumeText: string,
  jobDescription: string,
  atsScore: number,
  matchedKeywords: string[],
  missingKeywords: string[],
  suggestions: string[]
): number {
  if (!db) throw new Error("Database not initialized");
  db.run(
    `INSERT INTO analyses (user_id, resume_text, job_description, ats_score, matched_keywords, missing_keywords, suggestions)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      resumeText,
      jobDescription,
      atsScore,
      JSON.stringify(matchedKeywords),
      JSON.stringify(missingKeywords),
      JSON.stringify(suggestions),
    ]
  );
  saveDatabase();
  const result = db.exec(`SELECT last_insert_rowid()`);
  return result[0].values[0][0] as number;
}

export function getUserAnalyses(userId: number): Analysis[] {
  if (!db) return [];
  const result = db.exec(
    `SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  if (result.length === 0) return [];
  return result[0].values.map((row: unknown[]) => ({
    id: row[0] as number,
    user_id: row[1] as number,
    resume_text: row[2] as string | null,
    job_description: row[3] as string | null,
    ats_score: row[4] as number,
    matched_keywords: row[5] as string,
    missing_keywords: row[6] as string,
    suggestions: row[7] as string,
    created_at: row[8] as string,
  }));
}

function generateReferralCode(): string {
  return `ref_${Math.random().toString(36).substring(2, 8)}`;
}

export interface GeneratedCv {
  id: number;
  user_id: number;
  cv_data: string;
  generated_text: string;
  created_at: string;
}

export function createCv(
  userId: number,
  cvData: string,
  generatedText: string
): number {
  if (!db) throw new Error("Database not initialized");
  db.run(
    `INSERT INTO cvs (user_id, cv_data, generated_text) VALUES (?, ?, ?)`,
    [userId, cvData, generatedText]
  );
  saveDatabase();
  const result = db.exec(`SELECT last_insert_rowid()`);
  return result[0].values[0][0] as number;
}

export function getUserCvs(userId: number): GeneratedCv[] {
  if (!db) return [];
  const result = db.exec(
    `SELECT * FROM cvs WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
  if (result.length === 0) return [];
  return result[0].values.map((row: unknown[]) => ({
    id: row[0] as number,
    user_id: row[1] as number,
    cv_data: row[2] as string,
    generated_text: row[3] as string,
    created_at: row[4] as string,
  }));
}

export function getCvById(userId: number, cvId: number): GeneratedCv | null {
  if (!db) return null;
  const result = db.exec(
    `SELECT * FROM cvs WHERE user_id = ? AND id = ?`,
    [userId, cvId]
  );
  if (result.length === 0 || result[0].values.length === 0) return null;
  const row = result[0].values[0];
  return {
    id: row[0] as number,
    user_id: row[1] as number,
    cv_data: row[2] as string,
    generated_text: row[3] as string,
    created_at: row[4] as string,
  };
}