"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  ChevronRight,
  Lock,
  Unlock,
  Shield,
  BadgeCheck,
  ExternalLink,
  Flag,
  Send,
  AlertCircle,
  MessageSquare,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Users,
  Package,
  ArrowRight,
  ChevronLeft,
  Heart,
  Truck,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";

/* ─────────── Flag Emojis ─────────── */
const FLAGS = { UK: "🇬🇧", DE: "🇩🇪", NL: "🇳🇱", US: "🇺🇸", PL: "🇵🇱", ES: "🇪🇸", IT: "🇮🇹", FR: "🇫🇷" };

/* ─────────── Star Rating ─────────── */
function StarRating({ rating, size = 12, showValue = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
      {showValue && <span className="text-xs font-semibold text-slate-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}

/* ─────────── Blurred Text (Free tier gating) ─────────── */
function BlurredText({ text, isPremium, className = "" }) {
  if (isPremium) return <span className={className}>{text}</span>;
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="blur-sm select-none pointer-events-none">{text}</span>
    </span>
  );
}

/* ─────────── Mock Supplier Data ─────────── */
const SUPPLIERS = [
  {
    id: 1,
    name: "Trainers and Sportswear Supplier",
    country: "UK",
    countryName: "United Kingdom",
    rating: 5.0,
    reviewCount: 24,
    yearsActive: 8,
    verified: true,
    description: "We are a wholesaler of sportswear clothing and shoes. We offer high quality of adidas originals men's sports jackets, adidas long sleeved formal button collared mens shirts, canterbury tour and waimak polo shirts, adidas andy murray t-shirts. We also stock a wide range of trainers including adidas superstar, nike air max, nike free run, reebok classics and many more popular brands at competitive wholesale prices.",
    phone: "+4402089072658",
    email: "wholesaletrain@gmail.com",
    address: "9 Fisher's Lane, Chiswick London United Kingdom",
    zip: "W41RX",
    city: "London",
    website: "www.sportswearwholesale.co.uk",
    contactName: "Jane Collin",
    contactPosition: "Store Manager",
    categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots", "Sports & Leisure", "Apparel & Clothing"],
    products: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches",
    brands: ["Adidas", "Nike", "Reebok", "Canterbury"],
    openingHours: "08:00-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Dropshipping", "B2B"],
  },
  {
    id: 2,
    name: "Basketball Sport Supplier",
    country: "DE",
    countryName: "Germany",
    rating: 4.5,
    reviewCount: 18,
    yearsActive: 5,
    verified: true,
    description: "Premium basketball equipment and sportswear distributor covering Europe. We specialise in authentic NBA merchandise, professional-grade basketballs, training equipment, and team uniforms. Our warehouse stocks over 5,000 SKUs from leading brands with same-day dispatch on orders placed before 2pm CET.",
    phone: "+49301234567",
    email: "info@basketballsport.de",
    address: "Berliner Str. 45, Berlin Germany",
    zip: "10115",
    city: "Berlin",
    website: "www.basketballsport.de",
    contactName: "Hans Mueller",
    contactPosition: "Sales Director",
    categories: ["Sports & Leisure", "Apparel & Clothing", "Toys & Games"],
    products: "Basketball Equipment, Sports Apparel, Training Gear",
    brands: ["Nike", "Under Armour", "Spalding", "Wilson"],
    openingHours: "09:00-17:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B"],
  },
  {
    id: 3,
    name: "Casual & Everyday Clothing Wholesaler",
    country: "UK",
    countryName: "United Kingdom",
    rating: 4.2,
    reviewCount: 12,
    yearsActive: 6,
    verified: true,
    description: "We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections. Our goal is to provide retailers with high quality, affordable luxury fashion items that help them stand out in a competitive market.",
    phone: "+4402039876543",
    email: "sales@casualwholesale.co.uk",
    address: "15 Victoria Road, Manchester United Kingdom",
    zip: "M1 2AB",
    city: "Manchester",
    website: "www.casualwholesale.co.uk",
    contactName: "Sarah Thompson",
    contactPosition: "Operations Manager",
    categories: ["Apparel & Clothing", "Jewellery & Watches", "Health & Beauty"],
    products: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches, Premium Jewelries, Premium Handbags",
    brands: [],
    openingHours: "08:00-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Liquidation", "Returns"],
  },
];

const REVIEWS = [
  { id: 1, author: "John Smith", initial: "J", date: "2 days ago", rating: 5, text: "Excellent quality products and fast shipping. The supplier is very professional and responsive to inquiries." },
  { id: 2, author: "Maria Garcia", initial: "M", date: "1 week ago", rating: 4, text: "Great variety of products and competitive prices. Highly recommended for wholesale purchases." },
  { id: 3, author: "Alex Johnson", initial: "A", date: "2 weeks ago", rating: 5, text: "Good communication and reliable delivery. The products met my expectations." },
  { id: 4, author: "Emily Chen", initial: "E", date: "1 month ago", rating: 4, text: "Solid wholesale partner. Quick turnaround on orders and the quality is consistently good across all product lines." },
  { id: 5, author: "Robert Wilson", initial: "R", date: "2 months ago", rating: 3, text: "Products are decent but delivery took longer than expected. Communication could be improved." },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ═══════════════════════════════════════════════════
   1. SUPPLIER CARD — used in the suppliers listing page
   ═══════════════════════════════════════════════════ */
function SupplierCard({ supplier, isPremium = false }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all duration-300">
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <a href={`/supplier/${supplier.id}`} className="group">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {supplier.name}
              </h3>
            </a>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <span className="text-sm">{FLAGS[supplier.country]}</span>
                {supplier.countryName}
              </span>
              <StarRating rating={supplier.rating} size={11} showValue />
              {supplier.verified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
                  <BadgeCheck size={10} />
                  Verified
                </span>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button className="px-3 py-2 text-xs font-semibold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors flex items-center gap-1.5">
              <Phone size={12} />
              <span className="hidden sm:inline">Call Now</span>
            </button>
            <button className="px-3 py-2 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
              <Send size={12} />
              <span className="hidden sm:inline">Send Enquiry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 pt-4">
        {/* Description */}
        <div className="mb-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</h4>
          <p className={`text-sm text-slate-600 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
            {supplier.description}
          </p>
          {supplier.description.length > 180 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-sky-500 hover:text-sky-600 font-semibold mt-1"
            >
              {expanded ? "Show less" : "Read more..."}
            </button>
          )}
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Phone */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <Phone size={13} className="text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone/Fax</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BlurredText text={supplier.phone} isPremium={isPremium} className="text-sm text-slate-700 font-medium" />
                {isPremium && (
                  <button onClick={() => copyToClipboard(supplier.phone, "phone")} className="p-0.5 hover:bg-slate-100 rounded transition-colors">
                    {copied === "phone" ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="text-slate-400" />}
                  </button>
                )}
              </div>
              <button className="text-[10px] text-red-400 hover:text-red-500 mt-0.5">Report Invalid Details</button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <Mail size={13} className="text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BlurredText text={supplier.email} isPremium={isPremium} className="text-sm text-sky-600 font-medium truncate" />
              </div>
              <button className="text-[10px] text-red-400 hover:text-red-500 mt-0.5">Report Invalid Details</button>
            </div>
          </div>

          {/* Address (premium only) */}
          {isPremium && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={13} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                <p className="text-sm text-slate-700 mt-0.5">{supplier.address}</p>
                <p className="text-xs text-slate-500">ZIP: {supplier.zip}</p>
                <button className="text-[10px] text-red-400 hover:text-red-500 mt-0.5">Report Invalid Details</button>
              </div>
            </div>
          )}

          {/* Website (premium only) */}
          {isPremium && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <Globe size={13} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website</p>
                <a href="#" className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 mt-0.5">
                  {supplier.website}
                  <ExternalLink size={11} />
                </a>
                <button className="text-[10px] text-red-400 hover:text-red-500 mt-0.5">Report Invalid Details</button>
              </div>
            </div>
          )}
        </div>

        {/* Free Tier CTA */}
        {!isPremium && (
          <div className="mt-4 px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-sky-500" />
              <span className="text-xs text-slate-600 font-medium">Join to see full supplier details</span>
            </div>
            <a href="/pricing" className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-sm hover:from-sky-600 hover:to-blue-700 transition-all">
              Join Now!
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. SUPPLIER CONTACT PANEL — right sidebar on deal/supplier pages
   ═══════════════════════════════════════════════════ */
function SupplierContactPanel({ supplier, isPremium = false }) {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const currentDay = now.getDay();
  const isOpenToday = supplier.openDays[currentDay];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {supplier.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">
              <BadgeCheck size={10} />
              Verified Seller
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-900">{supplier.name}</h3>
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {supplier.categories.slice(0, 3).map((cat) => (
            <a key={cat} href="#" className="px-2 py-1 text-[10px] font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-medium text-slate-400 bg-slate-50 rounded-md">
              +{supplier.categories.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Address</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Country:</span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span>{FLAGS[supplier.country]}</span> {supplier.countryName}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">City:</span>
            <BlurredText text={supplier.city} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Postal Code:</span>
            <BlurredText text={supplier.zip} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Street:</span>
            <BlurredText text={supplier.address.split(",")[0]} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Website:</span>
            {isPremium ? (
              <a href="#" className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
                {supplier.website} <ExternalLink size={10} />
              </a>
            ) : (
              <BlurredText text={supplier.website} isPremium={false} className="text-slate-700 font-medium" />
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contact</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Contact Name:</span>
            <BlurredText text={supplier.contactName} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Position:</span>
            <BlurredText text={supplier.contactPosition} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Phone Number:</span>
            <BlurredText text={supplier.phone} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
        </div>
        {!isPremium && (
          <button className="w-full mt-3 px-3 py-2 text-xs font-semibold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-center gap-1.5">
            <Eye size={12} />
            Show Details
          </button>
        )}
      </div>

      {/* Opening Hours */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Opening hours</h4>
        <p className="text-sm font-semibold text-slate-800 mb-3">{supplier.openingHours}</p>
        <div className="flex items-center gap-1.5">
          {DAY_LABELS.map((day, i) => (
            <div
              key={day}
              className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                i === currentDay
                  ? supplier.openDays[i]
                    ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200"
                    : "bg-red-500 text-white shadow-sm ring-2 ring-red-200"
                  : supplier.openDays[i]
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5">
          <Clock size={11} />
          At wholesaler's it is currently <strong className="text-slate-700">{currentTime}</strong>
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="px-5 py-4 space-y-2">
        {isPremium ? (
          <>
            <button className="w-full py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5">
              <Send size={13} />
              Send Enquiry
            </button>
            <div className="flex gap-2">
              <a href={`/supplier/${supplier.id}`} className="flex-1 py-2 text-xs font-semibold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors text-center">
                View Profile
              </a>
              <a href="#" className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
                View All Deals
              </a>
            </div>
          </>
        ) : (
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl transition-all shadow-sm"
          >
            <Lock size={14} />
            Join Now
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SUPPLIER PROFILE PAGE — single-supplier.html
   ═══════════════════════════════════════════════════ */
function SupplierProfilePage({ supplier, isPremium = false }) {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="flex gap-6 items-start">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
            <h1 className="text-xl font-extrabold text-white">{supplier.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {supplier.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-400/20 text-emerald-300 rounded-md">
                  <BadgeCheck size={10} />
                  Verified Seller
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-slate-300">
                <span>{FLAGS[supplier.country]}</span> {supplier.countryName}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={11} />
                {supplier.yearsActive} years
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { id: "about", label: "About" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-sky-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
                </div>

                {/* Products Distributed */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package size={13} className="text-sky-500" />
                    Products Distributed by This Supplier
                  </h3>
                  <p className="text-sm text-slate-600">{supplier.products}</p>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Tag size={13} className="text-sky-500" />
                    Brands Distributed by This Supplier
                  </h3>
                  {supplier.brands.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supplier.brands.map((brand) => (
                        <span key={brand} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg">
                          {brand}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No brands found</p>
                  )}
                </div>

                {/* Focus */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-sky-500" />
                    Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.focus.map((f) => (
                      <span key={f} className="px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 rounded-lg border border-sky-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Rating Summary */}
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-slate-900">{supplier.rating.toFixed(1)}</p>
                    <StarRating rating={supplier.rating} size={14} />
                    <p className="text-xs text-slate-400 mt-1">({supplier.reviewCount} reviews)</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = stars === 5 ? 15 : stars === 4 ? 6 : stars === 3 ? 2 : stars === 2 ? 1 : 0;
                      const pct = (count / supplier.reviewCount) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-500 w-3 text-right">{stars}</span>
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 w-5 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {review.initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-slate-800">{review.author}</span>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={10} />
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar — Contact Panel */}
      <div className="w-80 shrink-0 hidden lg:block">
        <SupplierContactPanel supplier={supplier} isPremium={isPremium} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 4 Full Layout
   ═══════════════════════════════════════════════════ */
export default function Phase4Suppliers() {
  const [isPremium, setIsPremium] = useState(false);
  const [currentView, setCurrentView] = useState("listing");
  const [selectedSupplier, setSelectedSupplier] = useState(SUPPLIERS[2]);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Tag size={14} className="text-white" />
            </div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Wholesale<span className="text-sky-500">Up</span>
            </span>
          </div>
          <span className="text-xs text-slate-400">Phase 4 — Supplier Cards & Profile</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Building2 size={16} className="text-sky-500" />
            Interactive Controls
          </h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              onClick={() => setIsPremium(!isPremium)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPremium ? <Unlock size={12} /> : <Lock size={12} />}
              {isPremium ? "Premium User" : "Free User"}
            </button>
            <button
              onClick={() => setCurrentView("listing")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === "listing" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              Suppliers Listing
            </button>
            <button
              onClick={() => setCurrentView("profile")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === "profile" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              Single Supplier Profile
            </button>
            <button
              onClick={() => setCurrentView("panel")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                currentView === "panel" ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              Contact Panel Only
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Toggle <strong>Free/Premium</strong> to see how contact details are blurred or revealed. Switch views to see listing cards vs. full profile page.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[
              "Supplier listing card",
              "Premium/Free gating",
              "Blurred contact details",
              "Contact panel sidebar",
              "Opening hours widget",
              "About/Reviews tabs",
              "Review rating bars",
              "Category tags",
            ].map((f) => (
              <div key={f} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── VIEW: Supplier Listing ── */}
        {currentView === "listing" && (
          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Wholesale Suppliers</h1>
                <p className="text-sm text-slate-400 mt-0.5">(4,691 suppliers)</p>
              </div>
            </div>
            <div className="space-y-4">
              {SUPPLIERS.map((s) => (
                <SupplierCard key={s.id} supplier={s} isPremium={isPremium} />
              ))}
            </div>
          </div>
        )}

        {/* ── VIEW: Single Supplier Profile ── */}
        {currentView === "profile" && (
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <a href="#" className="hover:text-sky-500 transition-colors">Suppliers</a>
              <ChevronRight size={12} />
              <span className="text-slate-700 font-medium">{selectedSupplier.name}</span>
            </div>

            {/* Supplier selector for demo */}
            <div className="flex gap-2 mb-4">
              {SUPPLIERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSupplier(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedSupplier.id === s.id
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s.name.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            <SupplierProfilePage supplier={selectedSupplier} isPremium={isPremium} />
          </div>
        )}

        {/* ── VIEW: Contact Panel Only ── */}
        {currentView === "panel" && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3 text-center">
              Contact Panel Component (right sidebar)
            </p>
            <SupplierContactPanel supplier={SUPPLIERS[0]} isPremium={isPremium} />
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
