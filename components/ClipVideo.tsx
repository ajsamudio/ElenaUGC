"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/media";
import { TikTokIcon } from "@/components/Icons";

type Props = {
  id: string;
  alt: string;
  /**
   * true / false — play or pause on demand (e.g. hover).
   * "inview"     — play automatically while at least half on screen.
   */
  play: boolean | "inview";
  className?: string;
  priority?: boolean;
};

/**
 * A 9:16 clip surface: the muted preview loop when one exists, otherwise the
 * TikTok poster. Videos never download until they're asked to play.
 */
export default function ClipVideo({ id, alt, play, className = "", priority }: Props) {
  const { poster, clip } = media(id);
  const ref = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotionOk(!mq.matches);
  }, []);

  useEffect(() => {
    if (play !== "inview" || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting && e.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [play, clip]);

  const shouldPlay = motionOk && (play === "inview" ? inView : play);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [shouldPlay]);

  if (clip) {
    return (
      <video
        ref={ref}
        className={`h-full w-full object-cover ${className}`}
        src={clip}
        poster={poster ?? undefined}
        muted
        loop
        playsInline
        preload={priority ? "auto" : "none"}
        aria-label={alt}
      />
    );
  }

  if (poster) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={poster}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`grid h-full w-full place-items-center bg-gradient-to-br from-blush-200 to-baby-200 ${className}`}>
      <TikTokIcon className="h-10 w-10 text-cocoa-900/40" />
    </div>
  );
}
