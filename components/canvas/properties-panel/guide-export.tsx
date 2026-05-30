// Guide and export panel for canvas properties
import React from "react";

export default function GuideExportPanel() {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">
        Guide & Export
      </span>
      <div className="w-full flex items-center justify-between gap-2">
        <button className="w-full p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded">
          Export
        </button>
      </div>
    </div>
  );
}
