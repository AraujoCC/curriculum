import { useNavigate } from "react-router-dom";
import type { AnalysisResult } from "../types/analysis";

interface Props {
  result: AnalysisResult | null;
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
  otimizado: { label: "OTIMIZADO", bg: "#0d2b0d", color: "#4ade80", border: "#1a4a1a" },
  incompativel: { label: "INCOMPATIVEL", bg: "#2b0d0d", color: "#f87171", border: "#4a1a1a" },
  pendente: { label: "CV GERADO", bg: "#1a1505", color: "#fbbf24", border: "#3a2e0a" },
};

const navItems = ["HOME", "GESTOR DE APLICACOES", "BUSCAR VAGAS", "SUGESTOES", "AFILIACAO"];

export default function DashboardPage({ result }: Props) {
  const navigate = useNavigate();
  const dynamicItem: DashboardItem | null = result
    ? {
        id: "live",
        title: "ULTIMA ANALISE ATS",
        status: result.atsScore >= 70 ? "otimizado" : "incompativel",
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase(),
        tags: result.matchedKeywords.slice(0, 3).map((k) => k.toUpperCase()),
        scoreBefore: Math.max(0, result.atsScore - 18),
        scoreAfter: result.atsScore,
        type: "analise",
      }
    : null;
  const data = dynamicItem ? [dynamicItem] : [];
  const activityGrid = Array.from({ length: 7 * 18 }, (_, i) => ({
    active: i % 7 === 0 || i % 11 === 0,
    highlight: i === 7 * 18 - 3,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#d4d4d4", fontFamily: "'IBM Plex Mono', monospace" }}>
      <style>{`
        .nav-item { font-size: 11px; letter-spacing: 0.12em; cursor: pointer; padding: 6px 0; color: #555; border-bottom: 2px solid transparent; }
        .nav-item.active { color: #fb7185; border-bottom-color: #fb7185; }
        .card-row { background: #0e0e0e; border: 1px solid #1a1a1a; border-radius: 8px; padding: 18px 20px; }
        .tag { font-size: 11px; color: #555; }
        .side-card { background: #0e0e0e; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px 18px; }
        .action-btn { flex: 1; background: #111; border: 1px solid #1e1e1e; border-radius: 8px; padding: 14px 16px; cursor: pointer; color: #d4d4d4; text-align: left; display: flex; align-items: center; justify-content: space-between; }
        .action-btn.primary-action { border-color: #fb7185; background: #2a0f16; }
      `}</style>

      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0 32px", display: "flex", alignItems: "center", gap: 32, height: 48 }}>
        {navItems.map((item, idx) => (
          <span key={item} className={`nav-item ${idx === 0 ? "active" : ""}`}>
            {item}
          </span>
        ))}
        <div style={{ marginLeft: "auto", color: "#555", fontSize: 11 }}>&gt; SUPORTE &nbsp; &gt; CONFIG</div>
      </div>

      <div style={{ display: "flex", gap: 20, padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24, border: "1px solid #1a1a1a", borderRadius: 10, padding: 16, background: "#0e0e0e" }}>
            <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 20, marginBottom: 10, fontSize: 11, color: "#444" }}>
              <span>FLT A-001</span>
              <span>STATUS <span style={{ color: "#fb7185" }}>{result ? "ALL_DONE" : "NEW_USER"}</span></span>
              <span>PEND -</span>
              <span>AVG <span style={{ color: "#4ade80" }}>{result ? `+${Math.max(0, result.atsScore - 50)}PT` : "+0PT"}</span></span>
              <span>CRED <span style={{ color: "#fb7185" }}>00</span></span>
            </div>
            <button className="action-btn primary-action" onClick={() => navigate("/analyze")}>
              <div>
                <div style={{ color: "#fb7185", fontSize: 13, marginBottom: 4 }}>↵ ENTER</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#f0f0f0" }}>ANALISAR NOVA VAGA</div>
                <div style={{ fontSize: 11, color: "#555" }}>{result ? "ULTIMA ANALISE SALVA" : "COMECE SUA PRIMEIRA ANALISE"}</div>
              </div>
              <span style={{ color: "#fb7185" }}>→</span>
            </button>
            <button className="action-btn" type="button">
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4, color: "#333" }}>C</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#f0f0f0" }}>CRIAR CV</div>
                <div style={{ fontSize: 11, color: "#555" }}>GERE UM CV PROFISSIONAL A PARTIR DO SEU HISTORICO</div>
              </div>
              <span style={{ color: "#555" }}>→</span>
            </button>
          </div>

          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #1a1a1a", marginBottom: 16, fontSize: 11 }}>
            <span style={{ color: "#fb7185", paddingBottom: 6, borderBottom: "2px solid #fb7185" }}>TODOS</span>
            <span style={{ color: "#555", paddingBottom: 6 }}>OTIMIZACOES</span>
            <span style={{ color: "#555", paddingBottom: 6 }}>CVS</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.length === 0 && (
              <div className="card-row" style={{ color: "#666" }}>
                NENHUMA ANALISE AINDA. CLIQUE EM "ANALISAR NOVA VAGA" PARA COMECAR.
              </div>
            )}
            {data.map((item) => {
              const st = statusConfig[item.status];
              return (
                <div key={item.id} className="card-row">
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 4, border: `1px solid ${st.border}`, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                        <span style={{ fontSize: 11, color: "#444" }}>{item.date}</span>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#e0e0e0", marginBottom: item.tags.length > 0 ? 8 : 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {item.title}
                      </div>
                      {item.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 12 }}>
                          {item.tags.map((tag) => (
                            <span key={tag} className="tag">· {tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ marginTop: 10, fontSize: 18, fontWeight: 600 }}>
                        {item.type === "analise" && item.scoreBefore && item.scoreAfter && (
                          <span>
                            <span style={{ color: "#555" }}>{item.scoreBefore}</span>
                            <span style={{ color: "#555" }}> → </span>
                            <span style={{ color: "#4ade80" }}>{item.scoreAfter}</span>
                            <span style={{ color: "#4ade80", fontSize: 13, marginLeft: 6 }}>(+{item.scoreAfter - item.scoreBefore})</span>
                          </span>
                        )}
                        {item.type === "analise" && item.scoreBefore && !item.scoreAfter && <span style={{ color: "#f87171" }}>{item.scoreBefore}</span>}
                        {item.type === "cv" && item.score !== undefined && (
                          <span>
                            <span style={{ color: "#666", fontSize: 12 }}>SCORE: </span>
                            <span style={{ color: "#fbbf24" }}>{item.score}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <button style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 16 }}>⋮</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="side-card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#f0f0f0" }}>0</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>CREDITOS</div>
                <div style={{ fontSize: 10, color: "#fb7185", marginTop: 4 }}>COMPRAR</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#f0f0f0" }}>{data.length}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>OTIMIZACOES</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#f0f0f0" }}>0</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 4 }}>CVS GERADOS</div>
              </div>
            </div>
          </div>

          <div className="side-card">
            <div style={{ fontSize: 10, color: "#555", marginBottom: 12 }}>ATIVIDADE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 10 }}>
              {activityGrid.map((cell, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: cell.highlight ? "#fb7185" : cell.active ? "#3a131d" : "#161616" }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#444" }}>
              <span>1 DIAS ATIVOS</span>
              <span>4 ACOES · SEQ: 1D</span>
            </div>
          </div>

          <div className="side-card">
            <div style={{ fontSize: 10, color: "#555", marginBottom: 12 }}>ATS ACUMULADO</div>
            <div style={{ color: "#fb7185", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>+{result?.atsScore ?? 0} PTS TOTAL</div>
            <div style={{ display: "flex", alignItems: "flex-end", height: 40, gap: 3 }}>
              {[0, 0, 0, 0, 0, 0, 0, result?.atsScore ?? 0].map((val, i) => (
                <div key={i} style={{ flex: 1, height: val > 0 ? `${(val / Math.max(1, result?.atsScore ?? 1)) * 100}%` : "8%", background: val > 0 ? "#fb7185" : "#1a1a1a", borderRadius: "2px 2px 0 0" }} />
              ))}
            </div>
          </div>

          <div className="side-card">
            <div style={{ fontSize: 10, color: "#555", marginBottom: 10 }}>INDICACAO</div>
            <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>
              INDIQUE O APP PARA UM AMIGO. SE ELE FIZER UMA COMPRA, VOCE GANHA CREDITOS.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, background: "#141414", border: "1px solid #1e1e1e", borderRadius: 6, padding: "8px 10px", fontSize: 10, color: "#555", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                https://curricu.dev/ref/pedro09
              </div>
              <button style={{ background: "#fb7185", border: "none", borderRadius: 6, padding: "8px 12px", color: "#0a0a0a", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                COPIAR
              </button>
            </div>
            <button style={{ background: "none", border: "none", color: "#555", fontSize: 10, cursor: "pointer" }}>
              &gt; ENCURTAR LINK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
