"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";

/* ═══════════════════════════════════════════════════════════════
   DemoAuthContext — Dev-only tier override for the Demo dropdown
   ═══════════════════════════════════════════════════════════════
   The Demo dropdown in the header lets reviewers switch between
   user tiers without real accounts.

   Tiers:
     "guest"            — not logged in
     "free"             — logged in, Free tier
     "standard"         — logged in, Standard tier
     "premium"          — logged in, Premium tier
     "premium-plus"     — logged in, Premium+ tier (old "Premium")
     "supplier-free"    — logged in, Supplier Free tier
     "supplier-premium" — logged in, Supplier Premium tier
     null               — use real NextAuth session

   Derived booleans:
     isLoggedIn       — true for any tier except "guest"
     isPremium        — true for "premium", "premium-plus", "supplier-premium"
     isPremiumPlus    — true for "premium-plus", "supplier-premium" ONLY
                        Controls access to Premium+-only features (Review tab, reputation data).
     isSupplier       — true for "supplier-free", "supplier-premium"
     canViewSupplier  — true for "standard", "premium", "premium-plus", "supplier-premium"
                        Controls visibility of supplier details (address, contact, ships-from).
                        Masked for: guest, free, supplier-free.

   Additional:
     demoSupplierPro — controls the *listing's* supplier tier (true = Supplier Pro,
     false = Supplier Free). Independent of the viewer's own login role.
     Used on /supplier and /deal pages to preview Pro vs Free supplier styling.

   Additional:
     demoDealStatus — controls the deal's live/sold-out state on the /deal page.
     "live" = normal deal, "sold-out" = expired/sold-out deal with greyed-out stale data.

   Usage:
     const { isLoggedIn, isPremium, isPremiumPlus, isSupplier, canViewSupplier, demoRole, demoSupplierPro, demoDealStatus } = useDemoAuth();
   ═══════════════════════════════════════════════════════════════ */

const LOGGED_IN_ROLES = ["free", "standard", "premium", "premium-plus", "supplier-free", "supplier-premium"];
const PREMIUM_ROLES = ["premium", "premium-plus", "supplier-premium"];
const SUPPLIER_ROLES = ["supplier-free", "supplier-premium"];
// Tiers that can access Premium+-only features (e.g. Review tab, reputation data).
// Does NOT include "premium" — only "premium-plus" and "supplier-premium".
const PREMIUM_PLUS_ROLES = ["premium-plus", "supplier-premium"];
// Tiers that can view supplier details AND enquire about Supplier deals.
// Standard is included because Standard CAN enquire about Supplier deals and see real names.
// However, Standard CANNOT see Supplier Free contact details or branding — the sidebar uses
// isPremium (not canViewSupplier) for canViewContacts and canViewBranding.
const SUPPLIER_VISIBLE_ROLES = ["standard", "premium", "premium-plus", "supplier-premium"];

const DemoAuthContext = createContext({
  demoRole: null,
  setDemoRole: () => {},
  isLoggedIn: false,
  isPremium: false,
  isPremiumPlus: false,
  isSupplier: false,
  canViewSupplier: false,
  demoCategory: "electronics-technology",
  setDemoCategory: () => {},
  demoSupplierPro: true,
  setDemoSupplierPro: () => {},
  demoDealStatus: "live",
  setDemoDealStatus: () => {},
});

export function DemoAuthProvider({ children }) {
  const [demoRole, setDemoRole] = useState(null);
  const [demoCategory, setDemoCategory] = useState("electronics-technology");
  const [demoSupplierPro, setDemoSupplierPro] = useState(true);
  const [demoDealStatus, setDemoDealStatus] = useState("live");
  const { data: session, status } = useSession();

  const value = useMemo(() => {
    // If a demo role is active, use it to derive auth state
    if (demoRole) {
      return {
        demoRole,
        setDemoRole,
        isLoggedIn: LOGGED_IN_ROLES.includes(demoRole),
        isPremium: PREMIUM_ROLES.includes(demoRole),
        isPremiumPlus: PREMIUM_PLUS_ROLES.includes(demoRole),
        isSupplier: SUPPLIER_ROLES.includes(demoRole),
        canViewSupplier: SUPPLIER_VISIBLE_ROLES.includes(demoRole),
        demoCategory,
        setDemoCategory,
        demoSupplierPro,
        setDemoSupplierPro,
        demoDealStatus,
        setDemoDealStatus,
      };
    }

    // Otherwise, fall back to real NextAuth session
    const realLoggedIn = status === "authenticated";
    const tier = session?.user?.tier?.toUpperCase();
    const realPremium = tier === "PREMIUM" || tier === "PREMIUM_PLUS" || tier === "PRO";
    const realPremiumPlus = tier === "PREMIUM_PLUS" || tier === "PRO";
    const realSupplier = tier === "SUPPLIER_FREE" || tier === "SUPPLIER_PREMIUM";

    const realCanViewSupplier = realPremium || tier === "STANDARD";

    return {
      demoRole: null,
      setDemoRole,
      isLoggedIn: realLoggedIn,
      isPremium: realPremium,
      isPremiumPlus: realPremiumPlus,
      isSupplier: realSupplier,
      canViewSupplier: realCanViewSupplier,
      demoCategory,
      setDemoCategory,
      demoSupplierPro,
      setDemoSupplierPro,
      demoDealStatus,
      setDemoDealStatus,
    };
  }, [demoRole, setDemoRole, demoCategory, setDemoCategory, demoSupplierPro, setDemoSupplierPro, demoDealStatus, setDemoDealStatus, session, status]);

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  return useContext(DemoAuthContext);
}

export default DemoAuthContext;
