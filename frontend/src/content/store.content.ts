import type { StorePageVm } from "@application/view-models/store-page.vm";

/** CONTENT LAYER — Store ("Steal My Stuff") page. All copy, images + prices here. */

const IMG = {
  noir: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs7Ey0zSIebA3BzysO7uCm5U6Rtb8QK_w0stIHm_hB_snHoSQoD75P7gS5kIEUBd-ORNwaJZfbRTN7KEiP9qmr97XdP6TlrtutGTpB1bCLcQX9UO8beZauzoQHxb60ZscZLvplFjaiv6hqkZKFVwmYKMnpdh3reJslSzjUcXOJlAWs9Rua9h7zr-fuTLBgohN-wU6VdLJNA-Ksq_tYKEYFIgt0KRibWJ1mxOz4IGtGYmM9jCLIJSjrj6zfhd2B27tW2VzwWhkKx7K9",
  anamorphic:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDNYKt0Y-Dn9uPa0KwRtZ4aV3V0LvYZs3meTt9nwM4aUVTl1io_MlySJf9fk-D0Bt9l3pr8TnURE7LDsjUPOrbeFNyCS1NG1JqKxukSCsSy_T7qAebbITxEyX6jQcCIMJ_aVNQzOLe8WXwge-4iq2itGToS-CZ00UX8jt29hDtygncDuz7xs-1yR8nYJv2LQ_22IxG6rD3Jp0Dh8svc4k-uMSDjJA6sVU2QTzBhc4g4tVJBInweqSYpcYpCxZkWjo6ceSOr3-woI3Ti",
  guide:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCI8NbWNRgihgVoDXwd7UDQsByFVVc7u8nQtomViuR_dOcglKzF4sM_qJ_KjPZptnBmu06m1f1SlKw97Xe1ksmnNjSHtB7H53SOq__7w0Uif6wwoh06R1PYtj09z9yF0MdBmgPDaDeSZld5O71vww4jmlTbiOLShhXef36tt0GsRhvqBu8TsgxeJyjSxcv6SQ8jyK9PKD2KkJccDtsmM3lDbrma4L17MHV-m0rtG9AfJo_JFa5H-BcJ67Ymn-KtNS0fNgulkA82Ab9i",
  blueprint:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCxbJXpclHeXw7jMAzb0O6zxN2rlk8OUO297gjE-iiVipvp_ShPcG7SnOSp4rMNJGflAgVPB0RT19Kcu4CuPvRgPAQA_80NH8oZ3nrb3dqT0ZO9fK8ns2Pm0Ot5Cmkc4kSNZtPpNomfy2vthPwlA6O5SBRaJbJKI8SO9iQgYJpyafNwhz3ywIIy1Gec2vEqOH_I8ZZP9-dSrC44tG1hjNI-FBIRN3aaeWWo35--D0Wj7jZMMwEySYGM7Hipmhmoef2grnsmR9mMWthd",
  grain:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKWb4v3S4z_ur__EnKAMRVKzRT57EZ5jXS5S1L_4PlRHn_N7dTKBjtdPrF75bhbXJveZuq-7waUn4Mdj0NdZx9h31EAtA0r7qGZVqPaTWbbC8H_1dxWxd569hWxuhJhX7uysniyYb0BUN6UBgIfrskXzr72AN4A3rk-E6Xm2GYyHA3US1wUPDy6jhL4rkPuqaJg4cLLTRIvalUZbv6M-uxSe3EdDKAvEZQYs-ZlySPgQfcBUe8uG2xf6M-ZtRisF-GXlBdynchIN6-",
  lightLeaks:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAq_-o64BG_kWpw4oMq-YYbD0cjSKjhdFzB8pHNTG-AqVHMekFskhnMBPZ8q4D_mrqI4auZ1BY3T166DcKZpqp7ul0s3U8CJr1qWCdD3KIPmCui-6EvueLsf_c9HMdK34aDZ5KvqsPcAeMzroj0yOo3oGuLZU6OibP3BcC1yHDzA3HnRrIM35hO0lGj_rtK50xOGXTG0EWEiaZbBoWAa5sjgrXgah8IfTtOZDIFrUkM3a8dfQhQ4TayyDzLwi6YdCVgGmr1pWdF8Rpj",
} as const;

const STORE: StorePageVm = {
  hero: {
    eyebrow: "Digital Atelier",
    heading: "Steal My Stuff.",
    intro:
      "A curated collection of post-production assets, presets, and creative templates forged in the fires of real-world commercial production. Professional tools for the visual auteur.",
  },
  section: { heading: "Color Science", count: "03 Packs" },
  products: [
    {
      id: "noir-film-collection",
      span: "half",
      title: "Noir Film Collection",
      description: "12 Lightroom & Capture One styles inspired by 1950s French Cinema.",
      price: "$49",
      imageSrc: IMG.noir,
      imageAlt: "High-contrast black and white architectural photograph, film noir aesthetic.",
      cta: "Purchase Asset",
    },
    {
      id: "anamorphic-lut-pack",
      span: "half",
      title: "Anamorphic LUT Pack",
      description: "Log-to-Rec709 conversion and creative grades for Davinci Resolve.",
      price: "$65",
      imageSrc: IMG.anamorphic,
      imageAlt: "Cinematic 2.35:1 neon-lit urban street with teal-orange grading.",
      cta: "Purchase Asset",
    },
    {
      id: "visual-poetics-guide",
      span: "feature",
      eyebrow: "Best Seller",
      title: "The Visual Poetics Guide.",
      description:
        "A 140-page digital manual on composition, color theory, and the psychology of framing in modern commercial photography.",
      price: "$89",
      imageSrc: IMG.guide,
      imageAlt: "High-end hardcover art book with minimalist typography on a dark desk.",
      cta: "Get the Guide — $89",
      secondaryCta: { label: "Preview Chapter", href: "#" },
    },
    {
      id: "portfolio-blueprint",
      span: "third",
      title: "Portfolio Blueprint",
      description: "",
      metaLine: "Figma Template • $35",
      price: "$35",
      imageSrc: IMG.blueprint,
      imageAlt: "Minimalist portfolio UI kit on a tablet in a dark studio.",
      cta: "Add to Cart",
    },
    {
      id: "organic-grain-4k",
      span: "third",
      title: "Organic Grain 4K",
      description: "",
      metaLine: "Video Overlay • $29",
      price: "$29",
      imageSrc: IMG.grain,
      imageAlt: "Macro of analog 35mm film grain and dust textures on black.",
      cta: "Add to Cart",
    },
    {
      id: "vintage-light-leaks",
      span: "third",
      title: "Vintage Light Leaks",
      description: "",
      metaLine: "Photoshop Brush • $15",
      price: "$15",
      imageSrc: IMG.lightLeaks,
      imageAlt: "Warm amber and soft red light-leak textures on a moody background.",
      cta: "Add to Cart",
    },
  ],
  newsletter: {
    heading: "Join the Process.",
    body: "Subscribe to receive early access to new digital drops, exclusive tutorials, and behind-the-scenes insights into my creative workflow.",
    placeholder: "YOUR EMAIL ADDRESS",
    submitLabel: "Subscribe",
  },
};

export function getStoreContent(): StorePageVm {
  return STORE;
}
