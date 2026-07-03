import type { StorePageVm } from "@application/view-models/store-page.vm";
import { Container } from "@presentation/components/ui/Container";
import { NewsletterForm } from "./NewsletterForm";

/** "Join the Process" newsletter section. Presentational shell + form island. */
export function NewsletterSection({ newsletter }: Pick<StorePageVm, "newsletter">) {
  return (
    <section className="border-t border-hairline bg-surface-container-lowest py-32">
      <Container className="flex flex-col items-center text-center">
        <h2 className="mb-6 font-display text-headline-lg">{newsletter.heading}</h2>
        <p className="mb-12 max-w-lg font-body text-body-md text-on-surface-variant">{newsletter.body}</p>
        <NewsletterForm vm={newsletter} />
      </Container>
    </section>
  );
}
