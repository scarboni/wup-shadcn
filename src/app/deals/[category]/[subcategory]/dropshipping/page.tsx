import { Suspense } from "react";
import Phase from "@/components/phases/deal-cards";
import { getCategoryById, getSubcategoryById } from "@/lib/categories";
import { notFound } from "next/navigation";

export function generateMetadata({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  const result = getSubcategoryById(params.subcategory);
  if (!cat || !result || result.category.id !== params.category) return {};
  return {
    title: `${result.sub.label} Dropship Deals | ${cat.name}`,
    description: `Browse verified dropshipping ${result.sub.label.toLowerCase()} deals in ${cat.name.toLowerCase()}. No minimum orders, ship direct to customers.`,
    alternates: { canonical: `/deals/${params.category}/${params.subcategory}/dropshipping` },
    openGraph: {
      title: `${result.sub.label} Dropship Deals | ${cat.name}`,
      description: `Browse verified dropshipping ${result.sub.label.toLowerCase()} deals in ${cat.name.toLowerCase()}.`,
    },
  };
}

export default function DealsSubcategoryDropshippingPage({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  const result = getSubcategoryById(params.subcategory);
  if (!cat || !result || result.category.id !== params.category) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} routeSubcategory={params.subcategory} routeDropshipping />
    </Suspense>
  );
}
