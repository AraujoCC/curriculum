interface Props {
  score: number;
}

export default function AtsScoreGauge({ score }: Props) {
  const normalized = Math.max(0, Math.min(100, score));
  const angle = (normalized / 100) * 360;
  const scoreLabel =
    normalized >= 80 ? "Excelente aderencia" : normalized >= 60 ? "Boa aderencia" : "Pode melhorar";

  return (
    <div className="gauge-wrap">
      <div
        className="gauge"
        style={{
          background: `conic-gradient(#7c3aed ${angle}deg, rgba(255,255,255,0.1) ${angle}deg)`,
        }}
      >
        <div className="gauge-inner">
          <span className="gauge-value">{normalized}%</span>
          <span className="gauge-label">ATS Score</span>
          <span className="gauge-subtitle">{scoreLabel}</span>
        </div>
      </div>
    </div>
  );
}
