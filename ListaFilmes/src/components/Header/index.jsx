import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import SearchBar from "../SearchBar";
import styles from "./styles.module.css";

export default function Header() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { favorites } = useFavorites();

  // O campo reflete o termo atual em /busca e é limpo nas outras páginas (via key).
  const currentTerm = pathname === "/busca" ? (searchParams.get("q") ?? "") : "";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <svg viewBox="0 0 24 24" className={styles.logoIcon} aria-hidden="true">
            <path
              fill="currentColor"
              d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z"
            />
          </svg>
          <span>Lista de Filmes</span>
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          <NavLink
            to="/favoritos"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
          >
            Favoritos
            {favorites.length > 0 && (
              <span className={styles.count}>
                {favorites.length}
                <span className="sr-only"> filmes salvos</span>
              </span>
            )}
          </NavLink>
        </nav>

        <div className={styles.search}>
          <SearchBar key={currentTerm} initialValue={currentTerm} />
        </div>
      </div>
    </header>
  );
}
