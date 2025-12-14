/**
 * ThirdPartyVerifiedBadge
 * Usage:
 * <ThirdPartyVerifiedBadge className="h-9" />
 * <ThirdPartyVerifiedBadge color="#111111" className="h-8" />
 */

export default function ThirdPartyVerifiedBadge({
  color = "#C8A46A",
  className = "h-9",
}) {
  return (
    <svg
      viewBox="0 0 980 220"
      role="img"
      aria-label="Third-party verified inspection badge"
      className={className}
      style={{ color }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            .serif {
              font-family: ui-serif, "Times New Roman", Georgia, serif;
              letter-spacing: 0.08em;
            }
            .sans {
              font-family: ui-sans-serif, system-ui, -apple-system,
                Segoe UI, Roboto, Arial, sans-serif;
              letter-spacing: 0.24em;
            }
          `}
        </style>
      </defs>

      {/* Outer frame */}
      <rect
        x="10"
        y="10"
        width="960"
        height="200"
        rx="96"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      {/* Left seal */}
      <g transform="translate(120,110)" fill="none" stroke="currentColor">
        <circle r="70" strokeWidth="2" />
        <circle r="58" strokeWidth="1.5" />
        <text
          className="serif"
          fontSize="34"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          stroke="none"
        >
          E
        </text>
        <text
          className="sans"
          fontSize="9"
          textAnchor="middle"
          y="38"
          fill="currentColor"
          stroke="none"
        >
          LAB INSPECTED
        </text>
      </g>

      {/* Text block */}
      <text
        x="245"
        y="92"
        className="sans"
        fontSize="14"
        fill="currentColor"
      >
        THIRD-PARTY VERIFIED
      </text>

      <text
        x="245"
        y="132"
        className="serif"
        fontSize="24"
        fill="currentColor"
      >
        Independent inspection report
      </text>

      <text
        x="245"
        y="170"
        className="sans"
        fontSize="11"
        fill="currentColor"
      >
        CNAS · ILAC-MRA · CMA  •  Report No. 202590222
      </text>
    </svg>
  );
}
