// src/data/journal.js — Journal / blog content
// Each post is a simple structured object. Body is an array of blocks.
//
// Data fields:
//   slug         — URL-safe identifier
//   title        — Display title
//   excerpt      — 1–2 sentence summary for cards and meta
//   heroImage    — Path to hero image (from /gallery/ or /assets/)
//   publishedAt  — ISO date string "YYYY-MM-DD"
//   author       — Byline name
//   category     — Topic label (Hair Education | Hair Care | Founder | First-Time Buyers | Medical Hair)
//   readingTime  — Estimated reading time string, e.g. "5 min read"
//   featured     — boolean; marks the editorial lead piece on the journal landing page
//   cta          — { label, href } — inline CTA at the end of the article
//   related      — array of slugs for related articles
//   body         — array of blocks: { type: "p"|"h2"|"image", content: string }

export const journalPosts = [
  // ─── FEATURED ────────────────────────────────────────────────────────────────
  {
    slug: "first-wig-guide",
    title: "Your First Wig: A No-Pressure Guide to Getting It Right",
    excerpt:
      "Choosing your first wig doesn't have to be overwhelming. Here's how to think about texture, length, density, and lace — so your first purchase feels considered, not rushed.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_01.webp",
    publishedAt: "2026-04-15",
    author: "Chino",
    category: "First-Time Buyers",
    readingTime: "7 min read",
    featured: true,
    cta: { label: "Use the Matchmaker", href: "/start-here" },
    related: ["hd-lace-vs-transparent-lace", "how-to-choose-density-and-length", "raw-vs-virgin-hair"],
    body: [
      {
        type: "p",
        content:
          "Your first wig purchase should feel exciting — not stressful. The number of options available can make it feel like a research project, but most first-time buyers really only need to answer four questions: What texture suits my lifestyle? What length is most practical? What density looks natural on me? And which lace type is easier to manage?",
      },
      {
        type: "h2",
        content: "Start with Texture",
      },
      {
        type: "p",
        content:
          "Texture is the most visible choice and the one most people overthink. For a first wig, body wave and straight are the easiest to maintain — they're predictable, style well, and look polished with minimal effort. Loose wave is a versatile middle ground that reads as effortlessly natural. Deep wave and curly textures are stunning but require more upkeep to keep the pattern defined.",
      },
      {
        type: "p",
        content:
          "Start with what you'd actually wear day-to-day, not what photographs best. You can explore bolder textures once you're comfortable with your routine.",
      },
      {
        type: "h2",
        content: "Length: Practical Before Dramatic",
      },
      {
        type: "p",
        content:
          "18\" to 22\" is the most forgiving length range for first-time buyers. It's long enough to feel luxurious, short enough to manage easily, and flattering across most face shapes. Very long lengths (26\"+) are beautiful but add weight and styling time. If you're unsure, default to the middle range and size up once you know how you like to wear it.",
      },
      {
        type: "h2",
        content: "Density: Less Is More at First",
      },
      {
        type: "p",
        content:
          "Density refers to how full the wig is. 180% is the most natural-looking for everyday wear. 200% reads slightly more full. 250% and above is dramatic and photo-forward — beautiful for editorial looks, but can feel heavy for all-day wear. For a first purchase, 180–200% is the clearest choice.",
      },
      {
        type: "h2",
        content: "Lace: HD vs Transparent",
      },
      {
        type: "p",
        content:
          "HD lace is nearly invisible against most skin tones and melts under flash photography. Transparent lace is more forgiving on installation — small imperfections hide more easily. For a first wig, transparent lace is a lower-pressure introduction. HD lace is worth it once you're comfortable with your install routine.",
      },
      {
        type: "h2",
        content: "If You're Still Uncertain",
      },
      {
        type: "p",
        content:
          "Use our guided matchmaker to narrow your shortlist by texture, color, and length — or book a private consult and we'll walk you through it personally. There's no pressure to decide alone.",
      },
    ],
  },

  // ─── EDUCATION ───────────────────────────────────────────────────────────────
  {
    slug: "hd-lace-vs-transparent-lace",
    title: "HD Lace vs Transparent Lace: Which Should You Choose?",
    excerpt:
      "Both give you an undetectable hairline — but they're not interchangeable. Here's how to decide which lace type is right for your install style and experience level.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_03.webp",
    publishedAt: "2026-04-10",
    author: "Chino",
    category: "Hair Education",
    readingTime: "5 min read",
    featured: false,
    cta: { label: "Shop HD Lace Wigs", href: "/shop/wigs" },
    related: ["first-wig-guide", "how-to-choose-density-and-length", "raw-vs-virgin-hair"],
    body: [
      {
        type: "p",
        content:
          "Lace type is one of the most asked-about decisions in wig buying — and for good reason. The lace at your hairline directly affects how natural your install looks, how quickly you can get it done, and how much skill the process requires.",
      },
      {
        type: "h2",
        content: "HD Lace",
      },
      {
        type: "p",
        content:
          "HD (high-definition) lace is a very fine, sheer material that adapts closely to your skin tone when laid properly. Because it's thinner, it becomes nearly invisible at the hairline — which is why it's a favourite among content creators and photographers. Under flash, daylight, and natural light, a well-laid HD lace unit simply disappears into the skin.",
      },
      {
        type: "p",
        content:
          "The trade-off: HD lace requires a cleaner install. Small imperfections are more visible because the lace itself offers less camouflage. It also benefits from toner-matched bonding glue or melt-down techniques.",
      },
      {
        type: "h2",
        content: "Transparent Lace",
      },
      {
        type: "p",
        content:
          "Transparent lace is slightly thicker and more durable. It's more forgiving during installation — bubbles, edge lifts, or minor uneven pressing tend to blend better. It's the more practical choice for everyday wearers who prioritize speed and ease.",
      },
      {
        type: "p",
        content:
          "On lighter skin tones, transparent lace works well out of the box. On deeper skin tones, some clients prefer to tint the lace before installation for a more seamless finish.",
      },
      {
        type: "h2",
        content: "Which Is Right for You?",
      },
      {
        type: "p",
        content:
          "If you're a first-time installer or prioritize fast, low-maintenance installs: start with transparent lace. If you're camera-forward, create content regularly, or work with a professional installer: HD lace is worth the extra care. Both are quality choices — the right one depends on your install routine.",
      },
      {
        type: "h2",
        content: "A Quick Guide",
      },
      {
        type: "p",
        content:
          "HD lace is best for: editorial looks, photoshoots, and clients with experienced installers. Transparent lace is best for: first-time buyers, daily wearers, and self-installers. Both types are available across most Eminence collections.",
      },
    ],
  },
  {
    slug: "how-to-choose-density-and-length",
    title: "How to Choose Density and Length for Your Lifestyle",
    excerpt:
      "Density and length are the two decisions that affect how your wig feels every day — not just how it looks in photos. Here's a clear guide to finding your practical sweet spot.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_05.webp",
    publishedAt: "2026-04-05",
    author: "Chino",
    category: "Hair Education",
    readingTime: "6 min read",
    featured: false,
    cta: { label: "Book a Private Consult", href: "/private-consult" },
    related: ["first-wig-guide", "hd-lace-vs-transparent-lace", "luxury-hair-longevity"],
    body: [
      {
        type: "p",
        content:
          "When clients ask which wig to choose, they usually focus on texture first — which is understandable. But density and length are equally important decisions, and getting them right affects how comfortable, confident, and maintenance-free your experience will be.",
      },
      {
        type: "h2",
        content: "Understanding Density",
      },
      {
        type: "p",
        content:
          "Density is expressed as a percentage, which reflects how full the wig cap is packed compared to a reference standard. A 150% density wig is light and natural. A 180% density wig is the most commonly worn — full-looking but not dramatic. 200–250% density is bold and high-volume, favoured for photo-forward styling.",
      },
      {
        type: "p",
        content:
          "Higher density wigs are heavier. If you're wearing your wig for long stretches — at work, through travel, during active days — a lighter density will feel significantly more comfortable over time. Reserve the highest densities for occasions, shoots, and events where maximum impact is the goal.",
      },
      {
        type: "h2",
        content: "Density by Use Case",
      },
      {
        type: "p",
        content:
          "Everyday wear: 150–180%. Social events and styling: 180–200%. Editorial, photography, performance: 200–250%. Medical and sensitive-scalp clients: 130–150% (lighter options are easier to manage and more comfortable against sensitive skin).",
      },
      {
        type: "h2",
        content: "Choosing Your Length",
      },
      {
        type: "p",
        content:
          "Length is measured from the root at the top of the cap to the natural ends at the back. Longer wigs are measured at their longest point — so a 26\" wig is 26\" at the back, while the front layers will be shorter.",
      },
      {
        type: "p",
        content:
          "For most daily wear, 16\"–22\" is the practical window. This range is manageable, doesn't require constant styling, and is flattering across body types. If you lead an active lifestyle, shorter lengths (14\"–18\") offer more freedom. Longer lengths (24\"+) are dramatic and beautiful — they just require more intentional maintenance and styling.",
      },
      {
        type: "h2",
        content: "The Practical Recommendation",
      },
      {
        type: "p",
        content:
          "If this is your first wig or you're building a daily-wear piece: start at 18\"–20\" and 180% density. It's the most forgiving combination, and it photographs beautifully. From there, you'll have a clear reference point to size up or adjust density for future pieces.",
      },
    ],
  },

  // ─── HAIR CARE ────────────────────────────────────────────────────────────────
  {
    slug: "luxury-hair-longevity",
    title: "The Longevity Guide: How to Make Luxury Hair Last",
    excerpt:
      "A well-maintained raw hair wig can last years. Here's the care routine that makes the difference — from wash day to storage.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_07.webp",
    publishedAt: "2026-03-28",
    author: "Chino",
    category: "Hair Care",
    readingTime: "6 min read",
    featured: false,
    cta: { label: "Read the Full Care Guide", href: "/care" },
    related: ["first-wig-guide", "raw-vs-virgin-hair", "how-to-choose-density-and-length"],
    body: [
      {
        type: "p",
        content:
          "The difference between a wig that lasts six months and one that lasts two to three years is almost always care. Raw hair is resilient — but it responds directly to how you treat it. A considered routine doesn't need to be complicated; it just needs to be consistent.",
      },
      {
        type: "h2",
        content: "Wash Day: Less Is More",
      },
      {
        type: "p",
        content:
          "Wash your wig every 10–14 days during regular wear — more often if you're using heavy styling products or wearing it in humid conditions. Use a sulfate-free shampoo: work from root to tip in a single downward direction rather than scrubbing in circles. This preserves the cuticle alignment that makes raw hair so easy to manage.",
      },
      {
        type: "p",
        content:
          "Follow with a moisture-focused conditioner, and rinse in cool or lukewarm water. Hot water is one of the fastest ways to degrade the hair structure over time.",
      },
      {
        type: "h2",
        content: "Heat Styling",
      },
      {
        type: "p",
        content:
          "Raw hair handles heat well — but like all human hair, it responds to how often and how high you style. Use a heat protectant every time, and keep your flat iron or curling tool at 350°F or below for day-to-day styling. Reserve higher settings for setting curls or achieving very sleek finishes on specific occasions.",
      },
      {
        type: "p",
        content:
          "The less heat you use overall, the longer the hair retains its natural movement and body. Air drying is always preferable where time allows.",
      },
      {
        type: "h2",
        content: "Storage",
      },
      {
        type: "p",
        content:
          "When you're not wearing your wig, store it on a wig stand or mannequin head to maintain the cap shape and prevent tangling. Keep it away from direct sunlight — UV exposure fades the natural tones over time. If you're storing for longer periods, loosely braid the hair and place it in a breathable silk or satin bag.",
      },
      {
        type: "h2",
        content: "Shedding and Tangling",
      },
      {
        type: "p",
        content:
          "Some shedding is normal when a wig is new — most of it is loose hairs from the manufacturing process that work their way free in the first few wears. This typically settles within the first two weeks. Persistent shedding after that point is usually related to over-manipulation or aggressive brushing on wet hair. Always use a wide-tooth comb or detangling brush, starting from the ends and working upward.",
      },
      {
        type: "h2",
        content: "The Longer View",
      },
      {
        type: "p",
        content:
          "Think of your wig as an investment in your wardrobe — like a piece of outerwear that rewards consistent care. A proper routine takes less than 20 minutes on wash day. Over years of wear, that small investment compounds into a unit that still looks and feels exceptional.",
      },
    ],
  },

  // ─── FOUNDER / BRAND ─────────────────────────────────────────────────────────
  {
    slug: "raw-vs-virgin-hair",
    title: "The Difference Between Raw and Virgin Hair",
    excerpt:
      "Understanding the distinction between raw and virgin hair — and why it matters for longevity, styling, and value.",
    heroImage: "/gallery/editorial/brand/Eminence_Editorial_BrandHero_Neutral_01.webp",
    publishedAt: "2026-03-15",
    author: "Chino",
    category: "Hair Education",
    readingTime: "4 min read",
    featured: false,
    cta: { label: "Explore the Collection", href: "/collections" },
    related: ["first-wig-guide", "hd-lace-vs-transparent-lace", "inside-the-atelier"],
    body: [
      {
        type: "p",
        content:
          "If you've ever shopped for premium hair extensions, you've likely encountered the terms \"raw\" and \"virgin\" used almost interchangeably. But they're not the same — and knowing the difference can save you hundreds of dollars and months of frustration.",
      },
      {
        type: "h2",
        content: "What is Virgin Hair?",
      },
      {
        type: "p",
        content:
          "Virgin hair refers to human hair that has never been chemically processed — no dyes, no perms, no relaxers. It retains its natural cuticle layer and can come from multiple donors. Because it's unprocessed, virgin hair accepts colour well and behaves predictably under heat.",
      },
      {
        type: "h2",
        content: "What is Raw Hair?",
      },
      {
        type: "p",
        content:
          "Raw hair takes it a step further. It's collected from a single donor, with cuticles intact and aligned in one direction. It has never been steamed, treated, or altered in any way. What you receive is hair closer to its natural state — with the movement and body that comes from that.",
      },
      {
        type: "h2",
        content: "Why Does It Matter?",
      },
      {
        type: "p",
        content:
          "Raw hair tends to last significantly longer with proper care. It tangles less because the cuticles are naturally aligned. It also holds curl patterns and colour more consistently over time.",
      },
      {
        type: "p",
        content:
          "At Eminence, every unit we sell is 100% raw Cambodian or Burmese hair. We work directly with our partner atelier, where each batch is tagged, graded, and inspected before it reaches production — because quality at the source is what makes the difference in how the hair performs over time.",
      },
      {
        type: "h2",
        content: "The Bottom Line",
      },
      {
        type: "p",
        content:
          "If you're investing in luxury hair, raw is the standard. Virgin hair has its place — but for longevity, natural movement, and true versatility, raw hair is the clear choice. Every Eminence piece is built to demonstrate that.",
      },
    ],
  },
  {
    slug: "inside-the-atelier",
    title: "Inside the Atelier",
    excerpt:
      "A founder's look at how Eminence pieces are crafted — from raw material selection to the final quality check.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_06.webp",
    publishedAt: "2026-04-01",
    author: "Chino",
    category: "Founder",
    readingTime: "4 min read",
    featured: false,
    cta: { label: "Shop the Collection", href: "/shop" },
    related: ["raw-vs-virgin-hair", "luxury-hair-longevity", "hd-lace-vs-transparent-lace"],
    body: [
      {
        type: "p",
        content:
          "When I started Eminence, I knew I didn't want to be another brand reselling factory hair with a luxury label. I wanted to build something that could stand next to the best — and justify every dollar.",
      },
      {
        type: "h2",
        content: "The Source",
      },
      {
        type: "p",
        content:
          "Our hair comes from Cambodia and Myanmar — regions known for naturally thick, silky strands with minimal processing needed. We work with a single partner atelier that collects from trusted donor networks. Every batch is tagged, weighed, and logged before it enters production.",
      },
      {
        type: "h2",
        content: "The Craft",
      },
      {
        type: "p",
        content:
          "Each wig or bundle goes through a multi-stage process: sorting by length and texture, hand-tying onto HD lace caps, quality grading, and a final camera test under different lighting conditions. That last step is something most brands skip — but our clients are content creators, stylists, and professionals who need their hair to perform under flash and daylight alike.",
      },
      {
        type: "h2",
        content: "The Standard",
      },
      {
        type: "p",
        content:
          "Every unit that ships carries a quality verification tag. Our partner atelier conducts detailed grading, documentation, and inspection checks on each batch before it reaches you. The process isn't glamorous — it's meticulous. And that's exactly the point.",
      },
      {
        type: "p",
        content:
          "This is what the atelier looks like behind the brand. No shortcuts. Just a consistent standard that we hold ourselves to — because our clients notice when it slips.",
      },
    ],
  },

  // ─── MEDICAL HAIR ─────────────────────────────────────────────────────────────
  {
    slug: "hair-loss-shopping-guide",
    title: "Navigating Hair Loss: What to Know Before You Shop",
    excerpt:
      "Shopping for hair during a period of hair loss is a deeply personal experience. This guide is designed to make it feel less overwhelming — with clear information and no pressure.",
    heroImage: "/gallery/editorial/campaign2025/Eminence_Editorial_AICampaign2025_Neutral_09.webp",
    publishedAt: "2026-03-22",
    author: "Chino",
    category: "Medical Hair",
    readingTime: "5 min read",
    featured: false,
    cta: { label: "Explore Medical Hair Options", href: "/medical-hair" },
    related: ["first-wig-guide", "how-to-choose-density-and-length", "luxury-hair-longevity"],
    body: [
      {
        type: "p",
        content:
          "If you're shopping for a wig because of hair loss — whether from alopecia, chemotherapy, a medical condition, or another cause — this guide is written for you. The hair industry can feel overwhelming from the outside, especially when you're already dealing with something difficult. Our goal here is clarity, not pressure.",
      },
      {
        type: "h2",
        content: "What's Different About Medical Hair Shopping",
      },
      {
        type: "p",
        content:
          "The practical needs for a medical hair client differ from lifestyle wig buyers. Cap construction, scalp sensitivity, fit, and comfort under extended wear are priorities that matter more than the widest range of style options. The goal is a unit that feels secure, looks natural, and doesn't compound the physical discomfort many people experience during hair loss.",
      },
      {
        type: "h2",
        content: "Cap Construction and Comfort",
      },
      {
        type: "p",
        content:
          "For sensitive scalps, monofilament and full-lace cap constructions are the most comfortable options — they distribute pressure evenly and feel gentler against skin. Adjustable bands and combs allow a secure fit without clips that may irritate tender areas. Lightweight densities (130–150%) are easier to wear for longer stretches.",
      },
      {
        type: "h2",
        content: "HSA/FSA Eligibility",
      },
      {
        type: "p",
        content:
          "Cranial prostheses — wigs prescribed for hair loss resulting from a medical condition — may be eligible for reimbursement through HSA or FSA accounts. Eligibility depends on your insurance plan and whether you have a physician's letter or prescription. We recommend checking with your provider before purchase. Our medical hair page includes guidance on the documentation typically required.",
      },
      {
        type: "h2",
        content: "Taking Your Time",
      },
      {
        type: "p",
        content:
          "There's no urgency to make this decision quickly. If you'd like to ask questions, talk through your situation, or simply take more time to consider your options, our consult service is available — and there's no commitment attached. We'd rather you feel genuinely confident in your choice than rushed into one.",
      },
      {
        type: "p",
        content:
          "Note: The information here is general guidance only. It is not medical advice. Please consult with your healthcare provider about hair loss causes, treatment options, and any decisions related to your medical care.",
      },
    ],
  },
];
