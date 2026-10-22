import React from "react";
import Markdown from "react-markdown"
export default function MessageBubble({ from = "ai", text }) {
  const isAI = from === "ai";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} my-2`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl ${
            isAI ? "bg-[#2a2a2a] text-gray-200" : "bg-blue-600 text-white"
        }`}
        >
        <div className="text-sm whitespace-pre-wrap">
          <div className="markdown-reset">
            <Markdown>{text}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
