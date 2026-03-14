/* ═══════════════════════════════════════════════════════════════════
   CANONICAL CATEGORY TREE — Single Source of Truth
   ═══════════════════════════════════════════════════════════════════
   Every component that needs categories should import from this file.
   DO NOT define categories inline anywhere else.

   PRODUCTION: When the database is live, this file becomes the
   seed reference + fallback. Components should fetch from
   GET /api/categories and fall back to this static tree.

   Structure: 13 L1 categories, ~101 L2 subcategories
   Target audience: shop retailers, eBay/Amazon sellers, market traders
   Last updated: 2026-03-08
   ═══════════════════════════════════════════════════════════════════ */

/**
 * @typedef {Object} Subcategory
 * @property {string} id    - URL-safe slug (e.g. "mens-clothing")
 * @property {string} label - Display name (e.g. "Men's Clothing")
 */

/**
 * @typedef {Object} Category
 * @property {string}        id    - URL-safe slug (e.g. "clothing-fashion")
 * @property {string}        name  - Display name (e.g. "Clothing & Fashion")
 * @property {string}        href  - Route path (e.g. "/deals/clothing-fashion")
 * @property {Subcategory[]} subs  - Level 2 subcategories
 */

/** @type {Category[]} */
export const CATEGORY_TREE = [
  {
    id: "clothing-fashion",
    name: "Clothing & Fashion",
    href: "/deals/clothing-fashion",
    subs: [
      { id: "mens-clothing", label: "Men's Clothing" },
      { id: "womens-clothing", label: "Women's Clothing" },
      { id: "childrens-clothing", label: "Children's Clothing" },
      { id: "sportswear-activewear", label: "Sportswear & Activewear" },
      { id: "footwear", label: "Footwear" },
      { id: "handbags-bags", label: "Handbags & Bags" },
      { id: "accessories", label: "Accessories" },
      { id: "underwear-nightwear", label: "Underwear & Nightwear" },
      { id: "workwear-uniforms", label: "Workwear & Uniforms" },
      { id: "maternity", label: "Maternity" },
      { id: "vintage-pre-owned", label: "Vintage & Pre-Owned" },
    ],
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    href: "/deals/health-beauty",
    subs: [
      { id: "skincare", label: "Skincare" },
      { id: "haircare", label: "Haircare" },
      { id: "makeup-cosmetics", label: "Makeup & Cosmetics" },
      { id: "fragrances-perfume", label: "Fragrances & Perfume" },
      { id: "personal-care-hygiene", label: "Personal Care & Hygiene" },
      { id: "supplements-vitamins", label: "Supplements & Vitamins" },
      { id: "mens-grooming", label: "Men's Grooming" },
      { id: "nail-care", label: "Nail Care" },
      { id: "medical-first-aid", label: "Medical & First Aid" },
    ],
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    href: "/deals/home-garden",
    subs: [
      { id: "furniture", label: "Furniture" },
      { id: "kitchen-dining", label: "Kitchen & Dining" },
      { id: "bedding-linen", label: "Bedding & Linen" },
      { id: "home-decor", label: "Home Decor" },
      { id: "garden-outdoor", label: "Garden & Outdoor" },
      { id: "lighting", label: "Lighting" },
      { id: "storage-organisation", label: "Storage & Organisation" },
      { id: "bathroom", label: "Bathroom" },
      { id: "cleaning-household", label: "Cleaning & Household" },
      { id: "diy-tools", label: "DIY & Tools" },
    ],
  },
  {
    id: "electronics-technology",
    name: "Electronics & Technology",
    href: "/deals/electronics-technology",
    subs: [
      { id: "smartphones-tablets", label: "Smartphones & Tablets" },
      { id: "laptops-computers", label: "Laptops & Computers" },
      { id: "tv-audio", label: "TV & Audio" },
      { id: "gaming-consoles", label: "Gaming & Consoles" },
      { id: "smart-home-wearables", label: "Smart Home & Wearables" },
      { id: "phone-accessories", label: "Phone Accessories" },
      { id: "computer-accessories", label: "Computer Accessories" },
      { id: "cameras-photography", label: "Cameras & Photography" },
      { id: "cables-chargers-batteries", label: "Cables, Chargers & Batteries" },
    ],
  },
  {
    id: "toys-games",
    name: "Toys & Games",
    href: "/deals/toys-games",
    subs: [
      { id: "action-figures-dolls", label: "Action Figures & Dolls" },
      { id: "building-sets-construction", label: "Building Sets & Construction" },
      { id: "board-games-puzzles", label: "Board Games & Puzzles" },
      { id: "outdoor-active-toys", label: "Outdoor & Active Toys" },
      { id: "arts-crafts", label: "Arts & Crafts" },
      { id: "educational-toys", label: "Educational Toys" },
      { id: "plush-soft-toys", label: "Plush & Soft Toys" },
      { id: "collectibles-trading-cards", label: "Collectibles & Trading Cards" },
    ],
  },
  {
    id: "gifts-seasonal",
    name: "Gifts & Seasonal",
    href: "/deals/gifts-seasonal",
    subs: [
      { id: "gift-sets-hampers", label: "Gift Sets & Hampers" },
      { id: "christmas-holiday", label: "Christmas & Holiday" },
      { id: "party-supplies", label: "Party Supplies" },
      { id: "stationery-greeting-cards", label: "Stationery & Greeting Cards" },
      { id: "candles-home-fragrance", label: "Candles & Home Fragrance" },
      { id: "novelty-gadgets", label: "Novelty & Gadgets" },
      { id: "books-media", label: "Books & Media" },
      { id: "wedding-occasions", label: "Wedding & Occasions" },
    ],
  },
  {
    id: "sports-outdoors",
    name: "Sports & Outdoors",
    href: "/deals/sports-outdoors",
    subs: [
      { id: "gym-fitness-equipment", label: "Gym & Fitness Equipment" },
      { id: "outdoor-water-sports", label: "Outdoor & Water Sports" },
      { id: "team-sports", label: "Team Sports" },
      { id: "cycling", label: "Cycling" },
      { id: "camping-hiking", label: "Camping & Hiking" },
      { id: "running-athletics", label: "Running & Athletics" },
      { id: "sports-accessories", label: "Sports Accessories" },
    ],
  },
  {
    id: "jewellery-watches",
    name: "Jewellery & Watches",
    href: "/deals/jewellery-watches",
    subs: [
      { id: "rings", label: "Rings" },
      { id: "necklaces-pendants", label: "Necklaces & Pendants" },
      { id: "watches", label: "Watches" },
      { id: "earrings", label: "Earrings" },
      { id: "bracelets-bangles", label: "Bracelets & Bangles" },
      { id: "costume-fashion-jewellery", label: "Costume & Fashion Jewellery" },
    ],
  },
  {
    id: "food-beverages",
    name: "Food & Beverages",
    href: "/deals/food-beverages",
    subs: [
      { id: "confectionery-chocolate", label: "Confectionery & Chocolate" },
      { id: "snacks-crisps", label: "Snacks & Crisps" },
      { id: "drinks-beverages", label: "Drinks & Beverages" },
      { id: "tea-coffee", label: "Tea & Coffee" },
      { id: "health-foods-free-from", label: "Health Foods & Free-From" },
      { id: "grocery-pantry", label: "Grocery & Pantry" },
      { id: "international-speciality", label: "International & Speciality" },
    ],
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    href: "/deals/pet-supplies",
    subs: [
      { id: "dog", label: "Dog" },
      { id: "cat", label: "Cat" },
      { id: "pet-food-treats", label: "Pet Food & Treats" },
      { id: "grooming-hygiene", label: "Grooming & Hygiene" },
      { id: "beds-bowls-accessories", label: "Beds, Bowls & Accessories" },
      { id: "small-animals-birds-fish", label: "Small Animals, Birds & Fish" },
    ],
  },
  {
    id: "baby-kids",
    name: "Baby & Kids",
    href: "/deals/baby-kids",
    subs: [
      { id: "baby-clothing-shoes", label: "Baby Clothing & Shoes" },
      { id: "feeding-nursing", label: "Feeding & Nursing" },
      { id: "pushchairs-car-seats", label: "Pushchairs & Car Seats" },
      { id: "nursery-furniture-bedding", label: "Nursery Furniture & Bedding" },
      { id: "safety-baby-proofing", label: "Safety & Baby Proofing" },
      { id: "nappies-changing", label: "Nappies & Changing" },
      { id: "kids-bags-lunch-boxes", label: "Kids' Bags & Lunch Boxes" },
    ],
  },
  {
    id: "surplus-clearance",
    name: "Surplus & Clearance",
    href: "/deals/surplus-clearance",
    subs: [
      { id: "mixed-pallets", label: "Mixed Pallets" },
      { id: "customer-returns", label: "Customer Returns" },
      { id: "end-of-line", label: "End of Line" },
      { id: "overstock-excess", label: "Overstock & Excess" },
      { id: "liquidation-seized-goods", label: "Liquidation & Seized Goods" },
      { id: "refurbished-graded", label: "Refurbished & Graded" },
    ],
  },
  {
    id: "automotive-parts",
    name: "Automotive & Parts",
    href: "/deals/automotive-parts",
    subs: [
      { id: "car-accessories", label: "Car Accessories" },
      { id: "car-electronics", label: "Car Electronics" },
      { id: "car-care-cleaning", label: "Car Care & Cleaning" },
      { id: "parts-components", label: "Parts & Components" },
      { id: "motorbike-scooter", label: "Motorbike & Scooter" },
      { id: "tools-garage-equipment", label: "Tools & Garage Equipment" },
      { id: "caravanning-towing", label: "Caravanning & Towing" },
    ],
  },
];

/* ─────────────── Derived Helpers ─────────────── */

/** Flat array of L1 category names — useful for newsletter checkboxes, select options, etc. */
export const CATEGORY_NAMES = CATEGORY_TREE.map((c) => c.name);

/** Flat array of L1 category IDs */
export const CATEGORY_IDS = CATEGORY_TREE.map((c) => c.id);

/**
 * Build PRODUCT_CATEGORY_TREE format for CategorySelector (form-fields.jsx).
 * Shape: [{ name: "Clothing & Fashion", subs: ["Men's Clothing", ...] }, ...]
 */
export const PRODUCT_CATEGORY_TREE = CATEGORY_TREE.map((c) => ({
  name: c.name,
  subs: c.subs.map((s) => s.label),
}));

/**
 * Simple deterministic hash for stable placeholder counts (avoids hydration mismatch).
 * @param {string} str
 * @returns {number}
 */
function stableHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Build filter-sidebar format with placeholder counts.
 * Shape: [{ id, label, count, children: [{ id, label, count }] }]
 * PRODUCTION: Replace counts with real data from GET /api/categories
 */
export const FILTER_CATEGORIES = CATEGORY_TREE.map((c) => ({
  id: c.id,
  label: c.name,
  count: c.subs.reduce((sum, s) => sum + 200 + (stableHash(s.id) % 1200), 0),
  children: c.subs.map((s) => ({
    id: `${c.id}--${s.id}`,
    label: s.label,
    count: 200 + (stableHash(s.id) % 1200),
  })),
}));

/**
 * Lookup a category by ID. Returns the category object or undefined.
 * @param {string} id
 * @returns {Category | undefined}
 */
export function getCategoryById(id) {
  return CATEGORY_TREE.find((c) => c.id === id);
}

/**
 * Lookup a subcategory across all categories.
 * @param {string} subId
 * @returns {{ category: Category, sub: Subcategory } | undefined}
 */
export function getSubcategoryById(subId) {
  for (const cat of CATEGORY_TREE) {
    const sub = cat.subs.find((s) => s.id === subId);
    if (sub) return { category: cat, sub };
  }
  return undefined;
}

/**
 * Lookup a category or subcategory by display name (case-insensitive).
 * Returns { categoryId, subcategoryId } for use in filter query params.
 * @param {string} name - Display name (e.g. "Electronics & Technology")
 * @returns {{ categoryId: string, subcategoryId?: string } | undefined}
 */
export function getCategoryByName(name) {
  const lower = name.toLowerCase();
  for (const cat of CATEGORY_TREE) {
    if (cat.name.toLowerCase() === lower) return { categoryId: cat.id };
    for (const sub of cat.subs) {
      if (sub.label.toLowerCase() === lower) return { categoryId: cat.id, subcategoryId: `${cat.id}--${sub.id}` };
    }
  }
  return undefined;
}
