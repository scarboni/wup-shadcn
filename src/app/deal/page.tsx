// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import Phase from "@/components/phases/deal";

// 🔧 PRODUCTION SEO — Replace static metadata with generateMetadata():
// import { db } from "@/lib/db";
// import { notFound } from "next/navigation";
//
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const deal = await db.deal.findUnique({ where: { slug: params.slug } });
//   if (!deal) return {};
//   return {
//     title: deal.title,
//     description: `${deal.title} — wholesale ${deal.category} from ${deal.supplier.name}. ${deal.description?.slice(0, 120)}`,
//     alternates: { canonical: `/deals/${deal.slug}` },
//     openGraph: {
//       title: deal.title,
//       description: `Wholesale deal: ${deal.title} — buy from verified suppliers`,
//       images: deal.images?.[0] ? [{ url: deal.images[0], width: 1200, height: 630 }] : [],
//     },
//   };
// }
// Also: move route from /deal to /deals/[slug] (dynamic segment).
// See deal.jsx for Product JSON-LD schema template.
// See SEO skill Section 5 & 12.2 for full guidance.

export const metadata = {
  title: "Deal Details | WholesaleUp",
  description: "View wholesale deal details, pricing, and supplier information.",
  alternates: { canonical: "/deal" },
  openGraph: {
    title: "Wholesale Deal Details",
    description: "View wholesale deal pricing, supplier information, and profit margins.",
  },
};

export default function SingleDealPage() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/deal");
  return <Phase />;
}
