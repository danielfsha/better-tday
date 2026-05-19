import { Canvas, Circle, Rect } from "fabric";
import { RefObject } from "react";

type UseCanvasProps = {
  canvasRef: RefObject<Canvas | null>;
};

export const useCanvas = ({ canvasRef }: UseCanvasProps) => {
  const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

  const addRect = () => {
    if (!canvasRef.current) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      fill: colors[Math.floor(Math.random() * colors.length)],
      width: 100,
      height: 100,
    });

    canvasRef.current.add(rect);
    canvasRef.current.setActiveObject(rect);
    canvasRef.current.renderAll();
  };

  const addCircle = () => {
    if (!canvasRef.current) return;

    const circle = new Circle({
      left: 100,
      top: 100,
      fill: colors[Math.floor(Math.random() * colors.length)],
      radius: 50,
    });

    canvasRef.current.add(circle);
    canvasRef.current.setActiveObject(circle);
    canvasRef.current.renderAll();
  };

  return {
    addRect,
    addCircle,
  };
};
