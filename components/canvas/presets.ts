import * as fabric from "fabric";
import { newId, setMeta, type Meta } from "./types";

// Each preset returns one or more fabric objects ready to add at (x, y).
export interface Preset {
  id: string;
  label: string;
  description: string;
  build: (x: number, y: number) => fabric.Object[];
}

const frame = (
  x: number, y: number, w: number, h: number,
  name: string, fill = "#ffffff", layout?: Meta["layout"], radius = 12,
): fabric.Object => {
  const r = new fabric.Rect({
    left: x, top: y, width: w, height: h, fill,
    rx: radius, ry: radius, stroke: "#e5e7eb", strokeWidth: 1,
  });
  setMeta(r, { id: newId(), name, kind: "frame", layout });
  return r;
};

const text = (
  x: number, y: number, content: string,
  opts: { size?: number; weight?: number; color?: string; parentId?: string } = {},
): fabric.Object => {
  const t = new fabric.IText(content, {
    left: x, top: y,
    fontSize: opts.size ?? 16,
    fontWeight: opts.weight ?? 500,
    fontFamily: "Inter, system-ui, sans-serif",
    fill: opts.color ?? "#0f172a",
  });
  setMeta(t, { id: newId(), name: content.slice(0, 24), kind: "text", parentId: opts.parentId, style: { fontWeight: opts.weight } });
  return t;
};

const box = (
  x: number, y: number, w: number, h: number,
  fill: string, name: string, opts: { radius?: number; parentId?: string; role?: Meta["style"] extends infer S ? S extends { role?: infer R } ? R : never : never } = {},
): fabric.Object => {
  const r = new fabric.Rect({ left: x, top: y, width: w, height: h, fill, rx: opts.radius ?? 8, ry: opts.radius ?? 8 });
  setMeta(r, { id: newId(), name, kind: "shape", parentId: opts.parentId, style: { radius: opts.radius, role: opts.role } });
  return r;
};

export const PRESETS: Preset[] = [
  {
    id: "button",
    label: "Button",
    description: "Pill button with label",
    build: (x, y) => {
      const f = frame(x, y, 140, 44, "Button", "#6366f1", { mode: "flex", direction: "row", gap: 8, padX: 20, padY: 12, align: "center" }, 999);
      const fid = (f as fabric.Object & { _meta?: Meta })._meta!.id;
      setMeta(f, { style: { role: "button", radius: 999 } });
      const label = text(x + 30, y + 12, "Get started", { size: 14, weight: 600, color: "#ffffff", parentId: fid });
      return [f, label];
    },
  },
  {
    id: "card",
    label: "Card",
    description: "Card with title + body",
    build: (x, y) => {
      const f = frame(x, y, 280, 160, "Card", "#ffffff", { mode: "flex", direction: "column", gap: 8, padX: 20, padY: 20 }, 16);
      const fid = (f as fabric.Object & { _meta?: Meta })._meta!.id;
      setMeta(f, { style: { role: "card", radius: 16 } });
      const title = text(x + 20, y + 20, "Card title", { size: 18, weight: 700, color: "#0f172a", parentId: fid });
      const body = text(x + 20, y + 50, "Short supporting text goes here.", { size: 13, weight: 400, color: "#64748b", parentId: fid });
      return [f, title, body];
    },
  },
  {
    id: "navbar",
    label: "Navbar",
    description: "Top navigation",
    build: (x, y) => {
      const f = frame(x, y, 720, 64, "Navbar", "#0f172a", { mode: "flex", direction: "row", gap: 24, padX: 24, padY: 20, align: "center" }, 12);
      const fid = (f as fabric.Object & { _meta?: Meta })._meta!.id;
      setMeta(f, { style: { role: "navbar", radius: 12 } });
      const logo = text(x + 24, y + 22, "◆ Brand", { size: 16, weight: 700, color: "#ffffff", parentId: fid });
      const l1 = text(x + 140, y + 24, "Product", { size: 14, weight: 500, color: "#cbd5e1", parentId: fid });
      const l2 = text(x + 220, y + 24, "Pricing", { size: 14, weight: 500, color: "#cbd5e1", parentId: fid });
      const l3 = text(x + 300, y + 24, "About", { size: 14, weight: 500, color: "#cbd5e1", parentId: fid });
      const cta = box(x + 600, y + 14, 96, 36, "#6366f1", "CTA", { radius: 999, parentId: fid, role: "button" });
      return [f, logo, l1, l2, l3, cta];
    },
  },
  {
    id: "hero",
    label: "Hero",
    description: "Headline + subhead + button",
    build: (x, y) => {
      const f = frame(x, y, 640, 320, "Hero", "#0b1020", { mode: "flex", direction: "column", gap: 16, padX: 56, padY: 64, align: "start" }, 24);
      const fid = (f as fabric.Object & { _meta?: Meta })._meta!.id;
      const title = text(x + 56, y + 64, "Design without limits.", { size: 44, weight: 800, color: "#ffffff", parentId: fid });
      const sub = text(x + 56, y + 130, "A canvas for ideas — ship beautiful UI in minutes.", { size: 16, weight: 400, color: "#94a3b8", parentId: fid });
      const btn = box(x + 56, y + 200, 160, 48, "#6366f1", "CTA", { radius: 999, parentId: fid, role: "button" });
      const btnText = text(x + 96, y + 214, "Get started", { size: 14, weight: 600, color: "#ffffff", parentId: fid });
      return [f, title, sub, btn, btnText];
    },
  },
  {
    id: "stack",
    label: "Stack",
    description: "Empty auto-layout frame",
    build: (x, y) => [frame(x, y, 320, 200, "Stack", "#ffffff", { mode: "flex", direction: "column", gap: 12, padX: 16, padY: 16 }, 12)],
  },
  {
    id: "row",
    label: "Row",
    description: "Empty horizontal frame",
    build: (x, y) => [frame(x, y, 480, 80, "Row", "#ffffff", { mode: "flex", direction: "row", gap: 12, padX: 16, padY: 16 }, 12)],
  },
];
