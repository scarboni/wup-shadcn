/**
 * FAQ data with keyword mappings for contact form deflection.
 *
 * Each FAQ has:
 *   - id: unique identifier
 *   - category: general | buyer | supplier
 *   - q: the question text
 *   - a: the answer text
 *   - keywords: weighted terms — { term: weight }
 *     Higher weight = stronger signal. Combine subject + message text,
 *     tokenize, sum weights of matched keywords, return top results above threshold.
 *
 * 🔧 PRODUCTION: Migrate to database table (FAQ model) with admin CMS.
 *    Consider adding click-through analytics (was FAQ helpful? did user still submit?).
 */

const FAQ_DATA = [
  /* ── General ── */
  {
    id: "gen-1",
    category: "general",
    q: "What is WholesaleUp?",
    a: "WholesaleUp is the Web's largest database of verified wholesale suppliers, liquidators and dropshippers from the EU, UK and North America. We connect retailers with verified suppliers across 40+ product categories, providing access to thousands of wholesale deals, supplier contact details, and sourcing tools.",
    keywords: { "what": 1, "wholesaleup": 3, "about": 2, "directory": 2, "platform": 2, "who": 1, "company": 1 },
  },
  {
    id: "gen-2",
    category: "general",
    q: "Is WholesaleUp free to use?",
    a: "Buyers can access premium supplier listings for free. We also offer premium services for both buyers and suppliers across four tiers — Standard, Premium, Premium+ and Supplier Pro — each unlocking additional features such as full supplier databases, unlimited enquiries, custom sourcing support, and enhanced listing visibility.",
    keywords: { "free": 4, "cost": 3, "price": 2, "pricing": 3, "how much": 3, "charge": 3, "pay": 3, "fee": 3, "money": 2, "membership": 2, "tier": 2, "plan": 2 },
  },
  {
    id: "gen-3",
    category: "general",
    q: "How do I create an account?",
    a: "Click the 'Join Free' button on any page to register. You'll need a valid email address and basic business information. Registration takes less than 2 minutes.",
    keywords: { "create": 2, "account": 3, "register": 4, "sign up": 4, "signup": 4, "join": 3, "new account": 4, "registration": 4 },
  },
  {
    id: "gen-4",
    category: "general",
    q: "What countries do you cover?",
    a: "We list suppliers from over 150 countries including the UK, Germany, Netherlands, Poland, Spain, Italy, France, and the USA. Most suppliers ship internationally and many offer dropshipping.",
    keywords: { "country": 3, "countries": 3, "international": 3, "ship": 2, "shipping": 2, "deliver": 2, "delivery": 2, "uk": 2, "usa": 2, "europe": 2, "worldwide": 3, "location": 2, "region": 2 },
  },

  /* ── Buyer ── */
  {
    id: "buy-1",
    category: "buyer",
    q: "How do I contact a supplier?",
    a: "Free and Standard buyers can contact premium suppliers free of charge. Standard buyers can also contact suppliers with listed deals via the deal listings. Premium buyers get full access to contact all suppliers from deal listings, supplier profiles, and search pages. Premium+ members enjoy all Premium benefits plus unlimited enquiries and saved keyword searches.",
    keywords: { "contact": 3, "supplier": 2, "message": 2, "reach": 2, "phone": 2, "email": 1, "talk": 2, "speak": 2, "call": 2 },
  },
  {
    id: "buy-2",
    category: "buyer",
    q: "Are the deals genuine?",
    a: "All suppliers undergo a verification process before being listed. We display a 'Verified Supplier' badge on suppliers who have passed our checks. However, we recommend conducting your own due diligence before placing orders.",
    keywords: { "genuine": 4, "real": 3, "fake": 4, "scam": 5, "trust": 3, "verified": 3, "legitimate": 4, "legit": 4, "safe": 2, "reliable": 3, "authentic": 3 },
  },
  {
    id: "buy-3",
    category: "buyer",
    q: "Can I negotiate prices?",
    a: "Yes! Many deals are marked as 'Negotiable'. You can use the contact form to reach out to suppliers and discuss pricing, MOQs, and shipping arrangements directly.",
    keywords: { "negotiate": 5, "negotiable": 5, "discount": 3, "cheaper": 3, "moq": 4, "minimum order": 4, "bulk": 2, "bargain": 3, "lower price": 3 },
  },
  {
    id: "buy-4",
    category: "buyer",
    q: "What if I have a problem with a supplier?",
    a: "If you experience any issues with a supplier, please contact our support team using the form on this page. We take reports seriously and may remove suppliers who don't meet our standards.",
    keywords: { "problem": 4, "issue": 3, "complaint": 5, "complain": 5, "report": 3, "bad": 2, "wrong": 2, "dispute": 4, "refund": 3, "return": 2, "unhappy": 3, "poor": 2 },
  },

  /* ── Supplier ── */
  {
    id: "sup-1",
    category: "supplier",
    q: "How do I list my company?",
    a: "Select 'Listing My Company' from the contact form dropdown on this page and fill in your company details. Our team will review your application and get back to you within 24 hours.",
    keywords: { "list": 4, "listing": 5, "add": 2, "company": 2, "business": 2, "become": 3, "supplier": 2, "sell": 3, "seller": 3, "vendor": 3, "partner": 2 },
  },
  {
    id: "sup-2",
    category: "supplier",
    q: "What are the requirements to be listed?",
    a: "We require a valid company registration, a professional website, and the ability to supply products at genuine wholesale prices. We verify all supplier information before listing.",
    keywords: { "requirement": 5, "requirements": 5, "criteria": 4, "qualify": 4, "eligible": 3, "eligibility": 3, "need": 2, "needed": 2, "approval": 3, "approved": 3, "verification": 3 },
  },
  {
    id: "sup-3",
    category: "supplier",
    q: "Is there a fee to be listed as a supplier?",
    a: "Basic supplier listings are free. We also offer premium supplier packages with enhanced visibility, priority placement, and featured listing options. Contact us for pricing.",
    keywords: { "fee": 4, "cost": 3, "supplier fee": 5, "listing fee": 5, "listing cost": 5, "supplier cost": 5, "free listing": 4, "premium listing": 4, "featured": 3, "visibility": 2, "promoted": 2 },
  },
  {
    id: "sup-4",
    category: "supplier",
    q: "How do I manage my deals?",
    a: "Once your company is approved, you'll receive access to a supplier dashboard where you can add, edit, and manage your deals, update company information, and respond to buyer enquiries.",
    keywords: { "manage": 3, "dashboard": 4, "edit deal": 4, "update deal": 4, "add deal": 4, "my deals": 4, "supplier dashboard": 5, "control panel": 3 },
  },

  /* ── Account & Billing ── */
  {
    id: "acc-1",
    category: "general",
    q: "How do I reset my password?",
    a: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a password reset link that expires in 24 hours.",
    keywords: { "password": 5, "reset": 4, "forgot": 4, "forgotten": 4, "login": 2, "can't log in": 4, "locked out": 4, "access": 2, "recover": 3 },
  },
  {
    id: "acc-2",
    category: "general",
    q: "How do I upgrade my membership?",
    a: "Visit the Pricing page or your Account Dashboard to view available plans. You can upgrade from Free to Premium at any time. Payment is processed securely via Stripe.",
    keywords: { "upgrade": 5, "premium": 4, "pro": 3, "plan": 2, "membership": 3, "subscribe": 4, "subscription": 4, "payment": 3, "stripe": 2, "billing": 2, "cancel": 2 },
  },
  {
    id: "acc-3",
    category: "general",
    q: "How do I delete my account?",
    a: "To delete your account, please contact our support team using this form. Account deletion is permanent and removes all your data, saved deals, and supplier contacts.",
    keywords: { "delete": 5, "remove": 3, "close": 3, "deactivate": 4, "account deletion": 5, "gdpr": 4, "data": 2, "privacy": 2, "personal data": 3 },
  },
];

/**
 * Match FAQs against user input text.
 * Combines subject + message, tokenizes, scores against keyword weights.
 *
 * @param {string} subject - Form subject field
 * @param {string} message - Form message field
 * @param {object} options - { threshold: number, maxResults: number }
 * @returns {{ id, category, q, a, score }[]}
 */
function matchFAQs(subject = "", message = "", { threshold = 3, maxResults = 3 } = {}) {
  const text = `${subject} ${message}`.toLowerCase();
  if (text.trim().length < 3) return [];

  const scored = FAQ_DATA.map((faq) => {
    let score = 0;
    for (const [keyword, weight] of Object.entries(faq.keywords)) {
      // Multi-word keywords: check as phrase
      if (keyword.includes(" ")) {
        if (text.includes(keyword)) score += weight;
      } else {
        // Single-word: match as word boundary
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (regex.test(text)) score += weight;
      }
    }
    return { id: faq.id, category: faq.category, q: faq.q, a: faq.a, score };
  });

  return scored
    .filter((f) => f.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

export { FAQ_DATA, matchFAQs };
