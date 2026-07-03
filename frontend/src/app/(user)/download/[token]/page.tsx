// Backend-dependent download flow — never prerendered.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

/** Download landing — the backend validates the token + serves the file from private R2. */
export default async function DownloadPage({ params }: PageProps) {
  const { token } = await params;
  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold">Your download</h1>
      <p className="mt-2 text-sm text-white/60">
        Links are valid for 24 hours. If yours has expired,{" "}
        <a href="/download/fresh-link" className="underline">
          request a fresh one
        </a>
        .
      </p>
      {/* TODO: trigger backend download for token={token} */}
    </section>
  );
}
