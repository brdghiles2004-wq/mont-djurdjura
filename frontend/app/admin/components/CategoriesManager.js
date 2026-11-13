"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  ImagePlus,
  RefreshCw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import "./categories-manager.css";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
).replace(/\/api\/?$/, "");

const PER_PAGE = 15;

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: null,
  is_active: true,
  sort_order: 0,
};

function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}/storage/${path}`;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const loadCategories = useCallback(async (targetPage = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(
        `/admin/categories?page=${targetPage}`
      );

      setCategories(response.data || []);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        total: response.total || 0,
      });
      setPage(response.current_page || 1);
    } catch (err) {
      setError(err.message || "Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCategories(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadCategories]);

  function openCreateModal() {
    setEditingCategory(null);
    setForm({ ...emptyForm });
    setImagePreview(null);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: null,
      is_active: Boolean(category.is_active),
      sort_order: category.sort_order || 0,
    });
    setImagePreview(category.image ? imageUrl(category.image) : null);
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

  function selectImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setForm((current) => ({
      ...current,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  }

  async function saveCategory(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingCategory);
      const endpoint = isEditing
        ? `/admin/categories/${editingCategory.id}`
        : "/admin/categories";

      if (form.image instanceof File) {
        const data = new FormData();

        data.append("name", form.name);
        if (form.slug.trim()) data.append("slug", form.slug.trim());
        data.append("description", form.description);
        data.append("image", form.image);
        data.append("is_active", form.is_active ? "1" : "0");
        data.append("sort_order", String(Number(form.sort_order) || 0));

        if (isEditing) {
          data.append("_method", "PATCH");
        }

        await apiFetch(endpoint, {
          method: "POST",
          body: data,
        });
      } else {
        const payload = {
          name: form.name,
          description: form.description || null,
          is_active: form.is_active,
          sort_order: Number(form.sort_order) || 0,
        };

        if (form.slug.trim()) {
          payload.slug = form.slug.trim();
        }

        await apiFetch(endpoint, {
          method: isEditing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setForm({ ...emptyForm });
      setImagePreview(null);
      await loadCategories(page);
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

  async function deleteCategory(category) {
    const confirmed = window.confirm(
      `Supprimer définitivement la catégorie « ${category.name} » ?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await apiFetch(`/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      const nextPage =
        categories.length === 1 && page > 1 ? page - 1 : page;

      await loadCategories(nextPage);
    } catch (err) {
      setError(
        err.message ||
          "Impossible de supprimer cette catégorie. Vérifiez si elle contient des produits."
      );
    }
  }

  async function toggleStatus(category) {
    setError("");

    try {
      await apiFetch(`/admin/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          is_active: !category.is_active,
        }),
      });

      await loadCategories(page);
    } catch (err) {
      setError(err.message || "Impossible de modifier le statut.");
    }
  }

  const activeCount = categories.filter((c) => c.is_active).length;

  return (
    <section className="catm-page">
      <div className="catm-heading">
        <div>
          <span className="catm-eyebrow">CATALOGUE</span>
          <h2>Gestion des catégories</h2>
          <p>Organisez les catégories de produits de votre site.</p>
        </div>

        <button className="catm-primary-button" onClick={openCreateModal}>
          <Plus size={18} />
          Ajouter une catégorie
        </button>
      </div>

      {error && (
        <div className="catm-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            type="button"
            className="catm-error-close"
            onClick={() => setError("")}
            aria-label="Fermer le message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="catm-summary">
        <div className="catm-summary-card">
          <div className="catm-summary-icon">
            <FolderOpen size={22} />
          </div>
          <div>
            <span>Total des catégories</span>
            <strong>{pagination.total}</strong>
          </div>
        </div>

        <div className="catm-summary-card">
          <div className="catm-summary-icon is-green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Actives sur cette page</span>
            <strong>{activeCount}</strong>
          </div>
        </div>
      </div>

      <div className="catm-table-card">
        <div className="catm-table-top">
          <div>
            <h3>Liste des catégories</h3>
            <p>{pagination.total} catégorie(s) enregistrée(s)</p>
          </div>

          <div className="catm-table-actions">
            <span className="catm-page-info">
              Page {pagination.current_page} / {pagination.last_page}
            </span>

            <button
              className="catm-refresh-button"
              onClick={() => loadCategories(page)}
              disabled={loading}
            >
              <RefreshCw
                size={15}
                className={loading ? "catm-spinning" : ""}
              />
              Actualiser
            </button>
          </div>
        </div>

        {loading ? (
          <div className="catm-empty">
            <RefreshCw className="catm-spinning" size={25} />
            <p>Chargement des catégories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="catm-empty">
            <FolderOpen size={35} />
            <strong>Aucune catégorie trouvée</strong>
            <p>Ajoutez votre première catégorie au catalogue.</p>
            <button
              className="catm-primary-button"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Ajouter une catégorie
            </button>
          </div>
        ) : (
          <div className="catm-table-scroll">
            <table className="catm-table">
              <thead>
                <tr>
                  <th className="catm-col-category">Catégorie</th>
                  <th className="catm-col-slug">Slug</th>
                  <th className="catm-col-products catm-center">Produits</th>
                  <th className="catm-col-order catm-center">Ordre</th>
                  <th className="catm-col-status catm-center">Statut</th>
                  <th className="catm-col-actions catm-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="catm-category-cell">
                        {category.image ? (
                          <Image
                            src={imageUrl(category.image)}
                            alt={category.name}
                            width={100}
                            height={100}
                            unoptimized
                          />
                        ) : (
                          <div className="catm-image-placeholder">
                            <ImagePlus size={20} />
                          </div>
                        )}

                        <div className="catm-category-text">
                          <strong title={category.name}>
                            {category.name}
                          </strong>
                          <small
                            title={
                              category.description || "Aucune description"
                            }
                          >
                            {category.description || "Aucune description"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className="catm-slug"
                        title={category.slug || "—"}
                      >
                        {category.slug || "—"}
                      </span>
                    </td>

                    <td className="catm-center">
                      <span className="catm-product-count">
                        {category.products_count ?? 0}
                      </span>
                    </td>

                    <td className="catm-center">
                      <span className="catm-order">
                        {category.sort_order ?? 0}
                      </span>
                    </td>

                    <td className="catm-center">
                      <button
                        className={`catm-status ${
                          category.is_active ? "is-active" : "is-inactive"
                        }`}
                        onClick={() => toggleStatus(category)}
                        title="Modifier le statut"
                      >
                        <span className="catm-status-dot" />
                        {category.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="catm-actions">
                        <button
                          onClick={() => openEditModal(category)}
                          title="Modifier"
                          aria-label={`Modifier ${category.name}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="catm-delete"
                          onClick={() => deleteCategory(category)}
                          title="Supprimer"
                          aria-label={`Supprimer ${category.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="catm-pagination">
          <span>
            {pagination.total === 0
              ? "Aucun résultat"
              : `Affichage de ${(page - 1) * PER_PAGE + 1} à ${Math.min(
                  page * PER_PAGE,
                  pagination.total
                )} sur ${pagination.total}`}
          </span>

          <div>
            <button
              disabled={page <= 1 || loading}
              onClick={() => loadCategories(page - 1)}
              aria-label="Page précédente"
              title="Page précédente"
            >
              <ChevronLeft size={18} />
            </button>

            <span>{page}</span>

            <button
              disabled={page >= pagination.last_page || loading}
              onClick={() => loadCategories(page + 1)}
              aria-label="Page suivante"
              title="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="catm-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setModalOpen(false);
            }
          }}
        >
          <div className="catm-modal">
            <div className="catm-modal-heading">
              <div>
                <span className="catm-eyebrow">CATALOGUE</span>
                <h3>
                  {editingCategory
                    ? "Modifier la catégorie"
                    : "Nouvelle catégorie"}
                </h3>
              </div>

              <button
                type="button"
                className="catm-close-button"
                onClick={() => setModalOpen(false)}
                disabled={saving}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveCategory}>
              <div className="catm-form-grid">
                <label className="catm-field catm-field-full">
                  Nom de la catégorie *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    maxLength={255}
                  />
                </label>

                <label className="catm-field catm-field-full">
                  Slug
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={updateField}
                    maxLength={255}
                    placeholder="Généré automatiquement si vide"
                  />
                </label>

                <label className="catm-field catm-field-full">
                  Description
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={updateField}
                  />
                </label>

                <label className="catm-field catm-field-full">
                  Image de la catégorie
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selectImage}
                  />
                  <small>Formats JPG, PNG ou WEBP — 5 Mo maximum.</small>
                </label>

                {imagePreview && (
                  <div className="catm-preview catm-field-full">
                    <Image
                      src={imagePreview}
                      alt="Aperçu de la catégorie"
                      width={800}
                      height={600}
                      unoptimized
                    />
                  </div>
                )}

                <label className="catm-checkbox">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={updateField}
                  />
                  Catégorie active
                </label>

                <label className="catm-field">
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

              <div className="catm-modal-actions">
                <button
                  type="button"
                  className="catm-cancel-button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="catm-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Enregistrement..."
                    : editingCategory
                      ? "Enregistrer les modifications"
                      : "Créer la catégorie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}