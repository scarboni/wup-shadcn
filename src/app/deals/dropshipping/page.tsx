import { Suspense } from "react";
import Phase from "@/components/phases/deal-cards";

export const metadata = {
  title: "Dropshipping Deals | Wholesale Dropship Products",
  description: "Browse verified dropshipping deals with no minimum orders. Ship direct to your customers from UK and EU warehouses.",
  alternates: { canonical: "/deals/dropshipping" },
  openGraph: {
    title: "Dropshipping Deals | Wholesale Dropship Products",
    description: "Browse verified dropshipping deals with no minimum orders. Ship direct to your customers from UK and EU warehouses.",
  },
};

export default function DropshippingDealsPage() {
  return (
    <Suspense>
      <Phase routeDropshipping />
    </Suspense>
  );
}
