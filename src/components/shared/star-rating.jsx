"use client";

import { Star } from "lucide-react";

/**
 * Star rating display — renders 5 stars with full and half-fill support.
 * Used across suppliers, supplier, deal, deal-cards, homepage,
 * filters, testimonials, and more.
 *
 * @param {number}  rating              – rating value (0-5)
 * @param {number}  [size=12]           – star icon size
 * @param {boolean} [showValue=false]   – show numeric value after stars
 * @param {string}  [className]         – wrapper className override
 */
export default function StarRating({ rating, size = 12, showValue = false, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-slate-200"
          }
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-slate-600">{rating}</span>
      )}
    </div>
  );
}
