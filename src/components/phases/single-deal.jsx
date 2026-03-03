"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  EyeOff,
  Eye,
  TrendingUp,
  Lock,
  Flame,
  Star,
  ArrowRight,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Rocket,
  MessageSquare,
  Send,
  X,
  MapPin,
  Phone,
  Globe,
  Clock,
  Mail,
  BadgeCheck,
  ShieldCheck,
  Package,
  Copy,
  ExternalLink,
  Tag,
  Info,
  ShoppingCart,
  Store,
  Users,
  Hash,
  Calendar,
  FileText,
  Download,
  FileSpreadsheet,
  FileArchive,
  HelpCircle,
} from "lucide-react";

/* ─────────── Mock Deal Data ─────────── */
const DEAL = {
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
  moqUnit: "Units",
  sku: "MC-2023-0619",
  taric: "9101110000",
  ean: "7612532169421",
  brands: [{ name: "Midnight", country: "CH" }],
  shippingTime: 14,
  // Volume pricing
  volumePricing: [
    { price: 880.00, currency: "€", range: "from 3 to 15 lots" },
    { price: 780.00, currency: "€", range: "from 16 to 31 lots" },
    { price: 680.00, currency: "€", range: "from 32 to lot" },
  ],
  // Platform pricing
  platforms: [
    { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://amazon.com", color: "#FF9900" },
    { name: "Ebay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://ebay.com", color: "#0064D2" },
    { name: "Amazon", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", price: 12.35, priceCurrency: "€", priceLabel: "/ Unit inc.VAT", grossProfit: 793.10, profitLabel: "/1 Unit inc.VAT", markup: 183.78, verifyUrl: "https://amazon.com", color: "#FF9900" },
  ],
  // Deal details
  dealLocation: "United Kingdom",
  dealLocationCode: "gb",
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
    { name: "Product Specification Sheet.pdf", size: "1.2 MB", type: "pdf" },
    { name: "Wholesale Price List Q4 2023.xlsx", size: "340 KB", type: "xlsx" },
    { name: "Certificate of Authenticity.pdf", size: "820 KB", type: "pdf" },
    { name: "Product Images (High Res).zip", size: "8.4 MB", type: "zip" },
  ],
  // Tags
  tags: ["#samsung", "#galaxy m35", "#5g", "#grey", "#super amoled", "#6.6-inch", "#6gb ram", "#128gb", "#6000mah", "#fast charging", "#nfc", "#wi-fi 6", "#bluetooth 5.3", "#triple camera", "#50mp", "#8mp", "#2mp", "#13mp"],
  // Supplier
  supplier: {
    name: "Mobile Phones & Accessories Wholesaler",
    isVerified: true,
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
      website: "sitename.com",
    },
    contact: {
      name: "Jane Collin",
      position: "Store Manager",
      phone: "+44 0203 0484377",
    },
    hours: {
      Sun: "Closed",
      Mon: "08:00 – 16:00",
      Tue: "08:00 – 16:00",
      Wed: "08:00 – 16:00",
      Thu: "08:00 – 16:00",
      Fri: "08:00 – 14:00",
      Sat: "Closed",
    },
    currentTime: "10:12",
    daysOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  // Related deals
  category: "Mobile Phones & Accessories",
};

/* Mock related deals */
const RELATED_DEALS = [
  {
    id: 101, title: "Sun Babies Kids 5 In 1 Sun Lotion Spf50 200 Ml",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    price: 3.51, currency: "£", unit: "/ Unit", rrp: 14.99, rrpCurrency: "£",
    grossProfit: 11.48, profitUnit: "/ Unit", markup: 327.07,
    amazonPrice: 8.25, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 8.25, ebayProfit: 16.95, ebaySales: 35,
  },
  {
    id: 102, title: "Ergobaby Omni 360 All-Position Babytrage",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    price: 30.10, currency: "£", unit: "/ Unit", rrp: 140.99, rrpCurrency: "£",
    grossProfit: 110.89, profitUnit: "/ Unit", markup: 368.41,
    amazonPrice: 139.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 86.99, ebayProfit: 16.95, ebaySales: 35,
  },
  {
    id: 103, title: "Owlet Dream Sock Fda Cleared Smart Baby Monitor Track Live Pulse Heart Rate",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    price: 99.89, currency: "£", unit: "/ Unit", rrp: 299.99, rrpCurrency: "£",
    grossProfit: 200.10, profitUnit: "/ Unit", markup: 200.32,
    amazonPrice: 269.88, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: null, ebayProfit: null, ebaySales: null,
  },
  {
    id: 104, title: "Motorola VM4 EU Baby Monitor Connect",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    price: 32.63, currency: "£", unit: "/ Unit", rrp: 154.99, rrpCurrency: "£",
    grossProfit: 122.00, profitUnit: "/ Unit", markup: 374.99,
    amazonPrice: 154.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: null, ebayProfit: null, ebaySales: null,
  },
  {
    id: 105, title: "Braun Series 9 Pro Electric Shaver SmartCare Center",
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop",
    price: 89.50, currency: "£", unit: "/ Unit", rrp: 349.99, rrpCurrency: "£",
    grossProfit: 260.49, profitUnit: "/ Unit", markup: 291.05,
    amazonPrice: 299.99, amazonProfit: 16.95, amazonSales: 42,
    ebayPrice: 259.99, ebayProfit: 16.95, ebaySales: 28,
  },
  {
    id: 106, title: "Dyson V8 Absolute Cordless Vacuum Cleaner Refurbished",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=400&fit=crop",
    price: 125.00, currency: "£", unit: "/ Unit", rrp: 399.99, rrpCurrency: "£",
    grossProfit: 274.99, profitUnit: "/ Unit", markup: 219.99,
    amazonPrice: 349.99, amazonProfit: 16.95, amazonSales: 58,
    ebayPrice: 289.99, ebayProfit: 16.95, ebaySales: 41,
  },
  {
    id: 107, title: "JBL Flip 6 Portable Bluetooth Speaker Waterproof",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    price: 45.99, currency: "£", unit: "/ Unit", rrp: 129.99, rrpCurrency: "£",
    grossProfit: 84.00, profitUnit: "/ Unit", markup: 182.66,
    amazonPrice: 119.99, amazonProfit: 16.95, amazonSales: 67,
    ebayPrice: 99.99, ebayProfit: 16.95, ebaySales: 35,
  },
  {
    id: 108, title: "Apple AirPods Pro 2nd Gen With MagSafe Charging Case",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
    price: 145.00, currency: "£", unit: "/ Unit", rrp: 249.00, rrpCurrency: "£",
    grossProfit: 104.00, profitUnit: "/ Unit", markup: 71.72,
    amazonPrice: 229.00, amazonProfit: 16.95, amazonSales: 120,
    ebayPrice: 199.99, ebayProfit: 16.95, ebaySales: 85,
  },
  {
    id: 109, title: "Samsung Galaxy Buds2 Pro Wireless Earbuds Graphite",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop",
    price: 62.00, currency: "£", unit: "/ Unit", rrp: 219.00, rrpCurrency: "£",
    grossProfit: 157.00, profitUnit: "/ Unit", markup: 253.23,
    amazonPrice: 179.00, amazonProfit: 16.95, amazonSales: 74,
    ebayPrice: 149.99, ebayProfit: 16.95, ebaySales: 52,
  },
  {
    id: 110, title: "Bose QuietComfort 45 Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 110.00, currency: "£", unit: "/ Unit", rrp: 329.95, rrpCurrency: "£",
    grossProfit: 219.95, profitUnit: "/ Unit", markup: 199.95,
    amazonPrice: 279.00, amazonProfit: 16.95, amazonSales: 48,
    ebayPrice: 239.99, ebayProfit: 16.95, ebaySales: 33,
  },
];

const MOST_POPULAR_DEALS = [
  {
    id: 201, title: "French Fry Cutter, Sopito Professional Potato Cutter Stainless Steel",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", unit: "/ Unit", dateAdded: "19/09/2023",
    rrp: 59.99, rrpCurrency: "£", grossProfit: 16.95, profitUnit: "/ Unit",
    amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35, markup: 201.8,
  },
  {
    id: 202, title: "Lloytron 35w Classic Flexi Desk Lamp Silver",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", unit: "/ Unit", dateAdded: "19/09/2023",
    rrp: 59.99, rrpCurrency: "£", grossProfit: 16.95, profitUnit: "/ Unit",
    amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35, markup: 201.8,
  },
  {
    id: 203, title: "Peace of the East Wood Effect Chinese Buddha Oil Burner",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", unit: "/ Unit", dateAdded: "19/09/2023",
    rrp: 59.99, rrpCurrency: "£", grossProfit: 16.95, profitUnit: "/ Unit",
    amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35, markup: 201.8,
  },
  {
    id: 204, title: "Lloytron Active Indoor Loop Tv Antenna 50db Black",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    price: 18.95, currency: "£", unit: "/ Unit", dateAdded: "19/09/2023",
    rrp: 59.99, rrpCurrency: "£", grossProfit: 16.95, profitUnit: "/ Unit",
    amazonPrice: 59.99, amazonProfit: 16.95, amazonSales: 35,
    ebayPrice: 59.99, ebayProfit: 16.95, ebaySales: 35, markup: 201.8,
  },
  {
    id: 205, title: "Ninja Air Fryer Max XL 5.5 Qt Grey",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop",
    price: 42.50, currency: "£", unit: "/ Unit", dateAdded: "20/09/2023",
    rrp: 119.99, rrpCurrency: "£", grossProfit: 77.49, profitUnit: "/ Unit",
    amazonPrice: 109.99, amazonProfit: 16.95, amazonSales: 82,
    ebayPrice: 89.99, ebayProfit: 16.95, ebaySales: 55, markup: 182.33,
  },
  {
    id: 206, title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6Qt",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    price: 29.99, currency: "£", unit: "/ Unit", dateAdded: "21/09/2023",
    rrp: 89.99, rrpCurrency: "£", grossProfit: 60.00, profitUnit: "/ Unit",
    amazonPrice: 79.99, amazonProfit: 16.95, amazonSales: 95,
    ebayPrice: 69.99, ebayProfit: 16.95, ebaySales: 48, markup: 200.07,
  },
  {
    id: 207, title: "Philips Sonicare ProtectiveClean 6100 Toothbrush",
    image: "https://images.unsplash.com/photo-1559591937-edc43f547c2c?w=400&h=400&fit=crop",
    price: 35.00, currency: "£", unit: "/ Unit", dateAdded: "22/09/2023",
    rrp: 109.99, rrpCurrency: "£", grossProfit: 74.99, profitUnit: "/ Unit",
    amazonPrice: 99.99, amazonProfit: 16.95, amazonSales: 63,
    ebayPrice: 79.99, ebayProfit: 16.95, ebaySales: 38, markup: 214.26,
  },
  {
    id: 208, title: "Ring Video Doorbell Pro 2 Smart WiFi 1536p HD",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
    price: 55.00, currency: "£", unit: "/ Unit", dateAdded: "23/09/2023",
    rrp: 219.99, rrpCurrency: "£", grossProfit: 164.99, profitUnit: "/ Unit",
    amazonPrice: 189.99, amazonProfit: 16.95, amazonSales: 71,
    ebayPrice: 159.99, ebayProfit: 16.95, ebaySales: 44, markup: 299.98,
  },
  {
    id: 209, title: "Fitbit Charge 5 Advanced Health Fitness Tracker",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    price: 48.00, currency: "£", unit: "/ Unit", dateAdded: "24/09/2023",
    rrp: 139.99, rrpCurrency: "£", grossProfit: 91.99, profitUnit: "/ Unit",
    amazonPrice: 119.99, amazonProfit: 16.95, amazonSales: 88,
    ebayPrice: 99.99, ebayProfit: 16.95, ebaySales: 61, markup: 191.65,
  },
  {
    id: 210, title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
    price: 155.00, currency: "£", unit: "/ Unit", dateAdded: "25/09/2023",
    rrp: 379.00, rrpCurrency: "£", grossProfit: 224.00, profitUnit: "/ Unit",
    amazonPrice: 329.00, amazonProfit: 16.95, amazonSales: 56,
    ebayPrice: 289.99, ebayProfit: 16.95, ebaySales: 39, markup: 144.52,
  },
];

/* ─────────── Info Tooltip ─────────── */
function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, above: true });
  const btnRef = useRef(null);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const above = r.top > 180;
    setPos({
      top: above ? r.top + window.scrollY - 8 : r.bottom + window.scrollY + 8,
      left: r.left + r.width / 2 + window.scrollX,
      above,
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    function close(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setShow(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [show]);

  const handleOpen = () => { updatePos(); setShow(true); };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => { if (show) { setShow(false); } else { handleOpen(); } }}
        onMouseEnter={handleOpen}
        onMouseLeave={() => setShow(false)}
        className="inline-flex text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
      >
        <HelpCircle size={14} />
      </button>
      {show && typeof window !== "undefined" && createPortal(
        <div
          style={{
            position: "absolute",
            top: pos.above ? pos.top : pos.top,
            left: pos.left,
            transform: pos.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            zIndex: 9999,
          }}
          className="w-56 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg leading-relaxed pointer-events-none"
        >
          {text}
          <span
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              pos.above ? "top-full border-t-slate-800" : "bottom-full border-b-slate-800"
            }`}
          />
        </div>,
        document.body
      )}
    </>
  );
}

// Flat flag images via flagcdn.com
function FlagImg({ code, size = 20 }) {
  const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", gb: "gb" };
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}

/* ─────────── Star Rating ─────────── */
function StarRating({ rating, size = 12, showValue = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-slate-200"
          }
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-slate-600">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BREADCRUMB
   ═══════════════════════════════════════════════════ */
function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
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
   IMAGE GALLERY — main image + thumbnails
   ═══════════════════════════════════════════════════ */
function ImageGallery({ images, deal }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const visibleThumbs = showAll ? images : images.slice(0, 4);
  const remaining = images.length - 4;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
        <img
          src={images[selectedIndex]}
          alt="Product"
          className="w-full h-full object-cover aspect-square"
        />

        {/* Top-left badges: Grade, Dropship, Negotiable */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {deal.grade && !deal.isExpired && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500 text-white rounded-md shadow-sm">
              {deal.grade.toUpperCase()}
            </span>
          )}
          {deal.isDropship && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-indigo-500 text-white rounded-md shadow-sm inline-flex items-center gap-1">
              <Truck size={11} /> DROPSHIP
            </span>
          )}
          {deal.negotiable && (
            <span className="px-2.5 py-1 text-[11px] font-bold bg-orange-500 text-white rounded-md shadow-sm">
              NEGOTIABLE
            </span>
          )}
        </div>

        {/* Top-right badge: Markup */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 ${deal.isExpired ? "bg-slate-400" : "bg-emerald-500"} text-white text-[11px] font-bold rounded-md flex items-center gap-1 shadow-sm`}>
          <TrendingUp size={11} /> {deal.markup}%
        </div>

        {/* Sold out overlay */}
        {deal.isExpired && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <div className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 -rotate-6">
              <AlertTriangle size={18} /> SOLD OUT
            </div>
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
            >
              <ChevronLeft size={16} className="text-slate-600" />
            </button>
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
            >
              <ChevronRight size={16} className="text-slate-600" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-2">
        {visibleThumbs.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedIndex === i ? "border-orange-400 shadow-md" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
        {!showAll && remaining > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-16 h-16 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-500 hover:border-slate-300 transition-all"
          >
            {remaining}+
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING PANEL — right column pricing info
   ═══════════════════════════════════════════════════ */
function PricingPanel({ deal, isPremium, isLoggedIn }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Price header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-orange-600">{deal.currency}{deal.price.toFixed(2)}</span>
          <span className="text-sm text-slate-400">{deal.priceUnit}</span>
          {deal.negotiable && <span className="text-sm font-semibold text-orange-500">(negotiable)</span>}
        </div>
        <div className="mt-1 text-sm text-slate-500">
          RRP: <span className="font-semibold text-slate-600 line-through">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span>{" "}<InfoTooltip text="Recommended Retail Price — the manufacturer's suggested selling price to end consumers. Your profit margin is the difference between RRP and your wholesale cost." />
        </div>
      </div>

      {/* Volume pricing */}
      {deal.volumePricing && deal.volumePricing.length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100 space-y-1.5">
          {deal.volumePricing.map((vp, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">{vp.currency}{vp.price.toFixed(2)}</span>
              <span className="text-slate-400">{vp.range}</span>
            </div>
          ))}
        </div>
      )}

      {/* Profit comparison table */}
      <div>
        {/* Column headers */}
        <div className="grid grid-cols-4 px-5 py-2.5 bg-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          <span>Platform</span>
          <span className="text-right">Price</span>
          <span className="text-right">Gross Profit</span>
          <span className="text-right">%Markup</span>
        </div>

        {/* RRP row */}
        <div className="grid grid-cols-4 items-center px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-bold text-slate-700">RRP</span>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-700">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span>
            <p className="text-[10px] text-slate-400">/ Unit</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-700">{deal.rrpCurrency}{(deal.rrp - deal.price).toFixed(2)}</span>
            <p className="text-[10px] text-slate-400">/ Unit</p>
          </div>
          <span className="flex justify-end">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-md">
              <TrendingUp size={11} /> {deal.markup}%
            </span>
          </span>
        </div>

        {/* Platform rows */}
        {deal.platforms.map((p, i) => (
          <div key={i} className={`grid grid-cols-4 items-center px-5 py-3 ${i < deal.platforms.length - 1 ? "border-b border-slate-100" : ""}`}>
            <div className="flex items-center gap-2">
              <img src={p.icon} alt={p.name} className={p.name === "Ebay" ? "h-4 w-auto" : "w-5 h-5"} />
              {p.verifyUrl && (
                <a href={p.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-500 transition-colors" title={`View on ${p.name}`}>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-700">{p.priceCurrency}{p.price.toFixed(2)}</span>
              <p className="text-[10px] text-slate-400">/ Unit</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-slate-700">{p.priceCurrency}{p.grossProfit.toFixed(2)}</span>
              <p className="text-[10px] text-slate-400">/ Unit</p>
            </div>
            <span className="flex justify-end">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-white text-[11px] font-bold rounded-md" style={{ backgroundColor: p.color }}>
                <TrendingUp size={11} /> {p.markup.toFixed(2)}%
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Order button */}
      <div className="px-5 pt-4 pb-2 border-t border-slate-100">
        {isPremium ? (
          <button className="w-full py-3 rounded-lg text-sm font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-2">
            <ShoppingCart size={16} /> Order
          </button>
        ) : (
          <a href="/pricing" className="w-full py-3 rounded-lg text-sm font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-2">
            <Lock size={16} /> Order Now From This Supplier
          </a>
        )}
      </div>

      {/* Deal details */}
      <div className="px-5 py-3 border-b border-slate-100">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
          <span className="text-slate-500">Minimum Order Quantity</span>
          <span className="font-semibold text-slate-800">{deal.moq} {deal.moqUnit}</span>

          {deal.availableQuantity && (<>
            <span className="text-slate-500">Available Quantity</span>
            <span className="font-semibold text-slate-800">{deal.availableQuantity} pieces</span>
          </>)}

          <span className="text-slate-500">Country</span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <FlagImg code={deal.dealLocationCode} size={16} /> {deal.dealLocation}
          </span>

          <span className="text-slate-500">Grade</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1">{deal.grade} <InfoTooltip text="The condition of the product. 'New' means factory-sealed and unused. Other grades include Refurbished, Grade A (like new), Grade B (minor cosmetic wear), and Grade C (visible wear but fully functional)." /></span>

          {deal.brands && deal.brands.length > 0 && (<>
            <span className="text-slate-500">Brands</span>
            <span className="font-semibold text-orange-500">
              {deal.brands.map((b, i) => (
                <span key={i}>{i > 0 && ", "}<a href="#" className="hover:underline">{b.name}</a>{b.country && <> - <a href="#" className="hover:underline">{b.country}</a></>}</span>
              ))}
            </span>
          </>)}

          {deal.shippingTime && (<>
            <span className="text-slate-500">Shipping time</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">{deal.shippingTime} days <InfoTooltip text="Estimated number of business days from order confirmation to delivery. Actual times may vary based on destination, customs clearance, and carrier availability." /></span>
          </>)}

          {deal.sku && (<>
            <span className="text-slate-500">SKU</span>
            <span className="font-semibold text-slate-800">{deal.sku}</span>
          </>)}

          {deal.taric && (<>
            <span className="text-slate-500">TARIC</span>
            <span className="font-semibold text-slate-800">{deal.taric}</span>
          </>)}

          {deal.ean && (<>
            <span className="text-slate-500">EAN</span>
            <span className="font-semibold text-slate-800">{deal.ean}</span>
          </>)}
        </div>
      </div>

      {/* Contact buttons */}
      <div className="px-5 py-4 flex gap-3">
        <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Phone size={15} /> Call Now
        </button>
        <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Mail size={15} /> Send Enquiry
        </button>
      </div>

      {/* Money back guarantee */}
      <div className="mx-5 mb-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-sm font-bold text-slate-800">100% Money Back Guarantee</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          &ldquo;At Wholesale Deals we guarantee that the supplier has this deal at the quoted price or your money back!&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OPENING HOURS WIDGET — interactive day picker
   ═══════════════════════════════════════════════════ */
function OpeningHoursWidget({ supplier }) {
  const todayIndex = new Date().getDay(); // 0=Sun … 6=Sat
  const [hoveredDay, setHoveredDay] = useState(null);

  const activeDay = hoveredDay !== null ? hoveredDay : todayIndex;
  const activeDayName = supplier.daysOfWeek[activeDay];
  const activeHours = supplier.hours?.[activeDayName] ?? "—";
  const isClosed = activeHours === "Closed";

  // Determine if supplier is currently open (based on today, not hovered day)
  const todayName = supplier.daysOfWeek[todayIndex];
  const todayHours = supplier.hours?.[todayName] ?? "Closed";
  const isCurrentlyOpen = (() => {
    if (todayHours === "Closed") return false;
    const [open, close] = todayHours.split("–").map((t) => t.trim());
    if (!open || !close) return false;
    const now = supplier.currentTime.replace(":", "");
    const openN = open.replace(":", "");
    const closeN = close.replace(":", "");
    return now >= openN && now < closeN;
  })();

  return (
    <div className="px-5 py-3 border-b border-slate-100">
      {/* Title + live status */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xs text-slate-500">Opening Hours</span>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
          isCurrentlyOpen
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyOpen ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
          {isCurrentlyOpen ? "Open now" : "Closed"}
        </span>
      </div>

      {/* Day pills */}
      <div className="flex gap-1 mb-2">
        {supplier.daysOfWeek.map((day, i) => {
          const isActive = i === activeDay;

          return (
            <span
              key={day}
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-md cursor-pointer transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>

      {/* Hours display for active/hovered day */}
      <div className="flex items-center justify-center gap-2 text-xs mb-2">
        <span className="text-slate-400">{activeDayName}</span>
        <span className={`font-bold ${isClosed ? "text-red-400" : "text-slate-700"}`}>
          {activeHours}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        At wholesaler&apos;s it is currently <span className="font-bold text-slate-700">{supplier.currentTime}</span> o&apos;clock
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPPLIER SIDEBAR CARD — right column supplier info
   ═══════════════════════════════════════════════════ */
function SupplierSidebarCard({ supplier, isPremium, isLoggedIn }) {
  const scrambleText = (text) => {
    if (!text) return "";
    return text.split("").map((c) => (c === " " ? " " : "*")).join("").slice(0, 5);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Supplier header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {supplier.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">
              <BadgeCheck size={10} />
              Verified Seller
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-slate-900">{supplier.name}</h3>
        {/* Rating + Years */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StarRating rating={supplier.rating} size={12} showValue />
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {supplier.yearsActive} yrs
          </span>
        </div>
        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {supplier.categories.map((cat) => (
            <a key={cat} href="#" className="px-3 py-1 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors">
              {cat}
            </a>
          ))}
          {supplier.moreCategories > 0 && (
            <span className="px-3 py-1 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-full">
              +{supplier.moreCategories}
            </span>
          )}
        </div>
      </div>

      {/* Address + Contact section */}
      <div className="relative">
        <div className={!isPremium ? "select-none" : ""} style={!isPremium ? { filter: "blur(5px)" } : undefined}>
          {/* Address */}
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Address</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Country:</span>
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <FlagImg code={supplier.address.countryCode} size={16} /> {supplier.address.country}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">City:</span>
                <span className="font-semibold text-slate-800">{supplier.address.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Postal Code:</span>
                <span className="font-semibold text-slate-800">{supplier.address.postalCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Street:</span>
                <span className="font-semibold text-slate-800">{supplier.address.street}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Website:</span>
                <span className="font-semibold text-slate-800">{supplier.address.website}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contact</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Contact Name:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Position:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.position}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-semibold text-slate-800">{supplier.contact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solid overlay with "Show Details" for non-premium */}
        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 backdrop-blur-sm">
            <a href="/pricing" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all">
              Show Details
            </a>
          </div>
        )}
      </div>

      {/* Opening hours */}
      <OpeningHoursWidget supplier={supplier} />

      {/* Gating message + CTA */}
      {!isPremium && (
        <div className="px-5 py-3 border-b border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-3">Join to access supplier details</p>
          <a href="/pricing" className="w-full py-2.5 rounded-lg text-sm font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-2">
            <Lock size={14} /> Join Now!
          </a>
        </div>
      )}

      {/* View Profile / View All Deals */}
      <div className="px-5 py-4 flex gap-3">
        <a href="/suppliers" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Store size={15} /> View Profile
        </a>
        <a href="/deals" className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-orange-500 border border-orange-300 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
          <Tag size={15} /> View All Deals
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLATFORM COMPARISON TABLE — profit verification
   ═══════════════════════════════════════════════════ */
function PlatformComparison({ platforms, deal, isPremium }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {platforms.map((p, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Platform header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <img src={p.icon} alt={p.name} className={p.name === "Ebay" ? "h-4 w-auto" : "w-5 h-5"} />
              <span className="text-sm font-bold text-slate-800">{p.name}</span>
            </div>
            <a href={p.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>
          {/* Pricing details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Your price</span>
              <span className="font-semibold text-slate-800">{p.priceCurrency}{p.price.toFixed(2)} <span className="text-xs text-slate-400">{p.priceLabel}</span></span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Gross profit</span>
              <span className="font-semibold text-slate-800">{p.priceCurrency}{p.grossProfit.toFixed(2)} <span className="text-xs text-slate-400">{p.profitLabel}</span></span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">% Markup</span>
              <span className="text-lg font-extrabold" style={{ color: p.color }}>{p.markup.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   FILE ICONS — shared by attachments tab
   ═══════════════════════════════════════════════════ */
const FILE_ICONS = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  xls: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  zip: { icon: FileArchive, color: "text-amber-600", bg: "bg-amber-50" },
  default: { icon: FileText, color: "text-slate-500", bg: "bg-slate-50" },
};

/* ═══════════════════════════════════════════════════
   PRODUCT DESCRIPTION TABS — Description + Attachments
   ═══════════════════════════════════════════════════ */
function ProductDescriptionTabs({ deal }) {
  const [activeTab, setActiveTab] = useState("description");
  const [expanded, setExpanded] = useState(false);
  const LINE_LIMIT = 10;
  const lines = deal.description.split("\n");
  const isLong = lines.length > LINE_LIMIT;
  const displayText = expanded || !isLong ? deal.description : lines.slice(0, LINE_LIMIT).join("\n") + "…";

  const tabs = [
    { key: "description", label: "Description" },
    { key: "attachments", label: "Supplier Attachments" },
  ];

  return (
    <>
      {/* Tab headers */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3.5 text-sm font-semibold transition-colors relative ${
              activeTab === tab.key
                ? "text-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-6 right-6 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div>
            {/* Description text */}
            <div className="mb-8">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400" /> Product Description</h3>
              <div className="pl-[26px]">
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{displayText}</div>
                {isLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            </div>

            {/* Deal details (payment, delivery, shipping) */}
            <DealDetailsTable deal={deal} />

            {/* Tags */}
            <TagsSection tags={deal.tags} />
          </div>
        )}

        {activeTab === "attachments" && (
          <div>
            {deal.attachments && deal.attachments.length > 0 ? (
              <div className="space-y-2">
                {deal.attachments.map((file, i) => {
                  const ext = file.type || file.name.split(".").pop().toLowerCase();
                  const { icon: Icon, color, bg } = FILE_ICONS[ext] || FILE_ICONS.default;
                  return (
                    <a
                      key={i}
                      href="#"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-150 hover:border-orange-200 hover:bg-orange-50/40 transition-all group"
                    >
                      <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-orange-600 transition-colors">{file.name}</p>
                        <p className="text-xs text-slate-400">{file.size}</p>
                      </div>
                      <Download size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors shrink-0" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No attachments available for this listing.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   TAGS SECTION
   ═══════════════════════════════════════════════════ */
function TagsSection({ tags }) {
  return (
    <div>
      <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Hash size={18} className="text-slate-400" /> Tags</h3>
      <div className="flex flex-wrap gap-2 pl-[26px]">
        {tags.map((tag) => (
          <a key={tag} href="#" className="px-3 py-1.5 text-xs text-slate-600 border border-slate-200 rounded-lg hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all">
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SUPERCHARGE CTA — inline promo banner
   ═══════════════════════════════════════════════════ */
function SuperchargeCta() {
  const benefits = [
    "Discover trustworthy suppliers with low or no minimum order requirements.",
    "Unlock exclusive 'industry secret' suppliers you won't find on Google.",
    "Source fast-selling products at profit margins of 45% to 95%.",
    "Find the suppliers you need, guaranteed, with our custom sourcing pledge.",
  ];

  return (
    <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Illustration */}
        <div className="hidden lg:block shrink-0">
          <img
            src="/deals-vector.svg"
            alt="Supercharge"
            className="w-32 h-auto"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 mb-4">Ready to Supercharge Your Business?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-base text-slate-600 leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
          <a href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 rounded-lg transition-all">
            <Lock size={14} /> Try it Now!
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DEAL DETAILS TABLE — payment, delivery, shipping
   ═══════════════════════════════════════════════════ */
function DealDetailsTable({ deal }) {
  return (
    <>
      {/* Payment options */}
      {deal.paymentOptions && deal.paymentOptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><ShoppingCart size={18} className="text-slate-400" /> Payment options</h3>
          <div className="space-y-1.5 pl-[26px]">
            {deal.paymentOptions.map((opt) => (
              <div key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery options */}
      {deal.deliveryOptions && deal.deliveryOptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Truck size={18} className="text-slate-400" /> Delivery options</h3>
          <div className="space-y-1.5 pl-[26px]">
            {deal.deliveryOptions.map((opt) => (
              <div key={opt} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping countries */}
      {deal.shippingCountries && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Globe size={18} className="text-slate-400" /> Shipping to countries</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3 pl-[26px]">{deal.shippingCountries}</p>
          <div className="bg-slate-50 rounded-lg px-4 py-3 ml-[26px]">
            <p className="text-xs text-slate-500 leading-relaxed">This supplier ships to the countries listed above. Shipping costs and delivery times may vary depending on the destination. Contact the supplier for exact shipping quotes and estimated delivery windows for your location.</p>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════
   RELATED DEALS CAROUSEL
   ═══════════════════════════════════════════════════ */
function RelatedDealsCarousel({ label, title, subtitle, cta, deals, isPremium, isLoggedIn }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({ left: dir === -1 ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          {cta || "Explore Deals"} <ArrowRight size={14} />
        </a>
      </div>

      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {deals.map((d) => (
            <div key={d.id} className="shrink-0 w-[240px] sm:w-[260px] lg:w-[280px] snap-start">
              <RelatedDealCard deal={d} isPremium={isPremium} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>
    </div>
  );
}

function RelatedDealCard({ deal, isPremium, isLoggedIn }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col h-full">
      {/* Image */}
      <a href="/single-deal" className="block relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {/* Markup badge */}
        {deal.markup && (
          <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
            <TrendingUp size={10} /> {deal.markup}%
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-base font-extrabold text-orange-600">{deal.currency}{deal.price.toFixed(2)}</span>
          <span className="text-[10px] text-slate-400">{deal.unit || "ex.VAT"}</span>
        </div>

        {deal.dateAdded && (
          <p className="text-[10px] text-slate-400 mb-1.5">Deal First Featured On: {deal.dateAdded}</p>
        )}

        {/* Title */}
        <a href="/single-deal">
          <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-orange-600 transition-colors mb-2.5">
            {deal.title}
          </h3>
        </a>

        {/* RRP + Profit */}
        <div className="border-t border-slate-100 text-[11px]">
          <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100">
            <span className="text-slate-400 font-semibold w-9">RRP</span>
            <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.rrp.toFixed(2)}</span>
            <span className="text-emerald-600 font-bold">Profit {deal.rrpCurrency}{deal.grossProfit?.toFixed(2) || "16.95"} / {deal.amazonSales || 35}</span>
          </div>
          {deal.amazonPrice && (
            <div className="flex items-center justify-between py-1.5 border-b border-dashed border-slate-100">
              <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-4 h-4" /></div>
              <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.amazonPrice.toFixed(2)}</span>
              <span className="font-bold" style={{ color: "#FF9900" }}>Profit {deal.rrpCurrency}{deal.amazonProfit?.toFixed(2) || "16.95"} / {deal.amazonSales || 35}</span>
            </div>
          )}
          {deal.ebayPrice && (
            <div className="flex items-center justify-between py-1.5">
              <div className="w-9 shrink-0"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-3 w-auto" /></div>
              <span className="text-slate-500 flex-1">{deal.rrpCurrency}{deal.ebayPrice.toFixed(2)}</span>
              <span className="font-bold" style={{ color: "#0064D2" }}>Profit {deal.rrpCurrency}{deal.ebayProfit?.toFixed(2) || "16.95"} / {deal.ebaySales || 35}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-2.5">
          {isPremium ? (
            <button className="w-full py-2 rounded-lg text-xs font-bold text-center bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <MessageSquare size={12} /> Message Supplier
            </button>
          ) : (
            <a href="/pricing" className="w-full py-2 rounded-lg text-xs font-bold text-center bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center justify-center gap-1.5">
              <Lock size={12} /> Join Now!
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CTA BANNER — dual buttons
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   TRUST SECTION — testimonials + stats
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
   CTA BANNER — Get Started
   ═══════════════════════════════════════════════════ */
function CtaBanner() {
  return (
    <div className="mt-12 bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
      {/* Left illustrations */}
      <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="52" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <rect x="25" y="42" width="50" height="38" rx="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M38 42V32a12 12 0 0 1 24 0v10" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="52" r="2.5" fill="#1E293B" />
          <circle cx="60" cy="52" r="2.5" fill="#1E293B" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="48" rx="26" ry="24" fill="#FED7AA" opacity="0.5" />
          <path d="M20 20h28l28 28-22 22L20 48V20z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <circle cx="34" cy="34" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{ width: "4.5rem", height: "4.5rem" }}>
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M16 35l34-17 34 17v30L50 82 16 65V35z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <path d="M16 35l34 17 34-17" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M50 52v30" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Right illustrations */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="42" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <circle cx="42" cy="42" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M56 56l22 22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 78h64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 78V22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 64l14-12 12 6 14-20 14-12" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="26" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{ width: "4.5rem", height: "4.5rem" }}>
          <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 50l14-14 10 4 8-8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 32l10 10 4-10 18 18" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 54l8 8 12-6 8 8" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
   MAIN — /single-deal page
   ═══════════════════════════════════════════════════ */
export default function SingleDealPage() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [faved, setFaved] = useState(false);

  // Sync with global demo auth bar in AppLayout
  useEffect(() => {
    const handler = (e) => {
      setIsLoggedIn(e.detail.loggedIn);
      setIsPremium(e.detail.premium || false);
    };
    window.addEventListener("demo-auth", handler);
    return () => window.removeEventListener("demo-auth", handler);
  }, []);

  const deal = DEAL;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "Wholesale Deals", href: "/deals" },
          { label: deal.category, href: `/deals?category=${encodeURIComponent(deal.category)}` },
          { label: deal.title },
        ]} />

        {/* === TITLE ROW (spans full width) === */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {deal.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Deal First Featured On: {deal.dateAdded}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
              title="Hide deal"
            >
              <EyeOff size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => setFaved(!faved)}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
              title={faved ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart size={16} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>

        {/* === MAIN GRID: Image | Pricing | Contact === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Row 1: Image */}
          <div className="min-w-0">
            <ImageGallery images={deal.images} deal={deal} />
          </div>
          {/* Row 1: Pricing Panel */}
          <div className="min-w-0">
            <PricingPanel deal={deal} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          </div>
          {/* Row 1 + Row 2: Contact Panel (sticky, spans both rows) */}
          <div className="min-w-0 xl:row-span-2 xl:sticky xl:top-[120px] xl:self-start">
            <SupplierSidebarCard supplier={deal.supplier} isPremium={isPremium} isLoggedIn={isLoggedIn} />
          </div>
          {/* Row 2: Description (spans image + pricing columns) */}
          <div className="min-w-0 xl:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <ProductDescriptionTabs deal={deal} />
            </div>
          </div>
        </div>

        {/* Supercharge CTA — after contact panel in flow */}
        {!isPremium && <div className="mt-8"><SuperchargeCta /></div>}

        {/* ─── RELATED DEALS ─── */}
        <RelatedDealsCarousel label="Deals" title="Related Top Deals" subtitle="Similar wholesale opportunities you might be interested in." cta="Explore Related Top Deals" deals={RELATED_DEALS} isPremium={isPremium} isLoggedIn={isLoggedIn} />

        {/* ─── MOST POPULAR OFFERS ─── */}
        <RelatedDealsCarousel label="Trending" title="Most Popular Offers" subtitle="The hottest wholesale and dropship deals right now." cta="Explore Most Popular Deals" deals={MOST_POPULAR_DEALS} isPremium={isPremium} isLoggedIn={isLoggedIn} />

        {/* ─── TRUST SECTION ─── */}
        <TrustSection />

        {/* ─── CTA BANNER ─── */}
        <CtaBanner />
      </div>
    </div>
  );
}
