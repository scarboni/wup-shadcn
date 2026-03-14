---
name: deal-card
description: |
  **WholesaleUp Deal Card Patterns**: Single source of truth for all deal/product card components across the site — trending cards, detailed cards, list cards, related deal cards, supplier deal cards, homepage hot offer cards, frequently bought together cards, and any future card variant. Covers the required visual structure, click-to-navigate pattern, hide/favourite Guest gating, image area conventions, pricing display, markup/profit badges, tag placement, action button gating, and card wrapper rules. MANDATORY: Reference this skill whenever creating, editing, or reviewing any deal or product card component anywhere in the project. MANDATORY TRIGGERS: deal card, DealCard, TrendingDealCard, DetailedDealCard, ListDealCard, RelatedDealCard, SupplierDealCard, HotOfferCard, deal listing, deal grid, deal carousel, deal tile, product card, new deal card, homepage deal, frequently bought together
---

# WholesaleUp Deal Card Patterns

This skill defines the canonical patterns for ALL deal/product card components across the WholesaleUp platform. Any new deal card must follow these rules. Any edit to an existing card should be verified against this checklist.

## Card Variants & Locations

| Variant | File | Used On |
|---------|------|---------|
| `TrendingDealCard` | `deal-cards.jsx` | /deals (trending section) |
| `DetailedDealCard` | `deal-cards.jsx` | /deals (main grid), /supplier-deals |
| `ListDealCard` | `deal-cards.jsx` | /deals (list toggle), /supplier-deals |
| `RelatedDealCard` | `related-deals.jsx` | /deal (bottom carousel) |
| `SupplierDealCard` | `supplier.jsx` | /supplier (deals carousel) |
| `HotOfferCard` | `homepage.jsx` | / (homepage hot offers) |
| `FrequentlyBoughtTogether` | `related-deals.jsx` | /deal (bundle section) |
| `GatedDealCard` | `gating.jsx` | /gating (demo) |

---

## 1. Card Wrapper — Click-to-Navigate

Every deal card wrapper `<div>` must have:

```jsx
<div className="... cursor-pointer"
  onClick={(e) => {
    if (!e.target.closest("a, button, input, [role=button]"))
      window.location.href = "/deal";
  }}
>
```

**Rules:**
- `cursor-pointer` on the wrapper — users see hand cursor everywhere
- Click handler fires on ANY element that isn't a link, button, input, or `[role=button]`
- Do NOT use `e.target.tagName === "DIV"` — that's too restrictive
- Labels, badges, text, images, icons all trigger navigation when clicked
- Only actual interactive elements (links, buttons, inputs) are excluded

---

## 2. Image Area Conventions

### Tag Placement
- **Top-left:** Product tags (NEW, DROPSHIP, etc.) — stacked vertically
- **Top-right:** Markup/profit badge (e.g. "+201.8%") in emerald green
- **Bottom-left:** Price badge (with optional discount ribbon above)
- **Bottom-right:** Hide + Favourite buttons (hover-only)

### Image Hover
```jsx
className="object-cover group-hover:scale-105 transition-transform duration-300"
```

### No Image Fallback
Use `<NoImagePlaceholder />` — a Package icon centered on slate-50 background.

---

## 3. Price Badge

```jsx
<div className="absolute bottom-2 left-2 flex flex-col items-start">
  {deal.discount && (
    <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">
      {deal.discount} DISCOUNT
    </div>
  )}
  <div className={`${deal.discount ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
    <span className={`text-base font-extrabold ${deal.discount ? "text-white" : "text-orange-600"}`}>
      £{deal.price}
    </span>
    <span className={`text-[10px] ml-1 ${deal.discount ? "text-white/80" : "text-slate-400"}`}>
      ex.VAT
    </span>
  </div>
</div>
```

When a discount exists, price has a red background with the discount ribbon above.

---

## 4. Markup Badge

```jsx
<div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
  <TrendingUp size={10} /> {deal.markup}
</div>
```

---

## 5. Product Tags (Top-Left)

```jsx
{deal.tags?.map((tag) => (
  tag === "Dropship" ? (
    <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm flex items-center gap-1">
      <Truck size={10} /> DROPSHIP
    </span>
  ) : (
    <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
      NEW
    </span>
  )
))}
```

---

## 6. Hide / Favourite Buttons — Guest Gating

```jsx
<button onClick={(e) => {
  e.preventDefault(); e.stopPropagation();
  isLoggedIn ? setHidden(true) : openRegisterModal();
}}>
  <EyeOff size={12} className="text-slate-400" />
</button>
<button onClick={(e) => {
  e.preventDefault(); e.stopPropagation();
  isLoggedIn ? setFaved(!faved) : openRegisterModal();
}}>
  <Heart size={12} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
</button>
```

Where:
```jsx
const openRegisterModal = () => window.dispatchEvent(
  new CustomEvent("open-auth-modal", { detail: { tab: "register" } })
);
```

**Rules:**
- Always include `e.preventDefault()` and `e.stopPropagation()` to prevent card navigation
- Guest users clicking hide or favourite ALWAYS triggers the register modal
- Never allow hide/fav without `isLoggedIn` check
- Buttons appear on hover via `opacity-0 group-hover:opacity-100`
- If faved, buttons stay visible (`faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"`)

---

## 7. Hidden Overlay

```jsx
{hidden && (
  <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
    <EyeOff size={28} className="text-slate-300" />
    <p className="text-sm font-semibold text-slate-500">Deal hidden</p>
    <button onClick={() => setHidden(false)}
      className="px-4 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5">
      <Eye size={12} /> Unhide Deal
    </button>
  </div>
)}
```

---

## 8. Title

```jsx
<h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">
  {deal.title}
</h3>
```

Always `line-clamp-2` for consistent card heights.

---

## 9. First Order Promo

```jsx
{deal.firstOrderPromo && (
  <div className="mb-1.5">
    <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">
      {deal.firstOrderPromo}
    </span>
  </div>
)}
```

---

## 10. Pricing Table (RRP / Amazon / eBay)

Used in TrendingDealCard, DetailedDealCard, RelatedDealCard:

```jsx
<div className="border-t border-slate-100">
  {/* Column headers */}
  <div className="flex items-center px-1 pt-2 pb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
    <span className="w-10 shrink-0" />
    <span className="flex-1">Price</span>
    <span>Profit</span>
  </div>
  {/* RRP row */}
  <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
    <span className="text-[13px] font-bold text-slate-400 w-10 shrink-0">RRP</span>
    <span className="flex-1 text-[13px] text-slate-500 tabular-nums">£{deal.rrp}</span>
    <span className="text-[13px] text-emerald-600 font-bold tabular-nums">£{deal.profit}</span>
  </div>
  {/* Amazon row — clickable */}
  {/* eBay row — clickable */}
</div>
```

Amazon and eBay rows open external links in new tabs via `window.open()`.

---

## 11. Action Button — Three-Tier Gating

```
canContact = canViewSupplier || (isLoggedIn && deal.isSupplierPro)

canContact → Active "Send Enquiry" button (bg-[#1e5299] blue)
isLoggedIn (not canContact) → Link to /pricing with Lock icon (bg-orange-500)
Guest → openRegisterModal() or link to /register with Lock + "Join Now!"
```

The enquiry button uses the blue `#1e5299` colour when active (matching supplier cards).

---

## 12. Card Styles by Variant

### TrendingDealCard
- Compact (w-[220px])
- No border initially, shadow-sm
- Smaller icons (size={10})

### DetailedDealCard
- Full-width grid card
- `onMouseEnter`/`onMouseLeave` for hovered state
- Larger icons (size={14})

### ListDealCard
- Horizontal layout (flex-row on sm+)
- Image on left (w-[140px] sm:w-[180px])
- Content on right
- Hide/fav buttons stacked vertically to the right of content

### RelatedDealCard
- Already wrapped in `<a href="/deal">` for the card body
- Action button is OUTSIDE the link wrapper
- Uses `e.preventDefault()` + `e.stopPropagation()` on hide/fav

### SupplierDealCard
- Similar to TrendingDealCard but in supplier page context
- Uses `isLoggedIn` prop, not context

---

## Required Imports Checklist

```jsx
import { TrendingUp, Truck, Heart, EyeOff, Eye, Lock, MessageSquare, ExternalLink } from "lucide-react";
import { NoImagePlaceholder } from "@/components/deal/utils"; // or local
import StarRating from "@/components/shared/star-rating"; // if showing supplier rating
```

---

## Quick Reference: Data Fields Used

```
deal.title              — string, product title
deal.img                — string URL, product image
deal.price              — number, wholesale price
deal.rrp                — number, recommended retail price
deal.profit             — number, calculated profit
deal.markup             — string, e.g. "201.8%"
deal.discount           — string, e.g. "-35%"
deal.tags               — string[], e.g. ["Dropship", "New"]
deal.firstOrderPromo    — string, e.g. "10% OFF FIRST ORDER"
deal.isSupplierPro      — boolean, affects contact gating
```

---

## Common Mistakes to Avoid

1. **Using `tagName === "DIV"` in click handler** — too restrictive, labels show cursor but don't navigate
2. **Forgetting Guest gating on hide/fav** — Guest clicks MUST trigger register modal
3. **Missing `e.stopPropagation()`** — hide/fav buttons inside `<a>` tags need it to prevent navigation
4. **Hardcoding "Join Now" as `<a href="/register">`** — should use `openRegisterModal()` for the modal experience
5. **Not including `cursor-pointer`** — card looks non-interactive without it
