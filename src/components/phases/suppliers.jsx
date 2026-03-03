"use client";

import { useState, useRef, useEffect } from "react";
import {
  Tag,
  Star,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  ChevronRight,
  Lock,
  BadgeCheck,
  ExternalLink,
  Send,
  MessageSquare,
  Eye,
  EyeOff,
  Calendar,
  Package,
  Heart,
  Sparkles,
  Copy,
  Check,
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  SlidersHorizontal,
  AlertTriangle,
  Filter,
  X,
  ChevronLeft,
  ArrowRight,
  ShoppingCart,
  Store,
} from "lucide-react";

import { FilterSidebar, ActiveFilterChips, Pagination } from "./filters";

/* ─────────── Flag Images (flat style via flagcdn.com) ─────────── */
const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", AU: "au" };
function FlagImg({ code, size = 20 }) {
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
              : "text-slate-200 fill-slate-200"
          }
        />
      ))}
      {showValue && <span className="text-xs font-semibold text-slate-600 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}

/* ─────────── Highlight Keywords in Text ─────────── */
function HighlightedText({ text, keyword }) {
  if (!keyword || !text) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? (
      <strong key={i} className="font-bold text-slate-900">{part}</strong>
    ) : (
      part
    )
  );
}

/* ─────────── Blurred Text (Free tier gating) ─────────── */
function scrambleText(text) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return text.replace(/[A-Za-z0-9]/g, (ch, i) => chars[(ch.charCodeAt(0) + i * 7) % chars.length]);
}

function BlurredText({ text, isPremium, className = "" }) {
  if (isPremium) return <span className={`${className} opacity-60`}>{text}</span>;
  return (
    <span className={`select-none pointer-events-none ${className}`}>
      {scrambleText(text || "")}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT SUPPLIER MODAL
   ═══════════════════════════════════════════════════ */
function ContactSupplierModal({ supplier, onClose }) {
  const [form, setForm] = useState({ subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  };

  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Contact Supplier</h3>
              <p className="text-blue-100 text-xs mt-0.5">{supplier.name}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <BadgeCheck size={24} className="text-emerald-500" />
              </div>
              <p className="font-bold text-slate-900">Message Sent!</p>
              <p className="text-sm text-slate-500 mt-1">The supplier will respond to your enquiry shortly.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Enquiry about bulk pricing"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your message to the supplier..."
                  rows={5}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!form.subject.trim() || !form.message.trim()}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Mail size={12} /> Send Message
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   REPORT INVALID DETAILS MODAL
   ═══════════════════════════════════════════════════ */
function ReportInvalidModal({ supplier, field, onClose }) {
  const [comments, setComments] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  };

  if (!supplier || !field) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Report Invalid Details</h3>
              <p className="text-red-100 text-xs mt-0.5">{supplier.name}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <BadgeCheck size={24} className="text-emerald-500" />
              </div>
              <p className="font-bold text-slate-900">Report Submitted!</p>
              <p className="text-sm text-slate-500 mt-1">Thank you for helping us keep supplier details accurate.</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2.5">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">Reporting: <span className="text-red-600">{field}</span></p>
                  <p className="text-[11px] text-slate-500 mt-0.5">You are reporting that this supplier's {field.toLowerCase()} details may be incorrect or outdated.</p>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Comments (optional)</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what's wrong with this information..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle size={12} /> Submit Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Mock Supplier Data ─────────── */
const SUPPLIERS = [
  {
    id: 1,
    name: "Trainers and Sportswear Supplier",
    country: "UK",
    countryName: "United Kingdom",
    rating: 5.0,
    reviewCount: 24,
    yearsActive: 8,
    verified: true,
    description: "We are a wholesaler of sportswear clothing and shoes. We offer high quality of adidas originals men's sports jackets, adidas long sleeved formal button collared mens shirts, canterbury tour and waimak polo shirts, adidas andy murray t-shirts. We also stock a wide range of trainers including adidas superstar, nike air max, nike free run, reebok classics and many more popular brands at competitive wholesale prices. Our warehouse in East London carries over 10,000 SKUs across all major sportswear categories with new stock arriving weekly from brand-authorised sources. We supply independent retailers, market traders, and online sellers across the UK and Europe with minimum order quantities starting from just 10 units. All items come with full manufacturer warranty and authenticity guarantee. We also offer a bespoke embroidery and printing service for team kits and corporate workwear orders.",
    phone: "+4402089072658",
    email: "wholesaletrain@gmail.com",
    address: "9 Fisher's Lane, Chiswick London United Kingdom",
    zip: "W41RX",
    city: "London",
    website: "www.sportswearwholesale.co.uk",
    contactName: "Jane Collin",
    contactPosition: "Store Manager",
    categories: ["Computer & Software Lots", "Electrical & Lighting Lots", "Telephony & Mobile Phones Lots", "Sports & Leisure", "Apparel & Clothing"],
    products: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches",
    brands: ["Adidas", "Nike", "Reebok", "Canterbury"],
    openingHours: "08:00-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Dropshipping", "B2B"],
  },
  {
    id: 2,
    name: "Basketball Sport Supplier",
    country: "DE",
    countryName: "Germany",
    rating: 4.5,
    reviewCount: 18,
    yearsActive: 5,
    verified: true,
    description: "Premium basketball equipment and sportswear distributor covering Europe. We specialise in authentic NBA merchandise, professional-grade basketballs, training equipment, and team uniforms. Our warehouse stocks over 5,000 SKUs from leading brands with same-day dispatch on orders placed before 2pm CET.",
    phone: "+49301234567",
    email: "info@basketballsport.de",
    address: "Berliner Str. 45, Berlin Germany",
    zip: "10115",
    city: "Berlin",
    website: "www.basketballsport.de",
    contactName: "Hans Mueller",
    contactPosition: "Sales Director",
    categories: ["Sports & Leisure", "Apparel & Clothing", "Toys & Games"],
    products: "Basketball Equipment, Sports Apparel, Training Gear",
    brands: ["Nike", "Under Armour", "Spalding", "Wilson"],
    openingHours: "09:00-17:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B"],
  },
  {
    id: 3,
    name: "Casual & Everyday Clothing Wholesaler",
    country: "UK",
    countryName: "United Kingdom",
    rating: 4.2,
    reviewCount: 12,
    yearsActive: 6,
    verified: true,
    description: "We are a wholesaler of clothing and accessories. We offer a wide range of products, such as premium brand dresses, jackets, trousers, shirts, shoes, handbags, watches, and jewelry from consumer returns and end of line collections. Our goal is to provide retailers with high quality, affordable luxury fashion items that help them stand out in a competitive market. We source our stock from leading UK department stores, high-street chains, and online retailers, ensuring every batch is genuine branded merchandise. Our Manchester distribution centre processes over 50,000 units per week with full quality control inspection on every item. We offer flexible buying options including pre-sorted grade A pallets, mixed fashion pallets, and hand-picked premium bundles tailored to your store's customer profile.",
    phone: "+4402039876543",
    email: "sales@casualwholesale.co.uk",
    address: "15 Victoria Road, Manchester United Kingdom",
    zip: "M1 2AB",
    city: "Manchester",
    website: "www.casualwholesale.co.uk",
    contactName: "Sarah Thompson",
    contactPosition: "Operations Manager",
    categories: ["Apparel & Clothing", "Jewellery & Watches", "Health & Beauty"],
    products: "Premium Clothings, Premium Footwears, Premium Accessories, Premium Watches, Premium Jewelries, Premium Handbags",
    brands: [],
    openingHours: "08:00-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Liquidation", "Returns"],
  },
  {
    id: 4,
    name: "TechWorld Electronics Wholesale",
    country: "US",
    countryName: "United States",
    rating: 4.8,
    reviewCount: 42,
    yearsActive: 12,
    verified: true,
    description: "Major US electronics wholesaler specialising in consumer tech, laptops, tablets, gaming accessories, and smart home devices. Direct partnerships with top brands ensure competitive pricing and authentic products.",
    phone: "+12125551234",
    email: "sales@techworldwholesale.com",
    address: "350 Fifth Avenue, New York, USA",
    zip: "10118",
    city: "New York",
    website: "www.techworldwholesale.com",
    contactName: "Mike Reynolds",
    contactPosition: "VP Sales",
    categories: ["Computing", "Consumer Electronic", "Mobile & Home Phones"],
    products: "Laptops, Tablets, Smartphones, Gaming Accessories, Smart Home Devices",
    brands: ["Apple", "Samsung", "Sony", "Dell", "HP"],
    openingHours: "08:00-18:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B", "Dropshipping"],
  },
  {
    id: 5,
    name: "EuroBeauty Distribution",
    country: "FR",
    countryName: "France",
    rating: 4.6,
    reviewCount: 31,
    yearsActive: 9,
    verified: true,
    description: "Leading European distributor of premium beauty, skincare, and fragrance products. Authorised stockist for over 200 brands including prestige and mass-market lines. Full dropship capability across EU. Our Paris headquarters manages logistics for over 15,000 active products with temperature-controlled storage for sensitive skincare and fragrance lines. We offer white-label packaging services, custom gift set assembly, and branded display stands for retail partners. New collections are added monthly with exclusive early access for premium trade members. Our dedicated account managers provide personalised product recommendations based on your customer demographics and regional trends.",
    phone: "+33142567890",
    email: "contact@eurobeauty.fr",
    address: "25 Rue de Rivoli, Paris, France",
    zip: "75001",
    city: "Paris",
    website: "www.eurobeauty.fr",
    contactName: "Sophie Laurent",
    contactPosition: "Commercial Director",
    categories: ["Health & Beauty", "Jewellery & Watches"],
    products: "Skincare, Makeup, Perfumes, Hair Care, Nail Care, Beauty Tools",
    brands: ["L'Oréal", "Chanel", "Dior", "Estée Lauder"],
    openingHours: "09:00-17:30",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Dropshipping"],
  },
  {
    id: 6,
    name: "Nordic Home & Living AB",
    country: "DE",
    countryName: "Germany",
    rating: 4.3,
    reviewCount: 16,
    yearsActive: 4,
    verified: false,
    description: "Scandinavian-inspired home and garden products wholesaler. Specialising in minimalist furniture, kitchen essentials, bedding, and outdoor living. All products meet EU quality and sustainability standards.",
    phone: "+49891234567",
    email: "info@nordichome.de",
    address: "Maximilianstr. 12, Munich, Germany",
    zip: "80539",
    city: "Munich",
    website: "www.nordichome.de",
    contactName: "Klaus Weber",
    contactPosition: "Founder",
    categories: ["Home & Garden"],
    products: "Furniture, Kitchenware, Bedding, Garden Accessories, Home Decor",
    brands: [],
    openingHours: "08:30-16:30",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B"],
  },
  {
    id: 7,
    name: "KidZone Toys & Games Ltd",
    country: "UK",
    countryName: "United Kingdom",
    rating: 4.7,
    reviewCount: 28,
    yearsActive: 7,
    verified: true,
    description: "UK's fastest-growing toy and game wholesaler. Huge range of licensed character toys, educational games, outdoor play equipment, and arts & crafts supplies. Competitive MOQs and fast UK delivery. We hold licences for Disney, Marvel, Peppa Pig, PAW Patrol, and many more popular children's brands. Our Birmingham warehouse stocks over 8,000 unique toy lines with seasonal ranges updated quarterly. We serve nurseries, gift shops, garden centres, and online retailers with trade pricing starting from just 6 units per line. Full POS display solutions and promotional bundles available for in-store events and seasonal peaks including Christmas, Easter, and back-to-school periods.",
    phone: "+4402078901234",
    email: "trade@kidzonetoys.co.uk",
    address: "Unit 8, Westfield Industrial Park, Birmingham, UK",
    zip: "B1 2RA",
    city: "Birmingham",
    website: "www.kidzonetoys.co.uk",
    contactName: "David Patel",
    contactPosition: "Trade Manager",
    categories: ["Toys & Games", "Baby Products"],
    products: "Action Figures, Board Games, Dolls, Educational Toys, Outdoor Toys, Arts & Crafts",
    brands: ["Hasbro", "LEGO", "Mattel", "Disney"],
    openingHours: "07:30-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Dropshipping", "Liquidation"],
  },
  {
    id: 8,
    name: "MegaPallets Liquidation",
    country: "NL",
    countryName: "Netherlands",
    rating: 3.9,
    reviewCount: 9,
    yearsActive: 3,
    verified: false,
    description: "Pallet and stocklot liquidator based in the Netherlands. We deal in customer returns, overstock, and end-of-line goods from major European retailers. Mixed pallets and sorted category pallets available.",
    phone: "+31201234567",
    email: "buy@megapallets.nl",
    address: "Industrieweg 88, Amsterdam, Netherlands",
    zip: "1099 AB",
    city: "Amsterdam",
    website: "www.megapallets.nl",
    contactName: "Jan de Vries",
    contactPosition: "Sales Manager",
    categories: ["Surplus & Stocklots", "Consumer Electronic", "Apparel & Clothing"],
    products: "Mixed Pallets, Sorted Pallets, Customer Returns, Overstock",
    brands: [],
    openingHours: "08:00-17:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Liquidation", "Returns", "Wholesale"],
  },
  {
    id: 9,
    name: "Iberian Office Supplies SL",
    country: "ES",
    countryName: "Spain",
    rating: 4.4,
    reviewCount: 14,
    yearsActive: 11,
    verified: true,
    description: "Office and business supplies wholesaler serving the Iberian Peninsula and wider Europe. Full range of stationery, printing supplies, office furniture, and tech accessories. Same-day dispatch on in-stock items.",
    phone: "+34911234567",
    email: "ventas@iberianoffice.es",
    address: "Calle Gran Vía 28, Madrid, Spain",
    zip: "28013",
    city: "Madrid",
    website: "www.iberianoffice.es",
    contactName: "Carlos Ruiz",
    contactPosition: "Export Manager",
    categories: ["Office & Business", "Computing"],
    products: "Stationery, Printers & Ink, Office Furniture, Filing Supplies",
    brands: ["HP", "Canon", "Fellowes", "Rexel"],
    openingHours: "09:00-18:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B"],
  },
  {
    id: 10,
    name: "Roma Fashion Italia",
    country: "IT",
    countryName: "Italy",
    rating: 4.9,
    reviewCount: 37,
    yearsActive: 15,
    verified: true,
    description: "Premium Italian fashion wholesaler offering authentic Made in Italy clothing, leather goods, shoes, and accessories. Direct from Italian manufacturers and ateliers. Specialising in luxury and mid-range fashion brands. We work directly with over 60 Italian artisan workshops and fashion houses to bring you exclusive collections that cannot be found through mainstream wholesale channels. Each season we curate a hand-selected range of leather jackets, silk scarves, handcrafted shoes, and designer handbags with full certificates of authenticity. Our export team handles all customs documentation and VAT reclaim paperwork for non-EU buyers, making international trade seamless.",
    phone: "+390612345678",
    email: "export@romafashion.it",
    address: "Via del Corso 120, Rome, Italy",
    zip: "00186",
    city: "Rome",
    website: "www.romafashion.it",
    contactName: "Giulia Rossi",
    contactPosition: "International Sales",
    categories: ["Apparel & Clothing", "Jewellery & Watches"],
    products: "Designer Clothing, Leather Goods, Shoes, Handbags, Accessories",
    brands: ["Gucci", "Prada", "Armani", "Versace"],
    openingHours: "09:00-17:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "B2B"],
  },
  {
    id: 11,
    name: "Warsaw Electronics Hub",
    country: "PL",
    countryName: "Poland",
    rating: 4.1,
    reviewCount: 11,
    yearsActive: 5,
    verified: false,
    description: "Central European electronics wholesaler based in Warsaw. Competitive pricing on smartphones, tablets, audio equipment, and computer peripherals. Fast shipping across EU with full warranty support.",
    phone: "+48221234567",
    email: "sales@warsawehub.pl",
    address: "Ul. Marszałkowska 56, Warsaw, Poland",
    zip: "00-545",
    city: "Warsaw",
    website: "www.warsawehub.pl",
    contactName: "Tomasz Kowalski",
    contactPosition: "CEO",
    categories: ["Consumer Electronic", "Mobile & Home Phones", "Computing"],
    products: "Smartphones, Tablets, Headphones, Speakers, Computer Parts",
    brands: ["Samsung", "Xiaomi", "JBL", "Logitech"],
    openingHours: "08:00-16:00",
    openDays: [false, true, true, true, true, true, false],
    focus: ["Wholesale", "Dropshipping"],
  },
  {
    id: 12,
    name: "ActiveLife Sports Distribution",
    country: "UK",
    countryName: "United Kingdom",
    rating: 4.5,
    reviewCount: 20,
    yearsActive: 6,
    verified: true,
    description: "Sports and fitness equipment wholesaler. Covering gym equipment, outdoor gear, cycling accessories, running shoes, and athletic wear. Authorised distributor for multiple premium sports brands.",
    phone: "+4401234567890",
    email: "trade@activelifesports.co.uk",
    address: "25 Olympic Way, Leeds, UK",
    zip: "LS1 4AP",
    city: "Leeds",
    website: "www.activelifesports.co.uk",
    contactName: "Emma Clarke",
    contactPosition: "Wholesale Manager",
    categories: ["Sports & Fitness", "Apparel & Clothing"],
    products: "Gym Equipment, Running Shoes, Cycling Gear, Athletic Wear, Fitness Accessories",
    brands: ["Nike", "Adidas", "Under Armour", "Puma", "New Balance"],
    openingHours: "07:00-16:00",
    openDays: [false, true, true, true, true, true, true],
    focus: ["Wholesale", "B2B", "Dropshipping"],
  },
];

const REVIEWS = [
  { id: 1, author: "John Smith", initial: "J", date: "2 days ago", rating: 5, text: "Excellent quality products and fast shipping. The supplier is very professional and responsive to inquiries." },
  { id: 2, author: "Maria Garcia", initial: "M", date: "1 week ago", rating: 4, text: "Great variety of products and competitive prices. Highly recommended for wholesale purchases." },
  { id: 3, author: "Alex Johnson", initial: "A", date: "2 weeks ago", rating: 5, text: "Good communication and reliable delivery. The products met my expectations." },
  { id: 4, author: "Emily Chen", initial: "E", date: "1 month ago", rating: 4, text: "Solid wholesale partner. Quick turnaround on orders and the quality is consistently good across all product lines." },
  { id: 5, author: "Robert Wilson", initial: "R", date: "2 months ago", rating: 3, text: "Products are decent but delivery took longer than expected. Communication could be improved." },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ═══════════════════════════════════════════════════
   1. SUPPLIER CARD — used in the suppliers listing page
   ═══════════════════════════════════════════════════ */
function SupplierCard({ supplier, isPremium = false, isLoggedIn = false, onContact, onReportInvalid, keyword }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(null);
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  const copyToClipboard = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={28} className="text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">Supplier hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={12} /> Unhide
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <a href={`/supplier/${supplier.id}`} className="group/name">
              <h3 className="text-lg font-bold text-slate-900 group-hover/name:text-orange-600 transition-colors">
                {supplier.name}
              </h3>
            </a>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <FlagImg code={supplier.country} size={18} />
                {supplier.countryName}
              </span>
              <span className="text-slate-300">&middot;</span>
              <StarRating rating={supplier.rating} size={13} showValue />
              <span className="text-slate-300">&middot;</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar size={12} />
                {supplier.yearsActive} yrs
              </span>
              <span className="text-slate-300">&middot;</span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                {supplier.openingHours}
              </span>
              {supplier.verified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">
                  <BadgeCheck size={10} />
                  Verified
                </span>
              )}
            </div>
          </div>
          {/* Hide + Favourite + Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1 transition-all ${faved || hidden ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
              <button onClick={() => setHidden(true)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <EyeOff size={14} className="text-slate-400" />
              </button>
              <button onClick={() => setFaved(!faved)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${faved ? "bg-red-500 shadow-sm hover:bg-red-600" : "bg-slate-100 hover:bg-slate-200"}`}>
                <Heart size={14} className={faved ? "fill-white text-white" : "text-slate-400"} />
              </button>
            </div>
            <button className="px-5 py-2.5 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
              <Phone size={15} />
              Call Now
            </button>
            <button onClick={() => onContact?.(supplier)} className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
              <MessageSquare size={15} />
              Send Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Category Tags */}
      <div className="px-5 pt-3.5 pb-0">
        <div className="flex flex-wrap gap-2">
          {supplier.categories.slice(0, 4).map((cat) => (
            <a key={cat} href="#" className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 4 && (
            <span className="px-3.5 py-1.5 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-full">
              +{supplier.categories.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 pt-4">
        {/* Description */}
        <div className="mb-5">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
          <div
            className="text-sm text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "5.6em" }}
          >
            <HighlightedText text={supplier.description} keyword={keyword} />
          </div>
        </div>

        {/* Contact Details — 4 column grid with overlay for free tier */}
        <div className="relative">
          <div className={`bg-slate-50 rounded-lg p-4 ${!isPremium ? "max-h-24 overflow-hidden" : ""}`}>
            {/* Icons row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/5 shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Phone <button onClick={() => onReportInvalid?.(supplier, "Phone")} className="text-[10px] font-normal text-red-400 hover:text-red-500 cursor-pointer ml-1">(invalid?)</button></p>
                </div>
                <div className="pl-9">
                  <BlurredText text={supplier.phone} isPremium={isPremium} className="text-xs text-slate-600" />
                  {isPremium && (
                    <button onClick={() => copyToClipboard(supplier.phone, "phone")} className="p-0.5 hover:bg-slate-100 rounded transition-colors ml-1 inline-flex">
                      {copied === "phone" ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} className="text-slate-400" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:w-1/5 shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Email Address <button onClick={() => onReportInvalid?.(supplier, "Email Address")} className="text-[10px] font-normal text-red-400 hover:text-red-500 cursor-pointer ml-1">(invalid?)</button></p>
                </div>
                <div className="pl-9">
                  <button
                    onClick={() => onContact?.(supplier)}
                    className="text-xs text-orange-600 font-medium hover:text-orange-700 transition-colors flex items-center gap-1"
                  >
                    <Mail size={12} /> Contact Supplier
                  </button>
                </div>
              </div>

              <div className="sm:w-2/5 shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <MapPin size={13} className="text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Address <button onClick={() => onReportInvalid?.(supplier, "Address")} className="text-[10px] font-normal text-red-400 hover:text-red-500 cursor-pointer ml-1">(invalid?)</button></p>
                </div>
                <div className="pl-9">
                  {isPremium ? (
                    <p className="text-xs text-slate-600 leading-relaxed">{supplier.address}, {supplier.zip}</p>
                  ) : (
                    <BlurredText text={supplier.address} isPremium={false} className="text-xs text-slate-600" />
                  )}
                </div>
              </div>

              <div className="sm:w-1/5 shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Globe size={13} className="text-slate-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Website <button onClick={() => onReportInvalid?.(supplier, "Website")} className="text-[10px] font-normal text-red-400 hover:text-red-500 cursor-pointer ml-1">(invalid?)</button></p>
                </div>
                <div className="pl-9">
                  {isPremium ? (
                    <a href="#" className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                      Visit Website
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <BlurredText text={supplier.website} isPremium={false} className="text-xs text-orange-600 font-medium" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Free/Guest Tier Overlay */}
          {!isPremium && (
            <div className="absolute inset-0 flex items-center justify-end bg-slate-50/80 backdrop-blur-[3px] rounded-lg pr-4">
              <div className="text-right">
                {isLoggedIn ? (
                  <>
                    <p className="text-xs font-medium text-slate-500 mb-1.5">Upgrade to see supplier details</p>
                    <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                      <Lock size={11} />
                      Upgrade Now
                    </a>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-medium text-slate-500 mb-1.5">Join to access supplier details</p>
                    <a href="/register" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                      <Lock size={11} />
                      Join Now!
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   1b. SUPPLIER GRID CARD — compact card for grid view
   ═══════════════════════════════════════════════════ */
function SupplierGridCard({ supplier, isPremium = false, isLoggedIn = false, onContact, keyword }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col group">
      {/* Hidden overlay */}
      {hidden && (
        <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-xl">
          <EyeOff size={24} className="text-slate-300" />
          <p className="text-xs font-semibold text-slate-500">Supplier hidden</p>
          <button onClick={() => setHidden(false)}
            className="px-3 py-1 text-[10px] font-bold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1">
            <Eye size={10} /> Unhide
          </button>
        </div>
      )}

      {/* Header band */}
      <div className="bg-gradient-to-b from-slate-50 to-white px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <a href={`/supplier/${supplier.id}`} className="group/name">
              <h3 className="text-sm font-bold text-slate-800 group-hover/name:text-orange-600 transition-colors line-clamp-2 leading-snug">
                {supplier.name}
              </h3>
            </a>
          </div>
          <div className={`flex items-center gap-1 shrink-0 transition-all ${faved || hidden ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={() => setHidden(true)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <EyeOff size={12} className="text-slate-400" />
            </button>
            <button onClick={() => setFaved(!faved)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${faved ? "bg-red-500 shadow-sm hover:bg-red-600" : "bg-slate-100 hover:bg-slate-200"}`}>
              <Heart size={12} className={faved ? "fill-white text-white" : "text-slate-400"} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <FlagImg code={supplier.country} size={14} />
            {supplier.countryName}
          </span>
          <span className="text-slate-300">&middot;</span>
          <StarRating rating={supplier.rating} size={10} showValue />
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar size={10} />
            {supplier.yearsActive} yrs
          </span>
          <span className="text-slate-300">&middot;</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} />
            {supplier.openingHours}
          </span>
          {supplier.verified && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">
              <BadgeCheck size={9} />
              Verified
            </span>
          )}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1">
            <Phone size={11} />
            Call Now
          </button>
          <button onClick={() => onContact?.(supplier)} className="flex-1 py-2 text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm">
            <MessageSquare size={11} />
            Send Enquiry
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.categories.slice(0, 2).map((cat) => (
            <a key={cat} href="#" className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 2 && (
            <span className="px-2 py-0.5 text-[10px] text-slate-400 bg-slate-50 border border-slate-200 rounded-full">
              +{supplier.categories.length - 2}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
          <div
            className="text-xs text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar"
            style={{ height: "10.5em" }}
          >
            <HighlightedText text={supplier.description} keyword={keyword} />
          </div>
        </div>

        {/* Focus tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {supplier.focus.map((f) => (
            <span key={f} className="px-2 py-0.5 text-[10px] font-semibold text-orange-600 bg-orange-50 rounded border border-orange-100">
              {f}
            </span>
          ))}
        </div>

        {/* Contact & Address footer */}
        <div className="relative mt-auto">
          <div className="flex gap-3 pl-2.5 pr-3 py-3 bg-slate-50 rounded-lg">
            {/* Address — bottom left */}
            <div className="flex-1 min-w-0 max-w-[45%]">
              <div className="flex items-start gap-1.5 text-xs">
                <MapPin size={11} className="text-slate-400 shrink-0 mt-0.5" />
                {isPremium ? (
                  <span className="text-slate-600 leading-relaxed">{supplier.address}</span>
                ) : (
                  <BlurredText text={supplier.address} isPremium={false} className="text-slate-500 leading-relaxed" />
                )}
              </div>
            </div>
            {/* Phone / Contact / Website — bottom right */}
            <div className="shrink-0 ml-auto space-y-1.5 flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs">
                <Phone size={10} className="text-slate-400" />
                <BlurredText text={supplier.phone} isPremium={isPremium} className="text-slate-600" />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Mail size={10} className="text-slate-400" />
                {isPremium ? (
                  <button onClick={() => onContact?.(supplier)} className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Contact Supplier
                  </button>
                ) : (
                  <BlurredText text={supplier.email} isPremium={false} className="text-slate-500" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Globe size={10} className="text-slate-400" />
                {isPremium ? (
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                    Visit Website <ExternalLink size={9} />
                  </a>
                ) : (
                  <BlurredText text={supplier.website} isPremium={false} className="text-slate-500" />
                )}
              </div>
            </div>
          </div>

          {/* Tier overlay for non-premium */}
          {!isPremium && (
            <div className="absolute inset-0 flex items-center justify-end bg-slate-50/80 backdrop-blur-[3px] rounded-lg">
              <div className="text-right pr-4">
                {isLoggedIn ? (
                  <>
                    <span className="text-xs text-slate-500 font-medium block mb-1.5">Upgrade to see supplier details</span>
                    <a href="/pricing" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                      <Lock size={11} />
                      Upgrade Now
                    </a>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-slate-500 font-medium block mb-1.5">Join to access supplier details</span>
                    <a href="/register" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                      <Lock size={11} />
                      Join Now!
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   2. SUPPLIER CONTACT PANEL — right sidebar on deal/supplier pages
   ═══════════════════════════════════════════════════ */
function SupplierContactPanel({ supplier, isPremium = false }) {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const currentDay = now.getDay();
  const isOpenToday = supplier.openDays[currentDay];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {supplier.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-md">
              <BadgeCheck size={10} />
              Verified Seller
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-900">{supplier.name}</h3>
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {supplier.categories.slice(0, 3).map((cat) => (
            <a key={cat} href="#" className="px-2 py-1 text-[10px] font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors">
              {cat}
            </a>
          ))}
          {supplier.categories.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-medium text-slate-400 bg-slate-50 rounded-md">
              +{supplier.categories.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Address Section */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Address</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Country:</span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <FlagImg code={supplier.country} size={14} /> {supplier.countryName}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">City:</span>
            <BlurredText text={supplier.city} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Postal Code:</span>
            <BlurredText text={supplier.zip} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Street:</span>
            <BlurredText text={supplier.address.split(",")[0]} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Website:</span>
            {isPremium ? (
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                {supplier.website} <ExternalLink size={10} />
              </a>
            ) : (
              <BlurredText text={supplier.website} isPremium={false} className="text-slate-700 font-medium" />
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Contact</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Contact Name:</span>
            <BlurredText text={supplier.contactName} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Position:</span>
            <BlurredText text={supplier.contactPosition} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Phone Number:</span>
            <BlurredText text={supplier.phone} isPremium={isPremium} className="text-slate-700 font-medium" />
          </div>
        </div>
        {!isPremium && (
          <button className="w-full mt-3 px-3 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5">
            <Eye size={12} />
            Show Details
          </button>
        )}
      </div>

      {/* Opening Hours */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Opening hours</h4>
        <p className="text-sm font-semibold text-slate-800 mb-3">{supplier.openingHours}</p>
        <div className="flex items-center gap-1.5">
          {DAY_LABELS.map((day, i) => (
            <div
              key={day}
              className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                i === currentDay
                  ? supplier.openDays[i]
                    ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-200"
                    : "bg-red-500 text-white shadow-sm ring-2 ring-red-200"
                  : supplier.openDays[i]
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2.5 flex items-center gap-1.5">
          <Clock size={11} />
          At wholesaler's it is currently <strong className="text-slate-700">{currentTime}</strong>
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="px-5 py-4 space-y-2">
        {isPremium ? (
          <>
            <button className="w-full py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5">
              <Send size={13} />
              Send Enquiry
            </button>
            <div className="flex gap-2">
              <a href={`/supplier/${supplier.id}`} className="flex-1 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-center">
                View Profile
              </a>
              <a href="#" className="flex-1 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
                View All Deals
              </a>
            </div>
          </>
        ) : (
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-sm"
          >
            <Lock size={14} />
            Join Now
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   3. SUPPLIER PROFILE PAGE — single-supplier.html
   ═══════════════════════════════════════════════════ */
function SupplierProfilePage({ supplier, isPremium = false }) {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="flex gap-6 items-start">
      {/* Main Content */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-b from-slate-50 to-white px-6 py-5 border-b border-slate-100">
            <h1 className="text-xl font-extrabold text-slate-800">{supplier.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {supplier.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                  <BadgeCheck size={10} />
                  Verified Seller
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <FlagImg code={supplier.country} size={16} /> {supplier.countryName}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={11} />
                {supplier.yearsActive} years
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {[
              { id: "about", label: "About" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-orange-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "about" && (
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-sm text-slate-600 leading-relaxed">{supplier.description}</p>
                </div>

                {/* Products Distributed */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Package size={13} className="text-orange-500" />
                    Products Distributed by This Supplier
                  </h3>
                  <p className="text-sm text-slate-600">{supplier.products}</p>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Tag size={13} className="text-orange-500" />
                    Brands Distributed by This Supplier
                  </h3>
                  {supplier.brands.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {supplier.brands.map((brand) => (
                        <span key={brand} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg">
                          {brand}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No brands found</p>
                  )}
                </div>

                {/* Focus */}
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-orange-500" />
                    Focus
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.focus.map((f) => (
                      <span key={f} className="px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-lg border border-orange-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                {/* Rating Summary */}
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-slate-900">{supplier.rating.toFixed(1)}</p>
                    <StarRating rating={supplier.rating} size={14} />
                    <p className="text-xs text-slate-400 mt-1">({supplier.reviewCount} reviews)</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = stars === 5 ? 15 : stars === 4 ? 6 : stars === 3 ? 2 : stars === 2 ? 1 : 0;
                      const pct = (count / supplier.reviewCount) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-500 w-3 text-right">{stars}</span>
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 w-5 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  {REVIEWS.map((review) => (
                    <div key={review.id} className="flex gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {review.initial}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-slate-800">{review.author}</span>
                          <span className="text-xs text-slate-400">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={10} />
                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar — Contact Panel */}
      <div className="w-80 shrink-0 hidden lg:block">
        <SupplierContactPanel supplier={supplier} isPremium={isPremium} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DEMO — Phase 4 Full Layout
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   SUPPLIER SEARCH BAR
   ═══════════════════════════════════════════════════ */
function SupplierSearchBar() {
  const [category, setCategory] = useState("All Categories");
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const categories = ["All Categories", "Baby Products", "Clothing", "Computing", "Consumer Electronic", "Health & Beauty", "Home & Garden", "Jewellery & Watches", "Mobile & Home Phones", "Office & Business", "Sports & Fitness", "Surplus & Stocklots", "Toys & Games"];

  return (
    <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div ref={catRef} className="relative shrink-0 border-r border-slate-200">
        <button onClick={() => setCatOpen(!catOpen)}
          className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          {category}
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
        </button>
        {catOpen && (
          <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-50 min-w-[200px]">
            {categories.map((c) => (
              <button key={c} onClick={() => { setCategory(c); setCatOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${category === c ? "bg-orange-50 text-orange-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Search suppliers by name, product, brand..."
        className="flex-1 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
      />
      <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shrink-0">
        <Search size={16} />
        <span className="text-sm font-semibold hidden sm:inline">Search</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — Suppliers Page
   ═══════════════════════════════════════════════════ */
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

function FollowButton() {
  const [faved, setFaved] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const handleFav = () => {
    if (faved) {
      setFaved(false);
      setSubscribed(false);
    } else {
      setFaved(true);
    }
  };

  const handleSub = () => {
    setSubscribed(!subscribed);
  };

  return (
    <div className="shrink-0 relative flex items-center">
      {/* Tooltip — appears to the left of the pill, arrow pointing right */}
      {hoveredBtn && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-52 bg-white text-slate-700 text-xs leading-relaxed rounded-lg px-3 py-2.5 shadow-lg border border-slate-200 z-20 pointer-events-none">
          {hoveredBtn === "fav"
            ? (faved ? "Remove from favourites" : "Save to your favourites for quick access later")
            : (subscribed ? "Unsubscribe from email alerts" : "Get email alerts when new suppliers match your filters")}
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-white" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-px w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-slate-200 -z-10" />
        </div>
      )}

      {/* Pill container */}
      <div className="inline-flex items-center border border-slate-200 rounded-full transition-all duration-300">
        {faved && (
          <>
            <button
              onClick={handleSub}
              onMouseEnter={() => setHoveredBtn("sub")}
              onMouseLeave={() => setHoveredBtn(null)}
              className={`w-9 h-9 flex items-center justify-center rounded-l-full transition-all ${
                subscribed
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "text-slate-400 hover:bg-slate-50 hover:text-orange-500"
              }`}
            >
              <Mail size={16} className={subscribed ? "text-white" : ""} />
            </button>
            <div className="w-px self-stretch my-1.5 bg-slate-200" />
          </>
        )}

        <button
          onClick={handleFav}
          onMouseEnter={() => setHoveredBtn("fav")}
          onMouseLeave={() => setHoveredBtn(null)}
          className={`w-9 h-9 flex items-center justify-center transition-all ${
            faved
              ? "bg-red-500 hover:bg-red-600 rounded-r-full"
              : "text-slate-400 hover:bg-slate-50 hover:text-red-500 rounded-full"
          }`}
        >
          <Heart size={16} className={faved ? "fill-white text-white" : ""} />
        </button>
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
   RELATED SEARCHES
   ═══════════════════════════════════════════════════ */
const SUPPLIER_RELATED_SEARCHES = [
  "Wholesale Clothing Suppliers", "Dropship Electronics", "Sportswear Wholesalers",
  "UK Wholesale Distributors", "Footwear Suppliers", "Bulk Beauty Products",
  "Wholesale Toys & Games", "Phone Accessories Wholesale", "Fashion Accessories Suppliers",
  "Home & Garden Wholesalers", "Wholesale Pet Supplies", "Jewellery Wholesalers",
];

function RelatedSearches() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mt-8">
      <h3 className="text-lg font-extrabold text-slate-900 text-center mb-4">Related Searches</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {SUPPLIER_RELATED_SEARCHES.map((term) => (
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
   CTA BANNER
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
          <path d="M48 52l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M42 58l6-6" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-18 h-18" style={{width: "4.5rem", height: "4.5rem"}}>
          <ellipse cx="50" cy="52" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M16 35l34-17 34 17v30L50 82 16 65V35z" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <path d="M16 35l34 17 34-17" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M50 52v30" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M33 27l34 17" stroke="#1E293B" strokeWidth="1.5" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* Right illustrations */}
      <div className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-8">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
          <ellipse cx="42" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <circle cx="42" cy="42" r="20" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M56 56l22 22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 36a12 12 0 0 1 12-9" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
          <ellipse cx="55" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
          <path d="M18 78h64" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 78V22" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 64l14-12 12 6 14-20 14-12" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="26" r="4" stroke="#1E293B" strokeWidth="2" fill="none" />
          <circle cx="80" cy="26" r="1.5" fill="#1E293B" />
        </svg>
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

export default function Phase4Suppliers() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [listingMode, setListingMode] = useState("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [searchMode, setSearchMode] = useState("any");
  const [inlineSearch, setInlineSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [filters, setFilters] = useState({
    rating: null,
    category: null,
    subcategory: null,
    priceMin: "",
    priceMax: "",
    countries: [],
    dropshipping: false,
    grades: [],
    businessTypes: [],
    keyword: "",
  });
  const [contactSupplier, setContactSupplier] = useState(null);
  const [reportInvalid, setReportInvalid] = useState(null); // { supplier, field }

  // Listen for demo auth
  useEffect(() => {
    const handler = (e) => {
      setIsLoggedIn(e.detail.loggedIn);
      setIsPremium(e.detail.premium || false);
    };
    window.addEventListener("demo-auth", handler);
    return () => window.removeEventListener("demo-auth", handler);
  }, []);

  // Apply filters
  const filteredSuppliers = SUPPLIERS.filter((s) => {
    if (filters.rating && s.rating < filters.rating) return false;
    if (filters.category && !s.categories.some((c) => c.toLowerCase().replace(/[^a-z]/g, "").includes(filters.category.replace(/[^a-z]/g, "")))) return false;
    if (filters.countries.length > 0 && !filters.countries.includes(s.country)) return false;
    if (filters.keyword && !s.name.toLowerCase().includes(filters.keyword.toLowerCase()) && !s.description.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    if (filters.dropshipping && !s.focus.some((f) => f.toLowerCase().includes("drop"))) return false;
    return true;
  });

  // Paginate
  const totalSuppliers = filteredSuppliers.length;
  const totalPages = Math.ceil(totalSuppliers / perPage);
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', 'Outfit', sans-serif" }}>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Suppliers" },
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
                  hidePrice
                  hideDropshipping
                  hideGrade
                  showBusinessType
                />

                {/* Join Today Promo Panel */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-b from-orange-50 to-orange-100/60 flex items-center justify-center pt-4 pb-0">
                    <img
                      src="https://wholesaledeals.vercel.app/assets/images/v3/deals/deals-vector.svg"
                      alt="Join Today"
                      className="w-48 h-auto"
                    />
                  </div>
                  <div className="px-5 pb-5 pt-3 bg-gradient-to-b from-orange-50/40 to-white">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-3 text-center">Join Today</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Unlock tens of thousands of verified liquidation, wholesale, and dropshipping suppliers from across the EU, UK, North America, and beyond.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      Source fast-selling products at profit margins of 45% to 95%, all backed by our custom sourcing guarantee.
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
            {/* Filter toggle button */}
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

          {/* Mobile filter overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                <FilterSidebar filters={filters} setFilters={setFilters} isOpen={true} onClose={() => setMobileFilterOpen(false)} hidePrice hideDropshipping hideGrade showBusinessType />
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title + Description + Follow */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Suppliers <span className="text-base font-semibold text-slate-400">({SUPPLIERS.length.toLocaleString()} suppliers)</span>
                </h1>
                <h2 className="text-[15px] font-normal text-slate-500 mt-1 leading-relaxed">
                  Browse our directory of verified wholesale suppliers, liquidators and dropshippers. Find trusted UK and international trade sources for brand-name and own-label products at competitive wholesale prices.{" "}
                  {descExpanded ? (
                    <>
                      Our comprehensive supplier database is updated daily with fresh listings from verified businesses across the UK, Europe, and beyond. Whether you&apos;re looking for consumer electronics, health &amp; beauty products, clothing, home goods, or specialty items, our platform connects you with reliable wholesale sources to grow your reselling business. Each supplier is verified and rated by our community of buyers.{" "}
                      <button onClick={() => setDescExpanded(false)} className="text-orange-500 hover:text-orange-600 font-medium">Show Less</button>
                    </>
                  ) : (
                    <button onClick={() => setDescExpanded(true)} className="text-orange-500 hover:text-orange-600 font-medium">Show More</button>
                  )}
                </h2>
              </div>
              <FollowButton />
            </div>

            {/* Search + View Toggle Row */}
            <div className="flex items-center gap-2.5 flex-wrap mb-3">
              {/* Search Mode Selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                {["Any", "All", "Exact"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSearchMode(mode.toLowerCase())}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      searchMode === mode.toLowerCase()
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Inline Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={inlineSearch}
                  onChange={(e) => setInlineSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inlineSearch.trim()) {
                      setFilters((p) => ({ ...p, keyword: inlineSearch.trim() }));
                      setPage(1);
                    }
                  }}
                  placeholder="Search suppliers..."
                  className="w-full pl-9 pr-9 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
                <button
                  onClick={() => {
                    if (inlineSearch.trim()) {
                      setFilters((p) => ({ ...p, keyword: inlineSearch.trim() }));
                      setPage(1);
                    }
                  }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
                  aria-label="Search"
                >
                  <Search size={14} />
                </button>
              </div>

              {/* Grid / List Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setListingMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    listingMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button
                  onClick={() => setListingMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    listingMode === "list"
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List size={14} /> List
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilterChips filters={filters} setFilters={setFilters} searchMode={searchMode} />

            {/* ── Grid View ── */}
            {listingMode === "grid" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                {paginatedSuppliers.map((s) => (
                  <SupplierGridCard key={s.id} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} keyword={filters.keyword} />
                ))}
              </div>
            )}

            {/* ── List View ── */}
            {listingMode === "list" && (
              <div className="space-y-4 mt-4">
                {paginatedSuppliers.map((s) => (
                  <SupplierCard key={s.id} supplier={s} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={setContactSupplier} onReportInvalid={(sup, field) => setReportInvalid({ supplier: sup, field })} keyword={filters.keyword} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {paginatedSuppliers.length === 0 && (
              <div className="text-center py-16">
                <Search size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No suppliers found</h3>
                <p className="text-sm text-slate-400 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => { setFilters({ rating: null, category: null, subcategory: null, priceMin: "", priceMax: "", countries: [], dropshipping: false, grades: [], businessTypes: [], keyword: "" }); setPage(1); }}
                  className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            <Pagination
              total={totalSuppliers}
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

      <style>{`
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(203,213,225,0.5) transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203,213,225,0.6); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.7); }
      `}</style>

      {/* Contact Supplier Modal */}
      {contactSupplier && (
        <ContactSupplierModal supplier={contactSupplier} onClose={() => setContactSupplier(null)} />
      )}

      {/* Report Invalid Details Modal */}
      {reportInvalid && (
        <ReportInvalidModal supplier={reportInvalid.supplier} field={reportInvalid.field} onClose={() => setReportInvalid(null)} />
      )}
    </div>
  );
}
