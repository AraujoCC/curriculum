import { Router } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { analyzeWithClaude } from "../services/claudeService";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    const jobDescription = req.body?.jobDescription;
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "jobDescription is required." });
    }

    const parser = new PDFParse({ data: req.file.buffer });
    const { text: resumeText } = await parser.getText();
    await parser.destroy();
    const result = await analyzeWithClaude(resumeText, jobDescription);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to analyze resume." });
  }
});

export default router;
