"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Heart,
  Mail,
  SlidersHorizontal,
  Minus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  Flame,
  Info,
  LayoutGrid,
  List,
} from "lucide-react";
import StarRating from "@/components/shared/star-rating";
import { SidebarPromoPanel } from "@/components/shared/collapsible-filter-panel";
import { DetailedDealCard, PRODUCTS as DEAL_PRODUCTS } from "./deal-cards";
import { FILTER_CATEGORIES } from "@/lib/categories";
import { COUNTRIES as CANONICAL_COUNTRIES } from "@/lib/countries";
import { useDemoAuth } from "@/components/shared/demo-auth-context";

/* ─────────── Flag Emoji Helper ─────────── */
// Flat flag images via flagcdn.com — ISO 3166-1 alpha-2 lowercase codes
// PRODUCTION (L8): Replace <img> with next/image Image component.
function FlagImg({ code, size = 20 }) {
  const iso = code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}
// FLAGS keyed by ISO alpha-2 code — returns JSX flag elements
const FLAGS = Object.fromEntries(
  CANONICAL_COUNTRIES.slice(0, 20).map((c) => [c.iso, <FlagImg key={c.iso} code={c.iso} size={18} />])
);

/* ─────────── Placeholder Data (H1) ─────────────────────────
   PRODUCTION: Replace with API data:
   - CATEGORIES    → GET /api/categories (nested with counts)
   - Filter data is used for client-side faceted search.
   SEED: prisma/seed.ts → seedCategories()
   Consider fetching category tree on mount or via getStaticProps.
   ─────────────────────────────────────────────────────────── */
const POPULAR_SEARCHES = [
  "Sony Xperia",
  "Samsung Galaxy",
  "Lloytron Active",
  "Lamp",
  "Oral-B",
  "Adidas",
  "Nike",
];

const CATEGORIES = FILTER_CATEGORIES;

// Helper: get all child IDs for a parent category
function getChildIds(parentId) {
  const parent = CATEGORIES.find((c) => c.id === parentId);
  return parent?.children?.map((ch) => ch.id) || [];
}

// Helper: find parent category for a given child ID
// Note: child IDs are in format "parentId--childId" per FILTER_CATEGORIES
function findParentCategory(childId) {
  // Extract parent ID from child ID (format: "parentId--childId")
  const parentId = childId?.split("--")[0];
  return parentId ? CATEGORIES.find((c) => c.id === parentId) : undefined;
}

// Helper: flat list of all category IDs (parents + children)
function getAllCategoryLabels() {
  const map = {};
  CATEGORIES.forEach((c) => {
    map[c.id] = c.label;
    c.children?.forEach((ch) => { map[ch.id] = ch.label; });
  });
  return map;
}

/* ── Country filter: canonical ISO codes from /lib/countries.js ──
   PRODUCTION: Replace demo counts with real counts from API. */
const COUNTRY_DEMO_COUNTS = { gb: 105247, de: 4757, pl: 3923, nl: 3872, us: 3841, es: 3015, it: 2530, fr: 1890 };
const COUNTRIES = CANONICAL_COUNTRIES
  .filter((c) => COUNTRY_DEMO_COUNTS[c.iso])
  .map((c) => ({ code: c.iso, name: c.label, count: COUNTRY_DEMO_COUNTS[c.iso] }));

const GRADES = [
  { id: "new", label: "New" },
  { id: "used", label: "Used" },
  { id: "returns", label: "Returns / Mixed Stock" },
  { id: "liquidation", label: "Liquidation Stocklots" },
  { id: "refurbished", label: "Refurbished" },
];

/* ── Supplier Type filter: canonical values from SUPPLIER_TYPE_OPTIONS ── */
const SUPPLIER_TYPES = [
  { id: "manufacturer", label: "Manufacturer" },
  { id: "brand-owner", label: "Brand Owner" },
  { id: "private-label", label: "Private Label / White Label" },
  { id: "wholesaler", label: "Wholesaler" },
  { id: "distributor", label: "Distributor" },
  { id: "importer", label: "Importer" },
  { id: "exporter", label: "Exporter" },
  { id: "trading-company", label: "Trading Company" },
  { id: "liquidator", label: "Liquidator / Clearance" },
  { id: "dropshipper", label: "Dropshipper" },
  { id: "sourcing-agent", label: "Sourcing Agent" },
  { id: "artisan-maker", label: "Artisan / Maker" },
];

const BUYER_TYPES = [
  { id: "online-retailer", label: "Online Retailers" },
  { id: "shop-retailer", label: "Shop / High Street Retailers" },
  { id: "multi-chain", label: "Multi-Chain Retailers" },
  { id: "marketplace-seller", label: "Marketplace Sellers" },
  { id: "dropshipper", label: "Dropshippers" },
  { id: "market-trader", label: "Market Traders" },
  { id: "wholesaler-reseller", label: "Wholesalers / Resellers" },
  { id: "distributor", label: "Distributors / Importers" },
  { id: "supermarket", label: "Supermarket / Grocery" },
  { id: "hospitality", label: "Hospitality / HoReCa" },
  { id: "corporate-buyer", label: "Corporate / Procurement" },
  { id: "franchisee", label: "Franchisees" },
  { id: "charity-nonprofit", label: "Charities / Non-Profits" },
  { id: "government", label: "Government / Public Sector" },
  { id: "subscription-box", label: "Subscription Box Services" },
  { id: "social-commerce", label: "Social Commerce Sellers" },
  { id: "mail-order", label: "Mail Order / Catalogue" },
];

const RATINGS = [
  { value: 5, label: "5.0" },
  { value: 4.5, label: "Up to 4.5" },
  { value: 4, label: "Up to 4" },
];

/* ═══════════════════════════════════════════════════
   COLLAPSIBLE SECTION
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
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-[10px] text-orange-500 hover:text-orange-600 font-semibold cursor-pointer"
            >
              Clear
            </span>
          )}
          {open ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
        </div>
      </button>
      {open && <div className="px-4 pb-3.5" id={`filter-section-${titleSlug}`}>{children}</div>}
    </div>
  );
}

/* StarRating — imported from @/components/shared/star-rating */

/* ═══════════════════════════════════════════════════
   CHECKBOX ITEM
   ═══════════════════════════════════════════════════ */
function CheckboxItem({ id, label, count, checked, onChange, prefix, highlighted }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
    >
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
   PRICE RANGE SLIDER — Dual-handle range with inputs
   ═══════════════════════════════════════════════════ */
const PRICE_MIN = 0;
const PRICE_MAX_DEFAULT = 10000;

function PriceRangeSlider({ filters, setFilters, maxPrice }) {
  const PRICE_MAX = maxPrice || PRICE_MAX_DEFAULT;
  // Local state for immediate UI feedback; debounced commit to actual filters
  const [localMin, setLocalMin] = useState(filters.priceMin);
  const [localMax, setLocalMax] = useState(filters.priceMax);
  const debounceRef = useRef(null);

  // Sync local state when filters change externally (e.g. Clear All)
  useEffect(() => { setLocalMin(filters.priceMin); }, [filters.priceMin]);
  useEffect(() => { setLocalMax(filters.priceMax); }, [filters.priceMax]);

  const commitDebounced = useCallback((min, max) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((p) => ({ ...p, priceMin: min, priceMax: max }));
    }, 500);
  }, [setFilters]);

  // Cleanup on unmount
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
      {/* Min / Max inputs */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Min.</label>
          <input
            type="number"
            value={localMin}
            onChange={handleMinInput}
            placeholder="0"
            min={PRICE_MIN}
            max={PRICE_MAX}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
          />
        </div>
        <span className="text-slate-300 mt-4">–</span>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-400 uppercase mb-1 block">Max.</label>
          <input
            type="number"
            value={localMax}
            onChange={handleMaxInput}
            placeholder={String(PRICE_MAX)}
            min={PRICE_MIN}
            max={PRICE_MAX}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>

      {/* Dual range slider */}
      <div className="relative h-5 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-1 bg-slate-200 rounded-full" />
        {/* Active range (orange) */}
        <div
          className="absolute h-1 bg-orange-400 rounded-full"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={minVal}
          onChange={handleMinRange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: minVal > PRICE_MAX - 100 ? 40 : 30 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={maxVal}
          onChange={handleMaxRange}
          className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-orange-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:cursor-pointer"
          style={{ zIndex: 30 }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FILTER SIDEBAR
   ═══════════════════════════════════════════════════ */
function FilterSidebar({ filters, setFilters, isOpen, onClose, hideRating = false, hidePrice = false, hideDropshipping = false, hideGrade = false, showBusinessType = false, showBuyerTypes = false, maxPrice }) {
  const [categorySearch, setCategorySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const searchLower = categorySearch.toLowerCase();
  const filteredCategories = categorySearch
    ? CATEGORIES.filter((c) =>
        c.label.toLowerCase().includes(searchLower) ||
        c.children?.some((ch) => ch.label.toLowerCase().includes(searchLower))
      )
    : CATEGORIES;
  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  /* ── Check if any filter is active (for Clear All visibility) ── */
  const hasActiveFilters =
    filters.rating != null ||
    filters.category != null ||
    filters.subcategory != null ||
    (filters.priceMin && filters.priceMin !== "") ||
    (filters.priceMax && filters.priceMax !== "") ||
    filters.countries.length > 0 ||
    filters.dropshipping === true ||
    filters.grades.length > 0 ||
    (filters.supplierTypes?.length > 0) ||
    (filters.buyerTypes?.length > 0) ||
    (filters.keywords?.length > 0);

  return (
    <aside
      className={`
        bg-white border border-slate-200 shadow-sm overflow-hidden
        ${isOpen ? "w-full h-full rounded-none lg:w-72 lg:rounded-xl lg:h-auto lg:shrink-0" : "hidden lg:block w-72 shrink-0 rounded-xl"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-orange-500" />
          <span className="text-sm font-bold text-slate-800">Filters</span>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
          <button
            onClick={() =>
              setFilters({
                rating: null,
                category: null,
                subcategory: null,
                priceMin: "",
                priceMax: "",
                countries: [],
                dropshipping: false,
                grades: [],
                supplierTypes: [],
                buyerTypes: [],
                keywords: [],
              })
            }
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
        {/* ── Popular Searches ── */}
        <FilterSection title="Popular Searches">
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((term) => {
              const isActive = (filters.keywords || []).some((k) => (typeof k === "string" ? k : k.term) === term);
              return (
                <button
                  key={term}
                  onClick={() => setFilters((p) => {
                    const prev = p.keywords || [];
                    return {
                      ...p,
                      keywords: isActive
                        ? prev.filter((k) => (typeof k === "string" ? k : k.term) !== term)
                        : [...prev, { term, mode: "any" }],
                    };
                  })}
                  className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all flex items-center gap-1 ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {term}
                  {isActive && <X size={11} className="ml-0.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* ── Rating ── */}
        {!hideRating && (
        <FilterSection
          title="Rating"
          onClear={filters.rating ? () => setFilters((p) => ({ ...p, rating: null })) : undefined}
        >
          <div className="space-y-0.5" role="radiogroup" aria-label="Minimum rating">
            {RATINGS.map((r) => (
              <label
                key={r.value}
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    rating: p.rating === r.value ? null : r.value,
                  }))
                }
                className={`flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg cursor-pointer transition-all ${
                  filters.rating === r.value
                    ? "bg-orange-50 border border-orange-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
                role="radio"
                aria-checked={filters.rating === r.value}
              >
                {/* Custom radio circle */}
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  filters.rating === r.value
                    ? "border-orange-500"
                    : "border-slate-300"
                }`}>
                  {filters.rating === r.value && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </span>
                <StarRating rating={r.value} />
                <span className="text-xs text-slate-500 font-medium">
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
        )}

        {/* ── Selected Category → Subcategory Group ── */}
        {filters.category && (() => {
          const selectedParent = CATEGORIES.find((c) => c.id === filters.category);
          if (!selectedParent?.children) return null;
          return (
            <FilterSection
              title={selectedParent.label}
              onClear={() => setFilters((p) => ({ ...p, category: null, subcategory: null }))}
            >
              <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                {selectedParent.children.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        subcategory: p.subcategory === sub.id ? null : sub.id,
                      }))
                    }
                    className="w-full flex items-center justify-between py-1.5 text-left group"
                  >
                    <span className={`text-sm transition-colors ${
                      filters.subcategory === sub.id
                        ? "text-orange-500 font-semibold"
                        : "text-slate-600 group-hover:text-orange-500"
                    }`}>
                      {sub.label}
                    </span>
                    <span className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${
                      filters.subcategory === sub.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-400"
                    }`}>
                      {sub.count.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </FilterSection>
          );
        })()}

        {/* ── Categories ── */}
        <FilterSection
          title="Categories"
          onClear={
            filters.category
              ? () => setFilters((p) => ({ ...p, category: null, subcategory: null }))
              : undefined
          }
        >
          <div className="relative mb-2.5">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Search categories..."
              aria-label="Search categories"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
            {filteredCategories.map((cat) => {
              // When searching, show matching subcategories inline under their parent
              const matchingSubs = categorySearch && cat.children
                ? cat.children.filter((ch) => ch.label.toLowerCase().includes(searchLower))
                : [];
              const parentMatches = cat.label.toLowerCase().includes(searchLower);
              return (
                <div key={cat.id}>
                  <button
                    onClick={() =>
                      setFilters((p) => ({
                        ...p,
                        category: p.category === cat.id ? null : cat.id,
                        subcategory: null,
                      }))
                    }
                    className="w-full flex items-center justify-between py-1.5 text-left group"
                  >
                    <span className={`text-sm transition-colors ${
                      filters.category === cat.id
                        ? "text-orange-500 font-semibold"
                        : "text-slate-600 group-hover:text-orange-500"
                    }`}>
                      {cat.label}
                    </span>
                    <span className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${
                      filters.category === cat.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-400"
                    }`}>
                      {cat.count.toLocaleString()}
                    </span>
                  </button>
                  {/* Show matching subcategories when searching */}
                  {categorySearch && !parentMatches && matchingSubs.length > 0 && (
                    <div className="pl-4 space-y-0.5">
                      {matchingSubs.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() =>
                            setFilters((p) => ({
                              ...p,
                              category: cat.id,
                              subcategory: p.subcategory === sub.id ? null : sub.id,
                            }))
                          }
                          className="w-full flex items-center justify-between py-1 text-left group"
                        >
                          <span className={`text-xs transition-colors ${
                            filters.subcategory === sub.id
                              ? "text-orange-500 font-semibold"
                              : "text-slate-500 group-hover:text-orange-500"
                          }`}>
                            {sub.label}
                          </span>
                          <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                            filters.subcategory === sub.id
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-slate-400"
                          }`}>
                            {sub.count.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </FilterSection>

        {/* ── Price Range ── */}
        {!hidePrice && (
          <FilterSection title="Price">
            <PriceRangeSlider filters={filters} setFilters={setFilters} maxPrice={maxPrice} />
          </FilterSection>
        )}

        {/* ── Country ── */}
        <FilterSection
          title="Country"
          onClear={
            filters.countries.length > 0
              ? () => setFilters((p) => ({ ...p, countries: [] }))
              : undefined
          }
        >
          <div className="relative mb-2.5">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search countries..."
              aria-label="Search countries"
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
            />
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {filteredCountries.map((country) => (
              <CheckboxItem
                key={country.code}
                id={`country-${country.code}`}
                label={country.name}
                count={country.count}
                prefix={FLAGS[country.code]}
                checked={filters.countries.includes(country.code)}
                onChange={() => toggleArrayFilter("countries", country.code)}
              />
            ))}
          </div>
        </FilterSection>

        {/* ── Dropshipping ── */}
        {!hideDropshipping && (
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
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                    filters.dropshipping ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
              <span className="text-sm text-slate-600 group-hover:text-slate-900">Dropshipping Only</span>
            </label>
          </FilterSection>
        )}

        {/* ── Grade ── */}
        {!hideGrade && (
          <FilterSection
            title="Grade"
            onClear={
              filters.grades.length > 0
                ? () => setFilters((p) => ({ ...p, grades: [] }))
                : undefined
            }
          >
            <div className="space-y-0.5">
              {GRADES.map((grade) => (
                <CheckboxItem
                  key={grade.id}
                  id={`grade-${grade.id}`}
                  label={grade.label}
                  checked={filters.grades.includes(grade.id)}
                  onChange={() => toggleArrayFilter("grades", grade.id)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Supplier Type ── */}
        {showBusinessType && (
          <FilterSection
            title="Supplier Type"
            onClear={
              (filters.supplierTypes?.length > 0)
                ? () => setFilters((p) => ({ ...p, supplierTypes: [] }))
                : undefined
            }
          >
            <div className="space-y-0.5">
              {SUPPLIER_TYPES.map((bt) => (
                <CheckboxItem
                  key={bt.id}
                  id={`bt-${bt.id}`}
                  label={bt.label}
                  checked={(filters.supplierTypes || []).includes(bt.id)}
                  onChange={() => toggleArrayFilter("supplierTypes", bt.id)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Buyers Served ── */}
        {showBuyerTypes && (
          <FilterSection
            title="Buyers Served"
            onClear={
              (filters.buyerTypes?.length > 0)
                ? () => setFilters((p) => ({ ...p, buyerTypes: [] }))
                : undefined
            }
          >
            <div className="space-y-0.5">
              {BUYER_TYPES.map((bt) => (
                <CheckboxItem
                  key={bt.id}
                  id={`buyer-${bt.id}`}
                  label={bt.label}
                  checked={(filters.buyerTypes || []).includes(bt.id)}
                  onChange={() => toggleArrayFilter("buyerTypes", bt.id)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* ── Promo Info Block ── */}
        <div className="px-4 py-4 bg-gradient-to-b from-orange-50 to-white border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Flame size={12} className="text-orange-500" />
            Exclusive Deals on Clothing & Fashion
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Find unbeatable deals on high-quality clothing and fashion items,
            including trendy apparel, footwear, accessories, and seasonal
            collections.
          </p>
        </div>

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
   ACTIVE FILTER CHIPS
   ═══════════════════════════════════════════════════ */
function ActiveFilterChips({ filters, setFilters, searchMode }) {
  const chips = [];

  (filters.keywords || []).forEach((kw) => {
    /* keywords are { term, mode } objects or legacy strings */
    const term = typeof kw === "string" ? kw : kw.term;
    const mode = typeof kw === "string" ? (searchMode || "any") : kw.mode;
    chips.push({
      key: `keyword-${mode}-${term}`,
      label: term,
      type: "keyword",
      prefix: mode === "exact" ? "exact" : mode === "all" ? "all" : null,
      onRemove: () => setFilters((p) => ({
        ...p,
        keywords: (p.keywords || []).filter((k) =>
          typeof k === "string" ? k !== term : !(k.term === term && k.mode === mode)
        ),
      })),
    });
  });
  if (filters.priceMin) {
    chips.push({
      key: "priceMin",
      label: `Min: ${filters.priceMin}`,
      type: "price",
      onRemove: () => setFilters((p) => ({ ...p, priceMin: "" })),
    });
  }
  if (filters.priceMax) {
    chips.push({
      key: "priceMax",
      label: `Max: ${filters.priceMax}`,
      type: "price",
      onRemove: () => setFilters((p) => ({ ...p, priceMax: "" })),
    });
  }
  if (filters.rating) {
    chips.push({
      key: "rating",
      label: `${filters.rating}`,
      icon: <Star size={11} className="fill-amber-400 text-amber-400" />,
      type: "rating",
      onRemove: () => setFilters((p) => ({ ...p, rating: null })),
    });
  }
  if (filters.category) {
    const parentCat = CATEGORIES.find((c) => c.id === filters.category);
    if (parentCat) {
      chips.push({
        key: `cat-${filters.category}`,
        label: parentCat.label,
        type: "category",
        onRemove: () =>
          setFilters((p) => ({ ...p, category: null, subcategory: null })),
      });
    }
  }
  if (filters.subcategory) {
    const parent = findParentCategory(filters.subcategory);
    const child = parent?.children?.find((ch) => ch.id === filters.subcategory);
    if (child) {
      chips.push({
        key: `subcat-${filters.subcategory}`,
        label: child.label,
        type: "category",
        onRemove: () =>
          setFilters((p) => ({ ...p, subcategory: null })),
      });
    }
  }
  filters.countries.forEach((code) => {
    const country = COUNTRIES.find((c) => c.code === code);
    if (country)
      chips.push({
        key: `country-${code}`,
        label: country.name,
        icon: <FlagImg code={code} size={16} />,
        type: "country",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            countries: p.countries.filter((c) => c !== code),
          })),
      });
  });
  filters.grades.forEach((gradeId) => {
    const grade = GRADES.find((g) => g.id === gradeId);
    if (grade)
      chips.push({
        key: `grade-${gradeId}`,
        label: grade.label,
        type: "grade",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            grades: p.grades.filter((g) => g !== gradeId),
          })),
      });
  });
  if (filters.dropshipping) {
    chips.push({
      key: "dropshipping",
      label: "Dropshipping",
      type: "dropshipping",
      onRemove: () => setFilters((p) => ({ ...p, dropshipping: false })),
    });
  }
  (filters.supplierTypes || []).forEach((btId) => {
    const bt = SUPPLIER_TYPES.find((b) => b.id === btId);
    if (bt)
      chips.push({
        key: `bt-${btId}`,
        label: bt.label,
        type: "supplierType",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            supplierTypes: (p.supplierTypes || []).filter((b) => b !== btId),
          })),
      });
  });
  (filters.buyerTypes || []).forEach((btId) => {
    const bt = BUYER_TYPES.find((b) => b.id === btId);
    if (bt)
      chips.push({
        key: `buyer-${btId}`,
        label: bt.label,
        type: "buyerType",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            buyerTypes: (p.buyerTypes || []).filter((b) => b !== btId),
          })),
      });
  });

  if (chips.length === 0) return null;

  const chipColors = {
    keyword: "bg-blue-50 text-blue-700 border-blue-200",
    price: "bg-cyan-50 text-cyan-700 border-cyan-200",
    rating: "bg-amber-50 text-amber-700 border-amber-200",
    category: "bg-emerald-50 text-emerald-700 border-emerald-200",
    country: "bg-orange-50 text-orange-700 border-orange-200",
    grade: "bg-rose-50 text-rose-700 border-rose-200",
    dropshipping: "bg-teal-50 text-teal-700 border-teal-200",
    supplierType: "bg-rose-50 text-rose-700 border-rose-200",
    buyerType: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={`inline-flex items-center gap-0 rounded-md text-xs font-medium border overflow-hidden ${chipColors[chip.type]}`}
        >
          {chip.prefix && (
            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-l-md">
              {chip.prefix}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${chip.prefix ? "pl-2" : ""}`}>
            {chip.icon}
            {chip.label}
            <button
              onClick={chip.onRemove}
              className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
              aria-label={`Remove ${chip.label} filter`}
            >
              <X size={9} />
            </button>
          </span>
        </span>
      ))}
      <button
        onClick={() =>
          setFilters({
            rating: null,
            category: null,
            subcategory: null,
            priceMin: "",
            priceMax: "",
            countries: [],
            dropshipping: false,
            grades: [],
            supplierTypes: [],
            keywords: [],
          })
        }
        className="text-xs text-red-500 hover:text-red-600 font-semibold ml-1"
      >
        Clear All
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FAVOURITE + SUBSCRIBE BUTTONS
   ═══════════════════════════════════════════════════ */
function FavouriteSubscribeButtons() {
  const { isLoggedIn } = useDemoAuth();
  const [faved, setFaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null); // "fav" | "sub" | null
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

  const handleFav = () => {
    if (!isLoggedIn) { openRegisterModal(); return; }
    if (faved) {
      // Unfavouriting also unsubscribes
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
            : (subscribed ? "Unsubscribe from email alerts" : "Get email alerts when new deals match your filters")}
          {/* Arrow pointing right */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-white" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-px w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-slate-200 -z-10" />
        </div>
      )}

      {/* Pill container — subscribe expands to the left, favourite stays on right */}
      <div className="inline-flex items-center border border-slate-200 rounded-full transition-all duration-300">
        {/* Subscribe half — slides in to the left when faved */}
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

        {/* Favourite half — always visible on the right */}
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
   SEARCH TOOLBAR — sits atop the content grid
   ═══════════════════════════════════════════════════ */
function SearchToolbar({
  title,
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
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // preferred: the most useful default direction — its arrow renders first (left) and darker
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

  // Derive current metric and direction from sortBy value (e.g. "markup-desc" → metric:"markup", dir:"desc")
  const activeMetric = sortBy === "best-match" ? "best-match" : sortBy.replace(/-(asc|desc)$/, "");
  const activeDir = sortBy === "best-match" ? null : sortBy.endsWith("-asc") ? "asc" : "desc";

  // For the button label, build a readable string
  const activeSortLabel = (() => {
    const m = sortMetrics.find((s) => s.key === activeMetric);
    if (!m) return "Best Match";
    if (!m.hasDirection) return m.label;
    return `${m.label} ${activeDir === "asc" ? "\u2191" : "\u2193"}`;
  })();

  return (
    <div className="space-y-3">
      {/* Title Row + Follow */}
      <div className="flex gap-4">
        {/* Left: title + description */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-slate-900">{title} <span className="text-base font-semibold text-slate-400">({totalCount.toLocaleString()} deals)</span></h1>
          <h2 className="text-sm font-normal text-slate-500 mt-1 leading-relaxed">
            Discover in used and wholesale suppliers that fit your business needs. Find top-quality accessories, made-to-measure goods for brand and own-brand products at competitive wholesale prices. We connect you with reliable UK-based sources to optimise your inventory and{" "}
            {descExpanded ? (
              <>
                maximise profits. Our comprehensive database is updated daily with fresh wholesale deals from verified suppliers across the UK, Europe, and beyond. Whether you&apos;re sourcing consumer electronics, health &amp; beauty products, clothing, or home goods, our platform gives you the competitive edge you need to grow your reselling business.{" "}
                <button onClick={() => setDescExpanded(false)} className="text-orange-500 hover:text-orange-600 font-medium">Show Less</button>
              </>
            ) : (
              <button onClick={() => setDescExpanded(true)} className="text-orange-500 hover:text-orange-600 font-medium">Show More</button>
            )}
          </h2>
        </div>
        {/* Right: Favourite + Subscribe buttons */}
        <FavouriteSubscribeButtons />
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
            <ChevronDown
              size={12}
              className={`text-slate-400 transition-transform ${
                sortOpen ? "rotate-180" : ""
              }`}
            />
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
   PAGINATION
   ═══════════════════════════════════════════════════ */
function Pagination({ total, page, setPage, perPage, setPerPage, buildPageHref }) {
  const totalPages = Math.ceil(total / perPage);
  const [goToPage, setGoToPage] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick = (e, newPage) => {
    e.preventDefault();
    setPage(newPage);
    scrollToTop();
  };

  const handleGoTo = () => {
    const p = parseInt(goToPage);
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      setGoToPage("");
      scrollToTop();
    }
  };

  const pageHref = (n) => (buildPageHref ? buildPageHref(n) : "#");

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-5 border-t border-slate-100">
      {/* Left: Total + Per Page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          Total deals: <strong className="text-slate-700">{total.toLocaleString()}</strong>
        </span>
        <div className="relative inline-flex items-center">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
              scrollToTop();
            }}
            aria-label="Results per page"
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:border-orange-300 outline-none cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)]"
          >
            {[9, 18, 27, 36].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Right: Page Navigation */}
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <a
            href={pageHref(page - 1)}
            onClick={(e) => handlePageClick(e, Math.max(1, page - 1))}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </a>
        ) : (
          <span className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 opacity-40 cursor-default" aria-disabled="true">
            <ChevronLeft size={16} />
          </span>
        )}

        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (page <= 3) {
            pageNum = i + 1;
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = page - 2 + i;
          }
          const isCurrent = page === pageNum;
          return isCurrent ? (
            <span
              key={pageNum}
              className="w-9 h-9 rounded-lg text-sm font-semibold bg-orange-500 text-white shadow-sm flex items-center justify-center"
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <a
              key={pageNum}
              href={pageHref(pageNum)}
              onClick={(e) => handlePageClick(e, pageNum)}
              className="w-9 h-9 rounded-lg text-sm font-semibold bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm transition-all flex items-center justify-center"
            >
              {pageNum}
            </a>
          );
        })}

        {page < totalPages ? (
          <a
            href={pageHref(page + 1)}
            onClick={(e) => handlePageClick(e, Math.min(totalPages, page + 1))}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </a>
        ) : (
          <span className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 opacity-40 cursor-default" aria-disabled="true">
            <ChevronRight size={16} />
          </span>
        )}

        {/* Go To */}
        <div className="flex items-center gap-1.5 ml-3">
          <span className="text-sm text-slate-400">Go to</span>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
            placeholder="Page"
            className="w-20 px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg text-center tabular-nums focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRENDING BANNER — "Trending Deals" section header
   ═══════════════════════════════════════════════════ */
function TrendingBanner() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 mb-4">
      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
        <Flame size={16} className="text-orange-500" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-800">
          Trending Deals (Top Selling This Week)
        </h3>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLACEHOLDER DEAL CARD — for demo layout
   ═══════════════════════════════════════════════════ */
function PlaceholderDealCard({ index }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all group">
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
        <Tag size={32} className="text-slate-200" />
      </div>
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-orange-600">£18.95</span>
          <span className="text-[10px] text-slate-400">ex.VAT</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full w-3/4 mb-1.5" />
        <div className="h-2.5 bg-slate-100 rounded-full w-1/2 mb-3" />
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
            201.8%
          </span>
          <span className="text-[10px] text-slate-400">markup</span>
        </div>
      </div>
    </div>
  );
}

/* ── Named Exports for reuse in other pages ── */
export { FilterSidebar, SearchToolbar, Pagination, ActiveFilterChips, TrendingBanner, PlaceholderDealCard, StarRating };

/* ═══════════════════════════════════════════════════
   DEPRECATED — Standalone /filters demo page removed.
   Filters are integrated into /deals and /suppliers.
   Kept as no-op default export for any stale imports.
   ═══════════════════════════════════════════════════ */
export default function Phase2FilterSidebar() {
  return null;
}
