import { apiFetch, ApiError, goTo, withId } from "@/lib/api";
import type { AuthSession, User } from "@/types/user";

/**
 * Auth is Google Sign-In only, backed by an httpOnly JWT cookie set by the
 * server. There is no email/password flow and no token stored in the
 * browser — every request just goes out with `credentials: "include"`.
 */

interface RawUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

function mapUser(raw: RawUser): User {
  return withId(raw) as User;
}

/** Redirects the whole browser tab to the backend, which redirects to Google. */
export function loginWithGoogle(redirectTo = "/profile") {
  goTo(`/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`);
}

/** Reads the current session from the backend cookie, if any. */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const { user } = await apiFetch<{ user: RawUser }>("/api/auth/me");
    return { user: mapUser(user), token: "cookie" };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/api/auth/logout", { method: "POST" });
}
