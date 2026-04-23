export interface AnalysisResult {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: {
    summary: string;
    bullets: string[];
    keywords: string[];
  };
  rewrittenSummary: string;
}
