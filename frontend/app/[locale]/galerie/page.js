
import Link from "next/link";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import GalleryLightbox from "./GalleryLightbox";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const API_ORIGIN = API_URL
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const locales = ["fr", "en", "ar"];

const localeOpenGraph = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const content = {
  fr: {
    metadataTitle: "Galerie",
    metadataDescription:
      "Explorez l'univers Mont Djurdjura à travers une galerie inspirée par la nature, l'eau et les montagnes du Djurdjura.",
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "Galerie",
    eyebrow: "NOTRE UNIVERS EN IMAGES",
    title: "La nature,",
    titleAccent: "source d'inspiration.",
    intro:
      "Découvrez l'univers Mont Djurdjura, une identité inspirée par la beauté des paysages naturels, la pureté de l'eau et la richesse des montagnes du Djurdjura.",
    introNote:
      "Chaque détail de notre univers raconte un lien avec la nature et l'essentiel.",
    visualLabel: "L'esprit Mont Djurdjura",
    visualCaption: "Un univers inspiré par la nature.",
    sectionLabel: "NOTRE GALERIE",
    galleryTitle: "Un regard sur notre univers",
    galleryIntro:
      "La nature, les paysages et l'eau sont au cœur de l'identité Mont Djurdjura.",
    emptyTitle: "Notre galerie se prépare",
    emptyDescription:
      "De nouvelles photos seront bientôt disponibles. Revenez découvrir notre univers.",
    closingLabel: "MONT DJURDJURA",
    closingTitle: "La nature au cœur de notre identité.",
    closingText:
      "Découvrez notre marque, notre source et les produits qui composent notre univers.",
    aboutButton: "À propos de nous",
    productsButton: "Découvrir nos produits",
    structuredDescription:
      "Galerie de l'univers Mont Djurdjura, une marque d'eau de source inspirée par la nature et les montagnes du Djurdjura.",
  },

  en: {
    metadataTitle: "Gallery",
    metadataDescription:
      "Explore the Mont Djurdjura universe through a gallery inspired by nature, water and the Djurdjura mountains.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Gallery",
    eyebrow: "OUR WORLD IN PICTURES",
    title: "Nature,",
    titleAccent: "a source of inspiration.",
    intro:
      "Discover the Mont Djurdjura universe, an identity inspired by the beauty of natural landscapes, the purity of water and the richness of the Djurdjura mountains.",
    introNote:
      "Every detail of our world reflects a connection with nature and what matters most.",
    visualLabel: "The Mont Djurdjura spirit",
    visualCaption: "A world inspired by nature.",
    sectionLabel: "OUR GALLERY",
    galleryTitle: "A look into our world",
    galleryIntro:
      "Nature, landscapes and water are at the heart of the Mont Djurdjura identity.",
    emptyTitle: "Our gallery is being prepared",
    emptyDescription:
      "New photos will be available soon. Come back to discover our world.",
    closingLabel: "MONT DJURDJURA",
    closingTitle: "Nature at the heart of our identity.",
    closingText:
      "Discover our brand, our source and the products that shape our world.",
    aboutButton: "About us",
    productsButton: "Discover our products",
    structuredDescription:
      "Gallery of the Mont Djurdjura universe, a spring water brand inspired by nature and the Djurdjura mountains.",
  },

  ar: {
    metadataTitle: "معرض الصور",
    metadataDescription:
      "اكتشفوا عالم مون جرجرة من خلال معرض مستوحى من الطبيعة والمياه وجبال جرجرة.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "معرض الصور",
    eyebrow: "عالمنا في صور",
    title: "الطبيعة،",
    titleAccent: "مصدر إلهامنا.",
    intro:
      "اكتشفوا عالم مون جرجرة، وهوية مستوحاة من جمال المناظر الطبيعية ونقاء المياه وغنى جبال جرجرة.",
    introNote:
      "كل تفصيل من عالمنا يعكس ارتباطنا بالطبيعة وبالأشياء الأساسية.",
    visualLabel: "روح مون جرجرة",
    visualCaption: "عالم يستلهم جماله من الطبيعة.",
    sectionLabel: "معرض الصور",
    galleryTitle: "نظرة على عالمنا",
    galleryIntro:
      "الطبيعة والمناظر الطبيعية والمياه هي في قلب هوية مون جرجرة.",
    emptyTitle: "معرض الصور قيد التحضير",
    emptyDescription:
      "ستتوفر صور جديدة قريباً. عودوا لاكتشاف عالمنا.",
    closingLabel: "مون جرجرة",
    closingTitle: "الطبيعة في قلب هويتنا.",
    closingText:
      "اكتشفوا علامتنا ومنبعنا والمنتجات التي تشكل عالمنا.",
    aboutButton: "من نحن",
    productsButton: "اكتشفوا منتجاتنا",
    structuredDescription:
      "معرض عالم مون جرجرة، علامة لمياه المنبع مستوحاة من الطبيعة وجبال جرجرة.",
  },
};

function getGalleryUrl(locale) {
  return `${SITE_URL}/${locale}/galerie`;
}

function getImageUrl(image) {
  if (!image) return "";

  const path = image.image_path || image.image_url;

  if (!path) return "";

  if (/^(blob:|data:)/i.test(path)) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    try {
      const parsedUrl = new URL(path);

      if (
        parsedUrl.pathname.includes("/storage/") &&
        API_ORIGIN
      ) {
        return `${API_ORIGIN}${parsedUrl.pathname}${parsedUrl.search}`;
      }

      return path;
    } catch {
      return path;
    }
  }

  if (!API_ORIGIN) return "";

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_ORIGIN}/storage/${cleanPath}`;
}

async function getPublishedGallery() {
  if (!API_URL) {
    console.error(
      "NEXT_PUBLIC_API_URL n'est pas configurée."
    );

    return [];
  }

  try {
    const response = await fetch(
      `${API_URL.replace(/\/+$/, "")}/gallery`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Erreur API galerie :",
        response.status,
        response.statusText
      );

      return [];
    }

    const result = await response.json();

    if (!result?.success || !Array.isArray(result?.data)) {
      console.error(
        "Format de réponse API galerie invalide."
      );

      return [];
    }

    return result.data
      .filter(
        (image) =>
          image.is_active === true ||
          image.is_active === 1 ||
          image.is_active === "1"
      )
      .sort((a, b) => {
        const orderA = Number(a.sort_order ?? 0);
        const orderB = Number(b.sort_order ?? 0);

        return orderA - orderB;
      })
      .map((image) => ({
        ...image,
        imageUrl: getImageUrl(image),
      }))
      .filter((image) => image.imageUrl);
  } catch (error) {
    console.error(
      "Impossible de récupérer la galerie :",
      error
    );

    return [];
  }
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return {
      title: "Galerie | Mont Djurdjura",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const t = content[locale];
  const canonical = getGalleryUrl(locale);

  const title =
    locale === "fr"
      ? "Galerie | Mont Djurdjura"
      : locale === "en"
        ? "Gallery | Mont Djurdjura"
        : "معرض الصور | مون جرجرة";

  return {
    title: {
      absolute: title,
    },

    description: t.metadataDescription,

    alternates: {
      canonical,
      languages: {
        fr: getGalleryUrl("fr"),
        en: getGalleryUrl("en"),
        ar: getGalleryUrl("ar"),
        "x-default": getGalleryUrl("fr"),
      },
    },

    openGraph: {
      title,
      description: t.metadataDescription,
      url: canonical,
      siteName: "Mont Djurdjura",
      locale: localeOpenGraph[locale],
      alternateLocale: Object.entries(localeOpenGraph)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: "website",
    },

    twitter: {
      card: "summary",
      title,
      description: t.metadataDescription,
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

export default async function GalleryPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const t = content[locale];
  const canonical = getGalleryUrl(locale);

  const images = await getPublishedGallery();

  const isArabic = locale === "ar";

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
        "@type": "CollectionPage",
        "@id": `${canonical}#webpage`,
        name: t.metadataTitle,
        description: t.structuredDescription,
        url: canonical,
        inLanguage: locale,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        mainEntity: {
          "@type": "ImageGallery",
          name: t.metadataTitle,
          description: t.structuredDescription,
          image: images.map((image) => image.imageUrl),
        },
      },
    ],
  };

  const safeJsonLd = JSON.stringify(jsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <main
      className={styles.galleryPage}
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd,
        }}
      />

      <div className={styles.container}>
        <nav
          className={styles.breadcrumb}
          aria-label="Breadcrumb"
        >
          <Link href={`/${locale}`}>
            {t.breadcrumbHome}
          </Link>

          <span aria-hidden="true">/</span>

          <span aria-current="page">
            {t.breadcrumbCurrent}
          </span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {t.eyebrow}
            </span>

            <h1 className={styles.heroTitle}>
              {t.title}
              <span>{t.titleAccent}</span>
            </h1>

            <p className={styles.heroDescription}>
              {t.intro}
            </p>

            <div className={styles.introNote}>
              <span className={styles.noteMark}>“</span>
              <p>{t.introNote}</p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualFrame}>
              <div
                className={`${styles.scene} ${styles.heroScene}`}
              >
                <span className={styles.sceneSun} />
                <span className={styles.sceneMountainBack} />
                <span className={styles.sceneMountainFront} />
                <span className={styles.sceneWater} />
              </div>

              <div className={styles.visualOverlay}>
                <span className={styles.visualNumber}>
                  01
                </span>

                <span className={styles.visualLabel}>
                  {t.visualLabel}
                </span>
              </div>
            </div>

            <p className={styles.visualCaption}>
              {t.visualCaption}
            </p>
          </div>
        </section>

        <section className={styles.gallerySection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>
              {t.sectionLabel}
            </span>

            <span className={styles.sectionLine} />
          </div>

          <div className={styles.galleryHeading}>
            <div>
              <span className={styles.galleryNumber}>
                {String(images.length).padStart(2, "0")}{" "}
                / {String(images.length).padStart(2, "0")}
              </span>

              <h2>{t.galleryTitle}</h2>

              <p>{t.galleryIntro}</p>
            </div>
          </div>

          {images.length > 0 ? (
            <GalleryLightbox images={images} />
          ) : (
            <div className={styles.galleryGrid}>
              <div
                className={styles.galleryCard}
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "50px 24px",
                }}
              >
                <div className={styles.cardContent}>
                  <h3>{t.emptyTitle}</h3>
                  <p>{t.emptyDescription}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className={styles.closingSection}>
          <div className={styles.closingContent}>
            <span className={styles.sectionLabel}>
              {t.closingLabel}
            </span>

            <h2>{t.closingTitle}</h2>

            <p>{t.closingText}</p>
          </div>

          <div
            className={styles.closingDecoration}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <span className={styles.sectionLabel}>
              MONT DJURDJURA
            </span>

            <h2>{t.closingTitle}</h2>

            <p>{t.closingText}</p>
          </div>

          <div className={styles.ctaActions}>
            <Link
              href={`/${locale}/a-propos`}
              className={styles.primaryButton}
            >
              {t.aboutButton}
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href={`/${locale}/produits`}
              className={styles.secondaryButton}
            >
              {t.productsButton}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
