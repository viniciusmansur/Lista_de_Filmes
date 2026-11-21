import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";
import MovieCard from "../MovieCard";
import styles from "./styles.module.css";

export default function MovieList({
  title,
  movies = [],
  loading = false,
  error = null,
  onRetry,
  emptyMessage,
  renderFooter,
}) {
  let content;

  if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <ErrorMessage onRetry={onRetry} />;
  } else if (movies.length === 0) {
    content = emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null;
  } else {
    content = (
      <ul className={styles.grid}>
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} footer={renderFooter?.(movie)} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {content}
    </section>
  );
}
