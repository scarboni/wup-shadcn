import Phase from "@/components/phases/categories";

export const metadata = {
  title: "Product Categories",
  description: "Explore wholesale product categories from electronics to fashion.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Product Categories",
    description: "Explore wholesale product categories from electronics to fashion, health and beauty to homeware.",
  },
};

export default function CategoriesPage() {
  return <Phase />;
}
