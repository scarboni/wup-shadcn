import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";

export const metadata = {
  title: "Verified Suppliers",
  description: "Connect with 42,900+ verified wholesale and dropship suppliers worldwide.",
  alternates: { canonical: "/suppliers" },
  openGraph: {
    title: "Verified Suppliers",
    description: "Connect with 42,900+ verified wholesale and dropship suppliers from the EU, UK, and North America.",
  },
};

export default function SuppliersPage() {
  return (
    <Suspense>
      <Phase />
    </Suspense>
  );
}
