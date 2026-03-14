"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Tag,
  Barcode,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Truck,
  Warehouse,
  Clock,
  MapPin,
  Box,
  ShieldCheck,
  Shield,
  Users,
  Wrench,
  Image,
  Wheat,
  Droplets,
  Shirt,
  Cog,
  Layers,
  BarChart3,
  Sparkles,
  Leaf,
  CheckCircle2,
} from "lucide-react";

/* ───────────────────────────────────────────────────────────────────
   VARIABLE REFERENCE — Genre-grouped display of ALL deal variables
   Used on /deal as a schema audit / reference tab.
   ─────────────────────────────────────────────────────────────────── */

/** Format a value for display — handles objects, arrays, booleans, nulls */
function fmt(val) {
  if (val === null || val === undefined) return <span className="text-slate-300 italic">null</span>;
  if (val === true) return <span className="text-emerald-600 font-semibold">true</span>;
  if (val === false) return <span className="text-red-400 font-semibold">false</span>;
  if (typeof val === "number") return <span className="font-semibold text-slate-800">{val.toLocaleString()}</span>;
  if (typeof val === "string") {
    if (val.length > 120) return <span className="text-slate-600">{val.slice(0, 120)}…</span>;
    return <span className="text-slate-700">{val}</span>;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return <span className="text-slate-300 italic">[ ] (empty)</span>;
    // Simple array of strings/numbers
    if (typeof val[0] === "string" || typeof val[0] === "number") {
      const preview = val.slice(0, 5).join(", ");
      return <span className="text-slate-700">{preview}{val.length > 5 ? ` … (+${val.length - 5})` : ""}</span>;
    }
    // Array of objects — show count + first item keys
    const keys = Object.keys(val[0]).slice(0, 4).join(", ");
    return <span className="text-slate-600">[{val.length} items] <span className="text-slate-400 text-xs">({keys})</span></span>;
  }
  if (typeof val === "object") {
    const keys = Object.keys(val);
    if (keys.length === 0) return <span className="text-slate-300 italic">{"{}"} (empty)</span>;
    // Small object — show inline
    if (keys.length <= 3) {
      const parts = keys.map(k => {
        const v = val[k];
        const display = v === null ? "null" : v === true ? "✓" : v === false ? "✗" : typeof v === "object" ? "{…}" : String(v);
        return `${k}: ${display}`;
      });
      return <span className="text-slate-600 text-xs font-mono">{`{ ${parts.join(", ")} }`}</span>;
    }
    // Larger object — show key count
    return <span className="text-slate-600">{`{${keys.length} keys}`} <span className="text-slate-400 text-xs">({keys.slice(0, 4).join(", ")}…)</span></span>;
  }
  return <span className="text-slate-600">{String(val)}</span>;
}

/** One collapsible genre panel */
function GenrePanel({ icon: Icon, title, color, variables, deal, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const filled = variables.filter(v => {
    const val = v.path ? v.path.split(".").reduce((o, k) => o?.[k], deal) : deal[v.key];
    return val !== null && val !== undefined;
  }).length;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <Icon size={16} className={color} />
        <span className="text-sm font-bold text-slate-800 flex-1">{title}</span>
        <span className="text-xs text-slate-400 font-medium">{filled}/{variables.length} populated</span>
        {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {variables.map((v) => {
            const val = v.path ? v.path.split(".").reduce((o, k) => o?.[k], deal) : deal[v.key];
            const hasValue = val !== null && val !== undefined;
            return (
              <div key={v.key} className={`grid grid-cols-[180px_1fr] gap-3 px-4 py-2 text-sm ${hasValue ? "bg-white" : "bg-slate-50/50"}`}>
                <div className="flex items-start gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${hasValue ? "bg-emerald-400" : "bg-slate-200"}`} />
                  <div>
                    <span className="font-mono text-xs text-slate-700">{v.key}</span>
                    {v.source && <span className="ml-1 text-[9px] font-bold text-blue-400 uppercase">{v.source}</span>}
                  </div>
                </div>
                <div className="min-w-0 break-words">{fmt(val)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Genre definitions — each variable is { key, source? (GS1/Google/NEW) } */
const GENRES = [
  {
    title: "Product Identity & Classification",
    icon: Tag,
    color: "text-blue-500",
    defaultOpen: true,
    vars: [
      { key: "id" }, { key: "title" }, { key: "description" }, { key: "slug" },
      { key: "category" }, { key: "categoryBreadcrumb" }, { key: "tags" },
      { key: "searchKeywords" }, { key: "metaTitle" }, { key: "metaDescription" },
      { key: "brands" }, { key: "itemGroupId", source: "N" }, { key: "productHighlights", source: "N" },
      { key: "productLanguage" }, { key: "targetAudience" }, { key: "specifications" },
    ],
  },
  {
    title: "Identification Codes",
    icon: Barcode,
    color: "text-slate-600",
    vars: [
      { key: "sku" }, { key: "ean" }, { key: "asin", source: "N" }, { key: "mpn" }, { key: "taric" },
      { key: "gln", source: "N" }, { key: "gpcCode", source: "N" },
      { key: "batchNumber" }, { key: "serialNumberRequired" },
    ],
  },
  {
    title: "Pricing & Commercial Terms",
    icon: DollarSign,
    color: "text-emerald-500",
    vars: [
      { key: "price" }, { key: "currency" }, { key: "priceUnit" },
      { key: "rrp" }, { key: "rrpCurrency" }, { key: "markup" },
      { key: "negotiable" }, { key: "priceValidUntil" },
      { key: "discountTiers" }, { key: "priceTiers" },
      { key: "comparisonPrice" }, { key: "omnibusPrice" },
      { key: "discountPercentage" }, { key: "originalPrice" },
      { key: "vat" }, { key: "mapPrice" }, { key: "costOfGoodsSold", source: "N" },
      { key: "unitPricingBaseMeasure", source: "N" },
    ],
  },
  {
    title: "Order & Quantity",
    icon: ShoppingCart,
    color: "text-orange-500",
    vars: [
      { key: "moq" },
      { key: "minimumOrderAmount" }, { key: "minimumOrderCurrency" },
      { key: "maxOrderQuantity" }, { key: "orderIncrement" },
      { key: "casePackSize" },
      { key: "crossCategoryMOQ" }, { key: "multipackQuantity", source: "N" },
      { key: "availableQuantity" },
    ],
  },
  {
    title: "Payment & Financial",
    icon: CreditCard,
    color: "text-violet-500",
    vars: [
      { key: "paymentOptions" }, { key: "supplierPaymentMethods" },
      { key: "paymentFinancing" }, { key: "netPaymentTerms" },
      { key: "depositRequired" }, { key: "taxClass" }, { key: "invoiceType" }, { key: "sanitizedInvoice" },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    color: "text-sky-500",
    vars: [
      { key: "shippingTime" }, { key: "leadTime" }, { key: "leadTimeTiers" },
      { key: "readyToShip" }, { key: "isDropship" },
      { key: "shippingCountries" }, { key: "shippingScope" }, { key: "shippingContinents" },
      { key: "restrictionScope" }, { key: "restrictedContinents" },
      { key: "deliveryOptions" }, { key: "deliveryMethods" }, { key: "estimatedDeliveryRange" },
      { key: "shippingCostBearer" }, { key: "shippingCostMethod" },
      { key: "shippingClass" }, { key: "freeShippingThreshold" }, { key: "freeDelivery" },
      { key: "freeReturns" }, { key: "shipsFrom" }, { key: "shipsFromCode" },
      { key: "incoterms" }, { key: "portOfOrigin" },
    ],
  },
  {
    title: "Logistics & Warehousing",
    icon: Warehouse,
    color: "text-amber-600",
    vars: [
      { key: "productDimensions" }, { key: "netWeight" },
      { key: "dimensionsPerUnit" }, { key: "grossWeight", source: "N" },
      { key: "packaging" }, { key: "packagingFormat" }, { key: "packageContents" },
      { key: "palletConfiguration" }, { key: "containerLoadQuantity" },
      { key: "stackable" }, { key: "despatchUnitIndicator", source: "N" },
      { key: "storageTemperatureRange", source: "N" },
    ],
  },
  {
    title: "Product Status & Lifecycle",
    icon: Clock,
    color: "text-teal-500",
    vars: [
      { key: "dealStatus" }, { key: "launchDate" }, { key: "discontinuedDate" },
      { key: "seasonality" }, { key: "bestBeforeDate" }, { key: "shelfLife" },
      { key: "dateAdded" }, { key: "isExpired" }, { key: "isNew" },
      { key: "isBestseller" }, { key: "lowStockWarning" }, { key: "offerValidityDays" },
    ],
  },
  {
    title: "Origin & Manufacturing",
    icon: MapPin,
    color: "text-rose-500",
    vars: [
      { key: "country" }, { key: "countryName" },
      { key: "dealLocation" }, { key: "dealLocationCode" },
      { key: "manufacturingCountry" }, { key: "manufacturingCountryCode" },
      { key: "countryOfLastProcessing", source: "N" }, { key: "stockOrigin" },
    ],
  },
  {
    title: "Physical Attributes",
    icon: Box,
    color: "text-indigo-500",
    vars: [
      { key: "materials" }, { key: "pattern", source: "N" },
      { key: "color", source: "N" }, { key: "predominantSizes" },
      { key: "variants" },
      { key: "powerSource" }, { key: "assemblyRequired" }, { key: "batteryInfo" },
    ],
  },
  {
    title: "Compliance & Regulatory",
    icon: ShieldCheck,
    color: "text-red-500",
    vars: [
      { key: "certifications" }, { key: "hazmatInfo" }, { key: "hazardSymbols" },
      { key: "regionalCompliance" }, { key: "cpscCompliance" }, { key: "fdaRegistration" },
      { key: "energyRating" }, { key: "sarValue" }, { key: "ipRating" },
      { key: "countryRestrictions" }, { key: "ageRestriction" },
      { key: "importDutyCoverage" }, { key: "euResponsiblePerson" },
      { key: "weeeClassification", source: "N" }, { key: "reachSvhcDeclaration", source: "N" },
      { key: "rohsCompliance", source: "N" },
    ],
  },
  {
    title: "Trust & Buyer Protection",
    icon: Shield,
    color: "text-emerald-600",
    vars: [
      { key: "orderProtection" }, { key: "warrantyInfo" }, { key: "warranty" },
      { key: "productInsurance" }, { key: "qualityInspection" },
      { key: "authenticityGuarantee" }, { key: "returnPolicy" },
      { key: "dealReturnPolicy" }, { key: "imagesRepresentative" },
    ],
  },
  {
    title: "Supplier Profile",
    icon: Users,
    color: "text-blue-600",
    vars: [
      { key: "supplier", path: "supplier" },
      { key: "supplierBusinessType" }, { key: "supplierIsCertified" },
      { key: "supplierResponseBadge" }, { key: "catalogueSize" },
      { key: "supplyModels" }, { key: "supplyAbility" },
    ],
  },
  {
    title: "Customisation & Branding",
    icon: Wrench,
    color: "text-cyan-600",
    vars: [
      { key: "customizationOptions" }, { key: "customizationAbility" },
      { key: "whiteLabeling" }, { key: "exclusivityAvailable" },
    ],
  },
  {
    title: "Media & Attachments",
    icon: Image,
    color: "text-pink-500",
    vars: [
      { key: "images" }, { key: "videoUrl" }, { key: "attachments" },
    ],
  },
  {
    title: "Category: Food & Beverage",
    icon: Wheat,
    color: "text-amber-500",
    vars: [
      { key: "ingredients" }, { key: "allergens" }, { key: "dietaryTags" },
      { key: "storageInstructions" }, { key: "nutritionalInfo" },
      { key: "organicCertification" }, { key: "kosherHalal" },
      { key: "countryOfHarvest" }, { key: "abv" }, { key: "vintageYear" },
      { key: "gmoDeclaration", source: "N" },
    ],
  },
  {
    title: "Category: Health & Beauty",
    icon: Droplets,
    color: "text-pink-400",
    vars: [
      { key: "inciList" }, { key: "spfRating" }, { key: "skinType" },
      { key: "paoMonths" }, { key: "crueltyFree" }, { key: "dermatologicallyTested" },
    ],
  },
  {
    title: "Category: Apparel & Fashion",
    icon: Shirt,
    color: "text-indigo-400",
    vars: [
      { key: "fabricComposition" }, { key: "gsm" }, { key: "careInstructions" },
      { key: "fitType" }, { key: "gender" }, { key: "sizeChart" },
    ],
  },
  {
    title: "Category: Industrial & Technical",
    icon: Cog,
    color: "text-slate-500",
    vars: [
      { key: "toleranceSpecs" }, { key: "pressureRating" }, { key: "temperatureRange" },
      { key: "threadType" }, { key: "materialGrade" }, { key: "compatibleWith" },
    ],
  },
  {
    title: "Lot & Stock Intelligence",
    icon: Layers,
    color: "text-purple-500",
    vars: [
      { key: "grade" }, { key: "gradeCategory" }, { key: "gradeNotes" },
      { key: "productGrade" }, { key: "productQualityTier" }, { key: "brandTier" },
      { key: "isAssortedLot" }, { key: "lotComposition" }, { key: "isIndivisibleLot" },
      { key: "sourceRetailers" }, { key: "isManifested" }, { key: "lotRetailValue" },
      { key: "mayContainDuplicates" }, { key: "functionalRate" },
      { key: "modelCount" }, { key: "labelCondition" },
      { key: "hasOriginalLabels" },
    ],
  },
  {
    title: "Platform & Analytics",
    icon: BarChart3,
    color: "text-blue-400",
    vars: [
      { key: "platforms" }, { key: "platformExclusive" },
      { key: "viewCount" }, { key: "inquiryCount" },
      { key: "unitsSold" }, { key: "reorderRate" }, { key: "categoryRanking" },
      { key: "productReputation" },
      { key: "reviews" }, { key: "reviewSummary" },
      { key: "frequentlyBoughtTogether" },
    ],
  },
  {
    title: "Promotions & Deal Features",
    icon: Sparkles,
    color: "text-amber-500",
    vars: [
      { key: "promotionalBadge" }, { key: "firstOrderDiscount" },
      { key: "weeksBestOffer" }, { key: "testerOption" },
      { key: "sampleAvailability" }, { key: "samplePrice" }, { key: "sampleLeadTime" },
      { key: "sellToPrivate" }, { key: "exportOnly" }, { key: "exportRegions" },
      { key: "showroomAvailable" },
    ],
  },
  {
    title: "Sustainability & Environment",
    icon: Leaf,
    color: "text-green-500",
    vars: [
      { key: "ecoFriendly" }, { key: "carbonFootprint", source: "N" },
    ],
  },
];

export default function VariableReference({ deal }) {
  const totalVars = GENRES.reduce((sum, g) => sum + g.vars.length, 0);
  const filledVars = GENRES.reduce((sum, g) => {
    return sum + g.vars.filter(v => {
      const val = v.path ? v.path.split(".").reduce((o, k) => o?.[k], deal) : deal[v.key];
      return val !== null && val !== undefined;
    }).length;
  }, 0);
  const newVars = GENRES.reduce((sum, g) => sum + g.vars.filter(v => v.source === "N").length, 0);

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-800">{filledVars}</span>
          <span className="text-sm text-slate-400">/ {totalVars} variables populated</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-500">{GENRES.length} genre panels</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-blue-400 uppercase bg-blue-50 px-1.5 py-0.5 rounded">N</span>
          <span className="text-xs text-slate-500">{newVars} new from GS1/Google gap analysis</span>
        </div>
      </div>

      {/* Genre panels */}
      <div className="space-y-3">
        {GENRES.map((genre) => (
          <GenrePanel
            key={genre.title}
            icon={genre.icon}
            title={genre.title}
            color={genre.color}
            variables={genre.vars}
            deal={deal}
            defaultOpen={genre.defaultOpen || false}
          />
        ))}
      </div>
    </div>
  );
}
