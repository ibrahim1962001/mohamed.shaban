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
        brand: {
          50: "#fef2f4",
          100: "#fde6ea",
          200: "#fbd0d9",
          300: "#f7a8b8",
          400: "#f0708a",
          500: "#e11d48",
          600: "#be123c",
          700: "#9f1239",
          800: "#881337",
          900: "#4c0519",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        fresh: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        warm: {
          bg: "#f3e9da",
          card: "#ffffff",
          muted: "#6b6560",
          border: "#fde68a",
        },
        admin: {
          bg: "#f1f5f9",
          card: "#ffffff",
          primary: "#4f46e5",
          primaryHover: "#4338ca",
        },
      },
      fontFamily: {
        sans: ["Cairo", "Segoe UI", "Tahoma", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        warm: "0 10px 40px -10px rgba(190, 18, 60, 0.22)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
