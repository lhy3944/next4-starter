import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LayoutMode = "wide" | "split" | "closed" | "custom";

interface PanelState {
  leftSidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  layoutMode: LayoutMode;
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

const MIN_CHAT_WIDTH = 550;
const SIDEBAR_WIDTH = 220;
const ICON_RAIL_WIDTH = 48;

export const usePanelStore = create<PanelState>()(
  persist(
    (set, get) => ({
      leftSidebarOpen: false,
      rightPanelOpen: false,
      rightPanelWidth: 50,
      layoutMode: "closed" as LayoutMode,
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
            set({
              rightPanelOpen: true,
              rightPanelWidth: 70,
              layoutMode: "wide",
              notificationOpen: false,
            });
            break;
          case "split":
            set({
              rightPanelOpen: true,
              rightPanelWidth: 50,
              layoutMode: "split",
              notificationOpen: false,
            });
            break;
          case "closed":
            set({ rightPanelOpen: false, layoutMode: "closed" });
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

        // Only adjust sidebar state when the viewport category actually changes
        const wasMobile = state.isMobile;
        const wasTablet = state.isTablet;
        const wasDesktop = !wasMobile && !wasTablet;
        const isDesktop = !isMobile && !isTablet;

        if (isMobile && !wasMobile) {
          set({
            isMobile: true,
            isTablet: false,
            previousLeftSidebar:
              state.leftSidebarOpen || state.previousLeftSidebar,
            leftSidebarOpen: false,
            rightPanelOpen: false,
            notificationOpen: false,
          });
        } else if (isTablet && !wasTablet) {
          set({
            isMobile: false,
            isTablet: true,
            previousLeftSidebar:
              state.leftSidebarOpen || state.previousLeftSidebar,
            leftSidebarOpen: false,
          });
        } else if (isDesktop && !wasDesktop) {
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

        const chatWidth =
          containerWidth - iconRail - sidebar - rightPx - notifPx;

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
    }),
    {
      name: "aise-panel",
      partialize: (state) => ({
        leftSidebarOpen: state.leftSidebarOpen,
        rightPanelOpen: state.rightPanelOpen,
        rightPanelWidth: state.rightPanelWidth,
        layoutMode: state.layoutMode,
        fullWidthMode: state.fullWidthMode,
      }),
    },
  ),
);
