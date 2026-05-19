"use client";

import FileTree from "@/components/canvas/file-tree";
import FormComponent from "@/components/form-component";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import UserProfile from "@/components/user-profile";
import { useEffect, useRef, useState } from "react";

import { useCanvas } from "@/hooks/use-canvas";
import { Canvas } from "fabric";
import FigmaApp from "@/components/canvas";
import { PropertyPanel } from "@/components/canvas/PropertyPanel";

export default function DesignPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const { addRect, addCircle } = useCanvas({
    canvasRef: fabricRef as React.RefObject<Canvas>,
  });
  const [containerDims, setContainerDims] = useState({
    width: 800,
    height: 800,
  });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Prevent double init in React Strict Mode
    if (fabricRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      backgroundColor: "#B2B6B2",
    });

    fabricRef.current = fabricCanvas;

    const resizeCanvas = () => {
      if (!containerRef.current || !fabricRef.current) return;

      fabricRef.current.setDimensions({
        width: containerRef.current.clientWidth || 800,
        height: containerRef.current.clientHeight || 800,
      });
      fabricRef.current.renderAll();
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);

      fabricCanvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Track container size for rulers and canvas
  useEffect(() => {
    const updateDims = () => {
      if (!containerRef.current) return;
      setContainerDims({
        width: containerRef.current.clientWidth || 800,
        height: containerRef.current.clientHeight || 800,
      });
    };
    updateDims();
    const observer = new ResizeObserver(updateDims);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", updateDims);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateDims);
    };
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <header className="w-full flex items-center justify-between p-1">
        <span>menu</span>
        <UserProfile />
      </header>

      <div className="flex-1 w-full">
        <ResizablePanelGroup orientation="horizontal" className="h-full ">
          {/* Left vertical split */}
          <ResizablePanel defaultSize="20%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="50%">
                <div className="h-full w-full flex flex-col items-start justify-start p-2">
                  <FileTree />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="50%">
                <div className="h-full w-full flex flex-col items-start justify-end p-2">
                  <FormComponent />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Middle panel */}
          <ResizablePanel defaultSize="60%">
            <FigmaApp />
          </ResizablePanel>
          <ResizableHandle withHandle />

          {/* Right panel */}
          <ResizablePanel defaultSize="20%">
            {/* <PropertyPanel
              selected={selected}
              onChange={updateSelected}
              onLayout={updateLayout}
              onMetaChange={updateMeta}
              canvasBg={canvasBg}
              onCanvasBgChange={setCanvasBg}
            /> */}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
