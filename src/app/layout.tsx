import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "@/components/shared/app-layout";
import AuthProvider from "@/components/shared/auth-provider";
import { DemoAuthProvider } from "@/components/shared/demo-auth-context";
import { WebsiteClickLimitProvider } from "@/components/shared/use-website-click-limit";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://wholesaleup.com";

// 🔧 PRODUCTION: Replace with real X (Twitter) handle once created
const X_HANDLE = "@wholesaleup";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "WholesaleUp — Verified Wholesale & Dropship Deals",
    template: "%s | WholesaleUp",
  },
  description:
    "Access the web's largest database of verified wholesale suppliers, liquidators, and dropshippers from the EU, UK, and North America. Thousands of live, in-margin deals you can resell at a profit on eBay, Amazon, Shopify, and beyond.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "WholesaleUp",
    locale: "en_GB",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "WholesaleUp — Verified Wholesale & Dropship Deals" }],
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
};

/* ─── Structured Data: Organization + WebSite (site-wide) ─── */
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WholesaleUp",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  description:
    "The web's largest database of verified wholesale suppliers, liquidators, and dropshippers from the EU, UK, and North America.",
  // 🔧 PRODUCTION: Replace placeholder URLs with real social profiles
  sameAs: [
    "https://twitter.com/wholesaleup",
    "https://linkedin.com/company/wholesaleup",
    "https://facebook.com/wholesaleup",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "service@wholesaleup.com",
    contactType: "customer service",
    availableLanguage: "English",
  },
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WholesaleUp",
  url: BASE_URL,
  description:
    "Verified wholesale & dropship deals from 42,900+ suppliers across the EU, UK, and North America.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/deals?any={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* Structured Data: Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSONLD) }}
        />
        {/* Flash-prevention: reads localStorage and sets data-* attributes on
            <html> before React hydration, so CSS rules in globals.css can
            render panels in their correct collapsed state with zero flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement,g=function(k,a){try{if(JSON.parse(localStorage.getItem(k)))d.dataset[a]="1"}catch(e){}};g("wup-sidebar-collapsed","sidebarCollapsed");g("wup-account-collapsed","accountCollapsed");g("wup-tips-collapsed","tipsCollapsed");g("wup-filter-collapsed","filterCollapsed");d.classList.add("no-panel-transition")}catch(e){}`,
          }}
        />
        <AuthProvider>
          <DemoAuthProvider>
            <WebsiteClickLimitProvider>
              <AppLayout>{children}</AppLayout>
            </WebsiteClickLimitProvider>
          </DemoAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
