"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutMode, usePanelStore } from "@/stores/panel-store";
import { useViewerStore } from "@/stores/viewer-store";
import { Code, FileText, Notebook, Type } from "lucide-react";

const SAMPLE_MARKDOWN = `# 에너지 사용량 주간 리포트

## 요약
이번 주 **총 에너지 사용량**은 \`1,245 kWh\`로 전주 대비 **12% 감소**하였습니다.

## 주요 지표

| 항목 | 이번 주 | 지난 주 | 변화 |
|------|---------|---------|------|
| 전력 | 890 kWh | 1,020 kWh | -12.7% |
| 가스 | 355 kWh | 395 kWh | -10.1% |

## 절전 팁
1. 사용하지 않는 전자기기의 **대기전력**을 차단하세요
2. 에어컨 온도를 \`26°C\`로 설정하세요
3. LED 조명으로 교체를 권장합니다

> 다음 주 예상 사용량: **1,180 kWh** (목표 대비 95%)
`;

const SAMPLE_CODE = `import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "viewer";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, logout };
}
`;

const SAMPLE_TEXT = `[2026-03-20 09:15:23] INFO  Server started on port 3000
[2026-03-20 09:15:24] INFO  Database connected successfully
[2026-03-20 09:15:25] INFO  Redis cache initialized
[2026-03-20 09:16:01] INFO  Agent "energy-analyzer" registered
[2026-03-20 09:16:02] INFO  Agent "code-reviewer" registered
[2026-03-20 09:17:15] WARN  Rate limit approaching for user_id=usr_abc123
[2026-03-20 09:18:30] INFO  RAG pipeline initialized with 3 data sources
[2026-03-20 09:19:45] INFO  Workflow "weekly-report" scheduled (cron: 0 9 * * MON)
[2026-03-20 09:20:00] ERROR Connection timeout to embedding service (retry 1/3)
[2026-03-20 09:20:05] INFO  Embedding service reconnected
[2026-03-20 09:21:30] INFO  Processing request req_id=req_xyz789
[2026-03-20 09:21:31] INFO  Agent "energy-analyzer" execution started
[2026-03-20 09:21:35] INFO  RAG search completed: 12 relevant documents found
[2026-03-20 09:21:42] INFO  Agent "energy-analyzer" execution completed (11.2s)
`;

export function ChatArea() {
  const fullWidthMode = usePanelStore((s) => s.fullWidthMode);
  const rightPanelOpen = usePanelStore((s) => s.rightPanelOpen);
  const setRightPanelPreset = usePanelStore((s) => s.setRightPanelPreset);
  const openTab = useViewerStore((s) => s.openTab);

  const handleOpenViewer = (
    type: "markdown" | "code" | "text" | "pdf",
    title: string,
  ) => {
    // 패널이 닫혀있으면 SPLIT으로 열기
    if (!rightPanelOpen) {
      setRightPanelPreset(LayoutMode.SPLIT);
    }

    switch (type) {
      case "markdown":
        openTab({ type, title, content: SAMPLE_MARKDOWN });
        break;
      case "code":
        openTab({
          type,
          title,
          content: SAMPLE_CODE,
          meta: { language: "typescript" },
        });
        break;
      case "text":
        openTab({ type, title, content: SAMPLE_TEXT });
        break;
      case "pdf":
        openTab({ type, title, content: "", url: "/sample.pdf" });
        break;
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-2">
      <div
        className={cn(
          "mx-auto w-full transition-[max-width] duration-300 ease-in-out",
          fullWidthMode ? "max-w-[896px]" : "max-w-[768px]",
        )}
      >
        <div className="flex justify-center py-4">
          <h1 className="text-4xl font-bold text-fg-primary">AISE 3.0</h1>
        </div>

        {/* POC: 뷰어 테스트 버튼 */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenViewer("markdown", "주간 리포트.md")}
          >
            <Notebook className="h-4 w-4" />
            Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenViewer("code", "useAuth.ts")}
          >
            <Code className="h-4 w-4" />
            Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenViewer("text", "server.log")}
          >
            <Type className="h-4 w-4" />
            Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenViewer("pdf", "document.pdf")}
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>

        <ChatInput />
      </div>
    </div>
  );
}
