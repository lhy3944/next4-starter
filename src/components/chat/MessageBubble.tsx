"use client";

import type { UIMessage } from "@/types/chat";
import {
  Message,
  MessageContent,
  MessageResponse,
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

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const sourceParts = message.parts.filter((p) => p.type === "source-url");

  return (
    <Message from={message.role}>
      <MessageContent>
        {message.parts.map((part, i) => {
          const key = `${message.id}-part-${i}`;

          switch (part.type) {
            case "text":
              return <MessageResponse key={key}>{part.text}</MessageResponse>;

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
                </Tool>
              );

            case "source-url":
              // source-url은 아래 Sources 블록에서 묶어서 렌더링
              return null;

            default:
              return null;
          }
        })}

        {/* 소스 묶음 렌더링 */}
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
