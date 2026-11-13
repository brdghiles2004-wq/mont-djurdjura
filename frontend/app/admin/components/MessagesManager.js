
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CheckCircle2,
  FileText,
  AlertCircle,
  Save,
  Send,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import "./messages-manager.css";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "new", label: "Nouveau" },
  { value: "read", label: "Lu" },
  { value: "replied", label: "Répondu" },
  { value: "archived", label: "Archivé" },
];

const STATUS_LABELS = {
  new: "Nouveau",
  read: "Lu",
  replied: "Répondu",
  archived: "Archivé",
};

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatDateTime(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getStatusClass(status) {
  return `mm-status mm-status-${status || "new"}`;
}

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [editStatus, setEditStatus] = useState("new");
  const [internalNotes, setInternalNotes] = useState("");

  const [replyText, setReplyText] = useState("");

  const [saving, setSaving] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // =========================================
  // LOAD MESSAGES
  // =========================================

  const loadMessages = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("per_page", "15");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (statusFilter) {
          params.set("status", statusFilter);
        }

        if (dateFrom) {
          params.set("date_from", dateFrom);
        }

        if (dateTo) {
          params.set("date_to", dateTo);
        }

        const data = await apiFetch(
          `/admin/messages?${params.toString()}`
        );

        const result = data?.messages;

        setMessages(Array.isArray(result?.data) ? result.data : []);

        setPagination({
          current_page: result?.current_page || 1,
          last_page: result?.last_page || 1,
          per_page: result?.per_page || 15,
          total: result?.total || 0,
        });
      } catch (err) {
        setError(
          err?.message || "Impossible de charger les messages."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, statusFilter, dateFrom, dateTo]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMessages();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadMessages]);

  // =========================================
  // SEARCH AND FILTERS
  // =========================================

  function handleSearch(event) {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  }

  function handleFilterChange(callback, value) {
    setPage(1);
    callback(value);
  }

  // =========================================
  // OPEN MESSAGE DETAILS
  // =========================================

  async function openMessage(message) {
    setSelectedMessage(message);
    setDetailsLoading(true);

    setSuccessMessage("");
    setSaveError("");
    setReplyText("");

    setEditStatus(message.status || "new");
    setInternalNotes(message.internal_notes || "");

    try {
      const data = await apiFetch(
        `/admin/messages/${message.id}`
      );

      const fullMessage = data?.contact_message || message;

      setSelectedMessage(fullMessage);
      setEditStatus(fullMessage.status || "new");
      setInternalNotes(fullMessage.internal_notes || "");
    } catch (err) {
      setSaveError(
        err?.message || "Impossible de charger les détails."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  // =========================================
  // CLOSE MODAL
  // =========================================

  function closeMessage() {
    if (saving || sendingReply) return;

    setSelectedMessage(null);
    setSuccessMessage("");
    setSaveError("");
    setReplyText("");
  }

  // =========================================
  // PAGINATION
  // =========================================

  function changePage(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.last_page ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  }

  // =========================================
  // SAVE MESSAGE
  // =========================================

  async function saveMessage() {
    if (!selectedMessage || saving || sendingReply) return;

    setSaving(true);
    setSuccessMessage("");
    setSaveError("");

    try {
      const data = await apiFetch(
        `/admin/messages/${selectedMessage.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: editStatus,
            internal_notes: internalNotes,
          }),
        }
      );

      const updated = data?.contact_message;

      if (updated) {
        setSelectedMessage(updated);
        setEditStatus(updated.status || "new");
        setInternalNotes(updated.internal_notes || "");
      }

      setSuccessMessage("Message mis à jour avec succès.");

      await loadMessages(true);
    } catch (err) {
      setSaveError(
        err?.message || "Impossible de mettre à jour le message."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================
  // SEND EMAIL REPLY
  // =========================================

  async function sendReply() {
    if (!selectedMessage || sendingReply || saving) return;

    if (!replyText.trim()) {
      setSaveError("Veuillez écrire votre réponse avant l'envoi.");
      return;
    }

    setSendingReply(true);
    setSuccessMessage("");
    setSaveError("");

    try {
      const data = await apiFetch(
        `/admin/messages/${selectedMessage.id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({
            reply: replyText.trim(),
          }),
        }
      );

      const updated = data?.contact_message;

      if (updated) {
        setSelectedMessage(updated);
        setEditStatus(updated.status || "replied");
        setInternalNotes(updated.internal_notes || "");
      }

      setReplyText("");

      setSuccessMessage(
        data?.message || "Votre réponse a été envoyée avec succès."
      );

      await loadMessages(true);
    } catch (err) {
      setSaveError(
        err?.message || "L'envoi de votre réponse a échoué."
      );
    } finally {
      setSendingReply(false);
    }
  }

  // =========================================
  // STATISTICS
  // =========================================

  const newMessagesCount = messages.filter(
    (message) => message.status === "new"
  ).length;

  const readMessagesCount = messages.filter(
    (message) => message.status === "read"
  ).length;

  const repliedMessagesCount = messages.filter(
    (message) => message.status === "replied"
  ).length;

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="mm-manager">
      {/* HEADER */}

      <div className="mm-page-header">
        <div>
          <span className="mm-eyebrow">
            GESTION DES CONTACTS
          </span>

          <h2>Messages de contact</h2>

          <p>
            Consultez et gérez les messages envoyés depuis votre site.
          </p>
        </div>

        <button
          type="button"
          className="mm-refresh-button"
          onClick={() => loadMessages(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "mm-spinning" : ""}
          />
          Actualiser
        </button>
      </div>

      {/* STATISTICS */}

      <div className="mm-stats-grid">
        <article className="mm-stat-card">
          <div className="mm-stat-icon mm-stat-total">
            <MessageSquare size={20} />
          </div>

          <div>
            <span>Total des messages</span>
            <strong>{pagination.total}</strong>
            <small>Tous les résultats</small>
          </div>
        </article>

        <article className="mm-stat-card">
          <div className="mm-stat-icon mm-stat-new">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Nouveaux</span>
            <strong>{newMessagesCount}</strong>
            <small>Sur cette page</small>
          </div>
        </article>

        <article className="mm-stat-card">
          <div className="mm-stat-icon mm-stat-read">
            <Eye size={20} />
          </div>

          <div>
            <span>Lus</span>
            <strong>{readMessagesCount}</strong>
            <small>Sur cette page</small>
          </div>
        </article>

        <article className="mm-stat-card">
          <div className="mm-stat-icon mm-stat-replied">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Répondus</span>
            <strong>{repliedMessagesCount}</strong>
            <small>Sur cette page</small>
          </div>
        </article>
      </div>

      {/* FILTERS */}

      <div className="mm-filters-panel">
        <form
          className="mm-search-form"
          onSubmit={handleSearch}
        >
          <div className="mm-search-field">
            <Search size={18} />

            <input
              type="search"
              placeholder="Nom, email, sujet, téléphone..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />

            {searchInput && (
              <button
                type="button"
                className="mm-clear-search"
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
            className="mm-search-button"
          >
            Rechercher
          </button>
        </form>

        <div className="mm-filter-row">
          <div className="mm-filter-field">
            <label htmlFor="mm-status-filter">
              Statut
            </label>

            <select
              id="mm-status-filter"
              value={statusFilter}
              onChange={(event) =>
                handleFilterChange(
                  setStatusFilter,
                  event.target.value
                )
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mm-filter-field">
            <label htmlFor="mm-date-from">
              Date de début
            </label>

            <input
              id="mm-date-from"
              type="date"
              value={dateFrom}
              onChange={(event) =>
                handleFilterChange(
                  setDateFrom,
                  event.target.value
                )
              }
            />
          </div>

          <div className="mm-filter-field">
            <label htmlFor="mm-date-to">
              Date de fin
            </label>

            <input
              id="mm-date-to"
              type="date"
              min={dateFrom || undefined}
              value={dateTo}
              onChange={(event) =>
                handleFilterChange(
                  setDateTo,
                  event.target.value
                )
              }
            />
          </div>

          <button
            type="button"
            className="mm-reset-button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setStatusFilter("");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* GLOBAL ERROR */}

      {error && (
        <div className="mm-alert mm-alert-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadMessages(true)}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* MESSAGES TABLE */}

      <div className="mm-table-panel">
        <div className="mm-table-heading">
          <div>
            <h3>Liste des messages</h3>
            <p>{pagination.total} message(s) trouvé(s)</p>
          </div>

          <span className="mm-page-indicator">
            Page {pagination.current_page} / {pagination.last_page}
          </span>
        </div>

        <div className="mm-table-wrapper">
          <table className="mm-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Sujet</th>
                <th>Téléphone</th>
                <th>Date</th>
                <th>Statut</th>
                <th className="mm-action-column">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="mm-table-loading">
                      <div className="mm-loader" />
                      <span>Chargement des messages...</span>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="mm-empty-state">
                      <div className="mm-empty-icon">
                        <MessageSquare size={27} />
                      </div>

                      <strong>Aucun message trouvé</strong>

                      <p>
                        Aucun message ne correspond à vos critères.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <div className="mm-contact-cell">
                        <div className="mm-avatar">
                          {getInitials(message.name)}
                        </div>

                        <div>
                          <strong>{message.name}</strong>
                          <span>{message.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="mm-subject-cell">
                        <strong>{message.subject}</strong>
                        <span>
                          {message.company || "Particulier"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="mm-phone-cell">
                        {message.phone || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="mm-date-cell">
                        {formatDate(message.created_at)}
                      </span>
                    </td>

                    <td>
                      <span className={getStatusClass(message.status)}>
                        <span className="mm-status-dot" />
                        {STATUS_LABELS[message.status] || message.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="mm-view-button"
                        onClick={() => openMessage(message)}
                      >
                        <Eye size={16} />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {!loading && messages.length > 0 && (
          <div className="mm-pagination">
            <span>
              Affichage de {messages.length} sur {pagination.total} message(s)
            </span>

            <div className="mm-pagination-controls">
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={page <= 1}
                aria-label="Page précédente"
              >
                <ChevronLeft size={18} />
              </button>

              <span>{pagination.current_page}</span>

              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={page >= pagination.last_page}
                aria-label="Page suivante"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MESSAGE DETAILS MODAL */}

      {selectedMessage && (
        <div
          className="mm-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeMessage();
            }
          }}
        >
          <section
            className="mm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mm-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="mm-modal-header">
              <div>
                <span className="mm-eyebrow">
                  DÉTAILS DU CONTACT
                </span>

                <h3 id="mm-modal-title">
                  Message #{selectedMessage.id}
                </h3>
              </div>

              <button
                type="button"
                className="mm-modal-close"
                onClick={closeMessage}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="mm-modal-loading">
                <div className="mm-loader" />
                <span>Chargement des détails...</span>
              </div>
            ) : (
              <>
                <div className="mm-modal-body">
                  {/* CONTACT */}

                  <div className="mm-detail-contact">
                    <div className="mm-detail-avatar">
                      {getInitials(selectedMessage.name)}
                    </div>

                    <div>
                      <strong>{selectedMessage.name}</strong>

                      <span>
                        {selectedMessage.company || "Particulier"}
                      </span>
                    </div>

                    <span className={getStatusClass(selectedMessage.status)}>
                      <span className="mm-status-dot" />

                      {STATUS_LABELS[selectedMessage.status] ||
                        selectedMessage.status}
                    </span>
                  </div>

                  {/* CONTACT INFORMATION */}

                  <div className="mm-detail-grid">
                    <div className="mm-detail-item">
                      <Mail size={17} />

                      <div>
                        <span>Email</span>

                        <a href={`mailto:${selectedMessage.email}`}>
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>

                    <div className="mm-detail-item">
                      <Phone size={17} />

                      <div>
                        <span>Téléphone</span>

                        {selectedMessage.phone ? (
                          <a href={`tel:${selectedMessage.phone}`}>
                            {selectedMessage.phone}
                          </a>
                        ) : (
                          <strong>Non renseigné</strong>
                        )}
                      </div>
                    </div>

                    <div className="mm-detail-item">
                      <Building2 size={17} />

                      <div>
                        <span>Entreprise</span>

                        <strong>
                          {selectedMessage.company || "Non renseignée"}
                        </strong>
                      </div>
                    </div>

                    <div className="mm-detail-item">
                      <CalendarDays size={17} />

                      <div>
                        <span>Date de réception</span>

                        <strong>
                          {formatDateTime(selectedMessage.created_at)}
                        </strong>
                      </div>
                    </div>

                    {selectedMessage.replied_at && (
                      <div className="mm-detail-item">
                        <CheckCircle2 size={17} />

                        <div>
                          <span>Date de réponse</span>

                          <strong>
                            {formatDateTime(selectedMessage.replied_at)}
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ORIGINAL MESSAGE */}

                  <div className="mm-message-content">
                    <div className="mm-message-title">
                      <FileText size={17} />
                      <strong>{selectedMessage.subject}</strong>
                    </div>

                    <div className="mm-message-text">
                      {selectedMessage.message}
                    </div>
                  </div>

                  {/* PREVIOUS REPLY */}

                  {selectedMessage.reply_message && (
                    <div className="mm-previous-reply">
                      <div className="mm-message-title">
                        <CheckCircle2 size={17} />

                        <strong>
                          Dernière réponse envoyée
                        </strong>
                      </div>

                      <div className="mm-message-text">
                        {selectedMessage.reply_message}
                      </div>
                    </div>
                  )}

                  {/* REPLY FORM */}

                  <div className="mm-reply-section">
                    <div className="mm-edit-heading">
                      <div>
                        <h4>Répondre au client</h4>

                        <p>
                          Votre réponse sera envoyée directement par email.
                        </p>
                      </div>
                    </div>

                    <div className="mm-reply-recipient">
                      <Mail size={16} />
                      <span>À :</span>

                      <strong>{selectedMessage.email}</strong>
                    </div>

                    <div className="mm-modal-field">
                      <label htmlFor="mm-reply-text">
                        Votre réponse
                      </label>

                      <textarea
                        id="mm-reply-text"
                        rows={6}
                        maxLength={10000}
                        placeholder="Bonjour, merci pour votre message..."
                        value={replyText}
                        onChange={(event) => {
                          setReplyText(event.target.value);
                          setSaveError("");
                          setSuccessMessage("");
                        }}
                        disabled={sendingReply || saving}
                      />

                      <small>
                        {replyText.length}/10000 caractères
                      </small>
                    </div>

                    <button
                      type="button"
                      className="mm-send-reply-button"
                      onClick={sendReply}
                      disabled={
                        sendingReply ||
                        saving ||
                        !replyText.trim()
                      }
                    >
                      {sendingReply ? (
                        <>
                          <RefreshCw
                            size={17}
                            className="mm-spinning"
                          />

                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Envoyer la réponse
                        </>
                      )}
                    </button>
                  </div>

                  {/* INTERNAL MANAGEMENT */}

                  <div className="mm-edit-section">
                    <div className="mm-edit-heading">
                      <div>
                        <h4>Gestion du message</h4>

                        <p>
                          Modifiez le statut et vos notes internes.
                        </p>
                      </div>
                    </div>

                    <div className="mm-modal-field">
                      <label htmlFor="mm-edit-status">
                        Statut du message
                      </label>

                      <select
                        id="mm-edit-status"
                        value={editStatus}
                        onChange={(event) => {
                          setEditStatus(event.target.value);
                          setSuccessMessage("");
                          setSaveError("");
                        }}
                      >
                        {STATUS_OPTIONS.filter(
                          (option) => option.value !== ""
                        ).map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mm-modal-field">
                      <label htmlFor="mm-internal-notes">
                        Notes internes
                      </label>

                      <textarea
                        id="mm-internal-notes"
                        rows={4}
                        maxLength={5000}
                        placeholder="Informations visibles uniquement dans l'administration..."
                        value={internalNotes}
                        onChange={(event) => {
                          setInternalNotes(event.target.value);
                          setSuccessMessage("");
                          setSaveError("");
                        }}
                      />

                      <small>
                        {internalNotes.length}/5000 caractères
                      </small>
                    </div>
                  </div>

                  {/* SUCCESS */}

                  {successMessage && (
                    <div className="mm-alert mm-alert-success">
                      <CheckCircle2 size={17} />
                      {successMessage}
                    </div>
                  )}

                  {/* ERROR */}

                  {saveError && (
                    <div className="mm-alert mm-alert-error">
                      <AlertCircle size={17} />
                      {saveError}
                    </div>
                  )}
                </div>

                {/* MODAL FOOTER */}

                <div className="mm-modal-footer">
                  <button
                    type="button"
                    className="mm-cancel-button"
                    onClick={closeMessage}
                    disabled={saving || sendingReply}
                  >
                    Fermer
                  </button>

                  <button
                    type="button"
                    className="mm-save-button"
                    onClick={saveMessage}
                    disabled={saving || sendingReply}
                  >
                    {saving ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="mm-spinning"
                        />

                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
