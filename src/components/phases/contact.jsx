"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useRecaptcha from "@/components/shared/use-recaptcha";
import { RecaptchaNotice } from "@/components/shared/auth-ui";
import { useFormDraft } from "@/components/shared/use-form-draft";
import {
  Send,
  Mail,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  ShoppingCart,
  Store,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Briefcase,
  MessageSquare,
  Clock,
  Headphones,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
} from "lucide-react";
import CtaBanner from "@/components/shared/cta-banner";
import { FloatingSelect } from "@/components/shared/form-fields";
import { matchFAQs } from "@/data/faq-data";

/* ═══════════════════════════════════════
   QUERY TYPES — controls which fields appear
   ═══════════════════════════════════════ */
const QUERY_TYPES = [
  { value: "support", label: "Support Query" },
  { value: "listing", label: "Listing My Company" },
  { value: "billing", label: "Billing & Payments" },
  { value: "partnership", label: "Partnership Enquiry" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "report", label: "Report an Issue" },
  { value: "other", label: "Other" },
];

/* ═══════════════════════════════════════
   FAQ CATEGORIES
   ═══════════════════════════════════════ */
const FAQ_SECTIONS = [
  {
    id: "general",
    title: "General FAQs",
    icon: HelpCircle,
    questions: [
      { q: "What is WholesaleUp?", a: "WholesaleUp is the Web's largest database of verified wholesale suppliers, liquidators and dropshippers from the EU, UK and North America. We connect retailers with verified suppliers across 40+ product categories, providing access to thousands of wholesale deals, supplier contact details, and sourcing tools." },
      { q: "Is WholesaleUp free to use?", a: <>Buyers can access premium supplier listings for free. We also offer premium services for both buyers and suppliers across four tiers — Standard, Premium, Premium+ and Supplier Pro — each unlocking additional features such as full supplier databases, unlimited enquiries, custom sourcing support, and enhanced listing visibility. <a href="/pricing" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">View pricing plans</a>.</> },
      { q: "How do I create an account?", a: <>Click <a href="/register" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">Join Free</a> to register. You'll need a valid email address and basic business information. Registration takes less than 2 minutes.</> },
      { q: "What countries do you cover?", a: "We list suppliers from over 150 countries including the UK, Germany, Netherlands, Poland, Spain, Italy, France, and the USA. Most suppliers ship internationally and many offer dropshipping." },
    ],
  },
  {
    id: "buyer",
    title: "Buyer FAQs",
    icon: ShoppingCart,
    questions: [
      { q: "How do I contact a supplier?", a: "Free and Standard buyers can contact premium suppliers free of charge. Standard buyers can also contact suppliers with listed deals via the deal listings. Premium buyers get full access to contact all suppliers from deal listings, supplier profiles, and search pages. Premium+ members enjoy all Premium benefits plus unlimited enquiries and saved keyword searches." },
      { q: "Are the deals genuine?", a: "All suppliers undergo a verification process before being listed. We display a 'Verified Supplier' badge on suppliers who have passed our checks. However, we recommend conducting your own due diligence before placing orders." },
      { q: "Can I negotiate prices?", a: "Yes! Many deals are marked as 'Negotiable'. You can use the contact form to reach out to suppliers and discuss pricing, MOQs, and shipping arrangements directly." },
      { q: "What if I have a problem with a supplier?", a: "If you experience any issues with a supplier, please contact our support team using the form on this page. We take reports seriously and may remove suppliers who don't meet our standards." },
    ],
  },
  {
    id: "supplier",
    title: "Supplier FAQs",
    icon: Store,
    questions: [
      { q: "How do I list my company?", a: "Select 'Listing My Company' from the contact form dropdown on this page and fill in your company details. Our team will review your application and get back to you within 24 hours." },
      { q: "What are the requirements to be listed?", a: "We require a valid company registration, a professional website, and the ability to supply products at genuine wholesale prices. We verify all supplier information before listing." },
      { q: "Is there a fee to be listed?", a: <>Basic supplier listings are free. We also offer premium supplier packages with enhanced visibility, priority placement, and featured listing options. <a href="/contact" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">Contact us</a> for pricing.</> },
      { q: "How do I manage my deals?", a: <>Once your company is approved, you'll receive access to a <a href="/register#login" className="text-orange-500 hover:text-orange-600 underline underline-offset-2">supplier dashboard</a> where you can add, edit, and manage your deals, update company information, and respond to buyer enquiries.</> },
    ],
  },
];

/* ═══════════════════════════════════════
   COPY BUTTON
   ═══════════════════════════════════════ */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors shrink-0"
      title="Copy to clipboard"
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

/* ═══════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════ */
function FAQAccordion({ section }) {
  const [expanded, setExpanded] = useState(null);
  const Icon = section.icon;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <Icon size={16} className="text-orange-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
      </div>
      <div className="space-y-2.5">
        {section.questions.map((item, idx) => (
          <div key={idx} className={`border rounded-lg bg-white transition-shadow duration-200 ${expanded === idx ? "border-slate-300 shadow-md" : "border-slate-200 shadow-sm hover:shadow-md"}`}>
            <button
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors ${expanded === idx ? "bg-slate-50 rounded-t-lg" : "hover:bg-slate-50 rounded-lg"}`}
            >
              <span className="text-sm font-medium text-slate-700 pr-4">{item.q}</span>
              <ChevronDown
                size={14}
                className={`text-slate-400 shrink-0 transition-transform duration-200 ${expanded === idx ? "rotate-180" : ""}`}
              />
            </button>
            {expanded === idx && (
              <div className="px-4 pb-4 pt-0">
                <div className="border-t border-slate-100 pt-3 mx-1">
                  <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FAQ SUGGESTION PANEL — deflection before submit
   Appears below the Message field when subject/message
   keywords match FAQ entries. Accordion-style with
   "This answered my question" resolution button.
   ═══════════════════════════════════════ */
function FAQSuggestionPanel({ suggestions, onDismiss, onResolved }) {
  const [expanded, setExpanded] = useState(null);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef(null);
  const firstItemRef = useRef(null);
  const itemRefs = useRef([]);

  /* Animate in on mount, then scroll so the full panel + bottom padding is visible */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    const scrollT = setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const bottomPadding = 40;
      const overflow = rect.bottom + bottomPadding - window.innerHeight;
      if (overflow > 0) {
        window.scrollBy({ top: overflow, behavior: "smooth" });
      }
    }, 350);
    return () => { clearTimeout(t); clearTimeout(scrollT); };
  }, []);

  /* Scroll expanded answer into view — just enough to show the answer, not Send Message */
  useEffect(() => {
    if (expanded === null) return;
    const scrollT = setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const bottomPadding = 40;
      const overflow = rect.bottom + bottomPadding - window.innerHeight;
      if (overflow > 0) {
        window.scrollBy({ top: overflow, behavior: "smooth" });
      }
    }, 280);
    return () => clearTimeout(scrollT);
  }, [expanded]);

  /* Smooth dismiss — animate out before calling callback */
  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 250);
  };

  return (
    <div
      ref={panelRef}
      style={{ scrollMarginBottom: "80px" }}
      className={`mt-4 rounded-xl border border-[#c4d6ec] overflow-hidden shadow-[0_2px_12px_rgba(30,64,175,0.07)] transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      role="region"
      aria-label="Related FAQs"
    >
      {/* Header — soft blue referencing hero palette */}
      <div className="relative bg-gradient-to-r from-[#e8f0fa] via-[#dce8f7] to-[#e8f0fa] border-b border-[#c4d6ec]">
        <div className="relative flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1e5299] flex items-center justify-center shadow-sm">
              <Lightbulb size={14} className="text-blue-100" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#1a3f7a]">We might already have the answer</span>
              <p className="text-[10px] text-[#1e5299]/60 mt-0.5">Check if any of these help before sending</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1e5299]/30 hover:text-[#1a3f7a] hover:bg-[#1e5299]/10 active:scale-90 transition-all duration-150"
            aria-label="Dismiss suggestions"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* FAQ items — accordion on light background */}
      <div className="p-3 space-y-2 bg-gradient-to-b from-blue-50/50 to-white border-t border-blue-200/30">
        {suggestions.map((faq, idx) => {
          const isOpen = expanded === idx;
          return (
            <div
              key={faq.id}
              ref={(el) => { itemRefs.current[idx] = el; if (idx === 0) firstItemRef.current = el; }}
              style={{ scrollMarginBottom: "80px" }}
              className={`rounded-lg border overflow-hidden transition-all duration-200 ${
                isOpen
                  ? "border-blue-300 bg-white shadow-[0_1px_8px_rgba(30,64,175,0.08)]"
                  : "border-blue-100 bg-white/80 hover:border-blue-200 hover:bg-white hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-left transition-colors group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-200 ${
                  isOpen
                    ? "bg-[#1e5299] text-white shadow-sm"
                    : "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
                }`}>
                  {idx + 1}
                </span>
                <span className={`text-[13px] font-medium flex-1 transition-colors duration-150 ${
                  isOpen ? "text-blue-900" : "text-slate-700 group-hover:text-slate-900"
                }`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={13}
                  className={`shrink-0 transition-all duration-200 ${
                    isOpen ? "text-blue-600 rotate-180" : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
              </button>
              {/* Answer — animated expand */}
              <div
                className={`overflow-hidden transition-all duration-250 ease-out ${
                  isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-3.5 pb-3.5 pt-0">
                  <div className="border-t border-blue-100 pt-3 ml-8">
                    <p className="text-[13px] text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolution button — slides in when an answer is expanded */}
      <div
        className={`overflow-hidden transition-all duration-250 ease-out bg-white ${
          expanded !== null ? "max-h-[70px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 pb-3 pt-0.5">
          <button
            type="button"
            onClick={onResolved}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-[#1e5299] bg-white border-2 border-[#1e5299]/30 rounded-lg hover:bg-[#e8f0fa] hover:border-[#1e5299]/50 active:scale-[0.98] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.08)] transition-all duration-200"
          >
            <ThumbsUp size={14} />
            This answered my question
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FLOATING LABEL INPUT — Google Forms style
   Label sits inside the border, animates up on focus/fill.
   Status icon (check/error) on the right.
   onBlur validation for required fields.
   ═══════════════════════════════════════ */
function FloatingField({
  label, required, error, value, onChange, onBlur,
  type = "text", placeholder = "", multiline = false, rows = 5, id,
  inputMode, autoComplete, disabled = false,
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  /* Border + bg colour based on state */
  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = error ? "bg-red-50/40" : focused ? "bg-white" : hasValue ? "bg-emerald-50/40" : "bg-white";

  const Tag = multiline ? "textarea" : "input";

  return (
    <div>
      <div className={`relative rounded-lg border transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] ${multiline ? "min-h-[120px]" : ""} ${stateStyle} ${bgColor}`}>
        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-3.5 transition-all duration-200 pointer-events-none ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : `${multiline ? "top-3" : "top-1/2 -translate-y-1/2"} text-sm`
          } ${
            error
              ? "text-red-600"
              : focused
              ? "text-orange-500"
              : hasValue
              ? "text-emerald-600"
              : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>

        {/* Input / Textarea */}
        <Tag
          id={id}
          type={multiline ? undefined : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          rows={multiline ? rows : undefined}
          className={`w-full px-3.5 text-base text-slate-800 bg-transparent outline-none ${
            multiline ? "py-3.5 resize-none h-full min-h-[80px]" : "py-3.5"
          } pr-9`}
          placeholder={focused ? placeholder : ""}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          inputMode={inputMode}
          autoComplete={autoComplete}
          disabled={disabled || undefined}
        />

        {/* Status icon */}
        <div className={`absolute right-3 ${multiline ? "top-3" : "top-1/2 -translate-y-1/2"} pointer-events-none`}>
          {error ? (
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span>
          ) : hasValue ? (
            <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
          ) : null}
        </div>
      </div>
      {/* Error message below */}
      {error && <p id={errorId} role="alert" className="text-xs text-red-600 mt-1 ml-1">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════
   CONTACT FORM — floating labels + onBlur validation
   ═══════════════════════════════════════ */
function ContactForm() {
  const [queryType, setQueryType] = useState("");
  const [form, setForm] = useState({
    fullName: "", username: "", email: "", subject: "", message: "",
    companyName: "", companyReg: "", vatNumber: "", phone: "", website: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [faqSuggestions, setFaqSuggestions] = useState([]);
  const [faqDismissed, setFaqDismissed] = useState(false);
  const [faqResolved, setFaqResolved] = useState(false);
  const faqTimerRef = useRef(null);
  const { executeRecaptcha } = useRecaptcha();

  /* ── FAQ deflection: debounced keyword matching on subject + message ── */
  useEffect(() => {
    if (faqTimerRef.current) clearTimeout(faqTimerRef.current);
    // Don't show if user dismissed, resolved, or already submitted
    if (faqDismissed || faqResolved || submitted) {
      setFaqSuggestions([]);
      return;
    }
    const combinedLen = (form.subject + form.message).trim().length;
    if (combinedLen < 4) { setFaqSuggestions([]); return; }
    faqTimerRef.current = setTimeout(() => {
      const results = matchFAQs(form.subject, form.message, { threshold: 3, maxResults: 3 });
      setFaqSuggestions(results);
    }, 450);
    return () => { if (faqTimerRef.current) clearTimeout(faqTimerRef.current); };
  }, [form.subject, form.message, faqDismissed, faqResolved, submitted]);

  /* Draft persistence — saves form to localStorage, warns on unload.
     queryType is excluded from restoration so users always actively choose. */
  const isFormEmpty = useCallback((f) => Object.values(f).every((v) => !v || !v.trim()), []);
  const { clearDraft } = useFormDraft("contact-form", form, (saved) => {
    setForm((prev) => ({ ...prev, ...saved }));
  }, { isEmpty: isFormEmpty, warnOnLeave: false });

  /* Human-readable labels for error summary panel */
  const FIELD_LABELS = {
    queryType: "Query Type",
    fullName: "Full Name",
    email: "Email Address",
    subject: "Subject",
    message: "Message",
    companyName: "Company Name",
    phone: "Phone Number",
    website: "Company Website",
  };

  /* Focus a field by its id and scroll it into view */
  const focusField = (fieldKey) => {
    const el = document.getElementById(`field-${fieldKey}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus(), 300);
    }
  };

  const isListing = queryType === "listing";

  /* Characters never valid in a standard email address */
  const hasInvalidEmailChars = (v) => /[,;:!#$%^&*()\[\]{}<>\\/"'\s|`~=+]/.test(v);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    /* Clear error in real-time once user starts fixing */
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
    /* Live invalid-character detection for email */
    if (field === "email" && value.trim() && hasInvalidEmailChars(value.trim())) {
      setErrors((prev) => ({ ...prev, email: "Contains invalid characters" }));
    }
  };

  /* Per-field validation rules */
  const validateField = (field) => {
    const val = field === "queryType" ? queryType : (form[field] || "").trim();
    const rules = {
      queryType: () => !val ? "Please select a query type" : "",
      fullName: () => !val ? "Full name is required" : val.length < 2 ? "Name must be at least 2 characters" : !/^[a-zA-ZÀ-ÿ\u0100-\u024F\u1E00-\u1EFF' \-\.]+$/.test(val) ? "Please enter a valid name (letters, hyphens and apostrophes only)" : "",
      email: () => !val ? "Email address is required" : hasInvalidEmailChars(val) ? "Contains invalid characters" : !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/.test(val) ? "Please enter a valid email address (e.g., user@example.com)" : "",
      subject: () => !val ? "Subject is required" : "",
      message: () => !val ? "Message is required" : val.length < 10 ? "Please enter a message (at least 10 characters)" : "",
      companyName: () => isListing && !val ? "Company Name is required" : "",
      phone: () => isListing && !val ? "Phone Number is required" : "",
      website: () => isListing && !val ? "Company Website URL is required" : "",
    };
    return rules[field] ? rules[field]() : "";
  };

  /* onBlur handler — validate single field */
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }));
    } else {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  /* Full-form validation on submit */
  const validate = () => {
    const fields = ["queryType", "fullName", "email", "subject", "message"];
    if (isListing) fields.push("companyName", "phone", "website");
    const errs = {};
    fields.forEach((f) => {
      const err = validateField(f);
      if (err) errs[f] = err;
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setServerError("");
    /* Mark all fields as touched */
    setTouched({ queryType: true, fullName: true, email: true, subject: true, message: true, companyName: true, phone: true, website: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      /* Scroll to error panel */
      setTimeout(() => {
        document.getElementById("form-errors-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    setSending(true);
    /* ── C15: Real contact form API call ── */
    let recaptchaToken = null;
    try {
      recaptchaToken = await executeRecaptcha("contact");
    } catch { /* reCAPTCHA unavailable — continue */ }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType,
          fullName: form.fullName,
          email: form.email,
          subject: form.subject,
          message: form.message,
          companyName: form.companyName,
          phone: form.phone,
          website: form.website,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      setSending(false);
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }
      setSubmitted(true);
      clearDraft();
      setTimeout(() => {
        document.getElementById("form-success-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch (_err) {
      setSending(false);
      setServerError("Our server is temporarily unavailable. Please try again in a few minutes.");
    }
  };

  const handleQueryTypeChange = (value) => {
    setQueryType(value);
    if (errors.queryType) {
      setErrors((prev) => { const next = { ...prev }; delete next.queryType; return next; });
    }
    if (value === "listing" && !form.subject) {
      updateField("subject", "Request to get listed on WholesaleUp as a supplier");
    } else if (value !== "listing" && form.subject === "Request to get listed on WholesaleUp as a supplier") {
      updateField("subject", "");
    }
  };

  /* Reset form and focus first field */
  const handleSendAnother = () => {
    setSubmitted(false);
    setForm((prev) => ({ fullName: prev.fullName, username: prev.username, email: "", subject: "", message: "", companyName: "", companyReg: "", vatNumber: "", phone: "", website: "" }));
    setQueryType(""); setErrors({}); setTouched({}); setSubmitAttempted(false); setServerError("");
    setFaqSuggestions([]); setFaqDismissed(false); setFaqResolved(false);
    setTimeout(() => {
      const el = document.getElementById("field-queryType");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.focus(), 300);
      }
    }, 100);
  };

  return (
    <form id="contact-form-top" onSubmit={handleSubmit} noValidate className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ scrollMarginTop: "120px" }}>
      {/* Header with gradient overlay + squared paper grid */}
      <div className="relative overflow-hidden">
        {/* ═══ squared paper grid — scoped to header ═══ */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{
          backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200/90 via-slate-100/60 to-transparent pointer-events-none" />
        <div className="relative px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Mail size={16} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Fill out our Contact Form</h3>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Fill in our contact form to receive assistance 24/7. Simply select the query type from the
            drop-down menu and let us know how we can be of assistance. The relevant team will
            read your message and come back to you within 24 hours or sooner with a detailed reply.
          </p>
        </div>
      </div>

      {/* ── Status Panels ── */}
      {/* Success Panel */}
      {submitted && (
        <div id="form-success-panel" role="status" className="relative mx-5 sm:mx-6 my-5 p-5 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check size={24} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="text-base font-extrabold text-emerald-800">Message Sent Successfully!</p>
              <p className="text-sm text-emerald-600 mt-1 leading-relaxed">
                Thank you for contacting us. Our team will review your message and get back to you within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSendAnother}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 mt-1"
            >
              <Send size={14} />
              Send Another Message
            </button>
          </div>
        </div>
      )}

      {/* FAQ Resolved Panel */}
      {faqResolved && !submitted && (
        <div className="relative mx-5 sm:mx-6 my-5 p-5 rounded-lg bg-emerald-50 border border-emerald-200" role="status">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
              <ThumbsUp size={22} className="text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold text-emerald-800">Glad we could help!</p>
              <p className="text-sm text-emerald-600 mt-1 leading-relaxed">
                If you need further assistance, you can still send us a message below.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setFaqResolved(false); setFaqDismissed(false); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 mt-1"
            >
              <Send size={14} />
              I still need to contact support
            </button>
          </div>
        </div>
      )}

      {/* Client-Side Errors Panel */}
      {submitAttempted && Object.keys(errors).length > 0 && (
        <div id="form-errors-panel" role="alert" className="relative mx-5 sm:mx-6 mt-5 mb-3 rounded-xl overflow-hidden border border-red-200">
          {/* Header */}
          <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
            <AlertTriangle size={14} className="text-white shrink-0" />
            <p className="text-sm font-semibold text-white">
              Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? "s" : ""} below
            </p>
          </div>
          {/* Error list */}
          <div className="bg-red-50/80">
            {Object.entries(errors).map(([field, message], i, arr) => (
              <button
                key={field}
                type="button"
                onClick={() => focusField(field)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-red-100/80 transition-colors group ${
                  i < arr.length - 1 ? "border-b border-red-100" : ""
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-red-200 transition-colors">
                  {i + 1}
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-red-800 underline underline-offset-2 decoration-red-300 group-hover:decoration-red-500">{FIELD_LABELS[field] || field}</span>
                  <span className="text-red-600/70 mx-1.5">&mdash;</span>
                  <span className="text-red-600">{message}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Server-Side Error Panel */}
      {serverError && (
        <div className="relative mx-5 sm:mx-6 mt-5 p-4 rounded-lg bg-red-50 border border-red-300">
          <div className="flex items-start gap-3">
            <span className="w-[22px] h-[22px] rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5"><X size={13} className="text-white" strokeWidth={3} /></span>
            <div>
              <p className="text-sm font-bold text-red-900">Something went wrong</p>
              <p className="text-sm text-red-700 mt-0.5 leading-relaxed">{serverError}</p>
              <button
                type="button"
                onClick={() => { setServerError(""); handleSubmit({ preventDefault: () => {} }); }}
                className="mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline underline-offset-2 decoration-red-300 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields — hidden when resolved via FAQ */}
      {!faqResolved && <><div className="relative px-5 sm:px-6 py-5 space-y-5">
        {/* Query Type */}
        <FloatingSelect
          id="field-queryType"
          label="What Is Your Request About?"
          required
          value={queryType}
          onChange={(v) => handleQueryTypeChange(v)}
          onBlur={() => handleBlur("queryType")}
          error={errors.queryType}
          options={QUERY_TYPES}
          placeholder="Select a query type..."
          disabled={sending}
        />

        {/* Full Name */}
        <FloatingField
          id="field-fullName"
          label="Your Full Name"
          required
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          error={errors.fullName}
          placeholder="Type here your full name"
          autoComplete="name"
          disabled={sending}
        />

        {/* Username */}
        <FloatingField
          id="field-username"
          label="Your Username (Optional)"
          value={form.username}
          onChange={(e) => updateField("username", e.target.value)}
          placeholder="Type here your username (if already registered)"
          autoComplete="username"
          disabled={sending}
        />

        {/* Email */}
        <FloatingField
          id="field-email"
          label="Your Email Address"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          placeholder="Type here your registered or best email address"
          disabled={sending}
        />

        {/* Subject */}
        <FloatingField
          id="field-subject"
          label="Subject of Your Request"
          required
          value={form.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          onBlur={() => handleBlur("subject")}
          error={errors.subject}
          placeholder="Type here the subject of your query"
          disabled={sending}
        />

        {/* ── Listing-specific fields ── */}
        {isListing && (
          <>
            <div className="flex items-center gap-2 pt-2 pb-1 border-t border-dashed border-slate-200">
              <Building2 size={13} className="text-orange-500" />
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Company Details</span>
            </div>

            <FloatingField
              id="field-companyName"
              label="Company Name"
              required
              value={form.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              onBlur={() => handleBlur("companyName")}
              error={errors.companyName}
              placeholder="Type here your company name"
              autoComplete="organization"
              disabled={sending}
            />

            <FloatingField
              id="field-companyReg"
              label="Company Registration Number"
              value={form.companyReg}
              onChange={(e) => updateField("companyReg", e.target.value)}
              placeholder="Type here your company number"
              disabled={sending}
            />

            <FloatingField
              id="field-vatNumber"
              label="VAT Number or Tax ID (if applicable)"
              value={form.vatNumber}
              onChange={(e) => updateField("vatNumber", e.target.value)}
              placeholder="Type here your VAT Number or Tax ID"
              disabled={sending}
            />

            <FloatingField
              id="field-phone"
              label="Phone Number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              error={errors.phone}
              placeholder="Type here your telephone number"
              disabled={sending}
            />

            <FloatingField
              id="field-website"
              label="Company Website URL"
              required
              type="url"
              inputMode="url"
              autoComplete="url"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              onBlur={() => handleBlur("website")}
              error={errors.website}
              placeholder="Type here the url of your company website"
              disabled={sending}
            />
          </>
        )}

        {/* Message */}
        <FloatingField
          id="field-message"
          label="Your Message"
          required
          multiline
          value={form.message}
          onChange={(e) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          error={errors.message}
          placeholder="Type here the message related to your query..."
          disabled={sending}
        />

        {/* ── FAQ Suggestion Panel — appears when keywords match ── */}
        {faqSuggestions.length > 0 && !faqResolved && (
          <FAQSuggestionPanel
            suggestions={faqSuggestions}
            onDismiss={() => setFaqDismissed(true)}
            onResolved={() => {
              setFaqResolved(true);
              setFaqSuggestions([]);
              setForm({ fullName: form.fullName, username: form.username, email: "", subject: "", message: "", companyName: "", companyReg: "", vatNumber: "", phone: "", website: "" });
              setQueryType(""); setErrors({}); setTouched({}); setSubmitAttempted(false);
              setTimeout(() => {
                document.getElementById("contact-form-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 100);
            }}
          />
        )}
      </div>

      {/* Submit */}
      <div className="relative px-5 sm:px-6 pb-5 sm:pb-6">
        <button
          type="submit"
          disabled={sending}
          className="w-full py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all duration-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={14} />
              Send Message
            </>
          )}
        </button>
        <RecaptchaNotice />
      </div>
      </>}
    </form>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ══════════ Hero — exact register blue + greyscale photo appliqué ══════════ */}
      <section className="relative overflow-hidden">
        {/* Layer 1: Solid blue gradient — identical to /register MarketingColumn, NO opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4b8c] via-[#1e5299] to-[#1a3f7a]" />
        {/* Layer 2: Greyscale background photo blended as a subtle texture.
            grayscale(1) strips colour; mix-blend-mode:luminosity maps the photo's
            light/dark values onto the blue base without shifting hue; opacity keeps it subtle. */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            filter: "grayscale(1)",
            mixBlendMode: "luminosity",
          }}
        />
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/60 pt-4">
            <a href="/" className="hover:text-orange-300 transition-colors">WholesaleUp</a>
            <ChevronRight size={12} />
            <span className="text-white/90 font-medium">Contact Us</span>
          </nav>

          <div className="max-w-4xl mx-auto pt-5 pb-7 sm:pt-6 sm:pb-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-4">
              <Headphones size={13} /> 24/7 Support
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Contact Us & FAQs
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Find answers to common questions or get in touch with our support team.
              We respond to every enquiry within 24 hours.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mt-6 max-w-md mx-auto">
              {[
                { icon: Clock, value: "< 24h", label: "Response time", color: "text-amber-400" },
                { icon: MessageSquare, value: "24/7", label: "Email support", color: "text-emerald-400" },
                { icon: Headphones, value: "100%", label: "Reply rate", color: "text-blue-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon size={18} className={`${stat.color} mx-auto mb-1.5`} />
                  <p className="text-lg font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Content area — 50/50 two column ══════════ */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Right Column (on desktop): Contact Form — shown FIRST on mobile ── */}
          <div className="lg:sticky lg:top-6 lg:order-2">
            <ContactForm />
          </div>

          {/* ── Left Column (on desktop): FAQs + Info — shown SECOND on mobile ── */}
          <div className="space-y-8 lg:order-1">
            {/* FAQ Section */}
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
              {FAQ_SECTIONS.map((section) => (
                <FAQAccordion key={section.id} section={section} />
              ))}
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Headphones size={16} className="text-orange-500" />
                  </div>
                  <h2 className="text-base font-extrabold text-slate-900">Contact Us</h2>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  24/7 email support — we reply to every enquiry within 24 hours or sooner.
                  Select a query type from our contact form and provide as much detail as possible.
                </p>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Postal Address */}
                {[
                  {
                    icon: Send,
                    title: "Send Us a Letter",
                    name: "WholesaleUp.com",
                    address: "27 Old Gloucester Street, London — WC1N 3AX, United Kingdom",
                    copyText: "WholesaleUp.com, 27 Old Gloucester Street, London - WC1N 3AX United Kingdom",
                  },
                  {
                    icon: Building2,
                    title: "Legal Address",
                    name: "Tradegenius SL",
                    address: "Calle Villalba Hervas 2, 4-2, Santa Cruz de Tenerife, 38002, Spain",
                    copyText: "Tradegenius SL, Calle Villalba Hervas 2, 4-2, Santa Cruz de Tenerife, 38002, Spain",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={13} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.title}</p>
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.address}</p>
                    </div>
                    <CopyButton text={item.copyText} />
                  </div>
                ))}
              </div>

              {/* Helpful Links */}
              <div className="px-5 pb-5 pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Helpful Links</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Terms of Service", href: "/terms", icon: FileText },
                    { label: "Privacy Policy", href: "/privacy", icon: FileText },
                    { label: "Cookies Policy", href: "/cookies", icon: FileText },
                    { label: "Pricing & Plans", href: "/pricing", icon: Briefcase },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <link.icon size={12} className="text-slate-400" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* (Contact Form is rendered above with lg:order-2) */}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="px-4 sm:px-6 lg:px-8 pb-10">
        <CtaBanner className="" />
      </div>

    </div>
  );
}
