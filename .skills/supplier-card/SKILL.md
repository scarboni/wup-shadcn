---
name: supplier-card
description: |
  **WholesaleUp Supplier Card Patterns**: Single source of truth for all supplier card components across the site — list cards, grid cards, homepage carousel cards, compact sidebar panels, and any future card variant. Covers the required visual structure, gating rules, click-to-navigate pattern, hide/favourite Guest gating, Pro badge + blue border, Verified Supplier badge, star rating linking, supply model tags, category tag limits, description formatting, name visibility, and button tier gating. MANDATORY: Reference this skill whenever creating, editing, or reviewing any supplier card component anywhere in the project. MANDATORY TRIGGERS: supplier card, SupplierCard, SupplierGridCard, FeaturedSuppliers, CompactSupplierPanel, supplier list, supplier grid, supplier carousel, supplier tile, supplier listing card, new supplier card, homepage supplier, supplier-deals sidebar
---

# WholesaleUp Supplier Card Patterns

This skill defines the canonical patterns for ALL supplier card components across the WholesaleUp platform. Any new supplier card must follow these rules. Any edit to an existing card should be verified against this checklist.

## Card Variants & Locations

| Variant | File | Used On |
|---------|------|---------|
| `SupplierCard` (list) | `suppliers.jsx` | /suppliers |
| `SupplierGridCard` | `suppliers.jsx` | /suppliers (grid toggle) |
| `FeaturedSuppliers` inline cards | `homepage.jsx` | / (homepage) |
| `CompactSupplierPanel` | `supplier-deals.jsx` | /supplier-deals sidebar |
| `SupplierSidebarCard` | `suppliers.jsx` | /suppliers expanded sidebar |
| `SupplierMetaStats` | `supplier-meta-stats.jsx` | /deal sidebar, /supplier |

---

## 1. Card Wrapper — Click-to-Navigate + Pro Border

Every supplier card wrapper `<div>` must have:

```jsx
<div className={`... cursor-pointer ${
  supplier.isSupplierPro
    ? "border-l-[3px] border-l-[#1e5299] border border-[#1e5299]/30 hover:border-[#1e5299]/50"
    : "border border-slate-200 hover:border-orange-200"
}`}
  onClick={(e) => {
    if (!e.target.closest("a, button, input, [role=button]"))
      window.location.href = "/supplier";
  }}
>
```

**Rules:**
- `cursor-pointer` on the wrapper — users see hand cursor everywhere
- Click handler fires on ANY element that isn't a link, button, input, or `[role=button]`
- Do NOT use `e.target.tagName === "DIV"` — that's too restrictive and causes labels to show hand cursor but not navigate
- Supplier Pro cards get a **left blue border** (`border-l-[3px] border-l-[#1e5299]`) plus blue-tinted borders
- Non-Pro cards get standard `border-slate-200` with orange hover

---

## 2. PRO Badge (Supplier Pro only)

```jsx
{supplier.isSupplierPro && (
  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-[#1e5299] text-white text-[10px] font-bold rounded-md shadow-sm">
    <Crown size={10} className="shrink-0" />
    PRO
  </div>
)}
```

- Position: absolute top-right
- Import: `Crown` from `lucide-react`

---

## 3. Verified Supplier Badge

Placed **above** the supplier name, not inline with meta:

```jsx
{supplier.isVerified && (
  <div className="mb-1.5">
    <VerifiedBadge size={8} className="text-[9px] px-1.5 py-px" />
  </div>
)}
```

- Import: `VerifiedBadge` from `@/components/shared/verified-badge`
- Label text is "Verified Supplier" (set inside the component)
- Never use "Verified" alone

---

## 4. Supplier Name — Visibility Gating

```jsx
const canViewName = isLoggedIn && (supplier.isSupplierPro || isPremium);
const displayName = canViewName ? supplier.companyName : getAnonymousName(supplier);
```

The anonymous name pattern: `"{First Category} {Supplier Type1} & {Type2}"`
Example: "Trainers & Sportswear Wholesaler & Distributor"

Name renders as a link to `/supplier`:
```jsx
<a href="/supplier" className="group/name">
  <h3 className="text-lg font-bold text-slate-900 group-hover/name:text-orange-600 transition-colors">
    {displayName}
  </h3>
</a>
```

---

## 5. Supplier Type Tags

Below the name, above the meta row:

```jsx
{supplier.supplierType?.map((st) => (
  <span key={st} className="px-1.5 py-px text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
    {SUPPLIER_TYPE_LABELS[st] || st}
  </span>
))}
```

Uses `SUPPLIER_TYPE_LABELS` constant.

---

## 6. Meta Row — Country · Years · Star Rating

Order is **always**: Country flag+name · X yrs · Star rating

```jsx
<div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
  <span className="flex items-center gap-1.5 text-sm text-slate-500">
    <FlagImg code={supplier.address.countryCode} size={18} />
    {supplier.address.country}
  </span>
  <span className="text-slate-300">&middot;</span>
  <span className="flex items-center gap-1 text-xs text-slate-400">
    <Calendar size={12} />
    {supplier.yearsActive} yrs
  </span>
  <span className="text-slate-300">&middot;</span>
  <a href="/supplier?tab=reviews" className="hover:opacity-80 transition-opacity">
    <StarRating rating={supplier.rating} size={13} showValue />
  </a>
</div>
```

**Critical:** Star rating MUST be wrapped in `<a href="/supplier?tab=reviews">` — it links to the Reviews tab on the supplier profile page. Never render StarRating without this link in supplier cards.

Opening hours are **NOT** shown in cards (only on the supplier profile page).

---

## 7. Supply Model Tags

Below the meta row:

```jsx
{supplier.supplyModels?.length > 0 && (
  <div className="flex flex-wrap gap-1 mt-1.5">
    {supplier.supplyModels.map((f) => (
      <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
        <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
        {SUPPLY_MODEL_LABELS[f] || f}
      </span>
    ))}
  </div>
)}
```

Labels: Wholesale, Dropshipping, Liquidation, White Label, Private Label, Job Lots.

---

## 8. Category Tags — Limited Display

Show max N categories (4 in list view, 2 in carousel/compact) with "+X more" overflow:

```jsx
{supplier.categories.slice(0, maxCategories).map((cat) => (
  <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`}
    className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
    {cat}
  </a>
))}
{supplier.categories.length > maxCategories && (
  <span className="px-3.5 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
    +{supplier.categories.length - maxCategories} more
  </span>
)}
```

---

## 9. Description — Three Paragraphs

```jsx
<div className="text-sm text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-line"
  style={{ maxHeight: "5.6em" }}>
  {supplier.companyDescription}
  {supplier.productsOffered && (
    <p className="mt-2">{supplier.productsOffered}</p>
  )}
  {supplier.brandsDistributed?.length > 0 && (
    <p className="mt-2">{supplier.brandsDistributed.join(", ")}</p>
  )}
</div>
```

---

## 10. Hide / Favourite Buttons — Guest Gating

```jsx
<button onClick={() => isLoggedIn ? setHidden(true) : openRegisterModal()}>
  <EyeOff size={14} className="text-slate-400" />
</button>
<button onClick={() => isLoggedIn ? setFaved(!faved) : openRegisterModal()}>
  <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
</button>
```

Where:
```jsx
const openRegisterModal = () => window.dispatchEvent(
  new CustomEvent("open-auth-modal", { detail: { tab: "register" } })
);
```

**Rule:** Guest users clicking hide or favourite ALWAYS triggers the register modal. Never allow hide/fav without `isLoggedIn` check.

---

## 11. Action Buttons — Three-Tier Gating

```
canContact (isPremium || (isLoggedIn && supplier.isSupplierPro))
  → Active button (onClick handler)
  → "Send Enquiry" button uses bg-[#1e5299] (blue)

isLoggedIn (but not canContact)
  → Link to /pricing with Lock icon

Guest (!isLoggedIn)
  → openRegisterModal() button
```

Both "Call Now" and "Send Enquiry" follow this 3-tier pattern.

---

## 12. Contact Footer — Premium Gating

Contact details (phone, email, website, address) are:
- **Visible** to Premium/Premium+ users
- **Scrambled** for all others using `scrambleText()` with a blur overlay
- Overlay shows "Upgrade to see supplier details" (logged-in) or "Join to access supplier details" (guest)

---

## Required Imports Checklist

When creating any supplier card, ensure these are imported:

```jsx
import { Crown, CheckCircle2, Calendar, EyeOff, Heart, Eye, Phone, MessageSquare, Lock, Rocket } from "lucide-react";
import StarRating from "@/components/shared/star-rating";
import VerifiedBadge from "@/components/shared/verified-badge";
import { LockedLogoPlaceholder } from "@/components/shared/logo";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
```

---

## Quick Reference: Data Fields Used

```
supplier.isSupplierPro     — boolean, controls Pro badge + blue border
supplier.isVerified        — boolean, controls Verified Supplier badge
supplier.companyName       — string, gated by canViewName
supplier.companyLogo       — string URL, gated by canViewBranding
supplier.supplierType      — string[], e.g. ["wholesaler", "distributor"]
supplier.supplyModels      — string[], e.g. ["wholesale", "dropshipping"]
supplier.categories        — string[], product categories
supplier.rating            — number 0-5
supplier.yearsActive       — number
supplier.address.country   — string
supplier.address.countryCode — string ISO
supplier.companyDescription — string
supplier.productsOffered   — string
supplier.brandsDistributed — string[]
```
