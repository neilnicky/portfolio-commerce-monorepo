import type { PhilosophyTeaserVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { Divider } from "@presentation/components/ui/Divider";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Centred editorial pull-quote between the hero and the works preview. */
export function PhilosophyTeaser({ vm }: { vm: PhilosophyTeaserVm }) {
  return (
    <section id="philosophy" className="border-y border-hairline py-32">
      <Container size="full">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Eyebrow tracking="metadata" className="mb-8">
            {vm.eyebrow}
          </Eyebrow>
          <h2 className="mb-12 font-display text-headline-lg italic leading-tight">{vm.quote}</h2>
          <Divider className="mx-auto max-w-xs opacity-20" />
        </Reveal>
      </Container>
    </section>
  );
}
