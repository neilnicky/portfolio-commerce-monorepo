import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@lib/cn";

type Variant = "outline" | "solid" | "link";

const base =
  "relative inline-flex items-center justify-center font-body text-label-md uppercase tracking-widest transition-all duration-300 ease-editorial will-change-transform active:scale-[0.97] active:translate-y-0";

const variants: Record<Variant, string> = {
  // 1px hairline rectangle → fills to primary on hover (the signature editorial CTA).
  outline:
    "border border-hairline-strong px-8 py-3 hover:-translate-y-0.5 hover:bg-primary hover:text-background hover:border-primary",
  // Solid primary block, inverts to outline on hover.
  solid:
    "bg-primary text-background px-8 py-3 border border-primary hover:-translate-y-0.5 hover:bg-transparent hover:text-primary",
  // Underlined text link — faint resting rule + bright underline that grows in.
  link: "link-underline border-b border-hairline-strong pb-1",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string };

/**
 * Shared, domain-agnostic CTA primitive. Renders a Next `Link` when `href` is
 * given, otherwise a `<button>`. All colour/spacing comes from design tokens.
 */
export function EditorialButton(props: AsButton | AsLink) {
  const { variant = "outline", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
