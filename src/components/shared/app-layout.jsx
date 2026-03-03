"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ShoppingCart,
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
  BadgeCheck,
  ThumbsUp,
  TrendingUp,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Percent,
  ClipboardList,
  Link2,
  Archive,
} from "lucide-react";
// DotLottieReact removed — using text logo instead

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

/* ─────────────── Sidebar Navigation ─────────────── */
const SIDEBAR_LINKS = [
  { label: "Home", href: "/homepage", icon: Home },
  { label: "Deals", href: "/deals", icon: Package },
  { label: "Single Deal", href: "/single-deal", icon: Package },
  { label: "Suppliers", href: "/suppliers", icon: Building2 },
  { label: "Supplier Profile", href: "/supplier-profile", icon: Store },
  { label: "Liquidators", href: "/suppliers?type=liquidators", icon: Gavel },
  { label: "Dropshippers", href: "/suppliers?type=dropshippers", icon: Boxes },
  { label: "Filters", href: "/filters", icon: SlidersHorizontal },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Gating", href: "/gating", icon: Shield },
];

/* ─────────────── Categories Data with Subcategories ─────────────── */
const CATEGORY_LIST = [
  { name: "Baby Products", icon: Baby, href: "/categories/baby-products", subs: ["Clothing & Shoes (12)", "Feeding & Nursing (8)", "Toys & Activity (15)", "Pushchairs & Prams (3)", "Safety & Health (6)"] },
  { name: "Clothing", icon: Shirt, href: "/categories/clothing", subs: ["Men's Clothing (45)", "Women's Clothing (62)", "Children's Clothing (28)", "Sportswear (19)", "Accessories (34)"] },
  { name: "Computing", icon: Monitor, href: "/categories/computing", subs: ["Laptops & Notebooks (18)", "Desktop PCs (7)", "Tablets (12)", "Components (24)", "Peripherals (31)"] },
  { name: "Consumer Electronic", icon: Tv, href: "/categories/consumer-electronic", subs: ["TV & Home Cinema (14)", "Audio & HiFi (9)", "Cameras & Camcorders (6)", "Smart Home (11)", "Wearable Tech (8)"] },
  { name: "Health & Beauty", icon: Sparkles, href: "/categories/health-beauty", subs: ["Diet, Supplements, & Vitamins (0)", "Hair & Skin Care (8)", "Makeup & Cosmetics (9)", "Manicure & Pedicure (10)", "Natural & Alternative Therapy (9)", "Perfumes & Fragrances (90)", "Personal Care (90)"] },
  { name: "Home & Garden", icon: Flower2, href: "/categories/home-garden", subs: ["Furniture (22)", "Kitchen & Dining (18)", "Bedding & Linen (14)", "Garden Tools (9)", "Home Decor (27)"] },
  { name: "Jewellery & Watches", icon: Watch, href: "/categories/jewellery-watches", subs: ["Rings (15)", "Necklaces (12)", "Watches (20)", "Earrings (8)", "Bracelets (11)"] },
  { name: "Leisure & Entertainment", icon: Gamepad2, href: "/categories/leisure-entertainment", subs: ["Books & Magazines (7)", "DVDs & Blu-ray (4)", "Musical Instruments (6)", "Board Games (9)", "Arts & Crafts (13)"] },
  { name: "Mobile & Home Phones", icon: Smartphone, href: "/categories/mobile-phones", subs: ["Smartphones (32)", "Phone Cases (45)", "Chargers & Cables (28)", "Screen Protectors (15)", "Headphones (19)"] },
  { name: "Office & Business", icon: Briefcase, href: "/categories/office-business", subs: ["Office Supplies (18)", "Printers & Ink (7)", "Office Furniture (5)", "Filing & Storage (12)", "Presentation (3)"] },
  { name: "Police Auctions & Auction Houses", icon: Gavel, href: "/categories/police-auctions", subs: ["Lost Property (4)", "Seized Goods (6)", "Unclaimed Parcels (3)", "Government Surplus (2)"] },
  { name: "Sports & Fitness", icon: Dumbbell, href: "/categories/sports-fitness", subs: ["Gym Equipment (11)", "Outdoor Sports (14)", "Team Sports (8)", "Cycling (6)", "Swimming (5)"] },
  { name: "Surplus & Stocklots", icon: Boxes, href: "/categories/surplus-stocklots", subs: ["Mixed Pallets (7)", "Customer Returns (12)", "End of Line (9)", "Overstock (15)", "Clearance (20)"] },
  { name: "Toys & Games", icon: Gamepad2, href: "/categories/toys-games", subs: ["Action Figures (8)", "Building Toys (12)", "Dolls (6)", "Educational Toys (15)", "Outdoor Toys (9)"] },
];

/* ─────────────── Section Nav Links ─────────────── */
const SECTION_NAV_LINKS = [
  { label: "Deals", href: "/deals" },
  { label: "Wholesale Suppliers", href: "/suppliers?type=wholesale" },
  { label: "Liquidators", href: "/suppliers?type=liquidators" },
  { label: "Drop Shippers", href: "/suppliers?type=dropshippers" },
];

/* ─────────────── Rotating Stats Data ─────────────── */
const ROTATING_STATS = [
  { icon: BadgeCheck, text: "Over 42,900+ verified suppliers" },
  { icon: Users, text: "Trusted by 901,900+ resellers" },
  { icon: ShoppingCart, text: "Buy direct without commissions" },
  { icon: Percent, text: "High margins, up to 95% below retail" },
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
   ROTATING STATS TICKER — Scrolls upward in sidebar header
   ═══════════════════════════════════════════════════ */
function RotatingStatsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROTATING_STATS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stat = ROTATING_STATS[currentIndex];

  return (
    <div className="h-6 w-full overflow-hidden relative">
      <div
        key={currentIndex}
        className="flex items-center justify-center gap-1.5 h-6 text-white text-[10px] font-medium animate-slideUp"
      >
        <stat.icon size={12} className="text-orange-400 shrink-0" />
        <span className="truncate">{stat.text}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGO — White text on dark background
   ═══════════════════════════════════════════════════ */
function WholesaleUpIcon({ className = "", dark = false }) {
  const strokeColor = dark ? "#0f172a" : "#ffffff";
  const gradId = dark ? "arrowGradDark" : "arrowGrad";
  return (
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Left downstroke of W */}
      <path d="M8 12 L22 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Middle V of W */}
      <path d="M22 62 L40 28 L56 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Right upstroke becoming arrow shaft (to orange gradient) */}
      <path d="M56 62 L72 18" stroke={`url(#${gradId})`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Orange arrowhead */}
      <polygon points="72,4 60,22 84,22" fill="#f97316"/>
    </svg>
  );
}

function WholesaleUpLogo({ size = "default", dark = false }) {
  const iconClass = size === "small" ? "w-6 h-6" : "w-8 h-8";
  const textClass = size === "small"
    ? "text-base font-extrabold tracking-tight"
    : "text-lg font-extrabold tracking-tight";
  const wordColor = dark ? "text-slate-900" : "text-white";

  return (
    <Link href="/" className="flex items-center gap-1.5">
      <WholesaleUpIcon className={iconClass} dark={dark} />
      <span className={textClass}>
        <span className={wordColor}>Wholesale</span>
        <span className="text-orange-500">Up</span>
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════
   SIDEBAR — Collapsible left navigation (sitewide)
   ═══════════════════════════════════════════════════ */
function Sidebar({ isAuthenticated, user, onLogin, collapsed, onToggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-slate-900 shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out ${
        collapsed ? "w-0 overflow-hidden" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full w-64">
        {/* Sidebar Header: Rotating stats + Logo */}
        <div className="border-b border-slate-800">
          {/* Rotating stats ticker */}
          <div className="bg-slate-800 px-3 h-8 flex items-center justify-center">
            <RotatingStatsTicker />
          </div>
          {/* Logo — matches header Row 2 height (h-14) */}
          <div className="px-4 h-14 flex items-center">
            <WholesaleUpLogo />
          </div>
        </div>

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

        {/* Bottom: User / Login — sticky at bottom */}
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

      {/* Collapse toggle button — narrow vertical bar on the right edge */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[128px] w-3 h-16 bg-orange-600 hover:bg-orange-500 rounded-r flex items-center justify-center transition-colors z-50 shadow-md"
        title="Collapse sidebar"
      >
        <ChevronDown size={10} className="text-white rotate-90" />
      </button>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════
   SIDEBAR EXPAND BUTTON — Shown when sidebar is collapsed
   ═══════════════════════════════════════════════════ */
function SidebarExpandButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex fixed left-0 top-[128px] w-3 h-16 bg-orange-600 hover:bg-orange-500 rounded-r items-center justify-center transition-colors z-50 shadow-md"
      title="Expand sidebar"
    >
      <ChevronDown size={10} className="text-white -rotate-90" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   HEADER — Top bar with For buyers/sellers, search, auth
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
      {/* Row 1: Utility bar — visible on all screen sizes */}
      <div className="bg-slate-950 text-slate-300 text-xs">
        <div className="px-4 sm:px-6 flex items-center justify-between h-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* For Buyers Dropdown */}
            <div ref={buyersDd.ref} className="relative">
              <button onClick={() => buyersDd.setOpen(!buyersDd.open)}
                className="flex items-center gap-1 text-orange-400 font-semibold hover:text-orange-300 transition-colors">
                <span className="hidden sm:inline">For</span> <span className="hidden sm:inline">retailers</span><span className="sm:hidden">Retailers</span> <ChevronDown size={10} className={`transition-transform ${buyersDd.open ? "rotate-180" : ""}`} />
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
                <span className="hidden sm:inline">For</span> <span className="hidden sm:inline">suppliers</span><span className="sm:hidden">Suppliers</span> <ChevronDown size={10} className={`transition-transform ${sellersDd.open ? "rotate-180" : ""}`} />
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
                <SlidersHorizontal size={10} /> Demo <ChevronDown size={10} className={`transition-transform ${demoDd.open ? "rotate-180" : ""}`} />
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
                <Globe size={12} /> {currency.code} <ChevronDown size={10} className={`transition-transform ${currencyDd.open ? "rotate-180" : ""}`} />
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
          {/* Mobile hamburger + logo — visible only when sidebar is hidden */}
          <div className="lg:hidden flex items-center gap-2 shrink-0">
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
          <div className="hidden lg:flex flex-1 mx-4">
            <HeaderSearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-orange-400 rounded-lg"
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
              <ShoppingCart size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar — slides open below header */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 py-3 border-b border-slate-800 bg-slate-900">
          <HeaderSearchBar mobile />
        </div>
      )}

    </header>
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
        { label: "Buyer Profile", icon: ClipboardList, href: "/buyer-profile" },
        { label: "My Pre-Orders", icon: Clock, href: "/pre-orders" },
        { label: "My Favorites", icon: Heart, href: "/favorites" },
      ],
    },
    {
      title: "Supplier Tools",
      items: [
        { label: "Supplier Profile", icon: Store, href: "/supplier-profile" },
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
          {/* Help Center at bottom */}
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
   HEADER SEARCH BAR — shared between desktop & mobile
   ═══════════════════════════════════════════════════ */
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
  { name: "Versace Jeans 76YA3SC2 ZPA52 Men's Couture Logo Jeans Sneakers", price: 96.90, currency: "$", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80&h=80&fit=crop" },
  { name: "55dsl Parkye 55605 Jeans", price: 56.05, currency: "$", image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=80&h=80&fit=crop" },
  { name: "Calvin Klein Jeans Shorts Women", price: 40.59, currency: "$", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=80&h=80&fit=crop" },
  { name: "Balmain Mens Hp58202jr8261 Jeans Grey", price: 133.00, currency: "$", image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=80&h=80&fit=crop" },
];

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

  // Filter products based on query
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
          placeholder={mobile ? "What are you looking for?" : "What are you looking for?"}
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
          {/* Search for "query" */}
          {query.length > 0 && (
            <a href={`/deals?q=${encodeURIComponent(query)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100">
              <Search size={16} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-700">Search for &ldquo;<span className="font-semibold">{query}</span>&rdquo;</span>
            </a>
          )}

          {/* Recent searches */}
          {recentItems.length > 0 && (
            <div className="py-2">
              <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent</p>
              {recentItems.map((item) => {
                const idx = runningIndex++;
                return (
                  <div key={item} className={`flex items-center justify-between px-4 py-2.5 transition-colors cursor-pointer ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <a href={`/deals?q=${encodeURIComponent(item)}`} className="flex items-center gap-3 flex-1 min-w-0">
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

          {/* Most popular */}
          <div className={`py-2 ${recentItems.length > 0 ? "border-t border-slate-100" : ""}`}>
            <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Most Popular</p>
            {SEARCH_POPULAR.map((item) => {
              const idx = runningIndex++;
              return (
                <a key={item} href={`/deals?q=${encodeURIComponent(item)}`} className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                  <TrendingUp size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{item}</span>
                </a>
              );
            })}
          </div>

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div className="py-2 border-t border-slate-100">
              <p className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Products</p>
              {filteredProducts.map((product) => {
                const idx = runningIndex++;
                return (
                  <a key={product.name} href="/single-deal" className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${selectedIndex === idx ? "bg-orange-50" : "hover:bg-slate-50"}`}>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
    <div ref={ref} className="relative hidden lg:block">
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
                <a key={sub} href="#"
                  className="block px-3 py-2.5 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  {sub}
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
   MOBILE NAV DRAWER
   ═══════════════════════════════════════════════════ */
function MobileNav({ open, onClose, isAuthenticated, isPremium, onLogin, onSetGuest, onSetFree, onSetPremium }) {
  if (!open) return null;
  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <WholesaleUpLogo size="small" dark />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-700"><X size={20} /></button>
        </div>
        {/* Demo mode controls — mobile/tablet */}
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
   FOOTER COUNTRIES LIST
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

const NEWSLETTER_CATEGORIES = CATEGORY_LIST.map((c) => c.name);

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
        <div className="absolute bottom-full mb-2 left-0 w-56 max-h-72 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50">
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
        className="flex items-center gap-2 w-full h-[42px] px-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
      >
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-full min-w-[220px] max-h-64 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50">
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
   FOOTER
   ═══════════════════════════════════════════════════ */
function Footer() {
  const footerLinks = [
    { title: "For Buyers", links: [{ label: "Browse Deals", href: "/deals" }, { label: "Browse Suppliers", href: "/suppliers" }, { label: "All Categories", href: "/categories" }, { label: "Pricing", href: "/pricing" }, { label: "Buyer Benefits", href: "/benefits" }] },
    { title: "For Sellers", links: [{ label: "Supplier Benefits", href: "/supplier-benefits" }, { label: "Get Listed", href: "/get-listed" }, { label: "Add a Deal", href: "/add-deal" }, { label: "Seller FAQ", href: "/seller-faq" }] },
    { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Testimonials", href: "/testimonials" }, { label: "Affiliate Program", href: "/affiliate" }, { label: "Contact Us", href: "/contact" }, { label: "Blog", href: "/blog" }] },
    { title: "Support", links: [{ label: "Help Center", href: "/help" }, { label: "A-Z Index", href: "/a-z" }, { label: "Custom Sourcing", href: "/sourcing" }, { label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }] },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter subscription bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
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
            <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="flex-1 min-w-0 relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full h-[42px] pl-[17rem] pr-4 text-sm rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <span className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-red-600 text-white text-xs font-bold rounded-l-lg whitespace-nowrap" style={{ fontFamily: "inherit" }}>
                  25% discount code upon registration
                </span>
              </div>
              <div className="w-full sm:w-52">
                <NewsletterCategorySelect />
              </div>
              <button className="px-6 h-[42px] bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <WholesaleUpLogo />
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
            </div>
          ))}
        </div>
      </div>

      {/* Payment methods */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
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
      <div>
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">&copy; 2004 - {new Date().getFullYear()} WholesaleUp. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-xs text-slate-500 hover:text-slate-300">Privacy</a>
            <a href="/terms" className="text-xs text-slate-500 hover:text-slate-300">Terms</a>
            <a href="/cookies" className="text-xs text-slate-500 hover:text-slate-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   APP LAYOUT — Wraps all pages
   Sidebar (collapsible, sitewide) + Header + Content
   ═══════════════════════════════════════════════════ */
export default function AppLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Listen for demo auth toggle from other components
  useEffect(() => {
    const handler = (e) => setIsAuthenticated(e.detail.loggedIn);
    window.addEventListener("demo-auth", handler);
    return () => window.removeEventListener("demo-auth", handler);
  }, []);

  // Broadcast auth changes so child pages can stay in sync
  const setGuest = () => { setIsAuthenticated(false); setIsPremium(false); window.dispatchEvent(new CustomEvent("demo-auth", { detail: { loggedIn: false, premium: false } })); };
  const setFree = () => { setIsAuthenticated(true); setIsPremium(false); window.dispatchEvent(new CustomEvent("demo-auth", { detail: { loggedIn: true, premium: false } })); };
  const setPremiumUser = () => { setIsAuthenticated(true); setIsPremium(true); window.dispatchEvent(new CustomEvent("demo-auth", { detail: { loggedIn: true, premium: true } })); };

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        user={MOCK_USER}
        onLogin={() => setIsAuthenticated(true)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Expand button when collapsed */}
      {sidebarCollapsed && <SidebarExpandButton onClick={() => setSidebarCollapsed(false)} />}

      {/* Right side: Header + Content + Footer */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          isAuthenticated={isAuthenticated}
          isPremium={isPremium}
          user={MOCK_USER}
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

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>

    </div>
  );
}
