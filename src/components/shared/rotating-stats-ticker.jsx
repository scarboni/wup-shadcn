"use client";

import { useState } from "react";
import { BadgeCheck, Users, ShoppingCart, Percent } from "lucide-react";
import { useVisibilityInterval } from "@/components/shared/use-visibility-interval";

const ROTATING_STATS = [
  { icon: BadgeCheck, text: "Over 42,900+ verified suppliers" },
  { icon: Users, text: "Trusted by 901,900+ resellers" },
  { icon: ShoppingCart, text: "Buy direct without commissions" },
  { icon: Percent, text: "High margins, up to 95% below retail" },
];

/**
 * Scrolling stats ticker used in the sidebar header.
 * Pauses automatically when the tab is hidden (via useVisibilityInterval).
 */
export function RotatingStatsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useVisibilityInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % ROTATING_STATS.length);
  }, 3000);

  const stat = ROTATING_STATS[currentIndex];

  return (
    <div className="h-7 w-full overflow-hidden relative">
      <div
        key={currentIndex}
        className="flex items-center justify-center gap-1.5 h-7 text-white text-[11px] font-medium animate-slideUp"
      >
        <stat.icon size={13} className="text-orange-400 shrink-0" />
        <span className="truncate">{stat.text}</span>
      </div>
    </div>
  );
}
