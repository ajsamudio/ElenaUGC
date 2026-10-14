import type { Config } from "tailwindcss";

// Palette pulled from Elena's own emoji language: 🍒 cherry, 🩵 baby blue,
// 🤎 cocoa, 🩰 ballet pink, ⭐️ butter — on a warm cream base.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FFF7F0", 50: "#FFFCF8", 100: "#FFF7F0", 200: "#F8EADF" },
        blush: { 50: "#FFF2F5", 100: "#FDE3EA", 200: "#F9C9D6", 300: "#F3A6BB", 400: "#EC7F9C" },
        baby: { 50: "#F1F9FE", 100: "#E1F2FC", 200: "#C4E6F8", 300: "#9CD3F1", 400: "#6FBCE6" },
        cherry: { DEFAULT: "#C8102E", dark: "#9E0B23", light: "#E23A55" },
        cocoa: { 500: "#8A6A62", 600: "#6B4D46", 700: "#4E3530", 800: "#3A2622", 900: "#2A1A17" },
        butter: { DEFAULT: "#FFE59E", light: "#FFF2C8" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 20px 50px -24px rgba(42, 26, 23, 0.35)",
        phone: "0 30px 60px -20px rgba(42, 26, 23, 0.45), 0 0 0 1px rgba(42,26,23,0.06)",
        sticker: "0 6px 14px -6px rgba(42, 26, 23, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
