// =============================================================
// EDIT THIS FILE to change the portfolio, stats, packages + FAQ.
//
// Portfolio clips: one line per TikTok. After adding a line run
//   npm run media
// to download its poster (+ a muted preview loop if yt-dlp/ffmpeg exist).
// =============================================================

import { compact, floorPlus, totals, viewsOf } from "@/lib/live";

export type Handle = "partidaelena" | "elenapartida";

export type Clip = {
  id: string; // the long number at the end of the TikTok URL
  handle: Handle; // which of her accounts posted it
  cat: CategoryKey;
  label: string; // short card title
  brand?: string; // brand featured, shown as a chip
  views?: string; // filled in from lib/live-stats.json; badge hidden under 10K
};

export const categories = [
  { key: "top", label: "Top performers", emoji: "★" },
  { key: "fashion", label: "Fashion & try-ons", emoji: "👖" },
  { key: "active", label: "Activewear & pilates", emoji: "🩰" },
  { key: "beauty", label: "Beauty & GRWM", emoji: "💋" },
  { key: "wellness", label: "Wellness & lifestyle", emoji: "🍒" },
  { key: "talking", label: "Talking to camera", emoji: "🎙️" },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export function tiktokUrl(c: Pick<Clip, "id" | "handle">) {
  return `https://www.tiktok.com/@${c.handle}/video/${c.id}`;
}

// prettier-ignore
const clipList: Clip[] = [
  // ── Top performers ──────────────────────────────────────────────────────
  { cat: "top", handle: "partidaelena", id: "7691541999249329439", label: "Halloween costume", views: "1.1M" },
  { cat: "top", handle: "partidaelena", id: "7691813384320273694", label: "Ballet flats try-on", brand: "Dream Pairs", views: "1.8M" },
  { cat: "top", handle: "partidaelena", id: "7694808144492432670", label: "Double-lined pilates set", brand: "Yeoreo", views: "375.6K" },
  { cat: "top", handle: "elenapartida", id: "7685516504980262174", label: "Layering top try-on", brand: "Yeoreo", views: "305K" },
  { cat: "top", handle: "partidaelena", id: "7695609149496823071", label: "Pretty tops haul", views: "272.5K" },
  { cat: "top", handle: "elenapartida", id: "7670245390783925535", label: "Low-rise baggy jeans", brand: "Good American", views: "97.4K" },
  { cat: "top", handle: "elenapartida", id: "7689224571517455647", label: "Fit check: jeans", brand: "PWEST", views: "50.2K" },
  { cat: "top", handle: "elenapartida", id: "7672491731199298847", label: "Pilates set try-on", views: "42.7K" },
  { cat: "top", handle: "partidaelena", id: "7696324566758575390", label: "Workout set try-on", views: "40.3K" },

  // ── Fashion & try-ons ───────────────────────────────────────────────────
  { cat: "fashion", handle: "elenapartida", id: "7681373693154463007", label: "New jeans unboxing", views: "44.7K" },
  { cat: "fashion", handle: "elenapartida", id: "7675453188064955679", label: "Low-rise baggy jeans", views: "26.3K" },
  { cat: "fashion", handle: "elenapartida", id: "7692096905689500958", label: "Denim try-on", brand: "Cider", views: "14K" },
  { cat: "fashion", handle: "partidaelena", id: "7695606289732357407", label: "Honest jeans review" },
  { cat: "fashion", handle: "partidaelena", id: "7695569183274306846", label: "Slouchy suede boots", brand: "Steve Madden" },
  { cat: "fashion", handle: "partidaelena", id: "7696277613844729118", label: "Statement top styling" },
  { cat: "fashion", handle: "partidaelena", id: "7695911795327880478", label: "Soft lounge set", brand: "SKIMS" },
  { cat: "fashion", handle: "partidaelena", id: "7696581938320018718", label: "Cozy robe morning" },

  // ── Activewear & pilates ────────────────────────────────────────────────
  { cat: "active", handle: "partidaelena", id: "7696232105893727518", label: "Matching set try-on", views: "28.9K" },
  { cat: "active", handle: "elenapartida", id: "7675794774196112671", label: "Fit + sizing breakdown", views: "18.4K" },
  { cat: "active", handle: "elenapartida", id: "7672490861548162335", label: "Morning set, coffee run", views: "18.1K" },
  { cat: "active", handle: "elenapartida", id: "7670693714926374174", label: "Workout set in action", views: "17.9K" },
  { cat: "active", handle: "partidaelena", id: "7696276341259259166", label: "Pilates outfit", views: "14.9K" },
  { cat: "active", handle: "elenapartida", id: "7691829816751836446", label: "Two-piece set", brand: "Yeoreo", views: "11.6K" },
  { cat: "active", handle: "elenapartida", id: "7695472917328661791", label: "Confidence set", views: "10.3K" },
  { cat: "active", handle: "partidaelena", id: "7695941439687068959", label: "Lounge set try-on", brand: "Von Dutch" },

  // ── Beauty & GRWM ───────────────────────────────────────────────────────
  { cat: "beauty", handle: "partidaelena", id: "7696224224523996447", label: "Lip bundle demo", brand: "Patrick Ta" },
  { cat: "beauty", handle: "elenapartida", id: "7692280850234281246", label: "Brand event", brand: "Patrick Ta" },
  { cat: "beauty", handle: "partidaelena", id: "7695873580395023647", label: "Blush that changed it all", brand: "Rare Beauty" },
  { cat: "beauty", handle: "partidaelena", id: "7696601294236077343", label: "Tinted SPF review", brand: "ILIA" },
  { cat: "beauty", handle: "elenapartida", id: "7675085365841120542", label: "Lip plumper test" },
  { cat: "beauty", handle: "elenapartida", id: "7676666503013453087", label: "Gel-X nail day" },
  { cat: "beauty", handle: "elenapartida", id: "7633565312281087263", label: "Glowy makeup GRWM" },
  { cat: "beauty", handle: "elenapartida", id: "7632469200589638942", label: "Gym-ready GRWM", brand: "Tower 28" },

  // ── Wellness & lifestyle ────────────────────────────────────────────────
  { cat: "wellness", handle: "elenapartida", id: "7675077601756564767", label: "Creatine gummies", brand: "Arrae", views: "17.8K" },
  { cat: "wellness", handle: "elenapartida", id: "7682141427064704286", label: "Workout routine", views: "14.4K" },
  { cat: "wellness", handle: "elenapartida", id: "7674683080191249694", label: "Creatine for women", brand: "Arrae", views: "10.6K" },
  { cat: "wellness", handle: "elenapartida", id: "7673945994177842462", label: "Hot pilates vlog" },
  { cat: "wellness", handle: "elenapartida", id: "7682496365707988254", label: "Rainy Sunday in LA" },
  { cat: "wellness", handle: "elenapartida", id: "7675395855867710750", label: "Pilates studio morning" },
  { cat: "wellness", handle: "elenapartida", id: "7696270395661421854", label: "Local spot feature", brand: "Christy's Donuts" },
  { cat: "wellness", handle: "elenapartida", id: "7684461521857989918", label: "Day in my life" },

  // ── Talking to camera ───────────────────────────────────────────────────
  { cat: "talking", handle: "elenapartida", id: "7672534237026733342", label: "My best sellers, ranked", views: "130K" },
  { cat: "talking", handle: "elenapartida", id: "7669167182311443742", label: "Monthly recap", views: "127.5K" },
  { cat: "talking", handle: "elenapartida", id: "7681028061592030494", label: "Real talk", views: "93.7K" },
  { cat: "talking", handle: "elenapartida", id: "7667756473958550814", label: "Don't give up", views: "65K" },
  { cat: "talking", handle: "elenapartida", id: "7693606341507599647", label: "Commission reveal", views: "53.8K" },
  { cat: "talking", handle: "elenapartida", id: "7660964680755662111", label: "Lifestyle POV", views: "36.4K" },
];

// Live view counts replace the hand-typed ones; top performers sort by views.
const withViews = (c: Clip): Clip => {
  const v = viewsOf(c.id);
  if (v === undefined) return c;
  return { ...c, views: v >= 10_000 ? compact(v) : undefined };
};
export const clips: Clip[] = clipList.map(withViews).sort((a, b) =>
  a.cat === "top" && b.cat === "top" ? (viewsOf(b.id) ?? 0) - (viewsOf(a.id) ?? 0) : 0
);

export function clipById(id: string) {
  return clips.find((c) => c.id === id);
}

// ── Headline numbers (count up on scroll) ─────────────────────────────────
// Pulled live from both TikToks (see lib/live.ts).
const oneDecimalDown = (n: number) => Math.floor(n * 10) / 10;
export const stats = [
  { value: oneDecimalDown(totals.likes / 1_000_000), suffix: "M+", decimals: 1, label: "likes across TikTok", tone: "pink" },
  // Typed by hand from her TikTok Shop dashboard (not public, so not live).
  { value: 450, prefix: "$", suffix: "K+", decimals: 0, label: "GMV in the last 30 days", tone: "blue" },
  { value: Math.floor(totals.videos / 100) * 100, suffix: "+", decimals: 0, label: "vids created", tone: "butter" },
  { value: 1, prefix: "Top ", suffix: "%", decimals: 0, label: "TikTok Shop affiliate", tone: "cherry" },
] as const;

// ── Brands featured in her content (marquee) ──────────────────────────────
// Honest label on-site: "brands featured in my content". Swap for real client
// logos (in /public/logos) once paid partnerships can be named.
export const brands = [
  "Good American", "Dream Pairs", "Yeoreo", "SKIMS", "Patrick Ta", "Rare Beauty",
  "Steve Madden", "PacSun", "ILIA", "Arrae", "Cider", "Revice Denim",
  "Von Dutch", "Edikted", "Kristin Ess", "Tower 28", "Columbia", "Coral Canton",
];

// Headline numbers used in copy (hero chips, About).
export const headline = {
  likes: `${oneDecimalDown(totals.likes / 1_000_000)}M+`,
  videos: floorPlus(totals.videos, 100),
};

// ── Case studies (real public numbers) ────────────────────────────────────
// `metricIds` = the clips whose live views add up to the big number.
const sumViews = (ids: string[]) => ids.reduce((s, id) => s + (viewsOf(id) ?? 0), 0);
const caseStudyList = [
  {
    clipId: "7691813384320273694",
    brand: "Dream Pairs",
    kicker: "Footwear · try-on",
    metric: "1.8M",
    metricIds: ["7691813384320273694"],
    metricLabel: "views on one video",
    body: "A simple ballet-flats try-on (fit, comfort and how they style with jeans) that broke out on the For You page and kept on spreading.",
  },
  {
    clipId: "7694808144492432670",
    brand: "Yeoreo",
    kicker: "Activewear · repeat content",
    metric: "690K+",
    metricIds: ["7694808144492432670", "7685516504980262174", "7691829816751836446"],
    metricLabel: "views across 3 videos",
    body: "Pilates sets and layering tops shown on the move, with honest sizing. Three separate videos for the same brand all landed with an audience.",
  },
  {
    clipId: "7670245390783925535",
    brand: "Good American",
    kicker: "Denim · fit check",
    metric: "97.4K",
    metricIds: ["7670245390783925535"],
    metricLabel: "views",
    body: "Low-rise baggy jeans with real fit notes, answering the exact questions shoppers have before buying denim online.",
  },
];
export const caseStudies = caseStudyList.map(({ metricIds, ...cs }) => {
  const total = sumViews(metricIds);
  return total ? { ...cs, metric: metricIds.length > 1 ? `${compact(total)}+` : compact(total) } : cs;
});

// ── Fit facts (for apparel brands) ────────────────────────────────────────
export const fitFacts = [
  { k: "Height", v: "5′6.5″" },
  { k: "Tops", v: "XS – S" },
  { k: "Denim", v: "25 – 26" },
  { k: "Based in", v: "Los Angeles" },
];

// ── What I make ───────────────────────────────────────────────────────────
export const formats = [
  { emoji: "👖", title: "Try-ons & fit checks", body: "Size, fit and styling shown honestly. The content that answers 'will this fit me?' before they buy." },
  { emoji: "📦", title: "Unboxings & first impressions", body: "Genuine reactions, close-up details and the moment the product earns its place." },
  { emoji: "💋", title: "GRWM & beauty demos", body: "Application, swatches and wear tests, filmed in natural light." },
  { emoji: "🎙️", title: "Talking-head reviews", body: "Hook-first, to-camera reviews that sound like a friend, not a script." },
  { emoji: "🩰", title: "Lifestyle & routines", body: "Pilates, gym, coffee runs and LA days with your product written into the routine." },
  { emoji: "📸", title: "Product photos", body: "Clean on-body and flat-lay stills for your site, ads and PDPs." },
];

// ── Packages ──────────────────────────────────────────────────────────────
// `price` is optional. Leave it "" to show "Custom quote".
export const packages = [
  {
    name: "The Single",
    price: "",
    blurb: "One scroll-stopping video to test a product or angle.",
    items: ["1 UGC video (15–60s)", "2 hook variations", "Raw footage on request", "1 round of revisions"],
    featured: false,
  },
  {
    name: "The Bundle",
    price: "",
    blurb: "The sweet spot for testing what converts.",
    items: ["3 UGC videos", "3 hooks per video", "5 product photos", "1 round of revisions"],
    featured: true,
  },
  {
    name: "The Monthly",
    price: "",
    blurb: "Fresh creative every month for brands running ads.",
    items: ["4–8 videos a month", "Hook + angle testing", "Trend-led concepts", "Priority scheduling"],
    featured: false,
  },
];

export const addOns = [
  "Paid usage rights (30/60/90 days)",
  "Spark Ads / whitelisting codes",
  "Post on my TikTok + Shop link",
  "Extra hooks",
  "Raw footage",
  "Rush delivery",
];

// ── How it works ──────────────────────────────────────────────────────────
export const steps = [
  { n: "01", title: "Send the brief", body: "Tell me the product, the goal and where it'll run. A rough idea is fine." },
  { n: "02", title: "Get a quote", body: "I reply with concepts, deliverables and pricing that fit your budget." },
  { n: "03", title: "Ship the product", body: "I live with it, test it, and film it the way your customer would." },
  { n: "04", title: "Content delivered", body: "Edited videos, hooks and photos in your inbox, with a round of revisions." },
];

// ── FAQ ───────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "What's the difference between UGC and an influencer post?",
    a: "UGC is content made for your brand to use on your socials, in paid ads, on product pages. It doesn't have to be posted on my account. If you'd like it posted to my TikTok too (with a Shop link), that's an add-on.",
  },
  {
    q: "Do you include usage rights?",
    a: "Organic use on your own channels is included. Running the content as paid ads is licensed separately for 30, 60 or 90 days (or longer), so you only pay for what you need.",
  },
  {
    q: "Can you do Spark Ads or whitelisting?",
    a: "Yes, I can provide Spark Ad codes for TikTok and whitelisting access so your ads run from my handle.",
  },
  {
    q: "What's the turnaround?",
    a: "It depends on the package and shipping time. I'll confirm dates in your quote. Rush delivery is available.",
  },
  {
    q: "Do I need to send product?",
    a: "Yes for physical products. I only make content about things I've actually used. Apps, services and local spots in LA are welcome too.",
  },
  {
    q: "Do you take TikTok Shop collabs?",
    a: "Yes. As a top 1% TikTok Shop affiliate I know what sells on Shop. Reach out with a sample request or a paid collab and I'll tell you what I'd make.",
  },
];
