// DEPRECATED: This route is a duplicate of /supplier.
// Delete this entire directory when possible.
import { redirect } from "next/navigation";

export default function DeprecatedSupplierProfile() {
  redirect("/supplier");
}
