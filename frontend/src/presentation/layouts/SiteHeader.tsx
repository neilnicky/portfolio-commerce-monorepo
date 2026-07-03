import Link from "next/link";
import type { SiteHeaderVm } from "@application/view-models/site.vm";
import { cn } from "@lib/cn";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";
import { CartBadge } from "@presentation/components/ui/CartBadge";

/** Presentational site header — sticky editorial nav. Consumes a ViewModel only. */
export function SiteHeader({ vm }: { vm: SiteHeaderVm }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-hairline bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-site items-center justify-between px-margin-mobile md:px-margin-desktop">
        <Link
          href={vm.brand.href}
          className="font-display text-headline-sm tracking-tighter text-primary transition-transform duration-300 ease-cinematic hover:-translate-y-0.5"
        >
          {vm.brand.name}
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {vm.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-body text-label-md uppercase tracking-widest transition-colors duration-300",
                link.active
                  ? "border-b border-primary pb-1 text-primary"
                  : "link-underline text-on-surface-variant hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}

          {vm.showCart ? <CartBadge /> : null}
        </div>

        <EditorialButton href={vm.cta.href}>{vm.cta.label}</EditorialButton>
      </div>
    </nav>
  );
}
