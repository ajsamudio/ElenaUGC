import type { Config } from "tailwindcss";

// Soft feminine palette: dusty rose-brown ("cherry" token), light pink ("blush"),
// beige/sand ("baby"), cocoa browns and pink-beige ("butter") on a warm white base.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FBF6F2", 50: "#FFFDFB", 100: "#FBF6F2", 200: "#F2E8E0" },
        blush: { 50: "#FBF1EE", 100: "#F5E1DB", 200: "#EBCFC6", 300: "#DAB1A6", 400: "#C3938A" },
        baby: { 50: "#F7F0E9", 100: "#EEE3D7", 200: "#E2D2C1", 300: "#D1B9A2", 400: "#B3967B" },
        cherry: { DEFAULT: "#8E645B", dark: "#744E46", light: "#AE877E" },
        cocoa: { 500: "#8A6A62", 600: "#6B4D46", 700: "#4E3530", 800: "#3A2622", 900: "#2A1A17" },
        butter: { DEFAULT: "#EAD7CB", light: "#F5EBE4" },
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
