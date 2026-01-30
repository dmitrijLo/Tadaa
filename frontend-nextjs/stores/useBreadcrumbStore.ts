"use client";

import { create } from "zustand";

type BreadcrumbOverrides = {
  [path: string]: string;
};

type BreadcrumbState = {
  overrides: BreadcrumbOverrides;
  setOverride: (path: string, label: string) => void;
  clearOverride: (path: string) => void;
};

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  overrides: {},
  setOverride: (path, label) =>
    set((state) => ({
      overrides: { ...state.overrides, [path]: label },
    })),
  clearOverride: (path) =>
    set((state) => {
      const { [path]: _, ...rest } = state.overrides;
      return { overrides: rest };
    }),
}));
