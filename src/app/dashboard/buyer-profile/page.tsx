// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { BuyerProfilePage as Phase } from "@/components/phases/buyer-profile";

export const metadata = {
  title: "Buyer Profile | WholesaleUp",
  description: "Set up your buyer profile, sourcing preferences, purchasing details, and visibility settings.",
  robots: { index: false, follow: false },
};

export default function BuyerProfileRoute() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/buyer-profile");
  return <Phase />;
}
