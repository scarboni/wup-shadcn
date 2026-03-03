"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  Tag,
  Lock,
  Unlock,
  Crown,
  Star,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  X,
  ChevronRight,
  ArrowRight,
  Shield,
  Sparkles,
  Flame,
  BadgeCheck,
  Package,
  Heart,
  Send,
  Check,
  AlertTriangle,
  Zap,
  Users,
  Clock,
  MessageSquare,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   TIER CONTEXT — provides isPremium + tier info
   throughout the component tree
   ═══════════════════════════════════════════════════ */
const TierContext = createContext({
  tier: "free", // "guest" | "free" | "premium"
  isPremium: false,
  isLoggedIn: false,
  setTier: () => {},
});

function useTier() {
  return useContext(TierContext);
}

/* ═══════════════════════════════════════════════════
   1. BLURRED CONTENT — wraps any content and
   applies blur + lock overlay for non-premium
   ═══════════════════════════════════════════════════ */
function BlurredContent({
  children,
  blurAmount = "blur-sm",
  fallback,
  showLockIcon = false,
  className = "",
}) {
  const { isPremium } = useTier();

  if (isPremium) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <span className={`${blurAmount} select-none pointer-events-none`}>
        {fallback || children}
      </span>
      {showLockIcon && (
        <Lock
          size={10}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400"
        />
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   2. LOCKED SECTION — full section lock with CTA
   ═══════════════════════════════════════════════════ */
function LockedSection({
  children,
  message = "Join to see full details",
  ctaText = "Join Now!",
  onCTA,
  variant = "inline", // "inline" | "overlay" | "replace"
}) {
  const { isPremium } = useTier();

  if (isPremium) return <>{children}</>;

  if (variant === "replace") {
    return (
      <div className="py-4 text-center bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl border border-orange-100">
        <Lock size={16} className="text-orange-400 mx-auto mb-1.5" />
        <p className="text-xs text-orange-600 font-semibold mb-2">{message}</p>
        <button
          onClick={onCTA}
          className="px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all"
        >
          {ctaText}
        </button>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="relative">
        <div className="blur-md select-none pointer-events-none opacity-60">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-xl">
          <div className="text-center">
            <Lock size={20} className="text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-slate-700 font-semibold mb-2">{message}</p>
            <button
              onClick={onCTA}
              className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // inline
  return (
    <div>
      {children}
      <div className="mt-3 py-2.5 text-center bg-gradient-to-r from-orange-50 to-orange-50 rounded-lg border border-orange-100">
        <p className="text-xs text-orange-600 font-semibold flex items-center justify-center gap-1">
          <Lock size={11} /> {message}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. PREMIUM GATE — wraps page-level content,
   shows upgrade modal for non-premium users
   ═══════════════════════════════════════════════════ */
function PremiumGate({
  children,
  requiresPremium = true,
  requiresAuth = false,
}) {
  const { isPremium, isLoggedIn, tier } = useTier();
  const [showModal, setShowModal] = useState(false);

  if (requiresAuth && !isLoggedIn) {
    return (
      <div className="relative">
        <div className="blur-md select-none pointer-events-none opacity-50">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-w-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Sign in Required
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Please log in or create a free account to access this content.
            </p>
            <div className="flex gap-2 justify-center">
              <button className="px-5 py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Log In
              </button>
              <button className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors">
                Join Free
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (requiresPremium && !isPremium) {
    return (
      <div className="relative">
        {children}
        {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
        {/* Floating upgrade banner at bottom */}
        {!showModal && (
          <div className="fixed bottom-0 inset-x-0 z-40">
            <div className="max-w-4xl mx-auto px-4 pb-4">
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 rounded-2xl shadow-2xl shadow-black/30 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Crown size={20} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">
                    Unlock Full Access
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    Get supplier contacts, send inquiries & access 47,400+
                    verified wholesalers
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
                >
                  <Crown size={14} /> Upgrade Now
                </button>
                <button
                  onClick={() => {}}
                  className="text-slate-500 hover:text-white transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

/* ═══════════════════════════════════════════════════
   4. UPGRADE MODAL — full-screen upsell overlay
   matching the WholesaleDeals free-tier gating pages
   ═══════════════════════════════════════════════════ */
function UpgradeModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        {/* Top decoration */}
        <div className="relative bg-gradient-to-br from-orange-500 via-orange-700 to-indigo-700 px-8 pt-8 pb-16">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl" />
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

          <div className="relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Unlock Full Access
            </h2>
            <p className="text-orange-100 text-sm mt-2 max-w-xs mx-auto">
              Upgrade to a Premium Membership to access supplier contact
              details, send unlimited inquiries, and more.
            </p>
          </div>
        </div>

        {/* Feature list */}
        <div className="px-8 py-6 -mt-6 relative">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5">
            <div className="space-y-3">
              {[
                {
                  icon: BadgeCheck,
                  text: "47,400+ EU, UK, USA Verified Wholesalers",
                  color: "text-orange-500 bg-orange-100",
                },
                {
                  icon: Phone,
                  text: "Full supplier contact details",
                  color: "text-emerald-500 bg-emerald-100",
                },
                {
                  icon: Send,
                  text: "Send Unlimited Inquiries",
                  color: "text-violet-500 bg-violet-100",
                },
                {
                  icon: Package,
                  text: "900+ Verified Liquidators",
                  color: "text-orange-500 bg-orange-100",
                },
                {
                  icon: Globe,
                  text: "Web's Largest Dropshippers Databases",
                  color: "text-orange-500 bg-orange-100",
                },
                {
                  icon: Shield,
                  text: "100% Money Back Guarantee",
                  color: "text-amber-500 bg-amber-100",
                },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${feature.color}`}
                  >
                    <feature.icon size={15} />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button className="w-full mt-5 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
            <Crown size={16} /> Upgrade Now
          </button>

          <p className="text-center text-xs text-slate-400 mt-3">
            Already a premium member?{" "}
            <a href="#" className="text-orange-500 hover:text-orange-600 font-semibold">
              Log in.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5. CTA SWITCH — renders different buttons based
   on tier (Join Now / View Deal / Send Enquiry)
   ═══════════════════════════════════════════════════ */
function CTASwitch({
  freeText = "Join Now",
  premiumText = "View Deal",
  guestText = "Join Free",
  onAction,
  variant = "primary", // "primary" | "secondary" | "outline"
  size = "md",
  className = "",
}) {
  const { tier, isPremium, isLoggedIn } = useTier();
  const text = !isLoggedIn ? guestText : isPremium ? premiumText : freeText;

  const baseClasses = size === "sm" ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm";

  const variantClasses = {
    primary: isPremium
      ? "bg-orange-500 hover:bg-orange-600 text-white"
      : "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: isPremium
      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",
    outline: isPremium
      ? "border border-orange-200 text-orange-600 hover:bg-orange-50"
      : "border border-slate-200 text-slate-600 hover:bg-slate-50",
  };

  return (
    <button
      onClick={onAction}
      className={`font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {!isLoggedIn && <Lock size={size === "sm" ? 11 : 14} />}
      {isPremium && variant === "primary" && <Eye size={size === "sm" ? 11 : 14} />}
      {text}
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   DEMO: Supplier Card with Full Gating
   ═══════════════════════════════════════════════════ */
function GatedSupplierCard({ onUpgrade }) {
  const { isPremium, isLoggedIn } = useTier();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <a href="#" className="text-sm font-bold text-orange-600 hover:text-orange-700">
            Trainers and Sportswear Supplier
          </a>
          <BadgeCheck size={14} className="text-orange-500" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🇬🇧</span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={11} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs text-slate-500">5.0</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-3">
        <button className="px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center gap-1">
          <Phone size={11} /> Call Now
        </button>
        <button
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
            isPremium
              ? "text-white bg-orange-500 hover:bg-orange-600"
              : "text-white bg-orange-400 opacity-60 cursor-not-allowed"
          }`}
          title={!isPremium ? "Premium required to send enquiries" : ""}
        >
          <Send size={11} /> Send Enquiry
          {!isPremium && <Lock size={9} className="ml-0.5" />}
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">
        We are a wholesaler of sportswear clothing and shoes. We offer high
        quality adidas originals men's sports jackets, nike air max, reebok
        trainers and more.
      </p>

      {/* Contact Details */}
      <div className="space-y-2 border-t border-slate-100 pt-3">
        {/* Phone — always visible label, value blurred */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Phone/Fax
          </span>
          <div className="flex items-center gap-1.5">
            <BlurredContent fallback="+4402089072658">
              <span className="text-xs text-slate-700 font-medium">
                +4402089072658
              </span>
            </BlurredContent>
            {!isPremium && (
              <span className="text-[9px] text-red-400 font-medium">
                Locked
              </span>
            )}
          </div>
        </div>

        {/* Email — blurred */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Email
          </span>
          <BlurredContent fallback="wholesaletrain@gmail.com">
            <a href="mailto:wholesaletrain@gmail.com" className="text-xs text-orange-600 hover:text-orange-700">
              wholesaletrain@gmail.com
            </a>
          </BlurredContent>
        </div>

        {/* Address — completely hidden for free */}
        {isPremium ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Address
              </span>
              <span className="text-xs text-slate-700">
                9 Fisher's Lane, Chiswick, London W41RX
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Website
              </span>
              <a href="#" className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">
                Visit website <ExternalLink size={10} />
              </a>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5 py-1 text-[10px] text-slate-400 italic">
            <EyeOff size={10} />
            Address & Website hidden — upgrade to view
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!isPremium && (
        <div className="mt-3">
          <LockedSection
            variant="replace"
            message="Join to access supplier details"
            ctaText="Join Now!"
            onCTA={onUpgrade}
          />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEMO: Deal Card with Gating
   ═══════════════════════════════════════════════════ */
function GatedDealCard({ onUpgrade }) {
  const { isPremium } = useTier();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Package size={48} className="text-slate-200 group-hover:text-orange-200 transition-colors" />
        <div className="absolute top-2 right-2 text-lg">🇬🇧</div>
        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-lg">
          £18.95<span className="text-orange-200 text-[10px] ml-1">ex.VAT</span>
        </div>
        <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm">
          <Heart size={13} className="text-slate-400 hover:text-red-500" />
        </button>
      </div>

      <div className="p-3.5">
        <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">
          New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
            201.8%
          </span>
          <span className="text-[10px] text-slate-400 line-through">
            RRP €59.99
          </span>
        </div>

        {/* Profit rows */}
        <div className="space-y-1 mb-3">
          {["Amazon", "eBay"].map((platform) => (
            <div key={platform} className="flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-500">{platform}</span>
              <span className="text-emerald-600 font-bold">
                Profit €16.95
              </span>
            </div>
          ))}
        </div>

        <CTASwitch
          freeText="Join Now"
          premiumText="View Deal"
          guestText="Join Free"
          onAction={!isPremium ? onUpgrade : undefined}
          className="w-full"
          size="sm"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEMO: Contact Panel with Gating
   ═══════════════════════════════════════════════════ */
function GatedContactPanel({ onUpgrade }) {
  const { isPremium } = useTier();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <BadgeCheck size={16} className="text-orange-500" />
        <span className="text-xs font-bold text-emerald-600">Verified Seller</span>
      </div>

      <h3 className="text-sm font-extrabold text-slate-900 mb-2">
        Mobile Phones & Accessories Wholesaler
      </h3>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Computer & Software", "Electrical & Lighting", "Telephony & Mobile"].map((cat) => (
          <span key={cat} className="px-2 py-1 text-[10px] font-medium text-orange-600 bg-orange-50 rounded-lg border border-orange-100">
            {cat}
          </span>
        ))}
      </div>

      {/* Address Section */}
      <div className="space-y-2.5 mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Address
        </h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 w-16">Country:</span>
            <span className="text-xs text-slate-700">🇬🇧 United Kingdom</span>
          </div>
          {isPremium ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16">City:</span>
                <span className="text-xs text-slate-700">Manchester</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16">Postal:</span>
                <span className="text-xs text-slate-700">M1 1AD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16">Street:</span>
                <span className="text-xs text-slate-700">New Cathedral</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16">Website:</span>
                <a href="#" className="text-xs text-orange-600 flex items-center gap-1">
                  sitename.com <ExternalLink size={9} />
                </a>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 py-2 text-[10px] text-slate-400 italic">
              <EyeOff size={10} /> City, Postal, Street & Website — Premium only
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-2.5 mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Contact
        </h4>
        {isPremium ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">Name:</span>
              <span className="text-xs text-slate-700">Jane Collin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">Position:</span>
              <span className="text-xs text-slate-700">Store Manager</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">Phone:</span>
              <span className="text-xs text-slate-700">+44 0203 0484377</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">Name:</span>
              <BlurredContent fallback="Jane Collin">
                <span className="text-xs text-slate-700">Jane Collin</span>
              </BlurredContent>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 w-20">Phone:</span>
              <BlurredContent fallback="+44 0203 0484377">
                <span className="text-xs text-slate-700">+44 0203 0484377</span>
              </BlurredContent>
            </div>
          </div>
        )}
      </div>

      {/* Opening Hours */}
      <div className="mb-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Opening Hours
        </h4>
        <p className="text-xs text-slate-600 mb-2">
          <Clock size={11} className="inline mr-1" />
          08:00–16:00
        </p>
        <div className="flex gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
            const isOpen = i >= 1 && i <= 5;
            const isToday = new Date().getDay() === i;
            return (
              <span
                key={day}
                className={`px-1.5 py-1 text-[9px] font-bold rounded ${
                  isToday
                    ? isOpen
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                    : isOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2">
        {isPremium ? (
          <>
            <button className="w-full py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <Send size={13} /> Send Enquiry
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                View Profile
              </button>
              <button className="py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                View All Deals
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onUpgrade}
            className="w-full py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Lock size={13} /> Join Now
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GATING PATTERN REFERENCE CARD
   ═══════════════════════════════════════════════════ */
function GatingPatternCard({ title, description, icon: Icon, tier, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <Icon size={14} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-bold text-slate-800">{title}</h3>
          <p className="text-[10px] text-slate-500">{description}</p>
        </div>
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
          tier === "premium" ? "bg-amber-100 text-amber-700" : tier === "auth" ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-600"
        }`}>
          {tier === "premium" ? "PREMIUM" : tier === "auth" ? "AUTH" : "ALL"}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE — Phase 8 Gating Logic Demo
   ═══════════════════════════════════════════════════ */
export default function Phase8GatingLogic() {
  const [tier, setTier] = useState("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPremium = tier === "premium";
  const isLoggedIn = tier !== "guest";

  return (
    <TierContext.Provider value={{ tier, isPremium, isLoggedIn, setTier }}>
      <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                <Tag size={14} className="text-white" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Wholesale<span className="text-orange-500">Up</span>
              </span>
            </div>

            {/* Tier Switch */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                {[
                  { id: "guest", label: "Guest", icon: Lock },
                  { id: "free", label: "Free User", icon: Users },
                  { id: "premium", label: "Premium", icon: Crown },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      tier === t.id
                        ? t.id === "premium"
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                          : "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <t.icon size={12} />
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Show Upgrade Modal
              </button>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <Shield size={20} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800">
                  Phase 8 — Gating Logic Components
                </h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Switch between <strong>Guest</strong>, <strong>Free</strong>, and <strong>Premium</strong> tiers using the toggle above to see how all gating patterns change in real-time. This phase provides 5 reusable gating primitives: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono">BlurredContent</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono">LockedSection</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono">PremiumGate</code>, <code className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono">UpgradeModal</code>, and <code className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono">CTASwitch</code>.
                </p>

                {/* Current Tier Status */}
                <div className="mt-3 flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                    tier === "guest"
                      ? "bg-slate-100 text-slate-600"
                      : tier === "free"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {tier === "guest" && <><Lock size={11} /> Not logged in</>}
                    {tier === "free" && <><Users size={11} /> Standard (Free) tier</>}
                    {tier === "premium" && <><Crown size={11} /> Premium tier — All unlocked</>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    {isPremium ? (
                      <><Unlock size={10} className="text-emerald-500" /> Contacts visible, enquiries enabled, full access</>
                    ) : isLoggedIn ? (
                      <><Lock size={10} className="text-orange-500" /> Contacts blurred, address hidden, limited CTAs</>
                    ) : (
                      <><Lock size={10} className="text-red-500" /> No access — login required</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {/* Pattern 1: BlurredContent */}
            <GatingPatternCard title="BlurredContent" description="Inline blur for sensitive text values" icon={EyeOff} tier="premium">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">Phone</span>
                  <BlurredContent fallback="+4402089072658">
                    <span className="text-sm font-medium text-slate-800">+4402089072658</span>
                  </BlurredContent>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">Email</span>
                  <BlurredContent fallback="wholesale@supplier.com">
                    <span className="text-sm font-medium text-orange-600">wholesale@supplier.com</span>
                  </BlurredContent>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-slate-500 font-bold">Address</span>
                  <BlurredContent fallback="9 Fisher's Lane, London W41RX" blurAmount="blur-md">
                    <span className="text-sm font-medium text-slate-800">9 Fisher's Lane, London W41RX</span>
                  </BlurredContent>
                </div>
              </div>
            </GatingPatternCard>

            {/* Pattern 2: LockedSection (all 3 variants) */}
            <GatingPatternCard title="LockedSection (3 variants)" description="Inline / Overlay / Replace — pick per context" icon={Lock} tier="premium">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">Inline</p>
                  <LockedSection variant="inline">
                    <p className="text-xs text-slate-600">This content is visible but a join CTA appears below.</p>
                  </LockedSection>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">Replace</p>
                  <LockedSection variant="replace" ctaText="Upgrade Now" onCTA={() => setShowUpgradeModal(true)}>
                    <p className="text-xs text-slate-600">This is replaced entirely by a lock card.</p>
                  </LockedSection>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1.5">Overlay</p>
                  <LockedSection variant="overlay" ctaText="Unlock Now" onCTA={() => setShowUpgradeModal(true)}>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">Supplier: Premium Electronics Ltd</p>
                      <p className="text-xs text-slate-600 mb-1">Phone: +44 020 7946 0958</p>
                      <p className="text-xs text-slate-600">Email: premium@electronics.co.uk</p>
                    </div>
                  </LockedSection>
                </div>
              </div>
            </GatingPatternCard>

            {/* Pattern 3: CTASwitch */}
            <GatingPatternCard title="CTASwitch" description="Adapts button text + style per tier" icon={Zap} tier="all">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-16">Primary:</span>
                  <CTASwitch className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-16">Secondary:</span>
                  <CTASwitch variant="secondary" freeText="Upgrade" premiumText="Send Enquiry" guestText="Sign Up" className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-16">Outline:</span>
                  <CTASwitch variant="outline" freeText="Learn More" premiumText="View Profile" guestText="Explore" className="flex-1" />
                </div>
              </div>
            </GatingPatternCard>

            {/* Pattern 4: Feature Access Table */}
            <GatingPatternCard title="Feature Access Matrix" description="What each tier can see / do" icon={Shield} tier="all">
              <div className="space-y-1.5">
                {[
                  { feature: "Browse deals", guest: true, free: true, premium: true },
                  { feature: "View deal prices", guest: true, free: true, premium: true },
                  { feature: "See profit calculations", guest: false, free: true, premium: true },
                  { feature: "Supplier names", guest: false, free: true, premium: true },
                  { feature: "Supplier phone/email", guest: false, free: false, premium: true },
                  { feature: "Supplier address", guest: false, free: false, premium: true },
                  { feature: "Send enquiries", guest: false, free: false, premium: true },
                  { feature: "View supplier website", guest: false, free: false, premium: true },
                  { feature: "Custom sourcing", guest: false, free: false, premium: true },
                ].map((row) => (
                  <div key={row.feature} className="flex items-center gap-2 py-1">
                    <span className="text-xs text-slate-600 flex-1">{row.feature}</span>
                    <div className="flex items-center gap-2">
                      {[
                        { val: row.guest, label: "G" },
                        { val: row.free, label: "F" },
                        { val: row.premium, label: "P" },
                      ].map((col) => (
                        <span
                          key={col.label}
                          className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                            col.val
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-red-50 text-red-400"
                          }`}
                        >
                          {col.val ? <Check size={9} /> : <X size={9} />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400">
                  <span>G=Guest</span> <span>F=Free</span> <span>P=Premium</span>
                </div>
              </div>
            </GatingPatternCard>
          </div>

          {/* Full Component Demos */}
          <h2 className="text-lg font-extrabold text-slate-800 mb-4">
            Full Component Demos
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-20">
            <GatedDealCard onUpgrade={() => setShowUpgradeModal(true)} />
            <GatedSupplierCard onUpgrade={() => setShowUpgradeModal(true)} />
            <GatedContactPanel onUpgrade={() => setShowUpgradeModal(true)} />
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradeModal onClose={() => setShowUpgradeModal(false)} />
        )}
      </div>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </TierContext.Provider>
  );
}
