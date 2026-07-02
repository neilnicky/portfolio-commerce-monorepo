/**
 * Admin access is enforced at the edge by Cloudflare Access (identity gate) and
 * re-verified by the backend on every admin request. This file holds any client-side
 * permission helpers used purely for UI affordances (never as a security boundary).
 */

export const isAdminPath = (pathname: string): boolean => pathname.startsWith("/admin");
