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
        <div className="relative max-h-[500px] overflow-hidden pt-[100%] sm:pt-[38%]" style={{ backgroundColor: hero.heroBg ?? undefined }}>
          <Image src={hero.bgImage} alt={hero.bgAlt ?? ""} fill priority sizes="100vw" className="object-cover" />
          {hero.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.logo} alt={hero.logoAlt ?? ""} className="absolute inset-0 h-full w-full object-scale-down p-6 md:px-10" />
          )}
        </div>
      )}
      <header className={`px-[4.8%] py-8 md:py-10 ${dark ? "text-white" : "text-ink"}`} style={{ backgroundColor: hero.color ?? "#1d5303" }}>
        <div className="container">
          <dl className="flex flex-wrap gap-x-10 gap-y-2 text-xs uppercase">
            {hero.meta.map((m) => (
              <div key={m.label} className="flex gap-2">
                <dt className="opacity-60">{m.label}:</dt>
                <dd className="normal-case">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.85fr] md:gap-16">
            <h1 className={`text-[2.25rem] leading-[1.28] ${dark ? "text-white" : "text-ink"}`}>{hero.title}</h1>
            <RichText html={hero.introHtml} className={dark ? "white" : ""} />
          </div>
        </div>
      </header>

      <div className="pb-10">
        <Blocks blocks={w.blocks} />
      </div>

      <WorksGrid works={related} exclude={slug} />
    </article>
  );
}
