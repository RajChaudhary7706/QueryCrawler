import React, { useState } from "react";
import CrawlPage from "./pages/CrawlPage";
import ChatPage from "./pages/chatPage";

export default function App() {
  const [stage, setStage] = useState("crawl");
  const [crawlMeta, setCrawlMeta] = useState(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#141414]">
      <div className="w-full max-w-3xl bg-[#1c1c1c] shadow-xl shadow-black/40 
                      rounded-2xl p-8 border border-[#2b2b2b]">
        
        {stage === "crawl" ? (
          <CrawlPage
            onCrawlComplete={(meta) => {
              setCrawlMeta(meta);
              setStage("chat");
            }}
          />
        ) : (
          <ChatPage
            crawlMeta={crawlMeta}
            onBack={() => {
              setStage("crawl");
              setCrawlMeta(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
