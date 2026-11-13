
import Link from "next/link";
import ProductsSection from "@/components/home/ProductsSection";
import styles from "./page.module.css";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const translations = {
  fr: {
    description:
      "Mont Djurdjura, une eau de source inspirée par la pureté de la nature et la richesse des montagnes du Djurdjura.",
    heroEyebrow: "L'EAU DE SOURCE MONT DJURDJURA",
    heroTitle: "La pureté de la nature,",
    heroTitleAccent: "à chaque goutte.",
    heroDescription:
      "Découvrez une eau de source inspirée par la beauté des montagnes du Djurdjura et la richesse de son environnement naturel.",
    heroPrimary: "Découvrir nos produits",
    heroSecondary: "En savoir plus",
    heroFootnote: "L'ESSENCE DE LA NATURE",
    visualLabel: "EAU DE SOURCE",
    heroBottom: [
      "PURETÉ NATURELLE",
      "SOURCE DE VIE",
      "MONT DJURDJURA",
    ],
    introEyebrow: "NOTRE IDENTITÉ",
    introIndex: "01 / DÉCOUVRIR",
    introTitle: "Une source de pureté,",
    introTitleAccent: "au cœur du Djurdjura.",
    introParagraph1:
      "Mont Djurdjura vous invite à découvrir une eau de source inspirée par la richesse naturelle et la beauté des montagnes du Djurdjura.",
    introParagraph2:
      "Notre marque met en valeur la pureté de la nature à travers une gamme de formats adaptés aux besoins du quotidien.",
    introLink: "Découvrir notre histoire",
    highlightsEyebrow: "L'UNIVERS MONT DJURDJURA",
    highlightsTitle: "La nature comme",
    highlightsTitleAccent: "source d'inspiration.",
    highlightsDescription:
      "Découvrez les valeurs qui inspirent notre marque et notre engagement autour de l'eau de source.",
    cards: [
      {
        number: "01",
        title: "Notre source",
        description:
          "Découvrez l'univers naturel qui inspire Mont Djurdjura.",
        link: "Explorer notre source",
        href: "/source",
        background:
          "linear-gradient(145deg, #174d66 0%, #08749c 55%, #9cc9d9 100%)",
      },
      {
        number: "02",
        title: "Notre identité",
        description:
          "Une marque inspirée par la richesse des montagnes du Djurdjura.",
        link: "À propos de nous",
        href: "/a-propos",
        background:
          "linear-gradient(145deg, #073b5c 0%, #367d9a 55%, #a9d3e2 100%)",
      },
      {
        number: "03",
        title: "Notre production",
        description:
          "Découvrez les différentes étapes de notre processus de production.",
        link: "Voir notre processus",
        href: "/processus-production",
        background:
          "linear-gradient(145deg, #15516b 0%, #2488a8 55%, #a4d4e4 100%)",
      },
    ],
    brandEyebrow: "MONT DJURDJURA",
    brandTitle: "La nature dans chaque goutte.",
    brandDescription:
      "Découvrez notre gamme de produits et trouvez le format adapté à chaque moment de votre quotidien.",
    brandButton: "Demander un devis",
    locationEyebrow: "NOUS TROUVER",
    locationTitle: "Retrouvez-nous",
    locationDescription:
      "Découvrez notre emplacement à Chorfa, dans la wilaya de Bouira, en Algérie.",
    mapButton: "Ouvrir dans Google Maps",
    mapTitle: "Localisation de Mont Djurdjura",
  },

  en: {
    description:
      "Mont Djurdjura, spring water inspired by the purity of nature and the beauty of the Djurdjura mountains.",
    heroEyebrow: "MONT DJURDJURA SPRING WATER",
    heroTitle: "The purity of nature,",
    heroTitleAccent: "in every drop.",
    heroDescription:
      "Discover spring water inspired by the beauty of the Djurdjura mountains and the richness of its natural environment.",
    heroPrimary: "Discover our products",
    heroSecondary: "Learn more",
    heroFootnote: "THE ESSENCE OF NATURE",
    visualLabel: "SPRING WATER",
    heroBottom: [
      "NATURAL PURITY",
      "SOURCE OF LIFE",
      "MONT DJURDJURA",
    ],
    introEyebrow: "OUR IDENTITY",
    introIndex: "01 / DISCOVER",
    introTitle: "A source of purity,",
    introTitleAccent: "in the heart of Djurdjura.",
    introParagraph1:
      "Mont Djurdjura invites you to discover spring water inspired by the natural richness and beauty of the Djurdjura mountains.",
    introParagraph2:
      "Our brand celebrates the purity of nature through a range of formats designed for everyday needs.",
    introLink: "Discover our story",
    highlightsEyebrow: "THE MONT DJURDJURA WORLD",
    highlightsTitle: "Nature as our",
    highlightsTitleAccent: "source of inspiration.",
    highlightsDescription:
      "Discover the values that inspire our brand and our commitment to spring water.",
    cards: [
      {
        number: "01",
        title: "Our source",
        description:
          "Discover the natural world that inspires Mont Djurdjura.",
        link: "Explore our source",
        href: "/source",
        background:
          "linear-gradient(145deg, #174d66 0%, #08749c 55%, #9cc9d9 100%)",
      },
      {
        number: "02",
        title: "Our identity",
        description:
          "A brand inspired by the richness of the Djurdjura mountains.",
        link: "About us",
        href: "/a-propos",
        background:
          "linear-gradient(145deg, #073b5c 0%, #367d9a 55%, #a9d3e2 100%)",
      },
      {
        number: "03",
        title: "Our production",
        description:
          "Discover the different stages of our production process.",
        link: "View our process",
        href: "/processus-production",
        background:
          "linear-gradient(145deg, #15516b 0%, #2488a8 55%, #a4d4e4 100%)",
      },
    ],
    brandEyebrow: "MONT DJURDJURA",
    brandTitle: "Nature in every drop.",
    brandDescription:
      "Explore our product range and find the format that suits every moment of your daily life.",
    brandButton: "Request a quote",
    locationEyebrow: "FIND US",
    locationTitle: "Visit our location",
    locationDescription:
      "Discover our location in Chorfa, Bouira Province, Algeria.",
    mapButton: "Open in Google Maps",
    mapTitle: "Mont Djurdjura location",
  },

  ar: {
    description:
      "مون جرجرة، مياه منبع مستوحاة من نقاء الطبيعة وجمال جبال جرجرة.",
    heroEyebrow: "مياه منبع مون جرجرة",
    heroTitle: "نقاء الطبيعة،",
    heroTitleAccent: "في كل قطرة.",
    heroDescription:
      "اكتشفوا مياه منبع مستوحاة من جمال جبال جرجرة وغنى بيئتها الطبيعية.",
    heroPrimary: "اكتشفوا منتجاتنا",
    heroSecondary: "اكتشفوا المزيد",
    heroFootnote: "جوهر الطبيعة",
    visualLabel: "مياه المنبع",
    heroBottom: [
      "نقاء طبيعي",
      "مصدر الحياة",
      "مون جرجرة",
    ],
    introEyebrow: "هويتنا",
    introIndex: "01 / اكتشف",
    introTitle: "منبع من النقاء،",
    introTitleAccent: "في قلب جرجرة.",
    introParagraph1:
      "تدعوكم مون جرجرة لاكتشاف مياه منبع مستوحاة من الغنى الطبيعي وجمال جبال جرجرة.",
    introParagraph2:
      "تحتفي علامتنا بنقاء الطبيعة من خلال مجموعة من الأحجام المناسبة لمختلف احتياجاتكم اليومية.",
    introLink: "اكتشفوا قصتنا",
    highlightsEyebrow: "عالم مون جرجرة",
    highlightsTitle: "الطبيعة هي",
    highlightsTitleAccent: "مصدر إلهامنا.",
    highlightsDescription:
      "اكتشفوا القيم التي تلهم علامتنا والتزامنا بمياه المنبع.",
    cards: [
      {
        number: "01",
        title: "منبعنا",
        description:
          "اكتشفوا العالم الطبيعي الذي يلهم مون جرجرة.",
        link: "اكتشفوا منبعنا",
        href: "/source",
        background:
          "linear-gradient(145deg, #174d66 0%, #08749c 55%, #9cc9d9 100%)",
      },
      {
        number: "02",
        title: "هويتنا",
        description:
          "علامة تجارية مستوحاة من غنى جبال جرجرة.",
        link: "من نحن",
        href: "/a-propos",
        background:
          "linear-gradient(145deg, #073b5c 0%, #367d9a 55%, #a9d3e2 100%)",
      },
      {
        number: "03",
        title: "الإنتاج",
        description:
          "اكتشفوا مختلف مراحل عملية الإنتاج.",
        link: "مراحل الإنتاج",
        href: "/processus-production",
        background:
          "linear-gradient(145deg, #15516b 0%, #2488a8 55%, #a4d4e4 100%)",
      },
    ],
    brandEyebrow: "مون جرجرة",
    brandTitle: "الطبيعة في كل قطرة.",
    brandDescription:
      "اكتشفوا مجموعة منتجاتنا واختاروا الحجم المناسب لكل لحظة من يومكم.",
    brandButton: "طلب عرض سعر",
    locationEyebrow: "موقعنا",
    locationTitle: "تجدوننا هنا",
    locationDescription:
      "اكتشفوا موقعنا في الشرفة، ولاية البويرة، الجزائر.",
    mapButton: "افتحوا الموقع على خرائط Google",
    mapTitle: "موقع مون جرجرة",
  },
};

export default async function HomePage({ params }) {
  const { locale } = await params;

  const currentLocale = translations[locale] ? locale : "fr";
  const t = translations[currentLocale];
  const isRTL = currentLocale === "ar";

  const pageUrl = `${SITE_URL}/${currentLocale}`;

  // Coordonnées GPS officielles de SARL ABDELLAH IDAHMANENE Mont Djurdjura
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.1616090464595!2d4.342988399999999!3d36.356864200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128c590072522923%3A0x96ff2ef86ca96d5b!2sSARL%20ABDELLAH%20IDAHMANENE%20Mont%20Djurdjura!5e0!3m2!1sfr!2sdz!4v1794358488785!5m2!1sfr!2sdz";

  const mapExternalUrl =
    "https://www.google.com/maps/search/?api=1&query=36.3568642,4.3429884";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Mont Djurdjura",
        url: SITE_URL,
        logo: `${SITE_URL}/logo-mont-djurdjura.gif`,
        email: "contact@montdjurdjura-dz.com",
        telephone: "+21320723434",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Arafou, Route N° 26, Chorfa",
          addressLocality: "Bouira",
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
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        name: "Mont Djurdjura",
        description: t.description,
        url: pageUrl,
        inLanguage: currentLocale,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  return (
    <div className={styles.home} dir={isRTL ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* HERO */}
      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.heroBackground} aria-hidden="true">
          <div className={styles.heroGlow} />

          <div
            className={`${styles.mountain} ${styles.mountainBack}`}
          />

          <div
            className={`${styles.mountain} ${styles.mountainFront}`}
          />

          <div className={styles.water}>
            <span className={styles.waterLine} />
            <span className={styles.waterLine} />
            <span className={styles.waterLine} />
          </div>

          <div className={styles.heroOrb} />
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {t.heroEyebrow}
            </div>

            <h1 id="home-heading">
              {t.heroTitle}
              <span>{t.heroTitleAccent}</span>
            </h1>

            <p className={styles.heroDescription}>
              {t.heroDescription}
            </p>

            <div className={styles.heroActions}>
              <Link
                href={`/${currentLocale}/produits`}
                className={styles.primaryButton}
              >
                {t.heroPrimary}
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                href={`/${currentLocale}/a-propos`}
                className={styles.secondaryButton}
              >
                {t.heroSecondary}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className={styles.heroFootnote}>
              <span className={styles.scrollLine} />
              {t.heroFootnote}
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div
              className={`${styles.visualCircle} ${styles.visualCircleOuter}`}
            />

            <div
              className={`${styles.visualCircle} ${styles.visualCircleMiddle}`}
            />

            <div
              className={`${styles.visualCircle} ${styles.visualCircleInner}`}
            />

            <div className={styles.drop}>
              <span className={styles.dropShine} />
            </div>

            <div className={styles.visualLabel}>
              <span className={styles.visualLabelDot} />
              {t.visualLabel}
            </div>

            <span className={styles.visualNumber}>01</span>
          </div>
        </div>

        <div className={styles.heroBottom}>
          {t.heroBottom.map((item, index) => (
            <span key={item} style={{ display: "contents" }}>
              {index > 0 && (
                <span
                  className={styles.heroBottomDivider}
                  aria-hidden="true"
                />
              )}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.introduction}>
        <div className={styles.sectionContainer}>
          <div className={styles.introTop}>
            <span className={styles.sectionEyebrow}>
              {t.introEyebrow}
            </span>

            <span className={styles.sectionIndex}>
              {t.introIndex}
            </span>
          </div>

          <div className={styles.introGrid}>
            <h2 className={styles.introHeading}>
              {t.introTitle}
              <span>{t.introTitleAccent}</span>
            </h2>

            <div className={styles.introText}>
              <p>{t.introParagraph1}</p>
              <p>{t.introParagraph2}</p>

              <Link
                href={`/${currentLocale}/a-propos`}
                className={styles.textLink}
              >
                {t.introLink}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div className={styles.introDecoration} aria-hidden="true">
            M
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductsSection locale={currentLocale} />

      {/* HIGHLIGHTS */}
      <section className={styles.highlights}>
        <div className={styles.sectionContainer}>
          <div className={styles.highlightsHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                {t.highlightsEyebrow}
              </span>

              <h2>
                {t.highlightsTitle}
                <span>{t.highlightsTitleAccent}</span>
              </h2>
            </div>

            <p>{t.highlightsDescription}</p>
          </div>

          <div className={styles.highlightGrid}>
            {t.cards.map((card) => (
              <article
                className={styles.highlightCard}
                key={card.number}
                style={{
                  backgroundImage: card.background,
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardNumber}>
                    {card.number}
                  </span>

                  <span className={styles.cardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>

                <div className={styles.cardContent}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>

                  <Link href={`/${currentLocale}${card.href}`}>
                    {card.link}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND MESSAGE */}
      <section className={styles.brandMessage}>
        <div
          className={styles.brandMessagePattern}
          aria-hidden="true"
        />

        <div className={styles.brandMessageContent}>
          <span className={styles.brandMessageEyebrow}>
            {t.brandEyebrow}
          </span>

          <h2>{t.brandTitle}</h2>

          <p>{t.brandDescription}</p>

          <Link
            href={`/${currentLocale}/demander-un-devis`}
            className={styles.brandButton}
          >
            {t.brandButton}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {/* LOCATION */}
      <section className={styles.locationSection}>
        <div className={styles.locationContainer}>
          <div className={styles.locationHeader}>
            <span className={styles.locationEyebrow}>
              {t.locationEyebrow}
            </span>

            <h2>{t.locationTitle}</h2>

            <p>{t.locationDescription}</p>
          </div>

          <div className={styles.mapWrapper}>
            <iframe
              src={mapEmbedUrl}
              title={t.mapTitle}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className={styles.mapAction}>
            <a
              href={mapExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.mapButton}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
