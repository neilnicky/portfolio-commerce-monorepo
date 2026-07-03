import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";

/** Philosophy hero — eyebrow, split heading, portrait with caption bar. Presentational. */
export function PhilosophyHero({ hero }: Pick<PhilosophyPageVm, "hero">) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-32">
      <Container>
        <div className="grid grid-cols-12 items-center gap-gutter">
          <div className="z-10 col-span-12 md:col-span-7">
            <Eyebrow withLine className="mb-6">{hero.eyebrow}</Eyebrow>
            <h1 className="mb-12 font-display text-headline-lg-mobile text-primary md:text-display-lg">
              <span className="inline-block animate-rise">{hero.headingLead}</span>
              <br />
              <span className="inline-block animate-rise delay-2 font-medium italic">
                {hero.headingEmphasis}
              </span>
            </h1>
          </div>

          <div className="group col-span-12 mt-12 animate-clip-reveal md:col-span-10 md:col-start-3 md:-mt-12">
            <div className="relative aspect-[1.28] w-full overflow-hidden bg-surface-container grayscale transition-all duration-700 ease-in-out hover:grayscale-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-cinematic group-hover:scale-105"
              />
              <span className="sheen absolute inset-0 overflow-hidden" aria-hidden />
            </div>
            <div className="mt-6 flex items-start justify-between border-t border-hairline pt-4">
              <p className="font-body text-label-md uppercase text-on-surface-variant">{hero.captionLeft}</p>
              <p className="font-body text-label-md uppercase text-on-surface-variant">{hero.captionRight}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
