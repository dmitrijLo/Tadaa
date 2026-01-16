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
  loading: boolean;
  error: string | null;
  register: (email: string, name: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  // logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      loading: false,
      error: null,

      // REGISTER
      async register(email, name, password) {
        set({ loading: true, error: null });

        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name, password }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
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
          set({
            error: message,
            loading: false,
            currentUser: null,
            token: null,
          });
          throw error;
        }
      },

      // LOGIN
      async login(email, password) {
        set({ loading: true, error: null });

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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
            token: data.accessToken,
            loading: false,
          });
        } catch (error) {
          const message = (error as Error).message;
          set({
            error: message,
            loading: false,
            currentUser: null,
            token: null,
          });
          throw error;
        }
      },

      // LOGOUT
      // logout() {
      //   set({ currentUser: null, token: null, error: null, loading: false });
      // },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        currentUser: state.currentUser,
      }),
    },
  ),
);
