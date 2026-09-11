import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jesta.example";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/nearby"],
      disallow: ["/login", "/chat", "/messages", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
