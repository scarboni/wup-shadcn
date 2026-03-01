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
} from "lucide-react";

const PHASES = [
  {
    phase: 1,
    title: "Shell Layout",
    desc: "TopBar, Navbar, UserDropdownMenu, AccountSidebar, UpgradeModal, Footer",
    href: "/shell",
    icon: Layout,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    phase: 2,
    title: "Filters & Search",
    desc: "FilterSidebar (7 sections), SearchToolbar, ActiveFilterChips, Pagination, TrendingBanner",
    href: "/filters",
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
            Component Library — 8 Phases
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Wholesale<span className="text-orange-400">Up</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A complete Next.js + Tailwind + shadcn/ui component library for building
            a wholesale & dropship marketplace. 8 phases, 40+ components, full
            free/premium gating.
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
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # This index page
│   │   ├── globals.css         # Tailwind + fonts
│   │   ├── shell/page.tsx      # Phase 1
│   │   ├── filters/page.tsx    # Phase 2
│   │   ├── deals/page.tsx      # Phase 3
│   │   ├── suppliers/page.tsx  # Phase 4
│   │   ├── dashboard/page.tsx  # Phase 5
│   │   ├── pricing/page.tsx    # Phase 6
│   │   ├── homepage/page.tsx   # Phase 7
│   │   └── gating/page.tsx     # Phase 8
│   ├── components/
│   │   └── phases/             # All phase components
│   └── lib/
│       └── utils.ts            # cn() helper
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js`}</pre>
        </div>
      </div>
    </div>
  );
}
