import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { getMeta, setMeta, newId } from "../types";
import type { ViewportState } from "./useViewport";

interface Args {
  getCanvas: () => fabric.Canvas | null;
  vp: ViewportState;
  enabled: boolean;
}

const RULER = 24;

const niceStep = (zoom: number) => {
  // pick a tick step in canvas pixels so screen spacing ~ 60-120px
  const target = 80 / zoom;
  const pow = Math.pow(10, Math.floor(Math.log10(target)));
  const n = target / pow;
  const step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return step * pow;
};

function drawRuler(
  canvas: HTMLCanvasElement | null,
  axis: "x" | "y",
  vp: ViewportState,
) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = axis === "x" ? vp.w : RULER;
  const h = axis === "x" ? RULER : vp.h;
  if (w === 0 || h === 0) return;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(34,34,42,1)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(140,140,160,0.4)";
  ctx.fillStyle = "rgba(180,180,200,0.85)";
  ctx.font = "10px ui-sans-serif, system-ui";
  ctx.lineWidth = 1;

  const step = niceStep(vp.zoom);
  const minor = step / 5;

  if (axis === "x") {
    // canvas x -> screen x:  sx = cx * zoom + tx
    const start = Math.floor((-vp.tx) / vp.zoom / step) * step;
    const end = (w - vp.tx) / vp.zoom;
    for (let cx = start; cx <= end; cx += minor) {
      const sx = cx * vp.zoom + vp.tx;
      if (sx < 0 || sx > w) continue;
      const major = Math.abs(cx % step) < 0.0001;
      ctx.beginPath();
      ctx.moveTo(sx + 0.5, h);
      ctx.lineTo(sx + 0.5, h - (major ? 10 : 4));
      ctx.stroke();
      if (major) ctx.fillText(String(Math.round(cx)), sx + 3, 11);
    }
  } else {
    const start = Math.floor((-vp.ty) / vp.zoom / step) * step;
    const end = (h - vp.ty) / vp.zoom;
    for (let cy = start; cy <= end; cy += minor) {
      const sy = cy * vp.zoom + vp.ty;
      if (sy < 0 || sy > h) continue;
      const major = Math.abs(cy % step) < 0.0001;
      ctx.beginPath();
      ctx.moveTo(w, sy + 0.5);
      ctx.lineTo(w - (major ? 10 : 4), sy + 0.5);
      ctx.stroke();
      if (major) {
        ctx.save();
        ctx.translate(11, sy + 3);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(String(Math.round(cy)), 0, 0);
        ctx.restore();
      }
    }
  }
  // border edge
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  if (axis === "x") { ctx.moveTo(0, h - 0.5); ctx.lineTo(w, h - 0.5); }
  else { ctx.moveTo(w - 0.5, 0); ctx.lineTo(w - 0.5, h); }
  ctx.stroke();
}

/** Composable rulers: paints top + left ruler canvases and supports drag-out guides. */
export function useRulers({ getCanvas, vp, enabled }: Args) {
  const topRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    drawRuler(topRef.current, "x", vp);
    drawRuler(leftRef.current, "y", vp);
  }, [vp, enabled]);

  const startGuide = (axis: "x" | "y") => (e: React.PointerEvent) => {
    e.preventDefault();
    const c = getCanvas(); if (!c) return;
    const onMove = (ev: PointerEvent) => {
      // Show preview by drawing a temporary line? Simplified: do nothing, finalize on up.
      void ev;
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const rect = (c.upperCanvasEl || c.lowerCanvasEl).getBoundingClientRect();
      const sx = ev.clientX - rect.left;
      const sy = ev.clientY - rect.top;
      const cx = (sx - vp.tx) / vp.zoom;
      const cy = (sy - vp.ty) / vp.zoom;
      const len = 100000;
      const line = axis === "x"
        ? new fabric.Line([cx, -len, cx, len], { stroke: "#22d3ee", strokeWidth: 1, selectable: true, evented: true, hoverCursor: "ew-resize", lockMovementY: true })
        : new fabric.Line([-len, cy, len, cy], { stroke: "#22d3ee", strokeWidth: 1, selectable: true, evented: true, hoverCursor: "ns-resize", lockMovementX: true });
      setMeta(line, { id: newId(), name: axis === "x" ? "Guide V" : "Guide H", kind: "guide" });
      c.add(line); c.requestRenderAll();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return { topRef, leftRef, startGuideX: startGuide("x"), startGuideY: startGuide("y"), RULER };
}
