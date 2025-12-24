import api from "./client";

/* Upload & auto-extract */
export const extractAuto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/extract/auto", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/* List documents */
export const listDocuments = async (params = {}) => {
  const response = await api.get("/documents", { params });
  return response.data;
};

/* Fetch single document */
export const getDocument = async (id) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

/* Delete document */
export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

/* Metrics */
export const getMetrics = async () => {
  const response = await api.get("/metrics");
  return response.data;
};
