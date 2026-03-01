# WholesaleUp — Component Library

A complete **Next.js 15 + Tailwind CSS + shadcn/ui** component library for building a wholesale & dropship marketplace. 8 phases, 40+ components, full free/premium gating system.

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/wup-shadcn.git
cd wup-shadcn

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the component index.

## Routes

| Route | Phase | Components |
|-------|-------|------------|
| `/` | Index | Phase directory with links to all demos |
| `/shell` | Phase 1 | TopBar, Navbar, UserDropdownMenu, AccountSidebar, Footer |
| `/filters` | Phase 2 | FilterSidebar (7 sections), SearchToolbar, ActiveFilterChips, Pagination |
| `/deals` | Phase 3 | SimpleDealCard, DetailedDealCard, CompactDealRow, DealCarousel |
| `/suppliers` | Phase 4 | SupplierCard, SupplierContactPanel, SupplierProfilePage |
| `/dashboard` | Phase 5 | AccountSidebar, UpgradeBanner, AccountProfileForm |
| `/pricing` | Phase 6 | FlashSaleBanner, PricingCards, PeriodToggle, FAQAccordion |
| `/homepage` | Phase 7 | 11 assembled sections — Hero, Carousels, Trust, FAQ, Footer |
| `/gating` | Phase 8 | BlurredContent, LockedSection, PremiumGate, UpgradeModal, CTASwitch |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Components:** shadcn/ui patterns
- **Icons:** Lucide React
- **Fonts:** DM Sans + Outfit (Google Fonts)
- **Language:** TypeScript + JSX

## Project Structure

```
wup-shadcn/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Index — links to all phases
│   │   ├── globals.css             # Tailwind + fonts + utilities
│   │   ├── shell/page.tsx          # Phase 1 route
│   │   ├── filters/page.tsx        # Phase 2 route
│   │   ├── deals/page.tsx          # Phase 3 route
│   │   ├── suppliers/page.tsx      # Phase 4 route
│   │   ├── dashboard/page.tsx      # Phase 5 route
│   │   ├── pricing/page.tsx        # Phase 6 route
│   │   ├── homepage/page.tsx       # Phase 7 route
│   │   └── gating/page.tsx         # Phase 8 route
│   ├── components/
│   │   └── phases/                 # All 8 phase component files
│   │       ├── shell.jsx
│   │       ├── filters.jsx
│   │       ├── deal-cards.jsx
│   │       ├── suppliers.jsx
│   │       ├── dashboard.jsx
│   │       ├── pricing.jsx
│   │       ├── homepage.jsx
│   │       └── gating.jsx
│   └── lib/
│       └── utils.ts                # cn() helper
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── postcss.config.js
├── next.config.js
└── README.md
```

## Gating System (Phase 8)

Every phase demo includes a **tier toggle** (Guest / Free / Premium) to preview how the UI adapts:

| Component | Purpose |
|-----------|---------|
| `BlurredContent` | Inline CSS blur on sensitive text (phone, email, address) |
| `LockedSection` | 3 variants: `inline`, `overlay`, `replace` |
| `PremiumGate` | Page-level wrapper with floating upgrade banner |
| `UpgradeModal` | Full-screen upsell overlay |
| `CTASwitch` | Button that adapts text + style per tier |

## Design Tokens

| Token | Value |
|-------|-------|
| Primary gradient | `from-sky-500 to-blue-600` |
| Dark hero | `from-slate-900 to-blue-900` |
| Card radius | `rounded-xl` |
| Font stack | `'DM Sans', 'Outfit', sans-serif` |

## Push to GitHub

```bash
cd wup-shadcn
git init
git add .
git commit -m "feat: WholesaleUp component library — 8 phases"
git remote add origin https://github.com/YOUR_USERNAME/wup-shadcn.git
git branch -M main
git push -u origin main
```

## License

Private — WholesaleUp marketplace project.
