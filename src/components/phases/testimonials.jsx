"use client";

import { useState, useMemo } from "react";
import {
  Star,
  Quote,
  Search,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ArrowRight,
  Users,
  ThumbsUp,
  Globe,
  TrendingUp,
  BadgeCheck,
  Filter,
  MapPin,
} from "lucide-react";
import { ALL_TESTIMONIALS } from "@/data/testimonials-data";

/* ═══════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════ */
const CATEGORIES = ["All", "Deals", "Suppliers", "Service", "Sourcing", "Support", "Beginners", "Tools", "Dropshipping", "Liquidation", "Amazon", "eBay"];

const STATS = [
  { icon: Users, value: "901,900+", label: "Happy Members", color: "text-orange-500" },
  { icon: ThumbsUp, value: "99.2%", label: "Satisfaction Rate", color: "text-emerald-500" },
  { icon: Globe, value: "160+", label: "Countries", color: "text-blue-500" },
  { icon: TrendingUp, value: "366%", label: "Avg. Markup", color: "text-orange-500" },
];

/* ═══════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════ */

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, featured = false }) {
  const initials = testimonial.author.split(" ").map((n) => n[0]).join("");
  return (
    <div className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      featured
        ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-md"
        : "bg-white border-slate-200 hover:border-orange-200"
    }`}>
      <div className="p-5 sm:p-6">
        {/* Quote icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-4 ${
          featured ? "bg-orange-500" : "bg-orange-100 group-hover:bg-orange-500"
        } transition-colors`}>
          <Quote size={14} className={`${featured ? "text-white" : "text-orange-500 group-hover:text-white"} transition-colors`} />
        </div>

        {/* Rating */}
        <StarRating rating={testimonial.rating} />

        {/* Text */}
        <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-5">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
            featured ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"
          }`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{testimonial.author}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <MapPin size={10} />
              <span>{testimonial.location}</span>
            </div>
          </div>
          {testimonial.category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {testimonial.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 24;

  const filtered = useMemo(() => {
    let results = ALL_TESTIMONIALS;
    if (activeCategory !== "All") {
      results = results.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.author.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    return results;
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 30%" }} />
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRightIcon size={12} />
            <span className="text-white/90 font-medium">Testimonials</span>
          </nav>

          <div className="max-w-5xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <BadgeCheck size={13} /> Verified Reviews
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              What Our Members Say
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of thousands of resellers who trust WholesaleUp to find profitable deals,
              verified suppliers and turbo charge your businesses.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 max-w-2xl mx-auto">
              {STATS.map((stat) => (
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

      {/* ── Filters ── */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              <Filter size={14} className="text-slate-400 mr-1" />
              {CATEGORIES.map((cat) => {
                const count = cat === "All" ? ALL_TESTIMONIALS.length : ALL_TESTIMONIALS.filter((t) => t.category === cat).length;
                if (cat !== "All" && count === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {cat}
                    <span className="ml-1 opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured testimonials (top 3, only on "All") ── */}
      {activeCategory === "All" && !searchQuery && (
        <section className="px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-900">Featured Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {ALL_TESTIMONIALS.slice(0, 4).map((t, i) => (
              <TestimonialCard key={`featured-${i}`} testimonial={t} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── All testimonials grid ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            {activeCategory === "All" && !searchQuery ? "All Reviews" : `${filtered.length} Review${filtered.length !== 1 ? "s" : ""}`}
            {searchQuery && <span className="text-slate-400 font-normal"> for &ldquo;{searchQuery}&rdquo;</span>}
          </h2>
          <span className="text-xs text-slate-400">
            Page {page} of {totalPages} ({filtered.length} reviews)
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No reviews found</p>
            <p className="text-sm text-slate-400 mt-1">Try a different search or category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
              {visible.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="px-1 text-slate-400 text-sm">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                          page === p
                            ? "bg-orange-500 text-white shadow-sm"
                            : "border border-slate-200 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl overflow-hidden p-8 sm:p-12 text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to Join Them?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-6">
              Start finding profitable deals and verified suppliers today. Join hundreds of thousands of successful resellers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                Get Started Free <ArrowRight size={16} />
              </a>
              <a
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                Browse Deals
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
