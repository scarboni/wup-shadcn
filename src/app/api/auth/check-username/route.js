// ─────────────────────────────────────────────────────────────
// GET /api/auth/check-username?u=xxx
// Check if a username is available
// Production gaps resolved: C14, H8 (rate limited), L7 (reserved list)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const RESERVED_USERNAMES = new Set([
  "admin", "administrator", "root", "test", "user", "demo", "support",
  "info", "contact", "help", "moderator", "webmaster", "staff", "api",
  "auth", "login", "register", "signup", "signin", "null", "undefined",
  "wholesaleup", "system", "bot", "noreply",
]);

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
  const username = (searchParams.get("u") || "").trim().toLowerCase();

  if (!username || !USERNAME_RE.test(username)) {
    return NextResponse.json(
      { available: false, error: "Invalid username format" },
      { status: 400, headers: rateLimitHeaders(rl) }
    );
  }

  // L7: Server-side reserved username check
  if (RESERVED_USERNAMES.has(username)) {
    return NextResponse.json(
      { available: false, reason: "reserved" },
      { headers: rateLimitHeaders(rl) }
    );
  }

  // Database lookup
  const existing = await db.user.findUnique({
    where: { username },
    select: { id: true },
  });

  return NextResponse.json(
    { available: !existing },
    { headers: rateLimitHeaders(rl) }
  );
}
