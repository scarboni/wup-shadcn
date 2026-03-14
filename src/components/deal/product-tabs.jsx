"use client";

import { useState } from "react";
import {
  Info,
  FileText,
  Wrench,
  Leaf,
  Wheat,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Globe,
  Microscope,
  Zap,
  CheckCircle2,
  Shirt,
  Droplets,
  Thermometer,
  Wine,
  Download,
  Layers,
  Hash,
  Truck,
  Award,
  Star,
  TrendingUp,
  Paperclip,
  FolderOpen,
  Lock,
  CreditCard,
  RotateCcw,
  Package,
  Landmark,
  Wallet,
  CalendarClock,
  Handshake,
  Banknote,
  FileCheck,
  ShoppingCart,
  Percent,
  Calendar,
  Clock,
} from "lucide-react";
import StarRating from "@/components/shared/star-rating";
import { FILE_ICONS, FlagImg } from "./utils";
import VariableReference from "./variable-reference";
import { useDemoAuth } from "@/components/shared/demo-auth-context";

const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

/* PRODUCTION DATA INHERITANCE — Payment & Terms tab:
   - paymentTerms (netPaymentTerms): If the deal has custom netPaymentTerms, show those.
     Otherwise fall back to the supplier's paymentTerms (from supplier-profile-form.jsx).
   API: The deal object should be pre-resolved server-side with inherited values where deal-level
   overrides don't exist, so the frontend always reads from deal.* properties. */
function PaymentTermsContent({ deal }) {
  /* PRODUCTION: In production, replace Lucide placeholder icons with official brand SVGs
     where available. PayPal, Visa/Mastercard, Klarna etc. all provide open-licence brand
     assets for merchants — see each provider's brand guidelines page. The Lucide icons
     below are functional stand-ins that convey the payment type at a glance. */
  /* Labels must match PAYMENT_METHODS_SUPPLIER in supplier-profile-form.jsx.
     The supplier profile form is the canonical source — slugs (keys) are stored in the DB
     and inherited by deals unless deal-specific overrides exist.
     If a new payment method is added to the form, add it here too. */
  const PAYMENT_METHODS = {
    "bank-transfer":    { label: "Bank Transfer",               icon: Landmark,      iconColor: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-700" },
    "credit-debit-card":{ label: "Credit / Debit Card",         icon: CreditCard,    iconColor: "text-violet-600", bg: "bg-violet-50",  border: "border-violet-200",  text: "text-violet-700" },
    paypal:             { label: "PayPal",                      icon: Wallet,        iconColor: "text-sky-600",    bg: "bg-sky-50",     border: "border-sky-200",     text: "text-sky-700" },
    bnpl:               { label: "Buy Now Pay Later (B2B)",     icon: CalendarClock, iconColor: "text-pink-600",   bg: "bg-pink-50",    border: "border-pink-200",    text: "text-pink-700" },
    "trade-credit":     { label: "Trade Credit (Net 30/60/90)", icon: Handshake,     iconColor: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
    "cash-on-delivery": { label: "Cash on Delivery",            icon: Banknote,      iconColor: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700" },
    "letter-of-credit": { label: "Letter of Credit",            icon: FileCheck,     iconColor: "text-teal-600",   bg: "bg-teal-50",    border: "border-teal-200",    text: "text-teal-700" },
    escrow:             { label: "Escrow",                      icon: ShieldCheck,   iconColor: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-200",  text: "text-indigo-700" },
  };
  const defaultMethod = { label: null, icon: CreditCard, iconColor: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600" };

  const currencySymbol = deal.currency || "€";

  return (
    <>
      {/* ─── 1. Minimum Order ─── */}
      {/* PRODUCTION DATA INHERITANCE — minimumOrderAmount:
          Primary source: Supplier Profile form (supplier-profile-form.jsx → "Minimum Order",
          Orders & Payments tab). Stored in supplier_profiles.minimumOrderAmount + minimumOrderCurrency.
          Override: If the deal has its own minimumOrderAmount, show that.
          API: deal object should be pre-resolved server-side. */}
      {deal.minimumOrderAmount > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><ShoppingCart size={18} className="text-slate-400" /> Minimum Order</h3>
          <p className="pl-[26px]">
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
              {deal.minimumOrderCurrency || currencySymbol} {deal.minimumOrderAmount.toLocaleString()}
            </span>
          </p>
        </div>
      )}

      {/* ─── 2. Payment Methods Accepted ─── */}
      {/* PRODUCTION DATA INHERITANCE — Payment Methods Accepted:
          Primary source: Supplier Profile form (supplier-profile-form.jsx → "Payment Methods Accepted",
          Orders & Payments tab). Stored in supplier_profiles.paymentMethods.
          Override: If the deal has its own supplierPaymentMethods array, show those instead.
          This allows individual deals to advertise different accepted methods (e.g. a clearance
          deal might be bank-transfer-only even though the supplier normally accepts all methods).
          API: The deal object should be pre-resolved server-side — if deal.supplierPaymentMethods
          is null/empty, copy supplier.paymentMethods into deal.supplierPaymentMethods so the
          frontend always reads from deal.supplierPaymentMethods.
          Note: deal.paymentOptions (legacy free-text array) is superseded by this field. */}
      {deal.supplierPaymentMethods && deal.supplierPaymentMethods.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><CreditCard size={18} className="text-slate-400" /> Payment Methods Accepted</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {deal.supplierPaymentMethods.map((pm) => {
              const m = PAYMENT_METHODS[pm] || { ...defaultMethod, label: pm };
              const Icon = m.icon;
              return (
                <span key={pm} className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${m.text} ${m.bg} border ${m.border} rounded-md`}>
                  <Icon size={12} className={m.iconColor} /> {m.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 3. Payment Terms ─── */}
      {/* PRODUCTION DATA INHERITANCE for netPaymentTerms, paymentFinancing, depositRequired:
          - netPaymentTerms: inherited from supplier_profiles.paymentTerms unless deal override
          - paymentFinancing: deal-level only (e.g. Klarna BNPL offer)
          - depositRequired: inherited from supplier_profiles.defaultDepositPercentage + defaultDepositTerms
            → deal.depositRequired = { percentage, terms }. If deal has its own override, show that.
          API: Pre-resolve deal-level values server-side (inherit from supplier if deal override is null). */}
      {(deal.netPaymentTerms || deal.paymentFinancing || deal.depositRequired) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-slate-400" /> Payment Terms</h3>
          <div className="pl-[26px] space-y-3">
            {deal.netPaymentTerms && (
              <p className="text-sm text-slate-600 leading-relaxed">{deal.netPaymentTerms}</p>
            )}
            {deal.paymentFinancing && (
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-medium text-slate-700">Financing:</span>{" "}
                {typeof deal.paymentFinancing === "object" ? `${deal.paymentFinancing.terms}${deal.paymentFinancing.provider ? ` with ${deal.paymentFinancing.provider}` : ""}` : deal.paymentFinancing}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── 4. Deposit ─── */}
      {deal.depositRequired && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Percent size={18} className="text-slate-400" /> Deposit Required</h3>
          <div className="pl-[26px]">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md">
              {deal.depositRequired.percentage}%
            </span>
            {deal.depositRequired.terms && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{deal.depositRequired.terms}</p>}
          </div>
        </div>
      )}

      {/* ─── 5. Bulk Discounts ─── */}
      {/* PRODUCTION DATA INHERITANCE — discountTiers:
          Inherited from supplier_profiles.discountTiers unless deal overrides.
          API: deal object should be pre-resolved server-side. */}
      {deal.discountTiers?.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Bulk Discounts</h3>
          <div className="pl-[26px] space-y-2">
            {deal.discountTiers.map((tier, i) => (
              <div key={i} className="flex items-center justify-between text-sm max-w-xs">
                <span className="text-slate-600">Orders {tier.currency || currencySymbol}{Number(tier.minOrder).toLocaleString()}+</span>
                <span className="font-bold text-emerald-600">{tier.discount}% off</span>
              </div>
            ))}
            {deal.discountNotes && <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">{deal.discountNotes}</p>}
          </div>
        </div>
      )}

      {/* ─── 6. Invoicing ─── */}
      {/* PRODUCTION DATA INHERITANCE for taxClass, invoiceType, sanitizedInvoice:
          These fields have supplier-level defaults set in the Supplier Profile form
          (supplier-profile-form.jsx → Orders & Payments tab):
          - taxClass: inherited from supplier_profiles.defaultTaxClass
          - invoiceType: inherited from supplier_profiles.defaultInvoiceType
          - sanitizedInvoice: inherited from supplier_profiles.sanitizedInvoice
          API: Pre-resolve deal-level values server-side. */}
      {(deal.invoiceType || deal.taxClass || deal.sanitizedInvoice) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-slate-400" /> Invoicing</h3>
          <div className="flex flex-wrap gap-2 pl-[26px]">
            {deal.invoiceType && (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md">
                {deal.invoiceType === "VAT" ? "VAT Invoice" : deal.invoiceType === "EU Community" ? "EU Community Invoice" : deal.invoiceType === "Both" ? "Both (VAT + EU Community)" : deal.invoiceType}
              </span>
            )}
            {deal.taxClass && (
              <span className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md">
                {deal.taxClass === "standard" ? "Standard Rate" : deal.taxClass === "reduced" ? "Reduced Rate" : deal.taxClass === "zero-rated" ? "Zero-Rated" : deal.taxClass === "exempt" ? "VAT Exempt" : deal.taxClass}
              </span>
            )}
            {deal.sanitizedInvoice && (
              <span className={`px-3 py-1.5 text-xs font-medium rounded-md border ${deal.sanitizedInvoice === "Available" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : deal.sanitizedInvoice === "On Request" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-slate-700 bg-white border-slate-200"}`}>
                Sanitized: {deal.sanitizedInvoice}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ─── 7. Pricing & Dates ─── */}
      {(deal.mapPrice || deal.priceValidUntil || deal.dateAdded) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Calendar size={18} className="text-slate-400" /> Pricing & Dates</h3>
          <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2.5 pl-[26px] text-sm">
            {deal.mapPrice && (<>
              <span className="text-slate-500">MAP</span>
              <span className="font-semibold text-slate-800">{currencySymbol}{typeof deal.mapPrice === "object" ? deal.mapPrice.amount?.toFixed(2) : Number(deal.mapPrice).toFixed(2)}</span>
            </>)}
            {deal.priceValidUntil && (<>
              <span className="text-slate-500">Price valid until</span>
              <span className="font-semibold text-slate-800">{deal.priceValidUntil}</span>
            </>)}
            {deal.dateAdded && (<>
              <span className="text-slate-500">First featured</span>
              <span className="font-semibold text-slate-800">{deal.dateAdded}</span>
            </>)}
          </div>
        </div>
      )}

      {/* ─── 8. Return Policy ─── */}
      {/* PRODUCTION: returnPolicy is inherited from Supplier Profile form
          (supplier-profile-form.jsx → "Return Policy" field, Orders & Payments tab).
          If the deal has a custom returnPolicy, show that.
          Otherwise fall back to the supplier's returnPolicy from supplier_profiles table.
          API: deal object should be pre-resolved server-side. */}
      {deal.returnPolicy && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><RotateCcw size={18} className="text-slate-400" /> Return Policy</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 ml-[26px]">
            <p className="text-sm text-slate-600 leading-relaxed">{deal.returnPolicy}</p>
          </div>
        </div>
      )}
    </>
  );
}

/* PRODUCTION DATA INHERITANCE — Shipping & Delivery tab:
   - shippingCountries: If the deal has custom shippingCountries, show those.
     Otherwise fall back to the supplier's countriesServed (from supplier-profile-form.jsx).
   - countryRestrictions: If the deal has custom countryRestrictions, show those.
     Otherwise fall back to the supplier's excludedCountries (from supplier-profile-form.jsx).
   - deliveryMethods: If the deal has custom deliveryMethods, show those.
     Otherwise fall back to the supplier's deliveryMethods (from supplier-profile-form.jsx).
   API: The deal object should be pre-resolved server-side with inherited values where deal-level
   overrides don't exist, so the frontend always reads from deal.* properties. */
/* PRODUCTION DATA INHERITANCE — Shipping & Delivery tab:
   Sections are ordered by the buyer's decision journey: when → where → how.

   1. Availability & Lead Time — deal-level fields (readyToShip, estimatedDeliveryRange, leadTime,
      shippingTime). Always deal-specific, never inherited from supplier profile.

   2. Shipping Coverage — Ships from (deal-level), Ships to (deal.shippingCountries, deal-level but
      may inherit from supplier's countriesServed if not set), Restrictions (deal.countryRestrictions,
      deal-level but may inherit from supplier's excludedCountries), Import duties (deal-level).

   3. Delivery & Fulfilment — deliveryMethods inherited from Supplier Profile form
      (supplier-profile-form.jsx → "Delivery Methods" field, Orders & Payments tab) unless the
      deal has custom deliveryMethods. deliveryOptions (legacy free-text: "Collection in person",
      "National delivery", "International delivery") is superseded by deliveryMethods and should
      be migrated. Incoterms inherited from supplier_profiles.defaultIncoterms unless deal
      override (deal.incoterms). shippingClass is deal-level.

   API: deal object should be pre-resolved server-side with inherited values. */
function ShippingDeliveryContent({ deal }) {
  /* Labels must match DELIVERY_METHODS_SUPPLIER in supplier-profile-form.jsx.
     The supplier profile form is the canonical source — slugs (keys) are stored in the DB
     and inherited by deals unless deal-specific overrides exist.
     Branded carriers get a coloured initial badge; generic methods keep a Truck icon.
     PRODUCTION: Replace initial badges with official carrier SVG logos if brand assets are available. */
  const DELIVERY_METHODS = {
    dhl:              { label: "DHL",                        initials: "DHL",  bg: "bg-yellow-400", text: "text-red-700",     ring: "ring-yellow-500" },
    fedex:            { label: "FedEx",                      initials: "FE",   bg: "bg-purple-600", text: "text-white",       ring: "ring-purple-700" },
    ups:              { label: "UPS",                        initials: "UPS",  bg: "bg-amber-700",  text: "text-white",       ring: "ring-amber-800" },
    usps:             { label: "USPS",                       initials: "US",   bg: "bg-blue-700",   text: "text-white",       ring: "ring-blue-800" },
    tnt:              { label: "TNT",                        initials: "TNT",  bg: "bg-orange-500", text: "text-white",       ring: "ring-orange-600" },
    aramex:           { label: "Aramex",                     initials: "AX",   bg: "bg-red-600",    text: "text-white",       ring: "ring-red-700" },
    dpd:              { label: "DPD",                        initials: "DPD",  bg: "bg-red-700",    text: "text-white",       ring: "ring-red-800" },
    "national-post":  { label: "National Postal Service",    initials: null },
    "pallet-delivery":{ label: "Pallet / LTL Freight",      initials: null },
    "own-fleet":      { label: "Own Fleet / Direct Delivery",initials: null },
    freight:          { label: "Freight / Haulage",          initials: null },
    "click-collect":  { label: "Click & Collect",            initials: null },
    collection:       { label: "Collection in Person",       initials: null },
  };
  const COUNTRY_CODES = {
    "United Kingdom": "gb", "France": "fr", "Germany": "de", "Netherlands": "nl",
    "Belgium": "be", "Ireland": "ie", "Spain": "es", "Italy": "it", "Portugal": "pt",
    "Austria": "at", "Switzerland": "ch", "Norway": "no", "Sweden": "se", "Denmark": "dk",
    "Finland": "fi", "Poland": "pl", "Czech Republic": "cz", "Hungary": "hu", "Romania": "ro",
    "Bulgaria": "bg", "Croatia": "hr", "Greece": "gr", "Luxembourg": "lu", "Slovakia": "sk",
    "Slovenia": "si", "Estonia": "ee", "Latvia": "lv", "Lithuania": "lt", "Malta": "mt",
    "Cyprus": "cy", "United States": "us", "Canada": "ca", "Australia": "au",
    "Japan": "jp", "South Korea": "kr", "China": "cn", "India": "in", "Turkey": "tr",
    "Brazil": "br", "Mexico": "mx", "Singapore": "sg", "Hong Kong": "hk", "UAE": "ae",
    "Saudi Arabia": "sa", "South Africa": "za", "New Zealand": "nz", "Israel": "il",
    "Thailand": "th", "Malaysia": "my", "Indonesia": "id", "Philippines": "ph", "Vietnam": "vn",
  };
  const RESTRICTION_NAMES = {
    RU: "Russia", BY: "Belarus", KP: "North Korea", IR: "Iran", SY: "Syria",
    CU: "Cuba", VE: "Venezuela", SD: "Sudan", MM: "Myanmar", ZW: "Zimbabwe",
    AF: "Afghanistan", IQ: "Iraq", LB: "Lebanon", LY: "Libya", SO: "Somalia",
    YE: "Yemen", CN: "China", US: "United States", GB: "United Kingdom",
    DE: "Germany", FR: "France", IT: "Italy", ES: "Spain", NL: "Netherlands",
    BE: "Belgium", PT: "Portugal", AT: "Austria", IE: "Ireland", PL: "Poland",
    SE: "Sweden", DK: "Denmark", FI: "Finland", NO: "Norway", CH: "Switzerland",
    JP: "Japan", KR: "South Korea", AU: "Australia", BR: "Brazil", IN: "India",
  };
  const INCOTERM_LABELS = { EXW: "EXW — Ex Works", FOB: "FOB — Free on Board", CIF: "CIF — Cost, Insurance & Freight", DDP: "DDP — Delivered Duty Paid", DAP: "DAP — Delivered at Place", FCA: "FCA — Free Carrier" };

  return (
    <>
      {/* ── 1. Availability & Lead Time ── */}
      {(deal.readyToShip !== undefined || deal.estimatedDeliveryRange || deal.freeDelivery) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Package size={18} className="text-slate-400" /> Availability & Lead Time</h3>
          <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2.5 pl-[26px] text-sm">
            {deal.readyToShip !== undefined && deal.readyToShip !== null && (<>
              <span className="text-slate-500">Availability</span>
              <span className={`font-semibold ${deal.readyToShip ? "text-emerald-600" : "text-slate-800"}`}>{deal.readyToShip ? "Ready to ship" : "Made to order"}</span>
            </>)}
            {deal.estimatedDeliveryRange && (() => {
              const LEAD_LABELS = { "same-day": "Same Day", "1-2-days": "1–2 Days", "3-5-days": "3–5 Days", "1-2-weeks": "1–2 Weeks", "2-4-weeks": "2–4 Weeks", "4-8-weeks": "4–8 Weeks", "8-plus-weeks": "8+ Weeks" };
              const leadLabel = deal.leadTime ? (LEAD_LABELS[deal.leadTime] || deal.leadTime) + " lead" : null;
              const shipLabel = deal.shippingTime ? deal.shippingTime + " days shipping" : null;
              const breakdown = [leadLabel, shipLabel].filter(Boolean).join(" + ");
              return (<>
                <span className="text-slate-500">Est. delivery</span>
                <span className="font-semibold text-slate-800">
                  {deal.estimatedDeliveryRange.minDate} – {deal.estimatedDeliveryRange.maxDate}
                  {breakdown && <span className="font-normal text-slate-400 text-xs ml-1.5">({breakdown})</span>}
                </span>
              </>);
            })()}
            {deal.freeDelivery && (<>
              <span className="text-slate-500">Delivery</span>
              <span className="font-semibold text-emerald-600">Free delivery</span>
            </>)}
          </div>
        </div>
      )}

      {/* ── 2. Shipping Coverage ── */}
      {(deal.shipsFrom || deal.shippingCountries || deal.countryRestrictions?.length > 0 || deal.importDutyCoverage?.covered) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Globe size={18} className="text-slate-400" /> Shipping Coverage</h3>
          <div className="pl-[26px] space-y-4">
            {/* PRODUCTION DATA INHERITANCE — Deal Ships from:
                Primary source: deal.shipsFrom (deal-level field set during deal creation).
                Fallback: If the deal has no shipsFrom, the API should copy the supplier's
                address.country into deal.shipsFrom so the frontend always reads from deal.*.
                deal.shipsFromCode follows the same logic (supplier address.countryCode as fallback).
                This means "Deal Ships from" may equal the supplier's home country when the deal
                doesn't specify a different origin (e.g. a UK supplier shipping from a EU warehouse). */}
            {deal.shipsFrom && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Deal ships from</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 pl-3">
                  {deal.shipsFromCode && <FlagImg code={deal.shipsFromCode} size={16} />} {deal.shipsFrom}
                </div>
              </div>
            )}

            {/* PRODUCTION DATA INHERITANCE — Supplier Ships to:
                Primary source: deal.shippingCountries (deal-level override).
                Fallback: If the deal has no shippingCountries, the API should copy the supplier's
                countriesServed (from supplier-profile-form.jsx → Countries You Ship To or Serve)
                into deal.shippingCountries so the frontend always reads from deal.*. */}
            {deal.shippingCountries && (() => {
              const raw = typeof deal.shippingCountries === "string"
                ? deal.shippingCountries.split(",").map(c => c.trim()).filter(Boolean)
                : deal.shippingCountries;
              const groups = [];
              const countries = [];
              raw.forEach(c => {
                if (COUNTRY_CODES[c]) countries.push(c);
                else groups.push(c);
              });
              const sorted = countries.sort((a, b) => a.localeCompare(b));
              return (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Supplier ships to</p>
                  <div className="pl-3">
                    {groups.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {groups.map(g => (
                          <div key={g} className="flex items-center gap-2 text-sm text-slate-600">
                            <Globe size={14} className="text-slate-400 shrink-0" />
                            {g}
                          </div>
                        ))}
                      </div>
                    )}
                    {sorted.length > 0 && (
                      <div className="columns-2 sm:columns-3 gap-x-6">
                        {sorted.map(c => (
                          <div key={c} className="flex items-center gap-2 text-sm text-slate-600 mb-1.5 break-inside-avoid">
                            <FlagImg code={COUNTRY_CODES[c]} size={16} />
                            {c}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Restrictions */}
            {deal.countryRestrictions?.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                <Ban size={14} className="shrink-0" /> Cannot ship to: {deal.countryRestrictions.map(c => RESTRICTION_NAMES[c] || c).join(", ")}
              </div>
            )}

            {/* Import duties — banner style matching restrictions */}
            {deal.importDutyCoverage && (
              deal.importDutyCoverage.covered ? (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                  <CheckCircle2 size={14} className="shrink-0" /> Import duties covered{deal.importDutyCoverage.regions?.length > 0 && ` (${deal.importDutyCoverage.regions.join(", ")})`}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <Info size={14} className="shrink-0" /> Import duties: buyer responsibility
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── 3. Delivery & Fulfilment ── */}
      {/* PRODUCTION DATA INHERITANCE — deliveryMethods:
          Primary source: Supplier Profile form (supplier-profile-form.jsx → "Delivery Methods",
          Orders & Payments tab). Required field. Stored in supplier_profiles.deliveryMethods.
          Override: If the deal has its own deliveryMethods array, show those instead.
          API: deal object pre-resolved server-side.
          NOTE: shippingCarrier (legacy freetext, e.g. "DHL Express") has been removed —
          it duplicated deliveryMethods and had no form field backing it.
          deliveryOptions (legacy freetext array) is also superseded by deliveryMethods. */}
      {(deal.deliveryMethods?.length > 0 || deal.deliveryOptions?.length > 0 || deal.shippingClass || deal.incoterms) && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Truck size={18} className="text-slate-400" /> Delivery & Fulfilment</h3>
          <div className="pl-[26px] space-y-4">
            {/* Delivery methods — structured slugs from Supplier Profile form (canonical) */}
            {deal.deliveryMethods && deal.deliveryMethods.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Carriers / methods</p>
                <div className="flex flex-wrap gap-2">
                  {deal.deliveryMethods.map((dm) => {
                    const m = DELIVERY_METHODS[dm] || { label: dm, initials: null };
                    return (
                      <span key={dm} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
                        {m.initials ? (
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold leading-none ${m.bg} ${m.text} ring-1 ${m.ring}`}>{m.initials}</span>
                        ) : (
                          <Truck size={12} className="text-slate-400" />
                        )}
                        {m.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery options — legacy freetext (show only if no deliveryMethods) */}
            {(!deal.deliveryMethods || deal.deliveryMethods.length === 0) && deal.deliveryOptions && deal.deliveryOptions.length > 0 && (
              <div>
                <p className="text-sm text-slate-500 mb-2">Delivery options</p>
                <div className="flex flex-wrap gap-2">
                  {deal.deliveryOptions.map((opt) => (
                    <span key={opt} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
                      <Truck size={12} className="text-slate-400" /> {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping class + Incoterms */}
            {(deal.shippingClass || deal.incoterms) && (
              <div className="grid grid-cols-[140px_1fr] gap-x-4 gap-y-2.5 text-sm">
                {deal.shippingClass && (<>
                  <span className="text-slate-500">Shipping class</span>
                  <span className="font-semibold text-slate-800">{deal.shippingClass}</span>
                </>)}
                {deal.incoterms && (<>
                  <span className="text-slate-500">Incoterms</span>
                  <span className="font-semibold text-slate-800">{INCOTERM_LABELS[deal.incoterms] || deal.incoterms}</span>
                </>)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TagsSection({ tags }) {
  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Hash size={18} className="text-slate-400" /> Tags</h3>
      <div className="flex flex-wrap gap-2 pl-[26px]">
        {tags.map((tag) => (
          <a key={tag} href={`/deals?any=${encodeURIComponent(tag.replace(/^#/, ""))}`} className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all">
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ProductDescriptionTabs({ deal, activeTab: controlledTab, onTabChange }) {
  const { isLoggedIn, isPremium, isPremiumPlus, isSupplier, canViewSupplier } = useDemoAuth();
  const canAccessAttachments = isLoggedIn && (canViewSupplier || isSupplier);
  const [internalTab, setInternalTab] = useState("description");
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = onTabChange || setInternalTab;
  const [expanded, setExpanded] = useState(false);
  const LINE_LIMIT = 10;
  const lines = deal.description.split("\n");
  const isLong = lines.length > LINE_LIMIT;
  const displayText = expanded || !isLong ? deal.description : lines.slice(0, LINE_LIMIT).join("\n") + "…";

  const hasAttachments = deal.attachments && deal.attachments.length > 0;
  const hasReviewData = !!deal.productReputation;
  const canAccessReviews = isLoggedIn && isPremiumPlus;

  const tabs = [
    { key: "description", label: "Description" },
    { key: "details", label: "Specifications" },
    { key: "payment", label: "Payment & Terms" },
    { key: "shipping", label: "Shipping & Delivery" },
    ...(hasAttachments ? [{ key: "attachments", label: "Attachments", locked: !canAccessAttachments }] : []),
    ...(hasReviewData ? [{ key: "reviews", label: "Review", locked: !canAccessReviews }] : []),
    { key: "variables", label: "All Variables" },
  ];

  /* ── Certification label lookup ── */
  const CERT_DISPLAY = {
    ce: "CE", ukca: "UKCA", fda: "FDA", rohs: "RoHS", reach: "REACH",
    "iso-9001": "ISO 9001", "iso-14001": "ISO 14001", gmp: "GMP", brc: "BRC",
    haccp: "HACCP", organic: "Organic", "fair-trade": "Fair Trade", fsc: "FSC",
    "oeko-tex": "OEKO-TEX", gots: "GOTS", halal: "Halal", kosher: "Kosher",
    bsci: "BSCI", "b-corp": "B-Corp", fcc: "FCC",
  };

  return (
    <>
      {/* Tab headers */}
      <div role="tablist" aria-label="Deal information" className="flex border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`panel-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3.5 text-sm font-semibold transition-colors relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400 flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-600"
            }`}
          >
            {tab.label}
            {tab.locked && <Lock size={12} className="text-slate-300" />}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="p-6">

        {/* ═══ TAB 1: DESCRIPTION ═══ */}
        {activeTab === "description" && (
          <div>
            {/* Description text — no heading, tab name is sufficient */}
            <div className="mb-8">
              <div className="text-base text-slate-600 leading-relaxed whitespace-pre-line">{displayText}</div>
              {isLong && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            {/* ── Structured Specifications Table (B1) ── */}
            {deal.specifications && Object.keys(deal.specifications).length > 0 && (
              <div className="mb-8">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText size={18} className="text-slate-400" /> Key Specifications</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(deal.specifications).map(([key, value], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-slate-50/60" : "bg-white"}>
                          <td className="px-4 py-2.5 font-medium text-slate-700 w-[40%] border-r border-slate-100">{key}</td>
                          <td className="px-4 py-2.5 text-slate-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <TagsSection tags={deal.tags} />
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 2: SPECIFICATIONS ═══ */}
        {activeTab === "details" && (
          <div className="space-y-8">
            {/* 1. Certifications — universal trust signal, always first */}
            {deal.certifications && deal.certifications.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Award size={18} className="text-slate-400" /> Product Certifications</h3>
                <div className="pl-[26px] flex flex-wrap gap-2">
                  {deal.certifications.map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                      <ShieldCheck size={12} />
                      {CERT_DISPLAY[cert] || cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Category-specific specs — the most product-relevant content for buyers */}

            {/* 2a. Apparel & Fashion */}
            {(deal.fabricComposition || deal.gsm || deal.careInstructions || deal.fitType || deal.sizeChart) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Shirt size={18} className="text-indigo-400" /> Apparel Specifications</h3>
                <div className="pl-[26px] space-y-3">
                  {deal.fabricComposition && deal.fabricComposition.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fabric Composition</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {deal.fabricComposition.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
                            {f.material} {f.percentage}%
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.gsm && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fabric Weight (GSM)</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.gsm} g/m²</p>
                    </div>
                  )}
                  {deal.fitType && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fit Type</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.fitType}</p>
                    </div>
                  )}
                  {deal.careInstructions && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Care Instructions</span>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-sm text-slate-600">
                        {deal.careInstructions.wash && <span>Wash: {deal.careInstructions.wash}</span>}
                        {deal.careInstructions.dry && <span>Dry: {deal.careInstructions.dry}</span>}
                        {deal.careInstructions.iron && <span>Iron: {deal.careInstructions.iron}</span>}
                        {deal.careInstructions.bleach && <span>Bleach: {deal.careInstructions.bleach}</span>}
                      </div>
                    </div>
                  )}
                  {deal.sizeChart && (Array.isArray(deal.sizeChart) ? deal.sizeChart.length > 0 : true) && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Sizes</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(Array.isArray(deal.sizeChart) ? deal.sizeChart : []).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2b. Food & Beverage */}
            {(deal.nutritionalInfo || deal.organicCertification || deal.kosherHalal || deal.abv || deal.vintageYear || deal.countryOfHarvest) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Wheat size={18} className="text-amber-500" /> Food & Beverage Details</h3>
                <div className="pl-[26px] space-y-3">
                  {deal.nutritionalInfo && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nutrition Facts (per {deal.nutritionalInfo.servingSize})</span>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {[
                          ["Calories", deal.nutritionalInfo.calories, "kcal"],
                          ["Fat", deal.nutritionalInfo.fat, "g"],
                          ["Sat. fat", deal.nutritionalInfo.saturatedFat, "g"],
                          ["Carbs", deal.nutritionalInfo.carbs, "g"],
                          ["Sugar", deal.nutritionalInfo.sugar, "g"],
                          ["Protein", deal.nutritionalInfo.protein, "g"],
                          ["Fiber", deal.nutritionalInfo.fiber, "g"],
                          ["Salt", deal.nutritionalInfo.salt, "g"],
                        ].filter(([, val]) => val != null).map(([label, val, unit], i) => (
                          <div key={i} className="text-xs text-slate-600">
                            <span className="text-slate-400">{label}:</span> <strong>{val}{unit}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.organicCertification && deal.organicCertification.certified && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md">
                        <Leaf size={12} /> {deal.organicCertification.body}
                      </span>
                    </div>
                  )}
                  {deal.kosherHalal && (deal.kosherHalal.kosher || deal.kosherHalal.halal) && (
                    <div className="flex items-center gap-1.5">
                      {deal.kosherHalal.kosher && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md">Kosher</span>
                      )}
                      {deal.kosherHalal.halal && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">Halal — {deal.kosherHalal.certBody}</span>
                      )}
                    </div>
                  )}
                  {deal.abv != null && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Alcohol Content</span>
                      <p className="text-sm text-slate-600 mt-1"><Wine size={13} className="inline text-purple-400 mr-1" />{deal.abv}% ABV</p>
                    </div>
                  )}
                  {deal.vintageYear && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vintage</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.vintageYear}</p>
                    </div>
                  )}
                  {deal.countryOfHarvest && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Country of Harvest</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.countryOfHarvest}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2c. Health & Beauty */}
            {(deal.inciList || deal.spfRating || deal.skinType || deal.paoMonths || deal.crueltyFree || deal.dermatologicallyTested) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Droplets size={18} className="text-pink-400" /> Health & Beauty Details</h3>
                <div className="pl-[26px] space-y-3">
                  {deal.inciList && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">INCI Ingredients</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed font-mono">{deal.inciList}</p>
                    </div>
                  )}
                  {deal.spfRating && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sun Protection</span>
                      <p className="text-sm text-slate-600 mt-1">SPF {deal.spfRating}</p>
                    </div>
                  )}
                  {deal.skinType && deal.skinType.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Suitable For</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {deal.skinType.map((st, i) => (
                          <span key={i} className="px-3 py-1.5 text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100 rounded-md">{st}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.paoMonths && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Period After Opening</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.paoMonths} months</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {deal.crueltyFree && deal.crueltyFree.certified && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                        <CheckCircle2 size={12} /> Cruelty-Free ({deal.crueltyFree.body})
                      </span>
                    )}
                    {deal.dermatologicallyTested && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                        <CheckCircle2 size={12} /> Dermatologically Tested
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2d. Industrial / Technical */}
            {(deal.toleranceSpecs || deal.pressureRating || deal.temperatureRange || deal.threadType || deal.materialGrade) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Wrench size={18} className="text-slate-500" /> Technical Specifications</h3>
                <div className="pl-[26px]">
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                    {deal.toleranceSpecs && (<>
                      <span className="text-slate-500">Tolerance</span>
                      <span className="font-semibold text-slate-800">{deal.toleranceSpecs}</span>
                    </>)}
                    {deal.pressureRating && (<>
                      <span className="text-slate-500">Pressure rating</span>
                      <span className="font-semibold text-slate-800">{deal.pressureRating.value} {deal.pressureRating.unit}</span>
                    </>)}
                    {deal.temperatureRange && (<>
                      <span className="text-slate-500">Temp. range</span>
                      <span className="font-semibold text-slate-800"><Thermometer size={13} className="inline text-slate-400 mr-1" />{deal.temperatureRange.min}° to {deal.temperatureRange.max}° {deal.temperatureRange.unit}</span>
                    </>)}
                    {deal.threadType && (<>
                      <span className="text-slate-500">Thread type</span>
                      <span className="font-semibold text-slate-800">{deal.threadType}</span>
                    </>)}
                    {deal.materialGrade && (<>
                      <span className="text-slate-500">Material grade</span>
                      <span className="font-semibold text-slate-800">{deal.materialGrade}</span>
                    </>)}
                  </div>
                </div>
              </div>
            )}

            {/* 2e. Ingredients & Allergens (food/cosmetics) */}
            {(deal.ingredients || deal.allergens) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Wheat size={18} className="text-amber-500" /> Ingredients & Allergens</h3>
                <div className="pl-[26px] space-y-3">
                  {deal.ingredients && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Ingredients</span>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{deal.ingredients}</p>
                    </div>
                  )}
                  {deal.allergens && deal.allergens.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contains</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {deal.allergens.map((a, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-md">
                            <ShieldAlert size={12} /> {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.storageInstructions && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Storage</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.storageInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. Compatible With */}
            {deal.compatibleWith && deal.compatibleWith.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Layers size={18} className="text-slate-400" /> Compatible With</h3>
                <div className="pl-[26px] flex flex-wrap gap-2">
                  {deal.compatibleWith.map((brand, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Eco-Friendly / Sustainability */}
            {deal.ecoFriendly && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Leaf size={18} className="text-emerald-500" /> Sustainability & Eco-Friendly</h3>
                <div className="pl-[26px] space-y-3">
                  {deal.ecoFriendly.materials && deal.ecoFriendly.materials.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Materials</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {deal.ecoFriendly.materials.map((m, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                            <Leaf size={12} /> {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.ecoFriendly.packaging && deal.ecoFriendly.packaging.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Packaging</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {deal.ecoFriendly.packaging.map((p, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                            <Leaf size={12} /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {deal.ecoFriendly.production && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Production</span>
                      <p className="text-sm text-slate-600 mt-1">{deal.ecoFriendly.production}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Safety & Compliance (product-level only — shipping restrictions moved to Shipping & Delivery tab) */}
            {(deal.hazmatInfo?.isHazardous || deal.regionalCompliance?.length > 0 || deal.cpscCompliance?.compliant || deal.fdaRegistration?.registered || deal.energyRating || deal.sarValue || deal.hazardSymbols?.length > 0) && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><ShieldAlert size={18} className="text-slate-400" /> Safety & Compliance</h3>
                <div className="pl-[26px] space-y-2">
                  {/* ── Critical warnings (high visual weight) ── */}
                  {deal.hazmatInfo?.isHazardous && (
                    <div className="flex items-start gap-2.5 text-sm text-red-800 bg-red-50 rounded-lg px-4 py-3 border border-red-200">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Hazardous Material</span>
                        <p className="text-red-600 mt-0.5">UN{deal.hazmatInfo.unNumber}, Class {deal.hazmatInfo.class}</p>
                      </div>
                    </div>
                  )}
                  {deal.hazardSymbols && deal.hazardSymbols.length > 0 && (
                    <div className="flex items-start gap-2.5 text-sm text-red-800 bg-red-50 rounded-lg px-4 py-3 border border-red-200">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">GHS Hazard Symbols</span>
                        <p className="text-red-600 mt-0.5">{deal.hazardSymbols.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {deal.regionalCompliance?.length > 0 && (
                    <div className="space-y-2">
                      {deal.regionalCompliance.map((rc, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-500 shrink-0">{rc.region}:</span>
                          <span className="text-sm text-slate-700">{rc.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* ── Certifications & registrations (positive/informational) ── */}
                  {deal.cpscCompliance && deal.cpscCompliance.compliant && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                      <ShieldCheck size={14} /> CPSC/CPSIA Certified — #{deal.cpscCompliance.certNumber} ({deal.cpscCompliance.testLab})
                    </div>
                  )}
                  {deal.fdaRegistration && deal.fdaRegistration.registered && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                      <ShieldCheck size={14} /> FDA Registered — #{deal.fdaRegistration.number} ({deal.fdaRegistration.type})
                    </div>
                  )}
                  {/* ── Technical specs (neutral) ── */}
                  {deal.energyRating && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 border border-green-100">
                      <Zap size={14} /> {deal.energyRating.system}: Rating {deal.energyRating.rating}{deal.energyRating.annualConsumption ? ` (${deal.energyRating.annualConsumption})` : ""}
                    </div>
                  )}
                  {deal.sarValue && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                      <Microscope size={14} /> SAR: Head {deal.sarValue.head} W/kg, Body {deal.sarValue.body} W/kg
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 3: PAYMENT & SHIPPING ═══ */}
        {activeTab === "payment" && (
          <div>
            <PaymentTermsContent deal={deal} />
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <ShippingDeliveryContent deal={deal} />
          </div>
        )}

        {/* ═══ TAB 4: ALL VARIABLES (genre-grouped reference) ═══ */}
        {activeTab === "variables" && (
          <VariableReference deal={deal} />
        )}

        {/* ═══ TAB 5: REVIEW (multi-source aggregated summary) ═══ */}
        {/* PRODUCTION NOTE: Review data (deal.productReputation) should be fetched
            from the database only for authenticated Standard+ users. The gated branch
            below shows STATIC PLACEHOLDER data (no real scores or labels) so that
            unauthenticated / free-tier users see a decorative preview without leaking
            actual review metrics. The unlocked branch renders real data from
            deal.productReputation which must be populated server-side. */}
        {activeTab === "reviews" && (
          <div>
            {/* Gating: only Standard+ can access reviews */}
            {!canAccessReviews ? (
              <div className="relative overflow-hidden min-h-[280px]">
                {/* PLACEHOLDER DATA ONLY — scores, labels and bar widths are
                    static fakes so nothing real leaks through the blur */}
                <div className="select-none pointer-events-none" aria-hidden="true" style={{ filter: "blur(8px)", opacity: 0.35 }}>
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="text-center">
                      <span className="text-3xl font-extrabold text-slate-900">X.X</span>
                      <p className="text-xs text-slate-400 mt-0.5">out of 5</p>
                    </div>
                    <div>
                      <StarRating rating={4} size={18} />
                      <p className="text-sm text-slate-500 mt-1">Based on multiple sources</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {["Quality", "Value for Money", "Reliability", "Customer Satisfaction"].map((label) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-44 shrink-0">{label}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: "70%" }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 w-8 text-right">—</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lock overlay card */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center px-6 py-5 rounded-xl bg-white/90 border border-slate-200 shadow-sm max-w-xs">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2.5">
                      <Lock size={18} className="text-orange-500" />
                    </div>
                    <p className="text-xs text-slate-400 mb-3 text-center leading-relaxed">
                      {isLoggedIn
                        ? "Product reputation and review data are available on Standard plans and above."
                        : "Product reputation and review data are available to registered members."}
                    </p>
                    {isLoggedIn ? (
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
                      >
                        View Plans
                      </a>
                    ) : (
                      <button
                        onClick={openRegisterModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
                      >
                        Log In / Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* REAL DATA — deal.productReputation fetched from DB for Standard+ users */}
                {/* Overall score */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="text-center">
                    <span className="text-3xl font-extrabold text-slate-900">{deal.productReputation.overallScore}</span>
                    <p className="text-xs text-slate-400 mt-0.5">out of 5</p>
                  </div>
                  <div>
                    <StarRating rating={deal.productReputation.overallScore} size={18} />
                    <p className="text-sm text-slate-500 mt-1">Based on {deal.productReputation.sourcesCount} sources &middot; Updated {deal.productReputation.lastUpdated}</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400" /> Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed pl-[26px]">{deal.productReputation.summary}</p>
                </div>

                {/* Score dimensions */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Star size={18} className="text-slate-400" /> Rating Breakdown</h3>
                  <div className="space-y-3 pl-[26px]">
                    {deal.productReputation.dimensions.map((dim) => (
                      <div key={dim.label} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-44 shrink-0">{dim.label}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(dim.score / 5) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 w-8 text-right">{dim.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-emerald-500" /> Highlights</h3>
                  <div className="space-y-2 pl-[26px]">
                    {deal.productReputation.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cautions */}
                {deal.productReputation.cautions && deal.productReputation.cautions.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-500" /> Things to Note</h3>
                    <div className="space-y-2 pl-[26px]">
                      {deal.productReputation.cautions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 6: ATTACHMENTS ═══ */}
        {/* PRODUCTION NOTE: Attachment files (deal.attachments) should be fetched
            from the database only for authenticated Standard+ users. The gated branch
            below shows STATIC PLACEHOLDER files (generic names, not real supplier data)
            so unauthenticated / free-tier users see a decorative preview without
            leaking actual file names or metadata. The unlocked branch renders real
            data from deal.attachments which must be populated server-side. */}
        {activeTab === "attachments" && (
          <div>
            {/* Gating: only Standard+ can access attachments */}
            {!canAccessAttachments ? (
              <div className="relative overflow-hidden min-h-[280px]">
                {/* PLACEHOLDER DATA ONLY — file names and sizes are static fakes
                    so nothing real leaks through the blur */}
                <div className="select-none pointer-events-none" aria-hidden="true" style={{ filter: "blur(8px)", opacity: 0.35 }}>
                  <p className="text-xs text-slate-400 mb-3">{deal.attachments?.length || 3} files from supplier</p>
                  <div className="space-y-2">
                    {[
                      { name: "Product Specification.pdf", size: "1.2 MB", type: "pdf" },
                      { name: "Wholesale Price List.xlsx", size: "340 KB", type: "xlsx" },
                      { name: "Certificate of Compliance.pdf", size: "820 KB", type: "pdf" },
                      { name: "Product Images.zip", size: "8.4 MB", type: "zip" },
                    ].map((file, i) => {
                      const { icon: Icon, color, bg } = FILE_ICONS[file.type] || FILE_ICONS.default;
                      return (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200">
                          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                            <Icon size={18} className={color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{file.size}</p>
                          </div>
                          <Download size={16} className="text-slate-300 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lock overlay card — floats on top of blurred files */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex flex-col items-center px-6 py-5 rounded-xl bg-white/90 border border-slate-200 shadow-sm max-w-xs">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-2.5">
                      <Lock size={18} className="text-orange-500" />
                    </div>
                    <p className="text-xs text-slate-400 mb-3 text-center leading-relaxed">
                      {isLoggedIn
                        ? "Supplier documents, certificates and media are available on Standard plans and above."
                        : "Supplier documents, certificates and media are available to registered members."}
                    </p>
                    {isLoggedIn ? (
                      <a
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
                      >
                        View Plans
                      </a>
                    ) : (
                      <button
                        onClick={openRegisterModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
                      >
                        Log In / Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* REAL DATA — deal.attachments fetched from DB for Standard+ users */}
                {/* File count */}
                <p className="text-xs text-slate-400 mb-4">{deal.attachments.length} file{deal.attachments.length !== 1 ? "s" : ""} from supplier</p>

                {(() => {
                  const CATEGORY_META = {
                    documents: { label: "Documents", icon: FileText },
                    certificates: { label: "Certificates", icon: Award },
                    media: { label: "Media", icon: FolderOpen },
                  };
                  // Group files by category — uncategorised files go into a flat list at top
                  const grouped = {};
                  const ungrouped = [];
                  deal.attachments.forEach((file) => {
                    if (file.category && CATEGORY_META[file.category]) {
                      if (!grouped[file.category]) grouped[file.category] = [];
                      grouped[file.category].push(file);
                    } else {
                      ungrouped.push(file);
                    }
                  });
                  const categoryOrder = ["documents", "certificates", "media"];
                  const hasGroups = Object.keys(grouped).length > 0;

                  const renderFile = (file, i) => {
                    const ext = file.type || file.name.split(".").pop().toLowerCase();
                    const { icon: Icon, color, bg } = FILE_ICONS[ext] || FILE_ICONS.default;
                    return (
                      <button
                        key={i}
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-150 hover:border-orange-200 hover:bg-orange-50/40 transition-all group text-left"
                      >
                        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                          <Icon size={18} className={color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate group-hover:text-orange-600 transition-colors">{file.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{file.size}</span>
                            {file.description && (
                              <>
                                <span className="text-xs text-slate-300">·</span>
                                <span className="text-xs text-slate-400 truncate">{file.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Download size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors shrink-0" />
                      </button>
                    );
                  };

                  return (
                    <div className="space-y-6">
                      {/* Ungrouped files (legacy data without categories) */}
                      {ungrouped.length > 0 && (
                        <div className="space-y-2">
                          {ungrouped.map(renderFile)}
                        </div>
                      )}

                      {/* Grouped files by category */}
                      {hasGroups && categoryOrder.map((cat) => {
                        if (!grouped[cat]) return null;
                        const meta = CATEGORY_META[cat];
                        const CatIcon = meta.icon;
                        return (
                          <div key={cat}>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <CatIcon size={13} className="text-slate-400" />
                              {meta.label}
                            </h3>
                            <div className="space-y-2">
                              {grouped[cat].map(renderFile)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
