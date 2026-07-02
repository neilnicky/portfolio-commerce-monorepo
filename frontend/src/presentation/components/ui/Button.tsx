import type { ButtonHTMLAttributes } from "react";
import { cn } from "@lib/cn";

type Variant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary: "bg-white text-black hover:bg-white/90",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

/** Domain-agnostic design-system primitive. */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
