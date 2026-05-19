// Shared types & metadata helpers for the editor.
import type * as fabric from "fabric";

export type LayoutMode = "free" | "flex";
export type FlexDir = "row" | "column";

export interface Meta {
  id: string;
  name: string;
  kind?: "frame" | "shape" | "text" | "line" | "path" | "button" | "image" | "guide";
  parentId?: string;
  /** Frames only: clip children to bounds */
  clip?: boolean;
  layout?: {
    mode: LayoutMode;
    direction: FlexDir;
    gap: number;
    padX: number;
    padY: number;
    align?: "start" | "center" | "end";
  };
  style?: {
    radius?: number;
    fontWeight?: number;
    role?: "button" | "card" | "navbar" | "input";
  };
}

export type MObj = fabric.Object & { _meta?: Meta };

export const newId = () => "n_" + Math.random().toString(36).slice(2, 10);

export const getMeta = (o: fabric.Object): Meta => {
  const m = (o as MObj)._meta;
  if (m) return m;
  const fresh: Meta = { id: newId(), name: o.type ?? "layer", kind: "shape" };
  (o as MObj)._meta = fresh;
  return fresh;
};

export const setMeta = (o: fabric.Object, patch: Partial<Meta>) => {
  const cur = getMeta(o);
  (o as MObj)._meta = {
    ...cur,
    ...patch,
    layout: patch.layout ?? cur.layout,
    style: patch.style ?? cur.style,
  };
};

export const findById = (c: fabric.Canvas, id: string) =>
  c.getObjects().find((o) => getMeta(o).id === id);

export const childrenOf = (c: fabric.Canvas, id: string) =>
  c.getObjects().filter((o) => getMeta(o).parentId === id);

export const descendantsOf = (c: fabric.Canvas, id: string): fabric.Object[] => {
  const out: fabric.Object[] = [];
  const walk = (pid: string) => {
    for (const k of childrenOf(c, pid)) {
      out.push(k);
      walk(getMeta(k).id);
    }
  };
  walk(id);
  return out;
};

export const isAncestor = (c: fabric.Canvas, ancestorId: string, nodeId: string) => {
  let cur: string | undefined = nodeId;
  while (cur) {
    if (cur === ancestorId) return true;
    const o = findById(c, cur);
    cur = o ? getMeta(o).parentId : undefined;
  }
  return false;
};
