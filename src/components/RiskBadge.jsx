export default function RiskBadge({ risk }) {
  if (!risk) return null;

  return (
    <div className={`risk-card ${risk.severity}`}>
      <div className="risk-header">
        <h3>Risk Assessment</h3>
        <span className="risk-pill">{risk.severity.toUpperCase()}</span>
      </div>

      <div className="risk-score">
        <span className="score-label">Overall score</span>
        <span className="score-value">{risk.overall_score}</span>
      </div>

      {risk.flags?.length > 0 && (
        <ul className="risk-flags">
          {risk.flags.map((f, i) => (
            <li key={i}>{f.replaceAll("_", " ")}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
