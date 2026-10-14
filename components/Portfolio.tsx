"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, clips, type CategoryKey, type Clip } from "@/lib/content";
import { siteConfig } from "@/lib/site.config";
import ClipVideo from "@/components/ClipVideo";
import { useClipModal } from "@/components/ClipModal";
import Reveal from "@/components/Reveal";
import { EyeIcon, PlayIcon, Sparkle, TikTokIcon } from "@/components/Icons";

export default function Portfolio() {
  const [active, setActive] = useState<CategoryKey>("top");
  const [touch, setTouch] = useState(false);
  const items = useMemo(() => clips.filter((c) => c.cat === active), [active]);
  const ids = useMemo(() => items.map((c) => c.id), [items]);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  return (
    <section id="work" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">★ The portfolio</p>
            <h2 className="h-section mt-5">
              Pick a lane, <em>watch it work.</em>
            </h2>
          </div>
          <p className="max-w-sm text-cocoa-700">
            Curated from {siteConfig.contact.tiktokHandle} and {siteConfig.contact.tiktokPersonalHandle}.{" "}
            {touch ? "Tap" : "Hover to preview, click"} any clip to watch it with sound.
          </p>
        </Reveal>

        {/* tabs */}
        <div className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Portfolio categories" className="flex w-max gap-2 sm:flex-wrap">
            {categories.map((c) => {
              const on = c.key === active;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(c.key)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    on
                      ? "border-cocoa-900 bg-cocoa-900 text-cream shadow-soft"
                      : "border-cocoa-900/15 bg-white/60 text-cocoa-700 hover:border-cocoa-900/40 hover:bg-white"
                  }`}
                >
                  <span className="mr-1.5">{c.emoji}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div key={active} role="tabpanel" className="tab-panel mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {items.map((c) => (
            <Card key={c.id} clip={c} list={ids} touch={touch} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Sparkle className="h-4 w-4" />
          <span className="text-cocoa-700">Want more?</span>
          <a href={siteConfig.contact.tiktok} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2">
            <TikTokIcon /> {siteConfig.contact.tiktokHandle}
          </a>
          <a href={siteConfig.contact.tiktokPersonal} target="_blank" rel="noreferrer" className="btn-ghost px-4 py-2">
            <TikTokIcon /> {siteConfig.contact.tiktokPersonalHandle}
          </a>
        </div>
      </div>
    </section>
  );
}

function Card({ clip, list, touch }: { clip: Clip; list: string[]; touch: boolean }) {
  const { open } = useClipModal();
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={() => open(clip.id, list)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.6rem] border border-cocoa-900/10 bg-cocoa-900 text-left shadow-soft transition duration-500 ease-out hover:z-10 hover:shadow-phone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cherry sm:hover:scale-[1.03]"
      aria-label={`Play: ${clip.label}${clip.brand ? ` for ${clip.brand}` : ""}`}
    >
      <ClipVideo
        id={clip.id}
        alt={clip.label}
        play={touch ? "inview" : hover}
        className="transition duration-700 group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/25" />

      <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
        {clip.brand ? (
          <span className="chip max-w-[70%] truncate bg-cream/90 text-cocoa-900 backdrop-blur">{clip.brand}</span>
        ) : (
          <span />
        )}
        {clip.views && (
          <span className="chip shrink-0 border border-cocoa-900 bg-butter text-cocoa-900">
            <EyeIcon /> {clip.views}
          </span>
        )}
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
        <p className="font-display text-lg italic leading-tight text-white sm:text-xl">{clip.label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-cocoa-900 transition duration-300 group-hover:scale-110 group-hover:bg-cherry group-hover:text-cream">
          <PlayIcon className="h-4 w-4 translate-x-[1px]" />
        </span>
      </div>
    </button>
  );
}
