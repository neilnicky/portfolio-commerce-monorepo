// Backend-dependent checkout flow — never prerendered.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * Confirmation screen — waits for payment capture. A client container (not yet wired)
 * polls `getOrderStatus` until fulfilled, then reveals the download link.
 */
export default async function CheckoutPage({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold">Completing your purchase…</h1>
      <p className="mt-2 text-sm text-white/60">Order {orderId}</p>
      {/* TODO: <OrderStatusContainer orderId={orderId} /> — polls + shows the link */}
    </section>
  );
}
