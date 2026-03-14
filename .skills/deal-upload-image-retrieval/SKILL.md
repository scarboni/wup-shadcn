---
name: deal-upload-image-retrieval
description: "**WholesaleUp Deal Upload Image Retrieval**: Reference this skill whenever working on the deal/product upload pipeline, image handling for supplier-submitted products, product image sourcing, or the extraction pipeline's image-related logic. Covers the three-tier image retrieval strategy (auto-fetch from product codes, URLs in data files, placeholder fallback), integration with Keepa/eBay/Google Shopping APIs for image sourcing, schema definition for the `images` variable, listing completeness prompts, and the 'Deal Image Not Found' rejection path. Also covers image re-validation during deal edits — when a supplier changes images or product codes on an existing listing. MANDATORY TRIGGERS: deal upload, product upload, image retrieval, product images, supplier images, image pipeline, Keepa images, auto-fetch images, listing completeness, image sourcing, product photos, deal image not found, image edit, image re-validation"
---

# Deal Upload Image Retrieval

Reference document for how product images are sourced in the WholesaleUp deal upload pipeline. This skill exists because the image problem is non-obvious — our upload system accepts text/CSV files from suppliers, not form-based submissions with file pickers, so traditional "upload your images" flows don't apply.

Last updated: 2026-03-12

---

## Architecture Context

The WholesaleUp deal upload system works like this: a supplier uploads a single file (CSV, text blob, JSON, PDF, or Excel) containing product data. Our extraction pipeline — driven by a schema definition file covering 214 product variables — parses, classifies, extracts, and validates that data in three stages:

1. **Parse & Classify** — normalize input to plain text, detect product category via Google Product Taxonomy
2. **Extract & Validate** — LLM extracts structured fields, deterministic validation checks them (HIGH confidence fields gate-keep, MEDIUM confidence fields are best-effort)
3. **Margin Check** — validated product codes hit Keepa/eBay APIs for price verification

Images are handled across stages 2 and 3, not as a separate upload flow.

---

## The Three-Tier Image Strategy

Images follow a priority cascade. Each tier is a fallback for the one above it.

### Tier 1: Auto-Fetch from Product Code (Zero Supplier Effort)

This is the primary path for branded products. The pipeline already calls external APIs in Stage 3 (Margin Check) using validated product identifiers (EAN, GTIN, MPN, ASIN). Those same APIs return product images.

**Sources:**

- **Keepa API** — returns all Amazon listing images for a given ASIN or EAN. High-res, multiple angles, lifestyle shots. Best coverage for consumer goods.
- **eBay Browse API** — returns item images from active and completed listings by GTIN/MPN. Good secondary source, especially for niche products.
- **Google Shopping API** — returns product images by GTIN. Aggregates across retailers.
- **Open Food Facts** — free database with product images indexed by EAN. Excellent for food/beverage/cosmetics.
- **UPCitemdb / Barcodelookup** — barcode-to-product databases that include manufacturer images.

**Coverage estimate:** ~60-70% of branded, single-SKU products will get images this way. The supplier never has to think about images for these products.

**Limitations:** Does not work for unbranded goods, white-label products, custom/OEM items, assorted lots, liquidation pallets, or anything without a valid EAN/MPN in external databases. This is a significant portion of Merkandi-style marketplace inventory.

**Implementation notes:**
- The Keepa/eBay calls are already happening for margin verification — image retrieval is a near-zero marginal cost addition
- Prefer Keepa images when available (highest resolution, most angles)
- De-duplicate across sources (same product image may appear on Amazon and eBay)
- Store fetched images in S3/R2 immediately — don't rely on external URLs persisting

### Tier 2: URLs in the Data File (Supplier-Provided)

When auto-fetch fails or returns no images, the pipeline checks whether the supplier included image references in their upload. The `images` variable in the schema definition handles this extraction.

**What the LLM looks for in the supplier's data:**

- **Direct image URLs** — `https://example.com/product-photo.jpg`, Dropbox/Google Drive public links, hosted image URLs. The most common pattern for suppliers who already have images somewhere.
- **Product page URLs** — `https://amazon.co.uk/dp/B09XXXXX`, `https://ebay.com/itm/12345`, or the supplier's own website product page. The pipeline detects these as page URLs (not direct image URLs) and scrapes the product images from them.
- **Shared folder links** — Google Drive folder, Dropbox folder, or WeTransfer link containing multiple product images. The pipeline fetches folder contents and matches images by filename.

**In CSV uploads**, image URLs go in a column (the schema's synonym list matches common header names: "images", "image", "photo", "picture", "image_url", "foto", "bild", "imagen", "product_image", "image_link", "picture_url", "photos"). Multiple URLs are comma-separated or pipe-separated.

**In unstructured text**, the LLM identifies anything that looks like an image reference — URLs ending in image extensions, URLs from known image hosting domains, or URLs from known marketplace domains.

**Post-extraction processing:**
- HEAD request to verify URL is reachable and returns an image content-type
- Download and store in S3/R2
- Generate thumbnails and optimized sizes
- For product page URLs: scrape page, extract `<img>` tags or Open Graph images, store the results

### Tier 3: No Images → Deal Image Not Found (Rejection)

When both auto-fetch and supplier-provided URLs yield nothing, the deal is **rejected** with the status "Deal Image Not Found". Every listed deal must have at least one product image — deals without images are not listed.

**What happens:**
- The deal is rejected with specific feedback: *"No product image could be found for [product title]. Please provide at least one image URL in your upload data, or ensure the product's EAN/ASIN is correct so we can auto-fetch images."*
- The supplier dashboard (`/dashboard/upload-deals`) shows the rejection reason alongside other rejection types (Out of Margin, validation failures)
- The supplier can fix the issue by re-uploading with image URLs included, or by correcting the product identifier so auto-fetch succeeds
- A ZIP companion upload option allows suppliers to upload images in bulk, named by SKU: `SKU123_1.jpg`, `SKU123_2.jpg`

The key insight: unlike margin or validation issues, image availability is partly outside the supplier's control (Tier 1 auto-fetch depends on the product existing in external databases). The feedback should be constructive and suggest both paths: provide URLs directly, or verify the product code.

---

## Schema Definition for `images`

The `images` variable in the product schema has special handling compared to other variables.

```
Field: images
Type: array<object>
Confidence: MEDIUM (product can list without images)
Category mask: * (universal — all products need images)
Synonyms: ["images", "image", "photo", "picture", "foto", "bild",
           "imagen", "product image", "image_url", "image_link",
           "picture_url", "photos", "product_image", "immagine",
           "afbeelding", "Produktbild", "photo produit"]
Extraction hint: "Look for URLs pointing to images (endings like .jpg,
  .jpeg, .png, .webp, .gif) or URLs from known image hosting services
  (imgur, cloudinary, unsplash, google drive, dropbox). Also identify
  product page URLs from marketplaces (amazon, ebay, alibaba) or
  supplier websites — these will be scraped for images separately."
Validation: Each entry must be a valid URL. HEAD request confirms
  reachability and image content-type (image/jpeg, image/png, image/webp).
```

**Each stored image has metadata:**

```json
{
  "url": "https://cdn.wholesaleup.com/products/abc123/1.jpg",
  "source": "auto-fetched",
  "sourceApi": "keepa",
  "originalUrl": "https://m.media-amazon.com/images/I/71xxxxx.jpg",
  "position": 1,
  "width": 1500,
  "height": 1500,
  "fetchedAt": "2026-03-10T14:30:00Z"
}
```

**Source values:**
- `"auto-fetched"` — retrieved via product code from Keepa/eBay/Google Shopping (Tier 1)
- `"supplier-provided"` — URL found in the supplier's data file (Tier 2)
- `"supplier-uploaded"` — manually uploaded after listing creation (Tier 3 gap-fill)
- `"scraped"` — extracted from a product page URL the supplier provided (Tier 2 variant)
- `"placeholder"` — generic category placeholder (Tier 3)

This `source` field enables frontend trust signals: "Verified product images" for auto-fetched vs "Supplier photos" for supplier-provided.

---

## MVP Scope

For MVP launch, the image pipeline needs:

1. **Tier 1 auto-fetch** — this covers the majority of branded products and requires zero supplier effort. The API integrations (Keepa, eBay) are already needed for margin verification, so the incremental cost is just storing and serving the images.

2. **Tier 2 URL extraction** — the schema definition's `images` variable with synonym list and extraction hint. The LLM already extracts all other variables from supplier data; images are just another field.

3. **Tier 3 placeholder** — a simple fallback. The listing completeness notification can be a basic email or dashboard badge.

**Deferred (post-MVP):**
- Product page scraping (Tier 2 variant — technically complex, legal considerations)
- Shared folder link fetching (Google Drive/Dropbox API integrations)
- ZIP companion upload (requires multi-file upload UI)
- Image quality scoring (auto-detect blurry, too small, watermarked)
- Duplicate image detection across listings

---

## Decision Log

### Why not a traditional image upload form?

The deal upload system is file-based (text/CSV), not form-based. Adding a separate image upload step would break the single-file simplicity of the onboarding flow and add friction for suppliers. The three-tier approach lets most suppliers skip image handling entirely.

### Why not email-based, FTP, or WhatsApp image submission?

These assume interaction channels that don't exist in our architecture. The system is: upload a file → pipeline processes it → product lists. There's no email inbox, FTP server, or WhatsApp integration in the loop. Options that require those channels were eliminated during architecture review.

### Why auto-fetch before supplier-provided?

Supplier-provided images are often low quality (phone photos, watermarked, wrong aspect ratio). Images from Keepa/Amazon are high-res, professionally shot, and consistent. For branded products, auto-fetched images are almost always better. Supplier-provided images take precedence only when auto-fetch returns nothing.

### Why block listings without images?

Deals without images are rejected as "Deal Image Not Found". While this does exclude some products (especially unbranded lots, white-label, or niche B2B items that don't exist in external databases), the tradeoff is worth it — listings without images receive negligible buyer interest and lower the perceived quality of the marketplace. The three-tier auto-fetch strategy minimizes the impact by sourcing images automatically for the majority of branded products.

---

## Image Re-Validation on Deal Edit

When a supplier edits an existing deal, image re-validation is triggered in two scenarios:

**1. Supplier changes the image URLs directly.** The pipeline re-validates the new URLs (HEAD request, content-type check, reachability). If the new images are invalid or unreachable, the deal is marked as Sold Out and the edit is rejected: *"The new image URL is not reachable. The deal has been marked as Sold Out. Provide a valid image URL to restore it."*

**2. Supplier changes the product identifier (EAN/MPN/ASIN).** Since the product identity has changed, the old auto-fetched images may no longer be correct. The pipeline re-runs Tier 1 auto-fetch with the new product code. If no images are found for the new code and no supplier-provided URLs exist, the deal is marked as Sold Out with "Deal Image Not Found".

In both cases, the Sold Out + rejection pattern matches the deal-upload edit flow documented in the `deal-upload` skill. The supplier can fix the issue and re-submit to restore the deal.

**When image re-validation is NOT needed:** Changes to description, price, MOQ, payment terms, shipping, or any non-image, non-identifier field. These are direct updates.
