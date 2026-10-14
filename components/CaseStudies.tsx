"use client";

import { caseStudies, clipById } from "@/lib/content";
import ClipVideo from "@/components/ClipVideo";
import { useClipModal } from "@/components/ClipModal";
import Reveal from "@/components/Reveal";
import { PlayIcon, Sparkle, Star } from "@/components/Icons";

const ids = caseStudies.map((c) => c.clipId);

export default function CaseStudies() {
  const { open } = useClipModal();

  return (
    <section id="results" className="scroll-mt-20 px-3 sm:px-5">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-cocoa-900 py-20 text-cream sm:rounded-[3.5rem] sm:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cherry/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-baby-400/20 blur-3xl" />

        <div className="container-x relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow border-cream/20 bg-cream/10 text-cream">★ Results</p>
            <h2 className="mt-5 font-display text-[2.6rem] leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Not just pretty videos — <em className="italic text-blush-300">videos that move product.</em>
            </h2>
            <p className="mt-5 max-w-xl text-cream/70">
              Real, public numbers from my feed. As a top 1% TikTok Shop affiliate I see what sells every day, and that
              instinct goes into every brief.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {caseStudies.map((cs, i) => {
              const clip = clipById(cs.clipId);
              return (
                <Reveal key={cs.clipId} delay={i * 110}>
                  <article className="lift group flex h-full flex-col overflow-hidden rounded-[2rem] border border-cream/10 bg-cream/[0.06] backdrop-blur">
                    <button
                      type="button"
                      onClick={() => open(cs.clipId, ids)}
                      className="relative aspect-[4/5] w-full overflow-hidden"
                      aria-label={`Play the ${cs.brand} video`}
                    >
                      <ClipVideo id={cs.clipId} alt={clip?.label ?? cs.brand} play="inview" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cocoa-900 via-cocoa-900/10 to-transparent" />
                      <span className="absolute left-4 top-4 chip bg-cream text-cocoa-900">{cs.kicker}</span>
                      <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream/90 text-cocoa-900 transition group-hover:bg-cherry group-hover:text-cream">
                        <PlayIcon className="h-4 w-4 translate-x-[1px]" />
                      </span>
                      <div className="absolute inset-x-5 bottom-4 text-left">
                        <p className="font-display text-7xl leading-none tracking-tight text-butter sm:text-8xl">{cs.metric}</p>
                        <p className="mt-1 text-sm font-semibold text-cream/85">{cs.metricLabel}</p>
                      </div>
                    </button>
                    <div className="flex flex-1 flex-col p-6 pt-4">
                      <h3 className="flex items-center gap-2 font-display text-3xl italic">
                        {cs.brand} <Star className="h-5 w-5" />
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream/70">{cs.body}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-10 flex items-center justify-center gap-2 text-sm text-cream/60">
            <Sparkle className="h-3.5 w-3.5" color="#F3A6BB" />
            Public view counts as of Oct 2026.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
