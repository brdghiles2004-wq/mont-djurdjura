"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search, RefreshCw, Users, UserPlus, Eye, Pencil, Trash2, X,
  ChevronLeft, ChevronRight, Mail, Phone, Building2, MapPin,
  CalendarDays, FileText, MessageSquare, Download, Printer, Save,
  AlertCircle, CheckCircle2, ArrowLeft, Send, Reply,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import "./clients-manager.css";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  wilaya: "",
  notes: "",
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function getErrorMessage(error, fallback) {
  if (error?.errors) {
    const firstError = Object.values(error.errors).flat()[0];
    if (firstError) return firstError;
  }

  return error?.message || fallback;
}

function getClientFromResponse(data) {
  return data?.client || data?.data?.client || data?.data || null;
}

function getRelatedItems(client, type) {
  if (type === "messages") {
    return (
      client?.contact_messages ||
      client?.contactMessages ||
      client?.messages ||
      []
    );
  }

  return (
    client?.devis_requests ||
    client?.devisRequests ||
    client?.devis ||
    []
  );
}

function escapeCSV(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function getMessageContent(item) {
  return (
    item?.message ||
    item?.content ||
    item?.body ||
    item?.description ||
    ""
  );
}

export default function ClientsManager() {
  const [clients, setClients] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // REPLY TO CLIENT MESSAGES
  const [replyingMessageId, setReplyingMessageId] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sendingReplyId, setSendingReplyId] = useState(null);
  const [replyErrors, setReplyErrors] = useState({});
  const [replySuccess, setReplySuccess] = useState({});

  // =========================================
  // LOAD CLIENTS
  // =========================================

  const loadClients = useCallback(
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

        const response = await apiFetch(
          `/admin/clients?${params.toString()}`
        );

        const result =
          response?.clients ||
          response?.data?.clients ||
          response?.data;

        setClients(Array.isArray(result?.data) ? result.data : []);

        setPagination({
          current_page: Number(result?.current_page || 1),
          last_page: Number(result?.last_page || 1),
          per_page: Number(result?.per_page || 15),
          total: Number(result?.total || 0),
        });
      } catch (err) {
        setError(
          getErrorMessage(err, "Impossible de charger les clients.")
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search]
  );

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // =========================================
  // SEARCH
  // =========================================

  function handleSearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function resetSearch() {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }

  // =========================================
  // CREATE / EDIT FORM
  // =========================================

  function openCreateForm() {
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(client) {
    setEditingClient(client);

    setForm({
      name: client.name || "",
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      wilaya: client.wilaya || "",
      notes: client.notes || "",
    });

    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingClient(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveClient(event) {
    event.preventDefault();

    if (saving) return;

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Le nom complet est obligatoire.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("L'adresse email est obligatoire.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = Boolean(editingClient);

      const response = await apiFetch(
        isEditing
          ? `/admin/clients/${editingClient.id}`
          : "/admin/clients",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify({
            name: form.name.trim(),
            company: form.company.trim() || null,
            email: form.email.trim(),
            phone: form.phone.trim() || null,
            address: form.address.trim() || null,
            city: form.city.trim() || null,
            wilaya: form.wilaya.trim() || null,
            notes: form.notes.trim() || null,
          }),
        }
      );

      const savedClient = getClientFromResponse(response);

      setFormOpen(false);
      setEditingClient(null);
      setForm(EMPTY_FORM);

      setSuccessMessage(
        response?.message ||
          (isEditing
            ? "Client modifié avec succès."
            : "Client créé avec succès.")
      );

      await loadClients(true);

      if (
        selectedClient &&
        editingClient &&
        selectedClient.id === editingClient.id &&
        savedClient
      ) {
        await openClientDetails(savedClient.id);
      }
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Impossible d'enregistrer le client.")
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================
  // CLIENT DETAILS
  // =========================================

  async function openClientDetails(clientId) {
    setDetailsLoading(true);
    setSelectedClient(null);
    setReplyingMessageId(null);
    setReplyTexts({});
    setReplyErrors({});
    setReplySuccess({});

    try {
      const response = await apiFetch(
        `/admin/clients/${clientId}`
      );

      const client = getClientFromResponse(response);

      if (!client) {
        throw new Error("Client introuvable.");
      }

      setSelectedClient(client);
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible de charger les détails du client.")
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeDetails() {
    setSelectedClient(null);
    setReplyingMessageId(null);
  }

  // =========================================
  // REPLY TO A CONTACT MESSAGE
  // =========================================

  function openReply(messageId) {
    setReplyingMessageId(messageId);

    setReplyErrors((previous) => ({
      ...previous,
      [messageId]: "",
    }));

    setReplySuccess((previous) => ({
      ...previous,
      [messageId]: "",
    }));
  }

  function cancelReply(messageId) {
    if (sendingReplyId === messageId) return;

    setReplyingMessageId(null);

    setReplyErrors((previous) => ({
      ...previous,
      [messageId]: "",
    }));
  }

  function updateReplyText(messageId, value) {
    setReplyTexts((previous) => ({
      ...previous,
      [messageId]: value,
    }));
  }

  async function sendClientReply(messageId) {
    const reply = (replyTexts[messageId] || "").trim();

    if (!reply) {
      setReplyErrors((previous) => ({
        ...previous,
        [messageId]: "Veuillez saisir votre réponse.",
      }));
      return;
    }

    if (reply.length < 2) {
      setReplyErrors((previous) => ({
        ...previous,
        [messageId]: "La réponse doit contenir au moins 2 caractères.",
      }));
      return;
    }

    if (sendingReplyId) return;

    setSendingReplyId(messageId);

    setReplyErrors((previous) => ({
      ...previous,
      [messageId]: "",
    }));

    setReplySuccess((previous) => ({
      ...previous,
      [messageId]: "",
    }));

    try {
      const response = await apiFetch(
        `/admin/messages/${messageId}/reply`,
        {
          method: "POST",
          body: JSON.stringify({ reply }),
        }
      );

      setReplySuccess((previous) => ({
        ...previous,
        [messageId]:
          response?.message || "Réponse envoyée avec succès.",
      }));

      setReplyTexts((previous) => ({
        ...previous,
        [messageId]: "",
      }));

      setReplyingMessageId(null);

      // Recharger le profil pour afficher la réponse enregistrée.
      if (selectedClient?.id) {
        const refreshed = await apiFetch(
          `/admin/clients/${selectedClient.id}`
        );

        const updatedClient = getClientFromResponse(refreshed);

        if (updatedClient) {
          setSelectedClient(updatedClient);
        }
      }
    } catch (err) {
      setReplyErrors((previous) => ({
        ...previous,
        [messageId]: getErrorMessage(
          err,
          "Impossible d'envoyer la réponse."
        ),
      }));
    } finally {
      setSendingReplyId(null);
    }
  }

  // =========================================
  // DELETE CLIENT
  // =========================================

  async function deleteClient(client) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le client "${client.name}" ?\n\nLes messages et demandes de devis associés seront conservés.`
    );

    if (!confirmed) return;

    setDeletingId(client.id);
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiFetch(
        `/admin/clients/${client.id}`,
        { method: "DELETE" }
      );

      if (selectedClient?.id === client.id) {
        setSelectedClient(null);
      }

      setSuccessMessage(
        response?.message || "Client supprimé avec succès."
      );

      if (clients.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadClients(true);
      }
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible de supprimer le client.")
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================
  // EXPORT CSV
  // =========================================

  async function exportCSV() {
    try {
      setError("");

      const allClients = [];
      let currentPage = 1;
      let lastPage = 1;

      do {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("per_page", "100");

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await apiFetch(
          `/admin/clients?${params.toString()}`
        );

        const result =
          response?.clients ||
          response?.data?.clients ||
          response?.data;

        if (Array.isArray(result?.data)) {
          allClients.push(...result.data);
        }

        lastPage = Number(result?.last_page || 1);
        currentPage += 1;
      } while (currentPage <= lastPage);

      if (allClients.length === 0) {
        setError("Aucun client à exporter.");
        return;
      }

      const headers = [
        "ID", "Nom", "Entreprise", "Email", "Téléphone",
        "Adresse", "Ville", "Wilaya", "Messages",
        "Demandes de devis", "Date de création", "Notes",
      ];

      const rows = allClients.map((client) => [
        client.id,
        client.name,
        client.company,
        client.email,
        client.phone,
        client.address,
        client.city,
        client.wilaya,
        client.contact_messages_count ?? client.contact_messages?.length ?? 0,
        client.devis_requests_count ?? client.devis_requests?.length ?? 0,
        formatDate(client.created_at),
        client.notes,
      ]);

      const csv = [
        headers.map(escapeCSV).join(";"),
        ...rows.map((row) => row.map(escapeCSV).join(";")),
      ].join("\r\n");

      const blob = new Blob(
        ["\uFEFF", csv],
        { type: "text/csv;charset=utf-8;" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `mont-djurdjura-clients-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        getErrorMessage(err, "Impossible d'exporter les clients.")
      );
    }
  }

  // =========================================
  // PAGINATION / PRINT
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

  function printClients() {
    window.print();
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <section className="cm-manager">
      <div className="cm-heading">
        <div>
          <span className="cm-eyebrow">GESTION COMMERCIALE</span>
          <h2>Clients & contacts</h2>
          <p>
            Gérez votre portefeuille clients et consultez leur historique.
          </p>
        </div>

        <div className="cm-heading-actions">
          <button
            type="button"
            className="cm-secondary-button"
            onClick={() => loadClients(true)}
            disabled={loading || refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "cm-spinning" : ""}
            />
            Actualiser
          </button>

          <button
            type="button"
            className="cm-primary-button"
            onClick={openCreateForm}
          >
            <UserPlus size={17} />
            Ajouter un client
          </button>
        </div>
      </div>

      {/* SUMMARY */}

      <div className="cm-summary-grid">
        <article className="cm-summary-card">
          <div className="cm-summary-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Total des clients</span>
            <strong>{pagination.total}</strong>
            <small>Clients enregistrés</small>
          </div>
        </article>

        <article className="cm-summary-card">
          <div className="cm-summary-icon cm-summary-blue">
            <Building2 size={22} />
          </div>
          <div>
            <span>Entreprises</span>
            <strong>
              {clients.filter((client) => client.company).length}
            </strong>
            <small>Sur cette page</small>
          </div>
        </article>

        <article className="cm-summary-card">
          <div className="cm-summary-icon cm-summary-orange">
            <UserPlus size={22} />
          </div>
          <div>
            <span>Particuliers</span>
            <strong>
              {clients.filter((client) => !client.company).length}
            </strong>
            <small>Sur cette page</small>
          </div>
        </article>
      </div>

      {/* SEARCH AND EXPORT */}

      <div className="cm-toolbar">
        <form className="cm-search-form" onSubmit={handleSearch}>
          <div className="cm-search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Nom, entreprise, email, téléphone..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            {searchInput && (
              <button
                type="button"
                onClick={resetSearch}
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button type="submit" className="cm-search-button">
            Rechercher
          </button>
        </form>

        <div className="cm-export-actions">
          <button
            type="button"
            className="cm-export-button"
            onClick={exportCSV}
            disabled={loading || pagination.total === 0}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            className="cm-export-button"
            onClick={printClients}
            disabled={loading || clients.length === 0}
          >
            <Printer size={16} />
            Imprimer
          </button>
        </div>
      </div>

      {/* ALERTS */}

      {successMessage && (
        <div className="cm-alert cm-alert-success">
          <CheckCircle2 size={17} />
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="cm-alert cm-alert-error">
          <AlertCircle size={17} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadClients(true)}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* CLIENTS TABLE */}

      <div className="cm-table-card">
        <div className="cm-table-heading">
          <div>
            <h3>Liste des clients</h3>
            <p>{pagination.total} client(s) enregistré(s)</p>
          </div>
          <span className="cm-page-label">
            Page {pagination.current_page} / {pagination.last_page}
          </span>
        </div>

        <div className="cm-table-scroll">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Entreprise</th>
                <th>Coordonnées</th>
                <th>Messages</th>
                <th>Demandes devis</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="cm-table-state">
                    <RefreshCw size={21} className="cm-spinning" />
                    Chargement des clients...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="cm-empty-state">
                      <Users size={30} />
                      <strong>Aucun client trouvé</strong>
                      <p>
                        Les clients créés ou ayant envoyé une demande
                        apparaîtront ici.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="cm-client-cell">
                        <div className="cm-avatar">
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <strong>{client.name}</strong>
                          <span>#{client.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="cm-company">
                        {client.company || "Particulier"}
                      </span>
                    </td>

                    <td>
                      <div className="cm-contact-info">
                        <span>
                          <Mail size={13} />
                          {client.email}
                        </span>
                        <span>
                          <Phone size={13} />
                          {client.phone || "Non renseigné"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="cm-count">
                        <MessageSquare size={14} />
                        {client.contact_messages_count ?? 0}
                      </span>
                    </td>

                    <td>
                      <span className="cm-count">
                        <FileText size={14} />
                        {client.devis_requests_count ?? 0}
                      </span>
                    </td>

                    <td>
                      <span className="cm-date">
                        {formatDate(client.created_at)}
                      </span>
                    </td>

                    <td>
                      <div className="cm-row-actions">
                        <button
                          type="button"
                          className="cm-action-view"
                          title="Voir le profil"
                          onClick={() => openClientDetails(client.id)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="cm-action-edit"
                          title="Modifier"
                          onClick={() => openEditForm(client)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="cm-action-delete"
                          title="Supprimer"
                          disabled={deletingId === client.id}
                          onClick={() => deleteClient(client)}
                        >
                          {deletingId === client.id ? (
                            <RefreshCw size={16} className="cm-spinning" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && clients.length > 0 && (
          <div className="cm-pagination">
            <span>
              Affichage de {clients.length} sur {pagination.total} client(s)
            </span>

            <div className="cm-pagination-controls">
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

      {/* CREATE / EDIT MODAL */}

      {formOpen && (
        <div
          className="cm-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <form className="cm-modal" onSubmit={saveClient}>
            <div className="cm-modal-header">
              <div>
                <span className="cm-eyebrow">GESTION DU PORTEFEUILLE</span>
                <h3>
                  {editingClient ? "Modifier le client" : "Nouveau client"}
                </h3>
                <p>Renseignez les informations du contact.</p>
              </div>

              <button
                type="button"
                className="cm-modal-close"
                onClick={closeForm}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <div className="cm-modal-body">
              <div className="cm-form-grid">
                <div className="cm-field">
                  <label htmlFor="cm-name">Nom complet *</label>
                  <input
                    id="cm-name"
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    required
                    maxLength={255}
                    placeholder="Nom et prénom"
                  />
                </div>

                <div className="cm-field">
                  <label htmlFor="cm-company">Entreprise</label>
                  <input
                    id="cm-company"
                    value={form.company}
                    onChange={(event) =>
                      updateForm("company", event.target.value)
                    }
                    maxLength={255}
                    placeholder="Nom de l'entreprise"
                  />
                </div>

                <div className="cm-field">
                  <label htmlFor="cm-email">Email *</label>
                  <input
                    id="cm-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateForm("email", event.target.value)
                    }
                    required
                    maxLength={255}
                    placeholder="contact@entreprise.dz"
                  />
                </div>

                <div className="cm-field">
                  <label htmlFor="cm-phone">Téléphone</label>
                  <input
                    id="cm-phone"
                    value={form.phone}
                    onChange={(event) =>
                      updateForm("phone", event.target.value)
                    }
                    maxLength={50}
                    placeholder="+213 ..."
                  />
                </div>

                <div className="cm-field cm-field-full">
                  <label htmlFor="cm-address">Adresse</label>
                  <input
                    id="cm-address"
                    value={form.address}
                    onChange={(event) =>
                      updateForm("address", event.target.value)
                    }
                    maxLength={255}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="cm-field">
                  <label htmlFor="cm-city">Ville</label>
                  <input
                    id="cm-city"
                    value={form.city}
                    onChange={(event) =>
                      updateForm("city", event.target.value)
                    }
                    maxLength={100}
                    placeholder="Ville"
                  />
                </div>

                <div className="cm-field">
                  <label htmlFor="cm-wilaya">Wilaya</label>
                  <input
                    id="cm-wilaya"
                    value={form.wilaya}
                    onChange={(event) =>
                      updateForm("wilaya", event.target.value)
                    }
                    maxLength={100}
                    placeholder="Wilaya"
                  />
                </div>

                <div className="cm-field cm-field-full">
                  <label htmlFor="cm-notes">Notes internes</label>
                  <textarea
                    id="cm-notes"
                    rows={4}
                    maxLength={5000}
                    value={form.notes}
                    onChange={(event) =>
                      updateForm("notes", event.target.value)
                    }
                    placeholder="Informations réservées à l'administration..."
                  />
                </div>
              </div>

              {formError && (
                <div className="cm-alert cm-alert-error">
                  <AlertCircle size={17} />
                  {formError}
                </div>
              )}
            </div>

            <div className="cm-modal-footer">
              <button
                type="button"
                className="cm-cancel-button"
                onClick={closeForm}
                disabled={saving}
              >
                Annuler
              </button>

              <button
                type="submit"
                className="cm-primary-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="cm-spinning" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    {editingClient
                      ? "Enregistrer les modifications"
                      : "Créer le client"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DETAILS LOADING */}

      {detailsLoading && (
        <div className="cm-modal-overlay">
          <div className="cm-loading-card">
            <RefreshCw size={25} className="cm-spinning" />
            Chargement du profil client...
          </div>
        </div>
      )}

      {/* CLIENT PROFILE */}

      {selectedClient && (
        <div className="cm-profile-overlay">
          <section className="cm-profile">
            <div className="cm-profile-header">
              <button
                type="button"
                className="cm-back-button"
                onClick={closeDetails}
              >
                <ArrowLeft size={17} />
                Retour aux clients
              </button>

              <button
                type="button"
                className="cm-modal-close"
                onClick={closeDetails}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <div className="cm-profile-identity">
              <div className="cm-profile-avatar">
                {getInitials(selectedClient.name)}
              </div>

              <div className="cm-profile-name">
                <span className="cm-eyebrow">PROFIL CLIENT</span>
                <h2>{selectedClient.name}</h2>
                <p>
                  {selectedClient.company || "Client particulier"}
                  {" · "}
                  Client #{selectedClient.id}
                </p>
              </div>

              <button
                type="button"
                className="cm-primary-button"
                onClick={() => openEditForm(selectedClient)}
              >
                <Pencil size={16} />
                Modifier
              </button>
            </div>

            <div className="cm-profile-stats">
              <article>
                <MessageSquare size={19} />
                <div>
                  <span>Messages</span>
                  <strong>
                    {selectedClient.contact_messages_count ??
                      getRelatedItems(selectedClient, "messages").length}
                  </strong>
                </div>
              </article>

              <article>
                <FileText size={19} />
                <div>
                  <span>Demandes de devis</span>
                  <strong>
                    {selectedClient.devis_requests_count ??
                      getRelatedItems(selectedClient, "devis").length}
                  </strong>
                </div>
              </article>

              <article>
                <CalendarDays size={19} />
                <div>
                  <span>Client depuis</span>
                  <strong>{formatDate(selectedClient.created_at)}</strong>
                </div>
              </article>
            </div>

            <div className="cm-profile-grid">
              {/* CLIENT INFORMATION */}

              <article className="cm-profile-card">
                <h3>Informations du client</h3>

                <div className="cm-profile-info">
                  <div>
                    <Mail size={17} />
                    <span>Email</span>
                    <strong>{selectedClient.email || "—"}</strong>
                  </div>

                  <div>
                    <Phone size={17} />
                    <span>Téléphone</span>
                    <strong>{selectedClient.phone || "—"}</strong>
                  </div>

                  <div>
                    <Building2 size={17} />
                    <span>Entreprise</span>
                    <strong>
                      {selectedClient.company || "Particulier"}
                    </strong>
                  </div>

                  <div>
                    <MapPin size={17} />
                    <span>Adresse</span>
                    <strong>
                      {[
                        selectedClient.address,
                        selectedClient.city,
                        selectedClient.wilaya,
                      ].filter(Boolean).join(", ") || "—"}
                    </strong>
                  </div>
                </div>

                {selectedClient.notes && (
                  <div className="cm-notes-box">
                    <strong>Notes internes</strong>
                    <p>{selectedClient.notes}</p>
                  </div>
                )}
              </article>

              {/* QUOTE REQUEST HISTORY */}

              <article className="cm-profile-card">
                <h3>Historique des demandes de devis</h3>

                {getRelatedItems(selectedClient, "devis").length === 0 ? (
                  <div className="cm-history-empty">
                    <FileText size={23} />
                    <span>Aucune demande de devis associée.</span>
                  </div>
                ) : (
                  <div className="cm-history-list">
                    {getRelatedItems(selectedClient, "devis").map((item) => (
                      <div className="cm-history-item" key={item.id}>
                        <div className="cm-history-icon">
                          <FileText size={17} />
                        </div>

                        <div>
                          <strong>
                            {item.product || `Demande #${item.id}`}
                          </strong>
                          <span>
                            Réf. #{item.id}
                            {" · "}
                            {formatDateTime(item.created_at)}
                          </span>
                        </div>

                        <span className="cm-history-status">
                          {item.status || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              {/* CONTACT MESSAGES + REPLY */}

              <article className="cm-profile-card cm-profile-card-full cm-messages-history">
                <div className="cm-messages-history-heading">
                  <div>
                    <h3>Historique des messages de contact</h3>
                    <p>
                      Consultez les messages et répondez directement à vos clients.
                    </p>
                  </div>

                  <span className="cm-messages-total">
                    {getRelatedItems(selectedClient, "messages").length} message(s)
                  </span>
                </div>

                {getRelatedItems(selectedClient, "messages").length === 0 ? (
                  <div className="cm-history-empty">
                    <MessageSquare size={23} />
                    <span>Aucun message associé à ce client.</span>
                  </div>
                ) : (
                  <div className="cm-contact-message-list">
                    {getRelatedItems(selectedClient, "messages").map((item) => {
                      const isReplying = replyingMessageId === item.id;
                      const isSending = sendingReplyId === item.id;
                      const messageContent = getMessageContent(item);

                      return (
                        <div className="cm-contact-message" key={item.id}>
                          {/* MESSAGE HEADER */}

                          <div className="cm-contact-message-header">
                            <div className="cm-contact-message-title">
                              <div className="cm-history-icon">
                                <MessageSquare size={19} />
                              </div>

                              <div>
                                <strong>
                                  {item.subject || `Message #${item.id}`}
                                </strong>

                                <span>
                                  Référence #{item.id}
                                  {" · "}
                                  {formatDateTime(item.created_at)}
                                </span>
                              </div>
                            </div>

                            <span
                              className={`cm-history-status cm-message-status-${String(
                                item.status || "new"
                              ).toLowerCase()}`}
                            >
                              {item.status || "new"}
                            </span>
                          </div>

                          {/* ORIGINAL MESSAGE */}

                          {messageContent && (
                            <div className="cm-original-message">
                              <span className="cm-message-label">
                                MESSAGE DU CLIENT
                              </span>
                              <p>{messageContent}</p>
                            </div>
                          )}

                          {/* PREVIOUS REPLY */}

                          {item.reply_message && (
                            <div className="cm-previous-reply">
                              <div className="cm-previous-reply-heading">
                                <Reply size={17} />
                                <strong>Votre réponse</strong>
                              </div>

                              <p>{item.reply_message}</p>

                              {item.replied_at && (
                                <span>
                                  Envoyée le {formatDateTime(item.replied_at)}
                                </span>
                              )}
                            </div>
                          )}

                          {/* REPLY BUTTON */}

                          {!isReplying && (
                            <div className="cm-message-actions">
                              <button
                                type="button"
                                className="cm-client-reply-button"
                                onClick={() => openReply(item.id)}
                              >
                                <Reply size={17} />
                                {item.reply_message
                                  ? "Envoyer une autre réponse"
                                  : "Répondre au client"}
                              </button>
                            </div>
                          )}

                          {/* REPLY FORM */}

                          {isReplying && (
                            <div className="cm-client-reply-form">
                              <div className="cm-client-reply-form-heading">
                                <div>
                                  <Reply size={19} />
                                  <h4>Répondre au client</h4>
                                </div>

                                <span>
                                  À : {selectedClient.email}
                                </span>
                              </div>

                              <textarea
                                className="cm-client-reply-textarea"
                                rows={6}
                                maxLength={10000}
                                placeholder="Écrivez votre réponse au client ici..."
                                value={replyTexts[item.id] || ""}
                                onChange={(event) =>
                                  updateReplyText(item.id, event.target.value)
                                }
                                disabled={isSending}
                              />

                              <div className="cm-reply-character-count">
                                {(replyTexts[item.id] || "").length} / 10000
                                caractères
                              </div>

                              {replyErrors[item.id] && (
                                <div className="cm-reply-alert cm-reply-alert-error">
                                  <AlertCircle size={17} />
                                  {replyErrors[item.id]}
                                </div>
                              )}

                              <div className="cm-client-reply-actions">
                                <button
                                  type="button"
                                  className="cm-reply-cancel-button"
                                  onClick={() => cancelReply(item.id)}
                                  disabled={isSending}
                                >
                                  Annuler
                                </button>

                                <button
                                  type="button"
                                  className="cm-client-send-reply-button"
                                  onClick={() => sendClientReply(item.id)}
                                  disabled={
                                    isSending ||
                                    !(replyTexts[item.id] || "").trim()
                                  }
                                >
                                  {isSending ? (
                                    <>
                                      <RefreshCw
                                        size={17}
                                        className="cm-spinning"
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
                            </div>
                          )}

                          {/* SUCCESS MESSAGE */}

                          {replySuccess[item.id] && (
                            <div className="cm-reply-alert cm-reply-alert-success">
                              <CheckCircle2 size={17} />
                              {replySuccess[item.id]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            </div>

            {/* PROFILE FOOTER */}

            <div className="cm-profile-footer">
              <span>Profil client · Mont Djurdjura</span>

              <button
                type="button"
                className="cm-secondary-button"
                onClick={() => window.print()}
              >
                <Printer size={16} />
                Imprimer le profil
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}