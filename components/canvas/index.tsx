"use client";

import React, { useEffect, useRef, useState } from "react";

import * as fabric from "fabric";
import ToolBar from "./tool-bar";
import PropertiesPanel from "./properties-panel";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 600,
      });

      // Ensure scaling is from the corner, not center
      fabricCanvas.centeredScaling = false;

      fabricCanvas.backgroundColor = "#fff";
      fabricCanvas.renderAll();

      setCanvas(fabricCanvas);

      // Example: add a rect with origin at top-left
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 200,
        height: 200,
        originX: "left",
        originY: "top",
      });
      fabricCanvas.add(rect);
      setCanvas(fabricCanvas);
    }

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-300 flex items-center justify-center">
      <ToolBar canvas={canvas} />
      <canvas ref={canvasRef} className="w-full h-full" />
      <PropertiesPanel canvas={canvas} />
    </div>
  );
};
