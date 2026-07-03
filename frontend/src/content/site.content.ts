import type { SiteHeaderVm, SiteFooterVm, SocialLinkVm } from "@application/view-models/site.vm";

/**
 * CONTENT LAYER — site chrome.
 * Single source of truth for the header/footer copy + links. Swap the bodies of
 * these getters for a CMS/backend fetch later without touching a component.
 */

export type ActiveSection = "home" | "works" | "philosophy" | "store" | "connect";

const BRAND = { name: "MIDHUN J RAJ", href: "/" } as const;

const NAV = [
  { label: "Works", href: "/works", key: "works" },
  { label: "Philosophy", href: "/philosophy", key: "philosophy" },
  { label: "Store", href: "/store", key: "store" },
] as const;

const CONNECT_CTA = { label: "Connect", href: "/#connect" } as const;

const SOCIAL: SocialLinkVm[] = [
  { label: "Instagram", href: "#" },
  { label: "Vimeo", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Privacy", href: "#" },
];

export function getSiteHeader(active: ActiveSection): SiteHeaderVm {
  return {
    brand: { ...BRAND },
    links: NAV.map((item) => ({
      label: item.label,
      href: item.href,
      active: item.key === active,
    })),
    cta: { ...CONNECT_CTA, active: active === "connect" },
    showCart: active === "store",
  };
}

export function getSiteFooter(): SiteFooterVm {
  return {
    brand: { ...BRAND },
    copyright: "© 2024 MIDHUN J RAJ. ALL RIGHTS RESERVED.",
    social: SOCIAL.map((s) => ({ ...s })),
  };
}
