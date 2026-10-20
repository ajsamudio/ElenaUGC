import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ShopFeed from "@/components/ShopFeed";
import { shop } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shop | Elena Partida",
  description: "Elena's pinned and latest TikToks, with the TikTok Shop products from each one.",
};

export default function ShopPage() {
  const updated = shop.updatedAt
    ? new Date(`${shop.updatedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  return (
    <>
      <Nav />
      <main>
        <section id="top" className="relative overflow-hidden pb-12 pt-28 sm:pt-32 lg:pt-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="blob absolute -left-32 -top-24 h-[26rem] w-[26rem] rounded-full bg-blush-200/70 blur-3xl" />
            <div className="blob absolute -right-24 top-10 h-[24rem] w-[24rem] rounded-full bg-baby-200/80 blur-3xl [animation-delay:-6s]" />
          </div>
          <div className="container-x text-center">
            <p className="eyebrow">★ Shop my feed{updated && <span className="hidden sm:inline"> · updated {updated}</span>}</p>
            <h1 className="h-section mx-auto mt-6 max-w-3xl">
              Everything I&rsquo;m <em>loving lately.</em>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-cocoa-700">
              My pinned favorites and newest TikTok Shop finds. Tap a video to watch it, or shop the exact piece I&rsquo;m
              wearing.
            </p>
            {shop.catalog.length > 0 && (
              <a href="#all" className="btn-ghost mt-7">
                Browse all {shop.catalog.length} products ↓
              </a>
            )}
          </div>
        </section>

        <ShopFeed />
      </main>
      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
