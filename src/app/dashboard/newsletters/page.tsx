// C16: Auth gating handled by middleware (edge-safe)
// Server-side auth() check deferred until database is connected
import { NewslettersPage as Phase } from "@/components/phases/newsletters";

export const metadata = {
  title: "Newsletters | WholesaleUp",
  description: "Manage your newsletter subscriptions and email preferences.",
  robots: { index: false, follow: false },
};

export default function NewslettersRoute() {
  // 🔧 PRODUCTION: Uncomment server-side auth check once database is live:
  // import { auth } from "@/auth";
  // const session = await auth();
  // if (!session) redirect("/register?callbackUrl=/dashboard/newsletters");
  return <Phase />;
}
