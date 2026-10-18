import type { Metadata } from "next";
import { getServicesIndex } from "@/lib/content";
import ServiceCard from "@/components/ServiceCard";

export function generateMetadata(): Metadata {
  const s = getServicesIndex();
  return { title: s.seo.title, description: s.seo.description ?? undefined, alternates: { canonical: "/services" } };
}

export default function ServicesPage() {
  const s = getServicesIndex();
  return (
    <>
      <section className="section-medium pb-0"><h1 className="max-w-[880px]">{s.title}</h1></section>
      <section className="section pt-0">
        <div className="grid gap-[30px] md:grid-cols-2">
          {s.services.map((c) => <ServiceCard key={c.slug} service={c} />)}
        </div>
      </section>
    </>
  );
}
