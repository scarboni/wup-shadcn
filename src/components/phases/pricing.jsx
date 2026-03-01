"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Check,
  X,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Zap,
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
  Gift,
  Mail,
  Search as SearchIcon,
  Globe,
  MessageSquare,
  Truck,
  Award,
  Heart,
} from "lucide-react";

/* ─────────── Pricing Data ─────────── */
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

const FEATURES = {
  standard: [
    "20,530+ Live Wholesale & Dropship Deals",
    "200–300% Average Mark-ups",
    "Up to 95% Off Retail Prices",
    "Sell on eBay & Amazon at a Profit",
    "Authentic Designer Brands Only",
  ],
  premium: [
    "20,530+ Live Wholesale & Dropship Deals",
    "200–300% Average Mark-ups",
    "Up to 95% Off Retail Prices",
    "Sell on eBay & Amazon at a Profit",
    "Authentic Designer Brands Only",
    "47,400+ EU, UK, USA Verified Wholesalers",
    "900+ Verified Liquidators",
    "Web's Largest UK Dropshippers Database",
    "Web's Largest EU Dropshippers Database",
    "Web's Largest US Dropshippers Database",
    "14,000+ US Verified Wholesalers",
    "Send Unlimited Inquiries",
  ],
  premiumPlus: [
    "20,530+ Live Wholesale & Dropship Deals",
    "200–300% Average Mark-ups",
    "Up to 95% Off Retail Prices",
    "Sell on eBay & Amazon at a Profit",
    "Authentic Designer Brands Only",
    "47,400+ EU, UK, USA Verified Wholesalers",
    "900+ Verified Liquidators",
    "Web's Largest UK Dropshippers Database",
    "Web's Largest EU Dropshippers Database",
    "Web's Largest US Dropshippers Database",
    "14,000+ US Verified Wholesalers",
    "Send Unlimited Inquiries",
    "Daily Newsletter With the Latest Offers",
    "Exclusive Member Discounts",
    "Unlimited Custom Sourcing Support Guarantee",
  ],
};

const TESTIMONIALS = [
  { text: "As a new Sole Trader, it's been 14 days since I purchased the Combo deal and I totally love it. I've been linked to many many great suppliers.", author: "Rena Harvey", location: "United Kingdom" },
  { text: "Many thanks for an excellent and customer focused service. I really appreciated the advice on building a successful business.", author: "David Chen", location: "United Kingdom" },
  { text: "I feel that I finally belong to a reputable company that is helping me change my life financially. I'm grateful.", author: "Sarah Mitchell", location: "Ireland" },
  { text: "Your service is brilliant, I would recommend your website and service to anyone.", author: "Thu Huong Do", location: "Sweden" },
  { text: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", author: "James Wilson", location: "United Kingdom" },
  { text: "In the short time I have been registered I have found some very interesting wholesalers happy to do business for £50 min order.", author: "Alex Elliott", location: "Australia" },
];

const FAQS = [
  { q: "What do I get when I join WholesaleDeals buyer?", a: "You get immediate access to our platform with over 54,000 verified suppliers, all the latest wholesale deals with profit calculations, and the Deal Tracker tool. You'll also receive our weekly deals newsletter and can request personalized sourcing assistance from our team." },
  { q: "Are the suppliers really verified?", a: "Yes, all suppliers on our platform go through a rigorous verification process to ensure they are legitimate wholesale businesses. We verify their business credentials, check their reputation, and ensure they meet our quality standards before listing them on our platform." },
  { q: "Is WholesaleDeals good for beginners?", a: "Absolutely! WholesaleDeals is designed to help both beginners and experienced resellers. We provide educational resources, profit calculators, and personalized support to help you get started and grow your business successfully." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. Your access will continue until the end of your current billing period. We also offer a money-back guarantee if you're not satisfied within the first 14 days." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 100% money-back guarantee. If we can't find the suppliers or deals you're looking for, we'll refund your subscription in full. No questions asked." },
  { q: "How often are new deals added?", a: "We add new wholesale and dropship deals daily. Our team constantly sources new opportunities from verified suppliers across the UK, EU, and North America to ensure our members always have fresh, profitable deals to choose from." },
];

/* ═══════════════════════════════════════════════════
   FLASH SALE BANNER
   ═══════════════════════════════════════════════════ */
function FlashSaleBanner() {
  return (
    <div className="bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-3 text-center">
        <Zap size={16} className="shrink-0 animate-pulse" />
        <p className="text-sm font-bold">
          FLASH SALE{" "}
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/20 text-lg font-extrabold mx-1">
            -20%
          </span>{" "}
          For one-year REGISTRATION
        </p>
        <span className="text-xs text-rose-200">*promotions cannot be combined</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */
function PricingHero() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
          Increase your sales, buy cheap from{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
            Wholesale Deals
          </span>
        </h1>
        <p className="text-slate-400 mt-3 text-base max-w-2xl mx-auto">
          Wholesale goods from excess stock, end of series and clearance sales from 150 Countries!
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
          {[
            { value: "95% Off", label: "Below retail prices", icon: TrendingUp },
            { value: "900,000+", label: "Trusted resellers", icon: Users },
            { value: "45,600+", label: "Verified suppliers", icon: BadgeCheck },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <stat.icon size={16} className="text-orange-400" />
                <span className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</span>
              </div>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACCESS PERIOD TOGGLE
   ═══════════════════════════════════════════════════ */
function PeriodToggle({ period, setPeriod }) {
  const periods = [
    { id: "1-month", label: "1 Month" },
    { id: "6-months", label: "6 Months" },
    { id: "1-year", label: "1 Year", badge: "SAVE 20%" },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex items-center gap-1 bg-slate-100 rounded-xl p-1">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              period === p.id
                ? "bg-white text-orange-600 shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {p.label}
            {p.badge && (
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] font-bold bg-red-500 text-white rounded-full whitespace-nowrap">
                {p.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING CARD
   ═══════════════════════════════════════════════════ */
function PricingCard({ tier, name, pricing, period, features, isPopular = false, icon: Icon }) {
  const data = pricing[period]?.[tier];
  if (!data) return null;

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
      isPopular
        ? "bg-white border-2 border-orange-500 shadow-xl shadow-orange-100 scale-[1.03] z-10"
        : "bg-white border border-slate-200 shadow-sm hover:shadow-lg"
    }`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 py-2 text-center">
          <p className="text-white text-xs font-bold flex items-center justify-center gap-1.5">
            <Flame size={12} />
            85% of customers choose this package!
          </p>
        </div>
      )}

      <div className="p-6 lg:p-7">
        {/* Tier Name */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            tier === "standard" ? "bg-slate-100" : tier === "premium" ? "bg-orange-100" : "bg-amber-100"
          }`}>
            <Icon size={18} className={
              tier === "standard" ? "text-slate-500" : tier === "premium" ? "text-orange-500" : "text-amber-500"
            } />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">{name}</h3>
        </div>

        {/* Price */}
        <div className="mb-5">
          {data.original && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-400 line-through">${data.original.toFixed(2)}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-600 rounded-full">
                -{data.discount}% off
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900">${data.price.toFixed(2)}</span>
            <span className="text-sm text-slate-400 font-medium">{PERIOD_LABELS[period]}</span>
          </div>
        </div>

        {/* CTA */}
        <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
          isPopular
            ? "bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white"
            : tier === "premiumPlus"
            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            : "bg-slate-900 hover:bg-slate-800 text-white"
        }`}>
          Register
        </button>

        {/* Feature List */}
        <div className="mt-6 space-y-2.5">
          {features.map((feature, i) => {
            const isAdvanced = i >= 5;
            const isPremPlus = i >= 12;
            return (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isPremPlus
                    ? "bg-amber-100"
                    : isAdvanced
                    ? "bg-orange-100"
                    : "bg-emerald-100"
                }`}>
                  <Check size={11} className={
                    isPremPlus ? "text-amber-600" : isAdvanced ? "text-orange-600" : "text-emerald-600"
                  } />
                </div>
                <span className={`text-sm leading-snug ${
                  isPremPlus ? "text-amber-700 font-medium" : isAdvanced ? "text-orange-700 font-medium" : "text-slate-600"
                }`}>
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SELLER CTA CARD
   ═══════════════════════════════════════════════════ */
function SellerCTA() {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6 lg:p-7 text-center">
      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
        <Store size={24} className="text-emerald-600" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900 mb-2">Selling Products?</h3>
      <p className="text-sm text-slate-600 mb-5 max-w-xs mx-auto">
        Want to sell your products worldwide? Register as a seller to publish offers,
        promote your business, and connect directly with customers.
      </p>
      <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 mx-auto">
        <Store size={16} />
        Register as Seller
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATS SECTION
   ═══════════════════════════════════════════════════ */
function StatsSection() {
  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-400 rounded-full -translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-400 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl" />
      </div>
      <div className="relative px-8 py-10 text-center">
        <h2 className="text-2xl font-extrabold text-white mb-2">Trusted by Businesses of All Sizes</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
          Join thousands of businesses worldwide who rely on us for profitable wholesale and dropship deals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Flame, value: "366.61%", label: "Average markup of wholesale prices", color: "text-orange-400" },
            { icon: Package, value: "14,891+", label: "Active Deals as of today", color: "text-orange-400" },
            { icon: Users, value: "300+", label: "New Suppliers in the past 7 days", color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                <stat.icon size={22} className={stat.color} />
              </div>
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[160px]">{stat.label}</p>
            </div>
          ))}
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

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div />
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
            <ChevronRight size={18} />
          </button>
          <a href="/testimonials" className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors ml-2">
            All Testimonials <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="w-[320px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-4">
              "{t.text}"
            </p>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                {t.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.author}</p>
                <p className="text-xs text-slate-400">— {t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Have questions? We're here to help.</p>
        </div>
        <a href="/help" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
          <HelpCircle size={14} />
          Help Center
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`rounded-xl border transition-all ${
              openIndex === i ? "border-orange-200 bg-orange-50/50 shadow-sm" : "border-slate-200 bg-white"
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                openIndex === i ? "bg-orange-500" : "bg-slate-100"
              }`}>
                <ChevronDown size={13} className={`transition-transform ${
                  openIndex === i ? "rotate-180 text-white" : "text-slate-400"
                }`} />
              </div>
              <h3 className={`text-sm font-semibold transition-colors ${
                openIndex === i ? "text-orange-700" : "text-slate-800"
              }`}>
                {faq.q}
              </h3>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 pl-14 animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE — Phase 6 Pricing
   ═══════════════════════════════════════════════════ */
export default function Phase6PricingPage() {
  const [period, setPeriod] = useState("1-month");

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Flash Sale */}
      <FlashSaleBanner />

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
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-slate-500 hover:text-orange-500 font-medium">Home</a>
            <a href="/categories" className="text-xs text-slate-500 hover:text-orange-500 font-medium">Categories</a>
            <a href="/account" className="text-xs text-slate-500 hover:text-orange-500 font-medium">Account</a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <PricingHero />

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Period Toggle */}
        <div className="text-center mb-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Access Period</h2>
          <PeriodToggle period={period} setPeriod={setPeriod} />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          <PricingCard
            tier="standard"
            name="Standard"
            pricing={PRICING}
            period={period}
            features={FEATURES.standard}
            icon={Shield}
          />
          <PricingCard
            tier="premium"
            name="Premium"
            pricing={PRICING}
            period={period}
            features={FEATURES.premium}
            isPopular
            icon={Crown}
          />
          <PricingCard
            tier="premiumPlus"
            name="Premium+"
            pricing={PRICING}
            period={period}
            features={FEATURES.premiumPlus}
            icon={Sparkles}
          />
          <SellerCTA />
        </div>
      </div>

      {/* Stats + Testimonials + FAQ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Stats */}
        <StatsSection />

        {/* Testimonials */}
        <TestimonialsCarousel />

        {/* FAQ */}
        <FAQSection />
      </div>

      <style>{`
        .line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
