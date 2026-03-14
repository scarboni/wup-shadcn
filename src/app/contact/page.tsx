import Phase from "@/components/phases/contact";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the WholesaleUp team for support, partnerships, or supplier enquiries.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with the WholesaleUp team for support, partnerships, or supplier enquiries.",
  },
};

export default function ContactPage() {
  return <Phase />;
}
