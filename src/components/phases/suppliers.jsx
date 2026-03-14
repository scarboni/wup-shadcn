"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import WebsiteLink from "@/components/shared/website-link";
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
  Rocket,
  User,
  CheckCircle2,
  BadgeCheck,
  ExternalLink,
  Send,
  MessageSquare,
  Eye,
  EyeOff,
  Calendar,
  Package,
  Heart,
  Sparkles,
  Crown,
  Copy,
  Check,
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  SlidersHorizontal,
  AlertTriangle,
  Filter,
  X,
  ChevronLeft,
  ArrowRight,
  ShoppingCart,
  Store,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import VerifiedBadge from "@/components/shared/verified-badge";
import StarRating from "@/components/shared/star-rating";
import ContactSupplierModal from "@/components/shared/contact-modal";
import Breadcrumb from "@/components/shared/breadcrumb";
import { FILTER_CATEGORIES, getCategoryById, getSubcategoryById } from "@/lib/categories";
import { COUNTRIES as CANONICAL_COUNTRIES } from "@/lib/countries";
import BroadMatchSeparator from "@/components/shared/broad-match-separator";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import { LockedLogoPlaceholder } from "@/components/shared/logo";

import { FilterSidebar, ActiveFilterChips, Pagination } from "./filters";

/* ─────────── Flag Images (flat style via flagcdn.com) ─────────── */
const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", AU: "au" };
function FlagImg({ code, size = 20 }) {
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}

/* ─────────── Business Hours Helpers ─────────── */
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getOpenDays(businessHours) {
  if (!businessHours) return [false, false, false, false, false, false, false];
  return DAY_KEYS.map(day => businessHours[day]?.status === "open");
}

function getOpeningHours(businessHours) {
  if (!businessHours) return "";
  // Find first open day and return its slot times
  for (const day of DAY_KEYS) {
    const d = businessHours[day];
    if (d?.status === "open" && d.slots?.[0]) {
      return `${d.slots[0].open}–${d.slots[0].close}`;
    }
  }
  return "";
}

/* ─────────── Highlight Keywords in Text ─────────── */
function HighlightedText({ text, keyword }) {
  if (!keyword || !text) return text;
  // keyword can be pipe-separated for multiple terms (e.g. "Nike|Adidas")
  const terms = keyword.split("|").filter(Boolean);
  if (terms.length === 0) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? (
      <strong key={i} className="font-bold text-slate-900">{part}</strong>
    ) : (
      part
    )
  );
}

/* ─────────── Blurred Text (Free tier gating) ─────────── */
function scrambleText(text) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return text.replace(/[A-Za-z0-9]/g, (ch, i) => chars[(ch.charCodeAt(0) + i * 7) % chars.length]);
}

function BlurredText({ text, isPremium, className = "" }) {
  if (isPremium) return <span className={`${className} opacity-60`}>{text}</span>;
  return (
    <span className={`select-none pointer-events-none ${className}`}>
      {scrambleText(text || "")}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   REPORT INVALID DETAILS MODAL
   ═══════════════════════════════════════════════════ */
function ReportInvalidModal({ supplier, field, onClose }) {
  const [comments, setComments] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  };

  if (!supplier || !field) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Report Invalid Details" className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Report Invalid Details</h3>
              <p className="text-red-100 text-xs mt-0.5">{supplier.companyName || "Supplier"}</p>
            </div>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" aria-label="Close modal">
              <X size={14} />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <BadgeCheck size={24} className="text-emerald-500" />
              </div>
              <p className="font-bold text-slate-900">Report Submitted!</p>
              <p className="text-sm text-slate-500 mt-1">Thank you for helping us keep supplier details accurate.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">Reporting: <span className="text-red-600">{field}</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">You are reporting that this supplier's {field.toLowerCase()} details may be incorrect or outdated.</p>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Comments (optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what's wrong with this information..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={12} /> Submit Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Placeholder Supplier Data (H1) ────────────────
   PRODUCTION: Replace with data from API:
   - SUPPLIERS       → GET /api/suppliers?limit=20&offset=0&filters=...
   - REVIEWS         → included in supplier response or GET /api/suppliers/[id]/reviews
   - categories list → GET /api/categories (for filter sidebar)
   SEED: prisma/seed.ts → seedSuppliers(), seedCategories(),
         seedTestimonials(), seedPlatformStats()
   Use SWR/React Query with server-side pagination.
   ─────────────────────────────────────────────────────────── */
const SUPPLIERS = [
  {
    id: 1,
    slug: "prokit-sports-ltd",
    companyName: "ProKit Sports Ltd",
    rating: 5.0,
    reviewCount: 24,
    yearsActive: 8,
    isVerified: true,
    companyDescription: "We are a wholesaler of sportswear clothing and shoes. We offer high quality of adidas originals men's sports jackets, adidas long sleeved formal button collared mens shirts, canterbury tour and waimak polo shirts, adidas andy murray t-shirts. We also stock a wide range of trainers including adidas superstar, nike air max, nike free run, reebok classics and many more popular brands at competitive wholesale prices. Our warehouse in East London carries over 10,000 SKUs across all major sportswear categories with new stock arriving weekly from brand-authorised sources. We supply independent retailers, market traders, and online sellers across the UK and Europe with minimum order quantities starting from just 10 units. All items come with full manufacturer warranty and authenticity guarantee. We also offer a bespoke embroidery and printing service for team kits and corporate workwear orders.",
    contact: {
      name: "Jane Collin",
      roleInCompany: "Store Manager",
      mobileNumber: "+4402089072658",
      businessEmail: "wholesaletrain@gmail.com",
    },
    address: {
      street: "9 Fisher's Lane, Chiswick",
      city: "London",
      postalCode: "W41RX",
      country: "United Kingdom",
      countryCode: "gb",
    },
    companyWebsite: "www.sportswearwholesale.co.uk",
    categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots", "Sports & Leisure", "Apparel & Clothing"],
    productsOffered: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches",
    brandsDistributed: ["Adidas", "Nike", "Reebok", "Canterbury"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      tuesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      thursday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      friday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "dropshipping", "white-label"],
    supplierType: ["wholesaler", "distributor"],
    productQualityTier: ["mid-range", "premium"],
    isSupplierPro: true,
    companyLogo: "https://ui-avatars.com/api/?name=PK&background=1e5299&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "market-trader", "wholesaler-reseller"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["ce", "iso-9001"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 10,
    minimumOrderCurrency: "GBP",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["national-post", "own-fleet"],
    leadTime: "1-2-days",
    countriesServed: ["GB", "DE", "FR", "NL"],
    facilitySize: 5000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2018,
    preferredCurrency: "GBP",
    sampleAvailability: "free",
    salutation: "Ms",
  },
  {
    id: 2,
    slug: "basketball-sport-gmbh",
    companyName: "Basketball Sport GmbH",
    rating: 4.5,
    reviewCount: 18,
    yearsActive: 5,
    isVerified: true,
    companyDescription: "Premium basketball equipment and sportswear distributor covering Europe. We specialise in authentic NBA merchandise, professional-grade basketballs, training equipment, and team uniforms. Our warehouse stocks over 5,000 SKUs from leading brands with same-day dispatch on orders placed before 2pm CET.",
    contact: {
      name: "Hans Mueller",
      roleInCompany: "Sales Director",
      mobileNumber: "+49301234567",
      businessEmail: "info@basketballsport.de",
    },
    address: {
      street: "Berliner Str. 45",
      city: "Berlin",
      postalCode: "10115",
      country: "Germany",
      countryCode: "de",
    },
    companyWebsite: "www.basketballsport.de",
    categories: ["Sports & Leisure", "Apparel & Clothing", "Toys & Games"],
    productsOffered: "Basketball Equipment, Sports Apparel, Training Gear",
    brandsDistributed: ["Nike", "Under Armour", "Spalding", "Wilson"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      tuesday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      wednesday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      thursday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      friday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "job-lots"],
    supplierType: ["distributor"],
    productQualityTier: ["premium"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=BS&background=e74c3c&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "multi-chain", "online-retailer"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["ce"],
    catalogueSize: "200-1000",
    minimumOrderAmount: 50,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["dhl", "ups", "own-fleet"],
    leadTime: "1-2-days",
    countriesServed: ["DE", "FR", "NL", "AT", "PL"],
    facilitySize: 3000,
    facilitySizeUnit: "m²",
    companySize: "10-50",
    yearEstablished: 2021,
    preferredCurrency: "EUR",
    sampleAvailability: "paid",
    salutation: "Mr",
  },
  {
    id: 3,
    slug: "stylevault-trading-co",
    companyName: "StyleVault Trading Co",
    rating: 4.2,
    reviewCount: 12,
    yearsActive: 6,
    isVerified: true,
    companyDescription: "We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections. Our goal is to provide retailers with high quality, affordable luxury fashion items that help them stand out in a competitive market. We source our stock from leading UK department stores, high-street chains, and online retailers, ensuring every batch is genuine branded merchandise. Our Manchester distribution centre processes over 50,000 units per week with full quality control inspection on every item. We offer flexible buying options including pre-sorted grade A pallets, mixed fashion pallets, and hand-picked premium bundles tailored to your store's customer profile.",
    contact: {
      name: "Sarah Thompson",
      roleInCompany: "Operations Manager",
      mobileNumber: "+4402039876543",
      businessEmail: "sales@casualwholesale.co.uk",
    },
    address: {
      street: "15 Victoria Road",
      city: "Manchester",
      postalCode: "M1 2AB",
      country: "United Kingdom",
      countryCode: "gb",
    },
    companyWebsite: "www.casualwholesale.co.uk",
    categories: ["Apparel & Clothing", "Jewellery & Watches", "Health & Beauty"],
    productsOffered: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches, Premium Jewelries, Premium Handbags",
    brandsDistributed: [],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      tuesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      thursday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      friday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "liquidation"],
    supplierType: ["liquidator"],
    productQualityTier: ["budget", "mid-range"],
    isSupplierPro: true,
    companyLogo: "https://ui-avatars.com/api/?name=SV&background=8e44ad&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "marketplace-seller"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: [],
    catalogueSize: "5000-20000",
    minimumOrderAmount: 100,
    minimumOrderCurrency: "GBP",
    paymentMethods: ["bank-transfer", "credit-debit-card"],
    deliveryMethods: ["national-post", "pallet-delivery"],
    leadTime: "3-5-days",
    countriesServed: ["GB", "DE", "FR"],
    facilitySize: 8000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2020,
    preferredCurrency: "GBP",
    sampleAvailability: "on-request",
    salutation: "Ms",
  },
  {
    id: 4,
    slug: "techworld-electronics-inc",
    companyName: "TechWorld Electronics Inc",
    rating: 4.8,
    reviewCount: 42,
    yearsActive: 12,
    isVerified: true,
    companyDescription: "Major US electronics wholesaler specialising in consumer tech, laptops, tablets, gaming accessories, and smart home devices. Direct partnerships with top brands ensure competitive pricing and authentic products.",
    contact: {
      name: "Mike Reynolds",
      roleInCompany: "VP Sales",
      mobileNumber: "+12125551234",
      businessEmail: "sales@techworldwholesale.com",
    },
    address: {
      street: "350 Fifth Avenue",
      city: "New York",
      postalCode: "10118",
      country: "United States",
      countryCode: "us",
    },
    companyWebsite: "www.techworldwholesale.com",
    categories: ["Computing", "Consumer Electronics", "Mobile & Home Phones"],
    productsOffered: "Laptops, Tablets, Smartphones, Gaming Accessories, Smart Home Devices",
    brandsDistributed: ["Apple", "Samsung", "Sony", "Dell", "HP"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:00", close: "18:00" }] },
      tuesday: { status: "open", slots: [{ open: "08:00", close: "18:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "18:00" }] },
      thursday: { status: "open", slots: [{ open: "08:00", close: "18:00" }] },
      friday: { status: "open", slots: [{ open: "08:00", close: "18:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "dropshipping", "private-label"],
    supplierType: ["wholesaler", "importer"],
    productQualityTier: ["mid-range"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=TZ&background=2ecc71&color=fff&size=96&bold=true",
    buyerTypesServed: ["online-retailer", "shop-retailer", "dropshipper"],
    customersServed: ["registered-companies", "sole-traders", "individuals"],
    certifications: ["fda", "rohs"],
    catalogueSize: "5000-20000",
    minimumOrderAmount: 500,
    minimumOrderCurrency: "USD",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit", "paypal"],
    deliveryMethods: ["fedex", "ups", "own-fleet", "freight"],
    leadTime: "3-5-days",
    countriesServed: ["US", "CA", "MX"],
    facilitySize: 12000,
    facilitySizeUnit: "m²",
    companySize: "100-500",
    yearEstablished: 2014,
    preferredCurrency: "USD",
    sampleAvailability: "free",
    salutation: "Mr",
  },
  {
    id: 5,
    slug: "eurobeauty-distribution",
    companyName: "EuroBeauty Distribution",
    rating: 4.6,
    reviewCount: 31,
    yearsActive: 9,
    isVerified: true,
    companyDescription: "Leading European distributor of premium beauty, skincare, and fragrance products. Authorised stockist for over 200 brands including prestige and mass-market lines. Full dropship capability across EU. Our Paris headquarters manages logistics for over 15,000 active products with temperature-controlled storage for sensitive skincare and fragrance lines. We offer white-label packaging services, custom gift set assembly, and branded display stands for retail partners. New collections are added monthly with exclusive early access for premium trade members. Our dedicated account managers provide personalised product recommendations based on your customer demographics and regional trends.",
    contact: {
      name: "Sophie Laurent",
      roleInCompany: "Commercial Director",
      mobileNumber: "+33142567890",
      businessEmail: "contact@eurobeauty.fr",
    },
    address: {
      street: "25 Rue de Rivoli",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      countryCode: "fr",
    },
    companyWebsite: "www.eurobeauty.fr",
    categories: ["Health & Beauty", "Jewellery & Watches"],
    productsOffered: "Skincare, Makeup, Perfumes, Hair Care, Nail Care, Beauty Tools",
    brandsDistributed: ["L'Oréal", "Chanel", "Dior", "Estée Lauder"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "09:00", close: "17:30" }] },
      tuesday: { status: "open", slots: [{ open: "09:00", close: "17:30" }] },
      wednesday: { status: "open", slots: [{ open: "09:00", close: "17:30" }] },
      thursday: { status: "open", slots: [{ open: "09:00", close: "17:30" }] },
      friday: { status: "open", slots: [{ open: "09:00", close: "17:30" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "dropshipping"],
    supplierType: ["manufacturer", "brand-owner"],
    productQualityTier: ["premium", "luxury"],
    isSupplierPro: true,
    companyLogo: "https://ui-avatars.com/api/?name=EB&background=e67e22&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["rohs", "reach", "organic"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 200,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit", "letter-of-credit"],
    deliveryMethods: ["dhl", "fedex", "ups"],
    leadTime: "1-2-weeks",
    countriesServed: ["FR", "DE", "IT", "ES", "NL", "BE"],
    facilitySize: 6000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2017,
    preferredCurrency: "EUR",
    sampleAvailability: "paid",
    salutation: "Ms",
  },
  {
    id: 6,
    slug: "nordic-home-living-gmbh",
    companyName: "Nordic Home & Living GmbH",
    rating: 4.3,
    reviewCount: 16,
    yearsActive: 4,
    isVerified: false,
    companyDescription: "Scandinavian-inspired home and garden products wholesaler. Specialising in minimalist furniture, kitchen essentials, bedding, and outdoor living. All products meet EU quality and sustainability standards.",
    contact: {
      name: "Klaus Weber",
      roleInCompany: "Founder",
      mobileNumber: "+49891234567",
      businessEmail: "info@nordichome.de",
    },
    address: {
      street: "Maximilianstr. 12",
      city: "Munich",
      postalCode: "80539",
      country: "Germany",
      countryCode: "de",
    },
    companyWebsite: "www.nordichome.de",
    categories: ["Home & Garden"],
    productsOffered: "Furniture, Kitchenware, Bedding, Garden Accessories, Home Decor",
    brandsDistributed: [],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:30", close: "16:30" }] },
      tuesday: { status: "open", slots: [{ open: "08:30", close: "16:30" }] },
      wednesday: { status: "open", slots: [{ open: "08:30", close: "16:30" }] },
      thursday: { status: "open", slots: [{ open: "08:30", close: "16:30" }] },
      friday: { status: "open", slots: [{ open: "08:30", close: "16:30" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "job-lots"],
    supplierType: ["wholesaler"],
    productQualityTier: ["budget"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=NH&background=f39c12&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer"],
    customersServed: ["registered-companies"],
    certifications: ["iso-14001"],
    catalogueSize: "200-1000",
    minimumOrderAmount: 300,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card"],
    deliveryMethods: ["dhl", "ups", "own-fleet"],
    leadTime: "2-4-weeks",
    countriesServed: ["DE", "AT", "CH"],
    facilitySize: 4500,
    facilitySizeUnit: "m²",
    companySize: "10-50",
    yearEstablished: 2022,
    preferredCurrency: "EUR",
    sampleAvailability: "on-request",
    salutation: "Mr",
  },
  {
    id: 7,
    slug: "kidzone-toys-games-ltd",
    companyName: "KidZone Toys & Games Ltd",
    rating: 4.7,
    reviewCount: 28,
    yearsActive: 7,
    isVerified: true,
    companyDescription: "UK's fastest-growing toy and game wholesaler. Huge range of licensed character toys, educational games, outdoor play equipment, and arts & crafts supplies. Competitive MOQs and fast UK delivery. We hold licences for Disney, Marvel, Peppa Pig, PAW Patrol, and many more popular children's brands. Our Birmingham warehouse stocks over 8,000 unique toy lines with seasonal ranges updated quarterly. We serve nurseries, gift shops, garden centres, and online retailers with trade pricing starting from just 6 units per line. Full POS display solutions and promotional bundles available for in-store events and seasonal peaks including Christmas, Easter, and back-to-school periods.",
    contact: {
      name: "David Patel",
      roleInCompany: "Trade Manager",
      mobileNumber: "+4402078901234",
      businessEmail: "trade@kidzonetoys.co.uk",
    },
    address: {
      street: "Unit 8, Westfield Industrial Park",
      city: "Birmingham",
      postalCode: "B1 2RA",
      country: "United Kingdom",
      countryCode: "gb",
    },
    companyWebsite: "www.kidzonetoys.co.uk",
    categories: ["Toys & Games", "Baby Products"],
    productsOffered: "Action Figures, Board Games, Dolls, Educational Toys, Outdoor Toys, Arts & Crafts",
    brandsDistributed: ["Hasbro", "LEGO", "Mattel", "Disney"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "07:30", close: "16:00" }] },
      tuesday: { status: "open", slots: [{ open: "07:30", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "07:30", close: "16:00" }] },
      thursday: { status: "open", slots: [{ open: "07:30", close: "16:00" }] },
      friday: { status: "open", slots: [{ open: "07:30", close: "16:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "dropshipping", "liquidation"],
    supplierType: ["trading-company"],
    productQualityTier: ["mid-range"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=KZ&background=9b59b6&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "market-trader"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["ce"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 6,
    minimumOrderCurrency: "GBP",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["national-post", "own-fleet"],
    leadTime: "1-2-days",
    countriesServed: ["GB", "DE", "FR"],
    facilitySize: 7000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2019,
    preferredCurrency: "GBP",
    sampleAvailability: "paid",
    salutation: "Mr",
  },
  {
    id: 8,
    slug: "megapallets-bv",
    companyName: "MegaPallets BV",
    rating: 3.9,
    reviewCount: 9,
    yearsActive: 3,
    isVerified: false,
    companyDescription: "Pallet and stocklot liquidator based in the Netherlands. We deal in customer returns, overstock, and end-of-line goods from major European retailers. Mixed pallets and sorted category pallets available.",
    contact: {
      name: "Jan de Vries",
      roleInCompany: "Sales Manager",
      mobileNumber: "+31201234567",
      businessEmail: "buy@megapallets.nl",
    },
    address: {
      street: "Industrieweg 88",
      city: "Amsterdam",
      postalCode: "1099 AB",
      country: "Netherlands",
      countryCode: "nl",
    },
    companyWebsite: "www.megapallets.nl",
    categories: ["Surplus & Stocklots", "Consumer Electronics", "Apparel & Clothing"],
    productsOffered: "Mixed Pallets, Sorted Pallets, Customer Returns, Overstock",
    brandsDistributed: [],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:00", close: "17:00" }] },
      tuesday: { status: "open", slots: [{ open: "08:00", close: "17:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "17:00" }] },
      thursday: { status: "open", slots: [{ open: "08:00", close: "17:00" }] },
      friday: { status: "open", slots: [{ open: "08:00", close: "17:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["liquidation", "wholesale"],
    supplierType: ["liquidator"],
    productQualityTier: ["budget", "mid-range"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=MP&background=3498db&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "wholesaler-reseller"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: [],
    catalogueSize: "5000-20000",
    minimumOrderAmount: 1000,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card"],
    deliveryMethods: ["dhl", "ups", "pallet-delivery"],
    leadTime: "1-2-weeks",
    countriesServed: ["NL", "DE", "BE", "FR"],
    facilitySize: 10000,
    facilitySizeUnit: "m²",
    companySize: "10-50",
    yearEstablished: 2023,
    preferredCurrency: "EUR",
    sampleAvailability: "not-available",
    salutation: "Mr",
  },
  {
    id: 9,
    slug: "iberian-office-supplies-sl",
    companyName: "Iberian Office Supplies SL",
    rating: 4.4,
    reviewCount: 14,
    yearsActive: 11,
    isVerified: true,
    companyDescription: "Office and business supplies wholesaler serving the Iberian Peninsula and wider Europe. Full range of stationery, printing supplies, office furniture, and tech accessories. Same-day dispatch on in-stock items.",
    contact: {
      name: "Carlos Ruiz",
      roleInCompany: "Export Manager",
      mobileNumber: "+34911234567",
      businessEmail: "ventas@iberianoffice.es",
    },
    address: {
      street: "Calle Gran Vía 28",
      city: "Madrid",
      postalCode: "28013",
      country: "Spain",
      countryCode: "es",
    },
    companyWebsite: "www.iberianoffice.es",
    categories: ["Office & Business", "Computing"],
    productsOffered: "Stationery, Printers & Ink, Office Furniture, Filing Supplies",
    brandsDistributed: ["HP", "Canon", "Fellowes", "Rexel"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "09:00", close: "18:00" }] },
      tuesday: { status: "open", slots: [{ open: "09:00", close: "18:00" }] },
      wednesday: { status: "open", slots: [{ open: "09:00", close: "18:00" }] },
      thursday: { status: "open", slots: [{ open: "09:00", close: "18:00" }] },
      friday: { status: "open", slots: [{ open: "09:00", close: "18:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "white-label"],
    supplierType: ["exporter", "manufacturer"],
    productQualityTier: ["premium"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=IOS&background=16a085&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    customersServed: ["registered-companies"],
    certifications: ["iso-9001"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 150,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["dhl", "fedex", "ups"],
    leadTime: "1-2-days",
    countriesServed: ["ES", "PT", "FR", "IT"],
    facilitySize: 3500,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2015,
    preferredCurrency: "EUR",
    sampleAvailability: "free",
    salutation: "Mr",
  },
  {
    id: 10,
    slug: "roma-fashion-italia",
    companyName: "Roma Fashion Italia",
    rating: 4.9,
    reviewCount: 37,
    yearsActive: 15,
    isVerified: true,
    companyDescription: "Premium Italian fashion wholesaler offering authentic Made in Italy clothing, leather goods, shoes, and accessories. Direct from Italian manufacturers and ateliers. Specialising in luxury and mid-range fashion brands. We work directly with over 60 Italian artisan workshops and fashion houses to bring you exclusive collections that cannot be found through mainstream wholesale channels. Each season we curate a hand-selected range of leather jackets, silk scarves, handcrafted shoes, and designer handbags with full certificates of authenticity. Our export team handles all customs documentation and VAT reclaim paperwork for non-EU buyers, making international trade seamless.",
    contact: {
      name: "Giulia Rossi",
      roleInCompany: "International Sales",
      mobileNumber: "+390612345678",
      businessEmail: "export@romafashion.it",
    },
    address: {
      street: "Via del Corso 120",
      city: "Rome",
      postalCode: "00186",
      country: "Italy",
      countryCode: "it",
    },
    companyWebsite: "www.romafashion.it",
    categories: ["Apparel & Clothing", "Jewellery & Watches"],
    productsOffered: "Designer Clothing, Leather Goods, Shoes, Handbags, Accessories",
    brandsDistributed: ["Gucci", "Prada", "Armani", "Versace"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      tuesday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      wednesday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      thursday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      friday: { status: "open", slots: [{ open: "09:00", close: "17:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "private-label"],
    supplierType: ["wholesaler", "distributor"],
    productQualityTier: ["luxury"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=RFI&background=c0392b&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: [],
    catalogueSize: "200-1000",
    minimumOrderAmount: 500,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "letter-of-credit"],
    deliveryMethods: ["dhl", "fedex", "ups", "freight"],
    leadTime: "2-4-weeks",
    countriesServed: ["IT", "EU", "US"],
    facilitySize: 2500,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2011,
    preferredCurrency: "EUR",
    sampleAvailability: "paid",
    salutation: "Ms",
  },
  {
    id: 11,
    slug: "warsaw-electronics-hub",
    companyName: "Warsaw Electronics Hub Sp. z o.o.",
    rating: 4.1,
    reviewCount: 11,
    yearsActive: 5,
    isVerified: false,
    companyDescription: "Central European electronics wholesaler based in Warsaw. Competitive pricing on smartphones, tablets, audio equipment, and computer peripherals. Fast shipping across EU with full warranty support.",
    contact: {
      name: "Tomasz Kowalski",
      roleInCompany: "CEO",
      mobileNumber: "+48221234567",
      businessEmail: "sales@warsawehub.pl",
    },
    address: {
      street: "Ul. Marszałkowska 56",
      city: "Warsaw",
      postalCode: "00-545",
      country: "Poland",
      countryCode: "pl",
    },
    companyWebsite: "www.warsawehub.pl",
    categories: ["Consumer Electronics", "Mobile & Home Phones", "Computing"],
    productsOffered: "Smartphones, Tablets, Headphones, Speakers, Computer Parts",
    brandsDistributed: ["Samsung", "Xiaomi", "JBL", "Logitech"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      tuesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      thursday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      friday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "dropshipping"],
    supplierType: ["importer"],
    productQualityTier: ["mid-range"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=WEH&background=2980b9&color=fff&size=96&bold=true",
    buyerTypesServed: ["online-retailer", "shop-retailer", "dropshipper"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["ce", "rohs"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 300,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["dhl", "ups", "own-fleet"],
    leadTime: "2-4-weeks",
    countriesServed: ["PL", "DE", "CZ", "SK"],
    facilitySize: 5500,
    facilitySizeUnit: "m²",
    companySize: "10-50",
    yearEstablished: 2021,
    preferredCurrency: "EUR",
    sampleAvailability: "on-request",
    salutation: "Mr",
  },
  {
    id: 12,
    slug: "activelife-sports-distribution-ltd",
    companyName: "ActiveLife Sports Distribution Ltd",
    rating: 4.5,
    reviewCount: 20,
    yearsActive: 6,
    isVerified: true,
    companyDescription: "Sports and fitness equipment wholesaler. Covering gym equipment, outdoor gear, cycling accessories, running shoes, and athletic wear. Authorised distributor for multiple premium sports brands.",
    contact: {
      name: "Emma Clarke",
      roleInCompany: "Wholesale Manager",
      mobileNumber: "+4401234567890",
      businessEmail: "trade@activelifesports.co.uk",
    },
    address: {
      street: "25 Olympic Way",
      city: "Leeds",
      postalCode: "LS1 4AP",
      country: "United Kingdom",
      countryCode: "gb",
    },
    companyWebsite: "www.activelifesports.co.uk",
    categories: ["Sports & Fitness", "Apparel & Clothing"],
    productsOffered: "Gym Equipment, Running Shoes, Cycling Gear, Athletic Wear, Fitness Accessories",
    brandsDistributed: ["Nike", "Adidas", "Under Armour", "Puma", "New Balance"],
    businessHours: {
      sunday: { status: "open", slots: [{ open: "10:00", close: "16:00" }] },
      monday: { status: "open", slots: [{ open: "07:00", close: "16:00" }] },
      tuesday: { status: "open", slots: [{ open: "07:00", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "07:00", close: "16:00" }] },
      thursday: { status: "open", slots: [{ open: "07:00", close: "16:00" }] },
      friday: { status: "open", slots: [{ open: "07:00", close: "16:00" }] },
      saturday: { status: "open", slots: [{ open: "08:00", close: "14:00" }] },
    },
    supplyModels: ["wholesale", "dropshipping", "job-lots"],
    supplierType: ["distributor", "dropshipper"],
    productQualityTier: ["mid-range", "premium"],
    isSupplierPro: false,
    companyLogo: "https://ui-avatars.com/api/?name=ALS&background=27ae60&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "market-trader"],
    customersServed: ["registered-companies", "sole-traders", "individuals"],
    certifications: ["iso-9001"],
    catalogueSize: "1000-5000",
    minimumOrderAmount: 50,
    minimumOrderCurrency: "GBP",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit"],
    deliveryMethods: ["dhl", "national-post", "own-fleet"],
    leadTime: "1-2-days",
    countriesServed: ["GB", "DE", "FR", "NL"],
    facilitySize: 4000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2020,
    preferredCurrency: "GBP",
    sampleAvailability: "free",
    salutation: "Ms",
  },
  {
    id: 13,
    slug: "eurogourmet-trading-gmbh",
    companyName: "EuroGourmet Trading GmbH",
    rating: 4.9,
    reviewCount: 31,
    yearsActive: 12,
    isVerified: true,
    companyDescription: "Specialist wholesale supplier of premium European food and beverages. We source directly from artisan producers across Italy, France, Spain, and Austria, offering authentic olive oils, aged cheeses, cured meats, fine wines, craft beers, and gourmet confectionery. Our temperature-controlled warehouse in Vienna serves retailers, delicatessens, hotels, and online food shops throughout Europe with next-day chilled delivery to 14 countries. All products carry full traceability documentation and EU food safety certification. We also offer private-label packaging for retailers wanting own-brand premium ranges.",
    contact: {
      name: "Maximilian Hofer",
      roleInCompany: "Head of Sales",
      mobileNumber: "+4315551234",
      businessEmail: "wholesale@eurogourmet.at",
    },
    address: {
      street: "Handelskai 94, 1200",
      city: "Vienna",
      postalCode: "1200",
      country: "Austria",
      countryCode: "at",
    },
    companyWebsite: "www.eurogourmet-trading.at",
    categories: ["Food & Beverages", "Health & Beauty", "Home Supplies"],
    productsOffered: "Olive Oils, Artisan Cheeses, Cured Meats, Fine Wines, Craft Beer, Gourmet Confectionery, Organic Pantry Staples",
    brandsDistributed: ["De Cecco", "Lavazza", "Riedel", "Staud's"],
    businessHours: {
      sunday: { status: "closed", slots: [] },
      monday: { status: "open", slots: [{ open: "07:30", close: "17:00" }] },
      tuesday: { status: "open", slots: [{ open: "07:30", close: "17:00" }] },
      wednesday: { status: "open", slots: [{ open: "07:30", close: "17:00" }] },
      thursday: { status: "open", slots: [{ open: "07:30", close: "17:00" }] },
      friday: { status: "open", slots: [{ open: "07:30", close: "17:00" }] },
      saturday: { status: "closed", slots: [] },
    },
    supplyModels: ["wholesale", "private-label", "white-label"],
    supplierType: ["importer", "distributor"],
    productQualityTier: ["premium", "luxury"],
    isSupplierPro: true,
    companyLogo: "https://ui-avatars.com/api/?name=EG&background=1e5299&color=fff&size=96&bold=true",
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    customersServed: ["registered-companies", "sole-traders"],
    certifications: ["gmp", "haccp", "organic", "iso-9001"],
    catalogueSize: "200-1000",
    minimumOrderAmount: 400,
    minimumOrderCurrency: "EUR",
    paymentMethods: ["bank-transfer", "credit-debit-card", "trade-credit", "letter-of-credit"],
    deliveryMethods: ["dhl", "fedex", "ups", "freight"],
    leadTime: "1-2-weeks",
    countriesServed: ["AT", "DE", "IT", "FR", "ES"],
    facilitySize: 8000,
    facilitySizeUnit: "m²",
    companySize: "50-100",
    yearEstablished: 2014,
    preferredCurrency: "EUR",
    sampleAvailability: "paid",
    salutation: "Mr",
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
const SUPPLY_MODEL_LABELS = { wholesale: "Wholesale", dropshipping: "Dropshipping", liquidation: "Liquidation", "white-label": "White Label", "private-label": "Private Label", "job-lots": "Job Lots" };
const SUPPLIER_TYPE_LABELS = { manufacturer: "Manufacturer", "brand-owner": "Brand Owner", "private-label": "Private / White Label", wholesaler: "Wholesaler", distributor: "Distributor", importer: "Importer", exporter: "Exporter", "trading-company": "Trading Company", liquidator: "Liquidator / Clearance", dropshipper: "Dropshipper", "sourcing-agent": "Sourcing Agent", "artisan-maker": "Artisan / Maker" };
const QUALITY_LABELS = { budget: "Budget / Value", "mid-range": "Mid-Range", premium: "Premium", luxury: "Luxury" };

/* ── Anonymous display name for non-authorised users ──
   Generates "Category + Supplier Type", e.g. "Home & Garden Wholesaler"
   Falls back to first category or "Supplier" if data is missing. */
function getAnonymousName(supplier) {
  const rawCat = supplier.productCategories?.[0] || supplier.categories?.[0] || "";
  // Convert slugs like "mobile-phones" → "Mobile Phones"
  const firstCat = rawCat.includes("-") ? rawCat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : rawCat;
  const types = supplier.supplierType || [];
  const typeLabel = types.length > 0
    ? types.map((st) => SUPPLIER_TYPE_LABELS[st] || st).join(" & ")
    : "Supplier";
  // Strip trailing " Supplier" or " Lots" from category names
  const cleanCat = firstCat.replace(/\s+(Supplier|Lots)$/i, "");
  return cleanCat ? `${cleanCat} ${typeLabel}` : typeLabel;
}

/* ═══════════════════════════════════════════════════
   1. SUPPLIER CARD — used in the suppliers listing page
   ═══════════════════════════════════════════════════ */
function SupplierCard({ supplier, isPremium = false, isLoggedIn = false, onContact, onCallNow, onReportInvalid, keyword }) {
  const canContact = isPremium || (isLoggedIn && supplier.isSupplierPro);
  const canViewBranding = isLoggedIn && (supplier.isSupplierPro || isPremium);
  const displayName = canViewBranding && supplier.companyName ? supplier.companyName : getAnonymousName(supplier);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(null);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  const copyToClipboard = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white cursor-pointer ${
      supplier.isSupplierPro
        ? "border-l-[3px] border-l-[#1e5299] border border-[#1e5299]/30 hover:border-[#1e5299]/50"
        : "border border-slate-200 hover:border-orange-200"
    }`} onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/supplier"; }}>
      {/* Supplier Pro badge */}
      {supplier.isSupplierPro && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-[#1e5299] text-white text-[10px] font-bold rounded-md shadow-sm">
          <Crown size={10} className="shrink-0" />
          PRO
        </div>
      )}

      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Supplier hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={12} /> Unhide
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          {/* Company Logo — visible only when canViewBranding is true (isLoggedIn && (isSupplierPro || isPremium)) */}
          {supplier.companyLogo && canViewBranding && (
            <img src={supplier.companyLogo} alt={`${displayName} logo`} className="h-12 w-12 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0 mt-0.5" />
          )}
          {supplier.companyLogo && !canViewBranding && (
            <LockedLogoPlaceholder
              size="lg"
              href={isLoggedIn ? "/pricing" : undefined}
              onClick={!isLoggedIn ? (e) => { e.preventDefault(); openRegisterModal(); } : undefined}
              title={isLoggedIn ? "Upgrade to see supplier branding" : "Register to see supplier branding"}
              className="mt-0.5"
            />
          )}
          <div className="flex-1 min-w-0">
            {supplier.isVerified && (
              <div className="mb-1.5">
                <VerifiedBadge size={8} className="text-[9px] px-1.5 py-px" />
              </div>
            )}
            <a href="/supplier" className="group/name">
              <h3 className="text-lg font-bold text-slate-900 group-hover/name:text-orange-600 transition-colors">
                {displayName}
              </h3>
            </a>
            {(supplier.supplierType?.length > 0 || supplier.productQualityTier?.length > 0) && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {supplier.supplierType?.map((st) => (
                  <span key={st} className="px-1.5 py-px text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                    {SUPPLIER_TYPE_LABELS[st] || st}
                  </span>
                ))}
                {supplier.productQualityTier?.map((qt) => (
                  <span key={qt} className="px-1.5 py-px text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
                    {QUALITY_LABELS[qt] || qt}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <FlagImg code={supplier.address.countryCode} size={18} />
                {supplier.address.country}
              </span>
              <span className="text-slate-300">&middot;</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar size={12} />
                {supplier.yearsActive} yrs
              </span>
              <span className="text-slate-300">&middot;</span>
              <a href="/supplier?tab=reviews" className="hover:opacity-80 transition-opacity">
                <StarRating rating={supplier.rating} size={13} showValue />
              </a>
            </div>
            {/* Supply model tags — Wholesale, Dropshipping, White Label, etc. */}
            {supplier.supplyModels?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {supplier.supplyModels.map((f) => (
                  <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                    <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
                    {SUPPLY_MODEL_LABELS[f] || f}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Hide + Favourite + Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1 transition-all ${faved || hidden ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              <button onClick={() => isLoggedIn ? setHidden(true) : openRegisterModal()}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <EyeOff size={14} className="text-slate-400" />
              </button>
              <button onClick={() => isLoggedIn ? setFaved(!faved) : openRegisterModal()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${faved ? "bg-red-500 shadow-sm hover:bg-red-600" : "bg-slate-100 hover:bg-slate-200"}`}>
                <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
              </button>
            </div>
            {canContact ? (
              <button onClick={() => onCallNow?.(supplier)} className="px-5 py-2.5 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Phone size={15} /> Call Now
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="px-5 py-2.5 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Lock size={15} /> Call Now
              </a>
            ) : (
              <button onClick={openRegisterModal} className="px-5 py-2.5 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Phone size={15} /> Call Now
              </button>
            )}
            {canContact ? (
              <button onClick={() => onContact?.(supplier)} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1e5299] hover:bg-[#174280] rounded-lg flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={15} />
                Send Enquiry
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Lock size={15} />
                Send Enquiry
              </a>
            ) : (
              <button onClick={openRegisterModal} className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={15} />
                Send Enquiry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tags */}
      <div className="px-5 pt-3.5 pb-0">
        <div className="flex flex-wrap gap-2">
          {supplier.categories.slice(0, 4).map((cat) => (
            <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`} className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 4 && (
            <span className="px-3.5 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
              +{supplier.categories.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 pt-4">
        {/* Description */}
        <div className="mb-5">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
          <div
            className="text-sm text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-line"
            style={{ maxHeight: "5.6em" }}
          >
            <HighlightedText text={supplier.companyDescription.replace(/\n\n+/g, "\n")} keyword={keyword} />
            {supplier.productsOffered && (
              <p className="mt-2"><HighlightedText text={supplier.productsOffered} keyword={keyword} /></p>
            )}
            {supplier.brandsDistributed?.length > 0 && (
              <p className="mt-2"><HighlightedText text={supplier.brandsDistributed.join(", ")} keyword={keyword} /></p>
            )}
          </div>
        </div>

        {/* Contact Details — mini business card for Premium, clean lock card for gated */}
        {canContact ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Card header — contact person identity */}
            <div className="px-3.5 py-2 bg-gradient-to-r from-blue-50 to-slate-50 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-white">
                  {supplier.contact.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </span>
              </div>
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 truncate">{supplier.contact.name}</span>
                {supplier.contact.roleInCompany && (
                  <span className="text-[11px] text-slate-400 truncate hidden sm:inline">&middot; {supplier.contact.roleInCompany}</span>
                )}
              </div>
            </div>
            {/* Card body — contact details row */}
            <div className="px-3.5 py-2.5 flex items-center gap-x-5 gap-y-1.5 flex-wrap text-xs bg-white">
              {supplier.contact.mobileNumber && (
                <div className="flex items-center gap-1.5">
                  <Phone size={11} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600">{supplier.contact.mobileNumber}</span>
                  <button onClick={() => copyToClipboard(supplier.contact.mobileNumber, "phone")} className="p-0.5 hover:bg-slate-100 rounded transition-colors inline-flex">
                    {copied === "phone" ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="text-slate-400" />}
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Mail size={11} className="text-slate-400 shrink-0" />
                <button onClick={() => onContact?.(supplier)} className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                  Contact Supplier
                </button>
              </div>
              {supplier.address?.street && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600">{[supplier.address.street, supplier.address.postalCode, supplier.address.city].filter(Boolean).join(", ")}</span>
                </div>
              )}
              {supplier.companyWebsite && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Globe size={11} className="text-slate-400 shrink-0" />
                  <WebsiteLink slug={supplier.slug} url={"https://" + supplier.companyWebsite} className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    Visit Website <ExternalLink size={10} />
                  </WebsiteLink>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-50 py-5 text-center">
            <Lock size={18} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 mb-3">
              {isLoggedIn ? "Contact details available to Premium members" : "Contact details available to registered members"}
            </p>
            {isLoggedIn ? (
              <a href="/pricing" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Rocket size={13} /> Upgrade Now
              </a>
            ) : (
              <button onClick={openRegisterModal} className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Lock size={13} /> Log In / Register
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   1b. SUPPLIER GRID CARD — compact card for grid view
   ═══════════════════════════════════════════════════ */
function SupplierGridCard({ supplier, isPremium = false, isLoggedIn = false, onContact, onCallNow, keyword }) {
  const canContact = isPremium || (isLoggedIn && supplier.isSupplierPro);
  const canViewBranding = isLoggedIn && (supplier.isSupplierPro || isPremium);
  const displayName = canViewBranding && supplier.companyName ? supplier.companyName : getAnonymousName(supplier);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className={`relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group bg-white cursor-pointer ${
      supplier.isSupplierPro
        ? "border-l-[3px] border-l-[#1e5299] border border-[#1e5299]/30 hover:border-[#1e5299]/50"
        : "border border-slate-200 hover:border-orange-200"
    }`} onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/supplier"; }}>
      {/* Supplier Pro badge */}
      {supplier.isSupplierPro && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-[#1e5299] text-white text-[10px] font-bold rounded-md shadow-sm">
          <Crown size={10} className="shrink-0" />
          PRO
        </div>
      )}

      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={24} className="text-slate-300" />
          <p className="text-xs font-semibold text-slate-500">Supplier hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={10} /> Unhide
          </button>
        </div>
      )}

      {/* Header band */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          {/* Company Logo — visible only when canViewBranding is true */}
          {supplier.companyLogo && canViewBranding && (
            <img src={supplier.companyLogo} alt={`${displayName} logo`} className="h-10 w-10 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0 mt-0.5" />
          )}
          {supplier.companyLogo && !canViewBranding && (
            <LockedLogoPlaceholder
              size="sm"
              href={isLoggedIn ? "/pricing" : undefined}
              onClick={!isLoggedIn ? (e) => { e.preventDefault(); openRegisterModal(); } : undefined}
              title={isLoggedIn ? "Upgrade to see supplier branding" : "Register to see supplier branding"}
              className="mt-0.5"
            />
          )}
          <div className="flex-1 min-w-0">
            {supplier.isVerified && (
              <div className="mb-1.5">
                <VerifiedBadge size={8} className="text-[9px] px-1.5 py-px" />
              </div>
            )}
            <a href="/supplier" className="group/name">
              <h3 className="text-[15px] font-bold text-slate-800 group-hover/name:text-orange-600 transition-colors line-clamp-2 leading-snug">
                {displayName}
              </h3>
            </a>
          </div>
        </div>
        {(supplier.supplierType?.length > 0 || supplier.productQualityTier?.length > 0) && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {supplier.supplierType?.map((st) => (
              <span key={st} className="px-1.5 py-px text-[9px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                {SUPPLIER_TYPE_LABELS[st] || st}
              </span>
            ))}
            {supplier.productQualityTier?.map((qt) => (
              <span key={qt} className="px-1.5 py-px text-[9px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md">
                {QUALITY_LABELS[qt] || qt}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <FlagImg code={supplier.address.countryCode} size={14} />
            {supplier.address.country}
          </span>
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar size={10} />
            {supplier.yearsActive} yrs
          </span>
          <span className="text-slate-300">&middot;</span>
          <a href="/supplier?tab=reviews" className="hover:opacity-80 transition-opacity">
            <StarRating rating={supplier.rating} size={10} showValue />
          </a>
          {/* Hide + Favourite — appear on hover, right of rating */}
          <div className={`flex items-center gap-1 ml-auto shrink-0 transition-all ${faved || hidden ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={() => isLoggedIn ? setHidden(true) : openRegisterModal()}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <EyeOff size={11} className="text-slate-400" />
            </button>
            <button onClick={() => isLoggedIn ? setFaved(!faved) : openRegisterModal()}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${faved ? "bg-red-500 shadow-sm hover:bg-red-600" : "bg-slate-100 hover:bg-slate-200"}`}>
              <Heart size={11} className={faved ? "fill-white text-white" : "text-slate-400"} />
            </button>
          </div>
        </div>
        {/* Supply model tags */}
        {supplier.supplyModels?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {supplier.supplyModels.map((f) => (
              <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
                {SUPPLY_MODEL_LABELS[f] || f}
              </span>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2 mt-3">
          {canContact ? (
            <button onClick={() => onCallNow?.(supplier)} className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Phone size={11} /> Call Now
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Lock size={11} /> Call Now
            </a>
          ) : (
            <button onClick={openRegisterModal} className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Phone size={11} /> Call Now
            </button>
          )}
          {canContact ? (
            <button onClick={() => onContact?.(supplier)} className="flex-1 py-2 text-sm font-semibold text-white bg-[#1e5299] hover:bg-[#174280] rounded-lg flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <MessageSquare size={11} />
              Send Enquiry
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="flex-1 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Lock size={11} />
              Send Enquiry
            </a>
          ) : (
            <button onClick={openRegisterModal} className="flex-1 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <MessageSquare size={11} />
              Send Enquiry
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.categories.slice(0, 2).map((cat) => (
            <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`} className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 2 && (
            <span className="px-2 py-0.5 text-[10px] text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
              +{supplier.categories.length - 2}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
          <div
            className="text-xs text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-line"
            style={{ height: "10.5em" }}
          >
            <HighlightedText text={supplier.companyDescription.replace(/\n\n+/g, "\n")} keyword={keyword} />
            {supplier.productsOffered && (
              <p className="mt-2"><HighlightedText text={supplier.productsOffered} keyword={keyword} /></p>
            )}
            {supplier.brandsDistributed?.length > 0 && (
              <p className="mt-2"><HighlightedText text={supplier.brandsDistributed.join(", ")} keyword={keyword} /></p>
            )}
          </div>
        </div>

        {/* Contact & Address footer — mini business card */}
        <div className="mt-auto">
          {canContact ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Mini header — contact person */}
              <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-slate-50 flex items-center gap-2">
                <div className="w-5.5 h-5.5 w-[22px] h-[22px] rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white">
                    {supplier.contact.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 truncate">{supplier.contact.name}</span>
                {supplier.contact.roleInCompany && (
                  <span className="text-[10px] text-slate-400 truncate hidden sm:inline">&middot; {supplier.contact.roleInCompany}</span>
                )}
              </div>
              {/* Contact rows */}
              <div className="px-3 py-2 space-y-1 text-[11px] bg-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Phone size={10} className="text-slate-400 shrink-0" />
                    <span className="text-slate-600 truncate">{supplier.contact.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Globe size={10} className="text-slate-400" />
                    <WebsiteLink slug={supplier.slug} url={"https://" + supplier.companyWebsite} className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                      Website <ExternalLink size={9} />
                    </WebsiteLink>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={10} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500 truncate">{[supplier.address.street, supplier.address.postalCode, supplier.address.city].filter(Boolean).join(", ")}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 py-4 text-center">
              <Lock size={16} className="text-slate-300 mx-auto mb-1.5" />
              <p className="text-[11px] text-slate-400 mb-2.5">
                {isLoggedIn ? "Contact details available to Premium members" : "Contact details available to registered members"}
              </p>
              {isLoggedIn ? (
                <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <Rocket size={12} /> Upgrade Now
                </a>
              ) : (
                <button onClick={openRegisterModal} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                  <Lock size={12} /> Log In / Register
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. SUPPLIER CONTACT PANEL — right sidebar on deal/supplier pages
   ═══════════════════════════════════════════════════ */
function SupplierContactPanel({ supplier, isPremium = false, isLoggedIn = false }) {
  const canContact = isPremium || (isLoggedIn && supplier.isSupplierPro);
  const canViewBranding = isLoggedIn && (supplier.isSupplierPro || isPremium);
  const displayName = canViewBranding && supplier.companyName ? supplier.companyName : getAnonymousName(supplier);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const currentDay = now.getDay();
  const isOpenToday = getOpenDays(supplier.businessHours)[currentDay];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {supplier.isVerified && <VerifiedBadge />}
        </div>
        <h3 className="text-sm font-bold text-slate-900">{displayName}</h3>
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {supplier.categories.slice(0, 3).map((cat) => (
            <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`} className="px-2 py-1 text-[10px] font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors">
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
              <FlagImg code={supplier.address.countryCode} size={14} /> {supplier.address.country}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">City:</span>
            <BlurredText text={supplier.address.city} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Postal Code:</span>
            <BlurredText text={supplier.address.postalCode} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Street:</span>
            <BlurredText text={supplier.address.street} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Website:</span>
            {canContact ? (
              <WebsiteLink slug={supplier.slug} url={"https://" + supplier.companyWebsite} className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                {supplier.companyWebsite} <ExternalLink size={10} />
              </WebsiteLink>
            ) : (
              <BlurredText text={supplier.companyWebsite} isPremium={canContact} className="text-slate-700 font-medium" />
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
            <BlurredText text={supplier.contact.name} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Position:</span>
            <BlurredText text={supplier.contact.roleInCompany} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Phone Number:</span>
            <BlurredText text={supplier.contact.mobileNumber} isPremium={canContact} className="text-slate-700 font-medium" />
          </div>
        </div>
        {!canContact && (
          <button className="w-full mt-3 px-3 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5">
            <Eye size={12} />
            Show Details
          </button>
        )}
      </div>

      {/* Opening Hours */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Opening hours</h4>
        <p className="text-sm font-semibold text-slate-800 mb-3">{getOpeningHours(supplier.businessHours)}</p>
        <div className="flex items-center gap-1.5">
          {DAY_LABELS.map((day, i) => (
            <div
              key={day}
              className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                i === currentDay
                  ? getOpenDays(supplier.businessHours)[i]
                    ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200"
                    : "bg-red-500 text-white shadow-sm ring-2 ring-red-200"
                  : getOpenDays(supplier.businessHours)[i]
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
        {canContact ? (
          <>
            <button className="w-full py-2.5 text-sm font-bold text-white bg-[#1e5299] hover:bg-[#174280] rounded-lg flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Send size={13} />
              Send Enquiry
            </button>
            <div className="flex gap-2">
              <a href={"/supplier"} className="flex-1 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-center">
                View Profile
              </a>
              <a href={"/supplier"} className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
                View All Deals
              </a>
            </div>
          </>
        ) : isLoggedIn ? (
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            <Rocket size={14} />
            Upgrade Now
          </a>
        ) : (
          <button
            onClick={openRegisterModal}
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            <Lock size={14} />
            Join Now!
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SUPPLIER PROFILE PAGE — single-supplier.html
   ═══════════════════════════════════════════════════ */
function SupplierProfilePage({ supplier, isPremium = false, isPremiumPlus = false, isLoggedIn = false }) {
  const [activeTab, setActiveTab] = useState("about");
  // Review tab is Premium+-only (not Premium). isPremiumPlus = premium-plus | supplier-premium.
  const canAccessReviews = isLoggedIn && isPremiumPlus;

  return (
    <div className="flex gap-6 items-start">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-b from-slate-50 to-white px-6 py-5 border-b border-slate-100">
            <h1 className="text-xl font-extrabold text-slate-800">{supplier.companyName}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {supplier.isVerified && <VerifiedBadge />}
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <FlagImg code={supplier.address.countryCode} size={16} /> {supplier.address.country}
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
                    ? "text-orange-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
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
                  <p className="text-sm text-slate-600 leading-relaxed">{supplier.companyDescription}</p>
                </div>

                {/* Products Distributed */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package size={13} className="text-orange-500" />
                    Products Distributed by This Supplier
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(Array.isArray(supplier.productsOffered) ? supplier.productsOffered : [supplier.productsOffered])
                      .flatMap(p => p.split(",").map(s => s.trim())).filter(Boolean)
                      .map((item) => (
                        <a key={item} href={`/suppliers?any=${encodeURIComponent(item)}`} className="inline-flex items-center px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-md hover:bg-sky-100 hover:border-sky-300 transition-colors cursor-pointer">
                          {item}
                        </a>
                      ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Tag size={13} className="text-orange-500" />
                    Brands Distributed by This Supplier
                  </h3>
                  {supplier.brandsDistributed.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supplier.brandsDistributed.map((brand) => (
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
                    <Sparkles size={13} className="text-orange-500" />
                    Focus
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {supplier.supplyModels.map((f) => (
                      <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                        <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                        {SUPPLY_MODEL_LABELS[f] || f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              canAccessReviews ? (
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
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
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
              ) : (
                /* ── GATED STATE — PLACEHOLDER DATA ONLY ──
                   Blurred placeholder + lock overlay, matching supplier.jsx pattern.
                   Real review data is never rendered when gated. */
                <div className="relative overflow-hidden min-h-[280px]">
                  <div className="select-none pointer-events-none" style={{ filter: "blur(8px)", opacity: 0.35 }}>
                    <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                      <div className="text-center">
                        <span className="text-3xl font-extrabold text-slate-900">4.2</span>
                        <p className="text-xs text-slate-400 mt-0.5">out of 5</p>
                      </div>
                      <div>
                        <StarRating rating={4.2} size={14} />
                        <p className="text-sm text-slate-500 mt-1">Based on 12 sources</p>
                      </div>
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
      </div>

      {/* Right Sidebar — Contact Panel */}
      <div className="w-80 shrink-0 hidden lg:block">
        <SupplierContactPanel supplier={supplier} isPremium={isPremium} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 4 Full Layout
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   SUPPLIER SEARCH BAR
   ═══════════════════════════════════════════════════ */
function SupplierSearchBar() {
  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = ["All Categories", "Baby Products", "Clothing", "Computing", "Consumer Electronics", "Health & Beauty", "Home & Garden", "Jewellery & Watches", "Mobile & Home Phones", "Office & Business", "Sports & Fitness", "Surplus & Stocklots", "Toys & Games"];

  return (
    <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div ref={catRef} className="relative shrink-0 border-r border-slate-200">
        <button onClick={() => setCatOpen(!catOpen)}
          className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)]">
          {category}
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
        </button>
        {catOpen && (
          <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[200px]">
            {categories.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setCatOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${category === c ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Search suppliers by name, product, brand..."
        className="flex-1 px-4 py-3 text-base text-slate-800 placeholder-slate-400 focus:outline-none min-w-0 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
      />
      <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shrink-0">
        <Search size={16} />
        <span className="text-sm font-semibold hidden sm:inline">Search</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — Suppliers Page
   ═══════════════════════════════════════════════════ */
function FollowButton() {
  const { isLoggedIn } = useDemoAuth();
  const [faved, setFaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

  const handleFav = () => {
    if (!isLoggedIn) { openRegisterModal(); return; }
    if (faved) {
      setFaved(false);
      setSubscribed(false);
    } else {
      setFaved(true);
    }
  };

  const handleSub = () => {
    if (!isLoggedIn) { openRegisterModal(); return; }
    setSubscribed(!subscribed);
  };

  return (
    <div className="shrink-0 relative flex items-center">
      {/* Tooltip — appears to the left of the pill, arrow pointing right */}
      {hoveredBtn && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-52 bg-white text-slate-700 text-xs leading-relaxed rounded-lg px-3 py-2.5 shadow-lg border border-slate-200 z-20 pointer-events-none">
          {hoveredBtn === "fav"
            ? (faved ? "Remove from favourites" : "Save to your favourites for quick access later")
            : (subscribed ? "Unsubscribe from email alerts" : "Get email alerts when new suppliers match your filters")}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-white" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-px w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-slate-200 -z-10" />
        </div>
      )}

      {/* Pill container */}
      <div className="inline-flex items-center border border-slate-200 rounded-full transition-all duration-300">
        {faved && (
          <>
            <button
              onClick={handleSub}
              onMouseEnter={() => setHoveredBtn("sub")}
              onMouseLeave={() => setHoveredBtn(null)}
              className={`w-9 h-9 flex items-center justify-center rounded-l-full transition-all ${
                subscribed
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "text-slate-400 hover:bg-slate-50 hover:text-orange-500"
              }`}
            >
              <Mail size={16} className={subscribed ? "text-white" : ""} />
            </button>
            <div className="w-px self-stretch my-1.5 bg-slate-200" />
          </>
        )}

        <button
          onClick={handleFav}
          onMouseEnter={() => setHoveredBtn("fav")}
          onMouseLeave={() => setHoveredBtn(null)}
          className={`w-9 h-9 flex items-center justify-center transition-all ${
            faved
              ? "bg-red-500 hover:bg-red-600 rounded-r-full"
              : "text-slate-400 hover:bg-slate-50 hover:text-red-500 rounded-full"
          }`}
        >
          <Heart size={16} className={faved ? "fill-white text-white" : ""} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SEO CONTENT SECTION
   ═══════════════════════════════════════════════════ */
function SeoSection() {
  return (
    <div className="mt-10">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">Sports, hobbies &amp; leisure</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          The sports industry is a developing community. The notion of being fit is constantly growing in trend. Why not to make use of the demand for the accessories related to exercise to make more profit?
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Are you running an e-shop or let alone an online wholesale store that offers products related to some sport activity? Offer your customers even more types of products at a better price: describe the categories in your inventory. Most of us consider regular stocks of sports and leisure accessories. This way you can buy quality goods for a fraction of their full list value, and then sell them to a wider consumer base to increase revenue.
        </p>
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">Wholesale sporting goods - variety of offers</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          For sole proprietors, all sporting goods delivered to your party by wholesalers include a variety of products. These are often very common and/or automotive commodities that can be easily traded in both wholesale and retail to any end customer.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RELATED SEARCHES
   ═══════════════════════════════════════════════════ */
const SUPPLIER_RELATED_SEARCHES = [
  "Wholesale Clothing Suppliers", "Dropship Electronics", "Sportswear Wholesalers",
  "UK Wholesale Distributors", "Footwear Suppliers", "Bulk Beauty Products",
  "Wholesale Toys & Games", "Phone Accessories Wholesale", "Fashion Accessories Suppliers",
  "Home & Garden Wholesalers", "Wholesale Pet Supplies", "Jewellery Wholesalers",
];

function RelatedSearches() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
      <h3 className="text-lg font-extrabold text-slate-900 text-center mb-4">Related Searches</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {SUPPLIER_RELATED_SEARCHES.map((term) => (
          <a key={term} href={`/suppliers?any=${encodeURIComponent(term)}`} className="px-3 py-2 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-slate-100 transition-colors text-center">
            {term}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRUST / STATS SECTION
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

/* ─────────────────────────────────────────────────────────────
   🔧 PRODUCTION SEO — ItemList JSON-LD (schema.org/ItemList):
   When suppliers come from API, emit <script type="application/ld+json"> with:
   {
     "@context": "https://schema.org",
     "@type": "ItemList",
     "name": "Wholesale Suppliers",
     "numberOfItems": totalCount,
     "itemListElement": suppliers.map((s, i) => ({
       "@type": "ListItem",
       "position": i + 1 + (page - 1) * perPage,
       "url": `https://wholesaleup.com/suppliers/${s.slug}`,
       "item": {
         "@type": "LocalBusiness",
         "name": s.companyName || "Supplier",
         "address": { "@type": "PostalAddress", "addressCountry": s.countryCode },
         "aggregateRating": {
           "@type": "AggregateRating",
           "ratingValue": s.rating,
           "reviewCount": s.reviewCount
         }
       }
     }))
   }
   See SEO skill Section 5 & 12.3 for full guidance.
   See pricing.jsx FAQSection for working JSON-LD pattern.
   ─────────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────────
   🔧 PRODUCTION SEO — Pagination rel="next" / rel="prev":
   When paginated API results are live, add <Head> links:
     <link rel="prev" href="/suppliers?page={page-1}" />
     <link rel="next" href="/suppliers?page={page+1}" />
   Omit rel="prev" on page 1; omit rel="next" on last page.
   Also update canonical: /suppliers?page=N for page > 1.
   See SEO skill Section 12.2 for implementation checklist.
   ─────────────────────────────────────────────────────────── */
export default function Phase4Suppliers({ routeCategory = null, routeSubcategory = null, routeSupplierType = null }) {
  /* ── Auth state from DemoAuthContext ───────────────────────
     Supports both real NextAuth session AND demo dropdown overrides.
     Premium gating controls supplier contact info visibility.
     ─────────────────────────────────────────────────────────── */
  const { isLoggedIn, isPremium, isPremiumPlus, canViewSupplier } = useDemoAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── Read initial filter state from URL search params ── */
  const initialCategory = routeCategory || null;
  // Convert clean subcategory slug from route to composite filter ID (parentId--subId)
  const initialSubcategory = routeSubcategory && routeCategory ? `${routeCategory}--${routeSubcategory}` : null;
  /* Parse per-mode keyword params: ?any=nike,adidas&exact=dark+blue&all=long,laces
     Also supports legacy ?keywords= for backwards compatibility */
  const initialKeywords = (() => {
    const kws = [];
    const anyTerms = searchParams.get("any");
    const allTerms = searchParams.get("all");
    const exactTerms = searchParams.get("exact");
    const legacyTerms = searchParams.get("keywords");
    if (anyTerms) anyTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "any" }));
    if (allTerms) allTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "all" }));
    if (exactTerms) exactTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "exact" }));
    if (legacyTerms && kws.length === 0) legacyTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "any" }));
    return kws;
  })();
  const initialCountries = searchParams.get("countries") ? searchParams.get("countries").split(",").filter(Boolean) : [];
  const initialGrades = searchParams.get("grades") ? searchParams.get("grades").split(",").filter(Boolean) : [];
  // Supplier types: from route prop (single) OR query param (multi)
  const initialSupplierTypes = (() => {
    if (routeSupplierType) return [routeSupplierType];
    const fromParam = searchParams.get("supplierTypes") ? searchParams.get("supplierTypes").split(",").filter(Boolean) : [];
    return fromParam;
  })();
  const initialBuyerTypes = searchParams.get("buyerTypes") ? searchParams.get("buyerTypes").split(",").filter(Boolean) : [];

  const [listingMode, setListingMode] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCollapsed, toggleFilterCollapsed, setFilterCollapsed] = usePanelCollapse("wup-filter-collapsed");
  const [descExpanded, setDescExpanded] = useState(false);
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPageState] = useState(urlPage);
  const [perPage, setPerPage] = useState(9);

  // Sync page state when URL changes (browser back/forward)
  useEffect(() => {
    setPageState(urlPage);
  }, [urlPage]);

  // Track previous path to detect category/subcategory navigation
  const prevPathRef = useRef(typeof window !== "undefined" ? window.location.pathname : "/suppliers");

  // Sync category/subcategory when route props change (browser back/forward)
  useEffect(() => {
    const newCat = routeCategory || null;
    const newSub = routeSubcategory && routeCategory ? `${routeCategory}--${routeSubcategory}` : null;
    setFilters((prev) => {
      if (prev.category === newCat && prev.subcategory === newSub) return prev;
      return { ...prev, category: newCat, subcategory: newSub };
    });
    // Also update prevPathRef so the sync effect doesn't re-push
    let basePath = "/suppliers";
    if (newCat) {
      basePath = `/suppliers/${newCat}`;
      if (newSub) basePath = `${basePath}/${routeSubcategory}`;
    }
    prevPathRef.current = basePath;
  }, [routeCategory, routeSubcategory]);

  const setPage = useCallback((newPage) => {
    setPageState(newPage);
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }, [searchParams, router]);

  const buildPageHref = useCallback((n) => {
    const params = new URLSearchParams(searchParams.toString());
    if (n <= 1) { params.delete("page"); } else { params.set("page", String(n)); }
    const qs = params.toString();
    return qs ? `?${qs}` : window.location.pathname;
  }, [searchParams]);
  const [filters, setFilters] = useState({
    rating: null,
    category: initialCategory,
    subcategory: initialSubcategory,
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    countries: initialCountries,
    dropshipping: searchParams.get("dropshipping") === "true",
    grades: initialGrades,
    supplierTypes: initialSupplierTypes,
    buyerTypes: initialBuyerTypes,
    keywords: initialKeywords,
  });
  const [contactSupplier, setContactSupplier] = useState(null);
  const [phoneSupplier, setPhoneSupplier] = useState(null);
  const [reportInvalid, setReportInvalid] = useState(null); // { supplier, field }

  /* ── Dynamic page title — reflects active filters ──
     Pattern: "{keywords} {category} {supplierType(s)|Wholesale Suppliers} from {countries}"
     Examples:
       "Mens Clothing Wholesale Suppliers"
       "Mens Clothing Liquidators from United Kingdom"
       "Mens Clothing Liquidators and Importers from United Kingdom, Germany, France +2 more"
     ─────────────────────────────────────────────────── */
  const SUPPLIER_TYPE_LABELS = {
    manufacturer: "Manufacturers", "brand-owner": "Brand Owners", "private-label": "Private Label Suppliers",
    wholesaler: "Wholesalers", distributor: "Distributors", importer: "Importers", exporter: "Exporters",
    "trading-company": "Trading Companies", liquidator: "Liquidators", dropshipper: "Dropshippers",
    "sourcing-agent": "Sourcing Agents", "artisan-maker": "Artisan Makers",
  };
  const pageTitle = (() => {
    const keywordPrefix = filters.keywords?.length
      ? filters.keywords.map((kw) => typeof kw === "string" ? kw : kw.term).join(" ") + " "
      : "";
    // Category / subcategory prefix
    let catPrefix = "";
    if (filters.subcategory) {
      const subId = filters.subcategory.includes("--") ? filters.subcategory.split("--")[1] : filters.subcategory;
      catPrefix = getSubcategoryById(subId)?.sub?.label || "";
    } else if (filters.category) {
      catPrefix = getCategoryById(filters.category)?.name || "";
    }
    // Supplier type suffix — replaces "Wholesale Suppliers" when types are selected
    const types = filters.supplierTypes || [];
    let typeSuffix;
    if (types.length === 0) {
      typeSuffix = "Wholesale Suppliers";
    } else if (types.length === 1) {
      typeSuffix = SUPPLIER_TYPE_LABELS[types[0]] || "Wholesale Suppliers";
    } else {
      const labels = types.map((t) => SUPPLIER_TYPE_LABELS[t]).filter(Boolean);
      typeSuffix = labels.length <= 2
        ? labels.join(" and ")
        : labels.slice(0, 2).join(", ") + ` and ${labels[labels.length - 1]}`;
    }
    // Country suffix — "from {countries}"
    let countrySuffix = "";
    if (filters.countries?.length > 0) {
      const names = filters.countries.map((iso) => CANONICAL_COUNTRIES.find((c) => c.iso === iso)?.label || iso.toUpperCase()).filter(Boolean);
      if (names.length <= 3) {
        countrySuffix = " from " + (names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1]);
      } else {
        countrySuffix = ` from ${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
      }
    }
    return `${keywordPrefix}${catPrefix}${catPrefix ? " " : ""}${typeSuffix}${countrySuffix}`;
  })();

  /* ── Sync filter state → URL (SEO path segments for category) ──
     Category uses path segment: /suppliers/clothing-fashion
     All other filters remain as query params.
     ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams();
    // Category & subcategory go in the path, not query params
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.countries.length > 0) params.set("countries", filters.countries.join(","));
    if (filters.dropshipping) params.set("dropshipping", "true");
    if (filters.grades.length > 0) params.set("grades", filters.grades.join(","));
    // Single supplier type → path segment; multiple → query param
    if (filters.supplierTypes?.length > 1) params.set("supplierTypes", filters.supplierTypes.join(","));
    if (filters.buyerTypes?.length > 0) params.set("buyerTypes", filters.buyerTypes.join(","));
    /* Per-mode keyword params: ?any=nike,adidas&exact=dark+blue&all=long,laces */
    const kwByMode = { any: [], all: [], exact: [] };
    (filters.keywords || []).forEach((kw) => {
      const term = typeof kw === "string" ? kw : kw.term;
      const mode = typeof kw === "string" ? "any" : kw.mode;
      if (kwByMode[mode]) kwByMode[mode].push(term);
    });
    if (kwByMode.any.length > 0) params.set("any", kwByMode.any.join(","));
    if (kwByMode.all.length > 0) params.set("all", kwByMode.all.join(","));
    if (kwByMode.exact.length > 0) params.set("exact", kwByMode.exact.join(","));
    const qs = params.toString();
    // Build SEO path: /suppliers, /suppliers/clothing-fashion, or /suppliers/clothing-fashion/mens-clothing
    // Single supplier type appended as path segment: /suppliers/liquidators, /suppliers/clothing-fashion/liquidators
    const SUPPLIER_TYPE_SLUGS = {
      manufacturer: "manufacturers", "brand-owner": "brand-owners", "private-label": "private-label",
      wholesaler: "wholesalers", distributor: "distributors", importer: "importers", exporter: "exporters",
      "trading-company": "trading-companies", liquidator: "liquidators", dropshipper: "dropshippers",
      "sourcing-agent": "sourcing-agents", "artisan-maker": "artisan-makers",
    };
    let basePath = "/suppliers";
    if (filters.category) {
      basePath = `/suppliers/${filters.category}`;
      if (filters.subcategory) {
        const subId = filters.subcategory.includes("--") ? filters.subcategory.split("--")[1] : filters.subcategory;
        basePath = `${basePath}/${subId}`;
      }
    }
    // Single supplier type as path segment (appended after category if present)
    if (filters.supplierTypes?.length === 1) {
      const typeSlug = SUPPLIER_TYPE_SLUGS[filters.supplierTypes[0]] || filters.supplierTypes[0];
      basePath += `/${typeSlug}`;
    }
    const newUrl = qs ? `${basePath}?${qs}` : basePath;
    // Path changed (category navigation) → push to create history entry
    // Only query params changed (price, country, etc.) → replace to avoid clutter
    const pathChanged = basePath !== prevPathRef.current;
    prevPathRef.current = basePath;
    if (pathChanged) {
      router.push(newUrl, { scroll: false });
    } else {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, router]);

  /* demo-auth: auth state now from DemoAuthContext (supports demo dropdown + real session) */

  // Non-keyword filters shared by exact + broad
  const passesNonKeywordFilters = (s) => {
    if (filters.rating && s.rating < filters.rating) return false;
    if (filters.category && !s.categories.some((c) => c.toLowerCase().replace(/[^a-z]/g, "").includes(filters.category.replace(/[^a-z]/g, "")))) return false;
    // Map legacy uppercase codes (UK→gb, DE→de) to canonical ISO alpha-2 lowercase
    const LEGACY_TO_ISO = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };
    const supplierCountryISO = LEGACY_TO_ISO[s.country] || s.country?.toLowerCase();
    if (filters.countries.length > 0 && !filters.countries.includes(supplierCountryISO)) return false;
    if (filters.dropshipping && !s.focus.some((f) => f.toLowerCase().includes("drop"))) return false;
    // Supplier type filter — match against supplier's supplierType array (e.g. ["wholesaler", "distributor"])
    if (filters.supplierTypes?.length > 0 && !(s.supplierType || []).some((st) => filters.supplierTypes.includes(st))) return false;
    // Buyer types served — suppliers with no buyerTypesServed data are considered as serving all buyer types
    if (filters.buyerTypes?.length > 0) {
      const served = s.buyerTypesServed || [];
      if (served.length > 0 && !filters.buyerTypes.some((bt) => served.includes(bt))) return false;
    }
    return true;
  };

  /* Extract keyword terms (supports both string and { term, mode } formats) */
  const keywords = (filters.keywords || []).map((kw) => (typeof kw === "string" ? kw : kw.term).toLowerCase());
  const hasMultipleKeywords = keywords.length > 1;

  const matchesKeyword = (s, kw) =>
    (s.companyName || "").toLowerCase().includes(kw) || (s.companyDescription || "").toLowerCase().includes(kw);

  // Sort helper: Supplier Pro accounts always appear before standard suppliers
  const proFirst = (a, b) => (b.isSupplierPro ? 1 : 0) - (a.isSupplierPro ? 1 : 0);

  // Exact matches: passes all filters including ALL keywords
  const exactSuppliers = SUPPLIERS.filter((s) => {
    if (!passesNonKeywordFilters(s)) return false;
    if (keywords.length > 0 && !keywords.every((kw) => matchesKeyword(s, kw))) return false;
    return true;
  }).sort(proFirst);

  // Broad matches: passes non-keyword filters + matches AT LEAST ONE keyword but NOT all
  const broadSuppliersReal = hasMultipleKeywords
    ? SUPPLIERS.filter((s) => {
        if (!passesNonKeywordFilters(s)) return false;
        const matchCount = keywords.filter((kw) => matchesKeyword(s, kw)).length;
        return matchCount > 0 && matchCount < keywords.length;
      }).sort(proFirst)
    : [];

  // Demo mode: when no keywords are active, simulate a split to showcase the separator
  const DEMO_EXACT_COUNT = 6;
  const isDemoSplit = keywords.length === 0 && exactSuppliers.length > DEMO_EXACT_COUNT;
  const broadSuppliers = isDemoSplit ? exactSuppliers.slice(DEMO_EXACT_COUNT) : broadSuppliersReal;
  const displayExactSuppliers = isDemoSplit ? exactSuppliers.slice(0, DEMO_EXACT_COUNT) : exactSuppliers;

  // Combined for pagination/count
  const filteredSuppliers = [...exactSuppliers, ...broadSuppliersReal];

  // Paginate
  const totalSuppliers = filteredSuppliers.length;
  const totalPages = Math.ceil(totalSuppliers / perPage);
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * perPage, page * perPage);

  // Separator logic:
  // - Show between exact and broad when both exist (page 1 only)
  // - Show at top when ALL results are broad / no exact matches (page 1 only)
  const hasBroadResults = broadSuppliers.length > 0;
  const hasExactResults = displayExactSuppliers.length > 0;
  const allResultsAreBroad = hasBroadResults && !hasExactResults;
  const showSeparatorTop = allResultsAreBroad && page === 1;

  // For the current page, split into exact vs broad display groups
  const pageStart = (page - 1) * perPage;
  const exactEndIndex = displayExactSuppliers.length;
  const exactOnPage = Math.max(0, Math.min(perPage, exactEndIndex - pageStart));
  const broadStartsOnThisPage = hasBroadResults && hasExactResults && page === 1 && pageStart < exactEndIndex && pageStart + perPage > exactEndIndex;
  const entirePageIsBroad = hasBroadResults && pageStart >= exactEndIndex;
  const paginatedExact = broadStartsOnThisPage ? paginatedSuppliers.slice(0, exactOnPage) : (pageStart < exactEndIndex ? paginatedSuppliers : []);
  const paginatedBroad = broadStartsOnThisPage ? paginatedSuppliers.slice(exactOnPage) : (entirePageIsBroad ? paginatedSuppliers : []);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb — updates with active category/subcategory */}
        <Breadcrumb items={(() => {
          const crumbs = [{ label: "WholesaleUp", href: "/" }];
          if (filters.category) {
            const cat = FILTER_CATEGORIES.find((c) => c.id === filters.category);
            crumbs.push({ label: "Wholesale Suppliers", href: "/suppliers" });
            if (cat) {
              if (filters.subcategory) {
                const sub = cat.children?.find((ch) => ch.id === filters.subcategory);
                crumbs.push({ label: cat.label, href: `/suppliers/${filters.category}` });
                if (sub) {
                  crumbs.push({ label: sub.label });
                } else {
                  crumbs[crumbs.length - 1] = { label: cat.label };
                }
              } else {
                crumbs.push({ label: cat.label });
              }
            }
          } else {
            crumbs.push({ label: "Wholesale Suppliers" });
          }
          return crumbs;
        })()} />

        {/* Layout: Filter Sidebar + Content */}
        <div className="flex gap-6 items-start">
          {/* Collapsible Filter Panel — shared component */}
          <CollapsibleFilterPanel collapsed={filterCollapsed} onToggle={toggleFilterCollapsed}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              hidePrice
              hideDropshipping
              hideGrade
              showBusinessType
              showBuyerTypes
            />
          </CollapsibleFilterPanel>

          {/* Mobile filter overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                <FilterSidebar filters={filters} setFilters={setFilters} isOpen={true} onClose={() => setMobileFilterOpen(false)} hidePrice hideDropshipping hideGrade showBusinessType showBuyerTypes />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title + Description + Follow */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {pageTitle} <span className="text-base font-semibold text-slate-400">({SUPPLIERS.length.toLocaleString()} suppliers)</span>
                </h1>
                <h2 className="text-sm font-normal text-slate-500 mt-1 leading-relaxed">
                  Browse our directory of verified wholesale suppliers, liquidators and dropshippers. Find trusted UK and international trade sources for brand-name and own-label products at competitive wholesale prices.{" "}
                  {descExpanded ? (
                    <>
                      Our comprehensive supplier database is updated daily with fresh listings from verified businesses across the UK, Europe, and beyond. Whether you&apos;re looking for consumer electronics, health &amp; beauty products, clothing, home goods, or specialty items, our platform connects you with reliable wholesale sources to grow your reselling business. Each supplier is verified and rated by our community of buyers.{" "}
                      <button onClick={() => setDescExpanded(false)} className="text-orange-500 hover:text-orange-600 font-medium">Show Less</button>
                    </>
                  ) : (
                    <button onClick={() => setDescExpanded(true)} className="text-orange-500 hover:text-orange-600 font-medium">Show More</button>
                  )}
                </h2>
              </div>
              <FollowButton />
            </div>

            {/* Search + View Toggle Row */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3">
              {/* Search Mode Selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                {["Any", "All", "Exact"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSearchMode(mode.toLowerCase())}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
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
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={inlineSearch}
                  onChange={(e) => setInlineSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inlineSearch.trim()) {
                      const term = inlineSearch.trim();
                      const newKw = { term, mode: searchMode || "any" };
                      setFilters((p) => {
                        const prev = p.keywords || [];
                        const exists = prev.some((k) => (typeof k === "string" ? k : k.term) === term && (typeof k === "string" ? "any" : k.mode) === newKw.mode);
                        return exists ? p : { ...p, keywords: [...prev, newKw] };
                      });
                      setInlineSearch("");
                      setPage(1);
                    }
                  }}
                  placeholder="Search suppliers..."
                  className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
                />
                <button
                  onClick={() => {
                    if (inlineSearch.trim()) {
                      const term = inlineSearch.trim();
                      const newKw = { term, mode: searchMode || "any" };
                      setFilters((p) => {
                        const prev = p.keywords || [];
                        const exists = prev.some((k) => (typeof k === "string" ? k : k.term) === term && (typeof k === "string" ? "any" : k.mode) === newKw.mode);
                        return exists ? p : { ...p, keywords: [...prev, newKw] };
                      });
                      setInlineSearch("");
                      setPage(1);
                    }
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                  aria-label="Search"
                >
                  <Search size={14} />
                </button>
              </div>

              {/* Grid / List Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setListingMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    listingMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button
                  onClick={() => setListingMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    listingMode === "list"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List size={14} /> List
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips filters={filters} setFilters={setFilters} searchMode={searchMode} />

            {/* All results are broad — show separator at top (page 1 only) */}
            {showSeparatorTop && (
              <BroadMatchSeparator noExactMatches onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
            )}

            {/* ── Grid View ── */}
            {listingMode === "grid" && (
              <>
                {paginatedExact.length > 0 && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                    {paginatedExact.map((s) => (
                      <SupplierGridCard key={s.id} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} onCallNow={setPhoneSupplier} keyword={(filters.keywords || []).map((kw) => typeof kw === "string" ? kw : kw.term).join("|")} />
                    ))}
                  </div>
                )}
                {broadStartsOnThisPage && <BroadMatchSeparator exactCount={displayExactSuppliers.length} onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />}
                {paginatedBroad.length > 0 && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                    {paginatedBroad.map((s) => (
                      <SupplierGridCard key={`broad-${s.id}`} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} onCallNow={setPhoneSupplier} keyword={(filters.keywords || []).map((kw) => typeof kw === "string" ? kw : kw.term).join("|")} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── List View ── */}
            {listingMode === "list" && (
              <>
                {paginatedExact.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {paginatedExact.map((s) => (
                      <SupplierCard key={s.id} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} onCallNow={setPhoneSupplier} onReportInvalid={(sup, field) => setReportInvalid({ supplier: sup, field })} keyword={(filters.keywords || []).map((kw) => typeof kw === "string" ? kw : kw.term).join("|")} />
                    ))}
                  </div>
                )}
                {broadStartsOnThisPage && <BroadMatchSeparator exactCount={displayExactSuppliers.length} onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />}
                {paginatedBroad.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {paginatedBroad.map((s) => (
                      <SupplierCard key={`broad-${s.id}`} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} onCallNow={setPhoneSupplier} onReportInvalid={(sup, field) => setReportInvalid({ supplier: sup, field })} keyword={(filters.keywords || []).map((kw) => typeof kw === "string" ? kw : kw.term).join("|")} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {paginatedSuppliers.length === 0 && (
              <div className="text-center py-16">
                <Search size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No suppliers found</h3>
                <p className="text-sm text-slate-400 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => { setFilters({ rating: null, category: null, subcategory: null, priceMin: "", priceMax: "", countries: [], dropshipping: false, grades: [], supplierTypes: [], buyerTypes: [], keywords: [] }); setPage(1); }}
                  className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              total={totalSuppliers}
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
              buildPageHref={buildPageHref}
            />

            {/* SEO Content */}
            <SeoSection />

            {/* Related Searches */}
            <RelatedSearches />

            {/* Trust Section */}
            <TrustSection />

            {/* CTA Banner */}
            <CtaBanner />
          </div>
        </div>
      </div>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.7); }
      `}</style>

      {/* Contact Supplier Modal */}
      {contactSupplier && (
        <ContactSupplierModal name={contactSupplier.companyName || "Supplier"} onClose={() => setContactSupplier(null)} />
      )}

      {/* Phone Number Reveal Modal */}
      {phoneSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPhoneSupplier(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Phone size={18} className="text-orange-500" /> Supplier Phone</h3>
              <button onClick={() => setPhoneSupplier(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-1">{phoneSupplier?.companyName || "Supplier"}</p>
            <p className="text-sm text-slate-500 mb-3">Call the supplier directly:</p>
            <a href={`tel:${phoneSupplier?.phone || "+44 20 7946 0958"}`} className="block w-full py-3 rounded-lg text-center text-lg font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
              {phoneSupplier?.phone || "+44 20 7946 0958"}
            </a>
          </div>
        </div>
      )}

      {/* Report Invalid Details Modal */}
      {reportInvalid && (
        <ReportInvalidModal supplier={reportInvalid.supplier} field={reportInvalid.field} onClose={() => setReportInvalid(null)} />
      )}
    </div>
  );
}
