// Every @partidaelena video the site knows about (pinned first, then newest)
// and the catalog of TikTok Shop products tagged in them. Written by
// `npm run shop` (every 4 hours in GitHub Actions) and scripts/backfill-shop.mjs.
import data from "@/lib/shop.json";
import { compact } from "@/lib/live";
import type { ModalClip } from "@/components/ClipModal";

export type ShopProduct = { id: string; title: string; url: string; image: string | null; category?: string };

/** A product from the catalog, plus the newest video she tagged it in. */
export type CatalogProduct = ShopProduct & { videoId: string; handle: "partidaelena" | "elenapartida"; firstSeen: string };

export type ShopVideo = {
  id: string;
  pinned: boolean;
  caption: string;
  postedAt?: string;
  views?: number;
  poster: string | null;
  productIds: string[]; // into shop.catalog
};

export const shop = data as { updatedAt?: string; videos: ShopVideo[]; catalog: CatalogProduct[] };

// TikTok Shop's category names → the site's own lanes. Unknown ones pass through.
const lanes: Record<string, string> = {
  "Sports & Outdoor": "Activewear",
  "Womenswear & Underwear": "Fashion",
  "Menswear & Underwear": "Fashion",
  "Fashion Accessories": "Accessories",
  "Food & Beverages": "Wellness",
  "Beauty & Personal Care": "Beauty",
  Shoes: "Shoes",
  Health: "Wellness",
};
const productById = new Map(shop.catalog.map((p) => [p.id, p]));

/** The catalog products tagged in a video, in tag order. */
export const productsOf = (v: ShopVideo) =>
  v.productIds.map((id) => productById.get(id)).filter((p): p is CatalogProduct => !!p);

export const laneOf = (p: ShopProduct) => (p.category ? lanes[p.category] ?? p.category : "Other");

/** "YEOREO Women's 2-Piece Workout Set - Off-Shoulder…" → "YEOREO Women's 2-Piece Workout Set". */
export function shortTitle(title: string) {
  const cut = title.split(/\s[-–|,]\s|,\s/)[0].trim();
  return cut.length > 48 ? `${cut.slice(0, 46).trimEnd()}…` : cut;
}

/** Caption without the hashtag pile. */
export function cleanCaption(caption: string) {
  return caption.replace(/#[\w.]+/g, "").replace(/\s+/g, " ").trim();
}

/** Shapes a shop video for the shared lightbox. */
export function toModalClip(v: ShopVideo): ModalClip {
  const p = productsOf(v)[0];
  return {
    id: v.id,
    handle: "partidaelena",
    label: p ? shortTitle(p.title) : cleanCaption(v.caption) || "Latest post",
    views: v.views && v.views >= 1000 ? compact(v.views) : undefined,
    shopUrl: p?.url,
  };
}
