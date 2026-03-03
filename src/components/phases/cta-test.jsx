"use client";

import { useState } from "react";
import { Lock, ShoppingCart, Store, User, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════
   VARIATION A — Current design (single Register Now button)
   ═══════════════════════════════════════════════════ */
function VariationA() {
  return (
    <div className="bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
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
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Now you can buy wholesale and dropship products at profit margins of 45% to 95%, confident that they&apos;re already selling successfully — and in volume — on eBay and Amazon.
        </p>
        <a href="/register" className="inline-flex px-8 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300">
          Register Now!
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VARIATION B — Two buttons: "I want to buy" + "I want to sell"
   Inspired by the Merkandi example. Keeps our existing
   illustration style and warm gradient, but replaces the
   single CTA with a dual-path choice.
   ═══════════════════════════════════════════════════ */
function VariationB() {
  return (
    <div className="bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
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
  );
}

/* ═══════════════════════════════════════════════════
   VARIATION C — Dual-path with description cards
   A more detailed version where each path has its
   own value proposition, closer to a landing page feel.
   ═══════════════════════════════════════════════════ */
function VariationC() {
  return (
    <div className="bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
      {/* Center content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Get Started!</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
          Ready to Increase Your<br />Profits?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-10">
          Whether you&apos;re sourcing products or looking for new customers, WholesaleUp connects you with the right partners.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          {/* Retailer card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-lg hover:border-orange-200 transition-all group">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-slate-800 transition-colors">
              <ShoppingCart size={22} className="text-slate-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">For Retailers</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Access verified wholesale deals at 45-95% profit margins. Source from trusted UK and EU suppliers.
            </p>
            <a href="/register?type=retailer" className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-all w-full justify-center">
              I want to buy <ArrowRight size={13} />
            </a>
          </div>

          {/* Supplier card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-lg hover:border-orange-200 transition-all group">
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors">
              <Store size={22} className="text-orange-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">For Suppliers</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">
              Reach thousands of active buyers. List your wholesale deals and grow your B2B customer base.
            </p>
            <a href="/register?type=supplier" className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all w-full justify-center">
              I want to sell <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TEST PAGE — Shows all variations side by side
   ═══════════════════════════════════════════════════ */
export default function CtaTestPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">CTA Banner — Test Variations</h1>
        <p className="text-sm text-slate-500 mb-10">Evaluating whether a dual-path (buy/sell) CTA makes sense for WholesaleUp, inspired by the Merkandi example.</p>

        {/* Variation A */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold text-white bg-slate-700 rounded-full">A</span>
            <h2 className="text-lg font-bold text-slate-800">Current — Single "Register Now!" button</h2>
            <span className="text-xs text-slate-400 ml-auto">Currently live on /deals and /suppliers</span>
          </div>
          <VariationA />
          <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Pros:</span> Simple, single clear CTA, no decision fatigue.
              <br />
              <span className="font-bold text-slate-800">Cons:</span> Doesn&apos;t differentiate between buyer and seller intent. The copy is buyer-focused (&ldquo;profit margins&rdquo;, &ldquo;selling on eBay and Amazon&rdquo;) which may not resonate with suppliers wanting to list their products.
            </p>
          </div>
        </div>

        {/* Variation B */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full">B</span>
            <h2 className="text-lg font-bold text-slate-800">Dual Buttons — Merkandi-inspired inline</h2>
            <span className="text-xs text-emerald-600 font-semibold ml-auto">Recommended</span>
          </div>
          <VariationB />
          <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Pros:</span> Minimal change from current design. Immediately signals that WholesaleUp serves both sides of the marketplace. Copy is neutral. &ldquo;I want to buy&rdquo; / &ldquo;I want to sell&rdquo; is clear, action-oriented, and removes ambiguity. Dark button for buy + orange for sell creates visual hierarchy matching the header&apos;s &ldquo;For retailers&rdquo; / &ldquo;For suppliers&rdquo; pattern.
              <br />
              <span className="font-bold text-slate-800">Cons:</span> Two options introduce a small decision point. Users may hesitate if they don&apos;t cleanly fit one category.
            </p>
          </div>
        </div>

        {/* Variation C */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">C</span>
            <h2 className="text-lg font-bold text-slate-800">Dual Cards — Expanded with value propositions</h2>
          </div>
          <VariationC />
          <div className="mt-3 p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Pros:</span> Each path gets its own description, making the value proposition clearer for each audience. Card hover effects add polish. Icons reinforce the distinction. Works well as a landing-page-style section.
              <br />
              <span className="font-bold text-slate-800">Cons:</span> Takes up more vertical space. The side illustrations from A/B don&apos;t fit as well here (removed). May feel heavy at the bottom of a content-rich page like /deals.
            </p>
          </div>
        </div>

        {/* Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-3">Analysis</h3>
          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              The Merkandi example uses a simple dual-button approach (&ldquo;I want to sell&rdquo; / &ldquo;I want to buy&rdquo;) to funnel users into the right registration flow. This is worth adopting because WholesaleUp already distinguishes between retailers and suppliers in the header (&ldquo;For retailers&rdquo; / &ldquo;For suppliers&rdquo;), so the CTA should reinforce this.
            </p>
            <p>
              <span className="font-bold text-slate-800">Recommendation:</span> <span className="font-bold text-orange-600">Variation B</span> is the best balance — it integrates the dual-path concept with minimal visual disruption. The existing illustrations and gradient are preserved. The copy shifts from buyer-only to marketplace-neutral, and the two buttons use the same dark/orange colour scheme already established in the header buttons.
            </p>
            <p>
              Variation C is a good alternative if the panel appears on a dedicated landing page or registration page, but may be too heavy for the bottom of /deals and /suppliers listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
