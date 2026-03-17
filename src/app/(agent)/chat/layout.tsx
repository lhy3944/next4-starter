"use client";

import { useRef } from "react";
import { usePanelStore } from "@/stores/panel-store";
import { useResponsivePanel } from "@/hooks/useMediaQuery";
import { useResize } from "@/hooks/useResize";
import { Header } from "@/components/layout/Header";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightPanel } from "@/components/layout/RightPanel";
import { ResizeHandle } from "@/components/layout/ResizeHandle";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onPointerDown, isResizing } = useResize(containerRef);

  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);
  const isMobile = usePanelStore((s) => s.isMobile);

  useResponsivePanel();

  const showLeftPanel = !fullWidthMode && !isMobile;
  const showSidebar = leftSidebarOpen && !isMobile;
  const showRightPanel = rightPanelOpen;

  return (
    <div className="flex h-screen flex-col">
      <Header showLayoutToggle />

      <div ref={containerRef} className="flex flex-1 overflow-hidden">
        {/* LeftSidebar */}
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
            !showLeftPanel ? "w-0" : showSidebar ? "w-[220px]" : "w-15",
          )}
          aria-hidden={!showLeftPanel}
        >
          <LeftSidebar />
        </div>

        {/* Sidebar divider */}
        <div
          className={cn(
            "h-full w-px shrink-0 bg-line-primary transition-opacity duration-300",
            showSidebar ? "opacity-100" : "opacity-0",
          )}
        />

        {children}

        {/* ResizeHandle */}
        <div
          className={cn(
            "shrink-0 transition-opacity duration-300",
            showRightPanel ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <ResizeHandle onPointerDown={onPointerDown} />
        </div>

        {/* RightPanel */}
        <div
          className={cn(
            "h-full shrink-0 overflow-hidden border-l border-line-primary",
            isResizing
              ? "transition-none"
              : "transition-[width] duration-300 ease-in-out",
          )}
          style={{ width: showRightPanel ? `${rightPanelWidth}%` : "0%" }}
          aria-hidden={!showRightPanel}
        >
          <RightPanel />
        </div>

        {/* NotificationPanel — Drawer overlay */}
        <NotificationPanel />
      </div>
    </div>
  );
}
