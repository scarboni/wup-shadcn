import Phase from "@/components/phases/register";

export const metadata = {
  title: "Sign Up / Log In",
  description: "Create your WholesaleUp account or sign in to access wholesale deals.",
  alternates: { canonical: "/register" },
  openGraph: {
    title: "Join WholesaleUp",
    description: "Create your free account and start sourcing profitable wholesale deals from 42,900+ verified suppliers.",
  },
};

export default function RegisterPage() {
  return <Phase />;
}
