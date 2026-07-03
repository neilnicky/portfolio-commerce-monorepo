import type { HomeVm } from "@application/view-models/home.vm";

/** CONTENT LAYER — Home page. All copy, image URLs and prices live here. */

const IMG = {
  heroPortrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0omwPXnOya2XLWiQoXaWU1GXNjRoPPLBt92za4fpL0dd1uE6mhJ-eSPqVk9J37n3UJNiwgMX0rEjxudDG7jj0-csTTGFtopqirne3GMPPypojTxLns3tg2VbG42d2PojYJXtQLUZm78a2ROYtd5N5i1DImOygim5WQb-NxHtdLShrYgh3dtL4g19gQn_jlQWCxdmeW-KaCrUmvBUWA3S2M4G2430yozHPhTWn2FyB_6CQ1xv2chthYkVahw364UBbjvKRPyuu6_En",
  work1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAX2HliYEQRY8KbNv7eqPmgPc4CpSPr6Sz8ROVD5Q9Qr8rLEZbE_7t_0ikCwGSCS4mhWoJst378noC45yK-dIS_fhStl5lv3wFhmoBjBIgnC80V_HwiULm_gp8RpjPGBxIvZ3XOPrKbeYj7MJ2GsP4gIhZAQQ6J_tLA2PaTSHyHDMGIFayaRkpl44i0VudUVSgBXJP8SR99wY58cqkWfCBYfz_YrthLbSyaDV6MDhlWktsH45lpIJT9WWybGypizMBaAnemjw2OyVW2",
  work2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBNdaFzYt9AjmYLIE45_IkymtrzSYYqbNICigGRTsN90h7wL_B6MrxJLLl8YAFBkZre0cnUVHCxXdfzE8Dcu4wBuc4OHmx2mY9D0PISDKyjPH5ORyOxxNZlysIJYROjMwVOmlWapgZmVfwNeiaK2GH1ZV-7Q439GtX9MhlAoa3HSZcEFWFtIW4hmOwqaDmCpMOuFJVaLGZEYXdK4QdLDCzuVtaAOqJmjbMt5C-N-WJfkFfmS7u8IubPA5APeFc0F15h9K_ybxSVSeEJ",
  featuredLead:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCPXxkSxZDTztW5U-XRdTNtBOBXsXu1zD8VLvtgY4lBnshobHoiGO58aVf5p97Ql0Qkzw2RXbCvwnhiI0vlZ0M2LoFHIwf-pFPLybCz_YV05IWsFoC_5KbC5_4MGX3ZbEEdImQ2iPlllJp6dk1rtUnPWTSkpf1Rpw6Ah_cLG1qZr2lTjOYZ6Wi5-yB2HQH983Sx1o0gxxgVttmVF_5LqbOocPztijWh6vqvPUyEhNsyDYHAxw4s03X1AG_zUQkdqcdTIlZd_M-WZU_l",
  featuredTile1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPGhb2f3R1qwSlAUWA76QYI5DhhDcqZTZp1pzrwH2Jfos8UbX86GJgTbiRVKXHqn5ozyrGMK7kknW67nqxOM6nswQmJ-ZrriEZOcnKboG_F9zRO5NjH4HTMNSVJ97BX9-lPR4rokOLCWhGn7CgHwe4BgnrQ1k3OlIOBHokpjBG4s-TglcvRUVwzPNt_KgmBefDKUAVkVmFlSAUJB0afv4b6PIXaB3G5qoM0DskG1W9qnvaqZNXHAKXJsM_bFLj5dp-IFam-EHEx8fN",
  featuredTile2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAWeOXqojc_HDhLeTwVB3c-4lwaAG9ZbeVufK4V9dqlWn5N7DtyCSEFM1ylk9_btF2rFaEvH4DDYp7CmP9gCeWgXTR9ERFv-39AP3H_JEml76J9Ou7w4KRDfjD3fJ7WoPxuVsbU9otDupaAlgYd6xO3mNiobcq0MeX9jwt0C2PbJMBaO2jA8HDQ6x95aK_ufkY0aP8k_skpn15-t_LMEAU3zavDl2b9UvNDcitgFis6gJjFhvUx40Icdrw8kN5WW3ej9aw58r52gbIy",
} as const;

const HOME: HomeVm = {
  hero: {
    name: "Midhun J Raj",
    intro:
      "I make concepts & films for brands. Based in Kerala. Working with brands that want to be remembered—not just seen.",
    primaryCta: { label: "See My Work", href: "/works" },
    secondaryCta: { label: "Steal My Stuff", href: "/store" },
    portrait: { src: IMG.heroPortrait, alt: "Midhun J Raj Cinematic Portrait" },
    scrollCue: { label: "Let's Connect", href: "#connect" },
  },
  philosophy: {
    eyebrow: "The Philosophy",
    quote: '"Creating cinematic brand experiences that people remember."',
  },
  selectedWorks: {
    eyebrow: "Portfolio",
    heading: "Selected Works",
    archiveCta: { label: "View All Archive", href: "/works" },
    works: [
      {
        id: "creative-blind-spot",
        title: "The Creative Blind Spot",
        meta: "Documentary Short • 2024",
        imageSrc: IMG.work1,
        imageAlt: "Cinematic Film Preview 1",
        href: "/works",
      },
      {
        id: "4th-dimension",
        title: "4th Dimension",
        meta: "Brand Narrative • 2023",
        imageSrc: IMG.work2,
        imageAlt: "Cinematic Film Preview 2",
        href: "/works",
      },
    ],
  },
  featured: {
    lead: {
      kicker: "Arabian Gold",
      title: "Timeless Legacy",
      tag: "Commercial",
      imageSrc: IMG.featuredLead,
      imageAlt:
        "A cinematic wide shot of a high-end luxury brand commercial, moody dramatic lighting with deep shadows and soft highlights.",
    },
    tiles: [
      {
        id: "rixo-shoot",
        title: "RIXO Shoot",
        tag: "Fashion",
        imageSrc: IMG.featuredTile1,
        imageAlt:
          "A portrait-style cinematic frame of a fashion model in a minimalistic setting, soft diffused lighting.",
      },
      {
        id: "sithara-silks",
        title: "Sithara Silks",
        tag: "Cultural",
        imageSrc: IMG.featuredTile2,
        imageAlt:
          "An abstract cinematic close-up of traditional silk textures being draped, rhythmic shadows and highlights.",
      },
    ],
  },
  store: {
    eyebrow: "Marketplace",
    heading: "Steal My Stuff",
    body: "Digital assets and creative tools forged in the fires of real commercial projects.",
    items: [
      {
        id: "cine-log-lut",
        backdropWord: "FILM LOOKS",
        title: "Cine-Log LUT Pack v.02",
        description: "My personal color grading kit for high-end brand narratives.",
        price: "$49",
        cta: { label: "Add To Cart", href: "/store" },
      },
      {
        id: "narrative-presets",
        backdropWord: "GRANULAR",
        title: "The Narrative Presets",
        description: "Editorial Lightroom presets for storytelling photography.",
        price: "$35",
        cta: { label: "Add To Cart", href: "/store" },
      },
      {
        id: "brand-concept-guide",
        backdropWord: "STRATEGY",
        title: "Brand Concept Guide",
        description: "The PDF framework I use for creative pitching.",
        price: "$19",
        cta: { label: "Add To Cart", href: "/store" },
      },
    ],
  },
  connect: {
    eyebrow: "Let's build something",
    heading: "Worth Remembering.",
    email: "hello@midhunjraj.com",
    social: [
      { label: "Instagram", href: "#" },
      { label: "Vimeo", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
};

export function getHomeContent(): HomeVm {
  return HOME;
}
