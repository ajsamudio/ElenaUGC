// Pulls media for every clip listed in lib/content.ts:
//   1. a poster image via TikTok's public oEmbed endpoint
//        → public/images/thumbs/<id>.jpg   (+ lib/clip-meta.json)
//   2. a short muted preview loop, if yt-dlp + ffmpeg are installed
//        → public/clips/<id>.mp4   (6s, 400px wide, no audio, ~300–600KB)
//
// Existing files are skipped, so re-running only fetches new clips.
// Run with:  npm run media        (posters only: npm run media -- --posters)
import { writeFile, mkdir, readFile, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const POSTERS_ONLY = process.argv.includes("--posters");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const exists = (p) => stat(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function has(cmd, flag = "--version") {
  try {
    execFileSync(cmd, [flag], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const content = await readFile(path.join(ROOT, "lib/content.ts"), "utf8");
  const items = [];
  const seen = new Set();
  for (const line of content.split(/\r?\n/)) {
    const id = line.match(/id:\s*"(\d+)"/)?.[1];
    const handle = line.match(/handle:\s*"([\w.]+)"/)?.[1];
    if (!id || !handle || seen.has(id)) continue;
    seen.add(id);
    items.push({ id, handle });
  }
  console.log(`Found ${items.length} clips.`);

  const thumbDir = path.join(ROOT, "public/images/thumbs");
  const clipDir = path.join(ROOT, "public/clips");
  await mkdir(thumbDir, { recursive: true });
  await mkdir(clipDir, { recursive: true });

  const metaPath = path.join(ROOT, "lib/clip-meta.json");
  const meta = (await exists(metaPath))
    ? JSON.parse(await readFile(metaPath, "utf8"))
    : {};

  // ── 1. Posters ──────────────────────────────────────────────────────────
  for (const { id, handle } of items) {
    const out = path.join(thumbDir, `${id}.jpg`);
    if (await exists(out)) {
      meta[id] = { ...meta[id], thumb: true };
      continue;
    }
    const url = `https://www.tiktok.com/@${handle}/video/${id}`;
    try {
      const res = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
        { headers: { "User-Agent": UA } }
      );
      const data = await res.json();
      const img = await fetch(data.thumbnail_url, { headers: { "User-Agent": UA } });
      await writeFile(out, Buffer.from(await img.arrayBuffer()));
      meta[id] = { ...meta[id], thumb: true };
      console.log(`  poster ✓ ${id}`);
    } catch {
      meta[id] = { ...meta[id], thumb: false };
      console.log(`  poster – ${id} (oEmbed failed)`);
    }
    await sleep(150);
  }

  // ── 2. Preview loops ────────────────────────────────────────────────────
  if (!POSTERS_ONLY && has("yt-dlp") && has("ffmpeg", "-version")) {
    const tmp = path.join(os.tmpdir(), "elena-ugc-clips");
    await mkdir(tmp, { recursive: true });
    for (const { id, handle } of items) {
      const out = path.join(clipDir, `${id}.mp4`);
      if (await exists(out)) {
        meta[id] = { ...meta[id], clip: true };
        continue;
      }
      const src = path.join(tmp, `${id}.mp4`);
      try {
        execFileSync(
          "yt-dlp",
          ["-q", "--no-warnings", "-f", "mp4/best", "-o", src,
           `https://www.tiktok.com/@${handle}/video/${id}`],
          { stdio: "ignore" }
        );
        execFileSync(
          "ffmpeg",
          ["-loglevel", "error", "-y", "-ss", "0.3", "-t", "6", "-i", src,
           "-vf", "scale=400:-2,fps=30", "-an", "-c:v", "libx264",
           "-preset", "slow", "-crf", "30", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", out],
          { stdio: "ignore" }
        );
        meta[id] = { ...meta[id], clip: true };
        console.log(`  clip ✓ ${id}`);
      } catch {
        console.log(`  clip – ${id} (download failed; poster only)`);
      } finally {
        await rm(src, { force: true });
      }
    }
  } else if (!POSTERS_ONLY) {
    console.log("yt-dlp/ffmpeg not found — skipping preview loops (posters still work).");
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
