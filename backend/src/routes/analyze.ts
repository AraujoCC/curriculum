import { Router, Request, Response } from "express";
import multer from "multer";
import { analyzeWithAI } from "../services/aiService";

const { PDFParse } = require("pdf-parse");

async function parsePdf(buffer: Buffer) {
  const uint8Array = new Uint8Array(buffer);
  const pdf = new PDFParse(uint8Array);
  const result = await pdf.getText();
  const text = Array.isArray(result) 
    ? result.map((p: { text?: string }) => p.text || "").join("\n") 
    : String(result);
  return { text };
}

const router = Router();

// PDF magic bytes: "%PDF-"
const PDF_MAGIC = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]);

function isPdf(buffer: Buffer): boolean {
  return buffer.length >= 5 && buffer.subarray(0, 5).equals(PDF_MAGIC);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

router.post("/analyze", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    if (!isPdf(req.file.buffer)) {
      return res.status(415).json({ error: "The uploaded file is not a valid PDF." });
    }

    const jobDescription = req.body?.jobDescription;
    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 20
    ) {
      return res.status(400).json({
        error: "jobDescription is required and must have at least 20 characters.",
      });
    }

    const resultPdf = await parsePdf(req.file.buffer);
    const resumeText = resultPdf.text;

    if (!resumeText || resumeText.trim().length < 10) {
      return res.status(422).json({
        error:
          "Could not extract text from the PDF. Make sure it is not scanned/image-only.",
      });
    }

    const result = await analyzeWithAI(resumeText, jobDescription);
    return res.json(result);
  } catch (error) {
    console.error("Analyze error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: `Failed to analyze resume: ${message}` });
  }
});

export default router;