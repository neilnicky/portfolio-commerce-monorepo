import type { ReactNode } from "react";
import { cn } from "@lib/cn";

/**
 * Horizontal layout frame: responsive editorial margins (20px → 64px) and,
 * by default, the centred 1440px content column. `size="full"` keeps the
 * padding but drops the max-width for full-bleed sections.
 */
export function Container({
  children,
  className,
  size = "site",
}: {
  children: ReactNode;
  className?: string;
  size?: "site" | "full";
}) {
  return (
    <div
      className={cn(
        "w-full px-margin-mobile md:px-margin-desktop",
        size === "site" && "mx-auto max-w-site",
        className,
      )}
    >
      {children}
    </div>
  );
}
