"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { MobileRightDrawer } from "@/components/layout/MobileRightDrawer";
import { PanelToggleBar } from "@/components/layout/PanelToggleBar";

export function ChatArea() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-4 py-2">
      <div className="absolute top-0 right-2 flex items-center gap-1">
        <PanelToggleBar />
        <MobileRightDrawer />
      </div>
      {/* <h1 className="text-4xl font-bold text-fg-primary">AISE 3.0</h1> */}
      <ChatInput />
    </div>
  );
}
