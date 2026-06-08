"use client";

import React, { useEffect, useRef, useState } from "react";

import * as fabric from "fabric";
import ToolBar from "./tool-bar";
import PropertiesPanel from "./properties-panel";
import LeftSidebar from "./left-sidebar";

export const Canvas = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) {
      return;
    }

    const fabricCanvas = new fabric.Canvas(element, {
      width: 400,
      height: 600,
    });

    // Ensure scaling is from the corner, not center
    fabricCanvas.centeredScaling = false;

    fabricCanvas.backgroundColor = "#fff";
    fabricCanvas.renderAll();

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

    return () => {
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-300 flex items-center justify-center">
      <LeftSidebar
        canvas={canvas}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
      <canvas ref={canvasRef} className="flex-1 h-full" />
      <PropertiesPanel
        canvas={canvas}
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
};
