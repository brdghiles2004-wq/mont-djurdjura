"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

import {
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Share2,
  Plus,
  Trash2,
  Link2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

import "./settings-manager.css";

const DAYS = [
  { id: "monday", label: "Lundi" },
  { id: "tuesday", label: "Mardi" },
  { id: "wednesday", label: "Mercredi" },
  { id: "thursday", label: "Jeudi" },
  { id: "friday", label: "Vendredi" },
  { id: "saturday", label: "Samedi" },
  { id: "sunday", label: "Dimanche" },
];

const SOCIAL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "custom", label: "Autre plateforme" },
];

const INITIAL_DATA = {
  phone_primary: "020 72 34 34",
  phone_secondary: "30 30",
  official_email: "contact@montdjurdjura-dz.com",
  company_address: "Arafou, Route N° 26, Chorfa, Bouira, Algérie",
  fax: "026 950 570",
  website: "www.montdjurdjura-dz.com",
  working_days: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "saturday",
    "sunday",
  ],
  opening_time: "07:00",
  closing_time: "16:00",
  social_links: [],
};

function normalizeTime(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

function normalizeSocialLinks(value) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => ({
    platform: item?.platform || "",
    label: item?.label || "",
    url: item?.url || "",
    enabled: item?.enabled === true || item?.enabled === 1,
  }));
}

function normalizeSettings(data) {
  return {
    phone_primary: data?.phone_primary ?? INITIAL_DATA.phone_primary,
    phone_secondary: data?.phone_secondary ?? INITIAL_DATA.phone_secondary,
    official_email: data?.official_email ?? INITIAL_DATA.official_email,
    company_address: data?.company_address ?? INITIAL_DATA.company_address,
    fax: data?.fax ?? INITIAL_DATA.fax,
    website: data?.website ?? INITIAL_DATA.website,
    working_days: Array.isArray(data?.working_days)
      ? data.working_days
      : INITIAL_DATA.working_days,
    opening_time: normalizeTime(
      data?.opening_time ?? INITIAL_DATA.opening_time
    ),
    closing_time: normalizeTime(
      data?.closing_time ?? INITIAL_DATA.closing_time
    ),
    social_links: normalizeSocialLinks(data?.social_links),
  };
}

function isValidTime(value) {
  if (!value) return true;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isValidSocialUrl(value) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export default function SettingsManager() {
  const [form, setForm] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedSocialIndex, setExpandedSocialIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSettings() {
      try {
        const response = await apiFetch("/admin/settings");

        if (!cancelled) {
          setForm(normalizeSettings(response?.data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Impossible de charger les paramètres."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function handleTimeChange(event) {
    const { name, value } = event.target;
    const cleanedValue = value.replace(/[^\d:]/g, "").slice(0, 5);

    setForm((previous) => ({
      ...previous,
      [name]: cleanedValue,
    }));

    setError("");
    setSuccess("");
  }

  function handleDayChange(day) {
    setForm((previous) => {
      const isSelected = previous.working_days.includes(day);

      return {
        ...previous,
        working_days: isSelected
          ? previous.working_days.filter((item) => item !== day)
          : [...previous.working_days, day],
      };
    });

    setError("");
    setSuccess("");
  }

  function addSocialLink() {
    const newIndex = form.social_links.length;

    setForm((previous) => ({
      ...previous,
      social_links: [
        ...previous.social_links,
        {
          platform: "",
          label: "",
          url: "",
          enabled: true,
        },
      ],
    }));

    setExpandedSocialIndex(newIndex);
    setError("");
    setSuccess("");
  }

  function updateSocialLink(index, field, value) {
    setForm((previous) => ({
      ...previous,
      social_links: previous.social_links.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      ),
    }));

    setError("");
    setSuccess("");
  }

  function removeSocialLink(index) {
    setForm((previous) => ({
      ...previous,
      social_links: previous.social_links.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));

    setExpandedSocialIndex((current) => {
      if (current === null || current === index) return null;
      return current > index ? current - 1 : current;
    });

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !isValidTime(form.opening_time) ||
      !isValidTime(form.closing_time)
    ) {
      setError(
        "Format horaire invalide. Utilisez le format 24 heures : 08:00 ou 17:30."
      );
      return;
    }

    if (
      form.opening_time &&
      form.closing_time &&
      form.closing_time <= form.opening_time
    ) {
      setError(
        "L'heure de fermeture doit être supérieure à l'heure d'ouverture."
      );
      return;
    }

    for (let index = 0; index < form.social_links.length; index++) {
      const item = form.social_links[index];

      if (!item.platform) {
        setExpandedSocialIndex(index);
        setError(
          `Veuillez choisir une plateforme pour le réseau social N° ${index + 1}.`
        );
        return;
      }

      if (!item.url.trim()) {
        setExpandedSocialIndex(index);
        setError(
          `Veuillez saisir le lien du réseau social N° ${index + 1}.`
        );
        return;
      }

      if (!isValidSocialUrl(item.url.trim())) {
        setExpandedSocialIndex(index);
        setError(
          `Le lien du réseau social N° ${index + 1} doit commencer par http:// ou https://.`
        );
        return;
      }

      if (
        item.platform === "custom" &&
        !item.label.trim()
      ) {
        setExpandedSocialIndex(index);
        setError(
          `Veuillez saisir le nom de la plateforme N° ${index + 1}.`
        );
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        phone_primary: form.phone_primary.trim(),
        phone_secondary: form.phone_secondary.trim(),
        official_email: form.official_email.trim(),
        company_address: form.company_address.trim(),
        fax: form.fax.trim(),
        website: form.website.trim(),
        working_days: form.working_days,
        opening_time: form.opening_time || null,
        closing_time: form.closing_time || null,
        social_links: form.social_links.map((item) => ({
          platform: item.platform,
          label: item.platform === "custom" ? item.label.trim() : "",
          url: item.url.trim(),
          enabled: Boolean(item.enabled),
        })),
      };

      const response = await apiFetch("/admin/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (response?.data) {
        setForm(normalizeSettings(response.data));
      }

      setExpandedSocialIndex(null);
      setSuccess(
        response?.message || "Paramètres enregistrés avec succès."
      );
    } catch (err) {
      if (err.errors) {
        const firstError = Object.values(err.errors).flat()[0];
        setError(firstError || err.message);
      } else {
        setError(err.message || "Une erreur est survenue.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="sm-loading">
        <Loader2 size={24} className="sm-spin" />
        <span>Chargement des paramètres...</span>
      </div>
    );
  }

  return (
    <div className="sm-container">
      <div className="sm-heading">
        <div>
          <span className="sm-eyebrow">
            CONFIGURATION DU SITE
          </span>

          <h2>Paramètres généraux</h2>

          <p>
            Gérez les coordonnées, les horaires et les réseaux sociaux
            de votre entreprise.
          </p>
        </div>
      </div>

      {error && (
        <div className="sm-alert sm-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="sm-alert sm-alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* COORDONNEES */}

        <section className="sm-card">
          <div className="sm-card-heading">
            <div className="sm-icon">
              <MapPin size={20} />
            </div>

            <div>
              <h3>Coordonnées</h3>
              <p>Informations de contact de l&apos;entreprise.</p>
            </div>
          </div>

          <div className="sm-fields-grid">
            <div className="sm-field">
              <label htmlFor="phone_primary">
                <Phone size={15} />
                Téléphone principal
              </label>

              <input
                id="phone_primary"
                name="phone_primary"
                type="tel"
                value={form.phone_primary}
                onChange={handleChange}
                placeholder="+213..."
              />
            </div>

            <div className="sm-field">
              <label htmlFor="phone_secondary">
                <Phone size={15} />
                Téléphone secondaire
              </label>

              <input
                id="phone_secondary"
                name="phone_secondary"
                type="tel"
                value={form.phone_secondary}
                onChange={handleChange}
                placeholder="+213..."
              />
            </div>

            <div className="sm-field sm-field-full">
              <label htmlFor="official_email">
                <Mail size={15} />
                Email officiel
              </label>

              <input
                id="official_email"
                name="official_email"
                type="email"
                value={form.official_email}
                onChange={handleChange}
                placeholder="contact@entreprise.dz"
              />
            </div>

            <div className="sm-field sm-field-full">
              <label htmlFor="company_address">
                <MapPin size={15} />
                Adresse de l&apos;entreprise
              </label>

              <textarea
                id="company_address"
                name="company_address"
                value={form.company_address}
                onChange={handleChange}
                placeholder="Adresse complète de l'entreprise..."
                rows={3}
              />
            </div>

            <div className="sm-field">
              <label htmlFor="fax">
                <Phone size={15} />
                Fax
              </label>

              <input
                id="fax"
                name="fax"
                type="tel"
                value={form.fax}
                onChange={handleChange}
                placeholder="026 950 570"
              />
            </div>

            <div className="sm-field">
              <label htmlFor="website">
                <Link2 size={15} />
                Site web officiel
              </label>

              <input
                id="website"
                name="website"
                type="text"
                value={form.website}
                onChange={handleChange}
                placeholder="www.montdjurdjura-dz.com"
                dir="ltr"
              />
            </div>
          </div>
        </section>

        {/* HORAIRES */}

        <section className="sm-card">
          <div className="sm-card-heading">
            <div className="sm-icon">
              <Clock size={20} />
            </div>

            <div>
              <h3>Horaires de travail</h3>
              <p>Définissez les jours et les heures d&apos;ouverture.</p>
            </div>
          </div>

          <div className="sm-days-heading">
            <label>
              <CalendarDays size={15} />
              Jours de travail
            </label>

            <span>Sélectionnez les jours actifs</span>
          </div>

          <div className="sm-days-grid">
            {DAYS.map((day) => (
              <label
                key={day.id}
                className={`sm-day ${
                  form.working_days.includes(day.id) ? "selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.working_days.includes(day.id)}
                  onChange={() => handleDayChange(day.id)}
                />

                <span className="sm-day-check">
                  {form.working_days.includes(day.id) && "✓"}
                </span>

                <span>{day.label}</span>
              </label>
            ))}
          </div>

          <div className="sm-fields-grid sm-time-grid">
            <div className="sm-field">
              <label htmlFor="opening_time">
                <Clock size={15} />
                Heure d&apos;ouverture
              </label>

              <input
                id="opening_time"
                name="opening_time"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                value={form.opening_time}
                onChange={handleTimeChange}
                placeholder="08:00"
              />

              <small>Format 24h : HH:MM (ex. 08:00)</small>
            </div>

            <div className="sm-field">
              <label htmlFor="closing_time">
                <Clock size={15} />
                Heure de fermeture
              </label>

              <input
                id="closing_time"
                name="closing_time"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                value={form.closing_time}
                onChange={handleTimeChange}
                placeholder="17:00"
              />

              <small>Format 24h : HH:MM (ex. 17:00)</small>
            </div>
          </div>
        </section>

        {/* RESEAUX SOCIAUX */}

        <section className="sm-card">
          <div className="sm-card-heading">
            <div className="sm-icon">
              <Share2 size={20} />
            </div>

            <div>
              <h3>Réseaux sociaux</h3>
              <p>
                Ajoutez les liens de vos pages. Les réseaux activés
                apparaîtront automatiquement dans le Footer du site.
              </p>
            </div>
          </div>

          <div className="sm-social-intro">
            <div>
              <strong>
                {form.social_links.length} lien(s) configuré(s)
              </strong>
              <span>
                Vous pouvez ajouter plusieurs pages et les activer
                individuellement.
              </span>
            </div>

            <button
              type="button"
              className="sm-add-social"
              onClick={addSocialLink}
            >
              <Plus size={17} />
              Ajouter un réseau
            </button>
          </div>

          {form.social_links.length === 0 ? (
            <div className="sm-social-empty">
              <Share2 size={27} />
              <strong>Aucun réseau social configuré</strong>
              <span>
                Cliquez sur « Ajouter un réseau » pour commencer.
              </span>
            </div>
          ) : (
            <div className="sm-social-list">
              {form.social_links.map((item, index) => {
                const isExpanded = expandedSocialIndex === index;
                const selectedPlatform = SOCIAL_PLATFORMS.find(
                  (platform) => platform.value === item.platform
                );

                return (
                  <div
                    className={`sm-social-item ${
                      isExpanded ? "is-expanded" : ""
                    }`}
                    key={index}
                  >
                    <div className="sm-social-item-top">
                      <button
                        type="button"
                        className="sm-social-accordion-trigger"
                        onClick={() =>
                          setExpandedSocialIndex((current) =>
                            current === index ? null : index
                          )
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`social-panel-${index}`}
                      >
                        <span className="sm-social-number">
                          <Link2 size={16} />
                          <span>
                            {selectedPlatform?.label ||
                              (item.platform === "custom"
                                ? item.label || "Autre plateforme"
                                : "Choisir une plateforme")}
                          </span>
                          <span className="sm-social-index">
                            Réseau {index + 1}
                          </span>
                        </span>

                        <ChevronDown
                          size={18}
                          className={`sm-social-chevron ${
                            isExpanded ? "rotated" : ""
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        className="sm-remove-social"
                        onClick={() => removeSocialLink(index)}
                        aria-label={`Supprimer le réseau ${index + 1}`}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div
                        className="sm-social-panel"
                        id={`social-panel-${index}`}
                      >
                        <div className="sm-social-fields">
                          <div className="sm-field">
                            <label htmlFor={`social-platform-${index}`}>
                              Plateforme
                            </label>

                            <select
                              id={`social-platform-${index}`}
                              value={item.platform}
                              onChange={(event) =>
                                updateSocialLink(
                                  index,
                                  "platform",
                                  event.target.value
                                )
                              }
                            >
                              <option value="">
                                Choisir une plateforme...
                              </option>

                              {SOCIAL_PLATFORMS.map((platform) => (
                                <option
                                  key={platform.value}
                                  value={platform.value}
                                >
                                  {platform.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {item.platform === "custom" && (
                            <div className="sm-field">
                              <label htmlFor={`social-label-${index}`}>
                                Nom de la plateforme
                              </label>

                              <input
                                id={`social-label-${index}`}
                                type="text"
                                value={item.label}
                                onChange={(event) =>
                                  updateSocialLink(
                                    index,
                                    "label",
                                    event.target.value
                                  )
                                }
                                placeholder="Ex. Pinterest"
                                maxLength={50}
                              />
                            </div>
                          )}

                          <div className="sm-field sm-social-url">
                            <label htmlFor={`social-url-${index}`}>
                              Lien de la page
                            </label>

                            <input
                              id={`social-url-${index}`}
                              type="url"
                              value={item.url}
                              onChange={(event) =>
                                updateSocialLink(
                                  index,
                                  "url",
                                  event.target.value
                                )
                              }
                              placeholder="https://..."
                              dir="ltr"
                            />
                          </div>
                        </div>

                        <label className="sm-social-toggle">
                          <input
                            type="checkbox"
                            checked={item.enabled}
                            onChange={(event) =>
                              updateSocialLink(
                                index,
                                "enabled",
                                event.target.checked
                              )
                            }
                          />

                          <span className="sm-social-toggle-icon">
                            {item.enabled ? (
                              <Eye size={15} />
                            ) : (
                              <EyeOff size={15} />
                            )}
                          </span>

                          <span>
                            {item.enabled
                              ? "Activé — visible dans le Footer"
                              : "Désactivé — masqué du Footer"}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SAVE BUTTON */}

        <div className="sm-actions">
          <button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={17} className="sm-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save size={17} />
                Enregistrer les paramètres
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}