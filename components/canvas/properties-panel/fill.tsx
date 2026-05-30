// Fill panel for canvas properties
import React from "react";

export default function FillPanel({ fill, setFill, handleInputChange }: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Fill</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Color</label>
        <input
          type="color"
          value={fill}
          onChange={(e) => handleInputChange(setFill, "fill")(e.target.value)}
          className="w-16 h-8 p-0 border border-gray-600 rounded"
        />
      </div>
    </div>
  );
}
