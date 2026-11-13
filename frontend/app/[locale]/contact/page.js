
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProduct } from "@/lib/api";
import styles from "./page.module.css";
import ContactForm from "./ContactForm";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const locales = ["fr", "en", "ar"];

const localeOpenGraph = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const mapUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.1616090464595!2d4.342988399999999!3d36.356864200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128c590072522923%3A0x96ff2ef86ca96d5b!2sSARL%20ABDELLAH%20IDAHMANENE%20Mont%20Djurdjura!5e0!3m2!1sfr!2sdz!4v1793910835585!5m2!1sfr!2sdz";

const translations = {
  fr: {
    metadataTitle: "Contact | Mont Djurdjura",
    metadataDescription:
      "Contactez SARL ABDELLAH IDAHMANENE – Mont Djurdjura pour toute demande d'information ou de collaboration.",
    home: "Accueil",
    eyebrow: "MONT DJURDJURA",
    heroTitle: "Restons",
    heroHighlight: "en contact.",
    heroDescription:
      "Une question ou une demande d'information ? Notre équipe est à votre écoute.",
    coordinates: "NOS COORDONNÉES",
    contactTitle: "Parlons de",
    contactHighlight: "votre projet.",
    infoDescription:
      "N'hésitez pas à nous contacter pour toute demande d'information, de collaboration ou de renseignement concernant nos produits.",
    address: "Adresse",
    addressValue: "Arafou route N° 26, Chorfa, Bouira.",
    phone: "Téléphone",
    fax: "Fax",
    email: "Email",
    website: "Site web",
    backHome: "Retour à l'accueil",
    writeUs: "ÉCRIVEZ-NOUS",
    formTitle: "Envoyez-nous un",
    formHighlight: "message.",
    formDescription:
      "Remplissez le formulaire ci-dessous. Nous vous répondrons dans les meilleurs délais.",
    findUs: "NOUS TROUVER",
    mapTitle: "Retrouvez",
    mapHighlight: "notre usine.",
    openMap: "Ouvrir dans Google Maps",
    mapTitleAttribute:
      "Localisation de l'usine Mont Djurdjura à Chorfa, Bouira",
  },

  en: {
    metadataTitle: "Contact | Mont Djurdjura",
    metadataDescription:
      "Contact SARL ABDELLAH IDAHMANENE – Mont Djurdjura for information, enquiries or collaboration.",
    home: "Home",
    eyebrow: "MONT DJURDJURA",
    heroTitle: "Let's stay",
    heroHighlight: "in touch.",
    heroDescription:
      "Have a question or need more information? Our team is here to help.",
    coordinates: "OUR CONTACT DETAILS",
    contactTitle: "Let's talk about",
    contactHighlight: "your project.",
    infoDescription:
      "Feel free to contact us for information, collaboration opportunities or enquiries about our products.",
    address: "Address",
    addressValue: "Arafou route N° 26, Chorfa, Bouira.",
    phone: "Phone",
    fax: "Fax",
    email: "Email",
    website: "Website",
    backHome: "Back to home",
    writeUs: "WRITE TO US",
    formTitle: "Send us a",
    formHighlight: "message.",
    formDescription:
      "Complete the form below. We will get back to you as soon as possible.",
    findUs: "FIND US",
    mapTitle: "Find",
    mapHighlight: "our factory.",
    openMap: "Open in Google Maps",
    mapTitleAttribute:
      "Location of the Mont Djurdjura factory in Chorfa, Bouira",
  },

  ar: {
    metadataTitle: "اتصل بنا | مون جرجرة",
    metadataDescription:
      "تواصل مع شركة SARL ABDELLAH IDAHMANENE – مون جرجرة للاستفسار أو طلب المعلومات والتعاون.",
    home: "الرئيسية",
    eyebrow: "مون جرجرة",
    heroTitle: "ابقوا",
    heroHighlight: "على تواصل معنا.",
    heroDescription:
      "هل لديكم سؤال أو تحتاجون إلى معلومات إضافية؟ فريقنا في خدمتكم.",
    coordinates: "معلومات الاتصال",
    contactTitle: "لنتحدث عن",
    contactHighlight: "مشروعكم.",
    infoDescription:
      "لا تترددوا في التواصل معنا لأي استفسار أو طلب معلومات أو تعاون يتعلق بمنتجاتنا.",
    address: "العنوان",
    addressValue: "العرافو، الطريق رقم 26، الشرفة، البويرة.",
    phone: "الهاتف",
    fax: "الفاكس",
    email: "البريد الإلكتروني",
    website: "الموقع الإلكتروني",
    backHome: "العودة إلى الرئيسية",
    writeUs: "راسلونا",
    formTitle: "أرسلوا لنا",
    formHighlight: "رسالة.",
    formDescription:
      "املؤوا الاستمارة أدناه، وسنرد عليكم في أقرب وقت ممكن.",
    findUs: "موقعنا",
    mapTitle: "اكتشفوا",
    mapHighlight: "موقع مصنعنا.",
    openMap: "افتح في خرائط Google",
    mapTitleAttribute:
      "موقع مصنع مون جرجرة في الشرفة، البويرة",
  },
};

function getContactUrl(locale) {
  return `${SITE_URL}/${locale}/contact`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return {
      title: "Contact | Mont Djurdjura",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const t = translations[locale];
  const canonical = getContactUrl(locale);

  return {
    title: {
      absolute: t.metadataTitle,
    },

    description: t.metadataDescription,

    alternates: {
      canonical,
      languages: {
        fr: getContactUrl("fr"),
        en: getContactUrl("en"),
        ar: getContactUrl("ar"),
        "x-default": getContactUrl("fr"),
      },
    },

    openGraph: {
      title: t.metadataTitle,
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
      title: t.metadataTitle,
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

export default async function ContactPage({ params, searchParams }) {
  const { locale } = await params;
  const query = searchParams ? await searchParams : {};

  if (!locales.includes(locale)) {
    notFound();
  }

  const t = translations[locale];
  const isArabic = locale === "ar";

  const requestedProductSlug = Array.isArray(query.produit)
    ? query.produit[0]
    : query.produit;

  let selectedProduct = null;

  if (
    typeof requestedProductSlug === "string" &&
    requestedProductSlug.trim()
  ) {
    try {
      selectedProduct = await getPublicProduct(
        requestedProductSlug.trim()
      );
    } catch (error) {
      console.error("Contact product loading error:", error);
    }
  }

  const canonical = getContactUrl(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "SARL ABDELLAH IDAHMANENE",
        alternateName: "Mont Djurdjura",
        url: SITE_URL,
        email: "contact@montdjurdjura-dz.com",
        telephone: "+21320723434",
        faxNumber: "+21326950570",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Arafou route N° 26",
          addressLocality: "Chorfa",
          addressRegion: "Bouira",
          addressCountry: "DZ",
        },
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
        "@type": "ContactPage",
        "@id": `${canonical}#webpage`,
        name: t.metadataTitle,
        description: t.metadataDescription,
        url: canonical,
        inLanguage: locale,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
        mainEntity: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  const safeStructuredData = JSON.stringify(structuredData).replace(
    /</g,
    "\\u003c"
  );

  return (
    <div
      className={styles.page}
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeStructuredData,
        }}
      />

      <section className={styles.hero}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>

        <h1>
          {t.heroTitle} <span>{t.heroHighlight}</span>
        </h1>

        <p>{t.heroDescription}</p>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactInfo}>
          <span className={styles.sectionLabel}>
            {t.coordinates}
          </span>

          <h2>
            {t.contactTitle} <span>{t.contactHighlight}</span>
          </h2>

          <p className={styles.infoDescription}>
            {t.infoDescription}
          </p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>⌖</div>
              <div>
                <h3>{t.address}</h3>
                <p>{t.addressValue}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>☎</div>
              <div>
                <h3>{t.phone}</h3>
                <a href="tel:+21320723434">
                  020 72 34 34 / 30 30
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>▤</div>
              <div>
                <h3>{t.fax}</h3>
                <p>026 950 570</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>✉</div>
              <div>
                <h3>{t.email}</h3>
                <a href="mailto:contact@montdjurdjura-dz.com">
                  contact@montdjurdjura-dz.com
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>↗</div>
              <div>
                <h3>{t.website}</h3>
                <a
                  href={SITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.montdjurdjura-dz.com
                </a>
              </div>
            </div>
          </div>

          <Link href={`/${locale}`} className={styles.homeLink}>
            {isArabic ? "→" : "←"} {t.backHome}
          </Link>
        </div>

        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <span className={styles.sectionLabel}>
              {t.writeUs}
            </span>

            <h2>
              {t.formTitle} <span>{t.formHighlight}</span>
            </h2>

            <p>{t.formDescription}</p>
          </div>

          <ContactForm
            locale={locale}
            productName={selectedProduct?.name || ""}
          />
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapHeading}>
          <div>
            <span className={styles.sectionLabel}>
              {t.findUs}
            </span>

            <h2>
              {t.mapTitle} <span>{t.mapHighlight}</span>
            </h2>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=SARL+ABDELLAH+IDAHMANENE+Mont+Djurdjura"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapLink}
          >
            {t.openMap} ↗
          </a>
        </div>

        <div className={styles.mapContainer}>
          <iframe
            src={mapUrl}
            title={t.mapTitleAttribute}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
    </div>
  );
}
