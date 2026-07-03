import type { StorePageVm, StoreItemSpan } from "@application/view-models/store-page.vm";
import { cn } from "@lib/cn";
import { Container } from "@presentation/components/ui/Container";
import { Reveal } from "@presentation/components/ui/Reveal";
import { StoreProductCard } from "./StoreProductCard";

/** Column footprint per product span. */
const LAYOUT: Record<StoreItemSpan, string> = {
  half: "md:col-span-6",
  feature: "md:col-span-12 mt-16",
  third: "md:col-span-4",
};

/** Store product grid with a section header row. Presentational. */
export function ProductGrid({ section, products }: Pick<StorePageVm, "section" | "products">) {
  return (
    <section className="pb-48">
      <Container>
        <div className="grid grid-cols-1 gap-x-gutter gap-y-32 md:grid-cols-12">
          <div className="mb-8 md:col-span-12">
            <div className="flex items-end justify-between border-b border-hairline pb-4">
              <h2 className="font-display text-headline-md">{section.heading}</h2>
              <span className="font-body text-label-md uppercase tracking-widest text-on-surface-variant">
                {section.count}
              </span>
            </div>
          </div>

          {products.map((product) => (
            <Reveal key={product.id} className={cn("group", LAYOUT[product.span])}>
              <StoreProductCard vm={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
