import { Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.text}>
        O endereço que você acessou não existe ou foi movido. Volte para a Home e escolha um filme.
      </p>
      <Link to="/" className="btn">
        Voltar para a Home
      </Link>
    </section>
  );
}
