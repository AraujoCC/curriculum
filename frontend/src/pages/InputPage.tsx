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
      // erro tratado no hook
    }
  }

  return (
    <main className="container app-shell">
      <section className="hero">
        <h1>Analisar Currículo</h1>
        <p className="muted">
          Cole a descrição da vaga para comparar com seu currículo
        </p>
        <button className="ghost-btn" type="button" onClick={() => navigate("/dashboard")}>
          Voltar
        </button>
      </section>

      <form onSubmit={handleSubmit} className="stack card panel">
        <h2 className="section-title">Upload do currículo</h2>
        <ResumeDropzone file={file} onFileSelect={setFile} />
        
        <label className="field-label" htmlFor="jobDescription">
          Descrição da vaga
        </label>
        <textarea
          id="jobDescription"
          placeholder="Cole aqui a descrição da vaga"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={10}
        />
        
        {error && <p className="error">{error}</p>}
        
        <button 
          className="primary-btn" 
          type="submit" 
          disabled={loading || !file || !jobDescription.trim()}
        >
          {loading ? "Analisando..." : "Analisar"}
        </button>
      </form>
    </main>
  );
}