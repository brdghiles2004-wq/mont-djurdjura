import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import "./../globals.css";

const locales = ["fr", "en", "ar"];

const SITE_URL = "https://mont-djurdjura.vercel.app";

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

const descriptions = {
  fr: "Découvrez Mont Djurdjura, une eau de source inspirée par la pureté de la nature et la richesse des montagnes du Djurdjura.",
  en: "Discover Mont Djurdjura, a spring water brand inspired by the purity of nature and the beauty of the Djurdjura mountains.",
  ar: "اكتشفوا مون جرجرة، مياه منبع مستوحاة من نقاء الطبيعة وجمال جبال جرجرة.",
};

const titles = {
  fr: "Mont Djurdjura | Eau de source",
  en: "Mont Djurdjura | Spring Water",
  ar: "مون جرجرة | مياه المنبع",
};

const ogLocales = {
  fr: "fr_DZ",
  en: "en_US",
  ar: "ar_DZ",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    return {};
  }

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: titles[locale],
      template: "%s | Mont Djurdjura",
    },

    description: descriptions[locale],

    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
        ar: `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/fr`,
      },
    },

    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${SITE_URL}/${locale}`,
      siteName: "Mont Djurdjura",
      locale: ogLocales[locale],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descriptions[locale],
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

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>
        <Header locale={locale} />

        <main>{children}</main>

        <Footer locale={locale} />
      </body>
    </html>
  );
}
