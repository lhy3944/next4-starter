import { create } from "zustand";

export type ViewerType = "markdown" | "code" | "text" | "pdf";

export interface ViewerTab {
  id: string;
  type: ViewerType;
  title: string;
  content: string; // 텍스트 기반 뷰어용
  url?: string; // PDF 등 URL 기반 뷰어용
  meta?: Record<string, string>; // 언어, 라인 넘버 등 부가 정보
}

interface ViewerState {
  tabs: ViewerTab[];
  activeTabId: string | null;

  openTab: (tab: Omit<ViewerTab, "id">) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Omit<ViewerTab, "id">>) => void;
  closeAllTabs: () => void;
}

let tabCounter = 0;

export const useViewerStore = create<ViewerState>()((set) => ({
  tabs: [],
  activeTabId: null,

  openTab: (tab) => {
    const id = `tab-${++tabCounter}`;
    set((s) => ({
      tabs: [...s.tabs, { ...tab, id }],
      activeTabId: id,
    }));
  },

  closeTab: (id) => {
    set((s) => {
      const next = s.tabs.filter((t) => t.id !== id);
      const activeTabId =
        s.activeTabId === id
          ? (next[next.length - 1]?.id ?? null)
          : s.activeTabId;
      return { tabs: next, activeTabId };
    });
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
  },

  updateTab: (id, updates) => {
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  closeAllTabs: () => {
    set({ tabs: [], activeTabId: null });
  },
}));
