import Link from "next/link";
import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { EditorialButton } from "@presentation/components/ui/EditorialButton";

/** Closing CTA with contact-detail columns. Presentational. */
export function PhilosophyCta({ cta }: Pick<PhilosophyPageVm, "cta">) {
  return (
    <section id="contact" className="bg-surface-container-lowest py-48">
      <Container className="text-center">
        <h2 className="mb-12 font-display text-headline-lg-mobile text-primary md:text-headline-lg">
          {cta.headingLead}
          <br />
          <span className="font-medium italic">{cta.headingEmphasis}</span>
        </h2>
        <EditorialButton href={cta.button.href} variant="outline" className="px-12 py-5">
          {cta.button.label}
        </EditorialButton>

        <div className="mt-32 grid grid-cols-1 gap-gutter border-t border-hairline pt-16 text-left md:grid-cols-3">
          {cta.details.map((detail) => (
            <div key={detail.label}>
              <p className="mb-4 font-body text-label-md uppercase text-on-surface-variant">{detail.label}</p>
              {detail.value ? (
                <p className="font-body text-body-md text-primary">{detail.value}</p>
              ) : null}
              {detail.links ? (
                <div className="flex gap-6">
                  {detail.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="font-body text-body-md text-primary transition-opacity hover:opacity-60"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
