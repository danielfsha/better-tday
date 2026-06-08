import * as React from "react";
import { NumberField } from "@base-ui/react/number-field";

import { cn } from "@/lib/utils";

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
  const id = React.useId();

  return (
    <NumberField.Root
      value={value}
      min={Number.isFinite(min) ? min : undefined}
      max={Number.isFinite(max) ? max : undefined}
      step={step}
      onValueChange={(nextValue) => {
        if (nextValue === null) {
          return;
        }
        onChange(nextValue);
      }}
      className={cn(
        "flex h-6.5 items-center gap-1 rounded-sm border border-[#353535] bg-[#2D2D2D]",
        className,
      )}
    >
      <NumberField.ScrubArea
        className="flex h-full items-center gap-1 px-2 text-xs text-gray-400 select-none cursor-ew-resize"
        title={`Drag to change ${label}`}
      >
        {/* <NumberField.ScrubAreaCursor className="text-gray-200 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
          <CursorGrowIcon className="size-3" />
        </NumberField.ScrubAreaCursor> */}
        {label}
      </NumberField.ScrubArea>

      <NumberField.Group className="flex h-full items-center">
        <NumberField.Input
          id={id}
          aria-label={label}
          className={cn(
            "h-full w-16 bg-transparent px-1 text-xs text-gray-200 tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            inputClassName,
          )}
        />
      </NumberField.Group>
    </NumberField.Root>
  );
}

function CursorGrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 6L4 10L8 14M12 6L16 10L12 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
