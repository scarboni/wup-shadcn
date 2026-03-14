"use client";

import { ChevronDown, Lock, Rocket, Crown, Star, Zap, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useDemoAuth } from "@/components/shared/demo-auth-context";

/* ═══════════════════════════════════════════════════
   SIDEBAR PROMO PANEL — tier-aware upgrade messaging
   ═══════════════════════════════════════════════════
   Shows contextual upgrade CTA based on the viewer's account tier:
   - Guest:         "Join Today"        → /register
   - Free:          "Upgrade Your Plan" → /pricing  (Standard / Premium / Premium+)
   - Standard:      "Go Premium"        → /pricing  (Premium / Premium+)
   - Premium:       "Go Premium+"       → /pricing  (Premium+)
   - Premium+:      (hidden — has everything buyer-side)
   - Supplier Free: "Go Supplier Pro"   → /supplier-upgrade (not yet created)
   - Supplier Pro:  (hidden — has everything supplier-side)
   ═══════════════════════════════════════════════════ */
function SidebarPromoPanel() {
  const { demoRole, isLoggedIn, isPremium, isPremiumPlus, isSupplier } = useDemoAuth();

  /* ── Determine tier category ── */
  const role = demoRole || (isLoggedIn ? "free" : null); // null = guest
  const isSupplierFree = role === "supplier-free";
  const isSupplierPro = role === "supplier-premium";

  // Premium+ and Supplier Pro see no promo — they have everything
  if (role === "premium-plus" || isSupplierPro) return null;

  /* ── Tier-specific content configuration ── */
  const config = getPromoConfig(role);
  if (!config) return null;

  return (
    <div className="border-t border-slate-200 bg-white overflow-hidden">
      {/* Illustration */}
      <div className={`flex items-center justify-center pt-4 pb-0 ${config.headerBg}`}>
        <Image
          src="https://wholesaledeals.vercel.app/assets/images/v3/deals/deals-vector.svg"
          alt={config.heading}
          width={192}
          height={192}
          className="w-48 h-auto"
        />
      </div>

      {/* Content */}
      <div className={`px-5 pb-5 pt-3 ${config.bodyBg}`}>
        <h3 className="text-lg font-extrabold text-slate-900 mb-3 text-center">
          {config.heading}
        </h3>

        <p className="text-sm text-slate-500 leading-relaxed mb-3">
          {config.description}
        </p>

        {/* Benefit bullets */}
        {config.benefits && config.benefits.length > 0 && (
          <ul className="space-y-2 mb-4">
            {config.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-sm text-slate-600 font-semibold leading-relaxed mb-1 text-center">
          {config.tagline}
        </p>

        {config.subtitle && (
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            {config.subtitle}
          </p>
        )}

        {/* CTA button */}
        <div className="text-center">
          {config.ctaOnClick ? (
            <button
              onClick={config.ctaOnClick}
              className={`inline-flex px-8 py-2.5 text-sm font-bold rounded-full shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 items-center gap-1.5 ${config.ctaClass}`}
            >
              {config.ctaIcon}
              {config.ctaText}
            </button>
          ) : (
            <a
              href={config.ctaHref}
              className={`inline-flex px-8 py-2.5 text-sm font-bold rounded-full shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 items-center gap-1.5 ${config.ctaClass}`}
            >
              {config.ctaIcon}
              {config.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Promo config by tier ── */
function getPromoConfig(role) {
  switch (role) {
    /* ── GUEST (not registered) ── */
    case null:
    case undefined:
    case "guest":
      return {
        heading: "Join Today",
        headerBg: "bg-gradient-to-b from-orange-50 to-orange-100/60",
        bodyBg: "bg-gradient-to-b from-orange-50/40 to-white",
        description:
          "Unlock tens of thousands of verified liquidation, wholesale, and dropshipping suppliers from across the EU, UK, North America, and beyond.",
        benefits: null,
        tagline: "Ready to supercharge your retail business?",
        subtitle:
          "Wholesale Deals: the web\u2019s largest and most trusted source of verified trade distributors.",
        ctaOnClick: () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } })),
        ctaText: "Join Now!",
        ctaIcon: <Lock size={14} />,
        ctaClass: "text-white bg-orange-500 hover:bg-orange-600",
      };

    /* ── FREE (registered, no subscription) ── */
    case "free":
      return {
        heading: "Upgrade Your Plan",
        headerBg: "bg-gradient-to-b from-sky-50 to-sky-100/60",
        bodyBg: "bg-gradient-to-b from-sky-50/40 to-white",
        description:
          "You\u2019re missing out on thousands of wholesale deals. Upgrade to unlock full supplier access and contact details.",
        benefits: [
          "Contact all suppliers directly",
          "View full supplier profiles & branding",
          "Access deal attachments & documents",
          "Click through to supplier websites",
        ],
        tagline: "Get the full wholesale advantage",
        subtitle: null,
        ctaHref: "/pricing",
        ctaText: "View Plans",
        ctaIcon: <Rocket size={14} />,
        ctaClass: "text-white bg-orange-500 hover:bg-orange-600",
      };

    /* ── STANDARD ── */
    case "standard":
      return {
        heading: "Go Premium",
        headerBg: "bg-gradient-to-b from-amber-50 to-amber-100/60",
        bodyBg: "bg-gradient-to-b from-amber-50/40 to-white",
        description:
          "Upgrade to Premium for direct access to all supplier contact details, websites, and exclusive wholesale deals.",
        benefits: [
          "See all supplier contact details",
          "View company logos & full branding",
          "Access 500 supplier websites/month",
          "Send enquiries to all suppliers",
        ],
        tagline: "Unlock your full sourcing potential",
        subtitle: null,
        ctaHref: "/pricing",
        ctaText: "Upgrade Now",
        ctaIcon: <Star size={14} />,
        ctaClass: "text-white bg-orange-500 hover:bg-orange-600",
      };

    /* ── PREMIUM ── */
    case "premium":
      return {
        heading: "Go Premium+",
        headerBg: "bg-gradient-to-b from-violet-50 to-violet-100/60",
        bodyBg: "bg-gradient-to-b from-violet-50/40 to-white",
        description:
          "Take your sourcing to the next level with Premium+. Get daily deal alerts, supplier reviews, and dedicated sourcing support.",
        benefits: [
          "Daily deals newsletter (not just weekly)",
          "Access supplier reviews & ratings",
          "Unlimited custom sourcing requests",
          "Priority support from our team",
        ],
        tagline: "The ultimate wholesale sourcing plan",
        subtitle: null,
        ctaHref: "/pricing",
        ctaText: "Upgrade to Premium+",
        ctaIcon: <Crown size={14} />,
        ctaClass: "text-white bg-violet-600 hover:bg-violet-700",
      };

    /* ── SUPPLIER FREE ── */
    case "supplier-free":
      return {
        heading: "Go Supplier Pro",
        headerBg: "bg-gradient-to-b from-blue-50 to-blue-100/60",
        bodyBg: "bg-gradient-to-b from-blue-50/40 to-white",
        description:
          "Upgrade to Supplier Pro and get your products in front of 900,000+ verified resellers with maximum visibility.",
        benefits: [
          "Unlimited deal listings per month",
          "Your company name visible to all buyers",
          "Logo & branding shown on all listings",
          "Daily newsletter features & priority placement",
        ],
        tagline: "Maximise your supplier visibility",
        subtitle: null,
        ctaHref: "/supplier-upgrade",
        ctaText: "Upgrade to Pro",
        ctaIcon: <ShieldCheck size={14} />,
        ctaClass: "text-white bg-[#1e5299] hover:bg-[#174280]",
      };

    /* ── PREMIUM+ / SUPPLIER PRO — no promo ── */
    default:
      return null;
  }
}

/**
 * Shared collapsible filter panel wrapper used by /deals, /suppliers, and /supplier-deals.
 * Handles the sticky container, collapse animation, toggle button, and
 * tier-aware promo panel. The actual FilterSidebar content is passed as children.
 *
 * @param {Object} props
 * @param {boolean} props.collapsed - Whether the panel is collapsed
 * @param {() => void} props.onToggle - Toggle collapsed state
 * @param {React.ReactNode} props.children - FilterSidebar component with page-specific props
 */
export { SidebarPromoPanel };

export function CollapsibleFilterPanel({ collapsed, onToggle, children }) {
  return (
    <div className="hidden lg:block relative shrink-0 sticky self-start" data-panel="filter" style={{ top: 110 }}>
      <div className={`overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 ease-in-out ${collapsed ? "w-0" : "w-72"}`} style={{ maxHeight: "calc(100vh - 120px)" }}>
        <div className="w-72">
          {children}
        </div>
      </div>
      {/* Filter toggle button — outside the overflow-hidden scroll area */}
      <button
        onClick={onToggle}
        className={`absolute top-[52px] left-[100%] w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-lg flex items-center justify-center z-10 ${
          collapsed ? "shadow-[2px_2px_4px_rgba(0,0,0,0.2)]" : ""
        }`}
        title={collapsed ? "Show filters" : "Hide filters"}
      >
        <ChevronDown size={14} className={`text-white transition-transform ${collapsed ? "-rotate-90" : "rotate-90"}`} />
      </button>
    </div>
  );
}
