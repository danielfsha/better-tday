import React from "react";

const tools = [
  { name: "select", label: "Select" },
  { name: "rectangle", label: "Rect" },
  { name: "ellipse", label: "Ellipse" },
  { name: "line", label: "Line" },
  { name: "hand", label: "Hand" },
];

export default function ToolbarPro({ tool, setTool }) {
  return (
    <div className="absolute left-8 top-2 z-50 flex gap-2 bg-white/80 rounded shadow p-1">
      {tools.map((t) => (
        <button
          key={t.name}
          className={
            "px-2 py-1 rounded " +
            (tool === t.name ? "bg-blue-200 text-blue-900" : "hover:bg-blue-50")
          }
          onClick={() => setTool(t.name)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
