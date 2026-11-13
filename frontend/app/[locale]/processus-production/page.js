
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

const SITE_URL = "https://www.montdjurdjura-dz.com";
const PAGE_PATH = "/processus-production";

const locales = ["fr", "en", "ar"];

const localeMap = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const translations = {
  fr: {
    title: "Processus de production",
    description:
      "Découvrez les grandes étapes du processus de production et de conditionnement de l'eau de source Mont Djurdjura.",
    home: "Accueil",
    eyebrow: "DE LA SOURCE AU PRODUIT",
    heroTitle: <>Chaque étape<br />compte dans<br /><span>notre processus.</span></>,
    heroDescription:
      "Découvrez les grandes étapes qui composent le parcours de l'eau, de son origine jusqu'à son conditionnement.",
    explore: "Explorer les étapes",
    heroCaption: "UN PARCOURS À DÉCOUVRIR",
    heroFooterLeft: "NOTRE SAVOIR-FAIRE",
    heroFooterRight: "PROCESSUS DE PRODUCTION",
    introLabel: "LE PARCOURS DE L'EAU",
    introTitle: <>De son origine<br />jusqu&apos;à son<span> conditionnement.</span></>,
    introParagraphs: [
      "La production d'une eau conditionnée repose sur plusieurs étapes complémentaires. Chacune intervient dans un parcours qui doit répondre aux procédures et aux exigences applicables.",
      "Explorez ci-dessous une présentation générale de ces différentes étapes.",
    ],
    stagesLabel: "LES GRANDES ÉTAPES",
    stagesTitle: <>Un parcours en<br />cinq grandes étapes.</>,
    stagesDescription:
      "Une présentation structurée du parcours de production. Les détails techniques seront adaptés aux installations et aux procédures réelles de l'entreprise.",
    stages: [
      {
        title: "Captage de l'eau",
        subtitle: "L'origine du parcours",
        description:
          "Le parcours de l'eau commence au niveau de sa source. Cette première étape permet son acheminement vers les installations dédiées à son traitement et à son conditionnement, selon le dispositif du site.",
        tag: "ORIGINE",
        symbol: "⌁",
      },
      {
        title: "Préparation",
        subtitle: "Une étape essentielle",
        description:
          "L'eau suit les opérations de préparation prévues par le procédé de production. Les équipements et les méthodes utilisés dépendent des caractéristiques de l'eau et des installations de l'entreprise.",
        tag: "PRÉPARATION",
        symbol: "◌",
      },
      {
        title: "Contrôle qualité",
        subtitle: "Une attention constante",
        description:
          "Les contrôles permettent de vérifier les paramètres définis dans le cadre du suivi de la qualité. Les analyses et les procédures réellement appliquées seront présentées à partir des informations officielles de l'entreprise.",
        tag: "CONTRÔLE",
        symbol: "◇",
      },
      {
        title: "Embouteillage",
        subtitle: "Le conditionnement commence",
        description:
          "Cette étape consiste à remplir les contenants destinés à recevoir l'eau. Les opérations et les équipements présentés ici seront précisés selon la ligne d'embouteillage réellement utilisée.",
        tag: "EMBOUTEILLAGE",
        symbol: "▤",
      },
      {
        title: "Conditionnement",
        subtitle: "Prêts pour la distribution",
        description:
          "Les produits conditionnés sont préparés pour leur stockage et leur distribution. Les formats, emballages et modalités de préparation seront détaillés à partir des données communiquées par Mont Djurdjura.",
        tag: "CONDITIONNEMENT",
        symbol: "□",
      },
    ],
    qualityLabel: "QUALITÉ & ATTENTION",
    qualityTitle: <>La qualité au cœur<br />de chaque attention.</>,
    qualityDescription:
      "Le suivi de la qualité constitue un élément important dans la production d'eau conditionnée. Les contrôles, les analyses et les procédures doivent être présentés avec précision, sur la base des informations officielles de l'entreprise.",
    qualityLink: "Découvrir notre source",
    noteTitle: "À propos de cette présentation",
    noteDescription:
      "Ce schéma présente des étapes générales du processus de production d'eau conditionnée. Il ne constitue pas une description certifiée du procédé de Mont Djurdjura. Les informations techniques seront complétées après validation par l'entreprise.",
    ctaLabel: "MONT DJURDJURA",
    ctaTitle: <>Découvrez également<br />nos produits.</>,
    ctaDescription:
      "Explorez les différents formats et découvrez l'univers de Mont Djurdjura.",
    products: "Voir nos produits",
    contact: "Nous contacter",
  },

  en: {
    title: "Production Process",
    description:
      "Discover the main stages involved in the production and packaging process of Mont Djurdjura spring water.",
    home: "Home",
    eyebrow: "FROM SOURCE TO PRODUCT",
    heroTitle: <>Every step<br />matters in<br /><span>our process.</span></>,
    heroDescription:
      "Discover the main stages in the journey of water, from its origin to its packaging.",
    explore: "Explore the stages",
    heroCaption: "A JOURNEY TO DISCOVER",
    heroFooterLeft: "OUR EXPERTISE",
    heroFooterRight: "PRODUCTION PROCESS",
    introLabel: "THE JOURNEY OF WATER",
    introTitle: <>From its origin<br />to its<span> packaging.</span></>,
    introParagraphs: [
      "The production of packaged water involves several complementary stages. Each forms part of a process that must comply with applicable procedures and requirements.",
      "Explore the general presentation of these different stages below.",
    ],
    stagesLabel: "THE MAIN STAGES",
    stagesTitle: <>A journey through<br />five main stages.</>,
    stagesDescription:
      "A structured overview of the production journey. Technical details will be adapted to the company's actual facilities and procedures.",
    stages: [
      {
        title: "Water collection",
        subtitle: "Where the journey begins",
        description:
          "The water journey begins at its source. This first stage involves conveying the water to the facilities dedicated to its treatment and packaging, according to the site's system.",
        tag: "ORIGIN",
        symbol: "⌁",
      },
      {
        title: "Preparation",
        subtitle: "An essential stage",
        description:
          "The water undergoes the preparation operations specified by the production process. The equipment and methods used depend on the water's characteristics and the company's facilities.",
        tag: "PREPARATION",
        symbol: "◌",
      },
      {
        title: "Quality control",
        subtitle: "Continuous attention",
        description:
          "Checks are used to verify the parameters defined as part of quality monitoring. The analyses and procedures actually applied will be presented using official company information.",
        tag: "CONTROL",
        symbol: "◇",
      },
      {
        title: "Bottling",
        subtitle: "Packaging begins",
        description:
          "At this stage, the containers intended to hold the water are filled. The operations and equipment shown here will be specified according to the actual bottling line used.",
        tag: "BOTTLING",
        symbol: "▤",
      },
      {
        title: "Packaging",
        subtitle: "Ready for distribution",
        description:
          "Packaged products are prepared for storage and distribution. Formats, packaging and preparation methods will be detailed using information provided by Mont Djurdjura.",
        tag: "PACKAGING",
        symbol: "□",
      },
    ],
    qualityLabel: "QUALITY & CARE",
    qualityTitle: <>Quality at the heart<br />of every consideration.</>,
    qualityDescription:
      "Quality monitoring is an important part of packaged water production. Checks, analyses and procedures should be described accurately, based on official company information.",
    qualityLink: "Discover our source",
    noteTitle: "About this presentation",
    noteDescription:
      "This diagram presents general stages in the production of packaged water. It is not a certified description of Mont Djurdjura's process. Technical information will be completed after validation by the company.",
    ctaLabel: "MONT DJURDJURA",
    ctaTitle: <>Discover our<br />products as well.</>,
    ctaDescription:
      "Explore the different formats and discover the world of Mont Djurdjura.",
    products: "View our products",
    contact: "Contact us",
  },

  ar: {
    title: "مراحل الإنتاج",
    description:
      "اكتشفوا المراحل الرئيسية لإنتاج وتعبئة مياه منبع مون جرجرة.",
    home: "الرئيسية",
    eyebrow: "من المنبع إلى المنتج",
    heroTitle: <>كل مرحلة<br />لها أهميتها في<br /><span>مسار إنتاجنا.</span></>,
    heroDescription:
      "اكتشفوا المراحل الرئيسية لمسار المياه، من مصدرها إلى غاية تعبئتها.",
    explore: "اكتشفوا المراحل",
    heroCaption: "مسار يستحق الاكتشاف",
    heroFooterLeft: "خبرتنا",
    heroFooterRight: "مراحل الإنتاج",
    introLabel: "مسار المياه",
    introTitle: <>من المصدر<br />إلى غاية<span> التعبئة.</span></>,
    introParagraphs: [
      "يعتمد إنتاج المياه المعبأة على عدة مراحل متكاملة، تندرج ضمن مسار يجب أن يراعي الإجراءات والمتطلبات المعمول بها.",
      "اكتشفوا فيما يلي عرضاً عاماً لهذه المراحل المختلفة.",
    ],
    stagesLabel: "المراحل الرئيسية",
    stagesTitle: <>مسار يتكوّن من<br />خمس مراحل رئيسية.</>,
    stagesDescription:
      "عرض منظم لمسار الإنتاج. سيتم تكييف التفاصيل التقنية وفق التجهيزات والإجراءات الفعلية للمؤسسة.",
    stages: [
      {
        title: "استخراج المياه",
        subtitle: "بداية المسار",
        description:
          "يبدأ مسار المياه من منبعها. وتتمثل هذه المرحلة في نقل المياه نحو المنشآت المخصصة لمعالجتها وتعبئتها، وفق النظام المعتمد في الموقع.",
        tag: "المصدر",
        symbol: "⌁",
      },
      {
        title: "التحضير",
        subtitle: "مرحلة أساسية",
        description:
          "تمر المياه بعمليات التحضير المحددة ضمن عملية الإنتاج. وتعتمد التجهيزات والطرق المستعملة على خصائص المياه ومنشآت المؤسسة.",
        tag: "التحضير",
        symbol: "◌",
      },
      {
        title: "مراقبة الجودة",
        subtitle: "عناية مستمرة",
        description:
          "تسمح عمليات المراقبة بالتحقق من المعايير المحددة ضمن متابعة الجودة. وسيتم عرض التحاليل والإجراءات المعتمدة فعلياً بالاستناد إلى المعلومات الرسمية للمؤسسة.",
        tag: "المراقبة",
        symbol: "◇",
      },
      {
        title: "التعبئة في القوارير",
        subtitle: "بداية عملية التعبئة",
        description:
          "تتمثل هذه المرحلة في ملء العبوات المخصصة لاستقبال المياه. وسيتم تحديد العمليات والتجهيزات وفق خط التعبئة المستعمل فعلياً.",
        tag: "التعبئة",
        symbol: "▤",
      },
      {
        title: "التغليف والتحضير",
        subtitle: "الاستعداد للتوزيع",
        description:
          "يتم تحضير المنتجات المعبأة من أجل تخزينها وتوزيعها. وسيتم توضيح الأحجام ومواد التغليف وطرق التحضير استناداً إلى المعلومات المقدمة من مون جرجرة.",
        tag: "التغليف",
        symbol: "□",
      },
    ],
    qualityLabel: "الجودة والعناية",
    qualityTitle: <>الجودة في صميم<br />كل اهتمام.</>,
    qualityDescription:
      "تُعد متابعة الجودة عنصراً مهماً في إنتاج المياه المعبأة. وينبغي عرض عمليات المراقبة والتحاليل والإجراءات بدقة، استناداً إلى المعلومات الرسمية للمؤسسة.",
    qualityLink: "اكتشفوا منبعنا",
    noteTitle: "حول هذا العرض",
    noteDescription:
      "يعرض هذا المخطط مراحل عامة لإنتاج المياه المعبأة، ولا يمثل وصفاً معتمداً أو موثقاً لعملية الإنتاج الخاصة بمون جرجرة. سيتم استكمال المعلومات التقنية بعد مراجعتها والموافقة عليها من طرف المؤسسة.",
    ctaLabel: "مون جرجرة",
    ctaTitle: <>اكتشفوا أيضاً<br />منتجاتنا.</>,
    ctaDescription:
      "اكتشفوا مختلف أحجام منتجاتنا وتعرفوا على عالم مون جرجرة.",
    products: "اكتشفوا منتجاتنا",
    contact: "اتصلوا بنا",
  },
};

function getPageUrl(locale) {
  return `${SITE_URL}/${locale}${PAGE_PATH}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) return {};

  const t = translations[locale];
  const pageUrl = getPageUrl(locale);

  return {
    title: {
      absolute: `${t.title} | Mont Djurdjura`,
    },
    description: t.description,

    alternates: {
      canonical: pageUrl,
      languages: {
        fr: getPageUrl("fr"),
        en: getPageUrl("en"),
        ar: getPageUrl("ar"),
        "x-default": getPageUrl("fr"),
      },
    },

    openGraph: {
      title: `${t.title} | Mont Djurdjura`,
      description: t.description,
      url: pageUrl,
      siteName: "Mont Djurdjura",
      type: "website",
      locale: localeMap[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => localeMap[item]),
    },

    twitter: {
      card: "summary",
      title: `${t.title} | Mont Djurdjura`,
      description: t.description,
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

export default async function ProductionPage({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const t = translations[locale];
  const isRTL = locale === "ar";
  const localized = (path) => `/${locale}${path}`;

  const pageUrl = getPageUrl(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: `${t.title} - Mont Djurdjura`,
    description: t.description,
    url: pageUrl,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Mont Djurdjura",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Mont Djurdjura",
      url: SITE_URL,
    },
  };

  return (
    <div className={styles.page} dir={isRTL ? "rtl" : "ltr"} lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href={localized("")}>{t.home}</Link>
            <span>/</span>
            <span>{t.title}</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>
                <span />
                {t.eyebrow}
              </span>

              <h1>{t.heroTitle}</h1>

              <p>{t.heroDescription}</p>

              <a href="#etapes" className={styles.heroButton}>
                {t.explore}
                <span>↓</span>
              </a>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.visualOrbit} />
              <div className={styles.visualOrbitSecond} />

              <div className={styles.visualWater}>
                <div className={styles.waterShape} />
                <div className={styles.waterReflection} />
              </div>

              <div className={styles.visualDrop}>M</div>

              <div className={styles.visualCaption}>
                <span className={styles.captionLine} />
                <div>
                  <strong>MONT DJURDJURA</strong>
                  <span>{t.heroCaption}</span>
                </div>
              </div>

              <span className={styles.visualIndex}>01 / 05</span>
            </div>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <span>{t.heroFooterLeft}</span>
          <span className={styles.footerLine} />
          <span>{t.heroFooterRight}</span>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.intro} id="etapes">
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div>
              <span className={styles.sectionLabel}>
                {t.introLabel}
              </span>

              <h2>{t.introTitle}</h2>
            </div>

            <div className={styles.introDescription}>
              {t.introParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={styles.processOverview}>
            {t.stages.map((stage, index) => (
              <div className={styles.overviewItem} key={index}>
                <div className={styles.overviewCircle}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <span className={styles.overviewTitle}>
                  {stage.title}
                </span>

                {index !== t.stages.length - 1 && (
                  <div className={styles.overviewConnector} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS STEPS */}
      <section className={styles.stages}>
        <div className={styles.container}>
          <div className={styles.stagesHeader}>
            <div>
              <span className={styles.sectionLabel}>
                {t.stagesLabel}
              </span>

              <h2>{t.stagesTitle}</h2>
            </div>

            <p>{t.stagesDescription}</p>
          </div>

          <div className={styles.stageList}>
            {t.stages.map((stage, index) => {
              const number = String(index + 1).padStart(2, "0");

              return (
                <article className={styles.stageCard} key={number}>
                  <div className={styles.stageNumber}>
                    <span>{number}</span>
                    <div />
                  </div>

                  <div className={styles.stageMain}>
                    <span className={styles.stageTag}>
                      {stage.tag}
                    </span>

                    <h3>{stage.title}</h3>

                    <span className={styles.stageSubtitle}>
                      {stage.subtitle}
                    </span>

                    <p>{stage.description}</p>
                  </div>

                  <div className={styles.stageSymbol}>
                    <span>{stage.symbol}</span>
                  </div>

                  <span className={styles.stageIndex}>
                    {locale === "ar"
                      ? `المرحلة ${number}`
                      : `${locale === "en" ? "STAGE" : "ÉTAPE"} ${number}`}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUALITY */}
      <section className={styles.quality}>
        <div className={styles.container}>
          <div className={styles.qualityVisual}>
            <div className={styles.qualityCircle}>
              <span className={styles.qualitySymbol}>◇</span>
              <span className={styles.qualityCircleText}>
                {locale === "ar"
                  ? "الجودة"
                  : locale === "en"
                    ? "QUALITY"
                    : "QUALITÉ"}
              </span>
            </div>

            <div className={styles.qualitySmallCircle} />
            <span className={styles.qualityDecor}>M</span>
          </div>

          <div className={styles.qualityContent}>
            <span className={styles.sectionLabel}>
              {t.qualityLabel}
            </span>

            <h2>{t.qualityTitle}</h2>

            <p>{t.qualityDescription}</p>

            <Link href={localized("/source")} className={styles.qualityLink}>
              {t.qualityLink}
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* NOTE */}
      <section className={styles.note}>
        <div className={styles.container}>
          <span className={styles.noteIcon}>i</span>

          <div>
            <strong>{t.noteTitle}</strong>
            <p>{t.noteDescription}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaLabel}>{t.ctaLabel}</span>

            <h2>{t.ctaTitle}</h2>

            <p>{t.ctaDescription}</p>

            <div className={styles.ctaActions}>
              <Link href={localized("/produits")} className={styles.ctaPrimary}>
                {t.products}
                <span>↗</span>
              </Link>

              <Link href={localized("/contact")} className={styles.ctaSecondary}>
                {t.contact}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
