import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId && i.size === item.size && i.color === item.color);
        if (existing) {
          set({ items: get().items.map((i) => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i) });
        } else {
          set({ items: [...get().items, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, qty) => {
        if (qty <= 0) get().removeItem(id);
        else set({ items: get().items.map((i) => i.id === id ? { ...i, quantity: qty } : i) });
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: "seenways-cart-v2" }
  )
);

interface WishlistStore {
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => {
        const items = get().items;
        set({ items: items.includes(id) ? items.filter((i) => i !== id) : [...items, id] });
      },
      has: (id) => get().items.includes(id),
    }),
    { name: "seenways-wishlist" }
  )
);

interface AuthStore {
  token: string | null;
  admin: { id: string; email: string; name: string } | null;
  setAuth: (token: string, admin: object) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      setAuth: (token, admin) => { localStorage.setItem("seenways_token", token); set({ token, admin: admin as AuthStore["admin"] }); },
      logout: () => { localStorage.removeItem("seenways_token"); set({ token: null, admin: null }); },
    }),
    { name: "seenways-auth" }
  )
);
