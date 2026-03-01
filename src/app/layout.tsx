import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WholesaleUp — Component Library",
  description: "Next.js component library for the WholesaleUp wholesale marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
