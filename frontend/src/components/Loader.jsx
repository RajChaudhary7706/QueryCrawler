import React from "react";

export default function Loader({ label = "Processing..." }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full border-4 border-dashed animate-spin border-slate-400" />
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  );
}
