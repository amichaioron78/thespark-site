import type { Metadata } from "next";
import Image from "next/image";
import { getPage, getTeam } from "@/lib/content";
import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";

type About = { seo: { title: string; description: string }; title: string; html: string; image: string | null; teamHeading: string };

export function generateMetadata(): Metadata {
  const a = getPage<About>("about");
  return { title: a.seo.title, description: a.seo.description, alternates: { canonical: "/about" } };
}

/** About — Webflow layout: .about_header_layout (text max 700px + image max 480px, 56px gap, 100px below),
 *  then .uk-grid-1-3-m.about team grid (30px columns, 80px rows; 40px rows below 768px). */
export default function AboutPage() {
  const a = getPage<About>("about");
  const team = getTeam();
  return (
    <>
      <section className="section-medium pb-0 pt-[50px] lg:pt-[90px]">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-14">
          <div className="max-w-[700px] flex-1">
            <h1>{a.title}</h1>
            <RichText html={a.html} className="blue about-txt mt-6" />
          </div>
          {a.image && (
            <Reveal className="w-full max-w-[480px] flex-1">
              <Image src={a.image} alt="Amichai Oron, founder of SPARK" width={1200} height={1000} priority sizes="(max-width: 767px) 100vw, 480px" className="h-auto w-full rounded-xl" />
            </Reveal>
          )}
        </div>
      </section>
      <section className="section-medium pt-[60px] lg:pt-[100px]">
        <h2 className="mb-[10px]">{a.teamHeading}</h2>
        <ul className="grid gap-x-[30px] gap-y-10 sm:grid-cols-2 md:grid-cols-3 md:gap-y-20">
          {team.map((m) => (
            <Reveal key={m.slug} as="li">
              <div className="relative overflow-hidden pt-[100%]">
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover grayscale" />
              </div>
              <h3 className="mt-2 text-[1.5rem] leading-[1.5] tracking-[0.01em] sm:mt-4">{m.name}</h3>
              <p className="eyebrow mt-[5px]">{m.role}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
