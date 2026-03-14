import Phase from "@/components/phases/pricing";

export const metadata = {
  title: "Pricing Plans",
  description: "Choose your WholesaleUp plan. Free to browse, premium for full access to 42,900+ suppliers and 20,000+ deals.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing Plans",
    description: "Choose your WholesaleUp plan. Free to browse, premium for full access to 42,900+ verified suppliers.",
  },
};

export default function PricingPage() {
  return <Phase />;
}
