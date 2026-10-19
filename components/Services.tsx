import { addOns, formats, packages, steps } from "@/lib/content";
import Reveal from "@/components/Reveal";
import { ArrowIcon, Star } from "@/components/Icons";

const formatTones = ["bg-blush-100", "bg-baby-100", "bg-butter-light", "bg-blush-100", "bg-baby-100", "bg-butter-light"];

export default function Services() {
  return (
    <section id="packages" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        {/* what I make */}
        <Reveal className="max-w-3xl">
          <p className="eyebrow">★ What I make</p>
          <h2 className="h-section mt-5">
            Every format your <em>funnel</em> needs.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {formats.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className={`lift h-full rounded-[1.75rem] border border-cocoa-900/10 p-6 ${formatTones[i]}`}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cocoa-900/10 bg-white text-2xl">
                  {f.emoji}
                </span>
                <h3 className="mt-5 font-display text-3xl leading-none text-cocoa-900">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cocoa-700">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* packages */}
        <Reveal className="mt-28 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">★ Packages</p>
            <h2 className="h-section mt-5">
              Let&rsquo;s work <em>together.</em>
            </h2>
          </div>
          <p className="max-w-sm text-cocoa-700">
            Every brand is different, so every quote is too. Start with a package and I&rsquo;ll tailor it to your goals,
            timeline and budget.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 100}>
              <div
                className={`lift relative flex h-full flex-col rounded-[2rem] border p-7 sm:p-8 ${
                  p.featured
                    ? "border-cocoa-900 bg-cherry text-cream shadow-[0_30px_60px_-30px_rgba(142,100,91,0.8)]"
                    : "border-cocoa-900/10 bg-white/70 text-cocoa-900"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3.5 right-6 inline-flex items-center gap-1 rounded-full bg-butter px-3 py-1 text-xs font-semibold text-cocoa-900">
                    <Star className="h-3.5 w-3.5" /> best value
                  </span>
                )}
                <h3 className="font-display text-4xl italic">{p.name}</h3>
                <p className={`mt-2 text-sm ${p.featured ? "text-cream/80" : "text-cocoa-600"}`}>{p.blurb}</p>
                <p className="mt-6 font-display text-3xl">{p.price || "Custom quote"}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 ${p.featured ? "text-butter" : "text-cherry"}`}>★</span>
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 ${p.featured ? "btn bg-cream text-cocoa-900 hover:bg-white" : "btn-cherry"}`}
                >
                  Get a quote <ArrowIcon />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 rounded-[1.75rem] border border-dashed border-cocoa-900/25 p-6 sm:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">Add-ons</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {addOns.map((a) => (
              <span key={a} className="rounded-full border border-cocoa-900/15 bg-white/70 px-3.5 py-2 text-sm font-medium text-cocoa-800">
                + {a}
              </span>
            ))}
          </div>
        </Reveal>

        {/* process */}
        <Reveal className="mt-28 text-center">
          <p className="eyebrow">★ How it works</p>
          <h2 className="h-section mt-5">
            Brief to <em>inbox</em> in four steps.
          </h2>
        </Reveal>
        <ol className="relative mt-14 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div aria-hidden className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-cocoa-900/20 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <li className="relative text-center">
                <span className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-full border border-cocoa-900/15 bg-cream font-display text-2xl italic text-cocoa-900">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-3xl text-cocoa-900">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-cocoa-700">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
