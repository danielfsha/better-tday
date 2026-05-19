import type * as fabric from "fabric";
import { getMeta, type MObj } from "./types";

const rgbToHex = (v: unknown): string => {
  if (typeof v !== "string") return "transparent";
  return v;
};

const indent = (n: number) => "  ".repeat(n);

function renderObj(o: fabric.Object, depth: number, childrenByParent: Map<string, fabric.Object[]>): string {
  const meta = getMeta(o);
  const w = Math.round((o.width ?? 0) * (o.scaleX ?? 1));
  const h = Math.round((o.height ?? 0) * (o.scaleY ?? 1));
  const radius = meta.style?.radius ?? (o as fabric.Object & { rx?: number }).rx ?? 0;
  const fill = rgbToHex(o.fill);
  const stroke = rgbToHex(o.stroke);
  const sw = (o.strokeWidth ?? 0);
  const op = o.opacity ?? 1;

  // Text
  if (o.type === "i-text" || o.type === "text" || o.type === "textbox") {
    const t = o as fabric.IText;
    const cls = [
      `text-[${Math.round(t.fontSize ?? 16)}px]`,
      meta.style?.fontWeight ? `font-[${meta.style.fontWeight}]` : "",
    ].filter(Boolean).join(" ");
    return `${indent(depth)}<span className="${cls}" style={{ color: "${fill}" }}>${escapeJsx(t.text ?? "")}</span>`;
  }

  // Frame or shape — div
  const isFrame = meta.kind === "frame";
  const kids = childrenByParent.get(meta.id) ?? [];
  const layout = meta.layout;

  const styleParts: string[] = [];
  if (fill && fill !== "transparent") styleParts.push(`background: "${fill}"`);
  if (stroke && sw > 0) styleParts.push(`border: "${sw}px solid ${stroke}"`);
  if (radius) styleParts.push(`borderRadius: ${radius}`);
  if (op < 1) styleParts.push(`opacity: ${op}`);
  if (!isFrame || !layout || layout.mode === "free") {
    styleParts.push(`width: ${w}`, `height: ${h}`);
  }

  let cls = "";
  if (layout && layout.mode === "flex") {
    cls = [
      "flex",
      layout.direction === "row" ? "flex-row" : "flex-col",
      `gap-[${layout.gap}px]`,
      `px-[${layout.padX}px]`,
      `py-[${layout.padY}px]`,
      layout.align === "center" ? "items-center" : layout.align === "end" ? "items-end" : "items-start",
    ].join(" ");
  }

  if (meta.style?.role === "button") cls += " inline-flex items-center justify-center cursor-pointer";

  const openTag = `<div${cls ? ` className="${cls.trim()}"` : ""}${styleParts.length ? ` style={{ ${styleParts.join(", ")} }}` : ""}>`;
  if (kids.length === 0) return `${indent(depth)}${openTag}</div>`;
  const body = kids.map((k) => renderObj(k, depth + 1, childrenByParent)).join("\n");
  return `${indent(depth)}${openTag}\n${body}\n${indent(depth)}</div>`;
}

function renderFree(o: fabric.Object, depth: number, childrenByParent: Map<string, fabric.Object[]>): string {
  // Absolute-positioned wrapper for top-level objects (free layout on the page)
  const x = Math.round(o.left ?? 0);
  const y = Math.round(o.top ?? 0);
  const inner = renderObj(o, depth + 1, childrenByParent);
  return `${indent(depth)}<div className="absolute" style={{ left: ${x}, top: ${y} }}>\n${inner}\n${indent(depth)}</div>`;
}

function escapeJsx(s: string) {
  return s.replace(/[{}<>]/g, (c) => ({ "{": "&#123;", "}": "&#125;", "<": "&lt;", ">": "&gt;" } as Record<string, string>)[c]);
}

export function exportToReact(canvas: fabric.Canvas): string {
  const all = canvas.getObjects();
  const byParent = new Map<string, fabric.Object[]>();
  const topLevel: fabric.Object[] = [];
  // Build parent map; auto-detect missing parent links by bbox containment.
  const frames = all.filter((o) => getMeta(o).kind === "frame");
  for (const o of all) {
    const m = getMeta(o);
    if (m.kind === "frame") continue;
    let parent = m.parentId;
    if (!parent) {
      // attach to first frame whose bbox contains the object's center
      const cx = (o.left ?? 0) + ((o.width ?? 0) * (o.scaleX ?? 1)) / 2;
      const cy = (o.top ?? 0) + ((o.height ?? 0) * (o.scaleY ?? 1)) / 2;
      const host = frames.find((f) => {
        const fx = f.left ?? 0, fy = f.top ?? 0;
        const fw = (f.width ?? 0) * (f.scaleX ?? 1);
        const fh = (f.height ?? 0) * (f.scaleY ?? 1);
        return cx >= fx && cx <= fx + fw && cy >= fy && cy <= fy + fh;
      });
      if (host) parent = getMeta(host).id;
    }
    if (parent) {
      const arr = byParent.get(parent) ?? [];
      arr.push(o); byParent.set(parent, arr);
    } else {
      topLevel.push(o);
    }
  }
  for (const f of frames) {
    if (!(f as MObj)._meta!.parentId) topLevel.push(f);
  }

  const body = topLevel.map((o) => renderFree(o, 2, byParent)).join("\n");
  return `// Auto-generated from canvas. Tailwind CSS required.
export default function ExportedDesign() {
  return (
    <div className="relative" style={{ minHeight: "100vh" }}>
${body}
    </div>
  );
}
`;
}
