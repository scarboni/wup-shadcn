# /dashboard/add-deal — Page Design Plan

## 1. Purpose & Context

This page lets suppliers manually create a single deal listing by filling in a tabbed form. It is the **manual complement** to the file-upload pipeline (`/dashboard/upload-deals`) — same destination (a live deal listing), different input method.

The form collects only the **~130 EXTRACTED variables** — the fields that come from the supplier's product data. INHERITED fields are pre-resolved from the supplier's saved profile. ENRICHED fields are populated by the backend after submission (RRP lookup, market data, reputation). PLATFORM fields are system-generated (analytics, badges, IDs).

The page follows the exact structural patterns established by `/dashboard/supplier-profile`: tabbed form with contextual tips panel, AccountSidebar, progress tracking, field-level validation, and draft persistence.

---

## 2. Relationship to Upload Pipeline

| Aspect | /dashboard/upload-deals (file) | /dashboard/add-deal (form) |
|--------|-------------------------------|---------------------------|
| Input | CSV, PDF, Excel, text blob, image | Tabbed form fields |
| Extraction | LLM-driven (Stages 1-2) | Supplier fills fields directly |
| Validation | Same rules (schema-driven) | Same rules (schema-driven) |
| Margin Check | Stage 3 (auto) | Stage 3 (auto, on submit) |
| Image sourcing | Auto-fetch from EAN/ASIN | Auto-fetch + manual upload |
| Output | Preview → publish | Preview → publish |
| Edit flow | File re-upload or inline edit | Inline edit (same form, pre-filled) |

Both paths share the same schema definition file, validation rules, and margin-check pipeline. The form is just a different UI for populating the same EXTRACTED variable set.

---

## 3. Page Layout (mirrors supplier-profile)

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: WholesaleUp > Dashboard > Add Deal                  │
│ MobileDashboardNav                                              │
├──────────┬──────────────────────────────────┬───────────────────┤
│          │                                  │                   │
│ Account  │   ┌──────────────────────────┐   │  Contextual Tips  │
│ Sidebar  │   │  Tab Bar (8 tabs)        │   │  Panel            │
│          │   ├──────────────────────────┤   │                   │
│          │   │                          │   │  (field-level     │
│          │   │  Active Tab Content      │   │   tips, same as   │
│          │   │  (FormSections with      │   │   supplier form)  │
│          │   │   grouped fields)        │   │                   │
│          │   │                          │   │                   │
│          │   ├──────────────────────────┤   │                   │
│          │   │  Save Draft / Continue   │   │                   │
│          │   │  Submit for Review       │   │                   │
│          │   └──────────────────────────┘   │                   │
│          │                                  │                   │
├──────────┴──────────────────────────────────┴───────────────────┤
│ Inherited Supplier Defaults (read-only summary strip)           │
└─────────────────────────────────────────────────────────────────┘
```

**Three-column layout:** AccountSidebar (left) + Form card (center) + FormTipsPanel (right, 2xl+ only). Identical to supplier-profile-form.jsx.

---

## 4. Tab Structure (8 Tabs)

The supplier profile uses 4 tabs for ~35 fields. The deal form has ~130 EXTRACTED fields — 8 tabs keeps each tab manageable (12-20 fields). Tabs are ordered by workflow priority: identity first (needed for margin check), then details, then niche/compliance.

| # | Tab ID | Label | Short Label | Icon | Required Fields | Optional Fields | Field Count |
|---|--------|-------|-------------|------|----------------|----------------|-------------|
| 1 | `product-identity` | Product Identity | Identity | `Package` | title, price, currency, grade, moq | sku, ean, mpn, asin, taric, brands, priceUnit, moqUnit, sellingUnit, priceType | ~15 |
| 2 | `description-media` | Description & Media | Media | `FileText` | description | images (upload + auto-fetch), videoUrl, tags, searchKeywords, productHighlights, packageContents, targetAudience | ~8 |
| 3 | `specifications` | Product Specifications | Specs | `Settings` | — | specifications (key-value builder), variants (array builder), materials, packaging, dimensionsPerUnit, productDimensions, netWeight, grossWeight, color, pattern, powerSource, assemblyRequired, batteryInfo | ~15 |
| 4 | `pricing-terms` | Pricing & Order Terms | Pricing | `DollarSign` | — | rrp, rrpCurrency, priceTiers, mapPrice, priceValidUntil, offerValidityDays, availableQuantity, maxOrderQuantity, orderIncrement, casePackSize, multipackQuantity, isIndivisibleLot, crossCategoryMOQ, negotiable, sellToPrivate, firstOrderDiscount, omnibusPrice, discountPercentage, originalPrice | ~19 |
| 5 | `shipping-logistics` | Shipping & Logistics | Shipping | `Truck` | — | shippingScope, shippingContinents, shippingCountries, shippingClass, shippingCostBearer, shippingCostMethod, readyToShip, isDropship, palletConfiguration, containerLoadQuantity, stackable, portOfOrigin, packagingFormat, grossWeight, freeDelivery, leadTimeTiers, incoterms° | ~17 |
| 6 | `compliance-legal` | Compliance & Legal | Compliance | `Shield` | — | hazmatInfo, hazardSymbols, warrantyInfo, warranty, ageRestriction, prop65Warning, cpscCompliance, fdaRegistration, energyRating, sarValue, ipRating, euResponsiblePerson, countryRestrictions, exportOnly, exportRegions, certifications° | ~16 |
| 7 | `commercial-overrides` | Commercial Overrides | Overrides | `RefreshCw` | — | supplierPaymentMethods°, netPaymentTerms°, depositRequired°, taxClass°, invoiceType°, sanitizedInvoice°, incoterms°, deliveryMethods°, returnPolicy°, dealReturnPolicy | ~10 |
| 8 | `category-specific` | Category-Specific | Category | `Layers` | — | (dynamic — rendered based on detected product category) | ~30 |

**° = Inherited override field.** These fields inherit from the supplier's profile. The form shows the inherited value as a read-only default with an "Override for this deal" toggle. When toggled, the field becomes editable.

---

## 5. Tab Detail — Field Groupings

### Tab 1: Product Identity

The gatekeeper tab. Contains all 3 HIGH-confidence rejection fields (title, product identifier, price). Supplier cannot proceed to other tabs until these pass validation.

**FormSection: "Core Product Information" (required)**
- `title` — FloatingField, text, required. Min 5 chars, must contain brand or product type. Validation feedback matches pipeline: "Product name is too generic."
- `price` — CurrencyAmountInput (same component as supplier-profile MOV). Required, valid number.
- `currency` — dropdown, defaults to supplier's preferredCurrency.
- `priceUnit` — FloatingSelect. Options: "/ Unit ex. VAT", "/ Kilogram", "/ Meter²", "/ Litre", "/ Pallet", "/ Container", "/ Set", "/ Pack".
- `grade` — FloatingSelect. Options from GRADES enum: New, Used, Outlet, Refurbished, Damaged, Mix / returns, Returns / Mixed Stock, Liquidation Stocklots.

**FormSection: "Product Identifiers" (at least one required)**
- `ean` — FloatingField, text. GS1 checksum validation on blur.
- `mpn` — FloatingField, text.
- `asin` — FloatingField, text. 10-char alphanumeric.
- `sku` — FloatingField, text (supplier's internal SKU).
- `taric` — FloatingField, text. 6-10 digit format.
- Cross-field validation: at least one of ean/mpn/asin must be filled. Error on all three if none provided.

**FormSection: "Product Classification"**
- `brands` — BrandPillInput (same component from supplier-profile).
- `moq` — FloatingField, number, min 1.
- `moqUnit` — FloatingSelect. Options: Units, pieces, lots, trucks, pallets, pairs, packs, sets, kilograms, tonnes, m², litres, containers.
- `sellingUnit` — FloatingSelect. Options: Single item, Set, Pair, Pack, Box, Roll, Meter, Ton, Piece, Pallet, Container.
- `priceType` — FloatingSelect. Options: fixed, average, starting-from, negotiable-only.

### Tab 2: Description & Media

**FormSection: "Product Description" (required)**
- `description` — FloatingTextarea, min 50 chars. Rich text encouraged.
- `packageContents` — FloatingField, text. "What's in the box" — freetext.
- `targetAudience` — FloatingField, text. Freetext.

**FormSection: "Images & Video"**
- `images` — ImageUploadPlaceholder (multi-image, drag-drop, reorder). Shows auto-fetched images from EAN/ASIN if available, with option to replace.
- `videoUrl` — FloatingField, URL. YouTube/Vimeo embed validation.

**FormSection: "Tags & Discovery"**
- `tags` — BrandPillInput (repurposed for hashtags). Freetext pill input.
- `searchKeywords` — BrandPillInput. SEO keywords.
- `productHighlights` — Repeater field (add/remove bullet points, max 10, max 150 chars each).

### Tab 3: Product Specifications

**FormSection: "Technical Specifications"**
- `specifications` — KeyValueBuilder. Dynamic add/remove rows of key-value pairs. Pre-populated with common keys based on detected category.
- `variants` — VariantBuilder. Each variant has a name (e.g. "Color") and options array. Add/remove variants, add/remove options per variant, mark one as selected/default.
- `materials` — FloatingField, text.

**FormSection: "Dimensions & Weight"**
- `packaging` — DimensionsInput (length, width, height, unit dropdown, weight, weightUnit). Compound field.
- `dimensionsPerUnit` — DimensionsInput (same component, no weight).
- `productDimensions` — DimensionsInput + notes field.
- `netWeight` — WeightInput (value + unit).
- `grossWeight` — WeightInput (value + unit).

**FormSection: "Product Attributes"**
- `color` — BrandPillInput (repurposed for color variants).
- `pattern` — FloatingSelect. Options: solid, striped, floral, plaid, geometric, animal print, abstract, paisley.
- `powerSource` — FloatingSelect. Options: Battery (rechargeable), Corded Electric, Solar, Manual, USB Rechargeable, Mains (AC), Fuel, Hybrid.
- `assemblyRequired` — Toggle + conditional fields (complexity, tools, time).
- `batteryInfo` — Compound field with toggles (required, included, removable) + text fields (type, voltage, capacity, quantity).

### Tab 4: Pricing & Order Terms

**FormSection: "Market Pricing"**
- `rrp` — CurrencyAmountInput. "RRP/MSRP if known — leave blank for auto-lookup."
- `rrpCurrency` — dropdown.
- `mapPrice` — CurrencyAmountInput. Minimum Advertised Price.
- `omnibusPrice` — CurrencyAmountInput. EU Omnibus 30-day low price.
- `originalPrice` — CurrencyAmountInput. Pre-discount strikethrough price.
- `discountPercentage` — FloatingField, number, 0-100.

**FormSection: "Volume Pricing"**
- `priceTiers` — TierBuilder (same pattern as supplier-profile discountTiers). Rows of minQty, maxQty, price. Add/remove tiers.

**FormSection: "Order Constraints"**
- `availableQuantity` — FloatingField, number. null = unlimited. Toggle for "No limits".
- `maxOrderQuantity` — FloatingField, number.
- `orderIncrement` — FloatingField, number. "Must order in increments of..."
- `casePackSize` — FloatingField, number.
- `multipackQuantity` — FloatingField, number.
- `isIndivisibleLot` — Toggle. "Lot must be taken in full."
- `crossCategoryMOQ` — Toggle. "MOQ can be met across different products."
- `negotiable` — Toggle.
- `sellToPrivate` — Toggle. "Also available to private individuals."

**FormSection: "Buyer Incentives"**
- `firstOrderDiscount` — Compound: percentage (number) + label (text).
- `priceValidUntil` — Date picker (ISO date).
- `offerValidityDays` — FloatingField, number.

### Tab 5: Shipping & Logistics

**FormSection: "Shipping Scope"**
- `shippingScope` — RadioGroup. Options: all-continents, specific, not-declared.
- `shippingContinents` — MultiSelect (conditional on scope = all-continents or specific).
- `shippingCountries` — MultiSelect with flags (same as supplier-profile countriesServed, conditional on scope = specific).
- `countryRestrictions` — MultiSelect with flags (countries where product cannot be sold/shipped).

**FormSection: "Shipping Details"**
- `shippingClass` — FloatingSelect. Options: Standard, Freight, Oversized, Hazmat, Perishable.
- `shippingCostBearer` — FloatingSelect. Options: buyer, seller, negotiable, included.
- `shippingCostMethod` — FloatingSelect. Options: weight-based, flat-rate, volume-based, quote-required.
- `readyToShip` — Toggle.
- `isDropship` — Toggle.
- `freeDelivery` — Toggle.
- `portOfOrigin` — FloatingField, text.

**FormSection: "Packaging & Palletization"**
- `packagingFormat` — FloatingField, text.
- `palletConfiguration` — Compound: unitsPerLayer, layersPerPallet, unitsPerPallet (auto-calculated).
- `containerLoadQuantity` — Compound: twentyFt, fortyFt, fortyHC.
- `stackable` — Toggle.

**FormSection: "Lead Time Tiers"**
- `leadTimeTiers` — TierBuilder. Rows of minQty, maxQty, days (or "negotiable" toggle). Same pattern as priceTiers.

### Tab 6: Compliance & Legal

**FormSection: "Safety & Hazmat"**
- `hazmatInfo` — Compound: isHazardous toggle → unNumber, class (conditional).
- `hazardSymbols` — MultiSelect. Options: GHS01-GHS09 codes with pictogram previews.
- `ageRestriction` — Compound: minAge (number) + reason (text).
- `prop65Warning` — FloatingTextarea. California Prop 65 text.

**FormSection: "Certifications & Standards"**
- `certifications` — MultiSelect (same options as supplier-profile, but deal-level override).
- `warrantyInfo` — Compound: duration, type (Manufacturer/Seller/None), coverage text.
- `warranty` — FloatingField, text. Seller warranty string ("6 months", "lifetime").
- `cpscCompliance` — Compound: compliant toggle, certNumber, testLab.
- `fdaRegistration` — Compound: registered toggle, number, type.
- `energyRating` — Compound: system, rating, annualConsumption.
- `sarValue` — Compound: head (number), body (number).
- `ipRating` — FloatingField, text (e.g. "IP68").

**FormSection: "EU Compliance"**
- `euResponsiblePerson` — Compound: name, address, email.
- `exportOnly` — Toggle.
- `exportRegions` — MultiSelect (conditional on exportOnly).

### Tab 7: Commercial Overrides

This tab displays the supplier's profile defaults as read-only cards, each with an "Override for this deal" toggle. When toggled, the field becomes editable with the supplier value pre-filled.

**FormSection: "Payment & Invoice Overrides"**
- `supplierPaymentMethods` — MultiSelect (inherited from supplier.paymentMethods).
- `netPaymentTerms` — FloatingField, text (inherited from supplier.paymentTerms).
- `depositRequired` — Compound: percentage + terms (inherited from supplier.defaultDepositPercentage + defaultDepositTerms).
- `taxClass` — FloatingSelect (inherited from supplier.defaultTaxClass).
- `invoiceType` — FloatingSelect (inherited from supplier.defaultInvoiceType).
- `sanitizedInvoice` — FloatingSelect (inherited from supplier.sanitizedInvoice).

**FormSection: "Delivery & Terms Overrides"**
- `deliveryMethods` — MultiSelect (inherited from supplier.deliveryMethods).
- `incoterms` — FloatingSelect (inherited from supplier.defaultIncoterms).
- `returnPolicy` — FloatingTextarea (inherited from supplier.returnPolicy).
- `dealReturnPolicy` — FloatingTextarea. Deal-specific return policy that fully replaces supplier policy.

**Override UX pattern:**
```
┌─────────────────────────────────────────────────┐
│ Payment Methods               [Using profile ▼] │
│ Bank Transfer, Credit Card, PayPal              │
│                                                  │
│ [ ] Override for this deal                       │
│     ┌──────────────────────────────────────┐     │
│     │ (MultiSelect, editable, pre-filled)  │     │
│     └──────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
```

### Tab 8: Category-Specific

This tab renders dynamically based on the product category selected/detected. Only relevant fields appear.

**Apparel & Fashion (when category matches):**
- `fabricComposition` — FabricBuilder. Rows of material + percentage (must total 100%).
- `gsm` — FloatingField, number.
- `careInstructions` — Compound: wash, dry, iron, bleach.
- `fitType` — FloatingSelect. Options: Slim, Regular, Relaxed, Oversized, Tailored.
- `gender` — FloatingSelect. Options: Men, Women, Unisex, Boys, Girls.
- `sizeChart` — SizeChartBuilder. Type selector (EU/US/UK) + row builder (label, measurements).
- `predominantSizes` — BrandPillInput.
- `seasonSortable` — Toggle.

**Food & Beverage (when category matches):**
- `ingredients` — FloatingTextarea.
- `allergens` — MultiSelect. Common allergens.
- `dietaryTags` — MultiSelect. Options: Vegan, Vegetarian, Gluten-free, Organic, No preservatives, etc.
- `nutritionalInfo` — NutritionalInfoBuilder. Compound: servingSize, calories, fat, saturatedFat, carbs, sugar, fiber, protein, salt.
- `storageInstructions` — FloatingField, text.
- `shelfLife` — FloatingField, text.
- `organicCertification` — Compound: certified toggle, body, number.
- `kosherHalal` — Compound: kosher toggle, halal toggle, certBody.
- `countryOfHarvest` — FloatingSelect with flags.
- `abv` — FloatingField, number.
- `vintageYear` — FloatingField, number.
- `bestBeforeDate` — Date picker.
- `gmoDeclaration` — FloatingSelect.
- `storageTemperatureRange` — Compound: min, max, unit.

**Health & Beauty (when category matches):**
- `inciList` — FloatingTextarea.
- `spfRating` — FloatingField, number.
- `skinType` — MultiSelect.
- `paoMonths` — FloatingField, number.
- `crueltyFree` — Compound: certified toggle, body.
- `dermatologicallyTested` — Toggle.

**Industrial / B2B (when category matches):**
- `toleranceSpecs` — FloatingField, text.
- `pressureRating` — Compound: value + unit.
- `temperatureRange` — Compound: min, max, unit.
- `threadType` — FloatingField, text.
- `materialGrade` — FloatingField, text.

**Lot / Liquidation (when grade or supply model suggests):**
- `isAssortedLot` — Toggle.
- `lotComposition` — LotCompositionBuilder. Key-value rows (category → percentage).
- `authenticityGuarantee` — FloatingField, text.
- `imagesRepresentative` — Toggle.
- `sourceRetailers` — BrandPillInput.
- `stockOrigin` — MultiSelect. Options: surplus, overstock, end-of-line, liquidation, bankruptcy, controlled-returns, customer-returns, cancelled-order, sample-stock, production-excess.
- `isManifested` — Toggle with explanation.
- `lotRetailValue` — CurrencyAmountInput.
- `gradeNotes` — FloatingTextarea.
- `gradeCategory` — FloatingSelect. Options: A, B, C.
- `hasOriginalLabels` — Toggle.
- `labelCondition` — FloatingField, text (conditional on hasOriginalLabels).
- `mayContainDuplicates` — Toggle.
- `functionalRate` — Compound: functional %, withIssues %, note.

**Cross-category (always shown in this tab):**
- `productStatus` — FloatingSelect. Options: active, discontinued, end-of-life, pre-launch, seasonal.
- `launchDate` — Date picker.
- `discontinuedDate` — Date picker.
- `seasonality` — FloatingSelect.
- `manufacturingCountry` — FloatingSelect with flags.
- `productLanguage` — MultiSelect.
- `compatibleWith` — BrandPillInput.
- `customizationOptions` — RepeaterBuilder (name, extraCost, currency, minQty).
- `ecoFriendly` — Compound: materials (pills), packaging (pills), production (text).
- `supplyAbility` — Compound: quantity, unit, period.
- `sampleLeadTime` — Compound: min, max, unit.

---

## 6. Validation Strategy

### Gatekeeper Validation (Tab 1 — blocks form submission)

Same 3 HIGH-confidence rules as the upload pipeline:

1. **title** — min 5 chars, must contain brand or product type (not "Phone" or "Item")
2. **Product identifier** — at least one of ean/mpn/asin. EAN must pass GS1 checksum.
3. **price** — valid positive number with currency.

These are validated on blur and also on tab-change (prevent moving past Tab 1 without them).

### Tab-Level Validation (blocks tab save, doesn't block navigation)

Each tab validates its own required fields on "Save & Continue". Errors show inline + ErrorSummaryPanel (same as supplier-profile).

### Cross-Field Validation

- `fabricComposition` percentages must sum to 100%
- `priceTiers` must be non-overlapping and ascending by minQty
- `leadTimeTiers` same constraint
- `palletConfiguration.unitsPerPallet` auto-calculated from unitsPerLayer × layersPerPallet
- `discountPercentage` + `originalPrice` should be internally consistent
- `shippingContinents` only editable when `shippingScope` is "all-continents" or "specific"
- `exportRegions` only editable when `exportOnly` is true

### Real-Time Field Validation

Same pattern as supplier-profile: `revalidateField()` on blur, errors stored in `errors` state, displayed inline. `touched` state prevents showing errors on untouched fields.

---

## 7. Draft Persistence

Uses `useFormDraft("wup-deal-draft-{dealId}", form, setForm)` — same hook as supplier-profile. Auto-saves to localStorage on change, restores on mount. Draft cleared on successful submission.

For new deals: key is `wup-deal-draft-new`.
For edits: key is `wup-deal-draft-{dealId}`.

---

## 8. Submission Flow

1. **Validate all tabs** — run full validation across all 8 tabs. Show ErrorSummaryPanel if errors.
2. **Preview** — navigate to a preview page showing the deal as it would appear on `/deal`. Uses the same deal page components (PricingPanel, ImageGallery, ProductDescriptionTabs) with the form data.
3. **Submit for processing** — POST to `/api/deals` (new) or PUT to `/api/deals/{id}` (edit).
4. **Backend runs Stage 3** — margin check against RRP, image auto-fetch, enrichment.
5. **Result**:
   - **Pass** → deal listed, supplier redirected to deal management page.
   - **Fail margin check** → specific feedback shown (same messages as pipeline). Supplier can adjust price and re-submit.
   - **Fail image fetch** → listing still created with placeholder. Completeness prompt shown.

---

## 9. Edit Mode

The same form component serves both create and edit modes. When editing:

- URL: `/dashboard/add-deal?id={dealId}`
- Form pre-filled from existing deal data via `GET /api/deals/{id}/edit`
- "Submit for Review" becomes "Save Changes"
- Re-validation rules apply per the deal-upload skill:
  - Price/RRP/currency change → full margin re-check
  - EAN/MPN/ASIN change → identity validation + new RRP lookup + image re-fetch
  - Image change → image validation
  - Title change → specificity check
  - Other fields → direct update, no re-validation
- Failed re-validation → deal marked Sold Out + rejection feedback (per deal-upload skill)

---

## 10. Inherited Defaults Strip

A collapsible summary bar below the form shows which supplier profile fields are being inherited:

```
┌──────────────────────────────────────────────────────────────────┐
│ 📋 Using your profile defaults for: Payment Methods (3),        │
│    Delivery Methods (4), Return Policy, Lead Time, Incoterms,   │
│    Tax Class, Invoice Type                                      │
│    [Edit Profile →]  [Override individual fields in Tab 7]       │
└──────────────────────────────────────────────────────────────────┘
```

This gives suppliers visibility into what's being inherited without cluttering every tab.

---

## 11. Shared Components (from form-fields.jsx)

Reuse all existing shared components. New compound components needed:

| Component | New? | Purpose |
|-----------|------|---------|
| `FloatingField` | Existing | Text/number inputs |
| `FloatingSelect` | Existing | Single-value dropdowns |
| `FloatingTextarea` | Existing | Multi-line text |
| `MultiSelect` | Existing | Multi-value selectors |
| `CurrencyAmountInput` | Existing | Price with currency picker |
| `BrandPillInput` | Existing | Freetext pill input (tags, brands, colors) |
| `ImageUploadPlaceholder` | Existing | Image upload zone |
| `CategorySelector` | Existing | Category tree picker |
| `FormSection` | Existing | Grouped field wrapper |
| `ProfileTabBar` | Existing | Tab navigation |
| `TabStatus` | Existing | Tab completion indicators |
| `ErrorSummaryPanel` | Existing | Validation error list |
| `AccountSidebar` | Existing | Dashboard sidebar |
| `FormTipsPanel` | Existing | Contextual tips (right panel) |
| `KeyValueBuilder` | **New** | Dynamic key-value pair rows (specifications) |
| `VariantBuilder` | **New** | Variant name + options array builder |
| `TierBuilder` | **New** | Quantity/price tier rows (generalizes discountTiers pattern) |
| `DimensionsInput` | **New** | L × W × H + unit compound field |
| `WeightInput` | **New** | Value + unit compound field |
| `FabricBuilder` | **New** | Material + percentage rows (must sum to 100%) |
| `NutritionalInfoBuilder` | **New** | Structured nutrition facts form |
| `SizeChartBuilder` | **New** | Size system + measurement rows |
| `LotCompositionBuilder` | **New** | Category → percentage breakdown |
| `RepeaterBuilder` | **New** | Generic add/remove row builder |

---

## 12. Tips Data

Same pattern as `SUPPLIER_TIPS_DATA` — one entry per field with title, tip text, and icon. Field-level tips surface in the right panel on focus.

Tab-level default tips explain the purpose of each tab.

Bottom section includes a "Why complete listings matter" card with listing completeness stats (same as supplier profile's "Why It Matters").

---

## 13. Progress Tracking

Same `onProgressChange` pattern as supplier-profile. Progress is calculated as:

```
filled required fields / total required fields (Tab 1)
+ filled optional fields / total optional fields (all tabs, weighted lower)
```

Progress percentage shown in AccountSidebar's deal section. Draft persistence saves progress.

---

## 14. File Structure

| File | Purpose |
|------|---------|
| `src/app/dashboard/add-deal/page.tsx` | Next.js route, metadata, auth gate |
| `src/components/phases/deal-form.jsx` | Main form component (~2000-2500 lines) |
| `src/components/shared/form-fields.jsx` | Existing + new compound components |

The form component follows the same export pattern as `supplier-profile-form.jsx`:
- Reference data arrays (enums, options) at top
- Field labels object
- Required fields object
- Tab-field mapping
- Tips data
- Validation logic
- Form component with state, handlers, render
- Page wrapper with AccountSidebar + FormTipsPanel

---

## 15. Enum Reference (Deal Form Options)

These are the deal-specific enums needed. Supplier-profile enums (payment methods, delivery methods, certifications, etc.) are imported from the existing shared location.

```javascript
const GRADE_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Used", label: "Used" },
  { value: "Outlet", label: "Outlet" },
  { value: "Refurbished", label: "Refurbished" },
  { value: "Damaged", label: "Damaged" },
  { value: "Mix / returns", label: "Mix / Returns" },
  { value: "Returns / Mixed Stock", label: "Returns / Mixed Stock" },
  { value: "Liquidation Stocklots", label: "Liquidation Stocklots" },
];

const PRICE_TYPE_OPTIONS = [
  { value: "fixed", label: "Fixed Price" },
  { value: "average", label: "Average Price" },
  { value: "starting-from", label: "Starting From" },
  { value: "negotiable-only", label: "Negotiable Only" },
];

const PRODUCT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "discontinued", label: "Discontinued" },
  { value: "end-of-life", label: "End of Life" },
  { value: "pre-launch", label: "Pre-Launch" },
  { value: "seasonal", label: "Seasonal" },
];

const SELLING_UNIT_OPTIONS = [
  { value: "Single item", label: "Single Item" },
  { value: "Set", label: "Set" },
  { value: "Pair", label: "Pair" },
  { value: "Pack", label: "Pack" },
  { value: "Box", label: "Box" },
  { value: "Roll", label: "Roll" },
  { value: "Meter", label: "Meter" },
  { value: "Ton", label: "Ton" },
  { value: "Piece", label: "Piece" },
  { value: "Pallet", label: "Pallet" },
  { value: "Container", label: "Container" },
];

const MOQ_UNIT_OPTIONS = [
  { value: "Units", label: "Units" },
  { value: "pieces", label: "Pieces" },
  { value: "lots", label: "Lots" },
  { value: "trucks", label: "Trucks" },
  { value: "pallets", label: "Pallets" },
  { value: "pairs", label: "Pairs" },
  { value: "packs", label: "Packs" },
  { value: "sets", label: "Sets" },
  { value: "kilograms", label: "Kilograms" },
  { value: "tonnes", label: "Tonnes" },
  { value: "m²", label: "Square Metres" },
  { value: "litres", label: "Litres" },
  { value: "containers", label: "Containers" },
];

const SHIPPING_CLASS_OPTIONS = [
  { value: "Standard", label: "Standard" },
  { value: "Freight", label: "Freight" },
  { value: "Oversized", label: "Oversized" },
  { value: "Hazmat", label: "Hazmat" },
  { value: "Perishable", label: "Perishable" },
];

const SHIPPING_SCOPE_OPTIONS = [
  { value: "all-continents", label: "Ships Worldwide" },
  { value: "specific", label: "Specific Countries/Continents" },
  { value: "not-declared", label: "Not Declared" },
];

const INCOTERMS_OPTIONS = [
  { value: "EXW", label: "EXW — Ex Works" },
  { value: "FOB", label: "FOB — Free on Board" },
  { value: "CIF", label: "CIF — Cost, Insurance & Freight" },
  { value: "DDP", label: "DDP — Delivered Duty Paid" },
  { value: "DAP", label: "DAP — Delivered at Place" },
  { value: "FCA", label: "FCA — Free Carrier" },
];

const SEASONALITY_OPTIONS = [
  { value: "All Season", label: "All Season" },
  { value: "Spring/Summer", label: "Spring / Summer" },
  { value: "Autumn/Winter", label: "Autumn / Winter" },
  { value: "Holiday", label: "Holiday" },
  { value: "Back to School", label: "Back to School" },
];

const STOCK_ORIGIN_OPTIONS = [
  { value: "surplus", label: "Surplus" },
  { value: "overstock", label: "Overstock" },
  { value: "end-of-line", label: "End of Line" },
  { value: "liquidation", label: "Liquidation" },
  { value: "bankruptcy", label: "Bankruptcy" },
  { value: "controlled-returns", label: "Controlled Returns" },
  { value: "customer-returns", label: "Customer Returns" },
  { value: "cancelled-order", label: "Cancelled Order" },
  { value: "sample-stock", label: "Sample Stock" },
  { value: "production-excess", label: "Production Excess" },
];
```

---

## 16. Key Design Decisions

1. **8 tabs, not 4** — The supplier profile has ~35 fields across 4 tabs. The deal form has ~130 fields. 8 tabs keeps complexity manageable (~15 fields/tab avg). Tab 8 (category-specific) is dynamic and only shows relevant fields.

2. **Tab 1 as gatekeeper** — Matches pipeline's HIGH-confidence rejection logic. The 3 critical fields must pass before continuing. This gives early failure feedback instead of completing a full form only to fail on margin check.

3. **Tab 7 for inherited overrides** — Rather than scattering override toggles across multiple tabs (payment methods in one tab, delivery in another), all inherited fields are grouped together. This makes the inheritance model visible and understandable.

4. **Tab 8 dynamic rendering** — Category-specific fields (apparel, food, beauty, industrial, lot/liquidation) only render when relevant. This prevents electronics suppliers from seeing 30 irrelevant food fields. Category detection happens from the product category set in Tab 1 or inferred from title/description.

5. **Same validation rules as pipeline** — The form doesn't invent its own validation. Every rule matches the schema definition file used by the upload pipeline. When the schema definition file is built, both form and pipeline consume it.

6. **Preview before submit** — Suppliers see exactly how their deal will look on the public deal page before committing. Uses the same components (PricingPanel, ImageGallery, ProductDescriptionTabs) with form data instead of API data.

7. **Edit reuses the same component** — No separate edit form. The create form accepts an optional `dealId` prop. When present, it fetches existing data and pre-fills. Re-validation rules from deal-upload skill apply to changed fields only.

---

## 17. Implementation Order

1. **Phase 1: Core form shell** — Page route, 8-tab structure, AccountSidebar, FormTipsPanel, draft persistence, progress tracking. No fields yet.
2. **Phase 2: Tab 1 (Identity)** — The 3 gatekeeper fields + product identifiers + classification. Validation. This is the minimum viable form.
3. **Phase 3: Tab 2 (Description & Media)** — Description, images, tags. Image upload component.
4. **Phase 4: Tabs 3-4 (Specs + Pricing)** — New compound components (KeyValueBuilder, VariantBuilder, TierBuilder, DimensionsInput).
5. **Phase 5: Tab 5 (Shipping)** — Shipping scope/countries, logistics compound fields.
6. **Phase 6: Tab 6 (Compliance)** — Hazmat, certifications, EU compliance. Mostly simple fields.
7. **Phase 7: Tab 7 (Overrides)** — Inherited defaults display + override toggle pattern. Needs supplier profile data fetched.
8. **Phase 8: Tab 8 (Category-specific)** — Dynamic rendering based on category. Last because it's the most complex UI logic.
9. **Phase 9: Preview + Submit** — Preview page using deal page components. Submission to API. Margin check response handling.
10. **Phase 10: Edit mode** — Pre-fill from existing deal. Re-validation on changed fields. Sold-out-on-failure logic.
