// GET /api/pricing
// Resolves production gap: Retrieve pricing plans

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const plans = await db.pricingPlan.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json({
      plans,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/pricing] Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch pricing plans" },
      { status: 500 }
    );
  }
}
