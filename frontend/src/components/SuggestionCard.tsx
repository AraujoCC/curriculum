interface Props {
  title: string;
  items: string[];
}

export default function SuggestionCard({ title, items }: Props) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
