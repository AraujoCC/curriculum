interface Props {
  score: number;
}

export default function AtsScoreGauge({ score }: Props) {
  const normalized = Math.max(0, Math.min(100, score));
  const angle = (normalized / 100) * 360;
  const color = normalized >= 70 ? "#4ade80" : normalized >= 50 ? "#fbbf24" : "#f87171";
  const label =
    normalized >= 70 ? "OTIMIZADO" : normalized >= 50 ? "COMPATIVEL" : "INCOMPATIVEL";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `conic-gradient(${color} ${angle}deg, #1a1a1a ${angle}deg)`,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 0 20px ${color}33`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#0e0e0e",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'IBM Plex Mono', monospace" }}>
            {normalized}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 10, letterSpacing: "0.1em", color, fontFamily: "'IBM Plex Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}
