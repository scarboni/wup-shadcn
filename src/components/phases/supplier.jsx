"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  EyeOff,
  Eye,
  ArrowRight,
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
  Star,
  ImageOff,
  Truck,
  Rocket,
  CreditCard,
  Percent,
  ShieldCheck,
  FileText,
  Landmark,
  Wallet,
  CalendarClock,
  Handshake,
  Banknote,
  FileCheck,
  Ban,
  Crown,
} from "lucide-react";
import dynamic from "next/dynamic";
import CtaBanner from "@/components/shared/cta-banner";
import VerifiedBadge from "@/components/shared/verified-badge";
import StarRating from "@/components/shared/star-rating";
import Breadcrumb from "@/components/shared/breadcrumb";
import ContactSupplierModal from "@/components/shared/contact-modal";
import SupplierMetaStats from "@/components/shared/supplier-meta-stats";

const SupplierSidebarCard = dynamic(() => import("@/components/deal/supplier-sidebar"), { ssr: true });

/* ─── No-image placeholder — carton box icon ─── */
function NoImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <Package size={56} className="text-slate-200" />
    </div>
  );
}

/* ─────────── Placeholder Supplier Data (H1) ────────────────
   PRODUCTION: Replace with data from API:
   - SUPPLIER       → GET /api/suppliers/[id] (returns supplier + deals + reviews)
   - SUPPLIER_DEALS → included in the above response
   SEED: prisma/seed.ts → seedSuppliers(), seedDeals(),
         seedTestimonials(), seedPlatformStats()
   Auth gated at page.tsx level (C16).

   🔧 PRODUCTION SEO — ProfilePage + AggregateRating JSON-LD:
   When data comes from API, emit <script type="application/ld+json"> with:
   {
     "@context": "https://schema.org", "@type": "ProfilePage",
     "mainEntity": {
       "@type": "Organization",
       "name": supplier.name,
       "description": supplier.companyDescription,
       "image": supplier.logo || null,
       "url": `https://wholesaleup.com/suppliers/${supplier.slug}`,
       "address": { "@type": "PostalAddress", "addressCountry": supplier.countryCode },
       "aggregateRating": {
         "@type": "AggregateRating",
         "ratingValue": supplier.rating,
         "reviewCount": supplier.reviewCount,
         "bestRating": 5
       }
     }
   }
   See pricing.jsx FAQSection for working JSON-LD pattern.
   See also: SEO skill Section 5 and Section 12.3.

   🔧 PRODUCTION SEO — generateMetadata() in supplier/page.tsx (L2):
   Convert static metadata export to async generateMetadata({ params }):
     const supplier = await getSupplier(params.slug);
     return {
       title: `${supplier.name} — Verified Supplier`,
       description: `${supplier.name}: ${supplier.rating}★ rated wholesale supplier in ${supplier.country}. ${supplier.categories.join(", ")}.`,
       alternates: { canonical: `/suppliers/${params.slug}` },
       openGraph: { title: supplier.name, images: supplier.logo ? [{ url: supplier.logo }] : undefined },
     };
   ─────────────────────────────────────────────────────────── */
const SUPPLIER = {
  id: 1,
  companyName: "ThreadLine Trading Ltd",
  isVerified: true,
  rating: 4.8,
  reviewCount: 127,
  yearsActive: 6,
  country: "United Kingdom",
  countryCode: "gb",
  memberSince: "March 2018",
  categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots"],
  moreCategories: 2,
  companyDescription: `We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections. Our goal is to provide retailers with high quality, affordable products that help them grow their businesses.

We source our products from leading UK and European brands, ensuring authenticity and quality in every order. With over 6 years in the wholesale industry, we have built strong relationships with major retailers and distributors, allowing us to offer competitive prices that are consistently below market rate.

Our warehouse is located in Manchester, UK, and we ship both domestically and internationally. We pride ourselves on fast dispatch times, reliable tracking, and excellent customer support throughout the order process.

Whether you are an established retailer looking to expand your product lines or a new business seeking reliable wholesale partners, we can tailor our offerings to suit your needs. We support bulk orders, mixed pallets, and smaller starter packs for businesses just getting started with wholesale purchasing.

All items are inspected and graded before dispatch. We provide transparent condition reports for every lot, so you always know exactly what you are purchasing. Our product categories include casual wear, activewear, formal attire, footwear, and seasonal collections.

We also offer dedicated account management for high-volume buyers, with priority access to new stock arrivals and exclusive discounts on repeat orders. Contact our team today to discuss how we can support your business growth.`,
  productsOffered: "Premium Clothings, Premium Footwears, Premium Watches, Premium Handbags. We also carry a wide range of seasonal accessories, limited-edition collaborations, and leather goods sourced from Italian tanneries.",
  brandsDistributed: ["Nike", "Adidas", "Levi's", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", "Hugo Boss", "Superdry", "Jack & Jones", "River Island", "Ted Baker", "French Connection"],
  /* PRODUCTION: productCategories is the canonical field from Supplier Profile form
     (supplier-profile-form.jsx → "Product Categories", Products & Supply tab).
     Stored as category slugs (e.g. "clothing/baby-children", "jewellery/fashion").
     The display labels below are human-readable transforms — in production, derive
     these from the category tree: slug → leaf label + " Supplier" suffix.
     e.g. "clothing/baby-children" → "Baby & Children Clothes Supplier" */
  productCategories: ["Baby & Children Clothes Supplier", "Jewellery Supplier", "Fashion Accessories Supplier"],
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
  contact: {
    name: "Jane Collin",
    roleInCompany: "Store Manager",
    mobileNumber: "+44 7700 900123",
    landlineNumber: "+44 0203 0484377",
    whatsappNumber: "+44 7700 900123",
    teamsHandle: "@janecollin",
    linkedinUrl: "https://linkedin.com/in/janecollin",
  },
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
  /* ── Orders & Payments (Tab 3) ── */
  minimumOrderAmount: 500,
  minimumOrderCurrency: "GBP",
  paymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
  paymentTerms: "Net 30 for approved accounts; prepayment for first orders",
  defaultDepositPercentage: 25,
  defaultDepositTerms: "25% deposit on order confirmation, balance due before dispatch",
  defaultInvoiceType: "vat",
  sanitizedInvoice: "on-request",
  defaultTaxClass: "standard",
  returnPolicy: "Returns accepted within 14 days of delivery for unopened, undamaged goods in original packaging. Buyer covers return shipping costs. Faulty or incorrectly shipped items replaced at no extra charge. Contact our team within 48 hours of delivery for any issues.",
  discountTiers: [
    { minOrder: 2000, discount: 5 },
    { minOrder: 5000, discount: 10 },
    { minOrder: 10000, discount: 15 },
  ],
  discountNotes: "Discounts apply to single orders only and cannot be combined with promotional offers. Contact us for custom pricing on recurring wholesale contracts.",

  /* ── Shipping & Reach (Tab 4) ── */
  deliveryMethods: ["dpd", "pallet-delivery", "own-fleet", "click-collect"],
  leadTime: "3-5-days",
  defaultIncoterms: "DDP",
  countriesServed: ["GB", "IE", "DE", "FR", "NL", "BE", "ES", "IT", "PL", "SE", "DK", "AT", "PT"],
  excludedCountries: ["RU", "BY"],
  socialFacebook: "https://facebook.com/clothingwholesaler",
  socialInstagram: "https://instagram.com/clothingwholesaler",
  socialLinkedin: "https://linkedin.com/company/clothingwholesaler",
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
  { title: "Designer Leather Handbag Collection", price: 32.50, rrp: 89.99, markup: 176.9, profit: 57.49, tags: ["New"], image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" },
  { title: "Premium Wool Winter Scarves – Pack of 12", price: 48.00, rrp: 149.99, markup: 212.5, profit: 101.99, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop" },
  { title: "Men's Casual Oxford Shirts – Assorted Sizes", price: 15.99, rrp: 45.00, markup: 181.4, profit: 29.01, tags: [], image: null },
  { title: "Women's Running Trainers – Mixed Pack", price: 22.00, rrp: 79.99, markup: 263.6, profit: 57.99, tags: ["New", "Dropship"], discountPercentage: 10, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { title: "Stainless Steel Fashion Watch Set", price: 55.00, rrp: 199.99, markup: 263.6, profit: 144.99, tags: ["New"], firstOrderDiscount: { percentage: 15, label: "-15% ON YOUR FIRST ORDER" }, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop" },
  { title: "Sterling Silver Pendant Necklaces – Pack of 6", price: 18.50, rrp: 49.99, markup: 170.2, profit: 31.49, tags: ["Dropship"], image: "https://images.unsplash.com/photo-1515562141589-67f0d569b4a9?w=400&h=400&fit=crop" },
  { title: "Silk Evening Dresses – Assorted Colours", price: 28.00, rrp: 120.00, markup: 328.6, profit: 92.00, tags: ["New"], image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop" },
  { title: "Premium Denim Jeans – End of Line", price: 12.99, rrp: 59.99, markup: 361.7, profit: 47.00, tags: ["New"], image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop" },
];

/* ─────────── Flag Image ─────────── */
function FlagImg({ code, size = 20 }) {
  const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", gb: "gb" };
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}



/* ─── Label maps for Payment & Terms / Shipping tabs ─── */
const CURRENCY_LABELS = { GBP: "GBP (£)", USD: "USD ($)", EUR: "EUR (€)", CAD: "CAD (C$)", AUD: "AUD (A$)" };
/* Branded payment method map — matches deal page (product-tabs.jsx PaymentTermsContent).
   Labels must match PAYMENT_METHODS_SUPPLIER in supplier-profile-form.jsx.
   PRODUCTION: Replace Lucide icons with official brand SVGs where available. */
const PAYMENT_METHODS_BRANDED = {
  "bank-transfer":    { label: "Bank Transfer",               icon: Landmark,      iconColor: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700" },
  "credit-debit-card":{ label: "Credit / Debit Card",         icon: CreditCard,    iconColor: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700" },
  paypal:             { label: "PayPal",                      icon: Wallet,        iconColor: "text-sky-600",     bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700" },
  bnpl:               { label: "Buy Now Pay Later (B2B)",     icon: CalendarClock, iconColor: "text-pink-600",    bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700" },
  "trade-credit":     { label: "Trade Credit (Net 30/60/90)", icon: Handshake,     iconColor: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  "cash-on-delivery": { label: "Cash on Delivery",            icon: Banknote,      iconColor: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" },
  "letter-of-credit": { label: "Letter of Credit",            icon: FileCheck,     iconColor: "text-teal-600",    bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700" },
  escrow:             { label: "Escrow",                      icon: ShieldCheck,   iconColor: "text-indigo-600",  bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700" },
};
const PAYMENT_METHOD_DEFAULT = { label: null, icon: CreditCard, iconColor: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600" };
/* Branded delivery method map — matches deal page (product-tabs.jsx ShippingDeliveryContent).
   Labels must match DELIVERY_METHODS_SUPPLIER in supplier-profile-form.jsx. */
const DELIVERY_METHODS_BRANDED = {
  dhl:              { label: "DHL",                         initials: "DHL",  bg: "bg-yellow-400", text: "text-red-700",   ring: "ring-yellow-500" },
  fedex:            { label: "FedEx",                       initials: "FE",   bg: "bg-purple-600", text: "text-white",     ring: "ring-purple-700" },
  ups:              { label: "UPS",                         initials: "UPS",  bg: "bg-amber-700",  text: "text-white",     ring: "ring-amber-800" },
  usps:             { label: "USPS",                        initials: "US",   bg: "bg-blue-700",   text: "text-white",     ring: "ring-blue-800" },
  tnt:              { label: "TNT",                         initials: "TNT",  bg: "bg-orange-500", text: "text-white",     ring: "ring-orange-600" },
  aramex:           { label: "Aramex",                      initials: "AX",   bg: "bg-red-600",    text: "text-white",     ring: "ring-red-700" },
  dpd:              { label: "DPD",                         initials: "DPD",  bg: "bg-red-700",    text: "text-white",     ring: "ring-red-800" },
  "national-post":  { label: "National Postal Service",     initials: null },
  "pallet-delivery":{ label: "Pallet / LTL Freight",       initials: null },
  "own-fleet":      { label: "Own Fleet / Direct Delivery", initials: null },
  freight:          { label: "Freight / Haulage",           initials: null },
  "click-collect":  { label: "Click & Collect",             initials: null },
  collection:       { label: "Collection in Person",        initials: null },
};
/* ISO code → full country name (for supplier data which stores ISO codes) */
const COUNTRY_NAMES = {
  GB: "United Kingdom", IE: "Ireland", DE: "Germany", FR: "France", NL: "Netherlands",
  BE: "Belgium", ES: "Spain", IT: "Italy", PT: "Portugal", AT: "Austria", CH: "Switzerland",
  NO: "Norway", SE: "Sweden", DK: "Denmark", FI: "Finland", PL: "Poland", CZ: "Czech Republic",
  HU: "Hungary", RO: "Romania", BG: "Bulgaria", HR: "Croatia", GR: "Greece", LU: "Luxembourg",
  SK: "Slovakia", SI: "Slovenia", EE: "Estonia", LV: "Latvia", LT: "Lithuania", MT: "Malta",
  CY: "Cyprus", US: "United States", CA: "Canada", AU: "Australia", NZ: "New Zealand",
  JP: "Japan", KR: "South Korea", CN: "China", IN: "India", TR: "Turkey", BR: "Brazil",
  MX: "Mexico", SG: "Singapore", HK: "Hong Kong", AE: "UAE", SA: "Saudi Arabia",
  ZA: "South Africa", IL: "Israel", TH: "Thailand", MY: "Malaysia", ID: "Indonesia",
  PH: "Philippines", VN: "Vietnam", RU: "Russia", BY: "Belarus", KP: "North Korea",
  IR: "Iran", SY: "Syria", CU: "Cuba", VE: "Venezuela", SD: "Sudan", MM: "Myanmar",
  ZW: "Zimbabwe", AF: "Afghanistan", IQ: "Iraq", LB: "Lebanon", LY: "Libya", SO: "Somalia",
  YE: "Yemen",
};
const LEAD_TIME_LABELS = { "same-day": "Same Day", "1-2-days": "1–2 Days", "3-5-days": "3–5 Days", "1-2-weeks": "1–2 Weeks", "2-4-weeks": "2–4 Weeks", "4-8-weeks": "4–8 Weeks", "8-plus-weeks": "8+ Weeks", "made-to-order": "Made to Order" };
const INCOTERMS_LABELS = { EXW: "EXW (Ex Works)", FOB: "FOB (Free on Board)", CIF: "CIF (Cost, Insurance, Freight)", DDP: "DDP (Delivered Duty Paid)", DAP: "DAP (Delivered at Place)", FCA: "FCA (Free Carrier)" };
const INVOICE_TYPE_LABELS = { vat: "VAT Invoice", proforma: "Proforma Invoice", commercial: "Commercial Invoice", "eu-community": "EU Community Invoice" };
const TAX_CLASS_LABELS = { standard: "Standard Rate", reduced: "Reduced Rate", "zero-rated": "Zero Rated", exempt: "VAT Exempt" };
const SAMPLE_LABELS = { free: "Free Samples", paid: "Paid Samples", "on-request": "On Request", "not-available": "Not Available" };
const SANITIZED_LABELS = { available: "Available", "on-request": "On Request", "not-available": "Not Available" };

/* ═══════════════════════════════════════════════════
   PAYMENT & TERMS TAB — Orders & Payments data
   ═══════════════════════════════════════════════════ */
function PaymentTermsTab({ supplier }) {
  const minOrder = supplier.minimumOrderAmount;
  const minCurrency = supplier.minimumOrderCurrency;
  const currencySymbol = CURRENCY_LABELS[minCurrency]?.split(" ")[0] || minCurrency || "";

  return (
    <div>
      {/* Minimum Order */}
      {minOrder && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><ShoppingCart size={18} className="text-slate-400" /> Minimum Order</h3>
          <p className="text-sm text-slate-600 pl-[26px]">
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-md">
              {currencySymbol} {minOrder.toLocaleString()}
            </span>
          </p>
        </div>
      )}

      {/* Payment Methods — branded icons matching deal page */}
      {supplier.paymentMethods?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><CreditCard size={18} className="text-slate-400" /> Payment Methods Accepted</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {supplier.paymentMethods.map((pm) => {
              const m = PAYMENT_METHODS_BRANDED[pm] || { ...PAYMENT_METHOD_DEFAULT, label: pm };
              const Icon = m.icon;
              return (
                <span key={pm} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${m.text} ${m.bg} border ${m.border} rounded-md`}>
                  <Icon size={12} className={m.iconColor} /> {m.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Terms */}
      {supplier.paymentTerms && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-slate-400" /> Payment Terms</h3>
          <p className="text-sm text-slate-600 leading-relaxed pl-[26px]">{supplier.paymentTerms}</p>
        </div>
      )}

      {/* Deposit */}
      {supplier.defaultDepositPercentage > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Percent size={18} className="text-slate-400" /> Deposit Required</h3>
          <div className="pl-[26px]">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md">
              {supplier.defaultDepositPercentage}%
            </span>
            {supplier.defaultDepositTerms && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{supplier.defaultDepositTerms}</p>}
          </div>
        </div>
      )}

      {/* Discount Tiers */}
      {supplier.discountTiers?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Bulk Discounts</h3>
          <div className="pl-[26px] space-y-2">
            {supplier.discountTiers.map((tier, i) => (
              <div key={i} className="flex items-center justify-between text-sm max-w-xs">
                <span className="text-slate-600">Orders {currencySymbol}{tier.minOrder?.toLocaleString()}+</span>
                <span className="font-bold text-emerald-600">{tier.discount}% off</span>
              </div>
            ))}
            {supplier.discountNotes && <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">{supplier.discountNotes}</p>}
          </div>
        </div>
      )}

      {/* Invoicing */}
      {(supplier.defaultInvoiceType || supplier.defaultTaxClass || supplier.sanitizedInvoice) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-slate-400" /> Invoicing</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {supplier.defaultInvoiceType && (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md">
                {INVOICE_TYPE_LABELS[supplier.defaultInvoiceType] || supplier.defaultInvoiceType}
              </span>
            )}
            {supplier.defaultTaxClass && (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md">
                {TAX_CLASS_LABELS[supplier.defaultTaxClass] || supplier.defaultTaxClass}
              </span>
            )}
            {supplier.sanitizedInvoice && (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md">
                Sanitized: {SANITIZED_LABELS[supplier.sanitizedInvoice] || supplier.sanitizedInvoice}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Return Policy */}
      {supplier.returnPolicy && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-slate-400" /> Return Policy</h3>
          <p className="text-sm text-slate-600 leading-relaxed pl-[26px]">{supplier.returnPolicy}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHIPPING TAB — Shipping & Reach data
   ═══════════════════════════════════════════════════ */
function ShippingTab({ supplier }) {
  return (
    <div>
      {/* 1. Lead Time & Incoterms — matches deal page "Availability & Lead Time" position */}
      {(supplier.leadTime || supplier.defaultIncoterms) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Clock size={18} className="text-slate-400" /> Lead Time & Incoterms</h3>
          <div className="flex flex-wrap gap-3 pl-[26px]">
            {supplier.leadTime && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-md">
                <Clock size={12} className="text-slate-400" />
                {LEAD_TIME_LABELS[supplier.leadTime] || supplier.leadTime}
              </span>
            )}
            {supplier.defaultIncoterms && (
              <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-md">
                {INCOTERMS_LABELS[supplier.defaultIncoterms] || supplier.defaultIncoterms}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Shipping Coverage — matches deal page position */}
      {supplier.countriesServed?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Globe size={18} className="text-slate-400" /> Shipping Coverage</h3>
          <div className="pl-[26px] space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-2">Ships to ({supplier.countriesServed.length} countries)</p>
              <div className="pl-3 columns-2 sm:columns-3 gap-x-6">
                {[...supplier.countriesServed].sort((a, b) => (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)).map((code) => (
                  <div key={code} className="flex items-center gap-2 text-sm text-slate-600 mb-1.5 break-inside-avoid">
                    <FlagImg code={code} size={16} />
                    {COUNTRY_NAMES[code] || code}
                  </div>
                ))}
              </div>
            </div>

            {/* Restrictions — orange banner matching deal page */}
            {supplier.excludedCountries?.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                <Ban size={14} className="shrink-0" /> Does not ship to: {supplier.excludedCountries.map((code) => COUNTRY_NAMES[code] || code).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Delivery & Fulfilment — branded carriers matching deal page */}
      {supplier.deliveryMethods?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Truck size={18} className="text-slate-400" /> Delivery & Fulfilment</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {supplier.deliveryMethods.map((dm) => {
              const m = DELIVERY_METHODS_BRANDED[dm] || { label: dm, initials: null };
              return (
                <span key={dm} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
                  {m.initials ? (
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold leading-none ${m.bg} ${m.text} ring-1 ${m.ring}`}>{m.initials}</span>
                  ) : (
                    <Truck size={12} className="text-slate-400" />
                  )}
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Sample Availability */}
      {supplier.sampleAvailability && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Package size={18} className="text-slate-400" /> Samples</h3>
          <p className="pl-[26px]">
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-sky-700 bg-sky-50 border border-sky-200 rounded-md">
              {SAMPLE_LABELS[supplier.sampleAvailability] || supplier.sampleAvailability}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER HEADER — name, verified, country, years
   ═══════════════════════════════════════════════════ */
/* Supplier type key → display label (matches supplier-sidebar.jsx) */
const SUPPLIER_TYPE_LABELS = { manufacturer: "Manufacturer", "brand-owner": "Brand Owner", "private-label": "Private / White Label", wholesaler: "Wholesaler", distributor: "Distributor", importer: "Importer", exporter: "Exporter", "trading-company": "Trading Company", liquidator: "Liquidator / Clearance", dropshipper: "Dropshipper", "sourcing-agent": "Sourcing Agent", "artisan-maker": "Artisan / Maker" };

function SupplierHeader({ supplier, faved, onToggleFav, onHide, canViewName = true }) {
  /* Anonymous name: "{first category stem} {type1} & {type2}"
     e.g. "Baby & Children Clothes Wholesaler & Distributor" */
  const displayName = canViewName ? supplier.companyName : (() => {
    const rawCat = supplier.productCategories?.[0] || "Wholesale";
    // Convert slugs like "mobile-phones" → "Mobile Phones"
    const firstCat = rawCat.includes("-") ? rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : rawCat;
    const stem = firstCat.replace(/\s+Supplier$/i, "");
    const types = supplier.supplierType || [];
    const typesLabel = types.length > 0
      ? types.map((st) => SUPPLIER_TYPE_LABELS[st] || st).join(" & ")
      : "Supplier";
    return `${stem} ${typesLabel}`;
  })();

  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {supplier.isSupplierPro && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1e5299] text-white text-[10px] font-bold rounded-md">
                  <Crown size={10} className="shrink-0" /> PRO
                </span>
              )}
              {supplier.isVerified && <VerifiedBadge />}
            </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
          {displayName}
        </h1>
        <SupplierMetaStats supplier={supplier} size="md" className="mt-2" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onHide}
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
  const lines = supplier.companyDescription.split("\n");
  const isLong = lines.length > LINE_LIMIT;
  const displayText = expanded || !isLong ? supplier.companyDescription : lines.slice(0, LINE_LIMIT).join("\n") + "…";

  return (
    <div className="relative">
      {/* Focus Product Groups */}
      {supplier.productCategories.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Flame size={18} className="text-slate-400" /> Focus</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {supplier.productCategories.map((group) => (
              <a
                key={group}
                href={`/suppliers?any=${encodeURIComponent(group)}`}
                className="px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors"
              >
                {group}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* About description */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400" /> About This Supplier</h3>
        <div className="pl-[26px]">
          <div className="text-base text-slate-600 leading-relaxed whitespace-pre-line">{displayText}</div>
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
      {supplier.productsOffered && (() => {
        const raw = Array.isArray(supplier.productsOffered) ? supplier.productsOffered.join(", ") : supplier.productsOffered;
        const items = raw.split(/[,.]/).map(s => s.trim()).filter(Boolean);
        const allShort = items.every(item => item.split(/\s+/).length <= 3);
        return (
          <div className="mb-8">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Package size={18} className="text-slate-400" /> Products Distributed by This Supplier</h3>
            {allShort ? (
              <div className="flex flex-wrap gap-2 pl-[26px]">
                {items.map((item) => (
                  <a key={item} href={`/suppliers?any=${encodeURIComponent(item)}`} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 hover:border-sky-300 transition-colors cursor-pointer">
                    {item}
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 pl-[26px] text-base text-slate-600 leading-relaxed">
                {items.map((item, i) => {
                  const isShort = item.split(/\s+/).length <= 3;
                  return isShort ? (
                    <a key={i} href={`/suppliers?any=${encodeURIComponent(item)}`} className="inline-flex items-center px-2.5 py-1 text-sm font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 hover:border-sky-300 transition-colors cursor-pointer">
                      {item}
                    </a>
                  ) : (
                    <span key={i} className="text-slate-600">
                      {item}{i < items.length - 1 ? "," : ""}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* Brands Distributed */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Tag size={18} className="text-slate-400" /> Brands Distributed by This Supplier</h3>
        <div className="flex flex-wrap gap-2 pl-[26px]">
          {supplier.brandsDistributed.length > 0 ? (
            supplier.brandsDistributed.map((brand) => (
              <a key={brand} href={`/deals?any=${encodeURIComponent(brand)}`} className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 hover:border-orange-300 transition-colors">
                {brand}
              </a>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">- No brands found</p>
          )}
        </div>
      </div>

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
   SUPPLIER PROFILE TABS — About / Payment & Terms / Shipping / Review
   ═══════════════════════════════════════════════════ */
function SupplierProfileTabs({ supplier, isPremium, isPremiumPlus, isLoggedIn }) {
  const searchParams = useSearchParams();
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("about");
  // Review tab is Premium+-only (not Premium). isPremiumPlus = premium-plus | supplier-premium.
  const canAccessReviews = isLoggedIn && isPremiumPlus;

  // Auto-switch tab from URL ?tab= param
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "reviews" || tabParam === "review") {
      setActiveTab("review");
      setTimeout(() => { tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    } else if (tabParam === "terms" || tabParam === "payment") {
      setActiveTab("terms");
      setTimeout(() => { tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    } else if (tabParam === "shipping") {
      setActiveTab("shipping");
      setTimeout(() => { tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 100);
    }
  }, [searchParams]);

  return (
    <div ref={tabsRef} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg" style={{ scrollMarginTop: "130px" }}>
      {/* Tab headers — matches deal page ProductDescriptionTabs style */}
      <div role="tablist" aria-label="Supplier information" className="flex border-b border-slate-200 overflow-x-auto">
        {[
          { key: "about", label: "About" },
          { key: "terms", label: "Payment & Terms" },
          { key: "shipping", label: "Shipping & Delivery" },
          { key: "review", label: "Review", locked: !canAccessReviews },
        ].map((tab) => (
          <button
            key={tab.key}
            role="tab"
            id={`supplier-tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`supplier-panel-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3.5 text-sm font-semibold transition-colors relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-600"
            }`}
          >
            {tab.label}
            {tab.locked && <Lock size={12} className="text-slate-300" />}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" id={`supplier-panel-${activeTab}`} aria-labelledby={`supplier-tab-${activeTab}`} className="p-6">
        {activeTab === "about" && <AboutTab supplier={supplier} />}
        {activeTab === "terms" && <PaymentTermsTab supplier={supplier} />}
        {activeTab === "shipping" && <ShippingTab supplier={supplier} />}
        {activeTab === "review" && (
          canAccessReviews ? (
            <ReviewTab reputation={supplier.reputation} />
          ) : (
            /* ── GATED STATE — PLACEHOLDER DATA ONLY ──
               Blurred placeholder + lock overlay, matching deal-variables pattern.
               Real reputation data is never rendered when gated. */
            <div className="relative overflow-hidden min-h-[280px]">
              {/* PLACEHOLDER DATA ONLY — blurred static content */}
              <div className="select-none pointer-events-none" style={{ filter: "blur(8px)", opacity: 0.35 }}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-900">4.2</span>
                    <p className="text-xs text-slate-400 mt-0.5">out of 5</p>
                  </div>
                  <div>
                    <StarRating rating={4.2} size={18} />
                    <p className="text-sm text-slate-500 mt-1">Based on 12 sources &middot; Updated Mar 2026</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-900 mb-3">Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">This supplier has a strong reputation for reliable delivery and consistent product quality across multiple review platforms.</p>
                </div>
                <div className="space-y-3">
                  {["Product Quality", "Delivery Speed", "Communication", "Value for Money"].map((label) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-44 shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: "75%" }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-8 text-right">3.8</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lock overlay card */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center px-6 py-5 rounded-xl bg-white/90 border border-slate-200 shadow-sm max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2.5">
                    <Lock size={18} className="text-orange-500" />
                  </div>
                  <p className="text-xs text-slate-400 mb-3 text-center">
                    {isLoggedIn
                      ? "Supplier reputation and review data are available on Premium+ plans."
                      : "Supplier reputation and review data are available to registered members."}
                  </p>
                  <a
                    href={isLoggedIn ? "/pricing" : "/register"}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm transition-all"
                  >
                    {isLoggedIn ? <><Rocket size={12} /> View Plans</> : <><Lock size={12} /> Log In / Register</>}
                  </a>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* OLD OpeningHoursWidget and ContactSidebar removed — now uses shared
   SupplierSidebarCard from @/components/deal/supplier-sidebar */

/* ═══════════════════════════════════════════════════
   DEAL CARD — for supplier deals carousel
   ═══════════════════════════════════════════════════ */
function SupplierDealCard({ deal, isPremium, isLoggedIn, canViewSupplier = false }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && deal.isSupplierPro);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col h-full relative cursor-pointer" onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}>
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <EyeOff size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Deal hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-4 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5">
            <Eye size={12} /> Unhide Deal
          </button>
        </div>
      )}

      {/* Card body — clickable link to deal page */}
      <a href="/deal" className="block flex-1 cursor-pointer">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
          {deal.image ? (
            <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="100%" onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <NoImagePlaceholder />
          )}
          {/* Markup badge (top-right) */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
            <TrendingUp size={10} /> {deal.markup}%
          </div>
          {/* Tags (top-left, stacked) */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              {deal.tags.map((tag) => (
                tag === "Dropship" ? (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm flex items-center gap-1">
                    <Truck size={10} /> DROPSHIP
                  </span>
                ) : (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">NEW</span>
                )
              ))}
            </div>
          )}
          {/* Price badge (bottom-left, on image) */}
          <div className="absolute bottom-2 left-2 flex flex-col items-start">
            {deal.discountPercentage > 0 && (
              <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">-{deal.discountPercentage}% DISCOUNT</div>
            )}
            <div className={`${deal.discountPercentage > 0 ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
              <span className={`text-base font-extrabold ${deal.discountPercentage > 0 ? "text-white" : "text-orange-600"}`}>£{deal.price.toFixed(2)}</span>
              <span className={`text-[10px] ml-1 ${deal.discountPercentage > 0 ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
            </div>
          </div>
          {/* Hide + Favourite buttons (bottom-right, hover only) */}
          <div className={`absolute bottom-2 right-2 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setHidden(true) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <EyeOff size={12} className="text-slate-400" />
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setFaved(!faved) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <Heart size={12} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>
        <div className="p-3.5 pb-0">
          {deal.firstOrderDiscount && (
            <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderDiscount.label}</span></div>
          )}
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">{deal.title}</h3>
          {/* RRP + Profit rows */}
          <div className="border-t border-slate-100">
            {/* Column headers */}
            <div className="flex items-center px-1 pt-2 pb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
              <span className="w-10 shrink-0" />
              <span className="flex-1">Price</span>
              <span>Profit</span>
            </div>
            {/* RRP */}
            <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
              <span className="text-[13px] font-bold text-slate-400 w-10 shrink-0">RRP</span>
              <span className="flex-1 text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}</span>
              <span className="text-[13px] text-emerald-600 font-bold tabular-nums">£{deal.profit.toFixed(2)}</span>
            </div>
            {/* Amazon */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.amazon.com", "_blank"); }}
              className="flex items-center px-1 py-2 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#FF9900"}}>£{deal.profit.toFixed(2)}</span>
            </div>
            {/* eBay */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.ebay.com", "_blank"); }}
              className="flex items-center px-1 py-2 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#0064D2"}}>£{deal.profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </a>
      {/* Action button — three-tier gating, NOT part of the card link */}
      <div className="p-3.5 pt-3">
        {canContact ? (
          <button className="w-full py-2.5 text-sm font-bold rounded-lg bg-[#1e5299] hover:bg-[#174280] text-white flex items-center justify-center gap-1.5 mt-auto shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <MessageSquare size={14} /> Send Enquiry
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="block w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-center mt-auto flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Send Enquiry
          </a>
        ) : (
          <button onClick={openRegisterModal} className="w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Join Now!
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEALS CAROUSEL — Best Deals from this supplier
   ═══════════════════════════════════════════════════ */
function SupplierDealsCarousel({ deals, isPremium, isLoggedIn, canViewSupplier = false }) {
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
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Best Wholesale & Dropship Deals from Similar Suppliers</h2>
          <p className="text-sm text-slate-500 mt-1">Browse the latest wholesale opportunities from this supplier.</p>
        </div>
        <a href="/supplier-deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          View All Deals <ArrowRight size={14} />
        </a>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {deals.map((d, i) => (
            <div key={d.title || i} className="shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] snap-start">
              <SupplierDealCard deal={d} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
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
  /* PRODUCTION (H2): Fetch stats from GET /api/stats, testimonials from GET /api/testimonials */
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", role: "Online Retailer", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleUp as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", role: "Dropshipper", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", role: "Online Reseller", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", role: "Wholesale Buyer", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", role: "Dropshipper", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", role: "eBay Seller", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", role: "Online Reseller", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", role: "Amazon Seller", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", role: "Wholesale Buyer", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", role: "Online Retailer", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", role: "Dropshipper", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", role: "Online Reseller", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
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
                <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role} — {t.location}</p>
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
   MAIN — /supplier page
   ═══════════════════════════════════════════════════ */
export default function SupplierProfilePage() {
  /* ── Auth state from DemoAuthContext ───────────────────────
     Supports both real NextAuth session AND demo dropdown overrides.
     Premium gating controls supplier contact info visibility.
     ─────────────────────────────────────────────────────────── */
  const { isLoggedIn, isPremium, isPremiumPlus, canViewSupplier, demoSupplierPro } = useDemoAuth();
  const [faved, setFaved] = useState(false);

  /* PRODUCTION: Fetch supplier from API:
     const { data: supplier } = useSWR(`/api/suppliers/${supplierId}`, fetcher); */
  const supplier = useMemo(() => ({
    ...SUPPLIER,
    isSupplierPro: demoSupplierPro,
  }), [demoSupplierPro]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Wholesale Suppliers", href: "/suppliers" },
          { label: "Clothing & Fashion", href: "/suppliers/clothing-fashion" },
        ]} />

        {/* Supplier Header — name gated by viewer tier + supplier Pro status */}
        <SupplierHeader supplier={supplier} faved={faved}
          onToggleFav={() => isLoggedIn ? setFaved(!faved) : window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }))}
          onHide={() => { if (!isLoggedIn) window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } })); }}
          canViewName={isLoggedIn && (supplier.isSupplierPro || isPremium)} />

        {/* === MAIN GRID: Profile | Contact Sidebar === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Col 1+2: Supplier Profile (spans 2 columns like image+pricing in deal) */}
          <div className="min-w-0 xl:col-span-2">
            <SupplierProfileTabs supplier={supplier} isPremium={isPremium} isPremiumPlus={isPremiumPlus} isLoggedIn={isLoggedIn} />
          </div>

          {/* Col 3: Contact sidebar (same component as deal, no View Profile button) */}
          <div className="min-w-0 xl:sticky xl:top-[120px] xl:self-start xl:max-h-[calc(100vh-144px)] xl:overflow-y-scroll scrollbar-hide xl:p-2 xl:-m-2">
            <SupplierSidebarCard supplier={supplier} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} hideViewProfile hideTerms />
          </div>
        </div>

        {/* Best Deals from this Supplier */}
        <SupplierDealsCarousel deals={SUPPLIER_DEALS} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />

        {/* Trust Section */}
        <TrustSection />

        {/* CTA Banner */}
        <CtaBanner />
      </div>
    </div>
  );
}
