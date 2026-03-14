"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Mail, BadgeCheck, Check, CheckCircle2, AlertCircle, Send } from "lucide-react";

/**
 * Contact Supplier Modal — standardised modal for sending supplier enquiries.
 * Used across suppliers.jsx, deal-cards.jsx, and homepage.jsx.
 *
 * @param {string}  name                – supplier or product name (shown in header)
 * @param {string}  [subjectDefault=""] – pre-filled subject line
 * @param {object}  [product]           – optional product info { image, title, price, currency }
 * @param {function} onClose            – callback to close modal
 */
export default function ContactSupplierModal({ name, subjectDefault = "", product, onClose }) {
  const [form, setForm] = useState({
    subject: subjectDefault || "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState({});

  const FIELD_LABELS = {
    subject: "Subject",
    message: "Message",
  };

  const validate = () => {
    const errs = {};
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const errors = validate();

  const focusField = (fieldKey) => {
    const el = document.getElementById(`modal-field-${fieldKey}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus(), 300);
    }
  };

  const handleSend = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitAttempted(true);
    setServerError("");

    const currentErrors = validate();
    if (Object.keys(currentErrors).length > 0) {
      setTimeout(() => {
        const panel = document.getElementById("modal-errors-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    setSending(true);
    // Simulate send
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        const panel = document.getElementById("modal-success-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      // Uncomment below to simulate server error instead:
      // setSending(false);
      // setServerError("Unable to reach the server. Please check your connection and try again.");
    }, 800);
  };

  const handleSendAnother = () => {
    setSent(false);
    setForm({ subject: subjectDefault || "", message: "" });
    setSubmitAttempted(false);
    setServerError("");
    setTouched({});
    setTimeout(() => {
      const el = document.getElementById("modal-field-subject");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el.focus(), 300);
      }
    }, 100);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showFieldError = (field) =>
    (submitAttempted || touched[field]) && errors[field];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Contact Supplier"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm">Contact Supplier</h3>
              <p className="text-blue-100 text-xs mt-0.5 line-clamp-1">{name}</p>
            </div>
            <button
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* ── Success Panel ── */}
          {sent && (
            <div id="modal-success-panel" className="mb-5 p-5 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check size={24} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-base font-extrabold text-emerald-800">Message Sent Successfully!</p>
                  <p className="text-sm text-emerald-600 mt-1 leading-relaxed">
                    The supplier will review your enquiry and respond shortly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSendAnother}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors mt-1"
                >
                  <Send size={14} />
                  Send Another Message
                </button>
              </div>
            </div>
          )}

          {/* ── Client-Side Errors Panel ── */}
          {submitAttempted && Object.keys(errors).length > 0 && (
            <div id="modal-errors-panel" className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800">
                    Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? "s" : ""} below:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(errors).map(([key, msg]) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => focusField(key)}
                          className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors text-left"
                        >
                          <span className="font-semibold">{FIELD_LABELS[key] || key}:</span>{" "}
                          {msg}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── Server Error Panel ── */}
          {serverError && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-300">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800">Something went wrong</p>
                  <p className="text-sm text-red-600 mt-1">{serverError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setServerError("");
                      handleSend({ preventDefault: () => {} });
                    }}
                    className="mt-2 text-sm font-semibold text-red-700 hover:text-red-900 underline transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Optional product info card */}
          {product && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title || name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {product.title || name}
                </p>
                {product.price != null && (
                  <p className="text-xs text-slate-500">
                    {product.currency}
                    {product.price.toFixed(2)} ex.VAT
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Form Fields ── */}
          {!sent && (
            <>
              <div className="mb-4">
                <label htmlFor="modal-field-subject" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  id="modal-field-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  onBlur={() => handleBlur("subject")}
                  placeholder="e.g. Enquiry about bulk pricing"
                  className={`w-full px-3 py-2.5 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-colors ${
                    showFieldError("subject")
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200"
                  }`}
                />
                {showFieldError("subject") && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>
              <div className="mb-5">
                <label htmlFor="modal-field-message" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="modal-field-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onBlur={() => handleBlur("message")}
                  placeholder="Write your message to the supplier..."
                  rows={5}
                  className={`w-full px-3 py-2.5 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 resize-none transition-colors ${
                    showFieldError("message")
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200"
                  }`}
                />
                {showFieldError("message") && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                  className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail size={14} /> Send Message
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
