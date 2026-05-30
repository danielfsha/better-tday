// Position panel for canvas properties
import React from "react";

export default function PositionPanel({
  left,
  top,
  setLeft,
  setTop,
  handleInputChange,
}: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Position</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Left</label>
        <input
          type="number"
          value={left}
          onChange={(e) =>
            handleInputChange(setLeft, "left")(parseFloat(e.target.value) || 0)
          }
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Top</label>
        <input
          type="number"
          value={top}
          onChange={(e) =>
            handleInputChange(setTop, "top")(parseFloat(e.target.value) || 0)
          }
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
    </div>
  );
}
