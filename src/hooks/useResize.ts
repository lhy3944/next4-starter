"use client";

import { useCallback, useRef, useState } from "react";
import { usePanelStore } from "@/stores/panel-store";

export function useResize(containerRef: React.RefObject<HTMLElement | null>) {
  const startX = useRef(0);
  const startWidth = useRef(0);
  const [isResizing, setIsResizing] = useState(false);

  const setRightPanelWidth = usePanelStore((s) => s.setRightPanelWidth);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      startX.current = e.clientX;
      startWidth.current = usePanelStore.getState().rightPanelWidth;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsResizing(true);

      const onPointerMove = (ev: PointerEvent) => {
        const containerWidth = container.offsetWidth;
        const deltaX = startX.current - ev.clientX;
        const deltaPct = (deltaX / containerWidth) * 100;
        const newWidth = startWidth.current + deltaPct;
        setRightPanelWidth(newWidth);
      };

      const onPointerUp = () => {
        setIsResizing(false);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    },
    [containerRef, setRightPanelWidth]
  );

  return { onPointerDown, isResizing };
}
