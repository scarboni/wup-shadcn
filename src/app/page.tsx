"use client";

import Link from "next/link";
import {
  Layout,
  SlidersHorizontal,
  Package,
  Building2,
  UserCog,
  CreditCard,
  Home,
  Shield,
  Tag,
  ArrowRight,
  Store,
  Grid3X3,
  MessageSquare,
  FileText,
  Lock,
  Cookie,
  Phone,
} from "lucide-react";

const PHASES = [
  {
    phase: 1,
    title: "Shell Layout",
    desc: "Sidebar, Header, CategoriesMegaMenu, SearchBar, UserDropdown, LoginDropdown, MobileNav, AccountSidebar, UpgradeModal, Footer",
    href: "/shell",
    icon: Layout,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    phase: 2,
    title: "Filters & Search",
    desc: "FilterSidebar (7 sections), SearchToolbar, ActiveFilterChips, Pagination, TrendingBanner — integrated into /deals & /suppliers",
    href: "/deals",
    icon: SlidersHorizontal,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    phase: 3,
    title: "Deal Cards",
    desc: "SimpleDealCard, DetailedDealCard, CompactDealRow, DealCarousel",
    href: "/deals",
    icon: Package,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    phase: 4,
    title: "Suppliers",
    desc: "SupplierCard, SupplierContactPanel, SupplierProfilePage",
    href: "/suppliers",
    icon: Building2,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    phase: 5,
    title: "Dashboard",
    desc: "AccountSidebar, UpgradeBanner, ValidationErrorBanner, AccountProfileForm",
    href: "/dashboard",
    icon: UserCog,
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-500",
  },
  {
    phase: 6,
    title: "Pricing Page",
    desc: "FlashSaleBanner, PricingHero, PeriodToggle, PricingCards, StatsSection, TestimonialsCarousel, FAQAccordion",
    href: "/pricing",
    icon: CreditCard,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    phase: 7,
    title: "Homepage Assembly",
    desc: "11 sections: Hero, Deals Carousel, Categories, Trust, Hot Offers, Suppliers, Countries, FAQ, Testimonials, Footer",
    href: "/homepage",
    icon: Home,
    color: "from-orange-700 to-indigo-700",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    phase: 8,
    title: "Gating Logic",
    desc: "BlurredContent, LockedSection, PremiumGate, UpgradeModal, CTASwitch + interactive tier toggle demo",
    href: "/gating",
    icon: Shield,
    color: "from-slate-700 to-slate-900",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    phase: 9,
    title: "Single Deal",
    desc: "ImageGallery, PricingPanel, PlatformComparison, SupplierSidebar, RelatedDeals, Tags, DealDetails",
    href: "/deal",
    icon: Tag,
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    iconColor: "text-teal-500",
  },
  {
    phase: 10,
    title: "Supplier Profile",
    desc: "SupplierHero, VerifiedBadge, AboutSection, CategoryTags, DealGrid, ContactSidebar, CtaBanner",
    href: "/supplier",
    icon: Store,
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    phase: 11,
    title: "Categories",
    desc: "CategoryGrid, SubcategoryExpander, SearchFilter, CategoryStats, CtaBanner",
    href: "/categories",
    icon: Grid3X3,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    phase: 12,
    title: "Testimonials",
    desc: "TestimonialCards, StarRatings, FilterByRating, PaginatedGrid",
    href: "/testimonials",
    icon: MessageSquare,
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    phase: 13,
    title: "Terms of Service",
    desc: "RetractableTOC, StickyNav, SearchFilter, ScrollTracking, CtaBanner, BackToTop",
    href: "/terms",
    icon: FileText,
    color: "from-slate-500 to-slate-700",
    bgColor: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    phase: 14,
    title: "Privacy Policy",
    desc: "RetractableTOC, GDPRBanner, StickyNav, SearchFilter, ScrollTracking, BackToTop",
    href: "/privacy",
    icon: Lock,
    color: "from-emerald-600 to-green-700",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    phase: 15,
    title: "Cookies Policy",
    desc: "RetractableTOC, StickyNav, SearchFilter, ScrollTracking, CtaBanner, BackToTop",
    href: "/cookies",
    icon: Cookie,
    color: "from-amber-600 to-yellow-700",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    phase: 16,
    title: "Contact & FAQs",
    desc: "FAQAccordion (General/Buyer/Supplier), DynamicContactForm, QueryTypeFields, Validation, CopyButton, CtaBanner",
    href: "/contact",
    icon: Phone,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
];

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full text-orange-300 text-xs font-semibold mb-6 backdrop-blur-sm">
            <Tag size={13} />
            Component Library — 16 Phases
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            wholesale<span className="text-orange-400">up</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A complete Next.js + Tailwind + shadcn/ui component library for building
            a wholesale & dropship marketplace. 16 phases, 60+ components, 7 shared components, full
            free/premium gating, shared components, and legal pages.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2 text-orange-300">
              <div className="w-2 h-2 rounded-full bg-orange-400" /> Next.js 15
            </div>
            <div className="flex items-center gap-2 text-orange-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400" /> Tailwind CSS
            </div>
            <div className="flex items-center gap-2 text-orange-300">
              <div className="w-2 h-2 rounded-full bg-violet-400" /> shadcn/ui
            </div>
            <div className="flex items-center gap-2 text-orange-300">
              <div className="w-2 h-2 rounded-full bg-amber-400" /> TypeScript
            </div>
          </div>
        </div>
      </div>

      {/* Phase Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PHASES.map((phase) => (
            <Link
              key={phase.phase}
              href={phase.href}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-orange-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${phase.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <phase.icon size={20} className={phase.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r ${phase.color} rounded`}
                    >
                      Phase {phase.phase}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-orange-600 transition-colors">
                      {phase.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {phase.desc}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0 mt-1"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-extrabold text-slate-800 mb-4">
            Project Structure
          </h2>
          <pre className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-4 overflow-x-auto font-mono">{`wup-shadcn/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (AppLayout wrapper)
│   │   ├── page.tsx                # This index page
│   │   ├── globals.css             # Tailwind + fonts
│   │   ├── shell/page.tsx          # Phase 1
│   │   ├── filters/page.tsx        # Phase 2
│   │   ├── deals/page.tsx          # Phase 3
│   │   ├── suppliers/page.tsx      # Phase 4
│   │   ├── dashboard/page.tsx      # Phase 5
│   │   ├── pricing/page.tsx        # Phase 6
│   │   ├── homepage/page.tsx       # Phase 7
│   │   ├── gating/page.tsx         # Phase 8
│   │   ├── deal/page.tsx           # Phase 9
│   │   ├── supplier-profile/page.tsx # DEPRECATED → redirects to /supplier
│   │   ├── categories/page.tsx     # Phase 11
│   │   ├── testimonials/page.tsx   # Phase 12
│   │   ├── terms/page.tsx          # Phase 13
│   │   ├── privacy/page.tsx        # Phase 14
│   │   └── cookies/page.tsx        # Phase 15
│   ├── components/
│   │   ├── phases/                 # All phase components
│   │   └── shared/                 # Shared components (7 files)
│   │       ├── app-layout.jsx      # Main layout (Header, Footer, Sidebar)
│   │       ├── cta-banner.jsx      # "Get Started" CTA banner
│   │       ├── back-to-top.jsx     # Back to top button
│   │       ├── verified-badge.jsx  # Verified Supplier badge
│   │       ├── star-rating.jsx     # 5-star rating display
│   │       ├── contact-modal.jsx   # Contact Supplier modal
│   │       └── breadcrumb.jsx      # Breadcrumb navigation
│   └── lib/
│       └── utils.ts                # cn() helper
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js`}</pre>
        </div>
      </div>
    </div>
  );
}
