// Small inline icon + sticker set. Stickers are hand-drawn-ish SVGs that echo
// Elena's emoji language (🍒 ⭐️ 🩰 🩵).

type P = { className?: string; style?: React.CSSProperties };

export function TikTokIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.8a4.3 4.3 0 0 1-1.1-2.8h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon({ className = "h-5 w-5" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

export function EyeIcon({ className = "h-3.5 w-3.5" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function BagIcon({ className = "h-4 w-4" }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

// ── Stickers ──────────────────────────────────────────────────────────────

export function Star({ className = "h-6 w-6", style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1.8l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9l7.1-.6z"
        fill="#EAD7CB"
        stroke="#2A1A17"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ className = "h-6 w-6", style, color = "#8E645B" }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0z" fill={color} />
    </svg>
  );
}

export function Cherry({ className = "h-14 w-14", style }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <path d="M30 6c-2 10-8 20-16 28M30 6c4 9 12 18 20 24" stroke="#4E3530" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M30 6c6-4 14-3 18 2-6 3-13 3-18-2z" fill="#C9A894" stroke="#2A1A17" strokeWidth="1.4" />
      <circle cx="16" cy="44" r="13" fill="#8E645B" stroke="#2A1A17" strokeWidth="1.8" />
      <circle cx="47" cy="40" r="13" fill="#8E645B" stroke="#2A1A17" strokeWidth="1.8" />
      <ellipse cx="11" cy="39" rx="3.5" ry="2.3" fill="#fff" opacity=".75" transform="rotate(-30 11 39)" />
      <ellipse cx="42" cy="35" rx="3.5" ry="2.3" fill="#fff" opacity=".75" transform="rotate(-30 42 35)" />
    </svg>
  );
}

export function Bow({ className = "h-12 w-16", style }: P) {
  return (
    <svg viewBox="0 0 80 56" className={className} style={style} aria-hidden="true">
      <path d="M40 24C30 8 8 4 6 16s16 20 34 10z" fill="#EBCFC6" stroke="#2A1A17" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M40 24c10-16 32-20 34-8S58 36 40 26z" fill="#EBCFC6" stroke="#2A1A17" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M37 27 26 52l8-3 4 6 4-26M43 27l11 25-8-3-4 6" fill="#DAB1A6" stroke="#2A1A17" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="34" y="19" width="12" height="12" rx="4" fill="#DAB1A6" stroke="#2A1A17" strokeWidth="1.8" />
    </svg>
  );
}

export function Heart({ className = "h-8 w-8", style }: P) {
  return (
    <svg viewBox="0 0 32 32" className={className} style={style} aria-hidden="true">
      <path d="M16 28S3 20.5 3 11.5A6.5 6.5 0 0 1 16 8a6.5 6.5 0 0 1 13 3.5C29 20.5 16 28 16 28z" fill="#D1B9A2" stroke="#2A1A17" strokeWidth="1.6" strokeLinejoin="round" />
      <ellipse cx="10" cy="11" rx="2.6" ry="1.6" fill="#fff" opacity=".8" transform="rotate(-35 10 11)" />
    </svg>
  );
}
