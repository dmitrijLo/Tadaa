"use client";

import { create } from "zustand";

type InterestStore = {
  interests: string[];
  no_interest: string[];
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

const getUrl = (like: boolean, guestToken: string): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/guests/${guestToken}/${like ? "interests" : "nointerest"}`;
};

export const useInterestStore = create<InterestStore>((set) => ({
  interests: [],
  no_interest: [],

  addInterest: async (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => {
    try {
      const res = await fetch(getUrl(like, guestToken), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId }),
      });

      if (!res.ok) throw new Error("Could not save interest.");

      set((state) => ({
        interests: like ? [...state.interests, interestId] : state.interests,
        no_interest: !like
          ? [...state.no_interest, interestId]
          : state.no_interest,
      }));
    } catch (error) {
      console.error("Failed to add interest:", error);
    }
  },

  removeInterest: async (
    interestId: string,
    like: boolean,
    guestToken: string,
  ) => {
    try {
      const res = await fetch(getUrl(like, guestToken), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestId }),
      });

      if (!res.ok) throw new Error("Could not remove interest.");

      set((state) => ({
        interests: like
          ? state.interests.filter((id) => id !== interestId)
          : state.interests,
        no_interest: !like
          ? state.no_interest.filter((id) => id !== interestId)
          : state.no_interest,
      }));
    } catch (error) {
      console.error("Failed to remove interest:", error);
    }
  },
}));

