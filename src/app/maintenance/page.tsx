import MaintenanceView from "./maintenance-view";

export const metadata = {
  title: "Scheduled Maintenance | WholesaleUp",
  description: "WholesaleUp is currently undergoing scheduled maintenance. We'll be back shortly.",
  robots: { index: false, follow: false },
};

/*  ── Admin-configurable estimated return time ──
    In production, fetch this from your backend / admin settings API.
    Accepts an ISO 8601 datetime string OR null for "no ETA".
    Examples:
      "2026-03-14T06:00:00Z"   — absolute datetime
      null                      — hides countdown, shows "shortly" instead
*/
const ESTIMATED_RETURN: string | null = "2026-03-14T06:00:00Z";

export default function MaintenancePage() {
  return <MaintenanceView estimatedReturn={ESTIMATED_RETURN} />;
}
