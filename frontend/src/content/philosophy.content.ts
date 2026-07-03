import type { PhilosophyPageVm } from "@application/view-models/philosophy-page.vm";

/** CONTENT LAYER — Philosophy / About page. All copy + image URLs live here. */

const PORTRAIT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAT8kdav1hYwIVq_o8umKUkycgdLmZtCDhhp2lINo2AGDpyAygZEs6MlazO2VrvAJ9KnW4QcDgzSM1Bi10_uUNXnyY4QNtoSqhyxXpoBnSC7o7w_PGlQmQiThcHZVHZwq71Bp0czKXumDNDqpPTRPWJvZDZVduoFWn4p20rVxonstYCOSGvySZKwoOzeKyHSZCCNekQAyUrijjjL3B_lYS-BuKR7q9I0TcjrvL5NdaQ1yc2Czr_n0qAGhiBfVIzmH1OvKcejiXGY-Y";

const PHILOSOPHY: PhilosophyPageVm = {
  hero: {
    eyebrow: "The Auteur",
    headingLead: "Visualizing the",
    headingEmphasis: "Unseen Frame.",
    portrait: { src: PORTRAIT, alt: "MIDHUN J RAJ Portrait" },
    captionLeft: "Director & Cinematographer",
    captionRight: "Based in Kochi / Global",
  },
  ethos: {
    label: "Creative Ethos",
    quote:
      "“Creating cinematic brand experiences that people remember. It’s about more than the image; it’s about the resonance left in the silence after the screen goes dark.”",
    principles: [
      {
        title: "Intentionality",
        body: "Every frame is a choice. Every shadow serves the narrative. I believe in the power of precision and the beauty of restraint. In an age of visual noise, quiet confidence is the ultimate luxury.",
      },
      {
        title: "Atmospheric Narrative",
        body: "I craft worlds where light and texture tell the story as much as the talent. My work bridges the gap between high-fashion aesthetics and raw, human emotion.",
      },
    ],
  },
  expertise: {
    eyebrow: "Expertise",
    heading: "Sculpting Vision.",
    services: [
      {
        icon: "movie_filter",
        title: "Commercials",
        body: "High-fidelity visual storytelling for luxury and lifestyle brands that demand a premium cinematic presence.",
        index: "01",
      },
      {
        icon: "lightbulb",
        title: "Brand Concepts",
        body: "Developing the visual DNA of a brand from the ground up, ensuring a cohesive and sophisticated aesthetic language.",
        index: "02",
      },
      {
        icon: "video_library",
        title: "Digital Films",
        body: "Elevated content for the digital landscape, optimized for modern distribution without sacrificing cinematic integrity.",
        index: "03",
      },
    ],
  },
  cta: {
    headingLead: "Let's create something",
    headingEmphasis: "unforgettable.",
    button: { label: "Start a Conversation", href: "mailto:hello@midhunjraj.com" },
    details: [
      { label: "Inquiries", value: "hello@midhunjraj.com" },
      { label: "Studio", value: "Kochi, Kerala, India" },
      {
        label: "Social",
        links: [
          { label: "Instagram", href: "#" },
          { label: "Vimeo", href: "#" },
        ],
      },
    ],
  },
};

export function getPhilosophyContent(): PhilosophyPageVm {
  return PHILOSOPHY;
}
