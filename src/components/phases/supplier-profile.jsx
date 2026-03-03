"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  EyeOff,
  Star,
  ArrowRight,
  BadgeCheck,
  MapPin,
  Phone,
  Globe,
  Clock,
  Mail,
  Lock,
  Store,
  Tag,
  Calendar,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Flame,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/* ─────────── Mock Supplier Data ─────────── */
const SUPPLIER = {
  id: 1,
  name: "Casual & Everyday Clothing Wholesaler",
  isVerified: true,
  rating: 4.8,
  reviewCount: 127,
  yearsActive: 6,
  country: "United Kingdom",
  countryCode: "gb",
  memberSince: "March 2018",
  categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots"],
  moreCategories: 2,
  about: `We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections. Our goal is to provide retailers with high quality, affordable products that help them grow their businesses.

We source our products from leading UK and European brands, ensuring authenticity and quality in every order. With over 6 years in the wholesale industry, we have built strong relationships with major retailers and distributors, allowing us to offer competitive prices that are consistently below market rate.

Our warehouse is located in Manchester, UK, and we ship both domestically and internationally. We pride ourselves on fast dispatch times, reliable tracking, and excellent customer support throughout the order process.

Whether you are an established retailer looking to expand your product lines or a new business seeking reliable wholesale partners, we can tailor our offerings to suit your needs. We support bulk orders, mixed pallets, and smaller starter packs for businesses just getting started with wholesale purchasing.

All items are inspected and graded before dispatch. We provide transparent condition reports for every lot, so you always know exactly what you are purchasing. Our product categories include casual wear, activewear, formal attire, footwear, and seasonal collections.

We also offer dedicated account management for high-volume buyers, with priority access to new stock arrivals and exclusive discounts on repeat orders. Contact our team today to discuss how we can support your business growth.`,
  products: ["Premium Clothings", "Premium Footwears", "Premium Accessories", "Premium Watches", "Premium Jewelries", "Premium Handbags"],
  brands: ["Nike", "Adidas", "Levi's", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", "Hugo Boss", "Superdry", "Jack & Jones", "River Island", "Ted Baker", "French Connection"],
  focusGroups: ["Baby & Children Clothes Supplier", "Jewellery Supplier", "Fashion Accessories Supplier"],
  address: {
    country: "United Kingdom",
    countryCode: "gb",
    city: "Manchester",
    postalCode: "M1 1AD",
    street: "New Cathedral",
    website: "sitename.com",
  },
  contact: {
    name: "Jane Collin",
    position: "Store Manager",
    phone: "+44 0203 0484377",
  },
  hours: {
    Sun: "Closed",
    Mon: "08:00 – 16:00",
    Tue: "08:00 – 16:00",
    Wed: "08:00 – 16:00",
    Thu: "08:00 – 16:00",
    Fri: "08:00 – 14:00",
    Sat: "Closed",
  },
  currentTime: "10:12",
  daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  reputation: {
    overallScore: 4.8,
    sourcesCount: 14,
    lastUpdated: "Feb 2026",
    summary: "This supplier has a strong reputation across multiple platforms and industry sources. Consistently rated highly for product quality, competitive pricing, and reliable delivery. Communication is noted as responsive and professional by the majority of sources reviewed.",
    dimensions: [
      { label: "Product Quality", score: 4.9 },
      { label: "Pricing Competitiveness", score: 4.7 },
      { label: "Delivery Reliability", score: 4.8 },
      { label: "Communication", score: 4.6 },
      { label: "Order Accuracy", score: 4.9 },
      { label: "Packaging Quality", score: 4.5 },
    ],
    highlights: [
      "Consistently high ratings for product authenticity and brand quality",
      "Fast dispatch times with reliable tracking across UK and EU destinations",
      "Responsive customer support with average reply time under 4 hours",
      "Strong track record with repeat buyers — over 80% reorder rate",
    ],
    cautions: [
      "Occasional reports of minor packaging damage during transit",
      "Limited availability of some product lines during peak seasons",
    ],
  },
};

const SUPPLIER_DEALS = [
  { id: 101, title: "Designer Leather Handbag Collection", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", price: 32.50, currency: "£", unit: "/ Unit", rrp: 89.99, rrpCurrency: "£", markup: 176.89, grossProfit: 57.49, dateAdded: "Feb 14, 2026", amazonPrice: 79.99, amazonProfit: 47.49, amazonSales: 42, ebayPrice: 64.99, ebayProfit: 32.49, ebaySales: 28 },
  { id: 102, title: "Premium Wool Winter Scarves – Pack of 12", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop", price: 48.00, currency: "£", unit: "/ Unit", rrp: 149.99, rrpCurrency: "£", markup: 212.48, grossProfit: 101.99, dateAdded: "Feb 10, 2026", amazonPrice: 129.99, amazonProfit: 81.99, amazonSales: 35, ebayPrice: 109.99, ebayProfit: 61.99, ebaySales: 22 },
  { id: 103, title: "Men's Casual Oxford Shirts – Assorted Sizes", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", price: 15.99, currency: "£", unit: "/ Unit", rrp: 45.00, rrpCurrency: "£", markup: 181.43, grossProfit: 29.01, dateAdded: "Feb 8, 2026", amazonPrice: 39.99, amazonProfit: 24.00, amazonSales: 58, ebayPrice: 34.99, ebayProfit: 19.00, ebaySales: 41 },
  { id: 104, title: "Women's Running Trainers – Mixed Pack", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", price: 22.00, currency: "£", unit: "/ Unit", rrp: 79.99, rrpCurrency: "£", markup: 263.59, grossProfit: 57.99, dateAdded: "Jan 30, 2026", amazonPrice: 69.99, amazonProfit: 47.99, amazonSales: 67, ebayPrice: null, ebayProfit: null, ebaySales: null },
  { id: 105, title: "Stainless Steel Fashion Watch Set", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", price: 55.00, currency: "£", unit: "/ Unit", rrp: 199.99, rrpCurrency: "£", markup: 263.62, grossProfit: 144.99, dateAdded: "Jan 25, 2026", amazonPrice: 179.99, amazonProfit: 124.99, amazonSales: 48, ebayPrice: 159.99, ebayProfit: 104.99, ebaySales: 33 },
  { id: 106, title: "Sterling Silver Pendant Necklaces – Pack of 6", image: "https://images.unsplash.com/photo-1515562141589-67f0d569b4a9?w=400&h=400&fit=crop", price: 18.50, currency: "£", unit: "/ Unit", rrp: 49.99, rrpCurrency: "£", markup: 170.22, grossProfit: 31.49, dateAdded: "Jan 22, 2026", amazonPrice: 44.99, amazonProfit: 26.49, amazonSales: 74, ebayPrice: 39.99, ebayProfit: 21.49, ebaySales: 52 },
  { id: 107, title: "Silk Evening Dresses – Assorted Colours", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", price: 28.00, currency: "£", unit: "/ Unit", rrp: 120.00, rrpCurrency: "£", markup: 328.57, grossProfit: 92.00, dateAdded: "Jan 18, 2026", amazonPrice: 99.99, amazonProfit: 71.99, amazonSales: 120, ebayPrice: 89.99, ebayProfit: 61.99, ebaySales: 85 },
  { id: 108, title: "Premium Denim Jeans – End of Line", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", price: 12.99, currency: "£", unit: "/ Unit", rrp: 59.99, rrpCurrency: "£", markup: 361.74, grossProfit: 47.00, dateAdded: "Jan 15, 2026", amazonPrice: 49.99, amazonProfit: 37.00, amazonSales: 55, ebayPrice: null, ebayProfit: null, ebaySales: null },
];

/* ─────────── Flag Image ─────────── */
function FlagImg({ code, size = 20 }) {
  const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", gb: "gb" };
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}

/* ─────────── Star Rating ─────────── */
function StarRating({ rating, size = 12, showValue = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
        />
      ))}
      {showValue && <span className="ml-1 text-xs font-semibold text-slate-600">{rating}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BREADCRUMB
   ═══════════════════════════════════════════════════ */
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          {item.href ? (
            <a href={item.href} className="hover:text-orange-500 transition-colors">{item.label}</a>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER HEADER — name, verified, country, years
   ═══════════════════════════════════════════════════ */
function SupplierHeader({ supplier, faved, onToggleFav }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        {supplier.isVerified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md mb-2">
            <BadgeCheck size={10} />
            Verified Seller
          </span>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
          {supplier.name}
        </h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <FlagImg code={supplier.countryCode} size={16} /> {supplier.country}
          </span>
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {supplier.yearsActive} yrs
          </span>
          <span className="text-slate-300">&middot;</span>
          <StarRating rating={supplier.rating} size={13} showValue />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
          title="Hide supplier"
        >
          <EyeOff size={16} className="text-slate-400" />
        </button>
        <button
          onClick={onToggleFav}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
          title={faved ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart size={16} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT TAB CONTENT
   ═══════════════════════════════════════════════════ */
function AboutTab({ supplier }) {
  const [expanded, setExpanded] = useState(false);
  const LINE_LIMIT = 10;
  const lines = supplier.about.split("\n");
  const isLong = lines.length > LINE_LIMIT;
  const displayText = expanded || !isLong ? supplier.about : lines.slice(0, LINE_LIMIT).join("\n") + "…";

  return (
    <div>
      {/* About description */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400" /> About This Supplier</h3>
        <div className="pl-[26px]">
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{displayText}</div>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Products Distributed */}
      {supplier.products.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Package size={18} className="text-slate-400" /> Products Distributed by This Supplier</h3>
          <p className="text-sm text-slate-600 leading-relaxed pl-[26px]">
            {supplier.products.join(", ")}
          </p>
        </div>
      )}

      {/* Brands Distributed */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Tag size={18} className="text-slate-400" /> Brands Distributed by This Supplier</h3>
        <div className="pl-[26px]">
          {supplier.brands.length > 0 ? (
            <p className="text-sm text-slate-600 leading-relaxed">
              {supplier.brands.map((brand, i) => (
                <span key={brand}>
                  <a href="/suppliers" className="text-orange-500 hover:text-orange-600 hover:underline transition-colors">{brand}</a>
                  {i < supplier.brands.length - 1 && ", "}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-sm text-slate-500 italic">- No brands found</p>
          )}
        </div>
      </div>

      {/* Focus Product Groups */}
      {supplier.focusGroups.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Flame size={18} className="text-slate-400" /> Focus</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {supplier.focusGroups.map((group) => (
              <a
                key={group}
                href="#"
                className="px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors"
              >
                {group}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REVIEWS TAB CONTENT
   ═══════════════════════════════════════════════════ */
function ReviewTab({ reputation }) {
  return (
    <div>
      {/* Overall score */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="text-center">
          <span className="text-3xl font-extrabold text-slate-900">{reputation.overallScore}</span>
          <p className="text-xs text-slate-400 mt-0.5">out of 5</p>
        </div>
        <div>
          <StarRating rating={reputation.overallScore} size={18} />
          <p className="text-sm text-slate-500 mt-1">Based on {reputation.sourcesCount} sources &middot; Updated {reputation.lastUpdated}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400" /> Summary</h3>
        <p className="text-sm text-slate-600 leading-relaxed pl-[26px]">{reputation.summary}</p>
      </div>

      {/* Score dimensions */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Star size={18} className="text-slate-400" /> Reputation Breakdown</h3>
        <div className="space-y-3 pl-[26px]">
          {reputation.dimensions.map((dim) => (
            <div key={dim.label} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-44 shrink-0">{dim.label}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(dim.score / 5) * 100}%` }} />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-8 text-right">{dim.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Highlights</h3>
        <div className="space-y-2 pl-[26px]">
          {reputation.highlights.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Cautions */}
      {reputation.cautions && reputation.cautions.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Things to Note</h3>
          <div className="space-y-2 pl-[26px]">
            {reputation.cautions.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER PROFILE TABS — About / Review
   ═══════════════════════════════════════════════════ */
function SupplierProfileTabs({ supplier, isPremium, isLoggedIn }) {
  const [activeTab, setActiveTab] = useState("about");

  const handleTabClick = (key) => {
    if (key === "review") {
      if (!isLoggedIn) {
        window.location.href = "/login";
        return;
      }
      if (!isPremium) {
        window.location.href = "/pricing";
        return;
      }
    }
    setActiveTab(key);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-slate-200">
        {[
          { key: "about", label: "About" },
          { key: "review", label: "Review", locked: !isPremium },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`px-6 py-3.5 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
            {tab.locked && <Lock size={12} className="text-slate-300" />}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-6 right-6 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "about" && <AboutTab supplier={supplier} />}
        {activeTab === "review" && (
          <ReviewTab reputation={supplier.reputation} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OPENING HOURS WIDGET
   ═══════════════════════════════════════════════════ */
function OpeningHoursWidget({ supplier }) {
  const todayIndex = new Date().getDay(); // 0=Sun … 6=Sat
  const [hoveredDay, setHoveredDay] = useState(null);

  const activeDay = hoveredDay !== null ? hoveredDay : todayIndex;
  const activeDayName = supplier.daysOfWeek[activeDay];
  const activeHours = supplier.hours?.[activeDayName] ?? "—";
  const isClosed = activeHours === "Closed";

  // Determine if supplier is currently open (based on today, not hovered day)
  const todayName = supplier.daysOfWeek[todayIndex];
  const todayHours = supplier.hours?.[todayName] ?? "Closed";
  const isCurrentlyOpen = (() => {
    if (todayHours === "Closed") return false;
    const [open, close] = todayHours.split("–").map((t) => t.trim());
    if (!open || !close) return false;
    const now = supplier.currentTime.replace(":", "");
    const openN = open.replace(":", "");
    const closeN = close.replace(":", "");
    return now >= openN && now < closeN;
  })();

  return (
    <div className="px-5 py-3 border-b border-slate-100">
      {/* Title + live status */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xs text-slate-500">Opening Hours</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
          isCurrentlyOpen
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
          {isCurrentlyOpen ? "Open now" : "Closed"}
        </span>
      </div>

      {/* Day pills */}
      <div className="flex gap-1 mb-2">
        {supplier.daysOfWeek.map((day, i) => {
          const isActive = i === activeDay;

          return (
            <span
              key={day}
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>

      {/* Hours display for active/hovered day */}
      <div className="flex items-center justify-center gap-2 text-xs mb-2">
        <span className="text-slate-400">{activeDayName}</span>
        <span className={`font-bold ${isClosed ? "text-red-400" : "text-slate-700"}`}>
          {activeHours}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        At wholesaler&apos;s it is currently <span className="font-bold text-slate-700">{supplier.currentTime}</span> o&apos;clock
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT SIDEBAR — right column
   ═══════════════════════════════════════════════════ */
function ContactSidebar({ supplier, isPremium }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Supplier header — matches single-deal SupplierSidebarCard */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {supplier.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">
              <BadgeCheck size={10} />
              Verified Seller
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-slate-900">{supplier.name}</h3>
        {/* Rating + Years */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StarRating rating={supplier.rating} size={12} showValue />
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {supplier.yearsActive} yrs
          </span>
        </div>
      </div>

      {/* Address + Contact section */}
      <div className="relative">
        <div className={!isPremium ? "select-none" : ""} style={!isPremium ? { filter: "blur(5px)" } : undefined}>
          {/* Address */}
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Country:</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <FlagImg code={supplier.address.countryCode} size={16} /> {supplier.address.country}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">City:</span>
                <span className="font-semibold text-slate-800">{supplier.address.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Postal Code:</span>
                <span className="font-semibold text-slate-800">{supplier.address.postalCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Street:</span>
                <span className="font-semibold text-slate-800">{supplier.address.street}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Website:</span>
                <span className="font-semibold text-slate-800">{supplier.address.website}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact Name:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Position:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.position}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solid overlay with "Show Details" for non-premium */}
        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 backdrop-blur-sm">
            <a href="/pricing" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all">
              Show Details
            </a>
          </div>
        )}
      </div>

      {/* Opening hours */}
      <OpeningHoursWidget supplier={supplier} />

      {/* Gating message + CTA */}
      {!isPremium && (
        <div className="px-5 py-3 border-b border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-3">Join to access supplier details</p>
          <a href="/pricing" className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-2">
            <Lock size={14} /> Join Now!
          </a>
        </div>
      )}

      {/* View Profile / View All Deals */}
      <div className="px-5 py-4 flex gap-3">
        <a href="/suppliers" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Store size={15} /> View Profile
        </a>
        <a href="/deals" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Tag size={15} /> View All Deals
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEAL CARD — for supplier deals carousel
   ═══════════════════════════════════════════════════ */
function SupplierDealCard({ deal, isPremium, isLoggedIn }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col h-full">
      {/* Image */}
      <a href="/single-deal" className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Markup badge */}
        {deal.markup && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
            <TrendingUp size={10} /> {deal.markup}%
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-base font-extrabold text-orange-600">{deal.currency}{deal.price.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">{deal.unit || "ex.VAT"}</span>
        </div>

        {deal.dateAdded && (
          <p className="text-[10px] text-slate-400 mb-1.5">Deal First Featured On: {deal.dateAdded}</p>
        )}

        {/* Title */}
        <a href="/single-deal">
          <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-2.5">
            {deal.title}
          </h3>
        </a>

        {/* RRP + Profit */}
        <div className="border-t border-slate-100 text-[11px]">
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100">
            <span className="text-slate-400 font-semibold w-9">RRP</span>
            <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span>
            <span className="text-emerald-600 font-bold">Profit {deal.rrpCurrency}{deal.grossProfit?.toFixed(2) || "16.95"} / {deal.amazonSales || 35}</span>
          </div>
          {deal.amazonPrice && (
            <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100">
              <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.amazonPrice.toFixed(2)}</span>
              <span className="font-bold" style={{ color: "#FF9900" }}>Profit {deal.rrpCurrency}{deal.amazonProfit?.toFixed(2) || "16.95"} / {deal.amazonSales || 35}</span>
            </div>
          )}
          {deal.ebayPrice && (
            <div className="flex items-center justify-between py-1.5">
              <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto" /></div>
              <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.ebayPrice.toFixed(2)}</span>
              <span className="font-bold" style={{ color: "#0064D2" }}>Profit {deal.rrpCurrency}{deal.ebayProfit?.toFixed(2) || "16.95"} / {deal.ebaySales || 35}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2.5">
          {isPremium ? (
            <button className="w-full py-2 rounded-lg text-xs font-bold text-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <MessageSquare size={12} /> Message Supplier
            </button>
          ) : (
            <a href="/pricing" className="w-full py-2 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <Lock size={12} /> Join Now!
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEALS CAROUSEL — Best Deals from this supplier
   ═══════════════════════════════════════════════════ */
function SupplierDealsCarousel({ deals, isPremium, isLoggedIn }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === -1 ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deals</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Best Wholesale & Drop Ship Deals from Similar Suppliers</h2>
          <p className="text-sm text-slate-500 mt-1">Browse the latest wholesale opportunities from this supplier.</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          Explore All Products <ArrowRight size={14} />
        </a>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {deals.map((d) => (
            <div key={d.id} className="shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] snap-start">
              <SupplierDealCard deal={d} isPremium={isPremium} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRUST SECTION — testimonials + stats
   ═══════════════════════════════════════════════════ */
function TrustSection() {
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleDeals as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
  ];

  const scrollRef = useRef(null);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">Trusted by Businesses of All Sizes</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials — 2 rows, horizontal scroll */}
      <div className="relative group/scroll">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {testimonials.map((t) => (
              <div key={t.name} className="w-72 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - t.rating }, (_, i) => (
                    <Star key={`e${i}`} size={12} className="text-slate-200" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">— {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <a href="/testimonials" className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          All Testimonials <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CTA BANNER — bottom of page
   ═══════════════════════════════════════════════════ */
function CtaBanner() {
  return (
    <div className="mt-12 bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
      {/* Left illustrations */}
      <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="52" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <rect x="25" y="42" width="50" height="38" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M38 42V32a12 12 0 0 1 24 0v10" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="52" r="2.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="2.5" fill="#1E293B" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="48" rx="26" ry="24" fill="#FED7AA" opacity="0.5" />
          <path d="M20 20h28l28 28-22 22L20 48V20z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <circle cx="34" cy="34" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{ width: "4.5rem", height: "4.5rem" }}>
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M16 35l34-17 34 17v30L50 82 16 65V35z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <path d="M16 35l34 17 34-17" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M50 52v30" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Right illustrations */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="42" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <circle cx="42" cy="42" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M56 56l22 22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 78h64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 78V22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 64l14-12 12 6 14-20 14-12" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="26" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{ width: "4.5rem", height: "4.5rem" }}>
          <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 50l14-14 10 4 8-8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 32l10 10 4-10 18 18" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 54l8 8 12-6 8 8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Get Started!</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
          Ready to Increase Your<br />Profits?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Join thousands of retailers and suppliers already growing their business on WholesaleUp.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/register?type=retailer" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300">
            <ShoppingCart size={16} />
            I want to buy
          </a>
          <a href="/register?type=supplier" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300">
            <Store size={16} />
            I want to sell
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — /supplier-profile page
   ═══════════════════════════════════════════════════ */
export default function SupplierProfilePage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [faved, setFaved] = useState(false);

  // Sync with global demo auth bar in AppLayout
  useEffect(() => {
    const handler = (e) => {
      setIsLoggedIn(e.detail.loggedIn);
      setIsPremium(e.detail.premium || false);
    };
    window.addEventListener("demo-auth", handler);
    return () => window.removeEventListener("demo-auth", handler);
  }, []);

  const supplier = SUPPLIER;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Wholesale Suppliers", href: "/suppliers" },
          { label: "Clothing and Fashion", href: "/suppliers?category=clothing" },
          { label: "Casual & Everyday Clothing" },
        ]} />

        {/* Supplier Header */}
        <SupplierHeader supplier={supplier} faved={faved} onToggleFav={() => setFaved(!faved)} />

        {/* === MAIN GRID: Profile | Contact Sidebar === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Col 1+2: Supplier Profile (spans 2 columns like image+pricing in single-deal) */}
          <div className="min-w-0 xl:col-span-2">
            <SupplierProfileTabs supplier={supplier} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          </div>

          {/* Col 3: Contact sidebar (sticky, same as single-deal) */}
          <div className="min-w-0 xl:sticky xl:top-[120px] xl:self-start">
            <ContactSidebar supplier={supplier} isPremium={isPremium} />
          </div>
        </div>

        {/* Best Deals from this Supplier */}
        <SupplierDealsCarousel deals={SUPPLIER_DEALS} isPremium={isPremium} isLoggedIn={isLoggedIn} />

        {/* Trust Section */}
        <TrustSection />

        {/* CTA Banner */}
        <CtaBanner />
      </div>
    </div>
  );
}
