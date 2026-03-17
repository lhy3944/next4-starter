"use client";

import { PanelRightOpen, Columns2, PanelRightClose } from "lucide-react";
import { usePanelStore } from "@/stores/panel-store";
import { cn } from "@/lib/utils";

export function PanelToggleBar() {
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const rightPanelWidth = usePanelStore((s) => s.rightPanelWidth);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);

  const isWide = rightPanelOpen && rightPanelWidth >= 60;
  const isSplit = rightPanelOpen && rightPanelWidth >= 40 && rightPanelWidth < 60;
  const isClosed = !rightPanelOpen;

  return (
    <div className="flex items-center gap-1 rounded-lg bg-bg-surface p-1">
      <button
        onClick={() => setRightPanelPreset("wide")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          isWide ? "bg-border-primary text-icon-active" : "text-text-secondary hover:text-icon-active"
        )}
      >
        <PanelRightOpen className="h-4 w-4" />
      </button>
      <button
        onClick={() => setRightPanelPreset("split")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          isSplit ? "bg-border-primary text-icon-active" : "text-text-secondary hover:text-icon-active"
        )}
      >
        <Columns2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => setRightPanelPreset("closed")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          isClosed ? "bg-border-primary text-icon-active" : "text-text-secondary hover:text-icon-active"
        )}
      >
        <PanelRightClose className="h-4 w-4" />
      </button>
    </div>
  );
}
