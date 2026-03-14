// GET /api/deals
// Resolves production gap: Paginated deals listing with filtering, sorting, and search

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 10);
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const VALID_SORT_FIELDS = ["createdAt", "price", "title", "discount"];
    const rawSort = searchParams.get("sort") || "createdAt";
    const sort = VALID_SORT_FIELDS.includes(rawSort) ? rawSort : "createdAt";
    const search = searchParams.get("search");

    const where = {};

    if (category) {
      where.category = category;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [deals, total] = await Promise.all([
      db.deal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: "desc" },
      }),
      db.deal.count({ where }),
    ]);

    return NextResponse.json({
      deals,
      total,
      page,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/deals] Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}
