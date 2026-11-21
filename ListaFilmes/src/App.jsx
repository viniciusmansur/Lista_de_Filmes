import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { isTmdbConfigured } from "./services/tmdb";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ErrorMessage from "./components/ErrorMessage";
import AppRoutes from "./routes";

export default function App() {
  const { pathname, search } = useLocation();

  // Volta ao topo a cada troca de rota ou de busca.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <FavoritesProvider>
      <Header />
      <main>
        {isTmdbConfigured ? (
          <AppRoutes />
        ) : (
          <ErrorMessage
            title="Configuração pendente"
            message="Defina a variável VITE_TMDB_TOKEN no arquivo .env com o seu Read Access Token do TMDB e reinicie o servidor (npm run dev). Os passos estão no README."
          />
        )}
      </main>
      <Footer />
    </FavoritesProvider>
  );
}
