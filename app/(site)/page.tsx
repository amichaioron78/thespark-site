import Link from "next/link";
import type { Metadata } from "next";
import { getClients, getPage, getServicesIndex, getWorksOrdered } from "@/lib/content";
import WorksGrid from "@/components/WorksGrid";
import Wistia from "@/components/Wistia";
import Reveal from "@/components/Reveal";
import HeroLottie from "@/components/HeroLottie";

type Home = { seo: { title: string; description: string }; heroTitle: string; heroImage: string; servicesIntro: string; experienceLine: string; wistiaId: string | null };

const LOGO_SVG = "/images/643d9f505b6258cdb327adb5_spark_logo.svg";

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
      {/* Hero — ported from ._1_home_hero_header: face + wordmark are Lottie animations scrubbed by the mouse on desktop,
          static SVGs on tablet/mobile and without JS. */}
      <header className="hero relative -mt-[72px] flex min-h-[640px] items-center overflow-hidden bg-blue pt-[72px] text-white md:-mt-[80px] md:pt-[80px] lg:min-h-[800px]">
        <HeroLottie />
        {/* Face (desktop, JS): absolutely positioned over the whole header, like .lottie_col_render_here_face */}
        <div data-lottie="face" aria-hidden="true" className="hero-face pointer-events-none absolute inset-y-0 left-0 hidden w-[90%] opacity-0 transition-opacity duration-500 lg:block" />
        {/* Face (desktop, no JS): same spot, static */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={h.heroImage} alt="" aria-hidden="true" className="hero-face-static pointer-events-none absolute inset-y-0 left-0 hidden h-full w-[90%] object-contain object-left lg:block" />

        <div className="hero-container w-full px-[4.8%] lg:pr-[13%]">
          <div className="grid gap-4 lg:grid-cols-[1fr_minmax(500px,600px)]">
            <div className="hidden lg:block" aria-hidden="true" />
            <div className="relative z-10 text-center lg:text-left">
              {/* Wordmark (desktop, JS) like .lottie_col_logo_render_here */}
              <div data-lottie="logo" aria-label="SPARK" role="img" className="hero-logo relative left-[-55%] hidden h-[250px] w-[155%] opacity-0 transition-opacity duration-500 lg:block" />
              {/* Wordmark (desktop no-JS + tablet/mobile) like .hero_mobile_relative_w_logo */}
              <div className="hero-logo-static relative mx-auto w-1/2 pt-[19%] lg:mx-0 lg:w-full lg:pt-[30%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={LOGO_SVG} alt="SPARK" className="absolute inset-0 h-full w-full" />
              </div>
              <div className="h-4" />
              <div className="hidden h-4 lg:block" />
              <h1 data-hero-reveal className="hero-sub">{h.heroTitle}</h1>
              <div className="h-4" />
              <Link href="/contact" data-hero-reveal className="btn hero-btn lg:hidden">Contact us</Link>
            </div>
            {/* Face (tablet/mobile) like .home_hero_mobile_o */}
            <div className="-mr-5 -mt-[108px] pb-[41px] text-right sm:-mt-[100px] lg:hidden" aria-hidden="true">
              <div className="relative ml-auto w-[70%] pt-[143%] sm:w-full sm:pt-[132%] md:pt-[100%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={h.heroImage} alt="" className="absolute inset-y-0 right-0 h-full w-full object-contain object-[100%_0%] sm:w-[60%] sm:object-[100%_50%]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Client logos */}
      <section className="section-medium" aria-label="Clients">
        <ul className="grid grid-cols-3 items-center gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-10">
          {clients.map((c) => (
            <li key={c.slug} className="flex h-[30px] items-center justify-center opacity-70 sm:h-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.name} className="h-full w-auto max-w-[90px] object-contain sm:max-w-[120px]" loading="lazy" />
            </li>
          ))}
        </ul>
      </section>

      {/* Services list — .home_service_card */}
      <section className="section">
        <Reveal><h2 className="max-w-[880px] text-[1.44em] sm:text-[1.8em] md:text-[2.25em]">{h.servicesIntro}</h2></Reveal>
        <ul className="mt-12">
          {services.map((s) => (
            <li key={s.slug}>
              <Reveal as="div">
                <Link href={`/services/${s.slug}`} className="home-service-card group flex items-center justify-between border-b border-blue py-[22px] text-blue md:py-[30px]">
                  <span className="display flex-1 pr-4 text-[1.28em] font-bold uppercase md:text-[1.575em] lg:text-[1.75em]">{s.title}</span>
                  <span className="inline-flex shrink-0 items-center justify-center rounded-full border border-blue p-4 transition-all duration-300 ease-in group-hover:border-green group-hover:bg-green md:p-[26px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/643e78cc7815ca6ff9f60418_arrow_top_right.svg" alt="" width={28} height={28} className="h-[22px] w-[22px] md:h-7 md:w-7" />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal className="mt-16 max-w-[880px]"><h2 className="text-[1.44em] sm:text-[1.8em] md:text-[2.25em]">{h.experienceLine}</h2></Reveal>
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
