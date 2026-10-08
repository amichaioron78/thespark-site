import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getWorks } from "@/lib/content";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const featuredWork = getWorks().find((w) => w.featuredMenu && w.menuImage) ?? null;
  const featured = featuredWork
    ? { slug: featuredWork.slug, name: featuredWork.name, category: featuredWork.category, image: featuredWork.menuImage! }
    : null;
  return (
    <>
      <Nav featured={featured} />
      <main className="min-h-screen pt-[72px] md:pt-[80px]">{children}</main>
      <Footer />
    </>
  );
}
