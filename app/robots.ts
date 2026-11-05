import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://koaclothing.shop"
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/auth/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
