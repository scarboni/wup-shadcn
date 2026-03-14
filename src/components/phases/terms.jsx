"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  ShieldCheck,
  Scale,
  ScrollText,
  Link2,
  AlertTriangle,
  Lock,
  Gavel,
  Copyright,
  Printer,
  BookOpen,
  Users,
  ShieldAlert,
  DatabaseZap,
  UserCheck,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import BackToTopButton from "@/components/shared/back-to-top";

/* ═══════════════════════════════════════
   TERMS DATA
   ═══════════════════════════════════════ */
const EFFECTIVE_DATE = "1st March 2025";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    icon: BookOpen,
    content: [
      {
        clause: "1.1",
        text: 'These Terms and Conditions (the "Terms of Use") constitute a legally binding agreement between you ("you" or the "User"), who may be a business entity or a sole trader, and "WholesaleUp", referred to herein as "us" or "we".',
      },
      {
        clause: "1.2",
        text: "By accessing our services from within the UK or the EU, you confirm that you represent a VAT-registered business entity or sole trader. We reserve the right to request verification of VAT registration details from UK or EU Users at any time. If satisfactory evidence cannot be provided, accounts may be suspended or terminated without refund.",
      },
      {
        clause: "1.3",
        text: "The section titles in these Terms of Use are for convenience only and have no legal or contractual effect. If any provision of these Terms of Use is held to be invalid or unenforceable for any reason, the remaining provisions shall, to the maximum extent possible, remain in full force and effect.",
      },
      {
        clause: "1.4",
        text: "Your use of this website and any disputes arising from its use are subject to the laws of England and Wales. You agree to the exclusive jurisdiction of the courts of London, England.",
      },
      {
        clause: "1.5",
        text: "If you do not accept these Terms of Use in full, you must leave the site immediately. Continued use constitutes full acceptance of these Terms of Use.",
      },
      {
        clause: "1.6",
        text: "Operator. The Site is operated by WholesaleUp Ltd., a company registered in England with registered office at 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, and company registration number 12345678.",
      },
    ],
  },
  {
    id: "our-service",
    title: "Our Service",
    icon: ShieldCheck,
    content: [
      {
        clause: "2.1",
        subtitle: "Products Offered",
        text: "We offer a business-to-business (B2B) subscription-based service, providing access to our database of wholesale offers, verified suppliers, and sourcing tools. Each licence permits access to a maximum of 500 supplier websites per month.",
      },
      {
        clause: "2.2",
        subtitle: "Subscription & Payments",
        text: "All subscription plans are billed on a recurring basis (monthly, semi-annually or annually), unless explicitly stated otherwise. Payments are non-refundable upon subscription activation, except as explicitly stated herein.",
      },
      {
        clause: "2.3",
        text: "The User is responsible for managing and cancelling their active subscription if they no longer wish to renew. To cancel a subscription: if payment was made via PayPal, the User must log in to their PayPal account, navigate to My Account > Profile > My Preapproved Payments, and cancel the active WholesaleUp subscription. If payment was made by card, the User must log in to their WholesaleUp account, visit My Account > Manage Services & Billing > Purchase History, and cancel the active subscription.",
      },
      {
        clause: "2.4",
        text: "If a User subscribes but has not been able to log in at least once to their WholesaleUp account, a full refund may be issued upon request. In all other cases, refunds are granted solely at the discretion of WholesaleUp management.",
      },
      {
        clause: "2.5",
        subtitle: "Information Accuracy",
        text: "While every effort is made to ensure the accuracy of our website, some details on the site may change from time to time. We endeavour to rectify any errors, but we cannot be held responsible for any losses incurred as a result of reliance on inaccurate information.",
      },
      {
        clause: "2.6",
        subtitle: "Deals and Refunds",
        text: "When available, we offer individual Deal source purchases. We will refund the purchase if the supplier's product price is higher than listed on the Deal information page, provided the refund claim is made within 48 hours of purchase. This guarantee applies only to individual Deal source purchases, not to bundled subscriptions.",
      },
    ],
  },
  {
    id: "registered-users",
    title: "Registered Users",
    icon: Users,
    content: [
      {
        clause: "3.1",
        subtitle: "Legal Compliance",
        text: "You agree to comply with all applicable local, national, and international laws, regulations, and rules that apply to your use of this Site and any transactions conducted through it. It is your responsibility to ensure that your use of our services is lawful in your jurisdiction.",
      },
      {
        clause: "3.2",
        subtitle: "Use of Content",
        text: "Use of the content or materials of WholesaleUp for any purpose not expressly permitted in these Terms of Use is prohibited. Each User agrees not to copy, reproduce, download, or commercially exploit content from our Site. Systematic retrieval of data to create or compile a collection, database, or directory without our permission is prohibited.",
      },
      {
        clause: "3.3",
        subtitle: "Account Security",
        text: "You are responsible for keeping your password and account confidential and must not disclose them to any third party. You are solely responsible for all activities under your password or account and agree to indemnify us against claims arising from your failure to maintain confidentiality.",
      },
      {
        clause: "3.4",
        subtitle: "Registration Discretion",
        text: "At its sole discretion, WholesaleUp may refuse registration or deny issuance of an account, Username, or Password to anyone, for any reason.",
      },
      {
        clause: "3.5",
        subtitle: "Account Sharing",
        text: "The User agrees not to share the account with others. An account will be suspended for 24 hours if sharing is detected. Repeated breaches may result in permanent suspension. Each account can be accessed from only one browser type (e.g., Google Chrome, Mozilla Firefox, etc.) during any one User session.",
      },
      {
        clause: "3.6",
        subtitle: "Account Suspension or Termination",
        text: "WholesaleUp may suspend or terminate a registered User's account at any time by giving no less than 24-hour notice; however, notice is not required if there is a breach of the Terms of Use, information provided is found to be inaccurate or incomplete, fraudulent or illegal activity is suspected, or the account is used to harass, abuse, or threaten other users or staff.",
      },
    ],
  },
  {
    id: "links",
    title: "Links",
    icon: Link2,
    content: [
      {
        clause: "4.1",
        text: "This Site may contain links to external websites operated by third parties. These links are provided for your convenience only. We do not control and are not responsible for the content, privacy policies, or practices of any third-party websites.",
      },
      {
        clause: "4.2",
        text: "The inclusion of any link does not imply endorsement, sponsorship, or recommendation by WholesaleUp. You acknowledge and agree that we shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any content, goods, or services available on or through any such third-party websites.",
      },
    ],
  },
  {
    id: "warranties",
    title: "Warranties",
    icon: ShieldAlert,
    content: [
      {
        clause: "5.1",
        text: 'This Site and its content are provided "as is" and "as available" without any warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
      },
      {
        clause: "5.2",
        text: "WholesaleUp does not warrant that the Site will be uninterrupted, timely, secure, or error-free, or that defects will be corrected. We do not warrant that the results obtained from the use of the Site will be accurate or reliable.",
      },
      {
        clause: "5.3",
        text: "Any material downloaded or otherwise obtained through the use of the Site is done at your own discretion and risk. You will be solely responsible for any damage to your computer system or loss of data that results from the download of any such material.",
      },
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    icon: Scale,
    content: [
      {
        clause: "6.1",
        text: "You agree to indemnify, defend, and hold harmless WholesaleUp, its officers, directors, employees, agents, and third parties, for any losses, costs, liabilities, and expenses (including reasonable legal fees) relating to or arising out of your use of or inability to use the Site or services, any user postings made by you, your violation of any terms of this Agreement or your violation of any rights of a third party, or your violation of any applicable laws, rules or regulations.",
      },
      {
        clause: "6.2",
        text: "WholesaleUp reserves the right, at its own cost, to assume the exclusive defence and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with WholesaleUp in asserting any available defences.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: [
      {
        clause: "7.1",
        text: "In no event shall WholesaleUp, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any errors, mistakes, or inaccuracies of content, personal injury or property damage, unauthorised access to or use of our servers and/or any personal information stored therein.",
      },
      {
        clause: "7.2",
        text: "WholesaleUp shall not be liable for any bugs, viruses, trojan horses, or the like which may be transmitted to or through our Site by any third party.",
      },
      {
        clause: "7.3",
        text: "WholesaleUp shall not be liable for any interruption or cessation of transmission to or from the Site.",
      },
      {
        clause: "7.4",
        text: "In no event shall WholesaleUp be liable for any failure to comply with these Terms of Use to the extent that such failure arises from factors outside our reasonable control.",
      },
      {
        clause: "7.5",
        text: "To the maximum extent permitted by law, WholesaleUp's total liability for any claim arising out of this agreement shall not exceed the amount of fees paid by the User in the 12 months preceding the claim. WholesaleUp shall not be liable for any loss of profit, business, or indirect, special, incidental, or consequential damages.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    icon: Lock,
    content: [
      {
        clause: "8.1",
        text: "Acceptance of these Terms includes acceptance of our Privacy Policy, which governs how we protect and use your information. You can review our Privacy Policy at any time by visiting the Privacy page on our website.",
      },
    ],
  },
  {
    id: "data-protection",
    title: "Data Protection and GDPR Compliance",
    icon: DatabaseZap,
    content: [
      {
        clause: "9.1",
        text: "We comply fully with the General Data Protection Regulation (GDPR). Users must adhere strictly to GDPR when handling any personal data accessed via our Site. We process personal data as described in our Privacy Policy. Users have rights to access, correct, and request deletion of their data.",
      },
    ],
  },
  {
    id: "aml-kyc",
    title: "Anti-Money Laundering (AML) & Know Your Customer (KYC)",
    icon: UserCheck,
    content: [
      {
        clause: "10.1",
        text: "WholesaleUp may require Users to provide proof of identity and business registration documents. Accounts may be suspended or terminated if users fail to provide required information or if fraudulent or illegal activity is suspected, in compliance with UK Money Laundering Regulations 2017.",
      },
    ],
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution and Arbitration",
    icon: Gavel,
    content: [
      {
        clause: "11.1",
        text: "In the event of any dispute arising under these Terms, the parties shall first attempt to resolve the dispute amicably by contacting WholesaleUp customer support. If the dispute cannot be resolved informally, it shall be resolved by binding arbitration in London, England, in accordance with the rules of the London Court of International Arbitration (LCIA).",
      },
    ],
  },
  {
    id: "copyright",
    title: "Copyright and Intellectual Property",
    icon: Copyright,
    content: [
      {
        clause: "12.1",
        text: "This website and its content are copyright \u00A9 2004\u20132026 WholesaleUp Ltd. All rights reserved.",
      },
      {
        clause: "12.2",
        text: "All text, graphics, logos, images, and software on the Site are protected by international copyright laws and treaties. No part of this Site may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed without the prior written permission of WholesaleUp Ltd., except as expressly permitted under these Terms of Use.",
      },
      {
        clause: "12.3",
        text: "Any unauthorised use of the Site's content may violate copyright, trademark, and other applicable laws and could result in civil or criminal penalties.",
      },
      {
        clause: "12.4",
        text: "Permission requests for commercial use or other licensing should be submitted via our contact form.",
      },
    ],
  },
];

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function TermsPage() {
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
      const headerOffset = 130; // header + breathing room
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
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center 40%", filter: "grayscale(1)", mixBlendMode: "luminosity" }} />
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRight size={12} />
            <span className="text-white/90 font-medium">Terms of Use</span>
          </nav>

          <div className="max-w-4xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <ScrollText size={13} /> Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Terms of Use
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using our platform.
              By accessing WholesaleUp, you agree to be bound by these terms.
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
              placeholder="Search terms..."
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
                    Terms of Use
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
            {/* Toggle button — mimics /deals filter toggle */}
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
                                <p className="text-base text-slate-600 leading-relaxed">
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
                  Last updated: {EFFECTIVE_DATE}. If you have questions about these terms, please{" "}
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
