import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateCvWithAi } from "../services/cvService";
import { createCv, getUserCvs, getCvById, saveDatabase } from "../database";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

interface CvData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const cvData: CvData = req.body;

    if (!cvData.fullName || !cvData.email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }

    const generatedText = await generateCvWithAi(cvData);

    const cvId = createCv(
      decoded.userId,
      JSON.stringify(cvData),
      generatedText
    );

    res.json({ id: cvId, text: generatedText });
  } catch (error) {
    console.error("Create CV error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const cvs = getUserCvs(decoded.userId);
    res.json(cvs);
  } catch (error) {
    console.error("Get CVs error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const cv = getCvById(decoded.userId, parseInt(req.params.id as string));
    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }

    res.json(cv);
  } catch (error) {
    console.error("Get CV error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;