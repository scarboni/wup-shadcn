"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import Breadcrumb from "@/components/shared/breadcrumb";
import {
  User,
  ShoppingBag,
  Store,
  Package,
  Heart,
  Crown,
  Sparkles,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronRight,
  Calendar,
  Camera,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { DASHBOARD_NAV_SECTIONS, DASHBOARD_NAV_LINKS } from "@/lib/dashboard-nav";

/* ─────────── Mock Users (H9) ────────────────────────────────
   PRODUCTION: Remove USERS constant entirely. User data comes
   from the NextAuth session via useSession() → session.user.
   Profile data: GET /api/user/profile for extended fields.
   Profile updates: PUT /api/user/profile
   ─────────────────────────────────────────────────────────── */
export const USERS = {
  "free":              { firstName: "Sarah",    lastName: "Mitchell",    initials: "SM", tier: "FREE",         expiresOn: null,            gender: "female", isSupplier: false, memberSince: "Mar 2024", listingsCount: null },
  "standard":          { firstName: "Jennifer", lastName: "Lawrence",    initials: "JL", tier: "STANDARD",     expiresOn: "9 Jan 2027",    gender: "female", isSupplier: false, memberSince: "Jun 2023", listingsCount: null },
  "premium":           { firstName: "Anand",    lastName: "Kumar",       initials: "AK", tier: "PREMIUM",      expiresOn: "15 Sep 2026",   gender: "male",   isSupplier: false, memberSince: "Jan 2023", listingsCount: null },
  "premium-plus":      { firstName: "Michael",  lastName: "Chen",        initials: "MC", tier: "PREMIUM+",     expiresOn: "20 Dec 2026",   gender: "male",   isSupplier: false, memberSince: "Nov 2022", listingsCount: null },
  "supplier-free":     { firstName: "Lisa",     lastName: "Thompson",    initials: "LT", tier: "SUPPLIER",     expiresOn: null,            gender: "female", isSupplier: true,  memberSince: "Feb 2024", listingsCount: 3 },
  "supplier-premium":  { firstName: "David",    lastName: "Richardson",  initials: "DR", tier: "SUPPLIER PRO", expiresOn: "28 Feb 2027",   gender: "male",   isSupplier: true,  memberSince: "Aug 2023", listingsCount: 24 },
};

/* ─────────── Tier Config — styling per tier ──────────────── */
export const TIER_CONFIG = {
  "FREE":         { gradient: "from-slate-400 to-slate-600",    badgeBg: "bg-slate-100",   badgeText: "text-slate-600",   avatarBg: "bg-slate-500",   icon: User,        cardGradient: "from-blue-500 via-blue-600 to-indigo-700",     ctaText: "text-orange-600",  ctaHover: "hover:bg-orange-50",  bannerGradient: "from-blue-600 via-indigo-500 via-35% to-orange-500",    bannerSubtext: "text-blue-100",  bannerLabel: "text-blue-200" },
  "STANDARD":     { gradient: "from-blue-500 to-indigo-600",    badgeBg: "bg-blue-100",    badgeText: "text-blue-700",    avatarBg: "bg-blue-500",    icon: ShoppingBag, cardGradient: "from-purple-600 via-indigo-500 to-violet-700",   ctaText: "text-orange-600",  ctaHover: "hover:bg-orange-50",  bannerGradient: "from-violet-600 via-purple-500 via-40% to-orange-500", bannerSubtext: "text-purple-100", bannerLabel: "text-purple-200" },
  "PREMIUM":      { gradient: "from-amber-500 to-orange-600",   badgeBg: "bg-amber-100",   badgeText: "text-amber-700",   avatarBg: "bg-amber-500",   icon: Crown,       cardGradient: "from-amber-500 via-orange-600 to-rose-600",    ctaText: "text-orange-600",  ctaHover: "hover:bg-orange-50",  bannerGradient: "from-orange-500 via-rose-500 via-40% to-purple-600",  bannerSubtext: "text-orange-100", bannerLabel: "text-orange-200" },
  "PREMIUM+":     { gradient: "from-orange-500 to-rose-600",    badgeBg: "bg-orange-100",  badgeText: "text-orange-700",  avatarBg: "bg-orange-500",  icon: Sparkles,    cardGradient: "from-orange-500 via-rose-600 to-purple-700",   ctaText: "text-rose-600",    ctaHover: "hover:bg-rose-50",    bannerGradient: "from-orange-500 via-rose-600 to-purple-700",   bannerSubtext: "text-orange-100", bannerLabel: "text-orange-200" },
  "SUPPLIER":     { gradient: "from-emerald-500 to-teal-600",   badgeBg: "bg-emerald-100", badgeText: "text-emerald-700", avatarBg: "bg-emerald-500", icon: Store,       cardGradient: "from-emerald-500 via-emerald-600 to-teal-700", ctaText: "text-emerald-600", ctaHover: "hover:bg-emerald-50", bannerGradient: "from-emerald-500 via-teal-600 to-cyan-600",     bannerSubtext: "text-emerald-100", bannerLabel: "text-emerald-200" },
  "SUPPLIER PRO": { gradient: "from-violet-500 to-indigo-600",  badgeBg: "bg-purple-100",  badgeText: "text-purple-700",  avatarBg: "bg-violet-500",  icon: Store,       cardGradient: "from-violet-500 via-purple-600 to-indigo-700", ctaText: "text-purple-600",  ctaHover: "hover:bg-purple-50",  bannerGradient: "from-violet-500 via-purple-600 to-indigo-700", bannerSubtext: "text-purple-100", bannerLabel: "text-purple-200" },
};

/* CTA config per tier */
export const TIER_CTA = {
  "FREE":         { label: "Upgrade to Standard",      primary: true,  bannerCta: "Upgrade to Standard Now!" },
  "STANDARD":     { label: "Upgrade to Premium",       primary: false, bannerCta: "Upgrade to Premium Now!" },
  "PREMIUM":      { label: "Upgrade to Premium+",      primary: false, bannerCta: "Upgrade to Premium+ Now!" },
  "PREMIUM+":     { label: "Renew Subscription",       primary: false, bannerCta: "Renew Now!" },
  "SUPPLIER":     { label: "Upgrade to Supplier Pro",  primary: true,  bannerCta: "Upgrade to Supplier Pro Now!" },
  "SUPPLIER PRO": { label: "Manage Subscription",      primary: false, bannerCta: "Manage Subscription" },
};

/* Banner headline + subtitle per tier — shows what the NEXT tier unlocks */
const TIER_BANNER_COPY = {
  "FREE":     { headline: "20,530+ Live Wholesale Deals",        subtitle: "Unlock Live Wholesale & Dropship Deals, profit calculators & weekly newsletter" },
  "STANDARD": { headline: "47,400+ Verified Suppliers",          subtitle: "Unlock the full supplier database, liquidators & dropship directories" },
  "PREMIUM":  { headline: "Unlimited Enquiries & VIP Support",   subtitle: "Unlock supplier reviews, daily deals & custom sourcing guarantee" },
  "SUPPLIER": { headline: "Unlimited Listings & Top Visibility", subtitle: "Get listing support, reach Free-tier buyers & priority placement" },
};

/* ═══════════════════════════════════════════════════
   SIDEBAR AVATAR UPLOAD — avatar component with upload
   ═══════════════════════════════════════════════════ */
function SidebarAvatarUpload({ children, className = "" }) {
  const [avatar, setAvatar] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target.result);
    reader.readAsDataURL(file);
    // PRODUCTION: POST /api/user/avatar with FormData
  };

  return (
    <div className="relative group flex flex-col items-center">
      {/* The avatar circle */}
      <div
        className={`relative cursor-pointer transition-transform duration-200 group-hover:scale-105 ${className}`}
        onClick={() => fileRef.current?.click()}
        role="button"
        aria-label="Upload profile photo"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
      >
        {avatar ? (
          <Image src={avatar} alt="Profile" fill className="rounded-full object-cover" sizes="100%" />
        ) : (
          children
        )}
        {/* Camera overlay — only on hover */}
        <div className="absolute inset-0 rounded-full bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[1]">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Camera size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Upload envelope — slides up with solid backdrop to avoid text bleed */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-4px)] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none z-50">
        <div className="bg-slate-800/85 backdrop-blur-sm rounded-xl shadow-xl pt-3 pb-2.5 px-4 text-center whitespace-nowrap border border-white/15">
          <p className="text-[11px] text-white font-semibold">Click to upload</p>
          <p className="text-[10px] text-white/60 mt-0.5">JPG, PNG or WebP. Max 5 MB</p>
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SIDEBAR NAV TOOLTIP — collapsed sidebar tooltip
   ═══════════════════════════════════════════════════ */
function SidebarNavTooltip({ children, label, collapsed, isActive, icon: Icon, href, badge }) {
  const [show, setShow] = useState(false);
  if (!collapsed) return children;
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className={show ? "invisible" : ""}>{children}</div>
      {show && (
        <Link
          href={href}
          className={`absolute left-0 top-0 bottom-0 flex items-center gap-2.5 px-3 rounded-lg whitespace-nowrap z-[60] text-sm font-semibold shadow-lg transition-colors cursor-pointer ${
            isActive
              ? "bg-white text-orange-600 border border-orange-200"
              : "bg-white text-slate-700 border border-slate-200 hover:text-orange-600"
          }`}
        >
          {Icon && <Icon size={16} className={isActive ? "text-orange-500 shrink-0" : "text-slate-400 shrink-0"} />}
          {label}
          {badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{badge}</span>}
        </Link>
      )}
    </div>
  );
}

/* ── Sidebar mini circular progress ring ── */
function SidebarProfileRing({ pct }) {
  const r = 16, stroke = 3.5, size = (r + stroke) * 2;
  const cx = r + stroke, cy = r + stroke;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      {/* Track ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} />
      {/* Progress arc — always white, high contrast on any tier gradient */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="white" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      {/* Percentage label */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="10" fontWeight="700"
        transform={`rotate(90, ${cx}, ${cy})`}>{pct}%</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   ACCOUNT SIDEBAR — User card + nav
   ═══════════════════════════════════════════════════ */
export function AccountSidebar({ user, activePage = "account-profile", collapsed = false, onToggle, profilePct: profilePctProp, accountPct: accountPctProp, profileSavedAt }) {
  /* ── Auto-collapse between md (768px) and xl (1280px) ──
     Start false to match SSR, then sync on mount to avoid hydration mismatch */
  const [forceCollapsed, setForceCollapsed] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
    setForceCollapsed(mql.matches);
    const handler = (e) => setForceCollapsed(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  const isCollapsed = forceCollapsed || collapsed;

  const sections = DASHBOARD_NAV_SECTIONS;

  const tc = TIER_CONFIG[user.tier] || TIER_CONFIG["FREE"];
  const TierIcon = tc.icon;
  const cta = TIER_CTA[user.tier] || TIER_CTA["FREE"];
  const hasSub = !!user.expiresOn;

  /* ── Profile completeness + staleness from localStorage (or live props) ── */
  const STALE_THRESHOLD = 30; // days

  // Account Profile panel
  const [storedAccountPct, setStoredAccountPct] = useState(null);
  const [accountDaysStale, setAccountDaysStale] = useState(null);
  const [accountLastUpdated, setAccountLastUpdated] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wup-account-profile-pct");
      if (raw != null) setStoredAccountPct(parseInt(raw, 10));
      const ts = localStorage.getItem("wup-account-profile-last-saved");
      if (ts) {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
          setAccountLastUpdated(d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
          setAccountDaysStale(Math.floor((Date.now() - d.getTime()) / 86_400_000));
        }
      }
    } catch {}
  }, []);
  const accountPct = (accountPctProp != null && activePage === "account-profile") ? accountPctProp : storedAccountPct;

  // Buyer/Supplier Profile panel
  const profileKey = user.isSupplier ? "supplier" : "buyer";
  const profileLabel = user.isSupplier ? "Supplier Profile" : "Buyer Profile";
  const profileHref = user.isSupplier ? "/dashboard/supplier-profile" : "/dashboard/buyer-profile";
  const [storedPct, setStoredPct] = useState(null);
  const [profileDaysStale, setProfileDaysStale] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`wup-${profileKey}-profile-pct`);
      if (raw != null) setStoredPct(parseInt(raw, 10));
      const ts = localStorage.getItem(`wup-${profileKey}-profile-last-saved`);
      if (ts) {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
          setLastUpdated(d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
          setProfileDaysStale(Math.floor((Date.now() - d.getTime()) / 86_400_000));
        }
      } else {
        setLastUpdated(null);
        setProfileDaysStale(null);
      }
    } catch {}
  }, [profileKey, profileSavedAt]);
  /* Only apply live prop when the active page matches the profile type, to avoid cross-contamination */
  const profilePageMatch = (profileKey === "buyer" && activePage === "buyer-profile") || (profileKey === "supplier" && activePage === "supplier-profile");
  const profilePct = (profilePctProp != null && profilePageMatch) ? profilePctProp : storedPct;

  /* ── Single container with smooth width transition ── */
  return (
    <div data-panel="account" className="hidden md:block relative shrink-0 sticky self-start z-20" style={{ top: 110 }}>
      <div
        className={`transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-72"} ${isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden scrollbar-hide"}`}
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <aside className={`transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-72"}`}>

          {/* ── Collapsed content ── */}
          <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden pointer-events-none"}`}>
            {/* Mini avatar — with edit overlay */}
            <div className="flex flex-col items-center">
              <div className="mb-3 pt-2">
                <SidebarAvatarUpload className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${tc.avatarBg}`}>
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs ${tc.avatarBg}`}>
                    {user.initials}
                  </div>
                </SidebarAvatarUpload>
              </div>
              <div className="w-8 h-px bg-slate-200 mb-2" />

              {/* Nav icons with tooltips */}
              <nav className="flex flex-col items-center w-full" aria-label="Dashboard navigation">
                {sections.map((section, si) => (
                  <div key={section.title} className="w-full">
                    {si > 0 && <div className="w-8 h-px bg-slate-200 mx-auto my-1.5" />}
                    {section.items.map((item) => {
                      const isActive = activePage === item.id;
                      return (
                        <SidebarNavTooltip
                          key={item.id}
                          label={item.label}
                          collapsed={true}
                          isActive={isActive}
                          icon={item.icon}
                          href={item.href}
                          badge={item.badge}
                        >
                          <Link
                            href={item.href}
                            className={`relative w-full flex items-center justify-center py-2.5 transition-colors ${
                              isActive ? "text-orange-500" : "text-slate-400 hover:text-orange-500"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                            aria-label={item.label}
                          >
                            <item.icon size={18} />
                            {item.badge && (
                              <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarNavTooltip>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* ── Expanded content ── */}
          <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? "opacity-0 h-0 overflow-hidden pointer-events-none" : "opacity-100 h-auto"}`}>
            {/* User Card — tier-colored gradient + decorative circles + glassmorphism */}
            <div className={`relative rounded-xl overflow-hidden mb-4 shadow-lg bg-gradient-to-br ${tc.cardGradient}`}>
              {/* Decorative white circles — same as UpgradeBanner */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-16 -right-10 w-44 h-44 bg-white rounded-full" />
                <div className="absolute bottom-8 -left-8 w-32 h-32 bg-white rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-white rounded-full" />
              </div>

              <div className="relative px-4 pt-6 pb-4">
                {/* Avatar — solid white ring, tier-colored inner, upload on hover */}
                <SidebarAvatarUpload className="w-16 h-16 rounded-full bg-white border-[3px] border-white shadow-lg flex items-center justify-center">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg ${tc.avatarBg}`}>
                    {user.initials}
                  </div>
                </SidebarAvatarUpload>

                {/* Name */}
                <h3 className="text-center font-bold text-white mt-2.5 whitespace-nowrap drop-shadow-sm">
                  {user.firstName} {user.lastName}
                </h3>

                {/* Tier badge — bg-white/20 backdrop-blur matching UpgradeBanner icon container */}
                <div className="flex items-center justify-center mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-white/20 backdrop-blur-sm text-white border border-white/20">
                    <TierIcon size={11} />
                    {user.tier}
                  </span>
                </div>

                {/* Details panel — bg-white/20 backdrop-blur matching UpgradeBanner */}
                <div className="mt-3 bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-3 space-y-2 text-[13px]">
                  {hasSub && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-white/80"><Calendar size={13} />Expires</span>
                        <span className="font-semibold text-white">{user.expiresOn}</span>
                      </div>
                    </>
                  )}
                  {user.memberSince && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/80"><Calendar size={13} />Member</span>
                      <span className="font-semibold text-white">since {user.memberSince}</span>
                    </div>
                  )}
                  {user.isSupplier && user.listingsCount != null && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/80"><Package size={13} />Listings</span>
                      <span className="font-semibold text-white">{user.listingsCount}</span>
                    </div>
                  )}
                </div>

                {/* ── Account Profile panel — always shown; hidden only if 100% AND fresh ── */}
                {(() => {
                  const pct = accountPct ?? 0;
                  const isStale = accountDaysStale != null && accountDaysStale >= STALE_THRESHOLD;
                  const isActive = activePage === "account-profile";
                  if (pct === 100 && !isStale) return null;
                  return (
                    <Link
                      href="/dashboard/account-profile"
                      className={`mt-3 flex items-center gap-3 backdrop-blur-sm border rounded-xl p-3 group transition-colors ${
                        isActive
                          ? "bg-white/35 border-white/40 ring-1 ring-white/30"
                          : isStale
                          ? "bg-amber-500/70 border-amber-400/80 hover:bg-amber-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                          : "bg-white/20 border-white/20 hover:bg-white/30"
                      }`}
                    >
                      <SidebarProfileRing pct={pct} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">
                          {pct === 100 ? "Account Profile complete" : `Account Profile ${pct}%`}
                        </p>
                        <p className="text-xs text-white/70 leading-tight mt-0.5">
                          {isStale
                            ? `Stale — ${accountDaysStale}d ago`
                            : accountLastUpdated ? `Updated ${accountLastUpdated}` : "Tap to complete"}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-white/50 group-hover:text-white/80 transition-colors shrink-0" />
                    </Link>
                  );
                })()}

                {/* ── Buyer / Supplier Profile panel — always shown; hidden only if 100% AND fresh ── */}
                {(() => {
                  const pct = profilePct ?? 0;
                  const isStale = profileDaysStale != null && profileDaysStale >= STALE_THRESHOLD;
                  const isActive = profilePageMatch && (activePage === "buyer-profile" || activePage === "supplier-profile");
                  if (pct === 100 && !isStale) return null;
                  return (
                    <Link
                      href={profileHref}
                      className={`mt-3 flex items-center gap-3 backdrop-blur-sm border rounded-xl p-3 group transition-colors ${
                        isActive
                          ? "bg-white/35 border-white/40 ring-1 ring-white/30"
                          : isStale
                          ? "bg-amber-500/70 border-amber-400/80 hover:bg-amber-500/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                          : "bg-white/20 border-white/20 hover:bg-white/30"
                      }`}
                    >
                      <SidebarProfileRing pct={pct} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight">
                          {pct === 100 ? `${profileLabel} complete` : `${profileLabel} ${pct}%`}
                        </p>
                        <p className="text-xs text-white/70 leading-tight mt-0.5">
                          {isStale
                            ? `Stale — ${profileDaysStale}d ago`
                            : lastUpdated ? `Updated ${lastUpdated}` : "Tap to complete"}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-white/50 group-hover:text-white/80 transition-colors shrink-0" />
                    </Link>
                  );
                })()}

                {/* CTA button — solid white matching UpgradeBanner */}
                <Link
                  href="/pricing"
                  className={`block mt-3 w-full py-2.5 text-center text-sm font-bold rounded-lg transition-colors whitespace-nowrap bg-white ${tc.ctaHover} ${tc.ctaText} shadow-sm`}
                >
                  {cta.label}
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm" aria-label="Dashboard navigation">
              {sections.map((section, si) => (
                <div key={section.title}>
                  {si > 0 && <div className="h-px bg-slate-100" />}
                  <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors whitespace-nowrap ${
                          isActive
                            ? "text-orange-600 bg-orange-50 font-semibold border-r-2 border-orange-500"
                            : "text-slate-600 hover:text-orange-600 hover:bg-slate-50"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon size={16} className={isActive ? "text-orange-500" : "text-slate-400"} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

        </aside>
      </div>
      {/* Toggle button — hidden at md-to-lg when auto-collapsed */}
      {!forceCollapsed && (
        <button
          onClick={onToggle}
          className={`absolute top-[52px] -right-4 w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-lg flex items-center justify-center transition-all z-10 ${isCollapsed ? "shadow-[2px_2px_4px_rgba(0,0,0,0.2)]" : ""}`}
          title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
        >
          <ChevronDown size={14} className={`text-white transition-transform duration-300 ${isCollapsed ? "-rotate-90" : "rotate-90"}`} />
        </button>
      )}
    </div>
  );
}

/* DASHBOARD NAV LINKS — imported from @/lib/dashboard-nav */

/* ═══════════════════════════════════════════════════
   MOBILE DASHBOARD NAV — "Go to:" dropdown below md
   Shows when AccountSidebar is completely hidden
   ═══════════════════════════════════════════════════ */
export function MobileDashboardNav({ activePage = "dashboard" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = DASHBOARD_NAV_LINKS.find((l) => l.id === activePage) || DASHBOARD_NAV_LINKS[0];
  const ActiveIcon = active.icon;

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="md:hidden mb-4 relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <ActiveIcon size={16} className="text-slate-400" />
          Go to: {active.label}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 -mt-px bg-white border border-slate-200 rounded-lg shadow-lg z-[50]">
          {DASHBOARD_NAV_LINKS.map((link, i) => {
            const isActive = link.id === activePage;
            const Icon = link.icon;
            return (
              <div key={link.id}>
                {i > 0 && <div className="h-px bg-slate-100" />}
                <Link
                  href={link.href}
                  className={`block w-full px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "text-orange-600 bg-orange-50 font-semibold"
                      : "text-slate-600 hover:text-orange-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-orange-500" : "text-slate-400"} />
                    {link.label}
                    {link.badge && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   UPGRADE BANNER — tier-specific upgrade CTA
   ═══════════════════════════════════════════════════ */
export function UpgradeBanner({ user }) {
  const topTiers = ["PREMIUM+", "SUPPLIER PRO"];
  if (topTiers.includes(user.tier)) return null;
  const tc = TIER_CONFIG[user.tier] || TIER_CONFIG["FREE"];
  const cta = TIER_CTA[user.tier] || TIER_CTA["FREE"];
  const copy = TIER_BANNER_COPY[user.tier] || TIER_BANNER_COPY["FREE"];
  return (
    <div className={`relative bg-gradient-to-r ${tc.bannerGradient} rounded-xl overflow-hidden shadow-lg mb-6`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full translate-y-1/2" />
      </div>
      <div className="relative flex items-center justify-between px-5 py-4 lg:px-6 lg:py-5 gap-4">
        <div className="flex items-center gap-3 lg:gap-4 min-w-0">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Sparkles size={24} className="text-white lg:hidden" />
            <Sparkles size={28} className="text-white hidden lg:block" />
          </div>
          <div>
            <p className="text-xl lg:text-2xl font-extrabold text-white">{copy.headline}</p>
            <p className={`${tc.bannerSubtext} text-xs lg:text-sm`}>{copy.subtitle}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-white/80 font-medium mb-1.5 hidden lg:block">Unlock All Features</p>
          <Link href="/pricing" className={`group inline-flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-white ${tc.ctaText} font-bold text-xs lg:text-sm rounded-xl ${tc.ctaHover} transition-all duration-200 shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.03] active:scale-95 ring-1 ring-white/30 whitespace-nowrap`}>
            {cta.bannerCta}
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED — session → user helper
   ═══════════════════════════════════════════════════ */
export function usePageUser() {
  const { data: session } = useSession();
  const { demoRole } = useDemoAuth();
  const sessionUser = useMemo(() => {
    if (!session?.user) return null;
    const { user } = session;
    const firstName = user.name?.split(" ")[0] || "";
    const lastName = user.name?.split(" ").slice(1).join(" ") || "";
    return {
      firstName,
      lastName,
      initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U",
      tier: (user.tier || "free").toUpperCase(),
      expiresOn: user.tierExpiresAt
        ? new Date(user.tierExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : null,
      email: user.email || "",
      gender: "female",
      isSupplier: false,
      memberSince: null,
      listingsCount: null,
    };
  }, [session]);
  // PRODUCTION: Remove demo user fallback — use sessionUser directly
  // Demo mode: pick user by demoRole; fall back to "standard" persona
  const demoUser = demoRole && USERS[demoRole] ? USERS[demoRole] : USERS["standard"];
  const user = sessionUser || demoUser;
  return user;
}

/* ═══════════════════════════════════════════════════
   PHASE 5 ACCOUNT DASHBOARD — Main dashboard page
   ═══════════════════════════════════════════════════ */
export default function Phase5AccountDashboard() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Dashboard" },
        ]} />
        <MobileDashboardNav activePage="dashboard" />

        <div className="flex gap-6 items-start">
          <AccountSidebar user={user} activePage="dashboard" collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />

            {/* Dashboard Summary — placeholder */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Welcome back, {user.firstName}. Your account summary will appear here.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Account Tier", value: user.tier, icon: Shield, color: "orange" },
                  { label: "Member Since", value: "Jan 2024", icon: Calendar, color: "blue" },
                  { label: "Saved Deals", value: "12", icon: Heart, color: "pink" },
                ].map((card) => (
                  <div key={card.label} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      card.color === "orange" ? "bg-orange-100 text-orange-600" :
                      card.color === "blue" ? "bg-blue-100 text-blue-600" :
                      "bg-pink-100 text-pink-600"
                    }`}>
                      <card.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                      <p className="text-sm font-bold text-slate-800">{card.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
                <p className="text-xs text-slate-400 text-center">Full dashboard summary — orders, messages, recent activity — coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RE-EXPORTS FOR BACKWARD COMPATIBILITY
   Other pages import these from dashboard.jsx
   ═══════════════════════════════════════════════════ */
export {
  FlagImg,
  useDropdown,
  FloatingField,
  FloatingSelect,
  FloatingTextarea,
  CountrySelect,
  FormSection,
  TabStatus,
  ProfileTabBar,
  ErrorSummaryPanel,
  useFocusTrap,
  COUNTRIES,
  CURRENCIES,
  PHONE_CODES,
  LANGUAGES,
  HelpTooltip,
  PhoneInput,
  LanguageSelector,
  MultiSelect,
  TabProgressBadge,
  PHONE_RULES,
  PHONE_PLACEHOLDERS,
  /* Shared form components (used by buyer-profile + supplier-profile) */
  CURRENCY_SYMBOLS,
  useHeaderCurrency,
  CurrencyAmountInput,
  PRODUCT_CATEGORY_TREE,
  CategorySelector,
  BrandPillInput,
  ImageUploadPlaceholder,
  BusinessHoursGrid,
  DEFAULT_BUSINESS_HOURS,
  TAX_CLASS_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  SANITIZED_INVOICE_OPTIONS,
  INCOTERMS_OPTIONS,
  FloatingDatePicker,
} from "@/components/shared/form-fields";

export { AccountProfilePage } from "./account-profile";
