"use client";

import { useState, useRef, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Baby,
  Shirt,
  Tv,
  Sparkles,
  Flower2,
  Watch,
  Gamepad2,
  Dumbbell,
  Boxes,
  ArrowRight,
  Star,
  Package,
  TrendingUp,
  Users,
  Globe,
  Filter,
  LayoutGrid,
  ShoppingCart,
  Store,
  Gift,
  UtensilsCrossed,
  PawPrint,
  Car,
} from "lucide-react";
import { CATEGORY_TREE } from "@/lib/categories";
import CtaBanner from "@/components/shared/cta-banner";


/* ═══════════════════════════════════════
   CATEGORY SVG ILLUSTRATIONS (currentColor)
   ═══════════════════════════════════════ */
const CATEGORY_ILLUSTRATIONS = {
  "clothing-fashion": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M35 25L42 20H58L65 25L72 35L65 38L60 30V75H40V30L35 38L28 35L35 25Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M42 20C42 20 45 28 50 28C55 28 58 20 58 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="40" y1="45" x2="60" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="50" cy="55" r="2" fill="currentColor"/><circle cx="50" cy="63" r="2" fill="currentColor"/></svg>),
  "health-beauty": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(72 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(144 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(216 50 48)" /><path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(288 50 48)" /><circle cx="50" cy="48" r="5" fill="currentColor" /></svg>),
  "home-garden": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M18 50L45 27L72 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="26" y="50" width="38" height="28" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="39" y="60" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="30" y="55" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M43 78V68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="76" cy="54" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="84" cy="54" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="80" cy="47" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M80 61V78" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  "electronics-technology": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><rect x="22" y="28" width="56" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="26" y="32" width="48" height="26" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M38 68H62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M44 64V68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M56 64V68" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M35 42L42 48L55 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>),
  "toys-games": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M50 18L76 33L50 48L24 33Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><path d="M24 33L50 48L50 80L24 65Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><path d="M50 48L76 33L76 65L50 80Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/><circle cx="50" cy="33" r="2.5" fill="currentColor"/><circle cx="40" cy="47" r="2.5" fill="currentColor"/><circle cx="34" cy="63" r="2.5" fill="currentColor"/><circle cx="66" cy="44" r="2.5" fill="currentColor"/><circle cx="63" cy="54" r="2.5" fill="currentColor"/><circle cx="60" cy="64" r="2.5" fill="currentColor"/></svg>),
  "gifts-seasonal": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><rect x="28" y="32" width="44" height="40" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M50 32V72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M28 45H72" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="50" cy="38" r="4" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M45 38L42 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M55 38L58 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  "sports-outdoors": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M22 50H78" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/><rect x="28" y="38" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="64" y="38" width="8" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="20" y="42" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="74" y="42" width="6" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "jewellery-watches": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="50" cy="50" r="16" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M50 38V50L58 56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="44" y="26" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><rect x="44" y="68" width="12" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/><circle cx="50" cy="50" r="2" fill="currentColor"/></svg>),
  "food-beverages": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M35 35L50 60L65 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M42 35L50 60L58 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="30" cy="70" r="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="50" cy="75" r="3" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="70" cy="70" r="3" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "pet-supplies": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><circle cx="35" cy="30" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="65" cy="30" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="28" cy="45" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="72" cy="45" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><ellipse cx="50" cy="65" rx="8" ry="12" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
  "baby-kids": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M44 25C44 18 47 14 50 14C53 14 56 18 56 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/><rect x="40" y="25" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="36" y="31" width="28" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M40 45H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M40 55H46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M40 65H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>),
  "surplus-clearance": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><rect x="22" y="45" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="52" y="45" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><rect x="37" y="25" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><path d="M35 56H48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M65 56H78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M50 36H63" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 72H78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3"/></svg>),
  "automotive-parts": (<svg viewBox="0 0 100 100" fill="none" className="w-full h-full"><path d="M25 55L28 35L45 25L55 25L72 35L75 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><rect x="30" y="55" width="40" height="18" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="38" cy="73" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/><circle cx="62" cy="73" r="5" stroke="currentColor" strokeWidth="2.5" fill="none"/></svg>),
};

/* ═══════════════════════════════════════════════════════════
   CATEGORY IMAGES & ICONS MAPPING
   PRODUCTION: Replace with data from GET /api/categories
   ═══════════════════════════════════════════════════════════ */

/* Unsplash placeholder images per category — PRODUCTION: replace with real photos */
const CATEGORY_IMAGES = {
  "clothing-fashion": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
  "health-beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
  "home-garden": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "electronics-technology": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  "toys-games": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop",
  "gifts-seasonal": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop",
  "sports-outdoors": "https://images.unsplash.com/photo-1461896836934-bd45ba7e8071?w=400&h=300&fit=crop",
  "jewellery-watches": "https://images.unsplash.com/photo-1515562141589-67f0d709e19c?w=400&h=300&fit=crop",
  "food-beverages": "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&h=300&fit=crop",
  "pet-supplies": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  "baby-kids": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
  "surplus-clearance": "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop",
  "automotive-parts": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
};

/* Category Lucide icons */
const CATEGORY_PAGE_ICONS = {
  "clothing-fashion": Shirt,
  "health-beauty": Sparkles,
  "home-garden": Flower2,
  "electronics-technology": Tv,
  "toys-games": Gamepad2,
  "gifts-seasonal": Gift,
  "sports-outdoors": Dumbbell,
  "jewellery-watches": Watch,
  "food-beverages": UtensilsCrossed,
  "pet-supplies": PawPrint,
  "baby-kids": Baby,
  "surplus-clearance": Boxes,
  "automotive-parts": Car,
};

const ALL_CATEGORIES = CATEGORY_TREE.map((cat) => ({
  id: cat.id,
  name: cat.name,
  icon: CATEGORY_PAGE_ICONS[cat.id] || Package,
  supplierCount: cat.subs.length * 15 + 10, // placeholder
  img: CATEGORY_IMAGES[cat.id] || "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop",
  subcategories: cat.subs.map((s) => ({ id: s.id, label: s.label })),
  href: cat.href,
}));

/* ═══════════════════════════════════════
   CATEGORY CARD — photo + dark overlay
   ═══════════════════════════════════════ */
// PRODUCTION NOTE: Subcategory URLs use canonical IDs from CATEGORY_TREE,
// never runtime-generated slugs. See url-formats skill for conventions.

function CategoryCard({ category }) {
  const illustration = CATEGORY_ILLUSTRATIONS[category.id];
  return (
    <div className="group rounded-xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5">
      {/* Photo header with dark overlay */}
      <a href={category.href} className="relative block h-32 overflow-hidden">
        {/* PRODUCTION (L8): Replace <img> with next/image Image component */}
        <img
          src={category.img}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20" />
        {/* Icon */}
        <div className="absolute left-3.5 bottom-3 w-10 h-10 rounded-md bg-white/15 backdrop-blur-sm flex items-center justify-center p-1 text-white">
          {illustration || <category.icon size={18} className="text-white" strokeWidth={2} />}
        </div>
        {/* Category name on image */}
        <p className="absolute left-14 bottom-3.5 text-[15px] font-bold text-white leading-snug drop-shadow-sm">
          {category.name}
        </p>
        {/* Supplier count badge */}
        <div className="absolute right-3 top-3 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-[10px] font-medium">
          {category.supplierCount} suppliers
        </div>
      </a>

      {/* Subcategories */}
      <div className="px-3.5 py-3">
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {category.subcategories.map((sub, i) => (
            <span key={sub.id} className="inline-flex items-center">
              <a
                href={`${category.href}/${sub.id}`}
                className="text-[13px] text-slate-500 hover:text-orange-600 transition-colors"
              >
                {sub.label}
              </a>
              {i < category.subcategories.length - 1 && (
                <span className="text-slate-300 mx-1">&middot;</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   TRUST SECTION — from /deals
   ═══════════════════════════════════════ */
function TrustSection() {
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleUp as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
  ];

  const scrollRef = useRef(null);

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mb-10">
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
          onClick={() => scrollRef.current && scrollRef.current.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <button
          onClick={() => scrollRef.current && scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {testimonials.map((t) => (
              <div key={t.name} className="w-72 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - t.rating }, (_, i) => (
                    <Star key={"e" + i} size={12} className="text-slate-200" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">&mdash; {t.location}</p>
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

/* ═══════════════════════════════════════
   HERO STATS + MAIN PAGE
   PRODUCTION (H2): Fetch live stats from GET /api/stats
   ═══════════════════════════════════════ */
const HERO_STATS = [
  { icon: Package, value: String(ALL_CATEGORIES.length + ALL_CATEGORIES.reduce((sum, c) => sum + c.subcategories.length, 0)), label: "Categories", color: "text-orange-500" },
  { icon: Users, value: "42,900+", label: "Verified Suppliers", color: "text-emerald-500" },
  { icon: Globe, value: "160+", label: "Countries", color: "text-blue-500" },
  { icon: TrendingUp, value: "366%", label: "Avg. Markup", color: "text-orange-500" },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return ALL_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return ALL_CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.subcategories.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero — exact register blue + greyscale photo appliqué ── */}
      <section className="relative overflow-hidden">
        {/* Layer 1: Solid blue gradient — identical to /register MarketingColumn, NO opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]" />
        {/* Layer 2: Greyscale photo blended as subtle texture */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "grayscale(1)", mixBlendMode: "luminosity" }} />
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRight size={12} />
            <span className="text-white/90 font-medium">All Categories</span>
          </nav>

          <div className="max-w-5xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <LayoutGrid size={13} /> Browse All Categories
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Explore by Category
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Browse our full range of wholesale categories and find the right suppliers for your business
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 max-w-2xl mx-auto">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon size={20} className={`${stat.color} mx-auto mb-1.5`} />
                  <p className="text-xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky search bar ── */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 max-w-xl">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories or subcategories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-400">No categories found</p>
            <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Trust Section */}
      <TrustSection />

      {/* CTA Section */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-8">
        <CtaBanner className="mt-0" />
      </div>
    </div>
  );
}
