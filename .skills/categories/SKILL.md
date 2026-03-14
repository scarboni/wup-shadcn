---
name: categories
description: |
  **WholesaleUp Category Tree**: Reference this skill whenever working on category navigation, breadcrumbs, category pages, category filters, deal categorisation, dropdown menus, URL slugs for categories, or any UI that involves the category hierarchy. Covers the canonical 2-level tree (13 L1 categories, ~101 L2 subcategories), URL slug conventions, breadcrumb structure, and the single source of truth file location. MANDATORY TRIGGERS: category, categories, breadcrumb, category tree, subcategory, category dropdown, category filter, category page, category navigation, category slug, deal category, product category
---

# WholesaleUp Category Tree

Single source of truth for the category hierarchy used across the entire platform.

## Source File

`src/lib/categories.js` — this is the canonical definition. Every component that needs categories must import from this file. Never define categories inline elsewhere.

## Structure

The tree has exactly **2 levels**: L1 (parent categories) and L2 (subcategories). There is no L3.

Breadcrumbs for a deal page should be: `WholesaleUp > L1 Name > L2 Label > Deal Title`

## Complete Category Tree

### 1. Clothing & Fashion
Slug: `clothing-fashion` | Route: `/categories/clothing-fashion`

Subcategories: Men's Clothing, Women's Clothing, Children's Clothing, Sportswear & Activewear, Footwear, Handbags & Bags, Accessories, Underwear & Nightwear, Workwear & Uniforms, Maternity, Vintage & Pre-Owned

### 2. Health & Beauty
Slug: `health-beauty` | Route: `/categories/health-beauty`

Subcategories: Skincare, Haircare, Makeup & Cosmetics, Fragrances & Perfume, Personal Care & Hygiene, Supplements & Vitamins, Men's Grooming, Nail Care, Medical & First Aid

### 3. Home & Garden
Slug: `home-garden` | Route: `/categories/home-garden`

Subcategories: Furniture, Kitchen & Dining, Bedding & Linen, Home Decor, Garden & Outdoor, Lighting, Storage & Organisation, Bathroom, Cleaning & Household, DIY & Tools

### 4. Electronics & Technology
Slug: `electronics-technology` | Route: `/categories/electronics-technology`

Subcategories: Smartphones & Tablets, Laptops & Computers, TV & Audio, Gaming & Consoles, Smart Home & Wearables, Phone Accessories, Computer Accessories, Cameras & Photography, Cables, Chargers & Batteries

### 5. Toys & Games
Slug: `toys-games` | Route: `/categories/toys-games`

Subcategories: Action Figures & Dolls, Building Sets & Construction, Board Games & Puzzles, Outdoor & Active Toys, Arts & Crafts, Educational Toys, Plush & Soft Toys, Collectibles & Trading Cards

### 6. Gifts & Seasonal
Slug: `gifts-seasonal` | Route: `/categories/gifts-seasonal`

Subcategories: Gift Sets & Hampers, Christmas & Holiday, Party Supplies, Stationery & Greeting Cards, Candles & Home Fragrance, Novelty & Gadgets, Books & Media, Wedding & Occasions

### 7. Sports & Outdoors
Slug: `sports-outdoors` | Route: `/categories/sports-outdoors`

Subcategories: Gym & Fitness Equipment, Outdoor & Water Sports, Team Sports, Cycling, Camping & Hiking, Running & Athletics, Sports Accessories

### 8. Jewellery & Watches
Slug: `jewellery-watches` | Route: `/categories/jewellery-watches`

Subcategories: Rings, Necklaces & Pendants, Watches, Earrings, Bracelets & Bangles, Costume & Fashion Jewellery

### 9. Food & Beverages
Slug: `food-beverages` | Route: `/categories/food-beverages`

Subcategories: Confectionery & Chocolate, Snacks & Crisps, Drinks & Beverages, Tea & Coffee, Health Foods & Free-From, Grocery & Pantry, International & Speciality

### 10. Pet Supplies
Slug: `pet-supplies` | Route: `/categories/pet-supplies`

Subcategories: Dog, Cat, Pet Food & Treats, Grooming & Hygiene, Beds, Bowls & Accessories, Small Animals, Birds & Fish

### 11. Baby & Kids
Slug: `baby-kids` | Route: `/categories/baby-kids`

Subcategories: Baby Clothing & Shoes, Feeding & Nursing, Pushchairs & Car Seats, Nursery Furniture & Bedding, Safety & Baby Proofing, Nappies & Changing, Kids' Bags & Lunch Boxes

### 12. Surplus & Clearance
Slug: `surplus-clearance` | Route: `/categories/surplus-clearance`

Subcategories: Mixed Pallets, Customer Returns, End of Line, Overstock & Excess, Liquidation & Seized Goods, Refurbished & Graded

### 13. Automotive & Parts
Slug: `automotive-parts` | Route: `/categories/automotive-parts`

Subcategories: Car Accessories, Car Electronics, Car Care & Cleaning, Parts & Components, Motorbike & Scooter, Tools & Garage Equipment, Caravanning & Towing

## URL Conventions

L1 routes: `/categories/{l1-slug}` (e.g. `/categories/electronics-technology`)
L2 slugs: `{l2-slug}` (e.g. `smart-home-wearables`)
Combined filter: `/categories/{l1-slug}?sub={l2-slug}`

## Breadcrumb Rules

Deal page breadcrumbs must use exactly the L1 `name` and L2 `label` from the canonical tree. The `category` field on a deal must match an L1 `name` exactly. The `categoryBreadcrumb` array must be `[L1 name, L2 label]` — never include L3+ levels that don't exist in the tree.

## Derived Helpers (from categories.js)

- `CATEGORY_TREE` — full tree array
- `CATEGORY_NAMES` — flat array of L1 display names
- `CATEGORY_IDS` — flat array of L1 slugs
- `PRODUCT_CATEGORY_TREE` — format for CategorySelector form component
- `FILTER_CATEGORIES` — format for filter sidebar with placeholder counts
- `getCategoryById(id)` — lookup L1 by slug
- `getSubcategoryById(subId)` — lookup L2 across all categories

## Target Audience

The category tree is designed for WholesaleUp's target audience: UK shop retailers, eBay/Amazon sellers, and market traders.
