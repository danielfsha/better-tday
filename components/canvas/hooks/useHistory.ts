import { useCallback, useRef, useState } from "react";
import type * as fabric from "fabric";

export function useHistory(getCanvas: () => fabric.Canvas | null) {
  const ref = useRef<{ stack: string[]; idx: number; lock: boolean }>({ stack: [], idx: -1, lock: false });
  const [, force] = useState(0);
  const tick = () => force((n) => n + 1);

  const save = useCallback(() => {
    const c = getCanvas(); if (!c) return;
    const h = ref.current; if (h.lock) return;
    const json = JSON.stringify((c as unknown as { toJSON: (extra?: string[]) => unknown }).toJSON(["_meta"]));
    h.stack = h.stack.slice(0, h.idx + 1);
    h.stack.push(json);
    h.idx = h.stack.length - 1;
    tick();
  }, [getCanvas]);

  const load = useCallback(async (json: string) => {
    const c = getCanvas(); if (!c) return;
    const h = ref.current; h.lock = true;
    await c.loadFromJSON(json);
    c.renderAll();
    h.lock = false;
  }, [getCanvas]);

  const undo = useCallback(() => {
    const h = ref.current; if (h.idx <= 0) return;
    h.idx -= 1; load(h.stack[h.idx]); tick();
  }, [load]);

  const redo = useCallback(() => {
    const h = ref.current; if (h.idx >= h.stack.length - 1) return;
    h.idx += 1; load(h.stack[h.idx]); tick();
  }, [load]);

  return {
    save, undo, redo,
    canUndo: ref.current.idx > 0,
    canRedo: ref.current.idx < ref.current.stack.length - 1,
    setLock: (v: boolean) => { ref.current.lock = v; },
  };
}
