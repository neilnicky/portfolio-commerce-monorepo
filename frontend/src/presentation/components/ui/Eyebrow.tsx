import type { ReactNode } from "react";
import { cn } from "@lib/cn";

/** Small uppercase "film-slate" metadata label used above headings. */
export function Eyebrow({
  children,
  className,
  tracking = "widest",
  withLine = false,
}: {
  children: ReactNode;
  className?: string;
  tracking?: "widest" | "metadata" | "metadata-wide";
  /** Prepend a short "film-slate" rule that grows in from the left. */
  withLine?: boolean;
}) {
  const trackingClass = {
    widest: "tracking-widest",
    metadata: "tracking-metadata",
    "metadata-wide": "tracking-metadata-wide",
  }[tracking];

  const base = "font-body text-label-md uppercase text-on-surface-variant";

  if (withLine) {
    return (
      <span className={cn("inline-flex items-center gap-4", base, trackingClass, className)}>
        <span className="h-px w-10 origin-left animate-line-grow bg-primary/50" aria-hidden />
        {children}
      </span>
    );
  }

  return <span className={cn("block", base, trackingClass, className)}>{children}</span>;
}
