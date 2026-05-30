// Position panel for canvas properties
import React from "react";

export default function PositionPanel({
  left,
  top,
  setLeft,
  setTop,
  handleInputChange,
  anchor = "lt",
  setAnchor,
}: any) {
  // anchor: one of 'lt', 'ct', 'rt', 'lm', 'cm', 'rm', 'lb', 'cb', 'rb'
  const anchorGrid = [
    ["lt", "ct", "rt"],
    ["lm", "cm", "rm"],
    ["lb", "cb", "rb"],
  ];
  return (
    <div className="w-full flex flex-col gap-2 p-2 rounded-lg bg-[#232323] border border-[#353535]">
      <span className="text-xs font-semibold text-gray-400 mb-1">Position</span>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">X</label>
          <input
            type="number"
            value={left}
            onChange={(e) =>
              handleInputChange(
                setLeft,
                "left",
              )(parseFloat(e.target.value) || 0)
            }
            className="w-full p-1 text-xs text-gray-200 bg-[#18181b] border border-[#353535] rounded"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-400">Y</label>
          <input
            type="number"
            value={top}
            onChange={(e) =>
              handleInputChange(setTop, "top")(parseFloat(e.target.value) || 0)
            }
            className="w-full p-1 text-xs text-gray-200 bg-[#18181b] border border-[#353535] rounded"
          />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <label className="text-xs text-gray-400">Anchor</label>
          <div className="grid grid-cols-3 grid-rows-3 gap-0.5">
            {anchorGrid.flat().map((key) => (
              <button
                key={key}
                className={`w-4 h-4 rounded border ${anchor === key ? "bg-violet-600 border-violet-400" : "bg-[#232323] border-[#353535]"}`}
                style={{
                  outline: anchor === key ? "2px solid #a78bfa" : undefined,
                }}
                onClick={() => setAnchor && setAnchor(key)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
