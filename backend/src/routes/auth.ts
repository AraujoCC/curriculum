import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  findUserByEmail,
  createUser,
  getUserAnalyses,
  createAnalysis,
  type Analysis,
} from "../database";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Email, password and name are required" });
    }

    const existing = findUserByEmail(email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = createUser(email.toLowerCase(), passwordHash, name);

    const token = jwt.sign({ userId, email: email.toLowerCase() }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, userId, email: email.toLowerCase(), name });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, userId: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

    const user = findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.json({
      userId: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Me error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.get("/analyses", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const analyses = getUserAnalyses(decoded.userId);
    res.json(analyses);
  } catch (error) {
    console.error("Analyses error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/analyses", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const { resumeText, jobDescription, atsScore, matchedKeywords, missingKeywords, suggestions } =
      req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" });
    }

    const analysisId = createAnalysis(
      decoded.userId,
      resumeText,
      jobDescription,
      atsScore,
      matchedKeywords,
      missingKeywords,
      suggestions
    );

    res.json({ id: analysisId });
  } catch (error) {
    console.error("Create analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;