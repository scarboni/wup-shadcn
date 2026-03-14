"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ChevronRight,
  ChevronDown,
  Heart,
  EyeOff,
  AlertTriangle,
  Share2,
  Sparkles,
  RefreshCw,
  Clock,
  RotateCcw,
  Zap,
  Gem,
  Award,
  Wheat,
  BarChart3,
  Eye,
  MessageSquare,
  Crown,
} from "lucide-react";
import { useDemoAuth } from "@/components/shared/demo-auth-context";
import VerifiedBadge from "@/components/shared/verified-badge";
import StarRating from "@/components/shared/star-rating";
import Breadcrumb from "@/components/shared/breadcrumb";
import { getCategoryByName } from "@/lib/categories";
import LoadingSpinner from "@/components/shared/loading-spinner";

// Sub-components — dynamic imports so the sandbox doesn't parse all
// ~3 000 lines at startup. Each chunk is loaded on demand.
const ImageGallery = dynamic(() => import("@/components/deal/image-gallery"), { ssr: true });
const PricingPanel = dynamic(() => import("@/components/deal/pricing-panel"), { ssr: true });
const SupplierSidebarCard = dynamic(() => import("@/components/deal/supplier-sidebar"), { ssr: true });
const ProductDescriptionTabs = dynamic(() => import("@/components/deal/product-tabs"), { ssr: true });
const RelatedDealsCarousel = dynamic(() => import("@/components/deal/related-deals").then((m) => ({ default: m.RelatedDealsCarousel })), { ssr: true });
const SuperchargeCta = dynamic(() => import("@/components/deal/sections").then((m) => ({ default: m.SuperchargeCta })), { ssr: true });
const TrustSection = dynamic(() => import("@/components/deal/sections").then((m) => ({ default: m.TrustSection })), { ssr: true });
const CtaBanner = dynamic(() => import("@/components/shared/cta-banner"), { ssr: true });
const SoldOutBanner = dynamic(() => import("@/components/deal/sold-out-banner"), { ssr: true });

/* ═══════════════════════════════════════════════════
   MAIN — /deal page (single deal view with all product variables)
   ═══════════════════════════════════════════════════ */
export default function SingleDealPage() {
  /* ── Auth state from DemoAuthContext ───────────────────────
     Supports both real NextAuth session AND demo dropdown overrides.
     Premium gating controls supplier contact info visibility.
     Save/unsave: POST /api/user/save-deal { dealId }
     ─────────────────────────────────────────────────────────── */
  const { isLoggedIn, isPremium, canViewSupplier, demoCategory: activeCategory, demoSupplierPro, demoDealStatus } = useDemoAuth();
  const [faved, setFaved] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState("description");
  const productTabsRef = useRef(null);
  const pricingRef = useRef(null);
  const sidebarRef = useRef(null);

  /* Forward wheel events to the sidebar when the adjacent content boundaries
     are reached, so the user discovers remaining sidebar content naturally.
     - Scrolling down: triggers when bottom of description panel (productTabs)
       reaches the viewport bottom → sidebar scrolls down
     - Scrolling up: triggers when top of pricing panel reaches the viewport
       top (at the sticky offset) → sidebar scrolls back up */
  useEffect(() => {
    const handler = (e) => {
      const sidebar = sidebarRef.current;
      if (!sidebar || window.innerWidth < 1280) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if (scrollingDown && productTabsRef.current) {
        const tabsBottom = productTabsRef.current.getBoundingClientRect().bottom;
        const pastDescriptionEnd = tabsBottom <= window.innerHeight;
        const canSidebarScrollDown = sidebar.scrollTop + sidebar.clientHeight < sidebar.scrollHeight - 2;
        if (pastDescriptionEnd && canSidebarScrollDown) {
          sidebar.scrollTop += e.deltaY;
          e.preventDefault();
        }
      } else if (scrollingUp && pricingRef.current) {
        const pricingTop = pricingRef.current.getBoundingClientRect().top;
        const pastPricingTop = pricingTop >= 120; // matches sticky top offset
        const canSidebarScrollUp = sidebar.scrollTop > 2;
        if (pastPricingTop && canSidebarScrollUp) {
          sidebar.scrollTop += e.deltaY;
          e.preventDefault();
        }
      }
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, []);

  /* PRODUCTION: Fetch deal from API:
     const { data: deal } = useSWR(`/api/deals/${dealId}`, fetcher);
     const { data: savedDeals } = useSWR("/api/user/saved-deals", fetcher);
     useEffect(() => { if (savedDeals?.includes(dealId)) setFaved(true); }, [savedDeals]); */
  // Lazy-load demo data so the ~400-line object isn't parsed at module init
  const [baseDeal, setBaseDeal] = useState(null);
  const [presets, setPresets] = useState(null);
  const [relatedDeals, setRelatedDeals] = useState([]);
  const [popularDeals, setPopularDeals] = useState([]);
  const dealLoaded = useRef(false);
  if (!dealLoaded.current) {
    dealLoaded.current = true;
    import("@/components/deal/demo-data").then((m) => {
      setBaseDeal(m.DEAL);
      setPresets(m.CATEGORY_PRESETS);
      setRelatedDeals(m.RELATED_DEALS || []);
      setPopularDeals(m.MOST_POPULAR_DEALS || []);
    });
  }

  // Merge base deal with category preset overlay + demo supplier tier + deal status
  const isSoldOut = demoDealStatus === "sold-out";
  const deal = useMemo(() => {
    if (!baseDeal || !presets) return null;
    const base = activeCategory === "electronics-technology" ? baseDeal : { ...baseDeal, ...(presets[activeCategory] || {}) };
    // Override supplier tier from demo dropdown + sold-out state
    return {
      ...base,
      supplier: { ...base.supplier, isSupplierPro: demoSupplierPro },
      isExpired: isSoldOut,
    };
  }, [baseDeal, presets, activeCategory, demoSupplierPro, isSoldOut]);


  if (!deal) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb — uses categoryBreadcrumb for full category path */}
        <Breadcrumb items={[
          { label: "Wholesale Deals", href: "/deals" },
          ...(deal.categoryBreadcrumb || [deal.category]).map((crumb) => {
            const match = getCategoryByName(crumb);
            const href = match?.categoryId
              ? `/deals/${match.categoryId}`
              : "/deals";
            return { label: crumb, href };
          }),
        ]} />


        {/* === SOLD OUT BANNER (above everything) === */}
        {isSoldOut && <SoldOutBanner deal={deal} />}

        {/* === TITLE ROW (spans full width) === */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {/* Badges row — Verified Supplier + Grade + Stock urgency + Sold Out */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {isSoldOut && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
                  <AlertTriangle size={10} className="shrink-0" /> SOLD OUT
                </span>
              )}
              {deal.supplier?.isSupplierPro && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#1e5299] text-white text-[10px] font-bold rounded-md">
                  <Crown size={10} className="shrink-0" /> PRO
                </span>
              )}
              {deal.supplier?.isVerified && <VerifiedBadge className="text-xs" />}
              {deal.grade && (() => {
                const gradeStyles = {
                  "new": { Icon: Sparkles, bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
                  "refurbished": { Icon: RefreshCw, bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
                  "used": { Icon: Clock, bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
                  "returns / mixed stock": { Icon: RotateCcw, bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
                  "liquidation stocklots": { Icon: Zap, bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
                };
                const gs = gradeStyles[deal.grade.toLowerCase()] || { Icon: null, bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" };
                return (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-md ${gs.bg} ${gs.text} border ${gs.border}`}>
                  {gs.Icon && <gs.Icon size={11} />} Grade: {deal.grade}
                </span>
                );
              })()}
              {!deal.isExpired && deal.availableQuantity <= 100 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-md">
                  <AlertTriangle size={11} /> Only {deal.availableQuantity} left!
                </span>
              )}
            </div>
            <h1 className={`text-xl sm:text-2xl font-extrabold leading-tight ${isSoldOut ? "text-slate-400" : "text-slate-900"}`}>
              {deal.title}
            </h1>
            {/* Dietary/allergen tags — below title */}
            {deal.dietaryTags && deal.dietaryTags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {deal.dietaryTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[10px] font-semibold bg-lime-50 text-lime-700 border border-lime-200 px-2 py-0.5 rounded-md">
                    <Wheat size={9} /> {tag}
                  </span>
                ))}
              </div>
            )}
            {/* Social proof row — date + views + inquiries + sold */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {deal.dateAdded && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  First Featured: {deal.dateAdded}
                </span>
              )}
              {deal.viewCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  <Eye size={11} className="text-slate-400" /> {deal.viewCount.toLocaleString()} views
                </span>
              )}
              {deal.inquiryCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  <MessageSquare size={11} className="text-slate-400" /> {deal.inquiryCount} inquiries
                </span>
              )}
              {deal.unitsSold > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  <BarChart3 size={11} className="text-slate-400" /> {deal.unitsSold.toLocaleString()} sold
                </span>
              )}
              {deal.productReputation && (
                <button
                  onClick={() => {
                    setActiveProductTab("reviews");
                    setTimeout(() => productTabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <StarRating rating={deal.productReputation.overallScore} size={11} />
                  <span>{deal.productReputation.overallScore}</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-6">
            {/* Share button */}
            <button
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all"
              title="Share deal"
              onClick={() => { if (navigator.share) navigator.share({ title: deal.title, url: window.location.href }); }}
            >
              <Share2 size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => { if (!isLoggedIn) window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } })); }}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all"
              title="Hide deal"
            >
              <EyeOff size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => isLoggedIn ? setFaved(!faved) : window.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { tab: "register" } }))}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-all"
              title={faved ? "Remove from favourites" : "Add to favourites"}
            >
              <Heart size={16} className={faved ? "fill-red-500 text-red-500" : "text-slate-400"} />
            </button>
          </div>
        </div>

        {/* === MAIN GRID: Image | Pricing | Contact === */}
        <div className="grid grid-cols-1 min-[880px]:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Row 1: Image */}
          <div className="min-w-0">
            <ImageGallery images={deal.images} deal={deal} isSoldOut={isSoldOut} />
          </div>
          {/* Row 1: Pricing Panel */}
          <div ref={pricingRef} className="min-w-0">
            <PricingPanel deal={deal} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} isSoldOut={isSoldOut} />
          </div>
          {/* Contact Panel: full-width at 880px+, sticky sidebar at xl.
              max-h + overflow-y-scroll gives the sidebar its own scroll when
              content (premium contact card) is taller than the viewport.
              Scrollbar is hidden visually but scroll still works via wheel/touch. */}
          <div ref={sidebarRef} className="min-w-0 min-[880px]:col-span-2 xl:col-span-1 xl:row-span-2 xl:sticky xl:top-[120px] xl:self-start xl:max-h-[calc(100vh-144px)] xl:overflow-y-scroll scrollbar-hide xl:p-2 xl:-m-2">
            <SupplierSidebarCard supplier={deal.supplier} deal={deal} isPremium={isPremium} isLoggedIn={isLoggedIn} canViewSupplier={canViewSupplier} isSoldOut={isSoldOut} />
          </div>
          {/* Description (spans image + pricing columns) */}
          <div className="min-w-0 min-[880px]:col-span-2 xl:col-span-2">
            <div ref={productTabsRef} className="scroll-mt-36 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg">
              <ProductDescriptionTabs deal={deal} activeTab={activeProductTab} onTabChange={setActiveProductTab} />
            </div>
          </div>
        </div>

        {/* === BELOW-THE-FOLD SECTIONS === */}

        {/* Supercharge CTA — non-premium users only */}
        {!isPremium && <SuperchargeCta />}

        {/* Related Top Deals carousel */}
        {relatedDeals.length > 0 && (
          <RelatedDealsCarousel
            label="Deals"
            title="Related Top Deals"
            subtitle="Similar wholesale opportunities you might be interested in."
            cta="Explore Related Top Deals"
            deals={relatedDeals}
            isPremium={isPremium}
            isLoggedIn={isLoggedIn}
          />
        )}

        {/* Most Popular Offers carousel */}
        {popularDeals.length > 0 && (
          <RelatedDealsCarousel
            label="Trending"
            title="Most Popular Offers"
            subtitle="The hottest wholesale and dropship deals right now."
            cta="Explore Most Popular Deals"
            deals={popularDeals}
            isPremium={isPremium}
            isLoggedIn={isLoggedIn}
          />
        )}

        {/* Trust section — stats + testimonials */}
        <TrustSection />

        {/* Bottom CTA banner */}
        <CtaBanner />
      </div>
    </div>
  );
}
