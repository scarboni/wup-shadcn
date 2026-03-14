// GET /api/testimonials
// Resolves production gap: Retrieve paginated testimonials

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 10);

    const [testimonials, total] = await Promise.all([
      db.testimonial.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      db.testimonial.count(),
    ]);

    return NextResponse.json({
      testimonials,
      total,
      page,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/testimonials] Error:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
