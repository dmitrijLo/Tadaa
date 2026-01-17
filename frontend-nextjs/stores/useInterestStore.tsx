"use client";

import { create } from "zustand";

type InterestStore = {
  interests: string[];
  noInterest: string[];
  isLoading: boolean;
  error: string | null;
  fetchInterests: (guestToken: string) => Promise<void>;
  addInterest: (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => Promise<void>;
  removeInterest: (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => Promise<void>;
};

const getUrl = (like: boolean, guestToken: string, interestId?: string): string => {
  const base = `${process.env.NEXT_PUBLIC_API_URL}/guests/${guestToken}`;
  if (interestId) {
    return `${base}/${like ? "interests" : "no-interest"}/${interestId}`;
  }
  return `${base}/interests`;
};

export const useInterestStore = create<InterestStore>((set, get) => ({
  interests: [],
  noInterest: [],
  isLoading: false,
  error: null,

  fetchInterests: async (guestToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(getUrl(true, guestToken));
      if (!res.ok) throw new Error("Could not fetch interests.");
      const { interests, noInterest } = await res.json();
      set({ interests, noInterest, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      set({ isLoading: false, error: errorMessage });
      console.error("Failed to fetch interests:", error);
    }
  },

  addInterest: async (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => {
    const originalState = { interests: get().interests, noInterest: get().noInterest };
    set({ isLoading: true, error: null });

    // Optimistic update
    set((state) => ({
      interests: like ? [...state.interests, interestId] : state.interests,
      noInterest: !like
        ? [...state.noInterest, interestId]
        : state.noInterest,
    }));

    try {
      const res = await fetch(getUrl(like, guestToken), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId }),
      });

      if (!res.ok) throw new Error("Could not save interest.");
      
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      set({ ...originalState, isLoading: false, error: errorMessage });
      console.error("Failed to add interest:", error);
    }
  },

  removeInterest: async (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => {
    const originalState = { interests: get().interests, noInterest: get().noInterest };
    set({ isLoading: true, error: null });

    // Optimistic update
    set((state) => ({
      interests: like
        ? state.interests.filter((id) => id !== interestId)
        : state.interests,
      noInterest: !like
        ? state.noInterest.filter((id) => id !== interestId)
        : state.noInterest,
    }));
    
    try {
      const res = await fetch(getUrl(like, guestToken, interestId), {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Could not remove interest.");

      set({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      set({ ...originalState, isLoading: false, error: errorMessage });
      console.error("Failed to remove interest:", error);
    }
  },
}));

