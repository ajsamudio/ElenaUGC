"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site.config";

// "/#…" so the links also work from the /shop page.
const links = [
  { href: "/#work", label: "Work" },
  { href: "/#results", label: "Results" },
  { href: "/#about", label: "About" },
  { href: "/#packages", label: "Packages" },
  { href: "/#faq", label: "FAQ" },
  { href: "/shop", label: "Shop", pill: true }, // its own page: last, in a pink pill
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Past the hero the bar fades out on the way down and comes back on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const hero = document.getElementById("top");
      const pastHero = y > (hero ? hero.offsetTop + hero.offsetHeight - 80 : window.innerHeight);
      if (!pastHero) setHidden(false);
      else if (Math.abs(y - lastY) > 6) setHidden(y > lastY);
      if (Math.abs(y - lastY) > 6 || !pastHero) lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hide = hidden && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition duration-500 ease-out sm:px-5 ${
        hide ? "pointer-events-none -translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled || open
            ? "border border-cocoa-900/10 bg-cream/80 shadow-soft backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <a href="/#top" className="font-display text-3xl italic leading-none text-cocoa-900" onClick={() => setOpen(false)}>
          {siteConfig.wordmark}
          <span className="not-italic text-cherry">★</span>
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium text-cocoa-700 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={
                  "pill" in l
                    ? "-mx-1 rounded-full bg-blush-200 px-3.5 py-1.5 font-semibold text-cocoa-900 transition hover:bg-blush-300"
                    : "transition hover:text-cherry"
                }
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="/#contact" className="btn-cherry hidden px-5 py-2.5 sm:inline-flex">
            Book Elena
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-cocoa-900/15 bg-white/70 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-0.5 w-4 rounded bg-cocoa-900 transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-4 rounded bg-cocoa-900 transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="modal-in mx-auto mt-2 max-w-7xl rounded-3xl border border-cocoa-900/10 bg-cream/95 p-3 shadow-soft backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block rounded-2xl px-4 py-3 font-display text-2xl text-cocoa-900 hover:bg-blush-100 ${
                "pill" in l ? "bg-blush-200" : ""
              }`}
            >
              {l.label}
            </a>
          ))}
          <a href="/#contact" onClick={() => setOpen(false)} className="btn-cherry mt-2 w-full">
            Book Elena
          </a>
        </div>
      )}
    </header>
  );
}
