
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Images,
  Plus,
  RefreshCw,
  Search,
  X,
  Upload,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import "./gallery-manager.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "").replace(/\/+$/, "");

function getImageUrl(image) {
  if (!image) return "";

  const path = image.image_path || image.image_url;

  if (!path) return "";

  if (path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    try {
      const parsedUrl = new URL(path);

      if (parsedUrl.pathname.includes("/storage/") && API_ORIGIN) {
        return `${API_ORIGIN}${parsedUrl.pathname}${parsedUrl.search}`;
      }

      return path;
    } catch {
      return path;
    }
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");

  return `${API_ORIGIN}/storage/${cleanPath}`;
}

const initialForm = {
  title: "",
  description: "",
  alt_text: "",
  sort_order: "0",
  is_active: true,
};

export default function GalleryManager() {
  const [images, setImages] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 12,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // LOAD GALLERY
  // =========================================

  const loadGallery = useCallback(async (options = {}) => {
    const showLoader = options.showLoader ?? true;

    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const params = new URLSearchParams({
        page: String(page),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("is_active", statusFilter);
      }

      const response = await apiFetch(
        `/admin/gallery?${params.toString()}`
      );

      const result = response?.data;

      setImages(
        Array.isArray(result?.data) ? result.data : []
      );

      setPagination({
        current_page: result?.current_page || 1,
        last_page: result?.last_page || 1,
        total: result?.total || 0,
        per_page: result?.per_page || 12,
      });
    } catch (err) {
      setError(
        err.message ||
          "Impossible de charger les images de la galerie."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadGallery();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadGallery]);

  // =========================================
  // SUCCESS MESSAGE TIMER
  // =========================================

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [success]);

  // =========================================
  // PREVIEW URL CLEANUP
  // =========================================

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // =========================================
  // MODALS
  // =========================================

  function openCreateModal() {
    setEditingImage(null);
    setForm({ ...initialForm });
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(image) {
    setEditingImage(image);

    setForm({
      title: image.title || "",
      description: image.description || "",
      alt_text: image.alt_text || "",
      sort_order: String(image.sort_order ?? 0),
      is_active: Boolean(image.is_active),
    });

    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingImage(null);
    setForm({ ...initialForm });
    setSelectedFile(null);
    setPreviewUrl("");
  }

  // =========================================
  // FILE HANDLING
  // =========================================

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La taille de l'image ne doit pas dépasser 5 Mo.");
      event.target.value = "";
      return;
    }

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =========================================
  // CREATE / UPDATE
  // =========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Le titre de l'image est obligatoire.");
      return;
    }

    if (!editingImage && !selectedFile) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let response;

      if (editingImage && !selectedFile) {
        response = await apiFetch(
          `/admin/gallery/${editingImage.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              title: form.title.trim(),
              description: form.description.trim(),
              alt_text: form.alt_text.trim(),
              sort_order: Number(form.sort_order || 0),
              is_active: form.is_active,
            }),
          }
        );
      } else {
        const formData = new FormData();

        formData.append("title", form.title.trim());
        formData.append("description", form.description.trim());
        formData.append("alt_text", form.alt_text.trim());
        formData.append(
          "sort_order",
          String(Number(form.sort_order || 0))
        );
        formData.append(
          "is_active",
          form.is_active ? "1" : "0"
        );
        formData.append("image", selectedFile);

        if (editingImage) {
          formData.append("_method", "PUT");
        }

        response = await apiFetch(
          editingImage
            ? `/admin/gallery/${editingImage.id}`
            : "/admin/gallery",
          {
            method: "POST",
            body: formData,
          }
        );
      }

      setModalOpen(false);
      setEditingImage(null);
      setForm({ ...initialForm });
      setSelectedFile(null);
      setPreviewUrl("");

      setSuccess(
        response?.message ||
          (editingImage
            ? "Image modifiée avec succès."
            : "Image ajoutée avec succès.")
      );

      await loadGallery({ showLoader: false });
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

  // =========================================
  // DELETE
  // =========================================

  async function handleDelete(image) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'image "${image.title}" ? Cette action est définitive.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(image.id);
      setError("");

      const response = await apiFetch(
        `/admin/gallery/${image.id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        response?.message ||
          "Image supprimée avec succès."
      );

      if (images.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadGallery({ showLoader: false });
      }
    } catch (err) {
      setError(
        err.message ||
          "Impossible de supprimer cette image."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================
  // TOGGLE STATUS
  // =========================================

  async function handleToggleStatus(image) {
    try {
      setTogglingId(image.id);
      setError("");

      await apiFetch(`/admin/gallery/${image.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          is_active: !image.is_active,
        }),
      });

      setSuccess(
        image.is_active
          ? "Image masquée du site."
          : "Image publiée sur le site."
      );

      await loadGallery({ showLoader: false });
    } catch (err) {
      setError(
        err.message ||
          "Impossible de modifier le statut."
      );
    } finally {
      setTogglingId(null);
    }
  }

  // =========================================
  // SEARCH AND FILTERS
  // =========================================

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  }

  // =========================================
  // STATISTICS
  // =========================================

  const activeOnPage = images.filter(
    (item) => item.is_active
  ).length;

  const hiddenOnPage = images.length - activeOnPage;

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="gm-manager">
      {/* HEADER */}

      <div className="gm-page-header">
        <div>
          <span className="gm-eyebrow">
            GESTION DU CONTENU
          </span>

          <h2>Galerie photos</h2>

          <p>
            Gérez les photos et les visuels affichés sur le site
            Mont Djurdjura.
          </p>
        </div>

        <div className="gm-header-actions">
          <button
            type="button"
            className="gm-refresh-button"
            onClick={() =>
              loadGallery({ showLoader: false })
            }
            disabled={refreshing || loading}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "gm-spinning" : ""}
            />
            Actualiser
          </button>

          <button
            type="button"
            className="gm-add-button"
            onClick={openCreateModal}
          >
            <Plus size={17} />
            Ajouter une image
          </button>
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="gm-alert gm-alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Fermer le message d'erreur"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="gm-alert gm-alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Fermer le message de succès"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATISTICS */}

      <div className="gm-stats-grid">
        <article className="gm-stat-card">
          <div className="gm-stat-icon gm-stat-total">
            <Images size={21} />
          </div>

          <div>
            <span>Total des images</span>
            <strong>{pagination.total}</strong>
            <small>Images enregistrées</small>
          </div>
        </article>

        <article className="gm-stat-card">
          <div className="gm-stat-icon gm-stat-active">
            <Eye size={21} />
          </div>

          <div>
            <span>Images publiées</span>
            <strong>{activeOnPage}</strong>
            <small>Sur cette page</small>
          </div>
        </article>

        <article className="gm-stat-card">
          <div className="gm-stat-icon gm-stat-hidden">
            <EyeOff size={21} />
          </div>

          <div>
            <span>Images masquées</span>
            <strong>{hiddenOnPage}</strong>
            <small>Sur cette page</small>
          </div>
        </article>
      </div>

      {/* FILTERS */}

      <div className="gm-filters-panel">
        <form
          className="gm-search-form"
          onSubmit={handleSearch}
        >
          <div className="gm-search-field">
            <Search size={18} />

            <input
              type="search"
              placeholder="Rechercher une image par son titre..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />

            {searchInput && (
              <button
                type="button"
                className="gm-clear-search"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="gm-search-button"
          >
            Rechercher
          </button>
        </form>

        <div className="gm-filter-row">
          <div className="gm-filter-field">
            <label htmlFor="gm-status-filter">
              Statut de publication
            </label>

            <select
              id="gm-status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="1">Publiées</option>
              <option value="0">Masquées</option>
            </select>
          </div>

          <button
            type="button"
            className="gm-reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={14} />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* GALLERY */}

      <div className="gm-gallery-panel">
        <div className="gm-gallery-heading">
          <div>
            <h3>Bibliothèque d&apos;images</h3>
            <p>{pagination.total} image(s) au total</p>
          </div>

          <span className="gm-page-indicator">
            Page {pagination.current_page} /{" "}
            {pagination.last_page}
          </span>
        </div>

        {loading ? (
          <div className="gm-loading">
            <div className="gm-loader" />
            <span>Chargement de la galerie...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="gm-empty-state">
            <div className="gm-empty-icon">
              <ImageIcon size={28} />
            </div>

            <strong>
              {search || statusFilter !== "all"
                ? "Aucun résultat trouvé"
                : "Votre galerie est encore vide"}
            </strong>

            <p>
              {search || statusFilter !== "all"
                ? "Essayez de modifier vos filtres de recherche."
                : "Ajoutez vos premières photos pour enrichir votre site."}
            </p>

            {!search && statusFilter === "all" && (
              <button
                type="button"
                className="gm-empty-add-button"
                onClick={openCreateModal}
              >
                <Plus size={16} />
                Ajouter une image
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="gm-image-grid">
              {images.map((image) => (
                <article
                  className="gm-image-card"
                  key={image.id}
                >
                  <div className="gm-image-wrapper">
                    <Image
                      src={getImageUrl(image)}
                      alt={image.alt_text || image.title}
                      width={1200}
                      height={800}
                      unoptimized
                      loading="lazy"
                    />

                    <span
                      className={`gm-image-status ${
                        image.is_active
                          ? "is-active"
                          : "is-hidden"
                      }`}
                    >
                      <span />
                      {image.is_active
                        ? "Publiée"
                        : "Masquée"}
                    </span>

                    <span className="gm-image-order">
                      #{image.sort_order}
                    </span>
                  </div>

                  <div className="gm-image-info">
                    <h4 title={image.title}>
                      {image.title}
                    </h4>

                    <p>
                      {image.description ||
                        "Aucune description renseignée."}
                    </p>

                    <div className="gm-image-meta">
                      <span>
                        {image.created_at
                          ? new Date(
                              image.created_at
                            ).toLocaleDateString("fr-FR")
                          : "Date inconnue"}
                      </span>

                      <span>ID : {image.id}</span>
                    </div>

                    <div className="gm-image-actions">
                      <button
                        type="button"
                        className="gm-action-edit"
                        onClick={() =>
                          openEditModal(image)
                        }
                        title="Modifier"
                      >
                        <Pencil size={15} />
                        Modifier
                      </button>

                      <button
                        type="button"
                        className="gm-action-toggle"
                        onClick={() =>
                          handleToggleStatus(image)
                        }
                        disabled={togglingId === image.id}
                        title={
                          image.is_active
                            ? "Masquer"
                            : "Publier"
                        }
                      >
                        {togglingId === image.id ? (
                          <Loader2
                            size={15}
                            className="gm-spinning"
                          />
                        ) : image.is_active ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="gm-action-delete"
                        onClick={() =>
                          handleDelete(image)
                        }
                        disabled={deletingId === image.id}
                        title="Supprimer"
                      >
                        {deletingId === image.id ? (
                          <Loader2
                            size={15}
                            className="gm-spinning"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* PAGINATION */}

            {pagination.last_page > 1 && (
              <div className="gm-pagination">
                <span>
                  Page {pagination.current_page} sur{" "}
                  {pagination.last_page}
                </span>

                <div className="gm-pagination-controls">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => current - 1)
                    }
                    disabled={page <= 1 || loading}
                    aria-label="Page précédente"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  <span>{pagination.current_page}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => current + 1)
                    }
                    disabled={
                      page >= pagination.last_page || loading
                    }
                    aria-label="Page suivante"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}

      {modalOpen && (
        <div
          className="gm-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="gm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="gm-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="gm-modal-header">
              <div>
                <span className="gm-eyebrow">
                  GESTION DE LA GALERIE
                </span>

                <h3 id="gm-modal-title">
                  {editingImage
                    ? "Modifier l'image"
                    : "Ajouter une image"}
                </h3>
              </div>

              <button
                type="button"
                className="gm-modal-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="gm-modal-body">
                {error && (
                  <div className="gm-alert gm-alert-error">
                    <AlertCircle size={17} />
                    <span>{error}</span>
                  </div>
                )}

                {/* IMAGE UPLOAD */}

                <div className="gm-upload-area">
                  <div className="gm-upload-preview">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Aperçu de la nouvelle image"
                        width={800}
                        height={600}
                        unoptimized
                      />
                    ) : editingImage ? (
                      <Image
                        src={getImageUrl(editingImage)}
                        alt={
                          editingImage.alt_text ||
                          editingImage.title
                        }
                        width={800}
                        height={600}
                        unoptimized
                      />
                    ) : (
                      <div className="gm-upload-placeholder">
                        <ImageIcon size={35} />
                        <span>Aperçu de l&apos;image</span>
                      </div>
                    )}
                  </div>

                  <div className="gm-upload-controls">
                    <strong>
                      {editingImage
                        ? "Remplacer l'image (facultatif)"
                        : "Sélectionner une image"}
                    </strong>

                    <p>
                      Formats acceptés : JPG, PNG, WEBP.
                      Taille maximale : 5 Mo.
                    </p>

                    <label className="gm-upload-button">
                      <Upload size={16} />
                      Choisir une image

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                      />
                    </label>

                    {selectedFile && (
                      <span className="gm-selected-file">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* FORM FIELDS */}

                <div className="gm-form-grid">
                  <div className="gm-form-field gm-full-field">
                    <label htmlFor="gm-title">
                      Titre <span>*</span>
                    </label>

                    <input
                      id="gm-title"
                      name="title"
                      type="text"
                      maxLength={150}
                      value={form.title}
                      onChange={handleFormChange}
                      placeholder="Ex. Notre unité de production"
                      required
                    />
                  </div>

                  <div className="gm-form-field gm-full-field">
                    <label htmlFor="gm-description">
                      Description
                    </label>

                    <textarea
                      id="gm-description"
                      name="description"
                      rows={3}
                      maxLength={5000}
                      value={form.description}
                      onChange={handleFormChange}
                      placeholder="Décrivez brièvement cette photo..."
                    />
                  </div>

                  <div className="gm-form-field gm-full-field">
                    <label htmlFor="gm-alt-text">
                      Texte alternatif (SEO)
                    </label>

                    <input
                      id="gm-alt-text"
                      name="alt_text"
                      type="text"
                      maxLength={255}
                      value={form.alt_text}
                      onChange={handleFormChange}
                      placeholder="Description de l'image pour les moteurs de recherche"
                    />
                  </div>

                  <div className="gm-form-field">
                    <label htmlFor="gm-sort-order">
                      Ordre d&apos;affichage
                    </label>

                    <input
                      id="gm-sort-order"
                      name="sort_order"
                      type="number"
                      min="0"
                      max="65535"
                      value={form.sort_order}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="gm-form-field gm-publish-field">
                    <label>Publication</label>

                    <label className="gm-checkbox-label">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleFormChange}
                      />

                      <span>
                        Publier cette image sur le site
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}

              <div className="gm-modal-footer">
                <button
                  type="button"
                  className="gm-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="gm-save-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="gm-spinning"
                      />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingImage
                        ? "Enregistrer les modifications"
                        : "Ajouter l'image"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
