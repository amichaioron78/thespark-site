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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const cat = getBlogCategories().find((c) => c.slug === p.category);
  const dir = p.rtl ? "rtl" : "ltr";
  const more = getPosts().filter((x) => x.slug !== slug && x.category === p.category).slice(0, 3);

  return (
    <article dir={dir} lang={p.rtl ? "he" : "en"}>
      <div className="section-medium pb-0">
        <Link href="/spark-blog/main" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-blue hover:underline">
          <span aria-hidden="true">{p.rtl ? "→" : "←"}</span> back to all
        </Link>
      </div>
      <header className="section pt-8">
        <div className="mx-auto max-w-[800px]">
          {cat && <div className="eyebrow mb-3">{cat.name}</div>}
          <h1 className="!text-[2.25rem] leading-tight">{p.title}</h1>
          {p.image && (
            <div className="relative mt-8 overflow-hidden rounded-lg pt-[56.25%]">
              <Image src={p.image} alt={p.title} fill priority sizes="(max-width: 900px) 100vw, 800px" className="object-cover" />
            </div>
          )}
        </div>
      </header>
      <section className="section pt-0">
        <RichText html={p.bodyHtml} className="blog" dir={dir} />
      </section>
      {more.length > 0 && (
        <section className="section border-t border-blue/10">
          <h2 className="mb-6 !text-xl">More from {cat?.name ?? "the blog"}</h2>
          <ul className="grid gap-6 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug} dir={m.rtl ? "rtl" : "ltr"}>
                <Link href={`/blog/${m.slug}`} className="display text-lg font-bold text-blue hover:underline">{m.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
