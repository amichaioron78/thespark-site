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
    <div className="flex">
      {[
        [SITE.linkedin, "643da94b8c136bd3ff8ae891_linkedin.svg", "LinkedIn"],
        [SITE.instagram, "643da959b6a7cf18db4790a3_instagram.svg", "Instagram"],
        [SITE.facebook, "643da9605b62581e71287a03_facebook.svg", "Facebook"],
      ].map(([href, img, label]) => (
        <a key={label} href={href} target="_blank" rel="noopener" aria-label={`SPARK on ${label}`} className="py-[5px] pr-[10px] transition-transform duration-200 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/${img}`} alt="" className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

/** Contact — Webflow layout: blue page, min-100vh section, 2 columns (56px gap); left column = title + subtitle on top
 *  and the Tel Aviv contact box pushed to the bottom (`.conact_us_box_desktop` margin-top auto); right column = form. */
export default function ContactPage() {
  const c = getPage<Contact>("contact");
  return (
    <section className="-mt-[72px] flex min-h-screen flex-col bg-blue px-[4.8%] pb-[60px] pt-[120px] text-white md:-mt-[80px] md:pt-[180px]">
      <div className="mx-auto grid w-full max-w-[780px] gap-4 md:grid-cols-2 md:gap-14">
        <div className="flex flex-col">
          <div>
            <h1 className="mb-3 text-[1.75em] text-white lg:text-[2.25em]">{c.title}</h1>
            <p>{c.subtitle}</p>
          </div>
          <div className="mt-10 hidden md:mt-auto md:block">
            <div className="display mb-5 text-[1.5em] font-bold tracking-[0.01em] text-white">{SITE.city}</div>
            <div className="mb-3 uppercase">Tel: <a href={SITE.phoneHref} className="hover:text-green">{SITE.phone}</a></div>
            <div className="mb-3 uppercase">E-mail: <a href={`mailto:${SITE.email}`} className="normal-case underline hover:text-green">{SITE.email}</a></div>
            <Socials />
          </div>
        </div>
        <div className="mb-0">
          <ContactForm fields={c.fields} submitLabel={c.submitLabel} successMessage="Thank you! Your submission has been received. Our team member will be in touch with you soon." source="contact" />
          <div className="mt-6 md:hidden">
            <div className="mb-3 text-sm uppercase">Tel: <a href={SITE.phoneHref}>{SITE.phone}</a></div>
            <div className="mb-3 text-sm uppercase">E-mail: <a href={`mailto:${SITE.email}`} className="normal-case underline">{SITE.email}</a></div>
            <Socials />
          </div>
        </div>
      </div>
    </section>
  );
}
