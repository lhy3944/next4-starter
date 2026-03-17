'use client';

import { useRef } from 'react';
import { usePanelStore } from '@/stores/panel-store';
import { useResponsivePanel } from '@/hooks/useMediaQuery';
import { useResize } from '@/hooks/useResize';
import { IconRail } from '@/components/layout/IconRail';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { RightPanel } from '@/components/layout/RightPanel';
import { ResizeHandle } from '@/components/layout/ResizeHandle';
import { NotificationPanel } from '@/components/layout/NotificationPanel';
import { cn } from '@/lib/utils';

export function ChatLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { onPointerDown, isResizing } = useResize(containerRef);

  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);
  const isMobile = usePanelStore((s) => s.isMobile);

  useResponsivePanel();

  const showIconRail = !fullWidthMode && !isMobile && !leftSidebarOpen;
  const showSidebar = leftSidebarOpen && !isMobile;
  const showRightPanel = rightPanelOpen;

  return (
    <div ref={containerRef} className='flex flex-1 overflow-hidden'>
      {/* IconRail */}
      <div
        className={cn(
          'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
          showIconRail ? 'w-15' : 'w-0',
        )}
        aria-hidden={!showIconRail}
      >
        <IconRail />
      </div>

      {/* LeftSidebar */}
      <div
        className={cn(
          'shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
          showSidebar ? 'w-[220px]' : 'w-0',
        )}
        aria-hidden={!showSidebar}
      >
        <LeftSidebar />
      </div>

      {/* Sidebar divider */}
      <div
        className={cn(
          'h-full w-px shrink-0 bg-border-primary transition-opacity duration-300',
          showSidebar ? 'opacity-100' : 'opacity-0',
        )}
      />

      <ChatArea />

      {/* ResizeHandle */}
      <div
        className={cn(
          'shrink-0 transition-opacity duration-300',
          showRightPanel ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <ResizeHandle onPointerDown={onPointerDown} />
      </div>

      {/* RightPanel */}
      <div
        className={cn(
          'h-full shrink-0 overflow-hidden border-l border-border-primary',
          isResizing
            ? 'transition-none'
            : 'transition-[width] duration-300 ease-in-out',
        )}
        style={{ width: showRightPanel ? `${rightPanelWidth}%` : '0%' }}
        aria-hidden={!showRightPanel}
      >
        <RightPanel />
      </div>

      {/* NotificationPanel — Drawer overlay */}
      <NotificationPanel />
    </div>
  );
}
