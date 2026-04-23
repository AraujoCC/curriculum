import { useState } from "react";
import axios from "axios";
import type { AnalysisResult } from "../types/analysis";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
});

export function useAnalyze() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze(file: File, jobDescription: string) {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const { data } = await api.post<AnalysisResult>("/api/analyze", formData);
      setResult(data);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Erro ao analisar currículo."
        : "Erro ao analisar currículo.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { analyze, loading, result, setResult, error };
}
