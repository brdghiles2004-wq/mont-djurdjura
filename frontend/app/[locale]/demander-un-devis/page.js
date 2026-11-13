
import DevisForm from "./DevisForm";
import styles from "./page.module.css";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const locales = ["fr", "en", "ar"];

const ogLocales = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const localeAlternates = {
  fr: "/fr/demander-un-devis",
  en: "/en/demander-un-devis",
  ar: "/ar/demander-un-devis",
};

const translations = {
  fr: {
    title: ["parlons de votre projet."],
    subtitle:
      "Vous avez un besoin spécifique ? Transmettez-nous votre demande et notre équipe vous répondra dans les meilleurs délais.",
    button: "Demander un devis",
    sidebarTitle: "Restons en contact.",
    address: "Adresse",
    phone: "Téléphone",
    fax: "Fax",
    email: "E-mail",
    website: "Site web",
    formLabel: "Votre demande",
    ctaTitle: "Découvrez nos produits.",
    ctaText:
      "Explorez notre gamme de produits et trouvez la solution adaptée à vos besoins.",
    ctaButton: "Découvrir nos produits",
  },

  en: {
    title: ["let's talk about", "your project."],
    subtitle:
      "Do you have a specific requirement? Send us your request and our team will get back to you as soon as possible.",
    button: "Request a quote",
    sidebarTitle: "Let's stay in touch.",
    address: "Address",
    phone: "Phone",
    fax: "Fax",
    email: "Email",
    website: "Website",
    formLabel: "Your request",
    ctaTitle: "Discover our products.",
    ctaText:
      "Explore our product range and find the right solution for your needs.",
    ctaButton: "Discover our products",
  },

  ar: {
    title: ["لنتحدث عن", "مشروعكم."],
    subtitle:
      "هل لديكم احتياجات محددة؟ أرسلوا لنا طلبكم وسيتواصل معكم فريقنا في أقرب وقت ممكن.",
    button: "طلب عرض سعر",
    sidebarTitle: "لنبقَ على تواصل.",
    address: "العنوان",
    phone: "الهاتف",
    fax: "الفاكس",
    email: "البريد الإلكتروني",
    website: "الموقع الإلكتروني",
    formLabel: "طلبكم",
    ctaTitle: "اكتشفوا منتجاتنا.",
    ctaText:
      "اكتشفوا مجموعتنا من المنتجات واختاروا الحل المناسب لاحتياجاتكم.",
    ctaButton: "اكتشفوا منتجاتنا",
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const currentLocale = translations[locale] ? locale : "fr";

  const metadata = {
    fr: {
      title: "Demander un devis | Mont Djurdjura",
      description:
        "Contactez Mont Djurdjura pour demander un devis et obtenir des informations sur nos produits.",
    },
    en: {
      title: "Request a Quote | Mont Djurdjura",
      description:
        "Contact Mont Djurdjura to request a quote and get information about our products.",
    },
    ar: {
      title: "طلب عرض سعر | مون جرجرة",
      description:
        "تواصلوا مع مون جرجرة لطلب عرض سعر والحصول على معلومات حول منتجاتنا.",
    },
  };

  const current = metadata[currentLocale];
  const pageUrl = `${SITE_URL}/${currentLocale}/demander-un-devis`;

  const alternateLocales = locales
    .filter((item) => item !== currentLocale)
    .map((item) => ogLocales[item]);

  return {
    title: {
      absolute: current.title,
    },
    description: current.description,

    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${SITE_URL}${localeAlternates.fr}`,
        en: `${SITE_URL}${localeAlternates.en}`,
        ar: `${SITE_URL}${localeAlternates.ar}`,
        "x-default": `${SITE_URL}${localeAlternates.fr}`,
      },
    },

    openGraph: {
      title: current.title,
      description: current.description,
      url: pageUrl,
      siteName: "Mont Djurdjura",
      type: "website",
      locale: ogLocales[currentLocale],
      alternateLocale: alternateLocales,
    },

    twitter: {
      card: "summary",
      title: current.title,
      description: current.description,
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

export default async function DemanderUnDevisPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const currentLocale = translations[locale] ? locale : "fr";

  const t = translations[currentLocale];
  const isRTL = currentLocale === "ar";

  const pageUrl = `${SITE_URL}/${currentLocale}/demander-un-devis`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#webpage`,
    name:
      currentLocale === "ar"
        ? "طلب عرض سعر - مون جرجرة"
        : currentLocale === "en"
          ? "Request a Quote - Mont Djurdjura"
          : "Demander un devis - Mont Djurdjura",
    url: pageUrl,
    description: t.subtitle,
    inLanguage: currentLocale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Mont Djurdjura",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "SARL ABDELLAH IDAHMANENE – Mont Djurdjura",
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
  };

  const contactItems = [
    {
      label: t.address,
      value: "Arafou route N° 26, Chorfa, Bouira.",
      icon: "⌖",
    },
    {
      label: t.phone,
      value: "020 72 34 34 / 30 30",
      href: "tel:+21320723434",
      icon: "☎",
    },
    {
      label: t.fax,
      value: "026 950 570",
      icon: "▤",
    },
    {
      label: t.email,
      value: "contact@montdjurdjura-dz.com",
      href: "mailto:contact@montdjurdjura-dz.com",
      icon: "✉",
    },
    {
      label: t.website,
      value: "www.montdjurdjura-dz.com",
      href: SITE_URL,
      external: true,
      icon: "↗",
    },
  ];

  return (
    <main className={styles.page} dir={isRTL ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{t.formLabel}</span>

            <h1 className={styles.heroTitle}>
              {t.title.map((line, index) => (
                <span key={index} dir={isRTL ? "rtl" : "ltr"}>
                  {line}
                </span>
              ))}
            </h1>

            <p className={styles.heroDescription}>{t.subtitle}</p>

            <a className={styles.heroButton} href="#devis-form">
              {t.button}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="devis-form">
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <aside className={styles.sidebar}>
              <span className={styles.sidebarEyebrow}>
                {currentLocale === "ar"
                  ? "تواصلوا معنا"
                  : currentLocale === "en"
                    ? "GET IN TOUCH"
                    : "CONTACT"}
              </span>

              <h2 className={styles.sidebarTitle}>{t.sidebarTitle}</h2>

              <div className={styles.contactList}>
                {contactItems.map((item) => (
                  <div className={styles.contactItem} key={item.label}>
                    <span className={styles.contactIcon} aria-hidden="true">
                      {item.icon}
                    </span>

                    <div className={styles.contactText}>
                      <span className={styles.contactLabel}>
                        {item.label}
                      </span>

                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <div className={styles.formWrapper}>
              <div className={styles.formHeader}>
                <span className={styles.formNumber}>01 / 02</span>
                <h2>{t.formLabel}</h2>
              </div>

              <DevisForm locale={currentLocale} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bottomCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div>
              <span className={styles.ctaEyebrow}>MONT DJURDJURA</span>
              <h2>{t.ctaTitle}</h2>
              <p>{t.ctaText}</p>
            </div>

            <a
              href={`/${currentLocale}/produits`}
              className={styles.ctaButton}
            >
              {t.ctaButton}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
