import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import * as authService from "@/services/auth.service";
import * as cartService from "@/services/cart.service";
import * as userService from "@/services/user.service";
import type { Cart } from "@/types/cart";
import type { Product } from "@/types/product";
import type { AuthSession, User } from "@/types/user";

const EMPTY_CART: Cart = { items: [], subtotal: 0, shipping: 0, total: 0 };

interface AppState {
  user: User | null;
  isAdmin: boolean;
  sessionReady: boolean;
  cart: Cart;
  cartCount: number;
  wishlist: string[];
  /** Redirects the browser to Google sign-in. Does not return a user directly. */
  loginWithGoogle: (redirectTo?: string) => void;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const hydrate = useCallback(async (next: AuthSession | null) => {
    setSession(next);
    setCart(await cartService.getCart(next?.user.id));
    setWishlist(next ? await userService.getWishlist() : []);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const existing = await authService.getSession();
      if (!active) return;
      // Merge whatever was in the guest cart into the freshly-loaded account.
      if (existing) await cartService.mergeGuestCart(existing.user.id);
      await hydrate(existing);
      setSessionReady(true);
    })();
    return () => {
      active = false;
    };
  }, [hydrate]);

  const value = useMemo<AppState>(() => {
    const userId = session?.user.id;
    return {
      user: session?.user ?? null,
      isAdmin: session?.user.role === "ADMIN",
      sessionReady,
      cart,
      cartCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      wishlist,
      loginWithGoogle: (redirectTo = "/profile") => authService.loginWithGoogle(redirectTo),
      logout: async () => {
        await authService.logoutUser();
        await hydrate(null);
      },
      setUser: (user) => setSession((current) => (current ? { ...current, user } : current)),
      addToCart: async (product, quantity = 1) => {
        setCart(await cartService.addToCart(product, quantity, userId));
        toast.success(`${product.name} added to your cart`);
      },
      updateQuantity: async (productId, quantity) => {
        setCart(await cartService.updateCartItem(productId, quantity, userId));
      },
      removeFromCart: async (productId) => {
        setCart(await cartService.removeFromCart(productId, userId));
        toast("Removed from cart");
      },
      clearCart: async () => setCart(await cartService.clearCart(userId)),
      toggleWishlist: async (productId) => {
        const next = await userService.toggleWishlist(productId, userId);
        setWishlist(next);
        toast(next.includes(productId) ? "Saved to wishlist" : "Removed from wishlist");
      },
      isWishlisted: (productId) => wishlist.includes(productId),
    };
  }, [session, sessionReady, cart, wishlist, hydrate]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <AppProvider>");
  return context;
}
