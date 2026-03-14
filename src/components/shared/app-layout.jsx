"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/shared/auth-modal";
import Footer from "@/components/shared/footer";
import DotWorldMap from "@/components/shared/dot-world-map";
import { RotatingStatsTicker } from "@/components/shared/rotating-stats-ticker";
import { WholesaleUpIcon, WholesaleUpLogo } from "@/components/shared/logo";
import { useVisibilityInterval } from "@/components/shared/use-visibility-interval";
import { LastLoginToast } from "@/components/shared/auth-ui";
import { usePathname, useRouter } from "next/navigation";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import CookieConsent from "@/components/shared/cookie-consent";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  Heart,
  Store,
  Package,
  PlusCircle,
  Coins,
  Headphones,
  Settings,
  LogOut,
  Globe,
  Mail,
  HelpCircle,
  Crown,
  Shield,
  Clock,
  Bell,
  BookOpen,
  Home,
  SlidersHorizontal,
  Building2,
  CreditCard,
  Shirt,
  Sparkles,
  Flower2,
  Watch,
  Gamepad2,
  Dumbbell,
  Boxes,
  Tv,
  Baby,
  ThumbsUp,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  Link2,
  Archive,
  CheckCircle2,
  AlertCircle,
  ImageOff,
  LogIn,
  Zap,
  ArrowRight,
  Star,
  Gift,
  UserPlus,
  KeyRound,
  Newspaper,
  Car,
  UtensilsCrossed,
  PawPrint,
  Gavel,
} from "lucide-react";
import { CATEGORY_TREE, CATEGORY_NAMES } from "@/lib/categories";
import { DASHBOARD_NAV_LINKS } from "@/lib/dashboard-nav";
// DotLottieReact removed — using text logo instead

/* ─────────────── Auth Context (H9: real session) ──────────
   User data sourced from NextAuth session via useSession().
   M10: Subscription dates from user.tierExpiresAt in the JWT.
   ────────────────────────────────────────────────────────── */

/* Active offer discount — single source of truth for footer badge + exit-intent popup.
   Will be replaced by a backend/admin-settings fetch in production. */
const ACTIVE_OFFER_DISCOUNT = 25;

/* Demo users — mirrors dashboard.jsx USERS for sidebar display when a demo role is active */
const DEMO_USERS = {
  "free":             { firstName: "Sarah",    lastName: "Mitchell",   initials: "SM", tier: "FREE" },
  "standard":         { firstName: "Jennifer", lastName: "Lawrence",   initials: "JL", tier: "STANDARD" },
  "premium":          { firstName: "Anand",    lastName: "Kumar",      initials: "AK", tier: "PREMIUM" },
  "premium-plus":     { firstName: "Michael",  lastName: "Chen",       initials: "MC", tier: "PREMIUM+" },
  "supplier-free":    { firstName: "Lisa",     lastName: "Thompson",   initials: "LT", tier: "SUPPLIER" },
  "supplier-premium": { firstName: "David",    lastName: "Richardson", initials: "DR", tier: "SUPPLIER PRO" },
};

const FALLBACK_USER = {
  firstName: "Guest",
  lastName: "",
  initials: "G",
  tier: "FREE",
  expiresOn: null,
  email: "",
};

function useLayoutUser() {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading" || !session?.user) return { user: FALLBACK_USER, status };
    const { user } = session;
    const firstName = user.name?.split(" ")[0] || "";
    const lastName = user.name?.split(" ").slice(1).join(" ") || "";
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
    return {
      user: {
        firstName,
        lastName,
        initials,
        tier: (user.tier || "free").toUpperCase(),
        expiresOn: user.tierExpiresAt
          ? new Date(user.tierExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : null,
        email: user.email || "",
        image: user.image || null,
        username: user.username || "",
      },
      status,
    };
  }, [session, status]);
}

/* ─────────────── Currency Options ─────────────── */
const CURRENCIES = [
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "CAD", symbol: "C$", label: "CAD" },
  { code: "AUD", symbol: "A$", label: "AUD" },
];

/* ─────────────── Sidebar Navigation ─────────────── */
const SIDEBAR_LINKS = [
  { label: "Home", href: "/homepage", icon: Home },
  { label: "Deals", href: "/deals", icon: Package },
  { label: "Single Deal", href: "/deal", icon: Package },
  { label: "Suppliers", href: "/suppliers", icon: Building2 },
  { label: "Supplier Profile", href: "/supplier", icon: Store },
  { label: "Liquidators", href: "/suppliers/liquidators", icon: Gavel },
  { label: "Dropshippers", href: "/suppliers/dropshippers", icon: Boxes },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Gating", href: "/gating", icon: Shield },
];

/* ─────────────── Category SVG Illustrations (tight viewBox) ─────────────── */
const CATEGORY_ILLUSTRATIONS = {
  "Clothing & Fashion": (<svg viewBox="25 17 50 61" fill="none" className="w-full h-full"><path d="M35 25L42 20H58L65 25L72 35L65 38L60 30V75H40V30L35 38L28 35L35 25Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M42 20C42 20 45 28 50 28C55 28 58 20 58 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="40" y1="45" x2="60" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="50" cy="55" r="2" fill="currentColor"/><circle cx="50" cy="63" r="2" fill="currentColor"/></svg>),
  "Health & Beauty": (<svg viewBox="18 16 64 68" fill="none" className="w-full h-full"><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(72 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(144 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(216 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(288 50 48)" /><circle cx="50" cy="48" r="5" fill="currentColor" /></svg>),
  "Home & Garden": (<svg viewBox="14 24 78 58" fill="none" className="w-full h-full"><path d="M18 50L45 27L72 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="26" y="50" width="38" height="28" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="39" y="60" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="30" y="55" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M43 78V68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="76" cy="54" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="84" cy="54" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="80" cy="47" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M80 61V78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  "Electronics & Technology": (<svg viewBox="19 25 62 46" fill="none" className="w-full h-full"><rect x="22" y="28" width="56" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="26" y="32" width="48" height="26" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M38 68H62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M44 64V68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M56 64V68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M35 42L42 48L55 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>),
  "Toys & Games": (<svg viewBox="20 14 56 70" fill="none" className="w-full h-full"><path d="M50 18L76 33L50 48L24 33Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><path d="M24 33L50 48L50 80L24 65Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><path d="M50 48L76 33L76 65L50 80Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><circle cx="50" cy="33" r="2.5" fill="currentColor"/><circle cx="40" cy="47" r="2.5" fill="currentColor"/><circle cx="34" cy="63" r="2.5" fill="currentColor"/><circle cx="66" cy="44" r="2.5" fill="currentColor"/><circle cx="63" cy="54" r="2.5" fill="currentColor"/><circle cx="60" cy="64" r="2.5" fill="currentColor"/></svg>),
  "Gifts & Seasonal": (<svg viewBox="22 18 56 64" fill="none" className="w-full h-full"><rect x="28" y="38" width="44" height="38" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M50 38V76" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M28 52H72" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M50 38C50 38 40 38 36 32C32 26 38 20 44 24C48 27 50 38 50 38Z" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M50 38C50 38 60 38 64 32C68 26 62 20 56 24C52 27 50 38 50 38Z" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "Sports & Outdoors": (<svg viewBox="17 35 66 30" fill="none" className="w-full h-full"><path d="M22 50H78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/><rect x="28" y="38" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="64" y="38" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="20" y="42" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="74" y="42" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "Jewellery & Watches": (<svg viewBox="26 23 48 54" fill="none" className="w-full h-full"><circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M50 38V50L58 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="44" y="26" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="44" y="68" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="50" cy="50" r="2" fill="currentColor"/></svg>),
  "Food & Beverages": (<svg viewBox="22 18 56 64" fill="none" className="w-full h-full"><path d="M36 22V42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M36 42C36 42 28 44 28 52C28 60 36 62 36 62V78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M56 22V26C56 30 60 32 60 38C60 44 56 46 56 46V78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M64 22V26C64 30 60 32 60 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M72 22V26C72 30 66 34 64 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>),
  "Pet Supplies": (<svg viewBox="20 20 60 60" fill="none" className="w-full h-full"><circle cx="40" cy="40" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="60" cy="40" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="34" cy="56" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="66" cy="56" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><ellipse cx="50" cy="62" rx="12" ry="10" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "Baby & Kids": (<svg viewBox="34 12 32 66" fill="none" className="w-full h-full"><path d="M44 25C44 18 47 14 50 14C53 14 56 18 56 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><rect x="40" y="25" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="36" y="31" width="28" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M40 45H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M40 55H46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M40 65H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  "Surplus & Clearance": (<svg viewBox="19 22 62 54" fill="none" className="w-full h-full"><rect x="22" y="45" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="52" y="45" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="37" y="25" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M35 56H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M65 56H78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M50 36H63" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 72H78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/></svg>),
  "Automotive & Parts": (<svg viewBox="14 30 72 40" fill="none" className="w-full h-full"><path d="M28 55L32 42C34 38 38 36 42 36H58C62 36 66 38 68 42L72 55" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="22" y="55" width="56" height="16" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="34" cy="71" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="66" cy="71" r="6" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M40 47H60" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="28" cy="59" r="2" fill="currentColor"/><circle cx="72" cy="59" r="2" fill="currentColor"/></svg>),
};

/* ─────────────── Category icon mapping (Lucide icons for mobile/compact views) ─────────────── */
const CATEGORY_ICONS = {
  "Clothing & Fashion": Shirt,
  "Health & Beauty": Sparkles,
  "Home & Garden": Flower2,
  "Electronics & Technology": Tv,
  "Toys & Games": Gamepad2,
  "Gifts & Seasonal": Gift,
  "Sports & Outdoors": Dumbbell,
  "Jewellery & Watches": Watch,
  "Food & Beverages": UtensilsCrossed,
  "Pet Supplies": PawPrint,
  "Baby & Kids": Baby,
  "Surplus & Clearance": Boxes,
  "Automotive & Parts": Car,
};

/* ─────────────── Categories Data — derived from canonical CATEGORY_TREE ─────────────── */
const CATEGORY_LIST = CATEGORY_TREE.map((cat) => ({
  name: cat.name,
  icon: CATEGORY_ICONS[cat.name] || Package,
  href: cat.href,
  subs: cat.subs.map((s) => ({ label: s.label, href: `/deals/${cat.id}/${s.id}` })),
}));

/* ─────────────── Section Nav Links ─────────────── */
const SECTION_NAV_LINKS = [
  { label: "Deals", href: "/deals" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Liquidators", href: "/suppliers/liquidators" },
  { label: "Dropshippers", href: "/suppliers/dropshippers" },
];

/* DASHBOARD_NAV_LINKS — imported from @/lib/dashboard-nav */

/* ─────────────── Dropdown Hook ─────────────── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return { open, setOpen, ref };
}

/* ═══════════════════════════════════════════════════
   SIDEBAR — Collapsible left navigation (sitewide)
   ═══════════════════════════════════════════════════ */
function SidebarTooltip({ children, label, collapsed, isActive, icon: Icon, href, onClick, variant }) {
  const [show, setShow] = useState(false);
  if (!collapsed) return children;
  const isCta = variant === "cta";
  const expandedClasses = `absolute left-0 top-0 bottom-0 flex items-center gap-3 px-3 rounded-lg whitespace-nowrap z-[60] text-sm font-semibold shadow-lg transition-colors cursor-pointer ${
    isCta
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : isActive
        ? "bg-slate-800 text-orange-400 border border-orange-500/30"
        : "bg-slate-800 text-white hover:bg-slate-700"
  }`;
  const iconClasses = isCta ? "shrink-0 text-white" : `shrink-0 ${isActive ? "text-orange-400" : "text-slate-400"}`;
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* The original icon-only child (always rendered, invisible when hovered) */}
      <div className={show ? "invisible" : ""}>{children}</div>
      {/* Expanded row overlay — icon + label slide out as one unified row */}
      {show && (
        href ? (
          <Link href={href} scroll={true} onClick={() => window.scrollTo({ top: 0 })} className={expandedClasses}>
            {Icon && <Icon size={18} className={iconClasses} />}
            {label}
          </Link>
        ) : (
          <button type="button" onClick={onClick} className={expandedClasses}>
            {Icon && <Icon size={18} className={iconClasses} />}
            {label}
          </button>
        )
      )}
    </div>
  );
}

function Sidebar({ isAuthenticated, user, onLogin, onLogout, collapsed, onToggle }) {
  const pathname = usePathname();
  return (
    <aside
      data-panel="nav"
      className={`hidden xl:flex flex-col bg-slate-900 shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out overflow-visible ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className={`flex flex-col h-full ${collapsed ? "w-16" : "w-64"} transition-all duration-300 ${collapsed ? "overflow-visible" : "overflow-hidden"}`}>
        {/* Sidebar Header: Rotating stats + Logo */}
        <div>
          {/* Rotating stats ticker — text hidden when collapsed, bar kept for alignment */}
          <div data-sidebar-ticker className="bg-slate-900 px-3 h-9 flex items-center justify-center">
            {!collapsed && <RotatingStatsTicker />}
          </div>
          {/* Logo — matches header Row 2 height (h-14)
               BOTH variants always rendered so the CSS flash-prevention overrides
               can show/hide the correct one before React hydration. */}
          <div data-sidebar-logo-area className={`h-14 flex items-center justify-center ${collapsed ? "px-2" : "px-6"}`}>
            <span data-sidebar-logo-full className={collapsed ? "hidden" : ""}><WholesaleUpLogo /></span>
            <span data-sidebar-logo-collapsed className={collapsed ? "" : "hidden"}>
              <Link href="/" className="flex items-center justify-center">
                <WholesaleUpIcon className="w-8 h-8" />
              </Link>
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-1 ${collapsed ? "overflow-visible" : "overflow-y-auto thin-scrollbar"} py-4 ${collapsed ? "px-2" : "px-3"} space-y-1`}>
          {SIDEBAR_LINKS.map((link) => {
            /* Sub-routes that are their own sidebar items — must NOT highlight the parent "Suppliers" link */
            const SUPPLIERS_OWN_ROUTES = ["/suppliers/liquidators", "/suppliers/dropshippers"];
            const isActive = link.href === "/deals"
              ? pathname === link.href || pathname.startsWith(link.href + "/")
              : link.href === "/suppliers"
                ? (pathname === link.href || pathname.startsWith(link.href + "/")) && !SUPPLIERS_OWN_ROUTES.some((r) => pathname.startsWith(r))
                : pathname === link.href;
            /* Contextual hrefs: if on /deals/clothing-fashion?keywords=X, the Suppliers link → /suppliers/clothing-fashion?keywords=X and vice versa.
               Skip contextual rewriting when on an own-route (liquidators/dropshippers) — those aren't categories. */
            let contextualHref = link.href;
            if (link.href === "/deals" || link.href === "/suppliers") {
              const onOwnRoute = SUPPLIERS_OWN_ROUTES.some((r) => pathname.startsWith(r));
              const dealsMatch = pathname.match(/^\/deals(\/[^?]+)?/);
              const suppliersMatch = !onOwnRoute ? pathname.match(/^\/suppliers(\/[^?]+)?/) : null;
              const categorySuffix = dealsMatch?.[1] || suppliersMatch?.[1] || "";
              if (categorySuffix) contextualHref = link.href + categorySuffix;
              const qs = typeof window !== "undefined" ? window.location.search : "";
              if (qs) contextualHref += qs;
            }
            return (
              <SidebarTooltip key={link.href} label={link.label} collapsed={collapsed} isActive={isActive} icon={link.icon} href={contextualHref}>
                <Link
                  href={contextualHref}
                  scroll={true}
                  onClick={() => window.scrollTo({ top: 0 })}
                  className={`flex items-center ${collapsed ? "justify-center w-full px-0 py-2.5" : "gap-3 px-3 py-2.5"} rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? collapsed
                        ? "bg-slate-800 text-orange-400 border border-orange-500/30"
                        : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <link.icon size={18} className={`shrink-0 ${isActive ? "text-orange-400" : "text-slate-500"}`} />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              </SidebarTooltip>
            );
          })}

          {/* MY ACCOUNT section — visible when authenticated, hidden on /dashboard pages */}
          {isAuthenticated && !pathname.startsWith("/dashboard") && (
            <>
              <div className={`h-px bg-slate-800 my-3 ${collapsed ? "mx-1" : "mx-3"}`} />
              {!collapsed && (
                <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  My Account
                </p>
              )}
              {[
                { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { label: "Account Profile", href: "/dashboard/account-profile", icon: User },
                { label: "Orders", href: "/dashboard", icon: ShoppingBag },
                { label: "My Favourites", href: "/favourites", icon: Heart },
                { label: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
                { label: "Billing", href: "/dashboard", icon: Settings },
              ].map((link) => {
                const isLinkActive = pathname === link.href;
                return (
                  <SidebarTooltip key={link.label} label={link.label} collapsed={collapsed} icon={link.icon} href={link.href}>
                    <Link
                      href={link.href}
                      scroll={true}
                      onClick={() => window.scrollTo({ top: 0 })}
                      className={`flex items-center ${collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"} rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive
                          ? collapsed
                            ? "bg-slate-800 text-orange-400 border border-orange-500/30"
                            : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <link.icon size={18} className={`shrink-0 ${isLinkActive ? "text-orange-400" : "text-slate-500"}`} />
                      {!collapsed && <span className="flex-1">{link.label}</span>}
                      {!collapsed && link.badge && (
                        <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarTooltip>
                );
              })}
            </>
          )}
        </nav>

        {/* Bottom: User / Login — sticky at bottom */}
        <div className={`${collapsed ? "px-2" : "px-3"} pb-5 mt-auto`}>
          {isAuthenticated ? (
            <SidebarTooltip label={`${user.firstName} — ${user.tier}`} collapsed={collapsed} href="/dashboard">
              <div className={`relative flex items-center ${collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-2.5 py-2.5"} rounded-lg bg-slate-800 group`}>
                {/* Clickable area → Dashboard */}
                <Link href="/dashboard" className="absolute inset-0 rounded-lg z-0" aria-label={`${user.firstName}'s dashboard`} />
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0 relative z-[1] pointer-events-none">
                  {user.initials}
                </div>
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 relative z-[1] pointer-events-none">
                      <p className="text-sm font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{user.tier}</p>
                    </div>
                    {/* Logout icon — stops propagation so Link doesn't fire */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLogout(); }}
                      className="relative z-[2] p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Sign Out"
                      aria-label="Sign out"
                    >
                      <LogOut size={14} />
                    </button>
                  </>
                )}
              </div>
            </SidebarTooltip>
          ) : (
            <SidebarTooltip label="Log In / Join Free" collapsed={collapsed} onClick={onLogin} icon={LogIn} variant="cta">
              <button
                onClick={onLogin}
                className={`${collapsed ? "w-10 h-10 p-0 flex items-center justify-center mx-auto cursor-pointer" : "w-full px-4 py-2.5"} text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all`}
              >
                {collapsed ? <LogIn size={18} /> : <span>Log In / Join Free</span>}
              </button>
            </SidebarTooltip>
          )}
        </div>
      </div>

      {/* Collapse toggle button — narrow vertical bar on the right edge */}
      <button
        onClick={onToggle}
        className={`absolute -right-4 top-[128px] w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-lg flex items-center justify-center transition-colors z-50 ${collapsed ? "shadow-[2px_2px_4px_rgba(0,0,0,0.2)]" : ""}`}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronDown size={14} className={`text-white ${collapsed ? "-rotate-90" : "rotate-90"}`} />
      </button>
    </aside>
  );
}

/* SidebarExpandButton removed — collapsed sidebar now always visible with icon-only mode */

/* ═══════════════════════════════════════════════════
   HEADER — Top bar with For buyers/sellers, search, auth
   ═══════════════════════════════════════════════════ */
const DEMO_CATEGORIES = [
  { key: "electronics-technology", label: "Electronics & Technology", icon: Tv },
  { key: "clothing-fashion", label: "Clothing & Fashion", icon: Shirt },
  { key: "health-beauty", label: "Health & Beauty", icon: Flower2 },
  { key: "home-garden", label: "Home & Garden", icon: Home },
  { key: "toys-games", label: "Toys & Games", icon: Gamepad2 },
  { key: "gifts-seasonal", label: "Gifts & Seasonal", icon: Gift },
  { key: "sports-outdoors", label: "Sports & Outdoors", icon: Dumbbell },
  { key: "jewellery-watches", label: "Jewellery & Watches", icon: Watch },
  { key: "food-beverages", label: "Food & Beverages", icon: UtensilsCrossed },
  { key: "pet-supplies", label: "Pet Supplies", icon: PawPrint },
  { key: "baby-kids", label: "Baby & Kids", icon: Baby },
  { key: "surplus-clearance", label: "Surplus & Clearance", icon: Boxes },
  { key: "automotive-parts", label: "Automotive & Parts", icon: Car },
];

function Header({ isAuthenticated, isPremium, user, onLogin, onRegister, onLogout, currency, setCurrency, onMobileNavToggle, onSetDemoRole, demoRole, demoCategory, onSetDemoCategory, demoSupplierPro, onSetDemoSupplierPro, demoDealStatus, onSetDemoDealStatus, sidebarCollapsed }) {
  const userDd = useDropdown();
  const currencyDd = useDropdown();
  const buyersDd = useDropdown();
  const sellersDd = useDropdown();
  const demoDd = useDropdown();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full bg-slate-900 sticky top-0 z-40">
      {/* Row 1: Utility bar — visible on all screen sizes */}
      <div className="bg-slate-950 text-slate-300 text-[13px]">
        <div className={`${sidebarCollapsed ? "px-3 xl:px-3" : "px-4 sm:px-6"} flex items-center justify-between h-9`}>
          <div className="flex items-center gap-2 sm:gap-4 xl:pl-3">
            {/* For Buyers Dropdown — xl:pl-3 aligns "For retailers" with the
                ≡ icon inside the Categories button in Row 2 (which has px-3). */}
            <div ref={buyersDd.ref} className="relative">
              <button onClick={() => buyersDd.setOpen(!buyersDd.open)}
                className={`flex items-center gap-1 font-medium transition-colors ${buyersDd.open ? "text-orange-300" : "text-orange-400 hover:text-orange-300"}`}
                aria-label="Options for retailers"
                aria-expanded={buyersDd.open}
                aria-haspopup="true">
                <span className="hidden sm:inline">For retailers</span><span className="sm:hidden">Retailers</span> <ChevronDown size={12} className={`transition-transform ${buyersDd.open ? "rotate-180" : ""}`} />
              </button>
              {buyersDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[170px]" role="menu" aria-label="Retailer options">
                  <a href="/benefits" role="menuitem" className="block px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Retailer Benefits</a>
                  <a href="/register" role="menuitem" className="block px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Register</a>
                </div>
              )}
            </div>
            {/* Separator */}
            <span className="hidden sm:block w-px h-3 bg-slate-700" aria-hidden="true" />
            {/* For Sellers Dropdown */}
            <div ref={sellersDd.ref} className="relative">
              <button onClick={() => sellersDd.setOpen(!sellersDd.open)}
                className={`flex items-center gap-1 font-medium transition-colors ${sellersDd.open ? "text-emerald-300" : "text-emerald-400 hover:text-emerald-300"}`}
                aria-label="Options for suppliers"
                aria-expanded={sellersDd.open}
                aria-haspopup="true">
                <span className="hidden sm:inline">For suppliers</span><span className="sm:hidden">Suppliers</span> <ChevronDown size={12} className={`transition-transform ${sellersDd.open ? "rotate-180" : ""}`} />
              </button>
              {sellersDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[170px]" role="menu" aria-label="Supplier options">
                  <a href="/supplier-benefits" role="menuitem" className="block px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Supplier Benefits</a>
                  <a href="/get-listed" role="menuitem" className="block px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Get Listed</a>
                </div>
              )}
            </div>
            {/* Separator */}
            <span className="hidden sm:block w-px h-3 bg-slate-700" aria-hidden="true" />
            <a href="/help" className="flex items-center gap-1 font-medium text-slate-400 hover:text-white transition-colors" aria-label="Help center"><HelpCircle size={12} /> Help</a>
            {/* Demo mode dropdown */}
            <div ref={demoDd.ref} className="relative hidden sm:block">
              <button onClick={() => demoDd.setOpen(!demoDd.open)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold transition-all duration-150 active:scale-95 ${demoDd.open ? "bg-slate-700 text-amber-300" : "bg-slate-800 text-amber-400 hover:text-amber-300"}`}
                aria-label="Demo mode switcher"
                aria-expanded={demoDd.open}
                aria-haspopup="true">
                <SlidersHorizontal size={10} /> Demo <ChevronDown size={14} className={`transition-transform ${demoDd.open ? "rotate-180" : ""}`} />
              </button>
              {demoDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 min-w-[220px] max-h-[70vh] overflow-y-auto thin-scrollbar" role="menu" aria-label="Demo mode options">
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">View as</p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { role: "guest", label: "Guest" },
                      { role: "free", label: "Free" },
                      { role: "standard", label: "Standard" },
                      { role: "premium", label: "Premium" },
                      { role: "premium-plus", label: "Premium+" },
                      { role: "supplier-free", label: "Supplier Free" },
                      { role: "supplier-premium", label: "Supplier Premium" },
                    ].map((item) => (
                      <button key={item.role} onClick={() => { onSetDemoRole(item.role); demoDd.setOpen(false); }} role="menuitem"
                        className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${demoRole === item.role ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</button>
                    ))}
                  </div>
                  <div className="my-1.5 border-t border-slate-100" />
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product type</p>
                  <div className="flex flex-col gap-0.5">
                    {DEMO_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button key={cat.key} onClick={() => { onSetDemoCategory(cat.key); demoDd.setOpen(false); }} role="menuitem"
                          className={`flex items-center gap-2 text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${demoCategory === cat.key ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-50"}`}>
                          <Icon size={13} className="shrink-0" /> {cat.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="my-1.5 border-t border-slate-100" />
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listing tier</p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { value: false, label: "Supplier Free" },
                      { value: true, label: "Supplier Pro" },
                    ].map((item) => (
                      <button key={String(item.value)} onClick={() => { onSetDemoSupplierPro(item.value); demoDd.setOpen(false); }} role="menuitem"
                        className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${demoSupplierPro === item.value ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</button>
                    ))}
                  </div>
                  <div className="my-1.5 border-t border-slate-100" />
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deal status</p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { value: "live", label: "Live Deal" },
                      { value: "sold-out", label: "Sold Out Deal" },
                    ].map((item) => (
                      <button key={item.value} onClick={() => { onSetDemoDealStatus(item.value); demoDd.setOpen(false); }} role="menuitem"
                        className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${demoDealStatus === item.value ? "bg-red-50 text-red-700" : "text-slate-600 hover:bg-slate-50"}`}>{item.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <a href="/a-z" className="flex items-center gap-1 hover:text-white transition-colors" aria-label="Browse A-Z supplier index"><BookOpen size={12} /> <span className="hidden sm:inline">A-Z Index</span><span className="sm:hidden">A-Z</span></a>
            <div className="w-px h-3.5 bg-slate-700" aria-hidden="true" />
            <div ref={currencyDd.ref} className="relative">
              <button onClick={() => currencyDd.setOpen(!currencyDd.open)}
                className={`flex items-center gap-1 font-medium transition-colors ${currencyDd.open ? "text-white" : "hover:text-white"}`}
                aria-label={`Currency: ${currency.code}`}
                aria-expanded={currencyDd.open}
                aria-haspopup="listbox">
                <Globe size={12} /> {currency.code} <ChevronDown size={14} className={`transition-transform ${currencyDd.open ? "rotate-180" : ""}`} />
              </button>
              {currencyDd.open && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[110px]" role="listbox" aria-label="Select currency">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => { setCurrency(c); currencyDd.setOpen(false); }}
                      role="option"
                      aria-selected={currency.code === c.code}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${currency.code === c.code ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-3.5 bg-slate-700 hidden md:block" aria-hidden="true" />
            <a href="mailto:service@wholesaleup.com" className="hidden md:flex items-center gap-1 hover:text-white transition-colors" aria-label="Email support">
              <Mail size={12} /> service@wholesaleup.com
            </a>
          </div>
        </div>
      </div>

      {/* Row 2: Logo (mobile) + Search + Auth */}
      <div className="px-4 sm:px-6 border-b border-slate-800">
        <div className="flex items-center gap-3 h-14">
          {/* Mobile hamburger + logo — visible only when sidebar is hidden */}
          <div className="xl:hidden flex items-center gap-2 shrink-0">
            <button
              onClick={onMobileNavToggle}
              className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 rounded-lg transition-all duration-150"
              aria-label="Open navigation"
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            <WholesaleUpLogo size="small" />
          </div>

          {/* Categories Button (desktop) */}
          <CategoriesButton />

          {/* Search Bar (desktop) */}
          <div className="hidden xl:flex flex-1 mx-4">
            <HeaderSearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-0.5 sm:gap-1 ml-auto shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="xl:hidden w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 rounded-lg transition-all duration-150"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            {/* Favourites */}
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 rounded-lg transition-all duration-150 relative"
              aria-label="Favourites"
            >
              <Heart size={20} />
              <span className="absolute top-1 right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">5</span>
            </button>
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 rounded-lg transition-all duration-150 relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">3</span>
                </button>
                {/* User avatar */}
                <div ref={userDd.ref} className="relative">
                  <button onClick={() => userDd.setOpen(!userDd.open)}
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-lg hover:bg-slate-800 active:scale-95 transition-all duration-150"
                    aria-label="Account menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">{user.initials}</div>
                    <span className="hidden sm:inline text-sm font-semibold text-slate-200">{user.firstName}</span>
                    <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform ${userDd.open ? "rotate-180" : ""}`} />
                  </button>
                  {userDd.open && <UserDropdownMenu user={user} onLogout={onLogout} onClose={() => userDd.setOpen(false)} />}
                </div>
              </>
            ) : (
              <LoginDropdown onLogin={onLogin} onRegister={onRegister} />
            )}
            {/* Enquiry List */}
            <button
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 rounded-lg transition-all duration-150 relative"
              aria-label="Enquiry list"
            >
              <ClipboardList size={20} />
              <span className="absolute top-1 right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar — slides open below header */}
      {mobileSearchOpen && (
        <div className="xl:hidden px-4 py-3 border-b border-slate-800 bg-slate-900">
          <HeaderSearchBar mobile />
        </div>
      )}

    </header>
  );
}

/* ═══════════════════════════════════════════════════
   LOGIN DROPDOWN — hover panel with menu sections
   ═══════════════════════════════════════════════════ */
function LoginDropdown({ onLogin, onRegister }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  const handleEnter = () => { clearTimeout(timeout.current); setOpen(true); };
  const handleLeave = () => { timeout.current = setTimeout(() => setOpen(false), 200); };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => { document.removeEventListener("mousedown", handler); clearTimeout(timeout.current); };
  }, []);

  const menuSections = [
    {
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Account Profile", icon: Settings, href: "/dashboard/account-profile" },
        { label: "Messages", icon: MessageSquare, href: "/messages" },
      ],
    },
    {
      title: "Buyers Tools",
      items: [
        { label: "Buyer Profile", icon: ClipboardList, href: "/dashboard/buyer-profile" },
        { label: "My Pre-Orders", icon: Clock, href: "/pre-orders" },
        { label: "My Favorites", icon: Heart, href: "/favorites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { label: "Supplier Profile", icon: Store, href: "/dashboard/supplier-profile" },
        { label: "Manage Deals", icon: Archive, href: "/manage-deals" },
        { label: "Add New Deal", icon: PlusCircle, href: "/add-deal" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Affiliate Program", icon: Link2, href: "/affiliate" },
        { label: "Custom Sourcing", icon: Package, href: "/sourcing" },
      ],
    },
  ];

  return (
    <div className="relative flex items-center gap-1 sm:gap-2">
      <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <a href="/register#login" onClick={(e) => { e.preventDefault(); onLogin(); }}
          className="inline-flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 sm:border sm:border-slate-600 sm:hover:border-orange-400 sm:hover:text-orange-400 sm:hover:bg-transparent rounded-lg sm:rounded-full active:scale-95 transition-all duration-150"
          aria-label="Log In"
        >
          <User size={20} className="text-slate-400" /> <span className="hidden sm:inline">Log In</span>
        </a>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
               onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          {menuSections.map((section, si) => (
            <div key={si} className={si > 0 ? "border-t border-slate-100" : ""}>
              {section.title && (
                <p className="px-4 pt-3 pb-1 text-xs font-bold text-orange-500 uppercase tracking-wider">{section.title}</p>
              )}
              <div className={section.title ? "pb-2" : "py-2"}>
                {section.items.map((item) => (
                  <a key={item.label} href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    <item.icon size={16} className="text-slate-400" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          {/* Help Center at bottom */}
          <div className="border-t border-slate-100 py-2">
            <a href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
              <HelpCircle size={16} className="text-slate-400" />
              Help Center
            </a>
          </div>
        </div>
      )}
      </div>
      <button onClick={onRegister}
        className="inline-flex items-center justify-center h-10 px-3.5 sm:px-5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-full transition-all duration-150 shadow-sm"
        aria-label="Join Free"
      >
        <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join Free</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER SEARCH BAR — shared between desktop & mobile
   ═══════════════════════════════════════════════════ */
const SEARCH_RECENT = [
  "Calvin Klein Jeans Shorts",
  "Basketball Sport Boots",
  "Hiking Pants Large Size",
];
const SEARCH_POPULAR = [
  "Calvin Klein Jeans Shorts",
  "Basketball Sport Boots",
  "Hiking Pants Large Size",
];
const SEARCH_PRODUCTS = [
  { name: "Calvin Klein Jeans Men's Jeans", price: 48.05, currency: "$", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop" },
  { name: "Versace Jeans 76YA3SC2 ZPA52 Men's Couture Logo Jeans Sneakers", price: 96.90, currency: "$", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop" },
  { name: "55dsl Parkye 55605 Jeans", price: 56.05, currency: "$", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=80&h=80&fit=crop" },
  { name: "Calvin Klein Jeans Shorts Women", price: 40.59, currency: "$", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop" },
  { name: "Balmain Mens Hp58202jr8261 Jeans Grey", price: 133.00, currency: "$", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=80&h=80&fit=crop" },
];

function HeaderSearchBar({ mobile = false }) {
  const [searchType, setSearchType] = useState("Deals");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentItems, setRecentItems] = useState(SEARCH_RECENT);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const removeRecent = (item) => {
    setRecentItems((prev) => prev.filter((r) => r !== item));
  };

  const handleKeyDown = (e) => {
    if (!searchOpen) return;
    const allItems = [...(recentItems.length > 0 ? recentItems : []), ...SEARCH_POPULAR, ...SEARCH_PRODUCTS.map(p => p.name)];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSelectedIndex(-1);
    }
  };

  const py = mobile ? "py-2.5" : "py-2";

  const searchTypes = ["Deals", "Suppliers", "Importers", "Distributors", "Liquidators", "Wholesalers", "Dropshippers"];

  // Filter products based on query
  const filteredProducts = query.length > 0
    ? SEARCH_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_PRODUCTS;

  let runningIndex = 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={`flex items-center w-full border ${searchOpen ? "border-orange-400 ring-2 ring-orange-500/20" : "border-slate-700"} rounded-lg bg-slate-800 transition-all`}>
        {/* Type dropdown */}
        <div ref={ref} className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-1.5 border-r border-slate-700 px-3 ${py} text-sm font-semibold text-slate-300 hover:text-white transition-all duration-150`}
            aria-label={`Search type: ${searchType}`}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            {searchType}
            <ChevronDown size={12} className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[160px]" role="listbox" aria-label="Search type">
              {searchTypes.map((t) => (
                <button key={t} onClick={() => { setSearchType(t); setDropdownOpen(false); }}
                  role="option"
                  aria-selected={searchType === t}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${searchType === t ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); setSelectedIndex(-1); }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="What are you looking for?"
          className={`flex-1 px-3 ${py} text-sm text-white placeholder-slate-500 focus:outline-none bg-transparent min-w-0`}
          autoFocus={mobile}
          role="combobox"
          aria-label="Search products"
          aria-expanded={searchOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />
        {/* Search button */}
        <button
          className={`px-4 ${py} bg-orange-500 hover:bg-orange-600 active:scale-95 text-white transition-all duration-150 flex items-center gap-1.5 shrink-0 rounded-r-lg`}
          aria-label="Search"
        >
          <Search size={16} />
          {!mobile && <span className="text-sm font-semibold hidden xl:inline">Search</span>}
        </button>
      </div>

      {/* Search suggestions dropdown */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[70vh] overflow-y-auto thin-scrollbar" role="listbox" aria-label="Search suggestions">
          {/* Search for "query" */}
          {query.length > 0 && (
            <a href={`/deals?any=${encodeURIComponent(query)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <Search size={16} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700">Search for &ldquo;<span className="font-semibold">{query}</span>&rdquo;</span>
            </a>
          )}

          {/* Recent searches */}
          {recentItems.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Recent</p>
              {recentItems.map((item) => {
                const idx = runningIndex++;
                return (
                  <div key={item} className={`flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <a href={`/deals?any=${encodeURIComponent(item)}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock size={16} className="text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{item}</span>
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); removeRecent(item); }}
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-md transition-colors shrink-0"
                      aria-label={`Remove ${item} from recent searches`}>
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Most popular */}
          <div className={`py-2 ${recentItems.length > 0 ? "border-t border-slate-100" : ""}`}>
            <p className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Most Popular</p>
            {SEARCH_POPULAR.map((item) => {
              const idx = runningIndex++;
              return (
                <a key={item} href={`/deals?any=${encodeURIComponent(item)}`} className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                  <TrendingUp size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </a>
              );
            })}
          </div>

          {/* Deals */}
          {filteredProducts.length > 0 && (
            <div className="py-2 border-t border-slate-100">
              <p className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Deals</p>
              {filteredProducts.map((product) => {
                const idx = runningIndex++;
                return (
                  <a key={product.name} href="/deal" className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                      ) : (
                        <Package size={16} className="text-slate-200" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 leading-snug line-clamp-2">{product.name}</p>
                      <p className="text-sm mt-0.5"><span className="font-bold text-orange-600">{product.currency}{product.price.toFixed(2)}</span> <span className="text-slate-400 text-xs">/ Unit ex.VAT</span></p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {/* View all results footer */}
          <a href={`/deals${query ? `?any=${encodeURIComponent(query)}` : ""}`}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-t border-slate-200 transition-colors rounded-b-xl">
            View all results <ArrowRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORIES BUTTON + MEGA DROPDOWN WITH SUBCATEGORIES
   ═══════════════════════════════════════════════════ */
function CategoriesButton() {
  const [open, setOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHoveredCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden xl:block">
      <button onClick={() => { setOpen(!open); setHoveredCat(null); }}
        className={`flex items-center gap-2 h-10 px-3 text-sm font-semibold rounded-lg border transition-all duration-150 active:scale-95 ${open ? "text-orange-400 bg-slate-700 border-orange-500/40" : "text-slate-200 hover:text-orange-400 bg-slate-800 hover:bg-slate-700 border-slate-700"}`}
        aria-label="Browse categories"
        aria-expanded={open}
        aria-haspopup="true">
        <Menu size={16} /> Categories
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex" role="menu" aria-label="Product categories" style={{ minWidth: hoveredCat !== null ? "620px" : "340px" }}>
          {/* Categories list */}
          <div className="w-[340px] max-h-[70vh] overflow-y-auto thin-scrollbar py-2 border-r border-slate-100">
            {CATEGORY_LIST.map((cat, idx) => (
              <a
                key={cat.name}
                href={cat.href}
                onMouseEnter={() => setHoveredCat(idx)}
                className={`flex items-center justify-between px-4 py-1.5 text-sm transition-colors group ${
                  hoveredCat === idx ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 shrink-0 ${hoveredCat === idx ? "text-orange-500" : "text-slate-400"}`}>
                    {CATEGORY_ILLUSTRATIONS[cat.name] || <cat.icon size={20} />}
                  </div>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <ChevronRight size={14} className={hoveredCat === idx ? "text-orange-400" : "text-slate-300"} />
              </a>
            ))}
          </div>

          {/* Subcategories panel */}
          {hoveredCat !== null && (
            <div className="w-[280px] max-h-[70vh] overflow-y-auto thin-scrollbar py-3 px-2">
              <div className="border-b border-dashed border-slate-200 pb-2 mb-2 px-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {CATEGORY_LIST[hoveredCat].name}
                </p>
              </div>
              {CATEGORY_LIST[hoveredCat].subs.map((sub) => (
                <a key={sub.label} href={sub.href}
                  className="block px-3 py-2.5 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  {sub.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   USER DROPDOWN MENU
   ═══════════════════════════════════════════════════ */
function UserDropdownMenu({ user, onLogout, onClose }) {
  const sections = [
    {
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: User, label: "Account Profile", href: "/dashboard/account-profile" },
        { icon: MessageSquare, label: "Messages", href: "/messages", badge: 3 },
      ],
    },
    {
      title: "Buyer Tools",
      items: [
        { icon: ShoppingBag, label: "Buyer Profile", href: "/dashboard/buyer-profile" },
        { icon: Clock, label: "My Pre-Orders", href: "/pre-orders" },
        { icon: Heart, label: "My Favourites", href: "/favourites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { icon: Store, label: "Supplier Profile", href: "/dashboard/supplier-profile" },
        { icon: Package, label: "Manage Deals", href: "/manage-deals" },
        { icon: PlusCircle, label: "Add New Deal", href: "/add-deal" },
      ],
    },
    {
      title: "Services",
      items: [
        { icon: Coins, label: "Affiliate Program", href: "/affiliate" },
        { icon: Search, label: "Custom Sourcing", href: "/sourcing" },
        { icon: Headphones, label: "Help Center", href: "/help" },
      ],
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
      <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">{user.initials}</div>
          <div>
            <p className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 uppercase tracking-wide">
              <Crown size={9} /> {user.tier}
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
          <span>Expires: {user.expiresOn || "N/A"}</span>{user.pin && <span>PIN: {user.pin}</span>}
        </div>
      </div>
      {user.tier !== "PRO" && user.tier !== "ENTERPRISE" && user.tier !== "PREMIUM" && (
        <a href="/pricing" className="block mx-3 mt-3 px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-600 transition-all shadow-sm">
          Upgrade to Premium — Unlock All Suppliers
        </a>
      )}
      <div className="py-2">
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && <div className="h-px bg-slate-100 my-1.5 mx-3" />}
            {section.title && <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{section.title}</p>}
            {section.items.map((item) => (
              <a key={item.label} href={item.href} onClick={onClose}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors group">
                <item.icon size={15} className="text-slate-400 group-hover:text-orange-500" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 p-2">
        <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE NAV SEARCH — Search bar with type dropdown
   ═══════════════════════════════════════════════════ */
function MobileNavSearch({ onClose }) {
  const [searchType, setSearchType] = useState("Deals");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchTypes = ["Deals", "Suppliers", "Importers", "Distributors", "Liquidators", "Wholesalers", "Dropshippers"];

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="px-4 pt-3 pb-3 border-b border-slate-800">
      <div className="flex items-center rounded-lg overflow-visible relative">
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-l-lg transition-all duration-200"
          >
            {searchType}
            <ChevronDown size={11} className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-50 min-w-[150px]">
              {searchTypes.map((t) => (
                <button key={t} onClick={() => { setSearchType(t); setDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${searchType === t ? "bg-orange-500/15 text-orange-400 font-semibold" : "text-slate-300 hover:bg-slate-700"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center bg-slate-800 border border-l-0 border-slate-700 rounded-r-lg relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 pl-2.5 pr-8 py-2 text-xs text-white placeholder-slate-500 bg-transparent focus:outline-none min-w-0"
          />
          <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE NAV DRAWER
   ═══════════════════════════════════════════════════ */
function MobileNav({ open, onClose, isAuthenticated, isPremium, onLogin, onRegister, onSetDemoRole, demoRole, demoCategory, onSetDemoCategory, demoSupplierPro, onSetDemoSupplierPro, demoDealStatus, onSetDemoDealStatus }) {
  if (!open) return null;
  return (
    <div className="xl:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 shadow-2xl overflow-y-auto thin-scrollbar">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <WholesaleUpLogo size="small" />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        {/* Demo mode controls */}
        <div className="p-3 border-b border-slate-800 bg-slate-800/50">
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5 px-1">Demo Mode</p>
          <div className="flex flex-wrap items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
            {[
              { role: "guest", label: "Guest" },
              { role: "free", label: "Free" },
              { role: "standard", label: "Standard" },
              { role: "premium", label: "Premium" },
              { role: "premium-plus", label: "Premium+" },
              { role: "supplier-free", label: "Sup. Free" },
              { role: "supplier-premium", label: "Sup. Prem." },
            ].map((item) => (
              <button key={item.role} onClick={() => onSetDemoRole(item.role)}
                className={`px-2 py-1.5 text-[10px] font-semibold rounded-md transition-all ${demoRole === item.role ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-slate-500"}`}>{item.label}</button>
            ))}
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5 px-1">Product Type</p>
            <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto thin-scrollbar bg-slate-900 rounded-lg p-1 border border-slate-700">
              {DEMO_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button key={cat.key} onClick={() => onSetDemoCategory(cat.key)}
                    className={`flex items-center gap-2 text-left px-2 py-1.5 text-[10px] font-semibold rounded-md transition-all ${demoCategory === cat.key ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>
                    <Icon size={12} className="shrink-0" /> {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5 px-1">Listing Tier</p>
            <div className="flex flex-wrap items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
              {[
                { value: false, label: "Supplier Free" },
                { value: true, label: "Supplier Pro" },
              ].map((item) => (
                <button key={String(item.value)} onClick={() => onSetDemoSupplierPro(item.value)}
                  className={`px-2 py-1.5 text-[10px] font-semibold rounded-md transition-all ${demoSupplierPro === item.value ? "bg-blue-500/20 text-blue-400 shadow-sm" : "text-slate-500"}`}>{item.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1.5 px-1">Deal Status</p>
            <div className="flex flex-wrap items-center gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
              {[
                { value: "live", label: "Live Deal" },
                { value: "sold-out", label: "Sold Out" },
              ].map((item) => (
                <button key={item.value} onClick={() => onSetDemoDealStatus(item.value)}
                  className={`px-2 py-1.5 text-[10px] font-semibold rounded-md transition-all ${demoDealStatus === item.value ? "bg-red-500/20 text-red-400 shadow-sm" : "text-slate-500"}`}>{item.label}</button>
              ))}
            </div>
          </div>
        </div>
        {/* Search */}
        <MobileNavSearch onClose={onClose} />
        {/* Dashboard — shown when authenticated */}
        {isAuthenticated && (
          <div className="px-3 py-3 border-b border-slate-800">
            <p className="px-3 pt-1 pb-2 text-[10px] font-bold text-orange-500 uppercase tracking-wider">Dashboard</p>
            {DASHBOARD_NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <link.icon size={16} className="text-slate-500 shrink-0" />
                <span className="flex-1">{link.label}</span>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">{link.badge}</span>
                )}
              </Link>
            ))}
          </div>
        )}
        {/* Browse */}
        <div className="px-3 py-3 border-b border-slate-800">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Browse</p>
          {SECTION_NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} onClick={onClose}
              className="block px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        {/* Categories */}
        <div className="px-3 py-3 border-b border-slate-800">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categories</p>
          {CATEGORY_LIST.map((cat) => (
            <a key={cat.name} href={cat.href} onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <div className="w-4 h-4 shrink-0 text-slate-500">{CATEGORY_ILLUSTRATIONS[cat.name] || <cat.icon size={16} />}</div> {cat.name}
            </a>
          ))}
        </div>
        {/* Auth buttons */}
        {!isAuthenticated && (
          <div className="p-4 pb-12 space-y-2">
            <button onClick={() => { onLogin(); onClose(); }}
              className="w-full px-4 py-2.5 text-sm font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.3)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-200">Log In</button>
            <button onClick={() => { onRegister(); onClose(); }} className="block w-full px-4 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg text-center shadow-[0px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.3)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-200">Join Free</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Exit Popup Testimonial Carousel (arrows + swipe + auto-scroll, no dots) ── */
function ExitPopupTestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const total = EXIT_POPUP_TESTIMONIALS.length;
  const touchStartX = useRef(null);

  // Auto-advance every 4 seconds (pauses when tab hidden)
  const { reset: resetCarousel } = useVisibilityInterval(() => {
    setCurrent((c) => (c + 1) % total);
  }, 4000);

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

  const t = EXIT_POPUP_TESTIMONIALS[current];

  return (
    <div className="relative group" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="bg-gradient-to-br from-white/12 to-white/[0.04] backdrop-blur-sm rounded-xl p-3.5 border border-white/15 overflow-hidden">
        <div className="flex gap-0.5 justify-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
          ))}
        </div>
        <div className="relative min-h-[48px]">
          <p key={current} className="text-xs text-white/90 italic leading-relaxed animate-[swTestimonialFade_0.4s_ease]">
            &ldquo;{t.text}&rdquo;
          </p>
        </div>
        <p className="text-[10px] font-semibold text-sky-200/60 mt-1.5">&mdash; {t.author}, {t.label}</p>
      </div>

      {/* Navigation arrows — always visible */}
      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Previous testimonial">
        <ChevronDown size={12} className="rotate-90" />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all opacity-80 hover:opacity-100" aria-label="Next testimonial">
        <ChevronDown size={12} className="-rotate-90" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SITEWIDE EXIT-INTENT POPUP — Guest registration nudge
   Triggered when mouse leaves browser viewport (address bar).
   Shown once per session for guest users. Excluded from /pricing
   (which has its own exit-intent popup).
   Morphs seamlessly into the AuthModal on "Register Free Now" click.
   ═══════════════════════════════════════════════════ */
const EXIT_POPUP_TESTIMONIALS = [
  { text: "Registered for free, found my first supplier within minutes. Already made back 5x.", author: "Sarah K.", label: "Online Reseller" },
  { text: "Found 15 new verified suppliers for electronics within the first week. Game changer for my business.", author: "Tom B.", label: "Quality-Focused Buyer" },
  { text: "The deal alerts saved me thousands on bulk stock. Worth every penny of membership.", author: "Robert W.", label: "Deal Hunter" },
  { text: "Started wholesale reselling with zero knowledge. WholesaleUp's beginner guides made everything clear.", author: "Natasha S.", label: "New Reseller" },
  { text: "Just bagged 1000 units of clothing at 40% below market price. Deals are genuinely incredible.", author: "Patricia H.", label: "Fashion Reseller" },
  { text: "The supplier database is incredibly comprehensive. I've tripled my supplier network in just 2 months.", author: "Jessica W.", label: "Supply Chain Builder" },
  { text: "Found dropship suppliers with 48-hour shipping times. Game changer for my Shopify store.", author: "Jonathan B.", label: "Shopify Store Owner" },
  { text: "Liquidation section is where I find my biggest profit margins. Bulk overstock deals are incredible.", author: "Timothy P.", label: "Liquidation Buyer" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan A.", label: "Wholesale Entrepreneur" },
  { text: "The sourcing team helped me find a manufacturer for a completely custom product line. Incredible resource.", author: "Hannah P.", label: "Product Sourcer" },
  { text: "Found my best FBA suppliers through WholesaleUp. Now my Amazon business generates £5K monthly profit.", author: "Edward S.", label: "Amazon FBA Seller" },
  { text: "The profit calculator is essential for my daily operations. Saves me 30 minutes every day.", author: "Lucas B.", label: "Online Retailer" },
  { text: "Premium membership gave me access to exclusive supplier deals. Revenue increased 35% in 3 months.", author: "Christopher B.", label: "Premium Member" },
  { text: "Discovered incredible European suppliers I'd been missing. Supplier quality is top-notch.", author: "Carlos M.", label: "Quality-Focused Buyer" },
  { text: "The step-by-step sourcing process helped me go from zero to selling on eBay in 2 weeks.", author: "Oliver M.", label: "eBay Seller" },
  { text: "Been buying liquidation stock for Amazon FBA for 18 months. Margins consistently hit 40%+.", author: "Cassandra W.", label: "Amazon FBA Seller" },
  { text: "My Etsy store now stocks products from 5 WholesaleUp dropshipping partners. Sales increased 200%.", author: "Natalie B.", label: "Etsy Seller" },
  { text: "Flash sales section is brilliant. Got £8K of electronics stock for £4.2K. Incredible margins.", author: "Brian L.", label: "Flash Sale Hunter" },
  { text: "The community forum is active and helpful. Real business owners sharing genuine advice.", author: "Mohammed I.", label: "Wholesale Reseller" },
  { text: "Quality suppliers that actually respond to inquiries. No ghost profiles like other platforms.", author: "Michael O.", label: "Online Reseller" },
];

// Default discount — see ACTIVE_OFFER_DISCOUNT near top of file

function SitewideExitPopup({ onAuthenticated, discount = ACTIVE_OFFER_DISCOUNT, isGuest = true }) {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState("exit"); // "exit" | "register"
  const dismissed = useRef(false);
  const triggered = useRef(false);
  const isGuestRef = useRef(isGuest);
  useEffect(() => { isGuestRef.current = isGuest; }, [isGuest]);

  // Exit-intent detection — mouseleave on documentElement only.
  // This event fires exactly once when the cursor leaves the page boundary
  // (e.g. moves to the address bar, tabs, or outside the browser).
  // It does NOT fire on re-entry, child element transitions, or scrollbar interactions.
  // We only trigger for upward exits (clientY <= 0) to avoid side/bottom edge triggers.
  // Only fires for Guest users — logged-in users (Free, Standard, Premium, etc.) are excluded.
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const fire = () => {
      if (dismissed.current || triggered.current || !isGuestRef.current) return;
      triggered.current = true;
      setShow(true);
    };

    const onLeave = (e) => {
      // Only trigger when cursor exits through the top edge (toward address bar/tabs)
      if (e.clientY <= 0) fire();
    };

    const attachTimeout = setTimeout(() => {
      document.documentElement.addEventListener("mouseleave", onLeave);
    }, 5000);

    return () => {
      clearTimeout(attachTimeout);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Auto-dismiss if user is no longer a guest (e.g. switched demo role while popup was open)
  useEffect(() => {
    if (!isGuest && show) { setShow(false); dismissed.current = true; setPhase("exit"); document.body.style.overflow = ""; }
  }, [isGuest, show]);

  // Escape key + body scroll lock
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handleKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleKey); };
  }, [show]);

  const close = () => { setShow(false); dismissed.current = true; setPhase("exit"); };

  // Instant switch — no cross-fade delay. AuthModal is pre-rendered (hidden)
  // so the switch is immediate with zero mount cost.
  const registerRef = useRef(null);
  const handleRegisterClick = () => {
    setPhase("register");
    // Focus the username input after display:none is removed
    requestAnimationFrame(() => {
      const input = registerRef.current?.querySelector("input");
      if (input) input.focus();
    });
  };

  // Handle successful authentication from the embedded AuthModal
  const handleAuth = () => {
    close();
    if (onAuthenticated) onAuthenticated();
  };

  if (!show) return null;

  const isRegisterPhase = phase === "register";

  return (
    <>
      {/* Backdrop — persists throughout all phases */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-[swExitFadeIn_0.3s_ease]"
        onClick={close}
      />

      {/* Modal container — stays on screen, content morphs inside */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[swExitSlideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div
          className="relative w-full max-w-md lg:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ── Register Form — always mounted (hidden when exit phase), instant switch ── */}
          <div ref={registerRef} style={{ display: isRegisterPhase ? "block" : "none" }}>
            <AuthModal
              embedded
              initialTab="register"
              onClose={close}
              onAuthenticated={handleAuth}
            />
          </div>

          {/* ── Exit Content — visible only in exit phase ── */}
          {!isRegisterPhase && (
            <div className="flex flex-col lg:flex-row">

              {/* Left marketing column — blue gradient matching AuthModal */}
              <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a] items-center justify-center p-8 relative overflow-hidden">
                {/* Dot world map background — same as AuthModal */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0" style={{ mask: "radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, transparent 90%)", WebkitMask: "radial-gradient(ellipse 80% 75% at 50% 50%, black 50%, transparent 90%)" }}>
                    <DotWorldMap />
                  </div>
                </div>
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />

                <div className="relative text-center space-y-5">
                  {/* Premium discount badge — animated, layered design */}
                  <div className="relative mx-auto w-[120px] h-[120px]">
                    {/* Outer glow pulse */}
                    <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-[swBadgePulse_2s_ease-in-out_infinite]" />
                    {/* Decorative outer ring */}
                    <div className="absolute inset-1 rounded-full border-2 border-dashed border-orange-300/40 animate-[swBadgeSpin_20s_linear_infinite]" />
                    {/* Main badge */}
                    <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-orange-500 via-amber-400 to-orange-500 shadow-xl shadow-orange-500/30 flex items-center justify-center overflow-hidden">
                      {/* Shimmer sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[swBadgeShimmer_3s_ease_infinite_1.5s]" />
                      {/* Inner highlight ring */}
                      <div className="absolute inset-[3px] rounded-full border border-white/30" />
                      <div className="relative text-center">
                        <span className="block text-3xl font-black text-white leading-none drop-shadow-sm" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>{discount}%</span>
                        <span className="block text-[11px] font-extrabold text-white/90 uppercase tracking-[0.15em] mt-0.5">OFF</span>
                      </div>
                    </div>
                    {/* Bottom ribbon */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-10">
                      <div className="relative px-4 py-1 bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-lg shadow-red-500/30">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">Upon Registration</span>
                        {/* Ribbon notches */}
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-800 rounded-full opacity-60" />
                        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-800 rounded-full opacity-60" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-lg font-extrabold text-white">Join for Free</p>
                    <p className="text-sm text-sky-200 mt-2 leading-relaxed">
                      901,900+ resellers already sourcing wholesale, liquidation &amp; dropship deals at up to 95% off
                    </p>
                  </div>

                  {/* Trust indicators */}
                  <div className="space-y-2.5 text-left">
                    {[
                      { icon: CheckCircle2, text: "No credit card required" },
                      { icon: CheckCircle2, text: "Cancel or upgrade anytime" },
                      { icon: CheckCircle2, text: "Instant access to deals research" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <item.icon size={14} className="text-sky-300 shrink-0" />
                        <span className="text-sm text-sky-100/80">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial carousel — auto-scrolling */}
                  <ExitPopupTestimonialCarousel />
                </div>
              </div>

              {/* Right content column */}
              <div className="flex-1 lg:w-[58%] lg:shrink-0 flex flex-col overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={close}
                  className="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
                  aria-label="Close popup"
                >
                  <X size={16} />
                </button>

                <div className="p-6 sm:p-8 flex-1">
                  {/* Mobile-only discount badge */}
                  <div className="lg:hidden flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20">
                      <span className="text-xs font-black text-white">{discount}%</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-orange-600 uppercase">{discount}% Discount code</span>
                      <span className="text-xs text-slate-500 ml-1">upon registration</span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight animate-[swExitFadeSlideDown_0.4s_ease_0.1s_both]">
                    Wait — Don&apos;t Leave Empty-Handed!
                  </h2>
                  <p className="text-base text-slate-500 mt-3 leading-relaxed animate-[swExitFadeSlideDown_0.4s_ease_0.15s_both]">
                    Join our <span className="font-semibold text-slate-700">free newsletter</span> and keep a daily summary of the best deals from liquidations, surplus stock and production, bailiff auctions and much more.
                  </p>

                  {/* Value bullets */}
                  <div className="mt-5 space-y-3 animate-[swExitFadeSlideDown_0.4s_ease_0.2s_both]">
                    {[
                      { icon: Zap, color: "text-orange-500 bg-orange-50", text: "14,891+ active wholesale deals updated daily" },
                      { icon: Globe, color: "text-blue-500 bg-blue-50", text: "54,000+ verified suppliers across EU, UK & US" },
                      { icon: TrendingUp, color: "text-emerald-500 bg-emerald-50", text: "Members average 366% markup on wholesale prices" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                          <item.icon size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social proof */}
                  <div className="mt-5 animate-[swExitFadeSlideDown_0.4s_ease_0.25s_both]">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex -space-x-2 shrink-0">
                        {["J", "M", "S", "R"].map((initial, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                            {initial}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-bold text-slate-800">2,847 sellers</span> registered this month
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA section — sticky at bottom */}
                <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-slate-100 bg-white animate-[swExitFadeSlideDown_0.4s_ease_0.3s_both]">
                  <button
                    onClick={handleRegisterClick}
                    className="relative w-full py-3.5 sm:py-4 text-base font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200/50 hover:shadow-xl active:scale-[0.98] overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[swExitShimmer_2.5s_ease_infinite_1s]" />
                    <span className="relative flex items-center gap-2">
                      Register Free Now
                      <ArrowRight size={16} />
                    </span>
                  </button>
                  <button
                    onClick={close}
                    className="w-full mt-2.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-500 transition-colors text-center"
                  >
                    No thanks, I&apos;ll continue browsing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Register form is pre-rendered above (hidden via display:none until phase=register) */}
        </div>
      </div>

      <style>{`
        @keyframes swExitFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes swExitSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes swExitFadeSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes swExitShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes swTestimonialFade { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes swBadgePulse { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.08); opacity: 0.4; } }
        @keyframes swBadgeSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes swBadgeShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   APP LAYOUT — Wraps all pages
   Sidebar (collapsible, sitewide) + Header + Content
   ═══════════════════════════════════════════════════ */
/* ── Standalone routes — render WITHOUT the AppLayout shell ──
   These pages are self-contained landing pages with their own
   header / footer baked into the phase component.  They skip
   the Sidebar, Header, MobileNav, and Footer from AppLayout.
   ─────────────────────────────────────────────────────────── */
const STANDALONE_ROUTES = ["/pricing"];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Maintenance page renders standalone — no header, sidebar, footer, or exit-intent popup
  if (pathname === "/maintenance") return <>{children}</>;

  /* ── Auth state from NextAuth session (H9, C8) ────────────
     useLayoutUser() wraps useSession() and derives user fields.
     isAuthenticated / isPremium are computed from the JWT session —
     no more demo-auth CustomEvents or localStorage persistence.
     NextAuth handles Remember Me via extended JWT maxAge (90 days).
     ─────────────────────────────────────────────────────────── */
  const { user: sessionUser, status: authStatus } = useLayoutUser();
  const isAuthenticated = authStatus === "authenticated";
  const isPremium = sessionUser.tier === "PREMIUM" || sessionUser.tier === "PRO";

  const { setDemoRole, isLoggedIn: demoLoggedIn, isPremium: demoPremium, demoRole, demoCategory, setDemoCategory, demoSupplierPro, setDemoSupplierPro, demoDealStatus, setDemoDealStatus } = useDemoAuth();
  // For the header demo dropdown highlights: use demo-aware values
  const effectiveAuthenticated = demoRole ? demoLoggedIn : isAuthenticated;
  const effectivePremium = demoRole ? demoPremium : isPremium;
  // 🔧 PRODUCTION: Replace localStorage currency with user's preferred currency from account settings / session
  const [currency, setCurrencyRaw] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wup-header-currency");
        if (stored) {
          const parsed = JSON.parse(stored);
          const match = CURRENCIES.find((c) => c.code === parsed.code);
          if (match) return match;
        }
      } catch (_e) { /* ignore */ }
    }
    return CURRENCIES[0];
  });
  const setCurrency = useCallback((c) => {
    setCurrencyRaw(c);
    try { localStorage.setItem("wup-header-currency", JSON.stringify({ code: c.code, symbol: c.symbol })); } catch (_e) { /* ignore */ }
    window.dispatchEvent(new CustomEvent("wup-currency-change", { detail: { code: c.code, symbol: c.symbol } }));
  }, []);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, toggleSidebar, setSidebarCollapsed] = usePanelCollapse("wup-sidebar-collapsed");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [lastLoginToast, setLastLoginToast] = useState(null);

  // Listen for last-login toast events (auth-modal dispatches this after signIn)
  useEffect(() => {
    const handler = (e) => setLastLoginToast(e.detail);
    window.addEventListener("show-last-login", handler);
    return () => window.removeEventListener("show-last-login", handler);
  }, []);

  // Listen for open-auth-modal events dispatched from child pages (e.g. guest CTA clicks)
  useEffect(() => {
    const handler = (e) => openAuth(e.detail?.tab || "register");
    window.addEventListener("open-auth-modal", handler);
    return () => window.removeEventListener("open-auth-modal", handler);
  }, []);

  /* ── Auth actions ──────────────────────────────────────────
     openAuth()          — opens the auth modal on the given tab
     handleAuthenticated — called by AuthModal after successful signIn;
                           session refreshes automatically via useSession()
     handleLogout        — calls NextAuth signOut() (C8)
     ─────────────────────────────────────────────────────────── */
  const openAuth = (tab = "login") => { setAuthModalTab(tab); setShowAuthModal(true); };
  const handleAuthenticated = () => { setShowAuthModal(false); };
  const handleLogout = useCallback(async () => {
    // End NextAuth session — redirect: false so we control the UX
    await signOut({ redirect: false });
    // Clear demo tier override (if any was lingering)
    if (demoRole) setDemoRole("guest");
    // Navigate to homepage after session teardown
    router.push("/");
  }, [demoRole, setDemoRole, router]);

  // Demo-only logout: just resets the demo role to "guest" (no real session to tear down)
  const handleDemoLogout = useCallback(() => {
    setDemoRole("guest");
  }, [setDemoRole]);

  /* ── Standalone mode: skip Sidebar / Header / Footer shell ── */
  if (STANDALONE_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
        {children}
        {/* Reuse the site-wide footer for visual consistency */}
        <Footer />
        {/* Auth Modal still available on standalone pages */}
        {showAuthModal && (
          <AuthModal
            initialTab={authModalTab}
            onClose={() => setShowAuthModal(false)}
            onAuthenticated={handleAuthenticated}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={effectiveAuthenticated}
        user={demoRole && DEMO_USERS[demoRole] ? DEMO_USERS[demoRole] : sessionUser}
        onLogin={() => openAuth("login")}
        onLogout={demoRole ? handleDemoLogout : handleLogout}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Right side: Header + Content + Footer */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isAuthenticated={effectiveAuthenticated}
          isPremium={effectivePremium}
          user={sessionUser}
          onLogin={() => openAuth("login")}
          onRegister={() => openAuth("register")}
          onLogout={handleLogout}
          currency={currency}
          setCurrency={setCurrency}
          onMobileNavToggle={() => setMobileNavOpen(true)}
          /* PRODUCTION: onSetDemoRole is dev-only.
             Remove or gate behind process.env.NODE_ENV check. */
          onSetDemoRole={setDemoRole}
          demoRole={demoRole}
          demoCategory={demoCategory}
          onSetDemoCategory={setDemoCategory}
          demoSupplierPro={demoSupplierPro}
          onSetDemoSupplierPro={setDemoSupplierPro}
          demoDealStatus={demoDealStatus}
          onSetDemoDealStatus={setDemoDealStatus}
          sidebarCollapsed={sidebarCollapsed}
        />

        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}
          isAuthenticated={effectiveAuthenticated} isPremium={effectivePremium} onLogin={() => openAuth("login")} onRegister={() => openAuth("register")}
          onSetDemoRole={setDemoRole} demoRole={demoRole}
          demoCategory={demoCategory} onSetDemoCategory={setDemoCategory}
          demoSupplierPro={demoSupplierPro} onSetDemoSupplierPro={setDemoSupplierPro}
          demoDealStatus={demoDealStatus} onSetDemoDealStatus={setDemoDealStatus} />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>

      {/* Auth Modal — onAuthenticated triggers useSession() refresh automatically */}
      {showAuthModal && (
        <AuthModal
          initialTab={authModalTab}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={handleAuthenticated}
        />
      )}
      {lastLoginToast && (
        <LastLoginToast lastLogin={lastLoginToast} onDismiss={() => setLastLoginToast(null)} />
      )}

      {/* Sitewide exit-intent popup — Guest users only, excluded from /pricing & dashboard pages.
         isGuest is passed as a defence-in-depth prop so the popup's internal fire()
         also checks auth state (guards against hydration race conditions). */}
      {!effectiveAuthenticated && pathname !== "/pricing" && !pathname.startsWith("/dashboard") && !pathname.startsWith("/account-") && (
        <SitewideExitPopup onAuthenticated={handleAuthenticated} isGuest={!effectiveAuthenticated} />
      )}

      {/* GDPR cookie consent banner — site-wide, bottom-anchored */}
      <CookieConsent />
    </div>
  );
}
