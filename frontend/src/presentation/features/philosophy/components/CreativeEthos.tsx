import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Sticky-label ethos section: pull-quote + principles. Presentational. */
export function CreativeEthos({ ethos }: Pick<PhilosophyPageVm, "ethos">) {
  return (
    <section className="bg-surface-container-lowest py-32">
      <Container>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-4">
            <h2 className="sticky top-32 font-body text-label-md uppercase tracking-widest text-primary">
              {ethos.label}
            </h2>
          </div>

          <div className="col-span-12 md:col-span-8">
            <p className="mb-16 font-display text-headline-md leading-tight text-primary">{ethos.quote}</p>
            <div className="space-y-12">
              {ethos.principles.map((p) => (
                <Reveal key={p.title}>
                  <h3 className="mb-4 font-display text-headline-sm text-primary">{p.title}</h3>
                  <p className="max-w-2xl font-body text-body-lg text-on-surface-variant">{p.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
