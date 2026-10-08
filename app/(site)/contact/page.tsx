import type { Metadata } from "next";
import { getPage, SITE } from "@/lib/content";
import ContactForm, { type Field } from "@/components/ContactForm";

type Contact = { seo: { title: string }; title: string; subtitle: string; fields: Field[]; submitLabel: string };

export function generateMetadata(): Metadata {
  const c = getPage<Contact>("contact");
  return { title: c.seo.title, alternates: { canonical: "/contact" } };
}

function Socials() {
  return (
    <div className="flex gap-3">
      <a href={SITE.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/643da94b8c136bd3ff8ae891_linkedin.svg" alt="" className="h-4 w-4" /></a>
      <a href={SITE.instagram} target="_blank" rel="noopener" aria-label="Instagram">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/643da959b6a7cf18db4790a3_instagram.svg" alt="" className="h-4 w-4" /></a>
      <a href={SITE.facebook} target="_blank" rel="noopener" aria-label="Facebook">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/643da9605b62581e71287a03_facebook.svg" alt="" className="h-4 w-4" /></a>
    </div>
  );
}

export default function ContactPage() {
  const c = getPage<Contact>("contact");
  return (
    <section className="-mt-[72px] min-h-screen bg-blue px-[4.8%] pb-16 pt-[120px] text-white md:-mt-[80px] md:pt-[150px]">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <h1 className="text-white">{c.title}</h1>
          <p className="mt-4 text-lg">{c.subtitle}</p>
          <div className="mt-10 space-y-2 text-sm uppercase">
            <div><a href={SITE.phoneHref}>{SITE.phone}</a></div>
            <div><a href={`mailto:${SITE.email}`} className="normal-case underline">{SITE.email}</a></div>
          </div>
          <div className="mt-6"><Socials /></div>
        </div>
        <div>
          <ContactForm fields={c.fields} submitLabel={c.submitLabel} successMessage="Thank you! Your submission has been received. Our team member will be in touch with you soon." source="contact" />
        </div>
      </div>
    </section>
  );
}
