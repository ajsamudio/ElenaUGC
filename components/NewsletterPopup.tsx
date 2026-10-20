"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowIcon } from "@/components/Icons";

const DELAY_MS = 7000;
const JOINED_KEY = "newsletter-joined"; // once someone signs up, never show again

type Status = "idle" | "sending" | "done" | "error";

function readFlag(store: () => Storage, key: string) {
  try {
    return store().getItem(key) === "1";
  } catch {
    return false;
  }
}
function setFlag(store: () => Storage, key: string) {
  try {
    store().setItem(key, "1");
  } catch {}
}

/**
 * Newsletter card that slides in 7s after load. It's fixed to the viewport and
 * doesn't lock scrolling, so it rides along with the visitor until they close it.
 */
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (readFlag(() => localStorage, JOINED_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nickname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Try again?");
      setStatus("done");
      setFlag(() => localStorage, JOINED_KEY);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again?");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* soft wash behind the card; clicks and scrolling pass straight through */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 bg-cocoa-900/25 backdrop-blur-[2px]" />

      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-labelledby="newsletter-title"
          className="modal-in pointer-events-auto relative grid w-full max-w-[52rem] overflow-hidden rounded-[2rem] bg-cream shadow-[0_40px_80px_-24px_rgba(42,26,23,0.45)] sm:grid-cols-[0.95fr_1.05fr] sm:rounded-[2.5rem]"
        >
          {/* photo */}
          <div className="relative h-52 sm:h-auto sm:min-h-[30rem]">
            <Image
              src="/images/portrait.jpg"
              alt="Elena smiling"
              fill
              sizes="(min-width: 640px) 26rem, 100vw"
              className="object-cover object-[50%_22%] sm:object-[50%_25%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/40 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 hidden rounded-full bg-cream/90 px-3 py-1.5 text-xs font-medium text-cocoa-800 backdrop-blur sm:inline-flex">
              from my inbox to yours
            </span>
          </div>

          {/* copy + form */}
          <div className="relative px-6 pb-6 pt-5 sm:px-10 sm:py-12">

            <p className="eyebrow">The newsletter</p>

            {status === "done" ? (
              <div className="mt-5">
                <h2 id="newsletter-title" className="font-display text-[2.4rem] leading-[0.95] tracking-tight text-cocoa-900 sm:text-5xl">
                  You&rsquo;re <em className="italic text-cherry">in!</em>
                </h2>
                <p className="mt-4 text-cocoa-700">
                  Thank you for joining. Keep an eye on your inbox, I&rsquo;ll be in touch soon with updates and first
                  dibs on my courses.
                </p>
                <button type="button" onClick={close} className="btn-ghost mt-7">
                  Back to the site
                </button>
              </div>
            ) : (
              <>
                <h2 id="newsletter-title" className="mt-5 font-display text-[2.4rem] leading-[0.95] tracking-tight text-cocoa-900 sm:text-[3.4rem]">
                  Hear it from me <em className="italic text-cherry">first.</em>
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-cocoa-700 sm:text-base">
                  Join my email newsletter for updates from me, behind-the-scenes and early access to my upcoming
                  courses.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-full border border-cocoa-900/15 bg-white px-5 py-3.5 text-cocoa-900 outline-none transition placeholder:text-cocoa-500/70 focus:border-cherry focus:ring-4 focus:ring-blush-200"
                  />
                  {/* honeypot */}
                  <input
                    tabIndex={-1}
                    aria-hidden
                    autoComplete="off"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                  <button type="submit" disabled={status === "sending"} className="btn-cherry w-full py-4 disabled:opacity-60">
                    {status === "sending" ? "Joining…" : "Count me in"} <ArrowIcon />
                  </button>
                  {status === "error" && <p className="text-sm text-cherry">{error}</p>}
                </form>

                <button
                  type="button"
                  onClick={close}
                  className="mt-4 text-sm text-cocoa-500 underline decoration-cocoa-500/30 underline-offset-4 transition hover:text-cocoa-900"
                >
                  Maybe later
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close newsletter sign-up"
            className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-2xl leading-none text-cocoa-900 shadow-soft transition hover:bg-white hover:text-cherry"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}
