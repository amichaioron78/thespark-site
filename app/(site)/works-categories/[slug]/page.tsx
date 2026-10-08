import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkCategories, getWorksOrdered } from "@/lib/content";
import WorksGrid from "@/components/WorksGrid";

export const dynamicParams = false;
export function generateStaticParams() {
  return getWorkCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getWorkCategories().find((x) => x.slug === slug);
  if (!c) return {};
  const name = c.name.trim();
  return {
    title: `${name} | Spark Works`,
    description: c.seoDescription ?? `Explore SPARK's ${name} product design, UX/UI and digital product work for SaaS, AI, mobile and complex software.`,
    alternates: { canonical: `/works-categories/${slug}` },
  };
}

export default async function WorksCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cats = getWorkCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const all = getWorksOrdered();
  const works = slug === "all" ? all : all.filter((w) => w.categories.includes(slug));

  return (
    <>
      <section className="section-medium pb-0">
        <h1>Works</h1>
      </section>
      <nav className="px-[4.8%] pt-8" aria-label="Work categories">
        <ul className="flex gap-2 overflow-x-auto pb-3 whitespace-nowrap">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/works-categories/${c.slug}`}
                className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors ${c.slug === slug ? "border-blue bg-blue text-white" : "border-blue/30 text-blue hover:bg-blue/10"}`}
                aria-current={c.slug === slug ? "page" : undefined}
              >
                {c.name.trim()}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {works.length ? (
        <WorksGrid works={works} heading={null} />
      ) : (
        <p className="section">No projects in this category yet.</p>
      )}
    </>
  );
}
