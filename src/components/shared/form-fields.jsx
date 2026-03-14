"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  ChevronDown,
  Check,
  CheckCircle2,
  Search,
  Globe,
  Phone,
  Mail,
  Building2,
  MapPin,
  Languages,
  Circle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  HelpCircle,
  Info,
  AlertTriangle,
  User,
  AtSign,
  Linkedin,
  FileText,
  Camera,
  Upload,
  Clock,
} from "lucide-react";

/* ─────────── Reference Data ─────────────────────────────────
   Static reference data — consider moving to /lib/constants.js
   ─────────────────────────────────────────────────────────── */

/* Flat flag images via flagcdn.com — matches /deals filters pattern */
export function FlagImg({ iso, size = 20 }) {
  if (!iso) return null;
  if (iso === "globe") return <span className="inline-flex items-center justify-center" style={{ width: size, height: size * 0.7, fontSize: size * 0.7 }} role="img" aria-label="Worldwide">🌍</span>;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt="" className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} loading="lazy" />;
}

export const PHONE_CODES = [
  { country: "United States", code: "+1", iso: "us" },
  { country: "United Kingdom", code: "+44", iso: "gb" },
  { country: "Canada", code: "+1", iso: "ca" },
  { country: "Australia", code: "+61", iso: "au" },
  { country: "Germany", code: "+49", iso: "de" },
  { country: "France", code: "+33", iso: "fr" },
  { country: "Italy", code: "+39", iso: "it" },
  { country: "Spain", code: "+34", iso: "es" },
  { country: "Netherlands", code: "+31", iso: "nl" },
  { country: "Belgium", code: "+32", iso: "be" },
  { country: "Switzerland", code: "+41", iso: "ch" },
  { country: "Austria", code: "+43", iso: "at" },
  { country: "Sweden", code: "+46", iso: "se" },
  { country: "Norway", code: "+47", iso: "no" },
  { country: "Denmark", code: "+45", iso: "dk" },
  { country: "Poland", code: "+48", iso: "pl" },
  { country: "Ireland", code: "+353", iso: "ie" },
  { country: "Portugal", code: "+351", iso: "pt" },
  { country: "Greece", code: "+30", iso: "gr" },
  /* ── Rest of world (alphabetical) ── */
  { country: "Afghanistan", code: "+93", iso: "af" },
  { country: "Albania", code: "+355", iso: "al" },
  { country: "Algeria", code: "+213", iso: "dz" },
  { country: "Andorra", code: "+376", iso: "ad" },
  { country: "Angola", code: "+244", iso: "ao" },
  { country: "Argentina", code: "+54", iso: "ar" },
  { country: "Armenia", code: "+374", iso: "am" },
  { country: "Azerbaijan", code: "+994", iso: "az" },
  { country: "Bahamas", code: "+1-242", iso: "bs" },
  { country: "Bahrain", code: "+973", iso: "bh" },
  { country: "Bangladesh", code: "+880", iso: "bd" },
  { country: "Barbados", code: "+1-246", iso: "bb" },
  { country: "Belarus", code: "+375", iso: "by" },
  { country: "Belize", code: "+501", iso: "bz" },
  { country: "Benin", code: "+229", iso: "bj" },
  { country: "Bhutan", code: "+975", iso: "bt" },
  { country: "Bolivia", code: "+591", iso: "bo" },
  { country: "Bosnia and Herzegovina", code: "+387", iso: "ba" },
  { country: "Botswana", code: "+267", iso: "bw" },
  { country: "Brazil", code: "+55", iso: "br" },
  { country: "Brunei", code: "+673", iso: "bn" },
  { country: "Bulgaria", code: "+359", iso: "bg" },
  { country: "Burkina Faso", code: "+226", iso: "bf" },
  { country: "Burundi", code: "+257", iso: "bi" },
  { country: "Cambodia", code: "+855", iso: "kh" },
  { country: "Cameroon", code: "+237", iso: "cm" },
  { country: "Cape Verde", code: "+238", iso: "cv" },
  { country: "Central African Republic", code: "+236", iso: "cf" },
  { country: "Chad", code: "+235", iso: "td" },
  { country: "Chile", code: "+56", iso: "cl" },
  { country: "China", code: "+86", iso: "cn" },
  { country: "Colombia", code: "+57", iso: "co" },
  { country: "Comoros", code: "+269", iso: "km" },
  { country: "Congo (DRC)", code: "+243", iso: "cd" },
  { country: "Congo (Republic)", code: "+242", iso: "cg" },
  { country: "Costa Rica", code: "+506", iso: "cr" },
  { country: "Croatia", code: "+385", iso: "hr" },
  { country: "Cuba", code: "+53", iso: "cu" },
  { country: "Cyprus", code: "+357", iso: "cy" },
  { country: "Czech Republic", code: "+420", iso: "cz" },
  { country: "Djibouti", code: "+253", iso: "dj" },
  { country: "Dominica", code: "+1-767", iso: "dm" },
  { country: "Dominican Republic", code: "+1-809", iso: "do" },
  { country: "East Timor", code: "+670", iso: "tl" },
  { country: "Ecuador", code: "+593", iso: "ec" },
  { country: "Egypt", code: "+20", iso: "eg" },
  { country: "El Salvador", code: "+503", iso: "sv" },
  { country: "Equatorial Guinea", code: "+240", iso: "gq" },
  { country: "Eritrea", code: "+291", iso: "er" },
  { country: "Estonia", code: "+372", iso: "ee" },
  { country: "Eswatini", code: "+268", iso: "sz" },
  { country: "Ethiopia", code: "+251", iso: "et" },
  { country: "Fiji", code: "+679", iso: "fj" },
  { country: "Finland", code: "+358", iso: "fi" },
  { country: "Gabon", code: "+241", iso: "ga" },
  { country: "Gambia", code: "+220", iso: "gm" },
  { country: "Georgia", code: "+995", iso: "ge" },
  { country: "Ghana", code: "+233", iso: "gh" },
  { country: "Guatemala", code: "+502", iso: "gt" },
  { country: "Guinea", code: "+224", iso: "gn" },
  { country: "Guinea-Bissau", code: "+245", iso: "gw" },
  { country: "Guyana", code: "+592", iso: "gy" },
  { country: "Haiti", code: "+509", iso: "ht" },
  { country: "Honduras", code: "+504", iso: "hn" },
  { country: "Hong Kong", code: "+852", iso: "hk" },
  { country: "Hungary", code: "+36", iso: "hu" },
  { country: "Iceland", code: "+354", iso: "is" },
  { country: "India", code: "+91", iso: "in" },
  { country: "Indonesia", code: "+62", iso: "id" },
  { country: "Iran", code: "+98", iso: "ir" },
  { country: "Iraq", code: "+964", iso: "iq" },
  { country: "Israel", code: "+972", iso: "il" },
  { country: "Ivory Coast", code: "+225", iso: "ci" },
  { country: "Jamaica", code: "+1-876", iso: "jm" },
  { country: "Japan", code: "+81", iso: "jp" },
  { country: "Jordan", code: "+962", iso: "jo" },
  { country: "Kazakhstan", code: "+7", iso: "kz" },
  { country: "Kenya", code: "+254", iso: "ke" },
  { country: "Kiribati", code: "+686", iso: "ki" },
  { country: "Kosovo", code: "+383", iso: "xk" },
  { country: "Kuwait", code: "+965", iso: "kw" },
  { country: "Kyrgyzstan", code: "+996", iso: "kg" },
  { country: "Laos", code: "+856", iso: "la" },
  { country: "Latvia", code: "+371", iso: "lv" },
  { country: "Lebanon", code: "+961", iso: "lb" },
  { country: "Lesotho", code: "+266", iso: "ls" },
  { country: "Liberia", code: "+231", iso: "lr" },
  { country: "Libya", code: "+218", iso: "ly" },
  { country: "Liechtenstein", code: "+423", iso: "li" },
  { country: "Lithuania", code: "+370", iso: "lt" },
  { country: "Luxembourg", code: "+352", iso: "lu" },
  { country: "Macau", code: "+853", iso: "mo" },
  { country: "Madagascar", code: "+261", iso: "mg" },
  { country: "Malawi", code: "+265", iso: "mw" },
  { country: "Malaysia", code: "+60", iso: "my" },
  { country: "Maldives", code: "+960", iso: "mv" },
  { country: "Mali", code: "+223", iso: "ml" },
  { country: "Malta", code: "+356", iso: "mt" },
  { country: "Marshall Islands", code: "+692", iso: "mh" },
  { country: "Mauritania", code: "+222", iso: "mr" },
  { country: "Mauritius", code: "+230", iso: "mu" },
  { country: "Mexico", code: "+52", iso: "mx" },
  { country: "Micronesia", code: "+691", iso: "fm" },
  { country: "Moldova", code: "+373", iso: "md" },
  { country: "Monaco", code: "+377", iso: "mc" },
  { country: "Mongolia", code: "+976", iso: "mn" },
  { country: "Montenegro", code: "+382", iso: "me" },
  { country: "Morocco", code: "+212", iso: "ma" },
  { country: "Mozambique", code: "+258", iso: "mz" },
  { country: "Myanmar", code: "+95", iso: "mm" },
  { country: "Namibia", code: "+264", iso: "na" },
  { country: "Nauru", code: "+674", iso: "nr" },
  { country: "Nepal", code: "+977", iso: "np" },
  { country: "New Zealand", code: "+64", iso: "nz" },
  { country: "Nicaragua", code: "+505", iso: "ni" },
  { country: "Niger", code: "+227", iso: "ne" },
  { country: "Nigeria", code: "+234", iso: "ng" },
  { country: "North Korea", code: "+850", iso: "kp" },
  { country: "North Macedonia", code: "+389", iso: "mk" },
  { country: "Oman", code: "+968", iso: "om" },
  { country: "Pakistan", code: "+92", iso: "pk" },
  { country: "Palau", code: "+680", iso: "pw" },
  { country: "Palestine", code: "+970", iso: "ps" },
  { country: "Panama", code: "+507", iso: "pa" },
  { country: "Papua New Guinea", code: "+675", iso: "pg" },
  { country: "Paraguay", code: "+595", iso: "py" },
  { country: "Peru", code: "+51", iso: "pe" },
  { country: "Philippines", code: "+63", iso: "ph" },
  { country: "Qatar", code: "+974", iso: "qa" },
  { country: "Romania", code: "+40", iso: "ro" },
  { country: "Russia", code: "+7", iso: "ru" },
  { country: "Rwanda", code: "+250", iso: "rw" },
  { country: "Saint Kitts and Nevis", code: "+1-869", iso: "kn" },
  { country: "Saint Lucia", code: "+1-758", iso: "lc" },
  { country: "Saint Vincent", code: "+1-784", iso: "vc" },
  { country: "Samoa", code: "+685", iso: "ws" },
  { country: "San Marino", code: "+378", iso: "sm" },
  { country: "Saudi Arabia", code: "+966", iso: "sa" },
  { country: "Senegal", code: "+221", iso: "sn" },
  { country: "Serbia", code: "+381", iso: "rs" },
  { country: "Seychelles", code: "+248", iso: "sc" },
  { country: "Sierra Leone", code: "+232", iso: "sl" },
  { country: "Singapore", code: "+65", iso: "sg" },
  { country: "Slovakia", code: "+421", iso: "sk" },
  { country: "Slovenia", code: "+386", iso: "si" },
  { country: "Solomon Islands", code: "+677", iso: "sb" },
  { country: "Somalia", code: "+252", iso: "so" },
  { country: "South Africa", code: "+27", iso: "za" },
  { country: "South Korea", code: "+82", iso: "kr" },
  { country: "South Sudan", code: "+211", iso: "ss" },
  { country: "Sri Lanka", code: "+94", iso: "lk" },
  { country: "Sudan", code: "+249", iso: "sd" },
  { country: "Suriname", code: "+597", iso: "sr" },
  { country: "Syria", code: "+963", iso: "sy" },
  { country: "Taiwan", code: "+886", iso: "tw" },
  { country: "Tajikistan", code: "+992", iso: "tj" },
  { country: "Tanzania", code: "+255", iso: "tz" },
  { country: "Thailand", code: "+66", iso: "th" },
  { country: "Togo", code: "+228", iso: "tg" },
  { country: "Tonga", code: "+676", iso: "to" },
  { country: "Trinidad and Tobago", code: "+1-868", iso: "tt" },
  { country: "Tunisia", code: "+216", iso: "tn" },
  { country: "Turkey", code: "+90", iso: "tr" },
  { country: "Turkmenistan", code: "+993", iso: "tm" },
  { country: "Tuvalu", code: "+688", iso: "tv" },
  { country: "Uganda", code: "+256", iso: "ug" },
  { country: "Ukraine", code: "+380", iso: "ua" },
  { country: "United Arab Emirates", code: "+971", iso: "ae" },
  { country: "Uruguay", code: "+598", iso: "uy" },
  { country: "Uzbekistan", code: "+998", iso: "uz" },
  { country: "Vanuatu", code: "+678", iso: "vu" },
  { country: "Vatican City", code: "+379", iso: "va" },
  { country: "Venezuela", code: "+58", iso: "ve" },
  { country: "Vietnam", code: "+84", iso: "vn" },
  { country: "Yemen", code: "+967", iso: "ye" },
  { country: "Zambia", code: "+260", iso: "zm" },
  { country: "Zimbabwe", code: "+263", iso: "zw" },
];

export const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch", "Polish", "Swedish", "Danish", "Norwegian", "Greek", "Russian", "Chinese", "Japanese", "Korean", "Arabic"];

/* ═══════════════════════════════════════════════════
   TAX CLASS & INVOICE TYPE — supplier-level defaults
   ═══════════════════════════════════════════════════
   These are set on the supplier profile (Orders & Payments tab) as business-level defaults.
   Individual deals can override them when the deal has specific tax/invoice requirements.
   API: supplier_profiles.defaultTaxClass, supplier_profiles.defaultInvoiceType
   Deal override: deals.taxClass, deals.invoiceType (if non-null, takes precedence). */
export const TAX_CLASS_OPTIONS = [
  { value: "standard",   label: "Standard Rate" },
  { value: "reduced",    label: "Reduced Rate" },
  { value: "zero-rated", label: "Zero-Rated" },
  { value: "exempt",     label: "VAT Exempt" },
];

export const INVOICE_TYPE_OPTIONS = [
  { value: "VAT",          label: "VAT Invoice" },
  { value: "EU Community", label: "EU Community Invoice" },
  { value: "Both",         label: "Both (VAT + EU Community)" },
];

export const SANITIZED_INVOICE_OPTIONS = [
  { value: "Available",   label: "Available" },
  { value: "On Request",  label: "On Request" },
  { value: "Unavailable", label: "Unavailable" },
];

export const INCOTERMS_OPTIONS = [
  { value: "EXW", label: "EXW — Ex Works" },
  { value: "FCA", label: "FCA — Free Carrier" },
  { value: "FOB", label: "FOB — Free on Board" },
  { value: "CIF", label: "CIF — Cost, Insurance & Freight" },
  { value: "DAP", label: "DAP — Delivered at Place" },
  { value: "DDP", label: "DDP — Delivered Duty Paid" },
];

/* LANGUAGE_COLORS & LANGUAGE_FLAGS — color-coded pills with representative country flags.
   Canonical color + flag mapping used in supplier-sidebar.jsx and anywhere languages are displayed.
   Each language pill shows a small country flag (via LANGUAGE_FLAGS) for quick visual recognition.
   Color grouping by linguistic family:
   - Blue:    Germanic (English→GB, German→DE, Dutch→NL, Swedish→SE, Danish→DK, Norwegian→NO)
   - Violet:  Romance (French→FR, Spanish→ES, Italian→IT, Portuguese→PT)
   - Emerald: Slavic (Polish→PL, Russian→RU)
   - Amber:   Hellenic (Greek→GR)
   - Rose:    Semitic (Arabic→SA)
   - Sky/Cyan/Teal: East Asian (Chinese→CN, Japanese→JP, Korean→KR)
   - Slate:   Fallback for unlisted languages
   Implementation lives in supplier-sidebar.jsx LANGUAGE_COLORS + LANGUAGE_FLAGS constants. */

/* Countries imported from canonical source — now includes continent field */
import { COUNTRIES as _COUNTRIES, CONTINENTS as _CONTINENTS, COUNTRIES_BY_CONTINENT as _CBC, getContinentForCountry as _gCFC, getCountriesForContinent as _gCFC2 } from "@/lib/countries";
export const COUNTRIES = _COUNTRIES;
export const CONTINENTS = _CONTINENTS;
export const COUNTRIES_BY_CONTINENT = _CBC;
export const getContinentForCountry = _gCFC;
export const getCountriesForContinent = _gCFC2;

/* Phone validation rules per country code length ranges */
export const PHONE_RULES = {
  "+1": { min: 10, max: 10, label: "10 digits" },
  "+44": { min: 10, max: 11, label: "10-11 digits" },
  "+49": { min: 10, max: 12, label: "10-12 digits" },
  "+33": { min: 9, max: 10, label: "9-10 digits" },
  "+39": { min: 9, max: 11, label: "9-11 digits" },
  "+34": { min: 9, max: 9, label: "9 digits" },
  "+31": { min: 9, max: 9, label: "9 digits" },
  "+32": { min: 8, max: 9, label: "8-9 digits" },
  "+41": { min: 9, max: 9, label: "9 digits" },
  "+43": { min: 10, max: 13, label: "10-13 digits" },
  "+46": { min: 7, max: 13, label: "7-13 digits" },
  "+47": { min: 8, max: 8, label: "8 digits" },
  "+45": { min: 8, max: 8, label: "8 digits" },
  "+48": { min: 9, max: 9, label: "9 digits" },
  "+353": { min: 7, max: 9, label: "7-9 digits" },
  "+351": { min: 9, max: 9, label: "9 digits" },
  "+30": { min: 10, max: 10, label: "10 digits" },
  "+61": { min: 9, max: 9, label: "9 digits" },
};

/* Phone format placeholder examples per country code */
export const PHONE_PLACEHOLDERS = {
  "+1": "XXX XXX XXXX",
  "+44": "07XXX XXXXXX",
  "+49": "1XX XXXXXXXX",
  "+33": "6 XX XX XX XX",
  "+39": "3XX XXX XXXX",
  "+34": "6XX XXX XXX",
  "+31": "6 XXXXXXXX",
  "+32": "4XX XX XX XX",
  "+41": "7X XXX XX XX",
  "+43": "6XX XXXXXXX",
  "+46": "7X XXX XX XX",
  "+47": "XXX XX XXX",
  "+45": "XX XX XX XX",
  "+48": "XXX XXX XXX",
  "+353": "8X XXX XXXX",
  "+351": "9XX XXX XXX",
  "+30": "69X XXX XXXX",
  "+61": "4XX XXX XXX",
};

/* ─────────── Dropdown Hook ─────────── */
export function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const clickHandler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const keyHandler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", clickHandler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", clickHandler); document.removeEventListener("keydown", keyHandler); };
  }, []);
  return { open, setOpen, ref };
}

/* ═══════════════════════════════════════════════════
   HELP TOOLTIP — hover/focus tooltip for form fields
   ═══════════════════════════════════════════════════ */
export function HelpTooltip({ text }) {
  const [show, setShow] = useState(false);
  if (!text) return null;
  return (
    <span className="relative inline-flex ml-1 align-middle">
      <button
        type="button"
        className="text-slate-300 hover:text-orange-400 transition-colors focus:outline-none focus:text-orange-400"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label={text}
        tabIndex={-1}
      >
        <HelpCircle size={13} />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg whitespace-normal w-52 text-center z-50 leading-relaxed pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING FIELD — Dashboard variant with left icon
   Matches auth-ui.jsx FloatingField patterns
   ═══════════════════════════════════════════════════ */
export function FloatingField({ label, required, error, value, onChange, onBlur, type = "text", placeholder = "", id, icon: Icon, disabled, autoComplete = "off", inputMode, className = "", children, help, onFocusField }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const alwaysFloat = type === "date" || type === "datetime-local" || type === "time" || type === "month" || type === "week";
  const floated = focused || hasValue || alwaysFloat;
  const errorId = id && error ? `${id}-error` : undefined;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div className={className}>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor} ${disabled ? "opacity-60" : ""}`}>
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none ${Icon ? "left-10" : "left-3.5"} ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className={error ? "text-red-400" : focused ? "text-orange-400" : hasValue ? "text-emerald-500" : "text-slate-400"} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => { setFocused(true); if (onFocusField) onFocusField(id); }}
          onBlur={(e) => { setFocused(false); if (onFocusField) onFocusField(null); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className={`w-full py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg ${Icon ? "pl-10 pr-9" : "pl-3.5 pr-9"} ${disabled ? "cursor-not-allowed" : ""}`}
          placeholder={focused ? placeholder : ""}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        {/* Right side: status icon or custom children (e.g. password toggle) */}
        {children || (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
            ) : hasValue && !disabled ? (
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
            ) : null}
          </div>
        )}
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
      {!error && help && <p className="text-[11px] text-slate-400 mt-1 ml-1 flex items-center gap-1"><Info size={11} className="shrink-0 text-slate-300" />{help}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COUNTRY SELECT — Custom dropdown with flags,
   matching /contact FloatingSelect pattern
   ═══════════════════════════════════════════════════ */
export function CountrySelect({ label, required, value, onChange, onBlur, error, id, icon: Icon, className = "", onFocusField }) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const errorId = id && error ? `${id}-error` : undefined;
  const listboxId = `${id}-listbox`;

  const selectedCountry = COUNTRIES.find((c) => c.value === value);

  const filtered = search
    ? COUNTRIES.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  useEffect(() => {
    const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false); setSearch(""); } };
    const keyHandler = (e) => { if (e.key === "Escape") { setOpen(false); setSearch(""); } };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", keyHandler); };
  }, []);

  const handleKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && highlightIdx >= 0) { e.preventDefault(); onChange({ target: { value: filtered[highlightIdx].value } }); setOpen(false); setSearch(""); if (onBlur) setTimeout(() => onBlur(), 120); }
    else if (e.key === "Home") { e.preventDefault(); setHighlightIdx(0); }
    else if (e.key === "End") { e.preventDefault(); setHighlightIdx(filtered.length - 1); }
  };

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : open
    ? "border-orange-400"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : open ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  // Inline border styles — avoid Tailwind specificity conflicts
  const openBorderColor = '#fb923c'; // orange-400
  const openBtnStyle = {
    borderWidth: '1px 1px 0 1px',
    borderStyle: 'solid',
    borderColor: openBorderColor,
    borderRadius: '12px 12px 0 0',
    boxShadow: 'none',
    outline: 'none',
  };
  const openPanelStyle = {
    top: '100%',
    borderWidth: '0 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: openBorderColor,
    borderRadius: '0 0 12px 12px',
  };
  const closedBtnStyle = { borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0,0,0,0.1)' };
  const closedBtnClass = `border ${stateStyle} ${bgColor}`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && highlightIdx >= 0 ? `${id}-opt-${highlightIdx}` : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={`relative w-full flex items-center justify-between px-3.5 py-3.5 text-left transition-all duration-200 cursor-pointer outline-none ${open ? "bg-white" : `hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] ${closedBtnClass}`}`}
        style={open ? openBtnStyle : closedBtnStyle}
      >
        {/* Floating label */}
        <span
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            hasValue || open
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "text-sm"
          } ${
            error ? "text-red-600" : open ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-700 font-medium"
          }`}
        >
          {Icon && <Icon size={13} className="inline mr-1.5 -mt-0.5" />}
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </span>

        {/* Selected value */}
        <span className={`text-[15px] flex items-center gap-2 ${hasValue ? "text-slate-800" : "text-transparent"}`}>
          {selectedCountry && <FlagImg iso={selectedCountry.iso} size={20} />}
          {selectedCountry ? selectedCountry.label : label}
        </span>

        {/* Right icons */}
        <span className="flex items-center gap-1.5 shrink-0">
          {error ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : hasValue ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span> : null}
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {/* Dropdown panel — absolute positioned, no top border for seamless join */}
      {open && (
        <div
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 bg-white shadow-xl z-50"
          style={openPanelStyle}
        >
          <div className="border-t border-slate-100" />
          {/* Search */}
          <div className="p-2.5 border-b border-slate-100">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setHighlightIdx(0); }}
                placeholder="Search countries..."
                onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-orange-300 outline-none"
                autoFocus
                aria-label="Search countries"
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto thin-scrollbar py-1">
            {filtered.map((opt, idx) => (
              <div
                key={opt.value}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange({ target: { value: opt.value } }); setOpen(false); setSearch(""); if (onBlur) setTimeout(() => onBlur(), 120); }}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`w-full flex items-center gap-3 text-left px-4 py-2.5 text-[15px] transition-colors cursor-pointer ${
                  value === opt.value
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : idx === highlightIdx
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FlagImg iso={opt.iso} size={22} />
                <span>{opt.label}</span>
                {value === opt.value && <CheckCircle2 size={16} className="ml-auto text-orange-500" />}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-3.5 py-3 text-sm text-slate-400 text-center">No countries found</p>
            )}
          </div>
        </div>
      )}

      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING TEXTAREA — With char counter
   ═══════════════════════════════════════════════════ */
export function FloatingTextarea({ label, required, error, value, onChange, onBlur, id, maxLength = 2000, placeholder = "", className = "", onFocusField, help, maxHeight = 200 }) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const floated = focused || hasValue;

  // Auto-expand: reset to auto, measure scrollHeight, cap at maxHeight
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);
  const charCount = value ? value.length : 0;
  const errorId = id && error ? `${id}-error` : undefined;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div className={className}>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-4 text-sm"
          } ${
            error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => { if (e.target.value.length <= maxLength) onChange(e); }}
          onFocus={() => { setFocused(true); if (onFocusField) onFocusField(id); }}
          onBlur={(e) => { setFocused(false); if (onFocusField) onFocusField(null); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          rows={3}
          className="w-full px-3.5 py-3.5 pr-9 text-sm text-slate-800 bg-transparent outline-none rounded-lg resize-none"
          style={{ minHeight: "5rem" }}
          placeholder={focused ? placeholder : ""}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
        />
        {/* Validation icon — top right */}
        <div className="absolute right-3 top-3.5 pointer-events-none">
          {error ? (
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
          ) : hasValue ? (
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex-1">
          {error ? <p id={errorId} className="text-xs text-red-600 ml-1" role="alert">{error}</p> : help ? <p className="text-[10px] text-slate-400 ml-1">{help}</p> : <span />}
        </div>
        <p className="text-[10px] text-slate-400 text-right shrink-0">{charCount}/{maxLength} char.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHONE INPUT — Phone code selector + number input
   ═══════════════════════════════════════════════════ */
export function PhoneInput({ label, required, phoneCode, setPhoneCode, value, onChange, error, id, onFocusField, onBlur }) {
  const dd = useDropdown();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  const filtered = PHONE_CODES.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 ${stateStyle} ${bgColor}`}>
        <div className="flex items-center">
          {/* Code selector */}
          <div ref={dd.ref} className="relative shrink-0">
            <button
              type="button"
              onClick={() => dd.setOpen(!dd.open)}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-3.5 text-xs bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 transition-all rounded-l-lg border-r border-slate-200/80 cursor-pointer shadow-[0px_2px_4px_rgba(0,0,0,0.08)]"
              aria-label={`Phone country code: ${phoneCode.code}`}
              aria-haspopup="listbox"
              aria-expanded={dd.open}
            >
              <FlagImg iso={phoneCode.iso} size={18} />
              <span className="text-slate-600 font-semibold">{phoneCode.code}</span>
              <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
            </button>
            {dd.open && (
              <div className="absolute left-0 top-full -mt-px w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-30 overflow-hidden" role="listbox" aria-label="Select country code">
                <div className="p-2 border-b border-slate-100">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search..."
                      onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                      className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-orange-300 outline-none"
                      autoFocus
                      aria-label="Search countries"
                    />
                  </div>
                </div>
                <div className="max-h-52 overflow-y-auto thin-scrollbar py-1">
                  {filtered.map((c) => (
                    <button
                      key={`${c.country}-${c.code}`}
                      type="button"
                      role="option"
                      aria-selected={phoneCode.code === c.code && phoneCode.country === c.country}
                      onClick={() => { setPhoneCode(c); dd.setOpen(false); setSearch(""); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left hover:bg-orange-50 transition-colors ${
                        phoneCode.code === c.code && phoneCode.country === c.country ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600"
                      }`}
                    >
                      <FlagImg iso={c.iso} size={18} />
                      <span className="flex-1">{c.country}</span>
                      <span className="text-slate-400 font-mono">{c.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Number input with floating label — inset shadow on input area only */}
          <div className="relative flex-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] rounded-r-lg">
            <label
              htmlFor={id}
              className={`absolute left-3.5 transition-all duration-200 pointer-events-none z-10 ${
                floated
                  ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
                  : "top-1/2 -translate-y-1/2 text-sm"
              } ${
                error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
              id={id}
              type="tel"
              inputMode="tel"
              value={value}
              onChange={(e) => {
                /* Only allow digits, spaces, hyphens */
                const cleaned = e.target.value.replace(/[^\d\s-]/g, "");
                onChange({ target: { value: cleaned } });
              }}
              onFocus={() => setFocused(true)}
              onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
              className="w-full py-3.5 pr-3.5 pl-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-r-lg"
              placeholder={focused ? (PHONE_PLACEHOLDERS[phoneCode.code] || "Enter number") : ""}
              required={required || undefined}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MULTI SELECT — Unified multi-select dropdown component.
   Replaces: MultiSelectDropdown, TagSelector,
   FocusMarketSelector, LanguageSelector.
   ═══════════════════════════════════════════════════ */

/**
 * @param {object} props
 * @param {Array<{value:string, label:string, iso?:string}>} props.options — selectable options
 * @param {string[]} props.selected — currently selected values
 * @param {function} props.onChange — receives updated array of selected values
 * @param {string} props.label — field label text
 * @param {"floating"|"block"} [props.labelType="floating"] — floating animates into border; block is static above
 * @param {React.ComponentType} [props.icon] — optional left icon (lucide component)
 * @param {boolean} [props.showFlags=false] — render FlagImg in pills & dropdown (uses opt.iso)
 * @param {boolean} [props.showCheckboxes=true] — show checkbox squares in the dropdown list
 * @param {boolean} [props.filterSelected=false] — true hides already-selected from dropdown
 * @param {number} [props.maxItems] — optional cap on selections
 * @param {boolean} [props.showCount=false] — render "{n}/{max} {noun}" footer
 * @param {string} [props.countNoun="tag"] — singular noun for the count footer (auto-pluralises)
 * @param {string} [props.searchPlaceholder="Search..."]
 * @param {string} [props.emptyMessage="No results found"]
 * @param {boolean} props.required
 * @param {string} props.error
 * @param {string} props.id
 * @param {function} [props.onFocusField]
 * @param {string} [props.className]
 */
export function MultiSelect({
  options,
  selected = [],
  onChange,
  label,
  labelType = "floating",
  icon: Icon,
  showFlags = false,
  showCheckboxes = true,
  filterSelected = false,
  maxItems,
  showCount = false,
  countNoun = "tag",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  required,
  error,
  id,
  onFocusField,
  className = "",
}) {
  const dd = useDropdown();
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const wasFocusedRef = useRef(false);
  const hasValue = selected.length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;
  const hasIcon = !!Icon;

  const filtered = options.filter((o) => {
    const matchesSearch = o.label.toLowerCase().includes(search.toLowerCase());
    if (filterSelected) return matchesSearch && !selected.includes(o.value);
    return matchesSearch;
  });

  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!maxItems || selected.length < maxItems) {
      onChange([...selected, value]);
    }
    setSearch("");
  };

  const remove = (value) => onChange(selected.filter((v) => v !== value));

  const findOpt = (val) => options.find((o) => o.value === val);

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div className={className}>
      {/* Block label (TagSelector style) */}
      {labelType === "block" && label && (
        <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}

      <div ref={dd.ref} className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        {/* Floating label */}
        {labelType === "floating" && label && (
          <label
            htmlFor={id}
            className={`absolute transition-all duration-200 pointer-events-none z-10 ${hasIcon ? "left-10" : "left-3.5"} ${
              floated
                ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
                : "top-1/2 -translate-y-1/2 text-sm"
            } ${
              error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
            }`}
          >
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
        )}

        {/* Left icon */}
        {hasIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className={error ? "text-red-400" : focused ? "text-orange-400" : hasValue ? "text-emerald-500" : "text-slate-400"} />
          </div>
        )}

        {/* Pills + search input */}
        <div
          className={`min-h-[50px] ${hasIcon ? "pl-10" : "pl-3"} pr-8 py-2 flex flex-wrap gap-1.5 items-center cursor-text`}
          onClick={(e) => { if (e.target.tagName === "INPUT") return; if (dd.open) { dd.setOpen(false); document.getElementById(id)?.blur(); } else { dd.setOpen(true); setFocused(true); document.getElementById(id)?.focus(); } }}
        >
          {selected.map((val) => {
            const opt = findOpt(val);
            return (
              <span key={val} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 text-[13px] font-semibold bg-orange-500 text-white rounded-lg shadow-sm">
                {showFlags && opt?.iso && <FlagImg iso={opt.iso} size={16} />}
                {opt?.label || val}
                <button type="button" onClick={(e) => { e.stopPropagation(); remove(val); }} className="relative w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white/60 before:absolute before:-inset-2 before:content-['']" aria-label={`Remove ${opt?.label || val}`}>
                  <X size={9} strokeWidth={3} />
                </button>
              </span>
            );
          })}
          <input
            id={id}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); dd.setOpen(true); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); return; }
              if ((e.key === "Backspace" || e.key === "Delete") && search === "" && selected.length > 0) { e.preventDefault(); remove(selected[selected.length - 1]); }
            }}
            placeholder={selected.length === 0 && !focused ? (labelType === "block" ? searchPlaceholder : "") : selected.length === 0 ? searchPlaceholder : selected.length >= options.length ? "" : "Add more..."}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none py-1"
            onFocus={() => { setFocused(true); dd.setOpen(true); wasFocusedRef.current = false; }}
            onBlur={() => { setFocused(false); wasFocusedRef.current = false; }}
            onClick={(e) => { if (wasFocusedRef.current) { e.stopPropagation(); dd.setOpen(!dd.open); } wasFocusedRef.current = true; }}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={dd.open}
          />
        </div>

        {/* Chevron */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown panel */}
        {dd.open && (
          <div className="absolute left-0 right-0 top-full -mt-px bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-80 overflow-y-auto thin-scrollbar py-1" role="listbox" aria-label={label}>
            {filtered.length > 0 ? filtered.map((opt) => {
              const isChecked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isChecked}
                  onClick={(e) => { e.stopPropagation(); toggle(opt.value); document.getElementById(id)?.focus(); }}
                  className={`w-full flex items-center gap-3 text-left px-3.5 py-2.5 text-[15px] transition-colors hover:bg-orange-50 ${
                    isChecked ? "bg-orange-50/50 text-orange-700 font-medium" : "text-slate-600"
                  }`}
                >
                  {showCheckboxes && (
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked ? "bg-orange-500 border-orange-500" : "border-slate-300"
                    }`}>
                      {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  )}
                  {showFlags && opt.iso && <FlagImg iso={opt.iso} size={18} />}
                  <span className="flex-1">{opt.label}</span>
                  {opt.desc && <span className="text-xs text-slate-400 ml-1">{opt.desc}</span>}
                </button>
              );
            }) : (
              <p className="px-3.5 py-3 text-sm text-slate-400 italic text-center">{search ? emptyMessage : "No options available"}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer: error + optional count */}
      {showCount ? (
        <div className="flex items-center justify-between mt-1">
          {error ? <p id={errorId} className="text-xs text-red-600 ml-0.5" role="alert">{error}</p> : <span />}
          <span className="text-[10px] text-slate-400">{selected.length}{maxItems ? `/${maxItems}` : ""} {selected.length === 1 ? countNoun : /[^aeiou]y$/i.test(countNoun) ? countNoun.slice(0, -1) + "ies" : countNoun + "s"}</span>
        </div>
      ) : error ? (
        <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>
      ) : null}
    </div>
  );
}

/* Backward-compatible wrapper — LanguageSelector */
export function LanguageSelector({ selected, setSelected, required, error, id, onFocusField, label = "Languages Spoken" }) {
  const langOptions = useMemo(() => LANGUAGES.map((l) => ({ value: l, label: l })), []);
  return (
    <MultiSelect
      options={langOptions}
      selected={selected}
      onChange={setSelected}
      label={label}
      labelType="floating"
      icon={Languages}
      showCheckboxes={true}
      searchPlaceholder="Select languages"
      emptyMessage="No language found"
      required={required}
      error={error}
      id={id}
      onFocusField={onFocusField}
    />
  );
}

/* ═══════════════════════════════════════════════════
   CURRENCIES — shared across buyer-profile & other forms
   ═══════════════════════════════════════════════════ */

export const CURRENCIES = [
  { value: "GBP", label: "\u00a3 GBP" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "\u20ac EUR" },
];

/* ═══════════════════════════════════════════════════
   FLOATING SELECT — custom dropdown with floating label,
   keyboard navigation, state-based styling.
   Shared by account-profile, buyer-profile, contact, etc.
   ═══════════════════════════════════════════════════ */

export function FloatingSelect({ label, required, value, onChange, options, error, id, onFocusField, onBlur, className = "", placeholder = "", disabled = false }) {
  const [open, setOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const hasValue = !!value;
  const errorId = id && error ? `${id}-error` : undefined;
  const listboxId = `${id}-listbox`;

  const selectedOption = options.find((o) => o.value === value);

  // For optional fields with a value selected, prepend a "Select..." reset option
  const allOptions = useMemo(() => {
    if (required || !hasValue) return options;
    return [{ value: "", label: placeholder || "Select..." }, ...options];
  }, [options, required, hasValue, placeholder]);

  useEffect(() => {
    const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false); if (onBlur) onBlur(); } };
    const keyHandler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", keyHandler); };
  }, [onBlur]);

  /* Reset highlight when opening */
  useEffect(() => {
    if (open) {
      const currentIdx = allOptions.findIndex((o) => o.value === value);
      setHighlightIdx(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [open]);

  /* Scroll highlighted option into view */
  useEffect(() => {
    if (open && listRef.current && highlightIdx >= 0) {
      const item = listRef.current.children[highlightIdx];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx, open]);

  const handleKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); setOpen(true); return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx((p) => Math.min(p + 1, allOptions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && highlightIdx >= 0) { e.preventDefault(); onChange(allOptions[highlightIdx].value); setOpen(false); if (onFocusField) onFocusField(null); }
    else if (e.key === "Home") { e.preventDefault(); setHighlightIdx(0); }
    else if (e.key === "End") { e.preventDefault(); setHighlightIdx(allOptions.length - 1); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "Tab") { setOpen(false); if (onBlur) onBlur(); }
  };

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : open
    ? "border-orange-400"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : open ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  // Inline border styles to avoid Tailwind specificity conflicts
  // When open: button has top+side borders (no bottom), panel has side+bottom borders (no top)
  const openBorderColor = '#fb923c'; // orange-400
  const openBtnStyle = {
    borderWidth: '1px 1px 0 1px',
    borderStyle: 'solid',
    borderColor: openBorderColor,
    borderRadius: '12px 12px 0 0',
    boxShadow: 'none',
    outline: 'none',
  };
  const openPanelStyle = {
    top: '100%',
    borderWidth: '0 1px 1px 1px',
    borderStyle: 'solid',
    borderColor: openBorderColor,
    borderRadius: '0 0 12px 12px',
  };
  const closedBtnStyle = { borderRadius: '8px', boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' };
  const closedBtnClass = `border ${stateStyle} ${bgColor}`;

  return (
    <div ref={containerRef} className={`relative self-start ${className}`}>
      <button
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open && highlightIdx >= 0 ? `${id}-opt-${highlightIdx}` : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        disabled={disabled || undefined}
        onClick={() => { if (!disabled) { setOpen(!open); if (onFocusField) onFocusField(open ? null : id); } }}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (onFocusField) onFocusField(null); }}
        className={`relative w-full flex items-center justify-between px-3.5 py-3.5 text-left transition-all duration-200 cursor-pointer outline-none disabled:opacity-70 disabled:cursor-not-allowed ${open ? "bg-white" : `hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)] ${closedBtnClass}`}`}
        style={open ? openBtnStyle : closedBtnStyle}
      >
          {/* Floating label — floats up when value selected, dropdown open, or placeholder visible */}
          <span
            className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
              hasValue || open || placeholder
                ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
                : "text-sm"
            } ${
              error ? "text-red-600" : open ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-700 font-medium"
            }`}
          >
            {label}{required && <span className="text-red-400 ml-0.5">*</span>}
          </span>

          {/* Selected value — placeholder visible when no value is selected */}
          <span className={`text-[15px] ${hasValue ? "text-slate-800" : placeholder ? "text-slate-500" : "text-transparent"}`}>
            {selectedOption ? selectedOption.label : placeholder || label}
          </span>

          {/* Right icons */}
          <span className="flex items-center gap-1.5 shrink-0">
            {error ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : hasValue ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span> : null}
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </span>
      </button>

      {/* Custom dropdown panel — absolute positioned, no top border to create seamless join */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          ref={listRef}
          aria-label={label}
          className="absolute left-0 right-0 bg-white shadow-xl z-50"
          style={openPanelStyle}
        >
          <div className="border-t border-slate-100" />
          <div className="max-h-64 overflow-y-auto thin-scrollbar py-1">
            {allOptions.map((opt, idx) => (
              <div
                key={opt.value || "__reset__"}
                id={`${id}-opt-${idx}`}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); if (onFocusField) onFocusField(null); }}
                onMouseEnter={() => setHighlightIdx(idx)}
                className={`w-full flex items-center justify-between text-left px-4 py-3 text-[15px] transition-colors cursor-pointer ${
                  opt.value === "" && !required
                    ? idx === highlightIdx ? "bg-slate-100 text-slate-400 italic" : "text-slate-400 italic hover:bg-slate-50"
                    : value === opt.value
                    ? "bg-orange-50 text-orange-700 font-semibold"
                    : idx === highlightIdx
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && opt.value !== "" && <Check size={14} className="text-orange-500 shrink-0" strokeWidth={2.5} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM SECTION WRAPPER
   ═══════════════════════════════════════════════════ */
export function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="pt-6 first:pt-0">
      <div className="flex items-center gap-2.5 mb-5">
        {Icon && <Icon size={18} className="text-slate-700 shrink-0" />}
        <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FOCUS TRAP HOOK — for modal dialogs
   Traps focus within the modal while it's open.
   Returns a ref to attach to the dialog element.
   ═══════════════════════════════════════════════════ */
export function useFocusTrap(isOpen) {
  const ref = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const dialog = ref.current;
    const focusableElements = dialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    previousFocusRef.current = document.activeElement;
    firstElement?.focus?.();

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) { e.preventDefault(); lastElement?.focus?.(); }
      } else {
        if (document.activeElement === lastElement) { e.preventDefault(); firstElement?.focus?.(); }
      }
    };
    dialog.addEventListener("keydown", handleKeyDown);
    return () => { dialog.removeEventListener("keydown", handleKeyDown); previousFocusRef.current?.focus?.(); };
  }, [isOpen]);

  return ref;
}

/* ═══════════════════════════════════════════════════
   TAB STATUS — progress badge for a single tab
   ═══════════════════════════════════════════════════ */
export function TabStatus({ status }) {
  if (status === "complete") return <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={10} className="text-white" strokeWidth={3} /></span>;
  if (status === "partial") return (
    <span className="w-4 h-4 rounded-full border-2 border-orange-400 flex items-center justify-center shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
    </span>
  );
  return <Circle size={16} className="text-slate-300 shrink-0" />;
}

/* ═══════════════════════════════════════════════════
   TAB PROGRESS BADGE — numbered circle with stroke progress
   States (weighted by required fields from TAB_FIELDS):
   - 0/4 + unselected: grey border, white inside, grey number
   - 0/4 + selected:   orange border, white inside, orange number
   - 1/4 filled:       green stroke 1/4 around circumference, light-green fill, green number
   - 2/4 filled:       green stroke 2/4 around circumference, light-green fill, green number
   - 3/4 filled:       green stroke 3/4 around circumference, light-green fill, green number
   - 4/4 filled:       full green border, green fill, white number
   Once any progress exists, green takes over regardless of selection.
   ═══════════════════════════════════════════════════ */
export function TabProgressBadge({ tabNumber, progress, isActive }) {
  // progress: 0-1 float → quantise to quarters
  const quarter = progress >= 1 ? 4 : progress >= 0.75 ? 3 : progress >= 0.5 ? 2 : progress >= 0.25 ? 1 : 0;
  const hasProgress = quarter > 0;
  const isComplete = quarter === 4;

  const size = 22;
  const cx = size / 2;
  const cy = size / 2;
  const r = 9;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (quarter / 4) * circumference;

  // Number color: green when partial progress, white when complete, orange/grey when empty
  const numberColor = isComplete ? "text-white" : hasProgress ? "text-emerald-600" : isActive ? "text-orange-500" : "text-slate-400";

  return (
    <span className="relative shrink-0 inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0" aria-hidden="true">
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={r}
          fill={isComplete ? "#10b981" : hasProgress ? "#d1fae5" : "white"}
          stroke={isComplete ? "#10b981" : hasProgress ? "#d1fae5" : isActive ? "#f97316" : "#cbd5e1"}
          strokeWidth={2}
        />
        {/* Progress stroke around circumference (partial only, starts from top) */}
        {hasProgress && !isComplete && (
          <circle cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#10b981"
            strokeWidth={2.5}
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )}
      </svg>
      <span className={`relative text-[10px] font-semibold ${numberColor}`}>{tabNumber}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   PROFILE TAB BAR — horizontal with status chips
   ═══════════════════════════════════════════════════ */
export function ProfileTabBar({ activeTab, setActiveTab, tabStatuses, tabProgress, tabs }) {
  const tabBarRef = useRef(null);

  useEffect(() => {
    if (!tabBarRef.current) return;
    const activeEl = tabBarRef.current.querySelector(`[data-tab="${activeTab}"]`);
    if (activeEl) activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeTab]);

  // WAI-ARIA Tabs pattern: Arrow keys move between tabs
  const handleTabKeyDown = (e) => {
    const currentIdx = tabs.findIndex((t) => t.id === activeTab);
    let nextIdx = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIdx = (currentIdx + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = tabs.length - 1;
    }
    if (nextIdx >= 0) {
      setActiveTab(tabs[nextIdx].id);
      tabBarRef.current?.querySelector(`[data-tab="${tabs[nextIdx].id}"]`)?.focus();
    }
  };

  return (
    <div
      ref={tabBarRef}
      className="flex gap-1 overflow-x-auto scrollbar-hide -mx-6 lg:-mx-8 px-6 lg:px-8"
      role="tablist"
      aria-label="Profile sections"
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const progress = tabProgress ? tabProgress[tab.id] : 0;
        return (
          <button
            key={tab.id}
            type="button"
            data-tab={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={handleTabKeyDown}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${
              isActive
                ? "border-orange-500 text-orange-600 bg-orange-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <tab.icon size={15} className={isActive ? "text-orange-500" : "text-slate-400"} />
            <span className="hidden lg:inline">{tab.label}</span>
            <span className="lg:hidden">{tab.shortLabel}</span>
            <TabProgressBadge tabNumber={idx + 1} progress={progress} isActive={isActive} />
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROFILE PROGRESS BAR — visual completion indicator
   ═══════════════════════════════════════════════════ */
export function ProfileProgressBar({ form, languages, onPctChange }) {
  // Weighted progress: required fields count 3x, optional fields count 1x
  const REQUIRED_WEIGHT = 3;
  const OPTIONAL_WEIGHT = 1;
  const requiredFields = ["salutation", "firstName", "lastName", "companyName", "addressLine1", "city", "postcode", "country", "mobileNumber", "businessEmail"];
  const optionalFields = ["regNumber", "taxId", "roleInCompany", "yearEstablished", "companySize", "addressLine2", "landlineNumber", "personalEmail", "teamsHandle", "linkedinUrl", "whatsappNumber"];
  // Languages is required
  const isFilled = (f) => form[f] && String(form[f]).trim().length > 0;

  let earned = 0;
  let total = 0;
  for (const f of requiredFields) { total += REQUIRED_WEIGHT; if (isFilled(f)) earned += REQUIRED_WEIGHT; }
  // Languages (required)
  total += REQUIRED_WEIGHT;
  if (languages.length > 0) earned += REQUIRED_WEIGHT;
  for (const f of optionalFields) { total += OPTIONAL_WEIGHT; if (isFilled(f)) earned += OPTIONAL_WEIGHT; }
  const pct = Math.round((earned / total) * 100);

  /* Report live pct to parent (e.g. for sidebar ring) */
  useEffect(() => { onPctChange?.(pct); }, [pct, onPctChange]);

  const color = pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-orange-500" : "bg-orange-400";
  const textColor = pct === 100 ? "text-emerald-600" : pct >= 60 ? "text-orange-600" : "text-slate-500";
  const message = pct === 100
    ? "Profile complete — you're all set!"
    : pct >= 75
    ? "Almost there — just a few fields left"
    : pct >= 50
    ? "Over halfway — looking good"
    : pct >= 25
    ? "Good start — keep filling in your details"
    : pct > 0
    ? "Let's get started — fill in your profile"
    : "Let's get started";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-600">{message}</span>
          <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
          <div className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ERROR SUMMARY PANEL — matching /contact format
   ═══════════════════════════════════════════════════ */
export function ErrorSummaryPanel({ errors, fieldLabels, onFieldClick, onDismiss }) {
  const errorEntries = Object.entries(errors).filter(([, msg]) => msg);
  if (errorEntries.length === 0) return null;

  return (
    <div id="form-errors-panel" role="alert" className="mt-4 rounded-xl overflow-hidden border border-red-200">
      {/* Header — red bar matching /contact */}
      <div className="bg-red-600 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-white shrink-0" />
          <p className="text-sm font-semibold text-white">
            Please fix {errorEntries.length} error{errorEntries.length !== 1 ? "s" : ""} below
          </p>
        </div>
        <button onClick={onDismiss} className="w-6 h-6 rounded-full hover:bg-red-500 flex items-center justify-center transition-colors" aria-label="Dismiss errors">
          <X size={12} className="text-white" />
        </button>
      </div>
      {/* Error list */}
      <div className="bg-red-50/80">
        {errorEntries.map(([field, message], i, arr) => (
          <button
            key={field}
            type="button"
            onClick={() => onFieldClick(field)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-100/80 transition-colors group ${
              i < arr.length - 1 ? "border-b border-red-100" : ""
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
              {i + 1}
            </span>
            <span className="text-sm">
              <span className="font-semibold text-red-800 underline underline-offset-2 decoration-red-300 group-hover:decoration-red-500">
                {fieldLabels[field] || field}
              </span>
              <span className="text-red-600/70 mx-1.5">&mdash;</span>
              <span className="text-red-600">{message}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CURRENCY SYMBOLS — lookup map
   ═══════════════════════════════════════════════════ */
export const CURRENCY_SYMBOLS = { GBP: "£", USD: "$", EUR: "€", CAD: "C$", AUD: "A$" };

/* ═══════════════════════════════════════════════════
   USE HEADER CURRENCY — syncs with header dropdown
   ═══════════════════════════════════════════════════ */
export function useHeaderCurrency() {
  const [headerCurrency, setHeaderCurrency] = useState(() => {
    if (typeof window === "undefined") return "GBP";
    try {
      const stored = localStorage.getItem("wup-header-currency");
      if (stored) return JSON.parse(stored).code || "GBP";
    } catch (_e) { /* ignore */ }
    return "GBP";
  });

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.code) setHeaderCurrency(e.detail.code);
    };
    window.addEventListener("wup-currency-change", handler);
    return () => window.removeEventListener("wup-currency-change", handler);
  }, []);

  return headerCurrency;
}

/* ═══════════════════════════════════════════════════
   CURRENCY AMOUNT INPUT — currency dropdown + amount
   ═══════════════════════════════════════════════════ */
export function CurrencyAmountInput({ currency, onCurrencyChange, amount, onAmountChange, value, onChange, onBlur, label, required, error, id, help, onFocusField, onFocus }) {
  const dd = useDropdown();
  const [focused, setFocused] = useState(false);
  // Support both amount/onAmountChange (legacy) and value/onChange (new) prop names
  const resolvedAmount = amount !== undefined ? amount : value;
  const resolvedOnChange = onAmountChange || onChange;
  const hasValue = resolvedAmount !== undefined && resolvedAmount !== null && String(resolvedAmount).trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 ${stateStyle} ${bgColor}`}>
        <div className="flex items-center">
          {/* Currency selector */}
          <div ref={dd.ref} className="relative shrink-0">
            <button
              type="button"
              onClick={() => dd.setOpen(!dd.open)}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-3.5 text-xs font-semibold text-slate-600 bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all rounded-l-lg border-r border-slate-200/80 cursor-pointer outline-none shadow-[0px_2px_4px_rgba(0,0,0,0.08)]"
              aria-label={`Currency: ${currency}`}
              aria-haspopup="listbox"
              aria-expanded={dd.open}
            >
              <span>{CURRENCY_SYMBOLS[currency] || ""} {currency}</span>
              <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
            </button>
            {dd.open && (
              <div className="absolute left-0 top-full -mt-px bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 min-w-[140px] overflow-hidden" role="listbox" aria-label="Select currency">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    role="option"
                    aria-selected={currency === c.value}
                    onClick={() => { onCurrencyChange(c.value); dd.setOpen(false); }}
                    className={`w-full flex items-center gap-2 text-left px-3 py-2.5 text-xs transition-colors ${
                      currency === c.value
                        ? "bg-orange-50 text-orange-700 font-semibold"
                        : "text-slate-600 hover:bg-orange-50"
                    }`}
                  >
                    <span className="text-slate-400 w-4 text-center font-medium">{CURRENCY_SYMBOLS[c.value] || ""}</span>
                    <span className="flex-1">{c.label || c.value}</span>
                    {currency === c.value && <Check size={12} className="text-orange-500 shrink-0" strokeWidth={2.5} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Amount input */}
          <div className="relative flex-1 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] rounded-r-lg">
            <label
              htmlFor={id}
              className={`absolute left-3.5 transition-all duration-200 pointer-events-none z-10 ${
                floated
                  ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
                  : "top-1/2 -translate-y-1/2 text-sm"
              } ${
                error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            <input
              id={id}
              type="text"
              inputMode="decimal"
              value={resolvedAmount}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\d.]/g, "");
                if (resolvedOnChange) resolvedOnChange(cleaned);
              }}
              onFocus={() => { setFocused(true); if (onFocusField) onFocusField(id); if (onFocus) onFocus(); }}
              onBlur={() => { setFocused(false); if (onFocusField) onFocusField(null); if (onBlur) onBlur(); }}
              placeholder={focused ? "0.00" : ""}
              className="w-full py-3.5 pr-3.5 pl-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-r-lg"
              required={required || undefined}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={errorId}
            />
          </div>
        </div>
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
      {help && !error && <p className="text-xs text-slate-400 mt-1 ml-1">{help}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORY TREE — imported from canonical source
   See src/lib/categories.js for the single source of truth.
   CategorySelector now uses CATEGORY_TREE directly (canonical IDs).
   PRODUCT_CATEGORY_TREE is re-exported for backward compatibility
   with other components that still import it via form-fields.
   ═══════════════════════════════════════════════════ */
import { CATEGORY_TREE, PRODUCT_CATEGORY_TREE } from "@/lib/categories";
export { PRODUCT_CATEGORY_TREE };

/* ═══════════════════════════════════════════════════
   CATEGORY SELECTOR — two-column hierarchical picker
   ═══════════════════════════════════════════════════ */
export function CategorySelector({ selected = [], onChange, required, error, id, label = "Product Categories", onFocusField, onBlur, maxSelections = 3 }) {
  const dd = useDropdown();
  const containerRef = useRef(null);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const wasFocusedRef = useRef(false);
  const [hoveredCat, setHoveredCat] = useState(null);

  useEffect(() => {
    if (!dd.open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        dd.setOpen(false);
        setFocused(false);
        if (onBlur) onBlur();
      }
    };
    document.addEventListener("mousedown", handler, true);
    return () => document.removeEventListener("mousedown", handler, true);
  }, [dd.open]);
  const hasValue = selected.length > 0;
  const atLimit = selected.length >= maxSelections;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  // Build canonical slug from CATEGORY_TREE IDs (e.g. "clothing-fashion/mens-clothing").
  // This matches the id format used sitewide in URLs, filters, breadcrumbs, and API routes.
  const subKey = (catId, subId) => `${catId}/${subId}`;

  const isCatPartial = (cat) => {
    const count = cat.subs.filter((s) => selected.includes(subKey(cat.id, s.id))).length;
    return count > 0;
  };
  const isSubSelected = (catId, subId) => selected.includes(subKey(catId, subId));

  const toggleSub = (catId, subId) => {
    const key = subKey(catId, subId);
    if (selected.includes(key)) {
      onChange(selected.filter((v) => v !== key));
    } else if (!atLimit) {
      onChange([...selected, key]);
    }
  };

  const remove = (val) => onChange(selected.filter((v) => v !== val));

  const labelFor = (val) => {
    for (const cat of CATEGORY_TREE) {
      for (const sub of cat.subs) {
        if (subKey(cat.id, sub.id) === val) return sub.label;
      }
    }
    return val;
  };

  const searchLower = search.toLowerCase();
  const filteredTree = search
    ? CATEGORY_TREE.map((cat) => ({
        ...cat,
        filteredSubs: cat.subs.filter((s) => s.label.toLowerCase().includes(searchLower) || cat.name.toLowerCase().includes(searchLower)),
      })).filter((cat) => cat.filteredSubs.length > 0 || cat.name.toLowerCase().includes(searchLower))
    : CATEGORY_TREE;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div ref={containerRef}>
      <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div ref={dd.ref} className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <div
          className="min-h-[50px] px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text"
          onClick={(e) => { if (e.target.tagName === "INPUT") return; if (dd.open) { dd.setOpen(false); document.getElementById(id)?.blur(); } else { dd.setOpen(true); setFocused(true); document.getElementById(id)?.focus(); } }}
        >
          {selected.map((val) => (
            <span key={val} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 text-[13px] font-semibold bg-orange-500 text-white rounded-lg shadow-sm">
              {labelFor(val)}
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(val); }} className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors" aria-label={`Remove ${labelFor(val)}`}>
                <X size={9} strokeWidth={3} />
              </button>
            </span>
          ))}
          <input
            id={id}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); dd.setOpen(true); setHoveredCat(null); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); return; }
              if ((e.key === "Backspace" || e.key === "Delete") && search === "" && selected.length > 0) { e.preventDefault(); remove(selected[selected.length - 1]); }
            }}
            onFocus={() => { setFocused(true); dd.setOpen(true); wasFocusedRef.current = false; if (onFocusField) onFocusField(id); }}
            onBlur={() => { setFocused(false); wasFocusedRef.current = false; if (onFocusField) onFocusField(null); }}
            onClick={(e) => { if (wasFocusedRef.current) { e.stopPropagation(); dd.setOpen(!dd.open); } wasFocusedRef.current = true; }}
            placeholder={atLimit ? `${maxSelections} selected (max)` : selected.length === 0 ? "Search categories..." : "Add more..."}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none py-1"
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={dd.open}
          />
        </div>
        <div className="absolute right-3 top-5 pointer-events-none">
          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dd.open ? "rotate-180" : ""}`} />
        </div>

        {dd.open && (
          <div className="absolute left-0 right-0 top-full -mt-px bg-white rounded-xl shadow-xl border border-slate-200 z-50 flex overflow-hidden">
            <div className="w-1/2 max-h-[320px] overflow-y-auto thin-scrollbar py-1 border-r border-slate-100 shrink-0">
              {filteredTree.length > 0 ? filteredTree.map((cat, idx) => {
                const partial = isCatPartial(cat);
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between px-3 py-2 text-[15px] cursor-pointer transition-colors ${
                      hoveredCat === idx ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onMouseEnter={() => setHoveredCat(idx)}
                    onClick={() => setHoveredCat(idx)}
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      {partial && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />}
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <ChevronRight size={14} className={hoveredCat === idx ? "text-orange-400" : "text-slate-300"} />
                  </div>
                );
              }) : (
                <p className="px-3.5 py-3 text-sm text-slate-400 italic text-center">No categories found</p>
              )}
            </div>

            {hoveredCat !== null && filteredTree[hoveredCat] && (
              <div className="flex-1 min-w-0 max-h-[320px] overflow-y-auto thin-scrollbar py-2 px-1" role="listbox" aria-label="Subcategories">
                <div className="border-b border-dashed border-slate-200 pb-2 mb-2 px-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{filteredTree[hoveredCat].name}</p>
                </div>
                {(filteredTree[hoveredCat].filteredSubs || filteredTree[hoveredCat].subs).map((sub) => {
                  const checked = isSubSelected(filteredTree[hoveredCat].id, sub.id);
                  const disabled = !checked && atLimit;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      role="option"
                      aria-selected={checked}
                      aria-disabled={disabled}
                      disabled={disabled}
                      onClick={(e) => { e.stopPropagation(); toggleSub(filteredTree[hoveredCat].id, sub.id); }}
                      className={`w-full flex items-center gap-2.5 text-left px-3 py-2 text-[15px] rounded-lg transition-colors ${
                        disabled ? "opacity-40 cursor-not-allowed" : checked ? "bg-orange-50/50 text-orange-700 font-medium hover:bg-orange-50" : "text-slate-600 hover:bg-orange-50"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        checked ? "bg-orange-500 border-orange-500" : disabled ? "border-slate-200 bg-slate-50" : "border-slate-300"
                      }`}>
                        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mt-1">
        {error ? <p id={errorId} className="text-xs text-red-600 ml-0.5" role="alert">{error}</p> : <span />}
        <span className="flex items-center gap-2 text-[10px] text-slate-400">
          {selected.length}/{maxSelections} selected
          {selected.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="text-red-400 hover:text-red-600 font-semibold transition-colors">
              Clear all
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BRAND PILL INPUT — free-text pills (comma/enter)
   ═══════════════════════════════════════════════════ */
export function BrandPillInput({ selected = [], onChange, label = "Brands You're Interested In", id, error, maxItems = 50, placeholder, itemLabel }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const hasValue = selected.length > 0;
  const floated = focused || hasValue || text.length > 0;
  const errorId = id && error ? `${id}-error` : undefined;

  const addBrand = (raw) => {
    const brand = raw.trim();
    if (!brand) return;
    const formatted = brand.replace(/\b\w/g, (c) => c.toUpperCase());
    if (selected.length >= maxItems) return;
    if (selected.some((b) => b.toLowerCase() === formatted.toLowerCase())) return;
    onChange([...selected, formatted]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addBrand(text);
      setText("");
    }
    if (e.key === "Backspace" && text === "" && selected.length > 0) {
      onChange(selected.slice(0, -1));
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",");
      parts.slice(0, -1).forEach((p) => addBrand(p));
      setText(parts[parts.length - 1]);
    } else {
      setText(val);
    }
  };

  const remove = (brand) => onChange(selected.filter((b) => b !== brand));

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${stateStyle} ${bgColor}`}>
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none z-10 ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {label}
        </label>
        <div className="min-h-[50px] px-3 py-2 flex flex-wrap gap-1.5 items-center cursor-text" onClick={() => document.getElementById(id)?.focus()}>
          {selected.map((brand) => (
            <span key={brand} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 text-[13px] font-semibold bg-orange-500 text-white rounded-lg shadow-sm">
              {brand}
              <button type="button" onClick={(e) => { e.stopPropagation(); remove(brand); }} className="w-5 h-5 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors" aria-label={`Remove ${brand}`}>
                <X size={9} strokeWidth={3} />
              </button>
            </span>
          ))}
          <input
            id={id}
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => { setFocused(false); if (text.trim()) { addBrand(text); setText(""); } }}
            placeholder={selected.length === 0 && !focused ? "" : selected.length === 0 ? (placeholder || "Type a value, then comma or Enter...") : "Add more..."}
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none py-1"
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
          ) : hasValue ? (
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        {error ? <p id={errorId} className="text-xs text-red-600 ml-0.5" role="alert">{error}</p> : <span />}
        <span className="text-[10px] text-slate-400">{selected.length}/{maxItems} {itemLabel || "items"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   IMAGE UPLOAD PLACEHOLDER — avatar/logo upload
   ═══════════════════════════════════════════════════ */
export function ImageUploadPlaceholder({ label = "Company Logo" }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (file) => {
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) { alert("File too large. Maximum size is 5 MB."); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { alert("Unsupported format. Please use JPG, PNG, or WebP."); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
  };

  const handleChange = (e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); };
  const handleDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); };
  const remove = () => { if (preview) URL.revokeObjectURL(preview); setPreview(null); setFileName(""); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div className="flex items-start gap-5">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 overflow-hidden transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
          preview ? "border-emerald-400 bg-emerald-50 hover:border-emerald-500" : "border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50"
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        aria-label={preview ? "Change logo image" : "Upload logo image"}
      >
        {preview ? (
          <img src={preview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Camera size={24} className="text-slate-300" />
        )}
      </button>
      <div className="space-y-2 pt-1">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleChange} className="hidden" aria-label={`Upload ${label}`} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2">
            <Upload size={13} />
            {preview ? "Change Image" : "Upload Image"}
          </button>
          {preview && (
            <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2">
              <X size={12} strokeWidth={2.5} />
              Remove
            </button>
          )}
        </div>
        {fileName ? (
          <p className="text-[10px] text-emerald-600 font-medium">{fileName}</p>
        ) : (
          <p className="text-[10px] text-slate-500">Supported: JPG, PNG, WebP. Max 5 MB</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUSINESS HOURS GRID — weekly schedule editor
   Toggle per day + open/close time selectors
   ═══════════════════════════════════════════════════ */
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday" };

const TIME_OPTIONS = (() => {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const hr = h % 12 || 12;
      const ampm = h < 12 ? "AM" : "PM";
      const label = `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
      opts.push({ value: val, label });
    }
  }
  return opts;
})();

/* Status: "unset" = not specified, "open" = open with times, "closed" = explicitly closed */
export const DEFAULT_BUSINESS_HOURS = {
  monday:    { status: "unset", slots: [{ open: "09:00", close: "17:00" }] },
  tuesday:   { status: "unset", slots: [{ open: "09:00", close: "17:00" }] },
  wednesday: { status: "unset", slots: [{ open: "09:00", close: "17:00" }] },
  thursday:  { status: "unset", slots: [{ open: "09:00", close: "17:00" }] },
  friday:    { status: "unset", slots: [{ open: "09:00", close: "17:00" }] },
  saturday:  { status: "unset", slots: [{ open: "09:00", close: "13:00" }] },
  sunday:    { status: "unset", slots: [{ open: "", close: "" }] },
  holidays:  "",
};

/* Migrate legacy formats → current { status, slots } model */
function migrateHours(h) {
  if (!h) return DEFAULT_BUSINESS_HOURS;
  const out = { ...h };
  for (const d of DAYS) {
    if (!out[d]) continue;
    /* v1: { open, close } single-slot → { slots: [...] } */
    if (!out[d].slots) {
      out[d] = { status: out[d].active ? "open" : "closed", slots: [{ open: out[d].open || "", close: out[d].close || "" }] };
    }
    /* v2: { active: bool, slots } → { status: string, slots } */
    else if (out[d].status === undefined) {
      out[d] = { status: out[d].active ? "open" : "closed", slots: out[d].slots };
    }
  }
  if (out.holidays === undefined) out.holidays = "";
  return out;
}

const STATUS_OPTIONS = [
  { value: "unset", label: "—" },
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
];

export function BusinessHoursGrid({ hours: rawHours = DEFAULT_BUSINESS_HOURS, onChange, required, error, id }) {
  const hours = useMemo(() => migrateHours(rawHours), [rawHours]);
  const errorId = id && error ? `${id}-error` : undefined;
  const openDays = DAYS.filter((d) => hours[d]?.status === "open");
  const specifiedDays = DAYS.filter((d) => hours[d]?.status === "open" || hours[d]?.status === "closed");
  const hasValue = openDays.length > 0;

  /* Track which day was most recently edited so copy buttons use it as source */
  const lastEditedRef = useRef(null);

  const updateDay = (day, patch) => {
    lastEditedRef.current = day;
    onChange({ ...hours, [day]: { ...hours[day], ...patch } });
  };

  const setStatus = (day, status) => {
    lastEditedRef.current = day;
    const d = hours[day] || { slots: [{ open: "", close: "" }] };
    /* When switching to open, ensure at least one slot exists */
    const slots = d.slots?.length ? d.slots : [{ open: "09:00", close: "17:00" }];
    onChange({ ...hours, [day]: { ...d, status, slots } });
  };

  const updateSlot = (day, slotIdx, field, value) => {
    const slots = [...(hours[day]?.slots || [])];
    slots[slotIdx] = { ...slots[slotIdx], [field]: value };
    updateDay(day, { slots });
  };

  const addSlot = (day) => {
    const slots = [...(hours[day]?.slots || []), { open: "", close: "" }];
    updateDay(day, { slots });
  };

  const removeSlot = (day, slotIdx) => {
    const slots = (hours[day]?.slots || []).filter((_, i) => i !== slotIdx);
    updateDay(day, { slots: slots.length > 0 ? slots : [{ open: "", close: "" }] });
  };

  /* Resolve copy source: last edited day if open, else first open day */
  const getCopySource = () => {
    const last = lastEditedRef.current;
    if (last && hours[last]?.status === "open") return last;
    return DAYS.find((d) => hours[d]?.status === "open") || null;
  };

  /* Copy source day's config to all weekdays */
  const copyToWeekdays = () => {
    const src = getCopySource();
    if (!src) return;
    const { slots } = hours[src];
    const updated = { ...hours };
    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach((d) => {
      updated[d] = { status: "open", slots: slots.map((s) => ({ ...s })) };
    });
    onChange(updated);
  };

  /* Copy source day's config to weekends */
  const copyToWeekends = () => {
    const src = getCopySource();
    if (!src) return;
    const { slots } = hours[src];
    const updated = { ...hours };
    ["saturday", "sunday"].forEach((d) => {
      updated[d] = { status: "open", slots: slots.map((s) => ({ ...s })) };
    });
    onChange(updated);
  };

  /* Set all unset days to closed */
  const markRestClosed = () => {
    const updated = { ...hours };
    DAYS.forEach((d) => {
      if (updated[d]?.status === "unset") updated[d] = { ...updated[d], status: "closed" };
    });
    onChange(updated);
  };

  const stateStyle = error
    ? "border-red-300"
    : hasValue
    ? "border-emerald-400"
    : "border-slate-200";

  const unsetCount = DAYS.filter((d) => hours[d]?.status === "unset" || !hours[d]?.status).length;

  return (
    <div id={id} className="space-y-2">
      <div className={`rounded-xl border ${stateStyle} overflow-hidden transition-colors`}>
        {DAYS.map((day, idx) => {
          const d = hours[day] || { status: "unset", slots: [{ open: "", close: "" }] };
          const status = d.status || "unset";
          const slots = d.slots || [{ open: "", close: "" }];
          const isOpen = status === "open";
          const isClosed = status === "closed";
          return (
            <div
              key={day}
              className={`px-3 py-2 transition-colors ${
                idx < DAYS.length - 1 ? "border-b border-slate-100" : ""
              } ${isOpen ? "bg-white" : "bg-slate-50/60"}`}
              style={{ borderLeft: `3px solid ${isOpen ? "#fb923c" : isClosed ? "#94a3b8" : "transparent"}` }}
            >
              {/* Main row: day name + status select + time slots */}
              <div className="flex items-start gap-2">
                {/* Day name */}
                <span className={`w-[72px] pt-1.5 text-[13px] font-medium shrink-0 ${isOpen ? "text-slate-800" : "text-slate-400"}`}>
                  {DAY_LABELS[day]}
                </span>

                {/* Status selector */}
                <select
                  value={status}
                  onChange={(e) => setStatus(day, e.target.value)}
                  className={`shrink-0 w-[120px] px-2 py-1.5 text-xs border rounded-lg outline-none cursor-pointer transition-colors ${
                    isOpen
                      ? "border-orange-300 bg-orange-50 text-orange-700 font-medium hover:bg-orange-100"
                      : isClosed
                      ? "border-slate-300 bg-slate-100 text-slate-500 hover:border-slate-400"
                      : "border-slate-200 bg-white text-slate-400 hover:border-orange-300 hover:text-slate-500"
                  } focus:border-orange-400`}
                  aria-label={`${DAY_LABELS[day]} status`}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                {/* Time slots (only when open) */}
                {isOpen && (
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    {slots.map((slot, si) => (
                      <div key={si} className="flex items-center gap-1.5">
                        <select
                          value={slot.open}
                          onChange={(e) => updateSlot(day, si, "open", e.target.value)}
                          className={`flex-1 min-w-0 px-2 py-1.5 text-xs border rounded-lg bg-white outline-none focus:border-orange-300 cursor-pointer ${
                            slot.open && slot.close && slot.open >= slot.close ? "border-red-300 text-red-600" : "border-slate-200 text-slate-700"
                          }`}
                          aria-label={`${DAY_LABELS[day]} slot ${si + 1} opening time`}
                        >
                          <option value="">From</option>
                          {TIME_OPTIONS.filter((t) => !slot.close || t.value < slot.close).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <span className="text-[10px] text-slate-400 shrink-0">–</span>
                        <select
                          value={slot.close}
                          onChange={(e) => updateSlot(day, si, "close", e.target.value)}
                          className={`flex-1 min-w-0 px-2 py-1.5 text-xs border rounded-lg bg-white outline-none focus:border-orange-300 cursor-pointer ${
                            slot.open && slot.close && slot.close <= slot.open ? "border-red-300 text-red-600" : "border-slate-200 text-slate-700"
                          }`}
                          aria-label={`${DAY_LABELS[day]} slot ${si + 1} closing time`}
                        >
                          <option value="">To</option>
                          {TIME_OPTIONS.filter((t) => !slot.open || t.value > slot.open).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        {/* X remove — visible when multiple slots, invisible placeholder when single */}
                        <button
                          type="button"
                          onClick={() => removeSlot(day, si)}
                          className={`relative p-0.5 rounded transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-orange-400 before:absolute before:-inset-3 before:content-[''] ${slots.length > 1 ? "text-slate-400 hover:text-red-500" : "invisible"}`}
                          aria-label={`Remove ${DAY_LABELS[day]} time slot ${si + 1}`}
                          tabIndex={slots.length > 1 ? 0 : -1}
                        >
                          <X size={12} />
                        </button>
                        {/* + Split — visible on last slot when under limit, invisible placeholder otherwise */}
                        <button
                          type="button"
                          onClick={() => addSlot(day)}
                          className={`text-[10px] font-semibold whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:rounded ${si === slots.length - 1 && slots.length < 3 ? "text-orange-500 hover:text-orange-600" : "invisible pointer-events-none"}`}
                          aria-label={`Add another time slot for ${DAY_LABELS[day]}`}
                          tabIndex={si === slots.length - 1 && slots.length < 3 ? 0 : -1}
                        >
                          + Split
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick-action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasValue && (() => {
          const src = getCopySource();
          const srcLabel = src ? DAY_LABELS[src] : "";
          return (
            <>
              <button type="button" onClick={copyToWeekdays} className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:rounded px-1 -mx-1" title={src ? `Copy ${srcLabel}'s hours to Mon–Fri` : ""}>
                Copy to weekdays
              </button>
              <span className="text-slate-300">|</span>
              <button type="button" onClick={copyToWeekends} className="text-[10px] font-semibold text-orange-600 hover:text-orange-700 transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:rounded px-1 -mx-1" title={src ? `Copy ${srcLabel}'s hours to Sat–Sun` : ""}>
                Copy to weekends
              </button>
            </>
          );
        })()}
        {specifiedDays.length > 0 && unsetCount > 0 && (
          <>
            {hasValue && <span className="text-slate-300">|</span>}
            <button type="button" onClick={markRestClosed} className="text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:rounded px-1 -mx-1">
              Mark rest as closed
            </button>
          </>
        )}
      </div>

      {/* Holidays & Annual Closures — floating-label textarea */}
      <div>
        <div className="relative rounded-lg border border-slate-200 bg-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08)] transition-all focus-within:border-orange-400 focus-within:outline focus-within:outline-2 focus-within:outline-orange-100">
          <textarea
            id={id ? `${id}-holidays` : undefined}
            value={hours.holidays || ""}
            onChange={(e) => { if (e.target.value.length <= 500) onChange({ ...hours, holidays: e.target.value }); }}
            rows={2}
            className="peer w-full px-3.5 pt-5 pb-2 text-sm text-slate-800 bg-transparent outline-none rounded-lg resize-none placeholder-transparent focus:placeholder-slate-300"
            placeholder="e.g. Closed 24 Dec–1 Jan, UK bank holidays, Easter Monday"
            aria-label="Holidays & Annual Closures"
          />
          <label
            htmlFor={id ? `${id}-holidays` : undefined}
            className="pointer-events-none absolute left-3.5 top-1.5 text-[10px] font-medium text-orange-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-400 peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-medium peer-focus:text-orange-500"
          >
            Holidays & Annual Closures
          </label>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-[10px] text-slate-500 ml-1">e.g. Closed 24 Dec–1 Jan, UK bank holidays</p>
          <p className="text-[10px] text-slate-500">{(hours.holidays || "").length}/500</p>
        </div>
      </div>

      {error && <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FLOATING DATE PICKER — Custom calendar dropdown
   matching FloatingSelect panel style
   ═══════════════════════════════════════════════════ */
export function FloatingDatePicker({ label, required, value, onChange, error, id, className = "", disabled = false, minDate, maxDate, onFocus }) {
  const [open, setOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const hasValue = !!value;
  const errorId = id && error ? `${id}-error` : undefined;

  // Display text tracks the input; syncs from value when not focused
  const formatDisplay = (val) => { if (!val) return ""; const [y, m, d] = val.split("-"); return `${d}/${m}/${y}`; };
  const [displayText, setDisplayText] = useState(formatDisplay(value));

  // Parse current value (YYYY-MM-DD string) or default to today for calendar view
  const today = new Date();
  const selectedDate = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());

  // Close on outside click / escape
  useEffect(() => {
    const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setOpen(false); setInputFocused(false); } };
    const keyHandler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", keyHandler); };
  }, []);

  // When value changes externally (e.g. calendar pick), sync display + view month
  useEffect(() => {
    if (!inputFocused) setDisplayText(formatDisplay(value));
    if (selectedDate) { setViewYear(selectedDate.getFullYear()); setViewMonth(selectedDate.getMonth()); }
  }, [value]);

  // Parse DD/MM/YYYY or D/M/YYYY text into YYYY-MM-DD, returns null if invalid
  const parseInput = (text) => {
    const cleaned = text.replace(/[^0-9/]/g, "");
    const parts = cleaned.split("/");
    if (parts.length !== 3) return null;
    const [d, m, y] = parts.map(Number);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2100) return null;
    const testDate = new Date(y, m - 1, d);
    if (testDate.getDate() !== d || testDate.getMonth() !== m - 1 || testDate.getFullYear() !== y) return null;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setDisplayText(raw);
    const parsed = parseInput(raw);
    if (parsed) onChange(parsed);
    else if (raw === "") onChange("");
  };

  const handleInputBlur = () => {
    setInputFocused(false);
    // Snap display to the current stored value (fixes partial/invalid input)
    setDisplayText(formatDisplay(value));
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    if (onFocus) onFocus();
  };

  const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = startDow - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, current: false, date: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, current: true, date: dateStr });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false, date: null });

  const isSelected = (dateStr) => dateStr === value;
  const isToday = (dateStr) => dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonthNav = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const nextMonthNav = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  const selectDate = (dateStr) => {
    if (!dateStr) return;
    onChange(dateStr);
    setDisplayText(formatDisplay(dateStr));
    setOpen(false);
  };

  const isActive = open || inputFocused;

  // Styling — match FloatingSelect exactly
  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : isActive
    ? "border-orange-400"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50" : isActive ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  const openBorderColor = "#fb923c";
  const openWrapStyle = open
    ? { borderWidth: "1px 1px 0 1px", borderStyle: "solid", borderColor: openBorderColor, borderRadius: "12px 12px 0 0", boxShadow: "none", outline: "none" }
    : { borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0,0,0,0.08)" };
  const openPanelStyle = { top: "100%", borderWidth: "0 1px 1px 1px", borderStyle: "solid", borderColor: openBorderColor, borderRadius: "0 0 12px 12px" };

  return (
    <div ref={containerRef} className={`relative self-start ${className}`}>
      <div
        className={`relative w-full flex items-center transition-all duration-200 ${open ? "bg-white" : `hover:shadow-[0px_3px_6px_rgba(0,0,0,0.1)] ${bgColor}`} ${open ? "" : `border ${stateStyle}`} ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        style={openWrapStyle}
      >
        {/* Floating label */}
        <span className={`absolute left-3.5 transition-all duration-200 pointer-events-none z-10 ${
          hasValue || isActive ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded" : "top-3.5 text-sm"
        } ${error ? "text-red-600" : isActive ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-700 font-medium"}`}>
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </span>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={displayText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={isActive ? "DD/MM/YYYY" : ""}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className="flex-1 bg-transparent px-3.5 py-3.5 text-[15px] text-slate-800 outline-none placeholder:text-slate-300 disabled:cursor-not-allowed"
          autoComplete="off"
        />

        {/* Right icons: status + calendar toggle */}
        <span className="flex items-center gap-1.5 shrink-0 pr-3">
          {error ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : hasValue ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span> : null}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Open calendar"
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={() => { if (!disabled) setOpen(!open); }}
            className="p-0.5 rounded hover:bg-slate-100 transition-colors"
          >
            <Calendar size={14} className={`transition-colors ${open ? "text-orange-400" : "text-slate-400"}`} />
          </button>
        </span>
      </div>

      {open && (
        <div className="absolute left-0 right-0 bg-white shadow-xl z-50" style={openPanelStyle}>
          <div className="border-t border-slate-100" />
          <div className="p-3">
            {/* Month/Year header */}
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={prevMonthNav} className="p-1 rounded-md hover:bg-slate-100 transition-colors" aria-label="Previous month">
                <ChevronLeft size={16} className="text-slate-500" />
              </button>
              <span className="text-sm font-semibold text-slate-700">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button type="button" onClick={nextMonthNav} className="p-1 rounded-md hover:bg-slate-100 transition-colors" aria-label="Next month">
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7" role="grid" aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear}`}>
              {cells.map((cell, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={!cell.current}
                  onClick={() => selectDate(cell.date)}
                  onKeyDown={(e) => {
                    if (!cell.current) return;
                    const currentIdx = cells.findIndex(c => c.date === cell.date);
                    let targetIdx = -1;
                    if (e.key === "ArrowRight") targetIdx = currentIdx + 1;
                    else if (e.key === "ArrowLeft") targetIdx = currentIdx - 1;
                    else if (e.key === "ArrowDown") targetIdx = currentIdx + 7;
                    else if (e.key === "ArrowUp") targetIdx = currentIdx - 7;
                    else return;
                    e.preventDefault();
                    if (targetIdx >= 0 && targetIdx < cells.length && cells[targetIdx].current) {
                      const btns = e.currentTarget.parentElement.querySelectorAll("button:not(:disabled)");
                      const targetBtn = Array.from(btns).find(b => b.textContent === String(cells[targetIdx].day));
                      if (targetBtn) targetBtn.focus();
                    }
                  }}
                  aria-selected={isSelected(cell.date)}
                  className={`h-8 w-full text-[13px] rounded-md transition-colors ${
                    !cell.current
                      ? "text-slate-300 cursor-default"
                      : isSelected(cell.date)
                      ? "bg-orange-500 text-white font-semibold hover:bg-orange-600"
                      : isToday(cell.date)
                      ? "bg-orange-50 text-orange-600 font-medium hover:bg-orange-100"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cell.day}
                </button>
              ))}
            </div>

            {/* Clear button for optional fields */}
            {!required && hasValue && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { onChange(""); setDisplayText(""); setOpen(false); }}
                  className="w-full text-center text-[13px] text-slate-400 italic hover:text-slate-600 py-1 transition-colors"
                >
                  Clear date
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
    </div>
  );
}
