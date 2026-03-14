"use client";

import { AlertTriangle, X, ArrowRight, Clock } from "lucide-react";

/**
 * Formats the staleness duration into a human-readable string.
 * < 60 days  → "X days"
 * 60–89 days → "over 2 months"
 * 90+ days   → "over 3 months"
 */
function formatStaleness(days) {
  if (days >= 90) return "over 3 months";
  if (days >= 60) return "over 2 months";
  return `${days} day${days !== 1 ? "s" : ""}`;
}

/**
 * Returns an urgency level for visual cues.
 * 30–59 days → "mild"
 * 60–89 days → "moderate"
 * 90+ days   → "urgent"
 */
function getUrgency(days) {
  if (days >= 90) return "urgent";
  if (days >= 60) return "moderate";
  return "mild";
}

/**
 * Amber warning banner shown when a profile hasn't been updated in 30+ days.
 * Two-section layout matching the success/error banner pattern used site-wide.
 * Positioned above the form card at the Page level.
 *
 * @param {Object} props
 * @param {number} props.daysStale - Days since last save
 * @param {"buyer" | "supplier"} props.profileType
 * @param {() => void} props.onDismiss - Called when user clicks the X button
 * @param {() => void} props.onReviewClick - Called when user clicks "Review now"
 */
export function StaleProfileBanner({ daysStale, profileType, onDismiss, onReviewClick }) {
  const label = profileType === "account" ? "account profile" : profileType === "buyer" ? "buyer profile" : "supplier profile";
  const urgency = getUrgency(daysStale);

  const consequence =
    profileType === "account"
      ? "Keep your contact details and company information current so suppliers and buyers can reach you."
      : profileType === "buyer"
      ? "Suppliers may skip profiles with outdated sourcing preferences. Review your details so we can match you with the right deals."
      : "Buyers may skip profiles with outdated supply details. Review your details so we can match you with the right inquiries.";

  /* Urgency drives the header gradient */
  const headerGradient =
    urgency === "urgent"
      ? "from-orange-600 to-amber-600"
      : urgency === "moderate"
      ? "from-amber-600 to-amber-500"
      : "from-amber-500 to-yellow-500";

  /* Staleness bar: 0% at 30 days, 100% at 90 days, capped */
  const barPercent = Math.min(100, Math.round(((daysStale - 30) / 60) * 100));
  const barColor =
    urgency === "urgent"
      ? "bg-orange-500"
      : urgency === "moderate"
      ? "bg-amber-500"
      : "bg-amber-400";

  return (
    <div
      className="rounded-xl overflow-hidden border border-amber-200 animate-fadeIn shadow-sm mb-4"
      role="status"
      aria-label={`Your ${label} hasn't been updated in ${formatStaleness(daysStale)}`}
    >
      {/* ── Header bar ── */}
      <div className={`bg-gradient-to-r ${headerGradient} px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-white shrink-0" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-white">
            Your {label} hasn&apos;t been updated in {formatStaleness(daysStale)}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Dismiss stale profile warning"
        >
          <X size={12} className="text-white" />
        </button>
      </div>

      {/* ── Body section ── */}
      <div className="bg-amber-50/80 px-4 py-3">
        <p className="text-sm text-amber-800 leading-relaxed">
          {consequence}
        </p>

        {/* Staleness meter + CTA — single row */}
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium shrink-0">
            <Clock size={12} />
            <span>{formatStaleness(daysStale)}</span>
          </div>
          <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-500`}
              style={{ width: `${Math.max(8, barPercent)}%` }}
            />
          </div>
          <button
            type="button"
            onClick={onReviewClick}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1"
          >
            Review now
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
