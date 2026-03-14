"use client";

import { useState } from "react";
import LoadingSpinner from "@/components/shared/loading-spinner";

export default function LoadingPreviewPage() {
  const [simulating, setSimulating] = useState(false);

  if (simulating) {
    return (
      <>
        <LoadingSpinner />
        <button
          onClick={() => setSimulating(false)}
          className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-slate-700 transition-colors"
        >
          Exit simulation
        </button>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <button
        onClick={() => setSimulating(true)}
        className="px-6 py-3 bg-[#1e5299] text-white font-semibold rounded-xl shadow hover:bg-[#1a4785] transition-colors"
      >
        Simulate page loading
      </button>
    </div>
  );
}
