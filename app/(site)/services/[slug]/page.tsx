import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getService, getServiceSlugs, getServicesIndex, getTestimonials } from "@/lib/content";
import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";

export const dynamicParams = false;
export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: s.seo.title, description: s.seo.description ?? undefined, alternates: { canonical: `/services/${slug}` }, openGraph: { images: s.seo.ogImage ? [s.seo.ogImage] : undefined } };
}

/** Service page — layout ported from the Webflow service template:
 *  header = tiny light h1 + blue Playfair h2 statement + intro; sections = 2-col grid (.uk-grid-1-2-m) with
 *  uppercase .sub_heading titles and blue copy; Swiper testimonials; "Related Services" tiny header + cards. */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const index = getServicesIndex().services;
  const related = index.filter((c) => s.related.includes(c.slug));

  return (
    <>
      <header className="section-medium pt-10 lg:pt-[100px]">
        <div className="max-w-[880px]">
          <h1 className="tiny-header light">{s.title}</h1>
          <div className="h-8" />
          {s.subtitle && <h2 className="text-[1.62em] md:text-[1.8em] lg:text-[1.5em]">{s.subtitle}</h2>}
          {s.introHtml && (
            <>
              <div className="h-4" />
              <div className="hidden h-4 lg:block" />
              <RichText html={s.introHtml} className="text-ink" />
            </>
          )}
        </div>
      </header>

      {s.sections.map((sec, i) => (
        <Reveal key={i} as="section" className="section">
          <div className={`grid items-start gap-10 md:grid-cols-2 lg:gap-20 ${i === 0 ? "xl:gap-[100px]" : ""}`}>
            <div className={sec.imageFirst ? "md:order-2" : ""}>
              <h2 className="text-[1.4em] uppercase leading-[1.64] tracking-[0.03em] md:text-[1.75em]">{sec.heading}</h2>
              <div className="h-4" />
              <RichText html={sec.html} className="blue max-w-[630px]" />
            </div>
            {sec.image && (
              <div className={sec.imageFirst ? "md:order-1" : ""}>
                <Image src={sec.image} alt={sec.imageAlt} width={1200} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full" />
              </div>
            )}
          </div>
        </Reveal>
      ))}

      <Testimonials items={getTestimonials()} />

      {related.length > 0 && (
        <section className="section">
          <h2 className="tiny-header mb-4">Related Services</h2>
          <div className="grid gap-[30px] md:grid-cols-2">
            {related.map((c) => <ServiceCard key={c.slug} service={c} as="h3" />)}
          </div>
        </section>
      )}
    </>
  );
}
