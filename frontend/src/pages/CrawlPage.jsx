import React, { useState } from "react";
import Loader from "../components/Loader";
import { startCrawl } from "../services/api";

export default function CrawlPage({ onCrawlComplete }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    setError(null);
    setResultMsg(null);

    if (!url.trim()) {
      setError("Please enter a URL (include https://)");
      return;
    }

    setLoading(true);
    try {
      const data = await startCrawl(url.trim());
      if (data?.success) {
        setResultMsg(data.message || "Crawl completed");
        onCrawlComplete({
          pagesCrawled: data.pagesCrawled ?? null,
          chunksCreated: data.chunksCreated ?? null,
          vectorsStored: data.vectorsStored ?? null,
        });
      } else {
        setError(data?.error || data?.message || "Unknown crawl error");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2 className="text-2xl font-semibold text-gray-100">Crawl a website</h2>

      <p className="text-sm text-gray-400 mt-2">
        Enter a URL and the backend will crawl, chunk, embed, and store vectors in
        Pinecone. Wait for completion before asking questions.
      </p>

      {/* INPUT + BUTTON */}
      <div className="flex gap-3 mt-6">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-4 py-3 rounded-lg border border-[#3a3a3a]
                     bg-[#121212] text-gray-200 placeholder-gray-600
                     focus:ring-1 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={handleStart}
          disabled={loading}
          className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                     disabled:opacity-50 transition"
        >
          Start crawl
        </button>
      </div>

      {/* STATUS MESSAGES */}
      <div className="mt-4 space-y-3">

        {loading && (
          <Loader label="Processing website... crawling + embedding" />
        )}

        {resultMsg && (
          <div className="p-3 bg-green-900/30 border border-green-700 rounded-md 
                          text-sm text-green-300">
            {resultMsg}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-700 rounded-md 
                          text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center text-gray-500 text-xs gap-2">

        <div className="text-gray-300">Built by <span className="font-semibold">RAJ CHAUDHARY</span></div>

            <div className="flex gap-4">
                <a
                href="https://github.com/RajChaudhary7706"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-300 transition"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2.01c-3.2.69-3.87-1.55-3.87-1.55-.53-1.34-1.3-1.7-1.3-1.7-1.07-.73.08-.71.08-.71 1.18.08 1.8 1.23 1.8 1.23 1.05 1.8 2.75 1.28 3.42.98.1-.76.41-1.28.74-1.58-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.24 2.75.12 3.04.73.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.42.37.79 1.1.79 2.22v3.29c0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                </svg>
                GitHub
                </a>
                <a
                href="https://www.linkedin.com/in/raj-chaudhary63"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-gray-300 transition"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2C20.09 8 24 11.05 24 17.25V24h-4v-6.25c0-3-1.08-5.05-3.76-5.05-2.05 0-3.27 1.38-3.81 2.71-.2.48-.25 1.15-.25 1.82V24h-4V8z"/>
                </svg>
                LinkedIn
                </a>

            </div>
        </div>
    </div>
  );
}
