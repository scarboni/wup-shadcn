"use client";

import { useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   Google reCAPTCHA v3 hook
   ───────────────────────────────────────────────────────────────
   Usage:
     const { executeRecaptcha, ready } = useRecaptcha();
     const token = await executeRecaptcha("login");
     // → token is verified server-side via POST /api/verify-recaptcha

   Production gaps resolved: C1 (env-based key), C2 (server verification)
   ═══════════════════════════════════════════════════════════════ */

// C1 fix: use environment variable instead of hardcoded test key
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

let scriptLoaded = false;
let scriptLoading = false;
const onLoadCallbacks = [];

function loadScript() {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) {
    return new Promise((resolve) => onLoadCallbacks.push(resolve));
  }

  if (!SITE_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[reCAPTCHA] No NEXT_PUBLIC_RECAPTCHA_SITE_KEY set — skipping in development");
    }
    return Promise.resolve();
  }

  scriptLoading = true;

  return new Promise((resolve, reject) => {
    onLoadCallbacks.push(resolve);
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      onLoadCallbacks.forEach((cb) => cb());
      onLoadCallbacks.length = 0;
    };
    script.onerror = () => {
      scriptLoading = false;
      reject(new Error("Failed to load reCAPTCHA script"));
    };
    document.head.appendChild(script);
  });
}

/**
 * Verify a reCAPTCHA token server-side.
 * C2 fix: all tokens are now verified via the backend API.
 *
 * @param {string} token — reCAPTCHA client token
 * @param {string} action — action name for validation
 * @returns {Promise<{ success: boolean, score?: number }>}
 */
async function verifyTokenServerSide(token, action) {
  try {
    const res = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action }),
    });
    return await res.json();
  } catch (_err) {
    return { success: false, error: "Verification request failed" };
  }
}

export default function useRecaptcha() {
  const readyRef = useRef(false);

  useEffect(() => {
    loadScript()
      .then(() => { readyRef.current = true; })
      .catch(() => { /* reCAPTCHA script failed to load — non-blocking */ });
  }, []);

  /**
   * Execute reCAPTCHA and return the client token.
   * Callers should also call verifyRecaptcha() to check server-side.
   */
  const executeRecaptcha = useCallback(async (action = "submit") => {
    // In development without a key, return a dev token
    if (!SITE_KEY) {
      if (process.env.NODE_ENV === "development") {
        return "dev-token-no-recaptcha-key";
      }
      throw new Error("reCAPTCHA site key not configured");
    }

    try {
      if (!readyRef.current) await loadScript();
    } catch (_err) {
      throw new Error("reCAPTCHA not available");
    }
    if (!window.grecaptcha) throw new Error("reCAPTCHA not available");
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(SITE_KEY, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  }, []);

  /**
   * Execute reCAPTCHA and verify the token server-side in one step.
   * Returns { success, score } from the server.
   */
  const verifyRecaptcha = useCallback(async (action = "submit") => {
    const token = await executeRecaptcha(action);
    return verifyTokenServerSide(token, action);
  }, [executeRecaptcha]);

  return { executeRecaptcha, verifyRecaptcha, ready: readyRef.current };
}
