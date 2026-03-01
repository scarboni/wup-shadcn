"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Heart,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Flame,
  Star,
  Eye,
  ExternalLink,
  ArrowRight,
  ShoppingCart,
  AlertTriangle,
  SlidersHorizontal,
  Search,
  ArrowUpDown,
  ChevronDown,
  Minus,
  ChevronUp,
  X,
  Sparkles,
  Package,
  Truck,
  Shield,
  BadgeCheck,
} from "lucide-react";

/* ─────────── Mock Product Data ─────────── */
const PRODUCTS = [
  {
    id: 1,
    title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    price: 18.95,
    currency: "£",
    rrp: 59.99,
    rrpCurrency: "€",
    markup: 201.8,
    dateAdded: "19/09/2023",
    grade: "New",
    country: "UK",
    countryName: "United Kingdom",
    moq: 12,
    amazonPrice: 59.99,
    amazonProfit: 16.95,
    amazonSales: 35,
    ebayPrice: 59.99,
    ebayProfit: 16.95,
    ebaySales: 35,
    supplier: "Mobile Phones & Accessories Wholesaler",
    isExpired: false,
    isDropship: false,
    category: "Telephony & Mobile Phones",
  },
  {
    id: 2,
    title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm",
    image: "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop",
    price: 4.25,
    currency: "£",
    rrp: 24.99,
    rrpCurrency: "€",
    markup: 488.0,
    dateAdded: "15/10/2023",
    grade: "New",
    country: "UK",
    countryName: "United Kingdom",
    moq: 24,
    amazonPrice: 24.99,
    amazonProfit: 8.74,
    amazonSales: 52,
    ebayPrice: 22.5,
    ebayProfit: 7.25,
    ebaySales: 41,
    supplier: "Home & Garden Wholesale Ltd",
    isExpired: false,
    isDropship: true,
    category: "Home Supplies",
  },
  {
    id: 3,
    title: "Lloytron Active Indoor Loop TV Antenna 50db Black",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    price: 3.5,
    currency: "£",
    rrp: 19.99,
    rrpCurrency: "€",
    markup: 471.1,
    dateAdded: "22/08/2023",
    grade: "New",
    country: "DE",
    countryName: "Germany",
    moq: 50,
    amazonPrice: 19.99,
    amazonProfit: 6.49,
    amazonSales: 28,
    ebayPrice: 17.99,
    ebayProfit: 5.49,
    ebaySales: 19,
    supplier: "Electronics Direct Wholesale",
    isExpired: true,
    isDropship: false,
    category: "Electrical & Lighting",
  },
  {
    id: 4,
    title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    price: 12.5,
    currency: "£",
    rrp: 39.99,
    rrpCurrency: "€",
    markup: 219.9,
    dateAdded: "05/11/2023",
    grade: "New",
    country: "UK",
    countryName: "United Kingdom",
    moq: 6,
    amazonPrice: 39.99,
    amazonProfit: 12.49,
    amazonSales: 89,
    ebayPrice: 34.99,
    ebayProfit: 9.49,
    ebaySales: 67,
    supplier: "Health & Beauty Wholesale Co",
    isExpired: false,
    isDropship: true,
    category: "Health & Beauty",
  },
  {
    id: 5,
    title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400&h=400&fit=crop",
    price: 8.75,
    currency: "£",
    rrp: 29.99,
    rrpCurrency: "€",
    markup: 242.7,
    dateAdded: "01/12/2023",
    grade: "New",
    country: "NL",
    countryName: "Netherlands",
    moq: 10,
    amazonPrice: 29.99,
    amazonProfit: 9.24,
    amazonSales: 44,
    ebayPrice: 27.5,
    ebayProfit: 7.75,
    ebaySales: 31,
    supplier: "Sports & Leisure Distribution",
    isExpired: false,
    isDropship: false,
    category: "Sports, Hobbies & Leisure",
  },
  {
    id: 6,
    title: "Midnight Chronometer Crafted Precision Timeless Elegance Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    price: 228.04,
    currency: "€",
    rrp: 878.59,
    rrpCurrency: "€",
    markup: 285.3,
    dateAdded: "10/01/2024",
    grade: "New",
    country: "UK",
    countryName: "United Kingdom",
    moq: 3,
    amazonPrice: 799.99,
    amazonProfit: 285.95,
    amazonSales: 8,
    ebayPrice: 749.0,
    ebayProfit: 234.96,
    ebaySales: 5,
    supplier: "Luxury Goods Wholesale",
    isExpired: true,
    isDropship: false,
    category: "Jewellery & Watches",
  },
];

const FLAGS = { UK: "🇬🇧", DE: "🇩🇪", NL: "🇳🇱", US: "🇺🇸", PL: "🇵🇱", ES: "🇪🇸", IT: "🇮🇹", FR: "🇫🇷" };

/* ═══════════════════════════════════════════════════
   1. SIMPLE DEAL CARD — used in homepage "Latest deals" carousel
   ═══════════════════════════════════════════════════ */
function SimpleDealCard({ product, isPremium = false }) {
  const [hovered, setHovered] = useState(false);
  const [faved, setFaved] = useState(false);

  return (
    <a
      href={`/deal/${product.id}`}
      className="block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all duration-300 group w-[260px] shrink-0 snap-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={hovered && product.imageHover ? product.imageHover : product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isDropship && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm">
              DROPSHIP
            </span>
          )}
          {product.isExpired && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-md shadow-sm">
              EXPIRED
            </span>
          )}
        </div>
        {/* Favourite */}
        <button
          onClick={(e) => { e.preventDefault(); setFaved(!faved); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
        >
          <Heart size={14} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
        </button>
        {/* Price Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
          <span className="text-lg font-extrabold text-sky-600">{product.currency}{product.price.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400 ml-1">ex.VAT</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
          <Clock size={10} />
          Deal First Featured On: {product.dateAdded}
        </p>
        <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors min-h-[2.5rem]">
          {product.title}
        </h3>
        <div className="mt-3">
          <button
            className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
              isPremium
                ? "bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sm"
            }`}
          >
            {isPremium ? "View Deal" : "Join Now"}
          </button>
        </div>
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════
   2. DETAILED DEAL CARD — used in deals listing grid + "Hot Offers"
   ═══════════════════════════════════════════════════ */
function DetailedDealCard({ product, isPremium = false }) {
  const [hovered, setHovered] = useState(false);
  const [faved, setFaved] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 group ${
        product.isExpired
          ? "border-slate-200 opacity-75 hover:opacity-100"
          : "border-slate-200 hover:shadow-lg hover:border-sky-200"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <a href={`/deal/${product.id}`} className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img
          src={hovered && product.imageHover ? product.imageHover : product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Expired Overlay */}
        {product.isExpired && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 -rotate-6">
              <AlertTriangle size={16} />
              DEAL EXPIRED
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.isDropship && (
            <span className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm flex items-center gap-1">
              <Truck size={10} />
              DROPSHIP
            </span>
          )}
          <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
            {product.grade.toUpperCase()}
          </span>
        </div>

        {/* Favourite + Quick View */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); setFaved(!faved); }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
          >
            <Heart size={14} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100"
          >
            <Eye size={14} className="text-slate-400" />
          </button>
        </div>

        {/* Country + Markup Banner */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-2.5 px-3 flex items-end justify-between">
          <span className="flex items-center gap-1.5 text-white text-xs font-medium">
            <span>{FLAGS[product.country]}</span>
            {product.countryName}
          </span>
          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-md">
            {product.markup}%
          </span>
        </div>
      </a>

      {/* Content */}
      <div className="p-4">
        {/* Price Row */}
        <div className="flex items-baseline justify-between mb-1.5">
          <div>
            <span className="text-xl font-extrabold text-sky-600">
              {product.currency}{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 ml-1">ex.VAT</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400">RRP</span>
            <span className="text-sm font-semibold text-slate-500 ml-1 line-through">
              {product.rrpCurrency}{product.rrp.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Date */}
        <p className="text-[10px] text-slate-400 mb-2 flex items-center gap-1">
          <Clock size={10} />
          Deal First Featured On: {product.dateAdded}
        </p>

        {/* Title */}
        <a href={`/deal/${product.id}`}>
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-sky-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </a>

        {/* Profit Calculations */}
        <div className="mt-3 space-y-1.5">
          {/* Amazon */}
          <div className="flex items-center gap-2 px-2.5 py-2 bg-slate-50 rounded-lg">
            <div className="w-5 h-5 rounded bg-[#FF9900] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[8px]">a</span>
            </div>
            <div className="flex-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {product.rrpCurrency}{product.amazonPrice.toFixed(2)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-bold">
                Profit {product.rrpCurrency}{product.amazonProfit.toFixed(2)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 tabular-nums">/ {product.amazonSales}</span>
            </div>
          </div>
          {/* eBay */}
          <div className="flex items-center gap-2 px-2.5 py-2 bg-slate-50 rounded-lg">
            <div className="w-5 h-5 rounded bg-[#E53238] flex items-center justify-center shrink-0">
              <span className="text-white font-black text-[8px]">e</span>
            </div>
            <div className="flex-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {product.rrpCurrency}{product.ebayPrice.toFixed(2)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600 font-bold">
                Profit {product.rrpCurrency}{product.ebayProfit.toFixed(2)}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400 tabular-nums">/ {product.ebaySales}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-3.5">
          {product.isExpired ? (
            <div className="w-full py-2.5 rounded-lg text-xs font-bold text-center bg-slate-100 text-slate-400 cursor-not-allowed">
              Deal Expired
            </div>
          ) : isPremium ? (
            <a
              href={`/deal/${product.id}`}
              className="block w-full py-2.5 rounded-lg text-xs font-bold text-center bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-all"
            >
              View Full Details
            </a>
          ) : (
            <a
              href="/pricing"
              className="block w-full py-2.5 rounded-lg text-xs font-bold text-center bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Lock size={12} />
              Join Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. COMPACT DEAL ROW — list view variant
   ═══════════════════════════════════════════════════ */
function CompactDealRow({ product, isPremium = false }) {
  const [faved, setFaved] = useState(false);

  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-sky-200 transition-all ${product.isExpired ? "opacity-70 hover:opacity-100" : ""}`}>
      <div className="flex items-stretch">
        {/* Image */}
        <a href={`/deal/${product.id}`} className="relative w-40 sm:w-48 shrink-0 bg-slate-50 overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          {product.isExpired && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold -rotate-6">EXPIRED</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isDropship && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-500 text-white rounded">DROP</span>
            )}
            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500 text-white rounded">{product.grade.toUpperCase()}</span>
          </div>
        </a>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                  <Clock size={9} /> {product.dateAdded}
                  <span className="mx-1">·</span>
                  {FLAGS[product.country]} {product.countryName}
                </p>
                <a href={`/deal/${product.id}`}>
                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 hover:text-sky-600 transition-colors">
                    {product.title}
                  </h3>
                </a>
              </div>
              <button onClick={() => setFaved(!faved)} className="shrink-0 p-1.5">
                <Heart size={14} className={faved ? "fill-red-500 text-red-500" : "text-slate-300 hover:text-red-400"} />
              </button>
            </div>

            {/* Price + Markup */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-lg font-extrabold text-sky-600">
                {product.currency}{product.price.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">ex.VAT</span>
              <span className="text-xs text-slate-400 line-through">
                RRP {product.rrpCurrency}{product.rrp.toFixed(2)}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">
                {product.markup}%
              </span>
            </div>

            {/* Profit row */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#FF9900] flex items-center justify-center">
                  <span className="text-white font-black text-[7px]">a</span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">+{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-[#E53238] flex items-center justify-center">
                  <span className="text-white font-black text-[7px]">e</span>
                </div>
                <span className="text-xs text-emerald-600 font-semibold">+{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-slate-400">MOQ: {product.moq} units</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-3 flex items-center gap-2">
            {product.isExpired ? (
              <span className="px-4 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 rounded-lg">Expired</span>
            ) : isPremium ? (
              <a href={`/deal/${product.id}`} className="px-4 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors shadow-sm">
                View Details
              </a>
            ) : (
              <a href="/pricing" className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg shadow-sm flex items-center gap-1">
                <Lock size={10} /> Join Now
              </a>
            )}
            <span className="text-[10px] text-slate-400">{product.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   4. DEAL CAROUSEL — horizontal scroll with arrows
   ═══════════════════════════════════════════════════ */
function DealCarousel({ title, subtitle, products, isPremium }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          {subtitle && (
            <p className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <Flame size={12} className="text-orange-500" />
              {subtitle}
            </p>
          )}
          <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={18} />
          </button>
          <a href="/deals" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors ml-2">
            View all
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <SimpleDealCard key={p.id} product={p} isPremium={isPremium} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW TOGGLE — Grid / List
   ═══════════════════════════════════════════════════ */
function ViewToggle({ view, setView }) {
  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
      <button
        onClick={() => setView("grid")}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
          view === "grid" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" />
          <rect x="8" y="0.5" width="5" height="5" rx="1" stroke="currentColor" />
          <rect x="0.5" y="8" width="5" height="5" rx="1" stroke="currentColor" />
          <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" />
        </svg>
        Grid
      </button>
      <button
        onClick={() => setView("list")}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
          view === "list" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="0.5" y="1" width="13" height="3" rx="1" stroke="currentColor" />
          <rect x="0.5" y="6" width="13" height="3" rx="1" stroke="currentColor" />
          <rect x="0.5" y="11" width="13" height="3" rx="1" stroke="currentColor" />
        </svg>
        List
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 3 Full Layout
   ═══════════════════════════════════════════════════ */
export default function Phase3DealCards() {
  const [isPremium, setIsPremium] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showExpired, setShowExpired] = useState(true);

  const visibleProducts = showExpired ? PRODUCTS : PRODUCTS.filter((p) => !p.isExpired);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Tag size={14} className="text-white" />
            </div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Wholesale<span className="text-sky-500">Up</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Phase 3 — Deal Cards</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ── Controls Panel ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Package size={16} className="text-sky-500" />
            Interactive Controls
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsPremium(!isPremium)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPremium ? <Unlock size={12} /> : <Lock size={12} />}
              {isPremium ? "Premium User" : "Free User"}
            </button>
            <button
              onClick={() => setShowExpired(!showExpired)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                showExpired ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
              }`}
            >
              {showExpired ? "Showing Expired" : "Hiding Expired"}
            </button>
            <ViewToggle view={viewMode} setView={setViewMode} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[
              "Simple Card (carousel)",
              "Detailed Card (grid)",
              "Compact Row (list)",
              "Expired overlay",
              "Dropship badge",
              "Favourite toggle",
              "Profit calculations",
              "Premium/Free states",
            ].map((f) => (
              <div key={f} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 1: Carousel (Simple Cards) ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <DealCarousel
            title="Latest wholesale deals up for grabs..."
            products={[...visibleProducts, ...visibleProducts]}
            isPremium={isPremium}
          />
        </div>

        {/* ── Section 2: Hot Offers Carousel (Detailed) ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Products</p>
              <h2 className="text-xl font-extrabold text-slate-900">Hot Wholesale & Dropship Offers</h2>
              <p className="text-sm text-slate-500 mt-1">
                Get instant access to the latest and most popular wholesale and drop-ship opportunities.
              </p>
            </div>
            <a href="/deals" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors">
              Explore Products
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleProducts.map((p) => (
                <DetailedDealCard key={p.id} product={p} isPremium={isPremium} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleProducts.map((p) => (
                <CompactDealRow key={p.id} product={p} isPremium={isPremium} />
              ))}
            </div>
          )}
        </div>

        {/* ── Section 3: Trending Deals Banner + Grid (as it appears on listing pages) ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">Deals Listing Page Preview</h2>
          <p className="text-sm text-slate-400 mb-4">How cards appear in the main deals grid with toolbar</p>

          {/* Mini Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-800">Deals</h3>
              <p className="text-xs text-slate-400">(4,691 deals)</p>
            </div>
            <ViewToggle view={viewMode} setView={setViewMode} />
          </div>

          {/* Trending Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-orange-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Trending Deals (Top Selling This Week)</h3>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleProducts.slice(0, 3).map((p) => (
                <DetailedDealCard key={p.id} product={p} isPremium={isPremium} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleProducts.slice(0, 3).map((p) => (
                <CompactDealRow key={p.id} product={p} isPremium={isPremium} />
              ))}
            </div>
          )}

          {/* Pagination stub */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">Total deals: <strong className="text-slate-700">897</strong></span>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400">
                <ChevronLeft size={14} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-sky-500 text-white text-xs font-bold shadow-sm">1</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">2</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">3</button>
              <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 4: Card Variant Comparison ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Card Variant Comparison</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simple */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles size={12} className="text-sky-400" />
                Simple (Carousel)
              </p>
              <SimpleDealCard product={PRODUCTS[0]} isPremium={isPremium} />
            </div>
            {/* Detailed */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BadgeCheck size={12} className="text-emerald-500" />
                Detailed (Grid)
              </p>
              <DetailedDealCard product={PRODUCTS[3]} isPremium={isPremium} />
            </div>
            {/* Expired */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-red-500" />
                Expired State
              </p>
              <DetailedDealCard product={PRODUCTS[2]} isPremium={isPremium} />
            </div>
          </div>

          {/* List variant */}
          <div className="mt-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield size={12} className="text-violet-500" />
              Compact Row (List View)
            </p>
            <CompactDealRow product={PRODUCTS[4]} isPremium={isPremium} />
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
