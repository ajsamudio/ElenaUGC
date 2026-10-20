// Refreshes the /shop page: her pinned + latest @partidaelena videos, the
// TikTok Shop products tagged in each one, and a catalog of every product
// she has tagged.
//   1. TikTok's public creator embed lists the pinned videos first, then the
//      10 most recent (no login needed).
//   2. Each video page gives its caption, views and tagged products. The
//      portfolio clips in lib/content.ts are scanned for products too.
//   3. Products are added to the catalog and kept there, so it grows each day
//      (TikTok has no public list of a creator's whole showcase).
//   4. Posters and product photos are saved locally (TikTok's links expire).
// Results go to lib/shop.json + public/images/shop/.
//
// Run with:  npm run shop
// Also runs daily in .github/workflows/refresh-stats.yml.
// If TikTok blocks the list, the last saved shop is kept, never emptied.
import { readFile, writeFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "lib/shop.json");
const IMG_DIR = path.join(ROOT, "public/images/shop");
const HANDLE = "partidaelena";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const HEADERS = { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => stat(p).then(() => true, () => false);

function has(cmd, flag = "-version") {
  try {
    execFileSync(cmd, [flag], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
const FFMPEG = has("ffmpeg");

async function page(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function script(html, id) {
  const m = html.match(new RegExp(`<script id="${id}"[^>]*>([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`no ${id} in page`);
  return JSON.parse(m[1]);
}

/** Pinned + latest videos from the creator embed, in the order TikTok shows them. */
async function videoList() {
  const html = await page(`https://www.tiktok.com/embed/@${HANDLE}`);
  const state = script(html, "__FRONTITY_CONNECT_STATE__");
  const list = state?.source?.data?.[`/embed/@${HANDLE}`]?.videoList;
  if (!Array.isArray(list) || list.length === 0) throw new Error("empty video list");
  const seen = new Set();
  return list.filter((v) => !v.privateItem && !seen.has(v.id) && seen.add(v.id));
}

/**
 * Pinned videos sit at the top, ahead of the newest-first list. A leading video
 * is pinned when something after it is newer (ids grow with post time).
 */
function pinnedCount(ids) {
  let n = 0;
  while (n < Math.min(3, ids.length - 1) && ids.slice(n + 1).some((id) => BigInt(id) > BigInt(ids[n]))) n++;
  return n;
}

/** Caption, date, views and tagged TikTok Shop products for one video. */
async function details(id, handle = HANDLE) {
  const html = await page(`https://www.tiktok.com/@${handle}/video/${id}`);
  const data = script(html, "__UNIVERSAL_DATA_FOR_REHYDRATION__");
  const item = data?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct;
  if (!item) throw new Error("no video data");

  const products = [];
  for (const anchor of item.anchors ?? []) {
    let entries = [];
    try {
      entries = JSON.parse(anchor.extra ?? "[]");
    } catch {}
    for (const e of Array.isArray(entries) ? entries : []) {
      if (e.type !== 33) continue; // 33 = TikTok Shop product
      let p = {};
      try {
        p = JSON.parse(e.extra ?? "{}");
      } catch {}
      // Read the id as text: it's too long for a JS number.
      const productId = e.extra?.match(/"product_id":"?(\d+)/)?.[1] ?? String(e.id ?? "");
      if (!productId || products.some((x) => x.id === productId)) continue;
      products.push({
        id: productId,
        title: (p.title || e.keyword || "").trim(),
        url: p.seo_url || `https://shop.tiktok.com/us/pdp/${productId}`,
        // Ask TikTok's image CDN for a small square instead of the 800px one.
        image: (p.cover_url || p.img_url?.[0] || "").replace(/resize-jpeg:\d+:\d+/, "resize-jpeg:300:300") || null,
        category: p.categories?.find((c) => c.level === 1)?.category_name,
      });
    }
  }

  return {
    caption: (item.desc ?? "").trim(),
    postedAt: item.createTime ? new Date(Number(item.createTime) * 1000).toISOString().slice(0, 10) : undefined,
    views: Number(item.stats?.playCount) || undefined,
    cover: item.video?.cover || item.video?.originCover || null,
    products,
  };
}

/**
 * Saves an image once; returns its public path, or null if it couldn't be fetched.
 * With `width` (and ffmpeg on PATH) it's shrunk first, so daily commits stay small.
 */
async function saveImage(url, name, width) {
  const file = path.join(IMG_DIR, name);
  if (await exists(file)) return `/images/shop/${name}`;
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (width && FFMPEG) {
      const tmp = path.join(os.tmpdir(), `elena-shop-${name}`);
      await writeFile(tmp, buf);
      try {
        execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", tmp, "-vf", `scale=${width}:-2`, "-q:v", "6", file], { stdio: "ignore" });
      } finally {
        await rm(tmp, { force: true });
      }
    } else {
      await writeFile(file, buf);
    }
    return `/images/shop/${name}`;
  } catch {
    return null;
  }
}

async function main() {
  const prev = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
  const prevById = new Map((prev.videos ?? []).map((v) => [v.id, v]));
  await mkdir(IMG_DIR, { recursive: true });

  const list = await videoList();
  const pins = pinnedCount(list.map((v) => v.id));
  console.log(`Found ${list.length} videos (${pins} pinned).`);

  const videos = [];
  for (const [i, v] of list.entries()) {
    const old = prevById.get(v.id);
    let d;
    try {
      d = await details(v.id);
    } catch (e) {
      console.log(`  video – ${v.id} (${e.message}; keeping last value)`);
    }
    const poster = await saveImage(d?.cover || v.originCoverUrl || v.coverUrl, `${v.id}.jpg`, 420);
    const products = [];
    for (const p of d?.products ?? old?.products ?? []) {
      products.push({ ...p, image: (await saveImage(p.image, `p-${p.id}.jpg`)) ?? p.image ?? null });
    }
    videos.push({
      id: v.id,
      pinned: i < pins,
      caption: d?.caption ?? old?.caption ?? (v.desc ?? "").trim(),
      postedAt: d?.postedAt ?? old?.postedAt,
      views: d?.views ?? (Number(v.playCount) || old?.views),
      poster: poster ?? old?.poster ?? null,
      products,
    });
    console.log(`  video ✓ ${v.id}${i < pins ? " (pinned)" : ""} · ${products.length} products`);
    await sleep(300);
  }

  // ── Catalog: every product she's tagged, newest video first ─────────────
  const today = new Date().toISOString().slice(0, 10);
  const catalog = new Map((prev.catalog ?? []).map((p) => [p.id, p]));
  const sighting = (p, videoId, handle) => {
    const old = catalog.get(p.id);
    const newer = !old || BigInt(videoId) >= BigInt(old.videoId);
    catalog.set(p.id, {
      ...old,
      ...p,
      category: p.category ?? old?.category,
      videoId: newer ? videoId : old.videoId,
      handle: newer ? handle : old.handle,
      firstSeen: old?.firstSeen ?? today,
    });
  };
  for (const v of videos) for (const p of v.products) sighting(p, v.id, HANDLE);

  // Portfolio clips (both accounts), a few at a time.
  const content = await readFile(path.join(ROOT, "lib/content.ts"), "utf8");
  const clips = [];
  for (const line of content.split(/\r?\n/)) {
    const id = line.match(/id:\s*"(\d+)"/)?.[1];
    const handle = line.match(/handle:\s*"([\w.]+)"/)?.[1];
    if (id && handle && !videos.some((v) => v.id === id) && !clips.some((c) => c.id === id)) clips.push({ id, handle });
  }
  let tagged = 0;
  for (let i = 0; i < clips.length; i += 4) {
    await Promise.all(
      clips.slice(i, i + 4).map(async ({ id, handle }) => {
        try {
          const d = await details(id, handle);
          if (d.products.length) tagged++;
          for (const p of d.products) sighting(p, id, handle);
        } catch (e) {
          console.log(`  portfolio – ${id} (${e.message})`);
        }
      })
    );
    await sleep(400);
  }
  console.log(`Scanned ${clips.length} portfolio clips (${tagged} with products).`);

  const products = [];
  for (const p of [...catalog.values()].sort((a, b) => (BigInt(b.videoId) > BigInt(a.videoId) ? 1 : -1))) {
    const remote = p.image?.startsWith("http") ? p.image : null;
    products.push({ ...p, image: (await saveImage(remote, `p-${p.id}.jpg`)) ?? p.image ?? null });
  }

  // Drop images nothing uses any more, so the repo doesn't grow forever.
  const keep = new Set(
    [...videos.flatMap((v) => [v.poster, ...v.products.map((p) => p.image)]), ...products.map((p) => p.image)].filter(Boolean)
  );
  for (const f of await readdir(IMG_DIR)) {
    if (!keep.has(`/images/shop/${f}`)) await rm(path.join(IMG_DIR, f));
  }

  const same = JSON.stringify([videos, products]) === JSON.stringify([prev.videos, prev.catalog]);
  const out = { updatedAt: same ? prev.updatedAt : today, videos, catalog: products };
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`Done: ${videos.length} videos, ${products.length} products in the catalog.`);
}

main().catch((e) => {
  // Never fail the job over the shop; the saved file still works.
  console.error("Shop refresh skipped:", e.message);
});
