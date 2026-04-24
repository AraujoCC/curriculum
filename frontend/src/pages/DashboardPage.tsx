import { useNavigate } from "react-router-dom";
import type { AnalysisResult } from "../types/analysis";
import "./DashboardPage.css";

interface Props {
  result: AnalysisResult | null;
  onLogout: () => void;
}

type DashboardItem = {
  id: string;
  title: string;
  status: "otimizado" | "incompativel" | "pendente";
  date: string;
  tags: string[];
  scoreBefore?: number;
  scoreAfter?: number;
  score?: number;
  type: "analise" | "cv";
};

const statusConfig = {
  otimizado: {
    label: "OTIMIZADO",
    bg: "#0d2b0d",
    color: "#4ade80",
    border: "#1a4a1a",
  },
  incompativel: {
    label: "INCOMPATIVEL",
    bg: "#2b0d0d",
    color: "#f87171",
    border: "#4a1a1a",
  },
  pendente: {
    label: "CV GERADO",
    bg: "#1a1505",
    color: "#fbbf24",
    border: "#3a2e0a",
  },
};

export default function DashboardPage({ result, onLogout }: Props) {
  const navigate = useNavigate();

  const dynamicItem: DashboardItem | null = result
    ? {
        id: "live",
        title: "ULTIMA ANALISE ATS",
        status: result.atsScore >= 70 ? "otimizado" : "incompativel",
        date: new Date()
          .toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
          .toUpperCase(),
        tags: result.matchedKeywords.slice(0, 3).map((k) => k.toUpperCase()),
        scoreBefore: Math.max(0, result.atsScore - 18),
        scoreAfter: result.atsScore,
        type: "analise",
      }
    : null;

  const data = dynamicItem ? [dynamicItem] : [];

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-logo">C</div>
        <button className="nav-logout" onClick={onLogout}>
          Sair
        </button>
      </nav>

      <div className="dashboard-body">
        <div className="dashboard-main">
          <div className="action-cards">
            <button
              className="action-btn primary-action"
              onClick={() => navigate("/analyze")}
            >
              <div>
                <div className="action-title">Analisar Currículo</div>
                <div className="action-subtitle">
                  Compare seu currículo com uma vaga
                </div>
              </div>
            </button>

            <button className="action-btn" type="button" onClick={() => navigate("/cv-builder")}>
              <div>
                <div className="action-title">Criar Currículo</div>
                <div className="action-subtitle">
                  Gere um novo currículo
                </div>
              </div>
            </button>
          </div>

          <div className="card-list-title">Histórico</div>

          <div className="card-list">
            {data.length === 0 && (
              <div className="card-row empty">
                Nenhuma análise feita ainda.
              </div>
            )}

            {data.map((item) => {
              const st = statusConfig[item.status];
              return (
                <div key={item.id} className="card-row">
                  <div className="card-header">
                    <div className="card-meta">
                      <div className="card-badges">
                        <span
                          className={`status-badge ${item.status}`}
                          style={{
                            background: st.bg,
                            color: st.color,
                            border: `1px solid ${st.border}`,
                          }}
                        >
                          {st.label}
                        </span>
                        <span className="card-date">{item.date}</span>
                      </div>

                      <div className="card-title">{item.title}</div>

                      {item.tags.length > 0 && (
                        <div className="card-tags">
                          {item.tags.map((tag) => (
                            <span key={tag} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="card-score">
                        {item.type === "analise" &&
                          item.scoreBefore !== undefined &&
                          item.scoreAfter !== undefined && (
                            <span>
                              <span className="score-before">{item.scoreBefore}</span>
                              <span className="score-arrow"> → </span>
                              <span className="score-after">
                                {item.scoreAfter}
                              </span>
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="side-card">
            <div className="stat-title">Último Score ATS</div>
            <div className="stat-value-large">{result?.atsScore ?? "—"}</div>
          </div>

          <div className="side-card">
            <div className="stat-title">Palavras-chave encontradas</div>
            <div className="keywords-list">
              {result?.matchedKeywords.slice(0, 8).map((kw) => (
                <span key={kw} className="keyword-tag">{kw}</span>
              )) || <span className="muted-text">Nenhuma</span>}
            </div>
          </div>

          <div className="side-card">
            <div className="stat-title">Pontos a melhorar</div>
            <div className="suggestions-list">
              {result?.suggestions?.bullets?.slice(0, 4).map((s: string, i: number) => (
                <div key={i} className="suggestion-item">• {s}</div>
              )) || <span className="muted-text">Nenhuma sugestão</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}