"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════
   useUsernameCheck — debounced username availability check
   ═══════════════════════════════════════
   Returns { status, message, checkUsername, reset }

   status:
     "idle"       — nothing typed yet / too short
     "checking"   — request in flight
     "available"  — username is free
     "taken"      — username already exists
     "invalid"    — failed client-side validation (chars, length)
     "error"      — network / server error

   Production gaps resolved: C14, L7 (uses real API endpoint)
   ═══════════════════════════════════════ */

const DEBOUNCE_MS = 500;
const MIN_LENGTH = 3;
const VALID_PATTERN = /^[a-zA-Z0-9_]+$/;

/**
 * Check username availability via the server API.
 * Server handles reserved username checks (L7) and rate limiting (H8).
 * @param {string} username
 * @returns {Promise<{ available: boolean, reason?: string }>}
 */
async function checkUsernameApi(username) {
  const res = await fetch(
    `/api/auth/check-username?u=${encodeURIComponent(username)}`
  );

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  return res.json();
}

export function useUsernameCheck() {
  const [status, setStatus] = useState("idle"); // idle | checking | available | taken | invalid | error
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);
  const abortRef = useRef(0); // simple counter to cancel stale checks

  const checkUsername = useCallback((value) => {
    // Clear any pending debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    const trimmed = value.trim();

    // Too short — stay idle
    if (trimmed.length < MIN_LENGTH) {
      setStatus(trimmed.length === 0 ? "idle" : "invalid");
      setMessage(trimmed.length === 0 ? "" : `At least ${MIN_LENGTH} characters`);
      return;
    }

    // Invalid characters
    if (!VALID_PATTERN.test(trimmed)) {
      setStatus("invalid");
      setMessage("Only letters, numbers, and underscores");
      return;
    }

    // Passed client-side checks — debounce the API call
    setStatus("checking");
    setMessage("Checking availability\u2026");

    const currentCheck = ++abortRef.current;

    timerRef.current = setTimeout(async () => {
      try {
        const result = await checkUsernameApi(trimmed);

        // Ignore if a newer check has been triggered
        if (currentCheck !== abortRef.current) return;

        if (result.available) {
          setStatus("available");
          setMessage("Username is available");
        } else {
          setStatus("taken");
          setMessage(
            result.reason === "reserved"
              ? "This username is reserved"
              : "Username is already taken"
          );
        }
      } catch (e) {
        if (currentCheck !== abortRef.current) return;
        if (e.message === "RATE_LIMITED") {
          setStatus("error");
          setMessage("Too many checks — please wait a moment");
        } else {
          setStatus("error");
          setMessage("Could not check availability");
        }
      }
    }, DEBOUNCE_MS);
  }, []);

  // Cleanup on unmount
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

  return { status, message, checkUsername, reset };
}
