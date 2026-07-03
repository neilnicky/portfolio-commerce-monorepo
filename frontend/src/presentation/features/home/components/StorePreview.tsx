import type { StorePreviewVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { Reveal } from "@presentation/components/ui/Reveal";
import { StorePreviewCard } from "./StorePreviewCard";

/** "Steal My Stuff" marketplace teaser (3-up). Presentational. */
export function StorePreview({ vm }: { vm: StorePreviewVm }) {
  return (
    <section id="store" className="border-t border-hairline bg-surface-container-low py-32">
      <Container size="full">
        <div className="mb-16">
          <Eyebrow tracking="metadata" className="mb-4">
            {vm.eyebrow}
          </Eyebrow>
          <h2 className="font-display text-headline-lg">{vm.heading}</h2>
          <p className="mt-4 max-w-2xl font-body text-body-lg text-on-surface-variant">{vm.body}</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {vm.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 150}>
              <StorePreviewCard vm={item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
