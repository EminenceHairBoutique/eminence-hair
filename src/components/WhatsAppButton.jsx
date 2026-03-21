import { useState } from "react";

const WHATSAPP_NUMBER = import.meta?.env?.VITE_WHATSAPP_NUMBER || "";
const PREFILLED_MESSAGE =
  "Hi Eminence Hair! I have a question about your hair.";

// Only digits; strip any accidental spaces, dashes, or + signs
function sanitizeNumber(raw) {
  return String(raw || "").replace(/\D/g, "");
}

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const safeNumber = sanitizeNumber(WHATSAPP_NUMBER);
  if (!safeNumber) return null;

  const href = `https://wa.me/${safeNumber}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group"
    >
      {/* Tooltip */}
      <span
        className={`text-[11px] tracking-[0.12em] bg-neutral-900 text-white px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        Chat with us
      </span>

      {/* Button */}
      <span className="relative flex items-center justify-center">
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: "rgba(37,211,102,0.3)", animationDuration: "2.4s" }}
          aria-hidden="true"
        />
        <span
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-150 group-hover:scale-105"
          style={{ backgroundColor: "#25D366" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-white"
            aria-hidden="true"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.986-1.41A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm5.485 13.732c-.234.657-1.355 1.255-1.848 1.304-.47.046-.914.211-3.075-.641-2.603-1.044-4.24-3.722-4.369-3.896-.128-.174-1.044-1.388-1.044-2.646s.66-1.875.895-2.133c.234-.257.51-.321.68-.321.17 0 .34.002.489.009.157.008.367-.059.574.438.213.51.724 1.768.788 1.896.063.128.105.277.021.447-.085.17-.127.277-.255.427-.127.149-.267.333-.383.447-.127.12-.26.251-.111.492.148.24.658 1.083 1.415 1.754.972.865 1.793 1.133 2.049 1.258.255.127.404.106.553-.064.149-.169.639-.745.809-.999.17-.255.34-.213.574-.128.234.085 1.49.702 1.745.83.255.127.425.191.489.298.064.106.064.613-.17 1.27Z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
