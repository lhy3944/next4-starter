"use client";

import { useChatStore } from "@/stores/chat-store";
import { ThreadItem } from "@/components/chat/ThreadItem";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ThreadList() {
  const threads = useChatStore((s) => s.threads);
  const activeThreadId = useChatStore((s) => s.activeThreadId);
  const setActiveThread = useChatStore((s) => s.setActiveThread);

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-0.5">
        {threads.map((thread) => (
          <ThreadItem
            key={thread.id}
            thread={thread}
            isActive={thread.id === activeThreadId}
            onClick={() => setActiveThread(thread.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
