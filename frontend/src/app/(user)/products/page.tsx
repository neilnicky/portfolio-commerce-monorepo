import { getServerContainer } from "@infrastructure/cloudflare/context";
import { ProductList } from "@presentation/features/product/components/ProductList";

// SSR — reads live data from the backend via Cloudflare bindings; never prerendered.
export const dynamic = "force-dynamic";

/** RSC: run the query use-case on the Worker, hand a ViewModel to the feature view. */
export default async function ProductsPage() {
  const container = getServerContainer();
  const page = await container.queries.listProducts.execute({ publishedOnly: true });
  return (
    <section>
      <h1 className="mb-8 text-3xl font-semibold">Digital Products</h1>
      <ProductList items={page.items} />
    </section>
  );
}
