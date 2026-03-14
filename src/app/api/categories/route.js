// GET /api/categories
// Resolves production gap: Retrieve all categories with deal and supplier counts
// Falls back to canonical CATEGORY_TREE when database is unavailable

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CATEGORY_TREE } from "@/lib/categories";

export async function GET(request) {
  try {
    const categories = await db.category.findMany();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const [dealCount, supplierCount] = await Promise.all([
          db.deal.count({ where: { category: category.name } }),
          db.supplier.count({ where: { category: category.name } }),
        ]);

        return {
          ...category,
          dealCount,
          supplierCount,
        };
      })
    );

    return NextResponse.json({
      categories: categoriesWithCounts,
    });
  } catch (error) {
    // Database not connected yet — return canonical tree as fallback
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/categories] DB unavailable, returning static tree:", error?.message);
    }

    const fallback = CATEGORY_TREE.map((cat) => ({
      id: cat.id,
      name: cat.name,
      href: cat.href,
      subcategories: cat.subs.map((s) => ({ id: s.id, label: s.label })),
      dealCount: 0,
      supplierCount: 0,
    }));

    return NextResponse.json({ categories: fallback });
  }
}
