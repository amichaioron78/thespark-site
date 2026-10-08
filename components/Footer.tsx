import Link from "next/link";
import { SITE } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-blue text-white">
      <div className="px-[4.8%]">
        <div className="grid gap-8 border-b border-white/40 py-12 md:grid-cols-[minmax(0,2fr)_1fr_1fr_1fr]">
          <div>
            <h2 className="max-w-md text-white" style={{ fontSize: "1.5rem" }}>{SITE.footerCta}</h2>
            <Link href="/contact" className="btn mt-6 text-xs">Contact us</Link>
          </div>
          <ul className="space-y-3 text-sm">
            <li><Link href="/services" className="hover:text-green">Services</Link></li>
            <li><Link href="/works-categories/all" className="hover:text-green">Works</Link></li>
            <li><Link href="/about" className="hover:text-green">About</Link></li>
          </ul>
          <ul className="space-y-3 text-sm">
            <li><Link href="/spark-blog/main" className="hover:text-green">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-green">Contact</Link></li>
          </ul>
          <div>
            <div className="display text-xl font-bold text-white">{SITE.city}</div>
            <div className="mt-4 space-y-2 text-sm uppercase">
              <div>Tel: <a href={SITE.phoneHref} className="hover:text-green">{SITE.phone}</a></div>
              <div>E-mail: <a href={`mailto:${SITE.email}`} className="normal-case underline hover:text-green">{SITE.email}</a></div>
            </div>
            <div className="mt-4 flex gap-3">
              <a href={SITE.linkedin} target="_blank" rel="noopener" aria-label="SPARK on LinkedIn">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/643da94b8c136bd3ff8ae891_linkedin.svg" alt="" className="h-4 w-4" />
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="SPARK on Instagram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/643da959b6a7cf18db4790a3_instagram.svg" alt="" className="h-4 w-4" />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="SPARK on Facebook">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/643da9605b62581e71287a03_facebook.svg" alt="" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between py-8">
          <Link href="/" aria-label="SPARK home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/64735a014eeb1ff94a520100_spark_footer_logo.svg" alt="Spark logo" className="h-5 w-auto" />
          </Link>
          <div className="text-xs text-white/60">@{year} thespark.ai all rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
