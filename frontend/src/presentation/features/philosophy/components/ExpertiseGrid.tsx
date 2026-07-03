import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { Reveal } from "@presentation/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";

/** Expertise bento grid (3-up). Presentational. */
export function ExpertiseGrid({ expertise }: Pick<PhilosophyPageVm, "expertise">) {
  return (
    <section className="border-t border-hairline py-32">
      <Container>
        <div className="mb-20">
          <Eyebrow className="mb-4">{expertise.eyebrow}</Eyebrow>
          <p className="font-display text-headline-lg text-primary">{expertise.heading}</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {expertise.services.map((service, i) => (
            <Reveal key={service.index} delay={i * 120}>
              <ServiceCard vm={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
