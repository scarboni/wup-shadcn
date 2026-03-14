// GET /api/deals/[id]
// Resolves production gap: Retrieve single deal with supplier and related deals

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const deal = await db.deal.findUnique({
      where: { id },
      include: {
        supplier: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    const relatedDeals = await db.deal.findMany({
      where: {
        category: deal.category,
        id: { not: id },
      },
      take: 5,
    });

    return NextResponse.json({
      deal,
      supplier: deal.supplier,
      relatedDeals,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[GET /api/deals/[id]] Error:`, error);
    }
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}
