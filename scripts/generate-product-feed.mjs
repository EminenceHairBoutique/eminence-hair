/**
 * Generate Google Merchant Center RSS 2.0 product feed.
 * Run post-build: outputs dist/feed.xml
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");

const SITE_URL = String(
  process.env.VITE_SITE_URL || process.env.SITE_URL || "https://www.eminenceluxuryhair.com"
).replace(/\/+$/, "");

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getMinPrice(product) {
  if (typeof product.price === "number") return product.price;
  if (typeof product.price === "function") {
    // Try to compute minimum price from the shortest length and lowest density
    const lengths = product.lengths || [];
    const densities = product.densities || [];
    const minLen = lengths.length > 0 ? Math.min(...lengths) : 16;
    const minDensity = densities.length > 0 ? Math.min(...densities) : 140;
    try {
      return product.price(minLen, minDensity);
    } catch {
      return null;
    }
  }
  if (product.basePrice) return product.basePrice;
  if (product.setPrice) return product.setPrice;
  return null;
}

async function main() {
  // Dynamic import of products
  const productsPath = path.join(ROOT, "src", "data", "products.js");
  const mod = await import(pathToFileURL(productsPath).href);
  const products = mod.products || mod.default || [];

  const feedItems = [];

  for (const p of products) {
    if (p.hidden) continue;

    const price = getMinPrice(p);
    if (!price || price <= 0) continue;

    const title = p.displayName || p.name;
    const description = p.description || title;
    const link = `${SITE_URL}/products/${p.slug}`;
    const imageLink = p.images?.[0]
      ? (p.images[0].startsWith("http") ? p.images[0] : `${SITE_URL}${p.images[0]}`)
      : "";
    const availability = p.isPreorder ? "preorder" : "in_stock";
    const brand = "Eminence Hair Boutique";

    // Google product category for hair extensions/wigs
    const category = p.type === "wig"
      ? "Health &amp; Beauty &gt; Personal Care &gt; Hair Care &gt; Wigs"
      : "Health &amp; Beauty &gt; Personal Care &gt; Hair Care &gt; Hair Extensions";

    feedItems.push(`    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(description)}</description>
      <link>${escapeXml(link)}</link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:price>${price.toFixed(2)} USD</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${category}</g:google_product_category>
    </item>`);
  }

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Eminence Hair Boutique</title>
    <link>${SITE_URL}</link>
    <description>Luxury raw Cambodian and Burmese hair — HD lace wigs, bundles, and closures.</description>
${feedItems.join("\n")}
  </channel>
</rss>
`;

  await fs.writeFile(path.join(DIST_DIR, "feed.xml"), feed, "utf-8");
  console.log(`✅ Product feed generated: ${feedItems.length} products → dist/feed.xml`);
}

main().catch((err) => {
  console.error("❌ Product feed generation failed:", err);
  process.exit(1);
});
