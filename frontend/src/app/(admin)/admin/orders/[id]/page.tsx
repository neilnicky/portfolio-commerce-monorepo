// Backend-gated admin route — never prerendered.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Order detail + manual grant-access (same issue-and-email path as a normal sale). */
export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold">Order {id}</h1>
      {/* TODO: order detail + <GrantAccessButton orderId={id} /> */}
    </section>
  );
}
