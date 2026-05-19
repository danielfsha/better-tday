import * as fabric from "fabric";
import { getMeta, setMeta, childrenOf, descendantsOf, isAncestor, type Meta } from "./types";

export const bboxOf = (o: fabric.Object) => {
  const x = o.left ?? 0, y = o.top ?? 0;
  const w = (o.width ?? 0) * (o.scaleX ?? 1);
  const h = (o.height ?? 0) * (o.scaleY ?? 1);
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
};

export const reflowFrame = (c: fabric.Canvas, frame: fabric.Object) => {
  const meta = getMeta(frame);
  if (meta.kind !== "frame" || !meta.layout || meta.layout.mode !== "flex") return;
  const { direction, gap, padX, padY, align = "start" } = meta.layout;
  const kids = childrenOf(c, meta.id);
  const fb = bboxOf(frame);
  let cursor = direction === "row" ? padX : padY;
  for (const k of kids) {
    const kb = bboxOf(k);
    if (direction === "row") {
      const cross = align === "center" ? (fb.h - kb.h) / 2 : align === "end" ? fb.h - kb.h - padY : padY;
      k.set({ left: fb.x + cursor, top: fb.y + cross });
      cursor += kb.w + gap;
    } else {
      const cross = align === "center" ? (fb.w - kb.w) / 2 : align === "end" ? fb.w - kb.w - padX : padX;
      k.set({ left: fb.x + cross, top: fb.y + cursor });
      cursor += kb.h + gap;
    }
    k.setCoords();
  }
  if (meta.clip) applyClip(c, frame);
};

/** Apply absolute clipPath rect to every descendant of frame, or remove if disabled. */
export const applyClip = (c: fabric.Canvas, frame: fabric.Object) => {
  const meta = getMeta(frame);
  const desc = descendantsOf(c, meta.id);
  if (meta.kind !== "frame" || !meta.clip) {
    for (const d of desc) { if (d.clipPath) { d.clipPath = undefined; d.dirty = true; } }
    c.requestRenderAll();
    return;
  }
  const fb = bboxOf(frame);
  for (const d of desc) {
    const clip = new fabric.Rect({
      left: fb.x, top: fb.y, width: fb.w, height: fb.h,
      absolutePositioned: true, originX: "left", originY: "top",
    });
    d.clipPath = clip;
    d.dirty = true;
  }
  c.requestRenderAll();
};

/** Translate every descendant by delta when frame moves. */
export const translateDescendants = (c: fabric.Canvas, frame: fabric.Object, dx: number, dy: number) => {
  if (dx === 0 && dy === 0) return;
  const desc = descendantsOf(c, getMeta(frame).id);
  for (const d of desc) {
    d.set({ left: (d.left ?? 0) + dx, top: (d.top ?? 0) + dy });
    d.setCoords();
  }
};

/** Reparent object based on which frame (deepest) contains its center. */
export const reparentByContainment = (c: fabric.Canvas, o: fabric.Object) => {
  const m = getMeta(o);
  const ob = bboxOf(o);
  const frames = c.getObjects().filter((f) => {
    if (getMeta(f).kind !== "frame") return false;
    if (f === o) return false;
    if (isAncestor(c, m.id, getMeta(f).id)) return false; // can't nest into descendant
    const fb = bboxOf(f);
    return ob.cx >= fb.x && ob.cx <= fb.x + fb.w && ob.cy >= fb.y && ob.cy <= fb.y + fb.h;
  });
  // pick the smallest containing frame (deepest)
  frames.sort((a, b) => bboxOf(a).w * bboxOf(a).h - bboxOf(b).w * bboxOf(b).h);
  const host = frames[0];
  setMeta(o, { parentId: host ? getMeta(host).id : undefined });
  if (host) {
    reflowFrame(c, host);
    if (getMeta(host).clip) applyClip(c, host);
  }
};

export const reparentTo = (c: fabric.Canvas, o: fabric.Object, parentId: string | undefined) => {
  if (parentId && isAncestor(c, getMeta(o).id, parentId)) return; // prevent cycles
  setMeta(o, { parentId });
  if (parentId) {
    const p = c.getObjects().find((x) => getMeta(x).id === parentId);
    if (p) { reflowFrame(c, p); if (getMeta(p).clip) applyClip(c, p); }
  }
};

export const defaultLayout = (): NonNullable<Meta["layout"]> => ({
  mode: "free", direction: "row", gap: 8, padX: 12, padY: 12, align: "start",
});
