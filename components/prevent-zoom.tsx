"use client";

import { useEffect } from "react";

export default function PreventZoom() {
  useEffect(() => {
    const handleGestureStart = (event: Event) => {
      event.preventDefault();
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("gesturestart", handleGestureStart);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", handleGestureStart);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
