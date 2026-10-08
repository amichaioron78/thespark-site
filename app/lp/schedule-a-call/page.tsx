import type { Metadata } from "next";
import { getPage } from "@/lib/content";

type S = { seo: { title: string }; title: string; calendly: string | null };

export function generateMetadata(): Metadata {
  const p = getPage<S>("lp-schedule-a-call");
  return { title: p.seo.title, alternates: { canonical: "/lp/schedule-a-call" }, robots: { index: false } };
}

export default function SchedulePage() {
  const p = getPage<S>("lp-schedule-a-call");
  return (
    <section className="section-medium min-h-[80vh]">
      <h2>{p.title}</h2>
      {p.calendly ? (
        <iframe src={p.calendly} title="Schedule a call" className="mt-6 h-[760px] w-full rounded-lg border-0" loading="lazy" />
      ) : (
        <p className="mt-4">Email us at <a href="mailto:info@thespark.ai" className="underline">info@thespark.ai</a> to schedule a call.</p>
      )}
    </section>
  );
}
