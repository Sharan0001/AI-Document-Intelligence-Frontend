export default function FieldsTable({ fields }) {
  if (!fields) return null;

  const GROUPS = {
    "Invoice Details": [
      "invoice_number",
      "vendor_name",
      "invoice_date",
      "due_date",
      "total_amount",
      "currency",
    ],
    "Parties": ["party_a", "party_b"],
    "Dates": ["effective_date", "end_date"],
    "Legal": ["governing_law"],
    "Financial": ["payment_terms"],
  };

  const LABELS = {
    // Invoice
    invoice_number: "Invoice Number",
    vendor_name: "Vendor",
    invoice_date: "Invoice Date",
    due_date: "Due Date",
    total_amount: "Total Amount",
    currency: "Currency",

    // Contract
    party_a: "Party A",
    party_b: "Party B",
    effective_date: "Effective Date",
    end_date: "End Date",
    governing_law: "Governing Law",
    payment_terms: "Payment Terms",
  };

  return (
    <div className="fields-card">
      <h3>Key Extracted Fields</h3>

      {Object.entries(GROUPS).map(([group, keys]) => {
        const visible = keys.filter(
          (k) => fields[k] !== null && fields[k] !== undefined
        );

        if (visible.length === 0) return null;

        return (
          <div key={group} className="field-group">
            <h4>{group}</h4>

            {visible.map((k) => (
              <div key={k} className="field-row">
                <span className="field-label">{LABELS[k] || k}</span>
                <span className="field-value">
                  {k === "total_amount"
                    ? fields[k].toString()
                    : fields[k]}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
