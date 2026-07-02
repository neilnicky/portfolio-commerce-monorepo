import Link from "next/link";
import { getServerContainer } from "@infrastructure/cloudflare/context";
import { ProductList } from "@presentation/features/product/components/ProductList";
import { Button } from "@presentation/components/ui/Button";

// SSR — live backend data behind Cloudflare Access; never prerendered.
export const dynamic = "force-dynamic";

/** Admin catalogue — list (incl. unpublished); create / edit / reorder / remove. */
export default async function AdminProductsPage() {
  const container = getServerContainer();
  const page = await container.queries.listProducts.execute({ publishedOnly: false });
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/products/new">
          <Button>New product</Button>
        </Link>
      </div>
      <ProductList items={page.items} />
    </section>
  );
}
