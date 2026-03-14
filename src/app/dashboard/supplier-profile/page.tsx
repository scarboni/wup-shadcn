// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { SupplierProfilePage as Phase } from "@/components/phases/supplier-profile-form";

export const metadata = {
  title: "Supplier Profile | WholesaleUp",
  description: "Set up your supplier profile, product offerings, order requirements, and business hours.",
  robots: { index: false, follow: false },
};

export default function SupplierProfileRoute() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/supplier-profile");
  return <Phase />;
}
