import Groq from "groq-sdk";
import { AnalysisResult } from "../types/analysis";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

  return JSON.parse(extractLikelyJson(text)) as AnalysisResult;
}
