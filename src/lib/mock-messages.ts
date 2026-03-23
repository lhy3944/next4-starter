/**
 * Mock 대화 데이터 팩토리
 *
 * AI SDK의 UIMessage 타입을 사용하되, 제네릭 타입 제약을 우회하기 위해
 * 도구 호출 파트는 `as never`로 캐스팅합니다.
 */
import type { UIMessage } from "@/types/chat";

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

// ─── 팩토리 ───

/** 기본 텍스트 대화 */
export function createTextConversation(): UIMessage[] {
  return [
    {
      id: nextId(),
      role: "user",
      parts: [{ type: "text", text: "React의 useEffect에 대해 간단히 설명해줘." }],
    },
    {
      id: nextId(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "`useEffect`는 React 컴포넌트에서 **사이드 이펙트**를 처리하는 훅입니다.\n\n## 기본 사용법\n\n```tsx\nuseEffect(() => {\n  // 마운트 시 실행\n  const subscription = api.subscribe(handleData);\n\n  return () => {\n    // 언마운트 시 정리\n    subscription.unsubscribe();\n  };\n}, [dependency]);\n```\n\n## 핵심 규칙\n\n1. **의존성 배열이 빈 경우** (`[]`) — 마운트 시 1회만 실행\n2. **의존성이 있는 경우** — 해당 값이 변경될 때마다 재실행\n3. **배열 생략** — 매 렌더마다 실행 (주의 필요)\n\n더 궁금한 점이 있으면 물어보세요!",
        },
      ],
    },
  ];
}

/** 추론(reasoning) 과정 포함 대화 */
export function createReasoningConversation(): UIMessage[] {
  return [
    {
      id: nextId(),
      role: "user",
      parts: [{ type: "text", text: "피보나치 수열의 시간복잡도를 분석해줘." }],
    },
    {
      id: nextId(),
      role: "assistant",
      parts: [
        {
          type: "reasoning",
          text: "피보나치 수열의 구현 방법은 여러 가지가 있다. 재귀, 메모이제이션, 반복문, 행렬 거듭제곱 등. 각각의 시간복잡도를 정리해보자.\n\n- 단순 재귀: T(n) = T(n-1) + T(n-2) → O(2^n)\n- 메모이제이션: 각 값을 1번만 계산 → O(n)\n- 반복문(Bottom-up DP): O(n)\n- 행렬 거듭제곱: O(log n)",
        },
        {
          type: "text",
          text: "## 피보나치 수열 시간복잡도 분석\n\n| 방법 | 시간복잡도 | 공간복잡도 |\n|------|-----------|----------|\n| 단순 재귀 | O(2ⁿ) | O(n) |\n| 메모이제이션 | O(n) | O(n) |\n| 반복문 (DP) | O(n) | O(1) |\n| 행렬 거듭제곱 | O(log n) | O(1) |\n\n실무에서는 **반복문 방식**이 가장 많이 사용됩니다. `O(n)` 시간에 `O(1)` 공간만 사용하기 때문입니다.\n\n```python\ndef fib(n: int) -> int:\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```",
        },
      ],
    },
  ];
}

/** 도구 호출 포함 대화 */
export function createToolCallConversation(): UIMessage[] {
  return [
    {
      id: nextId(),
      role: "user",
      parts: [{ type: "text", text: "오늘 서울 날씨 알려줘." }],
    },
    {
      id: nextId(),
      role: "assistant",
      parts: [
        // dynamic-tool 타입: 런타임에 정의되는 도구
        {
          type: "dynamic-tool",
          toolName: "getWeather",
          toolCallId: "call-weather-1",
          state: "output-available",
          input: { city: "Seoul", unit: "celsius" },
          output: {
            temperature: 24,
            condition: "맑음",
            humidity: 45,
            wind: "북서풍 12km/h",
          },
        } as never,
        {
          type: "text",
          text: "현재 **서울** 날씨입니다:\n\n- 🌡️ 기온: **24°C**\n- ☀️ 상태: 맑음\n- 💧 습도: 45%\n- 🌬️ 바람: 북서풍 12km/h\n\n외출하기 좋은 날씨입니다!",
        },
      ],
    },
  ];
}

/** 소스/인용 포함 대화 */
export function createSourcesConversation(): UIMessage[] {
  return [
    {
      id: nextId(),
      role: "user",
      parts: [{ type: "text", text: "Next.js App Router와 Pages Router의 차이점은?" }],
    },
    {
      id: nextId(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: '## App Router vs Pages Router\n\n**App Router** (Next.js 13+)는 React Server Components를 기본으로 사용하며, 레이아웃 중첩, 스트리밍, 서버 액션 등 최신 기능을 제공합니다.\n\n**Pages Router**는 기존 방식으로 `getServerSideProps`, `getStaticProps` 패턴을 사용합니다.\n\n### 주요 차이\n\n| 항목 | App Router | Pages Router |\n|------|-----------|-------------|\n| 기본 컴포넌트 | Server Component | Client Component |\n| 데이터 페칭 | `async` 컴포넌트 + `fetch` | `getServerSideProps` |\n| 레이아웃 | 중첩 레이아웃 (`layout.tsx`) | `_app.tsx` 단일 |\n| 라우팅 | 폴더 기반 (`app/`) | 파일 기반 (`pages/`) |\n\n> 새 프로젝트라면 **App Router를 권장**합니다 [1][2].',
        },
        {
          type: "source-url",
          sourceId: "src-1",
          url: "https://nextjs.org/docs/app",
          title: "Next.js App Router Documentation",
        },
        {
          type: "source-url",
          sourceId: "src-2",
          url: "https://nextjs.org/docs/pages",
          title: "Next.js Pages Router Documentation",
        },
      ],
    },
  ];
}

/** 위 전체를 하나의 대화로 통합 */
export function createFullDemoConversation(): UIMessage[] {
  return [
    ...createTextConversation(),
    ...createReasoningConversation(),
    ...createToolCallConversation(),
    ...createSourcesConversation(),
  ];
}

/** 간단한 mock 응답 생성 */
export function createMockResponse(userText: string): UIMessage {
  return {
    id: nextId(),
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `"${userText}"에 대한 답변을 준비 중입니다.\n\n이것은 **mock 응답**입니다. 실제 백엔드가 연결되면 AI 에이전트의 실시간 스트리밍 응답으로 대체됩니다.`,
      },
    ],
  };
}
