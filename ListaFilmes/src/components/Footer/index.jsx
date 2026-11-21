import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>Este produto usa a API do TMDB, mas não é endossado ou certificado pelo TMDB.</p>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          themoviedb.org
        </a>
      </div>
    </footer>
  );
}
