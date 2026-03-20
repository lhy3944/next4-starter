"use client";

import { useEffect, useRef } from "react";

interface TextViewerProps {
  content: string;
  showLineNumbers?: boolean;
}

export function TextViewer({
  content,
  showLineNumbers = true,
}: TextViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = content.split("\n");

  // 콘텐츠 변경 시 맨 아래로 스크롤 (로그 뷰어 용도)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div ref={containerRef} className="h-full overflow-auto p-4 font-mono text-sm">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="hover:bg-surface-hover/50">
              {showLineNumbers && (
                <td className="select-none pr-4 text-right align-top text-fg-muted w-[1%] whitespace-nowrap">
                  {i + 1}
                </td>
              )}
              <td className="whitespace-pre-wrap break-all text-fg-primary">
                {line || "\u00A0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
