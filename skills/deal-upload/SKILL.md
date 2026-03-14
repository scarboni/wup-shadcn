---
name: deal-upload
description: "**WholesaleUp Deal Upload Pipeline**: Reference for the supplier deal/product upload system, extraction pipeline, schema definition, and supplier onboarding data flow. Also covers the deal edit/update flow — file re-upload or individual edit, enquiry snapshots, re-validation rules, and sold-out-on-failed-edit. Covers three-stage architecture (Parse & Classify → Extract & Validate → Margin Check), four data source types, confidence tiers, schema-as-extraction-engine, and RRP/margin verification. MANDATORY TRIGGERS: deal upload, product upload, extraction pipeline, supplier onboarding, schema definition, deal variables, product variables, CSV upload, data extraction, margin check, RRP lookup, price validation, deal creation, listing creation, deal edit, deal update, re-upload, bulk edit, enquiry snapshot, sold out on edit"
---

# WholesaleUp Deal Upload Pipeline

Architecture reference for the system that turns supplier-submitted product data into live deal listings. This is the single most important data flow in WholesaleUp — every deal on the platform starts here.

Last updated: 2026-03-13

---

## How It Works (Overview)

A supplier uploads a single file — CSV, text blob, JSON, PDF, Excel, or even an image of a spec sheet. The pipeline turns that file into one or more fully structured deal listings with validated data, market pricing, and product images. No forms, no field-by-field entry. One file in, structured listings out.

The pipeline has three stages:

1. **Parse & Classify** — normalize any input to plain text, detect product category
2. **Extract & Validate** — LLM extracts ~130 product variables, deterministic validation checks them
3. **Margin Check & Enrichment** — external APIs verify pricing, fetch images, populate market data

The entire pipeline is driven by a **schema definition file** — a single JSON/YAML artifact where each of the ~230 product variables is defined with its type, validation rules, confidence tier, category mask, synonyms, and extraction hint. When you add a new variable, you add it to the schema. The extraction prompt, validation layer, database schema, and frontend display all inherit from it automatically.

---

## Current Status & Dependencies

### Schema definition file: NOT YET CREATED

The schema definition file is the foundation of this pipeline and has not been built yet. Before it can be created, one prerequisite remains:

1. **Variable audit completion** — All ~230 product variables have been cataloged in `demo-data.js` (Groups A through N), but the final verification pass is still in progress.

**Resolved dependency:** Supplier profile normalization is complete. The supplier-profile skill documents the canonical supplier data model, including all fields, validation rules, and the inheritance table that defines which supplier fields serve as deal defaults. See the `supplier-profile` skill for the authoritative reference.

### Image retrieval: DOCUMENTED

The image pipeline is fully designed. See the `deal-upload-image-retrieval` skill for the three-tier strategy (auto-fetch from product codes → URLs in data file → placeholder with completeness prompt).

---

## Stage 1: Parse & Classify

Accept any input format. Don't try to structure it yet.

**Input formats supported:**
- CSV / TSV (structured, column headers)
- Plain text blob (unstructured, free-form)
- JSON (structured, key-value)
- PDF (OCR if scanned, text extraction if digital)
- Excel / XLSX (structured, possibly multi-sheet)
- Images of spec sheets (OCR → text)

**Process:**
1. Normalize to plain text. For CSV, preserve column headers as context. For PDF/images, run OCR. For Excel, extract all sheets as text with sheet names preserved.
2. Run a lightweight LLM call to detect the product category using Google Product Taxonomy codes. The category determines which subset of variables to extract — apparel fields aren't relevant for electronics, food fields aren't relevant for fashion.
3. If the file contains multiple products (common in CSV uploads), detect row boundaries and process each product independently through Stages 2 and 3.

**Output:** Normalized text + detected Google Product Taxonomy category code for each product.

---

## Stage 2: Extract & Validate

This is where the schema definition drives everything. The extraction prompt receives the normalized text plus the category-filtered schema definition (only EXTRACTED variables, filtered by category mask — see "Four Data Sources" below).

### The Extraction Prompt

The prompt tells the LLM: "Extract values for these fields from the supplier data. Return JSON matching this schema. For each field, indicate your confidence (high/medium/low)."

The LLM returns structured JSON. Then deterministic validation runs.

### Confidence Tiers

Every variable in the schema has a confidence tier that determines how validation failures are handled.

**HIGH confidence (3 gatekeeper fields) — rejection on failure:**

These three fields must be present and valid or the product is rejected with specific feedback to the supplier.

1. **title** — Must be specific and descriptive, not generic. "Samsung Galaxy S24 Ultra 256GB Phantom Black" passes. "Phone" or "Electronics item" fails. Feedback: *"Product name is too generic. Please provide a specific product name including brand, model, and key specifications."*

2. **Product identifier (ean, mpn, or asin)** — At least one must be present and valid. EAN/GTIN must pass checksum validation. MPN must match a recognizable format. Feedback: *"EAN '123456' is not a valid 13-digit barcode"* or *"No recognizable product identifier found — please include EAN, UPC, or MPN."*

3. **price** — Must be a valid number with recognizable currency. Feedback: *"Wholesale price missing or not parseable."*

If ANY of these three fail validation, the product is rejected immediately. The supplier gets specific, actionable feedback telling them exactly what's wrong and how to fix it.

**MEDIUM confidence (everything else) — best-effort, null on failure:**

For all other fields (~127 remaining extraction targets): if the LLM extracted a value and it passes validation, keep it. If the LLM wasn't confident or the value fails validation, set it to `null`. The product still lists — just with fewer populated attributes. Missing medium-confidence fields reduce listing completeness but don't block the deal.

### Validation Rules (per variable type)

The schema definition specifies validation rules for each variable. Common patterns:

- **Enum fields** — value must be in the allowed list (e.g., grade: "New", "Used", "Outlet", "Refurbished", "Damaged", "Mix / returns")
- **Numeric fields** — must be a valid number, optionally within a min/max range (e.g., moq: integer, min 1)
- **Checksum fields** — EAN-13 uses the GS1 check digit algorithm, TARIC codes have format validation
- **URL fields** — must be a valid URL, optionally with a HEAD request to confirm reachability
- **Date fields** — must be a valid ISO 8601 date
- **Object fields** — each sub-field has its own type and validation (e.g., packaging: { length: number, width: number, height: number, unit: enum })

---

## Stage 3: Margin Check & Enrichment

With a validated product identifier (EAN/ASIN/MPN) from Stage 2, call external APIs to enrich the listing and verify commercial viability.

### RRP / Market Price Resolution

The pipeline needs a market price (RRP/MSRP) to calculate margin. This follows a three-step fallback:

1. **Supplier-provided RRP** — if the supplier included RRP/MSRP in their data and it was extracted in Stage 2, use it directly. No external lookup needed. Many suppliers know and provide their product's retail price.

2. **RRP/MSRP lookup by product code** — if the supplier didn't provide RRP, use the validated EAN/MPN/ASIN to look up the manufacturer's recommended retail price from product databases, brand catalogues, or structured pricing sources. This is the "official" RRP.

3. **Market price derivation from Amazon/eBay** — if no official RRP/MSRP can be found, derive a market price from actual selling prices:
   - **Keepa API** — Amazon price history (current price, average price, lowest price over 90 days)
   - **eBay completed listings API** — actual sold prices for the same product
   - Use the lowest current market price as the reference for margin calculation.

The key distinction: steps 2 and 3 are only needed when the supplier doesn't provide RRP. When the supplier includes it, the pipeline skips straight to margin calculation.

### Margin Calculation

Compare the supplier's wholesale price against the resolved market price. If margin is below the category threshold, reject with specific feedback:

*"Wholesale price €X.XX does not meet minimum margin for [Category] (current market price: €Y.YY, required margin: Z%)."*

Category thresholds account for typical marketplace fees, shipping, and returns — they differ between electronics (lower margin acceptable) and fashion (higher margin expected).

### Image Retrieval

Handled by the three-tier strategy documented in the `deal-upload-image-retrieval` skill:
- **Tier 1:** Auto-fetch from product code via Keepa/eBay/Google Shopping APIs (same APIs used for margin check — near-zero marginal cost)
- **Tier 2:** URLs extracted from the supplier's data file in Stage 2
- **Tier 3:** Placeholder + listing completeness prompt

### Other Enrichment

- **productReputation** — aggregated review scores from external platforms
- **estimatedDeliveryRange** — calculated from leadTime + current date
- **comparisonPrice** — how this deal's price compares to market average
- **platforms** — marketplace pricing comparison cards (Amazon, eBay, etc.)

---

## Four Data Sources

Not all ~230 variables come from the supplier's data file. The schema definition file includes a `dataSource` field for each variable that determines where its value comes from. This is critical for the extraction prompt — only EXTRACTED variables should be sent to the LLM.

### EXTRACTED (~130 variables)

Data the supplier provides in their product data file. The LLM extraction prompt targets these.

Core identity and pricing: title, sku, ean, mpn, price, currency, priceUnit, rrp (when supplier-provided), brands, grade, description, tags, category.

Product specifications: specifications, variants, materials, packaging, packageContents, compatibleWith, productLanguage, manufacturingCountry, powerSource, assemblyRequired, batteryInfo.

Order terms: moq, orderIncrement, availableQuantity, casePackSize, maxOrderQuantity, isIndivisibleLot, crossCategoryMOQ, multipackQuantity. Note: `moqUnit` removed — now derived from `priceUnit` at display time in `pricing-panel.jsx`. `sellingUnit` removed — redundant with `priceUnit`.

Shipping details: stockLocation, stockLocationCode, shippingTime, shippingCountries, shippingScope, shippingContinents, shippingClass, shippingCarrier, shippingCostBearer, shippingCostMethod, incoterms, readyToShip, portOfOrigin, deliveryOptions. Note: `stockLocation` is the country where stock is physically held. When set, it overrides the supplier country on the listing (country derivation: `deal.stockLocation || supplier.address.country`).

Logistics: palletConfiguration, containerLoadQuantity, stackable, grossWeight, netWeight, dimensionsPerUnit, productDimensions, packagingFormat, despatchUnitIndicator.

Compliance: hazmatInfo, warrantyInfo, regionalCompliance, cpscCompliance, fdaRegistration, energyRating, sarValue, ipRating, hazardSymbols, reachSvhcDeclaration, rohsCompliance, weeeClassification, countryRestrictions, restrictionScope, restrictedContinents, ageRestriction. Note: `prop65Warning` renamed to `regionalCompliance` — now an array of `{region, note}` objects (e.g., `[{region: "California (Prop 65)", note: "..."}]`). `restrictionScope` ("whitelist" | "blacklist" | null) and `restrictedContinents` (string[] | null) are new fields.

Lifecycle: dealStatus, launchDate, discontinuedDate, seasonality, bestBeforeDate, priceValidUntil, offerValidityDays. Note: `productStatus` renamed to `dealStatus`.

Category-specific — Apparel: fabricComposition, gsm, careInstructions, fitType, gender, sizeChart, pattern, predominantSizes, seasonSortable.
Category-specific — Food: ingredients, allergens, dietaryTags, nutritionalInfo, storageInstructions, shelfLife, organicCertification, kosherHalal, countryOfHarvest, abv, vintageYear, gmoDeclaration, storageTemperatureRange.
Category-specific — Beauty: inciList, spfRating, skinType, paoMonths, crueltyFree, dermatologicallyTested.
Category-specific — Industrial: toleranceSpecs, pressureRating, temperatureRange, threadType, materialGrade.

Trust and lot indicators: authenticityGuarantee, imagesRepresentative, isAssortedLot, lotComposition, sourceRetailers, stockOrigin, isManifested, lotRetailValue, functionalRate, hasOriginalLabels, labelCondition, mayContainDuplicates, gradeNotes, gradeCategory, warranty, dealReturnPolicy.

Commercial terms: mapPrice, netPaymentTerms, depositRequired, taxClass, priceTiers, omnibusPrice, discountPercentage, originalPrice, sellToPrivate, exportOnly, exportRegions, invoiceType, targetAudience. Note: `priceType` removed — redundant with pricing tiers and negotiable flag. `targetAudience` is now string[] (was string). `powerSource` (in Product specifications above) is now string[] (was string).

B2B: isDropship, negotiable, leadTimeTiers.

SEO/discovery: searchKeywords, productHighlights, gpcCode, gln, itemGroupId, countryOfLastProcessing.

Images and media: images (URLs in data — see image retrieval skill), videoUrl, attachments.

### INHERITED (~30 variables)

Data from the supplier's profile, copied to the deal at listing time. The extraction prompt should NOT include these — they come from a different data source entirely. See the `supplier-profile` skill for the canonical definitions of all supplier-level fields.

**Supplier profile defaults (overridden by deal-level values when present):**

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

**Supplier profile fields copied directly (no deal-level override):**

supplier (whole object), leadTime, sampleAvailability, samplePrice, sampleLeadTime, minimumOrderAmount, minimumOrderCurrency, catalogueSize, discountTiers, discountNotes, supplyModels, productQualityTier, supplierBusinessType.

**Supplier capability fields:**

whiteLabeling, productInsurance, qualityInspection, customizationAbility, exclusivityAvailable, supplyAbility, showroomAvailable, euResponsiblePerson.

**Location-derived fields:**

dealLocation, dealLocationCode, shipsFrom, shipsFromCode, freeShippingThreshold, testerOption, paymentOptions, freeReturns, costOfGoodsSold, importDutyCoverage, brandTier.

### API Resolution Strategy

For each inherited field with an override pattern: if `deal.fieldName` is null or empty, copy `supplier.fieldName` into the deal object before sending to frontend. This keeps the frontend simple — it always reads from `deal.*`.

### ENRICHED (~10 variables)

Populated by external API calls or calculations in Stage 3 and post-processing. Never provided by the supplier.

Market data: rrp (when not supplier-provided), rrpCurrency, markup, platforms, comparisonPrice, productReputation.

Marketplace data (system-added deal canonicals): amazonPrice, amazonProfit, amazonSales, ebayPrice, ebayProfit, ebaySales. These are added by the system to the deals database table — not supplier-provided but canonical deal fields used in pricing panel platform comparison and deal card display.

Calculated: estimatedDeliveryRange, carbonFootprint.

External services: paymentFinancing.

### PLATFORM (~25 variables)

Generated by WholesaleUp. Analytics, badges, rankings, system-managed fields.

System: id, dateAdded, isExpired, slug, metaTitle, metaDescription, categoryBreadcrumb.

Analytics: viewCount, inquiryCount, unitsSold, reorderRate, categoryRanking.

Badges and promotions: isBestseller, isNew, orderProtection, frequentlyBoughtTogether, firstOrderDiscount, lowStockWarning, promotionalBadge, weeksBestOffer, platformExclusive, supplierIsCertified, supplierResponseBadge, freeDelivery.

---

## Schema Definition File Structure

The schema definition file is the single source of truth. It has not been built yet (see "Current Status" above), but when built, each variable will have this structure:

```yaml
title:
  type: string
  dataSource: extracted
  confidence: high
  categoryMask: "*"
  validation:
    minLength: 5
    pattern: "must contain brand or product type"
  synonyms:
    - "product name"
    - "product title"
    - "item name"
    - "article"
    - "nom du produit"
    - "Produktname"
    - "nombre del producto"
    - "nome prodotto"
  extractionHint: >
    The specific product name including brand, model, and key
    distinguishing features. Should be descriptive enough that
    a buyer knows exactly what they're getting. Not a generic
    category name.
  displayGroup: "identity"
  displayOrder: 1
```

**Schema consumers:**

1. **Extraction prompt** — receives only `dataSource: extracted` variables, filtered by `categoryMask` against the detected product category. Uses `synonyms` and `extractionHint` to guide the LLM.

2. **Validation layer** — uses `validation` rules and `confidence` tier to determine pass/fail/null behavior.

3. **Database schema** — all variables, all data sources. `type` maps to database column types.

4. **Frontend display** — uses `displayGroup` and `displayOrder` to render variables in the deal page component groups. See the `deal-page` skill for frontend display architecture.

5. **Deal creation logic** — merges EXTRACTED output + INHERITED supplier fields (see inheritance table above) + ENRICHED API results + PLATFORM defaults into the final deal object.

---

## Prompt Size Considerations

After category mask filtering, the extraction prompt will contain ~100+ variable definitions. With synonym lists and extraction hints, each definition is ~5-8 lines. That's 500-800 lines of schema in a single prompt.

This is within current LLM context windows, but if it becomes unwieldy:
- Add a `priority` field to the schema (1 = core fields, 2 = extended, 3 = long-tail)
- Extract in two passes: priority 1-2 first, then priority 3 in a follow-up call with the remaining fields
- Monitor extraction accuracy — if it degrades with prompt length, split is justified

---

## Pipeline Output

When the pipeline completes successfully, it produces a deal object with:
- All EXTRACTED fields populated (validated) or null (medium-confidence, couldn't extract)
- All INHERITED fields copied from the supplier profile (see inheritance table)
- All ENRICHED fields populated from external APIs
- All PLATFORM fields set to defaults (analytics at zero, badges off, system IDs assigned)
- Images attached (from auto-fetch, supplier URLs, or placeholder)
- A **listing completeness score** — percentage of non-null fields out of category-relevant fields

The supplier sees a preview of their listing with:
- Populated fields highlighted in green
- Missing fields highlighted in amber with "add this to improve your listing" prompts
- Any validation failures in red with specific fix instructions
- The calculated margin and market price comparison

---

## Deal Edit & Update Flow

Suppliers need to modify existing listings after initial upload — price changes, stock updates, new terms, corrected descriptions. The edit flow reuses the same pipeline infrastructure but with different matching and validation rules.

### Two Edit Modes

**File re-upload (bulk edit):** The supplier uploads a new file through `/dashboard/upload-deals`. The pipeline runs Stages 1-3, but before creating new deals, it matches incoming rows against existing listings by product identifier (EAN/ASIN/MPN + supplier ID). Matched rows update the existing deal. Unmatched rows create new deals. The supplier sees a preview:

*"3 deals updated, 2 new deals created, 1 deal not found in your current listings."*

**Individual deal edit:** The supplier edits fields directly on a specific deal within `/dashboard/upload-deals`. Changes save to the listing and trigger field-level re-validation where applicable.

### Update In Place, Snapshot On Enquiry

When a supplier edits a deal, the live listing updates directly. No new deal is created, no sold-out clone. One product = one listing = one URL = one SEO footprint.

But when a buyer has an **active enquiry** on that deal, the system snapshots the deal's commercial terms at the moment of enquiry. The negotiation references the snapshot, not the live listing. This means:

- The supplier can update their listing freely (new price, new MOQ, new stock level)
- Buyers browsing the marketplace see the latest data
- Buyers in active negotiations still see and reference the terms they enquired about
- If updated terms are materially different (price changed >5%, MOQ changed), the system notifies active enquirers: *"The supplier has updated this deal since your enquiry. [View changes]"*

**What to snapshot on enquiry:** Price, currency, MOQ, available quantity, payment terms, deposit, delivery terms. Descriptions and specs aren't part of commercial negotiations and don't need snapshotting.

**Why not sold-out + new listing for every edit?** A supplier updating pricing weekly would generate 52 "sold out" listings per year per product. That pollutes search results, inflates the database, and makes the supplier's profile look like a graveyard of dead deals. Sold-out status should mean the product is genuinely no longer available, not that the terms changed.

### Re-Validation Rules

Not every field change needs full pipeline re-validation. The pipeline only re-runs validation and enrichment when fields that affect commercial viability or identity are changed.

| Field changed | Re-validation needed? |
|---|---|
| Price, RRP, currency | Yes — full margin re-check (see `rrp-data` skill) |
| Product identifier (EAN/MPN/ASIN) | Yes — identity validation + new RRP lookup + image re-fetch |
| Images | Yes — image validation only (see `deal-upload-image-retrieval` skill) |
| Title | Yes — specificity check (HIGH confidence gatekeeper) |
| Description, tags, specs | No — direct update |
| MOQ, payment terms, shipping | No — direct update |
| Available quantity → 0 | Auto-mark as Sold Out |

### Failed Re-Validation → Sold Out + Rejection

If a supplier edits a deal and the changed fields fail re-validation (e.g., new price falls out of margin, new images are invalid, changed EAN fails checksum), the pipeline does not silently keep the old version live. Instead:

1. The existing live deal is marked as **Sold Out**
2. The edit is **rejected** with specific feedback explaining the failure
3. The supplier can submit a corrected edit to restore the deal

This is the correct use of Sold Out — the deal as listed is genuinely no longer valid because the supplier submitted terms that don't pass the pipeline's requirements. It's a real state change, not a metadata tweak. And unlike a "sold out on every edit" approach, this only happens on validation failure, which should be rare.

**Rejection feedback examples:**

- Price edit fails margin: *"Your price update to €X.XX does not meet minimum margin for [Category]. The deal has been marked as Sold Out. Submit a corrected price of €A.AA or below to restore it."*
- Image edit fails: *"The new image URL is not reachable. The deal has been marked as Sold Out. Provide a valid image URL to restore it."*
- EAN edit fails: *"The updated EAN '12345' is not a valid 13-digit barcode. The deal has been marked as Sold Out. Correct the EAN to restore it."*

### Database Implications

The edit/update flow requires:

- **Deal matching index:** Composite index on `(supplier_id, ean)`, `(supplier_id, asin)`, `(supplier_id, mpn)` for efficient file-to-deal matching during bulk re-upload
- **Enquiry snapshots table:** Stores the snapshotted commercial terms at enquiry time, linked to the enquiry ID and deal ID
- **Deal audit log:** Records every field change with timestamp, old value, new value, and whether re-validation was triggered — essential for dispute resolution and supplier support

---

## Related Skills

- **`supplier-profile`** — Canonical reference for all supplier-level fields, validation rules, reference data arrays, and the inheritance table defining which supplier fields serve as deal defaults
- **`deal-upload-image-retrieval`** — Three-tier image retrieval strategy; also applies to image changes during deal edits
- **`rrp-data`** — RRP/market price API landscape and margin calculation; re-invoked when price fields change during deal edits
- **`deal-page`** — Frontend display architecture for the ~230 deal variables across pricing panel, product tabs, supplier sidebar, and image gallery
- **`seo`** — SEO standards for deal pages
- **`production-standards`** — Production deployment requirements
