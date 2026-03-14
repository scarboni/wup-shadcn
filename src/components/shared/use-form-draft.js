"use client";

import { useEffect, useCallback, useRef } from "react";

/**
 * useFormDraft — saves form state to localStorage on change and restores on mount.
 * Also warns via beforeunload if the form has unsaved changes.
 *
 * Production gap resolved: M9 — sensitive fields (password, tokens) are excluded
 * from persistence. Schema is validated on restore.
 *
 * @param {string} key - Unique storage key for this form (e.g., "contact-form", "register-form")
 * @param {object} formState - The current form state object
 * @param {function} setFormState - Setter to restore saved state
 * @param {object} options
 * @param {boolean} options.enabled - Whether persistence is active (default: true)
 * @param {number} options.debounceMs - Debounce interval in ms (default: 500)
 * @param {function} options.isEmpty - Function to check if form is empty (skips save & warn when true)
 * @param {string[]} options.exclude - Field names to never persist (default: ["password", "confirmPassword", "currentPassword", "token", "recaptchaToken"])
 * @param {boolean} options.warnOnLeave - Whether to show browser "Leave site?" warning (default: true)
 */
export function useFormDraft(key, formState, setFormState, options = {}) {
  const {
    enabled = true,
    debounceMs = 500,
    isEmpty,
    exclude = ["password", "confirmPassword", "currentPassword", "token", "recaptchaToken"],
    warnOnLeave = true,
  } = options;
  const storageKey = `wup-draft-${key}`;
  const timerRef = useRef(null);
  const hasRestoredRef = useRef(false);
  const formRef = useRef(formState);

  // Keep ref in sync
  formRef.current = formState;

  /**
   * M9 fix: strip sensitive fields before persisting.
   * @param {object} state
   * @returns {object}
   */
  const sanitizeForStorage = useCallback(
    (state) => {
      if (!exclude || exclude.length === 0) return state;
      const clean = { ...state };
      for (const field of exclude) {
        delete clean[field];
      }
      return clean;
    },
    [exclude]
  );

  // Restore on mount (once) — with schema validation
  useEffect(() => {
    if (!enabled || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate: must be a plain object, not null/array
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          // Only restore keys that exist in the current form state
          const validKeys = Object.keys(formState);
          const restored = {};
          for (const k of validKeys) {
            if (k in parsed && !exclude.includes(k) && typeof parsed[k] === typeof formState[k]) {
              restored[k] = parsed[k];
            }
          }
          if (Object.keys(restored).length > 0) {
            setFormState(restored);
          }
        }
      }
    } catch (_err) {
      // Corrupted data — remove it
      try { localStorage.removeItem(storageKey); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, storageKey]);

  // Debounced save on change
  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const toSave = sanitizeForStorage(formState);
        if (isEmpty && isEmpty(toSave)) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(toSave));
        }
      } catch (_err) {
        // Storage full or unavailable — ignore
      }
    }, debounceMs);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [enabled, formState, storageKey, debounceMs, isEmpty, sanitizeForStorage]);

  // beforeunload warning
  useEffect(() => {
    if (!enabled || !warnOnLeave) return;
    const handleBeforeUnload = (e) => {
      const current = formRef.current;
      if (isEmpty && isEmpty(current)) return;
      // Check if any non-excluded field has a value
      const hasData = Object.entries(current).some(
        ([k, v]) => !exclude.includes(k) && (typeof v === "string" ? v.trim() !== "" : !!v)
      );
      if (hasData) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, warnOnLeave, isEmpty, exclude]);

  // Clear draft (call on successful submit)
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (_err) {
      // ignore
    }
  }, [storageKey]);

  return { clearDraft };
}
