/** Render-ready shape for the Philosophy / About page. */

export interface PrincipleVm {
  title: string;
  body: string;
}

export interface ServiceVm {
  /** Material Symbols glyph name, e.g. "movie_filter". */
  icon: string;
  title: string;
  body: string;
  /** Two-digit index, e.g. "01". */
  index: string;
}

export interface ContactDetailVm {
  label: string;
  value?: string;
  links?: Array<{ label: string; href: string }>;
}

export interface PhilosophyPageVm {
  hero: {
    eyebrow: string;
    /** Heading split into lead + emphasised (italic) tail. */
    headingLead: string;
    headingEmphasis: string;
    portrait: { src: string; alt: string };
    captionLeft: string;
    captionRight: string;
  };
  ethos: {
    label: string;
    quote: string;
    principles: PrincipleVm[];
  };
  expertise: {
    eyebrow: string;
    heading: string;
    services: ServiceVm[];
  };
  cta: {
    headingLead: string;
    headingEmphasis: string;
    button: { label: string; href: string };
    details: ContactDetailVm[];
  };
}
