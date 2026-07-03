"use client";

import { useCartUiStore } from "@presentation/state/cart-ui.store";
import { Icon } from "./Icon";

/** Header shopping-bag with a dot that lights once items are in the cart. Island. */
export function CartBadge() {
  const count = useCartUiStore((s) => s.count);
  return (
    <button className="relative p-2" aria-label={`Cart (${count})`}>
      <Icon name="shopping_bag" className="text-primary" />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary transition-transform" />
      ) : null}
    </button>
  );
}
