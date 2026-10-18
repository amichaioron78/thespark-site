import fs from "node:fs";
import path from "node:path";

/**
 * All site content lives in /content as JSON (exported from the former
 * Webflow site). These loaders are used by server components only.
 */
const ROOT = path.join(process.cwd(), "content");

function readJSON<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")) as T;
}
function listSlugs(dir: string): string[] {
  return fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export type Seo = { title: string; description?: string | null; ogImage?: string | null };

export type WorkListItem = {
  slug: string;
  name: string;
  url: string | null;
  category: string;
  categories: string[];
  featuredMenu: boolean;
  featuredHome: boolean;
  thumb: string;
  menuImage: string | null;
};
export type WorkCategory = { slug: string; name: string; singular: string; order: number; seoDescription?: string };
export type Client = { slug: string; name: string; order: number; logo: string };
export type Testimonial = { slug: string; name: string; role: string; image: string; quote: string };
export type TeamMember = { slug: string; name: string; role: string; order: number; image: string };
export type BlogCategory = { slug: string; name: string; order: number };

export type ImageBlock = { type: "image"; src: string; alt: string; variant: "full" | "web" | "mobile" | "small" | "smaller"; rounded: boolean; fit?: string; bg?: string };
export type TextBlock = { type: "text"; html: string; noPadding?: boolean; centered?: boolean; white?: boolean };
export type SplitBlock = { type: "split"; html: string; images: Block[]; imageFirst: boolean; wide: boolean };
export type FrameBlock = { type: "frame"; bg: string; bgImage: string | null; noPaddingTop: boolean; children: Block[] };
export type GalleryBlock = { type: "gallery"; columns: number; children: Block[] };
export type VideoBlock = { type: "video"; src: string; poster?: string | null };
export type WistiaBlock = { type: "wistia"; id: string | null };
export type EmbedBlock = { type: "embed"; src: string };
export type Block = ImageBlock | TextBlock | SplitBlock | FrameBlock | GalleryBlock | VideoBlock | WistiaBlock | EmbedBlock;

export type Work = {
  slug: string;
  seo: Seo;
  hero: {
    bgImage?: string | null; bgAlt?: string; logo?: string | null; logoAlt?: string;
    color?: string | null; heroBg?: string | null; pageBg?: string | null;
    meta: { label: string; value: string }[]; title: string; introHtml: string;
  };
  blocks: Block[];
};

export type ServiceSection = { heading: string; html: string; image: string | null; imageAlt: string; imageFirst: boolean };
export type Service = { slug: string; seo: Seo; title: string; subtitle: string; introHtml: string; sections: ServiceSection[]; related: string[] };
export type ServiceCard = { slug: string; title: string; description: string };

export type BlogPost = { slug: string; seo: Seo; title: string; image: string | null; category: string; rtl: boolean; bodyHtml: string; order: number };

export const getWorks = () => readJSON<WorkListItem[]>("works.json");
export const getWorkCategories = () => readJSON<WorkCategory[]>("work-categories.json").sort((a, b) => a.order - b.order);
export const getClients = () => readJSON<Client[]>("clients.json").sort((a, b) => a.order - b.order);
export const getTestimonials = () => readJSON<Testimonial[]>("testimonials.json");
export const getTeam = () => readJSON<TeamMember[]>("team.json").sort((a, b) => a.order - b.order);
export const getBlogCategories = () => readJSON<BlogCategory[]>("blog-categories.json").sort((a, b) => a.order - b.order);

export const getWorkSlugs = () => listSlugs("works");
export const getWork = (slug: string): Work | null =>
  fs.existsSync(path.join(ROOT, "works", `${slug}.json`)) ? readJSON<Work>(`works/${slug}.json`) : null;

export const getServiceSlugs = () => listSlugs("services");
export const getService = (slug: string): Service | null =>
  fs.existsSync(path.join(ROOT, "services", `${slug}.json`)) ? readJSON<Service>(`services/${slug}.json`) : null;
export const getServicesIndex = () => readJSON<{ seo: Seo; title: string; services: ServiceCard[] }>("pages/services-index.json");

export const getPostSlugs = () => listSlugs("blog");
export const getPost = (slug: string): BlogPost | null =>
  fs.existsSync(path.join(ROOT, "blog", `${slug}.json`)) ? readJSON<BlogPost>(`blog/${slug}.json`) : null;
export const getPosts = () => getPostSlugs().map((s) => getPost(s)!).sort((a, b) => a.order - b.order);

export const getPage = <T,>(name: string) => readJSON<T>(`pages/${name}.json`);

/** Works in the order they appear on the original site's Works grid. */
export const WORKS_GRID_ORDER = [
  "evrideo", "aeye", "marketman", "deepkeep", "pomicell", "bariks", "brain-buzz", "suridata", "identimedical", "healtop",
  "hermes", "qsee-carbon", "insfocus", "uturn", "virdix", "breeze", "sonol", "innovesta", "trinity-audio", "nym",
];
export function getWorksOrdered(): WorkListItem[] {
  const all = getWorks();
  const byslug = new Map(all.map((w) => [w.slug, w]));
  const ordered = WORKS_GRID_ORDER.map((s) => byslug.get(s)).filter(Boolean) as WorkListItem[];
  for (const w of all) if (!WORKS_GRID_ORDER.includes(w.slug)) ordered.push(w);
  return ordered;
}

/** Order of the Webflow /works-categories/all listing (collection list sort), captured 2026-10-08. */
export const WORKS_ALL_ORDER = [
  "suridata", "virdix", "marketman", "brain-buzz", "healtop", "hermes", "deepkeep", "innovesta", "aeye", "evrideo",
  "sonol", "nym", "qsee-carbon", "uturn", "identimedical", "insfocus", "breeze", "trinity-audio", "pomicell", "bariks",
];
export function getWorksAllOrdered(): WorkListItem[] {
  const all = getWorks();
  const byslug = new Map(all.map((w) => [w.slug, w]));
  const ordered = WORKS_ALL_ORDER.map((s) => byslug.get(s)).filter(Boolean) as WorkListItem[];
  for (const w of all) if (!WORKS_ALL_ORDER.includes(w.slug)) ordered.push(w);
  return ordered;
}

export const SITE = {
  name: "SPARK",
  url: "https://www.thespark.ai",
  phone: "+972 54777 5609",
  phoneHref: "tel:+972547775609",
  email: "info@thespark.ai",
  city: "Tel Aviv",
  linkedin: "https://www.linkedin.com/company/sparkdesignagency/",
  instagram: "https://www.instagram.com/thespark.ai/",
  facebook: "https://www.facebook.com/TheSparkDesign",
  footerCta: "Empower your business with our strategic design methodology",
};
