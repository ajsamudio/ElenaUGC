"use client";

import { useEffect, useRef } from "react";

// Cherry, blush, baby blue, butter, cocoa: the site palette.
const COLORS = ["#C8102E", "#EC7F9C", "#F3A6BB", "#6FBCE6", "#9CD3F1", "#FFD86B", "#8A6A62"];
const MAX = 320;

type P = { x: number; y: number; vx: number; vy: number; life: number; age: number; c: string; w: number; dir: 1 | -1 };

/**
 * Ribbons of colour that pour in from both sides once the visitor hits the
 * very bottom of the page, curling through a flow field and around the cursor.
 * Sets data-streams="on" on its parent so CSS can light up the wordmark.
 */
export default function FooterStreams() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = false;
    let spawning = false;
    let t = 0;
    const ps: P[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (): P => {
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      return {
        x: dir === 1 ? -10 : w + 10,
        y: h * (0.15 + Math.random() * 0.8),
        vx: dir * (2.5 + Math.random() * 2),
        vy: 0,
        life: 320 + Math.random() * 280,
        age: 0,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        w: 1.2 + Math.random() * 2.6,
        dir,
      };
    };

    // Smooth, ever-shifting angle field: layered sines read like water.
    const field = (x: number, y: number) =>
      Math.sin(x * 0.0045 + t * 0.6) * 1.1 + Math.cos(y * 0.009 - t * 0.45) * 0.9 + Math.sin((x + y) * 0.002 + t * 0.3) * 0.6;

    const frame = () => {
      t += 0.012;

      // Fade old trails while keeping the canvas transparent over the page.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";

      if (spawning && ps.length < MAX) for (let i = 0; i < 4; i++) ps.push(spawn());

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        const a = field(p.x, p.y);
        // Always drift inward; the field only bends the path into waves.
        const speed = 3 + Math.sin(t + p.w) * 0.7;
        p.vx += (p.dir * speed * (0.75 + 0.25 * Math.cos(a)) - p.vx) * 0.05;
        p.vy += (Math.sin(a) * speed * 0.8 - p.vy) * 0.05;

        // Swirl around the cursor.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const f = (1 - Math.sqrt(d2) / 140) * 0.9;
          p.vx += (dx * 0.02 - dy * 0.03) * f;
          p.vy += (dy * 0.02 + dx * 0.03) * f;
        }

        const ox = p.x;
        const oy = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        const k = p.age / p.life;
        const alpha = Math.min(1, p.age / 20) * (1 - k) * 0.85;
        ctx.strokeStyle = p.c;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = p.w * (1 - k * 0.6);
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        if (p.age > p.life || p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60) {
          if (spawning) ps[i] = spawn();
          else ps.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1;

      if (visible || ps.length) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    // "All the way down" = within a few px of the end of the page.
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      if (atBottom && !spawning) {
        spawning = true;
        host.dataset.streams = "on";
        start();
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) {
        spawning = false;
        delete host.dataset.streams;
      } else onScroll();
    });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    resize();
    io.observe(host);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
