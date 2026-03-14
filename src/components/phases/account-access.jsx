"use client";

import { useState, useRef, useEffect } from "react";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import { FormTipsPanel } from "@/components/shared/form-tips-panel";
import Breadcrumb from "@/components/shared/breadcrumb";
import {
  User,
  UserCheck,
  Lock,
  Shield,
  ShieldCheck,
  Pencil,
  Eye,
  EyeOff,
  X,
  Check,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  KeyRound,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  AccountSidebar,
  UpgradeBanner,
  MobileDashboardNav,
  usePageUser,
} from "@/components/phases/dashboard";

/* ═══════════════════════════════════════════════════
   FOCUS TRAP HOOK — reusable for all modals
   Keeps Tab / Shift+Tab cycling within the modal.
   Returns a ref to attach to the dialog element.
   ═══════════════════════════════════════════════════ */
function useFocusTrap(isOpen) {
  const ref = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Store the element that had focus before modal opened
    previousFocusRef.current = document.activeElement;

    const modal = ref.current;
    if (!modal) return;

    const focusable = () =>
      modal.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    modal.addEventListener("keydown", handleTab);
    // Auto-focus first input/textarea/select, falling back to first focusable
    requestAnimationFrame(() => {
      const firstInput = modal.querySelector('input:not([disabled]), textarea:not([disabled]), select:not([disabled])');
      if (firstInput) { firstInput.focus(); }
      else { const els = focusable(); if (els.length) els[0].focus(); }
    });

    return () => {
      modal.removeEventListener("keydown", handleTab);
      // Return focus to the element that triggered the modal
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return ref;
}

/* ─────────── Floating Field (local copy) ─────────── */
function FloatingField({ label, required, error, value, onChange, onBlur, type = "text", placeholder = "", id, icon: Icon, disabled, autoComplete = "off", inputMode, className = "", children, autoFocus, onClick }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).trim().length > 0;
  const floated = focused || hasValue;
  const errorId = id && error ? `${id}-error` : undefined;

  /* Disabled fields get flat styling — no inset shadow, bg-slate-50 */
  const isDisabledField = !!disabled;

  const stateStyle = error
    ? "border-red-300 outline outline-1 outline-red-100"
    : focused
    ? "border-orange-400 outline outline-2 outline-orange-100"
    : hasValue
    ? "border-emerald-400 outline outline-1 outline-emerald-100"
    : "border-slate-200";

  const bgColor = isDisabledField ? "bg-slate-50" : error ? "bg-red-50" : focused ? "bg-white" : hasValue ? "bg-emerald-50" : "bg-white";

  /* Disabled fields: no inset shadow. Active fields: inset shadow */
  const shadowClass = isDisabledField ? "" : "shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]";

  return (
    <div className={className}>
      <div
        className={`relative rounded-lg border transition-all duration-200 ${shadowClass} ${stateStyle} ${bgColor} ${isDisabledField ? "cursor-pointer group/field" : ""}`}
        onClick={isDisabledField && onClick ? onClick : undefined}
        role={isDisabledField && onClick ? "button" : undefined}
        tabIndex={isDisabledField && onClick ? 0 : undefined}
        onKeyDown={isDisabledField && onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
        aria-label={isDisabledField && onClick ? `Change ${label}` : undefined}
      >
        <label
          htmlFor={id}
          className={`absolute transition-all duration-200 pointer-events-none ${Icon ? "left-10" : "left-3.5"} ${
            floated
              ? "-top-2.5 text-xs font-semibold px-1 bg-white rounded"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${
            error ? "text-red-600" : focused ? "text-orange-500" : hasValue ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={15} className={error ? "text-red-400" : focused ? "text-orange-400" : hasValue ? "text-emerald-500" : "text-slate-400"} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={(e) => { setFocused(false); if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); } }}
          className={`w-full py-3.5 text-sm text-slate-800 bg-transparent outline-none rounded-lg ${Icon ? "pl-10 pr-9" : "pl-3.5 pr-9"} ${disabled ? "cursor-pointer pointer-events-none" : ""}`}
          placeholder={focused ? placeholder : ""}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          required={required || undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          autoFocus={autoFocus || undefined}
          tabIndex={isDisabledField ? -1 : undefined}
        />
        {children || (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : hasValue && !disabled ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span> : null}
          </div>
        )}
        {/* Hover CHANGE button — only on disabled clickable fields */}
        {isDisabledField && onClick && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/field:opacity-100 transition-opacity duration-200 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-md">
              <Pencil size={9} />
              CHANGE
            </span>
          </div>
        )}
      </div>
      {error && <p id={errorId} className="text-xs text-red-600 mt-1 ml-1" role="alert">{error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANGE USERNAME MODAL
   ═══════════════════════════════════════════════════ */
function ChangeUsernameModal({ isOpen, onClose, currentUsername }) {
  const [newUsername, setNewUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null); // null | true | false
  const checkTimer = useRef(null);
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setNewUsername(""); setError(""); setSaving(false); setTouched(false); setChecking(false); setAvailable(null);
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const USERNAME_RULES = [
    { key: "length", test: (v) => v.length >= 3 && v.length <= 30, label: "3–30 chars" },
    { key: "chars", test: (v) => /^[a-zA-Z0-9_-]+$/.test(v), label: "Letters, numbers, _ -" },
    { key: "start", test: (v) => /^[a-zA-Z0-9]/.test(v), label: "Starts with letter or number" },
  ];

  const val = newUsername.trim();
  const allRulesPass = val.length > 0 && USERNAME_RULES.every((r) => r.test(val));

  const handleChange = (e) => {
    const v = e.target.value;
    setNewUsername(v);
    setError("");
    setAvailable(null);
    // Debounced availability check
    if (checkTimer.current) clearTimeout(checkTimer.current);
    const trimmed = v.trim();
    if (trimmed.length >= 3 && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(trimmed)) {
      setChecking(true);
      checkTimer.current = setTimeout(() => {
        // 🔧 PRODUCTION: GET /api/user/check-username?username=...
        const taken = ["admin", "wholesaleup", "bestbuyer", "support"].includes(trimmed.toLowerCase());
        setAvailable(!taken);
        setChecking(false);
        if (taken) setError("This username is already taken");
      }, 800);
    } else {
      setChecking(false);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    if (!val) { setError("Username is required"); return; }
    if (val.length < 3) { setError("Username must be at least 3 characters"); return; }
    if (!/^[a-zA-Z0-9]/.test(val)) { setError("Username must start with a letter or number"); return; }
    if (!/^[a-zA-Z0-9_-]+$/.test(val)) { setError("Only letters, numbers, underscores, and hyphens allowed"); return; }
    if (val.length > 30) { setError("Username cannot exceed 30 characters"); return; }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setTouched(true);
    if (!val) { setError("Username is required"); return; }
    if (!allRulesPass) { setError("Please fix the username format"); return; }
    if (available === false) { setError("This username is already taken"); return; }
    if (val.toLowerCase() === currentUsername.toLowerCase()) { setError("New username must be different from your current one"); return; }
    setSaving(true);
    // 🔧 PRODUCTION: PUT /api/user/username
    setTimeout(() => { setSaving(false); onClose(); }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Change Username" className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header — orange gradient matching site brand */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 relative overflow-hidden">
          <User size={80} className="absolute right-28 top-1/2 -translate-y-1/2 text-white/[0.10]" strokeWidth={1.2} />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Pencil size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Change Username</h2>
                <p className="text-orange-100 text-xs mt-0.5">Update your login identifier</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" style={{ minWidth: 44, minHeight: 44 }} aria-label="Close modal">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">
            Your current username is <span className="font-semibold text-slate-700">{currentUsername}</span>. Enter a new username below.
          </p>
          <form onSubmit={handleSave} noValidate>
          <FloatingField id="new-username" label="New Username" required icon={User} value={newUsername} onChange={handleChange} onBlur={handleBlur} error={error} autoComplete="username" autoFocus>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {checking ? <Loader2 size={15} className="text-orange-400 animate-spin" /> : error ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : available === true && allRulesPass ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span> : null}
            </div>
          </FloatingField>
          {/* Availability status */}
          {checking && <p className="text-[10px] text-orange-500 mt-1.5 ml-1" aria-live="polite" aria-atomic="true">Checking availability...</p>}
          {available === true && allRulesPass && !error && <p className="text-[10px] text-emerald-600 mt-1.5 ml-1 flex items-center gap-1" role="status"><CheckCircle2 size={10} /> Username is available</p>}
          {/* Rule pills — always visible */}
          <div className="flex flex-nowrap items-center gap-1.5 mt-2.5 px-0.5" role="status" aria-label="Username requirements">
            {USERNAME_RULES.map((r) => {
              const pass = val.length > 0 && r.test(val);
              return (
                <span key={r.key} className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-px rounded transition-all duration-300 ${pass ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "text-slate-400 border border-slate-200"}`}>
                  {pass && <span className="w-[12px] h-[12px] rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={7} className="text-white" strokeWidth={3} /></span>}
                  {r.label}
                </span>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-3 mt-5">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]">Cancel</button>
            <button type="submit" disabled={saving || checking} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white text-sm font-bold rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
              {saving ? "Saving..." : "Update Username"}
            </button>
          </div>
        </form>
        </div>{/* /body padding */}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHANGE PASSWORD MODAL
   ═══════════════════════════════════════════════════ */
const PASSWORD_FIELD_LABELS = {
  current: "Current Password",
  newPass: "New Password",
  confirm: "Confirm Password",
};

function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    setForm({ current: "", newPass: "", confirm: "" });
    setErrors({}); setSaving(false); setShowCurrent(false); setShowNew(false); setShowConfirm(false); setTouched({}); setSubmitAttempted(false);
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const PASSWORD_RULES = [
    { key: "length", test: (v) => v.length >= 8, label: "8+ chars" },
    { key: "upper", test: (v) => /[A-Z]/.test(v), label: "Uppercase" },
    { key: "number", test: (v) => /[0-9]/.test(v), label: "Number" },
    { key: "special", test: (v) => /[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'/~`]/.test(v), label: "Symbol" },
  ];

  const passScore = PASSWORD_RULES.filter((r) => r.test(form.newPass)).length + (form.newPass.length >= 12 ? 1 : 0);
  const allPasswordRulesPass = PASSWORD_RULES.every((r) => r.test(form.newPass));
  const strengthLabel = form.newPass.length === 0 ? "" : passScore <= 1 ? "Weak" : passScore <= 3 ? "Fair" : "Strong";
  const strengthColor = passScore <= 1 ? "text-red-500" : passScore <= 3 ? "text-amber-500" : "text-emerald-600";
  const strengthBarColor = passScore <= 1 ? "bg-red-400" : passScore <= 3 ? "bg-amber-400" : "bg-emerald-400";
  const confirmMatch = form.confirm.length > 0 && form.newPass === form.confirm;

  const update = (field, val) => {
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    if (field === "current" && !form.current) setErrors((p) => ({ ...p, current: "Current password is required" }));
    if (field === "newPass" && form.newPass && !allPasswordRulesPass) setErrors((p) => ({ ...p, newPass: "Password doesn't meet all requirements" }));
    if (field === "confirm") {
      if (!form.confirm) setErrors((p) => ({ ...p, confirm: "Please confirm your new password" }));
      else if (form.newPass && form.confirm !== form.newPass) setErrors((p) => ({ ...p, confirm: "Passwords do not match" }));
    }
  };

  const focusField = (fieldKey) => {
    const map = { current: "aa-current-password", newPass: "aa-new-password", confirm: "aa-confirm-password" };
    const el = document.getElementById(map[fieldKey]);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => el.focus(), 300); }
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSubmitAttempted(true);
    const errs = {};
    if (!form.current) errs.current = "Current password is required";
    if (!form.newPass) errs.newPass = "New password is required";
    else if (!allPasswordRulesPass) errs.newPass = "Password doesn't meet all requirements";
    if (!form.confirm) errs.confirm = "Please confirm your new password";
    else if (form.newPass && form.confirm !== form.newPass) errs.confirm = "Passwords do not match";
    if (form.newPass && form.current && form.newPass === form.current) errs.newPass = "New password must differ from current";
    setErrors(errs);
    setTouched({ current: true, newPass: true, confirm: true });
    if (Object.keys(errs).length > 0) {
      // Scroll to error summary
      setTimeout(() => {
        const panel = document.getElementById("modal-errors-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    setSaving(true);
    // 🔧 PRODUCTION: PUT /api/user/password
    setTimeout(() => { setSaving(false); onClose(); }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Change Password" className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header — slate gradient for security context */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4 relative overflow-hidden">
          <ShieldCheck size={80} className="absolute right-28 top-1/2 -translate-y-1/2 text-white/[0.10]" strokeWidth={1.2} />
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Pencil size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Change Password</h2>
                <p className="text-slate-300 text-xs mt-0.5">Update your account security</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors" style={{ minWidth: 44, minHeight: 44 }} aria-label="Close modal">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-6">
        {/* Error summary panel — matching /contact pattern */}
        {submitAttempted && Object.keys(errors).filter((k) => errors[k]).length > 0 && (
          <div id="modal-errors-panel" role="alert" className="mb-4 rounded-xl overflow-hidden border border-red-200">
            <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
              <AlertTriangle size={14} className="text-white shrink-0" />
              <p className="text-sm font-semibold text-white">
                Please fix {Object.keys(errors).filter((k) => errors[k]).length} error{Object.keys(errors).filter((k) => errors[k]).length !== 1 ? "s" : ""} below
              </p>
            </div>
            <div className="bg-red-50/80">
              {Object.entries(errors).filter(([, msg]) => msg).map(([field, message], i, arr) => (
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
                    <span className="font-semibold text-red-800 underline underline-offset-2 decoration-red-300 group-hover:decoration-red-500">
                      {PASSWORD_FIELD_LABELS[field] || field}
                    </span>
                    <span className="text-red-600/70 mx-1.5">&mdash;</span>
                    <span className="text-red-600">{message}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSave} noValidate>
          <div className="space-y-4">
            {/* Current Password */}
            <FloatingField id="aa-current-password" label="Current Password" required icon={Lock} type={showCurrent ? "text" : "password"} value={form.current} onChange={(e) => update("current", e.target.value)} onBlur={() => handleBlur("current")} error={errors.current} autoComplete="current-password" autoFocus>
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={showCurrent ? "Hide password" : "Show password"} aria-pressed={showCurrent}>
                {showCurrent ? <EyeOff size={15} className="text-slate-400" /> : <Eye size={15} className="text-slate-400" />}
              </button>
            </FloatingField>

            {/* New Password */}
            <div>
              <FloatingField id="aa-new-password" label="New Password" required icon={Lock} type={showNew ? "text" : "password"} value={form.newPass} onChange={(e) => update("newPass", e.target.value)} onBlur={() => handleBlur("newPass")} error={errors.newPass} autoComplete="new-password">
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={showNew ? "Hide password" : "Show password"} aria-pressed={showNew}>
                  {showNew ? <EyeOff size={15} className="text-slate-400" /> : <Eye size={15} className="text-slate-400" />}
                </button>
              </FloatingField>
              {/* Rule pills + strength dot — always visible */}
              <div className="flex flex-nowrap items-center gap-1.5 mt-2 px-0.5" role="status" aria-label="Password requirements">
                {PASSWORD_RULES.map((r) => {
                  const pass = form.newPass.length > 0 && r.test(form.newPass);
                  return (
                    <span key={r.key} className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-px rounded transition-all duration-300 ${pass ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "text-slate-400 border border-slate-200"}`}>
                      {pass && <span className="w-[12px] h-[12px] rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Check size={7} className="text-white" strokeWidth={3} /></span>}
                      {r.label}
                    </span>
                  );
                })}
                {form.newPass && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${strengthBarColor}`} />
                    <span className={`text-[10px] font-semibold ${strengthColor}`}>{strengthLabel}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <FloatingField id="aa-confirm-password" label="Confirm New Password" required icon={Lock} type={showConfirm ? "text" : "password"} value={form.confirm} onChange={(e) => update("confirm", e.target.value)} onBlur={() => handleBlur("confirm")} error={errors.confirm} autoComplete="new-password">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {form.confirm.length > 0 && !errors.confirm && (
                    confirmMatch
                      ? <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>
                      : touched.confirm ? <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"><X size={10} className="text-white" strokeWidth={3} /></span> : null
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="p-1 hover:bg-slate-100 rounded min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={showConfirm ? "Hide password" : "Show password"} aria-pressed={showConfirm}>
                    {showConfirm ? <EyeOff size={15} className="text-slate-400" /> : <Eye size={15} className="text-slate-400" />}
                  </button>
                </div>
              </FloatingField>
              {confirmMatch && !errors.confirm && <p className="text-[10px] text-emerald-600 mt-1 ml-1 flex items-center gap-1" role="status"><CheckCircle2 size={10} /> Passwords match</p>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 mt-5">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white text-sm font-bold rounded-lg shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.12)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)] transition-all duration-200 flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
        </div>{/* /body padding */}
      </div>
    </div>
  );
}

/* ─────────── Tips data for Account Access ─────────── */
const ACCESS_TIPS = {
  username: {
    icon: User,
    title: "Your Username",
    tip: "Your username is your unique identifier on WholesaleUp. Choose something professional and memorable — suppliers will see it when you send inquiries.",
  },
  password: {
    icon: Lock,
    title: "Password Security",
    tip: "Use a strong, unique password with at least 8 characters. Include uppercase letters, numbers, and special characters. Never reuse passwords from other services.",
  },
};

const ACCESS_DEFAULT_TIP = {
  icon: Shield,
  title: "Account Security",
  tip: "Keep your login credentials secure and up to date. A strong username and password protect your account, your inquiries, and your business relationships on WholesaleUp.",
};

/* 🔧 PRODUCTION: Replace lastChangedDays with real data from
   GET /api/user/security-info → { passwordLastChangedAt: ISO string }
   Calculate days via: Math.floor((Date.now() - new Date(passwordLastChangedAt)) / 86400000)
   Also fetch: lastLoginAt, twoFactorEnabled, loginHistory[] */
const ACCESS_LAST_CHANGED_DAYS = 42; // Demo value

const ACCESS_TIPS_BOTTOM = (
  <div className="border-t border-slate-100 px-4 py-3">
    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Security Info</p>
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <KeyRound size={12} className="text-orange-500 shrink-0" />
        <span>Password last changed <strong className="text-slate-700">{ACCESS_LAST_CHANGED_DAYS} days ago</strong></span>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <Check size={12} className="text-emerald-500 shrink-0" />
        <span>Use a password manager to generate unique passwords</span>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <Check size={12} className="text-emerald-500 shrink-0" />
        <span>Never share credentials with anyone</span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   ACCOUNT ACCESS FORM — username + password only
   ═══════════════════════════════════════════════════ */
function AccountAccessForm({ onFocusedFieldChange }) {
  const [username, setUsername] = useState("BestBuyer");
  const [password] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div>
        {/* ═══ HEADER ZONE — gradient tint over grid, full card width ═══ */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-200/90 via-slate-100/60 to-transparent pointer-events-none" />
          <div className="relative px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
            <h1 className="text-xl font-extrabold text-slate-900">Account Access</h1>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Manage your login credentials. Keep your username and password secure and up to date.
            </p>
          </div>
        </div>

        {/* ═══ FIELDS ZONE ═══ */}
        <div className="px-6 lg:px-8 pb-6 lg:pb-8">

        {/* Username Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4" onFocus={() => onFocusedFieldChange?.("username")} onBlur={() => onFocusedFieldChange?.(null)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-slate-800">Username</span>
            </div>
            <button
              type="button"
              onClick={() => setShowUsernameModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Pencil size={10} />
              Change Username
            </button>
          </div>
          <FloatingField
            id="aa-username"
            label="Username"
            required
            icon={User}
            value={username}
            onChange={() => {}}
            disabled
            onClick={() => setShowUsernameModal(true)}
          />
          <p className="text-[10px] text-slate-400 mt-2 ml-1">
            Your username is used to log into your WholesaleUp account.
          </p>
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-4" onFocus={() => onFocusedFieldChange?.("password")} onBlur={() => onFocusedFieldChange?.(null)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-slate-800">Password</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Pencil size={10} />
              Change Password
            </button>
          </div>
          <FloatingField
            id="aa-password"
            label="Password"
            required
            icon={Lock}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={() => {}}
            disabled
            autoComplete="current-password"
            onClick={() => setShowPasswordModal(true)}
          />
          <p className="text-[10px] text-slate-400 mt-2 ml-1">
            For security, your password is hidden. Click the field or &quot;Change Password&quot; to update it.
          </p>

          {/* Security Recommendations — inside password card */}
          <div className="bg-orange-50/50 rounded-lg border border-orange-100 p-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={14} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-700 mb-1">Security Recommendations</h2>
                <ul className="text-[11px] text-slate-500 space-y-1 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <Check size={10} className="text-orange-500 mt-0.5 shrink-0" />
                    <span>Use a strong password with at least 8 characters, including uppercase, numbers, and symbols</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={10} className="text-orange-500 mt-0.5 shrink-0" />
                    <span>Never share your password with anyone, including WholesaleUp staff</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={10} className="text-orange-500 mt-0.5 shrink-0" />
                    <span>Use a password manager to generate and store unique passwords for each service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>{/* /fields zone */}
      </div>

      {/* Modals */}
      <ChangeUsernameModal isOpen={showUsernameModal} onClose={() => setShowUsernameModal(false)} currentUsername={username} />
      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN — Account Access Page
   ═══════════════════════════════════════════════════ */
export default function AccountAccessPage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");
  const [focusedField, setFocusedField] = useState(null);
  const [tipsCollapsed, toggleTips] = usePanelCollapse("wup-tips-collapsed");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Account Access" },
        ]} />
        <MobileDashboardNav activePage="account-access" />

        {/* 3-column Layout: sidebar | form | tips */}
        <div className="flex gap-6 items-start">
          <AccountSidebar user={user} activePage="account-access" collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Squared paper grid — covers full form */}
              <div className="relative">
                <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{
                  backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }} />
                <div className="relative">
                  <AccountAccessForm onFocusedFieldChange={setFocusedField} />
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Tips Panel — xl+ only */}
          <FormTipsPanel
            focusedField={focusedField}
            collapsed={tipsCollapsed}
            onToggle={toggleTips}
            tipsData={ACCESS_TIPS}
            defaultTips={ACCESS_DEFAULT_TIP}
            bottomSection={ACCESS_TIPS_BOTTOM}
          />
        </div>
      </div>
    </div>
  );
}
