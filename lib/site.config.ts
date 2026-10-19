// =============================================================
// EDIT THIS FILE to update Elena's name, copy, contact + reach.
// Portfolio clips, packages and FAQ live in lib/content.ts.
// =============================================================

import { compact, live } from "@/lib/live";

const tt = (h: string) => live.profiles[h];

export const siteConfig = {
  brandName: "elena partida",
  wordmark: "elena", // the big logo word; a ★ is drawn after it
  tagline: "UGC Creator · Top 1% TikTok Shop Affiliate · Los Angeles",
  location: "Los Angeles, CA",

  hero: {
    eyebrow: "UGC creator · Los Angeles",
    // The headline renders as: {before} <em>{highlight}</em> {after}
    headline: {
      before: "Content that makes people",
      highlight: "add to cart.",
      after: "",
    },
    subhead:
      "I'm Elena, a UGC creator and top 1% TikTok Shop affiliate making try-ons, activewear, beauty and wellness content that feels like a friend's rec and sells like an ad.",
    primaryCta: "Work with me",
    secondaryCta: "See my work",
    // Three portfolio clip ids (from lib/content.ts) fanned out in the hero.
    // The middle id is the front phone.
    phoneIds: ["7694808144492432670", "7691813384320273694", "7695609149496823071"],
  },

  contact: {
    email: "elenapartida01@gmail.com",
    instagram: "https://www.instagram.com/partidaelenaa/",
    instagramHandle: "@partidaelenaa",
    tiktok: "https://www.tiktok.com/@partidaelena",
    tiktokHandle: "@partidaelena",
    tiktokPersonal: "https://www.tiktok.com/@elenapartida",
    tiktokPersonalHandle: "@elenapartida",
  },

  // TikTok numbers are live (npm run stats). Instagram is typed by hand.
  reach: [
    { platform: "TikTok", handle: "@partidaelena", followers: compact(tt("partidaelena").followers), likes: compact(tt("partidaelena").likes) },
    { platform: "TikTok", handle: "@elenapartida", followers: compact(tt("elenapartida").followers), likes: compact(tt("elenapartida").likes) },
    { platform: "Instagram", handle: "@partidaelenaa", followers: "1.4K", likes: "" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
