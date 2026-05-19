import { useRef, useEffect } from "react";

export default function RulerOverlay({ width, height, rulerSize = 24 }) {
  const topRef = useRef<HTMLCanvasElement>(null);
  const leftRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawRuler(topRef.current, "x", width, height, rulerSize);
    drawRuler(leftRef.current, "y", width, height, rulerSize);
  }, [width, height, rulerSize]);

  return (
    <>
      {/* Corner */}
      <div
        className="absolute left-0 top-0 z-50 border-b border-r border-zinc-800 bg-zinc-900"
        style={{ width: rulerSize, height: rulerSize }}
      />
      {/* Top Ruler */}
      <div
        className="absolute left-0 right-0 top-0 z-40 pointer-events-none"
        style={{ left: rulerSize, height: rulerSize }}
      >
        <canvas ref={topRef} width={width - rulerSize} height={rulerSize} />
      </div>
      {/* Left Ruler */}
      <div
        className="absolute bottom-0 left-0 top-0 z-40 pointer-events-none"
        style={{ top: rulerSize, width: rulerSize }}
      >
        <canvas ref={leftRef} width={rulerSize} height={height - rulerSize} />
      </div>
    </>
  );
}

function drawRuler(canvas, axis, width, height, rulerSize) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#27272a";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "10px Inter, sans-serif";
  const step = 100;
  const halfStep = step / 2;
  if (axis === "x") {
    // Main ticks and labels
    for (let x = 0; x <= width - rulerSize; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, rulerSize);
      ctx.lineTo(x + 0.5, rulerSize - 10);
      ctx.stroke();
      ctx.fillText(String(x), x + 4, 10);
    }
    // Middle ticks (no label)
    for (let x = halfStep; x < width - rulerSize; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, rulerSize);
      ctx.lineTo(x + 0.5, rulerSize - 6);
      ctx.stroke();
    }
  } else {
    // Main ticks and labels
    for (let y = 0; y <= height - rulerSize; y += step) {
      ctx.beginPath();
      ctx.moveTo(rulerSize, y + 0.5);
      ctx.lineTo(rulerSize - 10, y + 0.5);
      ctx.stroke();
      ctx.save();
      ctx.translate(10, y + 4);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(String(y), 0, 0);
      ctx.restore();
    }
    // Middle ticks (no label)
    for (let y = halfStep; y < height - rulerSize; y += step) {
      ctx.beginPath();
      ctx.moveTo(rulerSize, y + 0.5);
      ctx.lineTo(rulerSize - 6, y + 0.5);
      ctx.stroke();
    }
  }
}
