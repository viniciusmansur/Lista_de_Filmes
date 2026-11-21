import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import FavoriteButton from "../../components/FavoriteButton";
import Loader from "../../components/Loader";
import SafeImage from "../../components/SafeImage";
import { useFetch } from "../../hooks/useFetch";
import { getImageUrl, getMovieDetails } from "../../services/tmdb";
import {
  formatCurrency,
  formatDate,
  formatRating,
  formatRuntime,
  formatVotes,
} from "../../utils/formatters";
import styles from "./styles.module.css";

const MAX_CAST = 12;

// Prefere o trailer em português e, na falta dele, o em inglês.
function pickTrailer(videos = []) {
  const trailers = videos.filter((video) => video.site === "YouTube" && video.type === "Trailer");
  return (
    trailers.find((video) => video.iso_639_1 === "pt") ??
    trailers.find((video) => video.iso_639_1 === "en") ??
    null
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: movie, loading, error, refetch } = useFetch(
    (signal) => getMovieDetails(id, signal),
    [id],
  );

  function handleBack() {
    // Sem histórico anterior no app (acesso direto pelo link), volta para a Home.
    if (location.key === "default") navigate("/");
    else navigate(-1);
  }

  if (loading) return <Loader />;

  if (error?.status === 404) {
    return (
      <section className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Filme não encontrado</h1>
        <p className={styles.notFoundText}>
          Não encontramos um filme com esse endereço. Ele pode ter sido removido ou o link está
          incorreto.
        </p>
        <Link to="/" className="btn">
          Voltar para a Home
        </Link>
      </section>
    );
  }

  if (error || !movie) return <ErrorMessage onRetry={refetch} />;

  const cast = (movie.credits?.cast ?? []).slice(0, MAX_CAST);
  const trailer = pickTrailer(movie.videos?.results);
  const releaseDate = formatDate(movie.release_date);
  const runtime = formatRuntime(movie.runtime);
  const hasDifferentOriginalTitle = movie.original_title && movie.original_title !== movie.title;

  return (
    <article className={styles.page}>
      <div className={styles.backdrop}>
        <SafeImage
          src={getImageUrl(movie.backdrop_path, "w1280")}
          alt={`Imagem de fundo de ${movie.title}`}
          fallbackLabel={movie.title}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.poster}>
          <SafeImage
            src={getImageUrl(movie.poster_path, "w500")}
            alt={`Pôster de ${movie.title}`}
            fallbackLabel={movie.title}
          />
        </div>

        <div className={styles.info}>
          <button type="button" className={`btn ${styles.back}`} onClick={handleBack}>
            <svg viewBox="0 0 24 24" className={styles.backIcon} aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Voltar
          </button>

          <h1 className={styles.title}>{movie.title}</h1>
          {hasDifferentOriginalTitle && (
            <p className={styles.original}>Título original: {movie.original_title}</p>
          )}
          {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

          <ul className={styles.meta}>
            <li className={styles.rating}>
              <svg viewBox="0 0 24 24" className={styles.star} aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"
                />
              </svg>
              <span className="sr-only">Nota </span>
              {formatRating(movie.vote_average)}
              <span className={styles.votes}>({formatVotes(movie.vote_count)} votos)</span>
            </li>
            {releaseDate && (
              <li>
                <span className="sr-only">Lançamento: </span>
                {releaseDate}
              </li>
            )}
            {runtime && (
              <li>
                <span className="sr-only">Duração: </span>
                {runtime}
              </li>
            )}
          </ul>

          {movie.genres?.length > 0 && (
            <ul className={styles.genres} aria-label="Gêneros">
              {movie.genres.map((genre) => (
                <li key={genre.id} className={styles.genre}>
                  {genre.name}
                </li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <FavoriteButton movie={movie} size="lg" />
          </div>

          <section className={styles.block}>
            <h2 className={styles.heading}>Sinopse</h2>
            <p className={styles.overview}>
              {movie.overview || "Sinopse não disponível em português."}
            </p>
          </section>

          {(movie.budget > 0 || movie.revenue > 0) && (
            <dl className={styles.facts}>
              {movie.budget > 0 && (
                <div className={styles.fact}>
                  <dt>Orçamento</dt>
                  <dd>{formatCurrency(movie.budget)}</dd>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className={styles.fact}>
                  <dt>Receita</dt>
                  <dd>{formatCurrency(movie.revenue)}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      <div className={styles.sections}>
        {cast.length > 0 && (
          <section className={styles.block}>
            <h2 className={styles.heading}>Elenco principal</h2>
            <ul className={styles.cast}>
              {cast.map((person) => (
                <li key={person.credit_id ?? person.id} className={styles.person}>
                  <div className={styles.photo}>
                    <SafeImage
                      src={getImageUrl(person.profile_path, "w185")}
                      alt={`Foto de ${person.name}`}
                      fallbackLabel={person.name}
                    />
                  </div>
                  <p className={styles.personName}>{person.name}</p>
                  {person.character && <p className={styles.character}>{person.character}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {trailer && (
          <section className={styles.block}>
            <h2 className={styles.heading}>Trailer</h2>
            <div className={styles.video}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                title={`Trailer de ${movie.title}`}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
