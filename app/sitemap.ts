import type { MetadataRoute } from "next";
import { API_ROUTES } from "@/lib/configs/api-routes";
import { shopHrefs } from "@/lib/configs/page-routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://koaclothing.shop"
  ).replace(/\/$/, "");

  const currentDate = new Date();

  // 1. Static storefront routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products/search`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic routes fetched from the API (with timeout and error safety)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  let productRoutes: MetadataRoute.Sitemap = [];
  let collectionRoutes: MetadataRoute.Sitemap = [];

  if (apiUrl) {
    try {
      // Fetch active products
      const productsPromise = fetch(
        `${apiUrl}${API_ROUTES.CATALOGUE.PRODUCTS}?pageIndex=1&pageSize=100`,
        {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(5000),
        }
      )
        .then(async (res) => {
          if (!res.ok) return [];
          const json = await res.json();
          const items: Array<{ id: string; updatedAt?: string }> =
            json?.items || [];
          return items.map((product) => ({
            url: `${siteUrl}${shopHrefs.product(product.id)}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
            changeFrequency: "daily" as const,
            priority: 0.8,
          }));
        })
        .catch(() => [] as MetadataRoute.Sitemap);

      // Fetch active collections
      const collectionsPromise = fetch(
        `${apiUrl}${API_ROUTES.CATALOGUE.COLLECTIONS}`,
        {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(5000),
        }
      )
        .then(async (res) => {
          if (!res.ok) return [];
          const items: Array<{ id: string; updatedAt?: string }> =
            await res.json();
          if (!Array.isArray(items)) return [];
          return items.map((collection) => ({
            url: `${siteUrl}${shopHrefs.collection(collection.id)}`,
            lastModified: collection.updatedAt ? new Date(collection.updatedAt) : currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }));
        })
        .catch(() => [] as MetadataRoute.Sitemap);

      const [resolvedProducts, resolvedCollections] = await Promise.all([
        productsPromise,
        collectionsPromise,
      ]);

      productRoutes = resolvedProducts;
      collectionRoutes = resolvedCollections;
    } catch {
      // Fall back cleanly to static routes if API is not reachable during sitemap generation
    }
  }

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
