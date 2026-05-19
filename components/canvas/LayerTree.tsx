import { useState, useMemo } from "react";
import type * as fabric from "fabric";
import {
  ChevronRight, ChevronDown, Square, Circle as CircleIcon, Type, Minus, Pen,
  Image as ImageIcon, Frame as FrameIcon,
} from "lucide-react";
import { getMeta, type Meta } from "./types";

export interface LayerNode {
  id: string;
  name: string;
  type: string;
  kind: Meta["kind"];
  obj: fabric.Object;
  children: LayerNode[];
}

function LayerIcon({ type, kind }: { type: string; kind: Meta["kind"] }) {
  const cls = "text-muted-foreground shrink-0";
  if (kind === "frame") return <FrameIcon size={12} className={cls} />;
  if (type === "rect") return <Square size={12} className={cls} />;
  if (type === "ellipse" || type === "circle") return <CircleIcon size={12} className={cls} />;
  if (type === "i-text" || type === "text") return <Type size={12} className={cls} />;
  if (type === "line") return <Minus size={12} className={cls} />;
  if (type === "path") return <Pen size={12} className={cls} />;
  if (type === "image") return <ImageIcon size={12} className={cls} />;
  return <Square size={12} className={cls} />;
}

interface Props {
  objects: fabric.Object[];
  selectedId: string | null;
  onSelect: (n: LayerNode) => void;
  onRename: (id: string, name: string) => void;
  onReparent: (id: string, newParent: string | undefined, beforeId?: string) => void;
}

/** Build a tree from flat list using parentId. */
function buildTree(objects: fabric.Object[]): LayerNode[] {
  const map = new Map<string, LayerNode>();
  const all: LayerNode[] = objects
    .filter((o) => getMeta(o).kind !== "guide")
    .map((o) => {
      const m = getMeta(o);
      return { id: m.id, name: m.name, type: o.type ?? "object", kind: m.kind, obj: o, children: [] };
    });
  all.forEach((n) => map.set(n.id, n));
  const roots: LayerNode[] = [];
  for (const n of all) {
    const pid = getMeta(n.obj).parentId;
    if (pid && map.has(pid)) map.get(pid)!.children.push(n);
    else roots.push(n);
  }
  // Reverse so top-of-stack appears first (Figma-style)
  return roots.reverse();
}

export function LayerTree({ objects, selectedId, onSelect, onRename, onReparent }: Props) {
  const tree = useMemo(() => buildTree(objects), [objects]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !(o[id] ?? true) }));
  const isOpen = (id: string) => open[id] ?? true;

  const renderNode = (n: LayerNode, depth: number) => {
    const active = selectedId === n.id;
    const hasKids = n.children.length > 0;
    return (
      <div key={n.id}>
        <div
          draggable
          onDragStart={(e) => { setDragId(n.id); e.dataTransfer.setData("text/plain", n.id); }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => {
            e.preventDefault(); e.stopPropagation();
            const src = dragId ?? e.dataTransfer.getData("text/plain");
            if (!src || src === n.id) return;
            // If target is a frame, reparent into it; else reorder as sibling before n
            const parentId = n.kind === "frame" ? n.id : getMeta(n.obj).parentId;
            onReparent(src, parentId, n.kind === "frame" ? undefined : n.id);
            setDragId(null);
          }}
          className={`group flex items-center gap-1 py-1 pr-2 text-xs cursor-pointer ${
            active ? "bg-primary/20 text-foreground" : "hover:bg-accent text-foreground/80"
          }`}
          style={{ paddingLeft: 8 + depth * 12 }}
          onClick={() => onSelect(n)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); if (hasKids) toggle(n.id); }}
            className="grid h-4 w-4 place-items-center text-muted-foreground"
          >
            {hasKids ? (isOpen(n.id) ? <ChevronDown size={11} /> : <ChevronRight size={11} />) : <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />}
          </button>
          <LayerIcon type={n.type} kind={n.kind} />
          {editing === n.id ? (
            <input
              autoFocus defaultValue={n.name}
              onBlur={(e) => { onRename(n.id, e.target.value || n.name); setEditing(null); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { onRename(n.id, (e.target as HTMLInputElement).value || n.name); setEditing(null); }
                if (e.key === "Escape") setEditing(null);
                e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded border border-primary bg-input px-1 text-xs outline-none"
            />
          ) : (
            <span
              className="truncate flex-1"
              onDoubleClick={(e) => { e.stopPropagation(); setEditing(n.id); }}
            >
              {n.name}
            </span>
          )}
        </div>
        {hasKids && isOpen(n.id) && n.children.map((k) => renderNode(k, depth + 1))}
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto py-1"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const src = dragId ?? e.dataTransfer.getData("text/plain");
        if (src) onReparent(src, undefined);
        setDragId(null);
      }}
    >
      {tree.length === 0 && <div className="px-3 py-2 text-xs text-muted-foreground">No layers</div>}
      {tree.map((n) => renderNode(n, 0))}
    </div>
  );
}
