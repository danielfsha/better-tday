import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { getMeta, setMeta, newId } from "../types";
import type { Tool } from "./useKeyboardShortcuts";

interface Args {
  getCanvas: () => fabric.Canvas | null;
  toolRef: React.RefObject<Tool>;
  setTool: (t: Tool) => void;
}

/** Composable polygon tool. Click to add points, Enter or click-near-start to finish, Esc to cancel. */
export function usePolygonTool({ getCanvas, toolRef, setTool }: Args) {
  const ptsRef = useRef<{ x: number; y: number }[]>([]);
  const previewRef = useRef<fabric.Polyline | null>(null);
  const handlesRef = useRef<fabric.Circle[]>([]);

  useEffect(() => {
    const c = getCanvas(); if (!c) return;

    const cleanup = () => {
      if (previewRef.current) c.remove(previewRef.current);
      handlesRef.current.forEach((h) => c.remove(h));
      previewRef.current = null;
      handlesRef.current = [];
      ptsRef.current = [];
      c.requestRenderAll();
    };

    const finalize = () => {
      const pts = ptsRef.current;
      if (pts.length >= 3) {
        const poly = new fabric.Polygon(pts, { fill: "#a78bfa", stroke: "#7c3aed", strokeWidth: 1 });
        setMeta(poly, { id: newId(), name: "Polygon", kind: "shape" });
        c.add(poly);
        c.setActiveObject(poly);
        c.fire("object:modified", { target: poly });
      }
      cleanup();
      setTool("select");
    };

    const onDown = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
      if (toolRef.current !== "polygon") return;
      const evt = opt.e as MouseEvent;
      const p = c.getScenePoint(evt);
      const pts = ptsRef.current;
      // close near first
      if (pts.length >= 3) {
        const dx = p.x - pts[0].x, dy = p.y - pts[0].y;
        if (Math.hypot(dx, dy) < 8 / c.getZoom()) { finalize(); return; }
      }
      pts.push({ x: p.x, y: p.y });
      const handle = new fabric.Circle({
        left: p.x - 4, top: p.y - 4, radius: 4, fill: "#fff", stroke: "#7c3aed",
        selectable: false, evented: false, hoverCursor: "default",
      });
      handlesRef.current.push(handle);
      c.add(handle);
      if (previewRef.current) c.remove(previewRef.current);
      previewRef.current = new fabric.Polyline([...pts], {
        fill: "rgba(167,139,250,0.2)", stroke: "#a78bfa", strokeWidth: 1,
        selectable: false, evented: false, objectCaching: false,
      });
      c.add(previewRef.current);
      c.requestRenderAll();
    };

    const onMove = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
      if (toolRef.current !== "polygon" || ptsRef.current.length === 0) return;
      const evt = opt.e as MouseEvent;
      const p = c.getScenePoint(evt);
      const pts = ptsRef.current;
      if (previewRef.current) c.remove(previewRef.current);
      previewRef.current = new fabric.Polyline([...pts, { x: p.x, y: p.y }], {
        fill: "rgba(167,139,250,0.15)", stroke: "#a78bfa", strokeWidth: 1,
        strokeDashArray: [4, 4], selectable: false, evented: false, objectCaching: false,
      });
      c.add(previewRef.current);
      c.requestRenderAll();
    };

    const onKey = (e: KeyboardEvent) => {
      if (toolRef.current !== "polygon") return;
      if (e.key === "Enter") { e.preventDefault(); finalize(); }
      else if (e.key === "Escape") { e.preventDefault(); cleanup(); setTool("select"); }
    };

    c.on("mouse:down", onDown);
    c.on("mouse:move", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      cleanup();
      c.off("mouse:down", onDown);
      c.off("mouse:move", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [getCanvas, toolRef, setTool]);
}
