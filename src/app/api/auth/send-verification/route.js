// ─────────────────────────────────────────────────────────────
// POST /api/auth/send-verification
// Resend a verification email (registration or login-resend)
// Part of C12 resolution
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { randomBytes } from "crypto";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function POST(request) {
  const ip = getClientIp(request);

  try {
    const { email, type = "registration" } = await request.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Rate limit per email
    const rl = await verifyLimiter.limit(`verify:${cleanEmail}`);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429, headers: rateLimitHeaders(rl) }
      );
    }

    // Also rate limit per IP
    const ipRl = await verifyLimiter.limit(`verify-ip:${ip}`);
    if (!ipRl.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Look up user
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, firstName: true, emailVerified: true },
    });

    // Always return success to prevent enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Already verified?
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified. You can sign in.",
      });
    }

    // Delete any existing tokens for this email
    await db.verificationToken.deleteMany({
      where: {
        identifier: cleanEmail,
        type: "email",
      },
    });

    // Generate new token
    const token = randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: {
        identifier: cleanEmail,
        token,
        type: "email",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send email
    try {
      const { sendVerificationEmail } = await import("@/lib/email");
      await sendVerificationEmail({
        to: cleanEmail,
        token,
        firstName: user.firstName || "there",
      });
    } catch (_emailErr) {
      if (process.env.NODE_ENV === "development") {
        console.error("[send-verification] Email failed:", _emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[send-verification]", error);
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
