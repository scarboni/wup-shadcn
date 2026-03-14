/* ═══════════════════════════════════════════════════════════
   ALL_TESTIMONIALS — Full testimonial dataset (380+ entries)
   PRODUCTION (H2): Replace with GET /api/testimonials?limit=50&category=...
   SEED: prisma/seed.ts → seedTestimonials()
   Imported by: testimonials.jsx
   ═══════════════════════════════════════════════════════════ */
export const ALL_TESTIMONIALS = [
  // Service Category
  { text: "Excellent customer service team! They helped me find the perfect supplier for my startup in just minutes.", author: "James Mitchell", location: "United Kingdom", rating: 5, category: "Service", role: "Startup Founder" },
  { text: "The support team responded to my query within 2 hours. Very impressed with the professionalism.", author: "Sarah Chen", location: "United Kingdom", rating: 5, category: "Service", role: "Online Reseller" },
  { text: "Best support experience I've had with any wholesale platform. They genuinely care about your success.", author: "Ahmed Hassan", location: "United Arab Emirates", rating: 5, category: "Service", role: "Online Reseller" },
  { text: "I've been using WholesaleUp for 3 years and the customer service just keeps getting better.", author: "Emma Thompson", location: "United Kingdom", rating: 5, category: "Service", role: "Veteran Reseller" },
  { text: "Had a payment issue and the support team sorted it within 24 hours. Fantastic service.", author: "Marcus Johnson", location: "United States", rating: 5, category: "Service", role: "Online Reseller" },
  { text: "The live chat support is incredibly helpful. No more waiting days for email responses.", author: "Laura Rodriguez", location: "Spain", rating: 5, category: "Service", role: "Online Retailer" },
  { text: "Customer service went above and beyond to help me with my supplier query. Really appreciated it.", author: "David Park", location: "United Kingdom", rating: 5, category: "Service", role: "Wholesale Buyer" },
  { text: "Quick response times and genuine solutions. This is what customer service should look like.", author: "Nina Patel", location: "United Kingdom", rating: 5, category: "Service", role: "Wholesale Buyer" },

  // Suppliers Category
  { text: "Found 15 new verified suppliers for electronics within the first week. Game changer for my business.", author: "Tom Bradford", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },
  { text: "The supplier database is incredibly comprehensive. I've tripled my supplier network in just 2 months.", author: "Jessica Wagner", location: "Germany", rating: 5, category: "Suppliers", role: "Supply Chain Builder" },
  { text: "Quality suppliers that actually respond to inquiries. No ghost profiles like other platforms.", author: "Michael O'Brien", location: "Ireland", rating: 5, category: "Suppliers", role: "Online Reseller" },
  { text: "Found manufacturers I never knew existed. The supplier verification process is really thorough.", author: "Yuki Tanaka", location: "Japan", rating: 5, category: "Suppliers", role: "Supply Chain Builder" },
  { text: "Been buying from suppliers I found on WholesaleUp for 2 years now. All legitimate and reliable.", author: "Rachel Cohen", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Veteran Reseller" },
  { text: "The supplier ratings and reviews are authentic. You can trust what other buyers say about them.", author: "Kevin O'Neill", location: "United States", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },
  { text: "Massive reduction in time spent vetting suppliers thanks to the comprehensive supplier profiles here.", author: "Sophie Martin", location: "France", rating: 5, category: "Suppliers", role: "Online Reseller" },
  { text: "Discovered incredible European suppliers I'd been missing. Supplier quality is top-notch.", author: "Carlos Mendez", location: "Portugal", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },
  { text: "The verified badge actually means something. These suppliers deliver on their promises.", author: "Amara Okafor", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },

  // Deals Category
  { text: "The deal alerts saved me thousands on bulk stock. Worth every penny of membership.", author: "Robert Walsh", location: "United Kingdom", rating: 5, category: "Deals", role: "Deal Hunter" },
  { text: "Just bagged 1000 units of clothing at 40% below market price. Deals are genuinely incredible.", author: "Patricia Hayes", location: "United States", rating: 5, category: "Deals", role: "Fashion Reseller" },
  { text: "The Combo membership pays for itself with just one good deal. I've had three this month alone.", author: "William Fisher", location: "United Kingdom", rating: 5, category: "Deals", role: "Premium Member" },
  { text: "Found overstock liquidation deals that my competitors don't even know about. Real competitive advantage.", author: "Fatima Al-Rashid", location: "Saudi Arabia", rating: 5, category: "Deals", role: "Liquidation Buyer" },
  { text: "Premium membership gave me access to exclusive supplier deals. Revenue increased 35% in 3 months.", author: "Christopher Brown", location: "United Kingdom", rating: 5, category: "Deals", role: "Premium Member" },
  { text: "The deal quality here is exceptional. Not like other platforms with 'deals' that aren't actually deals.", author: "Lisa Andersen", location: "Denmark", rating: 5, category: "Deals", role: "Online Reseller" },
  { text: "Flash sales section is brilliant. Got £8K of electronics stock for £4.2K. Incredible margins.", author: "Brian Lawson", location: "United Kingdom", rating: 5, category: "Deals", role: "Flash Sale Hunter" },
  { text: "Liquidation deals are a game-changer for my Amazon FBA business. Margins have never been better.", author: "Angela Wright", location: "United States", rating: 5, category: "Deals", role: "Amazon FBA Seller" },
  { text: "The weekly newsletter keeps me updated on premium deals. Honestly, I've made more from deals than my main supplier list.", author: "Vincent Moreau", location: "France", rating: 5, category: "Deals", role: "Online Reseller" },

  // Sourcing Category
  { text: "The sourcing team helped me find a manufacturer for a completely custom product line. Incredible resource.", author: "Hannah Peterson", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Product Sourcer" },
  { text: "I submitted a custom sourcing request and had 3 matching suppliers within 48 hours. Amazing.", author: "Nicholas Grant", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Product Sourcer" },
  { text: "The sourcing assistance helped me cut my supplier research time by 70%. Paid for itself instantly.", author: "Priya Desai", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Product Sourcer" },
  { text: "Had a very specific requirement for pet supplies and the sourcing team nailed it. Found exactly what I needed.", author: "Stuart Murray", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Pet Supplies Reseller" },
  { text: "Their sourcing experts actually understand the home & garden market. Got brilliant recommendations.", author: "Olivia Bennett", location: "United States", rating: 5, category: "Sourcing", role: "Home & Garden Reseller" },
  { text: "Used the sourcing service for toys and they found suppliers I would never have discovered myself.", author: "Mark Williams", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Toy Reseller" },
  { text: "The sourcing assistance for beauty products was incredibly valuable. Quality suppliers that align with my brand.", author: "Yasmin Khan", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Beauty Products Reseller" },
  { text: "Premium sourcing team really understands dropshipping requirements. They found perfect low-MOQ suppliers.", author: "Felix Schmitt", location: "Austria", rating: 5, category: "Sourcing", role: "Dropshipper" },

  // Support Category
  { text: "The knowledge base is extensive. Found solutions to most of my questions without contacting support.", author: "Gregory Howard", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },
  { text: "Video tutorials on supplier vetting saved me hours. Support resources are genuinely helpful.", author: "Stephanie Bell", location: "United States", rating: 5, category: "Support", role: "Online Reseller" },
  { text: "The community forum is active and helpful. Real business owners sharing genuine advice.", author: "Mohammed Ibrahim", location: "Egypt", rating: 5, category: "Support", role: "Wholesale Reseller" },
  { text: "Support team scheduled a call to help me optimize my membership. Personal touch makes all the difference.", author: "Caroline Stewart", location: "United Kingdom", rating: 5, category: "Support", role: "Premium Member" },
  { text: "The webinars on sourcing strategies are incredible. Learned more in one session than months of trial and error.", author: "Adrian Foster", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },
  { text: "Support helped me set up my seller account properly. Avoided common mistakes thanks to their guidance.", author: "Maya Kapoor", location: "United Kingdom", rating: 5, category: "Support", role: "New Reseller" },
  { text: "The profit calculator tool is a lifesaver. Support team explained all the features perfectly.", author: "Joseph Barrett", location: "Canada", rating: 5, category: "Support", role: "Online Retailer" },

  // Beginners Category
  { text: "Started wholesale reselling with zero knowledge. WholesaleUp's beginner guides made everything clear.", author: "Natasha Scott", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },
  { text: "The step-by-step sourcing process helped me go from zero to selling on eBay in 2 weeks.", author: "Oliver Murphy", location: "United Kingdom", rating: 5, category: "Beginners", role: "eBay Seller" },
  { text: "Perfect platform for beginners. Everything is explained simply without overwhelming jargon.", author: "Elena Rossi", location: "Italy", rating: 5, category: "Beginners", role: "New Reseller" },
  { text: "Started my wholesale business here 6 months ago as a complete beginner. Now doing £2K weekly revenue.", author: "Hassan Ahmed", location: "United Kingdom", rating: 5, category: "Beginners", role: "Wholesale Entrepreneur" },
  { text: "The beginner pathway helped me understand wholesale better than any YouTube video ever did.", author: "Victoria Clarke", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },
  { text: "Nervous about starting with wholesale until I found WholesaleUp. They make it so accessible for beginners.", author: "Dmitri Volkov", location: "Russia", rating: 5, category: "Beginners", role: "New Reseller" },
  { text: "First time wholesale buyer and the onboarding was seamless. Everything clearly explained.", author: "Sophia Thompson", location: "United States", rating: 5, category: "Beginners", role: "New Reseller" },

  // Tools Category
  { text: "The profit calculator is essential for my daily operations. Saves me 30 minutes every day on calculations.", author: "Lucas Bennett", location: "United Kingdom", rating: 5, category: "Tools", role: "Online Retailer" },
  { text: "Deal Tracker keeps me from missing any good opportunities. Best feature of the platform.", author: "Simone Barbieri", location: "United Kingdom", rating: 5, category: "Tools", role: "Deal Hunter" },
  { text: "The inventory management integration is fantastic. Syncs perfectly with my existing systems.", author: "Aaron Blackwell", location: "United Kingdom", rating: 5, category: "Tools", role: "Inventory Manager" },
  { text: "Supplier comparison tool saved me hours of research. Side-by-side analysis is brilliant.", author: "Michelle Johnson", location: "United States", rating: 5, category: "Tools", role: "Wholesale Buyer" },
  { text: "The price history tool shows me when suppliers typically run sales. Strategic planning made easy.", author: "Javier Rodriguez", location: "Mexico", rating: 5, category: "Tools", role: "Wholesale Buyer" },
  { text: "Export functionality to CSV makes bulk operations so much easier. Love the efficiency tools.", author: "Rebecca Foster", location: "United Kingdom", rating: 5, category: "Tools", role: "Operations Manager" },
  { text: "The API access for Premium members is incredibly powerful. Automated my entire sourcing workflow.", author: "Rajesh Patel", location: "United Kingdom", rating: 5, category: "Tools", role: "E-commerce Manager" },
  { text: "Deal alert notifications saved me from missing massive liquidation sales. Essential tool for any serious seller.", author: "Georgina Price", location: "United Kingdom", rating: 5, category: "Tools", role: "Liquidation Buyer" },

  // Dropshipping Category
  { text: "Found dropship suppliers with 48-hour shipping times. Game changer for my Shopify store.", author: "Jonathan Blake", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Shopify Store Owner" },
  { text: "The low MOQ suppliers listed here are perfect for my dropshipping model. No inventory risk.", author: "Tanya Williams", location: "United States", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "Dropshipping section is incredibly organized. Found suppliers for every niche I wanted to explore.", author: "Klaus Hoffmann", location: "Germany", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "Partnered with 6 dropshipping suppliers from WholesaleUp. All reliable and responsive.", author: "Leah Goldstein", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "The dropshipping verification system actually works. No more fly-by-night suppliers.", author: "Paulo Silva", location: "Brazil", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "My Etsy store now stocks products from 5 WholesaleUp dropshipping partners. Sales increased 200%.", author: "Natalie Brooks", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Etsy Seller" },

  // Liquidation Category
  { text: "Liquidation section is where I find my biggest profit margins. Bulk overstock deals are incredible.", author: "Timothy Price", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Been buying liquidation stock for Amazon FBA for 18 months. Margins consistently hit 40%+.", author: "Cassandra Webb", location: "United States", rating: 5, category: "Liquidation", role: "Amazon FBA Seller" },
  { text: "The liquidation deals from major retailers are mind-blowing. Where else can you find this?", author: "Marcos Fernandez", location: "Spain", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Electronics liquidation stock from WholesaleUp. Quality is consistently excellent.", author: "Eleanor Walsh", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "The authenticated liquidation suppliers here are trustworthy. No counterfeit issues.", author: "Khalid Al-Mansouri", location: "Qatar", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Found an entire pallet of overstock beauty products at 60% off retail. Liquidation deals are unbeatable.", author: "Fiona Ross", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },

  // Amazon Category
  { text: "Found my best FBA suppliers through WholesaleUp. Now my Amazon business generates £5K monthly profit.", author: "Edward Summers", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The Amazon seller community here is invaluable. Tips and tricks for FBA success everywhere.", author: "Veronica Chang", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "Low-MOQ suppliers perfect for testing products on Amazon FBA. Minimal risk, maximum learning.", author: "Gabriel Murphy", location: "Ireland", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "Amazon sellers section helped me understand ungated category requirements. Very detailed and helpful.", author: "Ingrid Larsson", location: "Sweden", rating: 5, category: "Amazon", role: "Amazon Seller" },
  { text: "Used WholesaleUp to source all my top 10 Amazon FBA products. No regrets.", author: "Hugh Patterson", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The supplier quality matches Amazon's standards perfectly. Zero customer complaints.", author: "Lorraine Black", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon Seller" },

  // eBay Category
  { text: "My eBay store inventory comes exclusively from WholesaleUp suppliers. Feedback is consistently 5 stars.", author: "Vincent Hughes", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "eBay sellers on this platform seem to have access to better deals than most. Love it.", author: "Beatrice Morrison", location: "United States", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "Found bulk suppliers that let me run successful eBay auctions. Great selection of electronics and clothing.", author: "Maurice Black", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "My eBay reselling business quadrupled after using WholesaleUp. Finally found consistent suppliers.", author: "Dolores Garcia", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "eBay sellers love WholesaleUp because the suppliers actually have stock. No phantom inventory.", author: "Winston Crawford", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },

  // Service Category
  { text: "Been reselling for 5 years. WholesaleUp is by far the best platform for serious sellers.", author: "Sylvia Wright", location: "United Kingdom", rating: 5, category: "Service", role: "Veteran Reseller" },
  { text: "The value for money is exceptional. I've tested 4 other platforms and this is lightyears ahead.", author: "Philip Anderson", location: "United Kingdom", rating: 5, category: "Service", role: "Online Reseller" },

  // Support Category
  { text: "Switched from a competitor last year. Best business decision I made.", author: "Vivienne Park", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },
  { text: "The networking opportunities with other sellers is valuable in itself. Community is fantastic.", author: "Douglas Crawford", location: "United Kingdom", rating: 5, category: "Support", role: "Wholesale Reseller" },

  // Suppliers Category
  { text: "Found 23 new suppliers in my first month. How was I reselling without this platform before?", author: "Melanie Cooper", location: "United States", rating: 5, category: "Suppliers", role: "Online Reseller" },
  { text: "The supplier verification actually means something. I've had zero issues with any of them.", author: "Terence Hayes", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },

  // Deals Category
  { text: "Turned my side hustle into a £8K monthly income thanks to quality suppliers here.", author: "Alexandra Bennett", location: "United Kingdom", rating: 5, category: "Deals", role: "Wholesale Entrepreneur" },
  { text: "The Premium membership ROI is incredible. Made back the cost in my first week.", author: "Leonard Cooper", location: "United Kingdom", rating: 5, category: "Deals", role: "Premium Member" },

  // Sourcing Category
  { text: "I source everything from sports equipment to home & garden items. Selection is massive.", author: "Helena Petrov", location: "Bulgaria", rating: 5, category: "Sourcing", role: "Sports Equipment Reseller" },
  { text: "The sourcing team understands niche markets brilliantly. Got exactly what I needed for my automotive supplies business.", author: "Kenneth Ross", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Automotive Reseller" },

  // Service Category
  { text: "Customer service actually talks like humans, not robots. Refreshing experience.", author: "Iris Montgomery", location: "United Kingdom", rating: 4, category: "Service", role: "Online Retailer" },
  { text: "Only minor issue was a delayed response once, but they made it right immediately.", author: "Zachary Ward", location: "United States", rating: 4, category: "Service", role: "Online Reseller" },

  // Suppliers Category
  { text: "Some suppliers take longer to respond than others, but the platform itself is excellent.", author: "Penelope Knight", location: "United Kingdom", rating: 4, category: "Suppliers", role: "Online Reseller" },
  { text: "Great overall experience. Found good suppliers though competition is getting more intense.", author: "Brandon Fletcher", location: "United Kingdom", rating: 4, category: "Suppliers", role: "Online Reseller" },

  // Tools Category
  { text: "The Deal Tracker works brilliantly for sports equipment sourcing. Really happy with it.", author: "Margot Stewart", location: "France", rating: 5, category: "Tools", role: "Sports Equipment Reseller" },
  { text: "Inventory sync feature saves me so much time daily. Essential tool for scaling.", author: "Oscar Hughes", location: "United Kingdom", rating: 5, category: "Tools", role: "Inventory Manager" },

  // Beginners Category
  { text: "Started my toy reselling business with WholesaleUp. Now running at £3K monthly revenue.", author: "Rosalind Hayes", location: "United Kingdom", rating: 5, category: "Beginners", role: "Toy Reseller" },
  { text: "Completely new to wholesale but WholesaleUp made it accessible and straightforward.", author: "Franklin Walsh", location: "United States", rating: 5, category: "Beginners", role: "New Reseller" },

  // Dropshipping Category
  { text: "Dropshipping with suppliers I found here. Shipping times are reliable and predictable.", author: "Penelope Gray", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "My Shopify store relies entirely on WholesaleUp dropshipping suppliers. Best decision ever.", author: "Eugene Sanders", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Shopify Store Owner" },

  // Liquidation Category
  { text: "Liquidation section literally saved my business during a slow sales period. Bulk deals are gold.", author: "Margery Paterson", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Found overstock deals that other platforms don't even list. Value is incredible.", author: "Rupert Thomson", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },

  // Amazon Category
  { text: "My Amazon FBA profits increased 3x since using WholesaleUp exclusively.", author: "Sandra Ellis", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The Amazon seller resources here are better than Amazon's own seller central.", author: "Cecil Brown", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon Seller" },

  // eBay Category
  { text: "eBay store is thriving thanks to consistent wholesale stock from here.", author: "Theresa Morgan", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "Built my entire eBay business model around suppliers I found on this platform.", author: "Derek Spencer", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },

  // Deals Category
  { text: "Combo membership includes everything I need to run a successful wholesale business.", author: "Harmony Lynch", location: "United Kingdom", rating: 5, category: "Deals", role: "Wholesale Reseller" },
  { text: "The weekly newsletter highlights are always worth reading. Never miss a good deal.", author: "Irving Sutherland", location: "United Kingdom", rating: 5, category: "Deals", role: "Online Reseller" },

  // Sourcing Category
  { text: "Found a niche supplier for pet supplies that changed my whole business model.", author: "Julianna Fletcher", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Pet Supplies Reseller" },
  { text: "The sourcing team's market research is genuinely valuable. Not just pointing me to suppliers.", author: "Kendall Mason", location: "United States", rating: 5, category: "Sourcing", role: "Product Sourcer" },

  // Support Category
  { text: "Technical support resolved my API integration issue in minutes. Very impressive.", author: "Lydia Foster", location: "United Kingdom", rating: 5, category: "Support", role: "E-commerce Manager" },
  { text: "The knowledge base has answers to questions I didn't even know to ask yet.", author: "Malcolm Carter", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },

  // Beginners Category
  { text: "Absolute beginner and now I'm running a six-figure wholesale business. WholesaleUp made it possible.", author: "Naomi Jenkins", location: "United Kingdom", rating: 5, category: "Beginners", role: "Wholesale Entrepreneur" },
  { text: "The beginner guides are so clear and comprehensive. Never felt lost once.", author: "Otis Wilson", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },

  // Tools Category
  { text: "Profit calculator integrated into my daily workflow. Can't imagine working without it now.", author: "Quinn Mitchell", location: "Ireland", rating: 5, category: "Tools", role: "Online Retailer" },
  { text: "The supplier comparison feature helped me negotiate better rates. Paid for itself immediately.", author: "Rachel Stone", location: "United Kingdom", rating: 5, category: "Tools", role: "Wholesale Buyer" },

  // Dropshipping Category
  { text: "Dropshipping margin requirements are met perfectly by the suppliers listed here.", author: "Sebastian Wright", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "My Etsy dropshipping business hit profitability in month 3. Suppliers are reliable.", author: "Tabitha Green", location: "United States", rating: 5, category: "Dropshipping", role: "Etsy Seller" },

  // Liquidation Category
  { text: "Liquidation deals on clothing are absolutely unbeatable. Bulk fabric suppliers, overstock boutique stock.", author: "Ulysses Hall", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Found a supplier with entire warehouse clearance deals. Margins are through the roof.", author: "Venetia Brooks", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },

  // Amazon Category
  { text: "Amazon FBA success rate improved dramatically. Better quality suppliers equals better customer ratings.", author: "Walter Hughes", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The ungating guides helped me get category approval faster than expected. Great resource.", author: "Xenia Park", location: "United Kingdom", rating: 5, category: "Amazon", role: "Online Reseller" },

  // eBay Category
  { text: "eBay business consistency improved 10x. Suppliers deliver on their promises.", author: "Yasmine Hall", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "Never had a quality issue with eBay inventory from WholesaleUp suppliers.", author: "Zeke Murphy", location: "United United States", rating: 5, category: "eBay", role: "eBay Seller" },

  // Deals Category
  { text: "The Premium membership features are genuinely valuable. Exclusive deals worth the cost alone.", author: "Abigail Carter", location: "United Kingdom", rating: 5, category: "Deals", role: "Premium Member" },
  { text: "Combo membership bundled the tools I actually use. No bloatware, just what sellers need.", author: "Barnaby Stone", location: "United Kingdom", rating: 5, category: "Deals", role: "Premium Member" },

  // Sourcing Category
  { text: "Helping my wife source beauty products. The platform is user-friendly for both of us.", author: "Cassidy Hayes", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Beauty Products Reseller" },
  { text: "Found a niche wholesaler for toys that supplies me directly now. Platform introduction was valuable.", author: "Dominic Shaw", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Toy Reseller" },

  // Support Category
  { text: "Response time from support has been consistently excellent. Never waited more than 4 hours.", author: "Edith Coleman", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },
  { text: "The community forum advice saved me from several costly mistakes. Invaluable resource.", author: "Felix Thomson", location: "United Kingdom", rating: 5, category: "Support", role: "Wholesale Reseller" },

  // Beginners Category
  { text: "My teenage daughter is now reselling thanks to WholesaleUp's beginner-friendly approach.", author: "Grace Fisher", location: "United Kingdom", rating: 5, category: "Beginners", role: "Family Business Owner" },
  { text: "Zero prior business experience and I'm running a thriving wholesale operation. Excellent platform.", author: "Henry Nash", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },

  // Suppliers Category
  { text: "The supplier ranking system actually helps. High-rated suppliers are consistently good.", author: "Iris Washington", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },
  { text: "Supplier communication improved my entire supply chain. Vetted contacts are much more professional.", author: "Jacob Pierce", location: "United Kingdom", rating: 5, category: "Suppliers", role: "Quality-Focused Buyer" },

  // Deals Category
  { text: "Deal alerts have genuinely changed my profit margins. Catching bulk sales early.", author: "Katrina Edwards", location: "United Kingdom", rating: 5, category: "Deals", role: "Deal Hunter" },
  { text: "The premium deal access is worth every penny. Margins on exclusive deals are phenomenal.", author: "Liam Robinson", location: "United Kingdom", rating: 5, category: "Deals", role: "Online Reseller" },

  // Sourcing Category
  { text: "Sourcing help for a very specific product type. Team delivered contacts and market research.", author: "Melissa Ward", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Product Sourcer" },
  { text: "Custom sourcing requests are taken seriously. Got genuine results, not just generic suggestions.", author: "Nathan Bennett", location: "United States", rating: 5, category: "Sourcing", role: "Product Sourcer" },

  // Support Category
  { text: "Support team is knowledgeable about supply chain issues. Real experts, not just customer service reps.", author: "Olivia Knight", location: "United Kingdom", rating: 5, category: "Support", role: "Wholesale Buyer" },
  { text: "The onboarding support was personal and thorough. Made me feel valued from day one.", author: "Parker Shaw", location: "United Kingdom", rating: 5, category: "Support", role: "New Reseller" },

  // Beginners Category
  { text: "Complete beginner guide walked me through everything. I started selling within a week.", author: "Quinn Mitchell", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },
  { text: "The beginner testimonials section gave me confidence. Seeing others' success paths was inspiring.", author: "Ruby Thompson", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },

  // Tools Category
  { text: "Integration with my spreadsheets is seamless. Data export is incredibly comprehensive.", author: "Samuel Grant", location: "United Kingdom", rating: 5, category: "Tools", role: "Operations Manager" },
  { text: "The margin calculator accuracy is spot on. Helps me price competitively every single time.", author: "Tiffany Walsh", location: "United Kingdom", rating: 5, category: "Tools", role: "Online Retailer" },

  // Dropshipping Category
  { text: "Dropshipping suppliers here have better communication than traditional wholesalers I've used.", author: "Ulrich Sanders", location: "Germany", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "My Shopify store stock rotates monthly from WholesaleUp dropshipping partners. System is perfect.", author: "Vanessa Mills", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Shopify Store Owner" },

  // Liquidation Category
  { text: "Liquidation alerts helped me snap up a massive toy haul for 50% off retail.", author: "Warren Brooks", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "The overstock supplier section is where I get my best daily deals. Never runs dry.", author: "Xandra Foster", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },

  // Amazon Category
  { text: "Amazon FBA profitability hit 45% margins last month. Supplier quality is consistent.", author: "Yuri Tanaka", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The Amazon ungating resources saved me 3 months of research. Very detailed and current.", author: "Zara King", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon Seller" },

  // eBay Category
  { text: "eBay seller community here helped me troubleshoot logistics issues. Genuine peer support.", author: "Adrian Murphy", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "My eBay feedback score is 99.2% thanks to quality suppliers from this platform.", author: "Bella Shaw", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },

  // Deals Category
  { text: "The deal notification frequency is perfect. Getting 3-4 quality alerts daily.", author: "Chester Blake", location: "United Kingdom", rating: 5, category: "Deals", role: "Deal Hunter" },
  { text: "Bulk purchasing power combined with WholesaleUp deals. Margins have never been better.", author: "Dorothy Powell", location: "United Kingdom", rating: 5, category: "Deals", role: "Deal Hunter" },

  // Sourcing Category
  { text: "The supplier introduction service connected me with a manufacturer I still use today.", author: "Elliott Gray", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Supply Chain Builder" },
  { text: "Sourcing team understood my vision and found partners who share my business values.", author: "Fiona Hayes", location: "United Kingdom", rating: 5, category: "Sourcing", role: "Product Sourcer" },

  // Support Category
  { text: "Support helped me navigate supplier payment terms. Negotiation guidance was invaluable.", author: "Gregory Walsh", location: "United Kingdom", rating: 5, category: "Support", role: "Wholesale Buyer" },
  { text: "The FAQ section answers 90% of my questions before I even need to contact them.", author: "Helena Brown", location: "United Kingdom", rating: 5, category: "Support", role: "Online Reseller" },

  // Beginners Category
  { text: "Started with no prior knowledge in January, running at £4K monthly by June.", author: "Ivan Foster", location: "United Kingdom", rating: 5, category: "Beginners", role: "Wholesale Entrepreneur" },
  { text: "Beginner pathway was so logical and well-structured. Every step built on the previous.", author: "Joanna Mills", location: "United Kingdom", rating: 5, category: "Beginners", role: "New Reseller" },

  // Tools Category
  { text: "Price history tool shows me when suppliers typically run their best promotions.", author: "Kyle Richardson", location: "United Kingdom", rating: 5, category: "Tools", role: "Wholesale Buyer" },
  { text: "The comparison spreadsheet tool is a real time-saver for supplier evaluation.", author: "Lauren Mitchell", location: "United Kingdom", rating: 5, category: "Tools", role: "Wholesale Buyer" },

  // Dropshipping Category
  { text: "Dropshipping with 7-day return window from suppliers. Customer satisfaction is key.", author: "Marcus Johnson", location: "United Kingdom", rating: 5, category: "Dropshipping", role: "Dropshipper" },
  { text: "Facebook Marketplace reselling supplied entirely through WholesaleUp dropshippers. Brilliant.", author: "Nadine Clarke", location: "United States", rating: 5, category: "Dropshipping", role: "Marketplace Reseller" },

  // Liquidation Category
  { text: "Found a liquidation supplier doing 30% markdowns on new stock every Friday.", author: "Oscar Bennett", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },
  { text: "Bulk overstock deals from high street retailers. Where else would you find this?", author: "Patricia Wells", location: "United Kingdom", rating: 5, category: "Liquidation", role: "Liquidation Buyer" },

  // Amazon Category
  { text: "FBA profitability improved when I switched to verified suppliers from this platform.", author: "Quincy Shaw", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon FBA Seller" },
  { text: "The Amazon seller education resources are genuinely comprehensive. Better than courses I've paid for.", author: "Rachel Stone", location: "United Kingdom", rating: 5, category: "Amazon", role: "Amazon Seller" },

  // eBay Category
  { text: "eBay consistency increased dramatically. Supplier reliability is exceptional.", author: "Samuel Grant", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },
  { text: "My eBay shop feedback improved after switching to WholesaleUp suppliers. Quality matters.", author: "Tessa Mills", location: "United Kingdom", rating: 5, category: "eBay", role: "eBay Seller" },

  // Service Category
  { text: "Just renewed my annual membership without hesitation. Best investment for my business.", author: "Ulrich Hayes", location: "Austria", rating: 5, category: "Service", role: "Premium Member" },
  { text: "Tried cancelling once and they offered me a discounted rate. That's customer service.", author: "Victoria Park", location: "United Kingdom", rating: 5, category: "Service", role: "Online Reseller" },
];
