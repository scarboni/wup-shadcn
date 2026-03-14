"use client";

import { AlertTriangle, Search, ArrowRight, Store, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getCategoryByName } from "@/lib/categories";

/* ═══════════════════════════════════════════════════
   SoldOutBanner — shown at the top of the deal page when
   a deal is sold out / expired. Three action cards:
   1. Browse all deals  2. Browse category  3. Contact supplier
   ═══════════════════════════════════════════════════ */
export default function SoldOutBanner({ deal }) {
  // Resolve category link from deal's category breadcrumb or name
  const categoryName = deal.categoryBreadcrumb?.[0] || deal.category;
  const categoryMatch = getCategoryByName(categoryName);
  const categoryHref = categoryMatch?.categoryId ? `/deals/${categoryMatch.categoryId}` : "/deals";

  const cardBase = "flex-1 flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md active:scale-[0.98] active:shadow-sm transition-all duration-150 group cursor-pointer";

  return (
    <div className="mb-5 rounded-xl border border-red-200/80 bg-white overflow-hidden shadow-sm">
      {/* Red accent header strip */}
      <div className="px-5 py-3 bg-gradient-to-r from-red-50 via-red-50/80 to-slate-50 border-b border-red-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center shrink-0 shadow-sm">
          <AlertTriangle size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">
            Sold out &mdash; this deal is no longer available
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The supplier may still source similar products, or explore our other live deals.
          </p>
        </div>
      </div>

      {/* Action cards row */}
      <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 bg-slate-50/50">
        {/* Card 1: Browse all deals */}
        <Link href="/deals" className={cardBase}>
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Search size={18} className="text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Browse All Deals</span>
            <p className="text-[11px] text-slate-400">21,000+ live wholesale deals</p>
          </div>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Card 2: Browse category */}
        <Link href={categoryHref} className={cardBase}>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Store size={18} className="text-[#1e5299]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">More {categoryName}</span>
            <p className="text-[11px] text-slate-400">Similar deals in this category</p>
          </div>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Card 3: Contact supplier about similar */}
        <button
          onClick={() => {
            const el = document.querySelector("[data-contact-section]");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          className={cardBase}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <MessageSquare size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">Contact Supplier</span>
            <p className="text-[11px] text-slate-400">Ask about similar products</p>
          </div>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </div>
    </div>
  );
}
