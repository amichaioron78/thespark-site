"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/works-categories/all", label: "Works", match: /^\/works/ },
  { href: "/about", label: "About" },
  { href: "/spark-blog/main", label: "Blog", match: /^\/(spark-blog|blog)/ },
];

type Featured = { slug: string; name: string; category: string; image: string } | null;

/**
 * Navbar ported from the Webflow build ([fixed_navbar]):
 * - transparent over the page; once the page is scrolled (scrollTop > 0, except on /contact) it gets the
 *   `.active` state: white background, the text links fade out and a round white hamburger button scales in
 *   next to the CONTACT US button; the hamburger opens the off-canvas menu (featured project + big links).
 * - on dark heroes (home, contact) the logo/links are white until the navbar is active.
 * - below 992px the text links are always hidden and the hamburger is always visible; below 768px the CTA hides too.
 */
export default function Nav({ featured }: { featured: Featured }) {
  const pathname = usePathname();
  const isContact = pathname === "/contact";
  const dark = pathname === "/" || isContact;
  const blackLinks = /^\/works\/[^/]+$/.test(pathname); // case-study pages use black nav links on the original
  const [open, setOpen] = useState(false);
  const [scrolledRaw, setScrolled] = useState(false);
  const scrolled = scrolledRaw && !isContact;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onDark = dark && !scrolled;
  const logo = onDark ? "/images/643daddeb846f12e22666835_spark_logo_white_n.svg" : "/images/643dad15c0e36a9b01b8da86_spark_logo_dark.svg";
  const linkColor = onDark ? "text-white" : blackLinks ? "text-ink" : "text-blue";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[4000] transition-colors duration-500 ${scrolled ? "bg-white" : "bg-transparent"}`}
        data-active={scrolled ? "" : undefined}
      >
        <nav className="flex items-center px-[4.8%] py-[10px] sm:py-5" aria-label="Main">
          <Link href="/" className="flex items-center" aria-label="SPARK home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Spark logo" width={112} height={24} className="h-6 w-auto transition-opacity duration-200" />
          </Link>

          <div className="ml-auto hidden items-center md:flex">
            {/* Text links: desktop only, fade out when the navbar is active */}
            <div className={`hidden items-center transition-opacity duration-200 lg:flex ${scrolled || isContact ? "pointer-events-none opacity-0" : "opacity-100"}`}>
              {LINKS.map((l) => {
                const active = l.match ? l.match.test(pathname) : pathname.startsWith(l.href);
                return (
                  <Link key={l.href} href={l.href} className={`group px-5 py-[14px] text-base transition-colors duration-200 ${linkColor}`}>
                    <span className="block">{l.label}</span>
                    <span className={`block h-[2px] bg-current transition-all duration-200 group-hover:w-full ${active ? "w-full" : "w-0"}`} />
                  </Link>
                );
              })}
            </div>
            {!isContact && <Link href="/contact" className="btn">Contact us</Link>}
          </div>

          {/* Hamburger: always visible below 992px; on desktop it scales in only when the navbar is active */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={`ml-auto flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-500 md:ml-[10px] ${
              scrolled ? "lg:w-[38px] lg:scale-100 lg:opacity-100" : "lg:ml-0 lg:w-0 lg:scale-0 lg:opacity-0"
            }`}
            style={{ transformOrigin: "100% 50%" }}
            aria-label="Open menu"
            aria-expanded={open}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/6440624e9ea55071c20a20b5_hamburger.svg" alt="" width={20} height={14} className={`h-[14px] w-5 ${blackLinks ? "grayscale" : ""}`} />
          </button>
        </nav>
      </header>

      {/* Off-canvas menu (featured project + links), as on the original */}
      <div
        className={`fixed inset-0 z-[5000] bg-blue text-white transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-[4.8%] py-5">
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/643daddeb846f12e22666835_spark_logo_white_n.svg" alt="Spark logo" className="h-6 w-auto" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white/10 transition-transform duration-300 hover:rotate-90">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/6440559d26a3acc5533c8248_button-close.svg" alt="" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-10 grid flex-1 gap-10 lg:grid-cols-[minmax(0,6fr)_1px_4fr]">
            {featured && (
              <div className="hidden lg:block">
                <div className="font-semibold">Featured Project</div>
                <Link href={`/works/${featured.slug}`} className="group mt-6 flex items-center gap-8">
                  <div className="min-w-0 flex-1">
                    <div className="overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={featured.image} alt={featured.name} className="aspect-[16/9] w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-80" />
                    </div>
                    <div className="eyebrow mt-4 !text-white">{featured.category}</div>
                    <h3 className="mt-1 inline-block text-white">
                      {featured.name}
                      <span className="block h-[2px] w-0 bg-white transition-all duration-200 group-hover:w-full" />
                    </h3>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/644047c35f677d8396b2b72b_Arrow_Green.svg" alt="" className="h-14 w-14 shrink-0 rounded-full transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#333bd8]" />
                </Link>
              </div>
            )}
            <div className="hidden bg-white/30 lg:block" aria-hidden="true" />
            <div className="flex flex-col">
              <ul className="space-y-3 text-3xl md:text-4xl">
                {[{ href: "/", label: "Home" }, ...LINKS].map((l) => {
                  const active = l.href === "/" ? pathname === "/" : l.match ? l.match.test(pathname) : pathname.startsWith(l.href);
                  return (
                    <li key={l.href}>
                      <Link href={l.href} className={`group inline-block ${active ? "text-green" : "text-white"}`}>
                        <span className="block">{l.label}</span>
                        <span className={`block h-[2px] bg-current transition-all duration-200 group-hover:w-full ${active ? "w-full" : "w-0"}`} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/contact" className="btn mt-8 self-start text-xs">Contact us</Link>
              <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-2 pt-10 text-sm uppercase">
                <span>Tel: <a href="tel:+972547775609" className="hover:text-green">+972 54777 5609</a></span>
                <span>E-mail: <a href="mailto:info@thespark.ai" className="normal-case underline hover:text-green">info@thespark.ai</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
