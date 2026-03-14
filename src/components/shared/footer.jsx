"use client";

import { useState, useRef, useEffect } from "react";
import {
  Globe,
  ChevronDown,
  Mail,
  CheckCircle2,
  AlertCircle,
  Facebook,
} from "lucide-react";
import { WholesaleUpIcon, WholesaleUpLogo } from "@/components/shared/logo";
import { CATEGORY_NAMES } from "@/lib/categories";
import { openCookiePreferences } from "@/components/shared/cookie-consent";

/* Active offer discount — single source of truth for footer badge + exit-intent popup.
   Will be replaced by a backend/admin-settings fetch in production. */
const ACTIVE_OFFER_DISCOUNT = 25;

/* ═══════════════════════════════════════════════════
   FOOTER CONSTANTS
   ═══════════════════════════════════════════════════ */

const FOOTER_COUNTRIES = [
  { name: "Global", code: null },
  { name: "United States", code: "us" },
  { name: "United Kingdom", code: "gb" },
  { name: "Germany", code: "de" },
  { name: "France", code: "fr" },
  { name: "Italy", code: "it" },
  { name: "Spain", code: "es" },
  { name: "India", code: "in" },
  { name: "Russia", code: "ru" },
  { name: "Portugal", code: "pt" },
  { name: "Netherlands", code: "nl" },
  { name: "Romania", code: "ro" },
  { name: "Denmark", code: "dk" },
  { name: "Sweden", code: "se" },
  { name: "Norway", code: "no" },
  { name: "Slovakia", code: "sk" },
  { name: "Bulgaria", code: "bg" },
  { name: "Turkey", code: "tr" },
  { name: "Hungary", code: "hu" },
  { name: "Greece", code: "gr" },
  { name: "Czech Republic", code: "cz" },
  { name: "Austria", code: "at" },
  { name: "Poland", code: "pl" },
  { name: "Croatia", code: "hr" },
  { name: "China", code: "cn" },
  { name: "Indonesia", code: "id" },
  { name: "Vietnam", code: "vn" },
  { name: "Thailand", code: "th" },
  { name: "Korea", code: "kr" },
  { name: "Japan", code: "jp" },
];

const NEWSLETTER_CATEGORIES = CATEGORY_NAMES;

/* ═══════════════════════════════════════════════════
   FOOTER — LOGO
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   FOOTER — COUNTRY SELECTOR
   ═══════════════════════════════════════════════════ */
function FooterCountrySelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(FOOTER_COUNTRIES[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
      >
        {selected.code ? (
          <img src={`https://flagcdn.com/20x15/${selected.code}.png`} alt={selected.name} className="w-5 h-4 object-cover rounded-sm" />
        ) : (
          <Globe size={16} className="text-slate-400" />
        )}
        <span>{selected.name}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-56 max-h-72 overflow-y-auto thin-scrollbar bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50">
          {FOOTER_COUNTRIES.map((country) => (
            <button
              key={country.name}
              onClick={() => { setSelected(country); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                selected.name === country.name ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {country.code ? (
                <img src={`https://flagcdn.com/20x15/${country.code}.png`} alt={country.name} className="w-5 h-4 object-cover rounded-sm" />
              ) : (
                <Globe size={16} className="text-slate-400" />
              )}
              {country.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — NEWSLETTER CATEGORY MULTI-SELECT
   ═══════════════════════════════════════════════════ */
function NewsletterCategorySelect() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (cat) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const label = selected.length === 0
    ? "All Categories"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} categories`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full h-[42px] px-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] transition-all duration-200"
      >
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-full min-w-[220px] max-h-64 overflow-y-auto thin-scrollbar bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50">
          <button
            onClick={() => setSelected([])}
            className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
              selected.length === 0 ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              selected.length === 0 ? "bg-orange-500 border-orange-500" : "border-slate-300"
            }`}>
              {selected.length === 0 && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            All Categories
          </button>
          {NEWSLETTER_CATEGORIES.map((cat) => {
            const isChecked = selected.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  isChecked ? "bg-orange-50 text-orange-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isChecked ? "bg-orange-500 border-orange-500" : "border-slate-300"
                }`}>
                  {isChecked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
                {cat}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — NEWSLETTER SUBSCRIPTION BAR (with validation)
   ═══════════════════════════════════════════════════ */
function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");

  // Characters never valid in a standard email address
  const hasInvalidChars = (v) => /[,;:!#$%^&*()\[\]{}<>\\/"'\s|`~=+]/.test(v);

  const validateEmail = (v) => {
    if (!v.trim()) return "Email address is required";
    if (hasInvalidChars(v.trim())) return "Contains invalid characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Please enter a valid email address";
    return "";
  };

  const error = validateEmail(email);
  // Invalid chars → show live while typing; required/format → only on blur/submit
  const liveError = email.trim() && hasInvalidChars(email.trim()) ? "Contains invalid characters" : "";
  const showError = liveError || (touched && error);

  const handleSubscribe = () => {
    setTouched(true);
    setServerError("");
    if (error) return;

    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 600);
  };

  const handleFocus = () => {
    setFocused(true);
    setTouched(false);
    setServerError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubscribe();
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">You&apos;re Subscribed!</h3>
              <p className="text-emerald-100 text-sm">We&apos;ll send the best wholesale deals straight to your inbox.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-orange-600 overflow-visible">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col xl:flex-row items-center gap-4 xl:gap-6">
          {/* Left: heading */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Mail size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Get The Deals When They Matter</h3>
              <p className="text-orange-100 text-sm">Subscribe for the latest wholesale deals &amp; offers</p>
            </div>
          </div>

          {/* Right: form */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-wrap items-stretch gap-2.5">
              <div className="flex-1 min-w-0 relative" style={{ minWidth: "min(100%, 260px)" }}>
                {/* Floating label */}
                <span className={`absolute z-10 transition-all duration-200 pointer-events-none ${
                  focused || email.trim()
                    ? "-top-2.5 text-xs font-semibold px-1 rounded bg-orange-500"
                    : "top-1/2 -translate-y-1/2 text-sm"
                } ${
                  focused || email.trim()
                    ? "text-white"
                    : "text-transparent"
                }`} style={{ left: focused || email.trim() ? "7rem" : "8rem" }}>
                  Your email address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={() => { setFocused(false); setTouched(true); }}
                  onKeyDown={handleKeyDown}
                  placeholder={!focused && !email.trim() && !(showError || serverError) ? "Your email address" : ""}
                  className={`w-full h-[42px] pl-[8rem] text-base rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    showError || serverError
                      ? "pr-4 outline outline-2 outline-red-300"
                      : focused
                      ? "pr-4 outline outline-2 outline-white/40"
                      : "pr-4"
                  }`}
                />
                <span className="absolute left-0 top-0 bottom-0 flex items-center px-3 bg-red-600 text-white text-xs font-bold rounded-l-lg whitespace-nowrap z-10" style={{ fontFamily: "inherit" }}>
                  {ACTIVE_OFFER_DISCOUNT}% discount
                </span>
                <div className="absolute top-0 bottom-0 right-0 rounded-r-lg pointer-events-none shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]" style={{ left: "6.5rem" }} />
                {(showError || serverError) && !email.trim() && (
                  <span className="absolute top-0 bottom-0 flex items-center gap-1.5 text-red-500 text-sm font-medium pointer-events-none" style={{ left: "8rem" }}>
                    <AlertCircle size={15} className="shrink-0" />
                    {liveError || serverError || error}
                  </span>
                )}
                {(showError || serverError) && email.trim() && (
                  <span className="absolute top-0 bottom-0 right-3 flex items-center gap-1.5 text-red-500 text-sm font-medium pointer-events-none" title={liveError || serverError || error}>
                    <AlertCircle size={15} className="shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex flex-row gap-2.5 flex-1" style={{ minWidth: "min(100%, 280px)" }}>
                <div className="flex-1">
                  <NewsletterCategorySelect />
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={sending}
                  className="px-6 h-[42px] bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                {sending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Subscribing…
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SOCIAL MEDIA ICONS
   ═══════════════════════════════════════════════════ */
function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — CANONICAL COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Footer() {
  const footerLinks = [
    { title: "For Buyers", links: [{ label: "Buyer Benefits", href: "/benefits" }, { label: "Browse Deals", href: "/deals" }, { label: "Browse Suppliers", href: "/suppliers" }, { label: "All Categories", href: "/categories" }, { label: "Pricing", href: "/pricing" }] },
    { title: "For Sellers", links: [{ label: "Supplier Benefits", href: "/supplier-benefits" }, { label: "Get Listed", href: "/get-listed" }, { label: "Add a Deal", href: "/add-deal" }, { label: "Seller FAQ", href: "/seller-faq" }] },
    { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Testimonials", href: "/testimonials" }, { label: "Affiliate Program", href: "/affiliate" }, { label: "Blog", href: "/blog" }] },
    { title: "Support", links: [{ label: "Help Center", href: "/help" }, { label: "A-Z Index", href: "/a-z" }, { label: "Custom Sourcing", href: "/sourcing" }, { label: "Contact Us", href: "/contact" }] },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter subscription bar */}
      <NewsletterBar />

      {/* Main footer content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <WholesaleUpLogo as="a" aria-label="WholesaleUp home" />
              <FooterCountrySelector />
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">The #1 wholesale and dropship platform. 20+ years connecting buyers with verified suppliers worldwide.</p>
            <a href="mailto:service@wholesaleup.com" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">service@wholesaleup.com</a>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-3.5">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}><a href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">{link.label}</a></li>
                ))}
              </ul>
              {/* Social media icons in Support column */}
              {section.title === "Support" && (
                <div className="mt-4">
                  <div className="flex items-center gap-2.5">
                    <SocialIcon href="https://facebook.com/wholesaleup" label="Facebook">
                      <Facebook size={16} className="text-slate-300" />
                    </SocialIcon>
                    <SocialIcon href="https://x.com/wholesaleup" label="X">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-300">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
                      </svg>
                    </SocialIcon>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 max-w-[320px] sm:max-w-2xl mx-auto">
          {/* PayPal */}
          <div className="h-8 px-2.5 rounded bg-white flex items-center justify-center" title="PayPal">
            <span style={{fontSize: 13, fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#003087"}}>Pay</span>
            <span style={{fontSize: 13, fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#009CDE"}}>Pal</span>
          </div>
          {/* Visa */}
          <div className="h-8 px-2.5 rounded bg-white flex items-center justify-center" title="Visa">
            <span style={{fontSize: 15, fontWeight: 700, fontStyle: "italic", color: "#1A1F71", fontFamily: "Arial, sans-serif"}}>VISA</span>
          </div>
          {/* Mastercard */}
          <div className="h-8 px-2 rounded bg-white flex items-center justify-center" title="Mastercard">
            <div className="relative" style={{width: 26, height: 16}}>
              <div className="absolute rounded-full" style={{width: 16, height: 16, left: 0, top: 0, backgroundColor: "#EB001B"}} />
              <div className="absolute rounded-full" style={{width: 16, height: 16, right: 0, top: 0, backgroundColor: "#F79E1B", mixBlendMode: "multiply"}} />
            </div>
          </div>
          {/* American Express */}
          <div className="h-8 px-2.5 rounded flex items-center justify-center" style={{backgroundColor: "#006FCF"}} title="American Express">
            <span style={{fontSize: 10, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: 0.5}}>AMEX</span>
          </div>
          {/* Apple Pay */}
          <div className="h-8 px-2.5 rounded bg-black flex items-center justify-center gap-1" title="Apple Pay">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" style={{display: "block", marginBottom: 1}}>
              <path d="M6.8 2c-.4.5-1.1.9-1.7.9-.1-.7.2-1.4.6-1.8C6.1.6 6.9.2 7.4.2c.1.7-.2 1.3-.6 1.8zm.6 1c-.9 0-1.8.5-2.2.5-.5 0-1.2-.5-2-.5C1.6 3 0 4.4 0 7c0 1.6.6 3.2 1.4 4.3.6.9 1.2 1.7 2.1 1.7.8 0 1.2-.6 2.2-.6 1 0 1.3.6 2.2.5.9 0 1.5-.8 2.1-1.7.4-.6.7-1.3.9-2C8.6 8.2 8.7 5.9 10 5c-.6-.8-1.5-1.2-2.4-1.2-.3 0-.7.1-1.2.2z" fill="white"/>
            </svg>
            <span style={{fontSize: 11, fontWeight: 600, color: "white", fontFamily: "Arial, sans-serif"}}>Pay</span>
          </div>
          {/* Google Pay */}
          <div className="h-8 px-2.5 rounded bg-white border border-slate-200 flex items-center justify-center gap-0.5" title="Google Pay">
            <span style={{fontSize: 11, fontWeight: 700, color: "#4285F4", fontFamily: "Arial, sans-serif"}}>G</span>
            <span style={{fontSize: 10, fontWeight: 500, color: "#5F6368", fontFamily: "Arial, sans-serif"}}>Pay</span>
          </div>
          {/* UnionPay */}
          <div className="h-8 px-2.5 rounded flex items-center justify-center" style={{background: "linear-gradient(135deg, #D50032 0%, #01798A 50%, #003B72 100%)"}} title="UnionPay">
            <span style={{fontSize: 9, fontWeight: 700, color: "white", fontFamily: "Arial, sans-serif", letterSpacing: 0.3}}>UnionPay</span>
          </div>
          {/* iDEAL */}
          <div className="h-8 px-2.5 rounded bg-white flex items-center justify-center" title="iDEAL">
            <span style={{fontSize: 10, fontWeight: 700, color: "#CC0066", fontFamily: "Arial, sans-serif"}}>iDEAL</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">&copy; 2004 - {new Date().getFullYear()} WholesaleUp&trade;. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-slate-500 hover:text-slate-300">Privacy</a>
            <a href="/terms" className="text-xs text-slate-500 hover:text-slate-300">Terms</a>
            <a href="/cookies" className="text-xs text-slate-500 hover:text-slate-300">Cookie Policy</a>
            <button onClick={openCookiePreferences} className="text-xs text-slate-500 hover:text-slate-300">Cookie Settings</button>
          </div>
        </div>
        <p className="text-xs text-slate-500/70 mt-3 leading-relaxed">All trademarks and brands used on this site belong to their respective owners and are used for informational purposes only. Use of this website constitutes acceptance of our <a href="/terms" className="underline hover:text-slate-300">terms and conditions</a>. WholesaleUp&trade; assumes no responsibility for the content of offers placed on this website.</p>
      </div>
    </footer>
  );
}
