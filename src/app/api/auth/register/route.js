// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// Create a new user account with email/password
// Production gaps resolved: C11
// ─────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerLimiter, getClientIp, rateLimitHeaders } from "@/lib/rate-limit";
import { randomBytes } from "crypto";

// ── Validation helpers (mirror client-side rules) ───────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;
const RESERVED_USERNAMES = new Set([
  "admin", "administrator", "root", "test", "user", "demo", "support",
  "info", "contact", "help", "moderator", "webmaster", "staff", "api",
  "auth", "login", "register", "signup", "signin", "null", "undefined",
  "wholesaleup", "system", "bot", "noreply",
]);

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
  return errors;
}

function sanitize(str, maxLen = 100) {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/<[^>]*>/g, "").slice(0, maxLen);
}

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit: 3 registrations per IP per hour
  const rl = await registerLimiter.limit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  try {
    const body = await request.json();
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      newsletter = false,
      agreeTerms = false,
      recaptchaToken,
    } = body;

    // ── Validate all fields server-side ───────────────────

    const errors = {};

    // Username
    const cleanUsername = sanitize(username, 30).toLowerCase();
    if (!cleanUsername || !USERNAME_RE.test(cleanUsername)) {
      errors.username = "Username must be 3-30 characters (letters, numbers, underscores)";
    } else if (RESERVED_USERNAMES.has(cleanUsername)) {
      errors.username = "This username is reserved";
    }

    // Names
    const cleanFirstName = sanitize(firstName);
    const cleanLastName = sanitize(lastName);
    if (!cleanFirstName) errors.firstName = "First name is required";
    if (!cleanLastName) errors.lastName = "Last name is required";

    // Email
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !EMAIL_RE.test(cleanEmail)) {
      errors.email = "Please enter a valid email address";
    }

    // Password
    const pwErrors = validatePassword(password || "");
    if (pwErrors.length > 0) {
      errors.password = `Password must have: ${pwErrors.join(", ")}`;
    }

    // Terms
    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the terms and conditions";
    }

    // Return early if validation fails
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
          { success: false, error: "reCAPTCHA verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // ── Check uniqueness ──────────────────────────────────

    const [existingEmail, existingUsername] = await Promise.all([
      db.user.findUnique({ where: { email: cleanEmail } }),
      cleanUsername ? db.user.findUnique({ where: { username: cleanUsername } }) : null,
    ]);

    if (existingEmail) {
      errors.email = "An account with this email already exists";
    }
    if (existingUsername) {
      errors.username = "This username is already taken";
    }
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 409 });
    }

    // ── Hash password ─────────────────────────────────────

    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create user ───────────────────────────────────────

    const user = await db.user.create({
      data: {
        username: cleanUsername,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        name: `${cleanFirstName} ${cleanLastName}`,
        email: cleanEmail,
        password: hashedPassword,
        newsletter,
        agreeTerms,
      },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    // ── Generate email verification token ─────────────────

    const verificationToken = randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: {
        identifier: cleanEmail,
        token: verificationToken,
        type: "email",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // ── Queue verification email ──────────────────────────
    // Delegated to the email service (see /api/auth/send-verification)

    try {
      const { sendVerificationEmail } = await import("@/lib/email");
      await sendVerificationEmail({
        to: cleanEmail,
        token: verificationToken,
        firstName: cleanFirstName,
      });
    } catch (_emailErr) {
      // Non-blocking: user can request resend from the UI
      if (process.env.NODE_ENV === "development") {
        console.error("[register] Email send failed:", _emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created. Please check your email to verify your account.",
        user: { id: user.id, email: user.email, username: user.username },
      },
      { status: 201, headers: rateLimitHeaders(rl) }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[register]", error);
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
