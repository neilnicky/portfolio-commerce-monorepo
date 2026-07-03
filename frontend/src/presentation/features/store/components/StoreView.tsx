import type { StorePageVm } from "@application/view-models/store-page.vm";
import { StoreHero } from "./StoreHero";
import { ProductGrid } from "./ProductGrid";
import { NewsletterSection } from "./NewsletterSection";

/** Store page composition. Pure — receives the page ViewModel. */
export function StoreView({ vm }: { vm: StorePageVm }) {
  return (
    <div className="pt-16">
      <StoreHero hero={vm.hero} />
      <ProductGrid section={vm.section} products={vm.products} />
      <NewsletterSection newsletter={vm.newsletter} />
    </div>
  );
}
