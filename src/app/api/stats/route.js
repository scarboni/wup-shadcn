// GET /api/stats
// Resolves production gap: Retrieve platform statistics with caching

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const stats = await db.platformStat.findFirst();

    if (!stats) {
      return NextResponse.json(
        { error: "Stats not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      suppliers: stats.suppliers,
      deals: stats.deals,
      members: stats.members,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/stats] Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export const revalidate = 300;
