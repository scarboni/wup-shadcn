/**
 * Static data arrays extracted from pricing.jsx to reduce
 * component file size and improve code organisation.
 *
 * Data is imported by pricing.jsx at build time — no runtime cost.
 */

/* ─── Feature comparison table ─── */
export const ALL_FEATURES = [
  { label: "20,530+ Live Wholesale & Dropship Deals", standard: true, premium: true, premiumPlus: true, tip: "Browse over 20,530 verified wholesale and dropship deals updated daily, with full pricing and profit calculations." },
  { label: "200–300% Average Mark-ups", standard: true, premium: true, premiumPlus: true, tip: "Our listed deals offer an average mark-up of 200–300% when resold on eBay, Amazon, or your own store." },
  { label: "Up to 95% Off Retail Prices", standard: true, premium: true, premiumPlus: true, tip: "Source products at up to 95% below high-street retail prices from verified wholesale suppliers." },
  { label: "Sell on eBay & Amazon at a Profit", standard: true, premium: true, premiumPlus: true, tip: "Every deal includes estimated profit margins for eBay and Amazon so you can sell with confidence." },
  { label: "Authentic Designer Brands Only", standard: true, premium: true, premiumPlus: true, tip: "All brands listed are 100% authentic. We verify every supplier to ensure genuine products only." },
  { label: "47,400+ EU, UK, USA Verified Wholesalers", standard: false, premium: true, premiumPlus: true, tip: "Access our full database of over 47,400 verified wholesalers across Europe, the UK, and the USA." },
  { label: "900+ Verified Liquidators", standard: false, premium: true, premiumPlus: true, tip: "Browse 900+ liquidation companies offering bankrupt stock, customer returns, and end-of-line goods at deep discounts." },
  { label: "Web's Largest EU Dropshippers Database", standard: false, premium: true, premiumPlus: true, tip: "Access the largest database of European dropship suppliers for cross-border selling opportunities." },
  { label: "Web's Largest UK Dropshippers Database", standard: false, premium: true, premiumPlus: true, tip: "The most comprehensive database of UK-based dropshippers — sell without holding any stock." },
  { label: "Web's Largest US Dropshippers Database", standard: false, premium: true, premiumPlus: true, tip: "Tap into the biggest US dropshipper directory to sell to the world's largest e-commerce market." },
  { label: "14,000+ US Verified Wholesalers", standard: false, premium: true, premiumPlus: true, tip: "Over 14,000 verified US-based wholesale suppliers ready to supply your business." },
  { label: "Saved Searches", standard: false, premium: true, premiumPlus: true, tip: "Save your search criteria and get notified when new matching products or suppliers become available." },
  { label: "Send Unlimited Enquiries", standard: false, premium: false, premiumPlus: true, tip: "Contact as many suppliers as you like with no limits — send enquiries, request quotes, and negotiate deals." },
  { label: "Supplier Review Profiles", standard: false, premium: false, premiumPlus: true, tip: "Access detailed supplier review profiles with ratings, feedback, and performance history from verified members." },
  { label: "Daily Newsletter With the Latest Offers", standard: false, premium: false, premiumPlus: true, tip: "Receive a curated daily email with the newest wholesale deals and supplier offers before anyone else." },
  { label: "Exclusive Member Discounts", standard: false, premium: false, premiumPlus: true, tip: "Premium+ members get exclusive discounts and priority access to limited-time supplier promotions." },
  { label: "Unlimited Custom Sourcing Support Guarantee", standard: false, premium: false, premiumPlus: true, tip: "Our team will personally help you find any product or supplier. Unlimited requests, guaranteed results or your money back." },
];

/* PRODUCTION (H2): Fetch from GET /api/testimonials?limit=8 */
export const TESTIMONIALS = [
  { text: "As a new Sole Trader, it's been 14 days since I purchased the Combo deal and I totally love it. I've been linked to many many great suppliers.", author: "Rena Harvey", label: "Sole Trader", location: "United Kingdom" },
  { text: "Many thanks for an excellent and customer focused service. I really appreciated the advice on building a successful business.", author: "David Chen", label: "eBay Reseller", location: "United Kingdom" },
  { text: "I feel that I finally belong to a reputable company that is helping me change my life financially. I'm grateful.", author: "Sarah Mitchell", label: "Online Retailer", location: "Ireland" },
  { text: "Your service is brilliant, I would recommend your website and service to anyone.", author: "Thu Huong Do", label: "Dropshipper", location: "Sweden" },
  { text: "I am very pleased that I have subscribed and think the level of service is excellent. The information you provide is very detailed and helpful.", author: "James Wilson", label: "Amazon Seller", location: "United Kingdom" },
  { text: "In the short time I have been registered I have found some very interesting wholesalers happy to do business for £50 min order.", author: "Alex Elliott", label: "Small Business Owner", location: "Australia" },
  { text: "Found 15 new verified suppliers for electronics within the first week. Game changer for my business.", author: "Tom Bradford", label: "Electronics Reseller", location: "United Kingdom" },
  { text: "The liquidation deals alone have paid for my subscription ten times over. Incredible value.", author: "Maria Santos", label: "Liquidation Buyer", location: "Spain" },
  { text: "The sourcing team found me a supplier within 48 hours of my request. The margins are incredible and the supplier has been reliable ever since.", author: "James Richardson", label: "Amazon FBA Seller", location: "United States" },
  { text: "Been using WholesaleUp for over two years now. My eBay shop profits have tripled thanks to the deals I find here every week.", author: "Maria Gonzalez", label: "eBay Power Seller", location: "Spain" },
  { text: "As a newcomer to reselling, I was overwhelmed. The platform made it so easy to find verified suppliers and profitable deals from day one.", author: "Oliver Schmitt", label: "New Reseller", location: "Germany" },
  { text: "The deal tracker alone is worth the subscription. I get notified the moment a new deal matches my criteria. It's like having a personal buyer.", author: "Sarah Jenkins", label: "Deal Hunter", location: "Canada" },
  { text: "I run three Amazon stores and WholesaleUp is my go-to source for all of them. The variety of suppliers and product categories is unmatched.", author: "David Moore", label: "Multi-Store Owner", location: "Australia" },
  { text: "Customer support is top notch. Had an issue with a supplier and the team stepped in and resolved it within a day. Very impressed.", author: "Fatima Al-Hassan", label: "Wholesale Buyer", location: "United Arab Emirates" },
  { text: "Upgraded to Premium last month and it's already paid for itself ten times over. The exclusive deals section is a goldmine.", author: "Patrick O'Brien", label: "Online Retailer", location: "Ireland" },
  { text: "The profit calculators and market analysis tools help me make smarter buying decisions. My return rate has dropped significantly.", author: "Yuki Tanaka", label: "Online Retailer", location: "Japan" },
  { text: "What sets WholesaleUp apart is the quality of suppliers. Every one I've contacted has been professional and delivered on time.", author: "Lisa Bergström", label: "Quality-Focused Buyer", location: "Sweden" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan Ahmed", label: "Wholesale Reseller", location: "United Kingdom" },
  { text: "Flash sales section is brilliant. Got £8K of electronics stock for £4.2K. Incredible margins.", author: "Brian Lawson", label: "Electronics Reseller", location: "United Kingdom" },
  { text: "The verified supplier badges give me confidence I'm dealing with legitimate businesses. No more wasted time on dodgy leads.", author: "Sophie Laurent", label: "Boutique Owner", location: "France" },
  { text: "Switched from Alibaba six months ago. Better suppliers, faster shipping, and the customer support actually responds.", author: "Tom Eriksson", label: "Dropshipper", location: "Sweden" },
  { text: "My profit margins went from 15% to 40% after finding niche suppliers here that I couldn't find anywhere else.", author: "Priya Sharma", label: "Shopify Store Owner", location: "Canada" },
  { text: "The deal alerts feature alone is worth the subscription. I've snagged three bulk deals this month before they sold out.", author: "Luca Romano", label: "Wholesale Buyer", location: "Italy" },
  { text: "As a dropshipper, having access to suppliers who actually hold UK stock has transformed my delivery times. Customers love it.", author: "Rachel Okonkwo", label: "Dropship Entrepreneur", location: "United Kingdom" },
  { text: "The platform makes it incredibly easy to compare suppliers side by side. Saved me thousands in my first quarter.", author: "Klaus Weber", label: "E-commerce Manager", location: "Germany" },
  { text: "I've been using WholesaleUp for dropshipping and it's been a game changer. The supplier verification gives me confidence in every order.", author: "Sofia Rodriguez", label: "Dropshipper", location: "Spain" },
  { text: "Excellent variety of deals across multiple categories. The filters make it easy to find exactly what I need for my eBay store.", author: "James Patterson", label: "eBay Seller", location: "Ireland" },
  { text: "Very professional platform. I found reliable suppliers within my first week and have been ordering consistently ever since.", author: "Anna Kowalski", label: "Online Reseller", location: "Poland" },
  { text: "The daily deal updates keep me ahead of the competition. I've tripled my Amazon sales since joining six months ago.", author: "Daniel Moore", label: "Amazon Seller", location: "United Kingdom" },
  { text: "Simple to use and very effective. The price comparison with Amazon and eBay is incredibly useful for making quick sourcing decisions.", author: "Marie Dupont", label: "Wholesale Buyer", location: "France" },
  { text: "Signed up as a free member first, then upgraded after seeing the quality of deals. Best investment I've made for my online business.", author: "Luca Bianchi", label: "Online Retailer", location: "Italy" },
  { text: "The dropship deals are particularly good. No need to hold inventory and the margins are better than I expected.", author: "Emma van Dijk", label: "Dropshipper", location: "Netherlands" },
  { text: "Customer support is responsive and the platform is constantly improving. New deals are added daily which keeps things fresh.", author: "Oliver Schmidt", label: "Online Reseller", location: "Germany" },
  { text: "Great platform for sourcing wholesale products. The markup percentages are clearly displayed which helps me calculate profit margins instantly.", author: "Marcus Chen", label: "Wholesale Buyer", location: "Germany" },
  { text: "Absolutely fantastic, it's a great service and has a really good layout. It's very convenient and it is updated very regularly.", author: "Alice Elliott", label: "Online Reseller", location: "United Kingdom" },
  { text: "Very pleased with the service, suppliers and dropshippers. I have just signed up to another full term for the next 6 months.", author: "Thai Hoang Do", label: "Dropshipper", location: "Belgium" },
  { text: "I source all my vintage clothing stock through WholesaleUp now. The niche categories are incredibly well organised.", author: "Chloe Barker", label: "Vintage Seller", location: "United Kingdom" },
  { text: "Our company switched to WholesaleUp for supplier discovery and we've cut procurement costs by 30% in under a year.", author: "Henrik Lindqvist", label: "Procurement Manager", location: "Finland" },
  { text: "Being able to see the full supplier contact details upfront is a huge time saver. No more chasing hidden information.", author: "Aisha Patel", label: "Retail Buyer", location: "United Kingdom" },
  { text: "The weekly newsletter alone surfaces deals I would never have found on my own. It's become essential reading every Monday.", author: "George Papadopoulos", label: "Online Retailer", location: "Greece" },
];

export const FAQS = [
  { q: "What do I get when I join WholesaleUp buyer?", a: "You get immediate access to our platform with over 54,000 verified suppliers, all the latest wholesale deals with profit calculations, and the Deal Tracker tool. You'll also receive our weekly deals newsletter and can request personalized sourcing assistance from our team." },
  { q: "Are the suppliers really verified?", a: "Yes, all suppliers on our platform go through a rigorous verification process to ensure they are legitimate wholesale businesses. We verify their business credentials, check their reputation, and ensure they meet our quality standards before listing them on our platform." },
  { q: "Is WholesaleUp good for beginners?", a: "Absolutely! WholesaleUp is designed to help both beginners and experienced resellers. We provide educational resources, profit calculators, and personalized support to help you get started and grow your business successfully." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel at any time. Your access will continue until the end of your current billing period. We also offer a money-back guarantee if you're not satisfied within the first 14 days." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 100% money-back guarantee. If we can't find the suppliers or deals you're looking for, we'll refund your subscription in full. No questions asked." },
  { q: "How often are new deals added?", a: "We add new wholesale and dropship deals daily. Our team constantly sources new opportunities from verified suppliers across the UK, EU, and North America to ensure our members always have fresh, profitable deals to choose from." },
  { q: "Can I use WholesaleUp with any eCommerce platform?", a: "Yes! WholesaleUp works with all major platforms including eBay, Amazon, Shopify, WooCommerce, and more. There's no platform lock-in — our deals and supplier connections work however you choose to sell." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. All payments are processed securely via Stripe with bank-level encryption." },
];

/* ─── "Why choose us" comparison data ─── */
export const WHY_CHOOSE_US = [
  { feature: "Hand-Verified Suppliers (54,000+ globally)", us: true, them: "partial" },
  { feature: "Daily Updated Wholesale & Liquidation Deals", us: true, them: false },
  { feature: "Built-In Profit Calculator on Every Deal", us: true, them: false },
  { feature: "No Platform Lock-In (eBay, Amazon, Shopify…)", us: true, them: "partial" },
  { feature: "Transparent Supplier Contact Information", us: true, them: "partial" },
  { feature: "Trusted Since 2006 (Proven Track Record)", us: true, them: "partial" },
  { feature: "14-Day Money-Back Guarantee", us: true, them: false },
  { feature: "Dedicated Custom Sourcing Support", us: true, them: false },
];

/* ─── Live registration notifications ─── */
export const LIVE_REGISTRATIONS = [
  { name: "Marco", plan: "PREMIUM", country: "Italy", time: "2 minutes ago" },
  { name: "Sarah", plan: "PREMIUM+", country: "United Kingdom", time: "5 minutes ago" },
  { name: "Ahmed", plan: "PREMIUM", country: "UAE", time: "8 minutes ago" },
  { name: "Lisa", plan: "STANDARD", country: "Germany", time: "12 minutes ago" },
  { name: "Jun", plan: "PREMIUM", country: "Japan", time: "14 minutes ago" },
];

/* ─── Pricing exit popup testimonials (30 entries) ─── */
export const PRICING_EXIT_TESTIMONIALS = [
  { text: "I was sceptical at first, but within my first week I sourced products at 70% below retail. Already made back 5x my membership.", author: "Daniel T.", role: "Premium Member" },
  { text: "The deal alerts saved me thousands on bulk stock. Worth every penny of membership.", author: "Robert W.", role: "Deal Hunter" },
  { text: "Found 15 new verified suppliers for electronics within the first week. Game changer for my business.", author: "Tom B.", role: "Quality-Focused Buyer" },
  { text: "Just bagged 1000 units of clothing at 40% below market price. Deals are genuinely incredible.", author: "Patricia H.", role: "Fashion Reseller" },
  { text: "The Combo membership pays for itself with just one good deal. I've had three this month alone.", author: "William F.", role: "Premium Member" },
  { text: "Found overstock liquidation deals that my competitors don't even know about. Real competitive advantage.", author: "Fatima A.", role: "Liquidation Buyer" },
  { text: "Premium membership gave me access to exclusive supplier deals. Revenue increased 35% in 3 months.", author: "Christopher B.", role: "Premium Member" },
  { text: "Flash sales section is brilliant. Got £8K of electronics stock for £4.2K. Incredible margins.", author: "Brian L.", role: "Flash Sale Hunter" },
  { text: "Liquidation deals are a game-changer for my Amazon FBA business. Margins have never been better.", author: "Angela W.", role: "Amazon FBA Seller" },
  { text: "The supplier database is incredibly comprehensive. I've tripled my supplier network in just 2 months.", author: "Jessica W.", role: "Supply Chain Builder" },
  { text: "Found manufacturers I never knew existed. The supplier verification process is really thorough.", author: "Yuki T.", role: "Supply Chain Builder" },
  { text: "Been buying from suppliers I found on WholesaleUp for 2 years now. All legitimate and reliable.", author: "Rachel C.", role: "Veteran Reseller" },
  { text: "The sourcing team helped me find a manufacturer for a completely custom product line. Incredible resource.", author: "Hannah P.", role: "Product Sourcer" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan A.", role: "Wholesale Entrepreneur" },
  { text: "The profit calculator is essential for my daily operations. Saves me 30 minutes every day.", author: "Lucas B.", role: "Online Retailer" },
  { text: "Found dropship suppliers with 48-hour shipping times. Game changer for my Shopify store.", author: "Jonathan B.", role: "Shopify Store Owner" },
  { text: "The low MOQ suppliers listed here are perfect for my dropshipping model. No inventory risk.", author: "Tanya W.", role: "Dropshipper" },
  { text: "Quality suppliers that actually respond to inquiries. No ghost profiles like other platforms.", author: "Michael O.", role: "Online Reseller" },
  { text: "The verified badge actually means something. These suppliers deliver on their promises.", author: "Amara O.", role: "Quality-Focused Buyer" },
  { text: "Deal Tracker keeps me from missing any good opportunities. Best feature of the platform.", author: "Simone B.", role: "Deal Hunter" },
  { text: "The step-by-step sourcing process helped me go from zero to selling on eBay in 2 weeks.", author: "Oliver M.", role: "eBay Seller" },
  { text: "Support team scheduled a call to help me optimize my membership. Personal touch makes all the difference.", author: "Caroline S.", role: "Premium Member" },
  { text: "The API access for Premium members is incredibly powerful. Automated my entire sourcing workflow.", author: "Rajesh P.", role: "E-commerce Manager" },
  { text: "Massive reduction in time spent vetting suppliers thanks to the comprehensive supplier profiles.", author: "Sophie M.", role: "Online Reseller" },
  { text: "Best support experience I've had with any wholesale platform. They genuinely care about your success.", author: "Ahmed H.", role: "Online Reseller" },
  { text: "I submitted a custom sourcing request and had 3 matching suppliers within 48 hours. Amazing.", author: "Nicholas G.", role: "Product Sourcer" },
  { text: "The community forum is active and helpful. Real business owners sharing genuine advice.", author: "Mohammed I.", role: "Wholesale Reseller" },
  { text: "Supplier comparison tool saved me hours of research. Side-by-side analysis is brilliant.", author: "Michelle J.", role: "Wholesale Buyer" },
  { text: "The price history tool shows me when suppliers typically run sales. Strategic planning made easy.", author: "Javier R.", role: "Wholesale Buyer" },
  { text: "Deal alert notifications saved me from missing massive liquidation sales. Essential tool.", author: "Georgina P.", role: "Liquidation Buyer" },
];

/* ─── Full comparison table (Us vs. Them) ─── */
export const COMPARISON_FEATURES = [
  { label: "Hand-Verified Suppliers (54,000+ globally)", us: "yes", them: "partial", themTip: "Some vetting, varies by platform" },
  { label: "Daily Updated Wholesale & Liquidation Deals", us: "yes", them: "partial", themTip: "Some offer deals but not daily updated" },
  { label: "Built-In Profit Calculator on Every Deal", us: "yes", them: "no" },
  { label: "UK, EU & US Dropshipper Databases", us: "yes", them: "no" },
  { label: "No Platform Lock-In (eBay, Amazon, Shopify…)", us: "yes", them: "partial", themTip: "Many restrict to Shopify or specific platforms" },
  { label: "Transparent Supplier Contact Information", us: "yes", them: "partial", themTip: "Often hidden behind the platform" },
  { label: "Trusted Since 2004 (Proven Track Record)", us: "yes", them: "no" },
  { label: "Money-Back Guarantee + Keep Premium Access", us: "yes", them: "no" },
  { label: "Unlimited Custom Sourcing Support", us: "yes", them: "no" },
  { label: "Active Community of 900,000+ Resellers", us: "yes", them: "no" },
  { label: "200–300% Average Mark-Ups on Deals", us: "yes", them: "no" },
  { label: "Verified Liquidation & Bankrupt Stock Access", us: "yes", them: "no" },
];
