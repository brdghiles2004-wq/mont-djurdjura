
"use client";

import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Lock,
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Info,
} from "lucide-react";

import { apiFetch } from "@/lib/api";

import "./profile-manager.css";

export default function ProfileManager({ user, onUserUpdated }) {
  // =====================================================
  // PROFILE FORM
  // =====================================================

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // =====================================================
  // STATES
  // =====================================================

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileMessage, setProfileMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // =====================================================
  // HELPERS
  // =====================================================

  const getInitials = (name) => {
    if (!name) return "AD";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const getRoleNames = () => {
    if (!Array.isArray(user?.roles) || user.roles.length === 0) {
      return ["Aucun rôle"];
    }

    return user.roles.map((role) => role.name || role.slug);
  };

  const formatDate = (date) => {
    if (!date) return "Non disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Non disponible";
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setProfileMessage(null);
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setPasswordErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setPasswordMessage(null);
  };

  const getError = (errors, field) => {
    const error = errors?.[field];

    if (Array.isArray(error)) {
      return error[0];
    }

    return error || null;
  };

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileLoading(true);
    setProfileMessage(null);
    setProfileErrors({});

    try {
      const response = await apiFetch("/admin/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
        }),
      });

      if (response?.user) {
        setProfileForm({
          name: response.user.name || "",
          email: response.user.email || "",
        });

        if (onUserUpdated) {
          onUserUpdated(response.user);
        }
      }

      setProfileMessage({
        type: "success",
        text:
          response?.message ||
          "Votre profil a été mis à jour avec succès.",
      });
    } catch (error) {
      setProfileErrors(error.errors || {});

      setProfileMessage({
        type: "error",
        text:
          error.message ||
          "Impossible de mettre à jour votre profil.",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // UPDATE PASSWORD
  // =====================================================

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordLoading(true);
    setPasswordMessage(null);
    setPasswordErrors({});

    try {
      const response = await apiFetch("/admin/profile/password", {
        method: "PUT",
        body: JSON.stringify(passwordForm),
      });

      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

      setPasswordMessage({
        type: "success",
        text:
          response?.message ||
          "Votre mot de passe a été modifié avec succès.",
      });
    } catch (error) {
      setPasswordErrors(error.errors || {});

      setPasswordMessage({
        type: "error",
        text:
          error.message ||
          "Impossible de modifier votre mot de passe.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="md-profile">
      {/* PAGE HEADER */}
      <div className="md-profile-header">
        <div className="md-profile-heading">
          <h2>Mon profil</h2>
          <p>
            Gérez vos informations personnelles et les paramètres de sécurité
            de votre compte.
          </p>
        </div>
      </div>

      {/* PROFILE CONTENT */}
      <div className="md-profile-grid">
        {/* LEFT: IDENTITY CARD */}
        <div className="md-profile-card">
          <div className="md-profile-identity">
            <div className="md-profile-avatar">
              {getInitials(profileForm.name)}
            </div>

            <div className="md-profile-identity-info">
              <h3>{profileForm.name || "Administrateur"}</h3>
              <p>
                {profileForm.email || "Adresse e-mail non disponible"}
              </p>
            </div>

            <div className="md-profile-role">
              <ShieldCheck size={13} />
              Administrateur
            </div>
          </div>

          <div className="md-profile-details">
            <div className="md-profile-detail">
              <span>Nom complet</span>
              <strong>{profileForm.name || "—"}</strong>
            </div>

            <div className="md-profile-detail">
              <span>Adresse e-mail</span>
              <strong>{profileForm.email || "—"}</strong>
            </div>

            <div className="md-profile-detail">
              <span>Rôles</span>
              <strong>{getRoleNames().join(", ")}</strong>
            </div>

            <div className="md-profile-detail">
              <span>Membre depuis</span>
              <strong>{formatDate(user?.created_at)}</strong>
            </div>
          </div>
        </div>

        {/* RIGHT: FORMS */}
        <div className="md-profile-card">
          <div className="md-profile-form">
            {/* PERSONAL INFORMATION */}
            <form
              className="md-profile-section"
              onSubmit={handleProfileSubmit}
            >
              <div className="md-profile-section-heading">
                <div className="md-profile-section-icon">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3>Informations personnelles</h3>
                  <p>Modifiez votre nom et votre adresse e-mail.</p>
                </div>
              </div>

              {profileMessage && (
                <div
                  className={`md-profile-alert ${profileMessage.type}`}
                >
                  {profileMessage.type === "success" ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <AlertCircle size={17} />
                  )}

                  <span>{profileMessage.text}</span>
                </div>
              )}

              <div className="md-profile-fields">
                <div className="md-profile-field">
                  <label htmlFor="profile-name">Nom complet</label>

                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Votre nom complet"
                    maxLength={255}
                    required
                  />

                  {getError(profileErrors, "name") && (
                    <span className="md-profile-field-error">
                      {getError(profileErrors, "name")}
                    </span>
                  )}
                </div>

                <div className="md-profile-field">
                  <label htmlFor="profile-email">Adresse e-mail</label>

                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="exemple@email.com"
                    maxLength={255}
                    required
                  />

                  {getError(profileErrors, "email") && (
                    <span className="md-profile-field-error">
                      {getError(profileErrors, "email")}
                    </span>
                  )}
                </div>
              </div>

              <div className="md-profile-actions">
                <button
                  type="submit"
                  className="md-profile-button primary"
                  disabled={profileLoading}
                >
                  {profileLoading ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="md-spin-icon"
                      />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* PASSWORD */}
            <form
              className="md-profile-section"
              onSubmit={handlePasswordSubmit}
            >
              <div className="md-profile-section-heading">
                <div className="md-profile-section-icon">
                  <Lock size={19} />
                </div>

                <div>
                  <h3>Changer le mot de passe</h3>
                  <p>Choisissez un nouveau mot de passe sécurisé.</p>
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`md-profile-alert ${passwordMessage.type}`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <AlertCircle size={17} />
                  )}

                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <div className="md-profile-fields">
                <div className="md-profile-field full-width">
                  <label htmlFor="current-password">
                    Mot de passe actuel
                  </label>

                  <input
                    id="current-password"
                    type="password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Entrez votre mot de passe actuel"
                    autoComplete="current-password"
                    required
                  />

                  {getError(passwordErrors, "current_password") && (
                    <span className="md-profile-field-error">
                      {getError(passwordErrors, "current_password")}
                    </span>
                  )}
                </div>

                <div className="md-profile-field">
                  <label htmlFor="new-password">
                    Nouveau mot de passe
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 8 caractères"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  {getError(passwordErrors, "password") && (
                    <span className="md-profile-field-error">
                      {getError(passwordErrors, "password")}
                    </span>
                  )}
                </div>

                <div className="md-profile-field">
                  <label htmlFor="confirm-password">
                    Confirmer le mot de passe
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    name="password_confirmation"
                    value={passwordForm.password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Confirmez le nouveau mot de passe"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {getError(passwordErrors, "password_confirmation") && (
                <div className="md-profile-alert error">
                  <AlertCircle size={16} />
                  <span>
                    {getError(passwordErrors, "password_confirmation")}
                  </span>
                </div>
              )}

              <div className="md-profile-security-note">
                <Info size={17} />
                <span>
                  Pour des raisons de sécurité, votre mot de passe actuel est
                  demandé avant toute modification.
                </span>
              </div>

              <div className="md-profile-actions">
                <button
                  type="submit"
                  className="md-profile-button primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <>
                      <LoaderCircle
                        size={16}
                        className="md-spin-icon"
                      />
                      Modification...
                    </>
                  ) : (
                    <>
                      <KeyRound size={16} />
                      Modifier le mot de passe
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
