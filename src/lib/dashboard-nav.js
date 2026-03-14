/**
 * Dashboard / Account Sidebar — Canonical Navigation
 * ═══════════════════════════════════════════════════
 * Single source of truth for all account-column nav links.
 *
 * Consumed by:
 *   - src/components/phases/dashboard.jsx   (AccountSidebar component)
 *   - src/components/phases/shell.jsx       (demo AccountSidebar)
 *   - src/components/shared/app-layout.jsx  (mobile nav)
 *
 * When adding/renaming/reordering links, update THIS file only.
 */

import {
  LayoutDashboard,
  KeyRound,
  User,
  ShoppingBag,
  Store,
  Package,
  PlusCircle,
  MessageSquare,
  Heart,
  Newspaper,
  Coins,
  Settings,
} from "lucide-react";

/* ─── Grouped sections (used by AccountSidebar) ─── */

export const DASHBOARD_NAV_SECTIONS = [
  {
    title: "MANAGE ACCOUNT",
    items: [
      { id: "dashboard",        icon: LayoutDashboard, label: "Dashboard",               href: "/dashboard" },
      { id: "account-access",   icon: KeyRound,        label: "Account Access",           href: "/dashboard/account-access" },
      { id: "account-profile",  icon: User,            label: "Account Profile",          href: "/dashboard/account-profile" },
      { id: "buyer-profile",    icon: ShoppingBag,     label: "Buyer Profile",            href: "/dashboard/buyer-profile" },
      { id: "supplier-profile", icon: Store,           label: "Supplier Profile",         href: "/dashboard/supplier-profile" },
    ],
  },
  {
    title: "DEALS MENU",
    items: [
      { id: "manage-deals", icon: Package,        label: "Manage Deals",  href: "/dashboard" },
      { id: "add-deal",     icon: PlusCircle,     label: "Add New Deal",  href: "/dashboard/add-deal" },
      { id: "orders",       icon: ShoppingBag,    label: "Orders",        href: "/dashboard" },
      { id: "messages",     icon: MessageSquare,   label: "Messages",      href: "/dashboard", badge: 3 },
      { id: "favourites",   icon: Heart,           label: "My Favourites", href: "/dashboard" },
    ],
  },
  {
    title: "OTHER",
    items: [
      { id: "newsletters", icon: Newspaper, label: "Newsletters",              href: "/dashboard/newsletters" },
      { id: "affiliate",   icon: Coins,     label: "Affiliate Earnings",       href: "/dashboard" },
      { id: "billing",     icon: Settings,  label: "Manage Services & Billing", href: "/dashboard" },
    ],
  },
];

/* ─── Flat list (used by mobile nav, etc.) ─── */

export const DASHBOARD_NAV_LINKS = DASHBOARD_NAV_SECTIONS.flatMap((s) => s.items);
