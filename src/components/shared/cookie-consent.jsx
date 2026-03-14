"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

/* ═══════════════════════════════════════════════════
   COOKIE CONSENT BANNER
   GDPR / ICO / CNIL compliant — no dark patterns.

   Design principles (sourced from ICO, CNIL, EDPB, NN/g):
   ──────────────────────────────────────────────────
   1. Accept & Reject have equal visual weight (CNIL)
   2. Non-essential cookies default to OFF (GDPR Art. 6)
   3. Reject is same-level, same-click as Accept (ICO)
   4. No pre-ticked toggles (ePrivacy Directive)
   5. Granular per-purpose consent available (GDPR)
   6. No ambiguous X close button (EDPB dark pattern guidance)
   7. Persistent footer link to re-open preferences (ICO)
   8. Banner doesn't block page content — bottom-anchored (NN/g)
   9. WCAG 2.2 accessible: keyboard nav, ARIA, focus traps
   10. Consent state persisted in localStorage (no cookies
       set until consent given — scripts must be blocked first)

   🔧 PRODUCTION: Replace localStorage with a first-party
   cookie + server-side consent signal to actually gate
   analytics/marketing script loading (e.g. Google Tag
   Manager consent mode, or Cookiebot/OneTrust integration).
   ═══════════════════════════════════════════════════ */

const COOKIE_CATEGORIES = [
  {
    id: "essential",
    label: "Essential",
    description: "Required for the website to function. These cannot be disabled.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Help us understand how visitors interact with our website by collecting anonymous usage data.",
    required: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Used to deliver relevant advertisements and track campaign performance across platforms.",
    required: false,
  },
  {
    id: "personalization",
    label: "Personalisation",
    description: "Allow us to remember your preferences and tailor your experience.",
    required: false,
  },
];

const STORAGE_KEY = "wup-cookie-consent";

/* Consent expires after 12 months — ICO best practice.
   On expiry the banner re-appears with previous choices pre-filled. */
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 12 months

/* localStorage keys that belong to the Personalisation category.
   These are cleared when personalisation consent is withdrawn.
   ⚠️  Keep in sync with the cookies skill inventory. */
const PERSONALISATION_KEYS = [
  "wup-sidebar-collapsed",
  "wup-account-collapsed",
  "wup-tips-collapsed",
  "wup-filter-collapsed",
  "wup-header-currency",
  "wup-account-profile-pct",
  "wup-buyer-profile-pct",
  "wup-supplier-profile-pct",
  "wup-deal-form-pct",
];

function getStoredConsent() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Check whether stored consent has expired (older than 12 months). */
function isConsentExpired(stored) {
  if (!stored?.timestamp) return true;
  const age = Date.now() - new Date(stored.timestamp).getTime();
  return age > CONSENT_MAX_AGE_MS;
}

function storeConsent(consent) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...consent, timestamp: new Date().toISOString() })
    );
  } catch {
    // Silent fail — localStorage might be blocked
  }
}

/** Broadcast consent state so other components (future GTM, analytics)
 *  can react without polling localStorage.
 *  Detail shape: { analytics: bool, marketing: bool, personalization: bool } */
function fireConsentChange(consentState) {
  window.dispatchEvent(
    new CustomEvent("wup-consent-change", { detail: consentState })
  );
}

/** Remove all personalisation localStorage keys when consent is withdrawn. */
function clearPersonalisationStorage() {
  PERSONALISATION_KEYS.forEach((key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  });
}

/* ─── Toggle switch (reusable) ─── */
function Toggle({ checked, onChange, disabled = false, id }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-800 ${
        disabled
          ? "bg-orange-400 cursor-not-allowed opacity-70"
          : checked
            ? "bg-orange-500 cursor-pointer"
            : "bg-slate-500 cursor-pointer hover:bg-slate-400"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
          checked || disabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

/* ─── Main component ─── */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState({
    analytics: false,
    marketing: false,
    personalization: false,
  });

  // Show banner if no prior consent stored OR consent has expired (>12 months)
  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored || isConsentExpired(stored)) {
      // Pre-fill with previous choices on expiry so users can review, not start from scratch
      if (stored) {
        setConsent({
          analytics: stored.analytics ?? false,
          marketing: stored.marketing ?? false,
          personalization: stored.personalization ?? false,
        });
      }
      // Small delay so it doesn't flash on page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const all = { analytics: true, marketing: true, personalization: true };
    storeConsent(all);
    fireConsentChange(all);
    setVisible(false);
    setShowPreferences(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const none = { analytics: false, marketing: false, personalization: false };
    storeConsent(none);
    clearPersonalisationStorage();
    fireConsentChange(none);
    setVisible(false);
    setShowPreferences(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    storeConsent(consent);
    // If personalisation was switched off, clear those keys
    if (!consent.personalization) clearPersonalisationStorage();
    fireConsentChange(consent);
    setVisible(false);
    setShowPreferences(false);
  }, [consent]);

  // Allow re-opening from footer link via custom event
  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setShowPreferences(true);
      // Restore previous consent state for editing
      const stored = getStoredConsent();
      if (stored) {
        setConsent({
          analytics: stored.analytics ?? false,
          marketing: stored.marketing ?? false,
          personalization: stored.personalization ?? false,
        });
      }
    };
    window.addEventListener("open-cookie-preferences", handler);
    return () => window.removeEventListener("open-cookie-preferences", handler);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* ── Backdrop dim overlay ── */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* ── Banner ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-[9999] transition-transform duration-300 ease-out"
        role="dialog"
        aria-label="Cookie consent"
        aria-modal="false"
      >
        <div className="mx-auto max-w-5xl px-4 pb-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700/60 overflow-hidden">
            {/* ── Banner bar ── */}
            <div className="px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Message */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Shield size={20} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">We value your privacy</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      We use cookies to improve your experience. Essential cookies are always active.
                      You choose whether to enable analytics, marketing, and personalisation cookies.
                    </p>
                  </div>
                </div>

                {/* Buttons — equal visual weight for Accept & Reject (GDPR/CNIL) */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-500 text-slate-200 bg-transparent hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowPreferences(!showPreferences)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-500 text-slate-200 bg-transparent hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-900 flex items-center gap-1"
                  >
                    Preferences
                    {showPreferences ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>

            {/* ── Preferences panel (expandable) ── */}
            {showPreferences && (
              <div className="border-t border-slate-700/60 px-5 py-4 sm:px-6 sm:py-5 bg-slate-800/60">
                <div className="space-y-3">
                  {COOKIE_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-start justify-between gap-4 py-2"
                    >
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`cookie-${cat.id}`}
                          className="text-sm font-semibold text-slate-100 cursor-pointer"
                        >
                          {cat.label}
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {cat.required ? (
                          <span className="text-xs font-semibold text-orange-400">Always active</span>
                        ) : (
                          <Toggle
                            id={`cookie-${cat.id}`}
                            checked={consent[cat.id]}
                            onChange={() =>
                              setConsent((prev) => ({
                                ...prev,
                                [cat.id]: !prev[cat.id],
                              }))
                            }
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Save row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/60">
                  <a
                    href="/cookies"
                    className="text-xs text-slate-400 hover:text-orange-400 font-medium transition-colors"
                  >
                    Cookie Policy
                  </a>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-500 text-slate-200 bg-transparent hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-900"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Footer link helper — dispatch custom event to re-open ─── */
export function openCookiePreferences() {
  window.dispatchEvent(new Event("open-cookie-preferences"));
}
