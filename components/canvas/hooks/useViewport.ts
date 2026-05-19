import { useEffect, useState } from "react";
import type * as fabric from "fabric";

export interface ViewportState { zoom: number; tx: number; ty: number; w: number; h: number; }

/** Subscribes to canvas viewport changes and returns a state object. */
export function useViewport(getCanvas: () => fabric.Canvas | null): ViewportState {
  const [vp, setVp] = useState<ViewportState>({ zoom: 1, tx: 0, ty: 0, w: 0, h: 0 });

  useEffect(() => {
    const c = getCanvas(); if (!c) return;
    const sync = () => {
      const t = c.viewportTransform!;
      setVp({ zoom: c.getZoom(), tx: t[4], ty: t[5], w: c.getWidth(), h: c.getHeight() });
    };
    sync();
    c.on("after:render", sync);
    return () => { c.off("after:render", sync); };
  }, [getCanvas]);

  return vp;
}
