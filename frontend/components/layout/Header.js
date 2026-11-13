
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const translations = {
  fr: {
    slogan: "La pureté de la nature, à chaque goutte.",
    water: "Mont Djurdjura · Eau de source",
    navigation: [
      ["Accueil", "/"],
      ["À propos", "/a-propos"],
      ["Notre source", "/source"],
      ["Nos produits", "/produits"],
      ["Galerie", "/galerie"],
      ["Contact", "/contact"],
      ["Production", "/processus-production"],
    ],
    contact: "Nous contacter",
    quote: "Demander un devis",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    aria: "Navigation principale",
    logo: "Mont Djurdjura - Accueil",
  },
  en: {
    slogan: "The purity of nature, in every drop.",
    water: "Mont Djurdjura · Spring Water",
    navigation: [
      ["Home", "/"],
      ["About us", "/a-propos"],
      ["Our source", "/source"],
      ["Our products", "/produits"],
      ["Gallery", "/galerie"],
      ["Contact", "/contact"],
      ["Production", "/processus-production"],
    ],
    contact: "Contact us",
    quote: "Request a quote",
    open: "Open menu",
    close: "Close menu",
    aria: "Main navigation",
    logo: "Mont Djurdjura - Home",
  },
  ar: {
    slogan: "نقاء الطبيعة في كل قطرة.",
    water: "مون جرجرة · مياه المنبع",
    navigation: [
      ["الرئيسية", "/"],
      ["من نحن", "/a-propos"],
      ["منبعنا", "/source"],
      ["منتجاتنا", "/produits"],
      ["معرض الصور", "/galerie"],
      ["اتصل بنا", "/contact"],
      ["الإنتاج", "/processus-production"],
    ],
    contact: "اتصل بنا",
    quote: "طلب عرض سعر",
    open: "فتح القائمة",
    close: "إغلاق القائمة",
    aria: "القائمة الرئيسية",
    logo: "مون جرجرة - الرئيسية",
  },
};

const languages = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export default function Header({ locale = "fr" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentLocale = translations[locale] ? locale : "fr";
  const t = translations[currentLocale];

  const localizedHref = (href) =>
    `/${currentLocale}${href === "/" ? "" : href}`;

  const switchLanguage = (targetLocale) => {
    const currentPath = pathname.replace(/^\/(fr|en|ar)/, "");
    return `/${targetLocale}${currentPath}`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <p>{t.slogan}</p>
          <span>{t.water}</span>
        </div>
      </div>

      <div className={styles.mainHeader}>
        <div className={styles.container}>
          <Link
            href={localizedHref("/")}
            className={styles.logo}
            onClick={() => setMenuOpen(false)}
            aria-label={t.logo}
          >
            <Image
              src="/logo-mont-djurdjura.gif"
              alt="Logo officiel Mont Djurdjura"
              width={244}
              height={183}
              className={styles.logoImage}
              unoptimized
              priority
            />
          </Link>

          <nav
            id="main-navigation"
            className={`${styles.navigation} ${
              menuOpen ? styles.navigationOpen : ""
            }`}
            aria-label={t.aria}
          >
            {t.navigation.map(([label, href]) => {
              const target = localizedHref(href);
              const active = pathname === target;

              return (
                <Link
                  key={href}
                  href={target}
                  className={`${styles.navLink} ${
                    active ? styles.active : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}

            <Link
              href={localizedHref("/contact")}
              className={styles.mobileContact}
              onClick={() => setMenuOpen(false)}
            >
              {t.contact}
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href={localizedHref("/demander-un-devis")}
              className={styles.mobileQuote}
              onClick={() => setMenuOpen(false)}
            >
              {t.quote}
              <span aria-hidden="true">↗</span>
            </Link>
          </nav>

          <div className={styles.headerActions}>
            <div
              className={styles.languageSwitcher}
              aria-label="Choose language"
            >
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={switchLanguage(language.code)}
                  className={`${styles.languageLink} ${
                    currentLocale === language.code
                      ? styles.languageActive
                      : ""
                  }`}
                  aria-current={
                    currentLocale === language.code ? "page" : undefined
                  }
                >
                  {language.label}
                </Link>
              ))}
            </div>

            <Link
              href={localizedHref("/demander-un-devis")}
              className={styles.quoteButton}
            >
              {t.quote}
              <span>↗</span>
            </Link>
          </div>

          <button
            type="button"
            className={`${styles.menuButton} ${
              menuOpen ? styles.menuButtonOpen : ""
            }`}
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? t.close : t.open}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
