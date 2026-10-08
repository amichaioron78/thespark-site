import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Many assets are SVG logos; allow them through next/image.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      // Old Webflow collection-template paths that never had real content
      { source: "/works-pagelist", destination: "/works-categories/all", permanent: true },
      { source: "/works-pagelist/:slug", destination: "/works/:slug", permanent: true },
      { source: "/works", destination: "/works-categories/all", permanent: true },
      { source: "/blog", destination: "/spark-blog/main", permanent: true },
      { source: "/spark-blog", destination: "/spark-blog/main", permanent: true },
      { source: "/works-categories", destination: "/works-categories/all", permanent: true },
    ];
  },
};

export default nextConfig;
