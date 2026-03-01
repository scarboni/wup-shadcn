"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  User,
  ShoppingBag,
  Store,
  Package,
  MessageSquare,
  Heart,
  Coins,
  Settings,
  Crown,
  Pencil,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  ChevronDown,
  Check,
  Search,
  Globe,
  Phone,
  Mail,
  Building2,
  MapPin,
  Languages,
  Bell,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  PlusCircle,
  Headphones,
  LayoutDashboard,
  Clock,
} from "lucide-react";

/* ─────────── Mock Users ─────────── */
const USERS = {
  female: { firstName: "Jennifer", lastName: "Lawrence", initials: "JL", tier: "STANDARD", expiresOn: "9 Jan 2025", pin: "2017", gender: "female" },
  male: { firstName: "Anand", lastName: "Kumar", initials: "AK", tier: "PREMIUM", expiresOn: "15 Mar 2026", pin: "3042", gender: "male" },
};

/* ─────────── Phone Codes ─────────── */
const PHONE_CODES = [
  { country: "United States", code: "+1", flag: "🇺🇸" },
  { country: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { country: "Canada", code: "+1", flag: "🇨🇦" },
  { country: "Australia", code: "+61", flag: "🇦🇺" },
  { country: "Germany", code: "+49", flag: "🇩🇪" },
  { country: "France", code: "+33", flag: "🇫🇷" },
  { country: "Italy", code: "+39", flag: "🇮🇹" },
  { country: "Spain", code: "+34", flag: "🇪🇸" },
  { country: "Netherlands", code: "+31", flag: "🇳🇱" },
  { country: "Belgium", code: "+32", flag: "🇧🇪" },
  { country: "Switzerland", code: "+41", flag: "🇨🇭" },
  { country: "Austria", code: "+43", flag: "🇦🇹" },
  { country: "Sweden", code: "+46", flag: "🇸🇪" },
  { country: "Norway", code: "+47", flag: "🇳🇴" },
  { country: "Denmark", code: "+45", flag: "🇩🇰" },
  { country: "Poland", code: "+48", flag: "🇵🇱" },
  { country: "Ireland", code: "+353", flag: "🇮🇪" },
  { country: "Portugal", code: "+351", flag: "🇵🇹" },
  { country: "Greece", code: "+30", flag: "🇬🇷" },
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese", "Korean", "Arabic"];

const COUNTRIES = [
  "United Kingdom", "United States", "Germany", "France", "Italy", "Spain",
  "Netherlands", "Belgium", "Canada", "Australia", "Poland", "Sweden",
  "Norway", "Denmark", "Ireland", "Portugal", "Greece", "Austria", "Switzerland",
];

/* ─────────── Dropdown Hook ─────────── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

/* ═══════════════════════════════════════════════════
   ACCOUNT SIDEBAR
   ═══════════════════════════════════════════════════ */
function AccountSidebar({ user, activePage = "account-profile" }) {
  const sections = [
    {
      title: "MANAGE ACCOUNT",
      items: [
        { id: "account-profile", icon: User, label: "Account Profile" },
        { id: "buyer-profile", icon: ShoppingBag, label: "Buyer Profile" },
        { id: "supplier-profile", icon: Store, label: "Supplier Profile" },
      ],
    },
    {
      title: "DEALS MENU",
      items: [
        { id: "manage-deals", icon: Package, label: "Manage Deals" },
        { id: "orders", icon: ShoppingBag, label: "Orders" },
        { id: "messages", icon: MessageSquare, label: "Messages", badge: 3 },
        { id: "favourites", icon: Heart, label: "My Favourites" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { id: "affiliate", icon: Coins, label: "Affiliate Earnings" },
        { id: "billing", icon: Settings, label: "Manage Services & Billing" },
      ],
    },
  ];

  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      {/* User Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
        <div className={`relative pt-5 pb-10 text-center ${
          user.gender === "male"
            ? "bg-gradient-to-br from-indigo-500 to-violet-600"
            : "bg-gradient-to-br from-sky-500 to-blue-600"
        }`}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "16px 16px"
          }} />
        </div>
        <div className="px-5 pb-4 -mt-8 relative">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center mx-auto">
            <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-lg ${
              user.gender === "male" ? "bg-indigo-500" : "bg-sky-500"
            }`}>
              {user.initials}
            </div>
          </div>
          <h3 className="text-center font-bold text-slate-900 mt-2">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center justify-center mt-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              user.tier === "PREMIUM"
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              <Crown size={10} />
              {user.tier}
            </span>
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center justify-between px-1">
              <span>Account Expires On</span>
              <span className="font-semibold text-slate-700">{user.expiresOn}</span>
            </div>
            <div className="flex items-center justify-between px-1">
              <span>PIN Number</span>
              <span className="font-semibold text-slate-700">{user.pin}</span>
            </div>
          </div>
          <a href="/pricing" className="block mt-3 w-full py-2.5 text-center text-xs font-bold text-sky-600 border border-sky-200 hover:bg-sky-50 rounded-lg transition-colors">
            Renew Account
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {sections.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div className="h-px bg-slate-100" />}
            <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left ${
                    isActive
                      ? "text-sky-600 bg-sky-50 font-semibold border-r-2 border-sky-500"
                      : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-sky-500" : "text-slate-400"} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   UPGRADE BANNER — top of dashboard content
   ═══════════════════════════════════════════════════ */
function UpgradeBanner({ user }) {
  if (user.tier === "PREMIUM") return null;

  return (
    <div className="relative bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 rounded-xl overflow-hidden shadow-lg mb-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white rounded-full translate-y-1/2" />
      </div>
      <div className="relative flex items-center justify-between px-6 py-5 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">49,100</p>
            <p className="text-sky-100 text-sm">Wholesalers, Liquidators, & Dropshippers</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-sky-200 mb-1.5">Not yet Subscribed?</p>
          <a href="/pricing" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-sky-600 font-bold text-sm rounded-lg hover:bg-sky-50 transition-colors shadow-sm">
            Upgrade Now!
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VALIDATION ERROR BANNER
   ═══════════════════════════════════════════════════ */
function ValidationErrorBanner({ errors, onDismiss }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle size={16} className="text-red-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-800">Profile can't be updated</h3>
            <button onClick={onDismiss} className="w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center transition-colors">
              <X size={14} className="text-red-400" />
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-600 flex items-start gap-1.5">
                <span className="font-semibold text-red-700">{err.field}:</span>
                <span>{err.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM INPUT COMPONENT
   ═══════════════════════════════════════════════════ */
function FormInput({ label, required, error, type = "text", placeholder, value, onChange, disabled, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        disabled={disabled}
        className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-all outline-none ${
          error
            ? "border-red-300 bg-red-50 text-red-800 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM SELECT COMPONENT
   ═══════════════════════════════════════════════════ */
function FormSelect({ label, required, options, value, onChange, error, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-3.5 py-2.5 text-sm rounded-lg border appearance-none cursor-pointer transition-all outline-none pr-9 ${
            error
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          }`}
        >
          {options.map((opt) => (
            <option key={typeof opt === "string" ? opt : opt.value} value={typeof opt === "string" ? opt : opt.value}>
              {typeof opt === "string" ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PHONE INPUT WITH CODE SELECTOR
   ═══════════════════════════════════════════════════ */
function PhoneInput({ label, required, phoneCode, setPhoneCode, value, onChange, error }) {
  const dd = useDropdown();
  const [search, setSearch] = useState("");
  const filtered = PHONE_CODES.filter((c) =>
    c.country.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex gap-1.5">
        {/* Code Selector */}
        <div ref={dd.ref} className="relative">
          <button
            onClick={() => dd.setOpen(!dd.open)}
            className="flex items-center gap-1 px-2.5 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 hover:bg-white transition-colors min-w-[80px]"
          >
            <span className="text-sm">{phoneCode.flag}</span>
            <span className="text-slate-700 font-medium">{phoneCode.code}</span>
            <ChevronDown size={10} className="text-slate-400 ml-auto" />
          </button>
          {dd.open && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-30 overflow-hidden">
              <div className="p-2 border-b border-slate-100">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:border-sky-300 outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={`${c.country}-${c.code}`}
                    onClick={() => { setPhoneCode(c); dd.setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-sky-50 transition-colors ${
                      phoneCode.code === c.code && phoneCode.country === c.country ? "bg-sky-50 text-sky-700" : "text-slate-600"
                    }`}
                  >
                    <span className="text-sm">{c.flag}</span>
                    <span className="flex-1">{c.country}</span>
                    <span className="text-slate-400 font-mono">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Number Input */}
        <input
          type="tel"
          value={value}
          onChange={onChange}
          placeholder="Enter number"
          className={`flex-1 px-3.5 py-2.5 text-sm rounded-lg border transition-all outline-none ${
            error
              ? "border-red-300 bg-red-50"
              : "border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          }`}
        />
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LANGUAGE SELECTOR (Multi-select tags)
   ═══════════════════════════════════════════════════ */
function LanguageSelector({ selected, setSelected }) {
  const dd = useDropdown();
  const [search, setSearch] = useState("");
  const filtered = LANGUAGES.filter(
    (l) => l.toLowerCase().includes(search.toLowerCase()) && !selected.includes(l)
  );

  const remove = (lang) => setSelected(selected.filter((l) => l !== lang));
  const add = (lang) => { setSelected([...selected, lang]); setSearch(""); };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        Languages Spoken <span className="text-red-400">*</span>
      </label>
      <div ref={dd.ref} className="relative">
        <div
          className="min-h-[42px] px-2.5 py-1.5 border border-slate-200 rounded-lg bg-slate-50 focus-within:bg-white focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all cursor-text flex flex-wrap gap-1.5"
          onClick={() => dd.setOpen(true)}
        >
          {selected.map((lang) => (
            <span key={lang} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 rounded-md">
              {lang}
              <button onClick={(e) => { e.stopPropagation(); remove(lang); }} className="hover:text-sky-900">
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); dd.setOpen(true); }}
            placeholder={selected.length === 0 ? "Select languages" : ""}
            className="flex-1 min-w-[80px] bg-transparent text-sm outline-none py-0.5"
            onFocus={() => dd.setOpen(true)}
          />
        </div>
        {dd.open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 max-h-44 overflow-y-auto">
            {filtered.map((lang) => (
              <button
                key={lang}
                onClick={() => add(lang)}
                className="w-full text-left px-3.5 py-2 text-sm text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition-colors"
              >
                {lang}
              </button>
            ))}
          </div>
        )}
        {dd.open && filtered.length === 0 && search && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-30 p-3 text-center">
            <p className="text-xs text-slate-400">No language found</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FORM SECTION WRAPPER
   ═══════════════════════════════════════════════════ */
function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="pt-6 first:pt-0">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
        {Icon && <Icon size={16} className="text-sky-500" />}
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACCOUNT PROFILE FORM — the main form
   ═══════════════════════════════════════════════════ */
function AccountProfileForm({ showErrors }) {
  const [form, setForm] = useState({
    username: "jennifer.l2023",
    password: "••••••••••",
    firstName: showErrors ? "" : "Jennifer",
    lastName: showErrors ? "" : "Lawrence",
    salutation: "Mrs.",
    companyName: showErrors ? "" : "JL Trading Ltd",
    regNumber: "12345678",
    taxId: "GB123456789",
    roleInCompany: "Director",
    addressLine1: "14 Commerce Street",
    addressLine2: "Suite 200",
    city: "London",
    postcode: "EC2A 4BX",
    country: "United Kingdom",
    telephone: "7911123456",
    phoneNumber: "2071234567",
    businessEmail: showErrors ? "" : "jennifer@jltrading.co.uk",
    personalEmail: "jen.lawrence@gmail.com",
    skypeId: "jennifer.l.trade",
    mobile: showErrors ? "" : "7911123456",
    newsletter: true,
  });

  const [phoneCode1, setPhoneCode1] = useState(PHONE_CODES[1]);
  const [phoneCode2, setPhoneCode2] = useState(PHONE_CODES[1]);
  const [languages, setLanguages] = useState(["English", "French"]);
  const [showPassword, setShowPassword] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const errors = showErrors
    ? [
        { field: "First Name", message: "First Name is required" },
        { field: "Last Name", message: "Last Name is required" },
        { field: "Work Email Address", message: "Work Email Address is required" },
        { field: "Mobile Number", message: "Mobile is required" },
        { field: "Company or Trading Name", message: "Company or Trading Name is required" },
      ]
    : [];

  const fieldError = (field) => showErrors && !form[field] ? `${field} is required` : "";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-0">
      {/* Error Banner */}
      <ValidationErrorBanner errors={errors} onDismiss={() => {}} />

      {/* Page Title */}
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-slate-900">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Keep your Wholesale Deals account contact details current to ensure suppliers
          receive accurate information with your inquiries. Updated details also help us
          provide you with the best possible support.
        </p>
        <p className="text-sm text-slate-500 mt-1">
          For any questions or assistance, please{" "}
          <a href="#" className="text-sky-500 hover:text-sky-600 font-semibold">
            contact our dedicated support team.
          </a>
        </p>
      </div>

      {/* ─── Credentials ─── */}
      <FormSection title="Login Credentials" icon={Lock}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                className="w-full px-3.5 py-2.5 pr-20 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-sky-600 hover:bg-sky-50 rounded-md transition-colors">
                <Pencil size={10} />
                Change Username
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full px-3.5 py-2.5 pr-32 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button onClick={() => setShowPassword(!showPassword)} className="p-1 hover:bg-slate-100 rounded transition-colors">
                  {showPassword ? <EyeOff size={13} className="text-slate-400" /> : <Eye size={13} className="text-slate-400" />}
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-sky-600 hover:bg-sky-50 rounded-md transition-colors">
                  <Pencil size={10} />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* ─── Personal Details ─── */}
      <FormSection title="Personal Details" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="First Name" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} error={fieldError("firstName")} />
          <FormInput label="Last Name" required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} error={fieldError("lastName")} />
          <FormSelect label="Salutation" required options={["Mr.", "Mrs.", "Ms.", "Dr."]} value={form.salutation} onChange={(e) => update("salutation", e.target.value)} />
        </div>
      </FormSection>

      {/* ─── Company Information ─── */}
      <FormSection title="Company Information" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Company or trading name" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} error={fieldError("companyName")} />
          <FormInput label="Reg. number" required value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} />
          <FormInput label="Tax ID/VAT" required value={form.taxId} onChange={(e) => update("taxId", e.target.value)} />
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Role in Company <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.roleInCompany}
              onChange={(e) => { if (e.target.value.length <= 2000) { update("roleInCompany", e.target.value); setCharCount(e.target.value.length); } }}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-none"
            />
            <p className="text-[10px] text-slate-400 text-right mt-0.5">{charCount}/2000 char.</p>
          </div>
        </div>
      </FormSection>

      {/* ─── Address ─── */}
      <FormSection title="Address" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Address line 1" required value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} />
          <FormInput label="Address line 2" value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} />
          <FormInput label="City" required value={form.city} onChange={(e) => update("city", e.target.value)} />
          <FormInput label="Postcode/ZIP" required value={form.postcode} onChange={(e) => update("postcode", e.target.value)} />
          <FormSelect label="Country/State" required options={COUNTRIES} value={form.country} onChange={(e) => update("country", e.target.value)} className="md:col-span-2" />
        </div>
      </FormSection>

      {/* ─── Communication ─── */}
      <FormSection title="Communication" icon={Languages}>
        <div className="space-y-4">
          <LanguageSelector selected={languages} setSelected={setLanguages} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PhoneInput label="Telephone Number" required phoneCode={phoneCode1} setPhoneCode={setPhoneCode1} value={form.telephone} onChange={(e) => update("telephone", e.target.value)} />
            <PhoneInput label="Phone Number" required phoneCode={phoneCode2} setPhoneCode={setPhoneCode2} value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
            <FormInput label="Business email" required value={form.businessEmail} onChange={(e) => update("businessEmail", e.target.value)} error={fieldError("businessEmail")} />
            <FormInput label="Personal email" required value={form.personalEmail} onChange={(e) => update("personalEmail", e.target.value)} />
            <FormInput label="Skype ID" required value={form.skypeId} onChange={(e) => update("skypeId", e.target.value)} />
          </div>

          {/* Newsletter Toggle */}
          <label className="flex items-center gap-3 cursor-pointer pt-2">
            <div
              className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${form.newsletter ? "bg-sky-500" : "bg-slate-200"}`}
              onClick={() => update("newsletter", !form.newsletter)}
              style={{ height: "22px" }}
            >
              <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${form.newsletter ? "translate-x-5" : "translate-x-0.5"}`} style={{ width: "18px", height: "18px" }} />
            </div>
            <span className="text-sm text-slate-600">Subscribe to Newsletter</span>
          </label>
        </div>
      </FormSection>

      {/* Submit Button */}
      <div className="pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
        >
          {saved ? <Check size={16} /> : <Shield size={16} />}
          {saved ? "Saved!" : "Update Contact Details"}
        </button>
        {saved && (
          <span className="text-xs text-emerald-600 font-semibold animate-in fade-in duration-300">
            Profile updated successfully
          </span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 5 Full Layout
   ═══════════════════════════════════════════════════ */
export default function Phase5AccountDashboard() {
  const [currentUser, setCurrentUser] = useState("female");
  const [showErrors, setShowErrors] = useState(false);
  const [activePage, setActivePage] = useState("account-profile");

  const user = USERS[currentUser];

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Tag size={14} className="text-white" />
            </div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Wholesale<span className="text-sky-500">Up</span>
            </span>
          </div>
          <span className="text-xs text-slate-400">Phase 5 — Account Dashboard</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <LayoutDashboard size={16} className="text-sky-500" />
            Interactive Controls
          </h2>
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              onClick={() => setCurrentUser(currentUser === "female" ? "male" : "female")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentUser === "female" ? "bg-pink-100 text-pink-700" : "bg-indigo-100 text-indigo-700"
              }`}
            >
              <User size={12} />
              {user.firstName} {user.lastName} ({user.tier})
            </button>
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                showErrors ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              <AlertTriangle size={12} />
              {showErrors ? "Showing Errors" : "Show Validation Errors"}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "Account sidebar",
              "Upgrade banner",
              "Validation errors",
              "Credentials section",
              "Personal details",
              "Company info",
              "Address form",
              "Communication",
              "Language selector",
              "Phone code picker",
              "Newsletter toggle",
              "Male/Female variants",
            ].map((f) => (
              <div key={f} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <AccountSidebar user={user} activePage={activePage} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Upgrade Banner */}
            <UpgradeBanner user={user} />

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <AccountProfileForm showErrors={showErrors} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}
