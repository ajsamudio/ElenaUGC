import { faqs } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 pb-20 sm:pb-28">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">★ FAQ</p>
          <h2 className="h-section mt-5">
            Good <em>questions.</em>
          </h2>
          <p className="mt-5 max-w-sm text-cocoa-700">Anything else? Ask in your inquiry. I answer every one.</p>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group rounded-[1.5rem] border border-cocoa-900/10 bg-white/70 px-6 py-5 transition open:bg-blush-50 open:shadow-soft">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left text-lg font-semibold text-cocoa-900">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cocoa-900/20 text-lg transition duration-300 group-open:rotate-45 group-open:border-cherry group-open:bg-cherry group-open:text-cream">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-cocoa-700">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
