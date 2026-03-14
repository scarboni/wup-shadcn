import { redirect } from "next/navigation";

// Route moved to /dashboard/account-access — redirect for backwards compatibility
export default function AccountAccessRedirect() {
  redirect("/dashboard/account-access");
}
