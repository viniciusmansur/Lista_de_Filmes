import { useFavorites } from "../../context/FavoritesContext";
import styles from "./styles.module.css";

export default function FavoriteButton({ movie, size = "md" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(movie.id);
  const action = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
  const large = size === "lg";

  function handleClick(event) {
    // Evita acionar o link do card ao favoritar.
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(movie);
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${large ? styles.large : styles.medium} ${active ? styles.active : ""}`}
      aria-pressed={active}
      aria-label={large ? action : `${action}: ${movie.title}`}
      onClick={handleClick}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.7 4.5 6.4 4.5c2.1 0 3.8 1.1 5.6 3.2 1.8-2.1 3.5-3.2 5.6-3.2 3.7 0 5.5 3.8 4 7.2C19.5 16.4 12 21 12 21z"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {large && <span>{action}</span>}
    </button>
  );
}
