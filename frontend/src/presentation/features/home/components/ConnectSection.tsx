import type { ConnectVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";

/** Final CTA / connect block. Presentational. */
export function ConnectSection({ vm }: { vm: ConnectVm }) {
  return (
    <section id="connect" className="relative py-48 text-center">
      <Container size="full" className="relative z-10 space-y-12">
        <Eyebrow tracking="metadata-wide">{vm.eyebrow}</Eyebrow>
        <h2 className="mx-auto max-w-5xl font-display text-display-lg leading-none">{vm.heading}</h2>
        <div className="flex flex-col items-center gap-12 pt-12">
          <a
            href={`mailto:${vm.email}`}
            className="border-b border-primary pb-2 font-display text-headline-sm transition-opacity hover:opacity-50"
          >
            {vm.email}
          </a>
          <div className="flex gap-16">
            {vm.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="font-body text-label-md uppercase tracking-widest transition-colors hover:text-on-surface-variant"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
