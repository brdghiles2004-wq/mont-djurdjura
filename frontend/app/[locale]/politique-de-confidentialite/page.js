
import Link from "next/link";
import styles from "./page.module.css";

const SITE_URL = "https://www.montdjurdjura-dz.com";
const PAGE_PATH = "/politique-de-confidentialite";

const locales = ["fr", "en", "ar"];

const localeMap = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

const translations = {
  fr: {
    metaTitle: "Politique de confidentialité | Mont Djurdjura",
    metaDescription:
      "Découvrez les modalités de collecte, d'utilisation et de protection des données personnelles sur le site Mont Djurdjura.",
    eyebrow: "PROTECTION DES DONNÉES",
    title: "Politique de confidentialité",
    hero:
      "Votre confiance est essentielle. Découvrez comment nous traitons et protégeons vos informations personnelles.",
    intro:
      "La présente politique explique les modalités de collecte, d'utilisation, de conservation et de protection des données personnelles des visiteurs du site Mont Djurdjura. Elle doit être adaptée aux traitements réellement effectués par l'entreprise et aux outils effectivement utilisés sur le site.",
    sections: [
      {
        title: "1. Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement des données personnelles collectées sur ce site est l'entité qui exploite le site Mont Djurdjura. Sa dénomination sociale exacte reste à confirmer auprès de l'entreprise.",
        ],
        list: [
          ["Nom commercial", "Mont Djurdjura"],
          ["Dénomination sociale", "À confirmer"],
          ["Adresse", "Arafou, Route N° 26, Chorfa, Bouira, Algérie"],
          ["Email de contact", "contact@montdjurdjura-dz.com"],
          ["Téléphone", "020 72 34 34 / 30 30"],
        ],
      },
      {
        title: "2. Données personnelles collectées",
        paragraphs: [
          "Selon les formulaires et fonctionnalités effectivement disponibles sur le site, les informations suivantes peuvent être collectées :",
          "Des données techniques peuvent également être traitées pour assurer le fonctionnement et la sécurité du site, selon la configuration du serveur et des outils utilisés.",
        ],
        list: [
          "Nom et prénom.",
          "Nom de l'entreprise ou de l'organisme.",
          "Adresse email.",
          "Numéro de téléphone.",
          "Informations relatives à une demande de devis.",
          "Contenu des messages envoyés via les formulaires.",
        ],
      },
      {
        title: "3. Finalités de la collecte",
        paragraphs: ["Les données collectées peuvent être utilisées pour :"],
        list: [
          "Répondre aux demandes de contact.",
          "Traiter les demandes de devis.",
          "Communiquer avec les clients et partenaires.",
          "Fournir les informations demandées sur les produits.",
          "Assurer le fonctionnement et la sécurité du site.",
        ],
      },
      {
        title: "4. Base et caractère de la collecte",
        paragraphs: [
          "Les informations demandées dans les formulaires doivent être limitées à celles nécessaires au traitement de la demande. Les champs obligatoires doivent être clairement signalés dans les formulaires concernés.",
          "Selon la finalité du traitement et la réglementation applicable, le traitement repose sur une base légale appropriée, qui doit être déterminée par l'entreprise.",
        ],
      },
      {
        title: "5. Conservation des données",
        paragraphs: [
          "Les données personnelles sont conservées pendant une durée adaptée à la finalité pour laquelle elles ont été collectées, sous réserve des obligations légales applicables.",
          "Les durées de conservation précises doivent être définies par l'entreprise en fonction des demandes reçues, de leur traitement et de ses obligations.",
        ],
      },
      {
        title: "6. Destinataires et partage des données",
        paragraphs: [
          "Les données personnelles sont destinées aux personnes habilitées à traiter les demandes reçues par l'intermédiaire du site.",
          "Elles peuvent également être accessibles à des prestataires techniques autorisés lorsque cela est nécessaire au fonctionnement du site, à son hébergement ou au traitement des demandes.",
          "Les prestataires et les éventuels transferts de données doivent être identifiés et vérifiés par l'entreprise.",
        ],
      },
      {
        title: "7. Sécurité des données",
        paragraphs: [
          "Des mesures techniques et organisationnelles adaptées doivent être mises en œuvre afin de protéger les données personnelles contre les accès non autorisés, la perte, l'altération ou la divulgation.",
        ],
      },
      {
        title: "8. Cookies et technologies similaires",
        paragraphs: [
          "Le site peut utiliser des cookies ou technologies similaires. Leur nature et leur finalité dépendent des fonctionnalités et outils réellement installés.",
          "Les cookies non nécessaires au fonctionnement du site, notamment ceux destinés à la mesure d'audience ou à la publicité, doivent être configurés conformément aux exigences de consentement prévues par la réglementation applicable.",
        ],
      },
      {
        title: "9. Vos droits",
        paragraphs: [
          "Conformément à la réglementation applicable en matière de protection des données personnelles, vous pouvez disposer de droits concernant vos données, notamment :",
          "Pour exercer vos droits ou obtenir des informations concernant le traitement de vos données, vous pouvez contacter l'entreprise à l'adresse suivante :",
        ],
        list: [
          "Le droit d'accéder à vos données.",
          "Le droit de demander leur rectification.",
          "Le droit de demander leur suppression lorsque les conditions légales sont réunies.",
          "Le droit de vous opposer à certains traitements.",
          "Le droit de retirer votre consentement lorsque le traitement repose sur celui-ci.",
        ],
        email: true,
        contactBefore: "Vous pouvez également utiliser notre",
        contactLink: "formulaire de contact",
      },
      {
        title: "10. Liens vers des sites externes",
        paragraphs: [
          "Le site peut contenir des liens vers des sites externes. Mont Djurdjura ne contrôle pas leurs contenus ni leurs pratiques de confidentialité. Nous vous invitons à consulter leurs politiques respectives.",
        ],
      },
      {
        title: "11. Modification de la politique",
        paragraphs: [
          "Cette politique peut être mise à jour afin de tenir compte des évolutions du site, des traitements effectués ou de la réglementation applicable. La version publiée sur cette page constitue la version affichée sur le site.",
        ],
      },
      {
        title: "12. Contact",
        paragraphs: [
          "Pour toute question concernant cette politique ou le traitement de vos données personnelles, vous pouvez nous contacter :",
        ],
        list: [
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Téléphone", "020 72 34 34 / 30 30"],
          ["Adresse", "Arafou, Route N° 26, Chorfa, Bouira, Algérie"],
        ],
        contactBefore: "Vous pouvez également consulter notre",
        contactLink: "page de contact",
      },
    ],
    notice:
      "Cette politique doit être vérifiée et validée par l'entreprise avant sa publication définitive. La dénomination sociale du responsable du traitement, les outils utilisés, les cookies, les durées de conservation, les prestataires et les modalités d'exercice des droits doivent correspondre aux pratiques réelles de l'entreprise.",
  },

  en: {
    metaTitle: "Privacy Policy | Mont Djurdjura",
    metaDescription:
      "Learn how Mont Djurdjura collects, uses and protects personal data through its website.",
    eyebrow: "DATA PROTECTION",
    title: "Privacy Policy",
    hero:
      "Your trust matters to us. Find out how we handle and protect your personal information.",
    intro:
      "This policy explains how personal data belonging to visitors of the Mont Djurdjura website is collected, used, stored and protected. It must be adapted to the actual data processing activities carried out by the company and the tools effectively used on the website.",
    sections: [
      {
        title: "1. Data Controller",
        paragraphs: [
          "The data controller responsible for personal data collected through this website is the entity operating the Mont Djurdjura website. Its exact registered company name must be confirmed directly with the company.",
        ],
        list: [
          ["Trade name", "Mont Djurdjura"],
          ["Registered company name", "To be confirmed"],
          ["Address", "Arafou, Route No. 26, Chorfa, Bouira, Algeria"],
          ["Contact email", "contact@montdjurdjura-dz.com"],
          ["Phone", "020 72 34 34 / 30 30"],
        ],
      },
      {
        title: "2. Personal Data We Collect",
        paragraphs: [
          "Depending on the forms and features actually available on the website, the following information may be collected:",
          "Technical data may also be processed to ensure the website's operation and security, depending on the server configuration and the tools used.",
        ],
        list: [
          "First and last name.",
          "Company or organisation name.",
          "Email address.",
          "Phone number.",
          "Information relating to a quotation request.",
          "Content of messages submitted through website forms.",
        ],
      },
      {
        title: "3. Purposes of Data Collection",
        paragraphs: ["Collected data may be used to:"],
        list: [
          "Respond to contact enquiries.",
          "Process quotation requests.",
          "Communicate with customers and partners.",
          "Provide requested product information.",
          "Maintain the operation and security of the website.",
        ],
      },
      {
        title: "4. Legal Basis and Nature of Collection",
        paragraphs: [
          "Information requested through website forms must be limited to what is necessary to process the enquiry. Mandatory fields must be clearly identified in the relevant forms.",
          "Depending on the purpose of processing and applicable regulations, processing must rely on an appropriate legal basis, which must be determined by the company.",
        ],
      },
      {
        title: "5. Data Retention",
        paragraphs: [
          "Personal data is retained for a period appropriate to the purpose for which it was collected, subject to applicable legal obligations.",
          "Specific retention periods must be defined by the company according to the enquiries received, how they are processed and its legal obligations.",
        ],
      },
      {
        title: "6. Data Recipients and Sharing",
        paragraphs: [
          "Personal data is intended for individuals authorised to handle enquiries received through the website.",
          "It may also be accessible to authorised technical service providers when necessary for the website's operation, hosting or enquiry processing.",
          "Service providers and any potential data transfers must be identified and verified by the company.",
        ],
      },
      {
        title: "7. Data Security",
        paragraphs: [
          "Appropriate technical and organisational measures must be implemented to protect personal data against unauthorised access, loss, alteration or disclosure.",
        ],
      },
      {
        title: "8. Cookies and Similar Technologies",
        paragraphs: [
          "The website may use cookies or similar technologies. Their nature and purpose depend on the features and tools actually installed.",
          "Cookies that are not necessary for the website to function, including those used for audience measurement or advertising, must be configured in accordance with the consent requirements set out by applicable regulations.",
        ],
      },
      {
        title: "9. Your Rights",
        paragraphs: [
          "Under applicable personal data protection regulations, you may have rights concerning your personal data, including:",
          "To exercise your rights or obtain information about the processing of your data, you can contact the company at the following address:",
        ],
        list: [
          "The right to access your personal data.",
          "The right to request its correction.",
          "The right to request its deletion where legal conditions are met.",
          "The right to object to certain processing activities.",
          "The right to withdraw your consent where processing is based on consent.",
        ],
        email: true,
        contactBefore: "You can also use our",
        contactLink: "contact form",
      },
      {
        title: "10. Links to External Websites",
        paragraphs: [
          "The website may contain links to external websites. Mont Djurdjura does not control their content or privacy practices. We encourage you to review their respective privacy policies.",
        ],
      },
      {
        title: "11. Changes to This Policy",
        paragraphs: [
          "This policy may be updated to reflect changes to the website, data processing activities or applicable regulations. The version published on this page is the version currently displayed on the website.",
        ],
      },
      {
        title: "12. Contact",
        paragraphs: [
          "If you have any questions about this policy or the processing of your personal data, you can contact us:",
        ],
        list: [
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Phone", "020 72 34 34 / 30 30"],
          ["Address", "Arafou, Route No. 26, Chorfa, Bouira, Algeria"],
        ],
        contactBefore: "You can also visit our",
        contactLink: "Contact page",
      },
    ],
    notice:
      "This policy must be reviewed and approved by the company before its final publication. The data controller's registered company name, tools used, cookies, retention periods, service providers and procedures for exercising data rights must reflect the company's actual practices.",
  },

  ar: {
    metaTitle: "سياسة الخصوصية | Mont Djurdjura",
    metaDescription:
      "تعرف على كيفية جمع البيانات الشخصية واستخدامها وحمايتها عبر موقع Mont Djurdjura.",
    eyebrow: "حماية البيانات",
    title: "سياسة الخصوصية",
    hero:
      "ثقتكم تهمنا. اكتشفوا كيف نتعامل مع معلوماتكم الشخصية ونعمل على حمايتها.",
    intro:
      "توضح سياسة الخصوصية هذه كيفية جمع البيانات الشخصية لزوار موقع Mont Djurdjura واستخدامها وحفظها وحمايتها. ويجب تكييفها مع عمليات معالجة البيانات التي تقوم بها المؤسسة فعلياً والأدوات المستخدمة على الموقع.",
    sections: [
      {
        title: "1. المسؤول عن معالجة البيانات",
        paragraphs: [
          "الجهة المسؤولة عن معالجة البيانات الشخصية التي يتم جمعها عبر هذا الموقع هي المؤسسة التي تدير موقع Mont Djurdjura. ويجب تأكيد التسمية القانونية الدقيقة للمؤسسة مباشرةً معها.",
        ],
        list: [
          ["الاسم التجاري", "Mont Djurdjura"],
          ["التسمية القانونية للمؤسسة", "يُرجى التأكيد"],
          ["العنوان", "أرافو، الطريق رقم 26، الشرفة، البويرة، الجزائر"],
          ["البريد الإلكتروني للتواصل", "contact@montdjurdjura-dz.com"],
          ["الهاتف", "020 72 34 34 / 30 30"],
        ],
      },
      {
        title: "2. البيانات الشخصية التي يتم جمعها",
        paragraphs: [
          "حسب الاستمارات والوظائف المتاحة فعلياً على الموقع، يمكن جمع المعلومات التالية:",
          "قد تتم أيضاً معالجة بيانات تقنية لضمان تشغيل الموقع وأمنه، وذلك حسب إعدادات الخادم والأدوات المستخدمة.",
        ],
        list: [
          "الاسم واللقب.",
          "اسم المؤسسة أو الشركة.",
          "عنوان البريد الإلكتروني.",
          "رقم الهاتف.",
          "المعلومات المتعلقة بطلب عرض سعر.",
          "محتوى الرسائل المرسلة عبر استمارات الموقع.",
        ],
      },
      {
        title: "3. أغراض جمع البيانات",
        paragraphs: ["يمكن استخدام البيانات التي يتم جمعها من أجل:"],
        list: [
          "الرد على طلبات الاتصال والاستفسارات.",
          "معالجة طلبات عروض الأسعار.",
          "التواصل مع العملاء والشركاء.",
          "تقديم المعلومات المطلوبة حول المنتجات.",
          "ضمان تشغيل الموقع وحمايته.",
        ],
      },
      {
        title: "4. الأساس القانوني وطبيعة جمع البيانات",
        paragraphs: [
          "يجب أن تقتصر المعلومات المطلوبة عبر استمارات الموقع على البيانات الضرورية لمعالجة الطلب. كما يجب توضيح الخانات الإلزامية بشكل واضح في الاستمارات المعنية.",
          "وفقاً لغرض المعالجة والتشريعات المعمول بها، يجب أن تستند معالجة البيانات إلى أساس قانوني مناسب تحدده المؤسسة.",
        ],
      },
      {
        title: "5. مدة الاحتفاظ بالبيانات",
        paragraphs: [
          "يتم الاحتفاظ بالبيانات الشخصية لمدة تتناسب مع الغرض الذي جُمعت من أجله، مع مراعاة الالتزامات القانونية المعمول بها.",
          "يجب على المؤسسة تحديد مدد الاحتفاظ الدقيقة وفقاً للطلبات المستلمة وكيفية معالجتها والالتزامات القانونية المترتبة عليها.",
        ],
      },
      {
        title: "6. الجهات المستلمة ومشاركة البيانات",
        paragraphs: [
          "تكون البيانات الشخصية موجهة إلى الأشخاص المخولين بمعالجة الطلبات الواردة عبر الموقع.",
          "يمكن أيضاً أن تكون هذه البيانات متاحة لمقدمي الخدمات التقنية المصرح لهم، عندما يكون ذلك ضرورياً لتشغيل الموقع أو استضافته أو معالجة الطلبات.",
          "يجب على المؤسسة تحديد مقدمي الخدمات وأي عمليات محتملة لنقل البيانات والتحقق منها.",
        ],
      },
      {
        title: "7. أمن البيانات",
        paragraphs: [
          "يجب اتخاذ تدابير تقنية وتنظيمية مناسبة لحماية البيانات الشخصية من الوصول غير المصرح به أو الفقدان أو التغيير أو الكشف عنها.",
        ],
      },
      {
        title: "8. ملفات تعريف الارتباط والتقنيات المشابهة",
        paragraphs: [
          "قد يستخدم الموقع ملفات تعريف الارتباط (Cookies) أو تقنيات مشابهة. ويعتمد نوعها والغرض منها على الوظائف والأدوات المثبتة فعلياً على الموقع.",
          "يجب إعداد ملفات تعريف الارتباط غير الضرورية لتشغيل الموقع، ولا سيما تلك المستخدمة لقياس عدد الزيارات أو الإعلانات، وفقاً لمتطلبات الحصول على الموافقة المنصوص عليها في التشريعات المعمول بها.",
        ],
      },
      {
        title: "9. حقوقكم",
        paragraphs: [
          "وفقاً للتشريعات المعمول بها في مجال حماية البيانات الشخصية، قد تتمتعون بحقوق تتعلق ببياناتكم، من بينها:",
          "لممارسة حقوقكم أو الحصول على معلومات حول معالجة بياناتكم، يمكنكم التواصل مع المؤسسة عبر العنوان التالي:",
        ],
        list: [
          "الحق في الاطلاع على بياناتكم الشخصية.",
          "الحق في طلب تصحيح بياناتكم.",
          "الحق في طلب حذف بياناتكم عند توفر الشروط القانونية.",
          "الحق في الاعتراض على بعض عمليات المعالجة.",
          "الحق في سحب موافقتكم عندما تستند المعالجة إليها.",
        ],
        email: true,
        contactBefore: "يمكنكم أيضاً استخدام",
        contactLink: "استمارة الاتصال",
      },
      {
        title: "10. روابط المواقع الخارجية",
        paragraphs: [
          "قد يحتوي الموقع على روابط لمواقع إلكترونية خارجية. لا تتحكم Mont Djurdjura في محتوى هذه المواقع أو ممارساتها المتعلقة بالخصوصية. لذلك ندعوكم إلى الاطلاع على سياسات الخصوصية الخاصة بها.",
        ],
      },
      {
        title: "11. تعديل سياسة الخصوصية",
        paragraphs: [
          "يمكن تحديث هذه السياسة لمواكبة التغييرات التي تطرأ على الموقع أو عمليات معالجة البيانات أو التشريعات المعمول بها. وتُعد النسخة المنشورة في هذه الصفحة هي النسخة المعروضة حالياً على الموقع.",
        ],
      },
      {
        title: "12. الاتصال",
        paragraphs: [
          "لأي استفسار حول هذه السياسة أو معالجة بياناتكم الشخصية، يمكنكم التواصل معنا عبر:",
        ],
        list: [
          ["البريد الإلكتروني", "contact@montdjurdjura-dz.com"],
          ["الهاتف", "020 72 34 34 / 30 30"],
          ["العنوان", "أرافو، الطريق رقم 26، الشرفة، البويرة، الجزائر"],
        ],
        contactBefore: "يمكنكم أيضاً زيارة",
        contactLink: "صفحة الاتصال",
      },
    ],
    notice:
      "يجب مراجعة هذه السياسة والموافقة عليها من طرف المؤسسة قبل نشرها نهائياً. وينبغي أن تعكس التسمية القانونية للمؤسسة المسؤولة عن معالجة البيانات، والأدوات المستخدمة، وملفات تعريف الارتباط، ومدد الاحتفاظ بالبيانات، ومقدمي الخدمات، وكيفية ممارسة الحقوق، الممارسات الفعلية للمؤسسة.",
  },
};

function getPageUrl(locale) {
  return `${SITE_URL}/${locale}${PAGE_PATH}`;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const lang = translations[locale] ? locale : "fr";
  const t = translations[lang];

  const pageUrl = getPageUrl(lang);

  return {
    title: t.metaTitle,
    description: t.metaDescription,

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
      title: t.metaTitle,
      description: t.metaDescription,
      type: "website",
      siteName: "Mont Djurdjura",
      url: pageUrl,
      locale: localeMap[lang],
      alternateLocale: locales
        .filter((item) => item !== lang)
        .map((item) => localeMap[item]),
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

export default async function PolitiqueConfidentialitePage({ params }) {
  const { locale } = await params;
  const lang = translations[locale] ? locale : "fr";
  const t = translations[lang];
  const isRTL = lang === "ar";

  const pageUrl = getPageUrl(lang);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t.title,
    description: t.metaDescription,
    inLanguage: lang,
    url: pageUrl,
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
    <main className={styles.page} dir={isRTL ? "rtl" : "ltr"} lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.hero}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <p className={styles.intro}>{t.intro}</p>

          {t.sections.map((section, index) => (
            <article className={styles.section} key={index}>
              <h2>{section.title}</h2>

              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}

              {section.list && (
                <ul>
                  {section.list.map((item, itemIndex) => {
                    const isPair = Array.isArray(item);
                    const label = isPair ? item[0] : null;
                    const value = isPair ? item[1] : item;

                    return (
                      <li key={itemIndex}>
                        {isPair && <strong>{label} : </strong>}

                        {isPair &&
                        (label.toLowerCase().includes("email") ||
                          label.toLowerCase().includes("البريد الإلكتروني")) ? (
                          <a href={`mailto:${value}`}>{value}</a>
                        ) : isPair &&
                          (label.toLowerCase().includes("téléphone") ||
                            label.toLowerCase().includes("phone") ||
                            label.toLowerCase().includes("الهاتف")) ? (
                          <a href="tel:+21320723434">{value}</a>
                        ) : (
                          value
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {section.email && (
                <p>
                  <a href="mailto:contact@montdjurdjura-dz.com">
                    contact@montdjurdjura-dz.com
                  </a>
                </p>
              )}

              {section.contactLink && (
                <p>
                  {section.contactBefore}{" "}
                  <Link href={`/${lang}/contact`}>
                    {section.contactLink}
                  </Link>
                  .
                </p>
              )}
            </article>
          ))}

          <p className={styles.notice}>{t.notice}</p>
        </div>
      </section>
    </main>
  );
}
