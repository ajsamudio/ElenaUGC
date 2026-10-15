"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  label: string;
  placeholder: string;
  options: readonly string[];
  /** Pass an array for multi-select, a string for single-select. */
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  invalid?: boolean;
};

/** Themed dropdown for the inquiry form. Multi-select keeps the menu open. */
export default function Dropdown({ label, placeholder, options, value, onChange, invalid }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const multi = Array.isArray(value);
  const selected = multi ? value : value ? [value] : [];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (opt: string) => {
    if (multi) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange(opt);
      setOpen(false);
    }
  };

  const summary =
    selected.length === 0
      ? placeholder
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.slice(0, 1).join(", ")} +${selected.length - 1} more`;

  return (
    <div ref={root} className="relative">
      <span id={`${id}-label`} className="mb-2.5 block text-sm font-semibold text-cocoa-900">
        {label}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left text-[15px] outline-none transition focus-visible:border-cherry focus-visible:ring-4 focus-visible:ring-cherry/10 ${
          open ? "border-cherry ring-4 ring-cherry/10" : invalid ? "border-cherry" : "border-cocoa-900/15 hover:border-cocoa-900/40"
        }`}
      >
        <span className={`truncate ${selected.length ? "text-cocoa-900" : "text-cocoa-500/70"}`}>{summary}</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-cocoa-700 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-multiselectable={multi || undefined}
          aria-labelledby={`${id}-label`}
          className="tab-panel absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-cocoa-900/10 bg-white p-1.5 shadow-soft"
        >
          {options.map((opt) => {
            const on = selected.includes(opt);
            return (
              <li key={opt} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => pick(opt)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[15px] transition ${
                    on ? "bg-blush-50 font-semibold text-cocoa-900" : "text-cocoa-700 hover:bg-cream"
                  }`}
                >
                  {opt}
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center border text-[11px] transition ${
                      multi ? "rounded-md" : "rounded-full"
                    } ${on ? "border-cherry bg-cherry text-cream" : "border-cocoa-900/20 text-transparent"}`}
                    aria-hidden
                  >
                    ✓
                  </span>
                </button>
              </li>
            );
          })}
          {multi && (
            <li className="px-1.5 pb-1 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-cherry w-full py-2.5">
                Done
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
