import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getWork, getWorkSlugs, getWorksOrdered } from "@/lib/content";
import { Blocks } from "@/components/Blocks";
import RichText from "@/components/RichText";
import WorksGrid from "@/components/WorksGrid";

export const dynamicParams = false;
export function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) return {};
  return {
    title: w.seo.title,
    description: w.seo.description ?? undefined,
    alternates: { canonical: `/works/${slug}` },
    openGraph: { images: w.seo.ogImage ? [w.seo.ogImage] : undefined },
  };
}

function isDarkHex(hex?: string | null) {
  if (!hex) return true;
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16), g = parseInt(full.slice(2, 4), 16), b = parseInt(full.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.6;
}

/** Case study — layout ported from the Webflow work template (.work_hero_img_wrapper, .work_hero_block, .work_top_layout). */
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWork(slug);
  if (!w) notFound();
  const { hero } = w;
  const dark = isDarkHex(hero.color);
  const related = getWorksOrdered();

  return (
    <article style={{ backgroundColor: hero.pageBg ?? undefined }}>
      {hero.bgImage && (
        <div className="relative -mt-[72px] max-h-[500px] overflow-hidden pt-[100%] sm:pt-[38%] md:-mt-[80px]" style={{ backgroundColor: hero.heroBg ?? undefined }}>
          <Image src={hero.bgImage} alt={hero.bgAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          {hero.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.logo} alt={hero.logoAlt ?? ""} className="absolute inset-0 h-full w-full object-scale-down px-[20%] py-6 sm:px-10" />
          )}
        </div>
      )}
      <header className={`px-[4.8%] pt-[30px] md:pb-[30px] ${dark ? "text-white" : "text-ink"}`} style={{ backgroundColor: hero.color ?? "#1d5303" }}>
        <div className="container px-[4.8%]">
          <dl className="mb-10 grid gap-4 text-xs sm:mb-[30px] sm:grid-cols-[minmax(200px,400px)_1fr] lg:mb-20">
            {hero.meta.slice(0, 1).map((m) => (
              <div key={m.label}>
                <dt className="mr-2 inline opacity-60">{m.label}:</dt>
                <dd className="inline">{m.value}</dd>
              </div>
            ))}
            <div className="block sm:flex">
              {hero.meta.slice(1).map((m) => (
                <div key={m.label} className="mr-4">
                  <dt className="mr-2 inline opacity-60">{m.label}:</dt>
                  <dd className="inline">{m.value}</dd>
                </div>
              ))}
            </div>
          </dl>
          <div className="mb-10 grid gap-4 sm:mb-[30px] md:grid-cols-[minmax(200px,400px)_1fr] lg:mb-20">
            <h1 className={`mb-4 text-[1.6em] leading-[1.28] tracking-[0.015em] sm:text-[1.75em] md:mb-0 md:pr-10 lg:text-[2.25em] ${dark ? "text-white" : "text-ink"}`}>{hero.title}</h1>
            <RichText html={hero.introHtml} className={`work-intro ${dark ? "white" : ""}`} />
          </div>
        </div>
      </header>

      <Blocks blocks={w.blocks} />

      <WorksGrid works={related} exclude={slug} />
    </article>
  );
}
