import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import analyzeRouter from "./routes/analyze";
import authRouter from "./routes/auth";
import cvRouter from "./routes/cv";
import { initDatabase } from "./database";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY not found!");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
  })
);

app.use(express.json({ limit: "1mb" }));

const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a minute and try again." },
});

app.use("/api/analyze", analyzeLimiter);

app.use("/api/auth", authRouter);
app.use("/api/cv", cvRouter);
app.use("/api", analyzeRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === "Only PDF files are allowed.") {
    return res.status(415).json({ error: err.message });
  }
  if (err.message?.includes("File too large")) {
    return res.status(413).json({ error: "File exceeds the 5 MB limit." });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error." });
});

async function start() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
}

start();