"use client";

import { useState, useRef, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Baby,
  Shirt,
  Monitor,
  Tv,
  Sparkles,
  Flower2,
  Watch,
  Gamepad2,
  Smartphone,
  Briefcase,
  Gavel,
  Dumbbell,
  Boxes,
  Puzzle,
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
} from "lucide-react";

/* ═══════════════════════════════════════
   CATEGORIES DATA
   ═══════════════════════════════════════ */
const ALL_CATEGORIES = [
  {
    id: "baby-products",
    name: "Baby Products",
    icon: Baby,
    supplierCount: 44,
    img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
    subcategories: ["Clothing & Shoes", "Feeding & Nursing", "Toys & Activity", "Pushchairs & Prams", "Safety & Health"],
    href: "/categories/baby-products",
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: Shirt,
    supplierCount: 188,
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop",
    subcategories: ["Men's Clothing", "Women's Clothing", "Children's Clothing", "Sportswear", "Accessories"],
    href: "/categories/clothing",
  },
  {
    id: "computing",
    name: "Computing",
    icon: Monitor,
    supplierCount: 92,
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    subcategories: ["Laptops & Notebooks", "Desktop PCs", "Tablets", "Components", "Peripherals"],
    href: "/categories/computing",
  },
  {
    id: "consumer-electronic",
    name: "Consumer Electronic",
    icon: Tv,
    supplierCount: 48,
    img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop",
    subcategories: ["TV & Home Cinema", "Audio & HiFi", "Cameras & Camcorders", "Smart Home", "Wearable Tech"],
    href: "/categories/consumer-electronic",
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    icon: Sparkles,
    supplierCount: 216,
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    subcategories: ["Diet, Supplements, & Vitamins", "Hair & Skin Care", "Makeup & Cosmetics", "Manicure & Pedicure", "Natural & Alternative Therapy", "Perfumes & Fragrances", "Personal Care"],
    href: "/categories/health-beauty",
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    icon: Flower2,
    supplierCount: 90,
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    subcategories: ["Furniture", "Kitchen & Dining", "Bedding & Linen", "Garden Tools", "Home Decor"],
    href: "/categories/home-garden",
  },
  {
    id: "jewellery-watches",
    name: "Jewellery & Watches",
    icon: Watch,
    supplierCount: 66,
    img: "https://images.unsplash.com/photo-1515562141589-67f0d709e19c?w=400&h=300&fit=crop",
    subcategories: ["Rings", "Necklaces", "Watches", "Earrings", "Bracelets"],
    href: "/categories/jewellery-watches",
  },
  {
    id: "leisure-entertainment",
    name: "Leisure & Entertainment",
    icon: Gamepad2,
    supplierCount: 39,
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    subcategories: ["Books & Magazines", "DVDs & Blu-ray", "Musical Instruments", "Board Games", "Arts & Crafts"],
    href: "/categories/leisure-entertainment",
  },
  {
    id: "mobile-phones",
    name: "Mobile & Home Phones",
    icon: Smartphone,
    supplierCount: 139,
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    subcategories: ["Smartphones", "Phone Cases", "Chargers & Cables", "Screen Protectors", "Headphones"],
    href: "/categories/mobile-phones",
  },
  {
    id: "office-business",
    name: "Office & Business",
    icon: Briefcase,
    supplierCount: 45,
    img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
    subcategories: ["Office Supplies", "Printers & Ink", "Office Furniture", "Filing & Storage", "Presentation"],
    href: "/categories/office-business",
  },
  {
    id: "police-auctions",
    name: "Police Auctions & Auction Houses",
    icon: Gavel,
    supplierCount: 15,
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
    subcategories: ["Lost Property", "Seized Goods", "Unclaimed Parcels", "Government Surplus"],
    href: "/categories/police-auctions",
  },
  {
    id: "sports-fitness",
    name: "Sports & Fitness",
    icon: Dumbbell,
    supplierCount: 44,
    img: "https://images.unsplash.com/photo-1461896836934-bd45ba7e8071?w=400&h=300&fit=crop",
    subcategories: ["Gym Equipment", "Outdoor Sports", "Team Sports", "Cycling", "Swimming"],
    href: "/categories/sports-fitness",
  },
  {
    id: "surplus-stocklots",
    name: "Surplus & Stocklots",
    icon: Boxes,
    supplierCount: 63,
    img: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop",
    subcategories: ["Mixed Pallets", "Customer Returns", "End of Line", "Overstock", "Clearance"],
    href: "/categories/surplus-stocklots",
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    icon: Puzzle,
    supplierCount: 50,
    img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop",
    subcategories: ["Action Figures", "Building Toys", "Dolls", "Educational Toys", "Outdoor Toys"],
    href: "/categories/toys-games",
  },
];

/* ═══════════════════════════════════════
   CATEGORY CARD — photo + dark overlay
   ═══════════════════════════════════════ */
function subSlug(parentHref, sub) {
  return parentHref + "/" + sub.toLowerCase().replace(/[&,]/g, "").replace(/\s+/g, "-");
}

function CategoryCard({ category }) {
  const Icon = category.icon;
  return (
    <div className="group rounded-xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5">
      {/* Photo header with dark overlay */}
      <a href={category.href} className="relative block h-32 overflow-hidden">
        <img
          src={category.img}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20" />
        {/* Icon */}
        <div className="absolute left-3.5 bottom-3 w-8 h-8 rounded-md bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <Icon size={16} className="text-white" strokeWidth={2} />
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
            <span key={sub} className="inline-flex items-center">
              <a
                href={subSlug(category.href, sub)}
                className="text-[13px] text-slate-500 hover:text-orange-600 transition-colors"
              >
                {sub}
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
    { name: "Rachel Harvey", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleDeals as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
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
      {/* ── Hero — matching /testimonials ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>
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
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
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

      {/* CTA Section — matches /deals */}
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-8 bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
        {/* Left illustrations */}
        <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
            <ellipse cx="52" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
            <rect x="25" y="42" width="50" height="38" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
            <path d="M38 42V32a12 12 0 0 1 24 0v10" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="52" r="2.5" fill="#1E293B" />
            <circle cx="60" cy="52" r="2.5" fill="#1E293B" />
          </svg>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
            <ellipse cx="55" cy="48" rx="26" ry="24" fill="#FED7AA" opacity="0.5" />
            <path d="M20 20h28l28 28-22 22L20 48V20z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <circle cx="34" cy="34" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
            <path d="M48 52l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M42 58l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{width: "4.5rem", height: "4.5rem"}}>
            <ellipse cx="50" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
            <path d="M16 35l34-17 34 17v30L50 82 16 65V35z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
            <path d="M16 35l34 17 34-17" stroke="#1E293B" strokeWidth="2" fill="none" />
            <path d="M50 52v30" stroke="#1E293B" strokeWidth="2" fill="none" />
            <path d="M33 27l34 17" stroke="#1E293B" strokeWidth="1.5" fill="none" opacity="0.4" />
          </svg>
        </div>

        {/* Right illustrations */}
        <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
            <ellipse cx="42" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
            <circle cx="42" cy="42" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
            <path d="M56 56l22 22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 36a12 12 0 0 1 12-9" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
          </svg>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
            <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
            <path d="M18 78h64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 78V22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M26 64l14-12 12 6 14-20 14-12" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="80" cy="26" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
            <circle cx="80" cy="26" r="1.5" fill="#1E293B" />
          </svg>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{width: "4.5rem", height: "4.5rem"}}>
            <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
            <path d="M18 50l14-14 10 4 8-8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M50 32l10 10 4-10 18 18" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M32 54l8 8 12-6 8 8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="28" cy="50" r="3" fill="#1E293B" opacity="0.15" />
            <circle cx="72" cy="50" r="3" fill="#1E293B" opacity="0.15" />
          </svg>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Get Started!</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
            Ready to Increase Your<br />Profits?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Join thousands of retailers and suppliers already growing their business on WholesaleUp.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/register?type=retailer" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300">
              <ShoppingCart size={16} />
              I want to buy
            </a>
            <a href="/register?type=supplier" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300">
              <Store size={16} />
              I want to sell
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
