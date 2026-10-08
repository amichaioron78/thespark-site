import Link from "next/link";
import type { ServiceCard as T } from "@/lib/content";

export default function ServiceCard({ service }: { service: T }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block bg-[#363ff20d] p-8 text-blue transition-colors hover:bg-[#363ff21a] md:p-12">
      <h2 className="uppercase" style={{ fontSize: "1.5rem" }}>{service.title}</h2>
      <p className="mt-4 text-sm leading-relaxed">{service.description}</p>
      <div className="mt-16">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-blue transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
