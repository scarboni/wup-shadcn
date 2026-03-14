// DEPRECATED: This route is a duplicate of /deal.
// Delete this entire directory when possible.
import { redirect } from "next/navigation";

export default function DeprecatedDealVariables() {
  redirect("/deal");
}
