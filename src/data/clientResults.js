// src/data/clientResults.js — Proof / results content
// Safe content types: editorial installs, styling versatility, real-world looks.
// No fabricated reviews, fabricated testimonials, or invented quotes.
//
// Fields:
//   id          — unique identifier
//   type        — "install" | "editorial" | "versatility" | "style"
//   image       — path to image
//   caption     — editorial-safe descriptive caption (no claims, no fake attribution)
//   category    — display category label
//   product     — optional { name, slug } reference to a product
//   styleNote   — optional one-line style detail (texture, density, length)
//   tags        — optional array of labels for filtering (e.g. ["Straight", "HD Lace"])

export const clientResults = [
  {
    id: "cr-01",
    type: "editorial",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_02.webp",
    caption: "Straight texture, 22\", 180% density. HD lace. Clean install, understated styling.",
    category: "Editorial",
    styleNote: "Straight · 22\" · HD Lace",
    tags: ["Straight", "HD Lace", "Everyday"],
  },
  {
    id: "cr-02",
    type: "versatility",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_04.webp",
    caption: "Body wave texture worn sleek — demonstrating the versatility of a single unit styled two ways.",
    category: "Versatility",
    styleNote: "Body Wave · 20\" · Transparent Lace",
    tags: ["Body Wave", "Transparent Lace", "Versatility"],
  },
  {
    id: "cr-03",
    type: "editorial",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_08.webp",
    caption: "Deep wave texture, 24\", 200% density. Full, defined movement under natural light.",
    category: "Editorial",
    styleNote: "Deep Wave · 24\" · HD Lace",
    tags: ["Deep Wave", "HD Lace", "Full Density"],
  },
  {
    id: "cr-04",
    type: "style",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_10.webp",
    caption: "Loose wave at shoulder length — a daily-wear-friendly install with lasting shape.",
    category: "Daily Wear",
    styleNote: "Loose Wave · 18\" · Transparent Lace",
    tags: ["Loose Wave", "Transparent Lace", "Everyday"],
  },
  {
    id: "cr-05",
    type: "install",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_11.webp",
    caption: "Straight texture laid flat against the hairline. Minimal glue, clean parting.",
    category: "Install",
    styleNote: "Straight · 20\" · HD Lace",
    tags: ["Straight", "HD Lace", "Clean Install"],
  },
  {
    id: "cr-06",
    type: "versatility",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_12.webp",
    caption: "Same body wave unit styled in two looks — curled ends and straight press — same session.",
    category: "Versatility",
    styleNote: "Body Wave · 22\" · HD Lace",
    tags: ["Body Wave", "HD Lace", "Versatility"],
  },
  {
    id: "cr-07",
    type: "editorial",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_13.webp",
    caption: "Deep wave, 26\", 200% density. Full length, photographed under studio and natural daylight.",
    category: "Editorial",
    styleNote: "Deep Wave · 26\" · HD Lace",
    tags: ["Deep Wave", "HD Lace", "Long"],
  },
  {
    id: "cr-08",
    type: "style",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_14.webp",
    caption: "Straight texture, 18\", worn in a clean middle part. Professional finish.",
    category: "Daily Wear",
    styleNote: "Straight · 18\" · Transparent Lace",
    tags: ["Straight", "Transparent Lace", "Everyday"],
  },
  {
    id: "cr-09",
    type: "install",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_15.webp",
    caption: "Loose wave unit, fresh install. Edges laid with light hold, natural perimeter.",
    category: "Install",
    styleNote: "Loose Wave · 20\" · HD Lace",
    tags: ["Loose Wave", "HD Lace", "Clean Install"],
  },
  {
    id: "cr-10",
    type: "versatility",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_16.webp",
    caption: "The same unit worn in three ways — demonstrating versatility across occasions.",
    category: "Versatility",
    styleNote: "Body Wave · 24\" · HD Lace",
    tags: ["Body Wave", "HD Lace", "Versatility"],
  },
  {
    id: "cr-11",
    type: "editorial",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_17.webp",
    caption: "Straight texture, 22\", editorial styling. Shine and movement captured under controlled lighting.",
    category: "Editorial",
    styleNote: "Straight · 22\" · HD Lace",
    tags: ["Straight", "HD Lace", "Editorial"],
  },
  {
    id: "cr-12",
    type: "style",
    image: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_18.webp",
    caption: "Body wave worn in a gathered ponytail style — demonstrating natural movement and volume.",
    category: "Daily Wear",
    styleNote: "Body Wave · 20\" · Transparent Lace",
    tags: ["Body Wave", "Transparent Lace", "Everyday"],
  },
];

export const RESULT_CATEGORIES = ["All", ...Array.from(new Set(clientResults.map((r) => r.category)))];
