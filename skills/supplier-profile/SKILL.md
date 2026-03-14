---
name: supplier-profile
description: "**WholesaleUp Supplier Profile System**: Reference this skill whenever working on supplier profile forms, the public supplier profile page, supplier sidebar on deal pages, supplier visibility gates, or supplier-to-deal data inheritance. Covers the four-tab form architecture, 35+ field definitions with validation, all reference data arrays, visibility gating by account tier, data inheritance patterns, and component structure. MANDATORY TRIGGERS: supplier profile, supplier form, supplier sidebar, supplier data, supplier type, buyer types served, payment methods, delivery methods, supply models, certifications, canViewSupplier, canViewBranding, supplier gating, supplier contact, business hours, company logo visibility, supplier-to-deal inheritance"
---

# WholesaleUp Supplier Profile System

Canonical reference for the supplier profile ecosystem. Consult before creating, editing, or connecting any component that touches supplier data.

Last updated: 2026-03-13

---

## 1. Architecture Overview

The supplier profile system spans four files, each with a distinct role:

| File | Purpose | Route |
|------|---------|-------|
| `supplier-profile-form.jsx` | Supplier-facing edit form (dashboard) | `/dashboard/supplier-profile` |
| `supplier-profile.jsx` | Public-facing read-only profile page | `/supplier-profile` |
| `supplier-sidebar.jsx` | Supplier contact card on deal pages | `/deal-variables` (right panel) |
| `product-tabs.jsx` | Deal content tabs showing inherited supplier data | `/deal-variables` (main content) |

Data flows one direction: **form → database → profile page / deal sidebar / product tabs**. The form is the single source of truth for all supplier-level data.

---

## 2. Form Tab Structure

The form uses four tabs, each grouping related fields:

| Tab ID | Label | Short Label | Icon | Required Fields | Optional Fields |
|--------|-------|-------------|------|----------------|----------------|
| `business-profile` | Business Profile | Business | Building2 | supplierType, buyerTypesServed, companyDescription, supplyModels | customersServed, companyLogo |
| `products-supply` | Products & Supply | Products | Package | productsOffered, productCategories | brandsDistributed, productQualityTier, certifications, customizationAbility, sampleAvailability, catalogueSize |
| `orders-payments` | Orders & Payments | Orders | CreditCard | minimumOrderAmount, paymentMethods, returnPolicy | preferredCurrency, paymentTerms, defaultDepositPercentage, defaultDepositTerms, defaultInvoiceType, sanitizedInvoice, defaultTaxClass, discountTiers, discountNotes |
| `shipping-reach` | Shipping & Reach | Shipping | Globe | deliveryMethods, countriesServed, companyWebsite | leadTime, defaultIncoterms, excludedCountries, facilitySize, facilitySizeUnit, socialFacebook, socialInstagram, socialLinkedin, businessHours |

---

## 3. Field Definitions & Validation

### 3.1 Required Fields (12 total)

| Field | Label | Type | Validation |
|-------|-------|------|-----------|
| `supplierType` | Supplier Type | MultiSelect | Array ≥ 1 |
| `buyerTypesServed` | Buyer Types Served | MultiSelect | Array ≥ 1 |
| `companyDescription` | Describe Your Wholesale Business | Textarea | Required, min 20 chars |
| `supplyModels` | How You Supply Products | MultiSelect | Array ≥ 1 |
| `productsOffered` | Product Types & Categories You Supply | Textarea | Required, min 10 chars |
| `productCategories` | Product Categories | CategorySelector | Array ≥ 1 |
| `minimumOrderAmount` | Minimum Order Value | CurrencyAmountInput | Required, valid number |
| `paymentMethods` | Payment Methods | MultiSelect | Array ≥ 1 |
| `returnPolicy` | Return Policy | Textarea | Required, min 10 chars |
| `deliveryMethods` | Delivery Methods | MultiSelect | Array ≥ 1 |
| `countriesServed` | Countries Served | MultiSelect (flags) | Array ≥ 1 |
| `companyWebsite` | Company Website | FloatingField | Required, URL regex |

### 3.2 Conditionally Validated Fields

| Field | Condition | Validation |
|-------|-----------|-----------|
| `facilitySizeUnit` | Required when `facilitySize` has a value | Must select a unit |
| `defaultDepositPercentage` | Validated when provided | 0–100 range |
| `excludedCountries` | Warning when overlaps `countriesServed` | Shows overlap count |
| `socialFacebook/Instagram/LinkedIn` | Validated when non-empty | URL regex |
| `discountTiers` | When tiers exist | Each tier must have both minOrder > 0 and discount 0–100 |

### 3.3 URL Validation Pattern

```javascript
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i;
```

---

## 4. Reference Data Arrays

These arrays define the dropdown/select options. Values are shared across supplier and buyer profiles for cross-matching. The `value` field is the canonical slug stored in the database.

### Supplier Types (12 options)
Ordered: production → brand → distribution → fulfillment → niche.
Values: `manufacturer`, `brand-owner`, `private-label`, `wholesaler`, `distributor`, `importer`, `exporter`, `trading-company`, `liquidator`, `dropshipper`, `sourcing-agent`, `artisan-maker`

### Buyer Types Served (18 options)
Matches `BUYER_TYPES` in buyer-profile.jsx for cross-matching.
Values: `online-retailer`, `shop-retailer`, `multi-chain`, `marketplace-seller`, `dropshipper`, `market-trader`, `wholesaler-reseller`, `distributor`, `supermarket`, `hospitality`, `corporate-buyer`, `franchisee`, `charity-nonprofit`, `government`, `subscription-box`, `social-commerce`, `mail-order`, `other`

### Payment Methods (8 options)
Matches `PAYMENT_METHODS` in buyer-profile.jsx.
Values: `bank-transfer`, `credit-debit-card`, `trade-credit`, `paypal`, `cash-on-delivery`, `bnpl`, `letter-of-credit`, `escrow`

### Delivery Methods (13 options)
Matches `DELIVERY_OPTIONS` in buyer-profile.jsx.
Values: `dhl`, `fedex`, `ups`, `usps`, `tnt`, `aramex`, `dpd`, `national-post`, `pallet-delivery`, `own-fleet`, `freight`, `click-collect`, `collection`

### Supply Models (6 options)
Matches `SOURCING_MODELS` in buyer-profile.jsx.
Values: `wholesale`, `dropshipping`, `liquidation`, `white-label`, `private-label`, `job-lots`

### Quality Tiers (4 options)
Matches `QUALITY_TIERS` in buyer-profile.jsx.
Values: `budget`, `mid-range`, `premium`, `luxury`

### Certifications (20 options)
Ordered: regulatory/safety → quality → environmental → food/dietary → industry.
Values: `ce`, `ukca`, `fda`, `rohs`, `reach`, `iso-9001`, `iso-14001`, `gmp`, `brc`, `haccp`, `organic`, `fair-trade`, `rainforest-alliance`, `fsc`, `oeko-tex`, `gots`, `halal`, `kosher`, `bsci`, `b-corp`

### Customer Types (3 options)
Values: `registered-companies`, `sole-traders`, `individuals`

### Customization Options (11 options)
Ordered: general capability → specific techniques.
Values: `minor-customization`, `drawing-based`, `sample-based`, `full-customization`, `print-on-demand`, `custom-packaging`, `custom-labeling`, `private-labeling`, `private-label-formulation`, `logo-printing`, `custom-firmware`

### Other Select Options
- **Sample Availability**: `free`, `paid`, `on-request`, `not-available`
- **Catalogue Size**: `under-50`, `50-200`, `200-1000`, `1000-5000`, `5000-20000`, `20000-plus`
- **Lead Time**: `same-day`, `1-2-days`, `3-5-days`, `1-2-weeks`, `2-4-weeks`, `4-8-weeks`, `8-plus-weeks`, `made-to-order`
- **Facility Size Unit**: `m²`, `ft²`
- **Tax Class**: `standard`, `reduced`, `zero-rated`, `exempt` (from TAX_CLASS_OPTIONS)
- **Invoice Type**: `VAT`, `EU Community`, `Both` (from INVOICE_TYPE_OPTIONS). Labels: "VAT Invoice", "EU Community Invoice", "Both (VAT + EU Community)"
- **Sanitized Invoice**: `Available`, `On Request`, `Unavailable` (from SANITIZED_INVOICE_OPTIONS)
- **Incoterms**: `EXW`, `FCA`, `FOB`, `CIF`, `DAP`, `DDP` (from INCOTERMS_OPTIONS)

---

## 5. Visibility Gating System

Supplier data visibility is controlled by account tier. The system uses two primary gate variables:

### Gate Variables
```javascript
// canViewSupplier: user is Premium, Premium+, or Supplier Pro
// isLoggedIn: user has any valid session
// isSupplierPro: the viewed supplier has a Pro account

const canViewBranding = isLoggedIn && (supplier.isSupplierPro || canViewSupplier);
const canViewName = isLoggedIn && (supplier.isSupplierPro || canViewSupplier);
```

### Visibility Matrix

| Content | Guest | Free/Standard | Premium/Premium+ | Supplier Pro viewing |
|---------|-------|---------------|------------------|---------------------|
| Company logo | Hidden | Locked placeholder (blurred Store icon + Lock, links to /register) | Visible (if Supplier Pro) | Visible |
| Company name | Anonymous name | Anonymous name | Real name (if Supplier Pro or Premium) | Real name |
| Contact details | Hidden | Hidden | Visible | Visible |
| Social links | Hidden | Hidden | Visible (if Supplier Pro) | Visible |
| Review tab | Locked | Locked | Unlocked | Unlocked |
| About tab | Visible | Visible | Visible | Visible |

### Anonymous Name Pattern
When name is gated: `"{deal.category || 'Wholesale'} {first supplierType label}"`, e.g. "Electronics Wholesaler"

### Logo Placeholder (Gated)
When `companyLogo` exists but `!canViewBranding`: shows a blurred Store icon behind a frosted overlay with a Lock icon. On hover the lock turns orange. Clicking navigates to `/register`.

### Review Tab Lock Overlay
When review tab is gated, content renders with `filter: blur(8px), opacity: 0.35` and a centered card overlay with Lock icon, message text, and CTA button linking to `/pricing` (logged-in) or `/register` (guest).

---

## 6. Data Inheritance: Supplier → Deal

Supplier profile fields serve as defaults for deals. The API should pre-resolve inheritance server-side so the frontend always reads from `deal.*` properties.

| Supplier Field | Deal Field | Override Behavior |
|---------------|-----------|-------------------|
| `paymentMethods` | `deal.supplierPaymentMethods` | Deal-level array overrides supplier |
| `certifications` | `deal.certifications` | Deal-level array overrides supplier |
| `deliveryMethods` | `deal.deliveryMethods` | Deal-level array overrides supplier |
| `countriesServed` | `deal.shippingCountries` | Deal-level array overrides supplier |
| `excludedCountries` | `deal.countryRestrictions` | Deal-level array overrides supplier |
| `defaultDepositPercentage` + `defaultDepositTerms` | `deal.depositRequired.percentage` + `.terms` | Deal-level object overrides |
| `defaultInvoiceType` | `deal.invoiceType` | Deal-level string overrides |
| `sanitizedInvoice` | `deal.sanitizedInvoice` | Deal-level string overrides |
| `defaultTaxClass` | `deal.taxClass` | Deal-level string overrides |
| `paymentTerms` | `deal.netPaymentTerms` | Deal-level string overrides |
| `returnPolicy` | `deal.returnPolicy` | Deal-level string overrides |
| `defaultIncoterms` | `deal.incoterms` | Deal-level string overrides |
| `businessHours` | N/A (display only in sidebar) | Not inherited by deals |
| `companyLogo` | N/A (display only, gated) | Not inherited by deals |

### API Resolution Strategy
For each inherited field: if `deal.fieldName` is null or empty, copy `supplier.fieldName` into the deal object before sending to frontend. This keeps the frontend simple — it always reads from `deal.*`.

---

## 7. Supplier Sidebar Card (Deal Page)

The sidebar uses a grouped layout with collapsible sections:

### GROUP A — Identity + Primary CTA (Above the Fold)
- Slate gradient header (`from-slate-200/60 via-slate-100/30 via-[60%] to-transparent`, fixed `h-48`)
- Company logo (or locked placeholder if gated)
- Verified badge + Open/Closed status
- Display name (or anonymous)
- Supplier type pills (rose), quality tier pills (slate)
- Rating, years active, staff count, facility size, country with flag
- Supply model + catalogue size pills
- Primary CTA: "Send Enquiry" (blue, if canViewSupplier) | "Upgrade to Contact" (orange, if logged in) | "Join to Contact" (orange, if guest)
- Secondary: "View Profile" + "View All Deals" buttons

### GROUP B — Certifications
### GROUP C — Capabilities (Collapsible)
Sells to, buyer types, customization, currency preference

### GROUP D — Contact & Location (Gated)
Avatar, name, role, email, phone, LinkedIn, address

### GROUP E — Terms & Availability (Collapsible)
Opening hours widget, payment methods, terms, deposit, invoice, tax, supply models, catalogue, lead time, delivery, incoterms, facility

---

## 8. Business Hours Schema

```javascript
// Structure stored in supplier_profiles.businessHours
{
  monday:    { status: "open"|"closed"|"unset", slots: [{ open: "09:00", close: "17:00" }] },
  tuesday:   { ... },
  // ... through sunday
  holidays:  "Free text, e.g. Closed 24 Dec–1 Jan"
}
```

Each day supports up to 3 time slots (split shifts). The sidebar displays a day-picker with pills and shows the active day's hours. "Open now" status is computed by comparing current time against today's slots.

---

## 9. UI Patterns & Design Decisions

### Pill Styling
All pills/tags/badges use `rounded-md` (not `rounded-full`) for consistency across the project. Exception: circular indicators (dots, avatars, progress rings) keep `rounded-full`.

### Gradient Headers
Both pricing panel and supplier sidebar use a slate gradient at the top to frame the most important data (price / supplier identity):
`from-slate-200/60 via-slate-100/30 via-[60%] to-transparent`
Supplier sidebar limits gradient to `h-48` to match pricing panel's visual density.

### countNoun Pattern
MultiSelect dropdowns with `showCount` use `countNoun` prop for contextual labels: "1 country" / "3 countries" instead of generic "3 tags". Auto-pluralisation uses regex `/[^aeiou]y$/i` for consonant+y → -ies rule.

---

## 10. File Reference

| File | Lines | Contains |
|------|-------|----------|
| `src/components/phases/supplier-profile-form.jsx` | ~1667 | Form with 4 tabs, 35+ fields, validation, tips, progress bar |
| `src/components/phases/supplier-profile.jsx` | ~1044 | Public profile page, About/Review tabs, lock overlays |
| `src/components/deal/supplier-sidebar.jsx` | ~987 | Sidebar card, GROUP A-E, visibility gates |
| `src/components/deal/product-tabs.jsx` | ~1302 | Deal content tabs, inherited supplier data display |
| `src/components/shared/form-fields.jsx` | ~2619 | Shared components: MultiSelect, FloatingField, CategorySelector, BusinessHoursGrid, ImageUploadPlaceholder, BrandPillInput |
| `src/components/phases/buyer-profile.jsx` | — | Buyer-side mirror with matching option arrays for cross-matching |
| `src/components/deal/pricing-panel.jsx` | ~865 | Pricing panel with margin callout, volume pricing |
| `src/components/deal/image-gallery.jsx` | ~148 | Product images with margin badge |

Note: `src/components/deal-v2/` is deprecated — it contains only stub files that redirect to `src/components/deal/`. All active deal page code lives in `src/components/deal/`.
