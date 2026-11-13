
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Mountain,
  Droplets,
  AlertCircle,
} from "lucide-react";

import { loginAdmin } from "@/lib/api";
import "./login.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginAdmin({
        email: email.trim(),
        password,
      });

      router.replace("/admin");
    } catch (err) {
      if (err.status === 422 || err.status === 401) {
        setError("Adresse e-mail ou mot de passe incorrect.");
      } else if (err.status === 419) {
        setError("Votre session a expiré. Veuillez réessayer.");
      } else {
        setError(
          err.message || "Impossible de contacter le serveur. Réessayez."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login">
      <div className="login-background" aria-hidden="true">
        <div className="background-orb orb-one" />
        <div className="background-orb orb-two" />
        <div className="background-grid" />
      </div>

      <section className="login-container">
        <div className="login-brand">
          <div className="brand-symbol">
            <Mountain strokeWidth={1.4} />
            <Droplets className="brand-drop" strokeWidth={1.5} />
          </div>

          <div className="brand-name">
            <span>MONT</span>
            <strong>DJURDJURA</strong>
          </div>

          <p className="brand-caption">
            SOURCE NATURELLE · ALGÉRIE
          </p>
        </div>

        <div className="login-card">
          <div className="card-heading">
            <span className="heading-label">
              ESPACE D’ADMINISTRATION
            </span>

            <h1>
              Bon retour<span>.</span>
            </h1>

            <p>
              Connectez-vous pour gérer votre site
              et votre contenu.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="admin-email">
                Adresse e-mail
              </label>

              <div className="input-wrapper">
                <Mail aria-hidden="true" />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="admin-password">
                Mot de passe
              </label>

              <div className="input-wrapper">
                <LockKeyhole aria-hidden="true" />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck />
            <span>Connexion sécurisée</span>
            <span className="security-separator">·</span>
            <span>Accès réservé</span>
          </div>
        </div>

        <footer className="login-footer">
          <span>© {new Date().getFullYear()} MONT DJURDJURA</span>
          <span>ADMINISTRATION</span>
        </footer>
      </section>

      <aside className="login-side">
        <div className="side-decoration" aria-hidden="true">
          <div className="mountain-shape mountain-back" />
          <div className="mountain-shape mountain-front" />
          <div className="water-line water-one" />
          <div className="water-line water-two" />
          <div className="water-line water-three" />
        </div>

        <div className="side-content">
          <span className="side-eyebrow">
            L’ESPRIT DE LA NATURE
          </span>

          <h2>
            La pureté
            <br />
            des montagnes<span>.</span>
          </h2>

          <div className="side-line" />

          <p>
            Bienvenue dans votre espace de gestion.
            Administrez votre présence digitale avec
            simplicité et précision.
          </p>

          <div className="side-location">
            <Droplets />
            <span>INSPI RÉE PAR LE DJURDJURA</span>
          </div>
        </div>

        <div className="side-coordinate">
          MONT DJURDJURA · ALGÉRIE
        </div>
      </aside>
    </main>
  );
}
