import type { MetadataRoute } from "next";
import { getBlogCategories, getPostSlugs, getServiceSlugs, getWorkCategories, getWorkSlugs, SITE } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), priority: 1 },
    { url: u("/about") }, { url: u("/services") }, { url: u("/contact") },
    { url: u("/ux-ui-design-agency-israel") }, { url: u("/lp/start-selling") },
    ...getServiceSlugs().map((s) => ({ url: u(`/services/${s}`) })),
    ...getWorkSlugs().map((s) => ({ url: u(`/works/${s}`) })),
    ...getWorkCategories().map((c) => ({ url: u(`/works-categories/${c.slug}`) })),
    ...getBlogCategories().map((c) => ({ url: u(`/spark-blog/${c.slug}`) })),
    ...getPostSlugs().map((s) => ({ url: u(`/blog/${s}`) })),
  ];
}
