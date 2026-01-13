"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type CurrentUser = {
  id: string;
  email: string;
  name: string;
};

type AuthState = {
  currentUser: CurrentUser | null;
  token: string | null;
  register: (email: string, name: string, password: string) => Promise<void>;
  //   login: (email: string, password: string) => Promise<void>;
  //   logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      loading: false,
      error: null,

      async register(email, name, password) {
        set({ currentUser: null, token: null });
        try {
          const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              body: JSON.stringify({ email, name, password }),
            },
          });
          if (!res.ok) {
            throw new Error("Registration failed");
          }
          const data = await res.json();
          set({
            token: data.access_token,
            currentUser: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            },
          });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },
      //   async logout() {
      //     set({ currentUser: null, token: null });
      //   },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        currentUser: state.currentUser,
      }),
    }
  )
);
