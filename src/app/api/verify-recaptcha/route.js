// ─────────────────────────────────────────────────────────────
// POST /api/verify-recaptcha
// Server-side reCAPTCHA v3 token verification
// Production gap: C2
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const MIN_SCORE = 0.5;

export async function POST(request) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    if (!RECAPTCHA_SECRET) {
      // Fail open in development only
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({ success: true, score: 1.0 });
      }
      return NextResponse.json(
        { success: false, error: "reCAPTCHA not configured" },
        { status: 500 }
      );
    }

    // Verify token with Google
    const params = new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: token,
    });

    const verifyRes = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await verifyRes.json();

    // Validate response
    if (!data.success) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed", codes: data["error-codes"] },
        { status: 400 }
      );
    }

    // Check action matches (prevents token reuse across forms)
    if (action && data.action !== action) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA action mismatch" },
        { status: 400 }
      );
    }

    // Check score threshold
    if (data.score < MIN_SCORE) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA score too low", score: data.score },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      score: data.score,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[verify-recaptcha]", error);
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
