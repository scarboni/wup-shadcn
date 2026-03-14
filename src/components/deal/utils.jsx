"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Package,
  HelpCircle,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  FileCode,
  File,
} from "lucide-react";

/* ─── No-image placeholder — carton box icon ─── */
export function NoImagePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50">
      <Package size={56} className="text-slate-200" />
    </div>
  );
}

export function InfoTooltip({ text, label = "More info" }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, above: true });
  const btnRef = useRef(null);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const above = r.top > 180;
    setPos({
      top: above ? r.top + window.scrollY - 8 : r.bottom + window.scrollY + 8,
      left: r.left + r.width / 2 + window.scrollX,
      above,
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    function close(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setShow(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [show]);

  const handleOpen = () => { updatePos(); setShow(true); };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-expanded={show}
        onClick={() => { if (show) { setShow(false); } else { handleOpen(); } }}
        onMouseEnter={handleOpen}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-6 h-6 -m-1 rounded-full text-slate-300 hover:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <HelpCircle size={14} />
      </button>
      {show && typeof window !== "undefined" && createPortal(
        <div
          style={{
            position: "absolute",
            top: pos.above ? pos.top : pos.top,
            left: pos.left,
            transform: pos.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
            zIndex: 9999,
          }}
          className="w-72 px-3 py-2 text-xs text-white bg-slate-800 rounded-lg shadow-lg leading-relaxed pointer-events-none whitespace-pre-line"
        >
          {text}
          <span
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              pos.above ? "top-full border-t-slate-800" : "bottom-full border-b-slate-800"
            }`}
          />
        </div>,
        document.body
      )}
    </>
  );
}

// Flat flag images via flagcdn.com
export function FlagImg({ code, size = 20 }) {
  const FLAG_CODES = { UK: "gb", DE: "de", PL: "pl", NL: "nl", US: "us", ES: "es", IT: "it", FR: "fr", gb: "gb" };
  const iso = FLAG_CODES[code] || code?.toLowerCase();
  if (!iso) return null;
  return <img src={`https://flagcdn.com/w40/${iso}.png`} alt={code} className="inline-block rounded-sm object-cover" style={{ width: size, height: size * 0.7 }} />;
}

export const FILE_ICONS = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  xls: { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
  csv: { icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50" },
  docx: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  doc: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  zip: { icon: FileArchive, color: "text-amber-600", bg: "bg-amber-50" },
  rar: { icon: FileArchive, color: "text-amber-600", bg: "bg-amber-50" },
  jpg: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50" },
  jpeg: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50" },
  png: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50" },
  webp: { icon: FileImage, color: "text-purple-500", bg: "bg-purple-50" },
  txt: { icon: File, color: "text-slate-500", bg: "bg-slate-50" },
  default: { icon: File, color: "text-slate-500", bg: "bg-slate-50" },
};
