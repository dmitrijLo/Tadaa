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
  loading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      loading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      async register(email, name, password) {
        set({ loading: true, error: null });

        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, name, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
          }

          await res.json();
          set({ loading: false });
        } catch (error) {
          const message = (error as Error).message;
          set({ error: message, loading: false });
          throw error;
        }
      },

      async login(email, password) {
        set({ loading: true, error: null });

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Login failed");
          }

          const data = await res.json();
          set({
            currentUser: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            },
            loading: false,
          });
        } catch (error) {
          const message = (error as Error).message;
          set({ error: message, loading: false, currentUser: null });
          throw error;
        }
      },

      logout() {
        fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        }).catch(() => {});
        set({ currentUser: null, error: null, loading: false });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
