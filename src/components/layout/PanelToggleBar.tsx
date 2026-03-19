"use client";

import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { Columns2, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "../ui/button";

export function PanelToggleBar() {
  const layoutMode = usePanelStore((s) => s.layoutMode);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);

  const isWide = layoutMode === "wide";
  const isSplit = layoutMode === "split";
  const isClosed = layoutMode === "closed";

  return (
    <div className="hidden lg:flex items-center">
      <Button
        variant={"ghost"}
        onClick={() => setRightPanelPreset("wide")}
        className={cn(
          "w-8 h-8",
          isWide
            ? "text-icon-active"
            : "text-fg-secondary hover:text-icon-active",
        )}
      >
        <PanelRightOpen className="h-4 w-4" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setRightPanelPreset("split")}
        className={cn(
          "w-8 h-8",
          isSplit
            ? "text-icon-active"
            : "text-fg-secondary hover:text-icon-active",
        )}
      >
        <Columns2 className="h-4 w-4" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => setRightPanelPreset("closed")}
        className={cn(
          "w-8 h-8",
          isClosed
            ? "text-icon-active"
            : "text-fg-secondary hover:text-icon-active",
        )}
      >
        <PanelRightClose className="h-4 w-4" />
      </Button>
    </div>
  );
}
