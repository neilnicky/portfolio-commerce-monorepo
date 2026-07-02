import type { PropsWithChildren } from "react";
import Link from "next/link";

/**
 * Admin shell. Lives at /admin, behind Cloudflare Access (identity gate). The backend
 * independently re-verifies that protection on every admin request.
 */
export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl gap-8 px-6 py-8">
      <aside className="w-48 shrink-0">
        <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-white/50">Admin</p>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
