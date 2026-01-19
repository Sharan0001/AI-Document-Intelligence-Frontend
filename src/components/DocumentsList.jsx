import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";


export default function DocumentsList({ onSelect }) {
  const [docs, setDocs] = useState([]);
  const [filters, setFilters] = useState({
    doc_type: "",
    severity: "",
    from_date: "",
    to_date: "",
  });
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments(attempt = 0) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/documents?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDocs(data);
      setLoadedOnce(true);
      setRetryCount(0);
    } catch (err) {
      if (attempt < 3) {
        setRetryCount(attempt + 1);
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt + 1) * 1000));
        return fetchDocuments(attempt + 1);
      }
      setError("Could not connect to server. Please try again later.");
      setLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  }


  function setSeverityPreset(level) {
    const next = { ...filters, severity: level };
    setFilters(next);

    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });

    fetch(
      `${API_BASE_URL}/documents?${params.toString()}`
    )
      .then((res) => res.json())
      .then(setDocs);
  }

  async function deleteAll() {
    if (!window.confirm("Delete all documents?")) return;
    await fetch(`${API_BASE_URL}/documents`, { method: "DELETE" });
    fetchDocuments();
  }

  async function deleteOne(id) {
    if (!window.confirm("Delete this document?")) return;
    await fetch(`${API_BASE_URL}/documents/${id}`, { method: "DELETE" });
    fetchDocuments();
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <h3>Documents</h3>

      {/* Severity presets */}
      <div className="severity-presets">
        <button
          className={`preset-btn ${filters.severity === "" ? "active" : ""}`}
          onClick={() => setSeverityPreset("")}
        >
          All
        </button>
        <button
          className={`preset-btn low ${filters.severity === "low" ? "active" : ""}`}
          onClick={() => setSeverityPreset("low")}
        >
          Low
        </button>
        <button
          className={`preset-btn medium ${filters.severity === "medium" ? "active" : ""}`}
          onClick={() => setSeverityPreset("medium")}
        >
          Medium
        </button>
        <button
          className={`preset-btn high ${filters.severity === "high" ? "active" : ""}`}
          onClick={() => setSeverityPreset("high")}
        >
          High
        </button>
      </div>

      {/* Filter command surface */}
      <div className="search-surface">
        <div className="filter-groups">
          <div className="filter-group">
            <label>Document</label>
            <select
              value={filters.doc_type}
              onChange={(e) =>
                setFilters({ ...filters, doc_type: e.target.value })
              }
            >
              <option value="">All types</option>
              <option value="invoice">Invoice</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Risk</label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters({ ...filters, severity: e.target.value })
              }
            >
              <option value="">All levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date range</label>
            <div className="date-range">
              <input
                type="date"
                value={filters.from_date}
                onChange={(e) =>
                  setFilters({ ...filters, from_date: e.target.value })
                }
              />
              <span>→</span>
              <input
                type="date"
                value={filters.to_date}
                onChange={(e) =>
                  setFilters({ ...filters, to_date: e.target.value })
                }
              />
            </div>
          </div>

          <button
            className="search-primary-btn"
            onClick={fetchDocuments}
          >
            Apply
          </button>
        </div>

        <button
          className="search-danger-btn"
          onClick={deleteAll}
        >
          Delete all documents
        </button>
      </div>

      {/* LOADING / RETRY / ERROR STATES */}
      {loading && (
        <div className="loading-state" style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
          {retryCount > 0 ? (
            <p>⏳ Backend is starting up... (attempt {retryCount}/3)</p>
          ) : (
            <p>Loading documents...</p>
          )}
        </div>
      )}

      {error && !loading && (
        <div className="error-state" style={{ padding: "20px", textAlign: "center", color: "#ef4444" }}>
          <p>{error}</p>
          <button
            onClick={() => fetchDocuments()}
            style={{ marginTop: "10px", padding: "8px 16px", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATES */}
      {loadedOnce && docs.length === 0 && !loading && !error && (
        <div className="empty-state">
          {!hasActiveFilters ? (
            <>
              <h4>No documents yet</h4>
              <p>
                Upload an invoice or contract to start analyzing risks and
                extracting key information.
              </p>
            </>
          ) : (
            <>
              <h4>No matching documents</h4>
              <p>
                Try adjusting or clearing filters to see more results.
              </p>
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setFilters({
                    doc_type: "",
                    severity: "",
                    from_date: "",
                    to_date: "",
                  });
                  fetchDocuments();
                }}
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}

      {/* DOCUMENT LIST */}
      {docs.length > 0 && (
        <>
          <p style={{ color: "#e1e6f0", margin: "12px 0 8px" }}>
            Recent documents
          </p>

          {docs.map((doc) => (
            <div
              key={doc.id}
              className="upload-card document-card"
              data-severity={doc.risk_severity}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => onSelect(doc.id)}
              >
                <strong>{doc.doc_type.toUpperCase()}</strong>
                <p>{doc.summary}</p>
                <p style={{ color: "#6b7280" }}>
                  Risk: {doc.risk_severity} · Score:{" "}
                  {doc.overall_score ?? doc.score ?? "N/A"}
                </p>
              </div>

              <button
                onClick={() => deleteOne(doc.id)}
                className="doc-delete-btn"
                title="Delete document"
              >
                ×
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
