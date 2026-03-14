"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import Image from "next/image";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import {
  Tag,
  Heart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lock,
  Star,
  Eye,
  ArrowRight,
  Search,
  X,
  Package,
  Truck,
  EyeOff,
  MessageSquare,
  ExternalLink,
  Flame,
  Clock,
  SlidersHorizontal,
  CheckCircle2,
  Crown,
  MapPin,
  Store,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Zap,
  AlertTriangle,
  ImageOff,
  ShoppingCart,
  ArrowUpDown,
  Globe,
  Phone,
  Building2,
  Users,
  Rocket,
  Calendar,
  TrendingUp,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import Breadcrumb from "@/components/shared/breadcrumb";
import VerifiedBadge from "@/components/shared/verified-badge";
import StarRating from "@/components/shared/star-rating";
import ContactSupplierModal from "@/components/shared/contact-modal";
import WebsiteLink from "@/components/shared/website-link";
import { LockedLogoPlaceholder } from "@/components/shared/logo";
import { CollapsibleFilterPanel, SidebarPromoPanel } from "@/components/shared/collapsible-filter-panel";
import { FILTER_CATEGORIES, getCategoryById } from "@/lib/categories";
import { COUNTRIES as CANONICAL_COUNTRIES } from "@/lib/countries";
import { Pagination, ActiveFilterChips } from "./filters";
import { DetailedDealCard, ListDealCard, TrendingDealCard, PRODUCTS as ALL_DEAL_PRODUCTS } from "./deal-cards";

/* ─────────── Flag Images (flat style via flagcdn.com) ─────────── */
const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };
function FlagImg({ code, size = 20 }) {
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}
const FLAGS = Object.fromEntries(
  Object.keys(FLAG_CODES).map((k) => [k, <FlagImg key={k} code={k} size={18} />])
);

/* ─────────── BUYER TYPE LABELS ─────────── */
const BUYER_TYPE_LABELS = {
  "online-retailer": "Online Retailers",
  "shop-retailer": "Shop / High Street Retailers",
  "multi-chain": "Multi-Chain Retailers",
  "marketplace-seller": "Marketplace Sellers",
  "dropshipper": "Dropshippers",
  "market-trader": "Market Traders",
  "wholesaler-reseller": "Wholesalers / Resellers",
  "distributor": "Distributors / Importers",
  "supermarket": "Supermarket / Grocery",
  "hospitality": "Hospitality / HoReCa",
  "corporate-buyer": "Corporate / Procurement",
  "franchisee": "Franchisees",
  "charity-nonprofit": "Charities / Non-Profits",
  "government": "Government / Public Sector",
  "subscription-box": "Subscription Box Services",
  "social-commerce": "Social Commerce Sellers",
  "mail-order": "Mail Order / Catalogue",
};

/* ─────────── SUPPLIER TYPE LABELS ─────────── */
const SUPPLIER_TYPE_LABELS = {
  manufacturer: "Manufacturer",
  "brand-owner": "Brand Owner",
  "private-label": "Private / White Label",
  wholesaler: "Wholesaler",
  distributor: "Distributor",
  importer: "Importer",
  exporter: "Exporter",
  "trading-company": "Trading Company",
  liquidator: "Liquidator / Clearance",
  dropshipper: "Dropshipper",
  "sourcing-agent": "Sourcing Agent",
  "artisan-maker": "Artisan / Maker",
};

/* ─────────── GRADE OPTIONS ─────────── */
const ALL_GRADES = [
  { id: "new", label: "New" },
  { id: "used", label: "Used" },
  { id: "returns", label: "Returns / Mixed Stock" },
  { id: "liquidation", label: "Liquidation Stocklots" },
  { id: "refurbished", label: "Refurbished" },
];

/* ─────────── Placeholder Supplier Data ─────────────────────────
   PRODUCTION: This will come from the API based on URL slug
   - GET /api/suppliers/[slug] → supplier profile
   - GET /api/suppliers/[slug]/deals → paginated deals
   ─────────────────────────────────────────────────────────────── */
const SUPPLIER = {
  id: 1,
  companyName: "ThreadLine Trading Ltd",
  slug: "threadline-trading-ltd",
  isVerified: true,
  rating: 4.8,
  reviewCount: 127,
  yearsActive: 6,
  country: "United Kingdom",
  countryCode: "gb",
  memberSince: "March 2018",
  categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots"],
  productCategories: ["clothing-fashion", "jewellery-watches", "home-garden"],
  companyDescription: "We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections.",
  productsOffered: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches.",
  brandsDistributed: ["Nike", "Adidas", "Levi's", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren"],
  contact: {
    name: "Jane Collin",
    roleInCompany: "Store Manager",
    mobileNumber: "+44 7700 900123",
    landlineNumber: "+44 0203 0484377",
    whatsappNumber: "+44 7700 900123",
    teamsHandle: "@janecollin",
    linkedinUrl: "https://linkedin.com/in/janecollin",
  },
  address: {
    country: "United Kingdom",
    countryCode: "gb",
    city: "Manchester",
    postalCode: "M1 1AD",
    street: "New Cathedral",
  },
  companyWebsite: "sitename.com",
  isSupplierPro: true,
  salutation: "Mrs",
  languages: ["English", "French"],
  companyLogo: "/images/supplier-logo-placeholder.svg",
  yearEstablished: 2018,
  companySize: "10-50",
  facilitySize: 2000,
  facilitySizeUnit: "m²",
  supplierType: ["wholesaler", "distributor"],
  buyerTypesServed: ["online-retailer", "marketplace-seller", "shop-retailer"],
  customersServed: ["registered-companies", "sole-traders"],
  customizationAbility: ["drawing-based", "sample-based"],
  preferredCurrency: "GBP",
  minimumOrderAmount: 500,
  minimumOrderCurrency: "GBP",
  paymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
  paymentTerms: "Net 30 for approved accounts; prepayment for first orders",
  defaultDepositPercentage: 25,
  defaultDepositTerms: "25% deposit on order confirmation, balance due before dispatch",
  defaultInvoiceType: "vat",
  sanitizedInvoice: "on-request",
  defaultTaxClass: "standard",
  returnPolicy: "Returns accepted within 14 days of delivery for unopened, undamaged goods in original packaging.",
  deliveryMethods: ["dpd", "pallet-delivery", "own-fleet", "click-collect"],
  leadTime: "3-5-days",
  defaultIncoterms: "DDP",
  countriesServed: ["GB", "IE", "DE", "FR", "NL", "BE", "ES", "IT", "PL", "SE", "DK", "AT", "PT"],
  excludedCountries: ["RU", "BY"],
  sampleAvailability: "paid",
  catalogueSize: "1000-5000",
  supplyModels: ["wholesale", "dropshipping", "white-label"],
  certifications: ["ce", "ukca", "oeko-tex", "bsci"],
  productQualityTier: ["mid-range", "premium"],
  businessHours: {
    sunday:    { status: "closed", slots: [] },
    monday:    { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
    tuesday:   { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
    wednesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
    thursday:  { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
    friday:    { status: "open", slots: [{ open: "08:00", close: "14:00" }] },
    saturday:  { status: "closed", slots: [] },
  },
  currentTime: "10:12",
  socialFacebook: "https://facebook.com/clothingwholesaler",
  socialInstagram: "https://instagram.com/clothingwholesaler",
  socialLinkedin: "https://linkedin.com/company/clothingwholesaler",
  discountTiers: [
    { minOrder: 2000, discount: 5 },
    { minOrder: 5000, discount: 10 },
    { minOrder: 10000, discount: 15 },
  ],
  discountNotes: "Discounts apply to single orders only and cannot be combined with promotional offers.",
};

/* ─── Generate demo deals for this supplier ───
   PRODUCTION: Replace with GET /api/suppliers/[slug]/deals
   For demo, we reuse the global PRODUCTS array and override
   supplier-related fields to match SUPPLIER above.
   NOTE: This is a base template. The actual deals used in the
   component are derived via useMemo so that isSupplierPro
   reacts to demo dropdown changes.
   ─────────────────────────────────────────────── */
const SUPPLIER_DEALS_BASE = ALL_DEAL_PRODUCTS.map((p, i) => ({
  ...p,
  id: i + 1,
  supplier: SUPPLIER.companyName,
  // isSupplierPro intentionally omitted — set dynamically in component
  // Spread deals across supplier's categories
  categories: [SUPPLIER.productCategories[i % SUPPLIER.productCategories.length]],
  category: (() => {
    const slug = SUPPLIER.productCategories[i % SUPPLIER.productCategories.length];
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  })(),
  // Mix countries — mostly supplier country, some from other served countries
  country: i % 4 === 0 ? "DE" : i % 5 === 0 ? "FR" : "UK",
  countryName: i % 4 === 0 ? "Germany" : i % 5 === 0 ? "France" : "United Kingdom",
  shippingCountries: i % 4 === 0 ? ["de"] : i % 5 === 0 ? ["fr"] : ["gb"],
  buyerTypesServed: SUPPLIER.buyerTypesServed,
}));

/* ═══════════════════════════════════════════════════
   COLLAPSIBLE FILTER SECTION
   ═══════════════════════════════════════════════════ */
function FilterSection({ title, defaultOpen = true, onClear, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const titleSlug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group"
        aria-expanded={open}
        aria-controls={`filter-section-${titleSlug}`}
      >
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {onClear && (
            <span
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-[10px] text-orange-500 hover:text-orange-600 font-semibold cursor-pointer"
            >
              Clear
            </span>
          )}
          {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </button>
      {open && <div className="px-4 pb-3.5" id={`filter-section-${titleSlug}`}>{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHECKBOX ITEM
   ═══════════════════════════════════════════════════ */
function CheckboxItem({ id, label, count, checked, onChange, prefix, highlighted }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 focus:ring-offset-0 cursor-pointer"
      />
      {prefix && <span className="text-base shrink-0">{prefix}</span>}
      <span className={`text-sm flex-1 truncate ${highlighted ? "text-orange-500 font-semibold" : "text-slate-600 group-hover:text-slate-900"}`}>
        {label}
      </span>
      {count !== undefined && (
        <span className={`text-xs tabular-nums px-2 py-0.5 rounded-md ${highlighted ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-400"}`}>
          {count.toLocaleString()}
        </span>
      )}
    </label>
  );
}

/* ═══════════════════════════════════════════════════
   PRICE RANGE SLIDER
   ═══════════════════════════════════════════════════ */
const PRICE_MIN = 0;
const PRICE_MAX_DEFAULT = 10000;

function PriceRangeSlider({ filters, setFilters, maxPrice }) {
  const PRICE_MAX = maxPrice || PRICE_MAX_DEFAULT;
  const [localMin, setLocalMin] = useState(filters.priceMin);
  const [localMax, setLocalMax] = useState(filters.priceMax);
  const debounceRef = useRef(null);

  useEffect(() => { setLocalMin(filters.priceMin); }, [filters.priceMin]);
  useEffect(() => { setLocalMax(filters.priceMax); }, [filters.priceMax]);

  const commitDebounced = useCallback((min, max) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((p) => ({ ...p, priceMin: min, priceMax: max }));
    }, 500);
  }, [setFilters]);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const minVal = localMin === "" ? PRICE_MIN : Number(localMin);
  const maxVal = localMax === "" ? PRICE_MAX : Number(localMax);

  const getPercent = useCallback((val) =>
    ((val - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  , []);

  const handleMinInput = (e) => {
    const raw = e.target.value;
    if (raw === "") { setLocalMin(""); commitDebounced("", localMax); return; }
    const val = Math.min(Number(raw), maxVal - 1);
    const str = String(val);
    setLocalMin(str);
    commitDebounced(str, localMax);
  };
  const handleMaxInput = (e) => {
    const raw = e.target.value;
    if (raw === "") { setLocalMax(""); commitDebounced(localMin, ""); return; }
    const val = Math.max(Number(raw), minVal + 1);
    const str = String(val);
    setLocalMax(str);
    commitDebounced(localMin, str);
  };
  const handleMinRange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    const str = String(val);
    setLocalMin(str);
    commitDebounced(str, localMax);
  };
  const handleMaxRange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    const str = String(val);
    setLocalMax(str);
    commitDebounced(localMin, str);
  };

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Min.</label>
          <input type="number" value={localMin} onChange={handleMinInput} placeholder="0" min={PRICE_MIN} max={PRICE_MAX}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]" />
        </div>
        <span className="text-slate-300 mt-4">–</span>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Max.</label>
          <input type="number" value={localMax} onChange={handleMaxInput} placeholder={String(PRICE_MAX)} min={PRICE_MIN} max={PRICE_MAX}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]" />
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1 bg-slate-200 rounded-full" />
        <div className="absolute h-1 bg-orange-400 rounded-full" style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={minVal} onChange={handleMinRange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: minVal > PRICE_MAX - 100 ? 40 : 30 }} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={maxVal} onChange={handleMaxRange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 30 }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER DEALS FILTER SIDEBAR
   ═══════════════════════════════════════════════════
   Custom filter sidebar that adapts to the supplier's data:
   - Categories: only categories in which supplier has deals
   - Country: only if supplier has deals from multiple countries
   - Dropshipping: only if supplier has dropship deals
   - Grade: only grades found in supplier's deals
   - Buyers Served: shown as checkmark list from supplier profile
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   COMPACT SUPPLIER SUMMARY — purpose-built for 272px sidebar
   ═══════════════════════════════════════════════════
   Placed directly in the sidebar column (no bordered wrapper).
   Blue Pro border is on the sidebar container itself, not here.
   Uses the same gating rules as SupplierSidebarCard.
   ═══════════════════════════════════════════════════ */

/* ── OPEN/CLOSED helper (same logic as supplier-sidebar.jsx) ── */
const DAYS_DISPLAY_COMPACT = [
  { key: "monday", short: "Mon" }, { key: "tuesday", short: "Tue" },
  { key: "wednesday", short: "Wed" }, { key: "thursday", short: "Thu" },
  { key: "friday", short: "Fri" }, { key: "saturday", short: "Sat" },
  { key: "sunday", short: "Sun" },
];
const DAY_BY_JS_INDEX_COMPACT = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getIsOpenNow(bh, currentTime) {
  if (!bh || !currentTime) return null; // null = unknown
  const todayKey = DAY_BY_JS_INDEX_COMPACT[new Date().getDay()];
  const todayData = bh[todayKey];
  if (!todayData || todayData.status !== "open") return false;
  const slots = todayData.slots?.filter((s) => s.open && s.close);
  if (!slots || slots.length === 0) return false;
  const now = currentTime.replace(":", "");
  return slots.some((s) => {
    const openN = s.open.replace(":", "");
    const closeN = s.close.replace(":", "");
    return now >= openN && now < closeN;
  });
}

function CompactSupplierPanel({ supplier, displayName, canViewName, canViewContacts, canViewBranding, isLoggedIn }) {
  const [contactOpen, setContactOpen] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

  const SUPPLY_MODEL_LABELS = { wholesale: "Wholesale", dropshipping: "Dropshipping", liquidation: "Liquidation", "white-label": "White Label", "private-label": "Private Label", "job-lots": "Job Lots" };

  /* Opening hours */
  const bh = supplier.businessHours;
  const hasAnyHours = bh && DAYS_DISPLAY_COMPACT.some((d) => bh[d.key]?.status === "open" || bh[d.key]?.status === "closed");
  const isCurrentlyOpen = hasAnyHours ? getIsOpenNow(bh, supplier.currentTime) : null;

  return (
    <div className="relative">
      {/* Row 1: Verified Supplier (left) + Open badge (left) + PRO (right) */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {supplier.isVerified && <VerifiedBadge size={9} label="Verified" className="text-[9px] px-1.5 py-0.5" />}
          {isCurrentlyOpen === true && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open
            </span>
          )}
        </div>
        {supplier.isSupplierPro && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#1e5299] text-white text-[9px] font-bold rounded-md shadow-sm">
            <Crown size={9} className="shrink-0" /> PRO
          </div>
        )}
      </div>

      {/* Row 2: Logo + Company name (gated) */}
      <div className="flex items-center gap-3 mb-2.5">
        {canViewBranding && supplier.companyLogo ? (
          <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            <Image src={supplier.companyLogo} alt="" width={44} height={44} className="object-cover" />
          </div>
        ) : (
          <LockedLogoPlaceholder size="md" href="/register" title="Register to see supplier branding" />
        )}
        <h3 className="text-sm font-bold text-slate-900 leading-tight min-w-0">
          <a href={`/supplier${supplier.slug ? `/${supplier.slug}` : ""}`} className="hover:text-orange-600 transition-colors">
            {displayName}
          </a>
        </h3>
      </div>

      {/* Row 3: Supplier types */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {(supplier.supplierType || []).slice(0, 2).map((st) => (
          <span key={st} className="px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded">
            {SUPPLIER_TYPE_LABELS[st] || st}
          </span>
        ))}
      </div>

      {/* Row 4: Country · x yrs · Star rating */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2.5 flex-wrap">
        <span className="flex items-center gap-1">
          <FlagImg code={supplier.address?.countryCode || supplier.countryCode} size={14} />
          {supplier.address?.country || supplier.country}
        </span>
        {supplier.yearsActive && (
          <>
            <span className="text-slate-300">&middot;</span>
            <span className="flex items-center gap-0.5">
              <Calendar size={10} /> {supplier.yearsActive} yrs
            </span>
          </>
        )}
        <span className="text-slate-300">&middot;</span>
        <a href="/supplier?tab=reviews" className="flex items-center gap-0.5 hover:opacity-80 transition-opacity">
          <Star size={11} className="fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-700">{supplier.rating}</span>
        </a>
      </div>

      {/* Row 5: Supply models (Wholesale, Dropshipping, White Label) */}
      {(supplier.supplyModels || []).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {supplier.supplyModels.map((sm) => (
            <span key={sm} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded">
              <CheckCircle2 size={9} className="text-emerald-500" />
              {SUPPLY_MODEL_LABELS[sm] || sm}
            </span>
          ))}
        </div>
      )}

      {/* Contact info (gated) */}
      {canViewContacts ? (
        <div className="space-y-1.5 mb-2.5">
          {/* Contact name card (shortened) */}
          {supplier.contact?.name && (
            <div className="flex items-center gap-2 text-[11px] text-slate-700">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-white">
                  {supplier.contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold truncate block">{supplier.contact.name}</span>
                {supplier.contact.roleInCompany && (
                  <span className="text-[10px] text-slate-400 truncate block">{supplier.contact.roleInCompany}</span>
                )}
              </div>
            </div>
          )}
          {supplier.contact?.mobileNumber && (
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <Phone size={11} className="text-slate-400 shrink-0" />
              <span className="truncate">{supplier.contact.mobileNumber}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <MapPin size={11} className="text-slate-400 shrink-0" />
              <span className="truncate">{supplier.address.city}, {supplier.address.country}</span>
            </div>
          )}
          {/* Visit website link */}
          {supplier.companyWebsite && (
            <div className="flex items-center gap-2 text-[11px]">
              <Globe size={11} className="text-slate-400 shrink-0" />
              <WebsiteLink url={supplier.companyWebsite} slug={supplier.slug} className="text-orange-500 hover:text-orange-600 truncate text-[11px]">
                Visit Website
              </WebsiteLink>
            </div>
          )}
        </div>
      ) : (
        <div className="relative mb-2.5 rounded-lg bg-slate-50 p-2.5 text-center">
          <Lock size={14} className="text-slate-300 mx-auto mb-1" />
          <p className="text-[10px] text-slate-400">Contact details available to {isLoggedIn ? "Premium" : "registered"} members</p>
        </div>
      )}

      {/* CTA buttons */}
      <div className="space-y-2">
        {canViewContacts ? (
          <button
            onClick={() => setContactOpen(true)}
            className="w-full py-2 rounded-lg text-xs font-bold text-white bg-[#1e5299] hover:bg-[#174280] flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            <MessageSquare size={12} /> Send Enquiry
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="w-full py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Rocket size={12} /> Upgrade to Contact
          </a>
        ) : (
          <button onClick={openRegisterModal} className="w-full py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={12} /> Log In / Register
          </button>
        )}
        <a
          href={`/supplier${supplier.slug ? `/${supplier.slug}` : ""}`}
          className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-orange-500 border border-orange-200 hover:bg-orange-50 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-1"
        >
          <Store size={11} /> View Full Profile
        </a>
      </div>

      {contactOpen && (
        <ContactSupplierModal
          name={displayName}
          subjectDefault={`Enquiry for ${displayName}`}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER DEALS FILTER SIDEBAR
   ═══════════════════════════════════════════════════
   Custom filter sidebar that adapts to the supplier's data:
   - Top: compact supplier summary panel
   - Categories: only categories in which supplier has deals
   - Country: only if supplier has deals from multiple countries
   - Dropshipping: only if supplier has dropship deals
   - Grade: only grades found in supplier's deals
   - Buyers Served: shown as checkmark list from supplier profile
   ═══════════════════════════════════════════════════ */
function SupplierDealsFilterSidebar({ filters, setFilters, isOpen, onClose, supplier, deals, maxPrice, displayName, canViewName, canViewContacts, canViewBranding, isLoggedIn, isPremium }) {
  const [countrySearch, setCountrySearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));
  };

  /* ── Derive available filter options from the supplier's deals ── */
  const LEGACY_TO_ISO = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };

  const dealCategories = useMemo(() => {
    const catCounts = {};
    deals.forEach((d) => (d.categories || []).forEach((c) => { catCounts[c] = (catCounts[c] || 0) + 1; }));
    return FILTER_CATEGORIES
      .filter((fc) => catCounts[fc.id])
      .map((fc) => ({ ...fc, dealCount: catCounts[fc.id] || 0 }));
  }, [deals]);

  const dealCountries = useMemo(() => {
    const countryCounts = {};
    if (supplier.address?.countryCode) countryCounts[supplier.address.countryCode.toLowerCase()] = 0;
    deals.forEach((d) => {
      const iso = d.stockLocationCode || LEGACY_TO_ISO[d.country] || d.country?.toLowerCase();
      if (iso) countryCounts[iso] = (countryCounts[iso] || 0) + 1;
    });
    return CANONICAL_COUNTRIES
      .filter((c) => countryCounts[c.iso] !== undefined)
      .map((c) => ({ code: c.iso, name: c.label, dealCount: countryCounts[c.iso] || 0 }));
  }, [deals, supplier]);
  const showCountryFilter = dealCountries.length > 1;

  const hasDropshipDeals = useMemo(() => deals.some((d) => d.isDropship), [deals]);

  const dealGrades = useMemo(() => {
    const gradeSet = new Set();
    deals.forEach((d) => {
      if (d.grade) gradeSet.add(d.grade.toLowerCase());
    });
    return ALL_GRADES.filter((g) => gradeSet.has(g.id) || gradeSet.has(g.label.toLowerCase()));
  }, [deals]);
  const showGradeFilter = dealGrades.length > 1;

  const buyerTypesServed = supplier.buyerTypesServed || [];

  const filteredCountries = dealCountries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const hasActiveFilters =
    filters.category != null ||
    (filters.priceMin && filters.priceMin !== "") ||
    (filters.priceMax && filters.priceMax !== "") ||
    filters.countries.length > 0 ||
    filters.dropshipping === true ||
    filters.grades.length > 0;

  return (
    <aside
      className={`
        bg-white border border-slate-200 shadow-sm overflow-hidden
        ${isOpen ? "w-full h-full rounded-none lg:w-72 lg:rounded-xl lg:h-auto lg:shrink-0" : "hidden lg:block w-72 shrink-0 rounded-xl"}
      `}
    >
      {/* ── Compact Supplier Summary — blue Pro border on left ── */}
      <div className={`p-4 border-b border-slate-200 ${
        supplier.isSupplierPro ? "border-l-[3px] border-l-[#1e5299]" : ""
      }`}>
        <CompactSupplierPanel
          supplier={supplier}
          displayName={displayName}
          canViewName={canViewName}
          canViewContacts={canViewContacts}
          canViewBranding={canViewBranding}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* ── Filter Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-slate-800">Filter Supplier Deals</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={() => setFilters((prev) => ({
                ...prev,
                category: null,
                priceMin: "",
                priceMax: "",
                countries: [],
                dropshipping: false,
                grades: [],
              }))}
              className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
            aria-label="Close filters"
          >
            <X size={14} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-none custom-scrollbar">
        {/* ── Categories (only supplier's deal categories) ── */}
        {dealCategories.length >= 1 && (() => {
          const searchLower = categorySearch.toLowerCase();
          const filteredCats = categorySearch
            ? dealCategories.filter((c) => c.label.toLowerCase().includes(searchLower))
            : dealCategories;
          return (
            <FilterSection
              title="Categories"
              onClear={filters.category ? () => setFilters((p) => ({ ...p, category: null })) : undefined}
            >
              {dealCategories.length > 2 && (
                <div className="relative mb-2.5">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    aria-label="Search categories"
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
                  />
                </div>
              )}
              <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                {filteredCats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters((p) => ({ ...p, category: p.category === cat.id ? null : cat.id }))}
                    className="w-full flex items-center justify-between py-1.5 text-left group"
                  >
                    <span className={`text-sm transition-colors ${
                      filters.category === cat.id ? "text-orange-500 font-semibold" : "text-slate-600 group-hover:text-orange-500"
                    }`}>
                      {cat.label}
                    </span>
                    <span className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${
                      filters.category === cat.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-400"
                    }`}>
                      {cat.dealCount.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </FilterSection>
          );
        })()}

        {/* ── Price Range ── */}
        <FilterSection title="Price">
          <PriceRangeSlider filters={filters} setFilters={setFilters} maxPrice={maxPrice} />
        </FilterSection>

        {/* ── Country (only if deals from >1 country) ── */}
        {showCountryFilter && (
          <FilterSection
            title="Country"
            onClear={filters.countries.length > 0 ? () => setFilters((p) => ({ ...p, countries: [] })) : undefined}
          >
            {filteredCountries.length > 4 && (
              <div className="relative mb-2.5">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..." aria-label="Search countries"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
                />
              </div>
            )}
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {filteredCountries.map((country) => (
                <CheckboxItem
                  key={country.code}
                  id={`sd-country-${country.code}`}
                  label={country.name}
                  count={country.dealCount}
                  prefix={<FlagImg code={country.code} size={18} />}
                  checked={filters.countries.includes(country.code)}
                  onChange={() => toggleArrayFilter("countries", country.code)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Dropshipping (only if supplier has dropship deals) ── */}
        {hasDropshipDeals && (
          <FilterSection title="Dropshipping">
            <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
              <button
                type="button"
                role="switch"
                aria-checked={filters.dropshipping}
                onClick={() => setFilters((p) => ({ ...p, dropshipping: !p.dropshipping }))}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 ${
                  filters.dropshipping ? "bg-orange-500" : "bg-slate-300"
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                  filters.dropshipping ? "translate-x-[18px]" : "translate-x-[3px]"
                }`} />
              </button>
              <span className="text-sm text-slate-600 group-hover:text-slate-900">Dropshipping Only</span>
            </label>
          </FilterSection>
        )}

        {/* ── Grade (only grades in supplier's deals) ── */}
        {showGradeFilter && (
          <FilterSection
            title="Grade"
            onClear={filters.grades.length > 0 ? () => setFilters((p) => ({ ...p, grades: [] })) : undefined}
          >
            <div className="space-y-0.5">
              {dealGrades.map((grade) => (
                <CheckboxItem
                  key={grade.id}
                  id={`sd-grade-${grade.id}`}
                  label={grade.label}
                  checked={filters.grades.includes(grade.id)}
                  onChange={() => toggleArrayFilter("grades", grade.id)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Buyers Served (checkmark list, not checkboxes) ── */}
        {buyerTypesServed.length > 0 && (
          <FilterSection title="Buyers Served" defaultOpen={true}>
            <div className="space-y-1.5">
              {buyerTypesServed.map((bt) => (
                <div key={bt} className="flex items-center gap-2 py-1">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-600">
                    {BUYER_TYPE_LABELS[bt] || bt}
                  </span>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Tier-aware upgrade promo panel ── */}
        <SidebarPromoPanel />
      </div>

      <style>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.7); }
      `}</style>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER DEALS TOOLBAR — full toolbar matching /deals SearchToolbar
   ═══════════════════════════════════════════════════ */
function SupplierDealsToolbar({
  displayName,
  totalCount,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  searchMode,
  setSearchMode,
  inlineSearch,
  setInlineSearch,
  onToggleMobileFilter,
  viewMode,
  setViewMode,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sortMetrics = [
    { key: "best-match", label: "Best Match", hasDirection: false },
    { key: "date", label: "Date Added", hasDirection: true, preferred: "desc" },
    { key: "markup", label: "%Markup", hasDirection: true, preferred: "desc" },
    { key: "price", label: "Wholesale Price", hasDirection: true, preferred: "asc" },
    { key: "moq", label: "Minimum Quantity", hasDirection: true, preferred: "asc" },
    { key: "profit", label: "Gross Profit", hasDirection: true, preferred: "desc" },
    { key: "rrp", label: "RRP", hasDirection: true, preferred: "desc" },
    { key: "discount", label: "Discount %", hasDirection: true, preferred: "desc" },
    { key: "units", label: "Units per Case", hasDirection: true, preferred: "asc" },
  ];

  const activeMetric = sortBy === "best-match" ? "best-match" : sortBy.replace(/-(asc|desc)$/, "");
  const activeDir = sortBy === "best-match" ? null : sortBy.endsWith("-asc") ? "asc" : "desc";

  const activeSortLabel = (() => {
    const m = sortMetrics.find((s) => s.key === activeMetric);
    if (!m) return "Best Match";
    if (!m.hasDirection) return m.label;
    return `${m.label} ${activeDir === "asc" ? "\u2191" : "\u2193"}`;
  })();

  return (
    <div className="space-y-3">
      {/* Title Row */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {displayName} <span className="text-base font-semibold text-slate-400">({totalCount.toLocaleString()} deals)</span>
          </h1>
          <h2 className="text-sm font-normal text-slate-500 mt-1 leading-relaxed">
            Browse all wholesale deals from this supplier. Filter by category, price, country, and more to find the best products for{" "}
            {descExpanded ? (
              <>
                your business. Compare prices, markups, and minimum order quantities across the full range of products. Whether you&apos;re looking for dropship-friendly items, bulk wholesale lots, or white-label opportunities, use the filters to narrow down exactly what you need.{" "}
                <button onClick={() => setDescExpanded(false)} className="text-orange-500 hover:text-orange-600 font-medium">Show Less</button>
              </>
            ) : (
              <button onClick={() => setDescExpanded(true)} className="text-orange-500 hover:text-orange-600 font-medium">Show More</button>
            )}
          </h2>
        </div>
      </div>

      {/* Search + Sort Row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search Mode Selector */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          {["Any", "All", "Exact"].map((mode) => (
            <button
              key={mode}
              onClick={() => setSearchMode(mode.toLowerCase())}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all ${
                searchMode === mode.toLowerCase()
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Inline Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inlineSearch}
            onChange={(e) => setInlineSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inlineSearch.trim()) {
                const term = inlineSearch.trim();
                const newKeyword = { term, mode: searchMode || "any" };
                setFilters((p) => {
                  const prev = p.keywords || [];
                  const exists = prev.some((k) =>
                    (typeof k === "string" ? k : k.term) === term &&
                    (typeof k === "string" ? "any" : k.mode) === newKeyword.mode
                  );
                  return exists ? p : { ...p, keywords: [...prev, newKeyword] };
                });
                setInlineSearch("");
              }
            }}
            placeholder="Search within these results..."
            className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
          />
          <button
            onClick={() => {
              if (inlineSearch.trim()) {
                const term = inlineSearch.trim();
                const newKeyword = { term, mode: searchMode || "any" };
                setFilters((p) => {
                  const prev = p.keywords || [];
                  const exists = prev.some((k) =>
                    (typeof k === "string" ? k : k.term) === term &&
                    (typeof k === "string" ? "any" : k.mode) === newKeyword.mode
                  );
                  return exists ? p : { ...p, keywords: [...prev, newKeyword] };
                });
                setInlineSearch("");
              }
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
            aria-label="Search"
          >
            <Search size={14} />
          </button>
        </div>

        {/* Grid / List Toggle */}
        {viewMode && setViewMode && (
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutGrid size={14} /> Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <List size={14} /> List
            </button>
          </div>
        )}

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilter}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        {/* Sort Dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            aria-label="Sort by"
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline text-xs font-medium">Sort:</span>
            <span className="text-xs font-semibold text-slate-800 max-w-[160px] truncate">
              {activeSortLabel}
            </span>
            <ChevronDown size={12} className={`text-slate-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 min-w-[240px]" role="listbox">
              {sortMetrics.map((metric) => {
                const isActive = activeMetric === metric.key;
                return (
                  <div
                    key={metric.key}
                    className={`flex items-center justify-between px-3.5 py-2 text-sm transition-colors ${
                      isActive ? "bg-orange-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {metric.hasDirection ? (() => {
                      const first = metric.preferred || "desc";
                      const second = first === "desc" ? "asc" : "desc";
                      const dirs = [first, second];
                      return (
                        <>
                          <span className={isActive ? "text-orange-700 font-semibold" : "text-slate-600"}>{metric.label}</span>
                          <span className="flex items-center gap-0.5 ml-3">
                            {dirs.map((dir) => {
                              const isActiveDir = isActive && activeDir === dir;
                              const isPreferred = dir === first;
                              const Icon = dir === "asc" ? ChevronUp : ChevronDown;
                              return (
                                <button
                                  key={dir}
                                  onClick={() => { setSortBy(`${metric.key}-${dir}`); setSortOpen(false); }}
                                  className={`p-1 rounded transition-colors ${
                                    isActiveDir
                                      ? "text-orange-600 bg-orange-100"
                                      : isPreferred
                                        ? "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                        : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                                  }`}
                                  role="option"
                                  aria-selected={isActiveDir}
                                  aria-label={`${metric.label} ${dir === "asc" ? "ascending" : "descending"}`}
                                >
                                  <Icon size={14} />
                                </button>
                              );
                            })}
                          </span>
                        </>
                      );
                    })() : (
                      <button
                        onClick={() => { setSortBy(metric.key); setSortOpen(false); }}
                        className={`w-full text-left ${isActive ? "text-orange-700 font-semibold" : "text-slate-600"}`}
                        role="option"
                        aria-selected={isActive}
                      >
                        {metric.label}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      <ActiveFilterChips filters={filters} setFilters={setFilters} searchMode={searchMode} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER'S TOP DEALS — horizontal scroll panel
   ═══════════════════════════════════════════════════
   Same pattern as TrendingDealsPanel in /deals but labelled
   "Supplier's Top Deals" and uses the supplier-deals pool.
   ═══════════════════════════════════════════════════ */
function SupplierTopDealsPanel({ deals, isPremium, isLoggedIn, canViewSupplier }) {
  const scrollRef = useRef(null);
  const topDeals = deals.filter((d) => !d.isExpired).slice(0, 12);
  if (topDeals.length === 0) return null;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-4 sm:p-5 mb-6 shadow-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Flame size={16} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {"Supplier\u2019s Top Deals"} <span className="text-sm font-semibold text-orange-100">(Best Selling)</span>
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <button onClick={() => scroll("left")} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button onClick={() => scroll("right")} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronRight size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x snap-mandatory scrollbar-hide">
        {topDeals.map((product) => (
          <div key={product.id} className="shrink-0 w-[60%] min-w-[180px] sm:w-[38%] sm:min-w-[190px] md:w-[28%] lg:w-[22%] xl:w-[17%] 2xl:w-[14%] snap-start">
            <TrendingDealCard product={product} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE COMPONENT — /supplier-deals
   ═══════════════════════════════════════════════════ */
export default function SupplierDealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { demoRole, demoCategory, demoSupplierPro, isLoggedIn, isPremium, canViewSupplier } = useDemoAuth();

  /* ── Supplier data (override Pro status from demo dropdown) ── */
  const supplier = useMemo(() => ({
    ...SUPPLIER,
    isSupplierPro: demoSupplierPro ?? SUPPLIER.isSupplierPro,
  }), [demoSupplierPro]);

  /* ── Gating booleans ──
     /supplier-deals is deal-centric — Standard can enquire about deals from ALL supplier tiers
     (account-types matrix: "Enquire Supplier deals: Standard=Yes"), so name, contacts, and
     branding all use canViewSupplier (which includes Standard) instead of isPremium.
     This does NOT affect /supplier or /suppliers which keep their own stricter
     isPremium-based formulas where Standard cannot see Supplier Free identity/contacts. */
  const canViewName = isLoggedIn && (supplier.isSupplierPro || canViewSupplier);
  const canViewContacts = isLoggedIn && (supplier.isSupplierPro || canViewSupplier);
  const canViewBranding = isLoggedIn && (supplier.isSupplierPro || canViewSupplier);

  /* ── Anonymous name (for non-premium viewers of Supplier Free) ── */
  const displayName = useMemo(() => {
    if (canViewName) return supplier.companyName;
    const rawCat = supplier.productCategories?.[0] || "Wholesale";
    const firstCat = rawCat.includes("-")
      ? rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : rawCat;
    const stem = firstCat.replace(/\s+Supplier$/i, "");
    const types = supplier.supplierType || [];
    const typesLabel = types.length > 0
      ? types.map((st) => SUPPLIER_TYPE_LABELS[st] || st).join(" & ")
      : "Supplier";
    return `${stem} ${typesLabel}`;
  }, [canViewName, supplier]);

  /* ── Supplier deals — reactive to demo dropdown isSupplierPro ── */
  const supplierDeals = useMemo(() =>
    SUPPLIER_DEALS_BASE.map((p) => ({
      ...p,
      isSupplierPro: supplier.isSupplierPro,
    })),
    [supplier.isSupplierPro]
  );

  /* ── Filter state ── */
  const [filters, setFilters] = useState({
    category: null,
    priceMin: "",
    priceMax: "",
    countries: [],
    dropshipping: false,
    grades: [],
    keywords: [],
  });

  const [sortBy, setSortBy] = useState("best-match");
  const [viewMode, setViewMode] = useState("grid");
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCollapsed, toggleFilterCollapsed, setFilterCollapsed] = usePanelCollapse("wup-sd-filter-collapsed");

  /* ── Pagination ── */
  const urlPage = Number(searchParams.get("page")) || 1;
  const [page, setPageState] = useState(urlPage);
  const [perPage, setPerPage] = useState(18);

  useEffect(() => { setPageState(urlPage); }, [urlPage]);

  const setPage = useCallback((newPage) => {
    setPageState(newPage);
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) { params.delete("page"); } else { params.set("page", String(newPage)); }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, router]);

  const buildPageHref = useCallback((n) => {
    const params = new URLSearchParams(searchParams.toString());
    if (n <= 1) { params.delete("page"); } else { params.set("page", String(n)); }
    const qs = params.toString();
    return qs ? `?${qs}` : window.location.pathname;
  }, [searchParams]);

  /* ── Filter deals ── */
  const LEGACY_TO_ISO = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };
  const filteredDeals = useMemo(() => {
    return supplierDeals.filter((p) => {
      if (filters.priceMin !== "" && p.price < Number(filters.priceMin)) return false;
      if (filters.priceMax !== "" && p.price > Number(filters.priceMax)) return false;
      if (filters.category && !(p.categories || []).includes(filters.category)) return false;
      const dealCountryISO = p.stockLocationCode || LEGACY_TO_ISO[p.country] || p.country?.toLowerCase();
      if (filters.countries.length > 0 && !filters.countries.includes(dealCountryISO)) return false;
      if (filters.grades.length > 0 && !filters.grades.some((g) => (p.grade || "").toLowerCase().includes(g.toLowerCase()))) return false;
      if (filters.dropshipping && !p.isDropship) return false;
      // Keyword filtering
      if (filters.keywords && filters.keywords.length > 0) {
        const searchText = `${p.name || ""} ${p.category || ""} ${p.supplier || ""}`.toLowerCase();
        for (const kw of filters.keywords) {
          const term = (typeof kw === "string" ? kw : kw.term).toLowerCase();
          if (!searchText.includes(term)) return false;
        }
      }
      return true;
    });
  }, [filters, supplierDeals]);

  const totalDeals = filteredDeals.length;
  const computedMaxPrice = Math.ceil(Math.max(...supplierDeals.map((p) => p.price)) / 10) * 10;

  /* ── Breadcrumbs ── */
  const breadcrumbs = [
    { label: "WholesaleUp", href: "/" },
    { label: "Suppliers", href: "/suppliers" },
    { label: displayName, href: `/supplier${supplier.slug ? `/${supplier.slug}` : ""}` },
    { label: "All Deals" },
  ];

  /* ── Page title (sr-only) ── */
  const pageTitle = `${displayName} — All Deals`;

  /* ── Shared sidebar props ── */
  const sidebarProps = {
    filters,
    setFilters,
    supplier,
    deals: supplierDeals,
    maxPrice: computedMaxPrice,
    displayName,
    canViewName,
    canViewContacts,
    canViewBranding,
    isLoggedIn,
    isPremium,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* SEO h1 */}
        <h1 className="sr-only">{pageTitle}</h1>

        {/* Layout: Filter Sidebar + Content */}
        <div className="flex gap-6 items-start">
          {/* Left column — Supplier Contact Panel + Filters */}
          <CollapsibleFilterPanel collapsed={filterCollapsed} onToggle={toggleFilterCollapsed}>
            <SupplierDealsFilterSidebar
              {...sidebarProps}
              isOpen={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
            />
          </CollapsibleFilterPanel>

          {/* Right column — Deals */}
          <div className="flex-1 min-w-0">
            {/* Full Toolbar */}
            <SupplierDealsToolbar
              displayName={displayName}
              totalCount={totalDeals}
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              inlineSearch={inlineSearch}
              setInlineSearch={setInlineSearch}
              onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Supplier's Top Deals Panel */}
            <div className="mt-6">
              <SupplierTopDealsPanel deals={supplierDeals} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
            </div>

            {/* Deals Grid */}
            <div className="mb-8">
              {filteredDeals.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={48} className="text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 mb-2">No deals found</h3>
                  <p className="text-sm text-slate-500 mb-4">Try adjusting your filters to see more results.</p>
                  <button
                    onClick={() => setFilters((prev) => ({
                      ...prev,
                      category: null,
                      priceMin: "",
                      priceMax: "",
                      countries: [],
                      dropshipping: false,
                      grades: [],
                      keywords: [],
                    }))}
                    className="px-4 py-2 text-sm font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === "list" ? (
                <div className="space-y-3">
                  {filteredDeals.slice((page - 1) * perPage, page * perPage).map((p) => (
                    <ListDealCard
                      key={p.id}
                      product={p}
                      isPremium={isPremium}
                      isLoggedIn={isLoggedIn}
                      canViewSupplier={canViewSupplier}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
                  {filteredDeals.slice((page - 1) * perPage, page * perPage).map((p) => (
                    <DetailedDealCard
                      key={p.id}
                      product={p}
                      isPremium={isPremium}
                      isLoggedIn={isLoggedIn}
                      canViewSupplier={canViewSupplier}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredDeals.length > 0 && (
              <Pagination
                total={totalDeals}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                buildPageHref={buildPageHref}
              />
            )}

            {/* CTA Banner */}
            <div className="mt-8">
              <CtaBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
      )}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm transition-transform duration-300 ${mobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <SupplierDealsFilterSidebar
          {...sidebarProps}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />
      </div>

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
