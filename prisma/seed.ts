/* ═══════════════════════════════════════════════════════════════
   WholesaleUp — Database Seed Script
   ═══════════════════════════════════════════════════════════════
   Run: npx prisma db seed

   This script populates the database with initial data extracted
   from the hardcoded arrays in component files. Each seed function
   is cross-referenced with the component + array it replaces:

   ┌─────────────────────┬─────────────────────────────┬────────────────────────┐
   │ Seed Function        │ Component Source             │ Replaces Array         │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedCategories()     │ homepage.jsx :82             │ CATEGORIES             │
   │                      │ categories.jsx :62           │ ALL_CATEGORIES         │
   │                      │ filters.jsx :57              │ CATEGORIES             │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedSuppliers()      │ homepage.jsx :149            │ SUPPLIERS              │
   │                      │ suppliers.jsx :173           │ SUPPLIERS              │
   │                      │ supplier-profile.jsx :59     │ SUPPLIER               │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedDeals()          │ homepage.jsx :99             │ SIMPLE_DEALS           │
   │                      │ homepage.jsx :118            │ DETAILED_DEALS         │
   │                      │ deal-cards.jsx :58           │ PRODUCTS               │
   │                      │ single-deal.jsx :71          │ DEAL                   │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedTestimonials()   │ homepage.jsx :175            │ TESTIMONIALS           │
   │                      │ register.jsx :84             │ TESTIMONIALS           │
   │                      │ auth-modal.jsx :82           │ TESTIMONIALS           │
   │                      │ pricing.jsx :106             │ TESTIMONIALS           │
   │                      │ deal-cards.jsx :990          │ testimonials            │
   │                      │ suppliers.jsx :1382          │ testimonials            │
   │                      │ single-deal.jsx :1216        │ testimonials            │
   │                      │ supplier-profile.jsx :786    │ testimonials            │
   │                      │ testimonials-data.js :7      │ ALL_TESTIMONIALS        │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedPricingPlans()   │ pricing.jsx :40              │ PRICING                │
   ├─────────────────────┼─────────────────────────────┼────────────────────────┤
   │ seedPlatformStats()  │ homepage.jsx :1051           │ stats                  │
   │                      │ register.jsx :103            │ STATS                  │
   │                      │ auth-modal.jsx :93           │ STATS                  │
   │                      │ categories.jsx :344          │ HERO_STATS             │
   │                      │ testimonials.jsx :31         │ STATS                  │
   │                      │ deal-cards.jsx :984          │ stats                  │
   │                      │ suppliers.jsx :1376          │ stats                  │
   │                      │ single-deal.jsx :1210        │ stats                  │
   │                      │ supplier-profile.jsx :780    │ stats                  │
   └─────────────────────┴─────────────────────────────┴────────────────────────┘

   After seeding, each component's hardcoded array can be replaced
   with an API call. Look for "SEED:" comments in component files.
   ═══════════════════════════════════════════════════════════════ */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ─────────────────────────────────────────────────────────────
   1. CATEGORIES
   Source: homepage.jsx CATEGORIES, categories.jsx ALL_CATEGORIES
   Target: Category model → GET /api/categories
   ───────────────────────────────────────────────────────────── */
async function seedCategories() {
  const categories = [
    { name: "Baby Products", slug: "baby-products", icon: "Baby", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop", sortOrder: 1 },
    { name: "Clothing", slug: "clothing", icon: "Shirt", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop", sortOrder: 2 },
    { name: "Computing", slug: "computing", icon: "Monitor", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop", sortOrder: 3 },
    { name: "Consumer Electronics", slug: "consumer-electronic", icon: "Tv", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", sortOrder: 4 },
    { name: "Health & Beauty", slug: "health-beauty", icon: "Sparkles", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop", sortOrder: 5 },
    { name: "Home & Garden", slug: "home-garden", icon: "Flower2", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", sortOrder: 6 },
    { name: "Jewellery & Watches", slug: "jewellery-watches", icon: "Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop", sortOrder: 7 },
    { name: "Leisure & Entertainment", slug: "leisure-entertainment", icon: "Gamepad2", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop", sortOrder: 8 },
    { name: "Mobile & Home Phones", slug: "mobile-phones", icon: "Smartphone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", sortOrder: 9 },
    { name: "Office & Business", slug: "office-business", icon: "Briefcase", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", sortOrder: 10 },
    { name: "Police Auctions & Auction Houses", slug: "police-auctions", icon: "Gavel", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop", sortOrder: 11 },
    { name: "Sports & Fitness", slug: "sports-fitness", icon: "Dumbbell", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop", sortOrder: 12 },
    { name: "Surplus & Stocklots", slug: "surplus-stocklots", icon: "Boxes", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=300&fit=crop", sortOrder: 13 },
    { name: "Toys & Games", slug: "toys-games", icon: "Gamepad2", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop", sortOrder: 14 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`✓ Seeded ${categories.length} categories`);
}

/* ─────────────────────────────────────────────────────────────
   2. SUPPLIERS
   Source: homepage.jsx SUPPLIERS, suppliers.jsx SUPPLIERS,
          supplier-profile.jsx SUPPLIER
   Target: Supplier model → GET /api/suppliers
   ───────────────────────────────────────────────────────────── */
async function seedSuppliers() {
  const suppliers = [
    {
      name: "Trainers and Sportswear Supplier",
      slug: "trainers-sportswear-supplier",
      description: "We are a wholesaler of sportswear clothing and shoes. We offer high quality of adidas originals men's sports footwear, Nike air max and other trainer brands at competitive wholesale prices. Our range includes the latest seasonal collections, classic retro styles, and limited edition releases sourced directly from authorised distributors.",
      country: "GB", city: "London",
      phone: "+4402081234567", email: "contact@trainers-wholesale.co.uk", website: "www.trainers-wholesale.co.uk",
      verified: true, rating: 5.0, reviewCount: 42, established: 2016,
      minOrder: "10 pairs", leadTime: "3-5 days",
    },
    {
      name: "Basketball Sport Supplier",
      slug: "basketball-sport-supplier",
      description: "Premium sports equipment and apparel supplier specializing in basketball gear, training equipment, team uniforms and branded athletic footwear for retailers across the UK.",
      country: "GB", city: "London",
      phone: "+4402089876543", email: "info@basketball-sport.co.uk", website: "www.basketball-sport.co.uk",
      verified: true, rating: 5.0, reviewCount: 31, established: 2018,
      minOrder: "£500", leadTime: "3-5 days",
    },
    {
      name: "Electronics Direct Wholesale",
      slug: "electronics-direct-wholesale",
      description: "Leading European electronics wholesaler offering consumer electronics, accessories, and smart home products at competitive prices to retailers and resellers.",
      country: "DE", city: "Berlin",
      phone: "+4930123456", email: "sales@electronics-direct.de", website: "www.electronics-direct.de",
      verified: true, rating: 4.8, reviewCount: 127, established: 2012,
      minOrder: "€1,000", leadTime: "2-4 days",
    },
    {
      name: "Home & Garden Essentials",
      slug: "home-garden-essentials",
      description: "Quality home supplies, garden tools, and decor items from trusted European manufacturers. Low MOQ available for new retailers.",
      country: "NL", city: "Amsterdam",
      phone: "+3120654321", email: "info@home-garden.nl", website: "www.home-garden.nl",
      verified: false, rating: 4.7, reviewCount: 18, established: 2019,
      minOrder: "€200", leadTime: "5-7 days",
    },
    {
      name: "Beauty Box Wholesale",
      slug: "beauty-box-wholesale",
      description: "Specialist beauty and cosmetics wholesaler stocking leading brands including L'Oréal, Maybelline, NYX, Revolution, and The Ordinary.",
      country: "GB", city: "London",
      phone: "+4402071234567", email: "wholesale@beautybox.co.uk", website: "www.beautybox.co.uk",
      verified: true, rating: 4.9, reviewCount: 89, established: 2017,
      minOrder: "£100", leadTime: "1-3 days",
    },
    {
      name: "Global Toy Distributors",
      slug: "global-toy-distributors",
      description: "Large range of toys, games and novelty items from top brands. Competitive pricing with fast worldwide shipping available.",
      country: "US", city: "New York",
      phone: "+12125551234", email: "orders@globaltoys.com", website: "www.globaltoys.com",
      verified: true, rating: 4.6, reviewCount: 64, established: 2014,
      minOrder: "50 units", leadTime: "5-10 days",
    },
    {
      name: "Nordic Fashion Outlet",
      slug: "nordic-fashion-outlet",
      description: "Scandinavian fashion wholesaler offering premium clothing, footwear and accessories at below-market prices for fashion retailers.",
      country: "SE", city: "Stockholm",
      phone: "+46812345678", email: "sales@nordicfashion.se", website: "www.nordicfashion.se",
      verified: true, rating: 4.8, reviewCount: 36, established: 2020,
      minOrder: "€300", leadTime: "3-7 days",
    },
    {
      name: "AutoParts Direct Europe",
      slug: "autoparts-direct-europe",
      description: "Automotive parts and accessories wholesaler with over 50,000 SKUs. OEM and aftermarket parts available for European vehicles.",
      country: "DE", city: "Munich",
      phone: "+4930987654", email: "parts@autoparts-direct.de", website: "www.autoparts-direct.de",
      verified: true, rating: 4.5, reviewCount: 203, established: 2009,
      minOrder: "€500", leadTime: "1-3 days",
    },
    {
      name: "Casual & Everyday Clothing Wholesaler",
      slug: "casual-everyday-clothing",
      description: "Wholesale clothing supplier specializing in casual and everyday wear. We supply independent retailers and online stores with quality branded and unbranded clothing.",
      country: "GB", city: "Manchester",
      phone: "+4401611234567", email: "info@casual-clothing.co.uk", website: "www.casual-clothing.co.uk",
      verified: true, rating: 4.8, reviewCount: 127, established: 2018,
      minOrder: "£250", leadTime: "2-5 days",
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { slug: supplier.slug },
      update: supplier,
      create: supplier,
    });
  }
  console.log(`✓ Seeded ${suppliers.length} suppliers`);
}

/* ─────────────────────────────────────────────────────────────
   3. SUPPLIER → CATEGORY LINKS
   Wires up many-to-many relationships after both are seeded.
   ───────────────────────────────────────────────────────────── */
async function seedSupplierCategories() {
  const links: { supplierSlug: string; categorySlugs: string[] }[] = [
    { supplierSlug: "trainers-sportswear-supplier", categorySlugs: ["sports-fitness", "clothing"] },
    { supplierSlug: "basketball-sport-supplier", categorySlugs: ["sports-fitness", "clothing"] },
    { supplierSlug: "electronics-direct-wholesale", categorySlugs: ["consumer-electronic", "computing", "mobile-phones"] },
    { supplierSlug: "home-garden-essentials", categorySlugs: ["home-garden"] },
    { supplierSlug: "beauty-box-wholesale", categorySlugs: ["health-beauty"] },
    { supplierSlug: "global-toy-distributors", categorySlugs: ["toys-games"] },
    { supplierSlug: "nordic-fashion-outlet", categorySlugs: ["clothing"] },
    { supplierSlug: "autoparts-direct-europe", categorySlugs: ["surplus-stocklots"] },
    { supplierSlug: "casual-everyday-clothing", categorySlugs: ["clothing"] },
  ];

  let count = 0;
  for (const { supplierSlug, categorySlugs } of links) {
    const supplier = await prisma.supplier.findUnique({ where: { slug: supplierSlug } });
    if (!supplier) continue;
    for (const catSlug of categorySlugs) {
      const category = await prisma.category.findUnique({ where: { slug: catSlug } });
      if (!category) continue;
      await prisma.supplierCategory.upsert({
        where: { supplierId_categoryId: { supplierId: supplier.id, categoryId: category.id } },
        update: {},
        create: { supplierId: supplier.id, categoryId: category.id },
      });
      count++;
    }
  }
  console.log(`✓ Seeded ${count} supplier–category links`);
}

/* ─────────────────────────────────────────────────────────────
   4. DEALS
   Source: homepage.jsx SIMPLE_DEALS + DETAILED_DEALS,
          deal-cards.jsx PRODUCTS, single-deal.jsx DEAL
   Target: Deal model → GET /api/deals
   ───────────────────────────────────────────────────────────── */
async function seedDeals() {
  // Get first supplier for FK reference
  const supplier = await prisma.supplier.findFirst({ where: { verified: true } });
  if (!supplier) { console.log("⚠ No supplier found — skipping deals"); return; }

  const deals = [
    { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", slug: "sony-xperia-l1-black", price: "£18.95", priceValue: 18.95, rrp: "£59.99", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop", country: "GB", moq: "12 units", featured: true },
    { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", slug: "nepalese-moon-bowl-13cm", price: "£18.95", priceValue: 18.95, rrp: "£59.99", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop", country: "GB" },
    { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", slug: "lloytron-indoor-antenna", price: "£18.95", priceValue: 18.95, rrp: "£59.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop", country: "GB", discount: "10% off" },
    { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", slug: "oral-b-vitality-pro", price: "£24.50", priceValue: 24.50, rrp: "£79.99", country: "GB", moq: "24 units", featured: true },
    { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", slug: "adidas-ice-dive-gift-set", price: "£12.80", priceValue: 12.80, rrp: "£39.99", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop", country: "GB" },
    { title: "Samsung Galaxy Buds FE Wireless Earbuds", slug: "samsung-galaxy-buds-fe", price: "£32.99", priceValue: 32.99, rrp: "£99.99", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop", country: "GB" },
    { title: "JBL Tune 510BT Wireless On-Ear Headphones Black", slug: "jbl-tune-510bt-black", price: "£15.50", priceValue: 15.50, rrp: "£49.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", country: "GB" },
    { title: "Braun Series 3 ProSkin 3010s Electric Shaver", slug: "braun-series-3-proskin", price: "£22.75", priceValue: 22.75, rrp: "£69.99", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop", country: "GB" },
    { title: "Dyson V8 Animal Cordless Vacuum Cleaner Refurb", slug: "dyson-v8-animal-refurb", price: "£89.99", priceValue: 89.99, rrp: "£249.99", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop", country: "GB", featured: true },
    { title: "Nike Air Max 90 Essential White/Black Mens", slug: "nike-air-max-90-essential", price: "£42.50", priceValue: 42.50, rrp: "£129.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", country: "GB", discount: "10% off" },
    { title: "Philips Sonicare ProtectiveClean 4100 Toothbrush", slug: "philips-sonicare-4100", price: "£19.95", priceValue: 19.95, rrp: "£59.99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop", country: "GB" },
    { title: "Canon PIXMA TS3350 All-in-One Inkjet Printer", slug: "canon-pixma-ts3350", price: "£27.80", priceValue: 27.80, rrp: "£79.99", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop", country: "GB" },
    { title: "Logitech MX Master 3S Wireless Mouse Graphite", slug: "logitech-mx-master-3s", price: "£38.99", priceValue: 38.99, rrp: "£109.99", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop", country: "DE" },
    { title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L", slug: "instant-pot-duo-6l", price: "£34.50", priceValue: 34.50, rrp: "£89.99", image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=400&h=300&fit=crop", country: "GB" },
    { title: "Apple AirPods 2nd Gen with Charging Case Refurb", slug: "apple-airpods-2nd-gen-refurb", price: "£54.99", priceValue: 54.99, rrp: "£139.99", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop", country: "US", premium: true },
    { title: "Midnight Chronometer – Crafted Precision for Timeless Elegance", slug: "midnight-chronometer", price: "£145.00", priceValue: 145.00, rrp: "£499.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&h=800&fit=crop"], country: "GB", featured: true, premium: true },
  ];

  for (const deal of deals) {
    await prisma.deal.upsert({
      where: { slug: deal.slug },
      update: { ...deal, supplierId: supplier.id },
      create: { ...deal, supplierId: supplier.id },
    });
  }
  console.log(`✓ Seeded ${deals.length} deals`);
}

/* ─────────────────────────────────────────────────────────────
   5. TESTIMONIALS
   Source: homepage.jsx, register.jsx, auth-modal.jsx,
          pricing.jsx, deal-cards.jsx, suppliers.jsx,
          single-deal.jsx, supplier-profile.jsx
   Target: Testimonial model → GET /api/testimonials
   ───────────────────────────────────────────────────────────── */
async function seedTestimonials() {
  const testimonials = [
    { name: "Rena Harvey", role: "Online Retailer", content: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", rating: 5, featured: true },
    { name: "Thu Huong Do", role: "Dropshipper", content: "Very pleased with the service, suppliers and dropshippers. I have just upgraded to combo for the new month. Thank you.", rating: 5, featured: true },
    { name: "Alex Elliott", role: "Online Reseller", content: "Absolutely fantastic, it's a great service and am really glad I found it. I fully recommend it and use it regularly.", rating: 5, featured: true },
    { name: "James Richardson", role: "Amazon FBA Seller", content: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", rating: 5 },
    { name: "Maria Gonzalez", role: "eBay Power Seller", content: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", rating: 5 },
    { name: "Oliver Schmitt", role: "New Reseller", content: "As a newcomer to reselling, I was overwhelmed. The platform made it so easy to find verified suppliers and profitable deals from day one.", rating: 5 },
    { name: "Sarah Jenkins", role: "Deal Hunter", content: "The deal tracker alone is worth the subscription. I get notified the moment a new deal matches my criteria. It's like having a personal buyer.", rating: 5 },
    { name: "David Chen", role: "Multi-Store Owner", content: "I run three Amazon stores and WholesaleUp is my go-to source for all of them. The variety of suppliers and product categories is unmatched.", rating: 5 },
    { name: "Fatima Al-Hassan", role: "Wholesale Buyer", content: "Customer support is top notch. Had an issue with a supplier and the team stepped in and resolved it within a day. Very impressed.", rating: 5 },
    { name: "Patrick O'Brien", role: "Online Retailer", content: "Upgraded to Premium last month and it's already paid for itself ten times over. The exclusive deals section is a goldmine.", rating: 5 },
    { name: "Yuki Tanaka", role: "Online Retailer", content: "The profit calculators and market analysis tools help me make smarter buying decisions. My return rate has dropped significantly.", rating: 5 },
    { name: "Lisa Bergström", role: "Quality-Focused Buyer", content: "What sets WholesaleUp apart is the quality of suppliers. Every one I've contacted has been professional and delivered on time.", rating: 5 },
    { name: "Hassan Ahmed", role: "Wholesale Reseller", content: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", rating: 5, featured: true },
    { name: "Sophie Laurent", role: "Boutique Owner", content: "The verified supplier badges give me confidence I'm dealing with legitimate businesses. No more wasted time on dodgy leads.", rating: 5 },
    { name: "Tom Eriksson", role: "Dropshipper", content: "Switched from Alibaba six months ago. Better suppliers, faster shipping, and the customer support actually responds.", rating: 5 },
    { name: "Priya Sharma", role: "Shopify Store Owner", content: "My profit margins went from 15% to 40% after finding niche suppliers here that I couldn't find anywhere else.", rating: 5 },
    { name: "Luca Romano", role: "Wholesale Buyer", content: "The deal alerts feature alone is worth the subscription. I've snagged three bulk deals this month before they sold out.", rating: 5 },
    { name: "Rachel Okonkwo", role: "Dropship Entrepreneur", content: "As a dropshipper, having access to suppliers who actually hold UK stock has transformed my delivery times. Customers love it.", rating: 5 },
    { name: "Klaus Weber", role: "E-commerce Manager", content: "The platform makes it incredibly easy to compare suppliers side by side. Saved me thousands in my first quarter.", rating: 5 },
    { name: "Brian Lawson", role: "Electronics Reseller", content: "Flash sales section is brilliant. Got £8K of electronics stock for £4.2K. Incredible margins.", rating: 5 },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await prisma.testimonial.upsert({
      where: { id: `seed-testimonial-${i}` },
      update: { ...t, sortOrder: i },
      create: { id: `seed-testimonial-${i}`, ...t, sortOrder: i },
    });
  }
  console.log(`✓ Seeded ${testimonials.length} testimonials`);
}

/* ─────────────────────────────────────────────────────────────
   6. PRICING PLANS
   Source: pricing.jsx PRICING
   Target: PricingPlan model → GET /api/pricing
   ───────────────────────────────────────────────────────────── */
async function seedPricingPlans() {
  const plans = [
    { name: "standard-1m", displayName: "Standard", price: "£25/mo", priceValue: 25, period: "1-month", features: ["Access to Verified UK & EU Wholesale Suppliers", "Browse Today's Latest Wholesale Deals", "Advanced Deal Tracker & Alerts", "Weekly Newsletter With Latest Offers"], sortOrder: 1 },
    { name: "premium-1m", displayName: "Premium", price: "£60/mo", priceValue: 60, period: "1-month", features: ["Everything in Standard", "Priority Access to New Deals", "Exclusive Premium-Only Deals", "Advanced Profit Calculator", "Dedicated Account Manager"], highlighted: true, sortOrder: 2 },
    { name: "premium-plus-1m", displayName: "Premium+", price: "£100/mo", priceValue: 100, period: "1-month", features: ["Everything in Premium", "Custom Sourcing Requests", "Daily Newsletter With the Latest Offers", "Exclusive Member Discounts", "Unlimited Custom Sourcing Support Guarantee"], sortOrder: 3 },
    { name: "standard-6m", displayName: "Standard", price: "£120/6mo", priceValue: 120, period: "6-months", features: ["Access to Verified UK & EU Wholesale Suppliers", "Browse Today's Latest Wholesale Deals", "Advanced Deal Tracker & Alerts", "Weekly Newsletter With Latest Offers"], sortOrder: 4 },
    { name: "premium-6m", displayName: "Premium", price: "£300/6mo", priceValue: 300, period: "6-months", features: ["Everything in Standard", "Priority Access to New Deals", "Exclusive Premium-Only Deals", "Advanced Profit Calculator", "Dedicated Account Manager"], highlighted: true, sortOrder: 5 },
    { name: "premium-plus-6m", displayName: "Premium+", price: "£500/6mo", priceValue: 500, period: "6-months", features: ["Everything in Premium", "Custom Sourcing Requests", "Daily Newsletter With the Latest Offers", "Exclusive Member Discounts", "Unlimited Custom Sourcing Support Guarantee"], sortOrder: 6 },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }
  console.log(`✓ Seeded ${plans.length} pricing plans`);
}

/* ─────────────────────────────────────────────────────────────
   7. PLATFORM STATS
   Source: homepage.jsx stats, register.jsx STATS,
          auth-modal.jsx STATS, categories.jsx HERO_STATS,
          testimonials.jsx STATS, + TrustSection in 4 files
   Target: PlatformStat model → GET /api/stats
   ───────────────────────────────────────────────────────────── */
async function seedPlatformStats() {
  const stats = [
    { key: "suppliers", value: 42900 },
    { key: "deals", value: 14891 },
    { key: "members", value: 901900 },
    { key: "countries", value: 160 },
    { key: "new_suppliers_7d", value: 300 },
    { key: "avg_markup_pct", value: 367 },     // 366.61% → 367
    { key: "satisfaction_pct", value: 99 },     // 99.2%
  ];

  for (const stat of stats) {
    await prisma.platformStat.upsert({
      where: { key: stat.key },
      update: { value: stat.value },
      create: stat,
    });
  }
  console.log(`✓ Seeded ${stats.length} platform stats`);
}

/* ─────────────────────────────────────────────────────────────
   MAIN — runs all seeders in dependency order
   ───────────────────────────────────────────────────────────── */
async function main() {
  console.log("🌱 Seeding WholesaleUp database...\n");

  await seedCategories();
  await seedSuppliers();
  await seedSupplierCategories();
  await seedDeals();
  await seedTestimonials();
  await seedPricingPlans();
  await seedPlatformStats();

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
