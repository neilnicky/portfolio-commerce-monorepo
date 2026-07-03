// Backend-dependent download flow — never prerendered.
export const dynamic = "force-dynamic";

/** Request + verify a one-time code → fresh download link. Code goes only to email on record. */
export default function FreshLinkPage() {
  return (
    <section className="max-w-md">
      <h1 className="text-2xl font-semibold">Request a fresh link</h1>
      <p className="mt-2 text-sm text-white/60">
        Enter the email used at purchase. We’ll send a one-time code.
      </p>
      {/* TODO: <FreshLinkContainer /> — RHF + Zod form (request → verify) */}
    </section>
  );
}
