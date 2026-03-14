// ─────────────────────────────────────────────────────────────
// GET /api/auth/check-email?email=xxx
// Check if an email address is already registered
// Production gaps resolved: C13, H8 (rate limited)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request) {
  const ip = getClientIp(request);

  // H8: Rate limit to prevent enumeration
  const rl = await checkLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { available: false, error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") || "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { available: false, error: "Invalid email format" },
      { status: 400, headers: rateLimitHeaders(rl) }
    );
  }

  // Database lookup
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return NextResponse.json(
    { available: !existing },
    { headers: rateLimitHeaders(rl) }
  );
}
