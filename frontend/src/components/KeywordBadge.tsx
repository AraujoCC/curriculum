interface Props {
  keyword: string;
  found: boolean;
}

export default function KeywordBadge({ keyword, found }: Props) {
  return (
    <span className={`badge ${found ? "badge-found" : "badge-missing"}`}>
      <span className="badge-dot" />
      {keyword}
    </span>
  );
}
