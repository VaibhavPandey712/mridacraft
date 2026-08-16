export type Role = "USER" | "ADMIN";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address?: Omit<Address, "id">;
}

export interface AuthSession {
  user: User;
  /** Opaque token issued by the backend (JWT later). Never a secret key. */
  token: string;
}