"use client";

import { siteConfig } from "@/lib/site.config";
import { clipById, clips, headline } from "@/lib/content";
import ClipVideo from "@/components/ClipVideo";
import { useClipModal } from "@/components/ClipModal";
import { ArrowIcon, EyeIcon, Star } from "@/components/Icons";

const topIds = clips.filter((c) => c.cat === "top").map((c) => c.id);

export default function Hero() {
  const { hero } = siteConfig;
  const [leftId, centerId, rightId] = hero.phoneIds;

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      {/* soft color blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="blob absolute -left-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-blush-200/70 blur-3xl" />
        <div className="blob absolute -right-24 top-16 h-[30rem] w-[30rem] rounded-full bg-baby-200/80 blur-3xl [animation-delay:-6s]" />
        <div className="blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-butter-light blur-3xl [animation-delay:-11s]" />
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_1fr] lg:gap-6">
        {/* ── Copy ── */}
        <div className="hero-in relative z-10 text-center lg:text-left">
          <p className="eyebrow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cherry opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cherry" />
            </span>
            Open for brand collabs<span className="hidden sm:inline"> · {siteConfig.location.split(",")[0]}</span>
          </p>

          <h1 className="mt-6 font-display text-[3.3rem] leading-[0.9] tracking-tight text-cocoa-900 sm:text-7xl lg:text-[5.9rem]">
            {hero.headline.before}{" "}
            <span className="squiggle italic text-cherry">
              {hero.headline.highlight}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden>
                <path d="M3 14c40-9 80-11 120-6s90 6 174-6" fill="none" stroke="#D9AE8E" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>{" "}
            {hero.headline.after}
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-cocoa-700 lg:mx-0">{hero.subhead}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a href="#contact" className="btn-cherry text-base">
              {hero.primaryCta} <ArrowIcon />
            </a>
            <a href="#work" className="btn-ghost text-base">
              {hero.secondaryCta}
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-cocoa-700 lg:justify-start">
            <li className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> <b className="text-cocoa-900">{headline.likes}</b> likes
            </li>
            <li className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> <b className="text-cocoa-900">{headline.videos}</b> videos made
            </li>
            <li className="flex items-center gap-1.5">
              <Star className="h-4 w-4" /> <b className="text-cocoa-900">Top 1%</b> TikTok Shop affiliate
            </li>
          </ul>
        </div>

        {/* ── Phone stack ── */}
        <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[560px] lg:h-[620px]">
          <Phone id={leftId} className="left-0 top-[12%] w-[38%] sm:left-[4%] sm:w-[36%]" r={-9} delay={0.35} list={topIds} />
          <Phone id={rightId} className="right-0 top-[12%] w-[38%] sm:right-[4%] sm:w-[36%]" r={8} delay={0.5} list={topIds} />
          <Phone id={centerId} className="left-1/2 top-[1%] z-20 w-[48%] -translate-x-1/2 sm:w-[44%]" r={0} delay={0.2} list={topIds} front />

          {/* spinning badge */}
          <div className="absolute right-[-3%] top-[-4%] z-30 h-20 w-20 sm:right-[-2%] sm:top-[-3%] sm:h-32 sm:w-32">
            <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
              <defs>
                <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="#5F6B3A" />
              <text fill="#FFF7F0" fontSize="11.5" fontWeight="700" letterSpacing="2.4">
                <textPath href="#badge-circle">TOP 1% TIKTOK SHOP ★ UGC CREATOR ★ </textPath>
              </text>
            </svg>
            <Star className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 sm:h-10 sm:w-10" />
          </div>

        </div>
      </div>
    </section>
  );
}

function Phone({
  id,
  className,
  r,
  delay,
  front,
  list,
}: {
  id: string;
  className: string;
  r: number;
  delay: number;
  front?: boolean;
  list: string[];
}) {
  const { open } = useClipModal();
  const clip = clipById(id);
  if (!clip) return null;

  return (
    <div className={`phone-in absolute ${className}`} style={{ animationDelay: `${delay}s` }}>
      <button
        type="button"
        onClick={() => open(id, list)}
        className="phone-tilt phone block w-full shadow-phone"
        style={{ ["--r" as string]: `${r}deg` }}
        aria-label={`Play: ${clip.label}`}
      >
        <div className="phone-screen">
          <ClipVideo id={id} alt={clip.label} play="inview" priority={front} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
          <p className="absolute inset-x-3 bottom-3 text-left text-[11px] font-semibold leading-tight text-white sm:text-xs">
            {clip.label}
          </p>
        </div>
      </button>
      {clip.views && (
        <span
          className={`absolute z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-cocoa-900 shadow-soft backdrop-blur sm:text-xs ${
            front ? "-bottom-3 left-1/2 -translate-x-1/2" : `-bottom-3 ${r < 0 ? "left-3" : "right-3"}`
          }`}
        >
          <EyeIcon /> {clip.views}
        </span>
      )}
    </div>
  );
}
