import { useState } from "react";

const ICONS = {
  PAYMENT: "💰",
  CONFIDENTIALITY: "🔒",
  TERMINATION: "⏹️",
  GOVERNING_LAW: "⚖️",
  INDEMNITY: "🛡️",
};


export default function ClausePanel({ clauses = [] }) {
  if (!clauses.length) return null;

  return (
    <div className="section">
      <h2>Key Legal Clauses</h2>

      {clauses.map((clause, idx) => (
        <ClauseCard key={idx} clause={clause} />
      ))}
    </div>
  );
}

function ClauseCard({ clause }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="clause-card">
      <div
        className="clause-header"
        onClick={() => setOpen(!open)}
      >
        <div>
          <strong>{ICONS[clause.type] || "📄"}{" "}
          {clause.type.replaceAll("_", " ")}
          </strong>
        </div>

        <div className="clause-meta">
          <span className={`confidence ${confidenceLevel(clause.confidence)}`}>
            confidence: {clause.confidence}
          </span>
          <span className="toggle">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="clause-body">
          {clause.text}
        </div>
      )}
    </div>
  );
}

function confidenceLevel(score) {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "medium";
  return "low";
}
