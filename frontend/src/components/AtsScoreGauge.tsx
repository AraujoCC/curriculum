interface Props {
  score: number;
}

export default function AtsScoreGauge({ score }: Props) {
  const normalized = Math.max(0, Math.min(100, score));
  const angle = (normalized / 100) * 360;

  return (
    <div className="gauge-wrap">
      <div
        className="gauge"
        style={{
          background: `conic-gradient(#2563eb ${angle}deg, #dbeafe ${angle}deg)`,
        }}
      >
        <div className="gauge-inner">
          <span className="gauge-value">{normalized}</span>
          <span className="gauge-label">ATS Score</span>
        </div>
      </div>
    </div>
  );
}
