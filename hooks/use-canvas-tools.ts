import { useEffect } from "react";
import * as fabric from "fabric";

export function useCanvasTools(fabricRef, tool) {
  useEffect(() => {
    const c = fabricRef.current;
    if (!c) return;
    // Example: Rectangle tool
    if (tool === "rectangle") {
      let isDrawing = false;
      let rect = null;
      const onMouseDown = (opt) => {
        isDrawing = true;
        const pointer = c.getPointer(opt.e);
        rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          width: 1,
          height: 1,
          fill: "#22d3ee44",
          stroke: "#22d3ee",
          strokeWidth: 2,
        });
        c.add(rect);
      };
      const onMouseMove = (opt) => {
        if (!isDrawing || !rect) return;
        const pointer = c.getPointer(opt.e);
        rect.set({
          width: pointer.x - rect.left,
          height: pointer.y - rect.top,
        });
        c.requestRenderAll();
      };
      const onMouseUp = () => {
        isDrawing = false;
        rect = null;
      };
      c.on("mouse:down", onMouseDown);
      c.on("mouse:move", onMouseMove);
      c.on("mouse:up", onMouseUp);
      return () => {
        c.off("mouse:down", onMouseDown);
        c.off("mouse:move", onMouseMove);
        c.off("mouse:up", onMouseUp);
      };
    }
    // TODO: Add other tools (ellipse, line, etc.)
  }, [fabricRef, tool]);
}
