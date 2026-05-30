import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type SliderProps = Omit<
  SliderPrimitive.Root.Props,
  "value" | "defaultValue" | "onValueChange"
> & {
  text?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  text = "",
  onValueChange,
  ...props
}: SliderProps) {
  const initialValue = Number(value ?? defaultValue ?? min);

  const [currentValue, setCurrentValue] = useState(String(initialValue));

  const sliderValue = Number(currentValue);
  const _values = [sliderValue];

  useEffect(() => {
    setCurrentValue(String(Number(value ?? defaultValue ?? min)));
  }, [defaultValue, min, value]);

  return (
    <div className="w-full relative">
      {text && (
        <span
          data-slot="slider-text"
          className="absolute top-1/2 -translate-y-1/2 left-4 mb-2 block z-20 font-sans text-black pointer-events-none"
        >
          {text}
        </span>
      )}

      <SliderPrimitive.Root
        className={cn(
          "data-horizontal:w-full data-vertical:h-full overflow-hidden",
          className,
        )}
        data-slot="slider"
        defaultValue={defaultValue}
        value={sliderValue}
        min={min}
        max={max}
        thumbAlignment="edge"
        onValueChange={(nextValue) => {
          const normalizedValue = Array.isArray(nextValue)
            ? (nextValue[0] ?? min)
            : nextValue;
          setCurrentValue(String(normalizedValue));
          onValueChange?.(normalizedValue);
        }}
        {...props}
      >
        <SliderPrimitive.Control className="rounded-md overflow-hidden relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
          <SliderPrimitive.Track className="relative grow overflow-hidden rounded-sm select-none data-horizontal:h-10 data-horizontal:w-full data-vertical:h-full data-vertical:w-1 bg-gray-100 dark:bg-gray-100/10 shadow-sm">
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="bg-primary select-none data-horizontal:h-full data-vertical:w-full rounded-tr-sm rounded-br-sm data-horizontal:origin-left data-vertical:origin-bottom transition-[transform] will-change-transform"
            />
          </SliderPrimitive.Track>
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className="cursor-e-resize relative -ml-2.5 z-20 block w-0.5 h-4 shrink-0 rounded-full bg-orange-200 ring-ring/50 select-none after:absolute after:left-2 after:top-1/2 after:-translate-y-1/2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>

      {currentValue !== "" && (
        <span
          data-slot="slider-value"
          className="tabular-nums absolute top-1/2 -translate-y-1/2 right-4 mb-2 block z-20 font-sans pointer-events-none"
        >
          {currentValue}
        </span>
      )}
    </div>
  );
}

export { Slider };
