import Phase from "@/components/phases/testimonials";

export const metadata = {
  title: "Customer Reviews",
  description: "See what 900,000+ resellers say about WholesaleUp.",
  alternates: { canonical: "/testimonials" },
  openGraph: {
    title: "Customer Reviews",
    description: "Real reviews from 900,000+ resellers using WholesaleUp to source profitable wholesale deals.",
  },
};

export default function TestimonialsPage() {
  return <Phase />;
}
