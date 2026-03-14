"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { FormTipsPanel, WhyItMattersSection } from "@/components/shared/form-tips-panel";
import Breadcrumb from "@/components/shared/breadcrumb";
import { useFormDraft } from "@/components/shared/use-form-draft";
import { useProfileSaveTime } from "@/components/shared/use-profile-save-time";
import { StaleProfileBanner } from "@/components/shared/stale-profile-banner";
import {
  User,
  ShoppingBag,
  Store,
  Package,
  MessageSquare,
  Heart,
  Coins,
  Settings,
  Crown,
  Pencil,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  ChevronDown,
  Check,
  CheckCircle2,
  XCircle,
  Search,
  Globe,
  Phone,
  Mail,
  Building2,
  MapPin,
  Languages,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  LayoutDashboard,
  Circle,
  ChevronRight,
  Loader2,
  AtSign,
  Linkedin,
  KeyRound,
  Calendar,
  Camera,
  Upload,
  Trash2,
  HelpCircle,
  Info,
  Newspaper,
} from "lucide-react";
import {
  FlagImg,
  PHONE_CODES,
  LANGUAGES,
  COUNTRIES,
  PHONE_RULES,
  PHONE_PLACEHOLDERS,
  useDropdown,
  HelpTooltip,
  FloatingField,
  FloatingSelect,
  CountrySelect,
  FloatingTextarea,
  PhoneInput,
  LanguageSelector,
  FormSection,
  TabStatus,
  TabProgressBadge,
  ProfileTabBar,
  ErrorSummaryPanel,
  ProfileProgressBar,
} from "@/components/shared/form-fields";
import {
  AccountSidebar,
  MobileDashboardNav,
  UpgradeBanner,
  usePageUser,
} from "./dashboard";

const PROFILE_TABS = [
  { id: "personal", label: "Main Contact & Business", icon: User, shortLabel: "Contact" },
  { id: "address", label: "Address", icon: MapPin, shortLabel: "Address" },
  { id: "contact", label: "Contact Options", icon: Languages, shortLabel: "Contact" },
];

const COMPANY_SIZES = [
  { value: "1-5", label: "1–5 employees" },
  { value: "6-20", label: "6–20 employees" },
  { value: "21-50", label: "21–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

/* ─── Field validation patterns (module-level for performance) ─── */
const NAME_RE = /^[\p{L}\p{M}' \-]+$/u; // Unicode letters, accents, apostrophes, hyphens, spaces
const ALPHA_SPACE_RE = /^[\p{L}\p{M} \-'.]+$/u; // City names: letters, spaces, hyphens, apostrophes, dots
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/;
const LINKEDIN_RE = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9._-]+\/?$/i;
const ALNUM_RE = /^[a-zA-Z0-9 \-/]+$/; // Reg numbers, tax IDs
const TEAMS_RE = /^[a-zA-Z0-9._@+-]+$/; // Teams handles

/* Fields belonging to each tab — used for section-level status */
const TAB_FIELDS = {
  personal: { required: ["salutation", "firstName", "lastName", "companyName"], optional: ["regNumber", "taxId", "roleInCompany", "yearEstablished", "companySize"] },
  address: { required: ["addressLine1", "city", "postcode", "country"], optional: ["addressLine2"] },
  contact: { required: ["mobileNumber", "businessEmail", "languages"], optional: ["landlineNumber", "personalEmail", "teamsHandle", "linkedinUrl", "whatsappNumber"] },
};

/* ═══════════════════════════════════════════════════
   TIPS DATA — contextual guidance per field
   ═══════════════════════════════════════════════════ */
const TIPS_DATA = {
  // Tab: personal
  salutation: {
    title: "Title",
    tip: "Select your preferred professional title. This appears on all correspondence with suppliers.",
    icon: User,
  },
  firstName: {
    title: "First Name",
    tip: "Use your legal first name as it appears on business documents. Suppliers will address you by this name.",
    icon: User,
  },
  lastName: {
    title: "Last Name",
    tip: "Your family or surname. This helps suppliers verify your identity when processing orders.",
    icon: User,
  },
  companyName: {
    title: "Company or Trading Name",
    tip: "Enter the name your business trades under. This will appear on invoices, inquiries, and your public buyer profile.",
    icon: Building2,
  },
  regNumber: {
    title: "Registration Number",
    tip: "Your official company registration number (e.g. Companies House in the UK, EIN in the US). Helps verify your business legitimacy with suppliers.",
    icon: FileText,
  },
  taxId: {
    title: "Tax ID / VAT",
    tip: "Your tax identification number is used for invoicing. UK businesses: GB followed by 9 digits. US businesses: EIN format (XX-XXXXXXX).",
    icon: FileText,
  },
  roleInCompany: {
    title: "Your Role",
    tip: "Describe your purchasing authority and responsibilities. Suppliers prioritise inquiries from decision-makers. Mention your budget authority if applicable.",
    icon: User,
  },
  yearEstablished: {
    title: "Year Established",
    tip: "When was your business founded? Established companies often receive priority from suppliers. Even new businesses benefit — it helps suppliers tailor their service to your experience level.",
    icon: Calendar,
  },
  companySize: {
    title: "Company Size",
    tip: "Select the number of employees in your organisation. This helps suppliers estimate your order volume potential and assign the right account manager to your inquiries.",
    icon: Building2,
  },
  // Tab: address
  addressLine1: {
    title: "Address Line 1",
    tip: "Your primary business address for deliveries and correspondence. Use the registered business address if possible.",
    icon: MapPin,
  },
  addressLine2: {
    title: "Address Line 2",
    tip: "Suite number, floor, building name, or any secondary address information.",
    icon: MapPin,
  },
  city: {
    title: "City / Town",
    tip: "The city where your business operates. This helps local suppliers identify you for faster delivery.",
    icon: Building2,
  },
  postcode: {
    title: "Postcode / ZIP",
    tip: "Your postal code is used to calculate shipping estimates and match you with nearby suppliers.",
    icon: MapPin,
  },
  country: {
    title: "Country",
    tip: "Select the country where your business is registered. This determines applicable trade regulations and tax rules.",
    icon: Globe,
  },
  // Tab: contact
  languages: {
    title: "Languages Spoken",
    tip: "Select all languages you can conduct business in. This helps international suppliers communicate effectively with you. Languages appear on your public contact card with a representative country flag and color-coded by linguistic family (Germanic = blue, Romance = violet, Slavic = emerald, East Asian = sky/cyan/teal).",
    icon: Languages,
  },
  landlineNumber: {
    title: "Landline Number",
    tip: "A landline number builds trust with suppliers. Include your country code for international reach.",
    icon: Phone,
  },
  mobileNumber: {
    title: "Mobile Number",
    tip: "Your primary contact number. Suppliers may use this for urgent order updates or delivery coordination.",
    icon: Phone,
  },
  businessEmail: {
    title: "Work Email",
    tip: "This email appears on your inquiries to suppliers. Using a company domain (not Gmail/Yahoo) significantly increases response rates.",
    icon: Mail,
  },
  personalEmail: {
    title: "Personal Email",
    tip: "Used only for account recovery and security alerts. Never shared with suppliers or third parties.",
    icon: Mail,
  },
  teamsHandle: {
    title: "Microsoft Teams",
    tip: "Some enterprise suppliers prefer Teams for quick communication. Add your handle to enable instant messaging.",
    icon: AtSign,
  },
  linkedinUrl: {
    title: "LinkedIn Profile",
    tip: "A LinkedIn profile adds credibility. Suppliers often check profiles before accepting large wholesale orders.",
    icon: Linkedin,
  },
  whatsappNumber: {
    title: "WhatsApp",
    tip: "WhatsApp is widely used in international wholesale trade. Many suppliers in Asia and the Middle East prefer it for negotiations.",
    icon: Phone,
  },
};

/* Default tips shown per tab when no field is focused */
const TAB_DEFAULT_TIPS = {
  personal: {
    title: "Main Contact & Business",
    tip: "Complete your main contact and business details to build trust with suppliers. Profiles with verified company information receive 3× more responses.",
    icon: User,
  },
  address: {
    title: "Business Address",
    tip: "An accurate business address helps suppliers calculate shipping costs and delivery times. It also verifies your business location for trade compliance.",
    icon: MapPin,
  },
  contact: {
    title: "Contact Options",
    tip: "Multiple contact methods increase your chances of connecting with suppliers. Business email addresses receive higher response rates than personal ones.",
    icon: Phone,
  },
};

/* Tips panel bottom section */
const ACCOUNT_TIPS_BOTTOM = (
  <WhyItMattersSection items={[
    "Complete profiles get 3× more responses",
    "Verified businesses unlock premium deals",
    "Accurate details speed up order processing",
  ]} />
);
function AccountProfileForm({ user, onFocusedFieldChange, onActiveTabChange, onSave, onProgressChange }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    salutation: "",
    companyName: "",
    regNumber: "",
    taxId: "",
    yearEstablished: "",
    companySize: "",
    roleInCompany: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    landlineNumber: "",
    mobileNumber: "",
    businessEmail: "",
    personalEmail: "",
    teamsHandle: "",
    linkedinUrl: "",
    whatsappNumber: "",
  });

  const [phoneCode1, setPhoneCode1] = useState(PHONE_CODES[0]);
  const [phoneCode2, setPhoneCode2] = useState(PHONE_CODES[0]);
  const [whatsappCode, setWhatsappCode] = useState(PHONE_CODES[1]); // UK default
  const [languages, setLanguagesRaw] = useState([]);
  const setLanguages = useCallback((v) => { setLanguagesRaw(v); setErrors((p) => ({ ...p, languages: "" })); }, []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorScope, setErrorScope] = useState("all"); // "tab" = Save & Continue (current tab only), "all" = Save All
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState("personal");
  const [focusedField, setFocusedField] = useState(null);

  /* Auto-revert "Saved!" button state after 3 seconds */
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 9000);
    return () => clearTimeout(t);
  }, [saved]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoCoords, setGeoCoords] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const formRef = useRef(null);

  /* ─── Form draft persistence — saves to localStorage, warns on browser close ─── */
  const isFormEmpty = useCallback((f) => Object.values(f).every((v) => !v || (typeof v === "string" && !v.trim())), []);
  const { clearDraft } = useFormDraft("account-profile", form, (restored) => setForm((prev) => ({ ...prev, ...restored })), { isEmpty: isFormEmpty });

  /* ─── Track focused field via event delegation (works for all field types) ─── */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const handleFocusIn = (e) => {
      const el = e.target;
      if (el.id) setFocusedField(el.id);
    };
    const handleFocusOut = (e) => {
      // Only clear if focus leaves the form entirely
      setTimeout(() => {
        if (form && !form.contains(document.activeElement)) setFocusedField(null);
      }, 50);
    };
    form.addEventListener("focusin", handleFocusIn);
    form.addEventListener("focusout", handleFocusOut);
    return () => { form.removeEventListener("focusin", handleFocusIn); form.removeEventListener("focusout", handleFocusOut); };
  }, []);

  /* ─── Bubble up focused field & active tab to parent (for tips panel) ─── */
  useEffect(() => { if (onFocusedFieldChange) onFocusedFieldChange(focusedField); }, [focusedField, onFocusedFieldChange]);
  useEffect(() => { if (onActiveTabChange) onActiveTabChange(activeTab); }, [activeTab, onActiveTabChange]);

  /* ─── Phone validation helper (must be above update) ─── */
  const validatePhone = useCallback((val, code) => {
    if (!val || !val.trim()) return null;
    const digits = val.replace(/[\s-]/g, "");
    if (!/^\d+$/.test(digits)) return "Please enter digits only";
    const rule = PHONE_RULES[code];
    if (rule) {
      if (digits.length < rule.min || digits.length > rule.max)
        return `Expected ${rule.label} for ${code}`;
    } else {
      if (digits.length < 7 || digits.length > 15) return "Phone number should be 7-15 digits";
    }
    return null;
  }, []);

  /* ─── Re-validate a single field on change (clears error as soon as input is valid) ─── */
  const revalidateField = useCallback((field, value) => {
    const val = value && String(value).trim();

    // Required check first
    if (REQUIRED_FIELDS[field] && !val) {
      return `${REQUIRED_FIELDS[field]} is required`;
    }
    if (!val) return "";

    // Type-specific checks
    switch (field) {
      case "firstName":
      case "lastName":
        if (!NAME_RE.test(val)) return `${field === "firstName" ? "First" : "Last"} name should only contain letters, hyphens, and apostrophes`;
        if (val.length < 2) return `${field === "firstName" ? "First" : "Last"} name must be at least 2 characters`;
        break;
      case "companyName":
        if (val.length < 2) return "Company name must be at least 2 characters";
        break;
      case "regNumber":
        if (!ALNUM_RE.test(val)) return "Registration number should only contain letters, numbers, and hyphens";
        if (val.length < 4) return "Registration number appears too short";
        break;
      case "taxId":
        if (!ALNUM_RE.test(val)) return "Tax ID should only contain letters, numbers, and hyphens";
        if (val.length < 4) return "Tax ID appears too short";
        break;
      case "roleInCompany":
        if (val.length < 10) return "Please describe your role in at least 10 characters";
        if (!/[\p{L}]/u.test(val)) return "Role description must contain letters";
        break;
      case "addressLine1":
        if (val.length < 5) return "Address must be at least 5 characters";
        break;
      case "city":
        if (!ALPHA_SPACE_RE.test(val)) return "City name should only contain letters, hyphens, and spaces";
        if (val.length < 2) return "City name must be at least 2 characters";
        break;
      case "postcode":
        if (val.length < 3) return "Please enter a valid postcode";
        break;
      case "businessEmail":
      case "personalEmail":
        if (!EMAIL_RE.test(val)) return "Please enter a valid email address";
        break;
      case "linkedinUrl":
        if (!LINKEDIN_RE.test(val)) return "Please enter a valid LinkedIn profile URL";
        break;
      case "teamsHandle":
        if (!TEAMS_RE.test(val)) return "Teams handle should only contain letters, numbers, dots, and @";
        break;
      case "landlineNumber":
        return validatePhone(val, phoneCode1.code) || "";
      case "mobileNumber":
        return validatePhone(val, phoneCode2.code) || "";
      case "whatsappNumber":
        return validatePhone(val, whatsappCode.code) || "";
      default:
        break;
    }
    return "";
  }, [phoneCode1, phoneCode2, whatsappCode, validatePhone]);

  const update = useCallback((field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (touched[field] || submitted) {
      // Re-validate on every keystroke — error clears as soon as input becomes valid
      const err = revalidateField(field, value);
      setErrors((p) => ({ ...p, [field]: err }));
    }
  }, [touched, submitted, revalidateField]);

  /* Human-readable field labels for error panel */
  const FIELD_LABELS = {
    salutation: "Title",
    firstName: "First Name",
    lastName: "Last Name",
    companyName: "Company or Trading Name",
    regNumber: "Company Registration Number",
    taxId: "Tax ID / VAT Number",
    roleInCompany: "Your Role",
    addressLine1: "Address Line 1",
    addressLine2: "Address Line 2",
    city: "City / Town",
    postcode: "Postcode / ZIP",
    country: "Country",
    landlineNumber: "Telephone Number",
    mobileNumber: "Mobile Number",
    businessEmail: "Work Email Address",
    personalEmail: "Personal Email",
    teamsHandle: "Microsoft Teams",
    linkedinUrl: "LinkedIn Profile",
    whatsappNumber: "WhatsApp Number",
    languages: "Languages Spoken",
    yearEstablished: "Year Established",
    companySize: "Company Size",
  };

  const REQUIRED_FIELDS = {
    salutation: "Title",
    firstName: "First Name",
    lastName: "Last Name",
    companyName: "Company or Trading Name",
    addressLine1: "Address Line 1",
    city: "City / Town",
    postcode: "Postcode / ZIP",
    country: "Country",
    mobileNumber: "Mobile Number",
    businessEmail: "Work Email Address",
  };

  /* ─── Section-level status computation ─── */
  const getTabStatus = useCallback((tabId) => {
    const config = TAB_FIELDS[tabId];
    if (!config) return "empty";

    const reqFilled = config.required.every((f) => {
      if (f === "languages") return languages.length > 0;
      return form[f] && String(form[f]).trim().length > 0;
    });
    const optFilled = config.optional.some((f) => {
      return form[f] && String(form[f]).trim().length > 0;
    });
    const anyReqFilled = config.required.some((f) => {
      if (f === "languages") return languages.length > 0;
      return form[f] && String(form[f]).trim().length > 0;
    });

    if (config.required.length > 0 && reqFilled) return "complete";
    if (config.required.length === 0 && optFilled) return "complete";
    if (anyReqFilled || optFilled) return "partial";
    return "empty";
  }, [form, languages]);

  const tabStatuses = useMemo(() => ({
    personal: getTabStatus("personal"),
    address: getTabStatus("address"),
    contact: getTabStatus("contact"),
  }), [getTabStatus]);

  /* ─── Per-tab progress fraction (0-1) for progress circle badges ─── */
  const getTabProgress = useCallback((tabId) => {
    const config = TAB_FIELDS[tabId];
    if (!config) return 0;
    const REQUIRED_WEIGHT = 3;
    const OPTIONAL_WEIGHT = 1;
    let earned = 0;
    let total = 0;
    const isFilled = (f) => {
      if (f === "languages") return languages.length > 0;
      return form[f] && String(form[f]).trim().length > 0;
    };
    for (const f of config.required) { total += REQUIRED_WEIGHT; if (isFilled(f)) earned += REQUIRED_WEIGHT; }
    for (const f of config.optional) { total += OPTIONAL_WEIGHT; if (isFilled(f)) earned += OPTIONAL_WEIGHT; }
    return total > 0 ? earned / total : 0;
  }, [form, languages]);

  const tabProgress = useMemo(() => ({
    personal: getTabProgress("personal"),
    address: getTabProgress("address"),
    contact: getTabProgress("contact"),
  }), [getTabProgress]);

  /* ─── Validation ─── */
  const validate = useCallback((tabOnly = null) => {
    const errs = {};
    const v = (key) => form[key] && String(form[key]).trim(); // truthy trimmed value helper

    /* ── Required-field check ── */
    const checkField = (key, label) => {
      if (!form[key] || !String(form[key]).trim()) errs[key] = `${label} is required`;
    };
    const fieldsToCheck = tabOnly
      ? Object.entries(REQUIRED_FIELDS).filter(([key]) => TAB_FIELDS[tabOnly]?.required.includes(key) || TAB_FIELDS[tabOnly]?.optional.includes(key))
      : Object.entries(REQUIRED_FIELDS);
    fieldsToCheck.forEach(([key, label]) => checkField(key, label));

    /* ── Main Contact & Business tab ── */
    if (!tabOnly || tabOnly === "personal") {
      // First Name: letters only, min 2 chars
      if (v("firstName") && !NAME_RE.test(v("firstName"))) {
        errs.firstName = "First name should only contain letters, hyphens, and apostrophes";
      } else if (v("firstName") && v("firstName").length < 2) {
        errs.firstName = "First name must be at least 2 characters";
      }

      // Last Name: letters only, min 2 chars
      if (v("lastName") && !NAME_RE.test(v("lastName"))) {
        errs.lastName = "Last name should only contain letters, hyphens, and apostrophes";
      } else if (v("lastName") && v("lastName").length < 2) {
        errs.lastName = "Last name must be at least 2 characters";
      }

      // Company Name: min 2 chars
      if (v("companyName") && v("companyName").length < 2) {
        errs.companyName = "Company name must be at least 2 characters";
      }

      // Registration Number: alphanumeric, min 4
      if (v("regNumber")) {
        if (!ALNUM_RE.test(v("regNumber"))) {
          errs.regNumber = "Registration number should only contain letters, numbers, and hyphens";
        } else if (v("regNumber").length < 4) {
          errs.regNumber = "Registration number appears too short";
        }
      }

      // Tax ID: alphanumeric format
      if (v("taxId")) {
        if (!ALNUM_RE.test(v("taxId"))) {
          errs.taxId = "Tax ID should only contain letters, numbers, and hyphens";
        } else if (v("taxId").length < 4) {
          errs.taxId = "Tax ID appears too short";
        }
      }

      // Role: min 10 chars, must contain some letters (not purely numeric)
      if (v("roleInCompany")) {
        if (v("roleInCompany").length < 10) {
          errs.roleInCompany = "Please describe your role in at least 10 characters";
        } else if (!/[\p{L}]/u.test(v("roleInCompany"))) {
          errs.roleInCompany = "Role description must contain letters";
        }
      }
    }

    /* ── Address tab ── */
    if (!tabOnly || tabOnly === "address") {
      // Address Line 1: min 5 chars
      if (v("addressLine1") && v("addressLine1").length < 5) {
        errs.addressLine1 = "Address must be at least 5 characters";
      }

      // City: letters/hyphens/spaces only (no numbers)
      if (v("city") && !ALPHA_SPACE_RE.test(v("city"))) {
        errs.city = "City name should only contain letters, hyphens, and spaces";
      } else if (v("city") && v("city").length < 2) {
        errs.city = "City name must be at least 2 characters";
      }

      // Postcode: min 3 chars
      if (v("postcode") && v("postcode").length < 3) {
        errs.postcode = "Please enter a valid postcode";
      }
    }

    /* ── Contact Options tab ── */
    if (!tabOnly || tabOnly === "contact") {
      // Emails
      if (v("businessEmail") && !EMAIL_RE.test(v("businessEmail"))) {
        errs.businessEmail = "Please enter a valid email address (e.g. name@company.com)";
      }
      if (v("personalEmail") && !EMAIL_RE.test(v("personalEmail"))) {
        errs.personalEmail = "Please enter a valid email address";
      }

      // Languages
      if (languages.length === 0) errs.languages = "Please select at least one language";

      // Phones
      const phoneErr = validatePhone(form.mobileNumber, phoneCode2.code);
      if (v("mobileNumber") && phoneErr) errs.mobileNumber = phoneErr;
      const telErr = validatePhone(form.landlineNumber, phoneCode1.code);
      if (v("landlineNumber") && telErr) errs.landlineNumber = telErr;

      // WhatsApp
      if (v("whatsappNumber")) {
        const waErr = validatePhone(form.whatsappNumber, whatsappCode.code);
        if (waErr) errs.whatsappNumber = waErr;
      }

      // LinkedIn URL
      if (v("linkedinUrl") && !LINKEDIN_RE.test(v("linkedinUrl"))) {
        errs.linkedinUrl = "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/yourname)";
      }

      // Teams Handle: basic format check
      if (v("teamsHandle") && !TEAMS_RE.test(v("teamsHandle"))) {
        errs.teamsHandle = "Teams handle should only contain letters, numbers, dots, and @";
      }
    }

    return errs;
  }, [form, languages, validatePhone, phoneCode1, phoneCode2, whatsappCode]);

  const handleBlur = useCallback((field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    const val = form[field] && String(form[field]).trim();

    // Required check
    if (REQUIRED_FIELDS[field] && !val) {
      setErrors((p) => ({ ...p, [field]: `${REQUIRED_FIELDS[field]} is required` }));
      return;
    }

    // Type-specific blur validation for filled fields
    if (!val) return;

    let err = null;
    switch (field) {
      case "firstName":
      case "lastName": {
        if (!NAME_RE.test(val)) err = `${field === "firstName" ? "First" : "Last"} name should only contain letters, hyphens, and apostrophes`;
        else if (val.length < 2) err = `${field === "firstName" ? "First" : "Last"} name must be at least 2 characters`;
        break;
      }
      case "companyName":
        if (val.length < 2) err = "Company name must be at least 2 characters";
        break;
      case "regNumber":
        if (!ALNUM_RE.test(val)) err = "Registration number should only contain letters, numbers, and hyphens";
        else if (val.length < 4) err = "Registration number appears too short";
        break;
      case "taxId":
        if (!ALNUM_RE.test(val)) err = "Tax ID should only contain letters, numbers, and hyphens";
        else if (val.length < 4) err = "Tax ID appears too short";
        break;
      case "yearEstablished": {
        const currentYear = new Date().getFullYear();
        const yr = parseInt(val);
        if (isNaN(yr) || yr < 1800 || yr > currentYear) err = `Enter a year between 1800 and ${currentYear}`;
        break;
      }
      case "roleInCompany":
        if (val.length < 10) err = "Please describe your role in at least 10 characters";
        else if (!/[\p{L}]/u.test(val)) err = "Role description must contain letters";
        break;
      case "addressLine1":
        if (val.length < 5) err = "Address must be at least 5 characters";
        break;
      case "city":
        if (!ALPHA_SPACE_RE.test(val)) err = "City name should only contain letters, hyphens, and spaces";
        else if (val.length < 2) err = "City name must be at least 2 characters";
        break;
      case "postcode":
        if (val.length < 3) err = "Please enter a valid postcode";
        break;
      case "businessEmail":
        if (!EMAIL_RE.test(val)) err = "Please enter a valid email address (e.g. name@company.com)";
        break;
      case "personalEmail":
        if (!EMAIL_RE.test(val)) err = "Please enter a valid email address";
        break;
      case "linkedinUrl":
        if (!LINKEDIN_RE.test(val)) err = "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/yourname)";
        break;
      case "teamsHandle":
        if (!TEAMS_RE.test(val)) err = "Teams handle should only contain letters, numbers, dots, and @";
        break;
      case "landlineNumber":
        err = validatePhone(val, phoneCode1.code);
        break;
      case "mobileNumber":
        err = validatePhone(val, phoneCode2.code);
        break;
      case "whatsappNumber":
        err = validatePhone(val, whatsappCode.code);
        break;
      default:
        break;
    }
    setErrors((p) => ({ ...p, [field]: err || "" }));
  }, [form, validatePhone, phoneCode1, phoneCode2, whatsappCode]);

  /* ─── Find which tab a field belongs to ─── */
  const findTabForField = useCallback((fieldId) => {
    for (const [tabId, config] of Object.entries(TAB_FIELDS)) {
      if (config.required.includes(fieldId) || config.optional.includes(fieldId)) return tabId;
    }
    return "account";
  }, []);

  /* ─── Error click: switch tab + focus field ─── */
  const handleErrorClick = useCallback((fieldId) => {
    const errorTab = findTabForField(fieldId);
    if (errorTab !== activeTab) setActiveTab(errorTab);
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
    }, 100);
  }, [activeTab, findTabForField]);

  /* ─── Save & Continue (section) ─── */
  const [savingTab, setSavingTab] = useState(false);
  const [tabSaved, setTabSaved] = useState(false);
  useEffect(() => {
    if (!tabSaved) return;
    const t = setTimeout(() => setTabSaved(false), 9000);
    return () => clearTimeout(t);
  }, [tabSaved]);

  const handleSaveAndContinue = () => {
    const currentIdx = PROFILE_TABS.findIndex((t) => t.id === activeTab);
    const errs = validate(activeTab);
    setErrors((prev) => {
      // Keep errors from other tabs, replace current tab errors
      const otherErrs = {};
      Object.entries(prev).forEach(([k, v]) => {
        if (v && findTabForField(k) !== activeTab) otherErrs[k] = v;
      });
      return { ...otherErrs, ...errs };
    });
    setSubmitted(true);
    setErrorScope("tab"); // Only show current tab's errors

    if (Object.keys(errs).length > 0) {
      setShowErrorBanner(true);
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
      return;
    }
    setShowErrorBanner(false);

    // Save current tab's validated fields to database, then advance
    setSavingTab(true);
    const tabConfig = TAB_FIELDS[activeTab];
    const fieldsToSave = {};
    [...tabConfig.required, ...tabConfig.optional].forEach((f) => {
      if (f === "languages") { fieldsToSave.languages = languages; }
      else { fieldsToSave[f] = form[f]; }
    });

    // 🔧 PRODUCTION: Replace setTimeout with: const res = await fetch("/api/user/profile", { method: "PATCH", body: JSON.stringify({ tab: activeTab, fields: fieldsToSave }) });
    setTimeout(() => {
      setSavingTab(false);
      setTabSaved(true);
      setTimeout(() => setTabSaved(false), 1500);
      if (currentIdx < PROFILE_TABS.length - 1) {
        setActiveTab(PROFILE_TABS[currentIdx + 1].id);
        requestAnimationFrame(() => {
          if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }, 600);
  };

  /* ─── Save All ─── */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorScope("all"); // Show errors from all tabs
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setShowErrorBanner(true);
      const firstErrorKey = Object.keys(errs)[0];
      const errorTab = findTabForField(firstErrorKey);
      setActiveTab(errorTab);
      setTimeout(() => {
        const el = document.getElementById(firstErrorKey);
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); }
      }, 100);
      return;
    }
    setShowErrorBanner(false);
    setSaving(true);
    // 🔧 PRODUCTION: Replace setTimeout with actual API call: PUT /api/user/profile
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      clearDraft(); // Clear localStorage draft on successful save
      onSave?.(); // Notify parent for stale-profile timestamp tracking
      /* Persist current profile completeness for the sidebar indicator */
      try {
        const sf = (f) => form[f] && String(form[f]).trim().length > 0;
        const RW = 3, OW = 1; let e = 0, t = 0;
        for (const f of ["salutation","firstName","lastName","companyName","addressLine1","city","postcode","country","mobileNumber","businessEmail"]) { t += RW; if (sf(f)) e += RW; }
        t += RW; if (languages.length > 0) e += RW; // languages is required
        for (const f of ["regNumber","taxId","roleInCompany","yearEstablished","companySize","addressLine2","landlineNumber","personalEmail","teamsHandle","linkedinUrl","whatsappNumber"]) { t += OW; if (sf(f)) e += OW; }
        localStorage.setItem("wup-account-profile-pct", String(Math.round((e / t) * 100)));
      } catch {}
      setActiveTab(PROFILE_TABS[0].id); // Return to first tab to see overview
      setTimeout(() => {
        if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }, 800);
  };

  const currentTabIdx = PROFILE_TABS.findIndex((t) => t.id === activeTab);
  const isLastTab = currentTabIdx === PROFILE_TABS.length - 1;
  const completedCount = Object.values(tabStatuses).filter((s) => s === "complete").length;

  return (
      <form ref={formRef} onSubmit={handleSubmit} noValidate id="profile-form-card" style={{ scrollMarginTop: "120px" }}>
        {/* ═══ FULL-FORM squared paper grid background ═══ */}
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{
            backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />

          {/* ═══ HEADER ZONE — gradient tint over grid ═══ */}
          <div className="relative overflow-hidden">
            {/* Gradient wash — stronger slate tint that starts immediately and fades out */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-200/90 via-slate-100/60 to-transparent pointer-events-none" />

            <div className="relative px-6 lg:px-8 pt-6 lg:pt-8 pb-0">
              {/* Page Title + Progress */}
              <div className="mb-5 space-y-4">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900">Account Profile</h1>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Keep your account contact details current to ensure suppliers receive accurate information with your inquiries.
                  </p>
                </div>
                {/* ═══ SUCCESS BANNER ═══ */}
                {saved && (
                  <div className="rounded-xl overflow-hidden border border-emerald-200 animate-fadeIn" role="status">
                    <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-white shrink-0" strokeWidth={3} />
                        <p className="text-sm font-semibold text-white">Profile updated successfully</p>
                      </div>
                      <button type="button" onClick={() => setSaved(false)} className="w-6 h-6 rounded-full hover:bg-emerald-500 flex items-center justify-center transition-colors" aria-label="Dismiss">
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                    <div className="bg-emerald-50/80 px-4 py-3">
                      <p className="text-sm text-emerald-700">Your changes have been saved. Your updated profile will be used across WholesaleUp.</p>
                    </div>
                  </div>
                )}
                <ProfileProgressBar form={form} languages={languages} onPctChange={onProgressChange} />
              </div>

              {/* Tab Bar */}
              <ProfileTabBar activeTab={activeTab} setActiveTab={setActiveTab} tabStatuses={tabStatuses} tabProgress={tabProgress} tabs={PROFILE_TABS} />
            </div>
          </div>

          {/* ═══ FIELDS ZONE ═══ */}
          <div className="relative px-6 lg:px-8 pb-6 lg:pb-8">
            <div className="relative">

        {/* Error Banner — /contact format */}
        {showErrorBanner && (() => {
          // "tab" scope = Save & Continue → only show current tab's errors
          // "all" scope = Save All → show all errors (but only for the active tab view)
          const visibleErrors = errorScope === "tab"
            ? Object.fromEntries(
                Object.entries(errors).filter(([k, v]) => v && findTabForField(k) === activeTab)
              )
            : errors;
          return (
            <ErrorSummaryPanel
              errors={visibleErrors}
              fieldLabels={FIELD_LABELS}
              onFieldClick={handleErrorClick}
              onDismiss={() => setShowErrorBanner(false)}
            />
          );
        })()}

        {/* ═══ TAB PANELS ═══ */}
        <div className="mt-6">

          {/* ─── Tab 1: Main Contact & Business ─── */}
          {activeTab === "personal" && (
            <div role="tabpanel" id="panel-personal" aria-labelledby="tab-personal" className="space-y-6 animate-fadeIn">
              <FormSection title="Main Contact" icon={User}>
                <div className="space-y-4">
                  {/* Salutation + First Name + Last Name in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-3">
                    {/* Salutation as compact dropdown — uses dropdown shadow, not input shadow */}
                    <div className="w-full md:w-24">
                      <label htmlFor="salutation" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title<span className="text-red-400 ml-0.5">*</span></label>
                      <div className="relative">
                        <select
                          id="salutation"
                          value={form.salutation}
                          onChange={(e) => update("salutation", e.target.value)}
                          onBlur={handleBlur("salutation")}
                          required
                          aria-required={true}
                          aria-invalid={!!errors.salutation}
                          aria-describedby={errors.salutation ? "salutation-error" : undefined}
                          className={`w-full py-3.5 pl-3 pr-7 text-sm text-slate-800 bg-white border rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] appearance-none cursor-pointer transition-all ${errors.salutation ? "border-red-300 outline outline-1 outline-red-100 bg-red-50 focus:border-red-400 focus:outline focus:outline-2 focus:outline-red-100" : form.salutation ? "border-emerald-400 outline outline-1 outline-emerald-100 bg-emerald-50 focus:border-emerald-500 focus:outline focus:outline-2 focus:outline-emerald-100" : "border-slate-200 focus:border-orange-400 focus:outline focus:outline-2 focus:outline-orange-100"}`}
                        >
                          <option value="">--</option>
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="N/S">N/S</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                      {errors.salutation && <p id="salutation-error" role="alert" className="text-xs text-red-600 mt-1 ml-1">{errors.salutation}</p>}
                    </div>
                    <div>
                      <label className="hidden md:block text-[10px] font-bold text-transparent mb-1.5">_</label>
                      <FloatingField id="firstName" label="First Name" required icon={User} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} onBlur={handleBlur("firstName")} error={errors.firstName} autoComplete="given-name" help="Min. 2 characters" />
                    </div>
                    <div>
                      <label className="hidden md:block text-[10px] font-bold text-transparent mb-1.5">_</label>
                      <FloatingField id="lastName" label="Last Name" required icon={User} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} onBlur={handleBlur("lastName")} error={errors.lastName} autoComplete="family-name" help="Min. 2 characters" />
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Business Information" icon={Building2}>
                <div className="space-y-5">
                  <FloatingField id="companyName" label="Company or Trading Name" required icon={Building2} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} onBlur={handleBlur("companyName")} error={errors.companyName} autoComplete="organization" help="Min. 2 characters" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingField id="regNumber" label="Company Registration Number" icon={FileText} value={form.regNumber} onChange={(e) => update("regNumber", e.target.value)} error={errors.regNumber} placeholder="e.g. 12345678" help="Your official company registration or incorporation number. Min. 4 characters" />
                    <FloatingField id="taxId" label="Tax ID / VAT Number" icon={FileText} value={form.taxId} onChange={(e) => update("taxId", e.target.value)} error={errors.taxId} placeholder="e.g. GB123456789" help="Used for invoicing. UK: GB + 9 digits. US: EIN format. Min. 4 characters" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingField id="yearEstablished" label="Year Established" icon={Building2} value={form.yearEstablished} onChange={(e) => update("yearEstablished", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={handleBlur("yearEstablished")} error={errors.yearEstablished} inputMode="numeric" placeholder="e.g. 2015" help="Between 1800 and current year" />
                    <FloatingSelect id="companySize" label="Company Size" value={form.companySize} onChange={(v) => update("companySize", v)} options={COMPANY_SIZES} placeholder="Select..." />
                  </div>
                  <FloatingTextarea id="roleInCompany" label="Describe Your Role in the Company" value={form.roleInCompany} onChange={(e) => update("roleInCompany", e.target.value)} onBlur={handleBlur("roleInCompany")} error={errors.roleInCompany} maxLength={500} placeholder="e.g. I am the Purchasing Manager responsible for sourcing wholesale electronics..." help="Min. 10 characters" />
                </div>
              </FormSection>
            </div>
          )}

          {/* ─── Tab 3: Address ─── */}
          {activeTab === "address" && (
            <div role="tabpanel" id="panel-address" aria-labelledby="tab-address" className="animate-fadeIn">
              <FormSection title="Business Address" icon={MapPin}>
                <div className="space-y-4">
                  {/* Use my location button
                      🔧 PRODUCTION REQUIREMENTS:
                      1. Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to .env.local
                      2. Create API route: GET /api/geocode/reverse?lat=XX&lng=YY
                         - Server-side call to Google Maps Geocoding API (keeps API key secret)
                         - Returns: { addressLine1, city, postcode, country }
                      3. Enable Maps Static API + Geocoding API in Google Cloud Console
                      4. Restrict API key to your domain in Google Cloud Console
                  */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        setGeoError("Geolocation is not supported by your browser");
                        return;
                      }
                      setGeoLoading(true);
                      setGeoError(null);
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          try {
                            const { latitude, longitude } = pos.coords;
                            setGeoCoords({ lat: latitude, lng: longitude });

                            // 🔧 PRODUCTION: Uncomment to reverse-geocode and auto-fill address fields:
                            // const res = await fetch(`/api/geocode/reverse?lat=${latitude}&lng=${longitude}`);
                            // if (res.ok) {
                            //   const data = await res.json();
                            //   if (data.addressLine1) update("addressLine1", data.addressLine1);
                            //   if (data.city) update("city", data.city);
                            //   if (data.postcode) update("postcode", data.postcode);
                            //   if (data.country) update("country", data.country);
                            // }
                          } catch (_e) {
                            setGeoError("Could not detect your location. Please enter your address manually.");
                          }
                          setGeoLoading(false);
                        },
                        (err) => {
                          setGeoLoading(false);
                          if (err.code === 1) setGeoError("Location access denied. Please allow location access or enter your address manually.");
                          else if (err.code === 2) setGeoError("Location unavailable. Please enter your address manually.");
                          else setGeoError("Location request timed out. Please enter your address manually.");
                        },
                        { enableHighAccuracy: false, timeout: 8000 }
                      );
                    }}
                    disabled={geoLoading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    aria-label="Detect my location and auto-fill address"
                  >
                    {geoLoading ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
                    {geoLoading ? "Detecting location..." : "Use my location"}
                  </button>
                  {geoError && <p className="text-xs text-amber-600 -mt-2">{geoError}</p>}

                  <FloatingField id="addressLine1" label="Address Line 1" required icon={MapPin} value={form.addressLine1} onChange={(e) => update("addressLine1", e.target.value)} onBlur={handleBlur("addressLine1")} error={errors.addressLine1} autoComplete="address-line1" placeholder="Street address, P.O. box" help="Min. 5 characters" />
                  <FloatingField id="addressLine2" label="Address Line 2" icon={MapPin} value={form.addressLine2} onChange={(e) => update("addressLine2", e.target.value)} autoComplete="address-line2" placeholder="Apartment, suite, unit, building, floor" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingField id="city" label="City / Town" required icon={Building2} value={form.city} onChange={(e) => update("city", e.target.value)} onBlur={handleBlur("city")} error={errors.city} autoComplete="address-level2" help="Min. 2 characters" />
                    <FloatingField id="postcode" label="Postcode / ZIP Code" required icon={MapPin} value={form.postcode} onChange={(e) => update("postcode", e.target.value)} onBlur={handleBlur("postcode")} error={errors.postcode} autoComplete="postal-code" help="Min. 3 characters" />
                  </div>
                  <CountrySelect id="country" label="Country" icon={Globe} value={form.country} onChange={(e) => update("country", e.target.value)} onBlur={handleBlur("country")} error={errors.country} required />

                  {/* Static map preview
                      🔧 PRODUCTION: Requires NEXT_PUBLIC_GOOGLE_MAPS_KEY env var.
                      Map renders after user fills city/country OR uses geolocation.
                      Consider debouncing the address→map update (wait for user to stop typing).
                  */}
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    {(form.city || form.country || geoCoords) ? (
                      <div className="relative">
                        <img
                          src={geoCoords
                            ? `https://maps.googleapis.com/maps/api/staticmap?center=${geoCoords.lat},${geoCoords.lng}&zoom=13&size=600x180&scale=2&maptype=roadmap&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`
                            : `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent([form.addressLine1, form.city, form.postcode, form.country].filter(Boolean).join(", "))}&zoom=13&size=600x180&scale=2&maptype=roadmap&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`
                          }
                          alt="Map preview"
                          className="w-full h-[140px] object-cover"
                          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                        />
                        {/* Fallback when API key not set */}
                        <div className="w-full h-[140px] items-center justify-center gap-2 text-slate-400 hidden">
                          <MapPin size={20} />
                          <span className="text-sm">Map preview — requires Google Maps API key</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[140px] flex items-center justify-center gap-2 text-slate-400">
                        <MapPin size={20} />
                        <span className="text-sm">Map preview will appear as you fill in your address</span>
                      </div>
                    )}
                  </div>
                </div>
              </FormSection>
            </div>
          )}

          {/* ─── Tab 4: Contact Options ─── */}
          {activeTab === "contact" && (
            <div role="tabpanel" id="panel-contact" aria-labelledby="tab-contact" className="animate-fadeIn">
              <FormSection title="Communication" icon={Phone}>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Email Addresses</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingField id="businessEmail" label="Work Email Address" required icon={Mail} type="email" inputMode="email" value={form.businessEmail} onChange={(e) => update("businessEmail", e.target.value)} onBlur={handleBlur("businessEmail")} error={errors.businessEmail} autoComplete="email" help="Used for supplier communication via our messaging system — never shared directly" />
                    <FloatingField id="personalEmail" label="Personal Email" icon={Mail} type="email" inputMode="email" value={form.personalEmail} onChange={(e) => update("personalEmail", e.target.value)} onBlur={handleBlur("personalEmail")} error={errors.personalEmail} autoComplete="email" help="For account recovery only — never shared" />
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Phone Numbers</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PhoneInput id="landlineNumber" label="Landline Number" phoneCode={phoneCode1} setPhoneCode={setPhoneCode1} value={form.landlineNumber} onChange={(e) => update("landlineNumber", e.target.value)} onBlur={handleBlur("landlineNumber")} error={errors.landlineNumber} />
                    <PhoneInput id="mobileNumber" label="Mobile Number" required phoneCode={phoneCode2} setPhoneCode={setPhoneCode2} value={form.mobileNumber} onChange={(e) => update("mobileNumber", e.target.value)} onBlur={handleBlur("mobileNumber")} error={errors.mobileNumber} />
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Other Contact Channels</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingField id="teamsHandle" label="Microsoft Teams Handle" icon={AtSign} value={form.teamsHandle} onChange={(e) => update("teamsHandle", e.target.value)} placeholder="e.g. john.doe" help="Your Teams username for direct messaging" />
                    <FloatingField id="linkedinUrl" label="LinkedIn Profile URL" icon={Linkedin} value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} error={errors.linkedinUrl} placeholder="linkedin.com/in/yourname" inputMode="url" help="Full URL: linkedin.com/in/yourname" />
                  </div>
                  <PhoneInput id="whatsappNumber" label="WhatsApp Number" phoneCode={whatsappCode} setPhoneCode={setWhatsappCode} value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} onBlur={handleBlur("whatsappNumber")} error={errors.whatsappNumber} />

                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">Languages Spoken</p>
                  <LanguageSelector id="languages" selected={languages} setSelected={setLanguages} required error={errors.languages} />
                </div>
              </FormSection>
            </div>
          )}
        </div>

        {/* ═══ BOTTOM NAVIGATION ═══ */}
        <div className="pt-6 pb-2 mt-6">
          {/* Buttons — grouped bottom-right */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-[0px_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2 active:scale-95"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Shield size={16} />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
            </button>
            {!isLastTab && (
              <button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={savingTab}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {savingTab ? <Loader2 size={15} className="animate-spin" /> : tabSaved ? <Check size={15} /> : null}
                {savingTab ? "Saving..." : tabSaved ? "Saved!" : "Save & Continue"}
                {!savingTab && !tabSaved && <ArrowRight size={15} />}
              </button>
            )}
          </div>
        </div>
          </div>{/* /relative */}
        </div>{/* /fields zone */}
        </div>{/* /full-form grid wrapper */}
      </form>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — Phase 5 Account Dashboard
   Renders within the app shell (header/sidebar/footer
   provided by root layout + app-layout.jsx)
   ═══════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════
   /dashboard/account-profile — Account Profile page (tabbed form)
   ═══════════════════════════════════════════════════ */
export function AccountProfilePage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");
  const [tipsCollapsed, toggleTips] = usePanelCollapse("wup-tips-collapsed");
  const [focusedField, setFocusedField] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState("personal");

  /* ─── Stale profile tracking (lives at page level so banner renders outside the form card) ─── */
  const { recordSave, getDaysStale } = useProfileSaveTime("account");
  const daysStale = getDaysStale();
  const [staleDismissed, setStaleDismissed] = useState(false);
  const showStaleWarning = daysStale !== null && daysStale >= 30 && !staleDismissed;
  const formRef = useRef(null);

  /* ─── Live profile completeness for sidebar ─── */
  const [livePct, setLivePct] = useState(null);
  const handleProgressChange = useCallback((pct) => {
    setLivePct(pct);
    /* Keep localStorage in sync so the sidebar shows the correct pct on OTHER pages */
    try { localStorage.setItem("wup-account-profile-pct", String(pct)); } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Account Profile" },
        ]} />
        <MobileDashboardNav activePage="account-profile" />

        <div className="flex gap-6 items-start">
          <AccountSidebar user={user} activePage="account-profile" collapsed={sidebarCollapsed} onToggle={toggleSidebar} accountPct={livePct} />

          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />
            {/* ═══ STALE PROFILE WARNING — above the form card ═══ */}
            {showStaleWarning && (
              <StaleProfileBanner
                daysStale={daysStale}
                profileType="account"
                onDismiss={() => setStaleDismissed(true)}
                onReviewClick={() => {
                  if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
            )}
            <div ref={formRef} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <AccountProfileForm user={user} onFocusedFieldChange={setFocusedField} onActiveTabChange={setActiveFormTab} onSave={recordSave} onProgressChange={handleProgressChange} />
            </div>
          </div>

          {/* Contextual Tips Panel — 2xl+ only */}
          <FormTipsPanel
            focusedField={focusedField}
            activeTab={activeFormTab}
            collapsed={tipsCollapsed}
            onToggle={toggleTips}
            tipsData={TIPS_DATA}
            defaultTips={TAB_DEFAULT_TIPS}
            defaultTabKey="personal"
            bottomSection={ACCOUNT_TIPS_BOTTOM}
          />
        </div>
      </div>

      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}
