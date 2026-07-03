import { cn } from "@lib/cn";

/** Material Symbols (Outlined) glyph. `name` is the ligature, e.g. "arrow_forward". */
export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("material-symbols-outlined", className)}>
      {name}
    </span>
  );
}
