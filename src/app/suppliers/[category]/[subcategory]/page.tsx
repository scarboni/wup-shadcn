import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";
import { getCategoryById, getSubcategoryById, CATEGORY_TREE } from "@/lib/categories";
import { notFound } from "next/navigation";

/* Known supplier type slugs (plural path segment → singular filter ID) */
const SLUG_TO_TYPE: Record<string, string> = {
  manufacturers: "manufacturer", "brand-owners": "brand-owner", "private-label": "private-label",
  wholesalers: "wholesaler", distributors: "distributor", importers: "importer", exporters: "exporter",
  "trading-companies": "trading-company", liquidators: "liquidator", dropshippers: "dropshipper",
  "sourcing-agents": "sourcing-agent", "artisan-makers": "artisan-maker",
};

const TYPE_LABELS: Record<string, string> = {
  manufacturer: "Manufacturers", "brand-owner": "Brand Owners", "private-label": "Private Label Suppliers",
  wholesaler: "Wholesalers", distributor: "Distributors", importer: "Importers", exporter: "Exporters",
  "trading-company": "Trading Companies", liquidator: "Liquidators", dropshipper: "Dropshippers",
  "sourcing-agent": "Sourcing Agents", "artisan-maker": "Artisan Makers",
};

/* Generate static params for all L1 + L2 combinations */
export function generateStaticParams() {
  return CATEGORY_TREE.flatMap((c) =>
    c.subs.map((s) => ({ category: c.id, subcategory: s.id }))
  );
}

/* Dynamic SEO metadata — handles both subcategory AND supplier type in second segment */
export function generateMetadata({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) return {};

  // Check if second segment is a supplier type slug (e.g. /suppliers/clothing-fashion/manufacturers)
  const typeId = SLUG_TO_TYPE[params.subcategory];
  if (typeId) {
    const typeLabel = TYPE_LABELS[typeId] || params.subcategory;
    return {
      title: `${cat.name} ${typeLabel}`,
      description: `Connect with verified ${cat.name.toLowerCase()} ${typeLabel.toLowerCase()} worldwide.`,
      alternates: { canonical: `/suppliers/${params.category}/${params.subcategory}` },
      openGraph: {
        title: `${cat.name} ${typeLabel}`,
        description: `Connect with verified ${cat.name.toLowerCase()} ${typeLabel.toLowerCase()} worldwide.`,
      },
    };
  }

  // Otherwise it's a subcategory
  const result = getSubcategoryById(params.subcategory);
  if (!result || result.category.id !== params.category) return {};
  return {
    title: `${result.sub.label} Wholesale Suppliers | ${cat.name}`,
    description: `Connect with verified wholesale and dropship ${result.sub.label.toLowerCase()} suppliers in ${cat.name.toLowerCase()}.`,
    alternates: { canonical: `/suppliers/${params.category}/${params.subcategory}` },
    openGraph: {
      title: `${result.sub.label} Wholesale Suppliers | ${cat.name}`,
      description: `Connect with verified wholesale and dropship ${result.sub.label.toLowerCase()} suppliers in ${cat.name.toLowerCase()}.`,
    },
  };
}

export default function SuppliersSubcategoryPage({ params }: { params: { category: string; subcategory: string } }) {
  const cat = getCategoryById(params.category);
  if (!cat) notFound();

  // Check if second segment is a supplier type slug (e.g. /suppliers/clothing-fashion/manufacturers)
  const typeId = SLUG_TO_TYPE[params.subcategory];
  if (typeId) {
    return (
      <Suspense>
        <Phase routeCategory={params.category} routeSupplierType={typeId} />
      </Suspense>
    );
  }

  // Otherwise treat as subcategory
  const result = getSubcategoryById(params.subcategory);
  if (!result || result.category.id !== params.category) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} routeSubcategory={params.subcategory} />
    </Suspense>
  );
}
