"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import DotWorldMap from "@/components/shared/dot-world-map";
import { useVisibilityInterval } from "@/components/shared/use-visibility-interval";
import { WholesaleUpIcon } from "@/components/shared/logo";
import {
  ALL_FEATURES,
  TESTIMONIALS,
  FAQS,
  WHY_CHOOSE_US,
  LIVE_REGISTRATIONS,
  PRICING_EXIT_TESTIMONIALS,
  COMPARISON_FEATURES,
} from "@/components/phases/pricing-data";
import {
  Check,
  X,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  TrendingUp,
  Users,
  Package,
  Crown,
  Shield,
  Sparkles,
  HelpCircle,
  Store,
  BadgeCheck,
  ShieldCheck,
  Lock,
  Rocket,
  Zap,
  ThumbsUp,
  Globe,
  Mail,
  User,
} from "lucide-react";

/* ─── Currency options (same as app-layout) ─── */
const PRICING_CURRENCIES = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "CAD", symbol: "C$", rate: 1.36 },
  { code: "AUD", symbol: "A$", rate: 1.53 },
];

/* ─── WholesaleUp "W" logo icon (imported from shared) ─── */

/* ─────────── Placeholder Pricing Data (H1) ─────────────────
   PRODUCTION: Replace with data from GET /api/pricing
   The API returns pricing plans with features and periods.
   SEED: prisma/seed.ts → seedPricingPlans(), seedTestimonials()
   Example: const { data: pricing } = useSWR("/api/pricing", fetcher);
   ─────────────────────────────────────────────────────────── */
const PRICING = {
  "1-month": {
    standard: { price: 25, original: null, discount: null },
    premium: { price: 60, original: 150, discount: 60 },
    premiumPlus: { price: 100, original: 300, discount: 66 },
  },
  "6-months": {
    standard: { price: 120, original: null, discount: null },
    premium: { price: 300, original: 750, discount: 60 },
    premiumPlus: { price: 500, original: 1500, discount: 66 },
  },
  "1-year": {
    standard: { price: 200, original: null, discount: null },
    premium: { price: 500, original: 1500, discount: 67 },
    premiumPlus: { price: 800, original: 2400, discount: 67 },
  },
};

const PERIOD_LABELS = {
  "1-month": "1 month",
  "6-months": "6 months",
  "1-year": "1 year",
};

/* ─── Tooltip component for help icons ─── */
function PricingTooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex cursor-help text-slate-400 hover:text-slate-600 transition-colors"
      >
        {children}
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg leading-relaxed z-50 pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

/* Data arrays imported from pricing-data.js */






/* ── Pricing Exit Testimonial Carousel ── */
function PricingExitTestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef(0);

  const advance = useCallback((dir = 1) => {
    setIdx((p) => (p + dir + PRICING_EXIT_TESTIMONIALS.length) % PRICING_EXIT_TESTIMONIALS.length);
  }, []);

  // Auto-advance every 5s (pauses when tab hidden)
  const { reset: resetTimer } = useVisibilityInterval(() => advance(1), 5000);
  const prev = () => { advance(-1); resetTimer(); };
  const next = () => { advance(1); resetTimer(); };

  const t = PRICING_EXIT_TESTIMONIALS[idx];

  return (
    <div className="mt-3 relative group"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); } }}
    >
      <div className="px-4 py-3 bg-slate-50 rounded-xl border border-slate-100" key={idx} style={{ animation: "pricingExitTestimonialSlide 0.3s ease" }}>
        <p className="text-sm text-slate-600 italic leading-relaxed">
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500">&mdash; {t.author}, {t.role}</span>
        </div>
      </div>

      {/* Navigation arrows — always visible */}
      <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all opacity-80 hover:opacity-100 shadow-sm" aria-label="Previous testimonial">
        <ChevronLeft size={14} />
      </button>
      <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all opacity-80 hover:opacity-100 shadow-sm" aria-label="Next testimonial">
        <ChevronRight size={14} />
      </button>

      <style>{`
        @keyframes pricingExitTestimonialSlide { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   EXIT-INTENT POPUP — Triggers when mouse leaves viewport top
   Uses proven conversion tactics: urgency, social proof, loss aversion
   ═══════════════════════════════════════════════════ */
function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const dismissed = useRef(false);
  const triggered = useRef(false);
  const router = useRouter();

  // 10-minute countdown timer — creates urgency for the exclusive offer
  const [countdown, setCountdown] = useState(10 * 60); // 10 minutes in seconds
  // Countdown pauses when tab hidden (visual-only timer)
  useVisibilityInterval(() => {
    setCountdown((s) => Math.max(0, s - 1));
  }, show && countdown > 0 ? 1000 : null);
  const cMins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const cSecs = String(countdown % 60).padStart(2, "0");

  // Exit-intent detection — mouseleave on documentElement only.
  // Fires when cursor truly leaves the page (e.g. to address bar).
  // Does NOT fire on re-entry or child element transitions.
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const fire = () => {
      if (dismissed.current || triggered.current) return;
      triggered.current = true;
      setTimeout(() => { if (!dismissed.current) setShow(true); }, 200);
    };

    const onLeave = (e) => {
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

  // Escape key + body scroll lock
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [show]);

  const close = () => {
    setShow(false);
    dismissed.current = true;
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-[exitFadeIn_0.3s_ease]"
        onClick={close}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[exitSlideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 min-w-[44px] min-h-[44px] rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
            aria-label="Close popup"
          >
            <X size={18} />
          </button>

          {/* Top accent bar — animated gradient */}
          <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-[length:200%_100%] animate-[exitGradientSlide_3s_ease_infinite]" />

          <div className="px-8 sm:px-12 pt-8 pb-6">
            {/* Exclusive offer badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wider mb-4 animate-[exitFadeSlideDown_0.4s_ease_0.15s_both]">
              <Sparkles size={12} />
              Exclusive Exit Offer
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight animate-[exitFadeSlideDown_0.4s_ease_0.2s_both]">
              Wait &mdash; Your Competitors Are Already{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Profiting</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 mt-3 leading-relaxed animate-[exitFadeSlideDown_0.4s_ease_0.25s_both]">
              Every day without access, you&apos;re missing deals with <span className="font-bold text-slate-700">45&ndash;95% profit margins</span> that other resellers are snapping up.
            </p>

            {/* Value bullets */}
            <div className="mt-6 space-y-3 animate-[exitFadeSlideDown_0.4s_ease_0.3s_both]">
              {[
                { icon: Zap, text: "14,891+ active deals updated daily" },
                { icon: Globe, text: "54,000+ verified suppliers across UK, EU & USA" },
                { icon: TrendingUp, text: "Members average 366% markup on wholesale prices" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-orange-500" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof + testimonial carousel */}
            <div className="mt-6 animate-[exitFadeSlideDown_0.4s_ease_0.35s_both]">
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex -space-x-2 shrink-0">
                  {["J", "M", "S", "R"].map((initial, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-emerald-700">
                  <span className="font-bold">2,847 sellers</span> joined this month alone
                </p>
              </div>
              {/* Testimonial carousel */}
              <PricingExitTestimonialCarousel />
            </div>

            {/* Guarantee + countdown row */}
            <div className="mt-4 flex items-center justify-between gap-4 animate-[exitFadeSlideDown_0.4s_ease_0.4s_both]">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield size={14} className="text-blue-500 shrink-0" />
                <span>100% money-back guarantee &mdash; zero risk</span>
              </div>
              {/* Countdown timer */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Offer expires</div>
                <div className="flex items-center gap-0.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                  <span className="text-sm font-mono font-bold tabular-nums">{cMins}:{cSecs}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA section */}
          <div className="px-8 sm:px-12 pb-6 pt-2 animate-[exitFadeSlideDown_0.4s_ease_0.45s_both]">
            <button
              onClick={() => { close(); router.push("/pricing"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="relative w-full py-4 sm:py-5 text-base sm:text-lg font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-200/60 active:scale-[0.98] overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[exitShimmer_2.5s_ease_infinite_1s]" />
              <span className="relative flex items-center gap-2">
                Yes, Show Me the Deals <ArrowRight size={18} />
              </span>
            </button>
            <button
              onClick={close}
              className="w-full mt-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-500 transition-colors text-center"
            >
              No thanks, I&apos;ll pass on the profits
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes exitFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes exitSlideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes exitFadeSlideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes exitShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes exitGradientSlide { 0%, 100% { background-position: 0% 0; } 50% { background-position: 100% 0; } }
      `}</style>
    </>
  );
}

function LiveRegistrationToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true); // default true to avoid SSR flash

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Initial 3s delay before first toast
  useEffect(() => {
    if (reducedMotion) return;
    const t = setTimeout(() => {
      setStarted(true);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
      setTimeout(() => setCurrentIndex((p) => (p + 1) % LIVE_REGISTRATIONS.length), 4500);
    }, 3000);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  // Repeating toast every 12s (pauses when tab hidden)
  useVisibilityInterval(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
    setTimeout(() => setCurrentIndex((p) => (p + 1) % LIVE_REGISTRATIONS.length), 4500);
  }, started && !reducedMotion ? 12000 : null);

  const reg = LIVE_REGISTRATIONS[currentIndex];

  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 px-6 py-5 flex items-center gap-4 min-w-[320px] sm:min-w-[360px]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md shadow-emerald-200/50">
          {reg.name[0]}
        </div>
        <div>
          <p className="text-base text-slate-800">
            <span className="font-extrabold">{reg.name}</span> registered{" "}
            <span className="font-extrabold text-orange-600">{reg.plan}</span>
          </p>
          <p className="text-sm text-slate-400 mt-0.5">{reg.country} · {reg.time}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLASH SALE BANNER — Blue with scrolling world map
   & calendar flip-card countdown
   ═══════════════════════════════════════════════════ */
/* ─── Single flip digit — light style with 3D flip ─── */
function FlipDigit({ digit }) {
  const [cur, setCur] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== cur) {
      setPrev(cur);
      setCur(digit);
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 500);
      return () => clearTimeout(t);
    }
  }, [digit, cur]);

  return (
    <div className="fc">
      {/* Static back layers */}
      <div className="fc-top"><span>{cur}</span></div>
      <div className="fc-bot"><span>{prev}</span></div>
      {/* Animated flip layers */}
      <div className={`fc-top fc-flap-top ${flipping ? "fc-go" : ""}`} key={"t" + prev}><span>{prev}</span></div>
      <div className={`fc-bot fc-flap-bot ${flipping ? "fc-go" : ""}`} key={"b" + cur}><span>{cur}</span></div>
      <div className="fc-hinge" />
    </div>
  );
}

function FlashSaleBanner({ transparent = false }) {
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 21, minutes: 38, seconds: 23 });
  const prevTimeRef = useRef(timeLeft);
  const ACTUAL_REMAINING = 1; // The real current number of remaining packages
  const START_FROM = 20;       // Always start counting from this number on page load
  const [remaining, setRemaining] = useState(START_FROM);

  // Countdown pauses when tab hidden (visual-only urgency timer)
  useVisibilityInterval(() => {
    setTimeLeft((prev) => {
      prevTimeRef.current = prev;
      let { days, hours, minutes, seconds } = prev;
      seconds--;
      if (seconds < 0) { seconds = 59; minutes--; }
      if (minutes < 0) { minutes = 59; hours--; }
      if (hours < 0) { hours = 23; days--; }
      if (days < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return { days, hours, minutes, seconds };
    });
  }, 1000);

  // Count down from START_FROM to ACTUAL_REMAINING in ~4 seconds total, accelerating smoothly
  useEffect(() => {
    if (remaining <= ACTUAL_REMAINING) return;
    const totalSteps = START_FROM - ACTUAL_REMAINING;
    const stepIndex = START_FROM - remaining; // 0 = first tick
    const t = stepIndex / totalSteps; // 0 to ~1
    // Use quadratic easing to compute cumulative time, then derive per-step delay
    // Total budget: 4000ms. Each step's delay = proportional slice of remaining time
    const totalTime = 6000;
    // Cumulative fraction at step i: (i/N)^0.4 — front-loaded (slow start, fast end)
    const cumNow = Math.pow(stepIndex / totalSteps, 0.4);
    const cumNext = Math.pow((stepIndex + 1) / totalSteps, 0.4);
    const delay = (cumNext - cumNow) * totalTime;
    const timer = setTimeout(() => {
      setRemaining((prev) => prev - 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [remaining]);

  const pad = (n) => String(n).padStart(2, "0");
  const prev = prevTimeRef.current;

  return (
    <>
    <style>{`
      @keyframes discountPulse {
        0%, 100% { transform: scale(1); background-color: rgb(249 115 22); }
        50% { transform: scale(1.08); background-color: rgb(234 88 12); }
      }
    `}</style>
    <div className={`relative overflow-hidden text-white ${transparent ? "" : "bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]"}`}>
      {/* DotWorldMap background — only when standalone */}
      {!transparent && (
        <div className="absolute inset-0 pointer-events-none">
          <DotWorldMap opacity={0.12} />
        </div>
      )}

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-6">
        {/* Top row on mobile: Flash Sale + -20% + remaining packages */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-1.5">
            <Flame size={18} className="text-orange-400 sm:w-5 sm:h-5" />
            <span className="text-base sm:text-xl font-extrabold tracking-wide">FLASH SALE</span>
          </div>
          <span
            className="text-lg sm:text-2xl font-extrabold bg-orange-500 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg"
            style={{ animation: "discountPulse 1.8s ease-in-out infinite" }}
          >-20%</span>
          <div className="hidden lg:block">
            <p className="text-sm font-bold">For one-year REGISTRATION</p>
            <p className="text-[10px] text-white/60">*promotions cannot be combined</p>
          </div>
          {/* Remaining packages — inline on mobile/tablet */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <div className="h-5 w-px bg-white/30" />
            <span className={`text-2xl font-extrabold tabular-nums transition-colors ${remaining <= 5 ? "text-red-400" : "text-white"}`}>
              {remaining}
            </span>
            <div className="text-left">
              <p className="text-[10px] text-white/70 font-medium leading-tight">remaining</p>
              <p className="text-[10px] text-white/70 font-medium leading-tight">{remaining === 1 ? "package" : "packages"}</p>
            </div>
          </div>
        </div>
        {/* Subtext — visible on mobile and tablet */}
        <p className="lg:hidden text-[10px] text-white/50 font-medium">For one-year registration · *promotions cannot be combined</p>

        {/* Center: Remaining packages — desktop only */}
        <div className="hidden lg:flex items-center gap-2.5">
          <span className={`text-5xl font-extrabold tabular-nums transition-colors ${remaining <= 5 ? "text-red-400" : "text-white"}`}>
            {remaining}
          </span>
          <div className="text-left">
            <p className="text-sm text-white/70 font-medium leading-tight">remaining</p>
            <p className="text-sm text-white/70 font-medium leading-tight">{remaining === 1 ? "package" : "packages"}</p>
          </div>
        </div>

        {/* Right / Bottom row on mobile: Flip-clock countdown */}
        <div className="flex items-center gap-1 lg:gap-2" aria-label="Countdown timer">
          {[
            { value: pad(timeLeft.days), prev: pad(prev.days), label: "Days" },
            { value: pad(timeLeft.hours), prev: pad(prev.hours), label: "Hours" },
            { value: pad(timeLeft.minutes), prev: pad(prev.minutes), label: "Minutes" },
            { value: pad(timeLeft.seconds), prev: pad(prev.seconds), label: "Seconds" },
          ].map((unit, i) => (
            <div key={unit.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <span className="text-[9px] sm:text-[10px] text-white/60 font-medium uppercase mb-1">{unit.label}</span>
                <div className="flex gap-[3px]">
                  {unit.value.split("").map((d, j) => (
                    <FlipDigit key={j} digit={d} prevDigit={unit.prev[j]} />
                  ))}
                </div>
              </div>
              {i < 3 && <span className="text-white/70 font-bold text-2xl mx-1 mt-4">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Flip clock CSS — LIGHT style, compact 3D flip */}
      <style>{`
        /* ── Card container ── */
        .fc {
          --fc-w: 24px;
          --fc-h: 34px;
          --fc-fs: 20px;
          position: relative;
          width: var(--fc-w);
          height: var(--fc-h);
          perspective: 200px;
          border-radius: 5px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06);
        }
        @media (min-width: 640px) {
          .fc {
            --fc-w: 30px;
            --fc-h: 42px;
            --fc-fs: 26px;
          }
        }

        /* ── Shared half-card styling ── */
        .fc-top, .fc-bot {
          position: absolute; left: 0; right: 0;
          height: 50%; overflow: hidden;
        }
        .fc-top span, .fc-bot span {
          position: absolute;
          left: 0; right: 0;
          height: var(--fc-h);
          font-size: var(--fc-fs);
          font-weight: 700;
          color: #1e293b;
          line-height: var(--fc-h);
          text-align: center;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── Top half ── */
        .fc-top {
          top: 0;
          border-radius: 5px 5px 0 0;
          background: linear-gradient(180deg, #fff 0%, #f1f5f9 100%);
        }
        .fc-top span { top: 0; }

        /* ── Bottom half ── */
        .fc-bot {
          bottom: 0;
          border-radius: 0 0 5px 5px;
          background: linear-gradient(180deg, #eaeff4 0%, #f1f5f9 100%);
        }
        .fc-bot span { bottom: 0; }

        /* ── Flipping panels ── */
        .fc-flap-top {
          z-index: 3;
          transform-origin: bottom center;
          transform: rotateX(0deg);
          backface-visibility: hidden;
        }
        .fc-flap-bot {
          z-index: 2;
          transform-origin: top center;
          transform: rotateX(180deg);
          backface-visibility: hidden;
        }

        .fc-flap-top.fc-go {
          animation: fcDown 0.3s ease-in forwards;
        }
        .fc-flap-bot.fc-go {
          animation: fcUp 0.3s 0.25s ease-out forwards;
        }
        @keyframes fcDown {
          to { transform: rotateX(-90deg); }
        }
        @keyframes fcUp {
          from { transform: rotateX(90deg); }
          to   { transform: rotateX(0deg); }
        }

        /* ── Hinge ── */
        .fc-hinge {
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px; z-index: 10;
          background: #cbd5e1;
          transform: translateY(-0.5px);
        }

        /* ── Subtle inner shadow on top half ── */
        .fc-top::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 30%; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.03));
        }
      `}</style>
    </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING NAV — top bar inside hero (logo left, utils right)
   ═══════════════════════════════════════════════════ */
function PricingNav() {
  const [currOpen, setCurrOpen] = useState(false);
  const [currency, setCurrency] = useState(PRICING_CURRENCIES[0]);
  const currRef = useRef(null);

  // Close currency dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (currRef.current && !currRef.current.contains(e.target)) setCurrOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="inline-flex items-center gap-2 group">
          <WholesaleUpIcon className="w-10 h-10" />
          <span className="text-[22px] sm:text-2xl font-extrabold tracking-tight text-white drop-shadow-md">
            wholesale<span className="text-orange-500">up</span>
          </span>
        </Link>

        {/* Right: email, currency, auth */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Email — hidden on small screens */}
          <a href="mailto:service@wholesaleup.com"
            className="hidden lg:flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
            aria-label="Email support"
          >
            <Mail size={16} />
            <span>service@wholesaleup.com</span>
          </a>

          <div className="hidden lg:block w-px h-4 bg-white/25" />

          {/* Currency dropdown */}
          <div ref={currRef} className="relative">
            <button onClick={() => setCurrOpen(!currOpen)}
              className="flex items-center gap-1 text-white/70 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap">
              <Globe size={16} className="shrink-0" /> {currency.symbol} {currency.code}
              <ChevronDown size={12} className={`shrink-0 transition-transform ${currOpen ? "rotate-180" : ""}`} />
            </button>
            {currOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[100px]">
                {PRICING_CURRENCIES.map((c) => (
                  <button key={c.code} onClick={() => { setCurrency(c); setCurrOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${currency.code === c.code ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-white/25" />

          {/* Log In button */}
          <a href="/register#login" onClick={(e) => { e.preventDefault(); window.location.href = "/register#login"; window.scrollTo({ top: 0 }); }}
            className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 text-sm font-semibold text-white/80 hover:text-white sm:border sm:border-white/30 sm:hover:border-orange-400 sm:hover:text-orange-400 rounded-lg sm:rounded-full active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap"
            aria-label="Log In"
          >
            <User size={18} className="shrink-0" /> <span className="hidden sm:inline">Log In</span>
          </a>

          {/* Join Free button */}
          <Link href="/register" scroll={true} onClick={() => setTimeout(() => window.scrollTo({ top: 0 }), 50)}
            className="inline-flex items-center justify-center h-9 sm:h-auto px-3.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-full transition-all duration-150 shadow-sm whitespace-nowrap"
            aria-label="Join Free"
          >
            <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join Free</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function PricingHero({ transparent = false }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background image — only shown for warehouse variant */}
      {!transparent && (
        <div className="absolute inset-0">
          <Image
            src="/images/hero-warehouse.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100%"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/50 to-slate-900/65" />
        </div>
      )}

      {/* Top nav — logo left, email + currency + auth right */}
      <PricingNav />

      {/* Hero content — left-aligned, matching table max-width */}
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-32 sm:pb-40 text-left">
        <h1 className={`text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-extrabold leading-[1.15] ${transparent ? "text-white" : "text-white drop-shadow-lg"}`}>
          Increase your sales,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400">
            buy cheap
          </span>
          {" "}from wholesale<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">up</span>
        </h1>

        <p className={`mt-4 text-base sm:text-lg max-w-2xl leading-relaxed ${transparent ? "text-sky-100/80" : "text-white/85 drop-shadow-sm"}`}>
          Wholesale, liquidation &amp; dropship goods from the internet&apos;s largest network of verified wholesalers, excess stock suppliers and clearance distributors
        </p>

        {/* Stats bar */}
        <div className={`mt-8 w-full max-w-xl lg:max-w-2xl rounded-2xl border shadow-lg ${transparent ? "bg-white/10 backdrop-blur-sm border-white/15 shadow-black/5" : "bg-white/40 backdrop-blur-md border-white/25 shadow-black/10"}`}>
          <div className={`grid grid-cols-3 divide-x ${transparent ? "divide-white/15" : "divide-slate-300/30"}`}>
            {[
              { value: "45,600+", label: "Verified suppliers", icon: Globe, color: "text-blue-500" },
              { value: "901,900+", label: "Resellers", icon: Users, color: "text-emerald-500" },
              { value: "95%", label: "Below retail", icon: Zap, color: "text-orange-500" },
            ].map((stat) => (
              <div key={stat.label} className="py-3 sm:py-5 px-2 sm:px-5 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${transparent ? "bg-white/10 border border-white/20" : "bg-white/80 border border-white/90 shadow-sm"}`}>
                  <stat.icon size={16} className={`${transparent ? "text-sky-200" : stat.color} sm:w-[18px] sm:h-[18px]`} />
                </div>
                <div className="min-w-0">
                  <span className={`text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight whitespace-nowrap block leading-tight ${transparent ? "text-white" : "text-white/90"}`} style={transparent ? {} : { textShadow: "1px 2px 4px rgba(15,23,42,0.5)" }}>{stat.value}</span>
                  <p className={`text-[10px] sm:text-sm leading-tight ${transparent ? "text-sky-100/70" : "text-white/80"}`} style={transparent ? {} : { textShadow: "0 1px 3px rgba(15,23,42,0.4)" }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING ROW — Shared between top and bottom of table
   ═══════════════════════════════════════════════════ */
function PricingRow({ period, setPeriod, currency, setCurrency, position = "top" }) {
  const periods = [
    { id: "1-month", label: "1 Month" },
    { id: "6-months", label: "6 Months" },
    { id: "1-year", label: "1 Year", badge: "BEST VALUE" },
  ];

  return (
    <div className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] ${position === "top" ? "border-b-2" : "border-t-2"} border-slate-200 bg-slate-50`}>
      {/* Access Period toggle cell */}
      <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900">Access Period</h3>
          <PricingTooltip text="Choose how long you'd like access. Longer plans offer bigger savings. You can upgrade or renew at any time.">
            <HelpCircle size={16} />
          </PricingTooltip>
        </div>
        <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-100 rounded-xl p-1 sm:p-1.5 self-start">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all ${
                period === p.id
                  ? "bg-white text-orange-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              {p.label}
              {p.badge && (
                <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 px-2 sm:px-2.5 py-1 text-[7px] sm:text-[8px] font-extrabold tracking-wider bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full whitespace-nowrap shadow-sm">
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Standard */}
      <TierPriceCell tier="standard" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />

      {/* Premium — highlighted column */}
      <TierPriceCell tier="premium" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} isPopular />

      {/* Premium+ */}
      <TierPriceCell tier="premiumPlus" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />
    </div>
  );
}

/* ─── Individual tier price + CTA cell ─── */
function PeriodDropdownCell({ tierKey, period, setPeriod }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const periods = [
    { id: "1-month", label: "1 Month" },
    { id: "6-months", label: "6 Months" },
    { id: "1-year", label: "12 Months" },
  ];

  useEffect(() => {
    if (!dropdownOpen) return;
    const handle = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdownOpen]);

  return (
    <div className={`p-4 sm:p-5 flex items-center justify-center ${tierKey === "premium" ? "bg-orange-50/30 relative before:content-[''] before:absolute before:top-[-2px] before:bottom-[-2px] before:left-0 before:right-0 before:border-x-2 before:border-orange-400 before:z-20 before:pointer-events-none" : ""}`}>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide cursor-pointer transition-all px-3 py-1 ${
            dropdownOpen
              ? "text-slate-800 bg-white border border-slate-300 shadow-sm rounded-t-lg border-b-0"
              : "text-slate-800 border border-transparent rounded-lg hover:border-slate-300 hover:bg-white hover:shadow-sm"
          }`}
        >
          {period === "1-month" ? "1 Month" : period === "6-months" ? "6 Months" : "12 Months"}
          <ChevronDown size={13} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg border border-t-0 border-slate-300 shadow-sm z-50 py-1 overflow-hidden">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPeriod(p.id); setDropdownOpen(false); }}
                className={`w-full px-3 py-1.5 text-xs font-semibold text-left transition-colors ${
                  period === p.id ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TierPriceCell({ tier, period, setPeriod, currency, setCurrency, isPopular = false }) {
  const data = PRICING[period]?.[tier];
  const names = { standard: "STANDARD", premium: "PREMIUM", premiumPlus: "PREMIUM+" };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);
  const currDropdownRef = useRef(null);
  const periods = [
    { id: "1-month", label: "1 Month" },
    { id: "6-months", label: "6 Months" },
    { id: "1-year", label: "1 Year" },
  ];
  const currObj = PRICING_CURRENCIES.find((c) => c.code === currency) || PRICING_CURRENCIES[0];
  const convertedPrice = (data.price * currObj.rate).toFixed(2);
  const convertedOriginal = data.original ? (data.original * currObj.rate).toFixed(2) : null;

  // Close on outside click — period dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handle = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdownOpen]);

  // Close on outside click — currency dropdown
  useEffect(() => {
    if (!currDropdownOpen) return;
    const handle = (e) => { if (currDropdownRef.current && !currDropdownRef.current.contains(e.target)) setCurrDropdownOpen(false); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [currDropdownOpen]);

  return (
    <div className={`p-2 sm:p-4 md:p-6 text-center flex flex-col items-center overflow-hidden ${
      isPopular ? "bg-orange-50/50 relative before:content-[''] before:absolute before:top-[-2px] before:bottom-[-2px] before:left-0 before:right-0 before:border-x-2 before:border-orange-400 before:z-20 before:pointer-events-none" : ""
    }`}>
      <h4 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 uppercase tracking-wider mb-1 sm:mb-2">{names[tier]}</h4>

      {convertedOriginal ? (
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-1 flex-wrap">
          <span className="text-xs sm:text-sm text-slate-400 line-through">{currObj.symbol}{convertedOriginal}</span>
          <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold bg-amber-400 text-white rounded-md">
            -{data.discount}% off
          </span>
        </div>
      ) : (
        <div className="h-[18px] sm:h-[22px]" />
      )}

      {/* Price with currency dropdown */}
      <div className="relative" ref={currDropdownRef}>
        <button
          onClick={() => setCurrDropdownOpen(!currDropdownOpen)}
          className={`inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer transition-all px-2 sm:px-4 py-1 sm:py-1.5 ${
            currDropdownOpen
              ? "text-slate-900 bg-white border border-slate-300 shadow-sm rounded-t-lg border-b-0"
              : "text-slate-900 border border-transparent rounded-lg hover:border-slate-300 hover:bg-white hover:shadow-sm"
          }`}
        >
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{currObj.symbol}{convertedPrice}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform mt-1 ${currDropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {currDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg border border-t-0 border-slate-300 shadow-sm z-50 py-1 overflow-hidden">
            {PRICING_CURRENCIES.slice(0, 3).map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setCurrDropdownOpen(false); }}
                className={`w-full px-3 py-1.5 text-sm font-semibold text-left transition-colors flex items-center gap-2 ${
                  currency === c.code ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <span>{c.symbol}</span>
                <span>{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Period selector dropdown */}
      <div className="relative mt-0.5 mb-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`inline-flex items-center gap-1 text-xs cursor-pointer transition-all px-2.5 py-0.5 ${
            dropdownOpen
              ? "text-slate-600 bg-white border border-slate-300 shadow-sm rounded-t-md border-b-0"
              : "text-slate-400 border border-transparent rounded-md hover:text-slate-600 hover:border-slate-300 hover:bg-white hover:shadow-sm"
          }`}
        >
          {PERIOD_LABELS[period]}
          <ChevronDown size={12} className={`text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-b-md border border-t-0 border-slate-300 shadow-sm z-50 py-1 overflow-hidden">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => { setPeriod(p.id); setDropdownOpen(false); }}
                className={`w-full px-3 py-1.5 text-xs font-semibold text-left transition-colors ${
                  period === p.id ? "text-orange-600 bg-orange-50" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className={`w-full py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-extrabold flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 ${
        isPopular
          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200/60"
          : "border-2 border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50"
      }`}>
        <Rocket size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] shrink-0" /> Upgrade
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   UNIFIED PRICING TABLE — 4 columns
   ═══════════════════════════════════════════════════ */
function UnifiedPricingTable({ period, setPeriod, currency, setCurrency }) {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        {/* Top spacer + badge that sticks out above the table */}
        <div className="relative">
          {/* Orange badge — sits above the table card, aligned to Premium column */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] pointer-events-none" aria-hidden="true">
            <div />
            <div />
            <div className="flex">
              <div className="bg-orange-500 w-full py-3 rounded-t-2xl text-center shadow-lg shadow-orange-300/40">
                <p className="text-white text-base font-extrabold flex items-center justify-center gap-2 whitespace-nowrap">
                  <Flame size={17} />
                  85% Of Customers
                </p>
              </div>
            </div>
            <div />
          </div>
          {/* Table — rounded, no overflow-hidden so badge visually connects */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl relative">
            {/* Top pricing row with satisfaction badge inline */}
            <div className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] border-b-2 border-slate-200 bg-slate-50 rounded-t-3xl overflow-visible`}>
              {/* Left cell: Satisfaction badge + Access Period */}
              <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-6 flex flex-col justify-center">
                {/* Satisfaction badge — shares top-left corner with table */}
                <a href="/testimonials" className="group cursor-pointer self-start mb-4 sm:mb-6 -mt-4 sm:-mt-6 md:-mt-8 -ml-4 sm:-ml-6 md:-ml-8">
                  <div className="relative rounded-tl-3xl rounded-br-2xl bg-slate-50 border-b border-r border-slate-200/80 px-4 sm:px-6 md:px-8 py-4 sm:py-5 transition-all group-hover:shadow-md group-hover:bg-slate-100/80">
                    {/* Thumbs up — top left, flat emerald */}
                    <div className="flex items-start gap-2 sm:gap-3">
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <div>
                        <p className="text-base sm:text-lg font-semibold text-emerald-700 tracking-tight leading-tight">99%+ satisfied</p>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-normal mt-0.5">Confirmed by members worldwide</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5 text-amber-400 fill-current"><path d="M10 1l2.39 6.09H19l-5.3 4.18 1.84 6.73L10 13.77 4.46 18l1.84-6.73L1 7.09h6.61z" /></svg>
                          ))}
                          <span className="text-[11px] font-bold text-slate-500 ml-0.5">4.9/5</span>
                          <span className="text-[11px] text-orange-500 group-hover:text-orange-600 font-medium ml-0.5 group-hover:underline transition-colors">(12,847 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Access Period */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900">Access Period</h3>
                  <PricingTooltip text="Choose how long you'd like access. Longer plans offer bigger savings. You can upgrade or renew at any time.">
                    <HelpCircle size={16} />
                  </PricingTooltip>
                </div>
                <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-slate-100 rounded-xl p-1 sm:p-1.5 self-start">
                  {[
                    { id: "1-month", label: "1 Month" },
                    { id: "6-months", label: "6 Months" },
                    { id: "1-year", label: "1 Year", badge: "BEST VALUE" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPeriod(p.id)}
                      className={`relative px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-sm font-bold transition-all ${
                        period === p.id
                          ? "bg-white text-orange-600 shadow-md"
                          : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                      }`}
                    >
                      {p.label}
                      {p.badge && (
                        <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 px-2 sm:px-2.5 py-1 text-[7px] sm:text-[8px] font-extrabold tracking-wider bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full whitespace-nowrap shadow-sm">
                          {p.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier price cells */}
              <TierPriceCell tier="standard" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />
              <TierPriceCell tier="premium" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} isPopular />
              <TierPriceCell tier="premiumPlus" period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />
            </div>

            {/* Access Period feature row */}
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] border-t border-slate-100">
              <div className="p-3 sm:p-4 md:p-5 px-4 sm:px-6 md:px-8">
                <span className="text-sm sm:text-base text-slate-700 font-medium">Access Period</span>
                <PricingTooltip text="The duration of your subscription. Choose between 1 month, 6 months, or 12 months for the best value.">
                  <HelpCircle size={13} className="inline-block ml-1.5 -mt-0.5 text-slate-400" />
                </PricingTooltip>
              </div>
              {["standard", "premium", "premiumPlus"].map((tierKey) => (
                <PeriodDropdownCell key={tierKey} tierKey={tierKey} period={period} setPeriod={setPeriod} />
              ))}
            </div>

            {/* Feature rows */}
            {ALL_FEATURES.map((feature, i) => (
              <div key={i} className={`grid grid-cols-[1.6fr_1fr_1fr_1fr] border-t border-slate-100 ${(i + 1) % 2 !== 0 ? "bg-slate-50/40" : ""}`}>
                <div className="p-3 sm:p-4 md:p-5 px-4 sm:px-6 md:px-8">
                  <span className="text-sm sm:text-base text-slate-700 font-medium">{feature.label}</span>
                  {feature.tip && (
                    <PricingTooltip text={feature.tip}>
                      <HelpCircle size={13} className="inline-block ml-1.5 -mt-0.5 text-slate-400" />
                    </PricingTooltip>
                  )}
                </div>
                {["standard", "premium", "premiumPlus"].map((tierKey) => (
                  <div key={tierKey} className={`p-4 sm:p-5 flex items-center justify-center ${tierKey === "premium" ? "bg-orange-50/30 relative before:content-[''] before:absolute before:top-[-2px] before:bottom-[-2px] before:left-0 before:right-0 before:border-x-2 before:border-orange-400 before:z-20 before:pointer-events-none" : ""}`}>
                    {feature[tierKey] ? (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-orange-500">
                        <Check size={15} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <X size={16} className="text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Bottom pricing row (repeated) */}
            <PricingRow period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} position="bottom" />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Accordion per tier */}
      <div className="lg:hidden">
        <MobilePricing period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE PRICING — accordion per tier
   ═══════════════════════════════════════════════════ */
function MobilePricing({ period, setPeriod, currency, setCurrency }) {
  const [expandedTier, setExpandedTier] = useState("premium");

  const periods = [
    { id: "1-month", label: "1 Month" },
    { id: "6-months", label: "6 Months" },
    { id: "1-year", label: "1 Year", badge: "BEST VALUE" },
  ];

  return (
    <div className="space-y-5">
      {/* Period toggle */}
      <div className="text-center">
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-5">Access Period</p>
        <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-xl p-1.5">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`relative px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                period === p.id
                  ? "bg-white text-orange-600 shadow-md"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }`}
            >
              {p.label}
              {p.badge && (
                <span className="absolute -top-[22px] left-1/2 -translate-x-1/2 px-2 py-0.5 text-[7px] font-extrabold tracking-wider bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full whitespace-nowrap shadow-sm">
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tier accordions */}
      {[
        { key: "standard", name: "Standard", icon: Shield, color: "text-slate-500", bg: "bg-slate-100", borderActive: "border-slate-300" },
        { key: "premium", name: "Premium", icon: Crown, color: "text-orange-500", bg: "bg-orange-100", borderActive: "border-orange-500", popular: true },
        { key: "premiumPlus", name: "Premium+", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-100", borderActive: "border-amber-400" },
      ].map((tier) => {
        const data = PRICING[period]?.[tier.key];
        const isExpanded = expandedTier === tier.key;

        return (
          <div key={tier.key} className={`rounded-2xl border-2 ${isExpanded ? tier.borderActive : "border-slate-200"} overflow-hidden bg-white shadow-sm`}>
            {tier.popular && (
              <div className="bg-orange-500 py-2 text-center">
                <p className="text-white text-sm font-extrabold flex items-center justify-center gap-1.5">
                  <Flame size={15} /> 85% Of Customers
                </p>
              </div>
            )}
            <button
              onClick={() => setExpandedTier(isExpanded ? "" : tier.key)}
              className={`w-full p-5 flex items-center justify-between ${tier.popular && isExpanded ? "bg-orange-50/50" : ""}`}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${tier.name} plan details`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tier.bg}`}>
                  <tier.icon size={18} className={tier.color} />
                </div>
                <div className="text-left">
                  <p className="text-base font-extrabold text-slate-900 uppercase">{tier.name}</p>
                  <div className="flex items-center gap-2">
                    {data.original && (() => {
                      const cc = PRICING_CURRENCIES.find((c) => c.code === currency) || PRICING_CURRENCIES[0];
                      return (
                        <>
                          <span className="text-xs text-slate-400 line-through">{cc.symbol}{(data.original * cc.rate).toFixed(2)}</span>
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-400 text-white rounded-md">-{data.discount}%</span>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">
                    {(PRICING_CURRENCIES.find((c) => c.code === currency) || PRICING_CURRENCIES[0]).symbol}{(data.price * (PRICING_CURRENCIES.find((c) => c.code === currency) || PRICING_CURRENCIES[0]).rate).toFixed(2)} <span className="text-xs text-slate-400 font-medium">/ {PERIOD_LABELS[period]}</span>
                  </p>
                </div>
              </div>
              <ChevronDown size={20} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 px-5 py-4 space-y-2">
                {ALL_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    {feature[tier.key] ? (
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <X size={14} className="text-slate-300 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${feature[tier.key] ? "text-slate-700" : "text-slate-400"}`}>{feature.label}</span>
                  </div>
                ))}
                <button className={`w-full mt-4 mb-2 py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 ${
                  tier.popular
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200/60"
                    : "border-2 border-slate-300 text-slate-700 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50"
                }`}>
                  <Rocket size={18} /> Upgrade
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SELLER BANNER — Horizontal, with illustrations
   ═══════════════════════════════════════════════════ */
function SellerBanner() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-none sm:rounded-none rounded-b-2xl sm:rounded-b-3xl border border-slate-200 shadow-lg p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative overflow-hidden">
        {/* Left illustration placeholder */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <svg viewBox="0 0 80 80" fill="none" className="w-14 h-14">
            <ellipse cx="40" cy="42" rx="24" ry="22" fill="#FED7AA" opacity="0.5" />
            <rect x="20" y="30" width="20" height="30" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <rect x="45" y="24" width="16" height="36" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <path d="M24 34h12M49 28h8M49 34h8" stroke="#1E293B" strokeWidth="1" />
          </svg>
          <svg viewBox="0 0 80 80" fill="none" className="w-12 h-12">
            <ellipse cx="40" cy="40" rx="22" ry="22" fill="#FED7AA" opacity="0.5" />
            <rect x="22" y="28" width="36" height="28" rx="3" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <circle cx="40" cy="42" r="8" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <path d="M36 28V22h8v6" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">Do You Supply Products?</h3>
          <p className="text-base text-slate-500 leading-relaxed">
            Want to sell your products worldwide? Register as a supplier to publish offers, promote your business, and connect directly with customers.
          </p>
        </div>

        {/* CTA */}
        <button className="shrink-0 w-full sm:w-auto px-8 py-3.5 border-2 border-orange-400 text-orange-500 text-base font-extrabold rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
          <Store size={18} />
          Register as Supplier
        </button>

        {/* Right illustration placeholder */}
        <div className="hidden lg:flex items-center shrink-0">
          <svg viewBox="0 0 80 80" fill="none" className="w-14 h-14">
            <ellipse cx="40" cy="42" rx="24" ry="22" fill="#FED7AA" opacity="0.5" />
            <rect x="24" y="28" width="32" height="28" rx="3" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="40" r="4" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <path d="M42 36h10M42 42h8M42 48h6" stroke="#1E293B" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SATISFIED USERS BLOCK
   ═══════════════════════════════════════════════════ */
function SatisfiedUsersBlock() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-10 sm:p-14">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="shrink-0">
          <div className="relative">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center shadow-2xl shadow-orange-200/60">
              <ThumbsUp size={64} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-xl px-3 py-1.5 shadow-lg border border-orange-100">
              <span className="text-lg font-extrabold text-orange-500">99.9%</span>
            </div>
          </div>
        </div>

        <div className="text-center lg:text-left flex-1">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
            Satisfied users worldwide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { value: "99.9%", label: "Satisfied users", color: "text-orange-500" },
              { value: "1,000+", label: "Positive feedback", color: "text-amber-500" },
              { value: "150", label: "Customers from countries", color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className={`text-3xl sm:text-4xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MONEY BACK GUARANTEE
   ═══════════════════════════════════════════════════ */
function GuaranteeSection() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
      <div className="shrink-0">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl" />
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-slate-600" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex flex-col items-center justify-center text-center">
            <ShieldCheck size={20} className="text-orange-400 mb-0.5" />
            <span className="text-xl sm:text-2xl font-extrabold text-white">100%</span>
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Money-Back<br />Guarantee</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Our Risk-Free Promise!
        </h3>
        <p className="text-base text-slate-600 leading-relaxed mb-4">
          If you're not completely happy with WholesaleUp within 14 days, we'll refund your money.
          In full. No questions asked. No hard feelings.
        </p>
        <p className="text-base text-slate-600">
          That makes WholesaleUp <span className="font-extrabold text-slate-900">zero risk</span> for you!
        </p>
        <a href="/contact" className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
          Need help choosing the right plan? <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   WHY CHOOSE US — Us vs Them
   ═══════════════════════════════════════════════════ */
function WhyChooseUs() {
  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Why Smart Sellers Choose{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">wholesaleup</span>
        </h2>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_140px_140px] bg-slate-900 p-5 px-6">
          <span className="text-sm font-bold text-slate-400">Feature</span>
          <span className="text-center text-sm font-extrabold text-orange-400">US</span>
          <span className="text-center text-sm font-bold text-slate-500">THEM</span>
        </div>
        {WHY_CHOOSE_US.map((item, i) => (
          <div key={i} className={`grid grid-cols-[1fr_90px_90px] sm:grid-cols-[1fr_140px_140px] p-4 px-6 border-t border-slate-100 ${i % 2 !== 0 ? "bg-slate-50/50" : ""}`}>
            <span className="text-sm font-semibold text-slate-700">{item.feature}</span>
            <div className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check size={15} className="text-emerald-600" strokeWidth={3} />
              </div>
            </div>
            <div className="flex items-center justify-center">
              {item.them === false ? (
                <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center">
                  <X size={14} className="text-red-400" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
                  <span className="text-amber-500 text-sm font-bold">~</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATS SECTION
   ═══════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-400 rounded-full -translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl" />
      </div>
      <div className="relative px-8 sm:px-12 py-12 sm:py-14 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Trusted by Businesses of All Sizes</h2>
        <p className="text-slate-400 text-base mb-10 max-w-lg mx-auto">
          Join thousands of businesses worldwide who rely on us for profitable wholesale and dropship deals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: Flame, value: "366.61%", label: "Average markup of wholesale prices", color: "text-orange-400" },
            { icon: Package, value: "14,891+", label: "Active Deals as of today", color: "text-orange-400" },
            { icon: Users, value: "300+", label: "New Suppliers in the past 7 days", color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <stat.icon size={26} className={stat.color} />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-1.5 max-w-[200px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAYMENT METHODS
   ═══════════════════════════════════════════════════ */
function PaymentMethods() {
  return (
    <div className="text-center py-4">
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 px-4 sm:px-8 lg:px-0 lg:max-w-[700px] mx-auto">
        {/* PayPal */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm" title="PayPal">
          <span style={{fontSize: 16, fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#003087"}}>Pay</span>
          <span style={{fontSize: 16, fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#009CDE"}}>Pal</span>
        </div>
        {/* Visa */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm" title="Visa">
          <span style={{fontSize: 18, fontWeight: 700, fontStyle: "italic", color: "#1A1F71", fontFamily: "Arial, sans-serif"}}>VISA</span>
        </div>
        {/* Mastercard */}
        <div className="h-11 sm:h-12 px-3.5 sm:px-4 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm" title="Mastercard">
          <div className="relative" style={{width: 32, height: 20}}>
            <div className="absolute rounded-full" style={{width: 20, height: 20, left: 0, top: 0, backgroundColor: "#EB001B"}} />
            <div className="absolute rounded-full" style={{width: 20, height: 20, right: 0, top: 0, backgroundColor: "#F79E1B", mixBlendMode: "multiply"}} />
          </div>
        </div>
        {/* Amex */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg flex items-center justify-center shadow-sm" style={{backgroundColor: "#006FCF"}} title="American Express">
          <span style={{fontSize: 13, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: 0.5}}>AMEX</span>
        </div>
        {/* Apple Pay */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg bg-black flex items-center justify-center gap-1 shadow-sm" title="Apple Pay">
          <svg width="12" height="15" viewBox="0 0 10 12" fill="none">
            <path d="M6.8 2c-.4.5-1.1.9-1.7.9-.1-.7.2-1.4.6-1.8C6.1.6 6.9.2 7.4.2c.1.7-.2 1.3-.6 1.8zm.6 1c-.9 0-1.8.5-2.2.5-.5 0-1.2-.5-2-.5C1.6 3 0 4.4 0 7c0 1.6.6 3.2 1.4 4.3.6.9 1.2 1.7 2.1 1.7.8 0 1.2-.6 2.2-.6 1 0 1.3.6 2.2.5.9 0 1.5-.8 2.1-1.7.4-.6.7-1.3.9-2C8.6 8.2 8.7 5.9 10 5c-.6-.8-1.5-1.2-2.4-1.2-.3 0-.7.1-1.2.2z" fill="white"/>
          </svg>
          <span style={{fontSize: 14, fontWeight: 600, color: "white", fontFamily: "Arial, sans-serif"}}>Pay</span>
        </div>
        {/* Google Pay */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center gap-0.5 shadow-sm" title="Google Pay">
          <span style={{fontSize: 14, fontWeight: 700, color: "#4285F4", fontFamily: "Arial, sans-serif"}}>G</span>
          <span style={{fontSize: 13, fontWeight: 500, color: "#5F6368", fontFamily: "Arial, sans-serif"}}>Pay</span>
        </div>
        {/* UnionPay */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg flex items-center justify-center shadow-sm" style={{background: "linear-gradient(135deg, #D50032 0%, #01798A 50%, #003B72 100%)"}} title="UnionPay">
          <span style={{fontSize: 12, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: 0.3}}>UnionPay</span>
        </div>
        {/* iDEAL */}
        <div className="h-11 sm:h-12 px-4 sm:px-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm" title="iDEAL">
          <span style={{fontSize: 13, fontWeight: 700, color: "#CC0066", fontFamily: "Arial, sans-serif"}}>iDEAL</span>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
        <Lock size={12} />
        256-bit encryption &mdash; Your data is fully encrypted and secure.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GUARANTEE PROMISE PANEL
   ═══════════════════════════════════════════════════ */
function GuaranteePanel() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-blue-50/80 rounded-2xl sm:rounded-3xl border border-blue-100 p-8 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-10 lg:gap-14">
        {/* Badge */}
        <div className="shrink-0">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36">
            {/* Outer serrated circle */}
            <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-md">
              {/* Serrated edge */}
              <path d="M70.00,2.00L77.83,10.51L87.60,4.32L92.96,14.57L104.00,11.11L106.53,22.40L118.08,21.92L117.60,33.47L128.89,36.00L125.43,47.04L135.68,52.40L129.49,62.17L138.00,70.00L129.49,77.83L135.68,87.60L125.43,92.96L128.89,104.00L117.60,106.53L118.08,118.08L106.53,117.60L104.00,128.89L92.96,125.43L87.60,135.68L77.83,129.49L70.00,138.00L62.17,129.49L52.40,135.68L47.04,125.43L36.00,128.89L33.47,117.60L21.92,118.08L22.40,106.53L11.11,104.00L14.57,92.96L4.32,87.60L10.51,77.83L2.00,70.00L10.51,62.17L4.32,52.40L14.57,47.04L11.11,36.00L22.40,33.47L21.92,21.92L33.47,22.40L36.00,11.11L47.04,14.57L52.40,4.32L62.17,10.51Z" fill="url(#badgeGrad)" />
              <defs>
                <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="50%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#1e3a5f" />
                </linearGradient>
              </defs>
              {/* Inner white ring */}
              <circle cx="70" cy="70" r="52" fill="none" stroke="white" strokeWidth="3" opacity="0.6" />
              <circle cx="70" cy="70" r="48" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
              {/* Checkmark */}
              <circle cx="70" cy="40" r="10" fill="none" stroke="#34d399" strokeWidth="2" />
              <path d="M64 40l4 4 8-8" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* 100% text */}
              <text x="70" y="68" textAnchor="middle" fill="white" fontWeight="800" fontSize="22" fontFamily="DM Sans, sans-serif">100%</text>
              {/* Satisfaction Guaranteed */}
              <text x="70" y="82" textAnchor="middle" fill="#34d399" fontWeight="600" fontSize="9" fontFamily="DM Sans, sans-serif">Satisfaction</text>
              <text x="70" y="93" textAnchor="middle" fill="#34d399" fontWeight="600" fontSize="9" fontFamily="DM Sans, sans-serif">Guaranteed</text>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Our Promise to You</h3>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            With over 20 years&apos; experience, our team is fanatical about connecting resellers with the world&apos;s best suppliers. In addition to our unlimited custom sourcing support pledge, if we don&apos;t match you with the right suppliers for your business, we&apos;ll refund your money. In full. No questions asked. No hard feelings &mdash; and you get to keep your premium access.
          </p>
          <p className="text-base sm:text-lg text-slate-700 font-semibold mt-4">
            That makes WholesaleUp zero risk for you!
          </p>
          <p className="text-sm sm:text-base text-slate-500 mt-4">
            Need help choosing the right plan?{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors">Contact</a>
            {" "}our friendly customer success team.
          </p>
        </div>
      </div>
    </div>
  );
}


function ComparisonIcon({ type, tip }) {
  const icon = type === "yes" ? (
    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
      <Check size={16} className="text-emerald-600" />
    </div>
  ) : type === "no" ? (
    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
      <X size={16} className="text-red-400" />
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
      <span className="text-amber-400 font-bold text-sm">~</span>
    </div>
  );

  if (!tip) return icon;

  return (
    <span className="relative inline-flex items-center">
      <span
        className="inline-flex cursor-help group"
      >
        {icon}
        <span className="absolute bottom-full right-0 mb-2 w-56 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg leading-relaxed z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {tip}
          <span className="absolute top-full right-4 border-4 border-transparent border-t-slate-800" />
        </span>
      </span>
    </span>
  );
}

function ComparisonPanel() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xl overflow-visible">
        {/* Heading inside panel */}
        <div className="text-center px-6 sm:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Why Smart Sellers Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">wholesaleup</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 mt-3 max-w-2xl mx-auto">See how we compare to other wholesale directories</p>
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-[1fr_60px_40px_60px] sm:grid-cols-[1fr_100px_80px_100px] items-center border-y border-slate-200 bg-slate-50/80 pr-8 sm:pr-14 lg:pr-20">
          <div className="px-8 sm:px-14 lg:px-20 py-3.5 text-sm font-bold text-slate-400 uppercase tracking-wider">Feature</div>
          <div className="py-3.5 text-center">
            <span className="text-sm font-extrabold text-orange-500 uppercase tracking-wider">Us</span>
          </div>
          <div />
          <div className="py-3.5 text-center">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Them</span>
          </div>
        </div>

        {/* Feature rows */}
        {COMPARISON_FEATURES.map((feature, i) => (
          <div key={feature.label} className={`grid grid-cols-[1fr_60px_40px_60px] sm:grid-cols-[1fr_100px_80px_100px] pr-8 sm:pr-14 lg:pr-20 border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
            <div className="px-8 sm:px-14 lg:px-20 py-4 sm:py-5 flex items-center">
              <span className="text-sm sm:text-base font-semibold text-slate-700">{feature.label}</span>
            </div>
            <div className="py-4 sm:py-5 flex items-center justify-center">
              <ComparisonIcon type={feature.us} />
            </div>
            <div />
            <div className="py-4 sm:py-5 flex items-center justify-center">
              <ComparisonIcon type={feature.them} tip={feature.themTip} />
            </div>
          </div>
        ))}

        {/* Bottom bar */}
        <div className="grid grid-cols-[1fr_60px_40px_60px] sm:grid-cols-[1fr_100px_80px_100px] pr-8 sm:pr-14 lg:pr-20 border-t-2 border-slate-200 bg-slate-50 rounded-b-2xl sm:rounded-b-3xl">
          <div className="px-8 sm:px-14 lg:px-20 py-5" />
          <div className="py-5 flex items-center justify-center">
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">12/12</span>
          </div>
          <div />
          <div className="py-5 flex items-center justify-center">
            <span className="text-xs font-extrabold text-red-400 bg-red-50 px-3 py-1.5 rounded-full">4/12</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
   ═══════════════════════════════════════════════════ */
function TestimonialsCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">What Our Members Say</h2>
          <p className="text-base text-slate-500 mt-2">Real stories from real businesses.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft} aria-label="Scroll testimonials left"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight} aria-label="Scroll testimonials right"
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronRight size={20} />
          </button>
          <a href="/testimonials" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors ml-3">
            All Testimonials <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="w-[340px] shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-all">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-base text-slate-700 leading-relaxed mb-5 line-clamp-4 font-medium">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {t.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{t.author}</p>
                <p className="text-xs text-slate-400">{t.label} — {t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:hidden text-center mt-5">
        <a href="/testimonials" className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600">
          Read more reviews <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════ */
function FAQSection() {
  const [openSet, setOpenSet] = useState(new Set([0]));
  const toggle = (i) => setOpenSet((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  /* FAQPage JSON-LD structured data — enables FAQ rich results in Google */
  const faqJsonLd = useMemo(() => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }), []);

  const half = Math.ceil(FAQS.length / 2);
  const leftFaqs = FAQS.slice(0, half);
  const rightFaqs = FAQS.slice(half);

  const renderFaq = (faq, i) => {
    const isOpen = openSet.has(i);
    return (
      <div
        key={i}
        className={`rounded-2xl border transition-all ${
          isOpen ? "border-orange-200 bg-orange-50/50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <button
          onClick={() => toggle(i)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"}: ${faq.q}`}
          className="w-full flex items-start gap-3 px-6 py-5 text-left"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isOpen ? "bg-orange-500" : "bg-slate-100"
          }`}>
            <ChevronDown size={15} className={`transition-transform ${
              isOpen ? "rotate-180 text-white" : "text-slate-400"
            }`} />
          </div>
          <h3 className={`text-base font-bold transition-colors ${
            isOpen ? "text-orange-700" : "text-slate-800"
          }`}>
            {faq.q}
          </h3>
        </button>
        {isOpen && (
          <div className="px-6 pb-5 pl-16">
            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* FAQPage structured data for rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
        <p className="text-base text-slate-500 mt-2">Have questions? We&apos;re here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-3">
          {leftFaqs.map((faq, i) => renderFaq(faq, i))}
        </div>
        <div className="space-y-3">
          {rightFaqs.map((faq, i) => renderFaq(faq, i + half))}
        </div>
      </div>

      {/* Need Assistance Panel */}
      <div className="mt-12 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 border border-slate-200">
        {/* Decorative background shapes */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 opacity-[0.06]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z" stroke="currentColor" strokeWidth="4" className="text-slate-900" /></svg>
        </div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 opacity-[0.06]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z" stroke="currentColor" strokeWidth="4" className="text-slate-900" /></svg>
        </div>

        <div className="relative px-6 sm:px-12 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 whitespace-nowrap">Have More Questions?</h3>
          <div className="hidden sm:block w-px h-8 bg-slate-300" />
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <a href="/help" className="text-sm font-semibold text-slate-500 hover:text-orange-500 transition-colors">Visit Help Center</a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-sm shadow-orange-200/50"
            >
              <Mail size={14} />
              Contact Support
            </a>
            <a href="/tour" className="text-sm font-semibold text-slate-500 hover:text-orange-500 transition-colors">Take a Tour</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRUSTED BY BUSINESSES — Testimonials + Stats Grid
   ═══════════════════════════════════════════════════ */
function TrustedByPanel() {
  const stats = [
    { value: "366.61%", label: "Average markup of wholesale prices", icon: TrendingUp, color: "text-orange-500" },
    { value: "14,891+", label: "Active Deals as of today", icon: Zap, color: "text-orange-500" },
    { value: "300+", label: "New Suppliers in the past 7 days", icon: Users, color: "text-orange-500" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">
        {/* Left column — heading, stats, CTA */}
        <div className="flex flex-col justify-between lg:sticky lg:top-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Trusted by Businesses of All Sizes
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              Join thousands of businesses worldwide who rely on us for profitable wholesale and dropship deals.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-orange-500 leading-tight">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="/testimonials"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-[0px_2px_4px_rgba(0,0,0,0.1)] active:scale-95"
            >
              All Testimonials <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Right column — scrollable testimonial masonry with fade edges */}
        <div className="relative max-h-[600px]">
          <style>{`.trusted-scroll::-webkit-scrollbar { display: none; }`}</style>
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-10 z-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgb(248 250 252), transparent)" }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to top, rgb(248 250 252), transparent)" }} />

          {/* Scrollable container */}
          <div
            className="trusted-scroll max-h-[600px] pt-2 pb-8"
            style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            <div style={{ columnCount: 2, columnGap: "1rem" }}>
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow mb-4"
                  style={{ breakInside: "avoid" }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-400">{t.label} &mdash; {t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STANDALONE NAV — Lightweight top bar for /pricing
   (replaces the AppLayout header on this page)
   ═══════════════════════════════════════════════════ */
/* PricingNav removed — logo is now embedded directly in the hero */

/* PricingFooter removed — now using the site-wide Footer from AppLayout */

/* ═══════════════════════════════════════════════════
   MAIN PAGE — Phase 6 Pricing
   ═══════════════════════════════════════════════════ */
export default function Phase6PricingPage() {
  const [period, setPeriod] = useState("1-month");
  const [currency, setCurrency] = useState("USD");
  // PRODUCTION: Toggle flash sale banner visibility
  // Set to false when no active promotion is running
  const showFlashSale = true;
  // A/B hero variant — null on SSR (renders blue gradient skeleton),
  // variant picked after hydration, warehouse photo preloaded before reveal
  const [heroVariant, setHeroVariant] = useState(null);
  const [warehouseReady, setWarehouseReady] = useState(false);
  useEffect(() => {
    const picked = Math.random() < 0.5 ? "warehouse" : "worldmap";
    setHeroVariant(picked);
    if (picked === "warehouse") {
      const img = new Image();
      img.src = "/images/hero-warehouse.png";
      img.onload = () => setWarehouseReady(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Exit-Intent Popup */}
      <ExitIntentPopup />

      {/* Live Registration Toast */}
      <LiveRegistrationToast />

      {/* Green security bar — Merkandi-style */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white text-center py-2.5 px-4 shadow-sm">
        <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2 tracking-wide">
          <ShieldCheck size={15} className="text-green-200" />
          256-bit encryption &mdash; Your data is fully encrypted and secure.
        </p>
      </div>

      {/* A/B: Flash Sale + Hero
           null = SSR skeleton (blue gradient + transparent content, no decoration)
           warehouse = FlashSale with its own blue bar, Hero with warehouse photo faded in
           worldmap = both wrapped in shared blue container with single DotWorldMap */}
      {heroVariant === "warehouse" ? (
        <>
          {showFlashSale && <FlashSaleBanner />}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]">
            {/* Warehouse photo — fades in once fully loaded */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${warehouseReady ? "opacity-100" : "opacity-0"}`}>
              <NextImage src="/images/hero-warehouse.png" alt="" fill className="object-cover" sizes="100%" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/55 via-slate-900/50 to-slate-900/65" />
            </div>
            <PricingHero transparent />
          </div>
        </>
      ) : heroVariant === "worldmap" ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]">
          <div className="absolute inset-0 pointer-events-none" style={{ mask: "radial-gradient(ellipse 100% 90% at 50% 50%, black 50%, transparent 90%)", WebkitMask: "radial-gradient(ellipse 100% 90% at 50% 50%, black 50%, transparent 90%)" }}>
            <DotWorldMap opacity={0.12} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />
          {showFlashSale && <FlashSaleBanner transparent />}
          <PricingHero transparent />
        </div>
      ) : (
        /* SSR / pre-hydration skeleton — blue gradient with content, no decorations */
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]">
          {showFlashSale && <FlashSaleBanner transparent />}
          <PricingHero transparent />
        </div>
      )}

      {/* ═══ UNIFIED PRICING TABLE ═══ */}
      <div id="pricing-table" className="relative z-10 -mt-24 sm:-mt-32 pt-0 pb-16 sm:pb-20" style={{ background: "linear-gradient(to bottom, transparent 8rem, rgb(248 250 252) 8rem)" }}>
        <UnifiedPricingTable period={period} setPeriod={setPeriod} currency={currency} setCurrency={setCurrency} />
      </div>

      {/* Seller Banner */}
      <div className="bg-slate-50 pt-0 pb-8 sm:pb-10">
        <SellerBanner />
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PaymentMethods />
        </div>
      </div>

      {/* Guarantee Promise */}
      <div className="bg-slate-50 pb-12 sm:pb-16">
        <GuaranteePanel />
      </div>

      {/* Why Choose WholesaleUp — Comparison */}
      <div className="bg-white py-16 sm:py-20">
        <ComparisonPanel />
      </div>

      {/* Trusted by Businesses — Testimonials + Stats */}
      <div className="bg-slate-50 py-16 sm:py-20">
        <TrustedByPanel />
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection />
        </div>
      </div>

      <style>{`
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
