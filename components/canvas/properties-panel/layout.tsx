// Layout panel for canvas properties
import React from "react";

export default function LayoutPanel({ width, height, angle, flipX, flipY, setWidth, setHeight, setAngle, setFlipX, setFlipY, handleInputChange }: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Layout</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Width</label>
        <input
          type="number"
          value={width}
          onChange={(e) => handleInputChange(setWidth, "width")(parseFloat(e.target.value) || 0)}
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Height</label>
        <input
          type="number"
          value={height}
          onChange={(e) => handleInputChange(setHeight, "height")(parseFloat(e.target.value) || 0)}
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Angle</label>
        <input
          type="number"
          step="1"
          value={angle}
          onChange={(e) => handleInputChange(setAngle, "angle")(parseFloat(e.target.value) || 0)}
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Flip X</label>
        <input
          type="checkbox"
          checked={flipX}
          onChange={(e) => handleInputChange(setFlipX, "flipX")(e.target.checked)}
          className="w-4 h-4"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Flip Y</label>
        <input
          type="checkbox"
          checked={flipY}
          onChange={(e) => handleInputChange(setFlipY, "flipY")(e.target.checked)}
          className="w-4 h-4"
        />
      </div>
    </div>
  );
}
