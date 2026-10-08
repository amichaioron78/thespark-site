/** Renders CMS/case-study HTML exported from Webflow (already sanitised at export time). */
export default function RichText({ html, className = "", dir }: { html: string; className?: string; dir?: "rtl" | "ltr" }) {
  if (!html) return null;
  return <div className={`rich ${className}`} dir={dir} dangerouslySetInnerHTML={{ __html: html }} />;
}
