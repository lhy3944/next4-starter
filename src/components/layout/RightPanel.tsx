"use client";

import { ViewerRenderer } from "@/components/viewers/ViewerRenderer";
import { cn } from "@/lib/utils";
import { useViewerStore } from "@/stores/viewer-store";
import { X } from "lucide-react";

export function RightPanel() {
  const tabs = useViewerStore((s) => s.tabs);
  const activeTabId = useViewerStore((s) => s.activeTabId);
  const setActiveTab = useViewerStore((s) => s.setActiveTab);
  const closeTab = useViewerStore((s) => s.closeTab);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (tabs.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-canvas-primary text-fg-muted">
        <p className="text-sm">열린 문서가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-canvas-primary">
      {/* 탭 바 */}
      <div className="flex shrink-0 items-center gap-0 overflow-x-auto border-b border-line-primary">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "group flex items-center gap-1.5 border-r border-line-primary px-3 py-2 text-xs transition-colors",
              tab.id === activeTabId
                ? "bg-canvas-primary text-fg-primary"
                : "bg-surface-secondary text-fg-secondary hover:text-fg-primary",
            )}
          >
            <span className="max-w-[120px] truncate">{tab.title}</span>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="rounded p-0.5 opacity-0 transition-opacity hover:bg-surface-hover group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>

      {/* 뷰어 영역 */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          <ViewerRenderer tab={activeTab} />
        ) : (
          <div className="flex h-full items-center justify-center text-fg-muted text-sm">
            탭을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}
