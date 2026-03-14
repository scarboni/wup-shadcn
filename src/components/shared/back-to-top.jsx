"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton({ threshold = 500 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-14 right-6 z-30 px-4 py-2.5 rounded-lg bg-orange-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:bg-orange-600 transition-colors"
    >
      <ArrowUp size={14} />
      Back to top
    </button>
  );
}
