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

export default function AboutPage() {
  const a = getPage<About>("about");
  const team = getTeam();
  return (
    <>
      <section className="section">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,700px)_1fr] md:gap-20">
          <div>
            <h1>{a.title}</h1>
            <RichText html={a.html} className="blue mt-6 text-[1.05rem]" />
          </div>
          {a.image && (
            <Reveal>
              <Image src={a.image} alt="Amichai Oron, founder of SPARK" width={1200} height={1000} priority sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full rounded-xl" />
            </Reveal>
          )}
        </div>
      </section>
      <section className="section pt-0">
        <h2 className="mb-8 !text-xl text-ink">{a.teamHeading}</h2>
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
          {team.map((m, i) => (
            <Reveal key={m.slug} as="li" delay={(i % 3) * 70}>
              <div className="relative overflow-hidden pt-[100%]">
                <Image src={m.image} alt={m.name} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover grayscale" />
              </div>
              <h3 className="mt-5">{m.name}</h3>
              <p className="eyebrow mt-1">{m.role}</p>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
