"use client";

import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  className,
  ...props
}: ResizablePrimitive.PanelProps & { className?: string }) {
  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      className={cn(
        "border border-gray-300 bg-white dark:bg-zinc-900 dark:border-zinc-700",
        className,
      )}
      {...props}
    />
  );
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-[0.25px] items-center justify-center bg-gray-200 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 transition-colors cursor-col-resize z-20",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-2.5 shrink-0 rounded-lg bg-gray-300 dark:bg-zinc-400" />
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
