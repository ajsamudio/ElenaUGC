import Image from "next/image";
import { fitFacts, headline } from "@/lib/content";
import { siteConfig } from "@/lib/site.config";
import Reveal from "@/components/Reveal";
import { InstagramIcon, TikTokIcon } from "@/components/Icons";

const photos = [
  { src: "/images/portrait.jpg", alt: "Elena in a cream jacket with a feather collar", tag: "hi, it's me", cls: "left-[4%] top-[6%] w-[58%] -rotate-[1.5deg] z-10", tagCls: "" },
  { src: "/images/patrick-ta-event.jpg", alt: "Elena at a Patrick Ta brand event", tag: "patrick ta event", cls: "right-[2%] top-0 w-[44%] rotate-[2deg] z-20", tagCls: "!-top-3 !bottom-auto" },
  { src: "/images/cabo-dress.jpg", alt: "Elena in a turquoise dress in Cabo", tag: "cabo", cls: "right-[10%] bottom-[2%] w-[42%] -rotate-[1deg] z-30", tagCls: "" },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* collage */}
        <Reveal variant="zoom" className="relative mx-auto aspect-[1/1.08] w-full max-w-[560px]">
          {photos.map((p) => (
            <figure key={p.src} className={`lift absolute rounded-[1.4rem] bg-white p-2 pb-3 shadow-phone ${p.cls}`}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem]">
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 1024px) 50vw, 280px" className="object-cover" />
              </div>
              <figcaption
                className={`absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-cream px-3 py-1 text-xs font-medium text-cocoa-700 shadow-soft ${p.tagCls}`}
              >
                {p.tag}
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {/* copy */}
        <div>
          <Reveal>
            <p className="eyebrow">★ About</p>
            <h2 className="h-section mt-5">
              Hi, I&rsquo;m <em>Elena.</em>
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-cocoa-700">
              <p>
                I&rsquo;m an LA-based Mexicana creator who lives in pilates sets, low-rise denim and a good iced coffee. I&rsquo;ve
                posted {headline.videos} videos across two TikToks (try-ons, GRWMs, gym days and honest reviews) and built a{" "}
                <b className="text-cocoa-900">top 1% TikTok Shop affiliate</b> business along the way.
              </p>
              <p>
                So I don&rsquo;t just make content that looks good. I know what makes someone stop scrolling, trust the rec
                and tap the link. I bring that to every brand I work with.
              </p>
              <p>Off camera you&rsquo;ll find me at hot pilates, chasing a leg-day PR, or on a froyo run.</p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-[0.9fr_1.1fr]">
            {/* hang tag */}
            <Reveal delay={100}>
              <div className="relative pt-6">
                <svg aria-hidden viewBox="0 0 60 40" className="absolute left-1/2 top-0 h-10 w-16 -translate-x-1/2">
                  <path d="M30 34C22 20 10 14 4 2M30 34c8-14 20-20 26-32" fill="none" stroke="#5F6B3A" strokeWidth="1.6" />
                </svg>
                <div className="hangtag border border-cocoa-900/15 bg-blush-100 px-6 pb-6 pt-9 shadow-soft">
                  <span aria-hidden className="absolute left-1/2 top-4 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-cocoa-900/30 bg-cream" />
                  <p className="text-center font-display text-3xl italic text-cocoa-900">fit facts</p>
                  <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-cocoa-500">for apparel brands</p>
                  <dl className="mt-4 divide-y divide-dashed divide-cocoa-900/20 text-sm">
                    {fitFacts.map((f) => (
                      <div key={f.k} className="flex items-center justify-between py-2">
                        <dt className="text-cocoa-600">{f.k}</dt>
                        <dd className="font-semibold text-cocoa-900">{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>

            {/* reach */}
            <Reveal delay={200}>
              <div className="h-full rounded-[1.6rem] border border-cocoa-900/10 bg-white/70 p-6 shadow-soft">
                <p className="font-display text-3xl italic text-cocoa-900">find me</p>
                <ul className="mt-4 space-y-3">
                  {siteConfig.reach.map((r) => (
                    <li key={r.handle}>
                      <a
                        href={
                          r.handle === siteConfig.contact.tiktokHandle
                            ? siteConfig.contact.tiktok
                            : r.handle === siteConfig.contact.tiktokPersonalHandle
                              ? siteConfig.contact.tiktokPersonal
                              : siteConfig.contact.instagram
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-blush-50"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cocoa-900 text-cream transition group-hover:bg-cherry">
                          {r.platform === "Instagram" ? <InstagramIcon /> : <TikTokIcon />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-cocoa-900">{r.handle}</span>
                          <span className="block text-xs text-cocoa-600">
                            {r.followers} followers{r.likes ? ` · ${r.likes} likes` : ""}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
