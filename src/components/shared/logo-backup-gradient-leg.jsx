/**
 * BACKUP — WholesaleUpIcon with orange gradient on the right leg.
 * Saved 2026-03-11 before switching to the "hidden leg" version.
 *
 * To reinstate: copy this function into app-layout.jsx replacing the
 * current WholesaleUpIcon, and add `useId` back to the React import.
 */

import { useId } from "react";

function WholesaleUpIcon({ className = "", dark = false }) {
  const uid = useId();
  const strokeColor = dark ? "#0f172a" : "#ffffff";
  const gradId = `arrowGrad${dark ? "Dark" : ""}${uid}`;
  return (
    <svg viewBox="4 0 84 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* Left downstroke of W */}
      <path d="M8 12 L22 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Middle V of W */}
      <path d="M22 62 L40 28 L56 62" stroke={strokeColor} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Right upstroke becoming arrow shaft (white → orange gradient) */}
      <path d="M56 62 L72 18" stroke={`url(#${gradId})`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Orange arrowhead */}
      <polygon points="72,4 60,22 84,22" fill="#f97316"/>
    </svg>
  );
}
