import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { AnimatedText } from "../animated-text";
import { useEffect, useState } from "react";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  text = "",
  ...props
}: SliderPrimitive.Root.Props & { text?: string }) {
  const initialValue = Array.isArray(value)
    ? value.join(" - ")
    : Array.isArray(defaultValue)
      ? defaultValue.join(" - ")
      : String(value ?? defaultValue ?? min);

  const [currentValue, setCurrentValue] = useState(initialValue);

  // Keep thumb count aligned with the slider mode.
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [Number(value ?? defaultValue ?? min)];

  useEffect(() => {
    // convert to  string so i can animate it with the animated text component
    const source = value ?? defaultValue ?? min;
    const stringValue = Array.isArray(source)
      ? source.join(" - ")
      : String(source);
    setCurrentValue(stringValue);
  }, [defaultValue, min, value]);

  return (
    <div className="w-full h-auto relative">
      {text && (
        <span
          data-slot="slider-text"
          className="absolute top-1/2 -translate-y-1/2 left-4 mb-2 block z-20 font-sans"
        >
          {text}
        </span>
      )}

      <SliderPrimitive.Root
        className={cn("data-horizontal:w-full data-vertical:h-full", className)}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        thumbAlignment="edge"
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col">
          <SliderPrimitive.Track className="relative grow overflow-hidden rounded-md select-none data-horizontal:h-10 data-horizontal:w-full data-vertical:h-full data-vertical:w-1 bg-gray-300">
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="bg-primary select-none data-horizontal:h-full data-vertical:w-full rounded-tr-md rounded-br-md data-horizontal:origin-left data-vertical:origin-bottom transition-[transform] will-change-transform"
            />
          </SliderPrimitive.Track>
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className="relative -ml-2.5 z-20 block w-1 h-6 shrink-0 rounded-full bg-yellow-600/50 ring-ring/50 select-none after:absolute after:left-2 after:top-1/2 after:-translate-y-1/2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>

      {currentValue !== "" && (
        <span
          data-slot="slider-value"
          className="tabular-nums absolute top-1/2 -translate-y-1/2 right-4 mb-2 block z-20 font-sans"
        >
          <AnimatedText value={currentValue} animateKey={currentValue} />
          {/* {value} */}
        </span>
      )}
    </div>
  );
}

export { Slider };
