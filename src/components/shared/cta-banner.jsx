"use client";

import { ShoppingCart, Store, ArrowRight, BadgeCheck, Users, Globe } from "lucide-react";
import DotWorldMap from "@/components/shared/dot-world-map";

export default function CtaBanner({ className = "mt-6 mb-16" }) {
  return (
    <div className={`${className} relative overflow-hidden rounded-2xl`}>
      <div className="bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a] px-6 sm:px-12 py-12 sm:py-16 relative overflow-hidden">
        {/* Scrolling dot world map background with edge fade */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              mask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)",
              WebkitMask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)",
            }}
          >
            <DotWorldMap opacity={0.18} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />

        <div className="relative z-10 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Trusted by 901,900+ Resellers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ready to Increase Your<br />
            <span className="text-orange-400">Reseller Profits?</span>
          </h2>

          <p className="text-base text-sky-100/60 leading-relaxed mb-8 max-w-md mx-auto">
            Access 42,900+ verified suppliers and exclusive wholesale deals with the best margins.
          </p>

          {/* Glassmorphism action zone */}
          <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-6 sm:px-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
              <a
                href="/register?type=supplier"
                className="inline-flex items-center gap-2.5 w-full md:w-auto justify-center whitespace-nowrap px-10 py-4 text-sm font-bold text-slate-900 bg-white hover:bg-sky-50 rounded-xl transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-black/20 active:scale-95 group"
                aria-label="Register as a supplier"
              >
                <Store size={16} />
                I supply wholesale goods
                <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-2.5 w-full md:w-auto justify-center whitespace-nowrap px-10 py-4 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95 group"
                aria-label="Register as a retailer"
              >
                <ShoppingCart size={16} />
                I resell for profit
                <ArrowRight size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
              </a>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-sky-100/50">
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={13} className="text-orange-400" />
              42,900+ verified suppliers
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-orange-400" />
              901,900+ resellers
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={13} className="text-orange-400" />
              EU, UK &amp; North America
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
