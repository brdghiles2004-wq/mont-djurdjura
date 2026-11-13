
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import styles from "./page.module.css";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const formTranslations = {
  fr: {
    name: "Nom complet",
    namePlaceholder: "Votre nom",
    company: "Entreprise",
    companyPlaceholder: "Nom de votre entreprise",
    email: "Adresse email",
    emailPlaceholder: "exemple@email.com",
    phone: "Téléphone",
    phonePlaceholder: "Votre numéro de téléphone",
    subject: "Sujet",
    subjectPlaceholder: "Sujet de votre demande",
    message: "Votre message",
    messagePlaceholder: "Écrivez votre message ici...",
    send: "Envoyer le message",
    sending: "Envoi en cours...",
    required: "Les champs marqués d'un astérisque (*) sont obligatoires.",
    success: "Votre message a été envoyé avec succès. Merci de nous avoir contactés.",
    validation: "Veuillez vérifier les informations saisies.",
    tooMany: "Trop de tentatives. Veuillez patienter avant de réessayer.",
    error: "Une erreur est survenue. Veuillez réessayer.",
    network: "Impossible de contacter le serveur. Veuillez réessayer.",
    productSubject: "Demande d'information",
    selectedProduct: "Produit concerné",
  },

  en: {
    name: "Full name",
    namePlaceholder: "Your name",
    company: "Company",
    companyPlaceholder: "Your company name",
    email: "Email address",
    emailPlaceholder: "example@email.com",
    phone: "Phone",
    phonePlaceholder: "Your phone number",
    subject: "Subject",
    subjectPlaceholder: "Subject of your enquiry",
    message: "Your message",
    messagePlaceholder: "Write your message here...",
    send: "Send message",
    sending: "Sending...",
    required: "Fields marked with an asterisk (*) are required.",
    success: "Your message has been sent successfully. Thank you for contacting us.",
    validation: "Please check the information you entered.",
    tooMany: "Too many attempts. Please wait before trying again.",
    error: "An error occurred. Please try again.",
    network: "Unable to contact the server. Please try again.",
    productSubject: "Product enquiry",
    selectedProduct: "Selected product",
  },

  ar: {
    name: "الاسم الكامل",
    namePlaceholder: "أدخل اسمك",
    company: "الشركة",
    companyPlaceholder: "اسم شركتك",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "أدخل رقم هاتفك",
    subject: "الموضوع",
    subjectPlaceholder: "موضوع طلبك",
    message: "رسالتك",
    messagePlaceholder: "اكتب رسالتك هنا...",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال...",
    required: "الحقول المعلّمة بنجمة (*) إجبارية.",
    success: "تم إرسال رسالتك بنجاح. شكرًا لتواصلكم معنا.",
    validation: "يرجى التحقق من المعلومات المدخلة.",
    tooMany: "محاولات كثيرة. يرجى الانتظار قبل إعادة المحاولة.",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    network: "تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
    productSubject: "طلب معلومات حول المنتج",
    selectedProduct: "المنتج المعني",
  },
};

export default function ContactForm({
  locale = "fr",
  productName = "",
}) {
  const currentLocale = formTranslations[locale] ? locale : "fr";

  const t = formTranslations[currentLocale];
  const isArabic = currentLocale === "ar";

  const initialSubject = productName
    ? `${t.productSubject} — ${productName}`
    : "";

  const [form, setForm] = useState({
    ...initialForm,
    subject: initialSubject,
  });

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    setStatus({
      type: "",
      message: "",
    });

    try {
      const data = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      setStatus({
        type: "success",
        message: data?.message || t.success,
      });

      setForm({
        ...initialForm,
        subject: initialSubject,
      });
    } catch (error) {
      let errorMessage = error.message || t.network;

      if (error.status === 422) {
        const firstError = Object.values(error.errors || {}).flat()[0];
        errorMessage = firstError || t.validation;
      } else if (error.status === 429) {
        errorMessage = t.tooMany;
      } else if (!error.status) {
        errorMessage = t.network;
      }

      setStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className={styles.contactForm}
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {productName && (
        <div className={styles.selectedProduct}>
          <span>{t.selectedProduct}</span>
          <strong>{productName}</strong>
        </div>
      )}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="contact-name">
            {t.name} <span>*</span>
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder={t.namePlaceholder}
            value={form.name}
            onChange={handleChange}
            required
            maxLength={150}
            autoComplete="name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-company">{t.company}</label>

          <input
            id="contact-company"
            name="company"
            type="text"
            placeholder={t.companyPlaceholder}
            value={form.company}
            onChange={handleChange}
            maxLength={150}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="contact-email">
            {t.email} <span>*</span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder={t.emailPlaceholder}
            value={form.email}
            onChange={handleChange}
            required
            maxLength={255}
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-phone">{t.phone}</label>

          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder={t.phonePlaceholder}
            value={form.phone}
            onChange={handleChange}
            maxLength={30}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="contact-subject">
          {t.subject} <span>*</span>
        </label>

        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder={t.subjectPlaceholder}
          value={form.subject}
          onChange={handleChange}
          required
          maxLength={150}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="contact-message">
          {t.message} <span>*</span>
        </label>

        <textarea
          id="contact-message"
          name="message"
          placeholder={t.messagePlaceholder}
          rows={6}
          value={form.message}
          onChange={handleChange}
          required
          maxLength={5000}
        />
      </div>

      {status.message && (
        <div
          className={`${styles.formStatus} ${
            status.type === "success"
              ? styles.successStatus
              : styles.errorStatus
          }`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? t.sending : t.send}
        {!loading && <span>{isArabic ? "←" : "→"}</span>}
      </button>

      <p className={styles.formNote}>{t.required}</p>
    </form>
  );
}
