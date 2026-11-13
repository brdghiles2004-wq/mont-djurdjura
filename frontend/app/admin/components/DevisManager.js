
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  CalendarDays,
  Mail,
  Phone,
  Package,
  User,
  Clock,
  Save,
  MessageSquare,
  FileSpreadsheet,
  FileDown,
  Download,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import "./devis-manager.css";

const STATUSES = [
  { value: "new", label: "Nouvelle" },
  { value: "in_progress", label: "En cours" },
  { value: "replied", label: "Répondu" },
  { value: "rejected", label: "Refusée" },
  { value: "archived", label: "Archivée" },
];

const REQUEST_TYPES = {
  achat_gros: "Achat en gros",
  achat_detail: "Achat au détail",
  distribution: "Distribution",
  autre: "Autre",
};

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateForExport(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("fr-FR");
}

function getStatusLabel(status) {
  return (
    STATUSES.find((item) => item.value === status)?.label ||
    status ||
    "Inconnue"
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`dm-status dm-status-${status}`}>
      {getStatusLabel(status)}
    </span>
  );
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getEmailStatusLabel(status) {
  const labels = {
    sent: "Envoyé",
    failed: "Échec",
    pending: "En attente",
  };

  return labels[status] || status || "Inconnu";
}

function getEmailStatusClass(status) {
  if (status === "sent") return "sent";
  if (status === "failed") return "failed";
  return "pending";
}

export default function DevisManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtres du tableau
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedDevis, setSelectedDevis] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Réponse email et historique
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [emailHistory, setEmailHistory] = useState([]);

  // État de l'export
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [exportMode, setExportMode] = useState("combined");
  const [exporting, setExporting] = useState(false);

  // Filtres supplémentaires de l'export
  const [exportSearch, setExportSearch] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const [exportError, setExportError] = useState("");

  const [editStatus, setEditStatus] = useState("new");
  const [internalNotes, setInternalNotes] = useState("");

  const buildFilterParams = useCallback(
    (targetPage = 1) => {
      const params = new URLSearchParams();

      params.set("page", String(targetPage));

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (dateFrom) params.set("date_from", dateFrom);
      if (dateTo) params.set("date_to", dateTo);

      return params;
    },
    [search, statusFilter, dateFrom, dateTo]
  );

  const loadRequests = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      setError("");

      try {
        const params = buildFilterParams(targetPage);
        const response = await apiFetch(
          `/admin/devis?${params.toString()}`
        );

        setRequests(Array.isArray(response?.data) ? response.data : []);
        setPage(response?.current_page || 1);
        setLastPage(response?.last_page || 1);
        setTotal(response?.total || 0);
      } catch (err) {
        setError(err.message || "Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    },
    [buildFilterParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequests(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [loadRequests]);

  // Ouvre la fenêtre d'export avec le format choisi
  function openExportModal(format) {
    setExportFormat(format);
    setExportMode("combined");
    setExportSearch("");
    setExportStatus("");
    setExportDateFrom("");
    setExportDateTo("");
    setExportError("");
    setExportModalOpen(true);
  }

  // Récupère toutes les pages selon les filtres sélectionnés
  async function fetchAllRequests() {
    const allRequests = [];
    let currentPage = 1;
    let pages = 1;

    do {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));

      if (exportMode === "combined") {
        // Filtres actuels du tableau
        if (search.trim()) params.set("search", search.trim());
        if (statusFilter) params.set("status", statusFilter);
        if (dateFrom) params.set("date_from", dateFrom);
        if (dateTo) params.set("date_to", dateTo);

        // Filtres supplémentaires de l'export
        if (exportSearch.trim()) {
          params.set("export_search", exportSearch.trim());
        }

        if (exportStatus) {
          params.set("export_status", exportStatus);
        }

        if (exportDateFrom) {
          params.set("export_date_from", exportDateFrom);
        }

        if (exportDateTo) {
          params.set("export_date_to", exportDateTo);
        }
      }

      const response = await apiFetch(
        `/admin/devis?${params.toString()}`
      );

      if (Array.isArray(response?.data)) {
        allRequests.push(...response.data);
      }

      pages = Number(response?.last_page || 1);
      currentPage += 1;
    } while (currentPage <= pages);

    return allRequests;
  }

  function getExportFilterDescription() {
    if (exportMode === "all") {
      return ["Toutes les demandes, sans filtres"];
    }

    const filters = [];

    if (search.trim()) {
      filters.push(`Recherche tableau : ${search.trim()}`);
    }

    if (statusFilter) {
      filters.push(`Statut tableau : ${getStatusLabel(statusFilter)}`);
    }

    if (dateFrom) filters.push(`Date tableau du : ${dateFrom}`);
    if (dateTo) filters.push(`Date tableau au : ${dateTo}`);

    if (exportSearch.trim()) {
      filters.push(`Recherche export : ${exportSearch.trim()}`);
    }

    if (exportStatus) {
      filters.push(`Statut export : ${getStatusLabel(exportStatus)}`);
    }

    if (exportDateFrom) {
      filters.push(`Date export du : ${exportDateFrom}`);
    }

    if (exportDateTo) {
      filters.push(`Date export au : ${exportDateTo}`);
    }

    return filters.length ? filters : ["Aucun filtre appliqué"];
  }

  async function startExport() {
    if (exporting) return;

    if (
      exportMode === "combined" &&
      exportDateFrom &&
      exportDateTo &&
      exportDateTo < exportDateFrom
    ) {
      setExportError(
        "La date de fin doit être postérieure ou égale à la date de début."
      );
      return;
    }

    setExportError("");
    setExporting(true);

    try {
      const allRequests = await fetchAllRequests();

      if (allRequests.length === 0) {
        setExportError("Aucune demande ne correspond aux filtres sélectionnés.");
        return;
      }

      if (exportFormat === "excel") {
        await generateExcel(allRequests);
      } else {
        await generatePDF(allRequests);
      }

      setExportModalOpen(false);
    } catch (err) {
      console.error("Export error:", err);
      setExportError(
        err.message || "Impossible de générer le fichier."
      );
    } finally {
      setExporting(false);
    }
  }

  async function generateExcel(allRequests) {
    const XLSX = await import("xlsx");

    const rows = allRequests.map((devis) => ({
      Référence: `#${String(devis.id).padStart(5, "0")}`,
      "Nom complet": devis.name || "",
      Entreprise: devis.company || "",
      Email: devis.email || "",
      Téléphone: devis.phone || "",
      Produit: devis.product || "",
      Quantité: devis.quantity ?? "",
      "Type de demande":
        REQUEST_TYPES[devis.request_type] || "Autre",
      Statut: getStatusLabel(devis.status),
      Message: devis.message || "",
      "Notes internes": devis.internal_notes || "",
      "Date de réception": formatDateForExport(devis.created_at),
      "Date de réponse": formatDateForExport(devis.replied_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 14 },
      { wch: 24 },
      { wch: 24 },
      { wch: 30 },
      { wch: 18 },
      { wch: 25 },
      { wch: 12 },
      { wch: 22 },
      { wch: 16 },
      { wch: 45 },
      { wch: 45 },
      { wch: 24 },
      { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Demandes de devis"
    );

    XLSX.writeFile(
      workbook,
      `mont-djurdjura-demandes-devis-${getToday()}.xlsx`
    );
  }

  async function generatePDF(allRequests) {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(7, 59, 92);
    doc.text("MONT DJURDJURA", 14, 17);

    doc.setFontSize(12);
    doc.setTextColor(35, 65, 82);
    doc.text("Rapport des demandes de devis", 14, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 110, 120);

    doc.text(
      `Date d'export : ${new Date().toLocaleString("fr-FR")}`,
      14,
      32
    );

    doc.text(
      `Nombre de demandes : ${allRequests.length}`,
      pageWidth - 14,
      17,
      { align: "right" }
    );

    const filters = getExportFilterDescription();
    const filterText = filters.join(" | ");

    doc.text(
      `Filtres : ${filterText}`,
      14,
      39,
      { maxWidth: pageWidth - 28 }
    );

    const tableRows = allRequests.map((devis) => [
      `#${String(devis.id).padStart(5, "0")}`,
      devis.name || "—",
      devis.company || "—",
      devis.email || "—",
      devis.phone || "—",
      devis.product || "—",
      String(devis.quantity ?? "—"),
      REQUEST_TYPES[devis.request_type] || "Autre",
      getStatusLabel(devis.status),
      formatDateForExport(devis.created_at),
    ]);

    autoTable(doc, {
      startY: 47,
      head: [[
        "Référence",
        "Client",
        "Entreprise",
        "Email",
        "Téléphone",
        "Produit",
        "Qté",
        "Type",
        "Statut",
        "Date de réception",
      ]],
      body: tableRows,
      theme: "grid",
      margin: { left: 10, right: 10 },
      styles: {
        font: "helvetica",
        fontSize: 7,
        cellPadding: 2.2,
        overflow: "linebreak",
        textColor: [40, 50, 60],
      },
      headStyles: {
        fillColor: [7, 59, 92],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7,
      },
      alternateRowStyles: {
        fillColor: [240, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 17 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 37 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 12 },
        7: { cellWidth: 25 },
        8: { cellWidth: 20 },
        9: { cellWidth: 35 },
      },
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(120, 130, 140);

        doc.text(
          "Mont Djurdjura - Gestion commerciale",
          10,
          pageHeight - 7
        );

        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 10,
          pageHeight - 7,
          { align: "right" }
        );
      },
    });

    doc.save(
      `mont-djurdjura-demandes-devis-${getToday()}.pdf`
    );
  }

  // Récupère les détails et l'historique des emails
  async function refreshDevisDetails(id) {
    const response = await apiFetch(`/admin/devis/${id}`);

    if (response?.devis) {
      setSelectedDevis(response.devis);
      setEmailHistory(
        Array.isArray(response.email_history)
          ? response.email_history
          : []
      );

      return response;
    }

    return null;
  }

  async function openDetails(id) {
    setDetailsLoading(true);
    setSelectedDevis(null);
    setEmailHistory([]);
    setReplyText("");

    try {
      const response = await apiFetch(`/admin/devis/${id}`);
      const devis = response?.devis;

      if (!devis) {
        throw new Error("Demande introuvable.");
      }

      setSelectedDevis(devis);
      setEditStatus(devis.status || "new");
      setInternalNotes(devis.internal_notes || "");
      setEmailHistory(
        Array.isArray(response.email_history)
          ? response.email_history
          : []
      );
      setReplyText("");
    } catch (err) {
      alert(err.message || "Impossible de charger les détails.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function saveDetails() {
    if (!selectedDevis || saving) return;

    setSaving(true);

    try {
      const payload = {
        internal_notes: internalNotes,
      };

      // Le statut replied est réservé à l'envoi effectif d'un email.
      // On ne l'envoie donc pas lors de la sauvegarde des notes.
      if (editStatus !== "replied") {
        payload.status = editStatus;
      }

      const response = await apiFetch(
        `/admin/devis/${selectedDevis.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      const updated = response?.devis;

      if (updated) {
        setSelectedDevis(updated);
        setEditStatus(updated.status || "new");
        setInternalNotes(updated.internal_notes || "");
      }

      await loadRequests(page);

      alert("La demande a été mise à jour avec succès.");
    } catch (err) {
      alert(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  }

  // Envoie une réponse par email au client
  async function sendReply() {
    if (!selectedDevis || sendingReply) return;

    const message = replyText.trim();

    if (message.length < 2) {
      alert("Veuillez rédiger une réponse avant l'envoi.");
      return;
    }

    if (!selectedDevis.email) {
      alert("Cette demande ne contient aucune adresse email.");
      return;
    }

    const confirmed = window.confirm(
      `Envoyer cette réponse à ${selectedDevis.email} ?`
    );

    if (!confirmed) return;

    setSendingReply(true);

    try {
      const response = await apiFetch(
        `/admin/devis/${selectedDevis.id}/reply`,
        {
          method: "POST",
          body: JSON.stringify({
            reply: message,
          }),
        }
      );

      if (response?.devis) {
        setSelectedDevis(response.devis);
        setEditStatus("replied");
      }

      setReplyText("");

      // Recharge l'historique après un envoi réussi.
      await refreshDevisDetails(selectedDevis.id);

      // Actualise aussi le statut dans le tableau.
      await loadRequests(page);

      alert(
        response?.message ||
          "La réponse a été envoyée avec succès."
      );
    } catch (err) {
      // Même en cas d'échec, recharge l'historique :
      // EmailLogService peut avoir enregistré une tentative failed.
      try {
        await refreshDevisDetails(selectedDevis.id);
      } catch (historyError) {
        console.error(
          "Impossible de rafraîchir l'historique email:",
          historyError
        );
      }

      alert(
        err.message ||
          "L'envoi de l'email a échoué. Vérifiez la configuration email."
      );
    } finally {
      setSendingReply(false);
    }
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  }

  function closeDetails() {
    if (saving || sendingReply) return;

    setSelectedDevis(null);
    setEmailHistory([]);
    setReplyText("");
  }

  return (
    <section className="dm-manager">
      <div className="dm-heading">
        <div>
          <span className="dm-eyebrow">GESTION COMMERCIALE</span>
          <h2>Demandes de devis</h2>
          <p>
            Consultez et gérez les demandes envoyées par vos clients.
          </p>
        </div>

        <button
          className="dm-refresh"
          onClick={() => loadRequests(page)}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "dm-spinning" : ""}
          />
          Actualiser
        </button>
      </div>

      <div className="dm-summary">
        <div className="dm-summary-icon">
          <FileText size={23} />
        </div>

        <div>
          <span>Total des demandes</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="dm-filters">
        <div className="dm-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Nom, entreprise, email, téléphone, produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>

          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <div className="dm-date-filter">
          <CalendarDays size={16} />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="Date de début"
          />
        </div>

        <div className="dm-date-filter">
          <CalendarDays size={16} />
          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            title="Date de fin"
          />
        </div>

        <button
          className="dm-reset"
          onClick={resetFilters}
          title="Réinitialiser les filtres"
        >
          <X size={17} />
        </button>
      </div>

      {error && (
        <div className="dm-error">
          <span>{error}</span>
          <button onClick={() => loadRequests(page)}>
            Réessayer
          </button>
        </div>
      )}

      <div className="dm-table-card">
        <div className="dm-table-top">
          <div>
            <h3>Liste des demandes</h3>
            <p>{total} demande(s) enregistrée(s)</p>
          </div>

          <div className="dm-table-actions">
            <span className="dm-page-info">
              Page {page} / {lastPage}
            </span>

            <button
              className="dm-export-button dm-export-excel"
              onClick={() => openExportModal("excel")}
              disabled={Boolean(exporting) || loading || total === 0}
            >
              <FileSpreadsheet size={16} />
              Export Excel
            </button>

            <button
              className="dm-export-button dm-export-pdf"
              onClick={() => openExportModal("pdf")}
              disabled={Boolean(exporting) || loading || total === 0}
            >
              <FileDown size={16} />
              Export PDF
            </button>
          </div>
        </div>

        <div className="dm-table-scroll">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Produit demandé</th>
                <th>Quantité</th>
                <th>Type</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="dm-table-message">
                    <RefreshCw
                      size={20}
                      className="dm-spinning"
                    />
                    Chargement des demandes...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="dm-table-message">
                    <FileText size={25} />
                    <strong>Aucune demande trouvée</strong>
                    <span>
                      Les demandes de devis apparaîtront ici.
                    </span>
                  </td>
                </tr>
              ) : (
                requests.map((devis) => (
                  <tr key={devis.id}>
                    <td>
                      <div className="dm-client-cell">
                        <strong>{devis.name}</strong>
                        <span>{devis.email}</span>
                      </div>
                    </td>

                    <td>
                      <strong className="dm-product-name">
                        {devis.product}
                      </strong>
                    </td>

                    <td>
                      <span className="dm-quantity">
                        {Number(devis.quantity).toLocaleString("fr-FR")}
                      </span>
                    </td>

                    <td>
                      <span className="dm-type">
                        {REQUEST_TYPES[devis.request_type] || "Autre"}
                      </span>
                    </td>

                    <td>
                      <span className="dm-date">
                        {formatDate(devis.created_at)}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={devis.status} />
                    </td>

                    <td>
                      <button
                        className="dm-view-button"
                        onClick={() => openDetails(devis.id)}
                        title="Voir les détails"
                      >
                        <Eye size={17} />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="dm-pagination">
          <span>
            {total === 0
              ? "Aucun résultat"
              : `Affichage de ${(page - 1) * 15 + 1} à ${Math.min(
                  page * 15,
                  total
                )} sur ${total}`}
          </span>

          <div>
            <button
              disabled={page <= 1 || loading}
              onClick={() => loadRequests(page - 1)}
              aria-label="Page précédente"
            >
              <ChevronLeft size={18} />
            </button>

            <span>{page}</span>

            <button
              disabled={page >= lastPage || loading}
              onClick={() => loadRequests(page + 1)}
              aria-label="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Fenêtre de configuration de l'export */}
      {exportModalOpen && (
        <div
          className="dm-export-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !exporting) {
              setExportModalOpen(false);
            }
          }}
        >
          <div className="dm-export-modal">
            <div className="dm-export-header">
              <div className="dm-export-title-icon">
                {exportFormat === "excel" ? (
                  <FileSpreadsheet size={22} />
                ) : (
                  <FileDown size={22} />
                )}
              </div>

              <div>
                <span className="dm-eyebrow">EXPORTATION DES DONNÉES</span>
                <h3>Exporter les demandes</h3>
                <p>Configurez les données à inclure dans votre fichier.</p>
              </div>

              <button
                className="dm-modal-close"
                onClick={() => setExportModalOpen(false)}
                disabled={exporting}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <div className="dm-export-body">
              <div className="dm-export-field">
                <label>Format du fichier</label>

                <div className="dm-export-format-options">
                  <button
                    type="button"
                    className={
                      exportFormat === "excel" ? "active" : ""
                    }
                    onClick={() => setExportFormat("excel")}
                  >
                    <FileSpreadsheet size={19} />
                    <span>
                      <strong>Excel</strong>
                      <small>.xlsx</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      exportFormat === "pdf" ? "active" : ""
                    }
                    onClick={() => setExportFormat("pdf")}
                  >
                    <FileDown size={19} />
                    <span>
                      <strong>PDF</strong>
                      <small>.pdf</small>
                    </span>
                  </button>
                </div>
              </div>

              <div className="dm-export-field">
                <label>Source des demandes</label>

                <label className="dm-export-radio">
                  <input
                    type="radio"
                    name="exportMode"
                    value="combined"
                    checked={exportMode === "combined"}
                    onChange={() => setExportMode("combined")}
                  />

                  <span>
                    <strong>
                      Combiner les filtres du tableau et ceux de l&apos;export
                    </strong>
                    <small>
                      Les filtres supplémentaires s&apos;ajoutent aux filtres
                      actuels du tableau.
                    </small>
                  </span>
                </label>

                <label className="dm-export-radio">
                  <input
                    type="radio"
                    name="exportMode"
                    value="all"
                    checked={exportMode === "all"}
                    onChange={() => setExportMode("all")}
                  />

                  <span>
                    <strong>Toutes les demandes</strong>
                    <small>
                      Exporter toutes les demandes, sans aucun filtre.
                    </small>
                  </span>
                </label>
              </div>

              {exportMode === "combined" && (
                <div className="dm-export-extra-filters">
                  <div className="dm-export-section-heading">
                    <div>
                      <h4>Filtres supplémentaires</h4>
                      <p>
                        Ces critères seront ajoutés aux filtres du tableau.
                      </p>
                    </div>
                  </div>

                  <div className="dm-export-filter-grid">
                    <div className="dm-export-field dm-export-search-field">
                      <label htmlFor="export-search">
                        Recherche supplémentaire
                      </label>

                      <div className="dm-export-input-icon">
                        <Search size={16} />
                        <input
                          id="export-search"
                          type="text"
                          placeholder="Nom, entreprise, email..."
                          value={exportSearch}
                          onChange={(e) =>
                            setExportSearch(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="dm-export-field">
                      <label htmlFor="export-status">Statut</label>

                      <select
                        id="export-status"
                        value={exportStatus}
                        onChange={(e) =>
                          setExportStatus(e.target.value)
                        }
                      >
                        <option value="">Tous les statuts</option>

                        {STATUSES.map((status) => (
                          <option
                            key={status.value}
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="dm-export-field">
                      <label htmlFor="export-date-from">
                        Date de début
                      </label>

                      <input
                        id="export-date-from"
                        type="date"
                        value={exportDateFrom}
                        onChange={(e) =>
                          setExportDateFrom(e.target.value)
                        }
                      />
                    </div>

                    <div className="dm-export-field">
                      <label htmlFor="export-date-to">
                        Date de fin
                      </label>

                      <input
                        id="export-date-to"
                        type="date"
                        min={exportDateFrom || undefined}
                        value={exportDateTo}
                        onChange={(e) =>
                          setExportDateTo(e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="dm-export-hint">
                    <FileText size={16} />
                    Les critères sont combinés avec les filtres du tableau
                    (ET). Seules les demandes correspondant à tous les
                    critères seront exportées.
                  </div>
                </div>
              )}

              {exportMode === "all" && (
                <div className="dm-export-hint">
                  <FileText size={16} />
                  Tous les filtres seront ignorés. Le fichier contiendra
                  toutes les demandes enregistrées.
                </div>
              )}

              {exportError && (
                <div className="dm-export-error">
                  {exportError}
                </div>
              )}
            </div>

            <div className="dm-export-footer">
              <button
                className="dm-cancel-button"
                onClick={() => setExportModalOpen(false)}
                disabled={exporting}
              >
                Annuler
              </button>

              <button
                className="dm-export-confirm"
                onClick={startExport}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <RefreshCw size={17} className="dm-spinning" />
                    Préparation...
                  </>
                ) : (
                  <>
                    <Download size={17} />
                    Exporter {exportFormat === "excel" ? "Excel" : "PDF"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailsLoading && (
        <div className="dm-modal-overlay">
          <div className="dm-modal-loading">
            <RefreshCw size={25} className="dm-spinning" />
            Chargement des détails...
          </div>
        </div>
      )}

      {selectedDevis && (
        <div
          className="dm-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !saving &&
              !sendingReply
            ) {
              closeDetails();
            }
          }}
        >
          <div className="dm-modal">
            <div className="dm-modal-header">
              <div>
                <span className="dm-eyebrow">
                  DÉTAIL DE LA DEMANDE
                </span>
                <h3>
                  Demande #{String(selectedDevis.id).padStart(5, "0")}
                </h3>
              </div>

              <button
                className="dm-modal-close"
                onClick={closeDetails}
                disabled={saving || sendingReply}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <div className="dm-modal-body">
              {/* Informations du client */}
              <div className="dm-detail-section">
                <h4>
                  <User size={17} />
                  Informations du client
                </h4>

                <div className="dm-detail-grid">
                  <div className="dm-detail-item">
                    <span>Nom complet</span>
                    <strong>{selectedDevis.name}</strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Entreprise</span>
                    <strong>
                      {selectedDevis.company || "Non renseignée"}
                    </strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Email</span>
                    <strong>
                      <Mail size={14} />
                      {selectedDevis.email}
                    </strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Téléphone</span>
                    <strong>
                      <Phone size={14} />
                      {selectedDevis.phone || "Non renseigné"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Informations du produit */}
              <div className="dm-detail-section">
                <h4>
                  <Package size={17} />
                  Informations du produit
                </h4>

                <div className="dm-detail-grid">
                  <div className="dm-detail-item">
                    <span>Produit</span>
                    <strong>{selectedDevis.product}</strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Quantité</span>
                    <strong>
                      {Number(selectedDevis.quantity).toLocaleString("fr-FR")}
                    </strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Type de demande</span>
                    <strong>
                      {REQUEST_TYPES[selectedDevis.request_type] || "Autre"}
                    </strong>
                  </div>

                  <div className="dm-detail-item">
                    <span>Date de réception</span>
                    <strong>{formatDate(selectedDevis.created_at)}</strong>
                  </div>
                </div>

                <div className="dm-message-box">
                  <span>Message du client</span>
                  <p>
                    {selectedDevis.message ||
                      "Aucun message complémentaire."}
                  </p>
                </div>
              </div>

              {/* Suivi de la demande */}
              <div className="dm-detail-section">
                <h4>
                  <Clock size={17} />
                  Suivi de la demande
                </h4>

                <div className="dm-edit-field">
                  <label htmlFor="devis-status">Statut</label>

                  <select
                    id="devis-status"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    disabled={saving || sendingReply}
                  >
                    {STATUSES.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                        disabled={status.value === "replied"}
                      >
                        {status.value === "replied"
                          ? "Répondu (après envoi email)"
                          : status.label}
                      </option>
                    ))}
                  </select>

                  <span className="dm-character-count">
                    Le statut « Répondu » est attribué automatiquement après
                    l&apos;envoi réussi d&apos;un email.
                  </span>
                </div>

                {selectedDevis.replied_at && (
                  <div className="dm-replied-date">
                    <Mail size={15} />
                    Date de réponse : {formatDate(selectedDevis.replied_at)}
                  </div>
                )}

                <div className="dm-edit-field">
                  <label htmlFor="devis-notes">
                    <MessageSquare size={15} />
                    Notes internes
                  </label>

                  <textarea
                    id="devis-notes"
                    rows="5"
                    maxLength="10000"
                    placeholder="Ajoutez des notes réservées à l'administration..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    disabled={saving || sendingReply}
                  />

                  <span className="dm-character-count">
                    {internalNotes.length} / 10000
                  </span>
                </div>
              </div>

              {/* Composer de réponse email */}
              <div className="dm-reply-section">
                <h4>
                  <Send size={17} />
                  Répondre au client par email
                </h4>

                <p className="dm-reply-description">
                  Rédigez votre réponse. Elle sera envoyée directement à
                  l&apos;adresse email utilisée par le client lors de sa demande.
                </p>

                <div className="dm-reply-recipient">
                  <Mail size={15} />
                  Destinataire :
                  <strong>{selectedDevis.email}</strong>
                </div>

                <div className="dm-edit-field">
                  <label htmlFor="devis-reply">
                    Votre réponse
                  </label>

                  <textarea
                    id="devis-reply"
                    className="dm-reply-textarea"
                    rows="7"
                    maxLength="10000"
                    placeholder="Bonjour,

Merci pour votre demande de devis.

Nous avons bien reçu votre demande et nous vous confirmons...

Cordialement,
L'équipe Mont Djurdjura"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={sendingReply}
                  />

                  <span className="dm-character-count">
                    {replyText.length} / 10000
                  </span>
                </div>

                <div className="dm-reply-actions">
                  <span className="dm-reply-hint">
                    L&apos;envoi mettra automatiquement le statut à « Répondu ».
                  </span>

                  <button
                    type="button"
                    className="dm-send-reply"
                    onClick={sendReply}
                    disabled={
                      sendingReply ||
                      !replyText.trim() ||
                      !selectedDevis.email
                    }
                  >
                    {sendingReply ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="dm-spinning"
                        />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer la réponse
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Historique des emails */}
              <div className="dm-email-history">
                <h4>
                  <History size={17} />
                  Historique des emails
                  <span className="dm-page-info">
                    {emailHistory.length}
                  </span>
                </h4>

                {emailHistory.length === 0 ? (
                  <div className="dm-email-empty">
                    Aucun email de réponse enregistré pour cette demande.
                  </div>
                ) : (
                  <div className="dm-email-history-list">
                    {emailHistory.map((email) => (
                      <div
                        className="dm-email-history-item"
                        key={email.id}
                      >
                        <div className="dm-email-history-top">
                          <strong>
                            Email #{email.id}
                          </strong>

                          <span
                            className={`dm-email-history-status ${getEmailStatusClass(
                              email.status
                            )}`}
                          >
                            {email.status === "sent" ? (
                              <CheckCircle2 size={13} />
                            ) : (
                              <AlertCircle size={13} />
                            )}

                            {getEmailStatusLabel(email.status)}
                          </span>
                        </div>

                        <div className="dm-email-history-meta">
                          <span>
                            <Mail
                              size={12}
                              style={{
                                display: "inline",
                                verticalAlign: "middle",
                                marginRight: 4,
                              }}
                            />
                            {email.recipient}
                          </span>

                          <span>
                            <Clock
                              size={12}
                              style={{
                                display: "inline",
                                verticalAlign: "middle",
                                marginRight: 4,
                              }}
                            />
                            {formatDate(email.sent_at || email.created_at)}
                          </span>
                        </div>

                        <div className="dm-email-history-subject">
                          Objet : {email.subject || "Sans objet"}
                        </div>

                        <div className="dm-email-history-body">
                          {email.body_text || "Aucun contenu disponible."}
                        </div>

                        {email.status === "failed" &&
                          email.error_message && (
                            <div className="dm-email-history-error">
                              <strong>Erreur d&apos;envoi :</strong>{" "}
                              {email.error_message}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="dm-modal-footer">
              <button
                className="dm-cancel-button"
                onClick={closeDetails}
                disabled={saving || sendingReply}
              >
                Fermer
              </button>

              <button
                className="dm-save-button"
                onClick={saveDetails}
                disabled={saving || sendingReply}
              >
                <Save size={17} />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
