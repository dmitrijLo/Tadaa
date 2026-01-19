"use client";

import { create } from "zustand";

type InterestStore = {
  interests: string[];
  noInterest: string[];
  isLoading: boolean;
  error: string | null;
  addInterest: (
    guestId: string,
    interestId: string,
    like: boolean,
  ) => Promise<void>;
  removeInterest: (
    guestId: string,
    interestId: string,
    like: boolean,
  ) => Promise<void>;
};

interface GuestInterestDto {
  interestId: string;
  like: boolean;
}

export const useInterestStore = create<InterestStore>((set) => ({
  interests: [],
  noInterest: [],
  isLoading: false,
  error: null,

  addInterest: async (guestId: string, interestId: string, like: boolean) => {
    const guestInterest: GuestInterestDto = { interestId, like };
    set({ isLoading: true, error: null });

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interests/${guestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestInterest),
        },
      );

      if (!result.ok) throw new Error("Could not submit new interest");

      const data: string[] = await result.json();

      set({
        [like ? "interests" : "noInterest"]: data,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ error: "Fehler beim Hinzufügen", isLoading: false });
    }
  },

  removeInterest: async (
    guestId: string,
    interestId: string,
    like: boolean,
  ) => {
    const guestInterest: GuestInterestDto = { interestId, like };
    set({ isLoading: true, error: null });

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interests/${guestId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(guestInterest),
        },
      );

      if (!result.ok) throw new Error("Could not remove interest");

      const data: string[] = await result.json();

      set({
        [like ? "interests" : "noInterest"]: data,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ error: "Fehler beim Entfernen", isLoading: false });
    }
  },
}));
