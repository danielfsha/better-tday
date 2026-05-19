import type * as fabric from "fabric";
import {
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  MoveHorizontal, MoveVertical,
} from "lucide-react";
import { getMeta, type Meta } from "./types";

interface Props {
  selected: fabric.Object | null;
  onChange: (p: Record<string, unknown>) => void;
  onLayout: (p: Partial<NonNullable<Meta["layout"]>>) => void;
  onMetaChange: (p: Partial<Meta>) => void;
  canvasBg: string;
  onCanvasBgChange: (v: string) => void;
}

export function PropertyPanel({ selected, onChange, onLayout, onMetaChange, canvasBg, onCanvasBgChange }: Props) {
  if (!selected) {
    return (
      <div className="p-4 space-y-5 text-sm">
        <div className="-mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Canvas</div>
        <Section title="Background">
          <ColorRow value={canvasBg} onChange={onCanvasBgChange} />
        </Section>
        <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Select a layer to edit its properties.
        </div>
      </div>
    );
  }
  const o = selected as fabric.Object & { fontSize?: number; text?: string };
  const meta = getMeta(o);
  const fill = typeof o.fill === "string" ? o.fill : "#ffffff";
  const stroke = typeof o.stroke === "string" ? o.stroke : "#000000";
  const isText = o.type === "i-text" || o.type === "text" || o.type === "textbox";
  const isFrame = meta.kind === "frame";
  const layout = meta.layout;

  return (
    <div className="p-4 space-y-5 text-sm">
      <div className="-mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{meta.kind ?? "layer"}</div>

      <Section title="Position">
        <Row>
          <Field label="X"><NumInput value={Math.round(o.left ?? 0)} onChange={(v) => onChange({ left: v })} /></Field>
          <Field label="Y"><NumInput value={Math.round(o.top ?? 0)} onChange={(v) => onChange({ top: v })} /></Field>
        </Row>
        <Row>
          <Field label="W"><NumInput value={Math.round((o.width ?? 0) * (o.scaleX ?? 1))} onChange={(v) => onChange({ scaleX: v / (o.width ?? 1) })} /></Field>
          <Field label="H"><NumInput value={Math.round((o.height ?? 0) * (o.scaleY ?? 1))} onChange={(v) => onChange({ scaleY: v / (o.height ?? 1) })} /></Field>
        </Row>
        <Row>
          <Field label="Rot"><NumInput value={Math.round(o.angle ?? 0)} onChange={(v) => onChange({ angle: v })} /></Field>
          <Field label="Opa"><NumInput value={Math.round((o.opacity ?? 1) * 100)} onChange={(v) => onChange({ opacity: Math.max(0, Math.min(1, v / 100)) })} /></Field>
        </Row>
      </Section>

      {isFrame && (
        <>
          <Section title="Frame">
            <label className="flex items-center justify-between rounded border border-border bg-input px-2 py-1.5 text-xs cursor-pointer">
              <span>Clip content</span>
              <input
                type="checkbox" checked={!!meta.clip}
                onChange={(e) => onMetaChange({ clip: e.target.checked })}
              />
            </label>
          </Section>

          <Section title="Auto Layout">
            <div className="flex gap-1 rounded-md bg-secondary p-0.5">
              <SegBtn active={!layout || layout.mode === "free"} onClick={() => onLayout({ mode: "free" })}>Free</SegBtn>
              <SegBtn active={!!layout && layout.mode === "flex"} onClick={() => onLayout({ mode: "flex" })}>Flex</SegBtn>
            </div>
            {layout?.mode === "flex" && (
              <>
                <div className="flex gap-1 rounded-md bg-secondary p-0.5">
                  <SegBtn active={layout.direction === "row"} onClick={() => onLayout({ direction: "row" })}>
                    <MoveHorizontal size={12} /> Row
                  </SegBtn>
                  <SegBtn active={layout.direction === "column"} onClick={() => onLayout({ direction: "column" })}>
                    <MoveVertical size={12} /> Col
                  </SegBtn>
                </div>
                <div className="flex gap-1 rounded-md bg-secondary p-0.5">
                  <SegBtn active={(layout.align ?? "start") === "start"} onClick={() => onLayout({ align: "start" })}><AlignStartVertical size={12} /></SegBtn>
                  <SegBtn active={layout.align === "center"} onClick={() => onLayout({ align: "center" })}><AlignCenterVertical size={12} /></SegBtn>
                  <SegBtn active={layout.align === "end"} onClick={() => onLayout({ align: "end" })}><AlignEndVertical size={12} /></SegBtn>
                </div>
                <Row>
                  <Field label="Gap"><NumInput value={layout.gap} onChange={(v) => onLayout({ gap: v })} /></Field>
                  <Field label="Pad X"><NumInput value={layout.padX} onChange={(v) => onLayout({ padX: v })} /></Field>
                </Row>
                <Row>
                  <Field label="Pad Y"><NumInput value={layout.padY} onChange={(v) => onLayout({ padY: v })} /></Field>
                  <div />
                </Row>
              </>
            )}
          </Section>
        </>
      )}

      <Section title="Fill"><ColorRow value={fill} onChange={(v) => onChange({ fill: v })} /></Section>

      <Section title="Stroke">
        <ColorRow value={stroke} onChange={(v) => onChange({ stroke: v })} />
        <Row>
          <Field label="W"><NumInput value={o.strokeWidth ?? 0} onChange={(v) => onChange({ strokeWidth: v })} /></Field>
          {("rx" in o) && <Field label="Rad"><NumInput value={(o as fabric.Rect).rx ?? 0} onChange={(v) => onChange({ rx: v, ry: v })} /></Field>}
        </Row>
      </Section>

      {isText && (
        <Section title="Text">
          <input value={o.text ?? ""} onChange={(e) => onChange({ text: e.target.value })}
            className="w-full rounded border border-border bg-input px-2 py-1.5 text-xs outline-none focus:border-primary" />
          <Row>
            <Field label="Size"><NumInput value={o.fontSize ?? 16} onChange={(v) => onChange({ fontSize: v })} /></Field>
          </Row>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-accent"
      }`}>{children}</button>
  );
}
function Row({ children }: { children: React.ReactNode }) { return <div className="grid grid-cols-2 gap-2">{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 rounded border border-border bg-input px-2 py-1.5">
      <span className="w-7 text-[10px] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function NumInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-transparent text-xs tabular-nums outline-none" />
  );
}
function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const safe = value?.startsWith("#") ? value : "#ffffff";
  return (
    <div className="flex items-center gap-2 rounded border border-border bg-input px-2 py-1.5">
      <input type="color" value={safe} onChange={(e) => onChange(e.target.value)}
        className="h-5 w-5 cursor-pointer rounded border border-border bg-transparent" />
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-xs uppercase outline-none" />
    </div>
  );
}
