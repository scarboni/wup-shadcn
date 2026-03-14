"use client";

import { useState } from "react";
import { Clock, CheckCircle2, Building2, Package, Wrench, Award, MessageSquare, Rocket, Lock, Store, Tag, Linkedin, ChevronDown, MapPin, Phone, ExternalLink, Globe, MessageCircle, Languages, Monitor, Mail, AtSign, User, CreditCard, Truck, ShieldCheck, FileText, Percent, Crown } from "lucide-react";
import VerifiedBadge from "@/components/shared/verified-badge";
import SupplierMetaStats from "@/components/shared/supplier-meta-stats";
import WebsiteLink from "@/components/shared/website-link";
import { LockedLogoPlaceholder } from "@/components/shared/logo";
import ContactSupplierModal from "@/components/shared/contact-modal";
import { FlagImg } from "./utils";

/* ═══════════════════════════════════════════════════
   LANGUAGE PILL COLORS & FLAGS — color-coded for quick scanning
   ═══════════════════════════════════════════════════
   Grouping logic: languages are colored by geographic/linguistic family
   so users can quickly scan which regions a supplier covers.
   Each pill shows a representative country flag to aid recognition.
   - Blue family: Germanic (English, German, Dutch, Swedish, Danish, Norwegian)
   - Violet family: Romance (French, Spanish, Italian, Portuguese)
   - Emerald family: Slavic (Polish, Russian)
   - Amber: Greek (Hellenic)
   - Rose: Arabic (Semitic)
   - Sky/Cyan/Teal: East Asian (Chinese, Japanese, Korean)
   - Slate: fallback for unlisted languages
   PRODUCTION: Keep in sync with LANGUAGES array in form-fields.jsx
   and languages field in account-profile.jsx (Main Contact & Business tab). */
const LANGUAGE_COLORS = {
  English:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  German:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  Dutch:      { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  Swedish:    { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  Danish:     { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  Norwegian:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  French:     { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  Spanish:    { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  Italian:    { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  Portuguese: { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  Polish:     { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Russian:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Greek:      { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  Arabic:     { bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200" },
  Chinese:    { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200" },
  Japanese:   { bg: "bg-cyan-50",    text: "text-cyan-700",    border: "border-cyan-200" },
  Korean:     { bg: "bg-teal-50",    text: "text-teal-700",    border: "border-teal-200" },
  _default:   { bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200" },
};

/* Representative country flag per language — uses the most widely associated country.
   PRODUCTION: Keep in sync with LANGUAGES array in form-fields.jsx. */
const LANGUAGE_FLAGS = {
  English:    "GB",
  German:     "DE",
  Dutch:      "NL",
  Swedish:    "SE",
  Danish:     "DK",
  Norwegian:  "NO",
  French:     "FR",
  Spanish:    "ES",
  Italian:    "IT",
  Portuguese: "PT",
  Polish:     "PL",
  Russian:    "RU",
  Greek:      "GR",
  Arabic:     "SA",
  Chinese:    "CN",
  Japanese:   "JP",
  Korean:     "KR",
};

/* ═══════════════════════════════════════════════════
   OPENING HOURS WIDGET — interactive day picker
   ═══════════════════════════════════════════════════
   PRODUCTION: businessHours is inherited from Supplier Profile form
   (supplier-profile-form.jsx → "Business Hours" field, Reach & Operations tab).
   Data structure uses the same schema as DEFAULT_BUSINESS_HOURS in form-fields.jsx:
   {
     monday:    { status: "open"|"closed"|"unset", slots: [{ open: "09:00", close: "17:00" }] },
     tuesday:   { ... },
     ...
     holidays:  "string"
   }
   API: GET /api/suppliers/[id] should include businessHours from supplier_profiles table.
   ═══════════════════════════════════════════════════ */

/* Display Mon→Sun (UK/EU convention); lookup by JS getDay() index kept separate */
const DAYS_DISPLAY = [
  { key: "monday", short: "Mon" },
  { key: "tuesday", short: "Tue" },
  { key: "wednesday", short: "Wed" },
  { key: "thursday", short: "Thu" },
  { key: "friday", short: "Fri" },
  { key: "saturday", short: "Sat" },
  { key: "sunday", short: "Sun" },
];
/* JS getDay() → 0=Sun, 1=Mon … 6=Sat — maps index to day key */
const DAY_BY_JS_INDEX = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/* Format a day's slots into a readable string, e.g. "08:00 – 16:00" */
function formatDayHours(dayData) {
  if (!dayData || dayData.status !== "open") return null;
  const slots = dayData.slots?.filter((s) => s.open && s.close);
  if (!slots || slots.length === 0) return null;
  return slots.map((s) => `${s.open} – ${s.close}`).join(", ");
}

/* Determine if supplier is currently open */
function getIsCurrentlyOpen(bh, currentTime) {
  if (!bh || !currentTime) return false;
  const todayKey = DAY_BY_JS_INDEX[new Date().getDay()];
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

/* ── Collapsible section wrapper ── */
function CollapsibleSection({ title, icon: Icon, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          {Icon && <Icon size={12} className="text-slate-400" />}
          {title}
          {badge}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pt-1 pb-4">{children}</div>}
    </div>
  );
}

/* ── Opening hours inline widget (inside collapsible) ── */
function OpeningHoursExpanded({ supplier }) {
  const todayKey = DAY_BY_JS_INDEX[new Date().getDay()];
  const todayDisplayIndex = DAYS_DISPLAY.findIndex((d) => d.key === todayKey);
  const [hoveredDay, setHoveredDay] = useState(null);
  const bh = supplier.businessHours;

  const hasAnyHours = bh && DAYS_DISPLAY.some((d) => bh[d.key]?.status === "open" || bh[d.key]?.status === "closed");
  if (!hasAnyHours) return null;

  const isCurrentlyOpen = getIsCurrentlyOpen(bh, supplier.currentTime);
  const activeIndex = hoveredDay !== null ? hoveredDay : todayDisplayIndex;
  const activeDay = DAYS_DISPLAY[activeIndex];
  const activeDayData = bh[activeDay.key];
  const activeHoursText = activeDayData?.status === "open" ? (formatDayHours(activeDayData) || "Open") : activeDayData?.status === "closed" ? "Closed" : "—";
  const isClosed = activeDayData?.status !== "open";

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {DAYS_DISPLAY.map((day, i) => (
          <span
            key={day.key}
            onMouseEnter={() => setHoveredDay(i)}
            onMouseLeave={() => setHoveredDay(null)}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md cursor-pointer transition-colors ${
              i === activeIndex
                ? "bg-orange-100 text-orange-600"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
            }`}
          >
            {day.short}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-slate-400">{activeDay.short}</span>
        <span className={`font-bold ${isClosed ? "text-red-400" : "text-slate-700"}`}>{activeHoursText}</span>
      </div>
      {supplier.currentTime && (
        <p className="text-xs text-slate-400 text-center mt-1.5">
          Supplier&apos;s local time: <span className="font-bold text-slate-600">{supplier.currentTime}</span>
        </p>
      )}
      {bh.holidays && (
        <p className="text-xs text-slate-400 text-center mt-1 italic">{bh.holidays}</p>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   SUPPLIER SIDEBAR CARD — right column supplier info

   Restructured into 5 logical groups:
   A. Identity + Primary CTA (above the fold)
   B. Trust & Credentials (certifications, supply models, quality)
   C. Business Profile (collapsible: buyer types, staff, facility, customization)
   D. Contact & Location (gated, combined into one section)
   E. Terms & Availability (collapsible: payment, returns, hours)
   ═══════════════════════════════════════════════════ */
export default function SupplierSidebarCard({ supplier, deal = {}, isPremium, isLoggedIn, canViewSupplier, hideViewProfile = false, hideTerms = false, isSoldOut = false }) {
  const CERT_LABELS = { ce: "CE", ukca: "UKCA", fda: "FDA", rohs: "RoHS", reach: "REACH", "iso-9001": "ISO 9001", "iso-14001": "ISO 14001", gmp: "GMP", brc: "BRC", haccp: "HACCP", organic: "Organic", "fair-trade": "Fair Trade", "rainforest-alliance": "RA", fsc: "FSC", "oeko-tex": "OEKO-TEX", gots: "GOTS", halal: "Halal", kosher: "Kosher", bsci: "BSCI", "b-corp": "B Corp" };
  const SUPPLY_MODEL_LABELS = { wholesale: "Wholesale", dropshipping: "Dropshipping", liquidation: "Liquidation", "white-label": "White Label", "private-label": "Private Label", "job-lots": "Job Lots" };
  const QUALITY_LABELS = { budget: "Budget", "mid-range": "Mid-Range", premium: "Premium", luxury: "Luxury" };
  const CATALOGUE_LABELS = { "under-50": "<50 SKUs", "50-200": "50–200 SKUs", "200-1000": "200–1K SKUs", "1000-5000": "1K–5K SKUs", "5000-20000": "5K–20K SKUs", "20000-plus": "20K+ SKUs" };
  const SUPPLIER_TYPE_LABELS = { manufacturer: "Manufacturer", "brand-owner": "Brand Owner", "private-label": "Private / White Label", wholesaler: "Wholesaler", distributor: "Distributor", importer: "Importer", exporter: "Exporter", "trading-company": "Trading Company", liquidator: "Liquidator / Clearance", dropshipper: "Dropshipper", "sourcing-agent": "Sourcing Agent", "artisan-maker": "Artisan / Maker" };
  const BUYER_TYPE_LABELS = { "online-retailer": "Online Retailers", "shop-retailer": "Shop / High Street", "multi-chain": "Multi-Chain Retailers", "marketplace-seller": "Marketplace Sellers", dropshipper: "Dropshippers", "market-trader": "Market Traders", "wholesaler-reseller": "Wholesalers / Resellers", distributor: "Distributors", supermarket: "Supermarket / Grocery", hospitality: "Hospitality / HoReCa", "corporate-buyer": "Corporate / Procurement", franchisee: "Franchisees", "charity-nonprofit": "Charities / Non-Profits", government: "Government", "subscription-box": "Subscription Boxes", "social-commerce": "Social Commerce", "mail-order": "Mail Order", other: "Other" };
  const CUSTOMER_TYPE_LABELS = { "registered-companies": "Registered Companies", "sole-traders": "Sole Traders", individuals: "Individuals" };
  const CUSTOMIZATION_LABELS = { "minor-customization": "Minor customization", "drawing-based": "Drawing-based", "sample-based": "Sample-based", "full-customization": "Full customization", "print-on-demand": "Print-on-demand", "custom-packaging": "Custom packaging", "custom-labeling": "Custom labeling", "private-labeling": "Private labeling", "private-label-formulation": "Private label formulation", "logo-printing": "Logo printing", "custom-firmware": "Custom firmware" };
  const CURRENCY_LABELS = { GBP: "GBP (£)", USD: "USD ($)", EUR: "EUR (€)", CAD: "CAD (C$)", AUD: "AUD (A$)" };
  const PAYMENT_METHOD_LABELS = { "bank-transfer": "Bank Transfer", "credit-debit-card": "Credit / Debit Card", "trade-credit": "Trade Credit", paypal: "PayPal", "cash-on-delivery": "Cash on Delivery", bnpl: "Buy Now, Pay Later", "letter-of-credit": "Letter of Credit", escrow: "Escrow" };
  const DELIVERY_METHOD_LABELS = { dhl: "DHL", fedex: "FedEx", ups: "UPS", usps: "USPS", tnt: "TNT", aramex: "Aramex", dpd: "DPD", "national-post": "National Post", "pallet-delivery": "Pallet Delivery", "own-fleet": "Own Fleet", freight: "Freight / Sea", "click-collect": "Click & Collect", collection: "Collection Only" };
  const LEAD_TIME_LABELS = { "same-day": "Same Day", "1-2-days": "1–2 Days", "3-5-days": "3–5 Days", "1-2-weeks": "1–2 Weeks", "2-4-weeks": "2–4 Weeks", "4-8-weeks": "4–8 Weeks", "8-plus-weeks": "8+ Weeks", "made-to-order": "Made to Order" };
  const INCOTERMS_LABELS = { EXW: "EXW (Ex Works)", FOB: "FOB (Free on Board)", CIF: "CIF (Cost, Insurance, Freight)", DDP: "DDP (Delivered Duty Paid)", DAP: "DAP (Delivered at Place)", FCA: "FCA (Free Carrier)" };
  const INVOICE_TYPE_LABELS = { vat: "VAT Invoice", proforma: "Proforma Invoice", commercial: "Commercial Invoice", "eu-community": "EU Community Invoice" };
  const TAX_CLASS_LABELS = { standard: "Standard Rate", reduced: "Reduced Rate", "zero-rated": "Zero Rated", exempt: "VAT Exempt" };
  const SAMPLE_LABELS = { free: "Free Samples", paid: "Paid Samples", "on-request": "On Request", "not-available": "Not Available" };
  const SANITIZED_LABELS = { available: "Available", "on-request": "On Request", "not-available": "Not Available" };

  const [contactOpen, setContactOpen] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

  /* ── Visibility gates ── */

  /* ── Enquiry access — context-dependent ──
     This sidebar is shared between /deal and /supplier pages with DIFFERENT rules:
     /deal page (deal prop present):  Standard CAN enquire about ALL deals → uses canViewSupplier
     /supplier page (no deal prop):   Standard CANNOT contact Supplier Free → uses isPremium
     canViewSupplier = Standard, Premium, Premium+, Supplier Pro.
     isPremium = Premium, Premium+, Supplier Pro (excludes Standard). */
  const isDealPage = deal && Object.keys(deal).length > 0;
  const canEnquireDeal = isLoggedIn && (supplier.isSupplierPro || (isDealPage ? canViewSupplier : isPremium));

  /* ── Contact details visibility (phone numbers, address, business card) ──
     Supplier Pro listings → ALL logged-in users see contacts.
     Supplier Free listings → only Premium, Premium+, Supplier Pro (isPremium).
     Standard CANNOT see Supplier Free phone numbers (but CAN send enquiries via modal). */
  const canViewContacts = isLoggedIn && (supplier.isSupplierPro || isPremium);

  /* ── Logo & social links visibility ── same gate as contacts (Standard excluded for Supplier Free) */
  const canViewBranding = isLoggedIn && (supplier.isSupplierPro || isPremium);
  const hasSocialLinks = !!supplier.contact?.linkedinUrl;

  /* ── Supplier name visibility ── same gate as contacts/branding.
     Guest: ALWAYS anonymous.
     Supplier Pro listings: real name for ALL logged-in users (Free, Standard, Premium, etc.).
     Supplier Free listings: real name only for Premium, Premium+, Supplier Pro (isPremium).
     Standard CANNOT see Supplier Free names, contacts, or branding. */
  const canViewName = isLoggedIn && (supplier.isSupplierPro || isPremium);
  const anonymousName = (() => {
    const rawCat = supplier.productCategories?.[0] || deal.category || "Wholesale";
    // Convert slugs like "mobile-phones" → "Mobile Phones"
    const firstCat = rawCat.includes("-") ? rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : rawCat;
    const categoryStem = firstCat.replace(/\s+Supplier$/i, "");
    const types = supplier.supplierType || [];
    const typesLabel = types.length > 0
      ? types.map((st) => SUPPLIER_TYPE_LABELS[st] || st).join(" & ")
      : "Supplier";
    return `${categoryStem} ${typesLabel}`;
  })();

  const displayName = canViewName ? supplier.companyName : anonymousName;

  /* Opening hours — compute "open now" status for the header badge */
  const bh = supplier.businessHours;
  const hasAnyHours = bh && DAYS_DISPLAY.some((d) => bh[d.key]?.status === "open" || bh[d.key]?.status === "closed");
  const isCurrentlyOpen = hasAnyHours ? getIsCurrentlyOpen(bh, supplier.currentTime) : false;

  /* Resolve fields that may live on `deal` (deal page) OR `supplier` (supplier profile page).
     On the /supplier page no deal prop is passed, so fall back to the supplier object. */
  const supplyModels = deal.supplyModels || supplier.supplyModels || [];
  const productQualityTier = deal.productQualityTier || supplier.productQualityTier || [];
  const catalogueSize = deal.catalogueSize || supplier.catalogueSize;
  const certifications = deal.certifications || supplier.certifications || [];

  /* Conditional data checks */
  const hasCerts = certifications.length > 0;
  const hasSupplyModels = supplyModels.length > 0;
  const hasQualityTier = productQualityTier.length > 0;
  const hasSupplierType = supplier.supplierType && supplier.supplierType.length > 0;
  const hasBuyerTypes = supplier.buyerTypesServed && supplier.buyerTypesServed.length > 0;
  const hasCustomersServed = supplier.customersServed && supplier.customersServed.length > 0;
  const hasCustomization = supplier.customizationAbility && supplier.customizationAbility.length > 0;
  /* Show Group B if there's anything to display */
  /* Group B now only contains certifications — supplier type/quality moved to header,
     supply models/catalogue moved above CTA in Group A */
  /* Show Group C if there's anything to display */
  const showGroupC = hasBuyerTypes || hasCustomersServed || hasCustomization;

  /* Avatar presence — controls contact-row indentation in the business card.
     PRODUCTION: true when account_profiles.avatarUrl exists OR contact.name can produce initials.
     When true, contact rows align with the name (offset by avatar width + gap).
     When false (no avatar at all), rows use standard padding. */
  const hasAvatar = !!(supplier.contact?.avatarUrl || supplier.contact?.name);

  return (
    <div className={`relative bg-white rounded-xl overflow-hidden shadow-lg ${
      supplier.isSupplierPro
        ? "border-r-[3px] border-r-[#1e5299] border border-[#1e5299]/30"
        : "border border-slate-200"
    }`}>

      {/* Supplier Pro badge — top right */}
      {supplier.isSupplierPro && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-[#1e5299] text-white text-[10px] font-bold rounded-md shadow-sm">
          <Crown size={10} className="shrink-0" />
          PRO
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          GROUP A — Identity + Primary CTA (above the fold)
          ═══════════════════════════════════════════════ */}
      <div className="border-b border-slate-100">
        <div className="p-5">
        {/* PRODUCTION: companyLogo is inherited from Supplier Profile form
            (supplier-profile-form.jsx → "Company Logo" field, Reach & Operations tab).
            API: GET /api/suppliers/[id] should include companyLogo URL from supplier_profiles table. */}
        <div className={supplier.companyLogo ? "flex items-start gap-3" : ""}>
          {supplier.companyLogo && canViewBranding && (
            <img src={supplier.companyLogo} alt={`${displayName} logo`} className="h-11 w-11 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0" />
          )}
          {supplier.companyLogo && !canViewBranding && (
            <LockedLogoPlaceholder size="md" href="/register" title="Register to see supplier branding" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {supplier.isVerified && <VerifiedBadge />}
              {/* Open/Closed badge — compact indicator in header */}
              {hasAnyHours && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isCurrentlyOpen ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                  {isCurrentlyOpen ? "Open" : "Closed"}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900">
              <a href={`/supplier${supplier.slug ? `/${supplier.slug}` : ""}`} className="hover:text-orange-600 transition-colors">
                {displayName}
              </a>
            </h3>

            {/* Supplier type + quality tier — identity pills below name */}
            {(hasSupplierType || hasQualityTier) && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {/* PRODUCTION: supplierType inherited from Supplier Profile form
                    (supplier-profile-form.jsx → "Supplier Type" field, multi-select).
                    API: GET /api/suppliers/[id] should include supplierType from supplier_profiles table. */}
                {hasSupplierType && supplier.supplierType.map((st) => (
                  <span key={st} className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                    {SUPPLIER_TYPE_LABELS[st] || st}
                  </span>
                ))}
                {hasQualityTier && productQualityTier.map((qt) => (
                  <span key={qt} className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
                    {QUALITY_LABELS[qt] || qt}
                  </span>
                ))}
              </div>
            )}

            <SupplierMetaStats supplier={supplier} size="sm" className="mt-1" />
          </div>
        </div>

        {/* Performance metrics — commented out, revisit when data is production-ready
        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {supplier.onTimeDeliveryRate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5">
              <CheckCircle2 size={10} /> {supplier.onTimeDeliveryRate}% on-time
            </span>
          )}
          {supplier.responseTime && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Clock size={10} /> Responds {supplier.responseTime}
            </span>
          )}
        </div>
        */}

        {/* Supply models + catalogue size — pill row */}
        {(hasSupplyModels || catalogueSize) && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {hasSupplyModels && supplyModels.map((sm) => (
              <span key={sm} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                {SUPPLY_MODEL_LABELS[sm] || sm}
              </span>
            ))}
            {catalogueSize && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                <Package size={10} className="text-slate-400 shrink-0" />
                {CATALOGUE_LABELS[catalogueSize] || catalogueSize}
              </span>
            )}
          </div>
        )}

        {/* Primary CTA — above the fold */}
        <div className="mt-4">
          {/* Deal page enquiry: Standard+ can enquire ALL deals; Free only Supplier Pro.
              Separate from canViewContacts which gates phone/address visibility. */}
          {canEnquireDeal ? (
            <button onClick={() => setContactOpen(true)} className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-[#1e5299] hover:bg-[#174280] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
              <MessageSquare size={14} /> {isSoldOut ? "Ask About Similar" : "Send Enquiry"}
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
              <Rocket size={14} /> Upgrade to Contact
            </a>
          ) : (
            <button onClick={openRegisterModal} className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
              <Lock size={14} /> Join to Contact
            </button>
          )}
        </div>

        {/* View Profile / View All Deals — secondary actions */}
        <div className="flex gap-2 mt-2">
          {!hideViewProfile && (
            <a href="/supplier" className="flex-1 py-2 rounded-lg text-xs font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-1.5">
              <Store size={13} /> View Profile
            </a>
          )}
          <a href="/supplier-deals" className="flex-1 py-2 rounded-lg text-xs font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-1.5">
            <Tag size={13} /> View All Deals
          </a>
        </div>
        </div>{/* end p-5 inner */}
      </div>{/* end identity header */}

      {/* ═══════════════════════════════════════════════
          Capabilities (collapsible)
          Sells to / does not sell to, buyer types, customization, certifications
          ═══════════════════════════════════════════════ */}
      {(showGroupC || hasCerts || supplier.preferredCurrency) && (
        <CollapsibleSection title="Capabilities" icon={Building2} defaultOpen={false}>
          <div className="space-y-4">
            {/* PRODUCTION: customersServed + buyerTypesServed inherited from Supplier Profile form.
                customersServed = entity eligibility gate (who CAN buy: registered companies, sole traders, individuals).
                buyerTypesServed = target audience within that gate (who they TYPICALLY serve: online retailers, etc.). */}
            {hasCustomersServed && (() => {
              const allTypes = ["registered-companies", "sole-traders", "individuals"];
              const served = new Set(supplier.customersServed);
              const notServed = allTypes.filter((t) => !served.has(t));
              return (
                <>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Sells to</p>
                    <div className="flex flex-wrap gap-1.5">
                      {supplier.customersServed.map((ct) => (
                        <span key={ct} className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                          {CUSTOMER_TYPE_LABELS[ct] || ct}
                        </span>
                      ))}
                    </div>
                    {hasBuyerTypes && (
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed border-l-2 border-slate-200 pl-2.5">
                        {supplier.buyerTypesServed.map((bt, i) => (
                          <span key={bt}>
                            {i > 0 && <span className="text-slate-400"> · </span>}
                            {BUYER_TYPE_LABELS[bt] || bt}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  {notServed.length > 0 && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Does not sell to</p>
                      <div className="flex flex-wrap gap-1.5">
                        {notServed.map((ct) => (
                          <span key={ct} className="px-2 py-0.5 text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-md line-through decoration-red-300">
                            {CUSTOMER_TYPE_LABELS[ct] || ct}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {!hasCustomersServed && hasBuyerTypes && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Sells to</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {supplier.buyerTypesServed.map((bt, i) => (
                    <span key={bt}>
                      {i > 0 && <span className="text-slate-400"> · </span>}
                      {BUYER_TYPE_LABELS[bt] || bt}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Preferred trading currency — from Supplier Profile form (Orders & Payments tab) */}
            {supplier.preferredCurrency && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Preferred Trading Currency</p>
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                  {CURRENCY_LABELS[supplier.preferredCurrency] || supplier.preferredCurrency}
                </span>
              </div>
            )}

            {hasCustomization && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Customization</p>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.customizationAbility.map((ca) => (
                    <span key={ca} className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                      {CUSTOMIZATION_LABELS[ca] || ca}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasCerts && (
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Certifications</p>
                <div className="flex flex-wrap gap-1.5">
                  {certifications.map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded">
                      <Award size={9} /> {CERT_LABELS[cert] || cert.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* ═══════════════════════════════════════════════
          GROUP D — Address & Contact (gated)
          1. Company Address with Visit Website right-aligned
          2. Main Contact business card (avatar + name + languages + contact methods + CTA)
          ═══════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════
          GROUP D — Address & Contact (gated)
          When !canViewContacts, shows PLACEHOLDER data (not real) behind the blur
          so the real contact info is never in the DOM for scraping.
          This matches the pattern used in product-tabs.jsx review/attachments tabs.
          ═══════════════════════════════════════════════ */}
      {canViewContacts ? (
        <div className="px-5 py-3 border-b border-slate-100 space-y-4">

          {/* ── 1. COMPANY ADDRESS with Visit Website ──
              PRODUCTION: address fields from Account Profile (account_profiles table):
              street = addressLine1, addressLine2 (optional), postalCode = postcode,
              city, country, countryCode (derived from country).
              companyWebsite from Supplier Profile form (Reach & Operations tab). */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <MapPin size={12} className="text-slate-400" />
              Company Address
            </p>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold">{supplier.address.street}{supplier.address.addressLine2 ? `, ${supplier.address.addressLine2}` : ""}, {supplier.address.postalCode}</span>
                <br />
                <span className="text-slate-500">{supplier.address.city}, </span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <FlagImg code={supplier.address.countryCode} size={13} /> {supplier.address.country}
                </span>
              </div>
              {supplier.companyWebsite && (
                <WebsiteLink
                  slug={supplier.slug}
                  url={supplier.companyWebsite}
                  dealSlug={deal?.slug}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors shrink-0 mt-0.5"
                >
                  <Globe size={11} /> Website <ExternalLink size={9} />
                </WebsiteLink>
              )}
            </div>
          </div>

          {/* ── 2. MAIN CONTACT — business card ──
              PRODUCTION: All fields from account_profiles table.
              Email addresses (businessEmail, personalEmail) are intentionally hidden
              to prevent scraping — contact is via the platform messaging system.
              FUTURE: /dashboard/other-contacts will support multiple contacts per company. */}
          <div className="pt-3 border-t border-slate-100">
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Card header — avatar + identity + languages
                  Uses a light blue tone lighter than the Contact Now button (blue-500)
                  so the card header doesn't overpower the CTA. */}
              <div className="px-4 py-3.5 bg-gradient-to-r from-blue-100 to-blue-50">
                <div className="flex items-start gap-3">
                  {/* Avatar — initials circle
                      PRODUCTION: Replace with account_profiles.avatarUrl if available.
                      Fallback to initials derived from firstName + lastName. */}
                  <div className="w-10 h-10 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-white">
                      {supplier.contact.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-slate-800 leading-tight">{supplier.salutation ? `${supplier.salutation} ` : ""}{supplier.contact.name}</p>
                    {supplier.contact.roleInCompany && (
                      <p className="text-sm text-slate-600 mt-0.5 leading-snug">{supplier.contact.roleInCompany}</p>
                    )}
                    {/* Languages — directly under name since they relate to the person.
                        Each pill shows a representative country flag + language name. */}
                    {supplier.languages && supplier.languages.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mt-1.5">
                        {supplier.languages.map((lang) => {
                          const lc = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS._default;
                          const flagCode = LANGUAGE_FLAGS[lang];
                          return (
                            <span key={lang} className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded border ${lc.bg} ${lc.text} ${lc.border}`}>
                              {flagCode && <FlagImg code={flagCode} size={10} />}
                              {lang}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card body — contact methods (no email — use platform messaging)
                  When avatar is present, left-pad to align with name text:
                  avatar w-10 (40px) + gap-3 (12px) + header px-4 (16px) = 68px left edge.
                  Card body uses the same 68px left padding so rows line up. */}
              <div className={`pr-4 pt-3 pb-2 space-y-2 bg-slate-50 ${hasAvatar ? "pl-[68px]" : "pl-4"}`}>
                {supplier.contact.mobileNumber && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{supplier.contact.mobileNumber} <span className="text-slate-400 text-[10px]">(mobile)</span></span>
                  </div>
                )}
                {supplier.contact.landlineNumber && (
                  <div className="flex items-center gap-2.5">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{supplier.contact.landlineNumber} <span className="text-slate-400 text-[10px]">(landline)</span></span>
                  </div>
                )}
                {supplier.contact.whatsappNumber && (
                  <div className="flex items-center gap-2.5">
                    <MessageCircle size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700">{supplier.contact.whatsappNumber} <span className="text-slate-400 text-[10px]">(WhatsApp)</span></span>
                  </div>
                )}
                {supplier.contact.teamsHandle && (
                  <div className="flex items-center gap-2.5">
                    <AtSign size={13} className="text-indigo-500 shrink-0" />
                    <span className="text-sm text-slate-700">{supplier.contact.teamsHandle} <span className="text-slate-400 text-[10px]">(Teams)</span></span>
                  </div>
                )}
                {supplier.contact?.linkedinUrl && (
                  <div className="flex items-center gap-2.5">
                    <Linkedin size={13} className="text-blue-500 shrink-0" />
                    {/* PRODUCTION: Replace url= with slug= to avoid exposing the raw URL.
                        Social links use type=social and are NOT subject to the 500/mo limit. */}
                    <a
                      href={`/go?url=${encodeURIComponent(supplier.contact.linkedinUrl)}${deal?.slug ? `&deal=${encodeURIComponent(deal.slug)}` : ""}&type=social`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>

              {/* Card footer — Contact Now CTA (opens supplier contact modal)
                  PRODUCTION: onClick should open the contact/enquiry modal,
                  same as the "Send Enquiry" button in Group A. */}
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/80">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="w-full py-2 rounded-lg text-xs font-bold text-white bg-[#1e5299] hover:bg-[#174280] shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={12} /> {isSoldOut ? "Ask About Similar" : "Contact Now"}
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ── GATED STATE — Clean lock card, no placeholder data in DOM ── */
        <div className="px-5 py-6 border-b border-slate-100">
          <div className="rounded-lg bg-slate-50 py-6 text-center">
            <Lock size={20} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 mb-3.5 px-4 leading-relaxed">
              {isLoggedIn
                ? "Contact details available to Premium members"
                : "Contact details available to registered members"}
            </p>
            {isLoggedIn ? (
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
              >
                <Rocket size={13} /> Upgrade Now
              </a>
            ) : (
              <button
                onClick={openRegisterModal}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
              >
                <Lock size={13} /> Log In / Register
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          GROUP E — Opening Hours (collapsible)
          Payment methods & return policy moved to Payment & Terms tab in product-tabs.jsx
          ═══════════════════════════════════════════════ */}
      {hasAnyHours && (
        <CollapsibleSection
          title="Opening Hours"
          icon={Clock}
          defaultOpen={false}
          badge={
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold normal-case tracking-normal ${
              isCurrentlyOpen ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
              {isCurrentlyOpen ? "Open" : "Closed"}
            </span>
          }
        >
          <OpeningHoursExpanded supplier={supplier} />
        </CollapsibleSection>
      )}

      {/* ═══════════════════════════════════════════════
          GROUP F — Terms & Commercial (collapsible)
          Payment, delivery, shipping reach, returns, invoicing.
          Data sourced from Supplier Profile form tabs 3 (Orders & Payments)
          and 4 (Shipping & Reach). Falls back to supplier-level defaults.
          Hidden on /supplier page where this data lives in the About panel tabs.
          ═══════════════════════════════════════════════ */}
      {!hideTerms && (() => {
        /* Merge: deal-level overrides → supplier-level defaults */
        const paymentMethods = deal.supplierPaymentMethods || supplier.paymentMethods;
        const deliveryMethods = deal.deliveryMethods || supplier.deliveryMethods;
        const leadTime = deal.leadTime || supplier.leadTime;
        const incoterms = deal.incoterms || supplier.defaultIncoterms;
        const invoiceType = deal.invoiceType || supplier.defaultInvoiceType;
        const taxClass = deal.taxClass || supplier.defaultTaxClass;
        const sanitized = deal.sanitizedInvoice || supplier.sanitizedInvoice;
        const returnPolicy = deal.returnPolicy || supplier.returnPolicy;
        const depositPct = deal.depositRequired?.percentage ?? supplier.defaultDepositPercentage;
        const depositTerms = deal.depositRequired?.terms || supplier.defaultDepositTerms;
        const paymentTerms = deal.netPaymentTerms || supplier.paymentTerms;
        const minOrder = deal.minimumOrderAmount || supplier.minimumOrderAmount;
        const minCurrency = deal.minimumOrderCurrency || supplier.minimumOrderCurrency;
        const rawCountries = deal.shippingCountries || supplier.countriesServed;
        const countriesServed = typeof rawCountries === "string" ? rawCountries.split(",").map((s) => s.trim()).filter(Boolean) : rawCountries;
        const rawExcluded = deal.countryRestrictions || supplier.excludedCountries;
        const excludedCountries = typeof rawExcluded === "string" ? rawExcluded.split(",").map((s) => s.trim()).filter(Boolean) : rawExcluded;
        const sampleAvailability = deal.sampleAvailability || supplier.sampleAvailability;
        const discountTiers = deal.discountTiers || supplier.discountTiers;
        const discountNotes = deal.discountNotes || supplier.discountNotes;

        const hasAny = paymentMethods?.length || deliveryMethods?.length || leadTime || incoterms || invoiceType || taxClass || sanitized || returnPolicy || depositPct != null || paymentTerms || minOrder || countriesServed?.length || sampleAvailability || discountTiers?.length;
        if (!hasAny) return null;

        return (
          <CollapsibleSection title="Terms & Commercial" icon={CreditCard} defaultOpen={false}>
            <div className="space-y-3">

              {/* Minimum Order */}
              {minOrder && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Minimum Order</p>
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                    {CURRENCY_LABELS[minCurrency]?.split(" ")[0] || minCurrency || ""} {minOrder?.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Payment Methods */}
              {paymentMethods && paymentMethods.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Payment Methods</p>
                  <div className="flex flex-wrap gap-1.5">
                    {paymentMethods.map((pm) => (
                      <span key={pm} className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        {PAYMENT_METHOD_LABELS[pm] || pm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Terms */}
              {paymentTerms && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Payment Terms</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{paymentTerms}</p>
                </div>
              )}

              {/* Deposit */}
              {depositPct != null && depositPct > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Deposit Required</p>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md">
                    <Percent size={10} /> {depositPct}%
                  </span>
                  {depositTerms && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{depositTerms}</p>}
                </div>
              )}

              {/* Discount Tiers */}
              {discountTiers && discountTiers.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Bulk Discounts</p>
                  <div className="space-y-1">
                    {discountTiers.map((tier, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Orders {CURRENCY_LABELS[minCurrency]?.split(" ")[0] || "€"}{tier.minOrder?.toLocaleString()}+</span>
                        <span className="font-bold text-emerald-600">{tier.discount}% off</span>
                      </div>
                    ))}
                  </div>
                  {discountNotes && <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed italic">{discountNotes}</p>}
                </div>
              )}

              {/* Invoice & Tax */}
              {(invoiceType || taxClass || sanitized) && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Invoicing</p>
                  <div className="flex flex-wrap gap-1.5">
                    {invoiceType && (
                      <span className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        {INVOICE_TYPE_LABELS[invoiceType] || invoiceType}
                      </span>
                    )}
                    {taxClass && (
                      <span className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        {TAX_CLASS_LABELS[taxClass] || taxClass}
                      </span>
                    )}
                    {sanitized && (
                      <span className="px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        Sanitized: {SANITIZED_LABELS[sanitized] || sanitized}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Methods */}
              {deliveryMethods && deliveryMethods.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Delivery Methods</p>
                  <div className="flex flex-wrap gap-1.5">
                    {deliveryMethods.map((dm) => (
                      <span key={dm} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        <Truck size={10} className="text-slate-400 shrink-0" />
                        {DELIVERY_METHOD_LABELS[dm] || dm}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lead Time & Incoterms */}
              {(leadTime || incoterms) && (
                <div className="flex flex-wrap gap-3">
                  {leadTime && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Lead Time</p>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        <Clock size={10} className="text-slate-400" />
                        {LEAD_TIME_LABELS[leadTime] || leadTime}
                      </span>
                    </div>
                  )}
                  {incoterms && (
                    <div>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Incoterms</p>
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                        {INCOTERMS_LABELS[incoterms] || incoterms}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Countries Served */}
              {countriesServed && countriesServed.length > 0 && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Ships To ({countriesServed.length} countries)</p>
                  <div className="flex flex-wrap gap-1">
                    {countriesServed.map((code) => (
                      <span key={code} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                        <FlagImg code={code} size={12} /> {code}
                      </span>
                    ))}
                  </div>
                  {excludedCountries && excludedCountries.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-medium text-red-400 uppercase tracking-wider mb-1">Does not ship to</p>
                      <div className="flex flex-wrap gap-1">
                        {excludedCountries.map((code) => (
                          <span key={code} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-red-500 bg-red-50 border border-red-100 rounded-md line-through decoration-red-300">
                            <FlagImg code={code} size={10} /> {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample Availability */}
              {sampleAvailability && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Samples</p>
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                    {SAMPLE_LABELS[sampleAvailability] || sampleAvailability}
                  </span>
                </div>
              )}

              {/* Return Policy */}
              {returnPolicy && (
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Return Policy</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{returnPolicy}</p>
                </div>
              )}

            </div>
          </CollapsibleSection>
        );
      })()}

      {/* Category tags — bottom of card, lower priority */}
      {supplier.categories && supplier.categories.length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {supplier.categories.map((cat) => (
              <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`} className="px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
                {cat}
              </a>
            ))}
            {supplier.moreCategories > 0 && (
              <span className="px-2.5 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
                +{supplier.moreCategories}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contact Supplier Modal — shared by primary CTA + business card Contact Now */}
      {contactOpen && (
        <ContactSupplierModal
          name={supplier.companyName || "Supplier"}
          product={deal}
          subjectDefault={isSoldOut ? `Enquiry about similar products to: ${deal.title || "this deal"}` : `Enquiry about: ${deal.title || "this deal"}`}
          onClose={() => setContactOpen(false)}
        />
      )}
    </div>
  );
}
