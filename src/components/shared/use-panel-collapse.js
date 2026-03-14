"use client";

import { useState, useCallback, useLayoutEffect, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   usePanelCollapse — persisted collapse/expand state
   ═══════════════════════════════════════════════════
   Stores collapse preference in localStorage so it
   survives page navigations sitewide.

   Keys:
     "wup-sidebar-collapsed"   — left blue navigation sidebar
     "wup-account-collapsed"   — account sidebar column
     "wup-tips-collapsed"      — contextual tips panel

   Flash-prevention strategy (all three panels):
     1. An inline <script> in layout.tsx reads localStorage BEFORE
        React hydration and sets data-*-collapsed="1" on <html>
        for each collapsed panel.
     2. CSS rules in globals.css use those data attributes to force
        the correct width/visibility before React loads.
     3. This hook reads the data attribute for its initial state, so
        the first React render matches the stored preference.
     4. .no-panel-transition (also set by the script) kills all
        transitions during hydration. Removed after first paint.

   PRODUCTION: Consider moving to a user-preferences API.
   ═══════════════════════════════════════════════════ */

/* Map localStorage key → dataset attribute name (camelCase) */
const KEY_TO_DATASET = {
  "wup-sidebar-collapsed": "sidebarCollapsed",
  "wup-account-collapsed": "accountCollapsed",
  "wup-tips-collapsed": "tipsCollapsed",
  "wup-filter-collapsed": "filterCollapsed",
};

export function usePanelCollapse(key, defaultValue = false) {
  const dataAttr = KEY_TO_DATASET[key];

  /* IMPORTANT: Always return defaultValue here — same value the server used —
     to avoid React 18 hydration mismatch (React refuses to patch attribute
     diffs, leaving stale server-rendered classes in the DOM).

     The inline <script> + CSS data-attribute overrides keep panels visually
     correct before React hydrates.  useLayoutEffect below then reads the
     real preference from localStorage and triggers a synchronous re-render
     BEFORE the browser paints, so the user never sees the wrong state. */
  const [collapsed, setCollapsed] = useState(defaultValue);

  /* useLayoutEffect syncs with localStorage in case the data attribute
     wasn't set (e.g. first visit, or unknown key). */
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setCollapsed(JSON.parse(stored));
      }
    } catch (_e) {
      /* ignore parse errors */
    }
  }, [key]);

  /* Remove the pre-hydration CSS overrides after React has painted the
     correct state. This hands full control back to React's class-based
     styling. Uses useEffect (not layout) + rAF so the flash-free paint
     has already happened before we remove the guards. */
  useEffect(() => {
    requestAnimationFrame(() => {
      // Remove this panel's data attribute
      if (dataAttr) {
        delete document.documentElement.dataset[dataAttr];
      }
      // Remove the no-transition class only when ALL panel data attributes are gone
      // (so the last panel to hydrate removes the class)
      const ds = document.documentElement.dataset;
      if (!ds.sidebarCollapsed && !ds.accountCollapsed && !ds.tipsCollapsed && !ds.filterCollapsed) {
        document.documentElement.classList.remove("no-panel-transition");
      }
    });
  }, [key, dataAttr]);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch (_e) {
        /* localStorage full or unavailable — degrade gracefully */
      }
      return next;
    });
  }, [key]);

  /* Direct setter for cases like the expand button (always sets to false) */
  const setTo = useCallback(
    (value) => {
      setCollapsed(value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (_e) {
        /* ignore */
      }
    },
    [key]
  );

  return [collapsed, toggle, setTo];
}
