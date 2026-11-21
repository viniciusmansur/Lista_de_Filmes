import { useState } from "react";
import { Link } from "react-router-dom";
import MovieList from "../../components/MovieList";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "./styles.module.css";

const FILTERS = [
  { id: "todos", label: "Todos", empty: "Nenhum filme salvo." },
  { id: "assistir", label: "Para assistir", empty: "Você já assistiu a todos os filmes salvos." },
  { id: "assistidos", label: "Assistidos", empty: "Você ainda não marcou nenhum filme como assistido." },
];

function applyFilter(favorites, filter) {
  if (filter === "assistir") return favorites.filter((movie) => !movie.watched);
  if (filter === "assistidos") return favorites.filter((movie) => movie.watched);
  return favorites;
}

export default function Favorites() {
  const { favorites, toggleWatched } = useFavorites();
  const [filter, setFilter] = useState("todos");

  if (favorites.length === 0) {
    return (
      <section className={styles.empty}>
        <h1 className={styles.emptyTitle}>Você ainda não salvou nenhum filme.</h1>
        <p className={styles.emptyText}>
          Toque no coração de um filme para guardá-lo aqui e acompanhar o que já assistiu.
        </p>
        <Link to="/" className="btn">
          Descobrir filmes
        </Link>
      </section>
    );
  }

  const current = FILTERS.find((item) => item.id === filter);
  const visible = applyFilter(favorites, filter);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Meus favoritos</h1>

      <div className={styles.filters} role="group" aria-label="Filtrar filmes">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.filter} ${filter === item.id ? styles.filterActive : ""}`}
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
            <span className={styles.filterCount}>{applyFilter(favorites, item.id).length}</span>
          </button>
        ))}
      </div>

      <MovieList
        movies={visible}
        emptyMessage={current.empty}
        renderFooter={(movie) => (
          <button
            type="button"
            className={`${styles.watchedButton} ${movie.watched ? styles.watchedButtonOn : ""}`}
            aria-pressed={movie.watched}
            onClick={() => toggleWatched(movie.id)}
          >
            {movie.watched ? "Desmarcar" : "Marcar como assistido"}
          </button>
        )}
      />
    </div>
  );
}
