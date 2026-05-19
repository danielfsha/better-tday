import { useEffect } from "react";
import type * as fabric from "fabric";

export type Tool = "select" | "hand" | "frame" | "rect" | "circle" | "text" | "line" | "pen" | "polygon";

interface Args {
  getCanvas: () => fabric.Canvas | null;
  setTool: (t: Tool) => void;
  undo: () => void;
  redo: () => void;
  copy: () => void;
  cut: () => void;
  paste: () => void;
  duplicate: () => void;
  onChange: () => void;
  groupIntoFrame?: () => void;
}

const isEditable = (el: EventTarget | null) => {
  const e = el as HTMLElement | null;
  if (!e) return false;
  const tag = e.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || e.isContentEditable;
};

export function useKeyboardShortcuts({ getCanvas, setTool, undo, redo, copy, cut, paste, duplicate, onChange, groupIntoFrame }: Args) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      const c = getCanvas(); if (!c) return;
      const mod = e.metaKey || e.ctrlKey;

      // History
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) { e.preventDefault(); undo(); return; }
      if (mod && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) { e.preventDefault(); redo(); return; }

      // Clipboard
      if (mod && e.key.toLowerCase() === "c") { e.preventDefault(); copy(); return; }
      if (mod && e.key.toLowerCase() === "x") { e.preventDefault(); cut(); return; }
      if (mod && e.key.toLowerCase() === "v") { e.preventDefault(); paste(); return; }
      if (mod && e.key.toLowerCase() === "d") { e.preventDefault(); duplicate(); return; }

      // Select all / deselect
      if (mod && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const all = c.getObjects().filter((o) => o.selectable !== false);
        if (all.length) {
          c.discardActiveObject();
          import("fabric").then(({ ActiveSelection }) => {
            c.setActiveObject(new ActiveSelection(all, { canvas: c }));
            c.requestRenderAll();
          });
        }
        return;
      }
      if (e.key === "Escape") { c.discardActiveObject(); c.requestRenderAll(); return; }

      // Z-order
      if (mod && e.key === "]") { e.preventDefault(); c.getActiveObjects().forEach((o) => c.bringObjectToFront(o)); c.requestRenderAll(); onChange(); return; }
      if (mod && e.key === "[") { e.preventDefault(); c.getActiveObjects().forEach((o) => c.sendObjectToBack(o)); c.requestRenderAll(); onChange(); return; }
      if (e.altKey && e.key === "]") { e.preventDefault(); c.getActiveObjects().forEach((o) => c.bringObjectForward(o)); c.requestRenderAll(); onChange(); return; }
      if (e.altKey && e.key === "[") { e.preventDefault(); c.getActiveObjects().forEach((o) => c.sendObjectBackwards(o)); c.requestRenderAll(); onChange(); return; }

      // Delete
      if (e.key === "Delete" || e.key === "Backspace") {
        const act = c.getActiveObjects();
        if (act.length) { e.preventDefault(); act.forEach((o) => c.remove(o)); c.discardActiveObject(); c.requestRenderAll(); onChange(); }
        return;
      }

      // Arrow nudge
      if (e.key.startsWith("Arrow")) {
        const step = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        if (dx || dy) {
          const act = c.getActiveObjects();
          if (act.length) {
            e.preventDefault();
            act.forEach((o) => { o.set({ left: (o.left ?? 0) + dx, top: (o.top ?? 0) + dy }); o.setCoords(); });
            c.fire("object:modified", { target: c.getActiveObject() ?? act[0] });
            c.requestRenderAll();
          }
        }
        return;
      }

      // Shift+F to wrap selection into a frame
      if (e.shiftKey && !mod && e.key.toLowerCase() === "f") {
        if (c.getActiveObjects().length && groupIntoFrame) { e.preventDefault(); groupIntoFrame(); return; }
      }

      // Tool shortcuts (single key, no modifier)
      if (!mod && !e.altKey && !e.shiftKey) {
        const map: Record<string, Tool> = { v: "select", h: "hand", f: "frame", r: "rect", o: "circle", l: "line", p: "pen", t: "text", g: "polygon" };
        const k = e.key.toLowerCase();
        if (map[k]) setTool(map[k]);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [getCanvas, setTool, undo, redo, copy, cut, paste, duplicate, onChange, groupIntoFrame]);
}
