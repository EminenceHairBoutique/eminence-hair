// src/data/preorderImages.js
// Maps pre-order product slugs to hero/gallery images.
// Hero image: first entry. Gallery: subsequent entries.
// Falls back to existing gallery assets since no standalone pre-order hero images exist yet.

export const preorderImages = {
  "preorder-raw-vietnamese": {
    hero: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
    gallery: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_02.webp",
    ],
  },
  "preorder-raw-wefts-natural": {
    hero: "/gallery/collections/Burmese/Eminence_Burmese_BodyWave_Natural_01.webp",
    gallery: [
      "/gallery/collections/Burmese/Eminence_Burmese_BodyWave_Natural_01.webp",
      "/gallery/collections/Burmese/Eminence_Burmese_BodyWave_Natural_02.webp",
    ],
  },
  "preorder-high-grade-tier1": {
    hero: "/gallery/collections/Lavish/Eminence_Lavish_BodyWave_Natural_01.webp",
    gallery: [
      "/gallery/collections/Lavish/Eminence_Lavish_BodyWave_Natural_01.webp",
      "/gallery/collections/Lavish/Eminence_Lavish_BodyWave_Natural_02.webp",
    ],
  },
  "preorder-true-raw-standard": {
    hero: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_03.webp",
    gallery: [
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_03.webp",
      "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_04.webp",
    ],
  },
  "preorder-double-drawn": {
    hero: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
    gallery: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_02.webp",
    ],
  },
  "preorder-super-double-drawn": {
    hero: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_03.webp",
    gallery: [
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_03.webp",
      "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_04.webp",
    ],
  },
};

export default preorderImages;
