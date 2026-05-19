import { TOOLS } from "./tools";
import type { Tool } from "./hooks/useKeyboardShortcuts";

interface Props { tool: Tool; setTool: (t: Tool) => void; }

/** Vertical tools rail, each tool is a configurable entry from tools.ts (composable registry). */
export function ToolsBar({ tool, setTool }: Props) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-panel py-2">
      {TOOLS.map((t) => {
        const Icon = t.icon;
        const active = tool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            title={`${t.label} (${t.shortcut})`}
            className={`grid h-9 w-9 place-items-center rounded transition-colors ${
              active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-accent"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
