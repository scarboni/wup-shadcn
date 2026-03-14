"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, TrendingUp, Truck, Heart, EyeOff, Eye, Lock, Rocket, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import { NoImagePlaceholder } from "./utils";

export function FrequentlyBoughtTogether({ deal, allDeals, isPremium, isLoggedIn }) {
  if (!deal.frequentlyBoughtTogether || deal.frequentlyBoughtTogether.length === 0) return null;
  const items = deal.frequentlyBoughtTogether
    .map((idx) => allDeals[idx])
    .filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-200 rounded">Bundle</span>
        <h2 className="text-lg font-bold text-slate-900">Frequently Bought Together</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
            onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-50 mb-3">
              {item.img ? (
                <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
              ) : (
                <NoImagePlaceholder />
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/75 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">{item.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-slate-900">€{item.price}</span>
              {item.rrp && <span className="text-xs text-slate-400 line-through">€{item.rrp}</span>}
              {item.markup && <span className="text-xs font-semibold text-emerald-600">+{item.markup}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RelatedDealsCarousel({ label, title, subtitle, cta, deals, isPremium, isLoggedIn, canViewSupplier = false }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === -1 ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          {cta || "Explore Deals"} <ArrowRight size={14} />
        </a>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {deals.map((d, i) => (
            <div key={d.title || i} className="shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] snap-start">
              <RelatedDealCard deal={d} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
            </div>
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>
    </div>
  );
}

function RelatedDealCard({ deal, isPremium, isLoggedIn, canViewSupplier = false, onContact }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && deal.isSupplierPro);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col h-full relative">
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <EyeOff size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Deal hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-4 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5">
            <Eye size={12} /> Unhide Deal
          </button>
        </div>
      )}

      {/* Card body — clickable link to deal page */}
      <a href="/deal" className="block flex-1 cursor-pointer">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
          {deal.image ? (
            <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="100%" onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <NoImagePlaceholder />
          )}
          {/* Markup badge (top-right) */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
            <TrendingUp size={10} /> {deal.markup}%
          </div>
          {/* Tags (top-left, stacked) */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              {deal.tags.map((tag) => (
                tag === "Dropship" ? (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm flex items-center gap-1">
                    <Truck size={10} /> DROPSHIP
                  </span>
                ) : (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">NEW</span>
                )
              ))}
            </div>
          )}
          {/* Price badge (bottom-left, on image) */}
          <div className="absolute bottom-2 left-2 flex flex-col items-start">
            {deal.discountPercentage > 0 && (
              <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">-{deal.discountPercentage}% DISCOUNT</div>
            )}
            <div className={`${deal.discountPercentage > 0 ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
              <span className={`text-base font-extrabold ${deal.discountPercentage > 0 ? "text-white" : "text-orange-600"}`}>£{deal.price.toFixed(2)}</span>
              <span className={`text-[10px] ml-1 ${deal.discountPercentage > 0 ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
            </div>
          </div>
          {/* Hide + Favourite buttons (bottom-right, hover only) */}
          <div className={`absolute bottom-2 right-2 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setHidden(true) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <EyeOff size={12} className="text-slate-400" />
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setFaved(!faved) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <Heart size={12} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>
        <div className="p-3.5 pb-0">
          {deal.firstOrderDiscount && (
            <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderDiscount.label}</span></div>
          )}
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">{deal.title}</h3>
          {/* RRP + Profit rows */}
          <div className="border-t border-slate-100">
            {/* Column headers */}
            <div className="flex items-center px-1 pt-2 pb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
              <span className="w-10 shrink-0" />
              <span className="flex-1">Price</span>
              <span>Profit</span>
            </div>
            {/* RRP */}
            <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
              <span className="text-[13px] font-bold text-slate-400 w-10 shrink-0">RRP</span>
              <span className="flex-1 text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}</span>
              <span className="text-[13px] text-emerald-600 font-bold tabular-nums">£{deal.profit.toFixed(2)}</span>
            </div>
            {/* Amazon */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.amazon.com", "_blank"); }}
              className="flex items-center px-1 py-2 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#FF9900"}}>£{deal.profit.toFixed(2)}</span>
            </div>
            {/* eBay */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.ebay.com", "_blank"); }}
              className="flex items-center px-1 py-2 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">£{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#0064D2"}}>£{deal.profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </a>
      {/* Action button — three-tier gating, NOT part of the card link */}
      <div className="p-3.5 pt-3">
        {canContact ? (
          <button onClick={() => onContact?.(deal)} className="w-full py-2.5 text-sm font-bold rounded-lg bg-[#1e5299] hover:bg-[#174280] text-white flex items-center justify-center gap-1.5 mt-auto shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <MessageSquare size={14} /> Send Enquiry
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="block w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-center mt-auto flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Send Enquiry
          </a>
        ) : (
          <button onClick={openRegisterModal} className="w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Join Now!
          </button>
        )}
      </div>
    </div>
  );
}
