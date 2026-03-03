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

/* ─────────── Flag Emoji Helper ─────────── */
// Flat flag images via flagcdn.com — ISO 3166-1 alpha-2 lowercase codes
const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", AU: "au" };
function FlagImg({ code, size = 20 }) {
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}
// Backwards-compat: FLAGS object now returns JSX
const FLAGS = Object.fromEntries(
  Object.keys(FLAG_CODES).map((k) => [k, <FlagImg key={k} code={k} size={18} />])
);

/* ─────────── Mock Data ─────────── */
const POPULAR_SEARCHES = [
  "Sony Xperia",
  "Samsung Galaxy",
  "Lloytron Active",
  "Lamp",
  "Oral-B",
  "Adidas",
  "Nike",
];

const CATEGORIES = [
  {
    id: "baby-products", label: "Baby Products", count: 4691,
    children: [
      { id: "baby-clothing-shoes", label: "Clothing & Shoes", count: 1200 },
      { id: "baby-feeding-nursing", label: "Feeding & Nursing", count: 834 },
      { id: "baby-toys-activity", label: "Toys & Activity", count: 1502 },
      { id: "baby-pushchairs-prams", label: "Pushchairs & Prams", count: 389 },
      { id: "baby-safety-health", label: "Safety & Health", count: 766 },
    ],
  },
  {
    id: "clothing", label: "Clothing", count: 14672,
    children: [
      { id: "clothing-mens", label: "Men's Clothing", count: 3845 },
      { id: "clothing-womens", label: "Women's Clothing", count: 5062 },
      { id: "clothing-childrens", label: "Children's Clothing", count: 2280 },
      { id: "clothing-sportswear", label: "Sportswear", count: 1519 },
      { id: "clothing-accessories", label: "Accessories", count: 1966 },
    ],
  },
  {
    id: "computing", label: "Computing", count: 2483,
    children: [
      { id: "computing-laptops", label: "Laptops & Notebooks", count: 618 },
      { id: "computing-desktops", label: "Desktop PCs", count: 270 },
      { id: "computing-tablets", label: "Tablets", count: 412 },
      { id: "computing-components", label: "Components", count: 724 },
      { id: "computing-peripherals", label: "Peripherals", count: 459 },
    ],
  },
  {
    id: "consumer-electronic", label: "Consumer Electronic", count: 3590,
    children: [
      { id: "ce-tv-cinema", label: "TV & Home Cinema", count: 914 },
      { id: "ce-audio-hifi", label: "Audio & HiFi", count: 569 },
      { id: "ce-cameras", label: "Cameras & Camcorders", count: 406 },
      { id: "ce-smart-home", label: "Smart Home", count: 811 },
      { id: "ce-wearable", label: "Wearable Tech", count: 890 },
    ],
  },
  {
    id: "health-beauty", label: "Health & Beauty", count: 5467,
    children: [
      { id: "hb-supplements", label: "Diet, Supplements, & Vitamins", count: 612 },
      { id: "hb-hair-skin", label: "Hair & Skin Care", count: 834 },
      { id: "hb-makeup", label: "Makeup & Cosmetics", count: 923 },
      { id: "hb-manicure", label: "Manicure & Pedicure", count: 410 },
      { id: "hb-natural", label: "Natural & Alternative Therapy", count: 389 },
      { id: "hb-perfumes", label: "Perfumes & Fragrances", count: 1290 },
      { id: "hb-personal", label: "Personal Care", count: 1009 },
    ],
  },
  {
    id: "home-garden", label: "Home & Garden", count: 9210,
    children: [
      { id: "hg-furniture", label: "Furniture", count: 2220 },
      { id: "hg-kitchen", label: "Kitchen & Dining", count: 1812 },
      { id: "hg-bedding", label: "Bedding & Linen", count: 1405 },
      { id: "hg-garden-tools", label: "Garden Tools", count: 1093 },
      { id: "hg-decor", label: "Home Decor", count: 2680 },
    ],
  },
  {
    id: "jewellery-watches", label: "Jewellery & Watches", count: 3178,
    children: [
      { id: "jw-rings", label: "Rings", count: 715 },
      { id: "jw-necklaces", label: "Necklaces", count: 612 },
      { id: "jw-watches", label: "Watches", count: 920 },
      { id: "jw-earrings", label: "Earrings", count: 438 },
      { id: "jw-bracelets", label: "Bracelets", count: 493 },
    ],
  },
  {
    id: "leisure-entertainment", label: "Leisure & Entertainment", count: 2890,
    children: [
      { id: "le-books", label: "Books & Magazines", count: 507 },
      { id: "le-dvds", label: "DVDs & Blu-ray", count: 304 },
      { id: "le-musical", label: "Musical Instruments", count: 416 },
      { id: "le-board-games", label: "Board Games", count: 789 },
      { id: "le-arts-crafts", label: "Arts & Crafts", count: 874 },
    ],
  },
  {
    id: "mobile-phones", label: "Mobile & Home Phones", count: 4267,
    children: [
      { id: "mp-smartphones", label: "Smartphones", count: 1320 },
      { id: "mp-cases", label: "Phone Cases", count: 1145 },
      { id: "mp-chargers", label: "Chargers & Cables", count: 728 },
      { id: "mp-screen", label: "Screen Protectors", count: 415 },
      { id: "mp-headphones", label: "Headphones", count: 659 },
    ],
  },
  {
    id: "office-business", label: "Office & Business", count: 1897,
    children: [
      { id: "ob-supplies", label: "Office Supplies", count: 618 },
      { id: "ob-printers", label: "Printers & Ink", count: 207 },
      { id: "ob-furniture", label: "Office Furniture", count: 345 },
      { id: "ob-filing", label: "Filing & Storage", count: 412 },
      { id: "ob-presentation", label: "Presentation", count: 315 },
    ],
  },
  {
    id: "police-auctions", label: "Police Auctions & Auction Houses", count: 823,
    children: [
      { id: "pa-lost-property", label: "Lost Property", count: 204 },
      { id: "pa-seized", label: "Seized Goods", count: 286 },
      { id: "pa-unclaimed", label: "Unclaimed Parcels", count: 173 },
      { id: "pa-surplus", label: "Government Surplus", count: 160 },
    ],
  },
  {
    id: "sports-fitness", label: "Sports & Fitness", count: 3543,
    children: [
      { id: "sf-gym", label: "Gym Equipment", count: 811 },
      { id: "sf-outdoor", label: "Outdoor Sports", count: 914 },
      { id: "sf-team", label: "Team Sports", count: 608 },
      { id: "sf-cycling", label: "Cycling", count: 546 },
      { id: "sf-swimming", label: "Swimming", count: 664 },
    ],
  },
  {
    id: "surplus-stocklots", label: "Surplus & Stocklots", count: 6312,
    children: [
      { id: "ss-mixed", label: "Mixed Pallets", count: 907 },
      { id: "ss-returns", label: "Customer Returns", count: 1412 },
      { id: "ss-end-of-line", label: "End of Line", count: 1089 },
      { id: "ss-overstock", label: "Overstock", count: 1615 },
      { id: "ss-clearance", label: "Clearance", count: 1289 },
    ],
  },
  {
    id: "toys-games", label: "Toys & Games", count: 3498,
    children: [
      { id: "tg-action", label: "Action Figures", count: 608 },
      { id: "tg-building", label: "Building Toys", count: 812 },
      { id: "tg-dolls", label: "Dolls", count: 406 },
      { id: "tg-educational", label: "Educational Toys", count: 915 },
      { id: "tg-outdoor", label: "Outdoor Toys", count: 757 },
    ],
  },
];

// Helper: get all child IDs for a parent category
function getChildIds(parentId) {
  const parent = CATEGORIES.find((c) => c.id === parentId);
  return parent?.children?.map((ch) => ch.id) || [];
}

// Helper: find parent category for a given child ID
function findParentCategory(childId) {
  return CATEGORIES.find((c) => c.children?.some((ch) => ch.id === childId));
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

const COUNTRIES = [
  { code: "UK", name: "United Kingdom", count: 105247 },
  { code: "DE", name: "Germany", count: 4757 },
  { code: "PL", name: "Poland", count: 3923 },
  { code: "NL", name: "Netherlands", count: 3872 },
  { code: "US", name: "United States", count: 3841 },
  { code: "ES", name: "Spain", count: 3015 },
  { code: "IT", name: "Italy", count: 2530 },
  { code: "FR", name: "France", count: 1890 },
];

const GRADES = [
  { id: "new", label: "New" },
  { id: "used", label: "Used" },
  { id: "returns", label: "Returns / Mixed Stock" },
  { id: "liquidation", label: "Liquidation Stocklots" },
  { id: "refurbished", label: "Refurbished" },
];

const BUSINESS_TYPES = [
  { id: "wholesalers", label: "Wholesalers" },
  { id: "distributors", label: "Distributors" },
  { id: "importers", label: "Importers" },
  { id: "manufacturers", label: "Manufacturers" },
  { id: "dropshippers", label: "Dropshippers" },
  { id: "liquidators", label: "Liquidators" },
  { id: "agents", label: "Agents" },
  { id: "trading-companies", label: "Trading Companies" },
  { id: "other", label: "Other Suppliers" },
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

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left group"
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
      {open && <div className="px-4 pb-3.5">{children}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STAR RATING DISPLAY
   ═══════════════════════════════════════════════════ */
function StarRating({ rating, size = 12 }) {
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
              : "text-slate-200"
          }
        />
      ))}
    </div>
  );
}

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
        <span className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${highlighted ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-400"}`}>
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
const PRICE_MAX = 10000;

function PriceRangeSlider({ filters, setFilters }) {
  const minVal = filters.priceMin === "" ? PRICE_MIN : Number(filters.priceMin);
  const maxVal = filters.priceMax === "" ? PRICE_MAX : Number(filters.priceMax);
  const trackRef = useRef(null);

  const getPercent = useCallback((val) =>
    ((val - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  , []);

  const handleMinInput = (e) => {
    const val = e.target.value === "" ? "" : Math.min(Number(e.target.value), maxVal - 1);
    setFilters((p) => ({ ...p, priceMin: val === "" ? "" : String(val) }));
  };

  const handleMaxInput = (e) => {
    const val = e.target.value === "" ? "" : Math.max(Number(e.target.value), minVal + 1);
    setFilters((p) => ({ ...p, priceMax: val === "" ? "" : String(val) }));
  };

  const handleMinRange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 1);
    setFilters((p) => ({ ...p, priceMin: String(val) }));
  };

  const handleMaxRange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 1);
    setFilters((p) => ({ ...p, priceMax: String(val) }));
  };

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div>
      {/* Min / Max inputs */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1 block">Min.</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={handleMinInput}
            placeholder="0"
            min={PRICE_MIN}
            max={PRICE_MAX}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums"
          />
        </div>
        <span className="text-slate-300 mt-4">–</span>
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase mb-1 block">Max.</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={handleMaxInput}
            placeholder="10000"
            min={PRICE_MIN}
            max={PRICE_MAX}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums"
          />
        </div>
      </div>

      {/* Dual range slider */}
      <div className="relative h-5 flex items-center" ref={trackRef}>
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
function FilterSidebar({ filters, setFilters, isOpen, onClose, hideRating = false, hidePrice = false, hideDropshipping = false, hideGrade = false, showBusinessType = false }) {
  const [categorySearch, setCategorySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const filteredCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(categorySearch.toLowerCase())
  );
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
                businessTypes: [],
                keyword: "",
              })
            }
            className="text-xs text-orange-500 hover:text-orange-600 font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
          >
            <X size={14} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-none custom-scrollbar">
        {/* ── Popular Searches ── */}
        <FilterSection title="Popular Searches">
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => setFilters((p) => ({ ...p, keyword: term }))}
                className={`px-2.5 py-1.5 text-xs rounded-lg border transition-all ${
                  filters.keyword === term
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* ── Rating ── */}
        {!hideRating && (
        <FilterSection
          title="Rating"
          onClear={filters.rating ? () => setFilters((p) => ({ ...p, rating: null })) : undefined}
        >
          <div className="space-y-0.5">
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
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all"
            />
          </div>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setFilters((p) => ({
                    ...p,
                    category: p.category === cat.id ? null : cat.id,
                    subcategory: p.category === cat.id ? null : p.subcategory,
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
            ))}
          </div>
        </FilterSection>

        {/* ── Price Range ── */}
        {!hidePrice && (
          <FilterSection title="Price">
            <PriceRangeSlider filters={filters} setFilters={setFilters} />
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
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all"
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
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  filters.dropshipping ? "bg-orange-500" : "bg-slate-200"
                }`}
                onClick={() =>
                  setFilters((p) => ({ ...p, dropshipping: !p.dropshipping }))
                }
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                    filters.dropshipping ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-slate-600">Dropshipped Deals</span>
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

        {/* ── Business Type ── */}
        {showBusinessType && (
          <FilterSection
            title="Business Type"
            onClear={
              (filters.businessTypes?.length > 0)
                ? () => setFilters((p) => ({ ...p, businessTypes: [] }))
                : undefined
            }
          >
            <div className="space-y-0.5">
              {BUSINESS_TYPES.map((bt) => (
                <CheckboxItem
                  key={bt.id}
                  id={`bt-${bt.id}`}
                  label={bt.label}
                  checked={(filters.businessTypes || []).includes(bt.id)}
                  onChange={() => toggleArrayFilter("businessTypes", bt.id)}
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
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Find unbeatable deals on high-quality clothing and fashion items,
            including trendy apparel, footwear, accessories, and seasonal
            collections.
          </p>
        </div>
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

  if (filters.keyword) {
    chips.push({
      key: "keyword",
      label: filters.keyword,
      type: "keyword",
      prefix: searchMode === "exact" ? "exact:" : searchMode === "all" ? "all:" : null,
      onRemove: () => setFilters((p) => ({ ...p, keyword: "" })),
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
  (filters.businessTypes || []).forEach((btId) => {
    const bt = BUSINESS_TYPES.find((b) => b.id === btId);
    if (bt)
      chips.push({
        key: `bt-${btId}`,
        label: bt.label,
        type: "businessType",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            businessTypes: (p.businessTypes || []).filter((b) => b !== btId),
          })),
      });
  });

  if (chips.length === 0) return null;

  const chipColors = {
    keyword: "bg-violet-100 text-violet-700 border-violet-200",
    rating: "bg-amber-50 text-amber-700 border-amber-200",
    category: "bg-emerald-50 text-emerald-700 border-emerald-200",
    country: "bg-orange-50 text-orange-700 border-orange-200",
    grade: "bg-orange-50 text-orange-700 border-orange-200",
    dropshipping: "bg-indigo-50 text-indigo-700 border-indigo-200",
    businessType: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={`inline-flex items-center gap-0 rounded-full text-xs font-medium border overflow-hidden ${chipColors[chip.type]}`}
        >
          {chip.prefix && (
            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-l-full">
              {chip.prefix}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${chip.prefix ? "pl-2" : ""}`}>
            {chip.icon}
            {chip.label}
            <button
              onClick={chip.onRemove}
              className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
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
            businessTypes: [],
            keyword: "",
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
  const [faved, setFaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null); // "fav" | "sub" | null

  const handleFav = () => {
    if (faved) {
      // Unfavouriting also unsubscribes
      setFaved(false);
      setSubscribed(false);
    } else {
      setFaved(true);
    }
  };

  const handleSub = () => {
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

  const sortOptions = [
    { value: "latest", label: "Latest Date of Publication" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  return (
    <div className="space-y-3">
      {/* Title Row + Follow */}
      <div className="flex gap-4">
        {/* Left: title + description */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-slate-900">{title} <span className="text-base font-semibold text-slate-400">({totalCount.toLocaleString()} deals)</span></h1>
          <h2 className="text-[15px] font-normal text-slate-500 mt-1 leading-relaxed">
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
                setFilters((p) => ({ ...p, keyword: inlineSearch.trim() }));
              }
            }}
            placeholder="Search within these results..."
            className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
          <button
            onClick={() => {
              if (inlineSearch.trim()) {
                setFilters((p) => ({ ...p, keyword: inlineSearch.trim() }));
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
          >
            <ArrowUpDown size={14} />
            <span className="hidden sm:inline text-xs font-medium">Sort:</span>
            <span className="text-xs font-semibold text-slate-800 max-w-[140px] truncate">
              {sortOptions.find((o) => o.value === sortBy)?.label}
            </span>
            <ChevronDown
              size={12}
              className={`text-slate-400 transition-transform ${
                sortOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 min-w-[220px]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                    sortBy === opt.value
                      ? "bg-orange-50 text-orange-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
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
function Pagination({ total, page, setPage, perPage, setPerPage }) {
  const totalPages = Math.ceil(total / perPage);
  const [goToPage, setGoToPage] = useState("");

  const handleGoTo = () => {
    const p = parseInt(goToPage);
    if (p >= 1 && p <= totalPages) {
      setPage(p);
      setGoToPage("");
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 py-5 border-t border-slate-100">
      {/* Left: Total + Per Page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          Total deals: <strong className="text-slate-700">{total.toLocaleString()}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-600 focus:border-orange-300 outline-none cursor-pointer"
          >
            {[9, 18, 27, 36].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

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
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                page === pageNum
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:shadow-sm"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        {/* Go To */}
        <div className="flex items-center gap-1.5 ml-3">
          <span className="text-sm text-slate-400">Go to</span>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
            placeholder="Page"
            className="w-20 px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg text-center tabular-nums focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none"
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
   MAIN DEMO — Phase 2 Full Layout
   ═══════════════════════════════════════════════════ */
export default function Phase2FilterSidebar() {
  const [filters, setFilters] = useState({
    rating: null,
    category: null,
    subcategory: null,
    priceMin: "",
    priceMax: "",
    countries: [],
    dropshipping: false,
    grades: [],
    businessTypes: [],
    keyword: "",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("deals"); // deals or suppliers

  // Count active filters for the badge
  const activeFilterCount =
    (filters.rating ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    filters.countries.length +
    filters.grades.length +
    (filters.businessTypes || []).length +
    (filters.dropshipping ? 1 : 0) +
    (filters.keyword ? 1 : 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0);

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}
    >
      {/* Simple Header for Demo */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
              <Tag size={14} className="text-white" />
            </div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Wholesale<span className="text-orange-500">Up</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("deals")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "deals"
                  ? "bg-orange-100 text-orange-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Deals View
            </button>
            <button
              onClick={() => setViewMode("suppliers")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "suppliers"
                  ? "bg-orange-100 text-orange-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Suppliers View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Phase Info Banner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
            <SlidersHorizontal size={18} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-800">
              Phase 2 — Filter Sidebar + Toolbar + Pagination
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All filter sections are interactive. Try selecting filters to see
              chips appear, change sort order, toggle mobile filter view, and
              navigate pages.
              {activeFilterCount > 0 && (
                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">
                  {activeFilterCount} active filter
                  {activeFilterCount !== 1 && "s"}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex gap-6 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <SearchToolbar
              title={
                viewMode === "deals" ? "Deals" : "Wholesale Suppliers"
              }
              totalCount={4691}
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              inlineSearch={inlineSearch}
              setInlineSearch={setInlineSearch}
              onToggleMobileFilter={() =>
                setMobileFilterOpen(!mobileFilterOpen)
              }
            />

            {/* Trending Banner */}
            <div className="mt-4">
              <TrendingBanner />
            </div>

            {/* Content Grid — Placeholder cards */}
            <div
              className={
                viewMode === "deals"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {viewMode === "deals" ? (
                Array.from({ length: perPage }, (_, i) => (
                  <PlaceholderDealCard key={i} index={i} />
                ))
              ) : (
                Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-orange-200 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <Tag size={24} className="text-slate-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800">
                            Supplier Name Placeholder
                          </h3>
                          <FlagImg code="UK" size={16} />
                          <span className="text-xs text-slate-500">
                            United Kingdom
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <StarRating rating={5} size={11} />
                          <span className="text-xs text-slate-400 ml-1">
                            5.0
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full w-full mb-1.5" />
                        <div className="h-2.5 bg-slate-100 rounded-full w-3/4 mb-1.5" />
                        <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                            Call Now
                          </button>
                          <button className="px-3 py-1.5 text-xs font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                            Send Enquiry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <Pagination
              total={897}
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
            />
          </div>
        </div>
      </div>

      {/* Mobile filter overlay backdrop */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}

      <style>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.7); }
      `}</style>
    </div>
  );
}
