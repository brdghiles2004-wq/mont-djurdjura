
import { getSitemapProducts } from "@/lib/api";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://mont-djurdjura.vercel.app";

const locales = ["fr", "en", "ar"];

// Regenerate the sitemap every 5 minutes.
export const revalidate = 300;

const staticPages = [
  "",
  "/a-propos",
  "/source",
  "/produits",
  "/galerie",
  "/processus-production",
  "/contact",
  "/demander-un-devis",
  "/faq",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

export default async function sitemap() {
  const pages = [];

  let products = [];

  try {
    products = await getSitemapProducts();
  } catch (error) {
    console.error("Sitemap products loading error:", error);
  }

  for (const locale of locales) {
    for (const page of staticPages) {
      pages.push({
        url: `${SITE_URL}/${locale}${page}`,
        changeFrequency: "monthly",
        priority: page === "" ? 1 : 0.7,
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr${page}`,
            en: `${SITE_URL}/en${page}`,
            ar: `${SITE_URL}/ar${page}`,
          },
        },
      });
    }

    for (const product of products) {
      if (!product?.slug) continue;

      const page = `/produits/${product.slug}`;

      pages.push({
        url: `${SITE_URL}/${locale}${page}`,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            fr: `${SITE_URL}/fr${page}`,
            en: `${SITE_URL}/en${page}`,
            ar: `${SITE_URL}/ar${page}`,
          },
        },
      });
    }
  }

  return pages;
}
