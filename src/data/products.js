// ======================
// LACE UPCHARGE
// ======================
const LACE_UPCHARGE = {
  "Transparent Lace": 0,
  "HD Lace": 50,
};

// ======================
// EMINENCE ESSENTIALS
// ======================
const ESSENTIALS_COLLECTION = {
  name: "Eminence Essentials",
  slug: "eminence-essentials",
};

// ======================
// PRICING MATRICES
// ======================

// SEA COLLECTION
const SEA_WIG_PRICES = {
  16: { 140: 420, 180: 470, 200: 500, 250: 560 },
  18: { 140: 450, 180: 500, 200: 530, 250: 590 },
  20: { 140: 480, 180: 530, 200: 560, 250: 620 },
  22: { 140: 510, 180: 560, 200: 590, 250: 650 },
  24: { 140: 540, 180: 590, 200: 620, 250: 680 },
  26: { 140: 570, 180: 620, 200: 650, 250: 710 },
  28: { 140: 600, 180: 650, 200: 680, 250: 740 },
  30: { 140: 630, 180: 680, 200: 710, 250: 770 },
};

// BURMESE
const BURMESE_WIG_PRICES = {
  16: { 140: 440, 180: 490, 200: 520 },
  18: { 140: 470, 180: 520, 200: 550 },
  20: { 140: 500, 180: 550, 200: 580 },
  22: { 140: 530, 180: 580, 200: 610 },
  24: { 140: 560, 180: 610, 200: 640 },
  26: { 140: 590, 180: 640, 200: 670 },
  28: { 140: 620, 180: 670, 200: 700 },
};

// LAVISH
const LAVISH_WIG_PRICES = {
  16: { 140: 460, 180: 510, 200: 540, 250: 600 },
  18: { 140: 490, 180: 540, 200: 570, 250: 630 },
  20: { 140: 520, 180: 570, 200: 600, 250: 660 },
  22: { 140: 550, 180: 600, 200: 630, 250: 690 },
  24: { 140: 580, 180: 630, 200: 660, 250: 720 },
  26: { 140: 610, 180: 660, 200: 690, 250: 750 },
};

// RAW SILKY STRAIGHT
const STRAIGHT_WIG_PRICES = {
  16: { 140: 400, 180: 450, 200: 480, 250: 540 },
  18: { 140: 430, 180: 480, 200: 510, 250: 570 },
  20: { 140: 460, 180: 510, 200: 540, 250: 600 },
  22: { 140: 490, 180: 540, 200: 570, 250: 630 },
  24: { 140: 520, 180: 570, 200: 600, 250: 660 },
  26: { 140: 550, 180: 600, 200: 630, 250: 690 },
  30: { 140: 610, 180: 660, 200: 690, 250: 750 },
  32: { 140: 640, 180: 690, 200: 720, 250: 780 },
};

// NATURAL COLORWAY — BODYWAVE
const NATURAL_BODYWAVE_PRICES = {
  16: { 140: 380, 180: 430, 200: 460 },
  18: { 140: 410, 180: 460, 200: 490 },
  20: { 140: 440, 180: 490, 200: 520 },
  22: { 140: 470, 180: 520, 200: 550 },
  24: { 140: 500, 180: 550, 200: 580 },
  26: { 140: 530, 180: 580, 200: 610 },
};

// NATURAL COLORWAY — STRAIGHT
const NATURAL_STRAIGHT_PRICES = {
  16: { 140: 370, 180: 420, 200: 450 },
  18: { 140: 400, 180: 450, 200: 480 },
  20: { 140: 430, 180: 480, 200: 510 },
  22: { 140: 460, 180: 510, 200: 540 },
  24: { 140: 490, 180: 540, 200: 570 },
  26: { 140: 520, 180: 570, 200: 600 },
};

// 613 BLONDE
const BLONDE_613_PRICES = {
  16: { 140: 520, 180: 570, 200: 600 },
  18: { 140: 550, 180: 600, 200: 630 },
  20: { 140: 580, 180: 630, 200: 660 },
  22: { 140: 610, 180: 660, 200: 690 },
  24: { 140: 640, 180: 690, 200: 720 },
  26: { 140: 670, 180: 720, 200: 750 },
  28: { 140: 700, 180: 750, 200: 780 },
};

// ======================
// PRODUCTS
// ======================
export const products = [
  {
    id: "sea-bodywave",
    slug: "sea-bodywave",
    name: "SEA BodyWave",
    displayName: "SEA Raw Body Wave HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-SEA-2025-90222",
    collection: "SEA Collection",
    collectionSlug: "sea",
    texture: "BodyWave",
    description:
      "Raw SEA BodyWave offers an effortless flowing 'S' pattern with exceptional softness, movement, and longevity. Ideal for luxurious, voluminous installs and natural glam looks.",
    lengths: [16, 18, 20, 22, 24, 26, 28, 30],
    densities: [140, 180, 200, 250],
    price(length, density, lace = "Transparent Lace") {
      return (SEA_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
    ],
  },

  {
    id: "sea-waterwave",
    slug: "sea-waterwave",
    name: "SEA WaterWave",
    displayName: "SEA Raw Water Wave HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-SEA-2025-90223",
    collection: "SEA Collection",
    collectionSlug: "sea",
    texture: "WaterWave",
    description:
      "A naturally defined water-wave pattern sourced from SEA donors. Soft, airy curls with beautiful bounce and movement.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200, 250],
    price(length, density, lace = "Transparent Lace") {
      return (SEA_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_WaterWave_Natural_01.webp",
    ],
  },

  {
    id: "burmese-deepwave",
    slug: "burmese-deepwave",
    name: "Burmese DeepWave",
    displayName: "Burmese Raw Deep Wave HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-BUR-2025-90224",
    collection: "Burmese Collection",
    collectionSlug: "burmese",
    texture: "DeepWave",
    description:
      "Authentic Burmese DeepWave with extraordinary definition and richness. A luxurious curl with unmatched density and longevity.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    price(length, density, lace = "Transparent Lace") {
      return (BURMESE_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_02.webp",
    ],
  },

  {
    id: "lavish-loosewave",
    slug: "lavish-loosewave",
    name: "Lavish LooseWave",
    displayName: "Lavish Loose Wave HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-LAV-2025-90225",
    collection: "Lavish Collection",
    collectionSlug: "lavish",
    texture: "LooseWave",
    description:
      "Our Lavish LooseWave features a polished, flowing wave pattern with refined texture and a glossy finish. Perfect for effortless luxury.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200, 250],
    price(length, density, lace = "Transparent Lace") {
      return (LAVISH_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
    ],
  },

  {
    id: "silky-straight",
    slug: "silky-straight",
    name: "Raw Silky Straight",
    displayName: "Raw Silky Straight HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-STR-2025-90226",
    collection: "Straight Collection",
    collectionSlug: "straight",
    texture: "Straight",
    description:
      "Ultra-sleek raw Silky Straight with a soft, natural sheen. Sourced ethically for maximum longevity and premium flow.",
    lengths: [16, 18, 20, 22, 24, 26, 30, 32],
    densities: [140, 180, 200, 250],
    price(length, density, lace = "Transparent Lace") {
      return (STRAIGHT_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },

  {
    id: "colorway-natural-bodywave",
    slug: "colorway-natural-bodywave",
    name: "Natural Colorway — BodyWave",
    displayName: "Natural 1B Body Wave HD Lace Wig",
    type: "wig",

    // 🔹 Eminence Essentials
    isEssential: true,
    essentialOrder: 2,
    collections: ["Eminence Essentials"],

    verificationCode: "EMH-NAT-2025-90227",
    collection: "Colorway Natural",
    collectionSlug: "natural",
    texture: "BodyWave",
    description:
      "Rich, natural 1B tone with soft depth and dimension. Designed to blend seamlessly with natural dark hair.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200],
    price(length, density, lace = "Transparent Lace") {
      return (NATURAL_BODYWAVE_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_BodyWave_Natural_01.webp",
    ],
  },

  {
    id: "colorway-natural-straight",
    slug: "colorway-natural-straight",
    name: "Natural Colorway — Straight",
    displayName: "Natural 1B Straight HD Lace Wig",
    type: "wig",
    verificationCode: "EMH-NAT-2025-90228",
    collection: "Colorway Natural",
    collectionSlug: "natural",
    texture: "Straight",
    description:
      "Pure natural tone with a sleek, smooth straight texture. Ideal for polished minimal looks.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200],
    price(length, density, lace = "Transparent Lace") {
      return (NATURAL_STRAIGHT_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_SilkyStraight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_SilkyStraight_Natural_02.webp",
    ],
  },

  {
    id: "colorway-613",
    slug: "colorway-613",
    name: "613 Blonde Colorway",
    displayName: "613 Blonde HD Lace Wig",
    type: "wig",

    // 🔹 Eminence Essentials
    isEssential: true,
    essentialOrder: 3,
    collections: ["Eminence Essentials"],

    verificationCode: "EMH-613-2025-90229",
    collection: "Colorway 613",
    collectionSlug: "613",
    texture: "Curly / BodyWave / Straight compatible",
    description:
      "Our luminous 613 blonde colorway offers a bright, even lift with ultra-soft texture — perfect for dyeing, toning, or wearing as-is.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    price(length, density, lace = "Transparent Lace") {
      return (BLONDE_613_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/colorways/613/Eminence_Colorways_Curly_613_01.webp",
      "/gallery/colorways/613/Eminence_Colorways_Curly_613_02.webp",
    ],
  },

  {
    id: "texture-bodywave",
    slug: "texture-bodywave",
    name: "BodyWave Texture",
    displayName: "Body Wave Texture Reference",
    type: "wig",
    verificationCode: "EMH-TEX-2025-90230",
    collection: "Textures",
    collectionSlug: "textures",
    texture: "BodyWave",
    description:
      "A detailed reference of our BodyWave pattern — soft, dimensional, and naturally voluminous.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    price(length, density, lace = "Transparent Lace") {
      return (NATURAL_BODYWAVE_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_01.webp",
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_02.webp",
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_03.webp",
    ],
  },

  {
    id: "wig-black-straight",
    slug: "black-straight-hd-lace-wig",
    name: "Black Straight HD Lace Wig",
    displayName: "Black Straight HD Lace Wig",
    type: "wig",

    // 🔹 Eminence Essentials
    isEssential: true,
    essentialOrder: 1,
    collections: ["Eminence Essentials"],

    verificationCode: "EMH-EMI-2025-90231",
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Straight",
    color: "1B",
    description:
      "A sleek, jet-black straight wig from our core Eminence Collection. Timeless elegance with premium HD lace.",
    lengths: [16, 18, 20, 22, 24, 26, 30, 32],
    densities: [140, 180, 200, 250],
    assetKey: "wig_straight_1b",
    price(length, density, lace = "Transparent Lace") {
      return (STRAIGHT_WIG_PRICES[length]?.[density] ?? 0) + (LACE_UPCHARGE[lace] ?? 0);
    },
    images: [
      "/assets/wigs/wig_straight_1b/hero.jpg",
      "/assets/wigs/wig_straight_1b/texture.jpg",
      "/assets/wigs/wig_straight_1b/angle.jpg",
      "/assets/wigs/wig_straight_1b/wear.jpg",
    ],
    videos: {
      texture: "/assets/wigs/wig_straight_1b/texture.mp4",
      wear: "/assets/wigs/wig_straight_1b/wear.mp4",
    },
  },
];

// ======================
// DERIVED COLLECTIONS
// ======================
export const eminenceEssentials = products
  .filter((p) => p.isEssential)
  .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));

export default products;
