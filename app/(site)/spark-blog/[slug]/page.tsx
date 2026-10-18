import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogCategories, getPosts } from "@/lib/content";
import Reveal from "@/components/Reveal";

export const dynamicParams = false;
export function generateStaticParams() {
  return getBlogCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getBlogCategories().find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `${c.name} | Spark Blog`, alternates: { canonical: `/spark-blog/${slug}` } };
}

/** Blog listing — Webflow spark-blog template: h1, .tab_card pills, per-category groups separated by a 1px blue divider
 *  (.blue_divider, 40px above/below), 3-column grid, small uppercase Poppins titles (.blog_pagelist_heading). */
export default async function BlogCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cats = getBlogCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const posts = getPosts().filter((p) => slug === "main" || p.category === slug);
  // The original groups "All Articles" by category sections.
  const groups = slug === "main"
    ? cats.filter((c) => c.slug !== "main").map((c) => ({ cat: c, posts: posts.filter((p) => p.category === c.slug) })).filter((g) => g.posts.length)
    : [{ cat, posts }];

  return (
    <>
      <section className="section-medium pb-0"><h1>Blog</h1></section>
      <div className="min-h-screen">
        <nav className="section pb-0 pt-0" aria-label="Blog categories">
          <ul className="-mr-5 flex flex-wrap gap-x-[10px] pb-[10px] sm:whitespace-nowrap">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/spark-blog/${c.slug}`}
                  className={`mb-[5px] inline-block rounded-full border border-blue px-4 py-2 text-[0.6em] text-blue transition-all duration-200 hover:bg-[#363ff21a] hover:opacity-100 sm:mb-4 sm:px-5 sm:text-[0.8em] ${c.slug === slug ? "opacity-100" : "opacity-35"}`}
                  aria-current={c.slug === slug ? "page" : undefined}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="section pt-0">
          {groups.map((g, gi) => (
            <section key={g.cat.slug}>
              {gi > 0 && <div className="my-10 h-px bg-blue" aria-hidden="true" />}
              {slug === "main" && (
                <>
                  <div className="h-8" />
                  <h2 className="text-[1.5em] leading-[1.5] tracking-[0.01em]">{g.cat.name}</h2>
                  <div className="h-8" />
                </>
              )}
              <div className="grid gap-[30px] sm:grid-cols-2 md:grid-cols-3">
                {g.posts.map((p) => (
                  <Reveal key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group block" dir={p.rtl ? "rtl" : undefined}>
                      <div className="relative overflow-hidden bg-ghost pt-[56.25%]">
                        {p.image ? (
                          <Image src={p.image} alt={p.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-200 group-hover:scale-[1.2]" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue/5 text-blue">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/643dad15c0e36a9b01b8da86_spark_logo_dark.svg" alt="" className="h-6 opacity-40" />
                          </div>
                        )}
                      </div>
                      <h3 className="mt-4 font-sans text-[0.8125em] font-semibold uppercase leading-[1.5] text-blue">{p.title}</h3>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
