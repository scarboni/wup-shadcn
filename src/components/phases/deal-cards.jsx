"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import Image from "next/image";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
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
  EyeOff,
  Rocket,
  MessageSquare,
  ShoppingCart,
  Store,
  ImageOff,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  RotateCcw,
  Zap,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import {
  FilterSidebar,
  SearchToolbar,
  Pagination,
  TrendingBanner,
} from "./filters";
import ContactSupplierModal from "@/components/shared/contact-modal";
import { CollapsibleFilterPanel } from "@/components/shared/collapsible-filter-panel";
import Breadcrumb from "@/components/shared/breadcrumb";
import { FILTER_CATEGORIES, getCategoryById, getSubcategoryById } from "@/lib/categories";
import { COUNTRIES as CANONICAL_COUNTRIES } from "@/lib/countries";
import BroadMatchSeparator from "@/components/shared/broad-match-separator";

/* ─── No-image placeholder — carton box icon ─── */
function NoImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <Package size={56} className="text-slate-200" />
    </div>
  );
}

/* ─────────── Placeholder Product Data (H1, H2) ─────────────
   PRODUCTION: Replace with data from API:
   - PRODUCTS       → GET /api/deals?view=full&limit=20&offset=0
   - RELATED_SEARCHES → derive from current filters or GET /api/deals/related-searches
   SEED: prisma/seed.ts → seedDeals(), seedTestimonials(), seedPlatformStats()
   Use SWR/React Query for client-side fetching with pagination.

   🔧 PRODUCTION SEO — ItemList JSON-LD (schema.org/ItemList):
   When deals come from API, emit <script type="application/ld+json"> with:
   {
     "@context": "https://schema.org", "@type": "ItemList",
     "name": "Wholesale Deals",
     "numberOfItems": totalCount,
     "itemListElement": deals.map((deal, i) => ({
       "@type": "ListItem",
       "position": i + 1 + (page - 1) * perPage,
       "url": `https://wholesaleup.com/deals/${deal.slug}`
     }))
   }
   See pricing.jsx FAQSection for working JSON-LD pattern.
   See also: SEO skill Section 12.3 (Schema Map).

   🔧 PRODUCTION SEO — Pagination rel="next" / rel="prev" (M2):
   When server-side pagination is wired (page.tsx fetches page N):
   - Add to metadata: links: [
       { rel: "prev", url: page > 1 ? `/deals?page=${page-1}` : undefined },
       { rel: "next", url: page < totalPages ? `/deals?page=${page+1}` : undefined },
     ]
   - Add noindex to filter combinations: ?sort=price&category=X&page=3
     → robots: { index: false, follow: true }
   ─────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", rrp: 59.99, rrpCurrency: "€", markup: 201.8,
    dateAdded: "19/09/2023", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 12, amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35,
    supplier: "Mobile Phones & Accessories Wholesaler", isExpired: false, isDropship: false, negotiable: true,
    isSupplierPro: true,
    buyerTypesServed: ["shop-retailer", "online-retailer", "marketplace-seller"],
    category: "Telephony & Mobile Phones", categories: ["telephony-mobile-phones"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Sony"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 450,
    description: "Brand new Sony Xperia L1 smartphone featuring a 5.5-inch HD display, 2GB RAM and 16GB internal storage. Runs Android 7.0 Nougat with a 13MP rear camera and 5MP front camera. Ideal for resellers targeting the budget smartphone market with strong margins on Amazon and eBay.",
  },
  {
    id: 2,
    title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm",
    image: "https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=400&fit=crop",
    price: 4.25, currency: "£", rrp: 24.99, rrpCurrency: "€", markup: 488.0,
    dateAdded: "15/10/2023", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 24, amazonPrice: 24.99, amazonProfit: 8.74, amazonSales: 52,
    ebayPrice: 22.50, ebayProfit: 7.25, ebaySales: 41,
    supplier: "Home & Garden Wholesale Ltd", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "market-trader", "online-retailer"],
    category: "Home Supplies", categories: ["home-supplies"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: [],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: [], priceValidUntil: "", availableQuantity: 320,
    description: "Handcrafted Nepalese singing bowl, approximately 550g and 13cm in diameter. Produces a rich, resonant tone perfect for meditation, sound therapy and relaxation. Each bowl is unique with traditional hand-hammered finish. Popular gift item with excellent resale margins.",
  },
  {
    id: 3,
    title: "Lloytron Active Indoor Loop TV Antenna 50db Black",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    price: 3.50, currency: "£", rrp: 19.99, rrpCurrency: "€", markup: 471.1,
    dateAdded: "22/08/2023", grade: "New", country: "DE", countryName: "Germany", stockLocation: "Poland", stockLocationCode: "pl",
    moq: 50, amazonPrice: 19.99, amazonProfit: 6.49, amazonSales: 28,
    ebayPrice: 17.99, ebayProfit: 5.49, ebaySales: 19,
    supplier: "Electronics Direct Wholesale", isExpired: true, isDropship: false,
    isSupplierPro: true,
    buyerTypesServed: ["online-retailer", "marketplace-seller", "dropshipper"],
    category: "Electrical & Lighting", categories: ["electrical-lighting"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Lloytron"],
    shippingCountries: ["de"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 150,
    description: "Lloytron active indoor loop antenna with 50dB amplification for improved digital TV reception. Sleek black design suits any room setting. Features adjustable gain control and LED indicator. Suitable for Freeview and other DVB-T services.",
  },
  {
    id: 4,
    title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush",
    image: null,
    imageHover: null,
    price: 12.50, currency: "£", rrp: 39.99, rrpCurrency: "€", markup: 219.9,
    dateAdded: "05/11/2023", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 6, amazonPrice: 39.99, amazonProfit: 12.49, amazonSales: 89,
    ebayPrice: 34.99, ebayProfit: 9.49, ebaySales: 67,
    supplier: "Health & Beauty Wholesale Co", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "wholesaler-reseller"],
    category: "Health & Beauty", categories: ["health-beauty"],
    vat: "ex. VAT", discountPercentage: 10, firstOrderDiscount: { percentage: "15", label: "-15% ON YOUR FIRST ORDER" },
    brands: ["Oral-B"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "DDP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 280,
    description: "Oral-B Vitality Pro D103 electric toothbrush in violet colourway. Features 2D cleaning action with a round brush head that oscillates and rotates to remove more plaque than a manual toothbrush. Includes built-in 2-minute timer and long-lasting rechargeable battery. Genuine branded product in retail box.",
  },
  {
    id: 5,
    title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=400&h=400&fit=crop",
    price: 8.75, currency: "£", rrp: 29.99, rrpCurrency: "€", markup: 242.7,
    dateAdded: "01/12/2023", grade: "New", country: "NL", countryName: "Netherlands", stockLocation: "Germany", stockLocationCode: "de",
    moq: 10, amazonPrice: 29.99, amazonProfit: 9.24, amazonSales: 44,
    ebayPrice: 27.50, ebayProfit: 7.75, ebaySales: 31,
    supplier: "Sports & Leisure Distribution", isExpired: false, isDropship: false, negotiable: true,
    isSupplierPro: true,
    buyerTypesServed: ["shop-retailer", "multi-chain", "online-retailer"],
    category: "Sports, Hobbies & Leisure", categories: ["sports-hobbies-leisure"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Adidas"],
    shippingCountries: ["nl"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 380,
    description: "Adidas Feel The Chill gift set featuring Ice Dive fragrance collection. Includes shower gel, deodorant body spray and eau de toilette. Fresh, invigorating scent with a cool menthol finish. Presented in attractive branded packaging, ideal for gifting occasions.",
  },
  {
    id: 6,
    title: "Midnight Chronometer Crafted Precision Timeless Elegance Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    price: 228.04, currency: "€", rrp: 878.59, rrpCurrency: "€", markup: 285.3,
    dateAdded: "10/01/2024", grade: "Used", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 3, amazonPrice: 799.99, amazonProfit: 285.95, amazonSales: 8,
    ebayPrice: 749.00, ebayProfit: 234.96, ebaySales: 5,
    supplier: "Luxury Goods Wholesale", isExpired: false, isDropship: false, negotiable: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer"],
    category: "Jewellery & Watches", categories: ["jewellery-watches"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: [],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "50", terms: "Due on order confirmation" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "pallet-delivery"],
    incoterms: "DDP", returnPolicy: "No returns on luxury watches. All sales final unless defective.",
    certifications: [], priceValidUntil: "", availableQuantity: 18,
    description: "Premium chronometer watch with midnight black dial and crafted precision movement. Stainless steel case with sapphire crystal glass and genuine leather strap. Water resistant to 50 metres. Comes with full manufacturer warranty and luxury presentation box.",
  },
  {
    id: 7,
    title: "Samsung Galaxy Buds FE Wireless Bluetooth Earbuds",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    price: 32.99, currency: "£", rrp: 99.99, rrpCurrency: "€", markup: 203.1,
    dateAdded: "14/01/2024", grade: "Refurbished", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 5, amazonPrice: 89.99, amazonProfit: 28.50, amazonSales: 41,
    ebayPrice: 79.99, ebayProfit: 22.00, ebaySales: 33,
    supplier: "Audio & Tech Wholesale", isExpired: false, isDropship: true,
    isSupplierPro: true,
    buyerTypesServed: ["online-retailer", "dropshipper", "marketplace-seller"],
    category: "Electrical & Lighting", categories: ["electrical-lighting"],
    vat: "ex. VAT", discountPercentage: 0, firstOrderDiscount: { percentage: "10", label: "-10% ON YOUR FIRST ORDER" },
    brands: ["Samsung"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "DDP", returnPolicy: "Returns accepted within 30 days of delivery for refurbished items",
    certifications: ["ce", "rohs"], priceValidUntil: "", availableQuantity: 220,
    description: "Samsung Galaxy Buds FE wireless earbuds with active noise cancellation and ambient sound mode. Features powerful bass with AKG-tuned sound and up to 30 hours total battery life with charging case. IPX2 water resistant, ideal for workouts and daily commute.",
  },
  {
    id: 8,
    title: "JBL Tune 510BT Wireless On-Ear Headphones Black",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    price: 15.50, currency: "£", rrp: 49.99, rrpCurrency: "€", markup: 222.5,
    dateAdded: "20/01/2024", grade: "Returns / Mixed Stock", country: "DE", countryName: "Germany", stockLocation: "", stockLocationCode: "",
    moq: 10, amazonPrice: 44.99, amazonProfit: 13.20, amazonSales: 57,
    ebayPrice: 39.99, ebayProfit: 10.20, ebaySales: 42,
    supplier: "Audio Equipment Direct", isExpired: false, isDropship: false,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "wholesaler-reseller"],
    category: "Electrical & Lighting", categories: ["electrical-lighting"],
    vat: "ex. VAT", discountPercentage: 15,
    brands: ["JBL"],
    shippingCountries: ["de"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card", "paypal"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 340,
    description: "JBL Tune 510BT wireless on-ear headphones with JBL Pure Bass sound. Up to 40 hours of battery life with quick charge capability — 5 minutes charge gives 2 hours of playback. Lightweight foldable design with soft padded headband for all-day comfort. Multipoint connection allows switching between two Bluetooth devices.",
  },
  {
    id: 9,
    title: "Nike Dri-FIT Running T-Shirt Men's Training Top",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
    price: 6.80, currency: "£", rrp: 34.99, rrpCurrency: "€", markup: 414.6,
    dateAdded: "28/01/2024", grade: "New", country: "NL", countryName: "Netherlands", stockLocation: "", stockLocationCode: "",
    moq: 20, amazonPrice: 29.99, amazonProfit: 10.19, amazonSales: 72,
    ebayPrice: 24.99, ebayProfit: 7.19, ebaySales: 58,
    supplier: "Sportswear Wholesale Europe", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["online-retailer", "shop-retailer", "multi-chain"],
    category: "Sports, Hobbies & Leisure", categories: ["sports-hobbies-leisure"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Nike"],
    shippingCountries: ["nl"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 650,
    description: "Nike Dri-FIT men's running t-shirt engineered with moisture-wicking technology to keep you dry and comfortable during intense workouts. Lightweight, breathable mesh fabric with reflective elements for visibility. Standard fit with crew neck. Available in multiple sizes.",
  },
  {
    id: 10,
    title: "Yankee Candle Large Jar Clean Cotton 623g",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    price: 9.25, currency: "£", rrp: 27.99, rrpCurrency: "€", markup: 202.6,
    dateAdded: "02/02/2024", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 8, amazonPrice: 24.99, amazonProfit: 7.74, amazonSales: 95,
    ebayPrice: 22.50, ebayProfit: 5.25, ebaySales: 78,
    supplier: "Home Fragrance Wholesale", isExpired: false, isDropship: false, negotiable: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "market-trader", "online-retailer"],
    category: "Home Supplies", categories: ["home-supplies"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Yankee Candle"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: [], priceValidUntil: "", availableQuantity: 540,
    description: "Yankee Candle large jar in the classic Clean Cotton fragrance. 623g of premium soy-blend wax with a burn time of 110–150 hours. Features a self-trimming wick for a clean and even burn. The fresh, inviting scent of sun-dried cotton with green notes makes it a perennial bestseller.",
  },
  {
    id: 11,
    title: "Lego Classic Creative Brick Box 10696 Building Set",
    image: "https://images.unsplash.com/photo-1560961911-ba7ef651a2be?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1560961911-ba7ef651a2be?w=400&h=400&fit=crop",
    price: 14.20, currency: "£", rrp: 34.99, rrpCurrency: "€", markup: 146.4,
    dateAdded: "08/02/2024", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 6, amazonPrice: 29.99, amazonProfit: 6.79, amazonSales: 120,
    ebayPrice: 27.99, ebayProfit: 4.79, ebaySales: 88,
    supplier: "Toys & Games Wholesale UK", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "dropshipper"],
    category: "Toys & Games", categories: ["toys-games"],
    vat: "ex. VAT", discountPercentage: 0, firstOrderDiscount: { percentage: "15", label: "-15% ON YOUR FIRST ORDER" },
    brands: ["Lego"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "DDP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 410,
    description: "Lego Classic Creative Brick Box 10696 with 484 pieces in 35 different colours. Includes windows, eyes, wheels and hinges for creative building. Comes with a green baseplate and idea booklet. Perfect entry-level Lego set for children aged 4+ and a consistent top seller on all marketplaces.",
  },
  {
    id: 12,
    title: "Dyson Airwrap Complete Long Multi-Styler Nickel/Copper",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54f0e2ed4?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1522338242992-e1a54f0e2ed4?w=400&h=400&fit=crop",
    price: 189.99, currency: "£", rrp: 479.99, rrpCurrency: "€", markup: 152.6,
    dateAdded: "12/02/2024", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 2, amazonPrice: 449.99, amazonProfit: 125.00, amazonSales: 15,
    ebayPrice: 419.99, ebayProfit: 95.00, ebaySales: 11,
    supplier: "Premium Electricals Ltd", isExpired: false, isDropship: false,
    isSupplierPro: true,
    buyerTypesServed: ["online-retailer", "shop-retailer"],
    category: "Health & Beauty", categories: ["health-beauty"],
    vat: "ex. VAT", discountPercentage: 5,
    brands: ["Dyson"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "30", terms: "Due on order confirmation" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "pallet-delivery"],
    incoterms: "DDP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 85,
    description: "Dyson Airwrap Complete Long multi-styler in nickel/copper finish. Engineered to curl, wave, smooth and dry hair using the Coanda effect — no extreme heat required. Includes six attachments for versatile styling. Long barrel designed for longer hair types. Premium retail packaging included.",
  },
  {
    id: 13,
    title: "Philips OneBlade Pro QP6551/15 Face & Body Trimmer",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop",
    price: 22.50, currency: "£", rrp: 69.99, rrpCurrency: "€", markup: 211.1,
    dateAdded: "15/02/2024", grade: "New", country: "DE", countryName: "Germany", stockLocation: "", stockLocationCode: "",
    moq: 8, amazonPrice: 59.99, amazonProfit: 18.49, amazonSales: 63,
    ebayPrice: 54.99, ebayProfit: 14.49, ebaySales: 47,
    supplier: "Personal Care Wholesale", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "wholesaler-reseller"],
    category: "Health & Beauty", categories: ["health-beauty"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Philips"],
    shippingCountries: ["de"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce", "rohs"], priceValidUntil: "", availableQuantity: 280,
    description: "Philips OneBlade Pro face and body trimmer with precision comb settings from 0.4mm to 10mm. Features a dual-sided blade for trimming and shaving in one pass. 120-minute runtime on full charge with LED battery indicator. Wet and dry use, fully washable.",
  },
  {
    id: 14,
    title: "Stanley Classic Legendary Bottle 1.0L Hammertone Green",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    price: 11.99, currency: "£", rrp: 44.99, rrpCurrency: "€", markup: 275.1,
    dateAdded: "18/02/2024", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 12, amazonPrice: 39.99, amazonProfit: 14.00, amazonSales: 108,
    ebayPrice: 36.99, ebayProfit: 11.00, ebaySales: 82,
    supplier: "Outdoor Gear Wholesale", isExpired: false, isDropship: false,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    category: "Sports, Hobbies & Leisure", categories: ["sports-hobbies-leisure"],
    vat: "ex. VAT", discountPercentage: 0, firstOrderDiscount: { percentage: "10", label: "-10% ON YOUR FIRST ORDER" },
    brands: ["Stanley"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: [], priceValidUntil: "", availableQuantity: 520,
    description: "Stanley Classic Legendary vacuum bottle with 1.0 litre capacity in iconic hammertone green. Double-wall vacuum insulation keeps drinks hot for 24 hours or cold for 24 hours. BPA-free, leak-proof and built for life with a lifetime warranty. Ideal for outdoor and camping enthusiasts.",
  },
  {
    id: 15,
    title: "Crocs Classic Clog Unisex Slip On Shoes White",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    price: 8.99, currency: "£", rrp: 39.99, rrpCurrency: "€", markup: 344.9,
    dateAdded: "22/02/2024", grade: "New", country: "NL", countryName: "Netherlands", stockLocation: "", stockLocationCode: "",
    moq: 15, amazonPrice: 34.99, amazonProfit: 12.00, amazonSales: 145,
    ebayPrice: 29.99, ebayProfit: 8.00, ebaySales: 112,
    supplier: "Footwear Direct Europe", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["online-retailer", "dropshipper", "marketplace-seller"],
    category: "Clothing, Footwear & Accessories", categories: ["clothing-footwear-accessories"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Crocs"],
    shippingCountries: ["nl"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 30 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 890,
    description: "Crocs Classic Clog in white, unisex slip-on shoes made from lightweight Croslite foam. Features ventilation ports for breathability and water drainage. Pivoting heel strap for a secure fit. Easy to clean and quick to dry. Available in full size range.",
  },
  {
    id: 16,
    title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    price: 34.50, currency: "£", rrp: 99.99, rrpCurrency: "€", markup: 189.8,
    dateAdded: "25/02/2024", grade: "Liquidation Stocklots", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 4, amazonPrice: 89.99, amazonProfit: 27.49, amazonSales: 76,
    ebayPrice: 82.99, ebayProfit: 20.49, ebaySales: 54,
    supplier: "Kitchen Appliances Wholesale", isExpired: false, isDropship: false,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer"],
    category: "Home Supplies", categories: ["home-supplies"],
    vat: "ex. VAT", discountPercentage: 8,
    brands: ["Instant Pot"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "pallet-delivery"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 165,
    description: "Instant Pot Duo 7-in-1 electric pressure cooker with 6-litre capacity. Combines pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yoghurt maker and food warmer in one appliance. 13 smart programmes with automatic keep-warm function. Stainless steel inner pot is dishwasher safe.",
  },
  {
    id: 17,
    title: "Ray-Ban Wayfarer Classic Sunglasses RB2140 Black",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop",
    price: 42.00, currency: "£", rrp: 159.99, rrpCurrency: "€", markup: 280.9,
    dateAdded: "01/03/2024", grade: "New", country: "IT", countryName: "Italy", stockLocation: "", stockLocationCode: "",
    moq: 3, amazonPrice: 139.99, amazonProfit: 49.99, amazonSales: 33,
    ebayPrice: 129.99, ebayProfit: 39.99, ebaySales: 26,
    supplier: "Fashion Accessories EU", isExpired: false, isDropship: true,
    isSupplierPro: true,
    buyerTypesServed: ["online-retailer", "marketplace-seller", "shop-retailer"],
    category: "Clothing, Footwear & Accessories", categories: ["clothing-footwear-accessories"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Ray-Ban"],
    shippingCountries: ["it"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "25", terms: "Due on order confirmation" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging. Designer items require original packaging.",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 120,
    description: "Ray-Ban Wayfarer Classic RB2140 sunglasses in black with green G-15 lenses. Iconic design with acetate frame and metal hinges. Provides 100% UV protection. Comes with original Ray-Ban case, cleaning cloth and certificate of authenticity.",
  },
  {
    id: 18,
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    price: 38.75, currency: "£", rrp: 109.99, rrpCurrency: "€", markup: 183.8,
    dateAdded: "05/03/2024", grade: "New", country: "UK", countryName: "United Kingdom", stockLocation: "", stockLocationCode: "",
    moq: 5, amazonPrice: 99.99, amazonProfit: 30.24, amazonSales: 52,
    ebayPrice: 89.99, ebayProfit: 21.24, ebaySales: 38,
    supplier: "IT Peripherals Wholesale", isExpired: false, isDropship: false,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "wholesaler-reseller"],
    category: "Computing", categories: ["computing"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Logitech"],
    shippingCountries: ["gb"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dpd", "national-post"],
    incoterms: "EXW", returnPolicy: "Returns accepted within 30 days of delivery for unused items in original packaging",
    certifications: ["ce", "rohs"], priceValidUntil: "", availableQuantity: 280,
    description: "Logitech MX Master 3S wireless performance mouse with 8K DPI optical sensor and quiet clicks. Features MagSpeed electromagnetic scroll wheel and ergonomic design for all-day comfort. Works on virtually any surface including glass. USB-C quick charging — 1 minute charge gives 3 hours of use.",
  },
  {
    id: 19,
    title: "Puma RS-X Reinvention Running Shoes Unisex",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    price: 19.99, currency: "£", rrp: 84.99, rrpCurrency: "€", markup: 325.1,
    dateAdded: "08/03/2024", grade: "New", country: "PL", countryName: "Poland", stockLocation: "", stockLocationCode: "",
    moq: 10, amazonPrice: 74.99, amazonProfit: 26.00, amazonSales: 68,
    ebayPrice: 64.99, ebayProfit: 16.00, ebaySales: 51,
    supplier: "Branded Footwear Wholesale PL", isExpired: false, isDropship: true,
    isSupplierPro: false,
    buyerTypesServed: ["online-retailer", "dropshipper", "shop-retailer"],
    category: "Clothing, Footwear & Accessories", categories: ["clothing-footwear-accessories"],
    vat: "ex. VAT", discountPercentage: 0, firstOrderDiscount: { percentage: "15", label: "-15% ON YOUR FIRST ORDER" },
    brands: ["Puma"],
    shippingCountries: ["pl"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 30 days of delivery for unused items in original packaging",
    certifications: ["ce"], priceValidUntil: "", availableQuantity: 560,
    description: "Puma RS-X Reinvention unisex running shoes with bold colour blocking and retro-inspired design. Features a thick cushioned midsole for superior comfort and a rubber outsole for grip. Mesh and leather upper provides breathability and durability. Runs true to size.",
  },
  {
    id: 20,
    title: "Le Creuset Signature Cast Iron Round Casserole 24cm",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    imageHover: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    price: 89.99, currency: "£", rrp: 275.00, rrpCurrency: "€", markup: 205.6,
    dateAdded: "10/03/2024", grade: "New", country: "FR", countryName: "France", stockLocation: "", stockLocationCode: "",
    moq: 2, amazonPrice: 249.00, amazonProfit: 79.01, amazonSales: 22,
    ebayPrice: 229.00, ebayProfit: 59.01, ebaySales: 15,
    supplier: "Premium Cookware EU", isExpired: false, isDropship: false,
    isSupplierPro: false,
    buyerTypesServed: ["shop-retailer", "online-retailer", "multi-chain"],
    category: "Home Supplies", categories: ["home-supplies"],
    vat: "ex. VAT", discountPercentage: 0,
    brands: ["Le Creuset"],
    shippingCountries: ["fr"], countryRestrictions: [],
    supplierPaymentMethods: ["bank-transfer", "credit-debit-card"], netPaymentTerms: "Net 30",
    depositRequired: { percentage: "", terms: "" }, taxClass: "standard", invoiceType: "vat",
    sanitizedInvoice: "available", deliveryMethods: ["dhl", "dpd"],
    incoterms: "DAP", returnPolicy: "Returns accepted within 14 days of delivery for unused items in original packaging. Premium cookware requires unused condition.",
    certifications: [], priceValidUntil: "", availableQuantity: 95,
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
function TrendingDealsPanel({ products, isPremium = false, isLoggedIn = false, canViewSupplier = false }) {
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
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 -mb-1 snap-x snap-mandatory scrollbar-hide">
        {trending.map((product) => (
          <div key={product.id} className="shrink-0 w-[60%] min-w-[180px] sm:w-[38%] sm:min-w-[190px] md:w-[28%] lg:w-[22%] xl:w-[17%] 2xl:w-[14%] snap-start">
            <TrendingDealCard product={product} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Grade badge style: icon + color per grade value ── */
function getGradeStyle(grade) {
  switch (grade?.toLowerCase()) {
    case "new":
      return { Icon: Sparkles, bg: "bg-emerald-500", text: "text-white" };
    case "refurbished":
      return { Icon: RefreshCw, bg: "bg-blue-500", text: "text-white" };
    case "used":
      return { Icon: Clock, bg: "bg-slate-500", text: "text-white" };
    case "returns / mixed stock":
      return { Icon: RotateCcw, bg: "bg-amber-600", text: "text-white" };
    case "liquidation stocklots":
      return { Icon: Zap, bg: "bg-red-600", text: "text-white" };
    default:
      return { Icon: null, bg: "bg-slate-400", text: "text-white" };
  }
}

/* ── Deal card left border color by priority: red (discounted) > orange (negotiable) ── */
function getDealBorderClass(product) {
  if (product.discountPercentage) return "border-l-[3px] border-l-red-500";
  if (product.negotiable) return "border-l-[3px] border-l-orange-500";
  return "";
}

function TrendingDealCard({ product, isPremium, isLoggedIn, canViewSupplier = false }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular supplier deals by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && product.isSupplierPro);

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer" onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}>
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={24} className="text-slate-300" />
          <p className="text-xs font-semibold text-slate-500">Deal hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={10} /> Unhide
          </button>
        </div>
      )}
      {/* Image with overlays */}
      <a href="/deal" className="block relative aspect-[5/4] bg-slate-50 overflow-hidden">
        {product.image ? (
          <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="100%" />
        ) : (
          <NoImagePlaceholder />
        )}
        {/* Markup badge (top-right) */}
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
          <Flame size={8} /> {product.markup}%
        </div>
        {/* Price badge (bottom-left on image) */}
        <div className="absolute bottom-1.5 left-1.5 flex flex-col items-start">
          {product.discountPercentage > 0 && (
            <div className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-t-md">{product.discountPercentage}% DISCOUNT</div>
          )}
          <div className={`${product.discountPercentage > 0 ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-1.5 py-0.5 shadow-sm`}>
            <span className={`text-xs font-extrabold ${product.discountPercentage > 0 ? "text-white" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
            <span className={`text-[9px] ml-0.5 ${product.discountPercentage > 0 ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
          </div>
        </div>
        {/* NEW / DROPSHIP badges (top-left) */}
        <div className="absolute top-1.5 left-1.5 flex flex-col items-start gap-0.5">
          {product.grade && product.grade.toLowerCase() !== "new" && (() => {
            const gs = getGradeStyle(product.grade);
            return (
              <span className={`px-1 py-0.5 text-[9px] font-extrabold ${gs.bg} ${gs.text} rounded shadow-sm inline-flex items-center gap-0.5`}>
                {gs.Icon && <gs.Icon size={8} />}
                {product.grade.toUpperCase()}
              </span>
            );
          })()}
          {product.isDropship && (
            <span className="px-1 py-0.5 text-[9px] font-extrabold bg-indigo-500 text-white rounded shadow-sm inline-flex items-center gap-0.5">
              <Truck size={8} /> DROPSHIP
            </span>
          )}
          {product.negotiable && (
            <span className="px-1 py-0.5 text-[9px] font-extrabold bg-orange-500 text-white rounded shadow-sm">
              NEGOTIABLE
            </span>
          )}
        </div>
        {/* Hide + Favourite buttons (bottom-right, hover only) */}
        <div className={`absolute bottom-1.5 right-1.5 flex flex-col gap-1 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button onClick={(e) => { e.preventDefault(); isLoggedIn ? setHidden(true) : openRegisterModal(); }}
            className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
            <EyeOff size={10} className="text-slate-400" />
          </button>
          <button onClick={(e) => { e.preventDefault(); isLoggedIn ? setFaved(!faved) : openRegisterModal(); }}
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all ${faved ? "bg-red-500 hover:bg-red-600" : "bg-white/90 backdrop-blur-sm hover:bg-white"}`}>
            <Heart size={10} className={faved ? "fill-white text-white" : "text-slate-400"} />
          </button>
        </div>
      </a>

      {/* Content */}
      <div className="p-2 sm:p-2.5 flex flex-col flex-1">
        {/* First order promo (above title) */}
        {product.firstOrderDiscount?.label && (
          <div className="mb-1">
            <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">{product.firstOrderDiscount.label}</span>
          </div>
        )}

        {/* Title */}
        <a href="/deal">
          <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-1.5">
            {product.title}
          </h3>
        </a>

        {/* Profit rows */}
        <div className="border-t border-slate-100">
          {/* Column headers */}
          <div className="flex items-center px-0.5 pt-1.5 pb-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
            <span className="w-8 shrink-0" />
            <span className="flex-1">Price</span>
            <span>Profit</span>
          </div>
          {/* RRP */}
          <div className="flex items-center px-0.5 py-1.5 border-b border-dashed border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 w-8 shrink-0">RRP</span>
            <span className="flex-1 text-[10px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.rrp.toFixed(2)}</span>
            <span className="text-[10px] font-bold tabular-nums text-emerald-600">{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
          </div>
          {/* Amazon */}
          <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-0.5 py-1.5 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
            <div className="w-8 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-3.5 h-3.5" /></div>
            <span className="flex-1 flex items-center text-[10px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}<ExternalLink size={10} className="ml-1 shrink-0 text-slate-300" /></span>
            <span className="text-[10px] font-bold tabular-nums" style={{color: "#FF9900"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
          </a>
          {/* eBay */}
          <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-0.5 py-1.5 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
            <div className="w-8 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto" /></div>
            <span className="flex-1 flex items-center text-[10px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}<ExternalLink size={10} className="ml-1 shrink-0 text-slate-300" /></span>
            <span className="text-[10px] font-bold tabular-nums" style={{color: "#0064D2"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
          </a>
        </div>

        {/* CTA — three-tier gating */}
        <div className="mt-auto pt-1.5">
          {canContact ? (
            <button onClick={() => setContactOpen(true)} className="w-full py-2 rounded-lg text-xs font-bold text-center text-white bg-[#1e5299] hover:bg-[#174280] flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <MessageSquare size={11} /> Send Enquiry
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="w-full py-2 rounded-lg text-xs font-bold text-center text-white bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Lock size={11} /> Send Enquiry
            </a>
          ) : (
            <button onClick={openRegisterModal} className="w-full py-2 rounded-lg text-xs font-bold text-center text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 flex items-center justify-center gap-1 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <Lock size={11} /> Join Now!
            </button>
          )}
        </div>
      </div>

      {contactOpen && <ContactSupplierModal name={product.title} product={product} subjectDefault={`Enquiry about: ${product.title}`} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DETAILED DEAL CARD — main card for the deals grid
   ═══════════════════════════════════════════════════ */
function DetailedDealCard({ product, isPremium = false, isLoggedIn = false, canViewSupplier = false }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular supplier deals by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && product.isSupplierPro);

  return (
    <div
      className={`relative bg-white rounded-xl border overflow-hidden transition-all duration-300 group flex flex-col cursor-pointer ${
        product.isExpired
          ? "border-slate-200"
          : "border-slate-200 hover:shadow-lg hover:border-orange-200"
      } ${!product.isExpired ? getDealBorderClass(product) : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}
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
        {product.image ? (
          <Image
            src={hovered && product.imageHover ? product.imageHover : product.image}
            alt={product.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${product.isExpired ? "grayscale" : ""}`}
            sizes="100%"
          />
        ) : (
          <NoImagePlaceholder />
        )}
        {product.isExpired && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 -rotate-6">
              <AlertTriangle size={16} /> SOLD OUT
            </div>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {!product.isExpired && product.grade && product.grade.toLowerCase() !== "new" && (() => {
            const gs = getGradeStyle(product.grade);
            return (
              <span className={`px-2 py-1 text-[10px] font-bold ${gs.bg} ${gs.text} rounded-md shadow-sm inline-flex items-center gap-0.5`}>
                {gs.Icon && <gs.Icon size={9} />}
                {product.grade.toUpperCase()}
              </span>
            );
          })()}
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
          {product.discountPercentage > 0 && !product.isExpired && (
            <div className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-t-md">{product.discountPercentage}% DISCOUNT</div>
          )}
          <div className={`${product.discountPercentage > 0 && !product.isExpired ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
            <span className={`text-base font-extrabold ${product.discountPercentage > 0 && !product.isExpired ? "text-white" : product.isExpired ? "text-slate-400" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
            <span className={`text-[10px] ml-1 ${product.discountPercentage > 0 && !product.isExpired ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
          </div>
        </div>
        {/* Hide + Favourite buttons (bottom-right, hover only) */}
        <div className={`absolute bottom-2.5 right-2.5 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button onClick={(e) => { e.preventDefault(); isLoggedIn ? setHidden(true) : openRegisterModal(); }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
            <EyeOff size={14} className="text-slate-400" />
          </button>
          <button onClick={(e) => { e.preventDefault(); isLoggedIn ? setFaved(!faved) : openRegisterModal(); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all ${faved ? "bg-red-500 hover:bg-red-600" : "bg-white/90 backdrop-blur-sm hover:bg-white"}`}>
            <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
          </button>
        </div>
      </a>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {product.firstOrderDiscount?.label && (
          <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{product.firstOrderDiscount.label}</span></div>
        )}
        <a href="/deal">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>
        </a>

        {/* Profit Calculations — V3 Minimal + brand accents */}
        <div className="mt-3 border-t border-slate-100">
          {/* Column headers */}
          <div className="flex items-center px-1 pt-2 pb-1 text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
            <span className="w-10 shrink-0" />
            <span className="flex-1">Price</span>
            <span>Profit</span>
          </div>
          {/* RRP */}
          <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
            <span className="text-[13px] font-bold text-slate-400 w-10 shrink-0">RRP</span>
            <span className="flex-1 text-[13px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.rrp.toFixed(2)}</span>
            <span className={`text-[13px] font-bold tabular-nums ${product.isExpired ? "text-slate-400" : "text-emerald-600"}`}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
          </div>
          {/* Amazon */}
          {!product.isExpired ? (
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-1 py-2 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#FF9900"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
            </a>
          ) : (
            <div className="flex items-center px-1 py-2 border-b border-dashed border-slate-100">
              <div className="w-10 shrink-0 flex items-center grayscale opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="flex-1 text-[13px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.amazonPrice.toFixed(2)}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#94a3b8"}}>{product.rrpCurrency}{product.amazonProfit.toFixed(2)}</span>
            </div>
          )}
          {/* eBay */}
          {!product.isExpired ? (
            <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="flex items-center px-1 py-2 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              <div className="w-10 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 flex items-center text-[13px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}<ExternalLink size={12} className="ml-1.5 shrink-0 text-slate-300" /></span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#0064D2"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
            </a>
          ) : (
            <div className="flex items-center px-1 py-2">
              <div className="w-10 shrink-0 flex items-center grayscale opacity-40"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3.5 w-auto" /></div>
              <span className="flex-1 text-[13px] text-slate-500 tabular-nums">{product.rrpCurrency}{product.ebayPrice.toFixed(2)}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{color: "#94a3b8"}}>{product.rrpCurrency}{product.ebayProfit.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* CTA — three-tier gating, pinned to bottom */}
        <div className="mt-auto pt-3.5">
          {canContact ? (
            <button onClick={() => setContactOpen(true)} className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-[#1e5299] hover:bg-[#174280] text-white flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
              <MessageSquare size={14} /> Send Enquiry
            </button>
          ) : isLoggedIn ? (
            <a href="/pricing" className="w-full py-2.5 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-1.5">
              <Lock size={14} /> Send Enquiry
            </a>
          ) : (
            <button onClick={openRegisterModal} className="w-full py-2.5 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center justify-center gap-1.5">
              <Lock size={14} /> Join Now!
            </button>
          )}
        </div>
      </div>

      {/* Contact Supplier Modal */}
      {contactOpen && <ContactSupplierModal name={product.title} product={product} subjectDefault={`Enquiry about: ${product.title}`} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIST DEAL CARD — horizontal row variant
   ═══════════════════════════════════════════════════ */
function ListDealCard({ product, isPremium = false, isLoggedIn = false, canViewSupplier = false }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const openRegisterModal = () => window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }));
  // Deal contact gating: Supplier Pro deals contactable by all logged-in; regular supplier deals by Standard+ only
  const canContact = canViewSupplier || (isLoggedIn && product.isSupplierPro);

  const DESC_LIMIT = 120;
  const desc = product.description || "";
  const isLong = desc.length > DESC_LIMIT;
  const displayDesc = showFullDesc || !isLong ? desc : desc.slice(0, DESC_LIMIT).replace(/\s+\S*$/, "") + "…";

  return (
    <div
      className={`relative bg-white rounded-xl border overflow-hidden transition-all duration-300 group cursor-pointer ${
        product.isExpired
          ? "border-slate-200"
          : "border-slate-200 hover:shadow-lg hover:border-orange-200"
      } ${!product.isExpired ? getDealBorderClass(product) : ""}`}
      onClick={(e) => { if (!e.target.closest("a, button, input, [role=button]")) window.location.href = "/deal"; }}
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
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${product.isExpired ? "grayscale" : ""}`}
              sizes="100%"
            />
          ) : (
            <NoImagePlaceholder />
          )}
          {product.isExpired && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1 -rotate-6">
                <AlertTriangle size={12} /> SOLD OUT
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
            {!product.isExpired && product.grade && product.grade.toLowerCase() !== "new" && (() => {
              const gs = getGradeStyle(product.grade);
              return (
                <span className={`px-1.5 py-1 text-[10px] font-bold ${gs.bg} ${gs.text} rounded-md shadow-sm inline-flex items-center gap-0.5`}>
                  {gs.Icon && <gs.Icon size={9} />}
                  {product.grade.toUpperCase()}
                </span>
              );
            })()}
            {product.isDropship && (
              <span className="px-1.5 py-1 text-[10px] font-bold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-0.5">
                <Truck size={9} /> DROPSHIP
              </span>
            )}
          </div>
          {/* Price badge */}
          <div className="absolute bottom-2 left-2 flex flex-col items-start">
            {product.discountPercentage > 0 && !product.isExpired && (
              <div className="bg-red-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-t-md">{product.discountPercentage}% DISCOUNT</div>
            )}
            <div className={`${product.discountPercentage > 0 && !product.isExpired ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2 py-0.5 shadow-sm`}>
              <span className={`text-sm font-extrabold ${product.discountPercentage > 0 && !product.isExpired ? "text-white" : product.isExpired ? "text-slate-400" : "text-orange-600"}`}>{product.currency}{product.price.toFixed(2)}</span>
              <span className={`text-[10px] ml-0.5 ${product.discountPercentage > 0 && !product.isExpired ? "text-white/80" : "text-slate-400"}`}>ex.VAT</span>
            </div>
          </div>
          {/* Markup badge */}
          <div className={`absolute top-2 right-2 px-1.5 py-1 ${product.isExpired ? "bg-slate-400" : "bg-emerald-500"} text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm`}>
            <TrendingUp size={9} /> {product.markup}%
          </div>
        </a>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {product.firstOrderDiscount?.label && (
                <div className="mb-1"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">{product.firstOrderDiscount.label}</span></div>
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
              <button onClick={() => isLoggedIn ? setHidden(true) : openRegisterModal()}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                <EyeOff size={14} className="text-slate-400" />
              </button>
              <button onClick={() => isLoggedIn ? setFaved(!faved) : openRegisterModal()}
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

          {/* CTA — three-tier gating, pinned to bottom */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            {canContact ? (
              <button onClick={() => setContactOpen(true)} className="px-6 py-2.5 rounded-lg text-sm font-bold text-center bg-[#1e5299] hover:bg-[#174280] text-white inline-flex items-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <MessageSquare size={14} /> Send Enquiry
              </button>
            ) : isLoggedIn ? (
              <a href="/pricing" className="px-6 py-2.5 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 inline-flex items-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Lock size={14} /> Send Enquiry
              </a>
            ) : (
              <button onClick={openRegisterModal} className="px-6 py-2.5 rounded-lg text-sm font-bold text-center text-white bg-orange-500 hover:bg-orange-600 inline-flex items-center gap-1.5 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200">
                <Lock size={14} /> Join Now!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Supplier Modal */}
      {contactOpen && <ContactSupplierModal name={product.title} product={product} subjectDefault={`Enquiry about: ${product.title}`} onClose={() => setContactOpen(false)} />}
    </div>
  );
}

/* CollapsibleFilterPanel removed — filter panel is now rendered inline in DealsPage with shared pattern matching suppliers.jsx */

/* ═══════════════════════════════════════════════════
   HOT OFFERS SECTION — repeatable section with deal grid
   ═══════════════════════════════════════════════════ */
function HotOffersSection({ title, subtitle, products, isPremium, isLoggedIn = false, canViewSupplier = false, hideHeader = false, viewMode = "grid" }) {
  return (
    <div className="mb-8">
      {!hideHeader && (
        <div className="flex items-end justify-between mb-4">
          <div>
            {subtitle && (
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{subtitle}</p>
            )}
            <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">Get instant access to the latest and most popular wholesale and dropship opportunities.</p>
          </div>
          <a href="/deals" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors shrink-0">
            View all <ArrowRight size={14} />
          </a>
        </div>
      )}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {products.map((p) => (
            <ListDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4" style={{gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"}}>
          {products.map((p) => (
            <DetailedDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
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
  /* PRODUCTION (H2): Fetch stats from GET /api/stats, testimonials from GET /api/testimonials */
  const stats = [
    { label: "Average markup at wholesale prices", value: "366.61%", color: "text-orange-600" },
    { label: "Live Deals", value: "14,891+", color: "text-orange-600" },
    { label: "New Suppliers in the past 7 days", value: "300+", color: "text-orange-600" },
  ];

  const testimonials = [
    { name: "Rachel Harvey", role: "Online Retailer", location: "United Kingdom", text: "I am very pleased that I have subscribed to WholesaleUp as the quality and service is excellent. The information you provide is very detailed and helpful.", rating: 5 },
    { name: "Thai Hoang Do", role: "Dropshipper", location: "Belgium", text: "Hello. Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months. Thank you.", rating: 5 },
    { name: "Alice Elliott", role: "Amazon Seller", location: "United Kingdom", text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", rating: 5 },
    { name: "Marcus Chen", role: "Wholesale Buyer", location: "Germany", text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", rating: 5 },
    { name: "Sofia Rodriguez", role: "Dropshipper", location: "Spain", text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", rating: 5 },
    { name: "James Patterson", role: "eBay Seller", location: "Ireland", text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", rating: 5 },
    { name: "Anna Kowalski", role: "Online Retailer", location: "Poland", text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", rating: 4 },
    { name: "David Moore", role: "Amazon Seller", location: "United Kingdom", text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", rating: 5 },
    { name: "Marie Dupont", role: "Online Reseller", location: "France", text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", rating: 5 },
    { name: "Luca Bianchi", role: "Wholesale Buyer", location: "Italy", text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", rating: 5 },
    { name: "Emma van Dijk", role: "Dropshipper", location: "Netherlands", text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", rating: 4 },
    { name: "Oliver Schmidt", role: "Online Retailer", location: "Germany", text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", rating: 5 },
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
                <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
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
   MAIN — /deals page
   ═══════════════════════════════════════════════════ */
export default function DealsPage({ routeCategory = null, routeSubcategory = null, routeDropshipping = false }) {
  /* ── Auth state from DemoAuthContext ───────────────────────
     Supports both real NextAuth session AND demo dropdown overrides.
     Premium gating controls deal detail visibility.
     ─────────────────────────────────────────────────────────── */
  const { isLoggedIn, isPremium, canViewSupplier } = useDemoAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ── Read initial filter state from URL search params ── */
  const initialCategory = routeCategory || null;
  // Convert clean subcategory slug from route to composite filter ID (parentId--subId)
  const initialSubcategory = routeSubcategory && routeCategory ? `${routeCategory}--${routeSubcategory}` : null;
  /* Parse per-mode keyword params: ?any=nike,adidas&exact=dark+blue&all=long,laces
     Also supports legacy ?keywords= for backwards compatibility */
  const initialKeywords = (() => {
    const kws = [];
    const anyTerms = searchParams.get("any");
    const allTerms = searchParams.get("all");
    const exactTerms = searchParams.get("exact");
    const legacyTerms = searchParams.get("keywords");
    if (anyTerms) anyTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "any" }));
    if (allTerms) allTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "all" }));
    if (exactTerms) exactTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "exact" }));
    if (legacyTerms && kws.length === 0) legacyTerms.split(",").filter(Boolean).forEach((t) => kws.push({ term: t, mode: "any" }));
    return kws;
  })();
  const initialCountries = searchParams.get("countries") ? searchParams.get("countries").split(",").filter(Boolean) : [];
  const initialGrades = searchParams.get("grades") ? searchParams.get("grades").split(",").filter(Boolean) : [];
  const initialBuyerTypes = searchParams.get("buyerTypes") ? searchParams.get("buyerTypes").split(",").filter(Boolean) : [];

  const [filters, setFilters] = useState({
    rating: null,
    category: initialCategory,
    subcategory: initialSubcategory,
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    countries: initialCountries,
    dropshipping: routeDropshipping || searchParams.get("dropshipping") === "true",
    grades: initialGrades,
    buyerTypes: initialBuyerTypes,
    keywords: initialKeywords,
  });
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "best-match");
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const urlPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPageState] = useState(urlPage);
  const [perPage, setPerPage] = useState(9);

  /* ── Dynamic page title — reflects active filters ──
     Pattern: "{keywords} {category} {Dropship|Wholesale} Deals from {countries}"
     Examples:
       "Mens Clothing Wholesale Deals"
       "Mens Clothing Dropship Deals"
       "Mens Clothing Wholesale Deals from United Kingdom and Germany"
     ─────────────────────────────────────────────────── */
  const pageTitle = (() => {
    const keywordPrefix = filters.keywords?.length
      ? filters.keywords.map((kw) => typeof kw === "string" ? kw : kw.term).join(" ") + " "
      : "";
    const dealsSuffix = filters.dropshipping ? "Dropship Deals" : "Wholesale Deals";
    // Category / subcategory prefix
    let catPrefix = "";
    if (filters.subcategory) {
      const subId = filters.subcategory.includes("--") ? filters.subcategory.split("--")[1] : filters.subcategory;
      catPrefix = getSubcategoryById(subId)?.sub?.label || "";
    } else if (filters.category) {
      catPrefix = getCategoryById(filters.category)?.name || "";
    }
    // Country suffix — "from {countries}"
    let countrySuffix = "";
    if (filters.countries?.length > 0) {
      const names = filters.countries.map((iso) => CANONICAL_COUNTRIES.find((c) => c.iso === iso)?.label || iso.toUpperCase()).filter(Boolean);
      if (names.length <= 3) {
        countrySuffix = " from " + (names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names[names.length - 1]);
      } else {
        countrySuffix = ` from ${names.slice(0, 3).join(", ")} +${names.length - 3} more`;
      }
    }
    return `${keywordPrefix}${catPrefix}${catPrefix ? " " : ""}${dealsSuffix}${countrySuffix}`;
  })();

  // Sync page state when URL changes (browser back/forward)
  useEffect(() => {
    setPageState(urlPage);
  }, [urlPage]);

  // Track previous path to detect category/subcategory navigation
  const prevPathRef = useRef(typeof window !== "undefined" ? window.location.pathname : "/deals");

  // Sync category/subcategory when route props change (browser back/forward)
  useEffect(() => {
    const newCat = routeCategory || null;
    const newSub = routeSubcategory && routeCategory ? `${routeCategory}--${routeSubcategory}` : null;
    setFilters((prev) => {
      if (prev.category === newCat && prev.subcategory === newSub) return prev;
      return { ...prev, category: newCat, subcategory: newSub };
    });
    // Also update prevPathRef so the sync effect doesn't re-push
    let basePath = "/deals";
    if (newCat) {
      basePath = `/deals/${newCat}`;
      if (newSub) basePath = `${basePath}/${routeSubcategory}`;
    }
    prevPathRef.current = basePath;
  }, [routeCategory, routeSubcategory]);

  const setPage = useCallback((newPage) => {
    setPageState(newPage);
    const params = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }
    const qs = params.toString();
    router.push(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  }, [searchParams, router]);

  const buildPageHref = useCallback((n) => {
    const params = new URLSearchParams(searchParams.toString());
    if (n <= 1) { params.delete("page"); } else { params.set("page", String(n)); }
    const qs = params.toString();
    return qs ? `?${qs}` : window.location.pathname;
  }, [searchParams]);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCollapsed, toggleFilterCollapsed, setFilterCollapsed] = usePanelCollapse("wup-filter-collapsed");
  const [viewMode, setViewMode] = useState("grid");

  /* ── Sync filter state → URL (SEO path segments for category) ──
     Category uses path segment: /deals/clothing-fashion
     All other filters remain as query params.
     ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams();
    // Category & subcategory go in the path, not query params
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.countries.length > 0) params.set("countries", filters.countries.join(","));
    // dropshipping goes in path segment, not query param
    if (filters.grades.length > 0) params.set("grades", filters.grades.join(","));
    if (filters.buyerTypes?.length > 0) params.set("buyerTypes", filters.buyerTypes.join(","));
    /* Per-mode keyword params: ?any=nike,adidas&exact=dark+blue&all=long,laces */
    const kwByMode = { any: [], all: [], exact: [] };
    (filters.keywords || []).forEach((kw) => {
      const term = typeof kw === "string" ? kw : kw.term;
      const mode = typeof kw === "string" ? "any" : kw.mode;
      if (kwByMode[mode]) kwByMode[mode].push(term);
    });
    if (kwByMode.any.length > 0) params.set("any", kwByMode.any.join(","));
    if (kwByMode.all.length > 0) params.set("all", kwByMode.all.join(","));
    if (kwByMode.exact.length > 0) params.set("exact", kwByMode.exact.join(","));
    if (sortBy !== "best-match") params.set("sort", sortBy);
    const qs = params.toString();
    // Build SEO path: /deals, /deals/clothing-fashion, /deals/clothing-fashion/mens-clothing, /deals/dropshipping
    let basePath = "/deals";
    if (filters.category) {
      basePath = `/deals/${filters.category}`;
      if (filters.subcategory) {
        const subId = filters.subcategory.includes("--") ? filters.subcategory.split("--")[1] : filters.subcategory;
        basePath = `${basePath}/${subId}`;
      }
    }
    // Dropshipping as path segment (appended after category if present)
    if (filters.dropshipping) basePath += "/dropshipping";
    const newUrl = qs ? `${basePath}?${qs}` : basePath;
    // Path changed (category navigation) → push to create history entry
    // Only query params changed (price, country, etc.) → replace to avoid clutter
    const pathChanged = basePath !== prevPathRef.current;
    prevPathRef.current = basePath;
    if (pathChanged) {
      router.push(newUrl, { scroll: false });
    } else {
      router.replace(newUrl, { scroll: false });
    }
  }, [filters, sortBy, router]);

  // Compute max price from product data (rounded up to nearest 10)
  const computedMaxPrice = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 10) * 10;

  // Triple the products for more realistic grid
  const allProducts = [...PRODUCTS, ...PRODUCTS, ...PRODUCTS].map((p, i) => ({ ...p, id: i + 1 }));
  const visibleProducts = allProducts.filter((p) => !p.isExpired);

  // Non-keyword filters shared by exact + broad
  const passesNonKeywordFilters = (p) => {
    if (filters.priceMin !== "" && p.price < Number(filters.priceMin)) return false;
    if (filters.priceMax !== "" && p.price > Number(filters.priceMax)) return false;
    if (filters.category && !(p.category || "").toLowerCase().replace(/[^a-z]/g, "").includes(filters.category.replace(/[^a-z]/g, ""))) return false;
    // Deal country = stockLocation ISO code override || supplier country ISO code
    // Map legacy uppercase codes (UK→gb, DE→de) to canonical ISO alpha-2 lowercase
    const LEGACY_TO_ISO = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr" };
    const dealCountryISO = p.stockLocationCode || LEGACY_TO_ISO[p.country] || p.country?.toLowerCase();
    if (filters.countries.length > 0 && !filters.countries.includes(dealCountryISO)) return false;
    if (filters.grades.length > 0 && !filters.grades.some((g) => (p.grade || "").toLowerCase().includes(g.toLowerCase()))) return false;
    if (filters.dropshipping && !p.isDropship) return false;
    // Buyer types served — deals with no buyerTypesServed data are considered as serving all buyer types
    if (filters.buyerTypes?.length > 0) {
      const served = p.buyerTypesServed || [];
      if (served.length > 0 && !filters.buyerTypes.some((bt) => served.includes(bt))) return false;
    }
    return true;
  };

  const keywords = (filters.keywords || []).map((kw) => (typeof kw === "string" ? kw : kw.term).toLowerCase());
  const hasMultipleKeywords = keywords.length > 1;

  const matchesKeyword = (p, kw) =>
    p.title.toLowerCase().includes(kw) || (p.description || "").toLowerCase().includes(kw) || (p.category || "").toLowerCase().includes(kw);

  // Exact matches: passes all filters including ALL keywords
  const exactProducts = allProducts.filter((p) => {
    if (!passesNonKeywordFilters(p)) return false;
    if (keywords.length > 0 && !keywords.every((kw) => matchesKeyword(p, kw))) return false;
    return true;
  });

  // Broad matches: passes non-keyword filters + matches AT LEAST ONE keyword but NOT all
  const broadProductsReal = hasMultipleKeywords
    ? allProducts.filter((p) => {
        if (!passesNonKeywordFilters(p)) return false;
        const matchCount = keywords.filter((kw) => matchesKeyword(p, kw)).length;
        return matchCount > 0 && matchCount < keywords.length;
      })
    : [];

  // Demo mode: when no keywords are active, simulate a split to showcase the separator
  const DEMO_EXACT_COUNT = 12;
  const isDemoSplit = keywords.length === 0 && exactProducts.length > DEMO_EXACT_COUNT;
  const broadProducts = isDemoSplit ? exactProducts.slice(DEMO_EXACT_COUNT) : broadProductsReal;
  const displayExact = isDemoSplit ? exactProducts.slice(0, DEMO_EXACT_COUNT) : exactProducts;

  // Separator logic:
  // - Show between exact and broad when both exist (page 1 only)
  // - Show at top when ALL results are broad / no exact matches (page 1 only)
  const hasBroadResults = broadProducts.length > 0;
  const hasExactResults = displayExact.length > 0;
  const allResultsAreBroad = hasBroadResults && !hasExactResults;
  const showSeparatorBetween = hasBroadResults && hasExactResults && page === 1;
  const showSeparatorTop = allResultsAreBroad && page === 1;

  // Combined for pagination/count purposes
  const gridProducts = [...exactProducts, ...broadProductsReal];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main content area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb — updates with active category/subcategory */}
        <Breadcrumb items={(() => {
          const crumbs = [{ label: "WholesaleUp", href: "/" }];
          if (filters.category) {
            const cat = FILTER_CATEGORIES.find((c) => c.id === filters.category);
            crumbs.push({ label: "Wholesale Deals", href: "/deals" });
            if (cat) {
              if (filters.subcategory) {
                const sub = cat.children?.find((ch) => ch.id === filters.subcategory);
                crumbs.push({ label: cat.label, href: `/deals/${filters.category}` });
                if (sub) {
                  const subSlug = filters.subcategory.includes("--") ? filters.subcategory.split("--")[1] : filters.subcategory;
                  crumbs.push({ label: sub.label });
                } else {
                  crumbs[crumbs.length - 1] = { label: cat.label };
                }
              } else {
                crumbs.push({ label: cat.label });
              }
            }
          } else {
            crumbs.push({ label: "Wholesale Deals" });
          }
          return crumbs;
        })()} />

        {/* SEO: h1 for page — visually integrated via sr-only since the page uses section headings */}
        <h1 className="sr-only">{pageTitle}</h1>

        {/* Layout: Filter Sidebar + Content */}
        <div className="flex gap-6 items-start">
          {/* Collapsible Filter Panel — shared component */}
          <CollapsibleFilterPanel collapsed={filterCollapsed} onToggle={toggleFilterCollapsed}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              isOpen={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              hideRating
              showBuyerTypes
              maxPrice={computedMaxPrice}
            />
          </CollapsibleFilterPanel>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <SearchToolbar
              title={pageTitle}
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
              <TrendingDealsPanel products={visibleProducts} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
            </div>

            {/* Deals Grid — exact matches first, then broad matches with separator */}
            <div className="mb-8">
              {/* All results are broad — show separator at top (page 1 only) */}
              {showSeparatorTop && (
                <BroadMatchSeparator noExactMatches onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
              )}

              {viewMode === "list" ? (
                <>
                  {displayExact.length > 0 && (
                    <div className="space-y-3">
                      {displayExact.slice(0, 18).map((p) => (
                        <ListDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
                      ))}
                    </div>
                  )}
                  {showSeparatorBetween && (
                    <BroadMatchSeparator exactCount={displayExact.length} onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
                  )}
                  {hasBroadResults && (
                    <div className="space-y-3">
                      {broadProducts.slice(0, Math.max(0, 18 - displayExact.length)).map((p) => (
                        <ListDealCard key={`broad-${p.id}`} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {displayExact.length > 0 && (
                    <div className="grid gap-3 sm:gap-4" style={{gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"}}>
                      {displayExact.slice(0, 18).map((p) => (
                        <DetailedDealCard key={p.id} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
                      ))}
                    </div>
                  )}
                  {showSeparatorBetween && (
                    <BroadMatchSeparator exactCount={displayExact.length} onRefine={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
                  )}
                  {hasBroadResults && (
                    <div className="grid gap-3 sm:gap-4" style={{gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))"}}>
                      {broadProducts.slice(0, Math.max(0, 18 - displayExact.length)).map((p) => (
                        <DetailedDealCard key={`broad-${p.id}`} product={p} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Pagination */}
            <Pagination
              total={897}
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
              buildPageHref={buildPageHref}
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
          showBuyerTypes
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
export { DetailedDealCard, ListDealCard, TrendingDealsPanel, TrendingDealCard, PRODUCTS, FLAGS };
