import type { WorkVm } from "./work.vm";

/** Render-ready shapes for the home (single-scroll) page sections. */

export interface EyebrowHeadingVm {
  /** Small uppercase "film-slate" label above a heading. */
  eyebrow: string;
  heading: string;
  /** Optional supporting paragraph. */
  body?: string;
}

export interface HeroVm {
  name: string;
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  portrait: { src: string; alt: string };
  scrollCue: { label: string; href: string };
}

export interface PhilosophyTeaserVm {
  eyebrow: string;
  quote: string;
}

export interface SelectedWorksVm {
  eyebrow: string;
  heading: string;
  archiveCta: { label: string; href: string };
  works: WorkVm[];
}

/** The asymmetric "bento" editorial grid: one large lead frame + smaller tiles. */
export interface FeaturedGridVm {
  lead: {
    kicker: string;
    title: string;
    tag: string;
    imageSrc: string;
    imageAlt: string;
  };
  tiles: Array<{
    id: string;
    title: string;
    tag: string;
    imageSrc: string;
    imageAlt: string;
  }>;
}

export interface StorePreviewItemVm {
  id: string;
  /** Ghosted backdrop word shown behind the framed thumbnail. */
  backdropWord: string;
  title: string;
  description: string;
  price: string;
  cta: { label: string; href: string };
}

export interface StorePreviewVm {
  eyebrow: string;
  heading: string;
  body: string;
  items: StorePreviewItemVm[];
}

export interface ConnectVm {
  eyebrow: string;
  heading: string;
  email: string;
  social: Array<{ label: string; href: string }>;
}

export interface HomeVm {
  hero: HeroVm;
  philosophy: PhilosophyTeaserVm;
  selectedWorks: SelectedWorksVm;
  featured: FeaturedGridVm;
  store: StorePreviewVm;
  connect: ConnectVm;
}
