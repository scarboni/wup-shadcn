// ─────────────────────────────────────────────────────────────
// GET /api/auth/verify-email?token=xxx
// Verify a user's email address via token
// Part of C12 resolution
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/register?error=missing-token", request.url));
  }

  try {
    // Look up the verification token
    const verificationRecord = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationRecord) {
      return NextResponse.redirect(new URL("/register?error=invalid-token", request.url));
    }

    // Check expiry
    if (new Date() > verificationRecord.expires) {
      // Clean up expired token
      await db.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(new URL("/register?error=token-expired", request.url));
    }

    // Only process email verification tokens (not password reset)
    if (verificationRecord.type !== "email") {
      return NextResponse.redirect(new URL("/register?error=invalid-token", request.url));
    }

    // Mark user's email as verified
    await db.user.update({
      where: { email: verificationRecord.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete the used token
    await db.verificationToken.delete({ where: { token } });

    // Redirect to registration page with success flag
    return NextResponse.redirect(new URL("/register?verified=true", request.url));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[verify-email]", error);
    }
    return NextResponse.redirect(new URL("/register?error=verification-failed", request.url));
  }
}
