const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const TOKEN = (import.meta.env.VITE_TMDB_TOKEN ?? "").trim();

// Falso quando o .env não tem o token; o App usa isso para exibir a orientação de configuração.
export const isTmdbConfigured = TOKEN.length > 0;

export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

async function request(path, params = {}, signal) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "pt-BR");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    signal,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = body.status_message ?? "";
    } catch {
      // Corpo da resposta não é JSON; mantém só o status.
    }
    throw new TmdbError(
      `Falha na requisição ao TMDB (${response.status}) em ${path}${detail ? `: ${detail}` : ""}`,
      response.status,
    );
  }

  return response.json();
}

export function getPopularMovies(page = 1, signal) {
  return request("/movie/popular", { page, region: "BR" }, signal);
}

export function getTopRatedMovies(page = 1, signal) {
  return request("/movie/top_rated", { page, region: "BR" }, signal);
}

export function getNowPlayingMovies(page = 1, signal) {
  return request("/movie/now_playing", { page, region: "BR" }, signal);
}

// Uma única requisição traz detalhes, elenco e vídeos.
export function getMovieDetails(id, signal) {
  return request(
    `/movie/${encodeURIComponent(id)}`,
    {
      append_to_response: "credits,videos",
      include_video_language: "pt,en,null",
    },
    signal,
  );
}

export function searchMovies(query, page = 1, signal) {
  return request(
    "/search/movie",
    { query, page, include_adult: false },
    signal,
  );
}

export function getImageUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}
