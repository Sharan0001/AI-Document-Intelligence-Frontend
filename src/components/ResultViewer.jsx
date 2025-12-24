export default function ResultViewer({ result }) {
  if (!result) return null;

  return (
    <pre
      style={{
        marginTop: 24,
        padding: 16,
        background: "#111",
        color: "#0f0",
        maxHeight: "500px",
        overflow: "auto",
        borderRadius: 8,
      }}
    >
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
