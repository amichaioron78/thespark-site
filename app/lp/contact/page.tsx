import type { Metadata } from "next";
import { getPage, SITE } from "@/lib/content";
import ContactForm, { type Field } from "@/components/ContactForm";

type LPC = { seo: { title: string }; title: string; fields: Field[] };

export function generateMetadata(): Metadata {
  const p = getPage<LPC>("lp-contact");
  return { title: p.seo.title, alternates: { canonical: "/lp/contact" }, robots: { index: false } };
}

export default function LpContactPage() {
  const p = getPage<LPC>("lp-contact");
  return (
    <section className="min-h-[80vh] bg-blue px-[4.8%] py-16 text-white">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <h1 className="text-white">{p.title || "Let’s work together"}</h1>
          <div className="mt-10 space-y-2 text-sm uppercase">
            <div><a href={SITE.phoneHref}>{SITE.phone}</a></div>
            <div><a href={`mailto:${SITE.email}`} className="normal-case underline">{SITE.email}</a></div>
          </div>
        </div>
        <ContactForm fields={p.fields} successMessage="Thank you! Your submission has been received. Our team member will be in touch with you soon." source="lp-contact" />
      </div>
    </section>
  );
}
