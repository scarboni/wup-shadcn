// API route for user profile management
// GET: Fetch user profile
// PUT: Update user profile

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        company: true,
        website: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("GET /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, company, website } = body;

    // Sanitize input
    const sanitizedData = {};
    if (firstName !== undefined) {
      sanitizedData.firstName = String(firstName).trim().substring(0, 255);
    }
    if (lastName !== undefined) {
      sanitizedData.lastName = String(lastName).trim().substring(0, 255);
    }
    if (phone !== undefined) {
      sanitizedData.phone = String(phone).trim().substring(0, 20);
    }
    if (company !== undefined) {
      sanitizedData.company = String(company).trim().substring(0, 255);
    }
    if (website !== undefined) {
      sanitizedData.website = String(website).trim().substring(0, 500);
    }

    const user = await db.user.update({
      where: { id: session.user.id },
      data: sanitizedData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("PUT /api/user/profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
