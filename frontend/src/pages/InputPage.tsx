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
    <main className="container app-shell">
      <section className="hero">
        <span className="pill">ATS Intelligence</span>
        <h1>Otimize seu curriculo para cada vaga</h1>
        <p className="muted">
          Design inspirado em dashboards modernos, com identidade propria para o seu produto.
        </p>
        <button className="ghost-btn" type="button" onClick={() => navigate("/")}>
          Voltar para login
        </button>
      </section>

      <form onSubmit={handleSubmit} className="stack card panel">
        <h2 className="section-title">Nova analise</h2>
        <ResumeDropzone file={file} onFileSelect={setFile} />
        <label className="field-label" htmlFor="jobDescription">
          Descricao da vaga
        </label>
        <textarea
          id="jobDescription"
          placeholder="Cole aqui a descricao completa da vaga"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={10}
        />
        {error && <p className="error">{error}</p>}
        <button className="primary-btn" type="submit" disabled={loading || !file || !jobDescription.trim()}>
          {loading ? "Analisando..." : "Analisar compatibilidade"}
        </button>
      </form>
    </main>
  );
}
