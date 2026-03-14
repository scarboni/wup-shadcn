import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";

export const metadata = {
  title: "Wholesale Suppliers & Distributors | Verified Wholesalers",
  description: "Browse 18,000+ verified wholesalers and distributors. Bulk pricing, fast shipping, and trade-only access.",
  alternates: { canonical: "/suppliers/wholesalers" },
  openGraph: {
    title: "Wholesale Suppliers & Distributors | Verified Wholesalers",
    description: "Browse 18,000+ verified wholesalers and distributors. Bulk pricing, fast shipping, and trade-only access.",
  },
};

export default function WholesalersPage() {
  return (
    <Suspense>
      <Phase routeSupplierType="wholesaler" />
    </Suspense>
  );
}
