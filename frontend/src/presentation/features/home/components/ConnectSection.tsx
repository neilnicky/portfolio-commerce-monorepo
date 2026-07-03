import type { ConnectVm } from "@application/view-models/home.vm";
import { Container } from "@presentation/components/ui/Container";
import { Eyebrow } from "@presentation/components/ui/Eyebrow";
import { Reveal } from "@presentation/components/ui/Reveal";

/** Final CTA / connect block. Presentational. */
export function ConnectSection({ vm }: { vm: ConnectVm }) {
  return (
    <section id="connect" className="relative overflow-hidden py-48 text-center">
      {/* Slow ambient glow — closing the page with quiet motion. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-primary/5 blur-[130px]"
      />
      <Container size="full" className="relative z-10 space-y-12">
        <Reveal className="space-y-12">
          <Eyebrow tracking="metadata-wide" className="inline-block">
            {vm.eyebrow}
          </Eyebrow>
          <h2 className="mx-auto max-w-5xl font-display text-display-lg leading-none">{vm.heading}</h2>
        </Reveal>
        <div className="flex flex-col items-center gap-12 pt-12">
          <a
            href={`mailto:${vm.email}`}
            className="border-b border-primary pb-2 font-display text-headline-sm transition-all duration-300 hover:-translate-y-0.5 hover:opacity-60"
          >
            {vm.email}
          </a>
          <div className="flex gap-16">
            {vm.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="link-underline font-body text-label-md uppercase tracking-widest transition-colors hover:text-primary"
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
