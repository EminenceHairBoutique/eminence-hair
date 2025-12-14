export const products = [
  // ======================
  // SEA COLLECTION
  // ======================
  {
    id: "sea-bodywave",
    slug: "sea-bodywave",
    name: "SEA BodyWave",
    type: "wig",
    verificationCode: "EMH-SEA-2025-90222",
    collection: "SEA Collection",
    texture: "BodyWave",
    description:
      "Raw SEA BodyWave offers an effortless flowing ‘S’ pattern with exceptional softness, movement, and longevity. Ideal for luxurious, voluminous installs and natural glam looks.",
    lengths: [16, 18, 20, 22, 24, 26, 28, 30],
    densities: [140, 180, 200, 250],
    basePrice: 160,
    price(length, density) {
      return this.basePrice + (length - 16) * 10 + (density - 140) * 0.6;
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
    type: "wig",
    verificationCode: "EMH-SEA-2025-90223",
    collection: "SEA Collection",
    texture: "WaterWave",
    description:
      "A naturally defined water-wave pattern sourced from SEA donors. Soft, airy curls with beautiful bounce and movement.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200, 250],
    basePrice: 170,
    price(length, density) {
      return this.basePrice + (length - 16) * 12 + (density - 140) * 0.7;
    },
    images: [
      "/gallery/collections/SEA/Eminence_SEA_WaterWave_Natural_01.webp",
    ],
  },

  // ======================
  // BURMESE COLLECTION
  // ======================
  {
    id: "burmese-deepwave",
    slug: "burmese-deepwave",
    name: "Burmese DeepWave",
    type: "wig",
    verificationCode: "EMH-BUR-2025-90224",
    collection: "Burmese Collection",
    texture: "DeepWave",
    description:
      "Authentic Burmese DeepWave with extraordinary definition and richness. A luxurious curl with unmatched density and longevity.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    basePrice: 175,
    price(length, density) {
      return this.basePrice + (length - 16) * 11 + (density - 140) * 0.65;
    },
    images: [
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_02.webp",
    ],
  },

  // ======================
  // LAVISH COLLECTION
  // ======================
  {
    id: "lavish-loosewave",
    slug: "lavish-loosewave",
    name: "Lavish LooseWave",
    type: "wig",
    verificationCode: "EMH-LAV-2025-90225",
    collection: "Lavish Collection",
    texture: "LooseWave",
    description:
      "Our Lavish LooseWave features a polished, flowing wave pattern with refined texture and a glossy finish. Perfect for effortless luxury.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200, 250],
    basePrice: 185,
    price(length, density) {
      return this.basePrice + (length - 16) * 12 + (density - 140) * 0.6;
    },
    images: [
      "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
    ],
  },

  // ======================
  // STRAIGHT COLLECTION
  // ======================
  {
    id: "silky-straight",
    slug: "silky-straight",
    name: "Raw Silky Straight",
    type: "wig",
    verificationCode: "EMH-STR-2025-90226",
    collection: "Straight Collection",
    texture: "Straight",
    description:
      "Ultra-sleek raw Silky Straight with a soft, natural sheen. Sourced ethically for maximum longevity and premium flow.",
    lengths: [16, 18, 20, 22, 24, 26, 30, 32],
    densities: [140, 180, 200, 250],
    basePrice: 155,
    price(length, density) {
      return this.basePrice + (length - 16) * 9 + (density - 140) * 0.5;
    },
    images: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },

  // ======================
  // COLORWAY NATURAL
  // ======================
  {
    id: "colorway-natural-bodywave",
    slug: "colorway-natural-bodywave",
    name: "Natural Colorway — BodyWave",
    type: "wig",
    verificationCode: "EMH-NAT-2025-90227",
    collection: "Colorway Natural",
    texture: "BodyWave",
    description:
      "Rich, natural 1B tone with soft depth and dimension. Designed to blend seamlessly with natural dark hair.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200],
    basePrice: 150,
    price(length, density) {
      return this.basePrice + (length - 16) * 8 + (density - 140) * 0.5;
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_BodyWave_Natural_01.webp",
    ],
  },

  {
    id: "colorway-natural-straight",
    slug: "colorway-natural-straight",
    name: "Natural Colorway — Straight",
    type: "wig",
    verificationCode: "EMH-NAT-2025-90228",
    collection: "Colorway Natural",
    texture: "Straight",
    description:
      "Pure natural tone with a sleek, smooth straight texture. Ideal for polished minimal looks.",
    lengths: [16, 18, 20, 22, 24, 26],
    densities: [140, 180, 200],
    basePrice: 150,
    price(length, density) {
      return this.basePrice + (length - 16) * 8 + (density - 140) * 0.5;
    },
    images: [
      "/gallery/colorways/Natural/Eminence_Colorways_SilkyStraight_Natural_01.webp",
      "/gallery/colorways/Natural/Eminence_Colorways_SilkyStraight_Natural_02.webp",
    ],
  },

  // ======================
  // COLORWAY 613
  // ======================
  {
    id: "colorway-613",
    slug: "colorway-613",
    name: "613 Blonde Colorway",
    type: "wig",
    verificationCode: "EMH-613-2025-90229",
    collection: "Colorway 613",
    texture: "Curly / BodyWave / Straight compatible",
    description:
      "Our luminous 613 blonde colorway offers a bright, even lift with ultra-soft texture — perfect for dyeing, toning, or wearing as-is.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    basePrice: 190,
    price(length, density) {
      return this.basePrice + (length - 16) * 12 + (density - 140) * 0.6;
    },
    images: [
      "/gallery/colorways/613/Eminence_Colorways_Curly_613_01.webp",
      "/gallery/colorways/613/Eminence_Colorways_Curly_613_02.webp",
    ],
  },

  // ======================
  // TEXTURE BODYWAVE (REFERENCE)
  // ======================
  {
    id: "texture-bodywave",
    slug: "texture-bodywave",
    name: "BodyWave Texture",
    type: "wig",
    verificationCode: "EMH-TEX-2025-90230",
    collection: "Textures",
    texture: "BodyWave",
    description:
      "A detailed reference of our BodyWave pattern — soft, dimensional, and naturally voluminous.",
    lengths: [16, 18, 20, 22, 24, 26, 28],
    densities: [140, 180, 200],
    basePrice: 155,
    price(length, density) {
      return this.basePrice + (length - 16) * 9 + (density - 140) * 0.5;
    },
    images: [
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_01.webp",
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_02.webp",
      "/gallery/textures/BodyWave/Eminence_Textures_BodyWave_Natural_03.webp",
    ],
  },
];

export default products;
