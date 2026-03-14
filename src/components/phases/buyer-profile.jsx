"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/shared/breadcrumb";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { FormTipsPanel as SharedFormTipsPanel, WhyItMattersSection } from "@/components/shared/form-tips-panel";
import {
  ShoppingBag, Building2, Package, Search, Tag, Globe, Truck, DollarSign,
  Check, X, ChevronDown, AlertTriangle, Loader2, Shield,
  ArrowRight, Store, Factory, Boxes, Warehouse, CreditCard, Banknote,
  Mail, Phone, MessageSquare, ChevronLeft, ChevronRight, User,
  MapPin, Languages, Heart, Settings, LayoutDashboard, KeyRound, Coins,
  MessageCircle, Clock, PlusCircle, Sparkles, Crown, HelpCircle,
} from "lucide-react";
import { useFormDraft } from "@/components/shared/use-form-draft";
import { useProfileSaveTime } from "@/components/shared/use-profile-save-time";
import { StaleProfileBanner } from "@/components/shared/stale-profile-banner";
import {
  FlagImg, useDropdown, FloatingField, FloatingSelect, FloatingTextarea, FormSection,
  TabStatus, ProfileTabBar, ErrorSummaryPanel, AccountSidebar, UpgradeBanner, MobileDashboardNav,
  usePageUser, MultiSelect, COUNTRIES, CURRENCIES, TIER_CONFIG, TIER_CTA,
  CURRENCY_SYMBOLS, useHeaderCurrency, CurrencyAmountInput, PRODUCT_CATEGORY_TREE,
  CategorySelector, BrandPillInput, ImageUploadPlaceholder,
} from "./dashboard";

/* ═══════════════════════════════════════════════════
   REFERENCE DATA
   ═══════════════════════════════════════════════════ */

const BUYER_TABS = [
  { id: "business-profile", label: "Buyer Profile", icon: Building2, shortLabel: "Buyer" },
  { id: "sourcing-preferences", label: "Sourcing Preferences", icon: Search, shortLabel: "Sourcing" },
  { id: "purchasing-logistics", label: "Orders & Payment", icon: Coins, shortLabel: "Orders" },
  { id: "profile-visibility", label: "Online Presence & Market Focus", icon: User, shortLabel: "Reach" },
];

const BUYER_TAB_FIELDS = {
  "business-profile": { required: ["buyerType", "describeBusiness", "preferredSupplierTypes", "sourcingModels"], optional: ["companyLogo"] },
  "sourcing-preferences": { required: ["productsLookingFor", "productCategories", "countriesSourceFrom"], optional: ["brandsInterestedIn", "productQualityTier", "certificationRequirements", "excludedCountries", "sampleRequirements", "customizationNeeds"] },
  "purchasing-logistics": { required: ["preferredPaymentMethods", "preferredDeliveryOptions"], optional: ["annualSalesVolume", "annualPurchasingVolume", "highestMinimumOrder", "moqComfortLevel", "preferredCurrency", "leadTimeRequirement", "acceptableDepositTerms"] },
  "profile-visibility": { required: [], optional: ["shopWebsiteUrl", "focusMarkets", "communicationPreferences", "businessHoursNote", "socialFacebook", "socialInstagram", "socialLinkedin"] },
};

/* Matches BUYER_TYPES_SERVED in supplier-profile (shared values for cross-matching) */
const BUYER_TYPES = [
  { value: "online-retailer", label: "Online Retailer" },
  { value: "shop-retailer", label: "Shop / High Street Retailer" },
  { value: "multi-chain", label: "Multi-Chain Retailer" },
  { value: "marketplace-seller", label: "Marketplace Seller (Amazon, eBay, etc.)" },
  { value: "dropshipper", label: "Dropshipper" },
  { value: "market-trader", label: "Market Trader" },
  { value: "wholesaler-reseller", label: "Wholesaler / Reseller" },
  { value: "distributor", label: "Distributor / Importer" },
  { value: "supermarket", label: "Supermarket / Grocery" },
  { value: "hospitality", label: "Hospitality / HoReCa" },
  { value: "corporate-buyer", label: "Corporate / Procurement" },
  { value: "franchisee", label: "Franchisee" },
  { value: "charity-nonprofit", label: "Charity / Non-Profit" },
  { value: "government", label: "Government / Public Sector" },
  { value: "subscription-box", label: "Subscription Box Service" },
  { value: "social-commerce", label: "Social Commerce Seller" },
  { value: "mail-order", label: "Mail Order / Catalogue" },
  { value: "other", label: "Other" },
];

/* Ordered: production → brand → distribution → fulfillment → niche (matches SUPPLIER_TYPE_OPTIONS in supplier-profile) */
const SUPPLIER_TYPES = [
  { value: "manufacturer", label: "Manufacturers" },
  { value: "brand-owner", label: "Brand Owners" },
  { value: "private-label", label: "Private Label / White Label" },
  { value: "wholesaler", label: "Wholesalers" },
  { value: "distributor", label: "Distributors" },
  { value: "importer", label: "Importers" },
  { value: "exporter", label: "Exporters" },
  { value: "trading-company", label: "Trading Companies" },
  { value: "liquidator", label: "Liquidators / Clearance" },
  { value: "dropshipper", label: "Dropshippers" },
  { value: "sourcing-agent", label: "Sourcing Agents" },
  { value: "artisan-maker", label: "Artisans / Makers" },
];

const QUALITY_TIERS = [
  { value: "budget", label: "Budget / Value" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
];

/* Matches CERTIFICATION_OPTIONS in supplier-profile (shared values for cross-matching) */
const CERTIFICATIONS = [
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

/* Ordered by popularity in UK B2B wholesale */
const PAYMENT_METHODS = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "credit-debit-card", label: "Credit / Debit Card" },
  { value: "trade-credit", label: "Trade Credit (Net 30/60/90)" },
  { value: "paypal", label: "PayPal" },
  { value: "cash-on-delivery", label: "Cash on Delivery" },
  { value: "bnpl", label: "Buy Now Pay Later (B2B)" },
  { value: "letter-of-credit", label: "Letter of Credit" },
  { value: "escrow", label: "Escrow" },
];

/* Matches DELIVERY_METHODS_SUPPLIER in supplier-profile (shared values for cross-matching) */
const DELIVERY_OPTIONS = [
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

/* Aligned with account-profile contact tab fields:
   phoneNumber, telephone, businessEmail, personalEmail, teamsHandle, linkedinUrl, whatsappNumber */
const COMMUNICATION_PREFS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "linkedin", label: "LinkedIn" },
];

const BUSINESS_MODELS = [
  { value: "online-retail", label: "Online Retail" },
  { value: "physical-retail", label: "Physical Retail" },
  { value: "distribution", label: "Distribution" },
  { value: "marketplace-seller", label: "Marketplace Seller" },
  { value: "franchise", label: "Franchise" },
  { value: "b2b-trade", label: "B2B / Trade" },
];

const MOQ_LEVELS = [
  { value: "under-100", label: "Under £100" },
  { value: "100-500", label: "£100 – £500" },
  { value: "500-2000", label: "£500 – £2,000" },
  { value: "2000-10000", label: "£2,000 – £10,000" },
  { value: "10000+", label: "£10,000+" },
  { value: "no-preference", label: "No Preference" },
];

const SOURCING_MODELS = [
  { value: "wholesale", label: "Wholesale", desc: "Traditional bulk buying" },
  { value: "dropshipping", label: "Dropshipping", desc: "Supplier ships direct to end customer" },
  { value: "liquidation", label: "Liquidation", desc: "Clearance & overstock goods" },
  { value: "white-label", label: "White Label", desc: "Unbranded products you rebrand" },
  { value: "private-label", label: "Private Label", desc: "Custom manufactured under your brand" },
  { value: "job-lots", label: "Job Lots", desc: "Mixed / assorted bulk lots" },
];

/* Matches SAMPLE_OPTIONS in supplier-profile (shared values for cross-matching) */
const SAMPLE_REQUIREMENT_OPTIONS = [
  { value: "free", label: "Free Samples Required" },
  { value: "paid", label: "Willing to Pay for Samples" },
  { value: "on-request", label: "Samples on Request" },
  { value: "not-required", label: "Not Required" },
];

/* Matches CUSTOMIZATION_OPTIONS in supplier-profile (shared values for cross-matching) */
const CUSTOMIZATION_NEED_OPTIONS = [
  { value: "minor-customization", label: "Minor Customization" },
  { value: "drawing-based", label: "Drawing-Based Customization" },
  { value: "sample-based", label: "Sample-Based Customization" },
  { value: "full-customization", label: "Full Customization" },
  { value: "print-on-demand", label: "Print on Demand" },
  { value: "custom-packaging", label: "Custom Packaging" },
  { value: "custom-labeling", label: "Custom Labeling" },
  { value: "private-labeling", label: "Private Labeling" },
  { value: "private-label-formulation", label: "Private Label Formulation" },
  { value: "logo-printing", label: "Logo Printing" },
  { value: "custom-firmware", label: "Custom Firmware" },
  { value: "none", label: "No Customization Needed" },
];

/* Matches LEAD_TIME_OPTIONS in supplier-profile (shared values for cross-matching) */
const LEAD_TIME_REQUIREMENT_OPTIONS = [
  { value: "same-day", label: "Same Day" },
  { value: "1-2-days", label: "1–2 Business Days" },
  { value: "3-5-days", label: "3–5 Business Days" },
  { value: "1-2-weeks", label: "1–2 Weeks" },
  { value: "2-4-weeks", label: "2–4 Weeks" },
  { value: "4-8-weeks", label: "4–8 Weeks" },
  { value: "8-plus-weeks", label: "8+ Weeks" },
  { value: "flexible", label: "Flexible / No Preference" },
];

const DEPOSIT_TERM_OPTIONS = [
  { value: "no-deposit", label: "No Deposit" },
  { value: "up-to-10", label: "Up to 10%" },
  { value: "up-to-25", label: "Up to 25%" },
  { value: "up-to-50", label: "Up to 50%" },
  { value: "full-prepayment", label: "Full Prepayment" },
  { value: "negotiable", label: "Negotiable / Case by Case" },
];

/* PRODUCT_CATEGORY_TREE — imported from shared form-fields via dashboard */

const BUYER_FIELD_LABELS = {
  buyerType: "Buyer Type",
  describeBusiness: "Describe Your Retail or Sourcing Business",
  productsLookingFor: "Product Types & Categories You Source",
  productCategories: "Product Categories",
  brandsInterestedIn: "Brands You're Interested In",
  preferredSupplierTypes: "Preferred Supplier Types",
  productQualityTier: "Product Quality Tier",
  certificationRequirements: "Certification Requirements",
  annualSalesVolume: "Annual Sales Volume",
  annualPurchasingVolume: "Annual Purchasing Volume",
  highestMinimumOrder: "Maximum MOQ You'll Accept",
  moqComfortLevel: "MOQ Comfort Level",
  preferredCurrency: "Preferred Currency",
  sourcingModels: "How You Source Products",
  countriesSourceFrom: "Countries to Source From",
  excludedCountries: "Countries You Won't Source From",
  preferredPaymentMethods: "Preferred Payment Methods",
  preferredDeliveryOptions: "Preferred Delivery Options",
  shopWebsiteUrl: "Your Website",
  focusMarkets: "Focus Markets",
  communicationPreferences: "Communication Preferences",
  sampleRequirements: "Sample Requirements",
  customizationNeeds: "Customization Needs",
  leadTimeRequirement: "Lead Time Requirement",
  acceptableDepositTerms: "Acceptable Deposit Terms",
  companyLogo: "Company Logo",
  businessHoursNote: "Business Hours Note",
  socialFacebook: "Facebook Page",
  socialInstagram: "Instagram Profile",
  socialLinkedin: "LinkedIn Page",
};

const BUYER_REQUIRED_FIELDS = {
  buyerType: "Buyer Type",
  describeBusiness: "Describe Your Retail or Sourcing Business",
  productsLookingFor: "Product Types & Categories You Source",
  productCategories: "Product Categories",
  preferredSupplierTypes: "Preferred Supplier Types",
  countriesSourceFrom: "Countries to Source From",
  preferredPaymentMethods: "Preferred Payment Methods",
  preferredDeliveryOptions: "Preferred Delivery Options",
};

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

/* ═══════════════════════════════════════════════════
   TIPS DATA
   ═══════════════════════════════════════════════════ */

const BUYER_TIPS_DATA = {
  buyerType: { title: "Buyer Type", tip: "Select all that apply. This helps suppliers understand your business model and send relevant offers. Profiles with clear buyer types receive 2× more targeted deals.", icon: ShoppingBag },
  describeBusiness: { title: "Describe Your Retail or Sourcing Business", tip: "Give suppliers context about your company, target market, and scale. Detailed descriptions help suppliers assess fit before reaching out.", icon: Building2 },
  productsLookingFor: { title: "Product Types & Categories You Source", tip: "List the specific product types and categories you want to buy — e.g. 'women's fashion accessories, organic skincare, LED lighting'. Specificity attracts better supplier matches.", icon: Package },
  productCategories: { title: "Product Categories", tip: "Select the categories you actively source in. Suppliers use this to send you relevant new product alerts.", icon: Tag },
  brandsInterestedIn: { title: "Brands of Interest", tip: "List specific brands you want to source. Some suppliers specialise in particular brands or can help you find alternatives.", icon: Tag },
  preferredSupplierTypes: { title: "Supplier Types", tip: "Different supplier types offer different advantages — wholesalers for bulk pricing, manufacturers for custom orders, liquidators for clearance deals.", icon: Store },
  productQualityTier: { title: "Quality Tier", tip: "Setting quality expectations upfront saves time for both you and suppliers. Premium suppliers won't pitch budget products and vice versa.", icon: Sparkles },
  certificationRequirements: { title: "Certifications", tip: "If you sell in regulated markets (EU, US), specifying required certifications filters out non-compliant suppliers.", icon: Shield },
  annualSalesVolume: { title: "Annual Sales Volume", tip: "Gives suppliers an idea of your business size. Higher volumes often unlock better wholesale pricing tiers.", icon: DollarSign },
  annualPurchasingVolume: { title: "Annual Purchasing Volume", tip: "Shows suppliers how much you spend on stock annually. This directly influences the deals and payment terms offered to you.", icon: DollarSign },
  highestMinimumOrder: { title: "Maximum MOQ You'll Accept", tip: "What's the highest minimum order quantity or value you're willing to commit to? This filters out suppliers whose MOQs exceed your budget.", icon: Package },
  moqComfortLevel: { title: "MOQ Comfort Level", tip: "Your comfort level for minimum order values helps suppliers propose appropriate deal sizes.", icon: Package },
  preferredCurrency: { title: "Preferred Currency", tip: "Choose the currency you prefer for transactions. Suppliers can then quote in your preferred currency.", icon: DollarSign },
  sourcingModels: { title: "How You Source Products", tip: "Select all the ways you source — wholesale, dropship, white-label, etc. Suppliers use this to propose the right fulfilment model for your needs.", icon: Truck },
  countriesSourceFrom: { title: "Source Countries", tip: "Select countries you prefer to source from. This affects shipping costs, delivery times, and product availability.", icon: Globe },
  excludedCountries: { title: "Countries You Won't Source From", tip: "Select countries you do not want to source from. Suppliers in these countries will be filtered out of your search results.", icon: Globe },
  preferredPaymentMethods: { title: "Payment Methods", tip: "Suppliers check payment compatibility before engaging. More payment options means more supplier matches.", icon: CreditCard },
  preferredDeliveryOptions: { title: "Delivery Options", tip: "Let suppliers know if you need delivery to your location or if you can collect from their warehouse.", icon: Truck },
  shopWebsiteUrl: { title: "Website", tip: "Adding your website helps suppliers verify your business and understand your brand positioning.", icon: Globe },
  focusMarkets: { title: "Focus Markets", tip: "Where do you sell? This helps suppliers understand your customer base and regulatory requirements.", icon: Globe },
  communicationPreferences: { title: "Communication", tip: "Let suppliers know how you prefer to be contacted for faster, smoother communication.", icon: MessageSquare },
  sampleRequirements: { title: "Sample Requirements", tip: "Let suppliers know whether you expect free samples, are willing to pay, or only need them on request. Clear expectations speed up supplier negotiations.", icon: Package },
  customizationNeeds: { title: "Customization Needs", tip: "Tell suppliers what types of customization you need — private labeling, custom packaging, logo printing, etc. Suppliers who can't meet your needs won't waste your time.", icon: Settings },
  leadTimeRequirement: { title: "Lead Time", tip: "How quickly do you need orders fulfilled? This helps suppliers assess whether they can meet your delivery timelines before engaging.", icon: Clock },
  acceptableDepositTerms: { title: "Deposit Terms", tip: "What deposit percentage are you comfortable with? Setting this upfront avoids negotiation friction and helps suppliers offer compatible payment terms.", icon: Banknote },
  companyLogo: { title: "Company Logo", tip: "Upload your company logo to make your profile look professional. Suppliers trust verified businesses with branded profiles.", icon: Building2 },
  businessHoursNote: { title: "Business Hours", tip: "Let suppliers know when you're available. This is especially useful for international suppliers in different time zones.", icon: Clock },
  socialFacebook: { title: "Facebook Page", tip: "Adding your Facebook business page helps suppliers verify your online presence and brand legitimacy.", icon: Globe },
  socialInstagram: { title: "Instagram", tip: "Share your Instagram profile to showcase your brand aesthetic and product range to potential suppliers.", icon: Globe },
  socialLinkedin: { title: "LinkedIn", tip: "A LinkedIn profile adds professional credibility and helps suppliers connect with your team.", icon: Globe },
};

const BUYER_TAB_DEFAULT_TIPS = {
  "business-profile": { title: "Buyer Profile", tip: "Tell suppliers who you are. A complete buyer profile with buyer type and description receives 3× more relevant supplier matches.", icon: Building2 },
  "sourcing-preferences": { title: "Sourcing Preferences", tip: "Define what you're looking for and where you source. Specific product, supplier, and geography preferences help our matching algorithm find the best deals for you.", icon: Search },
  "purchasing-logistics": { title: "Orders & Payment", tip: "Share your buying power, lead time needs, and payment preferences. Suppliers use this to offer volume discounts, propose suitable terms, and assess fulfilment compatibility.", icon: Coins },
  "profile-visibility": { title: "Online Presence & Market Focus", tip: "Define your target markets, online presence, and how suppliers should contact you.", icon: User },
};

/* useHeaderCurrency — imported from shared form-fields via dashboard */

/* MultiSelectDropdown — backward-compatible wrapper around shared MultiSelect */
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

/* CURRENCY_SYMBOLS + CurrencyAmountInput — imported from shared form-fields via dashboard */

/* TagSelector — backward-compatible wrapper around shared MultiSelect */
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

/* CategorySelector — imported from shared form-fields via dashboard */

/* BrandPillInput — imported from shared form-fields via dashboard */

/* ImageUploadPlaceholder — imported from shared form-fields via dashboard */

/* FocusMarketSelector — backward-compatible wrapper around shared MultiSelect */
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
   BUYER PROFILE PROGRESS BAR
   ═══════════════════════════════════════════════════ */

function BuyerProfileProgressBar({ form, onPctChange }) {
  const REQUIRED_WEIGHT = 3;
  const OPTIONAL_WEIGHT = 1;

  const requiredArrayFields = ["buyerType", "productCategories", "preferredSupplierTypes", "countriesSourceFrom", "preferredPaymentMethods", "preferredDeliveryOptions", "sourcingModels"];
  const requiredStringFields = ["describeBusiness", "productsLookingFor"];
  const optionalArrayFields = ["productQualityTier", "certificationRequirements", "brandsInterestedIn", "excludedCountries", "focusMarkets", "communicationPreferences", "sampleRequirements", "customizationNeeds"];
  const optionalStringFields = ["annualSalesVolume", "annualPurchasingVolume", "highestMinimumOrder", "moqComfortLevel", "preferredCurrency", "shopWebsiteUrl", "leadTimeRequirement", "acceptableDepositTerms", "businessHoursNote", "socialFacebook", "socialInstagram", "socialLinkedin"];

  const isArrayFilled = (f) => Array.isArray(form[f]) && form[f].length > 0;
  const isStringFilled = (f) => form[f] && String(form[f]).trim().length > 0;

  let earned = 0, total = 0;
  for (const f of requiredArrayFields) { total += REQUIRED_WEIGHT; if (isArrayFilled(f)) earned += REQUIRED_WEIGHT; }
  for (const f of requiredStringFields) { total += REQUIRED_WEIGHT; if (isStringFilled(f)) earned += REQUIRED_WEIGHT; }
  for (const f of optionalArrayFields) { total += OPTIONAL_WEIGHT; if (isArrayFilled(f)) earned += OPTIONAL_WEIGHT; }
  for (const f of optionalStringFields) { total += OPTIONAL_WEIGHT; if (isStringFilled(f)) earned += OPTIONAL_WEIGHT; }
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
    ? "Let's get started — fill in your buyer profile"
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
const BUYER_TIPS_BOTTOM = (
  <WhyItMattersSection items={[
    "Detailed profiles get 3× more supplier responses",
    "Clear sourcing preferences attract better deals",
    "Complete buyers unlock premium supplier access",
  ]} />
);

/* ═══════════════════════════════════════════════════
   BUYER PROFILE FORM — main 4-tab form
   ═══════════════════════════════════════════════════ */

function BuyerProfileForm({ user, onFocusedFieldChange, onActiveTabChange, onSave, onProgressChange }) {
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(BUYER_TABS[0].id);

  /* ─── Header currency sync ─── */
  // 🔧 PRODUCTION: On mount, fetch the user's saved buyer profile from the database.
  // If the database contains saved currency+amount entries for a field, use those values
  // and mark the field's currency as "user-overridden" so it won't sync with the header.
  // If no saved value exists, default the currency to the user's account-level preferred
  // currency, then fall back to the header currency.
  const headerCurrency = useHeaderCurrency();

  // Track which currency fields the user has explicitly changed (won't auto-sync)
  const userOverriddenCurrencies = useRef({ currencySales: false, currencyPurchasing: false, currencyMOQ: false, preferredCurrency: false });

  // 🔧 PRODUCTION: Replace initial state with data fetched from the database.
  // Fields with stored values should be pre-populated; currency fields should have
  // userOverriddenCurrencies set to true for any field that has a saved DB entry.
  const [form, setForm] = useState(() => ({
    buyerType: [], describeBusiness: "",
    productsLookingFor: "", productCategories: [], brandsInterestedIn: [],
    preferredSupplierTypes: [], productQualityTier: [], certificationRequirements: [],
    sampleRequirements: [], customizationNeeds: [],
    annualSalesVolume: "", annualPurchasingVolume: "", highestMinimumOrder: "",
    currencySales: headerCurrency, currencyPurchasing: headerCurrency, currencyMOQ: headerCurrency,
    moqComfortLevel: "", preferredCurrency: headerCurrency, sourcingModels: [],
    leadTimeRequirement: "", acceptableDepositTerms: "",
    countriesSourceFrom: [], excludedCountries: [], preferredPaymentMethods: [], preferredDeliveryOptions: [],
    shopWebsiteUrl: "", focusMarkets: [], communicationPreferences: [],
    companyLogo: null, businessHoursNote: "",
    socialFacebook: "", socialInstagram: "", socialLinkedin: "",
  }));

  /* ─── localStorage draft persistence + beforeunload warning ─── */
  const { clearDraft } = useFormDraft("wup-buyer-profile-draft", form, setForm);

  /* Mark draft-restored or DB-loaded currencies as overridden so header sync doesn't clobber them */
  const draftSyncedRef = useRef(false);
  useEffect(() => {
    if (draftSyncedRef.current) return;
    draftSyncedRef.current = true;
    if (form.currencySales && form.currencySales !== headerCurrency) userOverriddenCurrencies.current.currencySales = true;
    if (form.currencyPurchasing && form.currencyPurchasing !== headerCurrency) userOverriddenCurrencies.current.currencyPurchasing = true;
    if (form.currencyMOQ && form.currencyMOQ !== headerCurrency) userOverriddenCurrencies.current.currencyMOQ = true;
    if (form.preferredCurrency && form.preferredCurrency !== headerCurrency) userOverriddenCurrencies.current.preferredCurrency = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync non-overridden currency fields when header currency changes */
  useEffect(() => {
    setForm((prev) => {
      const next = { ...prev };
      if (!userOverriddenCurrencies.current.currencySales) next.currencySales = headerCurrency;
      if (!userOverriddenCurrencies.current.currencyPurchasing) next.currencyPurchasing = headerCurrency;
      if (!userOverriddenCurrencies.current.currencyMOQ) next.currencyMOQ = headerCurrency;
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

  /* ─── Bubble up focused field & tab ─── */
  useEffect(() => { if (onFocusedFieldChange) onFocusedFieldChange(focusedField); }, [focusedField, onFocusedFieldChange]);
  useEffect(() => { if (onActiveTabChange) onActiveTabChange(activeTab); }, [activeTab, onActiveTabChange]);

  /* ─── Focus tracking ─── */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onFocusIn = (e) => { if (e.target.id) setFocusedField(e.target.id); };
    const onFocusOut = () => setFocusedField(null);
    form.addEventListener("focusin", onFocusIn);
    form.addEventListener("focusout", onFocusOut);
    return () => { form.removeEventListener("focusin", onFocusIn); form.removeEventListener("focusout", onFocusOut); };
  }, []);

  /* ─── Re-validate a single field on change (clears error as soon as input is valid) ─── */
  const revalidateField = useCallback((field, value) => {
    // Array fields (multi-select)
    if (Array.isArray(value)) {
      if (BUYER_REQUIRED_FIELDS[field] && value.length === 0) return `${BUYER_REQUIRED_FIELDS[field]} is required`;
      return "";
    }
    const val = value && String(value).trim();
    // Required string check
    if (BUYER_REQUIRED_FIELDS[field] && !val) return `${BUYER_REQUIRED_FIELDS[field]} is required`;
    if (!val) return "";
    // Field-specific checks
    switch (field) {
      case "describeBusiness":
        if (val.length < 20) return "Please provide at least 20 characters";
        break;
      case "productsLookingFor":
        if (val.length < 10) return "Please provide at least 10 characters";
        break;
      case "annualSalesVolume":
      case "annualPurchasingVolume":
      case "highestMinimumOrder":
        if (isNaN(parseFloat(val))) return "Enter a valid amount";
        break;
      case "shopWebsiteUrl":
      case "socialFacebook":
      case "socialInstagram":
      case "socialLinkedin":
        if (!URL_RE.test(val)) return "Enter a valid URL";
        break;
      default:
        break;
    }
    return "";
  }, []);

  /* ─── Update helper ─── */
  const update = useCallback((field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setHasUnsavedChanges(true);
    // Mark currency fields as user-overridden so they stop syncing with header
    if (field === "currencySales" || field === "currencyPurchasing" || field === "currencyMOQ" || field === "preferredCurrency") {
      userOverriddenCurrencies.current[field] = true;
    }
    if (touched[field] || submitted) {
      // Re-validate on every change — error clears as soon as input becomes valid
      const err = revalidateField(field, value);
      setErrors((p) => ({ ...p, [field]: err }));
    }
  }, [touched, submitted, revalidateField]);

  /* ─── Tab status computation ─── */
  const getTabStatus = useCallback((tabId) => {
    const config = BUYER_TAB_FIELDS[tabId];
    if (!config) return "empty";
    const isFilled = (f) => {
      const val = form[f];
      if (Array.isArray(val)) return val.length > 0;
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
    "sourcing-preferences": getTabStatus("sourcing-preferences"),
    "purchasing-logistics": getTabStatus("purchasing-logistics"),
    "profile-visibility": getTabStatus("profile-visibility"),
  }), [getTabStatus]);

  /* ─── Per-tab progress fraction (0-1) for progress circle badges ─── */
  const getTabProgress = useCallback((tabId) => {
    const config = BUYER_TAB_FIELDS[tabId];
    if (!config) return 0;
    const REQUIRED_WEIGHT = 3;
    const OPTIONAL_WEIGHT = 1;
    let earned = 0, total = 0;
    const isFilled = (f) => {
      const val = form[f];
      if (Array.isArray(val)) return val.length > 0;
      return val && String(val).trim().length > 0;
    };
    for (const f of config.required) { total += REQUIRED_WEIGHT; if (isFilled(f)) earned += REQUIRED_WEIGHT; }
    for (const f of config.optional) { total += OPTIONAL_WEIGHT; if (isFilled(f)) earned += OPTIONAL_WEIGHT; }
    return total > 0 ? earned / total : 0;
  }, [form]);

  const tabProgress = useMemo(() => ({
    "business-profile": getTabProgress("business-profile"),
    "sourcing-preferences": getTabProgress("sourcing-preferences"),
    "purchasing-logistics": getTabProgress("purchasing-logistics"),
    "profile-visibility": getTabProgress("profile-visibility"),
  }), [getTabProgress]);

  /* ─── Validation ─── */
  const validate = useCallback((tabOnly = null) => {
    const errs = {};
    const v = (key) => form[key] && String(form[key]).trim();

    if (!tabOnly || tabOnly === "business-profile") {
      if (!form.buyerType || form.buyerType.length === 0) errs.buyerType = "Select at least one buyer type";
      if (!v("describeBusiness")) errs.describeBusiness = "Business description is required";
      else if (v("describeBusiness").length < 20) errs.describeBusiness = "Please provide at least 20 characters";
      if (!form.preferredSupplierTypes || form.preferredSupplierTypes.length === 0) errs.preferredSupplierTypes = "Select at least one supplier type";
      if (!form.sourcingModels || form.sourcingModels.length === 0) errs.sourcingModels = "Select at least one sourcing model";
    }

    if (!tabOnly || tabOnly === "sourcing-preferences") {
      if (!v("productsLookingFor")) errs.productsLookingFor = "Please describe the products you're looking for";
      else if (v("productsLookingFor").length < 10) errs.productsLookingFor = "Please provide at least 10 characters";
      if (!form.productCategories || form.productCategories.length === 0) errs.productCategories = "Select at least one product category";
    }

    if (!tabOnly || tabOnly === "purchasing-logistics") {
      if (v("annualSalesVolume") && isNaN(parseFloat(form.annualSalesVolume))) errs.annualSalesVolume = "Enter a valid amount";
      if (v("annualPurchasingVolume") && isNaN(parseFloat(form.annualPurchasingVolume))) errs.annualPurchasingVolume = "Enter a valid amount";
      if (v("highestMinimumOrder") && isNaN(parseFloat(form.highestMinimumOrder))) errs.highestMinimumOrder = "Enter a valid amount";
      if (!form.countriesSourceFrom || form.countriesSourceFrom.length === 0) errs.countriesSourceFrom = "Select at least one country";
      if (!form.preferredPaymentMethods || form.preferredPaymentMethods.length === 0) errs.preferredPaymentMethods = "Select at least one payment method";
      if (!form.preferredDeliveryOptions || form.preferredDeliveryOptions.length === 0) errs.preferredDeliveryOptions = "Select at least one delivery option";
    }

    if (!tabOnly || tabOnly === "profile-visibility") {
      if (v("shopWebsiteUrl") && !URL_RE.test(v("shopWebsiteUrl"))) errs.shopWebsiteUrl = "Enter a valid website URL";
      if (v("socialFacebook") && !URL_RE.test(v("socialFacebook"))) errs.socialFacebook = "Enter a valid Facebook URL";
      if (v("socialInstagram") && !URL_RE.test(v("socialInstagram"))) errs.socialInstagram = "Enter a valid Instagram URL";
      if (v("socialLinkedin") && !URL_RE.test(v("socialLinkedin"))) errs.socialLinkedin = "Enter a valid LinkedIn URL";
    }

    return errs;
  }, [form]);

  const handleBlur = useCallback((field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    /* Run field-level validation on blur — clears error if valid */
    const fieldErrs = validate();
    setErrors((p) => ({ ...p, [field]: fieldErrs[field] || "" }));
  }, [validate]);

  /* ─── Find tab for a field ─── */
  const findTabForField = useCallback((fieldId) => {
    for (const [tabId, config] of Object.entries(BUYER_TAB_FIELDS)) {
      if (config.required.includes(fieldId) || config.optional.includes(fieldId)) return tabId;
    }
    return "business-profile";
  }, []);

  /* ─── Error click: switch tab + focus ─── */
  const handleErrorClick = useCallback((fieldId) => {
    const tab = findTabForField(fieldId);
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
    }, 100);
  }, [findTabForField]);

  /* ─── Save & Continue ─── */
  const handleSaveAndContinue = () => {
    const currentIdx = BUYER_TABS.findIndex((t) => t.id === activeTab);
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
    // 🔧 PRODUCTION: Replace setTimeout with actual API call: PUT /api/user/buyer-profile
    // Save just the current tab's fields. On success, advance to the next tab.
    setSavingTab(true);
    setTimeout(() => {
      setSavingTab(false);
      setTabSaved(true);
      setHasUnsavedChanges(false);
      setTimeout(() => setTabSaved(false), 1500);
      if (currentIdx < BUYER_TABS.length - 1) {
        setActiveTab(BUYER_TABS[currentIdx + 1].id);
        if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 600);
  };

  /* ─── Save All ─── */
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
    // 🔧 PRODUCTION: Replace setTimeout with actual API call: PUT /api/user/buyer-profile
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setHasUnsavedChanges(false);
      clearDraft(); // Clear localStorage draft on successful save
      onSave?.(); // Notify parent for stale-profile timestamp tracking
      /* Persist current profile completeness for the sidebar indicator */
      try {
        const af = (f) => Array.isArray(form[f]) && form[f].length > 0;
        const sf = (f) => form[f] && String(form[f]).trim().length > 0;
        const RW = 3, OW = 1; let e = 0, t = 0;
        for (const f of ["buyerType","productCategories","preferredSupplierTypes","countriesSourceFrom","preferredPaymentMethods","preferredDeliveryOptions","sourcingModels"]) { t += RW; if (af(f)) e += RW; }
        for (const f of ["describeBusiness","productsLookingFor"]) { t += RW; if (sf(f)) e += RW; }
        for (const f of ["productQualityTier","certificationRequirements","brandsInterestedIn","excludedCountries","focusMarkets","communicationPreferences","sampleRequirements","customizationNeeds"]) { t += OW; if (af(f)) e += OW; }
        for (const f of ["annualSalesVolume","annualPurchasingVolume","highestMinimumOrder","moqComfortLevel","preferredCurrency","shopWebsiteUrl","leadTimeRequirement","acceptableDepositTerms","businessHoursNote","socialFacebook","socialInstagram","socialLinkedin"]) { t += OW; if (sf(f)) e += OW; }
        localStorage.setItem("wup-buyer-profile-pct", String(Math.round((e / t) * 100)));
      } catch {}
      setActiveTab(BUYER_TABS[0].id);
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }, 800);
  };

  const currentTabIdx = BUYER_TABS.findIndex((t) => t.id === activeTab);
  const isLastTab = currentTabIdx === BUYER_TABS.length - 1;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate id="buyer-profile-form" style={{ scrollMarginTop: "120px" }}>
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
                <h1 className="text-xl font-extrabold text-slate-900">Buyer Profile</h1>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  Complete your buyer profile to help suppliers understand your business and sourcing needs. A fully updated profile receives 3× more relevant deals.
                </p>
              </div>
              {/* ═══ SUCCESS BANNER ═══ */}
              {saved && (
                <div className="rounded-xl overflow-hidden border border-emerald-200 animate-fadeIn" role="status">
                  <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check size={14} className="text-white shrink-0" strokeWidth={3} />
                      <p className="text-sm font-semibold text-white">Buyer profile updated successfully</p>
                    </div>
                    <button type="button" onClick={() => setSaved(false)} className="w-6 h-6 rounded-full hover:bg-emerald-500 flex items-center justify-center transition-colors" aria-label="Dismiss">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                  <div className="bg-emerald-50/80 px-4 py-3">
                    <p className="text-sm text-emerald-700">Your sourcing preferences have been saved. Suppliers will now see your updated requirements when reviewing inquiries.</p>
                  </div>
                </div>
              )}
              <BuyerProfileProgressBar form={form} onPctChange={onProgressChange} />
            </div>

            {/* Tab Bar */}
            <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabStatuses={tabStatuses} tabProgress={tabProgress} tabs={BUYER_TABS} />
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
                  fieldLabels={BUYER_FIELD_LABELS}
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
                  <FormSection title="Buyer Type" icon={ShoppingBag}>
                    <div className="space-y-5">
                      <MultiSelectDropdown
                        id="buyerType"
                        label="Buyer Type"
                        icon={ShoppingBag}
                        options={BUYER_TYPES}
                        selected={form.buyerType}
                        onChange={(v) => update("buyerType", v)}
                        required
                        error={errors.buyerType}
                        searchPlaceholder="Search buyer types..."
                      />
                      <FloatingTextarea
                        id="describeBusiness"
                        label="Describe Your Retail or Sourcing Business"
                        required
                        value={form.describeBusiness}
                        onChange={(e) => update("describeBusiness", e.target.value)}
                        onBlur={handleBlur("describeBusiness")}
                        error={errors.describeBusiness}
                        maxLength={5000}
                        placeholder="Tell suppliers about your company, target market, and what you sell..."
                        help="Min. 20 characters"
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Supplier Preferences" icon={Store}>
                    <div className="space-y-5">
                      <MultiSelectDropdown
                        id="preferredSupplierTypes"
                        label="Preferred Supplier Types"
                        icon={Store}
                        options={SUPPLIER_TYPES}
                        selected={form.preferredSupplierTypes}
                        onChange={(v) => update("preferredSupplierTypes", v)}
                        required
                        error={errors.preferredSupplierTypes}
                        searchPlaceholder="Search supplier types..."
                      />
                      <MultiSelectDropdown
                        id="sourcingModels"
                        label="How You Source Products"
                        icon={Truck}
                        options={SOURCING_MODELS}
                        selected={form.sourcingModels}
                        onChange={(v) => update("sourcingModels", v)}
                        required
                        error={errors.sourcingModels}
                        searchPlaceholder="Search sourcing models..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Company Branding" icon={Building2}>
                    <ImageUploadPlaceholder label="Company Logo" />
                    <p className="text-xs text-slate-400 mt-2 ml-1">JPG, PNG, or WebP — max 5 MB. Visible to suppliers on your profile.</p>
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 2: Sourcing Preferences ─── */}
              {activeTab === "sourcing-preferences" && (
                <div role="tabpanel" id="panel-sourcing-preferences" aria-labelledby="tab-sourcing-preferences" className="space-y-6 animate-fadeIn">
                  <FormSection title="Products Required" icon={Package}>
                    <div className="space-y-4">
                      <FloatingTextarea
                        id="productsLookingFor"
                        label="Product Types & Categories You Source"
                        required
                        value={form.productsLookingFor}
                        onChange={(e) => update("productsLookingFor", e.target.value)}
                        onBlur={handleBlur("productsLookingFor")}
                        error={errors.productsLookingFor}
                        maxLength={2000}
                        placeholder="Describe specific products, niches, or categories you want to source..."
                        help="Min. 10 characters"
                      />
                      <CategorySelector
                        id="productCategories"
                        label="Product Categories You're Interested In"
                        selected={form.productCategories}
                        onChange={(v) => update("productCategories", v)}
                        required
                        error={errors.productCategories}
                      />
                      <BrandPillInput
                        id="brandsInterestedIn"
                        label="Brands You're Interested In"
                        selected={form.brandsInterestedIn}
                        onChange={(v) => update("brandsInterestedIn", v)}
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Quality & Certifications" icon={Shield}>
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
                      <MultiSelectDropdown
                        id="certificationRequirements"
                        label="Certification Requirements"
                        icon={Shield}
                        options={CERTIFICATIONS}
                        selected={form.certificationRequirements}
                        onChange={(v) => update("certificationRequirements", v)}
                        searchPlaceholder="Search certifications..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Samples & Customization" icon={Settings}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="sampleRequirements"
                        label="Sample Requirements"
                        icon={Package}
                        options={SAMPLE_REQUIREMENT_OPTIONS}
                        selected={form.sampleRequirements}
                        onChange={(v) => update("sampleRequirements", v)}
                        searchPlaceholder="Search sample options..."
                      />
                      <MultiSelectDropdown
                        id="customizationNeeds"
                        label="Customization Needs"
                        icon={Settings}
                        options={CUSTOMIZATION_NEED_OPTIONS}
                        selected={form.customizationNeeds}
                        onChange={(v) => update("customizationNeeds", v)}
                        searchPlaceholder="Search customization types..."
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Sourcing Geography" icon={Globe}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="countriesSourceFrom"
                        label="Countries You Prefer to Source From"
                        icon={Globe}
                        options={[{ value: "all-countries", label: "All Countries (Worldwide)", iso: "globe" }, ...COUNTRIES.map((c) => ({ value: c.value, label: c.label, iso: c.iso }))]}
                        selected={form.countriesSourceFrom}
                        onChange={(v) => update("countriesSourceFrom", v)}
                        required
                        error={errors.countriesSourceFrom}
                        showFlags
                        showCount
                        countNoun="country"
                        searchPlaceholder="Search countries..."
                      />
                      <MultiSelectDropdown
                        id="excludedCountries"
                        label="Countries You Won't Source From"
                        icon={Globe}
                        options={COUNTRIES.map((c) => ({ value: c.value, label: c.label, iso: c.iso }))}
                        selected={form.excludedCountries}
                        onChange={(v) => update("excludedCountries", v)}
                        showFlags
                        showCount
                        countNoun="country"
                        searchPlaceholder="Search countries..."
                      />
                    </div>
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 3: Purchasing & Delivery ─── */}
              {activeTab === "purchasing-logistics" && (
                <div role="tabpanel" id="panel-purchasing-logistics" aria-labelledby="tab-purchasing-logistics" className="space-y-6 animate-fadeIn">
                  <FormSection title="Financial Details" icon={DollarSign}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingSelect
                          id="preferredCurrency"
                          label="Preferred Currency"
                          value={form.preferredCurrency}
                          onChange={(v) => update("preferredCurrency", v)}
                          options={CURRENCIES}
                          placeholder="Select..."
                        />
                        <FloatingSelect
                          id="moqComfortLevel"
                          label="MOQ Comfort Level"
                          value={form.moqComfortLevel}
                          onChange={(v) => update("moqComfortLevel", v)}
                          options={MOQ_LEVELS}
                          placeholder="Select..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CurrencyAmountInput
                          id="annualSalesVolume"
                          label="Annual Sales Volume (Approximate)"
                          currency={form.currencySales}
                          onCurrencyChange={(c) => update("currencySales", c)}
                          amount={form.annualSalesVolume}
                          onAmountChange={(a) => update("annualSalesVolume", a)}
                          error={errors.annualSalesVolume}
                        />
                        <CurrencyAmountInput
                          id="annualPurchasingVolume"
                          label="Annual Purchasing Volume (Approximate)"
                          currency={form.currencyPurchasing}
                          onCurrencyChange={(c) => update("currencyPurchasing", c)}
                          amount={form.annualPurchasingVolume}
                          onAmountChange={(a) => update("annualPurchasingVolume", a)}
                          error={errors.annualPurchasingVolume}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CurrencyAmountInput
                          id="highestMinimumOrder"
                          label="Maximum MOQ Tolerance"
                          currency={form.currencyMOQ}
                          onCurrencyChange={(c) => update("currencyMOQ", c)}
                          amount={form.highestMinimumOrder}
                          onAmountChange={(a) => update("highestMinimumOrder", a)}
                          error={errors.highestMinimumOrder}
                        />
                      </div>
                    </div>
                  </FormSection>
                  <FormSection title="Lead Time & Deposit" icon={Clock}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingSelect
                          id="leadTimeRequirement"
                          label="Acceptable Lead Time"
                          value={form.leadTimeRequirement}
                          onChange={(v) => update("leadTimeRequirement", v)}
                          options={LEAD_TIME_REQUIREMENT_OPTIONS}
                          placeholder="Select..."
                        />
                        <FloatingSelect
                          id="acceptableDepositTerms"
                          label="Acceptable Deposit Terms"
                          value={form.acceptableDepositTerms}
                          onChange={(v) => update("acceptableDepositTerms", v)}
                          options={DEPOSIT_TERM_OPTIONS}
                          placeholder="Select..."
                        />
                      </div>
                    </div>
                  </FormSection>
                  <FormSection title="Payment & Delivery" icon={Truck}>
                    <div className="space-y-4">
                      <MultiSelectDropdown
                        id="preferredPaymentMethods"
                        label="Preferred Payment Methods"
                        icon={CreditCard}
                        options={PAYMENT_METHODS}
                        selected={form.preferredPaymentMethods}
                        onChange={(v) => update("preferredPaymentMethods", v)}
                        required
                        error={errors.preferredPaymentMethods}
                      />
                      <MultiSelectDropdown
                        id="preferredDeliveryOptions"
                        label="Preferred Delivery Options"
                        icon={Truck}
                        options={DELIVERY_OPTIONS}
                        selected={form.preferredDeliveryOptions}
                        onChange={(v) => update("preferredDeliveryOptions", v)}
                        required
                        error={errors.preferredDeliveryOptions}
                      />
                    </div>
                  </FormSection>
                </div>
              )}

              {/* ─── Tab 4: Online Presence & Market Focus ─── */}
              {activeTab === "profile-visibility" && (
                <div role="tabpanel" id="panel-profile-visibility" aria-labelledby="tab-profile-visibility" className="space-y-6 animate-fadeIn">
                  <FormSection title="Market Focus" icon={MapPin}>
                    <FocusMarketSelector
                      id="focusMarkets"
                      selected={form.focusMarkets}
                      onChange={(v) => update("focusMarkets", v)}
                      onFocusField={setFocusedField}
                    />
                  </FormSection>
                  <FormSection title="Online Presence" icon={Globe}>
                    <div className="space-y-4">
                      <FloatingField
                        id="shopWebsiteUrl"
                        label="Your Website"
                        icon={Globe}
                        value={form.shopWebsiteUrl}
                        onChange={(e) => update("shopWebsiteUrl", e.target.value)}
                        onBlur={handleBlur("shopWebsiteUrl")}
                        error={errors.shopWebsiteUrl}
                        placeholder="https://example.com"
                        inputMode="url"
                        autoComplete="url"
                        help="Full URL e.g. https://yourshop.com"
                      />
                      <FloatingField
                        id="socialFacebook"
                        label="Facebook Page"
                        icon={Globe}
                        value={form.socialFacebook}
                        onChange={(e) => update("socialFacebook", e.target.value)}
                        onBlur={handleBlur("socialFacebook")}
                        error={errors.socialFacebook}
                        placeholder="https://facebook.com/yourcompany"
                        inputMode="url"
                        autoComplete="off"
                      />
                      <FloatingField
                        id="socialInstagram"
                        label="Instagram Profile"
                        icon={Globe}
                        value={form.socialInstagram}
                        onChange={(e) => update("socialInstagram", e.target.value)}
                        onBlur={handleBlur("socialInstagram")}
                        error={errors.socialInstagram}
                        placeholder="https://instagram.com/yourcompany"
                        inputMode="url"
                        autoComplete="off"
                      />
                      <FloatingField
                        id="socialLinkedin"
                        label="LinkedIn Page"
                        icon={Globe}
                        value={form.socialLinkedin}
                        onChange={(e) => update("socialLinkedin", e.target.value)}
                        onBlur={handleBlur("socialLinkedin")}
                        error={errors.socialLinkedin}
                        placeholder="https://linkedin.com/company/yourcompany"
                        inputMode="url"
                        autoComplete="off"
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Business Hours" icon={Clock}>
                    <FloatingField
                      id="businessHoursNote"
                      label="Business Hours Note"
                      icon={Clock}
                      value={form.businessHoursNote}
                      onChange={(e) => update("businessHoursNote", e.target.value)}
                      onBlur={handleBlur("businessHoursNote")}
                      placeholder="e.g. Mon–Fri 9am–5pm GMT"
                      autoComplete="off"
                      help="Help suppliers in other time zones know when to reach you"
                    />
                  </FormSection>
                  <FormSection title="Communication Preferences" icon={MessageSquare}>
                    <MultiSelectDropdown
                      id="communicationPreferences"
                      label="Communication Preferences"
                      icon={MessageSquare}
                      options={COMMUNICATION_PREFS}
                      selected={form.communicationPreferences}
                      onChange={(v) => update("communicationPreferences", v)}
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
   BUYER PROFILE PAGE — wrapper with sidebar + tips
   ═══════════════════════════════════════════════════ */

export function BuyerProfilePage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");
  const [tipsCollapsed, toggleTips] = usePanelCollapse("wup-tips-collapsed");
  const [focusedField, setFocusedField] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("business-profile");

  /* ─── Stale profile tracking (lives at page level so banner renders outside the form card) ─── */
  const { recordSave, getDaysStale } = useProfileSaveTime("buyer");
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
    try { localStorage.setItem("wup-buyer-profile-pct", String(pct)); } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Buyer Profile", href: "/dashboard/buyer-profile" },
          { label: "Edit Profile" },
        ]} />
        <MobileDashboardNav activePage="buyer-profile" />

        <div className="flex gap-6 items-start">
          {/* Left: Account Sidebar */}
          <AccountSidebar user={user} activePage="buyer-profile" collapsed={sidebarCollapsed} onToggle={toggleSidebar} profilePct={livePct} profileSavedAt={saveCount} />

          {/* Center: Form */}
          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />
            {/* ═══ STALE PROFILE WARNING — above the form card ═══ */}
            {showStaleWarning && (
              <StaleProfileBanner
                daysStale={daysStale}
                profileType="buyer"
                onDismiss={() => setStaleDismissed(true)}
                onReviewClick={() => {
                  if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            )}
            <div ref={formRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <BuyerProfileForm user={user} onFocusedFieldChange={setFocusedField} onActiveTabChange={setActiveFormTab} onSave={handleSave} onProgressChange={handleProgressChange} />
            </div>
          </div>

          {/* Right: Contextual Tips Panel — 2xl+ only */}
          <SharedFormTipsPanel
            focusedField={focusedField}
            activeTab={activeFormTab}
            collapsed={tipsCollapsed}
            onToggle={toggleTips}
            tipsData={BUYER_TIPS_DATA}
            defaultTips={BUYER_TAB_DEFAULT_TIPS}
            defaultTabKey="business-profile"
            bottomSection={BUYER_TIPS_BOTTOM}
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

export default BuyerProfilePage;
