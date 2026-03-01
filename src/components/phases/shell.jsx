"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  User,
  MessageSquare,
  ShoppingBag,
  Heart,
  Store,
  Package,
  PlusCircle,
  Coins,
  Headphones,
  Settings,
  LogOut,
  Globe,
  Mail,
  HelpCircle,
  List,
  Tag,
  Users,
  Crown,
  Shield,
  Clock,
  Bell,
  BookOpen,
} from "lucide-react";

/* ─────────────── Auth Context (simulated) ─────────────── */
const MOCK_USER = {
  firstName: "Jennifer",
  lastName: "Lawrence",
  initials: "JL",
  tier: "STANDARD",
  expiresOn: "9 Jan 2025",
  pin: "2017",
};

/* ─────────────── Currency Options ─────────────── */
const CURRENCIES = [
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "CAD", symbol: "C$", label: "CAD" },
  { code: "AUD", symbol: "A$", label: "AUD" },
];

/* ─────────────── Navigation Links ─────────────── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Pricing", href: "/pricing" },
];

/* ─────────────── Dropdown Hook ─────────────── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

/* ═══════════════════════════════════════════════════
   TOP BAR — For Buyers | For Sellers | Help | Currency
   ═══════════════════════════════════════════════════ */
function TopBar({ currency, setCurrency }) {
  const currencyDd = useDropdown();

  return (
    <div className="w-full bg-slate-900 text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
        {/* Left: Buyer/Seller links */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-sky-400 font-semibold">For buyers</span>
            <a href="/benefits" className="hover:text-white transition-colors ml-2">Retailer Benefits</a>
            <span className="text-slate-600">·</span>
            <a href="/register" className="hover:text-white transition-colors">Register</a>
          </div>
          <div className="w-px h-3.5 bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold">For sellers</span>
            <a href="/supplier-benefits" className="hover:text-white transition-colors ml-2">Supplier Benefits</a>
            <span className="text-slate-600">·</span>
            <a href="/get-listed" className="hover:text-white transition-colors">Get Listed</a>
          </div>
        </div>

        {/* Right: Help, A-Z, Currency, Email */}
        <div className="flex items-center gap-4 ml-auto">
          <a href="/help" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <HelpCircle size={12} />
            Help
          </a>
          <a href="/a-z" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <BookOpen size={12} />
            A-Z Index
          </a>
          <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />

          {/* Currency Dropdown */}
          <div ref={currencyDd.ref} className="relative">
            <button
              onClick={() => currencyDd.setOpen(!currencyDd.open)}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              <Globe size={12} />
              {currency.code}
              <ChevronDown size={10} className={`transition-transform ${currencyDd.open ? "rotate-180" : ""}`} />
            </button>
            {currencyDd.open && (
              <div className="absolute right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[120px]">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => { setCurrency(c); currencyDd.setOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      currency.code === c.code
                        ? "bg-sky-50 text-sky-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />
          <a href="mailto:service@wholesaledeals.co.uk" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <Mail size={12} />
            service@wholesaledeals.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   USER DROPDOWN MENU — Dashboard, Profile, etc.
   ═══════════════════════════════════════════════════ */
function UserDropdownMenu({ user, onLogout, onClose }) {
  const sections = [
    {
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: User, label: "Account Profile", href: "/account-profile" },
        { icon: MessageSquare, label: "Messages", href: "/messages", badge: 3 },
      ],
    },
    {
      title: "Buyer Tools",
      items: [
        { icon: ShoppingBag, label: "Buyer Profile", href: "/buyer-profile" },
        { icon: Clock, label: "My Pre-Orders", href: "/pre-orders" },
        { icon: Heart, label: "My Favourites", href: "/favourites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { icon: Store, label: "Supplier Profile", href: "/supplier-profile" },
        { icon: Package, label: "Manage Deals", href: "/manage-deals" },
        { icon: PlusCircle, label: "Add New Deal", href: "/add-deal" },
      ],
    },
    {
      title: "Services",
      items: [
        { icon: Coins, label: "Affiliate Program", href: "/affiliate" },
        { icon: Search, label: "Custom Sourcing", href: "/sourcing" },
        { icon: Headphones, label: "Help Center", href: "/help" },
      ],
    },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* User Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
            {user.initials}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 uppercase tracking-wide">
                <Crown size={9} />
                {user.tier}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Expires: {user.expiresOn}</span>
          <span>PIN: {user.pin}</span>
        </div>
      </div>

      {/* Upgrade CTA */}
      {user.tier === "STANDARD" && (
        <a
          href="/pricing"
          className="block mx-3 mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold text-center hover:from-sky-600 hover:to-blue-700 transition-all shadow-sm"
        >
          Upgrade to Premium — Unlock All Suppliers
        </a>
      )}

      {/* Menu Sections */}
      <div className="py-2">
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && <div className="h-px bg-slate-100 my-1.5 mx-3" />}
            {section.title && (
              <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors group"
              >
                <item.icon size={15} className="text-slate-400 group-hover:text-sky-500 transition-colors" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-slate-100 p-2">
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN NAVBAR
   ═══════════════════════════════════════════════════ */
function Navbar({ isAuthenticated, user, onLogin, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userDd = useDropdown();

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Tag size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Wholesale<span className="text-sky-500">Up</span>
              </span>
              <p className="text-[9px] text-slate-400 font-medium -mt-0.5 tracking-wide">20+ YEARS · #1 PLATFORM</p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 ml-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Avatar Dropdown */}
                <div ref={userDd.ref} className="relative">
                  <button
                    onClick={() => userDd.setOpen(!userDd.open)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.initials}
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform hidden sm:block ${userDd.open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userDd.open && (
                    <UserDropdownMenu
                      user={user}
                      onLogout={onLogout}
                      onClose={() => userDd.setOpen(false)}
                    />
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={(e) => { e.preventDefault(); onLogin(); }}
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/register"
                  className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-lg transition-all shadow-sm"
                >
                  Join Free
                </a>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="relative">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                {/* Search Type Selector */}
                <select className="bg-transparent border-r border-slate-200 px-3 py-3 text-sm font-medium text-slate-600 focus:outline-none appearance-none cursor-pointer">
                  <option>Deals</option>
                  <option>Suppliers</option>
                </select>
                <Search size={18} className="ml-3 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search wholesale deals, suppliers, products..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  autoFocus
                />
                <button className="px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors">
                  Search
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className="text-xs text-slate-400">Popular:</span>
                {["Wholesale Pajamas", "Leather Boots", "Sneakers", "Buy Toys Bulk"].map((term) => (
                  <button
                    key={term}
                    className="px-2.5 py-1 text-xs text-slate-500 bg-slate-100 hover:bg-sky-100 hover:text-sky-600 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="h-px bg-slate-100 my-2" />
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-xs text-sky-500 font-semibold">For buyers:</span>
              <a href="/benefits" className="text-xs text-slate-500 hover:text-sky-600">Benefits</a>
              <span className="text-slate-300">·</span>
              <a href="/register" className="text-xs text-slate-500 hover:text-sky-600">Register</a>
            </div>
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-xs text-emerald-500 font-semibold">For sellers:</span>
              <a href="/supplier-benefits" className="text-xs text-slate-500 hover:text-sky-600">Benefits</a>
              <span className="text-slate-300">·</span>
              <a href="/get-listed" className="text-xs text-slate-500 hover:text-sky-600">Get Listed</a>
            </div>
            {!isAuthenticated && (
              <div className="pt-2 space-y-2">
                <button
                  onClick={onLogin}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Log In
                </button>
                <a
                  href="/register"
                  className="block w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg text-center"
                >
                  Join Free
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
  const footerLinks = [
    {
      title: "For Buyers",
      links: [
        { label: "Browse Deals", href: "/deals" },
        { label: "Browse Suppliers", href: "/suppliers" },
        { label: "All Categories", href: "/categories" },
        { label: "Pricing", href: "/pricing" },
        { label: "Buyer Benefits", href: "/benefits" },
      ],
    },
    {
      title: "For Sellers",
      links: [
        { label: "Supplier Benefits", href: "/supplier-benefits" },
        { label: "Get Listed", href: "/get-listed" },
        { label: "Add a Deal", href: "/add-deal" },
        { label: "Seller FAQ", href: "/seller-faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Testimonials", href: "/testimonials" },
        { label: "Affiliate Program", href: "/affiliate" },
        { label: "Contact Us", href: "/contact" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "A-Z Index", href: "/a-z" },
        { label: "Custom Sourcing", href: "/sourcing" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <Tag size={18} className="text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Wholesale<span className="text-sky-400">Up</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              The #1 wholesale and dropship platform. 20+ years connecting buyers with verified suppliers worldwide.
            </p>
            <a
              href="mailto:service@wholesaledeals.co.uk"
              className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
            >
              service@wholesaledeals.co.uk
            </a>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-3.5">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} WholesaleUp. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</a>
            <a href="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</a>
            <a href="/cookies" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   ACCOUNT SIDEBAR — used in dashboard pages
   ═══════════════════════════════════════════════════ */
function AccountSidebar({ user, activePage = "account-profile" }) {
  const sections = [
    {
      title: "MANAGE ACCOUNT",
      items: [
        { id: "account-profile", icon: User, label: "Account Profile", href: "/account-profile" },
        { id: "buyer-profile", icon: ShoppingBag, label: "Buyer Profile", href: "/buyer-profile" },
        { id: "supplier-profile", icon: Store, label: "Supplier Profile", href: "/supplier-profile" },
      ],
    },
    {
      title: "DEALS MENU",
      items: [
        { id: "manage-deals", icon: Package, label: "Manage Deals", href: "/manage-deals" },
        { id: "orders", icon: ShoppingBag, label: "Orders", href: "/orders" },
        { id: "messages", icon: MessageSquare, label: "Messages", href: "/messages", badge: 3 },
        { id: "favourites", icon: Heart, label: "My Favourites", href: "/favourites" },
      ],
    },
    {
      title: "OTHER",
      items: [
        { id: "affiliate", icon: Coins, label: "Affiliate Earnings", href: "/affiliate" },
        { id: "billing", icon: Settings, label: "Manage Services & Billing", href: "/billing" },
      ],
    },
  ];

  return (
    <aside className="w-72 shrink-0">
      {/* User Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 px-5 pt-5 pb-10 text-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="px-5 pb-4 -mt-8 relative">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center mx-auto">
            <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
              {user.initials}
            </div>
          </div>
          <h3 className="text-center font-bold text-slate-900 mt-2">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center justify-center mt-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">
              <Crown size={10} />
              {user.tier}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Account Expires On</span>
              <span className="font-semibold text-slate-700">{user.expiresOn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PIN Number</span>
              <span className="font-semibold text-slate-700">{user.pin}</span>
            </div>
          </div>
          <a
            href="/pricing"
            className="block mt-3 w-full py-2 text-center text-xs font-bold text-sky-600 border border-sky-200 hover:bg-sky-50 rounded-lg transition-colors"
          >
            Renew Account
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {sections.map((section, si) => (
          <div key={section.title}>
            {si > 0 && <div className="h-px bg-slate-100" />}
            <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
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
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   UPGRADE MODAL — appears on free-tier pages
   ═══════════════════════════════════════════════════ */
function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Header */}
        <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 px-8 pt-8 pb-16 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <Shield className="w-14 h-14 text-white/90 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Unlock Full Access</h2>
          <p className="text-sky-100 text-sm mt-1">Upgrade to a Premium Membership</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-5">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Gain full access to supplier contact details, send unlimited inquiries, and enjoy direct communication with thousands of verified wholesale vendors worldwide.
            </p>
            <a
              href="/pricing"
              className="block w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl transition-all shadow-sm"
            >
              Upgrade Now
            </a>
            <p className="text-center text-xs text-slate-400 mt-3">
              Already a premium member?{" "}
              <a href="/login" className="text-sky-500 hover:text-sky-600 font-semibold">Log in.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP — Puts it all together
   ═══════════════════════════════════════════════════ */
export default function WholesaleUpShell() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentView, setCurrentView] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      <TopBar currency={currency} setCurrency={setCurrency} />
      <Navbar
        isAuthenticated={isAuthenticated}
        user={MOCK_USER}
        onLogin={() => setIsAuthenticated(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Page Content Area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Demo Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings size={20} className="text-sky-500" />
              Phase 1 Shell — Interactive Demo
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              This demonstrates the shared layout components. Toggle auth state and views to see how components adapt.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setIsAuthenticated(!isAuthenticated)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isAuthenticated
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isAuthenticated ? "✓ Logged In as Jennifer" : "○ Guest Mode"}
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
              >
                Show Upgrade Modal
              </button>
              <button
                onClick={() => setCurrentView(currentView === "home" ? "dashboard" : "home")}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all"
              >
                Toggle: {currentView === "home" ? "Show Dashboard Layout" : "Show Home Layout"}
              </button>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                "Top bar (buyers/sellers/currency)",
                "Main navbar (responsive)",
                "Search bar (expandable)",
                "Auth states (guest / logged in)",
                "User dropdown menu",
                "Mobile navigation",
                "Account sidebar",
                "Upgrade modal",
                "Footer with links",
                "Currency selector",
                "Active page highlighting",
                "Notification badge",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Conditional Layout: Dashboard with sidebar vs. Regular page */}
          {currentView === "dashboard" && isAuthenticated ? (
            <div className="flex gap-6">
              <AccountSidebar user={MOCK_USER} activePage="account-profile" />
              <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Profile</h1>
                <p className="text-sm text-slate-500 mb-6">
                  Keep your account details current to ensure suppliers receive accurate information.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["First Name", "Last Name", "Work Email", "Mobile Number", "Company Name", "Country"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{field} *</label>
                      <input
                        type="text"
                        placeholder={field}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-6 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                  Update Contact Details
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-4">
                  <Tag size={32} className="text-sky-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to WholesaleUp</h1>
                <p className="text-sm text-slate-500 mb-6">
                  This shell layout provides the foundation for all pages. The navbar, footer, sidebar, and modals are ready — next we'll build the filter sidebar and deal cards.
                </p>
                <div className="flex justify-center gap-3">
                  <span className="px-3 py-1.5 text-xs font-semibold bg-sky-100 text-sky-700 rounded-full">Phase 1 ✓</span>
                  <span className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-500 rounded-full">Phase 2 — Filters</span>
                  <span className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-500 rounded-full">Phase 3 — Deals</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
