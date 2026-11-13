
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPublicProduct,
  getPublicProducts,
} from "@/lib/api";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const locales = ["fr", "en", "ar"];

const localeOpenGraph = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const translations = {
  fr: {
    category: "EAU DE SOURCE",
    home: "Accueil",
    products: "Nos produits",
    information: "Demander des informations",
    back: "Retour aux produits",
    reference: "RÉFÉRENCE",
    productCategory: "CATÉGORIE",
    presentation: "PRÉSENTATION DU PRODUIT",
    learnMore: "En savoir plus",
    aboutProduct: "sur ce produit.",
    productInfo: "Produit",
    referenceLabel: "Référence",
    universe: "Univers",
    brandDescription: "Mont Djurdjura — Eau de source",
    features: "CARACTÉRISTIQUES",
    featuresTitle: "Les informations du produit",
    featuresDescription:
      "Retrouvez les principales informations relatives à ce produit.",
    discovery: "CONTINUEZ VOTRE DÉCOUVERTE",
    otherProducts: "Autres produits",
    allProducts: "Toute la gamme",
    discover: "Découvrir",
    contactEyebrow: "MONT DJURDJURA",
    question: "Une question sur",
    thisProduct: "ce produit ?",
    contactDescription:
      "Contactez notre équipe pour obtenir davantage d'informations sur notre gamme.",
    contactUs: "Nous contacter",
    noImage: "Image non disponible",
    noDescription:
      "Les informations détaillées de ce produit seront bientôt disponibles.",
    featureItems: [
      "Présentation du produit",
      "Informations du catalogue",
      "Caractéristiques du produit",
    ],
  },

  en: {
    category: "SPRING WATER",
    home: "Home",
    products: "Our products",
    information: "Request information",
    back: "Back to products",
    reference: "REFERENCE",
    productCategory: "CATEGORY",
    presentation: "PRODUCT OVERVIEW",
    learnMore: "Learn more",
    aboutProduct: "about this product.",
    productInfo: "Product",
    referenceLabel: "Reference",
    universe: "Brand",
    brandDescription: "Mont Djurdjura — Spring water",
    features: "FEATURES",
    featuresTitle: "Product information",
    featuresDescription:
      "Find the main information about this product.",
    discovery: "CONTINUE EXPLORING",
    otherProducts: "Other products",
    allProducts: "View the full range",
    discover: "Discover",
    contactEyebrow: "MONT DJURDJURA",
    question: "Have a question about",
    thisProduct: "this product?",
    contactDescription:
      "Contact our team to get more information about our product range.",
    contactUs: "Contact us",
    noImage: "Image unavailable",
    noDescription:
      "Detailed information about this product will be available soon.",
    featureItems: [
      "Product presentation",
      "Catalogue information",
      "Product specifications",
    ],
  },

  ar: {
    category: "مياه المنبع",
    home: "الرئيسية",
    products: "منتجاتنا",
    information: "طلب معلومات",
    back: "العودة إلى المنتجات",
    reference: "المرجع",
    productCategory: "الفئة",
    presentation: "تقديم المنتج",
    learnMore: "اكتشف المزيد",
    aboutProduct: "حول هذا المنتج.",
    productInfo: "المنتج",
    referenceLabel: "المرجع",
    universe: "العلامة التجارية",
    brandDescription: "مون جرجرة — مياه المنبع",
    features: "الخصائص",
    featuresTitle: "معلومات المنتج",
    featuresDescription:
      "اكتشفوا أهم المعلومات المتعلقة بهذا المنتج.",
    discovery: "واصلوا اكتشاف منتجاتنا",
    otherProducts: "منتجات أخرى",
    allProducts: "اكتشفوا المجموعة كاملة",
    discover: "اكتشفوا",
    contactEyebrow: "مون جرجرة",
    question: "هل لديكم سؤال حول",
    thisProduct: "هذا المنتج؟",
    contactDescription:
      "تواصلوا مع فريقنا للحصول على المزيد من المعلومات حول منتجاتنا.",
    contactUs: "اتصلوا بنا",
    noImage: "الصورة غير متوفرة",
    noDescription:
      "ستتوفر المعلومات التفصيلية حول هذا المنتج قريبًا.",
    featureItems: [
      "تقديم المنتج",
      "معلومات الكتالوج",
      "خصائص المنتج",
    ],
  },
};

function getProductSlug(product) {
  return product?.slug || product?.id || "";
}

function getProductName(product) {
  return product?.name || product?.title || "";
}

function getProductDescription(product) {
  return (
    product?.description ||
    product?.short_description ||
    product?.shortDescription ||
    ""
  );
}

function getProductShortDescription(product) {
  return (
    product?.short_description ||
    product?.shortDescription ||
    product?.description ||
    ""
  );
}

function getProductImage(product) {
  return product?.image || product?.main_image || null;
}

function getProductCategory(product, locale) {
  const category = product?.category;

  if (typeof category === "string") {
    return category;
  }

  if (category && typeof category === "object") {
    return (
      category.name ||
      category.title ||
      (locale === "ar"
        ? "مياه المنبع"
        : locale === "en"
          ? "Spring water"
          : "Eau de source")
    );
  }

  return locale === "ar"
    ? "مياه المنبع"
    : locale === "en"
      ? "Spring water"
      : "Eau de source";
}

function getProductUrl(locale, slug) {
  return `${SITE_URL}/${locale}/produits/${slug}`;
}

/* =========================
   FETCH PRODUCT
========================= */

async function fetchProduct(slug, locale) {
  try {
    return await getPublicProduct(slug, locale);
  } catch (error) {
    console.error("Unable to load product:", error);
    return null;
  }
}

/* =========================
   RELATED PRODUCTS
========================= */

async function fetchRelatedProducts(currentSlug, locale) {
  try {
    const response = await getPublicProducts(locale);

    if (!Array.isArray(response)) {
      return [];
    }

    return response
      .filter((item) => {
        const slug = getProductSlug(item);

        return (
          slug &&
          slug !== currentSlug &&
          item.is_active !== false
        );
      })
      .slice(0, 3);
  } catch (error) {
    console.error("Unable to load related products:", error);
    return [];
  }
}

/* =========================
   SEO METADATA
========================= */

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  if (!locales.includes(locale)) {
    return {
      title: "Product not found | Mont Djurdjura",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const product = await fetchProduct(slug, locale);

  if (!product) {
    return {
      title:
        locale === "ar"
          ? "المنتج غير موجود | مون جرجرة"
          : locale === "en"
            ? "Product not found | Mont Djurdjura"
            : "Produit introuvable | Mont Djurdjura",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productName = getProductName(product);
  const description = getProductShortDescription(product);
  const canonical = getProductUrl(locale, slug);
  const image = getProductImage(product);

  const title = `${productName} | Mont Djurdjura`;

  return {
    title,
    description,

    alternates: {
      canonical,
      languages: {
        fr: getProductUrl("fr", slug),
        en: getProductUrl("en", slug),
        ar: getProductUrl("ar", slug),
        "x-default": getProductUrl("fr", slug),
      },
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Mont Djurdjura",
      locale: localeOpenGraph[locale],
      alternateLocale: Object.entries(localeOpenGraph)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: "website",
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: `${productName} - Mont Djurdjura`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/* =========================
   PRODUCT DETAIL PAGE
========================= */

export default async function ProductDetailPage({ params }) {
  const { locale, slug } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const product = await fetchProduct(slug, locale);

  if (!product || product.is_active === false) {
    notFound();
  }

  const t = translations[locale];
  const isArabic = locale === "ar";

  const productName = getProductName(product);
  const productDescription = getProductDescription(product);
  const shortDescription = getProductShortDescription(product);
  const productImage = getProductImage(product);
  const categoryName = getProductCategory(product, locale);

  const reference = product.reference || "—";

  const otherProducts = await fetchRelatedProducts(slug, locale);

  const productUrl = getProductUrl(locale, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "SARL ABDELLAH IDAHMANENE",
        alternateName: "Mont Djurdjura",
        url: SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Mont Djurdjura",
        url: SITE_URL,
        inLanguage: ["fr-DZ", "en", "ar-DZ"],
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: productName,
        description: productDescription || shortDescription,
        url: productUrl,
        ...(productImage ? { image: productImage } : {}),
        ...(reference !== "—" ? { sku: reference } : {}),
        brand: {
          "@type": "Brand",
          name: "Mont Djurdjura",
        },
        manufacturer: {
          "@id": `${SITE_URL}/#organization`,
        },
        category: categoryName,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": productUrl,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${productUrl}#webpage`,
        url: productUrl,
        name: `${productName} | Mont Djurdjura`,
        description: shortDescription,
        inLanguage: locale,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${productUrl}#product`,
        },
      },
    ],
  };

  return (
    <div
      className={styles.detailPage}
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* BREADCRUMB */}
      <div className={styles.breadcrumb}>
        <Link href={`/${locale}`}>{t.home}</Link>
        <span>/</span>
        <Link href={`/${locale}/produits`}>{t.products}</Link>
        <span>/</span>
        <span>{productName}</span>
      </div>

      {/* PRODUCT HERO */}
      <section className={styles.productHero}>
        <div className={styles.productVisual}>
          <span className={styles.productNumber}>
            {reference}
          </span>

          {productImage ? (
            <Image
              src={productImage}
              alt={`${productName} - Mont Djurdjura`}
              width={800}
              height={1000}
              unoptimized
              className={styles.productImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: "15%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#718894",
                border: "1px dashed rgba(7,59,92,0.2)",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              {t.noImage}
            </div>
          )}

          <span className={styles.visualCaption}>
            MONT DJURDJURA · {categoryName}
          </span>
        </div>

        <div className={styles.productContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {categoryName}
          </span>

          <h1>{productName}</h1>

          <p className={styles.productLabel}>
            {product.reference || t.category}
          </p>

          <p className={styles.shortDescription}>
            {shortDescription || t.noDescription}
          </p>

          <div className={styles.productActions}>
            <Link
              href={`/${locale}/contact?produit=${encodeURIComponent(slug)}`}
              className={styles.primaryButton}
            >
              {t.information}
              <span>{isArabic ? "↙" : "↗"}</span>
            </Link>

            <Link
              href={`/${locale}/produits`}
              className={styles.backLink}
            >
              {isArabic ? "→" : "←"} {t.back}
            </Link>
          </div>

          <div className={styles.quickInfo}>
            <div>
              <span>{t.reference}</span>
              <strong>{reference}</strong>
            </div>

            <div>
              <span>{t.productCategory}</span>
              <strong>{categoryName}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT DESCRIPTION */}
      <section className={styles.descriptionSection}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>
            {t.presentation}
          </span>

          <h2>
            {t.learnMore}
            <br />
            <span>{t.aboutProduct}</span>
          </h2>
        </div>

        <div className={styles.descriptionContent}>
          <p>{productDescription || t.noDescription}</p>

          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <span>01</span>
              <h3>{t.productInfo}</h3>
              <p>{productName}</p>
            </div>

            <div className={styles.detailCard}>
              <span>02</span>
              <h3>{t.referenceLabel}</h3>
              <p>{reference}</p>
            </div>

            <div className={styles.detailCard}>
              <span>03</span>
              <h3>{t.universe}</h3>
              <p>{t.brandDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.featuresSection}>
        <div>
          <span className={styles.sectionEyebrow}>
            {t.features}
          </span>

          <h2>{t.featuresTitle}</h2>

          <p>{t.featuresDescription}</p>
        </div>

        <div className={styles.featuresList}>
          {t.featureItems.map((feature, index) => (
            <div className={styles.featureItem} key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{feature}</p>
              <span className={styles.featureArrow}>
                {isArabic ? "↙" : "↗"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER PRODUCTS */}
      {otherProducts.length > 0 && (
        <section className={styles.otherProducts}>
          <div className={styles.otherHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                {t.discovery}
              </span>
              <h2>{t.otherProducts}</h2>
            </div>

            <Link href={`/${locale}/produits`}>
              {t.allProducts} {isArabic ? "←" : "→"}
            </Link>
          </div>

          <div className={styles.otherGrid}>
            {otherProducts.map((item) => {
              const itemSlug = getProductSlug(item);
              const itemName = getProductName(item);
              const itemDescription = getProductShortDescription(item);

              return (
                <Link
                  href={`/${locale}/produits/${itemSlug}`}
                  className={styles.otherCard}
                  key={item.id || itemSlug}
                >
                  <span>{item.reference || "—"}</span>
                  <h3>{itemName}</h3>
                  <p>{itemDescription}</p>
                  <strong>
                    {t.discover} {isArabic ? "←" : "→"}
                  </strong>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className={styles.contactSection}>
        <span className={styles.sectionEyebrow}>
          {t.contactEyebrow}
        </span>

        <h2>
          {t.question}
          <br />
          <span>{t.thisProduct}</span>
        </h2>

        <p>{t.contactDescription}</p>

        <Link
          href={`/${locale}/contact?produit=${encodeURIComponent(slug)}`}
          className={styles.primaryButton}
        >
          {t.contactUs}
          <span>{isArabic ? "↙" : "↗"}</span>
        </Link>
      </section>
    </div>
  );
}
