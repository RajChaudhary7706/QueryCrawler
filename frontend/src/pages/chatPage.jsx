import React, { useState } from "react";
import MessageBubble from "../components/MessageBubble";
import Loader from "../components/Loader";
import { askRag } from "../services/api";

export default function ChatPage({ crawlMeta, onBack }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      from: "ai",
      text: `Crawl completed. Pages crawled: ${
        crawlMeta?.pagesCrawled ?? "N/A"
      }, chunks: ${crawlMeta?.chunksCreated ?? "N/A"}. Ask a question about the website.`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendQuestion = async () => {
    if (!question.trim()) return;
    setError(null);

    const userMsg = {
      id: `u-${Date.now()}`,
      from: "user",
      text: question.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await askRag(userMsg.text);

      if (res?.success) {
        const aiMsg = {
          id: `ai-${Date.now()}`,
          from: "ai",
          text: res.answer ?? "No answer returned.",
          meta: { contextUsed: res.contextUsed ?? null },
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            from: "ai",
            text: "Error: LLM returned an unexpected result.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message ||
          "Error contacting backend. Check console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">

      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-200">RAG Chat</h2>

        <button
          onClick={onBack}
          className="text-sm text-blue-400 hover:text-blue-300 underline"
        >
          New crawl
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Ask questions about content extracted from the website.  
        Responses use Gemini Flash via RAG.
      </div>

      {/* ---------------- CHAT HISTORY BOX ---------------- */}
      <div className="mt-4 flex-1 overflow-y-auto p-4 border border-[#2a2a2a] rounded-lg bg-[#121212]">
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBubble from={msg.from} text={msg.text} />

              {msg.meta?.contextUsed && (
                <div className="text-xs text-gray-500 ml-2">
                  Context used: {msg.meta.contextUsed}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- INPUT AREA ---------------- */}
      <div className="mt-4">

        {error && (
          <div className="mb-2 text-sm text-red-300 bg-red-900/30 border border-red-700 p-2 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
            placeholder="Type your question..."
            className="flex-1 px-4 py-3 rounded-lg border border-[#2a2a2a] bg-[#121212] 
                       text-gray-200 placeholder-gray-500 outline-none
                       focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          />

          <button
            onClick={sendQuestion}
            disabled={loading}
            className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white
                       disabled:opacity-50 transition"
          >
            Ask
          </button>
        </div>

        <div className="mt-3">
          {loading && <Loader label="Generating answer..." />}
        </div>
      </div>
    </div>
  );
}
