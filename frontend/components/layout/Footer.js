"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import styles from "./Footer.module.css";

const translations = {
  fr: {
    slogan: "La pureté de la nature, la force des montagnes.",
    description: "Découvrez l'univers de Mont Djurdjura.",
    navigationTitle: "Navigation",
    discoverTitle: "Découvrir",
    informationTitle: "Informations",
    contactTitle: "Contact",
    navigation: [
      ["Accueil", "/"],
      ["À propos", "/a-propos"],
      ["Notre source", "/source"],
      ["Nos produits", "/produits"],
      ["Galerie", "/galerie"],
      ["Contact", "/contact"],
    ],
    discover: [
      ["Notre processus", "/processus-production"],
      ["Demander un devis", "/demander-un-devis"],
      ["FAQ", "/faq"],
    ],
    legal: [
      ["Mentions légales", "/mentions-legales"],
      ["Politique de confidentialité", "/politique-de-confidentialite"],
    ],
    contact: "Nous contacter",
    address: "Adresse",
    email: "Email",
    phone: "Téléphone",
    fax: "Fax",
    website: "Site web",
    workingHours: "Horaires de travail",
    workingDays: "Jours actifs",
    copyright: "Tous droits réservés.",
    followUs: "Suivez-nous",
    days: {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    },
  },

  en: {
    slogan: "The purity of nature, the strength of the mountains.",
    description: "Discover the world of Mont Djurdjura.",
    navigationTitle: "Navigation",
    discoverTitle: "Discover",
    informationTitle: "Information",
    contactTitle: "Contact",
    navigation: [
      ["Home", "/"],
      ["About us", "/a-propos"],
      ["Our source", "/source"],
      ["Our products", "/produits"],
      ["Gallery", "/galerie"],
      ["Contact", "/contact"],
    ],
    discover: [
      ["Our production process", "/processus-production"],
      ["Request a quote", "/demander-un-devis"],
      ["FAQ", "/faq"],
    ],
    legal: [
      ["Legal notice", "/mentions-legales"],
      ["Privacy policy", "/politique-de-confidentialite"],
    ],
    contact: "Contact us",
    address: "Address",
    email: "Email",
    phone: "Phone",
    fax: "Fax",
    website: "Website",
    workingHours: "Working hours",
    workingDays: "Working days",
    copyright: "All rights reserved.",
    followUs: "Follow us",
    days: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
  },

  ar: {
    slogan: "نقاء الطبيعة وقوة الجبال.",
    description: "اكتشفوا عالم مون جرجرة.",
    navigationTitle: "التنقل",
    discoverTitle: "اكتشف",
    informationTitle: "معلومات",
    contactTitle: "اتصل بنا",
    navigation: [
      ["الرئيسية", "/"],
      ["من نحن", "/a-propos"],
      ["منبعنا", "/source"],
      ["منتجاتنا", "/produits"],
      ["معرض الصور", "/galerie"],
      ["اتصل بنا", "/contact"],
    ],
    discover: [
      ["مراحل الإنتاج", "/processus-production"],
      ["طلب عرض سعر", "/demander-un-devis"],
      ["الأسئلة الشائعة", "/faq"],
    ],
    legal: [
      ["الإشعارات القانونية", "/mentions-legales"],
      ["سياسة الخصوصية", "/politique-de-confidentialite"],
    ],
    contact: "اتصل بنا",
    address: "العنوان",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    fax: "الفاكس",
    website: "الموقع الإلكتروني",
    workingHours: "أوقات العمل",
    workingDays: "أيام العمل",
    copyright: "جميع الحقوق محفوظة.",
    followUs: "تابعونا على",
    days: {
      monday: "الإثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    },
  },
};

const SOCIAL_PLATFORMS_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
  whatsapp: "WhatsApp",
  custom: "Social media",
};

function SocialIcon({ platform }) {
  const commonProps = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (platform) {
    case "facebook":
      return (
        <svg {...commonProps}>
          <path
            fill="currentColor"
            stroke="none"
            d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.8-.1-1.7-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4Z"
          />
        </svg>
      );

    case "instagram":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...commonProps}>
          <path
            fill="currentColor"
            stroke="none"
            d="M6.5 8.5A2 2 0 1 0 6.5 4.5a2 2 0 0 0 0 4ZM5 10h3v9H5v-9Zm5 0h2.9v1.2h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.6 2 3.6 4.5V19h-3v-4.3c0-1 0-2.3-1.5-2.3s-1.8 1.1-1.8 2.2V19h-3v-9Z"
          />
        </svg>
      );

    case "youtube":
      return (
        <svg {...commonProps}>
          <path
            d="M22 12s0-3.5-.5-5.1a2.6 2.6 0 0 0-1.8-1.8C18.1 4.6 12 4.6 12 4.6s-6.1 0-7.7.5a2.6 2.6 0 0 0-1.8 1.8C2 8.5 2 12 2 12s0 3.5.5 5.1a2.6 2.6 0 0 0 1.8 1.8c1.6.5 7.7.5 7.7.5s6.1 0 7.7-.5a2.6 2.6 0 0 0 1.8-1.8c.5-1.6.5-5.1.5-5.1Z"
          />
          <path
            d="m10 8.8 5.2 3.2-5.2 3.2V8.8Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );

    case "tiktok":
      return (
        <svg {...commonProps}>
          <path d="M14 3v11.1a3.5 3.5 0 1 1-3-3.5" />
          <path d="M14 3c.5 3 2.2 4.8 5 5" />
        </svg>
      );

    case "x":
      return (
        <svg {...commonProps}>
          <path d="M5 4h4.5L19 20h-4.5L5 4Z" />
          <path d="m19 4-6 7M5 20l6-7" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg {...commonProps}>
          <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z" />
          <path d="M8.5 8.2c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.3 1.7 2.2 2.2.2.1.4.1.6-.1l.8-.9c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.3-.8 1.8-.5.5-1.2.8-2 .7-1.1-.1-2.5-.7-4.1-2.1-1.4-1.2-2.3-2.7-2.6-3.8-.3-1 .1-2 .5-2.8Z" />
        </svg>
      );

    default:
      return (
        <svg {...commonProps}>
          <path d="M14 3h7v7" />
          <path d="M10 14 21 3" />
          <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
        </svg>
      );
  }
}

export default function Footer({ locale = "fr" }) {
  const currentLocale = translations[locale] ? locale : "fr";
  const t = translations[currentLocale];

  const [settings, setSettings] = useState(null);

  // Récupérer les paramètres publics depuis Laravel
  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      try {
        const response = await apiFetch("/settings");

        if (!cancelled) {
          setSettings(response?.data ?? null);
        }
      } catch (error) {
        console.error("Erreur chargement paramètres Footer:", error);
      }
    }

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const localizedHref = (href) =>
    `/${currentLocale}${href === "/" ? "" : href}`;

  // Traduction des jours de travail
  const workingDays = Array.isArray(settings?.working_days)
    ? settings.working_days
        .map((day) => t.days[day])
        .filter(Boolean)
    : [];

  const openingTime = settings?.opening_time?.slice(0, 5) || "";
  const closingTime = settings?.closing_time?.slice(0, 5) || "";

  // Contact information managed from the Dashboard.
  const contactAddress =
    settings?.company_address ||
    "Arafou, Route N° 26, Chorfa, Bouira, Algérie";

  const contactEmail =
    settings?.official_email ||
    "contact@montdjurdjura-dz.com";

  const contactPhonePrimary = settings?.phone_primary || "020 72 34 34";
  const contactPhoneSecondary = settings?.phone_secondary || "30 30";
  const contactFax = settings?.fax || "026 950 570";
  const contactWebsite =
    settings?.website || "www.montdjurdjura-dz.com";

  const phoneDisplay = [
    contactPhonePrimary,
    contactPhoneSecondary,
  ].filter(Boolean).join(" / ");

  const phoneHref = `tel:${contactPhonePrimary.replace(/[^\d+]/g, "")}`;
  const emailHref = `mailto:${contactEmail}`;

  const websiteHref = /^https?:\/\//i.test(contactWebsite)
    ? contactWebsite
    : `https://${contactWebsite}`;

  const hasWorkingHours =
    workingDays.length > 0 || openingTime || closingTime;

  // Réseaux sociaux activés depuis le Dashboard
  const socialLinks = Array.isArray(settings?.social_links)
    ? settings.social_links.filter((item) => {
        if (!item?.enabled || !item?.url) return false;

        try {
          const url = new URL(item.url);

          return (
            (url.protocol === "https:" || url.protocol === "http:") &&
            Boolean(item.platform)
          );
        } catch {
          return false;
        }
      })
    : [];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link
              href={localizedHref("/")}
              className={styles.logo}
              aria-label="Mont Djurdjura"
            >
              <Image
                src="/logo-mont-djurdjura.gif"
                alt="Logo officiel Mont Djurdjura"
                width={244}
                height={183}
                className={styles.logoImage}
                unoptimized
              />
            </Link>

            <p className={styles.description}>
              {t.slogan} {t.description}
            </p>

            {/* Social media links */}
            {socialLinks.length > 0 && (
              <div className={styles.socialSection}>
                <h3 className={styles.socialTitle}>
                  {t.followUs}
                </h3>

                <div className={styles.socialLinks}>
                  {socialLinks.map((item, index) => {
                    const platform =
                      SOCIAL_PLATFORMS_LABELS[item.platform];

                    const label =
                      item.platform === "custom"
                        ? item.label || "Social media"
                        : platform || item.platform;

                    return (
                      <a
                        key={`${item.platform}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialLink}
                        aria-label={label}
                        title={label}
                      >
                        <SocialIcon platform={item.platform} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className={styles.linkColumn}>
            <h3>{t.navigationTitle}</h3>

            <ul>
              {t.navigation.map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedHref(href)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div className={styles.linkColumn}>
            <h3>{t.discoverTitle}</h3>

            <ul>
              {t.discover.map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedHref(href)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal information */}
          <div className={styles.linkColumn}>
            <h3>{t.informationTitle}</h3>

            <ul>
              {t.legal.map(([label, href]) => (
                <li key={href}>
                  <Link href={localizedHref(href)}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={localizedHref("/contact")}
              className={styles.contactLink}
            >
              {t.contact} <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {/* Contact */}
          <div className={styles.linkColumn}>
            <h3>{t.contactTitle}</h3>

            <ul className={styles.contactList}>
              {contactAddress && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.address}
                  </span>

                  <span className={styles.contactValue}>
                    {contactAddress}
                  </span>
                </li>
              )}

              {contactEmail && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.email}
                  </span>

                  <a
                    href={emailHref}
                    className={styles.contactValue}
                  >
                    {contactEmail}
                  </a>
                </li>
              )}

              {(contactPhonePrimary || contactPhoneSecondary) && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.phone}
                  </span>

                  <a
                    href={phoneHref}
                    className={styles.contactValue}
                  >
                    {phoneDisplay}
                  </a>
                </li>
              )}

              {contactFax && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.fax}
                  </span>

                  <span className={styles.contactValue}>
                    {contactFax}
                  </span>
                </li>
              )}

              {contactWebsite && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.website}
                  </span>

                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactValue}
                  >
                    {contactWebsite.replace(/^https?:\/\//i, "").replace(/\/$/, "")}
                  </a>
                </li>
              )}

              {/* Working days and hours from Dashboard */}
              {hasWorkingHours && (
                <li>
                  <span className={styles.contactLabel}>
                    {t.workingHours}
                  </span>

                  <div className={styles.contactValue}>
                    {workingDays.length > 0 && (
                      <div>
                        <strong>{t.workingDays} :</strong>
                        <p>{workingDays.join(", ")}</p>
                      </div>
                    )}

                    {(openingTime || closingTime) && (
                      <p>
                        {openingTime || "--:--"}
                        {" – "}
                        {closingTime || "--:--"}
                      </p>
                    )}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>
            © 2026 Mont Djurdjura. {t.copyright}
          </p>

          <p className={styles.signature}>
            {t.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}