/**
 * Centralised API client. Every service talks to the backend through here so
 * swapping mock data for a real REST backend only touches this file + services.
 */
const API_URL = import.meta.env["VITE_API_URL"] ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}


export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = await response.clone().json();
      message = body?.message || message;
    } catch {
      message = (await response.text().catch(() => message)) || message;
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Simulates network latency for the mock layer so loading states are real. */
export const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/** Mongo documents come back as { _id, ... }. The UI works with { id, ... }. */
export function withId<T extends { _id: string }>(doc: T): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id };
}

/** Full-page navigation (not a fetch) — used for the Google OAuth handshake. */
export function goTo(path: string) {
  if (typeof window !== "undefined") window.location.href = `${API_URL}${path}`;
}

export { API_URL };