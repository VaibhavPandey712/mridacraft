import { apiFetch, ApiError, goTo, withId } from "@/lib/api";
import type { AuthSession, User } from "@/types/user";

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

// Google OAuth
export function loginWithGoogle(redirectTo = "/profile") {
  goTo(`/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`);
}

// Read current logged-in user
export async function getSession(): Promise<AuthSession | null> {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const { user } = await apiFetch<{ user: RawUser }>("/api/auth/me");
    return { user: mapUser(user), token };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      localStorage.removeItem("token");
      return null;
    }
    return null;
  }
}

// Logout
export async function logoutUser(): Promise<void> {
  localStorage.removeItem("token");
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore backend logout errors
  }
}