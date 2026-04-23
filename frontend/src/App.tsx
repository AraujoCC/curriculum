import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import InputPage from "./pages/InputPage";
import DashboardPage from "./pages/DashboardPage";
import type { AnalysisResult } from "./types/analysis";

const STORAGE_KEY = "ats_resume_analysis_result";

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (!persisted) return null;

    try {
      return JSON.parse(persisted) as AnalysisResult;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (result) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
  }, [result]);

  return (
    <Routes>
      <Route path="/" element={<InputPage onAnalyzed={setResult} />} />
      <Route path="/dashboard" element={<DashboardPage result={result} />} />
    </Routes>
  );
}

export default App;
