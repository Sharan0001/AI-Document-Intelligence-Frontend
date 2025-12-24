import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";


export default function ErrorAnalysisPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchErrorAnalysis();
  }, []);

  async function fetchErrorAnalysis() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/error-analysis`);
      if (!res.ok) throw new Error("Failed to load error analysis");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p style={{ color: "#6b7280" }}>Loading insights…</p>;
  }

  if (!data || !data.most_common_issues?.length) {
    return null;
  }

  return (
    <div style={{ marginBottom: 40 }}>
      <h3>Recurring Risk Patterns</h3>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Common risk signals identified across analyzed documents. These
        patterns can help highlight systemic issues or areas that require
        closer review.
      </p>

      <div className="risk-patterns">
        {data.most_common_issues.map((item, idx) => (
          <div
            key={idx}
            className="risk-pattern-card"
            data-count={item.count}
          >
            <strong>{humanize(item.flag)}</strong>
            <p>
              Occurred in <strong>{item.count}</strong>{" "}
              {item.count === 1 ? "document" : "documents"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function humanize(flag) {
  return flag.replaceAll("_", " ");
}
