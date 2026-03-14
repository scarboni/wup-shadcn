"use client";

import { useCallback } from "react";
import { Lock, ExternalLink } from "lucide-react";
import { useWebsiteClickLimit } from "./use-website-click-limit";

/* ═══════════════════════════════════════════════════════════════
   WebsiteLink — Gated outbound website link with click tracking
   ═══════════════════════════════════════════════════════════════
   Tracks clicks against the 500/mo limit for Premium, Premium+,
   and Supplier Pro tiers. When the limit is reached the link is
   replaced with a "limit reached" badge.

   IMPORTANT — /go redirect privacy:
   The /go URL uses the supplier's public slug (not the raw website
   URL) so the actual destination is never exposed in the browser
   address bar, referrer headers, shared links, or server logs.
   The /go API route resolves the real URL server-side by looking
   up the supplier record from the slug.

   PRODUCTION: The /go API route must:
     1. Accept `slug` (supplier public identifier) instead of `url`
     2. Look up supplier.companyWebsite from the DB using the slug
     3. Validate the user is on an eligible tier (Premium/Premium+/Supplier Pro)
     4. Check & increment the 500/mo click counter
     5. Return a 302 redirect to the resolved URL
   See: website-click-limits skill for full spec.

   Props:
     slug       — supplier's public slug (used in /go?slug=...)
     url        — raw URL (used ONLY in demo mode as href fallback;
                   in production the /go route resolves it server-side)
     dealSlug   — optional, appended as &deal= for analytics
     children   — link content (text/icons)
     className  — passed to the <a> or <span>
   ═══════════════════════════════════════════════════════════════ */

export default function WebsiteLink({ slug, url, dealSlug, children, className = "" }) {
  const { canClickWebsite, remainingClicks, limitReached, trackClick } = useWebsiteClickLimit();

  const handleClick = useCallback(
    (e) => {
      if (!canClickWebsite) {
        e.preventDefault();
        return;
      }
      trackClick();
    },
    [canClickWebsite, trackClick]
  );

  if (limitReached) {
    return (
      <span className={`inline-flex items-center gap-1 text-slate-400 cursor-not-allowed ${className}`}>
        <Lock size={11} />
        <span className="text-[10px] font-medium">Limit reached (500/mo)</span>
      </span>
    );
  }

  /* ── Build /go redirect URL ──
     Uses supplier slug as the identifier — the /go API route resolves
     the actual website URL server-side. The raw URL is never in the
     query string, protecting supplier privacy.

     PRODUCTION: /go?slug=threadline-trading-ltd&type=website
     DEMO:       Falls back to /go?url=... while no API exists.
  */
  const goUrl = slug
    ? `/go?slug=${encodeURIComponent(slug)}${dealSlug ? `&deal=${encodeURIComponent(dealSlug)}` : ""}&type=website`
    : `/go?url=${encodeURIComponent(url)}${dealSlug ? `&deal=${encodeURIComponent(dealSlug)}` : ""}&type=website`;

  return (
    <a
      href={goUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
      {remainingClicks <= 20 && remainingClicks > 0 && (
        <span className="ml-1 text-[9px] text-orange-400 font-medium">({remainingClicks} left)</span>
      )}
    </a>
  );
}
