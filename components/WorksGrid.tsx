import Link from "next/link";
import Reveal from "./Reveal";
import WorkCard from "./WorkCard";
import type { WorkListItem } from "@/lib/content";

/** Works grid (.uk-grid-1-2-m: 2 columns, 80px gaps — 40px on the works listing (.works) and below 992px; 1 column below 768px). */
export default function WorksGrid({ works, heading = "Works", viewAll = true, exclude, gap = "default" }: { works: WorkListItem[]; heading?: string | null; viewAll?: boolean; exclude?: string; gap?: "default" | "works" }) {
  const list = exclude ? works.filter((w) => w.slug !== exclude) : works;
  return (
    <section className={`section ${heading ? "" : "pt-0"}`}>
      {heading && (
        <div className="mb-8 flex items-center justify-between">
          <h2 className="tiny-header">{heading}</h2>
          {viewAll && <Link href="/works-categories/all" className="text-link-tiny">View All</Link>}
        </div>
      )}
      <div className={`grid gap-10 md:grid-cols-2 ${gap === "works" ? "" : "lg:gap-20"}`}>
        {list.map((w, i) => (
          <Reveal key={w.slug}>
            <WorkCard work={w} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
