// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { AddDealPage as Phase } from "@/components/phases/deal-form";

export const metadata = {
  title: "Add Deal | WholesaleUp",
  description: "Create a new wholesale deal listing with product details, pricing, shipping, and compliance information.",
  robots: { index: false, follow: false },
};

export default function AddDealRoute() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/add-deal");
  return <Phase />;
}
