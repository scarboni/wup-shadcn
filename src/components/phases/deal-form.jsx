"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/shared/breadcrumb";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { FormTipsPanel as SharedFormTipsPanel, WhyItMattersSection } from "@/components/shared/form-tips-panel";
import {
  Package, DollarSign, FileText, Settings, Truck, Shield, RefreshCw, Layers, ShoppingBag,
  Check, X, ChevronDown, AlertTriangle, Loader2, Plus, Trash2, Percent,
  Tag, Globe, Clock, Sparkles, Crown, HelpCircle, Zap, Eye, EyeOff,
  ToggleLeft, ToggleRight, Calendar, Info, ArrowRight, Upload,
} from "lucide-react";
import { useFormDraft } from "@/components/shared/use-form-draft";
import { useProfileSaveTime } from "@/components/shared/use-profile-save-time";
import {
  FlagImg, useDropdown, FloatingField, FloatingSelect, FloatingTextarea, FormSection, CountrySelect,
  TabStatus, ProfileTabBar, ErrorSummaryPanel, AccountSidebar, UpgradeBanner, MobileDashboardNav,
  usePageUser, MultiSelect, COUNTRIES, CURRENCIES, TIER_CONFIG, TIER_CTA,
  CURRENCY_SYMBOLS, useHeaderCurrency, CurrencyAmountInput, PRODUCT_CATEGORY_TREE,
  CategorySelector, BrandPillInput, ImageUploadPlaceholder, LanguageSelector,
  TAX_CLASS_OPTIONS, INVOICE_TYPE_OPTIONS, SANITIZED_INVOICE_OPTIONS, INCOTERMS_OPTIONS,
  FloatingDatePicker,
} from "./dashboard";

/* ═══════════════════════════════════════════════════════════════════
   DEAL FORM — CANONICAL REFERENCE DATA
   ═══════════════════════════════════════════════════════════════════
   This file is the single source of truth for all deal-related enums,
   option arrays, field labels, validation rules, and field types.
   Other components (deal cards, deal page, upload pipeline, filters)
   should import canonical values from here.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Grade ─── */
export const GRADE_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
  { value: "Outlet", label: "Outlet" },
  { value: "Refurbished", label: "Refurbished" },
  { value: "Damaged", label: "Damaged" },
  { value: "Mix / returns", label: "Mix / Returns" },
  { value: "Returns / Mixed Stock", label: "Returns / Mixed Stock" },
  { value: "Liquidation Stocklots", label: "Liquidation Stocklots" },
];

/* ─── Deal Status ─── */
export const DEAL_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "sold-out", label: "Sold Out" },
  /* "active-disabled" is admin-only — set via backend, not shown in supplier form */
];

/* ─── Target Audience (matches buyer-profile BUYER_TYPES for cross-matching) ─── */
export const TARGET_AUDIENCE_OPTIONS = [
  { value: "online-retailer", label: "Online Retailers" },
  { value: "shop-retailer", label: "Shop / High Street Retailers" },
  { value: "multi-chain", label: "Multi-Chain Retailers" },
  { value: "marketplace-seller", label: "Marketplace Sellers (Amazon, eBay, etc.)" },
  { value: "dropshipper", label: "Dropshippers" },
  { value: "market-trader", label: "Market Traders" },
  { value: "wholesaler-reseller", label: "Wholesalers / Resellers" },
  { value: "distributor", label: "Distributors / Importers" },
  { value: "supermarket", label: "Supermarkets / Grocery" },
  { value: "hospitality", label: "Hospitality / HoReCa" },
  { value: "corporate-buyer", label: "Corporate / Procurement" },
  { value: "franchisee", label: "Franchisees" },
  { value: "charity-nonprofit", label: "Charities / Non-Profits" },
  { value: "government", label: "Government / Public Sector" },
  { value: "subscription-box", label: "Subscription Box Services" },
  { value: "social-commerce", label: "Social Commerce Sellers" },
  { value: "other", label: "Other" },
];

/* ─── MOQ Unit ─── */
export const MOQ_UNIT_OPTIONS = [
  { value: "Units", label: "Units" },
  { value: "pieces", label: "Pieces" },
  { value: "lots", label: "Lots" },
  { value: "trucks", label: "Trucks" },
  { value: "pallets", label: "Pallets" },
  { value: "pairs", label: "Pairs" },
  { value: "packs", label: "Packs" },
  { value: "sets", label: "Sets" },
  { value: "kilograms", label: "Kilograms" },
  { value: "tonnes", label: "Tonnes" },
  { value: "m²", label: "Square Metres" },
  { value: "litres", label: "Litres" },
  { value: "containers", label: "Containers" },
];

/* ─── Price Unit (also defines the selling unit — "/ Pack" means each unit sold is a pack) ─── */
export const PRICE_UNIT_OPTIONS = [
  { value: "/ Unit", label: "/ Unit" },
  { value: "/ Piece", label: "/ Piece" },
  { value: "/ Pair", label: "/ Pair" },
  { value: "/ Set", label: "/ Set" },
  { value: "/ Pack", label: "/ Pack" },
  { value: "/ Box", label: "/ Box" },
  { value: "/ Roll", label: "/ Roll" },
  { value: "/ Pallet", label: "/ Pallet" },
  { value: "/ Container", label: "/ Container" },
  { value: "/ Kilogram", label: "/ Kilogram" },
  { value: "/ Tonne", label: "/ Tonne" },
  { value: "/ Litre", label: "/ Litre" },
  { value: "/ Meter", label: "/ Meter" },
  { value: "/ Meter²", label: "/ Meter²" },
];

/* ─── Price Unit → quantity label mapping (used for MOQ suffix, etc.) ─── */
const PRICE_UNIT_LABELS = {
  "/ Unit": "units", "/ Piece": "pieces", "/ Pair": "pairs", "/ Set": "sets",
  "/ Pack": "packs", "/ Box": "boxes", "/ Roll": "rolls",
  "/ Pallet": "pallets", "/ Container": "containers",
  "/ Kilogram": "kg", "/ Tonne": "tonnes", "/ Litre": "litres",
  "/ Meter": "meters", "/ Meter²": "m²",
};

/* ─── VAT ─── */
export const VAT_OPTIONS = [
  { value: "ex. VAT", label: "ex. VAT" },
  { value: "inc. VAT", label: "inc. VAT" },
];

/* ─── Shipping ─── */
export const SHIPPING_CLASS_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Freight", label: "Freight" },
  { value: "Oversized", label: "Oversized" },
  { value: "Hazmat", label: "Hazmat" },
  { value: "Perishable", label: "Perishable" },
];

export const SHIPPING_SCOPE_OPTIONS = [
  { value: "inherited", label: "Inherited from Supplier Profile" },
  { value: "all-continents", label: "Ships Worldwide" },
  { value: "specific", label: "Specific Countries/Continents" },
  { value: "not-declared", label: "Not Declared" },
];

export const SHIPPING_COST_BEARER_OPTIONS = [
  { value: "buyer", label: "Buyer Pays Shipping" },
  { value: "seller", label: "Seller Pays Shipping" },
  { value: "negotiable", label: "Negotiable" },
  { value: "included", label: "Included in Price" },
];

export const SHIPPING_COST_METHOD_OPTIONS = [
  { value: "weight-based", label: "Weight-Based" },
  { value: "flat-rate", label: "Flat Rate" },
  { value: "volume-based", label: "Volume-Based" },
  { value: "quote-required", label: "Quote Required" },
];

/* ─── Continent options ─── */
/* ─── Country Restriction Scope ─── */
export const RESTRICTION_SCOPE_OPTIONS = [
  { value: "inherited", label: "Inherited from Supplier Profile" },
  { value: "specific", label: "Specific Restricted Countries/Continents" },
  { value: "none", label: "No Restrictions" },
];

export const CONTINENT_OPTIONS = [
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
  { value: "middle-east", label: "Middle East" },
];

/* ─── Seasonality ─── */
export const SEASONALITY_OPTIONS = [
  { value: "All Season", label: "All Season" },
  { value: "Spring/Summer", label: "Spring / Summer" },
  { value: "Autumn/Winter", label: "Autumn / Winter" },
  { value: "Holiday", label: "Holiday" },
  { value: "Back to School", label: "Back to School" },
];

/* ─── Stock Origin ─── */
export const STOCK_ORIGIN_OPTIONS = [
  { value: "surplus", label: "Surplus" },
  { value: "overstock", label: "Overstock" },
  { value: "end-of-line", label: "End of Line" },
  { value: "liquidation", label: "Liquidation" },
  { value: "bankruptcy", label: "Bankruptcy" },
  { value: "controlled-returns", label: "Controlled Returns" },
  { value: "customer-returns", label: "Customer Returns" },
  { value: "cancelled-order", label: "Cancelled Order" },
  { value: "sample-stock", label: "Sample Stock" },
  { value: "production-excess", label: "Production Excess" },
];

/* ─── Pattern ─── */
export const PATTERN_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "striped", label: "Striped" },
  { value: "floral", label: "Floral" },
  { value: "plaid", label: "Plaid" },
  { value: "geometric", label: "Geometric" },
  { value: "animal-print", label: "Animal Print" },
  { value: "abstract", label: "Abstract" },
  { value: "paisley", label: "Paisley" },
];

/* ─── Power Source ─── */
export const POWER_SOURCE_OPTIONS = [
  { value: "battery-rechargeable", label: "Battery (Rechargeable)" },
  { value: "corded-electric", label: "Corded Electric" },
  { value: "solar", label: "Solar" },
  { value: "manual", label: "Manual" },
  { value: "usb-rechargeable", label: "USB Rechargeable" },
  { value: "mains-ac", label: "Mains (AC)" },
  { value: "fuel", label: "Fuel" },
  { value: "hybrid", label: "Hybrid" },
];

/* ─── Dimension / Weight Units ─── */
export const DIMENSION_UNIT_OPTIONS = [
  { value: "cm", label: "cm" },
  { value: "mm", label: "mm" },
  { value: "in", label: "in" },
  { value: "m", label: "m" },
];

export const WEIGHT_UNIT_OPTIONS = [
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "lb", label: "lb" },
  { value: "oz", label: "oz" },
];

/* ─── Regional Compliance Presets ─── */
export const REGIONAL_COMPLIANCE_PRESETS = [
  { value: "california-prop65", label: "California Prop 65" },
  { value: "eu-reach", label: "EU REACH / SVHC" },
  { value: "uk-reach", label: "UK REACH" },
  { value: "eu-rohs", label: "EU RoHS" },
  { value: "eu-weee", label: "EU WEEE" },
  { value: "eu-biocidal", label: "EU Biocidal Products Regulation" },
  { value: "korea-kc", label: "Korea KC Certification" },
  { value: "japan-pse", label: "Japan PSE" },
  { value: "australia-acl", label: "Australia ACL" },
  { value: "china-ccc", label: "China CCC" },
];

/* ─── Hazard Symbols (GHS) ─── */
export const HAZARD_SYMBOL_OPTIONS = [
  { value: "GHS01", label: "GHS01 — Explosive" },
  { value: "GHS02", label: "GHS02 — Flammable" },
  { value: "GHS03", label: "GHS03 — Oxidizer" },
  { value: "GHS04", label: "GHS04 — Compressed Gas" },
  { value: "GHS05", label: "GHS05 — Corrosive" },
  { value: "GHS06", label: "GHS06 — Toxic" },
  { value: "GHS07", label: "GHS07 — Irritant" },
  { value: "GHS08", label: "GHS08 — Health Hazard" },
  { value: "GHS09", label: "GHS09 — Environment" },
];

/* ─── Apparel: Fit Type ─── */
export const FIT_TYPE_OPTIONS = [
  { value: "slim", label: "Slim" },
  { value: "regular", label: "Regular" },
  { value: "relaxed", label: "Relaxed" },
  { value: "oversized", label: "Oversized" },
  { value: "tailored", label: "Tailored" },
];

/* ─── Apparel: Gender ─── */
export const GENDER_OPTIONS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "unisex", label: "Unisex" },
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
];

/* ─── Food: Allergens ─── */
export const ALLERGEN_OPTIONS = [
  { value: "gluten", label: "Gluten" },
  { value: "crustaceans", label: "Crustaceans" },
  { value: "eggs", label: "Eggs" },
  { value: "fish", label: "Fish" },
  { value: "peanuts", label: "Peanuts" },
  { value: "soybeans", label: "Soybeans" },
  { value: "milk", label: "Milk / Lactose" },
  { value: "tree-nuts", label: "Tree Nuts" },
  { value: "celery", label: "Celery" },
  { value: "mustard", label: "Mustard" },
  { value: "sesame", label: "Sesame" },
  { value: "sulphites", label: "Sulphites" },
  { value: "lupin", label: "Lupin" },
  { value: "molluscs", label: "Molluscs" },
];

/* ─── Food: Dietary Tags ─── */
export const DIETARY_TAG_OPTIONS = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "organic", label: "Organic" },
  { value: "no-preservatives", label: "No Preservatives" },
  { value: "sugar-free", label: "Sugar-Free" },
  { value: "lactose-free", label: "Lactose-Free" },
  { value: "non-gmo", label: "Non-GMO" },
  { value: "keto", label: "Keto-Friendly" },
  { value: "paleo", label: "Paleo" },
];

/* ─── Food: GMO Declaration ─── */
export const GMO_DECLARATION_OPTIONS = [
  { value: "gmo-free", label: "GMO-Free" },
  { value: "contains-gmo", label: "Contains GMO" },
  { value: "not-declared", label: "Not Declared" },
];

/* ─── Health & Beauty: Skin Type ─── */
export const SKIN_TYPE_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "combination", label: "Combination" },
  { value: "sensitive", label: "Sensitive" },
  { value: "all-types", label: "All Skin Types" },
];

/* ─── Lot: Grade Category ─── */
export const LOT_GRADE_CATEGORY_OPTIONS = [
  { value: "A", label: "Grade A — Like New / Pristine" },
  { value: "B", label: "Grade B — Minor Imperfections" },
  { value: "C", label: "Grade C — Visible Wear / Defects" },
];

/* ─── Certifications (re-exported from supplier-profile for deal-level override) ─── */
export const CERTIFICATION_OPTIONS = [
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

/* ═══════════════════════════════════════════════════════════════════
   TAB STRUCTURE
   ═══════════════════════════════════════════════════════════════════ */

const DEAL_TABS = [
  { id: "product-pricing", label: "Product & Pricing", icon: Package, shortLabel: "Product" },
  { id: "description-media", label: "Description & Media", icon: FileText, shortLabel: "Media" },
  { id: "specifications", label: "Product Specifications", icon: Settings, shortLabel: "Specs" },
  { id: "order-stock", label: "Order & Stock Terms", icon: ShoppingBag, shortLabel: "Orders" },
  { id: "shipping-logistics", label: "Shipping & Logistics", icon: Truck, shortLabel: "Shipping" },
  { id: "compliance-legal", label: "Compliance & Legal", icon: Shield, shortLabel: "Compliance" },
  { id: "commercial-overrides", label: "Commercial Overrides", icon: RefreshCw, shortLabel: "Overrides" },
  { id: "category-specific", label: "Category-Specific", icon: Layers, shortLabel: "Category" },
];

const DEAL_TAB_FIELDS = {
  "product-pricing": {
    required: ["title", "price", "currency", "grade", "categories", "dealStatus", "priceUnit", "vat", "rrp"],
    optional: ["seasonality", "ean", "mpn", "asin", "sku", "taric", "brands", "rrpCurrency", "mapPrice", "omnibusPrice", "originalPrice", "discountPercentage", "priceTiers", "firstOrderDiscount", "negotiable", "priceValidUntil", "offerValidityDays"],
  },
  "description-media": {
    required: ["description"],
    optional: ["images", "videoUrl", "tags", "searchKeywords", "productHighlights", "packageContents", "targetAudience"],
  },
  "specifications": {
    required: [],
    optional: ["specifications", "variants", "materials", "packaging", "productDimensions", "netWeight", "grossWeight", "color", "pattern", "powerSource", "assemblyRequired", "batteryInfo"],
  },
  "order-stock": {
    required: [],
    optional: ["moq", "availableQuantity", "maxOrderQuantity", "orderIncrement", "casePackSize", "multipackQuantity", "isIndivisibleLot", "crossCategoryMOQ"],
  },
  "shipping-logistics": {
    required: [],
    optional: ["stockLocation", "shippingScope", "shippingContinents", "shippingCountries", "restrictionScope", "restrictedContinents", "countryRestrictions", "shippingClass", "shippingCostBearer", "shippingCostMethod", "readyToShip", "isDropship", "freeDelivery", "portOfOrigin", "packagingFormat", "palletConfiguration", "containerLoadQuantity", "stackable", "leadTimeTiers"],
  },
  "compliance-legal": {
    required: [],
    optional: ["hazmatInfo", "hazardSymbols", "ageRestriction", "regionalCompliance", "certifications", "warrantyInfo", "warranty", "cpscCompliance", "fdaRegistration", "energyRating", "sarValue", "ipRating", "euResponsiblePerson", "exportOnly", "exportRegions"],
  },
  "commercial-overrides": {
    required: [],
    optional: ["supplierPaymentMethods", "netPaymentTerms", "depositRequired", "taxClass", "invoiceType", "sanitizedInvoice", "deliveryMethods", "incoterms", "returnPolicy", "dealReturnPolicy"],
  },
  "category-specific": {
    required: [],
    optional: [
      /* cross-category */
      "launchDate", "discontinuedDate", "manufacturingCountry", "productLanguage", "compatibleWith",
      "customizationOptions", "ecoFriendly", "supplyAbility", "sampleLeadTime",
      /* lot / liquidation */
      "isAssortedLot", "lotComposition", "isManifested", "imagesRepresentative", "hasOriginalLabels", "labelCondition",
      "mayContainDuplicates", "stockOrigin", "sourceRetailers", "gradeCategory", "gradeNotes",
      "lotRetailValue", "authenticityGuarantee", "functionalRate",
      /* apparel */
      "fabricComposition", "gsm", "careInstructions", "fitType", "gender", "sizeChart", "predominantSizes",
      /* food */
      "ingredients", "allergens", "dietaryTags", "nutritionalInfo", "storageInstructions", "shelfLife",
      "organicCertification", "kosherHalal", "countryOfHarvest", "abv", "vintageYear", "bestBeforeDate",
      "gmoDeclaration", "storageTemperatureRange",
      /* health & beauty */
      "inciList", "spfRating", "skinType", "paoMonths", "crueltyFree", "dermatologicallyTested",
      /* industrial */
      "toleranceSpecs", "pressureRating", "temperatureRange", "threadType", "materialGrade",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════════
   CATEGORY → FIELD MAP
   Maps L2 category slugs to category-specific field groups.
   A field is shown in Tab 8 when ANY of the deal's selected categories
   includes it. Field groups: apparel, food, health-beauty, industrial,
   lot-liquidation (lot shown for ALL surplus-clearance L2 cats).
   ═══════════════════════════════════════════════════════════════════ */

const APPAREL_FIELDS = ["fabricComposition", "gsm", "careInstructions", "fitType", "gender", "sizeChart", "predominantSizes"];
const FOOD_FIELDS = ["ingredients", "allergens", "dietaryTags", "nutritionalInfo", "storageInstructions", "shelfLife", "organicCertification", "kosherHalal", "countryOfHarvest", "abv", "vintageYear", "bestBeforeDate", "gmoDeclaration", "storageTemperatureRange"];
const HEALTH_BEAUTY_FIELDS = ["inciList", "spfRating", "skinType", "paoMonths", "crueltyFree", "dermatologicallyTested"];
const INDUSTRIAL_FIELDS = ["toleranceSpecs", "pressureRating", "temperatureRange", "threadType", "materialGrade"];
const LOT_FIELDS = ["isAssortedLot", "lotComposition", "isManifested", "imagesRepresentative", "hasOriginalLabels", "labelCondition", "mayContainDuplicates", "stockOrigin", "sourceRetailers", "gradeCategory", "gradeNotes", "lotRetailValue", "authenticityGuarantee", "functionalRate"];

/** L2 slug → array of extra field keys shown in Tab 8.
 *  Slugs use canonical IDs from categories.js (e.g. "mens-clothing", NOT "men-s-clothing").
 *  Format: "l1-id/l2-id" matching CATEGORY_TREE[].id + CATEGORY_TREE[].subs[].id.
 *  Cross-category fields (color, materials, pattern, batteryInfo, grossWeight,
 *  powerSource, assemblyRequired) live in Tabs 2-5 and are NOT mapped here.
 *  Google Product Data Spec + GS1 used as reference for assignments.
 */
const CATEGORY_FIELD_MAP = {
  /* ─── Clothing & Fashion (11/11) ─── */
  "clothing-fashion/mens-clothing": APPAREL_FIELDS,
  "clothing-fashion/womens-clothing": APPAREL_FIELDS,
  "clothing-fashion/childrens-clothing": APPAREL_FIELDS,
  "clothing-fashion/sportswear-activewear": APPAREL_FIELDS,
  "clothing-fashion/footwear": [...APPAREL_FIELDS.filter((f) => f !== "gsm")],
  "clothing-fashion/handbags-bags": ["fabricComposition", "careInstructions", "gender"],
  "clothing-fashion/accessories": ["fabricComposition", "careInstructions", "gender"],
  "clothing-fashion/underwear-nightwear": APPAREL_FIELDS,
  "clothing-fashion/workwear-uniforms": APPAREL_FIELDS,
  "clothing-fashion/maternity": APPAREL_FIELDS,
  "clothing-fashion/vintage-pre-owned": APPAREL_FIELDS,
  /* ─── Health & Beauty (9/9) ─── */
  "health-beauty/skincare": HEALTH_BEAUTY_FIELDS,
  "health-beauty/haircare": HEALTH_BEAUTY_FIELDS,
  "health-beauty/makeup-cosmetics": HEALTH_BEAUTY_FIELDS,
  "health-beauty/fragrances-perfume": ["inciList", "paoMonths", "crueltyFree"],
  "health-beauty/personal-care-hygiene": HEALTH_BEAUTY_FIELDS,
  "health-beauty/supplements-vitamins": [...HEALTH_BEAUTY_FIELDS, "ingredients", "allergens", "dietaryTags", "shelfLife", "bestBeforeDate", "storageInstructions"],
  "health-beauty/mens-grooming": HEALTH_BEAUTY_FIELDS,
  "health-beauty/nail-care": ["inciList", "paoMonths", "crueltyFree"],
  "health-beauty/medical-first-aid": HEALTH_BEAUTY_FIELDS,
  /* ─── Food & Beverages (7/7) ─── */
  "food-beverages/confectionery-chocolate": FOOD_FIELDS,
  "food-beverages/snacks-crisps": FOOD_FIELDS,
  "food-beverages/drinks-beverages": FOOD_FIELDS,
  "food-beverages/tea-coffee": FOOD_FIELDS,
  "food-beverages/health-foods-free-from": FOOD_FIELDS,
  "food-beverages/grocery-pantry": FOOD_FIELDS,
  "food-beverages/international-speciality": FOOD_FIELDS,
  /* ─── Toys & Games (8/8) — Google: age_group required; material, pattern recommended ─── */
  "toys-games/action-figures-dolls": ["fabricComposition", "gender", "sizeChart"],
  "toys-games/building-sets-construction": [],
  "toys-games/board-games-puzzles": [],
  "toys-games/outdoor-active-toys": [],
  "toys-games/arts-crafts": [],
  "toys-games/educational-toys": [],
  "toys-games/plush-soft-toys": ["fabricComposition", "careInstructions", "gender", "sizeChart"],
  "toys-games/collectibles-trading-cards": [],
  /* ─── Gifts & Seasonal (8/8) — Google: mostly cross-category fields ─── */
  "gifts-seasonal/gift-sets-hampers": ["ingredients", "allergens", "shelfLife", "bestBeforeDate"],
  "gifts-seasonal/christmas-holiday": [],
  "gifts-seasonal/party-supplies": [],
  "gifts-seasonal/stationery-greeting-cards": [],
  "gifts-seasonal/candles-home-fragrance": ["ingredients", "crueltyFree"],
  "gifts-seasonal/novelty-gadgets": [],
  "gifts-seasonal/books-media": [],
  "gifts-seasonal/wedding-occasions": [],
  /* ─── Jewellery & Watches (6/6) — Google: material, gender recommended ─── */
  "jewellery-watches/rings": ["gender", "sizeChart"],
  "jewellery-watches/necklaces-pendants": ["gender"],
  "jewellery-watches/watches": ["gender"],
  "jewellery-watches/earrings": ["gender"],
  "jewellery-watches/bracelets-bangles": ["gender", "sizeChart"],
  "jewellery-watches/costume-fashion-jewellery": ["gender"],
  /* ─── Electronics & Technology (9/9) — batteryInfo is in Tab 3 cross-category ─── */
  "electronics-technology/smartphones-tablets": [],
  "electronics-technology/laptops-computers": [],
  "electronics-technology/tv-audio": [],
  "electronics-technology/gaming-consoles": [],
  "electronics-technology/smart-home-wearables": [],
  "electronics-technology/phone-accessories": [],
  "electronics-technology/computer-accessories": [],
  "electronics-technology/cameras-photography": [],
  "electronics-technology/cables-chargers-batteries": [],
  /* ─── Sports & Outdoors (7/7) — Google: gender, age_group for apparel-adjacent ─── */
  "sports-outdoors/gym-fitness-equipment": INDUSTRIAL_FIELDS,
  "sports-outdoors/outdoor-water-sports": ["gender", "sizeChart"],
  "sports-outdoors/team-sports": ["gender", "sizeChart"],
  "sports-outdoors/cycling": INDUSTRIAL_FIELDS,
  "sports-outdoors/camping-hiking": [],
  "sports-outdoors/running-athletics": ["gender", "sizeChart", "predominantSizes"],
  "sports-outdoors/sports-accessories": [],
  /* ─── Pet Supplies (6/6) ─── */
  "pet-supplies/dog": [],
  "pet-supplies/cat": [],
  "pet-supplies/pet-food-treats": ["ingredients", "allergens", "storageInstructions", "shelfLife", "bestBeforeDate", "countryOfHarvest"],
  "pet-supplies/grooming-hygiene": ["inciList", "crueltyFree", "dermatologicallyTested"],
  "pet-supplies/beds-bowls-accessories": ["fabricComposition", "careInstructions"],
  "pet-supplies/small-animals-birds-fish": [],
  /* ─── Baby & Kids (7/7) — Google: age_group, gender required for apparel ─── */
  "baby-kids/baby-clothing-shoes": APPAREL_FIELDS,
  "baby-kids/feeding-nursing": ["ingredients", "allergens", "storageInstructions", "shelfLife", "bestBeforeDate"],
  "baby-kids/pushchairs-car-seats": INDUSTRIAL_FIELDS,
  "baby-kids/nursery-furniture-bedding": ["fabricComposition", "gsm", "careInstructions"],
  "baby-kids/safety-baby-proofing": [],
  "baby-kids/nappies-changing": ["skinType", "dermatologicallyTested"],
  "baby-kids/kids-bags-lunch-boxes": ["fabricComposition", "careInstructions"],
  /* ─── Home & Garden (10/10) — Google: material, pattern recommended for furniture/decor ─── */
  "home-garden/furniture": [],
  "home-garden/kitchen-dining": ["ingredients"],
  "home-garden/bedding-linen": ["fabricComposition", "gsm", "careInstructions"],
  "home-garden/home-decor": [],
  "home-garden/garden-outdoor": [],
  "home-garden/lighting": [],
  "home-garden/storage-organisation": [],
  "home-garden/bathroom": [],
  "home-garden/cleaning-household": ["ingredients"],
  "home-garden/diy-tools": INDUSTRIAL_FIELDS,
  /* ─── Automotive & Parts (7/7) ─── */
  "automotive-parts/car-accessories": INDUSTRIAL_FIELDS,
  "automotive-parts/car-electronics": [],
  "automotive-parts/car-care-cleaning": ["ingredients"],
  "automotive-parts/parts-components": INDUSTRIAL_FIELDS,
  "automotive-parts/motorbike-scooter": INDUSTRIAL_FIELDS,
  "automotive-parts/tools-garage-equipment": INDUSTRIAL_FIELDS,
  "automotive-parts/caravanning-towing": [],
  /* ─── Surplus & Clearance (6/6 — all get lot fields) ─── */
  "surplus-clearance/mixed-pallets": LOT_FIELDS,
  "surplus-clearance/customer-returns": LOT_FIELDS,
  "surplus-clearance/end-of-line": LOT_FIELDS,
  "surplus-clearance/overstock-excess": LOT_FIELDS,
  "surplus-clearance/liquidation-seized-goods": LOT_FIELDS,
  "surplus-clearance/refurbished-graded": LOT_FIELDS,
};

/**
 * Given the deal's selected category slugs, returns the deduplicated set of
 * category-specific field keys that should be shown in Tab 8.
 */
function getActiveFieldsForCategories(selectedCats = []) {
  const fieldSet = new Set();
  for (const cat of selectedCats) {
    const fields = CATEGORY_FIELD_MAP[cat];
    if (fields) fields.forEach((f) => fieldSet.add(f));
  }
  return fieldSet;
}

/** Helper: does the active field set contain ANY field from a group? */
function hasFieldGroup(activeFields, groupFields) {
  return groupFields.some((f) => activeFields.has(f));
}

/**
 * Build the set of fields already covered by a visible major section.
 * Used to identify "orphan" fields that need their own render section.
 */
function getCoveredFields(showApparel, showFood, showHealthBeauty, showIndustrial, showLot) {
  const covered = new Set();
  if (showApparel) APPAREL_FIELDS.forEach((f) => covered.add(f));
  if (showFood) FOOD_FIELDS.forEach((f) => covered.add(f));
  if (showHealthBeauty) HEALTH_BEAUTY_FIELDS.forEach((f) => covered.add(f));
  if (showIndustrial) INDUSTRIAL_FIELDS.forEach((f) => covered.add(f));
  if (showLot) LOT_FIELDS.forEach((f) => covered.add(f));
  return covered;
}

/* ═══════════════════════════════════════════════════════════════════
   FIELD LABELS
   ═══════════════════════════════════════════════════════════════════ */

const DEAL_FIELD_LABELS = {
  /* Tab 1 — Product & Pricing */
  categories: "Deal Categories",
  title: "Product Title",
  price: "Price",
  currency: "Currency",
  priceUnit: "Price Unit",
  vat: "VAT",
  grade: "Product Grade / Condition",
  dealStatus: "Deal Status",
  seasonality: "Seasonality",
  ean: "EAN / GTIN",
  mpn: "MPN (Manufacturer Part Number)",
  asin: "ASIN (Amazon ID)",
  sku: "SKU (Your Internal Code)",
  taric: "TARIC / HS Code",
  brands: "Brand(s)",
  rrp: "RRP / MSRP",
  rrpCurrency: "RRP Currency",
  priceTiers: "Volume Price Tiers",
  mapPrice: "MAP (Minimum Advertised Price)",
  omnibusPrice: "Omnibus Price (EU 30-Day Low)",
  originalPrice: "Original Price (Pre-Discount)",
  discountPercentage: "Discount Percentage",
  firstOrderDiscount: "First Order Discount",
  negotiable: "Price Negotiable",
  priceValidUntil: "Price Valid Until",
  offerValidityDays: "Offer Validity (Days)",
  /* Tab 2 — Description & Media */
  description: "Product Description",
  images: "Product Images",
  videoUrl: "Video URL (YouTube / Vimeo)",
  tags: "Tags",
  searchKeywords: "Search Keywords",
  productHighlights: "Product Highlights",
  packageContents: "Package Contents",
  targetAudience: "Target Audience",
  /* Tab 3 — Specifications */
  specifications: "Technical Specifications",
  variants: "Product Variants",
  materials: "Materials",
  packaging: "Packaging Dimensions",
  productDimensions: "Product Dimensions",
  netWeight: "Net Weight",
  grossWeight: "Gross Weight",
  color: "Colour(s)",
  pattern: "Pattern",
  powerSource: "Power Source",
  assemblyRequired: "Assembly Required",
  batteryInfo: "Battery Information",
  /* Tab 4 — Order & Stock Terms */
  moq: "Minimum Order Quantity",
  /* moqUnit removed — inherited from priceUnit */
  availableQuantity: "Available Quantity",
  maxOrderQuantity: "Maximum Order Quantity",
  orderIncrement: "Order Increment",
  casePackSize: "Case Pack Size",
  multipackQuantity: "Multipack Quantity",
  isIndivisibleLot: "Indivisible Lot",
  crossCategoryMOQ: "Cross-Category MOQ",
  /* Tab 5 — Shipping & Logistics */
  shippingScope: "Shipping Scope",
  shippingContinents: "Shipping Continents",
  shippingCountries: "Shipping Countries",
  restrictionScope: "Restriction Scope",
  restrictedContinents: "Restricted Continents",
  countryRestrictions: "Restricted Countries",
  shippingClass: "Shipping Class",
  shippingCostBearer: "Shipping Cost Bearer",
  shippingCostMethod: "Shipping Cost Method",
  readyToShip: "Ready to Ship",
  isDropship: "Dropship Available",
  freeDelivery: "Free Delivery",
  stockLocation: "Stock Location",
  portOfOrigin: "Port of Origin",
  packagingFormat: "Packaging Format",
  palletConfiguration: "Pallet Configuration",
  containerLoadQuantity: "Container Load Quantity",
  stackable: "Stackable",
  leadTimeTiers: "Lead Time Tiers",
  /* Tab 6 — Compliance & Legal */
  hazmatInfo: "Hazmat Information",
  hazardSymbols: "Hazard Symbols (GHS)",
  ageRestriction: "Age Restriction",
  regionalCompliance: "Regional Compliance Notes",
  certifications: "Certifications",
  warrantyInfo: "Warranty Details",
  warranty: "Seller Warranty",
  cpscCompliance: "CPSC Compliance",
  fdaRegistration: "FDA Registration",
  energyRating: "Energy Rating",
  sarValue: "SAR Value",
  ipRating: "IP Rating",
  euResponsiblePerson: "EU Responsible Person",
  exportOnly: "Export Only",
  exportRegions: "Export Regions",
  /* Tab 7 — Commercial Overrides */
  supplierPaymentMethods: "Payment Methods (Override)",
  netPaymentTerms: "Payment Terms (Override)",
  depositRequired: "Deposit (Override)",
  taxClass: "Tax Class (Override)",
  invoiceType: "Invoice Type (Override)",
  sanitizedInvoice: "Sanitized Invoices (Override)",
  deliveryMethods: "Delivery Methods (Override)",
  incoterms: "Incoterms (Override)",
  returnPolicy: "Return Policy (Override)",
  dealReturnPolicy: "Deal-Specific Return Policy",
  /* Tab 8 — Category-Specific (cross-category) */
  launchDate: "Launch Date",
  discontinuedDate: "Discontinued Date",
  manufacturingCountry: "Country of Manufacture",
  productLanguage: "Product Language(s)",
  compatibleWith: "Compatible With",
  customizationOptions: "Customization Options",
  ecoFriendly: "Eco-Friendly Attributes",
  supplyAbility: "Supply Ability",
  sampleLeadTime: "Sample Lead Time",
  /* Tab 8 — lot / liquidation */
  isAssortedLot: "Assorted Lot",
  lotComposition: "Lot Composition",
  isManifested: "Manifested",
  imagesRepresentative: "Images Are Representative",
  hasOriginalLabels: "Has Original Labels",
  labelCondition: "Label Condition",
  mayContainDuplicates: "May Contain Duplicates",
  stockOrigin: "Stock Origin",
  sourceRetailers: "Source Retailers",
  gradeCategory: "Lot Grade Category",
  gradeNotes: "Grade Notes",
  lotRetailValue: "Estimated Lot Retail Value",
  authenticityGuarantee: "Authenticity Guarantee",
  functionalRate: "Functional Rate",
  /* Tab 8 — apparel */
  fabricComposition: "Fabric Composition",
  gsm: "GSM (Fabric Weight)",
  careInstructions: "Care Instructions",
  fitType: "Fit Type",
  gender: "Gender",
  sizeChart: "Size Chart",
  predominantSizes: "Predominant Sizes",
  /* Tab 8 — food */
  ingredients: "Ingredients",
  allergens: "Allergens",
  dietaryTags: "Dietary Tags",
  nutritionalInfo: "Nutritional Information",
  storageInstructions: "Storage Instructions",
  shelfLife: "Shelf Life",
  organicCertification: "Organic Certification",
  kosherHalal: "Kosher / Halal",
  countryOfHarvest: "Country of Harvest",
  abv: "ABV (Alcohol by Volume)",
  vintageYear: "Vintage Year",
  bestBeforeDate: "Best Before Date",
  gmoDeclaration: "GMO Declaration",
  storageTemperatureRange: "Storage Temperature Range",
  /* Tab 8 — health & beauty */
  inciList: "INCI List",
  spfRating: "SPF Rating",
  skinType: "Skin Type",
  paoMonths: "PAO (Period After Opening)",
  crueltyFree: "Cruelty-Free",
  dermatologicallyTested: "Dermatologically Tested",
  /* Tab 8 — industrial */
  toleranceSpecs: "Tolerance Specifications",
  pressureRating: "Pressure Rating",
  temperatureRange: "Temperature Range",
  threadType: "Thread Type",
  materialGrade: "Material Grade",
};

/* ═══════════════════════════════════════════════════════════════════
   REQUIRED FIELDS (gatekeeper — blocks submission)
   ═══════════════════════════════════════════════════════════════════ */

const DEAL_REQUIRED_FIELDS = {
  title: "Product Title",
  price: "Price",
  currency: "Currency",
  grade: "Product Grade",
  categories: "Deal Categories",
  description: "Product Description",
};

/* Cross-field: at least one of ean/mpn/asin required — validated separately */

/* ═══════════════════════════════════════════════════════════════════
   TIPS DATA
   ═══════════════════════════════════════════════════════════════════ */

const DEAL_TIPS_DATA = {
  categories: { title: "Deal Categories", tip: "Select up to 3 subcategories that best describe this product. Categories drive which specialised fields appear in Tab 8 (e.g. apparel, food, health & beauty). At least one category is required.", icon: Layers },
  title: { title: "Product Title", tip: "Use a specific, descriptive title. Include brand, product type, model, and key attributes. Titles like 'Phones' or 'Mixed items' are too generic and will be rejected and won't be published.", icon: Package },
  price: { title: "Price", tip: "Enter your wholesale unit price excluding VAT. This price will be validated against the product's RRP — listings with unrealistic margins may be rejected or require manual review.", icon: DollarSign },
  currency: { title: "Currency", tip: "Select the currency for this deal's pricing. Defaults to your profile's preferred currency.", icon: DollarSign },
  grade: { title: "Product Grade", tip: "Select the condition of the goods. This drives search filters and buyer expectations. Each grade displays with a distinct badge colour on the listing.", icon: Sparkles },
  ean: { title: "EAN / GTIN", tip: "Enter the 13-digit EAN barcode. Used for RRP auto-lookup, image auto-fetch, and product matching. Must pass GS1 checksum validation.", icon: Tag },
  mpn: { title: "Manufacturer Part Number", tip: "The manufacturer's own part/model number. Helps with product identification when EAN is unavailable.", icon: Tag },
  asin: { title: "ASIN", tip: "Amazon Standard Identification Number (10 characters). Helps us automatically find product images and verify pricing from Amazon.", icon: Tag },
  sku: { title: "SKU", tip: "Your internal stock keeping unit code. Not shown to buyers — used for your inventory management.", icon: Tag },
  taric: { title: "TARIC / HS Code", tip: "6-10 digit customs tariff code. Required for cross-border trade compliance and duty calculation.", icon: Shield },
  brands: { title: "Brand(s)", tip: "Add all brands included in this deal. Brand-tagged listings receive significantly more buyer engagement.", icon: Tag },
  moq: { title: "Minimum Order Quantity", tip: "The minimum number of units a buyer must order. Lower MOQs attract more small-to-medium buyers.", icon: Package },
  description: { title: "Product Description", tip: "Write a detailed description (50+ characters). Include materials, use cases, key features. Rich descriptions improve search ranking and buyer confidence.", icon: FileText },
  images: { title: "Product Images", tip: "Upload clear product photos. If you provide an EAN or ASIN, images can be auto-fetched. Listings with 3+ images get 4x more enquiries.", icon: Upload },
  videoUrl: { title: "Video URL", tip: "Add a YouTube or Vimeo product video. Video listings have higher engagement rates.", icon: FileText },
  specifications: { title: "Technical Specifications", tip: "Add key-value pairs for product specs (e.g., 'Screen Size: 6.1 inches'). Detailed specs help buyers make faster purchasing decisions.", icon: Settings },
  variants: { title: "Product Variants", tip: "Define variant attributes (e.g., Color: Red, Blue, Green). Helps buyers understand available options.", icon: Settings },
  rrp: { title: "RRP / MSRP", tip: "Required. Recommended retail price per unit. Used to show buyers how much they save compared to retail. Also helps us verify your pricing is competitive.", icon: DollarSign },
  priceTiers: { title: "Volume Price Tiers", tip: "Offer quantity-based pricing to encourage larger orders. Each tier specifies a minimum quantity and the price at that level.", icon: DollarSign },
  availableQuantity: { title: "Available Quantity", tip: "Total units available for sale. Leave blank for unlimited. Shown as a stock indicator to buyers.", icon: Package },
  negotiable: { title: "Price Negotiable", tip: "Enable to show a 'Negotiable' badge on the listing. Deals marked negotiable receive more enquiries.", icon: DollarSign },
  stockLocation: { title: "Stock Location", tip: "Leave empty to use your company's country. Set this if the stock ships from a different location than your registered address.", icon: Globe },
  shippingScope: { title: "Shipping Scope", tip: "Declare your shipping reach. Worldwide listings get maximum visibility. Specific listings show to buyers in selected regions only.", icon: Truck },
  shippingClass: { title: "Shipping Class", tip: "Select the shipping category. Hazmat and Perishable classes trigger additional compliance fields.", icon: Truck },
  readyToShip: { title: "Ready to Ship", tip: "Products in stock and ready for immediate dispatch. Shows a 'Ready to Ship' badge that buyers actively filter for.", icon: Truck },
  hazmatInfo: { title: "Hazmat Information", tip: "Declare if this product is classified as hazardous. Required for chemicals, batteries, aerosols, and other regulated goods.", icon: Shield },
  certifications: { title: "Certifications", tip: "Select all certifications this product holds. CE and UKCA are mandatory for many product categories sold in the EU/UK.", icon: Shield },
  warrantyInfo: { title: "Warranty Details", tip: "Describe the warranty coverage — duration, type, what's covered. Warranty information increases buyer trust.", icon: Shield },
  supplierPaymentMethods: { title: "Payment Methods", tip: "Uses the payment methods from your supplier profile. Toggle 'Override' to accept different methods for this deal.", icon: DollarSign },
  deliveryMethods: { title: "Delivery Methods", tip: "Uses the delivery methods from your supplier profile. Toggle 'Override' to offer different shipping options for this deal.", icon: Truck },
  dealStatus: { title: "Deal Status", tip: "Active = visible to buyers. Sold Out = listing stays up but marked as unavailable for new orders.", icon: Info },
  seasonality: { title: "Seasonality", tip: "Seasonal products are highlighted in relevant periods. All-season products maintain consistent visibility.", icon: Calendar },
  manufacturingCountry: { title: "Country of Manufacture", tip: "Where the product was manufactured. Shown on the listing and used for compliance filtering.", icon: Globe },
};

const DEAL_TAB_DEFAULT_TIPS = {
  "product-pricing": { title: "Product & Pricing", tip: "Define the product, set pricing, and configure discounts. All price-related fields — wholesale price, RRP, volume tiers, and buyer incentives — live here. At least one product identifier (EAN, MPN, or ASIN) is required.", icon: Package },
  "description-media": { title: "Description & Media", tip: "Add a detailed product description and images. Listings with rich descriptions and 3+ images receive 4× more buyer enquiries.", icon: FileText },
  "specifications": { title: "Product Specifications", tip: "Define technical specifications, dimensions, weight, and product attributes. Detailed specs help buyers evaluate products faster.", icon: Settings },
  "order-stock": { title: "Order & Stock Terms", tip: "Set minimum order quantities, stock levels, and order constraints. Clear terms help buyers plan their purchases.", icon: ShoppingBag },
  "shipping-logistics": { title: "Shipping & Logistics", tip: "Configure shipping scope, methods, packaging details, and lead times. Complete shipping data is critical for international buyers.", icon: Truck },
  "compliance-legal": { title: "Compliance & Legal", tip: "Declare certifications, hazmat status, warranties, and regulatory compliance. Required for cross-border trade.", icon: Shield },
  "commercial-overrides": { title: "Commercial Overrides", tip: "Need different payment terms or delivery options for this deal? Override your profile defaults here without changing your profile.", icon: RefreshCw },
  "category-specific": { title: "Category-Specific", tip: "Additional fields based on your product category. Apparel, food, health, industrial, and lot/liquidation products each have specialised attributes.", icon: Layers },
};

const DEAL_TIPS_BOTTOM = (
  <WhyItMattersSection
    title="Why complete listings matter"
    items={[
      "Listings with 90%+ completeness get 5× more buyer enquiries",
      "Product identifiers (EAN/ASIN) enable automatic image lookup and price verification",
      "Complete compliance data makes your listing visible to international buyers",
      "Volume pricing tiers encourage larger orders from wholesale buyers",
    ]}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   VALIDATION
   ═══════════════════════════════════════════════════════════════════ */

const EAN_REGEX = /^\d{8,14}$/;
const ASIN_REGEX = /^[A-Z0-9]{10}$/i;
const TARIC_REGEX = /^\d{6,10}$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;

function validateEanChecksum(ean) {
  if (!EAN_REGEX.test(ean)) return false;
  const digits = ean.split("").map(Number);
  const len = digits.length;
  if (len !== 8 && len !== 13 && len !== 14) return false;
  let sum = 0;
  for (let i = 0; i < len - 1; i++) {
    sum += digits[i] * (i % 2 === 0 ? (len === 8 ? 3 : 1) : (len === 8 ? 1 : 3));
  }
  if (len === 13) {
    let s = 0;
    for (let i = 0; i < 12; i++) s += digits[i] * (i % 2 === 0 ? 1 : 3);
    return (10 - (s % 10)) % 10 === digits[12];
  }
  return true; /* simplified for 8/14-digit */
}

function revalidateDealField(field, value, form) {
  switch (field) {
    case "title":
      if (!value || !value.trim()) return "Product title is required";
      if (value.trim().length < 5) return "Title must be at least 5 characters";
      if (/^(item|product|goods|stuff|things|lot)$/i.test(value.trim())) return "Product name is too generic";
      return "";
    case "price":
      if (!value && value !== 0) return "Price is required";
      if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return "Enter a valid positive price";
      return "";
    case "rrp":
      if (!value && value !== 0) return "RRP / MSRP is required";
      if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) return "Enter a valid positive RRP";
      return "";
    case "currency":
      if (!value) return "Currency is required";
      return "";
    case "grade":
      if (!value) return "Product grade is required";
      return "";
    case "categories":
      if (!value || !Array.isArray(value) || value.length === 0) return "At least one category is required";
      if (value.length > 3) return "Maximum 3 categories allowed";
      return "";
    case "ean":
      if (!value) return "";
      if (!EAN_REGEX.test(value)) return "EAN must be 8-14 digits";
      if (value.length === 13 && !validateEanChecksum(value)) return "Invalid EAN checksum";
      return "";
    case "asin":
      if (!value) return "";
      if (!ASIN_REGEX.test(value)) return "ASIN must be 10 alphanumeric characters";
      return "";
    case "taric":
      if (!value) return "";
      if (!TARIC_REGEX.test(value)) return "TARIC code must be 6-10 digits";
      return "";
    case "description":
      if (!value || !value.trim()) return "Product description is required";
      if (value.trim().length < 50) return `Description must be at least 50 characters (${value.trim().length}/50)`;
      return "";
    case "videoUrl":
      if (!value) return "";
      if (!URL_RE.test(value)) return "Enter a valid URL";
      return "";
    case "moq":
      if (!value) return "";
      if (isNaN(parseInt(value)) || parseInt(value) < 1) return "MOQ must be at least 1";
      return "";
    case "discountPercentage":
      if (!value) return "";
      if (isNaN(parseFloat(value)) || parseFloat(value) < 0 || parseFloat(value) > 100) return "Discount must be 0-100%";
      return "";
    case "dealStatus":
      if (!value) return "Deal status is required";
      return "";
    case "priceUnit":
      if (!value) return "Price unit is required";
      return "";
    case "vat":
      if (!value) return "VAT setting is required";
      return "";
    case "mapPrice":
    case "omnibusPrice":
    case "originalPrice":
      if (!value) return "";
      if (isNaN(parseFloat(value)) || parseFloat(value) < 0) return "Enter a valid price";
      return "";
    default:
      return "";
  }
}

function validateIdentifiers(form) {
  if (!form.ean && !form.mpn && !form.asin) {
    return "At least one product identifier (EAN, MPN, or ASIN) is required";
  }
  return "";
}

/* ═══════════════════════════════════════════════════════════════════
   INITIAL FORM STATE
   ═══════════════════════════════════════════════════════════════════ */

function createInitialDealForm() {
  return {
    /* Tab 1 */
    categories: [],
    title: "", price: "", currency: "GBP", priceUnit: "/ Unit", vat: "ex. VAT", grade: "",
    ean: "", mpn: "", asin: "", sku: "", taric: "",
    brands: [], moq: "",
    /* Tab 2 */
    description: "", images: [], videoUrl: "",
    tags: [], searchKeywords: [], productHighlights: [],
    packageContents: "", targetAudience: [],
    /* Tab 3 */
    specifications: [], variants: [], materials: "",
    packaging: { length: "", width: "", height: "", unit: "cm", weight: "", weightUnit: "kg" },
    productDimensions: { length: "", width: "", height: "", unit: "cm", notes: "" },
    netWeight: { value: "", unit: "kg" }, grossWeight: { value: "", unit: "kg" },
    color: [], pattern: "", powerSource: [],
    assemblyRequired: false, batteryInfo: { required: false, included: false, removable: false, type: "", voltage: "", capacity: "", quantity: "" },
    /* Tab 4 */
    rrp: "", rrpCurrency: "GBP", priceTiers: [], mapPrice: "", omnibusPrice: "", originalPrice: "",
    discountPercentage: "", availableQuantity: "", maxOrderQuantity: "", orderIncrement: "",
    casePackSize: "", multipackQuantity: "",
    isIndivisibleLot: false, crossCategoryMOQ: false, negotiable: false,
    firstOrderDiscount: { percentage: "", label: "" }, priceValidUntil: "", offerValidityDays: "",
    /* Tab 5 */
    stockLocation: "", stockLocationCode: "",
    shippingScope: "inherited", shippingContinents: [], shippingCountries: [],
    restrictionScope: "inherited", restrictedContinents: [], countryRestrictions: [],
    shippingClass: "", shippingCostBearer: "", shippingCostMethod: "",
    readyToShip: false, isDropship: false, freeDelivery: false,
    portOfOrigin: "", packagingFormat: "",
    palletConfiguration: { unitsPerLayer: "", layersPerPallet: "", unitsPerPallet: "" },
    containerLoadQuantity: { twentyFt: "", fortyFt: "", fortyHC: "" },
    stackable: false, leadTimeTiers: [],
    /* Tab 6 */
    hazmatInfo: { isHazardous: false, unNumber: "", class: "" },
    hazardSymbols: [], ageRestriction: { minAge: "", reason: "" },
    regionalCompliance: [], certifications: [],
    warrantyInfo: { duration: "", type: "", coverage: "" },
    warranty: "",
    cpscCompliance: { compliant: false, certNumber: "", testLab: "" },
    fdaRegistration: { registered: false, number: "", type: "" },
    energyRating: { system: "", rating: "", annualConsumption: "" },
    sarValue: { head: "", body: "" }, ipRating: "",
    euResponsiblePerson: { name: "", address: "", email: "" },
    exportOnly: false, exportRegions: [],
    /* Tab 7 — override flags + values */
    overrides: {
      supplierPaymentMethods: false, netPaymentTerms: false, depositRequired: false,
      taxClass: false, invoiceType: false, sanitizedInvoice: false,
      deliveryMethods: false, incoterms: false, returnPolicy: false,
    },
    supplierPaymentMethods: [], netPaymentTerms: "", depositRequired: { percentage: "", terms: "" },
    taxClass: "", invoiceType: "", sanitizedInvoice: "",
    deliveryMethods: [], incoterms: "", returnPolicy: "", dealReturnPolicy: "",
    /* Tab 8 — cross-category */
    dealStatus: "active", launchDate: "", discontinuedDate: "",
    seasonality: "", manufacturingCountry: "", productLanguage: [],
    compatibleWith: [], customizationOptions: [],
    ecoFriendly: { materials: [], packaging: [], production: "" },
    supplyAbility: { quantity: "", unit: "Units", period: "month" },
    sampleLeadTime: { min: "", max: "", unit: "days" },
    /* Tab 8 — apparel */
    fabricComposition: [], gsm: "", careInstructions: { wash: "", dry: "", iron: "", bleach: "" },
    fitType: "", gender: "", sizeChart: [], predominantSizes: [],
    /* Tab 8 — food */
    ingredients: "", allergens: [], dietaryTags: [],
    nutritionalInfo: { servingSize: "", calories: "", fat: "", saturatedFat: "", carbs: "", sugar: "", fiber: "", protein: "", salt: "" },
    storageInstructions: "", shelfLife: "",
    organicCertification: { certified: false, body: "", number: "" },
    kosherHalal: { kosher: false, halal: false, certBody: "" },
    countryOfHarvest: "", abv: "", vintageYear: "", bestBeforeDate: "",
    gmoDeclaration: "", storageTemperatureRange: { min: "", max: "", unit: "°C" },
    /* Tab 8 — health & beauty */
    inciList: "", spfRating: "", skinType: [], paoMonths: "",
    crueltyFree: { certified: false, body: "" }, dermatologicallyTested: false,
    /* Tab 8 — industrial */
    toleranceSpecs: "", pressureRating: { value: "", unit: "" },
    temperatureRange: { min: "", max: "", unit: "°C" }, threadType: "", materialGrade: "",
    /* Tab 8 — lot / liquidation */
    isAssortedLot: false, lotComposition: [], authenticityGuarantee: "",
    imagesRepresentative: false, sourceRetailers: [], stockOrigin: [],
    isManifested: false, lotRetailValue: "", gradeNotes: "", gradeCategory: "",
    hasOriginalLabels: false, labelCondition: "", mayContainDuplicates: false,
    functionalRate: { functional: "", withIssues: "", note: "" },
  };
}

/* ═══════════════════════════════════════════════════════════════════
   COMPOUND COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Multi-Image Upload with table and removal ─── */
function MultiImageUpload({ id, images = [], onChange, onFocus, max = 10 }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const existing = images.length;
    const remaining = max - existing;
    if (remaining <= 0) return;
    const newImgs = Array.from(fileList).slice(0, remaining).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    onChange([...images, ...newImgs]);
  };

  const removeImage = (imgId) => {
    onChange(images.filter((img) => img.id !== imgId));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div id={id} onFocus={onFocus}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 ${
          dragOver ? "border-orange-400 bg-orange-50" : images.length > 0 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50"
        }`}
      >
        <Upload size={20} className={dragOver ? "text-orange-500" : "text-slate-400"} />
        <span className="text-sm text-slate-500">
          {images.length >= max ? "Maximum images reached" : "Click or drag images here"}
        </span>
        <span className="text-[11px] text-slate-500">{images.length}/{max} images — JPG, PNG, WebP up to 5 MB each</span>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      {/* Image table */}
      {images.length > 0 && (
        <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 w-14">Preview</th>
                <th className="px-3 py-2">Filename</th>
                <th className="px-3 py-2 w-20 text-right">Size</th>
                <th className="px-3 py-2 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {images.map((img, i) => (
                <tr key={img.id} className="hover:bg-slate-50 group">
                  <td className="px-3 py-1.5">
                    <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden bg-white flex items-center justify-center">
                      {img.url ? (
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={14} className="text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className="text-slate-700 truncate block max-w-[200px]">{i === 0 && <span className="text-[10px] font-semibold text-orange-500 mr-1.5">COVER</span>}{img.name}</span>
                  </td>
                  <td className="px-3 py-1.5 text-right text-slate-500 text-xs">{formatSize(img.size)}</td>
                  <td className="px-3 py-1.5">
                    <button type="button" onClick={() => removeImage(img.id)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100" aria-label={`Remove ${img.name}`}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Toggle Switch ─── */
function DealToggle({ checked, onChange, label, id, error, description }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-400 ${checked ? "bg-orange-500" : "bg-slate-300"} ${error ? "ring-2 ring-red-300" : ""}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 cursor-pointer">{label}</label>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

/* ─── KeyValueBuilder — dynamic key-value pairs for specifications ─── */
function KeyValueBuilder({ rows = [], onChange, label = "Specifications", onFocusField, id }) {
  const addRow = () => onChange([...rows, { key: "", value: "" }]);
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) => onChange(rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="space-y-2" id={id}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {rows.length === 0 && <p className="text-xs text-slate-400 italic">No specifications added yet.</p>}
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text" value={row.key} onChange={(e) => updateRow(i, "key", e.target.value)}
            onFocus={() => onFocusField?.("specifications")} onBlur={() => onFocusField?.(null)}
            placeholder="e.g. Screen Size" aria-label={`Specification ${i + 1} name`}
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <input
            type="text" value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)}
            onFocus={() => onFocusField?.("specifications")} onBlur={() => onFocusField?.(null)}
            placeholder="e.g. 6.1 inches" aria-label={`Specification ${i + 1} value`}
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <button type="button" onClick={() => removeRow(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove specification ${i + 1}`}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-lg transition-all border border-orange-200 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)]">
        <Plus size={13} /> Add Specification
      </button>
    </div>
  );
}

/* ─── TierBuilder — quantity/price tier rows ─── */
function TierBuilder({ tiers = [], onChange, label = "Tiers", fields = ["minQty", "maxQty", "price"], fieldLabels = { minQty: "Min Qty", maxQty: "Max Qty", price: "Price" }, onFocusField, focusKey, id }) {
  const addTier = () => {
    const empty = {};
    fields.forEach((f) => { empty[f] = ""; });
    onChange([...tiers, empty]);
  };
  const removeTier = (i) => onChange(tiers.filter((_, idx) => idx !== i));
  const updateTier = (i, field, val) => onChange(tiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  return (
    <div className="space-y-2" id={id}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {tiers.length === 0 && <p className="text-xs text-slate-400 italic">No tiers added yet.</p>}
      {tiers.map((tier, i) => (
        <div key={i} className="flex items-center gap-2">
          {fields.map((f) => (
            <input
              key={f} type="text" inputMode="numeric" value={tier[f] || ""} onChange={(e) => updateTier(i, f, e.target.value.replace(/[^\d.,]/g, ""))}
              onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)}
              placeholder={fieldLabels[f] || f} aria-label={`Tier ${i + 1} ${fieldLabels[f] || f}`}
              className="flex-1 min-w-0 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          ))}
          <button type="button" onClick={() => removeTier(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove tier ${i + 1}`}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addTier} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-lg transition-all border border-orange-200 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)]">
        <Plus size={13} /> Add Tier
      </button>
    </div>
  );
}

/* ─── Inline unit select — styled to match form system ─── */
const inlineSelectClass = "px-3 py-2.5 text-sm text-slate-700 font-medium bg-white border border-slate-200 rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-7";

/* ─── DimensionsInput — L × W × H + unit ─── */
function DimensionsInput({ value = {}, onChange, label, showWeight = false, showNotes = false, onFocusField, focusKey, id }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-2" id={id}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="flex items-center gap-2 flex-wrap">
        <input type="text" inputMode="numeric" value={value.length || ""} onChange={(e) => set("length", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="L" aria-label="Length" className="w-20 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
        <span className="text-slate-400 text-sm">×</span>
        <input type="text" inputMode="numeric" value={value.width || ""} onChange={(e) => set("width", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="W" aria-label="Width" className="w-20 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
        <span className="text-slate-400 text-sm">×</span>
        <input type="text" inputMode="numeric" value={value.height || ""} onChange={(e) => set("height", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="H" aria-label="Height" className="w-20 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
        <select value={value.unit || "cm"} onChange={(e) => set("unit", e.target.value)} aria-label="Dimension unit" className={inlineSelectClass}>
          {DIMENSION_UNIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {showWeight && (
        <div className="flex items-center gap-2">
          <input type="text" inputMode="numeric" value={value.weight || ""} onChange={(e) => set("weight", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="Weight" aria-label="Weight" className="w-24 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
          <select value={value.weightUnit || "kg"} onChange={(e) => set("weightUnit", e.target.value)} aria-label="Weight unit" className={inlineSelectClass}>
            {WEIGHT_UNIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
      {showNotes && (
        <input type="text" value={value.notes || ""} onChange={(e) => set("notes", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="Additional dimension notes" aria-label="Dimension notes" className="w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
      )}
    </div>
  );
}

/* ─── WeightInput — value + unit ─── */
function WeightInput({ value = {}, onChange, label, onFocusField, focusKey, id }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  return (
    <div className="flex items-center gap-2" id={id}>
      <label className="text-xs font-semibold text-slate-600 shrink-0 w-24">{label}</label>
      <input type="text" inputMode="numeric" value={value.value || ""} onChange={(e) => set("value", e.target.value)} onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)} placeholder="0.00" aria-label={label} className="w-24 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
      <select value={value.unit || "kg"} onChange={(e) => set("unit", e.target.value)} aria-label={`${label} unit`} className={inlineSelectClass}>
        {WEIGHT_UNIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ─── RepeaterBuilder — generic add/remove text rows ─── */
function RepeaterBuilder({ rows = [], onChange, label, placeholder = "Enter value", max = 10, maxLength = 150, onFocusField, focusKey, id }) {
  const addRow = () => { if (rows.length < max) onChange([...rows, ""]); };
  const removeRow = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const updateRow = (i, val) => onChange(rows.map((r, idx) => idx === i ? val : r));

  return (
    <div className="space-y-2" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600">{label}</label>
        <span className="text-[10px] text-slate-400">{rows.length}/{max}</span>
      </div>
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text" value={row} onChange={(e) => { if (e.target.value.length <= maxLength) updateRow(i, e.target.value); }}
            onFocus={() => onFocusField?.(focusKey)} onBlur={() => onFocusField?.(null)}
            placeholder={placeholder} aria-label={`${label} item ${i + 1}`}
            className="flex-1 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
          <button type="button" onClick={() => removeRow(i)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Remove ${label} item ${i + 1}`}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      {rows.length < max && (
        <button type="button" onClick={addRow} className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-orange-600 bg-white hover:bg-orange-50 rounded-lg transition-all border border-orange-200 shadow-[0px_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)]">
          <Plus size={13} /> Add Item
        </button>
      )}
    </div>
  );
}

/* ─── Override Field Wrapper — shows inherited value with toggle ─── */
function OverrideField({ label, inheritedLabel, isOverridden, onToggle, children, id }) {
  return (
    <div className="space-y-2 p-3 rounded-lg border border-slate-100 bg-slate-50" id={id}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className="text-[10px] text-slate-400">{isOverridden ? "Deal override" : "Using profile default"}</span>
      </div>
      {!isOverridden && inheritedLabel && (
        <p className="text-xs text-slate-500 bg-white px-3 py-2 rounded-md border border-slate-200">{inheritedLabel}</p>
      )}
      <DealToggle checked={isOverridden} onChange={onToggle} label="Override for this deal" id={`${id}-toggle`} />
      {isOverridden && <div className="pt-1">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════ */

function DealProgressBar({ form, onPctChange }) {
  const REQUIRED_WEIGHT = 3;
  const OPTIONAL_WEIGHT = 1;

  const isStringFilled = (f) => form[f] && String(form[f]).trim().length > 0;
  const isArrayFilled = (f) => Array.isArray(form[f]) && form[f].length > 0;
  const hasIdentifier = form.ean || form.mpn || form.asin;

  let earned = 0, total = 0;
  /* Required fields */
  const reqStrings = ["title", "price", "currency", "grade", "description"];
  for (const f of reqStrings) { total += REQUIRED_WEIGHT; if (isStringFilled(f)) earned += REQUIRED_WEIGHT; }
  /* Product identifier (at least one) */
  total += REQUIRED_WEIGHT; if (hasIdentifier) earned += REQUIRED_WEIGHT;

  /* Optional fields — strings */
  const optStrings = ["sku", "taric", "moq", "materials", "pattern", "videoUrl", "packageContents", "mapPrice", "omnibusPrice", "originalPrice", "discountPercentage", "availableQuantity", "maxOrderQuantity", "stockLocation", "portOfOrigin", "packagingFormat", "warranty", "ipRating"];
  for (const f of optStrings) { total += OPTIONAL_WEIGHT; if (isStringFilled(f)) earned += OPTIONAL_WEIGHT; }

  /* Optional fields — arrays */
  const optArrays = ["brands", "tags", "searchKeywords", "productHighlights", "color", "powerSource", "specifications", "variants", "priceTiers", "shippingCountries", "hazardSymbols", "certifications", "images", "targetAudience"];
  for (const f of optArrays) { total += OPTIONAL_WEIGHT; if (isArrayFilled(f)) earned += OPTIONAL_WEIGHT; }

  /* Toggles count if true */
  const optToggles = ["negotiable", "readyToShip", "freeDelivery"];
  for (const f of optToggles) { total += OPTIONAL_WEIGHT; if (form[f]) earned += OPTIONAL_WEIGHT; }

  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  useEffect(() => { onPctChange?.(pct); }, [pct, onPctChange]);

  const color = pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-orange-500" : "bg-orange-400";
  const textColor = pct === 100 ? "text-emerald-600" : pct >= 60 ? "text-orange-600" : "text-slate-500";
  const message = pct === 100 ? "Listing complete!" : pct >= 75 ? "Almost there — just a few fields left" : pct >= 50 ? "Over halfway — looking good" : pct >= 25 ? "Good start — keep adding details" : "Let's build your listing";

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

/* ═══════════════════════════════════════════════════════════════════
   DEAL FORM COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

function DealForm({ user, onFocusedFieldChange, onActiveTabChange, onSave, onProgressChange }) {
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState(DEAL_TABS[0].id);
  const [form, setForm] = useState(createInitialDealForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Draft persistence */
  const isFormEmpty = useCallback((f) => {
    return !f.title && !f.price && !f.description && !f.ean && !f.mpn && !f.asin;
  }, []);
  const { clearDraft } = useFormDraft("wup-deal-draft-new", form, setForm, { isEmpty: isFormEmpty });

  /* Tab change callback */
  useEffect(() => { onActiveTabChange?.(activeTab); }, [activeTab, onActiveTabChange]);

  /* ─── Field helpers ─── */
  const set = useCallback((field) => (e) => {
    const val = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: revalidateDealField(field, val, form) }));
  }, [touched, submitted, form]);

  const setDirect = useCallback((field, val) => {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: revalidateDealField(field, val, next) }));
      return next;
    });
  }, [touched, submitted]);

  const setCompound = useCallback((field, subfield, val) => {
    setForm((f) => ({ ...f, [field]: { ...f[field], [subfield]: val } }));
  }, []);

  /* ─── Simulated supplier-profile inherited defaults (PRODUCTION: fetch from DB) ─── */
  const INHERITED_DEFAULTS = useMemo(() => ({
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
    netPaymentTerms: "Net 30",
    depositRequired: { percentage: "30", terms: "Before production" },
    taxClass: "standard",
    invoiceType: "vat-invoice",
    sanitizedInvoice: "on-request",
    deliveryMethods: ["dhl", "fedex", "own-fleet"],
    incoterms: "DDP",
    returnPolicy: "30-day returns accepted for unopened items. Buyer pays return shipping.",
  }), []);

  const setOverride = useCallback((field, val) => {
    setForm((f) => {
      const next = { ...f, overrides: { ...f.overrides, [field]: val } };
      /* When toggling ON, pre-populate with inherited supplier defaults */
      if (val && INHERITED_DEFAULTS[field] !== undefined) {
        const current = f[field];
        const isEmpty = Array.isArray(current) ? current.length === 0
          : typeof current === "object" && current !== null ? Object.values(current).every((v) => !v || !String(v).trim())
          : !current || !String(current).trim();
        if (isEmpty) next[field] = INHERITED_DEFAULTS[field];
      }
      return next;
    });
  }, [INHERITED_DEFAULTS]);

  const handleBlur = useCallback((field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const timer = setTimeout(() => {
      setErrors((p) => ({ ...p, [field]: revalidateDealField(field, form[field], form) }));
    }, 120);
    return () => clearTimeout(timer);
  }, [form]);

  const handleFocus = useCallback((field) => () => {
    onFocusedFieldChange?.(field);
  }, [onFocusedFieldChange]);

  const focusField = useCallback((field) => {
    onFocusedFieldChange?.(field);
  }, [onFocusedFieldChange]);

  /* ─── Tab status calculation ─── */
  const getTabStatus = useCallback((tabId) => {
    const tabDef = DEAL_TAB_FIELDS[tabId];
    if (!tabDef) return "empty";
    const allFields = [...tabDef.required, ...tabDef.optional];
    const filledCount = allFields.filter((f) => {
      const v = form[f];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "boolean") return v;
      if (typeof v === "object" && v !== null) return Object.values(v).some((sv) => sv && String(sv).trim());
      return v && String(v).trim().length > 0;
    }).length;
    const hasErrors = allFields.some((f) => errors[f]);
    if (hasErrors) return "error";
    if (filledCount === 0) return "empty";
    if (filledCount === allFields.length) return "complete";
    return "partial";
  }, [form, errors]);

  const tabStatuses = useMemo(() => Object.fromEntries(
    DEAL_TABS.map((t) => [t.id, getTabStatus(t.id)])
  ), [getTabStatus]);

  const tabProgress = useCallback((tabId) => {
    const tabDef = DEAL_TAB_FIELDS[tabId];
    if (!tabDef) return 0;
    const allFields = [...tabDef.required, ...tabDef.optional];
    if (allFields.length === 0) return 0;
    const filledCount = allFields.filter((f) => {
      const v = form[f];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "boolean") return v;
      if (typeof v === "object" && v !== null) return Object.values(v).some((sv) => sv && String(sv).trim());
      return v && String(v).trim().length > 0;
    }).length;
    return Math.round((filledCount / allFields.length) * 100);
  }, [form]);

  /* ─── Submit ─── */
  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    setSubmitted(true);
    const errs = {};
    /* Validate all required fields */
    const allRequired = Object.values(DEAL_TAB_FIELDS).flatMap(tab => tab.required);
    for (const field of allRequired) {
      const err = revalidateDealField(field, form[field], form);
      if (err) errs[field] = err;
    }
    /* Cross-field: identifiers */
    const idErr = validateIdentifiers(form);
    if (idErr) { errs.ean = idErr; errs.mpn = idErr; errs.asin = idErr; }

    setErrors(errs);
    if (Object.values(errs).some(Boolean)) {
      const firstErr = Object.keys(errs).find((k) => errs[k]);
      document.getElementById(firstErr)?.focus();
      /* Switch to Tab 1 if gatekeeper errors */
      if (["title", "price", "currency", "grade", "ean", "mpn", "asin"].includes(firstErr)) setActiveTab("product-pricing");
      else if (firstErr === "description") setActiveTab("description-media");
      return;
    }

    /* Demo: simulate save */
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      clearDraft();
      onSave?.();
    }, 1500);
  }, [form, clearDraft, onSave]);

  /* ═══ TAB CONTENT RENDERERS ═══ */

  /* ─── Tab 1: Product Identity ─── */
  /* ─── Tab 1: Product & Pricing ─── */
  const renderProductPricing = () => (
    <>
      <FormSection title="Core Product Information" required>
        <div>
          <FloatingField id="title" label="Product Title" value={form.title} onChange={set("title")} onBlur={handleBlur("title")} onFocus={handleFocus("title")} error={errors.title} required aria-required={true} placeholder="e.g. Apple iPhone 15 Pro Max 256GB — Brand New, Sealed" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Include brand, product type, model, and key attributes. Avoid generic titles.</p>
        </div>
        <div>
          <CategorySelector id="categories" label="Deal Categories" selected={form.categories} onChange={(v) => setDirect("categories", v)} required error={errors.categories} onFocusField={focusField} onBlur={handleBlur("categories")} maxSelections={3} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Determines which product detail fields appear (e.g., fabric for apparel, ingredients for food)</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1 ml-1">Type a brand name and press Enter or comma to add. Add all brands if this is a multi-brand lot.</p>
          <BrandPillInput id="brands" label="Brand(s)" selected={form.brands} onChange={(v) => setDirect("brands", v)} onFocus={() => focusField("brands")} placeholder="Type a brand name, then comma or Enter..." itemLabel="brands" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingSelect id="grade" label="Product Grade / Condition" value={form.grade} onChange={set("grade")} options={GRADE_OPTIONS} onBlur={handleBlur("grade")} onFocus={() => focusField("grade")} error={errors.grade} required />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Shown as a badge on your listing. Buyers can filter by condition, so accurate grading increases visibility.</p>
          </div>
          <div>
            <FloatingSelect id="dealStatus" label="Deal Status" value={form.dealStatus} onChange={set("dealStatus")} options={DEAL_STATUS_OPTIONS} required onFocus={() => focusField("dealStatus")} onBlur={handleBlur("dealStatus")} error={errors.dealStatus} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Active = visible to buyers. Sold Out = keeps listing visible but prevents new enquiries.</p>
          </div>
        </div>
        <div>
          <FloatingSelect id="seasonality" label="Seasonality" value={form.seasonality} onChange={set("seasonality")} options={SEASONALITY_OPTIONS} onFocus={() => focusField("seasonality")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">When the product is typically in highest demand. All-season products maintain consistent visibility.</p>
        </div>
      </FormSection>

      <FormSection title="Product Identifiers" description="At least one identifier (EAN, MPN, or ASIN) is required for RRP lookup and image sourcing.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingField id="ean" label="EAN / GTIN" value={form.ean} onChange={set("ean")} onBlur={handleBlur("ean")} onFocus={handleFocus("ean")} error={errors.ean} inputMode="numeric" placeholder="e.g. 5901234123457" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">13-digit barcode number found on product packaging.</p>
          </div>
          <div>
            <FloatingField id="mpn" label="MPN" value={form.mpn} onChange={set("mpn")} onBlur={handleBlur("mpn")} onFocus={handleFocus("mpn")} error={errors.mpn} placeholder="e.g. MU793ZM/A" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Manufacturer Part Number assigned by the maker.</p>
          </div>
          <div>
            <FloatingField id="asin" label="ASIN" value={form.asin} onChange={set("asin")} onBlur={handleBlur("asin")} onFocus={handleFocus("asin")} error={errors.asin} placeholder="e.g. B0CHXDH9QR" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Amazon Standard Identification Number (10-character alphanumeric).</p>
          </div>
          <div>
            <FloatingField id="sku" label="SKU (Internal)" value={form.sku} onChange={set("sku")} onFocus={handleFocus("sku")} placeholder="e.g. WH-IP15PM-256-BK" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Your own internal stock-keeping reference.</p>
          </div>
        </div>
        <div>
          <FloatingField id="taric" label="TARIC / HS Code" value={form.taric} onChange={set("taric")} onBlur={handleBlur("taric")} onFocus={handleFocus("taric")} error={errors.taric} inputMode="numeric" placeholder="e.g. 8517120000" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">EU customs classification code. Required for cross-border shipments.</p>
        </div>
      </FormSection>

      <FormSection title="Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CurrencyAmountInput id="price" label="Price" value={form.price} onChange={set("price")} currency={form.currency} onCurrencyChange={set("currency")} onBlur={handleBlur("price")} onFocus={() => focusField("price")} error={errors.price} required />
          <FloatingSelect id="priceUnit" label="Price Unit" value={form.priceUnit} onChange={set("priceUnit")} options={PRICE_UNIT_OPTIONS} required onFocus={() => focusField("price")} onBlur={handleBlur("priceUnit")} error={errors.priceUnit} />
          <FloatingSelect id="vat" label="VAT" value={form.vat} onChange={set("vat")} options={VAT_OPTIONS} onFocus={() => focusField("price")} required onBlur={handleBlur("vat")} error={errors.vat} />
        </div>
        <p className="text-[11px] text-slate-500 -mt-2 ml-1">Your wholesale unit price. Select whether the price is excluding or including VAT.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <CurrencyAmountInput id="rrp" label="RRP / MSRP" value={form.rrp} onChange={set("rrp")} currency={form.rrpCurrency} onCurrencyChange={set("rrpCurrency")} onBlur={handleBlur("rrp")} onFocus={() => focusField("rrp")} error={errors.rrp} required />
              </div>
              <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{form.priceUnit || "/ Unit"}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Recommended retail price per unit. Required for margin calculation and savings badge.</p>
          </div>
          <div>
            <FloatingField id="discountPercentage" label="Discount Percentage" value={form.discountPercentage} onChange={set("discountPercentage")} onBlur={handleBlur("discountPercentage")} onFocus={handleFocus("discountPercentage")} error={errors.discountPercentage} inputMode="numeric" placeholder="e.g. 35" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Discount off the original/RRP price, shown on the listing.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <CurrencyAmountInput id="originalPrice" label="Original Price (Pre-Discount)" value={form.originalPrice} onChange={set("originalPrice")} currency={form.currency} onFocus={() => focusField("originalPrice")} onBlur={handleBlur("originalPrice")} error={errors.originalPrice} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Price before any discount was applied.</p>
          </div>
          <div>
            <CurrencyAmountInput id="mapPrice" label="MAP Price" value={form.mapPrice} onChange={set("mapPrice")} currency={form.currency} onFocus={() => focusField("mapPrice")} onBlur={handleBlur("mapPrice")} error={errors.mapPrice} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Minimum Advertised Price set by the manufacturer.</p>
          </div>
        </div>
        <div>
          <CurrencyAmountInput id="omnibusPrice" label="Omnibus Price (EU 30-Day Low)" value={form.omnibusPrice} onChange={set("omnibusPrice")} currency={form.currency} onFocus={() => focusField("omnibusPrice")} onBlur={handleBlur("omnibusPrice")} error={errors.omnibusPrice} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Required for EU sales — enter the lowest price you've offered in the last 30 days (EU Omnibus Directive).</p>
        </div>
      </FormSection>

      <FormSection title="Volume Pricing">
        <div>
          <TierBuilder id="priceTiers" tiers={form.priceTiers} onChange={(v) => setDirect("priceTiers", v)} label="Volume Price Tiers" fields={["minQty", "maxQty", "price"]} fieldLabels={{ minQty: "Min Qty", maxQty: "Max Qty", price: "Unit Price" }} onFocusField={focusField} focusKey="priceTiers" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Offer better prices at higher quantities. Encourages larger orders.</p>
        </div>
      </FormSection>

      <FormSection title="Buyer Incentives">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingField id="firstOrderDiscount-pct" label="First Order Discount (%)" value={form.firstOrderDiscount.percentage} onChange={(e) => setCompound("firstOrderDiscount", "percentage", e.target.value)} inputMode="numeric" placeholder="e.g. 5" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Extra discount for first-time buyers.</p>
          </div>
          <div>
            <FloatingField id="firstOrderDiscount-label" label="Discount Label" value={form.firstOrderDiscount.label} onChange={(e) => setCompound("firstOrderDiscount", "label", e.target.value)} placeholder="e.g. Welcome discount" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Label shown to buyers alongside the discount.</p>
          </div>
        </div>
        <DealToggle id="negotiable" checked={form.negotiable} onChange={(v) => setDirect("negotiable", v)} label="Price Negotiable" description="Buyers can submit offers below the listed price" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingDatePicker id="priceValidUntil" label="Price Valid Until" value={form.priceValidUntil} onChange={set("priceValidUntil")} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">After this date, your listing will be flagged for price review. Leave empty if no expiry.</p>
          </div>
          <div>
            <FloatingField id="offerValidityDays" label="Offer Validity (Days)" value={form.offerValidityDays} onChange={set("offerValidityDays")} inputMode="numeric" placeholder="e.g. 30" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">How many days this deal remains open for enquiries.</p>
          </div>
        </div>
      </FormSection>
    </>
  );

  /* ─── Tab 2: Description & Media ─── */
  const renderDescriptionMedia = () => (
    <>
      <FormSection title="Product Description" required>
        <div>
          <p className="text-[11px] text-slate-500 mb-1.5 ml-1">Detailed product description visible to buyers. Include condition, features, and deal highlights.</p>
          <FloatingTextarea id="description" label="Product Description" value={form.description} onChange={set("description")} onBlur={handleBlur("description")} onFocus={handleFocus("description")} error={errors.description} required rows={5} placeholder="Describe the product in detail — condition, features, what makes this deal attractive to wholesale buyers" />
        </div>
        <div>
          <RepeaterBuilder id="productHighlights" rows={form.productHighlights} onChange={(v) => setDirect("productHighlights", v)} label="Product Highlights" placeholder="e.g. FDA approved, 100% organic cotton" max={10} maxLength={150} onFocusField={focusField} focusKey="productHighlights" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Key selling points displayed as bullet points on the listing page.</p>
        </div>
        <div>
          <FloatingField id="packageContents" label="Package Contents" value={form.packageContents} onChange={set("packageContents")} onFocus={handleFocus("packageContents")} placeholder="e.g. 1x handset, 1x charger, 1x USB-C cable, 1x user manual" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">List everything included in a single selling unit.</p>
        </div>
      </FormSection>

      <FormSection title="Images & Video">
        <div>
          <MultiImageUpload id="images" images={form.images} onChange={(v) => setDirect("images", v)} onFocus={() => focusField("images")} max={10} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Upload up to 10 product images. First image is the cover. Drag to reorder.</p>
        </div>
        <div>
          <FloatingField id="videoUrl" label="Video URL (YouTube / Vimeo)" value={form.videoUrl} onChange={set("videoUrl")} onBlur={handleBlur("videoUrl")} onFocus={handleFocus("videoUrl")} error={errors.videoUrl} placeholder="e.g. https://youtube.com/watch?v=..." />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Optional product video link. Listings with video get more engagement.</p>
        </div>
      </FormSection>

      <FormSection title="Tags & Discovery">
        <div>
          <p className="text-[11px] text-slate-500 mb-1 ml-1">Add keywords that describe the product. Press Enter or comma to add each tag.</p>
          <BrandPillInput id="tags" label="Tags" selected={form.tags} onChange={(v) => setDirect("tags", v)} onFocus={() => focusField("tags")} placeholder="Type a tag, then comma or Enter..." itemLabel="tags" />
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1 ml-1">Additional keywords that buyers might search for. Not visible on the listing.</p>
          <BrandPillInput id="searchKeywords" label="Search Keywords" selected={form.searchKeywords} onChange={(v) => setDirect("searchKeywords", v)} onFocus={() => focusField("searchKeywords")} placeholder="Type a keyword, then comma or Enter..." itemLabel="keywords" />
        </div>
        <div>
          <MultiSelect id="targetAudience" label="Target Audience" options={TARGET_AUDIENCE_OPTIONS} selected={form.targetAudience} onChange={(v) => setDirect("targetAudience", v)} onFocus={() => focusField("targetAudience")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Select buyer types this deal is best suited for. Matches buyer profiles for better visibility.</p>
        </div>
      </FormSection>
    </>
  );

  /* ─── Tab 3: Specifications ─── */
  const renderSpecifications = () => (
    <>
      <FormSection title="Technical Specifications">
        <div>
          <KeyValueBuilder id="specifications" rows={form.specifications} onChange={(v) => setDirect("specifications", v)} onFocusField={focusField} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Add key-value pairs for product specifications (e.g. Screen Size → 6.1 inches).</p>
        </div>
      </FormSection>

      <FormSection title="Variants">
        <div>
          <KeyValueBuilder id="variants" rows={form.variants} onChange={(v) => setDirect("variants", v)} onFocusField={focusField} keyLabel="Attribute" valueLabel="Options" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Define variant attributes (e.g. Colour → Red, Blue, Green | Size → S, M, L). Helps buyers understand available options.</p>
        </div>
      </FormSection>

      <FormSection title="Materials & Appearance">
        <div>
          <FloatingField id="materials" label="Materials" value={form.materials} onChange={set("materials")} onFocus={handleFocus("materials")} placeholder="e.g. 100% cotton, stainless steel, recycled polyester" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Primary materials or fabric composition.</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 mb-1 ml-1">Add available colours. Press Enter or comma to add each one.</p>
          <BrandPillInput id="color" label="Colour(s)" selected={form.color} onChange={(v) => setDirect("color", v)} onFocus={() => focusField("color")} placeholder="Type a colour, then comma or Enter..." itemLabel="colours" />
        </div>
        <div>
          <FloatingSelect id="pattern" label="Pattern" value={form.pattern} onChange={set("pattern")} options={PATTERN_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Visual pattern or print of the product.</p>
        </div>
      </FormSection>

      <FormSection title="Dimensions & Weight">
        <div>
          <DimensionsInput id="packaging" value={form.packaging} onChange={(v) => setDirect("packaging", v)} label="Packaging Dimensions" showWeight onFocusField={focusField} focusKey="packaging" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Outer carton/box size and weight — used for shipping cost calculations.</p>
        </div>
        <div>
          <DimensionsInput id="productDimensions" value={form.productDimensions} onChange={(v) => setDirect("productDimensions", v)} label="Product Dimensions" showNotes onFocusField={focusField} focusKey="productDimensions" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Physical size of the product itself, without packaging.</p>
        </div>
        <div>
          <WeightInput id="netWeight" value={form.netWeight} onChange={(v) => setDirect("netWeight", v)} label="Net Weight" onFocusField={focusField} focusKey="netWeight" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Weight of the product only, without packaging.</p>
        </div>
        <div>
          <WeightInput id="grossWeight" value={form.grossWeight} onChange={(v) => setDirect("grossWeight", v)} label="Gross Weight" onFocusField={focusField} focusKey="grossWeight" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Weight including all packaging.</p>
        </div>
      </FormSection>

      <FormSection title="Power & Assembly">
        <div>
          <MultiSelect id="powerSource" options={POWER_SOURCE_OPTIONS} selected={form.powerSource} onChange={(v) => setDirect("powerSource", v)} label="Power Source" labelType="floating" showCheckboxes onFocusField={focusField} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">How the product is powered. Select multiple if applicable (e.g. USB + Mains).</p>
        </div>
        <DealToggle id="assemblyRequired" checked={form.assemblyRequired} onChange={(v) => setDirect("assemblyRequired", v)} label="Assembly Required" description="Product requires assembly by the buyer" />
      </FormSection>

      <FormSection title="Battery Information">
        <DealToggle id="batteryRequired" checked={form.batteryInfo.required} onChange={(v) => setCompound("batteryInfo", "required", v)} label="Battery Required" description="This product requires batteries to operate" />
        {form.batteryInfo.required && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DealToggle id="batteryIncluded" checked={form.batteryInfo.included} onChange={(v) => setCompound("batteryInfo", "included", v)} label="Batteries Included" description="Batteries are included in the box" />
              <DealToggle id="batteryRemovable" checked={form.batteryInfo.removable} onChange={(v) => setCompound("batteryInfo", "removable", v)} label="Battery Removable" description="Battery can be replaced by the user" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FloatingField id="batteryType" label="Battery Type" value={form.batteryInfo.type} onChange={(e) => setCompound("batteryInfo", "type", e.target.value)} placeholder="e.g. Li-Ion, AA, CR2032" />
                <p className="text-[11px] text-slate-500 mt-1 ml-1">Battery chemistry or standard type.</p>
              </div>
              <div>
                <FloatingField id="batteryVoltage" label="Voltage" value={form.batteryInfo.voltage} onChange={(e) => setCompound("batteryInfo", "voltage", e.target.value)} placeholder="e.g. 3.7V" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FloatingField id="batteryCapacity" label="Capacity" value={form.batteryInfo.capacity} onChange={(e) => setCompound("batteryInfo", "capacity", e.target.value)} placeholder="e.g. 5000mAh" />
              </div>
              <div>
                <FloatingField id="batteryQty" label="Quantity Required" value={form.batteryInfo.quantity} onChange={(e) => setCompound("batteryInfo", "quantity", e.target.value)} inputMode="numeric" placeholder="e.g. 2" />
              </div>
            </div>
          </>
        )}
      </FormSection>
    </>
  );

  /* ─── Tab 4: Order & Stock Terms ─── */
  const qtyUnit = PRICE_UNIT_LABELS[form.priceUnit] || "units";
  const renderOrderStock = () => (
    <>
      <FormSection title="Order Quantities">
        <div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <FloatingField id="moq" label="Minimum Order Quantity" value={form.moq} onChange={set("moq")} onBlur={handleBlur("moq")} onFocus={handleFocus("moq")} error={errors.moq} inputMode="numeric" placeholder="e.g. 100" />
            </div>
            <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{qtyUnit}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Smallest quantity a buyer can order. Unit inherited from Price Unit ({form.priceUnit}).</p>
        </div>
      </FormSection>

      <FormSection title="Stock & Availability">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FloatingField id="availableQuantity" label="Available Quantity" value={form.availableQuantity} onChange={set("availableQuantity")} onFocus={handleFocus("availableQuantity")} inputMode="numeric" placeholder="e.g. 5000" />
              </div>
              <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{qtyUnit}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Total stock available for this deal.</p>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FloatingField id="maxOrderQuantity" label="Max Order Quantity" value={form.maxOrderQuantity} onChange={set("maxOrderQuantity")} inputMode="numeric" placeholder="e.g. 1000" />
              </div>
              <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{qtyUnit}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Maximum a single buyer can order at once.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FloatingField id="orderIncrement" label="Order Increment" value={form.orderIncrement} onChange={set("orderIncrement")} inputMode="numeric" placeholder="e.g. 50" />
              </div>
              <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{qtyUnit}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Orders must be placed in multiples of this number.</p>
          </div>
          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <FloatingField id="casePackSize" label="Case Pack Size" value={form.casePackSize} onChange={set("casePackSize")} inputMode="numeric" placeholder="e.g. 24" />
              </div>
              <span className="pb-3.5 text-sm font-medium text-slate-400 shrink-0">{qtyUnit}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Number of units per case/carton.</p>
          </div>
        </div>
        <div>
          <FloatingField id="multipackQuantity" label="Multipack Quantity" value={form.multipackQuantity} onChange={set("multipackQuantity")} inputMode="numeric" placeholder="e.g. 6" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">If this product is a multipack, how many individual items are in one pack.</p>
        </div>
        <div className="space-y-1">
          <DealToggle id="isIndivisibleLot" checked={form.isIndivisibleLot} onChange={(v) => setDirect("isIndivisibleLot", v)} label="Indivisible Lot" description="Lot must be taken in full — buyer cannot order partial quantities" />
          <DealToggle id="crossCategoryMOQ" checked={form.crossCategoryMOQ} onChange={(v) => setDirect("crossCategoryMOQ", v)} label="Cross-Category MOQ" description="MOQ can be met by combining orders across different products" />
        </div>
      </FormSection>
    </>
  );

  /* ─── Tab 5: Shipping & Logistics ─── */
  const renderShippingLogistics = () => (
    <>
      <FormSection title="Shipping Scope">
        <div>
          <FloatingSelect id="shippingScope" label="Shipping Scope" value={form.shippingScope} onChange={set("shippingScope")} options={SHIPPING_SCOPE_OPTIONS} onFocus={() => focusField("shippingScope")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Where you can ship this product — worldwide, specific regions, or not declared.</p>
        </div>
        {(form.shippingScope === "all-continents" || form.shippingScope === "specific") && (
          <div className="ml-4 pl-4 border-l-2 border-slate-200 space-y-4 py-1">
            <div>
              <MultiSelect id="shippingContinents" options={CONTINENT_OPTIONS} selected={form.shippingContinents} onChange={(v) => setDirect("shippingContinents", v)} label="Shipping Continents" labelType="floating" showCheckboxes />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Select the continents you ship to.</p>
            </div>
            {form.shippingScope === "specific" && (
              <div>
                <MultiSelect id="shippingCountries" options={COUNTRIES} selected={form.shippingCountries} onChange={(v) => setDirect("shippingCountries", v)} label="Shipping Countries" labelType="floating" showCheckboxes showFlags searchPlaceholder="Search countries..." />
                <p className="text-[11px] text-slate-500 mt-1 ml-1">Narrow down to specific countries within the selected continents.</p>
              </div>
            )}
          </div>
        )}
        <div>
          <FloatingSelect id="restrictionScope" label="Country Restrictions" value={form.restrictionScope} onChange={set("restrictionScope")} options={RESTRICTION_SCOPE_OPTIONS} onFocus={() => focusField("restrictionScope")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Inherited uses your Supplier Profile excluded countries. Select specific to override per deal.</p>
        </div>
        {form.restrictionScope === "specific" && (
          <div className="ml-4 pl-4 border-l-2 border-slate-200 space-y-4 py-1">
            <div>
              <MultiSelect id="restrictedContinents" options={CONTINENT_OPTIONS} selected={form.restrictedContinents} onChange={(v) => setDirect("restrictedContinents", v)} label="Restricted Continents" labelType="floating" showCheckboxes />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Select continents you cannot ship to.</p>
            </div>
            <div>
              <MultiSelect id="countryRestrictions" options={COUNTRIES} selected={form.countryRestrictions} onChange={(v) => setDirect("countryRestrictions", v)} label="Restricted Countries" labelType="floating" showCheckboxes showFlags searchPlaceholder="Search countries..." />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Specific countries you cannot ship to (e.g. sanctions, regulations).</p>
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Shipping Details">
        <div>
          <CountrySelect id="stockLocation" label="Stock Location" value={form.stockLocation} onChange={(e) => { const v = e.target.value; setDirect("stockLocation", v); const c = COUNTRIES.find((c) => c.value === v); setDirect("stockLocationCode", c?.iso || ""); }} onFocusField={() => focusField("stockLocation")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Country where the stock is physically held. Overrides supplier country on the listing if set.</p>
        </div>
        <div>
          <FloatingField id="portOfOrigin" label="Port of Origin" value={form.portOfOrigin} onChange={set("portOfOrigin")} onFocus={handleFocus("portOfOrigin")} placeholder="e.g. Rotterdam, Shenzhen, Hamburg" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Nearest port for international freight shipments.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingSelect id="shippingClass" label="Shipping Class" value={form.shippingClass} onChange={set("shippingClass")} options={SHIPPING_CLASS_OPTIONS} onFocus={() => focusField("shippingClass")} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Shipping category — affects carrier options and cost estimates.</p>
          </div>
          <div>
            <FloatingSelect id="shippingCostBearer" label="Shipping Cost Bearer" value={form.shippingCostBearer} onChange={set("shippingCostBearer")} options={SHIPPING_COST_BEARER_OPTIONS} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Who pays for shipping — buyer, seller, or shared.</p>
          </div>
        </div>
        <div>
          <FloatingSelect id="shippingCostMethod" label="Shipping Cost Method" value={form.shippingCostMethod} onChange={set("shippingCostMethod")} options={SHIPPING_COST_METHOD_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">How shipping cost is calculated — flat rate, weight-based, or quoted.</p>
        </div>
        <div className="space-y-1">
          <DealToggle id="readyToShip" checked={form.readyToShip} onChange={(v) => setDirect("readyToShip", v)} label="Ready to Ship" description="Product is in stock and ready for immediate dispatch" />
          <DealToggle id="isDropship" checked={form.isDropship} onChange={(v) => setDirect("isDropship", v)} label="Dropship Available" description="You can ship directly to the buyer's customer" />
          <DealToggle id="freeDelivery" checked={form.freeDelivery} onChange={(v) => setDirect("freeDelivery", v)} label="Free Delivery" description="No shipping charge — cost is included in the price" />
        </div>
      </FormSection>

      <FormSection title="Packaging & Palletization">
        <div>
          <FloatingField id="packagingFormat" label="Packaging Format" value={form.packagingFormat} onChange={set("packagingFormat")} placeholder="e.g. Individual boxes on pallet, shrink-wrapped" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">How the goods are packaged for transport.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Pallet Configuration</label>
          <div className="grid grid-cols-3 gap-2">
            <FloatingField id="pallet-upl" label="Units/Layer" value={form.palletConfiguration.unitsPerLayer} onChange={(e) => setCompound("palletConfiguration", "unitsPerLayer", e.target.value)} inputMode="numeric" placeholder="e.g. 12" />
            <FloatingField id="pallet-lpp" label="Layers/Pallet" value={form.palletConfiguration.layersPerPallet} onChange={(e) => setCompound("palletConfiguration", "layersPerPallet", e.target.value)} inputMode="numeric" placeholder="e.g. 5" />
            <div className="px-3 py-2.5 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg flex items-center">
              Total: {(parseInt(form.palletConfiguration.unitsPerLayer) || 0) * (parseInt(form.palletConfiguration.layersPerPallet) || 0) || "—"}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 ml-1">How many units fit on a standard EUR pallet.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Container Load Quantity</label>
          <div className="grid grid-cols-3 gap-2">
            <FloatingField id="container-20" label="20ft" value={form.containerLoadQuantity.twentyFt} onChange={(e) => setCompound("containerLoadQuantity", "twentyFt", e.target.value)} inputMode="numeric" placeholder="e.g. 800" />
            <FloatingField id="container-40" label="40ft" value={form.containerLoadQuantity.fortyFt} onChange={(e) => setCompound("containerLoadQuantity", "fortyFt", e.target.value)} inputMode="numeric" placeholder="e.g. 1600" />
            <FloatingField id="container-40hc" label="40ft HC" value={form.containerLoadQuantity.fortyHC} onChange={(e) => setCompound("containerLoadQuantity", "fortyHC", e.target.value)} inputMode="numeric" placeholder="e.g. 1800" />
          </div>
          <p className="text-[11px] text-slate-500 ml-1">Number of units that fit in each standard container size.</p>
        </div>
        <DealToggle id="stackable" checked={form.stackable} onChange={(v) => setDirect("stackable", v)} label="Stackable" description="Pallets or cartons can be safely stacked during transit" />
      </FormSection>

      <FormSection title="Lead Time Tiers">
        <div>
          <TierBuilder id="leadTimeTiers" tiers={form.leadTimeTiers} onChange={(v) => setDirect("leadTimeTiers", v)} label="Lead Time by Quantity" fields={["minQty", "maxQty", "days"]} fieldLabels={{ minQty: "Min Qty", maxQty: "Max Qty", days: "Days" }} onFocusField={focusField} focusKey="leadTimeTiers" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">How long until the order ships, based on quantity ordered.</p>
        </div>
      </FormSection>
    </>
  );

  /* ─── Tab 6: Compliance & Legal ─── */
  const renderComplianceLegal = () => (
    <>
      <FormSection title="Safety & Hazmat">
        <DealToggle id="hazmat-toggle" checked={form.hazmatInfo.isHazardous} onChange={(v) => setCompound("hazmatInfo", "isHazardous", v)} label="This product is classified as hazardous" description="Enable to add UN number and hazmat class details" />
        {form.hazmatInfo.isHazardous && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <FloatingField id="hazmat-un" label="UN Number" value={form.hazmatInfo.unNumber} onChange={(e) => setCompound("hazmatInfo", "unNumber", e.target.value)} onFocus={() => focusField("hazmatInfo")} placeholder="e.g. UN1234" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">4-digit UN identification number for the hazardous substance.</p>
            </div>
            <div>
              <FloatingField id="hazmat-class" label="Hazmat Class" value={form.hazmatInfo.class} onChange={(e) => setCompound("hazmatInfo", "class", e.target.value)} placeholder="e.g. Class 3 — Flammable Liquids" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Transport hazard classification (Classes 1–9).</p>
            </div>
          </div>
        )}
        <div>
          <MultiSelect id="hazardSymbols" options={HAZARD_SYMBOL_OPTIONS} selected={form.hazardSymbols} onChange={(v) => setDirect("hazardSymbols", v)} label="Hazard Symbols (GHS)" labelType="floating" showCheckboxes />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">GHS pictograms required on product labelling.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingField id="ageRestriction-min" label="Minimum Age" value={form.ageRestriction.minAge} onChange={(e) => setCompound("ageRestriction", "minAge", e.target.value)} inputMode="numeric" placeholder="e.g. 18" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Minimum buyer/end-user age required by law.</p>
          </div>
          <div>
            <FloatingField id="ageRestriction-reason" label="Age Restriction Reason" value={form.ageRestriction.reason} onChange={(e) => setCompound("ageRestriction", "reason", e.target.value)} placeholder="e.g. Contains alcohol, sharp blades" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Why the age restriction applies.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">Regional Compliance Notes</label>
            <span className="text-[10px] text-slate-400">{form.regionalCompliance.length} added</span>
          </div>
          <p className="text-[11px] text-slate-500 ml-1 -mt-1">Region-specific regulatory declarations (Prop 65, REACH, RoHS, etc.).</p>
          {form.regionalCompliance.map((entry, i) => (
            <div key={i} className="flex items-start gap-2">
              <select id={`regionalCompliance-${i}-region`} value={entry.region} onChange={(e) => { const arr = [...form.regionalCompliance]; arr[i] = { ...arr[i], region: e.target.value }; setDirect("regionalCompliance", arr); }} aria-label="Region" className={`${inlineSelectClass} w-48 shrink-0`}>
                <option value="">Select region...</option>
                {REGIONAL_COMPLIANCE_PRESETS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                <option value="other">Other</option>
              </select>
              <input id={`regionalCompliance-${i}-note`} type="text" value={entry.note} onChange={(e) => { const arr = [...form.regionalCompliance]; arr[i] = { ...arr[i], note: e.target.value }; setDirect("regionalCompliance", arr); }} placeholder="Compliance note or declaration" aria-label="Compliance note" className="flex-1 px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
              <button type="button" onClick={() => setDirect("regionalCompliance", form.regionalCompliance.filter((_, idx) => idx !== i))} className="shrink-0 w-8 h-8 mt-0.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-orange-300" aria-label={`Remove ${entry.region || 'this'} compliance note`}><X size={14} /></button>
            </div>
          ))}
          {form.regionalCompliance.length < 10 && (
            <button type="button" onClick={() => setDirect("regionalCompliance", [...form.regionalCompliance, { region: "", note: "" }])} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors">+ Add compliance note</button>
          )}
        </div>
        <DealToggle id="cpsc-compliant" checked={form.cpscCompliance.compliant} onChange={(v) => setCompound("cpscCompliance", "compliant", v)} label="CPSC Compliant" description="Product meets U.S. Consumer Product Safety Commission requirements" />
        {form.cpscCompliance.compliant && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <FloatingField id="cpsc-cert" label="Certificate Number" value={form.cpscCompliance.certNumber} onChange={(e) => setCompound("cpscCompliance", "certNumber", e.target.value)} placeholder="e.g. CPC-2024-00123" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">General or Children's Product Certificate number.</p>
            </div>
            <div>
              <FloatingField id="cpsc-lab" label="Testing Lab" value={form.cpscCompliance.testLab} onChange={(e) => setCompound("cpscCompliance", "testLab", e.target.value)} placeholder="e.g. Intertek, SGS, Bureau Veritas" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">CPSC-accepted third-party testing laboratory.</p>
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Certifications & Standards">
        <div>
          <MultiSelect id="certifications" options={CERTIFICATION_OPTIONS} selected={form.certifications} onChange={(v) => setDirect("certifications", v)} label="Certifications" labelType="floating" showCheckboxes onFocusField={focusField} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Select all certifications the product holds (CE, UL, FDA, etc.).</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Warranty Details</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FloatingField id="warranty-duration" label="Duration" value={form.warrantyInfo.duration} onChange={(e) => setCompound("warrantyInfo", "duration", e.target.value)} placeholder="e.g. 24 months" onFocus={() => focusField("warrantyInfo")} />
            <FloatingSelect id="warranty-type" label="Type" value={form.warrantyInfo.type} onChange={(e) => setCompound("warrantyInfo", "type", typeof e === "string" ? e : e?.target?.value || "")} options={[{ value: "manufacturer", label: "Manufacturer" }, { value: "seller", label: "Seller" }, { value: "none", label: "None" }]} />
            <FloatingField id="warranty-coverage" label="Coverage" value={form.warrantyInfo.coverage} onChange={(e) => setCompound("warrantyInfo", "coverage", e.target.value)} placeholder="What's covered" />
          </div>
          <p className="text-[11px] text-slate-500 ml-1">Manufacturer warranty that comes with the product.</p>
        </div>
        <div>
          <FloatingField id="warranty" label="Seller Warranty" value={form.warranty} onChange={set("warranty")} placeholder="e.g. 6 months, lifetime" onFocus={handleFocus("warranty")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Your own warranty as the seller, if different from the manufacturer's.</p>
        </div>
        <div>
          <FloatingField id="ipRating" label="IP Rating" value={form.ipRating} onChange={set("ipRating")} placeholder="e.g. IP68" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Ingress Protection rating for dust/water resistance.</p>
        </div>
        <DealToggle id="fda-registered" checked={form.fdaRegistration.registered} onChange={(v) => setCompound("fdaRegistration", "registered", v)} label="FDA Registered" description="Product or facility is registered with the U.S. Food & Drug Administration" />
        {form.fdaRegistration.registered && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <FloatingField id="fda-number" label="Registration Number" value={form.fdaRegistration.number} onChange={(e) => setCompound("fdaRegistration", "number", e.target.value)} placeholder="e.g. 3012345678" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">FDA establishment or device registration number.</p>
            </div>
            <div>
              <FloatingSelect id="fda-type" label="Registration Type" value={form.fdaRegistration.type} onChange={(e) => setCompound("fdaRegistration", "type", typeof e === "string" ? e : e?.target?.value || "")} options={[{ value: "food-facility", label: "Food Facility" }, { value: "drug-establishment", label: "Drug Establishment" }, { value: "device-listing", label: "Medical Device Listing" }, { value: "cosmetic", label: "Cosmetic Facility" }, { value: "otc", label: "OTC Drug" }]} />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Type of FDA registration that applies.</p>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">Energy Rating</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FloatingSelect id="energy-system" label="Rating System" value={form.energyRating.system} onChange={(e) => setCompound("energyRating", "system", typeof e === "string" ? e : e?.target?.value || "")} options={[{ value: "eu-2021", label: "EU Energy Label (2021+)" }, { value: "eu-legacy", label: "EU Legacy (A+++–D)" }, { value: "uk", label: "UK Energy Label" }, { value: "energy-star", label: "Energy Star (US)" }, { value: "other", label: "Other" }]} />
            <FloatingField id="energy-rating" label="Rating" value={form.energyRating.rating} onChange={(e) => setCompound("energyRating", "rating", e.target.value)} placeholder="e.g. A, B, F" />
            <FloatingField id="energy-consumption" label="Annual Consumption" value={form.energyRating.annualConsumption} onChange={(e) => setCompound("energyRating", "annualConsumption", e.target.value)} placeholder="e.g. 120 kWh/year" />
          </div>
          <p className="text-[11px] text-slate-500 ml-1">EU/UK energy label details for appliances, lighting, and electronics.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">SAR Value (W/kg)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FloatingField id="sar-head" label="Head SAR" value={form.sarValue.head} onChange={(e) => setCompound("sarValue", "head", e.target.value)} inputMode="numeric" placeholder="e.g. 0.89" />
            <FloatingField id="sar-body" label="Body SAR" value={form.sarValue.body} onChange={(e) => setCompound("sarValue", "body", e.target.value)} inputMode="numeric" placeholder="e.g. 1.12" />
          </div>
          <p className="text-[11px] text-slate-500 ml-1">Specific Absorption Rate for phones, wearables, and RF-emitting devices. EU limit: 2.0 W/kg (head/body).</p>
        </div>
      </FormSection>

      <FormSection title="Regulatory Compliance">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600">EU Responsible Person</label>
          <FloatingField id="eu-rp-name" label="Name" value={form.euResponsiblePerson.name} onChange={(e) => setCompound("euResponsiblePerson", "name", e.target.value)} placeholder="e.g. EU Compliance Ltd" />
          <FloatingField id="eu-rp-address" label="Address" value={form.euResponsiblePerson.address} onChange={(e) => setCompound("euResponsiblePerson", "address", e.target.value)} placeholder="e.g. 123 Main Street, Berlin, Germany" />
          <FloatingField id="eu-rp-email" label="Email" value={form.euResponsiblePerson.email} onChange={(e) => setCompound("euResponsiblePerson", "email", e.target.value)} inputMode="email" placeholder="e.g. compliance@example.eu" />
          <p className="text-[11px] text-slate-500 ml-1">Required for products sold in the EU under the Market Surveillance Regulation.</p>
        </div>
        <DealToggle id="exportOnly" checked={form.exportOnly} onChange={(v) => setDirect("exportOnly", v)} label="Export Only" description="Product is for export markets only — not for domestic sale" />
        {form.exportOnly && (
          <div>
            <MultiSelect id="exportRegions" options={CONTINENT_OPTIONS} selected={form.exportRegions} onChange={(v) => setDirect("exportRegions", v)} label="Export Regions" labelType="floating" showCheckboxes />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Which regions/continents this product can be exported to.</p>
          </div>
        )}
      </FormSection>
    </>
  );

  /* ─── Tab 7: Commercial Overrides ─── */
  const renderCommercialOverrides = () => (
    <>
      <FormSection title="Payment & Invoice Overrides" description="These fields inherit from your supplier profile. Toggle to override for this deal.">
        <OverrideField id="override-payment" label="Payment Methods" inheritedLabel="Bank Transfer, Credit Card, PayPal (from profile)" isOverridden={form.overrides.supplierPaymentMethods} onToggle={(v) => setOverride("supplierPaymentMethods", v)}>
          <MultiSelect options={[{ value: "bank-transfer", label: "Bank Transfer" }, { value: "credit-debit-card", label: "Credit / Debit Card" }, { value: "trade-credit", label: "Trade Credit" }, { value: "paypal", label: "PayPal" }, { value: "cash-on-delivery", label: "Cash on Delivery" }, { value: "bnpl", label: "Buy Now Pay Later" }, { value: "letter-of-credit", label: "Letter of Credit" }, { value: "escrow", label: "Escrow" }]} selected={form.supplierPaymentMethods} onChange={(v) => setDirect("supplierPaymentMethods", v)} label="Payment Methods" labelType="floating" showCheckboxes onFocusField={focusField} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Select which payment methods you'll accept for this deal. Different from your profile defaults.</p>
        </OverrideField>

        <OverrideField id="override-terms" label="Payment Terms" inheritedLabel="Net 30 (from profile)" isOverridden={form.overrides.netPaymentTerms} onToggle={(v) => setOverride("netPaymentTerms", v)}>
          <FloatingField id="netPaymentTerms" label="Payment Terms" value={form.netPaymentTerms} onChange={set("netPaymentTerms")} placeholder="e.g. Net 60, Proforma, 50/50" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">When payment is due after invoice date.</p>
        </OverrideField>

        <OverrideField id="override-deposit" label="Deposit" inheritedLabel="30% upfront (from profile)" isOverridden={form.overrides.depositRequired} onToggle={(v) => setOverride("depositRequired", v)}>
          <div className="grid grid-cols-2 gap-2">
            <FloatingField id="deposit-pct" label="Deposit (%)" value={form.depositRequired.percentage} onChange={(e) => setCompound("depositRequired", "percentage", e.target.value)} inputMode="numeric" placeholder="e.g. 30" />
            <FloatingField id="deposit-terms" label="Deposit Terms" value={form.depositRequired.terms} onChange={(e) => setCompound("depositRequired", "terms", e.target.value)} placeholder="e.g. Before production" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Upfront deposit percentage and when it's due.</p>
        </OverrideField>

        <OverrideField id="override-tax" label="Tax Class" inheritedLabel="Standard Rate (from profile)" isOverridden={form.overrides.taxClass} onToggle={(v) => setOverride("taxClass", v)}>
          <FloatingSelect id="taxClass" label="Tax Class" value={form.taxClass} onChange={set("taxClass")} options={TAX_CLASS_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">VAT rate category applied to this product.</p>
        </OverrideField>

        <OverrideField id="override-invoice" label="Invoice Type" inheritedLabel="VAT Invoice (from profile)" isOverridden={form.overrides.invoiceType} onToggle={(v) => setOverride("invoiceType", v)}>
          <FloatingSelect id="invoiceType" label="Invoice Type" value={form.invoiceType} onChange={set("invoiceType")} options={INVOICE_TYPE_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">VAT Invoice = standard UK/EU. Commercial Invoice = for international/customs. Proforma = quote before payment.</p>
        </OverrideField>

        <OverrideField id="override-sanitized" label="Sanitized Invoices" inheritedLabel="On Request (from profile)" isOverridden={form.overrides.sanitizedInvoice} onToggle={(v) => setOverride("sanitizedInvoice", v)}>
          <FloatingSelect id="sanitizedInvoice" label="Sanitized Invoices" value={form.sanitizedInvoice} onChange={set("sanitizedInvoice")} options={SANITIZED_INVOICE_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Removes your company name and pricing from invoices, so buyers can resell without revealing their source.</p>
        </OverrideField>
      </FormSection>

      <FormSection title="Delivery & Terms Overrides">
        <OverrideField id="override-delivery" label="Delivery Methods" inheritedLabel="DHL, FedEx, Own Fleet (from profile)" isOverridden={form.overrides.deliveryMethods} onToggle={(v) => setOverride("deliveryMethods", v)}>
          <MultiSelect options={[{ value: "dhl", label: "DHL" }, { value: "fedex", label: "FedEx" }, { value: "ups", label: "UPS" }, { value: "dpd", label: "DPD" }, { value: "pallet-delivery", label: "Pallet / LTL Freight" }, { value: "own-fleet", label: "Own Fleet" }, { value: "freight", label: "Freight / Haulage" }, { value: "collection", label: "Collection in Person" }]} selected={form.deliveryMethods} onChange={(v) => setDirect("deliveryMethods", v)} label="Delivery Methods" labelType="floating" showCheckboxes />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Carriers and shipping methods available for this deal.</p>
        </OverrideField>

        <OverrideField id="override-incoterms" label="Incoterms" inheritedLabel="DDP (from profile)" isOverridden={form.overrides.incoterms} onToggle={(v) => setOverride("incoterms", v)}>
          <FloatingSelect id="incoterms" label="Incoterms" value={form.incoterms} onChange={set("incoterms")} options={INCOTERMS_OPTIONS} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Determines who pays for shipping, insurance, and customs duties (e.g., DDP = you cover everything, EXW = buyer arranges pickup).</p>
        </OverrideField>

        <OverrideField id="override-return" label="Return Policy" inheritedLabel="30-day returns accepted (from profile)" isOverridden={form.overrides.returnPolicy} onToggle={(v) => setOverride("returnPolicy", v)}>
          <p className="text-[11px] text-slate-500 mb-1.5 ml-1">Override your profile's return policy for this deal only.</p>
          <FloatingTextarea id="returnPolicy" label="Return Policy" value={form.returnPolicy} onChange={set("returnPolicy")} rows={3} placeholder="e.g. 14-day returns for unopened items, buyer pays return shipping" />
        </OverrideField>

        <div>
          <p className="text-[11px] text-slate-500 mb-1.5 ml-1">Completely replaces the inherited return policy for this deal. Use for special terms.</p>
          <FloatingTextarea id="dealReturnPolicy" label="Deal-Specific Return Policy" value={form.dealReturnPolicy} onChange={set("dealReturnPolicy")} rows={3} placeholder="e.g. All sales final due to liquidation pricing — no returns accepted" />
        </div>
      </FormSection>
    </>
  );

  /* ─── Tab 8: Category-Specific ─── */
  const activeFields = useMemo(() => getActiveFieldsForCategories(form.categories), [form.categories]);

  // Section visibility uses "core discriminator" fields unique to each domain.
  // This prevents false positives — e.g. Jewellery (gender only) won't trigger
  // the full Apparel section. Shared fields render in "Additional Details" instead.
  const showApparel = activeFields.has("fitType"); // fitType is unique to full apparel
  const showFood = activeFields.has("nutritionalInfo"); // nutritionalInfo only in full FOOD_FIELDS
  const showHealthBeauty = activeFields.has("paoMonths") || activeFields.has("spfRating"); // unique to H&B
  const showIndustrial = hasFieldGroup(activeFields, INDUSTRIAL_FIELDS);
  const showLot = hasFieldGroup(activeFields, LOT_FIELDS);

  // Orphan fields: active fields not covered by any visible major section.
  // These render in the "Additional Product Details" section.
  const coveredFields = useMemo(
    () => getCoveredFields(showApparel, showFood, showHealthBeauty, showIndustrial, showLot),
    [showApparel, showFood, showHealthBeauty, showIndustrial, showLot]
  );
  const orphanFields = useMemo(
    () => new Set([...activeFields].filter((f) => !coveredFields.has(f))),
    [activeFields, coveredFields]
  );
  const hasOrphanFields = orphanFields.size > 0;
  const hasCategoryFields = showApparel || showFood || showHealthBeauty || showIndustrial || showLot || hasOrphanFields;

  const renderCategorySpecific = () => (
    <>
      {/* ─── Cross-category (always visible) ─── */}
      <FormSection title="General Product Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FloatingDatePicker id="launchDate" label="Launch Date" value={form.launchDate} onChange={set("launchDate")} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">When the product was first released to market.</p>
          </div>
          <div>
            <FloatingDatePicker id="discontinuedDate" label="Discontinued Date" value={form.discontinuedDate} onChange={set("discontinuedDate")} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">When the manufacturer stopped producing this product.</p>
          </div>
        </div>
        <div>
          <CountrySelect id="manufacturingCountry" label="Country of Manufacture" value={form.manufacturingCountry} onChange={(e) => setDirect("manufacturingCountry", e.target.value)} onFocusField={() => focusField("manufacturingCountry")} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Where the product was manufactured — shown on the listing.</p>
        </div>
        <div>
          <LanguageSelector id="productLanguage" label="Product Language(s)" selected={form.productLanguage} setSelected={(v) => setDirect("productLanguage", v)} />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Language(s) on packaging, manuals, or labels.</p>
        </div>
        <div>
          <BrandPillInput id="compatibleWith" label="Compatible With" selected={form.compatibleWith} onChange={(v) => setDirect("compatibleWith", v)} placeholder="Type a device or model, then comma or Enter..." itemLabel="devices" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Devices, systems, or products this item is compatible with. Press Enter to add.</p>
        </div>
        <div>
          <BrandPillInput id="customizationOptions" label="Customization Options" selected={form.customizationOptions} onChange={(v) => setDirect("customizationOptions", v)} placeholder="Type an option, then comma or Enter..." itemLabel="options" />
          <p className="text-[11px] text-slate-500 mt-1 ml-1">Available customizations (e.g. logo printing, custom colour). Press Enter to add.</p>
        </div>
      </FormSection>

      <FormSection title="Sustainability & Supply">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <BrandPillInput id="eco-materials" label="Eco-Friendly Materials" selected={form.ecoFriendly.materials} onChange={(v) => setDirect("ecoFriendly", { ...form.ecoFriendly, materials: v })} placeholder="Type a material, then comma or Enter..." itemLabel="materials" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">e.g. Recycled polyester, Organic cotton, Bamboo fibre, FSC-certified wood</p>
          </div>
          <div>
            <BrandPillInput id="eco-packaging" label="Eco Packaging" selected={form.ecoFriendly.packaging} onChange={(v) => setDirect("ecoFriendly", { ...form.ecoFriendly, packaging: v })} placeholder="Type a packaging type, then comma or Enter..." itemLabel="types" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">e.g. Plastic-free, Compostable mailer, Recycled cardboard, Soy ink</p>
          </div>
          <div>
            <FloatingField id="eco-production" label="Eco Production" value={form.ecoFriendly.production} onChange={(e) => setCompound("ecoFriendly", "production", e.target.value)} placeholder="e.g. Solar-powered factory" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FloatingField id="supply-qty" label="Supply Ability (Qty)" value={form.supplyAbility.quantity} onChange={(e) => setCompound("supplyAbility", "quantity", e.target.value)} inputMode="numeric" placeholder="e.g. 10000" />
          </div>
          <div>
            <FloatingSelect id="supply-unit" label="Unit" value={form.supplyAbility.unit} onChange={(e) => setCompound("supplyAbility", "unit", typeof e === "string" ? e : e.target.value)} options={MOQ_UNIT_OPTIONS} />
          </div>
          <div>
            <FloatingSelect id="supply-period" label="Per" value={form.supplyAbility.period} onChange={(e) => setCompound("supplyAbility", "period", typeof e === "string" ? e : e.target.value)} options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }, { value: "quarter", label: "Quarter" }, { value: "year", label: "Year" }]} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FloatingField id="sample-min" label="Sample Lead Time (Min)" value={form.sampleLeadTime.min} onChange={(e) => setCompound("sampleLeadTime", "min", e.target.value)} inputMode="numeric" placeholder="e.g. 3" />
          </div>
          <div>
            <FloatingField id="sample-max" label="Max" value={form.sampleLeadTime.max} onChange={(e) => setCompound("sampleLeadTime", "max", e.target.value)} inputMode="numeric" placeholder="e.g. 7" />
          </div>
          <div>
            <FloatingSelect id="sample-unit" label="Unit" value={form.sampleLeadTime.unit} onChange={(e) => setCompound("sampleLeadTime", "unit", typeof e === "string" ? e : e.target.value)} options={[{ value: "days", label: "Days" }, { value: "weeks", label: "Weeks" }]} />
          </div>
        </div>
      </FormSection>

      {/* ─── Category-conditional sections ─── */}
      {!hasCategoryFields && (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <Layers className="mx-auto mb-2 text-slate-300" size={28} />
          <p className="text-sm font-medium text-slate-500">No category-specific fields yet</p>
          <p className="text-xs text-slate-400 mt-1">Select product categories in Tab 1 to unlock specialised fields for apparel, food, health & beauty, industrial, or lot/liquidation products.</p>
        </div>
      )}

      {/* ─── Apparel ─── */}
      {showApparel && (
        <FormSection title="Apparel & Textiles" description="Fabric, sizing, and care details for clothing & textile products.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <BrandPillInput id="fabricComposition" label="Fabric Composition" selected={form.fabricComposition} onChange={(v) => setDirect("fabricComposition", v)} placeholder="e.g. 95% Cotton, then Enter..." itemLabel="materials" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">e.g. 95% Cotton, 5% Elastane. Press Enter to add each.</p>
            </div>
            <div>
              <FloatingField id="gsm" label="GSM (Fabric Weight)" value={form.gsm} onChange={set("gsm")} inputMode="numeric" placeholder="e.g. 180" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Grams per square metre — higher = heavier fabric.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatingSelect id="fitType" label="Fit Type" value={form.fitType} onChange={set("fitType")} options={FIT_TYPE_OPTIONS} />
            </div>
            <div>
              <FloatingSelect id="gender" label="Gender" value={form.gender} onChange={set("gender")} options={GENDER_OPTIONS} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Care Instructions</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
              <FloatingField id="care-wash" label="Wash" value={form.careInstructions.wash} onChange={(e) => setCompound("careInstructions", "wash", e.target.value)} placeholder="e.g. 40°C" />
              <FloatingField id="care-dry" label="Dry" value={form.careInstructions.dry} onChange={(e) => setCompound("careInstructions", "dry", e.target.value)} placeholder="e.g. Tumble dry low" />
              <FloatingField id="care-iron" label="Iron" value={form.careInstructions.iron} onChange={(e) => setCompound("careInstructions", "iron", e.target.value)} placeholder="e.g. Medium heat" />
              <FloatingField id="care-bleach" label="Bleach" value={form.careInstructions.bleach} onChange={(e) => setCompound("careInstructions", "bleach", e.target.value)} placeholder="e.g. Do not bleach" />
            </div>
          </div>
          <div>
            <BrandPillInput id="sizeChart" label="Available Sizes" selected={form.sizeChart} onChange={(v) => setDirect("sizeChart", v)} placeholder="Type a size, then comma or Enter..." itemLabel="sizes" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">All available sizes in this deal. Press Enter to add (e.g. XS, S, M, L, XL, XXL).</p>
          </div>
          <div>
            <BrandPillInput id="predominantSizes" label="Predominant Sizes" selected={form.predominantSizes} onChange={(v) => setDirect("predominantSizes", v)} placeholder="Type a size, then comma or Enter..." itemLabel="sizes" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">The sizes with the most stock. Helps buyers plan their purchase.</p>
          </div>
        </FormSection>
      )}

      {/* ─── Food & Beverages ─── */}
      {showFood && (
        <FormSection title="Food & Beverages" description="Ingredients, allergens, nutrition, and shelf life for food products.">
          <div>
            <FloatingTextarea id="ingredients" label="Ingredients" value={form.ingredients} onChange={set("ingredients")} rows={2} placeholder="List all ingredients in descending order of weight" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <MultiSelect id="allergens" options={ALLERGEN_OPTIONS} selected={form.allergens} onChange={(v) => setDirect("allergens", v)} label="Allergens" labelType="floating" showCheckboxes />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">EU 14 major allergens — required for food products.</p>
            </div>
            <div>
              <MultiSelect id="dietaryTags" options={DIETARY_TAG_OPTIONS} selected={form.dietaryTags} onChange={(v) => setDirect("dietaryTags", v)} label="Dietary Tags" labelType="floating" showCheckboxes />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Nutritional Information (per serving)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1.5">
              <FloatingField id="nutri-serving" label="Serving Size" value={form.nutritionalInfo.servingSize} onChange={(e) => setCompound("nutritionalInfo", "servingSize", e.target.value)} placeholder="e.g. 100g" />
              <FloatingField id="nutri-cal" label="Calories" value={form.nutritionalInfo.calories} onChange={(e) => setCompound("nutritionalInfo", "calories", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-fat" label="Fat (g)" value={form.nutritionalInfo.fat} onChange={(e) => setCompound("nutritionalInfo", "fat", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-satfat" label="Sat. Fat (g)" value={form.nutritionalInfo.saturatedFat} onChange={(e) => setCompound("nutritionalInfo", "saturatedFat", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-carbs" label="Carbs (g)" value={form.nutritionalInfo.carbs} onChange={(e) => setCompound("nutritionalInfo", "carbs", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-sugar" label="Sugar (g)" value={form.nutritionalInfo.sugar} onChange={(e) => setCompound("nutritionalInfo", "sugar", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-fiber" label="Fibre (g)" value={form.nutritionalInfo.fiber} onChange={(e) => setCompound("nutritionalInfo", "fiber", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-protein" label="Protein (g)" value={form.nutritionalInfo.protein} onChange={(e) => setCompound("nutritionalInfo", "protein", e.target.value)} inputMode="numeric" />
              <FloatingField id="nutri-salt" label="Salt (g)" value={form.nutritionalInfo.salt} onChange={(e) => setCompound("nutritionalInfo", "salt", e.target.value)} inputMode="numeric" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatingField id="storageInstructions" label="Storage Instructions" value={form.storageInstructions} onChange={set("storageInstructions")} placeholder="e.g. Store in a cool, dry place" />
            </div>
            <div>
              <FloatingField id="shelfLife" label="Shelf Life" value={form.shelfLife} onChange={set("shelfLife")} placeholder="e.g. 12 months from production" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <FloatingDatePicker id="bestBeforeDate" label="Best Before Date" value={form.bestBeforeDate} onChange={set("bestBeforeDate")} />
            </div>
            <div>
              <FloatingField id="countryOfHarvest" label="Country of Harvest" value={form.countryOfHarvest} onChange={set("countryOfHarvest")} placeholder="e.g. Spain, Italy" />
            </div>
            <div>
              <FloatingSelect id="gmoDeclaration" label="GMO Declaration" value={form.gmoDeclaration} onChange={set("gmoDeclaration")} options={GMO_DECLARATION_OPTIONS} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatingField id="abv" label="ABV (Alcohol %)" value={form.abv} onChange={set("abv")} inputMode="numeric" placeholder="e.g. 5.0" />
            </div>
            <div>
              <FloatingField id="vintageYear" label="Vintage Year" value={form.vintageYear} onChange={set("vintageYear")} inputMode="numeric" placeholder="e.g. 2022" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Storage Temperature Range</label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              <FloatingField id="temp-min" label="Min" value={form.storageTemperatureRange.min} onChange={(e) => setCompound("storageTemperatureRange", "min", e.target.value)} inputMode="numeric" placeholder="e.g. 2" />
              <FloatingField id="temp-max" label="Max" value={form.storageTemperatureRange.max} onChange={(e) => setCompound("storageTemperatureRange", "max", e.target.value)} inputMode="numeric" placeholder="e.g. 8" />
              <FloatingSelect id="temp-unit" label="Unit" value={form.storageTemperatureRange.unit} onChange={(e) => setCompound("storageTemperatureRange", "unit", typeof e === "string" ? e : e.target.value)} options={[{ value: "°C", label: "°C" }, { value: "°F", label: "°F" }]} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DealToggle id="organic-certified" checked={form.organicCertification.certified} onChange={(v) => setCompound("organicCertification", "certified", v)} label="Organic Certified" description="Product holds organic certification" />
              {form.organicCertification.certified && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <FloatingField id="organic-body" label="Certifying Body" value={form.organicCertification.body} onChange={(e) => setCompound("organicCertification", "body", e.target.value)} placeholder="e.g. Soil Association" />
                  <FloatingField id="organic-num" label="Certificate No." value={form.organicCertification.number} onChange={(e) => setCompound("organicCertification", "number", e.target.value)} />
                </div>
              )}
            </div>
            <div>
              <DealToggle id="kosher" checked={form.kosherHalal.kosher} onChange={(v) => setCompound("kosherHalal", "kosher", v)} label="Kosher" description="Product is Kosher certified" />
              <DealToggle id="halal" checked={form.kosherHalal.halal} onChange={(v) => setCompound("kosherHalal", "halal", v)} label="Halal" description="Product is Halal certified" />
              {(form.kosherHalal.kosher || form.kosherHalal.halal) && (
                <FloatingField id="kh-body" label="Certifying Body" value={form.kosherHalal.certBody} onChange={(e) => setCompound("kosherHalal", "certBody", e.target.value)} className="mt-2" />
              )}
            </div>
          </div>
        </FormSection>
      )}

      {/* ─── Health & Beauty ─── */}
      {showHealthBeauty && (
        <FormSection title="Health & Beauty" description="Ingredient lists, skin compatibility, and cosmetic certifications.">
          <div>
            <FloatingTextarea id="inciList" label="INCI List" value={form.inciList} onChange={set("inciList")} rows={2} placeholder="Full INCI (International Nomenclature of Cosmetic Ingredients) list" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Required for cosmetics and skincare sold in the EU/UK.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatingField id="spfRating" label="SPF Rating" value={form.spfRating} onChange={set("spfRating")} inputMode="numeric" placeholder="e.g. 30, 50" />
            </div>
            <div>
              <FloatingField id="paoMonths" label="PAO (Period After Opening, months)" value={form.paoMonths} onChange={set("paoMonths")} inputMode="numeric" placeholder="e.g. 12" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Months the product is safe to use after opening.</p>
            </div>
          </div>
          <div>
            <MultiSelect id="skinType" options={SKIN_TYPE_OPTIONS} selected={form.skinType} onChange={(v) => setDirect("skinType", v)} label="Suitable Skin Types" labelType="floating" showCheckboxes />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DealToggle id="cruelty-free" checked={form.crueltyFree.certified} onChange={(v) => setCompound("crueltyFree", "certified", v)} label="Cruelty-Free" description="Not tested on animals" />
              {form.crueltyFree.certified && (
                <FloatingField id="cf-body" label="Certifying Body" value={form.crueltyFree.body} onChange={(e) => setCompound("crueltyFree", "body", e.target.value)} className="mt-2" placeholder="e.g. Leaping Bunny" />
              )}
            </div>
            <DealToggle id="derm-tested" checked={form.dermatologicallyTested} onChange={(v) => setDirect("dermatologicallyTested", v)} label="Dermatologically Tested" description="Tested under dermatological supervision" />
          </div>
        </FormSection>
      )}

      {/* ─── Industrial ─── */}
      {showIndustrial && (
        <FormSection title="Industrial & Technical" description="Engineering specifications for parts, tools, and industrial products.">
          <div>
            <FloatingTextarea id="toleranceSpecs" label="Tolerance Specifications" value={form.toleranceSpecs} onChange={set("toleranceSpecs")} rows={2} placeholder="e.g. ±0.05mm on all machined surfaces" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Pressure Rating</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <FloatingField id="press-val" label="Value" value={form.pressureRating.value} onChange={(e) => setCompound("pressureRating", "value", e.target.value)} inputMode="numeric" />
                <FloatingField id="press-unit" label="Unit" value={form.pressureRating.unit} onChange={(e) => setCompound("pressureRating", "unit", e.target.value)} placeholder="e.g. PSI, bar" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Temperature Range</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                <FloatingField id="ind-temp-min" label="Min" value={form.temperatureRange.min} onChange={(e) => setCompound("temperatureRange", "min", e.target.value)} inputMode="numeric" />
                <FloatingField id="ind-temp-max" label="Max" value={form.temperatureRange.max} onChange={(e) => setCompound("temperatureRange", "max", e.target.value)} inputMode="numeric" />
                <FloatingSelect id="ind-temp-unit" label="Unit" value={form.temperatureRange.unit} onChange={(e) => setCompound("temperatureRange", "unit", typeof e === "string" ? e : e.target.value)} options={[{ value: "°C", label: "°C" }, { value: "°F", label: "°F" }]} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FloatingField id="threadType" label="Thread Type" value={form.threadType} onChange={set("threadType")} placeholder="e.g. M8 × 1.25, BSP 1/2" />
            </div>
            <div>
              <FloatingField id="materialGrade" label="Material Grade" value={form.materialGrade} onChange={set("materialGrade")} placeholder="e.g. AISI 304, Grade 8.8" />
            </div>
          </div>
        </FormSection>
      )}

      {/* ─── Lot / Liquidation ─── */}
      {showLot && (
        <FormSection title="Lot / Liquidation" description="Complete these fields if your product is a lot, mixed stock, or liquidation deal.">
          <DealToggle id="isAssortedLot" checked={form.isAssortedLot} onChange={(v) => setDirect("isAssortedLot", v)} label="Assorted Lot" description="Lot contains mixed product types or SKUs" />
          {form.isAssortedLot && (
            <div>
              <BrandPillInput id="lotComposition" label="Lot Composition" selected={form.lotComposition} onChange={(v) => setDirect("lotComposition", v)} placeholder="e.g. Clothing 60%, then Enter..." itemLabel="items" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Describe the makeup of this lot — e.g. &quot;Clothing 60%&quot;, &quot;Electronics 25%&quot;, &quot;Accessories 15%&quot;. Press Enter to add.</p>
            </div>
          )}
          <DealToggle id="isManifested" checked={form.isManifested} onChange={(v) => setDirect("isManifested", v)} label="Manifested" description="Full manifest or product list is available for buyers" />
          <DealToggle id="imagesRepresentative" checked={form.imagesRepresentative} onChange={(v) => setDirect("imagesRepresentative", v)} label="Images Are Representative" description="Photos show sample items, not exact contents of the lot" />
          <DealToggle id="hasOriginalLabels" checked={form.hasOriginalLabels} onChange={(v) => setDirect("hasOriginalLabels", v)} label="Has Original Labels" description="Products retain their original retail labels and tags" />
          {form.hasOriginalLabels && (
            <div>
              <FloatingField id="labelCondition" label="Label Condition" value={form.labelCondition} onChange={set("labelCondition")} placeholder="e.g. Labels intact, some stickered over" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Describe the state of the original labels.</p>
            </div>
          )}
          <DealToggle id="mayContainDuplicates" checked={form.mayContainDuplicates} onChange={(v) => setDirect("mayContainDuplicates", v)} label="May Contain Duplicates" description="Lot may include multiple units of the same product" />
          <div>
            <MultiSelect id="stockOrigin" options={STOCK_ORIGIN_OPTIONS} selected={form.stockOrigin} onChange={(v) => setDirect("stockOrigin", v)} label="Stock Origin" labelType="floating" showCheckboxes />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Where this stock originated — overstock, customer returns, etc.</p>
          </div>
          <div>
            <BrandPillInput id="sourceRetailers" label="Source Retailers" selected={form.sourceRetailers} onChange={(v) => setDirect("sourceRetailers", v)} placeholder="Type a retailer, then comma or Enter..." itemLabel="retailers" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Original retailers this stock came from (e.g. Amazon, Tesco). Press Enter to add.</p>
          </div>
          <div>
            <FloatingSelect id="gradeCategory" label="Lot Grade Category" value={form.gradeCategory} onChange={set("gradeCategory")} options={LOT_GRADE_CATEGORY_OPTIONS} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Overall grade of the lot — A-grade, B-grade, mixed, etc.</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-1.5 ml-1">Detailed breakdown of condition across the lot.</p>
            <FloatingTextarea id="gradeNotes" label="Grade Notes" value={form.gradeNotes} onChange={set("gradeNotes")} rows={2} placeholder="e.g. 70% A-grade, 20% B-grade with minor cosmetic damage, 10% untested" />
          </div>
          <div>
            <CurrencyAmountInput id="lotRetailValue" label="Estimated Lot Retail Value" value={form.lotRetailValue} onChange={set("lotRetailValue")} currency={form.currency} />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Total retail value if all items were sold individually at RRP.</p>
          </div>
          <div>
            <FloatingField id="authenticityGuarantee" label="Authenticity Guarantee" value={form.authenticityGuarantee} onChange={set("authenticityGuarantee")} placeholder="e.g. All products are 100% genuine with proof of purchase" />
            <p className="text-[11px] text-slate-500 mt-1 ml-1">Your guarantee that items in this lot are authentic/genuine.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600">Functional Rate</label>
            <div className="grid grid-cols-3 gap-2">
              <FloatingField id="func-pct" label="Functional %" value={form.functionalRate.functional} onChange={(e) => setCompound("functionalRate", "functional", e.target.value)} inputMode="numeric" placeholder="e.g. 85" />
              <FloatingField id="func-issues" label="With Issues %" value={form.functionalRate.withIssues} onChange={(e) => setCompound("functionalRate", "withIssues", e.target.value)} inputMode="numeric" placeholder="e.g. 10" />
              <FloatingField id="func-note" label="Note" value={form.functionalRate.note} onChange={(e) => setCompound("functionalRate", "note", e.target.value)} placeholder="e.g. 5% untested" />
            </div>
            <p className="text-[11px] text-slate-500 ml-1">Percentage of items that are fully functional vs items with issues.</p>
          </div>
        </FormSection>
      )}

      {/* ─── Additional Product Details (orphan fields not covered by a major section) ─── */}
      {hasOrphanFields && (
        <FormSection title="Additional Product Details" description="Category-specific fields based on your selected categories.">
          {/* ── Sizing & Fit ── */}
          {(orphanFields.has("gender") || orphanFields.has("sizeChart") || orphanFields.has("predominantSizes")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orphanFields.has("gender") && (
                <div>
                  <FloatingSelect id="gender" label="Gender" value={form.gender} onChange={set("gender")} options={GENDER_OPTIONS} />
                </div>
              )}
              {orphanFields.has("sizeChart") && (
                <div>
                  <BrandPillInput id="sizeChart" label="Available Sizes" selected={form.sizeChart} onChange={(v) => setDirect("sizeChart", v)} placeholder="Type a size, then comma or Enter..." itemLabel="sizes" />
                  <p className="text-[11px] text-slate-500 mt-1 ml-1">All available sizes. Press Enter to add.</p>
                </div>
              )}
              {orphanFields.has("predominantSizes") && (
                <div className="sm:col-span-2">
                  <BrandPillInput id="predominantSizes" label="Predominant Sizes" selected={form.predominantSizes} onChange={(v) => setDirect("predominantSizes", v)} placeholder="Type a size, then comma or Enter..." itemLabel="sizes" />
                  <p className="text-[11px] text-slate-500 mt-1 ml-1">The sizes with the most stock.</p>
                </div>
              )}
            </div>
          )}

          {/* ── Fabric & Care ── */}
          {(orphanFields.has("fabricComposition") || orphanFields.has("gsm") || orphanFields.has("careInstructions")) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orphanFields.has("fabricComposition") && (
                  <div>
                    <BrandPillInput id="fabricComposition" label="Fabric Composition" selected={form.fabricComposition} onChange={(v) => setDirect("fabricComposition", v)} placeholder="e.g. 95% Cotton, then Enter..." itemLabel="materials" />
                    <p className="text-[11px] text-slate-500 mt-1 ml-1">e.g. 95% Cotton, 5% Elastane. Press Enter to add each.</p>
                  </div>
                )}
                {orphanFields.has("gsm") && (
                  <div>
                    <FloatingField id="gsm" label="GSM (Fabric Weight)" value={form.gsm} onChange={set("gsm")} inputMode="numeric" placeholder="e.g. 180" />
                    <p className="text-[11px] text-slate-500 mt-1 ml-1">Grams per square metre — higher = heavier fabric.</p>
                  </div>
                )}
              </div>
              {orphanFields.has("careInstructions") && (
                <div>
                  <label className="text-xs font-semibold text-slate-600">Care Instructions</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                    <FloatingField id="care-wash-o" label="Wash" value={form.careInstructions.wash} onChange={(e) => setCompound("careInstructions", "wash", e.target.value)} placeholder="e.g. 40°C" />
                    <FloatingField id="care-dry-o" label="Dry" value={form.careInstructions.dry} onChange={(e) => setCompound("careInstructions", "dry", e.target.value)} placeholder="e.g. Tumble dry low" />
                    <FloatingField id="care-iron-o" label="Iron" value={form.careInstructions.iron} onChange={(e) => setCompound("careInstructions", "iron", e.target.value)} placeholder="e.g. Medium heat" />
                    <FloatingField id="care-bleach-o" label="Bleach" value={form.careInstructions.bleach} onChange={(e) => setCompound("careInstructions", "bleach", e.target.value)} placeholder="e.g. Do not bleach" />
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Ingredients & Shelf Life (food-adjacent) ── */}
          {(orphanFields.has("ingredients") || orphanFields.has("allergens") || orphanFields.has("dietaryTags")) && (
            <>
              {orphanFields.has("ingredients") && (
                <div>
                  <FloatingTextarea id="ingredients-o" label="Ingredients" value={form.ingredients} onChange={set("ingredients")} rows={2} placeholder="List all ingredients in descending order of weight" />
                </div>
              )}
              {(orphanFields.has("allergens") || orphanFields.has("dietaryTags")) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orphanFields.has("allergens") && (
                    <div>
                      <MultiSelect id="allergens-o" options={ALLERGEN_OPTIONS} selected={form.allergens} onChange={(v) => setDirect("allergens", v)} label="Allergens" labelType="floating" showCheckboxes />
                    </div>
                  )}
                  {orphanFields.has("dietaryTags") && (
                    <div>
                      <MultiSelect id="dietaryTags-o" options={DIETARY_TAG_OPTIONS} selected={form.dietaryTags} onChange={(v) => setDirect("dietaryTags", v)} label="Dietary Tags" labelType="floating" showCheckboxes />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {(orphanFields.has("storageInstructions") || orphanFields.has("shelfLife")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orphanFields.has("storageInstructions") && (
                <div>
                  <FloatingField id="storageInstructions-o" label="Storage Instructions" value={form.storageInstructions} onChange={set("storageInstructions")} placeholder="e.g. Store in a cool, dry place" />
                </div>
              )}
              {orphanFields.has("shelfLife") && (
                <div>
                  <FloatingField id="shelfLife-o" label="Shelf Life" value={form.shelfLife} onChange={set("shelfLife")} placeholder="e.g. 12 months from production" />
                </div>
              )}
            </div>
          )}
          {(orphanFields.has("bestBeforeDate") || orphanFields.has("countryOfHarvest")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orphanFields.has("bestBeforeDate") && (
                <div>
                  <FloatingDatePicker id="bestBeforeDate-o" label="Best Before Date" value={form.bestBeforeDate} onChange={set("bestBeforeDate")} />
                </div>
              )}
              {orphanFields.has("countryOfHarvest") && (
                <div>
                  <FloatingField id="countryOfHarvest-o" label="Country of Harvest" value={form.countryOfHarvest} onChange={set("countryOfHarvest")} placeholder="e.g. Spain, Italy" />
                </div>
              )}
            </div>
          )}

          {/* ── Cosmetic & Skin (health/beauty-adjacent) ── */}
          {orphanFields.has("inciList") && (
            <div>
              <FloatingTextarea id="inciList-o" label="INCI List" value={form.inciList} onChange={set("inciList")} rows={2} placeholder="Full INCI (International Nomenclature of Cosmetic Ingredients) list" />
              <p className="text-[11px] text-slate-500 mt-1 ml-1">Required for cosmetics and skincare sold in the EU/UK.</p>
            </div>
          )}
          {orphanFields.has("skinType") && (
            <div>
              <MultiSelect id="skinType-o" options={SKIN_TYPE_OPTIONS} selected={form.skinType} onChange={(v) => setDirect("skinType", v)} label="Suitable Skin Types" labelType="floating" showCheckboxes />
            </div>
          )}
          {(orphanFields.has("crueltyFree") || orphanFields.has("dermatologicallyTested")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {orphanFields.has("crueltyFree") && (
                <div>
                  <DealToggle id="cruelty-free-o" checked={form.crueltyFree.certified} onChange={(v) => setCompound("crueltyFree", "certified", v)} label="Cruelty-Free" description="Not tested on animals" />
                  {form.crueltyFree.certified && (
                    <FloatingField id="cf-body-o" label="Certifying Body" value={form.crueltyFree.body} onChange={(e) => setCompound("crueltyFree", "body", e.target.value)} className="mt-2" placeholder="e.g. Leaping Bunny" />
                  )}
                </div>
              )}
              {orphanFields.has("dermatologicallyTested") && (
                <DealToggle id="derm-tested-o" checked={form.dermatologicallyTested} onChange={(v) => setDirect("dermatologicallyTested", v)} label="Dermatologically Tested" description="Tested under dermatological supervision" />
              )}
            </div>
          )}
        </FormSection>
      )}
    </>
  );

  /* ═══ Tab content router ═══ */
  const renderTabContent = () => {
    switch (activeTab) {
      case "product-pricing": return renderProductPricing();
      case "description-media": return renderDescriptionMedia();
      case "specifications": return renderSpecifications();
      case "order-stock": return renderOrderStock();
      case "shipping-logistics": return renderShippingLogistics();
      case "compliance-legal": return renderComplianceLegal();
      case "commercial-overrides": return renderCommercialOverrides();
      case "category-specific": return renderCategorySpecific();
      default: return null;
    }
  };

  /* ═══ Error summary ═══ */
  const errorEntries = Object.entries(errors).filter(([, v]) => v).map(([k, v]) => ({ field: k, label: DEAL_FIELD_LABELS[k] || k, message: v }));

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ scrollMarginTop: "120px" }}>
      {/* ═══ squared paper grid background ═══ */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.10] z-0" style={{
          backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

      {/* ═══ HEADER ZONE ═══ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/90 via-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative px-6 lg:px-8 pt-6 lg:pt-8 pb-0">
          <div className="mb-5 space-y-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Add New Deal</h1>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                List a product for wholesale buyers. Complete each tab to build your listing — the more detail you provide, the more enquiries you'll attract.
              </p>
            </div>
            <DealProgressBar form={form} onPctChange={onProgressChange} />
          </div>

          {/* Tab bar */}
          <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabStatuses={tabStatuses} tabProgress={tabProgress} tabs={DEAL_TABS} />
        </div>
      </div>

      {/* Error summary */}
      {submitted && errorEntries.length > 0 && (
        <div className="relative z-[1] px-6 pt-4">
          <ErrorSummaryPanel errors={errorEntries} onFieldClick={(field) => { const el = document.getElementById(field); if (el) { el.focus(); el.scrollIntoView({ behavior: "smooth", block: "center" }); } }} />
        </div>
      )}

      {/* Tab content */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="relative z-[2] px-6 py-5 space-y-6">
        {renderTabContent()}
      </div>

      {/* Footer actions */}
      <div className="relative z-[1] px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
        <p className="text-[10px] text-slate-500">Draft auto-saved</p>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 active:scale-95"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            {saving ? "Submitting..." : "Submit for Review"}
          </button>
          {activeTab !== DEAL_TABS[DEAL_TABS.length - 1].id && (
            <button
              type="button"
              onClick={() => {
                const idx = DEAL_TABS.findIndex((t) => t.id === activeTab);
                if (idx < DEAL_TABS.length - 1) {
                  setActiveTab(DEAL_TABS[idx + 1].id);
                  requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
                }
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Save & Continue
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
      </div>{/* close squared paper grid wrapper */}
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE WRAPPER (mirrors SupplierProfilePage)
   ═══════════════════════════════════════════════════════════════════ */

export function AddDealPage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");
  const [tipsCollapsed, toggleTips] = usePanelCollapse("wup-tips-collapsed");
  const [focusedField, setFocusedField] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("product-pricing");

  const { recordSave } = useProfileSaveTime("deal");
  const [livePct, setLivePct] = useState(null);
  const handleProgressChange = useCallback((pct) => {
    setLivePct(pct);
    try { localStorage.setItem("wup-deal-form-pct", String(pct)); } catch {}
  }, []);
  const handleSave = useCallback(() => { recordSave(); }, [recordSave]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Add Deal" },
        ]} />
        <MobileDashboardNav activePage="add-deal" />

        <div className="flex gap-6 items-start">
          {/* Left: Account Sidebar */}
          <AccountSidebar user={user} activePage="add-deal" collapsed={sidebarCollapsed} onToggle={toggleSidebar} profilePct={livePct} />

          {/* Center: Form */}
          <div className="relative flex-1 min-w-0">
            <UpgradeBanner user={user} />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <DealForm user={user} onFocusedFieldChange={setFocusedField} onActiveTabChange={setActiveFormTab} onSave={handleSave} onProgressChange={handleProgressChange} />
            </div>
          </div>

          {/* Right: Contextual Tips Panel */}
          <SharedFormTipsPanel
            focusedField={focusedField}
            activeTab={activeFormTab}
            collapsed={tipsCollapsed}
            onToggle={toggleTips}
            tipsData={DEAL_TIPS_DATA}
            defaultTips={DEAL_TAB_DEFAULT_TIPS}
            defaultTabKey="product-pricing"
            bottomSection={DEAL_TIPS_BOTTOM}
            iconFallback={Package}
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
