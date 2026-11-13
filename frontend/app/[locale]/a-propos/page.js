
import Link from "next/link";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const locales = ["fr", "en", "ar"];

const localeMetadata = {
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
    metadataTitle: "À propos",
    metadataDescription:
      "Découvrez Mont Djurdjura, son identité, ses valeurs et son engagement autour de l'eau de source.",
    breadcrumbHome: "Accueil",
    breadcrumbCurrent: "À propos",
    eyebrow: "QUI SOMMES-NOUS ?",
    title: "L'eau de source,",
    titleAccent: "une identité naturelle.",
    intro:
      "Mont Djurdjura est une marque inspirée par la richesse naturelle des montagnes du Djurdjura. Notre identité met à l'honneur la simplicité, la nature et l'importance de l'eau dans notre quotidien.",
    introNote:
      "L'eau est une ressource précieuse. Elle accompagne chaque instant de la vie et mérite toute notre attention.",
    visualLabel: "L'inspiration du Djurdjura",
    visualCaption: "La nature au cœur de notre identité.",
    sectionLabel: "NOTRE IDENTITÉ",
    identityTitle: "Une marque inspirée par la nature",
    identityText:
      "Le nom Mont Djurdjura évoque un territoire, un patrimoine naturel et un environnement qui inspire notre identité. Cette inspiration se retrouve dans notre univers visuel et dans la manière dont nous présentons notre marque.",
    identityText2:
      "Nous souhaitons proposer une image claire et accessible, tout en mettant en valeur l'origine de notre identité et l'attachement à notre environnement.",
    commitmentsLabel: "NOS VALEURS",
    commitmentsTitle: "Ce qui nous guide",
    commitmentsIntro:
      "Notre approche repose sur des valeurs simples qui orientent notre identité et notre relation avec nos clients.",
    commitments: [
      {
        number: "01",
        title: "La nature",
        text: "Une identité inspirée par la richesse naturelle du Djurdjura et son environnement.",
      },
      {
        number: "02",
        title: "La confiance",
        text: "Une communication claire et une relation fondée sur la transparence avec nos clients.",
      },
      {
        number: "03",
        title: "L'engagement",
        text: "Une attention portée à notre activité, à nos produits et aux attentes de nos clients.",
      },
    ],
    visionLabel: "NOTRE VISION",
    visionTitle: "Faire de la simplicité une force.",
    visionText:
      "Nous souhaitons faire connaître Mont Djurdjura à travers une identité cohérente, une présentation soignée de nos produits et une relation durable avec nos clients et partenaires.",
    ctaTitle: "Vous souhaitez en savoir plus ?",
    ctaText:
      "Notre équipe reste à votre disposition pour répondre à vos questions et échanger avec vous.",
    ctaButton: "Contactez-nous",
    productsButton: "Découvrir nos produits",
    structuredDescription:
      "Mont Djurdjura est une marque d'eau de source inspirée par la nature et les montagnes du Djurdjura.",
  },

  en: {
    metadataTitle: "About us",
    metadataDescription:
      "Discover Mont Djurdjura, its identity, values and commitment to spring water.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "About us",
    eyebrow: "WHO ARE WE?",
    title: "Spring water,",
    titleAccent: "a natural identity.",
    intro:
      "Mont Djurdjura is a brand inspired by the natural richness of the Djurdjura mountains. Our identity highlights simplicity, nature and the importance of water in our daily lives.",
    introNote:
      "Water is a precious resource. It accompanies every moment of life and deserves our full attention.",
    visualLabel: "Inspired by Djurdjura",
    visualCaption: "Nature at the heart of our identity.",
    sectionLabel: "OUR IDENTITY",
    identityTitle: "A brand inspired by nature",
    identityText:
      "The name Mont Djurdjura evokes a region, a natural heritage and an environment that inspires our identity. This inspiration is reflected in our visual world and in the way we present our brand.",
    identityText2:
      "We aim to offer a clear and accessible image while highlighting the origins of our identity and our connection to the surrounding environment.",
    commitmentsLabel: "OUR VALUES",
    commitmentsTitle: "What guides us",
    commitmentsIntro:
      "Our approach is built on simple values that shape our identity and our relationship with customers.",
    commitments: [
      {
        number: "01",
        title: "Nature",
        text: "An identity inspired by the natural richness of Djurdjura and its environment.",
      },
      {
        number: "02",
        title: "Trust",
        text: "Clear communication and relationships with our customers built on transparency.",
      },
      {
        number: "03",
        title: "Commitment",
        text: "Care and attention given to our activity, our products and our customers' expectations.",
      },
    ],
    visionLabel: "OUR VISION",
    visionTitle: "Making simplicity a strength.",
    visionText:
      "We aim to introduce Mont Djurdjura through a consistent identity, a carefully presented product range and lasting relationships with our customers and partners.",
    ctaTitle: "Would you like to know more?",
    ctaText:
      "Our team is available to answer your questions and hear from you.",
    ctaButton: "Contact us",
    productsButton: "Discover our products",
    structuredDescription:
      "Mont Djurdjura is a spring water brand inspired by nature and the Djurdjura mountains.",
  },

  ar: {
    metadataTitle: "من نحن",
    metadataDescription:
      "اكتشفوا مون جرجرة، هويتها وقيمها والتزامها في مجال مياه المنبع.",
    breadcrumbHome: "الرئيسية",
    breadcrumbCurrent: "من نحن",
    eyebrow: "من نحن؟",
    title: "مياه المنبع،",
    titleAccent: "هوية مستوحاة من الطبيعة.",
    intro:
      "مون جرجرة علامة مستوحاة من الثروة الطبيعية لجبال جرجرة. ترتكز هويتنا على البساطة والطبيعة وأهمية المياه في حياتنا اليومية.",
    introNote:
      "المياه مورد ثمين يرافق مختلف لحظات حياتنا ويستحق منا كل الاهتمام.",
    visualLabel: "إلهام من جبال جرجرة",
    visualCaption: "الطبيعة في قلب هويتنا.",
    sectionLabel: "هويتنا",
    identityTitle: "علامة مستوحاة من الطبيعة",
    identityText:
      "يعكس اسم مون جرجرة منطقة وتراثًا طبيعيًا وبيئة تلهم هويتنا. ويظهر هذا الإلهام في صورتنا البصرية وفي الطريقة التي نقدم بها علامتنا.",
    identityText2:
      "نسعى إلى تقديم صورة واضحة وسهلة الوصول، مع إبراز مصدر هويتنا وارتباطنا بمحيطنا الطبيعي.",
    commitmentsLabel: "قيمنا",
    commitmentsTitle: "المبادئ التي توجهنا",
    commitmentsIntro:
      "تعتمد مقاربتنا على قيم بسيطة توجه هويتنا وعلاقتنا بعملائنا.",
    commitments: [
      {
        number: "01",
        title: "الطبيعة",
        text: "هوية مستوحاة من الثروة الطبيعية لجرجرة ومحيطها.",
      },
      {
        number: "02",
        title: "الثقة",
        text: "تواصل واضح وعلاقة مبنية على الشفافية مع عملائنا.",
      },
      {
        number: "03",
        title: "الالتزام",
        text: "الاهتمام بنشاطنا ومنتجاتنا وتطلعات عملائنا.",
      },
    ],
    visionLabel: "رؤيتنا",
    visionTitle: "أن نجعل البساطة مصدر قوة.",
    visionText:
      "نسعى إلى التعريف بمون جرجرة من خلال هوية متناسقة وتقديم منظم لمنتجاتنا وبناء علاقات مستمرة مع عملائنا وشركائنا.",
    ctaTitle: "هل ترغبون في معرفة المزيد؟",
    ctaText:
      "فريقنا متاح للإجابة عن أسئلتكم والتواصل معكم.",
    ctaButton: "اتصلوا بنا",
    productsButton: "اكتشفوا منتجاتنا",
    structuredDescription:
      "مون جرجرة علامة لمياه المنبع مستوحاة من الطبيعة وجبال جرجرة.",
  },
};

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return {};
  }

  const t = content[locale];
  const pageUrl = `${SITE_URL}/${locale}/a-propos`;

  return {
    title: t.metadataTitle,
    description: t.metadataDescription,

    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${SITE_URL}/fr/a-propos`,
        en: `${SITE_URL}/en/a-propos`,
        ar: `${SITE_URL}/ar/a-propos`,
        "x-default": `${SITE_URL}/fr/a-propos`,
      },
    },

    openGraph: {
      title: `${t.metadataTitle} | Mont Djurdjura`,
      description: t.metadataDescription,
      url: pageUrl,
      siteName: "Mont Djurdjura",
      locale: localeMetadata[locale],
      type: "website",
      alternateLocale: Object.values(localeMetadata).filter(
        (item) => item !== localeMetadata[locale]
      ),
    },

    twitter: {
      card: "summary",
      title: `${t.metadataTitle} | Mont Djurdjura`,
      description: t.metadataDescription,
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const t = content[locale];
  const pageUrl = `${SITE_URL}/${locale}/a-propos`;

  const organizationSchema = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "SARL ABDELLAH IDAHMANENE",
    alternateName: "Mont Djurdjura",
    url: SITE_URL,
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Mont Djurdjura",
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#webpage`,
    name: t.metadataTitle,
    description: t.structuredDescription,
    url: pageUrl,
    inLanguage: schemaLanguages[locale],
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <div className={styles.aboutPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              ...organizationSchema,
            },
            {
              "@context": "https://schema.org",
              ...websiteSchema,
            },
            aboutPageSchema,
          ]).replace(/</g, "\\u003c"),
        }}
      />

      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href={`/${locale}`}>{t.breadcrumbHome}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t.breadcrumbCurrent}</span>
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

            <p className={styles.heroDescription}>{t.intro}</p>

            <div className={styles.introNote}>
              <span className={styles.noteMark}>“</span>
              <p>{t.introNote}</p>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualFrame}>
              <div className={styles.visualBackground}>
                <span className={styles.visualMountainOne} />
                <span className={styles.visualMountainTwo} />
                <span className={styles.visualSun} />
              </div>

              <div className={styles.visualOverlay}>
                <span className={styles.visualNumber}>01</span>
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

        <section className={styles.identitySection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>
              {t.sectionLabel}
            </span>
            <span className={styles.sectionLine} />
          </div>

          <div className={styles.identityGrid}>
            <div className={styles.identityTitleBlock}>
              <span className={styles.identityNumber}>01 / 03</span>
              <h2>{t.identityTitle}</h2>
            </div>

            <div className={styles.identityTextBlock}>
              <p>{t.identityText}</p>
              <p>{t.identityText2}</p>
            </div>
          </div>
        </section>

        <section className={styles.commitmentsSection}>
          <div className={styles.commitmentsHeading}>
            <div>
              <span className={styles.sectionLabel}>
                {t.commitmentsLabel}
              </span>
              <h2>{t.commitmentsTitle}</h2>
              <p>{t.commitmentsIntro}</p>
            </div>
          </div>

          <div className={styles.commitmentsGrid}>
            {t.commitments.map((item) => (
              <article
                className={styles.commitmentCard}
                key={item.number}
              >
                <span className={styles.commitmentNumber}>
                  {item.number}
                </span>

                <div className={styles.commitmentContent}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>

                <span className={styles.commitmentArrow} aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.visionSection}>
          <div className={styles.visionContent}>
            <span className={styles.sectionLabel}>
              {t.visionLabel}
            </span>
            <h2>{t.visionTitle}</h2>
            <p>{t.visionText}</p>
          </div>

          <div className={styles.visionDecoration} aria-hidden="true">
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
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
          </div>

          <div className={styles.ctaActions}>
            <Link
              href={`/${locale}/contact`}
              className={styles.primaryButton}
            >
              {t.ctaButton}
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
    </div>
  );
}
