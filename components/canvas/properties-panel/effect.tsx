// Effect panel for canvas properties
import React from "react";

export default function EffectPanel({ shadow, setShadow, handleInputChange }: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Effects</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Shadow</label>
        <input
          type="text"
          placeholder="none or color"
          value={shadow === "none" ? "" : shadow}
          onChange={(e) => handleInputChange(setShadow, "shadow")(e.target.value || "none")}
          className="w-24 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
    </div>
  );
}
