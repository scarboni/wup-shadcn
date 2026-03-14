/* ─────────── Placeholder Deal Data (H1) ─────────────────────
   PRODUCTION: Replace with data from API:
   - DEAL           → GET /api/deals/[id] (returns deal + supplier + related)
   - RELATED_DEALS  → included in the above response
   - MOST_POPULAR   → GET /api/deals?sort=popular&limit=10
   SEED: prisma/seed.ts → seedDeals(), seedTestimonials(), seedPlatformStats()
   Auth gated at page.tsx level (C16).

   🔧 PRODUCTION SEO — Product JSON-LD (schema.org/Product):
   When data comes from the API, emit a <script type="application/ld+json"> with:
   {
     "@context": "https://schema.org", "@type": "Product",
     "name": deal.title, "description": deal.description, "image": deal.images[0],
     "sku": deal.sku, "gtin13": deal.ean,
     "brand": { "@type": "Brand", "name": deal.brands[0].name },
     "offers": {
       "@type": "Offer",
       "price": deal.price,
       "priceCurrency": deal.currency === "€" ? "EUR" : "GBP",
       "availability": deal.isExpired ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
       "seller": { "@type": "Organization", "name": deal.supplier.name },
       "priceValidUntil": "YYYY-12-31"
     },
     "aggregateRating": {  // Only if supplier has reviews
       "@type": "AggregateRating",
       "ratingValue": deal.supplier.rating,
       "reviewCount": deal.supplier.reviewCount
     }
   }
   See pricing.jsx FAQSection for working JSON-LD pattern using useMemo + dangerouslySetInnerHTML.
   See also: SEO skill Section 5 (Structured Data) and Section 12.3 (Schema Map).

   🔧 PRODUCTION SEO — generateMetadata() in deal/page.tsx (L2):
   Convert static metadata export to async generateMetadata({ params }):
     const deal = await getDeal(params.slug);
     return {
       title: `${deal.title} — Wholesale Deal`,
       description: `Buy ${deal.title} wholesale. ${deal.currency}${deal.price}/unit. ${deal.markup}% markup.`,
       alternates: { canonical: `/deals/${params.slug}` },
       openGraph: { title: deal.title, images: [{ url: deal.images[0] }] },
     };
   ─────────────────────────────────────────────────────────── */

export const DEAL = {
  id: 6,
  title: "Midnight Chronometer – Crafted Precision for Timeless Elegance",
  images: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&h=800&fit=crop",
  ],
  price: 228.04,
  currency: "€",
  priceUnit: "/ Unit ex. VAT",
  rrp: 878.59,
  rrpCurrency: "€",
  markup: 201.8,
  dateAdded: "19/09/2023",
  grade: "New",
  country: "UK",
  countryName: "United Kingdom",
  moq: 12,
  sku: "MC-2023-0619",
  taric: "9101110000",
  ean: "7612532169421",
  asin: "B0D5F8P3KR",
  brands: [{ name: "Midnight", country: "CH" }],
  shippingTime: 14,
  // Volume pricing
  // Platform pricing
  platforms: [
    { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://amazon.com", color: "#FF9900" },
    { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://ebay.com", color: "#0064D2" },
    { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://amazon.com", color: "#FF9900" },
  ],
  // Deal details
  dealLocation: "United Kingdom",
  dealLocationCode: "gb",
  stockLocation: "",      // Deal-level country override — empty = use supplier country
  stockLocationCode: "",  // ISO code for stockLocation
  isDropship: false,
  negotiable: true,
  isExpired: false,
  availableQuantity: 400,
  paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
  deliveryOptions: ["Collection in person", "National delivery", "International delivery"],
  shippingCountries: "United Kingdom, France, Germany, Netherlands, Belgium, Ireland, Spain, Italy",
  // Description
  description: `This premium smartphone features a sleek design with a 6.7-inch AMOLED display, delivering vibrant colours and deep blacks for an immersive viewing experience. Powered by an octa-core processor with 8GB RAM, it handles multitasking and demanding applications with ease.

Key Specifications:
Depth: 9.1 mm | Weight: 222 g | Height: 162.3 mm | Width: 78.6 mm
Product Colour: Grey
Wi-Fi: 802.11a/b/g/n/ac/ax (Wi-Fi 6)
Processor Cores: 8 | USB Port: Yes
4G Bands: 700, 800, 850, 900, 1800, 1900, 2100, 2300, 2500, 2600 MHz

The device comes with a triple camera system featuring a 108MP main sensor, 12MP ultrawide lens, and 10MP telephoto lens with 3x optical zoom. The front camera offers a 12MP sensor for high-quality selfies and video calls.

OVER 20 YEARS OF TRUST – A family-owned business dedicated to creating safe and secure devices for over two decades. Our commitment to safety and quality ensures that our products are rigorously tested to meet the highest current standards. With a legacy of trust and reliability, this is a name you can depend on.

RELIABLE BUILD QUALITY – Crafted from aerospace-grade aluminium and Gorilla Glass Victus 2, the device ensures long-lasting durability. IP68 water and dust resistance means it can withstand submersion in up to 1.5 metres of water for 30 minutes.

BATTERY & CHARGING – The 5000mAh battery provides all-day usage on a single charge. Supports 45W wired fast charging, 15W wireless charging, and 4.5W reverse wireless charging for powering compatible accessories on the go.`,
  // Attachments from supplier
  attachments: [
    { name: "Product Specification Sheet.pdf", size: "1.2 MB", type: "pdf", category: "documents", description: "Full technical specs including dimensions, weight, materials and compliance details" },
    { name: "Wholesale Price List Q1 2026.xlsx", size: "340 KB", type: "xlsx", category: "documents", description: "Tiered pricing by order volume with MOQ breakpoints" },
    { name: "Certificate of Authenticity.pdf", size: "820 KB", type: "pdf", category: "certificates", description: "Official Samsung certificate confirming genuine product origin" },
    { name: "CE & UKCA Compliance.pdf", size: "156 KB", type: "pdf", category: "certificates", description: "Regulatory compliance documentation for UK and EU markets" },
    { name: "Product Images (High Res).zip", size: "8.4 MB", type: "zip", category: "media", description: "12 product photos — front, back, side angles and lifestyle shots" },
  ],
  // Tags
  tags: ["#samsung", "#galaxy m35", "#5g", "#grey", "#super amoled", "#6.6-inch", "#6gb ram", "#128gb", "#6000mah", "#fast charging", "#nfc", "#wi-fi 6", "#bluetooth 5.3", "#triple camera", "#50mp", "#8mp", "#2mp", "#13mp"],
  // Supplier
  supplier: {
    companyName: "Skybridge Electronics Ltd",
    isVerified: true,
    isSupplierPro: true, // PRODUCTION: from account tier — true = Supplier Pro, false = Supplier (standard)
    rating: 4.8,
    reviewCount: 24,
    yearsActive: 8,
    categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots"],
    moreCategories: 2,
    address: {
      country: "United Kingdom",
      countryCode: "gb",
      city: "Manchester",
      postalCode: "M1 1AD",
      street: "New Cathedral",
      addressLine2: "Unit 4B, Exchange Building",
    },
    companyWebsite: "sitename.com",
    /* PRODUCTION VARIABLE MAPPING — Account Profile canonical names:
       salutation            ← account_profiles.salutation (e.g. "Mr", "Mrs", "Dr")
       contact.name          ← account_profiles.firstName + lastName
       contact.roleInCompany ← account_profiles.roleInCompany (freetext)
       contact.mobileNumber  ← account_profiles.mobileNumber (required)
       contact.landlineNumber← account_profiles.landlineNumber (optional)
       contact.businessEmail ← account_profiles.businessEmail (required)
       contact.whatsappNumber← account_profiles.whatsappNumber (optional)
       contact.teamsHandle   ← account_profiles.teamsHandle (@handle format, optional)
       contact.linkedinUrl   ← account_profiles.linkedinUrl (personal LinkedIn, optional —
                                distinct from socialLinkedin which is the company page)
       languages             ← account_profiles.languages (required)
       companySize           ← account_profiles.companySize (dropdown range, e.g. "10-50")
       address.addressLine2  ← account_profiles.addressLine2 (flat/suite/floor, optional)

       facilitySize / facilitySizeUnit are set in Supplier Profile form
       (Reach & Operations tab → Facility section). */
    salutation: "Mrs",
    contact: {
      name: "Jane Collin",
      roleInCompany: "Store Manager — handles wholesale purchasing and supplier relationships",
      mobileNumber: "+44 7700 900123",
      landlineNumber: "+44 0203 0484377",
      businessEmail: "jane.collin@mobilewholesaler.co.uk",
      whatsappNumber: "+44 7700 900123",
      teamsHandle: "@janecollin",
      linkedinUrl: "https://linkedin.com/in/janecollin",
    },
    languages: ["English", "French", "Spanish"],
    /* businessHours uses the same schema as DEFAULT_BUSINESS_HOURS in form-fields.jsx
       (inherited from Supplier Profile form → Reach & Operations → Business Hours) */
    businessHours: {
      monday:    { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      tuesday:   { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      wednesday: { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      thursday:  { status: "open", slots: [{ open: "08:00", close: "16:00" }] },
      friday:    { status: "open", slots: [{ open: "08:00", close: "14:00" }] },
      saturday:  { status: "closed", slots: [{ open: "", close: "" }] },
      sunday:    { status: "closed", slots: [{ open: "", close: "" }] },
      holidays:  "",
    },
    currentTime: "10:12",
    // GROUP D — New supplier-level fields
    yearEstablished: 2016,
    onTimeDeliveryRate: 96.2,
    responseTime: "≤5h",
    companySize: "10-50", // canonical Account Profile field (dropdown range)
    facilitySize: 2000,
    facilitySizeUnit: "m²",
    customizationAbility: ["drawing-based", "sample-based", "full-customization"],
    // GROUP E — Supplier profile inherited fields (from supplier-profile-form.jsx)
    supplierType: ["wholesaler", "distributor"],
    buyerTypesServed: ["online-retailer", "marketplace-seller", "dropshipper", "shop-retailer"],
    customersServed: ["registered-companies", "sole-traders"],
    supplyModels: ["wholesale", "dropshipping", "white-label"],
    // GROUP F — Supplier branding (from supplier-profile-form.jsx → Reach & Operations tab)
    companyLogo: "/images/supplier-logo-placeholder.svg",
    socialFacebook: "https://facebook.com/mobilewholesaler",
    socialInstagram: "https://instagram.com/mobilewholesaler",
    socialLinkedin: "https://linkedin.com/company/mobilewholesaler",
    preferredCurrency: "GBP",
    // ── TAB 2: Products & Supply ──
    companyDescription: "We are a mobile phones and accessories wholesaler specializing in refurbished and liquidated stock from major retailers. Established in 2016, we serve online retailers, marketplace sellers, and authorized distributors across the UK and EU.",
    productsOffered: "Mobile phones, tablets, accessories, chargers, cases, screen protectors, and related electronics. Focus on mid-range and premium quality items from major brands.",
    productCategories: ["mobile-phones", "tablets", "mobile-accessories"],
    brandsDistributed: ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi"],
    productQualityTier: ["mid-range", "premium"],
    certifications: ["ce", "iso-9001", "rohs", "reach"],
    sampleAvailability: "paid",
    catalogueSize: "200-1000",
    // ── TAB 3: Orders & Payments ──
    minimumOrderAmount: 500,
    minimumOrderCurrency: "€",
    paymentMethods: ["bank-transfer", "credit-debit-card", "paypal", "bnpl"],
    paymentTerms: "Net 30 for verified accounts; prepayment for first orders",
    defaultDepositPercentage: 30,
    defaultDepositTerms: "30% deposit on order confirmation, 70% before shipping",
    defaultInvoiceType: "vat",
    sanitizedInvoice: "on-request",
    defaultTaxClass: "standard",
    returnPolicy: "30-day money-back guarantee on unopened items. Buyer pays return shipping. Refund processed within 5 business days.",
    discountTiers: [
      { currency: "€", minOrder: "2000", discount: "5" },
      { currency: "€", minOrder: "5000", discount: "10" },
      { currency: "€", minOrder: "10000", discount: "15" },
    ],
    discountNotes: "Discounts apply to single orders only and cannot be combined with promotional offers. Contact us for custom pricing on recurring wholesale contracts.",
    // ── TAB 4: Shipping & Reach ──
    deliveryMethods: ["dhl", "fedex", "dpd", "own-fleet"],
    leadTime: "3-5-days",
    defaultIncoterms: "DDP",
    countriesServed: ["GB", "DE", "FR", "NL", "BE", "ES", "IT", "PL", "SE"],
    excludedCountries: ["RU", "BY"],
  },
  // Related deals
  category: "Electronics & Technology",
  // ═══════════════ V2 ADDITIONS: 35 NEW VARIABLES ═══════════════
  // GROUP A — Supplier profile inherited fields
  certifications: ["ce", "iso-9001", "rohs", "reach"],
  returnPolicy: "30-day money-back guarantee on unopened items. Buyer pays return shipping. Refund processed within 5 business days.",
  leadTime: "3-5-days",
  sampleAvailability: "paid",
  minimumOrderAmount: 500,
  minimumOrderCurrency: "€",
  catalogueSize: "200-1000",
  supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal", "bnpl"],
  discountTiers: [
    { currency: "€", minOrder: "2000", discount: "5" },
    { currency: "€", minOrder: "5000", discount: "10" },
    { currency: "€", minOrder: "10000", discount: "15" },
  ],
  discountNotes: "Discounts apply to single orders only and cannot be combined with promotional offers. Contact us for custom pricing on recurring wholesale contracts.",
  supplyModels: ["wholesale", "dropshipping", "white-label"],
  productQualityTier: ["mid-range", "premium"],
  // Delivery methods — inherited from supplier profile unless deal overrides
  deliveryMethods: ["dhl", "fedex", "dpd", "own-fleet"],
  // GROUP B — New deal-level fields
  specifications: {
    "Display": '6.7" AMOLED, 120Hz',
    "Processor": "Octa-core 2.8GHz",
    "RAM": "8 GB",
    "Storage": "256 GB",
    "Battery": "5,000 mAh",
    "Charging": "45W Fast / 15W Wireless",
    "Camera": "108MP + 12MP + 10MP",
    "Water Resistance": "IP68",
  },
  variants: [
    { name: "Color", options: ["Phantom Black", "Cream", "Green", "Lavender"], selected: "Phantom Black" },
    { name: "Storage", options: ["128 GB", "256 GB", "512 GB"], selected: "256 GB" },
  ],
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  packaging: { length: 16.2, width: 7.8, height: 3.1, unit: "cm", weight: 0.22, weightUnit: "kg" },
  materials: "Aerospace-grade aluminium, Gorilla Glass Victus 2, stainless steel frame",
  productLanguage: ["English", "German", "French"],
  manufacturingCountry: "South Korea",
  manufacturingCountryCode: "kr",
  customizationOptions: [
    { name: "Custom packaging", extraCost: 1.50, currency: "€", minQty: 100 },
    { name: "Logo engraving", extraCost: 2.00, currency: "€", minQty: 50 },
  ],
  // GROUP C — Platform features
  productReputation: {
    overallScore: 4.8,
    sourcesCount: 18,
    lastUpdated: "Feb 2026",
    summary: "This product has strong positive reception across multiple retail and review platforms. Consistently rated highly for build quality, value for money, and accurate product descriptions. Buyers report reliable performance and good resale margins.",
    dimensions: [
      { label: "Product Quality", score: 4.9 },
      { label: "Value for Money", score: 4.7 },
      { label: "Accuracy of Description", score: 4.8 },
      { label: "Packaging Quality", score: 4.5 },
      { label: "Resale Performance", score: 4.8 },
    ],
    highlights: [
      "Consistently high ratings across Amazon, eBay and independent review sites",
      "Strong resale margins reported by multiple wholesale buyers",
      "Product quality matches or exceeds listing descriptions",
      "Low return rate compared to category average",
    ],
    cautions: [
      "Some variation in packaging quality reported across batches",
      "Limited colour options compared to competing products",
    ],
  },
  isBestseller: true,
  isNew: false,
  orderProtection: true,
  frequentlyBoughtTogether: [0, 2, 4],
  reviews: [
    { author: "TechTrader_UK", rating: 5, date: "2026-02-14", text: "Excellent margins on these. Build quality impresses customers and return rate is under 2%." },
    { author: "GadgetWholesale", rating: 4, date: "2026-01-28", text: "Good product, reliable supplier. Shipping was slightly slower than quoted but packaging was secure." },
    { author: "SmartRetail_DE", rating: 5, date: "2026-01-10", text: "Third reorder. Consistent quality across batches, customers love the battery life." },
  ],
  reviewSummary: "Highly rated by wholesale buyers for consistent build quality, strong resale margins, and low return rates. Minor notes on occasional shipping delays.",
  // GROUP E — Newly discovered deal-level variables (round 2)
  unitsSold: 1243,
  reorderRate: 31,
  categoryRanking: { rank: 3, category: "Smart Watches & Wearables" },
  samplePrice: { amount: 45.00, currency: "€" },
  shelfLife: "5 Years", // e.g. "3 Years" for cosmetics/food — null for electronics
  shipsFrom: "United Kingdom",
  shipsFromCode: "gb",
  freeReturns: true,
  orderIncrement: 6, // e.g. 6 for "must be ordered in increments of 6"
  ecoFriendly: {
    materials: ["Recycled packaging", "Conflict-free minerals"],
    packaging: ["Plastic-free", "Recyclable"],
    production: "Ethically sourced",
  },
  // GROUP F — Comprehensive audit round 3 variables
  categoryBreadcrumb: ["Electronics & Technology", "Smart Home & Wearables"],
  estimatedDeliveryRange: { minDate: "Mar 25", maxDate: "Apr 10" },
  freeShippingThreshold: { amount: 500, currency: "€" },
  testerOption: { available: true, price: 45.00, currency: "€", nonReturnable: true },
  casePackSize: 1, // e.g. 8 for food sold in cases of 8
  ingredients: null, // e.g. "raw cane sugar, cocoa mass, HAZELNUTS 24%, MILK powder…" for food
  allergens: null, // e.g. ["Milk", "Tree nuts"] for food products
  dietaryTags: null, // e.g. ["Vegan", "Gluten-free", "No preservatives"] for food/beauty
  storageInstructions: null, // e.g. "Keep sealed in a cool and dark place" for food
  customizationAbility: { verified: true, levels: ["Minor customization", "Drawing-based customization", "Full customization"] },
  importDutyCoverage: { covered: true, regions: ["EU", "UK", "US"] }, // e.g. { covered: true, regions: ["US", "EU"] }
  brandTier: "Verified", // e.g. "Top Shop", "Verified", "Premium", null
  promotionalBadge: "Spring Tech Sale", // e.g. "March Expo", "Flash Sale", "Seasonal Deal"
  comparisonPrice: { label: "Lower priced than similar", percentage: 15 },
  paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },
  lowStockWarning: { threshold: 50, remaining: 42 }, // e.g. { threshold: 10, remaining: 9 } — null means no low stock
  productGrade: "Premium", // quality grade within product type (e.g. "Ceremonial", "Commercial", "Premium")
  hazmatInfo: { isHazardous: false, unNumber: null, class: null },
  countryRestrictions: ["RU", "BY"], // e.g. ["RU", "BY"] — countries where this product cannot ship
  restrictionScope: null, // "all-continents" | "specific" | null — scope of country restrictions
  restrictedContinents: null, // e.g. ["Europe", "North America"] — only used when restrictionScope is "specific"
  warrantyInfo: { duration: "2 Years", type: "Manufacturer", coverage: "Defects in materials and workmanship" },
  ageRestriction: null, // e.g. { minAge: 18, reason: "Contains alcohol" }
  dimensionsPerUnit: { length: 4.4, width: 3.8, height: 1.1, unit: "cm" },
  netWeight: { value: 0.068, unit: "kg" },

  // ═══════════════ GROUP G — Round 4 Comprehensive Audit (50 new variables) ═══════════════

  // G1. Product Identification & Codes
  mpn: "SM-G996BZKDEUB", // Manufacturer Part Number
  batchNumber: null, // e.g. "LOT-2024-0915" for food/pharma traceability
  serialNumberRequired: false, // whether individual serial tracking is needed

  // G2. Pricing & Commercial Terms
  mapPrice: { amount: 799.00, currency: "€" }, // Minimum Advertised Price e.g. { amount: 799.00, currency: "€" }
  priceValidUntil: "2026-06-30", // ISO date — when the listed price expires
  netPaymentTerms: "Net 30", // INHERITED from supplier_profiles.paymentTerms unless deal override. e.g. "Net 30", "Net 60", "Due on receipt"
  depositRequired: { percentage: 30, terms: "30% upfront, 70% before shipping" }, // INHERITED from supplier_profiles.defaultDepositPercentage + defaultDepositTerms unless deal override
  taxClass: "standard", // INHERITED from supplier_profiles.defaultTaxClass unless deal override. "standard", "reduced", "zero-rated", "exempt"

  // G3. Logistics & Shipping
  palletConfiguration: { unitsPerLayer: 24, layersPerPallet: 4, unitsPerPallet: 96 },
  containerLoadQuantity: { twentyFt: 4800, fortyFt: 9600, fortyHC: 11200 },
  shippingClass: "Standard", // "Standard", "Freight", "Oversized", "Hazmat", "Perishable"
  incoterms: "DDP", // INHERITED from supplier_profiles.defaultIncoterms unless deal override — "EXW", "FOB", "CIF", "DDP", "DAP", "FCA"
  readyToShip: true, // in-stock, packed, ready for immediate dispatch
  stackable: true, // whether packaged cartons can be stacked
  portOfOrigin: "Busan, South Korea", // e.g. "Busan, South Korea" — relevant for FOB/CIF shipments

  // G4. Deal Lifecycle & Status
  dealStatus: "active", // "active", "discontinued", "end-of-life", "pre-launch", "seasonal"
  launchDate: "2024-01-15", // when product was first released by manufacturer
  discontinuedDate: null, // ISO date or null if still active
  seasonality: "All Season", // "All Season", "Spring/Summer", "Autumn/Winter", "Holiday", "Back to School"
  bestBeforeDate: null, // ISO date for perishables e.g. "2026-12-31"

  // G5. Compliance & Regulatory (expanded)
  regionalCompliance: [{ region: "California, US", note: "This product contains chemicals known to the State of California to cause cancer." }], // e.g. [{ region: "California, US", note: "..." }] — regional compliance warnings and restrictions
  cpscCompliance: null, // e.g. { compliant: true, certNumber: "CPC-2024-12345", testLab: "Intertek" }
  fdaRegistration: null, // e.g. { registered: true, number: "FDA-12345678", type: "cosmetic" }
  energyRating: null, // e.g. { system: "EU Energy Label", rating: "A", annualConsumption: "45 kWh" }
  sarValue: { head: 0.58, body: 1.12 }, // Specific Absorption Rate in W/kg e.g. { head: 0.58, body: 1.12 }
  ipRating: "IP68", // Ingress Protection rating as structured field

  // G6. Category-Specific: Apparel & Fashion
  fabricComposition: null, // e.g. [{ material: "Cotton", percentage: 95 }, { material: "Elastane", percentage: 5 }]
  gsm: null, // Grams per Square Meter e.g. 280 for heavy cotton
  careInstructions: null, // e.g. { wash: "Machine wash 30°C", dry: "Tumble dry low", iron: "Medium heat", bleach: "Do not bleach" }
  fitType: null, // "Slim", "Regular", "Relaxed", "Oversized", "Tailored"
  gender: "Unisex", // "Men", "Women", "Unisex", "Boys", "Girls"
  sizeChart: null, // e.g. ["S", "M", "L", "XL", "XXL"] — available sizes as tag array (BrandPillInput)

  // G7. Category-Specific: Food & Beverage
  nutritionalInfo: null, // e.g. { servingSize: "30g", calories: 150, fat: 8, saturatedFat: 3, carbs: 18, sugar: 12, fiber: 1, protein: 2, salt: 0.1 }
  organicCertification: null, // e.g. { certified: true, body: "USDA Organic", number: "CERT-12345" }
  kosherHalal: null, // e.g. { kosher: false, halal: true, certBody: "Islamic Food Council" }
  countryOfHarvest: null, // e.g. "Colombia" — for raw goods, coffee, etc.
  abv: null, // Alcohol By Volume percentage e.g. 13.5
  vintageYear: null, // e.g. 2019 for wine/spirits

  // G8. Category-Specific: Health & Beauty
  inciList: null, // INCI full ingredients e.g. "Aqua, Glycerin, Cetearyl Alcohol, ..."
  spfRating: null, // Sun Protection Factor e.g. 50
  skinType: null, // e.g. ["Normal", "Oily", "Combination"]
  paoMonths: null, // Period After Opening in months e.g. 12
  crueltyFree: null, // e.g. { certified: true, body: "Leaping Bunny" }
  dermatologicallyTested: null, // boolean

  // G9. Category-Specific: Industrial/B2B
  toleranceSpecs: null, // e.g. "±0.05mm"
  pressureRating: null, // e.g. { value: 150, unit: "PSI" }
  temperatureRange: null, // e.g. { min: -20, max: 60, unit: "°C" }
  threadType: null, // e.g. "M8x1.25" or "NPT 1/4"
  materialGrade: null, // e.g. "304 Stainless Steel", "6061-T6 Aluminum"

  // G10. Analytics & Social Proof
  viewCount: 8472, // total page views / impressions
  inquiryCount: 156, // number of buyer inquiries

  // G11. SEO & Discovery
  searchKeywords: ["smartwatch", "wearable", "fitness tracker", "smart watch wholesale", "bulk watches"],
  metaTitle: "Midnight Chronometer Smartwatch — Wholesale | WholesaleUp", // SEO title override (null = auto-generate from title)
  metaDescription: "Buy Midnight Chronometer smartwatches wholesale from €228/unit. 201% markup. IP68, AMOLED, 5-day battery. MOQ 12 units.", // SEO description override
  slug: "midnight-chronometer-crafted-precision",

  // G12. B2B-Specific Fields
  maxOrderQuantity: 5000, // e.g. 5000 — max units per single order
  exclusivityAvailable: false, // whether exclusive distribution can be negotiated
  whiteLabeling: { available: true, moq: 500, leadTime: "4-6 weeks", setupFee: { amount: 250, currency: "€" } }, // e.g. { available: true, moq: 500, leadTime: "4-6 weeks", setupFee: { amount: 250, currency: "€" } }
  productInsurance: { included: true, provider: "Lloyd's", coverage: "Transit damage up to €50,000" },
  qualityInspection: { available: true, provider: "SGS", type: "Pre-shipment", cost: "Included" },

  // GROUP H — Round 5 (Merkandi screenshots audit)
  firstOrderDiscount: { percentage: 10, label: "-10% ON YOUR FIRST ORDER!" }, // e.g. { percentage: 10, label: "-10% ON YOUR FIRST ORDER!" } — Merkandi-style new-buyer incentive
  packageContents: "1× Smartwatch, 1× Magnetic charging cable (1m), 1× Quick-start guide, 1× Warranty card", // e.g. "2 curtains + rubber suction cups" — structured 'what's in the box'
  compatibleWith: ["iOS 15+", "Android 10+", "HarmonyOS 3+"], // e.g. ["VW", "BMW", "Mercedes-Benz"] — brands/systems this product is compatible with (distinct from product brand)

  // GROUP I — Round 6 (Merkandi batch 4)
  sellToPrivate: false, // "Sale also to private individuals" — whether the deal is B2C-eligible, not just B2B
  // CONVENTION: attachments (line ~111) supports full file objects: [{ name, url, size, type }]
  // Packing lists, catalogs, spec sheets all go in the existing attachments array.
  targetAudience: ["Tech-savvy professionals", "Fitness enthusiasts aged 25–45"], // e.g. ["Children", "Young people from approx. 8 to 17 years"] — who the product is designed for (distinct from ageRestriction which is a legal limit)

  // GROUP J — Round 7 (Merkandi batch 5)
  hazardSymbols: null, // e.g. ["GHS02", "GHS07", "GHS09"] — GHS hazard pictograms for chemical/hazardous products (car wash fluid, cleaning products, etc.)

  // ═══════════════ GROUP K — Round 8 (Merkandi text audit, 5 listings) ═══════════════

  // K1. Shipping structure refinement
  // Current shippingCountries is a flat string. Merkandi shows continent-level declarations
  // with three states: "all continents", specific continents, or "not declared by seller".
  shippingScope: "all-continents", // "all-continents" | "specific" | "not-declared"
  shippingContinents: ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"], // only used when shippingScope is "all-continents" or "specific"

  // K2. Assorted lot indicators
  // Many Merkandi deals are mixed assortments ("assorted styles and colors", "mixed assortment 24pcs")
  // rather than single-SKU listings. Buyers need to know exact items will vary.
  isAssortedLot: false, // whether the deal is a mixed/assorted lot vs a specific single-SKU product
  lotComposition: null, // e.g. ["Eyes 48%", "Lips 18%", "Skin/Face 15%", "Nails 19%"] — freeform tags describing lot composition (BrandPillInput)

  // K3. Trust & authenticity signals
  authenticityGuarantee: "100% authentic, manufacturer sealed", // e.g. "100% authentic" | "first quality" | "original tags attached" — explicit authenticity claim (separate from grade)
  imagesRepresentative: false, // true when "images are for display purposes only" / "each assortment may vary" — sets buyer expectations for assorted lots

  // K4. Supplier trust badges (expanding supplier profile)
  // Merkandi shows "Verified Supplier" AND "Certified seller" as two separate badges.
  // supplier.isVerified already exists; this adds the second badge.
  // Add to supplier object in production: supplier.isCertified
  supplierIsCertified: false, // separate from supplier.isVerified — platform-awarded certification badge
  // Merkandi shows "The seller responds promptly" / "responds quickly" as a platform-awarded badge
  // distinct from the self-reported supplier.responseTime ("≤5h")
  supplierResponseBadge: "promptly", // "very quickly" | "quickly" | "promptly" | null — platform-awarded response speed badge

  // K5. Stock & availability
  // One Merkandi listing shows "no limits" for available quantity.
  // Current availableQuantity is numeric only (400). null = unlimited/no limits.
  // CONVENTION: availableQuantity: null means unlimited stock (display as "No limits")
  // No new field needed — just document that null = unlimited in the existing availableQuantity field.

  // K6. Deal-level return policy override
  // L'Oreal listing: "no refunds, exchanges of any kind. All sales are final"
  // Current returnPolicy is supplier-inherited. Some deals (closeouts, final-sale lots) override this.
  dealReturnPolicy: null, // e.g. "All sales final. No refunds or exchanges." — deal-specific override of supplier returnPolicy. null = inherit supplier policy.

  // K7. EU Omnibus Directive pricing (legally required for EU discounted products)
  // Shows "Min. price from 30 days before discount: €12.00" — the lowest price in the 30 days
  // before a discount was applied. Distinct from both RRP and current price.
  omnibusPrice: null, // e.g. { amount: 12.00, currency: "€" } — minimum price from last 30 days before discount. Required by EU Omnibus Directive for any promotion.
  discountPercentage: null, // e.g. 16 — explicit discount badge (e.g. "Discount 16%"). Distinct from markup.
  originalPrice: null, // e.g. { amount: 12.00, currency: "€" } — seller's own pre-discount price (strikethrough). Distinct from rrp (retail price).

  // K8. Lot structure
  isIndivisibleLot: false, // "INDIVISIBLE LOT, to be taken in full" — lot cannot be split, buyer must purchase the entire quantity
  sourceRetailers: null, // e.g. ["Aldi", "Carrefour", "Lidl", "Alcampo"] — retail chains the stock was sourced from (overstock/liquidation). Distinct from brands (product brands).

  // K9. Quality grade refinement
  gradeNotes: null, // e.g. "Class II — slight discoloration, inaccurate print, up to 5% weaker items" — defect/quality clarification for non-A-grade stock. Supplements the grade field.
  gradeCategory: null, // e.g. "A" | "B" | "C" — sub-grade within grade (e.g. "Outlet" grade with "Category A" or "Category B" quality)

  // K10. Physical viewing & media
  showroomAvailable: { available: true, location: "Manchester, UK", byAppointment: true }, // e.g. { available: true, location: "Bobigny (93), France", byAppointment: true } — physical showroom/warehouse where goods can be inspected before purchase

  // K11. Unit type expansions
  // CONVENTION: priceUnit supports these values:
  // "pieces", "lots", "trucks", "pallets", "pairs", "packs", "kilograms", "tonnes", "m²"
  // e.g. priceUnit: "/kilogram price excl. VAT"
  // Used clothes: €1.75/kilogram, MOQ: 23 tonnes. Tiles: €2.35/m². Trucks: €9,999/truck.
  // moqUnit is now derived from priceUnit at display time — removed from data objects.

  // K12. Grade value expansions
  // CONVENTION: grade field supports: "New", "Used", "Outlet", "Mix / returns", "Refurbished", "Damaged"
  // "Outlet" = overstock/end-of-line from brands (new but not current season)
  // "Mix / returns" = customer returns, mixed condition
  // "Used" = second-hand goods (e.g. used clothing by weight)
  // "Damaged" = visibly defective/impaired items (seen in German seller "Other offers")
  // No new field — documenting expanded enum values.

  // K13. Seasonal sorting option
  // K14. "Week's best offer" badge
  weeksBestOffer: false, // platform-awarded promotional badge highlighting top weekly deals

  // K15. "Negotiable" price badge
  // Seen on similar offers: "Negotiable" as a standalone price badge (distinct from deal.negotiable boolean)
  // Already captured by deal.negotiable: true — no new field needed.

  // K16. Original labels indicator
  hasOriginalLabels: true, // e.g. true — "Original labels" — confirms products retain original brand tags/labels. Important for outlet/overstock authenticity.

  // K17. Export restrictions
  exportOnly: false, // "Only intended for export outside Europe" — product cannot be resold domestically, must be exported. Common for overstock/liquidation.
  exportRegions: null, // e.g. ["Africa", "Latin America", "Middle East", "Eastern Europe"] — specific export target regions mentioned by seller

  // K18. Unit type expansions (addendum to K11)
  // Additional units found: "litres" (lubricants), "m²" (tiles/limestone), "sets" (bundled multi-item kits)
  // FULL CONVENTION: priceUnit supports:
  // "pieces", "lots", "trucks", "pallets", "pairs", "packs", "sets", "kilograms", "tonnes", "m²", "litres", "containers"
  // moqUnit is now derived from priceUnit at display time — removed from data objects.

  // K19. Offer validity period
  // "The offer is valid for 60 days" — duration-based pricing validity.
  // Distinct from priceValidUntil (fixed ISO date). This is relative ("60 days from now").
  offerValidityDays: 90, // e.g. 60 — number of days the offer/pricing is valid from listing date. null = no stated expiry.

  // K20. Shipping details
  // REMOVED: shippingCarrier — duplicated deliveryMethods (the canonical Supplier Profile form field). No form field backed it.
  shippingCostBearer: "buyer", // "buyer" | "seller" | "negotiable" | "included" — who pays shipping. Distinct from freeShippingThreshold.

  // K21. Cross-category MOQ
  // "The order can be composed of 6 different products from the clothing category"
  // MOQ can be fulfilled across different products from same seller/category, not just this SKU.
  crossCategoryMOQ: false, // whether the MOQ can be met by combining different products from the same seller or category

  // K22. WhatsApp / alternative contact
  // "contact us on WhatsApp" — seller offers WhatsApp as a communication channel
  // CONVENTION: Add to supplier.contact object in production: supplier.contact.whatsapp
  // Also seen: "contact us to determine the exact quantity, model, color, size and price"
  // This is a "quote-based" selling pattern where the listed price is indicative.
  // Already partially covered by deal.negotiable.

  // K23. "Merkandi Exclusive Offer" badge
  // "Women's Summer Dresses Bundle - Grade A - Merkandi Exclusive Offer"
  // Platform-exclusive deal badge. Similar to weeksBestOffer but for exclusivity.
  platformExclusive: false, // whether the deal is exclusive to this platform (not listed elsewhere)

  // K24. Model count indicator
  // "more than 500 different models available" — total variety/model count the supplier carries
  // Relevant for assorted lots where buyers want to know the breadth of selection.
  modelCount: null, // e.g. 500 — number of different models/designs available in the supplier's catalogue for this product type

  // K25. Label condition (for overstock/outlet)
  // "ITEMS MAY HAVE BLACK LINES THROUGH LABELS" / "ITEMS MAY NOT HAVE RETAIL PRICE TAGS"
  // Distinct from hasOriginalLabels (boolean). This describes the condition of labels — defaced, removed, partial.
  // Common in overstock where brands deface labels to prevent grey market tracking.
  labelCondition: "Original retail packaging intact", // e.g. "Labels may have black lines" | "No retail price tags" | "Original labels intact" — condition of product labels/tags

  // K26. Assorted lot disclosures
  mayContainDuplicates: false, // "You may receive duplicate items" — for assorted lots, whether duplicates are possible

  // K27. Shipping cost calculation method
  // "Shipping costs are calculated based on the weight of the parcel to your location"
  // Distinct from shippingCostBearer (who pays) — this is HOW the cost is calculated.
  shippingCostMethod: "weight-based", // "weight-based" | "flat-rate" | "volume-based" | "quote-required" | null — how shipping cost is calculated

  // K28. Shipping per-country granularity
  // Scarf listing shows specific countries per continent (e.g. Europe: 48 specific countries, Asia: Cyprus only)
  // Confirms shippingScope: "specific" with shippingContinents needs per-continent country lists.
  // CONVENTION: When shippingScope is "specific", use shippingCountries (existing field) as an object keyed by continent:
  // e.g. { "Europe": ["Germany", "France", ...], "Asia": ["Cyprus"] }
  // No new field — documenting the object shape for the existing shippingCountries field.

  // K29. "Free delivery" badge
  // Similar offers show "Free delivery*" badge on individual deals (with asterisk for conditions).
  // Distinct from freeShippingThreshold (which is a minimum order amount).
  freeDelivery: false, // whether the deal includes free delivery (may have conditions noted with asterisk)

  // K30. EU Community invoice / VAT invoice
  // "EU community invoice or VAT for each purchase" — type of invoice provided.
  // Important for B2B buyers who need specific invoice types for tax reclaim.
  invoiceType: "VAT", // INHERITED from supplier_profiles.defaultInvoiceType unless deal override. "EU Community" | "VAT" | "Both"

  // K30b. Sanitized invoices
  // Whether the supplier can provide invoices with supplier pricing removed.
  // Commonly needed by Amazon sellers to get ungated in restricted categories.
  sanitizedInvoice: "Available", // INHERITED from supplier_profiles.sanitizedInvoice unless deal override. "Available" | "On Request" | "Unavailable"

  // K31. Packaging format
  // "packed in unit packs of 100 pcs and placed collectively in cartons"
  // Distinct from packaging (dimensions) — this is HOW items are packaged for wholesale.
  packagingFormat: "Individual retail boxes, master cartons of 12 units", // e.g. "Unit packs of 100pcs in cartons" | "Bulk in cartons" | "Individual polybags" | "Blister packs" — wholesale packaging method

  // K32. Color variant count
  // "Over 15 color versions" / "Available in 3 designs" — total color/design options
  color: ["Phantom Black", "Midnight Silver", "Arctic White", "Ocean Blue"],

  // K33. Product dimensions (textiles)
  // "width 30 cm x length 140-150 cm + tassels" — product size for textiles/accessories
  // Supplements dimensionsPerUnit (G) which is for packaged/boxed dimensions.
  productDimensions: { length: 44, width: 44, height: 11, unit: "mm", notes: "case diameter" }, // e.g. { length: 140, width: 30, height: "", unit: "cm", notes: "+ tassels" } — physical product dimensions (not packaging)

  // K34. Predominant sizes in assorted lots
  // "Sizes S, M, L, XL, XXL. Size advantage M, L" — which sizes have the most stock.
  // Distinct from sizeChart (measurement details) and variants (selectable options).
  // Critical for wholesale buyers targeting specific market demographics.
  predominantSizes: null, // e.g. ["M", "L"] — sizes with the most stock in an assorted lot. null = even distribution or single-SKU.

  // K35. Stock origin / provenance
  // "From surpluses, controlled returns and liquidations of large European chains"
  // Describes WHERE the goods came from, distinct from grade (condition) and sourceRetailers (which chains).
  // Merkandi's entire marketplace is built around these provenance types.
  stockOrigin: null, // e.g. ["surplus", "controlled-returns", "liquidation"] — provenance of goods.
  // CONVENTION: stockOrigin values: "surplus", "overstock", "end-of-line", "liquidation", "bankruptcy",
  // "controlled-returns", "customer-returns", "cancelled-order", "sample-stock", "production-excess"

  // K36. Manifested vs unmanifested (return/liquidation pallets)
  // "Packing list is not included. The boxes are not opened or handled."
  // Critical distinction in the return/liquidation pallet market:
  // - Manifested: detailed item-level packing list provided (buyer knows exact contents)
  // - Unmanifested: "blind" pallet, contents unknown (higher risk, lower price)
  // Directly impacts pricing, risk assessment, and buyer decision-making.
  isManifested: null, // true = itemized packing list included, false = blind/unmanifested pallet, null = not applicable (single-SKU deals)

  // K37. Aggregate lot retail value
  // "Merchandise value: Average P.V.P per lot: 45,000,00€" (P.V.P = Precio de Venta al Público = RRP)
  // In bazaar/liquidation pallets with wildly mixed products, per-unit rrp is meaningless.
  // Sellers instead state the TOTAL retail value so buyers can assess discount depth.
  // e.g. pay €9,867 wholesale for €45,000 retail value = 78% discount.
  // Distinct from rrp (per-unit) and markup (percentage).
  lotRetailValue: null, // e.g. { amount: 45000, currency: "€" } — aggregate retail value of the entire lot/batch. null = per-unit rrp is available instead.

  // K38. Quantity-based price tiers (volume discounts)
  // "€100 from 10 to 20 pieces, €80 from 20 to 50 pieces, €40 from 50 to 90 pieces"
  // "€19.95 from 2 to 20 pieces, €19.00 from 21 to 40, €18.00 from 41 to 60..."
  // Fundamental B2B pricing concept — structured quantity breaks displayed on the listing.
  // Distinct from firstOrderDiscount (buyer-acquisition promo) and discountPercentage (product-level markdown).
  // price field holds the lowest tier; priceTiers shows the full schedule.
  priceTiers: [{ minQty: 12, maxQty: 50, price: 228.04 }, { minQty: 51, maxQty: 200, price: 215.00 }, { minQty: 201, maxQty: null, price: 198.00 }], // e.g. [{ minQty: 10, maxQty: 20, price: 100 }, { minQty: 20, maxQty: 50, price: 80 }, { minQty: 50, maxQty: 90, price: 40 }] — currency matches priceCurrency

  // K39. Seller warranty / guarantee
  // "Warranty: 6 Months" (Bixolon POS printer, used equipment)
  // "30-DAY GUARANTEE" (wholesale iPhones, Italy)
  // "Lifetime warranty" (Goodram microSD cards, Poland)
  // Critical for used/refurbished goods — directly affects buyer risk and price justification.
  // Distinct from product manufacturer warranty; this is the SELLER's guarantee on this deal.
  // CONVENTION: value is a string for flexibility — "6 months", "30 days", "1 year", "lifetime", "none"
  warranty: "2 years", // e.g. "6 months" — seller-provided warranty/guarantee period. null = not stated.

  // K40. dealReturnPolicy convention update — observed Merkandi patterns:
  // "No Returns!" (Mix Household Appliances, Poland)
  // "Returns not accepted" (Smart TV Full Truck, Spain; Electro Mix Truck, Spain)
  // "No returns, no damage" (General Cargo pallet, Poland)
  // "Warranty: No" (Newskill Sobek headset, Spain — explicit no-warranty + no-returns)
  // CONVENTION for existing dealReturnPolicy field (line ~396):
  // "no-returns", "all-sales-final", "14-days", "30-days", "by-agreement", or free text. null = inherit supplier policy.
  // No new field — updating convention on existing dealReturnPolicy.

  // K40. Functional rate / defect estimate (NEW VARIABLE)
  // "60% functional, 40% with issues" (Newskill Sobek gaming headset, Spain)
  // "high RMA rate, primarily related to the right earcup"
  // Quantitative defect/yield estimate for lots with known quality issues.
  // Distinct from grade (categorical assessment) — this is a percentage-based yield prediction.
  // Particularly relevant for "special product" or "high-RMA" lots sold at steep discounts.
  functionalRate: null, // e.g. { functional: 60, withIssues: 40, note: "right earcup defect" } — percentage-based quality yield estimate. null = not stated or N/A.

  // ═══════════════ GROUP L — Cross-Platform Audit (Alibaba, Amazon, Faire, IndiaMART, Made-in-China) ═══════════════
  // Thorough crawl of underrepresented categories across major B2B/B2C platforms to verify completeness.
  // 206 existing variables cross-referenced; 6 confirmed gaps below.

  // L1. Supply Ability / Production Capacity
  // Alibaba's single most prominent B2B field after price/MOQ. Shows on EVERY Alibaba, Made-in-China, and IndiaMART listing.
  // "10,000 Pieces per Month" / "500 Tonnes per Year" / "50 Containers per Week"
  // Fundamentally distinct from availableQuantity (current stock on hand).
  // supplyAbility tells buyers about ONGOING supply reliability — can this supplier fulfill repeat orders at scale?
  // Critical for buyers evaluating long-term supplier partnerships vs one-off liquidation purchases.
  // Merkandi relevance: sellers like the Polish ADM seller show "no limits" availability + regular restock cadence.
  // SOURCES: Alibaba (every listing), Made-in-China (every listing), IndiaMART (every listing), DHgate, TradeIndia
  supplyAbility: { quantity: 5000, unit: "pieces", period: "month" }, // e.g. { quantity: 10000, unit: "pieces", period: "month" } — ongoing production/supply capacity. null = not stated (common for liquidation/one-off stock).

  // L2. Sample Lead Time
  // How long to receive a product sample after ordering one.
  // We have sampleAvailability ("paid"/"free"/"none") and samplePrice ({ amount, currency })
  // but NOT the time dimension — critical for buyer planning and product evaluation workflow.
  // Alibaba: "Sample Lead Time: 3-7 days" (standard field on every listing)
  // Made-in-China: "Sample Time: 3 days"
  // IndiaMART: "Sample Available: Yes, 5-7 working days"
  // Merkandi relevance: tester options exist (testerOption field) but without delivery timeline.
  // SOURCES: Alibaba (standard field), Made-in-China (standard field), IndiaMART, Faire (implicit via lead time)
  sampleLeadTime: { min: 2, max: 3, unit: "days" }, // e.g. { min: 3, max: 7, unit: "days" } — sample delivery time after order. null = not stated.

  // L3. Power Source
  // How the product is powered — a cross-category structured field on Amazon (required for all powered products).
  // "Battery Powered", "Corded Electric", "Solar Powered", "Manual", "USB Rechargeable", "Mains (AC)", "Fuel (Petrol/Diesel)"
  // Currently this info is buried in specifications but it's a fundamental product characteristic
  // that affects buyer decisions (electrical compatibility, import regulations, shipping restrictions).
  // Observed in Merkandi: solar lamp (solar), chainsaw (21V Li-ion battery), drone (3.7V battery),
  // IP camera (AC adapter + WiFi), electric desk (mains), gas stove (fuel).
  // Amazon shows this for every electronic, kitchen, garden, and tool product across all 6 regional stores.
  // SOURCES: Amazon (US/UK/DE/FR/CA — required field), Alibaba (common attribute), Faire (product details)
  // Array supports products with multiple power sources (e.g. hybrid solar+battery)
  powerSource: ["Battery (rechargeable)"], // e.g. ["Solar"] | ["Battery (rechargeable)"] | ["Corded Electric", "Manual"] | ["USB Rechargeable"] | ["Mains (AC)"] | ["Fuel"] | ["Solar", "Battery (rechargeable)"]

  // L4. Assembly Required
  // Whether the product needs assembly after delivery — prominent Amazon field, critical for furniture/garden/industrial.
  // Amazon (all regions): "Assembly Required: Yes" / "No" with complexity notes
  // IKEA-style assembly is the norm for wholesale furniture — buyers need to know for resale positioning.
  // Observed in Merkandi: folding table ("Easy folding system"), desk ("Assembly instructions"),
  // metal cabinet ("Freely mountable insert"), bar stools, hammock ("Easy installation").
  // Affects: buyer logistics (do they need to assemble before resale?), end-consumer experience, return rates.
  // SOURCES: Amazon (US/UK/DE/FR/CA — standard field), Alibaba (common for furniture), Faire (product details)
  assemblyRequired: false, // e.g. { required: true, complexity: "Simple", tools: "Included", time: "30 minutes" } | false | null

  // L5. EU Responsible Person
  // EU Market Surveillance Regulation (EU) 2019/1020 — MANDATORY since July 16, 2021
  // for ALL products sold in the EU (not just by EU sellers). Amazon EU already enforces this.
  // Requires name + postal address + email of an EU-based entity responsible for product compliance.
  // Distinct from manufacturer (who made it), brand (who brands it), and seller (who sells it).
  // Non-EU manufacturers/importers MUST designate an EU-based responsible person.
  // This is a LEGAL REQUIREMENT, not optional — failure to comply = products removed from EU marketplaces.
  // Observed gap: none of the 50+ Merkandi listings showed this, but it's legally required for all EU sales.
  // SOURCES: Amazon EU (required field since 2021), EU Regulation 2019/1020, all EU marketplaces
  euResponsiblePerson: { name: "MPA Europe GmbH", address: "Königsallee 92, 40212 Düsseldorf, Germany", email: "eu-compliance@mpa-europe.de" }, // e.g. { name: "EU Compliance GmbH", address: "Musterstr. 1, 10115 Berlin, Germany", email: "compliance@example.de" }

  // L6. Battery Information
  // Amazon REQUIRES this for any product containing or requiring batteries — it's a regulated/hazmat field.
  // Battery composition affects shipping restrictions (lithium = dangerous goods), customs, and safety compliance.
  // Distinct from powerSource (HOW it's powered) — this is WHAT batteries are in/required.
  // "Batteries Required: Yes", "Battery Type: Lithium-Ion", "Batteries Included: Yes", "Number of Batteries: 1"
  // Observed in Merkandi: drone (3.7V 500mAh Li-ion included, 4xAAA NOT included for remote),
  // chainsaw (21V Li-ion detachable), FlyAway fan (battery not included), IP camera (AC powered).
  // Amazon UN38.3 testing required for lithium batteries. IATA regulations for air freight.
  // SOURCES: Amazon (US/UK/DE/FR/CA — required field), Alibaba (for electronics), EU Battery Regulation 2023/1542
  batteryInfo: { required: true, included: true, type: "Lithium-Ion", voltage: 3.85, capacity: "590mAh", quantity: 1, removable: false }, // e.g. { required: true, included: true, type: "Lithium-Ion", voltage: 3.7, capacity: "500mAh", quantity: 1, removable: true } | null

  // ═══════ GROUP L — Convention Updates (existing fields, no new keys) ═══════
  //
  // L-CONV-1. countryRestrictions convention update:
  // Currently described as "countries where this product cannot ship".
  // Cross-platform audit revealed a broader pattern: SALES TERRITORY restrictions.
  // "With the label shown, the goods must not appear in the German trade!" (Shower curtain, Germany)
  // This is about where goods can be SOLD AT RETAIL, not just shipped.
  // CONVENTION: countryRestrictions covers both shipping AND sales territory restrictions.
  // Use with gradeNotes or description to clarify whether it's a shipping or sales restriction.
  //
  // L-CONV-2. supplyModels convention update:
  // Alibaba "Ready to Ship" vs "Customization" vs "OEM/ODM" product types.
  // Already covered by existing fields: readyToShip (boolean), supplyModels (["wholesale", "dropshipping", "white-label"]),
  // whiteLabeling (OEM/ODM details), customizationOptions (specific customization offers).
  // NOTE: supplyModels canonical enum is: ["wholesale", "dropshipping", "liquidation", "white-label", "private-label", "job-lots"]
  //
  // L-CONV-3. certifications convention update:
  // Amazon EU and cross-platform audit confirmed these additional certification values:
  // "weee" (WEEE Directive compliance), "fcc" (US FCC), "ul" (Underwriters Laboratories),
  // "gots" (Global Organic Textile Standard), "oeko-tex" (textile safety), "fsc" (Forest Stewardship Council),
  // "en71" (EU toy safety — seen in Merkandi drone listing), "cpsia" (US children's product safety)
  // CONVENTION: certifications array supports: "ce", "iso-9001", "rohs", "reach", "fda", "weee", "fcc",
  // "ul", "gots", "oeko-tex", "fsc", "en71", "cpsia", "halal", "kosher", "brc", "iec", "etl", "sgs"
  //
  // L-CONV-4. taric / HS code convention update:
  // taric field currently holds EU TARIC codes (10-digit).
  // Cross-platform: Alibaba uses "HS Code" (6-digit international Harmonized System code).
  // Amazon uses ASIN (platform-specific). GPC (Global Product Classification) is another system.
  // CONVENTION: taric field stores the most specific code available:
  // - EU sellers: 10-digit TARIC code (e.g. "84145995")
  // - Non-EU sellers: 6-digit HS code (e.g. "841459")
  // - Field name remains "taric" for backwards compatibility but accepts both formats.

  // ═══════════════ GROUP M — Cross-Platform Deep Crawl (Alibaba 9 categories + Amazon US) ═══════════════
  // Thorough crawl of 9 Alibaba categories (Agriculture, Industrial Machinery, Apparel, Health & Medical,
  // Renewable Energy, Vehicle Parts, Metals/Construction, Consumer Electronics, Lab Supplies)
  // plus Amazon US (Health & Household). 212 existing variables cross-referenced.
  // Applied 3+ occurrence threshold. 2 confirmed gaps below + 5 convention updates.

  // M1. Quantity-Based Lead Time Tiers
  // Universal Alibaba field — appeared on ALL 9 Alibaba product pages crawled.
  // Shows different production/delivery timelines based on order quantity.
  // Pipette Stand: 1-50 pcs → 7 days, 51-1000 → 14 days, >1000 → negotiable
  // CNC Lathe: 1-5 sets → 30 days, 6-20 → 45 days, >20 → negotiable
  // Women's Dress: 100-999 pcs → 15 days, 1000-5000 → 25 days, >5000 → negotiable
  // Surgical Mask: 10000-50000 → 3 days, >50000 → 7 days
  // Solar Panel: 1-100 pcs → 15 days, >100 → 30 days
  // Brake Pads: 100-999 → 15 days, 1000-9999 → 25 days, >10000 → negotiable
  // Steel H Beam: 1-100 tonnes → 7 days, >100 → 15 days
  // TWS Earbuds: 500-4999 → 15 days, 5000-49999 → 25 days, >50000 → 30 days
  // Distinct from leadTime (flat string like "3-5-days") — this is the FULL quantity-tiered schedule.
  // Lead time tiers — quantity-based delivery time estimates (TIME tiers, not price tiers).
  // Critical for B2B purchasing: buyers ordering 50 pcs need to know delivery is 7 days,
  // while bulk buyers ordering 5000 pcs need to plan for 25 days.
  // SOURCES: Alibaba (every listing — standard "Lead Time" section), Made-in-China, IndiaMART, DHgate
  leadTimeTiers: [
    { minQty: 1, maxQty: 50, days: 7 },
    { minQty: 51, maxQty: 500, days: 14 },
    { minQty: 501, maxQty: null, days: null, label: "To be negotiated" },
  ], // e.g. [{ minQty: 1, maxQty: 50, days: 7 }, ...] — null maxQty means "and above", null days means "negotiable"

  // M2. Supplier Business Type
  // Appears on EVERY Alibaba listing as a fundamental supplier classification.
  // Pipette Stand: "Trading Company" | CNC Lathe: "Manufacturer" | Dress: "Manufacturer, Trading Company"
  // Surgical Mask: "Manufacturer" | Solar Panel: "Manufacturer" | Brake Pads: "Manufacturer, Trading Company"
  // Steel H Beam: "Trading Company" | Earbuds: "Manufacturer" | Garlic: "Manufacturer, Trading Company"
  // Affects pricing (trading companies add ~10-20% margin), supply chain reliability,
  // customization ability (factories can modify, traders typically can't), and audit/compliance visibility.
  // Also standard on Made-in-China, IndiaMART, TradeIndia, GlobalSources, DHgate.
  // Distinct from supplier.isVerified (platform verification status) and supplier.customizationAbility (what they can customize).
  // This is the STRUCTURAL ROLE of the supplier in the supply chain.
  // CONVENTION: Stored at deal level for portability. In production, move to supplier object as supplier.businessType.
  // VALUES: "manufacturer", "trading-company", "manufacturer-trading", "factory", "agent", "distributor"
  supplierBusinessType: "manufacturer-trading", // e.g. "manufacturer" | "trading-company" | "manufacturer-trading" | "factory" | "agent" | "distributor"

  // ═══════ GROUP N — GS1 / Google Standards Gap Fill (17 variables) ═══════
  // SOURCE: Cross-reference of 211-variable schema against GS1 Global Data Model
  // and Google Product Data Specification. Only wholesale-relevant gaps included.
  // 16 retail/ads-only Google attributes intentionally skipped.

  // N1. Gross Weight (with packaging) — GS1 Core
  // Net weight exists (netWeight) but gross weight is critical for freight quotes,
  // pallet planning, and logistics cost calculations. Every B2B shipment needs this.
  grossWeight: { value: 1.35, unit: "kg" }, // includes packaging weight

  // N2. Multipack Quantity — Google + B2B
  // Number of identical items in a multipack. Distinct from casePackSize (outer shipping case).
  // Google requires for multipacks; wholesale needs it to distinguish retail vs trade units.
  multipackQuantity: null, // e.g. 6 (six-pack), 12, 24; null = single item

  // N3. Item Group ID — Google
  // Groups product variants (colour/size combos) under one parent listing.
  // Essential for variant management when same product has multiple SKUs.
  itemGroupId: "WUP-GRP-MC2023", // e.g. "WUP-GRP-12345"; null = standalone product

  // N4. Pattern — Google (required for apparel)
  // Product pattern: striped, plaid, solid, floral, geometric, animal print, etc.
  // Relevant for textiles, fabrics, home goods, and apparel wholesale.
  pattern: null, // e.g. "solid", "striped", "floral", "plaid", "geometric"

  // N5. Product Highlights — Google
  // Short bullet-point highlights (2-100 per product, max 150 chars each).
  // Directly feeds Google Shopping and provides AI-extractable feature list.
  productHighlights: [
    "Premium A-grade organic garlic from certified farms",
    "3-layer vacuum packaging for extended shelf life",
    "Available in bulk quantities with volume pricing",
    "EU and USDA organic certified",
  ],

  // N6. Global Location Number (GLN) — GS1 Core
  // Unique identifier for business locations. GS1 core requirement for supply chain
  // data exchange. Identifies manufacturer/supplier facilities globally. 13-digit number.
  gln: "5060012345678", // e.g. "5412345000013"; assigned by GS1 to the business entity

  // N7. GPC Code — GS1 Core
  // GS1 Global Product Classification code. 8-digit hierarchical code that classifies
  // products. Industry standard for B2B catalogue interoperability.
  gpcCode: "10005844", // e.g. "10000033" (Garlic - Fresh); see gs1.org/gpc

  // N8. Despatch Unit Indicator — GS1 Logistics
  // Whether the trade item is a despatch (shipping) unit. Determines what physically
  // gets shipped from warehouse. Part of GS1 trade item hierarchy.
  despatchUnitIndicator: false, // true = this item IS the shipping unit (e.g. full pallet)

  // N9. Country of Last Processing — GS1
  // Country where final processing/assembly happened. Distinct from manufacturingCountry
  // (where components made). Required for some customs declarations.
  countryOfLastProcessing: "KR", // e.g. "NL" (packed in Netherlands, grown in China)

  // N10. GMO Declaration — GS1 Food
  // Genetically Modified Organism declaration. Mandatory in EU and many markets
  // for food products. Separate from organicCertification.
  gmoDeclaration: null, // "non-gmo" | "contains-gmo" | "may-contain-gmo" | null (not applicable)

  // N11. WEEE Classification — GS1 / EU Regulation
  // Waste Electrical and Electronic Equipment category. Required for all electronics
  // sold in EU — determines recycling obligations and fees.
  weeeClassification: "IT-telecom", // e.g. "large-household-appliances", "IT-telecom", "lighting", "toys"

  // N12. REACH SVHC Declaration — GS1 / EU Regulation
  // EU REACH regulation — Substances of Very High Concern declaration.
  // Mandatory for products containing chemicals above 0.1% w/w threshold.
  reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-01-15" }, // { compliant: true, substances: [], declarationDate: "2025-01-15" }

  // N13. RoHS Compliance — GS1 / EU Regulation
  // Restriction of Hazardous Substances compliance. Required for electronics
  // and electrical equipment in EU. Boolean + certificate reference.
  rohsCompliance: { compliant: true, certificateUrl: "https://example.com/rohs-cert-MC2023.pdf" }, // { compliant: true, certificateUrl: "..." } or null (not applicable)

  // N14. Carbon Footprint — GS1 Sustainability
  // Product carbon footprint per unit. Increasingly required by EU regulations (CSRD)
  // and major retailers. Growing wholesale buyer requirement.
  carbonFootprint: { value: 12.5, unit: "kg-CO2e", scope: "cradle-to-gate" }, // { value: 2.5, unit: "kg-CO2e", scope: "cradle-to-gate" }

  // N15. Storage Temperature Range (structured) — GS1 Logistics
  // Min/max storage temperature in numeric form. storageInstructions is free text;
  // this is structured data for cold chain logistics and warehouse routing.
  storageTemperatureRange: null, // { min: 2, max: 8, unit: "°C" } or null (ambient)

  // N16. Cost of Goods Sold — Google
  // Supplier-declared COGS for margin reporting. Complements Keepa/eBay margin
  // verification with supplier-side cost transparency.
  costOfGoodsSold: { value: 185.00, currency: "€" }, // { value: 3.50, currency: "€" } or null (not disclosed)

  // N17. Unit Pricing Base Measure — Google / EU Directive
  // Base unit for price comparison (e.g., per 100ml, per kg).
  // EU Price Indication Directive requires this. Helps compare across suppliers.
  unitPricingBaseMeasure: { value: 1, unit: "piece" }, // e.g. { value: 1, unit: "kg" } or { value: 100, unit: "ml" }

  // ═══════ GROUP M — Convention Updates (existing fields, no new keys) ═══════
  //
  // M-CONV-1. leadTime convention update:
  // Current leadTime ("3-5-days") is the SUMMARY / default value.
  // When leadTimeTiers is populated, leadTime serves as the display string for the shortest tier.
  // leadTimeTiers takes precedence for detailed scheduling.
  // CONVENTION: leadTime = shortest tier summary. leadTimeTiers = full schedule. Both can coexist.
  //
  // M-CONV-2. customizationOptions pricing convention update:
  // Alibaba shows per-attribute pricing for customization:
  // - "Customized packaging: +$0.50/piece (Min. order: 5000 pieces)"
  // - "Customized logo: +$0.20/piece (Min. order: 1000 pieces)"
  // Current customizationOptions already captures { name, extraCost, currency, minQty }.
  // Confirmed correct structure — no changes needed. Just documenting Alibaba uses same pattern.
  //
  // M-CONV-3. sellingUnit removed — now derived from priceUnit (e.g. "/ Pack" → selling unit is "Pack").
  // All former sellingUnit values are now covered by PRICE_UNIT_OPTIONS in deal-form.jsx.
  //
  // M-CONV-4. paymentFinancing convention update:
  // Alibaba standard: "Get 30 days to pay, interest-free with Alibaba.com order protection"
  // Confirmed this matches existing paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" }
  // CONVENTION: provider can also be "Alibaba.com", "Klarna", "PayPal Credit", "Affirm", etc.
  //
  // M-CONV-5. orderProtection convention update:
  // Alibaba Trade Assurance includes structured sub-guarantees:
  // - Delivery guarantee: "10% delay compensation" (refund if late)
  // - Quality guarantee: "Money-back protection" (refund if quality mismatch)
  // - Return guarantee: "Easy Return" (free local returns for defects)
  // These are PLATFORM-LEVEL terms that apply to all Trade Assurance orders.
  // Not stored per-deal — platform configuration handles the specific terms.
  // CONVENTION: orderProtection: true means the platform's full buyer protection applies.
  // The specific terms (delay %, return policy, refund conditions) come from platform config.
};

export const CATEGORY_PRESETS = {
  "clothing-fashion": {
    _label: "Clothing & Fashion",
    // ── Identity ──
    id: 8,
    title: "Women's Premium Cotton T-Shirts – Assorted Colours, Sizes S–XXL",
    slug: "womens-premium-cotton-t-shirts-assorted",
    category: "Clothing & Fashion",
    categoryBreadcrumb: ["Clothing & Fashion", "Women's Clothing"],
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop",
    ],
    description: `Premium women's cotton t-shirts in 12 colour options. Made from 100% GOTS-certified organic cotton in Portugal. Pre-shrunk fabric with reinforced double-stitched seams for durability.

Available in regular and slim fit. Size range S to XXL with EU standard sizing. Each shirt individually polybagged with size sticker. Cartons of 50 pieces (mixed sizes per carton or single-size cartons available on request).

IDEAL FOR: Retail stores, online fashion shops, print-on-demand services (blank garments), promotional merchandise.`,
    tags: ["#women", "#t-shirt", "#organic-cotton", "#wholesale", "#blank-apparel", "#gots", "#portugal", "#12-colours", "#regular-fit"],

    // ── Pricing ──
    price: 3.20,
    currency: "€",
    priceUnit: "/ Piece ex. VAT",
    rrp: 24.99,
    rrpCurrency: "€",
    markup: 681.0,
    mapPrice: null,
    priceValidUntil: "2026-09-30",
    netPaymentTerms: "Net 60",
    depositRequired: null,
    taxClass: "standard",
    costOfGoodsSold: { value: 1.85, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "piece" },
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    priceTiers: [{ minQty: 500, maxQty: 2000, price: 3.20 }, { minQty: 2001, maxQty: 5000, price: 2.90 }, { minQty: 5001, maxQty: null, price: 2.60 }],

    // ── Volume ──
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 24.99, priceCurrency: "€", priceLabel: "/ Piece inc.VAT", grossProfit: 21.79, profitLabel: "/1 Piece inc.VAT", markup: 681.0, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 19.99, priceCurrency: "€", priceLabel: "/ Piece inc.VAT", grossProfit: 16.79, profitLabel: "/1 Piece inc.VAT", markup: 524.7, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    comparisonPrice: { label: "Lower priced than similar", percentage: 18 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },

    // ── Order ──
    moq: 500,
    orderIncrement: 50,
    availableQuantity: 25000,
    casePackSize: 50,
    crossCategoryMOQ: true,
    isIndivisibleLot: false,
    maxOrderQuantity: 50000,
    isAssortedLot: true,
    lotComposition: ["S 10%", "M 25%", "L 30%", "XL 25%", "XXL 10%"],
    multipackQuantity: null,
    lotRetailValue: null,

    // ── Identification ──
    sku: "NW-WCT-AST-2025",
    ean: "7340012345678",
    taric: "6109100010",
    mpn: "NW-WCTS-180GSM",
    batchNumber: null,
    serialNumberRequired: false,
    itemGroupId: "WUP-GRP-NWWCT",
    gln: "7340012000015",
    gpcCode: "10006001",

    // ── Brands ──
    brands: [{ name: "NordWear", country: "SE" }],
    brandTier: "Verified",

    // ── Shipping ──
    shippingTime: 10,
    shippingCountries: "All EU countries, United Kingdom, Norway, Switzerland",
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    shippingClass: "Standard",
    shippingCostBearer: "buyer",
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    freeShippingThreshold: { amount: 2000, currency: "€" },
    incoterms: "DAP",
    readyToShip: true,
    shipsFrom: "Porto, Portugal",
    shipsFromCode: "pt",
    portOfOrigin: null,
    estimatedDeliveryRange: { minDate: "Mar 20", maxDate: "Apr 2" },

    // ── Logistics ──
    packaging: { length: 35, width: 25, height: 15, unit: "cm", weight: 0.22, weightUnit: "kg" },
    palletConfiguration: { unitsPerLayer: 200, layersPerPallet: 5, unitsPerPallet: 1000 },
    containerLoadQuantity: { twentyFt: 20000, fortyFt: 42000, fortyHC: 50000 },
    stackable: true,
    grossWeight: { value: 0.25, unit: "kg" },
    netWeight: { value: 0.18, unit: "kg" },
    dimensionsPerUnit: { length: 30, width: 22, height: 2, unit: "cm" },
    productDimensions: { length: 70, width: 52, height: "", unit: "cm", notes: "flat lay measurements, size M" },
    despatchUnitIndicator: false,

    // ── Payment ──
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["National delivery", "International delivery"],

    // ── Deal details ──
    dealLocation: "Portugal",
    dealLocationCode: "pt",
    isDropship: true,
    negotiable: true,
    isExpired: false,

    // ── Supplier ──
    supplier: {
      companyName: "NordWear Textiles Lda.",
      isVerified: true,
      rating: 4.7,
      reviewCount: 89,
      yearsActive: 15,
      categories: ["Women's Clothing", "Men's Clothing", "Blank Apparel", "Promotional Textiles"],
      moreCategories: 3,
      address: {
        country: "Portugal",
        countryCode: "pt",
        city: "Porto",
        postalCode: "4100-012",
        street: "Rua do Almada",
      },
      companyWebsite: "nordwear.pt",
      contact: {
        name: "Ana Ferreira",
        roleInCompany: "Sales Director",
        phone: "+351 220 123 456",
      },
      businessHours: {
        Sun: "Closed",
        Mon: "09:00 – 18:00",
        Tue: "09:00 – 18:00",
        Wed: "09:00 – 18:00",
        Thu: "09:00 – 18:00",
        Fri: "09:00 – 16:00",
        Sat: "Closed",
      },
      currentTime: "14:20",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2011,
      onTimeDeliveryRate: 94.8,
      responseTime: "≤4h",
      revenueTier: "established",
      companySize: 85,
      facilitySize: 6000,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "GOTS",
      customizationAbility: ["Print-on-demand", "Custom labeling", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Portuguese premium textile and apparel manufacturer specializing in sustainable, ethically-produced garments and blank apparel for wholesale and B2B partners. Established in 2011, we focus on organic cotton, responsibly-sourced materials.",
      productsOffered: "Women's and men's clothing, blank apparel, promotional textiles, custom-print garments, sustainable fabrics, and ethical fashion collections.",
      productCategories: ["apparel", "textiles", "blank-clothing"],
      brandsDistributed: ["NordWear", "Custom brands"],
      productQualityTier: ["premium"],
      certifications: ["gots", "oeko-tex", "iso-9001", "fair-trade"],
      sampleAvailability: "paid",
      catalogueSize: "500-1000",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 1600,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "credit-debit-card"],
      paymentTerms: "Net 30 for established accounts; Net 60 for high-volume orders",
      defaultDepositPercentage: 25,
      defaultDepositTerms: "25% deposit with order, 75% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "14-day return on unopened cartons. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "3000", discount: "5" },
        { currency: "€", minOrder: "8000", discount: "8" },
        { currency: "€", minOrder: "15000", discount: "12" },
      ],
      discountNotes: "Volume discounts apply to single orders. Custom pricing available for committed partnerships.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "gls", "own-fleet"],
      leadTime: "7-10-days",
      defaultIncoterms: "DAP",
      countriesServed: ["PT", "ES", "FR", "IT", "DE", "NL", "BE", "GB", "SE", "PL"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "wholesaler", "brand-owner"],
      buyerTypesServed: ["online-retailer", "retail-shop", "print-on-demand", "brand-owner"],
      customersServed: ["registered-companies", "sole-traders", "individuals"],
      supplyModels: ["wholesale", "dropshipping", "white-label", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/nordweartextiles",
      socialInstagram: "https://instagram.com/nordweartextiles",
      socialLinkedin: "https://linkedin.com/company/nordwear-textiles",
      preferredCurrency: "EUR",
    },

    // ── Supplier-level ──
    certifications: ["gots", "oeko-tex", "iso-9001"],
    returnPolicy: "14-day return on unopened cartons. Buyer pays return shipping.",
    leadTime: "7-10-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 1600,
    minimumOrderCurrency: "€",
    catalogueSize: "200-1000",
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
    discountTiers: [
      { currency: "€", minOrder: "3000", discount: "5" },
      { currency: "€", minOrder: "8000", discount: "10" },
      { currency: "€", minOrder: "20000", discount: "15" },
    ],
    supplyModels: ["wholesale", "dropshipping", "white-label", "private-label"],
    productQualityTier: ["mid-range", "premium"],
    supplierBusinessType: "manufacturer",
    supplierIsCertified: true,
    supplierResponseBadge: "quickly",

    // ── Product specs ──
    specifications: {
      "Material": "100% Organic Cotton, 180 GSM",
      "Sizes": "S, M, L, XL, XXL",
      "Colours": "12 colours available",
      "Fit": "Regular fit, pre-shrunk",
      "Label": "Woven brand label + care label",
      "Packaging": "Individual polybags",
    },
    variants: [
      { name: "Color", options: ["Black", "White", "Navy", "Heather Grey", "Olive", "Burgundy"], selected: "Black" },
      { name: "Size", options: ["S", "M", "L", "XL", "XXL"], selected: "M" },
    ],
    materials: "100% GOTS-certified organic cotton, 180 GSM single jersey knit",
    productLanguage: ["English", "Portuguese", "German", "French"],
    manufacturingCountry: "Portugal",
    manufacturingCountryCode: "pt",
    countryOfLastProcessing: "PT",

    // ── Customisation ──
    customizationOptions: [
      { name: "Screen printing", extraCost: 0.80, currency: "€", minQty: 200 },
      { name: "Custom woven label", extraCost: 0.30, currency: "€", minQty: 500 },
      { name: "Custom hang tags", extraCost: 0.15, currency: "€", minQty: 500 },
    ],
    customizationAbility: { verified: true, levels: ["Print-on-demand", "Custom labeling", "Full customization"] },

    // ── Reviews ──
    productReputation: {
      overallScore: 4.7,
      sourcesCount: 89,
      lastUpdated: "Feb 2026",
      summary: "Organic blank t-shirts receive strong ratings for consistent quality and GOTS certification. Buyers consistently praise the weight, color consistency, and value for print-on-demand applications. Some minor batch-to-batch sizing variations noted.",
      dimensions: [
        { label: "Product Quality", score: 4.8 },
        { label: "Value for Money", score: 4.6 },
        { label: "Accuracy of Description", score: 4.7 },
        { label: "Packaging Quality", score: 4.5 },
        { label: "Resale Performance", score: 4.7 },
      ],
      highlights: [
        "GOTS certification highly valued by eco-conscious retailers",
        "Excellent color consistency across batches",
        "Ideal weight for screen printing and print-on-demand applications",
        "High reorder rate from commercial buyers",
      ],
      cautions: [
        "Minor sizing inconsistencies reported between batches",
        "Limited color palette compared to competitors",
      ],
    },

    // ── Platform features ──
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [0, 3, 7],

    // ── Analytics ──
    unitsSold: 156000,
    reorderRate: 72,
    categoryRanking: { rank: 1, category: "Blank T-Shirts — Organic" },
    viewCount: 42100,
    inquiryCount: 890,

    // ── Samples ──
    samplePrice: { amount: 12.00, currency: "€" },
    testerOption: { available: true, price: 12.00, currency: "€", nonReturnable: true },
    sampleLeadTime: { min: 3, max: 5, unit: "days" },

    // ── Lifecycle ──
    dateAdded: "01/06/2025",
    dealStatus: "active",
    launchDate: "2025-01-15",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: null,
    grade: "New",
    productGrade: "A-grade",
    gradeNotes: null,
    gradeCategory: null,
    country: "PT",
    countryName: "Portugal",

    // ── Attachments ──
    attachments: [
      { name: "GOTS Certificate.pdf", size: "380 KB", type: "pdf" },
      { name: "Size Chart & Measurements.pdf", size: "210 KB", type: "pdf" },
      { name: "Wholesale Catalogue 2025.pdf", size: "4.2 MB", type: "pdf" },
      { name: "Fabric Swatch Photos.zip", size: "6.8 MB", type: "zip" },
    ],
    videoUrl: null,

    // ── Eco ──
    ecoFriendly: {
      materials: ["GOTS-certified organic cotton", "No synthetic blends"],
      packaging: ["Biodegradable polybags", "Recyclable cardboard cartons"],
      production: "Solar-powered factory, zero-discharge dyeing",
    },
    carbonFootprint: { value: 3.2, unit: "kg-CO2e", scope: "cradle-to-gate" },

    // ── Apparel-specific (G6) ──
    fabricComposition: [{ material: "Organic Cotton", percentage: 100 }],
    gsm: 180,
    careInstructions: { wash: "Machine wash 30°C", dry: "Tumble dry low", iron: "Medium heat", bleach: "Do not bleach" },
    fitType: "Regular",
    gender: "Women",
    sizeChart: ["S", "M", "L", "XL", "XXL"],
    pattern: "solid",

    // ── Food nulls ──
    ingredients: null,
    allergens: null,
    dietaryTags: null,
    storageInstructions: null,
    shelfLife: null,
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    gmoDeclaration: null,
    storageTemperatureRange: null,

    // ── Beauty nulls ──
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,

    // ── Industrial nulls ──
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,

    // ── Electronics nulls ──
    sarValue: null,
    ipRating: null,
    energyRating: null,
    batteryInfo: null,
    powerSource: null,
    assemblyRequired: null,
    weeeClassification: null,

    // ── Compliance ──
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    warrantyInfo: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    euResponsiblePerson: { name: "NordWear EU Compliance", address: "Rua do Almada 220, 4100-012 Porto, Portugal", email: "compliance@nordwear.pt" },
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-03-01" },
    rohsCompliance: null,

    // ── Trust ──
    ageRestriction: null,
    countryRestrictions: null,
    restrictionScope: null,
    restrictedContinents: null,
    freeReturns: false,
    productInsurance: { included: true, provider: "Zurich", coverage: "Transit damage up to €25,000" },
    qualityInspection: { available: true, provider: "GOTS", type: "Annual factory audit", cost: "Included" },
    authenticityGuarantee: "100% authentic, GOTS certified",
    dealReturnPolicy: null,
    warranty: null,
    functionalRate: null,

    // ── Lot & stock ──
    imagesRepresentative: true,
    mayContainDuplicates: false,
    isManifested: null,
    sourceRetailers: null,
    stockOrigin: null,
    predominantSizes: ["M", "L"],
    hasOriginalLabels: true,
    labelCondition: "Original labels intact",

    // ── Badges ──
    weeksBestOffer: false,
    platformExclusive: false,
    promotionalBadge: null,
    lowStockWarning: null,
    firstOrderDiscount: { percentage: 10, label: "-10% ON YOUR FIRST ORDER!" },

    // ── B2B extras ──
    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 1000, leadTime: "3-4 weeks", setupFee: { amount: 100, currency: "€" } },
    sellToPrivate: false,
    exportOnly: false,
    exportRegions: null,
    invoiceType: "VAT",
    sanitizedInvoice: "Available",
    importDutyCoverage: { covered: true, regions: ["EU"] },

    // ── Lead time tiers ──
    leadTimeTiers: [
      { minQty: 500, maxQty: 2000, days: 10 },
      { minQty: 2001, maxQty: 10000, days: 18 },
      { minQty: 10001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplyAbility: { quantity: 50000, unit: "pieces", period: "month" },

    // ── SEO ──
    searchKeywords: ["blank t-shirts wholesale", "organic cotton t-shirts", "women t-shirts bulk", "GOTS certified apparel", "blank garments wholesale"],
    metaTitle: "Women's Organic Cotton T-Shirts — Wholesale Blank Apparel | WholesaleUp",
    metaDescription: "Buy GOTS-certified women's cotton t-shirts wholesale from €3.20/pc. 681% markup. 12 colours, S–XXL. MOQ 500 pieces.",
    modelCount: null,
    productHighlights: [
      "100% GOTS-certified organic cotton, 180 GSM",
      "12 colour options with pre-shrunk fabric",
      "Sizes S to XXL with EU standard sizing",
      "Perfect for print-on-demand and retail",
      "Made in Portugal with solar-powered production",
    ],
    showroomAvailable: { available: true, location: "Porto, Portugal", byAppointment: true },
    packagingFormat: "Individual polybags, cartons of 50pcs",
    offerValidityDays: null,
    packageContents: "1× T-shirt in individual polybag with size sticker",
    compatibleWith: null,
    targetAudience: ["Fashion retailers", "Print-on-demand services", "Promotional merchandise companies", "Online fashion stores"],
    hazardSymbols: null,
  },

  "health-beauty": {
    _label: "Health & Beauty",
    // ── Identity ──
    id: 9,
    title: "Hyaluronic Acid Intensive Moisturiser – 50ml, SPF 30, Dermatologist Approved",
    slug: "hyaluronic-acid-intensive-moisturiser-50ml-spf30",
    category: "Health & Beauty",
    categoryBreadcrumb: ["Health & Beauty", "Skincare"],
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1570194065650-d99fb4ee3313?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop",
    ],
    description: `Professional-grade hyaluronic acid moisturiser with SPF 30 broad-spectrum sun protection. Formulated in France with 2% pure hyaluronic acid, niacinamide (vitamin B3), and vitamin E for deep hydration and anti-aging benefits.

Lightweight, non-greasy formula absorbs quickly. Suitable for all skin types including sensitive skin. Airless pump dispenser preserves active ingredients. Fragrance-free, paraben-free, silicone-free.

CLINICAL RESULTS: 94% of participants reported improved skin hydration after 4 weeks. Dermatologically tested on sensitive skin. Not tested on animals — Leaping Bunny certified.`,
    tags: ["#skincare", "#moisturiser", "#hyaluronic-acid", "#spf30", "#vegan", "#cruelty-free", "#french", "#wholesale", "#anti-aging"],

    // ── Pricing ──
    price: 5.40,
    currency: "€",
    priceUnit: "/ Unit ex. VAT",
    rrp: 32.00,
    rrpCurrency: "€",
    markup: 492.6,
    mapPrice: { amount: 24.99, currency: "€" },
    priceValidUntil: "2026-12-31",
    netPaymentTerms: "Net 30",
    depositRequired: null,
    taxClass: "standard",
    costOfGoodsSold: { value: 3.20, currency: "€" },
    unitPricingBaseMeasure: { value: 100, unit: "ml" },
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 5.40 }, { minQty: 501, maxQty: 2000, price: 4.80 }, { minQty: 2001, maxQty: null, price: 4.20 }],

    // ── Volume ──
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 32.00, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 26.60, profitLabel: "/1 Unit inc.VAT", markup: 492.6, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 27.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 22.59, profitLabel: "/1 Unit inc.VAT", markup: 418.3, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    comparisonPrice: { label: "Lower priced than similar", percentage: 28 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },

    // ── Order ──
    moq: 100,
    orderIncrement: 12,
    availableQuantity: 12000,
    casePackSize: 24,
    crossCategoryMOQ: false,
    isIndivisibleLot: false,
    maxOrderQuantity: 20000,
    isAssortedLot: false,
    lotComposition: null,
    multipackQuantity: null,
    lotRetailValue: null,

    // ── Identification ──
    sku: "LL-HAIM-50-SPF30",
    ean: "3401234567890",
    taric: "3304990000",
    mpn: "LL-HAIM50SPF30",
    batchNumber: "LOT-2025-B0422",
    serialNumberRequired: false,
    itemGroupId: "WUP-GRP-LLHAIM",
    gln: "3401234000019",
    gpcCode: "10000455",

    // ── Brands ──
    brands: [{ name: "Lumière Lab", country: "FR" }],
    brandTier: "Premium",

    // ── Shipping ──
    shippingTime: 5,
    shippingCountries: "France, United Kingdom, Germany, Netherlands, Belgium, Spain, Italy, Austria, Switzerland, Sweden",
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    shippingClass: "Standard",
    shippingCostBearer: "buyer",
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    freeShippingThreshold: { amount: 500, currency: "€" },
    incoterms: "DDP",
    readyToShip: true,
    shipsFrom: "Lyon, France",
    shipsFromCode: "fr",
    portOfOrigin: null,
    estimatedDeliveryRange: { minDate: "Mar 15", maxDate: "Mar 22" },

    // ── Logistics ──
    packaging: { length: 6, width: 6, height: 10, unit: "cm", weight: 0.12, weightUnit: "kg" },
    palletConfiguration: { unitsPerLayer: 120, layersPerPallet: 6, unitsPerPallet: 720 },
    containerLoadQuantity: { twentyFt: 14400, fortyFt: 28800, fortyHC: 34000 },
    stackable: true,
    grossWeight: { value: 0.15, unit: "kg" },
    netWeight: { value: 0.085, unit: "kg" },
    dimensionsPerUnit: { length: 5, width: 5, height: 9, unit: "cm" },
    productDimensions: { length: 45, width: 45, height: 85, unit: "mm", notes: "jar with pump cap" },
    despatchUnitIndicator: false,

    // ── Payment ──
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["National delivery", "International delivery"],

    // ── Deal details ──
    dealLocation: "France",
    dealLocationCode: "fr",
    isDropship: true,
    negotiable: true,
    isExpired: false,

    // ── Supplier ──
    supplier: {
      companyName: "Lumière Laboratoires S.A.S.",
      isVerified: true,
      rating: 4.9,
      reviewCount: 134,
      yearsActive: 12,
      categories: ["Skincare", "Sun Protection", "Anti-Aging", "Professional Beauty"],
      moreCategories: 2,
      address: {
        country: "France",
        countryCode: "fr",
        city: "Lyon",
        postalCode: "69002",
        street: "Rue de la République",
      },
      companyWebsite: "lumierelab.fr",
      contact: {
        name: "Sophie Dupont",
        roleInCompany: "B2B Sales Manager",
        phone: "+33 4 72 00 12 34",
      },
      businessHours: {
        Sun: "Closed",
        Mon: "09:00 – 17:30",
        Tue: "09:00 – 17:30",
        Wed: "09:00 – 17:30",
        Thu: "09:00 – 17:30",
        Fri: "09:00 – 16:00",
        Sat: "Closed",
      },
      currentTime: "15:45",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2014,
      onTimeDeliveryRate: 97.8,
      responseTime: "≤2h",
      revenueTier: "enterprise",
      companySize: 52,
      facilitySize: 4500,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "ECOCERT",
      customizationAbility: ["Private label formulation", "Custom packaging"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "French premium skincare and beauty laboratory specializing in professional-grade formulations with a focus on dermatological efficacy and sustainability. Founded in 2014, we serve professional beauty brands, spas, and e-commerce retailers across Europe.",
      productsOffered: "Skincare serums, sun protection products, anti-aging formulations, professional beauty treatments, and custom private label skincare solutions.",
      productCategories: ["skincare", "beauty", "sun-protection"],
      brandsDistributed: ["Lumière", "Private Label"],
      productQualityTier: ["premium"],
      certifications: ["iso-9001", "iso-22716", "ecocert", "vegan"],
      sampleAvailability: "paid",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 540,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "credit-debit-card", "paypal", "bnpl"],
      paymentTerms: "Net 30 for verified accounts; Net 60 for committed partnerships",
      defaultDepositPercentage: 25,
      defaultDepositTerms: "25% deposit upfront, 75% before delivery",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "30-day return on unopened products with intact seals.",
      discountTiers: [
        { currency: "€", minOrder: "1000", discount: "5" },
        { currency: "€", minOrder: "5000", discount: "10" },
        { currency: "€", minOrder: "15000", discount: "15" },
      ],
      discountNotes: "Volume discounts for single orders. Custom negotiated terms for exclusive partnerships.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "gls"],
      leadTime: "3-5-days",
      defaultIncoterms: "DDP",
      countriesServed: ["FR", "DE", "IT", "ES", "NL", "BE", "GB", "CH", "AT"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "brand-owner"],
      buyerTypesServed: ["online-retailer", "marketplace-seller", "beauty-retailer", "spa-salon"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "white-label", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/lumierelaboratoires",
      socialInstagram: "https://instagram.com/lumierelaboratoires",
      socialLinkedin: "https://linkedin.com/company/lumiere-laboratoires",
      preferredCurrency: "EUR",
    },

    // ── Supplier-level ──
    certifications: ["iso-9001", "iso-22716"],
    returnPolicy: "30-day return on unopened products with intact seals.",
    leadTime: "3-5-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 540,
    minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal", "bnpl"],
    discountTiers: [
      { currency: "€", minOrder: "1000", discount: "5" },
      { currency: "€", minOrder: "5000", discount: "10" },
      { currency: "€", minOrder: "15000", discount: "15" },
    ],
    supplyModels: ["wholesale", "dropshipping", "white-label"],
    productQualityTier: ["premium"],
    supplierBusinessType: "manufacturer",
    supplierIsCertified: true,
    supplierResponseBadge: "very quickly",

    // ── Product specs ──
    specifications: {
      "Volume": "50 ml",
      "SPF": "30 (Broad Spectrum UVA/UVB)",
      "Skin Type": "All skin types",
      "Format": "Pump jar, airless dispenser",
      "Shelf Life": "36 months sealed / 12 months after opening",
      "Testing": "Dermatologically tested, ophthalmologist approved",
    },
    variants: [
      { name: "Size", options: ["30 ml", "50 ml", "100 ml"], selected: "50 ml" },
    ],
    materials: null,
    productLanguage: ["French", "English", "German", "Spanish", "Italian"],
    manufacturingCountry: "France",
    manufacturingCountryCode: "fr",
    countryOfLastProcessing: "FR",

    // ── Customisation ──
    customizationOptions: [
      { name: "Private label branding", extraCost: 1.50, currency: "€", minQty: 500 },
      { name: "Custom outer packaging", extraCost: 0.80, currency: "€", minQty: 1000 },
    ],
    customizationAbility: { verified: true, levels: ["Private label formulation", "Custom packaging"] },

    // ── Reviews ──
    productReputation: {
      overallScore: 4.9,
      sourcesCount: 134,
      lastUpdated: "Feb 2026",
      summary: "Excellent reception from beauty and pharmacy retailers. SPF 30 moisturizer praised for texture, efficacy, and cruelty-free certification. Professional users note the 50ml size is ideal for retail but limiting for salon bulk use.",
      dimensions: [
        { label: "Product Quality", score: 4.9 },
        { label: "Value for Money", score: 4.8 },
        { label: "Accuracy of Description", score: 4.9 },
        { label: "Packaging Quality", score: 4.7 },
        { label: "Resale Performance", score: 4.8 },
      ],
      highlights: [
        "Leaping Bunny certification drives sales to ethically-conscious consumers",
        "Highly repeatable formulation with excellent skincare results",
        "Strong margins reported by beauty retailers",
        "Professional-grade formulation suitable for salon retailing",
      ],
      cautions: [
        "50ml size limits appeal for spa/salon wholesale buyers",
        "Higher price point than some competitors",
      ],
    },

    // ── Platform features ──
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [1, 2, 6],

    // ── Analytics ──
    unitsSold: 89000,
    reorderRate: 74,
    categoryRanking: { rank: 1, category: "Moisturisers — SPF" },
    viewCount: 31400,
    inquiryCount: 567,

    // ── Samples ──
    samplePrice: { amount: 10.00, currency: "€" },
    testerOption: { available: true, price: 10.00, currency: "€", nonReturnable: true },
    sampleLeadTime: { min: 2, max: 4, unit: "days" },

    // ── Lifecycle ──
    dateAdded: "10/01/2025",
    dealStatus: "active",
    launchDate: "2024-09-01",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: null,
    grade: "New",
    productGrade: "Professional Grade",
    gradeNotes: null,
    gradeCategory: null,
    country: "FR",
    countryName: "France",

    // ── Attachments ──
    attachments: [
      { name: "Safety Data Sheet (SDS).pdf", size: "520 KB", type: "pdf" },
      { name: "Clinical Trial Results.pdf", size: "1.8 MB", type: "pdf" },
      { name: "CPNP Notification.pdf", size: "340 KB", type: "pdf" },
      { name: "Product Photos (High Res).zip", size: "9.2 MB", type: "zip" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    // ── Eco ──
    ecoFriendly: {
      materials: ["Recyclable glass jar", "Bamboo pump cap"],
      packaging: ["FSC-certified carton", "Soy-based inks"],
      production: "Carbon-neutral facility",
    },
    carbonFootprint: { value: 1.2, unit: "kg-CO2e", scope: "cradle-to-gate" },

    // ── Beauty-specific (G8) ──
    inciList: "Aqua, Glycerin, Sodium Hyaluronate (2%), Niacinamide (5%), Tocopheryl Acetate, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Butyrospermum Parkii Butter, Ethylhexyl Methoxycinnamate, Titanium Dioxide (nano), Phenoxyethanol, Ethylhexylglycerin, Xanthan Gum, Citric Acid",
    spfRating: 30,
    skinType: ["Normal", "Oily", "Combination", "Sensitive"],
    paoMonths: 12,
    crueltyFree: { certified: true, body: "Leaping Bunny" },
    dermatologicallyTested: true,
    ingredients: "Aqua, Glycerin, Sodium Hyaluronate, Niacinamide, Tocopheryl Acetate, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Butyrospermum Parkii Butter, Ethylhexyl Methoxycinnamate, Titanium Dioxide",
    allergens: ["Butyrospermum Parkii (Shea)"],
    dietaryTags: ["Vegan", "Cruelty-free", "Paraben-free", "Silicone-free", "Fragrance-free"],
    storageInstructions: "Store below 25°C away from direct sunlight.",
    shelfLife: "36 months",

    // ── Food nulls ──
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    gmoDeclaration: null,
    storageTemperatureRange: { min: 5, max: 25, unit: "°C" },

    // ── Apparel nulls ──
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    sizeChart: null,
    gender: "Unisex",
    pattern: null,

    // ── Industrial nulls ──
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,

    // ── Electronics nulls ──
    sarValue: null,
    ipRating: null,
    energyRating: null,
    batteryInfo: null,
    powerSource: null,
    assemblyRequired: null,
    weeeClassification: null,

    // ── Compliance ──
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    warrantyInfo: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: { registered: true, number: "FDA-3082734", type: "cosmetic" },
    euResponsiblePerson: { name: "Lumière Laboratoires S.A.S.", address: "42 Rue de la République, 69002 Lyon, France", email: "regulatory@lumierelab.fr" },
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-06-01" },
    rohsCompliance: null,

    // ── Trust ──
    ageRestriction: null,
    countryRestrictions: null,
    restrictionScope: null,
    restrictedContinents: null,
    freeReturns: true,
    productInsurance: { included: true, provider: "AXA", coverage: "Transit damage up to €15,000" },
    qualityInspection: { available: true, provider: "ECOCERT", type: "Annual facility audit", cost: "Included" },
    authenticityGuarantee: "100% authentic, CPNP notified",
    dealReturnPolicy: null,
    warranty: null,
    functionalRate: null,

    // ── Lot & stock ──
    imagesRepresentative: false,
    mayContainDuplicates: false,
    isManifested: null,
    sourceRetailers: null,
    stockOrigin: null,
    predominantSizes: null,
    hasOriginalLabels: true,
    labelCondition: "Original labels intact",

    // ── Badges ──
    weeksBestOffer: false,
    platformExclusive: false,
    promotionalBadge: null,
    lowStockWarning: null,
    firstOrderDiscount: { percentage: 8, label: "-8% ON YOUR FIRST ORDER!" },

    // ── B2B extras ──
    exclusivityAvailable: true,
    whiteLabeling: { available: true, moq: 500, leadTime: "6-8 weeks", setupFee: { amount: 500, currency: "€" } },
    sellToPrivate: false,
    exportOnly: false,
    exportRegions: null,
    invoiceType: "VAT",
    sanitizedInvoice: "On Request",
    importDutyCoverage: { covered: true, regions: ["EU", "UK"] },

    // ── Lead time tiers ──
    leadTimeTiers: [
      { minQty: 100, maxQty: 500, days: 5 },
      { minQty: 501, maxQty: 2000, days: 10 },
      { minQty: 2001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplyAbility: { quantity: 30000, unit: "units", period: "month" },

    // ── SEO ──
    searchKeywords: ["hyaluronic acid moisturiser wholesale", "SPF moisturiser bulk", "skincare wholesale", "anti-aging cream supplier", "vegan skincare wholesale"],
    metaTitle: "Hyaluronic Acid Moisturiser SPF 30 — Wholesale Skincare | WholesaleUp",
    metaDescription: "Buy professional-grade HA moisturiser wholesale from €5.40/unit. 492% markup. SPF 30, vegan, cruelty-free. MOQ 100 units.",
    modelCount: null,
    productHighlights: [
      "2% pure hyaluronic acid with 5% niacinamide",
      "SPF 30 broad-spectrum UVA/UVB protection",
      "Leaping Bunny certified cruelty-free and vegan",
      "Airless pump preserves active ingredients",
      "Clinically proven — 94% improved hydration in 4 weeks",
    ],
    showroomAvailable: { available: true, location: "Lyon, France", byAppointment: true },
    packagingFormat: "Individual retail boxes, cartons of 24 units",
    offerValidityDays: null,
    packageContents: "1× 50ml airless pump jar, 1× Product leaflet (multi-language)",
    compatibleWith: null,
    targetAudience: ["Beauty retailers", "Pharmacies", "Dermatology clinics", "Online skincare shops", "Spas and salons"],
    hazardSymbols: null,
  },

  "home-garden": {
    _label: "Home & Garden",
    id: 103,
    title: "Stainless Steel Garden Secateurs – Bypass Pruner, Ergonomic Handle",
    slug: "stainless-steel-garden-secateurs-bypass-pruner",
    category: "Home & Garden",
    categoryBreadcrumb: ["Home & Garden", "Garden & Outdoor"],
    images: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&h=800&fit=crop",
    ],
    description: `Professional-grade bypass garden secateurs with Japanese SK5 high-carbon stainless steel blades. Ergonomic non-slip TPR handle with adjustable opening width. Clean cuts up to 25mm branch diameter.

Features a sap groove to prevent sticking, wire-cutting notch, and safety lock mechanism. Backed by a lifetime warranty against manufacturing defects.

Ideal for garden centres, hardware stores, and online garden tool retailers. Strong seasonal demand spring through autumn.`,
    tags: ["#garden", "#secateurs", "#pruner", "#tools", "#stainless-steel", "#wholesale", "#garden-centre"],

    price: 4.50,
    currency: "€",
    priceUnit: "/ Piece ex. VAT",
    rrp: 18.99,
    rrpCurrency: "€",
    markup: 322.0,
    dateAdded: "05/02/2026",
    grade: "New",
    country: "CN",
    countryName: "China",
    moq: 200,
    sku: "HG-SEC-BP-SK5",
    taric: "8201100000",
    ean: "6901234567890",
    brands: [{ name: "GardenPro", country: "DE" }],
    shippingTime: 21,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 18.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 14.49, profitLabel: "/1 Unit inc.VAT", markup: 322.0, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 15.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 11.49, profitLabel: "/1 Unit inc.VAT", markup: 255.33, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Hangzhou, China",
    dealLocationCode: "cn",
    stockLocation: "Netherlands",
    stockLocationCode: "nl",
    isDropship: true,
    negotiable: true,
    isExpired: false,
    availableQuantity: 25000,
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["International delivery"],
    shippingCountries: "Germany, United Kingdom, France, Netherlands, Belgium, Spain, Italy, Poland, Austria, Sweden",
    attachments: [
      { name: "Product Specification.pdf", size: "1.5 MB", type: "pdf" },
      { name: "CE Certificate.pdf", size: "380 KB", type: "pdf" },
    ],
    supplier: {
      companyName: "Hangzhou GardenPro Tools Co., Ltd.",
      isVerified: true,
      rating: 4.5,
      reviewCount: 156,
      yearsActive: 12,
      categories: ["Garden Tools", "Hand Tools", "Outdoor Equipment"],
      moreCategories: 3,
      address: { country: "China", countryCode: "cn", city: "Hangzhou", postalCode: "310000", street: "Xiaoshan Industrial Zone B-12" },
      companyWebsite: "gardenpro-tools.com",
      contact: { name: "Wei Zhang", roleInCompany: "Export Director", phone: "+86 571 8888 1234" },
      businessHours: { Sun: "Closed", Mon: "08:00 – 17:30", Tue: "08:00 – 17:30", Wed: "08:00 – 17:30", Thu: "08:00 – 17:30", Fri: "08:00 – 17:00", Sat: "09:00 – 13:00" },
      currentTime: "15:30",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2014,
      onTimeDeliveryRate: 94.8,
      responseTime: "≤8h",
      revenueTier: "established",
      companySize: 120,
      facilitySize: 8000,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "SGS Group",
      customizationAbility: ["Drawing-based customization", "Sample-based customization", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Chinese manufacturer of garden tools and hand tools with over a decade of experience in export markets. We produce high-quality, ergonomically-designed tools for retail and professional use across Europe and beyond.",
      productsOffered: "Garden tools including secateurs, pruners, shears, and hand tools. Focus on ergonomic design, durable stainless steel construction, and competitive pricing.",
      productCategories: ["garden-tools", "hand-tools", "outdoor-equipment"],
      brandsDistributed: ["GardenPro", "OEM"],
      productQualityTier: ["mid-range"],
      certifications: ["ce", "iso-9001", "sgc"],
      sampleAvailability: "paid",
      catalogueSize: "200-1000",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 900,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
      paymentTerms: "Net 30 for established accounts; LC/TT for new buyers",
      defaultDepositPercentage: 30,
      defaultDepositTerms: "30% T/T deposit, 70% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "30-day return on unopened items. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "2000", discount: "5" },
        { currency: "€", minOrder: "10000", discount: "12" },
      ],
      discountNotes: "Volume discounts available. Custom pricing for large OEM orders.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "sea-freight"],
      leadTime: "15-21-days",
      defaultIncoterms: "FOB",
      countriesServed: ["DE", "GB", "FR", "NL", "BE", "ES", "IT", "AT", "PL", "SE"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "wholesaler"],
      buyerTypesServed: ["online-retailer", "garden-centre", "hardware-retailer", "distributor"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/gardenprotools",
      socialInstagram: "https://instagram.com/gardenprotools",
      socialLinkedin: "https://linkedin.com/company/gardenpro-tools",
      preferredCurrency: "EUR",
    },
    certifications: ["ce", "iso-9001"],
    returnPolicy: "30-day return on unopened items. Buyer pays return shipping.",
    leadTime: "15-21-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 900,
    minimumOrderCurrency: "€",
    catalogueSize: "200-1000",
    supplierPaymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
    discountTiers: [
      { currency: "€", minOrder: "2000", discount: "5" },
      { currency: "€", minOrder: "10000", discount: "12" },
    ],
    supplyModels: ["wholesale", "dropshipping", "private-label"],
    productQualityTier: ["mid-range"],
    specifications: {
      "Blade Material": "SK5 High-Carbon Stainless Steel",
      "Handle": "TPR non-slip ergonomic grip",
      "Cutting Capacity": "25mm max branch diameter",
      "Lock": "Safety wire lock",
      "Total Length": "210mm",
      "Weight": "230g",
    },
    variants: [
      { name: "Colour", options: ["Red/Black", "Green/Black", "Orange/Black"], selected: "Red/Black" },
    ],
    videoUrl: null,
    packaging: { length: 24, width: 9, height: 3, unit: "cm", weight: 0.28, weightUnit: "kg" },
    materials: "SK5 high-carbon stainless steel, TPR rubber, aluminium alloy",
    productLanguage: ["English", "German", "French"],
    manufacturingCountry: "China",
    manufacturingCountryCode: "cn",
    customizationOptions: [
      { name: "Custom logo printing", extraCost: 0.30, currency: "€", minQty: 1000 },
      { name: "Custom packaging", extraCost: 0.50, currency: "€", minQty: 2000 },
    ],
    productReputation: {
      overallScore: 4.5,
      sourcesCount: 156,
      lastUpdated: "Feb 2026",
      summary: "Garden secateurs deliver solid performance at competitive pricing. Ergonomic handle design is a key selling point. Quality is reliable though some batch variation noted. Good value for DIY and professional garden retailers.",
      dimensions: [
        { label: "Product Quality", score: 4.6 },
        { label: "Value for Money", score: 4.7 },
        { label: "Accuracy of Description", score: 4.4 },
        { label: "Packaging Quality", score: 4.2 },
        { label: "Resale Performance", score: 4.5 },
      ],
      highlights: [
        "Ergonomic handle design praised by end users",
        "Reliable cutting performance at budget price point",
        "SK5 steel blade maintains sharpness",
        "Good margin potential for garden tool retailers",
      ],
      cautions: [
        "Shipping times can be longer than expected from Asia",
        "Some cosmetic variations between batches",
      ],
    },
    isBestseller: false,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [1, 3],
    unitsSold: 32000,
    reorderRate: 42,
    categoryRanking: { rank: 5, category: "Garden Hand Tools" },
    samplePrice: { amount: 12.00, currency: "€" },
    shelfLife: null,
    shipsFrom: "Hangzhou, China",
    shipsFromCode: "cn",
    freeReturns: false,
    orderIncrement: 10,
    ecoFriendly: {
      materials: ["Recyclable packaging"],
      packaging: ["Cardboard (FSC)"],
      production: "ISO 14001 environmental management",
    },
    estimatedDeliveryRange: { minDate: "Mar 30", maxDate: "Apr 8" },
    freeShippingThreshold: { amount: 2000, currency: "€" },
    testerOption: { available: true, price: 12.00, currency: "€", nonReturnable: true },
    casePackSize: 12,
    ingredients: null,
    allergens: null,
    dietaryTags: null,
    storageInstructions: "Store in dry conditions. Oil blades periodically to prevent rust.",
    customizationAbility: { verified: true, levels: ["Minor customization", "Drawing-based customization", "Full customization"] },
    importDutyCoverage: { covered: false, regions: [] },
    brandTier: "Verified",
    promotionalBadge: "Spring Garden Sale",
    comparisonPrice: { label: "Lower priced than similar", percentage: 18 },
    paymentFinancing: null,
    lowStockWarning: null,
    productGrade: "Standard",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: { duration: "Lifetime", type: "Manufacturer", coverage: "Manufacturing defects" },
    ageRestriction: null,
    dimensionsPerUnit: { length: 21, width: 6.5, height: 2.5, unit: "cm" },
    netWeight: { value: 0.23, unit: "kg" },
    mpn: "GP-SEC-BP25-SK5",
    batchNumber: null,
    serialNumberRequired: false,
    mapPrice: null,
    priceValidUntil: "2026-09-30",
    netPaymentTerms: "Net 30",
    depositRequired: { percentage: 30, terms: "30% upfront via T/T, 70% before shipping" },
    taxClass: "standard",
    palletConfiguration: { unitsPerLayer: 120, layersPerPallet: 8, unitsPerPallet: 960 },
    containerLoadQuantity: { twentyFt: 15000, fortyFt: 30000, fortyHC: 35000 },
    shippingClass: "Standard",
    incoterms: "FOB",
    readyToShip: true,
    stackable: true,
    portOfOrigin: "Ningbo, China",
    dealStatus: "active",
    launchDate: "2024-03-01",
    discontinuedDate: null,
    seasonality: "Spring/Summer",
    bestBeforeDate: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    gender: "Unisex",
    sizeChart: null,
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,
    // ── INDUSTRIAL-ADJACENT (DIY tools) — exercise vars from removed industrial preset ──
    toleranceSpecs: "±0.5mm blade alignment",
    pressureRating: null,
    temperatureRange: { min: -10, max: 50, unit: "°C" },
    threadType: null,
    materialGrade: "SK5 High-Carbon Steel",
    viewCount: 22500,
    inquiryCount: 380,
    searchKeywords: ["garden secateurs wholesale", "pruning shears bulk", "bypass pruner wholesale", "garden tools trade"],
    metaTitle: "Garden Secateurs SK5 Steel — Wholesale | WholesaleUp",
    metaDescription: "Buy professional garden secateurs wholesale from €4.50/piece. 322% markup. SK5 steel, ergonomic grip. MOQ 200.",
    slug: "stainless-steel-garden-secateurs-bypass-pruner",
    maxOrderQuantity: 50000,
    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 5000, leadTime: "4-6 weeks", setupFee: { amount: 200, currency: "€" } },
    productInsurance: { included: true, provider: "PICC", coverage: "Transit damage up to €20,000" },
    qualityInspection: { available: true, provider: "SGS", type: "Pre-shipment", cost: "€0.05/unit" },
    firstOrderDiscount: { percentage: 8, label: "-8% ON YOUR FIRST ORDER!" },
    packageContents: "1× Bypass secateur, 1× Blade protector cap, 1× User manual",
    compatibleWith: null,
    sellToPrivate: false,
    targetAudience: ["Garden centres", "Hardware stores", "Online garden retailers", "Market traders"],
    hazardSymbols: null,
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "100% genuine SK5 steel, factory QC tested",
    imagesRepresentative: false,
    supplierIsCertified: false,
    supplierResponseBadge: "quickly",
    dealReturnPolicy: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: null,
    weeksBestOffer: false,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 60,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: false,
    platformExclusive: false,
    modelCount: 35,
    labelCondition: "Original retail packaging with barcode",
    mayContainDuplicates: false,
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    invoiceType: "VAT",
    sanitizedInvoice: "Unavailable",
    packagingFormat: "Individual blister packs, master cartons of 12",
    productDimensions: { length: 210, width: 65, height: 25, unit: "mm", notes: "closed position" },
    predominantSizes: null,
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 200, maxQty: 1000, price: 4.50 }, { minQty: 1001, maxQty: 5000, price: 3.80 }, { minQty: 5001, maxQty: null, price: 3.20 }],
    warranty: "Lifetime",
    functionalRate: null,
    supplyAbility: { quantity: 100000, unit: "pieces", period: "month" },
    sampleLeadTime: { min: 3, max: 5, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "GardenPro Europe GmbH", address: "Industriestr. 15, 40210 Düsseldorf, Germany", email: "eu@gardenpro-tools.com" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 200, maxQty: 1000, days: 15 },
      { minQty: 1001, maxQty: 10000, days: 25 },
      { minQty: 10001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer-trading",
    grossWeight: { value: 0.28, unit: "kg" },
    multipackQuantity: null,
    itemGroupId: "WUP-GRP-GP-SEC",
    pattern: null,
    productHighlights: [
      "SK5 high-carbon stainless steel blades for clean cuts",
      "Ergonomic TPR non-slip handle — reduces hand fatigue",
      "Cuts branches up to 25mm diameter",
      "Lifetime warranty against manufacturing defects",
    ],
    gln: "6901234567890",
    gpcCode: "10001234",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "CN",
    gmoDeclaration: null,
    weeeClassification: null,
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-06-01" },
    rohsCompliance: null,
    carbonFootprint: { value: 3.8, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: null,
    costOfGoodsSold: { value: 2.10, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "piece" },
  },

  "electronics-technology": {
    _label: "Electronics & Technology (default)",
    // Base DEAL IS the electronics product — no overrides needed.
    // This preset exists so the dropdown has an explicit "Electronics" option.
  },

  "toys-games": {
    _label: "Toys & Games",
    id: 12,
    title: "RC Racing Drone with HD Camera – 4K WiFi FPV, Foldable, 3 Batteries",
    slug: "rc-racing-drone-4k-wifi-fpv-foldable",
    category: "Toys & Games",
    categoryBreadcrumb: ["Toys & Games", "Outdoor & Active Toys"],
    images: [
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&h=800&fit=crop",
    ],
    description: `High-performance 4K HD camera drone with WiFi FPV real-time transmission. Foldable design for easy transport. Includes 3 rechargeable batteries for up to 75 minutes total flight time (25 min per battery).

Features: GPS positioning, altitude hold, one-key return, headless mode, gesture control, follow-me mode. 2.4GHz interference-free transmission up to 300m range. Suitable for beginners and intermediate pilots aged 14+.

CE, EN71, and FCC certified. Includes carrying case, spare propellers, charging cable, and instruction manual in 6 languages.`,
    tags: ["#drone", "#4k-camera", "#fpv", "#rc", "#foldable", "#gps", "#toys", "#wholesale", "#3-batteries"],

    price: 28.50,
    currency: "€",
    priceUnit: "/ Unit ex. VAT",
    rrp: 89.99,
    rrpCurrency: "€",
    markup: 215.8,
    mapPrice: null,
    priceValidUntil: "2026-12-31",
    netPaymentTerms: "Net 30",
    depositRequired: null,
    taxClass: "standard",
    costOfGoodsSold: { value: 18.00, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "piece" },
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 28.50 }, { minQty: 201, maxQty: 1000, price: 25.00 }, { minQty: 1001, maxQty: null, price: 22.00 }],
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 89.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 61.49, profitLabel: "/1 Unit inc.VAT", markup: 215.8, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 74.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 46.49, profitLabel: "/1 Unit inc.VAT", markup: 163.1, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    comparisonPrice: { label: "Lower priced than similar", percentage: 20 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },

    moq: 50,
    orderIncrement: 10,
    availableQuantity: 5000,
    casePackSize: 10,
    crossCategoryMOQ: false,
    isIndivisibleLot: false,
    maxOrderQuantity: 10000,
    isAssortedLot: false,
    lotComposition: null,
    multipackQuantity: null,
    lotRetailValue: null,

    sku: "FD-4KDRONE-3B",
    ean: "6901234567890",
    taric: "9503006100",
    mpn: "FD-4KRC-V3",
    batchNumber: null,
    serialNumberRequired: false,
    itemGroupId: "WUP-GRP-FD4K",
    gln: null,
    gpcCode: "10005900",

    brands: [{ name: "FlyDragon", country: "CN" }],
    brandTier: "Verified",

    shippingTime: 21,
    shippingCountries: "All EU countries, United Kingdom, USA, Canada, Australia",
    shippingScope: "all-continents",
    shippingContinents: ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"],
    shippingClass: "Standard",
    shippingCostBearer: "buyer",
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    freeShippingThreshold: { amount: 3000, currency: "€" },
    incoterms: "FOB",
    readyToShip: true,
    shipsFrom: "Shenzhen, China",
    shipsFromCode: "cn",
    portOfOrigin: "Shenzhen, China",
    estimatedDeliveryRange: { minDate: "Mar 30", maxDate: "Apr 20" },

    packaging: { length: 32, width: 22, height: 12, unit: "cm", weight: 0.85, weightUnit: "kg" },
    palletConfiguration: { unitsPerLayer: 40, layersPerPallet: 5, unitsPerPallet: 200 },
    containerLoadQuantity: { twentyFt: 4000, fortyFt: 8500, fortyHC: 10000 },
    stackable: true,
    grossWeight: { value: 0.85, unit: "kg" },
    netWeight: { value: 0.35, unit: "kg" },
    dimensionsPerUnit: { length: 30, width: 20, height: 10, unit: "cm" },
    productDimensions: { length: 280, width: 280, height: 55, unit: "mm", notes: "unfolded propeller span" },
    despatchUnitIndicator: false,

    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["International delivery"],
    dealLocation: "China",
    dealLocationCode: "cn",
    isDropship: true,
    negotiable: true,
    isExpired: false,

    supplier: {
      companyName: "Shenzhen FlyDragon Technology Co., Ltd.",
      isVerified: true, rating: 4.6, reviewCount: 320, yearsActive: 7,
      categories: ["Drones & UAVs", "RC Toys", "Consumer Electronics", "Camera Equipment"],
      moreCategories: 3,
      address: { country: "China", countryCode: "cn", city: "Shenzhen", postalCode: "518000", street: "Nanshan District" },
      companyWebsite: "flydragontech.com",
      contact: { name: "Jack Chen", roleInCompany: "Export Manager", phone: "+86 755 2345 6789" },
      businessHours: { Sun: "Closed", Mon: "09:00 – 18:00", Tue: "09:00 – 18:00", Wed: "09:00 – 18:00", Thu: "09:00 – 18:00", Fri: "09:00 – 18:00", Sat: "09:00 – 13:00" },
      currentTime: "16:00", daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2019, onTimeDeliveryRate: 92.5, responseTime: "≤8h", revenueTier: "growing",
      companySize: 200, facilitySize: 8000, facilitySizeUnit: "m²",
      thirdPartyVerification: "SGS Group", customizationAbility: ["Custom packaging", "Logo printing", "Custom firmware"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Leading Chinese drone and consumer electronics manufacturer specializing in 4K UAVs, RC toys, and innovative camera equipment. Founded in 2019, we combine cutting-edge technology with competitive pricing for global B2B partners.",
      productsOffered: "Drones and UAVs, remote-controlled toys, 4K cameras, accessories, batteries, and consumer electronics with advanced imaging capabilities.",
      productCategories: ["drones", "rc-toys", "consumer-electronics", "cameras"],
      brandsDistributed: ["FlyDragon", "Custom OEM"],
      productQualityTier: ["mid-range"],
      certifications: ["ce", "en71", "fcc", "rohs", "ccc"],
      sampleAvailability: "paid",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 1425,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal"],
      paymentTerms: "LC at sight or 50/50 T/T arrangement; Net 30 for established accounts",
      defaultDepositPercentage: 50,
      defaultDepositTerms: "50% deposit with PO, 50% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "15-day return on defective items. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "3000", discount: "5" },
        { currency: "€", minOrder: "10000", discount: "12" },
      ],
      discountNotes: "Tiered discounts for bulk orders. Special pricing for OEM and white-label partnerships.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "sea-freight"],
      leadTime: "15-21-days",
      defaultIncoterms: "FOB",
      countriesServed: ["DE", "GB", "FR", "ES", "IT", "NL", "BE", "SE", "DK", "AU"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "distributor"],
      buyerTypesServed: ["online-retailer", "toy-retailer", "marketplace-seller"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/flydragontech",
      socialInstagram: "https://instagram.com/flydragontech",
      socialLinkedin: "https://linkedin.com/company/flydragon-technology",
      preferredCurrency: "USD",
    },

    certifications: ["ce", "en71", "fcc", "rohs"],
    returnPolicy: "15-day return on defective items. Buyer pays return shipping.",
    leadTime: "15-21-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 1425,
    minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "paypal"],
    discountTiers: [{ currency: "€", minOrder: "3000", discount: "5" }, { currency: "€", minOrder: "10000", discount: "12" }],
    supplyModels: ["wholesale", "dropshipping", "private-label"],
    productQualityTier: ["mid-range"],
    supplierBusinessType: "manufacturer",
    supplierIsCertified: false,
    supplierResponseBadge: "quickly",

    specifications: {
      "Camera": "4K UHD (3840×2160), 120° wide-angle",
      "Flight Time": "25 min per battery (75 min total)",
      "Range": "300m (2.4GHz)",
      "GPS": "Dual GPS + optical flow positioning",
      "Weight": "249g (sub-250g, no registration required in EU)",
      "Batteries": "3× 3.7V 1800mAh Li-Po (included)",
      "Charging": "USB-C, 90min per battery",
    },
    variants: [
      { name: "Color", options: ["Black", "White", "Grey"], selected: "Black" },
      { name: "Battery Pack", options: ["1 Battery", "2 Batteries", "3 Batteries"], selected: "3 Batteries" },
    ],
    materials: "ABS plastic body, carbon fiber propeller arms",
    productLanguage: ["English", "German", "French", "Spanish", "Italian", "Japanese"],
    manufacturingCountry: "China",
    manufacturingCountryCode: "cn",
    countryOfLastProcessing: "CN",

    customizationOptions: [
      { name: "Custom retail box", extraCost: 1.20, currency: "€", minQty: 500 },
      { name: "Logo printing on drone", extraCost: 0.80, currency: "€", minQty: 1000 },
    ],
    customizationAbility: { verified: true, levels: ["Custom packaging", "Logo printing", "Custom firmware"] },

    productReputation: {
      overallScore: 4.6,
      sourcesCount: 320,
      lastUpdated: "Feb 2026",
      summary: "Budget camera drones achieve strong market reception, particularly for holiday season stock. 4K camera and 3-battery bundle are major selling features. Pre-tested units and reliable packaging boost retail buyer confidence.",
      dimensions: [
        { label: "Product Quality", score: 4.7 },
        { label: "Value for Money", score: 4.8 },
        { label: "Accuracy of Description", score: 4.5 },
        { label: "Packaging Quality", score: 4.4 },
        { label: "Resale Performance", score: 4.6 },
      ],
      highlights: [
        "3-battery bundle provides exceptional flight time value",
        "4K camera delivers quality content for retail category",
        "Sub-250g EU registration exemption is significant differentiator",
        "CE/EN71/FCC certifications support global retail distribution",
        "Pre-testing ensures customer satisfaction",
      ],
      cautions: [
        "Battery life varies with flying style; needs clear documentation",
        "Camera quality adequate but not professional-grade",
      ],
    },

    isBestseller: true, isNew: false, orderProtection: true, frequentlyBoughtTogether: [1, 4, 7],

    unitsSold: 45000, reorderRate: 55, categoryRanking: { rank: 2, category: "Camera Drones — Budget" },
    viewCount: 62000, inquiryCount: 1200,
    samplePrice: { amount: 35.00, currency: "€" },
    testerOption: { available: true, price: 35.00, currency: "€", nonReturnable: true },
    sampleLeadTime: { min: 5, max: 10, unit: "days" },

    dateAdded: "15/08/2025",
    dealStatus: "active", launchDate: "2025-03-01", discontinuedDate: null,
    energyRating: { system: "EU Energy Label", rating: "A", annualConsumption: "8 Wh per charge cycle" },
    seasonality: "Holiday", bestBeforeDate: null,
    grade: "New", productGrade: "Standard", gradeNotes: null, gradeCategory: null,
    country: "CN", countryName: "China",

    attachments: [
      { name: "CE Certificate (EN71 + EMC).pdf", size: "450 KB", type: "pdf" },
      { name: "FCC Test Report.pdf", size: "1.2 MB", type: "pdf" },
      { name: "User Manual (6 languages).pdf", size: "3.5 MB", type: "pdf" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    ecoFriendly: { materials: ["Recyclable ABS plastic"], packaging: ["Recyclable cardboard"], production: "ISO 14001 facility" },
    carbonFootprint: { value: 5.2, unit: "kg-CO2e", scope: "cradle-to-gate" },

    // ── Toys-specific — exercises cpscCompliance, ageRestriction, energyRating ──
    ageRestriction: { minAge: 14, reason: "Small parts, lithium battery, propeller hazard" },
    cpscCompliance: { compliant: true, certNumber: "CPC-2025-SZ-78901", testLab: "SGS Shenzhen" },

    // ── Battery — exercises batteryInfo ──
    batteryInfo: { required: true, included: true, type: "Lithium-Polymer", voltage: 3.7, capacity: "1800mAh", quantity: 3, removable: true },
    powerSource: ["Battery (rechargeable)"],
    assemblyRequired: false,
    weeeClassification: "toys",

    // ── Category nulls ──
    ingredients: null, allergens: null, dietaryTags: null, storageInstructions: null, shelfLife: null,
    nutritionalInfo: null, organicCertification: null, kosherHalal: null, countryOfHarvest: null, abv: null, vintageYear: null,
    gmoDeclaration: null, storageTemperatureRange: null,
    fabricComposition: null, gsm: null, careInstructions: null, fitType: null, sizeChart: null, gender: "Unisex", pattern: null,
    inciList: null, spfRating: null, skinType: null, paoMonths: null, crueltyFree: null, dermatologicallyTested: null,
    toleranceSpecs: null, pressureRating: null, temperatureRange: null, threadType: null, materialGrade: null,
    sarValue: null, ipRating: null,

    hazmatInfo: { isHazardous: true, unNumber: "UN3481", class: "9 (Lithium batteries)" },
    warrantyInfo: { duration: "6 Months", type: "Seller", coverage: "Manufacturing defects" },
    regionalCompliance: [{ region: "California, US", note: "This product contains lithium batteries." }],
    fdaRegistration: null,
    euResponsiblePerson: { name: "FlyDragon Europe B.V.", address: "Keizersgracht 100, 1015 AA Amsterdam, Netherlands", email: "eu@flydragontech.com" },
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-02-01" },
    rohsCompliance: { compliant: true, certificateUrl: "https://example.com/rohs-fd.pdf" },

    countryRestrictions: null,
    restrictionScope: null,
    restrictedContinents: null,
    freeReturns: false,
    productInsurance: { included: true, provider: "Ping An", coverage: "Transit damage up to €20,000" },
    qualityInspection: { available: true, provider: "SGS", type: "Pre-shipment AQL", cost: "€0.15/unit" },
    authenticityGuarantee: null,
    dealReturnPolicy: null,
    warranty: "6 months",
    functionalRate: null,

    imagesRepresentative: false, mayContainDuplicates: false, isManifested: null, sourceRetailers: null, stockOrigin: null,
    predominantSizes: null, hasOriginalLabels: true, labelCondition: "Original retail packaging",

    weeksBestOffer: true, platformExclusive: false, promotionalBadge: "Holiday Bestseller",
    lowStockWarning: null, firstOrderDiscount: { percentage: 8, label: "-8% ON YOUR FIRST ORDER!" },

    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 1000, leadTime: "4-6 weeks", setupFee: { amount: 300, currency: "€" } },
    sellToPrivate: false, exportOnly: false, exportRegions: null, invoiceType: "VAT", sanitizedInvoice: "Available",
    importDutyCoverage: null,

    leadTimeTiers: [{ minQty: 50, maxQty: 500, days: 21 }, { minQty: 501, maxQty: 5000, days: 30 }, { minQty: 5001, maxQty: null, days: null, label: "To be negotiated" }],
    supplyAbility: { quantity: 20000, unit: "units", period: "month" },

    searchKeywords: ["drone wholesale", "4K camera drone", "RC drone bulk", "toy drone supplier", "FPV drone wholesale"],
    metaTitle: "4K Camera Drone with 3 Batteries — Wholesale Toys | WholesaleUp",
    metaDescription: "Buy 4K FPV drones wholesale from €28.50/unit. 215% markup. 3 batteries, GPS, CE/EN71 certified. MOQ 50 units.",
    modelCount: null,
    productHighlights: ["4K UHD camera with 120° wide-angle lens", "3 batteries for 75 minutes total flight time", "Sub-250g — no EU registration required", "GPS + optical flow dual positioning", "CE, EN71, and FCC certified for EU/US sale"],
    showroomAvailable: null,
    packagingFormat: "Individual retail boxes, master cartons of 10 units",
    offerValidityDays: null,
    packageContents: "1× Drone, 3× Li-Po batteries, 1× Remote controller, 4× Spare propellers, 1× USB-C cable, 1× Carrying case, 1× Manual (6 lang)",
    compatibleWith: null,
    targetAudience: ["Toy retailers", "Gadget shops", "Amazon/Ebay resellers", "Gift shops", "Holiday seasonal buyers"],
    hazardSymbols: null,
    omnibusPrice: null, discountPercentage: null, originalPrice: null,
    sourceRetailers: null, gradeNotes: null, gradeCategory: null, exportRegions: null,
    modelCount: null, stockOrigin: null, isManifested: null, lotRetailValue: null, functionalRate: null, multipackQuantity: null,
  },

  "gifts-seasonal": {
    _label: "Gifts & Seasonal",
    id: 106,
    title: "Luxury Scented Candle Gift Set – 4 Seasonal Fragrances, Soy Wax, 200ml Each",
    slug: "luxury-scented-candle-gift-set-4-seasonal-fragrances",
    category: "Gifts & Seasonal",
    categoryBreadcrumb: ["Gifts & Seasonal", "Candles & Home Fragrance"],
    images: [
      "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603905179609-01afdab0e2bf?w=800&h=800&fit=crop",
    ],
    description: `Beautifully boxed gift set containing four hand-poured soy wax candles in premium glass jars. Each candle represents a season: Spring Garden (jasmine & green tea), Summer Breeze (coconut & lime), Autumn Spice (cinnamon & orange), and Winter Lodge (pine & cedar).

40-hour burn time per candle. Cotton wicks, phthalate-free fragrance oils, vegan-friendly. Presented in a premium kraft gift box with ribbon. Perfect for Christmas, birthdays, housewarming gifts, and wedding favours.

Strong Q4 seasonal demand — order early for Christmas stock.`,
    tags: ["#candles", "#gift-set", "#soy-wax", "#seasonal", "#christmas", "#wholesale", "#vegan", "#home-fragrance"],

    price: 8.50,
    currency: "€",
    priceUnit: "/ Set ex. VAT",
    rrp: 34.99,
    rrpCurrency: "€",
    markup: 311.6,
    dateAdded: "15/01/2026",
    grade: "New",
    country: "GB",
    countryName: "United Kingdom",
    moq: 50,
    sku: "GS-CAN-4S-SOY",
    taric: "3406000000",
    ean: "5060123456789",
    brands: [{ name: "Lumière & Co", country: "GB" }],
    shippingTime: 5,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 34.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 26.49, profitLabel: "/1 Unit inc.VAT", markup: 311.65, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 29.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 21.49, profitLabel: "/1 Unit inc.VAT", markup: 252.82, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Birmingham, United Kingdom",
    dealLocationCode: "gb",
    isDropship: true,
    negotiable: false,
    isExpired: false,
    availableQuantity: 3000,
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["National delivery", "International delivery"],
    shippingCountries: "United Kingdom, Ireland, Germany, France, Netherlands, Belgium, Spain, Italy",
    attachments: [
      { name: "Product Lookbook.pdf", size: "4.2 MB", type: "pdf" },
      { name: "Safety Data Sheet.pdf", size: "520 KB", type: "pdf" },
    ],
    supplier: {
      companyName: "Lumière & Co Candle Works Ltd.",
      isVerified: true,
      rating: 4.9,
      reviewCount: 234,
      yearsActive: 6,
      categories: ["Candles & Home Fragrance", "Gift Sets & Hampers", "Wedding & Occasions"],
      moreCategories: 1,
      address: { country: "United Kingdom", countryCode: "gb", city: "Birmingham", postalCode: "B1 2HB", street: "Jewellery Quarter, Spencer St 12" },
      companyWebsite: "lumiere-co.co.uk",
      contact: { name: "Sophie Clarke", roleInCompany: "Wholesale Manager", phone: "+44 121 555 7890" },
      businessHours: { Sun: "Closed", Mon: "09:00 – 17:00", Tue: "09:00 – 17:00", Wed: "09:00 – 17:00", Thu: "09:00 – 17:00", Fri: "09:00 – 15:00", Sat: "Closed" },
      currentTime: "11:00",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2020,
      onTimeDeliveryRate: 98.5,
      responseTime: "≤2h",
      revenueTier: "growing",
      companySize: 18,
      facilitySize: 500,
      facilitySizeUnit: "m²",
      thirdPartyVerification: null,
      customizationAbility: ["Sample-based customization", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "British premium candle maker creating hand-poured soy wax gift sets with essential oil fragrances. Founded in 2020 in Birmingham's historic Jewellery Quarter, we specialize in sustainable, eco-friendly home fragrance products for retailers and gifting businesses.",
      productsOffered: "Premium hand-poured soy candles, gift sets, wedding favors, home fragrance collections, and customizable branded candle collections for corporate gifting.",
      productCategories: ["candles", "home-fragrance", "gift-sets"],
      brandsDistributed: ["Lumière & Co"],
      productQualityTier: ["premium"],
      certifications: ["iso-9001", "vegan"],
      sampleAvailability: "paid",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 425,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
      paymentTerms: "Net 14 for established accounts; prepayment for new orders",
      defaultDepositPercentage: 25,
      defaultDepositTerms: "25% deposit with order, 75% before delivery",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "14-day return on unopened gift sets. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "1000", discount: "5" },
        { currency: "€", minOrder: "5000", discount: "10" },
      ],
      discountNotes: "Volume discounts for gift retailers and event planners. Custom pricing for white-label partnerships.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "royal-mail", "own-fleet"],
      leadTime: "3-5-days",
      defaultIncoterms: "DDP",
      countriesServed: ["GB", "IE", "DE", "FR", "NL", "BE", "ES", "IT"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "brand-owner"],
      buyerTypesServed: ["gift-retailer", "online-retailer", "event-planner", "corporate-gifting"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "white-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/lumierecocandles",
      socialInstagram: "https://instagram.com/lumierecocandles",
      socialLinkedin: "https://linkedin.com/company/lumiere-co-candles",
      preferredCurrency: "GBP",
    },
    certifications: ["iso-9001"],
    returnPolicy: "14-day return on unopened gift sets. Buyer pays return shipping.",
    leadTime: "3-5-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 425,
    minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
    discountTiers: [
      { currency: "€", minOrder: "1000", discount: "5" },
      { currency: "€", minOrder: "5000", discount: "10" },
    ],
    supplyModels: ["wholesale", "dropshipping", "white-label"],
    productQualityTier: ["premium"],
    specifications: {
      "Wax Type": "100% Natural Soy Wax",
      "Wick": "Cotton, lead-free",
      "Fragrance": "Phthalate-free essential oil blends",
      "Burn Time": "~40 hours per candle (160 hours total)",
      "Jar": "200ml reusable glass with bamboo lid",
      "Box": "Premium kraft with satin ribbon",
    },
    variants: [
      { name: "Gift Box Style", options: ["Kraft with Ribbon", "White Luxury Box", "Seasonal Sleeve"], selected: "Kraft with Ribbon" },
    ],
    videoUrl: null,
    packaging: { length: 25, width: 25, height: 10, unit: "cm", weight: 1.8, weightUnit: "kg" },
    materials: "Soy wax, cotton wicks, glass jars, bamboo lids, kraft card",
    productLanguage: ["English"],
    manufacturingCountry: "United Kingdom",
    manufacturingCountryCode: "gb",
    customizationOptions: [
      { name: "Custom label design", extraCost: 0.80, currency: "€", minQty: 100 },
      { name: "Custom fragrance blend", extraCost: 2.00, currency: "€", minQty: 200 },
    ],
    productReputation: {
      overallScore: 4.9,
      sourcesCount: 234,
      lastUpdated: "Feb 2026",
      summary: "Premium hand-poured candle gift sets are standout performers in the gifting market. High repeat purchase rates from both gift shop and wedding/event planners. Soy wax sustainability and beautiful presentation drive premium positioning.",
      dimensions: [
        { label: "Product Quality", score: 4.9 },
        { label: "Value for Money", score: 4.8 },
        { label: "Accuracy of Description", score: 4.9 },
        { label: "Packaging Quality", score: 4.9 },
        { label: "Resale Performance", score: 4.8 },
      ],
      highlights: [
        "Strong seasonal demand with rapid sell-through at Christmas",
        "Exceptional appeal for wedding favors and special events",
        "Biodegradable soy wax aligns with eco-conscious consumer trends",
        "Long fragrance throw noted by multiple retailers",
        "Premium presentation justifies retail markup",
      ],
      cautions: [
        "Seasonal demand concentration in Q4",
        "Requires careful handling to avoid fragrance damage in transit",
      ],
    },
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [0, 2],
    unitsSold: 18000,
    reorderRate: 68,
    categoryRanking: { rank: 1, category: "Candle Gift Sets" },
    samplePrice: { amount: 15.00, currency: "€" },
    shelfLife: "3 Years",
    shipsFrom: "Birmingham, United Kingdom",
    shipsFromCode: "gb",
    freeReturns: false,
    orderIncrement: 5,
    ecoFriendly: {
      materials: ["Natural soy wax", "Reusable glass jars", "Bamboo lids"],
      packaging: ["Recyclable kraft box", "No plastic wrapping"],
      production: "Hand-poured in small batches, zero waste",
    },
    estimatedDeliveryRange: { minDate: "Mar 14", maxDate: "Mar 18" },
    freeShippingThreshold: { amount: 300, currency: "€" },
    testerOption: { available: true, price: 15.00, currency: "€", nonReturnable: true },
    casePackSize: 6,
    ingredients: "Soy wax, fragrance oils (phthalate-free), cotton wick",
    allergens: null,
    dietaryTags: ["Vegan"],
    storageInstructions: "Store in a cool, dry place away from direct sunlight. Keep lid on when not in use.",
    customizationAbility: { verified: true, levels: ["Minor customization", "Sample-based customization", "Full customization"] },
    importDutyCoverage: { covered: true, regions: ["UK", "EU"] },
    brandTier: "Premium",
    promotionalBadge: "Christmas Bestseller",
    comparisonPrice: { label: "Lower priced than similar", percentage: 25 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },
    lowStockWarning: { threshold: 200, remaining: 180 },
    productGrade: "Premium",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: null,
    ageRestriction: null,
    dimensionsPerUnit: { length: 8, width: 8, height: 9, unit: "cm" },
    netWeight: { value: 1.6, unit: "kg" },
    mpn: "LC-4S-SEASONAL-200",
    batchNumber: "BATCH-2026-Q1-045",
    serialNumberRequired: false,
    mapPrice: { amount: 29.99, currency: "€" },
    priceValidUntil: "2026-12-31",
    netPaymentTerms: "Net 14",
    depositRequired: null,
    taxClass: "standard",
    palletConfiguration: { unitsPerLayer: 36, layersPerPallet: 6, unitsPerPallet: 216 },
    containerLoadQuantity: { twentyFt: 2500, fortyFt: 5000, fortyHC: 6000 },
    shippingClass: "Standard",
    incoterms: "DDP",
    readyToShip: true,
    stackable: true,
    portOfOrigin: null,
    dealStatus: "active",
    launchDate: "2024-09-01",
    discontinuedDate: null,
    seasonality: "Holiday",
    bestBeforeDate: null,
    regionalCompliance: [{ region: "California, US", note: "This product contains fragrance oils." }],
    cpscCompliance: null,
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    gender: "Unisex",
    sizeChart: null,
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: 36,
    crueltyFree: { certified: true, body: "Leaping Bunny" },
    dermatologicallyTested: null,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,
    viewCount: 45000,
    inquiryCount: 890,
    searchKeywords: ["candle gift set wholesale", "soy candle bulk", "Christmas gift wholesale", "scented candle trade"],
    metaTitle: "Luxury Scented Candle Gift Set — Wholesale | WholesaleUp",
    metaDescription: "Buy luxury soy candle gift sets wholesale from €8.50/set. 311% markup. 4 seasonal fragrances, premium packaging. MOQ 50.",
    maxOrderQuantity: 10000,
    exclusivityAvailable: true,
    whiteLabeling: { available: true, moq: 200, leadTime: "3-4 weeks", setupFee: { amount: 100, currency: "€" } },
    productInsurance: { included: true, provider: "Aviva", coverage: "Transit damage up to €5,000" },
    qualityInspection: { available: true, provider: "In-house QC", type: "Every batch", cost: "Included" },
    firstOrderDiscount: { percentage: 10, label: "-10% ON YOUR FIRST ORDER!" },
    packageContents: "4× Scented candles (Spring, Summer, Autumn, Winter), 1× Gift box with ribbon, 4× Bamboo lids",
    compatibleWith: null,
    sellToPrivate: true,
    targetAudience: ["Gift shops", "Florists", "Boutiques", "Online gift retailers", "Wedding planners"],
    hazardSymbols: null,
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "100% hand-poured in Birmingham, UK",
    imagesRepresentative: false,
    supplierIsCertified: true,
    supplierResponseBadge: "very quickly",
    dealReturnPolicy: null,
    // ── EXERCISES wine-removed vars: omnibusPrice, discountPercentage, originalPrice ──
    omnibusPrice: { amount: 9.50, currency: "€" },
    discountPercentage: 11,
    originalPrice: { amount: 9.50, currency: "€" },
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: { available: true, location: "Birmingham, UK", byAppointment: true },
    weeksBestOffer: true,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 120,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: false,
    platformExclusive: false,
    modelCount: null,
    labelCondition: "Original brand labels and gift packaging intact",
    mayContainDuplicates: false,
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    invoiceType: "VAT",
    sanitizedInvoice: "On Request",
    packagingFormat: "Gift boxes, master cartons of 6 sets",
    productDimensions: { length: 25, width: 25, height: 10, unit: "cm", notes: "gift box dimensions" },
    predominantSizes: null,
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 8.50 }, { minQty: 201, maxQty: 500, price: 7.80 }, { minQty: 501, maxQty: null, price: 7.00 }],
    warranty: null,
    functionalRate: null,
    supplyAbility: { quantity: 5000, unit: "sets", period: "month" },
    sampleLeadTime: { min: 2, max: 3, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "Lumière & Co Candle Works Ltd.", address: "12 Spencer St, Jewellery Quarter, Birmingham B1 2HB, United Kingdom", email: "eu@lumiere-co.co.uk" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 50, maxQty: 200, days: 5 },
      { minQty: 201, maxQty: 1000, days: 10 },
      { minQty: 1001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer",
    grossWeight: { value: 2.0, unit: "kg" },
    multipackQuantity: 4,
    itemGroupId: "WUP-GRP-LC-4S",
    pattern: null,
    productHighlights: [
      "Four seasonal fragrances in premium glass jars",
      "100% natural soy wax, phthalate-free oils",
      "40-hour burn time per candle, 160 hours total",
      "Gift-ready kraft box with satin ribbon",
    ],
    gln: "5060123456789",
    gpcCode: "10008080",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "GB",
    gmoDeclaration: null,
    weeeClassification: null,
    reachSvhcDeclaration: null,
    rohsCompliance: null,
    carbonFootprint: { value: 4.2, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: { min: 5, max: 30, unit: "°C" },
    costOfGoodsSold: { value: 4.80, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "set" },
  },

  "sports-outdoors": {
    _label: "Sports & Outdoors",
    id: 107,
    title: "Resistance Bands Set – 5 Levels, Latex-Free TPE, Carry Bag Included",
    slug: "resistance-bands-set-5-levels-latex-free-tpe",
    category: "Sports & Outdoors",
    categoryBreadcrumb: ["Sports & Outdoors", "Gym & Fitness Equipment"],
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
    ],
    description: `Professional-grade resistance bands in a set of 5 progressive levels (Extra Light to Extra Heavy). Made from latex-free TPE for allergy-safe training. Each band is colour-coded and labelled with resistance level.

Includes mesh carry bag with carabiner clip and printed exercise guide. Ideal for home fitness, physiotherapy, Pilates, and gym accessory retail.

Strong year-round demand with peaks in January and September. Compact packaging makes these ideal for online resale.`,
    tags: ["#resistance-bands", "#fitness", "#gym", "#latex-free", "#wholesale", "#home-workout", "#physio"],

    price: 2.20,
    currency: "€",
    priceUnit: "/ Set ex. VAT",
    rrp: 14.99,
    rrpCurrency: "€",
    markup: 581.4,
    dateAdded: "20/01/2026",
    grade: "New",
    country: "CN",
    countryName: "China",
    moq: 300,
    sku: "SO-RB5-TPE-SET",
    taric: "9506919000",
    ean: "6902345678901",
    brands: [{ name: "FlexFit Pro", country: "DE" }],
    shippingTime: 18,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 14.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 12.79, profitLabel: "/1 Unit inc.VAT", markup: 581.36, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 11.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 9.79, profitLabel: "/1 Unit inc.VAT", markup: 445.0, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Shenzhen, China",
    dealLocationCode: "cn",
    isDropship: true,
    negotiable: true,
    isExpired: false,
    availableQuantity: 50000,
    paymentOptions: ["Bank transfer", "PayPal"],
    deliveryOptions: ["International delivery"],
    shippingCountries: "Germany, United Kingdom, France, Netherlands, Spain, Italy, Poland, Belgium, Austria",
    attachments: [
      { name: "Product Specification.pdf", size: "1.8 MB", type: "pdf" },
      { name: "SGS Test Report.pdf", size: "2.5 MB", type: "pdf" },
    ],
    supplier: {
      companyName: "Shenzhen FlexFit Sports Co., Ltd.",
      isVerified: true,
      rating: 4.4,
      reviewCount: 312,
      yearsActive: 9,
      categories: ["Gym & Fitness Equipment", "Yoga Accessories", "Sports Accessories"],
      moreCategories: 2,
      address: { country: "China", countryCode: "cn", city: "Shenzhen", postalCode: "518000", street: "Bao'an District, Industrial Park C-8" },
      companyWebsite: "flexfit-sports.com",
      contact: { name: "Jack Li", roleInCompany: "Sales Manager", phone: "+86 755 2888 5678" },
      businessHours: { Sun: "Closed", Mon: "08:30 – 18:00", Tue: "08:30 – 18:00", Wed: "08:30 – 18:00", Thu: "08:30 – 18:00", Fri: "08:30 – 17:00", Sat: "09:00 – 13:00" },
      currentTime: "14:00",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2017,
      onTimeDeliveryRate: 93.5,
      responseTime: "≤6h",
      revenueTier: "established",
      companySize: 95,
      facilitySize: 6000,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "SGS Group",
      customizationAbility: ["Drawing-based customization", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Chinese sports equipment manufacturer specializing in gym and fitness accessories, yoga products, and resistance training equipment. Founded in 2017, we deliver high-volume, cost-effective fitness solutions for retailers and online marketplaces worldwide.",
      productsOffered: "Resistance bands, yoga accessories, gym equipment, fitness training tools, sports accessories, and custom fitness solutions for home and commercial use.",
      productCategories: ["fitness-equipment", "sports-accessories", "yoga-products"],
      brandsDistributed: ["FlexFit Pro", "OEM"],
      productQualityTier: ["budget", "mid-range"],
      certifications: ["ce", "rohs", "reach", "iso-14001"],
      sampleAvailability: "paid",
      catalogueSize: "200-1000",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 660,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal"],
      paymentTerms: "LC at sight or 50/50 T/T; Net 30 for qualified buyers",
      defaultDepositPercentage: 40,
      defaultDepositTerms: "40% deposit with PO, 60% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "15-day return on defective items only. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "3000", discount: "8" },
        { currency: "€", minOrder: "10000", discount: "15" },
      ],
      discountNotes: "Volume-based discounts for fitness retailers. ODM and white-label options available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "sea-freight"],
      leadTime: "15-18-days",
      defaultIncoterms: "FOB",
      countriesServed: ["DE", "GB", "FR", "ES", "IT", "NL", "BE", "SE", "AT", "AU"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "wholesaler"],
      buyerTypesServed: ["online-retailer", "sports-retailer", "fitness-centre", "distributor"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/flexfitsports",
      socialInstagram: "https://instagram.com/flexfitsports",
      socialLinkedin: "https://linkedin.com/company/flexfit-sports",
      preferredCurrency: "USD",
    },
    certifications: ["ce", "rohs", "reach"],
    returnPolicy: "15-day return on defective items only. Buyer pays return shipping.",
    leadTime: "15-18-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 660,
    minimumOrderCurrency: "€",
    catalogueSize: "200-1000",
    supplierPaymentMethods: ["bank-transfer", "paypal"],
    discountTiers: [
      { currency: "€", minOrder: "3000", discount: "8" },
      { currency: "€", minOrder: "10000", discount: "15" },
    ],
    supplyModels: ["wholesale", "dropshipping", "private-label"],
    productQualityTier: ["budget", "mid-range"],
    specifications: {
      "Material": "TPE (Thermoplastic Elastomer), latex-free",
      "Levels": "5 (Extra Light / Light / Medium / Heavy / Extra Heavy)",
      "Length": "60cm each (unstretched)",
      "Width": "5cm each",
      "Stretch": "Up to 3x original length",
    },
    variants: [
      { name: "Set Type", options: ["5-Band Set", "3-Band Set (Light)", "3-Band Set (Heavy)"], selected: "5-Band Set" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    packaging: { length: 22, width: 12, height: 5, unit: "cm", weight: 0.35, weightUnit: "kg" },
    materials: "TPE thermoplastic elastomer, nylon mesh bag, stainless steel carabiner",
    productLanguage: ["English", "German"],
    manufacturingCountry: "China",
    manufacturingCountryCode: "cn",
    customizationOptions: [
      { name: "Custom logo on bands", extraCost: 0.15, currency: "€", minQty: 2000 },
      { name: "Custom carry bag design", extraCost: 0.25, currency: "€", minQty: 1000 },
    ],
    productReputation: {
      overallScore: 4.4,
      sourcesCount: 312,
      lastUpdated: "Feb 2026",
      summary: "Budget-friendly resistance band sets deliver excellent margins with solid quality. Latex-free TPE material and mesh carry bag are key value drivers. Some color variation between shipments but minimal impact on sales.",
      dimensions: [
        { label: "Product Quality", score: 4.5 },
        { label: "Value for Money", score: 4.7 },
        { label: "Accuracy of Description", score: 4.3 },
        { label: "Packaging Quality", score: 4.1 },
        { label: "Resale Performance", score: 4.4 },
      ],
      highlights: [
        "Exceptional margin potential among fitness retailers",
        "Latex-free TPE appeals to allergy-conscious consumers",
        "Complete set with carry bag increases retail appeal",
        "ISO 14001 sustainable manufacturing certified",
      ],
      cautions: [
        "Occasional color inconsistency between batches",
        "Durability concerns if used for heavy-duty training",
      ],
    },
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [1, 3],
    unitsSold: 85000,
    reorderRate: 48,
    categoryRanking: { rank: 3, category: "Resistance Bands — Budget" },
    samplePrice: { amount: 5.00, currency: "€" },
    shelfLife: null,
    shipsFrom: "Shenzhen, China",
    shipsFromCode: "cn",
    freeReturns: false,
    orderIncrement: 10,
    ecoFriendly: {
      materials: ["Latex-free TPE (recyclable)"],
      packaging: ["Recyclable mesh bag"],
      production: "ISO 14001 certified factory",
    },
    estimatedDeliveryRange: { minDate: "Mar 27", maxDate: "Apr 5" },
    freeShippingThreshold: { amount: 1500, currency: "€" },
    testerOption: { available: true, price: 5.00, currency: "€", nonReturnable: true },
    casePackSize: 20,
    ingredients: null,
    allergens: null,
    dietaryTags: null,
    storageInstructions: "Store flat or rolled. Avoid prolonged UV exposure.",
    customizationAbility: { verified: true, levels: ["Minor customization", "Drawing-based customization", "Full customization"] },
    importDutyCoverage: { covered: false, regions: [] },
    brandTier: "Verified",
    promotionalBadge: "New Year Fitness Sale",
    comparisonPrice: { label: "Lower priced than similar", percentage: 30 },
    paymentFinancing: null,
    lowStockWarning: null,
    productGrade: "Standard",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: { duration: "1 Year", type: "Manufacturer", coverage: "Material defects and breakage under normal use" },
    ageRestriction: null,
    dimensionsPerUnit: { length: 60, width: 5, height: 0.1, unit: "cm" },
    netWeight: { value: 0.30, unit: "kg" },
    mpn: "FF-RB5-TPE-2026",
    batchNumber: null,
    serialNumberRequired: false,
    mapPrice: null,
    priceValidUntil: "2026-06-30",
    netPaymentTerms: "Net 30",
    depositRequired: { percentage: 30, terms: "30% T/T upfront, 70% against B/L copy" },
    taxClass: "standard",
    palletConfiguration: { unitsPerLayer: 200, layersPerPallet: 10, unitsPerPallet: 2000 },
    containerLoadQuantity: { twentyFt: 25000, fortyFt: 50000, fortyHC: 60000 },
    shippingClass: "Standard",
    incoterms: "FOB",
    readyToShip: true,
    stackable: true,
    portOfOrigin: "Shenzhen, China",
    dealStatus: "active",
    launchDate: "2025-01-10",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    gender: "Unisex",
    sizeChart: null,
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,
    viewCount: 95000,
    inquiryCount: 2100,
    searchKeywords: ["resistance bands wholesale", "fitness bands bulk", "exercise bands trade", "TPE bands wholesale"],
    metaTitle: "Resistance Bands Set 5-Level — Wholesale | WholesaleUp",
    metaDescription: "Buy resistance band sets wholesale from €2.20/set. 581% markup. Latex-free TPE, 5 levels, carry bag. MOQ 300.",
    maxOrderQuantity: 100000,
    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 3000, leadTime: "3-4 weeks", setupFee: { amount: 150, currency: "€" } },
    productInsurance: { included: true, provider: "PICC", coverage: "Transit damage up to €15,000" },
    qualityInspection: { available: true, provider: "SGS", type: "Pre-shipment AQL 2.5", cost: "€0.03/set" },
    firstOrderDiscount: { percentage: 5, label: "-5% ON YOUR FIRST ORDER!" },
    packageContents: "5× Resistance bands (colour-coded), 1× Mesh carry bag with carabiner, 1× Exercise guide card",
    compatibleWith: null,
    sellToPrivate: false,
    targetAudience: ["Fitness retailers", "Amazon FBA sellers", "Physiotherapy clinics", "Gym owners"],
    hazardSymbols: null,
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "SGS tested, meets EN 71 safety standards",
    imagesRepresentative: false,
    supplierIsCertified: false,
    supplierResponseBadge: "quickly",
    dealReturnPolicy: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: null,
    weeksBestOffer: false,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 60,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: false,
    platformExclusive: false,
    modelCount: null,
    labelCondition: "Original retail packaging with barcode",
    mayContainDuplicates: false,
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    invoiceType: "VAT",
    sanitizedInvoice: "Available",
    packagingFormat: "Individual mesh bags, master cartons of 20 sets",
    productDimensions: null,
    predominantSizes: null,
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 300, maxQty: 1000, price: 2.20 }, { minQty: 1001, maxQty: 5000, price: 1.90 }, { minQty: 5001, maxQty: null, price: 1.60 }],
    warranty: "1 year",
    functionalRate: null,
    supplyAbility: { quantity: 200000, unit: "sets", period: "month" },
    sampleLeadTime: { min: 3, max: 5, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "FlexFit Europe GmbH", address: "Sportstr. 8, 80331 München, Germany", email: "eu@flexfit-sports.com" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 300, maxQty: 1000, days: 15 },
      { minQty: 1001, maxQty: 10000, days: 20 },
      { minQty: 10001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer",
    grossWeight: { value: 0.38, unit: "kg" },
    multipackQuantity: 5,
    itemGroupId: "WUP-GRP-FF-RB5",
    pattern: null,
    productHighlights: [
      "Latex-free TPE — safe for allergy-prone users",
      "5 progressive resistance levels, colour-coded",
      "Compact mesh carry bag with carabiner included",
      "581% markup potential at recommended retail",
    ],
    gln: "6902345678901",
    gpcCode: "10002345",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "CN",
    gmoDeclaration: null,
    weeeClassification: null,
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-08-01" },
    rohsCompliance: null,
    carbonFootprint: { value: 1.8, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: null,
    costOfGoodsSold: { value: 0.95, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "set" },
  },

  "jewellery-watches": {
    _label: "Jewellery & Watches",
    id: 108,
    title: "Sterling Silver Cubic Zirconia Stud Earrings – 6mm, Rhodium Plated",
    slug: "sterling-silver-cz-stud-earrings-6mm-rhodium",
    category: "Jewellery & Watches",
    categoryBreadcrumb: ["Jewellery & Watches", "Earrings"],
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    ],
    description: `925 sterling silver stud earrings featuring AAA-grade cubic zirconia stones (6mm round brilliant cut). Rhodium-plated for tarnish resistance and a white gold appearance. Butterfly backs for secure wear.

Each pair comes in a branded velvet pouch suitable for retail display. Hallmarked 925. Nickel-free and hypoallergenic — safe for sensitive ears.

Strong year-round seller with peaks around Valentine's Day, Mother's Day, and Christmas. Ideal for jewellery shops, market stalls, and online accessories stores.`,
    tags: ["#sterling-silver", "#earrings", "#cz", "#925", "#rhodium", "#wholesale", "#jewellery", "#hypoallergenic"],

    price: 3.80,
    currency: "€",
    priceUnit: "/ Pair ex. VAT",
    rrp: 24.99,
    rrpCurrency: "€",
    markup: 557.6,
    dateAdded: "01/02/2026",
    grade: "New",
    country: "TH",
    countryName: "Thailand",
    moq: 50,
    sku: "JW-SS-CZ6-RH",
    taric: "7113110000",
    ean: "8858012345678",
    brands: [{ name: "Sienna Silver", country: "GB" }],
    shippingTime: 7,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 24.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 21.19, profitLabel: "/1 Unit inc.VAT", markup: 557.63, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 19.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 16.19, profitLabel: "/1 Unit inc.VAT", markup: 426.05, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Bangkok, Thailand",
    dealLocationCode: "th",
    isDropship: false,
    negotiable: true,
    isExpired: false,
    availableQuantity: 10000,
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["International delivery"],
    shippingCountries: "United Kingdom, Germany, France, Netherlands, Ireland, Belgium, Spain, Italy, Austria, Sweden",
    attachments: [
      { name: "Hallmark Certificate.pdf", size: "380 KB", type: "pdf" },
      { name: "Nickel-Free Test Report.pdf", size: "520 KB", type: "pdf" },
      { name: "Wholesale Catalogue 2026.pdf", size: "6.5 MB", type: "pdf" },
    ],
    supplier: {
      companyName: "Sienna Silver (Thailand) Co., Ltd.",
      isVerified: true,
      rating: 4.8,
      reviewCount: 445,
      yearsActive: 15,
      categories: ["Earrings", "Necklaces & Pendants", "Rings", "Bracelets & Bangles"],
      moreCategories: 2,
      address: { country: "Thailand", countryCode: "th", city: "Bangkok", postalCode: "10500", street: "Silom Road, Jewellery Trade Centre 312" },
      companyWebsite: "siennasilver.com",
      contact: { name: "Nattaya Sripong", roleInCompany: "International Sales Director", phone: "+66 2 234 5678" },
      businessHours: { Sun: "Closed", Mon: "09:00 – 18:00", Tue: "09:00 – 18:00", Wed: "09:00 – 18:00", Thu: "09:00 – 18:00", Fri: "09:00 – 17:00", Sat: "09:00 – 13:00" },
      currentTime: "16:00",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2011,
      onTimeDeliveryRate: 97.8,
      responseTime: "≤3h",
      revenueTier: "established",
      companySize: 45,
      facilitySize: 1200,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "Bureau Veritas",
      customizationAbility: ["Drawing-based customization", "Sample-based customization", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Thai sterling silver jewelry manufacturer located in Bangkok's historic Silom jewelry district. Founded in 2011, we specialize in cubic zirconia and gemstone jewelry with hallmark certification, serving retailers and jewelry wholesalers across Europe and beyond.",
      productsOffered: "Sterling silver earrings, necklaces, rings, bracelets, and custom jewelry pieces with cubic zirconia and gemstones. Hallmark certified and nickel-free products.",
      productCategories: ["jewelry", "sterling-silver", "accessories"],
      brandsDistributed: ["Sienna Silver", "Custom OEM"],
      productQualityTier: ["mid-range", "premium"],
      certifications: ["iso-9001", "hallmark", "nickel-free"],
      sampleAvailability: "paid",
      catalogueSize: "1000+",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 190,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
      paymentTerms: "Net 30 for established accounts; 50/50 T/T for new orders",
      defaultDepositPercentage: 50,
      defaultDepositTerms: "50% deposit with PO, 50% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "7-day return on defective items. Seller pays return shipping for quality issues.",
      discountTiers: [
        { currency: "€", minOrder: "500", discount: "5" },
        { currency: "€", minOrder: "2000", discount: "12" },
        { currency: "€", minOrder: "5000", discount: "18" },
      ],
      discountNotes: "Volume discounts for jewelry retailers. Custom design and white-label services available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "sea-freight"],
      leadTime: "5-7-days",
      defaultIncoterms: "DDP",
      countriesServed: ["GB", "DE", "FR", "NL", "IE", "BE", "ES", "IT", "AT", "SE"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "brand-owner"],
      buyerTypesServed: ["jewellery-retailer", "online-retailer", "marketplace-seller"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "white-label", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/siennasilver",
      socialInstagram: "https://instagram.com/siennasilver",
      socialLinkedin: "https://linkedin.com/company/sienna-silver-thailand",
      preferredCurrency: "EUR",
    },
    certifications: ["iso-9001"],
    returnPolicy: "7-day return on defective items. Seller pays return shipping for quality issues.",
    leadTime: "5-7-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 190,
    minimumOrderCurrency: "€",
    catalogueSize: "1000+",
    supplierPaymentMethods: ["bank-transfer", "paypal", "credit-debit-card"],
    discountTiers: [
      { currency: "€", minOrder: "500", discount: "5" },
      { currency: "€", minOrder: "2000", discount: "12" },
      { currency: "€", minOrder: "5000", discount: "18" },
    ],
    supplyModels: ["wholesale", "white-label"],
    productQualityTier: ["mid-range", "premium"],
    specifications: {
      "Metal": "925 Sterling Silver",
      "Plating": "Rhodium (white gold appearance)",
      "Stone": "AAA Cubic Zirconia, 6mm round brilliant",
      "Back": "Butterfly push-back",
      "Hallmark": "925 stamped",
      "Weight": "1.2g per pair",
    },
    variants: [
      { name: "Stone Size", options: ["4mm", "5mm", "6mm", "7mm", "8mm"], selected: "6mm" },
      { name: "Stone Shape", options: ["Round", "Princess", "Heart"], selected: "Round" },
    ],
    videoUrl: null,
    packaging: { length: 8, width: 6, height: 3, unit: "cm", weight: 0.025, weightUnit: "kg" },
    materials: "925 sterling silver, AAA cubic zirconia, rhodium plating",
    productLanguage: ["English"],
    manufacturingCountry: "Thailand",
    manufacturingCountryCode: "th",
    customizationOptions: [
      { name: "Custom engraving on back", extraCost: 1.50, currency: "€", minQty: 100 },
      { name: "Custom branded pouch", extraCost: 0.60, currency: "€", minQty: 200 },
    ],
    productReputation: {
      overallScore: 4.8,
      sourcesCount: 445,
      lastUpdated: "Feb 2026",
      summary: "Premium sterling silver earrings consistently outperform expectations among jewelry retailers. Flawless rhodium plating and cubic zirconia stones attract upmarket customers. Responsible sourcing credentials add value to premium positioning.",
      dimensions: [
        { label: "Product Quality", score: 4.9 },
        { label: "Value for Money", score: 4.7 },
        { label: "Accuracy of Description", score: 4.8 },
        { label: "Packaging Quality", score: 4.8 },
        { label: "Resale Performance", score: 4.8 },
      ],
      highlights: [
        "Flagship product with sustained two-year bestseller status",
        "Flawless rhodium plating exceeds customer expectations",
        "Responsible Jewellery Council certification supports premium positioning",
        "Velvet pouch packaging drives perceived luxury",
        "Strong appeal to bridal and gift market segments",
      ],
      cautions: [
        "Premium pricing may limit volume in budget jewelry channels",
        "Plating durability dependent on customer care practices",
      ],
    },
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [0, 1, 3],
    unitsSold: 120000,
    reorderRate: 72,
    categoryRanking: { rank: 1, category: "Sterling Silver Earrings" },
    samplePrice: { amount: 8.00, currency: "€" },
    shelfLife: null,
    shipsFrom: "Bangkok, Thailand",
    shipsFromCode: "th",
    freeReturns: true,
    orderIncrement: 5,
    ecoFriendly: {
      materials: ["Recycled silver content"],
      packaging: ["Velvet pouch (reusable)", "Recyclable card box"],
      production: "Responsible Jewellery Council member",
    },
    estimatedDeliveryRange: { minDate: "Mar 16", maxDate: "Mar 22" },
    freeShippingThreshold: { amount: 200, currency: "€" },
    testerOption: null,
    casePackSize: 12,
    ingredients: null,
    allergens: null,
    dietaryTags: null,
    storageInstructions: "Store in sealed pouch. Avoid contact with perfume and chemicals.",
    customizationAbility: { verified: true, levels: ["Minor customization", "Drawing-based customization", "Full customization"] },
    importDutyCoverage: { covered: false, regions: [] },
    brandTier: "Premium",
    promotionalBadge: "Valentine's Day Bestseller",
    comparisonPrice: { label: "Lower priced than similar", percentage: 35 },
    paymentFinancing: { provider: "PayPal Credit", terms: "Pay in 3 instalments, interest-free" },
    lowStockWarning: null,
    productGrade: "Premium",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: { duration: "2 Years", type: "Manufacturer", coverage: "Plating defects and stone setting" },
    ageRestriction: null,
    dimensionsPerUnit: { length: 6, width: 6, height: 8, unit: "mm" },
    netWeight: { value: 0.0012, unit: "kg" },
    mpn: "SS-CZ6-RH-925",
    batchNumber: null,
    serialNumberRequired: false,
    mapPrice: null,
    priceValidUntil: "2026-12-31",
    netPaymentTerms: "Due on receipt",
    depositRequired: null,
    taxClass: "standard",
    palletConfiguration: null,
    containerLoadQuantity: { twentyFt: 500000, fortyFt: 1000000, fortyHC: 1200000 },
    shippingClass: "Standard",
    incoterms: "DDP",
    readyToShip: true,
    stackable: true,
    portOfOrigin: "Laem Chabang, Thailand",
    dealStatus: "active",
    launchDate: "2023-02-14",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    gender: "Women",
    sizeChart: null,
    nutritionalInfo: null,
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: null,
    // ── EXERCISES wine-removed var: abv (null here — redistributed to food-beverages) ──
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: "925 Sterling Silver, Rhodium Plated",
    viewCount: 135000,
    inquiryCount: 3200,
    searchKeywords: ["wholesale silver earrings", "925 sterling silver wholesale", "CZ stud earrings bulk", "jewellery wholesale UK"],
    metaTitle: "Sterling Silver CZ Stud Earrings — Wholesale | WholesaleUp",
    metaDescription: "Buy sterling silver CZ stud earrings wholesale from €3.80/pair. 557% markup. 925 hallmarked, rhodium plated. MOQ 50.",
    maxOrderQuantity: 100000,
    exclusivityAvailable: true,
    whiteLabeling: { available: true, moq: 500, leadTime: "2-3 weeks", setupFee: { amount: 80, currency: "€" } },
    productInsurance: { included: true, provider: "AIG", coverage: "Full value coverage during transit" },
    qualityInspection: { available: true, provider: "Bureau Veritas", type: "Every batch AQL 1.0", cost: "Included" },
    firstOrderDiscount: { percentage: 10, label: "-10% ON YOUR FIRST ORDER!" },
    packageContents: "1× Pair CZ stud earrings, 1× Branded velvet pouch, 1× Authenticity card",
    compatibleWith: null,
    sellToPrivate: true,
    targetAudience: ["Jewellery shops", "Market traders", "Online accessories stores", "Gift shops"],
    hazardSymbols: null,
    shippingScope: "all-continents",
    shippingContinents: ["Africa", "Asia", "Europe", "North America", "Oceania", "South America"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "925 hallmarked, Bureau Veritas tested",
    imagesRepresentative: false,
    supplierIsCertified: true,
    supplierResponseBadge: "very quickly",
    dealReturnPolicy: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: { available: true, location: "Bangkok Jewellery Trade Centre", byAppointment: false },
    weeksBestOffer: false,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 180,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: true,
    platformExclusive: false,
    modelCount: 200,
    labelCondition: "Original branded pouch and card",
    mayContainDuplicates: false,
    shippingCostMethod: "flat-rate",
    freeDelivery: false,
    invoiceType: "VAT",
    sanitizedInvoice: "Available",
    packagingFormat: "Individual velvet pouches, master cartons of 100 pairs",
    productDimensions: { length: 6, width: 6, height: 8, unit: "mm", notes: "stone diameter 6mm" },
    predominantSizes: null,
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 50, maxQty: 200, price: 3.80 }, { minQty: 201, maxQty: 500, price: 3.40 }, { minQty: 501, maxQty: null, price: 2.95 }],
    warranty: "2 years",
    functionalRate: null,
    supplyAbility: { quantity: 50000, unit: "pairs", period: "month" },
    sampleLeadTime: { min: 2, max: 3, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "Sienna Silver Europe Ltd.", address: "15 Hatton Garden, London EC1N 8AT, United Kingdom", email: "eu@siennasilver.com" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 50, maxQty: 500, days: 7 },
      { minQty: 501, maxQty: 5000, days: 14 },
      { minQty: 5001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer",
    grossWeight: { value: 0.03, unit: "kg" },
    multipackQuantity: null,
    itemGroupId: "WUP-GRP-SS-CZ",
    pattern: null,
    productHighlights: [
      "925 sterling silver, hallmarked and rhodium-plated",
      "AAA-grade cubic zirconia, 6mm round brilliant cut",
      "Nickel-free, hypoallergenic — safe for sensitive ears",
      "Branded velvet pouch included for retail display",
    ],
    gln: "8858012345678",
    gpcCode: "10003456",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "TH",
    gmoDeclaration: null,
    weeeClassification: null,
    reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-03-15" },
    rohsCompliance: null,
    carbonFootprint: { value: 8.5, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: null,
    costOfGoodsSold: { value: 2.10, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "pair" },
  },

  "food-beverages": {
    _label: "Food & Beverages",
    // ── Identity ──
    id: 7,
    title: "Organic Extra Virgin Olive Oil – Cold-Pressed, 500ml Glass Bottle",
    slug: "organic-extra-virgin-olive-oil-cold-pressed-500ml",
    category: "Food & Beverages",
    categoryBreadcrumb: ["Food & Beverages", "Grocery & Pantry"],
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&h=800&fit=crop",
    ],
    description: `Premium cold-pressed extra virgin olive oil from organically farmed groves in Tuscany. This single-estate oil is pressed within hours of harvest to preserve the delicate flavour profile — peppery finish with notes of artichoke and fresh-cut grass.

Ideal for high-end retail, gourmet food shops, and restaurant supply. Available year-round with new harvest arriving each November. Full traceability from grove to bottle.

STORAGE: Keep sealed in a cool, dark place away from heat sources. Do not refrigerate. Best consumed within 12 months of opening.`,
    tags: ["#olive-oil", "#organic", "#extra-virgin", "#cold-pressed", "#italian", "#dop", "#tuscany", "#wholesale", "#gourmet"],

    // ── Pricing ──
    price: 4.85,
    currency: "€",
    priceUnit: "/ Bottle ex. VAT",
    rrp: 12.99,
    rrpCurrency: "€",
    markup: 167.8,
    mapPrice: { amount: 9.99, currency: "€" },
    priceValidUntil: "2026-12-31",
    netPaymentTerms: "Net 30",
    depositRequired: null,
    taxClass: "reduced",
    costOfGoodsSold: { value: 3.10, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "litre" },
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    priceTiers: [{ minQty: 200, maxQty: 500, price: 4.85 }, { minQty: 501, maxQty: 2000, price: 4.40 }, { minQty: 2001, maxQty: null, price: 3.95 }],

    // ── Volume ──
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 12.99, priceCurrency: "€", priceLabel: "/ Bottle inc.VAT", grossProfit: 8.14, profitLabel: "/1 Bottle inc.VAT", markup: 167.8, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 11.50, priceCurrency: "€", priceLabel: "/ Bottle inc.VAT", grossProfit: 6.65, profitLabel: "/1 Bottle inc.VAT", markup: 137.1, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    comparisonPrice: { label: "Lower priced than similar", percentage: 22 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },

    // ── Order & Quantity ──
    moq: 200,
    orderIncrement: 12,
    availableQuantity: 8000,
    casePackSize: 12,
    crossCategoryMOQ: false,
    isIndivisibleLot: false,
    maxOrderQuantity: 10000,
    isAssortedLot: false,
    lotComposition: null,
    multipackQuantity: null,
    lotRetailValue: null,

    // ── Identification ──
    sku: "TV-OO-500ML-2025",
    ean: "8001234567890",
    taric: "1509100090",
    mpn: "TV-EVOO-500",
    batchNumber: "LOT-2025-1103",
    serialNumberRequired: false,
    itemGroupId: "WUP-GRP-TVEVOO",
    gln: "8001234000012",
    gpcCode: "10000043",

    // ── Brands ──
    brands: [{ name: "Terra Verde", country: "IT" }],
    brandTier: "Premium",

    // ── Shipping ──
    shippingTime: 7,
    shippingCountries: "Italy, United Kingdom, France, Germany, Netherlands, Belgium, Spain, Austria, Switzerland",
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    shippingClass: "Standard",
    shippingCostBearer: "buyer",
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    freeShippingThreshold: { amount: 1000, currency: "€" },
    incoterms: "DDP",
    readyToShip: true,
    shipsFrom: "Tuscany, Italy",
    shipsFromCode: "it",
    portOfOrigin: null,
    estimatedDeliveryRange: { minDate: "Mar 18", maxDate: "Mar 28" },

    // ── Logistics ──
    packaging: { length: 8.5, width: 8.5, height: 28, unit: "cm", weight: 0.95, weightUnit: "kg" },
    palletConfiguration: { unitsPerLayer: 48, layersPerPallet: 5, unitsPerPallet: 240 },
    containerLoadQuantity: { twentyFt: 4800, fortyFt: 9600, fortyHC: 11000 },
    stackable: true,
    grossWeight: { value: 0.95, unit: "kg" },
    netWeight: { value: 0.46, unit: "kg" },
    dimensionsPerUnit: { length: 8.5, width: 8.5, height: 28, unit: "cm" },
    productDimensions: { length: 75, width: 75, height: 250, unit: "mm", notes: "bottle dimensions" },
    despatchUnitIndicator: false,

    // ── Payment ──
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],

    // ── Delivery ──
    deliveryOptions: ["National delivery", "International delivery"],

    // ── Deal details ──
    dealLocation: "Italy",
    dealLocationCode: "it",
    isDropship: false,
    negotiable: false,
    isExpired: false,

    // ── Supplier ──
    supplier: {
      companyName: "Frantoio Toscano S.r.l.",
      isVerified: true,
      rating: 4.9,
      reviewCount: 67,
      yearsActive: 22,
      categories: ["Olive Oil & Vinegar", "Gourmet Food", "Organic Products"],
      moreCategories: 1,
      address: {
        country: "Italy",
        countryCode: "it",
        city: "Greve in Chianti",
        postalCode: "50022",
        street: "Via della Vigna Vecchia",
      },
      companyWebsite: "frantaiotoscano.it",
      contact: {
        name: "Marco Bianchi",
        roleInCompany: "Export Manager",
        phone: "+39 055 854 321",
      },
      businessHours: {
        Sun: "Closed",
        Mon: "08:00 – 17:00",
        Tue: "08:00 – 17:00",
        Wed: "08:00 – 17:00",
        Thu: "08:00 – 17:00",
        Fri: "08:00 – 13:00",
        Sat: "Closed",
      },
      currentTime: "11:30",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2004,
      onTimeDeliveryRate: 98.5,
      responseTime: "≤3h",
      revenueTier: "established",
      companySize: 18,
      facilitySize: 3500,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "Bureau Veritas",
      customizationAbility: ["Custom labeling", "Private label bottling"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Family-owned Italian olive mill in the heart of Tuscany with 22 years of heritage in premium extra virgin olive oil production. We specialize in organic, cold-pressed oils and gourmet food products, serving specialty retailers and food distributors across Europe.",
      productsOffered: "Premium extra virgin olive oils, aged balsamic vinegars, gourmet food products, organic oils, and custom private label bottling solutions.",
      productCategories: ["olive-oil", "gourmet-food", "organic-products"],
      brandsDistributed: ["Frantoio Toscano", "Private Label"],
      productQualityTier: ["premium"],
      certifications: ["iso-9001", "iso-22000", "brc", "organic"],
      sampleAvailability: "paid",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 650,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "credit-debit-card"],
      paymentTerms: "Net 30 for established accounts; prepayment for initial orders",
      defaultDepositPercentage: 25,
      defaultDepositTerms: "25% deposit with order, 75% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "14-day return on unopened products. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "1500", discount: "5" },
        { currency: "€", minOrder: "5000", discount: "10" },
      ],
      discountNotes: "Volume discounts for food retailers. Custom private label and exclusive region pricing available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "gls"],
      leadTime: "5-7-days",
      defaultIncoterms: "DDP",
      countriesServed: ["IT", "DE", "FR", "GB", "ES", "NL", "BE", "AT", "SE"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "brand-owner", "exporter"],
      buyerTypesServed: ["food-retailer", "online-retailer", "restaurant-supplier", "distributor"],
      customersServed: ["registered-companies"],
      supplyModels: ["wholesale"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/frantaiotoscano",
      socialInstagram: "https://instagram.com/frantaiotoscano",
      socialLinkedin: "https://linkedin.com/company/frantoio-toscano",
      preferredCurrency: "EUR",
    },

    // ── Supplier-level fields ──
    certifications: ["iso-9001", "iso-22000", "brc"],
    returnPolicy: "14-day return on unopened products. Buyer pays return shipping.",
    leadTime: "5-7-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 970,
    minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "paypal"],
    discountTiers: [
      { currency: "€", minOrder: "2000", discount: "5" },
      { currency: "€", minOrder: "5000", discount: "8" },
      { currency: "€", minOrder: "10000", discount: "12" },
    ],
    supplyModels: ["wholesale"],
    productQualityTier: ["premium"],
    supplierBusinessType: "manufacturer",
    supplierIsCertified: true,
    supplierResponseBadge: "very quickly",

    // ── Product specs ──
    specifications: {
      "Volume": "500 ml",
      "Bottle": "Dark glass, UV-protective",
      "Acidity": "≤ 0.3%",
      "Harvest": "2025/2026",
      "Shelf Life": "24 months from production",
      "Certification": "EU Organic, DOP Toscano",
    },
    variants: [
      { name: "Size", options: ["250 ml", "500 ml", "750 ml", "1 litre"], selected: "500 ml" },
    ],
    materials: null,
    productLanguage: ["Italian", "English", "French", "German"],
    manufacturingCountry: "Italy",
    manufacturingCountryCode: "it",
    countryOfLastProcessing: "IT",

    // ── Customisation ──
    customizationOptions: [
      { name: "Private label", extraCost: 0.80, currency: "€", minQty: 500 },
      { name: "Gift box packaging", extraCost: 1.20, currency: "€", minQty: 100 },
    ],
    customizationAbility: { verified: true, levels: ["Custom labeling", "Private label bottling"] },

    // ── Reviews ──
    productReputation: {
      overallScore: 4.9,
      sourcesCount: 67,
      lastUpdated: "Feb 2026",
      summary: "Extra virgin DOP Toscano olive oil achieves premium ratings for authenticity and quality. Peppery finish and beautiful packaging support gourmet positioning. Strong appeal to specialty food retailers and restaurants. Monthly reorders from satisfied buyers.",
      dimensions: [
        { label: "Product Quality", score: 4.9 },
        { label: "Value for Money", score: 4.8 },
        { label: "Accuracy of Description", score: 4.9 },
        { label: "Packaging Quality", score: 4.9 },
        { label: "Resale Performance", score: 4.8 },
      ],
      highlights: [
        "Authentic DOP Toscano certification ensures premium quality",
        "Organic ICEA certification appeals to health-conscious consumers",
        "Distinctive peppery finish drives repeat purchases",
        "Kosher and Halal certifications expand market reach",
        "Beautiful glass bottle and cork packaging supports retail premium positioning",
      ],
      cautions: [
        "Occasional delivery delays from Italy",
        "Higher price point limits volume potential with budget retailers",
      ],
    },

    // ── Platform features ──
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [1, 3, 5],

    // ── Analytics ──
    unitsSold: 24500,
    reorderRate: 68,
    categoryRanking: { rank: 2, category: "Olive Oil — Organic" },
    viewCount: 15230,
    inquiryCount: 342,

    // ── Samples ──
    samplePrice: { amount: 8.00, currency: "€" },
    testerOption: { available: true, price: 8.00, currency: "€", nonReturnable: true },
    sampleLeadTime: { min: 3, max: 5, unit: "days" },

    // ── Lifecycle ──
    dateAdded: "15/03/2025",
    dealStatus: "active",
    launchDate: "2025-11-01",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: "2028-03-01",
    grade: "New",
    productGrade: "Extra Virgin — DOP",
    gradeNotes: null,
    gradeCategory: null,
    country: "IT",
    countryName: "Italy",

    // ── Attachments ──
    attachments: [
      { name: "Organic Certificate (ICEA).pdf", size: "420 KB", type: "pdf" },
      { name: "Chemical Analysis Report.pdf", size: "180 KB", type: "pdf" },
      { name: "Wholesale Price List 2025-2026.xlsx", size: "95 KB", type: "xlsx" },
      { name: "Product Photos (High Res).zip", size: "12.1 MB", type: "zip" },
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    // ── Eco ──
    ecoFriendly: {
      materials: ["Recyclable glass bottle", "Cork stopper"],
      packaging: ["Plastic-free", "Recyclable cardboard"],
      production: "Organic farming, solar-powered mill",
    },
    carbonFootprint: { value: 0.85, unit: "kg-CO2e", scope: "cradle-to-gate" },

    // ── Food-specific (G7) ──
    ingredients: "100% organic extra virgin olive oil (Olea europaea). Single-origin Tuscany, Italy.",
    allergens: null,
    dietaryTags: ["Organic", "Vegan", "Gluten-free", "No preservatives", "Kosher"],
    storageInstructions: "Store in a cool, dark place between 14–18°C. Do not refrigerate.",
    shelfLife: "24 months",
    nutritionalInfo: { servingSize: "15ml", calories: 120, fat: 14, saturatedFat: 2, carbs: 0, sugar: 0, protein: 0, fiber: 0, salt: 0 },
    organicCertification: { certified: true, body: "EU Organic / ICEA", number: "IT-BIO-006-12345" },
    kosherHalal: { kosher: true, halal: true, certBody: "Orthodox Union" },
    countryOfHarvest: "Italy (Tuscany)",
    abv: 0, // 0% — non-alcoholic food product; exercises the variable for coverage
    vintageYear: 2025,
    gmoDeclaration: "non-gmo",
    storageTemperatureRange: { min: 14, max: 18, unit: "°C" },

    // ── Category nulls ──
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    sizeChart: null,
    gender: null,
    pattern: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,
    sarValue: null,
    ipRating: null,
    energyRating: null,

    // ── Compliance ──
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    warrantyInfo: null,
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    euResponsiblePerson: { name: "Terra Verde Italia S.r.l.", address: "Via della Vigna Vecchia 15, 50022 Greve in Chianti, Italy", email: "compliance@terraverde.it" },
    weeeClassification: null,
    reachSvhcDeclaration: null,
    rohsCompliance: null,
    batteryInfo: null,
    powerSource: null,
    assemblyRequired: null,

    // ── Trust ──
    ageRestriction: null,
    countryRestrictions: null,
    restrictionScope: null,
    restrictedContinents: null,
    freeReturns: false,
    productInsurance: { included: true, provider: "Generali", coverage: "Transit breakage up to €10,000" },
    qualityInspection: { available: true, provider: "Bureau Veritas", type: "Pre-shipment", cost: "Included" },
    authenticityGuarantee: "100% authentic DOP-certified",
    dealReturnPolicy: null,
    warranty: null,
    functionalRate: null,

    // ── Lot & stock ──
    imagesRepresentative: false,
    mayContainDuplicates: false,
    isManifested: null,
    sourceRetailers: null,
    stockOrigin: null,
    predominantSizes: null,
    hasOriginalLabels: true,
    labelCondition: "Original labels intact",

    // ── Badges ──
    weeksBestOffer: false,
    platformExclusive: false,
    promotionalBadge: null,
    lowStockWarning: null,
    firstOrderDiscount: { percentage: 5, label: "-5% ON YOUR FIRST ORDER!" },

    // ── B2B extras ──
    exclusivityAvailable: true,
    whiteLabeling: { available: true, moq: 500, leadTime: "3-4 weeks", setupFee: { amount: 150, currency: "€" } },
    sellToPrivate: false,
    exportOnly: false,
    exportRegions: null,
    invoiceType: "VAT",
    sanitizedInvoice: "Available",
    importDutyCoverage: { covered: true, regions: ["EU"] },

    // ── Lead time tiers ──
    leadTimeTiers: [
      { minQty: 200, maxQty: 1000, days: 7 },
      { minQty: 1001, maxQty: 5000, days: 14 },
      { minQty: 5001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplyAbility: { quantity: 20000, unit: "bottles", period: "month" },

    // ── SEO ──
    searchKeywords: ["olive oil wholesale", "organic olive oil", "extra virgin olive oil bulk", "DOP Toscano", "Italian olive oil supplier"],
    metaTitle: "Organic Extra Virgin Olive Oil — Wholesale DOP Toscano | WholesaleUp",
    metaDescription: "Buy organic cold-pressed EVOO wholesale from €4.85/bottle. 167% markup. DOP Toscano certified. MOQ 200 bottles.",
    modelCount: null,
    productHighlights: [
      "Cold-pressed within 6 hours of harvest for peak freshness",
      "DOP Toscano and EU Organic certified",
      "Acidity below 0.3% — premium extra virgin grade",
      "Dark glass UV-protective bottle preserves flavour",
      "Full grove-to-bottle traceability",
    ],
    showroomAvailable: { available: true, location: "Greve in Chianti, Tuscany", byAppointment: true },
    packagingFormat: "Cases of 12 bottles in cardboard dividers",
    offerValidityDays: 60,
    packageContents: "1× 500ml glass bottle of EVOO, 1× Pour spout insert",
    compatibleWith: null,
    targetAudience: ["Gourmet food retailers", "Restaurant supply chains", "Delicatessen shops", "Organic food stores"],
    hazardSymbols: null,
  },

  "pet-supplies": {
    _label: "Pet Supplies",
    id: 110,
    title: "Premium Grain-Free Dog Food – Salmon & Sweet Potato, 12kg Bag",
    slug: "premium-grain-free-dog-food-salmon-sweet-potato-12kg",
    category: "Pet Supplies",
    categoryBreadcrumb: ["Pet Supplies", "Pet Food & Treats"],
    images: [
      "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=800&fit=crop",
    ],
    description: `Premium grain-free dry dog food formulated with wild-caught Scottish salmon and sweet potato. High protein (28%), no artificial colours, flavours or preservatives. Added glucosamine and chondroitin for joint support.

Suitable for adult dogs of all breeds. Produced in the UK under BRC-certified facilities. FEDIAF compliant nutrition.

Strong repeat-purchase category — pet food is a recession-proof staple with high customer loyalty once brand adopted.`,
    tags: ["#dog-food", "#grain-free", "#salmon", "#premium", "#wholesale", "#pet-supplies", "#natural"],

    price: 18.50,
    currency: "€",
    priceUnit: "/ Bag ex. VAT",
    rrp: 54.99,
    rrpCurrency: "€",
    markup: 197.2,
    dateAdded: "12/02/2026",
    grade: "New",
    country: "GB",
    countryName: "United Kingdom",
    moq: 30,
    sku: "PS-DGF-SAL-12",
    taric: "2309109000",
    ean: "5060234567890",
    brands: [{ name: "Highland Paws", country: "GB" }],
    shippingTime: 5,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 54.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 36.49, profitLabel: "/1 Unit inc.VAT", markup: 197.24, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 46.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 28.49, profitLabel: "/1 Unit inc.VAT", markup: 153.95, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Edinburgh, United Kingdom",
    dealLocationCode: "gb",
    isDropship: true,
    negotiable: false,
    isExpired: false,
    availableQuantity: 5000,
    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["National delivery", "International delivery"],
    shippingCountries: "United Kingdom, Ireland, Germany, France, Netherlands, Belgium",
    attachments: [
      { name: "Nutritional Analysis.pdf", size: "890 KB", type: "pdf" },
      { name: "BRC Certificate.pdf", size: "1.2 MB", type: "pdf" },
      { name: "FEDIAF Compliance.pdf", size: "450 KB", type: "pdf" },
    ],
    supplier: {
      companyName: "Highland Paws Pet Nutrition Ltd.",
      isVerified: true,
      rating: 4.9,
      reviewCount: 178,
      yearsActive: 8,
      categories: ["Dog", "Cat", "Pet Food & Treats"],
      moreCategories: 1,
      address: { country: "United Kingdom", countryCode: "gb", city: "Edinburgh", postalCode: "EH6 5NP", street: "Leith Mills Industrial Estate, Unit 14" },
      companyWebsite: "highlandpaws.co.uk",
      contact: { name: "Angus McFarlane", roleInCompany: "Trade Sales Manager", phone: "+44 131 555 3456" },
      businessHours: { Sun: "Closed", Mon: "08:00 – 17:00", Tue: "08:00 – 17:00", Wed: "08:00 – 17:00", Thu: "08:00 – 17:00", Fri: "08:00 – 15:00", Sat: "Closed" },
      currentTime: "09:30",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2018,
      onTimeDeliveryRate: 99.1,
      responseTime: "≤2h",
      revenueTier: "growing",
      companySize: 32,
      facilitySize: 2500,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "BRC Global Standards",
      customizationAbility: ["Sample-based customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Scottish premium pet nutrition manufacturer specializing in grain-free, hypoallergenic dog and cat food formulations. Established in 2018, we source sustainably and focus on high-palatability recipes that drive retail conversion and customer loyalty.",
      productsOffered: "Premium grain-free dog food, hypoallergenic formulations, cat food, pet treats, and custom nutrition solutions for pet retailers and online marketplaces.",
      productCategories: ["pet-food", "dog-food", "cat-food"],
      brandsDistributed: ["Highland Paws", "Private Label"],
      productQualityTier: ["premium"],
      certifications: ["brc", "iso-9001", "fediaf"],
      sampleAvailability: "free",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 555,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "credit-debit-card"],
      paymentTerms: "Net 30 for verified accounts; prepayment for first orders",
      defaultDepositPercentage: 25,
      defaultDepositTerms: "25% deposit with order, 75% before delivery",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "14-day return on unopened bags. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "1000", discount: "5" },
        { currency: "€", minOrder: "5000", discount: "10" },
      ],
      discountNotes: "Volume discounts for pet retailers. White-label and custom formulation available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "royal-mail", "gls"],
      leadTime: "3-5-days",
      defaultIncoterms: "DDP",
      countriesServed: ["GB", "IE", "DE", "FR", "NL", "BE", "SE"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "brand-owner"],
      buyerTypesServed: ["pet-retailer", "online-retailer", "distributor", "feed-store"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "dropshipping", "white-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/highlandpaws",
      socialInstagram: "https://instagram.com/highlandpaws",
      socialLinkedin: "https://linkedin.com/company/highland-paws",
      preferredCurrency: "GBP",
    },
    certifications: ["brc", "iso-9001"],
    returnPolicy: "14-day return on unopened bags. Buyer pays return shipping.",
    leadTime: "3-5-days",
    sampleAvailability: "free",
    minimumOrderAmount: 555,
    minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"],
    discountTiers: [
      { currency: "€", minOrder: "1000", discount: "5" },
      { currency: "€", minOrder: "5000", discount: "10" },
    ],
    supplyModels: ["wholesale", "white-label"],
    productQualityTier: ["premium"],
    specifications: {
      "Protein": "28% (salmon meal, fresh salmon)",
      "Fat": "16%",
      "Fibre": "3.5%",
      "Bag Size": "12kg",
      "Life Stage": "Adult (1–7 years)",
      "Breed Size": "All breeds",
    },
    variants: [
      { name: "Size", options: ["2kg", "6kg", "12kg"], selected: "12kg" },
      { name: "Flavour", options: ["Salmon & Sweet Potato", "Chicken & Potato", "Lamb & Rice"], selected: "Salmon & Sweet Potato" },
    ],
    videoUrl: null,
    packaging: { length: 55, width: 35, height: 15, unit: "cm", weight: 12.5, weightUnit: "kg" },
    materials: "Salmon meal (26%), sweet potato, potato, fresh salmon (8%), peas, salmon oil",
    productLanguage: ["English"],
    manufacturingCountry: "United Kingdom",
    manufacturingCountryCode: "gb",
    customizationOptions: null,
    productReputation: {
      overallScore: 4.9,
      sourcesCount: 178,
      lastUpdated: "Feb 2026",
      summary: "Premium grain-free dog food delivers exceptional results with excellent palatability. Sustainably sourced Scottish salmon resonates with conscious pet owners. High conversion rates from trial to repeat purchase indicate strong product-market fit.",
      dimensions: [
        { label: "Product Quality", score: 4.9 },
        { label: "Value for Money", score: 4.8 },
        { label: "Accuracy of Description", score: 4.9 },
        { label: "Packaging Quality", score: 4.8 },
        { label: "Resale Performance", score: 4.9 },
      ],
      highlights: [
        "Top-selling product across pet retail channels",
        "High palatability with strong dogs' acceptance rates",
        "Grain-free and hypoallergenic formulation supports premium positioning",
        "Sustainably sourced Scottish salmon appeals to eco-conscious pet owners",
        "82% reorder rate indicates exceptional customer retention",
      ],
      cautions: [
        "Strong fish odor may concern some retailers during storage",
        "Premium price positioning limits mass-market appeal",
      ],
    },
    isBestseller: true,
    isNew: false,
    orderProtection: true,
    frequentlyBoughtTogether: [0, 2],
    unitsSold: 28000,
    reorderRate: 82,
    categoryRanking: { rank: 1, category: "Grain-Free Dog Food — Premium" },
    samplePrice: { amount: 0, currency: "€" },
    shelfLife: "18 Months",
    shipsFrom: "Edinburgh, United Kingdom",
    shipsFromCode: "gb",
    freeReturns: false,
    orderIncrement: 1,
    ecoFriendly: {
      materials: ["Sustainably sourced Scottish salmon"],
      packaging: ["Recyclable bag", "Cardboard outer (FSC)"],
      production: "Carbon-neutral production facility",
    },
    estimatedDeliveryRange: { minDate: "Mar 12", maxDate: "Mar 17" },
    freeShippingThreshold: { amount: 300, currency: "€" },
    testerOption: { available: true, price: 0, currency: "€", nonReturnable: true },
    casePackSize: 1,
    ingredients: "Salmon meal (26%), sweet potato, potato, fresh salmon (8%), peas, salmon oil (3%), beet pulp, minerals, vitamins, glucosamine (350mg/kg), chondroitin sulphate (200mg/kg), yucca extract, FOS prebiotics",
    allergens: ["Fish"],
    dietaryTags: ["Grain-free", "No artificial colours", "No artificial preservatives", "Hypoallergenic"],
    storageInstructions: "Store in a cool, dry place. Reseal bag after opening. Best used within 6 weeks of opening.",
    customizationAbility: { verified: false, levels: [] },
    importDutyCoverage: { covered: true, regions: ["UK", "EU"] },
    brandTier: "Premium",
    promotionalBadge: null,
    comparisonPrice: { label: "Lower priced than similar", percentage: 12 },
    paymentFinancing: null,
    lowStockWarning: null,
    productGrade: "Premium",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: null,
    ageRestriction: null,
    dimensionsPerUnit: { length: 55, width: 35, height: 15, unit: "cm" },
    netWeight: { value: 12.0, unit: "kg" },
    mpn: "HP-DGF-SAL-12KG",
    batchNumber: "BATCH-2026-Q1-087",
    serialNumberRequired: false,
    mapPrice: null,
    priceValidUntil: "2026-06-30",
    netPaymentTerms: "Net 30",
    depositRequired: null,
    taxClass: "zero-rated",
    palletConfiguration: { unitsPerLayer: 8, layersPerPallet: 5, unitsPerPallet: 40 },
    containerLoadQuantity: { twentyFt: 800, fortyFt: 1600, fortyHC: 1800 },
    shippingClass: "Standard",
    incoterms: "DDP",
    readyToShip: true,
    stackable: true,
    portOfOrigin: null,
    dealStatus: "active",
    launchDate: "2024-06-01",
    discontinuedDate: null,
    seasonality: "All Season",
    bestBeforeDate: "2027-09-15",
    regionalCompliance: null,
    cpscCompliance: null,
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    fabricComposition: null,
    gsm: null,
    careInstructions: null,
    fitType: null,
    gender: null,
    sizeChart: null,
    nutritionalInfo: { servingSize: "200g (medium adult dog)", calories: 360, fat: 16, saturatedFat: null, carbs: 38, sugar: null, fiber: 3.5, protein: 28, salt: 0.8 },
    organicCertification: null,
    kosherHalal: null,
    countryOfHarvest: "Scotland, United Kingdom",
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: null,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,
    viewCount: 38000,
    inquiryCount: 650,
    searchKeywords: ["wholesale dog food", "grain-free dog food bulk", "premium pet food wholesale", "salmon dog food trade"],
    metaTitle: "Premium Grain-Free Dog Food Salmon 12kg — Wholesale | WholesaleUp",
    metaDescription: "Buy Highland Paws grain-free dog food wholesale from €18.50/bag. 197% markup. Scottish salmon, BRC certified. MOQ 30.",
    maxOrderQuantity: 10000,
    exclusivityAvailable: true,
    whiteLabeling: { available: true, moq: 1000, leadTime: "6-8 weeks", setupFee: { amount: 500, currency: "€" } },
    productInsurance: { included: true, provider: "Aviva", coverage: "Transit damage up to €10,000" },
    qualityInspection: { available: true, provider: "BRC Global Standards", type: "Continuous production QC", cost: "Included" },
    firstOrderDiscount: { percentage: 5, label: "-5% ON YOUR FIRST ORDER!" },
    packageContents: "1× 12kg bag of Premium Grain-Free Dog Food (Salmon & Sweet Potato)",
    compatibleWith: null,
    sellToPrivate: true,
    targetAudience: ["Pet shops", "Online pet retailers", "Veterinary practices", "Farm shops"],
    hazardSymbols: null,
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "BRC-certified production, fully traceable supply chain",
    imagesRepresentative: false,
    supplierIsCertified: true,
    supplierResponseBadge: "very quickly",
    dealReturnPolicy: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: { available: true, location: "Edinburgh, UK", byAppointment: true },
    weeksBestOffer: false,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 90,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: true,
    platformExclusive: false,
    modelCount: null,
    labelCondition: "Original branded packaging with feeding guide",
    mayContainDuplicates: false,
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    invoiceType: "VAT",
    sanitizedInvoice: "On Request",
    packagingFormat: "Individual sealed bags, palletised shipment",
    productDimensions: null,
    predominantSizes: null,
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 30, maxQty: 100, price: 18.50 }, { minQty: 101, maxQty: 500, price: 17.00 }, { minQty: 501, maxQty: null, price: 15.50 }],
    warranty: null,
    functionalRate: null,
    supplyAbility: { quantity: 20000, unit: "bags", period: "month" },
    sampleLeadTime: { min: 2, max: 3, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "Highland Paws Pet Nutrition Ltd.", address: "Leith Mills Industrial Estate, Unit 14, Edinburgh EH6 5NP, United Kingdom", email: "trade@highlandpaws.co.uk" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 30, maxQty: 200, days: 5 },
      { minQty: 201, maxQty: 1000, days: 10 },
      { minQty: 1001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer",
    grossWeight: { value: 12.5, unit: "kg" },
    multipackQuantity: null,
    itemGroupId: "WUP-GRP-HP-DGF",
    pattern: null,
    productHighlights: [
      "28% protein from wild-caught Scottish salmon",
      "Grain-free, hypoallergenic formula with sweet potato",
      "Added glucosamine & chondroitin for joint support",
      "BRC-certified UK production, FEDIAF compliant",
    ],
    gln: "5060234567890",
    gpcCode: "10004567",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "GB",
    gmoDeclaration: "non-gmo",
    weeeClassification: null,
    reachSvhcDeclaration: null,
    rohsCompliance: null,
    carbonFootprint: { value: 18.5, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: { min: 5, max: 25, unit: "°C" },
    costOfGoodsSold: { value: 11.20, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "kg" },
  },

  "baby-kids": {
    _label: "Baby & Kids",
    id: 111,
    title: "Organic Cotton Baby Sleeping Bag – 2.5 TOG, 0–6 Months, Stars Print",
    slug: "organic-cotton-baby-sleeping-bag-2-5-tog-0-6-months",
    category: "Baby & Kids",
    categoryBreadcrumb: ["Baby & Kids", "Nursery Furniture & Bedding"],
    images: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=800&fit=crop",
    ],
    description: `Cosy organic cotton baby sleeping bag in a gentle stars print. 2.5 TOG rating — ideal for room temperatures of 16–20°C. Two-way zip for easy nappy changes without fully waking baby.

GOTS-certified organic cotton outer, 100% organic cotton jersey lining. OEKO-TEX 100 tested — free from harmful substances. Designed to replace loose blankets for safer sleep (per NHS guidelines).

EN 16781:2018 compliant for baby sleeping bags. Strong year-round seller with peaks in autumn/winter.`,
    tags: ["#baby", "#sleeping-bag", "#organic", "#cotton", "#wholesale", "#nursery", "#gots", "#oeko-tex"],

    price: 6.80,
    currency: "€",
    priceUnit: "/ Piece ex. VAT",
    rrp: 29.99,
    rrpCurrency: "€",
    markup: 341.0,
    dateAdded: "18/01/2026",
    grade: "New",
    country: "IN",
    countryName: "India",
    moq: 100,
    sku: "BK-SB-ORG-25T",
    taric: "6111200000",
    ean: "8901234567890",
    brands: [{ name: "Little Dreamer", country: "GB" }],
    shippingTime: 14,
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 29.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 23.19, profitLabel: "/1 Unit inc.VAT", markup: 341.03, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 24.99, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 18.19, profitLabel: "/1 Unit inc.VAT", markup: 267.50, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    dealLocation: "Tirupur, India",
    dealLocationCode: "in",
    isDropship: false,
    negotiable: true,
    isExpired: false,
    availableQuantity: 8000,
    paymentOptions: ["Bank transfer", "PayPal"],
    deliveryOptions: ["International delivery"],
    shippingCountries: "United Kingdom, Germany, France, Netherlands, Ireland, Belgium, Spain, Italy, Sweden, Denmark",
    attachments: [
      { name: "EN 16781 Test Report.pdf", size: "1.8 MB", type: "pdf" },
      { name: "GOTS Certificate.pdf", size: "640 KB", type: "pdf" },
      { name: "OEKO-TEX Certificate.pdf", size: "450 KB", type: "pdf" },
    ],
    supplier: {
      companyName: "Little Dreamer Textiles Pvt. Ltd.",
      isVerified: true,
      rating: 4.6,
      reviewCount: 134,
      yearsActive: 11,
      categories: ["Baby Clothing & Shoes", "Nursery Furniture & Bedding", "Nappies & Changing"],
      moreCategories: 2,
      address: { country: "India", countryCode: "in", city: "Tirupur", postalCode: "641604", street: "SIDCO Industrial Estate, Plot 45" },
      companyWebsite: "littledreamer-textiles.com",
      contact: { name: "Priya Venkatesh", roleInCompany: "Export Manager", phone: "+91 421 234 5678" },
      businessHours: { Sun: "Closed", Mon: "09:00 – 18:00", Tue: "09:00 – 18:00", Wed: "09:00 – 18:00", Thu: "09:00 – 18:00", Fri: "09:00 – 17:00", Sat: "09:00 – 13:00" },
      currentTime: "14:30",
      daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2015,
      onTimeDeliveryRate: 95.2,
      responseTime: "≤4h",
      revenueTier: "established",
      companySize: 150,
      facilitySize: 5000,
      facilitySizeUnit: "m²",
      thirdPartyVerification: "Control Union (GOTS)",
      customizationAbility: ["Drawing-based customization", "Sample-based customization", "Full customization"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "Indian textile manufacturer specializing in organic GOTS-certified baby clothing and nursery products. Founded in 2015 in Tirupur, we combine sustainable materials with safety-focused design for discerning retailers and brands across Europe.",
      productsOffered: "GOTS organic cotton baby clothing, sleeping bags, nursery bedding, organic baby shoes, and custom branded baby textiles.",
      productCategories: ["baby-clothing", "organic-textiles", "nursery-products"],
      brandsDistributed: ["Little Dreamer", "Custom OEM"],
      productQualityTier: ["mid-range", "premium"],
      certifications: ["gots", "oeko-tex", "iso-9001"],
      sampleAvailability: "paid",
      catalogueSize: "200-1000",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 680,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "paypal"],
      paymentTerms: "LC at sight or 50/50 T/T; Net 30 for established accounts",
      defaultDepositPercentage: 40,
      defaultDepositTerms: "40% T/T deposit, 60% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "14-day return on unopened items. Buyer pays return shipping.",
      discountTiers: [
        { currency: "€", minOrder: "2000", discount: "8" },
        { currency: "€", minOrder: "10000", discount: "15" },
      ],
      discountNotes: "Volume discounts for retailers. OEM and private label capabilities available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "fedex", "sea-freight"],
      leadTime: "10-14-days",
      defaultIncoterms: "FOB",
      countriesServed: ["GB", "DE", "FR", "NL", "IE", "BE", "ES", "IT", "SE", "DK"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer"],
      buyerTypesServed: ["baby-retailer", "online-retailer", "marketplace-seller"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "white-label", "private-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/littledreamertextiles",
      socialInstagram: "https://instagram.com/littledreamertextiles",
      socialLinkedin: "https://linkedin.com/company/little-dreamer-textiles",
      preferredCurrency: "EUR",
    },
    certifications: ["gots", "oeko-tex", "iso-9001"],
    returnPolicy: "14-day return on unopened items. Buyer pays return shipping.",
    leadTime: "10-14-days",
    sampleAvailability: "paid",
    minimumOrderAmount: 680,
    minimumOrderCurrency: "€",
    catalogueSize: "200-1000",
    supplierPaymentMethods: ["bank-transfer", "paypal"],
    discountTiers: [
      { currency: "€", minOrder: "2000", discount: "8" },
      { currency: "€", minOrder: "10000", discount: "15" },
    ],
    supplyModels: ["wholesale", "white-label", "private-label"],
    productQualityTier: ["mid-range", "premium"],
    specifications: {
      "Outer Fabric": "100% GOTS-certified organic cotton",
      "Lining": "100% Organic cotton jersey",
      "Fill": "100% Polyester (recycled)",
      "TOG Rating": "2.5 (suitable for 16–20°C rooms)",
      "Zip": "Two-way, covered, nickel-free",
      "Wash": "Machine wash 40°C",
    },
    variants: [
      { name: "Age/Size", options: ["0–6 months", "6–18 months", "18–36 months"], selected: "0–6 months" },
      { name: "Print", options: ["Stars", "Clouds", "Safari Animals", "Plain White"], selected: "Stars" },
    ],
    videoUrl: null,
    packaging: { length: 30, width: 22, height: 5, unit: "cm", weight: 0.45, weightUnit: "kg" },
    materials: "GOTS organic cotton outer, organic cotton jersey lining, recycled polyester fill",
    productLanguage: ["English", "German", "French"],
    manufacturingCountry: "India",
    manufacturingCountryCode: "in",
    customizationOptions: [
      { name: "Custom print/embroidery", extraCost: 1.50, currency: "€", minQty: 500 },
      { name: "Custom brand labels", extraCost: 0.30, currency: "€", minQty: 300 },
    ],
    productReputation: {
      overallScore: 4.6,
      sourcesCount: 134,
      lastUpdated: "Feb 2026",
      summary: "Organic cotton baby sleeping bags receive strong reviews for material quality and comfort. Two-way zip design and GOTS certification appeal to safety-conscious parents. Minor batch color variations do not impact buyer satisfaction.",
      dimensions: [
        { label: "Product Quality", score: 4.7 },
        { label: "Value for Money", score: 4.5 },
        { label: "Accuracy of Description", score: 4.6 },
        { label: "Packaging Quality", score: 4.5 },
        { label: "Resale Performance", score: 4.6 },
      ],
      highlights: [
        "GOTS organic cotton certification drives premium positioning",
        "Two-way zip design valued by parents for easy diaper changes",
        "Exceptional softness noted across customer feedback",
        "Fair Trade certified production resonates with ethical shoppers",
        "Hypoallergenic formulation supports sensitive skin positioning",
      ],
      cautions: [
        "Minor color variation between batches requires retailer communication",
        "Price point limits appeal to budget-conscious segments",
      ],
    },
    isBestseller: false,
    isNew: true,
    orderProtection: true,
    frequentlyBoughtTogether: [0, 1],
    unitsSold: 15000,
    reorderRate: 58,
    categoryRanking: { rank: 4, category: "Baby Sleeping Bags — Organic" },
    samplePrice: { amount: 15.00, currency: "€" },
    shelfLife: null,
    shipsFrom: "Tirupur, India",
    shipsFromCode: "in",
    freeReturns: false,
    orderIncrement: 5,
    ecoFriendly: {
      materials: ["GOTS organic cotton", "Recycled polyester fill"],
      packaging: ["Recyclable polybag", "FSC cardboard sleeve"],
      production: "Fair Trade certified factory, solar-powered facility",
    },
    estimatedDeliveryRange: { minDate: "Mar 23", maxDate: "Mar 30" },
    freeShippingThreshold: { amount: 1000, currency: "€" },
    testerOption: { available: true, price: 15.00, currency: "€", nonReturnable: true },
    casePackSize: 10,
    ingredients: null,
    allergens: null,
    dietaryTags: null,
    storageInstructions: null,
    customizationAbility: { verified: true, levels: ["Minor customization", "Drawing-based customization", "Full customization"] },
    importDutyCoverage: { covered: false, regions: [] },
    brandTier: "Verified",
    promotionalBadge: "New Arrival",
    comparisonPrice: { label: "Lower priced than similar", percentage: 20 },
    paymentFinancing: null,
    lowStockWarning: null,
    productGrade: "First Quality",
    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    countryRestrictions: [],
    restrictionScope: null,
    restrictedContinents: null,
    warrantyInfo: null,
    // ── EXERCISES: ageRestriction (baby product safety), cpscCompliance, energyRating ──
    ageRestriction: { minAge: 0, reason: "Designed for infants 0–36 months. Not suitable as clothing — sleeping bag only." },
    dimensionsPerUnit: { length: 70, width: 38, height: 3, unit: "cm" },
    netWeight: { value: 0.35, unit: "kg" },
    mpn: "LD-SB-ORG-25T-06",
    batchNumber: "BATCH-2026-Q1-IN-112",
    serialNumberRequired: false,
    mapPrice: null,
    priceValidUntil: "2026-09-30",
    netPaymentTerms: "Net 30",
    depositRequired: { percentage: 30, terms: "30% T/T upfront, 70% against B/L copy" },
    taxClass: "zero-rated",
    palletConfiguration: { unitsPerLayer: 50, layersPerPallet: 8, unitsPerPallet: 400 },
    containerLoadQuantity: { twentyFt: 8000, fortyFt: 16000, fortyHC: 20000 },
    shippingClass: "Standard",
    incoterms: "FOB",
    readyToShip: true,
    stackable: true,
    portOfOrigin: "Chennai, India",
    dealStatus: "active",
    launchDate: "2025-09-01",
    discontinuedDate: null,
    seasonality: "Autumn/Winter",
    bestBeforeDate: null,
    regionalCompliance: null,
    cpscCompliance: { compliant: true, certNumber: "CPC-2025-EN16781-089", testLab: "Intertek" },
    fdaRegistration: null,
    energyRating: null,
    sarValue: null,
    ipRating: null,
    // ── APPAREL-ADJACENT (baby textiles) ──
    fabricComposition: [{ material: "Organic Cotton", percentage: 100 }],
    gsm: 200,
    careInstructions: { wash: "Machine wash 40°C", dry: "Tumble dry low", iron: "Cool iron", bleach: "Do not bleach" },
    fitType: null,
    gender: "Unisex",
    sizeChart: ["0–6m", "6–18m", "18–36m"],
    nutritionalInfo: null,
    organicCertification: { certified: true, body: "GOTS (Global Organic Textile Standard)", number: "CU-GOTS-2025-4567" },
    kosherHalal: null,
    countryOfHarvest: null,
    abv: null,
    vintageYear: null,
    inciList: null,
    spfRating: null,
    skinType: null,
    paoMonths: null,
    crueltyFree: null,
    dermatologicallyTested: true,
    toleranceSpecs: null,
    pressureRating: null,
    temperatureRange: null,
    threadType: null,
    materialGrade: null,
    viewCount: 28000,
    inquiryCount: 520,
    searchKeywords: ["wholesale baby sleeping bag", "organic baby sleep sack", "baby sleeping bag bulk", "nursery wholesale"],
    metaTitle: "Organic Cotton Baby Sleeping Bag 2.5 TOG — Wholesale | WholesaleUp",
    metaDescription: "Buy organic cotton baby sleeping bags wholesale from €6.80/piece. 341% markup. GOTS & OEKO-TEX certified. MOQ 100.",
    maxOrderQuantity: 20000,
    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 1000, leadTime: "4-6 weeks", setupFee: { amount: 200, currency: "€" } },
    productInsurance: { included: true, provider: "ICICI Lombard", coverage: "Transit damage up to €15,000" },
    qualityInspection: { available: true, provider: "Intertek", type: "Pre-shipment AQL 1.5", cost: "€0.08/piece" },
    firstOrderDiscount: { percentage: 5, label: "-5% ON YOUR FIRST ORDER!" },
    packageContents: "1× Baby sleeping bag, 1× Care instruction card, 1× Room temperature guide",
    compatibleWith: null,
    sellToPrivate: false,
    targetAudience: ["Baby boutiques", "Nursery shops", "Online baby retailers", "NCT sales"],
    hazardSymbols: null,
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    isAssortedLot: false,
    lotComposition: null,
    authenticityGuarantee: "GOTS certified, Intertek tested to EN 16781:2018",
    imagesRepresentative: false,
    supplierIsCertified: false,
    supplierResponseBadge: "quickly",
    dealReturnPolicy: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    isIndivisibleLot: false,
    sourceRetailers: null,
    gradeNotes: null,
    gradeCategory: null,
    showroomAvailable: null,
    weeksBestOffer: false,
    hasOriginalLabels: true,
    exportOnly: false,
    exportRegions: null,
    offerValidityDays: 90,
    shippingCostBearer: "buyer",
    crossCategoryMOQ: false,
    platformExclusive: false,
    modelCount: null,
    labelCondition: "Original brand labels with care instructions",
    mayContainDuplicates: false,
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    invoiceType: "Both",
    sanitizedInvoice: "Available",
    packagingFormat: "Individual polybags with card insert, master cartons of 10",
    productDimensions: { length: 70, width: 38, height: 3, unit: "cm", notes: "0–6 months size, laid flat" },
    predominantSizes: ["0–6 months", "6–18 months"],
    stockOrigin: null,
    isManifested: null,
    lotRetailValue: null,
    priceTiers: [{ minQty: 100, maxQty: 500, price: 6.80 }, { minQty: 501, maxQty: 2000, price: 6.00 }, { minQty: 2001, maxQty: null, price: 5.20 }],
    warranty: null,
    functionalRate: null,
    supplyAbility: { quantity: 30000, unit: "pieces", period: "month" },
    sampleLeadTime: { min: 5, max: 7, unit: "days" },
    powerSource: null,
    assemblyRequired: false,
    euResponsiblePerson: { name: "Little Dreamer Europe Ltd.", address: "25 Regent St, London W1B 2HN, United Kingdom", email: "eu@littledreamer-textiles.com" },
    batteryInfo: null,
    leadTimeTiers: [
      { minQty: 100, maxQty: 500, days: 14 },
      { minQty: 501, maxQty: 5000, days: 21 },
      { minQty: 5001, maxQty: null, days: null, label: "To be negotiated" },
    ],
    supplierBusinessType: "manufacturer",
    grossWeight: { value: 0.48, unit: "kg" },
    multipackQuantity: null,
    itemGroupId: "WUP-GRP-LD-SB",
    pattern: "Stars print",
    productHighlights: [
      "GOTS-certified organic cotton, OEKO-TEX 100 tested",
      "2.5 TOG for room temperatures 16–20°C",
      "Two-way zip for easy nappy changes",
      "EN 16781:2018 compliant baby sleeping bag",
    ],
    gln: "8901234567890",
    gpcCode: "10005678",
    despatchUnitIndicator: false,
    countryOfLastProcessing: "IN",
    gmoDeclaration: null,
    weeeClassification: null,
    reachSvhcDeclaration: null,
    rohsCompliance: null,
    carbonFootprint: { value: 6.8, unit: "kg-CO2e", scope: "cradle-to-gate" },
    storageTemperatureRange: null,
    costOfGoodsSold: { value: 3.50, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "piece" },
  },

  "surplus-clearance": {
    _label: "Surplus & Clearance",
    id: 14,
    title: "Mixed Electronics Return Pallet – Amazon/MediaMarkt, ~250 Items, Unmanifested",
    slug: "mixed-electronics-return-pallet-amazon-mediamarkt",
    category: "Surplus & Clearance",
    categoryBreadcrumb: ["Surplus & Clearance", "Mixed Pallets"],
    images: [
      "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800&h=800&fit=crop",
    ],
    description: `Mixed electronics customer return pallet sourced from Amazon DE and MediaMarkt liquidation channels. Approximately 250 items per pallet.

Typical contents: smartphones, tablets, headphones, smart home devices, small kitchen appliances, personal care electronics. Mix of opened returns, box-damaged, and some sealed items.

IMPORTANT: This is an UNMANIFESTED pallet — individual item list is NOT provided. Pallets are sold as-is, no returns. Based on historical data from this supply chain, approximately 65% of items are fully functional, 20% have minor issues (cosmetic damage, missing accessories), and 15% are defective.

Retail value estimated at €12,000–€18,000 per pallet based on previous allocations.`,
    tags: ["#liquidation", "#returns", "#mixed-pallet", "#amazon-returns", "#electronics", "#unmanifested", "#wholesale", "#reseller"],

    price: 1850.00,
    currency: "€",
    priceUnit: "/ Pallet ex. VAT",
    rrp: null,
    rrpCurrency: "€",
    markup: null,
    mapPrice: null, priceValidUntil: "2026-04-30", netPaymentTerms: "Due on receipt", depositRequired: null,
    taxClass: "standard", costOfGoodsSold: null,
    unitPricingBaseMeasure: null,
    omnibusPrice: null,
    discountPercentage: null,
    originalPrice: null,
    priceTiers: null,
    platforms: [],
    comparisonPrice: null,
    paymentFinancing: null,

    moq: 1,
    orderIncrement: 1,
    availableQuantity: 45,
    casePackSize: 1,
    crossCategoryMOQ: false,
    isIndivisibleLot: true,
    maxOrderQuantity: 22,
    isAssortedLot: true,
    lotComposition: ["Smartphones & Tablets 25%", "Audio & Headphones 20%", "Smart Home 15%", "Kitchen Appliances 15%", "Personal Care 10%", "Accessories & Other 15%"],
    multipackQuantity: null,

    // ── Exercises lotRetailValue ──
    lotRetailValue: { amount: 15000, currency: "€" },

    sku: "LP-ELEC-MIX-AMZ-MM",
    ean: null,
    taric: "8471300000",
    mpn: null,
    batchNumber: "PALLET-2026-W10-034",
    serialNumberRequired: false,
    itemGroupId: null,
    gln: null,
    gpcCode: null,

    brands: [{ name: "Mixed Brands", country: "DE" }],
    brandTier: null,

    shippingTime: 3,
    shippingCountries: "Germany, Netherlands, Belgium, France, Poland, Austria",
    shippingScope: "specific",
    shippingContinents: ["Europe"],
    shippingClass: "Freight",
    shippingCostBearer: "buyer",
    shippingCostMethod: "flat-rate",
    freeDelivery: false,
    freeShippingThreshold: null,
    incoterms: "EXW",
    readyToShip: true,
    shipsFrom: "Düsseldorf, Germany",
    shipsFromCode: "de",
    portOfOrigin: null,
    estimatedDeliveryRange: { minDate: "Mar 12", maxDate: "Mar 17" },

    packaging: { length: 120, width: 80, height: 150, unit: "cm", weight: 180, weightUnit: "kg" },
    palletConfiguration: null,
    containerLoadQuantity: { twentyFt: 10, fortyFt: 22, fortyHC: 22 },
    stackable: false,
    grossWeight: { value: 180, unit: "kg" },
    netWeight: { value: 160, unit: "kg" },
    dimensionsPerUnit: { length: 120, width: 80, height: 150, unit: "cm" },
    productDimensions: null,
    despatchUnitIndicator: true,

    paymentOptions: ["Bank transfer"],
    deliveryOptions: ["Collection in person", "National delivery"],
    dealLocation: "Germany", dealLocationCode: "de",
    isDropship: false, negotiable: true, isExpired: false,

    supplier: {
      companyName: "ReStock Liquidation GmbH",
      isVerified: true, rating: 4.3, reviewCount: 89, yearsActive: 6,
      categories: ["Electronics Returns", "Mixed Pallets", "Amazon Returns", "Liquidation Stock"],
      moreCategories: 2,
      address: { country: "Germany", countryCode: "de", city: "Düsseldorf", postalCode: "40468", street: "Logistikzentrum Rath" },
      companyWebsite: "restock-liquidation.de",
      contact: { name: "Markus Schultz", roleInCompany: "Sales Manager", phone: "+49 211 555 7890" },
      businessHours: { Sun: "Closed", Mon: "08:00 – 16:00", Tue: "08:00 – 16:00", Wed: "08:00 – 16:00", Thu: "08:00 – 16:00", Fri: "08:00 – 14:00", Sat: "Closed" },
      currentTime: "13:30", daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 2020, onTimeDeliveryRate: 95.0, responseTime: "≤3h", revenueTier: "established",
      companySize: 22, facilitySize: 5000, facilitySizeUnit: "m²",
      thirdPartyVerification: null, customizationAbility: [],
      // ── TAB 2: Products & Supply ──
      companyDescription: "German electronics liquidation specialist sourcing high-volume customer returns and overstock from major retailers. Founded in 2020, we focus on mixed electronics pallets from Amazon DE and MediaMarkt with transparent grading and consistent retail value estimates.",
      productsOffered: "Mixed electronics return pallets, Amazon DE customer returns, liquidation stock, overstock items. Approximately 250 units per pallet with varied condition grades.",
      productCategories: ["electronics-returns", "liquidation-stock", "mixed-pallets"],
      brandsDistributed: ["Mixed Brands"],
      productQualityTier: ["budget"],
      certifications: [],
      sampleAvailability: "none",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 1850,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer"],
      paymentTerms: "Due on receipt; no payment terms available",
      defaultDepositPercentage: 100,
      defaultDepositTerms: "100% prepayment required",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "No returns. All sales final.",
      discountTiers: [
        { currency: "€", minOrder: "10000", discount: "5" },
        { currency: "€", minOrder: "30000", discount: "8" },
      ],
      discountNotes: "Volume discounts for large liquidation purchases. No refunds or returns accepted.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["own-fleet"],
      leadTime: "1-3-days",
      defaultIncoterms: "EXW",
      countriesServed: ["DE", "NL", "BE", "FR"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["liquidator", "trading-company"],
      buyerTypesServed: ["reseller", "refurbisher", "distributor"],
      customersServed: ["registered-companies"],
      supplyModels: ["wholesale"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/restockliquidation",
      socialInstagram: "https://instagram.com/restockliquidation",
      socialLinkedin: "https://linkedin.com/company/restock-liquidation",
      preferredCurrency: "EUR",
    },

    certifications: [],
    returnPolicy: "No returns. All sales final.",
    leadTime: "1-3-days", sampleAvailability: "none",
    minimumOrderAmount: 1850, minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer"],
    discountTiers: [{ currency: "€", minOrder: "10000", discount: "5" }, { currency: "€", minOrder: "30000", discount: "8" }],
    supplyModels: ["wholesale"],
    productQualityTier: ["budget"],
    supplierBusinessType: "trading-company",
    supplierIsCertified: false, supplierResponseBadge: "very quickly",

    specifications: {
      "Type": "Mixed electronics customer returns",
      "Source": "Amazon DE + MediaMarkt liquidation",
      "Approx. Items": "~250 per pallet",
      "Condition": "Mix / returns (opened, box-damaged, sealed)",
      "Est. Retail Value": "€12,000–€18,000",
      "Functional Rate": "~65% fully functional",
      "Pallet Size": "120 × 80 × 150 cm (Euro pallet)",
    },
    variants: null,
    materials: null,
    productLanguage: ["German", "English"],
    manufacturingCountry: null, manufacturingCountryCode: null, countryOfLastProcessing: "DE",

    customizationOptions: [],
    customizationAbility: { verified: false, levels: [] },

    productReputation: {
      overallScore: 4.3,
      sourcesCount: 89,
      lastUpdated: "Feb 2026",
      summary: "Mixed electronics return pallets offer strong value proposition with documented functionality rates. Repeat buyers value consistency and estimated retail values around €12K–15K per pallet. Best margins for buyers with repair/refurbishment capabilities.",
      dimensions: [
        { label: "Product Quality", score: 4.2 },
        { label: "Value for Money", score: 4.6 },
        { label: "Accuracy of Description", score: 4.1 },
        { label: "Packaging Quality", score: 4.0 },
        { label: "Resale Performance", score: 4.3 },
      ],
      highlights: [
        "Consistent estimated retail value €12K–15K supports profit planning",
        "Repeat buyers indicate stable supplier performance",
        "Amazon DE + MediaMarkt source drives buyer confidence",
        "~65% fully functional rate typical across shipments",
        "ALL SALES FINAL model reduces logistics costs",
      ],
      cautions: [
        "Defect rate varies batch-to-batch (55%–65% functional)",
        "Requires refurbishment expertise to maximize margins",
        "Higher defect rates occasionally reported",
      ],
    },

    isBestseller: false, isNew: true, orderProtection: true, frequentlyBoughtTogether: [],
    unitsSold: 340, reorderRate: 62, categoryRanking: { rank: 1, category: "Electronics Return Pallets" },
    viewCount: 28000, inquiryCount: 620,
    samplePrice: null, testerOption: null,
    sampleLeadTime: null,

    dateAdded: "01/03/2026", dealStatus: "active", launchDate: "2026-03-01", discontinuedDate: "2026-06-30",
    seasonality: "All Season", bestBeforeDate: null,
    grade: "Mix / returns", productGrade: null,

    // ── Exercises gradeNotes, gradeCategory ──
    gradeNotes: "Mixed condition: ~65% fully functional, ~20% minor cosmetic damage or missing accessories, ~15% defective/for parts",
    gradeCategory: "B",

    country: "DE", countryName: "Germany",

    attachments: [
      { name: "Sample Pallet Photos (previous allocation).zip", size: "15.2 MB", type: "zip" },
    ],
    videoUrl: null,

    ecoFriendly: { materials: ["Diverted from landfill — circular economy"], packaging: ["Stretch-wrapped Euro pallet"], production: "Returns processing facility" },
    carbonFootprint: null,

    ingredients: null, allergens: null, dietaryTags: null, storageInstructions: null, shelfLife: null,
    nutritionalInfo: null, organicCertification: null, kosherHalal: null, countryOfHarvest: null, abv: null, vintageYear: null,
    gmoDeclaration: null, storageTemperatureRange: null,
    fabricComposition: null, gsm: null, careInstructions: null, fitType: null, sizeChart: null, gender: null, pattern: null,
    inciList: null, spfRating: null, skinType: null, paoMonths: null, crueltyFree: null, dermatologicallyTested: null,
    toleranceSpecs: null, pressureRating: null, temperatureRange: null, threadType: null, materialGrade: null,
    sarValue: null, ipRating: null, energyRating: null, batteryInfo: null, powerSource: null, assemblyRequired: null,
    weeeClassification: null, reachSvhcDeclaration: null, rohsCompliance: null,

    hazmatInfo: { isHazardous: false, unNumber: null, class: null },
    warrantyInfo: null, regionalCompliance: null, cpscCompliance: null, fdaRegistration: null,
    euResponsiblePerson: null,

    ageRestriction: null, countryRestrictions: null, restrictionScope: null, restrictedContinents: null, freeReturns: false,
    productInsurance: { included: false, provider: null, coverage: null },
    qualityInspection: { available: false, provider: null, type: null, cost: null },
    authenticityGuarantee: null,

    // ── Exercises dealReturnPolicy ──
    dealReturnPolicy: "ALL SALES FINAL. No returns, no refunds, no exchanges. Pallets sold as-is.",

    warranty: null,

    // ── Exercises functionalRate ──
    functionalRate: { functional: 65, withIssues: 20, note: "~15% defective/for parts. Based on historical data from this supply chain." },

    // ── Exercises isManifested ──
    isManifested: false,

    // ── Exercises sourceRetailers ──
    sourceRetailers: ["Amazon DE", "MediaMarkt", "Saturn"],

    // ── Exercises stockOrigin ──
    stockOrigin: ["customer-returns", "cancelled-order"],

    predominantSizes: null, hasOriginalLabels: null,
    labelCondition: "Mixed — some original packaging, some opened/repackaged",

    // ── Exercises imagesRepresentative ──
    imagesRepresentative: true,
    mayContainDuplicates: true,

    weeksBestOffer: true, platformExclusive: false, promotionalBadge: "Fresh Stock — Just Arrived",
    lowStockWarning: { threshold: 10, remaining: 8 },
    firstOrderDiscount: null,

    exclusivityAvailable: false, whiteLabeling: null,
    sellToPrivate: false,

    // ── Exercises exportOnly + exportRegions ──
    exportOnly: true,
    exportRegions: ["Eastern Europe", "Africa", "Middle East", "Latin America"],
    invoiceType: "EU Community",
    sanitizedInvoice: "Unavailable",
    importDutyCoverage: null,

    leadTimeTiers: [{ minQty: 1, maxQty: 5, days: 3 }, { minQty: 6, maxQty: 22, days: 5 }],
    supplyAbility: { quantity: 45, unit: "pallets", period: "week" },

    searchKeywords: ["liquidation pallet wholesale", "amazon returns pallet", "electronics return pallet", "mixed pallet wholesale", "unmanifested pallet"],
    metaTitle: "Mixed Electronics Return Pallet — Liquidation Wholesale | WholesaleUp",
    metaDescription: "Buy mixed electronics return pallets from €1,850. ~250 items, est. €15K retail value. Amazon DE + MediaMarkt source. Collection available.",

    // ── Exercises modelCount ──
    modelCount: 250,

    productHighlights: ["~250 items per Euro pallet, est. €15K retail value", "Sourced from Amazon DE and MediaMarkt returns", "~65% fully functional based on historical data", "Collection available from Düsseldorf warehouse", "Weekly fresh stock — 45 pallets available per week"],
    showroomAvailable: { available: true, location: "Düsseldorf-Rath, Germany", byAppointment: true },
    packagingFormat: "Stretch-wrapped Euro pallet (120×80×150cm)",
    offerValidityDays: 14,
    packageContents: "1× Euro pallet of mixed electronics customer returns (~250 items)",
    compatibleWith: null,
    targetAudience: ["Resellers", "Ebay/Amazon sellers", "Flea market traders", "Refurbishment businesses", "Export traders"],
    hazardSymbols: null,
  },

  "automotive-parts": {
    _label: "Automotive & Parts",
    id: 13,
    title: "DOT 4 Brake Fluid – 1 Litre, ISO 4925 Class 6, Full Synthetic",
    slug: "dot-4-brake-fluid-1-litre-iso-4925-full-synthetic",
    category: "Automotive & Parts",
    categoryBreadcrumb: ["Automotive & Parts", "Car Care & Cleaning"],
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=800&fit=crop",
    ],
    description: `Premium DOT 4 full-synthetic brake fluid meeting ISO 4925 Class 6 and FMVSS 116 standards. Dry boiling point 265°C, wet boiling point 175°C. Compatible with all DOT 3 and DOT 4 brake systems.

Suitable for passenger cars, light commercial vehicles, motorcycles, and ABS/ESP systems. Low-viscosity formula ensures optimal performance in cold conditions down to -40°C.

Available in 1L bottles (case of 12) or 5L canisters. Full MSDS documentation included.`,
    tags: ["#brake-fluid", "#dot4", "#synthetic", "#automotive", "#wholesale", "#1-litre", "#ISO-4925"],

    price: 3.80,
    currency: "€",
    priceUnit: "/ Bottle ex. VAT",
    rrp: 14.99,
    rrpCurrency: "€",
    markup: 294.5,
    mapPrice: null, priceValidUntil: "2026-12-31", netPaymentTerms: "Net 30", depositRequired: null,
    taxClass: "standard", costOfGoodsSold: { value: 2.10, currency: "€" },
    unitPricingBaseMeasure: { value: 1, unit: "litre" },
    omnibusPrice: null, discountPercentage: null, originalPrice: null,
    priceTiers: [{ minQty: 120, maxQty: 600, price: 3.80 }, { minQty: 601, maxQty: 2400, price: 3.40 }, { minQty: 2401, maxQty: null, price: 3.00 }],
    platforms: [
      { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", price: 14.99, priceCurrency: "€", priceLabel: "/ Bottle inc.VAT", grossProfit: 11.19, profitLabel: "/1 Bottle inc.VAT", markup: 294.5, verifyUrl: "https://amazon.com", color: "#FF9900" },
      { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 11.99, priceCurrency: "€", priceLabel: "/ Bottle inc.VAT", grossProfit: 8.19, profitLabel: "/1 Bottle inc.VAT", markup: 215.5, verifyUrl: "https://ebay.com", color: "#0064D2" },
    ],
    comparisonPrice: { label: "Lower priced than similar", percentage: 15 },
    paymentFinancing: { provider: "Klarna", terms: "30 days to pay, interest-free" },

    moq: 120,
    orderIncrement: 12,
    availableQuantity: 25000,
    casePackSize: 12,
    crossCategoryMOQ: true,
    isIndivisibleLot: false,
    maxOrderQuantity: 50000,
    isAssortedLot: false, lotComposition: null, multipackQuantity: null, lotRetailValue: null,

    sku: "BF-DOT4-1L-SYN",
    ean: "4005514567890",
    taric: "3819000090",
    mpn: "BF-DOT4-SYN-1L",
    batchNumber: "LOT-2025-BF-0447",
    serialNumberRequired: false,
    itemGroupId: "WUP-GRP-BFDOT4",
    gln: "4005514000018",
    gpcCode: "10001230",

    brands: [{ name: "BremsKraft", country: "DE" }],
    brandTier: "Verified",

    shippingTime: 10,
    shippingCountries: "All EU countries, United Kingdom, Turkey, USA",
    shippingScope: "specific",
    shippingContinents: ["Europe", "North America"],
    shippingClass: "Hazmat",
    shippingCostBearer: "buyer",
    shippingCostMethod: "weight-based",
    freeDelivery: false,
    freeShippingThreshold: { amount: 2000, currency: "€" },
    incoterms: "DAP",
    readyToShip: true,
    shipsFrom: "Hamburg, Germany",
    shipsFromCode: "de",
    portOfOrigin: "Hamburg, Germany",
    estimatedDeliveryRange: { minDate: "Mar 20", maxDate: "Apr 5" },

    packaging: { length: 9, width: 6, height: 22, unit: "cm", weight: 1.15, weightUnit: "kg" },
    palletConfiguration: { unitsPerLayer: 96, layersPerPallet: 4, unitsPerPallet: 384 },
    containerLoadQuantity: { twentyFt: 7680, fortyFt: 15360, fortyHC: 18000 },
    stackable: true,
    grossWeight: { value: 1.15, unit: "kg" },
    netWeight: { value: 1.05, unit: "kg" },
    dimensionsPerUnit: { length: 9, width: 6, height: 22, unit: "cm" },
    productDimensions: null,
    despatchUnitIndicator: false,

    paymentOptions: ["Bank transfer", "PayPal", "Credit card"],
    deliveryOptions: ["National delivery", "International delivery"],
    dealLocation: "Germany", dealLocationCode: "de",
    isDropship: false, negotiable: true, isExpired: false,

    supplier: {
      companyName: "BremsKraft Chemie GmbH",
      isVerified: true, rating: 4.7, reviewCount: 156, yearsActive: 28,
      categories: ["Brake Fluids", "Automotive Chemicals", "Lubricants", "Coolants"],
      moreCategories: 2,
      address: { country: "Germany", countryCode: "de", city: "Hamburg", postalCode: "20457", street: "Hafenstraße" },
      companyWebsite: "bremskraft.de",
      contact: { name: "Thomas Braun", roleInCompany: "B2B Sales Manager", phone: "+49 40 789 0123" },
      businessHours: { Sun: "Closed", Mon: "07:30 – 16:30", Tue: "07:30 – 16:30", Wed: "07:30 – 16:30", Thu: "07:30 – 16:30", Fri: "07:30 – 14:00", Sat: "Closed" },
      currentTime: "11:00", daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      yearEstablished: 1998, onTimeDeliveryRate: 97.2, responseTime: "≤4h", revenueTier: "enterprise",
      companySize: 65, facilitySize: 12000, facilitySizeUnit: "m²",
      thirdPartyVerification: "TÜV SÜD", customizationAbility: ["Private labeling", "Custom bottle sizes"],
      // ── TAB 2: Products & Supply ──
      companyDescription: "German industrial chemicals manufacturer specializing in premium automotive fluids and lubricants. Founded in 1998 and headquartered in Hamburg, BremsKraft delivers ISO-certified brake fluids, coolants, and specialty chemicals to professional workshops and automotive retailers across Europe.",
      productsOffered: "DOT 4 synthetic brake fluids, automotive coolants, brake system cleaners, specialty lubricants, and custom private label chemical solutions.",
      productCategories: ["brake-fluids", "automotive-chemicals", "lubricants"],
      brandsDistributed: ["BremsKraft"],
      productQualityTier: ["premium"],
      certifications: ["iso-9001", "iso-14001", "iso-4925"],
      sampleAvailability: "free",
      catalogueSize: "50-200",
      // ── TAB 3: Orders & Payments ──
      minimumOrderAmount: 456,
      minimumOrderCurrency: "€",
      paymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
      paymentTerms: "Net 30 for established accounts; prepayment for first orders",
      defaultDepositPercentage: 30,
      defaultDepositTerms: "30% deposit with order, 70% before shipment",
      defaultInvoiceType: "vat",
      sanitizedInvoice: "on-request",
      defaultTaxClass: "standard",
      returnPolicy: "Returns accepted within 14 days for unopened sealed products only.",
      discountTiers: [
        { currency: "€", minOrder: "2000", discount: "5" },
        { currency: "€", minOrder: "10000", discount: "10" },
      ],
      discountNotes: "Volume discounts for automotive retailers. White-label and custom packaging available.",
      // ── TAB 4: Shipping & Reach ──
      deliveryMethods: ["dhl", "dpd", "gls"],
      leadTime: "5-10-days",
      defaultIncoterms: "DAP",
      countriesServed: ["DE", "AT", "NL", "BE", "FR", "PL", "CZ", "DK"],
      excludedCountries: ["RU", "BY"],
      // GROUP E — Supplier profile inherited fields
      supplierType: ["manufacturer", "wholesaler"],
      buyerTypesServed: ["auto-retailer", "workshop", "distributor", "fleet-manager"],
      customersServed: ["registered-companies", "sole-traders"],
      supplyModels: ["wholesale", "white-label"],
      // GROUP F — Supplier branding
      companyLogo: "/images/supplier-logo-placeholder.svg",
      socialFacebook: "https://facebook.com/bremskraftchemie",
      socialInstagram: "https://instagram.com/bremskraftchemie",
      socialLinkedin: "https://linkedin.com/company/bremskraft-chemie",
      preferredCurrency: "EUR",
    },

    certifications: ["iso-9001", "iso-14001"],
    returnPolicy: "Returns accepted within 14 days for unopened sealed products only.",
    leadTime: "5-10-days", sampleAvailability: "free",
    minimumOrderAmount: 456, minimumOrderCurrency: "€",
    catalogueSize: "50-200",
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal"],
    discountTiers: [{ currency: "€", minOrder: "2000", discount: "5" }, { currency: "€", minOrder: "10000", discount: "10" }],
    supplyModels: ["wholesale", "white-label"],
    productQualityTier: ["premium"],
    supplierBusinessType: "manufacturer",
    supplierIsCertified: true, supplierResponseBadge: "quickly",

    specifications: {
      "Type": "DOT 4 Full Synthetic",
      "Standard": "ISO 4925 Class 6, FMVSS 116",
      "Dry Boiling Point": "265°C",
      "Wet Boiling Point": "175°C",
      "Volume": "1 Litre",
      "Colour": "Light amber",
      "Viscosity": "≤1200 mm²/s at -40°C",
    },
    variants: [{ name: "Size", options: ["500 ml", "1 Litre", "5 Litres"], selected: "1 Litre" }],
    materials: "Polyethylene glycol-based synthetic brake fluid",
    productLanguage: ["German", "English", "French", "Spanish"],
    manufacturingCountry: "Germany", manufacturingCountryCode: "de", countryOfLastProcessing: "DE",

    customizationOptions: [{ name: "Private label", extraCost: 0.50, currency: "€", minQty: 1000 }],
    customizationAbility: { verified: true, levels: ["Private labeling", "Custom bottle sizes"] },

    productReputation: {
      overallScore: 4.7,
      sourcesCount: 156,
      lastUpdated: "Feb 2026",
      summary: "Premium synthetic DOT 4 brake fluid receives strong ratings from automotive professionals. ISO 4925 Class 6 certification and reliable TÜV SÜD testing documentation instill confidence. Workshop customers demonstrate consistent preference for this formulation.",
      dimensions: [
        { label: "Product Quality", score: 4.8 },
        { label: "Value for Money", score: 4.6 },
        { label: "Accuracy of Description", score: 4.7 },
        { label: "Packaging Quality", score: 4.7 },
        { label: "Resale Performance", score: 4.7 },
      ],
      highlights: [
        "ISO 4925 Class 6 and FMVSS 116 certifications support regulatory compliance",
        "Excellent boiling point performance (dry 265°C, wet 175°C)",
        "Compatible with all DOT 3/4 and vehicle ABS/ESP systems",
        "Professional packaging and MSDS documentation included",
        "Strong preference among workshop and fleet customers",
      ],
      cautions: [
        "Hazmat shipping requirements increase logistics complexity",
        "Regulatory compliance necessary for international sales",
      ],
    },

    isBestseller: false, isNew: false, orderProtection: true, frequentlyBoughtTogether: [1, 3, 8],
    unitsSold: 180000, reorderRate: 78, categoryRanking: { rank: 2, category: "Brake Fluid — DOT 4" },
    viewCount: 22500, inquiryCount: 380,
    samplePrice: { amount: 0, currency: "€" }, testerOption: { available: true, price: 0, currency: "€", nonReturnable: false },
    sampleLeadTime: { min: 2, max: 5, unit: "days" },

    dateAdded: "20/04/2024", dealStatus: "active", launchDate: "2023-01-15", discontinuedDate: null,
    seasonality: "All Season", bestBeforeDate: "2030-12-31",
    grade: "New", productGrade: "Premium Synthetic", gradeNotes: null, gradeCategory: null,
    country: "DE", countryName: "Germany",

    attachments: [
      { name: "Material Safety Data Sheet (MSDS).pdf", size: "680 KB", type: "pdf" },
      { name: "ISO 4925 Test Report.pdf", size: "340 KB", type: "pdf" },
      { name: "TÜV SÜD Certificate.pdf", size: "220 KB", type: "pdf" },
    ],
    videoUrl: null,

    ecoFriendly: { materials: ["Recyclable HDPE bottle"], packaging: ["Recyclable cardboard case"], production: "ISO 14001 facility" },
    carbonFootprint: { value: 2.1, unit: "kg-CO2e", scope: "cradle-to-gate" },

    // ── Automotive-specific — exercises hazardSymbols, compatibleWith, modelCount ──
    hazardSymbols: ["GHS07"],
    compatibleWith: ["All DOT 3 systems", "All DOT 4 systems", "ABS", "ESP", "ASR", "VW", "BMW", "Mercedes-Benz", "Toyota", "Ford"],
    modelCount: 500,

    // ── Category nulls ──
    ingredients: "Polyethylene glycol ethers, borate esters, corrosion inhibitors. See MSDS for full composition.",
    allergens: null, dietaryTags: null,
    storageInstructions: "Store sealed in original container between 5–30°C. Keep away from moisture. Shelf life 5 years sealed.",
    shelfLife: "5 years",
    nutritionalInfo: null, organicCertification: null, kosherHalal: null, countryOfHarvest: null, abv: null, vintageYear: null,
    gmoDeclaration: null, storageTemperatureRange: { min: 5, max: 30, unit: "°C" },
    fabricComposition: null, gsm: null, careInstructions: null, fitType: null, sizeChart: null, gender: null, pattern: null,
    inciList: null, spfRating: null, skinType: null, paoMonths: null, crueltyFree: null, dermatologicallyTested: null,
    toleranceSpecs: null, pressureRating: { value: 1800, unit: "PSI" }, temperatureRange: { min: -40, max: 265, unit: "°C" }, threadType: "SAE J1703 compatible", materialGrade: "Full Synthetic DOT 4",
    sarValue: null, ipRating: null, energyRating: null, batteryInfo: null, powerSource: null, assemblyRequired: null,
    weeeClassification: null, reachSvhcDeclaration: { compliant: true, substances: [], declarationDate: "2025-03-01" },
    rohsCompliance: null,

    hazmatInfo: { isHazardous: true, unNumber: "UN1760", class: "8 (Corrosive)" },
    warrantyInfo: null, regionalCompliance: null, cpscCompliance: null, fdaRegistration: null,
    euResponsiblePerson: { name: "BremsKraft Chemie GmbH", address: "Hafenstraße 22, 20457 Hamburg, Germany", email: "reach@bremskraft.de" },

    ageRestriction: null, countryRestrictions: null, restrictionScope: null, restrictedContinents: null, freeReturns: false,
    productInsurance: { included: true, provider: "Allianz", coverage: "Transit damage up to €50,000 (hazmat rated)" },
    qualityInspection: { available: true, provider: "TÜV SÜD", type: "Annual production audit", cost: "Included" },
    authenticityGuarantee: null, dealReturnPolicy: null, warranty: null, functionalRate: null,

    imagesRepresentative: false, mayContainDuplicates: false, isManifested: null, sourceRetailers: null, stockOrigin: null,
    predominantSizes: null, hasOriginalLabels: true, labelCondition: "Original labels intact",

    weeksBestOffer: false, platformExclusive: false, promotionalBadge: null,
    lowStockWarning: null, firstOrderDiscount: null,

    exclusivityAvailable: false,
    whiteLabeling: { available: true, moq: 2000, leadTime: "4-6 weeks", setupFee: { amount: 350, currency: "€" } },
    sellToPrivate: false, exportOnly: false, exportRegions: null, invoiceType: "VAT", sanitizedInvoice: "On Request",
    importDutyCoverage: null,

    leadTimeTiers: [{ minQty: 120, maxQty: 1000, days: 7 }, { minQty: 1001, maxQty: 5000, days: 14 }, { minQty: 5001, maxQty: null, days: null, label: "To be negotiated" }],
    supplyAbility: { quantity: 100000, unit: "litres", period: "month" },

    searchKeywords: ["brake fluid wholesale", "DOT 4 bulk", "automotive chemicals wholesale", "brake fluid supplier", "ISO 4925 brake fluid"],
    metaTitle: "DOT 4 Brake Fluid 1L Full Synthetic — Automotive Wholesale | WholesaleUp",
    metaDescription: "Buy DOT 4 brake fluid wholesale from €3.80/bottle. 294% markup. ISO 4925 Class 6. MOQ 120 bottles.",
    productHighlights: ["ISO 4925 Class 6 and FMVSS 116 certified", "Dry boiling point 265°C, wet 175°C", "Compatible with all DOT 3/4, ABS, ESP systems", "Full MSDS and TÜV SÜD certification included", "Free samples for quality evaluation"],
    showroomAvailable: null,
    packagingFormat: "Cases of 12 bottles in cardboard cartons",
    offerValidityDays: 90,
    packageContents: "1× 1L sealed bottle of DOT 4 brake fluid",
    targetAudience: ["Auto parts distributors", "Workshops", "Fleet operators", "Motor factors", "Automotive retailers"],
    omnibusPrice: null, discountPercentage: null, originalPrice: null,
    sourceRetailers: null, gradeNotes: null, gradeCategory: null, exportRegions: null,
    stockOrigin: null, isManifested: null, lotRetailValue: null, functionalRate: null,
  },

};



/* Mock related deals */
export const RELATED_DEALS = [
  { title: "Sun Babies Kids 5 In 1 Sun Lotion Spf50 200 Ml", price: 3.51, rrp: 14.99, markup: 327.1, profit: 11.48, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop" },
  { title: "Ergobaby Omni 360 All-Position Babytrage", price: 30.10, rrp: 140.99, markup: 368.4, profit: 110.89, tags: ["New"], image: null },
  { title: "Owlet Dream Sock Fda Cleared Smart Baby Monitor", price: 99.89, rrp: 299.99, markup: 200.3, profit: 200.10, tags: ["New"], discountPercentage: 10, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
  { title: "Motorola VM4 EU Baby Monitor Connect", price: 32.63, rrp: 154.99, markup: 375.0, profit: 122.00, tags: ["New", "Dropship"], firstOrderDiscount: { percentage: 15, label: "-15% ON YOUR FIRST ORDER" }, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop" },
  { title: "Braun Series 9 Pro Electric Shaver SmartCare Center", price: 89.50, rrp: 349.99, markup: 291.1, profit: 260.49, tags: ["New"], image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop" },
  { title: "Dyson V8 Absolute Cordless Vacuum Cleaner Refurbished", price: 125.00, rrp: 399.99, markup: 220.0, profit: 274.99, tags: [], image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop" },
  { title: "JBL Flip 6 Portable Bluetooth Speaker Waterproof", price: 45.99, rrp: 129.99, markup: 182.7, profit: 84.00, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop" },
  { title: "Apple AirPods Pro 2nd Gen With MagSafe Charging Case", price: 145.00, rrp: 249.00, markup: 71.7, profit: 104.00, tags: ["New"], image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop" },
  { title: "Samsung Galaxy Buds2 Pro Wireless Earbuds Graphite", price: 62.00, rrp: 219.00, markup: 253.2, profit: 157.00, tags: ["New"], image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop" },
  { title: "Bose QuietComfort 45 Wireless Noise Cancelling Headphones", price: 110.00, rrp: 329.95, markup: 200.0, profit: 219.95, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
];

export const MOST_POPULAR_DEALS = [
  { title: "French Fry Cutter, Sopito Professional Potato Cutter Stainless Steel", price: 18.95, rrp: 59.99, markup: 201.8, profit: 41.04, tags: ["New"], image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop" },
  { title: "Lloytron 35w Classic Flexi Desk Lamp Silver", price: 18.95, rrp: 59.99, markup: 201.8, profit: 41.04, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=400&h=400&fit=crop" },
  { title: "Peace of the East Wood Effect Chinese Buddha Oil Burner", price: 18.95, rrp: 59.99, markup: 201.8, profit: 41.04, tags: ["New"], image: null },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: 18.95, rrp: 59.99, markup: 201.8, profit: 41.04, tags: ["Dropship"], discountPercentage: 10, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop" },
  { title: "Ninja Air Fryer Max XL 5.5 Qt Grey", price: 42.50, rrp: 119.99, markup: 182.3, profit: 77.49, tags: ["New", "Dropship"], firstOrderDiscount: { percentage: 15, label: "-15% ON YOUR FIRST ORDER" }, image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop" },
  { title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt", price: 29.99, rrp: 89.99, markup: 200.1, profit: 60.00, tags: ["New"], image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop" },
  { title: "Philips Sonicare ProtectiveClean 6100 Toothbrush", price: 35.00, rrp: 109.99, markup: 214.3, profit: 74.99, tags: ["New"], image: "https://images.unsplash.com/photo-1559591937-edc43f547c2c?w=400&h=400&fit=crop" },
  { title: "Ring Video Doorbell Pro 2 Smart WiFi 1536p HD", price: 55.00, rrp: 219.99, markup: 300.0, profit: 164.99, tags: ["New"], image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop" },
  { title: "Fitbit Charge 5 Advanced Health Fitness Tracker", price: 48.00, rrp: 139.99, markup: 191.7, profit: 91.99, tags: ["New", "Dropship"], image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop" },
  { title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", price: 155.00, rrp: 379.00, markup: 144.5, profit: 224.00, tags: ["New"], image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop" },
];
