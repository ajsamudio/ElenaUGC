"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site.config";
import { ArrowIcon } from "@/components/Icons";

export default function Contact() {
  const { email } = siteConfig.contact;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 px-3 pb-6 sm:px-5">
      <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-blush-200 py-24 sm:rounded-[3.5rem] sm:py-32">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-baby-200 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-butter-light blur-3xl" />

        <div className="container-x relative mx-auto max-w-3xl text-center">
          <p className="eyebrow">★ Let&rsquo;s collab</p>
          <h2 className="mt-6 font-display text-[3rem] leading-[0.92] tracking-tight text-cocoa-900 sm:text-7xl">
            Let&rsquo;s make something that <em className="italic text-cherry">sells.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-cocoa-700">
            For brand partnerships, send me a note with your product, what you have in mind and your timeline.
          </p>

          <div className="mx-auto mt-14 h-px w-16 bg-cocoa-900/20" />

          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-cocoa-500">Brand partnerships</p>
          <a
            href={`mailto:${email}`}
            className="mt-4 inline-block break-all font-display text-[1.9rem] leading-tight tracking-tight text-cocoa-900 underline decoration-cocoa-900/20 decoration-1 underline-offset-[10px] transition hover:text-cherry hover:decoration-cherry sm:text-5xl"
          >
            {email}
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${email}`} className="btn-cherry">
              Email me <ArrowIcon />
            </a>
            <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
