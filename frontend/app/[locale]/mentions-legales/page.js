
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
    metaTitle: "Mentions légales | Mont Djurdjura",
    metaDescription:
      "Consultez les mentions légales et les coordonnées de Mont Djurdjura, située à Arafou, Chorfa, Bouira.",
    eyebrow: "INFORMATIONS LÉGALES",
    title: "Mentions légales",
    intro:
      "Retrouvez les informations relatives à l'éditeur et à l'utilisation de notre site internet.",
    sections: [
      {
        title: "1. Éditeur du site",
        paragraphs: [
          "Le présent site internet est consacré à la marque Mont Djurdjura. Les informations d'identification juridique de l'entreprise éditrice doivent être confirmées auprès de celle-ci.",
        ],
        items: [
          ["Nom commercial", "Mont Djurdjura"],
          ["Dénomination sociale", "À confirmer"],
          ["Adresse", "Arafou, Route N° 26, Chorfa, Bouira, Algérie"],
          ["Registre de commerce (RC)", "À confirmer"],
          ["Numéro d'identification fiscale (NIF)", "À confirmer"],
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Téléphone", "020 72 34 34 / 30 30"],
          ["Fax", "026 950 570"],
          ["Site web", "www.montdjurdjura-dz.com"],
        ],
      },
      {
        title: "2. Directeur de publication",
        paragraphs: [
          "Le nom du directeur de publication, représentant de l'entreprise éditrice, sera indiqué après confirmation par l'entreprise.",
        ],
        extra: "Directeur de publication : À confirmer.",
      },
      {
        title: "3. Hébergement du site",
        paragraphs: [
          "Les coordonnées de l'hébergeur seront ajoutées après confirmation du prestataire chargé de l'hébergement du site.",
        ],
        items: [
          ["Hébergeur", "À confirmer"],
          ["Adresse de l'hébergeur", "À confirmer"],
          ["Site web de l'hébergeur", "À confirmer"],
        ],
      },
      {
        title: "4. Propriété intellectuelle",
        paragraphs: [
          "Les éléments présents sur ce site, notamment les textes, images, photographies, logos, graphismes et éléments visuels, sont susceptibles d'être protégés par les dispositions applicables en matière de propriété intellectuelle.",
          "Toute reproduction, représentation ou utilisation de ces éléments sans autorisation préalable du titulaire des droits est interdite, sous réserve des exceptions prévues par la réglementation applicable.",
        ],
      },
      {
        title: "5. Responsabilité",
        paragraphs: [
          "Les informations publiées sur ce site sont présentées à titre informatif. Des erreurs ou omissions peuvent exceptionnellement subsister.",
          "L'entreprise s'efforce de maintenir les informations du site à jour, sans garantir l'exhaustivité de l'ensemble des contenus.",
        ],
      },
      {
        title: "6. Données personnelles",
        paragraphs: [
          "Les données personnelles éventuellement transmises via les formulaires du site sont destinées au traitement des demandes des visiteurs, notamment les demandes de contact et de devis.",
        ],
        linkBefore: "Pour en savoir plus sur la collecte et le traitement de ces données, consultez notre",
        privacyLink: "politique de confidentialité",
        linkAfter: ".",
      },
      {
        title: "7. Contact",
        paragraphs: [
          "Pour toute question concernant le site ou les présentes mentions légales, vous pouvez nous contacter :",
        ],
        items: [
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Téléphone", "020 72 34 34 / 30 30"],
          ["Adresse", "Arafou, Route N° 26, Chorfa, Bouira, Algérie"],
        ],
        linkBefore: "Vous pouvez également consulter notre",
        contactLink: "page de contact",
        linkAfter: ".",
      },
    ],
    notice:
      "Certaines informations juridiques restent à confirmer auprès de l'entreprise avant la publication définitive de cette page, notamment la dénomination sociale, les numéros RC et NIF, le directeur de publication et l'identité de l'hébergeur.",
    unknown: "À confirmer",
    siteName: "Mont Djurdjura",
    structuredName: "Mentions légales",
    structuredDescription:
      "Informations légales et coordonnées du site Mont Djurdjura.",
  },

  en: {
    metaTitle: "Legal Notice | Mont Djurdjura",
    metaDescription:
      "Read the legal notice and contact details of Mont Djurdjura, located in Arafou, Chorfa, Bouira, Algeria.",
    eyebrow: "LEGAL INFORMATION",
    title: "Legal Notice",
    intro:
      "Find information about the publisher and the use of our website.",
    sections: [
      {
        title: "1. Website Publisher",
        paragraphs: [
          "This website is dedicated to the Mont Djurdjura brand. The legal identification details of the company responsible for publishing this website must be confirmed directly with the company.",
        ],
        items: [
          ["Trade name", "Mont Djurdjura"],
          ["Registered company name", "To be confirmed"],
          ["Address", "Arafou, Route No. 26, Chorfa, Bouira, Algeria"],
          ["Commercial Register (RC)", "To be confirmed"],
          ["Tax Identification Number (NIF)", "To be confirmed"],
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Phone", "020 72 34 34 / 30 30"],
          ["Fax", "026 950 570"],
          ["Website", "www.montdjurdjura-dz.com"],
        ],
      },
      {
        title: "2. Publication Director",
        paragraphs: [
          "The name of the publication director, representing the company responsible for this website, will be provided once confirmed by the company.",
        ],
        extra: "Publication Director: To be confirmed.",
      },
      {
        title: "3. Website Hosting",
        paragraphs: [
          "The hosting provider's details will be added once the service provider responsible for hosting this website has been confirmed.",
        ],
        items: [
          ["Hosting provider", "To be confirmed"],
          ["Hosting provider's address", "To be confirmed"],
          ["Hosting provider's website", "To be confirmed"],
        ],
      },
      {
        title: "4. Intellectual Property",
        paragraphs: [
          "The content available on this website, including text, images, photographs, logos, graphics and visual elements, may be protected by applicable intellectual property laws.",
          "Any reproduction, representation or use of these elements without the prior authorisation of the rights holder is prohibited, subject to exceptions provided for by applicable regulations.",
        ],
      },
      {
        title: "5. Liability",
        paragraphs: [
          "The information published on this website is provided for informational purposes. Errors or omissions may occasionally occur.",
          "The company endeavours to keep the website information up to date but does not guarantee that all content is complete.",
        ],
      },
      {
        title: "6. Personal Data",
        paragraphs: [
          "Personal data submitted through the website forms may be used to process visitors' requests, including contact enquiries and quotation requests.",
        ],
        linkBefore:
          "To learn more about how this data is collected and processed, please read our",
        privacyLink: "Privacy Policy",
        linkAfter: ".",
      },
      {
        title: "7. Contact",
        paragraphs: [
          "For any questions about this website or this legal notice, you can contact us:",
        ],
        items: [
          ["Email", "contact@montdjurdjura-dz.com"],
          ["Phone", "020 72 34 34 / 30 30"],
          ["Address", "Arafou, Route No. 26, Chorfa, Bouira, Algeria"],
        ],
        linkBefore: "You can also visit our",
        contactLink: "Contact page",
        linkAfter: ".",
      },
    ],
    notice:
      "Some legal information must be confirmed by the company before this page is officially published, including the registered company name, Commercial Register and Tax Identification numbers, publication director and hosting provider details.",
    unknown: "To be confirmed",
    siteName: "Mont Djurdjura",
    structuredName: "Legal Notice",
    structuredDescription:
      "Legal information and contact details for the Mont Djurdjura website.",
  },

  ar: {
    metaTitle: "الإشعارات القانونية | Mont Djurdjura",
    metaDescription:
      "اطلع على المعلومات القانونية وبيانات الاتصال الخاصة بـ Mont Djurdjura، الكائن مقرها بأرافو، الشرفة، البويرة، الجزائر.",
    eyebrow: "معلومات قانونية",
    title: "الإشعارات القانونية",
    intro:
      "تجدون في هذه الصفحة المعلومات المتعلقة بالجهة المسؤولة عن الموقع وشروط استخدامه.",
    sections: [
      {
        title: "1. الجهة الناشرة للموقع",
        paragraphs: [
          "هذا الموقع مخصص لعلامة Mont Djurdjura. يجب تأكيد المعلومات القانونية الخاصة بالمؤسسة المسؤولة عن نشر الموقع مباشرةً مع المؤسسة.",
        ],
        items: [
          ["الاسم التجاري", "Mont Djurdjura"],
          ["التسمية القانونية للمؤسسة", "يُرجى التأكيد"],
          ["العنوان", "أرافو، الطريق رقم 26، الشرفة، البويرة، الجزائر"],
          ["السجل التجاري (RC)", "يُرجى التأكيد"],
          ["رقم التعريف الجبائي (NIF)", "يُرجى التأكيد"],
          ["البريد الإلكتروني", "contact@montdjurdjura-dz.com"],
          ["الهاتف", "020 72 34 34 / 30 30"],
          ["الفاكس", "026 950 570"],
          ["الموقع الإلكتروني", "www.montdjurdjura-dz.com"],
        ],
      },
      {
        title: "2. مدير النشر",
        paragraphs: [
          "سيتم إدراج اسم مدير النشر، الذي يمثل المؤسسة المسؤولة عن الموقع، بعد تأكيده من طرف المؤسسة.",
        ],
        extra: "مدير النشر: يُرجى التأكيد.",
      },
      {
        title: "3. استضافة الموقع",
        paragraphs: [
          "ستتم إضافة بيانات شركة الاستضافة بعد تأكيد مزود الخدمة المسؤول عن استضافة هذا الموقع.",
        ],
        items: [
          ["شركة الاستضافة", "يُرجى التأكيد"],
          ["عنوان شركة الاستضافة", "يُرجى التأكيد"],
          ["الموقع الإلكتروني لشركة الاستضافة", "يُرجى التأكيد"],
        ],
      },
      {
        title: "4. الملكية الفكرية",
        paragraphs: [
          "قد تكون العناصر المنشورة على هذا الموقع، بما في ذلك النصوص والصور والشعارات والرسومات والعناصر البصرية، محمية بموجب القوانين المعمول بها في مجال الملكية الفكرية.",
          "يُمنع نسخ هذه العناصر أو إعادة نشرها أو استخدامها دون الحصول على موافقة مسبقة من صاحب الحقوق، مع مراعاة الاستثناءات المنصوص عليها في التشريعات المعمول بها.",
        ],
      },
      {
        title: "5. المسؤولية",
        paragraphs: [
          "تُعرض المعلومات المنشورة على هذا الموقع لأغراض إعلامية. وقد تحدث بعض الأخطاء أو حالات السهو بشكل استثنائي.",
          "تعمل المؤسسة على تحديث المعلومات المنشورة على الموقع، دون ضمان اكتمال جميع المحتويات أو خلوها من الأخطاء.",
        ],
      },
      {
        title: "6. البيانات الشخصية",
        paragraphs: [
          "قد تُستخدم البيانات الشخصية التي يتم إرسالها عبر استمارات الموقع لمعالجة طلبات الزوار، بما في ذلك طلبات الاتصال وطلبات عروض الأسعار.",
        ],
        linkBefore:
          "لمعرفة المزيد حول جمع هذه البيانات ومعالجتها، يُرجى الاطلاع على",
        privacyLink: "سياسة الخصوصية",
        linkAfter: ".",
      },
      {
        title: "7. الاتصال",
        paragraphs: [
          "لأي استفسار يتعلق بالموقع أو بهذه الإشعارات القانونية، يمكنكم التواصل معنا عبر:",
        ],
        items: [
          ["البريد الإلكتروني", "contact@montdjurdjura-dz.com"],
          ["الهاتف", "020 72 34 34 / 30 30"],
          ["العنوان", "أرافو، الطريق رقم 26، الشرفة، البويرة، الجزائر"],
        ],
        linkBefore: "يمكنكم أيضًا زيارة",
        contactLink: "صفحة الاتصال",
        linkAfter: ".",
      },
    ],
    notice:
      "يجب تأكيد بعض المعلومات القانونية من طرف المؤسسة قبل النشر النهائي لهذه الصفحة، بما في ذلك التسمية القانونية للمؤسسة، ورقما السجل التجاري والتعريف الجبائي، واسم مدير النشر، وهوية شركة الاستضافة.",
    unknown: "يُرجى التأكيد",
    siteName: "Mont Djurdjura",
    structuredName: "الإشعارات القانونية",
    structuredDescription:
      "المعلومات القانونية وبيانات الاتصال الخاصة بموقع Mont Djurdjura.",
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const lang = translations[locale] ? locale : "fr";
  const t = translations[lang];

  const pageUrl = `${SITE_URL}/${lang}/mentions-legales`;

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
        fr: `${SITE_URL}/fr/mentions-legales`,
        en: `${SITE_URL}/en/mentions-legales`,
        ar: `${SITE_URL}/ar/mentions-legales`,
        "x-default": `${SITE_URL}/fr/mentions-legales`,
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

export default async function MentionsLegalesPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr";
  const lang = translations[locale] ? locale : "fr";

  const t = translations[lang];
  const isRTL = lang === "ar";

  const pageUrl = `${SITE_URL}/${lang}/mentions-legales`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: t.structuredName,
    description: t.structuredDescription,
    inLanguage: lang,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
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
          <p>{t.intro}</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          {t.sections.map((section, index) => (
            <article className={styles.section} key={index}>
              <h2>{section.title}</h2>

              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}

              {section.items && (
                <ul>
                  {section.items.map(([label, value], itemIndex) => (
                    <li key={itemIndex}>
                      <strong>{label} :</strong>{" "}
                      {label.toLowerCase().includes("email") ||
                      label.toLowerCase().includes("البريد الإلكتروني") ? (
                        <a href={`mailto:${value}`}>{value}</a>
                      ) : label.toLowerCase().includes("site web") ||
                        label.toLowerCase().includes("website") ||
                        label.toLowerCase().includes("الموقع الإلكتروني") ? (
                        <a
                          href={SITE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {value}
                        </a>
                      ) : label.toLowerCase().includes("téléphone") ||
                        label.toLowerCase().includes("phone") ||
                        label.toLowerCase().includes("الهاتف") ? (
                        <a href="tel:+21320723434">{value}</a>
                      ) : (
                        value
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {section.extra && (
                <p>
                  <strong>{section.extra}</strong>
                </p>
              )}

              {section.privacyLink && (
                <p>
                  {section.linkBefore}{" "}
                  <Link href={`/${lang}/politique-de-confidentialite`}>
                    {section.privacyLink}
                  </Link>
                  {section.linkAfter}
                </p>
              )}

              {section.contactLink && (
                <p>
                  {section.linkBefore}{" "}
                  <Link href={`/${lang}/contact`}>
                    {section.contactLink}
                  </Link>
                  {section.linkAfter}
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
