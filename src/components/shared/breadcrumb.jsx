"use client";

import { ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://wholesaleup.com";

/**
 * Breadcrumb navigation — renders a trail of links with ChevronRight separators
 * AND emits BreadcrumbList JSON-LD structured data for search engine rich results.
 * Used across supplier, deal, deal-cards, and suppliers pages.
 *
 * @param {Array<{ label: string, href?: string }>} items – breadcrumb items
 *   - items with `href` render as links; the final item (no href) renders as plain text
 * @param {string} [className] – additional wrapper classes
 */
export default function Breadcrumb({ items, className = "" }) {
  /* Always start with "WholesaleUp" home link unless already present */
  const homeItem = { label: "WholesaleUp", href: "/" };
  const allItems = (items[0]?.label === "WholesaleUp") ? items : [homeItem, ...items];

  /* Build BreadcrumbList JSON-LD — all items including the final one (current page) */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-slate-400 mb-6 flex-wrap ${className}`}
        style={{ fontSize: "13px" }}
      >
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} aria-hidden="true" />}
            {item.href ? (
              <a href={item.href} className="hover:text-orange-500 transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-slate-600 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
