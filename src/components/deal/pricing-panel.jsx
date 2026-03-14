"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Heart,
  Truck,
  Package,
  Mail,
  Phone,
  X,
  ShoppingCart,
  ClipboardList,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Banknote,
  Palette,
  Undo2,
  BoxSelect,
  Calendar,
  Scale,
  Ruler,
  Ban,
  Users,
  Layers,
  Container,
  Timer,
  Tag,
  Percent,
  Rocket,
  Gem,
  FlaskConical,
  Sparkles,
  FileCheck,
  Barcode,
  Shield,
  Ship,
  CircleDot,
  HelpCircle,
  Info,
  MessageSquare,
  Handshake,
  RotateCcw,
  Shuffle,
  Archive,
} from "lucide-react";
import ContactSupplierModal from "@/components/shared/contact-modal";
import { InfoTooltip, FlagImg } from "./utils";

const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

export default function PricingPanel({ deal, isPremium, isLoggedIn, canViewSupplier, isSoldOut = false }) {
  /* ── Deal page enquiry access ──
     On /deal, Standard CAN enquire about ALL deals (Supplier + Supplier Pro).
     Free can only enquire about Supplier Pro deals. Guest cannot enquire at all.
     NOTE: Different from /supplier and /suppliers where Standard CANNOT contact Supplier Free.
     canViewSupplier = Standard, Premium, Premium+, Supplier Pro. */
  const canEnquireDeal = isLoggedIn && (deal.supplier?.isSupplierPro || canViewSupplier);

  /* ── Contact details visibility (phone numbers) ──
     Supplier Pro listings → ALL logged-in see contacts.
     Supplier Free listings → only Premium, Premium+, Supplier Pro.
     Standard CANNOT see Supplier Free phone numbers (but CAN send enquiries via modal). */
  const canViewContacts = isLoggedIn && (deal.supplier?.isSupplierPro || isPremium);

  const [contactOpen, setContactOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [pricingHelpOpen, setPricingHelpOpen] = useState(false);
  const detailsRef = useRef(null);
  const collapseWrapperRef = useRef(null);
  const [detailsOverflows, setDetailsOverflows] = useState(false);
  const COLLAPSED_HEIGHT = 420;

  useEffect(() => {
    if (!detailsRef.current) return;
    const check = () => setDetailsOverflows(detailsRef.current.scrollHeight > COLLAPSED_HEIGHT + 20);
    check();
    // Re-check on window resize
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [deal]);

  // V2: Lead time labels
  const LEAD_TIME_LABELS = { "same-day": "Same Day", "1-2-days": "1–2 Days", "3-5-days": "3–5 Days", "1-2-weeks": "1–2 Weeks", "2-4-weeks": "2–4 Weeks", "4-8-weeks": "4–8 Weeks", "8-plus-weeks": "8+ Weeks", "made-to-order": "Made to Order" };
  const SAMPLE_LABELS = { free: "Free Samples", paid: "Paid Samples", "on-request": "On Request", "not-available": "Not Available", none: "Not Available" };

  // European number formatting (period as thousands separator)
  const fmtNum = (n) => Number(n).toLocaleString('de-DE');

  // Derive unit label from priceUnit (e.g. "/ Pallet ex. VAT" → "pallets")
  // Only pluralize the unit word; preserve "ex. VAT" suffix untouched
  const moqUnitLabel = (() => {
    if (!deal.priceUnit) return "units";
    const stripped = deal.priceUnit.replace(/^\/\s*/, ""); // "Pallet ex. VAT"
    const match = stripped.match(/^(\S+)(.*)/);            // ["Pallet ex. VAT", "Pallet", " ex. VAT"]
    if (!match) return "units";
    const unit = match[1].toLowerCase() + "s";             // "pallets"
    const suffix = match[2];                               // " ex. VAT" (preserved as-is)
    return unit + suffix;
  })();
  // Singularize/pluralize unit based on quantity (1 Pallet ex. VAT vs 45 pallets ex. VAT)
  const fmtUnit = (qty) => {
    if (qty === 1) {
      return moqUnitLabel.replace(/^(\w+?)s\b/i, (_, w) => w.charAt(0).toUpperCase() + w.slice(1));
    }
    return moqUnitLabel;
  };

  // Smart price display — drop .00 decimals (€880 not €880.00), keep real cents (€228.04)
  const fmtPrice = (n) => n % 1 === 0 ? n.toLocaleString('de-DE') : n.toFixed(2);

  // Extract the selling unit name from priceUnit for dynamic copy (e.g. "/ Pallet ex. VAT" → "pallet")
  const priceUnitName = (() => {
    const m = deal.priceUnit?.match(/^\/\s*(\S+)/);
    return m ? m[1].toLowerCase() : "unit";
  })();

  // V2: Compute estimated delivery date from leadTime
  const computeEstDelivery = () => {
    const days = { "same-day": [0,0], "1-2-days": [1,2], "3-5-days": [3,5], "1-2-weeks": [7,14], "2-4-weeks": [14,28], "4-8-weeks": [28,56], "8-plus-weeks": [56,90] };
    const range = days[deal.leadTime];
    if (!range) return null;
    const fmt = (d) => d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
    const d1 = new Date(); d1.setDate(d1.getDate() + range[0]);
    const d2 = new Date(); d2.setDate(d2.getDate() + range[1]);
    return `${fmt(d1)} – ${fmt(d2)}`;
  };
  const estDelivery = computeEstDelivery();

  return (
    <>
    <div className={`bg-white rounded-xl border overflow-hidden shadow-lg ${isSoldOut ? "border-red-200" : "border-slate-200"}`}>
      {/* Sold Out notice strip */}
      {isSoldOut && (
        <div className="px-5 py-2.5 bg-red-50 border-b border-red-200 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500 shrink-0" />
          <span className="text-xs font-bold text-red-700">This deal has sold out</span>
          <span className="text-xs text-red-500 ml-auto">Pricing data may be stale</span>
        </div>
      )}
      {/* 1. Price header + min order */}
      <div className={`border-b border-slate-100 ${isSoldOut ? "opacity-40 pointer-events-none" : ""}`}>
        <div className="p-5">
        {(() => {
          // When price tiers exist, show the lowest tier price with "from"
          const hasVolume = deal.priceTiers && deal.priceTiers.length > 0;
          const lowestPrice = hasVolume
            ? Math.min(...deal.priceTiers.map(pt => pt.price))
            : deal.price;
          const showFrom = hasVolume && lowestPrice < deal.price;
          return (
          <div className="flex items-baseline gap-2 flex-wrap">
            {(hasVolume) && <span className="text-sm font-medium text-slate-500">from</span>}
            <span className="text-3xl font-extrabold text-orange-600">{deal.currency}{(showFrom ? lowestPrice : deal.price).toFixed(2)}</span>
            <span className="text-sm text-slate-500">{deal.priceUnit}</span>
            {deal.negotiable && <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-md"><Handshake size={10} /> Negotiable</span>}
          </div>
          );
        })()}
        {deal.rrp != null ? (
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-500">RRP: <span className="font-semibold text-slate-600 line-through">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span></span>
          <InfoTooltip text={
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-300">Recommended Retail Price</p>
              <p>The manufacturer's suggested selling price to end consumers.</p>
              <div className="border-t border-slate-700 pt-1.5 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between"><span className="text-slate-400">RRP</span><span className="text-white">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Your cost</span><span className="text-white">{deal.currency}{Number(deal.price).toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-slate-700 pt-1"><span className="text-emerald-400 font-semibold">Margin</span><span className="text-emerald-400 font-semibold">{deal.rrpCurrency}{(deal.rrp - deal.price).toFixed(2)} ({((deal.rrp - deal.price) / deal.rrp * 100).toFixed(0)}%)</span></div>
              </div>
            </div>
          } />
          {/* Margin callout — show % below RRP */}
          {(() => {
            const marginPct = ((deal.rrp - deal.price) / deal.rrp * 100).toFixed(0);
            return marginPct > 0 ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md">
                <TrendingUp size={10} /> {marginPct}% margin
              </span>
            ) : null;
          })()}
        </div>
        ) : (
        <p className="mt-1.5 text-sm text-slate-500 italic">No RRP available — this is a mixed lot / liquidation pallet priced as a whole unit.</p>
        )}
        {/* V2: Min order — show MOQ with unit + monetary amount */}
        {(deal.moq || deal.minimumOrderAmount) && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
            <Package size={13} className="text-slate-400 shrink-0" />
            <span>Min. order:{' '}
              <span className="font-semibold">{deal.moq
                ? <>{fmtNum(deal.moq)} {fmtUnit(deal.moq)}{deal.minimumOrderAmount ? <> ({deal.minimumOrderCurrency}{fmtNum(deal.minimumOrderAmount)})</> : ''}</>
                : <>{deal.minimumOrderCurrency}{fmtNum(deal.minimumOrderAmount)}</>
              }</span>
            </span>
          </div>
        )}
        </div>
      </div>

      {/* Sold-out grey wrapper for pricing data sections (2-5) */}
      <div className={isSoldOut ? "opacity-40 pointer-events-none" : ""}>
      {/* 2. Volume pricing — unit price at quantity breaks (from canonical priceTiers) */}
      {deal.priceTiers && deal.priceTiers.length > 0 && (() => {
        // Extract unit name from priceUnit (e.g. "/ Pallet ex. VAT" → "/ Pallet")
        const unitMatch = deal.priceUnit?.match(/^\/\s*(\S+)/);
        const unitSuffix = unitMatch ? ` / ${unitMatch[1]}` : '';
        const tierUnit = moqUnitLabel;
        return (
        <div className="px-5 py-3 border-b border-slate-100 space-y-1.5">
          {deal.priceTiers.map((pt, i) => {
            const range = pt.maxQty
              ? `from ${pt.minQty.toLocaleString()} to ${pt.maxQty.toLocaleString()} ${tierUnit}`
              : `from ${pt.minQty.toLocaleString()}+ ${tierUnit}`;
            return (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">{deal.currency}{fmtPrice(pt.price)}<span className="font-normal text-slate-500 text-xs ml-1">{unitSuffix}</span></span>
              <span className="text-slate-500 italic">{range}</span>
            </div>
            );
          })}
        </div>
        );
      })()}

      {/* 3. Supplier BULK DISCOUNT tiers — inherited from Supplier Profile form
          (supplier-profile-form.jsx → Orders & Payments tab → "Discount Tiers" + "Discount Notes").
          These are volume-based discounts that apply across all the supplier's deals.
          PRODUCTION: If the deal has custom discount tiers, those override the supplier defaults.
          API: deal.discountTiers / deal.discountNotes may come from deal table or fall back to supplier_profiles. */}
      {deal.discountTiers && deal.discountTiers.length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2 flex items-center gap-1">Bulk Discounts <InfoTooltip text={
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-300">How bulk discounts work</p>
              <div className="flex items-start gap-2"><Percent size={11} className="text-emerald-400 shrink-0 mt-0.5" /><span>Discount applies to your <span className="text-white font-medium">total order value</span></span></div>
              <div className="flex items-start gap-2"><Layers size={11} className="text-emerald-400 shrink-0 mt-0.5" /><span>Stacks with volume tier pricing if applicable</span></div>
              <div className="flex items-start gap-2"><Tag size={11} className="text-emerald-400 shrink-0 mt-0.5" /><span>Applied per single order</span></div>
            </div>
          } /></p>
          {deal.discountTiers.map((dt, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-0.5">
              <span className="text-slate-500">Orders {dt.currency}{Number(dt.minOrder).toLocaleString()}+</span>
              <span className="font-bold text-emerald-600">{dt.discount}% off</span>
            </div>
          ))}
          {/* PRODUCTION: discountNotes is inherited from Supplier Profile form
              (supplier-profile-form.jsx → Orders & Payments tab → "Discount Notes" textarea).
              Provides additional context about discount policy (seasonal promos, loyalty, negotiable terms).
              API: deal.discountNotes may come from deal table or fall back to supplier_profiles. */}
          {deal.discountNotes && (
            <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100 leading-relaxed italic">{deal.discountNotes}</p>
          )}
        </div>
      )}

      {/* 3b. How pricing works — contextual explainer when multiple pricing mechanisms exist */}
      {deal.priceTiers && deal.priceTiers.length > 0 && deal.discountTiers && deal.discountTiers.length > 0 && (
        <div className="border-b border-slate-100">
          <button
            onClick={() => setPricingHelpOpen(!pricingHelpOpen)}
            className="w-full px-5 py-2.5 flex items-center justify-between text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 transition-colors"
          >
            <span className="flex items-center gap-1.5"><HelpCircle size={12} /> How pricing works</span>
            {pricingHelpOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {pricingHelpOpen && (
            <div className="px-5 pb-3 space-y-2 animate-fadeIn">
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 leading-relaxed space-y-1.5">
                <p><span className="font-semibold text-slate-700">1. {priceUnitName.charAt(0).toUpperCase() + priceUnitName.slice(1)} price</span> — the base price per {priceUnitName} shown at the top.</p>
                <p><span className="font-semibold text-slate-700">2. Volume tiers</span> — when you order larger quantities, the per-{priceUnitName} price drops according to the tiers above.</p>
                <p><span className="font-semibold text-slate-700">3. Bulk discounts</span> — an additional percentage discount applied to your total order value when it exceeds the thresholds shown.</p>
                <p className="text-slate-500 pt-1 border-t border-slate-200">Volume tier pricing and bulk discounts stack — you get the lower {priceUnitName} price <em>and</em> the percentage discount on the total.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Urgency row — moved to badges row above deal title */}

      {/* 5. Profit comparison table (existing) */}
      {deal.rrp != null && deal.platforms && deal.platforms.length > 0 ? (
      <div>
        <div className="grid grid-cols-4 px-5 py-2.5 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Platform</span>
          <span className="text-right">Price</span>
          <span className="text-right"><span className="hidden lg:inline">Gross </span>Profit</span>
          <span className="text-right">%Markup</span>
        </div>
        <div className="grid grid-cols-4 items-center px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-700">RRP</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-700">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span>
            <p className="text-xs text-slate-500">/ Unit</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-700">{deal.rrpCurrency}{(deal.rrp - deal.price).toFixed(2)}</span>
            <p className="text-xs text-slate-500">/ Unit</p>
          </div>
          <span className="flex justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-sm font-bold rounded-md">
              <TrendingUp size={11} /> {deal.markup}%
            </span>
          </span>
        </div>
        {deal.platforms.map((p, i) => (
          <div key={i} className={`grid grid-cols-4 items-center px-5 py-3 ${i < deal.platforms.length - 1 ? "border-b border-slate-100" : ""}`}>
            <div className="flex items-center gap-2">
              <img src={p.icon} alt={p.name} className={`h-5 ${["Ebay", "Amazon"].includes(p.name) ? "w-auto max-w-none" : "w-5"} object-contain`} />
              {p.verifyUrl && (
                <a href={p.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-500 transition-colors" title={`View on ${p.name}`}>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-700">{p.priceCurrency}{p.price.toFixed(2)}</span>
              <p className="text-xs text-slate-500">/ Unit</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-700">{p.priceCurrency}{p.grossProfit.toFixed(2)}</span>
              <p className="text-xs text-slate-500">/ Unit</p>
            </div>
            <span className="flex justify-end">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-white text-sm font-bold rounded-md" style={{ backgroundColor: p.color }}>
                <TrendingUp size={11} /> {p.markup.toFixed(2)}%
              </span>
            </span>
          </div>
        ))}
      </div>
      ) : null}
      </div>{/* end sold-out grey wrapper */}


      {/* ═══════════════════════════════════════════════════════
          8. GROUPED DEAL SPECIFICATIONS
          Follows the All Variables genre taxonomy for consistency.
          Each group has a titled header → key-value grid.
          ═══════════════════════════════════════════════════════ */}

      {/* ── 8a. Order & Quantity ── */}
      <div className="border-t border-slate-100">
        <div className="px-5 pt-3 pb-1">
          <h3 className="text-sm font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1.5"><ShoppingCart size={12} /> Order & Quantity</h3>
        </div>
        <div className="px-5 pb-3">
          <div className="grid grid-cols-[155px_1fr] gap-x-4 gap-y-2 text-sm">
            {/* 1. What am I getting? */}
            <span className="text-slate-500 inline-flex items-center gap-1">Grade {(() => {
              const GRADES = [
                { key: "New",            icon: Sparkles,   desc: "Factory-sealed, original packaging" },
                { key: "Refurbished",    icon: RotateCcw,  desc: "Restored to working condition" },
                { key: "Grade A",        icon: ShieldCheck, desc: "Like new — minimal or no signs of use" },
                { key: "Grade B",        icon: Shield,     desc: "Minor cosmetic wear, fully functional" },
                { key: "Grade C",        icon: CircleDot,  desc: "Visible wear, fully functional" },
                { key: "Mix / returns",  icon: Shuffle,    desc: "Mixed lot, various conditions" },
                { key: "Surplus",        icon: Archive,    desc: "Overstock — typically new, original packaging" },
              ];
              const current = deal.grade;
              return <InfoTooltip text={
                <div className="space-y-1">
                  <p className="font-semibold text-slate-300 mb-1.5">Product condition</p>
                  {GRADES.map(({ key, icon: Icon, desc }) => {
                    const isCurrent = key === current;
                    return (
                      <div key={key} className={`flex items-start gap-2 py-0.5 ${isCurrent ? "text-orange-300" : "text-slate-400"}`}>
                        <Icon size={12} className={`shrink-0 mt-0.5 ${isCurrent ? "text-orange-400" : "text-slate-500"}`} />
                        <span><span className={`font-semibold ${isCurrent ? "text-white" : "text-slate-200"}`}>{key}</span> — {desc}</span>
                      </div>
                    );
                  })}
                </div>
              } />;
            })()}</span>
            <span className="font-semibold text-slate-800">{deal.grade}</span>

            {deal.stockLocation && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Stock location <InfoTooltip text="Country where the stock is physically held. May differ from the supplier's registered country." /></span>
              <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
                <FlagImg code={deal.stockLocationCode} size={16} /> {deal.stockLocation}
              </span>
            </>)}

            {/* Show selling unit derived from priceUnit when non-obvious (not "/ Unit" or "/ Piece") */}
            {deal.priceUnit && !/^\/ ?(Unit|Piece)$/i.test(deal.priceUnit) && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Selling unit <InfoTooltip text="What constitutes one unit in this listing — e.g. a pack, a pallet, or a set." /></span>
              <span className="font-semibold text-slate-800">{deal.priceUnit.replace(/^\/\s*/, "")}</span>
            </>)}

            {/* 2. How do I order? */}
            <span className="text-slate-500 inline-flex items-center gap-1">MOQ <InfoTooltip text={
              <div className="space-y-1.5">
                <p className="font-semibold text-slate-300">Minimum Order Quantity</p>
                <p>The smallest number of units you can purchase in a single order.</p>
                {(deal.orderIncrement || deal.casePackSize) && (
                  <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px]">
                    {deal.orderIncrement && <div className="flex items-start gap-2"><Layers size={11} className="text-slate-500 shrink-0 mt-0.5" /><span>Must order in multiples of <span className="text-white font-semibold">{deal.orderIncrement}</span></span></div>}
                    {deal.casePackSize && deal.casePackSize > 1 && <div className="flex items-start gap-2"><Package size={11} className="text-slate-500 shrink-0 mt-0.5" /><span>Packed <span className="text-white font-semibold">{deal.casePackSize}</span> units/case</span></div>}
                  </div>
                )}
              </div>
            } /></span>
            <span className="font-semibold text-slate-800">{fmtNum(deal.moq)} {fmtUnit(deal.moq)}</span>

            {deal.orderIncrement && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Order increment <InfoTooltip text="Orders must be placed in multiples of this number above the MOQ." /></span>
              <span className="font-semibold text-slate-800">Multiples of {deal.orderIncrement}</span>
            </>)}

            {deal.casePackSize && deal.casePackSize > 1 && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Case pack <InfoTooltip text="Number of individual units packed together in one case or carton." /></span>
              <span className="font-semibold text-slate-800">{deal.casePackSize} {fmtUnit(deal.casePackSize)}/case</span>
            </>)}

            {/* 3. How much is available? */}
            {deal.availableQuantity && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">In stock <InfoTooltip text="Total quantity currently available for immediate purchase." /></span>
              <span className="font-semibold text-slate-800">{fmtNum(deal.availableQuantity)} {fmtUnit(deal.availableQuantity)}</span>
            </>)}

            {deal.maxOrderQuantity && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Max order <InfoTooltip text="Maximum quantity allowed per single order." /></span>
              <span className="font-semibold text-slate-800">{fmtNum(deal.maxOrderQuantity)} {fmtUnit(deal.maxOrderQuantity)}</span>
            </>)}

            {/* 4. Can I try first? */}
            {deal.sampleAvailability && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Samples <InfoTooltip text={
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-300">Sample availability</p>
                  <p>Order a small quantity to evaluate quality before committing to a full order.</p>
                  <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px]">
                    {[{ key: "free", label: "Free", desc: "No charge for samples" }, { key: "paid", label: "Paid", desc: "Sample fee applies" }, { key: "on-request", label: "On request", desc: "Contact supplier to arrange" }, { key: "not-available", match: ["not-available", "none"], label: "Not available", desc: "No samples offered" }].map(s => {
                      const isActive = s.match ? s.match.includes(deal.sampleAvailability) : deal.sampleAvailability === s.key;
                      return (
                      <div key={s.key} className={`flex items-start gap-2 ${isActive ? "text-orange-300" : "text-slate-400"}`}>
                        <FlaskConical size={11} className={`shrink-0 mt-0.5 ${isActive ? "text-orange-400" : "text-slate-500"}`} />
                        <span><span className={isActive ? "text-white font-semibold" : "text-slate-200 font-semibold"}>{s.label}</span> — {s.desc}</span>
                      </div>
                      );
                    })}
                  </div>
                </div>
              } /></span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Package size={13} className="text-slate-400" /> {SAMPLE_LABELS[deal.sampleAvailability] || deal.sampleAvailability}
                {deal.samplePrice && <span className="text-xs text-slate-400 ml-1">({deal.samplePrice.currency}{deal.samplePrice.amount.toFixed(2)})</span>}
              </span>
            </>)}
          </div>
        </div>
      </div>

      {/* ── Collapsible product details region ── */}
      <div ref={collapseWrapperRef} className="relative">
        <div ref={detailsRef} className={`${!detailsExpanded && detailsOverflows ? `overflow-hidden` : ""} transition-all duration-300`} style={!detailsExpanded && detailsOverflows ? { maxHeight: COLLAPSED_HEIGHT } : undefined}>

      {/* ── 8b. Product Details ── */}
      <div className="border-t border-slate-100">
        <div className="px-5 pt-3 pb-1">
          <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5"><Tag size={12} /> Product Details</h3>
        </div>
        {/* Variants rendered as grid rows after Materials */}
        <div className="px-5 pb-3">
          <div className="grid grid-cols-[155px_1fr] gap-x-4 gap-y-2 text-sm">
            {deal.brands && deal.brands.length > 0 && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">{deal.brands.length > 1 ? "Brands" : "Brand"} <InfoTooltip text="The manufacturer or brand name of the product." /></span>
              <span className="font-semibold text-orange-500">
                {deal.brands.map((b, i) => (
                  <span key={i}>{i > 0 && ", "}<a href={`/deals?any=${encodeURIComponent(b.name)}`} className="hover:underline">{b.name}</a></span>
                ))}
              </span>
            </>)}

            {deal.manufacturingCountry && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Made in <InfoTooltip text="Country where the product was manufactured or assembled." /></span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <FlagImg code={deal.manufacturingCountryCode} size={16} /> {deal.manufacturingCountry}
              </span>
            </>)}

            {deal.materials && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Materials <InfoTooltip text="Primary materials or composition of the product." /></span>
              <span className="font-semibold text-slate-800">{deal.materials}</span>
            </>)}

            {/* Variant values as simple text rows (Colors, Storage, etc.) */}
            {deal.variants && deal.variants.map((v, vi) => {
              const label = v.name.charAt(0).toUpperCase() + v.name.slice(1).toLowerCase();
              const displayLabel = label === "Color" ? "Colors" : label === "Colour" ? "Colours" : label === "Size" ? "Sizes" : label;
              return [
                <span key={`vl-${vi}`} className="text-slate-500 inline-flex items-center gap-1">{displayLabel} <InfoTooltip text={`Available ${displayLabel.toLowerCase()} for this product.`} /></span>,
                <span key={`vv-${vi}`} className="font-semibold text-slate-800">{v.options.join(", ")}</span>
              ];
            })}

            {deal.productLanguage && deal.productLanguage.length > 0 && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Labels <InfoTooltip text="Languages available on product labels, packaging, and instructions." /></span>
              <span className="font-semibold text-slate-800">{deal.productLanguage.join(", ")}</span>
            </>)}

            {deal.gender && deal.gender !== "Unisex" && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Gender <InfoTooltip text="Target gender for this product." /></span>
              <span className="font-semibold text-slate-800">{deal.gender}</span>
            </>)}

            {deal.seasonality && deal.seasonality !== "All Season" && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Season <InfoTooltip text="The season or time of year this product is best suited for." /></span>
              <span className="font-semibold text-slate-800">{deal.seasonality}</span>
            </>)}

            {deal.shelfLife && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Shelf life <InfoTooltip text="How long the product remains usable or sellable from date of manufacture." /></span>
              <span className="font-semibold text-slate-800">{deal.shelfLife}</span>
            </>)}

            {deal.bestBeforeDate && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Best before <InfoTooltip text="The date by which the product should be used or sold for best quality." /></span>
              <span className="font-semibold text-amber-600"><AlertTriangle size={13} className="inline mr-1" />{deal.bestBeforeDate}</span>
            </>)}

            {deal.ageRestriction && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Age restriction <InfoTooltip text="Minimum age required to purchase or use this product." /></span>
              <span className="font-semibold text-red-600 flex items-center gap-1"><Ban size={13} /> {deal.ageRestriction.minAge}+ ({deal.ageRestriction.reason})</span>
            </>)}

            {deal.warrantyInfo && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Warranty <InfoTooltip text="Warranty coverage provided by the manufacturer or supplier." /></span>
              <span className="font-semibold text-slate-800">{deal.warrantyInfo.duration} {deal.warrantyInfo.type}</span>
            </>)}

            {deal.targetAudience && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Target audience <InfoTooltip text="The intended buyer or end-user segment for this product." /></span>
              <span className="font-semibold text-slate-800">{Array.isArray(deal.targetAudience) ? deal.targetAudience.join(", ") : deal.targetAudience}</span>
            </>)}

            {deal.ipRating && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">IP rating <InfoTooltip text={(() => {
                const DUST = { "0": "No protection", "1": "Objects >50mm", "2": "Objects >12.5mm", "3": "Objects >2.5mm", "4": "Objects >1mm", "5": "Dust-protected", "6": "Dust-tight" };
                const WATER = { "0": "No protection", "1": "Dripping water", "2": "Dripping (15° tilt)", "3": "Spraying water", "4": "Splashing water", "5": "Water jets", "6": "Powerful jets", "7": "Immersion (1m)", "8": "Submersion (1m+)", "9": "High-pressure steam" };
                const m = deal.ipRating?.match(/IP(\d)([\dX])/i);
                const d = m ? m[1] : null;
                const w = m ? m[2] : null;
                return (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-slate-300">Ingress Protection</p>
                    <p>Resistance to dust and water per IEC 60529.</p>
                    {m && (
                      <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px] font-mono">
                        <div className="flex justify-between"><span className="text-slate-400">Solids (1st digit)</span><span className="text-white">{d} — {DUST[d] || "Unknown"}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Liquids (2nd digit)</span><span className="text-white">{w} — {w !== "X" ? (WATER[w] || "Unknown") : "Not tested"}</span></div>
                      </div>
                    )}
                  </div>
                );
              })()} /></span>
              <span className="font-semibold text-slate-800">{deal.ipRating}</span>
            </>)}

          </div>
        </div>
      </div>

      {/* ── 8b. Physical Specifications ── */}
      {(deal.netWeight || deal.dimensionsPerUnit || deal.packaging || deal.productDimensions) && (
      <div className="border-t border-slate-100">
        <div className="px-5 pt-3 pb-1">
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5"><Scale size={12} /> Physical Specifications</h3>
        </div>
        <div className="px-5 pb-3">
          <div className="grid grid-cols-[155px_1fr] gap-x-4 gap-y-2 text-sm">
            {/* 1. Product itself */}
            {deal.productDimensions && (<>
              <span className="text-slate-500">Product size</span>
              <span className="font-semibold text-slate-800">
                {deal.productDimensions.width}{deal.productDimensions.unit ? deal.productDimensions.unit : ""}{deal.productDimensions.length ? ` × ${deal.productDimensions.length}${deal.productDimensions.unit || ""}` : ""}
                {deal.productDimensions.height ? ` × ${deal.productDimensions.height}${deal.productDimensions.unit || ""}` : ""}
                {deal.productDimensions.notes && <span className="text-xs text-slate-400 ml-1">({deal.productDimensions.notes})</span>}
              </span>
            </>)}

            {/* 2. Product weight */}
            {deal.netWeight && (<>
              <span className="text-slate-500">Net weight</span>
              <span className="font-semibold text-slate-800">{deal.netWeight.value} {deal.netWeight.unit}</span>
            </>)}

            {/* 3. Packaged unit size */}
            {deal.dimensionsPerUnit && (<>
              <span className="text-slate-500">Box dimensions</span>
              <span className="font-semibold text-slate-800">{deal.dimensionsPerUnit.length} × {deal.dimensionsPerUnit.width} × {deal.dimensionsPerUnit.height} {deal.dimensionsPerUnit.unit}</span>
            </>)}

            {/* 4. Shipping package specs */}
            {deal.packaging && (<>
              <span className="text-slate-500">Shipping package</span>
              <span className="font-semibold text-slate-800">{deal.packaging.length} × {deal.packaging.width} × {deal.packaging.height} {deal.packaging.unit}, {deal.packaging.weight} {deal.packaging.weightUnit}</span>
            </>)}
          </div>
        </div>
      </div>
      )}

      {/* ── 8c. Identification Codes ── */}
      {(deal.sku || deal.ean || deal.taric || deal.mpn || deal.batchNumber) && (
      <div className="border-t border-slate-100">
        <div className="px-5 pt-3 pb-1">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Barcode size={12} /> Identification</h3>
        </div>
        <div className="px-5 pb-3">
          <div className="grid grid-cols-[155px_1fr] gap-x-4 gap-y-2 text-sm">
            {deal.sku && (<>
              <span className="text-slate-500">SKU</span>
              <span className="font-mono text-xs font-semibold text-slate-800">{deal.sku}</span>
            </>)}

            {deal.ean && (<>
              <span className="text-slate-500">EAN</span>
              <span className="font-mono text-xs font-semibold text-slate-800">{deal.ean}</span>
            </>)}

            {deal.mpn && (<>
              <span className="text-slate-500">MPN</span>
              <span className="font-mono text-xs font-semibold text-slate-800">{deal.mpn}</span>
            </>)}

            {deal.taric && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">TARIC <InfoTooltip text={
                <div className="space-y-1.5">
                  <p className="font-semibold text-slate-300">TARIC / HS Code</p>
                  <p>EU customs classification used to determine import duties and trade regulations.</p>
                  <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px]">
                    <div className="flex items-start gap-2"><FileCheck size={11} className="text-slate-500 shrink-0 mt-0.5" /><span>First 6 digits = international HS code</span></div>
                    <div className="flex items-start gap-2"><FileCheck size={11} className="text-slate-500 shrink-0 mt-0.5" /><span>Digits 7–10 = EU-specific TARIC extension</span></div>
                  </div>
                </div>
              } /></span>
              <span className="font-mono text-xs font-semibold text-slate-800">{deal.taric}</span>
            </>)}

            {deal.batchNumber && (<>
              <span className="text-slate-500">Batch/Lot</span>
              <span className="font-mono text-xs font-semibold text-slate-800">{deal.batchNumber}</span>
            </>)}
          </div>
        </div>
      </div>
      )}

      {/* ── 8f. Logistics ── */}
      {(deal.palletConfiguration || deal.containerLoadQuantity || deal.stackable !== null && deal.stackable !== undefined) && (
      <div className="border-t border-slate-100">
        <div className="px-5 pt-3 pb-1">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Container size={12} /> Logistics</h3>
        </div>
        <div className="px-5 pb-3">
          <div className="grid grid-cols-[155px_1fr] gap-x-4 gap-y-2 text-sm">
            {deal.palletConfiguration && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Pallet config <InfoTooltip text={
                deal.palletConfiguration ? (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-slate-300">Pallet configuration</p>
                    <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-slate-400">Units/layer</span><span className="text-white">{deal.palletConfiguration.unitsPerLayer}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Layers</span><span className="text-white">{deal.palletConfiguration.layersPerPallet}</span></div>
                      <div className="flex justify-between border-t border-slate-700 pt-1"><span className="text-white font-semibold">Total</span><span className="text-white font-semibold">{deal.palletConfiguration.unitsPerPallet} units</span></div>
                    </div>
                  </div>
                ) : "How many units fit on a standard pallet."
              } /></span>
              <span className="font-semibold text-slate-800">{deal.palletConfiguration.unitsPerPallet} units/pallet ({deal.palletConfiguration.unitsPerLayer}×{deal.palletConfiguration.layersPerPallet})</span>
            </>)}

            {deal.containerLoadQuantity && (<>
              <span className="text-slate-500 inline-flex items-center gap-1">Container load <InfoTooltip text={
                deal.containerLoadQuantity ? (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-slate-300">Container capacity</p>
                    <div className="border-t border-slate-700 pt-1.5 space-y-1 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-slate-400">20ft container</span><span className="text-white">{deal.containerLoadQuantity.twentyFt.toLocaleString()} units</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">40ft container</span><span className="text-white">{deal.containerLoadQuantity.fortyFt.toLocaleString()} units</span></div>
                      {deal.containerLoadQuantity.fortyHC && <div className="flex justify-between"><span className="text-slate-400">40ft HC</span><span className="text-white">{deal.containerLoadQuantity.fortyHC.toLocaleString()} units</span></div>}
                    </div>
                  </div>
                ) : "Maximum units that fit in a standard shipping container."
              } /></span>
              <span className="font-semibold text-slate-800">{deal.containerLoadQuantity.twentyFt.toLocaleString()} (20ft) / {deal.containerLoadQuantity.fortyFt.toLocaleString()} (40ft)</span>
            </>)}

            {deal.stackable !== null && deal.stackable !== undefined && (<>
              <span className="text-slate-500">Stackable</span>
              <span className="font-semibold text-slate-800">{deal.stackable ? "Yes" : "No"}</span>
            </>)}
          </div>
        </div>
      </div>
      )}

      {/* ── Customization Add-ons ── */}
      {deal.customizationOptions && deal.customizationOptions.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3">
          <h3 className="text-sm font-bold text-cyan-600 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Palette size={12} /> Customization</h3>
          {deal.customizationOptions.map((co, i) => (
            <div key={i} className="flex items-center justify-between text-sm py-0.5">
              <span className="text-slate-600">{co.name}</span>
              <span className="text-slate-500">+{co.currency}{co.extraCost.toFixed(2)}/unit <span className="text-slate-400">(min {co.minQty})</span></span>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          9. DEAL HIGHLIGHTS — consolidated badges (last group)
          ═══════════════════════════════════════════════════════ */}
      {(() => {
        const highlights = [];
        if (deal.comparisonPrice) highlights.push({ icon: TrendingUp, text: `${deal.comparisonPrice.percentage}% below market`, color: "text-emerald-700 bg-emerald-50 border-emerald-100" });
        if (deal.freeShippingThreshold) highlights.push({ icon: Truck, text: `Free shipping ${deal.freeShippingThreshold.currency}${deal.freeShippingThreshold.amount}+`, color: "text-blue-700 bg-blue-50 border-blue-100" });
        /* Tester removed — already shown in Samples row */
        if (deal.productInsurance?.included) highlights.push({ icon: ShieldCheck, text: "Insured transit", color: "text-teal-700 bg-teal-50 border-teal-100" });
        if (deal.qualityInspection?.available) highlights.push({ icon: FileCheck, text: `${deal.qualityInspection.type} inspection`, color: "text-indigo-700 bg-indigo-50 border-indigo-100" });
        if (deal.whiteLabeling?.available) highlights.push({ icon: Palette, text: "White labeling", color: "text-cyan-700 bg-cyan-50 border-cyan-100" });
        if (deal.exclusivityAvailable) highlights.push({ icon: Gem, text: "Exclusivity available", color: "text-purple-700 bg-purple-50 border-purple-100" });
        if (deal.firstOrderDiscount) highlights.push({ icon: Sparkles, text: `${deal.firstOrderDiscount.percentage}% off first order`, color: "text-emerald-700 bg-emerald-50 border-emerald-200" });
        if (deal.sellToPrivate) highlights.push({ icon: Users, text: "B2C available", color: "text-violet-700 bg-violet-50 border-violet-100" });
        if (highlights.length === 0) return null;
        return (
          <div className="border-t border-slate-100 px-5 py-3">
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Sparkles size={12} /> Deal Highlights</h3>
            <div className="flex flex-wrap gap-1.5">
              {highlights.map((h, i) => (
                <span key={i} className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-md border ${h.color}`}>
                  <h.icon size={11} /> {h.text}
                </span>
              ))}
            </div>
          </div>
        );
      })()}

        </div>{/* end collapsible inner */}

        {/* Gradient fade + expand button when collapsed & content overflows */}
        {!detailsExpanded && detailsOverflows && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
            <div className="bg-white px-5 pb-3 pt-1">
              <button
                onClick={() => {
                  setDetailsExpanded(true);
                  // After expanding, scroll so newly revealed content appears at centre of viewport
                  requestAnimationFrame(() => {
                    if (detailsRef.current) {
                      // The content that was hidden starts at COLLAPSED_HEIGHT offset
                      const rect = detailsRef.current.getBoundingClientRect();
                      const hiddenStart = rect.top + COLLAPSED_HEIGHT + window.scrollY;
                      const viewportCenter = window.innerHeight / 2;
                      window.scrollTo({ top: hiddenStart - viewportCenter, behavior: "smooth" });
                    }
                  });
                }}
                className="w-full py-2.5 text-sm font-semibold text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-300 bg-orange-50/50 hover:bg-orange-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronDown size={16} /> Show all product details
              </button>
            </div>
          </div>
        )}
        {detailsExpanded && detailsOverflows && (
          <div className="px-5 pb-3 pt-2">
            <button
              onClick={() => {
                setDetailsExpanded(false);
                // Scroll so the "Show all product details" button sits just above the browser bottom
                requestAnimationFrame(() => {
                  if (collapseWrapperRef.current) {
                    // After collapsing, the wrapper height = COLLAPSED_HEIGHT + gradient + button (~90px)
                    const wrapperRect = collapseWrapperRef.current.getBoundingClientRect();
                    const collapsedBottom = wrapperRect.top + window.scrollY + COLLAPSED_HEIGHT + 90;
                    const target = collapsedBottom - window.innerHeight + 20; // 20px breathing room from bottom
                    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
                  }
                });
              }}
              className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-500 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ChevronUp size={16} /> Show less
            </button>
          </div>
        )}
      </div>{/* end collapsible wrapper */}

      {/* 10. Order CTA + Wishlist */}
      <div className="px-5 pt-4 pb-2 border-t border-slate-100">
        {isSoldOut ? (
          /* Sold out — grey disabled CTA with "no longer available" */
          <div className="flex gap-2">
            <div className="flex-1 py-3 rounded-lg text-sm font-bold text-center bg-slate-200 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
              <AlertTriangle size={16} /> No Longer Available
            </div>
            <button className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-orange-300 transition-all shrink-0" title="Save to wishlist">
              <Heart size={18} className="text-slate-400" />
            </button>
          </div>
        ) : (
        <div className="flex gap-2">
          {/* CTA gating: Standard+ see "Add to Enquiry List", Free/Guest see locked "Enquire Now" */}
          {/* Production note: Free can enquire about Supplier Pro deals only — needs supplier tier check */}
          {isLoggedIn && isPremium ? (
            <button className="flex-1 py-3 rounded-lg text-sm font-bold text-center bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <ClipboardList size={16} /> Add to Enquiry List
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="flex-1 py-3 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
              <Lock size={16} /> Enquire Now
            </a>
          ) : (
            <button onClick={openRegisterModal} className="flex-1 py-3 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-2">
              <Lock size={16} /> Enquire Now
            </button>
          )}
          {/* V2: Wishlist button */}
          <button className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 hover:border-orange-300 transition-all shrink-0" title="Save to wishlist">
            <Heart size={18} className="text-slate-400" />
          </button>
        </div>
        )}
      </div>

      {/* 11. Contact buttons — TWO separate gates:
          Call buttons: canViewContacts (reveals phone numbers — Premium+ for Supplier Free)
          Enquiry buttons: canEnquireDeal (platform message — Standard+ for all deals)
          Sold-out deals restyle labels to "Call/Ask About Similar". */}
      {isSoldOut ? (
        <div className="px-5 py-4" data-contact-section>
          <p className="text-xs text-slate-500 mb-2.5 text-center">The supplier may still be able to source similar products</p>
          <div className="flex gap-3">
            {/* Call — uses canViewContacts (phone numbers are contact details) */}
            {canViewContacts ? (
              <button onClick={() => setPhoneOpen(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#1e5299] border border-[#1e5299]/30 hover:bg-blue-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Phone size={15} /> Call About Similar
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#1e5299] border border-[#1e5299]/30 hover:bg-blue-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Phone size={15} /> Call About Similar
              </a>
            ) : (
              <button onClick={openRegisterModal} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-[#1e5299] border border-[#1e5299]/30 hover:bg-blue-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Phone size={15} /> Call About Similar
              </button>
            )}
            {/* Ask — uses canEnquireDeal (platform enquiry, Standard+ for all deals) */}
            {canEnquireDeal ? (
              <button onClick={() => setContactOpen(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1e5299] hover:bg-[#174480] flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={15} /> Ask About Similar
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1e5299] hover:bg-[#174480] flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={15} /> Ask About Similar
              </a>
            ) : (
              <button onClick={openRegisterModal} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1e5299] hover:bg-[#174480] flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={15} /> Ask About Similar
              </button>
            )}
          </div>
        </div>
      ) : (
      <div className="px-5 py-4 flex gap-3">
        {/* Call — uses canViewContacts (reveals phone numbers) */}
        {canViewContacts ? (
          <button onClick={() => setPhoneOpen(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Phone size={15} /> Call Now
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Phone size={15} /> Call Now
          </a>
        ) : (
          <button onClick={openRegisterModal} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Phone size={15} /> Call Now
          </button>
        )}
        {/* Enquiry — uses canEnquireDeal (platform message, Standard+ for all deals) */}
        {canEnquireDeal ? (
          <button onClick={() => setContactOpen(true)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Mail size={15} /> Send Enquiry
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Mail size={15} /> Send Enquiry
          </a>
        ) : (
          <button onClick={openRegisterModal} className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 flex items-center justify-center gap-2 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Mail size={15} /> Send Enquiry
          </button>
        )}
      </div>
      )}

      {/* 12. Verified Supplier Guarantee */}
      <div className="mx-5 mb-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-800">Verified Supplier Guarantee</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Every supplier on WholesaleUp&trade; is verified. If you have an issue with a deal, our buyer protection team will mediate on your behalf.
        </p>
      </div>
    </div>

    {/* Contact Supplier Modal */}
    {contactOpen && (
      <ContactSupplierModal
        name={deal.supplier?.name || "Supplier"}
        product={deal}
        subjectDefault={`Enquiry about: ${deal.title}`}
        onClose={() => setContactOpen(false)}
      />
    )}

    {/* Phone Number Reveal Modal */}
    {phoneOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPhoneOpen(false)}>
        <div role="dialog" aria-modal="true" aria-label="Supplier Phone" className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Phone size={18} className="text-orange-500" /> Supplier Phone</h3>
            <button onClick={() => setPhoneOpen(false)} className="min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors" aria-label="Close modal">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-3">Call the supplier directly:</p>
          <a href={`tel:${deal.supplier?.phone || "+44 20 7946 0958"}`} className="block w-full py-3 rounded-lg text-center text-lg font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
            {deal.supplier?.phone || "+44 20 7946 0958"}
          </a>
        </div>
      </div>
    )}
    </>
  );
}
