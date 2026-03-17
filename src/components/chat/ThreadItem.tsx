"use client";

import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Thread } from "@/stores/chat-store";

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

export function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors",
        isActive
          ? "bg-bg-surface text-text-primary"
          : "text-text-secondary hover:bg-bg-surface/50"
      )}
    >
      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate text-[13px]">{thread.title}</span>
    </button>
  );
}
