import Link from "next/link";
import Image from "next/image";
import type { WorkListItem } from "@/lib/content";

export default function WorkCard({ work, priority = false }: { work: WorkListItem; priority?: boolean }) {
  const href = work.url && work.url.startsWith("/") ? work.url : work.url ? new URL(work.url).pathname : null;
  const body = (
    <>
      <div className="relative w-full overflow-hidden bg-white pt-[55%]">
        <Image
          src={work.thumb}
          alt={work.name}
          fill
          sizes="(max-width: 767px) 100vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </div>
      <div className="eyebrow mt-4">{work.category}</div>
      <h3 className="mt-1">{work.name}</h3>
    </>
  );
  if (!href) return <div className="group block">{body}</div>;
  return (
    <Link href={href} className="group block">
      {body}
    </Link>
  );
}
