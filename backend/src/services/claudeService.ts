import Anthropic from "@anthropic-ai/sdk";
import { AnalysisResult } from "../types/analysis";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractLikelyJson(raw: string): string {
  const trimmed = raw.trim();

  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

function parseAnalysisResult(raw: string): AnalysisResult {
  const candidate = extractLikelyJson(raw);
  return JSON.parse(candidate) as AnalysisResult;
}

export async function analyzeWithClaude(
  resume: string,
  jobDescription: string,
): Promise<AnalysisResult> {
  const message = await client.messages.create({
    model: "claude-opus-4-1-20250805",
    max_tokens: 2048,
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
  });

  const content = message.content[0];
  if (!content || content.type !== "text") {
    throw new Error("Unexpected Claude response format.");
  }

  return parseAnalysisResult(content.text);
}
