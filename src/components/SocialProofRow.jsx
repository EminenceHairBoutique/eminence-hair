import { SOCIAL } from "../config/brand";

const INSTAGRAM_HANDLE = "@eminencehairtique";
const INSTAGRAM_URL = SOCIAL?.instagram || "https://www.instagram.com/eminencehairtique";

// Placeholder grid items — swap src values for real embed thumbnails when available
const PLACEHOLDERS = [
  { id: 1, alt: "Eminence Hair — raw deep wave wig styled" },
  { id: 2, alt: "Eminence Hair — body wave bundle install" },
  { id: 3, alt: "Eminence Hair — HD lace wig client result" },
  { id: 4, alt: "Eminence Hair — raw Cambodian hair texture" },
];

function PlaceholderTile({ alt }) {
  return (
    <div
      className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 flex items-center justify-center"
      aria-label={alt}
    >
      <div className="w-full h-full bg-gradient-to-br from-[#F5EFE6] to-[#E2D5C3] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-neutral-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * SocialProofRow — Instagram / social proof section.
 * Renders placeholder tiles ready for real embed thumbnails.
 * Replace PlaceholderTile with <img src="..."> once real URLs are available.
 */
export default function SocialProofRow() {
  return (
    <section className="py-20 px-6 bg-white" aria-label="Social proof">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400 mb-2">
              Community
            </p>
            <h2 className="text-2xl sm:text-3xl font-display text-neutral-900 leading-snug">
              Real Hair. Real Results.
              <br />
              <span className="text-neutral-500">{INSTAGRAM_HANDLE}</span>
            </h2>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-[11px] tracking-[0.22em] uppercase text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
            Follow Us
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {PLACEHOLDERS.map((item) => (
            <a
              key={item.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              aria-label={`View on Instagram: ${item.alt}`}
            >
              <div className="relative rounded-2xl overflow-hidden transition-transform duration-200 group-hover:scale-[1.02]">
                <PlaceholderTile alt={item.alt} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-200 rounded-2xl" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
