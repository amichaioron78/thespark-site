import Link from "next/link";
import Reveal from "./Reveal";
import WorkCard from "./WorkCard";
import type { WorkListItem } from "@/lib/content";

export default function WorksGrid({ works, heading = "Works", viewAll = true, exclude }: { works: WorkListItem[]; heading?: string | null; viewAll?: boolean; exclude?: string }) {
  const list = exclude ? works.filter((w) => w.slug !== exclude) : works;
  return (
    <section className="section">
      {heading && (
        <div className="mb-10 flex items-end justify-between">
          <h2 className="!text-base">{heading}</h2>
          {viewAll && <Link href="/works-categories/all" className="text-xs font-semibold text-blue hover:underline">View All</Link>}
        </div>
      )}
      <div className="grid gap-x-20 gap-y-16 md:grid-cols-2">
        {list.map((w, i) => (
          <Reveal key={w.slug} delay={(i % 2) * 80}>
            <WorkCard work={w} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
