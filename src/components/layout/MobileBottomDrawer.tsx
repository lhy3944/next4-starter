"use client";

import { ThreadList } from "@/components/chat/ThreadList";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useChatStore } from "@/stores/chat-store";
import {
  Calendar,
  CircleHelp,
  List,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

const bottomIcons = [
  { icon: SlidersHorizontal, label: "설정" },
  { icon: Calendar, label: "캘린더" },
  { icon: CircleHelp, label: "도움말" },
];

export function MobileBottomDrawer() {
  const createThread = useChatStore((s) => s.createThread);
  const [open, setOpen] = useState(false);

  const handleCreateThread = () => {
    createThread();
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-1 py-1.5">
      <Button
        onClick={createThread}
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-icon-default hover:text-icon-active"
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-icon-default hover:text-icon-active"
        >
          <List className="h-5 w-5" />
        </Button>

        <DrawerContent className="max-h-[85vh] bg-canvas-primary">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-line-primary pb-3">
            <DrawerTitle className="text-base font-semibold text-fg-primary">
              대화 목록
            </DrawerTitle>
            <DrawerDescription />
            <Button
              onClick={handleCreateThread}
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-fg-secondary"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">새 대화</span>
            </Button>
          </DrawerHeader>

          <div className="flex max-h-[60vh] overflow-hidden px-2 py-3">
            <ThreadList />
          </div>

          <div className="flex items-center justify-center gap-6 border-t border-line-primary px-4 py-3">
            {bottomIcons.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-icon-default hover:text-icon-active"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{label}</span>
              </Button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
