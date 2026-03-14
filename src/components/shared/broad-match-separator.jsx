"use client";

import { TextSearch } from "lucide-react";

/**
 * BroadMatchSeparator — visual divider for broad-match results.
 *
 * Two modes:
 * 1. After exact results (exactCount > 0): separator between high-relevance and broad results
 * 2. No exact results (exactCount === 0 or noExactMatches): shown at top to explain all results are broad
 *
 * @param {object} props
 * @param {number}   [props.exactCount]     — number of high-relevance results shown above
 * @param {boolean}  [props.noExactMatches]  — true when there are zero exact matches
 * @param {function} [props.onRefine]        — optional callback to scroll to search/filter controls
 */
export default function BroadMatchSeparator({ exactCount = 0, noExactMatches = false, onRefine }) {
  const isAllBroad = noExactMatches || exactCount === 0;

  return (
    <div className="my-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-100 border border-slate-200/80">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <TextSearch size={16} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">
        {isAllBroad
          ? "We couldn\u2019t find an exact match for your search. The following results contain at least one of the keywords you have searched."
          : "The following results are broad match results, and contain at least one of the keywords you have searched."
        }
        {onRefine && (
          <>
            {" "}
            <button
              onClick={onRefine}
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              Refine your search
            </button>
            {" "}for more specific results.
          </>
        )}
      </p>
    </div>
  );
}
