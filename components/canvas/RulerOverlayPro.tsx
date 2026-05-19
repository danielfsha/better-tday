import React from "react";
import { useRulerOverlay } from "./use-ruler-overlay";
import type { ViewportState } from "./viewport-state";

export function RulerOverlayPro({ vp, enabled = true, onGuideDrag }) {
  const { topRef, leftRef, RULER } = useRulerOverlay(vp, enabled);

  // Drag-to-guide (simplified, you can expand this)
  const startGuide = (axis: "x" | "y") => (e: React.PointerEvent) => {
    if (!onGuideDrag) return;
    e.preventDefault();
    const start = axis === "x" ? e.clientX : e.clientY;
    const onMove = (ev: PointerEvent) => {
      // Optionally: show preview
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const pos = axis === "x" ? ev.clientX : ev.clientY;
      onGuideDrag(axis, pos);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <>
      {/* Corner */}
      <div
        className="absolute left-0 top-0 z-50 border-b border-r border-zinc-800 bg-zinc-900"
        style={{ width: RULER, height: RULER }}
      />
      {/* Top Ruler */}
      <div
        className="absolute left-0 right-0 top-0 z-40"
        style={{ left: RULER, height: RULER }}
        onPointerDown={startGuide("x")}
      >
        <canvas ref={topRef} />
      </div>
      {/* Left Ruler */}
      <div
        className="absolute bottom-0 left-0 top-0 z-40"
        style={{ top: RULER, width: RULER }}
        onPointerDown={startGuide("y")}
      >
        <canvas ref={leftRef} />
      </div>
    </>
  );
}
