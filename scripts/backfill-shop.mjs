// One-time (or occasional) backfill for the /shop catalog: scans a list of
// her video ids for tagged TikTok Shop products and merges them into
// lib/shop.json. The daily job can't do this itself because TikTok only lists
// a creator's full video grid to logged-in visitors; the id list comes from a
// logged-in browser instead (one id per line).
//
// Run with:  node scripts/backfill-shop.mjs path/to/video-ids.txt
// Resumable: progress is saved to scripts/.backfill-progress.json (gitignored),
// so re-running skips videos already scanned. Delete that file to start over.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OUT, details, saveImage } from "./fetch-shop.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS = path.join(__dirname, ".backfill-progress.json");
const BATCH = 3;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const listFile = process.argv[2];
  if (!listFile) throw new Error("usage: node scripts/backfill-shop.mjs <video-ids.txt>");
  const ids = [...new Set((await readFile(listFile, "utf8")).match(/\d{15,}/g) ?? [])];
  const progress = JSON.parse(await readFile(PROGRESS, "utf8").catch(() => '{"done":[],"found":{}}'));
  const done = new Set(progress.done);
  const todo = ids.filter((id) => !done.has(id));
  console.log(`${ids.length} ids, ${todo.length} left to scan.`);

  const save = () => writeFile(PROGRESS, JSON.stringify({ done: [...done], found: progress.found }));
  let fails = 0;

  for (let i = 0; i < todo.length; i += BATCH) {
    const results = await Promise.all(
      todo.slice(i, i + BATCH).map(async (id) => {
        try {
          const d = await details(id);
          if (d.products.length) progress.found[id] = d.products;
          done.add(id);
          return true;
        } catch (e) {
          // Photo posts and removed videos have no video data; count them as done.
          if (/no video data|no __UNIVERSAL/.test(e.message)) {
            done.add(id);
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
      await save();
      await sleep(90_000);
      fails = 0;
    }
    if ((i / BATCH) % 10 === 0) {
      await save();
      console.log(`  ${Math.min(i + BATCH, todo.length)}/${todo.length} · ${Object.keys(progress.found).length} videos with products`);
    }
    await sleep(700 + Math.random() * 600);
  }
  await save();

  // Merge into the catalog: keep the newest video each product appears in.
  const shop = JSON.parse(await readFile(OUT, "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  const catalog = new Map((shop.catalog ?? []).map((p) => [p.id, p]));
  for (const [videoId, products] of Object.entries(progress.found)) {
    for (const p of products) {
      const old = catalog.get(p.id);
      const newer = !old || BigInt(videoId) >= BigInt(old.videoId);
      catalog.set(p.id, {
        ...old,
        ...(newer ? p : {}),
        id: p.id,
        title: newer ? p.title : old.title,
        url: newer ? p.url : old.url,
        image: old?.image?.startsWith("/") ? old.image : p.image,
        category: p.category ?? old?.category,
        videoId: newer ? videoId : old.videoId,
        handle: newer ? "partidaelena" : old.handle,
        firstSeen: old?.firstSeen ?? today,
      });
    }
  }

  const out = [];
  for (const p of [...catalog.values()].sort((a, b) => (BigInt(b.videoId) > BigInt(a.videoId) ? 1 : -1))) {
    const remote = p.image?.startsWith("http") ? p.image : null;
    out.push({ ...p, image: (await saveImage(remote, `p-${p.id}.jpg`)) ?? p.image ?? null });
  }
  shop.catalog = out;
  shop.updatedAt = today;
  await writeFile(OUT, JSON.stringify(shop, null, 2) + "\n");
  console.log(`Done: ${done.size} videos scanned, ${out.length} products in the catalog.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
