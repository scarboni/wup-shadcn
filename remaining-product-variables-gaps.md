# Remaining Product Variable Gaps (After Supplier Profile Inheritance)

**Date:** March 8, 2026
**Context:** Cross-referenced competitor variables against both our `/deal` page AND the supplier profile form fields that deals can inherit.

---

## Supplier Profile Fields That Already Cover Competitor Gaps

The following "missing" variables from the competitor comparison are **already captured in the supplier profile** and simply need to be surfaced on the deal page:

| Competitor Gap | Supplier Profile Field | Status |
|---|---|---|
| Certification badges (CE, FCC, RoHS) | `certifications` — 20 options incl. CE, UKCA, FDA, RoHS, REACH, ISO-9001, ISO-14001, GMP, BRC, HACCP, Organic, Fair Trade, FSC, OEKO-TEX, GOTS, Halal, Kosher, BSCI, B-Corp | **Inherit & display as visual badges on deal page** |
| Return/refund policy | `returnPolicy` — free text field (required) | **Inherit & display in deal details section** |
| Lead time / production timeline | `leadTime` — enum: same-day, 1-2 days, 3-5 days, 1-2 weeks, 2-4 weeks, 4-8 weeks, 8+ weeks, made-to-order | **Inherit; can also compute estimated delivery date from this** |
| Sample / tester option | `sampleAvailability` — enum: free, paid, on-request, not-available | **Inherit & display as action button or badge** |
| Supplier minimum order value | `minimumOrderAmount` + `minimumOrderCurrency` | **Already inheritable** |
| Supplier product count / catalog size | `catalogueSize` — enum: under-50 to 20000+ | **Inherit & display in supplier sidebar** |
| Buy-now-pay-later | `paymentMethods` includes "bnpl" option | **Inherit & display with payment icons** |
| Promotional discount structure | `discountTiers` — array of {currency, minOrder, discount%} + `discountNotes` | **Inherit & display as volume incentive on deal page** |
| Customization / white-label availability | `supplyModels` includes white-label, private-label, dropshipping | **Inherit & display as capability badges** |
| Product quality tier | `productQualityTier` — budget, mid-range, premium, luxury | **Inherit & display as badge** |

**Action needed:** These are purely a front-end display task on `/deal` — no new data collection required, only pulling the supplier's profile data and rendering it.

---

## Truly Remaining Gaps (Not Covered by Supplier Profile)

These are variables that competitors have, our deal page lacks, AND the supplier profile doesn't capture. Organized by whether they need new **deal-level fields**, new **supplier-level fields**, or new **platform features**.

---

### A. New Deal-Level Fields Needed

These require new data input per deal (not inheritable from supplier profile).

| # | Variable | Found On | Priority | What It Is |
|---|----------|----------|----------|------------|
| 1 | **Structured product specifications** | Alibaba | 🔴 High | Key-value attribute table per product (e.g., Material: FR-4, Thickness: 4oz, Standard: IPC-A-610). Currently only freeform description text. Needs a repeatable key-value field on the deal creation form. |
| 2 | **Product variants / options** | Alibaba, Faire | 🔴 High | Selectable dropdowns per deal (Size, Color, Fragrance, Specification) that can affect pricing. Needs a variant system on deal creation: define option names + values + optional price overrides. |
| 3 | **Video media** | Alibaba, Faire | 🟡 Medium | Video uploads or YouTube/Vimeo embeds in the product image gallery. Currently images-only. Needs video support in the deal media upload. |
| 4 | **Packaging dimensions & weight** | Alibaba | 🟡 Medium | Per-deal: package size (L×W×H cm), gross weight (kg), selling units (single item / set / lot). Helps buyers calculate shipping. Needs 3-4 new fields on deal form. |
| 5 | **Ingredients / materials** | Faire | 🟢 Low | Structured field for material composition or ingredient list. Could be a simple text field or a tag-based input on the deal form. |
| 6 | **Product language** | Faire | 🟢 Low | Language of product packaging/labeling (e.g., English, French, multilingual). Relevant for cross-border wholesale. Single dropdown on deal form. |
| 7 | **Manufacturing country** | Faire | 🟢 Low | "Made in [Country]" — distinct from "Ships from" and supplier country. A single country dropdown on the deal form. |
| 8 | **Customization options with per-deal pricing** | Alibaba | 🟡 Medium | Deal-specific add-ons like "Custom packaging +$1/piece (min 100)", "Custom logo +$1/piece (min 300)". The supplier profile captures *capability* (white-label, private-label) but not per-deal pricing for customization. Needs a repeatable row: {option name, extra cost, cost unit, minimum qty}. |

---

### B. New Supplier-Level Fields Needed

These are supplier-wide data points not currently in the supplier profile form.

| # | Variable | Found On | Priority | What It Is |
|---|----------|----------|----------|------------|
| 9 | **On-time delivery rate** | Alibaba | 🟡 Medium | Percentage metric (e.g., 93.5%). Could be platform-computed from order data or self-reported. |
| 10 | **Response time** | Alibaba | 🟡 Medium | Average response time to inquiries (e.g., ≤5h). Could be platform-computed from messaging data. |
| 11 | **Company revenue tier** | Alibaba | 🟢 Low | Revenue bracket (e.g., US$380,000+). Self-reported or verified. Sensitive — may not suit all suppliers. |
| 12 | **Year founded / established** | Alibaba | 🟡 Medium | Already in Prisma schema (`established`) and demo data (`yearsActive`) but NOT in the supplier profile form. Needs adding as a field. |
| 13 | **Company size (staff count)** | Alibaba | 🟢 Low | Number of employees. Simple numeric field. |
| 14 | **Facility size (floorspace)** | Alibaba | 🟢 Low | Warehouse/factory area in m². Niche — mainly relevant to manufacturers. |
| 15 | **Third-party verification** | Alibaba | 🟡 Medium | External verifier name (e.g., "Verified by SGS Group", "Verified by Bureau Veritas"). Goes beyond our binary `isVerified` flag. Needs: verifier name + verification date. |
| 16 | **Customization ability detail** | Alibaba | 🟢 Low | Specific capabilities: drawing-based, sample-based, full customization. The supplier profile has `supplyModels` but not this granularity. Could be an additional multi-select. |

---

### C. Platform Features Needed (No New Data Fields)

These are UX/system features, not data collection gaps.

| # | Feature | Found On | Priority | Description |
|---|---------|----------|----------|-------------|
| 17 | **Product reviews system** | Alibaba, Faire | 🔴 High | Buyer-submitted reviews per deal: star rating, text, photos/videos, verified purchase badge. Includes review breakdown scores (product quality, shipping, service) and topic tags. This is a whole subsystem — not just a field. |
| 18 | **Stock urgency label** | Faire | 🟡 Medium | Computed from `availableQuantity` — show "Only X left" in red when stock is below a threshold. Pure front-end logic, no new data needed. |
| 19 | **Bestseller badge** | Faire | 🟡 Medium | Computed from sales/view data — tag top-performing deals. Needs analytics tracking + badge logic. |
| 20 | **"New" badge** | Faire | 🟢 Low | Computed from `dateAdded` — show "New" for deals added within last 14-30 days. Pure front-end logic. |
| 21 | **Wishlist / Save for later** | Faire | 🟡 Medium | Heart icon per deal, saved to user account. Needs: wishlist data model, toggle UI, "My Wishlist" page. |
| 22 | **Share button** | Faire | 🟢 Low | Copy link / share to social. Simple UI addition with Web Share API. |
| 23 | **Frequently bought together** | Faire | 🟢 Low | Cross-sell carousel. Needs either manual linking or algorithmic recommendation based on order data. |
| 24 | **Estimated delivery date** | Faire | 🟡 Medium | Compute from supplier's `leadTime` + current date → "Estimated delivery Mar 15-22". Pure front-end computation from existing data. |
| 25 | **Order protection / buyer guarantee** | Alibaba | 🟡 Medium | Platform-level trust badge ("Money-back guarantee if order doesn't ship"). Policy decision + badge display. |

---

## Summary: What Actually Needs Building

### Just wire up supplier profile → deal page (no new data)
10 variables already captured. Only needs front-end rendering on the deal page.

### New deal-level fields (8 items)
Structured specs, variants, video, packaging dims, ingredients, product language, manufacturing country, customization pricing.

### New supplier profile fields (8 items)
Year established (already in schema), on-time delivery rate, response time, revenue tier, staff count, facility size, third-party verification, customization capabilities detail.

### Platform features (9 items)
Reviews system, urgency/bestseller/new badges, wishlist, share, cross-sell, computed delivery date, order protection.

---

## Recommended Build Order for /deal2

**Phase 1 — Quick wins (inherit from supplier profile):**
Display certifications as badges, show return policy, show sample availability, show lead time, show discount tiers, show quality tier badge, compute & show estimated delivery date, show "Only X left" urgency from existing `availableQuantity`.

**Phase 2 — New deal fields:**
Structured product specifications table, product variants/options system, video in gallery, packaging dimensions.

**Phase 3 — Platform features:**
Wishlist/save, "New"/"Bestseller" badges, share button.

**Phase 4 — Reviews system:**
Full buyer review subsystem (biggest build effort).

**Phase 5 — Enhanced supplier metrics:**
Add year established to profile form, response time tracking, on-time delivery computation, third-party verification.
