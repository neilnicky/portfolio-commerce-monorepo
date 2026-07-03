"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@lib/cn";

type Variant = "up" | "blur" | "scale" | "left" | "right";

/** Hidden → visible class pair per entrance flavour. */
const VARIANTS: Record<Variant, { hidden: string; shown: string }> = {
  up: { hidden: "translate-y-6 opacity-0", shown: "translate-y-0 opacity-100" },
  blur: { hidden: "translate-y-6 opacity-0 blur-md", shown: "translate-y-0 opacity-100 blur-0" },
  scale: { hidden: "scale-95 opacity-0", shown: "scale-100 opacity-100" },
  left: { hidden: "-translate-x-8 opacity-0", shown: "translate-x-0 opacity-100" },
  right: { hidden: "translate-x-8 opacity-0", shown: "translate-x-0 opacity-100" },
};

/**
 * Client island: eases its children into view on scroll (Intersection
 * Observer). Purely presentational motion — carries no data. `variant` picks
 * the entrance flavour, `delay` staggers siblings, `as` picks the wrapper.
 * Honours `prefers-reduced-motion` by showing content immediately.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "blur",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion users skip the animation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const v = VARIANTS[variant];

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-1000 ease-cinematic will-change-[transform,opacity,filter]",
        visible ? v.shown : v.hidden,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
