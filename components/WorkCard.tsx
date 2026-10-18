import Link from "next/link";
import Image from "next/image";
import type { WorkListItem } from "@/lib/content";

/** Work card (.work_card_wrapper): 55% image frame, hover scales the image 1.05 and underlines the title. */
export default function WorkCard({ work, priority = false }: { work: WorkListItem; priority?: boolean }) {
  const href = work.url && work.url.startsWith("/") ? work.url : work.url ? new URL(work.url).pathname : null;
  const body = (
    <>
      <div className="relative mb-3 w-full overflow-hidden bg-white pt-[55%] sm:mb-4">
        <Image
          src={work.thumb}
          alt={work.name}
          fill
          sizes="(max-width: 767px) 100vw, 45vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.05]"
          priority={priority}
        />
      </div>
      <div className="eyebrow">{work.category}</div>
      <div className="inline-block">
        <h3 className="inline-block text-[1.5rem] leading-[1.2] tracking-[0.01em] sm:leading-[1.5]">{work.name}</h3>
        <span className="block h-[2px] w-0 bg-blue transition-all duration-200 group-hover:w-full" />
      </div>
    </>
  );
  if (!href) return <div className="group block">{body}</div>;
  return (
    <Link href={href} className="group block">
      {body}
    </Link>
  );
}
