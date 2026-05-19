import { Undo2, Redo2, ZoomIn, ZoomOut, Code2, Ruler } from "lucide-react";
import { TOOLS } from "./tools";
import type { Tool } from "./hooks/useKeyboardShortcuts";

interface Props {
  tool: Tool;
  setTool: (t: Tool) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  setZoom: (z: number) => void;
  onExport: () => void;
  showRulers: boolean;
  toggleRulers: () => void;
}

export function Toolbar({
  tool,
  undo,
  redo,
  canUndo,
  canRedo,
  zoom,
  setZoom,
  onExport,
  showRulers,
  toggleRulers,
}: Props) {
  const active = TOOLS.find((t) => t.id === tool);
  return (
    <div className="flex h-12 items-center justify-between border-b border-border bg-toolbar px-3">
      <div className="flex items-center gap-3">
        <div className="grid h-7 w-7 place-items-center rounded bg-primary text-primary-foreground text-xs font-bold">
          F
        </div>
        <div className="text-xs text-muted-foreground">
          {active?.label ?? "Tool"}{" "}
          <span className="opacity-50">({active?.shortcut})</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleRulers}
          title="Toggle rulers"
          className={`grid h-8 w-8 place-items-center rounded ${showRulers ? "bg-accent text-foreground" : "hover:bg-accent text-foreground/70"}`}
        >
          <Ruler size={16} />
        </button>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          className="grid h-8 w-8 place-items-center rounded hover:bg-accent disabled:opacity-30"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          className="grid h-8 w-8 place-items-center rounded hover:bg-accent disabled:opacity-30"
        >
          <Redo2 size={16} />
        </button>
        <div className="mx-2 h-5 w-px bg-border" />
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="grid h-8 w-8 place-items-center rounded hover:bg-accent"
        >
          <ZoomOut size={16} />
        </button>
        <span className="w-12 text-center text-xs tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="grid h-8 w-8 place-items-center rounded hover:bg-accent"
        >
          <ZoomIn size={16} />
        </button>
        <div className="mx-2 h-5 w-px bg-border" />
        {/* <button onClick={onExport} className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          <Code2 size={14} /> Export
        </button> */}
      </div>
    </div>
  );
}
