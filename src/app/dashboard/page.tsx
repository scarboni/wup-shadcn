// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import Phase from "@/components/phases/dashboard";

export const metadata = {
  title: "Dashboard | WholesaleUp",
  description: "Manage your wholesale sourcing, saved deals, and account settings.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard");
  return <Phase />;
}
