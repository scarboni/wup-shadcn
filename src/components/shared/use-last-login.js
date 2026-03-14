"use client";

import { useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   useLastLogin — tracks last login time + device
   ───────────────────────────────────────────────────────────────
   Uses localStorage for immediate UI display + server-side
   login history via the LoginHistory table for audit trail.

   Usage:
     const { getLastLogin, recordLogin } = useLastLogin();
     const prev = getLastLogin();        // { time, browser, os } | null
     recordLogin();                      // saves current session

   Production gap resolved: M8 (client + server tracking)
   ═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "wup_last_login";

function parseUserAgent() {
  if (typeof navigator === "undefined") return { browser: "Unknown", os: "Unknown" };
  const ua = navigator.userAgent;

  // Browser detection
  let browser = "Unknown";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  // OS detection
  let os = "Unknown";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (ua.includes("CrOS")) os = "ChromeOS";

  return { browser, os };
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function useLastLogin() {
  const getLastLogin = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        ...data,
        timeAgo: formatTimeAgo(data.time),
      };
    } catch {
      return null;
    }
  }, []);

  /**
   * Record a successful login — stored locally for UI display
   * and also sent to the server for the LoginHistory audit table.
   * Server-side recording is handled by the NextAuth signIn event
   * in auth.js (no separate API call needed from client).
   */
  const recordLogin = useCallback(() => {
    try {
      const { browser, os } = parseUserAgent();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ time: Date.now(), browser, os })
      );
    } catch { /* localStorage unavailable */ }
  }, []);

  return { getLastLogin, recordLogin };
}
