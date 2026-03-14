"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  Flame,
  BadgeCheck,
  Globe,
  ThumbsUp,
  Phone,
  Mail,
  Eye,
  Package,
  TrendingUp,
  Shirt,
  Home as HomeIcon,
  Watch,
  Sparkles,
  Flower2,
  Gamepad2,
  Gift,
  HelpCircle,
  Truck,
  Lock,
  Rocket,
  X,
  Baby,
  Dumbbell,
  EyeOff,
  Boxes,
  Tv,
  MessageSquare,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  ShoppingCart,
  Store,
  Star,
  ImageOff,
  UtensilsCrossed,
  PawPrint,
  Car,
  Crown,
  CheckCircle2,
  Handshake,
} from "lucide-react";
import { CATEGORY_TREE } from "@/lib/categories";
import CtaBanner from "@/components/shared/cta-banner";
import StarRating from "@/components/shared/star-rating";
import VerifiedBadge from "@/components/shared/verified-badge";
import ContactSupplierModal from "@/components/shared/contact-modal";
import DotWorldMap from "@/components/shared/dot-world-map";
import WebsiteLink from "@/components/shared/website-link";

/* ─── No-image placeholder — carton box icon ─── */
function NoImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <Package size={56} className="text-slate-200" />
    </div>
  );
}

/* ═══════ PLACEHOLDER DATA (H1, H2) ═══════════════════════════
   PRODUCTION: Replace these arrays with data from API endpoints:
   - CATEGORIES    → GET /api/categories   (returns categories with counts)
   - SIMPLE_DEALS  → GET /api/deals?view=simple&limit=16
   - DETAILED_DEALS→ GET /api/deals?view=detailed&limit=12
   - SUPPLIERS     → GET /api/suppliers?limit=8&verified=true
   - COUNTRIES     → derive from suppliers' countryCode field
   - TESTIMONIALS  → GET /api/testimonials?limit=12
   - FAQS          → static (no API needed) or CMS-driven

   SEED: prisma/seed.ts → seedCategories(), seedDeals(),
         seedSuppliers(), seedTestimonials(), seedPlatformStats()

   Use SWR or React Query for client-side fetching with stale-while-revalidate.
   Example:
     const { data: categories } = useSWR("/api/categories", fetcher);
   ═══════════════════════════════════════════════════════════════ */
const CATEGORY_ICONS = {
  "clothing-fashion": Shirt,
  "health-beauty": Sparkles,
  "home-garden": Flower2,
  "electronics-technology": Tv,
  "toys-games": Gamepad2,
  "gifts-seasonal": Gift,
  "sports-outdoors": Dumbbell,
  "jewellery-watches": Watch,
  "food-beverages": UtensilsCrossed,
  "pet-supplies": PawPrint,
  "baby-kids": Baby,
  "surplus-clearance": Boxes,
  "automotive-parts": Car,
};

const CATEGORIES = CATEGORY_TREE.map((cat) => ({
  name: cat.name,
  icon: CATEGORY_ICONS[cat.id] || Package,
  href: cat.href,
  count: cat.subs.length * 15 + 10, // placeholder — PRODUCTION: from API
}));

const SIMPLE_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: 18.95, dateAdded: "19/09/2023", firstOrderDiscount: { percentage: 15, label: "-15% ON YOUR FIRST ORDER" }, negotiable: true, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: 18.95, dateAdded: "19/09/2023", discountPercentage: 15, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: 18.95, dateAdded: "19/09/2023", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: 24.50, dateAdded: "20/09/2023", negotiable: true, image: null },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: 12.80, dateAdded: "21/09/2023", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop" },
  { title: "Samsung Galaxy Buds FE Wireless Earbuds", price: 32.99, dateAdded: "22/09/2023", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop" },
  { title: "JBL Tune 510BT Wireless On-Ear Headphones Black", price: 15.50, dateAdded: "23/09/2023", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { title: "Braun Series 3 ProSkin 3010s Electric Shaver", price: 22.75, dateAdded: "23/09/2023", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop" },
  { title: "Dyson V8 Animal Cordless Vacuum Cleaner Refurb", price: 89.99, dateAdded: "24/09/2023", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop" },
  { title: "Nike Air Max 90 Essential White/Black Mens", price: 42.50, dateAdded: "24/09/2023", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" },
  { title: "Philips Sonicare ProtectiveClean 4100 Toothbrush", price: 19.95, dateAdded: "25/09/2023", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" },
  { title: "Canon PIXMA TS3350 All-in-One Inkjet Printer", price: 27.80, dateAdded: "25/09/2023", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop" },
  { title: "Logitech MX Master 3S Wireless Mouse Graphite", price: 38.99, dateAdded: "26/09/2023", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop" },
  { title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L", price: 34.50, dateAdded: "26/09/2023", image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=300&h=300&fit=crop" },
  { title: "Apple AirPods 2nd Gen with Charging Case Refurb", price: 54.99, dateAdded: "27/09/2023", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop" },
  { title: "Tefal ActiFry Genius XL 2in1 Air Fryer 1.7kg", price: 62.50, dateAdded: "27/09/2023", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop" },
];

const DETAILED_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: 18.95, rrp: 59.99, markup: 201.8, profit: 16.95, tags: ["New"], isSupplierPro: true, negotiable: true, image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: 18.95, rrp: 59.99, markup: 201.8, profit: 16.95, tags: ["New", "Dropship"], isSupplierPro: false, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: 18.95, rrp: 59.99, markup: 201.8, profit: 16.95, tags: ["Dropship"], isSupplierPro: true, discountPercentage: 10, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: 24.50, rrp: 79.99, markup: 226.5, profit: 22.30, tags: ["New"], isSupplierPro: false, negotiable: true, firstOrderDiscount: { percentage: 15, label: "-15% ON YOUR FIRST ORDER" }, image: null },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: 12.80, rrp: 39.99, markup: 212.4, profit: 11.20, tags: ["New", "Dropship"], isSupplierPro: true, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop" },
  { title: "Samsung Galaxy Buds FE Wireless Earbuds", price: 32.99, rrp: 99.99, markup: 203.1, profit: 28.50, tags: ["New"], isSupplierPro: false, negotiable: true, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop" },
  { title: "JBL Tune 510BT Wireless On-Ear Headphones", price: 15.50, rrp: 49.99, markup: 222.5, profit: 13.20, tags: ["Dropship"], isSupplierPro: false, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { title: "Braun Series 3 ProSkin 3010s Electric Shaver", price: 22.75, rrp: 69.99, markup: 207.6, profit: 19.80, tags: ["New"], isSupplierPro: false, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop" },
  { title: "Philips Sonicare ProtectiveClean 4100 Toothbrush", price: 19.95, rrp: 59.99, markup: 200.8, profit: 16.50, tags: ["New", "Dropship"], isSupplierPro: true, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop" },
  { title: "Nike Air Max 90 Essential White/Black Mens", price: 42.50, rrp: 129.99, markup: 205.9, profit: 36.80, tags: ["New"], isSupplierPro: false, discountPercentage: 10, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { title: "Logitech MX Master 3S Wireless Mouse", price: 38.99, rrp: 109.99, markup: 182.1, profit: 32.40, tags: ["Dropship"], isSupplierPro: false, negotiable: true, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop" },
  { title: "Canon PIXMA TS3350 All-in-One Inkjet Printer", price: 27.80, rrp: 79.99, markup: 187.7, profit: 22.10, tags: ["New"], isSupplierPro: false, image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop" },
];

const SUPPLY_MODEL_LABELS = { wholesale: "Wholesale", dropshipping: "Dropshipping", liquidation: "Liquidation", "white-label": "White Label", "private-label": "Private Label", "job-lots": "Job Lots" };
const SUPPLIER_TYPE_LABELS = { manufacturer: "Manufacturer", "brand-owner": "Brand Owner", "private-label": "Private / White Label", wholesaler: "Wholesaler", distributor: "Distributor", importer: "Importer", exporter: "Exporter", "trading-company": "Trading Company", liquidator: "Liquidator / Clearance", dropshipper: "Dropshipper", "sourcing-agent": "Sourcing Agent", "artisan-maker": "Artisan / Maker" };

function scrambleText(text) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return (text || "").replace(/[A-Za-z0-9]/g, (ch, i) => chars[(ch.charCodeAt(0) + i * 7) % chars.length]);
}

// Flat flag images via flagcdn.com
// PRODUCTION (L8): Replace <img> with next/image Image component.
// Add flagcdn.com to next.config.js images.remotePatterns.
function FlagImg({ code, size = 20 }) {
  const map = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", AU: "au", SE: "se", CA: "ca", JP: "jp", KR: "kr", CN: "cn", IN: "in", TR: "tr", BR: "br", MX: "mx", TH: "th" };
  const iso = map[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}


const SUPPLIERS = [
  { slug: "prokit-sports-ltd", companyName: "ProKit Sports Ltd", rating: 5.0, reviewCount: 24, yearsActive: 8, isVerified: true, isSupplierPro: true, supplierType: ["wholesaler", "distributor"], supplyModels: ["wholesale", "dropshipping"], categories: ["Trainers & Sportswear", "Shoes & Boots", "Fashion Accessories", "Jeans & Casual"], companyDescription: "We are a wholesaler of sportswear clothing and shoes. We offer high quality adidas originals men's sports footwear, Nike air max and other trainer brands at competitive wholesale prices.", productsOffered: "Latest seasonal collections, classic retro styles, limited edition releases sourced directly from authorised distributors.", brandsDistributed: ["Nike", "Adidas", "Puma", "New Balance"], contact: { mobileNumber: "+4402081234567", businessEmail: "contact@trainers-wholesale.co.uk" }, companyWebsite: "www.trainers-wholesale.co.uk", address: { street: "9 Fisher's Lane, Chiswick", city: "London", country: "United Kingdom", countryCode: "gb" } },
  { slug: "basketball-sport-gmbh", companyName: "Basketball Sport GmbH", rating: 5.0, reviewCount: 18, yearsActive: 6, isVerified: true, isSupplierPro: false, supplierType: ["wholesaler"], supplyModels: ["wholesale"], categories: ["Trainers & Sportswear", "Shoes & Boots", "Fashion Accessories", "Jeans & Casual"], companyDescription: "Premium sports equipment and apparel supplier specializing in basketball gear, training equipment, team uniforms and branded athletic footwear for retailers across the UK.", productsOffered: "NBA licensed merchandise, professional-grade basketballs, hoops, training aids, and performance apparel.", brandsDistributed: ["Nike", "Under Armour", "Spalding"], contact: { mobileNumber: "+4402089876543", businessEmail: "info@basketball-sport.co.uk" }, companyWebsite: "www.basketball-sport.co.uk", address: { street: "Unit 12, Olympic Business Park", city: "London", country: "United Kingdom", countryCode: "gb" } },
  { slug: "elektrodirekt-gmbh", companyName: "ElektroDirekt GmbH", rating: 4.8, reviewCount: 35, yearsActive: 12, isVerified: true, isSupplierPro: true, supplierType: ["wholesaler", "importer"], supplyModels: ["wholesale", "dropshipping", "white-label"], categories: ["Consumer Electronics", "Computing", "Smart Home"], companyDescription: "Leading European electronics wholesaler offering consumer electronics, accessories, and smart home products at competitive prices to retailers and resellers.", productsOffered: "Smartphones, tablets, laptops, audio equipment, smart home devices, and wearable technology. Over 15,000 product lines.", brandsDistributed: ["Samsung", "Apple", "Sony", "LG", "Philips"], contact: { mobileNumber: "+4930123456", businessEmail: "sales@electronics-direct.de" }, companyWebsite: "www.electronics-direct.de", address: { street: "Berliner Str. 45", city: "Berlin", country: "Germany", countryCode: "de" } },
  { slug: "huisgroen-bv", companyName: "HuisGroen BV", rating: 4.7, reviewCount: 8, yearsActive: 5, isVerified: false, isSupplierPro: false, supplierType: ["wholesaler", "dropshipper"], supplyModels: ["wholesale", "dropshipping"], categories: ["Home & Garden", "Furniture", "Garden Tools"], companyDescription: "Quality home supplies, garden tools, and decor items from trusted European manufacturers. Low MOQ available for new retailers.", productsOffered: "Indoor and outdoor furniture, seasonal garden equipment, lighting solutions, kitchenware, bathroom accessories, and decorative home accents.", brandsDistributed: [], contact: { mobileNumber: "+3120654321", businessEmail: "info@home-garden.nl" }, companyWebsite: "www.home-garden.nl", address: { street: "Industrieweg 88", city: "Amsterdam", country: "Netherlands", countryCode: "nl" } },
  { slug: "beauty-box-wholesale-ltd", companyName: "Beauty Box Wholesale Ltd", rating: 4.9, reviewCount: 41, yearsActive: 7, isVerified: true, isSupplierPro: true, supplierType: ["wholesaler", "brand-owner"], supplyModels: ["wholesale", "white-label"], categories: ["Health & Beauty", "Cosmetics", "Skincare"], companyDescription: "Specialist beauty and cosmetics wholesaler stocking leading brands. Perfect for online and high street retailers looking for premium products at wholesale margins.", productsOffered: "Trending skincare, makeup, haircare, and fragrance lines with weekly new arrivals.", brandsDistributed: ["L'Oréal", "Maybelline", "NYX", "Revolution", "The Ordinary"], contact: { mobileNumber: "+4402071234567", businessEmail: "wholesale@beautybox.co.uk" }, companyWebsite: "www.beautybox.co.uk", address: { street: "25 High Street, Camden", city: "London", country: "United Kingdom", countryCode: "gb" } },
  { slug: "global-toy-distributors-inc", companyName: "Global Toy Distributors Inc", rating: 4.6, reviewCount: 15, yearsActive: 10, isVerified: true, isSupplierPro: false, supplierType: ["distributor"], supplyModels: ["wholesale"], categories: ["Toys & Games", "Novelty Items", "Children's Products"], companyDescription: "Large range of toys, games and novelty items from top brands. Competitive pricing with fast worldwide shipping available.", productsOffered: "Over 5,000 product lines including action figures, board games, educational toys, outdoor play equipment, arts and crafts supplies.", brandsDistributed: ["Disney", "Marvel", "Pokémon", "LEGO"], contact: { mobileNumber: "+12125551234", businessEmail: "orders@globaltoys.com" }, companyWebsite: "www.globaltoys.com", address: { street: "350 Fifth Avenue", city: "New York", country: "United States", countryCode: "us" } },
  { slug: "nordic-fashion-outlet-ab", companyName: "Nordic Fashion Outlet AB", rating: 4.8, reviewCount: 22, yearsActive: 4, isVerified: true, isSupplierPro: true, supplierType: ["wholesaler", "exporter"], supplyModels: ["wholesale", "dropshipping"], categories: ["Clothing", "Footwear", "Accessories"], companyDescription: "Scandinavian fashion wholesaler offering premium clothing, footwear and accessories at below-market prices for fashion retailers.", productsOffered: "Clean Nordic design aesthetics with sustainable materials and ethical manufacturing. Both established labels and emerging designers.", brandsDistributed: ["H&M", "COS", "Acne Studios", "Fjällräven"], contact: { mobileNumber: "+46812345678", businessEmail: "sales@nordicfashion.se" }, companyWebsite: "www.nordicfashion.se", address: { street: "Storgatan 15", city: "Stockholm", country: "Sweden", countryCode: "se" } },
  { slug: "autoparts-direct-europe-gmbh", companyName: "AutoParts Direct Europe GmbH", rating: 4.5, reviewCount: 19, yearsActive: 15, isVerified: true, isSupplierPro: false, supplierType: ["wholesaler", "importer"], supplyModels: ["wholesale"], categories: ["Automotive Parts", "Vehicle Accessories", "OEM Parts"], companyDescription: "Automotive parts and accessories wholesaler with over 50,000 SKUs. OEM and aftermarket parts available for European vehicles.", productsOffered: "Brake systems, suspension components, engine parts, lighting, exhaust systems, and interior accessories for all major European car brands.", brandsDistributed: ["Bosch", "Brembo", "Continental", "Hella"], contact: { mobileNumber: "+4930987654", businessEmail: "parts@autoparts-direct.de" }, companyWebsite: "www.autoparts-direct.de", address: { street: "Maximilianstr. 12", city: "Munich", country: "Germany", countryCode: "de" } },
];

const COUNTRIES = [
  { code: "UK", name: "United Kingdom" }, { code: "US", name: "United States" },
  { code: "DE", name: "Germany" }, { code: "FR", name: "France" },
  { code: "IT", name: "Italy" }, { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" }, { code: "PL", name: "Poland" },
  { code: "AU", name: "Australia" }, { code: "CA", name: "Canada" },
  { code: "JP", name: "Japan" }, { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" }, { code: "IN", name: "India" },
  { code: "TR", name: "Turkey" }, { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" }, { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" }, { code: "SE", name: "Sweden" },
  { code: "BE", name: "Belgium" }, { code: "AT", name: "Austria" },
  { code: "PT", name: "Portugal" }, { code: "IE", name: "Ireland" },
];

const TESTIMONIALS = [
  { text: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", author: "Rena Harvey", role: "Online Retailer", location: "United Kingdom" },
  { text: "Very pleased with the service, suppliers and dropshippers. I have just upgraded to combo for the new month. Thank you.", author: "Thu Huong Do", role: "Dropshipper", location: "Sweden" },
  { text: "Absolutely fantastic, it's a great service and am really glad I found it. I fully recommend it and use it regularly.", author: "Alex Elliott", role: "Online Reseller", location: "United Kingdom" },
  { text: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", author: "James Richardson", role: "Amazon FBA Seller", location: "United States" },
  { text: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", author: "Maria Gonzalez", role: "eBay Power Seller", location: "Spain" },
  { text: "As a newcomer to reselling, I was overwhelmed. The platform made it so easy to find verified suppliers and profitable deals from day one.", author: "Oliver Schmitt", role: "New Reseller", location: "Germany" },
  { text: "The deal tracker alone is worth the subscription. I get notified the moment a new deal matches my criteria. It's like having a personal buyer.", author: "Sarah Jenkins", role: "Deal Hunter", location: "Canada" },
  { text: "I run three Amazon stores and WholesaleUp is my go-to source for all of them. The variety of suppliers and product categories is unmatched.", author: "David Chen", role: "Multi-Store Owner", location: "Australia" },
  { text: "Customer support is top notch. Had an issue with a supplier and the team stepped in and resolved it within a day. Very impressed.", author: "Fatima Al-Hassan", role: "Wholesale Buyer", location: "United Arab Emirates" },
  { text: "Upgraded to Premium last month and it's already paid for itself ten times over. The exclusive deals section is a goldmine.", author: "Patrick O'Brien", role: "Online Retailer", location: "Ireland" },
  { text: "The profit calculators and market analysis tools help me make smarter buying decisions. My return rate has dropped significantly.", author: "Yuki Tanaka", role: "Online Retailer", location: "Japan" },
  { text: "What sets WholesaleUp apart is the quality of suppliers. Every one I've contacted has been professional and delivered on time.", author: "Lisa Bergström", role: "Quality-Focused Buyer", location: "Sweden" },
];

const FAQS = [
  { q: "What do I get when I join WholesaleUp buyer?", a: "You get immediate access to our platform with over 54,000 verified suppliers, all the latest wholesale deals with profit calculations, and the Deal Tracker tool. You'll also receive our weekly deals newsletter and can request personalized sourcing assistance from our team." },
  { q: "Are the suppliers really verified?", a: "Yes, all suppliers on our platform go through a rigorous verification process to ensure they are legitimate wholesale businesses. We verify their business credentials, check their reputation, and ensure they meet our quality standards." },
  { q: "Is WholesaleUp good for beginners?", a: "Absolutely! WholesaleUp is designed to help both beginners and experienced resellers. We provide educational resources, profit calculators, and personalized support to help you get started and grow your business successfully." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. Your access will continue until the end of your current billing period. We also offer a money-back guarantee if you're not satisfied within the first 14 days." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 100% money-back guarantee. If we can't find the suppliers or deals you're looking for, we'll refund your subscription in full." },
  { q: "How often are new deals added?", a: "We add new wholesale and dropship deals daily. Our team constantly sources new opportunities from verified suppliers across the UK, EU, and North America." },
];

/* ═══════ SHARED HELPERS ═══════ */
function useCarousel(itemCount, visibleCount = 3) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [progress, setProgress] = useState(0);
  const check = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanLeft(scrollLeft > 10);
    setCanRight(scrollWidth > clientWidth + 10 && scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    setProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Delay initial check to let items render
    const timer = setTimeout(check, 100);
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { clearTimeout(timer); el.removeEventListener("scroll", check); window.removeEventListener("resize", check); ro.disconnect(); };
  }, [check]);
  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return { scrollRef, canLeft, canRight, scroll, progress };
}

/* ═══════════════════════════════════════
   1. HERO SECTION
   ═══════════════════════════════════════ */
function HeroSection() {
  const [searchType, setSearchType] = useState("Deals");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchTypes = ["Deals", "Suppliers", "Importers", "Distributors", "Liquidators", "Wholesalers", "Dropshippers"];

  return (
    <div className="relative">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-16 lg:pb-24 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
          #1 Wholesale &amp; Dropship Platform<br />
          Since 20+ Years
        </h1>
        <p className="text-slate-400 mt-3 text-base lg:text-lg max-w-3xl mx-auto">
          Become a rockstar reseller in days. The Web&apos;s Largest database of verified wholesale suppliers, liquidators and dropshippers from the EU, UK and North America
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl shadow-black/20 p-1.5">
            <div className="flex items-center gap-1.5">
              {/* Type Selector */}
              <div className="relative">
                <button onClick={() => setSearchOpen(!searchOpen)} className="flex items-center gap-1.5 px-3 py-3 rounded-lg bg-orange-50 text-base font-semibold text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
                  {searchType}
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${searchOpen ? "rotate-180" : ""}`} />
                </button>
                {searchOpen && (
                  <div className="absolute left-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 min-w-[160px]">
                    {searchTypes.map((t) => (
                      <button key={t} onClick={() => { setSearchType(t); setSearchOpen(false); }}
                        className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${searchType === t ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <input type="text" placeholder="What are you looking for?" className="flex-1 px-3 py-3 text-base text-slate-800 bg-transparent outline-none placeholder:text-slate-400 min-w-0" />

              {/* Search Button — plain orange to match header */}
              <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0">
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Popular Search:</span>
            {["Wholesale Pajamas", "Leather Bootts", "Sneaker", "Buy Toys Bulk"].map((term) => (
              <button key={term} className="px-2.5 py-1 text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-orange-400 rounded-lg transition-all">
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   2. LATEST DEALS CAROUSEL (Simple Cards)
   ═══════════════════════════════════════ */
function LatestDealsCarousel() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(SIMPLE_DEALS.length);
  return (
    <section className="relative px-4 sm:px-6 lg:px-10 pb-10 pt-1">
      <div className="relative bg-gradient-to-br from-orange-400/90 via-orange-300/70 to-amber-300/60 rounded-2xl shadow-lg border border-orange-400/30 px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Flame size={20} className="text-red-700 fill-red-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Latest wholesale &amp; dropship deals up for grabs...</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-white/60 bg-white/50 flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button onClick={() => scroll(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-white/60 bg-white/50 flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30"><ChevronRight size={16} /></button>
            <a href="/deals" className="text-sm font-semibold text-white hover:text-white/80 flex items-center gap-1 ml-2">View all <ArrowRight size={13} /></a>
          </div>
        </div>

        {/* Deal Cards */}
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {SIMPLE_DEALS.map((deal, i) => (
            <div
              key={i}
              className="w-[180px] sm:w-[200px] shrink-0 snap-start bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer shadow-sm"
              onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}
            >
              <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                {deal.image ? (
                  /* PRODUCTION (L8): Replace <img> with next/image Image component.
                     Use fill + sizes prop for responsive optimization. */
                  <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="100%" onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <NoImagePlaceholder />
                )}
                {/* Top-left badges */}
                {deal.negotiable && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 text-[10px] font-bold bg-orange-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
                      <Handshake size={10} /> NEGOTIABLE
                    </span>
                  </div>
                )}
                {/* Markup badge (top-right, green) */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
                  <TrendingUp size={10} /> 201.8%
                </div>
                {/* Price badge (bottom-left, on image) */}
                <div className="absolute bottom-2 left-2 flex flex-col items-start">
                  {deal.discountPercentage > 0 && (
                    <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">{deal.discountPercentage}% DISCOUNT</div>
                  )}
                  <div className={`${deal.discountPercentage > 0 ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
                    <span className={`text-base font-extrabold ${deal.discountPercentage > 0 ? "text-white" : "text-orange-600"}`}>£{deal.price.toFixed(2)}</span>
                    <span className={`text-[10px] ml-1 ${deal.discountPercentage > 0 ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-400 mb-1">Deal First Featured On: {deal.dateAdded}</p>
                {deal.firstOrderDiscount && (
                  <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderDiscount.label}</span></div>
                )}
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">{deal.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   3. CATEGORIES — V2 Horizontal Pills
   ═══════════════════════════════════════ */

const CATEGORY_ILLUSTRATIONS = {
  "Baby & Kids": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="46" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M44 25C44 18 47 14 50 14C53 14 56 18 56 25" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <rect x="40" y="25" width="20" height="6" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="36" y="31" width="28" height="44" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M40 45H48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 55H46" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 65H48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Clothing & Fashion": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="58" cy="40" rx="30" ry="28" fill="#FED7AA" opacity="0.5" />
      <path d="M35 25L42 20H58L65 25L72 35L65 38L60 30V75H40V30L35 38L28 35L35 25Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M42 20C42 20 45 28 50 28C55 28 58 20 58 20" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="40" y1="45" x2="60" y2="45" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="55" r="2" fill="#1E293B" />
      <circle cx="50" cy="63" r="2" fill="#1E293B" />
    </svg>
  ),
  "Electronics & Technology": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="48" rx="30" ry="26" fill="#FED7AA" opacity="0.5" />
      <rect x="22" y="34" width="56" height="32" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="12" stroke="#1E293B" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M38 30H52L56 34H22" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <circle cx="68" cy="42" r="3" stroke="#1E293B" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  "Health & Beauty": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="48" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="#1E293B" strokeWidth="2" fill="none" transform="rotate(72 50 48)" />
      <path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="#1E293B" strokeWidth="2" fill="none" transform="rotate(144 50 48)" />
      <path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="#1E293B" strokeWidth="2" fill="none" transform="rotate(216 50 48)" />
      <path d="M50 48C44 44 36 32 46 22C54 26 54 42 50 48Z" stroke="#1E293B" strokeWidth="2" fill="none" transform="rotate(288 50 48)" />
      <circle cx="50" cy="48" r="5" fill="#1E293B" />
    </svg>
  ),
  "Home & Garden": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="30" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M18 50L45 27L72 50" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="26" y="50" width="38" height="28" rx="1" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="39" y="60" width="12" height="18" rx="1" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="30" y="55" width="7" height="7" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M43 78V68" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="76" cy="54" r="7" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="84" cy="54" r="7" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="80" cy="47" r="7" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M80 61V78" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "Jewellery & Watches": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="45" cy="50" rx="26" ry="24" fill="#FED7AA" opacity="0.5" />
      <circle cx="50" cy="50" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="16" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M50 38V50L58 56" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="26" width="12" height="6" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <rect x="44" y="68" width="12" height="6" rx="2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="2" fill="#1E293B" />
    </svg>
  ),
  "Sports & Outdoors": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M22 50H78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="38" width="8" height="24" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="64" y="38" width="8" height="24" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="20" y="42" width="6" height="16" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="74" y="42" width="6" height="16" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
    </svg>
  ),
  "Surplus & Clearance": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="48" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <rect x="22" y="45" width="26" height="22" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="52" y="45" width="26" height="22" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="37" y="25" width="26" height="22" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M35 56H48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M65 56H78" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 36H63" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 72H78" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />
    </svg>
  ),
  "Toys & Games": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="48" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M50 18L76 33L50 48L24 33Z" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M24 33L50 48L50 80L24 65Z" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M50 48L76 33L76 65L50 80Z" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <circle cx="50" cy="33" r="2.5" fill="#1E293B" />
      <circle cx="40" cy="47" r="2.5" fill="#1E293B" />
      <circle cx="34" cy="63" r="2.5" fill="#1E293B" />
      <circle cx="66" cy="44" r="2.5" fill="#1E293B" />
      <circle cx="63" cy="54" r="2.5" fill="#1E293B" />
      <circle cx="60" cy="64" r="2.5" fill="#1E293B" />
    </svg>
  ),
  "Gifts & Seasonal": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <rect x="28" y="35" width="44" height="40" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M50 35V75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="40" y="25" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M45 25C45 20 47 18 50 18C53 18 55 20 55 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="50" r="2.5" fill="currentColor" />
      <circle cx="65" cy="50" r="2.5" fill="currentColor" />
      <circle cx="50" cy="60" r="2.5" fill="currentColor" />
    </svg>
  ),
  "Food & Beverages": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M35 65L38 35C38 32 40 30 42 30H58C60 30 62 32 62 35L65 65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M50 30V65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 50H60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="38" r="1.5" fill="currentColor" />
      <circle cx="58" cy="38" r="1.5" fill="currentColor" />
      <path d="M35 65H65" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  "Pet Supplies": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <circle cx="38" cy="38" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="62" cy="38" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="50" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="68" cy="50" r="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <ellipse cx="50" cy="62" rx="12" ry="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M45 58V68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55 58V68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Automotive & Parts": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M25 55L30 38C30 35 32 33 35 33H65C68 33 70 35 70 38L75 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="28" y="55" width="44" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="38" cy="67" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="62" cy="67" r="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M35 45H65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

function CategoriesGrid() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(CATEGORIES.length);
  return (
    <section className="px-4 sm:px-6 lg:px-16 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">Explore by Category</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={16} /></button>
          <a href="/categories" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 ml-2">View all <ArrowRight size={13} /></a>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto py-2 -my-2 px-1 -mx-1 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat, i) => (
          <a key={i} href={cat.href}
            className="w-[160px] sm:w-[175px] shrink-0 snap-start group cursor-pointer self-stretch">
            <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-[0px_2px_4px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-orange-200 active:scale-[0.97] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200">
              <div className="w-full h-[100px] p-3 shrink-0">
                {CATEGORY_ILLUSTRATIONS[cat.name] || (
                  <div className="w-full h-full flex items-center justify-center">
                    <cat.icon size={40} strokeWidth={1.2} className="text-slate-800" />
                  </div>
                )}
              </div>
              <div className="px-3 pb-3 mt-auto">
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">{cat.name}</h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">{cat.count} suppliers</span>
                  <ArrowRight size={11} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   4. TRUST SECTION — #1 Platform (Buyers)
   ═══════════════════════════════════════ */
function TrustSectionBuyers() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-10">
      <div className="bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a] rounded-3xl overflow-hidden relative">
        {/* Dot world map background with radial fade */}
        <div className="absolute inset-0 pointer-events-none" style={{ mask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)", WebkitMask: "radial-gradient(ellipse 90% 85% at 50% 50%, black 60%, transparent 95%)" }}>
          <div className="absolute inset-x-0 top-0 -bottom-[75%]">
            <DotWorldMap opacity={0.12} />
          </div>
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400/8 via-transparent to-orange-500/5 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">#1 Platform On the Market</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-2 leading-snug">
              Why Hundreds of Thousands of Resellers Trust Us
            </h2>
            <p className="text-sky-100/60 mt-3 text-base leading-relaxed">
              We&apos;re more than just a platform — we&apos;re a growth partner. From day-one beginners to seasoned resellers, we provide the tools, insights, and supplier access that empower you to scale faster &amp; smarter.
            </p>
            <button className="mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5">
              Learn More <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid gap-4">
            {[
              { icon: BadgeCheck, title: "Verified global suppliers", desc: "Largest database of trusted suppliers from the UK, EU, and North America." },
              { icon: Globe, title: "Unlimited Custom Sourcing Support", desc: "We are fanatical about finding specific deals and suppliers that match your exact needs." },
              { icon: ThumbsUp, title: "Satisfaction Guarantee", desc: "We guarantee to find what you're looking for, or your money back." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 bg-gradient-to-br from-white/10 to-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/15">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-sky-100/50 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   HOT OFFER CARD — individual card with fav/hide state
   ═══════════════════════════════════════ */
/* ── Deal card left border color by priority: red (discounted) > orange (negotiable) ── */
function getHotOfferBorderClass(deal) {
  if (deal.discountPercentage > 0) return "border-l-[3px] border-l-red-500";
  if (deal.negotiable) return "border-l-[3px] border-l-orange-500";
  return "";
}

function HotOfferCard({ deal, isPremium, isLoggedIn, canViewSupplier = false, onContact }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && deal.isSupplierPro);

  return (
    <div className={`w-[220px] sm:w-[230px] lg:w-[240px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col relative ${getHotOfferBorderClass(deal)}`}>
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <EyeOff size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Deal hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-4 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5">
            <Eye size={12} /> Unhide Deal
          </button>
        </div>
      )}

      {/* Card body — clickable link to single deal page */}
      <a href="/deal" className="block flex-1 cursor-pointer">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
          {deal.image ? (
            /* PRODUCTION (L8): Replace <img> with next/image Image component. */
            <Image src={deal.image} alt={deal.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="100%" onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <NoImagePlaceholder />
          )}
          {/* Markup badge (top-right, emerald) */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
            <TrendingUp size={10} /> {deal.markup}%
          </div>
          {/* Tags (top-left, stacked) */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
              {deal.tags.map((tag) => (
                tag === "Dropship" ? (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm flex items-center gap-1">
                    <Truck size={10} /> DROPSHIP
                  </span>
                ) : (
                  <span key={tag} className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">NEW</span>
                )
              ))}
            </div>
          )}
          {/* Price badge (bottom-left, on image) */}
          <div className="absolute bottom-2 left-2 flex flex-col items-start">
            {deal.discountPercentage > 0 && (
              <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">-{deal.discountPercentage}% DISCOUNT</div>
            )}
            <div className={`${deal.discountPercentage > 0 ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
              <span className={`text-base font-extrabold ${deal.discountPercentage > 0 ? "text-white" : "text-orange-600"}`}>£{deal.price.toFixed(2)}</span>
              <span className={`text-[10px] ml-1 ${deal.discountPercentage > 0 ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
            </div>
          </div>
          {/* Hide + Favourite buttons (bottom-right, hover only) */}
          <div className={`absolute bottom-2 right-2 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setHidden(true) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <EyeOff size={12} className="text-slate-400" />
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); isLoggedIn ? setFaved(!faved) : openRegisterModal(); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <Heart size={12} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>
        <div className="p-3.5 pb-0">
          {deal.firstOrderDiscount && (
            <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderDiscount.label}</span></div>
          )}
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">{deal.title}</h3>
          {/* RRP + Profit rows — V3 style */}
          <div className="border-t border-slate-100">
            {/* Column headers */}
            <div className="flex items-center px-1 pt-2 pb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
              <span className="w-10 shrink-0" />
              <span className="flex-1">Price</span>
              <span>Profit</span>
            </div>
            {/* RRP */}
            <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
              <span className="text-[13px] font-bold text-slate-400 w-10 shrink-0">RRP</span>
              <span className="flex-1 text-[13px] text-slate-500 tabular-nums">€{deal.rrp.toFixed(2)}</span>
              <span className="text-[13px] text-emerald-600 font-bold tabular-nums">€{deal.profit.toFixed(2)}</span>
            </div>
            {/* Amazon */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.amazon.com", "_blank"); }}
              className="flex items-center px-1 py-2 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              {/* PRODUCTION (L8): Replace <img> with next/image */}
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">€{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#FF9900"}}>€{deal.profit.toFixed(2)}</span>
            </div>
            {/* eBay */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.ebay.com", "_blank"); }}
              className="flex items-center px-1 py-2 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              {/* PRODUCTION (L8): Replace <img> with next/image */}
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">€{deal.rrp.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#0064D2"}}>€{deal.profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </a>
      {/* Action button — three-tier gating, NOT part of the card link */}
      <div className="p-3.5 pt-3">
        {canContact ? (
          <button onClick={() => onContact(deal)} className="w-full py-2.5 text-sm font-bold rounded-lg bg-[#1e5299] hover:bg-[#174280] text-white flex items-center justify-center gap-1.5 mt-auto shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <MessageSquare size={14} /> Send Enquiry
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="block w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-center mt-auto flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Send Enquiry
          </a>
        ) : (
          <button onClick={openRegisterModal} className="w-full py-2.5 text-sm font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
            <Lock size={14} /> Join Now!
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   5. HOT OFFERS CAROUSEL (Detailed Cards)
   ═══════════════════════════════════════ */
function HotOffersCarousel({ isPremium, isLoggedIn, canViewSupplier = false }) {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(DETAILED_DEALS.length);
  const [contactModal, setContactModal] = useState(null);

  const handleContact = (deal) => {
    setContactModal(deal);
  };


  return (
    <section className="px-4 sm:px-6 lg:px-16 pt-4 pb-10 bg-slate-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deals</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Hot Wholesale & Dropship Offers</h2>
          <p className="text-sm text-slate-500 mt-1">Get instant access to the latest and most popular wholesale and dropship opportunities.</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          Explore Deals <ArrowRight size={14} />
        </a>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {DETAILED_DEALS.map((deal, i) => (
            <HotOfferCard key={i} deal={deal} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} onContact={handleContact} />
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>

      {contactModal && <ContactSupplierModal name={contactModal?.title || contactModal?.name || "Supplier"} onClose={() => setContactModal(null)} />}
    </section>
  );
}

/* ═══════════════════════════════════════
   6. TRUST SECTION — #1 Platform (Suppliers)
   ═══════════════════════════════════════ */
function TrustSectionSuppliers() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">#1 Platform for Suppliers</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 leading-snug">
              Here's Why Thousands of Suppliers Trust Us to Reach More Buyers
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              We're more than just a platform — we're a growth partner. From day-one beginners to seasoned resellers, we provide the tools.
            </p>
            <button className="mt-5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5">
              Learn More <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3.5">
            {[
              "Buy today from verified wholesalers and dropshippers at up to 95% off the current eBay and Amazon prices.",
              "Effortlessly discover profitable wholesale and dropship deals, saving you valuable time and leading you directly to profits.",
              "List new deals daily to ensure our members have a constant supply of low priced goods to resell at a profit.",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <BadgeCheck size={16} className="text-emerald-600" />
                </div>
                <p className="text-base text-slate-600 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   7. FEATURED SUPPLIERS
   ═══════════════════════════════════════ */
function FeaturedSuppliers({ isPremium, isLoggedIn }) {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(SUPPLIERS.length);
  const [contactModal, setContactModal] = useState(null);
  const [phoneModal, setPhoneModal] = useState(null);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));

  const handleContact = (sup) => {
    setContactModal(sup);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-16 pt-4 pb-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left side — section info */}
        <div className="lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col">
          <span className="text-sm font-bold text-orange-600 tracking-wide">Suppliers</span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">Featured Wholesale Liquidation & Dropship Suppliers</h2>
          <p className="text-base text-slate-500 mt-3 leading-relaxed">Browse the latest verified suppliers listed on WholesaleUp, offering wholesale, liquidation, and dropship products across the UK and Europe.</p>
          <a href="/suppliers" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            Explore Suppliers <ArrowRight size={14} />
          </a>
        </div>

        {/* Right side — card carousel */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
              {SUPPLIERS.map((sup, i) => {
                const canContact = isPremium || (isLoggedIn && sup.isSupplierPro);
                const canViewName = isLoggedIn && (sup.isSupplierPro || isPremium);
                const displayName = canViewName ? sup.companyName : (() => {
                  const firstCat = sup.categories?.[0] || "";
                  const types = sup.supplierType || [];
                  const typeLabel = types.length > 0 ? types.map((st) => SUPPLIER_TYPE_LABELS[st] || st).join(" & ") : "Supplier";
                  return firstCat ? `${firstCat} ${typeLabel}` : typeLabel;
                })();

                return (
                <div key={i} className={`w-[340px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col relative cursor-pointer ${
                  sup.isSupplierPro
                    ? "border-l-[3px] border-l-[#1e5299] border border-[#1e5299]/30 hover:border-[#1e5299]/50"
                    : "border border-slate-200 hover:border-orange-200"
                }`} onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/supplier"; }}>
                  {/* Supplier Pro badge — top right */}
                  {sup.isSupplierPro && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-[#1e5299] text-white text-[10px] font-bold rounded-md shadow-sm">
                      <Crown size={10} className="shrink-0" />
                      PRO
                    </div>
                  )}

                  {/* Supplier name & meta */}
                  <div className="px-5 pt-5 pb-0">
                    {/* Verified Supplier badge — above name */}
                    {sup.isVerified && (
                      <div className="mb-1.5">
                        <VerifiedBadge size={8} className="text-[9px] px-1.5 py-px" />
                      </div>
                    )}
                    <a href="/supplier" className="group/name">
                      <h3 className="text-base font-bold text-slate-900 group-hover/name:text-orange-600 transition-colors leading-snug pr-16">
                        {displayName}
                      </h3>
                    </a>
                    {/* Supplier type tags */}
                    {sup.supplierType?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {sup.supplierType.map((st) => (
                          <span key={st} className="px-1.5 py-px text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
                            {SUPPLIER_TYPE_LABELS[st] || st}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Country · x yrs · Star rating */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <FlagImg code={sup.address.countryCode} size={16} />
                        {sup.address.country}
                      </span>
                      <span className="text-slate-300">&middot;</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Calendar size={10} />
                        {sup.yearsActive} yrs
                      </span>
                      <span className="text-slate-300">&middot;</span>
                      <a href="/supplier?tab=reviews" className="hover:opacity-80 transition-opacity">
                        <StarRating rating={sup.rating} size={11} showValue />
                      </a>
                    </div>
                    {/* Supply model tags — Wholesale, Dropshipping, White Label, etc. */}
                    {sup.supplyModels?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {sup.supplyModels.map((f) => (
                          <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md">
                            <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
                            {SUPPLY_MODEL_LABELS[f] || f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category tags — max 2 + "x+" overflow */}
                  <div className="flex flex-wrap gap-1.5 px-5 mt-3">
                    {sup.categories.slice(0, 2).map((cat) => (
                      <a key={cat} href={`/suppliers?any=${encodeURIComponent(cat)}`} className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-md hover:bg-emerald-50 transition-colors">
                        {cat}
                      </a>
                    ))}
                    {sup.categories.length > 2 && (
                      <span className="px-2.5 py-1 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-md">
                        +{sup.categories.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Description — 3 paragraphs: description, products offered, brands */}
                  <div className="px-5 mt-3 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
                    <div className="text-sm text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar whitespace-pre-line" style={{ maxHeight: "5.2em" }}>
                      {sup.companyDescription}
                      {sup.productsOffered && (
                        <p className="mt-2">{sup.productsOffered}</p>
                      )}
                      {sup.brandsDistributed?.length > 0 && (
                        <p className="mt-2">{sup.brandsDistributed.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons — 3-tier gating matching /suppliers */}
                  <div className="flex gap-2 px-5 mt-3">
                    {canContact ? (
                      <button onClick={() => setPhoneModal(sup)} className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Phone size={12} /> Call Now
                      </button>
                    ) : isLoggedIn ? (
                      <a href="/pricing" className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Lock size={12} /> Call Now
                      </a>
                    ) : (
                      <button onClick={openRegisterModal} className="flex-1 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Phone size={12} /> Call Now
                      </button>
                    )}
                    {canContact ? (
                      <button onClick={() => handleContact(sup)} className="flex-1 py-2 text-sm font-bold text-white bg-[#1e5299] hover:bg-[#174280] rounded-lg flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <MessageSquare size={12} /> Send Enquiry
                      </button>
                    ) : isLoggedIn ? (
                      <a href="/pricing" className="flex-1 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <Lock size={12} /> Send Enquiry
                      </a>
                    ) : (
                      <button onClick={openRegisterModal} className="flex-1 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                        <MessageSquare size={12} /> Send Enquiry
                      </button>
                    )}
                  </div>

                  {/* Contact & Address footer — mini card style */}
                  <div className="px-5 mt-3 pb-5">
                    {isPremium ? (
                      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-3 py-2 space-y-1 text-[11px] bg-white">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Phone size={10} className="text-slate-400 shrink-0" />
                              <span className="text-slate-600 truncate">{sup.contact.mobileNumber}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Mail size={10} className="text-slate-400" />
                              <button onClick={() => handleContact(sup)} className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                                Contact Supplier
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <MapPin size={10} className="text-slate-400 shrink-0" />
                              <span className="text-slate-500 truncate">{sup.address.street}, {sup.address.city}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Globe size={10} className="text-slate-400" />
                              <WebsiteLink slug={sup.slug} url={"https://" + sup.companyWebsite} className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors">
                                Website <ExternalLink size={9} />
                              </WebsiteLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg bg-slate-50 py-4 text-center">
                        <Lock size={16} className="text-slate-300 mx-auto mb-1.5" />
                        <p className="text-[11px] text-slate-400 mb-2.5">
                          {isLoggedIn ? "Contact details available to Premium members" : "Contact details available to registered members"}
                        </p>
                        {isLoggedIn ? (
                          <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                            <Rocket size={12} /> Upgrade Now
                          </a>
                        ) : (
                          <button onClick={openRegisterModal} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                            <Lock size={12} /> Log In / Register
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>

            {/* Navigation arrows */}
            {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
            {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
          </div>

        </div>
      </div>

      {contactModal && <ContactSupplierModal name={contactModal?.name || "Supplier"} onClose={() => setContactModal(null)} />}

      {/* Phone Number Reveal Modal */}
      {phoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setPhoneModal(null)}>
          <div role="dialog" aria-modal="true" aria-label="Supplier Phone" className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Phone size={18} className="text-orange-500" /> Supplier Phone</h3>
              <button onClick={() => setPhoneModal(null)} className="min-w-[44px] min-h-[44px] rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors" aria-label="Close modal">
                <X size={16} className="text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-1">{phoneModal?.companyName || "Supplier"}</p>
            <p className="text-sm text-slate-500 mb-3">Call the supplier directly:</p>
            <a href={`tel:${phoneModal?.contact?.mobileNumber || "+44 20 7946 0958"}`} className="block w-full py-3 rounded-lg text-center text-lg font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
              {phoneModal?.contact?.mobileNumber || "+44 20 7946 0958"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════
   8. COUNTRY/REGION GRID
   ═══════════════════════════════════════ */
function CountryGrid() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(COUNTRIES.length);
  return (
    <section className="px-4 sm:px-6 lg:px-16 pt-2 pb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-extrabold text-slate-900">Find Suppliers by Country or Region</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} disabled={!canLeft} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll(1)} disabled={!canRight} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={16} /></button>
          <a href="/suppliers" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 ml-2">View all <ArrowRight size={13} /></a>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {COUNTRIES.map((c, i) => (
          <a key={i} href="/suppliers" className="w-[90px] sm:w-[100px] shrink-0 snap-start flex flex-col items-center gap-2 py-4 px-2 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-orange-200 shadow-[0px_2px_4px_rgba(0,0,0,0.06)] hover:shadow-lg active:scale-[0.97] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all duration-200 group cursor-pointer">
            <span className="group-hover:scale-110 transition-transform"><FlagImg code={c.code} size={32} /></span>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-orange-600 transition-colors text-center leading-tight">{c.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   9. FAQ
   ═══════════════════════════════════════ */
function FAQSection() {
  const [openSet, setOpenSet] = useState(new Set([0]));
  const toggle = (i) => setOpenSet((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const half = Math.ceil(FAQS.length / 2);
  const leftFaqs = FAQS.slice(0, half);
  const rightFaqs = FAQS.slice(half);

  const renderFaq = (faq, i) => {
    const isOpen = openSet.has(i);
    return (
      <div
        key={i}
        className={`rounded-2xl border transition-all ${
          isOpen ? "border-orange-200 bg-orange-50/50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <button
          onClick={() => toggle(i)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Collapse" : "Expand"}: ${faq.q}`}
          className="w-full flex items-start gap-3 px-6 py-5 text-left"
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isOpen ? "bg-orange-500" : "bg-slate-100"
          }`}>
            <ChevronDown size={15} className={`transition-transform ${
              isOpen ? "rotate-180 text-white" : "text-slate-400"
            }`} />
          </div>
          <h3 className={`text-base font-bold transition-colors ${
            isOpen ? "text-orange-700" : "text-slate-800"
          }`}>
            {faq.q}
          </h3>
        </button>
        {isOpen && (
          <div className="px-6 pb-5 pl-16">
            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="px-4 sm:px-6 lg:px-16 pt-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Have questions? We&apos;re here to help.</p>
        </div>
        <a href="/help" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"><HelpCircle size={14} /> Help Center</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        <div className="space-y-3">
          {leftFaqs.map((faq, i) => renderFaq(faq, i))}
        </div>
        <div className="space-y-3">
          {rightFaqs.map((faq, i) => renderFaq(faq, i + half))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   10. STATS + TESTIMONIALS
   ═══════════════════════════════════════ */
function StatsTestimonials() {
  const scrollRef = useRef(null);

  /* PRODUCTION (H2): Fetch live stats from GET /api/stats
     Example: const { data: stats } = useSWR("/api/stats", fetcher);
     The API returns: { averageMarkup, liveDeals, newSuppliers7d } */
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">Trusted by Businesses of All Sizes</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials — 2 rows, horizontal scroll */}
      <div className="relative group/scroll">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-slate-50"
        >
          <ChevronRight size={16} className="text-slate-600" />
        </button>

        <div ref={scrollRef} className="overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="w-72 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.author}</p>
                    <p className="text-[11px] text-slate-400">{t.role} — {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <a href="/testimonials" className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
          All Testimonials <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   MAIN HOMEPAGE — PHASE 7
   ═══════════════════════════════════════ */
export default function Phase7Homepage() {
  /* ── Auth state from DemoAuthContext ───────────────────────
     Supports both real NextAuth session AND demo dropdown overrides.
     ─────────────────────────────────────────────────────────── */
  const { isLoggedIn, isPremium, canViewSupplier } = useDemoAuth();

  return (
    <div className="bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      {/* Page Sections */}
      {/* Shared warehouse background wrapper */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-slate-900/80" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>
        <HeroSection />
        <LatestDealsCarousel />
      </div>
      <CategoriesGrid />
      <TrustSectionBuyers />
      <HotOffersCarousel isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
      <TrustSectionSuppliers />
      <FeaturedSuppliers isPremium={isPremium} isLoggedIn={isLoggedIn} />
      <CountryGrid />
      <FAQSection />
      <StatsTestimonials />
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <CtaBanner />
      </div>

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.7); }
      `}</style>
    </div>
  );
}
