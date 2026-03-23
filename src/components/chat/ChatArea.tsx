"use client";

import { useMockChat } from "@/hooks/useMockChat";
import { createFullDemoConversation } from "@/lib/mock-messages";
import { cn } from "@/lib/utils";
import { usePanelStore } from "@/stores/panel-store";
import { useChatStore } from "@/stores/chat-store";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Plus, CornerDownLeft, Loader2 } from "lucide-react";

const DEMO_MESSAGES = createFullDemoConversation();

export function ChatArea() {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const inputValue = useChatStore((s) => s.inputValue);
  const setInputValue = useChatStore((s) => s.setInputValue);

  const { messages, sendMessage, isStreaming } = useMockChat(DEMO_MESSAGES);

  const handleSubmit = () => {
    if (!inputValue.trim() || isStreaming) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <ConversationEmptyState
          title="AISE 3.0"
          description="AI 에이전트와 대화를 시작하세요"
        />
      ) : (
        <Conversation>
          <ConversationContent
            className={cn(
              "mx-auto w-full",
              fullWidthMode ? "max-w-[896px]" : "max-w-[768px]",
            )}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {/* 입력 영역 */}
      <div
        className={cn(
          "mx-auto w-full shrink-0 px-4 pb-4",
          fullWidthMode ? "max-w-[896px]" : "max-w-[768px]",
        )}
      >
        <div className="w-full rounded-xl border border-line-primary bg-canvas-primary p-4">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="w-full resize-none bg-transparent text-sm text-fg-primary placeholder:text-fg-muted outline-none"
            rows={2}
            disabled={isStreaming}
          />
          <div className="flex items-center justify-between">
            <button className="text-fg-muted hover:text-fg-secondary transition-colors">
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={isStreaming || !inputValue.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas-surface text-fg-secondary hover:text-fg-primary transition-colors disabled:opacity-40"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CornerDownLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
