import type { UIMessage } from "ai";

export type { UIMessage };

/** AISE+ 메시지에 부착할 커스텀 메타데이터 */
export interface AiseMessageMeta {
  model?: string;
  tokens?: { prompt: number; completion: number };
}
