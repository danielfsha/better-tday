// Layout panel for canvas properties
import React from "react";
import { NumberInput } from "@/components/ui/number-input";

export default function LayoutPanel({
  width,
  height,
  angle,
  flipX,
  flipY,
  setWidth,
  setHeight,
  setAngle,
  setFlipX,
  setFlipY,
  handleInputChange,
  layoutAlign = "left",
  setLayoutAlign,
}: any) {
  // layoutAlign: left, center, right
  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-400 mb-1">Layout</span>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 flex-1">
          <NumberInput
            label="W"
            value={width}
            onChange={(v) => handleInputChange(setWidth, "width")(v)}
            className="w-full"
            inputClassName="w-full"
            min={1}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <NumberInput
            label="H"
            value={height}
            onChange={(v) => handleInputChange(setHeight, "height")(v)}
            className="w-full"
            inputClassName="w-full"
            min={1}
          />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <label className="text-xs text-gray-400">Align</label>
          <div className="flex gap-0.5">
            {["left", "center", "right"].map((key) => (
              <button
                key={key}
                className={`w-5 h-5 rounded border ${layoutAlign === key ? "bg-violet-600 border-violet-400" : "bg-[#232323] border-[#353535]"}`}
                style={{
                  outline:
                    layoutAlign === key ? "2px solid #a78bfa" : undefined,
                }}
                onClick={() => setLayoutAlign && setLayoutAlign(key)}
                type="button"
                aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
              >
                {key === "left" && (
                  <span className="block w-2 h-3 bg-gray-300 ml-0.5" />
                )}
                {key === "center" && (
                  <span className="block w-2 h-3 bg-gray-300 mx-auto" />
                )}
                {key === "right" && (
                  <span className="block w-2 h-3 bg-gray-300 mr-0.5 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 flex-1">
          <NumberInput
            label="Angle"
            value={angle}
            onChange={(v) => handleInputChange(setAngle, "angle")(v)}
            className="w-full"
            inputClassName="w-full"
            step={1}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">Flip X</label>
          <input
            type="checkbox"
            checked={flipX}
            onChange={(e) =>
              handleInputChange(setFlipX, "flipX")(e.target.checked)
            }
            className="w-4 h-4 mt-2"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">Flip Y</label>
          <input
            type="checkbox"
            checked={flipY}
            onChange={(e) =>
              handleInputChange(setFlipY, "flipY")(e.target.checked)
            }
            className="w-4 h-4 mt-2"
          />
        </div>
      </div>
    </div>
  );
}
