import { Link } from "react-router-dom";
import { getImageUrl } from "../../services/tmdb";
import { formatRating, getYear } from "../../utils/formatters";
import FavoriteButton from "../FavoriteButton";
import SafeImage from "../SafeImage";
import styles from "./styles.module.css";

// `footer` recebe ações extras (ex.: marcar como assistido na página de favoritos).
export default function MovieCard({ movie, footer }) {
  const year = getYear(movie.release_date);

  return (
    <article className={styles.card}>
      <div className={styles.poster}>
        <SafeImage
          src={getImageUrl(movie.poster_path, "w342")}
          alt={`Pôster de ${movie.title}`}
          fallbackLabel={movie.title}
        />
        <div className={styles.favorite}>
          <FavoriteButton movie={movie} />
        </div>
        {movie.watched && (
          <span className={styles.watched}>
            <svg viewBox="0 0 24 24" className={styles.watchedIcon} aria-hidden="true">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Assistido
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>
          {/* O ::after do link cobre o card inteiro, tornando-o clicável sem aninhar botões em <a> */}
          <Link to={`/filme/${movie.id}`} className={styles.link}>
            {movie.title}
          </Link>
        </h3>
        <p className={styles.meta}>
          <span className={styles.rating}>
            <svg viewBox="0 0 24 24" className={styles.star} aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
              />
            </svg>
            <span className="sr-only">Nota </span>
            {formatRating(movie.vote_average)}
          </span>
          {year && <span className={styles.year}>{year}</span>}
        </p>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </article>
  );
}
