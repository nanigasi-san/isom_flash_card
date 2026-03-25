export function Surface({ eyebrow, title, bodyClassName = "", children, className = "" }) {
  return (
    <section className={`surface ${className}`.trim()}>
      {eyebrow ? <p className="surface-eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="surface-title">{title}</h2> : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function MetaPill({ children }) {
  return <span className="meta-pill">{children}</span>;
}

export function SummaryCard({ label, value }) {
  return (
    <div className="mini-summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
