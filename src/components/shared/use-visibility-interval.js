"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Drop-in replacement for setInterval that automatically pauses when the
 * browser tab is hidden and resumes when it becomes visible again.
 *
 * This prevents timers from piling up in background tabs and burning CPU
 * on state updates the user will never see.
 *
 * @param {() => void} callback - Function to call on each tick
 * @param {number | null} delay - Interval in ms (null = paused)
 * @returns {{ reset: () => void }} — call reset() to restart the timer
 *
 * Usage:
 *   useVisibilityInterval(() => advance(1), 5000);
 *   const { reset } = useVisibilityInterval(tick, 1000);
 */
export function useVisibilityInterval(callback, delay) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef(null);

  // Always keep the latest callback without restarting the interval
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (delay == null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => savedCallback.current(), delay);
  }, [delay]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  useEffect(() => {
    if (delay == null) return;

    start();

    const onVisChange = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener("visibilitychange", onVisChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [delay, start, stop]);

  return { reset };
}
