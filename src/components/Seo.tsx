import { useEffect } from "react";

const SITE_URL = "https://sableandsaffron.xyz";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

export interface SeoProps {
  title: string;
  description: string;
  /** Path component, e.g. "/shop" or "/product/foo". Will be appended to SITE_URL for canonical/og:url. */
  path: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  /** JSON-LD objects to inject as <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const setMeta = (
  selector: string,
  attrs: Record<string, string>,
) => {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    const tag = selector.startsWith("link") ? "link" : "meta";
    el = document.createElement(tag) as HTMLMetaElement | HTMLLinkElement;
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  return el;
};

const upsertMetaName = (name: string, content: string) =>
  setMeta(`meta[name="${name}"]`, { name, content });

const upsertMetaProperty = (property: string, content: string) =>
  setMeta(`meta[property="${property}"]`, { property, content });

const upsertCanonical = (href: string) =>
  setMeta(`link[rel="canonical"]`, { rel: "canonical", href });

const JSONLD_ID = "seo-jsonld";

const Seo = ({ title, description, path, ogImage, ogType = "website", jsonLd }: SeoProps) => {
  useEffect(() => {
    document.title = title;
    upsertMetaName("description", description);

    const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const image = ogImage || DEFAULT_OG_IMAGE;

    upsertCanonical(url);

    upsertMetaProperty("og:title", title);
    upsertMetaProperty("og:description", description);
    upsertMetaProperty("og:url", url);
    upsertMetaProperty("og:image", image);
    upsertMetaProperty("og:type", ogType);
    upsertMetaProperty("og:site_name", "Sable & Saffron");

    upsertMetaName("twitter:card", "summary_large_image");
    upsertMetaName("twitter:title", title);
    upsertMetaName("twitter:description", description);
    upsertMetaName("twitter:image", image);

    // JSON-LD
    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSONLD_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, ogImage, ogType, JSON.stringify(jsonLd)]);

  return null;
};

export default Seo;
export { SITE_URL };
