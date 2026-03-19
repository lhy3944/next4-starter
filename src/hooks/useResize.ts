"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type LayoutMode, usePanelStore } from "@/stores/panel-store";

const CLOSE_THRESHOLD = 5; // % 미만이면 닫힘
const SNAP_ZONE = 1.5; // 스냅 허용 범위 (±%)
const DEFAULT_WIDTH = 50;
const MIN_CHAT_WIDTH = 550; // 채팅 영역 최소 px
const SIDEBAR_EXPANDED = 220;
const SIDEBAR_COLLAPSED = 60;

// ─── 유틸 ───

/** 현재 사이드바 폭(px) */
function getSidebarPx(leftSidebarOpen: boolean, fullWidthMode: boolean) {
  if (fullWidthMode) return 0;
  return leftSidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;
}

/** 채팅 영역 실제 px 계산 */
function getChatPx(containerWidth: number, sidebarPx: number, rightPanelPct: number) {
  return containerWidth - sidebarPx - (containerWidth * rightPanelPct) / 100;
}

/** 오른쪽 패널 최대 % (채팅 550px 보장) */
function getMaxPct(containerWidth: number, sidebarPx: number) {
  const available = containerWidth - sidebarPx - MIN_CHAT_WIDTH;
  return Math.max(0, (available / containerWidth) * 100);
}

/** "split" = 채팅과 패널이 반반 (사이드바 제외한 공간 기준) */
function getSplitPct(containerWidth: number, sidebarPx: number) {
  const available = containerWidth - sidebarPx;
  return ((available / 2) / containerWidth) * 100;
}

/** 드래그 위치에서 스냅 적용 */
function resolveSnap(
  pct: number,
  maxPct: number,
  splitPct: number,
): { displayPct: number; mode: LayoutMode } {
  if (pct < CLOSE_THRESHOLD) {
    return { displayPct: 0, mode: "closed" };
  }
  const clamped = Math.min(pct, maxPct);
  if (clamped >= maxPct - SNAP_ZONE && maxPct > CLOSE_THRESHOLD) {
    return { displayPct: maxPct, mode: "wide" };
  }
  if (Math.abs(clamped - splitPct) < SNAP_ZONE && splitPct <= maxPct) {
    return { displayPct: splitPct, mode: "split" };
  }
  return { displayPct: clamped, mode: "custom" };
}

/**
 * 최소 채팅 영역 보장
 *
 * @param source
 *   - "resize": 브라우저 리사이즈 → 사이드바 닫기 우선 → 패널 축소
 *   - "store":  사용자 액션(사이드바 열기 등) → 패널 축소 우선 (사이드바 건드리지 않음)
 */
function enforceMinChat(
  containerWidth: number,
  panelEl: HTMLElement,
  source: "resize" | "store",
) {
  const { rightPanelOpen, rightPanelWidth, leftSidebarOpen, fullWidthMode } =
    usePanelStore.getState();
  if (!rightPanelOpen) return;

  let sidebarPx = getSidebarPx(leftSidebarOpen, fullWidthMode);
  const chatPx = getChatPx(containerWidth, sidebarPx, rightPanelWidth);

  if (chatPx >= MIN_CHAT_WIDTH) return; // OK

  if (source === "resize" && leftSidebarOpen) {
    // 브라우저 리사이즈: 사이드바 닫기로 먼저 공간 확보
    const collapsedSidebarPx = getSidebarPx(false, fullWidthMode);
    const chatAfter = getChatPx(containerWidth, collapsedSidebarPx, rightPanelWidth);
    if (chatAfter >= MIN_CHAT_WIDTH) {
      usePanelStore.setState({ leftSidebarOpen: false });
      return;
    }
    usePanelStore.setState({ leftSidebarOpen: false });
    sidebarPx = collapsedSidebarPx;
  }

  // 오른쪽 패널 축소
  const maxPct = getMaxPct(containerWidth, sidebarPx);
  if (maxPct >= CLOSE_THRESHOLD) {
    const splitPct = getSplitPct(containerWidth, sidebarPx);
    const { mode } = resolveSnap(maxPct, maxPct, splitPct);
    usePanelStore.setState({ rightPanelWidth: maxPct, layoutMode: mode });
    panelEl.style.width = `${maxPct}%`;
    return;
  }

  // 패널 닫기
  usePanelStore.setState({ rightPanelOpen: false, layoutMode: "closed" });
  panelEl.style.width = "0%";
}

// ─── 훅 ───

export function useResize(
  containerRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
) {
  const [isResizing, setIsResizing] = useState(false);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const prevSnapMode = useRef<LayoutMode>("custom");

  // stale closure 방지
  const storeRef = useRef(usePanelStore.getState());
  useEffect(() => {
    return usePanelStore.subscribe((s) => {
      storeRef.current = s;
    });
  }, []);

  // 브라우저 리사이즈 시 최소 채팅 영역 보장
  useEffect(() => {
    const onWindowResize = () => {
      if (isDragging.current || !containerRef.current || !panelRef.current) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      enforceMinChat(containerWidth, panelRef.current, "resize");
    };
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, [containerRef, panelRef]);

  // 토글 프리셋 변경 시에도 제약 적용
  useEffect(() => {
    if (isDragging.current || !containerRef.current || !panelRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    enforceMinChat(containerWidth, panelRef.current, "store");
  });

  // onDragEnd self-reference 방지
  const onDragEndRef = useRef<EventListener>(() => {});

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !panelRef.current || !containerRef.current) return;
      const clientX =
        e instanceof MouseEvent ? e.clientX : (e.touches[0]?.clientX ?? 0);

      if (!dragMoved.current) {
        if (Math.abs(clientX - dragStartX.current) < 3) return;
        dragMoved.current = true;
        panelRef.current.style.transition = "none";
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const rawPct =
        ((containerRect.right - clientX) / containerRect.width) * 100;

      const { leftSidebarOpen, fullWidthMode } = storeRef.current;
      const sidebarPx = getSidebarPx(leftSidebarOpen, fullWidthMode);
      const maxPct = getMaxPct(containerRect.width, sidebarPx);
      const splitPct = getSplitPct(containerRect.width, sidebarPx);
      const { displayPct, mode } = resolveSnap(rawPct, maxPct, splitPct);

      // 스냅존 진입/이탈 전환
      const prevMode = prevSnapMode.current;
      if (prevMode === "custom" && mode !== "custom") {
        panelRef.current.style.transition = "width 120ms ease-out";
      } else if (prevMode !== "custom" && mode === "custom") {
        panelRef.current.style.transition = "none";
      }
      prevSnapMode.current = mode;

      panelRef.current.style.width = displayPct === 0 ? "0%" : `${displayPct}%`;

      if (storeRef.current.layoutMode !== mode) {
        usePanelStore.setState({ layoutMode: mode });
      }
    },
    [containerRef, panelRef],
  );

  const onDragEnd = useCallback(() => {
    if (panelRef.current) {
      panelRef.current.style.transition = "";

      if (!dragMoved.current) {
        // 클릭 → 토글
        const { rightPanelOpen, rightPanelWidth, leftSidebarOpen, fullWidthMode } =
          storeRef.current;
        if (!rightPanelOpen) {
          const cw =
            containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
          const sidebarPx = getSidebarPx(leftSidebarOpen, fullWidthMode);
          const maxPct = getMaxPct(cw, sidebarPx);
          const splitPct = getSplitPct(cw, sidebarPx);
          const pct = Math.min(
            rightPanelWidth > CLOSE_THRESHOLD ? rightPanelWidth : DEFAULT_WIDTH,
            maxPct,
          );
          const { mode } = resolveSnap(pct, maxPct, splitPct);
          usePanelStore.setState({
            rightPanelOpen: true,
            rightPanelWidth: pct,
            layoutMode: mode,
          });
        } else {
          usePanelStore.setState({ rightPanelOpen: false, layoutMode: "closed" });
        }
      } else {
        // 드래그 완료 → store commit
        const finalPct = parseFloat(panelRef.current.style.width);
        const { leftSidebarOpen: lso, fullWidthMode: fwm } = storeRef.current;
        const cw =
          containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
        const sidebarPx = getSidebarPx(lso, fwm);
        const maxPct = getMaxPct(cw, sidebarPx);
        const splitPct = getSplitPct(cw, sidebarPx);

        if (isNaN(finalPct) || finalPct < CLOSE_THRESHOLD) {
          usePanelStore.setState({ rightPanelOpen: false, layoutMode: "closed" });
        } else {
          const { displayPct, mode } = resolveSnap(finalPct, maxPct, splitPct);
          usePanelStore.setState({
            rightPanelOpen: true,
            rightPanelWidth: displayPct,
            layoutMode: mode,
          });
        }
      }
    }

    isDragging.current = false;
    dragMoved.current = false;
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", onDragEndRef.current);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", onDragEndRef.current);
  }, [onDrag, panelRef, containerRef]);

  useEffect(() => {
    onDragEndRef.current = onDragEnd as EventListener;
  }, [onDragEnd]);

  const onPointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      isDragging.current = true;
      dragMoved.current = false;
      prevSnapMode.current = "custom";
      dragStartX.current =
        "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      setIsResizing(true);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", onDrag);
      window.addEventListener("touchend", onDragEnd);
    },
    [onDrag, onDragEnd],
  );

  return { onPointerDown, isResizing };
}
