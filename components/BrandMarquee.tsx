import { brands } from "@/lib/content";

// A single quiet band of brand names.
export default function BrandMarquee() {
  return (
    <section aria-label="Brands featured in my content" className="relative z-10 -my-2 overflow-hidden py-10">
      <p className="sr-only">Brands featured in my content: {brands.join(", ")}</p>
      <Band items={brands} className="text-cocoa-700" />
      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
        Brands featured in my content
      </p>
    </section>
  );
}

function Band({ items, className, reverse }: { items: string[]; className: string; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`marquee border-y border-cocoa-900/10 py-4 ${className}`} aria-hidden>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {loop.map((b, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-5 font-display text-2xl italic sm:text-3xl">
            {b}
            <span className="ml-10 not-italic text-cocoa-500/50">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
