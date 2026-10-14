import { brands } from "@/lib/content";

// Two crossing "tape" bands of brand names, like stickers slapped across the page.
export default function BrandMarquee() {
  const half = Math.ceil(brands.length / 2);
  const rowA = brands.slice(0, half);
  const rowB = brands.slice(half);

  return (
    <section aria-label="Brands featured in my content" className="relative z-10 -my-2 overflow-hidden py-10">
      <p className="sr-only">Brands featured in my content: {brands.join(", ")}</p>
      <Band items={[...rowA, ...rowB]} className="-rotate-2 bg-cherry text-cream" />
      <Band items={[...rowB, ...rowA]} className="-mt-3 rotate-[1.5deg] bg-baby-200 text-cocoa-900" reverse />
      <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-cocoa-500">
        ★ brands featured in my content ★
      </p>
    </section>
  );
}

function Band({ items, className, reverse }: { items: string[]; className: string; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className={`marquee -mx-6 border-y-2 border-cocoa-900 py-3 shadow-sticker ${className}`} aria-hidden>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {loop.map((b, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-5 font-display text-2xl italic sm:text-3xl">
            {b}
            <span className="ml-10 not-italic">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
