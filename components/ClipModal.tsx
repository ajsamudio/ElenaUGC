"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clipById, tiktokUrl, type Clip } from "@/lib/content";
import { ArrowIcon, BagIcon, EyeIcon, TikTokIcon } from "@/components/Icons";

/** What the lightbox needs to show a clip; portfolio clips and shop videos both fit. */
export type ModalClip = Pick<Clip, "id" | "handle" | "label" | "brand" | "views"> & { shopUrl?: string };

type Ctx = { open: (id: string, list?: string[]) => void };
const ModalCtx = createContext<Ctx>({ open: () => {} });

export const useClipModal = () => useContext(ModalCtx);

/**
 * Wraps the page so any clip (hero phones, portfolio, case studies) can open
 * the full TikTok player in a lightbox, with prev/next through its group.
 */
export function ClipModalProvider({
  children,
  lookup = clipById,
}: {
  children: React.ReactNode;
  /** Where ids are looked up; defaults to the portfolio clips. */
  lookup?: (id: string) => ModalClip | undefined;
}) {
  const [list, setList] = useState<string[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = useCallback((id: string, ids?: string[]) => {
    const l = ids && ids.includes(id) ? ids : [id];
    setList(l);
    setIndex(l.indexOf(id));
  }, []);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + list.length) % list.length)),
    [list.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, step]);

  const clip = index === null ? undefined : lookup(list[index]);

  return (
    <ModalCtx.Provider value={{ open }}>
      {children}
      {clip && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-cocoa-900/80 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={clip.label}
        >
          <div className="modal-in relative flex w-full max-w-[400px] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex w-full items-center justify-between gap-3 text-cream">
              <div className="min-w-0">
                <p className="truncate font-display text-2xl italic leading-none">{clip.label}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-cream/75">
                  {clip.brand && <span className="chip bg-cream/15 text-cream">{clip.brand}</span>}
                  {clip.views && (
                    <span className="inline-flex items-center gap-1">
                      <EyeIcon /> {clip.views} views
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={close}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream/15 text-xl text-cream transition hover:bg-cream/25"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="relative aspect-[9/16] max-h-[72vh] w-full overflow-hidden rounded-[1.75rem] bg-black shadow-2xl">
              <iframe
                key={clip.id}
                src={`https://www.tiktok.com/player/v1/${clip.id}?autoplay=1&description=0&music_info=0&rel=0&controls=1`}
                className="absolute inset-0 h-full w-full"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                title={clip.label}
              />
            </div>

            <div className="mt-4 flex w-full items-center justify-between">
              <button
                onClick={() => step(-1)}
                disabled={list.length < 2}
                className="grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa-900 transition hover:scale-105 disabled:opacity-30"
                aria-label="Previous clip"
              >
                <ArrowIcon className="h-4 w-4 rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                {clip.shopUrl && (
                  <a
                    href={clip.shopUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-cocoa-900 transition hover:bg-white"
                  >
                    <BagIcon /> Shop it
                  </a>
                )}
                <a
                  href={tiktokUrl(clip)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-cream/25"
                >
                  <TikTokIcon /> {clip.shopUrl ? "TikTok" : "Watch on TikTok"}
                </a>
              </div>
              <button
                onClick={() => step(1)}
                disabled={list.length < 2}
                className="grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa-900 transition hover:scale-105 disabled:opacity-30"
                aria-label="Next clip"
              >
                <ArrowIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalCtx.Provider>
  );
}
