import MovieList from "../../components/MovieList";
import { useFetch } from "../../hooks/useFetch";
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "../../services/tmdb";
import styles from "./styles.module.css";

export default function Home() {
  // Cada seção carrega de forma independente, com loading e erro próprios.
  const popular = useFetch((signal) => getPopularMovies(1, signal), []);
  const topRated = useFetch((signal) => getTopRatedMovies(1, signal), []);
  const nowPlaying = useFetch((signal) => getNowPlayingMovies(1, signal), []);

  return (
    <div className={styles.page}>
      <h1 className="sr-only">Filmes recomendados</h1>
      <MovieList
        title="Populares"
        movies={popular.data?.results}
        loading={popular.loading}
        error={popular.error}
        onRetry={popular.refetch}
      />
      <MovieList
        title="Mais bem avaliados"
        movies={topRated.data?.results}
        loading={topRated.loading}
        error={topRated.error}
        onRetry={topRated.refetch}
      />
      <MovieList
        title="Em cartaz"
        movies={nowPlaying.data?.results}
        loading={nowPlaying.loading}
        error={nowPlaying.error}
        onRetry={nowPlaying.refetch}
      />
    </div>
  );
}
