"use client";

import { useState } from "react";
import { cn } from "@lib/cn";
import { useCartUiStore } from "@presentation/state/cart-ui.store";

type StyleVariant = "purchase" | "add" | "feature";

const base =
  "font-body text-label-md uppercase tracking-widest transition-all duration-500 ease-editorial";

const variants: Record<StyleVariant, string> = {
  // Half-width product cards.
  purchase: "w-full py-4 border border-hairline-strong hover:bg-primary hover:text-background",
  // Compact third-width cards.
  add: "w-full py-3 border border-hairline hover:border-primary",
  // Feature best-seller card.
  feature: "px-12 py-4 border border-primary bg-primary text-background hover:bg-transparent hover:text-primary",
};

/**
 * Client island: adds to the cart-ui store and flashes an "Added to Cart"
 * confirmation. Presentational styling is token-driven per variant.
 */
export function AddToCartButton({
  label,
  styleVariant,
}: {
  label: string;
  styleVariant: StyleVariant;
}) {
  const add = useCartUiStore((s) => s.add);
  const [added, setAdded] = useState(false);

  function handleClick() {
    add();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(base, variants[styleVariant], added && "bg-primary text-background")}
    >
      {added ? "Added to Cart" : label}
    </button>
  );
}
