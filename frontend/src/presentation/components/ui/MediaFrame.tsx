import { cn } from "@lib/cn";

/**
 * Shared cinematic image frame: 1px hairline border, hard 0px corners, and a
 * slow group-hover zoom. Expects an ancestor with the `group` class to drive
 * the hover. `grayscale` adds the desaturate→colour reveal used on the works
 * grid. All motion durations are token-driven via Tailwind's scale.
 */
export function MediaFrame({
  src,
  alt,
  aspect = "aspect-[16/9]",
  grayscale = false,
  duration = "duration-700",
  bordered = true,
  className,
}: {
  src: string;
  alt: string;
  aspect?: string;
  grayscale?: boolean;
  duration?: string;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-surface-container",
        bordered && "border border-hairline",
        aspect,
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-all ease-cinematic group-hover:scale-105",
          duration,
          grayscale && "grayscale group-hover:grayscale-0",
        )}
      />
    </div>
  );
}
