import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import InputPage from "./pages/InputPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import CvBuilderPage from "./pages/CvBuilderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import type { AnalysisResult } from "./types/analysis";
import { ToastContainer, useToast } from "./components/Toast";

const TOKEN_KEY = "auth_token";
const RESULT_KEY = "last_analysis_result";

function AppContent() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const persisted = localStorage.getItem(RESULT_KEY);
    if (persisted) {
      try {
        return JSON.parse(persisted) as AnalysisResult;
      } catch {
        localStorage.removeItem(RESULT_KEY);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const toasts = useToast();

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(false);
    }
    validateToken();
  }, [token]);

  function handleAuth(token: string) {
    setToken(token);
    localStorage.setItem(TOKEN_KEY, token);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(RESULT_KEY);
    setToken(null);
    setResult(null);
  }

  function handleAnalyzed(data: AnalysisResult) {
    setResult(data);
    localStorage.setItem(RESULT_KEY, JSON.stringify(data));
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ff0000",
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        Loading...
      </div>
    );
  }

  const isAuthenticated = token !== null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onAuth={handleAuth} />
            )
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InputPage onAnalyzed={handleAnalyzed} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage result={result} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-builder"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CvBuilderPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default AppContent;
