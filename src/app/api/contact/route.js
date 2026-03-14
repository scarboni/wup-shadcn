// ─────────────────────────────────────────────────────────────
// POST /api/contact
// Handle contact form submissions
// Production gaps resolved: C15 (real submission), H10 (server validation)
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import {
  sendContactConfirmation,
  sendContactNotification,
} from "@/lib/email";

// ── Server-side validation ──────────────────────────────────

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/;
const URL_RE = /^https?:\/\/.+/;

function sanitize(str, maxLen = 200) {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/<[^>]*>/g, "").slice(0, maxLen);
}

const VALID_QUERY_TYPES = [
  "support",
  "listing",
  "billing",
  "partnership",
  "feedback",
  "report",
  "other",
];

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit: 5 per IP per hour
  let rl = { success: true, limit: 5, remaining: 4, reset: Date.now() + 3600000 };
  try {
    rl = await contactLimiter.limit(ip);
  } catch (_rlErr) {
    // Rate limiter unavailable — allow request through in dev
    if (process.env.NODE_ENV !== "development") throw _rlErr;
  }
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: "Too many submissions. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  try {
    const body = await request.json();
    const {
      queryType,
      fullName,
      email,
      subject,
      message,
      companyName,
      phone,
      website,
      recaptchaToken,
    } = body;

    // ── Validate all fields server-side ───────────────────

    const errors = {};

    // Query type
    const cleanQueryType = sanitize(queryType, 50).toLowerCase();
    if (!VALID_QUERY_TYPES.includes(cleanQueryType)) {
      errors.queryType = "Please select a valid query type";
    }

    // Full name
    const cleanName = sanitize(fullName, 100);
    if (!cleanName || cleanName.length < 2) {
      errors.fullName = "Please enter your full name";
    }

    // Email
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      errors.email = "Please enter a valid email address";
    }

    // Message
    const cleanMessage = sanitize(message, 5000);
    if (!cleanMessage || cleanMessage.length < 10) {
      errors.message = "Please enter a message (at least 10 characters)";
    }

    // Optional fields
    const cleanSubject = sanitize(subject, 200);
    const cleanCompany = sanitize(companyName, 100);
    const cleanPhone = sanitize(phone, 30);
    const cleanWebsite = sanitize(website, 200);

    // Validate URL format if provided
    if (cleanWebsite && !URL_RE.test(cleanWebsite)) {
      errors.website = "Please enter a valid URL (starting with http:// or https://)";
    }

    // Disallow javascript: protocol in URLs
    if (cleanWebsite && cleanWebsite.toLowerCase().startsWith("javascript:")) {
      errors.website = "Invalid URL";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // ── Verify reCAPTCHA server-side ──────────────────────

    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const captchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }),
      });
      const captchaData = await captchaRes.json();
      if (!captchaData.success || captchaData.score < 0.5) {
        return NextResponse.json(
          { success: false, error: "reCAPTCHA verification failed" },
          { status: 400 }
        );
      }
    }

    // ── Store in database ─────────────────────────────────
    // 🔧 PRODUCTION: db.contactSubmission.create() stores the submission.
    // In dev without a database, we skip storage and return success.

    let submissionId = "dev-" + Date.now();
    try {
      const submission = await db.contactSubmission.create({
        data: {
          queryType: cleanQueryType,
          fullName: cleanName,
          email: cleanEmail,
          subject: cleanSubject || null,
          message: cleanMessage,
          companyName: cleanCompany || null,
          phone: cleanPhone || null,
          website: cleanWebsite || null,
        },
      });
      submissionId = submission.id;
    } catch (_dbErr) {
      // Database not connected — acceptable in development
      if (process.env.NODE_ENV === "development") {
        console.warn("[contact] Database unavailable — skipping storage");
      } else {
        throw _dbErr; // Re-throw in production
      }
    }

    // ── Send emails (non-blocking) ────────────────────────

    // Confirmation to user
    sendContactConfirmation({
      to: cleanEmail,
      firstName: cleanName.split(" ")[0],
      queryType: cleanQueryType,
    }).catch(() => {});

    // Notification to admin
    sendContactNotification({
      from: cleanEmail,
      fullName: cleanName,
      queryType: cleanQueryType,
      subject: cleanSubject,
      message: cleanMessage,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll get back to you within 1-2 business days.",
        id: submissionId,
      },
      { status: 201, headers: rateLimitHeaders(rl) }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[contact]", error);
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
