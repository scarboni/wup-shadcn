// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { Suspense } from "react";
import Phase from "@/components/phases/supplier-deals";

// 🔧 PRODUCTION SEO — Replace static metadata with generateMetadata():
// import { db } from "@/lib/db";
// import { notFound } from "next/navigation";
//
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const supplier = await db.supplier.findUnique({ where: { slug: params.slug } });
//   if (!supplier) return {};
//   return {
//     title: `${supplier.name} — All Wholesale Deals`,
//     description: `Browse all wholesale deals from ${supplier.name}. ${supplier.categories.join(", ")}. Verified supplier with ${supplier.reviewCount} reviews.`,
//     alternates: { canonical: `/supplier-deals/${supplier.slug}` },
//     openGraph: {
//       title: `${supplier.name} — All Wholesale Deals`,
//       description: `Browse all deals from verified supplier ${supplier.name}`,
//       images: supplier.logo ? [{ url: supplier.logo, width: 600, height: 600 }] : [],
//     },
//   };
// }
// Also: move route from /supplier-deals to /suppliers/[slug]/deals (dynamic segment).

export const metadata = {
  title: "Supplier Deals — All Wholesale Deals from this Supplier",
  description: "Browse all wholesale deals from a verified supplier. Filter by category, price, country, and more.",
  alternates: { canonical: "/supplier-deals" },
  openGraph: {
    title: "Supplier Deals — All Wholesale Deals",
    description: "Browse all wholesale deals from a verified supplier.",
  },
};

export default function SupplierDealsRoute() {
  return <Suspense><Phase /></Suspense>;
}
