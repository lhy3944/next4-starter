"use client";

import { PanelToggleBar } from "@/components/layout/PanelToggleBar";
import { ChatInput } from "@/components/chat/ChatInput";

export function ChatArea() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <PanelToggleBar />
      <h1 className="text-4xl font-bold text-fg-primary">AISE 3.0</h1>
      <ChatInput />
    </div>
  );
}
