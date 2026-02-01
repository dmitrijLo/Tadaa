"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SidebarState = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
