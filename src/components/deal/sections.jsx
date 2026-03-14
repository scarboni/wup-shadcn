"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ExternalLink, TrendingUp, CheckCircle2, Lock, Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

function PlatformComparison({ platforms, deal, isPremium }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {platforms.map((p, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Platform header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img src={p.icon} alt={p.name} className={p.name === "Ebay" ? "h-4 w-auto" : "w-5 h-5"} />
              <span className="text-sm font-bold text-slate-800">{p.name}</span>
            </div>
            <a href={p.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>
          {/* Pricing details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your price</span>
              <span className="font-semibold text-slate-800">{p.priceCurrency}{p.price.toFixed(2)} <span className="text-xs text-slate-400">{p.priceLabel}</span></span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Gross profit</span>
              <span className="font-semibold text-slate-800">{p.priceCurrency}{p.grossProfit.toFixed(2)} <span className="text-xs text-slate-400">{p.profitLabel}</span></span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">% Markup</span>
              <span className="text-lg font-extrabold" style={{ color: p.color }}>{p.markup.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SuperchargeCta() {
  const benefits = [
    "Discover trustworthy suppliers with low or no minimum order requirements.",
    "Unlock exclusive 'industry secret' suppliers you won't find on Google.",
    "Source fast-selling products at profit margins of 45% to 95%.",
    "Find the suppliers you need, guaranteed, with our custom sourcing pledge.",
  ];

  return (
    <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Illustration */}
        <div className="hidden lg:block shrink-0">
          <Image
            src="/deals-vector.svg"
            alt="Supercharge"
            width={128}
            height={128}
            className="w-32 h-auto"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 mb-4">Ready to Supercharge Your Business?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-base text-slate-600 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
          <a href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 rounded-lg transition-all">
            <Lock size={14} /> Try it Now!
          </a>
        </div>
      </div>
    </div>
  );
}

function TrustSection() {
  /* PRODUCTION (H2): Fetch stats from GET /api/stats, testimonials from GET /api/testimonials */
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", role: "Online Retailer", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleUp as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", role: "Dropshipper", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", role: "Amazon Seller", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", role: "Wholesale Buyer", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", role: "Dropshipper", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", role: "eBay Seller", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", role: "Online Retailer", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", role: "Amazon Seller", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", role: "Online Reseller", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", role: "Wholesale Buyer", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", role: "Dropshipper", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", role: "Online Retailer", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
  ];

  const scrollRef = useRef(null);

  return (
    <div className="mt-12">
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
          onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {testimonials.map((t) => (
              <div key={t.name} className="w-72 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - t.rating }, (_, i) => (
                    <Star key={`e${i}`} size={12} className="text-slate-200" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role} — {t.location}</p>
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

export { PlatformComparison, SuperchargeCta, TrustSection };
