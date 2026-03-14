"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
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
  X,
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

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS & STATS DATA
   PRODUCTION (H2): Fetch from GET /api/testimonials + GET /api/stats
   SEED: prisma/seed.ts → seedTestimonials(), seedPlatformStats()
   ═══════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  { text: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", author: "James Richardson", role: "Amazon FBA Seller", location: "United States" },
  { text: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", author: "Maria Gonzalez", role: "eBay Power Seller", location: "Spain" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan Ahmed", role: "Wholesale Reseller", location: "United Kingdom" },
  { text: "The verified supplier badges give me confidence. I've never had a quality issue with any supplier sourced through this platform.", author: "Sophie Laurent", role: "Boutique Owner", location: "France" },
  { text: "I switched from Alibaba to WholesaleUp and cut my sourcing time in half. The deals are curated and the support team is fantastic.", author: "David Chen", role: "Dropshipper", location: "Canada" },
  { text: "What sets WholesaleUp apart is the transparency. Real margins, real reviews, real suppliers. No guesswork involved.", author: "Priya Sharma", role: "E-commerce Manager", location: "India" },
  { text: "Found a niche electronics supplier here that nobody else had. My store's bestseller came from a WholesaleUp deal.", author: "Luca Bianchi", role: "Shopify Seller", location: "Italy" },
  { text: "As a reseller, margins are everything. WholesaleUp consistently delivers deals 30-40% below what I find elsewhere.", author: "Emma Johansson", role: "Online Reseller", location: "Sweden" },
];

const STATS = [
  { value: "42,900+", label: "Verified Suppliers", icon: BadgeCheck },
  { value: "901,900+", label: "Active Resellers", icon: Users },
  { value: "95%", label: "Below Retail Price", icon: TrendingUp },
];

/* Shared components imported from @/components/shared/auth-ui and dot-world-map */

/* ═══════════════════════════════════════
   MARKETING COLUMN (lg+ only)
   ═══════════════════════════════════════ */
function MarketingColumn() {
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

  // Touch/swipe handlers
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const t = TESTIMONIALS[current];

  return (
    <div className="hidden lg:flex lg:w-[42%] shrink-0 flex-col bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a] rounded-r-2xl p-8 justify-between relative overflow-hidden">
      {/* Dot world map background — full area with edge fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0" style={{ mask: "radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, transparent 90%)", WebkitMask: "radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, transparent 90%)" }}>
          <DotWorldMap />
        </div>
      </div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />

      <div className="relative z-10">
        <WholesaleUpLogo as="div" href={undefined} dark={false} />
      </div>
      <div className="mt-8 flex-1 relative z-10">
        <p className="text-2xl font-extrabold text-white mb-1">Source wholesale deals with the <span className="text-orange-400">best margins</span></p>
        <p className="text-sky-200 text-sm mb-8">Join 901,900+ resellers already saving</p>

        <div className="space-y-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                  <p className="text-sky-200 text-xs">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rotating Testimonial — arrows + swipe, no dots */}
      <div
        className="relative z-10 mt-6 group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-gradient-to-br from-white/12 to-white/[0.04] backdrop-blur-sm rounded-2xl p-4 border border-white/15 overflow-hidden">
          <div className="flex gap-0.5 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-orange-400 fill-orange-400" />)}
          </div>
          <p key={current} className="text-white/90 text-sm leading-relaxed mb-3 min-h-[48px]" style={{ animation: "authTestimonialSlide 0.4s ease" }}>
            &ldquo;{t.text}&rdquo;
          </p>
          <div>
            <p className="text-white font-semibold text-sm">{t.author}</p>
            <p className="text-sky-200/60 text-xs">{t.role} &middot; {t.location}</p>
          </div>
        </div>

        {/* Navigation arrows — always visible */}
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Previous testimonial">
          <ChevronLeft size={14} />
        </button>
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Next testimonial">
          <ChevronRight size={14} />
        </button>

        <style>{`
          @keyframes authTestimonialSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPACT TRUST BAR (md only)
   ═══════════════════════════════════════ */
function CompactTrustBar() {
  return (
    <div className="hidden md:block lg:hidden border-t border-slate-200 mt-6 pt-4">
      <p className="text-xs text-slate-400 text-center font-medium">
        42,900+ Suppliers · 901,900+ Resellers · 95% Below Retail
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   LOGIN TAB CONTENT
   ═══════════════════════════════════════ */
function LoginTabContent({ onSwitchTab, onAuthenticated, onClose }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [errors, setErrors] = useState({});
  const { getLastLogin, recordLogin } = useLastLogin();
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  /* ── "Keep me signed in" toggle ──
     H6: Wired to NextAuth — the `remember` flag is passed to
     signIn("credentials") and the JWT callback in auth.js
     extends maxAge to 90 days when true. */
  const [rememberMe, setRememberMe] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { executeRecaptcha } = useRecaptcha();
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const { resendVerification, status: verifyStatus, cooldown, sendCount } = useVerificationEmail();

  // Login attempt rate limiting (escalating: 30s → 60s → 120s → 240s → 300s cap)
  const loginLimit = useRateLimit({ maxAttempts: 5, baseLockout: 30, escalation: 2, maxLockout: 300, warnAfter: 3 });
  const { isLocked, countdown, failCount, attemptsLeft, showWarning, maxAttempts: MAX_ATTEMPTS, recordAttempt, recordSuccess } = loginLimit;

  // Forgot password rate limiting (3 requests per window, 60s lockout)
  const forgotLimit = useRateLimit({ maxAttempts: 3, baseLockout: 60, escalation: 1.5, maxLockout: 180, warnAfter: 2 });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const { resendVerification: resendResetEmail, status: resetEmailStatus, cooldown: resetCooldown, sendCount: resetSendCount, reset: resetResetEmail } = useVerificationEmail();

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: "" }));
  };

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
    if (Object.values(errs).some(Boolean)) {
      document.getElementById(Object.keys(errs).find((k) => errs[k]))?.focus();
      return;
    }
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
      // Success — reset rate limiter, show last login toast, close
      recordSuccess();
      const prev = getLastLogin();
      recordLogin();
      onAuthenticated({ remember: rememberMe });
      if (prev) window.dispatchEvent(new CustomEvent("show-last-login", { detail: prev }));
      setTimeout(() => onClose(), 500);
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
    if (err) {
      document.getElementById("modal-forgot-email")?.focus();
      return;
    }
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
    setShowForgot(false);
    setForgotEmail("");
    setForgotError("");
    setForgotTouched(false);
    setForgotSubmitted(false);
    setForgotSuccess(false);
    resetResetEmail();
  };

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
        <button
          type="button"
          onClick={backToLogin}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back to login
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Forgot your password?</h2>
        <p className="text-base text-slate-500 mb-6">
          Enter your registered email address and we&apos;ll send you a link to reset your password.
        </p>
        <FloatingField
          id="modal-forgot-email"
          label="Email Address"
          type="email"
          required
          value={forgotEmail}
          onChange={(e) => {
            setForgotEmail(e.target.value);
            if (forgotTouched || forgotSubmitted) setForgotError("");
          }}
          onBlur={() => {
            setForgotTouched(true);
            setForgotError(validateEmail(forgotEmail));
          }}
          error={(forgotTouched || forgotSubmitted) ? forgotError : ""}
          placeholder="you@company.com"
          autoFocus
        />
        {forgotLimit.isLocked && (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3">
            <Lock size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Too many requests</p>
              <p className="mt-0.5">Please wait <span className="font-bold">{forgotLimit.countdown}s</span> before trying again.</p>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={forgotLoading || forgotLimit.isLocked}
          className="w-full mt-6 py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
        >
          {forgotLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Sending...
            </>
          ) : forgotLimit.isLocked ? (
            <>
              <Lock size={14} /> Locked ({forgotLimit.countdown}s)
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
        <RecaptchaNotice />
      </form>
    );
  }

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
        <SocialButton icon={GoogleIcon} label="Google" onClick={() => signIn("google")} disabled={loading} />
        <SocialButton icon={AppleIcon} label="Apple" onClick={() => signIn("apple")} disabled={loading} />
        <SocialButton icon={FacebookIcon} label="Facebook" onClick={() => signIn("facebook")} disabled={loading} />
      </div>

      <Divider text="or continue with email" />

      {submitted && <ErrorSummary errors={errors} fieldLabels={{ identity: "Username or Email", password: "Password" }} />}

      <div className="space-y-4">
        <FloatingField
          id="modal-identity"
          label="Username or Email Address"
          required
          value={form.identity}
          onChange={set("identity")}
          onBlur={blur("identity")}
          error={(touched.identity || submitted) ? errors.identity : ""}
          placeholder="Enter username or email..."
          autoFocus
        />

        <div>
          <div className="flex items-center justify-between mb-0">
            <span />
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors mb-1.5"
            >
              Forgot password?
            </button>
          </div>
          <FloatingPasswordField
            id="modal-password"
            label="Password"
            required
            value={form.password}
            onChange={set("password")}
            onBlur={blur("password")}
            error={(touched.password || submitted) ? errors.password : ""}
            placeholder="Enter password..."
            autoComplete="current-password"
          />
        </div>

        <Toggle checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}>
          Keep me signed in
        </Toggle>
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


      <button
        type="submit"
        disabled={loading || isLocked}
        className="w-full mt-6 py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Logging in...
          </>
        ) : isLocked ? (
          <>
            <Lock size={14} /> Locked ({countdown}s)
          </>
        ) : (
          "Log in"
        )}
      </button>
      <RecaptchaNotice />

      <button
        type="button"
        onClick={() => onSwitchTab("register")}
        className="w-full mt-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 text-center"
      >
        <span className="text-sm text-slate-500">Don&apos;t have an account?</span>{" "}
        <span className="text-sm font-semibold text-orange-600">Register free</span>
      </button>

      <CompactTrustBar />
    </form>
  );
}

/* ═══════════════════════════════════════
   REGISTER TAB CONTENT
   ═══════════════════════════════════════ */
function RegisterTabContent({ onSwitchTab, onAuthenticated, onClose }) {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [newsletter, setNewsletter] = useState(false);
  const { executeRecaptcha } = useRecaptcha();
  const { status: usernameStatus, message: usernameMessage, checkUsername } = useUsernameCheck();
  const { status: emailStatus, message: emailMessage, checkEmail } = useEmailCheck();
  const { sendVerification, resendVerification, status: verifyStatus, cooldown, sendCount } = useVerificationEmail();
  const { status: breachStatus, breachCount, checkPassword: checkBreach, reset: resetBreach } = useBreachCheck();
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: "" }));
    if (field === "username") checkUsername(val);
    if (field === "email") checkEmail(val);
    if (field === "password") checkBreach(val);
  };

  const validateField = useCallback((field, val) => {
    switch (field) {
      case "username":
        return validateUsername(val);
      case "firstName":
        return !val.trim() ? "First name is required" : "";
      case "lastName":
        return !val.trim() ? "Last name is required" : "";
      case "email":
        return validateEmail(val);
      case "password":
        return validatePassword(val);
      case "confirmPassword":
        return !val ? "Please confirm your password" : val !== form.password ? "Passwords do not match" : "";
      default:
        return "";
    }
  }, [form.password]);

  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((p) => ({ ...p, [field]: validateField(field, form[field]) }));
  };

  const validateAll = () => {
    const errs = {};
    errs.username = validateUsername(form.username) || (usernameStatus === "taken" ? "Username is already taken" : usernameStatus === "checking" ? "Please wait — checking username" : "");
    errs.firstName = !form.firstName.trim() ? "First name is required" : "";
    errs.lastName = !form.lastName.trim() ? "Last name is required" : "";
    errs.email = validateEmail(form.email) || (emailStatus === "registered" ? "An account with this email already exists" : emailStatus === "checking" ? "Please wait — checking email" : "");
    errs.password = validatePassword(form.password) || (breachStatus === "breached" ? "This password was found in a data breach — please choose another" : breachStatus === "checking" ? "Please wait — checking password safety" : "");
    errs.confirmPassword = !form.confirmPassword ? "Please confirm your password" : form.confirmPassword !== form.password ? "Passwords do not match" : "";
    if (!agreeTerms) errs.terms = "You must agree to the terms";
    Object.keys(errs).forEach((k) => {
      if (!errs[k]) delete errs[k];
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateAll();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById(Object.keys(errs).find((k) => errs[k]))?.focus();
      return;
    }
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
    } catch (_err) {
      setLoading(false);
      setErrors({ server: "Something went wrong. Please try again." });
    }
  };

  const fieldLabels = {
    username: "Username",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    terms: "Terms",
  };

  if (success) {
    return (
      <VerificationSuccessPanel
        email={form.email}
        onResend={() => resendVerification(form.email, "registration")}
        resendStatus={verifyStatus}
        cooldown={cooldown}
        sendCount={sendCount}
        onGoToLogin={() => {
          setSuccess(false);
          onSwitchTab("login");
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
      <p className="text-base text-slate-500 mb-6">Join 901,900+ resellers sourcing wholesale &amp; dropship deals with zero commissions.</p>

      {/* Social register */}
      <div className="grid grid-cols-3 gap-2.5">
        <SocialButton icon={GoogleIcon} label="Google" onClick={() => signIn("google")} disabled={loading} />
        <SocialButton icon={AppleIcon} label="Apple" onClick={() => signIn("apple")} disabled={loading} />
        <SocialButton icon={FacebookIcon} label="Facebook" onClick={() => signIn("facebook")} disabled={loading} />
      </div>

      <Divider text="or register with email" />

      {submitted && <ErrorSummary errors={errors} fieldLabels={fieldLabels} />}

      <div className="space-y-4">
        <UsernameField
          id="modal-username"
          label="Username"
          required
          value={form.username}
          onChange={set("username")}
          onBlur={blur("username")}
          error={(touched.username || submitted) ? errors.username : ""}
          placeholder="Choose a username..."
          autoFocus
          availabilityStatus={usernameStatus}
          availabilityMessage={usernameMessage}
        />

        <div className="grid grid-cols-2 gap-3">
          <FloatingField
            id="modal-firstName"
            label="First Name"
            required
            value={form.firstName}
            onChange={set("firstName")}
            onBlur={blur("firstName")}
            error={(touched.firstName || submitted) ? errors.firstName : ""}
            placeholder="First name..."
          />
          <FloatingField
            id="modal-lastName"
            label="Last Name"
            required
            value={form.lastName}
            onChange={set("lastName")}
            onBlur={blur("lastName")}
            error={(touched.lastName || submitted) ? errors.lastName : ""}
            placeholder="Last name..."
          />
        </div>

        <EmailField
          id="modal-email"
          label="Email"
          required
          value={form.email}
          onChange={set("email")}
          onBlur={blur("email")}
          error={(touched.email || submitted) ? errors.email : ""}
          placeholder="you@company.com"
          availabilityStatus={emailStatus}
          availabilityMessage={emailMessage}
          onSwitchToLogin={() => onSwitchTab("login")}
          privacyHint
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FloatingPasswordField
              id="modal-password"
              label="Password"
              required
              value={form.password}
              onChange={set("password")}
              onBlur={blur("password")}
              error={(touched.password || submitted) ? errors.password : ""}
              placeholder="Min 8 characters..."
            />
            <PasswordStrength password={form.password} breachStatus={breachStatus} breachCount={breachCount} />
          </div>
          <FloatingPasswordField
            id="modal-confirmPassword"
            label="Confirm Password"
            required
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            onBlur={blur("confirmPassword")}
            error={(touched.confirmPassword || submitted) ? errors.confirmPassword : ""}
            placeholder="Re-enter password..."
          />
        </div>

        <div className="space-y-2.5 pt-1">
          <Toggle checked={newsletter} onChange={() => setNewsletter(!newsletter)}>
            Send me weekly deals and supplier updates
          </Toggle>
          <Toggle
            id="modal-terms"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            error={submitted && !agreeTerms}
          >
            I accept the{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">
              Privacy Policy
            </Link>
            {" "}and{" "}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2">
              Terms of Service
            </Link>
          </Toggle>
          {submitted && !agreeTerms && <p className="text-xs text-red-500 ml-9">You must agree to continue</p>}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-6 mb-3 flex items-center justify-center gap-1.5">
        <Users size={11} className="text-slate-400" />
        Join 900,000+ businesses already on WholesaleUp
      </p>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Creating Account...
          </>
        ) : (
          "Create an Account"
        )}
      </button>
      <RecaptchaNotice />

      <button
        type="button"
        onClick={() => onSwitchTab("login")}
        className="w-full mt-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 text-center"
      >
        <span className="text-sm text-slate-500">Already have an account?</span>{" "}
        <span className="text-sm font-semibold text-orange-600">Log in</span>
      </button>

      <CompactTrustBar />
    </form>
  );
}

/* ═══════════════════════════════════════
   AUTH MODAL COMPONENT
   ═══════════════════════════════════════ */
export default function AuthModal({ initialTab = "login", onClose, onAuthenticated, embedded = false }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const modalRef = useRef(null);
  const formColumnRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Escape key to close (skip in embedded mode — parent handles it)
  useEffect(() => {
    if (embedded) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, embedded]);

  // Body scroll lock (skip in embedded mode — parent handles it)
  useEffect(() => {
    if (embedded) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [embedded]);

  // Focus trap — keep Tab / Shift+Tab within the modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = () =>
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    modal.addEventListener("keydown", handleTab);
    // Auto-focus first focusable element on mount
    const els = focusable();
    if (els.length) els[0].focus();
    return () => modal.removeEventListener("keydown", handleTab);
  }, [activeTab]);

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    // Scroll form column back to top on tab switch
    requestAnimationFrame(() => {
      formColumnRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  // ── Inner card content (shared between standalone and embedded modes) ──
  const cardContent = (
    <>
      {/* Form Column */}
      <div ref={formColumnRef} className="flex-1 lg:w-[58%] lg:shrink-0 flex flex-col p-6 md:p-8 overflow-y-auto">
        {/* Logo + Close — small screens only (when blue column is hidden) */}
        <div className="flex items-center gap-2 lg:hidden mb-4">
          <div className="w-8 h-8">
            <WholesaleUpIcon className="w-full h-full" dark={true} />
          </div>
          <span className="text-base font-bold text-slate-900">
            wholesale<span className="text-orange-500">up</span>
          </span>
          <button
            onClick={onClose}
            className="ml-auto min-w-[44px] min-h-[44px] rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs + Close button in one row */}
        <div className="flex items-start mb-8">
          <div role="tablist" aria-label="Account" className="flex border-b border-slate-200">
            {[
              { id: "login", label: "Log In" },
              { id: "register", label: "Register Free" },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`modal-tabpanel-${tab.id}`}
                id={`modal-tab-${tab.id}`}
                onClick={() => handleTabSwitch(tab.id)}
                className={`pb-3 mr-6 font-semibold text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "text-slate-900"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="ml-auto hidden lg:flex min-w-[44px] min-h-[44px] rounded-full bg-slate-100 items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Content */}
        <div role="tabpanel" id={`modal-tabpanel-${activeTab}`} aria-labelledby={`modal-tab-${activeTab}`} className="flex-1">
          {activeTab === "login" ? (
            <LoginTabContent
              onSwitchTab={handleTabSwitch}
              onAuthenticated={onAuthenticated}
              onClose={onClose}
            />
          ) : (
            <RegisterTabContent
              onSwitchTab={handleTabSwitch}
              onAuthenticated={onAuthenticated}
              onClose={onClose}
            />
          )}
        </div>
      </div>

      {/* Marketing Column */}
      <MarketingColumn />
    </>
  );

  // ── Embedded mode: return just the card content (parent provides backdrop + positioning) ──
  if (embedded) {
    return (
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={activeTab === "login" ? "Log in to your account" : "Create your account"}
        className="flex flex-col lg:flex-row w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {cardContent}
      </div>
    );
  }

  // ── Standalone mode: full modal with backdrop ──
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={activeTab === "login" ? "Log in to your account" : "Create your account"}
        className="bg-white rounded-2xl shadow-2xl w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col max-w-md lg:flex-row lg:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {cardContent}
      </div>
    </div>
  );
}
