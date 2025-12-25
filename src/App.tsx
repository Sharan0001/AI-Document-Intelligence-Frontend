import { useState } from "react";
import UploadBox from "./components/UploadBox";
import SummaryHeader from "./components/SummaryHeader";
import RiskBadge from "./components/RiskBadge";
import FieldsTable from "./components/FieldsTable";
import ClausePanel from "./components/ClausePanel";
import ExplainabilityPanel from "./components/ExplainabilityPanel";
import DocumentsList from "./components/DocumentsList";
import MetricsDashboard from "./components/MetricsDashboard";
import ErrorAnalysisPanel from "./components/ErrorAnalysisPanel";
import { API_BASE_URL } from "./config";


import "./app.css";

function App() {
  const [result, setResult] = useState<any>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  async function handleSelectDocument(docId: number) {
    setLoadingDoc(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${docId}`);
      if (!res.ok) throw new Error("Failed to load document");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load document");
    } finally {
      setLoadingDoc(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Document Intelligence</h1>
        <p className="subtitle">
          Automated invoice & contract analysis with risk intelligence
        </p>
      </header>

      <main className="app-main">
        {/* Entry point */}
        <DocumentsList onSelect={handleSelectDocument} />
        <UploadBox onResult={setResult} />

        {loadingDoc && (
          <p style={{ color: "#6b7280", marginTop: 16 }}>
            Loading document…
          </p>
        )}

        {/* 🔵 ACTIVE DOCUMENT CONTEXT */}
        {result && !loadingDoc && (
          <section className="active-document">
            <div className="dashboard">
              <SummaryHeader result={result} />
              <RiskBadge risk={result.risk_assessment} />
              <ExplainabilityPanel result={result} />
            </div>

            <div className="details">
              <FieldsTable fields={result.extracted_fields} />
              <ClausePanel clauses={result.clauses || []} />
            </div>
          </section>
        )}

        {/* System-level insights */}
        <MetricsDashboard />
        <ErrorAnalysisPanel />
      </main>
    </div>
  );
}

export default App;
