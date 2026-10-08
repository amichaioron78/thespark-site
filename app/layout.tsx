import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Product Design & UX/UI Agency for SaaS, AI & Mobile | SPARK", template: "%s" },
  description:
    "SPARK is a Tel Aviv product design partner for complex SaaS, AI and mobile products. We turn ambiguity into validated, buildable and usable products through strategy, UX/UI, prototyping and design systems.",
  openGraph: { siteName: "SPARK", type: "website", images: ["/images/64459115e83daf2327465f12_spark.png"] },
  icons: { icon: "/images/644698dbb8358f1b99c136bb_x32.png", apple: "/images/64469934d6c414e99c1fac78_spark_256.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
