"use client";

import Link from "next/link";

/* ═══════════════════════════════════════════════════
   BRAND LOGO — Single source of truth for the
   wholesaleup icon + wordmark across the entire site.

   Usage:
     import { WholesaleUpIcon, WholesaleUpLogo } from "@/components/shared/logo";

   WholesaleUpIcon  — standalone W icon (favicon style)
   WholesaleUpLogo  — icon + "wholesaleup" wordmark (header/footer)
   ═══════════════════════════════════════════════════ */

export function WholesaleUpIcon({ className = "", dark = false }) {
  const strokeColor = dark ? "#0f172a" : "#ffffff";
  return (
    <svg viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Right upstroke — transparent, drawn FIRST so white W paints over the junction */}
      <path d="M56 62 L72 18" stroke="transparent" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Orange arrowhead */}
      <polygon points="72,4 60,22 84,22" fill="#f97316"/>
      {/* Left downstroke of W */}
      <path d="M8 12 L22 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Middle V of W */}
      <path d="M22 62 L40 28 L56 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   LOCKED LOGO PLACEHOLDER — used when canViewBranding is false.
   Shows ONLY the WholesaleUp W in a muted slate style.
   No lock icon, no initials — does NOT reveal the supplier's identity.

   Sizes:
     "sm"  — 40×40 (grid cards, compact panels)
     "md"  — 44×44 (supplier sidebar, list cards)
     "lg"  — 48×48 (main supplier card)

   Usage:
     import { LockedLogoPlaceholder } from "@/components/shared/logo";
     <LockedLogoPlaceholder size="lg" href="/register" title="Join to see supplier branding" />
   ═══════════════════════════════════════════════════ */
export function LockedLogoPlaceholder({
  size = "md",
  href,
  onClick,
  title = "Register to see supplier branding",
  className = "",
}) {
  const dims = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-10 w-10" : "h-11 w-11";
  const wSize = size === "lg" ? "w-8 h-8" : size === "sm" ? "w-6 h-6" : "w-7 h-7";

  const inner = (
    <div className="flex items-center justify-center">
      <svg viewBox="-4 -2 96 74" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${wSize} opacity-30 group-hover/logo:opacity-40 transition-opacity`}>
        <polygon points="72,4 60,22 84,22" fill="#94a3b8" />
        <path d="M8 12 L22 62" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M22 62 L40 28 L56 62" stroke="#94a3b8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );

  const wrapperClass = `${dims} rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 shrink-0 flex items-center justify-center overflow-hidden group/logo cursor-pointer hover:border-orange-200 hover:from-orange-50/30 hover:to-slate-50 transition-all ${className}`;

  if (href) {
    return (
      <a href={href} onClick={onClick} className={wrapperClass} title={title}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={wrapperClass} title={title}>
      {inner}
    </button>
  );
}

export function WholesaleUpLogo({ size = "default", dark = false, as: Wrapper = Link, href = "/" }) {
  const iconClass = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const textClass = size === "small"
    ? "text-base font-extrabold tracking-tight"
    : "text-[22px] font-extrabold tracking-[-0.02em]";
  const wordColor = dark ? "text-slate-900" : "text-white";

  return (
    <Wrapper href={href} className="flex items-center gap-1.5">
      <WholesaleUpIcon className={iconClass} dark={dark} />
      <span className={textClass}>
        <span className={wordColor}>wholesale</span>
        <span className="text-orange-500">up</span>
      </span>
    </Wrapper>
  );
}
