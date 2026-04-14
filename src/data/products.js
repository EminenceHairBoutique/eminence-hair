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
  const densityNumber = Number(density);
  if (!densityMap || !Number.isFinite(densityNumber)) return 0;

  const anchors = Object.keys(densityMap)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && densityMap[n] != null)
    .sort((a, b) => a - b);

  if (anchors.length === 0) return 0;
  if (densityMap[densityNumber] != null) return Number(densityMap[densityNumber]) || 0;

  const lerp = (d0, p0, d1, p1, x) => {
    if (d1 === d0) return p0;
    return p0 + (p1 - p0) * ((x - d0) / (d1 - d0));
  };

  // Below range → extrapolate using first segment
  if (densityNumber <= anchors[0]) {
    if (anchors.length === 1) return Number(densityMap[anchors[0]]) || 0;
    const d0 = anchors[0], d1 = anchors[1];
    const p0 = Number(densityMap[d0]) || 0, p1 = Number(densityMap[d1]) || 0;
    return lerp(d0, p0, d1, p1, densityNumber);
  }

  // Above range → extrapolate using last segment
  if (densityNumber >= anchors[anchors.length - 1]) {
    if (anchors.length === 1) return Number(densityMap[anchors[0]]) || 0;
    const d0 = anchors[anchors.length - 2];
    const d1 = anchors[anchors.length - 1];
    const p0 = Number(densityMap[d0]) || 0;
    const p1 = Number(densityMap[d1]) || 0;
    return lerp(d0, p0, d1, p1, densityNumber);
  }

  // Within range → interpolate
  for (let i = 0; i < anchors.length - 1; i++) {
    const d0 = anchors[i], d1 = anchors[i + 1];
    if (densityNumber > d0 && densityNumber < d1) {
      const p0 = Number(densityMap[d0]) || 0;
      const p1 = Number(densityMap[d1]) || 0;
      return lerp(d0, p0, d1, p1, densityNumber);
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
      "Raw Cambodian water-wave hair with a naturally defined, airy curl pattern sourced from SEA donors. Pairs seamlessly with HD lace for invisible installs. Versatile enough for wet-and-go or heat-styled looks. Retains its bounce wash after wash with a gentle, sulfate-free routine.",
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
      "Sourced from Myanmar donors with minimal processing, this DeepWave holds its defined curl pattern through daily wear and editorial shoots alike. Available in densities from 150% to 250% for full, rich volume. A wash-friendly texture that air-dries beautifully and maintains its shape over time.",
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
      "From our Lavish Collection, this loose-wave silhouette delivers a polished, camera-ready finish with soft body and natural movement. Available in multiple density options for tailored fullness. Maintain its glossy sheen with a sulfate-free wash routine and minimal heat styling.",
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
      "Raw Cambodian bone-straight hair with a silky, light-reflecting finish. Designed for flawless HD lace melting and versatile styling — flat iron, wrap, or wear as-is. Heat-friendly up to 180°C without compromising strand integrity. A lasting investment in sleek, premium texture.",
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
      "Natural 1B colorway body-wave bundles crafted from raw, cuticle-aligned hair. The soft depth and warm dimension of this tone blend effortlessly with most natural dark hair. Low-maintenance care with a sulfate-free wash keeps the wave pattern defined and the color rich over time.",
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
      "Natural 1B straight texture sourced from raw Cambodian donors — sleek, smooth, and refined for professional or everyday wear. Heat-style with confidence up to 180°C or wear bone-straight out of the pack. A versatile staple that pairs with closures and frontals for a polished, seamless finish.",
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
      "613 blonde colorway on a raw hair base — evenly lifted for a luminous, toner-friendly canvas. Dye it, tone it to ash or honey, or wear the platinum shade as-is. Maintain vibrancy with a color-safe, sulfate-free routine and minimal heat. A creative staple for bold, editorial looks.",
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
      "Our signature body-wave texture — soft, dimensional, and naturally voluminous from raw, cuticle-aligned hair. Available in densities from 150% to 200% for customized fullness. Style with low heat or air-dry for effortless movement. A sulfate-free wash routine preserves the wave pattern and luster.",
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
      "1B jet-black straight wig built on premium HD lace with pre-bleached knots for an undetectable hairline. Available in 150–250% density for editorial or everyday wear. The bone-straight texture holds its sheen through heat styling and pairs with a gentle, sulfate-free care routine.",
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
      "HD lace wig in true jet black with a bone-straight, high-shine finish. Pre-plucked hairline melts seamlessly on all skin tones. Available in 150–250% density for a natural or full-glam look. Heat-safe for flat-iron or roller styling, and camera-ready straight from the box.",
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
      "Deep burgundy colorway with a soft, polished loose-wave pattern set on HD lace construction. Designed for editorial shoots and statement everyday wear. The rich tone holds its depth with color-safe, sulfate-free care. Pre-plucked hairline ensures a clean melt and natural movement.",
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
      "Raw, cuticle-aligned body-wave bundles in natural 1B with soft bounce and dimensional movement. Machine-weft construction for secure sew-ins and custom unit builds. Holds its wave pattern through sulfate-free washes and low-heat styling. A versatile foundation for any install.",
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
      "Deep-curl bundles with defined spirals sourced from raw, cuticle-aligned hair. Full volume from root to tip with excellent curl retention through wash cycles. Ideal for textured sew-ins and custom units. Maintain definition with a curl-safe routine — co-wash, air-dry, and avoid heavy sulfates.",
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
      "Medical-grade cap construction with a soft body-wave texture — breathable, lightweight, and gentle on sensitive or thinning scalps. Eligible as a cranial prosthesis under qualifying insurance plans. Designed for all-day comfort with a natural finish that moves and feels like your own hair.",
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
      "Raw, cuticle-aligned straight weft bundles in a seamless 1B tone. Lightweight machine-weft construction for sew-ins, closures, or custom wig builds. Heat-friendly up to 180°C for versatile styling. Wash with a sulfate-free shampoo to preserve the smooth, high-shine finish.",
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
      "613 blonde body-wave bundles crafted from raw, cuticle-aligned hair with clean, even color and soft movement. Toner- and dye-friendly for custom shades or wear the platinum blonde as-is. Preserve color vibrancy with a sulfate-free, color-safe wash routine. Salon-ready straight from the pack.",
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
      "4×4 HD lace closure with film-thin transparency that melts into any skin tone. Offers refined middle or side parting on bleach-friendly knots. Pairs with bundles for sew-in or custom unit installs. A compact, natural-finish piece that completes any luxury build.",
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
      "5×5 HD lace closure with extended parting space for a wider, more natural-looking part line. Ultra-thin lace disappears on all skin tones with bleach-friendly knots. Ideal for installs that need extra coverage and styling versatility without a full frontal.",
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
      "13×4 HD lace frontal offering full ear-to-ear hairline coverage with film-thin transparency. Pre-plucked for a natural hairline and versatile parting in any direction. Camera-ready finish that melts seamlessly on all skin tones — the definitive piece for editorial and everyday installs.",
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
      "Three raw Cambodian straight bundles (14\"/16\"/18\") curated for layered fullness and a seamless blend. Sew-in ready and added to your bag as a single set for streamlined checkout. A complete foundation for clean, polished installs at set-exclusive value.",
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
      "Three raw body-wave bundles (14\"/16\"/18\") curated for natural movement and layered dimension. Install-ready and added to your bag as a single set for streamlined checkout. Soft, flowing texture that air-dries with defined waves — a complete foundation at set-exclusive value.",
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
      "Complete install solution: 3 raw straight bundles (14\"/16\"/18\") paired with a 4×4 HD lace closure (16\") for a seamless finish. Curated as one set item for simplified checkout. HD closure melts invisibly for a natural part line — everything you need in a single package.",
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
      "Complete body-wave install: 3 raw bundles (14\"/16\"/18\") with a 4×4 HD lace closure (16\") included. Soft, dimensional movement paired with an invisible part line. Added to your bag as one ready-to-install set item — no separate matching needed, just book your stylist.",
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
      "Premium install set: 3 raw straight bundles (16\"/18\"/20\") plus a 13×4 HD frontal (18\") for full ear-to-ear hairline coverage. Longer lengths deliver editorial-grade drama with a bone-straight finish. Bundled as one set item for a complete, ready-to-install solution.",
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
      "Premium body-wave install set: 3 raw bundles (16\"/18\"/20\") with a 13×4 HD frontal (18\") for full hairline coverage and natural movement. Longer lengths add volume and flow for a statement finish. Bundled as one set item — a complete solution from hairline to ends.",
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
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_02.webp",
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
    description: "Tier-1 classified bundles factory-selected from premium donor batches for exceptional strand uniformity, luster, and longevity. Pre-order to reserve your grade — each batch is quality-verified before shipping. A guaranteed standard of excellence backed by our raw hair promise.",
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
    description: "Unprocessed, cuticle-aligned raw hair ethically sourced from single-donor collections. The ideal entry point into genuine raw hair — versatile enough to curl, straighten, or color. Pre-order pricing makes premium accessible without compromising on strand integrity or longevity.",
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
    description: "Double drawn bundles hand-selected for 80–85% strand length uniformity from root to tip, delivering an ultra-full, ultra-dense finish at every length. Factory-direct quality with pre-order savings — each bundle is inspected for consistent density before it ships.",
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
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },
];

// ======================
// PREORDER — ATELIER DROP-SHIP PRICING MATRICES
// Factory drop-ship; not held in domestic inventory.
// Tier ladder: Elite Raw > SDD > DD > Raw Standard > Tier-1
// ======================

const PREORDER_PRICES = {
  "Elite Raw": {
    12: 189, 14: 219, 16: 249, 18: 279, 20: 309,
    22: 339, 24: 369, 26: 399, 28: 429, 30: 459,
  },
  SDD: {
    12: 159, 14: 189, 16: 219, 18: 249, 20: 279,
    22: 309, 24: 339, 26: 369, 28: 399, 30: 429,
  },
  DD: {
    12: 139, 14: 169, 16: 199, 18: 229, 20: 259,
    22: 289, 24: 319, 26: 349, 28: 379, 30: 409,
  },
  "Raw Standard": {
    12: 119, 14: 149, 16: 179, 18: 199, 20: 219,
    22: 249, 24: 279, 26: 309, 28: 339, 30: 369,
  },
  "Tier-1": {
    12: 99, 14: 129, 16: 149, 18: 169, 20: 189,
    22: 219, 24: 249, 26: 279, 28: 299, 30: 319,
  },
};

// ======================
// PREORDER PRODUCTS (Atelier Pre-Order — Factory Drop-Ship)
// Images reference the publicly hosted GitHub issue attachments.
// A luxury placeholder is shown if any path fails to load.
// ======================
const PREORDER_BUNDLE_DISCLAIMER =
  "Pre-order items are factory drop-shipped and not held in domestic inventory. " +
  "All pre-order sales are final. No returns or exchanges. " +
  "Estimated dispatch is 14–21 business days from order confirmation. " +
  "Tracking information will be emailed once your order has shipped. " +
  "Adult signature required upon delivery.";

products.push(
  {
    id: "preorder-dd-straight-bundles",
    slug: "atelier-preorder-dd-straight-bundles",
    name: "Double Drawn Straight Bundles",
    displayName: "Atelier Pre-Order — Double Drawn (DD) Straight Bundles",
    type: "bundle",
    isPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    qualityTier: "DD",
    preorderDisclaimer: PREORDER_BUNDLE_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Atelier Pre-Order",
    collectionSlug: "atelier-preorder",
    texture: "Straight",
    color: "1B",
    description:
      "Double Drawn (DD) straight bundles sourced direct from our factory partners. " +
      "Each weft is meticulously sorted so that 80–85% of strands share the same full length — " +
      "delivering exceptional volume from root to tip. Factory drop-shipped to you.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      return PREORDER_PRICES["DD"][length] ?? 0;
    },
    images: [
      "https://github.com/user-attachments/assets/fd53ac67-a840-4bad-8a64-8a25a7657a3e",
      "https://github.com/user-attachments/assets/4b8ccf81-0ec5-4024-91e4-02bedb3df510",
    ],
  },

  {
    id: "preorder-sdd-straight-bundles",
    slug: "atelier-preorder-sdd-straight-bundles",
    name: "Super Double Drawn Straight Bundles",
    displayName: "Atelier Pre-Order — Super Double Drawn (SDD) Straight Bundles",
    type: "bundle",
    isPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    qualityTier: "SDD",
    preorderDisclaimer: PREORDER_BUNDLE_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Atelier Pre-Order",
    collectionSlug: "atelier-preorder",
    texture: "Straight",
    color: "1B",
    description:
      "Super Double Drawn (SDD) straight bundles — our most uniformly drawn tier. " +
      "95%+ of strands run the full declared length for maximum fullness and a blunt, " +
      "salon-ready finish. Ideal for high-volume installs. Factory drop-shipped.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      return PREORDER_PRICES["SDD"][length] ?? 0;
    },
    images: [
      "https://github.com/user-attachments/assets/717f0955-481e-48dd-916a-13ddd163a0e5",
    ],
  },

  {
    id: "preorder-raw-vietnamese-bodywave-bundles",
    slug: "atelier-preorder-raw-vietnamese-bodywave-bundles",
    name: "Raw Vietnamese Body Wave Bundles",
    displayName: "Atelier Pre-Order — Raw Vietnamese Body Wave Bundles",
    type: "bundle",
    isPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    qualityTier: "Elite Raw",
    preorderDisclaimer: PREORDER_BUNDLE_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Atelier Pre-Order",
    collectionSlug: "atelier-preorder",
    texture: "BodyWave",
    color: "1B",
    description:
      "True raw Vietnamese hair — single donor, cuticle-aligned, and unprocessed. " +
      "The body-wave pattern is natural and dimensional, with exceptional longevity and " +
      "the ability to be lifted, colored, and restyled. Our Elite Raw tier. Factory drop-shipped.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      return PREORDER_PRICES["Elite Raw"][length] ?? 0;
    },
    images: [
      "https://github.com/user-attachments/assets/02ccc457-99e9-4d38-ad63-f5fec333362c",
    ],
  },

  {
    id: "preorder-raw-standard-bodywave-bundles",
    slug: "atelier-preorder-raw-standard-bodywave-bundles",
    name: "Raw Standard Body Wave Bundles",
    displayName: "Atelier Pre-Order — True Raw Standard Body Wave Bundles",
    type: "bundle",
    isPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 18,
    qualityTier: "Raw Standard",
    preorderDisclaimer: PREORDER_BUNDLE_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Atelier Pre-Order",
    collectionSlug: "atelier-preorder",
    texture: "BodyWave",
    color: "1B",
    description:
      "True Raw Standard (首檔) body wave bundles — lightly sorted, cuticle-intact raw hair " +
      "with natural body and movement. A refined entry point into our raw tier. Factory drop-shipped.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      return PREORDER_PRICES["Raw Standard"][length] ?? 0;
    },
    images: [
      "https://github.com/user-attachments/assets/bc5e97f8-0db8-41d3-a9f7-c896010f4ae1",
    ],
  },

  {
    id: "preorder-tier1-bodywave-bundles",
    slug: "atelier-preorder-tier1-bodywave-bundles",
    name: "High Grade Tier-1 Body Wave Bundles",
    displayName: "Atelier Pre-Order — High Grade 'Tier-1' Body Wave Bundles",
    type: "bundle",
    isPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 14,
    qualityTier: "Tier-1",
    preorderDisclaimer: PREORDER_BUNDLE_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Atelier Pre-Order",
    collectionSlug: "atelier-preorder",
    texture: "BodyWave",
    color: "1B",
    description:
      "High Grade Tier-1 (一檔茬) body wave bundles — accessible entry into our factory " +
      "drop-ship line. Cuticle-aligned with natural movement and reliable quality for " +
      "everyday installs. Factory drop-shipped.",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      return PREORDER_PRICES["Tier-1"][length] ?? 0;
    },
    images: [
      "https://github.com/user-attachments/assets/5ff44015-ae79-483a-b25d-cb340b5691b7",
    ],
  }
);

// ======================
// CATALOG PRODUCTS (12 main-shop products + luxury preorders)
// Added via comprehensive catalog update.
// Pricing is delegated to catalogPricing.js matrices + launchPricing.js helper.
// ======================
import {
  TEN_A_TEXTURES,
  TEN_A_PRICES,
  A_PLUS_COLORS,
  A_PLUS_COLOR_PRICES,
  HD_CLOSURE_PRICES,
  HD_CLOSURE_VALID,
  HD_FRONTAL_PRICES,
  HD_FRONTAL_VALID,
  HD_360_PRICES,
  DD_PRICES,
  SDD_VIET_PRICES,
  SDD_GENERIC_PRICES,
  BRAID_14A_PRICES,
  BRAID_14A_PLUS_PRICES,
  FUNMI_TEXTURES,
  FUNMI_PRICES,
  SDD_BULK_PRICES,
  preorder10,
} from "./catalogPricing.js";
import { activeCatalogPrice } from "../utils/launchPricing.js";

// Placeholder image used when dedicated photography is pending
const CATALOG_PLACEHOLDER = "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp";

// ── 1. 10A Natural Bundles ─────────────────────────────────────────────────
products.push({
  id: "cat-10a-natural-bundles",
  slug: "10a-natural-bundles",
  name: "10A Natural Bundles",
  displayName: "10A Natural Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Natural Collection",
  collectionSlug: "natural",
  catalogType: "bundle",
  textures: TEN_A_TEXTURES,
  defaultTexture: "straight",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length, textureKey = "straight") {
    const k = `${length}::${textureKey || "straight"}`;
    const tuple = TEN_A_PRICES[k];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Premium 10A-grade natural bundles — cuticle-aligned, silky, and full from root to tip. " +
    "Available in four textures across lengths 12\"–30\". Ideal for natural installs and everyday wear.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_03.webp",
  ],
});

// ── 2. A+ Color Bundles ─────────────────────────────────────────────────────
products.push({
  id: "cat-a-plus-color-bundles",
  slug: "a-plus-color-bundles",
  name: "A+ Color Bundles (Colored / HD Volume)",
  displayName: "A+ Color Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Color Collection",
  collectionSlug: "color",
  catalogType: "bundle",
  colors: A_PLUS_COLORS,
  defaultColor: "shade-1-4",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length, colorKey = "shade-1-4") {
    const k = `${length}::${colorKey || "shade-1-4"}`;
    const tuple = A_PLUS_COLOR_PRICES[k];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "A+ grade color bundles in five rich shade groups — from classic natural blacks and bronzes " +
    "to warm 27/350, bold 613 blonde, and the coveted P4/27 blend. " +
    "Vibrant, long-lasting color with premium cuticle alignment.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ── 3. SDD Raw Bundles (Generic) ────────────────────────────────────────────
products.push({
  id: "cat-sdd-raw-bundles",
  slug: "sdd-raw-bundles",
  name: "SDD Raw Bundles",
  displayName: "SDD (Super Double Drawn) Raw Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Luxury Raw",
  collectionSlug: "luxury-raw",
  catalogType: "bundle",
  texture: "Natural Straight / Body Wave",
  color: "1B",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = SDD_GENERIC_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Super Double Drawn (SDD) raw bundles — premium grade with 90%+ strand uniformity " +
    "from root to tip. Natural 1B color, cuticle-aligned, and available in straight " +
    "and body wave textures. Ideal for full, blunt-cut installs.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ── 5. SDD Vietnamese Bone Straight Bundles ────────────────────────────────
products.push({
  id: "cat-sdd-viet-straight-bundles",
  slug: "sdd-vietnamese-bone-straight-bundles",
  name: "SDD Vietnamese Bone Straight Bundles",
  displayName: "SDD (Super Double Drawn) Vietnamese Bone Straight Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Luxury Raw",
  collectionSlug: "luxury-raw",
  catalogType: "bundle",
  texture: "Vietnamese Bone Straight",
  color: "1B",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = SDD_VIET_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Super Double Drawn (SDD) Vietnamese bone straight bundles — sourced from a single donor, " +
    "cuticle-intact, and selected for extraordinary strand uniformity from root to tip. " +
    "The gold standard for high-volume, blunt-cut installs.",
  images: [
    "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
    "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
  ],
});

// ── 4. Double Drawn (DD) First-Grade Bundles ───────────────────────────────
products.push({
  id: "cat-dd-first-grade-bundles",
  slug: "double-drawn-first-grade-bundles",
  name: "Double Drawn (DD) Raw Bundles",
  displayName: "Double Drawn (DD) Raw Bundles — First Grade",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Luxury Raw",
  collectionSlug: "luxury-raw",
  catalogType: "bundle",
  texture: "Natural 1B",
  color: "1B",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = DD_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "First-Grade Double Drawn (DD) raw bundles — hand-selected so 80–85% of strands share " +
    "the full declared length. Exceptional volume from root to tip with a natural 1B finish.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ── 6. Funmi (FUMI First-Grade Curly) Bundles ─────────────────────────────
products.push({
  id: "cat-funmi-curly-bundles",
  slug: "funmi-curly-bundles",
  name: "Funmi Bundles",
  displayName: "Funmi Curly Bundles — FUMI First Grade",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Curly Collection",
  collectionSlug: "curly",
  catalogType: "bundle",
  textures: FUNMI_TEXTURES,
  defaultTexture: "spring-curl",
  lengths: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = FUNMI_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "FUMI first-grade curly bundles — springy, defined curl patterns that hold their shape " +
    "and last through washes. Available in Spring Curl, Romance Curl, and Bouncy Curl. " +
    "Perfect for natural volume installs and blowout styles.",
  images: [
    "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ── 7. (already above) A+ Color Bundles — listed as #7 in shop order ──────
// already pushed as cat-a-plus-color-bundles

// ── 8. 10A Natural Bundles — already pushed above ─────────────────────────

// ── 9. SDD Bulk Hair ───────────────────────────────────────────────────────
products.push({
  id: "cat-sdd-bulk-hair",
  slug: "sdd-bulk-hair",
  name: "SDD Bulk Hair",
  displayName: "SDD (Super Double Drawn) Bulk Hair",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Bulk Hair",
  collectionSlug: "bulk-hair",
  catalogType: "bundle",
  texture: "Natural Straight",
  color: "1B",
  lengths: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = SDD_BULK_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Super Double Drawn (SDD) bulk hair — loose weft-free hair for braiding, loc extensions, " +
    "and creative styling. Maximum strand uniformity with natural 1B color.",
  images: [
    CATALOG_PLACEHOLDER,
  ],
});

// ── 14A Braids ─────────────────────────────────────────────────────────────
products.push({
  id: "cat-14a-braids",
  slug: "14a-braids",
  name: "14A Braids",
  displayName: "14A Braids — Standard Raw Human Hair Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Braid Collection",
  collectionSlug: "braids",
  catalogType: "bundle",
  texture: "Natural Straight / Body Wave",
  color: "1B",
  lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  price(length) {
    const tuple = BRAID_14A_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "14A standard raw human hair bundles — genuine raw hair selected for braid installs and " +
    "natural styles. Double drawn technique ensures uniform strand density throughout each weft.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_03.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ── 14A+ Braids ─────────────────────────────────────────────────────────────
products.push({
  id: "cat-14a-plus-braids",
  slug: "14a-plus-braids",
  name: "14A+ Braids",
  displayName: "14A+ Braids — True Raw Human Hair Bundles",
  type: "bundle",
  isMainShopProduct: true,
  usesLaunchPricing: true,
  badge: "Catalog",
  collection: "Braid Collection",
  collectionSlug: "braids",
  catalogType: "bundle",
  texture: "Natural Straight / Body Wave",
  color: "1B",
  lengths: [16, 18, 20, 22, 24, 26, 28],
  price(length) {
    const tuple = BRAID_14A_PLUS_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "14A+ true raw human hair bundles — our highest-grade braid hair. Single-donor raw strands " +
    "with superior cuticle alignment and unmatched longevity. For the most demanding luxury installs.",
  images: [
    CATALOG_PLACEHOLDER,
  ],
});

// ── 10. HD Closure (unified) ──────────────────────────────────────────────
products.push({
  id: "cat-hd-closure",
  slug: "hd-closure",
  name: "HD Closure",
  displayName: "HD Lace Closure",
  type: "closure",
  isMainShopProduct: true,
  badge: "Catalog",
  collection: "HD Lace",
  collectionSlug: "hd-lace",
  catalogType: "hd-closure",
  closureSizes: ["4x4", "5x5", "6x6", "2x6", "7x7"],
  defaultClosureSize: "4x4",
  hdClosureValidSizes: HD_CLOSURE_VALID,
  lengths: [10, 12, 14, 16, 18, 20, 22],
  price(length, sizeKey = "4x4") {
    const k = `${length}::${sizeKey || "4x4"}`;
    const tuple = HD_CLOSURE_PRICES[k];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Premium HD lace closures in 4×4, 5×5, 6×6, 2×6, and 7×7 configurations. " +
    "Ultra-thin HD lace melts seamlessly into any skin tone for an undetectable, " +
    "natural-looking hairline with maximum parting versatility.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
  ],
});

// ── 11. HD Frontal (unified) ─────────────────────────────────────────────
products.push({
  id: "cat-hd-frontal",
  slug: "hd-frontal",
  name: "HD Frontal",
  displayName: "HD Lace Frontal",
  type: "frontal",
  isMainShopProduct: true,
  badge: "Catalog",
  collection: "HD Lace",
  collectionSlug: "hd-lace",
  catalogType: "hd-frontal",
  frontalSizes: ["13x4", "13x6"],
  defaultFrontalSize: "13x4",
  hdFrontalValidSizes: HD_FRONTAL_VALID,
  lengths: [10, 12, 14, 16, 18, 20, 22],
  price(length, sizeKey = "13x4") {
    const k = `${length}::${sizeKey || "13x4"}`;
    const tuple = HD_FRONTAL_PRICES[k];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "Premium HD lace frontals in 13×4 and 13×6 configurations. " +
    "Full hairline coverage with film-thin HD lace that vanishes on all skin tones. " +
    "Enables versatile parting and styling from ear to ear.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
  ],
});

// ── 12. HD Full 360 ─────────────────────────────────────────────────────
products.push({
  id: "cat-hd-360",
  slug: "hd-full-360",
  name: "HD Full 360",
  displayName: "HD Full 360 Lace",
  type: "closure",
  isMainShopProduct: true,
  badge: "Catalog",
  collection: "HD Lace",
  collectionSlug: "hd-lace",
  catalogType: "hd-360",
  lengths: [14, 16, 18, 20, 22],
  price(length) {
    const tuple = HD_360_PRICES[length];
    if (!tuple) return 0;
    return activeCatalogPrice(tuple);
  },
  description:
    "HD Full 360 lace — all-around lace construction for the ultimate styling freedom. " +
    "Wear your hair in high ponytails, updos, or any style that demands a realistic, " +
    "undetectable perimeter hairline.",
  images: [
    "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_01.webp",
    CATALOG_PLACEHOLDER,
  ],
});

// ======================
// LUXURY PREORDER PRODUCTS (Catalog — 10% off retail)
// These extend the existing preorder section.
// ======================
const LUXURY_PREORDER_DISCLAIMER =
  "Pre-order items are sourced from our factory partners and are not held in domestic inventory. " +
  "All pre-order sales are final. No returns or exchanges. " +
  "Estimated dispatch is 14–21 business days from order confirmation.";

products.push(
  // FUMI First-Grade Curly Bundles — Luxury Preorder
  {
    id: "cat-preorder-funmi-curly",
    slug: "luxury-preorder-funmi-curly-bundles",
    name: "FUMI First-Grade Curly Bundles",
    displayName: "Luxury Pre-Order — FUMI First-Grade Curly Bundles",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "FUMI Curly",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    textures: FUNMI_TEXTURES,
    defaultTexture: "spring-curl",
    lengths: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const tuple = FUNMI_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]); // 10% off retail
    },
    description:
      "FUMI first-grade curly bundles — springy, defined curls with exceptional longevity. " +
      "Pre-order at 10% off retail. Factory drop-shipped in 14–21 business days.",
    images: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      CATALOG_PLACEHOLDER,
    ],
  },

  // SDD Vietnamese Bone Straight — Luxury Preorder
  {
    id: "cat-preorder-sdd-viet-straight",
    slug: "luxury-preorder-sdd-vietnamese-bone-straight",
    name: "SDD Vietnamese Bone Straight Bundles",
    displayName: "Luxury Pre-Order — SDD Vietnamese Bone Straight Bundles",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "Super Double Drawn",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    texture: "Vietnamese Bone Straight",
    color: "1B",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const tuple = SDD_VIET_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]);
    },
    description:
      "Super Double Drawn Vietnamese bone straight bundles — 95%+ strand uniformity. " +
      "Pre-order at 10% off retail. Factory drop-shipped in 14–21 business days.",
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      CATALOG_PLACEHOLDER,
    ],
  },

  // Double Drawn First-Grade — Luxury Preorder
  {
    id: "cat-preorder-dd-first-grade",
    slug: "luxury-preorder-double-drawn-first-grade",
    name: "Double Drawn First-Grade Bundles",
    displayName: "Luxury Pre-Order — Double Drawn First-Grade Bundles",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "Double Drawn",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    texture: "Natural 1B",
    color: "1B",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const tuple = DD_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]);
    },
    description:
      "First-Grade Double Drawn raw bundles with 80–85% strand uniformity from root to tip. Raw, cuticle-aligned hair at pre-order savings of 10% off retail. " +
      "Factory drop-shipped in 14–21 business days — inspected for consistent density before dispatch.",
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_Straight_Natural_02.webp",
      CATALOG_PLACEHOLDER,
    ],
  },

  // 14A Braid Hair Bundles — Luxury Preorder
  {
    id: "cat-preorder-14a-braids",
    slug: "luxury-preorder-14a-braid-bundles",
    name: "14A Braid Hair Bundles",
    displayName: "Luxury Pre-Order — 14A Braid Hair Bundles",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "14A Raw",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    texture: "Natural Straight / Body Wave",
    color: "1B",
    lengths: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const tuple = BRAID_14A_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]);
    },
    description:
      "14A-grade raw human hair bundles selected for braid installs and natural protective styles. Genuine cuticle-aligned quality at 10% off retail with pre-order. " +
      "Factory drop-shipped in 14–21 business days — a reliable foundation for long-lasting braids.",
    images: [
      CATALOG_PLACEHOLDER,
    ],
  },

  // 14A+ Braid Hair Bundles — Luxury Preorder
  {
    id: "cat-preorder-14a-plus-braids",
    slug: "luxury-preorder-14a-plus-braid-bundles",
    name: "14A+ Braid Hair Bundles",
    displayName: "Luxury Pre-Order — 14A+ Braid Hair Bundles",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "14A+ Raw",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    texture: "Natural Straight / Body Wave",
    color: "1B",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    price(length) {
      const tuple = BRAID_14A_PLUS_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]);
    },
    description:
      "14A+ premium single-donor raw hair — our highest braid-grade with superior cuticle alignment and lasting softness. Pre-order at 10% off retail. " +
      "Factory drop-shipped in 14–21 business days. Built for the most demanding luxury braid installs.",
    images: [
      CATALOG_PLACEHOLDER,
    ],
  },

  // SDD Bulk Hair — Luxury Preorder
  {
    id: "cat-preorder-sdd-bulk",
    slug: "luxury-preorder-sdd-bulk-hair",
    name: "SDD Bulk Hair",
    displayName: "Luxury Pre-Order — SDD Bulk Hair",
    type: "bundle",
    isPreorder: true,
    isLuxuryPreorder: true,
    shipsFrom: "Factory",
    leadTimeDays: 21,
    leadTimeLabel: "14–21 business days",
    qualityTier: "Super Double Drawn",
    preorderDisclaimer: LUXURY_PREORDER_DISCLAIMER,
    badge: "Pre-Order",
    collection: "Luxury Pre-Order",
    collectionSlug: "luxury-preorder",
    catalogType: "bundle",
    texture: "Natural Straight",
    color: "1B",
    lengths: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    price(length) {
      const tuple = SDD_BULK_PRICES[length];
      if (!tuple) return 0;
      return preorder10(tuple[1]);
    },
    description:
      "Super Double Drawn bulk hair — loose, weft-free for braiding, locs, and creative extensions. " +
      "Pre-order at 10% off retail. Factory drop-shipped in 14–21 business days.",
    images: [
      CATALOG_PLACEHOLDER,
    ],
  }
);

// ======================
// DERIVED COLLECTIONS
// ======================
export const eminenceEssentials = products
  .filter((p) => p.isEssential)
  .sort((a, b) => (a.essentialOrder ?? 99) - (b.essentialOrder ?? 99));

export const preorderProducts = products.filter((p) => p.isPreorder === true);

export const mainShopProducts = products.filter((p) => p.isMainShopProduct === true);

export const readyToShip = products.filter((p) => p.readyToShip === true);

export default products;
