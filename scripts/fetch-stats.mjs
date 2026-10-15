// Refreshes the public numbers shown on the site:
//   • followers / likes / video count for both TikToks
//   • view counts for every clip listed in lib/content.ts
// Results go to lib/live-stats.json, which the site reads at build time.
//
// Run with:  npm run stats
// Also runs before every `npm run build` (so each Vercel deploy is fresh).
// If TikTok blocks a request, the last saved number is kept, never zeroed.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "lib/live-stats.json");
const HANDLES = ["partidaelena", "elenapartida"];
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fetch a TikTok page and pull the first `"statsV2":{...}` block out of it. */
async function statsFrom(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const m = html.match(/"statsV2":(\{[^}]*\})/);
  if (!m) throw new Error("no stats in page");
  return JSON.parse(m[1]);
}

async function main() {
  const prev = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
  const out = { updatedAt: prev.updatedAt, profiles: { ...prev.profiles }, views: { ...prev.views } };
  let fresh = 0;
  let failed = 0;

  for (const handle of HANDLES) {
    try {
      const s = await statsFrom(`https://www.tiktok.com/@${handle}`);
      out.profiles[handle] = {
        followers: Number(s.followerCount),
        likes: Number(s.heartCount),
        videos: Number(s.videoCount),
      };
      fresh++;
      console.log(`  profile ✓ @${handle}`, out.profiles[handle]);
    } catch (e) {
      failed++;
      console.log(`  profile – @${handle} (${e.message}; keeping last value)`);
    }
    await sleep(300);
  }

  const content = await readFile(path.join(ROOT, "lib/content.ts"), "utf8");
  const clips = [];
  for (const line of content.split(/\r?\n/)) {
    const id = line.match(/id:\s*"(\d+)"/)?.[1];
    const handle = line.match(/handle:\s*"([\w.]+)"/)?.[1];
    if (id && handle && !clips.some((c) => c.id === id)) clips.push({ id, handle });
  }

  // A few at a time keeps it quick without hammering TikTok.
  for (let i = 0; i < clips.length; i += 4) {
    await Promise.all(
      clips.slice(i, i + 4).map(async ({ id, handle }) => {
        try {
          const s = await statsFrom(`https://www.tiktok.com/@${handle}/video/${id}`);
          const views = Number(s.playCount);
          if (!Number.isFinite(views) || views <= 0) throw new Error("bad count");
          out.views[id] = views;
          fresh++;
        } catch (e) {
          failed++;
          console.log(`  views – ${id} (${e.message}; keeping last value)`);
        }
      })
    );
    await sleep(400);
  }

  if (fresh > 0) out.updatedAt = new Date().toISOString().slice(0, 10);
  await writeFile(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`Done: ${fresh} updated, ${failed} kept from last run.`);
}

main().catch((e) => {
  // Never fail a deploy over stats; the saved file still works.
  console.error("Stats refresh skipped:", e.message);
});
