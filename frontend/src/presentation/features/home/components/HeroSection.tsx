import Link from "next/link";
import type { HeroVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";
import { Icon } from "@presentation/components/ui/Icon";

/** Home hero — name, intro, dual CTA, portrait, scroll cue. Presentational. */
export function HeroSection({ vm }: { vm: HeroVm }) {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden py-24">
      <Container size="full">
        <div className="z-10 grid grid-cols-1 items-center gap-gutter lg:grid-cols-12">
          <div className="order-2 space-y-8 lg:order-1 lg:col-span-7">
            <h1 className="font-display text-display-lg text-primary">{vm.name}</h1>
            <p className="max-w-xl font-display text-headline-sm text-on-surface-variant">
              {vm.intro}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <EditorialButton href={vm.primaryCta.href} variant="solid" className="px-10 py-5">
                {vm.primaryCta.label}
              </EditorialButton>
              <EditorialButton href={vm.secondaryCta.href} variant="outline" className="px-10 py-5">
                {vm.secondaryCta.label}
              </EditorialButton>
            </div>
          </div>

          <div className="order-1 flex justify-end lg:order-2 lg:col-span-5">
            <div className="group relative aspect-[4/5] w-full max-w-md overflow-hidden border border-hairline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vm.portrait.src}
                alt={vm.portrait.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>
      </Container>

      <Link
        href={vm.scrollCue.href}
        className="group absolute bottom-12 right-margin-desktop hidden items-center gap-4 md:flex"
      >
        <span className="font-body text-label-md uppercase tracking-widest transition-opacity group-hover:opacity-70">
          {vm.scrollCue.label}
        </span>
        <Icon name="arrow_forward" className="text-primary transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
