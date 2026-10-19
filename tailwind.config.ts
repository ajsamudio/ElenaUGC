import type { Config } from "tailwindcss";

// Organic, earthy palette: moss ("cherry" token), clay ("blush"), sage ("baby"),
// cocoa and oat ("butter") on a warm cream base.
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
        blush: { 50: "#FAF1EA", 100: "#F3E2D5", 200: "#E9CDB8", 300: "#D9AE8E", 400: "#C48B66" },
        baby: { 50: "#F2F5EE", 100: "#E4EBDD", 200: "#CCD9C2", 300: "#AFC2A2", 400: "#8EA77F" },
        cherry: { DEFAULT: "#5F6B3A", dark: "#4A5429", light: "#7D8A55" },
        cocoa: { 500: "#8A6A62", 600: "#6B4D46", 700: "#4E3530", 800: "#3A2622", 900: "#2A1A17" },
        butter: { DEFAULT: "#EAD9A8", light: "#F4EBD0" },
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
