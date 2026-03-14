"use client";

import { Calendar, Users, Building2 } from "lucide-react";
import StarRating from "@/components/shared/star-rating";
import { FlagImg } from "@/components/deal/utils";

/**
 * SupplierMetaStats — single source of truth for the supplier stats row.
 * Rendered beneath the supplier name in both the SupplierHeader (/supplier page)
 * and the SupplierSidebarCard (/deal + /supplier sidebar).
 *
 * Order: Country · Years (est.) · Staff · Facility · Stars
 *
 * @param {Object}  supplier       — supplier data object
 * @param {string}  [size="sm"]    — "sm" for sidebar (text-xs, smaller icons)
 *                                    "md" for header (text-sm, larger icons)
 * @param {string}  [className]    — additional wrapper classes
 */
export default function SupplierMetaStats({ supplier, size = "sm", className = "" }) {
  const isSm = size === "sm";
  const textClass = isSm ? "text-xs text-slate-400" : "text-sm text-slate-500";
  const iconSize = isSm ? 11 : 13;
  const flagSize = isSm ? 14 : 16;
  const starSize = isSm ? 12 : 13;

  /* Resolve country — sidebar passes supplier.address.country, header passes supplier.country */
  const countryName = supplier.address?.country || supplier.country;
  const countryCode = supplier.address?.countryCode || supplier.countryCode;

  const Dot = () => <span className="text-slate-300">&middot;</span>;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${textClass} ${className}`}>
      {/* 1. Country */}
      {countryCode && (
        <>
          <span className="flex items-center gap-1.5">
            <FlagImg code={countryCode} size={flagSize} /> {countryName}
          </span>
          <Dot />
        </>
      )}

      {/* 2. Years active (est. year) */}
      {supplier.yearsActive && (
        <>
          <span className="flex items-center gap-1">
            <Calendar size={iconSize} />
            {supplier.yearsActive} yrs{supplier.yearEstablished && <>&nbsp;(est. {supplier.yearEstablished})</>}
          </span>
          <Dot />
        </>
      )}

      {/* 3. Staff count */}
      {supplier.companySize && (
        <>
          <span className="flex items-center gap-1">
            <Users size={iconSize} /> {supplier.companySize} staff
          </span>
          <Dot />
        </>
      )}

      {/* 4. Facility size */}
      {supplier.facilitySize && (
        <>
          <span className="flex items-center gap-1">
            <Building2 size={iconSize} /> {supplier.facilitySize.toLocaleString()} {supplier.facilitySizeUnit}
          </span>
          <Dot />
        </>
      )}

      {/* 5. Star rating (last) */}
      <a href="/supplier?tab=reviews" className="hover:opacity-80 transition-opacity">
        <StarRating rating={supplier.rating} size={starSize} showValue />
      </a>
    </div>
  );
}
