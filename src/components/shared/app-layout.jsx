"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ChevronDown,
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
  Tag,
  Crown,
  Shield,
  Clock,
  Bell,
  BookOpen,
  Home,
  SlidersHorizontal,
  Building2,
  CreditCard,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  { label: "Home", href: "/homepage" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Pricing", href: "/pricing" },
];

/* ─────────────── Sidebar Navigation ─────────────── */
const SIDEBAR_LINKS = [
  { label: "Home", href: "/homepage", icon: Home },
  { label: "Deals", href: "/deals", icon: Package },
  { label: "Suppliers", href: "/suppliers", icon: Building2 },
  { label: "Filters", href: "/filters", icon: SlidersHorizontal },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Gating", href: "/gating", icon: Shield },
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
   LOTTIE LOGO — Animated logo with pause/play
   ═══════════════════════════════════════════════════ */
function LottieLogo() {
  const [dotLottie, setDotLottie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const dotLottieRefCallback = useCallback((dotLottieInstance) => {
    setDotLottie(dotLottieInstance);
  }, []);

  const togglePlayPause = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dotLottie) return;

    if (isPlaying) {
      dotLottie.pause();
    } else {
      dotLottie.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative group/lottie">
      <Link href="/" className="block">
        <DotLottieReact
          src="/animations/wholesale.lottie"
          loop
          autoplay
          dotLottieRefCallback={dotLottieRefCallback}
          className="max-w-[14.8125rem] max-h-10 flex items-center relative bottom-2.5 -left-2"
        />
      </Link>
      <button
        onClick={togglePlayPause}
        className="absolute bottom-0 right-0 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover/lottie:opacity-100 transition-opacity duration-200 shadow-sm border border-slate-200"
        type="button"
        title={isPlaying ? "Pause animation" : "Play animation"}
      >
        {isPlaying ? (
          <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TOP BAR — For Buyers | For Sellers | Help | Currency
   ═══════════════════════════════════════════════════ */
function TopBar({ currency, setCurrency }) {
  const currencyDd = useDropdown();

  return (
    <div className="w-full bg-slate-900 text-slate-300 text-xs">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400 font-semibold">For buyers</span>
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

        <div className="flex items-center gap-4 ml-auto">
          <a href="/help" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <HelpCircle size={12} /> Help
          </a>
          <a href="/a-z" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
            <BookOpen size={12} /> A-Z Index
          </a>
          <div className="w-px h-3.5 bg-slate-700 hidden sm:block" />
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
                        ? "bg-orange-50 text-orange-700 font-semibold"
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
            <Mail size={12} /> service@wholesaledeals.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   USER DROPDOWN MENU
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
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
      <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
            {user.initials}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 uppercase tracking-wide">
              <Crown size={9} /> {user.tier}
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Expires: {user.expiresOn}</span>
          <span>PIN: {user.pin}</span>
        </div>
      </div>
      {user.tier === "STANDARD" && (
        <a href="/pricing" className="block mx-3 mt-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm">
          Upgrade to Premium — Unlock All Suppliers
        </a>
      )}
      <div className="py-2">
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && <div className="h-px bg-slate-100 my-1.5 mx-3" />}
            {section.title && (
              <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{section.title}</p>
            )}
            {section.items.map((item) => (
              <a key={item.label} href={item.href} onClick={onClose}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors group">
                <item.icon size={15} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 p-2">
        <button onClick={onLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SIDEBAR — Claude-style left navigation
   ═══════════════════════════════════════════════════ */
function Sidebar({ isAuthenticated, user, onLogin }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 h-[calc(100vh-theme(spacing.9)-theme(spacing.16))] sticky top-[calc(theme(spacing.9)+theme(spacing.16))]">
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Navigation
        </p>
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <link.icon size={18} className={isActive ? "text-orange-400" : "text-slate-500"} />
              {link.label}
            </Link>
          );
        })}

        {isAuthenticated && (
          <>
            <div className="h-px bg-slate-800 my-3 mx-3" />
            <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Account
            </p>
            {[
              { label: "My Favourites", href: "/favourites", icon: Heart },
              { label: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
              { label: "Settings", href: "/settings", icon: Settings },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <link.icon size={18} className="text-slate-500" />
                <span className="flex-1">{link.label}</span>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Bottom: User / Login */}
      <div className="p-3 border-t border-slate-800">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.firstName}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{user.tier}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all"
          >
            Log In / Join Free
          </button>
        )}
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   TOP NAVBAR
   ═══════════════════════════════════════════════════ */
function Navbar({ isAuthenticated, user, onLogin, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userDd = useDropdown();

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-9 z-40 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <LottieLogo />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 ml-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              <>
                <button className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div ref={userDd.ref} className="relative">
                  <button onClick={() => userDd.setOpen(!userDd.open)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      {user.initials}
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${userDd.open ? "rotate-180" : ""}`} />
                  </button>
                  {userDd.open && <UserDropdownMenu user={user} onLogout={onLogout} onClose={() => userDd.setOpen(false)} />}
                </div>
              </>
            ) : (
              <>
                <a href="/login" onClick={(e) => { e.preventDefault(); onLogin(); }}
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  Log In
                </a>
                <a href="/register"
                  className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg transition-all shadow-sm">
                  Join Free
                </a>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Expandable Search */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <select className="bg-transparent border-r border-slate-200 px-3 py-3 text-sm font-medium text-slate-600 focus:outline-none appearance-none cursor-pointer">
                  <option>Deals</option>
                  <option>Suppliers</option>
                </select>
                <Search size={18} className="ml-3 text-slate-400 shrink-0" />
                <input type="text" placeholder="Search wholesale deals, suppliers, products..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none" autoFocus />
                <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 space-y-2">
                <button onClick={onLogin}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Log In
                </button>
                <a href="/register"
                  className="block w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-center">
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Tag size={18} className="text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Wholesale<span className="text-orange-400">Up</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              The #1 wholesale and dropship platform. 20+ years connecting buyers with verified suppliers worldwide.
            </p>
            <a href="mailto:service@wholesaledeals.co.uk" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
              service@wholesaledeals.co.uk
            </a>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-3.5">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-orange-400 transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} WholesaleUp. All rights reserved.</p>
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
   APP LAYOUT — Wraps all pages
   Claude-style: TopBar + Navbar + Sidebar + Content
   ═══════════════════════════════════════════════════ */
export default function AppLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      <TopBar currency={currency} setCurrency={setCurrency} />
      <Navbar
        isAuthenticated={isAuthenticated}
        user={MOCK_USER}
        onLogin={() => setIsAuthenticated(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main content area: Sidebar + Page */}
      <div className="flex flex-1">
        <Sidebar
          isAuthenticated={isAuthenticated}
          user={MOCK_USER}
          onLogin={() => setIsAuthenticated(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
