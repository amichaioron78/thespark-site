import Image from "next/image";
import type { Testimonial } from "@/lib/content";

/** Horizontal snap carousel (the Webflow build used Swiper). */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="section" aria-label="Testimonials">
      <div className="snap-x flex gap-6 overflow-x-auto pb-4">
        {items.map((t) => (
          <figure key={t.slug} className="flex w-[88vw] shrink-0 flex-col items-center bg-[#363ff20d] px-6 py-14 text-center text-blue md:w-[70vw] md:px-24 md:py-24 lg:w-[60vw]">
            <blockquote className="max-w-3xl text-lg leading-relaxed md:text-xl">“{t.quote}”</blockquote>
            <Image src={t.image} alt={t.name} width={80} height={80} className="mt-10 h-20 w-20 rounded-full object-cover" />
            <figcaption className="mt-3">
              <div className="text-xs font-semibold uppercase">{t.name}</div>
              <div className="text-sm text-blue/80">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-ink/50">Scroll sideways for more</p>
    </section>
  );
}
