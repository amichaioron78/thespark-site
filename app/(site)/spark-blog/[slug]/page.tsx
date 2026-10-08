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
      <nav className="px-[4.8%] pt-8" aria-label="Blog categories">
        <ul className="flex gap-2 overflow-x-auto pb-3 whitespace-nowrap">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/spark-blog/${c.slug}`} className={`inline-block rounded-full border px-4 py-2 text-sm transition-colors ${c.slug === slug ? "border-blue bg-blue text-white" : "border-blue/30 text-blue hover:bg-blue/10"}`} aria-current={c.slug === slug ? "page" : undefined}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {groups.map((g) => (
        <section key={g.cat.slug} className="section">
          {slug === "main" && <h2 className="mb-8 !text-xl">{g.cat.name}</h2>}
          <div className="grid gap-8 md:grid-cols-3">
            {g.posts.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <Link href={`/blog/${p.slug}`} className="group block" dir={p.rtl ? "rtl" : undefined}>
                  <div className="relative overflow-hidden rounded-lg bg-ghost pt-[56.25%]">
                    {p.image ? (
                      <Image src={p.image} alt={p.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue/5 text-blue">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/643dad15c0e36a9b01b8da86_spark_logo_dark.svg" alt="" className="h-6 opacity-40" />
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 !text-lg leading-snug group-hover:underline">{p.title}</h2>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
