import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onAuth: (mode: "login" | "signup", email: string) => void;
}

export default function LoginPage({ onAuth }: Props) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  function handleContinue() {
    if (!email || !password) return;
    onAuth(tab, email);
    navigate("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        fontFamily: "'IBM Plex Mono', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field { width: 100%; background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 13px 16px; color: #f0f0f0; font-size: 14px; font-family: 'Space Grotesk', sans-serif; outline: none; }
        .input-field:focus { border-color: #fb7185; }
        .btn-primary { width: 100%; background: #fb7185; color: #0a0a0a; border: none; border-radius: 8px; padding: 14px; font-size: 14px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; cursor: pointer; }
        .tab-btn { flex: 1; background: transparent; border: none; padding: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; cursor: pointer; }
        .char-float { position: absolute; color: #fb7185; font-family: 'IBM Plex Mono', monospace; opacity: 0.12; user-select: none; pointer-events: none; }
      `}</style>

      {["J", "A", "V", "A", "P", "Y", "T", "H", "O", "N", "{", "}", "<", ">", "#", "@"].map((c, i) => (
        <span
          key={i}
          className="char-float"
          style={{
            top: `${(i * 137.5) % 100}%`,
            left: `${(i * 61.8) % 100}%`,
            fontSize: `${10 + (i % 6) * 3}px`,
          }}
        >
          {c}
        </span>
      ))}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "2px solid #fb7185",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#fb7185", fontSize: 16, fontWeight: 600 }}>C</span>
            </div>
            <span style={{ color: "#f0f0f0", fontSize: 18, fontWeight: 600 }}>
              curri<span style={{ color: "#fb7185" }}>cu</span>.dev
            </span>
          </div>
        </div>

        <p style={{ color: "#fb7185", fontSize: 12, letterSpacing: "0.15em", marginBottom: 16 }}>ATS_INTELLIGENCE v2.4</p>
        <h1 style={{ color: "#f0f0f0", fontSize: 42, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20 }}>
          Seu curriculo
          <br />
          <span style={{ color: "#fb7185" }}>passa no filtro.</span>
          <br />
          Voce passa na vaga.
        </h1>
        <p style={{ color: "#666", fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
          Analise, otimize e gere curriculos que vencem os filtros ATS e chegam ate o recrutador.
        </p>
      </div>

      <div
        style={{
          width: 440,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 48px",
          borderLeft: "1px solid #1a1a1a",
          background: "#0d0d0d",
        }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ display: "flex", border: "1px solid #1e1e1e", borderRadius: 10, marginBottom: 32, overflow: "hidden" }}>
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                className="tab-btn"
                onClick={() => setTab(t)}
                style={{
                  color: tab === t ? "#fb7185" : "#555",
                  borderBottom: tab === t ? "2px solid #fb7185" : "2px solid transparent",
                }}
              >
                {t === "login" ? "entrar" : "criar conta"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "signup" && (
              <input className="input-field" type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input className="input-field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ position: "relative" }}>
              <input
                className="input-field"
                type={showPass ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 56 }}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                type="button"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                {showPass ? "ocultar" : "ver"}
              </button>
            </div>
            <button className="btn-primary" type="button" onClick={handleContinue}>
              {tab === "login" ? "ENTRAR ->" : "CRIAR CONTA ->"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
