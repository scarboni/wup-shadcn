import { Suspense } from "react";
import Phase from "@/components/phases/deal-cards";
import { getCategoryById, getSubcategoryById, CATEGORY_TREE } from "@/lib/categories";
import { notFound } from "next/navigation";

/* Generate static params for all L1 + L2 combinations */
export function generateStaticParams() {
  return CATEGORY_TREE.flatMap((c) =>
    c.subs.map((s) => ({ category: c.id, subcategory: s.id }))
  );
}

/* Dynamic SEO metadata — handles both subcategory AND "dropshipping" in second segment */
export function generateMetadata({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) return {};

  // Check if second segment is "dropshipping" (e.g. /deals/clothing-fashion/dropshipping)
  if (params.subcategory === "dropshipping") {
    return {
      title: `${cat.name} Dropship Deals`,
      description: `Browse verified dropshipping ${cat.name.toLowerCase()} deals. No minimum orders, ship direct to customers.`,
      alternates: { canonical: `/deals/${params.category}/dropshipping` },
      openGraph: {
        title: `${cat.name} Dropship Deals`,
        description: `Browse verified dropshipping ${cat.name.toLowerCase()} deals. No minimum orders, ship direct to customers.`,
      },
    };
  }

  const result = getSubcategoryById(params.subcategory);
  if (!result || result.category.id !== params.category) return {};
  return {
    title: `Wholesale ${result.sub.label} Deals | ${cat.name}`,
    description: `Browse verified wholesale and dropship ${result.sub.label.toLowerCase()} deals in ${cat.name.toLowerCase()}. Filter by country and price.`,
    alternates: { canonical: `/deals/${params.category}/${params.subcategory}` },
    openGraph: {
      title: `Wholesale ${result.sub.label} Deals | ${cat.name}`,
      description: `Browse verified wholesale and dropship ${result.sub.label.toLowerCase()} deals in ${cat.name.toLowerCase()}.`,
    },
  };
}

export default function DealsSubcategoryPage({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) notFound();

  // Check if second segment is "dropshipping" (e.g. /deals/clothing-fashion/dropshipping)
  if (params.subcategory === "dropshipping") {
    return (
      <Suspense>
        <Phase routeCategory={params.category} routeDropshipping />
      </Suspense>
    );
  }

  const result = getSubcategoryById(params.subcategory);
  if (!result || result.category.id !== params.category) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} routeSubcategory={params.subcategory} />
    </Suspense>
  );
}
