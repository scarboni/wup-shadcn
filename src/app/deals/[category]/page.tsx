import { Suspense } from "react";
import Phase from "@/components/phases/deal-cards";
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
    title: `Wholesale ${cat.name} Deals`,
    description: `Browse verified wholesale and dropship ${cat.name.toLowerCase()} deals. Filter by subcategory, country, and price.`,
    alternates: { canonical: `/deals/${params.category}` },
    openGraph: {
      title: `Wholesale ${cat.name} Deals`,
      description: `Browse verified wholesale and dropship ${cat.name.toLowerCase()} deals. Filter by subcategory, country, and price.`,
    },
  };
}

export default function DealsCategoryPage({ params }: { params: { category: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} />
    </Suspense>
  );
}
