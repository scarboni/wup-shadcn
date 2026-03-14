# Skill File Patches — March 2026 Schema Changes

These are the changes needed in two skill files to reflect the canonical schema updates made to `demo-data.js`, `deal-form.jsx`, `pricing-panel.jsx`, and `variable-reference.jsx`.

---

## 1. `deal-upload/SKILL.md`

### Line 163 — Remove `moqUnit` and `sellingUnit` from Order terms

**Before:**
```
Order terms: moq, moqUnit, sellingUnit, orderIncrement, availableQuantity, casePackSize, maxOrderQuantity, isIndivisibleLot, crossCategoryMOQ, multipackQuantity.
```

**After:**
```
Order terms: moq, orderIncrement, availableQuantity, casePackSize, maxOrderQuantity, isIndivisibleLot, crossCategoryMOQ, multipackQuantity. Note: `moqUnit` has been removed — it is now derived from `priceUnit` at display time in `pricing-panel.jsx`. `sellingUnit` has been removed — redundant with `priceUnit`.
```

### Line 169 — Rename `prop65Warning` → `regionalCompliance`

**Before:**
```
Compliance: hazmatInfo, warrantyInfo, prop65Warning, cpscCompliance, ...
```

**After:**
```
Compliance: hazmatInfo, warrantyInfo, regionalCompliance, cpscCompliance, ...
```

### Line 171 — Rename `productStatus` → `dealStatus`

**Before:**
```
Lifecycle: productStatus, launchDate, discontinuedDate, ...
```

**After:**
```
Lifecycle: dealStatus, launchDate, discontinuedDate, ...
```

### Line 180 — Remove `priceType`, note `targetAudience` is now an array

**Before:**
```
Commercial terms: mapPrice, netPaymentTerms, depositRequired, taxClass, priceType, priceTiers, omnibusPrice, discountPercentage, originalPrice, sellToPrivate, exportOnly, exportRegions, invoiceType, targetAudience.
```

**After:**
```
Commercial terms: mapPrice, netPaymentTerms, depositRequired, taxClass, priceTiers, omnibusPrice, discountPercentage, originalPrice, sellToPrivate, exportOnly, exportRegions, invoiceType, targetAudience. Note: `priceType` has been removed — redundant with the deal's pricing tiers and negotiable flag. `targetAudience` is now an array of strings (was string).
```

### New fields to add (anywhere in the EXTRACTED section)

Add `restrictionScope` and `restrictedContinents` to the shipping or compliance section:

```
Country restrictions: countryRestrictions (array of country codes), restrictionScope ("whitelist" | "blacklist" | null), restrictedContinents (array of continent codes | null).
```

### Note: `powerSource` type change

`powerSource` is now an array of strings (was string). e.g. `["Battery (rechargeable)"]` or `["Solar", "Battery (rechargeable)"]`.

---

## 2. `deal-page/SKILL.md`

### Line 71 — Remove `sellingUnit`

**Before:**
```
Fields: unitsSold, reorderRate, categoryRanking, samplePrice, shelfLife, shipsFrom, shipsFromCode, freeReturns, sellingUnit, orderIncrement, ecoFriendly (materials/packaging/production).
```

**After:**
```
Fields: unitsSold, reorderRate, categoryRanking, samplePrice, shelfLife, shipsFrom, shipsFromCode, freeReturns, orderIncrement, ecoFriendly (materials/packaging/production).
```

### Lines 81-82 — Rename `productStatus` → `dealStatus`, `prop65Warning` → `regionalCompliance`

**Before:**
```
- **G4. Lifecycle**: productStatus, launchDate, discontinuedDate, seasonality, bestBeforeDate
- **G5. Compliance**: prop65Warning, cpscCompliance, fdaRegistration, energyRating, sarValue, ipRating
```

**After:**
```
- **G4. Lifecycle**: dealStatus, launchDate, discontinuedDate, seasonality, bestBeforeDate
- **G5. Compliance**: regionalCompliance, cpscCompliance, fdaRegistration, energyRating, sarValue, ipRating
```

### Line 92 — Remove `priceType`

**Before:**
```
Fields: firstOrderDiscount, packageContents, priceType, compatibleWith.
```

**After:**
```
Fields: firstOrderDiscount, packageContents, compatibleWith.
```

### Line 126 — Remove `moqUnit` and `sellingUnit`

**Before:**
```
- Order terms: moq, moqUnit, sellingUnit, orderIncrement, casePackSize, availableQuantity, maxOrderQuantity
```

**After:**
```
- Order terms: moq, orderIncrement, casePackSize, availableQuantity, maxOrderQuantity
```

### Line 179 — Remove `moqUnit`

**Before:**
```
**Order:** moq, moqUnit, availableQuantity.
```

**After:**
```
**Order:** moq, availableQuantity.
```

### Lines 227-230 — Remove `priceType`, `sellingUnit`, `moqUnit` enums; rename `productStatus` → `dealStatus`

**Before:**
```
- **priceType:** "fixed", "average", "starting-from", "negotiable-only"
- **productStatus:** "active", "discontinued", "end-of-life", "pre-launch", "seasonal"
- **sellingUnit:** "Single item", "Set", "Pair", "Pack", "Box", "Roll", "Meter", "Ton", "Piece", "Pallet", "Container"
- **moqUnit:** "Units", "pieces", "lots", "trucks", "pallets", "pairs", "packs", "sets", "kilograms", "tonnes", "m²", "litres", "containers"
```

**After:**
```
- **dealStatus:** "active", "discontinued", "end-of-life", "pre-launch", "seasonal"
```

(`priceType`, `sellingUnit`, and `moqUnit` are removed entirely.)

### New: `regionalCompliance` data format

Add to the data format / conventions section:

```
**regionalCompliance**: Array of `{region: string, note: string}` objects. Replaces the old `prop65Warning` string field. Example:
  regionalCompliance: [
    { region: "California (Prop 65)", note: "This product contains chemicals known to the State of California to cause cancer." },
    { region: "EU REACH", note: "Contains SVHC above 0.1% — see SDS for details." }
  ]
```

---

## Summary of All Removals & Renames

| Old Field | Action | New Field / Notes |
|-----------|--------|-------------------|
| `moqUnit` | **REMOVED** | Derived from `priceUnit` at display time |
| `sellingUnit` | **REMOVED** | Redundant with `priceUnit` |
| `priceType` | **REMOVED** | Redundant with pricing tiers + negotiable flag |
| `productStatus` | **RENAMED** | → `dealStatus` |
| `prop65Warning` | **RENAMED + TYPE CHANGE** | → `regionalCompliance` (string → [{region, note}] array) |
| `targetAudience` | **TYPE CHANGE** | string → string[] |
| `powerSource` | **TYPE CHANGE** | string → string[] |
| `restrictionScope` | **NEW** | "whitelist" \| "blacklist" \| null |
| `restrictedContinents` | **NEW** | string[] \| null |
