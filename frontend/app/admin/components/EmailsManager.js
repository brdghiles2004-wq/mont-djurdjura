
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Eye,
  Mail,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  FileText,
  User,
  Hash,
  Server,
  Inbox,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import "./emails-manager.css";

const STATUS_OPTIONS = [
  { value: "", label: "Tous les statuts" },
  { value: "sent", label: "Envoyé" },
  { value: "failed", label: "Échec" },
  { value: "pending", label: "En attente" },
];

const TYPE_LABELS = {
  contact_reply: "Réponse contact",
  contact_notification: "Notification contact",
  devis_notification: "Notification devis",
  devis_confirmation: "Confirmation devis",
  admin_notification: "Notification admin",
  custom: "Email personnalisé",
};

const STATUS_LABELS = {
  sent: "Envoyé",
  failed: "Échec",
  pending: "En attente",
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

function getStatusClass(status) {
  return `em-status em-status-${status || "pending"}`;
}

function getTypeLabel(type) {
  return TYPE_LABELS[type] || type || "Non défini";
}

function getEmailBody(email) {
  return email?.body_text || email?.body_html || "Aucun contenu disponible.";
}

export default function EmailsManager() {
  const [emails, setEmails] = useState([]);

  const [statistics, setStatistics] = useState({
    total: 0,
    sent: 0,
    failed: 0,
    today: 0,
  });

  const [types, setTypes] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [resending, setResending] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // =========================================
  // LOAD EMAILS
  // =========================================

  const loadEmails = useCallback(
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

        if (typeFilter) {
          params.set("type", typeFilter);
        }

        if (dateFrom) {
          params.set("date_from", dateFrom);
        }

        if (dateTo) {
          params.set("date_to", dateTo);
        }

        const data = await apiFetch(
          `/admin/emails?${params.toString()}`
        );

        const result = data?.emails;

        setEmails(
          Array.isArray(result?.data) ? result.data : []
        );

        setPagination({
          current_page: result?.current_page || 1,
          last_page: result?.last_page || 1,
          per_page: result?.per_page || 15,
          total: result?.total || 0,
        });

        const stats = data?.statistics || data?.stats || {};

        setStatistics({
          total: Number(stats.total || 0),
          sent: Number(stats.sent || 0),
          failed: Number(stats.failed || 0),
          today: Number(stats.today || 0),
        });

        setTypes(Array.isArray(data?.types) ? data.types : []);
      } catch (err) {
        setError(
          err?.message || "Impossible de charger les emails."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      page,
      search,
      statusFilter,
      typeFilter,
      dateFrom,
      dateTo,
    ]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmails();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadEmails]);

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

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  // =========================================
  // OPEN EMAIL DETAILS
  // =========================================

  async function openEmail(email) {
    setSelectedEmail(email);
    setDetailsLoading(true);
    setActionMessage("");
    setActionError("");

    try {
      const data = await apiFetch(
        `/admin/emails/${email.id}`
      );

      const fullEmail = data?.email || email;

      setSelectedEmail(fullEmail);
    } catch (err) {
      setActionError(
        err?.message || "Impossible de charger les détails de cet email."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeEmail() {
    if (resending) return;

    setSelectedEmail(null);
    setActionMessage("");
    setActionError("");
  }

  // =========================================
  // RESEND FAILED EMAIL
  // =========================================

  async function resendEmail() {
    if (!selectedEmail || resending) return;

    if (selectedEmail.status !== "failed") {
      setActionError(
        "Seuls les emails en échec peuvent être renvoyés."
      );
      return;
    }

    const confirmed = window.confirm(
      `Voulez-vous vraiment renvoyer cet email à ${selectedEmail.recipient} ?`
    );

    if (!confirmed) return;

    setResending(true);
    setActionMessage("");
    setActionError("");

    try {
      const data = await apiFetch(
        `/admin/emails/${selectedEmail.id}/resend`,
        {
          method: "POST",
        }
      );

      const updatedEmail = data?.email;

      if (updatedEmail) {
        setSelectedEmail(updatedEmail);
      } else {
        setSelectedEmail((current) => ({
          ...current,
          status: "sent",
          error_message: null,
          sent_at: new Date().toISOString(),
        }));
      }

      setActionMessage(
        data?.message || "Email renvoyé avec succès."
      );

      await loadEmails(true);
    } catch (err) {
      setActionError(
        err?.message || "Le renvoi de l'email a échoué."
      );

      // Recharger les détails pour afficher le dernier état connu.
      try {
        const refreshed = await apiFetch(
          `/admin/emails/${selectedEmail.id}`
        );

        if (refreshed?.email) {
          setSelectedEmail(refreshed.email);
        }
      } catch {
        // L'erreur principale reste affichée.
      }

      await loadEmails(true);
    } finally {
      setResending(false);
    }
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
  // RENDER
  // =========================================

  return (
    <section className="em-manager">
      {/* HEADER */}

      <div className="em-page-header">
        <div>
          <span className="em-eyebrow">
            COMMUNICATION & SMTP
          </span>

          <h2>Historique des emails</h2>

          <p>
            Consultez les emails envoyés par votre site et surveillez
            leur état d&apos;envoi.
          </p>
        </div>

        <button
          type="button"
          className="em-refresh-button"
          onClick={() => loadEmails(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "em-spinning" : ""}
          />
          Actualiser
        </button>
      </div>

      {/* STATISTICS */}

      <div className="em-stats-grid">
        <article className="em-stat-card">
          <div className="em-stat-icon em-stat-total">
            <Mail size={21} />
          </div>

          <div>
            <span>Total des emails</span>
            <strong>{statistics.total}</strong>
            <small>Tous les emails enregistrés</small>
          </div>
        </article>

        <article className="em-stat-card">
          <div className="em-stat-icon em-stat-sent">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>Envoyés</span>
            <strong>{statistics.sent}</strong>
            <small>Acceptés par le serveur SMTP</small>
          </div>
        </article>

        <article className="em-stat-card">
          <div className="em-stat-icon em-stat-failed">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>Échecs</span>
            <strong>{statistics.failed}</strong>
            <small>Emails nécessitant une vérification</small>
          </div>
        </article>

        <article className="em-stat-card">
          <div className="em-stat-icon em-stat-today">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Aujourd&apos;hui</span>
            <strong>{statistics.today}</strong>
            <small>Emails enregistrés aujourd&apos;hui</small>
          </div>
        </article>
      </div>

      {/* FILTERS */}

      <div className="em-filters-panel">
        <form
          className="em-search-form"
          onSubmit={handleSearch}
        >
          <div className="em-search-field">
            <Search size={18} />

            <input
              type="search"
              placeholder="Rechercher par destinataire ou sujet..."
              value={searchInput}
              onChange={(event) =>
                setSearchInput(event.target.value)
              }
            />

            {searchInput && (
              <button
                type="button"
                className="em-clear-search"
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
            className="em-search-button"
          >
            Rechercher
          </button>
        </form>

        <div className="em-filter-row">
          <div className="em-filter-field">
            <label htmlFor="em-status-filter">
              Statut
            </label>

            <select
              id="em-status-filter"
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

          <div className="em-filter-field">
            <label htmlFor="em-type-filter">
              Type d&apos;email
            </label>

            <select
              id="em-type-filter"
              value={typeFilter}
              onChange={(event) =>
                handleFilterChange(
                  setTypeFilter,
                  event.target.value
                )
              }
            >
              <option value="">Tous les types</option>

              {types.map((type) => (
                <option key={type} value={type}>
                  {getTypeLabel(type)}
                </option>
              ))}

              {types.length === 0 &&
                Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </select>
          </div>

          <div className="em-filter-field">
            <label htmlFor="em-date-from">
              Date de début
            </label>

            <input
              id="em-date-from"
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

          <div className="em-filter-field">
            <label htmlFor="em-date-to">
              Date de fin
            </label>

            <input
              id="em-date-to"
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
            className="em-reset-button"
            onClick={resetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* GLOBAL ERROR */}

      {error && (
        <div className="em-alert em-alert-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => loadEmails(true)}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* EMAILS TABLE */}

      <div className="em-table-panel">
        <div className="em-table-heading">
          <div>
            <h3>Liste des emails</h3>
            <p>{pagination.total} email(s) trouvé(s)</p>
          </div>

          <span className="em-page-indicator">
            Page {pagination.current_page} / {pagination.last_page}
          </span>
        </div>

        <div className="em-table-wrapper">
          <table className="em-table">
            <thead>
              <tr>
                <th>Destinataire</th>
                <th>Sujet</th>
                <th>Type</th>
                <th>Date</th>
                <th>Statut</th>
                <th className="em-action-column">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="em-table-loading">
                      <div className="em-loader" />
                      <span>Chargement des emails...</span>
                    </div>
                  </td>
                </tr>
              ) : emails.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="em-empty-state">
                      <div className="em-empty-icon">
                        <Inbox size={28} />
                      </div>

                      <strong>Aucun email trouvé</strong>

                      <p>
                        Les emails envoyés depuis le site apparaîtront ici.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                emails.map((email) => (
                  <tr key={email.id}>
                    <td>
                      <div className="em-recipient-cell">
                        <div className="em-recipient-avatar">
                          <Mail size={16} />
                        </div>

                        <div>
                          <strong>{email.recipient || "—"}</strong>
                          <span>
                            {email.cc?.length
                              ? `${email.cc.length} copie(s)`
                              : "Destinataire principal"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="em-subject-cell">
                        <strong>{email.subject || "(Sans sujet)"}</strong>
                        <span>
                          {email.attempt_count || 1} tentative(s)
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="em-type-label">
                        {getTypeLabel(email.type)}
                      </span>
                    </td>

                    <td>
                      <span className="em-date-cell">
                        {formatDate(email.last_attempt_at || email.created_at)}
                      </span>
                    </td>

                    <td>
                      <span className={getStatusClass(email.status)}>
                        <span className="em-status-dot" />
                        {STATUS_LABELS[email.status] || email.status || "Inconnu"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="em-view-button"
                        onClick={() => openEmail(email)}
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

        {!loading && emails.length > 0 && (
          <div className="em-pagination">
            <span>
              Affichage de {emails.length} sur {pagination.total} email(s)
            </span>

            <div className="em-pagination-controls">
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

      {/* EMAIL DETAILS MODAL */}

      {selectedEmail && (
        <div
          className="em-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEmail();
            }
          }}
        >
          <section
            className="em-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="em-modal-title"
          >
            {/* MODAL HEADER */}

            <div className="em-modal-header">
              <div>
                <span className="em-eyebrow">
                  DÉTAILS DE L&apos;EMAIL
                </span>

                <h3 id="em-modal-title">
                  Email #{selectedEmail.id}
                </h3>
              </div>

              <button
                type="button"
                className="em-modal-close"
                onClick={closeEmail}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="em-modal-loading">
                <div className="em-loader" />
                <span>Chargement des détails...</span>
              </div>
            ) : (
              <>
                <div className="em-modal-body">
                  {/* STATUS */}

                  <div className="em-detail-status-row">
                    <span className={getStatusClass(selectedEmail.status)}>
                      <span className="em-status-dot" />
                      {STATUS_LABELS[selectedEmail.status] ||
                        selectedEmail.status ||
                        "Inconnu"}
                    </span>

                    <span className="em-detail-type">
                      {getTypeLabel(selectedEmail.type)}
                    </span>
                  </div>

                  {/* EMAIL INFORMATION */}

                  <div className="em-detail-grid">
                    <div className="em-detail-item">
                      <Mail size={17} />

                      <div>
                        <span>Destinataire</span>

                        <a href={`mailto:${selectedEmail.recipient}`}>
                          {selectedEmail.recipient || "Non renseigné"}
                        </a>
                      </div>
                    </div>

                    <div className="em-detail-item">
                      <FileText size={17} />

                      <div>
                        <span>Objet</span>

                        <strong>
                          {selectedEmail.subject || "(Sans sujet)"}
                        </strong>
                      </div>
                    </div>

                    <div className="em-detail-item">
                      <CalendarDays size={17} />

                      <div>
                        <span>Date de création</span>

                        <strong>
                          {formatDateTime(selectedEmail.created_at)}
                        </strong>
                      </div>
                    </div>

                    <div className="em-detail-item">
                      <Clock3 size={17} />

                      <div>
                        <span>Dernière tentative</span>

                        <strong>
                          {formatDateTime(selectedEmail.last_attempt_at)}
                        </strong>
                      </div>
                    </div>

                    <div className="em-detail-item">
                      <CheckCircle2 size={17} />

                      <div>
                        <span>Date d&apos;envoi</span>

                        <strong>
                          {formatDateTime(selectedEmail.sent_at)}
                        </strong>
                      </div>
                    </div>

                    <div className="em-detail-item">
                      <RotateCcw size={17} />

                      <div>
                        <span>Nombre de tentatives</span>

                        <strong>
                          {selectedEmail.attempt_count || 1}
                        </strong>
                      </div>
                    </div>

                    {selectedEmail.message_id && (
                      <div className="em-detail-item em-detail-full">
                        <Hash size={17} />

                        <div>
                          <span>Message ID</span>
                          <strong className="em-message-id">
                            {selectedEmail.message_id}
                          </strong>
                        </div>
                      </div>
                    )}

                    {selectedEmail.cc?.length > 0 && (
                      <div className="em-detail-item em-detail-full">
                        <User size={17} />

                        <div>
                          <span>CC</span>
                          <strong>{selectedEmail.cc.join(", ")}</strong>
                        </div>
                      </div>
                    )}

                    {selectedEmail.bcc?.length > 0 && (
                      <div className="em-detail-item em-detail-full">
                        <User size={17} />

                        <div>
                          <span>BCC</span>
                          <strong>{selectedEmail.bcc.join(", ")}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* EMAIL BODY */}

                  <div className="em-content-section">
                    <div className="em-content-heading">
                      <FileText size={17} />
                      <strong>Contenu de l&apos;email</strong>
                    </div>

                    <div className="em-email-body">
                      {getEmailBody(selectedEmail)}
                    </div>
                  </div>

                  {/* SMTP ERROR */}

                  {selectedEmail.error_message && (
                    <div className="em-smtp-error">
                      <div className="em-content-heading">
                        <Server size={17} />
                        <strong>Erreur SMTP</strong>
                      </div>

                      <pre>{selectedEmail.error_message}</pre>
                    </div>
                  )}

                  {/* ACTION FEEDBACK */}

                  {actionMessage && (
                    <div className="em-alert em-alert-success">
                      <CheckCircle2 size={17} />
                      <span>{actionMessage}</span>
                    </div>
                  )}

                  {actionError && (
                    <div className="em-alert em-alert-error">
                      <AlertCircle size={17} />
                      <span>{actionError}</span>
                    </div>
                  )}

                  <p className="em-delivery-note">
                    <AlertCircle size={15} />
                    Le statut « Envoyé » signifie que le serveur SMTP a accepté
                    le message. Il ne garantit pas sa réception dans la boîte
                    de réception du destinataire.
                  </p>
                </div>

                {/* MODAL FOOTER */}

                <div className="em-modal-footer">
                  <button
                    type="button"
                    className="em-cancel-button"
                    onClick={closeEmail}
                    disabled={resending}
                  >
                    Fermer
                  </button>

                  {selectedEmail.status === "failed" && (
                    <button
                      type="button"
                      className="em-resend-button"
                      onClick={resendEmail}
                      disabled={resending}
                    >
                      {resending ? (
                        <>
                          <RefreshCw
                            size={16}
                            className="em-spinning"
                          />
                          Renvoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Renvoyer l&apos;email
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
