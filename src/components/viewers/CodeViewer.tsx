"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeViewerProps {
  content: string;
  language?: string;
}

export function CodeViewer({ content, language = "typescript" }: CodeViewerProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    codeToHtml(content, {
      lang: language,
      themes: { light: "github-light", dark: "github-dark" },
    }).then(setHtml);
  }, [content, language]);

  if (!html) {
    return (
      <div className="flex h-full items-center justify-center text-fg-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:text-[13px] [&_code]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
