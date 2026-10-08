import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getClients, getPage, getServicesIndex, getWorksOrdered } from "@/lib/content";
import WorksGrid from "@/components/WorksGrid";
import Wistia from "@/components/Wistia";
import Reveal from "@/components/Reveal";
import { Arrow } from "@/components/ServiceCard";

type Home = { seo: { title: string; description: string }; heroTitle: string; heroImage: string; servicesIntro: string; experienceLine: string; wistiaId: string | null };

export function generateMetadata(): Metadata {
  const h = getPage<Home>("home");
  return { title: h.seo.title, description: h.seo.description, alternates: { canonical: "/" } };
}

export default function HomePage() {
  const h = getPage<Home>("home");
  const clients = getClients();
  const services = getServicesIndex().services;
  const works = getWorksOrdered();

  return (
    <>
      {/* Hero */}
      <header className="relative -mt-[72px] flex min-h-[640px] items-center overflow-hidden bg-blue pt-[72px] text-white md:-mt-[80px] md:min-h-[800px] md:pt-[80px]">
        <div className="grid w-full items-center gap-10 px-[4.8%] py-16 md:grid-cols-[1fr_minmax(420px,600px)] md:pr-[13%]">
          <Reveal className="relative order-2 md:order-1">
            <Image src={h.heroImage} alt="SPARK Design" width={900} height={760} priority className="mx-auto w-full max-w-[560px] md:max-w-none" />
          </Reveal>
          <div className="order-1 md:order-2">
            <div className="display text-[clamp(5rem,14vw,11rem)] font-bold leading-[0.85] text-green">SPARK</div>
            <h1 className="mt-4 font-sans font-normal text-white !text-[clamp(1.6rem,3.2vw,2.8rem)] tracking-wide">{h.heroTitle}</h1>
            <Link href="/contact" className="btn mt-8">Contact us</Link>
          </div>
        </div>
      </header>

      {/* Client logos */}
      <section className="section-medium" aria-label="Clients">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-10">
          {clients.map((c) => (
            <li key={c.slug} className="flex h-8 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.name} className="h-full w-auto max-w-[120px] object-contain" loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      {/* Services */}
      <section className="section">
        <Reveal><h2 className="max-w-4xl">{h.servicesIntro}</h2></Reveal>
        <ul className="mt-12 divide-y divide-blue/40 border-b border-blue/40">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group flex items-center justify-between py-7">
                <span className="display text-xl font-bold uppercase text-blue md:text-2xl">{s.title}</span>
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue text-blue transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Reveal className="mx-auto mt-16 max-w-4xl"><h2>{h.experienceLine}</h2></Reveal>
      </section>

      <WorksGrid works={works} />

      {h.wistiaId && (
        <section className="section pt-0">
          <Wistia id={h.wistiaId} />
        </section>
      )}
    </>
  );
}
