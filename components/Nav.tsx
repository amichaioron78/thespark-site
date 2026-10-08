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

export default function Nav({ featured }: { featured: Featured }) {
  const pathname = usePathname();
  const dark = pathname === "/" || pathname === "/contact";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[4000] transition-colors duration-500 ${scrolled ? "bg-white/95 backdrop-blur shadow-[0_1px_0_rgba(35,35,35,0.06)]" : "bg-transparent"}`}
      >
        <nav className="flex items-center justify-between px-[4.8%] py-4 md:py-5" aria-label="Main">
          <Link href="/" className="flex items-center" aria-label="SPARK home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Spark logo" width={110} height={28} className="h-6 w-auto md:h-7" />
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => {
              const active = l.match ? l.match.test(pathname) : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm transition-opacity hover:opacity-70 ${onDark ? "text-white" : "text-ink"} ${active ? "underline underline-offset-8 decoration-2" : ""}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/contact" className="btn">Contact us</Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className={`block h-0.5 w-7 ${onDark ? "bg-white" : "bg-ink"}`} />
            <span className={`mt-1.5 block h-0.5 w-7 ${onDark ? "bg-white" : "bg-ink"}`} />
            <span className={`mt-1.5 block h-0.5 w-5 ${onDark ? "bg-white" : "bg-ink"}`} />
          </button>
        </nav>
      </header>

      {/* Off-canvas menu (mobile + optional desktop) */}
      <div
        className={`fixed inset-0 z-[5000] bg-blue text-white transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-[4.8%] py-5">
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/643daddeb846f12e22666835_spark_logo_white_n.svg" alt="Spark logo" className="h-6 w-auto" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full bg-white/10 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/6440559d26a3acc5533c8248_button-close.svg" alt="" className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-10 grid flex-1 gap-10 md:grid-cols-[minmax(0,6fr)_4fr]">
            {featured && (
              <Link href={`/works/${featured.slug}`} className="hidden md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt={featured.name} className="aspect-[16/9] w-full rounded-lg object-cover" />
                <div className="mt-4 eyebrow !text-green">{featured.category}</div>
                <h3 className="mt-1 text-white">{featured.name}</h3>
              </Link>
            )}
            <ul className="space-y-3 text-3xl md:text-4xl">
              {[{ href: "/", label: "Home" }, ...LINKS, { href: "/contact", label: "Contact us" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="display font-bold text-white hover:text-green">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-2 text-sm uppercase">
            <a href="tel:+972547775609">+972 54777 5609</a>
            <a href="mailto:info@thespark.ai" className="normal-case underline">info@thespark.ai</a>
          </div>
        </div>
      </div>
    </>
  );
}
