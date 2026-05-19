import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as fabric from "fabric";
import { Layers, Sparkles } from "lucide-react";
import { PRESETS } from "./presets";
import { exportToReact } from "./exportReact";
import { ExportDialog } from "./ExportDialog";
import {
  getMeta,
  setMeta,
  newId,
  findById,
  descendantsOf,
  childrenOf,
  type Meta,
} from "./types";
import {
  reflowFrame,
  reparentByContainment,
  reparentTo,
  applyClip,
  translateDescendants,
} from "./canvas-utils";
import { useHistory } from "./hooks/useHistory";
import { useClipboard } from "./hooks/useClipboard";
import { useKeyboardShortcuts, type Tool } from "./hooks/useKeyboardShortcuts";
import { useCanvasInteractions } from "./hooks/useCanvasInteractions";
import { usePolygonTool } from "./hooks/usePolygonTool";
import { useViewport } from "./hooks/useViewport";
import { useRulers } from "./hooks/useRulers";
import { Toolbar } from "./Toolbar";
import { ToolsBar } from "./ToolsBar";
import { LayerTree, type LayerNode } from "./LayerTree";
import { PresetsPanel } from "./PresetsPanel";
import { PropertyPanel } from "./PropertyPanel";
import { MeasurementBadge } from "./MeasurementBadge";

export default function FigmaApp() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fcRef = useRef<fabric.Canvas | null>(null);
  const getCanvas = useCallback(() => fcRef.current, []);

  const [tool, setTool] = useState<Tool>("select");
  const toolRef = useRef<Tool>("select");
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  const [objects, setObjects] = useState<fabric.Object[]>([]);
  const [selected, setSelected] = useState<fabric.Object | null>(null);
  const [leftTab, setLeftTab] = useState<"layers" | "presets">("layers");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [zoom, setZoom] = useState(1);
  const [canvasBg, setCanvasBg] = useState("#1a1a1f");
  const [showRulers, setShowRulers] = useState(true);
  const [, force] = useState(0);
  const refresh = useCallback(() => force((n) => n + 1), []);

  const syncLayers = useCallback(() => {
    const c = fcRef.current;
    if (!c) return;
    setObjects([...c.getObjects()]);
  }, []);

  const { save, undo, redo, canUndo, canRedo } = useHistory(getCanvas);
  const clip = useClipboard(getCanvas);

  // Tool side-effects
  useEffect(() => {
    const c = fcRef.current;
    if (!c) return;
    c.isDrawingMode = tool === "pen";
    if (tool === "pen") {
      c.freeDrawingBrush = new fabric.PencilBrush(c);
      c.freeDrawingBrush.color = "#e94560";
      c.freeDrawingBrush.width = 3;
    }
    c.selection = tool === "select";
    c.defaultCursor =
      tool === "hand" ? "grab" : tool === "select" ? "default" : "crosshair";
    c.forEachObject((o) => {
      const isGuide = getMeta(o).kind === "guide";
      o.selectable = isGuide ? tool === "select" : tool === "select";
      o.evented = tool === "select" || tool === "hand";
    });
    c.requestRenderAll();
  }, [tool]);

  const prevPosRef = useRef<Map<string, { left: number; top: number }>>(
    new Map(),
  );

  useEffect(() => {
    if (!canvasElRef.current || !wrapperRef.current) return;
    const wrap = wrapperRef.current;
    // Set canvas element size to match wrapper
    canvasElRef.current.width = wrap.clientWidth;
    canvasElRef.current.height = wrap.clientHeight;
    const c = new fabric.Canvas(canvasElRef.current, {
      width: wrap.clientWidth,
      height: wrap.clientHeight,
      backgroundColor: canvasBg,
      preserveObjectStacking: true,
    });
    fcRef.current = c;

    const f = new fabric.Rect({
      left: 200,
      top: 120,
      width: 900,
      height: 560,
      fill: "#ffffff",
      stroke: "#e5e7eb",
      strokeWidth: 1,
      rx: 12,
      ry: 12,
    });
    setMeta(f, { id: newId(), name: "Page 1", kind: "frame" });
    c.add(f);

    const onAdded = () => {
      syncLayers();
      save();
    };
    const onRemoved = () => {
      syncLayers();
      save();
    };

    const onMoving = (e: { target?: fabric.Object }) => {
      const t = e.target;
      if (!t) return;
      const m = getMeta(t);
      if (m.kind === "frame") {
        const prev = prevPosRef.current.get(m.id);
        const nx = t.left ?? 0,
          ny = t.top ?? 0;
        if (prev) translateDescendants(c, t, nx - prev.left, ny - prev.top);
        prevPosRef.current.set(m.id, { left: nx, top: ny });
        if (m.clip) applyClip(c, t);
      }
    };

    const onModified = (e: { target?: fabric.Object }) => {
      const t = e.target;
      if (!t) return;
      const m = getMeta(t);
      if (m.kind === "guide") return;
      if (m.kind === "frame") {
        if (m.clip) applyClip(c, t);
        reflowFrame(c, t);
        prevPosRef.current.delete(m.id);
      } else {
        reparentByContainment(c, t);
        const pm = getMeta(t);
        if (pm.parentId) {
          const parent = findById(c, pm.parentId);
          if (parent) {
            reflowFrame(c, parent);
            if (getMeta(parent).clip) applyClip(c, parent);
          }
        }
      }
      syncLayers();
      save();
    };

    const onDown = (e: { target?: fabric.Object }) => {
      const t = e.target;
      if (!t) return;
      const m = getMeta(t);
      if (m.kind === "frame")
        prevPosRef.current.set(m.id, { left: t.left ?? 0, top: t.top ?? 0 });
    };

    c.on("object:added", onAdded);
    c.on("object:removed", onRemoved);
    c.on("object:moving", onMoving);
    c.on("object:modified", onModified);
    c.on("mouse:down", onDown);
    c.on("selection:created", (e) => setSelected(e.selected?.[0] ?? null));
    c.on("selection:updated", (e) => setSelected(e.selected?.[0] ?? null));
    c.on("selection:cleared", () => setSelected(null));

    setTimeout(() => {
      save();
      syncLayers();
    }, 0);

    const ro = new ResizeObserver(() => {
      // Update canvas element size
      if (canvasElRef.current) {
        canvasElRef.current.width = wrap.clientWidth;
        canvasElRef.current.height = wrap.clientHeight;
      }
      c.setDimensions({ width: wrap.clientWidth, height: wrap.clientHeight });
      c.requestRenderAll();
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      c.dispose();
      fcRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [save, syncLayers]);

  // canvas bg updates
  useEffect(() => {
    const c = fcRef.current;
    if (!c) return;
    c.backgroundColor = canvasBg;
    c.requestRenderAll();
  }, [canvasBg]);

  useCanvasInteractions({ getCanvas, toolRef, setTool, onZoom: setZoom });
  usePolygonTool({ getCanvas, toolRef, setTool });

  const vp = useViewport(getCanvas);
  const { topRef, leftRef, startGuideX, startGuideY, RULER } = useRulers({
    getCanvas,
    vp,
    enabled: showRulers,
  });

  // Group selected into a new frame (Shift+F)
  const groupIntoFrame = useCallback(() => {
    const c = fcRef.current;
    if (!c) return;
    const act = c.getActiveObjects().filter((o) => getMeta(o).kind !== "guide");
    if (!act.length) return;
    const xs = act.map((o) => o.left ?? 0);
    const ys = act.map((o) => o.top ?? 0);
    const xe = act.map((o) => (o.left ?? 0) + (o.width ?? 0) * (o.scaleX ?? 1));
    const ye = act.map((o) => (o.top ?? 0) + (o.height ?? 0) * (o.scaleY ?? 1));
    const pad = 16;
    const x = Math.min(...xs) - pad,
      y = Math.min(...ys) - pad;
    const w = Math.max(...xe) - x + pad,
      h = Math.max(...ye) - y + pad;
    const frame = new fabric.Rect({
      left: x,
      top: y,
      width: w,
      height: h,
      fill: "rgba(255,255,255,0.04)",
      stroke: "#a78bfa",
      strokeWidth: 1,
      strokeDashArray: [4, 4],
      rx: 8,
      ry: 8,
    });
    setMeta(frame, { id: newId(), name: "Frame", kind: "frame" });
    c.add(frame);
    c.sendObjectToBack(frame);
    const id = getMeta(frame).id;
    act.forEach((o) => setMeta(o, { parentId: id }));
    c.discardActiveObject();
    c.setActiveObject(frame);
    c.requestRenderAll();
    syncLayers();
    save();
  }, [save, syncLayers]);

  useKeyboardShortcuts({
    getCanvas,
    setTool,
    undo,
    redo,
    copy: clip.copy,
    cut: clip.cut,
    paste: clip.paste,
    duplicate: clip.duplicate,
    onChange: () => {
      syncLayers();
      save();
    },
    groupIntoFrame,
  });

  const setZoomTo = (z: number) => {
    const c = fcRef.current;
    if (!c) return;
    const nz = Math.min(Math.max(z, 0.1), 8);
    c.zoomToPoint(new fabric.Point(c.getWidth() / 2, c.getHeight() / 2), nz);
    setZoom(nz);
  };

  const updateSelected = (props: Record<string, unknown>) => {
    const c = fcRef.current;
    if (!c || !selected) return;
    selected.set(props);
    selected.setCoords();
    c.requestRenderAll();
    save();
    refresh();
  };

  const updateLayout = (patch: Partial<NonNullable<Meta["layout"]>>) => {
    const c = fcRef.current;
    if (!c || !selected) return;
    const cur = getMeta(selected);
    const base = cur.layout ?? {
      mode: "free" as const,
      direction: "row" as const,
      gap: 8,
      padX: 12,
      padY: 12,
      align: "start" as const,
    };
    setMeta(selected, { layout: { ...base, ...patch } });
    if ((patch.mode ?? base.mode) === "flex") reflowFrame(c, selected);
    c.requestRenderAll();
    save();
    refresh();
  };

  const updateMeta = (patch: Partial<Meta>) => {
    const c = fcRef.current;
    if (!c || !selected) return;
    setMeta(selected, patch);
    if ("clip" in patch && getMeta(selected).kind === "frame")
      applyClip(c, selected);
    c.requestRenderAll();
    save();
    refresh();
  };

  const addPreset = (presetId: string) => {
    const c = fcRef.current;
    if (!c) return;
    const p = PRESETS.find((x) => x.id === presetId);
    if (!p) return;
    const objs = p.build(280, 200);
    objs.forEach((o) => c.add(o));
    objs.forEach((o) => reparentByContainment(c, o));
    const frame = objs.find((o) => getMeta(o).kind === "frame");
    if (frame) reflowFrame(c, frame);
    c.setActiveObject(objs[0]);
    c.requestRenderAll();
    syncLayers();
    save();
  };

  const onSelectLayer = (l: LayerNode) => {
    const c = fcRef.current;
    if (!c) return;
    c.setActiveObject(l.obj);
    c.requestRenderAll();
  };

  const onRename = (id: string, name: string) => {
    const c = fcRef.current;
    if (!c) return;
    const o = findById(c, id);
    if (!o) return;
    setMeta(o, { name });
    syncLayers();
    save();
  };

  const onReparent = (id: string, newParent: string | undefined) => {
    const c = fcRef.current;
    if (!c) return;
    const o = findById(c, id);
    if (!o) return;
    if (newParent) {
      const desc = new Set([
        id,
        ...descendantsOf(c, id).map((d) => getMeta(d).id),
      ]);
      if (desc.has(newParent)) return;
    }
    reparentTo(c, o, newParent);
    syncLayers();
    save();
    refresh();
  };

  const openExport = () => {
    const c = fcRef.current;
    if (!c) return;
    c.getObjects()
      .filter((o) => getMeta(o).kind === "frame")
      .forEach((f) => reflowFrame(c, f));
    setExportCode(exportToReact(c));
    setExportOpen(true);
  };

  const selectedId = useMemo(
    () => (selected ? getMeta(selected).id : null),
    [selected],
  );
  void childrenOf;

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <Toolbar
        tool={tool}
        setTool={setTool}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        setZoom={setZoomTo}
        onExport={openExport}
        showRulers={showRulers}
        toggleRulers={() => setShowRulers((v) => !v)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ToolsBar tool={tool} setTool={setTool} />

        <main className="relative flex-1 overflow-hidden bg-canvas">
          {showRulers && (
            <>
              {/* corner */}
              <div
                className="absolute left-0 top-0 z-10 bg-panel border-r border-b border-border"
                style={{ width: RULER, height: RULER }}
              />
              {/* top ruler */}
              <div
                className="absolute top-0 z-10 cursor-ns-resize"
                style={{ left: RULER, right: 0, height: RULER }}
                onPointerDown={startGuideY}
                title="Drag down to add a horizontal guide"
              >
                <canvas ref={topRef} />
              </div>
              {/* left ruler */}
              <div
                className="absolute left-0 z-10 cursor-ew-resize"
                style={{ top: RULER, bottom: 0, width: RULER }}
                onPointerDown={startGuideX}
                title="Drag right to add a vertical guide"
              >
                <canvas ref={leftRef} />
              </div>
            </>
          )}
          <div
            ref={wrapperRef}
            className="absolute inset-0"
            style={{
              left: showRulers ? RULER : 0,
              top: showRulers ? RULER : 0,
            }}
          >
            <canvas ref={canvasElRef} />
            <MeasurementBadge getCanvas={getCanvas} vp={vp} enabled />
          </div>
        </main>
      </div>

      <ExportDialog
        open={exportOpen}
        code={exportCode}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
