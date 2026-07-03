import type { WorksPageVm } from "@application/view-models/works-page.vm";

/** CONTENT LAYER — Works page. All copy + image URLs live here. */

const IMG = {
  landscape:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBh_9oRw7bPo-MlEUGUJbsCMI9WgUQDiHwSSsNwT1rrJdXfGtNxNJSAjL5dE3w_Rsi-vM7FVtsKn9emcszLlcQ04ODevYKWp8nelMPNO8dlzng5pNeEpP5OzVjwffxnxp-k8aNQUqyojOt0kqH7YFET15-gIHbsRcu9XbXh0s6qa1dAXNVl1mx3sqn5Ic-PjOpNPtfJS4jzZuq93dK-luv3YAuX38DwO7rvBhb_nYuLe4hq-mvXpCX2uqaKlbyfe95USVCZKPfwhHV5",
  portrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZr8ICT4l9q7uFJ7joarHbXODwfymoLV6VOWh0_0Pvv8qqiSZyuGwhG7Se_ckkxOZyVKNwxc1IbC8vErknw5ItSVhGEszv9pCDzWX3P0Wplueyu9730QAY-Ky0_rtfHcZVscytdMLJPqmNo5dGkQdH9dlQ-gt6LfvPhMfwmZkth3g8c8ASrZMXYYn05yoEVaMqfb1z73vjeA2JwIA6Y29QYlSeEDdEqUJEfh5m_wPuMaIL81vprCMuczp4zUzZHGiWBLpgY2G2bwH7",
} as const;

const WORKS: WorksPageVm = {
  header: {
    heading: "The Visual Narrative.",
    intro:
      "A curated anthology of frames, exploring the intersection of light, shadow, and human emotion through the lens of digital film and photography.",
  },
  categories: [
    { label: "All Projects", active: true },
    { label: "Commercial" },
    { label: "Digital Film" },
    { label: "Photoshoot" },
  ],
  items: [
    {
      span: "wide",
      work: {
        id: "silence-in-the-valley",
        title: "Silence in the Valley",
        meta: "Digital Film • 2024",
        imageSrc: IMG.landscape,
        imageAlt: "Cinematic Landscape",
      },
    },
    {
      span: "vertical",
      work: {
        id: "monochrome-shadows",
        title: "Monochrome Shadows",
        meta: "Photoshoot • 2023",
        imageSrc: IMG.portrait,
        imageAlt: "Fashion Editorial",
      },
    },
    {
      span: "horizontal",
      work: {
        id: "urban-noir",
        title: "Urban Noir: The Campaign",
        meta: "Commercial • 2024",
        imageSrc: IMG.landscape,
        imageAlt: "Commercial Frame",
      },
    },
    {
      span: "square-center",
      work: {
        id: "anatomy-of-light",
        title: "Anatomy of Light",
        meta: "Digital Film • 2023",
        imageSrc: IMG.portrait,
        imageAlt: "Portrait Study",
      },
    },
    {
      span: "thin-wide",
      work: {
        id: "long-road-home",
        title: "The Long Road Home",
        meta: "Commercial • 2024",
        role: "Director / Cinematographer",
        description:
          "An experimental journey through the outskirts of the city, captured during the blue hour to evoke a sense of longing and nostalgia.",
        imageSrc: IMG.landscape,
        imageAlt: "Cinematic Sequence",
      },
    },
  ],
  cta: {
    heading: "Let's craft your story.",
    button: { label: "Get in touch", href: "mailto:connect@midhunjraj.com" },
  },
};

export function getWorksContent(): WorksPageVm {
  return WORKS;
}
