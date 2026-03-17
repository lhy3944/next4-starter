"use client";

import { ThreadList } from "@/components/chat/ThreadList";
import { useChatStore } from "@/stores/chat-store";
import { usePanelStore } from "@/stores/panel-store";
import {
  Calendar,
  CircleHelp,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const bottomIcons = [
  { icon: SlidersHorizontal, label: "설정" },
  { icon: Calendar, label: "캘린더" },
  { icon: CircleHelp, label: "도움말" },
];

export function LeftSidebar() {
  const createThread = useChatStore((s) => s.createThread);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);

  if (leftSidebarOpen) {
    return (
      <div className="flex h-full w-[220px] shrink-0 flex-col gap-2 bg-sidebar-bg px-3 py-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={createThread}
            className="flex items-center gap-1.5 text-text-primary"
            variant="ghost"
          >
            <Plus className="h-5 w-5" />
            <span className="text-[13px] font-medium">새 채팅</span>
          </Button>
          <Button
            onClick={toggleLeftSidebar}
            variant="ghost"
            size="icon"
            className="text-icon-default hover:text-icon-active"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>

        <ThreadList />

        <div className="mt-auto flex items-center justify-center gap-4 border-t border-border-primary pt-3">
          {bottomIcons.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon"
              className="text-icon-default hover:text-icon-active"
            >
              <Icon className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-15 h-full flex-col items-center justify-between border-r bg-sidebar-bg py-4">
      <div className="flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={toggleLeftSidebar}
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-icon-default hover:text-icon-active"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">사이드바 열기</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-icon-default hover:text-icon-active"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">새 항목</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col items-center gap-2">
        {bottomIcons.map(({ icon: Icon, label }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-icon-default hover:text-icon-active"
              >
                <Icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
