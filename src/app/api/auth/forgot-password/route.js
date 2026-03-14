// ─────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Generate a password reset token and send reset email
// Production gap resolved: H5
// ALWAYS returns success to prevent email enumeration
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { randomBytes } from "crypto";

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit per IP
  const rl = await resetLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent." },
      { status: 200, headers: rateLimitHeaders(rl) }
    );
  }

  try {
    const { email } = await request.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    // ALWAYS return success (never reveal if account exists)
    const successResponse = NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent." },
      { headers: rateLimitHeaders(rl) }
    );

    if (!cleanEmail) return successResponse;

    // Also rate limit per email
    const emailRl = await resetLimiter.limit(`email:${cleanEmail}`);
    if (!emailRl.success) return successResponse;

    // Look up user
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, firstName: true, email: true },
    });

    if (!user) return successResponse;

    // Delete any existing reset tokens for this email
    await db.verificationToken.deleteMany({
      where: {
        identifier: cleanEmail,
        type: "password-reset",
      },
    });

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: {
        identifier: cleanEmail,
        token,
        type: "password-reset",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send email
    try {
      const { sendPasswordResetEmail } = await import("@/lib/email");
      await sendPasswordResetEmail({
        to: cleanEmail,
        token,
        firstName: user.firstName || "there",
      });
    } catch (_emailErr) {
      if (process.env.NODE_ENV === "development") {
        console.error("[forgot-password] Email send failed:", _emailErr);
      }
    }

    return successResponse;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[forgot-password]", error);
    }
    // Still return success to prevent enumeration via error responses
    return NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  }
}
