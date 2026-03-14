"use client";

import { useState, useEffect, useRef } from "react";
import { WholesaleUpIcon } from "@/components/shared/logo";

/* ─── Single flip digit — 3D card flip animation ─── */
function FlipDigit({ digit }: { digit: string }) {
  const [cur, setCur] = useState(digit);
  const [prev, setPrev] = useState(digit);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (digit !== cur) {
      setPrev(cur);
      setCur(digit);
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 500);
      return () => clearTimeout(t);
    }
  }, [digit, cur]);

  return (
    <div className="mfc">
      {/* Static back layers */}
      <div className="mfc-top"><span>{cur}</span></div>
      <div className="mfc-bot"><span>{prev}</span></div>
      {/* Animated flip layers */}
      <div className={`mfc-top mfc-flap-top ${flipping ? "mfc-go" : ""}`} key={"t" + prev}><span>{prev}</span></div>
      <div className={`mfc-bot mfc-flap-bot ${flipping ? "mfc-go" : ""}`} key={"b" + cur}><span>{cur}</span></div>
      <div className="mfc-hinge" />
    </div>
  );
}

/* ─── Countdown hook ─── */
function useCountdown(targetISO: string | null) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number; hours: number; minutes: number; seconds: number;
  } | null>(null);
  const prevRef = useRef(timeLeft);

  useEffect(() => {
    if (!targetISO) return;
    const target = new Date(targetISO).getTime();

    function calc() {
      const diff = Math.max(0, target - Date.now());
      if (diff === 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      };
    }

    const initial = calc();
    setTimeLeft(initial);
    prevRef.current = initial;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        prevRef.current = prev;
        return calc();
      });
    }, 1_000);
    return () => clearInterval(id);
  }, [targetISO]);

  return { timeLeft, prev: prevRef.current };
}

export default function MaintenanceView({
  estimatedReturn,
}: {
  estimatedReturn: string | null;
}) {
  const { timeLeft, prev } = useCountdown(estimatedReturn);
  const isComplete =
    timeLeft &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <WholesaleUpIcon className="w-10 h-10" dark />
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-slate-900">wholesale</span>
              <span className="text-orange-500">up</span>
            </span>
          </div>
        </div>

        {/* Wrench icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-500"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
          {isComplete ? "Maintenance complete" : "We\u2019re upgrading things"}
        </h1>

        {/* Message */}
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          {isComplete
            ? "Refresh the page to continue using WholesaleUp."
            : "WholesaleUp is currently undergoing scheduled maintenance to bring you a better experience."}
        </p>

        {/* Flip clock countdown */}
        {timeLeft && prev && !isComplete && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-4">
              Estimated time remaining
            </p>
            <div className="inline-flex items-start gap-1.5 sm:gap-2.5" aria-label="Countdown timer">
              {[
                ...(timeLeft.days > 0
                  ? [{ value: pad(timeLeft.days), prev: pad(prev.days), label: "Days" }]
                  : []),
                { value: pad(timeLeft.hours), prev: pad(prev.hours), label: "Hours" },
                { value: pad(timeLeft.minutes), prev: pad(prev.minutes), label: "Min" },
                { value: pad(timeLeft.seconds), prev: pad(prev.seconds), label: "Sec" },
              ].map((unit, i, arr) => (
                <div key={unit.label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase mb-1.5">
                      {unit.label}
                    </span>
                    <div className="flex gap-[3px]">
                      {unit.value.split("").map((d, j) => (
                        <FlipDigit key={j} digit={d} />
                      ))}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-slate-400 font-bold text-xl sm:text-2xl mx-1 sm:mx-1.5 mt-5">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "Back shortly" when no ETA */}
        {!estimatedReturn && (
          <p className="text-sm text-slate-400 mb-8">
            We&apos;ll be back shortly.
          </p>
        )}

        {/* Refresh button when complete */}
        {isComplete && (
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors mb-8"
          >
            Go to WholesaleUp
          </button>
        )}

        {/* Subtle animated bar (only during maintenance) */}
        {!isComplete && (
          <div className="mx-auto w-48 h-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full w-1/3 rounded-full bg-orange-400"
              style={{ animation: "maintenanceShimmer 1.5s ease-in-out infinite" }}
            />
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-xs text-slate-400">
          Questions? Reach us at{" "}
          <a
            href="mailto:service@wholesaleup.com"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            service@wholesaleup.com
          </a>
        </p>
      </div>

      {/* ── Flip clock CSS (maintenance-prefixed to avoid collisions) ── */}
      <style>{`
        @keyframes maintenanceShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        .mfc {
          --mfc-w: 28px;
          --mfc-h: 40px;
          --mfc-fs: 24px;
          position: relative;
          width: var(--mfc-w);
          height: var(--mfc-h);
          perspective: 200px;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.15);
        }
        @media (min-width: 640px) {
          .mfc {
            --mfc-w: 36px;
            --mfc-h: 50px;
            --mfc-fs: 30px;
          }
        }

        .mfc-top, .mfc-bot {
          position: absolute; left: 0; right: 0;
          height: 50%; overflow: hidden;
        }
        .mfc-top span, .mfc-bot span {
          position: absolute;
          left: 0; right: 0;
          height: var(--mfc-h);
          font-size: var(--mfc-fs);
          font-weight: 700;
          color: #f1f5f9;
          line-height: var(--mfc-h);
          text-align: center;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .mfc-top {
          top: 0;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        }
        .mfc-top span { top: 0; }

        .mfc-bot {
          bottom: 0;
          border-radius: 0 0 6px 6px;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        }
        .mfc-bot span { bottom: 0; }

        .mfc-flap-top {
          z-index: 3;
          transform-origin: bottom center;
          transform: rotateX(0deg);
          backface-visibility: hidden;
        }
        .mfc-flap-bot {
          z-index: 2;
          transform-origin: top center;
          transform: rotateX(180deg);
          backface-visibility: hidden;
        }

        .mfc-flap-top.mfc-go {
          animation: mfcDown 0.3s ease-in forwards;
        }
        .mfc-flap-bot.mfc-go {
          animation: mfcUp 0.3s 0.25s ease-out forwards;
        }
        @keyframes mfcDown {
          to { transform: rotateX(-90deg); }
        }
        @keyframes mfcUp {
          from { transform: rotateX(90deg); }
          to   { transform: rotateX(0deg); }
        }

        .mfc-hinge {
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px; z-index: 10;
          background: #334155;
          transform: translateY(-0.5px);
        }

        .mfc-top::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 30%; pointer-events: none;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.1));
        }
      `}</style>
    </div>
  );
}
