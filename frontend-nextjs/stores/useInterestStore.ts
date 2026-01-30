"use client";

import { create } from "zustand";
import { api } from "@/utils/api";

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

const INTERESTS_PATH = "/interests";

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
      const response = await api.post(`${INTERESTS_PATH}/${guestId}/note`, {
        noteForGiver,
      });
      set({ noteForGiver: response.data, error: null, isLoading: false });
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
      const response = await api.post(INTERESTS_PATH, { name: newInterest });

      set({
        interestOptions: [...get().interestOptions, response.data],
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
      const response = await api.get<InterestOption[]>(INTERESTS_PATH);
      set({ interestOptions: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Fehler beim Laden der Interessen", isLoading: false });
    }
  },

  addInterest: async (guestId: string, interestId: string, like: boolean) => {
    const guestInterest: GuestInterestDto = { interestId, like };
    set({ isLoading: true, error: null });

    try {
      const result = await api.post<InterestOption[]>(
        `${INTERESTS_PATH}/${guestId}`,
        guestInterest,
      );

      set({
        [like ? "interests" : "noInterest"]: result.data,
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
      const result = await api.delete<InterestOption[]>(
        `${INTERESTS_PATH}/${guestId}`,
        { data: guestInterest },
      );

      set({
        [like ? "interests" : "noInterest"]: result.data,
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
      const result = await api.get<GiftSuggestion[]>(
        `${INTERESTS_PATH}/${guestId}/suggestions`,
      );
      set({ isSuggestionsLoading: false, suggestions: result.data });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isSuggestionsLoading: false,
      });
    }
  },
}));
