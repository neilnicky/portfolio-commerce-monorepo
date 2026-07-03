import type { ReactNode } from "react";
import { getSiteHeader, getSiteFooter, type ActiveSection } from "@/content/site.content";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * Structural shell: sticky header + footer around a page's main content.
 * Resolves the site-wide chrome content (global config, not feature data) and
 * marks the active nav entry.
 */
export function SiteShell({
  active,
  children,
}: {
  active: ActiveSection;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader vm={getSiteHeader(active)} />
      <main>{children}</main>
      <SiteFooter vm={getSiteFooter()} />
    </>
  );
}
