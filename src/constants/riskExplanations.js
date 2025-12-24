export const RISK_EXPLANATIONS = {
  long_term_contract: {
    title: "Long-term Contract",
    reason: "Contract duration exceeds the typical 5-year threshold",
    evidence: ["effective_date", "end_date"],
    clause: "TERMINATION",
  },

  missing_governing_law: {
    title: "Missing Governing Law",
    reason: "No jurisdiction is specified, which can cause legal ambiguity",
    evidence: ["governing_law"],
    clause: "GOVERNING_LAW",
  },

  missing_payment_terms: {
    title: "Missing Payment Terms",
    reason: "Payment obligations are unclear or incomplete",
    evidence: ["payment_terms"],
    clause: "PAYMENT",
  },

  contract_expired: {
    title: "Expired Contract",
    reason: "Contract end date is earlier than today's date",
    evidence: ["end_date"],
    clause: "TERMINATION",
  },
};
