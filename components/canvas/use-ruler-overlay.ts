import { useEffect, useRef } from "react";
import type { ViewportState } from "./viewport-state";

const RULER = 24;

function niceStep(zoom: number) {
  const target = 80 / zoom;
  const pow = Math.pow(10, Math.floor(Math.log10(target)));
  const n = target / pow;
  const step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return step * pow;
}

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
  ctx.fillStyle = "#22222a";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#8c8ca0";
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1;
  ctx.fillStyle = "#b4b4c8";
  ctx.globalAlpha = 0.85;
  ctx.font = "10px ui-sans-serif, system-ui";

  const step = niceStep(vp.zoom);
  const minor = step / 5;

  if (axis === "x") {
    const start = Math.floor(-vp.tx / vp.zoom / step) * step;
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
    const start = Math.floor(-vp.ty / vp.zoom / step) * step;
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
  ctx.globalAlpha = 1;
  // border edge
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  if (axis === "x") {
    ctx.moveTo(0, h - 0.5);
    ctx.lineTo(w, h - 0.5);
  } else {
    ctx.moveTo(w - 0.5, 0);
    ctx.lineTo(w - 0.5, h);
  }
  ctx.stroke();
}

export function useRulerOverlay(vp: ViewportState, enabled: boolean) {
  const topRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    drawRuler(topRef.current, "x", vp);
    drawRuler(leftRef.current, "y", vp);
  }, [vp, enabled]);

  return { topRef, leftRef, RULER };
}
