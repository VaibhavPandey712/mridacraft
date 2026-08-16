import { apiFetch, withId } from "@/lib/api";
import { getSession, logoutUser as authLogout } from "./auth.service";
import type { Address, User } from "@/types/user";

/**
 * Profile, addresses and wishlist all live on the backend now, scoped to
 * whoever the auth cookie says you are. The `userId` params are kept in the
 * function signatures (pages already call them that way) but are otherwise
 * unused — the server infers the user from the session cookie, never from
 * anything the client sends.
 */

interface RawAddress extends Omit<Address, "id"> {
  _id: string;
}
const mapAddress = (raw: RawAddress): Address => withId(raw) as Address;

export async function getUserProfile(): Promise<User | null> {
  return (await getSession())?.user ?? null;
}

export async function updateUserProfile(patch: Partial<User>): Promise<User> {
  interface RawUser extends Omit<User, "id"> {
    _id: string;
  }
  const { user } = await apiFetch<{ user: RawUser }>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify({ fullName: patch.fullName, phone: patch.phone }),
  });
  return withId(user) as User;
}

export async function getAddresses(_userId?: string): Promise<Address[]> {
  const raw = await apiFetch<RawAddress[]>("/api/addresses");
  return raw.map(mapAddress);
}

export async function addAddress(_userId: string, input: Omit<Address, "id">): Promise<Address[]> {
  await apiFetch("/api/addresses", { method: "POST", body: JSON.stringify(input) });
  return getAddresses();
}

export async function updateAddress(_userId: string, id: string, patch: Partial<Address>): Promise<Address[]> {
  await apiFetch(`/api/addresses/${id}`, { method: "PUT", body: JSON.stringify(patch) });
  return getAddresses();
}

export async function deleteAddress(_userId: string, id: string): Promise<Address[]> {
  await apiFetch(`/api/addresses/${id}`, { method: "DELETE" });
  return getAddresses();
}

export async function setDefaultAddress(_userId: string, id: string): Promise<Address[]> {
  await apiFetch(`/api/addresses/${id}/default`, { method: "PUT" });
  return getAddresses();
}

export async function getWishlist(_userId?: string): Promise<string[]> {
  const products = await apiFetch<Array<{ _id: string }>>("/api/wishlist");
  return products.map((p) => p._id);
}

export async function toggleWishlist(productId: string, _userId?: string): Promise<string[]> {
  const current = await getWishlist();
  if (current.includes(productId)) {
    await apiFetch(`/api/wishlist/${productId}`, { method: "DELETE" });
  } else {
    await apiFetch(`/api/wishlist/${productId}`, { method: "POST" });
  }
  return getWishlist();
}

export { authLogout as logoutUser };
