// API route for toggling saved deal status
// POST: Save or unsave a deal

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dealId } = body;

    // Validate dealId
    if (!dealId || typeof dealId !== "string") {
      return NextResponse.json(
        { error: "Invalid dealId" },
        { status: 400 }
      );
    }

    const sanitizedDealId = String(dealId).trim();

    // Check if deal exists
    const deal = await db.deal.findUnique({
      where: { id: sanitizedDealId },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Check if deal is already saved
    const existingSavedDeal = await db.savedDeal.findUnique({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId: sanitizedDealId,
        },
      },
    });

    let saved = false;

    if (existingSavedDeal) {
      // Unsave the deal
      await db.savedDeal.delete({
        where: {
          userId_dealId: {
            userId: session.user.id,
            dealId: sanitizedDealId,
          },
        },
      });
      saved = false;
    } else {
      // Save the deal
      await db.savedDeal.create({
        data: {
          userId: session.user.id,
          dealId: sanitizedDealId,
        },
      });
      saved = true;
    }

    return NextResponse.json({ saved });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("POST /api/user/save-deal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
