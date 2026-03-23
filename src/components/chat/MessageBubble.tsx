"use client";

import type { UIMessage } from "@/types/chat";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Tool, ToolHeader, ToolContent, ToolOutput } from "@/components/ai-elements/tool";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
  Source,
} from "@/components/ai-elements/sources";
import { useViewerStore } from "@/stores/viewer-store";
import { LayoutMode, usePanelStore } from "@/stores/panel-store";
import { ExternalLinkIcon, CopyIcon } from "lucide-react";
import { useCallback } from "react";

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const sourceParts = message.parts.filter((p) => p.type === "source-url");
  const openTab = useViewerStore((s) => s.openTab);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);

  const openInViewer = useCallback(
    (title: string, content: string, type: "markdown" | "code" | "text", meta?: Record<string, string>) => {
      openTab({ type, title, content, meta });
      if (!rightPanelOpen) {
        setRightPanelPreset(LayoutMode.SPLIT);
      }
    },
    [openTab, rightPanelOpen, setRightPanelPreset],
  );

  const isAssistant = message.role === "assistant";

  return (
    <Message from={message.role}>
      <MessageContent>
        {message.parts.map((part, i) => {
          const key = `${message.id}-part-${i}`;

          switch (part.type) {
            case "text":
              return (
                <div key={key}>
                  <MessageResponse>{part.text}</MessageResponse>
                  {isAssistant && (
                    <MessageActions className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <MessageAction
                        tooltip="뷰어에서 열기"
                        onClick={() =>
                          openInViewer(
                            `메시지 #${message.id.slice(-3)}`,
                            part.text,
                            "markdown",
                          )
                        }
                      >
                        <ExternalLinkIcon className="size-3.5" />
                      </MessageAction>
                      <MessageAction
                        tooltip="복사"
                        onClick={() => navigator.clipboard.writeText(part.text)}
                      >
                        <CopyIcon className="size-3.5" />
                      </MessageAction>
                    </MessageActions>
                  )}
                </div>
              );

            case "reasoning":
              return (
                <Reasoning key={key}>
                  <ReasoningTrigger />
                  <ReasoningContent>{part.text}</ReasoningContent>
                </Reasoning>
              );

            case "dynamic-tool":
              return (
                <Tool key={key} defaultOpen>
                  <ToolHeader
                    type="dynamic-tool"
                    toolName={part.toolName}
                    state={part.state}
                  />
                  {"output" in part && (
                    <ToolContent>
                      <ToolOutput
                        output={part.output}
                        errorText={"errorText" in part ? (part.errorText as string) : undefined}
                      />
                    </ToolContent>
                  )}
                  {"output" in part && part.output != null && (
                    <div className="border-t border-border px-3 py-2">
                      <button
                        onClick={() =>
                          openInViewer(
                            part.toolName,
                            JSON.stringify(part.output, null, 2),
                            "code",
                            { language: "json" },
                          )
                        }
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLinkIcon className="size-3" />
                        뷰어에서 열기
                      </button>
                    </div>
                  )}
                </Tool>
              );

            case "source-url":
              return null;

            default:
              return null;
          }
        })}

        {sourceParts.length > 0 && (
          <Sources>
            <SourcesTrigger count={sourceParts.length} />
            <SourcesContent>
              {sourceParts.map((part, i) =>
                part.type === "source-url" ? (
                  <Source
                    key={`${message.id}-src-${i}`}
                    href={part.url}
                    title={part.title}
                  />
                ) : null,
              )}
            </SourcesContent>
          </Sources>
        )}
      </MessageContent>
    </Message>
  );
}
