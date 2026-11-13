
"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

const translations = {
  fr: {
    name: "Nom complet",
    company: "Entreprise",
    email: "Adresse e-mail",
    phone: "Téléphone",
    product: "Produit souhaité",
    quantity: "Quantité souhaitée",
    requestType: "Type de demande",
    message: "Informations complémentaires",

    namePlaceholder: "Votre nom et prénom",
    companyPlaceholder: "Nom de votre entreprise (facultatif)",
    emailPlaceholder: "exemple@email.com",
    phonePlaceholder: "+213 ...",
    productPlaceholder: "Ex. : Eau minérale 1,5 L",
    quantityPlaceholder: "Ex. : 1000",
    messagePlaceholder:
      "Décrivez votre besoin, votre projet ou toute information utile...",

    requestTypes: [
      { value: "", label: "Sélectionnez un type de demande" },
      { value: "achat_gros", label: "Achat en gros" },
      { value: "achat_detail", label: "Achat au détail" },
      { value: "distribution", label: "Distribution / Partenariat" },
      { value: "autre", label: "Autre demande" },
    ],

    submit: "Envoyer ma demande",
    sending: "Envoi en cours...",
    success:
      "Votre demande de devis a été envoyée avec succès. Notre équipe vous contactera prochainement.",
    error:
      "Une erreur est survenue lors de l'envoi. Veuillez réessayer ultérieurement.",
    required: "Veuillez remplir tous les champs obligatoires.",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    invalidQuantity:
      "Veuillez saisir une quantité entière entre 1 et 1 000 000.",
    requiredNote: "Les champs marqués d'un * sont obligatoires.",
  },

  en: {
    name: "Full name",
    company: "Company",
    email: "Email address",
    phone: "Phone",
    product: "Desired product",
    quantity: "Desired quantity",
    requestType: "Request type",
    message: "Additional information",

    namePlaceholder: "Your full name",
    companyPlaceholder: "Your company name (optional)",
    emailPlaceholder: "example@email.com",
    phonePlaceholder: "+213 ...",
    productPlaceholder: "e.g. Mineral water 1.5 L",
    quantityPlaceholder: "e.g. 1000",
    messagePlaceholder:
      "Describe your needs, project or any useful information...",

    requestTypes: [
      { value: "", label: "Select a request type" },
      { value: "achat_gros", label: "Wholesale purchase" },
      { value: "achat_detail", label: "Retail purchase" },
      { value: "distribution", label: "Distribution / Partnership" },
      { value: "autre", label: "Other request" },
    ],

    submit: "Send my request",
    sending: "Sending...",
    success:
      "Your quote request has been sent successfully. Our team will contact you shortly.",
    error:
      "An error occurred while sending your request. Please try again later.",
    required: "Please fill in all required fields.",
    invalidEmail: "Please enter a valid email address.",
    invalidQuantity:
      "Please enter a whole number between 1 and 1,000,000.",
    requiredNote: "Fields marked with * are required.",
  },

  ar: {
    name: "الاسم الكامل",
    company: "الشركة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    product: "المنتج المطلوب",
    quantity: "الكمية المطلوبة",
    requestType: "نوع الطلب",
    message: "معلومات إضافية",

    namePlaceholder: "الاسم واللقب",
    companyPlaceholder: "اسم الشركة (اختياري)",
    emailPlaceholder: "example@email.com",
    phonePlaceholder: "+213 ...",
    productPlaceholder: "مثال: مياه معدنية 1.5 لتر",
    quantityPlaceholder: "مثال: 1000",
    messagePlaceholder:
      "اشرح احتياجاتك أو مشروعك أو أي معلومات مفيدة...",

    requestTypes: [
      { value: "", label: "اختر نوع الطلب" },
      { value: "achat_gros", label: "شراء بالجملة" },
      { value: "achat_detail", label: "شراء بالتجزئة" },
      { value: "distribution", label: "توزيع / شراكة" },
      { value: "autre", label: "طلب آخر" },
    ],

    submit: "إرسال الطلب",
    sending: "جارٍ الإرسال...",
    success:
      "تم إرسال طلب عرض السعر بنجاح. سيتواصل معكم فريقنا قريباً.",
    error:
      "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى لاحقاً.",
    required: "يرجى ملء جميع الحقول الإلزامية.",
    invalidEmail: "يرجى إدخال بريد إلكتروني صحيح.",
    invalidQuantity:
      "يرجى إدخال كمية صحيحة بين 1 و1,000,000.",
    requiredNote: "الحقول التي تحمل علامة * إلزامية.",
  },
};

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: "",
  quantity: "",
  request_type: "",
  message: "",
};

export default function DevisForm({ locale = "fr" }) {
  const currentLocale = translations[locale] ? locale : "fr";
  const t = translations[currentLocale];
  const isRTL = currentLocale === "ar";

  const [form, setForm] = useState({ ...initialForm });
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (feedback) {
      setFeedback("");
      if (status !== "sending") {
        setStatus("idle");
      }
    }
  }

  function validateForm() {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.product.trim() ||
      !form.quantity.trim() ||
      !form.request_type
    ) {
      setFeedback(t.required);
      setStatus("error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      setFeedback(t.invalidEmail);
      setStatus("error");
      return false;
    }

    if (!/^\d+$/.test(form.quantity.trim())) {
      setFeedback(t.invalidQuantity);
      setStatus("error");
      return false;
    }

    const quantity = Number(form.quantity);

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 1000000
    ) {
      setFeedback(t.invalidQuantity);
      setStatus("error");
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (status === "sending") return;

    setFeedback("");

    if (!validateForm()) return;

    setStatus("sending");

    try {
      const payload = {
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        product: form.product.trim(),
        quantity: Number(form.quantity.trim()),
        request_type: form.request_type,
        message: form.message.trim(),
      };

      const data = await apiFetch("/devis", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setStatus("success");
      setFeedback(data?.message || t.success);
      setForm({ ...initialForm });
    } catch (error) {
      console.error("Devis submission error:", error);
      setStatus("error");
      setFeedback(error?.message || t.error);
    }
  }

  return (
    <form
      className="devisForm"
      onSubmit={handleSubmit}
      dir={isRTL ? "rtl" : "ltr"}
      noValidate
    >
      <div className="formFields">
        <div className="formGroup">
          <label htmlFor="devis-name">
            {t.name} <span className="requiredMark">*</span>
          </label>
          <input
            id="devis-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={t.namePlaceholder}
            autoComplete="name"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-company">{t.company}</label>
          <input
            id="devis-company"
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder={t.companyPlaceholder}
            autoComplete="organization"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-email">
            {t.email} <span className="requiredMark">*</span>
          </label>
          <input
            id="devis-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t.emailPlaceholder}
            autoComplete="email"
            required
            dir="ltr"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-phone">
            {t.phone} <span className="requiredMark">*</span>
          </label>
          <input
            id="devis-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={t.phonePlaceholder}
            autoComplete="tel"
            required
            dir="ltr"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-product">
            {t.product} <span className="requiredMark">*</span>
          </label>
          <input
            id="devis-product"
            type="text"
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder={t.productPlaceholder}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-quantity">
            {t.quantity} <span className="requiredMark">*</span>
          </label>
          <input
            id="devis-quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder={t.quantityPlaceholder}
            min="1"
            max="1000000"
            step="1"
            inputMode="numeric"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="devis-request-type">
            {t.requestType} <span className="requiredMark">*</span>
          </label>
          <select
            id="devis-request-type"
            name="request_type"
            value={form.request_type}
            onChange={handleChange}
            required
          >
            {t.requestTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
          <label htmlFor="devis-message">{t.message}</label>
          <textarea
            id="devis-message"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={t.messagePlaceholder}
            rows={5}
          />
        </div>
      </div>

      <p style={{ color: "#81949f", fontSize: "12px", margin: 0 }}>
        {t.requiredNote}
      </p>

      {feedback && (
        <div
          className={`formStatus ${
            status === "success" ? "success" : "error"
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      )}

      <button
        type="submit"
        className="submitButton"
        disabled={status === "sending"}
      >
        <span>{status === "sending" ? t.sending : t.submit}</span>
        <span aria-hidden="true">{isRTL ? "←" : "→"}</span>
      </button>
    </form>
  );
}
