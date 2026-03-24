"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useChatStore } from "@/stores/chat-store";
import { GlobeIcon, MicIcon, PaperclipIcon } from "lucide-react";
export function ChatInput() {
  const inputValue = useChatStore((s) => s.inputValue);
  const setInputValue = useChatStore((s) => s.setInputValue);

  const handleSubmit = () => {
    // Handle submit
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea autoFocus />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputButton tooltip="Attach files">
            <PaperclipIcon size={16} />
          </PromptInputButton>
          <PromptInputButton
            tooltip={{ content: "Search the web", shortcut: "⌘K" }}
          >
            <GlobeIcon size={16} />
          </PromptInputButton>
          <PromptInputButton
            tooltip={{ content: "Voice input", shortcut: "⌘M", side: "bottom" }}
          >
            <MicIcon size={16} />
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  );
}
