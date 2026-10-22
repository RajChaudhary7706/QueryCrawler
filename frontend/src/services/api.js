import axios from "axios";
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
let sessionId = null;

export const setSessionId = (id) => {
  sessionId = id;
};

export const getSessionId = () => sessionId;

export const startCrawl = async (url) => {
  const resp = await axios.post(`${API_BASE}/api/crawl/start`, { url });
  if (resp.data.sessionId) {
    setSessionId(resp.data.sessionId);
  }

  return resp.data;
};
export const askRag = async (question) => {
  if (!sessionId) {
    throw new Error("No sessionId found — start crawl first.");
  }

  const resp = await axios.post(`${API_BASE}/api/rag/ask`, {
    question,
    sessionId,
  });

  return resp.data;
};
