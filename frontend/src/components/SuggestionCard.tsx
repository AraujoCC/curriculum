interface Props {
  title: string;
  items: string[];
}

export default function SuggestionCard({ title, items }: Props) {
  return (
    <article className="card panel">
      <h3 className="section-title">{title}</h3>
      <ul className="clean-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
