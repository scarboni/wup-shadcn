import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";

export const metadata = {
  title: "Wholesale Manufacturers | Verified UK & Global Manufacturers",
  description: "Connect with 12,000+ verified wholesale manufacturers worldwide. Source direct from factories and brand owners.",
  alternates: { canonical: "/suppliers/manufacturers" },
  openGraph: {
    title: "Wholesale Manufacturers | Verified UK & Global Manufacturers",
    description: "Connect with 12,000+ verified wholesale manufacturers worldwide. Source direct from factories and brand owners.",
  },
};

export default function ManufacturersPage() {
  return (
    <Suspense>
      <Phase routeSupplierType="manufacturer" />
    </Suspense>
  );
}
