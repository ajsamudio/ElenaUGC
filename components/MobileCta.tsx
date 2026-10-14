"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/Icons";

/** Sticky "book me" pill on phones — appears after the hero, hides at the form. */
export default function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const atForm = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      setShow(past && !atForm);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition duration-500 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <a href="#contact" className="btn-cherry w-full max-w-sm py-4 text-base">
        Work with Elena <ArrowIcon />
      </a>
    </div>
  );
}
