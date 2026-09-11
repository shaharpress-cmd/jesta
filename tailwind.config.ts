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
        cream: "#F7F1EA",
        coral: {
          DEFAULT: "#E07A5F",
          light: "#F4A48C",
          soft: "#FCE8E2",
          dark: "#C45D44",
        },
        charcoal: {
          DEFAULT: "#3D405B",
          muted: "#6B6E85",
          light: "#9A9DB0",
        },
        sage: "#81B29A",
        sand: "#F4F1DE",
        amberSoft: "#F5E6C8",
      },
      fontFamily: {
        heebo: ["var(--font-heebo)", "Heebo", "Assistant", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(61, 64, 91, 0.07)",
        soft: "0 6px 24px rgba(224, 122, 95, 0.22)",
        nav: "0 -4px 24px rgba(61, 64, 91, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
