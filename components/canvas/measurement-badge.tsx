import { useEffect, useState } from "react";
import type * as fabric from "fabric";
import type { ViewportState } from "@/hooks/use-viewport";

interface Props {
  getCanvas: () => fabric.Canvas | null;
  vp: ViewportState;
  enabled: boolean;
}

/** Shows pixel-distance badges between two selected objects (centers + nearest edge gaps). */
export function MeasurementBadge({ getCanvas, vp, enabled }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const c = getCanvas();
    if (!c || !enabled) return;
    const h = () => setTick((n) => n + 1);
    c.on("selection:created", h);
    c.on("selection:updated", h);
    c.on("selection:cleared", h);
    c.on("object:moving", h);
    c.on("object:modified", h);
    c.on("after:render", h);
    return () => {
      c.off("selection:created", h);
      c.off("selection:updated", h);
      c.off("selection:cleared", h);
      c.off("object:moving", h);
      c.off("object:modified", h);
      c.off("after:render", h);
    };
  }, [getCanvas, enabled]);
  void tick;

  if (!enabled) return null;
  const c = getCanvas();
  if (!c) return null;
  const objs = c.getActiveObjects();
  if (objs.length !== 2) return null;

  const bbox = (o: fabric.Object) => {
    const x = o.left ?? 0,
      y = o.top ?? 0;
    const w = (o.width ?? 0) * (o.scaleX ?? 1);
    const h = (o.height ?? 0) * (o.scaleY ?? 1);
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  };
  const a = bbox(objs[0]);
  const b = bbox(objs[1]);
  const dx = Math.round(b.cx - a.cx);
  const dy = Math.round(b.cy - a.cy);
  const dist = Math.round(Math.hypot(dx, dy));

  // midpoint in screen space
  const mx = ((a.cx + b.cx) / 2) * vp.zoom + vp.tx;
  const my = ((a.cy + b.cy) / 2) * vp.zoom + vp.ty;
  const ax = a.cx * vp.zoom + vp.tx;
  const ay = a.cy * vp.zoom + vp.ty;
  const bx = b.cx * vp.zoom + vp.tx;
  const by = b.cy * vp.zoom + vp.ty;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      <line
        x1={ax}
        y1={ay}
        x2={bx}
        y2={by}
        stroke="#22d3ee"
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <foreignObject x={mx - 40} y={my - 12} width={80} height={24}>
        <div className="rounded bg-[#22d3ee] px-1.5 py-0.5 text-center text-[10px] font-semibold text-black shadow">
          {dist}px{" "}
          <span className="opacity-60">
            · {dx},{dy}
          </span>
        </div>
      </foreignObject>
    </svg>
  );
}
