/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        ivory: "#FAF8F5",
        charcoal: "#1B1B1B",
        softGray: "#EAE8E3",
      },
      fontFamily: {
        // Primary brand typography
        header: ["Playfair Display", "serif"],
        // Some pages already reference `font-display`; keep it as an alias.
        display: ["Playfair Display", "serif"],
        body: ["Poppins", "system-ui", "sans-serif"],
        cursive: ["Allura", "cursive"],
      },

      boxShadow: {
        goldGlow: "0 0 25px rgba(212,175,55,0.25)",
        luxury: "0 20px 60px rgba(0,0,0,0.07)",
        card: "0 4px 24px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        card: "1rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      letterSpacing: {
        luxury: "0.22em",
        "luxury-wide": "0.28em",
        "luxury-xl": "0.36em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [],
};
