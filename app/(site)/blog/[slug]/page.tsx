import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogCategories, getPost, getPostSlugs, getPosts } from "@/lib/content";
import RichText from "@/components/RichText";

export const dynamicParams = false;
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: p.seo.title, description: p.seo.description ?? undefined, alternates: { canonical: `/blog/${slug}` }, openGraph: { type: "article", images: p.image ? [p.image] : undefined } };
}

/** Blog post — Webflow template: 980px container, "back to all" link with the round arrow, 2.25em blue title,
 *  16:9 cover, 800px rich text (.blog_rich_text). */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const cat = getBlogCategories().find((c) => c.slug === p.category);
  const dir = p.rtl ? "rtl" : "ltr";
  const more = getPosts().filter((x) => x.slug !== slug && x.category === p.category).slice(0, 3);

  return (
    <article dir={dir} lang={p.rtl ? "he" : "en"} className="mx-auto max-w-[980px] px-[4.8%]">
      <div className="pt-[60px] lg:pt-[100px]">
        <Link href="/spark-blog/main" className="inline-flex items-center text-xs font-semibold uppercase leading-none tracking-[0.08em] text-blue hover:underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/6446703c365d2e2ea1a63974_arrow_left_n.svg" alt="" width={40} height={40} className={`h-10 w-10 ${p.rtl ? "ml-3 rotate-180" : "mr-3"}`} />
          back to all
        </Link>
      </div>
      <header className="pt-10 lg:pt-[60px]">
        <h1 className="!text-[2.25rem] leading-[1.23] tracking-[0.02em]">{p.title}</h1>
        <div className="h-8" />
        {p.image && (
          <>
            <div className="relative overflow-hidden pt-[56.25%]">
              <Image src={p.image} alt={p.title} fill priority sizes="(max-width: 980px) 100vw, 900px" className="object-cover" />
            </div>
            <div className="h-8" />
          </>
        )}
        {cat && <div className="eyebrow mb-6">{cat.name}</div>}
      </header>
      <section className="pb-[60px]">
        <RichText html={p.bodyHtml} className="blog" dir={dir} />
      </section>
      {more.length > 0 && (
        <section className="border-t border-blue/10 py-[50px]">
          <h2 className="tiny-header mb-6">More from {cat?.name ?? "the blog"}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug} dir={m.rtl ? "rtl" : "ltr"}>
                <Link href={`/blog/${m.slug}`} className="font-sans text-[0.8125em] font-semibold uppercase leading-[1.5] text-blue hover:underline">{m.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
