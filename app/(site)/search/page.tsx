import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getServicesIndex, getWorks } from "@/lib/content";

export const metadata: Metadata = { title: "Search Results", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const { query = "" } = await searchParams;
  const q = query.trim().toLowerCase();
  const items = [
    ...getWorks().map((w) => ({ href: `/works/${w.slug}`, title: w.name, kind: "Work", text: `${w.name} ${w.category}` })),
    ...getServicesIndex().services.map((s) => ({ href: `/services/${s.slug}`, title: s.title, kind: "Service", text: `${s.title} ${s.description}` })),
    ...getPosts().map((p) => ({ href: `/blog/${p.slug}`, title: p.title, kind: "Blog", text: `${p.title} ${p.bodyHtml.replace(/<[^>]+>/g, " ")}` })),
  ];
  const results = q ? items.filter((i) => i.text.toLowerCase().includes(q)) : [];
  return (
    <section className="section-medium min-h-[60vh]">
      <h1>Search Results</h1>
      <form action="/search" className="mt-6 flex max-w-xl gap-3">
        <input name="query" defaultValue={query} placeholder="Search…" className="field !mb-0 !border-b-blue text-ink" aria-label="Search" />
        <button type="submit" className="btn">Search</button>
      </form>
      {q && <p className="mt-6 text-sm">{results.length} result{results.length === 1 ? "" : "s"} for “{query}”</p>}
      <ul className="mt-6 space-y-4">
        {results.map((r) => (
          <li key={r.href}>
            <span className="eyebrow mr-3">{r.kind}</span>
            <Link href={r.href} className="display text-lg font-bold text-blue hover:underline">{r.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
