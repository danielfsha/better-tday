import React, { useRef, useState, useCallback, useEffect } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputClassName?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  className = "",
  inputClassName = "",
}: NumberInputProps) {
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startValue = useRef(value);

  // Update startValue if value changes externally
  useEffect(() => {
    if (!dragging) startValue.current = value;
  }, [value, dragging]);

  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      startX.current = e.clientX;
      startValue.current = value;
      document.body.style.cursor = "ew-resize";
    },
    [value],
  );

  useEffect(() => {
    if (!dragging) {
      document.body.style.cursor = "";
      return;
    }
    const onMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      let newValue = startValue.current + diff * step;
      newValue = Math.round(newValue / step) * step;
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(newValue);
    };
    const onUp = () => {
      setDragging(false);
      document.body.style.cursor = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
    };
  }, [dragging, min, max, step, onChange]);

  return (
    <div
      className={`flex items-center gap-2 ${className} border border-[#353535] bg-[#2D2D2D] h-[26px] rounded-[4px]`}
    >
      <span
        className="select-none cursor-ew-resize h-full w-auto px-2 rounded text-xs text-gray-400 flex items-center"
        onMouseDown={onDragStart}
        style={{ userSelect: "none" }}
        title={`Drag to change ${label}`}
      >
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-16 p-1 text-xs text-gray-200 bg-transparent rounded focus:outline-none focus:border-violet-400 ${inputClassName}`}
        style={{ cursor: dragging ? "ew-resize" : "text" }}
      />
    </div>
  );
}
