"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
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
  Monitor,
  Gift,
  HelpCircle,
  Truck,
  Lock,
  X,
  Baby,
  Dumbbell,
  Smartphone,
  EyeOff,
  Briefcase,
  Gavel,
  Boxes,
  Tv,
  MessageSquare,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  ShoppingCart,
  Store,
} from "lucide-react";

/* ═══════ MOCK DATA ═══════ */
const CATEGORIES = [
  { name: "Baby Products", icon: Baby, href: "/categories/baby-products", count: 44 },
  { name: "Clothing", icon: Shirt, href: "/categories/clothing", count: 188 },
  { name: "Computing", icon: Monitor, href: "/categories/computing", count: 92 },
  { name: "Consumer Electronic", icon: Tv, href: "/categories/consumer-electronic", count: 48 },
  { name: "Health & Beauty", icon: Sparkles, href: "/categories/health-beauty", count: 216 },
  { name: "Home & Garden", icon: Flower2, href: "/categories/home-garden", count: 90 },
  { name: "Jewellery & Watches", icon: Watch, href: "/categories/jewellery-watches", count: 66 },
  { name: "Leisure & Entertainment", icon: Gamepad2, href: "/categories/leisure-entertainment", count: 39 },
  { name: "Mobile & Home Phones", icon: Smartphone, href: "/categories/mobile-phones", count: 139 },
  { name: "Office & Business", icon: Briefcase, href: "/categories/office-business", count: 45 },
  { name: "Police Auctions & Auction Houses", icon: Gavel, href: "/categories/police-auctions", count: 15 },
  { name: "Sports & Fitness", icon: Dumbbell, href: "/categories/sports-fitness", count: 44 },
  { name: "Surplus & Stocklots", icon: Boxes, href: "/categories/surplus-stocklots", count: 63 },
  { name: "Toys & Games", icon: Gamepad2, href: "/categories/toys-games", count: 50 },
];

const SIMPLE_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: "18.95", date: "19/09/2023", firstOrderPromo: "-15% ON YOUR FIRST ORDER", negotiable: true, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: "18.95", date: "19/09/2023", discount: "15%", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: "18.95", date: "19/09/2023", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: "24.50", date: "20/09/2023", negotiable: true, img: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=300&h=300&fit=crop" },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: "12.80", date: "21/09/2023", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop" },
  { title: "Samsung Galaxy Buds FE Wireless Earbuds", price: "32.99", date: "22/09/2023", img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop" },
  { title: "JBL Tune 510BT Wireless On-Ear Headphones Black", price: "15.50", date: "23/09/2023", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { title: "Braun Series 3 ProSkin 3010s Electric Shaver", price: "22.75", date: "23/09/2023", img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop" },
  { title: "Dyson V8 Animal Cordless Vacuum Cleaner Refurb", price: "89.99", date: "24/09/2023", img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop" },
  { title: "Nike Air Max 90 Essential White/Black Mens", price: "42.50", date: "24/09/2023", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" },
  { title: "Philips Sonicare ProtectiveClean 4100 Toothbrush", price: "19.95", date: "25/09/2023", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop" },
  { title: "Canon PIXMA TS3350 All-in-One Inkjet Printer", price: "27.80", date: "25/09/2023", img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop" },
  { title: "Logitech MX Master 3S Wireless Mouse Graphite", price: "38.99", date: "26/09/2023", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop" },
  { title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L", price: "34.50", date: "26/09/2023", img: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=300&h=300&fit=crop" },
  { title: "Apple AirPods 2nd Gen with Charging Case Refurb", price: "54.99", date: "27/09/2023", img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop" },
  { title: "Tefal ActiFry Genius XL 2in1 Air Fryer 1.7kg", price: "62.50", date: "27/09/2023", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop" },
];

const DETAILED_DEALS = [
  { title: "New Type Smartphone Sony Xperia L1 G3311 5.5' 2/16GB Black", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, tags: ["New"], img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop" },
  { title: "Small Nepalese Moon Bowl - (approx 550g) - 13cm", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, tags: ["New", "Dropship"], img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=300&fit=crop" },
  { title: "Lloytron Active Indoor Loop Tv Antenna 50db Black", price: "18.95", rrp: "59.99", markup: "201.8%", profit: "16.95", sales: 35, tags: ["Dropship"], discount: "10%", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop" },
  { title: "Oral-B Vitality Pro D103 Box Violet Electric Toothbrush", price: "24.50", rrp: "79.99", markup: "226.5%", profit: "22.30", sales: 48, tags: ["New"], firstOrderPromo: "-15% ON YOUR FIRST ORDER", img: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=400&h=300&fit=crop" },
  { title: "Adidas Feel The Chill Ice Dive 3pcs Gift Set", price: "12.80", rrp: "39.99", markup: "212.4%", profit: "11.20", sales: 62, tags: ["New", "Dropship"], img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop" },
  { title: "Samsung Galaxy Buds FE Wireless Earbuds", price: "32.99", rrp: "99.99", markup: "203.1%", profit: "28.50", sales: 41, tags: ["New"], img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop" },
  { title: "JBL Tune 510BT Wireless On-Ear Headphones", price: "15.50", rrp: "49.99", markup: "222.5%", profit: "13.20", sales: 57, tags: ["Dropship"], img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
  { title: "Braun Series 3 ProSkin 3010s Electric Shaver", price: "22.75", rrp: "69.99", markup: "207.6%", profit: "19.80", sales: 29, tags: ["New"], img: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop" },
  { title: "Philips Sonicare ProtectiveClean 4100 Toothbrush", price: "19.95", rrp: "59.99", markup: "200.8%", profit: "16.50", sales: 44, tags: ["New", "Dropship"], img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop" },
  { title: "Nike Air Max 90 Essential White/Black Mens", price: "42.50", rrp: "129.99", markup: "205.9%", profit: "36.80", sales: 38, tags: ["New"], discount: "10%", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { title: "Logitech MX Master 3S Wireless Mouse", price: "38.99", rrp: "109.99", markup: "182.1%", profit: "32.40", sales: 53, tags: ["Dropship"], img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop" },
  { title: "Canon PIXMA TS3350 All-in-One Inkjet Printer", price: "27.80", rrp: "79.99", markup: "187.7%", profit: "22.10", sales: 31, tags: ["New"], img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop" },
];

function scrambleText(text) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return (text || "").replace(/[A-Za-z0-9]/g, (ch, i) => chars[(ch.charCodeAt(0) + i * 7) % chars.length]);
}

// Flat flag images via flagcdn.com
function FlagImg({ code, size = 20 }) {
  const map = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", AU: "au", SE: "se", CA: "ca", JP: "jp", KR: "kr", CN: "cn", IN: "in", TR: "tr", BR: "br", MX: "mx", TH: "th" };
  const iso = map[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}

/* ═══════════════════════════════════════
   SHARED — Contact Supplier Modal
   ═══════════════════════════════════════ */
function ContactSupplierModal({ item, onClose, contactForm, setContactForm, contactSent, onSend }) {
  if (!item) return null;
  const label = item.title || item.name || "Supplier";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Contact Supplier</h3>
              <p className="text-blue-100 text-xs mt-0.5 line-clamp-1">{label}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="p-6">
          {contactSent ? (
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
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Enquiry about bulk pricing"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
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
                  onClick={onSend}
                  disabled={!contactForm.subject.trim() || !contactForm.message.trim()}
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

const SUPPLIERS = [
  { name: "Trainers and Sportswear Supplier", countryCode: "UK", countryName: "United Kingdom", rating: 5.0, yearsActive: 8, openingHours: "08:00-16:00", verified: true, categories: ["Trainers & Sportswear Supplier", "Shoes & Boots Supplier", "Fashion Accessories Supplier", "Jeans & Casual Supplier"], desc: "We are a wholesaler of sportswear clothing and shoes. We offer high quality of adidas originals men's menu sports footwear, Nike air max and other trainer brands at competitive wholesale prices. Our range includes the latest seasonal collections, classic retro styles, and limited edition releases sourced directly from authorised distributors. We supply independent retailers, online stores, and market traders across the UK and Europe with minimum order quantities starting from just 10 pairs.", phone: "+4402081234567", email: "contact@trainers-wholesale.co.uk", website: "www.trainers-wholesale.co.uk", address: "9 Fisher's Lane, Chiswick London United Kingdom" },
  { name: "Basketball Sport Supplier", countryCode: "UK", countryName: "United Kingdom", rating: 5.0, yearsActive: 6, openingHours: "09:00-17:00", verified: true, categories: ["Trainers & Sportswear Supplier", "Shoes & Boots Supplier", "Fashion Accessories Supplier", "Jeans & Casual Supplier"], desc: "Premium sports equipment and apparel supplier specializing in basketball gear, training equipment, team uniforms and branded athletic footwear for retailers across the UK. We carry a comprehensive stock of NBA licensed merchandise, professional-grade basketballs, hoops, training aids, and performance apparel from leading brands including Nike, Under Armour, and Spalding. Our dedicated wholesale team provides personalised support for bulk orders and custom team kits.", phone: "+4402089876543", email: "info@basketball-sport.co.uk", website: "www.basketball-sport.co.uk", address: "Unit 12, Olympic Business Park, London United Kingdom" },
  { name: "Electronics Direct Wholesale", countryCode: "DE", countryName: "Germany", rating: 4.8, yearsActive: 12, openingHours: "08:00-16:00", verified: true, categories: ["Consumer Electronics Supplier", "Computing Supplier", "Smart Home Supplier"], desc: "Leading European electronics wholesaler offering consumer electronics, accessories, and smart home products at competitive prices to retailers and resellers. Our catalogue spans over 15,000 products including smartphones, tablets, laptops, audio equipment, smart home devices, and wearable technology. We maintain partnerships with major brands and provide full manufacturer warranties on all items. Fast dispatch from our central European warehouse with next-day delivery available across the EU.", phone: "+4930123456", email: "sales@electronics-direct.de", website: "www.electronics-direct.de", address: "Berliner Str. 45, Berlin Germany" },
  { name: "Home & Garden Essentials", countryCode: "NL", countryName: "Netherlands", rating: 4.7, yearsActive: 5, openingHours: "08:00-18:00", verified: false, categories: ["Home & Garden Supplier", "Furniture Supplier", "Garden Tools Supplier"], desc: "Quality home supplies, garden tools, and decor items from trusted European manufacturers. Low MOQ available for new retailers. Our product range includes indoor and outdoor furniture, seasonal garden equipment, lighting solutions, kitchenware, bathroom accessories, and decorative home accents. We work directly with factories across the Netherlands, Belgium, and Germany to offer the best wholesale prices with fast European shipping. Whether you run a brick-and-mortar home store or an online marketplace, we provide dropshipping and bulk order options to suit your business model.", phone: "+3120654321", email: "info@home-garden.nl", website: "www.home-garden.nl", address: "Industrieweg 88, Amsterdam Netherlands" },
  { name: "Beauty Box Wholesale", countryCode: "UK", countryName: "United Kingdom", rating: 4.9, yearsActive: 7, openingHours: "09:00-17:30", verified: true, categories: ["Health & Beauty Supplier", "Cosmetics Supplier", "Skincare Supplier"], desc: "Specialist beauty and cosmetics wholesaler stocking leading brands including L'Oréal, Maybelline, NYX, Revolution, and The Ordinary. Perfect for online and high street retailers looking for premium products at wholesale margins. We offer a curated selection of trending skincare, makeup, haircare, and fragrance lines with weekly new arrivals. Our beauty experts can help you build the perfect product mix for your target market, and we provide full product imagery and descriptions for your online listings.", phone: "+4402071234567", email: "wholesale@beautybox.co.uk", website: "www.beautybox.co.uk", address: "25 High Street, Camden London United Kingdom" },
  { name: "Global Toy Distributors", countryCode: "US", countryName: "United States", rating: 4.6, yearsActive: 10, openingHours: "08:30-16:30", verified: true, categories: ["Toys & Games Supplier", "Novelty Items Supplier", "Children's Products Supplier"], desc: "Large range of toys, games and novelty items from top brands. Competitive pricing with fast worldwide shipping available. We carry over 5,000 product lines including action figures, board games, educational toys, outdoor play equipment, arts and crafts supplies, and licensed character merchandise from Disney, Marvel, Pokémon, and more. Our warehouse in New Jersey ships worldwide with express options for time-sensitive orders. Volume discounts start from just 50 units and we offer exclusive pre-order access to upcoming toy releases for registered wholesale partners.", phone: "+12125551234", email: "orders@globaltoys.com", website: "www.globaltoys.com", address: "350 Fifth Avenue, New York USA" },
  { name: "Nordic Fashion Outlet", countryCode: "SE", countryName: "Sweden", rating: 4.8, yearsActive: 4, openingHours: "09:00-17:00", verified: true, categories: ["Clothing Supplier", "Footwear Supplier", "Accessories Supplier"], desc: "Scandinavian fashion wholesaler offering premium clothing, footwear and accessories at below-market prices for fashion retailers. Our collections feature clean Nordic design aesthetics with sustainable materials and ethical manufacturing. We stock both established Scandinavian labels and emerging designers, giving your store a distinctive edge. Seasonal lookbooks and merchandising support included with all wholesale accounts, plus dropshipping available for qualifying retailers.", phone: "+46812345678", email: "sales@nordicfashion.se", website: "www.nordicfashion.se", address: "Storgatan 15, Stockholm Sweden" },
  { name: "AutoParts Direct Europe", countryCode: "DE", countryName: "Germany", rating: 4.5, yearsActive: 15, openingHours: "07:30-16:00", verified: true, categories: ["Automotive Parts Supplier", "Vehicle Accessories Supplier", "OEM Parts Supplier"], desc: "Automotive parts and accessories wholesaler with over 50,000 SKUs. OEM and aftermarket parts available for European vehicles. We specialise in brake systems, suspension components, engine parts, lighting, exhaust systems, and interior accessories for all major European car brands including BMW, Mercedes-Benz, Volkswagen, Audi, and Porsche. Our technical support team can help you identify the correct parts using VIN lookup. We offer same-day dispatch on in-stock items and maintain a 98.5% order accuracy rate across our fully automated distribution centre in Munich.", phone: "+4930987654", email: "parts@autoparts-direct.de", website: "www.autoparts-direct.de", address: "Maximilianstr. 12, Munich Germany" },
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
  { text: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", author: "Rena Harvey", location: "United Kingdom" },
  { text: "Very pleased with the service, suppliers and dropshippers. I have just upgraded to combo for the new month. Thank you.", author: "Thu Huong Do", location: "Sweden" },
  { text: "Absolutely fantastic, it's a great service and am really glad I found it. I fully recommend it and use it regularly.", author: "Alex Elliott", location: "United Kingdom" },
  { text: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", author: "James Richardson", location: "United States" },
  { text: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", author: "Maria Gonzalez", location: "Spain" },
  { text: "As a newcomer to reselling, I was overwhelmed. The platform made it so easy to find verified suppliers and profitable deals from day one.", author: "Oliver Schmitt", location: "Germany" },
  { text: "The deal tracker alone is worth the subscription. I get notified the moment a new deal matches my criteria. It's like having a personal buyer.", author: "Sarah Jenkins", location: "Canada" },
  { text: "I run three Amazon stores and WholesaleUp is my go-to source for all of them. The variety of suppliers and product categories is unmatched.", author: "David Chen", location: "Australia" },
  { text: "Customer support is top notch. Had an issue with a supplier and the team stepped in and resolved it within a day. Very impressed.", author: "Fatima Al-Hassan", location: "United Arab Emirates" },
  { text: "Upgraded to Premium last month and it's already paid for itself ten times over. The exclusive deals section is a goldmine.", author: "Patrick O'Brien", location: "Ireland" },
  { text: "The profit calculators and market analysis tools help me make smarter buying decisions. My return rate has dropped significantly.", author: "Yuki Tanaka", location: "Japan" },
  { text: "What sets WholesaleUp apart is the quality of suppliers. Every one I've contacted has been professional and delivered on time.", author: "Lisa Bergström", location: "Sweden" },
];

const FAQS = [
  { q: "What do I get when I join WholesaleDeals buyer?", a: "You get immediate access to our platform with over 54,000 verified suppliers, all the latest wholesale deals with profit calculations, and the Deal Tracker tool. You'll also receive our weekly deals newsletter and can request personalized sourcing assistance from our team." },
  { q: "Are the suppliers really verified?", a: "Yes, all suppliers on our platform go through a rigorous verification process to ensure they are legitimate wholesale businesses. We verify their business credentials, check their reputation, and ensure they meet our quality standards." },
  { q: "Is WholesaleDeals good for beginners?", a: "Absolutely! WholesaleDeals is designed to help both beginners and experienced resellers. We provide educational resources, profit calculators, and personalized support to help you get started and grow your business successfully." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. Your access will continue until the end of your current billing period. We also offer a money-back guarantee if you're not satisfied within the first 14 days." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 100% money-back guarantee. If we can't find the suppliers or deals you're looking for, we'll refund your subscription in full." },
  { q: "How often are new deals added?", a: "We add new wholesale and dropship deals daily. Our team constantly sources new opportunities from verified suppliers across the UK, EU, and North America." },
];

/* ═══════ SHARED HELPERS ═══════ */
function StarRating({ rating, size = 12, showValue = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      {showValue && <span className="text-xs text-slate-500 ml-1">{rating}</span>}
    </div>
  );
}

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
          Become a rockstar reseller in days. The Web&apos;s Largest database of verified wholesale suppliers, liquidators and dropshippers from the UK, EU and North America
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-2xl shadow-black/20 p-1.5">
            <div className="flex items-center gap-1.5">
              {/* Type Selector */}
              <div className="relative">
                <button onClick={() => setSearchOpen(!searchOpen)} className="flex items-center gap-1.5 px-3 py-3 rounded-lg bg-orange-50 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors whitespace-nowrap">
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
              <input type="text" placeholder="What are you looking for?" className="flex-1 px-3 py-3 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400 min-w-0" />

              {/* Search Button — plain orange to match header */}
              <button className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0">
                <Search size={16} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Popular Search:</span>
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
            <div key={i} className="w-[180px] sm:w-[200px] shrink-0 snap-start bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer shadow-sm">
              <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                {deal.img ? (
                  <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <Package size={40} className="text-slate-200 group-hover:text-orange-200 transition-colors" />
                )}
                {/* Top-left badges */}
                {deal.negotiable && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 text-[10px] font-bold bg-orange-500 text-white rounded-md shadow-sm">
                      NEGOTIABLE
                    </span>
                  </div>
                )}
                {/* Markup badge (top-right, orange) */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
                  <TrendingUp size={10} /> 201.8%
                </div>
                {/* Price badge (bottom-left, on image) */}
                <div className="absolute bottom-2 left-2 flex flex-col items-start">
                  {deal.discount && (
                    <div className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-t-md">{deal.discount} DISCOUNT</div>
                  )}
                  <div className={`${deal.discount ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
                    <span className={`text-base font-extrabold ${deal.discount ? "text-white" : "text-orange-600"}`}>£{deal.price}</span>
                    <span className="text-[9px] text-slate-400 ml-1">ex.VAT</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-slate-400 mb-1">Deal First Featured On: {deal.date}</p>
                {deal.firstOrderPromo && (
                  <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderPromo}</span></div>
                )}
                <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">{deal.title}</h3>
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
  "Baby Products": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="46" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M30 55C30 40 38 30 50 30C62 30 70 40 70 55" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M25 55H75C75 68 64 78 50 78C36 78 25 68 25 55Z" stroke="#1E293B" strokeWidth="2" fill="none" />
      <circle cx="40" cy="50" r="2.5" fill="#1E293B" />
      <circle cx="60" cy="50" r="2.5" fill="#1E293B" />
      <path d="M45 58C45 58 48 62 55 58" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M30 35C28 30 30 24 36 26" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M70 35C72 30 70 24 64 26" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  "Clothing": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="58" cy="40" rx="30" ry="28" fill="#FED7AA" opacity="0.5" />
      <path d="M35 25L42 20H58L65 25L72 35L65 38L60 30V75H40V30L35 38L28 35L35 25Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M42 20C42 20 45 28 50 28C55 28 58 20 58 20" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="40" y1="45" x2="60" y2="45" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="55" r="2" fill="#1E293B" />
      <circle cx="50" cy="63" r="2" fill="#1E293B" />
    </svg>
  ),
  "Computing": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="55" cy="42" rx="28" ry="24" fill="#FED7AA" opacity="0.5" />
      <rect x="22" y="28" width="56" height="36" rx="3" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="26" y="32" width="48" height="26" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M38 68H62" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M44 64V68" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 64V68" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M35 42L42 48L55 38" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  "Consumer Electronic": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="46" rx="30" ry="26" fill="#FED7AA" opacity="0.5" />
      <rect x="18" y="28" width="64" height="38" rx="3" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="22" y="32" width="56" height="30" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M40 70H60" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 66V70" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 47L40 42V52Z" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M48 44H65" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 50H60" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Health & Beauty": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="58" cy="42" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M40 30C40 30 30 35 30 50C30 65 42 75 50 75C58 75 70 65 70 50C70 35 60 30 60 30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M40 30C40 30 44 22 50 22C56 22 60 30 60 30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M38 48C42 44 48 42 55 42" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M50 22V16" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="43" cy="55" r="3" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="55" cy="58" r="2" stroke="#1E293B" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  "Home & Garden": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="55" cy="45" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M20 50L50 25L80 50" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="30" y="50" width="40" height="28" rx="1" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="43" y="60" width="14" height="18" rx="1" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="34" y="55" width="8" height="8" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M46 78V68" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
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
  "Leisure & Entertainment": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="48" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <circle cx="38" cy="65" r="8" stroke="#1E293B" strokeWidth="2" fill="none" />
      <circle cx="62" cy="60" r="8" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M46 65V28L70 22V60" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M46 38L70 32" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Mobile & Home Phones": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="55" cy="48" rx="24" ry="28" fill="#FED7AA" opacity="0.5" />
      <rect x="32" y="20" width="36" height="60" rx="5" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="36" y="28" width="28" height="40" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="74" r="2.5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M44 24H56" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Office & Business": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="52" cy="46" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <rect x="28" y="35" width="44" height="32" rx="3" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M40 35V28C40 25 43 22 47 22H53C57 22 60 25 60 28V35" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M28 48H72" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="44" y="44" width="12" height="8" rx="1.5" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M28 72H72" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "Police Auctions & Auction Houses": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="48" cy="48" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M55 22L72 42L65 47L48 27Z" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M48 27L38 40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="50" cy="55" rx="22" ry="5" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="30" y="60" width="40" height="8" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="26" y="68" width="48" height="6" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
    </svg>
  ),
  "Sports & Fitness": (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="50" cy="50" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <path d="M22 50H78" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="38" width="8" height="24" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="64" y="38" width="8" height="24" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="20" y="42" width="6" height="16" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
      <rect x="74" y="42" width="6" height="16" rx="2" stroke="#1E293B" strokeWidth="2" fill="none" />
    </svg>
  ),
  "Surplus & Stocklots": (
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
      <ellipse cx="55" cy="45" rx="28" ry="26" fill="#FED7AA" opacity="0.5" />
      <circle cx="50" cy="45" r="22" stroke="#1E293B" strokeWidth="2" fill="none" />
      <path d="M38 40L46 40L42 34Z" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <rect x="54" y="36" width="8" height="8" rx="1" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <circle cx="42" cy="54" r="4" stroke="#1E293B" strokeWidth="1.5" fill="none" />
      <path d="M55 54L62 54M58.5 50.5V57.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
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
            className="w-[160px] sm:w-[175px] shrink-0 snap-start group cursor-pointer">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
              <div className="w-full h-[120px] p-3">
                {CATEGORY_ILLUSTRATIONS[cat.name] || (
                  <div className="w-full h-full flex items-center justify-center">
                    <cat.icon size={40} strokeWidth={1.2} className="text-slate-800" />
                  </div>
                )}
              </div>
              <div className="px-3 pb-3">
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">{cat.name}</h3>
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">#1 Platform On the Market</span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-2 leading-snug">
              Why Hundreds of Thousands of Resellers Trust Us
            </h2>
            <p className="text-slate-400 mt-3 text-sm leading-relaxed">
              We're more than just a platform — we're a growth partner. From day-one beginners to seasoned resellers, we provide the tools, insights, and supplier access that empower you to scale faster & smarter.
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
              <div key={item.title} className="flex items-start gap-3.5 bg-white/5 rounded-xl p-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
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
function HotOfferCard({ deal, isPremium, isLoggedIn, onContact }) {
  const [faved, setFaved] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className="w-[240px] sm:w-[260px] lg:w-[280px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col relative">
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
          {deal.img ? (
            <img src={deal.img} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <Package size={48} className="text-slate-200 group-hover:text-orange-200 transition-colors" />
          )}
          {/* Markup badge (top-right, orange) */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md flex items-center gap-0.5">
            <TrendingUp size={10} /> {deal.markup}
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
            {deal.discount && (
              <div className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-t-md">{deal.discount} DISCOUNT</div>
            )}
            <div className={`${deal.discount ? "bg-red-600 rounded-b-lg rounded-tr-lg" : "bg-white/95 backdrop-blur-sm rounded-lg"} px-2.5 py-1 shadow-sm`}>
              <span className={`text-base font-extrabold ${deal.discount ? "text-white" : "text-orange-600"}`}>£{deal.price}</span>
              <span className="text-[9px] text-slate-400 ml-1">ex.VAT</span>
            </div>
          </div>
          {/* Hide + Favourite buttons (bottom-right, hover only) */}
          <div className={`absolute bottom-2 right-2 flex flex-col gap-1.5 transition-all ${faved ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHidden(true); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <EyeOff size={12} className="text-slate-400" />
            </button>
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFaved(!faved); }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all">
              <Heart size={12} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>
        <div className="p-3.5 pb-0">
          {deal.firstOrderPromo && (
            <div className="mb-1.5"><span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-md">{deal.firstOrderPromo}</span></div>
          )}
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug mb-2">{deal.title}</h3>
          {/* RRP + Profit rows — V3 style */}
          <div className="border-t border-slate-100">
            {/* Column headers */}
            <div className="flex items-center px-1 pt-2 pb-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
              <span className="w-8 shrink-0" />
              <span className="flex-1">Price</span>
              <span>Profit</span>
            </div>
            {/* RRP */}
            <div className="flex items-center px-1 py-1 border-b border-dashed border-slate-100">
              <span className="text-[9px] font-bold text-slate-400 w-8 shrink-0">RRP</span>
              <span className="flex-1 text-[10px] text-slate-500 tabular-nums">€{deal.rrp}</span>
              <span className="text-[10px] text-emerald-600 font-bold tabular-nums">€{deal.profit}</span>
            </div>
            {/* Amazon */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.amazon.com", "_blank"); }}
              className="flex items-center px-1 py-1 border-b border-dashed border-slate-100 hover:bg-orange-50/50 rounded transition-colors cursor-pointer">
              <div className="w-8 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-3.5 h-3.5" /></div>
              <span className="flex-1 text-[10px] text-slate-500 tabular-nums">€{deal.rrp}</span>
              <span className="text-[10px] font-bold tabular-nums" style={{color: "#FF9900"}}>€{deal.profit}</span>
            </div>
            {/* eBay */}
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open("https://www.ebay.com", "_blank"); }}
              className="flex items-center px-1 py-1 hover:bg-blue-50/50 rounded transition-colors cursor-pointer">
              <div className="w-8 shrink-0 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="eBay" className="h-2.5 w-auto" /></div>
              <span className="flex-1 text-[10px] text-slate-500 tabular-nums">€{deal.rrp}</span>
              <span className="text-[10px] font-bold tabular-nums" style={{color: "#0064D2"}}>€{deal.profit}</span>
            </div>
          </div>
        </div>
      </a>
      {/* Action button — NOT part of the card link */}
      <div className="p-3.5 pt-3">
        {isPremium ? (
          <button onClick={() => onContact(deal)} className="w-full py-2 text-xs font-bold rounded-lg transition-all bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1.5 mt-auto">
            <Mail size={12} /> Message Supplier
          </button>
        ) : isLoggedIn ? (
          <a href="/pricing" className="block w-full py-2 text-xs font-bold rounded-lg transition-all bg-orange-500 hover:bg-orange-600 text-white text-center mt-auto">
            Upgrade Now
          </a>
        ) : (
          <a href="/register" className="block w-full py-2 text-xs font-bold rounded-lg transition-all bg-orange-500 hover:bg-orange-600 text-white text-center mt-auto">
            Join Now
          </a>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   5. HOT OFFERS CAROUSEL (Detailed Cards)
   ═══════════════════════════════════════ */
function HotOffersCarousel({ isPremium, isLoggedIn }) {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(DETAILED_DEALS.length);
  const [contactModal, setContactModal] = useState(null);
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (deal) => {
    setContactForm({ subject: "", message: "" });
    setContactSent(false);
    setContactModal(deal);
  };

  const handleSendMessage = () => {
    setContactSent(true);
    setTimeout(() => { setContactModal(null); setContactSent(false); }, 2000);
  };


  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 bg-slate-50">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deals</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Hot Wholesale & Dropship Offers</h2>
          <p className="text-sm text-slate-500 mt-1">Get instant access to the latest and most popular wholesale and drop-ship opportunities.</p>
        </div>
        <a href="/deals" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
          Explore Deals <ArrowRight size={14} />
        </a>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {DETAILED_DEALS.map((deal, i) => (
            <HotOfferCard key={i} deal={deal} isPremium={isPremium} isLoggedIn={isLoggedIn} onContact={handleContact} />
          ))}
        </div>
        {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
        {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
      </div>

      <ContactSupplierModal item={contactModal} onClose={() => setContactModal(null)} contactForm={contactForm} setContactForm={setContactForm} contactSent={contactSent} onSend={handleSendMessage} />
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
            <p className="text-slate-600 mt-3 text-sm leading-relaxed">
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
                <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
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
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (sup) => {
    setContactForm({ subject: "", message: "" });
    setContactSent(false);
    setContactModal(sup);
  };

  const handleSendMessage = () => {
    setContactSent(true);
    setTimeout(() => { setContactModal(null); setContactSent(false); }, 2000);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left side — section info */}
        <div className="lg:w-[280px] xl:w-[320px] shrink-0 flex flex-col">
          <span className="text-sm font-bold text-orange-600 tracking-wide">Suppliers</span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">Featured Supplier Offers Solutions</h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">Get instant access to the latest and most popular wholesale and drop-ship opportunities perfect to scale your inventory and up your revenue.</p>
          <a href="/suppliers" className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            Explore Suppliers <ArrowRight size={14} />
          </a>
        </div>

        {/* Right side — card carousel */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
              {SUPPLIERS.map((sup, i) => (
                <div key={i} className="w-[340px] sm:w-[380px] lg:w-[420px] shrink-0 snap-start bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all flex flex-col">
                  {/* Supplier name & meta */}
                  <div className="px-5 pt-5 pb-0">
                    <a href={`/suppliers/${sup.name.toLowerCase().replace(/\s+/g, "-")}`} className="block">
                      <h3 className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors leading-snug">{sup.name}</h3>
                    </a>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <FlagImg code={sup.countryCode} size={16} />
                        {sup.countryName}
                      </span>
                      <span className="text-slate-300">&middot;</span>
                      <StarRating rating={sup.rating} size={11} showValue />
                      <span className="text-slate-300">&middot;</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Calendar size={10} />
                        {sup.yearsActive} yrs
                      </span>
                      <span className="text-slate-300">&middot;</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
                        <Clock size={10} />
                        {sup.openingHours}
                      </span>
                      {sup.verified && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">
                          <BadgeCheck size={9} />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 px-5 mt-3">
                    <button className="flex-1 py-2 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5">
                      <Phone size={12} /> Call Now
                    </button>
                    <button onClick={() => handleContact(sup)} className="flex-1 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <MessageSquare size={12} /> Send Enquiry
                    </button>
                  </div>

                  {/* Category tags */}
                  <div className="flex flex-wrap gap-1.5 px-5 mt-3">
                    {sup.categories.map((cat) => (
                      <a key={cat} href="#" className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-white border border-emerald-300 rounded-full hover:bg-emerald-50 transition-colors">
                        {cat}
                      </a>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="px-5 mt-3 flex-1">
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
                    <div className="text-[13px] text-slate-600 leading-relaxed overflow-y-auto custom-scrollbar" style={{ maxHeight: "5.2em" }}>
                      {sup.desc}
                    </div>
                  </div>

                  {/* Contact & Address footer */}
                  <div className="px-5 mt-3 pb-5">
                    <div className="relative flex gap-4 pl-2.5 pr-4 py-3 bg-slate-50 rounded-lg h-[88px]">
                      {/* Address — bottom left */}
                      <div className="flex-1 min-w-0 max-w-[45%]">
                        <div className="flex items-start gap-1.5 text-xs">
                          <MapPin size={11} className="text-slate-400 shrink-0 mt-0.5" />
                          {isPremium ? (
                            <span className="text-slate-600 leading-relaxed">{sup.address}</span>
                          ) : (
                            <span className="select-none text-slate-500 leading-relaxed">{scrambleText(sup.address)}</span>
                          )}
                        </div>
                      </div>
                      {/* Phone / Contact / Website — bottom right */}
                      <div className="shrink-0 ml-auto space-y-1.5 flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone size={10} className="text-slate-400" />
                          {isPremium ? (
                            <span className="text-slate-600">{sup.phone}</span>
                          ) : (
                            <span className="select-none text-slate-500">{scrambleText(sup.phone)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail size={10} className="text-slate-400" />
                          {isPremium ? (
                            <button onClick={() => handleContact(sup)} className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                              Contact Supplier
                            </button>
                          ) : (
                            <span className="select-none text-slate-500">{scrambleText(sup.email)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Globe size={10} className="text-slate-400" />
                          {isPremium ? (
                            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors">
                              Visit Website <ExternalLink size={9} />
                            </a>
                          ) : (
                            <span className="select-none text-slate-500">{scrambleText(sup.website || "www.supplier.com")}</span>
                          )}
                        </div>
                      </div>

                      {/* Tier overlay for non-premium */}
                      {!isPremium && (
                        <div className="absolute inset-0 flex items-center justify-end bg-slate-50/80 backdrop-blur-[3px] rounded-lg">
                          <div className="text-right pr-4">
                            <span className="text-xs text-slate-500 font-medium block mb-1.5">
                              {isLoggedIn ? "Upgrade to see supplier details" : "Join to access supplier details"}
                            </span>
                            <a href={isLoggedIn ? "/pricing" : "/register"} className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm hover:bg-orange-600 transition-all">
                              <Lock size={10} />
                              {isLoggedIn ? "Upgrade Now" : "Join Now!"}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            {canLeft && <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronLeft size={18} /></button>}
            {canRight && <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10"><ChevronRight size={18} /></button>}
          </div>

        </div>
      </div>

      <ContactSupplierModal item={contactModal} onClose={() => setContactModal(null)} contactForm={contactForm} setContactForm={setContactForm} contactSent={contactSent} onSend={handleSendMessage} />
    </section>
  );
}

/* ═══════════════════════════════════════
   8. COUNTRY/REGION GRID
   ═══════════════════════════════════════ */
function CountryGrid() {
  const { scrollRef, canLeft, canRight, scroll } = useCarousel(COUNTRIES.length);
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-2 pb-8">
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
          <button key={i} className="w-[90px] sm:w-[100px] shrink-0 snap-start flex flex-col items-center gap-2 py-4 px-2 rounded-xl border border-slate-200 bg-white hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer">
            <span className="group-hover:scale-110 transition-transform"><FlagImg code={c.code} size={32} /></span>
            <span className="text-[10px] font-semibold text-slate-600 group-hover:text-orange-600 transition-colors text-center leading-tight">{c.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   9. FAQ
   ═══════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-500 mt-1">Have questions? We're here to help.</p>
        </div>
        <a href="/help" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"><HelpCircle size={14} /> Help Center</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
        {FAQS.map((faq, i) => (
          <div key={i} className={`rounded-xl border transition-all ${openIndex === i ? "border-orange-200 bg-orange-50/50 shadow-sm" : "border-slate-200 bg-white"}`}>
            <button onClick={() => setOpenIndex(openIndex === i ? -1 : i)} className="w-full flex items-start gap-3 px-5 py-4 text-left">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${openIndex === i ? "bg-orange-500" : "bg-slate-100"}`}>
                <ChevronDown size={13} className={`transition-transform ${openIndex === i ? "rotate-180 text-white" : "text-slate-400"}`} />
              </div>
              <h3 className={`text-sm font-semibold transition-colors ${openIndex === i ? "text-orange-700" : "text-slate-800"}`}>{faq.q}</h3>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 pl-14"><p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   10. STATS + TESTIMONIALS
   ═══════════════════════════════════════ */
function StatsTestimonials() {
  const scrollRef = useRef(null);

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
                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {t.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.author}</p>
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
    </section>
  );
}

/* ═══════════════════════════════════════
   CTA BANNER — Get Started
   ═══════════════════════════════════════ */
function CtaBanner() {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8 mt-2 mb-6 bg-gradient-to-b from-orange-50/80 to-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-orange-100">
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

/* ═══════════════════════════════════════
   MAIN HOMEPAGE — PHASE 7
   ═══════════════════════════════════════ */
export default function Phase7Homepage() {
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
      <HotOffersCarousel isPremium={isPremium} isLoggedIn={isLoggedIn} />
      <TrustSectionSuppliers />
      <FeaturedSuppliers isPremium={isPremium} isLoggedIn={isLoggedIn} />
      <CountryGrid />
      <FAQSection />
      <StatsTestimonials />
      <CtaBanner />

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
