import React from "react";
import { Link } from "react-router-dom";
import LazyImage from "./LazyImage";

/**
 * PageHero
 * A consistent, editorial hero used across non-commerce pages.
 * Keeps Eminence feeling luxurious (soft neutrals + gold accents) while staying minimal.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  compact = false,
  align = "left",
  ctas = [],
}) {
  const isCenter = align === "center";

  return (
    <section className={`bg-[#FBF6EE] border-b border-black/5 ${compact ? "pt-20 pb-10" : "pt-28 pb-14"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={
            image
              ? "grid lg:grid-cols-[1.05fr,0.95fr] gap-10 items-center"
              : ""
          }
        >
          <div className={isCenter ? "text-center max-w-3xl mx-auto" : ""}>
            {eyebrow && (
              <p className="text-[11px] tracking-[0.32em] uppercase text-neutral-500">
                {eyebrow}
              </p>
            )}

            <h1
              className={
                "mt-3 text-3xl md:text-4xl font-light font-display leading-tight text-neutral-900"
              }
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className={
                  "mt-4 text-sm md:text-[15px] leading-relaxed text-neutral-700 " +
                  (isCenter ? "mx-auto" : "max-w-xl")
                }
              >
                {subtitle}
              </p>
            )}

            {ctas?.length > 0 && (
              <div
                className={
                  "mt-7 flex flex-wrap gap-3 " + (isCenter ? "justify-center" : "")
                }
              >
                {ctas.map((c) => {
                  const base =
                    "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.26em] transition";
                  const primary =
                    "bg-black text-white hover:bg-black/90";
                  const ghost =
                    "border border-black/15 text-neutral-900 hover:border-black/30";
                  const variant = c.variant === "primary" ? primary : ghost;

                  return (
                    <Link key={c.href + c.label} to={c.href} className={`${base} ${variant}`}>
                      {c.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {image && (
            <div className="lg:justify-self-end">
              <LazyImage
                src={image}
                alt={title}
                className="rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(15,10,5,0.22)] aspect-[4/5] max-h-[520px]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
