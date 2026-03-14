import { Suspense } from "react";
import Phase from "@/components/phases/suppliers";
import { getCategoryById, getSubcategoryById } from "@/lib/categories";
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

export function generateMetadata({ params }: { params: { category: string; subcategory: string; supplierType: string } }) {
  const cat = getCategoryById(params.category);
  const result = getSubcategoryById(params.subcategory);
  const typeId = SLUG_TO_TYPE[params.supplierType];
  if (!cat || !result || result.category.id !== params.category || !typeId) return {};
  const typeLabel = TYPE_LABELS[typeId] || params.supplierType;
  return {
    title: `${result.sub.label} ${typeLabel} | ${cat.name}`,
    description: `Connect with verified ${result.sub.label.toLowerCase()} ${typeLabel.toLowerCase()} in ${cat.name.toLowerCase()}.`,
    alternates: { canonical: `/suppliers/${params.category}/${params.subcategory}/${params.supplierType}` },
    openGraph: {
      title: `${result.sub.label} ${typeLabel} | ${cat.name}`,
      description: `Connect with verified ${result.sub.label.toLowerCase()} ${typeLabel.toLowerCase()} in ${cat.name.toLowerCase()}.`,
    },
  };
}

export default function SuppliersSubcategoryTypePage({ params }: { params: { category: string; subcategory: string; supplierType: string } }) {
  const cat = getCategoryById(params.category);
  const result = getSubcategoryById(params.subcategory);
  const typeId = SLUG_TO_TYPE[params.supplierType];
  if (!cat || !result || result.category.id !== params.category || !typeId) notFound();

  return (
    <Suspense>
      <Phase routeCategory={params.category} routeSubcategory={params.subcategory} routeSupplierType={typeId} />
    </Suspense>
  );
}
