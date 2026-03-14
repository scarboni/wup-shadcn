"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/shared/breadcrumb";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { FormTipsPanel as SharedFormTipsPanel, WhyItMattersSection } from "@/components/shared/form-tips-panel";
import {
  Building2, Package, CreditCard, Globe, Search, Tag, Store, Factory, Boxes, Warehouse,
  Check, X, ChevronDown, AlertTriangle, Loader2, Shield,
  ArrowRight, Truck, DollarSign, MapPin, MessageSquare, Monitor, Clock, Sparkles, Crown, HelpCircle,
  Facebook, Instagram, Linkedin, Plus, Trash2, Percent, Wrench, FileText,
} from "lucide-react";
import { useFormDraft } from "@/components/shared/use-form-draft";
import { useProfileSaveTime } from "@/components/shared/use-profile-save-time";
import { StaleProfileBanner } from "@/components/shared/stale-profile-banner";
import {
  FlagImg, useDropdown, FloatingField, FloatingSelect, FloatingTextarea, FormSection,
  TabStatus, ProfileTabBar, ErrorSummaryPanel, AccountSidebar, UpgradeBanner, MobileDashboardNav,
  usePageUser, MultiSelect, COUNTRIES, CURRENCIES, TIER_CONFIG, TIER_CTA,
  CURRENCY_SYMBOLS, useHeaderCurrency, CurrencyAmountInput, PRODUCT_CATEGORY_TREE,
  CategorySelector, BrandPillInput, ImageUploadPlaceholder, BusinessHoursGrid, DEFAULT_BUSINESS_HOURS,
  TAX_CLASS_OPTIONS, INVOICE_TYPE_OPTIONS, SANITIZED_INVOICE_OPTIONS, INCOTERMS_OPTIONS,
} from "./dashboard";

/* ═══════════════════════════════════════════════════
   REFERENCE DATA
   ═══════════════════════════════════════════════════ */

const SUPPLIER_TABS = [
  { id: "business-profile", label: "Business Profile", icon: Building2, shortLabel: "Business" },
  { id: "products-supply", label: "Products & Supply", icon: Package, shortLabel: "Products" },
  { id: "orders-payments", label: "Orders & Payments", icon: CreditCard, shortLabel: "Orders" },
  { id: "shipping-reach", label: "Shipping & Reach", icon: Globe, shortLabel: "Shipping" },
];

const SUPPLIER_TAB_FIELDS = {
  "business-profile": { required: ["supplierType", "buyerTypesServed", "companyDescription", "supplyModels"], optional: ["customersServed", "companyLogo"] },
  "products-supply": { required: ["productsOffered", "productCategories"], optional: ["brandsDistributed", "productQualityTier", "certifications", "customizationAbility", "sampleAvailability", "catalogueSize"] },
  "orders-payments": { required: ["minimumOrderAmount", "paymentMethods", "returnPolicy"], optional: ["preferredCurrency", "paymentTerms", "defaultDepositPercentage", "defaultDepositTerms", "defaultInvoiceType", "sanitizedInvoice", "defaultTaxClass", "discountTiers", "discountNotes"] },
  "shipping-reach": { required: ["deliveryMethods", "countriesServed", "companyWebsite"], optional: ["leadTime", "defaultIncoterms", "excludedCountries", "facilitySize", "facilitySizeUnit", "socialFacebook", "socialInstagram", "socialLinkedin", "businessHours"] },
};

/* Ordered: production → brand → distribution → fulfillment → niche */
const SUPPLIER_TYPE_OPTIONS = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "brand-owner", label: "Brand Owner" },
  { value: "private-label", label: "Private Label / White Label" },
  { value: "wholesaler", label: "Wholesaler" },
  { value: "distributor", label: "Distributor" },
  { value: "importer", label: "Importer" },
  { value: "exporter", label: "Exporter" },
  { value: "trading-company", label: "Trading Company" },
  { value: "liquidator", label: "Liquidator / Clearance" },
  { value: "dropshipper", label: "Dropshipper" },
  { value: "sourcing-agent", label: "Sourcing Agent" },
  { value: "artisan-maker", label: "Artisan / Maker" },
];

/* Matches BUYER_TYPES in buyer-profile (shared values for cross-matching) */
const BUYER_TYPES_SERVED = [
  { value: "online-retailer", label: "Online Retailers" },
  { value: "shop-retailer", label: "Shop / High Street Retailers" },
  { value: "multi-chain", label: "Multi-Chain Retailers" },
  { value: "marketplace-seller", label: "Marketplace Sellers (Amazon, eBay, etc.)" },
  { value: "dropshipper", label: "Dropshippers" },
  { value: "market-trader", label: "Market Traders" },
  { value: "wholesaler-reseller", label: "Wholesalers / Resellers" },
  { value: "distributor", label: "Distributors / Importers" },
  { value: "supermarket", label: "Supermarket / Grocery" },
  { value: "hospitality", label: "Hospitality / HoReCa" },
  { value: "corporate-buyer", label: "Corporate / Procurement" },
  { value: "franchisee", label: "Franchisees" },
  { value: "charity-nonprofit", label: "Charities / Non-Profits" },
  { value: "government", label: "Government / Public Sector" },
  { value: "subscription-box", label: "Subscription Box Services" },
  { value: "social-commerce", label: "Social Commerce Sellers" },
  { value: "mail-order", label: "Mail Order / Catalogue" },
  { value: "other", label: "Other" },
];

/* Matches PAYMENT_METHODS in buyer-profile (shared values for cross-matching) */
const PAYMENT_METHODS_SUPPLIER = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "credit-debit-card", label: "Credit / Debit Card" },
  { value: "trade-credit", label: "Trade Credit (Net 30/60/90)" },
  { value: "paypal", label: "PayPal" },
  { value: "cash-on-delivery", label: "Cash on Delivery" },
  { value: "bnpl", label: "Buy Now Pay Later (B2B)" },
  { value: "letter-of-credit", label: "Letter of Credit" },
  { value: "escrow", label: "Escrow" },
];

/* Matches DELIVERY_OPTIONS in buyer-profile (shared values for cross-matching) */
const DELIVERY_METHODS_SUPPLIER = [
  { value: "dhl", label: "DHL" },
  { value: "fedex", label: "FedEx" },
  { value: "ups", label: "UPS" },
  { value: "usps", label: "USPS" },
  { value: "tnt", label: "TNT" },
  { value: "aramex", label: "Aramex" },
  { value: "dpd", label: "DPD" },
  { value: "national-post", label: "National Postal Service" },
  { value: "pallet-delivery", label: "Pallet / LTL Freight" },
  { value: "own-fleet", label: "Own Fleet / Direct Delivery" },
  { value: "freight", label: "Freight / Haulage" },
  { value: "click-collect", label: "Click & Collect" },
  { value: "collection", label: "Collection in Person" },
];

/* Matches SOURCING_MODELS in buyer-profile */
const SUPPLY_MODELS = [
  { value: "wholesale", label: "Wholesale" },
  { value: "dropshipping", label: "Dropshipping" },
  { value: "liquidation", label: "Liquidation" },
  { value: "white-label", label: "White Label" },
  { value: "private-label", label: "Private Label" },
  { value: "job-lots", label: "Job Lots" },
];

const SAMPLE_OPTIONS = [
  { value: "free", label: "Free Samples" },
  { value: "paid", label: "Paid Samples" },
  { value: "on-request", label: "On Request" },
  { value: "not-available", label: "Not Available" },
];

const CATALOGUE_SIZE_OPTIONS = [
  { value: "under-50", label: "Under 50 SKUs" },
  { value: "50-200", label: "50–200 SKUs" },
  { value: "200-1000", label: "200–1,000 SKUs" },
  { value: "1000-5000", label: "1,000–5,000 SKUs" },
  { value: "5000-20000", label: "5,000–20,000 SKUs" },
  { value: "20000-plus", label: "20,000+ SKUs" },
];

/* Matches QUALITY_TIERS in buyer-profile */
const QUALITY_TIERS = [
  { value: "budget", label: "Budget / Value" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
];

const LEAD_TIME_OPTIONS = [
  { value: "same-day", label: "Same Day" },
  { value: "1-2-days", label: "1–2 Business Days" },
  { value: "3-5-days", label: "3–5 Business Days" },
  { value: "1-2-weeks", label: "1–2 Weeks" },
  { value: "2-4-weeks", label: "2–4 Weeks" },
  { value: "4-8-weeks", label: "4–8 Weeks" },
  { value: "8-plus-weeks", label: "8+ Weeks" },
  { value: "made-to-order", label: "Made to Order" },
];

const CUSTOMER_TYPES = [
  { value: "registered-companies", label: "Registered Companies" },
  { value: "sole-traders", label: "Sole Traders" },
  { value: "individuals", label: "Individuals" },
];

/* Ordered: general capability levels → specific techniques. Covers manufacturing & trade customization. */
const CUSTOMIZATION_OPTIONS = [
  { value: "minor-customization", label: "Minor customization" },
  { value: "drawing-based", label: "Drawing-based customization" },
  { value: "sample-based", label: "Sample-based customization" },
  { value: "full-customization", label: "Full customization" },
  { value: "print-on-demand", label: "Print-on-demand" },
  { value: "custom-packaging", label: "Custom packaging" },
  { value: "custom-labeling", label: "Custom labeling" },
  { value: "private-labeling", label: "Private labeling" },
  { value: "private-label-formulation", label: "Private label formulation" },
  { value: "logo-printing", label: "Logo printing" },
  { value: "custom-firmware", label: "Custom firmware" },
];

/* Matches CERTIFICATIONS in buyer-profile (shared values for cross-matching) */
/* Ordered: regulatory/safety → quality → environmental/sustainability → food/dietary → industry */
const CERTIFICATION_OPTIONS = [
  { value: "ce", label: "CE" },
  { value: "ukca", label: "UKCA" },
  { value: "fda", label: "FDA" },
  { value: "rohs", label: "RoHS" },
  { value: "reach", label: "REACH" },
  { value: "iso-9001", label: "ISO 9001" },
  { value: "iso-14001", label: "ISO 14001" },
  { value: "gmp", label: "GMP" },
  { value: "brc", label: "BRC" },
  { value: "haccp", label: "HACCP" },
  { value: "organic", label: "Organic" },
  { value: "fair-trade", label: "Fair Trade" },
  { value: "rainforest-alliance", label: "Rainforest Alliance" },
  { value: "fsc", label: "FSC" },
  { value: "oeko-tex", label: "OEKO-TEX" },
  { value: "gots", label: "GOTS" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "bsci", label: "BSCI" },
  { value: "b-corp", label: "B Corp" },
];

const SUPPLIER_FIELD_LABELS = {
  supplierType: "Supplier Type",
  companyDescription: "Describe Your Wholesale Business",
  productsOffered: "Product Types & Categories You Supply",
  productQualityTier: "Product Quality Tier",
  brandsDistributed: "Brands You Distribute",
  companyLogo: "Company Logo",
  companyWebsite: "Company Website",
  supplyModels: "How You Supply Products",
  productCategories: "Product Categories",
  buyerTypesServed: "Buyer Types Served",
  customersServed: "Who Can Place Orders",
  countriesServed: "Countries Served",
  excludedCountries: "Excluded Countries",
  certifications: "Certifications",
  customizationAbility: "Customization Capability",
  sampleAvailability: "Sample Availability",
  catalogueSize: "Catalogue Size (Number of SKUs)",
  leadTime: "Average Order-to-Delivery Time",
  minimumOrderAmount: "Minimum Order Value",
  preferredCurrency: "Preferred Currency",
  paymentMethods: "Payment Methods",
  paymentTerms: "Payment Terms",
  defaultDepositPercentage: "Deposit (%)",
  defaultDepositTerms: "Deposit Terms",
  defaultInvoiceType: "Default Invoice Type",
  sanitizedInvoice: "Sanitized Invoices",
  defaultTaxClass: "Default Tax Class",
  defaultIncoterms: "Default Incoterms",
  deliveryMethods: "Delivery Methods",
  returnPolicy: "Return Policy",
  discountTiers: "Bulk Discount Tiers",
  discountNotes: "Discount Notes",
  businessHours: "Business Hours",
  facilitySize: "Facility Size",
  facilitySizeUnit: "Facility Size Unit",
  socialFacebook: "Facebook Page",
  socialInstagram: "Instagram Profile",
  socialLinkedin: "LinkedIn Page",
};

const SUPPLIER_REQUIRED_FIELDS = {
  supplierType: "Supplier Type",
  companyDescription: "Describe Your Wholesale Business",
  productsOffered: "Product Types & Categories You Supply",
  companyWebsite: "Company Website",
  supplyModels: "How You Supply Products",
  productCategories: "Product Categories",
  buyerTypesServed: "Buyer Types Served",
  countriesServed: "Countries Served",
  minimumOrderAmount: "Minimum Order Value",
  paymentMethods: "Payment Methods",
  deliveryMethods: "Delivery Methods",
  returnPolicy: "Return Policy",
};

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

/* ═══════════════════════════════════════════════════
   TIPS DATA
   ═══════════════════════════════════════════════════ */

const SUPPLIER_TIPS_DATA = {
  supplierType: { title: "Supplier Type", tip: "Select all that apply. This helps buyers understand your position in the supply chain and find you more easily. Profiles with clear supplier types receive 2× more buyer inquiries.", icon: Building2 },
  companyDescription: { title: "Describe Your Wholesale Business", tip: "Write a compelling description of your business, products, and unique selling points. Suppliers with detailed descriptions receive 4× more buyer inquiries.", icon: Building2 },
  productsOffered: { title: "Product Types & Categories You Supply", tip: "List the specific product types, categories, and niches you sell — e.g. 'men's casual footwear, branded sportswear, LED lighting'. The more specific you are, the better buyers can match your range to their needs.", icon: Package },
  brandsDistributed: { title: "Brands You Distribute", tip: "List the brands you distribute or manufacture. Brand-specific listings help buyers find exactly what they're looking for.", icon: Tag },
  companyLogo: { title: "Company Logo", tip: "Upload your company logo to build trust and brand recognition. Profiles with logos receive significantly more engagement.", icon: Building2 },
  companyWebsite: { title: "Company Website", tip: "Add your website so buyers can learn more about your company and verify your business.", icon: Globe },
  supplyModels: { title: "How You Supply Products", tip: "Select all the ways you can fulfil orders — wholesale, dropship, white-label, etc. Buyers filter by supply model when searching for suppliers.", icon: Truck },
  productCategories: { title: "Product Categories", tip: "Select all categories you supply products in. This helps buyers browsing by category discover your business.", icon: Tag },
  buyerTypesServed: { title: "Buyer Types Served", tip: "Select the types of buyers you work with. This helps filter inquiries to your ideal customer profile.", icon: Store },
  productQualityTier: { title: "Product Quality Tier", tip: "Select the quality tiers that best describe your product range. Buyers filter by quality level to find suppliers that match their market positioning.", icon: Sparkles },
  certifications: { title: "Certifications", tip: "List any certifications your products or business hold. Certifications build trust and are required for certain markets.", icon: Shield },
  customizationAbility: { title: "Customization Capability", tip: "Select the customization services you offer — private labeling, custom packaging, OEM, etc. Buyers looking for tailored products filter by customization capability.", icon: Wrench },
  sampleAvailability: { title: "Sample Availability", tip: "Buyers often request samples before committing to bulk orders. Being clear about sample availability speeds up the sales process.", icon: Package },
  catalogueSize: { title: "Catalogue Size", tip: "Indicate the approximate number of products/SKUs you offer. This gives buyers a quick sense of your catalogue scale and depth.", icon: Boxes },
  leadTime: { title: "Average Order-to-Delivery Time", tip: "How long from payment receipt to delivery, on average. Clear timelines help buyers plan inventory and manage expectations.", icon: Clock },
  minimumOrderAmount: { title: "Minimum Order Value", tip: "Set your minimum order value clearly. This filters out unsuitable inquiries and attracts serious buyers.", icon: DollarSign },
  preferredCurrency: { title: "Preferred Currency", tip: "Choose the currency you prefer for transactions. Buyers can then see your preferred currency upfront.", icon: DollarSign },
  customersServed: { title: "Who Can Place Orders", tip: "Select which entity types can place orders with you — registered companies, sole traders, or individuals. This sets eligibility expectations upfront.", icon: Store },
  paymentMethods: { title: "Payment Methods", tip: "List all payment methods you accept. More options means more potential buyers can work with you.", icon: CreditCard },
  paymentTerms: { title: "Payment Terms", tip: "Describe your payment terms (e.g., 30-day net, proforma, deposit required). Clear terms speed up negotiations.", icon: CreditCard },
  defaultDepositPercentage: { title: "Deposit", tip: "Set your standard deposit percentage for new orders. Individual deals can override this. Clear deposit terms reduce friction in negotiations and set expectations upfront.", icon: Percent },
  defaultDepositTerms: { title: "Deposit Terms", tip: "Describe your standard deposit arrangement — e.g. '30% upfront, 70% before shipping'. This becomes the default for all your deals unless overridden.", icon: Percent },
  defaultInvoiceType: { title: "Default Invoice Type", tip: "Select the type of invoice you typically issue. VAT invoices are standard for UK domestic trade. EU Community invoices are used for intra-EU B2B cross-border transactions. Individual deals can override this.", icon: CreditCard },
  sanitizedInvoice: { title: "Sanitized Invoices", tip: "Whether you can provide invoices with supplier pricing removed. Many Amazon sellers need sanitized invoices to get ungated in restricted categories. 'On Request' means you can provide them if the buyer asks.", icon: FileText },
  defaultTaxClass: { title: "Default Tax Class", tip: "Select your standard VAT rate category. Most goods are 'Standard Rate'. Reduced rates apply to specific categories (children's clothing, energy). Zero-rated applies to exports and certain food/book items. Individual deals can override this.", icon: DollarSign },
  defaultIncoterms: { title: "Default Incoterms", tip: "Select the Incoterms you typically trade under. DDP (Delivered Duty Paid) means you handle all costs and duties. EXW (Ex Works) means the buyer handles shipping from your warehouse. Individual deals can override this.", icon: Truck },
  deliveryMethods: { title: "Delivery Methods", tip: "Select all carriers and shipping methods you use. Offering multiple options (e.g. DHL, FedEx, own fleet) gives buyers flexibility and widens your reach to international markets.", icon: Truck },
  returnPolicy: { title: "Return Policy", tip: "A clear return policy builds buyer confidence. Include details about return windows, conditions, and who covers return shipping.", icon: Shield },
  countriesServed: { title: "Countries Served", tip: "Select the countries you can ship to or serve. This helps international buyers assess if they can work with you.", icon: Globe },
  excludedCountries: { title: "Excluded Countries", tip: "Select countries you do not ship to or serve. This saves time by filtering out buyers from regions outside your delivery capabilities.", icon: Globe },
  discountTiers: { title: "Bulk Discount Tiers", tip: "Add structured bulk discount tiers to encourage larger orders. Buyers can compare tiers across suppliers, so clear pricing gives you a competitive edge.", icon: DollarSign },
  discountNotes: { title: "Discount Notes", tip: "Add any additional context about your discounts — seasonal promotions, loyalty rewards, or negotiable terms for repeat buyers.", icon: DollarSign },
  facilitySize: { title: "Facility Size", tip: "Enter the size of your primary warehouse or facility. This signals operational capacity to buyers — larger facilities suggest higher stock availability and faster fulfilment.", icon: Warehouse },
  businessHours: { title: "Business Hours", tip: "Set your operating hours so buyers know when they can reach you. This is especially important for international customers in different time zones.", icon: Clock },
  socialFacebook: { title: "Facebook Page", tip: "Link your Facebook business page to increase your online presence and credibility.", icon: Facebook },
  socialInstagram: { title: "Instagram Profile", tip: "Instagram is powerful for product showcasing. Link your profile to help buyers see your products.", icon: Instagram },
  socialLinkedin: { title: "LinkedIn Page", tip: "LinkedIn builds B2B credibility. Link your company page to strengthen your professional presence.", icon: Linkedin },
};

const SUPPLIER_TAB_DEFAULT_TIPS = {
  "business-profile": { title: "Business Profile", tip: "Present your company to potential buyers. A complete supplier profile with logo, description, and product information receives 4× more buyer inquiries.", icon: Building2 },
  "products-supply": { title: "Products & Supply", tip: "Define your product offering, categories, and supply capabilities. Detailed product information helps buyers make faster purchasing decisions.", icon: Package },
  "orders-payments": { title: "Orders & Payments", tip: "Set your commercial terms clearly. Transparent pricing, payment terms, and invoicing options build buyer trust and reduce back-and-forth negotiations.", icon: CreditCard },
  "shipping-reach": { title: "Shipping & Reach", tip: "Define your delivery options, geographic reach, operating hours, and online presence. This helps international buyers assess shipping options and communication availability.", icon: Globe },
};

/* ─── MultiSelectDropdown ─── */
function MultiSelectDropdown({ options, selected = [], onChange, label, required, error, id, icon, searchPlaceholder = "Search...", toggleOnClick = true, showFlags = false, showCount = false, maxItems, countNoun }) {
  return (
    <MultiSelect
      options={options}
      selected={selected}
      onChange={onChange}
      label={label}
      labelType="floating"
      icon={icon}
      showCheckboxes={true}
      showFlags={showFlags}
      showCount={showCount}
      countNoun={countNoun}
      maxItems={maxItems}
      searchPlaceholder={searchPlaceholder}
      required={required}
      error={error}
      id={id}
    />
  );
}

/* ─── TagSelector ─── */
function TagSelector({ label, options, selected = [], onChange, required, error, id, maxItems = 200, searchPlaceholder = "Search...", showFlags = false, countNoun }) {
  return (
    <MultiSelect
      options={options}
      selected={selected}
      onChange={onChange}
      label={label}
      labelType="block"
      showFlags={showFlags}
      showCheckboxes={false}
      filterSelected={true}
      maxItems={maxItems}
      showCount={true}
      countNoun={countNoun}
      searchPlaceholder={searchPlaceholder}
      required={required}
      error={error}
      id={id}
    />
  );
}

/* ─── TierCurrencyPicker — small dropdown matching CurrencyAmountInput style ─── */
function TierCurrencyPicker({ value, onChange, ariaLabel }) {
  const dd = useDropdown();
  return (
    <div ref={dd.ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => dd.setOpen(!dd.open)}
        className="flex items-center gap-1 pl-3 pr-2 py-2.5 text-xs font-semibold text-slate-600 bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all border-r border-slate-200/80 cursor-pointer outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.08)]"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={dd.open}
      >
        <span>{CURRENCY_SYMBOLS[value] || ""} {value}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
      </button>
      {dd.open && (
        <div className="absolute left-0 top-full -mt-px bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 min-w-[130px] overflow-hidden" role="listbox" aria-label="Select currency">
          {CURRENCIES.map((c) => (
            <button
              key={c.value}
              type="button"
              role="option"
              aria-selected={value === c.value}
              onClick={() => { onChange(c.value); dd.setOpen(false); }}
              className={`w-full flex items-center gap-2 text-left px-3 py-2.5 text-xs transition-colors ${
                value === c.value
                  ? "bg-orange-50 text-orange-700 font-semibold"
                  : "text-slate-600 hover:bg-orange-50"
              }`}
            >
              <span className="text-slate-400 w-4 text-center font-medium">{CURRENCY_SYMBOLS[c.value] || ""}</span>
              <span>{c.value}</span>
              {value === c.value && <Check size={12} className="ml-auto text-orange-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── DiscountTierBuilder ─── */
function DiscountTierBuilder({ tiers = [], onChange, currency = "GBP", onCurrencyChange, notes = "", onNotesChange, onFocusField, id }) {
  const newTierRef = useRef(null);
  const addTier = () => {
    onChange([...tiers, { currency: currency || "GBP", minOrder: "", discount: "" }]);
    /* Focus the new tier's min-order input after React renders it */
    setTimeout(() => { if (newTierRef.current) newTierRef.current.focus(); }, 60);
  };
  const removeTier = (i) => onChange(tiers.filter((_, idx) => idx !== i));
  const updateTier = (i, field, value) => {
    const next = tiers.map((t, idx) => idx === i ? { ...t, [field]: value } : t);
    onChange(next);
  };

  /* Tier validation helpers */
  const isTierComplete = (t) => t.minOrder && parseFloat(t.minOrder) > 0 && t.discount && parseFloat(t.discount) > 0 && parseFloat(t.discount) <= 100;
  const isTierEmpty = (t) => !t.minOrder && !t.discount;
  const isTierPartial = (t) => !isTierComplete(t) && !isTierEmpty(t);
  const completeTiers = tiers.filter(isTierComplete).length;

  /* Validate discount is 0–100 */
  const clampDiscount = (val) => {
    const cleaned = val.replace(/[^\d.]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 100) return "100";
    return cleaned.slice(0, 5);
  };

  return (
    <div className="space-y-3" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600">Bulk Discount Tiers</label>
        {tiers.length > 0 && (
          <span className="text-[10px] text-slate-400">
            {completeTiers}/{tiers.length} tier{tiers.length !== 1 ? "s" : ""} complete
          </span>
        )}
      </div>

      {tiers.length === 0 && (
        <p className="text-xs text-slate-400 italic">No discount tiers set. Add tiers to encourage larger orders.</p>
      )}

      {tiers.map((tier, i) => {
        const complete = isTierComplete(tier);
        const partial = isTierPartial(tier);
        const tierCurrency = tier.currency || currency || "GBP";
        const tierSymbol = CURRENCY_SYMBOLS[tierCurrency] || "";
        const discountNum = parseFloat(tier.discount);
        const discountInvalid = tier.discount && (isNaN(discountNum) || discountNum <= 0 || discountNum > 100);
        const borderColor = complete
          ? "border-emerald-300 bg-emerald-50/30"
          : partial
          ? "border-orange-300 bg-orange-50/20"
          : "border-slate-200 bg-white";

        return (
          <div key={i} className={`flex items-center gap-2 rounded-lg border p-2 transition-all max-w-2xl ${borderColor}`}>
            {/* Currency selector + min order */}
            <div className="flex-[3] min-w-0 flex items-center gap-0 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] transition-all focus-within:border-orange-400 focus-within:outline focus-within:outline-2 focus-within:outline-orange-100">
              <TierCurrencyPicker
                value={tierCurrency}
                onChange={(v) => updateTier(i, "currency", v)}
                ariaLabel={`Tier ${i + 1} currency`}
              />
              <input
                ref={i === tiers.length - 1 ? newTierRef : undefined}
                type="text"
                inputMode="numeric"
                value={tier.minOrder}
                onChange={(e) => updateTier(i, "minOrder", e.target.value.replace(/[^\d.,]/g, ""))}
                onFocus={() => { if (onFocusField) onFocusField("discountTiers"); }}
                onBlur={() => { if (onFocusField) onFocusField(null); }}
                placeholder="Min. order value"
                className="flex-1 px-2.5 py-2.5 text-sm text-slate-800 bg-transparent outline-none min-w-0"
                aria-label={`Tier ${i + 1} minimum order value in ${tierCurrency}`}
              />
            </div>

            {/* Discount percentage */}
            <div className={`flex-[1] min-w-[90px] max-w-[140px] flex items-center gap-1 rounded-lg border bg-white px-3 py-2.5 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] transition-all focus-within:border-orange-400 focus-within:outline focus-within:outline-2 focus-within:outline-orange-100 ${discountInvalid ? "border-red-300" : "border-slate-200"}`}>
              <input
                type="text"
                inputMode="numeric"
                value={tier.discount}
                onChange={(e) => updateTier(i, "discount", clampDiscount(e.target.value))}
                onFocus={() => { if (onFocusField) onFocusField("discountTiers"); }}
                onBlur={() => { if (onFocusField) onFocusField(null); }}
                placeholder="0"
                className="w-full text-sm text-slate-800 bg-transparent outline-none text-right"
                aria-label={`Tier ${i + 1} discount percentage`}
              />
              <Percent size={13} className="text-slate-400 shrink-0" />
            </div>

            {/* Status indicator + delete */}
            <div className="flex items-center gap-1 shrink-0">
              {complete && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center" title="Tier complete">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </span>
              )}
              <button
                type="button"
                onClick={() => removeTier(i)}
                className="relative p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 before:absolute before:-inset-2 before:content-['']"
                aria-label={`Remove tier ${i + 1}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}

      {/* Validation hint for partial tiers */}
      {tiers.some(isTierPartial) && (
        <p className="text-[10px] text-orange-500 ml-1">Fill in both a minimum order value and discount % to complete each tier</p>
      )}

      <button
        type="button"
        onClick={addTier}
        className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-lg transition-all border border-orange-200 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)]"
      >
        <Plus size={13} /> Add Tier
      </button>

      {/* Optional notes */}
      <div className="pt-1">
        <div className="relative rounded-lg border border-slate-200 bg-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] transition-all focus-within:border-orange-400 focus-within:outline focus-within:outline-2 focus-within:outline-orange-100">
          <textarea
            value={notes}
            onChange={(e) => { if (e.target.value.length <= 200) onNotesChange(e.target.value); }}
            onFocus={() => { if (onFocusField) onFocusField("discountTiers"); }}
            onBlur={() => { if (onFocusField) onFocusField(null); }}
            rows={2}
            className="peer w-full px-3.5 pt-5 pb-2 text-sm text-slate-800 bg-transparent outline-none rounded-lg resize-none placeholder-transparent focus:placeholder-slate-300"
            placeholder="e.g. 10% off orders over £5k, seasonal promos in Q4, loyalty discounts negotiable"
            aria-label="Discount notes"
          />
          <label className="pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-medium text-orange-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-orange-500">
            Discount Notes
          </label>
        </div>
        <p className="text-[10px] text-slate-500 text-right mt-0.5">{notes.length}/200</p>
      </div>
    </div>
  );
}

/* ─── FocusMarketSelector ─── */
const GLOBAL_OPTION = { value: "global", label: "Global (All Markets)", iso: null };

function FocusMarketSelector({ selected = [], onChange, required, error, id, onFocusField }) {
  const allOptions = useMemo(() => [
    GLOBAL_OPTION,
    ...COUNTRIES.map((c) => ({ value: c.value, label: c.label, iso: c.iso })),
  ], []);

  return (
    <MultiSelect
      options={allOptions}
      selected={selected}
      onChange={onChange}
      label="Focus Markets"
      labelType="floating"
      icon={MapPin}
      showFlags={true}
      showCheckboxes={true}
      filterSelected={true}
      searchPlaceholder="Search countries..."
      emptyMessage="No country found"
      required={required}
      error={error}
      id={id}
      onFocusField={onFocusField}
    />
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER PROFILE PROGRESS BAR
   ═══════════════════════════════════════════════════ */

function SupplierProfileProgressBar({ form, onPctChange }) {
  const REQUIRED_WEIGHT = 3;
  const OPTIONAL_WEIGHT = 1;

  const requiredArrayFields = ["supplierType", "productCategories", "buyerTypesServed", "supplyModels", "countriesServed", "paymentMethods", "deliveryMethods"];
  const requiredStringFields = ["companyDescription", "productsOffered", "companyWebsite", "returnPolicy", "minimumOrderAmount"];
  const optionalArrayFields = ["customersServed", "brandsDistributed", "productQualityTier", "certifications", "customizationAbility", "excludedCountries"];
  const optionalStringFields = ["preferredCurrency", "paymentTerms", "defaultDepositPercentage", "defaultDepositTerms", "defaultInvoiceType", "sanitizedInvoice", "defaultTaxClass", "defaultIncoterms", "discountNotes", "facilitySize", "socialFacebook", "socialInstagram", "socialLinkedin", "sampleAvailability", "catalogueSize", "leadTime"];

  const isArrayFilled = (f) => Array.isArray(form[f]) && form[f].length > 0;
  const isStringFilled = (f) => form[f] && String(form[f]).trim().length > 0;
  const isBusinessHoursFilled = () => {
    if (!form.businessHours) return false;
    return Object.values(form.businessHours).some((day) => day && day.status === "open");
  };
  const isCompanyLogoFilled = () => !!(form.companyLogo && String(form.companyLogo).trim().length > 0);

  let earned = 0, total = 0;
  for (const f of requiredArrayFields) { total += REQUIRED_WEIGHT; if (isArrayFilled(f)) earned += REQUIRED_WEIGHT; }
  for (const f of requiredStringFields) { total += REQUIRED_WEIGHT; if (isStringFilled(f)) earned += REQUIRED_WEIGHT; }
  for (const f of optionalArrayFields) { total += OPTIONAL_WEIGHT; if (isArrayFilled(f)) earned += OPTIONAL_WEIGHT; }
  for (const f of optionalStringFields) { total += OPTIONAL_WEIGHT; if (isStringFilled(f)) earned += OPTIONAL_WEIGHT; }
  /* Discount tiers — structured array, filled if at least one tier has both minOrder and discount */
  total += OPTIONAL_WEIGHT;
  if (Array.isArray(form.discountTiers) && form.discountTiers.some((t) => t.minOrder && t.discount)) earned += OPTIONAL_WEIGHT;
  /* Business hours — optional, filled if at least one day is open */
  total += OPTIONAL_WEIGHT; if (isBusinessHoursFilled()) earned += OPTIONAL_WEIGHT;
  /* Company logo — optional */
  total += OPTIONAL_WEIGHT; if (isCompanyLogoFilled()) earned += OPTIONAL_WEIGHT;

  const pct = Math.round((earned / total) * 100);

  /* Report live pct to parent so sidebar can show real-time progress */
  useEffect(() => { onPctChange?.(pct); }, [pct, onPctChange]);

  const color = pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-orange-500" : "bg-orange-400";
  const textColor = pct === 100 ? "text-emerald-600" : pct >= 60 ? "text-orange-600" : "text-slate-500";
  const message = pct === 100
    ? "Profile complete — you're all set!"
    : pct >= 75
    ? "Almost there — just a few fields left"
    : pct >= 50
    ? "Over halfway — looking good"
    : pct >= 25
    ? "Good start — keep filling in your details"
    : pct > 0
    ? "Let's get started — fill in your supplier profile"
    : "Let's get started";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-600">{message}</span>
          <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
          <div className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
      </div>
    </div>
  );
}

/* Tips panel bottom section */
const SUPPLIER_TIPS_BOTTOM = (
  <WhyItMattersSection items={[
    "Detailed supplier profiles get 4× more buyer inquiries",
    "Clear terms reduce negotiation time by 60%",
    "Complete profiles rank higher in buyer search results",
  ]} />
);

/* ═══════════════════════════════════════════════════
   SUPPLIER PROFILE FORM — main 4-tab form
   ═══════════════════════════════════════════════════ */

function SupplierProfileForm({ user, onFocusedFieldChange, onActiveTabChange, onSave, onProgressChange }) {
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(SUPPLIER_TABS[0].id);

  const headerCurrency = useHeaderCurrency();
  const userOverriddenCurrencies = useRef({ minimumOrderCurrency: false, preferredCurrency: false });

  const [form, setForm] = useState(() => ({
    supplierType: [], companyDescription: "", productsOffered: "", brandsDistributed: [],
    companyLogo: null, companyWebsite: "",
    supplyModels: [], productCategories: [], buyerTypesServed: [],
    productQualityTier: [], certifications: [], customizationAbility: [], sampleAvailability: "", leadTime: "",
    customersServed: [], countriesServed: [], excludedCountries: [], catalogueSize: "",
    minimumOrderCurrency: headerCurrency, minimumOrderAmount: "", preferredCurrency: headerCurrency,
    paymentMethods: [], paymentTerms: "",
    defaultDepositPercentage: "", defaultDepositTerms: "", defaultInvoiceType: "", sanitizedInvoice: "", defaultTaxClass: "", defaultIncoterms: "",
    deliveryMethods: [], returnPolicy: "",
    /** @type {Array<{ currency: string, minOrder: string, discount: string }>} Bulk discount tiers — each tier has a currency code, minimum order value, and discount percentage */
    discountTiers: [], discountNotes: "",
    businessHours: { ...DEFAULT_BUSINESS_HOURS },
    facilitySize: "", facilitySizeUnit: "m²",
    socialFacebook: "", socialInstagram: "", socialLinkedin: "",
  }));

  // 🔧 PRODUCTION: On mount, fetch the user's saved supplier profile from the database:
  // const res = await fetch("/api/user/supplier-profile"); const data = await res.json();
  // 🔧 PRODUCTION: Replace initial state with data fetched from the database.

  const { clearDraft } = useFormDraft("wup-supplier-profile-draft", form, setForm);

  /* Mark draft-restored or DB-loaded currencies as overridden so header sync doesn't clobber them */
  const draftSyncedRef = useRef(false);
  useEffect(() => {
    if (draftSyncedRef.current) return;
    draftSyncedRef.current = true;
    if (form.minimumOrderCurrency && form.minimumOrderCurrency !== headerCurrency) userOverriddenCurrencies.current.minimumOrderCurrency = true;
    if (form.preferredCurrency && form.preferredCurrency !== headerCurrency) userOverriddenCurrencies.current.preferredCurrency = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setForm((prev) => {
      const next = { ...prev };
      if (!userOverriddenCurrencies.current.minimumOrderCurrency) next.minimumOrderCurrency = headerCurrency;
      if (!userOverriddenCurrencies.current.preferredCurrency) next.preferredCurrency = headerCurrency;
      return next;
    });
  }, [headerCurrency]);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingTab, setSavingTab] = useState(false);
  const [tabSaved, setTabSaved] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorScope, setErrorScope] = useState("tab");
  const [focusedField, setFocusedField] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /* Auto-revert "Saved!" button state after 3 seconds */
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 9000);
    return () => clearTimeout(t);
  }, [saved]);
  useEffect(() => {
    if (!tabSaved) return;
    const t = setTimeout(() => setTabSaved(false), 9000);
    return () => clearTimeout(t);
  }, [tabSaved]);

  useEffect(() => { if (onFocusedFieldChange) onFocusedFieldChange(focusedField); }, [focusedField, onFocusedFieldChange]);
  useEffect(() => { if (onActiveTabChange) onActiveTabChange(activeTab); }, [activeTab, onActiveTabChange]);

  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;
    const onFocusIn = (e) => { if (e.target.id) setFocusedField(e.target.id); };
    const onFocusOut = () => setFocusedField(null);
    formEl.addEventListener("focusin", onFocusIn);
    formEl.addEventListener("focusout", onFocusOut);
    return () => { formEl.removeEventListener("focusin", onFocusIn); formEl.removeEventListener("focusout", onFocusOut); };
  }, []);

  const revalidateField = useCallback((field, value) => {
    if (Array.isArray(value)) {
      if (SUPPLIER_REQUIRED_FIELDS[field] && value.length === 0) return `${SUPPLIER_REQUIRED_FIELDS[field]} is required`;
      return "";
    }
    const val = value && String(value).trim();
    if (SUPPLIER_REQUIRED_FIELDS[field] && !val) return `${SUPPLIER_REQUIRED_FIELDS[field]} is required`;
    if (!val) return "";
    switch (field) {
      case "companyDescription":
        if (val.length < 20) return "Please provide at least 20 characters";
        break;
      case "productsOffered":
        if (val.length < 10) return "Please provide at least 10 characters";
        break;
      case "minimumOrderAmount":
        if (isNaN(parseFloat(val))) return "Enter a valid amount";
        break;
      case "companyWebsite":
      case "socialFacebook":
      case "socialInstagram":
      case "socialLinkedin":
        if (!URL_RE.test(val)) return "Enter a valid website URL";
        break;
      case "returnPolicy":
        if (val.length < 10) return "Please provide at least 10 characters";
        break;
      default:
        break;
    }
    return "";
  }, []);

  const update = useCallback((field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setHasUnsavedChanges(true);
    if (field === "minimumOrderCurrency" || field === "preferredCurrency") {
      userOverriddenCurrencies.current[field] = true;
    }
    if (touched[field] || submitted) {
      const err = revalidateField(field, value);
      setErrors((p) => ({ ...p, [field]: err }));
    }
  }, [touched, submitted, revalidateField]);

  const getTabStatus = useCallback((tabId) => {
    const config = SUPPLIER_TAB_FIELDS[tabId];
    if (!config) return "empty";
    const isFilled = (f) => {
      const val = form[f];
      if (f === "discountTiers") return Array.isArray(val) && val.some((t) => t.minOrder && t.discount);
      if (Array.isArray(val)) return val.length > 0;
      if (f === "businessHours") return Object.values(val).some((day) => day && day.status === "open");
      return val && String(val).trim().length > 0;
    };
    const allFields = [...config.required, ...config.optional];
    const requiredDone = config.required.length === 0 || config.required.every(isFilled);
    const anyFilled = allFields.some(isFilled);
    if (requiredDone && anyFilled) return "complete";
    if (anyFilled) return "partial";
    return "empty";
  }, [form]);

  const tabStatuses = useMemo(() => ({
    "business-profile": getTabStatus("business-profile"),
    "products-supply": getTabStatus("products-supply"),
    "orders-payments": getTabStatus("orders-payments"),
    "shipping-reach": getTabStatus("shipping-reach"),
  }), [getTabStatus]);

  const getTabProgress = useCallback((tabId) => {
    const config = SUPPLIER_TAB_FIELDS[tabId];
    if (!config) return 0;
    const REQUIRED_WEIGHT = 3;
    const OPTIONAL_WEIGHT = 1;
    let earned = 0, total = 0;
    const isFilled = (f) => {
      const val = form[f];
      if (f === "discountTiers") return Array.isArray(val) && val.some((t) => t.minOrder && t.discount);
      if (Array.isArray(val)) return val.length > 0;
      if (f === "businessHours") return Object.values(val).some((day) => day && day.status === "open");
      return val && String(val).trim().length > 0;
    };
    for (const f of config.required) { total += REQUIRED_WEIGHT; if (isFilled(f)) earned += REQUIRED_WEIGHT; }
    for (const f of config.optional) { total += OPTIONAL_WEIGHT; if (isFilled(f)) earned += OPTIONAL_WEIGHT; }
    return total > 0 ? earned / total : 0;
  }, [form]);

  const tabProgress = useMemo(() => ({
    "business-profile": getTabProgress("business-profile"),
    "products-supply": getTabProgress("products-supply"),
    "orders-payments": getTabProgress("orders-payments"),
    "shipping-reach": getTabProgress("shipping-reach"),
  }), [getTabProgress]);

  const validate = useCallback((tabOnly = null) => {
    const errs = {};
    const v = (key) => form[key] && String(form[key]).trim();

    if (!tabOnly || tabOnly === "business-profile") {
      if (!form.supplierType || form.supplierType.length === 0) errs.supplierType = "Select at least one supplier type";
      if (!form.buyerTypesServed || form.buyerTypesServed.length === 0) errs.buyerTypesServed = "Select at least one buyer type";
      if (!v("companyDescription")) errs.companyDescription = "Company description is required";
      else if (v("companyDescription").length < 20) errs.companyDescription = "Please provide at least 20 characters";
    }

    if (!tabOnly || tabOnly === "products-supply") {
      if (!v("productsOffered")) errs.productsOffered = "Please describe the products you offer";
      else if (v("productsOffered").length < 10) errs.productsOffered = "Please provide at least 10 characters";
      if (!form.supplyModels || form.supplyModels.length === 0) errs.supplyModels = "Select at least one supply model";
      if (!form.productCategories || form.productCategories.length === 0) errs.productCategories = "Select at least one product category";
    }

    if (!tabOnly || tabOnly === "orders-payments") {
      if (!v("minimumOrderAmount")) errs.minimumOrderAmount = "Minimum order value is required";
      else if (isNaN(parseFloat(form.minimumOrderAmount))) errs.minimumOrderAmount = "Enter a valid amount";
      if (!form.paymentMethods || form.paymentMethods.length === 0) errs.paymentMethods = "Select at least one payment method";
      if (!v("returnPolicy")) errs.returnPolicy = "Return policy is required";
      else if (v("returnPolicy").length < 10) errs.returnPolicy = "Please provide at least 10 characters";
      /* Backup validation for deposit % — UI clamps 0-100 but validate server-side too */
      if (v("defaultDepositPercentage")) {
        const dep = Number(form.defaultDepositPercentage);
        if (isNaN(dep) || dep < 0 || dep > 100) errs.defaultDepositPercentage = "Deposit must be between 0 and 100%";
      }
      /* Validate discount tiers — optional, but incomplete tiers flag a warning */
      if (Array.isArray(form.discountTiers) && form.discountTiers.length > 0) {
        const hasIncomplete = form.discountTiers.some((t) => {
          const hasMin = t.minOrder && parseFloat(t.minOrder) > 0;
          const hasDisc = t.discount && parseFloat(t.discount) > 0 && parseFloat(t.discount) <= 100;
          return (hasMin && !hasDisc) || (!hasMin && hasDisc);
        });
        if (hasIncomplete) errs.discountTiers = "Complete or remove incomplete discount tiers";
      }
    }

    if (!tabOnly || tabOnly === "shipping-reach") {
      if (!form.deliveryMethods || form.deliveryMethods.length === 0) errs.deliveryMethods = "Select at least one delivery method";
      if (!form.countriesServed || form.countriesServed.length === 0) errs.countriesServed = "Select at least one country";
      if (!v("companyWebsite")) errs.companyWebsite = "Company website is required";
      else if (!URL_RE.test(v("companyWebsite"))) errs.companyWebsite = "Enter a valid website URL";
      if (v("socialFacebook") && !URL_RE.test(v("socialFacebook"))) errs.socialFacebook = "Enter a valid URL";
      if (v("socialInstagram") && !URL_RE.test(v("socialInstagram"))) errs.socialInstagram = "Enter a valid URL";
      if (v("socialLinkedin") && !URL_RE.test(v("socialLinkedin"))) errs.socialLinkedin = "Enter a valid URL";
      /* Facility size unit is required when a facility size is entered */
      if (v("facilitySize") && !form.facilitySizeUnit) errs.facilitySizeUnit = "Select a unit for facility size";
      /* Warn if excluded countries overlap with countries served */
      if (form.excludedCountries?.length > 0 && form.countriesServed?.length > 0) {
        const overlap = form.excludedCountries.filter((c) => form.countriesServed.includes(c));
        if (overlap.length > 0) errs.excludedCountries = `${overlap.length} countr${overlap.length === 1 ? "y" : "ies"} also in your served list — remove overlap`;
      }
    }

    return errs;
  }, [form]);

  const handleBlur = useCallback((field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    const fieldErrs = validate();
    setErrors((p) => ({ ...p, [field]: fieldErrs[field] || "" }));
  }, [validate]);

  const findTabForField = useCallback((fieldId) => {
    for (const [tabId, config] of Object.entries(SUPPLIER_TAB_FIELDS)) {
      if (config.required.includes(fieldId) || config.optional.includes(fieldId)) return tabId;
    }
    return "business-profile";
  }, []);

  const handleErrorClick = useCallback((fieldId) => {
    const tab = findTabForField(fieldId);
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
    }, 100);
  }, [findTabForField]);

  const handleSaveAndContinue = () => {
    const currentIdx = SUPPLIER_TABS.findIndex((t) => t.id === activeTab);
    const errs = validate(activeTab);
    setErrors((prev) => {
      const otherErrs = {};
      Object.entries(prev).forEach(([k, v]) => { if (v && findTabForField(k) !== activeTab) otherErrs[k] = v; });
      return { ...otherErrs, ...errs };
    });
    setSubmitted(true);
    setErrorScope("tab");
    if (Object.keys(errs).length > 0) {
      setShowErrorBanner(true);
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
      return;
    }
    setShowErrorBanner(false);
    setSavingTab(true);
    // 🔧 PRODUCTION: Replace setTimeout with actual API call: PUT /api/user/supplier-profile (partial — only current tab fields)
    setTimeout(() => {
      setSavingTab(false);
      setTabSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setTabSaved(false), 1500);
      if (currentIdx < SUPPLIER_TABS.length - 1) {
        setActiveTab(SUPPLIER_TABS[currentIdx + 1].id);
        if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorScope("all");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShowErrorBanner(true);
      const firstErrorKey = Object.keys(errs)[0];
      const errorTab = findTabForField(firstErrorKey);
      setActiveTab(errorTab);
      setTimeout(() => {
        const el = document.getElementById(firstErrorKey);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
      }, 100);
      return;
    }
    setShowErrorBanner(false);
    setSaving(true);
    // 🔧 PRODUCTION: Replace setTimeout with actual API call: PUT /api/user/supplier-profile (full form submission)
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setHasUnsavedChanges(false);
      clearDraft();
      onSave?.(); // Notify parent for stale-profile timestamp tracking
      /* Persist current profile completeness for the sidebar indicator */
      try {
        const af = (f) => Array.isArray(form[f]) && form[f].length > 0;
        const sf = (f) => form[f] && String(form[f]).trim().length > 0;
        const RW = 3, OW = 1; let e = 0, t = 0;
        for (const f of ["supplierType","productCategories","buyerTypesServed","supplyModels","countriesServed","paymentMethods","deliveryMethods"]) { t += RW; if (af(f)) e += RW; }
        for (const f of ["companyDescription","productsOffered","companyWebsite","returnPolicy","minimumOrderAmount"]) { t += RW; if (sf(f)) e += RW; }
        for (const f of ["customersServed","brandsDistributed","productQualityTier","certifications","customizationAbility","excludedCountries"]) { t += OW; if (af(f)) e += OW; }
        for (const f of ["preferredCurrency","paymentTerms","defaultDepositPercentage","defaultDepositTerms","defaultInvoiceType","sanitizedInvoice","defaultTaxClass","defaultIncoterms","discountNotes","facilitySize","socialFacebook","socialInstagram","socialLinkedin","sampleAvailability","catalogueSize","leadTime"]) { t += OW; if (sf(f)) e += OW; }
        t += OW; if (Array.isArray(form.discountTiers) && form.discountTiers.some((x) => x.minOrder && x.discount)) e += OW;
        t += OW; if (form.businessHours && Object.values(form.businessHours).some((d) => d && d.status === "open")) e += OW;
        t += OW; if (form.companyLogo && String(form.companyLogo).trim().length > 0) e += OW;
        localStorage.setItem("wup-supplier-profile-pct", String(Math.round((e / t) * 100)));
      } catch {}
      setActiveTab(SUPPLIER_TABS[0].id);
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }, 800);
  };

  const currentTabIdx = SUPPLIER_TABS.findIndex((t) => t.id === activeTab);
  const isLastTab = currentTabIdx === SUPPLIER_TABS.length - 1;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate id="supplier-profile-form" style={{ scrollMarginTop: "120px" }}>
      {/* ═══ squared paper grid background ═══ */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{
          backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* ═══ HEADER ZONE ═══ */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/90 via-slate-100/60 to-transparent pointer-events-none" />
          <div className="relative px-6 lg:px-8 pt-6 lg:pt-8 pb-0">
            <div className="mb-5 space-y-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Supplier Profile</h1>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Complete your supplier profile to help buyers understand your business and supply capabilities. A fully updated profile receives 4× more buyer inquiries.
                </p>
              </div>
              {/* ═══ SUCCESS BANNER ═══ */}
              {saved && (
                <div className="rounded-xl overflow-hidden border border-emerald-200 animate-fadeIn" role="status">
                  <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-white shrink-0" strokeWidth={3} />
                      <p className="text-sm font-semibold text-white">Supplier profile updated successfully</p>
                    </div>
                    <button type="button" onClick={() => setSaved(false)} className="w-6 h-6 rounded-full hover:bg-emerald-500 flex items-center justify-center transition-colors" aria-label="Dismiss">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                  <div className="bg-emerald-50/80 px-4 py-3">
                    <p className="text-sm text-emerald-700">Your supply capabilities have been saved. Buyers will now see your updated profile when reviewing suppliers.</p>
                  </div>
                </div>
              )}
              <SupplierProfileProgressBar form={form} onPctChange={onProgressChange} />
            </div>

            {/* Tab Bar */}
            <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabStatuses={tabStatuses} tabProgress={tabProgress} tabs={SUPPLIER_TABS} />
          </div>
        </div>

        {/* ═══ FIELDS ZONE ═══ */}
        <div className="relative px-6 lg:px-8 pb-6 lg:pb-8">
          <div className="relative">

            {/* Error Banner */}
            {showErrorBanner && (() => {
              const visibleErrors = errorScope === "tab"
                ? Object.fromEntries(Object.entries(errors).filter(([k, v]) => v && findTabForField(k) === activeTab))
                : errors;
              return (
                <ErrorSummaryPanel
                  errors={visibleErrors}
                  fieldLabels={SUPPLIER_FIELD_LABELS}
                  onFieldClick={handleErrorClick}
                  onDismiss={() => setShowErrorBanner(false)}
                />
              );
            })()}

            {/* ═══ TAB PANELS ═══ */}
            <div className="mt-6">

              {/* ─── Tab 1: Business Profile ─── */}
              {activeTab === "business-profile" && (
                <div role="tabpanel" id="panel-business-profile" aria-labelledby="tab-business-profile" className="space-y-6 animate-fadeIn">
                  <FormSection title="Supplier Type" icon={Building2}>
                    <div className="space-y-5">
                      <MultiSelectDropdown
                        id="supplierType"
                        label="Supplier Type"
                        icon={Building2}
                        options={SUPPLIER_TYPE_OPTIONS}
                        selected={form.supplierType}
                        onChange={(v) => update("supplierType", v)}
                        required
                        error={errors.supplierType}
                        searchPlaceholder="Search supplier types..."
                      />
                      <FloatingTextarea
                        id="companyDescription"
                        label="Describe Your Wholesale Business"
                        required
                        value={form.companyDescription}
                        onChange={(e) => update("companyDescription", e.target.value)}
                        onBlur={handleBlur("companyDescription")}
                        error={errors.companyDescription}
                        maxLength={5000}
                        placeholder="Tell buyers about your company, products, and unique selling points..."
                        help="Min. 20 characters"
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Supply Model" icon={Store}>
                    <div className="space-y-5">
                      <MultiSelectDropdown
                        id="buyerTypesServed"
                        label="Types of Buyers You Serve"
                        icon={Store}
                        options={BUYER_TYPES_SERVED}
                        selected={form.buyerTypesServed}
                        onChange={(v) => update("buyerTypesServed", v)}
                        required
                        error={errors.buyerTypesServed}
                        searchPlaceholder="Search buyer types..."
                      />
                      <MultiSelectDropdown
                        id="customersServed"
                        label="Who Can Place Orders"
                        icon={Store}
                        options={CUSTOMER_TYPES}
                        selected={form.customersServed}
                        onChange={(v) => update("customersServed", v)}
                        searchPlaceholder="Search customer types..."
                      />
                      <MultiSelectDropdown
                        id="supplyModels"
                        label="How You Supply Products"
                        icon={Truck}
                        options={SUPPLY_MODELS}
                        selected={form.supplyModels}
                        onChange={(v) => update("supplyModels", v)}
                        required
                        error={errors.supplyModels}
                        searchPlaceholder="Search supply models..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Company Branding" icon={Building2}>
                    <ImageUploadPlaceholder
                      id="companyLogo"
                      label="Company Logo"
                    />
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 2: Products & Supply ─── */}
              {activeTab === "products-supply" && (
                <div role="tabpanel" id="panel-products-supply" aria-labelledby="tab-products-supply" className="space-y-6 animate-fadeIn">
                  <FormSection title="Supply Capabilities" icon={Package}>
                    <div className="space-y-4">
                      <FloatingTextarea
                        id="productsOffered"
                        label="Product Types & Categories You Supply"
                        required
                        value={form.productsOffered}
                        onChange={(e) => update("productsOffered", e.target.value)}
                        onBlur={handleBlur("productsOffered")}
                        error={errors.productsOffered}
                        maxLength={2000}
                        placeholder="e.g. Men's casual footwear, branded sportswear, LED commercial lighting, organic skincare..."
                        help="Min. 10 characters"
                      />
                      <CategorySelector
                        id="productCategories"
                        label="Product Categories"
                        selected={form.productCategories}
                        onChange={(v) => update("productCategories", v)}
                        required
                        error={errors.productCategories}
                      />
                      <BrandPillInput
                        id="brandsDistributed"
                        label="Brands You Distribute"
                        selected={form.brandsDistributed}
                        onChange={(v) => update("brandsDistributed", v)}
                        error={errors.brandsDistributed}
                        placeholder="Type a brand name, then comma or Enter..."
                        itemLabel="brands"
                      />
                      <FloatingSelect
                        id="catalogueSize"
                        label="Catalogue Size (Number of SKUs)"
                        value={form.catalogueSize}
                        onChange={(v) => update("catalogueSize", v)}
                        options={CATALOGUE_SIZE_OPTIONS}
                        placeholder="Select..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Quality & Samples" icon={Sparkles}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="productQualityTier"
                        label="Product Quality Tier"
                        icon={Sparkles}
                        options={QUALITY_TIERS}
                        selected={form.productQualityTier}
                        onChange={(v) => update("productQualityTier", v)}
                        searchPlaceholder="Search quality tiers..."
                      />
                      <FloatingSelect
                        id="sampleAvailability"
                        label="Sample Availability"
                        value={form.sampleAvailability}
                        onChange={(v) => update("sampleAvailability", v)}
                        options={SAMPLE_OPTIONS}
                        placeholder="Select..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Capabilities" icon={Wrench}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="certifications"
                        label="Certifications"
                        icon={Shield}
                        options={CERTIFICATION_OPTIONS}
                        selected={form.certifications}
                        onChange={(v) => update("certifications", v)}
                        searchPlaceholder="Search certifications..."
                      />
                      <MultiSelectDropdown
                        id="customizationAbility"
                        label="Customization Capability"
                        icon={Wrench}
                        options={CUSTOMIZATION_OPTIONS}
                        selected={form.customizationAbility}
                        onChange={(v) => update("customizationAbility", v)}
                        searchPlaceholder="Search customization options..."
                      />
                    </div>
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 3: Orders & Payments ─── */}
              {activeTab === "orders-payments" && (
                <div role="tabpanel" id="panel-orders-payments" aria-labelledby="tab-orders-payments" className="space-y-6 animate-fadeIn">
                  <FormSection title="Order Requirements" icon={DollarSign}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CurrencyAmountInput
                        id="minimumOrderAmount"
                        label="Minimum Order Value"
                        required
                        currency={form.minimumOrderCurrency}
                        onCurrencyChange={(c) => update("minimumOrderCurrency", c)}
                        amount={form.minimumOrderAmount}
                        onAmountChange={(a) => update("minimumOrderAmount", a)}
                        error={errors.minimumOrderAmount}
                      />
                      <FloatingSelect
                        id="preferredCurrency"
                        label="Preferred Currency"
                        value={form.preferredCurrency}
                        onChange={(v) => update("preferredCurrency", v)}
                        options={CURRENCIES}
                        placeholder="Select..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Payment" icon={CreditCard}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="paymentMethods"
                        label="Payment Methods"
                        icon={CreditCard}
                        options={PAYMENT_METHODS_SUPPLIER}
                        selected={form.paymentMethods}
                        onChange={(v) => update("paymentMethods", v)}
                        required
                        error={errors.paymentMethods}
                        searchPlaceholder="Search payment methods..."
                      />
                      <FloatingTextarea
                        id="paymentTerms"
                        label="Payment Terms"
                        value={form.paymentTerms}
                        onChange={(e) => update("paymentTerms", e.target.value)}
                        maxLength={500}
                        placeholder="e.g. 50% deposit, balance on delivery. Net 30 for established accounts."
                      />
                      {/* Default Deposit — supplier-level default, overridable per deal.
                          PRODUCTION: Stored as supplier_profiles.defaultDepositPercentage (int 0-100)
                          and supplier_profiles.defaultDepositTerms (string).
                          Deals inherit these as deal.depositRequired = { percentage, terms } unless
                          the deal has its own override. */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingField
                          id="defaultDepositPercentage"
                          label="Deposit (%)"
                          type="text"
                          inputMode="numeric"
                          value={form.defaultDepositPercentage}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, "");
                            if (v === "" || (Number(v) >= 0 && Number(v) <= 100)) update("defaultDepositPercentage", v);
                          }}
                          placeholder="e.g. 30"
                          error={errors.defaultDepositPercentage}
                        />
                        <FloatingField
                          id="defaultDepositTerms"
                          label="Deposit Terms"
                          value={form.defaultDepositTerms}
                          onChange={(e) => update("defaultDepositTerms", e.target.value)}
                          placeholder="e.g. 30% upfront, 70% before shipping"
                        />
                      </div>
                    </div>
                  </FormSection>
                  <FormSection title="Invoicing & Tax" icon={FileText}>
                    <div className="space-y-5">
                      {/* Default Invoice Type, Sanitized Invoices & Tax Class — supplier-level defaults, overridable per deal.
                          PRODUCTION: Stored as supplier_profiles.defaultInvoiceType, supplier_profiles.sanitizedInvoice, supplier_profiles.defaultTaxClass.
                          Deals inherit these unless deal-level overrides exist (deal.invoiceType, deal.sanitizedInvoice, deal.taxClass). */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingSelect
                          id="defaultInvoiceType"
                          label="Default Invoice Type"
                          value={form.defaultInvoiceType}
                          onChange={(v) => update("defaultInvoiceType", v)}
                          options={INVOICE_TYPE_OPTIONS}
                          placeholder="Select..."
                        />
                        <FloatingSelect
                          id="sanitizedInvoice"
                          label="Sanitized Invoices"
                          value={form.sanitizedInvoice}
                          onChange={(v) => update("sanitizedInvoice", v)}
                          options={SANITIZED_INVOICE_OPTIONS}
                          placeholder="Select..."
                        />
                      </div>
                      <FloatingSelect
                        id="defaultTaxClass"
                        label="Default Tax Class"
                        value={form.defaultTaxClass}
                        onChange={(v) => update("defaultTaxClass", v)}
                        options={TAX_CLASS_OPTIONS}
                        placeholder="Select..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Returns" icon={Shield}>
                    <FloatingTextarea
                      id="returnPolicy"
                      label="Return Policy"
                      required
                      value={form.returnPolicy}
                      onChange={(e) => update("returnPolicy", e.target.value)}
                      onBlur={handleBlur("returnPolicy")}
                      error={errors.returnPolicy}
                      maxLength={2000}
                      placeholder="Describe your return window, conditions, and who covers return shipping..."
                      help="Min. 10 characters"
                    />
                  </FormSection>
                  <FormSection title="Bulk Discounts" icon={DollarSign}>
                    <DiscountTierBuilder
                      id="discountTiers"
                      tiers={form.discountTiers}
                      onChange={(v) => update("discountTiers", v)}
                      currency={form.preferredCurrency || form.minimumOrderCurrency || "GBP"}
                      notes={form.discountNotes}
                      onNotesChange={(v) => update("discountNotes", v)}
                      onFocusField={onFocusedFieldChange}
                    />
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 4: Shipping & Reach ─── */}
              {activeTab === "shipping-reach" && (
                <div role="tabpanel" id="panel-shipping-reach" aria-labelledby="tab-shipping-reach" className="space-y-6 animate-fadeIn">
                  <FormSection title="Delivery" icon={Truck}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="deliveryMethods"
                        label="Delivery Methods"
                        icon={Truck}
                        options={DELIVERY_METHODS_SUPPLIER}
                        selected={form.deliveryMethods}
                        onChange={(v) => update("deliveryMethods", v)}
                        required
                        error={errors.deliveryMethods}
                        searchPlaceholder="Search delivery methods..."
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingSelect
                          id="leadTime"
                          label="Average Order-to-Delivery Time"
                          value={form.leadTime}
                          onChange={(v) => update("leadTime", v)}
                          options={LEAD_TIME_OPTIONS}
                          placeholder="Select..."
                        />
                        {/* Default Incoterms — supplier-level default, overridable per deal.
                            PRODUCTION: Stored as supplier_profiles.defaultIncoterms.
                            Deals inherit this unless deal-level override exists (deal.incoterms). */}
                        <FloatingSelect
                          id="defaultIncoterms"
                          label="Default Incoterms"
                          value={form.defaultIncoterms}
                          onChange={(v) => update("defaultIncoterms", v)}
                          options={INCOTERMS_OPTIONS}
                          placeholder="Select..."
                        />
                      </div>
                    </div>
                  </FormSection>
                  <FormSection title="Countries Served" icon={Globe}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="countriesServed"
                        label="Countries You Ship To or Serve"
                        icon={Globe}
                        options={[{ value: "all-countries", label: "All Countries (Worldwide)", iso: "globe" }, ...COUNTRIES.map((c) => ({ value: c.value, label: c.label, iso: c.iso }))]}
                        selected={form.countriesServed}
                        onChange={(v) => update("countriesServed", v)}
                        required
                        error={errors.countriesServed}
                        showFlags
                        showCount
                        countNoun="country"
                        searchPlaceholder="Search countries..."
                      />
                      <MultiSelectDropdown
                        id="excludedCountries"
                        label="Excluded Countries"
                        icon={Globe}
                        options={COUNTRIES.map((c) => ({ value: c.value, label: c.label, iso: c.iso }))}
                        selected={form.excludedCountries}
                        onChange={(v) => update("excludedCountries", v)}
                        error={errors.excludedCountries}
                        showFlags
                        showCount
                        countNoun="country"
                        searchPlaceholder="Search countries..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Online Presence" icon={Globe}>
                    <div className="space-y-4">
                      <FloatingField
                        id="companyWebsite"
                        label="Company Website"
                        required
                        type="text"
                        inputMode="url"
                        value={form.companyWebsite}
                        onChange={(e) => update("companyWebsite", e.target.value)}
                        onBlur={handleBlur("companyWebsite")}
                        error={errors.companyWebsite}
                        placeholder="https://example.com"
                        help="Full URL e.g. https://yourcompany.com"
                      />
                      <FloatingField
                        id="socialFacebook"
                        label="Facebook Page"
                        icon={Facebook}
                        type="text"
                        inputMode="url"
                        value={form.socialFacebook}
                        onChange={(e) => update("socialFacebook", e.target.value)}
                        onBlur={handleBlur("socialFacebook")}
                        error={errors.socialFacebook}
                        placeholder="https://facebook.com/yourcompany"
                      />
                      <FloatingField
                        id="socialInstagram"
                        label="Instagram Profile"
                        icon={Instagram}
                        type="text"
                        inputMode="url"
                        value={form.socialInstagram}
                        onChange={(e) => update("socialInstagram", e.target.value)}
                        onBlur={handleBlur("socialInstagram")}
                        error={errors.socialInstagram}
                        placeholder="https://instagram.com/yourcompany"
                      />
                      <FloatingField
                        id="socialLinkedin"
                        label="LinkedIn Page"
                        icon={Linkedin}
                        type="text"
                        inputMode="url"
                        value={form.socialLinkedin}
                        onChange={(e) => update("socialLinkedin", e.target.value)}
                        onBlur={handleBlur("socialLinkedin")}
                        error={errors.socialLinkedin}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Facility" icon={Warehouse}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingField
                        id="facilitySize"
                        label="Facility Size"
                        type="text"
                        inputMode="numeric"
                        value={form.facilitySize}
                        onChange={(e) => update("facilitySize", e.target.value.replace(/[^0-9.,]/g, ""))}
                        onBlur={handleBlur("facilitySize")}
                        error={errors.facilitySize}
                        placeholder="e.g. 2000"
                      />
                      <FloatingSelect
                        id="facilitySizeUnit"
                        label="Unit"
                        required={!!form.facilitySize}
                        value={form.facilitySizeUnit || "m²"}
                        onChange={(v) => update("facilitySizeUnit", v)}
                        error={errors.facilitySizeUnit}
                        options={[
                          { value: "m²", label: "m² (square metres)" },
                          { value: "ft²", label: "ft² (square feet)" },
                        ]}
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Business Hours" icon={Clock}>
                    <BusinessHoursGrid
                      id="businessHours"
                      hours={form.businessHours}
                      onChange={(v) => update("businessHours", v)}
                    />
                  </FormSection>
                </div>
              )}
            </div>
          </div>

          {/* ═══ BOTTOM NAVIGATION ═══ */}
          <div className="pt-6 pb-2 mt-6">
            {hasUnsavedChanges && !saving && !saved && (
              <p className="text-xs text-orange-500 text-right mb-2 flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Unsaved changes
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 active:scale-95"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Shield size={16} />}
                {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
              </button>
              {!isLastTab && (
                <button
                  type="button"
                  onClick={handleSaveAndContinue}
                  disabled={savingTab}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {savingTab ? <Loader2 size={15} className="animate-spin" /> : tabSaved ? <Check size={15} /> : null}
                  {savingTab ? "Saving..." : tabSaved ? "Saved!" : "Save & Continue"}
                  {!savingTab && !tabSaved && <ArrowRight size={15} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER PROFILE PAGE — wrapper with sidebar + tips
   ═══════════════════════════════════════════════════ */

export function SupplierProfilePage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");
  const [tipsCollapsed, toggleTips] = usePanelCollapse("wup-tips-collapsed");
  const [focusedField, setFocusedField] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("business-profile");

  /* ─── Stale profile tracking (lives at page level so banner renders outside the form card) ─── */
  const { recordSave, getDaysStale } = useProfileSaveTime("supplier");
  /* daysStale must be state (not a direct call) to avoid hydration mismatch:
     server has no localStorage → null, client reads a value → number.
     Initialize to null (matches server), then sync in useEffect. */
  const [daysStale, setDaysStale] = useState(null);
  useEffect(() => { setDaysStale(getDaysStale()); }, [getDaysStale]);
  const [staleDismissed, setStaleDismissed] = useState(false);
  const showStaleWarning = daysStale !== null && daysStale >= 30 && !staleDismissed;
  const formRef = useRef(null);
  /* When the form saves, record timestamp AND hide the banner immediately
     (daysStale is computed once at render and won't reactively update).
     Also bump saveCount so the AccountSidebar re-reads staleness. */
  const [saveCount, setSaveCount] = useState(0);
  const handleSave = useCallback(() => {
    recordSave();
    setStaleDismissed(true);
    setSaveCount((c) => c + 1);
  }, [recordSave]);

  /* ─── Live profile completeness for sidebar ─── */
  const [livePct, setLivePct] = useState(null);
  const handleProgressChange = useCallback((pct) => {
    setLivePct(pct);
    /* Keep localStorage in sync so the sidebar shows the correct pct on OTHER pages */
    try { localStorage.setItem("wup-supplier-profile-pct", String(pct)); } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Supplier Profile", href: "/dashboard/supplier-profile" },
          { label: "Edit Profile" },
        ]} />
        <MobileDashboardNav activePage="supplier-profile" />

        <div className="flex gap-6 items-start">
          {/* Left: Account Sidebar */}
          <AccountSidebar user={user} activePage="supplier-profile" collapsed={sidebarCollapsed} onToggle={toggleSidebar} profilePct={livePct} profileSavedAt={saveCount} />

          {/* Center: Form */}
          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />
            {/* ═══ STALE PROFILE WARNING — above the form card ═══ */}
            {showStaleWarning && (
              <StaleProfileBanner
                daysStale={daysStale}
                profileType="supplier"
                onDismiss={() => setStaleDismissed(true)}
                onReviewClick={() => {
                  if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            )}
            <div ref={formRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <SupplierProfileForm user={user} onFocusedFieldChange={setFocusedField} onActiveTabChange={setActiveFormTab} onSave={handleSave} onProgressChange={handleProgressChange} />
            </div>
          </div>

          {/* Right: Contextual Tips Panel — 2xl+ only */}
          <SharedFormTipsPanel
            focusedField={focusedField}
            activeTab={activeFormTab}
            collapsed={tipsCollapsed}
            onToggle={toggleTips}
            tipsData={SUPPLIER_TIPS_DATA}
            defaultTips={SUPPLIER_TAB_DEFAULT_TIPS}
            defaultTabKey="business-profile"
            bottomSection={SUPPLIER_TIPS_BOTTOM}
            iconFallback={Building2}
          />
        </div>
      </div>

      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}

export default SupplierProfilePage;
