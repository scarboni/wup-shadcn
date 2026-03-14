// GET /api/suppliers
// Resolves production gap: Paginated suppliers listing with filtering and search

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 10);
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const rating = searchParams.get("rating");
    const search = searchParams.get("search");

    const where = {};

    if (category) {
      where.category = category;
    }

    if (country) {
      where.country = country;
    }

    if (rating) {
      const parsedRating = parseFloat(rating);
      if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
        where.rating = { gte: parsedRating };
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [suppliers, total] = await Promise.all([
      db.supplier.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { rating: "desc" },
      }),
      db.supplier.count({ where }),
    ]);

    return NextResponse.json({
      suppliers,
      total,
      page,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/suppliers] Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}
