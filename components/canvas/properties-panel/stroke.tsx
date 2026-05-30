// Stroke panel for canvas properties
import React from "react";

export default function StrokePanel({ stroke, strokeWidth, strokeDashArray, setStroke, setStrokeWidth, setStrokeDashArray, handleInputChange }: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Stroke</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Color</label>
        <input
          type="color"
          value={stroke}
          onChange={(e) => handleInputChange(setStroke, "stroke")(e.target.value)}
          className="w-16 h-8 p-0 border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Width</label>
        <input
          type="number"
          step="1"
          value={strokeWidth}
          onChange={(e) => handleInputChange(setStrokeWidth, "strokeWidth")(parseFloat(e.target.value) || 1)}
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Dash Array</label>
        <input
          type="text"
          placeholder="e.g. 5,5"
          value={strokeDashArray.join(",")}
          onChange={(e) => {
            const arr = e.target.value.split(",").map((n) => parseFloat(n.trim())).filter((n) => !isNaN(n));
            handleInputChange(setStrokeDashArray, "strokeDashArray")(arr);
          }}
          className="w-24 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
    </div>
  );
}
