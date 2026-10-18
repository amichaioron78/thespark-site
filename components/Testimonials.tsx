"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/content";

/**
 * Testimonials carousel — replicates the Swiper setup of the Webflow build
 * (one centred slide, 30px between slides, loop, keyboard, prev/next arrows overlaid at the edges).
 * Implemented with native scroll-snap so it also swipes on touch.
 */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    if (!el || !items.length) return;
    const n = ((i % items.length) + items.length) % items.length;
    const slide = el.children[n] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setIndex(n);
  }, [items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth + 30;
      setIndex(Math.round(el.scrollLeft / w) % Math.max(items.length, 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section className="px-[4.8%] py-[50px]" aria-label="Testimonials">
      <div
        className="relative mt-[70px] sm:mt-0"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); } if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); } }}
      >
        <div ref={track} className="snap-x flex gap-[30px] overflow-x-auto">
          {items.map((t) => (
            <figure key={t.slug} className="w-full shrink-0 snap-center bg-[#363ff20d] px-5 py-[30px] text-center text-blue md:px-[30px] lg:px-[60px] lg:py-[100px] xl:px-[200px]">
              <blockquote className="display text-[1.2em] font-bold leading-[1.5] tracking-[0.01em] sm:text-[1.4em]">{t.quote.startsWith("“") || t.quote.startsWith('"') ? t.quote : `“${t.quote}”`}</blockquote>
              <Image src={t.image} alt={t.name} width={80} height={80} className="mx-auto mt-5 h-20 w-20 rounded-full object-cover sm:mt-10" />
              <figcaption className="mt-4">
                <div className="text-xs font-semibold uppercase">{t.name}</div>
                <div className="text-sm text-[#363ff2cc]">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        {/* .swiper-arrows / .swiper-arrows.right */}
        <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous testimonial" className="absolute inset-y-0 left-0 z-10 flex items-center px-[10px] lg:px-5 max-sm:-top-[57px] max-sm:bottom-auto max-sm:h-[50px] max-sm:w-1/2 max-sm:justify-end max-sm:pr-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/6446703c365d2e2ea1a63974_arrow_left_n.svg" alt="" width={40} height={40} className="h-8 w-8 rounded-full bg-[#f5f5fe] transition-colors duration-300 hover:bg-[#e5e5f3] lg:h-[50px] lg:w-[50px] max-sm:h-10 max-sm:w-10 max-sm:bg-transparent" />
        </button>
        <button type="button" onClick={() => goTo(index + 1)} aria-label="Next testimonial" className="absolute inset-y-0 right-0 z-10 flex items-center px-[10px] lg:px-5 max-sm:-top-[57px] max-sm:bottom-auto max-sm:h-[50px] max-sm:w-1/2 max-sm:justify-start max-sm:pl-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/64e2e06dd976ad0632d80e2d_arrow_right_n.svg" alt="" width={40} height={40} className="h-8 w-8 rounded-full bg-[#f5f5fe] transition-colors duration-300 hover:bg-[#e5e5f3] lg:h-[50px] lg:w-[50px] max-sm:h-10 max-sm:w-10 max-sm:bg-transparent" />
        </button>
      </div>
    </section>
  );
}
