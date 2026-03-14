"use client";

import { useState } from "react";
import { usePanelCollapse } from "@/components/shared/use-panel-collapse";
import Breadcrumb from "@/components/shared/breadcrumb";
import {
  AccountSidebar, UpgradeBanner, MobileDashboardNav, usePageUser,
} from "@/components/phases/dashboard";
import { Newspaper } from "lucide-react";

/* ═══════════════════════════════════════════════════
   NEWSLETTERS PAGE — /dashboard/newsletters
   Layout matches buyer-profile (sidebar + content).
   Centre panel placeholder — content TBD.
   ═══════════════════════════════════════════════════ */

export function NewslettersPage() {
  const user = usePageUser();
  const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-account-collapsed");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={[
          { label: "WholesaleUp", href: "/" },
          { label: "Newsletters", href: "/dashboard/newsletters" },
          { label: "Manage Subscriptions" },
        ]} />
        <MobileDashboardNav activePage="newsletters" />

        <div className="flex gap-6 items-start">
          {/* Left: Account Sidebar */}
          <AccountSidebar user={user} activePage="newsletters" collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

          {/* Centre: Content */}
          <div className="flex-1 min-w-0">
            <UpgradeBanner user={user} />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              {/* PRODUCTION: Replace placeholder with newsletter subscription management UI */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Newspaper size={20} className="text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Newsletters</h1>
                  <p className="text-sm text-slate-500">Manage your email subscriptions and notification preferences</p>
                </div>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-12 text-center">
                <Newspaper size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-500 mb-1">Newsletter preferences coming soon</p>
                <p className="text-xs text-slate-400">You'll be able to manage your wholesale deals, supplier updates, and market insights subscriptions here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewslettersPage;
