import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";
import { getCategoryById, CATEGORY_TREE } from "@/lib/categories";
import { notFound } from "next/navigation";

/* Generate static params for all L1 categories */
export function generateStaticParams() {
  return CATEGORY_TREE.map((c) => ({ category: c.id }));
}

/* Dynamic SEO metadata per category */
export function generateMetadata({ params }: { params: { category: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} Wholesale Suppliers`,
    description: `Connect with verified wholesale and dropship ${cat.name.toLowerCase()} suppliers worldwide.`,
    alternates: { canonical: `/suppliers/${params.category}` },
    openGraph: {
      title: `${cat.name} Wholesale Suppliers`,
      description: `Connect with verified wholesale and dropship ${cat.name.toLowerCase()} suppliers worldwide.`,
    },
  };
}

export default function SuppliersCategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} />
    </Suspense>
  );
}
