// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import Phase from "@/components/phases/supplier";

// 🔧 PRODUCTION SEO — Replace static metadata with generateMetadata():
// import { db } from "@/lib/db";
// import { notFound } from "next/navigation";
//
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const supplier = await db.supplier.findUnique({ where: { slug: params.slug } });
//   if (!supplier) return {};
//   return {
//     title: `${supplier.name} — Verified Wholesale Supplier`,
//     description: `${supplier.name} (${supplier.country}) — ${supplier.categories.join(", ")}. ${supplier.rating}★ from ${supplier.reviewCount} reviews.`,
//     alternates: { canonical: `/suppliers/${supplier.slug}` },
//     openGraph: {
//       title: `${supplier.name} — Verified Wholesale Supplier`,
//       description: `View deals, reviews, and contact info for ${supplier.name}`,
//       images: supplier.logo ? [{ url: supplier.logo, width: 600, height: 600 }] : [],
//     },
//   };
// }
// Also: move route from /supplier to /suppliers/[slug] (dynamic segment).
// See supplier.jsx for ProfilePage + AggregateRating JSON-LD template.
// See SEO skill Section 5 & 12.2 for full guidance.

export const metadata = {
  title: "Supplier Profile",
  description: "View verified supplier details, deals, and reviews.",
  alternates: { canonical: "/supplier" },
  openGraph: {
    title: "Verified Supplier Profile",
    description: "View verified supplier details, product listings, and reviews.",
  },
};

export default function SupplierProfilePage() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/supplier");
  return <Phase />;
}
