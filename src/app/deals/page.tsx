import { Suspense } from "react";
import Phase from "@/components/phases/deal-cards";

export const metadata = {
  title: "Wholesale Deals",
  description: "Browse 20,000+ verified wholesale and dropship deals. Filter by category, country, and price.",
  alternates: { canonical: "/deals" },
  openGraph: {
    title: "Wholesale Deals",
    description: "Browse 20,000+ verified wholesale and dropship deals. Filter by category, country, and price.",
  },
};

export default function DealsPage() {
  return (
    <Suspense>
      <Phase />
    </Suspense>
  );
}
