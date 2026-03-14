// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { AccountProfilePage as Phase } from "@/components/phases/account-profile";

export const metadata = {
  title: "Account Profile | WholesaleUp",
  description: "Manage your account profile, personal details, business information, and contact preferences.",
  robots: { index: false, follow: false },
};

export default function AccountProfileRoute() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/account-profile");
  return <Phase />;
}
