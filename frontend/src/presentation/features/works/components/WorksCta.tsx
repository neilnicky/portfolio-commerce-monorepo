import type { WorksPageVm } from "@application/view-models/works-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { Divider } from "@presentation/components/ui/Divider";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Closing "let's craft your story" CTA. Presentational. */
export function WorksCta({ cta }: Pick<WorksPageVm, "cta">) {
  return (
    <Container className="mt-48 text-center">
      <Reveal>
        <Divider className="mb-24 opacity-20" />
        <h2 className="mb-12 font-display text-headline-lg md:text-display-lg">{cta.heading}</h2>
        <EditorialButton href={cta.button.href} variant="outline" className="px-12 py-5 tracking-[0.2em]">
          {cta.button.label}
        </EditorialButton>
      </Reveal>
    </Container>
  );
}
