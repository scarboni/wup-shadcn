"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  Shield,
  Printer,
  Database,
  Eye,
  Scale,
  Share2,
  Cookie,
  Globe,
  Timer,
  Lock,
  UserCheck,
  RefreshCw,
  Mail,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import BackToTopButton from "@/components/shared/back-to-top";

/* ═══════════════════════════════════════
   PRIVACY POLICY DATA
   ═══════════════════════════════════════ */
const EFFECTIVE_DATE = "1st March 2025";

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    icon: Database,
    content: [
      {
        clause: "1.1",
        subtitle: "Identity Data",
        text: "Name and surname.",
      },
      {
        clause: "1.2",
        subtitle: "Contact Data",
        text: "Email address, postal address, telephone number.",
      },
      {
        clause: "1.3",
        subtitle: "Demographic Data",
        text: "Preferences, interests, postcode, and related information.",
      },
      {
        clause: "1.4",
        subtitle: "Transactional Data",
        text: "Records of products or services you have purchased or accessed.",
      },
      {
        clause: "1.5",
        subtitle: "Technical Data",
        text: "IP address, browser type, cookies, and usage data collected via tracking technologies.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    icon: Eye,
    content: [
      {
        clause: "2.1",
        text: "To provide and manage your access to our services (Contract).",
      },
      {
        clause: "2.2",
        text: "To improve our website, products, and services (Legitimate Interests).",
      },
      {
        clause: "2.3",
        text: "To personalise newsletters, browsing experience, and product recommendations (Consent).",
      },
      {
        clause: "2.4",
        text: "To send you promotional emails, special offers, and updates (Consent or Legitimate Interests, where applicable).",
      },
    ],
  },
  {
    id: "legal-bases",
    title: "Legal Bases for Processing",
    icon: Scale,
    content: [
      {
        clause: "3.1",
        subtitle: "Consent",
        text: "For marketing communications and use of non-essential cookies or personalised advertising.",
      },
      {
        clause: "3.2",
        subtitle: "Contract",
        text: "Where processing is necessary to provide our service to you.",
      },
      {
        clause: "3.3",
        subtitle: "Legitimate Interests",
        text: "For internal analytics, service improvement, and customer relationship management.",
      },
      {
        clause: "3.4",
        subtitle: "Legal Obligation",
        text: "Where required to comply with legal or regulatory duties.",
      },
    ],
  },
  {
    id: "sharing-your-data",
    title: "Sharing Your Data",
    icon: Share2,
    content: [
      {
        clause: "4.1",
        subtitle: "Service Providers (Data Processors)",
        text: "Such as payment processors, email platforms, web hosting, analytics, and IT support under GDPR-compliant terms.",
      },
      {
        clause: "4.2",
        subtitle: "Legal Authorities",
        text: "If required by law, court order, or regulatory obligation.",
      },
      {
        clause: "4.3",
        text: "We do not sell, rent, or lease your personal data to third parties.",
      },
    ],
  },
  {
    id: "cookies-and-tracking",
    title: "Cookies and Tracking",
    icon: Cookie,
    content: [
      {
        clause: "5.1",
        text: "We use cookies to enable website functionality and analyse traffic and usage patterns.",
      },
      {
        clause: "5.2",
        text: "We use opt-in consent for all non-essential cookies and trackers. You will be asked to provide explicit consent before we place non-essential cookies. You may update your preferences at any time via our cookie settings panel.",
      },
      {
        clause: "5.3",
        text: "More information is available in our Cookie Policy.",
      },
    ],
  },
  {
    id: "data-transfers",
    title: "Data Transfers Outside the EEA/UK",
    icon: Globe,
    content: [
      {
        clause: "6.1",
        text: "If we transfer your personal data outside the European Economic Area (EEA) or UK (e.g., to our service providers in the US), we use appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission and UK Information Commissioner.",
      },
      {
        clause: "6.2",
        text: "Copies of these clauses are available upon request.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    icon: Timer,
    content: [
      {
        clause: "7.1",
        text: "We retain your personal data for as long as your registered email remains valid.",
      },
      {
        clause: "7.2",
        text: "For the duration of our service offering.",
      },
      {
        clause: "7.3",
        text: "Or until you request its deletion.",
      },
      {
        clause: "7.4",
        text: "We periodically review and securely delete data that is no longer required.",
      },
    ],
  },
  {
    id: "security",
    title: "Security of Your Data",
    icon: Lock,
    content: [
      {
        clause: "8.1",
        text: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. However, no method of transmission over the internet or electronic storage is 100% secure.",
      },
      {
        clause: "8.2",
        text: "We cannot guarantee absolute security, but we do our best to safeguard your data using industry-standard practices.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    icon: UserCheck,
    content: [
      {
        clause: "9.1",
        text: "Right to access your data.",
      },
      {
        clause: "9.2",
        text: "Right to rectify inaccurate data.",
      },
      {
        clause: "9.3",
        text: 'Right to erase your data ("right to be forgotten").',
      },
      {
        clause: "9.4",
        text: "Right to restrict processing.",
      },
      {
        clause: "9.5",
        text: "Right to data portability.",
      },
      {
        clause: "9.6",
        text: "Right to object to processing (including direct marketing).",
      },
      {
        clause: "9.7",
        text: "Right to withdraw consent at any time (where processing is based on consent).",
      },
      {
        clause: "9.8",
        text: "Right to lodge a complaint with a supervisory authority.",
      },
      {
        clause: "9.9",
        text: "If you believe we have not adequately addressed your concern, you have the right to lodge a complaint with: The Spanish Data Protection Authority (AEPD) at www.aepd.es, The UK Information Commissioner's Office (ICO) at www.ico.org.uk, or any other competent data protection authority in the EU/EEA.",
      },
    ],
  },
  {
    id: "changes-to-policy",
    title: "Changes to this Policy",
    icon: RefreshCw,
    content: [
      {
        clause: "10.1",
        text: 'We may update this Privacy Policy periodically. Updates will be posted on this page with an updated "Effective Date." If we make material changes, we will notify you via email or through a prominent notice on our website.',
      },
    ],
  },
  {
    id: "contact-us",
    title: "Contact Us",
    icon: Mail,
    content: [
      {
        clause: "11.1",
        text: "To exercise your rights or for privacy-related inquiries, please contact us at: WholesaleUp Ltd., 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.",
      },
      {
        clause: "11.2",
        text: "You may also reach us by email via the contact form on our website or by writing to our Data Protection Officer at the address above.",
      },
    ],
  },
];

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function PrivacyPage() {
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
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "grayscale(1)", mixBlendMode: "luminosity" }} />
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRight size={12} />
            <span className="text-white/90 font-medium">Privacy Policy</span>
          </nav>

          <div className="max-w-4xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <Shield size={13} /> Data Protection
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              WholesaleUp is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and protect your personal data when you use our website and services.
            </p>
            <p className="text-sm text-slate-400 mt-4">
              Effective Date: {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ GDPR intro banner ══════════ */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <Shield size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed">
            We comply with the General Data Protection Regulation (EU GDPR), the UK GDPR, and the Privacy and Electronic Communications Regulations (PECR), as applicable.
          </p>
        </div>
      </div>

      {/* ══════════ Content area ══════════ */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Search toolbar */}
        <div className="flex items-center gap-3 mb-6 bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search privacy policy..."
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
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 pb-4 pt-5">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                    Privacy Policy
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
                  Last updated: {EFFECTIVE_DATE}. If you have questions about our privacy practices, please{" "}
                  <a href="/contact" className="text-orange-500 font-semibold hover:underline">
                    contact us
                  </a>. You can also review our{" "}
                  <a href="/cookies" className="text-orange-500 font-semibold hover:underline">
                    Cookie Policy
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
