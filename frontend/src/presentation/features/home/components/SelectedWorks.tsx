import type { SelectedWorksVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { Reveal } from "@presentation/components/ui/Reveal";
import { WorkPreviewCard } from "./WorkPreviewCard";

/** "Selected Works" preview grid (2-up). Presentational. */
export function SelectedWorks({ vm }: { vm: SelectedWorksVm }) {
  return (
    <section id="work" className="bg-surface-container-lowest py-32">
      <Container size="full">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <Eyebrow tracking="metadata" className="mb-4">
              {vm.eyebrow}
            </Eyebrow>
            <h2 className="font-display text-headline-lg">{vm.heading}</h2>
          </div>
          <EditorialButton href={vm.archiveCta.href} variant="link">
            {vm.archiveCta.label}
          </EditorialButton>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {vm.works.map((work, i) => (
            <Reveal key={work.id} delay={i * 200}>
              <WorkPreviewCard vm={work} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
