"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";
import Reveal from "@/components/Reveal";

const tones: Record<string, string> = {
  pink: "bg-blush-100",
  blue: "bg-baby-100",
  butter: "bg-butter-light",
  cherry: "bg-cherry text-cream",
};

export default function Stats() {
  return (
    <section className="container-x py-16 sm:py-20" aria-label="By the numbers">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-6 sm:gap-4 xl:grid-cols-5">
        {stats.map((s, i) => (
          // Mobile: 2 + 2 + 1 wide. Tablet/laptop: 3 + 2. Wide screens: one row of 5.
          <Reveal
            key={s.label}
            delay={i * 90}
            variant="zoom"
            className={`${i === stats.length - 1 ? "col-span-2" : ""} ${i < 3 ? "sm:col-span-2" : "sm:col-span-3"} xl:col-span-1`}
          >
            <div
              className={`lift relative h-full overflow-hidden rounded-4xl border border-cocoa-900/10 p-5 sm:p-7 xl:p-6 ${tones[s.tone]}`}
            >
              <p className="font-display text-5xl leading-none tracking-tight sm:text-7xl xl:text-6xl">
                <CountUp to={s.value} decimals={s.decimals} prefix={"prefix" in s ? s.prefix : ""} suffix={s.suffix} />
              </p>
              <p className={`mt-3 text-sm font-medium ${s.tone === "cherry" ? "text-cream/85" : "text-cocoa-700"}`}>
                {s.label}
              </p>
              <span aria-hidden className="absolute right-4 top-4 text-lg opacity-70">
                ★
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CountUp({ to, decimals, prefix = "", suffix = "" }: { to: number; decimals: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVal(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  const shown = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
  return (
    <span ref={ref} aria-label={`${prefix}${decimals ? to.toFixed(decimals) : to.toLocaleString("en-US")}${suffix}`}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
