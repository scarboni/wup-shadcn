"use client";

/* ═══════════════════════════════════════════════════
   LOADING SPINNER — Animated WholesaleUp W icon
   used as the global loading indicator across the site.
   Dark blue W strokes (#1e5299) + orange arrowhead (#f97316).

   Usage:
     import LoadingSpinner from "@/components/shared/loading-spinner";
     <LoadingSpinner />              // full-page centered, large (default)
     <LoadingSpinner size="sm" />    // inline/compact spinner
     <LoadingSpinner size="md" />    // medium
     <LoadingSpinner fullPage={false} /> // no min-h wrapper
   ═══════════════════════════════════════════════════ */

export default function LoadingSpinner({ size = "lg", fullPage = true }) {
  const iconSize = size === "sm" ? "w-10 h-10" : size === "md" ? "w-14 h-14" : "w-20 h-20";

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${iconSize} animate-wup-pulse`}>
        <svg viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Right upstroke — transparent base (same as logo) */}
          <path d="M56 62 L72 18" stroke="transparent" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Orange arrowhead */}
          <polygon points="72,4 60,22 84,22" fill="#f97316" className="animate-wup-arrow"/>
          {/* Left downstroke of W — dark blue */}
          <path d="M8 12 L22 62" stroke="#1e5299" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-wup-draw" style={{ strokeDasharray: 54, strokeDashoffset: 0 }}/>
          {/* Middle V of W — dark blue */}
          <path d="M22 62 L40 28 L56 62" stroke="#1e5299" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" className="animate-wup-draw-v" style={{ strokeDasharray: 78, strokeDashoffset: 0 }}/>
        </svg>
      </div>
      {size !== "sm" && (
        <span className="text-sm font-semibold text-slate-400 animate-pulse">Loading…</span>
      )}
      {/* Keyframes injected inline so the spinner works in loading.tsx (no global CSS dependency) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wup-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.92); }
        }
        @keyframes wup-draw {
          0% { stroke-dashoffset: 54; }
          40%, 100% { stroke-dashoffset: 0; }
        }
        @keyframes wup-draw-v {
          0%, 20% { stroke-dashoffset: 78; }
          60%, 100% { stroke-dashoffset: 0; }
        }
        @keyframes wup-arrow {
          0%, 60% { opacity: 0; transform: translateY(4px); }
          80%, 100% { opacity: 1; transform: translateY(0); }
        }
        .animate-wup-pulse {
          animation: wup-pulse 1.6s ease-in-out infinite;
        }
        .animate-wup-draw {
          animation: wup-draw 1.6s ease-in-out infinite;
        }
        .animate-wup-draw-v {
          animation: wup-draw-v 1.6s ease-in-out infinite;
        }
        .animate-wup-arrow {
          animation: wup-arrow 1.6s ease-in-out infinite;
          transform-origin: center;
        }
      `}} />
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      {spinner}
    </div>
  );
}
