import { siteConfig } from "@/lib/site.config";
import { InstagramIcon, MailIcon, TikTokIcon } from "@/components/Icons";

export default function Footer() {
  const { contact } = siteConfig;
  const socials = [
    { href: contact.tiktok, label: contact.tiktokHandle, icon: <TikTokIcon /> },
    { href: contact.tiktokPersonal, label: contact.tiktokPersonalHandle, icon: <TikTokIcon /> },
    { href: contact.instagram, label: contact.instagramHandle, icon: <InstagramIcon /> },
    { href: `mailto:${contact.email}`, label: "Email", icon: <MailIcon /> },
  ];

  return (
    <footer className="relative overflow-hidden pb-12 pt-16">
      <div className="container-x">
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cocoa-900/15 bg-white/70 px-4 py-2 text-sm font-semibold text-cocoa-800 transition hover:border-cherry hover:text-cherry"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>

        <p
          aria-hidden
          className="footer-wordmark pointer-events-none mt-10 select-none text-center font-display text-[24vw] italic leading-[0.8] tracking-tight text-cocoa-900 lg:text-[17rem]"
        >
          {siteConfig.wordmark}
          <span className="footer-star not-italic text-cherry">★</span>
        </p>

        <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-2 text-xs text-cocoa-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Elena Partida · {siteConfig.tagline}</p>
          <a href="#top" className="font-semibold hover:text-cherry">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
