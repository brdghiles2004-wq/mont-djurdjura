
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  ImagePlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import "./products-manager.css";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const emptyTranslations = {
  fr: {
    name: "",
    short_description: "",
    description: "",
  },
  en: {
    name: "",
    short_description: "",
    description: "",
  },
  ar: {
    name: "",
    short_description: "",
    description: "",
  },
};

const emptyForm = {
  category_id: "",
  reference: "",
  is_featured: false,
  is_active: true,
  sort_order: 0,
  main_image: null,
  translations: emptyTranslations,
};

const languages = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
];

function imageUrl(path) {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\/+/i, "");

  return `${API_ORIGIN}/storage/${cleanPath}`;
}

function getProductTranslations(product) {
  const translations = {
    fr: { ...emptyTranslations.fr },
    en: { ...emptyTranslations.en },
    ar: { ...emptyTranslations.ar },
  };

  if (Array.isArray(product.translations)) {
    product.translations.forEach((translation) => {
      const locale = translation.locale;

      if (translations[locale]) {
        translations[locale] = {
          name: translation.name || "",
          short_description: translation.short_description || "",
          description: translation.description || "",
        };
      }
    });
  }

  // Compatibility with the old products table.
  if (!translations.fr.name) {
    translations.fr.name = product.name || "";
  }

  if (!translations.fr.short_description) {
    translations.fr.short_description =
      product.short_description || "";
  }

  if (!translations.fr.description) {
    translations.fr.description = product.description || "";
  }

  return translations;
}

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("fr");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (categoryFilter) {
        params.set("category_id", categoryFilter);
      }

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      const [productResponse, categoryResponse] = await Promise.all([
        apiFetch(`/admin/products?${params.toString()}`),
        apiFetch("/admin/categories"),
      ]);

      setProducts(productResponse.data || []);
      setCategories(categoryResponse.data || []);
    } catch (err) {
      setError(err.message || "Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadData]);

  function openCreateModal() {
    setEditingProduct(null);

    setForm({
      ...emptyForm,
      translations: {
        fr: { ...emptyTranslations.fr },
        en: { ...emptyTranslations.en },
        ar: { ...emptyTranslations.ar },
      },
    });

    setImagePreview(null);
    setActiveLanguage("fr");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);

    setForm({
      category_id: product.category_id
        ? String(product.category_id)
        : "",
      reference: product.reference || "",
      is_featured: Boolean(product.is_featured),
      is_active: Boolean(product.is_active),
      sort_order: product.sort_order || 0,
      main_image: null,
      translations: getProductTranslations(product),
    });

    setImagePreview(
      product.main_image ? imageUrl(product.main_image) : null
    );

    setActiveLanguage("fr");
    setError("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function updateTranslation(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLanguage]: {
          ...current.translations[activeLanguage],
          [name]: value,
        },
      },
    }));
  }

  function selectImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setForm((current) => ({
      ...current,
      main_image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  }

  function buildPayload() {
    const french = form.translations.fr;

    return {
      name: french.name.trim(),
      category_id: form.category_id,
      reference: form.reference.trim() || null,
      short_description:
        french.short_description.trim() || null,
      description: french.description.trim() || null,
      translations: {
        fr: {
          name: french.name.trim(),
          short_description:
            french.short_description.trim() || null,
          description: french.description.trim() || null,
        },
        en: {
          name: form.translations.en.name.trim(),
          short_description:
            form.translations.en.short_description.trim() || null,
          description:
            form.translations.en.description.trim() || null,
        },
        ar: {
          name: form.translations.ar.name.trim(),
          short_description:
            form.translations.ar.short_description.trim() || null,
          description:
            form.translations.ar.description.trim() || null,
        },
      },
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_order: Number(form.sort_order) || 0,
    };
  }

  async function saveProduct(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingProduct);
      const endpoint = isEditing
        ? `/admin/products/${editingProduct.id}`
        : "/admin/products";

      const payload = buildPayload();

      if (!payload.name) {
        setError("Le nom du produit en français est obligatoire.");
        setActiveLanguage("fr");
        setSaving(false);
        return;
      }

      if (form.main_image instanceof File) {
        const data = new FormData();

        data.append("name", payload.name);
        data.append("category_id", payload.category_id);
        data.append("reference", payload.reference || "");
        data.append(
          "short_description",
          payload.short_description || ""
        );
        data.append("description", payload.description || "");

        data.append(
          "is_featured",
          payload.is_featured ? "1" : "0"
        );

        data.append(
          "is_active",
          payload.is_active ? "1" : "0"
        );

        data.append("sort_order", String(payload.sort_order));

        // Multilingual product fields.
        Object.entries(payload.translations).forEach(
          ([locale, translation]) => {
            Object.entries(translation).forEach(([field, value]) => {
              data.append(
                `translations[${locale}][${field}]`,
                value ?? ""
              );
            });
          }
        );

        data.append("main_image", form.main_image);

        if (isEditing) {
          data.append("_method", "PATCH");
        }

        await apiFetch(endpoint, {
          method: "POST",
          body: data,
        });
      } else {
        await apiFetch(endpoint, {
          method: isEditing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setForm(emptyForm);
      setImagePreview(null);
      setEditingProduct(null);

      await loadData();
    } catch (err) {
      const validationErrors = Object.values(err.errors || {})
        .flat()
        .join(" ");

      setError(
        validationErrors || err.message || "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Supprimer définitivement « ${product.name} » ?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiFetch(`/admin/products/${product.id}`, {
        method: "DELETE",
      });

      await loadData();
    } catch (err) {
      setError(err.message || "Impossible de supprimer ce produit.");
    }
  }

  async function toggleStatus(product) {
    try {
      await apiFetch(`/admin/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          is_active: !product.is_active,
        }),
      });

      await loadData();
    } catch (err) {
      setError(err.message || "Impossible de modifier le statut.");
    }
  }

  const currentTranslation =
    form.translations[activeLanguage] || emptyTranslations.fr;

  return (
    <section className="pm-page">
      <div className="pm-heading">
        <div>
          <span className="pm-eyebrow">CATALOGUE</span>
          <h2>Gestion des produits</h2>
          <p>Gérez les produits affichés sur votre site.</p>
        </div>

        <button
          className="pm-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      <div className="pm-toolbar">
        <div className="pm-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="">Toutes les catégories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>

        <button
          className="pm-refresh-button"
          onClick={loadData}
          title="Actualiser"
          type="button"
        >
          <RefreshCw size={17} />
        </button>
      </div>

      {error && !modalOpen && (
        <div className="pm-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="pm-summary">
        <span>{products.length} produit(s) affiché(s)</span>

        <span>
          {products.filter((product) => product.is_active).length} actif(s)
        </span>
      </div>

      <div className="pm-table-wrap">
        {loading ? (
          <div className="pm-empty">
            <RefreshCw className="pm-spinner" size={25} />
            <p>Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="pm-empty">
            <Package size={34} />
            <strong>Aucun produit trouvé</strong>
            <p>Ajoutez votre premier produit au catalogue.</p>
          </div>
        ) : (
          <table className="pm-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="pm-product-cell">
                      {product.main_image ? (
                        <Image
                          src={imageUrl(product.main_image)}
                          alt={product.name}
                          width={100}
                          height={100}
                          unoptimized
                        />
                      ) : (
                        <div className="pm-image-placeholder">
                          <ImagePlus size={20} />
                        </div>
                      )}

                      <div>
                        <strong>{product.name}</strong>

                        {product.is_featured && (
                          <small>Produit vedette</small>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>{product.reference || "—"}</td>
                  <td>{product.category?.name || "—"}</td>

                  <td>
                    <button
                      className={`pm-status ${
                        product.is_active
                          ? "is-active"
                          : "is-inactive"
                      }`}
                      onClick={() => toggleStatus(product)}
                      type="button"
                    >
                      {product.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>

                  <td>
                    <div className="pm-actions">
                      <button
                        onClick={() => openEditModal(product)}
                        title="Modifier"
                        type="button"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="pm-delete"
                        onClick={() => deleteProduct(product)}
                        title="Supprimer"
                        type="button"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div
          className="pm-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <div className="pm-modal">
            <div className="pm-modal-heading">
              <div>
                <span className="pm-eyebrow">CATALOGUE</span>

                <h3>
                  {editingProduct
                    ? "Modifier le produit"
                    : "Nouveau produit"}
                </h3>
              </div>

              <button
                type="button"
                className="pm-close-button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveProduct}>
              <div className="pm-form-grid">
                <div className="pm-field pm-field-full">
                  <span>Traductions du produit *</span>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                      marginBottom: "18px",
                    }}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() =>
                          setActiveLanguage(language.code)
                        }
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border:
                            activeLanguage === language.code
                              ? "2px solid #08749c"
                              : "1px solid #d5dce2",
                          background:
                            activeLanguage === language.code
                              ? "#eaf7fc"
                              : "#ffffff",
                          color: "#18394c",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {language.flag} {language.label}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid #dce5eb",
                      borderRadius: "10px",
                      display: "grid",
                      gap: "15px",
                      direction:
                        activeLanguage === "ar" ? "rtl" : "ltr",
                    }}
                  >
                    <label className="pm-field">
                      {activeLanguage === "fr"
                        ? "Nom du produit en français *"
                        : activeLanguage === "en"
                          ? "Product name in English"
                          : "اسم المنتج بالعربية"}

                      <input
                        name="name"
                        value={currentTranslation.name}
                        onChange={updateTranslation}
                        required={activeLanguage === "fr"}
                        maxLength={255}
                        dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                        placeholder={
                          activeLanguage === "fr"
                            ? "Ex : Eau minérale naturelle"
                            : activeLanguage === "en"
                              ? "Ex: Natural mineral water"
                              : "مثال: مياه معدنية طبيعية"
                        }
                      />
                    </label>

                    <label className="pm-field">
                      {activeLanguage === "fr"
                        ? "Description courte"
                        : activeLanguage === "en"
                          ? "Short description"
                          : "وصف مختصر"}

                      <input
                        name="short_description"
                        value={currentTranslation.short_description}
                        onChange={updateTranslation}
                        dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                        placeholder={
                          activeLanguage === "fr"
                            ? "Description courte du produit"
                            : activeLanguage === "en"
                              ? "Short product description"
                              : "وصف مختصر للمنتج"
                        }
                      />
                    </label>

                    <label className="pm-field">
                      {activeLanguage === "fr"
                        ? "Description complète"
                        : activeLanguage === "en"
                          ? "Full description"
                          : "الوصف الكامل"}

                      <textarea
                        name="description"
                        rows={5}
                        value={currentTranslation.description}
                        onChange={updateTranslation}
                        dir={activeLanguage === "ar" ? "rtl" : "ltr"}
                        placeholder={
                          activeLanguage === "fr"
                            ? "Description détaillée du produit..."
                            : activeLanguage === "en"
                              ? "Detailed product description..."
                              : "اكتب وصفاً مفصلاً للمنتج..."
                        }
                      />
                    </label>

                    {activeLanguage === "fr" && (
                      <small style={{ color: "#718894" }}>
                        Le nom français est obligatoire. Les
                        traductions anglaise et arabe sont facultatives.
                      </small>
                    )}
                  </div>
                </div>

                <label className="pm-field">
                  Catégorie *
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={updateField}
                    required
                  >
                    <option value="">Choisir une catégorie</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="pm-field">
                  Référence
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={updateField}
                    maxLength={255}
                  />
                </label>

                <label className="pm-field pm-field-full">
                  Image principale
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selectImage}
                  />
                </label>

                {imagePreview && (
                  <div className="pm-preview pm-field-full">
                    <Image
                      src={imagePreview}
                      alt="Aperçu du produit"
                      width={800}
                      height={600}
                      unoptimized
                    />
                  </div>
                )}

                <label className="pm-checkbox">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={updateField}
                  />
                  Produit actif
                </label>

                <label className="pm-checkbox">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={updateField}
                  />
                  Produit vedette
                </label>

                <label className="pm-field pm-field-full">
                  Ordre d&apos;affichage
                  <input
                    type="number"
                    name="sort_order"
                    min="0"
                    value={form.sort_order}
                    onChange={updateField}
                  />
                </label>
              </div>

              {error && (
                <div className="pm-error" style={{ marginTop: "16px" }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="pm-modal-actions">
                <button
                  type="button"
                  className="pm-cancel-button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="pm-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Enregistrement..."
                    : editingProduct
                      ? "Enregistrer les modifications"
                      : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
