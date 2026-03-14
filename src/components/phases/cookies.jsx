"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  Cookie,
  Printer,
  Settings,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  Timer,
  RefreshCw,
  Mail,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import BackToTopButton from "@/components/shared/back-to-top";

/* ═══════════════════════════════════════
   COOKIES POLICY DATA
   ═══════════════════════════════════════ */
const EFFECTIVE_DATE = "1st March 2025";

const SECTIONS = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies",
    icon: Cookie,
    content: [
      {
        clause: "1.1",
        text: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. Cookies help websites work more efficiently and provide information to site owners about how visitors use the site.",
      },
      {
        clause: "1.2",
        text: "We use cookies and similar tracking technologies to improve your browsing experience, analyse site traffic, and understand where our visitors are coming from. By continuing to use our site, you consent to our use of cookies in accordance with this policy.",
      },
    ],
  },
  {
    id: "types-of-cookies",
    title: "Types of Cookies We Use",
    icon: SlidersHorizontal,
    content: [
      {
        clause: "2.1",
        subtitle: "Strictly Necessary Cookies (Essential \u2013 No Consent Required)",
        text: "These cookies are essential to operate our website. They enable basic functionality such as page navigation, login access, and secure areas. The website cannot function properly without these cookies, and they cannot be disabled.",
      },
      {
        clause: "2.2",
        subtitle: "Functional Cookies (Optional \u2013 Consent Required)",
        text: "These cookies remember user preferences and past browsing behaviour to provide enhanced, more personalised features. For example, we may prioritise results based on your favourite categories or browsing history.",
      },
      {
        clause: "2.3",
        subtitle: "Analytics Cookies (Optional \u2013 Consent Required)",
        text: "These cookies help us understand how users interact with our website. We use Google Analytics to track anonymous website usage statistics, including pages visited and user flows. Google Analytics data may be processed on Google's servers in the United States, and we apply appropriate safeguards such as Standard Contractual Clauses.",
      },
      {
        clause: "2.4",
        subtitle: "Targeting and Advertising Cookies (Optional \u2013 Consent Required)",
        text: "These cookies are used to deliver advertising relevant to you and your interests. They also help measure the effectiveness of our advertising campaigns. We use Google Ads and Facebook Ads, delivered via Google Tag Manager. These cookies are only activated after obtaining your explicit consent.",
      },
    ],
  },
  {
    id: "manage-consent",
    title: "How We Obtain and Manage Your Consent",
    icon: ShieldCheck,
    content: [
      {
        clause: "3.1",
        text: 'We use a cookie banner to request your consent before any non-essential cookies are set. You are presented with the following options: "Accept All Cookies", "Accept Only Essential Cookies", and "Cookie Settings" \u2013 where you can manage individual cookie categories.',
      },
      {
        clause: "3.2",
        text: 'You may update or withdraw your consent at any time by clicking on the "Cookie Settings" link in the footer of our website. This will reopen the preferences panel, allowing you to change your choices.',
      },
      {
        clause: "3.3",
        text: "We use opt-in consent for all non-essential cookies and trackers. You will be asked to provide explicit consent before we place non-essential cookies. You may update your preferences at any time via our cookie settings panel.",
      },
    ],
  },
  {
    id: "control-cookies",
    title: "How to Control Cookies",
    icon: Settings,
    content: [
      {
        clause: "4.1",
        text: "You can control cookies in the following ways: use our Cookie Settings panel to select or deselect cookie categories.",
      },
      {
        clause: "4.2",
        text: "Adjust your browser settings to block or delete cookies. Most browsers allow you to refuse or accept cookies, delete existing cookies, and set preferences for certain websites.",
      },
      {
        clause: "4.3",
        text: "Use browser tools such as Do Not Track or Incognito/Private Mode to limit tracking while browsing.",
      },
      {
        clause: "4.4",
        text: "Opt out of targeted advertising using: Google Ads Settings (ads.google.com/settings), Facebook Ad Preferences (facebook.com/ads/preferences), or the Network Advertising Initiative opt-out page (optout.networkadvertising.org).",
      },
      {
        clause: "4.5",
        text: "Please note: Disabling cookies may affect certain functionality, but essential services will remain accessible.",
      },
    ],
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    icon: Globe,
    content: [
      {
        clause: "5.1",
        text: "Some of our analytics and advertising cookies may involve transferring data outside the EEA/UK. For example, Google Analytics data may be processed on Google's servers in the United States.",
      },
      {
        clause: "5.2",
        text: "We ensure such transfers are protected by appropriate safeguards, including Standard Contractual Clauses approved by the EU and UK regulators.",
      },
    ],
  },
  {
    id: "consent-duration",
    title: "Cookie Consent Duration",
    icon: Timer,
    content: [
      {
        clause: "6.1",
        text: "We will remember your cookie preferences for 90 days from the date you provide or update your choices. After that, you may be prompted to reconfirm your preferences.",
      },
      {
        clause: "6.2",
        text: "You can change your cookie preferences at any time before the 90-day period expires by using the Cookie Settings link in the footer of our website.",
      },
    ],
  },
  {
    id: "changes-policy",
    title: "Changes to This Cookie Policy",
    icon: RefreshCw,
    content: [
      {
        clause: "7.1",
        text: "We may update this policy from time to time to reflect changes to the cookies we use or legal requirements. Any updates will be posted on this page with an updated effective date.",
      },
      {
        clause: "7.2",
        text: "We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.",
      },
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    icon: Mail,
    content: [
      {
        clause: "8.1",
        text: "For questions about this Cookie Policy or our data protection practices, contact us at: WholesaleUp Ltd., 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.",
      },
      {
        clause: "8.2",
        text: "You may also reach us by email via the contact form on our website or by writing to our Data Protection Officer at the address above.",
      },
    ],
  },
];

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function CookiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const sectionRefs = useRef({});

  /* ── Filter sections by search ── */
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.map((section) => {
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchedContent = section.content.filter(
        (item) =>
          item.text.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
      if (matchTitle) return section;
      if (matchedContent.length > 0)
        return { ...section, content: matchedContent };
      return null;
    }).filter(Boolean);
  }, [searchQuery]);

  /* ── Scroll-based active TOC tracking ── */
  useEffect(() => {
    const handleScroll = () => {
      const headerOffset = 130;
      let current = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = sectionRefs.current[section.id];
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= headerOffset) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredSections]);


  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const highlightText = (text) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ══════════ Hero ══════════ */}
      <section className="relative overflow-hidden">
        {/* Layer 1: Solid blue gradient — identical to /register, /contact, /testimonials */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]" />
        {/* Layer 2: Greyscale photo blended as subtle texture */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "grayscale(1)", mixBlendMode: "luminosity" }} />
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRight size={12} />
            <span className="text-white/90 font-medium">Cookies Policy</span>
          </nav>

          <div className="max-w-4xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <Cookie size={13} /> Cookie Policy
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Cookies Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Learn how we use cookies and similar technologies to improve your
              experience on WholesaleUp.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Effective Date: {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ Content area ══════════ */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search toolbar — above both columns so they align */}
        <div className="flex items-center gap-3 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search cookie policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
          {searchQuery.trim() && (
            <span className="hidden sm:block text-xs text-slate-400 whitespace-nowrap">
              {filteredSections.length} of {SECTIONS.length} sections
            </span>
          )}
        </div>

        {/* Layout: Collapsible TOC Sidebar + Content */}
        <div className="flex gap-6 items-start">

          {/* ── Collapsible TOC sidebar (desktop) ── */}
          <div className="hidden lg:block relative shrink-0 sticky top-[115px] self-start">
            <div className={`max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 ease-in-out ${tocCollapsed ? "w-0" : "w-72"}`}>
              <div className="w-72">
                {/* Sidebar panel */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 pb-4 pt-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                    Cookies Policy
                  </h3>
                  <nav className="space-y-0.5">
                    {SECTIONS.map((section, idx) => {
                      const isActive = activeSection === section.id;
                      const isFiltered =
                        searchQuery.trim() &&
                        !filteredSections.find((s) => s.id === section.id);
                      return (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          disabled={isFiltered}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-start gap-2.5 ${
                            isFiltered
                              ? "opacity-30 cursor-not-allowed text-slate-400"
                              : isActive
                              ? "bg-orange-50 text-orange-600 font-semibold border-l-2 border-orange-500"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          <span className="text-slate-400 text-xs w-5 text-right shrink-0 font-medium mt-0.5">
                            {idx + 1}.
                          </span>
                          <span className="leading-snug">{section.title}</span>
                          {isActive && (
                            <ChevronRight size={12} className="ml-auto text-orange-400 shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
            {/* Toggle button */}
            <button
              onClick={() => setTocCollapsed(!tocCollapsed)}
              className={`absolute top-[52px] w-4 h-14 bg-orange-600 hover:bg-orange-500 rounded-r-lg flex items-center justify-center transition-all z-10 ${
                tocCollapsed ? "left-0 shadow-[2px_2px_4px_rgba(0,0,0,0.2)]" : "-right-3"
              }`}
              title={tocCollapsed ? "Show table of contents" : "Hide table of contents"}
            >
              <ChevronDown size={14} className={`text-white transition-transform ${tocCollapsed ? "-rotate-90" : "rotate-90"}`} />
            </button>
          </div>

          {/* ── Main content (full width) ── */}
          <div className="flex-1 min-w-0">
            {/* Sections */}
            {filteredSections.length === 0 ? (
              <div className="text-center py-20">
                <Search size={44} className="text-slate-200 mx-auto mb-3" />
                <p className="text-lg text-slate-500 font-semibold">No matching sections found</p>
                <p className="text-sm text-slate-400 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="space-y-10 pt-1">
                {filteredSections.map((section) => {
                  const Icon = section.icon;
                  const sectionIdx = SECTIONS.findIndex((s) => s.id === section.id);
                  return (
                    <section
                      key={section.id}
                      id={section.id}
                      ref={(el) => (sectionRefs.current[section.id] = el)}
                      className="scroll-mt-28"
                    >
                      {/* Section header */}
                      <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-slate-200">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                          <Icon size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                            Section {sectionIdx + 1}
                          </span>
                          <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                            {highlightText(section.title)}
                          </h2>
                        </div>
                      </div>

                      {/* Clauses */}
                      <div className="space-y-4 pl-0 sm:pl-3">
                        {section.content.map((item) => (
                          <div
                            key={item.clause}
                            className="group relative bg-white rounded-xl border border-slate-100 p-5 sm:p-6 hover:border-slate-200 transition-colors"
                          >
                            <div className="flex gap-4">
                              <span className="text-sm font-bold text-slate-300 mt-0.5 shrink-0 w-9 text-right">
                                {item.clause}
                              </span>
                              <div className="flex-1 min-w-0">
                                {item.subtitle && (
                                  <h3 className="text-base font-bold text-slate-800 mb-1.5">
                                    {highlightText(item.subtitle)}
                                  </h3>
                                )}
                                <p className="text-[15px] text-slate-600 leading-relaxed">
                                  {highlightText(item.text)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {/* Footer note */}
            {!searchQuery && (
              <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200 text-center">
                <FileText size={22} className="text-slate-400 mx-auto mb-2" />
                <p className="text-base text-slate-500">
                  Last updated: {EFFECTIVE_DATE}. If you have questions about our cookie practices, please{" "}
                  <a href="/contact" className="text-orange-500 font-semibold hover:underline">
                    contact us
                  </a>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ══════════ CTA Banner ══════════ */}
        <CtaBanner className="mt-10" />
      </div>

      {/* ══════════ Back to top ══════════ */}
      <BackToTopButton />
    </div>
  );
}
