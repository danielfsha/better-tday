// Position panel for canvas properties
import React, { useState } from "react";
import { NumberInput } from "@/components/ui/number-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function PositionPanel({
  left,
  top,
  setLeft,
  setTop,
  handleInputChange,
}: any) {
  const [isTopActive, setIsTopActive] = useState(false);
  const [isBottomActive, setIsBottomActive] = useState(false);
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);

  const toggleTopPin = () => setIsTopActive((prev) => !prev);
  const toggleBottomPin = () => setIsBottomActive((prev) => !prev);
  const toggleLeftPin = () => setIsLeftActive((prev) => !prev);
  const toggleRightPin = () => setIsRightActive((prev) => !prev);

  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs font-semibold text-gray-400 mb-1">Position</span>

      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 flex-1">
          <NumberInput
            label="X"
            value={left}
            onChange={(v) => handleInputChange(setLeft, "left")(v)}
            className="w-full"
            inputClassName="w-full"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <NumberInput
            label="Y"
            value={top}
            onChange={(v) => handleInputChange(setTop, "top")(v)}
            className="w-full"
            inputClassName="w-full"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="flex flex-col gap-1 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="rounded-sm w-full justify-between text-white"
              >
                <span>Left</span>
                <ChevronDown className="size-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem>Left</DropdownMenuItem>
              <DropdownMenuItem>Center</DropdownMenuItem>
              <DropdownMenuItem>Right</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="rounded-sm w-full justify-between text-white"
              >
                <span>Top</span>
                <ChevronDown className="size-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem>Top</DropdownMenuItem>
              <DropdownMenuItem>Middle</DropdownMenuItem>
              <DropdownMenuItem>Bottom</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Constraint Alignment Pad */}
        <div className="flex items-center justify-center">
          <div
            className="relative w-[84px] h-[72px] bg-[#0a0a0a] rounded-lg border border-[#353535] overflow-hidden flex items-center justify-center"
            style={{ contentVisibility: "auto" }}
          >
            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="w-full border-t border-dashed border-white" />
              <div className="absolute h-full border-l border-dashed border-white" />
            </div>

            {/* Inner bounds */}
            <div className="absolute w-10 h-7 rounded bg-zinc-900/20 border border-zinc-800/30 pointer-events-none" />

            {/* Top Pin */}
            <button
              type="button"
              onClick={toggleTopPin}
              aria-label="Toggle Top Pin"
              className="absolute top-1 inset-x-0 h-4 flex items-center justify-center group"
            >
              <div
                className={`w-1 h-3 rounded-full transition-all duration-200 ${
                  isTopActive
                    ? "bg-[#c084fc] scale-y-110"
                    : "bg-gray-500/60 group-hover:bg-zinc-400"
                }`}
              />
            </button>

            {/* Bottom Pin */}
            <button
              type="button"
              onClick={toggleBottomPin}
              aria-label="Toggle Bottom Pin"
              className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-center group"
            >
              <div
                className={`w-1 h-3 rounded-full transition-all duration-200 ${
                  isBottomActive
                    ? "bg-[#c084fc] scale-y-110"
                    : "bg-gray-500/60 group-hover:bg-zinc-400"
                }`}
              />
            </button>

            {/* Left Pin */}
            <button
              type="button"
              onClick={toggleLeftPin}
              aria-label="Toggle Left Pin"
              className="absolute left-1 inset-y-0 w-4 flex items-center justify-center group"
            >
              <div
                className={`h-1 w-3 rounded-full transition-all duration-200 ${
                  isLeftActive
                    ? "bg-[#c084fc] scale-x-110"
                    : "bg-gray-500/60 group-hover:bg-zinc-400"
                }`}
              />
            </button>

            {/* Right Pin */}
            <button
              type="button"
              onClick={toggleRightPin}
              aria-label="Toggle Right Pin"
              className="absolute right-1 inset-y-0 w-4 flex items-center justify-center group"
            >
              <div
                className={`h-1 w-3 rounded-full transition-all duration-200 ${
                  isRightActive
                    ? "bg-[#c084fc] scale-x-110"
                    : "bg-gray-500/60 group-hover:bg-zinc-400"
                }`}
              />
            </button>

            {/* Center Node */}
            <div
              className={`w-2.5 h-2.5 rounded bg-violet-600/80 border border-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-all ${
                isLeftActive || isRightActive || isTopActive || isBottomActive
                  ? "opacity-100 scale-100"
                  : "opacity-30"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
