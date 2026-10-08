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

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const index = getServicesIndex().services;
  const related = index.filter((c) => s.related.includes(c.slug));

  return (
    <>
      <header className="section-medium">
        <h1>{s.title}</h1>
        {s.subtitle && <h2 className="mt-4 max-w-4xl font-sans font-normal !text-xl text-ink">{s.subtitle}</h2>}
        {s.introHtml && <RichText html={s.introHtml} className="mt-6 max-w-3xl" />}
      </header>

      {s.sections.map((sec, i) => (
        <Reveal key={i} as="section" className="section">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-24">
            <div className={sec.imageFirst ? "md:order-2" : ""}>
              <h2>{sec.heading}</h2>
              <RichText html={sec.html} className="blue mt-6" />
            </div>
            {sec.image && (
              <div className={sec.imageFirst ? "md:order-1" : ""}>
                <Image src={sec.image} alt={sec.imageAlt} width={1200} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full rounded-lg" />
              </div>
            )}
          </div>
        </Reveal>
      ))}

      <Testimonials items={getTestimonials()} />

      {related.length > 0 && (
        <section className="section">
          <h2 className="mb-8">Related Services</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((c) => <ServiceCard key={c.slug} service={c} />)}
          </div>
        </section>
      )}
    </>
  );
}
