import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PanelState {
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  notificationOpen: boolean;
  fullWidthMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
  previousLeftSidebar: boolean;

  toggleLeftSidebar: () => void;
  toggleRightPanel: () => void;
  setRightPanelWidth: (pct: number) => void;
  setRightPanelPreset: (preset: "wide" | "split" | "closed") => void;
  toggleNotification: () => void;
  toggleFullWidth: () => void;
  setViewport: (width: number) => void;
  ensureMinChatWidth: (containerWidth: number) => void;
}

const MIN_CHAT_WIDTH = 480;
const SIDEBAR_WIDTH = 220;
const ICON_RAIL_WIDTH = 48;

export const usePanelStore = create<PanelState>()(persist((set, get) => ({
  leftSidebarOpen: false,
  rightPanelOpen: false,
  rightPanelWidth: 50,
  notificationOpen: false,
  fullWidthMode: false,
  isMobile: false,
  isTablet: false,
  previousLeftSidebar: false,

  toggleLeftSidebar: () => {
    set((s) => ({ leftSidebarOpen: !s.leftSidebarOpen }));
  },

  toggleRightPanel: () => {
    set((s) => ({
      rightPanelOpen: !s.rightPanelOpen,
      notificationOpen: !s.rightPanelOpen ? false : s.notificationOpen,
    }));
  },

  setRightPanelWidth: (pct) => {
    const clamped = Math.max(20, Math.min(70, pct));
    set({ rightPanelWidth: clamped });
  },

  setRightPanelPreset: (preset) => {
    switch (preset) {
      case "wide":
        set({ rightPanelOpen: true, rightPanelWidth: 70, notificationOpen: false });
        break;
      case "split":
        set({ rightPanelOpen: true, rightPanelWidth: 50, notificationOpen: false });
        break;
      case "closed":
        set({ rightPanelOpen: false });
        break;
    }
  },

  toggleNotification: () => {
    set((s) => ({
      notificationOpen: !s.notificationOpen,
      rightPanelOpen: !s.notificationOpen ? false : s.rightPanelOpen,
    }));
  },

  toggleFullWidth: () => {
    set((s) => ({ fullWidthMode: !s.fullWidthMode }));
  },

  setViewport: (width) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const state = get();

    if (isMobile) {
      set({
        isMobile: true,
        isTablet: false,
        previousLeftSidebar: state.leftSidebarOpen || state.previousLeftSidebar,
        leftSidebarOpen: false,
        rightPanelOpen: false,
        notificationOpen: false,
      });
    } else if (isTablet) {
      set({
        isMobile: false,
        isTablet: true,
        previousLeftSidebar: state.leftSidebarOpen || state.previousLeftSidebar,
        leftSidebarOpen: false,
      });
    } else {
      set({
        isMobile: false,
        isTablet: false,
        leftSidebarOpen: state.previousLeftSidebar,
        previousLeftSidebar: false,
      });
    }
  },

  ensureMinChatWidth: (containerWidth) => {
    const state = get();
    const iconRail = state.fullWidthMode ? 0 : ICON_RAIL_WIDTH;
    const sidebar = state.leftSidebarOpen ? SIDEBAR_WIDTH : 0;
    const rightPx = state.rightPanelOpen
      ? (containerWidth * state.rightPanelWidth) / 100
      : 0;
    const notifPx = state.notificationOpen ? 320 : 0;

    const chatWidth = containerWidth - iconRail - sidebar - rightPx - notifPx;

    if (chatWidth < MIN_CHAT_WIDTH) {
      if (state.rightPanelOpen) {
        set({ rightPanelOpen: false });
      } else if (state.notificationOpen) {
        set({ notificationOpen: false });
      } else if (state.leftSidebarOpen) {
        set({ leftSidebarOpen: false });
      }
    }
  },
}), {
  name: 'aise-panel',
  partialize: (state) => ({
    leftSidebarOpen: state.leftSidebarOpen,
    rightPanelOpen: state.rightPanelOpen,
    rightPanelWidth: state.rightPanelWidth,
    fullWidthMode: state.fullWidthMode,
  }),
}));
