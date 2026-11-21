import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "listafilmes:favorites";

const FavoritesContext = createContext(null);

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id != null) : [];
  } catch {
    // JSON inválido ou localStorage indisponível: começa com a lista vazia.
    return [];
  }
}

// Guarda somente os campos necessários para exibir o card sem nova requisição.
function toFavorite(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path ?? null,
    vote_average: movie.vote_average ?? 0,
    release_date: movie.release_date ?? "",
    watched: false,
  };
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Não foi possível salvar os favoritos.", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === movie.id) ? prev : [...prev, toFavorite(movie)],
    );
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((item) => item.id === movie.id)
        ? prev.filter((item) => item.id !== movie.id)
        : [...prev, toFavorite(movie)],
    );
  }, []);

  const toggleWatched = useCallback((id) => {
    setFavorites((prev) =>
      prev.map((item) => (item.id === id ? { ...item, watched: !item.watched } : item)),
    );
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((item) => item.id === id),
    [favorites],
  );

  const value = useMemo(
    () => ({ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, toggleWatched }),
    [favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, toggleWatched],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de <FavoritesProvider>.");
  }
  return context;
}
