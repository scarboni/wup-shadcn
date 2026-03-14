"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   useRateLimit — client-side rate limiting with escalating lockout
   ═══════════════════════════════════════════════════════════════
   Returns {
     recordAttempt,   — call on each failed attempt
     recordSuccess,   — call on success (resets fail streak)
     reset,           — full reset
     isLocked,        — true while locked out
     countdown,       — seconds remaining in lockout
     failCount,       — current consecutive failures
     attemptsLeft,    — attempts before next lockout (0 if locked)
   }

   Config:
     maxAttempts    — failures before lockout (default 5)
     baseLockout    — initial lockout in seconds (default 30)
     escalation     — multiplier per successive lockout (default 2)
     maxLockout     — cap lockout duration in seconds (default 300 = 5 min)
     warnAfter      — show warning after this many fails (default 3)

   The lockout escalates: 30s → 60s → 120s → 240s → 300s (capped).
   This is CLIENT-SIDE only — a determined attacker can bypass it.

   🔧 PRODUCTION:
   Server-side rate limiting is essential. Use one of:
   - next-rate-limit / rate-limiter-flexible on API routes
   - Middleware-level rate limiting (e.g., Vercel edge, Cloudflare)
   - Database-backed attempt tracking (IP + email compound key)
   - Redis sliding window counter

   Client-side limiting is a UX layer that:
   1. Prevents accidental rapid resubmission
   2. Gives clear feedback to legitimate users
   3. Reduces unnecessary server load
   ═══════════════════════════════════════════════════════════════ */

export function useRateLimit({
  maxAttempts = 5,
  baseLockout = 30,
  escalation = 2,
  maxLockout = 300,
  warnAfter = 3,
} = {}) {
  const [failCount, setFailCount] = useState(0);
  const [lockoutRound, setLockoutRound] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const isLocked = countdown > 0;
  const attemptsLeft = isLocked ? 0 : Math.max(0, maxAttempts - failCount);
  const showWarning = !isLocked && failCount >= warnAfter && failCount < maxAttempts;

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) {
      setCountdown(0);
      return;
    }
    const tick = () => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCountdown(0);
        setLockedUntil(0);
        setFailCount(0); // reset fail count after lockout expires
        return;
      }
      setCountdown(remaining);
    };
    tick();
    const id = setInterval(tick, 1000);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [lockedUntil]);

  const recordAttempt = useCallback(() => {
    if (isLocked) return;
    setFailCount((prev) => {
      const next = prev + 1;
      if (next >= maxAttempts) {
        // Calculate escalating lockout duration
        const duration = Math.min(
          baseLockout * Math.pow(escalation, lockoutRound),
          maxLockout
        );
        setLockedUntil(Date.now() + duration * 1000);
        setLockoutRound((r) => r + 1);
      }
      return next;
    });
  }, [isLocked, maxAttempts, baseLockout, escalation, lockoutRound, maxLockout]);

  const recordSuccess = useCallback(() => {
    setFailCount(0);
    setLockoutRound(0);
    setLockedUntil(0);
    setCountdown(0);
  }, []);

  const reset = useCallback(() => {
    setFailCount(0);
    setLockoutRound(0);
    setLockedUntil(0);
    setCountdown(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    recordAttempt,
    recordSuccess,
    reset,
    isLocked,
    countdown,
    failCount,
    attemptsLeft,
    showWarning,
    maxAttempts,
    warnAfter,
  };
}
