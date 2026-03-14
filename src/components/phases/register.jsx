"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Breadcrumb from "@/components/shared/breadcrumb";
import DotWorldMap from "@/components/shared/dot-world-map";
import { useVisibilityInterval } from "@/components/shared/use-visibility-interval";
import useRecaptcha from "@/components/shared/use-recaptcha";
import useLastLogin from "@/components/shared/use-last-login";
import { WholesaleUpIcon, WholesaleUpLogo } from "@/components/shared/logo";
import { GoogleIcon, AppleIcon, FacebookIcon, FloatingField, UsernameField, EmailField, FloatingPasswordField, PasswordStrength, Toggle, Divider, SocialButton, ErrorSummary, SuccessPanel, VerificationSuccessPanel, ResetPasswordSuccessPanel, RecaptchaNotice, validateEmail, validatePassword, validateUsername } from "@/components/shared/auth-ui";
import { useUsernameCheck } from "@/components/shared/use-username-check";
import { useEmailCheck } from "@/components/shared/use-email-check";
import { useVerificationEmail } from "@/components/shared/use-verification-email";
import { useRateLimit } from "@/components/shared/use-rate-limit";
import { useBreachCheck } from "@/components/shared/use-breach-check";
import {
  CheckCircle2,
  Lightbulb,
  Mail,
  ArrowLeft,
  Loader2,
  Star,
  BadgeCheck,
  Users,
  TrendingUp,
  AlertTriangle,
  Lock,
  RefreshCw,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════
   CSRF PROTECTION:
   - NextAuth signIn() includes automatic CSRF protection
   - API routes (/api/auth/register, /api/auth/forgot-password)
     are protected by reCAPTCHA server verification
   - Contact form is protected by reCAPTCHA + rate limiting
   ═══════════════════════════════════════ */

/* ═══════════════════════════════════════
   SOCIAL AUTH ICONS
   ═══════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS DATA (curated subset)
   PRODUCTION (H2): Fetch from GET /api/testimonials?limit=12
   SEED: prisma/seed.ts → seedTestimonials()
   ═══════════════════════════════════════════════════════════ */
/* 12 curated testimonials (trimmed from 30 — only 1 shows at a time, 12 gives good variety) */
const TESTIMONIALS = [
  { text: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", author: "James Richardson", role: "Amazon FBA Seller", location: "United States" },
  { text: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", author: "Maria Gonzalez", role: "eBay Power Seller", location: "Spain" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan Ahmed", role: "Wholesale Reseller", location: "United Kingdom" },
  { text: "Upgraded to Premium last month and it's already paid for itself ten times over. The exclusive deals section is a goldmine.", author: "Patrick O'Brien", role: "Online Retailer", location: "Ireland" },
  { text: "I run three Amazon stores and WholesaleUp is my go-to source for all of them. The variety is unmatched.", author: "David Chen", role: "Multi-Store Owner", location: "Australia" },
  { text: "Switched from Alibaba six months ago. Better suppliers, faster shipping, and the customer support actually responds.", author: "Tom Eriksson", role: "Dropshipper", location: "Sweden" },
  { text: "My profit margins went from 15% to 40% after finding niche suppliers here that I couldn't find anywhere else.", author: "Priya Sharma", role: "Shopify Store Owner", location: "Canada" },
  { text: "The platform makes it incredibly easy to compare suppliers side by side. Saved me thousands in my first quarter.", author: "Klaus Weber", role: "E-commerce Manager", location: "Germany" },
  { text: "As a dropshipper, having access to suppliers who actually hold UK stock has transformed my delivery times. Customers love it.", author: "Rachel Okonkwo", role: "Dropship Entrepreneur", location: "United Kingdom" },
  { text: "The verified supplier badges give me confidence I'm dealing with legitimate businesses. No more wasted time on dodgy leads.", author: "Sophie Laurent", role: "Boutique Owner", location: "France" },
  { text: "Found my best FBA suppliers through WholesaleUp. Now my Amazon business generates £5K monthly profit.", author: "Edward Summers", role: "Amazon FBA Seller", location: "United Kingdom" },
  { text: "Registered for free, found my first supplier within minutes. Already made back 5x.", author: "Sarah Kennedy", role: "New Reseller", location: "United Kingdom" },
];

/* ═══════════════════════════════════════════════════════════
   STATS — PRODUCTION (H2): Fetch from GET /api/stats
   SEED: prisma/seed.ts → seedPlatformStats()
   ═══════════════════════════════════════════════════════════ */
const STATS = [
  { value: "42,900+", label: "Verified Suppliers", icon: BadgeCheck },
  { value: "901,900+", label: "Active Resellers", icon: Users },
  { value: "95%", label: "Below Retail Price", icon: TrendingUp },
];

/* ═══════════════════════════════════════
   TABS
   ═══════════════════════════════════════ */
const TABS = [
  { id: "login", label: "Log In" },
  { id: "register", label: "Register Free" },
];

function LoginTab({ onSwitchTab, showForgot, onShowForgot }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  // 🔧 PRODUCTION: "Remember Me" controls session maxAge via NextAuth JWT callback.
  // See auth-modal.jsx for full secure implementation notes.
  const [rememberMe, setRememberMe] = useState(false);
  const { getLastLogin, recordLogin } = useLastLogin();
  const [submitted, setSubmitted] = useState(false);
  const { executeRecaptcha } = useRecaptcha();
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const { resendVerification, status: verifyStatus, cooldown, sendCount } = useVerificationEmail();

  // Login attempt rate limiting (escalating: 30s → 60s → 120s → 240s → 300s cap)
  const loginLimit = useRateLimit({ maxAttempts: 5, baseLockout: 30, escalation: 2, maxLockout: 300, warnAfter: 3 });
  const { isLocked, countdown, failCount, attemptsLeft, showWarning, maxAttempts: MAX_ATTEMPTS, recordAttempt, recordSuccess } = loginLimit;

  // Forgot password rate limiting (3 requests per window, 60s lockout)
  const forgotLimit = useRateLimit({ maxAttempts: 3, baseLockout: 60, escalation: 1.5, maxLockout: 180, warnAfter: 2 });

  // Forgot sub-form state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const { resendVerification: resendResetEmail, status: resetEmailStatus, cooldown: resetCooldown, sendCount: resetSendCount, reset: resetResetEmail } = useVerificationEmail();

  const set = (field) => (e) => { setForm((f) => ({ ...f, [field]: e.target.value })); if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: "" })); };
  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = {};
    if (field === "identity" && !form.identity.trim()) errs.identity = "Username or email is required";
    if (field === "password" && !form.password) errs.password = "Password is required";
    setErrors((p) => ({ ...p, ...errs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    setSubmitted(true);
    const errs = {};
    if (!form.identity.trim()) errs.identity = "Username or email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) { document.getElementById(Object.keys(errs).find((k) => errs[k]))?.focus(); return; }
    setLoading(true);
    /* ── C9/C10: Real NextAuth credentials login ── */
    let recaptchaToken = null;
    try {
      recaptchaToken = await executeRecaptcha("login");
    } catch (_err) { /* reCAPTCHA unavailable — continue */ }
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identity: form.identity,
        password: form.password,
        remember: String(rememberMe),
      });
      setLoading(false);
      setUnverifiedEmail("");
      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          const email = form.identity.includes("@") ? form.identity : `${form.identity}@example.com`;
          setUnverifiedEmail(email);
        } else {
          recordAttempt();
          setErrors({ identity: "Invalid username/email or password" });
        }
        return;
      }
      recordSuccess();
      const prev = getLastLogin();
      recordLogin();
      if (prev) window.dispatchEvent(new CustomEvent("show-last-login", { detail: prev }));
      // C9: Session is now managed by NextAuth — no more demo-auth CustomEvent
      window.location.href = "/dashboard";
    } catch (_err) {
      setLoading(false);
      setErrors({ identity: "Something went wrong. Please try again." });
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (forgotLimit.isLocked) return;
    setForgotSubmitted(true);
    const err = validateEmail(forgotEmail);
    setForgotError(err);
    if (err) { document.getElementById("forgot-email")?.focus(); return; }
    setForgotLoading(true);
    /* ── H5: Real forgot password API call ── */
    let recaptchaToken = null;
    try {
      recaptchaToken = await executeRecaptcha("forgot_password");
    } catch (_err) { /* reCAPTCHA unavailable — continue */ }
    forgotLimit.recordAttempt();
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, recaptchaToken }),
      });
      /* SECURITY: always show success — never reveal account existence */
      setForgotLoading(false);
      setForgotSuccess(true);
    } catch (_err) {
      setForgotLoading(false);
      setForgotSuccess(true); // Still show success to prevent enumeration
    }
  };

  const backToLogin = () => {
    onShowForgot(false);
    setForgotEmail("");
    setForgotError("");
    setForgotTouched(false);
    setForgotSubmitted(false);
    setForgotSuccess(false);
    resetResetEmail();
  };

  /* ---- Forgot password sub-view ---- */
  if (showForgot) {
    if (forgotSuccess) {
      return (
        <ResetPasswordSuccessPanel
          email={forgotEmail}
          onResend={() => resendResetEmail(forgotEmail, "password-reset")}
          resendStatus={resetEmailStatus}
          cooldown={resetCooldown}
          sendCount={resetSendCount}
          onBackToLogin={backToLogin}
        />
      );
    }

    return (
      <form onSubmit={handleForgotSubmit} noValidate>
        <button type="button" onClick={backToLogin} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors mb-4">
          <ArrowLeft size={14} /> Back to login
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot your password?</h2>
        <p className="text-base text-slate-500 mb-6">
          Enter your registered email address and we&apos;ll send you a link to reset your password.
        </p>

        <FloatingField id="forgot-email" label="Email Address" type="email" required value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); if (forgotTouched || forgotSubmitted) setForgotError(""); }} onBlur={() => { setForgotTouched(true); setForgotError(validateEmail(forgotEmail)); }} error={(forgotTouched || forgotSubmitted) ? forgotError : ""} placeholder="you@company.com" autoFocus />

        {forgotLimit.isLocked && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
            <Lock size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Too many requests</p>
              <p className="mt-0.5">Please wait <span className="font-bold">{forgotLimit.countdown}s</span> before trying again.</p>
            </div>
          </div>
        )}
        <button type="submit" disabled={forgotLoading || forgotLimit.isLocked} className="w-full mt-6 py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
          {forgotLoading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : forgotLimit.isLocked ? <><Lock size={14} /> Locked ({forgotLimit.countdown}s)</> : "Send Reset Link"}
        </button>
        <RecaptchaNotice />
      </form>
    );
  }

  /* ---- Main login view ---- */
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Unverified email banner — top of form for visibility */}
      {unverifiedEmail && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
          <div className="flex items-start gap-3 p-4 text-sm text-amber-800">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900">Email not verified</p>
              <p className="mt-1 text-amber-700 leading-relaxed">Your account exists but your email hasn't been verified yet. Check your inbox for a verification link, or resend it below.</p>
            </div>
          </div>
          <div className="px-4 pb-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => resendVerification(unverifiedEmail, "login-resend")}
              disabled={cooldown > 0 || verifyStatus === "sending"}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                cooldown > 0 || verifyStatus === "sending"
                  ? "text-slate-400 border-slate-200 bg-white cursor-not-allowed"
                  : "text-orange-600 border-orange-200 bg-white hover:bg-orange-50"
              }`}
            >
              {verifyStatus === "sending" ? (
                <><Loader2 size={12} className="animate-spin" /> Sending…</>
              ) : cooldown > 0 ? (
                <><Clock size={12} /> Resend in {cooldown}s</>
              ) : (
                <><RefreshCw size={12} /> Resend verification email</>
              )}
            </button>
            {sendCount > 0 && verifyStatus === "sent" && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> Sent!
              </span>
            )}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
      <p className="text-base text-slate-500 mb-6">Log in to your WholesaleUp account to access deals and suppliers.</p>

      {/* Social login */}
      <div className="grid grid-cols-3 gap-2.5">
        <SocialButton icon={GoogleIcon} label="Google" onClick={() => signIn("google")} disabled={loading} hoverBg="hover:bg-blue-50" hoverBorder="hover:border-blue-300" hoverText="hover:text-blue-700" />
        <SocialButton icon={AppleIcon} label="Apple" onClick={() => signIn("apple")} disabled={loading} hoverBg="hover:bg-neutral-100" hoverBorder="hover:border-neutral-400" hoverText="hover:text-black" />
        <SocialButton icon={FacebookIcon} label="Facebook" onClick={() => signIn("facebook")} disabled={loading} hoverBg="hover:bg-blue-50" hoverBorder="hover:border-[#1877F2]" hoverText="hover:text-[#1877F2]" />
      </div>

      <Divider text="or continue with email" />

      {/* Tip */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-orange-50 border border-orange-200 mb-5">
        <Lightbulb size={16} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-sm text-orange-800 leading-relaxed">
          <span className="font-semibold">Tip:</span> You can log in quicker from anywhere on the site using the Log In link at the top of every page.
        </p>
      </div>

      {submitted && <ErrorSummary errors={errors} fieldLabels={{ identity: "Username or Email", password: "Password" }} />}

      <div className="space-y-4">
        <FloatingField id="identity" label="Username or Email Address" required value={form.identity} onChange={set("identity")} onBlur={blur("identity")} error={(touched.identity || submitted) ? errors.identity : ""} placeholder="Enter username or email..." autoFocus />

        <div>
          <div className="flex items-center justify-between mb-0">
            <span />
            <button type="button" onClick={() => onShowForgot(true)} className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-1.5">Forgot password?</button>
          </div>
          <FloatingPasswordField id="password" label="Password" required value={form.password} onChange={set("password")} onBlur={blur("password")} error={(touched.password || submitted) ? errors.password : ""} placeholder="Enter password..." autoComplete="current-password" />
        </div>

        <Toggle checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>Keep me signed in</Toggle>
      </div>

      {/* Lockout warning / locked banner */}
      {isLocked ? (
        <div role="alert" className="mt-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          <Lock size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Account temporarily locked</p>
            <p className="mt-0.5 text-red-600">Too many failed attempts. Try again in <span className="font-bold tabular-nums">{countdown}s</span>.</p>
          </div>
        </div>
      ) : showWarning ? (
        <div role="alert" className="mt-5 flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
          <p>{attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining before your account is temporarily locked.</p>
        </div>
      ) : null}


      <button type="submit" disabled={loading || isLocked} className="w-full mt-6 py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Logging in...</> : isLocked ? <><Lock size={14} /> Locked ({countdown}s)</> : "Log in"}
      </button>
      <RecaptchaNotice />

      <button type="button" onClick={() => onSwitchTab("register")} className="w-full mt-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 text-center">
        <span className="text-sm text-slate-500">Don&apos;t have an account?</span>{" "}
        <span className="text-sm font-semibold text-orange-600">Register free</span>
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════
   REGISTER TAB
   ═══════════════════════════════════════ */
function RegisterTab({ onSwitchTab }) {
  const [form, setForm] = useState({ username: "", firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [newsletter, setNewsletter] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const { executeRecaptcha } = useRecaptcha();
  const { status: usernameStatus, message: usernameMessage, checkUsername } = useUsernameCheck();
  const { status: emailStatus, message: emailMessage, checkEmail } = useEmailCheck();
  const { sendVerification, resendVerification, status: verifyStatus, cooldown, sendCount } = useVerificationEmail();
  const { status: breachStatus, breachCount, checkPassword: checkBreach } = useBreachCheck();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => { const val = e.target.value; setForm((f) => ({ ...f, [field]: val })); if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: "" })); if (field === "username") checkUsername(val); if (field === "email") checkEmail(val); if (field === "password") checkBreach(val); };

  const validateField = useCallback((field, val) => {
    switch (field) {
      case "username": return validateUsername(val);
      case "firstName": return !val.trim() ? "First name is required" : "";
      case "lastName": return !val.trim() ? "Last name is required" : "";
      case "email": return validateEmail(val);
      case "password": return validatePassword(val);
      case "confirmPassword": return !val ? "Please confirm your password" : val !== form.password ? "Passwords do not match" : "";
      default: return "";
    }
  }, [form.password]);

  const blur = (field) => () => { setTouched((t) => ({ ...t, [field]: true })); setErrors((p) => ({ ...p, [field]: validateField(field, form[field]) })); };

  const validateAll = () => {
    const errs = {};
    errs.username = validateUsername(form.username) || (usernameStatus === "taken" ? "Username is already taken" : usernameStatus === "checking" ? "Please wait — checking username" : "");
    errs.firstName = !form.firstName.trim() ? "First name is required" : "";
    errs.lastName = !form.lastName.trim() ? "Last name is required" : "";
    errs.email = validateEmail(form.email) || (emailStatus === "registered" ? "An account with this email already exists" : emailStatus === "checking" ? "Please wait — checking email" : "");
    errs.password = validatePassword(form.password) || (breachStatus === "breached" ? "This password was found in a data breach — please choose another" : breachStatus === "checking" ? "Please wait — checking password safety" : "");
    errs.confirmPassword = !form.confirmPassword ? "Please confirm your password" : form.confirmPassword !== form.password ? "Passwords do not match" : "";
    if (!agreeTerms) errs.terms = "You must agree to the terms";
    Object.keys(errs).forEach((k) => { if (!errs[k]) delete errs[k]; });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateAll();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { document.getElementById(Object.keys(errs).find((k) => errs[k]))?.focus(); return; }
    setLoading(true);
    /* ── C11: Real registration API call ── */
    let recaptchaToken = null;
    try {
      recaptchaToken = await executeRecaptcha("register");
    } catch (_err) { /* reCAPTCHA unavailable — continue */ }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          newsletter,
          agreeTerms,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
          const firstKey = Object.keys(data.errors).find((k) => data.errors[k]);
          if (firstKey) document.getElementById(firstKey)?.focus();
        } else {
          setErrors({ server: data.error || "Registration failed. Please try again." });
        }
        return;
      }
      setSuccess(true);
      // Verification email is sent by the server — no client-side simulation needed
    } catch (_err) {
      setLoading(false);
      setErrors({ server: "Something went wrong. Please try again." });
    }
  };

  const fieldLabels = { username: "Username", firstName: "First Name", lastName: "Last Name", email: "Email", password: "Password", confirmPassword: "Confirm Password", terms: "Terms" };

  if (success) {
    return <VerificationSuccessPanel email={form.email} onResend={() => resendVerification(form.email, "registration")} resendStatus={verifyStatus} cooldown={cooldown} sendCount={sendCount} onGoToLogin={() => { setSuccess(false); onSwitchTab("login"); }} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
      <p className="text-base text-slate-500 mb-6">Join 901,900+ resellers sourcing wholesale &amp; dropship deals with zero commissions.</p>

      {/* Social register */}
      <div className="grid grid-cols-3 gap-2.5">
        <SocialButton icon={GoogleIcon} label="Google" onClick={() => signIn("google")} disabled={loading} hoverBg="hover:bg-blue-50" hoverBorder="hover:border-blue-300" hoverText="hover:text-blue-700" />
        <SocialButton icon={AppleIcon} label="Apple" onClick={() => signIn("apple")} disabled={loading} hoverBg="hover:bg-neutral-100" hoverBorder="hover:border-neutral-400" hoverText="hover:text-black" />
        <SocialButton icon={FacebookIcon} label="Facebook" onClick={() => signIn("facebook")} disabled={loading} hoverBg="hover:bg-blue-50" hoverBorder="hover:border-[#1877F2]" hoverText="hover:text-[#1877F2]" />
      </div>

      <Divider text="or register with email" />

      {submitted && <ErrorSummary errors={errors} fieldLabels={fieldLabels} />}

      <div className="space-y-4">
        <UsernameField id="username" label="Username" required value={form.username} onChange={set("username")} onBlur={blur("username")} error={(touched.username || submitted) ? errors.username : ""} placeholder="Choose a username..." autoFocus availabilityStatus={usernameStatus} availabilityMessage={usernameMessage} />

        <div className="grid grid-cols-2 gap-3">
          <FloatingField id="firstName" label="First Name" required value={form.firstName} onChange={set("firstName")} onBlur={blur("firstName")} error={(touched.firstName || submitted) ? errors.firstName : ""} placeholder="First name..." />
          <FloatingField id="lastName" label="Last Name" required value={form.lastName} onChange={set("lastName")} onBlur={blur("lastName")} error={(touched.lastName || submitted) ? errors.lastName : ""} placeholder="Last name..." />
        </div>

        <EmailField id="email" label="Email" required value={form.email} onChange={set("email")} onBlur={blur("email")} error={(touched.email || submitted) ? errors.email : ""} placeholder="you@company.com" availabilityStatus={emailStatus} availabilityMessage={emailMessage} onSwitchToLogin={() => onSwitchTab("login")} privacyHint />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FloatingPasswordField id="password" label="Password" required value={form.password} onChange={set("password")} onBlur={blur("password")} error={(touched.password || submitted) ? errors.password : ""} placeholder="Min 8 characters..." />
            <PasswordStrength password={form.password} breachStatus={breachStatus} breachCount={breachCount} />
          </div>
          <FloatingPasswordField id="confirmPassword" label="Confirm Password" required value={form.confirmPassword} onChange={set("confirmPassword")} onBlur={blur("confirmPassword")} error={(touched.confirmPassword || submitted) ? errors.confirmPassword : ""} placeholder="Re-enter password..." />
        </div>

        <div className="space-y-2.5 pt-1">
          <Toggle checked={newsletter} onChange={() => setNewsletter(!newsletter)}>
            Send me weekly deals and supplier updates
          </Toggle>
          <Toggle id="terms" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} error={submitted && !agreeTerms}>
            I accept the{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">Privacy Policy</a>
            {" "}and{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">Terms of Service</a>
          </Toggle>
          {submitted && !agreeTerms && <p className="text-xs text-red-500 ml-9">You must agree to continue</p>}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 text-center mt-6 mb-3 flex items-center justify-center gap-1.5">
        <Users size={11} className="text-slate-500" />
        Join 900,000+ businesses already on WholesaleUp
      </p>
      <button type="submit" disabled={loading} className="w-full py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Creating Account...</> : "Create an Account"}
      </button>
      <RecaptchaNotice />

      <button type="button" onClick={() => onSwitchTab("login")} className="w-full mt-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 text-center">
        <span className="text-sm text-slate-500">Already have an account?</span>{" "}
        <span className="text-sm font-semibold text-orange-600">Log in</span>
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════
   LEFT COLUMN — Marketing & Testimonials
   ═══════════════════════════════════════ */
function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef(null);
  const total = TESTIMONIALS.length;

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handleChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // Auto-advance every 5s (pauses when tab hidden or reduced-motion preferred)
  const { reset: resetCarousel } = useVisibilityInterval(() => {
    setCurrent((c) => (c + 1) % total);
  }, reducedMotion ? null : 5000);

  const prev = () => { setCurrent((c) => (c - 1 + total) % total); resetCarousel(); };
  const next = () => { setCurrent((c) => (c + 1) % total); resetCarousel(); };

  // Touch/swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const t = TESTIMONIALS[current];

  return (
    <div
      className="relative group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Testimonial card */}
      <div className="bg-gradient-to-br from-white/12 to-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/15 overflow-hidden">
        <div className="flex gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-orange-400 fill-orange-400" />)}
        </div>
        <p key={current} className="text-white/90 text-base leading-relaxed mb-4 min-h-[60px]" style={{ animation: "regTestimonialSlide 0.4s ease" }}>
          &ldquo;{t.text}&rdquo;
        </p>
        <div>
          <p className="text-white font-semibold text-base">{t.author}</p>
          <p className="text-sky-100/60 text-sm">{t.role} &middot; {t.location}</p>
        </div>
      </div>

      {/* Navigation arrows — always visible */}
      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Previous testimonial">
        <ChevronLeft size={16} />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Next testimonial">
        <ChevronRight size={16} />
      </button>

      <style>{`
        @keyframes regTestimonialSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════
   HERO DASHBOARD ILLUSTRATION — SVG
   A simple dashboard/graph visual to
   reinforce the "data-driven" value prop.
   ═══════════════════════════════════════ */
function DashboardIllustration() {
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full rounded-xl">
      {/* Background card */}
      <rect width="320" height="180" rx="12" fill="white" fillOpacity="0.08" />
      <rect x="0.5" y="0.5" width="319" height="179" rx="11.5" stroke="white" strokeOpacity="0.1" />

      {/* Mini top bar */}
      <rect x="16" y="12" width="50" height="6" rx="3" fill="white" fillOpacity="0.2" />
      <circle cx="296" cy="15" r="5" fill="#f97316" fillOpacity="0.6" />
      <circle cx="280" cy="15" r="5" fill="white" fillOpacity="0.15" />

      {/* Revenue line chart area */}
      <path d="M30 130 L70 105 L110 115 L150 80 L190 90 L230 55 L270 40 L300 30" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 130 L70 105 L110 115 L150 80 L190 90 L230 55 L270 40 L300 30 L300 155 L30 155 Z" fill="url(#regChartGrad)" />
      <defs>
        <linearGradient id="regChartGrad" x1="160" y1="30" x2="160" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Data points */}
      {[[70,105],[150,80],[230,55],[300,30]].map(([cx,cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4" fill="white" stroke="#f97316" strokeWidth="2" />
        </g>
      ))}

      {/* Bar chart (small) bottom-left */}
      {[
        [30, 145, 12, 10, 0.3],
        [48, 135, 12, 20, 0.4],
        [66, 125, 12, 30, 0.6],
        [84, 118, 12, 37, 0.8],
      ].map(([x, y, w, h, op], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill="#f97316" fillOpacity={op} />
      ))}

      {/* Floating stat card top-right */}
      <rect x="210" y="58" width="95" height="44" rx="8" fill="white" fillOpacity="0.12" />
      <rect x="220" y="66" width="32" height="5" rx="2.5" fill="#f97316" fillOpacity="0.7" />
      <rect x="220" y="76" width="55" height="4" rx="2" fill="white" fillOpacity="0.3" />
      <rect x="220" y="85" width="40" height="4" rx="2" fill="white" fillOpacity="0.15" />

      {/* Grid lines */}
      {[70, 95, 120, 145].map((y) => (
        <line key={y} x1="30" y1={y} x2="300" y2={y} stroke="white" strokeOpacity="0.05" strokeDasharray="4 4" />
      ))}

      {/* Axis labels */}
      <text x="30" y="168" fill="white" fillOpacity="0.25" fontSize="7" fontFamily="system-ui">Jan</text>
      <text x="110" y="168" fill="white" fillOpacity="0.25" fontSize="7" fontFamily="system-ui">Apr</text>
      <text x="190" y="168" fill="white" fillOpacity="0.25" fontSize="7" fontFamily="system-ui">Jul</text>
      <text x="270" y="168" fill="white" fillOpacity="0.25" fontSize="7" fontFamily="system-ui">Oct</text>
    </svg>
  );
}

/* DotWorldMap imported from @/components/shared/dot-world-map */

function MarketingColumn() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a] rounded-2xl xl:rounded-l-none p-8 relative overflow-hidden">
      {/* Dot world map background with edge fade */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ mask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)", WebkitMask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)" }}>
          <DotWorldMap opacity={0.14} />
        </div>
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10">
        <WholesaleUpLogo />
      </div>

      {/* Value prop + illustration side by side */}
      <div className="relative z-10 mt-12 flex items-center gap-5">
        {/* Text — left */}
        <div className="shrink-0">
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Source wholesale<br />deals with the<br /><span className="text-orange-400">best margins</span>
          </h2>
          <p className="text-sky-100/60 text-base leading-relaxed max-w-[320px]">
            Join the Internet&apos;s largest marketplace of verified wholesale suppliers &amp; dropshippers. Access 42,900+ verified suppliers, exclusive deals, and powerful sourcing tools.
          </p>
        </div>
        {/* Illustration — right, fills space but won't shrink below 280px; panel overflow-hidden clips it */}
        <div className="flex-1 min-w-[280px] shrink-0">
          <DashboardIllustration />
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-3 gap-3 mt-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/15">
            <stat.icon size={18} className="text-orange-400 mb-2" />
            <p className="text-white font-bold text-lg">{stat.value}</p>
            <p className="text-sky-100/50 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials — pushed to bottom of column */}
      <div className="relative z-10 mt-auto pt-8">
        <TestimonialSlider />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function RegisterPhase() {
  const [activeTab, setActiveTab] = useState("register");
  const [showForgot, setShowForgot] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "forgot") { setActiveTab("login"); setShowForgot(true); }
    else if (["login", "register"].includes(hash)) { setActiveTab(hash); setShowForgot(false); }

    const handlePopState = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "forgot") { setActiveTab("login"); setShowForgot(true); }
      else { setShowForgot(false); setActiveTab(["login", "register"].includes(h) ? h : "register"); }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setShowForgot(false);
    window.history.pushState(null, "", `#${tab}`);
  }, []);

  const handleShowForgot = useCallback((show) => {
    setShowForgot(show);
    window.history.pushState(null, "", show ? "#forgot" : "#login");
  }, []);

  return (
    <div className="bg-white lg:bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb — matching /deals spacing */}
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: showForgot ? "Forgot Password" : activeTab === "login" ? "Log In" : "Register" },
        ]} />

        {/* Unified panel at desktop, stacked on mobile */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 pb-8">

          {/* Left: Form column */}
          <div>
            <div className="bg-white rounded-2xl xl:rounded-r-none border border-slate-200 xl:border-r-0 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 xl:h-full flex flex-col">
              {/* Tab headers */}
              <div role="tablist" aria-label="Account" className="flex border-b border-slate-200">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => switchTab(tab.id)}
                    className={`px-6 py-3.5 text-sm font-semibold transition-colors relative ${
                      activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-6 right-6 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div role="tabpanel" id={`tabpanel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="p-6 sm:p-8 flex-1">
                {activeTab === "login" && <LoginTab onSwitchTab={switchTab} showForgot={showForgot} onShowForgot={handleShowForgot} />}
                {activeTab === "register" && <RegisterTab onSwitchTab={switchTab} />}
              </div>
            </div>
          </div>

          {/* Right: Marketing column — below form on mobile, joined on desktop */}
          <div className="mt-6 xl:mt-0">
            <MarketingColumn />
          </div>
        </div>

      </div>
    </div>
  );
}
