// Live numbers pulled from TikTok by `npm run stats` (also runs on every build).
// Everything on the site that shows a count reads from here.
import data from "@/lib/live-stats.json";

type LiveStats = {
  updatedAt?: string;
  profiles: Record<string, { followers: number; likes: number; videos: number }>;
  views: Record<string, number>;
};

export const live = data as LiveStats;

/** 2352347 → "2.4M", 449400 → "449.4K", 14000 → "14K". */
export function compact(n: number) {
  if (n >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (n >= 1_000) return `${trim(n / 1_000)}K`;
  return String(n);
}
const trim = (x: number) => (Math.floor(x * 10) / 10).toFixed(1).replace(/\.0$/, "");

/** Saved view count for a clip, if the stats script has seen it. */
export const viewsOf = (id: string): number | undefined => live.views[id];

const profiles = Object.values(live.profiles);
export const totals = {
  likes: profiles.reduce((s, p) => s + p.likes, 0),
  videos: profiles.reduce((s, p) => s + p.videos, 0),
  topViews: Math.max(0, ...Object.values(live.views)),
};

/** Rounds down to a clean "and counting" number: 3251 → "3,200+". */
export function floorPlus(n: number, step: number) {
  return `${(Math.floor(n / step) * step).toLocaleString("en-US")}+`;
}
