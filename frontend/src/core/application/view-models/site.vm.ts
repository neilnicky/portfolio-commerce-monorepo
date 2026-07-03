/** Render-ready shapes for the site chrome (header/footer) — shared by every page. */

export interface NavLinkVm {
  label: string;
  href: string;
  /** Marks the entry as the active section/route (drawn with the underline treatment). */
  active?: boolean;
}

export interface SocialLinkVm {
  label: string;
  href: string;
}

export interface BrandVm {
  /** Wordmark shown in the header/footer. */
  name: string;
  href: string;
}

export interface SiteHeaderVm {
  brand: BrandVm;
  links: NavLinkVm[];
  /** Primary call-to-action button in the nav. */
  cta: NavLinkVm;
  /** When true the header renders the shopping-bag / cart affordance. */
  showCart?: boolean;
}

export interface SiteFooterVm {
  brand: BrandVm;
  copyright: string;
  social: SocialLinkVm[];
}
