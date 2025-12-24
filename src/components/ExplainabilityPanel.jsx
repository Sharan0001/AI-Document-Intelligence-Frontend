import { RISK_EXPLANATIONS } from "../riskExplainMap";

const INVOICE_FLAG_LABELS = {
  due_date_same_as_invoice_date:
    "The due date is the same as the invoice date",
  overdue_invoice:
    "The invoice appears to be overdue",
  total_mismatch_with_balance_due:
    "The total amount does not match the balance due",
  missing_invoice_number:
    "The invoice number is missing",
  missing_total_amount:
    "The total amount is missing",
  missing_vendor:
    "The vendor name is missing",
  missing_currency:
    "The currency is missing",
};

export default function ExplainabilityPanel({ result }) {
  if (!result?.risk_assessment) return null;

  const { flags, severity } = result.risk_assessment;
  const fields = result.extracted_fields || {};
  const clauses = result.clauses || [];

  const hasStructuredExplanations =
    flags?.some((f) => RISK_EXPLANATIONS[f]);

  return (
    <div
      className={`explain-panel explain-${severity}`}
    >
      <h3>Why is this risky?</h3>

      {/* LOW RISK — reassurance */}
      {(!flags || flags.length === 0) && (
        <div className="explain-low">
          <p>
            This document does not exhibit any significant risk indicators
            based on the current analysis.
          </p>
          <p className="explain-muted">
            The extracted fields and detected clauses appear consistent
            with standard expectations.
          </p>
        </div>
      )}

      {/* CONTRACT-STYLE EXPLANATIONS */}
      {hasStructuredExplanations &&
        flags
          .filter((flag) => RISK_EXPLANATIONS[flag])
          .map((flag, idx) => {
            const info = RISK_EXPLANATIONS[flag];
            const matchedClause = clauses.find(
              (c) => c.type === info.clause
            );

            return (
              <div key={idx} className="explain-card">
                <h4>{info.title}</h4>
                <p>{info.reason}</p>

                <div className="evidence">
                  <strong>Evidence</strong>
                  <ul>
                    {info.evidence.map((key) => (
                      <li key={key}>
                        {key.replaceAll("_", " ")}:{" "}
                        <span>{fields[key] ?? "Not found"}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {matchedClause && (
                  <div className="linked-clause">
                    <strong>Related clause</strong>
                    <p>{matchedClause.text}</p>
                  </div>
                )}
              </div>
            );
          })}

      {/* INVOICE-STYLE FLAGS */}
      {flags?.filter((f) => !RISK_EXPLANATIONS[f]).length > 0 && (
        <div className="explain-flags">
          <p>
            This document shows potential payment or data consistency
            issues:
          </p>
          <ul>
            {flags
              .filter((f) => !RISK_EXPLANATIONS[f])
              .map((flag) => (
                <li key={flag}>
                  {INVOICE_FLAG_LABELS[flag] ??
                    flag.replaceAll("_", " ")}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
