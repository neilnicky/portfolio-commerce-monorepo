import { getServerContainer } from "@infrastructure/cloudflare/context";
import { Button } from "@presentation/components/ui/Button";

// SSR — live backend data; never prerendered.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Product detail + buy entry point. */
export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const container = getServerContainer();
  const vm = await container.queries.getProduct.execute(id);
  return (
    <article className="max-w-2xl">
      <h1 className="text-3xl font-semibold">{vm.title}</h1>
      <p className="mt-4 text-white/70">{vm.description}</p>
      <p className="mt-6 text-xl font-semibold">{vm.priceText}</p>
      <Button className="mt-6">Buy now</Button>
    </article>
  );
}
