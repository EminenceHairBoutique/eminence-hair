/*
  Build-time SEO generator for Vite SPA deployments on Vercel.

  Why this exists:
  - React Router SPAs render <title>/<meta> client-side.
  - Search engines and social crawlers (iMessage, Facebook, X, etc.) often need
    route-specific HTML on first request for reliable indexing + link previews.

  What this script does (post-build):
  - Reads dist/index.html
  - Writes dist/<route>/index.html pages for important routes (products, collections, etc.)
  - Generates dist/sitemap.xml
  - Writes dist/robots.txt (overriding any from /public)

  Run via package.json: "vite build && node scripts/generate-static-seo.mjs"
*/

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, "dist");

const SITE_NAME = "Eminence Hair Boutique";
const DEFAULT_DESCRIPTION =
  "100% raw Cambodian and Burmese hair. HD lace. Elevate your game with true luxury.";

const SITE_URL = String(
  process.env.VITE_SITE_URL || process.env.SITE_URL || "https://www.eminenceluxuryhair.com"
).replace(/\/+$/, "");

const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/eminence_og_banner.jpg`;

const SEO_BEGIN = "<!-- SEO:BEGIN -->";
const SEO_END = "<!-- SEO:END -->";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function abs(pathOrUrl) {
  const val = String(pathOrUrl || "").trim();
  if (!val) return "";
  if (/^https?:\/\//i.test(val)) return val;
  return `${SITE_URL}${val.startsWith("/") ? "" : "/"}${val}`;
}

function ensureSiteUrl(pathname) {
  const p = String(pathname || "/");
  if (p === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}

function replaceSeoBlock(html, newBlock) {
  const start = html.indexOf(SEO_BEGIN);
  const end = html.indexOf(SEO_END);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      "Could not find SEO markers in dist/index.html. Ensure index.html contains <!-- SEO:BEGIN --> and <!-- SEO:END -->."
    );
  }
  return (
    html.slice(0, start + SEO_BEGIN.length) +
    "\n" +
    newBlock.trim() +
    "\n" +
    html.slice(end)
  );
}

function renderJsonLd({ url, title, description, images, product }) {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: images?.[0] || DEFAULT_OG_IMAGE,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
  ];

  if (product) {
    graph.push(product);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function renderSeoMeta({
  pathname,
  title,
  description,
  images = [],
  ogType = "website",
  noindex = false,
  jsonLd,
}) {
  const url = ensureSiteUrl(pathname);
  const cleanTitle = String(title || "").trim() || SITE_NAME;
  const finalTitle = cleanTitle.includes(SITE_NAME)
    ? cleanTitle
    : `${cleanTitle} | ${SITE_NAME}`;
  const finalDescription = String(description || DEFAULT_DESCRIPTION).trim();

  const imgList = (Array.isArray(images) ? images : [])
    .map(abs)
    .filter(Boolean);
  const finalImages = imgList.length ? imgList : [DEFAULT_OG_IMAGE];

  const robotsContent = noindex
    ? "noindex,nofollow"
    : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1";

  const lines = [];

  lines.push(`  <title>${escapeHtml(finalTitle)}</title>`);
  lines.push(
    `  <meta name="description" content="${escapeHtml(finalDescription)}" />`
  );
  lines.push(`  <link rel="canonical" href="${escapeHtml(url)}" />`);

  lines.push(`  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`);
  lines.push(`  <meta property="og:title" content="${escapeHtml(finalTitle)}" />`);
  lines.push(
    `  <meta property="og:description" content="${escapeHtml(finalDescription)}" />`
  );
  for (const img of finalImages) {
    lines.push(`  <meta property="og:image" content="${escapeHtml(img)}" />`);
  }
  lines.push(`  <meta property="og:type" content="${escapeHtml(ogType)}" />`);
  lines.push(`  <meta property="og:url" content="${escapeHtml(url)}" />`);

  lines.push(`  <meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`  <meta name="twitter:title" content="${escapeHtml(finalTitle)}" />`);
  lines.push(
    `  <meta name="twitter:description" content="${escapeHtml(finalDescription)}" />`
  );
  lines.push(`  <meta name="twitter:image" content="${escapeHtml(finalImages[0])}" />`);

  lines.push(`  <meta name="robots" content="${escapeHtml(robotsContent)}" />`);
  if (jsonLd) {
    const safeJson = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
    lines.push('  <script type="application/ld+json" id="ld-json">');
    lines.push(`    ${safeJson}`);
    lines.push("  </script>");
  }

  return lines.join("\n");
}

function buildOffersForProduct(p) {
  // Price range (many variants) → AggregateOffer
  let low = null;
  let high = null;
  let offerCount = 0;

  try {
    const lengths = Array.isArray(p.lengths) ? p.lengths : [];
    const densities = Array.isArray(p.densities) ? p.densities : [];
    const laceOptions = p.type === "wig" ? ["Transparent Lace", "HD Lace"] : [null];

    for (const L of lengths) {
      for (const D of densities) {
        for (const lace of laceOptions) {
          const price =
            typeof p.price === "function"
              ? Number(p.price(L, D, lace || undefined) || 0)
              : 0;
          if (!price) continue;
          offerCount += 1;
          low = low == null ? price : Math.min(low, price);
          high = high == null ? price : Math.max(high, price);
        }
      }
    }
  } catch {
    // If pricing changes, fall back to no offers.
  }

  if (low == null) return null;

  const url = ensureSiteUrl(`/products/${p.slug}`);

  if (low === high) {
    return {
      "@type": "Offer",
      price: low,
      priceCurrency: "USD",
      url,
      availability: p.isPreorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_NAME },
    };
  }

  return {
    "@type": "AggregateOffer",
    lowPrice: low,
    highPrice: high,
    offerCount: offerCount || undefined,
    priceCurrency: "USD",
    url,
    availability: p.isPreorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    seller: { "@type": "Organization", name: SITE_NAME },
  };
}

async function main() {
  // Ensure dist exists
  await fs.mkdir(DIST_DIR, { recursive: true });

  const indexPath = path.join(DIST_DIR, "index.html");
  const baseHtml = await fs.readFile(indexPath, "utf8");

  // Import products (ESM)
  const productsModulePath = pathToFileURL(
    path.join(ROOT, "src", "data", "products.js")
  ).href;
  const { products } = await import(productsModulePath);

  const collectionSlugs = Array.from(
    new Set(
      (products || [])
        .map((p) => String(p.collectionSlug || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  const COLLECTION_META = {
    "eminence-essentials": {
      title: "Eminence Essentials",
      description:
        "A focused edit of the pieces our clients choose most — refined, realistic, and designed for everyday confidence.",
    },
    natural: {
      title: "Colorway Natural",
      description:
        "Our natural edit — timeless tones with soft dimension, created to blend seamlessly and wear beautifully.",
    },
    "613": {
      title: "Colorway 613",
      description: "Bright, luxe blonde — crafted for clean color and high-shine movement.",
    },
    textures: {
      title: "Texture Studies",
      description: "Macro detail and pattern references to help you choose your ideal texture.",
    },
  };

  const staticRoutes = [
    {
      pathname: "/",
      title: "Raw Cambodian Hair & HD Lace Wigs — Luxury Hair Boutique",
      description:
        "Shop 100% raw Cambodian & Burmese HD lace wigs, bundles, and closures. 180–250% density, ethically sourced, third-party verified. Free shipping on select orders.",
      ogType: "website",
    },
    {
      pathname: "/shop",
      title: "Shop Luxury Wigs, Bundles & Closures",
      description: "Browse raw Cambodian & Burmese HD lace wigs, virgin hair bundles, and closures. Filter by texture, density, and collection. Secure checkout with Stripe.",
      ogType: "website",
    },

    {
      pathname: "/shop/wigs",
      title: "Shop HD Lace Wigs — Raw Cambodian & Burmese Hair",
      description: "Shop luxury HD lace wigs in straight, body wave, deep wave, and curly textures. 180–250% density, raw Cambodian and Burmese hair.",
      ogType: "website",
    },
    {
      pathname: "/shop/bundles",
      title: "Shop Raw Hair Bundles — Virgin Cambodian & Burmese",
      description: "Shop raw virgin hair bundles in multiple textures and lengths. Ethically sourced Cambodian and Burmese hair with cuticle alignment.",
      ogType: "website",
    },
    {
      pathname: "/shop/closures",
      title: "Shop HD Lace Closures & Frontals",
      description: "Shop HD lace closures and frontals designed for seamless installs. Transparent and HD lace options available.",
      ogType: "website",
    },
    {
      pathname: "/shop/preorders",
      title: "Pre-Order — Factory-Direct Luxury Hair",
      description: "Shop pre-order bundles and wigs factory drop-shipped directly from our partner atelier. Raw Vietnamese, Double Drawn, Super Double Drawn, and more.",
      ogType: "website",
    },

    {
      pathname: "/collections",
      title: "Hair Collections — SEA, Burmese, Lavish, 613 Blonde & More",
      description: "Explore Eminence origin-driven collections: raw Cambodian SEA, Burmese deep wave, Lavish wave, 613 blonde, and seasonal editorial edits.",
      ogType: "website",
    },

    {
      pathname: "/collections/fw-2025",
      title: "F/W 2025 Collection Lookbook",
      description:
        "Editorial silhouettes and couture textures curated for Fall/Winter 2025 — a refined lookbook for your next transformation.",
      ogType: "website",
    },

    {
      pathname: "/gallery",
      title: "Gallery — Editorial Hair Photography & Texture Studies",
      description: "Explore editorial imagery, real-life texture studies, and campaign photography featuring Eminence luxury hair.",
      ogType: "website",
    },
    {
      pathname: "/authenticity",
      title: "Hair Authenticity — Third-Party Lab Verified Quality",
      description: "Every Eminence piece is independently inspected by a CNAS-accredited laboratory. Verify authenticity, view inspection reports, and scan your QR certificate.",
      ogType: "website",
    },
    {
      pathname: "/care",
      title: "Raw Hair Care Guide — Wash, Style & Maintain Luxury Hair",
      description: "Expert care guide for raw Cambodian and Burmese hair. Learn proper wash routines, heat styling tips, storage methods, and maintenance for lasting softness and luster.",
      ogType: "website",
    },
    {
      pathname: "/medical-hair",
      title: "Medical Wigs & Cranial Prostheses — HSA/FSA Eligible",
      description:
        "Luxury medical hair solutions for alopecia, chemotherapy, and hair loss conditions. HSA/FSA reimbursement guidance, private fitting, and compassionate service.",
      ogType: "website",
    },
    {
      pathname: "/faqs",
      title: "FAQs — Shipping, Returns, Hair Care & Custom Orders",
      description: "Get answers about Eminence Hair shipping times, return policy, raw hair care, custom orders, medical wigs, and payment options including installments.",
      ogType: "website",
    },
    {
      pathname: "/private-consult",
      title: "Book a Private Hair Consultation — Virtual & In-Person",
      description:
        "Schedule a one-on-one consultation with our concierge team. Get expert guidance on wig selection, density, texture, medical hair, and custom atelier orders.",
      ogType: "website",
    },
    {
      pathname: "/custom-orders",
      title: "Custom Orders — Bespoke Wigs & Hair Pieces",
      description: "Request a custom wig or hair piece tailored to your specifications: texture, density, color, lace type, and cap construction.",
      ogType: "website",
    },
    {
      pathname: "/custom-atelier",
      title: "Custom Atelier — Build Your Perfect Wig",
      description:
        "Build a guided custom request — choose texture, color, length, lace type, and fit — with concierge confirmation and factory fulfillment.",
      ogType: "website",
    },
    {
      pathname: "/about",
      title: "Our Story — Ethically Sourced Raw Cambodian & Burmese Hair",
      description: "Eminence Hair Boutique sources 100% raw Cambodian and Burmese hair, crafted in our partner atelier with third-party lab verification. Learn about our quality standards.",
      ogType: "website",
    },
    {
      pathname: "/contact",
      title: "Contact Our Concierge Team — Support & Custom Orders",
      description: "Reach the Eminence Hair concierge team for order support, custom wig requests, wholesale inquiries, and styling consultations. Response within 24 hours.",
      ogType: "website",
    },
    {
      pathname: "/returns",
      title: "Shipping & Returns Policy — Domestic & International",
      description: "Eminence Hair shipping rates, delivery timelines, international options, and our return and exchange policy for wigs, bundles, and closures.",
      ogType: "website",
    },
    {
      pathname: "/privacy",
      title: "Privacy Policy",
      description: "How Eminence Hair Boutique collects, uses, and protects your personal information. CCPA and privacy rights explained.",
      ogType: "website",
    },

    {
      pathname: "/privacy-choices",
      title: "Your Privacy Choices",
      description: "Manage your privacy preferences and cookie settings for Eminence Hair Boutique.",
      ogType: "website",
    },

    {
      pathname: "/terms",
      title: "Terms & Conditions",
      description: "Terms and conditions for shopping with Eminence Hair Boutique, including order policies, intellectual property, and dispute resolution.",
      ogType: "website",
    },
    {
      pathname: "/atelier/try-on",
      title: "Virtual Try-On — AI-Powered Wig Preview",
      description:
        "Try on Eminence Hair wigs virtually using AI face detection. Upload a photo and preview how different styles, textures, and lengths look on you.",
      ogType: "website",
    },
    {
      pathname: "/ready-to-ship",
      title: "Ready-to-Ship Wigs & Bundles — Fast 2–3 Day Dispatch",
      description: "Shop in-stock Eminence wigs and bundles ready for 2–3 day dispatch. No wait times — luxury raw hair prepared for immediate shipping.",
      ogType: "website",
    },
    {
      pathname: "/consultation",
      title: "Book a Private Hair Consultation — Virtual & In-Person",
      description: "Schedule a one-on-one consultation with our concierge team. Get expert guidance on wig selection, density, texture, medical hair, and custom atelier orders.",
      ogType: "website",
    },
    {
      pathname: "/start-here",
      title: "Start Here — New to Eminence Hair Boutique",
      description: "New to luxury raw hair? Start here to understand our collections, textures, lace types, density options, and how to choose your perfect piece.",
      ogType: "website",
    },

    // Noindex routes (not in sitemap)
    {
      pathname: "/checkout",
      title: "Secure Checkout",
      description: "Encrypted checkout with discreet packaging and verified luxury hair.",
      ogType: "website",
      noindex: true,
    },
    {
      pathname: "/success",
      title: "Order Confirmed",
      description: "Your Eminence Hair order has been successfully placed.",
      ogType: "website",
      noindex: true,
    },
    {
      pathname: "/cancel",
      title: "Payment Cancelled",
      description: "Your payment was cancelled.",
      ogType: "website",
      noindex: true,
    },
    {
      pathname: "/account",
      title: "My Account",
      description: "Manage your Eminence Hair account, orders, and preferences.",
      ogType: "website",
      noindex: true,
    },
    {
      pathname: "/cart",
      title: "Cart",
      description: "Review your cart items.",
      ogType: "website",
      noindex: true,
    },
  ];

  // Collection pages
  const collectionRoutes = collectionSlugs.map((slug) => {
    const meta = COLLECTION_META[String(slug).toLowerCase()];
    const title = meta?.title || String(slug)
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      pathname: `/collections/${slug}`,
      title: `${title} | Collections`,
      description:
        meta?.description ||
        "An Eminence collection crafted for softness, realism, and longevity — luxury that performs beautifully in real life.",
      ogType: "website",
    };
  });

  // Product pages
  const productRoutes = (products || []).map((p) => {
    const title = p.displayName || p.name || "Product";
    const description = p.description || DEFAULT_DESCRIPTION;

    // Always include a JPEG-safe banner first for maximum compatibility.
    const images = [DEFAULT_OG_IMAGE, ...(Array.isArray(p.images) ? p.images.slice(0, 1).map(abs) : [])];

    const url = ensureSiteUrl(`/products/${p.slug}`);
    const offers = buildOffersForProduct(p);

    const productJsonLd = {
      "@type": "Product",
      "@id": `${url}#product`,
      name: title,
      description,
      sku: p.verificationCode,
      brand: { "@type": "Brand", name: SITE_NAME },
      url,
      image: (Array.isArray(p.images) ? p.images.map(abs).filter(Boolean) : []).slice(0, 10),
      ...(offers ? { offers } : {}),
    };

    return {
      pathname: `/products/${p.slug}`,
      title,
      description,
      ogType: "product",
      images,
      jsonLd: renderJsonLd({
        url,
        title: `${title} | ${SITE_NAME}`,
        description,
        images,
        product: productJsonLd,
      }),
    };
  });

  const routes = [...staticRoutes, ...collectionRoutes, ...productRoutes];

  // Write route HTML files
  for (const route of routes) {
    const pathname = route.pathname;

    const url = ensureSiteUrl(pathname);
    const images = route.images || [DEFAULT_OG_IMAGE];

    const jsonLd =
      route.jsonLd ||
      renderJsonLd({
        url,
        title: route.title,
        description: route.description,
        images: images.map(abs),
      });

    const seoBlock = renderSeoMeta({
      pathname,
      title: route.title,
      description: route.description,
      images,
      ogType: route.ogType,
      noindex: Boolean(route.noindex),
      jsonLd,
    });

    const finalHtml = replaceSeoBlock(baseHtml, seoBlock);

    // / -> dist/index.html, /path -> dist/path/index.html
    const outFile =
      pathname === "/"
        ? path.join(DIST_DIR, "index.html")
        : path.join(DIST_DIR, pathname.replace(/^\//, ""), "index.html");

    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, finalHtml, "utf8");
  }

  // robots.txt (override)
  const robots = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /api/",
    "Disallow: /checkout",
    "Disallow: /success",
    "Disallow: /cancel",
    "Disallow: /account",
    "Disallow: /cart",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  await fs.writeFile(path.join(DIST_DIR, "robots.txt"), robots, "utf8");

  // sitemap.xml
  const today = new Date().toISOString().slice(0, 10);

  function sitemapPriority(pathname) {
    if (pathname === "/") return "1.0";
    if (pathname.startsWith("/collections")) return "0.8";
    if (pathname.startsWith("/shop")) return "0.8";
    if (pathname.startsWith("/products/")) return "0.7";
    if (["/about", "/care", "/faqs", "/consultation", "/medical-hair", "/authenticity", "/ready-to-ship"].includes(pathname)) return "0.6";
    return "0.5";
  }

  function sitemapFreq(pathname) {
    if (pathname === "/") return "weekly";
    if (pathname.startsWith("/products/") || pathname.startsWith("/shop")) return "weekly";
    if (pathname.startsWith("/collections")) return "weekly";
    return "monthly";
  }

  const sitemapRoutes = routes
    .filter((r) => !r.noindex)
    .map((r) => ({ url: ensureSiteUrl(r.pathname), pathname: r.pathname }))
    .filter((u) => !u.url.includes("/account"))
    .sort((a, b) => a.url.localeCompare(b.url));

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapRoutes
      .map(
        (r) =>
          `  <url>\n    <loc>${escapeHtml(r.url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${sitemapFreq(r.pathname)}</changefreq>\n    <priority>${sitemapPriority(r.pathname)}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  await fs.writeFile(path.join(DIST_DIR, "sitemap.xml"), sitemap, "utf8");

  // Small log for Vercel builds
  console.log(`[seo] wrote ${routes.length} route HTML files`);
  console.log(`[seo] wrote sitemap.xml (${sitemapRoutes.length} urls)`);
  console.log(`[seo] wrote robots.txt`);
}

main().catch((err) => {
  console.error("[seo] generation failed:", err);
  process.exit(1);
});
