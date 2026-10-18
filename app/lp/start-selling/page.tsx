import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPage } from "@/lib/content";
import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";

type LP = {
  seo: { title: string; description: string; ogImage: string | null };
  heroTitle: string; heroText: string; trustedHeading: string;
  logos: { src: string; alt: string }[];
  featuresHeading: string; features: { icon: string; title: string; text: string }[];
  stepsHeading: string | null; steps: { heading: string; html: string; image: string | null; imageAlt: string; imageFirst: boolean }[];
  ctaHeading: string | null;
};

export function generateMetadata(): Metadata {
  const p = getPage<LP>("lp-start-selling");
  return { title: p.seo.title, description: p.seo.description, alternates: { canonical: "/lp/start-selling" } };
}

function CTA() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Link href="/lp/contact" className="btn">Contact us</Link>
      <Link href="/lp/schedule-a-call" className="btn btn-outline text-white">Schedule a call</Link>
    </div>
  );
}

export default function StartSellingPage() {
  const p = getPage<LP>("lp-start-selling");
  return (
    <>
      <header className="bg-blue text-center text-white">
        <div className="py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/643daddeb846f12e22666835_spark_logo_white_n.svg" alt="Spark logo" className="mx-auto h-8 w-auto" />
        </div>
        <div className="mx-auto max-w-[1340px] px-4 py-10">
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-none text-white">{p.heroTitle}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg">{p.heroText}</p>
          <CTA />
        </div>
        <div className="mx-auto max-w-[1340px] px-4 pb-10">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{p.trustedHeading}</h2>
          <ul className="mt-6 grid grid-cols-3 items-center gap-6 md:grid-cols-6">
            {p.logos.map((l) => (
              <li key={l.src} className="flex h-10 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.alt} className="max-h-10 w-auto max-w-[140px] object-contain" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mx-auto max-w-[1340px] px-4 pb-16">
          <h2 className="text-[2rem] text-white">{p.featuresHeading}</h2>
          <div className="mt-8 grid gap-8 text-left md:grid-cols-3">
            {p.features.map((f) => (
              <div key={f.title} className="rounded-md bg-white p-6 text-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.icon} alt="" className="h-12 w-12" />
                <h3 className="mt-4 text-[1.4rem]">{f.title}</h3>
                <p className="mt-2">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {p.stepsHeading && (
        <section className="mx-auto max-w-[1340px] px-4 pt-16 text-center"><h2>{p.stepsHeading}</h2></section>
      )}
      {p.steps.map((s, i) => (
        <Reveal key={i} as="section" className="mx-auto max-w-[1340px] px-4 py-12">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-24">
            <div className={s.imageFirst ? "md:order-2" : ""}>
              <h2 className="text-[1.4em] uppercase leading-[1.64] tracking-[0.03em] text-ink md:text-[1.75em]">{s.heading}</h2>
              <RichText html={s.html} className="blue mt-6" />
            </div>
            {s.image && (
              <div className={s.imageFirst ? "md:order-1" : ""}>
                <Image src={s.image} alt={s.imageAlt} width={1200} height={900} sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full rounded-lg" />
              </div>
            )}
          </div>
        </Reveal>
      ))}

      {p.ctaHeading && (
        <section className="bg-blue py-20 text-center text-white">
          <div className="mx-auto max-w-[1340px] px-4">
            <h2 className="mx-auto max-w-4xl text-white">{p.ctaHeading}</h2>
            <CTA />
          </div>
        </section>
      )}
    </>
  );
}
