// Appearance panel for canvas properties
import React from "react";

export default function AppearancePanel({
  opacity,
  visible,
  setOpacity,
  setVisible,
  handleInputChange,
}: any) {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <span className="text-xs font-semibold text-gray-400">Appearance</span>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Opacity</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={opacity}
          onChange={(e) =>
            handleInputChange(
              setOpacity,
              "opacity",
            )(parseFloat(e.target.value) || 1)
          }
          className="w-16 p-1 text-sm text-gray-300 bg-[#3D3D3D] border border-gray-600 rounded"
        />
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <label className="text-sm text-gray-300">Visible</label>
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) =>
            handleInputChange(setVisible, "visible")(e.target.checked)
          }
          className="w-4 h-4"
        />
      </div>
    </div>
  );
}
