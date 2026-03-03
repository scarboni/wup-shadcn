"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Heart,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  Flame,
  Star,
  Eye,
  ArrowRight,
  AlertTriangle,
  Search,
  X,
  Package,
  Truck,
  CheckCircle2,
  EyeOff,
  Rocket,
  MessageSquare,
  Send,
  ShoppingCart,
  Store,
} from "lucide-react";
import {
  FilterSidebar,
  SearchToolbar,
  Pagination,
  TrendingBanner,
} from "./filters";

/* ─────────── Mock Product Data ─────────── */
const PRODUCTS = [
  {
    id: 1,
    title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", rrp: 59.99, rrpCurrency: "€", markup: 201.8,
    dateAdded: "19/09/2023", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 12, amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35,
    supplier: "Mobile Phones & Accessories Wholesaler", isExpired: false, isDropship: false, negotiable: true,
    category: "Telephony & Mobile Phones",
    description: "Brand new Sony Xperia L1 smartphone featuring a 5.5-inch HD display, 2GB RAM and 16GB internal storage. Runs Android 7.0 Nougat with a 13MP rear camera and 5MP front camera. Ideal for resellers targeting the budget smartphone market with strong margins on Amazon and eBay.",
  },
  {
    id: 2,
    title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm",
    image: "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop",
    price: 4.25, currency: "£", rrp: 24.99, rrpCurrency: "€", markup: 488.0,
    dateAdded: "15/10/2023", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 24, amazonPrice: 24.99, amazonProfit: 8.74, amazonSales: 52,
    ebayPrice: 22.50, ebayProfit: 7.25, ebaySales: 41,
    supplier: "Home & Garden Wholesale Ltd", isExpired: false, isDropship: true,
    category: "Home Supplies",
    description: "Handcrafted Nepalese singing bowl, approximately 550g and 13cm in diameter. Produces a rich, resonant tone perfect for meditation, sound therapy and relaxation. Each bowl is unique with traditional hand-hammered finish. Popular gift item with excellent resale margins.",
  },
  {
    id: 3,
    title: "Lloytron Active Indoor Loop TV Antenna 50db Black",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    price: 3.50, currency: "£", rrp: 19.99, rrpCurrency: "€", markup: 471.1,
    dateAdded: "22/08/2023", grade: "New", country: "DE", countryName: "Germany",
    moq: 50, amazonPrice: 19.99, amazonProfit: 6.49, amazonSales: 28,
    ebayPrice: 17.99, ebayProfit: 5.49, ebaySales: 19,
    supplier: "Electronics Direct Wholesale", isExpired: true, isDropship: false,
    category: "Electrical & Lighting",
    description: "Lloytron active indoor loop antenna with 50dB amplification for improved digital TV reception. Sleek black design suits any room setting. Features adjustable gain control and LED indicator. Suitable for Freeview and other DVB-T services.",
  },
  {
    id: 4,
    title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush",
    image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
    price: 12.50, currency: "£", rrp: 39.99, rrpCurrency: "€", markup: 219.9,
    dateAdded: "05/11/2023", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 6, amazonPrice: 39.99, amazonProfit: 12.49, amazonSales: 89,
    ebayPrice: 34.99, ebayProfit: 9.49, ebaySales: 67,
    supplier: "Health & Beauty Wholesale Co", isExpired: false, isDropship: true,
    category: "Health & Beauty", discount: "10%", firstOrderPromo: "-15% ON YOUR FIRST ORDER",
    description: "Oral-B Vitality Pro D103 electric toothbrush in violet colourway. Features 2D cleaning action with a round brush head that oscillates and rotates to remove more plaque than a manual toothbrush. Includes built-in 2-minute timer and long-lasting rechargeable battery. Genuine branded product in retail box.",
  },
  {
    id: 5,
    title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400&h=400&fit=crop",
    price: 8.75, currency: "£", rrp: 29.99, rrpCurrency: "€", markup: 242.7,
    dateAdded: "01/12/2023", grade: "New", country: "NL", countryName: "Netherlands",
    moq: 10, amazonPrice: 29.99, amazonProfit: 9.24, amazonSales: 44,
    ebayPrice: 27.50, ebayProfit: 7.75, ebaySales: 31,
    supplier: "Sports & Leisure Distribution", isExpired: false, isDropship: false, negotiable: true,
    category: "Sports, Hobbies & Leisure",
    description: "Adidas Feel The Chill gift set featuring Ice Dive fragrance collection. Includes shower gel, deodorant body spray and eau de toilette. Fresh, invigorating scent with a cool menthol finish. Presented in attractive branded packaging, ideal for gifting occasions.",
  },
  {
    id: 6,
    title: "Midnight Chronometer Crafted Precision Timeless Elegance Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    price: 228.04, currency: "€", rrp: 878.59, rrpCurrency: "€", markup: 285.3,
    dateAdded: "10/01/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 3, amazonPrice: 799.99, amazonProfit: 285.95, amazonSales: 8,
    ebayPrice: 749.00, ebayProfit: 234.96, ebaySales: 5,
    supplier: "Luxury Goods Wholesale", isExpired: false, isDropship: false, negotiable: true,
    category: "Jewellery & Watches",
    description: "Premium chronometer watch with midnight black dial and crafted precision movement. Stainless steel case with sapphire crystal glass and genuine leather strap. Water resistant to 50 metres. Comes with full manufacturer warranty and luxury presentation box.",
  },
  {
    id: 7,
    title: "Samsung Galaxy Buds FE Wireless Bluetooth Earbuds",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    price: 32.99, currency: "£", rrp: 99.99, rrpCurrency: "€", markup: 203.1,
    dateAdded: "14/01/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 5, amazonPrice: 89.99, amazonProfit: 28.50, amazonSales: 41,
    ebayPrice: 79.99, ebayProfit: 22.00, ebaySales: 33,
    supplier: "Audio & Tech Wholesale", isExpired: false, isDropship: true,
    category: "Electrical & Lighting", firstOrderPromo: "-10% ON YOUR FIRST ORDER",
    description: "Samsung Galaxy Buds FE wireless earbuds with active noise cancellation and ambient sound mode. Features powerful bass with AKG-tuned sound and up to 30 hours total battery life with charging case. IPX2 water resistant, ideal for workouts and daily commute.",
  },
  {
    id: 8,
    title: "JBL Tune 510BT Wireless On-Ear Headphones Black",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    price: 15.50, currency: "£", rrp: 49.99, rrpCurrency: "€", markup: 222.5,
    dateAdded: "20/01/2024", grade: "New", country: "DE", countryName: "Germany",
    moq: 10, amazonPrice: 44.99, amazonProfit: 13.20, amazonSales: 57,
    ebayPrice: 39.99, ebayProfit: 10.20, ebaySales: 42,
    supplier: "Audio Equipment Direct", isExpired: false, isDropship: false,
    category: "Electrical & Lighting", discount: "15%",
    description: "JBL Tune 510BT wireless on-ear headphones with JBL Pure Bass sound. Up to 40 hours of battery life with quick charge capability — 5 minutes charge gives 2 hours of playback. Lightweight foldable design with soft padded headband for all-day comfort. Multipoint connection allows switching between two Bluetooth devices.",
  },
  {
    id: 9,
    title: "Nike Dri-FIT Running T-Shirt Men's Training Top",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
    price: 6.80, currency: "£", rrp: 34.99, rrpCurrency: "€", markup: 414.6,
    dateAdded: "28/01/2024", grade: "New", country: "NL", countryName: "Netherlands",
    moq: 20, amazonPrice: 29.99, amazonProfit: 10.19, amazonSales: 72,
    ebayPrice: 24.99, ebayProfit: 7.19, ebaySales: 58,
    supplier: "Sportswear Wholesale Europe", isExpired: false, isDropship: true,
    category: "Sports, Hobbies & Leisure",
    description: "Nike Dri-FIT men's running t-shirt engineered with moisture-wicking technology to keep you dry and comfortable during intense workouts. Lightweight, breathable mesh fabric with reflective elements for visibility. Standard fit with crew neck. Available in multiple sizes.",
  },
  {
    id: 10,
    title: "Yankee Candle Large Jar Clean Cotton 623g",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    price: 9.25, currency: "£", rrp: 27.99, rrpCurrency: "€", markup: 202.6,
    dateAdded: "02/02/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 8, amazonPrice: 24.99, amazonProfit: 7.74, amazonSales: 95,
    ebayPrice: 22.50, ebayProfit: 5.25, ebaySales: 78,
    supplier: "Home Fragrance Wholesale", isExpired: false, isDropship: false, negotiable: true,
    category: "Home Supplies",
    description: "Yankee Candle large jar in the classic Clean Cotton fragrance. 623g of premium soy-blend wax with a burn time of 110–150 hours. Features a self-trimming wick for a clean and even burn. The fresh, inviting scent of sun-dried cotton with green notes makes it a perennial bestseller.",
  },
  {
    id: 11,
    title: "Lego Classic Creative Brick Box 10696 Building Set",
    image: "https://images.unsplash.com/photo-1560961911-ba7ef651a2be?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1560961911-ba7ef651a2be?w=400&h=400&fit=crop",
    price: 14.20, currency: "£", rrp: 34.99, rrpCurrency: "€", markup: 146.4,
    dateAdded: "08/02/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 6, amazonPrice: 29.99, amazonProfit: 6.79, amazonSales: 120,
    ebayPrice: 27.99, ebayProfit: 4.79, ebaySales: 88,
    supplier: "Toys & Games Wholesale UK", isExpired: false, isDropship: true,
    category: "Toys & Games", firstOrderPromo: "-15% ON YOUR FIRST ORDER",
    description: "Lego Classic Creative Brick Box 10696 with 484 pieces in 35 different colours. Includes windows, eyes, wheels and hinges for creative building. Comes with a green baseplate and idea booklet. Perfect entry-level Lego set for children aged 4+ and a consistent top seller on all marketplaces.",
  },
  {
    id: 12,
    title: "Dyson Airwrap Complete Long Multi-Styler Nickel/Copper",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54f0e2ed4?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1522338242992-e1a54f0e2ed4?w=400&h=400&fit=crop",
    price: 189.99, currency: "£", rrp: 479.99, rrpCurrency: "€", markup: 152.6,
    dateAdded: "12/02/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 2, amazonPrice: 449.99, amazonProfit: 125.00, amazonSales: 15,
    ebayPrice: 419.99, ebayProfit: 95.00, ebaySales: 11,
    supplier: "Premium Electricals Ltd", isExpired: false, isDropship: false,
    category: "Health & Beauty", discount: "5%",
    description: "Dyson Airwrap Complete Long multi-styler in nickel/copper finish. Engineered to curl, wave, smooth and dry hair using the Coanda effect — no extreme heat required. Includes six attachments for versatile styling. Long barrel designed for longer hair types. Premium retail packaging included.",
  },
  {
    id: 13,
    title: "Philips OneBlade Pro QP6551/15 Face & Body Trimmer",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    price: 22.50, currency: "£", rrp: 69.99, rrpCurrency: "€", markup: 211.1,
    dateAdded: "15/02/2024", grade: "New", country: "DE", countryName: "Germany",
    moq: 8, amazonPrice: 59.99, amazonProfit: 18.49, amazonSales: 63,
    ebayPrice: 54.99, ebayProfit: 14.49, ebaySales: 47,
    supplier: "Personal Care Wholesale", isExpired: false, isDropship: true,
    category: "Health & Beauty",
    description: "Philips OneBlade Pro face and body trimmer with precision comb settings from 0.4mm to 10mm. Features a dual-sided blade for trimming and shaving in one pass. 120-minute runtime on full charge with LED battery indicator. Wet and dry use, fully washable.",
  },
  {
    id: 14,
    title: "Stanley Classic Legendary Bottle 1.0L Hammertone Green",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    price: 11.99, currency: "£", rrp: 44.99, rrpCurrency: "€", markup: 275.1,
    dateAdded: "18/02/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 12, amazonPrice: 39.99, amazonProfit: 14.00, amazonSales: 108,
    ebayPrice: 36.99, ebayProfit: 11.00, ebaySales: 82,
    supplier: "Outdoor Gear Wholesale", isExpired: false, isDropship: false,
    category: "Sports, Hobbies & Leisure", firstOrderPromo: "-10% ON YOUR FIRST ORDER",
    description: "Stanley Classic Legendary vacuum bottle with 1.0 litre capacity in iconic hammertone green. Double-wall vacuum insulation keeps drinks hot for 24 hours or cold for 24 hours. BPA-free, leak-proof and built for life with a lifetime warranty. Ideal for outdoor and camping enthusiasts.",
  },
  {
    id: 15,
    title: "Crocs Classic Clog Unisex Slip On Shoes White",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    price: 8.99, currency: "£", rrp: 39.99, rrpCurrency: "€", markup: 344.9,
    dateAdded: "22/02/2024", grade: "New", country: "NL", countryName: "Netherlands",
    moq: 15, amazonPrice: 34.99, amazonProfit: 12.00, amazonSales: 145,
    ebayPrice: 29.99, ebayProfit: 8.00, ebaySales: 112,
    supplier: "Footwear Direct Europe", isExpired: false, isDropship: true,
    category: "Clothing, Footwear & Accessories",
    description: "Crocs Classic Clog in white, unisex slip-on shoes made from lightweight Croslite foam. Features ventilation ports for breathability and water drainage. Pivoting heel strap for a secure fit. Easy to clean and quick to dry. Available in full size range.",
  },
  {
    id: 16,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    price: 34.50, currency: "£", rrp: 99.99, rrpCurrency: "€", markup: 189.8,
    dateAdded: "25/02/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 4, amazonPrice: 89.99, amazonProfit: 27.49, amazonSales: 76,
    ebayPrice: 82.99, ebayProfit: 20.49, ebaySales: 54,
    supplier: "Kitchen Appliances Wholesale", isExpired: false, isDropship: false,
    category: "Home Supplies", discount: "8%",
    description: "Instant Pot Duo 7-in-1 electric pressure cooker with 6-litre capacity. Combines pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yoghurt maker and food warmer in one appliance. 13 smart programmes with automatic keep-warm function. Stainless steel inner pot is dishwasher safe.",
  },
  {
    id: 17,
    title: "Ray-Ban Wayfarer Classic Sunglasses RB2140 Black",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
    price: 42.00, currency: "£", rrp: 159.99, rrpCurrency: "€", markup: 280.9,
    dateAdded: "01/03/2024", grade: "New", country: "IT", countryName: "Italy",
    moq: 3, amazonPrice: 139.99, amazonProfit: 49.99, amazonSales: 33,
    ebayPrice: 129.99, ebayProfit: 39.99, ebaySales: 26,
    supplier: "Fashion Accessories EU", isExpired: false, isDropship: true,
    category: "Clothing, Footwear & Accessories",
    description: "Ray-Ban Wayfarer Classic RB2140 sunglasses in black with green G-15 lenses. Iconic design with acetate frame and metal hinges. Provides 100% UV protection. Comes with original Ray-Ban case, cleaning cloth and certificate of authenticity.",
  },
  {
    id: 18,
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    price: 38.75, currency: "£", rrp: 109.99, rrpCurrency: "€", markup: 183.8,
    dateAdded: "05/03/2024", grade: "New", country: "UK", countryName: "United Kingdom",
    moq: 5, amazonPrice: 99.99, amazonProfit: 30.24, amazonSales: 52,
    ebayPrice: 89.99, ebayProfit: 21.24, ebaySales: 38,
    supplier: "IT Peripherals Wholesale", isExpired: false, isDropship: false,
    category: "Computing",
    description: "Logitech MX Master 3S wireless performance mouse with 8K DPI optical sensor and quiet clicks. Features MagSpeed electromagnetic scroll wheel and ergonomic design for all-day comfort. Works on virtually any surface including glass. USB-C quick charging — 1 minute charge gives 3 hours of use.",
  },
  {
    id: 19,
    title: "Puma RS-X Reinvention Running Shoes Unisex",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    price: 19.99, currency: "£", rrp: 84.99, rrpCurrency: "€", markup: 325.1,
    dateAdded: "08/03/2024", grade: "New", country: "PL", countryName: "Poland",
    moq: 10, amazonPrice: 74.99, amazonProfit: 26.00, amazonSales: 68,
    ebayPrice: 64.99, ebayProfit: 16.00, ebaySales: 51,
    supplier: "Branded Footwear Wholesale PL", isExpired: false, isDropship: true,
    category: "Clothing, Footwear & Accessories", firstOrderPromo: "-15% ON YOUR FIRST ORDER",
    description: "Puma RS-X Reinvention unisex running shoes with bold colour blocking and retro-inspired design. Features a thick cushioned midsole for superior comfort and a rubber outsole for grip. Mesh and leather upper provides breathability and durability. Runs true to size.",
  },
  {
    id: 20,
    title: "Le Creuset Signature Cast Iron Round Casserole 24cm",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    price: 89.99, currency: "£", rrp: 275.00, rrpCurrency: "€", markup: 205.6,
    dateAdded: "10/03/2024", grade: "New", country: "FR", countryName: "France",
    moq: 2, amazonPrice: 249.00, amazonProfit: 79.01, amazonSales: 22,
    ebayPrice: 229.00, ebayProfit: 59.01, ebaySales: 15,
    supplier: "Premium Cookware EU", isExpired: false, isDropship: false,
    category: "Home Supplies",
    description: "Le Creuset Signature cast iron round casserole in 24cm diameter. Enamelled interior resists staining, dulling and damage. Superior heat distribution and retention. Tight-fitting lid locks in moisture and flavour. Suitable for all heat sources including induction. Oven safe up to 260°C.",
  },
];

// Flat flag images via flagcdn.com
const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };
function FlagImg({ code, size = 20 }) {
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}
const FLAGS = Object.fromEntries(
  Object.keys(FLAG_CODES).map((k) => [k, <FlagImg key={k} code={k} size={18} />])
);

const RELATED_SEARCHES = [
  "Sports & Fitness Supplies", "Footwear, Shirts & Shoes", "Trainers & Sportswear",
  "High quality t-shirt wholesale", "Leather wholesale", "Mountain boots wholesale",
  "Basketball", "Badminton", "Boxing",
  "Gym & Fitness", "Tennis Table", "Sports Accessories",
];

/* ═══════════════════════════════════════════════════
   TRENDING DEALS PANEL — Featured top-selling deals
   ═══════════════════════════════════════════════════ */
function TrendingDealsPanel({ products, isPremium = false, isLoggedIn = false }) {
  const scrollRef = useRef(null);
  // Show up to 8 non-expired products for trending
  const trending = products.filter((p) => !p.isExpired).slice(0, 20);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-4 sm:p-5 mb-6 shadow-lg relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Flame size={16} className="text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Trending Deals <span className="text-sm font-semibold text-orange-100">(Top Selling This Week)</span>
          </h2>
        </div>
        {/* Scroll arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button onClick={() => scroll("left")} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronLeft size={14} className="text-white" />
          </button>
          <button onClick={() => scroll("right")} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronRight size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 -mb-1 snap-x snap-mandatory scrollbar-hide">
        {trending.map((product) => (
          <div key={product.id} className="shrink-0 w-[75%] min-w-[220px] sm:w-[48%] sm:min-w-[240px] md:w-[36%] lg:w-[30%] xl:w-[24%] 2xl:w-[18%] snap-start">
            <TrendingDealCard product={product} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendingDealCard({ product, isPremium, isLoggedIn }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={24} className="text-slate-300" />
          <p className="text-xs font-semibold text-slate-500">Deal hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1 text-[10px] font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={10} /> Unhide
          </button>
        </div>
      )}
      {/* Image with overlays */}
      <a href="/deal" className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Markup badge (top-right) */}
        <div className="absolute top-2 right-2 px-1.5 py-1 bg-emerald-500 text-white text-[9px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
          <Flame size={9} /> {product.markup}%
        </div>
        {/* Price badge (bottom-left on image) */}
        <div className="absolute bottom-2 left-2 flex flex-col items-start">
          {product.discount && (
            <div className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-t-md">{product.discount} DISCOUNT</div>
          )}
          <div className={`${product.discount ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2 py-0.5 shadow-sm`}>
            <span className={`text-sm font-extrabold ${product.discount ? "text-white" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
            <span className={`text-[8px] ml-0.5 ${product.discount ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
          </div>
        </div>
        {/* NEW / DROPSHIP badges (top-left) */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {product.grade && (
            <span className="px-1.5 py-1 text-[9px] font-extrabold bg-emerald-500 text-white rounded-md shadow-sm">
              {product.grade.toUpperCase()}
            </span>
          )}
          {product.isDropship && (
            <span className="px-1.5 py-1 text-[9px] font-extrabold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-0.5">
              <Truck size={9} /> DROPSHIP
            </span>
          )}
          {product.negotiable && (
            <span className="px-1.5 py-1 text-[9px] font-extrabold bg-orange-500 text-white rounded-md shadow-sm">
              NEGOTIABLE
            </span>
          )}
        </div>
        {/* Hide + Favourite buttons (bottom-right, hover only) */}
        <div className={`absolute bottom-2 right-2 flex flex-col gap-1 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button onClick={(e) => { e.preventDefault(); setHidden(true); }}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
            <EyeOff size={12} className="text-slate-400" />
          </button>
          <button onClick={(e) => { e.preventDefault(); setFaved(!faved); }}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${faved ? "bg-red-500 hover:bg-red-600" : "bg-white/90 backdrop-blur-sm hover:bg-white"}`}>
            <Heart size={12} className={faved ? "fill-white text-white" : "text-slate-400"} />
          </button>
        </div>
      </a>

      {/* Content */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1">
        {/* First order promo (above title) */}
        {product.firstOrderPromo && (
          <div className="mb-1.5">
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded">{product.firstOrderPromo}</span>
          </div>
        )}

        {/* Title */}
        <a href="/deal">
          <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-2">
            {product.title}
          </h3>
        </a>

        {/* Profit rows */}
        <div className="border-t border-slate-100 text-[11px]">
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100">
            <span className="text-slate-400 font-semibold w-9">RRP</span>
            <span className="text-slate-500 flex-1">{product.rrpCurrency}{product.rrp.toFixed(2)}</span>
            <span className="text-emerald-600 font-bold">{product.rrpCurrency}{product.amazonProfit.toFixed(2)} / {product.amazonSales}</span>
          </div>
          <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors">
            <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
            <span className="text-slate-500 flex-1">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
            <span className="font-bold" style={{color: "#FF9900"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)} / {product.amazonSales}</span>
          </a>
          <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between py-1.5 hover:bg-blue-50/50 rounded transition-colors">
            <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto" /></div>
            <span className="text-slate-500 flex-1">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
            <span className="font-bold" style={{color: "#0064D2"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)} / {product.ebaySales}</span>
          </a>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2">
          {isPremium ? (
            <button onClick={() => setContactOpen(true)} className="w-full py-1.5 rounded-lg text-[10px] font-bold text-center text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-1">
              <MessageSquare size={10} /> Message Supplier
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="w-full py-1.5 rounded-lg text-[10px] font-bold text-center text-orange-600 border border-orange-200 hover:bg-orange-50 transition-all flex items-center justify-center gap-1">
              <Rocket size={10} /> Upgrade Now
            </a>
          ) : (
            <a href="/pricing" className="w-full py-1.5 rounded-lg text-[10px] font-bold text-center text-orange-600 border border-orange-200 hover:bg-orange-50 transition-all flex items-center justify-center gap-1">
              <Lock size={10} /> Join Now
            </a>
          )}
        </div>
      </div>

      {contactOpen && <ContactSupplierModal product={product} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT SUPPLIER MODAL
   ═══════════════════════════════════════════════════ */
function ContactSupplierModal({ product, onClose }) {
  const [subject, setSubject] = useState(`Enquiry about: ${product.title}`);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare size={18} className="text-orange-400" />
            <h3 className="text-white font-bold text-base">Contact Supplier</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">Message Sent!</h4>
            <p className="text-sm text-slate-500">The supplier will respond to your enquiry shortly.</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            {/* Product info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">{product.title}</p>
                <p className="text-xs text-slate-500">{product.currency}{product.price.toFixed(2)} ex.VAT</p>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Hi, I'm interested in this product. Could you provide more details about pricing for bulk orders, minimum order quantities, and delivery options?"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleSend} className="px-5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all shadow-sm flex items-center gap-1.5">
                <Send size={14} /> Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DETAILED DEAL CARD — main card for the deals grid
   ═══════════════════════════════════════════════════ */
function DetailedDealCard({ product, isPremium = false, isLoggedIn = false }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-xl border overflow-hidden transition-all duration-300 group flex flex-col ${
        product.isExpired
          ? "border-slate-200"
          : "border-slate-200 hover:shadow-lg hover:border-orange-200"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      {/* Image Section */}
      <a href="/deal" className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img
          src={hovered && product.imageHover ? product.imageHover : product.image}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.isExpired ? "grayscale" : ""}`}
        />
        {product.isExpired && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 -rotate-6">
              <AlertTriangle size={16} /> SOLD OUT
            </div>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {!product.isExpired && (
            <span className="px-2 py-1 text-[10px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
              {product.grade.toUpperCase()}
            </span>
          )}
          {product.isDropship && (
            <span className="px-2 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Truck size={10} /> DROPSHIP
            </span>
          )}
          {product.negotiable && (
            <span className="px-2 py-1 text-[10px] font-bold bg-orange-500 text-white rounded-md shadow-sm">
              NEGOTIABLE
            </span>
          )}
        </div>
        {/* Markup badge (top-right) */}
        <div className={`absolute top-2.5 right-2.5 px-2 py-1 ${product.isExpired ? "bg-slate-400" : "bg-emerald-500"} text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm`}>
          <TrendingUp size={10} /> {product.markup}%
        </div>
        {/* Price badge (bottom-left, on image) */}
        <div className="absolute bottom-2.5 left-2.5 flex flex-col items-start">
          {product.discount && !product.isExpired && (
            <div className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-t-md">{product.discount} DISCOUNT</div>
          )}
          <div className={`${product.discount && !product.isExpired ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
            <span className={`text-base font-extrabold ${product.discount && !product.isExpired ? "text-white" : product.isExpired ? "text-slate-400" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
            <span className={`text-[9px] ml-1 ${product.discount && !product.isExpired ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
          </div>
        </div>
        {/* Hide + Favourite buttons (bottom-right, hover only) */}
        <div className={`absolute bottom-2.5 right-2.5 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button onClick={(e) => { e.preventDefault(); setHidden(true); }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
            <EyeOff size={14} className="text-slate-400" />
          </button>
          <button onClick={(e) => { e.preventDefault(); setFaved(!faved); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${faved ? "bg-red-500 hover:bg-red-600" : "bg-white/90 backdrop-blur-sm hover:bg-white"}`}>
            <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
          </button>
        </div>
      </a>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {product.firstOrderPromo && (
          <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{product.firstOrderPromo}</span></div>
        )}
        <a href="/deal">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </a>

        {/* Profit Calculations — V3 Minimal + brand accents */}
        <div className="mt-3 border-t border-slate-100">
          {/* Column headers */}
          <div className="flex items-center px-1 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            <span className="w-10 shrink-0" />
            <span className="flex-1">Price</span>
            <span>Profit</span>
          </div>
          {/* RRP */}
          <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
            <span className="text-xs font-bold text-slate-400 w-10 shrink-0">RRP</span>
            <span className="flex-1 text-xs text-slate-500 tabular-nums">{product.rrpCurrency}{product.rrp.toFixed(2)}</span>
            <span className={`text-xs font-bold tabular-nums ${product.isExpired ? "text-slate-400" : "text-emerald-600"}`}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
          </div>
          {/* Amazon */}
          {!product.isExpired ? (
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-1 py-2 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 text-xs text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
              <span className="text-xs font-bold tabular-nums" style={{color: "#FF9900"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
            </a>
          ) : (
            <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
              <div className="w-10 shrink-0 flex items-center grayscale opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 text-xs text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
              <span className="text-xs font-bold tabular-nums" style={{color: "#94a3b8"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
            </div>
          )}
          {/* eBay */}
          {!product.isExpired ? (
            <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-1 py-2 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 text-xs text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
              <span className="text-xs font-bold tabular-nums" style={{color: "#0064D2"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
            </a>
          ) : (
            <div className="flex items-center px-1 py-2">
              <div className="w-10 shrink-0 flex items-center grayscale opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 text-xs text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
              <span className="text-xs font-bold tabular-nums" style={{color: "#94a3b8"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* CTA — pinned to bottom */}
        <div className="mt-auto pt-3.5">
          {isPremium ? (
            <button onClick={() => setContactOpen(true)} className="w-full py-2.5 rounded-lg text-xs font-bold text-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <MessageSquare size={12} /> Message Supplier
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="w-full py-2.5 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <Rocket size={12} /> Upgrade Now
            </a>
          ) : (
            <a href="/pricing" className="w-full py-2.5 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <Lock size={12} /> Join Now
            </a>
          )}
        </div>
      </div>

      {/* Contact Supplier Modal */}
      {contactOpen && <ContactSupplierModal product={product} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIST DEAL CARD — horizontal row variant
   ═══════════════════════════════════════════════════ */
function ListDealCard({ product, isPremium = false, isLoggedIn = false }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  const DESC_LIMIT = 120;
  const desc = product.description || "";
  const isLong = desc.length > DESC_LIMIT;
  const displayDesc = showFullDesc || !isLong ? desc : desc.slice(0, DESC_LIMIT).replace(/\s+\S*$/, "") + "…";

  return (
    <div
      className={`relative bg-white rounded-xl border overflow-hidden transition-all duration-300 group ${
        product.isExpired
          ? "border-slate-200"
          : "border-slate-200 hover:shadow-lg hover:border-orange-200"
      }`}
    >
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

      <div className="flex">
        {/* Image */}
        <a href="/deal" className="relative w-44 sm:w-52 shrink-0 bg-slate-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.isExpired ? "grayscale" : ""}`}
          />
          {product.isExpired && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1 -rotate-6">
                <AlertTriangle size={12} /> SOLD OUT
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {!product.isExpired && (
              <span className="px-1.5 py-1 text-[9px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
                {product.grade.toUpperCase()}
              </span>
            )}
            {product.isDropship && (
              <span className="px-1.5 py-1 text-[9px] font-bold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-0.5">
                <Truck size={9} /> DROPSHIP
              </span>
            )}
          </div>
          {/* Price badge */}
          <div className="absolute bottom-2 left-2 flex flex-col items-start">
            {product.discount && !product.isExpired && (
              <div className="bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-t-md">{product.discount} DISCOUNT</div>
            )}
            <div className={`${product.discount && !product.isExpired ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2 py-0.5 shadow-sm`}>
              <span className={`text-sm font-extrabold ${product.discount && !product.isExpired ? "text-white" : product.isExpired ? "text-slate-400" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
              <span className={`text-[8px] ml-0.5 ${product.discount && !product.isExpired ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
            </div>
          </div>
          {/* Markup badge */}
          <div className={`absolute top-2 right-2 px-1.5 py-1 ${product.isExpired ? "bg-slate-400" : "bg-emerald-500"} text-white text-[9px] font-bold rounded-md flex items-center gap-0.5 shadow-sm`}>
            <TrendingUp size={9} /> {product.markup}%
          </div>
        </a>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {product.firstOrderPromo && (
                <div className="mb-1"><span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">{product.firstOrderPromo}</span></div>
              )}
              <a href="/deal">
                <h3 className="text-base font-semibold text-slate-800 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </a>
              {/* Description — 2 lines max with Show More */}
              {desc && (
                <div className="mt-1.5">
                  <p className={`text-sm text-slate-500 leading-relaxed ${showFullDesc ? "" : "line-clamp-2"}`}>
                    {desc}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-0.5 text-sm text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                    >
                      {showFullDesc ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              <button onClick={() => setHidden(true)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                <EyeOff size={14} className="text-slate-400" />
              </button>
              <button onClick={() => setFaved(!faved)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${faved ? "bg-red-500 shadow-sm hover:bg-red-600" : "border border-slate-200 hover:bg-slate-50"}`}>
                <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
              </button>
            </div>
          </div>

          {/* Pricing — single inline row */}
          <div className="mt-3 flex items-center gap-5 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">RRP</span>
              <span className="text-slate-500 tabular-nums">{product.rrpCurrency}{product.rrp.toFixed(2)}</span>
              <span className={`font-bold tabular-nums ${product.isExpired ? "text-slate-400" : "text-emerald-600"}`}>+{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
            </div>
            {!product.isExpired ? (
              <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:bg-orange-50/50 rounded px-1 -mx-1 py-0.5 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" />
                <span className="text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
                <span className="font-bold tabular-nums" style={{color: "#FF9900"}}>+{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4 grayscale opacity-40" />
                <span className="text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
                <span className="font-bold tabular-nums" style={{color: "#94a3b8"}}>+{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
              </div>
            )}
            {!product.isExpired ? (
              <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:bg-blue-50/50 rounded px-1 -mx-1 py-0.5 transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto" />
                <span className="text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
                <span className="font-bold tabular-nums" style={{color: "#0064D2"}}>+{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto grayscale opacity-40" />
                <span className="text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
                <span className="font-bold tabular-nums" style={{color: "#94a3b8"}}>+{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* CTA — pinned to bottom */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            {isPremium ? (
              <button onClick={() => setContactOpen(true)} className="px-6 py-2 rounded-lg text-xs font-bold text-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all inline-flex items-center gap-1.5">
                <MessageSquare size={12} /> Message Supplier
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="px-6 py-2 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all inline-flex items-center gap-1.5">
                <Rocket size={12} /> Upgrade Now
              </a>
            ) : (
              <a href="/pricing" className="px-6 py-2 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all inline-flex items-center gap-1.5">
                <Lock size={12} /> Join Now
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Contact Supplier Modal */}
      {contactOpen && <ContactSupplierModal product={product} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   COLLAPSIBLE FILTER PANEL — with expand/retract toggle
   ═══════════════════════════════════════════════════ */
function CollapsibleFilterPanel({ filters, setFilters, mobileFilterOpen, setMobileFilterOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex">
      {/* Filter sidebar */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? "w-0" : "w-72"}`}>
        <div className="w-72">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            hideRating
          />
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-5 top-12 w-5 h-12 bg-orange-600 hover:bg-orange-500 rounded-r-full flex items-center justify-center transition-colors z-10 shadow-lg"
        title={collapsed ? "Show filters" : "Hide filters"}
        style={{ left: collapsed ? "-5px" : undefined }}
      >
        <ChevronDown size={14} className={`text-white transition-transform ${collapsed ? "-rotate-90" : "rotate-90"}`} />
      </button>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="w-5 h-12 bg-orange-600 hover:bg-orange-500 rounded-r-full flex items-center justify-center transition-colors z-10 shadow-lg shrink-0 mt-12"
          title="Show filters"
        >
          <ChevronDown size={14} className="text-white -rotate-90" />
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BREADCRUMB
   ═══════════════════════════════════════════════════ */
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          {item.href ? (
            <a href={item.href} className="hover:text-orange-500 transition-colors">{item.label}</a>
          ) : (
            <span className="text-slate-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════
   HOT OFFERS SECTION — repeatable section with deal grid
   ═══════════════════════════════════════════════════ */
function HotOffersSection({ title, subtitle, products, isPremium, isLoggedIn = false, hideHeader = false, viewMode = "grid" }) {
  return (
    <div className="mb-8">
      {!hideHeader && (
        <div className="flex items-end justify-between mb-4">
          <div>
            {subtitle && (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{subtitle}</p>
            )}
            <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">Get instant access to the latest and most popular wholesale and drop-ship opportunities.</p>
          </div>
          <a href="/deals" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors shrink-0">
            View all <ArrowRight size={14} />
          </a>
        </div>
      )}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {products.map((p) => (
            <ListDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => (
            <DetailedDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   RELATED SEARCHES
   ═══════════════════════════════════════════════════ */
function RelatedSearches() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
      <h3 className="text-lg font-extrabold text-slate-900 text-center mb-4">Related Searches</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {RELATED_SEARCHES.map((term) => (
          <a key={term} href="#" className="px-3 py-2 text-sm text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-slate-100 transition-colors text-center">
            {term}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRUST / STATS SECTION
   ═══════════════════════════════════════════════════ */
function TrustSection() {
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleDeals as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
  ];

  const scrollRef = useRef(null);

  return (
    <div className="mt-12">
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
        {/* Scroll arrows */}
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

        <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {testimonials.map((t) => (
              <div key={t.name} className="w-72 bg-white rounded-xl border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - t.rating }, (_, i) => (
                    <Star key={`e${i}`} size={12} className="text-slate-200" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">— {t.location}</p>
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SEO CONTENT SECTION
   ═══════════════════════════════════════════════════ */
function SeoSection() {
  return (
    <div className="mt-10">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">Sports, hobbies &amp; leisure</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          The sports industry is a developing community. The notion of being fit is constantly growing in trend. Why not to make use of the demand for the accessories related to exercise to make more profit?
        </p>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Are you running an e-shop or let alone an online wholesale store that offers products related to some sport activity? Offer your customers even more types of products at a better price: describe the categories in your inventory. Most of us consider regular stocks of sports and leisure accessories. This way you can buy quality goods for a fraction of their full list value, and then sell them to a wider consumer base to increase revenue.
        </p>
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">Wholesale sporting goods - variety of offers</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          For sole proprietors, all sporting goods delivered to your party by wholesalers include a variety of products. These are often very common and/or automotive commodities that can be easily traded in both wholesale and retail to any end customer.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CTA BANNER
   ═══════════════════════════════════════════════════ */
function CtaBanner() {
  return (
    <div className="mt-12 bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
      {/* Left illustrations — category-icon style (#1E293B strokes + #FED7AA accent) */}
      <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        {/* Shopping bag */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="52" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <rect x="25" y="42" width="50" height="38" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M38 42V32a12 12 0 0 1 24 0v10" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="52" r="2.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="2.5" fill="#1E293B" />
        </svg>
        {/* Price tag */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="48" rx="26" ry="24" fill="#FED7AA" opacity="0.5" />
          <path d="M20 20h28l28 28-22 22L20 48V20z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <circle cx="34" cy="34" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M48 52l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 58l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Package box */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{width: "4.5rem", height: "4.5rem"}}>
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M16 35l34-17 34 17v30L50 82 16 65V35z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <path d="M16 35l34 17 34-17" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M50 52v30" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M33 27l34 17" stroke="#1E293B" strokeWidth="1.5" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* Right illustrations — category-icon style */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        {/* Search / magnifying glass */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="42" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <circle cx="42" cy="42" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M56 56l22 22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 36a12 12 0 0 1 12-9" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
        {/* Rising chart */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 78h64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 78V22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 64l14-12 12 6 14-20 14-12" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="26" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <circle cx="80" cy="26" r="1.5" fill="#1E293B" />
        </svg>
        {/* Handshake / deal */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{width: "4.5rem", height: "4.5rem"}}>
          <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 50l14-14 10 4 8-8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 32l10 10 4-10 18 18" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 54l8 8 12-6 8 8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="50" r="3" fill="#1E293B" opacity="0.15" />
          <circle cx="72" cy="50" r="3" fill="#1E293B" opacity="0.15" />
        </svg>
      </div>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-lg mx-auto">
        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Get Started!</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
          Ready to Increase Your<br />Profits?
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Join thousands of retailers and suppliers already growing their business on WholesaleUp.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/register?type=retailer" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300">
            <ShoppingCart size={16} />
            I want to buy
          </a>
          <a href="/register?type=supplier" className="inline-flex items-center gap-2.5 px-7 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-lg shadow-orange-200 hover:shadow-orange-300">
            <Store size={16} />
            I want to sell
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — /deals page
   ═══════════════════════════════════════════════════ */
export default function DealsPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync with global demo auth bar in AppLayout
  useEffect(() => {
    const handler = (e) => {
      setIsLoggedIn(e.detail.loggedIn);
      setIsPremium(e.detail.premium || false);
    };
    window.addEventListener("demo-auth", handler);
    return () => window.removeEventListener("demo-auth", handler);
  }, []);

  const [filters, setFilters] = useState({
    rating: null,
    category: null,
    subcategory: null,
    priceMin: "",
    priceMax: "",
    countries: [],
    dropshipping: false,
    grades: [],
    keyword: "",
  });
  const [sortBy, setSortBy] = useState("latest");
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Triple the products for more realistic grid
  const allProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS].map((p, i) => ({ ...p, id: i + 1 }));
  const visibleProducts = allProducts.filter((p) => !p.isExpired);
  const gridProducts = allProducts; // includes expired deals in main grid

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main content area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Deals" },
        ]} />

        {/* Layout: Filter Sidebar + Content */}
        <div className="flex gap-6 items-start">
          {/* Collapsible Filter Panel */}
          <div className="hidden lg:block relative shrink-0 sticky top-[90px] self-start">
            <div className={`max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 ease-in-out ${filterCollapsed ? "w-0" : "w-72"}`}>
              <div className="w-72">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  isOpen={mobileFilterOpen}
                  onClose={() => setMobileFilterOpen(false)}
                  hideRating
                />

                {/* Join Today Promo Panel */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  {/* Illustration */}
                  <div className="bg-gradient-to-b from-orange-50 to-orange-100/60 flex items-center justify-center pt-4 pb-0">
                    <img
                      src="https://wholesaledeals.vercel.app/assets/images/v3/deals/deals-vector.svg"
                      alt="Join Today"
                      className="w-48 h-auto"
                    />
                  </div>
                  {/* Content */}
                  <div className="px-5 pb-5 pt-3 bg-gradient-to-b from-orange-50/40 to-white">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-3 text-center">Join Today</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Unlock tens of thousands of verified liquidation, wholesale, and dropshipping suppliers from across the EU, UK, North America, and beyond.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Source fast-selling products at profit margins of 45% to 95%, all backed by our custom sourcing guarantee — ensuring you find the suppliers you need at the profits you deserve.
                    </p>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-1 text-center">
                      Ready to supercharge your retail business?
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Wholesale Deals: the web&apos;s largest and most trusted source of verified trade distributors.
                    </p>
                    <div className="text-center">
                      <a href="/register" className="inline-flex px-8 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-full transition-all shadow-sm">
                        Join Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Filter toggle button — outside the overflow-hidden scroll area */}
            <button
              onClick={() => setFilterCollapsed(!filterCollapsed)}
              className={`absolute top-[52px] w-3 h-16 bg-orange-600 hover:bg-orange-500 rounded-r flex items-center justify-center transition-all z-10 shadow-md ${
                filterCollapsed ? "left-0" : "-right-3"
              }`}
              title={filterCollapsed ? "Show filters" : "Hide filters"}
            >
              <ChevronDown size={10} className={`text-white transition-transform ${filterCollapsed ? "-rotate-90" : "rotate-90"}`} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <SearchToolbar
              title="Deals"
              totalCount={4691}
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
              inlineSearch={inlineSearch}
              setInlineSearch={setInlineSearch}
              onToggleMobileFilter={() => setMobileFilterOpen(!mobileFilterOpen)}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Trending Deals Panel */}
            <div className="mt-6">
              <TrendingDealsPanel products={visibleProducts} isPremium={isPremium} isLoggedIn={isLoggedIn} />
            </div>

            {/* Deals Grid — single continuous block */}
            <div className="mb-8">
              {viewMode === "list" ? (
                <div className="space-y-3">
                  {gridProducts.slice(0, 18).map((p) => (
                    <ListDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                  {gridProducts.slice(0, 18).map((p) => (
                    <DetailedDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              total={897}
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
            />

            {/* SEO Content */}
            <SeoSection />

            {/* Related Searches */}
            <RelatedSearches />

            {/* Trust Section */}
            <TrustSection />

            {/* CTA Banner */}
            <CtaBanner />
          </div>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
      )}
      {/* Mobile filter sidebar — rendered outside the hidden lg:block wrapper */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm transition-transform duration-300 ${mobileFilterOpen ? "translate-x-0" : "translate-x-full"}`}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          hideRating
        />
      </div>
      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ── Named exports for homepage and other pages ── */
export { DetailedDealCard, ListDealCard, PRODUCTS, FLAGS };
