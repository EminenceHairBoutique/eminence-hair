// src/data/catalogPricing.js
// Centralized pricing matrices derived from the approved source tables.
// All prices in USD (whole numbers).
// Matrix keys vary by catalog: some use composite keys like
// `${length}::${textureOrColorKey}` or `${length}::${sizeKey}`, while others
// are keyed by `${length}` only.

// ======================
// 10A NATURAL BUNDLES
// Texture groups used as keys:
//   "straight"  → Straight / Body Wave
//   "deep"      → Deep Wave / Loose Deep / Water Wave / Deep Curly / Indian Curly / Loose Wave
//   "kinky-curl"→ Kinky Curly
//   "kinky-str" → Kinky Straight
// ======================
export const TEN_A_TEXTURES = [
  { key: "straight",   label: "Straight / Body Wave" },
  { key: "deep",       label: "Deep Wave / Loose Deep / Water Wave / Deep Curly / Indian Curly / Loose Wave" },
  { key: "kinky-curl", label: "Kinky Curly" },
  { key: "kinky-str",  label: "Kinky Straight" },
];

// [launch, retail]
export const TEN_A_PRICES = {
  "12::straight":   [44, 49], "12::deep":   [44, 49], "12::kinky-curl": [44, 49], "12::kinky-str": [44, 49],
  "14::straight":   [44, 49], "14::deep":   [54, 59], "14::kinky-curl": [54, 59], "14::kinky-str": [54, 59],
  "16::straight":   [54, 59], "16::deep":   [54, 59], "16::kinky-curl": [54, 59], "16::kinky-str": [64, 69],
  "18::straight":   [64, 69], "18::deep":   [64, 69], "18::kinky-curl": [64, 69], "18::kinky-str": [64, 69],
  "20::straight":   [64, 69], "20::deep":   [74, 79], "20::kinky-curl": [74, 79], "20::kinky-str": [74, 79],
  "22::straight":   [84, 89], "22::deep":   [84, 89], "22::kinky-curl": [84, 89], "22::kinky-str": [84, 89],
  "24::straight":   [89, 99], "24::deep":   [89, 99], "24::kinky-curl": [89, 99], "24::kinky-str": [89, 99],
  "26::straight":   [99, 109],"26::deep":  [109,119], "26::kinky-curl":[109,119], "26::kinky-str":[109,119],
  "28::straight":  [119, 129],"28::deep":  [119,129], "28::kinky-curl":[119,129], "28::kinky-str":[119,129],
  "30::straight":  [129, 139],"30::deep":  [129,139], "30::kinky-curl":[129,139], "30::kinky-str":[134,149],
};

// ======================
// A+ COLOR BUNDLES
// Color groups used as keys:
//   "shade-1-4"   → Shades 1/2/4
//   "30-99j"      → 30#/99J#
//   "27-350"      → 27 / 350
//   "613-blonde"  → 613 / 60 Blonde
//   "p4-27"       → P4/27
// ======================
export const A_PLUS_COLORS = [
  { key: "shade-1-4",  label: "Shades 1/2/4" },
  { key: "30-99j",     label: "30# / 99J#" },
  { key: "27-350",     label: "27 / 350" },
  { key: "613-blonde", label: "613 / 60 Blonde" },
  { key: "p4-27",      label: "P4/27" },
];

// [launch, retail]
export const A_PLUS_COLOR_PRICES = {
  "12::shade-1-4": [54,59], "12::30-99j": [54,59], "12::27-350": [54,59], "12::613-blonde": [64,69], "12::p4-27": [64,69],
  "14::shade-1-4": [64,69], "14::30-99j": [64,69], "14::27-350": [64,69], "14::613-blonde": [74,79], "14::p4-27": [74,79],
  "16::shade-1-4": [74,79], "16::30-99j": [74,79], "16::27-350": [84,89], "16::613-blonde": [89,99], "16::p4-27": [84,89],
  "18::shade-1-4": [84,89], "18::30-99j": [84,89], "18::27-350": [89,99], "18::613-blonde": [99,109],"18::p4-27": [89,99],
  "20::shade-1-4": [89,99], "20::30-99j": [89,99], "20::27-350": [99,109],"20::613-blonde":[109,119],"20::p4-27":[109,119],
  "22::shade-1-4": [99,109],"22::30-99j":[109,119],"22::27-350":[109,119],"22::613-blonde":[129,139],"22::p4-27":[119,129],
  "24::shade-1-4":[119,129],"24::30-99j":[119,129],"24::27-350":[129,139],"24::613-blonde":[144,159],"24::p4-27":[134,149],
  "26::shade-1-4":[129,139],"26::30-99j":[134,149],"26::27-350":[134,149],"26::613-blonde":[164,179],"26::p4-27":[154,169],
  "28::shade-1-4":[144,159],"28::30-99j":[164,179],"28::27-350":[174,189],"28::613-blonde":[179,199],"28::p4-27":[179,199],
  "30::shade-1-4":[174,189],"30::30-99j":[179,199],"30::27-350":[189,209],"30::613-blonde":[219,239],"30::p4-27":[209,229],
};

// ======================
// HD CLOSURE
// Sizes: 4x4, 5x5, 6x6, 2x6, 7x7
// Note: 10" only supports 4x4 and 5x5
//       6x6 starts at 12", 2x6 starts at 12", 7x7 starts at 14"
// ======================
export const HD_CLOSURE_SIZES = [
  { key: "4x4", label: "4×4" },
  { key: "5x5", label: "5×5" },
  { key: "6x6", label: "6×6" },
  { key: "2x6", label: "2×6" },
  { key: "7x7", label: "7×7" },
];

// Valid size/length combos. key = `${length}::${sizeKey}` → [launch, retail]
export const HD_CLOSURE_PRICES = {
  "10::4x4": [74, 79],  "10::5x5": [89, 99],
  "12::4x4": [84, 89],  "12::5x5": [99, 109], "12::6x6": [129,139], "12::2x6": [84, 89],
  "14::4x4": [84, 89],  "14::5x5": [109,119], "14::6x6": [134,149], "14::2x6": [84, 89],  "14::7x7": [164,179],
  "16::4x4": [89, 99],  "16::5x5": [119,129], "16::6x6": [154,169], "16::2x6": [89, 99],  "16::7x7": [179,199],
  "18::4x4": [89, 99],  "18::5x5": [129,139], "18::6x6": [164,179], "18::2x6": [89, 99],  "18::7x7": [199,219],
  "20::4x4": [99, 109], "20::5x5": [129,139], "20::6x6": [174,189], "20::2x6": [99, 109], "20::7x7": [209,229],
  "22::4x4": [119,129], "22::5x5": [144,159], "22::6x6": [189,209], "22::2x6": [109,119], "22::7x7": [254,279],
};

// Which sizes are valid at each length
export const HD_CLOSURE_VALID = {
  10: ["4x4","5x5"],
  12: ["4x4","5x5","6x6","2x6"],
  14: ["4x4","5x5","6x6","2x6","7x7"],
  16: ["4x4","5x5","6x6","2x6","7x7"],
  18: ["4x4","5x5","6x6","2x6","7x7"],
  20: ["4x4","5x5","6x6","2x6","7x7"],
  22: ["4x4","5x5","6x6","2x6","7x7"],
};

// ======================
// HD FRONTAL
// Sizes: 13x4, 13x6
// Note: 10" only supports 13x4 (no 13x6 at 10")
// ======================
export const HD_FRONTAL_SIZES = [
  { key: "13x4", label: "13×4" },
  { key: "13x6", label: "13×6" },
];

// key = `${length}::${sizeKey}` → [launch, retail]
export const HD_FRONTAL_PRICES = {
  "10::13x4": [119,129],
  "12::13x4": [144,159], "12::13x6": [189,209],
  "14::13x4": [154,169], "14::13x6": [199,219],
  "16::13x4": [164,179], "16::13x6": [209,229],
  "18::13x4": [174,189], "18::13x6": [224,249],
  "20::13x4": [189,209], "20::13x6": [244,269],
  "22::13x4": [199,219], "22::13x6": [264,289],
};

export const HD_FRONTAL_VALID = {
  10: ["13x4"],
  12: ["13x4","13x6"],
  14: ["13x4","13x6"],
  16: ["13x4","13x6"],
  18: ["13x4","13x6"],
  20: ["13x4","13x6"],
  22: ["13x4","13x6"],
};

// ======================
// HD FULL 360
// key = length → [launch, retail]
// ======================
export const HD_360_PRICES = {
  14: [244, 269],
  16: [264, 289],
  18: [279, 309],
  20: [299, 329],
  22: [319, 349],
};

// ======================
// DOUBLE DRAWN FIRST-GRADE BUNDLES
// Texture: Natural 1B (single texture)
// [launch, retail]
// ======================
export const DD_PRICES = {
  12: [74, 79],
  14: [84, 89],
  16: [94, 99],
  18: [109, 119],
  20: [129, 139],
  22: [149, 159],
  24: [169, 179],
  26: [189, 199],
  28: [209, 219],
  30: [224, 239],
};

// ======================
// SDD (SUPER DOUBLE DRAWN) RAW BUNDLES — GENERIC
// Texture: Natural Straight / Body Wave
// Standard SDD tier (below Vietnamese premium)
// [launch, retail]
// ======================
export const SDD_GENERIC_PRICES = {
  12: [94, 99],
  14: [104, 109],
  16: [119, 129],
  18: [134, 149],
  20: [154, 169],
  22: [179, 194],
  24: [204, 219],
  26: [229, 249],
  28: [254, 279],
  30: [279, 299],
};

// ======================
// SDD VIETNAMESE BONE STRAIGHT BUNDLES
// Texture: Vietnamese Bone Straight (1B)
// [launch, retail]
// ======================
export const SDD_VIET_PRICES = {
  12: [109, 119],
  14: [119, 129],
  16: [134, 149],
  18: [154, 169],
  20: [174, 189],
  22: [199, 219],
  24: [224, 249],
  26: [254, 279],
  28: [279, 309],
  30: [309, 339],
};

// ======================
// 14A BRAID HAIR BUNDLES
// Texture: Natural Straight / Body Wave
// [launch, retail]
// ======================
export const BRAID_14A_PRICES = {
  12: [84, 89],
  14: [94, 99],
  16: [104, 109],
  18: [124, 129],
  20: [149, 154],
  22: [174, 179],
  24: [199, 209],
  26: [229, 239],
  28: [259, 269],
  30: [289, 299],
};

// ======================
// 14A+ BRAID HAIR BUNDLES
// Texture: Natural Straight / Body Wave
// Lengths start at 16" (RTI table only shows 16/18/20+)
// [launch, retail]
// ======================
export const BRAID_14A_PLUS_PRICES = {
  16: [134, 149],
  18: [159, 169],
  20: [184, 199],
  22: [219, 229],
  24: [249, 269],
  26: [279, 299],
  28: [309, 329],
};

// ======================
// FUMI FIRST-GRADE CURLY BUNDLES (Funmi)
// Texture: Curly (various curl patterns)
// [launch, retail]
// ======================
export const FUNMI_TEXTURES = [
  { key: "spring-curl", label: "Spring Curl" },
  { key: "romance-curl", label: "Romance Curl" },
  { key: "bouncy-curl", label: "Bouncy Curl" },
];

// Single pricing tier (all Funmi textures same price)
// [launch, retail]
export const FUNMI_PRICES = {
  10: [74, 79],
  12: [84, 89],
  14: [94, 99],
  16: [104, 109],
  18: [119, 129],
  20: [139, 149],
  22: [164, 174],
  24: [184, 199],
  26: [209, 224],
  28: [234, 249],
  30: [259, 274],
};

// ======================
// SDD BULK HAIR
// Sold per unit/bundle
// [launch, retail]
// ======================
export const SDD_BULK_PRICES = {
  10: [49, 54],
  12: [59, 64],
  14: [69, 74],
  16: [79, 84],
  18: [89, 94],
  20: [99, 104],
  22: [119, 124],
  24: [134, 139],
  26: [149, 154],
  28: [169, 174],
  30: [189, 194],
};

// ======================
// PREORDER PRICING (10% off retail for luxury preorder page)
// Derived from retail prices above
// ======================
export function preorder10(retailPrice) {
  return Math.round(retailPrice * 0.90);
}

// ======================
// READY-TO-INSTALL PACKAGE CATALOG
// Each entry: { id, collection, texture, bundleSet, bundlesPrice, closure5x5, frontal13x4, preorder15Closure, preorder15Frontal, isPreorderEligible, notes }
// ======================
export const RTI_PACKAGES = [
  // ── 10A Natural Bundles ──────────────────────────────────
  { id:"rti-10a-sbw-121416", collection:"10A Natural Bundles", texture:"Straight / Body Wave", bundleSet:"12/14/16",
    bundlesPrice:149, closure5x5:239, frontal13x4:284, isPreorderEligible:false },
  { id:"rti-10a-sbw-141618", collection:"10A Natural Bundles", texture:"Straight / Body Wave", bundleSet:"14/16/18",
    bundlesPrice:164, closure5x5:269, frontal13x4:314, isPreorderEligible:false },
  { id:"rti-10a-sbw-161820", collection:"10A Natural Bundles", texture:"Straight / Body Wave", bundleSet:"16/18/20",
    bundlesPrice:184, closure5x5:294, frontal13x4:339, isPreorderEligible:false },
  { id:"rti-10a-sbw-182022", collection:"10A Natural Bundles", texture:"Straight / Body Wave", bundleSet:"18/20/22",
    bundlesPrice:214, closure5x5:329, frontal13x4:374, isPreorderEligible:false },

  // ── A+ Vietnamese High-Fullness Natural Bundles ──────────
  { id:"rti-aviet-sbw-121416", collection:"A+ Vietnamese High-Fullness Natural Bundles", texture:"Straight / Body Wave", bundleSet:"12/14/16",
    bundlesPrice:194, closure5x5:284, frontal13x4:329, isPreorderEligible:false },
  { id:"rti-aviet-sbw-141618", collection:"A+ Vietnamese High-Fullness Natural Bundles", texture:"Straight / Body Wave", bundleSet:"14/16/18",
    bundlesPrice:224, closure5x5:324, frontal13x4:369, isPreorderEligible:false },
  { id:"rti-aviet-sbw-161820", collection:"A+ Vietnamese High-Fullness Natural Bundles", texture:"Straight / Body Wave", bundleSet:"16/18/20",
    bundlesPrice:249, closure5x5:359, frontal13x4:404, isPreorderEligible:false },
  { id:"rti-aviet-sbw-182022", collection:"A+ Vietnamese High-Fullness Natural Bundles", texture:"Straight / Body Wave", bundleSet:"18/20/22",
    bundlesPrice:279, closure5x5:394, frontal13x4:439, isPreorderEligible:false },

  // ── Double Drawn First-Grade Bundles ────────────────────
  { id:"rti-dd-1b-121416", collection:"Double Drawn First-Grade Bundles", texture:"Natural 1B", bundleSet:"12/14/16",
    bundlesPrice:229, closure5x5:324, frontal13x4:369, preorder15Closure:279, preorder15Frontal:314, isPreorderEligible:true },
  { id:"rti-dd-1b-141618", collection:"Double Drawn First-Grade Bundles", texture:"Natural 1B", bundleSet:"14/16/18",
    bundlesPrice:269, closure5x5:369, frontal13x4:414, preorder15Closure:314, preorder15Frontal:354, isPreorderEligible:true },
  { id:"rti-dd-1b-161820", collection:"Double Drawn First-Grade Bundles", texture:"Natural 1B", bundleSet:"16/18/20",
    bundlesPrice:324, closure5x5:429, frontal13x4:474, preorder15Closure:364, preorder15Frontal:404, isPreorderEligible:true },
  { id:"rti-dd-1b-182022", collection:"Double Drawn First-Grade Bundles", texture:"Natural 1B", bundleSet:"18/20/22",
    bundlesPrice:399, closure5x5:509, frontal13x4:554, preorder15Closure:434, preorder15Frontal:474, isPreorderEligible:true },

  // ── SDD Vietnamese Bone Straight Bundles ────────────────
  { id:"rti-sddviet-vbs-121416", collection:"SDD Vietnamese Bone Straight Bundles", texture:"Vietnamese Bone Straight (1B)", bundleSet:"12/14/16",
    bundlesPrice:344, closure5x5:429, frontal13x4:474, preorder15Closure:364, preorder15Frontal:404, isPreorderEligible:true },
  { id:"rti-sddviet-vbs-141618", collection:"SDD Vietnamese Bone Straight Bundles", texture:"Vietnamese Bone Straight (1B)", bundleSet:"14/16/18",
    bundlesPrice:379, closure5x5:474, frontal13x4:519, preorder15Closure:404, preorder15Frontal:444, isPreorderEligible:true },
  { id:"rti-sddviet-vbs-161820", collection:"SDD Vietnamese Bone Straight Bundles", texture:"Vietnamese Bone Straight (1B)", bundleSet:"16/18/20",
    bundlesPrice:454, closure5x5:554, frontal13x4:599, preorder15Closure:474, preorder15Frontal:509, isPreorderEligible:true },
  { id:"rti-sddviet-vbs-182022", collection:"SDD Vietnamese Bone Straight Bundles", texture:"Vietnamese Bone Straight (1B)", bundleSet:"18/20/22",
    bundlesPrice:564, closure5x5:674, frontal13x4:719, preorder15Closure:574, preorder15Frontal:614, isPreorderEligible:true },

  // ── 14A Braid Hair Bundles ───────────────────────────────
  { id:"rti-14a-sbw-121416", collection:"14A Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"12/14/16",
    bundlesPrice:259, closure5x5:349, frontal13x4:394, preorder15Closure:299, preorder15Frontal:334, isPreorderEligible:true },
  { id:"rti-14a-sbw-141618", collection:"14A Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"14/16/18",
    bundlesPrice:419, closure5x5:509, frontal13x4:554, preorder15Closure:434, preorder15Frontal:474, isPreorderEligible:true },
  { id:"rti-14a-sbw-161820", collection:"14A Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"16/18/20",
    bundlesPrice:494, closure5x5:594, frontal13x4:639, preorder15Closure:504, preorder15Frontal:544, isPreorderEligible:true },
  { id:"rti-14a-sbw-182022", collection:"14A Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"18/20/22",
    bundlesPrice:584, closure5x5:689, frontal13x4:734, preorder15Closure:589, preorder15Frontal:624, isPreorderEligible:true },

  // ── 14A+ Braid Hair Bundles ──────────────────────────────
  { id:"rti-14ap-sbw-161820", collection:"14A+ Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"16/18/20",
    bundlesPrice:559, closure5x5:654, frontal13x4:699, preorder15Closure:559, preorder15Frontal:594, isPreorderEligible:true },
  { id:"rti-14ap-sbw-182022", collection:"14A+ Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"18/20/22",
    bundlesPrice:649, closure5x5:754, frontal13x4:799, preorder15Closure:644, preorder15Frontal:679, isPreorderEligible:true },
  { id:"rti-14ap-sbw-202224", collection:"14A+ Braid Hair Bundles", texture:"Natural Straight / Body Wave", bundleSet:"20/22/24",
    bundlesPrice:744, closure5x5:844, frontal13x4:909, preorder15Closure:719, preorder15Frontal:774, isPreorderEligible:true },
];
