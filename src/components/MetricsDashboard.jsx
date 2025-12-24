import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";


export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const [metricsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/metrics`),
        fetch(`${API_BASE_URL}/stats`),
      ]);

      if (metricsRes.ok) {
        setMetrics(await metricsRes.json());
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (err) {
      console.error("Failed to load metrics", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p style={{ color: "#6b7280" }}>Loading system metrics…</p>;
  }

  if (!metrics && !stats) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{ marginBottom: 16 }}>System Metrics</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {metrics?.total_documents !== undefined && (
          <MetricCard
            label="Total Documents"
            value={metrics.total_documents}
          />
        )}

        {stats?.documents_processed !== undefined && (
          <MetricCard
            label="Documents Processed"
            value={stats.documents_processed}
          />
        )}

        {metrics?.documents_by_type &&
          Object.entries(metrics.documents_by_type).map(([type, count]) => (
            <MetricCard
              key={type}
              label={`${type.toUpperCase()}s`}
              value={count}
            />
          ))}

        {metrics?.risk_severity_distribution &&
          Object.entries(metrics.risk_severity_distribution).map(
            ([severity, count]) => (
              <MetricCard
                key={severity}
                label={`${severity.toUpperCase()} Risk`}
                value={count}
              />
            )
          )}
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div
      className="upload-card"
      style={{ textAlign: "center", padding: 20 }}
    >
      <div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>
        {value}
      </div>
    </div>
  );
}
