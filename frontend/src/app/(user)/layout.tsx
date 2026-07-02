import type { PropsWithChildren } from "react";
import Link from "next/link";

/** Public marketing shell. URL stays at `/` — `(user)` is a route group (no URL segment). */
export default function UserLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="font-semibold tracking-tight">
          Midhun Raj
        </Link>
        <nav className="flex gap-6 text-sm text-white/70">
          <Link href="/products">Digital Products</Link>
          <Link href="/#contact">Connect</Link>
        </nav>
      </header>
      <main className="flex-1 py-8">{children}</main>
      <footer className="py-8 text-xs text-white/40">© Midhun Raj</footer>
    </div>
  );
}
