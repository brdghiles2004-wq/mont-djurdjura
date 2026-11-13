
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductsSection.module.css";
import { getPublicProducts } from "@/lib/api";

const translations = {
  fr: {
    eyebrow: "NOTRE GAMME",
    title: "Nos produits",
    description:
      "Découvrez les produits Mont Djurdjura et les différents formats disponibles.",
    footer: "Un format adapté à chaque besoin.",
    link: "Découvrir notre gamme",
    empty: "Nos produits seront bientôt disponibles.",
    imageAlt: "Produit Mont Djurdjura",
  },
  en: {
    eyebrow: "OUR PRODUCT RANGE",
    title: "Our products",
    description:
      "Discover Mont Djurdjura products and the different formats available.",
    footer: "A format for every need.",
    link: "Discover our range",
    empty: "Our products will be available soon.",
    imageAlt: "Mont Djurdjura product",
  },
  ar: {
    eyebrow: "تشكيلتنا",
    title: "منتجاتنا",
    description:
      "اكتشفوا منتجات مون جرجرة والأحجام المختلفة المتاحة.",
    footer: "حجم مناسب لكل احتياج.",
    link: "اكتشفوا تشكيلتنا",
    empty: "ستتوفر منتجاتنا قريباً.",
    imageAlt: "منتج مون جرجرة",
  },
};

export default async function ProductsSection({
  locale = "fr",
}) {
  const currentLocale = ["fr", "en", "ar"].includes(locale)
    ? locale
    : "fr";

  const t = translations[currentLocale];
  const isRTL = currentLocale === "ar";

  let allProducts = [];

  try {
    allProducts = await getPublicProducts(currentLocale);
  } catch (error) {
    console.error("Unable to load homepage products:", error);
  }

  // Accueil: uniquement les produits actifs et vedettes.
  // Aucun nombre maximum de produits.
  const products = allProducts.filter((product) => {
    const isActive =
      product.is_active === true ||
      product.is_active === 1 ||
      product.is_active === "1";

    const isFeatured =
      product.is_featured === true ||
      product.is_featured === 1 ||
      product.is_featured === "1";

    return isActive && isFeatured;
  });

  return (
    <section
      className={styles.section}
      id="produits"
      aria-labelledby="products-heading"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={styles.container}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              {t.eyebrow}
            </span>

            <h2 id="products-heading">
              {t.title}
            </h2>

            <p>{t.description}</p>
          </div>

          <span className={styles.headingNumber}>
            01 — {String(products.length).padStart(2, "0")}
          </span>
        </div>

        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product, index) => {
              const imageUrl = product.image;

              const subtitle =
                product.shortDescription ||
                product.category?.name ||
                product.reference ||
                "";

              return (
                <article
                  className={styles.card}
                  key={product.id}
                >
                  <Link
                    href={`/${currentLocale}/produits/${product.slug}`}
                    style={{
                      display: "block",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <div className={styles.imageArea}>
                      <span className={styles.number}>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className={styles.productImage}>
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={`${product.name} - Mont Djurdjura`}
                            fill
                            unoptimized
                            sizes="(max-width: 600px) 80vw, (max-width: 1000px) 40vw, 20vw"
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#718894",
                              fontSize: "14px",
                              textAlign: "center",
                              padding: "20px",
                            }}
                          >
                            {product.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <div>
                        <h3>{product.name}</h3>
                        {subtitle && <p>{subtitle}</p>}
                      </div>

                      <span
                        className={styles.arrow}
                        aria-hidden="true"
                      >
                        {isRTL ? "←" : "→"}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
              color: "#718894",
            }}
          >
            {t.empty}
          </div>
        )}

        <div className={styles.footer}>
          <p>{t.footer}</p>

          <Link
            href={`/${currentLocale}/produits`}
            className={styles.link}
          >
            {t.link}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
