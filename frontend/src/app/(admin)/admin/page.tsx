// Backend-gated admin route — never prerendered.
export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-white/60">Manage your catalogue and orders.</p>
    </section>
  );
}
