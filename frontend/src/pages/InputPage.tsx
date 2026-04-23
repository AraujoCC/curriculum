import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ResumeDropzone from "../components/ResumeDropzone";
import { useAnalyze } from "../hooks/useAnalyze";
import type { AnalysisResult } from "../types/analysis";

interface Props {
  onAnalyzed: (data: AnalysisResult) => void;
}

export default function InputPage({ onAnalyzed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const { analyze, loading, error } = useAnalyze();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!file || !jobDescription.trim()) return;
    try {
      const data = await analyze(file, jobDescription);
      onAnalyzed(data);
      navigate("/dashboard");
    } catch {
      // Error state is already handled inside the hook.
    }
  }

  return (
    <main className="container">
      <h1>ATS Resume Analyzer</h1>
      <p>Envie seu curriculo PDF e compare com a descricao da vaga.</p>

      <form onSubmit={handleSubmit} className="stack">
        <ResumeDropzone file={file} onFileSelect={setFile} />
        <textarea
          placeholder="Cole aqui a descricao da vaga"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={10}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading || !file || !jobDescription.trim()}>
          {loading ? "Analisando..." : "Analisar"}
        </button>
      </form>
    </main>
  );
}
