"use client";

import { useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   useBreachCheck — check passwords against HaveIBeenPwned
   ═══════════════════════════════════════════════════════════════
   Uses the HIBP Pwned Passwords k-anonymity API:
   1. SHA-1 hash the password locally
   2. Send only the first 5 hex chars to the API
   3. API returns all matching hash suffixes + breach counts
   4. Check locally if the full hash appears in the results

   ✅ The full password NEVER leaves the browser.
   ✅ The full hash NEVER leaves the browser.
   ✅ Only a 5-char prefix is sent — shared by hundreds of hashes.

   Returns {
     status,       — "idle" | "checking" | "breached" | "safe" | "error"
     breachCount,  — number of times found in breaches (0 if safe)
     checkPassword — (password: string) => Promise<void>
     reset         — () => void
   }

   Debounced externally — call checkPassword when you want to check.
   ═══════════════════════════════════════════════════════════════ */

const DEBOUNCE_MS = 800;

async function sha1Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function useBreachCheck() {
  const [status, setStatus] = useState("idle");
  const [breachCount, setBreachCount] = useState(0);
  const timerRef = useRef(null);
  const abortRef = useRef(0);

  const checkPassword = useCallback(async (password) => {
    // Clear any pending debounce
    if (timerRef.current) clearTimeout(timerRef.current);

    // Don't check empty or very short passwords
    if (!password || password.length < 8) {
      setStatus("idle");
      setBreachCount(0);
      return;
    }

    const id = ++abortRef.current;

    // Debounce to avoid hammering the API while typing
    await new Promise((resolve) => {
      timerRef.current = setTimeout(resolve, DEBOUNCE_MS);
    });

    // Stale check
    if (id !== abortRef.current) return;

    setStatus("checking");
    setBreachCount(0);

    try {
      const hash = await sha1Hex(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);

      // Stale check after async hash
      if (id !== abortRef.current) return;

      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { "Add-Padding": "true" }, // privacy padding to prevent traffic analysis
      });

      // Stale check after fetch
      if (id !== abortRef.current) return;

      if (!res.ok) {
        throw new Error(`HIBP API returned ${res.status}`);
      }

      const text = await res.text();
      const lines = text.split("\n");

      let found = 0;
      for (const line of lines) {
        const [hashSuffix, count] = line.split(":");
        if (hashSuffix.trim() === suffix) {
          found = parseInt(count.trim(), 10) || 1;
          break;
        }
      }

      // Final stale check
      if (id !== abortRef.current) return;

      if (found > 0) {
        setBreachCount(found);
        setStatus("breached");
      } else {
        setBreachCount(0);
        setStatus("safe");
      }
    } catch (e) {
      if (id !== abortRef.current) return;
      // M6 fix: structured logging only in development
      if (process.env.NODE_ENV === "development") {
        console.warn("[BreachCheck] API error:", e.message);
      }
      // Fail open — don't block registration if the API is down
      setStatus("error");
      setBreachCount(0);
    }
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    abortRef.current++;
    setStatus("idle");
    setBreachCount(0);
  }, []);

  return { status, breachCount, checkPassword, reset };
}
