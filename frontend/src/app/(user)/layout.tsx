import type { PropsWithChildren } from "react";

/**
 * `(user)` route group (no URL segment). Each portfolio page composes its own
 * chrome via `SiteShell` (header/footer vary by active section), so this layout
 * is a structural pass-through.
 */
export default function UserLayout({ children }: PropsWithChildren) {
  return children;
}
