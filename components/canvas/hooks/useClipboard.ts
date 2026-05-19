import { useCallback, useRef } from "react";
import * as fabric from "fabric";
import { getMeta, setMeta, newId } from "../types";

export function useClipboard(getCanvas: () => fabric.Canvas | null) {
  const buf = useRef<fabric.Object[] | null>(null);

  const copy = useCallback(async () => {
    const c = getCanvas(); if (!c) return;
    const act = c.getActiveObjects(); if (!act.length) return;
    buf.current = await Promise.all(act.map((o) => o.clone(["_meta"])));
  }, [getCanvas]);

  const cut = useCallback(async () => {
    const c = getCanvas(); if (!c) return;
    await copy();
    c.getActiveObjects().forEach((o) => c.remove(o));
    c.discardActiveObject();
    c.requestRenderAll();
  }, [copy, getCanvas]);

  const paste = useCallback(async () => {
    const c = getCanvas(); if (!c) return;
    if (!buf.current?.length) return;
    const clones = await Promise.all(buf.current.map((o) => o.clone(["_meta"])));
    c.discardActiveObject();
    const added: fabric.Object[] = [];
    for (const cl of clones) {
      cl.set({ left: (cl.left ?? 0) + 16, top: (cl.top ?? 0) + 16 });
      const m = getMeta(cl);
      setMeta(cl, { id: newId(), name: m.name + " copy", parentId: undefined });
      c.add(cl);
      added.push(cl);
    }
    if (added.length === 1) c.setActiveObject(added[0]);
    else c.setActiveObject(new fabric.ActiveSelection(added, { canvas: c }));
    c.requestRenderAll();
  }, [getCanvas]);

  const duplicate = useCallback(async () => { await copy(); await paste(); }, [copy, paste]);

  return { copy, cut, paste, duplicate };
}
