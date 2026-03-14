// GET /api/suppliers/[id]
// Resolves production gap: Retrieve single supplier with deals, reviews, and categories

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const supplier = await db.supplier.findUnique({
      where: { id },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    const [deals, reviews] = await Promise.all([
      db.deal.findMany({
        where: { supplierId: id },
      }),
      db.review.findMany({
        where: { supplierId: id },
      }),
    ]);

    return NextResponse.json({
      supplier,
      deals,
      reviews,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[GET /api/suppliers/[id]] Error:`, error);
    }
    return NextResponse.json(
      { error: "Failed to fetch supplier" },
      { status: 500 }
    );
  }
}
