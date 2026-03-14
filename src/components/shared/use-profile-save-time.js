"use client";

/**
 * Hook to track when a profile was last saved.
 * Stores an ISO timestamp in localStorage so the app can detect stale profiles
 * and show a warning banner encouraging users to review their details.
 *
 * @param {"buyer" | "supplier"} profileType
 */
export function useProfileSaveTime(profileType) {
  const key = `wup-${profileType}-profile-last-saved`;

  /** @returns {Date | null} */
  const getLastSaved = () => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const d = new Date(raw);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  /** Write current timestamp to localStorage */
  const recordSave = () => {
    try {
      localStorage.setItem(key, new Date().toISOString());
    } catch {
      /* localStorage full or unavailable — silent fail */
    }
  };

  /**
   * @returns {number | null} Integer days since last save, or null if never saved
   */
  const getDaysStale = () => {
    const last = getLastSaved();
    if (!last) return null;
    const ms = Date.now() - last.getTime();
    return Math.floor(ms / 86_400_000);
  };

  return { getLastSaved, recordSave, getDaysStale };
}
