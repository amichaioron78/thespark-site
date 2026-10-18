import Link from "next/link";
import type { ServiceCard as T } from "@/lib/content";

/**
 * .services_service_card from the Webflow build: light blue tint, 50px padding, uppercase Playfair title;
 * on hover the whole card turns blue with white text, the title gets a white underline and the arrow
 * becomes a green circle rotated 45°.
 */
export default function ServiceCard({ service, as: Heading = "h2" }: { service: T; as?: "h2" | "h3" }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block bg-[#363ff20d] p-6 text-blue transition-colors duration-200 hover:bg-blue hover:text-white sm:p-10 lg:p-[50px]">
      <div className="inline-block">
        <Heading className="display text-[1.4em] font-bold uppercase leading-[1.64] tracking-[0.03em] text-blue transition-colors duration-200 group-hover:text-white md:text-[1.75em]">{service.title}</Heading>
        <span className="block h-[2px] w-0 bg-white transition-all duration-200 group-hover:w-full" />
      </div>
      <div className="h-4" />
      <p className="text-[1.125em]">{service.description}</p>
      <div className="mt-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/64414929b2ae44173dbed704_arrow-top-right-blue.svg" alt="" width={48} height={48} className="h-12 w-12 rounded-full transition-all duration-200 group-hover:rotate-45 group-hover:bg-green" />
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
