export default function SummaryHeader({ result }) {
  if (!result) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <h2 style={{ marginBottom: 6 }}>
        {result.doc_type?.toUpperCase()}
      </h2>
      {result.summary && (
        <p style={{ color: "#6b7280", lineHeight: 1.4 }}>
          {result.summary}
        </p>
      )}
    </div>
  );
}
