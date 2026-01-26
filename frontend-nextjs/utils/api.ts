import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const isClient = typeof window !== "undefined";

export const TEST_EVENT_UUID = "e77b9a3f-911d-41d4-807b-8f4e315c6f31";
export const TEST_EVENTHOST_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
export const TEST_ROUTE = `http://localhost:3001/events/${TEST_EVENT_UUID}/guests`;

export const BACKEND_URL = isClient
  ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  : process.env.INTERNAL_API_URL || "http://backend:3001";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    cfg.headers["x-dev-user-id"] = TEST_EVENTHOST_UUID;
  } else {
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   cfg.headers["Authorization"] = `Bearer ${token}`;
    // }
  }

  //if token
  // cfg.headers ....

  return cfg;
});

export const getAuthHeader = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.NODE_ENV === "development") {
    headers["x-dev-user-id"] = TEST_EVENTHOST_UUID;
  }
  // }else {
  //   const token = useAuthStore.getState().token;
  //   if (token) {
  //     headers["Authorization"] = `Bearer ${token}`;
  //   }
  // }

  return headers;
};

export const makeApiRequest = async <T = unknown>(url: string): Promise<T> => {
  const response = await fetch(url, {
    cache: "no-store",
    headers: getAuthHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }

  return response.json();
};
