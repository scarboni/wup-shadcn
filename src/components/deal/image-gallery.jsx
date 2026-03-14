"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, TrendingUp, AlertTriangle, Truck, Play, Zap, Tag, Handshake, Sparkles, RefreshCw, Clock, RotateCcw } from "lucide-react";

export default function ImageGallery({ images, deal }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const hasVideo = !!deal.videoUrl;
  const visibleThumbs = showAll ? images : images.slice(0, hasVideo ? 3 : 4);
  const remaining = images.length - (hasVideo ? 3 : 4);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image / Video */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
        {showVideo && deal.videoUrl ? (
          <iframe
            src={deal.videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Product video"
          />
        ) : (
        <Image
          src={images[selectedIndex]}
          alt="Product"
          fill
          className={`object-cover ${deal.isExpired ? "grayscale-[70%] opacity-80" : ""}`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        )}

        {/* Top-left badges: Grade, Dropship, Negotiable */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {deal.grade && !deal.isExpired && (() => {
            const gradeStyles = {
              "new": { Icon: Sparkles, bg: "bg-emerald-500" },
              "refurbished": { Icon: RefreshCw, bg: "bg-blue-500" },
              "used": { Icon: Clock, bg: "bg-slate-500" },
              "returns / mixed stock": { Icon: RotateCcw, bg: "bg-amber-600" },
              "liquidation stocklots": { Icon: Zap, bg: "bg-red-600" },
            };
            const gs = gradeStyles[deal.grade.toLowerCase()] || { Icon: null, bg: "bg-slate-400" };
            return (
              <span className={`px-2.5 py-1 text-xs font-bold ${gs.bg} text-white rounded-md shadow-sm inline-flex items-center gap-1`}>
                {gs.Icon && <gs.Icon size={11} />} {deal.grade.toUpperCase()}
              </span>
            );
          })()}
          {deal.isDropship && (
            <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Truck size={11} /> DROPSHIP
            </span>
          )}
          {deal.negotiable && !deal.isExpired && (
            <span className="px-2.5 py-1 text-xs font-bold bg-orange-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Handshake size={11} /> NEGOTIABLE
            </span>
          )}
          {deal.readyToShip && !deal.isExpired && (
            <span className="px-2.5 py-1 text-xs font-bold bg-teal-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Zap size={11} /> READY TO SHIP
            </span>
          )}
          {deal.firstOrderDiscount && !deal.isExpired && (
            <span className="px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Tag size={11} /> −{deal.firstOrderDiscount.percentage}% FIRST ORDER
            </span>
          )}
        </div>

        {/* Top-right badge: Margin % — computed from RRP vs wholesale price */}
        {deal.rrp != null && deal.price != null && (
        <div className={`absolute top-3 right-3 px-2.5 py-1 ${deal.isExpired ? "bg-slate-400" : "bg-emerald-500"} text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-sm`}>
          <TrendingUp size={11} /> {((deal.rrp - deal.price) / deal.rrp * 100).toFixed(0)}%
        </div>
        )}

        {/* Sold out overlay — large label + desaturated image via CSS filter on parent */}
        {deal.isExpired && (
          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center z-10">
            <div className="bg-red-500 text-white px-8 py-3.5 rounded-xl text-lg font-extrabold shadow-2xl flex items-center gap-2.5 -rotate-6 tracking-wide">
              <AlertTriangle size={22} /> SOLD OUT
            </div>
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-2">
        {/* Video thumbnail */}
        {hasVideo && (
          <button
            onClick={() => { setShowVideo(true); }}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative flex items-center justify-center bg-slate-900 ${
              showVideo ? "border-orange-400 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Play size={20} className="text-white" />
            <span className="absolute bottom-0.5 left-0 right-0 text-[10px] text-white font-bold text-center">VIDEO</span>
          </button>
        )}
        {visibleThumbs.map((img, i) => (
          <button
            key={i}
            onClick={() => { setShowVideo(false); setSelectedIndex(i); }}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
              !showVideo && selectedIndex === i ? "border-orange-400 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <Image src={img} alt={`View ${i + 1}`} fill className={`object-cover ${deal.isExpired ? "grayscale-[70%] opacity-80" : ""}`} sizes="64px" />
          </button>
        ))}
        {!showAll && remaining > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-16 h-16 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 hover:border-slate-300 transition-all"
          >
            {remaining}+
          </button>
        )}
      </div>
    </div>
  );
}
