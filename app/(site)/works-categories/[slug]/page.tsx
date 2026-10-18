import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkCategories, getWorksAllOrdered } from "@/lib/content";
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

/** Works listing — Webflow works-categories template: h1, .tab_card filter pills (wrapping), .uk-grid-1-2-m.works grid (40px gaps). */
export default async function WorksCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cats = getWorkCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const all = getWorksAllOrdered();
  const works = slug === "all" ? all : all.filter((w) => w.categories.includes(slug));

  return (
    <>
      <section className="section-medium pb-0">
        <h1>Works</h1>
      </section>
      <div className="min-h-screen">
        <nav className="section pt-0 pb-0" aria-label="Work categories">
          <ul className="-mr-5 flex flex-wrap gap-x-[10px] pb-[10px] sm:whitespace-nowrap">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/works-categories/${c.slug}`}
                  className={`mb-[5px] inline-block rounded-full border border-blue px-4 py-2 text-[0.6em] text-blue transition-all duration-200 hover:bg-[#363ff21a] hover:opacity-100 sm:mb-4 sm:px-5 sm:text-[0.8em] ${c.slug === slug ? "opacity-100" : "opacity-35"}`}
                  aria-current={c.slug === slug ? "page" : undefined}
                >
                  {c.name.trim()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {works.length ? (
          <WorksGrid works={works} heading={null} gap="works" />
        ) : (
          <p className="section">No projects in this category yet.</p>
        )}
      </div>
    </>
  );
}
