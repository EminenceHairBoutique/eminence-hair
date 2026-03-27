// src/components/SocialLinks.jsx — Reusable luxury social links
import React from "react";
import { Instagram } from "lucide-react";
import { activeSocials } from "../config/brand";

// TikTok icon (Lucide doesn't include one)
function TikTokIcon({ size = 16, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.83a4.84 4.84 0 0 1-1-.14Z" />
    </svg>
  );
}

// YouTube icon (Lucide doesn't include one)
function YouTubeIcon({ size = 16, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
    </svg>
  );
}

const ICON_MAP = {
  instagram: Instagram,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
};

const LABEL_MAP = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

/**
 * SocialLinks — minimal luxury social icons.
 *
 * @param {"icon"|"text"|"both"} variant  - display mode
 * @param {number}  iconSize              - icon px size
 * @param {string}  className             - extra container classes
 * @param {string}  linkClassName         - extra classes per link
 */
export default function SocialLinks({
  variant = "icon",
  iconSize = 16,
  className = "",
  linkClassName = "",
}) {
  const socials = activeSocials();
  if (!socials.length) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map(({ platform, url }) => {
        const Icon = ICON_MAP[platform];
        const label = LABEL_MAP[platform] || platform;

        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${label}`}
            className={`hover:opacity-70 transition-opacity ${linkClassName}`}
          >
            {(variant === "icon" || variant === "both") && Icon && (
              <Icon size={iconSize} />
            )}
            {(variant === "text" || variant === "both") && (
              <span className={variant === "both" ? "ml-2" : ""}>{label}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
