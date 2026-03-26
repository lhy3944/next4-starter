"use client";

import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ui/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";
import { MicIcon, PaperclipIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function AttachButton() {
  const attachments = usePromptInputAttachments();
  return (
    <PromptInputButton tooltip="파일 첨부" onClick={attachments.openFileDialog}>
      <PaperclipIcon size={16} />
    </PromptInputButton>
  );
}

function VoiceButton() {
  const setInputValue = useChatStore((s) => s.setInputValue);
  const inputValue = useChatStore((s) => s.inputValue);
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const inputValueRef = useRef(inputValue);
  const interimLengthRef = useRef(0);

  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const handleClick = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognitionAPI =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionAPI();
    recognition.lang = "ko-KR";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      const base = inputValueRef.current.slice(
        0,
        inputValueRef.current.length - interimLengthRef.current,
      );
      setInputValue(base + (final || interim));
      interimLengthRef.current = final ? 0 : interim.length;
    };

    recognition.onend = () => {
      setIsListening(false);
      interimLengthRef.current = 0;
    };

    recognition.onerror = () => {
      setIsListening(false);
      interimLengthRef.current = 0;
    };

    recognition.start();
  }, [isListening, setInputValue]);

  return (
    <PromptInputButton
      tooltip={{ content: "마이크", shortcut: "⌘M", side: "bottom" }}
      onClick={handleClick}
      className={cn(isListening && "bg-canvas-surface text-accent-primary hover:bg-canvas-surface")}
    >
      <MicIcon size={16} className={cn(isListening && "animate-pulse")} />
    </PromptInputButton>
  );
}

export function ChatInput() {
  const inputValue = useChatStore((s) => s.inputValue);
  const setInputValue = useChatStore((s) => s.setInputValue);

  const handleSubmit = () => {
    // Handle submit
  };

  return (
    <PromptInput onSubmit={handleSubmit}>
      <PromptInputBody>
        <PromptInputTextarea
          autoFocus
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <AttachButton />
          <VoiceButton />
        </PromptInputTools>
        {/* 프롬프트가 비어있으면 기본 비활성화 */}
        <PromptInputSubmit disabled={inputValue?.trim().length === 0} />
      </PromptInputFooter>
    </PromptInput>
  );
}
