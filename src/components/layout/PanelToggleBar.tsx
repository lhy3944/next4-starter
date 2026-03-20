"use client";

import { cn } from "@/lib/utils";
import { LayoutMode, usePanelStore } from "@/stores/panel-store";
import { Columns2, PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const MODES = [
  { mode: LayoutMode.WIDE, icon: PanelRightOpen, label: "최대" },
  { mode: LayoutMode.SPLIT, icon: Columns2, label: "분할" },
  { mode: LayoutMode.CLOSED, icon: PanelRightClose, label: "닫기" },
] as const;

export function PanelToggleBar() {
  const layoutMode = usePanelStore((s) => s.layoutMode);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);

  return (
    <div className="hidden lg:flex items-center">
      {MODES.map(({ mode, icon: Icon, label }) => {
        const isActive = layoutMode === mode;
        return (
          <Tooltip key={mode}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-8 h-8",
                  isActive &&
                    "bg-neutral-700 text-white hover:bg-neutral-600/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
                )}
                onClick={() => setRightPanelPreset(mode)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
