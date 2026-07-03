/** Render-ready shapes for the Store ("Steal My Stuff") page. */

/** Layout footprint for a product inside the store grid. */
export type StoreItemSpan = "half" | "feature" | "third";

export interface StoreProductVm {
  id: string;
  title: string;
  description: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  /** Primary action label; the store keeps cart behaviour in an island. */
  cta: string;
  span: StoreItemSpan;
  /** Optional eyebrow (e.g. "Best Seller") shown on the feature card. */
  eyebrow?: string;
  /** Optional secondary link (e.g. "Preview Chapter") on the feature card. */
  secondaryCta?: { label: string; href: string };
  /** Compact cards (span "third") show meta as a single uppercase line. */
  metaLine?: string;
}

export interface StorePageVm {
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  section: {
    heading: string;
    count: string;
  };
  products: StoreProductVm[];
  newsletter: {
    heading: string;
    body: string;
    placeholder: string;
    submitLabel: string;
  };
}
