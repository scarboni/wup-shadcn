import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";

export const metadata = {
  title: "Liquidation Stock Suppliers | Verified Liquidators",
  description: "Access 3,000+ verified liquidation and clearance suppliers. Customer returns, overstock, and end-of-line deals.",
  alternates: { canonical: "/suppliers/liquidators" },
  openGraph: {
    title: "Liquidation Stock Suppliers | Verified Liquidators",
    description: "Access 3,000+ verified liquidation and clearance suppliers. Customer returns, overstock, and end-of-line deals.",
  },
};

export default function LiquidatorsPage() {
  return (
    <Suspense>
      <Phase routeSupplierType="liquidator" />
    </Suspense>
  );
}
