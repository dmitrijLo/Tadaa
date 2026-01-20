"use client";

import { create } from "zustand";

type InterestStore = {
  interestOptions: InterestOption[];
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
  fetchInterestOptions: () => Promise<void>;
  setInitialInterests: (interests: string[], noInterest: string[]) => void;
  addInterestOption: (newOption: string) => Promise<void>;
};

interface GuestInterestDto {
  interestId: string;
  like: boolean;
}

const URL = `${process.env.NEXT_PUBLIC_API_URL}/interests`;

export const useInterestStore = create<InterestStore>((set, get) => ({
  interestOptions: [],
  interests: [],
  noInterest: [],
  isLoading: false,
  error: null,

  setInitialInterests: (interests, noInterest) => {
    set({ interests, noInterest });
  },

  addInterestOption: async (newInterest: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newInterest }),
      });

      if (!response.ok) {
        throw new Error("Could not add a new interest option");
      }

      const newOption = await response.json();

      set({
        interestOptions: [...get().interestOptions, newOption],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error(error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchInterestOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interests`,
      );
      if (!response.ok) {
        throw new Error("Could not fetch interest options");
      }
      const interests: InterestOption[] = await response.json();
      set({ interestOptions: interests, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ error: "Fehler beim Laden der Interessen", isLoading: false });
    }
  },

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
