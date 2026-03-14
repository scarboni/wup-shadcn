---
name: deal-page
description: "**WholesaleUp Deal Page Frontend**: Reference this skill whenever working on the deal page UI, product variable display, pricing panel, product tabs, image gallery, supplier sidebar on deal pages, deal page layout, or any component that renders deal data. Covers the ~230 variable schema across 14 groups, component architecture, display grouping, category-specific rendering, null-safety patterns, and structured object conventions. MANDATORY TRIGGERS: deal page, deal variables, pricing panel, product tabs, image gallery, deal layout, deal display, product details, deal component, single-deal, deal-v2, variable groups, demo-data"
---

# WholesaleUp Deal Page Frontend

Architecture reference for the deal page — the primary product listing view where buyers evaluate wholesale deals. Covers the ~230 variable schema, component structure, display grouping, and rendering patterns.

Last updated: 2026-03-12

---

## 1. Page Architecture

The deal page is composed of four primary components orchestrated by `single-deal-v2.jsx`:

| Component | File | Purpose |
|-----------|------|---------|
| `ImageGallery` | `image-gallery.jsx` | Product images with margin badge overlay |
| `PricingPanel` | `pricing-panel.jsx` | Pricing, order terms, volume tiers, product specs |
| `SupplierSidebarCard` | `supplier-sidebar.jsx` | Supplier identity, contact, terms (see `supplier-profile` skill) |
| `ProductDescriptionTabs` | `product-tabs.jsx` | Multi-tab content: description, specs, compliance, reviews, attachments |

### Layout

Desktop: two-column layout. Left column contains ImageGallery + ProductDescriptionTabs. Right column contains PricingPanel + SupplierSidebarCard (sticky).

Above the fold: title, badges, breadcrumb, social proof stats, then ImageGallery (left) and PricingPanel (right).

### Page Header (single-deal-v2.jsx)

Renders directly in the orchestrator, not delegated to sub-components:
- Title (`deal.title`)
- Badges: verified, grade pill, stock urgency, dietary tags
- Category breadcrumb (`deal.categoryBreadcrumb`)
- Social proof row: view count, inquiry count, units sold, rating stars + review count
- Share / favorite action buttons

---

## 2. Variable Schema Overview

All ~230 deal variables are defined in `demo-data.js` across 14 groups (A through N). Each variable belongs to one of four data sources — see the `deal-upload` skill for the pipeline that populates them.

| Data Source | Count | Origin |
|-------------|-------|--------|
| EXTRACTED | ~130 | Supplier's product data file (LLM extraction) |
| INHERITED | ~30 | Supplier profile defaults (see `supplier-profile` skill) |
| ENRICHED | ~10 | External APIs (Keepa, eBay, calculations) |
| PLATFORM | ~25 | WholesaleUp system (analytics, badges, IDs) |

---

## 3. Variable Groups (A–N)

### Group A — Supplier Profile Inherited Fields
Copied from supplier profile at listing time. Deal-level values override when present.
Fields: certifications, returnPolicy, leadTime, sampleAvailability, minimumOrderAmount, minimumOrderCurrency, catalogueSize, supplierPaymentMethods, discountTiers, discountNotes, supplyModels, productQualityTier, deliveryMethods.

### Group B — Product Details
Core product specifications and variant data.
Fields: specifications (key-value object), variants (array of name/options/selected), videoUrl, packaging (dimensions object), materials, productLanguage, manufacturingCountry, manufacturingCountryCode, customizationOptions (array with extraCost/minQty).

### Group C — Platform Features & Social Proof
Aggregated reviews and platform badges.
Fields: productReputation (overallScore, sourcesCount, dimensions array, highlights, cautions), isBestseller, isNew, orderProtection, frequentlyBoughtTogether, reviews array, reviewSummary.

### Group E — Performance & Engagement
Metrics and additional deal-level fields discovered in audit round 2.
Fields: unitsSold, reorderRate, categoryRanking, samplePrice, shelfLife, shipsFrom, shipsFromCode, freeReturns, sellingUnit, orderIncrement, ecoFriendly (materials/packaging/production).

### Group F — Extended Specifications (Audit Round 3)
Detailed product attributes and compliance info.
Fields: categoryBreadcrumb, estimatedDeliveryRange, freeShippingThreshold, testerOption, casePackSize, ingredients, allergens, dietaryTags, storageInstructions, customizationAbility, importDutyCoverage, brandTier, promotionalBadge, comparisonPrice, paymentFinancing, lowStockWarning, productGrade, hazmatInfo, countryRestrictions, warrantyInfo, ageRestriction, dimensionsPerUnit, netWeight.

### Group G — Comprehensive Audit (50+ variables, 12 sub-groups)
- **G1. Identification**: mpn, batchNumber, serialNumberRequired
- **G2. Commercial Terms**: mapPrice, priceValidUntil, netPaymentTerms, depositRequired, taxClass
- **G3. Logistics**: palletConfiguration, containerLoadQuantity, shippingClass, incoterms, readyToShip, stackable, portOfOrigin
- **G4. Lifecycle**: productStatus, launchDate, discontinuedDate, seasonality, bestBeforeDate
- **G5. Compliance**: prop65Warning, cpscCompliance, fdaRegistration, energyRating, sarValue, ipRating
- **G6. Apparel**: fabricComposition, gsm, careInstructions, fitType, gender, sizeChart
- **G7. Food**: nutritionalInfo, organicCertification, kosherHalal, countryOfHarvest, abv, vintageYear
- **G8. Beauty**: inciList, spfRating, skinType, paoMonths, crueltyFree, dermatologicallyTested
- **G9. Industrial**: toleranceSpecs, pressureRating, temperatureRange, threadType, materialGrade
- **G10. Analytics**: viewCount, inquiryCount
- **G11. SEO**: searchKeywords, metaTitle, metaDescription, slug
- **G12. B2B**: maxOrderQuantity, exclusivityAvailable, whiteLabeling, productInsurance, qualityInspection

### Group H — Buyer Incentives & Packaging (Merkandi Audit)
Fields: firstOrderDiscount, packageContents, priceType, compatibleWith.

### Group I — B2B Eligibility
Fields: sellToPrivate, targetAudience.

### Group J — Hazmat
Fields: hazardSymbols (GHS codes).

### Group K — Extended Attributes (40 sub-groups)
The largest group, covering shipping structure, lot indicators, trust badges, EU compliance, pricing tiers, and more. Key fields: shippingScope, shippingContinents, isAssortedLot, lotComposition, authenticityGuarantee, imagesRepresentative, supplierIsCertified, supplierResponseBadge, dealReturnPolicy, omnibusPrice, discountPercentage, originalPrice, isIndivisibleLot, sourceRetailers, gradeNotes, gradeCategory, showroomAvailable, hasOriginalLabels, exportOnly, exportRegions, offerValidityDays, shippingCostBearer, crossCategoryMOQ, platformExclusive, labelCondition, mayContainDuplicates, shippingCostMethod, freeDelivery, invoiceType, sanitizedInvoice, packagingFormat, color, productDimensions, predominantSizes, stockOrigin, isManifested, lotRetailValue, priceTiers, warranty, functionalRate, seasonSortable, weeksBestOffer.

### Group L — Cross-Platform Audit (Alibaba, Amazon, Faire, IndiaMART)
Fields: supplyAbility, sampleLeadTime, powerSource, assemblyRequired, euResponsiblePerson, batteryInfo.

### Group M — Lead Time & Supplier Business Type
Fields: leadTimeTiers (quantity-based delivery tiers), supplierBusinessType.

### Group N — GS1 / Google Standards (17 variables)
Fields: grossWeight, gln, gpcCode, multipackQuantity, itemGroupId, pattern, productHighlights, despatchUnitIndicator, countryOfLastProcessing, storageTemperatureRange, gmoDeclaration, weeeClassification, reachSvhcDeclaration, rohsCompliance, carbonFootprint, costOfGoodsSold, unitPricingBaseMeasure.

---

## 4. Component Display Mapping

### PricingPanel (pricing-panel.jsx, ~691 lines)

Renders deal pricing and order specifications in grouped sections with a slate gradient header.

**Displayed variables:**
- Price block: price, currency, priceUnit, rrp, rrpCurrency, markup (margin callout)
- Volume pricing: priceTiers array, discountTiers array
- Platform comparison: platforms array (Amazon, eBay price cards)
- Grade: grade enum with definition tooltip
- Stock location: stockLocation + flag (shown only when set; deal-level country override)
- Order terms: moq, moqUnit, sellingUnit, orderIncrement, casePackSize, availableQuantity, maxOrderQuantity
- Sample: sampleAvailability, samplePrice
- Product identity: brands array, manufacturingCountry + flag, materials, productLanguage
- Variants: variants array (color/storage/size selectors)

**Gradient:** `bg-gradient-to-b from-slate-200/60 via-slate-100/30 via-[60%] to-transparent`

### ProductDescriptionTabs (product-tabs.jsx, ~1216 lines)

Multi-tab interface with 5 tabs:

**Tab 1 — Description:**
- deal.description (expandable)

**Tab 2 — Specifications:**
- specifications object (key-value pairs in grouped rows)
- tags array (pills)
- certifications array (badge pills with icons)

**Tab 3 — Compliance:**
- Payment terms: netPaymentTerms, paymentFinancing, depositRequired, taxClass, invoiceType, sanitizedInvoice, supplierPaymentMethods
- Shipping & delivery: leadTime, shippingTime, shippingCountries, readyToShip, estimatedDeliveryRange, freeDelivery, freeShippingThreshold, shipsFrom + flag, countryRestrictions, importDutyCoverage, deliveryMethods, deliveryOptions, shippingClass, incoterms

**Tab 4 — Reviews:**
- productReputation (overall score, dimension scores, highlights, cautions)
- reviews array
- Gated by account tier (blur + lock overlay for free users)

**Tab 5 — Attachments:**
- attachments array, grouped by category (spec sheets, certificates, images, manuals)
- Type icons, file sizes, descriptions

### SupplierSidebarCard (supplier-sidebar.jsx, ~780 lines)

See the `supplier-profile` skill for full documentation of the sidebar's GROUP A–E structure, visibility gating, and business hours display.

### ImageGallery (image-gallery.jsx)

- images array (thumbnail strip + main image viewer). On /deals listing cards, the `images` canonical maps to `image` (primary) and `imageHover` (secondary) flat strings.
- videoUrl — YouTube embed iframe, shown when a video thumbnail is clicked. Thumbnail appears in the thumbnail strip with a "VIDEO" label.
- Margin badge overlay showing markup percentage
- Lightbox for full-size viewing

---

## 5. Core Deal Fields (Always Present)

These foundational fields exist on every deal regardless of category:

**Identity:** id, title, slug, category, images, description, tags, brands.

**Pricing:** price, currency, priceUnit, rrp, rrpCurrency, markup.

**Order:** moq, moqUnit, availableQuantity.

**Identification codes:** sku, ean, mpn, asin, taric.

**Grade & status:** grade (enum: "New", "Used", "Outlet", "Mix / returns", "Refurbished", "Damaged"), isExpired.

**Location:** dealLocation, dealLocationCode, stockLocation, stockLocationCode, isDropship, negotiable. Note: `stockLocation` is a deal-level country override — when set, it takes precedence over `dealLocation` (supplier country) for display and filtering. Country derivation chain: `deal.stockLocation || supplier.address.country`.

**Marketplace data (system-added):** amazonPrice, amazonProfit, amazonSales, ebayPrice, ebayProfit, ebaySales. These are deal canonicals added by the system (not supplier-provided) and stored in the deals database table. They appear in the platforms comparison section of PricingPanel.

**Supplier object:** supplier.name, supplier.isVerified, supplier.isSupplierPro, supplier.rating, supplier.reviewCount, supplier.yearsActive, supplier.categories, supplier.address, supplier.contact, supplier.businessHours, supplier.currentTime.

---

## 6. Structured Object Conventions

Many fields use nested objects with consistent patterns:

**Money:** `{ amount: number, currency: string }` — used by mapPrice, samplePrice, freeShippingThreshold, lotRetailValue, omnibusPrice, originalPrice, costOfGoodsSold.

**Dimensions:** `{ length, width, height, unit, weight?, weightUnit? }` — used by packaging, dimensionsPerUnit, productDimensions.

**Logistics:** `{ unitsPerLayer, layersPerPallet, unitsPerPallet }` — palletConfiguration. `{ twentyFt, fortyFt, fortyHC }` — containerLoadQuantity.

**Rating/Score:** `{ overallScore, sourcesCount, dimensions[], highlights[], cautions[] }` — productReputation.

**Tiered:** `{ minQty, maxQty, price }` — priceTiers. `{ minQty, maxQty, days, label }` — leadTimeTiers. `{ minOrder, discount }` — discountTiers.

---

## 7. Category-Specific Rendering

Fields with a `categoryMask` in the schema are only relevant for certain product categories. The frontend handles this with null-safety — category-irrelevant fields are `null` and components skip rendering them.

**Category presets in demo-data.js:**
- `electronics-technology` — default preset, demonstrates specs, compliance, battery fields
- `clothing-fashion` — demonstrates fabricComposition, sizeChart, fitType, gender, gsm, careInstructions
- `health-beauty` — demonstrates inciList, spfRating, skinType, paoMonths, crueltyFree

**Null-safety convention:** All category-specific fields are set to `null` in non-applicable categories. Components always check for null/undefined before rendering any field section.

---

## 8. Enum Reference

Standardized controlled vocabularies used across the deal page:

- **grade:** "New", "Used", "Outlet", "Refurbished", "Damaged", "Mix / returns"
- **priceType:** "fixed", "average", "starting-from", "negotiable-only"
- **productStatus:** "active", "discontinued", "end-of-life", "pre-launch", "seasonal"
- **sellingUnit:** "Single item", "Set", "Pair", "Pack", "Box", "Roll", "Meter", "Ton", "Piece", "Pallet", "Container"
- **moqUnit:** "Units", "pieces", "lots", "trucks", "pallets", "pairs", "packs", "sets", "kilograms", "tonnes", "m²", "litres", "containers"
- **shippingClass:** "Standard", "Freight", "Oversized", "Hazmat", "Perishable"
- **incoterms:** "EXW", "FOB", "CIF", "DDP", "DAP", "FCA"
- **sampleAvailability:** "free", "paid", "on-request", "not-available"
- **leadTime:** "same-day", "1-2-days", "3-5-days", "1-2-weeks", "2-4-weeks", "4-8-weeks", "8-plus-weeks", "made-to-order"
- **seasonality:** "All Season", "Spring/Summer", "Autumn/Winter", "Holiday", "Back to School"

---

## 9. UI Patterns

### Pill Styling
All pills/tags/badges use `rounded-md` (not `rounded-full`). Exception: circular indicators (dots, avatars, progress rings) keep `rounded-full`.

### Gradient Headers
Pricing panel uses a slate gradient at the top: `from-slate-200/60 via-slate-100/30 via-[60%] to-transparent`. Supplier sidebar matches with a fixed `h-48` height cap.

### Payment Method Pills
Use `text-xs rounded-md` with `size={12}` icons for consistency with other pills.

### countNoun Pattern
MultiSelect dropdowns with `showCount` use `countNoun` prop: "1 country" / "3 countries". Auto-pluralisation handles consonant+y → -ies.

---

## 10. File Reference

| File | Lines | Contains |
|------|-------|----------|
| `src/components/deal-v2/single-deal-v2.jsx` | — | Page orchestrator, header, badges, social proof, category preset switcher |
| `src/components/deal-v2/pricing-panel.jsx` | ~691 | Pricing, margin, volume tiers, order terms, product specs |
| `src/components/deal-v2/product-tabs.jsx` | ~1216 | 5-tab content: description, specs, compliance, reviews, attachments |
| `src/components/deal-v2/supplier-sidebar.jsx` | ~780 | Supplier card (see `supplier-profile` skill) |
| `src/components/deal-v2/image-gallery.jsx` | — | Product images, margin badge, lightbox |
| `src/lib/demo-data.js` | — | All ~230 variables across Groups A–N, 3 category presets |
| `src/components/shared/form-fields.jsx` | ~2553 | Shared UI components used across deal and profile pages |

---

## 11. Related Skills

- **`supplier-profile`** — Supplier data model, form architecture, visibility gating, inheritance table
- **`deal-upload`** — Pipeline that populates deal variables (extraction, validation, enrichment)
- **`deal-upload-image-retrieval`** — Image sourcing strategy
- **`seo`** — SEO standards for deal page meta tags and structured data
- **`production-standards`** — API routes, auth gating, production deployment
- **`form-standards`** — Accessibility and form UX patterns
