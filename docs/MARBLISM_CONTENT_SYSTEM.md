# Eminence Hair — Marblism Content System

Internal reference for content operations, AI-assisted content workflows, and editorial planning.

---

## Content Pillars

| Pillar | Description | Primary Destination Pages |
|--------|-------------|--------------------------|
| **Education** | How to choose, what to know, what to expect | `/journal`, `/start-here`, `/care` |
| **Craft & Provenance** | Behind the product, quality sourcing, atelier | `/journal/inside-the-atelier`, `/authenticity`, `/about` |
| **Versatility** | Real-world performance, styling, looks | `/client-results`, `/gallery` |
| **Professional** | For stylists, creators, installers | `/for-professionals`, `/partners` |
| **Medical Hair** | Compassionate guidance for hair loss clients | `/medical-hair`, `/journal/hair-loss-shopping-guide` |
| **Conversion** | Direct purchase + consultation funnel | `/shop`, `/collections`, `/private-consult`, `/start-here` |

---

## Page-to-CTA Map

Each page should have a clear conversion destination. Use the `JournalCTA` component to surface these inline.

| Page | Primary CTA | Secondary CTA |
|------|-------------|---------------|
| `/journal` | `/start-here` (Matchmaker) | `/private-consult` (Consult) |
| `/journal/:slug` | Article-specific `post.cta.href` | Related articles |
| `/start-here` | `/shop` (Shop Filters) | `/private-consult` (Consult) |
| `/medical-hair` | `/private-consult` (Consult) | `/journal/hair-loss-shopping-guide` |
| `/for-professionals` | `/partners/stylists` or `/partners/creators` | `/partners` (Overview) |
| `/client-results` | `/start-here` | `/shop` |
| `/gallery` | `/shop` | `/collections` |
| `/care` | `/shop` | `/journal/luxury-hair-longevity` |
| `/authenticity` | `/shop` | `/about` |
| Product pages | Add to Cart | `/private-consult` |
| Collection pages | `/shop?collection=X` | `/start-here` |

---

## Internal Linking Rules

1. **Journal → Shop**: Every journal article should link to at least one relevant product, collection, or `/start-here`.
2. **Shop → Journal**: Product pages and collection pages should surface relevant journal content via `RelatedProducts` or sidebar links.
3. **Start Here → Journal**: `/start-here` links to `/journal/first-wig-guide`, `/journal/hd-lace-vs-transparent-lace`, and `/journal/how-to-choose-density-and-length`.
4. **Medical Hair → Journal**: `/medical-hair` links to `/journal/hair-loss-shopping-guide`.
5. **For Professionals → Partners**: `/for-professionals` links directly to `/partners/stylists`, `/partners/creators`, and `/installers`.
6. **Client Results → Shop/Start**: `/client-results` closes the loop back to `/start-here` and `/shop`.
7. **All new pages** use the existing `<SEO>` and `<Breadcrumbs>` components.
8. **Avoid deep nesting** — keep link depth ≤ 3 from the homepage.

---

## Safe Claim Rules

The following categories of claims require care. Do **not** include them in content unless they are directly supported by brand-approved, verified facts.

| ❌ Risky — Do Not Use | ✅ Safe Alternative |
|-----------------------|--------------------|
| "CNAS-accredited lab verification" | "quality grading and inspection at our partner atelier" |
| "Full traceability from origin to your door" | "detailed documentation at each stage of production" |
| "100% single-donor, guaranteed" | "we prioritize single-donor collection" |
| "Lasts 3–5 years guaranteed" | "with proper care, can last significantly longer than processed alternatives" |
| "Clinically proven / dermatologist recommended" | (do not use at all) |
| "HSA/FSA definitely reimbursable" | "may be eligible — verify with your provider" |
| "Certified organic / ethically certified" | (do not use without certification documentation) |
| Invented testimonials or attributed reviews | (never fabricate) |

---

## Which Pages Social Posts Should Point To

| Social post type | Primary landing page | Why |
|-----------------|---------------------|-----|
| Hair education content | `/journal/:slug` | SEO + trust building |
| "How to choose" type content | `/start-here` | Conversion funnel entry |
| New collection drop | `/collections/:slug` | Direct discovery |
| Styling / install inspiration | `/client-results` | Proof + funnel |
| Stylist / creator promo | `/for-professionals` | Partnership funnel |
| Medical hair / alopecia awareness | `/medical-hair` or `/journal/hair-loss-shopping-guide` | Compassionate entry |
| Product-specific | `/products/:slug` | Direct product page |

---

## Which Pages Blog Posts Should Point To

When producing blog content via Marblism (or another AI content tool), link to these targets:

- First-time buyer content → `/start-here`, `/journal/first-wig-guide`
- Lace type education → `/journal/hd-lace-vs-transparent-lace`, `/shop/wigs`
- Hair care / longevity → `/journal/luxury-hair-longevity`, `/care`
- Raw vs virgin hair → `/journal/raw-vs-virgin-hair`, `/authenticity`
- Density / length guide → `/journal/how-to-choose-density-and-length`, `/start-here`
- Medical / hair loss → `/journal/hair-loss-shopping-guide`, `/medical-hair`
- Professional programs → `/for-professionals`, `/partners`

---

## How to Structure a New Journal Article

Add entries to `src/data/journal.js`. Each post supports these fields:

```js
{
  slug: "url-safe-unique-slug",
  title: "Article Title",
  excerpt: "One to two sentence summary for cards and meta.",
  heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_XX.webp",
  publishedAt: "2026-MM-DD",
  author: "Byline Name",
  category: "Hair Education | Hair Care | Founder | First-Time Buyers | Medical Hair",
  readingTime: "X min read",
  featured: false, // true for the editorial lead post on /journal
  cta: { label: "Button Label", href: "/destination-path" },
  related: ["slug-one", "slug-two", "slug-three"], // up to 3 related post slugs
  body: [
    { type: "p", content: "Paragraph text." },
    { type: "h2", content: "Section heading" },
    { type: "image", content: "/path/to/image.webp" },
  ],
}
```

After adding a new article, also add a route entry in `scripts/generate-static-seo.mjs` under the journal section (around line 680+) so the static SEO HTML and sitemap are generated for the new route.

---

## Content Tone Guidelines

- Editorial, concierge, direct. Not aspirational fluff.
- First-person "we" is appropriate for founder-voice posts.
- Use "raw hair" not "100% raw guaranteed" unless verifiable.
- Avoid urgency language ("limited time", "don't miss out").
- Medical hair content: always add a disclaimer that content is general guidance, not medical advice.
- Never fabricate testimonials, quotes, or attributed reviews.

---

*Last updated: April 2026. Update this file whenever new pages, CTAs, or content rules are added.*
