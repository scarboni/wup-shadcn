"use client";

import { useState, useCallback, useRef } from "react";

/* ═══════════════════════════════════════
   useVerificationEmail — send & resend verification emails
   ═══════════════════════════════════════
   Returns { sendVerification, resendVerification, status, cooldown }

   status:
     "idle"     — initial state
     "sending"  — request in flight
     "sent"     — email dispatched successfully
     "error"    — something went wrong

   cooldown: number of seconds remaining before resend is allowed (0 = ready)

   Production gaps resolved: C12 (real email service), M5 (no console.log)
   ═══════════════════════════════════════ */

const COOLDOWN_SECONDS = 60;

/**
 * Send a verification email via the server API.
 * @param {string} email
 * @param {string} type — "registration" | "password-reset" | "login-resend"
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
async function sendVerificationApi(email, type) {
  const res = await fetch("/api/auth/send-verification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, type }),
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMITED");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to send verification email");
  }

  return res.json();
}

export function useVerificationEmail() {
  const [status, setStatus] = useState("idle");
  const [cooldown, setCooldown] = useState(0);
  const [sendCount, setSendCount] = useState(0);
  const timerRef = useRef(null);

  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendVerification = useCallback(async (email, type = "registration") => {
    if (status === "sending" || cooldown > 0) return;

    setStatus("sending");
    try {
      await sendVerificationApi(email, type);
      setStatus("sent");
      setSendCount((c) => c + 1);
      startCooldown();
    } catch (e) {
      setStatus("error");
      // M5 fix: no console.log of tokens/links in production
      if (process.env.NODE_ENV === "development") {
        console.error("[useVerificationEmail] Send failed:", e.message);
      }
    }
  }, [status, cooldown, startCooldown]);

  const resendVerification = useCallback(async (email, type = "registration") => {
    if (cooldown > 0) return;

    setStatus("sending");
    try {
      await sendVerificationApi(email, type);
      setStatus("sent");
      setSendCount((c) => c + 1);
      startCooldown();
    } catch (e) {
      setStatus("error");
      if (process.env.NODE_ENV === "development") {
        console.error("[useVerificationEmail] Resend failed:", e.message);
      }
    }
  }, [cooldown, startCooldown]);

  const reset = useCallback(() => {
    setStatus("idle");
    setCooldown(0);
    setSendCount(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { sendVerification, resendVerification, status, cooldown, sendCount, reset };
}
