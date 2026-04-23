import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import InputPage from "./pages/InputPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import type { AnalysisResult } from "./types/analysis";

const USER_KEY = "ats_resume_current_user";
const RESULT_PREFIX = "ats_resume_analysis_result_";

function getResultStorageKey(userEmail: string | null) {
  return `${RESULT_PREFIX}${userEmail ?? "guest"}`;
}

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem(USER_KEY));
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function loadUserResult(userEmail: string | null) {
    const key = getResultStorageKey(userEmail);
    const persisted = localStorage.getItem(key);
    if (!persisted) return null;
    try {
      return JSON.parse(persisted) as AnalysisResult;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  useEffect(() => {
    setResult(loadUserResult(currentUser));
  }, [currentUser]);

  function handleAuth(mode: "login" | "signup", email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    setCurrentUser(normalizedEmail);
    localStorage.setItem(USER_KEY, normalizedEmail);

    if (mode === "signup") {
      localStorage.removeItem(getResultStorageKey(normalizedEmail));
      setResult(null);
    } else {
      setResult(loadUserResult(normalizedEmail));
    }
  }

  useEffect(() => {
    const key = getResultStorageKey(currentUser);
    if (!currentUser || !result) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(result));
  }, [result, currentUser]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage onAuth={handleAuth} />} />
      <Route path="/analyze" element={<InputPage onAnalyzed={setResult} />} />
      <Route path="/dashboard" element={<DashboardPage result={result} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
