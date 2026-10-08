import type { Metadata } from "next";
import { getPage, getServicesIndex } from "@/lib/content";
import ServiceCard from "@/components/ServiceCard";
import RichText from "@/components/RichText";

type P = { seo: { title: string; description: string }; title: string; pillarHtml: string };

export function generateMetadata(): Metadata {
  const p = getPage<P>("ux-ui-design-agency-israel");
  return { title: p.seo.title, description: p.seo.description, alternates: { canonical: "/ux-ui-design-agency-israel" } };
}

export default function AgencyPage() {
  const p = getPage<P>("ux-ui-design-agency-israel");
  const services = getServicesIndex().services;
  return (
    <>
      <section className="section-medium pb-0"><h1 className="max-w-5xl">{p.title}</h1></section>
      <section className="section">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((c) => <ServiceCard key={c.slug} service={c} />)}
        </div>
      </section>
      <section className="section pt-0">
        <RichText html={p.pillarHtml} className="blog" />
      </section>
    </>
  );
}
