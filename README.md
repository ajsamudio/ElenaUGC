# Elena Partida — UGC portfolio

One-page portfolio built to win brand deals for Elena Partida
(@partidaelena / @elenapartida / @partidaelenaa). Same stack as the Marie Fran
site: **Next.js 14 + Tailwind**, deployed on **Vercel**, inquiries emailed via
**Resend**.

## Run locally

```bash
npm install
npm run dev
```

## What's on the page (and why)

| Section | Why it's there |
|---|---|
| Hero: 3 phones playing her top clips | Brands see real work in the first second, with view-count stickers |
| Brand marquee | "Brands featured in my content". Kept honest, no fake client logos |
| Stats | 2.4M+ likes · 1.8M top video · 3,200+ videos · Top 1% TikTok Shop |
| Portfolio tabs | ≤8 curated clips per lane (fashion, activewear, beauty, wellness, talking-head) so brands aren't overwhelmed. Hover (desktop) or scroll (mobile) plays a muted preview; click opens the full TikTok player |
| Results | Three case studies with real public numbers |
| About + fit facts hang tag | Height and sizes are what apparel brands ask first |
| Formats, packages, add-ons, process | Removes friction: what she makes, how to buy, usage rights |
| FAQ | Usage rights, Spark Ads, turnaround, TikTok Shop |
| Inquiry form | Captures brand, services, budget and timeline in one go |

## Edit content (no component changes needed)

- **`lib/site.config.ts`**: headline, bio line, emails, social handles, reach numbers, which 3 clips play in the hero.
- **`lib/content.ts`**: portfolio clips, stats, brand list, case studies, fit facts, packages (add `price` to show one), add-ons, FAQ.
- **`public/images/`**: her photos (from Instagram).

### Add or swap a portfolio clip

1. Add a line to `clips` in `lib/content.ts` (copy the long number from the TikTok URL).
2. Run `npm run media`. It downloads the poster and makes a 6-second muted
   preview loop in `public/clips/` (needs `yt-dlp` + `ffmpeg` on PATH; without
   them you still get the poster). Existing files are skipped.

## Inquiry emails

Copy `.env.local.example` to `.env.local` and set `RESEND_API_KEY`.
`INQUIRY_TO_EMAIL` can be comma-separated (e.g. Elena + her manager at Nowadays
Talent). Without a key the form validates and shows a friendly error instead of
sending.

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it at https://vercel.com/new.
2. Add `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`, and (once the
   custom domain is live) `NEXT_PUBLIC_SITE_URL`.
3. Deploy.
