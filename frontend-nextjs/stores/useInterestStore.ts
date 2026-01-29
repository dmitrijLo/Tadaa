"use client";

import { create } from "zustand";

type InterestStore = {
  interestOptions: InterestOption[];
  interests: InterestOption[];
  noInterest: InterestOption[];
  isLoading: boolean;
  isSuggestionsLoading: boolean;
  noteForGiver: string;
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
  setInitialInterests: (
    interests: InterestOption[],
    noInterest: InterestOption[],
  ) => void;
  addInterestOption: (newOption: string) => Promise<void>;
  submitNoteForGiver: (guestId: string, noteForGiVer: string) => Promise<void>;
  getSuggestions: (guestId: string) => Promise<void>;
  suggestions: GiftSuggestion[];
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
  noteForGiver: "",
  isLoading: false,
  isSuggestionsLoading: false,
  error: null,
  suggestions: [],

  submitNoteForGiver: async (guestId: string, noteForGiver: string) => {
    set({ noteForGiver });

    try {
      const response = await fetch(`${URL}/${guestId}/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteForGiver }),
      });

      if (!response.ok) {
        throw new Error("Could not post note for giver");
      }

      const data = await response.json();
      set({ noteForGiver: data, error: null, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

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
    } catch {
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

      const data: {
        interests: InterestOption[];
        noInterest: InterestOption[];
      } = await result.json();

      set({
        interests: data.interests,
        noInterest: data.noInterest,
        isLoading: false,
      });
    } catch {
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

      const data: InterestOption[] = await result.json();

      set({
        [like ? "interests" : "noInterest"]: data,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ error: "Fehler beim Entfernen", isLoading: false });
    }
  },

  getSuggestions: async (guestId: string) => {
    set({ isSuggestionsLoading: true, error: null });
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interests/${guestId}/suggestions`,
      );

      if (!result.ok) throw new Error("Could not fetch suggestions");

      const suggestions: GiftSuggestion[] = await result.json();
      set({ isSuggestionsLoading: false, suggestions });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isSuggestionsLoading: false,
      });
    }
  },
}));
