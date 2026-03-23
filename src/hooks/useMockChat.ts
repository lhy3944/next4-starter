"use client";

import { createMockResponse } from "@/lib/mock-messages";
import type { UIMessage } from "@/types/chat";
import { useCallback, useRef, useState } from "react";

export interface UseMockChatReturn {
  messages: UIMessage[];
  setMessages: (msgs: UIMessage[]) => void;
  sendMessage: (text: string) => void;
  isStreaming: boolean;
  status: "ready" | "streaming" | "error";
}

/**
 * useChat 없이 mock 스트리밍을 시뮬레이션하는 훅.
 * 나중에 실제 백엔드 연결 시 이 인터페이스만 교체하면 됩니다.
 */
export function useMockChat(
  initialMessages: UIMessage[] = [],
): UseMockChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // 사용자 메시지 추가
    const userMsg: UIMessage = {
      id: `msg-user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text }],
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // mock 응답 딜레이 (스트리밍 시뮬레이션)
    timerRef.current = setTimeout(() => {
      const response = createMockResponse(text);
      setMessages((prev) => [...prev, response]);
      setIsStreaming(false);
    }, 800);
  }, []);

  return {
    messages,
    setMessages,
    sendMessage,
    isStreaming,
    status: isStreaming ? "streaming" : "ready",
  };
}
