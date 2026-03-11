import { useState } from "react";

/**
 * PremiumImage – enhanced image component for Eminence Hair.
 *
 * Features:
 * - Consistent aspect ratios via Tailwind padding-bottom trick
 * - object-fit cover
 * - Lazy loading (native)
 * - Animated fade-in on load
 * - Graceful placeholder if src is missing or 404
 * - Optional subtle zoom on hover (for product cards)
 */

const PLACEHOLDER_STYLE = {
  background: "linear-gradient(135deg, #F5EFE6 0%, #E8DDD0 100%)",
};

export default function PremiumImage({
  src,
  alt = "",
  className = "",
  aspectRatio = "aspect-square", // e.g. "aspect-square", "aspect-[4/5]", "aspect-[3/4]"
  zoom = false,                  // enable subtle scale on hover
  objectPosition = "center",
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleError = () => {
    if (import.meta.env.DEV && src) {
      console.warn(`[PremiumImage] Missing image: ${src}`);
    }
    setErrored(true);
    setLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      {/* Shimmer placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 eminence-skeleton" />
      )}

      {errored ? (
        /* Graceful fallback */
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2"
          style={PLACEHOLDER_STYLE}
          aria-label={alt || "Image unavailable"}
        >
          <svg
            className="w-10 h-10 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[10px] tracking-widest uppercase text-neutral-400">
            Image unavailable
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          style={{ objectPosition }}
          className={[
            "absolute inset-0 w-full h-full object-cover",
            "transition-all duration-500",
            zoom ? "group-hover:scale-105" : "",
            loaded ? "opacity-100" : "opacity-0",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      )}
    </div>
  );
}
