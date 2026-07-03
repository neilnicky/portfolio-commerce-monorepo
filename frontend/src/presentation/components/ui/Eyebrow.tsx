import type { ReactNode } from "react";
import { cn } from "@lib/cn";

/** Small uppercase "film-slate" metadata label used above headings. */
export function Eyebrow({
  children,
  className,
  tracking = "widest",
}: {
  children: ReactNode;
  className?: string;
  tracking?: "widest" | "metadata" | "metadata-wide";
}) {
  const trackingClass = {
    widest: "tracking-widest",
    metadata: "tracking-metadata",
    "metadata-wide": "tracking-metadata-wide",
  }[tracking];

  return (
    <span
      className={cn(
        "block font-body text-label-md uppercase text-on-surface-variant",
        trackingClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
