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
// DENSITY + PRICE HELPERS
// ======================
//
// All wigs display density options as: 150% / 180% / 210% / 250%
// Pricing matrices below remain “anchor points”, and we interpolate/extrapolate
// smoothly (so custom densities like 280% will price correctly).

// Standard, customer-facing density options
// (The underlying matrices may use anchor points like 140/200; we interpolate.)
export const STANDARD_WIG_DENSITIES = [150, 180, 210, 250];

const UI_DENSITIES = STANDARD_WIG_DENSITIES;

const roundMoney = (n) => Math.round(Number(n || 0));

function interpolateDensityPrice(densityMap, density) {
  const d = Number(density);
  if (!densityMap || !Number.isFinite(d)) return 0;

  const anchors = Object.keys(densityMap)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && densityMap[n] != null)
    .sort((a, b) => a - b);

  if (anchors.length === 0) return 0;
  if (densityMap[d] != null) return Number(densityMap[d]) || 0;

  const lerp = (d0, p0, d1, p1, x) => {
    if (d1 === d0) return p0;
    return p0 + (p1 - p0) * ((x - d0) / (d1 - d0));
  };

  // Below range → extrapolate using first segment
  if (d <= anchors[0]) {
    if (anchors.length === 1) return Number(densityMap[anchors[0]]) || 0;
    const d0 = anchors[0], d1 = anchors[1];
    const p0 = Number(densityMap[d0]) || 0, p1 = Number(densityMap[d1]) || 0;
    return lerp(d0, p0, d1, p1, d);
  }

  // Above range → extrapolate using last segment
  if (d >= anchors[anchors.length - 1]) {
    if (anchors.length === 1) return Number(densityMap[anchors[0]]) || 0;
    const d0 = anchors[anchors.length - 2];
    const d1 = anchors[anchors.length - 1];
    const p0 = Number(densityMap[d0]) || 0;
    const p1 = Number(densityMap[d1]) || 0;
    return lerp(d0, p0, d1, p1, d);
  }

  // Within range → interpolate
  for (let i = 0; i < anchors.length - 1; i++) {
    const d0 = anchors[i], d1 = anchors[i + 1];
    if (d > d0 && d < d1) {
      const p0 = Number(densityMap[d0]) || 0;
      const p1 = Number(densityMap[d1]) || 0;
      return lerp(d0, p0, d1, p1, d);
    }
  }

  return Number(densityMap[anchors[0]]) || 0;
}

function calcWigPrice(table, length, density, lace = "Transparent Lace") {
  const L = Number(length);
  const D = Number(density);
  const laceFee = LACE_UPCHARGE[lace] ?? 0;
  const densityMap = table?.[L];
  const base = interpolateDensityPrice(densityMap, D);
  return roundMoney(base + laceFee);
}

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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(SEA_WIG_PRICES, length, density, lace);
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(SEA_WIG_PRICES, length, density, lace);
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(BURMESE_WIG_PRICES, length, density, lace);
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(LAVISH_WIG_PRICES, length, density, lace);
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(STRAIGHT_WIG_PRICES, length, density, lace);
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
    color: "1B",
    assetKey: "wig_bodywave_1b",
    description:
      "Rich, natural 1B tone with soft depth and dimension. Designed to blend seamlessly with natural dark hair.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(NATURAL_BODYWAVE_PRICES, length, density, lace);
      },
    images: [
      "/assets/wigs/wig_bodywave_1b/hero.webp",
      "/assets/wigs/wig_bodywave_1b/wear_01.webp",
      "/assets/wigs/wig_bodywave_1b/wear_02.webp",
      "/assets/wigs/wig_bodywave_1b/wear_03.webp",
      "/assets/wigs/wig_bodywave_1b/gallery_001.webp",
      "/assets/wigs/wig_bodywave_1b/gallery_002.webp",
      "/assets/wigs/wig_bodywave_1b/gallery_003.webp",
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(NATURAL_STRAIGHT_PRICES, length, density, lace);
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
    color: "613",
    assetKey: "wig_deepwave_613",
    description:
      "Our luminous 613 blonde colorway offers a bright, even lift with ultra-soft texture — perfect for dyeing, toning, or wearing as-is.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(BLONDE_613_PRICES, length, density, lace);
      },
    images: [
      "/assets/wigs/wig_deepwave_613/hero.webp",
      "/assets/wigs/wig_deepwave_613/wear_01.webp",
      "/assets/wigs/wig_deepwave_613/wear_02.webp",
      "/assets/wigs/wig_deepwave_613/gallery_001.webp",
      "/assets/wigs/wig_deepwave_613/gallery_002.webp",
      "/assets/wigs/wig_deepwave_613/gallery_003.webp",
      "/assets/wigs/wig_deepwave_613/gallery_004.webp",
      "/assets/wigs/wig_deepwave_613/gallery_005.webp",
      "/assets/wigs/wig_deepwave_613/gallery_006.webp",
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
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(NATURAL_BODYWAVE_PRICES, length, density, lace);
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
    densities: UI_DENSITIES,
    assetKey: "wig_straight_1b",
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(STRAIGHT_WIG_PRICES, length, density, lace);
      },
    images: [
      "/assets/wigs/wig_straight_1b/hero.webp",
      "/assets/wigs/wig_straight_1b/mannequin.webp",
      "/assets/wigs/wig_straight_1b/texture.webp",
      "/assets/wigs/wig_straight_1b/angle.webp",
      "/assets/wigs/wig_straight_1b/wear_01.webp",
      "/assets/wigs/wig_straight_1b/gallery_001.webp",
      "/assets/wigs/wig_straight_1b/gallery_002.webp",
      "/assets/wigs/wig_straight_1b/gallery_003.webp",
      "/assets/wigs/wig_straight_1b/gallery_004.webp",
    ],
    videos: {
      texture: "/assets/wigs/wig_straight_1b/texture.mp4",
      wear: "/assets/wigs/wig_straight_1b/wear.mp4",
    },
  },
  {
    id: "wig-jet-black-straight",
    slug: "jet-black-straight-hd-lace-wig",
    name: "Jet Black Straight HD Lace Wig",
    displayName: "Jet Black Straight HD Lace Wig",
    type: "wig",

    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Straight",
    color: "1",
    assetKey: "wig_straight_1",
    description:
      "True jet black, bone-straight finish with premium HD lace. Designed for a seamless melt and high-shine movement.",
    lengths: [16, 18, 20, 22, 24, 26, 30, 32],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(STRAIGHT_WIG_PRICES, length, density, lace);
      },
    images: [
      "/assets/wigs/wig_straight_1/hero.webp",
      "/assets/wigs/wig_straight_1/mannequin.webp",
      "/assets/wigs/wig_straight_1/texture.webp",
      "/assets/wigs/wig_straight_1/angle.webp",
      "/assets/wigs/wig_straight_1/wear_01.webp",
      "/assets/wigs/wig_straight_1/wear_02.webp",
      "/assets/wigs/wig_straight_1/wear_03.webp",
      "/assets/wigs/wig_straight_1/gallery_001.webp",
      "/assets/wigs/wig_straight_1/gallery_002.webp",
      "/assets/wigs/wig_straight_1/gallery_003.webp",
      "/assets/wigs/wig_straight_1/gallery_004.webp",
    ],
  },
  {
    id: "wig-burgundy-loose-wave",
    slug: "burgundy-loose-wave-hd-lace-wig",
    name: "Burgundy Loose Wave HD Lace Wig",
    displayName: "Burgundy Loose Wave HD Lace Wig",
    type: "wig",

    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "LooseWave",
    color: "Burgundy",
    assetKey: "wig_loosewave_burgundy",
    description:
      "A rich burgundy tone with soft, polished loose waves. HD lace crafted to melt cleanly with natural movement.",
    lengths: [16, 18, 20, 22, 24, 26, 28, 30],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(LAVISH_WIG_PRICES, length, density, lace);
      },
    images: [
      "/assets/wigs/wig_loosewave_burgundy/hero.webp",
      "/assets/wigs/wig_loosewave_burgundy/texture.webp",
      "/assets/wigs/wig_loosewave_burgundy/angle.webp",
      "/assets/wigs/wig_loosewave_burgundy/wear_01.webp",
    ],
  },
  {
    id: "bundles-natural-body-wave",
    slug: "natural-body-wave-bundles",
    name: "Natural Body Wave Bundles",
    displayName: "Natural Body Wave Bundles",
    type: "bundle",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "BodyWave",
    color: "1B",
    assetKey: "bundle_bodywave_1",
    description:
      "Soft, bouncy body-wave bundles in a natural 1B tone. Ideal for sew-ins, custom units, and versatile styling.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    // Bundles are priced by length (density not applicable)
    price(length) {
      const PRICE = {

        12: 109,
        14: 139,
        16: 159,
        18: 179,
        20: 199,
        22: 219,
        24: 239,
        26: 259,
        28: 279,
        30: 299,
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_03.webp",
    ],
  },
  {
    id: "bundles-natural-deep-curly",
    slug: "natural-deep-curly-bundles",
    name: "Natural Deep Curly Bundles",
    displayName: "Natural Deep Curly Bundles",
    type: "bundle",
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "DeepCurly",
    color: "1B",
    assetKey: "bundle_deepcurly_1",
    description:
      "Defined deep-curl bundles with high texture definition and a natural finish. Designed for volume and curl retention.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    // Bundles are priced by length (density not applicable)
    price(length) {
      const PRICE = {

        12: 119,
        14: 149,
        16: 169,
        18: 189,
        20: 209,
        22: 229,
        24: 249,
        26: 269,
        28: 289,
        30: 309,
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_02.webp",
    ],
  },

  {
    id: "medical-grade-straight",
    slug: "medical-grade-straight-hd-lace-wig",
    name: "Medical Grade Straight HD Lace Wig",
    displayName: "Medical Grade Straight HD Lace Wig",
    type: "wig",
    badge: "Medical Grade",
    isMedical: true,
    collection: "Medical Grade",
    collectionSlug: "medical-grade",
    texture: "Straight",
    color: "1B",
    description:
      "A medical-grade cranial prosthesis option crafted for sensitive scalps — ultra-soft construction, refined density, and a natural finish designed for confidence and comfort.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      // Medical-grade wigs include additional cap engineering + documentation support
      return calcWigPrice(STRAIGHT_WIG_PRICES, length, density, lace) + 650;
    },
    images: [
      "/gallery/medical/Medical_Grade_Straight_01.webp",
      "/gallery/medical/Medical_Grade_Straight_02.webp",
    ],
  },

  {
    id: "medical-grade-bodywave",
    slug: "medical-grade-body-wave-hd-lace-wig",
    name: "Medical Grade Body Wave HD Lace Wig",
    displayName: "Medical Grade Body Wave HD Lace Wig",
    type: "wig",
    badge: "Medical Grade",
    isMedical: true,
    collection: "Medical Grade",
    collectionSlug: "medical-grade",
    texture: "BodyWave",
    color: "1B",
    description:
      "Soft body-wave movement with medical-grade comfort. Designed to look luxurious while remaining gentle and breathable for sensitive scalps.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(SEA_WIG_PRICES, length, density, lace) + 650;
    },
    images: [
      "/gallery/medical/Medical_Grade_BodyWave_01.webp",
      "/gallery/medical/Medical_Grade_BodyWave_02.webp",
    ],
  },

  {
    id: "medical-grade-deepwave",
    slug: "medical-grade-deep-wave-hd-lace-wig",
    name: "Medical Grade Deep Wave HD Lace Wig",
    displayName: "Medical Grade Deep Wave HD Lace Wig",
    type: "wig",
    badge: "Medical Grade",
    isMedical: true,
    collection: "Medical Grade",
    collectionSlug: "medical-grade",
    texture: "DeepWave",
    color: "1B",
    description:
      "Defined deep-wave texture paired with medical-grade cap construction. Created for softness, realism, and comfort through every stage of hair loss or regrowth.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: UI_DENSITIES,
    price(length, density, lace = "Transparent Lace") {
      return calcWigPrice(BURMESE_WIG_PRICES, length, density, lace) + 650;
    },
    images: [
      "/gallery/medical/Medical_Grade_DeepWave_01.webp",
      "/gallery/medical/Medical_Grade_DeepWave_02.webp",
    ],
  },

  {
    id: "bundles-natural-straight",
    slug: "natural-straight-bundles",
    name: "Natural Straight Bundles",
    displayName: "Natural Straight Bundles",
    type: "bundle",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Straight",
    color: "1B",
    assetKey: "bundle_straight_1",
    description:
      "Polished natural-straight weft bundles in a seamless 1B tone — soft, lightweight, and designed for a clean, luxury finish.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const PRICE = {
      12: 99,
      14: 129,
      16: 149,
      18: 169,
      20: 189,
      22: 209,
      24: 229,
      26: 249,
      28: 269,
      30: 289
    
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_03.webp",
    ],
  },

  {
    id: "bundles-613-body-wave",
    slug: "613-body-wave-bundles",
    name: "613 Body Wave Bundles",
    displayName: "613 Body Wave Bundles",
    type: "bundle",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Colorway 613",
    collectionSlug: "613",
    texture: "BodyWave",
    color: "613",
    assetKey: "bundle_bodywave_613",
    description:
      "Luminous 613 blonde body-wave bundles with clean color and soft movement — a premium, salon-ready blonde.",
    lengths: [16, 18, 20, 22, 24],
    price(length) {
      const PRICE = {
      16: 209,
      18: 239,
      20: 269,
      22: 299,
      24: 329
    
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/assets/bundles/bundle_bodywave_613/hero.webp",
      "/assets/bundles/bundle_bodywave_613/texture.webp",
      "/assets/bundles/bundle_bodywave_613/angle.webp",
    ],
  },

  {
    id: "closure-4x4",
    slug: "4x4-hd-closure",
    name: "4×4 HD Closure",
    displayName: "4×4 HD Closure",
    type: "closure",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Closure",
    color: "1B",
    description:
      "4×4 HD lace closure — seamless melt, refined parting, and a natural finish designed for luxury installs.",
    lengths: [14, 16, 18],
    price(length) {
      const PRICE = {
        14: 179,
        16: 199,
        18: 219,
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_03.webp",
    ],
  },

  {
    id: "closure-5x5",
    slug: "5x5-hd-closure",
    name: "5×5 HD Closure",
    displayName: "5×5 HD Closure",
    type: "closure",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Closure",
    color: "1B",
    description:
      "5×5 HD lace closure — enhanced coverage and parting space for a more elevated, ultra-realistic finish.",
    lengths: [16, 18],
    price(length) {
      const PRICE = {
        16: 239,
        18: 259,
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_03.webp",
    ],
  },

  {
    id: "frontal-13x4",
    slug: "13x4-hd-frontal",
    name: "13×4 HD Frontal",
    displayName: "13×4 HD Frontal",
    type: "frontal",
    badge: "Ready to ship",
    readyToShip: true,
    collection: "Eminence Collection",
    collectionSlug: "eminence",
    texture: "Frontal",
    color: "1B",
    description:
      "13×4 HD lace frontal — premium hairline realism with styling versatility and an editorial finish.",
    lengths: [16, 18],
    price(length) {
      const PRICE = {
        16: 329,
        18: 349,
      };
      return PRICE[length] ?? 0;
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_03.webp",
    ],
  },

  // ======================
  // READY-TO-SHIP INSTALL SETS (single SKU)
  // ======================
  // These are intentionally hidden from the main Shop grid so they can live as
  // high-converting “one click” bundles on /ready-to-ship.

  {
    id: "install-set-straight-141618",
    slug: "install-set-straight-14-16-18",
    name: "Install Set — Straight (14/16/18)",
    displayName: "Install Set — Straight (14″ / 16″ / 18″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "Straight",
    color: "1B",
    basePrice: 447,
    description:
      "A complete, install-ready straight set: 3 bundles (14\"/16\"/18\"). Added to bag as a single set item.",
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },

  {
    id: "install-set-bodywave-141618",
    slug: "install-set-body-wave-14-16-18",
    name: "Install Set — Body Wave (14/16/18)",
    displayName: "Install Set — Body Wave (14″ / 16″ / 18″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "BodyWave",
    color: "1B",
    basePrice: 477,
    description:
      "A complete, install-ready body wave set: 3 bundles (14\"/16\"/18\"). Added to bag as a single set item.",
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
    ],
  },

  {
    id: "install-set-straight-141618-closure4x4",
    slug: "install-set-straight-14-16-18-with-4x4",
    name: "Install Set — Straight + 4×4 Closure",
    displayName: "Install Set — Straight (14″/16″/18″) + 4×4 Closure (16″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "Straight",
    color: "1B",
    basePrice: 646,
    description:
      "Install set includes 3 straight bundles (14\"/16\"/18\") + 4×4 HD closure (16\"). Added to bag as one set item.",
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    ],
  },

  {
    id: "install-set-bodywave-141618-closure4x4",
    slug: "install-set-body-wave-14-16-18-with-4x4",
    name: "Install Set — Body Wave + 4×4 Closure",
    displayName: "Install Set — Body Wave (14″/16″/18″) + 4×4 Closure (16″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "BodyWave",
    color: "1B",
    basePrice: 676,
    description:
      "Install set includes 3 body wave bundles (14\"/16\"/18\") + 4×4 HD closure (16\"). Added to bag as one set item.",
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    ],
  },

  {
    id: "install-set-straight-161820-frontal13x4",
    slug: "install-set-straight-16-18-20-with-13x4",
    name: "Premium Install Set — Straight + 13×4 Frontal",
    displayName: "Premium Install Set — Straight (16″/18″/20″) + 13×4 Frontal (18″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "Straight",
    color: "1B",
    basePrice: 856,
    description:
      "Premium install set includes 3 straight bundles (16\"/18\"/20\") + 13×4 HD frontal (18\"). Added to bag as one set item.",
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
    ],
  },

  {
    id: "install-set-bodywave-161820-frontal13x4",
    slug: "install-set-body-wave-16-18-20-with-13x4",
    name: "Premium Install Set — Body Wave + 13×4 Frontal",
    displayName: "Premium Install Set — Body Wave (16″/18″/20″) + 13×4 Frontal (18″)",
    type: "bundle",
    badge: "Install Set",
    readyToShip: true,
    hideFromShop: true,
    collection: "Ready-to-Ship Edit",
    collectionSlug: "ready-to-ship",
    texture: "BodyWave",
    color: "1B",
    basePrice: 886,
    description:
      "Premium install set includes 3 body wave bundles (16\"/18\"/20\") + 13×4 HD frontal (18\"). Added to bag as one set item.",
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
    ],
  },


  // ======================
  // PRE-ORDER COLLECTION
  // ======================

  {
    id: "preorder-raw-vietnamese",
    slug: "preorder-raw-vietnamese",
    name: "Raw Vietnamese",
    displayName: "Raw Vietnamese Bundles — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "Straight",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "10–14 business days",
    qualityTier: "True Raw",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 189,
    description: "100% raw Vietnamese hair bundles — unprocessed, cuticle-aligned, factory drop-shipped directly from our partner atelier. Rich texture with natural body.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28],
    price(length) {
      const P = { 12: 159, 14: 169, 16: 189, 18: 209, 20: 229, 22: 249, 24: 269, 26: 289, 28: 309 };
      return P[length] ?? 189;
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
    ],
  },

  {
    id: "preorder-raw-wefts-natural",
    slug: "preorder-raw-wefts-natural",
    name: "Raw Wefts & Natural",
    displayName: "Raw Wefts & Natural Ends — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "Natural",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "10–14 business days",
    qualityTier: "True Raw",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 179,
    description: "Raw weft bundles with preserved natural ends — minimal processing, full cuticle alignment, and factory-direct quality. Natural luster without the silicone coating.",
    lengths: [12, 14, 16, 18, 20, 22, 24],
    price(length) {
      const P = { 12: 149, 14: 159, 16: 179, 18: 199, 20: 219, 22: 239, 24: 259 };
      return P[length] ?? 179;
    },
    images: [
      "/gallery/collections/Burmese/Eminence_Burmese_BodyWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_BodyWave_Natural_02.webp",
    ],
  },

  {
    id: "preorder-high-grade-tier1",
    slug: "preorder-high-grade-tier1",
    name: "High Grade Tier-1",
    displayName: "High Grade Tier-1 Bundles — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "Straight",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "10–14 business days",
    qualityTier: "High Grade",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 219,
    description: "Our highest-grade bundles — Tier-1 classification for strand uniformity, luster, and longevity. Factory-selected from premium donor batches.",
    lengths: [14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const P = { 14: 199, 16: 219, 18: 239, 20: 259, 22: 279, 24: 299, 26: 319, 28: 339, 30: 359 };
      return P[length] ?? 219;
    },
    images: [
      "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
    ],
  },

  {
    id: "preorder-true-raw-standard",
    slug: "preorder-true-raw-standard",
    name: "True Raw Standard",
    displayName: "True Raw Standard Bundles — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "BodyWave",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "10–14 business days",
    qualityTier: "True Raw",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 169,
    description: "True raw hair at its standard tier — cuticle-aligned, unprocessed, and ethically sourced. The right entry point into genuine raw hair.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26],
    price(length) {
      const P = { 12: 139, 14: 149, 16: 169, 18: 189, 20: 209, 22: 229, 24: 249, 26: 269 };
      return P[length] ?? 169;
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
    ],
  },

  {
    id: "preorder-double-drawn",
    slug: "preorder-double-drawn",
    name: "Double Drawn (DD)",
    displayName: "Double Drawn Bundles (DD) — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "Straight",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "12–16 business days",
    qualityTier: "Double Drawn",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 249,
    description: "Double drawn (DD) bundles — hand-selected for strand length uniformity from root to tip. Ultra-full, ultra-dense finish at every length.",
    lengths: [14, 16, 18, 20, 22, 24, 26, 28],
    price(length) {
      const P = { 14: 229, 16: 249, 18: 269, 20: 289, 22: 309, 24: 329, 26: 349, 28: 369 };
      return P[length] ?? 249;
    },
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },

  {
    id: "preorder-super-double-drawn",
    slug: "preorder-super-double-drawn",
    name: "Super Double Drawn (SDD)",
    displayName: "Super Double Drawn Bundles (SDD) — Pre-Order",
    type: "bundle",
    collection: "Pre Orders",
    collectionSlug: "preorders",
    texture: "Straight",
    color: "1B",
    isPreorder: true,
    preorderCategory: "Pre Orders",
    shipsFrom: "Factory",
    leadTimeLabel: "14–18 business days",
    qualityTier: "Super Double Drawn",
    preorderBadgeText: "Pre-Order",
    preorderDisclaimer: "This item is fulfilled directly from our factory partner and is not part of current domestic inventory.",
    basePrice: 299,
    description: "The pinnacle of bundle density — Super Double Drawn (SDD) with maximum strand uniformity throughout. Every inch, full. Factory-curated for the most demanding installs.",
    lengths: [14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const P = { 14: 279, 16: 299, 18: 319, 20: 339, 22: 359, 24: 379, 26: 399, 28: 419, 30: 439 };
      return P[length] ?? 299;
    },
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_03.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_04.webp",
    ],
  },
];

// ======================
// DERIVED COLLECTIONS
// ======================
export const eminenceEssentials = products
  .filter((p) => p.isEssential)
  .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));

export const preorderProducts = products.filter((p) => p.isPreorder === true);

export default products;
