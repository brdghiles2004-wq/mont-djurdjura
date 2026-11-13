
"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Search,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import "./seo-manager.css";

const emptySettings = {
  site_name_fr: "",
  site_name_en: "",
  site_name_ar: "",
  default_meta_title_fr: "",
  default_meta_title_en: "",
  default_meta_title_ar: "",
  default_meta_description_fr: "",
  default_meta_description_en: "",
  default_meta_description_ar: "",
  default_og_image: "",
  robots_index: true,
  robots_follow: true,
  google_site_verification: "",
  bing_site_verification: "",
};

const pageDefinitions = [
  { key: "home", label: "Accueil", path: "/" },
  { key: "about", label: "À propos", path: "/a-propos" },
  { key: "source", label: "Notre source", path: "/source" },
  { key: "products", label: "Nos produits", path: "/produits" },
  { key: "gallery", label: "Galerie", path: "/galerie" },
  {
    key: "production-process",
    label: "Processus de production",
    path: "/processus-production",
  },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "quote", label: "Demande de devis", path: "/demander-un-devis" },
  { key: "faq", label: "FAQ", path: "/faq" },
  {
    key: "legal-notice",
    label: "Mentions légales",
    path: "/mentions-legales",
  },
  {
    key: "privacy-policy",
    label: "Politique de confidentialité",
    path: "/politique-de-confidentialite",
  },
];

const emptyPage = {
  meta_title_fr: "",
  meta_title_en: "",
  meta_title_ar: "",
  meta_description_fr: "",
  meta_description_en: "",
  meta_description_ar: "",
  og_image: "",
  no_index: false,
  no_follow: false,
};

const languages = [
  { key: "fr", label: "Français" },
  { key: "en", label: "English" },
  { key: "ar", label: "العربية" },
];

function getErrorMessage(error) {
  if (error?.errors) {
    const firstError = Object.values(error.errors).flat()[0];
    if (firstError) return firstError;
  }

  return error?.message || "Une erreur est survenue.";
}

export default function SeoManager() {
  const [settings, setSettings] = useState(emptySettings);
  const [pages, setPages] = useState({});
  const [activePage, setActivePage] = useState(pageDefinitions[0].key);
  const [activeTab, setActiveTab] = useState("general");

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPage, setSavingPage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedPage = pageDefinitions.find(
    (page) => page.key === activePage
  );

  const currentPageData = {
    ...emptyPage,
    ...(pages[activePage] || {}),
  };

  useEffect(() => {
    let mounted = true;

    async function loadSeoData() {
      setLoading(true);
      setError("");

      try {
        const [settingsResponse, pagesResponse] = await Promise.all([
          apiFetch("/admin/seo/settings"),
          apiFetch("/admin/seo/pages"),
        ]);

        if (!mounted) return;

        setSettings({
          ...emptySettings,
          ...(settingsResponse?.data || {}),
        });

        const pagesMap = {};

        (pagesResponse?.data || []).forEach((page) => {
          pagesMap[page.page_key] = page;
        });

        setPages(pagesMap);
      } catch (err) {
        if (mounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSeoData();

    return () => {
      mounted = false;
    };
  }, []);

  function updateSetting(field, value) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccess("");
  }

  function updatePageField(field, value) {
    setPages((previous) => ({
      ...previous,
      [activePage]: {
        ...emptyPage,
        ...(previous[activePage] || {}),
        [field]: value,
      },
    }));

    setSuccess("");
  }

  async function saveSettings(event) {
    event.preventDefault();

    setSavingSettings(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiFetch("/admin/seo/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
      });

      if (response?.data) {
        setSettings({
          ...emptySettings,
          ...response.data,
        });
      }

      setSuccess("Les paramètres SEO ont été enregistrés.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingSettings(false);
    }
  }

  async function savePage(event) {
    event.preventDefault();

    setSavingPage(true);
    setError("");
    setSuccess("");

    try {
      const payload = { ...currentPageData };

      delete payload.id;
      delete payload.page_key;
      delete payload.created_at;
      delete payload.updated_at;

      const response = await apiFetch(
        `/admin/seo/pages/${activePage}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (response?.data) {
        setPages((previous) => ({
          ...previous,
          [activePage]: response.data,
        }));
      }

      setSuccess(`SEO de la page "${selectedPage.label}" enregistré.`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingPage(false);
    }
  }

  function changeTab(tab) {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  }

  if (loading) {
    return (
      <div className="sm-loading">
        <RefreshCw size={24} className="sm-spin" />
        <p>Chargement des paramètres SEO...</p>
      </div>
    );
  }

  return (
    <div className="sm-manager">
      <div className="sm-header">
        <div>
          <span className="sm-eyebrow">VISIBILITÉ DU SITE</span>
          <h2>SEO & Sitemap</h2>
          <p>
            Gérez le référencement naturel de Mont Djurdjura
            et les métadonnées de vos pages.
          </p>
        </div>

        <div className="sm-header-icon">
          <Search size={28} />
        </div>
      </div>

      {error && (
        <div className="sm-alert sm-alert-error">
          <AlertCircle size={19} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="sm-alert sm-alert-success">
          <CheckCircle2 size={19} />
          <span>{success}</span>
        </div>
      )}

      <div className="sm-tabs">
        <button
          type="button"
          className={activeTab === "general" ? "active" : ""}
          onClick={() => changeTab("general")}
        >
          <Globe size={18} />
          SEO général
        </button>

        <button
          type="button"
          className={activeTab === "pages" ? "active" : ""}
          onClick={() => changeTab("pages")}
        >
          <FileText size={18} />
          SEO des pages
        </button>
      </div>

      {activeTab === "general" ? (
        <form className="sm-form" onSubmit={saveSettings}>
          <section className="sm-card">
            <div className="sm-card-heading">
              <div className="sm-card-icon">
                <Globe size={20} />
              </div>
              <div>
                <h3>Identité du site</h3>
                <p>Nom officiel du site dans chaque langue.</p>
              </div>
            </div>

            <div className="sm-fields-grid">
              {languages.map((language) => (
                <div className="sm-field" key={language.key}>
                  <label htmlFor={`site-name-${language.key}`}>
                    Nom du site — {language.label}
                  </label>

                  <input
                    id={`site-name-${language.key}`}
                    type="text"
                    value={settings[`site_name_${language.key}`] || ""}
                    onChange={(event) =>
                      updateSetting(
                        `site_name_${language.key}`,
                        event.target.value
                      )
                    }
                    placeholder="Mont Djurdjura"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="sm-card">
            <div className="sm-card-heading">
              <div className="sm-card-icon">
                <Search size={20} />
              </div>
              <div>
                <h3>Métadonnées par défaut</h3>
                <p>
                  Utilisées lorsqu&apos;une page ne possède pas ses propres
                  métadonnées.
                </p>
              </div>
            </div>

            {languages.map((language) => (
              <div className="sm-language-block" key={language.key}>
                <div className="sm-language-title">
                  <Languages size={16} />
                  {language.label}
                </div>

                <div className="sm-field">
                  <label>
                    Meta Title ({language.key.toUpperCase()})
                  </label>

                  <input
                    type="text"
                    maxLength={255}
                    value={
                      settings[
                        `default_meta_title_${language.key}`
                      ] || ""
                    }
                    onChange={(event) =>
                      updateSetting(
                        `default_meta_title_${language.key}`,
                        event.target.value
                      )
                    }
                    placeholder="Mont Djurdjura | ..."
                  />

                  <small>
                    {(
                      settings[
                        `default_meta_title_${language.key}`
                      ] || ""
                    ).length}/255 caractères
                  </small>
                </div>

                <div className="sm-field">
                  <label>
                    Meta Description ({language.key.toUpperCase()})
                  </label>

                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={
                      settings[
                        `default_meta_description_${language.key}`
                      ] || ""
                    }
                    onChange={(event) =>
                      updateSetting(
                        `default_meta_description_${language.key}`,
                        event.target.value
                      )
                    }
                    placeholder="Description générale du site..."
                  />

                  <small>
                    {(
                      settings[
                        `default_meta_description_${language.key}`
                      ] || ""
                    ).length}/1000 caractères
                  </small>
                </div>
              </div>
            ))}
          </section>

          <section className="sm-card">
            <div className="sm-card-heading">
              <div className="sm-card-icon">
                <Globe size={20} />
              </div>
              <div>
                <h3>Open Graph</h3>
                <p>Image affichée lors du partage sur les réseaux sociaux.</p>
              </div>
            </div>

            <div className="sm-field">
              <label htmlFor="default-og-image">
                URL de l&apos;image Open Graph
              </label>

              <input
                id="default-og-image"
                type="url"
                value={settings.default_og_image || ""}
                onChange={(event) =>
                  updateSetting("default_og_image", event.target.value)
                }
                placeholder="https://www.montdjurdjura-dz.com/images/og-image.jpg"
              />

              <small>
                Utilisez une URL publique accessible sans authentification.
              </small>
            </div>
          </section>

          <section className="sm-card">
            <div className="sm-card-heading">
              <div className="sm-card-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3>Robots directives</h3>
                <p>Contrôlez l&apos;indexation et le suivi des liens.</p>
              </div>
            </div>

            <label className="sm-switch-row">
              <span>
                <strong>Indexation autorisée</strong>
                <small>
                  Autoriser les moteurs de recherche à indexer le site.
                </small>
              </span>

              <input
                type="checkbox"
                checked={Boolean(settings.robots_index)}
                onChange={(event) =>
                  updateSetting("robots_index", event.target.checked)
                }
              />

              <span className="sm-switch" />
            </label>

            <label className="sm-switch-row">
              <span>
                <strong>Suivi des liens autorisé</strong>
                <small>
                  Autoriser les moteurs de recherche à suivre les liens.
                </small>
              </span>

              <input
                type="checkbox"
                checked={Boolean(settings.robots_follow)}
                onChange={(event) =>
                  updateSetting("robots_follow", event.target.checked)
                }
              />

              <span className="sm-switch" />
            </label>
          </section>

          <section className="sm-card">
            <div className="sm-card-heading">
              <div className="sm-card-icon">
                <Search size={20} />
              </div>
              <div>
                <h3>Vérification des moteurs de recherche</h3>
                <p>
                  Codes de vérification fournis par Google et Bing.
                </p>
              </div>
            </div>

            <div className="sm-fields-grid">
              <div className="sm-field">
                <label htmlFor="google-verification">
                  Google Search Console
                </label>

                <input
                  id="google-verification"
                  type="text"
                  value={settings.google_site_verification || ""}
                  onChange={(event) =>
                    updateSetting(
                      "google_site_verification",
                      event.target.value
                    )
                  }
                  placeholder="Code de vérification Google"
                />
              </div>

              <div className="sm-field">
                <label htmlFor="bing-verification">
                  Bing Webmaster Tools
                </label>

                <input
                  id="bing-verification"
                  type="text"
                  value={settings.bing_site_verification || ""}
                  onChange={(event) =>
                    updateSetting(
                      "bing_site_verification",
                      event.target.value
                    )
                  }
                  placeholder="Code de vérification Bing"
                />
              </div>
            </div>
          </section>

          <div className="sm-form-actions">
            <button
              type="submit"
              className="sm-save-button"
              disabled={savingSettings}
            >
              {savingSettings ? (
                <RefreshCw size={18} className="sm-spin" />
              ) : (
                <Save size={18} />
              )}

              {savingSettings
                ? "Enregistrement..."
                : "Enregistrer les paramètres"}
            </button>
          </div>
        </form>
      ) : (
        <div className="sm-pages-layout">
          <aside className="sm-pages-sidebar">
            <div className="sm-pages-sidebar-title">
              <FileText size={18} />
              <span>Pages du site</span>
            </div>

            {pageDefinitions.map((page) => (
              <button
                type="button"
                key={page.key}
                className={
                  activePage === page.key ? "active" : ""
                }
                onClick={() => {
                  setActivePage(page.key);
                  setError("");
                  setSuccess("");
                }}
              >
                <span>{page.label}</span>
                <small>{page.path}</small>
              </button>
            ))}
          </aside>

          <form className="sm-page-editor" onSubmit={savePage}>
            <div className="sm-card sm-page-card">
              <div className="sm-card-heading">
                <div className="sm-card-icon">
                  <FileText size={20} />
                </div>
                <div>
                  <h3>{selectedPage?.label}</h3>
                  <p>
                    {selectedPage?.path} · Configuration SEO indépendante
                  </p>
                </div>
              </div>

              {languages.map((language) => (
                <div className="sm-language-block" key={language.key}>
                  <div className="sm-language-title">
                    <Languages size={16} />
                    {language.label}
                  </div>

                  <div className="sm-field">
                    <label>
                      Meta Title ({language.key.toUpperCase()})
                    </label>

                    <input
                      type="text"
                      maxLength={255}
                      value={
                        currentPageData[
                          `meta_title_${language.key}`
                        ] || ""
                      }
                      onChange={(event) =>
                        updatePageField(
                          `meta_title_${language.key}`,
                          event.target.value
                        )
                      }
                      placeholder={`Titre SEO en ${language.label}`}
                    />

                    <small>
                      {(
                        currentPageData[
                          `meta_title_${language.key}`
                        ] || ""
                      ).length}/255 caractères
                    </small>
                  </div>

                  <div className="sm-field">
                    <label>
                      Meta Description ({language.key.toUpperCase()})
                    </label>

                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={
                        currentPageData[
                          `meta_description_${language.key}`
                        ] || ""
                      }
                      onChange={(event) =>
                        updatePageField(
                          `meta_description_${language.key}`,
                          event.target.value
                        )
                      }
                      placeholder={`Description SEO en ${language.label}`}
                    />

                    <small>
                      {(
                        currentPageData[
                          `meta_description_${language.key}`
                        ] || ""
                      ).length}/1000 caractères
                    </small>
                  </div>
                </div>
              ))}

              <div className="sm-field">
                <label htmlFor="page-og-image">
                  Image Open Graph de cette page
                </label>

                <input
                  id="page-og-image"
                  type="url"
                  value={currentPageData.og_image || ""}
                  onChange={(event) =>
                    updatePageField("og_image", event.target.value)
                  }
                  placeholder="https://www.montdjurdjura-dz.com/images/page.jpg"
                />
              </div>

              <div className="sm-page-indexing">
                <h4>Indexation de cette page</h4>

                <label className="sm-switch-row">
                  <span>
                    <strong>No Index</strong>
                    <small>
                      Demander aux moteurs de ne pas indexer cette page.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    checked={Boolean(currentPageData.no_index)}
                    onChange={(event) =>
                      updatePageField("no_index", event.target.checked)
                    }
                  />

                  <span className="sm-switch" />
                </label>

                <label className="sm-switch-row">
                  <span>
                    <strong>No Follow</strong>
                    <small>
                      Demander aux moteurs de ne pas suivre les liens.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    checked={Boolean(currentPageData.no_follow)}
                    onChange={(event) =>
                      updatePageField("no_follow", event.target.checked)
                    }
                  />

                  <span className="sm-switch" />
                </label>
              </div>

              <div className="sm-form-actions">
                <button
                  type="submit"
                  className="sm-save-button"
                  disabled={savingPage}
                >
                  {savingPage ? (
                    <RefreshCw size={18} className="sm-spin" />
                  ) : (
                    <Save size={18} />
                  )}

                  {savingPage
                    ? "Enregistrement..."
                    : "Enregistrer le SEO de cette page"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
