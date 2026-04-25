import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getProductById } from "@/data/products";

/**
 * Fires a page view on every route change (including back/forward).
 * Sends to Lovable analytics (window.lovableAnalytics), gtag, and plausible if present.
 */
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    let title = document.title;

    // Enrich product pages with product name in the tracked path/title
    const productMatch = location.pathname.match(/^\/product\/(.+)$/);
    let trackedPath = path;
    if (productMatch) {
      const product = getProductById(productMatch[1]);
      if (product) {
        title = `${product.name} | Sable & Saffron`;
        trackedPath = `/product/${product.id}`;
      }
    }

    try {
      const w = window as any;
      if (typeof w.lovableAnalytics?.trackPageView === "function") {
        w.lovableAnalytics.trackPageView({ path: trackedPath, title });
      }
      if (typeof w.gtag === "function") {
        w.gtag("event", "page_view", { page_path: trackedPath, page_title: title });
      }
      if (typeof w.plausible === "function") {
        w.plausible("pageview", { u: window.location.origin + trackedPath });
      }
      // Generic custom event so any listener can pick it up
      window.dispatchEvent(new CustomEvent("pageview", { detail: { path: trackedPath, title } }));
    } catch {
      // no-op
    }
  }, [location.pathname, location.search]);

  return null;
};

// Helper used inside ProductDetail to make the param explicit if needed
export const useProductPageParam = () => useParams<{ id: string }>();

export default PageViewTracker;
