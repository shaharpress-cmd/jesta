import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F1EA",
          deep: "#EFE6DB",
          soft: "#FBF7F2",
        },
        coral: {
          DEFAULT: "#E07A5F",
          warm: "#F18967",
          light: "#F4A48C",
          soft: "#FCE8E2",
          dark: "#C45D44",
        },
        charcoal: {
          DEFAULT: "#3D405B",
          /* Darker secondary for WCAG-ish card/meta contrast on cream */
          muted: "#4F526A",
          light: "#6E7188",
        },
        sage: {
          DEFAULT: "#81B29A",
          soft: "#E8F0E8",
          mist: "#D4E5D8",
        },
        sand: "#F4F1DE",
        amberSoft: "#F5E6C8",
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "Heebo", "Assistant", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(61, 64, 91, 0.03), 0 8px 24px rgba(61, 64, 91, 0.04)",
        soft: "0 6px 20px rgba(224, 122, 95, 0.22)",
        nav: "0 -2px 16px rgba(61, 64, 91, 0.05)",
        fab: "0 8px 24px rgba(224, 122, 95, 0.32)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
