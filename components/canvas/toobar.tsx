'use client";';

import { Circle, Rectangle } from "@phosphor-icons/react";
import { Canvas } from "fabric";
import { useCanvas } from "@/hooks/use-canvas";

export default function Toolbar({
  canvasRef,
}: {
  canvasRef: React.RefObject<Canvas>;
}) {
  const { addRect, addCircle } = useCanvas({ canvasRef });

  return (
    <div className="absolute -0 bottom-2 left-1/2 bg-white -translate-x-1/2">
      <button onClick={addRect} className="rounded px-4 py-2 text-black">
        <Rectangle size={20} />
      </button>

      <button onClick={addCircle} className="rounded px-4 py-2 text-black">
        <Circle size={20} />
      </button>
    </div>
  );
}
