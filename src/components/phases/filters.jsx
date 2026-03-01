"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  SlidersHorizontal,
  Minus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  Flame,
  Info,
} from "lucide-react";

/* ─────────── Flag Emoji Helper ─────────── */
const FLAGS = {
  UK: "🇬🇧",
  DE: "🇩🇪",
  PL: "🇵🇱",
  NL: "🇳🇱",
  US: "🇺🇸",
  ES: "🇪🇸",
  IT: "🇮🇹",
  FR: "🇫🇷",
  AU: "🇦🇺",
};

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
  { id: "apparel", label: "Apparel & Clothing", count: 1245 },
  { id: "baby", label: "Baby Products", count: 423 },
  { id: "business", label: "Business Supplies & Services", count: 897 },
  { id: "computers", label: "Computer & Software", count: 634 },
  { id: "electrical", label: "Electrical & Lighting", count: 521 },
  { id: "floral", label: "Floral & Garden", count: 189 },
  { id: "food", label: "Food & Drink", count: 312 },
  { id: "gifts", label: "Gifts & Giftware", count: 456 },
  { id: "health", label: "Health & Beauty", count: 789 },
  { id: "home", label: "Home Supplies", count: 654 },
  { id: "jewellery", label: "Jewellery & Watches", count: 378 },
  { id: "sports", label: "Sports, Hobbies & Leisure", count: 543 },
  { id: "telephony", label: "Telephony & Mobile Phones", count: 267 },
  { id: "toys", label: "Toys & Games", count: 498 },
  { id: "travel", label: "Travel & Outdoors", count: 321 },
];

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
function CheckboxItem({ id, label, count, checked, onChange, prefix }) {
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
      <span className="text-sm text-slate-600 group-hover:text-slate-900 flex-1 truncate">
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400 tabular-nums">
          {count.toLocaleString()}
        </span>
      )}
    </label>
  );
}

/* ═══════════════════════════════════════════════════
   FILTER SIDEBAR
   ═══════════════════════════════════════════════════ */
function FilterSidebar({ filters, setFilters, isOpen, onClose }) {
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
        w-72 shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden
        lg:block
        ${isOpen ? "fixed inset-0 z-50 w-full max-w-sm rounded-none lg:relative lg:w-72 lg:max-w-none lg:rounded-xl" : "hidden lg:block"}
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
                categories: [],
                priceMin: "",
                priceMax: "",
                countries: [],
                dropshipping: false,
                grades: [],
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

      <div className="overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-none">
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
        <FilterSection
          title="Rating"
          onClear={filters.rating ? () => setFilters((p) => ({ ...p, rating: null })) : undefined}
        >
          <div className="space-y-1.5">
            {RATINGS.map((r) => (
              <label
                key={r.value}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                  filters.rating === r.value
                    ? "bg-orange-50 border border-orange-200"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === r.value}
                  onChange={() =>
                    setFilters((p) => ({
                      ...p,
                      rating: p.rating === r.value ? null : r.value,
                    }))
                  }
                  className="w-3.5 h-3.5 text-orange-500 focus:ring-orange-400 focus:ring-offset-0"
                />
                <StarRating rating={r.value} />
                <span className="text-xs text-slate-500 font-medium">
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* ── Categories ── */}
        <FilterSection
          title="Categories"
          onClear={
            filters.categories.length > 0
              ? () => setFilters((p) => ({ ...p, categories: [] }))
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
              <CheckboxItem
                key={cat.id}
                id={`cat-${cat.id}`}
                label={cat.label}
                count={cat.count}
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggleArrayFilter("categories", cat.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* ── Price Range ── */}
        <FilterSection title="Price">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, priceMin: e.target.value }))
                }
                placeholder="Min."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums"
              />
            </div>
            <Minus size={14} className="text-slate-300 shrink-0" />
            <div className="relative flex-1">
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, priceMax: e.target.value }))
                }
                placeholder="Max."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none transition-all tabular-nums"
              />
            </div>
          </div>
        </FilterSection>

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
          <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1">
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

        {/* ── Grade ── */}
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
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   ACTIVE FILTER CHIPS
   ═══════════════════════════════════════════════════ */
function ActiveFilterChips({ filters, setFilters }) {
  const chips = [];

  if (filters.keyword) {
    chips.push({
      key: "keyword",
      label: filters.keyword,
      type: "keyword",
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
  filters.categories.forEach((catId) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat)
      chips.push({
        key: `cat-${catId}`,
        label: cat.label,
        type: "category",
        onRemove: () =>
          setFilters((p) => ({
            ...p,
            categories: p.categories.filter((c) => c !== catId),
          })),
      });
  });
  filters.countries.forEach((code) => {
    const country = COUNTRIES.find((c) => c.code === code);
    if (country)
      chips.push({
        key: `country-${code}`,
        label: country.name,
        icon: <span className="text-xs">{FLAGS[code]}</span>,
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

  if (chips.length === 0) return null;

  const chipColors = {
    keyword: "bg-violet-100 text-violet-700 border-violet-200",
    rating: "bg-amber-50 text-amber-700 border-amber-200",
    category: "bg-emerald-50 text-emerald-700 border-emerald-200",
    country: "bg-orange-50 text-orange-700 border-orange-200",
    grade: "bg-orange-50 text-orange-700 border-orange-200",
    dropshipping: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${chipColors[chip.type]}`}
        >
          {chip.icon}
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 w-3.5 h-3.5 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
          >
            <X size={9} />
          </button>
        </span>
      ))}
      <button
        onClick={() =>
          setFilters({
            rating: null,
            categories: [],
            priceMin: "",
            priceMax: "",
            countries: [],
            dropshipping: false,
            grades: [],
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
}) {
  const [sortOpen, setSortOpen] = useState(false);
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
      {/* Title Row */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            ({totalCount.toLocaleString()} deals)
          </p>
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
            placeholder="Search within results..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilter}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filter
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
      <ActiveFilterChips filters={filters} setFilters={setFilters} />
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
    <div className="flex items-center justify-between flex-wrap gap-3 py-4 border-t border-slate-100">
      {/* Left: Total + Per Page */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">
          Total deals: <strong className="text-slate-700">{total.toLocaleString()}</strong>
        </span>
        <div className="flex items-center gap-1.5">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 focus:border-orange-300 outline-none cursor-pointer"
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
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft size={14} />
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
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                page === pageNum
                  ? "bg-orange-500 text-white shadow-sm"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
        >
          <ChevronRight size={14} />
        </button>

        {/* Go To */}
        <div className="flex items-center gap-1.5 ml-3">
          <span className="text-xs text-slate-400">Go to</span>
          <input
            type="number"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGoTo()}
            placeholder="Page"
            className="w-14 px-2 py-1.5 text-xs border border-slate-200 rounded-lg text-center tabular-nums focus:border-orange-300 focus:ring-1 focus:ring-orange-100 outline-none"
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

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 2 Full Layout
   ═══════════════════════════════════════════════════ */
export default function Phase2FilterSidebar() {
  const [filters, setFilters] = useState({
    rating: null,
    categories: [],
    priceMin: "",
    priceMax: "",
    countries: [],
    dropshipping: false,
    grades: [],
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
    filters.categories.length +
    filters.countries.length +
    filters.grades.length +
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
                          <span className="text-xs">🇬🇧</span>
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
