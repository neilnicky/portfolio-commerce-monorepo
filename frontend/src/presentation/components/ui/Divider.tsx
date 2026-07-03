import { cn } from "@lib/cn";

/** Full-width 1px "etched-glass" hairline divider. */
export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-hairline", className)} />;
}
