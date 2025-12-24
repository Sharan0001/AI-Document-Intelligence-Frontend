import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI URL
  timeout: 60000, // PDFs + OCR can take time
});

export default api;
