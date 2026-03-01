import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/shared/app-layout";

export const metadata: Metadata = {
  title: "WholesaleUp — Component Library",
  description:
    "Next.js component library for the WholesaleUp wholesale marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
