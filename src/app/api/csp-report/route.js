// ─────────────────────────────────────────────────────────────
// POST /api/csp-report
// Receives Content-Security-Policy violation reports
// Production gap: M7
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

// Force dynamic — prevent static pre-rendering during build
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const report = await request.json();

    // In production, forward to Sentry or logging service
    if (process.env.SENTRY_DSN) {
      // TODO: Forward to Sentry via their CSP report endpoint
      // Sentry CSP reports: https://docs.sentry.io/product/security-policy-reporting/
    }

    // Log for monitoring (structured logging in production)
    if (process.env.NODE_ENV === "development") {
      console.warn("[CSP Violation]", JSON.stringify(report, null, 2));
    }

    // Always return 204 — reporting endpoints must not fail
    return new NextResponse(null, { status: 204 });
  } catch (_error) {
    return new NextResponse(null, { status: 204 });
  }
}
