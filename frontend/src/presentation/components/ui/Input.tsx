import type { InputHTMLAttributes } from "react";
import { cn } from "@lib/cn";

/** Domain-agnostic design-system primitive. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-white/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-white/40",
        className,
      )}
      {...props}
    />
  );
}
