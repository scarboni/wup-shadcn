"use client";

import { BadgeCheck } from "lucide-react";

/**
 * Verified Supplier badge — standardised across all pages.
 *
 * Variants:
 *   "pill"   (default) – emerald pill with icon + text
 *   "inline" – icon + text without background (used on gating/contact panels)
 *
 * @param {string}  [label="Verified Supplier"]  – badge text
 * @param {number}  [size=10]                  – BadgeCheck icon size
 * @param {string}  [variant="pill"]           – "pill" | "inline"
 * @param {string}  [iconClassName]            – override icon colour (e.g. "text-orange-500")
 * @param {string}  [className]               – additional Tailwind classes
 */
export default function VerifiedBadge({
  label = "Verified Supplier",
  size = 10,
  variant = "pill",
  iconClassName = "",
  className = "",
}) {
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <BadgeCheck size={size} className={iconClassName || "text-emerald-600"} />
        <span className="text-xs font-bold text-emerald-600">{label}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md ${className}`}
    >
      <BadgeCheck size={size} className={iconClassName} />
      {label}
    </span>
  );
}
