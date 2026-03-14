"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/shared/footer";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { RotatingStatsTicker } from "@/components/shared/rotating-stats-ticker";
import { useSession } from "next-auth/react";
import { WholesaleUpIcon, WholesaleUpLogo } from "@/components/shared/logo";
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
  Crown,
  Shield,
  Clock,
  Bell,
  BookOpen,
  Home,
  SlidersHorizontal,
  Building2,
  CreditCard,
  ClipboardList,
  Baby,
  Shirt,
  Monitor,
  Smartphone,
  Sparkles,
  Flower2,
  Watch,
  Gamepad2,
  Briefcase,
  Gavel,
  Dumbbell,
  Boxes,
  Tv,
  ThumbsUp,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  Link2,
  Archive,
  Tag,
  Gift,
  Car,
  UtensilsCrossed,
  PawPrint,
} from "lucide-react";
import { CATEGORY_TREE } from "@/lib/categories";
import { DASHBOARD_NAV_SECTIONS } from "@/lib/dashboard-nav";

/* ─────────────── Auth Context ─────────────────────────────
   H9: User data sourced from NextAuth session via useSession().
   The useShellUser() hook below extracts and formats the user
   object. Components receive `user` prop with:
     { firstName, lastName, initials, tier, expiresOn, email }
   M10: Subscription expiry comes from session.user.tierExpiresAt
        (set by the JWT callback in auth.js from the User table).
   ────────────────────────────────────────────────────────── */

/** Fallback user object for unauthenticated or loading states */
const FALLBACK_USER = {
  firstName: "Guest",
  lastName: "",
  initials: "G",
  tier: "FREE",
  expiresOn: null,
  email: "",
};

/**
 * Hook to derive shell user data from NextAuth session.
 * Returns FALLBACK_USER while loading or when not authenticated.
 */
function useShellUser() {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading" || !session?.user) return { user: FALLBACK_USER, status };

    const { user } = session;
    const firstName = user.name?.split(" ")[0] || "";
    const lastName = user.name?.split(" ").slice(1).join(" ") || "";
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

    return {
      user: {
        firstName,
        lastName,
        initials,
        tier: (user.tier || "free").toUpperCase(),
        expiresOn: user.tierExpiresAt
          ? new Date(user.tierExpiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          : null,
        email: user.email || "",
        image: user.image || null,
        username: user.username || "",
      },
      status,
    };
  }, [session, status]);
}

/* ─────────────── Currency Options ─────────────── */
const CURRENCIES = [
  { code: "GBP", symbol: "£", label: "GBP" },
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "CAD", symbol: "C$", label: "CAD" },
  { code: "AUD", symbol: "A$", label: "AUD" },
];

/* ─────────────── Sidebar Navigation ─────────────── */
const SIDEBAR_LINKS = [
  { label: "Home", href: "/homepage", icon: Home },
  { label: "Deals", href: "/deals", icon: Package },
  { label: "Single Deal", href: "/deal", icon: Package },
  { label: "Suppliers", href: "/suppliers", icon: Building2 },
  { label: "Supplier Profile", href: "/supplier", icon: Store },
  { label: "Liquidators", href: "/suppliers/liquidators", icon: Gavel },
  { label: "Dropshippers", href: "/suppliers/dropshippers", icon: Boxes },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Gating", href: "/gating", icon: Shield },
];

/* ─────────────── Categories — derived from canonical tree ─────────────── */
const SHELL_CATEGORY_ICONS = {
  "clothing-fashion": Shirt, "health-beauty": Sparkles, "home-garden": Flower2,
  "electronics-technology": Tv, "toys-games": Gamepad2, "gifts-seasonal": Gift,
  "sports-outdoors": Dumbbell, "jewellery-watches": Watch, "food-beverages": UtensilsCrossed,
  "pet-supplies": PawPrint, "baby-kids": Baby, "surplus-clearance": Boxes, "automotive-parts": Car,
};
const CATEGORY_LIST = CATEGORY_TREE.map((cat) => ({
  name: cat.name,
  icon: SHELL_CATEGORY_ICONS[cat.id] || Package,
  href: cat.href,
  subs: cat.subs.map((s) => ({ label: s.label, href: `/deals/${cat.id}/${s.id}` })),
}));

/* ─────────────── Section Nav Links ─────────────── */
const SECTION_NAV_LINKS = [
  { label: "Deals", href: "/deals" },
  { label: "Wholesale Suppliers", href: "/suppliers/wholesalers" },
  { label: "Liquidators", href: "/suppliers/liquidators" },
  { label: "Dropshippers", href: "/suppliers/dropshippers" },
];


/* ─────────────── Search Data ─────────────── */
const SEARCH_RECENT = [
  "Calvin Klein Jeans Shorts",
  "Basketball Sport Boots",
  "Hiking Pants Large Size",
];
const SEARCH_POPULAR = [
  "Calvin Klein Jeans Shorts",
  "Basketball Sport Boots",
  "Hiking Pants Large Size",
];
const SEARCH_PRODUCTS = [
  { name: "Calvin Klein Jeans Men's Jeans", price: 48.05, currency: "$", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop" },
  { name: "Versace Jeans Couture Logo Sneakers", price: 96.90, currency: "$", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop" },
  { name: "55dsl Parkye 55605 Jeans", price: 56.05, currency: "$", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=80&h=80&fit=crop" },
  { name: "Calvin Klein Jeans Shorts Women", price: 40.59, currency: "$", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop" },
  { name: "Balmain Mens Jeans Grey", price: 133.00, currency: "$", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=80&h=80&fit=crop" },
];

/* Footer moved to @/components/shared/footer.jsx */

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
   BRAND LOGO (imported from shared)
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   SIDEBAR — Collapsible left navigation
   ═══════════════════════════════════════════════════ */
function Sidebar({ isAuthenticated, user, onLogin, collapsed, onToggle }) {
  return (
    <aside
      className={`hidden xl:flex flex-col bg-slate-900 shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out ${
        collapsed ? "w-0 overflow-hidden" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full w-64">
        {/* Sidebar Header: Rotating stats + Logo */}
        <div className="border-b border-slate-800">
          <div className="bg-slate-800 px-3 h-8 flex items-center justify-center">
            <RotatingStatsTicker />
          </div>
          <div className="px-4 h-14 flex items-center">
            <WholesaleUpLogo />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Navigation
          </p>
          {SIDEBAR_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <link.icon size={18} className="text-slate-500" />
              {link.label}
            </a>
          ))}

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
                <a
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
                </a>
              ))}
            </>
          )}
        </nav>

        {/* Bottom: User / Login */}
        <div className="px-3 pb-5 mt-auto">
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
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all"
            >
              Log In / Join Free
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-4 top-[128px] w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-lg flex items-center justify-center transition-colors z-50"
        title="Collapse sidebar"
      >
        <ChevronDown size={14} className="text-white rotate-90" />
      </button>
    </aside>
  );
}

function SidebarExpandButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="hidden xl:flex fixed left-0 top-[128px] w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-full items-center justify-center transition-colors z-50 shadow-[2px_2px_4px_rgba(0,0,0,0.2)]"
      title="Expand sidebar"
    >
      <ChevronDown size={14} className="text-white -rotate-90" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER SEARCH BAR — with suggestions dropdown
   ═══════════════════════════════════════════════════ */
function HeaderSearchBar({ mobile = false }) {
  const [searchType, setSearchType] = useState("Deals");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentItems, setRecentItems] = useState(SEARCH_RECENT);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const ref = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const removeRecent = (item) => {
    setRecentItems((prev) => prev.filter((r) => r !== item));
  };

  const handleKeyDown = (e) => {
    if (!searchOpen) return;
    const allItems = [...(recentItems.length > 0 ? recentItems : []), ...SEARCH_POPULAR, ...SEARCH_PRODUCTS.map(p => p.name)];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSelectedIndex(-1);
    }
  };

  const py = mobile ? "py-2.5" : "py-2";
  const searchTypes = ["Deals", "Suppliers", "Importers", "Distributors", "Liquidators", "Wholesalers", "Dropshippers"];

  const filteredProducts = query.length > 0
    ? SEARCH_PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_PRODUCTS;

  let runningIndex = 0;

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={`flex items-center w-full border ${searchOpen ? "border-orange-400 ring-2 ring-orange-500/20" : "border-slate-700"} rounded-lg bg-slate-800 transition-all`}>
        {/* Type dropdown */}
        <div ref={ref} className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-1.5 border-r border-slate-700 px-3 ${py} text-xs font-semibold text-slate-300 hover:text-white transition-colors`}
          >
            {searchType}
            <ChevronDown size={12} className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[160px]">
              {searchTypes.map((t) => (
                <button key={t} onClick={() => { setSearchType(t); setDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${searchType === t ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); setSelectedIndex(-1); }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="What are you looking for?"
          className={`flex-1 px-3 ${py} text-sm text-white placeholder-slate-500 focus:outline-none bg-transparent min-w-0`}
          autoFocus={mobile}
        />
        {/* Search button */}
        <button className={`px-4 ${py} bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shrink-0 rounded-r-lg`}>
          <Search size={16} />
          {!mobile && <span className="text-sm font-semibold hidden lg:inline">Search</span>}
        </button>
      </div>

      {/* Search suggestions dropdown */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-[70vh] overflow-y-auto">
          {query.length > 0 && (
            <a href={`/deals?any=${encodeURIComponent(query)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <Search size={16} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700">Search for &ldquo;<span className="font-semibold">{query}</span>&rdquo;</span>
            </a>
          )}

          {recentItems.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent</p>
              {recentItems.map((item) => {
                const idx = runningIndex++;
                return (
                  <div key={item} className={`flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <a href={`/deals?any=${encodeURIComponent(item)}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <Clock size={16} className="text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-700 truncate">{item}</span>
                    </a>
                    <button onClick={(e) => { e.stopPropagation(); removeRecent(item); }} className="p-1 text-slate-300 hover:text-slate-500 transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className={`py-2 ${recentItems.length > 0 ? "border-t border-slate-100" : ""}`}>
            <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Most Popular</p>
            {SEARCH_POPULAR.map((item) => {
              const idx = runningIndex++;
              return (
                <a key={item} href={`/deals?any=${encodeURIComponent(item)}`} className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                  <TrendingUp size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </a>
              );
            })}
          </div>

          {filteredProducts.length > 0 && (
            <div className="py-2 border-t border-slate-100">
              <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Products</p>
              {filteredProducts.map((product) => {
                const idx = runningIndex++;
                return (
                  <a key={product.name} href="/deal" className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700 leading-snug line-clamp-2">{product.name}</p>
                      <p className="text-sm mt-0.5"><span className="font-bold text-orange-600">{product.currency}{product.price.toFixed(2)}</span> <span className="text-slate-400 text-xs">/ Unit ex.VAT</span></p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CATEGORIES BUTTON + MEGA DROPDOWN WITH SUBCATEGORIES
   ═══════════════════════════════════════════════════ */
function CategoriesButton() {
  const [open, setOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHoveredCat(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden xl:block">
      <button onClick={() => { setOpen(!open); setHoveredCat(null); }}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-orange-400 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors">
        <Menu size={16} /> Categories
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex" style={{ minWidth: hoveredCat !== null ? "620px" : "340px" }}>
          {/* Categories list */}
          <div className="w-[340px] max-h-[70vh] overflow-y-auto py-2 border-r border-slate-100">
            {CATEGORY_LIST.map((cat, idx) => (
              <a
                key={cat.name}
                href={cat.href}
                onMouseEnter={() => setHoveredCat(idx)}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors group ${
                  hoveredCat === idx ? "bg-orange-50 text-orange-600" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <cat.icon size={18} className={hoveredCat === idx ? "text-orange-500" : "text-slate-400"} />
                  <span className="font-medium">{cat.name}</span>
                </div>
                <ChevronRight size={14} className={hoveredCat === idx ? "text-orange-400" : "text-slate-300"} />
              </a>
            ))}
          </div>

          {/* Subcategories panel */}
          {hoveredCat !== null && (
            <div className="w-[280px] max-h-[70vh] overflow-y-auto py-3 px-2">
              <div className="border-b border-dashed border-slate-200 pb-2 mb-2 px-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {CATEGORY_LIST[hoveredCat].name}
                </p>
              </div>
              {CATEGORY_LIST[hoveredCat].subs.map((sub) => (
                <a key={sub.label} href={sub.href}
                  className="block px-3 py-2.5 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  {sub.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
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
        { icon: User, label: "Account Profile", href: "/dashboard/account-profile" },
        { icon: MessageSquare, label: "Messages", href: "/messages", badge: 3 },
      ],
    },
    {
      title: "Buyer Tools",
      items: [
        { icon: ShoppingBag, label: "Buyer Profile", href: "/dashboard/buyer-profile" },
        { icon: Clock, label: "My Pre-Orders", href: "/pre-orders" },
        { icon: Heart, label: "My Favourites", href: "/favourites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { icon: Store, label: "Supplier Profile", href: "/supplier" },
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
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">{user.initials}</div>
          <div>
            <p className="text-white font-semibold text-sm">{user.firstName} {user.lastName}</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 uppercase tracking-wide">
              <Crown size={9} /> {user.tier}
            </span>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Expires: {user.expiresOn}</span><span>PIN: {user.pin}</span>
        </div>
      </div>
      {user.tier === "STANDARD" && (
        <a href="/pricing" className="block mx-3 mt-3 px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-600 transition-all shadow-sm">
          Upgrade to Premium — Unlock All Suppliers
        </a>
      )}
      <div className="py-2">
        {sections.map((section, si) => (
          <div key={si}>
            {si > 0 && <div className="h-px bg-slate-100 my-1.5 mx-3" />}
            {section.title && <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{section.title}</p>}
            {section.items.map((item) => (
              <a key={item.label} href={item.href} onClick={onClose}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors group">
                <item.icon size={15} className="text-slate-400 group-hover:text-orange-500" />
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>}
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
   LOGIN DROPDOWN — hover panel with menu sections
   ═══════════════════════════════════════════════════ */
function LoginDropdown({ onLogin }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  const handleEnter = () => { clearTimeout(timeout.current); setOpen(true); };
  const handleLeave = () => { timeout.current = setTimeout(() => setOpen(false), 200); };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => { document.removeEventListener("mousedown", handler); clearTimeout(timeout.current); };
  }, []);

  const menuSections = [
    {
      items: [
        { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Account Profile", icon: Settings, href: "/account" },
        { label: "Messages", icon: MessageSquare, href: "/messages" },
      ],
    },
    {
      title: "Buyers Tools",
      items: [
        { label: "Buyer Profile", icon: ClipboardList, href: "/dashboard/buyer-profile" },
        { label: "My Pre-Orders", icon: Clock, href: "/pre-orders" },
        { label: "My Favorites", icon: Heart, href: "/favorites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { label: "Supplier Profile", icon: Store, href: "/supplier" },
        { label: "Manage Deals", icon: Archive, href: "/manage-deals" },
        { label: "Add New Deal", icon: PlusCircle, href: "/add-deal" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Affiliate Program", icon: Link2, href: "/affiliate" },
        { label: "Custom Sourcing", icon: Package, href: "/sourcing" },
      ],
    },
  ];

  return (
    <div className="relative flex items-center gap-1.5 sm:gap-2">
      <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <a href="/login" onClick={(e) => { e.preventDefault(); onLogin(); }}
          className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-1.5 text-sm font-semibold text-slate-300 border border-slate-600 hover:border-orange-400 hover:text-orange-400 rounded-full transition-colors">
          <User size={16} /> <span className="hidden sm:inline">Log In</span>
        </a>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
               onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            {menuSections.map((section, si) => (
              <div key={si} className={si > 0 ? "border-t border-slate-100" : ""}>
                {section.title && (
                  <p className="px-4 pt-3 pb-1 text-xs font-bold text-orange-500 uppercase tracking-wider">{section.title}</p>
                )}
                <div className={section.title ? "pb-2" : "py-2"}>
                  {section.items.map((item) => (
                    <a key={item.label} href={item.href}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <item.icon size={16} className="text-slate-400" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 py-2">
              <a href="/help" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                <HelpCircle size={16} className="text-slate-400" />
                Help Center
              </a>
            </div>
          </div>
        )}
      </div>
      <a href="/register"
        className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-sm">
        <span className="sm:hidden">Join</span><span className="hidden sm:inline">Join Free</span>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER — Two-row dark header (utility bar + logo/search/auth)
   ═══════════════════════════════════════════════════ */
function Header({ isAuthenticated, isPremium, user, onLogin, onLogout, currency, setCurrency, onMobileNavToggle, onSetGuest, onSetFree, onSetPremium }) {
  const userDd = useDropdown();
  const currencyDd = useDropdown();
  const buyersDd = useDropdown();
  const sellersDd = useDropdown();
  const demoDd = useDropdown();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="w-full bg-slate-900 sticky top-0 z-40">
      {/* Row 1: Utility bar */}
      <div className="bg-slate-950 text-slate-300 text-xs">
        <div className="px-4 sm:px-6 flex items-center justify-between h-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* For Buyers Dropdown */}
            <div ref={buyersDd.ref} className="relative">
              <button onClick={() => buyersDd.setOpen(!buyersDd.open)}
                className="flex items-center gap-1 text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                <span className="hidden sm:inline">For</span> <span className="hidden sm:inline">retailers</span><span className="sm:hidden">Retailers</span> <ChevronDown size={14} className={`transition-transform ${buyersDd.open ? "rotate-180" : ""}`} />
              </button>
              {buyersDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[170px]">
                  <a href="/benefits" className="block px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600">Retailer Benefits</a>
                  <a href="/register" className="block px-3 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-600">Register</a>
                </div>
              )}
            </div>
            {/* For Sellers Dropdown */}
            <div ref={sellersDd.ref} className="relative">
              <button onClick={() => sellersDd.setOpen(!sellersDd.open)}
                className="flex items-center gap-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
                <span className="hidden sm:inline">For</span> <span className="hidden sm:inline">suppliers</span><span className="sm:hidden">Suppliers</span> <ChevronDown size={14} className={`transition-transform ${sellersDd.open ? "rotate-180" : ""}`} />
              </button>
              {sellersDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[170px]">
                  <a href="/supplier-benefits" className="block px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">Supplier Benefits</a>
                  <a href="/get-listed" className="block px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">Get Listed</a>
                </div>
              )}
            </div>
            <a href="/help" className="flex items-center gap-1 hover:text-white transition-colors"><HelpCircle size={12} /> Help</a>
            {/* Demo mode dropdown */}
            <div ref={demoDd.ref} className="relative hidden sm:block">
              <button onClick={() => demoDd.setOpen(!demoDd.open)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                <SlidersHorizontal size={10} /> Demo <ChevronDown size={14} className={`transition-transform ${demoDd.open ? "rotate-180" : ""}`} />
              </button>
              {demoDd.open && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-50 min-w-[140px]">
                  <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">View as</p>
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => { onSetGuest(); demoDd.setOpen(false); }}
                      className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${!isAuthenticated ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>Guest</button>
                    <button onClick={() => { onSetFree(); demoDd.setOpen(false); }}
                      className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${isAuthenticated && !isPremium ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>Free User</button>
                    <button onClick={() => { onSetPremium(); demoDd.setOpen(false); }}
                      className={`text-left px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${isPremium ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-50"}`}>Premium</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <a href="/a-z" className="flex items-center gap-1 hover:text-white transition-colors"><BookOpen size={12} /> <span className="hidden sm:inline">A-Z Index</span><span className="sm:hidden">A-Z</span></a>
            <div className="w-px h-3.5 bg-slate-700" />
            <div ref={currencyDd.ref} className="relative">
              <button onClick={() => currencyDd.setOpen(!currencyDd.open)}
                className="flex items-center gap-1 hover:text-white transition-colors font-medium">
                <Globe size={12} /> {currency.code} <ChevronDown size={14} className={`transition-transform ${currencyDd.open ? "rotate-180" : ""}`} />
              </button>
              {currencyDd.open && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[110px]">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => { setCurrency(c); currencyDd.setOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${currency.code === c.code ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}>
                      {c.symbol} {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-3.5 bg-slate-700 hidden md:block" />
            <a href="mailto:service@wholesaleup.com" className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
              <Mail size={12} /> service@wholesaleup.com
            </a>
          </div>
        </div>
      </div>

      {/* Row 2: Logo (mobile) + Search + Auth */}
      <div className="px-4 sm:px-6 border-b border-slate-800">
        <div className="flex items-center gap-3 h-14">
          {/* Mobile hamburger + logo */}
          <div className="xl:hidden flex items-center gap-2 shrink-0">
            <button
              onClick={onMobileNavToggle}
              className="p-1.5 text-slate-400 hover:text-orange-400 rounded-lg transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <WholesaleUpLogo size="small" />
          </div>

          {/* Categories Button (desktop) */}
          <CategoriesButton />

          {/* Search Bar (desktop) */}
          <div className="hidden xl:flex flex-1 mx-4">
            <HeaderSearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="xl:hidden p-2 text-slate-400 hover:text-orange-400 rounded-lg"
            >
              <Search size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-orange-400 rounded-lg relative">
              <Heart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">5</span>
            </button>
            {isAuthenticated ? (
              <>
                <button className="p-2 text-slate-400 hover:text-orange-400 rounded-lg relative">
                  <Bell size={20} /><span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
                </button>
                <div ref={userDd.ref} className="relative">
                  <button onClick={() => userDd.setOpen(!userDd.open)}
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-lg hover:bg-slate-800">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">{user.initials}</div>
                    <span className="hidden sm:inline text-sm font-semibold text-slate-200">{user.firstName}</span>
                    <ChevronDown size={14} className={`text-slate-400 hidden sm:block ${userDd.open ? "rotate-180" : ""}`} />
                  </button>
                  {userDd.open && <UserDropdownMenu user={user} onLogout={onLogout} onClose={() => userDd.setOpen(false)} />}
                </div>
              </>
            ) : (
              <LoginDropdown onLogin={onLogin} />
            )}
            <button className="p-2 text-slate-400 hover:text-orange-400 rounded-lg relative">
              <ClipboardList size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="xl:hidden px-4 py-3 border-b border-slate-800 bg-slate-900">
          <HeaderSearchBar mobile />
        </div>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   MOBILE NAV DRAWER
   ═══════════════════════════════════════════════════ */
function MobileNav({ open, onClose, isAuthenticated, isPremium, onLogin, onSetGuest, onSetFree, onSetPremium }) {
  if (!open) return null;
  return (
    <div className="xl:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <WholesaleUpLogo size="small" dark />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700"><X size={20} /></button>
        </div>
        {/* Demo mode controls */}
        <div className="p-3 border-b border-slate-100 bg-amber-50/60">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1.5 px-1">Demo Mode</p>
          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-amber-200">
            <button onClick={() => { onSetGuest(); }}
              className={`flex-1 px-2 py-1.5 text-[11px] font-semibold rounded-md transition-all ${!isAuthenticated ? "bg-amber-100 text-amber-800 shadow-sm" : "text-slate-500"}`}>Guest</button>
            <button onClick={() => { onSetFree(); }}
              className={`flex-1 px-2 py-1.5 text-[11px] font-semibold rounded-md transition-all ${isAuthenticated && !isPremium ? "bg-amber-100 text-amber-800 shadow-sm" : "text-slate-500"}`}>Free</button>
            <button onClick={() => { onSetPremium(); }}
              className={`flex-1 px-2 py-1.5 text-[11px] font-semibold rounded-md transition-all ${isPremium ? "bg-amber-100 text-amber-800 shadow-sm" : "text-slate-500"}`}>Premium</button>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
            <input type="text" placeholder="Search..." className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none" />
            <button className="px-3 py-2.5 text-orange-500"><Search size={18} /></button>
          </div>
        </div>
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
          {CATEGORY_LIST.map((cat) => (
            <a key={cat.name} href={cat.href} onClick={onClose}
              className="flex items-center gap-3 px-2 py-2.5 text-sm text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <cat.icon size={16} className="text-slate-400" /> {cat.name}
            </a>
          ))}
        </div>
        <div className="p-4 border-b border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Browse</p>
          {SECTION_NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} onClick={onClose}
              className="block px-2 py-2.5 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        {!isAuthenticated && (
          <div className="p-4 space-y-2">
            <button onClick={() => { onLogin(); onClose(); }}
              className="w-full px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50">Log In</button>
            <a href="/register" className="block w-full px-4 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg text-center">Join Free</a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ACCOUNT SIDEBAR — used in dashboard pages
   ═══════════════════════════════════════════════════ */
function AccountSidebar({ user, activePage = "account-profile" }) {
  const sections = DASHBOARD_NAV_SECTIONS;

  return (
    <aside className="w-72 shrink-0">
      {/* User Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 px-5 pt-5 pb-10 text-center relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="px-5 pb-4 -mt-8 relative">
          <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center mx-auto">
            <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {user.initials}
            </div>
          </div>
          <h3 className="text-center font-bold text-slate-900 mt-2">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center justify-center mt-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide">
              <Crown size={10} /> {user.tier}
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
            className="block mt-3 w-full py-2 text-center text-xs font-bold text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors"
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
                      ? "text-orange-600 bg-orange-50 font-semibold border-r-2 border-orange-500"
                      : "text-slate-600 hover:text-orange-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-orange-500" : "text-slate-400"} />
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Header */}
        <div className="relative bg-gradient-to-br from-orange-500 to-orange-700 px-8 pt-8 pb-16 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <Shield className="w-14 h-14 text-white/90 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Unlock Full Access</h2>
          <p className="text-orange-100 text-sm mt-1">Upgrade to a Premium Membership</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-5">
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Gain full access to supplier contact details, send unlimited inquiries, and enjoy direct communication with thousands of verified wholesale vendors worldwide.
            </p>
            <a
              href="/pricing"
              className="block w-full py-3 text-center text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-sm"
            >
              Upgrade Now
            </a>
            <p className="text-center text-xs text-slate-400 mt-3">
              Already a premium member?{" "}
              <a href="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Log in.</a>
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
  // H9: Real user data from NextAuth session
  const { user: sessionUser, status: authStatus } = useShellUser();
  const isAuthenticated = authStatus === "authenticated";
  const isPremium = ["PRO", "ENTERPRISE"].includes(sessionUser.tier);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, toggleSidebar, setSidebarCollapsed] = usePanelCollapse("wup-sidebar-collapsed");

  // Auth state is now derived from NextAuth session above.
  // These legacy setters are kept for demo toggle UI compatibility.
  // PRODUCTION: Remove demo toggle UI and these functions.
  const setGuest = () => {};
  const setFree = () => {};
  const setPremiumUser = () => {};

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        user={sessionUser}
        onLogin={() => setIsAuthenticated(true)}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Expand button when collapsed */}
      {sidebarCollapsed && <SidebarExpandButton onClick={() => setSidebarCollapsed(false)} />}

      {/* Right side: Header + Content + Footer */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isAuthenticated={isAuthenticated}
          isPremium={isPremium}
          user={sessionUser}
          onLogin={() => setIsAuthenticated(true)}
          onLogout={() => { setIsAuthenticated(false); setIsPremium(false); }}
          currency={currency}
          setCurrency={setCurrency}
          onMobileNavToggle={() => setMobileNavOpen(true)}
          onSetGuest={setGuest}
          onSetFree={setFree}
          onSetPremium={setPremiumUser}
        />

        <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}
          isAuthenticated={isAuthenticated} isPremium={isPremium} onLogin={() => setIsAuthenticated(true)}
          onSetGuest={setGuest} onSetFree={setFree} onSetPremium={setPremiumUser} />

        {/* Page Content Area */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Demo Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-orange-500" />
                Phase 1 Shell — Interactive Demo
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                This demonstrates the shared layout components that power every page. Toggle auth state, views, and sidebar to see how all components adapt.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    if (isPremium) { setGuest(); }
                    else if (isAuthenticated) { setPremiumUser(); }
                    else { setFree(); }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isPremium
                      ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      : isAuthenticated
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isPremium ? "★ Premium User" : isAuthenticated ? "✓ Free User (Jennifer)" : "○ Guest Mode"}
                </button>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all"
                >
                  Show Upgrade Modal
                </button>
                <button
                  onClick={() => setCurrentView(currentView === "home" ? "dashboard" : "home")}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all"
                >
                  Toggle: {currentView === "home" ? "Show Dashboard Layout" : "Show Home Layout"}
                </button>
                <button
                  onClick={toggleSidebar}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all hidden xl:inline-flex items-center gap-1.5"
                >
                  {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
                  {sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                </button>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  "Collapsible sidebar navigation",
                  "Rotating stats ticker",
                  "Two-row dark header",
                  "Demo mode (Guest/Free/Premium)",
                  "Categories mega-menu w/ subs",
                  "Rich search bar w/ suggestions",
                  "Search type dropdown",
                  "Login dropdown (hover panel)",
                  "User dropdown menu",
                  "Favourites / Cart / Notifications",
                  "Country flag selector (footer)",
                  "Newsletter subscription bar",
                  "Payment method icons",
                  "Currency selector",
                  "Auth states (guest/free/premium)",
                  "Account sidebar (dashboard)",
                  "Upgrade modal",
                  "Mobile nav drawer",
                  "WholesaleUp SVG icon",
                  "Footer with full link columns",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Conditional Layout: Dashboard with sidebar vs. Regular page */}
            {currentView === "dashboard" && isAuthenticated ? (
              <div className="flex gap-6">
                <AccountSidebar user={sessionUser} activePage="account-profile" />
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Profile</h1>
                  <p className="text-sm text-slate-500 mb-6">
                    Keep your account details current to ensure suppliers receive accurate information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["First Name", "Last Name", "Work Email", "Mobile Number", "Company Name", "Country"].map(
                      (field) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">{field} *</label>
                          <input
                            type="text"
                            placeholder={field}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <button className="mt-6 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                    Update Contact Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Tag size={32} className="text-orange-500" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to WholesaleUp</h1>
                  <p className="text-sm text-slate-500 mb-6">
                    This shell layout provides the foundation for all pages. The sidebar, header, footer, search, and modals power
                    the entire WholesaleUp platform — 15 pages and growing.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Shell", "Filters", "Deals", "Suppliers", "Dashboard",
                      "Pricing", "Homepage", "Gating", "Single Deal",
                      "Supplier Profile", "Categories", "Testimonials",
                      "Terms", "Privacy", "Cookies",
                    ].map((name, i) => (
                      <span key={name} className="px-3 py-1.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                        {i + 1}. {name} ✓
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
