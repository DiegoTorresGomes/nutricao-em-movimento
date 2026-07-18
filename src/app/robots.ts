import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://nutricaoemovimento.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/admin/auth/API areas out of the index. These pages
        // have no SEO value and should never surface in search results.
        disallow: ["/administracao", "/administracao/", "/login", "/api/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
