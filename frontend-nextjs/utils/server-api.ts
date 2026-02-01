import { cookies } from "next/headers";

const BACKEND_URL = process.env.INTERNAL_API_URL || "http://backend:3001";

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Cookie"] = `accessToken=${accessToken.value}`;
  }
  return headers;
}

export const serverApiRequest = async <T>(
  url: string,
): Promise<ApiResponse<T>> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(url, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Error";
    return { data: null, error: message };
  }
};

export const serverApiPost = async <T>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Error";
    return { data: null, error: message };
  }
};

export const serverApiPatch = async <T>(
  url: string,
  body: unknown,
): Promise<ApiResponse<T>> => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Error";
    return { data: null, error: message };
  }
};

export const SERVER_BACKEND_URL = BACKEND_URL;
