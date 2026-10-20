"use client";

import { useMemo, useState } from "react";
import { ClipModalProvider, useClipModal } from "@/components/ClipModal";
import Reveal from "@/components/Reveal";
import { BagIcon, EyeIcon, PlayIcon, TikTokIcon } from "@/components/Icons";
import { compact } from "@/lib/live";
import { shop, shortTitle, cleanCaption, laneOf, toModalClip, type ShopVideo } from "@/lib/shop";
import { siteConfig } from "@/lib/site.config";

const byId = new Map(shop.videos.map((v) => [v.id, toModalClip(v)]));

/** Pinned favourites, then her latest posts, each with its TikTok Shop products. */
export default function ShopFeed() {
  const pinned = shop.videos.filter((v) => v.pinned);
  const latest = shop.videos.filter((v) => !v.pinned);

  return (
    <ClipModalProvider lookup={(id) => byId.get(id)}>
      {pinned.length > 0 && <Shelf title="Pinned" sub="The ones I keep at the top of my profile." videos={pinned} />}
      <Shelf title="Just posted" sub="My newest videos, refreshed every day." videos={latest} />
      {shop.catalog.length > 0 && <Catalog />}

      <div className="container-x mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
        <span className="text-cocoa-700">See everything on</span>
        <a href={siteConfig.contact.tiktok} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2">
          <TikTokIcon /> {siteConfig.contact.tiktokHandle}
        </a>
      </div>
    </ClipModalProvider>
  );
}

function Shelf({ title, sub, videos }: { title: string; sub: string; videos: ShopVideo[] }) {
  const ids = useMemo(() => videos.map((v) => v.id), [videos]);
  return (
    <section className="container-x mt-14">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cocoa-900/10 pb-4">
        <h2 className="font-display text-4xl italic text-cocoa-900 sm:text-5xl">{title}</h2>
        <p className="text-sm text-cocoa-600">{sub}</p>
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
        {videos.map((v) => (
          <Card key={v.id} video={v} list={ids} />
        ))}
      </div>
    </section>
  );
}

const PAGE = 24;

/** Every product she's tagged, newest first, searchable and filterable by lane. */
function Catalog() {
  const lanes = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of shop.catalog) count.set(laneOf(p), (count.get(laneOf(p)) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([lane]) => lane);
  }, []);
  const [lane, setLane] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const q = query.trim().toLowerCase();
  const matches = shop.catalog.filter(
    (p) => (!lane || laneOf(p) === lane) && (!q || p.title.toLowerCase().includes(q)),
  );
  const items = matches.slice(0, shown);
  const pick = (l: string | null) => {
    setLane(l);
    setShown(PAGE);
  };

  return (
    <section id="all" className="container-x mt-20 scroll-mt-24">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-cocoa-900/10 pb-4">
        <h2 className="font-display text-4xl italic text-cocoa-900 sm:text-5xl">Everything I&rsquo;ve tagged</h2>
        <p className="text-sm text-cocoa-600">{shop.catalog.length} products from my videos, newest first.</p>
      </Reveal>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShown(PAGE);
            }}
            placeholder="Search: leggings, flats, SKIMS…"
            className="w-full rounded-full border border-cocoa-900/15 bg-white/70 px-4 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-500 focus:border-cherry focus:outline-none"
          />
        </label>
        {lanes.length > 1 && (
          <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-2 sm:flex-wrap">
              {[null, ...lanes].map((l) => {
                const on = l === lane;
                return (
                  <button
                    key={l ?? "all"}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pick(l)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      on
                        ? "border-cocoa-900 bg-cocoa-900 text-cream shadow-soft"
                        : "border-cocoa-900/15 bg-white/60 text-cocoa-700 hover:border-cocoa-900/40 hover:bg-white"
                    }`}
                  >
                    {l ?? "All"}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {matches.length === 0 && (
        <p className="mt-10 text-center text-cocoa-600">Nothing matches &ldquo;{query}&rdquo; yet.</p>
      )}

      <div
        key={lane ?? "all"}
        className="tab-panel mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6"
      >
        {items.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-3xl border border-cocoa-900/10 bg-white/70 transition hover:-translate-y-0.5 hover:border-cherry/50 hover:bg-white hover:shadow-soft"
          >
            <div className="aspect-square overflow-hidden bg-blush-50">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-cherry">
                  <BagIcon className="h-8 w-8" />
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cocoa-500">{laneOf(p)}</span>
              <span className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-cocoa-900">
                {shortTitle(p.title)}
              </span>
              <span className="mt-auto pt-2 text-xs font-semibold text-cherry group-hover:underline">Shop it →</span>
            </div>
          </a>
        ))}
      </div>

      {matches.length > shown && (
        <div className="mt-10 flex flex-col items-center gap-2">
          <button type="button" onClick={() => setShown((n) => n + PAGE)} className="btn-ghost">
            Show more
          </button>
          <p className="text-xs text-cocoa-600">
            Showing {shown} of {matches.length}
          </p>
        </div>
      )}
    </section>
  );
}

function Card({ video, list }: { video: ShopVideo; list: string[] }) {
  const { open } = useClipModal();
  const clip = toModalClip(video);
  const caption = cleanCaption(video.caption);

  return (
    <article className="flex flex-col">
      <button
        type="button"
        onClick={() => open(video.id, list)}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.6rem] border border-cocoa-900/10 bg-cocoa-900 text-left shadow-soft transition duration-500 ease-out hover:shadow-phone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cherry sm:hover:scale-[1.03]"
        aria-label={`Play: ${clip.label}`}
      >
        {video.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.poster}
            alt={clip.label}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blush-200 to-baby-200">
            <TikTokIcon className="h-10 w-10 text-cocoa-900/40" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/25" />

        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          {video.pinned ? <span className="chip bg-cream/90 text-cocoa-900 backdrop-blur">★ Pinned</span> : <span />}
          {video.views && video.views >= 1000 && (
            <span className="chip shrink-0 border border-cocoa-900 bg-butter text-cocoa-900">
              <EyeIcon /> {compact(video.views)}
            </span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          <p className="line-clamp-2 text-xs font-medium leading-snug text-white/90">{caption}</p>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-cocoa-900 transition duration-300 group-hover:scale-110 group-hover:bg-cherry group-hover:text-cream">
            <PlayIcon className="h-4 w-4 translate-x-[1px]" />
          </span>
        </div>
      </button>

      <div className="mt-3 flex flex-col gap-2">
        {video.products.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2.5 rounded-2xl border border-cocoa-900/10 bg-white/70 p-1.5 pr-3 transition hover:border-cherry/50 hover:bg-white"
          >
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded-xl bg-blush-50 object-cover"
              />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blush-100 text-cherry">
                <BagIcon />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="line-clamp-2 text-xs font-semibold leading-snug text-cocoa-900">
                {shortTitle(p.title)}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-cherry group-hover:underline">
                Shop it →
              </span>
            </span>
          </a>
        ))}
        {video.products.length === 0 && (
          <a
            href={`https://www.tiktok.com/@partidaelena/video/${video.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-1 text-xs font-semibold text-cocoa-700 hover:text-cherry"
          >
            <TikTokIcon className="h-3.5 w-3.5" /> Watch on TikTok
          </a>
        )}
      </div>
    </article>
  );
}
