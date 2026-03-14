"use client";

import { HelpCircle, ChevronRight, Check } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   FormTipsPanel — shared contextual tips sidebar
   ═══════════════════════════════════════════════════════════════
   Reusable right-column tips panel for all dashboard form pages.
   Each page provides its own tips data and optional bottom section.

   Props:
     focusedField   — currently focused form field name (or null)
     activeTab      — current form tab name (multi-tab forms only)
     collapsed      — boolean from usePanelCollapse("wup-tips-collapsed")
     onToggle       — toggle callback from usePanelCollapse
     tipsData       — object mapping field names → { icon, title, tip }
     defaultTips    — fallback tips: object mapping tab names → tip,
                      OR a single tip object (for single-form pages)
     defaultTabKey  — fallback tab key when activeTab isn't in defaultTips
     bottomSection  — optional React node rendered below the tip card
                      when viewing a default (non-field) tip
     iconFallback   — optional fallback icon component if tip.icon is missing
   ═══════════════════════════════════════════════════════════════ */

export function FormTipsPanel({
  focusedField,
  activeTab,
  collapsed,
  onToggle,
  tipsData,
  defaultTips,
  defaultTabKey,
  bottomSection,
  iconFallback,
}) {
  /* Resolve active tip: field-specific tip takes priority, then tab default */
  const isFieldTip = !!(focusedField && tipsData[focusedField]);
  const activeTip = isFieldTip
    ? tipsData[focusedField]
    : typeof defaultTips === "object" && defaultTips !== null && !defaultTips.icon
      ? (defaultTips[activeTab] || defaultTips[defaultTabKey])
      : defaultTips; // single tip object (e.g. account-access)

  const TipIcon = activeTip?.icon || iconFallback || HelpCircle;

  return (
    <div
      data-panel="tips"
      className={`hidden 2xl:flex relative z-10 sticky self-start transition-all duration-300 ease-in-out shrink-0 ${collapsed ? "w-4" : "w-72"}`}
      style={{ top: 110 }}
    >
      {/* Toggle bar — left edge of tips panel */}
      <button
        onClick={onToggle}
        className={`shrink-0 w-4 self-start mt-[40px] h-14 bg-slate-300 hover:bg-orange-500 rounded-l-lg flex items-center justify-center transition-all z-10 ${collapsed ? "shadow-[-2px_2px_4px_rgba(0,0,0,0.2)]" : ""}`}
        title={collapsed ? "Show tips" : "Hide tips"}
      >
        <ChevronRight
          size={14}
          className={`text-white transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Panel content — slides right when collapsing */}
      <div
        className={`transition-all duration-300 ease-in-out flex-1 min-w-0 ${
          collapsed
            ? "opacity-0 translate-x-4 pointer-events-none max-w-0 overflow-hidden"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="bg-slate-50 rounded-t-xl border border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-orange-100 flex items-center justify-center">
              <HelpCircle size={14} className="text-orange-500" />
            </div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Form Tips
            </span>
          </div>
        </div>

        {/* Active tip card */}
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-sm">
          <div
            className={`p-4 transition-all duration-300 ${isFieldTip ? "bg-orange-50/50" : ""}`}
          >
            {/* Tip icon + title */}
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  isFieldTip ? "bg-orange-100" : "bg-slate-100"
                }`}
              >
                <TipIcon
                  size={16}
                  className={isFieldTip ? "text-orange-500" : "text-slate-400"}
                />
              </div>
              <div>
                <p
                  className={`text-[15px] font-bold transition-colors duration-300 ${
                    isFieldTip ? "text-orange-700" : "text-slate-700"
                  }`}
                >
                  {activeTip?.title}
                </p>
                {isFieldTip && (
                  <p className="text-[11px] text-orange-400 font-medium">
                    Currently editing
                  </p>
                )}
              </div>
            </div>
            {/* Tip text */}
            <p className="text-sm text-slate-500 leading-relaxed">
              {activeTip?.tip}
            </p>
          </div>

          {/* Bottom section — only on default (non-field) tips */}
          {!isFieldTip && bottomSection}
        </div>
      </div>
    </div>
  );
}

/* ── Convenience: "Why it matters" bottom section ──
   Used by account-profile, buyer-profile, supplier-profile. */
export function WhyItMattersSection({ items }) {
  return (
    <div className="border-t border-slate-100 px-4 py-3">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
        Why it matters
      </p>
      <div className="space-y-2">
        {items.map((text, i) => (
          <div key={i} className="flex items-center gap-2 text-[13px] text-slate-500">
            <Check size={12} className="text-emerald-500 shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
