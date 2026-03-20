"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";

export function ChatArea() {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-2">
      <div
        className={cn(
          "mx-auto w-full transition-[max-width] duration-300 ease-in-out",
          fullWidthMode ? "max-w-[896px]" : "max-w-[768px]",
        )}
      >
        <div className="flex justify-center py-4">
          <h1 className="text-4xl font-bold text-fg-primary">AISE 3.0</h1>
        </div>
        <ChatInput />
      </div>
    </div>
  );
}
