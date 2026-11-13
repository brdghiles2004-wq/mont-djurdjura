
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublicProducts } from "@/lib/api";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.montdjurdjura-dz.com";
const locales = ["fr", "en", "ar"];

const localeOpenGraph = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const schemaLanguages = {
  fr: "fr-DZ",
  en: "en",
  ar: "ar-DZ",
};

const translations = {
  fr: {
    metaTitle: "Nos produits | Mont Djurdjura – Eau de source",
    metaDescription:
      "Découvrez les produits Mont Djurdjura et leurs caractéristiques.",
    heroEyebrow: "NOTRE GAMME",
    heroTitleFirst: "La fraîcheur",
    heroTitleSecond: "à chaque instant.",
    heroDescription:
      "Découvrez l'univers Mont Djurdjura à travers notre gamme de produits.",
    discoverProducts: "Découvrir nos produits",
    contactUs: "Nous contacter",
    rangeName: "LA GAMME MONT DJURDJURA",
    sourceWater: "EAU DE SOURCE",
    productsEyebrow: "NOS PRODUITS",
    introTitleFirst: "Une gamme,",
    introTitleSecond: "plusieurs possibilités.",
    introDescription:
      "Découvrez les produits de notre gamme et leurs différentes caractéristiques.",
    introNote: "SIMPLICITÉ · FRAÎCHEUR · QUOTIDIEN",
    collection: "COLLECTION MONT DJURDJURA",
    formatsTitle: "Nos produits",
    formatsPresented: "PRODUITS DISPONIBLES",
    discoverProduct: "Découvrir le produit",
    noProducts:
      "Aucun produit n'est disponible pour le moment. Notre catalogue sera bientôt mis à jour.",
    noImage: "Image non disponible",
    brandEyebrow: "L'UNIVERS MONT DJURDJURA",
    brandTitleFirst: "La nature au cœur",
    brandTitleSecond: "de notre identité.",
    brandCards: [
      {
        title: "Fraîcheur",
        description:
          "Un univers inspiré par la pureté et la fraîcheur de l'eau.",
      },
      {
        title: "Qualité",
        description:
          "Une attention particulière portée à la qualité de nos produits.",
      },
      {
        title: "Quotidien",
        description:
          "Des produits qui accompagnent vos différents moments de consommation.",
      },
    ],
    contactEyebrow: "BESOIN D'INFORMATIONS ?",
    contactTitleFirst: "Parlons de",
    contactTitleSecond: "vos besoins.",
    contactDescription:
      "Notre équipe est à votre écoute pour toute demande d'information concernant nos produits.",
    contactTeam: "Contacter notre équipe",
    productAria: "Découvrir",
    productCategory: "MONT DJURDJURA",
  },

  en: {
    metaTitle: "Our Products | Mont Djurdjura – Spring Water",
    metaDescription:
      "Discover Mont Djurdjura products and their features.",
    heroEyebrow: "OUR RANGE",
    heroTitleFirst: "Freshness",
    heroTitleSecond: "for every moment.",
    heroDescription:
      "Discover the world of Mont Djurdjura through our range of products.",
    discoverProducts: "Discover our products",
    contactUs: "Contact us",
    rangeName: "THE MONT DJURDJURA RANGE",
    sourceWater: "SPRING WATER",
    productsEyebrow: "OUR PRODUCTS",
    introTitleFirst: "One range,",
    introTitleSecond: "many possibilities.",
    introDescription:
      "Discover our products and their different features.",
    introNote: "SIMPLICITY · FRESHNESS · EVERYDAY",
    collection: "MONT DJURDJURA COLLECTION",
    formatsTitle: "Our products",
    formatsPresented: "AVAILABLE PRODUCTS",
    discoverProduct: "Discover this product",
    noProducts:
      "No products are currently available. Our catalogue will be updated soon.",
    noImage: "Image unavailable",
    brandEyebrow: "THE WORLD OF MONT DJURDJURA",
    brandTitleFirst: "Nature at the heart",
    brandTitleSecond: "of our identity.",
    brandCards: [
      {
        title: "Freshness",
        description:
          "A world inspired by the purity and freshness of water.",
      },
      {
        title: "Quality",
        description:
          "Special attention is given to the quality of our products.",
      },
      {
        title: "Everyday",
        description:
          "Products designed for different moments of consumption.",
      },
    ],
    contactEyebrow: "NEED MORE INFORMATION?",
    contactTitleFirst: "Let's talk about",
    contactTitleSecond: "your needs.",
    contactDescription:
      "Our team is available to answer any questions about our products.",
    contactTeam: "Contact our team",
    productAria: "Discover",
    productCategory: "MONT DJURDJURA",
  },

  ar: {
    metaTitle: "منتجاتنا | مون جرجرة – مياه المنبع",
    metaDescription:
      "اكتشفوا منتجات مون جرجرة ومميزاتها.",
    heroEyebrow: "تشكيلتنا",
    heroTitleFirst: "الانتعاش",
    heroTitleSecond: "في كل لحظة.",
    heroDescription:
      "اكتشفوا عالم مون جرجرة من خلال تشكيلتنا من المنتجات.",
    discoverProducts: "اكتشفوا منتجاتنا",
    contactUs: "اتصلوا بنا",
    rangeName: "تشكيلة مون جرجرة",
    sourceWater: "مياه المنبع",
    productsEyebrow: "منتجاتنا",
    introTitleFirst: "تشكيلة واحدة،",
    introTitleSecond: "خيارات متعددة.",
    introDescription:
      "اكتشفوا منتجاتنا ومختلف خصائصها.",
    introNote: "البساطة · الانتعاش · الحياة اليومية",
    collection: "مجموعة مون جرجرة",
    formatsTitle: "منتجاتنا",
    formatsPresented: "المنتجات المتوفرة",
    discoverProduct: "اكتشفوا المنتج",
    noProducts:
      "لا توجد منتجات متاحة حاليًا. سيتم تحديث كتالوجنا قريبًا.",
    noImage: "الصورة غير متوفرة",
    brandEyebrow: "عالم مون جرجرة",
    brandTitleFirst: "الطبيعة في صميم",
    brandTitleSecond: "هويتنا.",
    brandCards: [
      {
        title: "الانتعاش",
        description: "عالم مستوحى من نقاء المياه وانتعاشها.",
      },
      {
        title: "الجودة",
        description: "اهتمام خاص بجودة منتجاتنا.",
      },
      {
        title: "الحياة اليومية",
        description: "منتجات ترافق مختلف لحظات الاستهلاك اليومية.",
      },
    ],
    contactEyebrow: "هل تحتاجون إلى معلومات؟",
    contactTitleFirst: "لنتحدث عن",
    contactTitleSecond: "احتياجاتكم.",
    contactDescription:
      "فريقنا في خدمتكم للإجابة عن جميع استفساراتكم المتعلقة بمنتجاتنا.",
    contactTeam: "تواصلوا مع فريقنا",
    productAria: "اكتشفوا",
    productCategory: "مون جرجرة",
  },
};

function getProductSlug(product) {
  return product.slug || product.id;
}

function getProductName(product) {
  return product.name || product.title || "";
}

function getProductDescription(product) {
  return (
    product.short_description ||
    product.shortDescription ||
    product.description ||
    ""
  );
}

function getProductImage(product) {
  return product.image || product.main_image || null;
}

function getProductImageUrl(image) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return {};
  }

  const t = translations[locale];
  const canonicalUrl = `${SITE_URL}/${locale}/produits`;

  return {
    title: t.metaTitle,
    description: t.metaDescription,

    alternates: {
      canonical: canonicalUrl,
      languages: {
        fr: `${SITE_URL}/fr/produits`,
        en: `${SITE_URL}/en/produits`,
        ar: `${SITE_URL}/ar/produits`,
        "x-default": `${SITE_URL}/fr/produits`,
      },
    },

    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: canonicalUrl,
      siteName: "Mont Djurdjura",
      locale: localeOpenGraph[locale],
      alternateLocale: Object.entries(localeOpenGraph)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function ProduitsPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const currentLocale = locale;
  const t = translations[currentLocale];

  let products = [];

  try {
    const response = await getPublicProducts(currentLocale);

    products = Array.isArray(response)
      ? response.filter((product) => product.is_active !== false)
      : [];
  } catch (error) {
    console.error("Unable to load public products:", error);
  }

  const pageUrl = `${SITE_URL}/${currentLocale}/produits`;

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
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        name: t.metaTitle,
        description: t.metaDescription,
        url: pageUrl,
        inLanguage: schemaLanguages[currentLocale],
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        mainEntity: {
          "@type": "ItemList",
          name: t.metaTitle,
          numberOfItems: products.length,
          itemListOrder: "https://schema.org/ItemListUnordered",
          itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: getProductName(product),
            description: getProductDescription(product),
            url: `${SITE_URL}/${currentLocale}/produits/${getProductSlug(product)}`,
          })),
        },
      },
    ],
  };

  return (
    <div
      className={styles.productsPage}
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            {t.heroEyebrow}
          </span>

          <h1>
            {t.heroTitleFirst}
            <br />
            <span>{t.heroTitleSecond}</span>
          </h1>

          <p>{t.heroDescription}</p>

          <div className={styles.heroActions}>
            <Link href="#catalogue" className={styles.primaryButton}>
              {t.discoverProducts}
              <span>↗</span>
            </Link>

            <Link
              href={`/${currentLocale}/contact`}
              className={styles.secondaryButton}
            >
              {t.contactUs}
            </Link>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <span>01 — {String(products.length).padStart(2, "0")}</span>
          <span>{t.rangeName}</span>
          <span>{t.sourceWater}</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.introduction}>
        <div className={styles.introHeading}>
          <span className={styles.sectionEyebrow}>
            {t.productsEyebrow}
          </span>

          <h2>
            {t.introTitleFirst}
            <br />
            <span>{t.introTitleSecond}</span>
          </h2>
        </div>

        <div className={styles.introText}>
          <p>{t.introDescription}</p>
          <span className={styles.introNote}>{t.introNote}</span>
        </div>
      </section>

      {/* CATALOGUE */}
      <section className={styles.catalogue} id="catalogue">
        <div className={styles.catalogueHeader}>
          <div>
            <span className={styles.sectionEyebrow}>
              {t.collection}
            </span>

            <h2>{t.formatsTitle}</h2>
          </div>

          <span className={styles.productCount}>
            {String(products.length).padStart(2, "0")}
            <span>{t.formatsPresented}</span>
          </span>
        </div>

        {products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product, index) => {
              const slug = getProductSlug(product);
              const productName = getProductName(product);
              const productDescription = getProductDescription(product);
              const imageUrl = getProductImageUrl(
                getProductImage(product)
              );

              return (
                <article
                  className={styles.productCard}
                  key={product.id || slug}
                >
                  <Link
                    href={`/${currentLocale}/produits/${slug}`}
                    className={styles.productCardLink}
                    aria-label={`${t.productAria} ${productName}`}
                  >
                    <div className={styles.cardVisual}>
                      <span className={styles.cardNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className={styles.cardCategory}>
                        {product.category?.name || t.productCategory}
                      </span>

                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={productName}
                          width={800}
                          height={1000}
                          unoptimized
                          className={styles.productImage}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: "18% 10%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#718894",
                            fontSize: "14px",
                            textAlign: "center",
                            border: "1px dashed rgba(7,59,92,0.2)",
                            borderRadius: "12px",
                          }}
                        >
                          {t.noImage}
                        </div>
                      )}

                      <span className={styles.visualLabel}>
                        {product.reference || productName}
                      </span>
                    </div>

                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitleRow}>
                        <div>
                          <span className={styles.cardSubtitle}>
                            MONT DJURDJURA
                          </span>

                          <h3>{productName}</h3>
                        </div>

                        <span className={styles.cardArrow}>↗</span>
                      </div>

                      {productDescription && (
                        <p className={styles.cardDescription}>
                          {productDescription}
                        </p>
                      )}

                      <span className={styles.productLink}>
                        {t.discoverProduct}
                        <span>→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p
            style={{
              padding: "50px 20px",
              textAlign: "center",
              color: "#718894",
              lineHeight: 1.8,
            }}
          >
            {t.noProducts}
          </p>
        )}
      </section>

      {/* BRAND EXPERIENCE */}
      <section className={styles.brandSection}>
        <div className={styles.brandHeading}>
          <span className={styles.sectionEyebrow}>
            {t.brandEyebrow}
          </span>

          <h2>
            {t.brandTitleFirst}
            <br />
            <span>{t.brandTitleSecond}</span>
          </h2>
        </div>

        <div className={styles.brandCards}>
          {t.brandCards.map((card, index) => (
            <article className={styles.brandCard} key={card.title}>
              <span className={styles.brandCardNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className={styles.brandIcon}>
                {["✳", "⌁", "◇"][index]}
              </div>

              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className={styles.contactSection}>
        <div className={styles.contactContent}>
          <span className={styles.sectionEyebrow}>
            {t.contactEyebrow}
          </span>

          <h2>
            {t.contactTitleFirst}
            <br />
            <span>{t.contactTitleSecond}</span>
          </h2>

          <p>{t.contactDescription}</p>

          <Link
            href={`/${currentLocale}/contact`}
            className={styles.primaryButton}
          >
            {t.contactTeam}
            <span>↗</span>
          </Link>
        </div>

        <div className={styles.contactDecoration}>
          <div className={styles.contactCircle} />
          <span>MD</span>
        </div>
      </section>
    </div>
  );
}
