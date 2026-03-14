// C16: Auth gating handled by middleware (edge-safe)
import Phase from "@/components/phases/account-access";

export const metadata = {
  title: "Account Access | WholesaleUp",
  description: "Manage your username, password, and account security settings.",
  robots: { index: false, follow: false },
};

export default function AccountAccessPage() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/account-access");
  return <Phase />;
}
