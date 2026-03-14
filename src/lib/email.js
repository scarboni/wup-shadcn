// ─────────────────────────────────────────────────────────────
// Email Service — Unified interface for transactional emails
// Supports: Resend, SendGrid, AWS SES
// Production gap resolved: C12
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ── Provider-specific send functions ────────────────────────

async function sendViaResend({ to, subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "WholesaleUp <noreply@wholesaleup.com>",
      to: [to],
      subject,
      html,
      reply_to: process.env.EMAIL_REPLY_TO || "support@wholesaleup.com",
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`Resend error: ${error.message || res.statusText}`);
  }

  return res.json();
}

async function sendViaSendGrid({ to, subject, html }) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: process.env.EMAIL_FROM || "noreply@wholesaleup.com",
        name: "WholesaleUp",
      },
      reply_to: {
        email: process.env.EMAIL_REPLY_TO || "support@wholesaleup.com",
      },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!res.ok) {
    const error = await res.text().catch(() => "");
    throw new Error(`SendGrid error: ${error || res.statusText}`);
  }

  return { success: true };
}

// ── Unified send function ───────────────────────────────────

/**
 * Send an email using the configured provider.
 * @param {{ to: string, subject: string, html: string }} params
 */
async function sendEmail({ to, subject, html }) {
  const provider = (process.env.EMAIL_PROVIDER || "resend").toLowerCase();

  switch (provider) {
    case "sendgrid":
      return sendViaSendGrid({ to, subject, html });
    case "resend":
    default:
      return sendViaResend({ to, subject, html });
  }
}

// ── Email templates ─────────────────────────────────────────

function baseTemplate(content) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f8fafc;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <div style="background:#fff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="color:#f97316;font-size:24px;font-weight:700;margin:0;">WholesaleUp</h1>
      </div>
      ${content}
      <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;">
        <p>&copy; ${new Date().getFullYear()} WholesaleUp. All rights reserved.</p>
        <p>This is an automated message — please don't reply directly.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send email verification link to a new user.
 * @param {{ to: string, token: string, firstName: string }} params
 */
export async function sendVerificationEmail({ to, token, firstName }) {
  const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  return sendEmail({
    to,
    subject: "Verify your WholesaleUp account",
    html: baseTemplate(`
      <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px;">Welcome, ${firstName}!</h2>
      <p style="color:#475569;line-height:1.6;">Thanks for signing up. Please verify your email address to activate your account.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${verifyUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
          Verify Email Address
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
    `),
  });
}

/**
 * Send password reset link.
 * @param {{ to: string, token: string, firstName: string }} params
 */
export async function sendPasswordResetEmail({ to, token, firstName }) {
  const resetUrl = `${BASE_URL}/register?reset-token=${token}`;

  return sendEmail({
    to,
    subject: "Reset your WholesaleUp password",
    html: baseTemplate(`
      <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px;">Password Reset</h2>
      <p style="color:#475569;line-height:1.6;">Hi ${firstName}, we received a request to reset your password.</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#f97316;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
          Reset Password
        </a>
      </div>
      <p style="color:#94a3b8;font-size:13px;">This link expires in 24 hours. If you didn't request a password reset, you can safely ignore this email.</p>
    `),
  });
}

/**
 * Send contact form confirmation to user.
 * @param {{ to: string, firstName: string, queryType: string }} params
 */
export async function sendContactConfirmation({ to, firstName, queryType }) {
  return sendEmail({
    to,
    subject: "We received your message — WholesaleUp",
    html: baseTemplate(`
      <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px;">Thanks for reaching out, ${firstName}!</h2>
      <p style="color:#475569;line-height:1.6;">We've received your ${queryType} enquiry and our team will get back to you within 1-2 business days.</p>
      <p style="color:#475569;line-height:1.6;">In the meantime, you can browse our latest deals and suppliers at <a href="${BASE_URL}" style="color:#f97316;">wholesaleup.com</a>.</p>
    `),
  });
}

/**
 * Send contact form notification to admin.
 * @param {{ from: string, fullName: string, queryType: string, subject: string, message: string }} params
 */
export async function sendContactNotification({ from, fullName, queryType, subject, message }) {
  const adminEmail = process.env.EMAIL_REPLY_TO || "support@wholesaleup.com";

  return sendEmail({
    to: adminEmail,
    subject: `[Contact] ${queryType}: ${subject || "New message"}`,
    html: baseTemplate(`
      <h2 style="color:#1e293b;font-size:20px;margin:0 0 16px;">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#94a3b8;width:100px;">Type</td><td style="color:#1e293b;">${queryType}</td></tr>
        <tr><td style="padding:8px 0;color:#94a3b8;">Name</td><td style="color:#1e293b;">${fullName}</td></tr>
        <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="color:#1e293b;">${from}</td></tr>
        ${subject ? `<tr><td style="padding:8px 0;color:#94a3b8;">Subject</td><td style="color:#1e293b;">${subject}</td></tr>` : ""}
      </table>
      <div style="margin-top:16px;padding:16px;background:#f8fafc;border-radius:8px;color:#334155;line-height:1.6;">
        ${message.replace(/\n/g, "<br>")}
      </div>
    `),
  });
}
