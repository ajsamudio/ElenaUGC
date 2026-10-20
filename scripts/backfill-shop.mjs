// One-time (or occasional) backfill for the /shop page: scans a list of her
// video ids and adds each video (poster, caption, views, tagged TikTok Shop
// products) to lib/shop.json. The daily job can't do this itself because
// TikTok only lists a creator's full video grid to logged-in visitors; the id
// list comes from a logged-in browser instead (one id per line, or spaces).
//
// Run with:  node scripts/backfill-shop.mjs path/to/video-ids.txt
// Resumable: progress is saved to scripts/.backfill-progress.json (gitignored),
// so re-running skips videos already scanned. Delete that file to start over.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addSighting, details, load, save, saveImage } from "./fetch-shop.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROGRESS = path.join(__dirname, ".backfill-progress.json");
const BATCH = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const listFile = process.argv[2];
  if (!listFile) throw new Error("usage: node scripts/backfill-shop.mjs <video-ids.txt>");
  const ids = [...new Set((await readFile(listFile, "utf8")).match(/\d{15,}/g) ?? [])];

  // { videos: { id: {caption, postedAt, views, poster, products} }, skipped: [id] }
  const progress = JSON.parse(await readFile(PROGRESS, "utf8").catch(() => "{}"));
  progress.videos ??= {};
  progress.skipped ??= [];
  const skipped = new Set(progress.skipped);
  const todo = ids.filter((id) => !progress.videos[id] && !skipped.has(id));
  console.log(`${ids.length} ids, ${todo.length} left to scan.`);

  await mkdir(path.join(ROOT, "public/images/shop"), { recursive: true });
  const persist = () => writeFile(PROGRESS, JSON.stringify({ videos: progress.videos, skipped: [...skipped] }));
  let fails = 0;

  for (let i = 0; i < todo.length; i += BATCH) {
    const results = await Promise.all(
      todo.slice(i, i + BATCH).map(async (id) => {
        try {
          const d = await details(id);
          // Poster links expire within days, so save it now (small, ~15 KB).
          const poster = await saveImage(d.cover, `${id}.jpg`, 300);
          progress.videos[id] = { caption: d.caption, postedAt: d.postedAt, views: d.views, poster, products: d.products };
          return true;
        } catch (e) {
          // Photo posts and removed videos have no video data; skip them for good.
          if (/no video data|no __UNIVERSAL/.test(e.message)) {
            skipped.add(id);
            return true;
          }
          return false;
        }
      })
    );
    fails = results.every(Boolean) ? 0 : fails + 1;
    if (fails >= 3) {
      // TikTok is pushing back; wait it out instead of hammering.
      console.log("  slowing down for 90s…");
      await persist();
      await sleep(90_000);
      fails = 0;
    }
    if ((i / BATCH) % 10 === 0) {
      await persist();
      console.log(`  ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
    }
    await sleep(700 + Math.random() * 600);
  }
  await persist();

  // Merge into lib/shop.json. Videos the daily job already has keep their data.
  const state = await load();
  for (const [id, v] of Object.entries(progress.videos)) {
    for (const p of v.products) addSighting(state.catalog, p, id, "partidaelena", state.today);
    const old = state.archive.get(id);
    state.archive.set(id, {
      id,
      caption: old?.caption ?? v.caption,
      postedAt: old?.postedAt ?? v.postedAt,
      views: old?.views ?? v.views,
      poster: old?.poster ?? v.poster,
      productIds: old?.productIds?.length ? old.productIds : v.products.map((p) => p.id),
    });
  }
  const n = await save(state);
  console.log(`Done: ${n.videos} videos and ${n.products} products in lib/shop.json (${skipped.size} skipped).`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
