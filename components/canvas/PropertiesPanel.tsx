import React from "react";

export default function PropertiesPanel({ selected }) {
  if (!selected) return null;
  // Example: show/edit left/top/width/height
  return (
    <div className="absolute right-2 top-2 z-50 bg-white/90 rounded shadow p-3 min-w-[180px]">
      <div className="font-bold mb-2">Properties</div>
      <div className="space-y-2">
        <div>
          <label className="block text-xs">Left</label>
          <input
            type="number"
            value={selected.left ?? 0}
            onChange={(e) => selected.set({ left: +e.target.value })}
            className="w-full border rounded px-1"
          />
        </div>
        <div>
          <label className="block text-xs">Top</label>
          <input
            type="number"
            value={selected.top ?? 0}
            onChange={(e) => selected.set({ top: +e.target.value })}
            className="w-full border rounded px-1"
          />
        </div>
        <div>
          <label className="block text-xs">Width</label>
          <input
            type="number"
            value={selected.width ?? 0}
            onChange={(e) => selected.set({ width: +e.target.value })}
            className="w-full border rounded px-1"
          />
        </div>
        <div>
          <label className="block text-xs">Height</label>
          <input
            type="number"
            value={selected.height ?? 0}
            onChange={(e) => selected.set({ height: +e.target.value })}
            className="w-full border rounded px-1"
          />
        </div>
      </div>
    </div>
  );
}
