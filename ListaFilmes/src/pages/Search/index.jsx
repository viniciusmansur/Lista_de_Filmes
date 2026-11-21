import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import MovieList from "../../components/MovieList";
import { searchMovies } from "../../services/tmdb";
import styles from "./styles.module.css";

const EMPTY_STATE = { q: null, results: [], page: 0, totalPages: 0, error: null };

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const [state, setState] = useState(EMPTY_STATE);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);

  // Primeira página: roda a cada novo termo (ou ao tentar novamente).
  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();

    searchMovies(q, 1, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setState({
          q,
          results: data.results,
          page: data.page,
          totalPages: data.total_pages,
          error: null,
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ ...EMPTY_STATE, q, error });
      });

    return () => controller.abort();
  }, [q, reloadKey]);

  function handleRetry() {
    setState(EMPTY_STATE);
    setReloadKey((key) => key + 1);
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const data = await searchMovies(q, state.page + 1);
      setState((prev) => {
        if (prev.q !== q) return prev; // o termo mudou durante a requisição
        const known = new Set(prev.results.map((movie) => movie.id));
        const fresh = data.results.filter((movie) => !known.has(movie.id));
        return { ...prev, results: [...prev.results, ...fresh], page: data.page };
      });
    } catch (error) {
      console.error(error);
      setMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }

  if (!q) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Buscar filmes</h1>
        <p className={styles.message}>Digite um título na busca para encontrar filmes.</p>
      </div>
    );
  }

  // Enquanto o estado guardado é de outro termo, a primeira página ainda está carregando.
  const loading = state.q !== q;
  const hasMore = !loading && !state.error && state.page < state.totalPages;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Resultados para “{q}”</h1>

      {loading && <Loader />}
      {!loading && state.error && <ErrorMessage onRetry={handleRetry} />}
      {!loading && !state.error && (
        <MovieList
          movies={state.results}
          emptyMessage={`Nenhum filme encontrado para “${q}”. Tente outro título.`}
        />
      )}

      {hasMore && (
        <div className={styles.more}>
          {moreFailed && (
            <p className={styles.message} role="alert">
              Não foi possível carregar mais resultados. Tente novamente.
            </p>
          )}
          <button type="button" className="btn" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}
