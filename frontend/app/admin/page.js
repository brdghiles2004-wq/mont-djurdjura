
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard, Package, FolderOpen, FileText, MessageSquare,
  Mail, Images, Users, Search, Bell, Settings, UserCircle,
  LogOut, Menu, X, ArrowUpRight, Clock3, ShieldCheck, Mountain,
  ChevronRight, UserRound, RefreshCw, AlertCircle, ExternalLink,
  ArrowLeft,
} from "lucide-react";

import { getAdminUser, logoutAdmin, apiFetch } from "@/lib/api";

import ProductsManager from "./components/ProductsManager";
import CategoriesManager from "./components/CategoriesManager";
import DevisManager from "./components/DevisManager";
import MessagesManager from "./components/MessagesManager";
import EmailsManager from "./components/EmailsManager";
import GalleryManager from "./components/GalleryManager";
import ClientsManager from "./components/ClientsManager";
import SeoManager from "./components/SeoManager";
import SettingsManager from "./components/SettingsManager";
import UsersManager from "./components/UsersManager";
import ProfileManager from "./components/ProfileManager";

import "./admin.css";

const menuItems = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "categories", label: "Catégories", icon: FolderOpen },
  { id: "quotes", label: "Demandes de devis", icon: FileText },
  { id: "messages", label: "Messages contact", icon: MessageSquare },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "gallery", label: "Galerie", icon: Images },
  { id: "clients", label: "Clients & contacts", icon: Users },
  { id: "seo", label: "SEO & Sitemap", icon: Search },
];

const statsConfig = [
  {
    key: "products",
    label: "Produits",
    icon: Package,
    description: "Catalogue produits",
    noteKey: "active_products",
    noteLabel: "produits actifs",
    target: "products",
  },
  {
    key: "devis",
    label: "Demandes de devis",
    icon: FileText,
    description: "Demandes reçues",
    target: "quotes",
  },
  {
    key: "messages",
    label: "Messages",
    icon: MessageSquare,
    description: "Messages de contact",
    noteKey: "unread_messages",
    noteLabel: "non lus",
    target: "messages",
  },
  {
    key: "clients",
    label: "Clients",
    icon: Users,
    description: "Contacts enregistrés",
    target: "clients",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Compteurs indépendants par type de notification
  const [unreadByTarget, setUnreadByTarget] = useState({
    messages: 0,
    devis: 0,
  });

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const fetchDashboard = useCallback(async (showLoading = false) => {
    if (showLoading) setDashboardLoading(true);
    setDashboardError("");

    try {
      const data = await apiFetch("/admin/dashboard");
      setDashboard(data);
    } catch (error) {
      console.error("Unable to load dashboard:", error);
      setDashboardError(
        error?.message || "Impossible de charger les statistiques."
      );
    } finally {
      if (showLoading) setDashboardLoading(false);
    }
  }, []);

  const fetchNotifications = useCallback(async (showLoading = false) => {
    if (showLoading) setNotificationsLoading(true);

    try {
      const data = await apiFetch("/admin/notifications");

      setNotifications(data?.notifications || []);
      setUnreadCount(Number(data?.unread_count || 0));

      setUnreadByTarget({
        messages: Number(data?.unread_by_target?.messages || 0),
        devis: Number(data?.unread_by_target?.devis || 0),
      });
    } catch (error) {
      console.error("Unable to load notifications:", error);
    } finally {
      if (showLoading) setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const data = await getAdminUser();
        if (!mounted) return;

        setUser(data?.user || data);
        setLoading(false);

        fetchDashboard(true);
        fetchNotifications(false);
      } catch (error) {
        if (mounted) router.replace("/admin/login");
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [router, fetchDashboard, fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchDashboard(false);
      fetchNotifications(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchDashboard, fetchNotifications]);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen((current) => !current);
    } else {
      setSidebarCollapsed((current) => !current);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await logoutAdmin();
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      alert("Impossible de se déconnecter. Réessayez.");
    }
  }

  function selectPage(id) {
    setActivePage(id);

    if (window.matchMedia("(max-width: 760px)").matches) {
      setSidebarOpen(false);
    }
  }

  function handleUserUpdated(updatedUser) {
    setUser(updatedUser);
  }

  async function markNotificationAsRead(notification) {
    try {
      if (!notification.read_at) {
        const data = await apiFetch(
          `/admin/notifications/${encodeURIComponent(notification.id)}/read`,
          { method: "PATCH" }
        );

        setUnreadCount(Number(data?.unread_count ?? 0));

        setUnreadByTarget({
          messages: Number(data?.unread_by_target?.messages || 0),
          devis: Number(data?.unread_by_target?.devis || 0),
        });

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item
          )
        );
      }

      const targetPages = {
        devis: "quotes",
        messages: "messages",
      };

      const destination = targetPages[notification.data?.target];

      setNotificationsOpen(false);

      if (destination) selectPage(destination);
    } catch (error) {
      console.error("Unable to mark notification as read:", error);
    }
  }

  async function markAllNotificationsAsRead() {
    try {
      const data = await apiFetch("/admin/notifications/read-all", {
        method: "PATCH",
      });

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read_at: item.read_at || new Date().toISOString(),
        }))
      );

      setUnreadCount(Number(data?.unread_count ?? 0));

      setUnreadByTarget({
        messages: 0,
        devis: 0,
      });
    } catch (error) {
      console.error("Unable to mark all notifications as read:", error);
    }
  }

  function formatDate(date) {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }

  function formatNotificationDate(date) {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "";

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }

  function getStatusLabel(status) {
    const labels = {
      new: "Nouveau",
      pending: "En attente",
      processing: "En cours",
      contacted: "Contacté",
      replied: "Répondu",
      completed: "Terminé",
      cancelled: "Annulé",
      read: "Lu",
      unread: "Non lu",
    };

    return labels[status] || status || "Non défini";
  }

  const activeItem = menuItems.find((item) => item.id === activePage);

  const currentPageTitle =
    activeItem?.label ||
    (activePage === "settings"
      ? "Paramètres"
      : activePage === "users"
        ? "Utilisateurs & rôles"
        : activePage === "profile"
          ? "Mon profil"
          : "Configuration");

  const canViewUsers =
    user?.roles?.some(
      (role) =>
        role.slug === "super_admin" ||
        role.permissions?.some(
          (permission) =>
            permission.slug === "users.view" ||
            permission.slug === "roles.view"
        )
    ) || false;

  const recentActivities = [
    ...(dashboard?.latest?.devis || []).map((item) => ({
      id: `devis-${item.id}`,
      type: "devis",
      title: "Nouvelle demande de devis",
      name: item.name,
      detail: item.company || item.product || "Demande de devis",
      status: item.status,
      created_at: item.created_at,
      target: "quotes",
    })),
    ...(dashboard?.latest?.messages || []).map((item) => ({
      id: `message-${item.id}`,
      type: "message",
      title: "Nouveau message de contact",
      name: item.name,
      detail: item.subject || item.company || "Message de contact",
      status: item.status,
      created_at: item.created_at,
      target: "messages",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 8);

  if (loading) {
    return (
      <main className="md-loading">
        <div className="md-loader" />
        <p>Chargement de votre espace...</p>
      </main>
    );
  }

  return (
    <div className={`md-admin ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {sidebarOpen && (
        <button
          className="md-sidebar-overlay"
          aria-label="Fermer le menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`md-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="md-brand">
          <div className="md-brand-icon">
            <Mountain size={25} />
          </div>

          <div className="md-brand-text">
            <strong>MONT DJURDJURA</strong>
            <span>ADMINISTRATION</span>
          </div>

          <button
            className="md-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="md-sidebar-label">MENU PRINCIPAL</div>

        <nav className="md-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                className={`md-nav-item ${active ? "active" : ""}`}
                onClick={() => selectPage(item.id)}
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.label}</span>

                {item.id === "messages" && unreadByTarget.messages > 0 && (
                  <span className="md-nav-badge">
                    {unreadByTarget.messages > 99
                      ? "99+"
                      : unreadByTarget.messages}
                  </span>
                )}

                {item.id === "quotes" && unreadByTarget.devis > 0 && (
                  <span className="md-nav-badge">
                    {unreadByTarget.devis > 99
                      ? "99+"
                      : unreadByTarget.devis}
                  </span>
                )}

                {active && <ChevronRight size={16} />}
              </button>
            );
          })}
        </nav>

        <div className="md-sidebar-label md-secondary-label">
          CONFIGURATION
        </div>

        <nav className="md-navigation">
          <button
            className={`md-nav-item ${activePage === "settings" ? "active" : ""}`}
            onClick={() => selectPage("settings")}
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Paramètres</span>
            {activePage === "settings" && <ChevronRight size={16} />}
          </button>

          <button
            className={`md-nav-item ${activePage === "profile" ? "active" : ""}`}
            onClick={() => selectPage("profile")}
          >
            <UserRound size={18} strokeWidth={1.8} />
            <span>Mon profil</span>
            {activePage === "profile" && <ChevronRight size={16} />}
          </button>

          {canViewUsers && (
            <button
              className={`md-nav-item ${activePage === "users" ? "active" : ""}`}
              onClick={() => selectPage("users")}
            >
              <ShieldCheck size={18} strokeWidth={1.8} />
              <span>Utilisateurs & rôles</span>
              {activePage === "users" && <ChevronRight size={16} />}
            </button>
          )}
        </nav>

        <div className="md-sidebar-bottom">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="md-site-link"
            title="Ouvrir le site public dans un nouvel onglet"
          >
            <ExternalLink size={18} strokeWidth={1.9} />
            <span>Accéder au site</span>
          </a>

          <div className="md-sidebar-status">
            <span className="md-status-dot" />
            <span>Site connecté</span>
          </div>

          <button
            className="md-logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={18} />
            <span>{loggingOut ? "Déconnexion..." : "Déconnexion"}</span>
          </button>

          <div className="md-sidebar-version">
            MONT DJURDJURA · ADMIN
          </div>
        </div>
      </aside>

      <div className="md-main">
        <header className="md-topbar">
          <div className="md-topbar-left">
            <button
              type="button"
              className="md-menu-button"
              onClick={toggleSidebar}
              aria-label="Afficher ou masquer le menu"
              title="Afficher / masquer le menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="md-breadcrumb">
                Administration <span>/</span> {currentPageTitle}
              </div>

              <h1>
                {activePage === "overview"
                  ? "Vue d'ensemble"
                  : currentPageTitle}
              </h1>
            </div>
          </div>

          <div className="md-topbar-right">
            <div className="md-notifications-wrapper">
              <button
                type="button"
                className={`md-icon-button ${notificationsOpen ? "is-active" : ""}`}
                title="Notifications"
                aria-label={`Notifications (${unreadCount} non lues)`}
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
                style={{
                  position: "relative",
                  zIndex: 1003,
                  pointerEvents: "auto",
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  setNotificationsOpen((current) => {
                    const nextState = !current;
                    if (nextState) fetchNotifications(true);
                    return nextState;
                  });
                }}
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="md-notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <button
                    type="button"
                    className="md-notifications-overlay"
                    aria-label="Fermer les notifications"
                    onClick={() => setNotificationsOpen(false)}
                  />

                  <div
                    className="md-notifications-dropdown"
                    role="dialog"
                    aria-label="Centre de notifications"
                    style={{
                      position: "absolute",
                      zIndex: 1002,
                      pointerEvents: "auto",
                    }}
                  >
                    <div className="md-notifications-header">
                      <div>
                        <strong>Notifications</strong>
                        <span>
                          {unreadCount} notification(s) non lue(s)
                        </span>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsAsRead}
                        >
                          Tout lire
                        </button>
                      )}
                    </div>

                    <div className="md-notifications-list">
                      {notificationsLoading ? (
                        <div className="md-notifications-empty">
                          Chargement des notifications...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="md-notifications-empty">
                          <Bell size={25} />
                          <strong>Aucune notification</strong>
                          <span>Vous êtes à jour.</span>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const data = notification.data || {};
                          const isUnread = !notification.read_at;

                          return (
                            <button
                              type="button"
                              key={notification.id}
                              className={`md-notification-item ${isUnread ? "is-unread" : ""}`}
                              onClick={() =>
                                markNotificationAsRead(notification)
                              }
                            >
                              <span className="md-notification-item-icon">
                                {data.type === "devis" ? (
                                  <FileText size={18} />
                                ) : (
                                  <MessageSquare size={18} />
                                )}
                              </span>

                              <span className="md-notification-item-content">
                                <strong>
                                  {data.title || "Nouvelle notification"}
                                </strong>
                                <span>{data.message || ""}</span>
                                <small>
                                  {formatNotificationDate(
                                    notification.created_at
                                  )}
                                </small>
                              </span>

                              {isUnread && (
                                <span className="md-notification-unread-dot" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="md-notifications-footer">
                      <span>MONT DJURDJURA · ADMIN</span>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="md-topbar-divider" />

            <button
              type="button"
              className="md-user md-user-button"
              onClick={() => selectPage("profile")}
              title="Consulter mon profil"
            >
              <div className="md-user-avatar">
                <UserCircle size={23} />
              </div>

              <div className="md-user-info">
                <strong>{user?.name || "Administrateur"}</strong>
                <span>{user?.email || "Compte administrateur"}</span>
              </div>
            </button>
          </div>
        </header>

        <main className="md-content">
          {activePage !== "overview" && (
            <div className="md-module-backbar">
              <button
                type="button"
                className="md-module-back-button"
                onClick={() => selectPage("overview")}
              >
                <ArrowLeft size={18} strokeWidth={2} />
                <span>Retour à la vue d’ensemble</span>
              </button>
            </div>
          )}

          {activePage === "overview" ? (
            <>
              <section className="md-welcome">
                <div>
                  <span className="md-eyebrow">
                    ESPACE D&apos;ADMINISTRATION
                  </span>
                  <h2>Bienvenue dans votre espace.</h2>
                  <p>
                    Gérez votre catalogue, vos demandes et le contenu
                    de votre site Mont Djurdjura.
                  </p>
                </div>

                <div className="md-welcome-icon">
                  <Mountain size={48} strokeWidth={1.2} />
                </div>
              </section>

              <section className="md-section-heading">
                <div>
                  <h3>Vue d&apos;ensemble</h3>
                  <p>Les principales données de votre activité.</p>
                </div>

                <button
                  type="button"
                  className="md-date-label"
                  onClick={() => fetchDashboard(true)}
                  disabled={dashboardLoading}
                  title="Actualiser les données"
                >
                  <RefreshCw
                    size={15}
                    className={dashboardLoading ? "md-spin" : ""}
                  />
                  Actualiser
                </button>
              </section>

              {dashboardError && (
                <div className="md-dashboard-error">
                  <AlertCircle size={18} />
                  <span>{dashboardError}</span>
                  <button onClick={() => fetchDashboard(true)}>
                    Réessayer
                  </button>
                </div>
              )}

              <section className="md-stats-grid">
                {statsConfig.map((stat) => {
                  const Icon = stat.icon;
                  const value = dashboard?.stats?.[stat.key];
                  const noteValue = stat.noteKey
                    ? dashboard?.stats?.[stat.noteKey]
                    : null;

                  return (
                    <button
                      type="button"
                      className="md-stat-card"
                      key={stat.key}
                      onClick={() => selectPage(stat.target)}
                      disabled={!dashboard}
                    >
                      <div className="md-stat-top">
                        <div className="md-stat-icon">
                          <Icon size={21} />
                        </div>

                        <span className="md-stat-arrow">
                          <ArrowUpRight size={17} />
                        </span>
                      </div>

                      <div className="md-stat-value">
                        {dashboardLoading && !dashboard
                          ? "..."
                          : value ?? "—"}
                      </div>

                      <h4>{stat.label}</h4>
                      <p>{stat.description}</p>

                      <span className="md-stat-note">
                        {noteValue !== null && noteValue !== undefined
                          ? `${noteValue} ${stat.noteLabel}`
                          : dashboard
                            ? "Données actualisées"
                            : "En attente des données"}
                      </span>
                    </button>
                  );
                })}
              </section>

              <section className="md-overview-grid">
                <article className="md-panel md-activity">
                  <div className="md-panel-heading">
                    <div>
                      <h3>Activité récente</h3>
                      <p>
                        Les dernières demandes et les derniers messages.
                      </p>
                    </div>
                    <Clock3 size={19} />
                  </div>

                  {dashboardLoading && !dashboard ? (
                    <div className="md-empty-state">
                      <div className="md-loader" />
                      <strong>Chargement des activités...</strong>
                    </div>
                  ) : recentActivities.length === 0 ? (
                    <div className="md-empty-state">
                      <div className="md-empty-icon">
                        <FileText size={25} />
                      </div>
                      <strong>Aucune activité à afficher</strong>
                      <p>
                        Les nouvelles demandes et les messages
                        apparaîtront ici.
                      </p>
                    </div>
                  ) : (
                    <div className="md-recent-activities">
                      {recentActivities.map((activity) => (
                        <button
                          type="button"
                          className="md-recent-activity"
                          key={activity.id}
                          onClick={() => selectPage(activity.target)}
                        >
                          <span className="md-recent-activity-icon">
                            {activity.type === "devis" ? (
                              <FileText size={18} />
                            ) : (
                              <MessageSquare size={18} />
                            )}
                          </span>

                          <span className="md-recent-activity-content">
                            <strong>{activity.title}</strong>
                            <span>{activity.name}</span>
                            <small>{activity.detail}</small>
                          </span>

                          <span className="md-recent-activity-meta">
                            <small>{formatDate(activity.created_at)}</small>
                            <span className="md-activity-status">
                              {getStatusLabel(activity.status)}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </article>

                <article className="md-panel md-quick-access">
                  <div className="md-panel-heading">
                    <div>
                      <h3>Accès rapide</h3>
                      <p>Les sections les plus utilisées.</p>
                    </div>
                  </div>

                  <button onClick={() => selectPage("products")}>
                    <span className="md-quick-icon">
                      <Package size={18} />
                    </span>
                    <span>Gérer les produits</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("categories")}>
                    <span className="md-quick-icon">
                      <FolderOpen size={18} />
                    </span>
                    <span>Gérer les catégories</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("quotes")}>
                    <span className="md-quick-icon">
                      <FileText size={18} />
                    </span>
                    <span>Demandes de devis</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("messages")}>
                    <span className="md-quick-icon">
                      <MessageSquare size={18} />
                    </span>
                    <span>Messages de contact</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("emails")}>
                    <span className="md-quick-icon">
                      <Mail size={18} />
                    </span>
                    <span>Gestion des emails</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("gallery")}>
                    <span className="md-quick-icon">
                      <Images size={18} />
                    </span>
                    <span>Gérer la galerie</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("clients")}>
                    <span className="md-quick-icon">
                      <Users size={18} />
                    </span>
                    <span>Gérer les clients</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("seo")}>
                    <span className="md-quick-icon">
                      <Search size={18} />
                    </span>
                    <span>SEO & Sitemap</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("settings")}>
                    <span className="md-quick-icon">
                      <Settings size={18} />
                    </span>
                    <span>Paramètres</span>
                    <ChevronRight size={17} />
                  </button>

                  <button onClick={() => selectPage("profile")}>
                    <span className="md-quick-icon">
                      <UserRound size={18} />
                    </span>
                    <span>Mon profil</span>
                    <ChevronRight size={17} />
                  </button>

                  {canViewUsers && (
                    <button onClick={() => selectPage("users")}>
                      <span className="md-quick-icon">
                        <ShieldCheck size={18} />
                      </span>
                      <span>Utilisateurs & rôles</span>
                      <ChevronRight size={17} />
                    </button>
                  )}
                </article>
              </section>

              <footer className="md-footer">
                <span>© Mont Djurdjura — Administration</span>
                <span>Gestion sécurisée de votre site web</span>
              </footer>
            </>
          ) : activePage === "products" ? (
            <ProductsManager />
          ) : activePage === "categories" ? (
            <CategoriesManager />
          ) : activePage === "quotes" ? (
            <DevisManager />
          ) : activePage === "messages" ? (
            <MessagesManager />
          ) : activePage === "emails" ? (
            <EmailsManager />
          ) : activePage === "gallery" ? (
            <GalleryManager />
          ) : activePage === "clients" ? (
            <ClientsManager />
          ) : activePage === "seo" ? (
            <SeoManager />
          ) : activePage === "settings" ? (
            <SettingsManager />
          ) : activePage === "profile" ? (
            <ProfileManager
              user={user}
              onUserUpdated={handleUserUpdated}
            />
          ) : activePage === "users" && canViewUsers ? (
            <UsersManager />
          ) : (
            <section className="md-module-placeholder">
              <div className="md-placeholder-icon">
                {activeItem?.icon ? (
                  (() => {
                    const Icon = activeItem.icon;
                    return <Icon size={31} />;
                  })()
                ) : (
                  <Settings size={31} />
                )}
              </div>

              <span className="md-eyebrow">
                MODULE ADMINISTRATION
              </span>

              <h2>{currentPageTitle}</h2>

              <p>
                Ce module est prévu dans votre espace
                d&apos;administration. Son interface et ses fonctionnalités
                seront développées dans la prochaine étape.
              </p>

              <button
                className="md-back-button"
                onClick={() => selectPage("overview")}
              >
                Retour à la vue d&apos;ensemble
                <ChevronRight size={17} />
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
