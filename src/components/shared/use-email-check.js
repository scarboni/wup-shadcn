"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════
   useEmailCheck — debounced email availability check
   ═══════════════════════════════════════
   Returns { status, message, checkEmail, reset }

   status:
     "idle"       — nothing typed / invalid format
     "checking"   — request in flight
     "available"  — email is not registered
     "registered" — email already has an account
     "error"      — network / server error

   Production gaps resolved: C13 (uses real API endpoint)
   ═══════════════════════════════════════ */

const DEBOUNCE_MS = 600;
// Stricter email: local@domain.tld where TLD is 2–12 letters
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/;

/**
 * Check email availability via the server API.
 * Server handles rate limiting (H8) to prevent enumeration.
 * @param {string} email
 * @returns {Promise<{ available: boolean }>}
 */
async function checkEmailApi(email) {
  const res = await fetch(
    `/api/auth/check-email?email=${encodeURIComponent(email)}`
  );

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.json();
}

export function useEmailCheck() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);
  const abortRef = useRef(0);

  const checkEmail = useCallback((value) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = value.trim();

    // Empty or invalid format — stay idle (let normal validation handle it)
    if (!trimmed || !EMAIL_RE.test(trimmed)) {
      setStatus("idle");
      setMessage("");
      return;
    }

    // Valid format — debounce the API call
    setStatus("checking");
    setMessage("Checking\u2026");

    const currentCheck = ++abortRef.current;

    timerRef.current = setTimeout(async () => {
      try {
        const result = await checkEmailApi(trimmed);

        if (currentCheck !== abortRef.current) return;

        if (result.available) {
          setStatus("available");
          setMessage("Email is available");
        } else {
          setStatus("registered");
          setMessage("An account with this email already exists");
        }
      } catch (e) {
        if (currentCheck !== abortRef.current) return;
        if (e.message === "RATE_LIMITED") {
          setStatus("error");
          setMessage("Too many checks — please wait a moment");
        } else {
          setStatus("error");
          setMessage("Could not verify email");
        }
      }
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("idle");
    setMessage("");
  }, []);

  return { status, message, checkEmail, reset };
}
