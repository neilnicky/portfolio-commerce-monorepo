import Link from "next/link";
import type { SiteFooterVm } from "@application/view-models/site.vm";

/** Presentational site footer — consumes a ViewModel only. */
export function SiteFooter({ vm }: { vm: SiteFooterVm }) {
  return (
    <footer className="w-full border-t border-hairline bg-background pb-16 pt-32">
      <div className="mx-auto flex w-full max-w-site flex-col items-center justify-between gap-gutter px-margin-mobile md:flex-row md:px-margin-desktop">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-display text-headline-sm text-primary">{vm.brand.name}</span>
          <p className="mt-4 font-body text-label-md uppercase tracking-widest text-on-surface-variant">
            {vm.copyright}
          </p>
        </div>

        <div className="mt-8 flex gap-8 md:mt-0">
          {vm.social.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="link-underline font-body text-label-md uppercase tracking-widest text-on-surface-variant opacity-80 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary hover:opacity-100"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
