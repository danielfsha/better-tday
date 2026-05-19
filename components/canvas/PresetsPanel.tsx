import { PRESETS } from "./presets";

function PresetThumb({ id }: { id: string }) {
  if (id === "button")
    return (
      <div className="rounded-full bg-primary px-3 py-1 text-[9px] text-primary-foreground">
        Button
      </div>
    );
  if (id === "card")
    return <div className="h-8 w-16 rounded bg-foreground/90" />;
  if (id === "navbar")
    return (
      <div className="flex h-4 w-20 items-center justify-between rounded bg-foreground/90 px-1">
        <div className="h-1 w-3 bg-background" />
        <div className="h-1 w-2 bg-primary" />
      </div>
    );
  if (id === "hero")
    return (
      <div className="h-8 w-20 rounded bg-gradient-to-br from-primary to-foreground" />
    );
  if (id === "stack")
    return (
      <div className="flex h-8 w-12 flex-col gap-1">
        <div className="h-1.5 flex-1 rounded bg-foreground/40" />
        <div className="h-1.5 flex-1 rounded bg-foreground/40" />
        <div className="h-1.5 flex-1 rounded bg-foreground/40" />
      </div>
    );
  if (id === "row")
    return (
      <div className="flex h-4 w-20 gap-1">
        <div className="h-full flex-1 rounded bg-foreground/40" />
        <div className="h-full flex-1 rounded bg-foreground/40" />
        <div className="h-full flex-1 rounded bg-foreground/40" />
      </div>
    );
  return <span>{id}</span>;
}

export function PresetsPanel({ onInsert }: { onInsert: (id: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <div className="mb-2 px-1 text-[11px] text-muted-foreground">
        Click to insert into canvas.
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onInsert(p.id)}
            className="group flex flex-col items-start gap-1 rounded-md border border-border bg-secondary p-2 text-left transition-all hover:border-primary hover:bg-accent"
          >
            <div className="grid h-12 w-full place-items-center rounded bg-background text-[10px] text-muted-foreground">
              <PresetThumb id={p.id} />
            </div>
            <div className="text-[11px] font-semibold">{p.label}</div>
            <div className="text-[10px] leading-tight text-muted-foreground">
              {p.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
