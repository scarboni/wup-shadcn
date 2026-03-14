"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useDemoAuth } from "./demo-auth-context";

/* ═══════════════════════════════════════════════════════════════
   useWebsiteClickLimit — Demo-only 500/mo website URL click gate
   ═══════════════════════════════════════════════════════════════
   Premium, Premium+, and Supplier Pro can click up to 500 supplier
   website URLs per month. All other tiers see blurred/scrambled
   website URLs and cannot click through.

   In production this will be a server-side counter. For the demo
   we track clicks in React state (resets on page reload).

   Usage:
     const { canClickWebsite, remainingClicks, trackClick, limitReached } = useWebsiteClickLimit();
   ═══════════════════════════════════════════════════════════════ */

const MONTHLY_LIMIT = 500;

const WebsiteClickLimitContext = createContext({
  clickCount: 0,
  canClickWebsite: false,
  remainingClicks: 0,
  limitReached: false,
  trackClick: () => {},
});

export function WebsiteClickLimitProvider({ children }) {
  const [clickCount, setClickCount] = useState(0);
  const { isPremium } = useDemoAuth();

  const trackClick = useCallback(() => {
    setClickCount((prev) => prev + 1);
  }, []);

  const value = useMemo(() => {
    const remaining = Math.max(0, MONTHLY_LIMIT - clickCount);
    return {
      clickCount,
      canClickWebsite: isPremium && remaining > 0,
      remainingClicks: remaining,
      limitReached: isPremium && remaining === 0,
      trackClick,
    };
  }, [clickCount, isPremium, trackClick]);

  return (
    <WebsiteClickLimitContext.Provider value={value}>
      {children}
    </WebsiteClickLimitContext.Provider>
  );
}

export function useWebsiteClickLimit() {
  return useContext(WebsiteClickLimitContext);
}

export default WebsiteClickLimitContext;
