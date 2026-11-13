
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  X,
  Pencil,
  Trash2,
  Mail,
  CalendarDays,
  LockKeyhole,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  LoaderCircle,
  Save,
  Crown,
} from "lucide-react";

import { apiFetch, getAdminUser } from "@/lib/api";
import "./users-manager.css";

const EMPTY_USER_FORM = {
  name: "",
  email: "",
  password: "",
  role_ids: [],
};

const EMPTY_ROLE_FORM = {
  name: "",
  description: "",
  permission_ids: [],
};

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getErrorMessage(error) {
  if (error?.errors) {
    const firstError = Object.values(error.errors).flat()[0];

    if (firstError) return firstError;
  }

  if (error?.status === 403) {
    return "Vous ne disposez pas des permissions nécessaires pour effectuer cette action.";
  }

  if (error?.status === 401) {
    return "Votre session a expiré. Veuillez vous reconnecter.";
  }

  return error?.message || "Une erreur est survenue. Veuillez réessayer.";
}

function getPermissionLabel(permission) {
  if (permission.name) return permission.name;

  const labels = {
    view: "Consulter",
    create: "Créer",
    update: "Modifier",
    delete: "Supprimer",
    reply: "Répondre",
    resend: "Renvoyer",
  };

  return labels[permission.action] || permission.action || permission.slug;
}

function getModuleLabel(moduleName) {
  const labels = {
    products: "Produits",
    categories: "Catégories",
    clients: "Clients",
    pages: "Pages statiques",
    devis: "Demandes de devis",
    messages: "Messages",
    emails: "Emails",
    gallery: "Galerie",
    seo: "SEO & Sitemap",
    settings: "Paramètres",
    users: "Utilisateurs",
    roles: "Rôles",
  };

  return labels[moduleName] || moduleName;
}

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null);
  const [formError, setFormError] = useState("");
  const [alert, setAlert] = useState(null);

  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [roleForm, setRoleForm] = useState(EMPTY_ROLE_FORM);

  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const isSuperAdmin = useMemo(
    () =>
      currentUser?.roles?.some(
        (role) => role.slug === "super_admin"
      ) || false,
    [currentUser]
  );

  const currentUserId = currentUser?.id;

  const loadData = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [usersData, rolesData, currentUserData] = await Promise.all([
        apiFetch("/admin/users"),
        apiFetch("/admin/roles"),
        getAdminUser(),
      ]);

      setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      setRoles(Array.isArray(rolesData?.roles) ? rolesData.roles : []);
      setPermissions(
        Array.isArray(rolesData?.permissions)
          ? rolesData.permissions
          : []
      );

      setCurrentUser(currentUserData?.user || currentUserData || null);
      setAlert(null);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial loading without synchronous setState inside the effect.
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const roleNames = (user.roles || [])
        .map((role) => role.name)
        .join(" ");

      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        roleNames.toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const filteredRoles = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return roles;

    return roles.filter((role) => {
      const permissionNames = (role.permissions || [])
        .map((permission) => permission.slug)
        .join(" ");

      return (
        role.name?.toLowerCase().includes(term) ||
        role.description?.toLowerCase().includes(term) ||
        permissionNames.toLowerCase().includes(term)
      );
    });
  }, [roles, search]);

  const permissionGroups = useMemo(() => {
    return permissions.reduce((groups, permission) => {
      const moduleName = permission.module || "other";

      if (!groups[moduleName]) {
        groups[moduleName] = [];
      }

      groups[moduleName].push(permission);
      return groups;
    }, {});
  }, [permissions]);

  function showSuccess(message) {
    setAlert({ type: "success", message });

    setTimeout(() => {
      setAlert((current) =>
        current?.message === message ? null : current
      );
    }, 4500);
  }

  function openCreateUser() {
    setEditingUser(null);
    setUserForm(EMPTY_USER_FORM);
    setFormError("");
    setModal("user");
  }

  function openEditUser(user) {
    setEditingUser(user);

    setUserForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role_ids: (user.roles || []).map((role) => role.id),
    });

    setFormError("");
    setModal("user");
  }

  function openCreateRole() {
    setEditingRole(null);
    setRoleForm(EMPTY_ROLE_FORM);
    setFormError("");
    setModal("role");
  }

  function openEditRole(role) {
    setEditingRole(role);

    setRoleForm({
      name: role.name || "",
      description: role.description || "",
      permission_ids: (role.permissions || []).map(
        (permission) => permission.id
      ),
    });

    setFormError("");
    setModal("role");
  }

  function closeModal() {
    if (saving) return;

    setModal(null);
    setFormError("");
    setEditingUser(null);
    setEditingRole(null);
  }

  function toggleUserRole(roleId) {
    setUserForm((current) => {
      const exists = current.role_ids.includes(roleId);

      return {
        ...current,
        role_ids: exists
          ? current.role_ids.filter((id) => id !== roleId)
          : [...current.role_ids, roleId],
      };
    });
  }

  function togglePermission(permissionId) {
    setRoleForm((current) => {
      const exists = current.permission_ids.includes(permissionId);

      return {
        ...current,
        permission_ids: exists
          ? current.permission_ids.filter((id) => id !== permissionId)
          : [...current.permission_ids, permissionId],
      };
    });
  }

  function togglePermissionGroup(groupPermissions) {
    const groupIds = groupPermissions.map(
      (permission) => permission.id
    );

    setRoleForm((current) => {
      const allSelected = groupIds.every((id) =>
        current.permission_ids.includes(id)
      );

      return {
        ...current,
        permission_ids: allSelected
          ? current.permission_ids.filter(
              (id) => !groupIds.includes(id)
            )
          : [
              ...new Set([
                ...current.permission_ids,
                ...groupIds,
              ]),
            ],
      };
    });
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (userForm.role_ids.length === 0) {
      setFormError("Attribuez au moins un rôle à cet utilisateur.");
      return;
    }

    if (!editingUser && userForm.password.length < 8) {
      setFormError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    const payload = {
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      role_ids: userForm.role_ids,
    };

    if (userForm.password.trim()) {
      payload.password = userForm.password;
    }

    setSaving(true);

    try {
      if (editingUser) {
        await apiFetch(`/admin/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showSuccess("Utilisateur modifié avec succès.");
      } else {
        await apiFetch("/admin/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showSuccess("Utilisateur créé avec succès.");
      }

      setModal(null);
      setEditingUser(null);
      setUserForm(EMPTY_USER_FORM);

      await loadData(true);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleRoleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!roleForm.name.trim()) {
      setFormError("Le nom du rôle est obligatoire.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: roleForm.name.trim(),
        description: roleForm.description.trim(),
        permission_ids: roleForm.permission_ids,
      };

      if (editingRole) {
        await apiFetch(`/admin/roles/${editingRole.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        showSuccess("Rôle modifié avec succès.");
      } else {
        await apiFetch("/admin/roles", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        showSuccess("Rôle créé avec succès.");
      }

      setModal(null);
      setEditingRole(null);
      setRoleForm(EMPTY_ROLE_FORM);

      await loadData(true);
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || saving) return;

    setSaving(true);

    try {
      if (deleteTarget.type === "user") {
        await apiFetch(`/admin/users/${deleteTarget.item.id}`, {
          method: "DELETE",
        });

        showSuccess("Utilisateur supprimé avec succès.");
      } else {
        await apiFetch(`/admin/roles/${deleteTarget.item.id}`, {
          method: "DELETE",
        });

        showSuccess("Rôle supprimé avec succès.");
      }

      setDeleteTarget(null);

      await loadData(true);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error),
      });

      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  }

  function askDeleteUser(user) {
    if (user.id === currentUserId) {
      setAlert({
        type: "error",
        message: "Vous ne pouvez pas supprimer votre propre compte.",
      });
      return;
    }

    setDeleteTarget({ type: "user", item: user });
  }

  function askDeleteRole(role) {
    if (role.is_system) {
      setAlert({
        type: "error",
        message: "Les rôles système ne peuvent pas être supprimés.",
      });
      return;
    }

    setDeleteTarget({ type: "role", item: role });
  }

  if (loading) {
    return (
      <div className="um-loading">
        <div className="um-spinner" />
        <p>Chargement des utilisateurs et des rôles...</p>
      </div>
    );
  }

  if (
    alert?.type === "error" &&
    users.length === 0 &&
    roles.length === 0
  ) {
    return (
      <section className="um-access-denied">
        <div className="um-access-icon">
          <LockKeyhole size={29} />
        </div>

        <h2>Accès indisponible</h2>
        <p>{alert.message}</p>

        <button
          className="um-primary-button"
          onClick={() => loadData()}
          type="button"
        >
          <RefreshCw size={15} />
          Réessayer
        </button>
      </section>
    );
  }

  return (
    <section className="um-manager">
      <header className="um-header">
        <div>
          <span className="um-eyebrow">
            SÉCURITÉ & ADMINISTRATION
          </span>

          <h2>Utilisateurs & rôles</h2>

          <p>
            Gérez les comptes administrateurs, les rôles et les
            autorisations d&apos;accès au tableau de bord.
          </p>
        </div>

        <button
          className="um-refresh-button"
          type="button"
          onClick={() => loadData(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={15}
            className={refreshing ? "um-spin" : ""}
          />
          Actualiser
        </button>
      </header>

      {alert && (
        <div
          className={`um-alert ${
            alert.type === "error"
              ? "um-alert-error"
              : "um-alert-success"
          }`}
          role="status"
        >
          {alert.type === "error" ? (
            <AlertCircle size={17} />
          ) : (
            <Check size={17} />
          )}

          <span>{alert.message}</span>

          <button
            type="button"
            onClick={() => setAlert(null)}
            aria-label="Fermer le message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div className="um-summary-grid">
        <article className="um-summary-card">
          <div className="um-summary-icon um-icon-users">
            <Users size={22} />
          </div>

          <div>
            <span>Utilisateurs</span>
            <strong>{users.length}</strong>
            <small>Comptes enregistrés</small>
          </div>
        </article>

        <article className="um-summary-card">
          <div className="um-summary-icon um-icon-roles">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>Rôles</span>
            <strong>{roles.length}</strong>
            <small>Profils d&apos;accès</small>
          </div>
        </article>

        <article className="um-summary-card">
          <div className="um-summary-icon um-icon-permissions">
            <KeyRound size={22} />
          </div>

          <div>
            <span>Permissions</span>
            <strong>{permissions.length}</strong>
            <small>Autorisations disponibles</small>
          </div>
        </article>
      </div>

      <div className="um-toolbar">
        <div className="um-tabs">
          <button
            type="button"
            className={activeTab === "users" ? "active" : ""}
            onClick={() => {
              setActiveTab("users");
              setSearch("");
            }}
          >
            <Users size={15} />
            Utilisateurs
            <span>{users.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "roles" ? "active" : ""}
            onClick={() => {
              setActiveTab("roles");
              setSearch("");
            }}
          >
            <ShieldCheck size={15} />
            Rôles
            <span>{roles.length}</span>
          </button>
        </div>

        <div className="um-toolbar-actions">
          <label className="um-search">
            <Search size={16} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                activeTab === "users"
                  ? "Rechercher un utilisateur..."
                  : "Rechercher un rôle..."
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
              >
                <X size={14} />
              </button>
            )}
          </label>

          {activeTab === "users" ? (
            <button
              className="um-primary-button"
              type="button"
              onClick={openCreateUser}
            >
              <UserPlus size={16} />
              Ajouter
            </button>
          ) : (
            <button
              className="um-primary-button"
              type="button"
              onClick={openCreateRole}
            >
              <Plus size={17} />
              Nouveau rôle
            </button>
          )}
        </div>
      </div>

      {activeTab === "users" ? (
        <section className="um-content-panel">
          <div className="um-panel-title">
            <div>
              <h3>Comptes utilisateurs</h3>
              <p>
                Les personnes ayant accès à l&apos;administration.
              </p>
            </div>

            <span className="um-result-count">
              {filteredUsers.length} résultat(s)
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="um-empty">
              <div className="um-empty-icon">
                <Users size={25} />
              </div>

              <strong>
                {search
                  ? "Aucun utilisateur trouvé"
                  : "Aucun utilisateur enregistré"}
              </strong>

              <p>
                {search
                  ? "Essayez avec un autre nom, email ou rôle."
                  : "Ajoutez un utilisateur pour lui donner accès à l'administration."}
              </p>
            </div>
          ) : (
            <div className="um-table-wrap">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>UTILISATEUR</th>
                    <th>RÔLES ATTRIBUÉS</th>
                    <th>DATE DE CRÉATION</th>
                    <th>STATUT</th>
                    <th className="um-actions-heading">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => {
                    const isCurrentUser = item.id === currentUserId;

                    const hasSuperAdmin = item.roles?.some(
                      (role) => role.slug === "super_admin"
                    );

                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="um-user-cell">
                            <div className="um-avatar">
                              {getInitials(item.name)}
                            </div>

                            <div className="um-user-details">
                              <strong>
                                {item.name}

                                {isCurrentUser && (
                                  <span className="um-you-label">
                                    Vous
                                  </span>
                                )}

                                {hasSuperAdmin && (
                                  <Crown
                                    size={13}
                                    className="um-super-indicator"
                                  />
                                )}
                              </strong>

                              <span>
                                <Mail size={12} />
                                {item.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="um-role-badges">
                            {(item.roles || []).length > 0 ? (
                              item.roles.map((role) => (
                                <span
                                  className={`um-role-badge ${
                                    role.slug === "super_admin"
                                      ? "um-role-super"
                                      : ""
                                  }`}
                                  key={role.id}
                                >
                                  {role.slug === "super_admin" && (
                                    <Crown size={11} />
                                  )}

                                  {role.name}
                                </span>
                              ))
                            ) : (
                              <span className="um-no-role">
                                Aucun rôle
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="um-date-cell">
                            <CalendarDays
                              size={13}
                              style={{
                                display: "inline",
                                verticalAlign: "middle",
                                marginRight: 5,
                              }}
                            />

                            {formatDate(item.created_at)}
                          </span>
                        </td>

                        <td>
                          <span className="um-status">
                            <span />
                            Actif
                          </span>
                        </td>

                        <td>
                          <div className="um-row-actions">
                            <button
                              className="um-action-button"
                              type="button"
                              title="Modifier l'utilisateur"
                              aria-label={`Modifier ${item.name}`}
                              onClick={() => openEditUser(item)}
                            >
                              <Pencil size={14} />
                            </button>

                            {isCurrentUser ? (
                              <span className="um-current-account">
                                Compte actuel
                              </span>
                            ) : (
                              <button
                                className="um-action-button um-delete-action"
                                type="button"
                                title="Supprimer l'utilisateur"
                                aria-label={`Supprimer ${item.name}`}
                                onClick={() => askDeleteUser(item)}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="um-content-panel">
          <div className="um-panel-title">
            <div>
              <h3>Rôles et autorisations</h3>
              <p>
                Définissez les permissions associées à chaque profil.
              </p>
            </div>

            <span className="um-result-count">
              {filteredRoles.length} rôle(s)
            </span>
          </div>

          {filteredRoles.length === 0 ? (
            <div className="um-empty">
              <div className="um-empty-icon">
                <ShieldCheck size={25} />
              </div>

              <strong>
                {search
                  ? "Aucun rôle trouvé"
                  : "Aucun rôle disponible"}
              </strong>

              <p>
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Créez un rôle pour organiser les accès."}
              </p>
            </div>
          ) : (
            <div className="um-roles-grid">
              {filteredRoles.map((role) => {
                const rolePermissions = role.permissions || [];

                return (
                  <article className="um-role-card" key={role.id}>
                    <div className="um-role-card-top">
                      <div
                        className={`um-role-card-icon ${
                          role.slug === "super_admin"
                            ? "um-super-card-icon"
                            : ""
                        }`}
                      >
                        {role.slug === "super_admin" ? (
                          <Crown size={21} />
                        ) : (
                          <Shield size={21} />
                        )}
                      </div>

                      <div className="um-role-card-actions">
                        <button
                          className="um-action-button"
                          type="button"
                          title="Voir ou modifier le rôle"
                          aria-label={`Modifier ${role.name}`}
                          onClick={() => openEditRole(role)}
                        >
                          <Pencil size={14} />
                        </button>

                        {!role.is_system && (
                          <button
                            className="um-action-button um-delete-action"
                            type="button"
                            title="Supprimer le rôle"
                            aria-label={`Supprimer ${role.name}`}
                            onClick={() => askDeleteRole(role)}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="um-role-card-heading">
                      <h4>{role.name}</h4>

                      {role.is_system && (
                        <span className="um-system-badge">
                          <LockKeyhole size={11} />
                          Rôle système
                        </span>
                      )}
                    </div>

                    <p className="um-role-description">
                      {role.description ||
                        "Aucune description renseignée."}
                    </p>

                    <div className="um-role-meta">
                      <span>
                        <Users size={13} />
                        {role.users_count ?? 0} utilisateur(s)
                      </span>

                      <span>
                        <KeyRound size={13} />
                        {rolePermissions.length} permission(s)
                      </span>
                    </div>

                    <div className="um-role-permissions">
                      <span className="um-permissions-label">
                        PERMISSIONS
                      </span>

                      <div className="um-permission-preview">
                        {rolePermissions.length === 0 ? (
                          <span>Aucune permission</span>
                        ) : (
                          <>
                            {rolePermissions.slice(0, 5).map((permission) => (
                              <span key={permission.id}>
                                {permission.slug}
                              </span>
                            ))}

                            {rolePermissions.length > 5 && (
                              <span className="um-more-permissions">
                                +{rolePermissions.length - 5}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {role.is_system && (
                      <div className="um-system-note">
                        Ce rôle est protégé et ne peut pas être renommé
                        ou supprimé.
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      <footer className="um-footer">
        <ShieldCheck size={14} />
        Les autorisations sont également vérifiées côté serveur.
      </footer>

      {modal === "user" && (
        <div
          className="um-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="um-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-user-modal-title"
          >
            <header className="um-modal-header">
              <div>
                <span className="um-eyebrow">
                  GESTION DES COMPTES
                </span>

                <h3 id="um-user-modal-title">
                  {editingUser
                    ? "Modifier l'utilisateur"
                    : "Nouvel utilisateur"}
                </h3>

                <p>
                  Renseignez les informations et attribuez un ou plusieurs
                  rôles.
                </p>
              </div>

              <button
                className="um-modal-close"
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </header>

            {formError && (
              <div className="um-modal-error">
                <AlertCircle size={15} />
                {formError}
              </div>
            )}

            <form className="um-form" onSubmit={handleUserSubmit}>
              <div className="um-form-grid">
                <label className="um-field">
                  <span>Nom complet *</span>

                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(event) =>
                      setUserForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Ex. Ahmed Benali"
                    maxLength={255}
                    required
                  />
                </label>

                <label className="um-field">
                  <span>Adresse email *</span>

                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(event) =>
                      setUserForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="nom@entreprise.dz"
                    maxLength={255}
                    required
                  />
                </label>
              </div>

              <label className="um-field">
                <span>
                  Mot de passe{" "}
                  {editingUser
                    ? "(laisser vide pour conserver)"
                    : "*"}
                </span>

                <input
                  type="password"
                  value={userForm.password}
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder={
                    editingUser
                      ? "Nouveau mot de passe (facultatif)"
                      : "Minimum 8 caractères"
                  }
                  minLength={editingUser ? undefined : 8}
                  autoComplete="new-password"
                  required={!editingUser}
                />

                {editingUser && (
                  <small>
                    Si vous ne souhaitez pas changer le mot de passe,
                    laissez ce champ vide.
                  </small>
                )}
              </label>

              <div className="um-field">
                <div className="um-field-heading">
                  <span>Rôles attribués *</span>

                  <small>
                    {userForm.role_ids.length} sélectionné(s)
                  </small>
                </div>

                <div className="um-role-select-list">
                  {roles.map((role) => {
                    const checked = userForm.role_ids.includes(role.id);
                    const protectedRole = role.slug === "super_admin";

                    return (
                      <label
                        className={`um-role-option ${
                          checked ? "selected" : ""
                        }`}
                        key={role.id}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleUserRole(role.id)}
                          disabled={protectedRole && !isSuperAdmin}
                        />

                        <span className="um-custom-check">
                          {checked && <Check size={13} />}
                        </span>

                        <span className="um-role-option-content">
                          <strong>{role.name}</strong>

                          <small>
                            {role.description ||
                              (protectedRole
                                ? "Accès complet à l'administration"
                                : "Rôle personnalisé")}
                          </small>
                        </span>

                        {protectedRole && (
                          <span className="um-protected-label">
                            <Crown size={11} />
                            Protégé
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="um-modal-footer">
                <button
                  className="um-cancel-button"
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Annuler
                </button>

                <button
                  className="um-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <LoaderCircle size={16} className="um-spin" />
                  ) : (
                    <Save size={16} />
                  )}

                  {saving
                    ? "Enregistrement..."
                    : editingUser
                      ? "Enregistrer"
                      : "Créer l'utilisateur"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {modal === "role" && (
        <div
          className="um-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="um-modal um-role-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-role-modal-title"
          >
            <header className="um-modal-header">
              <div>
                <span className="um-eyebrow">
                  CONFIGURATION DES ACCÈS
                </span>

                <h3 id="um-role-modal-title">
                  {editingRole ? "Modifier le rôle" : "Créer un rôle"}
                </h3>

                <p>
                  Définissez le nom du rôle et choisissez ses permissions.
                </p>
              </div>

              <button
                className="um-modal-close"
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </header>

            {formError && (
              <div className="um-modal-error">
                <AlertCircle size={15} />
                {formError}
              </div>
            )}

            {editingRole?.is_system && (
              <div className="um-system-warning">
                <LockKeyhole size={15} />
                Ce rôle système ne peut pas être renommé. Ses permissions
                peuvent être consultées, mais les modifications sont
                désactivées.
              </div>
            )}

            <form className="um-form" onSubmit={handleRoleSubmit}>
              <div className="um-form-grid">
                <label className="um-field">
                  <span>Nom du rôle *</span>

                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Ex. Responsable commercial"
                    maxLength={100}
                    required
                    disabled={Boolean(editingRole?.is_system)}
                  />
                </label>

                <label className="um-field">
                  <span>Description</span>

                  <input
                    type="text"
                    value={roleForm.description}
                    onChange={(event) =>
                      setRoleForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Description du rôle"
                    maxLength={1000}
                  />
                </label>
              </div>

              <div className="um-permissions-section">
                <div className="um-permissions-heading">
                  <div>
                    <h4>Permissions</h4>
                    <p>
                      Sélectionnez les actions autorisées pour ce rôle.
                    </p>
                  </div>

                  <span>
                    {roleForm.permission_ids.length} / {permissions.length}
                  </span>
                </div>

                {Object.keys(permissionGroups).length === 0 ? (
                  <div className="um-no-permissions">
                    Aucune permission disponible.
                  </div>
                ) : (
                  <div className="um-permission-groups">
                    {Object.entries(permissionGroups).map(
                      ([moduleName, groupPermissions]) => {
                        const selectedCount = groupPermissions.filter(
                          (permission) =>
                            roleForm.permission_ids.includes(permission.id)
                        ).length;

                        const allSelected =
                          selectedCount === groupPermissions.length;

                        return (
                          <section
                            className="um-permission-group"
                            key={moduleName}
                          >
                            <div className="um-permission-group-heading">
                              <div>
                                <strong>
                                  {getModuleLabel(moduleName)}
                                </strong>

                                <span>
                                  {selectedCount}/{groupPermissions.length}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  togglePermissionGroup(groupPermissions)
                                }
                                disabled={Boolean(editingRole?.is_system)}
                              >
                                {allSelected
                                  ? "Tout retirer"
                                  : "Tout sélectionner"}
                              </button>
                            </div>

                            <div className="um-permission-options">
                              {groupPermissions.map((permission) => {
                                const checked =
                                  roleForm.permission_ids.includes(
                                    permission.id
                                  );

                                return (
                                  <label
                                    className={`um-permission-option ${
                                      checked ? "selected" : ""
                                    }`}
                                    key={permission.id}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() =>
                                        togglePermission(permission.id)
                                      }
                                      disabled={Boolean(
                                        editingRole?.is_system
                                      )}
                                    />

                                    <span className="um-custom-check">
                                      {checked && <Check size={12} />}
                                    </span>

                                    <span>
                                      {getPermissionLabel(permission)}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </section>
                        );
                      }
                    )}
                  </div>
                )}
              </div>

              <div className="um-modal-footer">
                <button
                  className="um-cancel-button"
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Fermer
                </button>

                {!editingRole?.is_system && (
                  <button
                    className="um-primary-button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="um-spin" />
                    ) : (
                      <Save size={16} />
                    )}

                    {saving
                      ? "Enregistrement..."
                      : editingRole
                        ? "Enregistrer les modifications"
                        : "Créer le rôle"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div
          className="um-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="um-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="um-delete-title"
          >
            <div className="um-confirm-icon">
              <Trash2 size={23} />
            </div>

            <h3 id="um-delete-title">
              Confirmer la suppression
            </h3>

            <p>
              Voulez-vous vraiment supprimer{" "}
              <strong>{deleteTarget.item.name}</strong> ?
              Cette action est définitive.
            </p>

            {deleteTarget.type === "role" && (
              <small>
                Le serveur refusera la suppression si ce rôle est encore
                attribué à un utilisateur.
              </small>
            )}

            <div className="um-confirm-actions">
              <button
                className="um-cancel-button"
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
              >
                Annuler
              </button>

              <button
                className="um-danger-button"
                type="button"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle size={15} className="um-spin" />
                ) : (
                  <Trash2 size={15} />
                )}

                Supprimer
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
