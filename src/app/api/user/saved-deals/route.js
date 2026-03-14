// API route for fetching user's saved deals
// GET: Fetch all saved deals for the authenticated user

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedDeals = await db.savedDeal.findMany({
      where: { userId: session.user.id },
      include: {
        deal: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            discount: true,
            category: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { savedAt: "desc" },
    });

    const deals = savedDeals.map((savedDeal) => ({
      ...savedDeal.deal,
      savedAt: savedDeal.savedAt,
    }));

    return NextResponse.json({ deals });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("GET /api/user/saved-deals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
