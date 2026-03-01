"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Heart,
  Flame,
  BadgeCheck,
  Globe,
  ThumbsUp,
  Phone,
  Mail,
  Eye,
  Package,
  Users,
  TrendingUp,
  ShoppingBag,
  Shirt,
  Home as HomeIcon,
  Watch,
  Sparkles,
  Flower2,
  Gamepad2,
  Monitor,
  Gift,
  Compass,
  HelpCircle,
  Truck,
  Crown,
  Lock,
  ChevronUp,
  X,
} from "lucide-react";

/* ═══════ MOCK DATA ═══════ */
const CATEGORIES = [
  { name: "Apparel & Clothing", icon: Shirt, color: "from-pink-500 to-rose-500", count: 1245 },
  { name: "Home Supplies", icon: HomeIcon, color: "from-amber-500 to-orange-500", count: 654 },
  { name: "Jewellery & Watches", icon: Watch, color: "from-violet-500 to-purple-500", count: 378 },
  { name: "Health & Beauty", icon: Sparkles, color: "from-emerald-500 to-teal-500", count: 789 },
  { name: "Floral & Garden", icon: Flower2, color: "from-green-500 to-emerald-500", count: 189 },
  { name: "Toys & Games", icon: Gamepad2, color: "from-blue-500 to-indigo-500", count: 498 },
  { name: "Computer & Software", icon: Monitor, color: "from-slate-600 to-slate-800", count: 634 },
  { name: "Gifts & Giftware", icon: Gift, color: "from-red-500 to-pink-500", count: 456 },
  { name: "Travel & Outdoors", icon: Compass, color: "from-cyan-500 to-sky-500", count: 321 },
];

const SIMPLE_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: "18.95", date: "19/09/2023" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: "18.95", date: "19/09/2023" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: "18.95", date: "19/09/2023" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: "24.50", date: "20/09/2023" },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: "12.80", date: "21/09/2023" },
  { title: "Samsung Galaxy Buds FE Wireless Earbuds", price: "32.99", date: "22/09/2023" },
];

const DETAILED_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, country: "🇬🇧", grade: "New" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, country: "🇬🇧", grade: "New" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, country: "🇩🇪", grade: "New" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: "24.50", rrp: "79.99", markup: "226.5%", profit: "22.30", sales: 48, country: "🇬🇧", grade: "New" },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: "12.80", rrp: "39.99", markup: "212.4%", profit: "11.20", sales: 62, country: "🇵🇱", grade: "New" },
];

const SUPPLIERS = [
  { name: "Trainers and Sportswear Supplier", country: "🇬🇧", countryName: "United Kingdom", rating: 5.0, desc: "We are a wholesaler of sportswear clothing and shoes. We offer high quality adidas originals, nike air max, reebok and more." },
  { name: "Basketball Sport Supplier", country: "🇬🇧", countryName: "United Kingdom", rating: 5.0, desc: "Premium sports equipment and apparel supplier specializing in basketball gear, training equipment and team uniforms." },
  { name: "Electronics Direct Wholesale", country: "🇩🇪", countryName: "Germany", rating: 4.8, desc: "Leading European electronics wholesaler offering consumer electronics, accessories, and smart home products at competitive prices." },
  { name: "Home & Garden Essentials", country: "🇳🇱", countryName: "Netherlands", rating: 4.7, desc: "Quality home supplies, garden tools, and decor items from trusted European manufacturers. Low MOQ available." },
];

const COUNTRIES = [
  { flag: "🇦🇺", name: "Australia" }, { flag: "🇮🇹", name: "Italia" },
  { flag: "🇰🇷", name: "South Korea" }, { flag: "🇮🇩", name: "Indonesia" },
  { flag: "🇹🇭", name: "Thailand" }, { flag: "🇹🇷", name: "Turkey" },
  { flag: "🇯🇵", name: "Japan" }, { flag: "🇩🇪", name: "Germany" },
];

const TESTIMONIALS = [
  { text: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", author: "Rena Harvey", location: "United Kingdom" },
  { text: "Very pleased with the service, suppliers and dropshippers. I have just upgraded to combo for the new month. Thank you.", author: "Thu Huong Do", location: "Sweden" },
  { text: "Absolutely fantastic, it's a great service and am really glad I found it. I fully recommend it and use it regularly.", author: "Alex Elliott", location: "United Kingdom" },
];

const FAQS = [
  { q: "What do I get when I join WholesaleDeals buyer?", a: "You get immediate access to our platform with over 54,000 verified suppliers, all the latest wholesale deals with profit calculations, and the Deal Tracker tool. You'll also receive our weekly deals newsletter and can request personalized sourcing assistance from our team." },
  { q: "Are the suppliers really verified?", a: "Yes, all suppliers on our platform go through a rigorous verification process to ensure they are legitimate wholesale businesses. We verify their business credentials, check their reputation, and ensure they meet our quality standards." },
  { q: "Is WholesaleDeals good for beginners?", a: "Absolutely! WholesaleDeals is designed to help both beginners and experienced resellers. We provide educational resources, profit calculators, and personalized support to help you get started and grow your business successfully." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. Your access will continue until the end of your current billing period. We also offer a money-back guarantee if you're not satisfied within the first 14 days." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 100% money-back guarantee. If we can't find the suppliers or deals you're looking for, we'll refund your subscription in full." },
  { q: "How often are new deals added?", a: "We add new wholesale and dropship deals daily. Our team constantly sources new opportunities from verified suppliers across the UK, EU, and North America." },
];

/* ═══════ SHARED HELPERS ═══════ */
function StarRating({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
    </div>
  );
}

function useCarousel(itemCount, visibleCount = 3) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const check = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 10);
    setCanRight(scrollLeft < scrollWidth - clientWidth - 10);
  };
  useEffect(() => {
    check();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", check);
    return () => el?.removeEventListener("scroll", check);
  }, []);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return { scrollRef, canLeft, canRight, scroll };
}

/* ═══════════════════════════════════════
   1. HERO SECTION
   ═══════════════════════════════════════ */
function HeroSection() {
  const [searchType, setSearchType] = useState("Deals");
  const [searchOpen, setSearchOpen] = useState(false);
  const [supplierType, setSupplierType] = useState("Wholesalers");
  const supplierTypes = ["Wholesalers", "Distributors", "Liquidators", "Dropshippers"];

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          WholesaleUp — 20+ Years<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
            #1 Wholesale & Dropship Platform
          </span>
        </h1>
        <p className="text-slate-400 mt-3 text-base lg:text-lg max-w-2xl mx-auto">
          Largest database of verified wholesale suppliers, liquidators and dropshippers from the UK, EU and North America
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-1.5">
            <div className="flex items-center gap-1.5">
              {/* Type Selector */}
              <div className="relative">
                <button onClick={() => setSearchOpen(!searchOpen)} className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors min-w-[120px]">
                  {searchType}
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${searchOpen ? "rotate-180" : ""}`} />
                </button>
                {searchOpen && (
                  <div className="absolute left-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 min-w-[160px]">
                    {["Deals", "Suppliers"].map((t) => (
                      <button key={t} onClick={() => { setSearchType(t); setSearchOpen(false); }}
                        className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${searchType === t ? "bg-sky-50 text-sky-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Supplier Sub-type Pills */}
              {searchType === "Suppliers" && (
                <div className="hidden sm:flex items-center gap-1">
                  {supplierTypes.map((st) => (
                    <button key={st} onClick={() => setSupplierType(st)}
                      className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-all ${supplierType === st ? "bg-sky-100 text-sky-700" : "text-slate-400 hover:text-slate-600"}`}>
                      {st}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <input type="text" placeholder={searchType === "Deals" ? "Search wholesale deals..." : "Search suppliers..."} className="flex-1 px-3 py-3 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400 min-w-0" />

              {/* Search Button */}
              <button className="px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0">
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500">Popular:</span>
            {["Wholesale Pajamas", "Leather Boots", "Sneaker", "Buy Toys Bulk"].map((term) => (
              <button key={term} className="px-2.5 py-1 text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-sky-400 rounded-lg transition-all">
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   2. LATEST DEALS CAROUSEL (Simple Cards)
   ═══════════════════════════════════════ */
function LatestDealsCarousel() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(SIMPLE_DEALS.length);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Flame size={18} className="text-orange-500" />
          <h2 className="text-xl font-extrabold text-slate-900">Latest wholesale deals up for grabs...</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={16} /></button>
          <a href="/deals" className="text-sm font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 ml-2">View all <ArrowRight size={13} /></a>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
        {SIMPLE_DEALS.map((deal, i) => (
          <div key={i} className="w-[220px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all group cursor-pointer">
            <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <Package size={40} className="text-slate-200 group-hover:text-sky-200 transition-colors" />
              <div className="absolute top-2 left-2 px-2 py-1 bg-sky-600 text-white text-xs font-bold rounded-lg">£{deal.price}<span className="text-sky-200 text-[10px] ml-1">ex.VAT</span></div>
              <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm"><Heart size={13} className="text-slate-400 hover:text-red-500" /></button>
            </div>
            <div className="p-3">
              <p className="text-[10px] text-slate-400 mb-1">Deal Featured On: {deal.date}</p>
              <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-2.5">{deal.title}</h3>
              <button className="w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all">Join Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   3. CATEGORIES GRID
   ═══════════════════════════════════════ */
function CategoriesGrid() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(CATEGORIES.length);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">Explore by Categories</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={16} /></button>
          <a href="/categories" className="text-sm font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 ml-2">View all <ArrowRight size={13} /></a>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat, i) => (
          <button key={i} className="w-[140px] shrink-0 snap-start group cursor-pointer text-center">
            <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2.5 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all`}>
              <cat.icon size={36} className="text-white/90" />
            </div>
            <p className="text-xs font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">{cat.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   4. TRUST SECTION — #1 Platform (Buyers)
   ═══════════════════════════════════════ */
function TrustSectionBuyers() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-3xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">#1 Platform On the Market</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-2 leading-snug">
              Discover Why Thousands of Resellers Continue to Put Their Trust in Us
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              We're more than just a platform — we're a growth partner. From day-one beginners to seasoned resellers, we provide the tools, insights, and supplier access that empower you to scale faster & smarter.
            </p>
            <button className="mt-5 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5">
              Learn More <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid gap-4">
            {[
              { icon: BadgeCheck, title: "Verified global suppliers", desc: "Largest database of trusted suppliers from the UK, EU, and North America." },
              { icon: Globe, title: "Unlimited Custom Sourcing", desc: "Let us find specific deals and suppliers tailored to your needs." },
              { icon: ThumbsUp, title: "Satisfaction Guarantee", desc: "We guarantee to find what you're looking for, or your money back." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 bg-white/5 rounded-xl p-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   5. HOT OFFERS CAROUSEL (Detailed Cards)
   ═══════════════════════════════════════ */
function HotOffersCarousel({ isPremium }) {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(DETAILED_DEALS.length);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Products</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Hot Wholesale & Dropship Offers</h2>
          <p className="text-sm text-slate-500 mt-1">Get instant access to the latest and most popular wholesale and drop-ship opportunities.</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors shrink-0">
          Explore Products <ArrowRight size={14} />
        </a>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {DETAILED_DEALS.map((deal, i) => (
            <div key={i} className="w-[280px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-sky-200 transition-all group">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <Package size={48} className="text-slate-200 group-hover:text-sky-200 transition-colors" />
                <div className="absolute top-2 right-2 text-lg">{deal.country}</div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">{deal.grade}</div>
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-extrabold text-sky-600">£{deal.price}</span>
                  <span className="text-[10px] text-slate-400">ex.VAT</span>
                </div>
                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">{deal.title}</h3>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded">{deal.markup}</span>
                  <span className="text-[10px] text-slate-400">RRP €{deal.rrp}</span>
                </div>
                {/* Profit rows */}
                <div className="space-y-1 mb-3">
                  {["Amazon", "eBay"].map((platform) => (
                    <div key={platform} className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-500">{platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">€{deal.rrp}</span>
                        <span className="text-emerald-600 font-bold">Profit €{deal.profit}</span>
                        <span className="text-slate-300">/ {deal.sales}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-2 text-xs font-bold rounded-lg transition-all ${isPremium ? "bg-sky-500 hover:bg-sky-600 text-white" : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"}`}>
                  {isPremium ? "View Deal" : "Join Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   6. TRUST SECTION — #1 Platform (Suppliers)
   ═══════════════════════════════════════ */
function TrustSectionSuppliers() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">#1 Platform for Suppliers</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 leading-snug">
              Here's Why Thousands of Suppliers Trust Us to Reach More Buyers
            </h2>
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
              We're more than just a platform — we're a growth partner. From day-one beginners to seasoned resellers, we provide the tools.
            </p>
            <button className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5">
              Learn More <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              "Buy today from verified wholesalers and dropshippers at up to 95% off the current eBay and Amazon prices.",
              "Effortlessly discover profitable wholesale and dropship deals, saving you valuable time and leading you directly to profits.",
              "List new deals daily to ensure our members have a constant supply of low priced goods to resell at a profit.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <BadgeCheck size={16} className="text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   7. FEATURED SUPPLIERS
   ═══════════════════════════════════════ */
function FeaturedSuppliers({ isPremium }) {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(SUPPLIERS.length);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suppliers</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Featured Supplier Offers Solutions</h2>
          <p className="text-sm text-slate-500 mt-1">Get instant access to the latest wholesale and drop-ship opportunities.</p>
        </div>
        <a href="/suppliers" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors shrink-0">
          Explore Suppliers <ArrowRight size={14} />
        </a>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {SUPPLIERS.map((sup, i) => (
            <div key={i} className="w-[340px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-sky-200 transition-all">
              <div className="flex items-center justify-between mb-2">
                <a href="#" className="text-sm font-bold text-sky-600 hover:text-sky-700">{sup.name}</a>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{sup.country}</span>
                  <StarRating rating={sup.rating} size={11} />
                  <span className="text-xs text-slate-500">{sup.rating}</span>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button className="px-3 py-1.5 text-xs font-semibold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors flex items-center gap-1"><Phone size={11} /> Call Now</button>
                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-1"><Mail size={11} /> Send Enquiry</button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">{sup.desc}</p>
              {/* Contact details (blurred for free) */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Phone/Fax</span>
                  <span className={`text-xs ${isPremium ? "text-slate-700" : "blur-sm select-none text-slate-500"}`}>+4402089072658</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Email</span>
                  <span className={`text-xs ${isPremium ? "text-sky-600" : "blur-sm select-none text-slate-500"}`}>wholesale@gmail.com</span>
                </div>
              </div>
              {!isPremium && (
                <div className="mt-3 py-2.5 text-center bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-100">
                  <p className="text-xs text-sky-600 font-semibold flex items-center justify-center gap-1"><Lock size={11} /> Join to see full details</p>
                </div>
              )}
            </div>
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   8. COUNTRY/REGION GRID
   ═══════════════════════════════════════ */
function CountryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">Find Suppliers by Country or Region</h2>
        <a href="/suppliers" className="text-sm font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1">View all <ArrowRight size={13} /></a>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {COUNTRIES.map((c, i) => (
          <button key={i} className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-sky-200 transition-all group cursor-pointer">
            <span className="text-3xl group-hover:scale-110 transition-transform">{c.flag}</span>
            <span className="text-[10px] font-semibold text-slate-600 group-hover:text-sky-600 transition-colors">{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   9. FAQ
   ═══════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Have questions? We're here to help.</p>
        </div>
        <a href="/help" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-sky-600 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors"><HelpCircle size={14} /> Help Center</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {FAQS.map((faq, i) => (
          <div key={i} className={`rounded-xl border transition-all ${openIndex === i ? "border-sky-200 bg-sky-50/50 shadow-sm" : "border-slate-200 bg-white"}`}>
            <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full flex items-start gap-3 px-5 py-4 text-left">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${openIndex === i ? "bg-sky-500" : "bg-slate-100"}`}>
                <ChevronDown size={13} className={`transition-transform ${openIndex === i ? "rotate-180 text-white" : "text-slate-400"}`} />
              </div>
              <h3 className={`text-sm font-semibold transition-colors ${openIndex === i ? "text-sky-700" : "text-slate-800"}`}>{faq.q}</h3>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 pl-14"><p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   10. STATS + TESTIMONIALS
   ═══════════════════════════════════════ */
function StatsTestimonials() {
  const scrollRef = useRef(null);
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl overflow-hidden p-8 lg:p-12">
        <h2 className="text-2xl font-extrabold text-white text-center mb-2">Trusted by Businesses of All Sizes</h2>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-10 max-w-lg mx-auto">
          {[
            { icon: Flame, value: "366.61%", label: "Average markup", color: "text-orange-400" },
            { icon: Package, value: "14,891+", label: "Active Deals", color: "text-sky-400" },
            { icon: Users, value: "300+", label: "New Suppliers (7d)", color: "text-emerald-400" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon size={20} className={`${stat.color} mx-auto mb-1.5`} />
              <p className="text-lg font-extrabold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
        {/* Testimonials */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="w-[320px] shrink-0 snap-start bg-white/10 backdrop-blur rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} className="fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <div className="w-7 h-7 rounded-full bg-sky-500/30 flex items-center justify-center text-white font-bold text-[10px]">{t.author.split(" ").map((n) => n[0]).join("")}</div>
                <div><p className="text-xs font-semibold text-white">{t.author}</p><p className="text-[10px] text-slate-400">— {t.location}</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <a href="/testimonials" className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1">All Testimonials <ArrowRight size={13} /></a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   11. FOOTER
   ═══════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center"><Tag size={14} className="text-white" /></div>
              <span className="text-base font-extrabold text-white">Wholesale<span className="text-sky-400">Up</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">The #1 wholesale and dropship platform. Connecting buyers with verified suppliers since 2004.</p>
          </div>
          {[
            { title: "For Buyers", links: ["Browse Deals", "Categories", "Suppliers", "Pricing"] },
            { title: "For Sellers", links: ["List Products", "Seller Benefits", "Get Listed", "Advertising"] },
            { title: "Company", links: ["About Us", "Testimonials", "Help Center", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">{col.title}</h4>
              <div className="space-y-2">{col.links.map((link) => <a key={link} href="#" className="block text-xs text-slate-500 hover:text-sky-400 transition-colors">{link}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">© 2024 WholesaleUp. All rights reserved.</p>
          <p className="text-xs text-slate-500">service@wholesaleup.co.uk</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════
   MAIN HOMEPAGE — PHASE 7
   ═══════════════════════════════════════ */
export default function Phase7Homepage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Top Bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="#" className="text-[10px] text-slate-500 hover:text-sky-500 font-medium">For buyers</a>
            <a href="#" className="text-[10px] text-slate-500 hover:text-sky-500 font-medium">For sellers</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400">service@wholesaleup.co.uk</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <Tag size={14} className="text-white" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">Wholesale<span className="text-sky-500">Up</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <a href="/deals" className="text-xs font-semibold text-slate-700 hover:text-sky-500">Deals</a>
              <a href="/suppliers" className="text-xs font-semibold text-slate-700 hover:text-sky-500">Suppliers</a>
              <a href="/categories" className="text-xs font-semibold text-slate-700 hover:text-sky-500">Categories</a>
              <a href="/pricing" className="text-xs font-semibold text-slate-700 hover:text-sky-500">Pricing</a>
            </nav>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Demo controls */}
            <div className="flex items-center gap-1 mr-2 bg-slate-100 rounded-lg p-0.5">
              <button onClick={() => { setIsLoggedIn(false); setIsPremium(false); }}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${!isLoggedIn ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>Guest</button>
              <button onClick={() => { setIsLoggedIn(true); setIsPremium(false); }}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${isLoggedIn && !isPremium ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"}`}>Free</button>
              <button onClick={() => { setIsLoggedIn(true); setIsPremium(true); }}
                className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all ${isPremium ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}>Premium</button>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {!isPremium && (
                  <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center gap-1">
                    <Crown size={11} /> Upgrade
                  </button>
                )}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">JL</div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-sky-500">Log In</button>
                <button className="px-3 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg">Join Free</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Sections */}
      <HeroSection />
      <LatestDealsCarousel />
      <CategoriesGrid />
      <TrustSectionBuyers />
      <HotOffersCarousel isPremium={isPremium} />
      <TrustSectionSuppliers />
      <FeaturedSuppliers isPremium={isPremium} />
      <CountryGrid />
      <FAQSection />
      <StatsTestimonials />
      <Footer />

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
