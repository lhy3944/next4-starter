"use client";

import type { ViewerTab } from "@/stores/viewer-store";
import { CodeViewer } from "./CodeViewer";
import { MarkdownViewer } from "./MarkdownViewer";
import { PdfViewer } from "./PdfViewer";
import { TextViewer } from "./TextViewer";

interface ViewerRendererProps {
  tab: ViewerTab;
}

export function ViewerRenderer({ tab }: ViewerRendererProps) {
  switch (tab.type) {
    case "markdown":
      return <MarkdownViewer content={tab.content} />;
    case "code":
      return (
        <CodeViewer content={tab.content} language={tab.meta?.language} />
      );
    case "text":
      return <TextViewer content={tab.content} />;
    case "pdf":
      return <PdfViewer url={tab.url ?? ""} />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-fg-secondary">
          지원하지 않는 뷰어 타입입니다.
        </div>
      );
  }
}
