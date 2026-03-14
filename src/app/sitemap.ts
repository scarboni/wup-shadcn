// ─────────────────────────────────────────────────────────────
// Sitemap Generator — /sitemap.xml
// Production gap resolved: L1
// Generates a sitemap for all public pages + dynamic content
// 🔧 PRODUCTION SEO — When database is live:
//   1. Uncomment the dynamic page queries below (deals + suppliers)
//   2. Add category pages: /categories/[slug] from db.category.findMany()
//   3. For large sites (>50k URLs), split into sitemap index:
//      export async function generateSitemaps() { return [{ id: 0 }, { id: 1 }]; }
//   4. Register in robots.ts: Sitemap: https://wholesaleup.com/sitemap.xml
//   See SEO skill Section 9 & 12.2 for full guidance.
// ─────────────────────────────────────────────────────────────

import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://wholesaleup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/deals`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/suppliers`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic pages — uncomment when database is connected
  // const { db } = await import("@/lib/db");
  //
  // const deals = await db.deal.findMany({
  //   where: { active: true },
  //   select: { slug: true, updatedAt: true },
  // });
  //
  // const dealPages = deals.map((deal) => ({
  //   url: `${BASE_URL}/deals/${deal.slug}`,
  //   lastModified: deal.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));
  //
  // const suppliers = await db.supplier.findMany({
  //   select: { slug: true, updatedAt: true },
  // });
  //
  // const supplierPages = suppliers.map((s) => ({
  //   url: `${BASE_URL}/suppliers/${s.slug}`,
  //   lastModified: s.updatedAt,
  //   changeFrequency: "weekly" as const,
  //   priority: 0.7,
  // }));
  //
  // return [...staticPages, ...dealPages, ...supplierPages];

  return staticPages;
}
