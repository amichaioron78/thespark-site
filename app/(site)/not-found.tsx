import Link from "next/link";
import { getPage } from "@/lib/content";

export default function NotFound() {
  const p = getPage<{ title: string; subtitle: string; text: string; linkLabel: string }>("not-found");
  return (
    <section className="section flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-[5rem] leading-none md:text-[8rem]">{p.title}</h1>
      <h2 className="mt-2">{p.subtitle}</h2>
      <p className="mt-4 max-w-md">{p.text}</p>
      <Link href="/" className="btn mt-8">{p.linkLabel}</Link>
    </section>
  );
}
