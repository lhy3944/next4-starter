"use client";

import { Plus, CornerDownLeft } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";

export function ChatInput() {
  const inputValue = useChatStore((s) => s.inputValue);
  const setInputValue = useChatStore((s) => s.setInputValue);

  return (
    <div className="w-full rounded-xl border border-line-primary bg-canvas-primary p-4">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message here..."
        className="w-full resize-none bg-transparent text-sm text-fg-primary placeholder:text-fg-muted outline-none"
        rows={2}
      />
      <div className="flex items-center justify-between">
        <button className="text-fg-muted hover:text-fg-secondary transition-colors">
          <Plus className="h-5 w-5" />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas-surface text-fg-secondary hover:text-fg-primary transition-colors">
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
