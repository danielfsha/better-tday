import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { getMeta, newId, setMeta } from "../types";
import type { Tool } from "./useKeyboardShortcuts";

interface Args {
  getCanvas: () => fabric.Canvas | null;
  toolRef: React.RefObject<Tool>;
  setTool: (t: Tool) => void;
  onZoom: (z: number) => void;
}

export function useCanvasInteractions({ getCanvas, toolRef, setTool, onZoom }: Args) {
  const spaceRef = useRef(false);

  useEffect(() => {
    const c = getCanvas(); if (!c) return;

    let isPanning = false, isDrawing = false;
    let startPt: { x: number; y: number } | null = null;
    let tempObj: fabric.Object | null = null;

    const onSpaceKey = (e: KeyboardEvent, down: boolean) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        spaceRef.current = down;
        c.defaultCursor = down ? "grab" : (toolRef.current === "hand" ? "grab" : "default");
      }
    };
    const kd = (e: KeyboardEvent) => onSpaceKey(e, true);
    const ku = (e: KeyboardEvent) => onSpaceKey(e, false);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);

    const onDown = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
      const evt = opt.e as MouseEvent;
      const t = toolRef.current;
      if (t === "hand" || spaceRef.current || evt.button === 1) {
        isPanning = true; c.defaultCursor = "grabbing"; c.selection = false; return;
      }
      if (t === "select") return;
      const p = c.getScenePoint(evt);
      startPt = { x: p.x, y: p.y }; isDrawing = true;
      if (t === "rect") tempObj = new fabric.Rect({ left: p.x, top: p.y, width: 1, height: 1, fill: "#6366f1" });
      else if (t === "frame") tempObj = new fabric.Rect({ left: p.x, top: p.y, width: 1, height: 1, fill: "#ffffff", stroke: "#e5e7eb", strokeWidth: 1, rx: 12, ry: 12 });
      else if (t === "circle") tempObj = new fabric.Ellipse({ left: p.x, top: p.y, rx: 1, ry: 1, fill: "#22d3ee" });
      else if (t === "line") tempObj = new fabric.Line([p.x, p.y, p.x, p.y], { stroke: "#f5f5f5", strokeWidth: 2 });
      else if (t === "text") {
        const it = new fabric.IText("Text", { left: p.x, top: p.y, fill: "#ffffff", fontSize: 32, fontFamily: "Inter, sans-serif" });
        setMeta(it, { id: newId(), name: "Text", kind: "text" });
        c.add(it); c.setActiveObject(it); it.enterEditing();
        isDrawing = false; setTool("select"); return;
      }
      if (tempObj) {
        const kind = t === "frame" ? "frame" : t === "line" ? "line" : "shape";
        setMeta(tempObj, { id: newId(), name: t[0].toUpperCase() + t.slice(1), kind });
        c.add(tempObj);
      }
    };

    const onMove = (opt: fabric.TPointerEventInfo<fabric.TPointerEvent>) => {
      const evt = opt.e as MouseEvent;
      if (isPanning) {
        const vpt = c.viewportTransform!; vpt[4] += evt.movementX; vpt[5] += evt.movementY;
        c.setViewportTransform(vpt); return;
      }
      if (!isDrawing || !startPt || !tempObj) return;
      const p = c.getScenePoint(evt);
      const t = toolRef.current;
      if (t === "rect" || t === "frame") {
        (tempObj as fabric.Rect).set({
          left: Math.min(startPt.x, p.x), top: Math.min(startPt.y, p.y),
          width: Math.abs(p.x - startPt.x), height: Math.abs(p.y - startPt.y),
        });
      } else if (t === "circle") {
        (tempObj as fabric.Ellipse).set({
          left: Math.min(startPt.x, p.x), top: Math.min(startPt.y, p.y),
          rx: Math.abs(p.x - startPt.x) / 2, ry: Math.abs(p.y - startPt.y) / 2,
        });
      } else if (t === "line") {
        (tempObj as fabric.Line).set({ x2: p.x, y2: p.y });
      }
      c.requestRenderAll();
    };

    const onUp = () => {
      if (isPanning) {
        isPanning = false;
        c.defaultCursor = toolRef.current === "hand" ? "grab" : "default";
        c.selection = toolRef.current === "select";
      }
      if (isDrawing && tempObj) {
        tempObj.setCoords();
        // Fire modified so app-level reparent/reflow runs
        c.fire("object:modified", { target: tempObj });
        setTool("select");
        c.setActiveObject(tempObj);
      }
      isDrawing = false; startPt = null; tempObj = null;
    };

    const onWheel = (opt: fabric.TPointerEventInfo<WheelEvent>) => {
      const e = opt.e; e.preventDefault(); e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
        let z = c.getZoom() * (0.999 ** e.deltaY);
        z = Math.min(Math.max(z, 0.1), 8);
        c.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), z);
        onZoom(z);
      } else {
        const vpt = c.viewportTransform!; vpt[4] -= e.deltaX; vpt[5] -= e.deltaY;
        c.setViewportTransform(vpt);
      }
    };

    c.on("mouse:down", onDown);
    c.on("mouse:move", onMove);
    c.on("mouse:up", onUp);
    c.on("mouse:wheel", onWheel);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      c.off("mouse:down", onDown); c.off("mouse:move", onMove);
      c.off("mouse:up", onUp); c.off("mouse:wheel", onWheel);
    };
  }, [getCanvas, toolRef, setTool, onZoom]);
}
