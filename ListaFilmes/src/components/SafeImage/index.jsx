import { useState } from "react";
import styles from "./styles.module.css";

// Imagem com placeholder (ícone de filme + título) quando não há src ou o carregamento falha.
export default function SafeImage({ src, alt, fallbackLabel, className = "" }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = !src || failedSrc === src;

  if (failed) {
    return (
      <div className={`${styles.placeholder} ${className}`} role="img" aria-label={alt}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"
          />
        </svg>
        {fallbackLabel && <span className={styles.label}>{fallbackLabel}</span>}
      </div>
    );
  }

  return (
    <img
      className={`${styles.image} ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
