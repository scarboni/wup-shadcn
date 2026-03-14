import Phase from "@/components/phases/homepage";

export const metadata = {
  title: "WholesaleUp — Verified Wholesale & Dropship Deals",
  description: "Join 900,000+ resellers sourcing verified wholesale and dropship deals from 42,900+ suppliers with zero commissions.",
  alternates: { canonical: "/homepage" },
  openGraph: {
    title: "WholesaleUp — Verified Wholesale & Dropship Deals",
    description: "Join 900,000+ resellers sourcing verified wholesale and dropship deals from 42,900+ suppliers. Zero commissions.",
  },
};

export default function HomepagePage() {
  return <Phase />;
}
