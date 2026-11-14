
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const API_ORIGIN = API_URL
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

const API_BASE = `${API_ORIGIN}/api`;

/* =========================
   PUBLIC PRODUCTS
========================= */

function normalizeLocale(locale = "fr") {
  return ["fr", "en", "ar"].includes(locale) ? locale : "fr";
}

function normalizeProduct(product) {
  if (!product) return null;

  let image = null;

  if (product.main_image) {
    if (/^https?:\/\//i.test(product.main_image)) {
      image = product.main_image;
    } else {
      const path = product.main_image
        .replace(/^\/+/, "")
        .replace(/^storage\/+/i, "");

      image = `${API_ORIGIN}/storage/${path}`;
    }
  }

  return {
    ...product,
    id: product.slug,
    number: String(product.sort_order ?? product.id).padStart(2, "0"),
    image,
    label: product.category?.name || "Mont Djurdjura",
    shortDescription:
      product.short_description || product.description || "",
    description:
      product.description || product.short_description || "",
    capacity: product.capacity || null,
    packaging: product.packaging || null,
  };
}

/**
 * Public products.
 * Locale: fr | en | ar
 * Revalidate every 5 minutes.
 */
export async function getPublicProducts(locale = "fr") {
  try {
    const language = normalizeLocale(locale);

    const response = await fetch(
      `${API_BASE}/products?locale=${language}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      console.error("Products API error:", response.status);
      return [];
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      return [];
    }

    return result.data.map(normalizeProduct).filter(Boolean);
  } catch (error) {
    console.error("Unable to load products:", error);
    return [];
  }
}

/**
 * Public product details.
 * Locale: fr | en | ar
 * Revalidate every 5 minutes.
 */
export async function getPublicProduct(slug, locale = "fr") {
  try {
    const language = normalizeLocale(locale);

    const response = await fetch(
      `${API_BASE}/products/${encodeURIComponent(slug)}?locale=${language}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error("Product API error:", response.status);
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    return normalizeProduct(result.data);
  } catch (error) {
    console.error("Unable to load product:", error);
    return null;
  }
}

/* =========================
   API HELPERS
========================= */

function normalizeEndpoint(endpoint) {
  const cleanEndpoint = String(endpoint).replace(/^\/+/, "");
  const withoutApiPrefix = cleanEndpoint.replace(/^api\/+/i, "");

  return `${API_BASE}/${withoutApiPrefix}`;
}

function getCookie(name) {
  if (typeof document === "undefined") {
    return null;
  }

  const row = document.cookie
    .split("; ")
    .find((value) => value.startsWith(`${name}=`));

  return row
    ? decodeURIComponent(row.substring(name.length + 1))
    : null;
}

/* =========================
   CSRF PROTECTION
========================= */

export async function getCsrfCookie() {
  const response = await fetch(
    `${API_ORIGIN}/sanctum/csrf-cookie`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to initialize CSRF protection.");
  }
}

/* =========================
   MAIN API FETCH
========================= */

export async function apiFetch(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(!isFormData && body
      ? {
          "Content-Type": "application/json",
        }
      : {}),
    ...options.headers,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = getCookie("XSRF-TOKEN");

    if (csrfToken) {
      headers["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  const response = await fetch(normalizeEndpoint(endpoint), {
    ...options,
    method,
    credentials: "include",
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed (${response.status})`
    );

    error.status = response.status;
    error.errors = data?.errors || {};

    throw error;
  }

  return data;
}

/* =========================
   ADMIN AUTHENTICATION
========================= */

export async function loginAdmin(credentials) {
  await getCsrfCookie();

  return apiFetch("/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function getAdminUser() {
  return apiFetch("/admin/user");
}

export async function logoutAdmin() {
  return apiFetch("/admin/logout", {
    method: "POST",
  });
}
