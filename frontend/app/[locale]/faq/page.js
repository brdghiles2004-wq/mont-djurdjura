
import Link from "next/link";
import styles from "./page.module.css";

const SITE_URL = "https://www.montdjurdjura-dz.com";

const locales = ["fr", "en", "ar"];

const ogLocales = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const translations = {
  fr: {
    metaTitle: "FAQ – Questions fréquentes | Mont Djurdjura",
    metaDescription:
      "Consultez les réponses aux questions fréquentes concernant Mont Djurdjura, ses produits, les demandes d'informations et les demandes de devis.",
    eyebrow: "BESOIN D'AIDE ?",
    title: "Questions fréquentes",
    hero:
      "Retrouvez les réponses aux questions les plus fréquentes concernant Mont Djurdjura.",
    introTitle: "Comment pouvons-nous vous aider ?",
    intro:
      "Consultez les réponses ci-dessous. Si vous ne trouvez pas l'information recherchée, notre équipe reste à votre disposition.",
    questions: [
      {
        question: "Comment découvrir les produits Mont Djurdjura ?",
        answer:
          "Consultez la rubrique Nos produits pour découvrir les produits présentés sur notre site. Pour obtenir des informations complémentaires, contactez directement notre équipe.",
      },
      {
        question: "Comment obtenir des informations sur un produit ?",
        answer:
          "Vous pouvez nous envoyer votre question depuis la page Contact en précisant le produit qui vous intéresse. Notre équipe pourra vous orienter selon les informations disponibles.",
      },
      {
        question: "Comment demander un devis ?",
        answer:
          "Accédez à la page Demander un devis et renseignez les informations demandées dans le formulaire. Votre demande pourra ainsi être étudiée par l'entreprise.",
      },
      {
        question: "Comment contacter Mont Djurdjura ?",
        answer:
          "Vous pouvez utiliser le formulaire disponible sur notre page Contact pour transmettre votre message ou votre demande de renseignements.",
      },
      {
        question: "Où trouver des informations sur la source ?",
        answer:
          "La rubrique Notre source présente les informations publiées sur le site à ce sujet. Pour toute précision complémentaire, vous pouvez nous contacter.",
      },
      {
        question:
          "Comment obtenir des informations sur la disponibilité ou la distribution ?",
        answer:
          "Les informations relatives à la disponibilité et aux modalités de distribution doivent être confirmées directement auprès de l'entreprise. Utilisez notre page Contact pour nous transmettre votre demande.",
      },
    ],
    contactTitle: "Vous avez encore une question ?",
    contactText:
      "Envoyez-nous votre demande et nous vous orienterons vers les informations adaptées.",
    contactButton: "Nous contacter",
    quoteButton: "Demander un devis",
    structuredName: "Questions fréquentes",
    structuredDescription:
      "Les réponses aux questions fréquentes sur Mont Djurdjura.",
  },

  en: {
    metaTitle: "FAQ – Frequently Asked Questions | Mont Djurdjura",
    metaDescription:
      "Find answers to frequently asked questions about Mont Djurdjura, its products, information enquiries and quotation requests.",
    eyebrow: "NEED HELP?",
    title: "Frequently Asked Questions",
    hero:
      "Find answers to the most frequently asked questions about Mont Djurdjura.",
    introTitle: "How can we help you?",
    intro:
      "Browse the answers below. If you cannot find the information you need, our team is here to assist you.",
    questions: [
      {
        question: "How can I discover Mont Djurdjura products?",
        answer:
          "Visit the Our Products section to discover the products featured on our website. For further information, please contact our team directly.",
      },
      {
        question: "How can I get information about a product?",
        answer:
          "You can send us your question through the Contact page, specifying the product you are interested in. Our team will guide you based on the available information.",
      },
      {
        question: "How can I request a quotation?",
        answer:
          "Go to the Request a Quote page and fill in the information requested in the form. Your enquiry can then be reviewed by the company.",
      },
      {
        question: "How can I contact Mont Djurdjura?",
        answer:
          "You can use the form available on our Contact page to send us your message or request for information.",
      },
      {
        question: "Where can I find information about the source?",
        answer:
          "The Our Source section presents the information published on the website about this subject. If you need further details, you can contact us.",
      },
      {
        question:
          "How can I get information about availability or distribution?",
        answer:
          "Information about product availability and distribution arrangements must be confirmed directly with the company. Please use our Contact page to send us your enquiry.",
      },
    ],
    contactTitle: "Still have a question?",
    contactText:
      "Send us your enquiry and we will guide you towards the information you need.",
    contactButton: "Contact us",
    quoteButton: "Request a Quote",
    structuredName: "Frequently Asked Questions",
    structuredDescription:
      "Answers to frequently asked questions about Mont Djurdjura.",
  },

  ar: {
    metaTitle: "الأسئلة الشائعة | Mont Djurdjura",
    metaDescription:
      "اكتشفوا إجابات الأسئلة الشائعة حول Mont Djurdjura ومنتجاتها وطلبات المعلومات وعروض الأسعار.",
    eyebrow: "هل تحتاجون إلى المساعدة؟",
    title: "الأسئلة الشائعة",
    hero:
      "تجدون هنا إجابات عن أكثر الأسئلة شيوعاً حول Mont Djurdjura.",
    introTitle: "كيف يمكننا مساعدتكم؟",
    intro:
      "اطلعوا على الإجابات أدناه. إذا لم تجدوا المعلومات التي تبحثون عنها، فإن فريقنا يبقى تحت تصرفكم.",
    questions: [
      {
        question: "كيف يمكنني اكتشاف منتجات Mont Djurdjura؟",
        answer:
          "يمكنكم زيارة قسم منتجاتنا لاكتشاف المنتجات المعروضة على موقعنا. للحصول على معلومات إضافية، يرجى التواصل مباشرة مع فريقنا.",
      },
      {
        question: "كيف يمكنني الحصول على معلومات حول أحد المنتجات؟",
        answer:
          "يمكنكم إرسال استفساركم عبر صفحة الاتصال مع تحديد المنتج الذي تهتمون به. وسيقوم فريقنا بتوجيهكم وفقاً للمعلومات المتوفرة.",
      },
      {
        question: "كيف يمكنني طلب عرض سعر؟",
        answer:
          "انتقلوا إلى صفحة طلب عرض سعر واملؤوا المعلومات المطلوبة في الاستمارة. بعد ذلك، يمكن للمؤسسة دراسة طلبكم.",
      },
      {
        question: "كيف يمكنني التواصل مع Mont Djurdjura؟",
        answer:
          "يمكنكم استخدام استمارة الاتصال المتاحة في صفحة الاتصال لإرسال رسالتكم أو طلب المعلومات.",
      },
      {
        question: "أين يمكنني العثور على معلومات حول المصدر؟",
        answer:
          "يعرض قسم مصدرنا المعلومات المنشورة على الموقع حول هذا الموضوع. وللحصول على تفاصيل إضافية، يمكنكم التواصل معنا.",
      },
      {
        question: "كيف يمكنني معرفة مدى توفر المنتجات أو طرق توزيعها؟",
        answer:
          "يجب تأكيد المعلومات المتعلقة بتوفر المنتجات وطرق توزيعها مباشرةً مع المؤسسة. يمكنكم استخدام صفحة الاتصال لإرسال استفساركم.",
      },
    ],
    contactTitle: "هل لديكم سؤال آخر؟",
    contactText:
      "أرسلوا لنا استفساركم وسنوجهكم إلى المعلومات المناسبة.",
    contactButton: "اتصلوا بنا",
    quoteButton: "طلب عرض سعر",
    structuredName: "الأسئلة الشائعة",
    structuredDescription:
      "إجابات عن الأسئلة الشائعة حول Mont Djurdjura.",
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const lang = translations[locale] ? locale : "fr";

  const t = translations[lang];
  const pageUrl = `${SITE_URL}/${lang}/faq`;

  const alternateLocales = locales
    .filter((item) => item !== lang)
    .map((item) => ogLocales[item]);

  return {
    title: {
      absolute: t.metaTitle,
    },

    description: t.metaDescription,

    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${SITE_URL}/fr/faq`,
        en: `${SITE_URL}/en/faq`,
        ar: `${SITE_URL}/ar/faq`,
        "x-default": `${SITE_URL}/fr/faq`,
      },
    },

    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      type: "website",
      url: pageUrl,
      siteName: "Mont Djurdjura",
      locale: ogLocales[lang],
      alternateLocale: alternateLocales,
    },

    twitter: {
      card: "summary",
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

export default async function FAQPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const lang = translations[locale] ? locale : "fr";

  const t = translations[lang];
  const isRTL = lang === "ar";

  const pageUrl = `${SITE_URL}/${lang}/faq`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    name: t.structuredName,
    description: t.structuredDescription,
    url: pageUrl,
    inLanguage: lang,

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Mont Djurdjura",
      url: SITE_URL,
    },

    mainEntity: t.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div
      className={styles.page}
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className={styles.hero}>
        <span className={styles.eyebrow}>{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.hero}</p>
      </header>

      <main className={styles.content}>
        <div className={styles.intro}>
          <h2>{t.introTitle}</h2>
          <p>{t.intro}</p>
        </div>

        <div className={styles.faqList}>
          {t.questions.map((item, index) => (
            <details className={styles.faqItem} key={item.question}>
              <summary>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.question}>
                  {item.question}
                </span>

                <span className={styles.icon} aria-hidden="true">
                  +
                </span>
              </summary>

              <div className={styles.answer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <section className={styles.contactBox}>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactText}</p>

          <div className={styles.actions}>
            <Link
              href={`/${lang}/contact`}
              className={styles.primaryButton}
            >
              {t.contactButton}
            </Link>

            <Link
              href={`/${lang}/demander-un-devis`}
              className={styles.secondaryLink}
            >
              {t.quoteButton} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
