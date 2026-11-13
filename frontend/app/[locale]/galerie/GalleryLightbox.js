
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function GalleryLightbox({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const isOpen = activeIndex !== null;
  const activeImage = isOpen ? images[activeIndex] : null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(
    (event) => {
      event?.stopPropagation();

      setActiveIndex((current) => {
        if (current === null || images.length === 0) return null;
        return (current - 1 + images.length) % images.length;
      });
    },
    [images.length]
  );

  const showNext = useCallback(
    (event) => {
      event?.stopPropagation();

      setActiveIndex((current) => {
        if (current === null || images.length === 0) return null;
        return (current + 1) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showNext();
      if (event.key === "ArrowRight") showPrevious();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox, showNext, showPrevious]);

  if (!images.length) return null;

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((image, index) => (
          <article
            className={styles.galleryCard}
            key={image.id}
          >
            <button
              type="button"
              className={styles.imageButton}
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir l'image ${image.title || index + 1} en grand`}
            >
              <div className={styles.galleryVisual}>
                <Image
                  src={image.imageUrl}
                  alt={
                    image.alt_text ||
                    image.title ||
                    "Mont Djurdjura"
                  }
                  width={1200}
                  height={800}
                  unoptimized
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                />

                <span className={styles.cardVisualNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.zoomIndicator}>
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="m16 16 4 4M10.5 7v7M7 10.5h7" />
                  </svg>
                </span>
              </div>
            </button>

            <div className={styles.cardContent}>
              <div className={styles.cardMeta}>
                <span>
                  {image.category || "MONT DJURDJURA"}
                </span>

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3>{image.title}</h3>

              {image.description && (
                <p>{image.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {isOpen && activeImage && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Agrandissement de l'image"
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Fermer"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxPrevious}`}
                onClick={showPrevious}
                aria-label="Image précédente"
              >
                ‹
              </button>

              <button
                type="button"
                className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                onClick={showNext}
                aria-label="Image suivante"
              >
                ›
              </button>
            </>
          )}

          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              className={styles.lightboxImage}
              src={activeImage.imageUrl}
              alt={
                activeImage.alt_text ||
                activeImage.title ||
                "Mont Djurdjura"
              }
              width={1600}
              height={1200}
              unoptimized
            />

            {(activeImage.title || activeImage.description) && (
              <div className={styles.lightboxCaption}>
                {activeImage.title && (
                  <h3>{activeImage.title}</h3>
                )}

                {activeImage.description && (
                  <p>{activeImage.description}</p>
                )}
              </div>
            )}

            <span className={styles.lightboxCounter}>
              {String(activeIndex + 1).padStart(2, "0")}
              {" / "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
