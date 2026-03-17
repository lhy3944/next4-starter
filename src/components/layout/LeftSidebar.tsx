"use client";

import { ThreadList } from "@/components/chat/ThreadList";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../ui/button";

const bottomIcons = [
  { icon: SlidersHorizontal, label: "설정" },
  { icon: Calendar, label: "캘린더" },
  { icon: CircleHelp, label: "도움말" },
];

export function LeftSidebar() {
  const createThread = useChatStore((s) => s.createThread);
  const leftSidebarOpen = usePanelStore((s) => s.leftSidebarOpen);
  const toggleLeftSidebar = usePanelStore((s) => s.toggleLeftSidebar);

  return (
    <AnimatePresence mode="popLayout">
      {leftSidebarOpen ? (
        <motion.div
          key="expanded"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: 220,
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 },
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="h-full shrink-0 overflow-hidden"
        >
          <div className="flex h-full w-[220px] flex-col gap-2 pl-3 py-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={createThread}
                className="flex items-center gap-1.5 text-text-primary"
                variant="ghost"
              >
                <Plus className="h-5 w-5" />
                <span className="text-[13px] font-medium">새 대화</span>
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

            {/* 대화 목록 */}
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
        </motion.div>
      ) : (
        <motion.div
          key="collapsed"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: 60,
            opacity: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 },
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          className="h-full shrink-0 overflow-hidden"
        >
          <div className="flex w-15 h-full flex-col items-center justify-between border-r py-4">
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={toggleLeftSidebar}
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-icon-default hover:text-icon-active"
              >
                <PanelLeftOpen className="h-5 w-5" />
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={createThread}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-icon-default hover:text-icon-active"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">새 대화</TooltipContent>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
