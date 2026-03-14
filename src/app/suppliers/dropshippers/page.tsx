import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";

export const metadata = {
  title: "Dropshipping Suppliers | Verified Dropshippers Directory",
  description: "Find 5,000+ verified dropshipping suppliers. No minimum orders, blind shipping, and UK/EU warehouses.",
  alternates: { canonical: "/suppliers/dropshippers" },
  openGraph: {
    title: "Dropshipping Suppliers | Verified Dropshippers Directory",
    description: "Find 5,000+ verified dropshipping suppliers. No minimum orders, blind shipping, and UK/EU warehouses.",
  },
};

export default function DropshippersPage() {
  return (
    <Suspense>
      <Phase routeSupplierType="dropshipper" />
    </Suspense>
  );
}
