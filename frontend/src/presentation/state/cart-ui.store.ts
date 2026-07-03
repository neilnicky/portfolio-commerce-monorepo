import { create } from "zustand";

/**
 * Shared client UI state (kernel): the store page's add-to-cart count feeds the
 * header cart badge, so it is promoted above any single feature slice. This is
 * UI state only — real cart/order data would live in the query cache, not here.
 */
interface CartUiState {
  count: number;
  add: () => void;
}

export const useCartUiStore = create<CartUiState>((set) => ({
  count: 0,
  add: () => set((s) => ({ count: s.count + 1 })),
}));
