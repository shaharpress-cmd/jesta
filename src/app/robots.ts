import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jesta-pink.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/nearby", "/טיפים", "/create"],
      disallow: ["/login", "/chat", "/messages", "/api/", "/auth/", "/profile"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
