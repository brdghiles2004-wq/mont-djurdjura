
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const locales = ["fr", "en", "ar"];

const SITE_URL = "https://www.montdjurdjura-dz.com";

const ogLocales = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const schemaLanguages = {
  fr: "fr-DZ",
  en: "en",
  ar: "ar-DZ",
};

const content = {
  fr: {
    metadataTitle: "Notre Source",
    metadataDescription:
      "Découvrez l'univers de Mont Djurdjura, son environnement naturel et son attachement à l'eau de source.",
    heroEyebrow: "MONT DJURDJURA · NOTRE SOURCE",
    heroTitle: <>La nature au cœur<br />de notre histoire.</>,
    heroDescription:
      "Découvrez l'univers de Mont Djurdjura, inspiré par la richesse naturelle et la beauté du massif du Djurdjura.",
    contact: "Nous contacter",
    heroBottomLeft: "UN UNIVERS NATUREL",
    heroBottomRight: "01 — NOTRE SOURCE",
    introLabel: "NOTRE UNIVERS",
    introSmallTitle: "L'INSPIRATION DU DJURDJURA",
    introTitle: <>Une identité inspirée<br />par la <span>nature.</span></>,
    introParagraphs: [
      "Le Djurdjura est un territoire remarquable, reconnu pour ses paysages montagneux, sa richesse naturelle et son caractère authentique.",
      "C'est dans cet univers que s'inscrit Mont Djurdjura. Notre identité met à l'honneur la nature, la simplicité et l'importance de l'eau dans notre quotidien.",
    ],
    natureCaptionLabel: "01 / ENVIRONNEMENT",
    natureCaption: "La beauté naturelle du Djurdjura",
    natureSmallTitle: "UN PATRIMOINE NATUREL",
    natureTitle: <>La montagne,<br />une source d&apos;inspiration.</>,
    natureParagraphs: [
      "Entre reliefs majestueux, végétation et paysages préservés, le massif du Djurdjura représente un environnement naturel exceptionnel.",
      "Cette richesse inspire l'univers de Mont Djurdjura et rappelle le lien essentiel entre l'eau, la nature et la vie.",
    ],
    aboutLink: "En savoir plus sur notre entreprise",
    waterSmallTitle: "L'ESSENTIEL DE LA VIE",
    waterTitle: <>L&apos;eau, une richesse<br /><span>à préserver.</span></>,
    waterDescription:
      "L'eau occupe une place essentielle dans notre vie. Elle mérite toute notre attention, de sa préservation à son utilisation au quotidien.",
    cards: [
      {
        title: "La nature",
        description:
          "Une richesse naturelle qui mérite respect et préservation.",
        icon: "⌁",
      },
      {
        title: "La qualité",
        description:
          "Une attention particulière portée à la qualité et au sérieux de notre démarche.",
        icon: "◈",
      },
      {
        title: "La préservation",
        description:
          "La protection des ressources naturelles est une responsabilité collective.",
        icon: "♧",
      },
    ],
    finalEyebrow: "MONT DJURDJURA",
    finalTitle: <>La nature est notre<br />plus belle inspiration.</>,
    finalDescription:
      "Pour toute information concernant nos produits ou notre entreprise, notre équipe reste à votre écoute.",
    finalButton: "Contactez-nous",
  },

  en: {
    metadataTitle: "Our Source",
    metadataDescription:
      "Discover the world of Mont Djurdjura, its natural surroundings and its connection to spring water.",
    heroEyebrow: "MONT DJURDJURA · OUR SOURCE",
    heroTitle: <>Nature at the heart<br />of our story.</>,
    heroDescription:
      "Discover the world of Mont Djurdjura, inspired by the natural richness and beauty of the Djurdjura mountains.",
    contact: "Contact us",
    heroBottomLeft: "A NATURAL WORLD",
    heroBottomRight: "01 — OUR SOURCE",
    introLabel: "OUR WORLD",
    introSmallTitle: "INSPIRED BY DJURDJURA",
    introTitle: <>An identity inspired<br />by <span>nature.</span></>,
    introParagraphs: [
      "Djurdjura is a remarkable region, known for its mountain landscapes, natural richness and authentic character.",
      "Mont Djurdjura belongs to this world. Our identity celebrates nature, simplicity and the importance of water in our everyday lives.",
    ],
    natureCaptionLabel: "01 / ENVIRONMENT",
    natureCaption: "The natural beauty of Djurdjura",
    natureSmallTitle: "A NATURAL HERITAGE",
    natureTitle: <>The mountains,<br />a source of inspiration.</>,
    natureParagraphs: [
      "With its majestic landscapes, vegetation and preserved scenery, the Djurdjura mountain range represents an exceptional natural environment.",
      "This richness inspires the world of Mont Djurdjura and reminds us of the essential connection between water, nature and life.",
    ],
    aboutLink: "Learn more about our company",
    waterSmallTitle: "THE ESSENCE OF LIFE",
    waterTitle: <>Water, a precious resource<br /><span>to protect.</span></>,
    waterDescription:
      "Water plays an essential role in our lives. It deserves our attention, from protecting it to using it responsibly every day.",
    cards: [
      {
        title: "Nature",
        description:
          "A natural treasure that deserves respect and protection.",
        icon: "⌁",
      },
      {
        title: "Quality",
        description:
          "Particular attention to quality and the care behind our approach.",
        icon: "◈",
      },
      {
        title: "Preservation",
        description:
          "Protecting natural resources is a shared responsibility.",
        icon: "♧",
      },
    ],
    finalEyebrow: "MONT DJURDJURA",
    finalTitle: <>Nature is our<br />greatest inspiration.</>,
    finalDescription:
      "For any information about our products or our company, our team is here to help.",
    finalButton: "Contact us",
  },

  ar: {
    metadataTitle: "منبعنا",
    metadataDescription:
      "اكتشفوا عالم مون جرجرة ومحيطها الطبيعي وارتباطها بمياه المنبع.",
    heroEyebrow: "مون جرجرة · منبعنا",
    heroTitle: <>الطبيعة في قلب<br />حكايتنا.</>,
    heroDescription:
      "اكتشفوا عالم مون جرجرة المستوحى من الثروة الطبيعية وجمال جبال جرجرة.",
    contact: "اتصلوا بنا",
    heroBottomLeft: "عالم من الطبيعة",
    heroBottomRight: "01 — منبعنا",
    introLabel: "عالمنا",
    introSmallTitle: "إلهام من جرجرة",
    introTitle: <>هوية مستوحاة<br />من <span>الطبيعة.</span></>,
    introParagraphs: [
      "تُعد منطقة جرجرة من المناطق المميزة، المعروفة بمناظرها الجبلية وثروتها الطبيعية وطابعها الأصيل.",
      "في هذا العالم تندرج هوية مون جرجرة، حيث نحتفي بالطبيعة والبساطة والأهمية الأساسية للمياه في حياتنا اليومية.",
    ],
    natureCaptionLabel: "01 / البيئة الطبيعية",
    natureCaption: "الجمال الطبيعي لجبال جرجرة",
    natureSmallTitle: "تراث طبيعي",
    natureTitle: <>الجبال،<br />مصدر للإلهام.</>,
    natureParagraphs: [
      "بفضل تضاريسها الشامخة ونباتاتها ومناظرها الطبيعية، تمثل جبال جرجرة بيئة طبيعية استثنائية.",
      "تلهمنا هذه الثروة في عالم مون جرجرة وتذكرنا بالعلاقة الأساسية بين الماء والطبيعة والحياة.",
    ],
    aboutLink: "اكتشفوا المزيد عن مؤسستنا",
    waterSmallTitle: "أساس الحياة",
    waterTitle: <>الماء ثروة<br /><span>يجب الحفاظ عليها.</span></>,
    waterDescription:
      "للمياه مكانة أساسية في حياتنا، وهي تستحق اهتمامنا من خلال المحافظة عليها وحسن استعمالها يومياً.",
    cards: [
      {
        title: "الطبيعة",
        description: "ثروة طبيعية تستحق الاحترام والحماية.",
        icon: "⌁",
      },
      {
        title: "الجودة",
        description: "اهتمام خاص بالجودة والجدية في نهجنا.",
        icon: "◈",
      },
      {
        title: "المحافظة",
        description: "حماية الموارد الطبيعية مسؤولية مشتركة بين الجميع.",
        icon: "♧",
      },
    ],
    finalEyebrow: "مون جرجرة",
    finalTitle: <>الطبيعة هي<br />أجمل مصدر لإلهامنا.</>,
    finalDescription:
      "للحصول على أي معلومات حول منتجاتنا أو مؤسستنا، يبقى فريقنا تحت تصرفكم.",
    finalButton: "تواصلوا معنا",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) return {};

  const page = content[locale];
  const pageUrl = `${SITE_URL}/${locale}/source`;

  return {
    title: page.metadataTitle,
    description: page.metadataDescription,

    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${SITE_URL}/fr/source`,
        en: `${SITE_URL}/en/source`,
        ar: `${SITE_URL}/ar/source`,
        "x-default": `${SITE_URL}/fr/source`,
      },
    },

    openGraph: {
      title: `${page.metadataTitle} | Mont Djurdjura`,
      description: page.metadataDescription,
      url: pageUrl,
      siteName: "Mont Djurdjura",
      locale: ogLocales[locale],
      alternateLocale: Object.entries(ogLocales)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${page.metadataTitle} | Mont Djurdjura`,
      description: page.metadataDescription,
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

export default async function NotreSourcePage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const t = content[locale];
  const isRTL = locale === "ar";
  const pageUrl = `${SITE_URL}/${locale}/source`;

  const sourceSchema = {
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
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        name: `${t.metadataTitle} | Mont Djurdjura`,
        description: t.metadataDescription,
        url: pageUrl,
        inLanguage: schemaLanguages[locale],
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  const localizedLink = (path) => `/${locale}${path}`;

  return (
    <div className={styles.page} dir={isRTL ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sourceSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{t.heroEyebrow}</span>

          <h1>{t.heroTitle}</h1>

          <p>{t.heroDescription}</p>

          <Link href={localizedLink("/contact")} className={styles.heroButton}>
            {t.contact} <span>↗</span>
          </Link>
        </div>

        <div className={styles.heroBottom}>
          <span>{t.heroBottomLeft}</span>
          <span>{t.heroBottomRight}</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.sectionLabel}>
              <span className={styles.labelLine} />
              <span>{t.introLabel}</span>
            </div>

            <div className={styles.introContent}>
              <span className={styles.smallTitle}>
                {t.introSmallTitle}
              </span>

              <h2>{t.introTitle}</h2>

              {t.introParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NATURE */}
      <section className={styles.natureSection}>
        <div className={styles.natureImage}>
          <div className={styles.imageCaption}>
            <span>{t.natureCaptionLabel}</span>
            <p>{t.natureCaption}</p>
          </div>
        </div>

        <div className={styles.natureContent}>
          <span className={styles.smallTitle}>
            {t.natureSmallTitle}
          </span>

          <h2>{t.natureTitle}</h2>

          {t.natureParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <Link href={localizedLink("/a-propos")} className={styles.textLink}>
            {t.aboutLink} <span>→</span>
          </Link>
        </div>
      </section>

      {/* WATER */}
      <section className={styles.waterSection}>
        <div className={styles.container}>
          <div className={styles.waterHeader}>
            <span className={styles.smallTitle}>
              {t.waterSmallTitle}
            </span>

            <h2>{t.waterTitle}</h2>

            <p>{t.waterDescription}</p>
          </div>

          <div className={styles.waterCards}>
            {t.cards.map((card, index) => (
              <article className={styles.waterCard} key={card.title}>
                <div className={styles.cardNumber}>
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className={styles.cardIcon}>{card.icon}</div>

                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL BANNER */}
      <section className={styles.finalSection}>
        <div className={styles.finalOverlay} />

        <div className={styles.finalContent}>
          <span className={styles.eyebrow}>{t.finalEyebrow}</span>

          <h2>{t.finalTitle}</h2>

          <p>{t.finalDescription}</p>

          <Link href={localizedLink("/contact")} className={styles.finalButton}>
            {t.finalButton} <span>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
