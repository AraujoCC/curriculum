import { useNavigate } from "react-router-dom";
import AtsScoreGauge from "../components/AtsScoreGauge";
import KeywordBadge from "../components/KeywordBadge";
import SuggestionCard from "../components/SuggestionCard";
import type { AnalysisResult } from "../types/analysis";

interface Props {
  result: AnalysisResult | null;
}

export default function DashboardPage({ result }: Props) {
  const navigate = useNavigate();

  if (!result) {
    return (
      <main className="container">
        <h1>Nenhuma analise disponivel</h1>
        <button type="button" onClick={() => navigate("/")}>
          Voltar
        </button>
      </main>
    );
  }

  return (
    <main className="container stack-lg">
      <h1>Resultado da Analise</h1>
      <AtsScoreGauge score={result.atsScore} />

      <section className="grid-two">
        <article className="card">
          <h3>Keywords encontradas</h3>
          <div className="badge-list">
            {result.matchedKeywords.map((keyword) => (
              <KeywordBadge key={keyword} keyword={keyword} found />
            ))}
          </div>
        </article>
        <article className="card">
          <h3>Keywords faltando</h3>
          <div className="badge-list">
            {result.missingKeywords.map((keyword) => (
              <KeywordBadge key={keyword} keyword={keyword} found={false} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid-two">
        <SuggestionCard title="Pontos fortes" items={result.strengths} />
        <SuggestionCard title="Pontos fracos" items={result.weaknesses} />
      </section>

      <section className="card">
        <h3>Sugestoes de reescrita</h3>
        <p>{result.suggestions.summary}</p>
        <SuggestionCard title="Bullets sugeridos" items={result.suggestions.bullets} />
        <SuggestionCard title="Keywords recomendadas" items={result.suggestions.keywords} />
      </section>

      <section className="card">
        <h3>Resumo otimizado</h3>
        <p>{result.rewrittenSummary}</p>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(result.rewrittenSummary)}
        >
          Copiar resumo otimizado
        </button>
      </section>
    </main>
  );
}
