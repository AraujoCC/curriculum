import Groq from "groq-sdk";
import { z } from "zod";
import { AnalysisResult } from "../types/analysis";

// ── Runtime schema — validates the AI response before it reaches the client ───
const AnalysisResultSchema = z.object({
  atsScore: z.number().min(0).max(100),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.object({
    summary: z.string(),
    bullets: z.array(z.string()),
    keywords: z.array(z.string()),
  }),
  rewrittenSummary: z.string(),
});

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing. Set it in backend/.env.");
  }
  return new Groq({ apiKey });
}

function extractLikelyJson(raw: string): string {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) return fencedMatch[1].trim();

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

export async function analyzeWithAI(
  resume: string,
  jobDescription: string,
): Promise<AnalysisResult> {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
Você é um especialista em ATS (Applicant Tracking System).

Analise o currículo abaixo em relação à vaga e retorne um JSON com:
{
  "atsScore": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": {
    "summary": string,
    "bullets": string[],
    "keywords": string[]
  },
  "rewrittenSummary": string
}

CURRÍCULO:
${resume}

VAGA:
${jobDescription}

Responda APENAS com o JSON, sem texto adicional.
        `,
      },
    ],
    temperature: 0.3,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Unexpected Groq response format.");

  const parsed = JSON.parse(extractLikelyJson(text));

  // Validate against the Zod schema — throws ZodError if the AI response is malformed
  const validated = AnalysisResultSchema.parse(parsed);
  return validated as AnalysisResult;
}
