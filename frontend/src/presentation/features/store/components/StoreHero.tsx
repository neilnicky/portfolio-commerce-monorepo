import type { StorePageVm } from "@application/view-models/store-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";

/** Store hero — "Steal My Stuff." Presentational. */
export function StoreHero({ hero }: Pick<StorePageVm, "hero">) {
  return (
    <section className="mb-32">
      <Container className="text-center md:text-left">
        <Eyebrow tracking="metadata" withLine className="mb-6 justify-center md:justify-start">
          {hero.eyebrow} 
        </Eyebrow>
        <h1 className="mb-8 max-w-4xl animate-rise font-display text-display-lg">{hero.heading}</h1>
        <p className="max-w-2xl animate-rise delay-1 font-body text-body-lg leading-relaxed text-on-surface-variant">
          {hero.intro}
        </p>
      </Container>
    </section>
  );
}
