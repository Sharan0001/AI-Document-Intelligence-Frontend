import { useState } from "react";
import { API_BASE_URL } from "../config";


export default function UploadBox({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/extract/auto`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      onResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="upload-card">
      <div className="upload-content">
        <div className="upload-icon">📄</div>
        <div>
          <h3>Upload a document</h3>
          <p>Supports invoices & contracts (PDF)</p>
        </div>
      </div>

      <div className="upload-actions">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? "Analyzing..." : "Analyze Document"}
        </button>
      </div>
    </div>
  );
}
