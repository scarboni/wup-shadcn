"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Monitor,
  X,
  Loader2,
  Mail,
  RefreshCw,
  Clock,
  Inbox,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

/* ═══════════════════════════════════════
   EMAIL PROVIDER HINT — "Open Gmail", etc.
   ═══════════════════════════════════════ */
const EMAIL_PROVIDERS = [
  { domains: ["gmail.com", "googlemail.com"], name: "Gmail", url: "https://mail.google.com" },
  { domains: ["outlook.com", "hotmail.com", "live.com", "msn.com"], name: "Outlook", url: "https://outlook.live.com" },
  { domains: ["yahoo.com", "ymail.com", "rocketmail.com"], name: "Yahoo Mail", url: "https://mail.yahoo.com" },
  { domains: ["icloud.com", "me.com", "mac.com"], name: "iCloud Mail", url: "https://www.icloud.com/mail" },
  { domains: ["proton.me", "protonmail.com", "pm.me"], name: "Proton Mail", url: "https://mail.proton.me" },
  { domains: ["zoho.com"], name: "Zoho Mail", url: "https://mail.zoho.com" },
  { domains: ["aol.com"], name: "AOL Mail", url: "https://mail.aol.com" },
];

function getEmailProvider(email) {
  if (!email) return null;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return EMAIL_PROVIDERS.find((p) => p.domains.includes(domain)) || null;
}

function EmailProviderButton({ email }) {
  const provider = getEmailProvider(email);
  if (!provider) return null;

  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
    >
      <ExternalLink size={14} />
      Open {provider.name}
    </a>
  );
}

/* ═══════════════════════════════════════
   SOCIAL AUTH ICONS
   ═══════════════════════════════════════ */
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.384C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/>
      <path d="M16.671 15.47L17.203 12h-3.328V9.75c0-.949.465-1.875 1.956-1.875h1.513V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669V12H7.078v3.47h3.047v8.384a12.1 12.1 0 003.75 0V15.47h2.796z" fill="white"/>
    </svg>
  );
}

/* ═══════════════════════════════════════
   FORM COMPONENTS
   ═══════════════════════════════════════ */
export function FloatingField({ label, required, error, value, onChange, onBlur, type = "text", placeholder = "", id, autoFocus = false }) {
  const [focused, setFocused] = useState(autoFocus);
  const hasValue = value && value.trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50/40" : focused ? "bg-white" : hasValue ? "bg-emerald-50/40" : "bg-white";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error
              ? "text-red-600"
              : focused
              ? "text-orange-500"
              : hasValue
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className="w-full px-3.5 py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg pr-9"
          placeholder={focused ? placeholder : ""}
          autoFocus={autoFocus}
          autoComplete={type === "email" ? "email" : "off"}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
          ) : hasValue ? (
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
          ) : null}
        </div>
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1">{error}</p>}
    </div>
  );
}

/* ── Username field with live availability indicator ── */
export function UsernameField({ label, required, error, value, onChange, onBlur, id, placeholder = "", autoFocus = false, availabilityStatus = "idle", availabilityMessage = "" }) {
  const [focused, setFocused] = useState(autoFocus);
  const hasValue = value && value.trim().length > 0;
  const floated = focused || hasValue;

  // Availability overrides normal styling when no validation error
  const isChecking = availabilityStatus === "checking";
  const isAvailable = availabilityStatus === "available";
  const isTaken = availabilityStatus === "taken" || availabilityStatus === "invalid";
  const showAvailError = !error && isTaken;
  const showAvailOk = !error && isAvailable;

  const stateStyle = error || showAvailError
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : showAvailOk
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : hasValue
    ? "border-slate-300"
    : "border-slate-200";

  const bgColor = error || showAvailError ? "bg-red-50/40" : focused ? "bg-white" : showAvailOk ? "bg-emerald-50/40" : "bg-white";

  // Right-side icon
  const rightIcon = error ? (
    <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
  ) : isChecking ? (
    <Loader2 size={15} className="text-orange-400 animate-spin" />
  ) : showAvailOk ? (
    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
  ) : isTaken ? (
    <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
  ) : hasValue ? (
    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
  ) : null;

  // Status message below field
  const statusMsg = error
    ? error
    : availabilityMessage && availabilityStatus !== "idle"
    ? availabilityMessage
    : null;

  const statusColor = error || isTaken
    ? "text-red-600"
    : isChecking
    ? "text-orange-500"
    : isAvailable
    ? "text-emerald-600"
    : "text-slate-500";

  const hasError = !!(error || showAvailError);
  const statusId = id && statusMsg ? `${id}-status` : undefined;

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error || showAvailError
              ? "text-red-600"
              : focused
              ? "text-orange-500"
              : showAvailOk
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className="w-full px-3.5 py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg pr-9"
          placeholder={focused ? placeholder : ""}
          autoFocus={autoFocus}
          autoComplete="username"
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={statusId}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {rightIcon}
        </div>
      </div>
      {statusMsg && (
        <p id={statusId} aria-live="polite" className={`text-xs mt-1 ml-1 flex items-center gap-1 ${statusColor}`}>
          {isChecking && <Loader2 size={10} className="animate-spin" />}
          {statusMsg}
        </p>
      )}
    </div>
  );
}

/* ── Email field with live registered-check indicator ── */
export function EmailField({ label, required, error, value, onChange, onBlur, id, placeholder = "", autoFocus = false, availabilityStatus = "idle", availabilityMessage = "", onSwitchToLogin, privacyHint = false }) {
  const [focused, setFocused] = useState(autoFocus);
  const hasValue = value && value.trim().length > 0;
  const floated = focused || hasValue;

  const isChecking = availabilityStatus === "checking";
  const isAvailable = availabilityStatus === "available";
  const isRegistered = availabilityStatus === "registered";
  const showAvailError = !error && isRegistered;
  const showAvailOk = !error && isAvailable;

  const stateStyle = error || showAvailError
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : showAvailOk
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : hasValue
    ? "border-slate-300"
    : "border-slate-200";

  const bgColor = error || showAvailError ? "bg-red-50/40" : focused ? "bg-white" : showAvailOk ? "bg-emerald-50/40" : "bg-white";

  const rightIcon = error ? (
    <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
  ) : isChecking ? (
    <Loader2 size={15} className="text-orange-400 animate-spin" />
  ) : showAvailOk ? (
    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
  ) : isRegistered ? (
    <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
  ) : hasValue ? (
    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
  ) : null;

  const statusMsg = error
    ? error
    : availabilityMessage && availabilityStatus !== "idle"
    ? availabilityMessage
    : null;

  const statusColor = error || isRegistered
    ? "text-red-600"
    : isChecking
    ? "text-orange-500"
    : isAvailable
    ? "text-emerald-600"
    : "text-slate-500";

  const hasError = !!(error || showAvailError);
  const statusId = id && statusMsg ? `${id}-status` : undefined;

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error || showAvailError
              ? "text-red-600"
              : focused
              ? "text-orange-500"
              : showAvailOk
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type="email"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className="w-full px-3.5 py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg pr-9"
          placeholder={focused ? placeholder : ""}
          autoFocus={autoFocus}
          autoComplete="email"
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={statusId}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {rightIcon}
        </div>
      </div>
      {statusMsg && (
        <p id={statusId} aria-live="polite" className={`text-xs mt-1 ml-1 flex items-center gap-1 ${statusColor}`}>
          {isChecking && <Loader2 size={10} className="animate-spin" />}
          {isRegistered ? (
            <>
              Already registered{onSwitchToLogin ? (
                <> — <button type="button" onClick={onSwitchToLogin} className="font-semibold text-orange-500 hover:text-orange-600 underline underline-offset-2">Log in instead</button></>
              ) : null}
            </>
          ) : statusMsg}
        </p>
      )}
      {privacyHint && !statusMsg && (
        <p className="text-[11px] text-slate-500 mt-1.5 ml-1 flex items-center gap-1">
          <ShieldCheck size={10} className="text-emerald-500 shrink-0" />
          We&apos;ll never share your email with third parties
        </p>
      )}
    </div>
  );
}

export function FloatingPasswordField({ label, required, error, value, onChange, onBlur, id, placeholder = "", autoComplete = "new-password" }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const hasValue = value && value.trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50/40" : focused ? "bg-white" : hasValue ? "bg-emerald-50/40" : "bg-white";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error
              ? "text-red-600"
              : focused
              ? "text-orange-500"
              : hasValue
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className="w-full px-3.5 py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg pr-16"
          placeholder={focused ? placeholder : ""}
          autoComplete={autoComplete}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {error ? (
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center pointer-events-none"><X size={10} className="text-white" strokeWidth={3} /></span>
          ) : hasValue && !focused ? (
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center pointer-events-none"><Check size={10} className="text-white" strokeWidth={3} /></span>
          ) : null}
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 rounded"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1">{error}</p>}
    </div>
  );
}

export function PasswordStrength({ password, breachStatus, breachCount }) {
  const rules = [
    { label: "8+", met: password.length >= 8 },
    { label: "A-Z", met: /[A-Z]/.test(password) },
    { label: "0-9", met: /[0-9]/.test(password) },
    { label: "!@#", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const metCount = rules.filter((r) => r.met).length;
  const bonus = password.length >= 12 ? 1 : 0;
  const score = metCount + bonus;

  const level = score <= 1 ? "weak" : score <= 3 ? "medium" : "strong";
  const dotColor = { weak: "bg-red-400", medium: "bg-amber-400", strong: "bg-emerald-400" };

  // Format breach count for display (e.g., 12345 → "12,345")
  const formatCount = (n) => n?.toLocaleString?.() || n;

  return (
    <div>
      <div className="flex flex-nowrap items-center gap-1.5 mt-2 px-0.5">
        {rules.map((r) => (
          <span
            key={r.label}
            className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-px rounded transition-all duration-300 ${
              r.met
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "text-slate-400 border border-slate-200"
            }`}
          >
            {r.met && <span className="w-[12px] h-[12px] rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={7} className="text-white" strokeWidth={3} /></span>}
            {r.label}
          </span>
        ))}
        {password && (
          <span className="ml-auto flex items-center gap-1">
            {breachStatus === "checking" && (
              <span className="text-[10px] text-slate-400 animate-pulse">checking…</span>
            )}
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${dotColor[level]}`} />
            <span className={`text-[10px] font-semibold ${level === "weak" ? "text-red-500" : level === "medium" ? "text-amber-500" : "text-emerald-600"}`}>
              {level === "weak" ? "Weak" : level === "medium" ? "Fair" : "Strong"}
            </span>
          </span>
        )}
      </div>
      {breachStatus === "breached" && (
        <div className="flex items-start gap-2 mt-2 px-2.5 py-2 rounded-lg bg-red-50 border border-red-200" role="alert">
          <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-red-700 leading-snug">
            This password has appeared in <span className="font-bold">{formatCount(breachCount)}</span> known data breach{breachCount !== 1 ? "es" : ""}. Please choose a different password.
          </p>
        </div>
      )}
      {breachStatus === "safe" && password && metCount === 4 && (
        <div className="flex items-center gap-1.5 mt-2 px-0.5">
          <span className="w-[14px] h-[14px] rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={9} className="text-white" strokeWidth={3} /></span>
          <span className="text-[10px] text-emerald-600 font-medium">Not found in known breaches</span>
        </div>
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, children, error = false, id }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ${
          checked
            ? "bg-orange-500"
            : error
              ? "bg-red-200"
              : "bg-slate-300 group-hover:bg-slate-400"
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
      <span className={`text-sm ${error ? "text-red-600" : "text-slate-600"}`}>{children}</span>
    </label>
  );
}

export function Divider({ text }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-sm font-medium text-slate-500">{text}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export function SocialButton({ icon: Icon, label, onClick, disabled = false, hoverBg = "hover:bg-slate-50", hoverBorder = "hover:border-slate-300", hoverText = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault() /* prevent blur on focused form fields */}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-lg border border-slate-200 bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 text-sm font-medium text-slate-700 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none ${hoverBg} ${hoverBorder} ${hoverText}`}
    >
      <Icon /> {label}
    </button>
  );
}

export function ErrorSummary({ errors, fieldLabels }) {
  const errorEntries = Object.entries(errors).filter(([, v]) => v);
  if (errorEntries.length === 0) return null;
  return (
    <div role="alert" className="rounded-xl mb-8 overflow-hidden border border-red-200">
      <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
        <AlertTriangle size={14} className="text-white shrink-0" />
        <p className="text-sm font-semibold text-white">
          Please fix {errorEntries.length} error{errorEntries.length > 1 ? "s" : ""} below
        </p>
      </div>
      <div className="bg-red-50/80">
        {errorEntries.map(([key, msg], i) => (
          <button
            key={key}
            type="button"
            onClick={() => document.getElementById(key)?.focus()}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-100/80 transition-colors group ${
              i < errorEntries.length - 1 ? "border-b border-red-100" : ""
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
              {i + 1}
            </span>
            <span className="text-sm">
              <span className="font-semibold text-red-800 underline underline-offset-2 decoration-red-300 group-hover:decoration-red-500">{fieldLabels[key] || key}</span>
              <span className="text-red-600/70 mx-1.5">&mdash;</span>
              <span className="text-red-600">{msg}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function SuccessPanel({ icon: Icon, title, message, action, onAction }) {
  return (
    <div className="text-center py-10 px-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-emerald-600" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">{message}</p>
      {action && (
        <button type="button" onClick={onAction} className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
          {action} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   RESET PASSWORD SUCCESS PANEL — forgot password flow
   ═══════════════════════════════════════ */
function maskEmail(email) {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const show = Math.min(3, local.length);
  return local.slice(0, show) + "•••@" + domain;
}

export function ResetPasswordSuccessPanel({ email, onResend, resendStatus, cooldown, sendCount, onBackToLogin }) {
  const masked = maskEmail(email);
  const isSending = resendStatus === "sending";
  const canResend = cooldown === 0 && !isSending;

  return (
    <div className="text-center py-8 px-6">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <Mail size={28} className="text-emerald-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">Check Your Email</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
        We&apos;ve sent a password reset link to <span className="font-semibold text-slate-700">{masked}</span>.
      </p>

      {/* Open email provider shortcut */}
      <div className="mb-5">
        <EmailProviderButton email={email} />
      </div>

      {/* Expiry notice */}
      <div className="flex items-center gap-2 justify-center mb-6 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg max-w-xs mx-auto">
        <Clock size={13} className="text-amber-600 shrink-0" />
        <p className="text-xs text-amber-700">Link expires in 24 hours</p>
      </div>

      {/* Resend section */}
      <div className="border-t border-slate-100 pt-5 mt-2 mb-6">
        <p className="text-xs text-slate-500 mb-3">
          {sendCount > 1 ? `Reset email sent ${sendCount} time${sendCount > 1 ? "s" : ""}. ` : ""}
          Didn&apos;t receive it? Check your spam folder or
        </p>
        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
            canResend
              ? "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300"
              : "text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <><Loader2 size={14} className="animate-spin" /> Sending…</>
          ) : cooldown > 0 ? (
            <><Clock size={14} /> Resend in {cooldown}s</>
          ) : (
            <><RefreshCw size={14} /> Resend reset email</>
          )}
        </button>
      </div>

      {/* Back to login */}
      <button
        type="button"
        onClick={onBackToLogin}
        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
      >
        Back to Log In <ArrowRight size={14} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   VERIFICATION SUCCESS PANEL — post-registration
   ═══════════════════════════════════════ */
export function VerificationSuccessPanel({ email, onResend, resendStatus, cooldown, sendCount, onGoToLogin }) {
  const masked = maskEmail(email);
  const isSending = resendStatus === "sending";
  const canResend = cooldown === 0 && !isSending;

  return (
    <div className="text-center py-8 px-6">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
        <Mail size={28} className="text-emerald-600" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-1">
        We've sent a verification link to
      </p>
      <p className="text-sm font-semibold text-slate-800 mb-5">{masked}</p>

      {/* Steps */}
      <div className="text-left max-w-xs mx-auto mb-6 space-y-3">
        {[
          { step: 1, text: "Check your inbox for our verification email" },
          { step: 2, text: "Click \"Verify My Email\"" },
          { step: 3, text: "Start browsing wholesale deals" },
        ].map(({ step, text }) => (
          <div key={step} className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0 mt-px">
              {step}
            </span>
            <span className="text-sm text-slate-600">{text}</span>
          </div>
        ))}
      </div>

      {/* Open email provider shortcut */}
      <div className="mb-6">
        <EmailProviderButton email={email} />
      </div>

      {/* Expiry notice */}
      <div className="flex items-center gap-2 justify-center mb-6 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg max-w-xs mx-auto">
        <Clock size={13} className="text-amber-600 shrink-0" />
        <p className="text-xs text-amber-700">Link expires in 24 hours</p>
      </div>

      {/* Resend section */}
      <div className="border-t border-slate-100 pt-5 mt-2">
        <p className="text-xs text-slate-500 mb-3">
          {sendCount > 1 ? `Verification email sent ${sendCount} time${sendCount > 1 ? "s" : ""}. ` : ""}
          Didn't receive it? Check your spam folder or
        </p>
        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
            canResend
              ? "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300"
              : "text-slate-400 border-slate-200 bg-slate-50 cursor-not-allowed"
          }`}
        >
          {isSending ? (
            <><Loader2 size={14} className="animate-spin" /> Sending…</>
          ) : cooldown > 0 ? (
            <><Clock size={14} /> Resend in {cooldown}s</>
          ) : (
            <><RefreshCw size={14} /> Resend verification email</>
          )}
        </button>
      </div>

      {/* Go to login */}
      {onGoToLogin && (
        <button
          type="button"
          onClick={onGoToLogin}
          className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
        >
          Go to Log In <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   LAST LOGIN TOAST — shows after successful login
   ═══════════════════════════════════════ */
export function LastLoginToast({ lastLogin, onDismiss }) {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(() => onDismiss?.(), 300); }, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!lastLogin) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-[60] max-w-sm transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <Monitor size={16} className="text-slate-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Welcome back</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Last login: {lastLogin.timeAgo} from {lastLogin.browser} on {lastLogin.os}
          </p>
        </div>
        <button
          onClick={() => { setVisible(false); setTimeout(() => onDismiss?.(), 300); }}
          className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RECAPTCHA NOTICE (required when hiding badge)
   ═══════════════════════════════════════ */
export function RecaptchaNotice() {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck size={12} className="text-emerald-500" />
        <span>256-bit SSL encrypted &middot; Your data is secure</span>
      </div>
      <p className="text-[11px] text-slate-500 text-center leading-relaxed">
        Protected by reCAPTCHA —{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">Privacy</a>
        {" · "}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">Terms</a>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════
   VALIDATION HELPERS
   ═══════════════════════════════════════ */
export function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  // Stricter email validation:
  // - Local part: 1+ chars (letters, digits, ._%+-)
  // - Domain: 2+ labels separated by dots, each 1+ chars
  // - TLD: 2–12 letters (rejects a@b.c, allows .com through .international)
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/.test(email))
    return "Please enter a valid email address";
  return "";
}

export function validatePassword(pw) {
  if (!pw) return "Password is required";
  if (pw.length < 8) return "Must be at least 8 characters";
  if (!/[A-Z]/.test(pw)) return "Must include an uppercase letter";
  if (!/[0-9]/.test(pw)) return "Must include a number";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Must include a special character (!@#$...)";
  return "";
}

export function validateUsername(u) {
  if (!u.trim()) return "Username is required";
  if (u.length < 3) return "Must be at least 3 characters";
  if (!/^[a-zA-Z0-9_-]+$/.test(u)) return "Only letters, numbers, underscores, and hyphens";
  return "";
}
